"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

const Progress = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    value: number
    max?: number
    variant?: "default" | "success" | "warning" | "danger"
    size?: "default" | "sm" | "lg"
  }
>(({ className, value, max = 100, variant = "default", size = "default", ...props }, ref) => {
  const percentage = Math.min(Math.max(0, value), max) / max * 100
  
  return (
    <div
      ref={ref}
      className={cn(
        "relative h-2 w-full overflow-hidden rounded-full bg-secondary",
        {
          "h-1": size === "sm",
          "h-2": size === "default",
          "h-3": size === "lg",
        },
        className
      )}
      {...props}
    >
      <div
        className={cn(
          "h-full w-full flex-1 rounded-full transition-all",
          {
            "bg-primary": variant === "default",
            "bg-green-500": variant === "success",
            "bg-yellow-500": variant === "warning",
            "bg-red-500": variant === "danger",
          }
        )}
        style={{ width: `${percentage}%` }}
      />
    </div>
  )
})
Progress.displayName = "Progress"

export { Progress }