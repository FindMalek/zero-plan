import { z } from "zod"

// =============================================================================
// CORE ANALYTICS ENTITY SCHEMAS
// =============================================================================

// System Statistics Entity
export const systemStatsEntitySchema = z.object({
  totalUsers: z.number(),
  totalEvents: z.number(),
  totalCalendars: z.number(),
  totalProcessingSessions: z.number(),
  activeUsers: z.number(), // users who created events in last 30 days
  eventsCreatedToday: z.number(),
  eventsCreatedThisWeek: z.number(),
  eventsCreatedThisMonth: z.number(),
  generatedAt: z.date(),
})

export type SystemStatsEntity = z.infer<typeof systemStatsEntitySchema>

// User Activity Statistics Entity
export const userActivityStatsEntitySchema = z.object({
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

export type UserActivityStatsEntity = z.infer<
  typeof userActivityStatsEntitySchema
>

// Calendar Usage Statistics Entity
export const calendarUsageStatsEntitySchema = z.object({
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

export type CalendarUsageStatsEntity = z.infer<
  typeof calendarUsageStatsEntitySchema
>

// Processing Performance Statistics Entity
export const processingPerformanceStatsEntitySchema = z.object({
  totalSessions: z.number(),
  successfulSessions: z.number(),
  failedSessions: z.number(),
  averageProcessingTime: z.number(), // in milliseconds
  averageConfidence: z.number(), // 0-1
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

export type ProcessingPerformanceStatsEntity = z.infer<
  typeof processingPerformanceStatsEntitySchema
>

// =============================================================================
// SPECIALIZED ANALYTICS SCHEMAS
// =============================================================================

// Dashboard Summary
export const dashboardSummarySchema = z.object({
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

export type DashboardSummary = z.infer<typeof dashboardSummarySchema>
