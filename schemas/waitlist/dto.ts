import { z } from "zod"

// =============================================================================
// WAITLIST DTOs (Data Transfer Objects - API Inputs)
// =============================================================================

// Join Waitlist DTO
export const joinWaitlistDto = z.object({
  email: z.string().email("Please enter a valid email address"),
})

export type JoinWaitlistDto = z.infer<typeof joinWaitlistDto>

// Get Waitlist Position DTO
export const getWaitlistPositionDto = z.object({
  email: z.string().email("Please enter a valid email address"),
})

export type GetWaitlistPositionDto = z.infer<typeof getWaitlistPositionDto>

// Remove from Waitlist DTO
export const removeFromWaitlistDto = z.object({
  email: z.string().email("Please enter a valid email address"),
})

export type RemoveFromWaitlistDto = z.infer<typeof removeFromWaitlistDto>

// List Waitlist Entries DTO
export const listWaitlistEntriesDto = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(50),
  search: z.string().optional(),
  isNotified: z.boolean().optional(),
})

export type ListWaitlistEntriesDto = z.infer<typeof listWaitlistEntriesDto>

// Notify Waitlist Entry DTO
export const notifyWaitlistEntryDto = z.object({
  id: z.string().uuid("Invalid waitlist entry ID"),
})

export type NotifyWaitlistEntryDto = z.infer<typeof notifyWaitlistEntryDto>

// Batch Notify Waitlist DTO
export const batchNotifyWaitlistDto = z.object({
  count: z
    .number()
    .min(1)
    .max(1000, "Cannot notify more than 1000 entries at once"),
})

export type BatchNotifyWaitlistDto = z.infer<typeof batchNotifyWaitlistDto>
