import {
  CardProvider,
  CardStatus,
  CardType,
  PrismaClient,
} from "@prisma/client"

async function seedCards(prisma: PrismaClient) {
  console.log("🌱 Seeding cards...")

  const users = await prisma.user.findMany()
  const containers = await prisma.container.findMany()
  const cardsData = []

  for (const user of users) {
    // Find the finance container for each user
    const financeContainer = containers.find(
      (c) => c.userId === user.id && c.name === "Finance"
    )

    if (financeContainer) {
      // Visa credit card
      cardsData.push({
        id: `card_visa_${user.id}`,
        name: "Primary Visa Card",
        description: "Personal Visa credit card",
        type: CardType.CREDIT,
        provider: CardProvider.VISA,
        status: CardStatus.ACTIVE,
        number: "4111111111111111",
        expiryDate: new Date("2025-12-31"),
        cvv: "123",
        billingAddress: "123 Main St, Anytown, USA",
        cardholderName: user.name,
        cardholderEmail: user.email,
        createdAt: new Date(),
        updatedAt: new Date(),
        userId: user.id,
        containerId: financeContainer.id,
      })

      // Mastercard
      cardsData.push({
        id: `card_mc_${user.id}`,
        name: "Mastercard",
        description: "Secondary Mastercard",
        type: CardType.CREDIT,
        provider: CardProvider.MASTERCARD,
        status: CardStatus.ACTIVE,
        number: "5555555555554444",
        expiryDate: new Date("2024-10-31"),
        cvv: "321",
        billingAddress: "123 Main St, Anytown, USA",
        cardholderName: user.name,
        cardholderEmail: user.email,
        createdAt: new Date(),
        updatedAt: new Date(),
        userId: user.id,
        containerId: financeContainer.id,
      })
    }
  }

  await prisma.card.createMany({
    data: cardsData,
  })

  console.log("✅ Cards seeded successfully")
}

export { seedCards }
