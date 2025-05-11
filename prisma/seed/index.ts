import { PrismaClient } from "@prisma/client"

import { seedUsers } from "./users"
import { seedPlatforms } from "./platforms"
import { seedContainers } from "./containers"
import { seedTags } from "./tags"
import { seedCredentials } from "./credentials"
import { seedCards } from "./cards"
import { seedSecrets } from "./secrets"

const prisma = new PrismaClient()

async function main() {
  console.log("🌱 Starting database seeding...")

  // Add all seeder functions here in the correct order
  await seedUsers(prisma)
  await seedPlatforms(prisma)
  await seedContainers(prisma)
  await seedTags(prisma)
  await seedCredentials(prisma)
  await seedCards(prisma)
  await seedSecrets(prisma)
  
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
