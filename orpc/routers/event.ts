import { EventEntity, EventQuery } from "@/entities/event"
import { database } from "@/prisma/client"
import {
  aiProcessEventInputSchema,
  aiProcessEventOutputSchema,
  createEventInputSchema,
  createEventOutputSchema,
  deleteEventInputSchema,
  deleteEventOutputSchema,
  getEventInputSchema,
  getEventOutputSchema,
  listEventsInputSchema,
  listEventsOutputSchema,
  updateEventInputSchema,
  updateEventOutputSchema,
  type AIProcessEventInput,
  type AIProcessEventOutput,
  type CreateEventInput,
  type CreateEventOutput,
  type DeleteEventInput,
  type DeleteEventOutput,
  type GetEventInput,
  type GetEventOutput,
  type ListEventsInput,
  type ListEventsOutput,
  type UpdateEventInput,
  type UpdateEventOutput,
} from "@/schemas/event"
import { createGroq } from "@ai-sdk/groq"
import { ORPCError, os } from "@orpc/server"
import { generateObject } from "ai"
import { z } from "zod"

import { env } from "@/env"

import type { ORPCContext } from "../types"

// Temporary Prisma client error types until database is created
type PrismaClientKnownRequestError = {
  code: string
  message: string
  meta?: any
}

// Create Groq client with API key
const groq = createGroq({
  apiKey: env.GROQ_API_KEY,
})

const baseProcedure = os.$context<ORPCContext>()

const privateProcedure = baseProcedure.use(({ context, next }) => {
  if (!context.user) {
    throw new ORPCError("UNAUTHORIZED")
  }

  return next({ context: { ...context, user: context.user } })
})

// Schema for AI output - supports multiple events
const aiEventOutputSchema = z.object({
  events: z
    .array(
      z.object({
        title: z
          .string()
          .min(1)
          .max(200)
          .describe(
            "Title with emoji prefix (1-2 emojis) describing the event"
          ),
        description: z
          .string()
          .max(1000)
          .optional()
          .describe("Meaningful description, not placeholder text"),
        startTime: z.string().datetime(),
        endTime: z.string().datetime().optional(),
        location: z.string().max(500).optional(),
        priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]),
        category: z.enum([
          "PERSONAL",
          "WORK",
          "MEETING",
          "APPOINTMENT",
          "REMINDER",
          "SOCIAL",
          "TRAVEL",
          "HEALTH",
          "EDUCATION",
          "OTHER",
        ]),
        confidence: z.number().min(0).max(1),
      })
    )
    .min(1)
    .describe(
      "Array of events - can be multiple if the input describes several events"
    ),
})

// Create Event
export const createEvent = privateProcedure
  .input(createEventInputSchema)
  .output(createEventOutputSchema)
  .handler(async ({ input, context }): Promise<CreateEventOutput> => {
    try {
      const startTime =
        typeof input.startTime === "string"
          ? new Date(input.startTime)
          : input.startTime
      const endTime = input.endTime
        ? typeof input.endTime === "string"
          ? new Date(input.endTime)
          : input.endTime
        : undefined

      // Validate that endTime is after startTime
      if (endTime && endTime <= startTime) {
        return {
          success: false,
          error: "End time must be after start time",
        }
      }

      const event = await database.event.create({
        data: {
          title: input.title,
          description: input.description,
          startTime,
          endTime,
          location: input.location,
          priority: input.priority
            ? EventEntity.convertEventPriorityToPrisma(input.priority)
            : "MEDIUM",
          category: input.category
            ? EventEntity.convertEventCategoryToPrisma(input.category)
            : "PERSONAL",
          userId: context.user.id,
        },
        select: EventQuery.getSimpleSelect(),
      })

      const eventRo = EventEntity.getSimpleRo(event)

      return {
        success: true,
        event: {
          id: eventRo.id,
          title: eventRo.title,
          startTime: eventRo.startTime,
          endTime: eventRo.endTime,
          status: eventRo.status,
          priority: eventRo.priority,
          category: eventRo.category,
        },
      }
    } catch (error: any) {
      if (error instanceof ORPCError) {
        throw error
      }

      if (error && typeof error === "object" && "code" in error) {
        console.error("Database error creating event:", {
          code: (error as any).code,
          message: (error as any).message,
          meta: (error as any).meta,
        })

        return {
          success: false,
          error: "Database error occurred while creating event",
        }
      }

      console.error("Unexpected error creating event:", error)
      return {
        success: false,
        error: "An unexpected error occurred. Please try again later.",
      }
    }
  })

