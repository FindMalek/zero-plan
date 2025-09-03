import { tool } from "ai"
import { z } from "zod"

/**
 * Event structure planner - creates detailed event breakdown based on user intent analysis
 */
export const planEventStructureTool = tool({
  description: "Create detailed event structure and timing based on comprehensive user intent analysis",
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
        temporalClues: z.array(z.string())
      })),
      planningStrategy: z.object({
        approach: z.string(),
        estimatedTotalEvents: z.number(),
        needsTravelPlanning: z.boolean(),
        needsTimeCoordination: z.boolean(),
        baseLocation: z.string()
      }),
      recommendations: z.object({
        shouldCreateMultipleEvents: z.boolean(),
        shouldIncludeTravel: z.boolean(),
        shouldCoordinateTiming: z.boolean()
      })
    }),
    baseDateTime: z.string().describe("Base datetime for event scheduling")
  }),
  execute: async ({ userIntentAnalysis, baseDateTime }) => {
    const { identifiedEvents, planningStrategy, recommendations } = userIntentAnalysis
    
    const eventStructure = []
    let currentTime = new Date(baseDateTime)
    
    for (let i = 0; i < identifiedEvents.length; i++) {
      const event = identifiedEvents[i]
      const nextEventTime = new Date(currentTime.getTime() + (i * 60 * 60 * 1000)) // 1 hour spacing default
      
      // Create main event structure
      const mainEvent = {
        id: `main_${i + 1}`,
        type: 'main_event',
        title: event.segment,
        eventType: event.type,
        startTime: nextEventTime.toISOString(),
        endTime: new Date(nextEventTime.getTime() + 60 * 60 * 1000).toISOString(), // 1 hour duration
        location: event.location,
        requiresTravel: event.requiresTravel,
        confidence: 0.9
      }
      
      // Add travel events if needed
      if (event.requiresTravel && event.location) {
        // Pre-travel event
        const travelToTime = new Date(nextEventTime.getTime() - 30 * 60 * 1000) // 30 min before
        const preTravel = {
          id: `travel_to_${i + 1}`,
          type: 'travel_outbound',
          title: `Travel to ${event.location}`,
          eventType: 'travel',
          startTime: new Date(travelToTime.getTime() - 15 * 60 * 1000).toISOString(), // 15 min travel
          endTime: travelToTime.toISOString(),
          location: `${planningStrategy.baseLocation} to ${event.location}`,
          requiresTravel: false,
          confidence: 0.8
        }
        
        // Post-travel event
        const travelBackTime = new Date(nextEventTime.getTime() + 75 * 60 * 1000) // 15 min after main event
        const postTravel = {
          id: `travel_back_${i + 1}`,
          type: 'travel_return',
          title: `Return to ${planningStrategy.baseLocation}`,
          eventType: 'travel',
          startTime: travelBackTime.toISOString(),
          endTime: new Date(travelBackTime.getTime() + 15 * 60 * 1000).toISOString(),
          location: `${event.location} to ${planningStrategy.baseLocation}`,
          requiresTravel: false,
          confidence: 0.8
        }
        
        eventStructure.push(preTravel, mainEvent, postTravel)
      } else {
        eventStructure.push(mainEvent)
      }
      
      // Update current time for next event
      currentTime = new Date(nextEventTime.getTime() + 2 * 60 * 60 * 1000) // 2 hour spacing
    }
    
    return {
      structuredEvents: eventStructure,
      eventFlow: {
        totalEvents: eventStructure.length,
        hasTravelComponents: eventStructure.some(e => e.type.includes('travel')),
        estimatedDuration: eventStructure.length > 0 ? 
          (new Date(eventStructure[eventStructure.length - 1].endTime).getTime() - 
           new Date(eventStructure[0].startTime).getTime()) / (1000 * 60) : 0, // in minutes
        eventTypes: [...new Set(eventStructure.map(e => e.eventType))]
      },
      planningInsights: {
        complexity: eventStructure.length > 3 ? 'high' : eventStructure.length > 1 ? 'medium' : 'low',
        logisticalChallenges: recommendations.shouldCoordinateTiming ? ['timing_coordination'] : [],
        optimizationOpportunities: eventStructure.filter(e => e.type.includes('travel')).length > 2 ? 
          ['travel_optimization'] : []
      },
      confidence: 0.85,
      processingNotes: `Created ${eventStructure.length} structured events with ${eventStructure.filter(e => e.type.includes('travel')).length} travel components`
    }
  },
})
