"use client"

import { orpc } from "@/orpc/client"
import type {
  CreateEventDto,
  CreateEventRo,
  DeleteEventDto,
  DeleteEventRo,
  GetEventDto,
  GetEventRo,
  ListEventsDto,
  ListEventsRo,
  UpdateEventDto,
  UpdateEventRo,
} from "@/schemas/event"
import type { ProcessEventsDto, ProcessEventsRo } from "@/schemas/processing"
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
  list: (filters: Partial<ListEventsDto>) =>
    [...eventKeys.lists(), filters] as const,
  details: () => [...eventKeys.all, "detail"] as const,
  detail: (id: string) => [...eventKeys.details(), id] as const,
}

// Event hooks
export function useCreateEvent() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: CreateEventDto) => orpc.events.createEvent.call(input),
    onSuccess: (data: CreateEventRo) => {
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
    mutationFn: (input: UpdateEventDto) => orpc.events.updateEvent.call(input),
    onSuccess: (data: UpdateEventRo, variables: UpdateEventDto) => {
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

export function useGetEvent(input: GetEventDto) {
  return useQuery({
    queryKey: eventKeys.detail(input.id),
    queryFn: () => orpc.events.getEvent.call(input),
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

export function useDeleteEvent() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: DeleteEventDto) => orpc.events.deleteEvent.call(input),
    onSuccess: (data: DeleteEventRo, variables: DeleteEventDto) => {
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

export function useListEvents(input: ListEventsDto = { page: 1, limit: 20 }) {
  return useQuery({
    queryKey: eventKeys.list(input),
    queryFn: () => orpc.events.listEvents.call(input),
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
  })
}

export function useProcessEvents() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: ProcessEventsDto) =>
      orpc.events.processEvents.call(input),
    onSuccess: (data: ProcessEventsRo) => {
      if (data.success) {
        queryClient.invalidateQueries({
          queryKey: eventKeys.lists(),
        })
      }
    },
    onError: (error) => {
      console.error("Failed to process events with AI:", error)
    },
  })
}

// Legacy hook for backwards compatibility
export const useAIProcessEvent = useProcessEvents

// Convenience hooks
export function useEventsListInfinite(
  input: Omit<ListEventsDto, "page"> = { limit: 20 }
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
