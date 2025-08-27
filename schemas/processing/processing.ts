import { z } from "zod"

// Processing Status Enum
export const processingStatusEnum = {
  PENDING: "PENDING",
  PROCESSING: "PROCESSING",
  COMPLETED: "COMPLETED",
  FAILED: "FAILED",
  RETRY: "RETRY",
} as const

export const processingStatusSchema = z.enum(["PENDING", "PROCESSING", "COMPLETED", "FAILED", "RETRY"])
export type ProcessingStatusInfer = z.infer<typeof processingStatusSchema>

// Input Processing Session Schema
export const inputProcessingSessionSchema = z.object({
  id: z.string().uuid(),
  userInput: z.string().min(1, "User input is required"),
  processedOutput: z.record(z.string(), z.union([z.string(), z.number(), z.boolean(), z.array(z.unknown())])),
  model: z.string().min(1, "Model is required"),
  provider: z.string().min(1, "Provider is required"),
  processingTimeMs: z.number().int().positive().optional(),
  tokensUsed: z.number().int().positive().optional(),
  confidence: z.number().min(0).max(1).optional(),
  status: processingStatusSchema.default("PENDING"),
  errorMessage: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
  eventId: z.string().uuid().optional(),
  userId: z.string().uuid(),
})

export type InputProcessingSessionInfer = z.infer<typeof inputProcessingSessionSchema>

// Input Processing Session Simple Response Object
export const inputProcessingSessionSimpleRoSchema = z.object({
  id: z.string().uuid(),
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

export type InputProcessingSessionSimpleRo = z.infer<typeof inputProcessingSessionSimpleRoSchema>
