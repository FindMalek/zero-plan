import {
  UserEntityFullSelect,
  UserEntitySelect,
  UserEntitySimpleSelect,
} from "@/entities/user"
import { UserFullRo, UserRo, UserSimpleRo } from "@/schemas/user"

export class UserEntity {
  static toSimpleRo(data: UserEntitySimpleSelect): UserSimpleRo {
    return {
      id: data.id,
      email: data.email,
      name: data.name || undefined,
      image: data.image || undefined,
      emailVerified: data.emailVerified,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    }
  }

  static toRo(data: UserEntitySelect): UserRo {
    return this.toSimpleRo(data)
  }

  static toFullRo(data: UserEntityFullSelect): UserFullRo {
    return this.toSimpleRo(data)
  }
}
