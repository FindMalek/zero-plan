import { tool } from "ai"
import { z } from "zod"
import { generateObject } from "ai"
import { aiModel } from "@/config/openai"

/**
 * AI-Powered Event Structure Planner
 * 
 * Creates detailed event structures and timing based on comprehensive user intent analysis.
 * Uses AI to intelligently plan event sequences, timing, and coordination based on context.
 * 
 * Key Features:
 * - Pure AI-based event structure planning
 * - Intelligent timing coordination
 * - Context-aware event sequencing
 * - Travel and preparation planning
 * - Cultural and practical considerations
 * 
 * @example
 * ```typescript
 * const structure = await planEventStructureTool.execute({
 *   userIntentAnalysis: { ... },
 *   baseDateTime: "2024-12-21T15:00:00Z"
 * });
 * // Returns: Detailed event structure with timing and coordination
 * ```
 */
export const planEventStructureTool = tool({
  description: "Create detailed, intelligent event structure and timing using AI-based planning",
  inputSchema: z.object({
    userIntentAnalysis: z.object({
      userIntent: z.object({
        primaryActivity: z.string(),
        complexity: z.enum(['simple', 'complex']),
        timeframe: z.string(),
        hasExplicitTiming: z.boolean()
      }),
      identifiedEvents: z.array(z.object({
        segment: z.string(),
        type: z.string(),
        requiresTravel: z.boolean(),
        location: z.string().nullable(),
        temporalClues: z.array(z.string()),
        peopleInvolved: z.array(z.string()),
        estimatedDuration: z.number()
      })),
      planningStrategy: z.object({
        approach: z.string(),
        estimatedTotalEvents: z.number(),
        needsTravelPlanning: z.boolean(),
        needsTimeCoordination: z.boolean(),
        baseLocation: z.string()
      }),
      contextualFactors: z.object({
        multipleLocations: z.boolean(),
        hasPersonNames: z.boolean(),
        hasUrgency: z.boolean(),
        hasPreferences: z.boolean(),
        culturalContext: z.array(z.string())
      }),
      recommendations: z.object({
        shouldCreateMultipleEvents: z.boolean(),
        shouldIncludeTravel: z.boolean(),
        shouldCoordinateTiming: z.boolean(),
        suggestedProcessingOrder: z.array(z.object({
          order: z.number(),
          event: z.string(),
          type: z.string(),
          priority: z.enum(['high', 'medium', 'low'])
        }))
      }),
      confidence: z.number(),
      processingNotes: z.string()
    }),
    baseDateTime: z.string().describe("Base datetime for event scheduling")
  }),
  execute: async ({ userIntentAnalysis, baseDateTime }) => {
    // Pure AI-based event structure planning using generateObject
    const structurePlan = await generateObject({
      model: aiModel,
      schema: z.object({
        eventSequence: z.array(z.object({
          order: z.number().describe("Order in the sequence (1, 2, 3, ...)"),
          eventId: z.string().describe("Unique identifier for this event"),
          title: z.string().describe("Event title"),
          type: z.enum(['main', 'travel', 'preparation', 'buffer', 'follow_up']),
          category: z.string().describe("Event category (social, work, travel, etc.)"),
          startTime: z.string().describe("ISO datetime string for event start"),
          endTime: z.string().describe("ISO datetime string for event end"),
          duration: z.number().describe("Duration in minutes"),
          location: z.string().nullable().describe("Event location"),
          people: z.array(z.string()).describe("People involved"),
          description: z.string().describe("Brief event description"),
          priority: z.enum(['high', 'medium', 'low']),
          dependencies: z.array(z.string()).describe("Event IDs this depends on"),
          travelInfo: z.object({
            isTravel: z.boolean(),
            origin: z.string().nullable(),
            destination: z.string().nullable(),
            transportMode: z.string().nullable(),
            bufferTime: z.number().describe("Buffer time in minutes")
          }).optional(),
          contextualNotes: z.string().describe("Additional context or considerations")
        })),
        timingStrategy: z.object({
          totalDuration: z.number().describe("Total time span in minutes"),
          bufferTime: z.number().describe("Total buffer time included"),
          peakTimes: z.array(z.string()).describe("Key times in the sequence"),
          flexibility: z.enum(['rigid', 'flexible', 'very_flexible']).describe("How flexible the timing is"),
          considerations: z.array(z.string()).describe("Important timing considerations")
        }),
        coordinationPlan: z.object({
          needsConfirmation: z.boolean().describe("Whether events need confirmation"),
          conflictRisks: z.array(z.string()).describe("Potential scheduling conflicts"),
          optimizations: z.array(z.string()).describe("Suggested optimizations"),
          alternativeOptions: z.array(z.string()).describe("Alternative timing options")
        }),
        culturalConsiderations: z.object({
          localCustoms: z.array(z.string()).describe("Relevant local customs"),
          socialExpectations: z.array(z.string()).describe("Social expectations to consider"),
          practicalFactors: z.array(z.string()).describe("Practical factors for Tunisia")
        }),
        confidence: z.number().min(0).max(1).describe("Confidence in the plan"),
        recommendedAdjustments: z.array(z.string()).describe("Suggested adjustments to improve the plan")
      }),
      prompt: `Create a comprehensive event structure plan based on this user intent analysis.

USER INTENT ANALYSIS:
${JSON.stringify(userIntentAnalysis, null, 2)}

BASE DATE/TIME: ${baseDateTime}

CULTURAL CONTEXT:
- User is in Tunisia (North Africa)
- Local customs and social norms apply
- Traffic and travel patterns in Tunisian cities
- Social activities are culturally important

PLANNING REQUIREMENTS:
1. Create a logical sequence of events based on the analysis
2. Include travel events if needed (consider Tunisian transportation)
3. Add appropriate buffer times
4. Consider social and cultural context
5. Plan realistic timing based on local conditions
6. Account for peak traffic times and social norms
7. Include preparation time if needed

TIMING GUIDELINES:
- Coffee meetings: typically 1-2 hours in Tunisia
- Travel within cities: 15-45 minutes depending on distance
- Social gatherings: often longer than Western standards
- Business meetings: punctuality is important
- Buffer time: 10-15 minutes for travel uncertainties

EVENT SEQUENCING:
- Plan events in logical order (travel → main event → return)
- Consider dependencies between events
- Add preparation time for important events
- Include buffer time for travel and transitions
- Plan for social customs (extended coffee times, etc.)

Create a detailed, practical plan that respects local customs and creates a smooth experience.`
    })

    return {
      eventStructure: structurePlan.object.eventSequence,
      timingStrategy: structurePlan.object.timingStrategy,
      coordinationPlan: structurePlan.object.coordinationPlan,
      culturalConsiderations: structurePlan.object.culturalConsiderations,
      confidence: structurePlan.object.confidence,
      recommendedAdjustments: structurePlan.object.recommendedAdjustments,
      planningApproach: 'ai_based',
      processingNotes: `AI-generated structure plan with ${structurePlan.object.eventSequence.length} events`
    }
  },
})