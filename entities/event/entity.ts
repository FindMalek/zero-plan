import {
  eventCategoryEnum,
  EventCategoryInfer,
  eventPriorityEnum,
  EventPriorityInfer,
  EventSimpleRo,
  eventStatusEnum,
  EventStatusInfer,
} from "@/schemas/event"

import { EventEntitySimpleDbData } from "./query"

// Using string literals for now - these will be available after database creation
type EventStatus =
  | "PLANNED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CANCELLED"
  | "POSTPONED"
type EventPriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT"
type EventCategory =
  | "PERSONAL"
  | "WORK"
  | "MEETING"
  | "APPOINTMENT"
  | "REMINDER"
  | "SOCIAL"
  | "TRAVEL"
  | "HEALTH"
  | "EDUCATION"
  | "OTHER"

export class EventEntity {
  static getSimpleRo(entity: EventEntitySimpleDbData): EventSimpleRo {
    return {
      id: entity.id,
      title: entity.title,
      description: entity.description || undefined,
      startTime: entity.startTime,
      endTime: entity.endTime || undefined,
      location: entity.location || undefined,
      status: this.convertPrismaToEventStatus(entity.status as EventStatus),
      priority: this.convertPrismaToEventPriority(
        entity.priority as EventPriority
      ),
      category: this.convertPrismaToEventCategory(
        entity.category as EventCategory
      ),
      originalInput: entity.originalInput || undefined,
      aiProcessed: entity.aiProcessed,
      aiConfidence: entity.aiConfidence || undefined,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      userId: entity.userId,
    }
  }

  static convertPrismaToEventStatus(status: EventStatus): EventStatusInfer {
    switch (status) {
      case "PLANNED":
        return eventStatusEnum.PLANNED
      case "IN_PROGRESS":
        return eventStatusEnum.IN_PROGRESS
      case "COMPLETED":
        return eventStatusEnum.COMPLETED
      case "CANCELLED":
        return eventStatusEnum.CANCELLED
      case "POSTPONED":
        return eventStatusEnum.POSTPONED
      default:
        return eventStatusEnum.PLANNED
    }
  }

  static convertEventStatusToPrisma(status: EventStatusInfer): EventStatus {
    switch (status) {
      case eventStatusEnum.PLANNED:
        return "PLANNED"
      case eventStatusEnum.IN_PROGRESS:
        return "IN_PROGRESS"
      case eventStatusEnum.COMPLETED:
        return "COMPLETED"
      case eventStatusEnum.CANCELLED:
        return "CANCELLED"
      case eventStatusEnum.POSTPONED:
        return "POSTPONED"
      default:
        return "PLANNED"
    }
  }

  static convertPrismaToEventPriority(
    priority: EventPriority
  ): EventPriorityInfer {
    switch (priority) {
      case "LOW":
        return eventPriorityEnum.LOW
      case "MEDIUM":
        return eventPriorityEnum.MEDIUM
      case "HIGH":
        return eventPriorityEnum.HIGH
      case "URGENT":
        return eventPriorityEnum.URGENT
      default:
        return eventPriorityEnum.MEDIUM
    }
  }

  static convertEventPriorityToPrisma(
    priority: EventPriorityInfer
  ): EventPriority {
    switch (priority) {
      case eventPriorityEnum.LOW:
        return "LOW"
      case eventPriorityEnum.MEDIUM:
        return "MEDIUM"
      case eventPriorityEnum.HIGH:
        return "HIGH"
      case eventPriorityEnum.URGENT:
        return "URGENT"
      default:
        return "MEDIUM"
    }
  }

  static convertPrismaToEventCategory(
    category: EventCategory
  ): EventCategoryInfer {
    switch (category) {
      case "PERSONAL":
        return eventCategoryEnum.PERSONAL
      case "WORK":
        return eventCategoryEnum.WORK
      case "MEETING":
        return eventCategoryEnum.MEETING
      case "APPOINTMENT":
        return eventCategoryEnum.APPOINTMENT
      case "REMINDER":
        return eventCategoryEnum.REMINDER
      case "SOCIAL":
        return eventCategoryEnum.SOCIAL
      case "TRAVEL":
        return eventCategoryEnum.TRAVEL
      case "HEALTH":
        return eventCategoryEnum.HEALTH
      case "EDUCATION":
        return eventCategoryEnum.EDUCATION
      case "OTHER":
        return eventCategoryEnum.OTHER
      default:
        return eventCategoryEnum.PERSONAL
    }
  }

  static convertEventCategoryToPrisma(
    category: EventCategoryInfer
  ): EventCategory {
    switch (category) {
      case eventCategoryEnum.PERSONAL:
        return "PERSONAL"
      case eventCategoryEnum.WORK:
        return "WORK"
      case eventCategoryEnum.MEETING:
        return "MEETING"
      case eventCategoryEnum.APPOINTMENT:
        return "APPOINTMENT"
      case eventCategoryEnum.REMINDER:
        return "REMINDER"
      case eventCategoryEnum.SOCIAL:
        return "SOCIAL"
      case eventCategoryEnum.TRAVEL:
        return "TRAVEL"
      case eventCategoryEnum.HEALTH:
        return "HEALTH"
      case eventCategoryEnum.EDUCATION:
        return "EDUCATION"
      case eventCategoryEnum.OTHER:
        return "OTHER"
      default:
        return "PERSONAL"
    }
  }

  static convertEventStatusToString(status: EventStatusInfer): string {
    switch (status) {
      case eventStatusEnum.PLANNED:
        return "Planned"
      case eventStatusEnum.IN_PROGRESS:
        return "In Progress"
      case eventStatusEnum.COMPLETED:
        return "Completed"
      case eventStatusEnum.CANCELLED:
        return "Cancelled"
      case eventStatusEnum.POSTPONED:
        return "Postponed"
      default:
        return "Unknown"
    }
  }

  static convertEventPriorityToString(priority: EventPriorityInfer): string {
    switch (priority) {
      case eventPriorityEnum.LOW:
        return "Low"
      case eventPriorityEnum.MEDIUM:
        return "Medium"
      case eventPriorityEnum.HIGH:
        return "High"
      case eventPriorityEnum.URGENT:
        return "Urgent"
      default:
        return "Unknown"
    }
  }

  static convertEventCategoryToString(category: EventCategoryInfer): string {
    switch (category) {
      case eventCategoryEnum.PERSONAL:
        return "Personal"
      case eventCategoryEnum.WORK:
        return "Work"
      case eventCategoryEnum.MEETING:
        return "Meeting"
      case eventCategoryEnum.APPOINTMENT:
        return "Appointment"
      case eventCategoryEnum.REMINDER:
        return "Reminder"
      case eventCategoryEnum.SOCIAL:
        return "Social"
      case eventCategoryEnum.TRAVEL:
        return "Travel"
      case eventCategoryEnum.HEALTH:
        return "Health"
      case eventCategoryEnum.EDUCATION:
        return "Education"
      case eventCategoryEnum.OTHER:
        return "Other"
      default:
        return "Unknown"
    }
  }
}
