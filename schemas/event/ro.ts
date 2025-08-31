import { z } from "zod"

import { calendarSimpleRo } from "../calendar"
import {
  participantRoleSchema,
  reminderUnitSchema,
  repeatPatternSchema,
  rsvpStatusSchema,
  timezoneSchema,
} from "../utils"

// =============================================================================
// EVENT RESPONSE OBJECTS (Three-Tier System)
// =============================================================================

// Event Simple RO (Basic event - no relations)
export const eventSimpleRo = z.object({
  id: z.string(),
  emoji: z.string(),
  title: z.string(),
  description: z.string().optional(),
  startTime: z.date(),
  endTime: z.date().optional(),
  timezone: timezoneSchema,
  isAllDay: z.boolean(),
  location: z.string().optional(),
  maxParticipants: z.number().optional(),
  links: z.array(z.string()).optional(),
  aiConfidence: z.number().optional(),
})

export type EventSimpleRo = z.infer<typeof eventSimpleRo>

// Event Recurrence RO
export const eventRecurrenceRo = z.object({
  id: z.string(),
  pattern: repeatPatternSchema,
  endDate: z.date().optional(),
  customRule: z
    .record(z.string(), z.union([z.string(), z.number(), z.boolean()]))
    .optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
  eventId: z.string(),
})

export type EventRecurrenceRo = z.infer<typeof eventRecurrenceRo>

// Event Reminder RO
export const eventReminderRo = z.object({
  id: z.string(),
  value: z.number(),
  unit: reminderUnitSchema,
  createdAt: z.date(),
  updatedAt: z.date(),
  eventId: z.string(),
})

export type EventReminderRo = z.infer<typeof eventReminderRo>

// Event Conference RO
export const eventConferenceRo = z.object({
  id: z.string(),
  meetingRoom: z.string().optional(),
  conferenceLink: z.string().optional(),
  conferenceId: z.string().optional(),
  dialInNumber: z.string().optional(),
  accessCode: z.string().optional(),
  hostKey: z.string().optional(),
  isRecorded: z.boolean(),
  maxDuration: z.number().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
  eventId: z.string(),
})

export type EventConferenceRo = z.infer<typeof eventConferenceRo>

// Event Participant RO
export const eventParticipantRo = z.object({
  id: z.string(),
  email: z.string(),
  name: z.string().optional(),
  role: participantRoleSchema,
  rsvpStatus: rsvpStatusSchema,
  isOrganizer: z.boolean(),
  notes: z.string().optional(),
  invitedAt: z.date(),
  respondedAt: z.date().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
  eventId: z.string(),
})

export type EventParticipantRo = z.infer<typeof eventParticipantRo>

// Event RO (With some key relations - calendar info)
export const eventRo = eventSimpleRo.extend({
  calendar: calendarSimpleRo.optional(),
})

export type EventRo = z.infer<typeof eventRo>

// Event Full RO (With ALL relations)
export const eventFullRo = eventSimpleRo.extend({
  calendar: calendarSimpleRo.optional(),
  recurrence: eventRecurrenceRo.optional(),
  reminders: z.array(eventReminderRo).optional(),
  conference: eventConferenceRo.optional(),
  participants: z.array(eventParticipantRo).optional(),
})

export type EventFullRo = z.infer<typeof eventFullRo>

// =============================================================================
// API RESPONSE WRAPPERS
// =============================================================================

// Create Event Response
export const createEventRo = z.object({
  success: z.boolean(),
  event: eventRo.optional(),
  error: z.string().optional(),
})

export type CreateEventRo = z.infer<typeof createEventRo>

// Get Event Response
export const getEventRo = z.object({
  success: z.boolean(),
  event: eventFullRo.optional(),
  error: z.string().optional(),
})

export type GetEventRo = z.infer<typeof getEventRo>

// Update Event Response
export const updateEventRo = z.object({
  success: z.boolean(),
  event: eventRo.optional(),
  error: z.string().optional(),
})

export type UpdateEventRo = z.infer<typeof updateEventRo>

// Delete Event Response
export const deleteEventRo = z.object({
  success: z.boolean(),
  error: z.string().optional(),
})

export type DeleteEventRo = z.infer<typeof deleteEventRo>

// List Events Response
export const listEventsRo = z.object({
  success: z.boolean(),
  events: z.array(eventRo).optional(),
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

export type ListEventsRo = z.infer<typeof listEventsRo>

// Process Events Response
export const processEventsRo = z.object({
  success: z.boolean(),
  events: z.array(eventRo).optional(),
  processingSession: z
    .object({
      id: z.string(),
      model: z.string(),
      provider: z.string(),
      processingTimeMs: z.number().optional(),
      tokensUsed: z.number().optional(),
      confidence: z.number().optional(),
    })
    .optional(),
  totalEvents: z.number().optional(),
  error: z.string().optional(),
})

export type ProcessEventsRo = z.infer<typeof processEventsRo>
