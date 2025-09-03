import { tool } from "ai"
import { z } from "zod"
import { generateText } from "ai"
import { aiModel } from "@/config/openai"
import { env } from "@/env"
import { PROGRESS_STAGES, type ProgressContext } from "@/lib/utils/progress-helper"

/**
 * AI-Powered Event Description Generator
 * 
 * Creates rich, contextual HTML descriptions with task lists, schedules, and
 * detailed context for events. Uses both template-based generation and AI
 * enhancement for optimal results.
 * 
 * Key Features:
 * - AI-enhanced content generation for complex events
 * - Template-based descriptions for common event types
 * - Rich HTML formatting with task lists and schedules
 * - Context-aware content based on event type and timing
 * - Personalized recommendations and tips
 * 
 * Content Types:
 * - Morning routines with motivational content
 * - Work sessions with productivity focus
 * - Travel events with logistics and tips
 * - Social events with preparation checklists
 * - Appointments with arrival and document guidance
 * 
 * @example
 * ```typescript
 * const description = await generateEventDescriptionTool.execute({
 *   eventType: "coffee",
 *   eventTitle: "☕ Coffee (Iheb)",
 *   context: "Meeting with friend to discuss project",
 *   timeOfDay: "afternoon",
 *   duration: 60
 * });
 * // Returns: { description: "<p>Coffee meeting details...</p>", template: "social", confidence: 0.9 }
 * ```
 */
