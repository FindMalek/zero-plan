import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

import { User as UserType } from "@/types/dashboard"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date | string) {
  if (typeof date === "string") {
    date = new Date(date);
  }
  
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  })
}

export function getAvatarOrFallback(user: UserType) {
  if (!user.image) {
    return `https://avatar.vercel.sh/${user.name}`
  }

  return user.image
}

export function capitalizeFirstLetter(string: string): string {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

// Recent Item Type Definitions
export interface RecentItemBase {
  id: string;
  createdAt: string;
  updatedAt: string;
  lastCopiedAt?: string; // Optional: timestamp for when the item was last copied
  lastActivityAt: string;
  name: string;
  activityType: "Created" | "Updated" | "Copied"; // Nature of the last activity
}

export interface RecentAccountItem extends RecentItemBase {
  type: "account";
  username: string;
}

export interface RecentCardItem extends RecentItemBase {
  type: "card";
  cardType: string;
  cardNumber: string;
}

export interface RecentSecretItem extends RecentItemBase {
  type: "secret";
  description: string;
}

export type RecentItem = RecentAccountItem | RecentCardItem | RecentSecretItem;

// mapItem Helper Function
export const mapItem = (item: any, type: RecentItem['type']): RecentItemBase => {
  const createdAtDate = new Date(item.createdAt);
  const updatedAtDate = new Date(item.updatedAt);
  const lastCopiedAtDate = item.lastCopiedAt ? new Date(item.lastCopiedAt) : null;

  const potentialActivities: { date: Date; type: RecentItemBase["activityType"] }[] = [
    { date: createdAtDate, type: "Created" },
    { date: updatedAtDate, type: "Updated" },
  ];

  if (lastCopiedAtDate) {
    potentialActivities.push({ date: lastCopiedAtDate, type: "Copied" });
  }

  // Sort by date descending (most recent first)
  // If dates are equal, prioritize: Copied > Updated > Created
  potentialActivities.sort((a, b) => {
    if (b.date.getTime() !== a.date.getTime()) {
      return b.date.getTime() - a.date.getTime();
    }
    // Dates are equal, apply priority
    const priority = { Copied: 3, Updated: 2, Created: 1 };
    return priority[b.type] - priority[a.type];
  });

  const lastActivity = potentialActivities[0];

  return {
    id: item.id,
    createdAt: createdAtDate.toISOString(),
    updatedAt: updatedAtDate.toISOString(),
    lastCopiedAt: lastCopiedAtDate?.toISOString(),
    lastActivityAt: lastActivity.date.toISOString(),
    name: item.name ?? `${capitalizeFirstLetter(type)} ${item.id.substring(0, 4)}`,
    activityType: lastActivity.type,
  };
};
