import { SiteConfig } from "@/types"

export const siteConfig: SiteConfig = {
  name: "Zero Planner",
  description: "Simple event planning made effortless.",
  url: "https://zero-plan.findmalek.com",
  images: {
    default: "https://zero-plan.findmalek.com/og.png",
    notFound: "https://zero-plan.findmalek.com/not-found.png",
    logo: "https://emojicdn.elk.sh/📅?style=twitter",
  },
  links: {
    twitter: "https://twitter.com/foundmalek",
    github: "https://github.com/findmalek/zero-planner",
  },
  author: {
    name: "Malek Gara-Hellal",
    url: "https://findmalek.com",
    email: "hi@findmalek.com",
    github: "https://github.com/findmalek",
  },
  keywords: [
    "Event Planning",
    "Calendar",
    "Scheduling",
    "Event Management",
    "Time Planning",
    "Event Details",
    "User Interface",
    "Minimalist Design",
    "Next.js",
    "React",
    "TypeScript",
    "TailwindCSS",
    "Responsive Design",
    "Modern UI",
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
