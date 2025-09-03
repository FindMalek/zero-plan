import { tool } from "ai"
import { z } from "zod"
import { generateObject } from "ai"
import { aiModel } from "@/config/openai"
import {
  getUserContext,
  getDefaultLocation,
} from "@/config/user-context"

/**
 * AI-Powered Event Complexity Analyzer
 * 
 * Analyzes events using AI to determine if they require multi-event breakdown,
 * travel planning, and complex coordination. Considers cultural context,
 * practical logistics, and user preferences.
 * 
 * Key Features:
 * - Pure AI-based complexity analysis
 * - Intelligent travel requirement detection
 * - Cultural and practical considerations
 * - Multi-event sequence planning
 * - Context-aware decision making
 * 
 * @example
 * ```typescript
 * const analysis = await analyzeEventComplexityTool.execute({
 *   eventTitle: "Coffee with Iheb",
 *   eventLocation: "Sayeda",
 *   eventType: "social",
 *   userInput: "I want to have coffee with my friend Iheb tomorrow at 3pm in Sayeda"
 * });
 * // Returns: Detailed complexity analysis with travel and coordination needs
 * ```
 */
export const analyzeEventComplexityTool = tool({
  description:
    "Analyze event complexity using AI to determine multi-event breakdown, travel needs, and coordination requirements",
  inputSchema: z.object({
    eventTitle: z.string().describe("The main event title"),
    eventLocation: z
      .string()
      .optional()
      .describe("Location of the event if mentioned"),
    eventType: z
      .string()
      .describe("Type of event (coffee, meeting, appointment, etc.)"),
    userInput: z.string().describe("Original user input for context"),
    mentionedLocations: z
      .array(z.string())
      .optional()
      .describe("Any locations mentioned in the input"),
  }),
  execute: async ({
    eventTitle,
    eventLocation,
    eventType,
    userInput,
    mentionedLocations = [],
  }) => {
    const userContext = getUserContext()
    const homeLocation = getDefaultLocation(userContext)

    // Pure AI-based complexity analysis using generateObject
    const complexityAnalysis = await generateObject({
      model: aiModel,
      schema: z.object({
        complexityLevel: z.enum(['simple', 'moderate', 'complex']).describe("Overall complexity level"),
        needsMultipleEvents: z.boolean().describe("Whether this requires multiple related events"),
        travelRequirements: z.object({
          needsTravel: z.boolean().describe("Whether travel is required"),
          origin: z.string().nullable().describe("Starting location"),
          destination: z.string().nullable().describe("Destination location"),
          transportMode: z.string().nullable().describe("Recommended transport mode"),
          estimatedTravelTime: z.number().describe("Estimated travel time in minutes"),
          needsReturnTrip: z.boolean().describe("Whether a return trip is needed")
        }),
        eventBreakdown: z.object({
          totalEvents: z.number().describe("Total number of events to create"),
          mainEvent: z.object({
            title: z.string(),
            duration: z.number().describe("Duration in minutes"),
            type: z.string()
          }),
          supportingEvents: z.array(z.object({
            type: z.enum(['travel_to', 'travel_from', 'preparation', 'buffer']),
            title: z.string(),
            duration: z.number().describe("Duration in minutes"),
            purpose: z.string().describe("Why this event is needed")
          }))
        }),
        coordinationNeeds: z.object({
          timeCoordination: z.boolean().describe("Needs precise time coordination"),
          locationCoordination: z.boolean().describe("Needs location coordination"),
          peopleCoordination: z.boolean().describe("Needs coordination with other people"),
          flexibilityLevel: z.enum(['rigid', 'semi_flexible', 'flexible'])
        }),
        culturalFactors: z.object({
          localCustoms: z.array(z.string()).describe("Relevant Tunisian customs"),
          socialExpectations: z.array(z.string()).describe("Social expectations"),
          practicalConsiderations: z.array(z.string()).describe("Local practical factors")
        }),
        riskFactors: z.array(z.string()).describe("Potential issues or complications"),
        optimizationOpportunities: z.array(z.string()).describe("Ways to improve the plan"),
        confidence: z.number().min(0).max(1).describe("Confidence in the analysis"),
        reasoningNotes: z.string().describe("Explanation of the complexity assessment")
      }),
      prompt: `Analyze this event for complexity and determine if it needs multi-event breakdown.

EVENT DETAILS:
- Title: "${eventTitle}"
- Type: ${eventType}
- Location: ${eventLocation || 'Not specified'}
- User Input: "${userInput}"
- Mentioned Locations: ${mentionedLocations.join(', ') || 'None'}

USER CONTEXT:
- Home Location: ${homeLocation.name}
- Primary Transport: Car
- Cultural Context: Tunisia (North Africa)

ANALYSIS CRITERIA:

1. TRAVEL ASSESSMENT:
   - Does this event require leaving home/current location?
   - What's the distance/complexity of getting there?
   - Consider Tunisian traffic and transport options
   - Need for return journey?

2. SOCIAL COMPLEXITY:
   - Meeting with specific people?
   - Cultural expectations for social events in Tunisia
   - Time flexibility based on social norms

3. PREPARATION NEEDS:
   - Does this event require preparation time?
   - Any special requirements or preparations?

4. TIMING COORDINATION:
   - Fixed time vs flexible timing
   - Dependencies on other events
   - Cultural time expectations

5. LOCATION FACTORS:
   - Known locations in Tunisia
   - Travel complexity within Tunisian cities
   - Parking and accessibility considerations

TUNISIAN CONTEXT:
- Social events often run longer than scheduled
- Coffee culture is important - meetings can extend
- Traffic in cities like Tunis, Sousse can be unpredictable
- Family and social obligations take priority
- Punctuality expectations vary by event type

Provide a thorough analysis that considers all practical and cultural factors.`
    })

    return {
      isComplex: complexityAnalysis.object.complexityLevel !== 'simple',
      complexityLevel: complexityAnalysis.object.complexityLevel,
      needsMultipleEvents: complexityAnalysis.object.needsMultipleEvents,
      needsTravel: complexityAnalysis.object.travelRequirements.needsTravel,
      estimatedEvents: complexityAnalysis.object.eventBreakdown.totalEvents,
      travelRequirements: complexityAnalysis.object.travelRequirements,
      eventBreakdown: complexityAnalysis.object.eventBreakdown,
      coordinationNeeds: complexityAnalysis.object.coordinationNeeds,
      culturalFactors: complexityAnalysis.object.culturalFactors,
      riskFactors: complexityAnalysis.object.riskFactors,
      optimizationOpportunities: complexityAnalysis.object.optimizationOpportunities,
      confidence: complexityAnalysis.object.confidence,
      reasoningNotes: complexityAnalysis.object.reasoningNotes,
      analysisType: 'ai_based'
    }
  },
})