// Update Event
export const updateEvent = privateProcedure
  .input(updateEventInputSchema)
  .output(updateEventOutputSchema)
  .handler(async ({ input, context }): Promise<UpdateEventOutput> => {
    try {
      // Check if event exists and belongs to user
      const existingEvent = await database.event.findFirst({
        where: {
          id: input.id,
          userId: context.user.id,
        },
      })

      if (!existingEvent) {
        return {
          success: false,
          error: "Event not found or you don't have permission to update it",
        }
      }

      const startTime = input.startTime
        ? typeof input.startTime === "string"
          ? new Date(input.startTime)
          : input.startTime
        : undefined
      const endTime = input.endTime
        ? typeof input.endTime === "string"
          ? new Date(input.endTime)
          : input.endTime
        : undefined

      // Validate that endTime is after startTime if both are provided
      if (startTime && endTime && endTime <= startTime) {
        return {
          success: false,
          error: "End time must be after start time",
        }
      }

      const updateData: any = {}
      if (input.title !== undefined) updateData.title = input.title
      if (input.description !== undefined)
        updateData.description = input.description
      if (startTime !== undefined) updateData.startTime = startTime
      if (endTime !== undefined) updateData.endTime = endTime
      if (input.location !== undefined) updateData.location = input.location
      if (input.status !== undefined)
        updateData.status = EventEntity.convertEventStatusToPrisma(input.status)
      if (input.priority !== undefined)
        updateData.priority = EventEntity.convertEventPriorityToPrisma(
          input.priority
        )
      if (input.category !== undefined)
        updateData.category = EventEntity.convertEventCategoryToPrisma(
          input.category
        )

      const event = await database.event.update({
        where: { id: input.id },
        data: updateData,
        select: EventQuery.getSimpleSelect(),
      })

      const eventRo = EventEntity.getSimpleRo(event)

      return {
        success: true,
        event: {
          id: eventRo.id,
          title: eventRo.title,
          startTime: eventRo.startTime,
          endTime: eventRo.endTime,
          status: eventRo.status,
          priority: eventRo.priority,
          category: eventRo.category,
          updatedAt: eventRo.updatedAt,
        },
      }
    } catch (error: any) {
      if (error instanceof ORPCError) {
        throw error
      }

      if (error && typeof error === "object" && "code" in error) {
        console.error("Database error updating event:", {
          code: (error as any).code,
          message: (error as any).message,
          meta: (error as any).meta,
        })

        return {
          success: false,
          error: "Database error occurred while updating event",
        }
      }

      console.error("Unexpected error updating event:", error)
      return {
        success: false,
        error: "An unexpected error occurred. Please try again later.",
      }
    }
  })

// Get Event
export const getEvent = privateProcedure
  .input(getEventInputSchema)
  .output(getEventOutputSchema)
  .handler(async ({ input, context }): Promise<GetEventOutput> => {
    try {
      const event = await database.event.findFirst({
        where: {
          id: input.id,
          userId: context.user.id,
        },
        select: EventQuery.getSimpleSelect(),
      })

      if (!event) {
        return {
          success: false,
          error: "Event not found or you don't have permission to view it",
        }
      }

      const eventRo = EventEntity.getSimpleRo(event)

      return {
        success: true,
        event: eventRo,
      }
    } catch (error: any) {
      if (error instanceof ORPCError) {
        throw error
      }

      console.error("Unexpected error getting event:", error)
      return {
        success: false,
        error: "An unexpected error occurred. Please try again later.",
      }
    }
  })

