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
  TooltipTrigger,
} from "@/components/ui/tooltip"

// Navigation items configuration
const navigationItems = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    href: "/dashboard",
  },
  {
    title: "Agenda",
    icon: Notebook,
    href: "/agenda",
  },
  {
    title: "Scheduling",
    icon: Calendar,
    href: "/scheduling",
  },
  {
    title: "Tasks",
    icon: ListTodo,
    href: "/tasks",
  },
  {
    title: "Notifications",
    icon: Bell,
    href: "/notifications",
  },
  {
    title: "Archives",
    icon: Archive,
    href: "/archives",
  },
]

const secondaryItems = [
  {
    title: "Settings",
    icon: Settings,
    href: "/settings",
  },
  {
    title: "Search",
    icon: Search,
    href: "/search",
  },
  {
    title: "Help",
    icon: HelpCircle,
    href: "/help",
  },
]

// SidebarItem component for individual navigation items
interface SidebarItemProps {
  icon: React.ElementType
  title: string
  href: string
  isActive?: boolean
  isCollapsed: boolean
}

function SidebarItem({ icon: Icon, title, href, isActive, isCollapsed }: SidebarItemProps) {
  return (
    <SidebarMenuItem>
      {isCollapsed ? (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <SidebarMenuButton asChild className={cn("h-9 w-9", isActive && "bg-accent")}>
                <Link href={href}>
                  <Icon className="h-5 w-5" />
                  <span className="sr-only">{title}</span>
                </Link>
              </SidebarMenuButton>
            </TooltipTrigger>
            <TooltipContent side="right" className="border-none bg-accent text-accent-foreground">
              {title}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ) : (
        <SidebarMenuButton asChild className={cn("justify-start", isActive && "bg-accent")}>
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
  
  // Handle mobile view state
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false)

  return (
    <>
      {/* Mobile menu button - only shown on mobile */}
      {isMobile && (
        <Button 
          variant="ghost" 
          size="icon" 
          className="fixed top-4 left-4 z-50 md:hidden"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
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
          isMobile && !isMobileMenuOpen ? "hidden" : "block",
          isMobile && isMobileMenuOpen ? "absolute inset-y-0 left-0 z-40" : ""
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
              >
                {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
                <span className="sr-only">
                  {isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                </span>
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
                isActive={pathname === item.href}
                isCollapsed={isCollapsed}
              />
            ))}
          </SidebarMenu>
          
          {/* Spacer */}
          <div className="my-4" />
          
          {/* Secondary navigation items */}
          <SidebarMenu>
            {secondaryItems.map((item) => (
              <SidebarItem
                key={item.href}
                icon={item.icon}
                title={item.title}
                href={item.href}
                isActive={pathname === item.href}
                isCollapsed={isCollapsed}
              />
            ))}
          </SidebarMenu>
        </SidebarContent>
        
        <SidebarFooter className="p-2">
          {/* User profile or additional content can be added here */}
        </SidebarFooter>
      </Sidebar>
      
      {/* Overlay to close mobile menu when clicking outside */}
      {isMobile && isMobileMenuOpen && (
        <div 
          className="fixed inset-0 z-30 bg-background/80 backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  )
}