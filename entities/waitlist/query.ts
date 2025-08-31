import { Prisma } from "@/prisma/client"

/**
 * Waitlist Query Selectors - Prisma select objects for WaitlistEntry operations
 */
export class WaitlistQuery {
  /**
   * Simple select - basic waitlist entry fields
   */
  static getSimpleSelect() {
    return {
      id: true,
      email: true,
      createdAt: true,
    } satisfies Prisma.WaitlistSelect
  }

  /**
   * Standard select - same as simple for waitlist entry
   */
  static getStandardSelect() {
    return this.getSimpleSelect()
  }

  /**
   * Full select - same as simple for waitlist entry
   */
  static getFullSelect() {
    return this.getSimpleSelect()
  }
}

// Type definitions for the select results
export type WaitlistEntitySimpleSelect = Prisma.WaitlistGetPayload<{
  select: ReturnType<typeof WaitlistQuery.getSimpleSelect>
}>

export type WaitlistEntityStandardSelect = Prisma.WaitlistGetPayload<{
  select: ReturnType<typeof WaitlistQuery.getStandardSelect>
}>

export type WaitlistEntityFullSelect = Prisma.WaitlistGetPayload<{
  select: ReturnType<typeof WaitlistQuery.getFullSelect>
}>
