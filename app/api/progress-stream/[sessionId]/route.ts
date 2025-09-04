import { NextRequest } from "next/server"
import { database } from "@/prisma/client"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  const { sessionId } = await params

  // Set up SSE headers
  const headers = new Headers({
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Cache-Control",
  })

  // Create a TransformStream for SSE
  const stream = new TransformStream()
  const writer = stream.writable.getWriter()
  const encoder = new TextEncoder()

  // Function to send SSE data
  const sendData = (data: {
    progress: number
    stage: string
    status: string
    timestamp: string
  }) => {
    const sseData = `data: ${JSON.stringify(data)}\n\n`
    writer.write(encoder.encode(sseData))
  }

  // Function to monitor progress
  const monitorProgress = async () => {
    let lastProgress = -1
    let lastStage = ""
    let attempts = 0
    const maxAttempts = 200 // 5 minutes max (200 * 1.5s = 300s)

    while (attempts < maxAttempts) {
      try {
        const session = await database.inputProcessingSession.findFirst({
          where: { id: sessionId },
        })

        if (!session) {
          sendData({
            progress: 0,
            stage: "Session not found",
            status: "FAILED",
            timestamp: new Date().toISOString(),
          })
          break
        }

        const processedOutput = session.processedOutput as {
          progress?: number
          stage?: string
          timestamp?: string
        } | null
        const currentProgress = processedOutput?.progress || 0
        const currentStage = processedOutput?.stage || "Initializing..."
        const status = session.status

        // Only send updates when there's a change
        if (currentProgress !== lastProgress || currentStage !== lastStage) {
          lastProgress = currentProgress
          lastStage = currentStage

          sendData({
            progress: currentProgress,
            stage: currentStage,
            status: status,
            timestamp: processedOutput?.timestamp || new Date().toISOString(),
          })

          console.log(`📡 SSE Progress: ${currentProgress}% - ${currentStage}`)
        }

        // Stop monitoring when completed or failed
        if (status === "COMPLETED" || status === "FAILED") {
          console.log(`🏁 SSE Stream ending: ${status}`)
          break
        }

        // Wait before next check
        await new Promise((resolve) => setTimeout(resolve, 1500)) // 1.5 seconds
        attempts++
      } catch (error) {
        console.error("SSE monitoring error:", error)
        sendData({
          progress: 0,
          stage: "Error monitoring progress",
          status: "FAILED",
          timestamp: new Date().toISOString(),
        })
        break
      }
    }

    // Close the stream
    writer.close()
  }

  // Start monitoring in the background
  monitorProgress()

  return new Response(stream.readable, { headers })
}
