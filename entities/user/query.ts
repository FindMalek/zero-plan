import { Prisma } from "@/prisma/client"

export type UserEntitySimpleSelect = Prisma.UserGetPayload<{
  select: ReturnType<typeof UserQuery.getSimpleSelect>
}>

export type UserEntitySelect = Prisma.UserGetPayload<{
  select: ReturnType<typeof UserQuery.getSelect>
}>

export type UserEntityFullSelect = Prisma.UserGetPayload<{
  select: ReturnType<typeof UserQuery.getFullSelect>
}>

export class UserQuery {
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

  static getSelect() {
    return this.getSimpleSelect()
  }

  static getFullSelect() {
    return this.getSimpleSelect()
  }
}