// Delete Event
export const deleteEvent = privateProcedure
  .input(deleteEventInputSchema)
  .output(deleteEventOutputSchema)
  .handler(async ({ input, context }): Promise<DeleteEventOutput> => {
    try {
      // Check if event exists and belongs to user
      const existingEvent = await database.event.findFirst({
        where: {
          id: input.id,
          userId: context.user.id,
        },
      })

      if (!existingEvent) {
        return {
          success: false,
          error: "Event not found or you don't have permission to delete it",
        }
      }

      await database.event.delete({
        where: { id: input.id },
      })

      return {
        success: true,
      }
    } catch (error: any) {
      if (error instanceof ORPCError) {
        throw error
      }

      if (error && typeof error === "object" && "code" in error) {
        console.error("Database error deleting event:", {
          code: (error as any).code,
          message: (error as any).message,
          meta: (error as any).meta,
        })

        return {
          success: false,
          error: "Database error occurred while deleting event",
        }
      }

      console.error("Unexpected error deleting event:", error)
      return {
        success: false,
        error: "An unexpected error occurred. Please try again later.",
      }
    }
  })

// List Events
export const listEvents = privateProcedure
  .input(listEventsInputSchema)
  .output(listEventsOutputSchema)
  .handler(async ({ input, context }): Promise<ListEventsOutput> => {
    try {
      const where: any = {
        userId: context.user.id,
      }

      // Add filters
      if (input.status) {
        where.status = EventEntity.convertEventStatusToPrisma(input.status)
      }
      if (input.category) {
        where.category = EventEntity.convertEventCategoryToPrisma(
          input.category
        )
      }
      if (input.priority) {
        where.priority = EventEntity.convertEventPriorityToPrisma(
          input.priority
        )
      }
      if (input.search) {
        where.OR = [
          { title: { contains: input.search, mode: "insensitive" } },
          { description: { contains: input.search, mode: "insensitive" } },
          { location: { contains: input.search, mode: "insensitive" } },
        ]
      }
      if (input.startDate || input.endDate) {
        where.startTime = {}
        if (input.startDate) {
          const startDate =
            typeof input.startDate === "string"
              ? new Date(input.startDate)
              : input.startDate
          where.startTime.gte = startDate
        }
        if (input.endDate) {
          const endDate =
            typeof input.endDate === "string"
              ? new Date(input.endDate)
              : input.endDate
          where.startTime.lte = endDate
        }
      }

      const [events, total] = await Promise.all([
        database.event.findMany({
          where,
          select: EventQuery.getSimpleSelect(),
          orderBy: { startTime: "asc" },
          skip: (input.page - 1) * input.limit,
          take: input.limit,
        }),
        database.event.count({ where }),
      ])

      const eventsRo = events.map((event: any) => {
        const eventRo = EventEntity.getSimpleRo(event)
        return {
          id: eventRo.id,
          title: eventRo.title,
          description: eventRo.description,
          startTime: eventRo.startTime,
          endTime: eventRo.endTime,
          location: eventRo.location,
          status: eventRo.status,
          priority: eventRo.priority,
          category: eventRo.category,
          aiProcessed: eventRo.aiProcessed,
          createdAt: eventRo.createdAt,
          updatedAt: eventRo.updatedAt,
        }
      })

      const totalPages = Math.ceil(total / input.limit)

      return {
        success: true,
        events: eventsRo,
        pagination: {
          page: input.page,
          limit: input.limit,
          total,
          totalPages,
        },
      }
    } catch (error) {
      if (error instanceof ORPCError) {
        throw error
      }

      console.error("Unexpected error listing events:", error)
      return {
        success: false,
        error: "An unexpected error occurred. Please try again later.",
      }
    }
  })

