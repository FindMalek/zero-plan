import { z } from "zod"

// =============================================================================
// CORE WAITLIST ENTITY SCHEMAS
// =============================================================================

// Core Waitlist Entry Entity
export const waitlistEntryEntitySchema = z.object({
  id: z.string(),
  email: z.string(),
  position: z.number(),
  isNotified: z.boolean(),
  invitedAt: z.date().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export type WaitlistEntryEntity = z.infer<typeof waitlistEntryEntitySchema>

// =============================================================================
// SPECIALIZED WAITLIST SCHEMAS
// =============================================================================

// Waitlist entry summary (minimal fields)
export const waitlistEntrySummarySchema = z.object({
  id: z.string(),
  email: z.string(),
  position: z.number(),
  createdAt: z.date(),
})

export type WaitlistEntrySummary = z.infer<typeof waitlistEntrySummarySchema>

// Waitlist statistics
export const waitlistStatsSchema = z.object({
  totalEntries: z.number(),
  notifiedEntries: z.number(),
  pendingEntries: z.number(),
  averageWaitTime: z.number().optional(), // in days
  latestEntry: z.date().optional(),
})

export type WaitlistStats = z.infer<typeof waitlistStatsSchema>
