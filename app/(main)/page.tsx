"use client"

import { useState } from "react"
import { useGenerateEvents } from "@/orpc/hooks"
import { EventSimpleRo } from "@/schemas"

import { env } from "@/env"

import { MainBackground } from "@/components/app/main-background"
import { MainEventsSection } from "@/components/app/main-events-section"
import { MainHeader } from "@/components/app/main-header"
import { MainInputSection } from "@/components/app/main-input-section"

export default function MainPage() {
  const processEvents = useGenerateEvents()
  const [events, setEvents] = useState<EventSimpleRo[]>([])
  const [processingSessionId, setProcessingSessionId] = useState<
    string | undefined
  >()
  const [eventDetails, setEventDetails] = useState(
    "I have a doctor appoitement eye checkup in Ksar hellal (i live there) at 4pm and its just 15 mins go and back using the car, tomorrow i need to have a coffee with my friend Ayoub Fanter in sayeda i will be using the scooter its just 15 mins transportation to his home to pick him up and then go to a café and then after the coffee i gotta put him home again and return to my house, and the next week on monday i have to work for 4 hours in Zero Plan project at home from 4pm, but before that i need to drink my coffee"
  )

  const handleSend = async () => {
    if (!eventDetails.trim()) return

    try {
      const result = await processEvents.mutateAsync({
        userInput: eventDetails.trim(),
      })

      if (result.success) {
        const sessionId = result.processingSession?.id
        if (env.NODE_ENV === "development") {
          console.log("✅ Generation successful, session ID:", sessionId)
        }
        setProcessingSessionId(sessionId)
        setEvents(result.events || [])
        setEventDetails("")
      } else {
        console.error("Failed to process events:", result.error)
      }
    } catch (error) {
      console.error("Error processing events:", error)
    } finally {
      // Clear processing session after completion
      setTimeout(() => setProcessingSessionId(undefined), 1000)
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

        <MainEventsSection
          events={events}
          isLoading={processEvents.isPending}
          showLoadingCards={3}
          processingSessionId={processingSessionId}
        />
      </div>
    </div>
  )
}
