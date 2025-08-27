"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, Send, Mic, Copy, Check } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { AnimatedGridPattern } from "@/components/ui/animated-grid-pattern"
import { useAIProcessEvent } from "@/orpc/hooks/event"

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

export default function ZeroPlannerPage() {
  const [eventDetails, setEventDetails] = useState("i have an appointement tmrw at the doctor")
  const [events, setEvents] = useState<EventSkeleton[]>([])
  
  const aiProcessEvent = useAIProcessEvent()

  const handleSend = async () => {
    if (!eventDetails.trim()) return

    try {
      const result = await aiProcessEvent.mutateAsync({
        rawInput: eventDetails.trim(),
        model: "llama-3.1-8b-instant",
        provider: "groq",
      })

      if (result.success && result.events) {
        const newEvents: EventSkeleton[] = result.events.map((event: any) => ({
          id: event.id,
          title: event.title,
          startTime: new Date(event.startTime),
          endTime: event.endTime ? new Date(event.endTime) : undefined,
          time: `${new Date(event.startTime).toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}${event.endTime ? ' - ' + new Date(event.endTime).toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
          }) : ''}`,
          description: event.description,
          location: event.location,
          category: event.category,
          priority: event.priority,
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
        description: "Failed to process with AI. Please try again or edit manually.",
      }
      setEvents((prev) => [...prev, fallbackEvent])
      setEventDetails("")
    }
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex flex-col items-center justify-start px-4 py-12">
      {/* Animated Grid Background */}
      <div className="absolute inset-0 overflow-hidden opacity-30">
        <AnimatedGridPattern
          numSquares={30}
          maxOpacity={0.5}
          duration={3}
          className="text-blue-600/20 dark:text-blue-400/20"
        />
      </div>

      <div className="relative z-10 w-full max-w-2xl mx-auto space-y-8">
        {/* Logo Only */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-blue-600 to-blue-800 rounded-3xl shadow-xl">
            <span className="text-white font-bold text-3xl">Z</span>
          </div>
        </div>

        {/* Input Section */}
        <div className="space-y-4">
          <div className="relative">
            <Textarea
              value={eventDetails}
              onChange={(e) => setEventDetails(e.target.value)}
              placeholder="Type or paste your event details here... (e.g., 'Coffee meeting with John tomorrow at 3pm')"
              disabled={aiProcessEvent.isPending}
              className="min-h-[120px] resize-none border-slate-200 dark:border-slate-700 focus:border-blue-400 focus:ring-blue-400 rounded-xl text-base shadow-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed pr-12 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
            />

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={handleSend}
                    disabled={aiProcessEvent.isPending || !eventDetails.trim()}
                    className="absolute bottom-3 right-3 w-8 h-8 bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed p-0"
                  >
                    {aiProcessEvent.isPending ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : eventDetails.trim() ? (
                      <Send className="w-4 h-4" />
                    ) : (
                      <Mic className="w-4 h-4" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  {eventDetails.trim() ? "Process with AI" : "Voice input (coming soon)"}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>

        {/* Events Section */}
        {events.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Your Events</h2>
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
    const date = event.startTime.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    })
    const startTime = event.startTime.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit' 
    })
    const endTime = event.endTime ? event.endTime.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit' 
    }) : null

    let copyText = `${event.title} on ${date} at ${startTime}${endTime ? ` - ${endTime}` : ''}`
    
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
      console.error('Failed to copy:', error)
    }
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 flex-1">{event.title}</h3>
        <div className="flex items-center gap-2 ml-4">
          <span className="text-sm font-medium text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-700 px-3 py-1 rounded-full">
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
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
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
