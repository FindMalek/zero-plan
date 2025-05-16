import { type Prisma } from "@prisma/client"

export type CredentialHistoryEntitySimpleDbData =
  Prisma.CredentialHistoryGetPayload<{
    include: ReturnType<typeof CredentialHistoryQuery.getSimpleInclude>
  }>

export class CredentialHistoryQuery {
  static getSimpleInclude() {
    return {} satisfies Prisma.CredentialHistoryInclude
  }
}
