import { tool } from "ai"
import { z } from "zod"

// Advanced travel formatting tool
export const formatTravelEventTool = tool({
  description:
    "Format travel/transportation events with proper Car (Origin -> Destination) format and intelligent transport detection",
  inputSchema: z.object({
    origin: z.string().describe("Starting location"),
    destination: z.string().describe("Ending location"),
    transportMode: z
      .string()
      .optional()
      .describe("Type of transport (car, bike, flight, etc.)"),
    estimatedDuration: z
      .number()
      .optional()
      .describe("Estimated travel time in minutes"),
    context: z.string().optional().describe("Additional travel context"),
  }),
  execute: async ({
    origin,
    destination,
    transportMode,
    estimatedDuration,
    context,
  }) => {
    const transportEmojis: Record<string, string> = {
      car: "🚗",
      bike: "🚲",
      bicycle: "🚲",
      walk: "🚶",
      walking: "🚶",
      bus: "🚌",
      train: "🚂",
      flight: "✈️",
      plane: "✈️",
      uber: "🚗",
      taxi: "🚕",
      metro: "🚇",
      subway: "🚇",
    }

    // Auto-detect transport mode if not provided
    let detectedMode = transportMode?.toLowerCase() || "car"

    if (!transportMode && context) {
      const contextLower = context.toLowerCase()
      for (const [mode] of Object.entries(transportEmojis)) {
        if (contextLower.includes(mode)) {
          detectedMode = mode
          break
        }
      }
    }

    const emoji = transportEmojis[detectedMode] || "🚗"
    const modeCapitalized =
      detectedMode.charAt(0).toUpperCase() + detectedMode.slice(1)
    const formattedTitle = `${emoji} ${modeCapitalized} (${origin} -> ${destination})`

    return {
      formattedTitle,
      emoji,
      transportMode: detectedMode,
      suggestion: `Use format: ${formattedTitle}`,
      estimatedDuration: estimatedDuration || null,
      confidence: transportMode ? 0.9 : 0.7,
    }
  },
})
