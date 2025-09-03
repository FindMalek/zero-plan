import { generateObject, tool } from "ai"
import { z } from "zod"

import { aiModel } from "@/config/openai"

/**
 * AI-Powered Event Description Generator
 *
 * Creates rich, contextual HTML descriptions for calendar events using AI.
 * Generates engaging, personalized descriptions that consider cultural context,
 * social aspects, and event specifics to make each event meaningful.
 *
 * Key Features:
 * - Pure AI-based description generation using generateObject
 * - Cultural awareness (Tunisian context)
 * - Personalized tone based on event type
 * - Social context consideration
 * - Motivational and encouraging language
 * - Proper HTML formatting
 *
 * @example
 * ```typescript
 * const description = await generateEventDescriptionTool.execute({
 *   eventType: "social",
 *   eventTitle: "Coffee with Iheb",
 *   peopleInvolved: ["Iheb Souid"],
 *   location: "Sayeda Cafe",
 *   duration: 90,
 *   timeOfDay: "afternoon",
 *   userInput: "I want to have coffee with my friend Iheb tomorrow at 3pm in Sayeda"
 * });
 * // Returns: Rich HTML description with cultural context and personalization
 * ```
 */
export const generateEventDescriptionTool = tool({
  description:
    "Generate rich, personalized HTML descriptions for calendar events using AI with cultural awareness",
  inputSchema: z.object({
    eventType: z.string().describe("Type of event"),
    eventTitle: z.string().describe("Event title"),
    peopleInvolved: z.array(z.string()).describe("Names of people involved"),
    location: z.string().optional().describe("Event location"),
    duration: z.number().describe("Event duration in minutes"),
    timeOfDay: z.string().optional().describe("Time of day context"),
    userInput: z.string().describe("Original user input for context"),
  }),
  execute: async ({
    eventType,
    eventTitle,
    peopleInvolved,
    location,
    duration,
    timeOfDay,
    userInput,
  }) => {
    // Pure AI-based description generation using generateObject for structured output
    const descriptionAnalysis = await generateObject({
      model: aiModel,
      schema: z.object({
        htmlDescription: z
          .string()
          .describe("Rich HTML description for the event (2-3 sentences)"),
        tone: z
          .enum(["professional", "casual", "friendly", "formal", "encouraging"])
          .describe("Tone used in the description"),
        keyElements: z
          .array(z.string())
          .describe("Key elements highlighted in the description"),
        culturalContext: z
          .string()
          .optional()
          .describe("Any cultural considerations included"),
        personalization: z.object({
          includesPeople: z
            .boolean()
            .describe("Whether people were mentioned in description"),
          includesLocation: z
            .boolean()
            .describe("Whether location was mentioned in description"),
          includesTiming: z
            .boolean()
            .describe("Whether timing context was included"),
          includesMotivation: z
            .boolean()
            .describe("Whether motivational/encouraging elements were added"),
        }),
        confidence: z
          .number()
          .min(0)
          .max(1)
          .describe("Confidence in description quality"),
      }),
      prompt: `Create a rich, engaging HTML description for this calendar event. Make it personal, contextual, and culturally appropriate.

EVENT DETAILS:
- Type: ${eventType}
- Title: "${eventTitle}"
- People: ${peopleInvolved.join(", ") || "Solo activity"}
- Location: ${location || "No specific location"}
- Duration: ${duration} minutes
- Time: ${timeOfDay || "Any time"}
- User Context: "${userInput}"

CULTURAL CONTEXT:
- User is in Tunisia (North Africa, Arabic/French culture)
- Consider local customs and social norms
- Social connections are highly valued
- Respect for time and appointments is important

DESCRIPTION REQUIREMENTS:
1. Write 2-3 engaging, natural sentences
2. Use proper HTML formatting (<p>, <strong>, <em>, <br>)
3. Include relevant context about the activity
4. Make it personal and motivating
5. Consider the social/cultural context
6. Keep it concise but informative
7. Use appropriate emojis sparingly

TONE GUIDELINES:
- Professional events: Professional but warm
- Social events: Friendly and encouraging
- Medical/appointments: Supportive and prepared
- Travel: Practical and reassuring
- Personal tasks: Motivating and positive

EXAMPLES:
- Coffee with friend: "<p>☕ Enjoy a <strong>relaxing coffee session</strong> with great company. A perfect opportunity to catch up, share stories, and strengthen your friendship.</p>"
- Doctor appointment: "<p>🏥 Important <strong>medical appointment</strong> for your health and well-being. <em>Remember to bring necessary documents and arrive 10 minutes early.</em></p>"
- Travel event: "<p>🚗 <strong>Travel time</strong> to reach your destination comfortably. <em>Estimated based on typical traffic conditions in Tunisia.</em></p>"

Generate a rich HTML description that captures the essence and importance of this event.`,
    })

    return {
      description: descriptionAnalysis.object.htmlDescription,
      generatedBy: "ai",
      confidence: descriptionAnalysis.object.confidence,
      tone: descriptionAnalysis.object.tone,
      keyElements: descriptionAnalysis.object.keyElements,
      personalization: descriptionAnalysis.object.personalization,
      culturalContext: descriptionAnalysis.object.culturalContext,
    }
  },
})
