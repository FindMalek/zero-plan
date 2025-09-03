import { tool } from "ai"
import { z } from "zod"
import { 
  getUserContext, 
  getDefaultLocation, 
  requiresTravel 
} from "@/config/user-context"

/**
 * Master event planner tool - analyzes user input holistically and creates structured event strategy
 */
export const analyzeUserIntentTool = tool({
  description: "Comprehensively analyze user input to understand intent, identify all events, and create a structured planning strategy",
  inputSchema: z.object({
    userInput: z.string().describe("The complete user input to analyze"),
    currentDateTime: z.string().describe("Current date/time for context"),
  }),
  execute: async ({ userInput }) => {
    const userContext = getUserContext()
    const homeLocation = getDefaultLocation(userContext)
    
    // Parse input for temporal markers
    const temporalMarkers = {
      today: /today|this (morning|afternoon|evening)/gi,
      tomorrow: /tomorrow|tmrw/gi,
      thisWeek: /this (week|weekend|saturday|sunday|monday|tuesday|wednesday|thursday|friday)/gi,
      nextWeek: /next (week|weekend|saturday|sunday|monday|tuesday|wednesday|thursday|friday)/gi,
      specificTime: /(\d{1,2})(:\d{2})?\s*(am|pm|h)/gi,
      specificDate: /(monday|tuesday|wednesday|thursday|friday|saturday|sunday)/gi
    }
    
    // Parse input for activity markers
    const activityMarkers = {
      appointments: /appointment|doctor|dentist|meeting|interview/gi,
      social: /coffee|lunch|dinner|party|birthday|celebration|visit|friend/gi,
      travel: /go to|travel to|drive to|visit|from .+ to/gi,
      work: /work|office|job|project|presentation|call|zoom/gi,
      personal: /shower|gym|workout|shopping|groceries|errands/gi,
      preparation: /prepare|pack|get ready|organize/gi
    }
    
    // Parse input for location markers
    const locationMarkers = {
      explicit: /at |in |to |from /gi,
      cities: /(tunis|sousse|monastir|gafsa|sfax|ksar hellal|sayeda|mahdia)/gi,
      venues: /(restaurant|cafe|hospital|office|gym|home|work)/gi
    }
    
    // Analyze the input
    const analysis = {
      temporalContext: {
        hasToday: temporalMarkers.today.test(userInput),
        hasTomorrow: temporalMarkers.tomorrow.test(userInput),
        hasThisWeek: temporalMarkers.thisWeek.test(userInput),
        hasNextWeek: temporalMarkers.nextWeek.test(userInput),
        specificTimes: [...userInput.matchAll(temporalMarkers.specificTime)].map(m => m[0]),
        specificDates: [...userInput.matchAll(temporalMarkers.specificDate)].map(m => m[0])
      },
      
      activityContext: {
        appointments: [...userInput.matchAll(activityMarkers.appointments)].map(m => m[0]),
        social: [...userInput.matchAll(activityMarkers.social)].map(m => m[0]),
        travel: [...userInput.matchAll(activityMarkers.travel)].map(m => m[0]),
        work: [...userInput.matchAll(activityMarkers.work)].map(m => m[0]),
        personal: [...userInput.matchAll(activityMarkers.personal)].map(m => m[0]),
        preparation: [...userInput.matchAll(activityMarkers.preparation)].map(m => m[0])
      },
      
      locationContext: {
        mentionedCities: [...userInput.matchAll(locationMarkers.cities)].map(m => m[0]),
        mentionedVenues: [...userInput.matchAll(locationMarkers.venues)].map(m => m[0]),
        hasLocationIndicators: locationMarkers.explicit.test(userInput)
      }
    }
    
    // Identify distinct events from the input
    const events = []
    
    // Split input by common conjunctions to find multiple events
    const segments = userInput.split(/,|\sand\s|\sthen\s|\safter\s|\sbefore\s/i)
    
    for (const segment of segments) {
      const trimmedSegment = segment.trim()
      if (trimmedSegment.length < 3) continue
      
      // Determine event type
      let eventType = 'general'
      let requiresTravelLogic = false
      
      if (activityMarkers.appointments.test(trimmedSegment)) {
        eventType = 'appointment'
        requiresTravelLogic = true
      } else if (activityMarkers.social.test(trimmedSegment)) {
        eventType = 'social'
        requiresTravelLogic = true
      } else if (activityMarkers.travel.test(trimmedSegment)) {
        eventType = 'travel'
        requiresTravelLogic = false // Travel is explicit
      } else if (activityMarkers.work.test(trimmedSegment)) {
        eventType = 'work'
        requiresTravelLogic = true
      } else if (activityMarkers.personal.test(trimmedSegment)) {
        eventType = 'personal'
        requiresTravelLogic = requiresTravel(trimmedSegment)
      } else if (activityMarkers.preparation.test(trimmedSegment)) {
        eventType = 'preparation'
        requiresTravelLogic = false
      }
      
      // Extract location if mentioned
      let eventLocation = null
      if (analysis.locationContext.mentionedCities.length > 0) {
        eventLocation = analysis.locationContext.mentionedCities[0]
      } else if (analysis.locationContext.mentionedVenues.length > 0) {
        eventLocation = analysis.locationContext.mentionedVenues[0]
      }
      
      events.push({
        segment: trimmedSegment,
        type: eventType,
        requiresTravel: requiresTravelLogic,
        location: eventLocation,
        temporalClues: analysis.temporalContext.specificTimes.filter(time => 
          trimmedSegment.toLowerCase().includes(time.toLowerCase())
        )
      })
    }
    
    // Create planning strategy
    let strategy = 'simple'
    let totalEventsEstimate = events.length
    
    if (events.some(e => e.requiresTravel)) {
      strategy = 'travel_required'
      totalEventsEstimate = events.filter(e => e.requiresTravel).length * 3 + 
                           events.filter(e => !e.requiresTravel).length
    }
    
    if (events.length > 2 || analysis.locationContext.mentionedCities.length > 1) {
      strategy = 'multi_event_complex'
      totalEventsEstimate = Math.max(totalEventsEstimate, events.length * 2)
    }
    
    return {
      userIntent: {
        primaryActivity: events[0]?.type || 'general',
        complexity: events.length > 1 ? 'complex' : 'simple',
        timeframe: analysis.temporalContext.hasTomorrow ? 'tomorrow' :
                  analysis.temporalContext.hasToday ? 'today' :
                  analysis.temporalContext.hasThisWeek ? 'this_week' : 'unspecified',
        hasExplicitTiming: analysis.temporalContext.specificTimes.length > 0
      },
      
      identifiedEvents: events,
      
      planningStrategy: {
        approach: strategy,
        estimatedTotalEvents: totalEventsEstimate,
        needsTravelPlanning: events.some(e => e.requiresTravel),
        needsTimeCoordination: events.length > 1,
        baseLocation: homeLocation.name
      },
      
      contextualFactors: {
        multipleLocations: analysis.locationContext.mentionedCities.length > 1,
        hasPersonNames: /[A-Z][a-z]+ [A-Z][a-z]+|friend \w+|\w+ friend/gi.test(userInput),
        hasUrgency: /urgent|asap|now|immediately/gi.test(userInput),
        hasPreferences: /prefer|like|want|need/gi.test(userInput)
      },
      
      recommendations: {
        shouldCreateMultipleEvents: totalEventsEstimate > 1,
        shouldIncludeTravel: events.some(e => e.requiresTravel),
        shouldCoordinateTiming: events.length > 1 && analysis.temporalContext.specificTimes.length > 0,
        suggestedProcessingOrder: events.map((e, i) => ({
          order: i + 1,
          event: e.segment,
          type: e.type
        }))
      },
      
      confidence: events.length > 0 ? 0.9 : 0.6,
      processingNotes: `Identified ${events.length} distinct activities with ${strategy} strategy`
    }
  },
})
