/**
 * Static user context for MVP - provides user preferences and context
 * for enhanced AI event generation
 */

export interface UserLocation {
  name: string
  address: string
  isDefault: boolean
  type: "home" | "work" | "other"
}

export interface TransportationPreference {
  mode: "car" | "bike" | "scooter" | "walk" | "bus" | "taxi"
  isDefault: boolean
  estimatedSpeed: number // km/h
  setupTime: number // minutes needed to prepare
  emoji: string
}

export interface UserContext {
  id: string
  name: string
  locations: UserLocation[]
  transportation: TransportationPreference[]
  preferences: {
    defaultTravelBuffer: number // minutes before/after events
    preferredTravelMode: string
    workingHours: {
      start: string // HH:mm
      end: string // HH:mm
    }
  }
}

// MVP Static user context - normally this would come from user settings/database
export const DEFAULT_USER_CONTEXT: UserContext = {
  id: "user_1",
  name: "Default User",
  locations: [
    {
      name: "Home",
      address: "Ksar Hellal",
      isDefault: true,
      type: "home",
    },
    {
      name: "Work",
      address: "Sousse Office",
      isDefault: false,
      type: "work",
    },
  ],
  transportation: [
    {
      mode: "car",
      isDefault: true,
      estimatedSpeed: 45, // km/h average in city
      setupTime: 5, // 5 min to get ready and get to car
      emoji: "🚗",
    },
    {
      mode: "bike",
      isDefault: false,
      estimatedSpeed: 15,
      setupTime: 3,
      emoji: "🚲",
    },
    {
      mode: "scooter",
      isDefault: false,
      estimatedSpeed: 25,
      setupTime: 3,
      emoji: "🛵",
    },
    {
      mode: "walk",
      isDefault: false,
      estimatedSpeed: 5,
      setupTime: 1,
      emoji: "🚶",
    },
  ],
  preferences: {
    defaultTravelBuffer: 10, // 10 minutes buffer
    preferredTravelMode: "car",
    workingHours: {
      start: "09:00",
      end: "17:00",
    },
  },
}

/**
 * Gets user context - for MVP returns static context
 * In production, this would fetch from database/user settings
 */
export function getUserContext(): UserContext {
  return DEFAULT_USER_CONTEXT
}

/**
 * Gets user's default/home location
 */
export function getDefaultLocation(context: UserContext): UserLocation {
  return context.locations.find((loc) => loc.isDefault) || context.locations[0]
}

/**
 * Gets user's preferred transportation mode
 */
export function getPreferredTransportation(
  context: UserContext
): TransportationPreference {
  return (
    context.transportation.find((t) => t.isDefault) || context.transportation[0]
  )
}

/**
 * Estimates travel time between two locations
 */
export function estimateTravelTime(
  from: string,
  to: string,
  transportMode: TransportationPreference
): number {
  // For MVP, use simple distance estimation
  // In production, this would integrate with maps API

  const distanceMap: Record<string, Record<string, number>> = {
    "ksar hellal": {
      sayeda: 12, // km
      sousse: 20,
      monastir: 8,
      gafsa: 180,
    },
    sousse: {
      sayeda: 8,
      "ksar hellal": 20,
      monastir: 15,
      gafsa: 170,
    },
    sayeda: {
      "ksar hellal": 12,
      sousse: 8,
      monastir: 5,
      gafsa: 175,
    },
  }

  const fromKey = from.toLowerCase().trim()
  const toKey = to.toLowerCase().trim()

  const distance =
    distanceMap[fromKey]?.[toKey] || distanceMap[toKey]?.[fromKey] || 15 // default 15km

  const travelTimeHours = distance / transportMode.estimatedSpeed
  const travelTimeMinutes = Math.ceil(travelTimeHours * 60)

  return travelTimeMinutes + transportMode.setupTime
}

/**
 * Determines if an event likely requires travel
 */
export function requiresTravel(
  eventTitle: string,
  eventLocation?: string
): boolean {
  const travelKeywords = [
    "coffee",
    "restaurant",
    "meeting",
    "appointment",
    "visit",
    "party",
    "birthday",
    "celebration",
    "gym",
    "shopping",
    "doctor",
    "hospital",
    "work",
    "office",
  ]

  const title = eventTitle.toLowerCase()
  const hasLocation = eventLocation && eventLocation.trim().length > 0

  return (
    hasLocation || travelKeywords.some((keyword) => title.includes(keyword))
  )
}
