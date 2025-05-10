import { PrismaClient } from "@prisma/client"

import { seedUsers } from "./users"

const prisma = new PrismaClient()

async function main() {
  console.log("🌱 Starting database seeding...")

  // Add all seeder functions here
  await seedUsers(prisma)
  console.log("✅ Database seeding completed")
}

main()
  .catch((e) => {
    console.error("❌ Database seeding failed")
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
