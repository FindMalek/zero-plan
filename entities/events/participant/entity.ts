import {
  ParticipantEntityFullSelect,
  ParticipantEntitySelect,
  ParticipantEntitySimpleSelect,
} from "@/entities/events/participant"
import { EventParticipantRo } from "@/schemas/event"

export class ParticipantEntity {
  static toSimpleRo(data: ParticipantEntitySimpleSelect): EventParticipantRo {
    return {
      id: data.id,
      email: data.email,
      name: data.name || undefined,
      role: data.role,
      rsvpStatus: data.rsvpStatus,
      isOrganizer: data.isOrganizer,
      notes: data.notes || undefined,
      invitedAt: data.invitedAt,
      respondedAt: data.respondedAt || undefined,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
      eventId: data.eventId,
    }
  }

  static toRo(data: ParticipantEntitySelect): EventParticipantRo {
    return this.toSimpleRo(data)
  }

  static toFullRo(data: ParticipantEntityFullSelect): EventParticipantRo {
    return this.toSimpleRo(data)
  }
}
