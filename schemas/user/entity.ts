import { z } from "zod"

import { calendarEntitySchema } from "../calendar/entity"
import { processingSessionEntitySchema } from "../processing/entity"

// =============================================================================
// CORE USER ENTITY SCHEMAS
// =============================================================================

// Core User Entity
export const userEntitySchema = z.object({
  id: z.string(),
  name: z.string().optional(),
  email: z.string(),
  emailVerified: z.boolean(),
  image: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
  // Relations (optional - for populated responses)
  calendars: z.array(calendarEntitySchema).optional(),
  inputProcessingSessions: z.array(processingSessionEntitySchema).optional(),
})

export type UserEntity = z.infer<typeof userEntitySchema>

// =============================================================================
// SPECIALIZED USER SCHEMAS
// =============================================================================

// User with all relations populated
export const userWithRelationsSchema = userEntitySchema.extend({
  calendars: z.array(calendarEntitySchema),
  inputProcessingSessions: z.array(processingSessionEntitySchema),
})

export type UserWithRelations = z.infer<typeof userWithRelationsSchema>

// User profile (public fields)
export const userProfileSchema = z.object({
  id: z.string(),
  name: z.string().optional(),
  image: z.string().optional(),
  createdAt: z.date(),
})

export type UserProfile = z.infer<typeof userProfileSchema>

// User summary (minimal fields)
export const userSummarySchema = z.object({
  id: z.string(),
  name: z.string().optional(),
  email: z.string(),
  emailVerified: z.boolean(),
})

export type UserSummary = z.infer<typeof userSummarySchema>

// User statistics
export const userStatsSchema = z.object({
  id: z.string(),
  name: z.string().optional(),
  totalCalendars: z.number(),
  totalEvents: z.number(),
  totalProcessingSessions: z.number(),
  successfulProcessingSessions: z.number(),
  joinedAt: z.date(),
})

export type UserStats = z.infer<typeof userStatsSchema>

// =============================================================================
// USER CONTEXT SCHEMAS (for AI event generation)
// =============================================================================

// User Location Schema
export const userLocationSchema = z.object({
  name: z.string(),
  address: z.string(),
  isDefault: z.boolean(),
  type: z.enum(["home", "work", "other"]),
})

export type UserLocation = z.infer<typeof userLocationSchema>

// Transportation Preference Schema
export const transportationPreferenceSchema = z.object({
  mode: z.enum(["car", "bike", "scooter", "walk", "bus", "taxi"]),
  isDefault: z.boolean(),
  estimatedSpeed: z.number(), // km/h
  setupTime: z.number(), // minutes needed to prepare
  emoji: z.string(),
})

export type TransportationPreference = z.infer<
  typeof transportationPreferenceSchema
>

// User Context Schema
export const userContextSchema = z.object({
  id: z.string(),
  name: z.string(),
  locations: z.array(userLocationSchema),
  transportation: z.array(transportationPreferenceSchema),
  preferences: z.object({
    defaultTravelBuffer: z.number(), // minutes before/after events
    preferredTravelMode: z.string(),
    workingHours: z.object({
      start: z.string(), // HH:mm
      end: z.string(), // HH:mm
    }),
  }),
})

export type UserContext = z.infer<typeof userContextSchema>
