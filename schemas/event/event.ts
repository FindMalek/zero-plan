import { z } from "zod"

// Repeat Pattern Enum
export const repeatPatternEnum = {
  NONE: "NONE",
  DAILY: "DAILY",
  WEEKLY: "WEEKLY",
  BIWEEKLY: "BIWEEKLY",
  MONTHLY: "MONTHLY",
  YEARLY: "YEARLY",
  CUSTOM: "CUSTOM",
} as const

export const repeatPatternSchema = z.enum(["NONE", "DAILY", "WEEKLY", "BIWEEKLY", "MONTHLY", "YEARLY", "CUSTOM"])
export type RepeatPatternInfer = z.infer<typeof repeatPatternSchema>

// Timezone Enum
export const timezoneEnum = {
  UTC: "UTC",
  AMERICA_NEW_YORK: "AMERICA_NEW_YORK",
  AMERICA_CHICAGO: "AMERICA_CHICAGO",
  AMERICA_DENVER: "AMERICA_DENVER",
  AMERICA_LOS_ANGELES: "AMERICA_LOS_ANGELES",
  EUROPE_LONDON: "EUROPE_LONDON",
  EUROPE_PARIS: "EUROPE_PARIS",
  EUROPE_BERLIN: "EUROPE_BERLIN",
  ASIA_TOKYO: "ASIA_TOKYO",
  ASIA_SINGAPORE: "ASIA_SINGAPORE",
  ASIA_DUBAI: "ASIA_DUBAI",
  AUSTRALIA_SYDNEY: "AUSTRALIA_SYDNEY",
} as const

export const timezoneSchema = z.enum([
  "UTC",
  "AMERICA_NEW_YORK",
  "AMERICA_CHICAGO", 
  "AMERICA_DENVER",
  "AMERICA_LOS_ANGELES",
  "EUROPE_LONDON",
  "EUROPE_PARIS",
  "EUROPE_BERLIN",
  "ASIA_TOKYO",
  "ASIA_SINGAPORE",
  "ASIA_DUBAI",
  "AUSTRALIA_SYDNEY"
])
export type TimezoneInfer = z.infer<typeof timezoneSchema>

// Reminder Unit Enum
export const reminderUnitEnum = {
  MINUTES: "MINUTES",
  HOURS: "HOURS",
  DAYS: "DAYS",
  WEEKS: "WEEKS",
} as const

export const reminderUnitSchema = z.enum(["MINUTES", "HOURS", "DAYS", "WEEKS"])
export type ReminderUnitInfer = z.infer<typeof reminderUnitSchema>

// Event Schema
export const eventSchema = z.object({
  id: z.string().uuid(),
  emoji: z.string().min(1, "Emoji is required").default("📅"),
  title: z.string().min(1, "Title is required").max(200, "Title must be less than 200 characters"),
  description: z.string().max(1000, "Description must be less than 1000 characters").optional(),
  startTime: z.date(),
  endTime: z.date().optional(),
  timezone: timezoneSchema.default("UTC"),
  isAllDay: z.boolean().default(false),
  location: z.string().max(500, "Location must be less than 500 characters").optional(),
  meetingRoom: z.string().max(200, "Meeting room must be less than 200 characters").optional(),
  conferenceLink: z.string().url("Conference link must be a valid URL").optional(),
  conferenceId: z.string().max(100, "Conference ID must be less than 100 characters").optional(),
  participantEmails: z.array(z.string().email()).optional(),
  maxParticipants: z.number().int().positive().optional(),
  links: z.array(z.string().url()).optional(),
  documents: z.array(z.string().url()).optional(),
  aiConfidence: z.number().min(0).max(1).optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
  userId: z.string().uuid(),
  calendarId: z.string().uuid(),
})

export type EventInfer = z.infer<typeof eventSchema>

// Event Simple Response Object
export const eventSimpleRoSchema = z.object({
  id: z.string().uuid(),
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

export type EventSimpleRo = z.infer<typeof eventSimpleRoSchema>

// Event Recurrence Schema
export const eventRecurrenceSchema = z.object({
  id: z.string().uuid(),
  pattern: repeatPatternSchema.default("NONE"),
  endDate: z.date().optional(),
  customRule: z.record(z.string(), z.union([z.string(), z.number(), z.boolean()])).optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
  eventId: z.string().uuid(),
})

export type EventRecurrenceInfer = z.infer<typeof eventRecurrenceSchema>

// Event Reminder Schema
export const eventReminderSchema = z.object({
  id: z.string().uuid(),
  value: z.number().int().positive(),
  unit: reminderUnitSchema,
  createdAt: z.date(),
  updatedAt: z.date(),
  eventId: z.string().uuid(),
})

export type EventReminderInfer = z.infer<typeof eventReminderSchema>