export const generateEventDescriptionTool = tool({
  description:
    "Generate rich HTML descriptions with task lists, schedules, and detailed context for events",
  inputSchema: z.object({
    eventType: z.string().describe("Type of event"),
    eventTitle: z.string().describe("Event title"),
    context: z
      .string()
      .optional()
      .describe("Additional context about the event"),
    timeOfDay: z.string().optional().describe("Time of day context"),
    duration: z.number().optional().describe("Event duration in minutes"),
    includeTaskList: z
      .boolean()
      .default(true)
      .describe("Whether to include a task list"),
  }),
  execute: async ({
    eventType,
    eventTitle,
    context,
    timeOfDay,
    duration,
    includeTaskList,
  }) => {
    
    // Try AI-enhanced description for complex events with rich context
    if (context && context.length > 10 && !eventType.includes('travel')) {
      try {
        const aiDescription = await generateText({
          model: aiModel,
          prompt: `Create a rich HTML description for this event:

EVENT: ${eventTitle}
TYPE: ${eventType}
CONTEXT: ${context}
TIME OF DAY: ${timeOfDay || 'unspecified'}
DURATION: ${duration ? `${duration} minutes` : 'unspecified'}

Create an engaging HTML description that includes:
1. A brief overview of the event
2. A practical task list or preparation checklist (if relevant)
3. Helpful tips or recommendations
4. Motivational or contextual closing

Format as clean HTML with <p>, <ul>, <li>, <strong>, <em> tags.
Keep it concise but informative.
Make it personal and actionable.

Example format:
<p>Brief overview of what this event is about...</p>
<ul>
  <li>Practical task 1</li>
  <li>Practical task 2</li>
</ul>
<p>Helpful tip or motivational message.</p>`
        })

        // Extract and clean the HTML
        const cleanedDescription = aiDescription.text
          .replace(/```html\n?/g, '')
          .replace(/```\n?/g, '')
          .trim()
        
        if (cleanedDescription && cleanedDescription.includes('<')) {
          return {
            description: cleanedDescription,
            template: "ai_generated",
            confidence: 0.9,
          }
        }
      } catch (error) {
        if (env.NODE_ENV === 'development') {
          console.log("AI description generation failed, using templates:", error)
        }
        // Fall through to template-based generation
      }
    }
    const descriptionTemplates: Record<
      string,
      (title: string, ctx?: string, time?: string, dur?: number) => string
    > = {
      morning: () =>
        `
        <p>Tasks you should do, each morning session:</p>
        <ul>
          <li>Go to the toilet</li>
          <li>Wash your face</li>
          <li>Wash your teeth</li>
          <li>Prepare breakfast</li>
        </ul>
        <p>Now raise your fist up to the sky, and fight soldier.</p>
      `.trim(),

      work: (title: string, _ctx?: string, _time?: string, dur?: number) =>
        `
        <p>The purpose of this session is to focus on key objectives and tasks. 
        It serves as a productive time block to make progress on important work 
        and ensure alignment with project goals.</p>
        ${dur ? `<p><em>Estimated duration: ${Math.floor(dur / 60)}h ${dur % 60}m</em></p>` : ""}
      `.trim(),

      meeting: (title: string, ctx?: string) =>
        `
        <p>Meeting agenda and objectives:</p>
        <ul>
          <li>Review progress and updates</li>
          <li>Discuss key topics and decisions</li>
          <li>Plan next steps and action items</li>
        </ul>
        ${ctx ? `<p>Context: ${ctx}</p>` : ""}
      `.trim(),

      preparation: (_title: string, ctx?: string) =>
        `
        <p>To Do List:</p>
        <ol>
          <li>Gather required items</li>
          <li>Check equipment/supplies</li>
          <li>Review objectives</li>
          <li>Set up workspace</li>
        </ol>
        ${ctx ? `<p>Special notes: ${ctx}</p>` : ""}
      `.trim(),

      workout: (_title: string, _ctx?: string, _time?: string, dur?: number) =>
        `
        <p>Training Session Details:</p>
        <ul>
          <li>Warm-up: 5-10 minutes</li>
          <li>Main workout: Focus on form and progression</li>
          <li>Cool-down and stretching</li>
        </ul>
        <p><br></p><p>Remember: Consistency beats intensity.</p>
        ${dur ? `<p>Total session time: ${Math.floor(dur / 60)}h ${dur % 60}m</p>` : ""}
      `.trim(),

      travel: (_title: string, ctx?: string, _time?: string, dur?: number) =>
        `
        <p>Travel Details:</p>
        <ul>
          <li>Check departure time</li>
          <li>Prepare necessary items</li>
          <li>Allow extra time for delays</li>
          ${dur ? `<li>Expected travel time: ${Math.floor(dur / 60)}h ${dur % 60}m</li>` : ""}
        </ul>
        ${ctx ? `<p>Additional notes: ${ctx}</p>` : ""}
      `.trim(),

      appointment: (title: string, ctx?: string) =>
        `
        <p>Appointment checklist:</p>
        <ul>
          <li>Confirm appointment time</li>
          <li>Prepare necessary documents</li>
          <li>Plan arrival time (15 min early)</li>
        </ul>
        ${ctx ? `<p>Notes: ${ctx}</p>` : ""}
      `.trim(),

      birthday: (title: string, ctx?: string) =>
        `
        <p>🎉 Party preparations:</p>
        <ul>
          <li>Bring/prepare gift</li>
          <li>Confirm attendance</li>
          <li>Plan outfit</li>
          <li>Check location and directions</li>
        </ul>
        ${ctx ? `<p>Special details: ${ctx}</p>` : ""}
        <p>Let's make it memorable! 🎈</p>
      `.trim(),
    }

    const type = eventType.toLowerCase()

    // Find matching template
    for (const [key, template] of Object.entries(descriptionTemplates)) {
      if (type.includes(key)) {
        return {
          description: template(eventTitle, context, timeOfDay, duration),
          template: key,
          confidence: 0.9,
        }
      }
    }

    // Enhanced default description
    let defaultDesc = `<p><strong>${eventTitle}</strong></p>`

    if (context) {
      defaultDesc += `<p>${context}</p>`
    }

    if (includeTaskList) {
      defaultDesc += `
        <p>Key points:</p>
        <ul>
          <li>Review event details</li>
          <li>Prepare as needed</li>
          <li>Arrive on time</li>
        </ul>
      `
    }

    return {
      description: defaultDesc.trim(),
      template: "default",
      confidence: 0.6,
    }
  },
})
