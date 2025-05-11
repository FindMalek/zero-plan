import {
    AlertCircle,
    ArrowRight,
    Calendar,
    CreditCard,
    Key,
    Plus,
    Shield,
    ShieldAlert,
    ShieldCheck,
    User,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { ItemType, ViewType } from "@/types"

import { UserRo, CardRo, SecretRo } from "@/config/schema"

interface DashboardOverviewProps {
    accounts: UserRo[],
    cards: CardRo[],
    secrets: SecretRo[],
    onAddItem: (type: ItemType) => void
    onViewAll: (type: ViewType) => void
}

export function DashboardOverview({ accounts, cards, secrets, onAddItem, onViewAll }: DashboardOverviewProps) {
    const calculateSecurityScore = () => {
        let score = 80 // Base score

        // Deduct points for weak passwords
        const weakPasswords = accounts.filter(
            (account) => !account.password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/),
        ).length

        score -= weakPasswords * 5

        // Deduct points for expiring cards
        const currentYear = new Date().getFullYear() % 100
        const currentMonth = new Date().getMonth() + 1

        const expiringCards = cards.filter((card) => {
            const cardYear = Number.parseInt(card.expiryYear)
            const cardMonth = Number.parseInt(card.expiryMonth)

            // Card expires within 3 months
            return (
                (cardYear === currentYear && cardMonth - currentMonth <= 3 && cardMonth - currentMonth >= 0) ||
                (cardYear === currentYear + 1 && cardMonth + 12 - currentMonth <= 3)
            )
        }).length

        score -= expiringCards * 3

        // Ensure score is between 0-100
        return Math.max(0, Math.min(100, score))
    }

    const securityScore = calculateSecurityScore()

    // Get security status based on score
    const getSecurityStatus = () => {
        if (securityScore >= 80) return { label: "Excellent", color: "text-green-500", icon: ShieldCheck }
        if (securityScore >= 60) return { label: "Good", color: "text-yellow-500", icon: Shield }
        return { label: "Needs Attention", color: "text-red-500", icon: ShieldAlert }
    }

    const securityStatus = getSecurityStatus()

    // Get recently added items (combined and sorted)
    const getRecentItems = () => {
        const allItems = [
            ...accounts.map((item) => ({ ...item, type: "account" })),
            ...cards.map((item) => ({ ...item, type: "card" })),
            ...secrets.map((item) => ({ ...item, type: "secret" })),
        ]

        return allItems.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5)
    }

    const recentItems = getRecentItems()

    // Get expiring cards
    const getExpiringCards = () => {
        const currentYear = new Date().getFullYear() % 100
        const currentMonth = new Date().getMonth() + 1

        return cards
            .filter((card) => {
                const cardYear = Number.parseInt(card.expiryYear)
                const cardMonth = Number.parseInt(card.expiryMonth)

                // Card expires within 6 months
                return (
                    (cardYear === currentYear && cardMonth - currentMonth <= 6 && cardMonth - currentMonth >= 0) ||
                    (cardYear === currentYear + 1 && cardMonth + 12 - currentMonth <= 6)
                )
            })
            .sort((a, b) => {
                const aExpiry = Number.parseInt(a.expiryYear) * 12 + Number.parseInt(a.expiryMonth)
                const bExpiry = Number.parseInt(b.expiryYear) * 12 + Number.parseInt(b.expiryMonth)
                return aExpiry - bExpiry
            })
    }

    const expiringCards = getExpiringCards()

    // Get weak passwords
    const getWeakPasswords = () => {
        return accounts.filter(
            (account) => !account.password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/),
        )
    }

    const weakPasswords = getWeakPasswords()

    // Format date
    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        return new Intl.DateTimeFormat("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        }).format(date)
    }

    // Get item icon
    const getItemIcon = (type: string) => {
        switch (type) {
            case "account":
                return <User className="h-4 w-4" />
            case "card":
                return <CreditCard className="h-4 w-4" />
            case "secret":
                return <Key className="h-4 w-4" />
            default:
                return <User className="h-4 w-4" />
        }
    }

    return (
        <div className="space-y-6">
            {/* Stats Overview */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Accounts</CardTitle>
                        <User className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{accounts.length}</div>
                        <p className="text-xs text-muted-foreground">
                            {accounts.length > 0
                                ? `${accounts.filter((a) => a.tags.includes("personal")).length} personal, ${accounts.filter((a) => a.tags.includes("work")).length} work`
                                : "No accounts yet"}
                        </p>
                    </CardContent>
                    <CardFooter className="p-2">
                        <Button
                            variant="ghost"
                            size="sm"
                            className="w-full justify-between text-xs"
                            onClick={() => onViewAll("account")}
                        >
                            <span>View all accounts</span>
                            <ArrowRight className="h-3 w-3" />
                        </Button>
                    </CardFooter>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Payment Cards</CardTitle>
                        <CreditCard className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{cards.length}</div>
                        <p className="text-xs text-muted-foreground">
                            {cards.length > 0 ? `${expiringCards.length} expiring soon` : "No cards yet"}
                        </p>
                    </CardContent>
                    <CardFooter className="p-2">
                        <Button
                            variant="ghost"
                            size="sm"
                            className="w-full justify-between text-xs"
                            onClick={() => onViewAll("card")}
                        >
                            <span>View all cards</span>
                            <ArrowRight className="h-3 w-3" />
                        </Button>
                    </CardFooter>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Secure Notes</CardTitle>
                        <Key className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{secrets.length}</div>
                        <p className="text-xs text-muted-foreground">
                            {secrets.length > 0
                                ? `${secrets.filter((s) => s.tags.includes("api")).length} API keys, ${secrets.filter((s) => s.tags.includes("recovery")).length} recovery codes`
                                : "No secure notes yet"}
                        </p>
                    </CardContent>
                    <CardFooter className="p-2">
                        <Button
                            variant="ghost"
                            size="sm"
                            className="w-full justify-between text-xs"
                            onClick={() => onViewAll("secret")}
                        >
                            <span>View all notes</span>
                            <ArrowRight className="h-3 w-3" />
                        </Button>
                    </CardFooter>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Security Score</CardTitle>
                        <securityStatus.icon className={`h-4 w-4 ${securityStatus.color}`} />
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center space-x-2">
                            <div className="text-2xl font-bold">{securityScore}%</div>
                            <Badge variant={securityScore >= 80 ? "default" : securityScore >= 60 ? "outline" : "destructive"}>
                                {securityStatus.label}
                            </Badge>
                        </div>
                        <Progress value={securityScore} className="mt-2" />
                        <p className="mt-2 text-xs text-muted-foreground">
                            {weakPasswords.length > 0 ? `${weakPasswords.length} weak passwords` : "All passwords are strong"}
                        </p>
                    </CardContent>
                    <CardFooter className="p-2">
                        <Button
                            variant="ghost"
                            size="sm"
                            className="w-full justify-between text-xs"
                        >
                            <span>View security issues</span>
                            <ArrowRight className="h-3 w-3" />
                        </Button>
                    </CardFooter>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                {/* Recent Activity */}
                <Card className="lg:col-span-4">
                    <CardHeader>
                        <CardTitle>Recent Activity</CardTitle>
                        <CardDescription>Your recently added items</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {recentItems.length > 0 ? (
                            <div className="space-y-4">
                                {recentItems.map((item) => (
                                    <div key={`${item.type}-${item.id}`} className="flex items-center justify-between space-x-4">
                                        <div className="flex items-center space-x-4">
                                            <div
                                                className={`flex h-8 w-8 items-center justify-center rounded-full 
                        ${item.type === "account"
                                                        ? "bg-blue-500/10 text-blue-500"
                                                        : item.type === "card"
                                                            ? "bg-green-500/10 text-green-500"
                                                            : "bg-purple-500/10 text-purple-500"
                                                    }`}
                                            >
                                                {getItemIcon(item.type)}
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium leading-none">{item.name}</p>
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
                                            <span className="ml-2 text-xs text-muted-foreground">{formatDate(item.createdAt)}</span>
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
                                <p className="mt-2 text-sm text-muted-foreground">Add your first item to get started with VaultGuard</p>
                                <Button onClick={() => onAddItem("account")} className="mt-4">
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

                {/* Security Overview */}
                <Card className="lg:col-span-3">
                    <CardHeader>
                        <CardTitle>Security Overview</CardTitle>
                        <CardDescription>Monitor your vault security</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Tabs >
                            <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="overview">Overview</TabsTrigger>
                                <TabsTrigger value="issues">Issues</TabsTrigger>
                            </TabsList>
                            <TabsContent value="overview" className="space-y-4 pt-4">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium leading-none">Password Strength</p>
                                        <p className="text-xs text-muted-foreground">
                                            {accounts.length > 0
                                                ? `${accounts.length - weakPasswords.length} of ${accounts.length} passwords are strong`
                                                : "No accounts yet"}
                                        </p>
                                    </div>
                                    <div
                                        className={`rounded-full p-1 ${weakPasswords.length > 0 ? "bg-yellow-500/10 text-yellow-500" : "bg-green-500/10 text-green-500"}`}
                                    >
                                        {weakPasswords.length > 0 ? (
                                            <AlertCircle className="h-4 w-4" />
                                        ) : (
                                            <ShieldCheck className="h-4 w-4" />
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium leading-none">Expiring Cards</p>
                                        <p className="text-xs text-muted-foreground">
                                            {expiringCards.length > 0
                                                ? `${expiringCards.length} cards expiring soon`
                                                : "No cards expiring soon"}
                                        </p>
                                    </div>
                                    <div
                                        className={`rounded-full p-1 ${expiringCards.length > 0 ? "bg-yellow-500/10 text-yellow-500" : "bg-green-500/10 text-green-500"}`}
                                    >
                                        {expiringCards.length > 0 ? <Calendar className="h-4 w-4" /> : <ShieldCheck className="h-4 w-4" />}
                                    </div>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium leading-none">Duplicate Passwords</p>
                                        <p className="text-xs text-muted-foreground">No duplicate passwords found</p>
                                    </div>
                                    <div className="rounded-full bg-green-500/10 p-1 text-green-500">
                                        <ShieldCheck className="h-4 w-4" />
                                    </div>
                                </div>

                                <div className="mt-6">
                                    <Button variant="outline" className="w-full">
                                        View all security issues
                                    </Button>
                                </div>
                            </TabsContent>

                            <TabsContent value="issues" className="space-y-4 pt-4">
                                {weakPasswords.length > 0 && (
                                    <div>
                                        <h4 className="mb-2 text-sm font-medium">Weak Passwords</h4>
                                        <div className="space-y-2">
                                            {weakPasswords.slice(0, 3).map((account) => (
                                                <div key={account.id} className="flex items-center justify-between rounded-md border p-2">
                                                    <div className="flex items-center space-x-2">
                                                        <AlertCircle className="h-4 w-4 text-yellow-500" />
                                                        <span className="text-sm">{account.name}</span>
                                                    </div>
                                                    <Button size="sm" variant="outline">
                                                        Fix
                                                    </Button>
                                                </div>
                                            ))}
                                            {weakPasswords.length > 3 && (
                                                <Button variant="ghost" size="sm" className="w-full text-xs">
                                                    View {weakPasswords.length - 3} more
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {expiringCards.length > 0 && (
                                    <div>
                                        <h4 className="mb-2 text-sm font-medium">Expiring Cards</h4>
                                        <div className="space-y-2">
                                            {expiringCards.slice(0, 3).map((card) => (
                                                <div key={card.id} className="flex items-center justify-between rounded-md border p-2">
                                                    <div className="flex items-center space-x-2">
                                                        <Calendar className="h-4 w-4 text-yellow-500" />
                                                        <div>
                                                            <span className="text-sm">{card.name}</span>
                                                            <p className="text-xs text-muted-foreground">
                                                                Expires {card.expiryMonth}/{card.expiryYear}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <Button size="sm" variant="outline">
                                                        Update
                                                    </Button>
                                                </div>
                                            ))}
                                            {expiringCards.length > 3 && (
                                                <Button variant="ghost" size="sm" className="w-full text-xs">
                                                    View {expiringCards.length - 3} more
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {weakPasswords.length === 0 && expiringCards.length === 0 && (
                                    <div className="flex flex-col items-center justify-center py-8 text-center">
                                        <div className="rounded-full bg-green-500/10 p-3">
                                            <ShieldCheck className="h-6 w-6 text-green-500" />
                                        </div>
                                        <h3 className="mt-4 text-lg font-semibold">All Good!</h3>
                                        <p className="mt-2 text-sm text-muted-foreground">No security issues found in your vault</p>
                                    </div>
                                )}
                            </TabsContent>
                        </Tabs>
                    </CardContent>
                </Card>
            </div>

            {/* Quick Actions */}
            <Card>
                <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                    <CardDescription>Common tasks and shortcuts</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-2 md:grid-cols-3">
                        <Button variant="outline" className="justify-start" onClick={() => onAddItem("account")}>
                            <User className="mr-2 h-4 w-4" />
                            Add New Account
                        </Button>
                        <Button variant="outline" className="justify-start" onClick={() => onAddItem("card")}>
                            <CreditCard className="mr-2 h-4 w-4" />
                            Add New Card
                        </Button>
                        <Button variant="outline" className="justify-start" onClick={() => onAddItem("secret")}>
                            <Key className="mr-2 h-4 w-4" />
                            Add New Secure Note
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
