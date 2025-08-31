import { z } from "zod"

// =============================================================================
// WAITLIST RESPONSE OBJECTS (Three-Tier System)
// =============================================================================

// Waitlist Entry Simple RO (Basic entry - no relations)
export const waitlistEntrySimpleRo = z.object({
  id: z.string(),
  email: z.string(),
  position: z.number(),
  isNotified: z.boolean(),
  invitedAt: z.date().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export type WaitlistEntrySimpleRo = z.infer<typeof waitlistEntrySimpleRo>

// Waitlist Entry RO (With position stats)
export const waitlistEntryRo = waitlistEntrySimpleRo.extend({
  totalAhead: z.number().optional(),
  estimatedWaitTime: z.string().optional(), // e.g., "2-3 weeks"
})

export type WaitlistEntryRo = z.infer<typeof waitlistEntryRo>

// Waitlist Entry Full RO (Same as RO for now - no additional relations needed)
export const waitlistEntryFullRo = waitlistEntryRo

export type WaitlistEntryFullRo = z.infer<typeof waitlistEntryFullRo>

// =============================================================================
// API RESPONSE WRAPPERS
// =============================================================================

// Join Waitlist Response
export const joinWaitlistRo = z.object({
  success: z.boolean(),
  entry: waitlistEntryRo.optional(),
  message: z.string().optional(),
  error: z.string().optional(),
})

export type JoinWaitlistRo = z.infer<typeof joinWaitlistRo>

// Get Waitlist Position Response
export const getWaitlistPositionRo = z.object({
  success: z.boolean(),
  entry: waitlistEntryRo.optional(),
  error: z.string().optional(),
})

export type GetWaitlistPositionRo = z.infer<typeof getWaitlistPositionRo>

// Remove from Waitlist Response
export const removeFromWaitlistRo = z.object({
  success: z.boolean(),
  message: z.string().optional(),
  error: z.string().optional(),
})

export type RemoveFromWaitlistRo = z.infer<typeof removeFromWaitlistRo>

// List Waitlist Entries Response
export const listWaitlistEntriesRo = z.object({
  success: z.boolean(),
  entries: z.array(waitlistEntryRo).optional(),
  pagination: z
    .object({
      page: z.number(),
      limit: z.number(),
      total: z.number(),
      totalPages: z.number(),
    })
    .optional(),
  error: z.string().optional(),
})

export type ListWaitlistEntriesRo = z.infer<typeof listWaitlistEntriesRo>

// Notify Waitlist Entry Response
export const notifyWaitlistEntryRo = z.object({
  success: z.boolean(),
  entry: waitlistEntryRo.optional(),
  error: z.string().optional(),
})

export type NotifyWaitlistEntryRo = z.infer<typeof notifyWaitlistEntryRo>

// Batch Notify Waitlist Response
export const batchNotifyWaitlistRo = z.object({
  success: z.boolean(),
  notified: z.number().optional(),
  failed: z.number().optional(),
  errors: z.array(z.string()).optional(),
})

export type BatchNotifyWaitlistRo = z.infer<typeof batchNotifyWaitlistRo>

// =============================================================================
// STATISTICS RESPONSES
// =============================================================================

// Waitlist Statistics Response
export const waitlistStatsRo = z.object({
  totalEntries: z.number(),
  notifiedEntries: z.number(),
  pendingEntries: z.number(),
  averageWaitTime: z.number().optional(), // in days
  latestEntry: z.date().optional(),
})

export type WaitlistStatsRo = z.infer<typeof waitlistStatsRo>

// Get Waitlist Statistics Response
export const getWaitlistStatsRo = z.object({
  success: z.boolean(),
  stats: waitlistStatsRo.optional(),
  error: z.string().optional(),
})

export type GetWaitlistStatsRo = z.infer<typeof getWaitlistStatsRo>
