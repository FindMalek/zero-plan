// import "server-only"

import { neonConfig, Pool } from "@neondatabase/serverless"
import { PrismaNeon } from "@prisma/adapter-neon"
import { PrismaClient } from "@prisma/client"
import ws from "ws"

import { env } from "@/env"

const globalForPrisma = global as unknown as { prisma: PrismaClient }

let database: PrismaClient

if (env.NODE_ENV === "production") {
  // Production: Use Neon serverless adapter
  neonConfig.webSocketConstructor = ws
  neonConfig.poolQueryViaFetch = true
  const pool = new Pool({ connectionString: env.DATABASE_URL })
  const adapter = new PrismaNeon(pool)

  database = globalForPrisma.prisma || new PrismaClient({ adapter })
} else {
  // Development: Use standard Prisma client
  database = globalForPrisma.prisma || new PrismaClient()
}

if (env.NODE_ENV !== "production") {
  globalForPrisma.prisma = database
}

export { database }
export * from "@prisma/client"
