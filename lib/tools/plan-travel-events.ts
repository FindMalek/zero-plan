import { tool } from "ai"
import { z } from "zod"

import {
  estimateTravelTime,
  getPreferredTransportation,
  getUserContext,
} from "@/config/user-context"

/**
 * Tool for planning travel events between locations
 */
export const planTravelEventsTool = tool({
  description:
    "Plan travel events including route, timing, and transportation mode selection",
  inputSchema: z.object({
    origin: z.string().describe("Starting location"),
    destination: z.string().describe("Destination location"),
    mainEventTime: z.string().describe("ISO datetime of the main event"),
    mainEventDuration: z
      .number()
      .optional()
      .describe("Duration of main event in minutes"),
    transportMode: z.string().optional().describe("Preferred transport mode"),
    includeReturnTrip: z
      .boolean()
      .default(true)
      .describe("Whether to plan return trip"),
  }),
  execute: async ({
    origin,
    destination,
    mainEventTime,
    mainEventDuration = 60,
    transportMode,
    includeReturnTrip,
  }) => {
    const userContext = getUserContext()
    const preferredTransport = transportMode
      ? userContext.transportation.find((t) => t.mode === transportMode) ||
        getPreferredTransportation(userContext)
      : getPreferredTransportation(userContext)

    // Calculate travel time
    const travelTime = estimateTravelTime(
      origin,
      destination,
      preferredTransport
    )
    const bufferTime = userContext.preferences.defaultTravelBuffer

    // Calculate departure time (work backwards from main event)
    const mainEventDate = new Date(mainEventTime)
    const departureDate = new Date(
      mainEventDate.getTime() - (travelTime + bufferTime) * 60 * 1000
    )
    const arrivalDate = new Date(
      mainEventDate.getTime() - bufferTime * 60 * 1000
    )

    // Plan return trip if requested
    let returnTrip = null
    if (includeReturnTrip) {
      const returnDepartureDate = new Date(
        mainEventDate.getTime() + (mainEventDuration + bufferTime) * 60 * 1000
      )
      const returnArrivalDate = new Date(
        returnDepartureDate.getTime() + travelTime * 60 * 1000
      )

      returnTrip = {
        title: `${preferredTransport.emoji} ${preferredTransport.mode.charAt(0).toUpperCase() + preferredTransport.mode.slice(1)} (${destination} -> ${origin})`,
        startTime: returnDepartureDate.toISOString(),
        endTime: returnArrivalDate.toISOString(),
        description: `<p>Return journey details:</p><ul><li>Distance: ${origin} to ${destination}</li><li>Transport: ${preferredTransport.mode}</li><li>Estimated time: ${travelTime} minutes</li></ul><p>Safe travels! 🛣️</p>`,
        location: `${destination} to ${origin}`,
        emoji: preferredTransport.emoji,
        confidence: 0.8,
      }
    }

    return {
      outboundTrip: {
        title: `${preferredTransport.emoji} ${preferredTransport.mode.charAt(0).toUpperCase() + preferredTransport.mode.slice(1)} (${origin} -> ${destination})`,
        startTime: departureDate.toISOString(),
        endTime: arrivalDate.toISOString(),
        description: `<p>Travel details:</p><ul><li>Departure: ${origin}</li><li>Destination: ${destination}</li><li>Transport: ${preferredTransport.mode}</li><li>Estimated time: ${travelTime} minutes</li><li>Buffer time: ${bufferTime} minutes</li></ul><p>Plan to arrive a few minutes early! ⏰</p>`,
        location: `${origin} to ${destination}`,
        emoji: preferredTransport.emoji,
        confidence: 0.8,
      },
      returnTrip,
      transportMode: preferredTransport.mode,
      totalTravelTime: travelTime,
      bufferTime,
      recommendations: [
        "Check traffic conditions before departure",
        "Allow extra time for parking if driving",
        "Confirm destination address",
      ],
    }
  },
})
