import { tool } from "ai"
import { z } from "zod"
import {
  getUserContext,
  getDefaultLocation,
  requiresTravel,
} from "@/config/user-context"

/**
 * Enhanced tool for analyzing events and determining if they need multi-event breakdown
 */
export const analyzeEventComplexityTool = tool({
  description:
    "Analyze events to determine if they require multiple related events (travel, preparation, main event, return)",
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
    userInput,
    mentionedLocations = [],
  }) => {
    const userContext = getUserContext()
    const homeLocation = getDefaultLocation(userContext)

    // Determine if this event needs travel
    const needsTravel = requiresTravel(eventTitle, eventLocation)

    // Analyze complexity based on event type and mentions
    const complexityFactors = {
      hasExplicitLocation: !!eventLocation,
      hasImpliedLocation: needsTravel,
      mentionsTravel: /go to|travel to|drive to|bike to|walk to/i.test(
        userInput
      ),
      multipleLocations: mentionedLocations.length > 1,
      isOutOfHome:
        eventLocation &&
        eventLocation.toLowerCase() !== homeLocation.name.toLowerCase(),
    }

    const complexity = Object.values(complexityFactors).filter(Boolean).length

    // Determine event breakdown strategy
    let eventStrategy: "simple" | "travel_required" | "multi_location" =
      "simple"

    if (
      complexityFactors.multipleLocations ||
      complexityFactors.mentionsTravel
    ) {
      eventStrategy = "multi_location"
    } else if (needsTravel && complexityFactors.isOutOfHome) {
      eventStrategy = "travel_required"
    }

    return {
      needsTravel,
      complexity,
      strategy: eventStrategy,
      factors: complexityFactors,
      suggestedEvents:
        eventStrategy === "simple"
          ? 1
          : eventStrategy === "travel_required"
            ? 3 // travel + main + return
            : mentionedLocations.length + 1, // travel to each location + main event
      homeLocation: homeLocation.name,
      confidence: complexity > 2 ? 0.9 : 0.7,
    }
  },
})
