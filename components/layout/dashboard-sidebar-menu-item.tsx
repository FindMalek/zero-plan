"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar"

interface DashboardSidebarMenuItemProps {
  href: string
  icon: React.ReactNode
  label: string
}

export function DashboardSidebarMenuItemComponent({
  href,
  icon,
  label,
}: DashboardSidebarMenuItemProps) {
  const pathname = usePathname()
  const pathIsActive = pathname.includes(href)

  return (
    <SidebarMenuItem>
      <Link href={href}>
        <SidebarMenuButton isActive={pathIsActive}>
          {icon}
          <span>{label}</span>
        </SidebarMenuButton>
      </Link>
    </SidebarMenuItem>
  )
}
