import { tool } from "ai"
import { z } from "zod"

// Enhanced time context tool
export const getCurrentTimeInfoTool = tool({
  description:
    "Get comprehensive current date, time, timezone, and scheduling context for accurate event creation",
  inputSchema: z.object({
    timezone: z
      .string()
      .optional()
      .describe("Optional timezone to get time for (defaults to local)"),
    includeRelativeDates: z
      .boolean()
      .default(true)
      .describe(
        "Include relative date calculations (tomorrow, next week, etc.)"
      ),
  }),
  execute: async ({ timezone, includeRelativeDates }) => {
    const now = new Date()

    const currentDate = now.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })

    const currentTime = now.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })

    // Calculate relative dates
    const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000)
    const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)

    const result = {
      currentDate,
      currentTime,
      dayOfWeek: now.toLocaleDateString("en-US", { weekday: "long" }),
      isoDateTime: now.toISOString(),
      dateOnly: now.toISOString().split("T")[0],
      timeOnly: now.toTimeString().split(" ")[0],
      timezone: timezone || Intl.DateTimeFormat().resolvedOptions().timeZone,
      unixTimestamp: now.getTime(),
      dateContext: `Today is ${currentDate} at ${currentTime}`,
      hour24: now.getHours(),
      minute: now.getMinutes(),
    }

    if (includeRelativeDates) {
      return {
        ...result,
        tomorrow: {
          date: tomorrow.toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
          }),
          isoDate: tomorrow.toISOString().split("T")[0],
        },
        nextWeek: {
          date: nextWeek.toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
          }),
          isoDate: nextWeek.toISOString().split("T")[0],
        },
      }
    }

    return result
  },
})

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

// Rich description generation tool
export const generateEventDescriptionTool = tool({
  description:
    "Generate rich HTML descriptions with task lists, schedules, and detailed context for events",
  inputSchema: z.object({
    eventType: z.string().describe("Type of event"),
    eventTitle: z.string().describe("Event title"),
    context: z
      .string()
      .optional()
      .describe("Additional context about the event"),
    timeOfDay: z.string().optional().describe("Time of day context"),
    duration: z.number().optional().describe("Event duration in minutes"),
    includeTaskList: z
      .boolean()
      .default(true)
      .describe("Whether to include a task list"),
  }),
  execute: async ({
    eventType,
    eventTitle,
    context,
    timeOfDay,
    duration,
    includeTaskList,
  }) => {
    const descriptionTemplates: Record<
      string,
      (title: string, ctx?: string, time?: string, dur?: number) => string
    > = {
      morning: () =>
        `
        <p>Tasks you should do, each morning session:</p>
        <ul>
          <li>Go to the toilet</li>
          <li>Wash your face</li>
          <li>Wash your teeth</li>
          <li>Prepare breakfast</li>
        </ul>
        <p>Now raise your fist up to the sky, and fight soldier.</p>
      `.trim(),

      work: (title: string, _ctx?: string, _time?: string, dur?: number) =>
        `
        <p>The purpose of this session is to focus on key objectives and tasks. 
        It serves as a productive time block to make progress on important work 
        and ensure alignment with project goals.</p>
        ${dur ? `<p><em>Estimated duration: ${Math.floor(dur / 60)}h ${dur % 60}m</em></p>` : ""}
      `.trim(),

      meeting: (title: string, ctx?: string) =>
        `
        <p>Meeting agenda and objectives:</p>
        <ul>
          <li>Review progress and updates</li>
          <li>Discuss key topics and decisions</li>
          <li>Plan next steps and action items</li>
        </ul>
        ${ctx ? `<p>Context: ${ctx}</p>` : ""}
      `.trim(),

      preparation: (_title: string, ctx?: string) =>
        `
        <p>To Do List:</p>
        <ol>
          <li>Gather required items</li>
          <li>Check equipment/supplies</li>
          <li>Review objectives</li>
          <li>Set up workspace</li>
        </ol>
        ${ctx ? `<p>Special notes: ${ctx}</p>` : ""}
      `.trim(),

      workout: (_title: string, _ctx?: string, _time?: string, dur?: number) =>
        `
        <p>Training Session Details:</p>
        <ul>
          <li>Warm-up: 5-10 minutes</li>
          <li>Main workout: Focus on form and progression</li>
          <li>Cool-down and stretching</li>
        </ul>
        <p><br></p><p>Remember: Consistency beats intensity.</p>
        ${dur ? `<p>Total session time: ${Math.floor(dur / 60)}h ${dur % 60}m</p>` : ""}
      `.trim(),

      travel: (_title: string, ctx?: string, _time?: string, dur?: number) =>
        `
        <p>Travel Details:</p>
        <ul>
          <li>Check departure time</li>
          <li>Prepare necessary items</li>
          <li>Allow extra time for delays</li>
          ${dur ? `<li>Expected travel time: ${Math.floor(dur / 60)}h ${dur % 60}m</li>` : ""}
        </ul>
        ${ctx ? `<p>Additional notes: ${ctx}</p>` : ""}
      `.trim(),

      appointment: (title: string, ctx?: string) =>
        `
        <p>Appointment checklist:</p>
        <ul>
          <li>Confirm appointment time</li>
          <li>Prepare necessary documents</li>
          <li>Plan arrival time (15 min early)</li>
        </ul>
        ${ctx ? `<p>Notes: ${ctx}</p>` : ""}
      `.trim(),

      birthday: (title: string, ctx?: string) =>
        `
        <p>🎉 Party preparations:</p>
        <ul>
          <li>Bring/prepare gift</li>
          <li>Confirm attendance</li>
          <li>Plan outfit</li>
          <li>Check location and directions</li>
        </ul>
        ${ctx ? `<p>Special details: ${ctx}</p>` : ""}
        <p>Let's make it memorable! 🎈</p>
      `.trim(),
    }

    const type = eventType.toLowerCase()

    // Find matching template
    for (const [key, template] of Object.entries(descriptionTemplates)) {
      if (type.includes(key)) {
        return {
          description: template(eventTitle, context, timeOfDay, duration),
          template: key,
          confidence: 0.9,
        }
      }
    }

    // Enhanced default description
    let defaultDesc = `<p><strong>${eventTitle}</strong></p>`

    if (context) {
      defaultDesc += `<p>${context}</p>`
    }

    if (includeTaskList) {
      defaultDesc += `
        <p>Key points:</p>
        <ul>
          <li>Review event details</li>
          <li>Prepare as needed</li>
          <li>Arrive on time</li>
        </ul>
      `
    }

    return {
      description: defaultDesc.trim(),
      template: "default",
      confidence: 0.6,
    }
  },
})

