export type User = {
  id: string
  name: string
  email: string
  emailVerified: boolean
  createdAt: Date
  updatedAt: Date
  image?: string | null | undefined | undefined
}

export type ItemType = "account" | "card" | "secret"
export type ViewType = "overview" | "account" | "card" | "secret"
