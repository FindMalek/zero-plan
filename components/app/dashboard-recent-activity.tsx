"use client"; // If using event handlers like onClick, it needs to be a client component

import { Plus, User, CreditCard, KeyRound } from "lucide-react";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RecentItem, formatDate } from "@/lib/utils"; // Import types and formatDate from utils

// Removed temporary type definitions for RecentItem as they are now implicitly typed by props from page.tsx
// The types (RecentItem, RecentItemBase, etc.) are defined in page.tsx and passed through props.

// Assuming RecentItem type will be inferred from the props passed by page.tsx
// If explicit typing is needed here and cannot be imported, this approach might need adjustment
// or a shared types file.

interface DashboardRecentActivityProps {
    recentItems: RecentItem[]; // Use imported RecentItem type
}

function getItemIcon(itemType: RecentItem["type"]) { // Use imported RecentItem type for itemType
    switch (itemType) {
        case "account":
            return <User className="h-4 w-4" />;
        case "card":
            return <CreditCard className="h-4 w-4" />;
        case "secret":
            return <KeyRound className="h-4 w-4" />;
        default:
            return null;
    }
}

function onAddItem(itemType: "account" | "card" | "secret") {
    console.log("Add item of type:", itemType);
    // e.g., router.push(`/dashboard/add-${itemType}`);
}

export function DashboardRecentActivity({ recentItems }: DashboardRecentActivityProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {recentItems.length > 0 ? (
                    <div className="space-y-4">
                        {recentItems.map((item: RecentItem) => ( // Use imported RecentItem type
                            <div
                                key={`${item.type}-${item.id}`}
                                className="flex items-center justify-between space-x-4"
                            >
                                <div className="flex items-center space-x-4">
                                    <div
                                        className={`flex h-8 w-8 items-center justify-center rounded-full ${item.type === "account"
                                                ? "bg-blue-500/10 text-blue-500"
                                                : item.type === "card"
                                                    ? "bg-green-500/10 text-green-500"
                                                    : "bg-purple-500/10 text-purple-500"
                                            }`}
                                    >
                                        {getItemIcon(item.type)}
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium leading-none">
                                            {item.name}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            {item.type === "account"
                                                ? item.username
                                                : item.type === "card"
                                                    ? `${item.cardType} •••• ${item.cardNumber.slice(-4)}`
                                                    : item.description}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center">
                                    <Badge variant="outline" className="text-xs">
                                        {item.type}
                                    </Badge>
                                    <span className="ml-2 text-xs text-muted-foreground">
                                        {item.activityType} on {formatDate(item.lastActivityAt)}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                        <div className="rounded-full bg-muted p-3">
                            <Plus className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <h3 className="mt-4 text-lg font-semibold">No items yet</h3>
                        <p className="mt-2 text-sm text-muted-foreground">
                            Add your first item to get started with VaultGuard
                        </p>
                        <Button
                            onClick={() => onAddItem("account")}
                            className="mt-4"
                        >
                            Add your first item
                        </Button>
                    </div>
                )}
            </CardContent>
            {recentItems.length > 0 && (
                <CardFooter>
                    <Button variant="outline" className="w-full">
                        View all activity
                    </Button>
                </CardFooter>
            )}
        </Card>
    );
} 