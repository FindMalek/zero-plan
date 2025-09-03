import { tool } from "ai"
import { z } from "zod"

// Smart emoji selection tool
export const selectEventEmojiTool = tool({
  description:
    "Intelligently select appropriate emoji for events based on type, context, and user patterns",
  inputSchema: z.object({
    eventType: z
      .string()
      .describe(
        "Type of event (e.g., travel, work, food, exercise, meeting, etc.)"
      ),
    specificContext: z
      .string()
      .optional()
      .describe("Specific context about the event"),
    timeOfDay: z
      .string()
      .optional()
      .describe("Time of day context (morning, afternoon, evening)"),
    location: z.string().optional().describe("Location context if relevant"),
  }),
  execute: async ({ eventType, specificContext, timeOfDay, location }) => {
    const emojiMap: Record<string, string> = {
      // Travel & Transportation
      travel: "🚗",
      car: "🚗",
      flight: "✈️",
      plane: "✈️",
      train: "🚂",
      bus: "🚌",
      bike: "🚲",
      bicycle: "🚲",
      walk: "🚶",
      uber: "🚗",
      taxi: "🚕",

      // Work & Professional
      work: "♒",
      job: "♒",
      meeting: "👥",
      conference: "🎤",
      presentation: "📊",
      jobflow: "♒",
      office: "🏢",
      call: "📞",
      zoom: "💻",

      // Health & Fitness
      gym: "👟",
      workout: "👟",
      training: "👟",
      exercise: "👟",
      running: "🏃",
      jogging: "🏃",
      swimming: "🏊‍♂️",
      beach: "🏊‍♂️",
      yoga: "🧘",
      meditation: "🧘",

      // Food & Drink
      breakfast: "☕",
      lunch: "🍽️",
      dinner: "🍴",
      coffee: "☕",
      drink: "🍴",
      meal: "🍽️",
      restaurant: "🍽️",
      cafe: "☕",

      // Personal Care & Grooming
      shower: "🚿👕",
      bath: "🛁",
      grooming: "🚿👕",
      hair: "🌬️",
      haircut: "💇",
      care: "💆‍♂️",
      skincare: "💆‍♂️",

      // Preparation & Planning
      pack: "🎒",
      packing: "🎒",
      prepare: "🎒",
      preparation: "🎒",
      organize: "📅",
      planning: "📅",
      calendar: "📅",

      // Social & Entertainment
      birthday: "🎉",
      party: "🎉",
      celebration: "🎉",
      friend: "👥",
      date: "💕",
      movie: "🎬",
      gaming: "🎮",
      music: "🎵",

      // Medical & Health
      doctor: "🏥",
      hospital: "🏥",
      appointment: "📅",
      medical: "🏥",
      dentist: "🦷",
      checkup: "🩺",

      // Education & Learning
      study: "📚",
      class: "📚",
      course: "📚",
      lesson: "📚",
      school: "🏫",
      university: "🎓",

      // Shopping & Errands
      shopping: "🛒",
      groceries: "🛒",
      errands: "📋",
      bank: "🏦",
      post: "📮",
    }

    const lowerType = eventType.toLowerCase()
    const lowerContext = specificContext?.toLowerCase() || ""
    const lowerLocation = location?.toLowerCase() || ""

    // Priority matching: specific context > location > event type
    const searchTexts = [lowerContext, lowerLocation, lowerType]

    for (const searchText of searchTexts) {
      if (searchText) {
        for (const [key, emoji] of Object.entries(emojiMap)) {
          if (searchText.includes(key)) {
            return {
              emoji,
              reasoning: `Selected ${emoji} for ${eventType} based on "${key}" match`,
              confidence: 0.9,
            }
          }
        }
      }
    }

    // Time-based fallbacks
    if (
      timeOfDay === "morning" &&
      (lowerType.includes("routine") || lowerType.includes("start"))
    ) {
      return {
        emoji: "☕",
        reasoning: `Morning routine emoji`,
        confidence: 0.7,
      }
    }

    // Default fallback
    return {
      emoji: "📅",
      reasoning: `Default emoji for ${eventType}`,
      confidence: 0.3,
    }
  },
})
