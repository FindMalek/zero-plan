import { z } from "zod"
import { timezoneSchema, repeatPatternSchema, reminderUnitSchema } from "./event"

// Create Calendar Input
export const createCalendarInputSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name must be less than 100 characters"),
  description: z.string().max(500, "Description must be less than 500 characters").optional(),
  color: z.string().regex(/^#[0-9A-F]{6}$/i, "Color must be a valid hex color").optional(),
  emoji: z.string().min(1, "Emoji is required").optional(),
  isDefault: z.boolean().optional(),
})

export type CreateCalendarInput = z.infer<typeof createCalendarInputSchema>

// Create Calendar Output
export const createCalendarOutputSchema = z.object({
  success: z.boolean(),
  calendar: z.object({
    id: z.string(),
    name: z.string(),
    color: z.string(),
    emoji: z.string(),
    isDefault: z.boolean(),
  }).optional(),
  error: z.string().optional(),
})

export type CreateCalendarOutput = z.infer<typeof createCalendarOutputSchema>

// Create Event Input
export const createEventInputSchema = z.object({
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

export type CreateEventInput = z.infer<typeof createEventInputSchema>

// Create Event Output
export const createEventOutputSchema = z.object({
  success: z.boolean(),
  event: z.object({
    id: z.string(),
    emoji: z.string(),
    title: z.string(),
    startTime: z.date(),
    endTime: z.date().optional(),
    timezone: timezoneSchema,
    calendarId: z.string(),
  }).optional(),
  error: z.string().optional(),
})

export type CreateEventOutput = z.infer<typeof createEventOutputSchema>

// Update Event Input
export const updateEventInputSchema = z.object({
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

export type UpdateEventInput = z.infer<typeof updateEventInputSchema>

// Update Event Output
export const updateEventOutputSchema = z.object({
  success: z.boolean(),
  event: z.object({
    id: z.string(),
    emoji: z.string(),
    title: z.string(),
    startTime: z.date(),
    endTime: z.date().optional(),
    timezone: timezoneSchema,
    calendarId: z.string(),
    updatedAt: z.date(),
  }).optional(),
  error: z.string().optional(),
})

export type UpdateEventOutput = z.infer<typeof updateEventOutputSchema>

// Get Event Input
export const getEventInputSchema = z.object({
  id: z.string().uuid("Invalid event ID"),
})

export type GetEventInput = z.infer<typeof getEventInputSchema>

// Get Event Output
export const getEventOutputSchema = z.object({
  success: z.boolean(),
  event: z.object({
    id: z.string(),
    emoji: z.string(),
    title: z.string(),
    description: z.string().optional(),
    startTime: z.date(),
    endTime: z.date().optional(),
    timezone: timezoneSchema,
    isAllDay: z.boolean(),
    location: z.string().optional(),
    meetingRoom: z.string().optional(),
    conferenceLink: z.string().optional(),
    conferenceId: z.string().optional(),
    participantEmails: z.array(z.string()).optional(),
    maxParticipants: z.number().optional(),
    links: z.array(z.string()).optional(),
    documents: z.array(z.string()).optional(),
    aiConfidence: z.number().optional(),
    createdAt: z.date(),
    updatedAt: z.date(),
    calendarId: z.string(),
  }).optional(),
  error: z.string().optional(),
})

export type GetEventOutput = z.infer<typeof getEventOutputSchema>

// Delete Event Input
export const deleteEventInputSchema = z.object({
  id: z.string().uuid("Invalid event ID"),
})

export type DeleteEventInput = z.infer<typeof deleteEventInputSchema>

// Delete Event Output
export const deleteEventOutputSchema = z.object({
  success: z.boolean(),
  error: z.string().optional(),
})

export type DeleteEventOutput = z.infer<typeof deleteEventOutputSchema>

// List Events Input
export const listEventsInputSchema = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(20),
  calendarId: z.string().uuid().optional(),
  search: z.string().optional(),
  startDate: z.string().datetime().or(z.date()).optional(),
  endDate: z.string().datetime().or(z.date()).optional(),
})

export type ListEventsInput = z.infer<typeof listEventsInputSchema>

// List Events Output
export const listEventsOutputSchema = z.object({
  success: z.boolean(),
  events: z.array(z.object({
    id: z.string(),
    emoji: z.string(),
    title: z.string(),
    description: z.string().optional(),
    startTime: z.date(),
    endTime: z.date().optional(),
    timezone: timezoneSchema,
    isAllDay: z.boolean(),
    location: z.string().optional(),
    aiConfidence: z.number().optional(),
    createdAt: z.date(),
    updatedAt: z.date(),
    calendarId: z.string(),
  })).optional(),
  pagination: z.object({
    page: z.number(),
    limit: z.number(),
    total: z.number(),
    totalPages: z.number(),
  }).optional(),
  error: z.string().optional(),
})

export type ListEventsOutput = z.infer<typeof listEventsOutputSchema>

// Process Event Input
export const processEventInputSchema = z.object({
  userInput: z.string().min(1, "Input text is required").max(2000, "Input must be less than 2000 characters"),
  model: z.string().optional().default("gpt-4"),
  provider: z.string().optional().default("openai"),
  calendarId: z.string().uuid("Calendar ID is required"),
})

export type ProcessEventInput = z.infer<typeof processEventInputSchema>

// Process Event Output
export const processEventOutputSchema = z.object({
  success: z.boolean(),
  events: z.array(z.object({
    id: z.string(),
    emoji: z.string(),
    title: z.string(),
    description: z.string().optional(),
    startTime: z.date(),
    endTime: z.date().optional(),
    timezone: timezoneSchema,
    isAllDay: z.boolean(),
    location: z.string().optional(),
    aiConfidence: z.number().optional(),
    calendarId: z.string(),
  })).optional(),
  // Backward compatibility - first event
  event: z.object({
    id: z.string(),
    emoji: z.string(),
    title: z.string(),
    description: z.string().optional(),
    startTime: z.date(),
    endTime: z.date().optional(),
    timezone: timezoneSchema,
    isAllDay: z.boolean(),
    location: z.string().optional(),
    aiConfidence: z.number().optional(),
    calendarId: z.string(),
  }).optional(),
  inputProcessingSession: z.object({
    id: z.string(),
    model: z.string(),
    provider: z.string(),
    processingTimeMs: z.number().optional(),
    tokensUsed: z.number().optional(),
    confidence: z.number().optional(),
  }).optional(),
  totalEvents: z.number().optional(),
  error: z.string().optional(),
})

export type ProcessEventOutput = z.infer<typeof processEventOutputSchema>