// Smart time scheduling tool
export const calculateEventTimingTool = tool({
  description:
    "Calculate smart event timing, duration, and scheduling based on event type and context",
  inputSchema: z.object({
    eventType: z.string().describe("Type of event"),
    userTimePreference: z
      .string()
      .optional()
      .describe(
        "User's preferred time (e.g., 'morning', 'afternoon', 'tomorrow at 3pm')"
      ),
    baseDatetime: z
      .string()
      .describe("Base datetime to calculate from (ISO string)"),
  }),
  execute: async ({ eventType, userTimePreference, baseDatetime }) => {
    const baseDate = new Date(baseDatetime)

    // Default durations by event type (in minutes)
    const durationMap: Record<string, number> = {
      meeting: 60,
      workout: 75,
      training: 90,
      appointment: 30,
      coffee: 30,
      lunch: 60,
      dinner: 90,
      travel: 30,
      preparation: 30,
      shower: 15,
      grooming: 30,
      work: 120,
      break: 15,
      birthday: 180,
      party: 240,
    }

    const type = eventType.toLowerCase()
    let duration = 60 // default 1 hour

    // Find duration match
    for (const [key, dur] of Object.entries(durationMap)) {
      if (type.includes(key)) {
        duration = dur
        break
      }
    }

    // Calculate smart start time
    let startTime = baseDate

    if (userTimePreference) {
      const pref = userTimePreference.toLowerCase()

      if (pref.includes("tomorrow")) {
        const tomorrow = new Date(baseDate)
        tomorrow.setDate(tomorrow.getDate() + 1)

        if (pref.includes("morning")) {
          tomorrow.setHours(9, 0, 0, 0)
        } else if (pref.includes("afternoon")) {
          tomorrow.setHours(14, 0, 0, 0)
        } else if (pref.includes("evening")) {
          tomorrow.setHours(18, 0, 0, 0)
        } else {
          tomorrow.setHours(10, 0, 0, 0)
        }

        startTime = tomorrow
      } else if (pref.includes("morning")) {
        const morning = new Date(baseDate)
        morning.setHours(9, 0, 0, 0)
        startTime = morning
      } else if (pref.includes("afternoon")) {
        const afternoon = new Date(baseDate)
        afternoon.setHours(14, 0, 0, 0)
        startTime = afternoon
      } else if (pref.includes("evening")) {
        const evening = new Date(baseDate)
        evening.setHours(18, 0, 0, 0)
        startTime = evening
      }

      // Parse specific times like "3pm", "10:30am"
      const timeMatch = pref.match(/(\d{1,2})(?::(\d{2}))?\s*(am|pm)/i)
      if (timeMatch) {
        const hour = parseInt(timeMatch[1])
        const minute = parseInt(timeMatch[2] || "0")
        const isPM = timeMatch[3].toLowerCase() === "pm"

        const specificTime = new Date(startTime)
        specificTime.setHours(
          isPM && hour !== 12 ? hour + 12 : hour === 12 && !isPM ? 0 : hour,
          minute,
          0,
          0
        )
        startTime = specificTime
      }
    }

    // Calculate end time
    const endTime = new Date(startTime.getTime() + duration * 60 * 1000)

    return {
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
      duration,
      confidence: userTimePreference ? 0.8 : 0.6,
      reasoning: `Calculated ${duration}min duration for ${eventType} event`,
    }
  },
})
