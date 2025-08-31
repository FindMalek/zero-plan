import { z } from "zod"

// Create Calendar DTO
export const createCalendarDto = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name must be less than 100 characters"),
  description: z
    .string()
    .max(500, "Description must be less than 500 characters")
    .optional(),
  color: z
    .string()
    .regex(/^#[0-9A-F]{6}$/i, "Color must be a valid hex color")
    .optional(),
  emoji: z.string().min(1, "Emoji is required").optional(),
  isDefault: z.boolean().optional(),
})

export type CreateCalendarDto = z.infer<typeof createCalendarDto>

// Update Calendar DTO
export const updateCalendarDto = z.object({
  id: z.string().uuid("Invalid calendar ID"),
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name must be less than 100 characters")
    .optional(),
  description: z
    .string()
    .max(500, "Description must be less than 500 characters")
    .optional(),
  color: z
    .string()
    .regex(/^#[0-9A-F]{6}$/i, "Color must be a valid hex color")
    .optional(),
  emoji: z.string().min(1, "Emoji is required").optional(),
  isDefault: z.boolean().optional(),
  isActive: z.boolean().optional(),
})

export type UpdateCalendarDto = z.infer<typeof updateCalendarDto>

// Get Calendar DTO
export const getCalendarDto = z.object({
  id: z.string().uuid("Invalid calendar ID"),
})

export type GetCalendarDto = z.infer<typeof getCalendarDto>

// Delete Calendar DTO
export const deleteCalendarDto = z.object({
  id: z.string().uuid("Invalid calendar ID"),
})

export type DeleteCalendarDto = z.infer<typeof deleteCalendarDto>

// List Calendars DTO
export const listCalendarsDto = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(20),
  search: z.string().optional(),
  isActive: z.boolean().optional(),
})

export type ListCalendarsDto = z.infer<typeof listCalendarsDto>
