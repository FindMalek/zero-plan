import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function MarketingWaitlistForm() {
  return (
    <div className="w-full space-y-4 lg:w-1/2">
      <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl lg:whitespace-nowrap lg:text-4xl xl:text-5xl">
        AI Driven Lead Management
      </h2>
      <p className="text-lg text-gray-600 dark:text-gray-400">
        Manage your leads without the enterprise bloat.
      </p>
      <div className="flex flex-col gap-2 pt-4 sm:flex-row">
        <Input
          type="email"
          placeholder="Your email"
          className="bg-background w-full sm:w-auto sm:flex-1 dark:bg-gray-800"
        />
        <Button className="w-full sm:w-auto">Join Waitlist</Button>
      </div>
    </div>
  )
}
