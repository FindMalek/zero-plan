import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { ZodError, ZodIssue } from "zod"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date | string) {
  if (typeof date === "string") {
    date = new Date(date)
  }

  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  })
}

export function getAvatarOrFallback(user: {
  name?: string
  image?: string | null
}) {
  if (!user.image) {
    return `https://avatar.vercel.sh/${user.name}`
  }

  return user.image
}

export function capitalizeFirstLetter(string: string): string {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

export function checkIsActive(
  currentPathname: string,
  linkHref: string
): boolean {
  return currentPathname === linkHref
}

export function formatFullDate(date: Date | string | number): string {
  return new Intl.DateTimeFormat(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  }).format(new Date(date))
}

/**
 * Process different types of errors and return standardized error messages
 *
 * @param error The error to process (can be any type)
 * @param defaultMessage Default message to show if error type is not recognized
 * @returns Standardized error object with message and details
 */
export function handleErrors(
  error: unknown,
  defaultMessage = "An unexpected error occurred"
): { message: string; details?: string | string[] } {
  // Handle Zod validation errors
  if (error instanceof ZodError) {
    const details = error.issues.map((issue: ZodIssue) =>
      issue.path.length > 0
        ? `${issue.path.join(".")}: ${issue.message}`
        : issue.message
    )

    return {
      message: "Validation failed",
      details: details.length === 1 ? details[0] : details,
    }
  }

  // Handle API response errors that contain issues array
  if (
    error &&
    typeof error === "object" &&
    "issues" in error &&
    Array.isArray(error.issues)
  ) {
    const issues = error.issues as ZodIssue[]
    const details = issues.map((issue: ZodIssue) =>
      issue.path.length > 0
        ? `${issue.path.join(".")}: ${issue.message}`
        : issue.message
    )

    return {
      message: "Validation failed",
      details: details.length === 1 ? details[0] : details,
    }
  }

  // Handle standard Error objects
  if (error instanceof Error) {
    return {
      message: error.message || defaultMessage,
      details: error.stack ? error.stack.split("\n")[0] : undefined,
    }
  }

  // Handle API response errors
  if (
    error &&
    typeof error === "object" &&
    "error" in error &&
    typeof error.error === "string"
  ) {
    return {
      message: error.error,
      details:
        "message" in error && typeof error.message === "string"
          ? error.message
          : undefined,
    }
  }

  // Handle string errors
  if (typeof error === "string") {
    return {
      message: error,
    }
  }

  // Default case for unknown error types
  return {
    message: defaultMessage,
  }
}

/**
 * Returns an object with the given value if it exists, otherwise returns an empty object
 * @param value The value to check
 * @param key The key to use in the returned object
 * @returns An object with the value if it exists, otherwise an empty object
 */
export function getOrReturnEmptyObject<T>(
  value: T | undefined | null,
  key: string
): Record<string, T> {
  return value ? { [key]: value } : {}
}

export function getPlaceholderImage(
  string: string,
  url: string | undefined | null
): string {
  if (url && url !== null) {
    return url
  }

  return `https://avatar.vercel.sh/${string}`
}
