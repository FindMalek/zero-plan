import {
  ConferenceEntityFullSelect,
  ConferenceEntitySelect,
  ConferenceEntitySimpleSelect,
} from "@/entities/events/conference"
import { EventConferenceRo } from "@/schemas/event"

export class ConferenceEntity {
  static toSimpleRo(data: ConferenceEntitySimpleSelect): EventConferenceRo {
    return {
      id: data.id,
      meetingRoom: data.meetingRoom || undefined,
      conferenceLink: data.conferenceLink || undefined,
      conferenceId: data.conferenceId || undefined,
      dialInNumber: data.dialInNumber || undefined,
      accessCode: data.accessCode || undefined,
      hostKey: data.hostKey || undefined,
      isRecorded: data.isRecorded,
      maxDuration: data.maxDuration || undefined,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
      eventId: data.eventId,
    }
  }

  static toRo(data: ConferenceEntitySelect): EventConferenceRo {
    return this.toSimpleRo(data)
  }

  static toFullRo(data: ConferenceEntityFullSelect): EventConferenceRo {
    return this.toSimpleRo(data)
  }
}
