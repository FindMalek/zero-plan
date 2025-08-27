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
