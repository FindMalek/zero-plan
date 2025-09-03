import { tool } from "ai"
import { z } from "zod"
import { generateObject } from "ai"
import { aiModel } from "@/config/openai"
import { PROGRESS_STAGES, type ProgressContext } from "@/lib/utils/progress-helper"

/**
 * Smart Emoji Selection Tool
 * 
 * Intelligently selects appropriate emojis for events based on type, context,
 * and user patterns. Uses pattern matching and contextual analysis to find
 * the perfect emoji that represents the event's nature.
 * 
 * Key Features:
 * - Comprehensive emoji mapping for different event types
 * - Context-aware selection (location, time of day, specific activities)
 * - Priority-based matching (context > location > event type)
 * - Time-based fallbacks for routine activities
 * - Confidence scoring for selection quality
 * 
 * Event Categories:
 * - Travel & Transportation (🚗, 🚲, ✈️, 🚶)
 * - Work & Professional (♒, 👥, 📊, 💻)
 * - Health & Fitness (👟, 🏃, 🧘, 🏊‍♂️)
 * - Food & Drink (☕, 🍽️, 🍴)
 * - Social & Entertainment (🎉, 👥, 🎬, 💕)
 * - Medical & Health (🏥, 🩺, 🦷)
 * - And many more...
 * 
 * @example
 * ```typescript
 * const emoji = await selectEventEmojiTool.execute({
 *   eventType: "coffee",
 *   specificContext: "meeting with friend",
 *   timeOfDay: "morning",
 *   location: "cafe"
 * });
 * // Returns: { emoji: "☕", reasoning: "Selected ☕ for coffee based on...", confidence: 0.9 }
 * ```
 */
export const selectEventEmojiTool = tool({
  description:
    "Intelligently select appropriate emoji for events based on type, context, and user patterns",
  inputSchema: z.object({
    eventType: z
      .string()
      .describe(
        "Type of event (e.g., travel, work, food, exercise, meeting, etc.)"
      ),
    eventTitle: z
      .string()
      .describe("The full event title or description"),
    timeOfDay: z
      .string()
      .optional()
      .describe("Time of day context (morning, afternoon, evening)"),
    location: z.string().optional().describe("Location context if relevant"),
    peopleInvolved: z.array(z.string()).optional().describe("Names of people involved"),
  }),
  execute: async ({ eventType, eventTitle, timeOfDay, location, peopleInvolved }) => {
    // Pure AI-based emoji selection using generateObject for structured output
    const emojiAnalysis = await generateObject({
      model: aiModel,
      schema: z.object({
        selectedEmoji: z.string().describe("The most appropriate single emoji for this event"),
        primaryReason: z.enum([
          'activity_specific', 'social_context', 'location_based', 'time_sensitive', 
          'professional', 'health_medical', 'travel_transport', 'personal_task',
          'cultural_context', 'celebration_special'
        ]).describe("Primary reason for emoji selection"),
        confidence: z.number().min(0).max(1).describe("Confidence in emoji selection (0-1)"),
        alternativeOptions: z.array(z.string()).max(3).describe("Up to 3 alternative emoji options"),
        reasoning: z.string().describe("Brief explanation of why this emoji was chosen"),
        contextFactors: z.object({
          activityType: z.string().describe("What type of activity this represents"),
          socialAspect: z.string().describe("Social context (solo, with friends, professional, etc.)"),
          culturalRelevance: z.string().describe("Any cultural considerations (Tunisian context, local customs)")
        })
      }),
      prompt: `Select the perfect emoji for this event. Consider cultural context, activity type, and visual clarity.

EVENT DETAILS:
- Type: ${eventType}
- Title: "${eventTitle}"
- Location: ${location || 'Not specified'}
- People: ${peopleInvolved?.join(', ') || 'Solo activity'}
- Time: ${timeOfDay || 'Not specified'}

CULTURAL CONTEXT:
- User is in Tunisia (North Africa, Arabic/French culture)
- Consider local customs and preferences
- Transportation often involves cars
- Social activities are important culturally

EMOJI SELECTION PRINCIPLES:
1. Choose the MOST recognizable and clear emoji
2. Prioritize activity-specific emojis over generic ones
3. Consider social vs solo context
4. Factor in Tunisian cultural relevance
5. Ensure emoji works well in calendar/mobile contexts

EXAMPLES:
- Coffee with friend → ☕ (activity-specific)
- Doctor appointment → 👩‍⚕️ (professional/health)
- Travel to work → 🚗 (transportation)
- Birthday party → 🎂 (celebration-specific)
- Shopping → 🛒 (activity-specific)

Select ONE perfect emoji that best represents this event.`
    })

    return {
      emoji: emojiAnalysis.object.selectedEmoji,
      reasoning: emojiAnalysis.object.reasoning,
      confidence: emojiAnalysis.object.confidence,
      primaryReason: emojiAnalysis.object.primaryReason,
      alternatives: emojiAnalysis.object.alternativeOptions,
      contextFactors: emojiAnalysis.object.contextFactors
    }
  },
})
