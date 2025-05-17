import { type Prisma } from "@prisma/client"

export type CardEntitySimpleDbData = Prisma.CardGetPayload<{
  include: ReturnType<typeof CardQuery.getSimpleInclude>
}>

export class CardQuery {
  static getSimpleInclude() {
    return {} satisfies Prisma.CardInclude
  }
}
