import { z } from "zod"

// Event Status Enum
export const eventStatusEnum = {
  PLANNED: "PLANNED",
  IN_PROGRESS: "IN_PROGRESS", 
  COMPLETED: "COMPLETED",
  CANCELLED: "CANCELLED",
  POSTPONED: "POSTPONED",
} as const

export const eventStatusSchema = z.enum(["PLANNED", "IN_PROGRESS", "COMPLETED", "CANCELLED", "POSTPONED"])
export type EventStatusInfer = z.infer<typeof eventStatusSchema>

// Event Priority Enum
export const eventPriorityEnum = {
  LOW: "LOW",
  MEDIUM: "MEDIUM",
  HIGH: "HIGH", 
  URGENT: "URGENT",
} as const

export const eventPrioritySchema = z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"])
export type EventPriorityInfer = z.infer<typeof eventPrioritySchema>

// Event Category Enum
export const eventCategoryEnum = {
  PERSONAL: "PERSONAL",
  WORK: "WORK",
  MEETING: "MEETING",
  APPOINTMENT: "APPOINTMENT",
  REMINDER: "REMINDER",
  SOCIAL: "SOCIAL",
  TRAVEL: "TRAVEL",
  HEALTH: "HEALTH",
  EDUCATION: "EDUCATION",
  OTHER: "OTHER",
} as const

export const eventCategorySchema = z.enum([
  "PERSONAL", "WORK", "MEETING", "APPOINTMENT", "REMINDER", 
  "SOCIAL", "TRAVEL", "HEALTH", "EDUCATION", "OTHER"
])
export type EventCategoryInfer = z.infer<typeof eventCategorySchema>

// AI Processing Status Enum
export const aiProcessingStatusEnum = {
  PENDING: "PENDING",
  PROCESSING: "PROCESSING",
  COMPLETED: "COMPLETED",
  FAILED: "FAILED",
  RETRY: "RETRY",
} as const

export const aiProcessingStatusSchema = z.enum(["PENDING", "PROCESSING", "COMPLETED", "FAILED", "RETRY"])
export type AIProcessingStatusInfer = z.infer<typeof aiProcessingStatusSchema>

// Event Schema
export const eventSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1, "Title is required").max(200, "Title must be less than 200 characters"),
  description: z.string().max(1000, "Description must be less than 1000 characters").optional(),
  startTime: z.date(),
  endTime: z.date().optional(),
  location: z.string().max(500, "Location must be less than 500 characters").optional(),
  status: eventStatusSchema.default("PLANNED"),
  priority: eventPrioritySchema.default("MEDIUM"),
  category: eventCategorySchema.default("PERSONAL"),
  originalInput: z.string().optional(),
  aiProcessed: z.boolean().default(false),
  aiConfidence: z.number().min(0).max(1).optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
  userId: z.string().uuid(),
})

export type EventInfer = z.infer<typeof eventSchema>

// Event Simple Response Object
export const eventSimpleRoSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  description: z.string().optional(),
  startTime: z.date(),
  endTime: z.date().optional(),
  location: z.string().optional(),
  status: eventStatusSchema,
  priority: eventPrioritySchema,
  category: eventCategorySchema,
  originalInput: z.string().optional(),
  aiProcessed: z.boolean(),
  aiConfidence: z.number().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
  userId: z.string(),
})

export type EventSimpleRo = z.infer<typeof eventSimpleRoSchema>

// Event AI Schema
export const eventAISchema = z.object({
  id: z.string().uuid(),
  rawInput: z.string(),
  processedOutput: z.record(z.any()), // JSON object
  model: z.string(),
  provider: z.string(),
  processingTime: z.number().optional(),

  confidence: z.number().min(0).max(1).optional(),
  status: aiProcessingStatusSchema.default("PENDING"),
  createdAt: z.date(),
  updatedAt: z.date(),
  eventId: z.string().uuid(),
})

export type EventAIInfer = z.infer<typeof eventAISchema>

// Event AI Simple Response Object
export const eventAISimpleRoSchema = z.object({
  id: z.string().uuid(),
  rawInput: z.string(),
  processedOutput: z.record(z.any()),
  model: z.string(),
  provider: z.string(),
  processingTime: z.number().optional(),

  confidence: z.number().optional(),
  status: aiProcessingStatusSchema,
  createdAt: z.date(),
  updatedAt: z.date(),
  eventId: z.string(),
})

export type EventAISimpleRo = z.infer<typeof eventAISimpleRoSchema>
