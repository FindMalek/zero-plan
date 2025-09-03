import { tool } from "ai"
import { z } from "zod"

import { getDefaultLocation, getUserContext } from "@/config/user-context"

/**
 * Tool for extracting locations and travel context from user input
 */
export const extractLocationContextTool = tool({
  description:
    "Extract location information and travel context from natural language input",
  inputSchema: z.object({
    userInput: z.string().describe("The user's natural language input"),
    existingEvents: z
      .array(
        z.object({
          title: z.string(),
          location: z.string().optional(),
        })
      )
      .optional()
      .describe("Any events already identified"),
  }),
  execute: async ({ userInput }) => {
    const userContext = getUserContext()
    const homeLocation = getDefaultLocation(userContext)

    // Common location patterns in Tunisia/North Africa
    const locationPatterns = [
      /(?:go to|travel to|visit|at|in)\s+([A-Za-z\s]+?)(?:\s|$|,|\.|!|\?)/gi,
      /from\s+([A-Za-z\s]+?)\s+to\s+([A-Za-z\s]+?)(?:\s|$|,|\.|!|\?)/gi,
      /(Tunis|Sousse|Monastir|Gafsa|Sfax|Ksar Hellal|Sayeda|Mahdia)/gi,
    ]

    const extractedLocations: string[] = []
    const travelPairs: Array<{ origin: string; destination: string }> = []

    // Extract location mentions
    for (const pattern of locationPatterns) {
      let match
      while ((match = pattern.exec(userInput)) !== null) {
        if (match.length === 2) {
          // Simple location mention
          const location = match[1].trim()
          if (location.length > 2 && !extractedLocations.includes(location)) {
            extractedLocations.push(location)
          }
        } else if (match.length === 3) {
          // Travel pair (from X to Y)
          const origin = match[1].trim()
          const destination = match[2].trim()
          travelPairs.push({ origin, destination })
          if (!extractedLocations.includes(origin))
            extractedLocations.push(origin)
          if (!extractedLocations.includes(destination))
            extractedLocations.push(destination)
        }
      }
    }

    // Check if input implies starting from home
    const impliesFromHome =
      /go to|drive to|visit|appointment at/i.test(userInput) &&
      travelPairs.length === 0

    // If we have destinations but no explicit origin, assume home
    if (impliesFromHome && extractedLocations.length > 0) {
      travelPairs.push({
        origin: homeLocation.name,
        destination: extractedLocations[0],
      })
    }

    return {
      extractedLocations,
      travelPairs,
      impliesTravel: travelPairs.length > 0 || extractedLocations.length > 0,
      homeLocation: homeLocation.name,
      confidence: extractedLocations.length > 0 ? 0.8 : 0.4,
      processingNotes: `Found ${extractedLocations.length} locations and ${travelPairs.length} travel pairs`,
    }
  },
})
