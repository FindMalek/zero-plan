import { SiteConfig } from "@/types"

export const siteConfig: SiteConfig = {
  name: "FindAccount",
  description: "Secure password management made simple.",
  url: "https://account.findmalek.com",
  images: {
    default: "https://account.findmalek.com/og.png",
    notFound: "https://account.findmalek.com/not-found.png",
    logo: "https://emojicdn.elk.sh/🔒?style=twitter",
  },
  links: {
    twitter: "https://twitter.com/foundmalek",
    github: "https://github.com/findmalek/findaccount",
  },
  author: {
    name: "Malek Gara-Hellal",
    url: "https://findmalek.com",
    email: "hi@findmalek.com",
    github: "https://github.com/findmalek",
  },
  keywords: [
    "Password Management",
    "Secure Storage",
    "Password Generation",
    "Account Details Management",
    "Password History",
    "Authentication",
    "User Interface",
    "Migration",
    "Next.js",
    "React",
    "TypeScript",
    "Prisma",
    "TailwindCSS",
    "BetterAuth",
    "Encryption",
    "AES-256",
    "Vercel",
  ],
}

export const notFoundMetadata = () => {
  return {
    title: "Page not found",
    description: "Page not found",
    openGraph: {
      title: `${siteConfig.name} | Page not found`,
      description: "Page not found",
      images: [
        {
          url: siteConfig.images.notFound,
          alt: siteConfig.name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${siteConfig.name} | Page not found`,
      description: "Page not found",
      images: [siteConfig.images.notFound],
      creator: "@findmalek",
    },
  }
}
