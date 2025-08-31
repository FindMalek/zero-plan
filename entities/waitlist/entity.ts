import {
  WaitlistEntityFullSelect,
  WaitlistEntitySelect,
  WaitlistEntitySimpleSelect,
} from "@/entities/waitlist"
import {
  WaitlistEntryFullRo,
  WaitlistEntryRo,
  WaitlistEntrySimpleRo,
} from "@/schemas/waitlist"

export class WaitlistEntity {
  static toSimpleRo(data: WaitlistEntitySimpleSelect): WaitlistEntrySimpleRo {
    return {
      id: data.id,
      email: data.email,
      createdAt: data.createdAt,
    }
  }

  static toRo(data: WaitlistEntitySelect): WaitlistEntryRo {
    return this.toSimpleRo(data)
  }

  static toFullRo(data: WaitlistEntityFullSelect): WaitlistEntryFullRo {
    return this.toSimpleRo(data)
  }
}
