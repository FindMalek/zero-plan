import { z } from "zod"

import { processingStatusSchema } from "../utils"

// =============================================================================
// PROCESSING CRUD DTOs (Data Transfer Objects - API Inputs)
// =============================================================================

// Create Processing Session DTO
export const createProcessingSessionDto = z.object({
  userInput: z
    .string()
    .min(1, "User input is required")
    .max(5000, "User input must be less than 5000 characters"),
  model: z.string().min(1, "Model is required"),
  provider: z.string().min(1, "Provider is required"),
})

export type CreateProcessingSessionDto = z.infer<
  typeof createProcessingSessionDto
>

// Get Processing Session DTO
export const getProcessingSessionDto = z.object({
  id: z.string().uuid("Invalid processing session ID"),
})

export type GetProcessingSessionDto = z.infer<typeof getProcessingSessionDto>

// Update Processing Session DTO
export const updateProcessingSessionDto = z.object({
  id: z.string().uuid("Invalid processing session ID"),
  metadata: z
    .record(z.string(), z.union([z.string(), z.number(), z.boolean()]))
    .optional(),
  processingTimeMs: z.number().int().positive().optional(),
  tokensUsed: z.number().int().positive().optional(),
  confidence: z.number().min(0).max(1).optional(),
  status: processingStatusSchema.optional(),
  errorMessage: z.string().optional(),
})

export type UpdateProcessingSessionDto = z.infer<
  typeof updateProcessingSessionDto
>

// Delete Processing Session DTO
export const deleteProcessingSessionDto = z.object({
  id: z.string().uuid("Invalid processing session ID"),
})

export type DeleteProcessingSessionDto = z.infer<
  typeof deleteProcessingSessionDto
>

// List Processing Sessions DTO
export const listProcessingSessionsDto = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(20),
  status: processingStatusSchema.optional(),
  model: z.string().optional(),
  provider: z.string().optional(),
  startDate: z.string().datetime().or(z.date()).optional(),
  endDate: z.string().datetime().or(z.date()).optional(),
})

export type ListProcessingSessionsDto = z.infer<
  typeof listProcessingSessionsDto
>

// =============================================================================
// DOMAIN-SPECIFIC DTOs
// =============================================================================

// Process Events DTO (moved from events domain)
export const processEventsDto = z.object({
  userInput: z
    .string()
    .min(1, "Input text is required")
    .max(2000, "Input must be less than 2000 characters"),
})

export type ProcessEventsDto = z.infer<typeof processEventsDto>
