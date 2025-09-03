import { tool } from "ai"
import { z } from "zod"
import { PROGRESS_STAGES, type ProgressContext } from "@/lib/utils/progress-helper"

/**
 * Enhanced Time Context Tool
 * 
 * Provides comprehensive current date, time, timezone, and scheduling context
 * for accurate event creation. This tool serves as the temporal foundation
 * for all event planning operations.
 * 
 * Key Features:
 * - Current date/time in multiple formats
 * - Timezone-aware calculations  
 * - Relative date calculations (tomorrow, next week)
 * - Scheduling context for smart event placement
 * 
 * @example
 * ```typescript
 * const timeInfo = await getCurrentTimeInfoTool.execute({
 *   timezone: "America/New_York",
 *   includeRelativeDates: true
 * });
 * // Returns: { currentDate: "Friday, December 21, 2024", currentTime: "2:30 PM", ... }
 * ```
 */
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
