'use client'

import * as React from 'react'
import { PanelLeft, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { useSidebar } from '@/components/ui/sidebar'
import { useIsMobile } from '@/hooks/use-mobile'
import { cn } from '@/lib/utils'

interface MobileSidebarTriggerProps {
  children: React.ReactNode
  className?: string
}

export function MobileSidebarTrigger({ children, className }: MobileSidebarTriggerProps) {
  const { toggleSidebar, isMobile, openMobile, setOpenMobile } = useSidebar()
  const [open, setOpen] = React.useState(false)

  // For mobile, use the sheet
  if (isMobile) {
    return (
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "hover:bg-teal-100 hover:text-teal-900 dark:hover:bg-teal-900/60 dark:hover:text-teal-100",
              className
            )}
          >
            <PanelLeft className="h-4 w-4" />
            <span className="sr-only">Toggle Navigation Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent 
          side="left" 
          className="w-[300px] p-0 bg-teal-50/30 dark:bg-teal-950/30"
        >
          <SheetHeader className="sr-only">
            <SheetTitle>Navigation Menu</SheetTitle>
            <SheetDescription>Access different sections of the app</SheetDescription>
          </SheetHeader>
          <div className="h-full overflow-auto">
            {children}
          </div>
        </SheetContent>
      </Sheet>
    )
  }

  // For desktop, use the regular sidebar trigger
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleSidebar}
      className={cn(
        "hover:bg-teal-100 hover:text-teal-900 dark:hover:bg-teal-900/60 dark:hover:text-teal-100",
        className
      )}
    >
      <PanelLeft className="h-4 w-4" />
      <span className="sr-only">Toggle Sidebar</span>
    </Button>
  )
}