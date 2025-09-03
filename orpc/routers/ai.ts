import { EventEntity, EventQuery } from "@/entities/events"
import { database } from "@/prisma/client"
import {
  aiEventGenerationSchema,
  AiEventGenerationSchema,
  generateEventsRo,
  GenerateEventsRo,
} from "@/schemas/ai"
import { ORPCError, os } from "@orpc/server"
import { generateObject, generateText, stepCountIs } from "ai"
import { z } from "zod"

import { aiModel, MODEL_NAME, PROVIDER_NAME } from "@/config/openai"
import {
  analyzeEventComplexityTool,
  analyzeUserIntentTool,
  calculateEventTimingTool,
  extractLocationContextTool,
  formatTravelEventTool,
  generateEventDescriptionTool,
  generateEventSequenceTool,
  getCurrentTimeInfoTool,
  planEventStructureTool,
  planTravelEventsTool,
  selectEventEmojiTool,
} from "@/lib/tools"

import type { ORPCContext } from "../types"

const baseProcedure = os.$context<ORPCContext>()

const privateProcedure = baseProcedure.use(({ context, next }) => {
  if (!context.user) {
    throw new ORPCError("UNAUTHORIZED")
  }

  return next({ context: { ...context, user: context.user } })
})

// Generate Events with AI using structured output
export const generateEvents = baseProcedure
  .input(
    z.object({
      userInput: z
        .string()
        .min(1)
        .describe("Natural language description of events to create"),
    })
  )
  .output(generateEventsRo)
  .handler(async ({ input, context }) => {
    const startTime = Date.now()

    try {
      // For MVP: Use demo user if no authentication
      const userId = context.user?.id || "user_1"

      // Get user's default calendar (or first available calendar for demo)
      const calendar = await database.calendar.findFirst({
        where: {
          userId: userId,
          isDefault: true,
        },
      })

      // Fallback: get any calendar for demo purposes
      const fallbackCalendar = !calendar
        ? await database.calendar.findFirst()
        : null
      const activeCalendar = calendar || fallbackCalendar

      if (!activeCalendar) {
        return {
          success: false,
          error: "No calendar available for event creation",
        }
      }

      // Create processing session with initial progress
      const processingSession = await database.inputProcessingSession.create({
        data: {
          userInput: input.userInput,
          processedOutput: {
            progress: 15,
            stage: "Sending your request to our AI assistant...",
          },
          model: MODEL_NAME,
          provider: "openai",
          status: "PROCESSING",
          userId: userId,
        },
      })

      try {
        // Update progress: Understanding input
        await database.inputProcessingSession.update({
          where: { id: processingSession.id },
          data: {
            processedOutput: {
              progress: 30,
              stage: "Understanding your event details and preferences...",
            },
          },
        })

        // Update progress: Analyzing context
        await database.inputProcessingSession.update({
          where: { id: processingSession.id },
          data: {
            processedOutput: {
              progress: 45,
              stage: "Analyzing context and extracting key information...",
            },
          },
        })

        // Use generateText with tools for enhanced context and formatting
        const result = await generateText({
          model: aiModel,
          tools: {
            getCurrentTimeInfo: getCurrentTimeInfoTool,
            selectEventEmoji: selectEventEmojiTool,
            formatTravelEvent: formatTravelEventTool,
            generateEventDescription: generateEventDescriptionTool,
            calculateEventTiming: calculateEventTimingTool,
            analyzeEventComplexity: analyzeEventComplexityTool,
            planTravelEvents: planTravelEventsTool,
            generateEventSequence: generateEventSequenceTool,
            extractLocationContext: extractLocationContextTool,
            analyzeUserIntent: analyzeUserIntentTool,
            planEventStructure: planEventStructureTool,
          },
          stopWhen: stepCountIs(10),
          prompt: `You are a master event planning AI with deep understanding of user intent. Your mission is to transform any user request into comprehensive, realistic event sequences that account for the complete user journey.

🎯 CORE MISSION: Transform requests like "coffee with friend" into complete journeys:
1. 🚗 Travel to location → 2. ☕ Main event → 3. 🚗 Return travel

CONTEXT:
- Calendar: "${activeCalendar.name}" 
- USER INPUT: "${input.userInput}"

🧠 MASTER PLANNING WORKFLOW:

STEP 1: ANALYZE USER INTENT (REQUIRED FIRST STEP)
Use analyzeUserIntent tool with current datetime to understand:
- What activities the user really wants to do
- How complex their request is 
- What locations and timing are involved
- The complete scope of their needs

STEP 2: PLAN EVENT STRUCTURE (REQUIRED SECOND STEP) 
Use planEventStructure tool with the intent analysis to:
- Create detailed event breakdown and timing
- Account for travel, preparation, and logistics
- Coordinate multiple activities if needed
- Optimize the complete event flow

STEP 3: GET TIME CONTEXT
Use getCurrentTimeInfo tool for accurate datetime context

STEP 4: GENERATE INDIVIDUAL EVENTS
For each structured event from Step 2:
- Use selectEventEmoji for appropriate emoji
- Use generateEventDescription for rich, contextual content  
- Use formatTravelEvent for travel events
- Use calculateEventTiming for optimal scheduling

🎯 INTELLIGENT EVENT CREATION STRATEGY:

🔸 SIMPLE EVENTS (single activity, no travel):
- Work from home, personal tasks
- Create 1 event with rich description

🔸 TRAVEL-REQUIRED EVENTS (most common):  
- Coffee meetups, appointments, social visits
- Create 3 events: Outbound Travel → Main Activity → Return Travel

🔸 COMPLEX MULTI-EVENTS:
- Multiple locations/activities in sequence
- Create optimized event chain with travel coordination

🚨 CRITICAL SUCCESS FACTORS:

✅ TITLE EXCELLENCE:
- "🚗 Car (Ksar Hellal → Sayeda)" not "Travel"
- "☕ Coffee (Iheb Souid)" not "Coffee meeting"  
- "🩺 Doctor (Cardiology Check)" not "Appointment"

✅ COMPREHENSIVE PLANNING:
- Always think about the complete user journey
- Include realistic travel time and buffers
- Consider logistics and preparation needs

✅ CONTEXTUAL INTELLIGENCE:
- Extract specific names, places, times from input
- Use local knowledge (Tunisian cities/culture)
- Provide rich, actionable event descriptions

STEP 5: FINAL STRUCTURED OUTPUT
Provide complete JSON with ALL events in chronological order:

{
  "events": [
    {
      "emoji": "🚗",
      "title": "🚗 Car (Ksar Hellal → Sayeda)",
      "description": "<p>Travel details with timing, route, and helpful tips</p>",
      "startTime": "2024-12-21T14:30:00.000Z",
      "endTime": "2024-12-21T14:45:00.000Z", 
      "timezone": "UTC",
      "isAllDay": false,
      "location": "Ksar Hellal to Sayeda",
      "confidence": 0.8
    }
  ],
  "processingNotes": "Master planning analysis: [brief summary of intent and strategy]",
  "confidence": 0.85,
  "contextUsed": ["intent_analysis", "event_structure", "travel_optimization"]
}

🚀 EXECUTION PRIORITY: Always start with analyzeUserIntent and planEventStructure tools for intelligent, comprehensive event planning that serves the user's real needs.`,
        })

        // Update progress: Crafting events
        await database.inputProcessingSession.update({
          where: { id: processingSession.id },
          data: {
            processedOutput: {
              progress: 65,
              stage: "Crafting personalized events with AI magic...",
            },
          },
        })

        // Parse the final text response as JSON for the structured data
        const finalMessage = result.text
        let aiResponse: AiEventGenerationSchema

        try {
          // Try to extract JSON from the response
          const jsonMatch = finalMessage.match(/\{[\s\S]*\}/)
          if (jsonMatch) {
            aiResponse = JSON.parse(jsonMatch[0])
          } else {
            throw new Error("No JSON found in response")
          }
        } catch (error) {
          // Fallback: create a basic response if JSON parsing fails
          console.error("Failed to parse AI response as JSON:", error)
          aiResponse = {
            events: [],
            processingNotes: "Failed to parse AI response",
            confidence: 0.1,
          }
        }

        const processingTimeMs = Date.now() - startTime

        // Update processing session
        await database.inputProcessingSession.update({
          where: { id: processingSession.id },
          data: {
            processedOutput: JSON.parse(JSON.stringify(aiResponse)),
            status: "COMPLETED",
            processingTimeMs,
            confidence: aiResponse.confidence,
          },
        })

        // Create events in database
        const createdEvents = []

        for (const eventData of aiResponse.events) {
          // Ensure timezone is valid (fallback to UTC if invalid)
          const validTimezones = [
            "UTC",
            "AMERICA_NEW_YORK",
            "AMERICA_CHICAGO",
            "AMERICA_DENVER",
            "AMERICA_LOS_ANGELES",
            "EUROPE_LONDON",
            "EUROPE_PARIS",
            "EUROPE_BERLIN",
            "ASIA_TOKYO",
            "ASIA_SINGAPORE",
            "ASIA_DUBAI",
            "AUSTRALIA_SYDNEY",
          ]
          const timezone = validTimezones.includes(eventData.timezone)
            ? eventData.timezone
            : "UTC"

          const event = await database.event.create({
            data: {
              emoji: eventData.emoji,
              title: eventData.title,
              description: eventData.description,
              startTime: new Date(eventData.startTime),
              endTime: eventData.endTime
                ? new Date(eventData.endTime)
                : undefined,
              timezone: timezone,
              isAllDay: eventData.isAllDay,
              location: eventData.location,
              maxParticipants: eventData.maxParticipants,
              links: eventData.links || [],
              aiConfidence: eventData.confidence,
              userId: userId,
              calendarId: activeCalendar.id,
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
export const regenerateEvents = baseProcedure
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
      // For MVP: Use demo user if no authentication
      const userId = context.user?.id || "user_1"

      // Get original processing session
      const originalSession = await database.inputProcessingSession.findFirst({
        where: {
          id: input.processingSessionId,
          userId: userId,
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
          userId: userId,
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
          model: MODEL_NAME,
          provider: PROVIDER_NAME,
          status: "PROCESSING",
          userId: userId,
        },
      })

      try {
        // Get current date/time for context
        const now = new Date()
        const currentDateTime = now.toISOString()

        // Use generateObject for structured AI output
        const { object: aiResponse } = await generateObject({
          model: aiModel,
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
- IMPORTANT: Only use these valid timezones: UTC, AMERICA_NEW_YORK, AMERICA_CHICAGO, AMERICA_DENVER, AMERICA_LOS_ANGELES, EUROPE_LONDON, EUROPE_PARIS, EUROPE_BERLIN, ASIA_TOKYO, ASIA_SINGAPORE, ASIA_DUBAI, AUSTRALIA_SYDNEY
- If location suggests Africa/Middle East, use EUROPE_PARIS timezone
- Set confidence scores based on how clearly specified each event is
- Use isAllDay=true for events without specific times
- Include location if mentioned or can be inferred`,
        })

        const processingTimeMs = Date.now() - startTime

        // Update processing session
        await database.inputProcessingSession.update({
          where: { id: processingSession.id },
          data: {
            processedOutput: JSON.parse(JSON.stringify(aiResponse)),
            status: "COMPLETED",
            processingTimeMs,
            confidence: aiResponse.confidence,
          },
        })

        // Create events in database
        const createdEvents = []

        for (const eventData of aiResponse.events) {
          // Ensure timezone is valid (fallback to UTC if invalid)
          const validTimezones = [
            "UTC",
            "AMERICA_NEW_YORK",
            "AMERICA_CHICAGO",
            "AMERICA_DENVER",
            "AMERICA_LOS_ANGELES",
            "EUROPE_LONDON",
            "EUROPE_PARIS",
            "EUROPE_BERLIN",
            "ASIA_TOKYO",
            "ASIA_SINGAPORE",
            "ASIA_DUBAI",
            "AUSTRALIA_SYDNEY",
          ]
          const timezone = validTimezones.includes(eventData.timezone)
            ? eventData.timezone
            : "UTC"

          const event = await database.event.create({
            data: {
              emoji: eventData.emoji,
              title: eventData.title,
              description: eventData.description,
              startTime: new Date(eventData.startTime),
              endTime: eventData.endTime
                ? new Date(eventData.endTime)
                : undefined,
              timezone: timezone,
              isAllDay: eventData.isAllDay,
              location: eventData.location,
              maxParticipants: eventData.maxParticipants,
              links: eventData.links || [],
              aiConfidence: eventData.confidence,
              userId: userId,
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

// Get progress for a processing session
export const getProgress = baseProcedure
  .input(
    z.object({
      processingSessionId: z.string(),
    })
  )
  .output(
    z.object({
      progress: z.number(),
      stage: z.string(),
      status: z.string(),
    })
  )
  .handler(async ({ input, context }) => {
    const userId = context.user?.id || "user_1"

    const session = await database.inputProcessingSession.findFirst({
      where: {
        id: input.processingSessionId,
        userId: userId,
      },
    })

    if (!session) {
      return {
        progress: 0,
        stage: "Session not found",
        status: "FAILED",
      }
    }

    const processedOutput = session.processedOutput as any

    return {
      progress: processedOutput?.progress || 0,
      stage: processedOutput?.stage || "Initializing...",
      status: session.status,
    }
  })

export const aiRouter = {
  generateEvents,
  regenerateEvents,
  getProgress,
}
