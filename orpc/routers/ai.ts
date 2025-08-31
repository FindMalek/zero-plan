import { EventEntity, EventQuery } from "@/entities/events"
import { database } from "@/prisma/client"
import { createEventDto, eventRo } from "@/schemas/event"
import { timezoneSchema } from "@/schemas/utils"
import { ORPCError, os } from "@orpc/server"
import { generateObject } from "ai"
import { z } from "zod"

import { client as aiClient } from "@/config/openai"

import type { ORPCContext } from "../types"

const baseProcedure = os.$context<ORPCContext>()

const privateProcedure = baseProcedure.use(({ context, next }) => {
  if (!context.user) {
    throw new ORPCError("UNAUTHORIZED")
  }

  return next({ context: { ...context, user: context.user } })
})

// AI Event Generation Schema - extends existing createEventDto
const aiEventSchema = createEventDto
  .omit({ calendarId: true }) // We'll handle calendar separately
  .extend({
    startTime: z.string().describe("ISO 8601 start date/time for the event"),
    endTime: z
      .string()
      .optional()
      .describe("ISO 8601 end date/time for the event"),
    timezone: timezoneSchema.default("UTC").describe("Timezone for the event"),
    confidence: z
      .number()
      .min(0)
      .max(1)
      .describe("AI confidence score for this extraction"),
  })

const aiEventGenerationSchema = z.object({
  events: z.array(aiEventSchema),
  processingNotes: z
    .string()
    .optional()
    .describe("Any notes about the processing"),
  confidence: z
    .number()
    .min(0)
    .max(1)
    .describe("Overall confidence in the extraction"),
})

type AIEventGeneration = z.infer<typeof aiEventGenerationSchema>

// AI Generate Events Response Schema - simpler approach
const generateEventsRo = z.object({
  success: z.boolean(),
  events: z
    .array(
      eventRo.extend({
        confidence: z.number(),
      })
    )
    .optional(),
  processingSession: z
    .object({
      id: z.string(),
      confidence: z.number(),
      processingTimeMs: z.number(),
      tokensUsed: z.number().optional(),
    })
    .optional(),
  error: z.string().optional(),
})

// Generate Events with AI using structured output
export const generateEvents = privateProcedure
  .input(
    z.object({
      userInput: z
        .string()
        .min(1)
        .describe("Natural language description of events to create"),
      calendarId: z.string().describe("ID of the calendar to create events in"),
      context: z
        .string()
        .optional()
        .describe("Additional context for better AI understanding"),
    })
  )
  .output(generateEventsRo)
  .handler(async ({ input, context }) => {
    const startTime = Date.now()

    try {
      // Validate calendar access
      const calendar = await database.calendar.findFirst({
        where: {
          id: input.calendarId,
          userId: context.user.id,
        },
      })

      if (!calendar) {
        return {
          success: false,
          error: "Calendar not found or you don't have permission to access it",
        }
      }

      // Create processing session
      const processingSession = await database.inputProcessingSession.create({
        data: {
          userInput: input.userInput,
          processedOutput: {},
          model: "gpt-4o-mini",
          provider: "voidai",
          status: "PROCESSING",
          userId: context.user.id,
        },
      })

      try {
        // Get current date/time for context
        const now = new Date()
        const currentDateTime = now.toISOString()

        // Use generateObject for structured AI output
        const { object: aiResponse } = await generateObject({
          model: aiClient.chat("gpt-4o-mini"),
          schema: aiEventGenerationSchema,
          prompt: `You are an intelligent event planning assistant. Parse the following natural language input into structured events.

Current date and time: ${currentDateTime}
Calendar context: Creating events for calendar "${calendar.name}"
${input.context ? `Additional context: ${input.context}` : ""}

User input: "${input.userInput}"

Instructions:
- Extract all possible events from the input
- Use appropriate emojis for each event type
- Set realistic start/end times based on current date/time
- Infer timezone from location hints or use UTC as default
- Set confidence scores based on how clearly specified each event is
- Use isAllDay=true for events without specific times
- Include location if mentioned or can be inferred`,
        })

        const processingTimeMs = Date.now() - startTime

        // Update processing session
        await database.inputProcessingSession.update({
          where: { id: processingSession.id },
          data: {
            processedOutput: aiResponse as any,
            status: "COMPLETED",
            processingTimeMs,
            confidence: aiResponse.confidence,
          },
        })

        // Create events in database
        const createdEvents = []

        for (const eventData of aiResponse.events) {
          const event = await database.event.create({
            data: {
              emoji: eventData.emoji,
              title: eventData.title,
              description: eventData.description,
              startTime: new Date(eventData.startTime),
              endTime: eventData.endTime
                ? new Date(eventData.endTime)
                : undefined,
              timezone: eventData.timezone,
              isAllDay: eventData.isAllDay,
              location: eventData.location,
              maxParticipants: eventData.maxParticipants,
              links: eventData.links || [],
              aiConfidence: eventData.confidence,
              userId: context.user.id,
              calendarId: input.calendarId,
            },
            select: EventQuery.getSelect(),
          })

          // Link processing session to event
          await database.inputProcessingSession.update({
            where: { id: processingSession.id },
            data: { eventId: event.id },
          })

          // Transform using EventEntity and add confidence
          const eventRo = EventEntity.toRo(event)
          createdEvents.push({
            ...eventRo,
            confidence: eventData.confidence,
          })
        }

        return {
          success: true,
          events: createdEvents,
          processingSession: {
            id: processingSession.id,
            confidence: aiResponse.confidence,
            processingTimeMs,
            tokensUsed: undefined, // Not available in current AI SDK version
          },
        }
      } catch (aiError: any) {
        console.error("AI generation error:", aiError)

        await database.inputProcessingSession.update({
          where: { id: processingSession.id },
          data: {
            status: "FAILED",
            errorMessage: aiError.message,
            processingTimeMs: Date.now() - startTime,
          },
        })

        return {
          success: false,
          error:
            "Failed to generate events with AI. Please try again or create events manually.",
        }
      }
    } catch (error: any) {
      if (error instanceof ORPCError) {
        throw error
      }

      console.error("Unexpected error in AI generation:", error)
      return {
        success: false,
        error: "An unexpected error occurred. Please try again later.",
      }
    }
  })

