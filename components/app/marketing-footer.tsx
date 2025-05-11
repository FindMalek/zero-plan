import Link from "next/link"

import { ModeToggle } from "@/components/shared/mode-toggle"

export function MarketingFooter() {
  return (
    <footer className="mt-auto w-full px-4 py-4 sm:px-6 lg:px-8">
      <div className="flex flex-col items-center justify-between sm:flex-row">
        <Link
          href="https://www.findmalek.com"
          target="_blank"
          className="text-foreground-muted hover:text-primary text-sm underline-offset-4 transition-colors duration-300 hover:underline"
        >
          © {new Date().getFullYear()} Malek Gara-Hellal. All rights reserved.
        </Link>

        <ModeToggle />
      </div>
    </footer>
  )
}
