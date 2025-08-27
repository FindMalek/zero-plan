import { z } from "zod"
import { timezoneSchema } from "../utils"

// Event Response Object
export const eventRoSchema = z.object({
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
  userId: z.string(),
  calendarId: z.string(),
})

export type EventRo = z.infer<typeof eventRoSchema>

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

// Get Event Output
export const getEventOutputSchema = z.object({
  success: z.boolean(),
  event: eventRoSchema.optional(),
  error: z.string().optional(),
})

export type GetEventOutput = z.infer<typeof getEventOutputSchema>

// Delete Event Output
export const deleteEventOutputSchema = z.object({
  success: z.boolean(),
  error: z.string().optional(),
})

export type DeleteEventOutput = z.infer<typeof deleteEventOutputSchema>

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
