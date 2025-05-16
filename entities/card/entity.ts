import { CardSimpleRo } from "@/schemas/card"

import { CardEntitySimpleDbData } from "./query"

export class CardEntity {
  static getSimpleRo(entity: CardEntitySimpleDbData): CardSimpleRo {
    return {
      id: entity.id,

      name: entity.name,

      type: entity.type,
      status: entity.status,
      provider: entity.provider,

      description: entity.description,
      cardholderName: entity.cardholderName,

      // TODO: Consider masking or partial display for ROs if sensitive
      number: entity.number,
      expiryDate: entity.expiryDate,

      // TODO: Consider masking or partial display for ROs if sensitive
      cvv: entity.cvv,
      billingAddress: entity.billingAddress,
      cardholderEmail: entity.cardholderEmail,

      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,

      userId: entity.userId,
      containerId: entity.containerId,
    }
  }
}
