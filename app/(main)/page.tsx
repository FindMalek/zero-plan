"use client"

import { useState } from "react"
import { useGenerateEvents } from "@/orpc/hooks"
import { EventSimpleRo } from "@/schemas"

import { MainBackground } from "@/components/app/main-background"
import { MainEventsSection } from "@/components/app/main-events-section"
import { MainHeader } from "@/components/app/main-header"
import { MainInputSection } from "@/components/app/main-input-section"

export default function MainPage() {
  const processEvents = useGenerateEvents()
  const [events, setEvents] = useState<EventSimpleRo[]>([])
  const [eventDetails, setEventDetails] = useState(
    "i have an appointement tmrw at the doctor, and i have to go to Gafsa from ksar Hellal this weekend and on sunday i have a birthday part of my friend ayoub at 8 pm"
  )

  const handleSend = async () => {
    if (!eventDetails.trim()) return

    try {
      const result = await processEvents.mutateAsync({
        userInput: eventDetails.trim(),
      })

      if (result.success && result.events?.length) {
        setEvents((prev) => [...prev, ...(result.events || [])])
        setEventDetails("")
      }
    } catch (error) {
      console.error("Failed to process event:", error)
    }
  }

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-start bg-gradient-to-br from-blue-100 via-white to-blue-50 px-4 py-12 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <MainBackground />

      <div className="relative z-10 mx-auto w-full max-w-2xl space-y-8">
        <MainHeader />

        <MainInputSection
          eventDetails={eventDetails}
          setEventDetails={setEventDetails}
          onSend={handleSend}
          isPending={processEvents.isPending}
        />

        <MainEventsSection events={events} />
      </div>
    </div>
  )
}
