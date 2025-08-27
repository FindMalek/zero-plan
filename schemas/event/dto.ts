import { z } from "zod"
import { timezoneSchema, repeatPatternSchema, reminderUnitSchema } from "../utils"

// Create Event DTO
export const createEventDto = z.object({
  emoji: z.string().min(1, "Emoji is required").optional(),
  title: z.string().min(1, "Title is required").max(200, "Title must be less than 200 characters"),
  description: z.string().max(1000, "Description must be less than 1000 characters").optional(),
  startTime: z.string().datetime().or(z.date()),
  endTime: z.string().datetime().or(z.date()).optional(),
  timezone: timezoneSchema.optional(),
  isAllDay: z.boolean().optional(),
  location: z.string().max(500, "Location must be less than 500 characters").optional(),
  meetingRoom: z.string().max(200, "Meeting room must be less than 200 characters").optional(),
  conferenceLink: z.string().url("Conference link must be a valid URL").optional(),
  conferenceId: z.string().max(100, "Conference ID must be less than 100 characters").optional(),
  participantEmails: z.array(z.string().email()).optional(),
  maxParticipants: z.number().int().positive().optional(),
  links: z.array(z.string().url()).optional(),
  documents: z.array(z.string().url()).optional(),
  calendarId: z.string().uuid("Calendar ID is required"),
  recurrence: z.object({
    pattern: repeatPatternSchema,
    endDate: z.string().datetime().or(z.date()).optional(),
    customRule: z.record(z.string(), z.union([z.string(), z.number(), z.boolean()])).optional(),
  }).optional(),
  reminders: z.array(z.object({
    value: z.number().int().positive(),
    unit: reminderUnitSchema,
  })).optional(),
})

export type CreateEventDto = z.infer<typeof createEventDto>

// Update Event DTO
export const updateEventDto = z.object({
  id: z.string().uuid("Invalid event ID"),
  emoji: z.string().min(1, "Emoji is required").optional(),
  title: z.string().min(1, "Title is required").max(200, "Title must be less than 200 characters").optional(),
  description: z.string().max(1000, "Description must be less than 1000 characters").optional(),
  startTime: z.string().datetime().or(z.date()).optional(),
  endTime: z.string().datetime().or(z.date()).optional(),
  timezone: timezoneSchema.optional(),
  isAllDay: z.boolean().optional(),
  location: z.string().max(500, "Location must be less than 500 characters").optional(),
  meetingRoom: z.string().max(200, "Meeting room must be less than 200 characters").optional(),
  conferenceLink: z.string().url("Conference link must be a valid URL").optional(),
  conferenceId: z.string().max(100, "Conference ID must be less than 100 characters").optional(),
  participantEmails: z.array(z.string().email()).optional(),
  maxParticipants: z.number().int().positive().optional(),
  links: z.array(z.string().url()).optional(),
  documents: z.array(z.string().url()).optional(),
  calendarId: z.string().uuid().optional(),
})

export type UpdateEventDto = z.infer<typeof updateEventDto>

// Get Event DTO
export const getEventDto = z.object({
  id: z.string().uuid("Invalid event ID"),
})

export type GetEventDto = z.infer<typeof getEventDto>

// Delete Event DTO
export const deleteEventDto = z.object({
  id: z.string().uuid("Invalid event ID"),
})

export type DeleteEventDto = z.infer<typeof deleteEventDto>

// List Events DTO
export const listEventsDto = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(20),
  calendarId: z.string().uuid().optional(),
  search: z.string().optional(),
  startDate: z.string().datetime().or(z.date()).optional(),
  endDate: z.string().datetime().or(z.date()).optional(),
})

export type ListEventsDto = z.infer<typeof listEventsDto>

// Process Event DTO
export const processEventDto = z.object({
  userInput: z.string().min(1, "Input text is required").max(2000, "Input must be less than 2000 characters"),
  model: z.string().optional().default("gpt-4"),
  provider: z.string().optional().default("openai"),
  calendarId: z.string().uuid("Calendar ID is required"),
})

export type ProcessEventDto = z.infer<typeof processEventDto>