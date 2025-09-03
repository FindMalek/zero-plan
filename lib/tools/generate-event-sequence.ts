import { tool } from "ai"
import { z } from "zod"
import {
  getUserContext,
  getDefaultLocation,
  getPreferredTransportation,
  estimateTravelTime,
} from "@/config/user-context"

/**
 * Tool for generating contextual event sequences
 */
export const generateEventSequenceTool = tool({
  description:
    "Generate a sequence of related events based on user context and event analysis",
  inputSchema: z.object({
    mainEvent: z.object({
      title: z.string(),
      description: z.string().optional(),
      location: z.string().optional(),
      startTime: z.string(),
      endTime: z.string().optional(),
      type: z.string(),
    }),
    strategy: z.enum(["simple", "travel_required", "multi_location"]),
    userContext: z
      .string()
      .optional()
      .describe("Additional context from user input"),
  }),
  execute: async ({ mainEvent, strategy }) => {
    const userContext = getUserContext()
    const homeLocation = getDefaultLocation(userContext)

    const eventSequence = []

    if (strategy === "simple") {
      // Just return the main event
      eventSequence.push({
        ...mainEvent,
        confidence: 0.9,
      })
    } else if (strategy === "travel_required") {
      // Generate: Travel to location -> Main event -> Travel back
      const mainEventDuration = mainEvent.endTime
        ? new Date(mainEvent.endTime).getTime() -
          new Date(mainEvent.startTime).getTime()
        : 60 * 60 * 1000 // 1 hour default

      const destination = mainEvent.location || "destination"

      // Calculate travel plan manually since we can't call tools from within tools
      const userContext = getUserContext()
      const preferredTransport = getPreferredTransportation(userContext)
      const travelTime = estimateTravelTime(
        homeLocation.name,
        destination,
        preferredTransport
      )
      const bufferTime = userContext.preferences.defaultTravelBuffer

      // Calculate departure time (work backwards from main event)
      const mainEventDate = new Date(mainEvent.startTime)
      const departureDate = new Date(
        mainEventDate.getTime() - (travelTime + bufferTime) * 60 * 1000
      )
      const arrivalDate = new Date(
        mainEventDate.getTime() - bufferTime * 60 * 1000
      )

      // Create outbound travel event
      const outboundTrip = {
        title: `${preferredTransport.emoji} ${preferredTransport.mode.charAt(0).toUpperCase() + preferredTransport.mode.slice(1)} (${homeLocation.name} -> ${destination})`,
        startTime: departureDate.toISOString(),
        endTime: arrivalDate.toISOString(),
        description: `<p>Travel details:</p><ul><li>Departure: ${homeLocation.name}</li><li>Destination: ${destination}</li><li>Transport: ${preferredTransport.mode}</li><li>Estimated time: ${travelTime} minutes</li><li>Buffer time: ${bufferTime} minutes</li></ul><p>Plan to arrive a few minutes early! ⏰</p>`,
        location: `${homeLocation.name} to ${destination}`,
        emoji: preferredTransport.emoji,
        confidence: 0.8,
      }

      // Create return travel event
      const returnDepartureDate = new Date(
        mainEventDate.getTime() +
          (mainEventDuration / (60 * 1000) + bufferTime) * 60 * 1000
      )
      const returnArrivalDate = new Date(
        returnDepartureDate.getTime() + travelTime * 60 * 1000
      )

      const returnTrip = {
        title: `${preferredTransport.emoji} ${preferredTransport.mode.charAt(0).toUpperCase() + preferredTransport.mode.slice(1)} (${destination} -> ${homeLocation.name})`,
        startTime: returnDepartureDate.toISOString(),
        endTime: returnArrivalDate.toISOString(),
        description: `<p>Return journey details:</p><ul><li>Distance: ${destination} to ${homeLocation.name}</li><li>Transport: ${preferredTransport.mode}</li><li>Estimated time: ${travelTime} minutes</li></ul><p>Safe travels! 🛣️</p>`,
        location: `${destination} to ${homeLocation.name}`,
        emoji: preferredTransport.emoji,
        confidence: 0.8,
      }

      // Add events in order
      eventSequence.push(outboundTrip)
      eventSequence.push({ ...mainEvent, confidence: 0.9 })
      eventSequence.push(returnTrip)
    } else if (strategy === "multi_location") {
      // More complex multi-location handling
      // For now, treat as travel_required but could be enhanced
      const mainEventDuration = mainEvent.endTime
        ? new Date(mainEvent.endTime).getTime() -
          new Date(mainEvent.startTime).getTime()
        : 60 * 60 * 1000

      const destination = mainEvent.location || "destination"

      // Use same logic as travel_required for now
      const userContext = getUserContext()
      const preferredTransport = getPreferredTransportation(userContext)
      const travelTime = estimateTravelTime(
        homeLocation.name,
        destination,
        preferredTransport
      )
      const bufferTime = userContext.preferences.defaultTravelBuffer

      const mainEventDate = new Date(mainEvent.startTime)
      const departureDate = new Date(
        mainEventDate.getTime() - (travelTime + bufferTime) * 60 * 1000
      )
      const arrivalDate = new Date(
        mainEventDate.getTime() - bufferTime * 60 * 1000
      )

      const outboundTrip = {
        title: `${preferredTransport.emoji} ${preferredTransport.mode.charAt(0).toUpperCase() + preferredTransport.mode.slice(1)} (${homeLocation.name} -> ${destination})`,
        startTime: departureDate.toISOString(),
        endTime: arrivalDate.toISOString(),
        description: `<p>Travel details:</p><ul><li>Departure: ${homeLocation.name}</li><li>Destination: ${destination}</li><li>Transport: ${preferredTransport.mode}</li><li>Estimated time: ${travelTime} minutes</li></ul>`,
        location: `${homeLocation.name} to ${destination}`,
        emoji: preferredTransport.emoji,
        confidence: 0.8,
      }

      const returnDepartureDate = new Date(
        mainEventDate.getTime() +
          (mainEventDuration / (60 * 1000) + bufferTime) * 60 * 1000
      )
      const returnArrivalDate = new Date(
        returnDepartureDate.getTime() + travelTime * 60 * 1000
      )

      const returnTrip = {
        title: `${preferredTransport.emoji} ${preferredTransport.mode.charAt(0).toUpperCase() + preferredTransport.mode.slice(1)} (${destination} -> ${homeLocation.name})`,
        startTime: returnDepartureDate.toISOString(),
        endTime: returnArrivalDate.toISOString(),
        description: `<p>Return journey details:</p><ul><li>Distance: ${destination} to ${homeLocation.name}</li><li>Transport: ${preferredTransport.mode}</li><li>Estimated time: ${travelTime} minutes</li></ul>`,
        location: `${destination} to ${homeLocation.name}`,
        emoji: preferredTransport.emoji,
        confidence: 0.8,
      }

      eventSequence.push(outboundTrip)
      eventSequence.push({ ...mainEvent, confidence: 0.9 })
      eventSequence.push(returnTrip)
    }

    return {
      events: eventSequence,
      strategy,
      totalEvents: eventSequence.length,
      processingNotes: `Generated ${eventSequence.length} events using ${strategy} strategy`,
      confidence: strategy === "simple" ? 0.9 : 0.8,
    }
  },
})
