import { generateObject, tool } from "ai"
import { z } from "zod"

import { aiModel } from "@/config/openai"
import { getDefaultLocation, getUserContext } from "@/config/user-context"

/**
 * Master Event Planner - User Intent Analysis Tool
 *
 * This is the "brain" of the event planning system. It performs comprehensive
 * analysis of user input to understand intent, identify all activities, and
 * create intelligent planning strategies.
 *
 * Key Features:
 * - AI-powered natural language understanding
 * - Multi-event detection and segmentation
 * - Temporal pattern recognition (tomorrow, next week, 3pm)
 * - Location and travel context extraction
 * - Strategic planning recommendations
 *
 * Analysis Process:
 * 1. Parse temporal markers (today, tomorrow, specific times)
 * 2. Identify activity types (social, work, appointments)
 * 3. Extract location context and travel implications
 * 4. Segment input into distinct events
 * 5. Generate strategic planning approach
 *
 * @example
 * ```typescript
 * const analysis = await analyzeUserIntentTool.execute({
 *   userInput: "Coffee with Iheb tomorrow at 3pm in Sayeda",
 *   currentDateTime: "2024-12-21T10:00:00.000Z"
 * });
 * // Returns: { userIntent: { primaryActivity: "social", complexity: "simple" }, ... }
 * ```
 */
export const analyzeUserIntentTool = tool({
  description:
    "Comprehensively analyze user input to understand intent, identify all events, and create a structured planning strategy",
  inputSchema: z.object({
    userInput: z.string().describe("The complete user input to analyze"),
    currentDateTime: z.string().describe("Current date/time for context"),
  }),
  execute: async ({ userInput, currentDateTime }) => {
    const userContext = getUserContext()
    const homeLocation = getDefaultLocation(userContext)

    // Pure AI-based intent analysis using generateObject for structured output
    const aiAnalysis = await generateObject({
      model: aiModel,
      schema: z.object({
        userIntent: z.object({
          primaryActivity: z
            .string()
            .describe(
              "The main type of activity (social, work, appointment, travel, personal, etc.)"
            ),
          complexity: z
            .enum(["simple", "complex"])
            .describe(
              "Simple = single activity, Complex = multiple activities or complex logistics"
            ),
          timeframe: z
            .string()
            .describe(
              "When this should happen (today, tomorrow, this_week, next_week, unspecified)"
            ),
          hasExplicitTiming: z
            .boolean()
            .describe(
              "Whether specific times are mentioned (3pm, morning, etc.)"
            ),
        }),
        identifiedEvents: z.array(
          z.object({
            segment: z
              .string()
              .describe("The text segment describing this event"),
            type: z
              .string()
              .describe(
                "Event type: social, work, appointment, travel, personal, preparation"
              ),
            requiresTravel: z
              .boolean()
              .describe("Whether this event requires travel from home"),
            location: z
              .string()
              .nullable()
              .describe("Specific location mentioned, null if none"),
            temporalClues: z
              .array(z.string())
              .describe("Time-related words found in this segment"),
            peopleInvolved: z
              .array(z.string())
              .describe("Names of people mentioned"),
            estimatedDuration: z
              .number()
              .describe("Estimated duration in minutes based on activity type"),
          })
        ),
        planningStrategy: z.object({
          approach: z
            .string()
            .describe(
              "Planning approach: simple, travel_required, or multi_event_complex"
            ),
          estimatedTotalEvents: z
            .number()
            .describe("Total number of events that should be created"),
          needsTravelPlanning: z
            .boolean()
            .describe("Whether travel events need to be created"),
          needsTimeCoordination: z
            .boolean()
            .describe("Whether multiple events need time coordination"),
          baseLocation: z.string().describe("User's home/base location"),
        }),
        contextualFactors: z.object({
          multipleLocations: z
            .boolean()
            .describe("Whether multiple different locations are mentioned"),
          hasPersonNames: z
            .boolean()
            .describe("Whether specific people's names are mentioned"),
          hasUrgency: z.boolean().describe("Whether urgent language is used"),
          hasPreferences: z
            .boolean()
            .describe(
              "Whether preferences or specific requirements are mentioned"
            ),
          culturalContext: z
            .array(z.string())
            .describe(
              "Any cultural or local context clues (Tunisian cities, local customs, etc.)"
            ),
        }),
        recommendations: z.object({
          shouldCreateMultipleEvents: z.boolean(),
          shouldIncludeTravel: z.boolean(),
          shouldCoordinateTiming: z.boolean(),
          suggestedProcessingOrder: z.array(
            z.object({
              order: z.number(),
              event: z.string(),
              type: z.string(),
              priority: z.enum(["high", "medium", "low"]),
            })
          ),
        }),
        confidence: z
          .number()
          .min(0)
          .max(1)
          .describe("Overall confidence in the analysis"),
        processingNotes: z
          .string()
          .describe(
            "Brief notes about what was identified and the approach taken"
          ),
      }),
      prompt: `You are an expert event planning AI. Analyze this user request comprehensively:

USER INPUT: "${userInput}"
CURRENT TIME: ${currentDateTime}
USER'S HOME: ${homeLocation.name}
USER CONTEXT: Lives in Tunisia, uses car as primary transport, prefers 10min travel buffers

ANALYSIS REQUIREMENTS:
1. Identify ALL distinct activities/events mentioned
2. Extract people's names (especially Arabic/French names common in Tunisia)
3. Identify locations (prioritize Tunisian cities: Tunis, Sousse, Monastir, Gafsa, Sfax, Ksar Hellal, Sayeda, Mahdia)
4. Parse time references (tomorrow, 3pm, next week, morning, etc.)
5. Determine activity types and travel requirements
6. Assess complexity and create planning strategy

CONTEXT AWARENESS:
- Consider Tunisian culture and geography
- Assume travel is needed for activities outside home
- Account for typical event durations
- Factor in social vs professional contexts
- Consider time-of-day implications

Provide a comprehensive structured analysis that will drive intelligent event creation.`,
    })

    // Return the pure AI analysis result
    return aiAnalysis.object
  },
})
