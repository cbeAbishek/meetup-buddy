"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Notebook,
  Calendar,
  ListTodo,
  Bell,
  Archive,
  Settings,
  Search,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarSeparator,
  useSidebar,
} from "@/components/ui/sidebar"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { NavUser } from "@/components/nav-user"

// Navigation items configuration - meeting focused items
const navigationItems = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    href: "/dashboard",
  },
  {
    title: "Agenda",
    icon: Notebook,
    href: "/dashboard/agenda",
  },
  {
    title: "Scheduling",
    icon: Calendar,
    href: "/dashboard/scheduling",
  },
  {
    title: "Follow-ups",
    icon: ListTodo,
    href: "/dashboard/follow-ups",
  },
  {
    title: "Reminders",
    icon: Bell,
    href: "/dashboard/reminders",
  },
  {
    title: "Data Library",
    icon: Archive,
    href: "/dashboard/data-library",
  }
]

// Footer items
const footerItems = [
  {
    title: "Settings",
    icon: Settings,
    href: "/dashboard/settings",
  },
  {
    title: "Search",
    icon: Search,
    href: "/search",
  },
  {
    title: "Get Help",
    icon: HelpCircle,
    href: "/help",
  }
]

// Custom Toggle Button with smooth animations and position changes
function AnimatedSidebarTrigger() {
  const { state, toggleSidebar } = useSidebar()
  const isCollapsed = state === "collapsed"

  return (
    <div className={cn(
      "flex items-center transition-all duration-500 ease-in-out w-full",
      isCollapsed ? "justify-start" : "justify-end"
    )}>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size={isCollapsed ? "icon" : "sm"}
              onClick={toggleSidebar}
              className={cn(
                "transition-all duration-500 ease-in-out rounded-lg",
                "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                "focus-visible:ring-2 focus-visible:ring-sidebar-ring",
                "group relative overflow-hidden",
                isCollapsed ? "h-8 w-8" : "h-8 px-3 gap-2"
              )}
            >
              <div className="relative transition-transform duration-500 ease-in-out">
                <ChevronLeft 
                  className={cn(
                    "h-4 w-4 transition-all duration-500 ease-in-out",
                    isCollapsed ? "rotate-180" : "rotate-0"
                  )}
                />
              </div>
              
              {/* Animated text that appears/disappears */}
              <span className={cn(
                "text-xs font-medium transition-all duration-500 ease-in-out overflow-hidden whitespace-nowrap",
                isCollapsed 
                  ? "w-0 opacity-0 translate-x-2" 
                  : "w-auto opacity-100 translate-x-0"
              )}>
                Close
              </span>
              
              <div className={cn(
                "absolute inset-0 bg-sidebar-primary rounded-lg transition-all duration-300 ease-in-out",
                "scale-0 group-hover:scale-100 opacity-0 group-hover:opacity-10"
              )} />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right" className="text-xs">
            {isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  )
}

// Enhanced Menu Item with smooth animations
interface AnimatedMenuItemProps {
  item: {
    title: string
    icon: React.ElementType
    href: string
  }
  isActive: boolean
}

function AnimatedMenuItem({ item, isActive }: AnimatedMenuItemProps) {
  const { state } = useSidebar()
  const isCollapsed = state === "collapsed"

  if (isCollapsed) {
    return (
      <SidebarMenuItem>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <SidebarMenuButton 
                asChild 
                isActive={isActive}
                className={cn(
                  "transition-all duration-300 ease-in-out",
                  "hover:scale-105 active:scale-95",
                  isActive && "bg-sidebar-primary text-sidebar-primary-foreground"
                )}
              >
                <Link href={item.href}>
                  <item.icon className="h-4 w-4 transition-transform duration-200" />
                </Link>
              </SidebarMenuButton>
            </TooltipTrigger>
            <TooltipContent side="right" className="text-xs font-medium">
              {item.title}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </SidebarMenuItem>
    )
  }

  return (
    <SidebarMenuItem>
      <SidebarMenuButton 
        asChild 
        isActive={isActive}
        className={cn(
          "transition-all duration-300 ease-in-out",
          "hover:scale-[1.02] active:scale-98",
          "group relative overflow-hidden"
        )}
      >
        <Link href={item.href} className="flex items-center gap-3">
          <item.icon className="h-4 w-4 transition-transform duration-200 group-hover:scale-110" />
          <span className={cn(
            "transition-all duration-300 ease-in-out",
            "transform translate-x-0 opacity-100"
          )}>
            {item.title}
          </span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  )
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()

  return (
    <Sidebar 
      collapsible="icon" 
      className="transition-all duration-500 ease-in-out border-r border-sidebar-border"
      {...props}
    >
      <SidebarHeader className="transition-all duration-500 ease-in-out">
        <div className="flex items-center px-3 py-3">
          <AnimatedSidebarTrigger />
        </div>
      </SidebarHeader>
      
      <SidebarContent className="transition-all duration-500 ease-in-out">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {navigationItems.map((item) => (
                <AnimatedMenuItem
                  key={item.href}
                  item={item}
                  isActive={pathname === item.href}
                />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
        <SidebarSeparator className="transition-all duration-500 ease-in-out" />
        
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {footerItems.map((item) => (
                <AnimatedMenuItem
                  key={item.href}
                  item={item}
                  isActive={pathname === item.href}
                />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter className="transition-all duration-500 ease-in-out">
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  )
}