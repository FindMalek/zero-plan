import { z } from "zod"

// =============================================================================
// CALENDAR RESPONSE OBJECTS (Three-Tier System)
// =============================================================================

// Calendar Simple RO (Basic calendar - no relations)
export const calendarSimpleRo = z.object({
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
})

export type CalendarSimpleRo = z.infer<typeof calendarSimpleRo>

// Calendar RO (With some basic stats)
export const calendarRo = calendarSimpleRo.extend({
  eventCount: z.number().optional(),
  upcomingEvents: z.number().optional(),
})

export type CalendarRo = z.infer<typeof calendarRo>

// Calendar Full RO (With events)
export const calendarFullRo = calendarSimpleRo.extend({
  eventCount: z.number().optional(),
  upcomingEvents: z.number().optional(),
  events: z
    .array(
      z.object({
        id: z.string(),
        title: z.string(),
        emoji: z.string(),
        startTime: z.date(),
        endTime: z.date().optional(),
        isAllDay: z.boolean(),
      })
    )
    .optional(),
})

export type CalendarFullRo = z.infer<typeof calendarFullRo>

// =============================================================================
// API RESPONSE WRAPPERS
// =============================================================================

// Create Calendar Response
export const createCalendarRo = z.object({
  success: z.boolean(),
  calendar: calendarRo.optional(),
  error: z.string().optional(),
})

export type CreateCalendarRo = z.infer<typeof createCalendarRo>

// Get Calendar Response
export const getCalendarRo = z.object({
  success: z.boolean(),
  calendar: calendarFullRo.optional(),
  error: z.string().optional(),
})

export type GetCalendarRo = z.infer<typeof getCalendarRo>

// Update Calendar Response
export const updateCalendarRo = z.object({
  success: z.boolean(),
  calendar: calendarRo.optional(),
  error: z.string().optional(),
})

export type UpdateCalendarRo = z.infer<typeof updateCalendarRo>

// Delete Calendar Response
export const deleteCalendarRo = z.object({
  success: z.boolean(),
  error: z.string().optional(),
})

export type DeleteCalendarRo = z.infer<typeof deleteCalendarRo>

// List Calendars Response
export const listCalendarsRo = z.object({
  success: z.boolean(),
  calendars: z.array(calendarRo).optional(),
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

export type ListCalendarsRo = z.infer<typeof listCalendarsRo>
