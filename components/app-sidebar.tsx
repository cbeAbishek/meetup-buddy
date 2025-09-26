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
  ChevronRight,
  ChevronLeft,
  Menu
} from "lucide-react"

import { useIsMobile } from "@/hooks/use-mobile"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useSidebar } from "@/components/ui/sidebar"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip"

// Navigation items configuration - meeting focused items
const navigationItems = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    href: "/dashboard",
    description: "Overview with meeting metrics, trust score, reminders"
  },
  {
    title: "Agenda",
    icon: Notebook,
    href: "/dashboard/agenda",
    description: "Pre-meeting prep, past notes, sales highlights"
  },
  {
    title: "Scheduling",
    icon: Calendar,
    href: "/dashboard/scheduling",
    description: "Auto-find best slots, calendar integration"
  },
  {
    title: "Follow-ups",
    icon: ListTodo,
    href: "/dashboard/follow-ups",
    description: "Track tasks, decisions, status"
  },
  {
    title: "Calendar",
    icon: Calendar,
    href: "/dashboard/calendar",
    description: "Week view, scheduling and bookings"
  },
  {
    title: "Reminders",
    icon: Bell,
    href: "/dashboard/reminders",
    description: "Upcoming deadlines and action alerts"
  },
  {
    title: "Data Library",
    icon: Archive,
    href: "/dashboard/data-library",
    description: "Past meetings, sales records, notes"
  }
]

// Footer items
const footerItems = [
  {
    title: "Settings",
    icon: Settings,
    href: "/settings",
    description: "Account and profile configuration"
  },
  {
    title: "Search",
    icon: Search,
    href: "/search",
    description: "Find content across the app"
  },
  {
    title: "Get Help",
    icon: HelpCircle,
    href: "/help",
    description: "Support and documentation"
  }
]

// SidebarItem component for individual navigation items
interface SidebarItemProps {
  icon: React.ElementType
  title: string
  href: string
  description?: string
  isActive?: boolean
  isCollapsed: boolean
}

function SidebarItem({ icon: Icon, title, href, description, isActive, isCollapsed }: SidebarItemProps) {
  return (
    <SidebarMenuItem>
      {isCollapsed ? (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <SidebarMenuButton asChild className={cn("h-9 w-9", isActive && "bg-primary text-primary-foreground")}>
                <Link href={href}>
                  <Icon className="h-5 w-5" />
                  <span className="sr-only">{title}</span>
                </Link>
              </SidebarMenuButton>
            </TooltipTrigger>
            <TooltipContent side="right" className="border-none bg-primary/90 text-primary-foreground">
              <div>
                <p className="font-medium">{title}</p>
                {description && <p className="text-xs opacity-75">{description}</p>}
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ) : (
        <SidebarMenuButton asChild className={cn("justify-start", isActive && "bg-primary text-primary-foreground")}>
          <Link href={href}>
            <Icon className="mr-2 h-5 w-5" />
            <span>{title}</span>
          </Link>
        </SidebarMenuButton>
      )}
    </SidebarMenuItem>
  )
}

// Main AppSidebar component
export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [isCollapsed, setIsCollapsed] = React.useState(false)
  const isMobile = useIsMobile()
  const pathname = usePathname()

  // Use the Sidebar context for mobile open state so there's a single source of truth
  const { openMobile, setOpenMobile, toggleSidebar } = useSidebar()

  return (
    <>
      {/* Mobile menu button - only shown on mobile */}
      {isMobile && (
        <Button
          variant="ghost"
          size="icon"
          className="fixed top-4 left-4 z-50 md:hidden"
          onClick={() => toggleSidebar()}
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      )}
      
      {/* Sidebar component - visible based on state and device */}
      <Sidebar
        className={cn(
          "border-r transition-all duration-300",
          isCollapsed ? "w-[68px]" : "w-[240px]",
          // when on mobile, use the sidebar context open state
          isMobile && !openMobile ? "hidden" : "block",
          isMobile && openMobile ? "absolute inset-y-0 left-0 z-40" : ""
        )}
        {...props}
      >
        <SidebarHeader className="p-2">
          <div className="flex items-center justify-between px-3 py-2">
            {!isCollapsed && <h2 className="text-lg font-semibold">Meeting Buddy</h2>}
            
            {/* Toggle button for collapsing sidebar - hidden on mobile */}
            {!isMobile && (
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setIsCollapsed(!isCollapsed)}
                aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              >
                {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
              </Button>
            )}
          </div>
        </SidebarHeader>
        
        <SidebarContent className="p-2">
          <SidebarMenu>
            {/* Main navigation items */}
            {navigationItems.map((item) => (
              <SidebarItem
                key={item.href}
                icon={item.icon}
                title={item.title}
                href={item.href}
                description={item.description}
                isActive={pathname === item.href}
                isCollapsed={isCollapsed}
              />
            ))}
          </SidebarMenu>
          
          {/* Spacer */}
          <div className="my-4" />
          
          {/* Footer navigation items */}
          <SidebarMenu>
            {footerItems.map((item) => (
              <SidebarItem
                key={item.href}
                icon={item.icon}
                title={item.title}
                href={item.href}
                description={item.description}
                isActive={pathname === item.href}
                isCollapsed={isCollapsed}
              />
            ))}
          </SidebarMenu>
        </SidebarContent>
        
        <SidebarFooter className="p-2">
          {/* User profile could be added here */}
        </SidebarFooter>
      </Sidebar>
      
      {/* Overlay to close mobile menu when clicking outside */}
      {isMobile && openMobile && (
        <div
          className="fixed inset-0 z-30 bg-background/80 backdrop-blur-sm"
          onClick={() => setOpenMobile(false)}
        />
      )}
    </>
  )
}