import { z } from "zod"

import {
  participantRoleSchema,
  reminderUnitSchema,
  repeatPatternSchema,
  rsvpStatusSchema,
  timezoneSchema,
} from "../utils"

// =============================================================================
// EVENT CRUD DTOs (Data Transfer Objects - API Inputs)
// =============================================================================

// Create Event DTO
export const createEventDto = z.object({
  emoji: z.string().min(1, "Emoji is required").optional(),
  title: z
    .string()
    .min(1, "Title is required")
    .max(200, "Title must be less than 200 characters"),
  description: z
    .string()
    .max(1000, "Description must be less than 1000 characters")
    .optional(),
  startTime: z.string().datetime().or(z.date()),
  endTime: z.string().datetime().or(z.date()).optional(),
  timezone: timezoneSchema.optional(),
  isAllDay: z.boolean().optional(),
  location: z
    .string()
    .max(500, "Location must be less than 500 characters")
    .optional(),
  maxParticipants: z.number().int().positive().optional(),
  links: z.array(z.string().url()).optional(),
  documents: z.array(z.string().url()).optional(),
  calendarId: z.string().uuid("Calendar ID is required"),
  conference: z
    .object({
      meetingRoom: z
        .string()
        .max(200, "Meeting room must be less than 200 characters")
        .optional(),
      conferenceLink: z
        .string()
        .url("Conference link must be a valid URL")
        .optional(),
      conferenceId: z
        .string()
        .max(100, "Conference ID must be less than 100 characters")
        .optional(),
      dialInNumber: z
        .string()
        .max(50, "Dial-in number must be less than 50 characters")
        .optional(),
      accessCode: z
        .string()
        .max(50, "Access code must be less than 50 characters")
        .optional(),
      hostKey: z
        .string()
        .max(50, "Host key must be less than 50 characters")
        .optional(),
      isRecorded: z.boolean().optional(),
      maxDuration: z.number().int().positive().optional(),
    })
    .optional(),
  participants: z
    .array(
      z.object({
        email: z.string().email("Valid email is required"),
        name: z
          .string()
          .max(200, "Name must be less than 200 characters")
          .optional(),
        role: participantRoleSchema.optional(),
        rsvpStatus: rsvpStatusSchema.optional(),
        isOrganizer: z.boolean().optional(),
        notes: z
          .string()
          .max(1000, "Notes must be less than 1000 characters")
          .optional(),
      })
    )
    .optional(),
  recurrence: z
    .object({
      pattern: repeatPatternSchema,
      endDate: z.string().datetime().or(z.date()).optional(),
      customRule: z
        .record(z.string(), z.union([z.string(), z.number(), z.boolean()]))
        .optional(),
    })
    .optional(),
  reminders: z
    .array(
      z.object({
        value: z.number().int().positive(),
        unit: reminderUnitSchema,
      })
    )
    .optional(),
})

export type CreateEventDto = z.infer<typeof createEventDto>

// Get Event DTO
export const getEventDto = z.object({
  id: z.string().uuid("Invalid event ID"),
})

export type GetEventDto = z.infer<typeof getEventDto>

// Update Event DTO
export const updateEventDto = z.object({
  id: z.string().uuid("Invalid event ID"),
  emoji: z.string().min(1, "Emoji is required").optional(),
  title: z
    .string()
    .min(1, "Title is required")
    .max(200, "Title must be less than 200 characters")
    .optional(),
  description: z
    .string()
    .max(1000, "Description must be less than 1000 characters")
    .optional(),
  startTime: z.string().datetime().or(z.date()).optional(),
  endTime: z.string().datetime().or(z.date()).optional(),
  timezone: timezoneSchema.optional(),
  isAllDay: z.boolean().optional(),
  location: z
    .string()
    .max(500, "Location must be less than 500 characters")
    .optional(),
  maxParticipants: z.number().int().positive().optional(),
  links: z.array(z.string().url()).optional(),
  documents: z.array(z.string().url()).optional(),
  calendarId: z.string().uuid().optional(),
  conference: z
    .object({
      meetingRoom: z
        .string()
        .max(200, "Meeting room must be less than 200 characters")
        .optional(),
      conferenceLink: z
        .string()
        .url("Conference link must be a valid URL")
        .optional(),
      conferenceId: z
        .string()
        .max(100, "Conference ID must be less than 100 characters")
        .optional(),
      dialInNumber: z
        .string()
        .max(50, "Dial-in number must be less than 50 characters")
        .optional(),
      accessCode: z
        .string()
        .max(50, "Access code must be less than 50 characters")
        .optional(),
      hostKey: z
        .string()
        .max(50, "Host key must be less than 50 characters")
        .optional(),
      isRecorded: z.boolean().optional(),
      maxDuration: z.number().int().positive().optional(),
    })
    .optional(),
  participants: z
    .array(
      z.object({
        email: z.string().email("Valid email is required"),
        name: z
          .string()
          .max(200, "Name must be less than 200 characters")
          .optional(),
        role: participantRoleSchema.optional(),
        rsvpStatus: rsvpStatusSchema.optional(),
        isOrganizer: z.boolean().optional(),
        notes: z
          .string()
          .max(1000, "Notes must be less than 1000 characters")
          .optional(),
      })
    )
    .optional(),
})

export type UpdateEventDto = z.infer<typeof updateEventDto>

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
