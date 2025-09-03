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
import {
  PROGRESS_STAGES,
  TOOL_PROGRESS_MAP,
  updateProgress,
} from "@/lib/utils/progress-helper"

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
          processedOutput: PROGRESS_STAGES.INITIALIZING,
          model: MODEL_NAME,
          provider: "openai",
          status: "PROCESSING",
          userId: userId,
        },
      })

      try {
        // Step 1: Use generateText with tools for intelligent planning and data gathering
        const textResult = await generateText({
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
          onStepFinish: async (step) => {
            // Track progress when tools are executed
            if (step.toolCalls && step.toolCalls.length > 0) {
              for (const toolCall of step.toolCalls) {
                const toolName =
                  toolCall.toolName as keyof typeof TOOL_PROGRESS_MAP
                const progressStage = TOOL_PROGRESS_MAP[toolName]

                if (progressStage) {
                  await updateProgress(
                    processingSession.id,
                    progressStage.progress,
                    progressStage.stage
                  )
                }
              }
            }
          },
          prompt: `You are a master event planning AI with deep understanding of user intent. Your mission is to transform any user request into comprehensive, realistic event sequences that account for the complete user journey.

🎯 CORE MISSION: Transform requests like "coffee with friend" into complete journeys:
1. 🚗 Travel to location → 2. ☕ Main event → 3. 🚗 Return travel

CONTEXT:
- Calendar: "${activeCalendar.name}" 
- USER INPUT: "${input.userInput}"

🧠 MASTER PLANNING WORKFLOW WITH PROGRESS TRACKING:

STEP 1: ANALYZE USER INTENT (20% - REQUIRED FIRST STEP)
Use analyzeUserIntent tool with current datetime to understand:
- What activities the user really wants to do
- How complex their request is 
- What locations and timing are involved
- The complete scope of their needs
Progress: "🧠 Analyzing your request and understanding intent..."

STEP 2: GET TIME CONTEXT (40%)
Use getCurrentTimeInfo tool for accurate datetime context
Progress: "⏰ Getting current time and scheduling context..."

STEP 3: PLAN EVENT STRUCTURE (35% - REQUIRED AFTER STEP 1) 
Use planEventStructure tool with the intent analysis to:
- Create detailed event breakdown and timing
- Account for travel, preparation, and logistics
- Coordinate multiple activities if needed
- Optimize the complete event flow
Progress: "📋 Planning optimal event structure and flow..."

STEP 4: GENERATE INDIVIDUAL EVENTS (50-80%)
For each structured event from Step 3:
- Use selectEventEmoji for appropriate emoji (50%)
- Use calculateEventTiming for optimal scheduling (55%)
- Use planTravelEvents for travel logistics (60%)
- Use generateEventDescription for rich, contextual content (70%)
- Use formatTravelEvent for travel events when needed

Progress tracking:
- "😊 Selecting perfect emojis for your events..." (50%)
- "⌚ Calculating optimal timing and durations..." (55%)
- "🚗 Planning travel routes and logistics..." (60%)
- "✍️ Crafting detailed event descriptions with AI..." (70%)

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

STEP 5: FINALIZE EVENT SEQUENCE (80-95%)
- Use generateEventSequence to build comprehensive event chains (80%)
- Apply final formatting and quality checks (90%)
- Complete personalized event plan (95%)

Progress tracking:
- "🔗 Building comprehensive event sequences..." (80%)
- "🎯 Finalizing events with perfect details..." (90%)
- "✨ Completing your personalized event plan..." (95%)

STEP 6: FINAL ANALYSIS AND SUMMARY
After using all necessary tools, provide a comprehensive summary of your planning work:

- Summarize your intent analysis findings
- List all events you've planned and their key details
- Describe the travel logistics and timing coordination
- Explain any cultural considerations applied
- Note the confidence level in your planning

Focus on thorough tool usage rather than structured output - the system will capture all tool results and generate the final structured events separately.

🚀 EXECUTION PRIORITY: Always start with analyzeUserIntent and planEventStructure tools for intelligent, comprehensive event planning that serves the user's real needs.`,
        })

        // Update progress: Generating structured output
        await updateProgress(
          processingSession.id,
          PROGRESS_STAGES.GENERATING_STRUCTURE.progress,
          PROGRESS_STAGES.GENERATING_STRUCTURE.stage
        )

        // Step 2: Generate structured output based on tool results and analysis
        const contextInfo = {
          userInput: input.userInput,
          calendarName: activeCalendar.name,
          planningText: textResult.text,
          toolResults: textResult.toolResults || [],
        }

        const structuredResult = await generateText({
          model: aiModel,
          prompt: `Based on the comprehensive AI planning analysis, generate structured events for the user.

ORIGINAL USER REQUEST: "${contextInfo.userInput}"
CALENDAR: "${contextInfo.calendarName}"

AI PLANNING ANALYSIS:
${contextInfo.planningText}

TOOL RESULTS SUMMARY:
${contextInfo.toolResults.map((result, i) => `${i + 1}. ${result.toolName}: ${JSON.stringify(result.output)}`).join("\n")}

Generate a comprehensive event structure that includes:

1. ALL planned events in chronological order (travel, main events, return travel)
2. Rich, contextual descriptions with helpful details
3. Proper timing coordination and realistic durations
4. Appropriate emojis and location information
5. Cultural considerations for Tunisian context

Requirements:
- Use ISO 8601 format for all dates/times
- Include confidence scores based on information clarity
- Ensure travel events connect logically with main events
- Apply 10-15 minute buffer times for travel uncertainties
- Use appropriate timezone (UTC as default)

Create events that serve the user's complete journey, not just the main activity.

IMPORTANT: Return ONLY a valid JSON object with this exact structure:
{
  "events": [
    {
      "emoji": "🚗",
      "title": "Car (Ksar Hellal → Sayeda)",
      "description": "<p>Travel details with timing, route, and helpful tips</p>",
      "startTime": "2024-12-21T14:30:00.000Z",
      "endTime": "2024-12-21T14:45:00.000Z",
      "timezone": "UTC",
      "isAllDay": false,
      "location": "Ksar Hellal to Sayeda",
      "confidence": 0.8
    }
  ],
  "processingNotes": "Master planning analysis: brief summary of intent and strategy",
  "confidence": 0.85,
  "contextUsed": ["intent_analysis", "event_structure", "travel_optimization"]
}

Return only the JSON object, no additional text.`,
        })

        // Parse the JSON response
        let aiResponse: AiEventGenerationSchema
        try {
          const jsonMatch = structuredResult.text.match(/\{[\s\S]*\}/)
          if (jsonMatch) {
            aiResponse = JSON.parse(jsonMatch[0])
          } else {
            throw new Error("No JSON found in response")
          }
        } catch (error) {
          console.error("Failed to parse structured AI response:", error)
          console.error("Raw response:", structuredResult.text)

          // Fallback: create a basic response
          aiResponse = {
            events: [],
            processingNotes:
              "Failed to parse AI response for structured output",
            confidence: 0.1,
          }
        }

        // Validate that we got a proper response
        if (
          !aiResponse ||
          !aiResponse.events ||
          aiResponse.events.length === 0
        ) {
          throw new Error("AI failed to generate valid events")
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

        // Update progress: Completed
        await updateProgress(
          processingSession.id,
          PROGRESS_STAGES.COMPLETED.progress,
          PROGRESS_STAGES.COMPLETED.stage
        )

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

        // Update progress: Failed
        await updateProgress(
          processingSession.id,
          PROGRESS_STAGES.FAILED.progress,
          PROGRESS_STAGES.FAILED.stage
        )

        await database.inputProcessingSession.update({
          where: { id: processingSession.id },
          data: {
            processedOutput: PROGRESS_STAGES.FAILED,
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
  getProgress,
}
