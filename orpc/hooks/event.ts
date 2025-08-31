"use client"

import { orpc } from "@/orpc/client"
import type {
  AIProcessEventInput,
  AIProcessEventOutput,
  CreateEventInput,
  CreateEventOutput,
  DeleteEventInput,
  DeleteEventOutput,
  GetEventInput,
  GetEventOutput,
  ListEventsInput,
  ListEventsOutput,
  UpdateEventInput,
  UpdateEventOutput,
} from "@/schemas/event"
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query"

// Query keys factory
export const eventKeys = {
  all: ["events"] as const,
  lists: () => [...eventKeys.all, "list"] as const,
  list: (filters: Partial<ListEventsInput>) =>
    [...eventKeys.lists(), filters] as const,
  details: () => [...eventKeys.all, "detail"] as const,
  detail: (id: string) => [...eventKeys.details(), id] as const,
}

// Event hooks
export function useCreateEvent() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: CreateEventInput) =>
      orpc.events.createEvent.call(input),
    onSuccess: (data: CreateEventOutput) => {
      if (data.success) {
        queryClient.invalidateQueries({
          queryKey: eventKeys.lists(),
        })
      }
    },
    onError: (error) => {
      console.error("Failed to create event:", error)
    },
  })
}

export function useUpdateEvent() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: UpdateEventInput) =>
      orpc.events.updateEvent.call(input),
    onSuccess: (data: UpdateEventOutput, variables: UpdateEventInput) => {
      if (data.success) {
        queryClient.invalidateQueries({
          queryKey: eventKeys.detail(variables.id),
        })
        queryClient.invalidateQueries({
          queryKey: eventKeys.lists(),
        })
      }
    },
    onError: (error) => {
      console.error("Failed to update event:", error)
    },
  })
}

export function useGetEvent(input: GetEventInput) {
  return useQuery({
    queryKey: eventKeys.detail(input.id),
    queryFn: () => orpc.events.getEvent.call(input),
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

export function useDeleteEvent() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: DeleteEventInput) =>
      orpc.events.deleteEvent.call(input),
    onSuccess: (data: DeleteEventOutput, variables: DeleteEventInput) => {
      if (data.success) {
        queryClient.removeQueries({
          queryKey: eventKeys.detail(variables.id),
        })
        queryClient.invalidateQueries({
          queryKey: eventKeys.lists(),
        })
      }
    },
    onError: (error) => {
      console.error("Failed to delete event:", error)
    },
  })
}

export function useListEvents(input: ListEventsInput = { page: 1, limit: 20 }) {
  return useQuery({
    queryKey: eventKeys.list(input),
    queryFn: () => orpc.events.listEvents.call(input),
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
  })
}

export function useAIProcessEvent() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: AIProcessEventInput) =>
      orpc.events.aiProcessEvent.call(input),
    onSuccess: (data: AIProcessEventOutput) => {
      if (data.success) {
        queryClient.invalidateQueries({
          queryKey: eventKeys.lists(),
        })
      }
    },
    onError: (error) => {
      console.error("Failed to process event with AI:", error)
    },
  })
}

// Convenience hooks
export function useEventsListInfinite(
  input: Omit<ListEventsInput, "page"> = { limit: 20 }
) {
  return useInfiniteQuery({
    queryKey: eventKeys.list(input),
    queryFn: async ({ pageParam = 1 }) => {
      const result = await orpc.events.listEvents.call({
        page: pageParam as number,
        ...input,
      })
      return result
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (!lastPage.success || !lastPage.pagination) return undefined
      const { page, totalPages } = lastPage.pagination
      return page < totalPages ? page + 1 : undefined
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}
