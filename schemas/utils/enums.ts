import { z } from "zod"

// =============================================================================
// EVENT ENUMS
// =============================================================================

// Repeat Pattern Enum
const repeatPatternValues = [
  "NONE",
  "DAILY",
  "WEEKLY",
  "BIWEEKLY",
  "MONTHLY",
  "YEARLY",
  "CUSTOM",
] as const

export const repeatPatternSchema = z.enum(repeatPatternValues)
export const repeatPatternEnum = repeatPatternSchema.enum
export type RepeatPatternInfer = z.infer<typeof repeatPatternSchema>

// Timezone Enum
const timezoneValues = [
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
  "AUSTRALIA_SYDNEY",
] as const

export const timezoneSchema = z.enum(timezoneValues)
export const timezoneEnum = timezoneSchema.enum
export type TimezoneInfer = z.infer<typeof timezoneSchema>

// Reminder Unit Enum
const reminderUnitValues = ["MINUTES", "HOURS", "DAYS", "WEEKS"] as const

export const reminderUnitSchema = z.enum(reminderUnitValues)
export const reminderUnitEnum = reminderUnitSchema.enum
export type ReminderUnitInfer = z.infer<typeof reminderUnitSchema>

// RSVP Status Enum
const rsvpStatusValues = [
  "PENDING",
  "ACCEPTED",
  "DECLINED",
  "MAYBE",
  "NO_RESPONSE",
] as const

export const rsvpStatusSchema = z.enum(rsvpStatusValues)
export const rsvpStatusEnum = rsvpStatusSchema.enum
export type RsvpStatusInfer = z.infer<typeof rsvpStatusSchema>

// Participant Role Enum
const participantRoleValues = [
  "ORGANIZER",
  "ATTENDEE",
  "OPTIONAL_ATTENDEE",
  "PRESENTER",
  "MODERATOR",
] as const

export const participantRoleSchema = z.enum(participantRoleValues)
export const participantRoleEnum = participantRoleSchema.enum
export type ParticipantRoleInfer = z.infer<typeof participantRoleSchema>

// =============================================================================
// PROCESSING ENUMS
// =============================================================================

// Processing Status Enum
const processingStatusValues = [
  "PENDING",
  "PROCESSING",
  "COMPLETED",
  "FAILED",
  "RETRY",
] as const

export const processingStatusSchema = z.enum(processingStatusValues)
export const processingStatusEnum = processingStatusSchema.enum
export type ProcessingStatusInfer = z.infer<typeof processingStatusSchema>

// =============================================================================
// COMMON ENUMS (for future use)
// =============================================================================

// Status Enum (generic)
const statusValues = ["ACTIVE", "INACTIVE", "DELETED"] as const

export const statusSchema = z.enum(statusValues)
export const statusEnum = statusSchema.enum
export type StatusInfer = z.infer<typeof statusSchema>

// Priority Enum (generic)
const priorityValues = ["LOW", "MEDIUM", "HIGH", "URGENT"] as const

export const prioritySchema = z.enum(priorityValues)
export const priorityEnum = prioritySchema.enum
export type PriorityInfer = z.infer<typeof prioritySchema>
