"use client"

import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"

import { cn } from "@/lib/utils"

function Tabs({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Root>) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      className={cn("flex flex-col gap-3", className)}
      {...props}
    />
  )
}

function TabsList({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.List>) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      className={cn(
        "bg-background/60 text-muted-foreground inline-flex h-11 w-fit items-center justify-center rounded-xl p-1 shadow-sm backdrop-blur-sm border border-slate-100 dark:border-slate-800",
        className
      )}
      {...props}
    />
  )
}

function TabsTrigger({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={cn(
        "relative inline-flex h-[calc(100%-2px)] flex-1 items-center justify-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium whitespace-nowrap transition-all duration-200 ease-out",
        "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100",
        "before:absolute before:inset-0 before:rounded-md before:bg-transparent hover:before:bg-slate-100/80 dark:hover:before:bg-slate-800/50 before:transition-colors before:-z-10",
        "data-[state=active]:text-teal-700 dark:data-[state=active]:text-teal-300",
        "data-[state=active]:before:bg-white dark:data-[state=active]:before:bg-slate-800",
        "data-[state=active]:before:shadow-sm data-[state=active]:before:ring-1 data-[state=active]:before:ring-slate-200/70 dark:data-[state=active]:before:ring-slate-700",
        "after:absolute after:h-0.5 after:rounded-full after:bg-teal-600 after:left-3 after:right-3 after:bottom-0 after:scale-0 data-[state=active]:after:scale-100 after:transition-transform after:duration-200",
        "focus-visible:outline-none",
        "disabled:pointer-events-none disabled:opacity-50", 
        "[&_svg]:size-4 [&_svg]:shrink-0",
        className
      )}
      {...props}
    />
  )
}

function TabsContent({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      className={cn(
        "mt-2 outline-none transition-all animate-in fade-in-5 zoom-in-[0.98] data-[state=inactive]:animate-out data-[state=inactive]:fade-out-0 data-[state=inactive]:zoom-out-95",
        className
      )}
      {...props}
    />
  )
}

export { Tabs, TabsList, TabsTrigger, TabsContent }
