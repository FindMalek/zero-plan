import {
  SystemStatsFullRo,
  SystemStatsRo,
  SystemStatsSimpleRo,
} from "@/schemas/analytics"

/**
 * Analytics Entity - Pure data transformation for Analytics operations
 */
export class AnalyticsEntity {
  /**
   * Convert to SystemStatsSimpleRo
   */
  static toSimpleRo(data: any): SystemStatsSimpleRo {
    return {
      totalUsers: data.totalUsers,
      totalEvents: data.totalEvents,
      totalCalendars: data.totalCalendars,
      totalProcessingSessions: data.totalProcessingSessions,
      generatedAt: data.generatedAt || new Date(),
    }
  }

  /**
   * Convert to SystemStatsRo
   */
  static toRo(data: any): SystemStatsRo {
    return {
      totalUsers: data.totalUsers,
      totalEvents: data.totalEvents,
      totalCalendars: data.totalCalendars,
      totalProcessingSessions: data.totalProcessingSessions,
      activeUsers: data.activeUsers,
      eventsCreatedToday: data.eventsCreatedToday,
      eventsCreatedThisWeek: data.eventsCreatedThisWeek,
      eventsCreatedThisMonth: data.eventsCreatedThisMonth,
      generatedAt: data.generatedAt || new Date(),
    }
  }

  /**
   * Convert to SystemStatsFullRo
   */
  static toFullRo(data: any): SystemStatsFullRo {
    return {
      ...this.toRo(data),
      topModels: data.topModels,
      topCalendars: data.topCalendars,
    }
  }
}
