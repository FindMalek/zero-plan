"use client"

import { orpc } from "@/orpc/client"
import type { GenerateEventsRo } from "@/schemas/ai"
import { useMutation, useQueryClient } from "@tanstack/react-query"

// Import the event keys factory for cache invalidation
import { eventKeys } from "./event"

// AI Query keys factory
export const aiKeys = {
  all: ["ai"] as const,
  generations: () => [...aiKeys.all, "generation"] as const,
  generation: (sessionId: string) =>
    [...aiKeys.generations(), sessionId] as const,
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
