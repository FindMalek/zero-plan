import { Prisma } from "@/prisma/client"

export type ParticipantEntitySimpleSelect = Prisma.EventParticipantGetPayload<{
  select: ReturnType<typeof ParticipantQuery.getSimpleSelect>
}>

export type ParticipantEntitySelect = Prisma.EventParticipantGetPayload<{
  select: ReturnType<typeof ParticipantQuery.getSelect>
}>

export type ParticipantEntityFullSelect = Prisma.EventParticipantGetPayload<{
  select: ReturnType<typeof ParticipantQuery.getFullSelect>
}>

export class ParticipantQuery {
  static getSimpleSelect() {
    return {
      id: true,
      email: true,
      name: true,
      role: true,
      rsvpStatus: true,
      isOrganizer: true,
      notes: true,
      invitedAt: true,
      respondedAt: true,
      createdAt: true,
      updatedAt: true,
      eventId: true,
    } satisfies Prisma.EventParticipantSelect
  }

  static getSelect() {
    return this.getSimpleSelect()
  }

  static getFullSelect() {
    return this.getSimpleSelect()
  }
}
