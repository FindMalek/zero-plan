import { Metadata } from "next"

import { OverviewStats } from "@/components/app/dashboard-overview-stats"
import { listCards } from "@/actions/card"
import { listSecrets } from "@/actions/secret"
import { listUsers } from "@/actions/user"
import { DashboardRecentActivity } from "@/components/app/dashboard-recent-activity"
import { RecentItem, mapItem } from "@/lib/utils"

async function getRecentItems(): Promise<RecentItem[]> {
  const [usersResponse, cardsResponse, secretsResponse] = await Promise.all([
    listUsers(1, 5),
    listCards(1, 5),
    listSecrets(1, 5),
  ]);

  const recentUsers: RecentItem[] = (usersResponse.users ?? []).map((user) => ({
    ...mapItem(user, "account"),
    type: "account" as const,
    username: user.email,
  }));

  const recentCards: RecentItem[] = (cardsResponse.cards ?? []).map((card) => ({
    ...mapItem(card, "card"),
    type: "card" as const,
    cardType: card.type,
    cardNumber: card.number,
  }));

  const recentSecrets: RecentItem[] = (secretsResponse.secrets ?? []).map(
    (secret) => ({
      ...mapItem(secret, "secret"),
      type: "secret" as const,
      description: secret.value,
    })
  );

  const allItems = [...recentUsers, ...recentCards, ...recentSecrets];
  allItems.sort((a, b) => new Date(b.lastActivityAt).getTime() - new Date(a.lastActivityAt).getTime());

  return allItems.slice(0, 5);
}

export const metadata: Metadata = {
  title: "Dashboard Overview",
}

async function getStats() {
  const [usersData, cardsData, secretsData] = await Promise.all([
    listUsers(1, 1),
    listCards(1, 1),
    listSecrets(1, 1),
  ])

  return {
    accounts: usersData.users?.length ?? 0,
    cards: cardsData.cards?.length ?? 0,
    secrets: secretsData.secrets?.length ?? 0,
  }
}

export default async function DashboardPage() {
  const stats = await getStats()
  const recentItems = await getRecentItems()

  return (
    <div className="space-y-6">
      <OverviewStats stats={stats} />
      <DashboardRecentActivity recentItems={recentItems} />
    </div>
  )
}


