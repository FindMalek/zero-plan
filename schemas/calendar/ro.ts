import { z } from "zod"

import { userSimpleRo } from "../user"
import { paginationSchema } from "../utils"

export const calendarSimpleRo = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  color: z.string(),
  emoji: z.string(),
})

export type CalendarSimpleRo = z.infer<typeof calendarSimpleRo>

export const calendarRo = calendarSimpleRo.extend({
  isDefault: z.boolean(),
  isActive: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
  userId: z.string(),
})

export type CalendarRo = z.infer<typeof calendarRo>

export const calendarFullRo = calendarRo.extend({
  user: userSimpleRo.optional(),
})

export type CalendarFullRo = z.infer<typeof calendarFullRo>

export const createCalendarRo = z.object({
  success: z.boolean(),
  calendar: calendarRo.optional(),
  error: z.string().optional(),
})

export type CreateCalendarRo = z.infer<typeof createCalendarRo>

export const getCalendarRo = z.object({
  success: z.boolean(),
  calendar: calendarFullRo.optional(),
  error: z.string().optional(),
})

export type GetCalendarRo = z.infer<typeof getCalendarRo>

export const updateCalendarRo = z.object({
  success: z.boolean(),
  calendar: calendarRo.optional(),
  error: z.string().optional(),
})

export type UpdateCalendarRo = z.infer<typeof updateCalendarRo>

export const deleteCalendarRo = z.object({
  success: z.boolean(),
  error: z.string().optional(),
})

export type DeleteCalendarRo = z.infer<typeof deleteCalendarRo>

export const listCalendarsRo = z.object({
  success: z.boolean(),
  calendars: z.array(calendarRo).optional(),
  pagination: paginationSchema.optional(),
  error: z.string().optional(),
})

export type ListCalendarsRo = z.infer<typeof listCalendarsRo>
