import { z } from "zod"

import {
  participantRoleSchema,
  reminderUnitSchema,
  repeatPatternSchema,
  rsvpStatusSchema,
  timezoneSchema,
} from "../utils"

// =============================================================================
// CORE EVENT ENTITY SCHEMAS
// =============================================================================

// Event Recurrence Entity
export const eventRecurrenceEntitySchema = z.object({
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

export type EventRecurrenceEntity = z.infer<typeof eventRecurrenceEntitySchema>

// Event Reminder Entity
export const eventReminderEntitySchema = z.object({
  id: z.string(),
  value: z.number(),
  unit: reminderUnitSchema,
  createdAt: z.date(),
  updatedAt: z.date(),
  eventId: z.string(),
})

export type EventReminderEntity = z.infer<typeof eventReminderEntitySchema>

// Event Conference Entity
export const eventConferenceEntitySchema = z.object({
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

export type EventConferenceEntity = z.infer<typeof eventConferenceEntitySchema>

// Event Participant Entity
export const eventParticipantEntitySchema = z.object({
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

export type EventParticipantEntity = z.infer<
  typeof eventParticipantEntitySchema
>

// Core Event Entity
export const eventEntitySchema = z.object({
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
  documents: z.array(z.string()).optional(),
  aiConfidence: z.number().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
  userId: z.string(),
  calendarId: z.string(),
  // Relations (optional - for populated responses)
  recurrence: eventRecurrenceEntitySchema.optional(),
  reminders: z.array(eventReminderEntitySchema).optional(),
  conference: eventConferenceEntitySchema.optional(),
  participants: z.array(eventParticipantEntitySchema).optional(),
})

export type EventEntity = z.infer<typeof eventEntitySchema>

// =============================================================================
// SPECIALIZED EVENT SCHEMAS
// =============================================================================

// Event with all relations populated
export const eventWithRelationsSchema = eventEntitySchema.extend({
  recurrence: eventRecurrenceEntitySchema.optional(),
  reminders: z.array(eventReminderEntitySchema),
  conference: eventConferenceEntitySchema.optional(),
  participants: z.array(eventParticipantEntitySchema),
})

export type EventWithRelations = z.infer<typeof eventWithRelationsSchema>

// Event summary (minimal fields)
export const eventSummarySchema = z.object({
  id: z.string(),
  emoji: z.string(),
  title: z.string(),
  startTime: z.date(),
  endTime: z.date().optional(),
  isAllDay: z.boolean(),
  calendarId: z.string(),
})

export type EventSummary = z.infer<typeof eventSummarySchema>
