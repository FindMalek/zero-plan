import { z } from "zod"
import { processingStatusSchema } from "../utils"

// Processing Session Response Object
export const processingSessionRoSchema = z.object({
  id: z.string(),
  userInput: z.string(),
  processedOutput: z.record(z.string(), z.union([z.string(), z.number(), z.boolean(), z.array(z.unknown())])),
  model: z.string(),
  provider: z.string(),
  processingTimeMs: z.number().optional(),
  tokensUsed: z.number().optional(),
  confidence: z.number().optional(),
  status: processingStatusSchema,
  errorMessage: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
  eventId: z.string().optional(),
  userId: z.string(),
})

export type ProcessingSessionRo = z.infer<typeof processingSessionRoSchema>

// Create Processing Session Output
export const createProcessingSessionOutputSchema = z.object({
  success: z.boolean(),
  processingSession: z.object({
    id: z.string(),
    userInput: z.string(),
    model: z.string(),
    provider: z.string(),
    status: processingStatusSchema,
    createdAt: z.date(),
  }).optional(),
  error: z.string().optional(),
})

export type CreateProcessingSessionOutput = z.infer<typeof createProcessingSessionOutputSchema>

// Update Processing Session Output
export const updateProcessingSessionOutputSchema = z.object({
  success: z.boolean(),
  processingSession: processingSessionRoSchema.optional(),
  error: z.string().optional(),
})

export type UpdateProcessingSessionOutput = z.infer<typeof updateProcessingSessionOutputSchema>

// Get Processing Session Output
export const getProcessingSessionOutputSchema = z.object({
  success: z.boolean(),
  processingSession: processingSessionRoSchema.optional(),
  error: z.string().optional(),
})

export type GetProcessingSessionOutput = z.infer<typeof getProcessingSessionOutputSchema>

// Delete Processing Session Output
export const deleteProcessingSessionOutputSchema = z.object({
  success: z.boolean(),
  error: z.string().optional(),
})

export type DeleteProcessingSessionOutput = z.infer<typeof deleteProcessingSessionOutputSchema>

// List Processing Sessions Output
export const listProcessingSessionsOutputSchema = z.object({
  success: z.boolean(),
  processingSessions: z.array(z.object({
    id: z.string(),
    userInput: z.string(),
    model: z.string(),
    provider: z.string(),
    processingTimeMs: z.number().optional(),
    tokensUsed: z.number().optional(),
    confidence: z.number().optional(),
    status: processingStatusSchema,
    errorMessage: z.string().optional(),
    createdAt: z.date(),
    updatedAt: z.date(),
    eventId: z.string().optional(),
  })).optional(),
  pagination: z.object({
    page: z.number(),
    limit: z.number(),
    total: z.number(),
    totalPages: z.number(),
  }).optional(),
  error: z.string().optional(),
})

export type ListProcessingSessionsOutput = z.infer<typeof listProcessingSessionsOutputSchema>
