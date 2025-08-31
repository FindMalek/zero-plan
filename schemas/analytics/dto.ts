import { z } from "zod"

// =============================================================================
// ANALYTICS DTOs (Data Transfer Objects - API Inputs)
// =============================================================================

// Get System Statistics DTO
export const getSystemStatsDto = z.object({
  dateFrom: z.string().datetime().optional(),
  dateTo: z.string().datetime().optional(),
})

export type GetSystemStatsDto = z.infer<typeof getSystemStatsDto>

// Get User Activity Statistics DTO
export const getUserActivityStatsDto = z.object({
  userId: z.string().uuid("Invalid user ID"),
  dateFrom: z.string().datetime().optional(),
  dateTo: z.string().datetime().optional(),
})

export type GetUserActivityStatsDto = z.infer<typeof getUserActivityStatsDto>

// Get Calendar Usage Statistics DTO
export const getCalendarUsageStatsDto = z.object({
  calendarId: z.string().uuid("Invalid calendar ID").optional(),
  userId: z.string().uuid("Invalid user ID").optional(),
  dateFrom: z.string().datetime().optional(),
  dateTo: z.string().datetime().optional(),
})

export type GetCalendarUsageStatsDto = z.infer<typeof getCalendarUsageStatsDto>

// Get Processing Performance Statistics DTO
export const getProcessingPerformanceStatsDto = z.object({
  userId: z.string().uuid("Invalid user ID").optional(),
  model: z.string().optional(),
  provider: z.string().optional(),
  dateFrom: z.string().datetime().optional(),
  dateTo: z.string().datetime().optional(),
})

export type GetProcessingPerformanceStatsDto = z.infer<
  typeof getProcessingPerformanceStatsDto
>

// Get Dashboard Summary DTO
export const getDashboardSummaryDto = z.object({
  userId: z.string().uuid("Invalid user ID").optional(), // If provided, user-specific dashboard
})

export type GetDashboardSummaryDto = z.infer<typeof getDashboardSummaryDto>

// Get Event Analytics DTO
export const getEventAnalyticsDto = z.object({
  userId: z.string().uuid("Invalid user ID").optional(),
  calendarId: z.string().uuid("Invalid calendar ID").optional(),
  groupBy: z.enum(["day", "week", "month", "year"]).default("month"),
  dateFrom: z.string().datetime().optional(),
  dateTo: z.string().datetime().optional(),
})

export type GetEventAnalyticsDto = z.infer<typeof getEventAnalyticsDto>

// Export Analytics Data DTO
export const exportAnalyticsDto = z.object({
  type: z.enum(["users", "events", "calendars", "processing", "system"]),
  format: z.enum(["json", "csv", "xlsx"]).default("json"),
  userId: z.string().uuid("Invalid user ID").optional(),
  dateFrom: z.string().datetime().optional(),
  dateTo: z.string().datetime().optional(),
})

export type ExportAnalyticsDto = z.infer<typeof exportAnalyticsDto>
