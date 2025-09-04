"use client"

import { useEffect, useState } from "react"
import { orpc } from "@/orpc/client"
import type { GenerateEventsRo } from "@/schemas/ai"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

// Import the event keys factory for cache invalidation
import { eventKeys } from "./event"

// AI Query keys factory
export const aiKeys = {
  all: ["ai"] as const,
  generations: () => [...aiKeys.all, "generation"] as const,
  generation: (sessionId: string) =>
    [...aiKeys.generations(), sessionId] as const,
  progress: (sessionId: string) =>
    [...aiKeys.all, "progress", sessionId] as const,
}

// Generate Events Hook (legacy)
export function useGenerateEvents() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: { userInput: string }) =>
      orpc.ai.generateEvents.call(input),
    onSuccess: (data: GenerateEventsRo) => {
      if (data.success) {
        queryClient.invalidateQueries({
          queryKey: eventKeys.lists(),
        })
      }
    },
    onError: (error) => {
      console.error("Failed to generate events with AI:", error)
    },
  })
}

// Initiate Event Generation Hook (for real-time progress tracking)
export function useInitiateEventGeneration() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: { userInput: string }) =>
      orpc.ai.initiateEventGeneration.call(input),
    onSuccess: (data) => {
      if (data.success) {
        console.log(
          "🚀 Event generation initiated, session ID:",
          data.processingSessionId
        )
        queryClient.invalidateQueries({
          queryKey: eventKeys.lists(),
        })
      }
    },
    onError: (error) => {
      console.error("Failed to initiate event generation:", error)
    },
  })
}

// Real-time Progress Hook using Server-Sent Events (SSE)
export function useStreamingProgress(
  processingSessionId: string | null,
  enabled: boolean = false
) {
  const queryClient = useQueryClient()
  const [progressData, setProgressData] = useState<{
    progress: number
    stage: string
    status: string
    timestamp: string
  } | null>(null)
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    if (!enabled || !processingSessionId) {
      setProgressData(null)
      setIsConnected(false)
      return
    }

    console.log("📡 Starting SSE connection for session:", processingSessionId)

    // Create EventSource for SSE
    const eventSource = new EventSource(
      `/api/progress-stream/${processingSessionId}`
    )

    eventSource.onopen = () => {
      console.log("✅ SSE connection established")
      setIsConnected(true)
    }

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)
        console.log("📊 SSE Progress update:", data)
        setProgressData(data)

        // Update the query cache with new data
        queryClient.setQueryData(
          [...aiKeys.progress(processingSessionId), "sse"],
          data
        )

        // Close connection when completed
        if (data.status === "COMPLETED" || data.status === "FAILED") {
          console.log("🏁 SSE connection closing - process complete")
          eventSource.close()
          setIsConnected(false)
        }
      } catch (error) {
        console.error("❌ SSE data parsing error:", error)
      }
    }

    eventSource.onerror = (error) => {
      console.error("❌ SSE connection error:", error)
      setIsConnected(false)
      eventSource.close()
    }

    // Cleanup on unmount
    return () => {
      console.log("🧹 Cleaning up SSE connection")
      eventSource.close()
      setIsConnected(false)
    }
  }, [processingSessionId, enabled, queryClient])

  return {
    data: progressData,
    isLoading: enabled && !!processingSessionId && !progressData,
    error: null,
    isConnected,
  }
}

// Legacy Progress Hook - kept for backward compatibility (not recommended)
export function useProgress(
  processingSessionId: string | null,
  enabled: boolean = false
) {
  return useQuery({
    queryKey: aiKeys.progress(processingSessionId || ""),
    queryFn: async () => {
      if (!processingSessionId) {
        return null
      }
      try {
        const result = await orpc.ai.getProgress.call({ processingSessionId })
        return result
      } catch (error) {
        console.error("❌ Progress fetch error:", error)
        throw error
      }
    },
    enabled: enabled && !!processingSessionId,
    refetchInterval: enabled && !!processingSessionId ? 2000 : false, // Slow polling as fallback
    staleTime: 0,
    retry: false,
  })
}
