"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export default function CalendarShell({ children }: { children: React.ReactNode }) {
  return (
    <div className={cn("flex h-full min-h-screen gap-6 p-6")}> 
      {children}
    </div>
  )
}
