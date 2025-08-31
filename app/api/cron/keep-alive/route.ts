import { database } from "@/prisma/client"

export const GET = async () => {
  // Simple health check - just query the database
  await database.$queryRaw`SELECT 1 as health_check`

  return new Response("OK", { status: 200 })
}
