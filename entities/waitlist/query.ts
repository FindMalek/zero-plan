import { Prisma } from "@/prisma/client"

export type WaitlistEntitySimpleSelect = Prisma.WaitlistGetPayload<{
  select: ReturnType<typeof WaitlistQuery.getSimpleSelect>
}>

export type WaitlistEntitySelect = Prisma.WaitlistGetPayload<{
  select: ReturnType<typeof WaitlistQuery.getSelect>
}>

export type WaitlistEntityFullSelect = Prisma.WaitlistGetPayload<{
  select: ReturnType<typeof WaitlistQuery.getFullSelect>
}>

export class WaitlistQuery {
  static getSimpleSelect() {
    return {
      id: true,
      email: true,
      createdAt: true,
    } satisfies Prisma.WaitlistSelect
  }

  static getSelect() {
    return this.getSimpleSelect()
  }

  static getFullSelect() {
    return this.getSimpleSelect()
  }
}
