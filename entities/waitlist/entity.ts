import {
  WaitlistEntryFullRo,
  WaitlistEntryRo,
  WaitlistEntrySimpleRo,
} from "@/schemas/waitlist"

/**
 * Waitlist Entity - Pure data transformation for WaitlistEntry operations
 */
export class WaitlistEntity {
  /**
   * Convert database result to WaitlistEntrySimpleRo
   */
  static toSimpleRo(data: any): WaitlistEntrySimpleRo {
    return {
      id: data.id,
      email: data.email,
      isNotified: data.isNotified || false,
      position: data.position || 0,
      invitedAt: data.invitedAt || undefined,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt || data.createdAt,
    }
  }

  /**
   * Convert database result to WaitlistEntryRo
   */
  static toRo(data: any): WaitlistEntryRo {
    return this.toSimpleRo(data)
  }

  /**
   * Convert database result to WaitlistEntryFullRo
   */
  static toFullRo(data: any): WaitlistEntryFullRo {
    return this.toSimpleRo(data)
  }
}
