import { ContainerSimpleRo } from "@/schemas/container"

import { ContainerEntitySimpleDbData } from "./query"

export class ContainerEntity {
  static getSimpleRo(entity: ContainerEntitySimpleDbData): ContainerSimpleRo {
    return {
      id: entity.id,

      name: entity.name,
      icon: entity.icon,

      description: entity.description,

      updatedAt: entity.updatedAt,
      createdAt: entity.createdAt,

      userId: entity.userId,
    }
  }
}
