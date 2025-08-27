import { z } from "zod"
import { eventStatusSchema, eventPrioritySchema, eventCategorySchema } from "./event"

// Create Event Input
export const createEventInputSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title must be less than 200 characters"),
  description: z.string().max(1000, "Description must be less than 1000 characters").optional(),
  startTime: z.string().datetime().or(z.date()),
  endTime: z.string().datetime().or(z.date()).optional(),
  location: z.string().max(500, "Location must be less than 500 characters").optional(),
  priority: eventPrioritySchema.optional(),
  category: eventCategorySchema.optional(),
})

export type CreateEventInput = z.infer<typeof createEventInputSchema>

// Create Event Output
export const createEventOutputSchema = z.object({
  success: z.boolean(),
  event: z.object({
    id: z.string(),
    title: z.string(),
    startTime: z.date(),
    endTime: z.date().optional(),
    status: eventStatusSchema,
    priority: eventPrioritySchema,
    category: eventCategorySchema,
  }).optional(),
  error: z.string().optional(),
})

export type CreateEventOutput = z.infer<typeof createEventOutputSchema>

// Update Event Input
export const updateEventInputSchema = z.object({
  id: z.string().uuid("Invalid event ID"),
  title: z.string().min(1, "Title is required").max(200, "Title must be less than 200 characters").optional(),
  description: z.string().max(1000, "Description must be less than 1000 characters").optional(),
  startTime: z.string().datetime().or(z.date()).optional(),
  endTime: z.string().datetime().or(z.date()).optional(),
  location: z.string().max(500, "Location must be less than 500 characters").optional(),
  status: eventStatusSchema.optional(),
  priority: eventPrioritySchema.optional(),
  category: eventCategorySchema.optional(),
})

export type UpdateEventInput = z.infer<typeof updateEventInputSchema>

// Update Event Output
export const updateEventOutputSchema = z.object({
  success: z.boolean(),
  event: z.object({
    id: z.string(),
    title: z.string(),
    startTime: z.date(),
    endTime: z.date().optional(),
    status: eventStatusSchema,
    priority: eventPrioritySchema,
    category: eventCategorySchema,
    updatedAt: z.date(),
  }).optional(),
  error: z.string().optional(),
})

export type UpdateEventOutput = z.infer<typeof updateEventOutputSchema>

// Get Event Input
export const getEventInputSchema = z.object({
  id: z.string().uuid("Invalid event ID"),
})

export type GetEventInput = z.infer<typeof getEventInputSchema>

// Get Event Output
export const getEventOutputSchema = z.object({
  success: z.boolean(),
  event: z.object({
    id: z.string(),
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
  }).optional(),
  error: z.string().optional(),
})

export type GetEventOutput = z.infer<typeof getEventOutputSchema>

// Delete Event Input
export const deleteEventInputSchema = z.object({
  id: z.string().uuid("Invalid event ID"),
})

export type DeleteEventInput = z.infer<typeof deleteEventInputSchema>

// Delete Event Output
export const deleteEventOutputSchema = z.object({
  success: z.boolean(),
  error: z.string().optional(),
})

export type DeleteEventOutput = z.infer<typeof deleteEventOutputSchema>

// List Events Input
export const listEventsInputSchema = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(20),
  status: eventStatusSchema.optional(),
  category: eventCategorySchema.optional(),
  priority: eventPrioritySchema.optional(),
  search: z.string().optional(),
  startDate: z.string().datetime().or(z.date()).optional(),
  endDate: z.string().datetime().or(z.date()).optional(),
})

export type ListEventsInput = z.infer<typeof listEventsInputSchema>

// List Events Output
export const listEventsOutputSchema = z.object({
  success: z.boolean(),
  events: z.array(z.object({
    id: z.string(),
    title: z.string(),
    description: z.string().optional(),
    startTime: z.date(),
    endTime: z.date().optional(),
    location: z.string().optional(),
    status: eventStatusSchema,
    priority: eventPrioritySchema,
    category: eventCategorySchema,
    aiProcessed: z.boolean(),
    createdAt: z.date(),
    updatedAt: z.date(),
  })).optional(),
  pagination: z.object({
    page: z.number(),
    limit: z.number(),
    total: z.number(),
    totalPages: z.number(),
  }).optional(),
  error: z.string().optional(),
})

export type ListEventsOutput = z.infer<typeof listEventsOutputSchema>

// AI Process Event Input
export const aiProcessEventInputSchema = z.object({
  rawInput: z.string().min(1, "Input text is required").max(2000, "Input must be less than 2000 characters"),
  model: z.string().optional().default("llama-3.1-8b-instant"),
  provider: z.string().optional().default("groq"),
})

export type AIProcessEventInput = z.infer<typeof aiProcessEventInputSchema>

// AI Process Event Output
export const aiProcessEventOutputSchema = z.object({
  success: z.boolean(),
  events: z.array(z.object({
    id: z.string(),
    title: z.string(),
    description: z.string().optional(),
    startTime: z.date(),
    endTime: z.date().optional(),
    location: z.string().optional(),
    priority: eventPrioritySchema,
    category: eventCategorySchema,
    aiProcessed: z.boolean(),
    aiConfidence: z.number().optional(),
  })).optional(),
  // Backward compatibility - first event
  event: z.object({
    id: z.string(),
    title: z.string(),
    description: z.string().optional(),
    startTime: z.date(),
    endTime: z.date().optional(),
    location: z.string().optional(),
    priority: eventPrioritySchema,
    category: eventCategorySchema,
    aiProcessed: z.boolean(),
    aiConfidence: z.number().optional(),
  }).optional(),
  aiProcessing: z.object({
    id: z.string(),
    model: z.string(),
    provider: z.string(),
    processingTime: z.number().optional(),
    confidence: z.number().optional(),
  }).optional(),
  totalEvents: z.number().optional(),
  error: z.string().optional(),
})

export type AIProcessEventOutput = z.infer<typeof aiProcessEventOutputSchema>
