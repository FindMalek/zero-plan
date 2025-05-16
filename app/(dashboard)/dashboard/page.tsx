import { Metadata } from "next"
import { DashboardOverview } from "@/components/app/dashboard-overview"

export const metadata: Metadata = {
    title: "Dashboard",
}

export default function DashboardPage() {
    return (
        <div>
            <h1>Dashboard</h1>
        </div>
    )
}