/**
 * Analytics Query - Analytics doesn't use direct database queries but aggregated data
 * This file exists for consistency with the entities structure
 */
export class AnalyticsQuery {
  /**
   * Analytics uses aggregated data, not direct selects
   * These methods exist for consistency but return empty objects
   */
  static getSimpleSelect() {
    return {}
  }

  static getStandardSelect() {
    return {}
  }

  static getFullSelect() {
    return {}
  }
}

// Analytics doesn't have direct database select types
// Data is computed from aggregations across multiple tables
export type AnalyticsEntitySimpleSelect = Record<string, never>
export type AnalyticsEntityStandardSelect = Record<string, never>
export type AnalyticsEntityFullSelect = Record<string, never>
