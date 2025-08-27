import { z } from "zod"

// Calendar Response Object
export const calendarRoSchema = z.object({
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

export type CalendarRo = z.infer<typeof calendarRoSchema>

// Create Calendar Output
export const createCalendarOutputSchema = z.object({
  success: z.boolean(),
  calendar: calendarRoSchema.optional(),
  error: z.string().optional(),
})

export type CreateCalendarOutput = z.infer<typeof createCalendarOutputSchema>

// Update Calendar Output
export const updateCalendarOutputSchema = z.object({
  success: z.boolean(),
  calendar: calendarRoSchema.optional(),
  error: z.string().optional(),
})

export type UpdateCalendarOutput = z.infer<typeof updateCalendarOutputSchema>

// Get Calendar Output
export const getCalendarOutputSchema = z.object({
  success: z.boolean(),
  calendar: calendarRoSchema.optional(),
  error: z.string().optional(),
})

export type GetCalendarOutput = z.infer<typeof getCalendarOutputSchema>

// Delete Calendar Output
export const deleteCalendarOutputSchema = z.object({
  success: z.boolean(),
  error: z.string().optional(),
})

export type DeleteCalendarOutput = z.infer<typeof deleteCalendarOutputSchema>

// List Calendars Output
export const listCalendarsOutputSchema = z.object({
  success: z.boolean(),
  calendars: z.array(calendarRoSchema).optional(),
  pagination: z.object({
    page: z.number(),
    limit: z.number(),
    total: z.number(),
    totalPages: z.number(),
  }).optional(),
  error: z.string().optional(),
})

export type ListCalendarsOutput = z.infer<typeof listCalendarsOutputSchema>
