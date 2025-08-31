import { Prisma } from "@/prisma/client"

import { UserQuery } from "../user"

export type CalendarEntitySimpleSelect = Prisma.CalendarGetPayload<{
  select: ReturnType<typeof CalendarQuery.getSimpleSelect>
}>

export type CalendarEntitySelect = Prisma.CalendarGetPayload<{
  select: ReturnType<typeof CalendarQuery.getSelect>
}>

export type CalendarEntityFullSelect = Prisma.CalendarGetPayload<{
  select: ReturnType<typeof CalendarQuery.getFullSelect>
}>

export class CalendarQuery {
  static getSimpleSelect() {
    return {
      id: true,
      name: true,
      description: true,
      color: true,
      emoji: true,
    } satisfies Prisma.CalendarSelect
  }

  static getSelect() {
    return {
      ...this.getSimpleSelect(),
      isDefault: true,
      isActive: true,
      createdAt: true,
      updatedAt: true,
      userId: true,
    } satisfies Prisma.CalendarSelect
  }

  static getFullSelect() {
    return {
      ...this.getSelect(),
      user: {
        select: UserQuery.getSimpleSelect(),
      },
    } satisfies Prisma.CalendarSelect
  }
}