// AI Process Event (temporarily public for MVP testing)
export const aiProcessEvent = baseProcedure
  .input(aiProcessEventInputSchema)
  .output(aiProcessEventOutputSchema)
  .handler(async ({ input, context }): Promise<AIProcessEventOutput> => {
    try {
      const startTime = Date.now()

      try {
        // Parse dates relative to current time
        const now = new Date()
        const currentDateTime = now.toISOString()

        // AI Tools for better date/time parsing
        const tools = {
          getCurrentDateTime: {
            description: "Get the current date and time",
            parameters: z.object({}),
            execute: async () => {
              const now = new Date()
              return {
                currentDateTime: now.toISOString(),
                currentTime: now.toTimeString(),
                currentDate: now.toDateString(),
                timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
              }
            },
          },
          getRelativeDateTime: {
            description:
              "Calculate relative date/time from phrases like 'tomorrow', 'next week', 'in 2 hours'",
            parameters: z.object({
              phrase: z.string().describe("The relative time phrase to parse"),
            }),
            execute: async ({ phrase }: { phrase: string }) => {
              const now = new Date()
              const lowerPhrase = phrase.toLowerCase()

              // Basic relative time parsing
              if (lowerPhrase.includes("tomorrow")) {
                const tomorrow = new Date(now)
                tomorrow.setDate(tomorrow.getDate() + 1)
                return { dateTime: tomorrow.toISOString() }
              }

              if (lowerPhrase.includes("next week")) {
                const nextWeek = new Date(now)
                nextWeek.setDate(nextWeek.getDate() + 7)
                return { dateTime: nextWeek.toISOString() }
              }

              if (lowerPhrase.includes("hour")) {
                const hours = parseInt(lowerPhrase.match(/(\d+)/)?.[1] || "1")
                const future = new Date(now.getTime() + hours * 60 * 60 * 1000)
                return { dateTime: future.toISOString() }
              }

              // Default to 1 hour from now
              const future = new Date(now.getTime() + 60 * 60 * 1000)
              return { dateTime: future.toISOString() }
            },
          },
        }

        // Use Groq AI to process the event with structured output
        const result = await generateObject({
          model: groq("llama-3.1-8b-instant"),
          output: "object",
          schema: aiEventOutputSchema,
          prompt: `You are an intelligent event planning assistant. Parse natural language input into structured events with emoji-prefixed titles.

Current date and time: ${currentDateTime}

CRITICAL RULES:
1. **EMOJI TITLES**: Always prefix titles with 1-2 relevant emojis that describe the event
   Examples: "☕ Coffee with John", "🏦 Bank appointment", "🚲 Bike ride", "💼 Team meeting", "🎉 Birthday party"

2. **MULTIPLE EVENTS**: If the input describes multiple events/activities, create separate event objects
   Example: "Coffee at 9am then gym at 11am" → create 2 events

3. **MEANINGFUL DESCRIPTIONS**: 
   - Write real, helpful descriptions (not placeholders)
   - Include specific details, tasks, or context from the input
   - Use HTML formatting for lists: <ul><li>item</li></ul> or <p>paragraph</p>
   - Leave empty if no meaningful detail can be extracted

4. **SMART TIME PARSING**:
   - Parse relative times: "tomorrow", "next week", "in 2 hours", "3pm today"
   - Default times: meetings (9am), appointments (3pm), social (7pm), workouts (6am)
   - Default durations: meetings (1-2h), appointments (30-60m), social (2-3h), workouts (1h)

5. **CATEGORY MAPPING**:
   - Coffee/meals → SOCIAL
   - Work/meetings → WORK or MEETING  
   - Doctor/bank/errands → APPOINTMENT
   - Exercise/sports → HEALTH
   - Travel/transport → TRAVEL
   - Tasks/todos → REMINDER

6. **PRIORITY LEVELS**:
   - LOW: casual social, optional activities
   - MEDIUM: regular appointments, planned meetings
   - HIGH: important deadlines, health appointments
   - URGENT: emergencies, critical deadlines

Input to parse: "${input.rawInput}"

Parse this into events with emoji-prefixed titles and meaningful descriptions. Be smart about multiple events and context clues.

Response format:
{
  "events": [
    {
      "title": "🎯 Emoji prefixed title",
      "description": "Meaningful description with details or HTML formatting",
      "startTime": "ISO datetime",
      "endTime": "ISO datetime (optional)",
      "location": "location if mentioned",
      "priority": "LOW|MEDIUM|HIGH|URGENT",
      "category": "PERSONAL|WORK|MEETING|APPOINTMENT|REMINDER|SOCIAL|TRAVEL|HEALTH|EDUCATION|OTHER",
      "confidence": 0.8
    }
  ]
}`,
        })

        const processingTime = Date.now() - startTime

        // For MVP testing - ensure test user exists if no user is authenticated
        let userId = context.user?.id

        if (!userId) {
          // Create or get test user for MVP
          const testUserId = "test-user-id"
          const existingUser = await database.user.findUnique({
            where: { id: testUserId },
          })

          if (!existingUser) {
            await database.user.create({
              data: {
                id: testUserId,
                email: "test@zeroplanner.dev",
                name: "Test User",
                emailVerified: true,
                createdAt: new Date(),
                updatedAt: new Date(),
              },
            })
          }
          userId = testUserId
        }

        // Create all events from AI processing
        const createdEvents = []
        const createdAIRecords = []

        for (const eventData of result.object.events) {
          // Create each event
          const event = await database.event.create({
            data: {
              title: eventData.title,
              description: eventData.description,
              startTime: new Date(eventData.startTime),
              endTime: eventData.endTime
                ? new Date(eventData.endTime)
                : undefined,
              location: eventData.location,
              priority: EventEntity.convertEventPriorityToPrisma(
                eventData.priority
              ),
              category: EventEntity.convertEventCategoryToPrisma(
                eventData.category
              ),
              originalInput: input.rawInput,
              aiProcessed: true,
              aiConfidence: eventData.confidence,
              userId: userId,
            },
          })

          // Create the AI processing record for this event
          const eventAI = await database.eventAI.create({
            data: {
              rawInput: input.rawInput,
              processedOutput: eventData,
              model: input.model || "llama-3.1-8b-instant",
              provider: input.provider || "groq",
              status: "COMPLETED",
              processingTime,
              confidence: eventData.confidence,
              eventId: event.id,
            },
          })

          createdEvents.push({
            id: event.id,
            title: event.title,
            description: event.description,
            startTime: event.startTime,
            endTime: event.endTime,
            location: event.location,
            priority: EventEntity.convertPrismaToEventPriority(event.priority),
            category: EventEntity.convertPrismaToEventCategory(event.category),
            aiProcessed: event.aiProcessed,
            aiConfidence: event.aiConfidence,
          })

          createdAIRecords.push({
            id: eventAI.id,
            model: input.model || "llama-3.1-8b-instant",
            provider: input.provider || "groq",
            processingTime,
            confidence: eventData.confidence,
          })
        }

        return {
          success: true,
          events: createdEvents,
          // For backward compatibility, include first event as 'event'
          event: createdEvents[0],
          aiProcessing: createdAIRecords[0],
          totalEvents: createdEvents.length,
        }
      } catch (aiError: any) {
        console.error("AI processing error:", aiError)
        return {
          success: false,
          error:
            "Failed to process event with AI. Please try again or create the event manually.",
        }
      }
    } catch (error: any) {
      if (error instanceof ORPCError) {
        throw error
      }

      if (error && typeof error === "object" && "code" in error) {
        console.error("Database error in AI processing:", {
          code: (error as any).code,
          message: (error as any).message,
          meta: (error as any).meta,
        })

        return {
          success: false,
          error: "Database error occurred while processing event with AI",
        }
      }

      console.error("Unexpected error in AI processing:", error)
      return {
        success: false,
        error: "An unexpected error occurred. Please try again later.",
      }
    }
  })

// Export the event router
export const eventRouter = {
  createEvent,
  updateEvent,
  getEvent,
  deleteEvent,
  listEvents,
  aiProcessEvent,
}
