"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner, ToasterProps, toast as sonnerToast, ExternalToast } from "sonner"

type ToastVariants = "default" | "destructive" | "persistent"

interface ToastProps extends ExternalToast {
  variant?: ToastVariants
}

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
        } as React.CSSProperties
      }
      {...props}
    />
  )
}

// Custom toast function with variants
const toast = (message: string | React.ReactNode, options?: ToastProps) => {
  const { variant = "default", ...rest } = options || {}
  
  switch (variant) {
    case "destructive":
      return sonnerToast.error(message, rest)
    case "persistent":
      return sonnerToast(message, {
        duration: Infinity,
        ...rest,
      })
    default:
      return sonnerToast(message, rest)
  }
}

export { Toaster, toast }
