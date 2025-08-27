import type { Icon } from "lucide-react"

export type NavItem = {
  title: string
  href: string
  disabled?: boolean
}

export type MainNavItem = NavItem

export type SidebarNavItem = {
  title: string
  href: string
  disabled?: boolean
  external?: boolean
  icon?: string
}

export type SiteConfig = {
  name: string
  description: string
  url: string
  links: {
    twitter?: string
    github: string
    discord?: string
  }
  images: {
    default: string
    notFound: string
    logo: string
  }
  author: {
    name: string
    url: string
    email: string
    github?: string
  }
  keywords: string[]
}

export interface KeyValuePair {
  key: string
  value: string
}
