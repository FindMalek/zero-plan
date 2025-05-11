import { database } from "@/database/client"

export const GET = async () => {
  const newPage = await database.health.create({})

  await database.health.delete({
    where: {
      id: newPage.id,
    },
  })

  return new Response("OK", { status: 200 })
}
