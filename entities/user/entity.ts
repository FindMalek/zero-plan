import { UserFullRo, UserRo, UserSimpleRo } from "@/schemas/user"

/**
 * User Entity - Pure data transformation for User operations
 */
export class UserEntity {
  /**
   * Convert database result to UserSimpleRo
   */
  static toSimpleRo(data: any): UserSimpleRo {
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

  /**
   * Convert database result to UserRo
   */
  static toRo(data: any): UserRo {
    return this.toSimpleRo(data)
  }

  /**
   * Convert database result to UserFullRo
   */
  static toFullRo(data: any): UserFullRo {
    return this.toSimpleRo(data)
  }
}
