import { Prisma } from "@/prisma/client"

/**
 * User Query Selectors - Prisma select objects for User operations
 */
export class UserQuery {
  /**
   * Simple select - basic user fields
   */
  static getSimpleSelect() {
    return {
      id: true,
      email: true,
      name: true,
      image: true,
      emailVerified: true,
      createdAt: true,
      updatedAt: true,
    } satisfies Prisma.UserSelect
  }

  /**
   * Standard select - same as simple for user
   */
  static getStandardSelect() {
    return this.getSimpleSelect()
  }

  /**
   * Full select - same as simple for user
   */
  static getFullSelect() {
    return this.getSimpleSelect()
  }

  /**
   * Public select - safe fields for public display
   */
  static getPublicSelect() {
    return {
      id: true,
      name: true,
      image: true,
    } satisfies Prisma.UserSelect
  }
}

// Type definitions for the select results
export type UserEntitySimpleSelect = Prisma.UserGetPayload<{
  select: ReturnType<typeof UserQuery.getSimpleSelect>
}>

export type UserEntityStandardSelect = Prisma.UserGetPayload<{
  select: ReturnType<typeof UserQuery.getStandardSelect>
}>

export type UserEntityFullSelect = Prisma.UserGetPayload<{
  select: ReturnType<typeof UserQuery.getFullSelect>
}>

export type UserEntityPublicSelect = Prisma.UserGetPayload<{
  select: ReturnType<typeof UserQuery.getPublicSelect>
}>
