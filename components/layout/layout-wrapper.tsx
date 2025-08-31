"use client"

import { getQueryClient } from "@/orpc/client"
import { QueryClientProvider } from "@tanstack/react-query"
import { LogIn, Moon, Sun, UserPlus } from "lucide-react"
import { useTheme } from "next-themes"

import { ThemeProvider } from "@/components/layout/theme-provider"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

function Header() {
  const { theme, setTheme } = useTheme()

  return (
    <div className="absolute right-4 top-4 z-50 flex items-center gap-3">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="rounded-lg"
            >
              <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>Toggle theme</TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <Button variant="ghost" size="sm" className="rounded-lg">
        <LogIn className="mr-2 h-4 w-4" />
        Login
      </Button>

      <Button
        size="sm"
        className="rounded-lg bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900"
      >
        <UserPlus className="mr-2 h-4 w-4" />
        Register
      </Button>
    </div>
  )
}

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const queryClient = getQueryClient()

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="system">
        <TooltipProvider delayDuration={0}>
          <div className="relative">
            <Header />
            {children}
          </div>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  )
}
