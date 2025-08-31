import { z } from "zod"

import { eventSimpleRo } from "../event"
import { processingStatusSchema } from "../utils"

// =============================================================================
// PROCESSING RESPONSE OBJECTS (Three-Tier System)
// =============================================================================

// Processing Session Simple RO (Basic session - no relations)
export const processingSessionSimpleRo = z.object({
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
})

export type ProcessingSessionSimpleRo = z.infer<
  typeof processingSessionSimpleRo
>

// Processing Session RO (With basic stats)
export const processingSessionRo = processingSessionSimpleRo.extend({
  eventsCreated: z.number().optional(),
})

export type ProcessingSessionRo = z.infer<typeof processingSessionRo>

// Processing Session Full RO (With events)
export const processingSessionFullRo = processingSessionSimpleRo.extend({
  eventsCreated: z.number().optional(),
  events: z
    .array(
      z.object({
        id: z.string(),
        title: z.string(),
        emoji: z.string(),
        startTime: z.date(),
        endTime: z.date().optional(),
        calendarId: z.string(),
      })
    )
    .optional(),
})

export type ProcessingSessionFullRo = z.infer<typeof processingSessionFullRo>

// =============================================================================
// API RESPONSE WRAPPERS
// =============================================================================

// Create Processing Session Response
export const createProcessingSessionRo = z.object({
  success: z.boolean(),
  processingSession: processingSessionRo.optional(),
  error: z.string().optional(),
})

export type CreateProcessingSessionRo = z.infer<
  typeof createProcessingSessionRo
>

// Get Processing Session Response
export const getProcessingSessionRo = z.object({
  success: z.boolean(),
  processingSession: processingSessionFullRo.optional(),
  error: z.string().optional(),
})

export type GetProcessingSessionRo = z.infer<typeof getProcessingSessionRo>

// Update Processing Session Response
export const updateProcessingSessionRo = z.object({
  success: z.boolean(),
  processingSession: processingSessionRo.optional(),
  error: z.string().optional(),
})

export type UpdateProcessingSessionRo = z.infer<
  typeof updateProcessingSessionRo
>

// Delete Processing Session Response
export const deleteProcessingSessionRo = z.object({
  success: z.boolean(),
  error: z.string().optional(),
})

export type DeleteProcessingSessionRo = z.infer<
  typeof deleteProcessingSessionRo
>

// List Processing Sessions Response
export const listProcessingSessionsRo = z.object({
  success: z.boolean(),
  processingSessions: z.array(processingSessionRo).optional(),
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

export type ListProcessingSessionsRo = z.infer<typeof listProcessingSessionsRo>

// =============================================================================
// DOMAIN-SPECIFIC RESPONSES
// =============================================================================

// Process Events Response (moved from events domain)
export const processEventsRo = z.object({
  success: z.boolean(),
  events: z.array(eventSimpleRo).optional(),
  processingSession: processingSessionRo.optional(),
  totalEvents: z.number().optional(),
  error: z.string().optional(),
})

export type ProcessEventsRo = z.infer<typeof processEventsRo>
