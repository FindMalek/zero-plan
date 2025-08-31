"use client"

import { useState } from "react"
import { useProcessEvents } from "@/orpc/hooks/event"

import { Icons } from "@/components/shared/icons"
import { AnimatedGridPattern } from "@/components/ui/animated-grid-pattern"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface EventSkeleton {
  id: string
  title: string
  time: string
  startTime: Date
  endTime?: Date
  description?: string
  location?: string
  category?: string
  priority?: string
}

export default function MainPage() {
  const [eventDetails, setEventDetails] = useState(
    "i have an appointement tmrw at the doctor"
  )
  const [events, setEvents] = useState<EventSkeleton[]>([])

  const processEvents = useProcessEvents()

  const handleSend = async () => {
    if (!eventDetails.trim()) return

    try {
      const result = await processEvents.mutateAsync({
        userInput: eventDetails.trim(),
      })

      if (result.success && result.events) {
        const newEvents: EventSkeleton[] = result.events.map((event: any) => ({
          id: event.id,
          title: event.title,
          startTime: new Date(event.startTime),
          endTime: event.endTime ? new Date(event.endTime) : undefined,
          time: `${new Date(event.startTime).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}${
            event.endTime
              ? " - " +
                new Date(event.endTime).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : ""
          }`,
          description: "AI-generated event",
          location: undefined,
          category: undefined,
          priority: undefined,
        }))

        setEvents((prev) => [...prev, ...newEvents])
        setEventDetails("")
      }
    } catch (error) {
      console.error("Failed to process event:", error)
      // Fallback: create a simple event
      const fallbackEvent: EventSkeleton = {
        id: Date.now().toString(),
        title: `📝 ${eventDetails.trim()}`,
        time: "Time to be determined",
        startTime: new Date(),
        description:
          "Failed to process with AI. Please try again or edit manually.",
      }
      setEvents((prev) => [...prev, fallbackEvent])
      setEventDetails("")
    }
  }

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-start bg-gradient-to-br from-blue-100 via-white to-blue-50 px-4 py-12 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Animated Grid Background */}
      <div className="absolute inset-0 overflow-hidden opacity-30">
        <AnimatedGridPattern
          numSquares={30}
          maxOpacity={0.5}
          duration={3}
          className="text-blue-600/20 dark:text-blue-400/20"
        />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-2xl space-y-8">
        {/* Logo Only */}
        <div className="text-center">
          <div className="inline-flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-blue-600 to-blue-800 shadow-xl">
            <span className="text-3xl font-bold text-white">Z</span>
          </div>
        </div>

        {/* Input Section */}
        <div className="space-y-4">
          <div className="relative">
            <Textarea
              value={eventDetails}
              onChange={(e) => setEventDetails(e.target.value)}
              placeholder="Type or paste your event details here... (e.g., 'Coffee meeting with John tomorrow at 3pm')"
              disabled={processEvents.isPending}
              className="min-h-[120px] resize-none rounded-xl border-slate-200 bg-white pr-12 text-base text-slate-900 shadow-sm transition-all duration-200 focus:border-blue-400 focus:ring-blue-400 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            />

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={handleSend}
                    disabled={processEvents.isPending || !eventDetails.trim()}
                    className="absolute bottom-3 right-3 h-8 w-8 rounded-lg bg-gradient-to-r from-blue-600 to-blue-800 p-0 text-white shadow-md transition-all duration-200 hover:from-blue-700 hover:to-blue-900 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {processEvents.isPending ? (
                      <Icons.spinner className="h-4 w-4 animate-spin" />
                    ) : eventDetails.trim() ? (
                      <Icons.send className="h-4 w-4" />
                    ) : (
                      <Icons.microphone className="h-4 w-4" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  {eventDetails.trim()
                    ? "Process with AI"
                    : "Voice input (coming soon)"}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>

        {/* Events Section */}
        {events.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
              Your Events
            </h2>
            <div className="space-y-3">
              {events.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function EventCard({ event }: { event: EventSkeleton }) {
  const [copied, setCopied] = useState(false)

  const formatEventForCopy = () => {
    const date = event.startTime.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
    const startTime = event.startTime.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    })
    const endTime = event.endTime
      ? event.endTime.toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
        })
      : null

    let copyText = `${event.title} on ${date} at ${startTime}${endTime ? ` - ${endTime}` : ""}`

    if (event.description) {
      copyText += `\n\n${event.description}`
    }

    return copyText
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(formatEventForCopy())
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error("Failed to copy:", error)
    }
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow duration-200 hover:shadow-md dark:border-slate-700 dark:bg-slate-800">
      <div className="mb-3 flex items-start justify-between">
        <h3 className="flex-1 text-lg font-medium text-slate-900 dark:text-slate-100">
          {event.title}
        </h3>
        <div className="ml-4 flex items-center gap-2">
          <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-600 dark:bg-slate-700 dark:text-slate-400">
            {event.time}
          </span>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCopy}
                  className="h-8 w-8 p-0 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                >
                  {copied ? (
                    <Icons.check className="h-4 w-4" />
                  ) : (
                    <Icons.copy className="h-4 w-4" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {copied ? "Copied!" : "Copy event details"}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      {/* Real description or location if available */}
      {(event.description || event.location) && (
        <div className="space-y-2">
          {event.location && (
            <p className="text-sm text-slate-600 dark:text-slate-400">
              📍 {event.location}
            </p>
          )}
          {event.description && (
            <div
              className="text-sm text-slate-700 dark:text-slate-300"
              dangerouslySetInnerHTML={{ __html: event.description }}
            />
          )}
        </div>
      )}
    </div>
  )
}
