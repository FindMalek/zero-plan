import { z } from "zod"

// =============================================================================
// ANALYTICS RESPONSE OBJECTS (Three-Tier System)
// =============================================================================

// System Stats Simple RO
export const systemStatsSimpleRo = z.object({
  totalUsers: z.number(),
  totalEvents: z.number(),
  totalCalendars: z.number(),
  totalProcessingSessions: z.number(),
  generatedAt: z.date(),
})

export type SystemStatsSimpleRo = z.infer<typeof systemStatsSimpleRo>

// System Stats RO (With activity metrics)
export const systemStatsRo = systemStatsSimpleRo.extend({
  activeUsers: z.number(),
  eventsCreatedToday: z.number(),
  eventsCreatedThisWeek: z.number(),
  eventsCreatedThisMonth: z.number(),
})

export type SystemStatsRo = z.infer<typeof systemStatsRo>

// System Stats Full RO (With detailed breakdowns)
export const systemStatsFullRo = systemStatsRo.extend({
  topModels: z
    .array(
      z.object({
        model: z.string(),
        provider: z.string(),
        usage: z.number(),
        successRate: z.number(),
      })
    )
    .optional(),
  topCalendars: z
    .array(
      z.object({
        name: z.string(),
        eventCount: z.number(),
      })
    )
    .optional(),
})

export type SystemStatsFullRo = z.infer<typeof systemStatsFullRo>

// User Activity Stats RO
export const userActivityStatsRo = z.object({
  userId: z.string(),
  totalEvents: z.number(),
  totalCalendars: z.number(),
  totalProcessingSessions: z.number(),
  eventsThisWeek: z.number(),
  eventsThisMonth: z.number(),
  averageEventsPerDay: z.number(),
  mostActiveCalendar: z.string().optional(),
  lastActivityAt: z.date().optional(),
  generatedAt: z.date(),
})

export type UserActivityStatsRo = z.infer<typeof userActivityStatsRo>

// Calendar Usage Stats RO
export const calendarUsageStatsRo = z.object({
  calendarId: z.string(),
  calendarName: z.string(),
  totalEvents: z.number(),
  upcomingEvents: z.number(),
  pastEvents: z.number(),
  eventsThisWeek: z.number(),
  eventsThisMonth: z.number(),
  averageEventsPerDay: z.number(),
  lastEventAt: z.date().optional(),
  generatedAt: z.date(),
})

export type CalendarUsageStatsRo = z.infer<typeof calendarUsageStatsRo>

// Processing Performance Stats RO
export const processingPerformanceStatsRo = z.object({
  totalSessions: z.number(),
  successfulSessions: z.number(),
  failedSessions: z.number(),
  averageProcessingTime: z.number(),
  averageConfidence: z.number(),
  totalEventsGenerated: z.number(),
  averageEventsPerSession: z.number(),
  topModels: z.array(
    z.object({
      model: z.string(),
      provider: z.string(),
      usage: z.number(),
      successRate: z.number(),
    })
  ),
  generatedAt: z.date(),
})

export type ProcessingPerformanceStatsRo = z.infer<
  typeof processingPerformanceStatsRo
>

// Dashboard Summary RO
export const dashboardSummaryRo = z.object({
  totalUsers: z.number(),
  totalEvents: z.number(),
  eventsCreatedToday: z.number(),
  activeUsers: z.number(),
  successfulProcessingSessions: z.number(),
  averageProcessingTime: z.number(),
  topCalendars: z.array(
    z.object({
      name: z.string(),
      eventCount: z.number(),
    })
  ),
})

export type DashboardSummaryRo = z.infer<typeof dashboardSummaryRo>

// =============================================================================
// API RESPONSE WRAPPERS
// =============================================================================

// Get System Statistics Response
export const getSystemStatsRo = z.object({
  success: z.boolean(),
  stats: systemStatsFullRo.optional(),
  error: z.string().optional(),
})

export type GetSystemStatsRo = z.infer<typeof getSystemStatsRo>

// Get User Activity Statistics Response
export const getUserActivityStatsRo = z.object({
  success: z.boolean(),
  stats: userActivityStatsRo.optional(),
  error: z.string().optional(),
})

export type GetUserActivityStatsRo = z.infer<typeof getUserActivityStatsRo>

// Get Calendar Usage Statistics Response
export const getCalendarUsageStatsRo = z.object({
  success: z.boolean(),
  stats: z.array(calendarUsageStatsRo).optional(),
  error: z.string().optional(),
})

export type GetCalendarUsageStatsRo = z.infer<typeof getCalendarUsageStatsRo>

// Get Processing Performance Statistics Response
export const getProcessingPerformanceStatsRo = z.object({
  success: z.boolean(),
  stats: processingPerformanceStatsRo.optional(),
  error: z.string().optional(),
})

export type GetProcessingPerformanceStatsRo = z.infer<
  typeof getProcessingPerformanceStatsRo
>

// Get Dashboard Summary Response
export const getDashboardSummaryRo = z.object({
  success: z.boolean(),
  summary: dashboardSummaryRo.optional(),
  error: z.string().optional(),
})

export type GetDashboardSummaryRo = z.infer<typeof getDashboardSummaryRo>

// Get Event Analytics Response
export const getEventAnalyticsRo = z.object({
  success: z.boolean(),
  analytics: z
    .object({
      totalEvents: z.number(),
      data: z.array(
        z.object({
          period: z.string(),
          events: z.number(),
          calendars: z.array(
            z.object({
              id: z.string(),
              name: z.string(),
              eventCount: z.number(),
            })
          ),
        })
      ),
      trends: z
        .object({
          growth: z.number(),
          direction: z.enum(["up", "down", "stable"]),
        })
        .optional(),
    })
    .optional(),
  error: z.string().optional(),
})

export type GetEventAnalyticsRo = z.infer<typeof getEventAnalyticsRo>

// Export Analytics Data Response
export const exportAnalyticsRo = z.object({
  success: z.boolean(),
  downloadUrl: z.string().optional(),
  fileName: z.string().optional(),
  format: z.string().optional(),
  recordCount: z.number().optional(),
  error: z.string().optional(),
})

export type ExportAnalyticsRo = z.infer<typeof exportAnalyticsRo>
