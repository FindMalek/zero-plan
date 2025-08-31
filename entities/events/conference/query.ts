import { Prisma } from "@/prisma/client"

export type ConferenceEntitySimpleSelect = Prisma.EventConferenceGetPayload<{
  select: ReturnType<typeof ConferenceQuery.getSimpleSelect>
}>

export type ConferenceEntitySelect = Prisma.EventConferenceGetPayload<{
  select: ReturnType<typeof ConferenceQuery.getSelect>
}>

export type ConferenceEntityFullSelect = Prisma.EventConferenceGetPayload<{
  select: ReturnType<typeof ConferenceQuery.getFullSelect>
}>

export class ConferenceQuery {
  static getSimpleSelect() {
    return {
      id: true,
      meetingRoom: true,
      conferenceLink: true,
      conferenceId: true,
      dialInNumber: true,
      accessCode: true,
      hostKey: true,
      isRecorded: true,
      maxDuration: true,
      createdAt: true,
      updatedAt: true,
      eventId: true,
    } satisfies Prisma.EventConferenceSelect
  }

  static getSelect() {
    return this.getSimpleSelect()
  }

  static getFullSelect() {
    return this.getSimpleSelect()
  }
}
