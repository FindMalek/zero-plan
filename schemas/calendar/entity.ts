import { z } from "zod"

import { eventEntitySchema } from "../event/entity"

// =============================================================================
// CORE CALENDAR ENTITY SCHEMAS
// =============================================================================

// Core Calendar Entity
export const calendarEntitySchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  color: z.string(),
  emoji: z.string(),
  isDefault: z.boolean(),
  isActive: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
  userId: z.string(),
  // Relations (optional - for populated responses)
  events: z.array(eventEntitySchema).optional(),
})

export type CalendarEntity = z.infer<typeof calendarEntitySchema>

// =============================================================================
// SPECIALIZED CALENDAR SCHEMAS
// =============================================================================

// Calendar with events populated
export const calendarWithEventsSchema = calendarEntitySchema.extend({
  events: z.array(eventEntitySchema),
})

export type CalendarWithEvents = z.infer<typeof calendarWithEventsSchema>

// Calendar summary (minimal fields)
export const calendarSummarySchema = z.object({
  id: z.string(),
  name: z.string(),
  color: z.string(),
  emoji: z.string(),
  isDefault: z.boolean(),
  isActive: z.boolean(),
})

export type CalendarSummary = z.infer<typeof calendarSummarySchema>

// Calendar statistics
export const calendarStatsSchema = z.object({
  id: z.string(),
  name: z.string(),
  eventCount: z.number(),
  upcomingEvents: z.number(),
  pastEvents: z.number(),
})

export type CalendarStats = z.infer<typeof calendarStatsSchema>