// Re-generate Events (regenerate existing events with new AI interpretation)
export const regenerateEvents = privateProcedure
  .input(
    z.object({
      processingSessionId: z
        .string()
        .describe("ID of the original processing session to regenerate"),
      context: z
        .string()
        .optional()
        .describe("Additional context for better regeneration"),
    })
  )
  .output(generateEventsRo)
  .handler(async ({ input, context }) => {
    try {
      // Get original processing session
      const originalSession = await database.inputProcessingSession.findFirst({
        where: {
          id: input.processingSessionId,
          userId: context.user.id,
        },
        include: {
          event: {
            include: {
              calendar: true,
            },
          },
        },
      })

      if (!originalSession) {
        return {
          success: false,
          error:
            "Processing session not found or you don't have permission to access it",
        }
      }

      if (!originalSession.event) {
        return {
          success: false,
          error: "No event associated with this processing session",
        }
      }

      // Delete the old event (we'll create a new one)
      await database.event.delete({
        where: { id: originalSession.event.id },
      })

      // Use the generateEvents endpoint with the same input but new context
      const regenerationInput = {
        userInput: originalSession.userInput,
        calendarId: originalSession.event.calendarId,
        context: input.context
          ? `Regeneration context: ${input.context}`
          : "This is a regeneration of a previous event",
      }

      // Call generateEvents with the same logic
      const startTime = Date.now()

      // Validate calendar access
      const calendar = await database.calendar.findFirst({
        where: {
          id: regenerationInput.calendarId,
          userId: context.user.id,
        },
      })

      if (!calendar) {
        return {
          success: false,
          error: "Calendar not found or you don't have permission to access it",
        }
      }

      // Create processing session
      const processingSession = await database.inputProcessingSession.create({
        data: {
          userInput: regenerationInput.userInput,
          processedOutput: {},
          model: "gpt-4o-mini",
          provider: "voidai",
          status: "PROCESSING",
          userId: context.user.id,
        },
      })

      try {
        // Get current date/time for context
        const now = new Date()
        const currentDateTime = now.toISOString()

        // Use generateObject for structured AI output
        const { object: aiResponse } = await generateObject({
          model: aiClient.chat("gpt-4o-mini"),
          schema: aiEventGenerationSchema,
          prompt: `You are an intelligent event planning assistant. Parse the following natural language input into structured events.

Current date and time: ${currentDateTime}
Calendar context: Creating events for calendar "${calendar.name}"
${regenerationInput.context ? `Additional context: ${regenerationInput.context}` : ""}

User input: "${regenerationInput.userInput}"

Instructions:
- Extract all possible events from the input
- Use appropriate emojis for each event type
- Set realistic start/end times based on current date/time
- Infer timezone from location hints or use UTC as default
- Set confidence scores based on how clearly specified each event is
- Use isAllDay=true for events without specific times
- Include location if mentioned or can be inferred`,
        })

        const processingTimeMs = Date.now() - startTime

        // Update processing session
        await database.inputProcessingSession.update({
          where: { id: processingSession.id },
          data: {
            processedOutput: aiResponse as any,
            status: "COMPLETED",
            processingTimeMs,
            confidence: aiResponse.confidence,
          },
        })

        // Create events in database
        const createdEvents = []

        for (const eventData of aiResponse.events) {
          const event = await database.event.create({
            data: {
              emoji: eventData.emoji,
              title: eventData.title,
              description: eventData.description,
              startTime: new Date(eventData.startTime),
              endTime: eventData.endTime
                ? new Date(eventData.endTime)
                : undefined,
              timezone: eventData.timezone,
              isAllDay: eventData.isAllDay,
              location: eventData.location,
              maxParticipants: eventData.maxParticipants,
              links: eventData.links || [],
              aiConfidence: eventData.confidence,
              userId: context.user.id,
              calendarId: regenerationInput.calendarId,
            },
            select: EventQuery.getSelect(),
          })

          // Link processing session to event
          await database.inputProcessingSession.update({
            where: { id: processingSession.id },
            data: { eventId: event.id },
          })

          // Transform using EventEntity and add confidence
          const eventRo = EventEntity.toRo(event)
          createdEvents.push({
            ...eventRo,
            confidence: eventData.confidence,
          })
        }

        return {
          success: true,
          events: createdEvents,
          processingSession: {
            id: processingSession.id,
            confidence: aiResponse.confidence,
            processingTimeMs,
          },
        }
      } catch (aiError: any) {
        console.error("AI regeneration error:", aiError)

        await database.inputProcessingSession.update({
          where: { id: processingSession.id },
          data: {
            status: "FAILED",
            errorMessage: aiError.message,
            processingTimeMs: Date.now() - startTime,
          },
        })

        return {
          success: false,
          error:
            "Failed to regenerate events with AI. Please try again or create events manually.",
        }
      }
    } catch (error: any) {
      if (error instanceof ORPCError) {
        throw error
      }

      console.error("Unexpected error in event regeneration:", error)
      return {
        success: false,
        error:
          "An unexpected error occurred during regeneration. Please try again later.",
      }
    }
  })

export const aiRouter = {
  generateEvents,
  regenerateEvents,
}
