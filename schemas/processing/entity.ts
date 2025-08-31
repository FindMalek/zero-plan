import { z } from "zod"

import { eventEntitySchema } from "../event/entity"
import { processingStatusSchema } from "../utils"

// =============================================================================
// CORE PROCESSING ENTITY SCHEMAS
// =============================================================================

// Core Processing Session Entity
export const processingSessionEntitySchema = z.object({
  id: z.string(),
  userInput: z.string(),
  model: z.string(),
  provider: z.string(),
  status: processingStatusSchema,
  processingTimeMs: z.number().optional(),
  tokensUsed: z.number().optional(),
  confidence: z.number().optional(),
  metadata: z
    .record(z.string(), z.union([z.string(), z.number(), z.boolean()]))
    .optional(),
  errorMessage: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
  userId: z.string(),
  // Relations (optional - for populated responses)
  events: z.array(eventEntitySchema).optional(),
})

export type ProcessingSessionEntity = z.infer<
  typeof processingSessionEntitySchema
>

// =============================================================================
// SPECIALIZED PROCESSING SCHEMAS
// =============================================================================

// Processing session with events populated
export const processingSessionWithEventsSchema =
  processingSessionEntitySchema.extend({
    events: z.array(eventEntitySchema),
  })

export type ProcessingSessionWithEvents = z.infer<
  typeof processingSessionWithEventsSchema
>

// Processing session summary (minimal fields)
export const processingSessionSummarySchema = z.object({
  id: z.string(),
  userInput: z.string(),
  status: processingStatusSchema,
  eventsCreated: z.number(),
  confidence: z.number().optional(),
  createdAt: z.date(),
})

export type ProcessingSessionSummary = z.infer<
  typeof processingSessionSummarySchema
>

// Processing statistics
export const processingStatsSchema = z.object({
  totalSessions: z.number(),
  successfulSessions: z.number(),
  failedSessions: z.number(),
  averageProcessingTime: z.number().optional(),
  averageConfidence: z.number().optional(),
  totalEventsCreated: z.number(),
})

export type ProcessingStats = z.infer<typeof processingStatsSchema>
