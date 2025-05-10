import Link from "next/link"

import { ModeToggle } from "@/components/shared/mode-toggle"

export function MarketingFooter() {
  return (
    <footer className="mt-auto w-full px-4 py-4 sm:px-6 lg:px-8">
      <div className="flex flex-col items-center justify-between sm:flex-row">
        <Link
          href="https://www.undrstnd.dev"
          className="text-foreground-muted hover:text-primary text-sm transition-colors duration-300"
        >
          © {new Date().getFullYear()} Undrstnd Labs. All rights reserved.
        </Link>

        <ModeToggle />
      </div>
    </footer>
  )
}
