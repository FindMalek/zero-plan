import { SecretSimpleRo } from "@/schemas/secret"

import { SecretEntitySimpleDbData } from "./query"

export class SecretEntity {
  static getSimpleRo(entity: SecretEntitySimpleDbData): SecretSimpleRo {
    return {
      id: entity.id,

      name: entity.name,

      // TODO: Consider masking or partial display for ROs if sensitive
      value: entity.value,

      type: entity.type,
      status: entity.status,

      description: entity.description,

      expiresAt: entity.expiresAt,
      updatedAt: entity.updatedAt,
      createdAt: entity.createdAt,

      userId: entity.userId,
      platformId: entity.platformId,

      containerId: entity.containerId,
    }
  }
}
