import { tool } from "ai"
import { z } from "zod"

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
