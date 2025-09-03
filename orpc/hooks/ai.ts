"use client"

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

// Generate Events Hook
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

// Regenerate Events Hook
export function useRegenerateEvents() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: { processingSessionId: string; context?: string }) =>
      orpc.ai.regenerateEvents.call(input),
    onSuccess: (data: GenerateEventsRo) => {
      if (data.success) {
        // Invalidate event lists since we modified events
        queryClient.invalidateQueries({
          queryKey: eventKeys.lists(),
        })
      }
    },
    onError: (error) => {
      console.error("Failed to regenerate events with AI:", error)
    },
  })
}

// Progress Hook
export function useProgress(
  processingSessionId: string | null,
  enabled: boolean = false
) {
  return useQuery({
    queryKey: aiKeys.progress(processingSessionId || ""),
    queryFn: async () => {
      if (!processingSessionId) {
        if (process.env.NODE_ENV === "development") {
          console.log("⚠️ No processing session ID provided")
        }
        return null
      }
      if (process.env.NODE_ENV === "development") {
        console.log("🔍 Fetching progress for session:", processingSessionId)
      }
      try {
        const result = await orpc.ai.getProgress.call({ processingSessionId })
        if (process.env.NODE_ENV === "development") {
          console.log("📊 Progress result:", result)
        }
        return result
      } catch (error) {
        console.error("❌ Progress fetch error:", error)
        throw error
      }
    },
    enabled: enabled && !!processingSessionId,
    refetchInterval: enabled && !!processingSessionId ? 500 : false, // Poll every 500ms while enabled
    staleTime: 0, // Always fetch fresh data
    retry: false, // Don't retry failed requests to avoid spam
  })
}
