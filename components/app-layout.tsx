'use client'

import * as React from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  Calendar,
  LayoutDashboard,
  MessageSquare,
  Users,
  Settings,
  LogOut,
  User,
  Bell,
  ChevronRight,
} from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { useIsMobile } from "@/hooks/use-mobile"

interface AppLayoutProps {
  children: React.ReactNode
}

const navigationItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Calendar",
    url: "/dashboard/calendar",
    icon: Calendar,
  },
  {
    title: "Groups",
    url: "/dashboard/groups",
    icon: Users,
  },
  {
    title: "Chats",
    url: "/dashboard/chats",
    icon: MessageSquare,
  },
]

// Enhanced Nav User component with teal theming
function NavUser() {
  const { user, signOut } = useAuth()
  const isMobile = useIsMobile()

  if (!user) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton size="lg" disabled>
            <Avatar className="h-8 w-8 rounded-lg">
              <AvatarFallback className="rounded-lg bg-teal-100 text-teal-600">U</AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">Guest User</span>
              <span className="truncate text-xs text-muted-foreground">Not signed in</span>
            </div>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    )
  }

  const displayName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'User'
  const userEmail = user.email || ''
  const avatarUrl = user.user_metadata?.avatar_url
  const initials = displayName.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase()

  const handleSignOut = async () => {
    try {
      await signOut()
      window.location.href = '/'
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-teal-50 data-[state=open]:text-teal-900 hover:bg-teal-50 hover:text-teal-900 dark:data-[state=open]:bg-teal-900/40 dark:data-[state=open]:text-teal-100 dark:hover:bg-teal-900/40"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={avatarUrl} alt={displayName} />
                <AvatarFallback className="rounded-lg bg-teal-500 text-white">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{displayName}</span>
                <span className="truncate text-xs text-muted-foreground">{userEmail}</span>
              </div>
              <ChevronRight className="ml-auto h-4 w-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={avatarUrl} alt={displayName} />
                  <AvatarFallback className="rounded-lg bg-teal-500 text-white">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{displayName}</span>
                  <span className="truncate text-xs text-muted-foreground">{userEmail}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/dashboard/settings">
                <User className="mr-2 h-4 w-4" />
                Profile & Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut} className="text-red-600 focus:text-red-600">
              <LogOut className="mr-2 h-4 w-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}

export function AppLayout({ children }: AppLayoutProps) {
  const pathname = usePathname()

  return (
    <SidebarProvider 
      className="min-h-screen flex"
      style={{
        "--sidebar-width": "16rem",
        "--sidebar-width-icon": "3rem",
      } as React.CSSProperties}
    >
      <Sidebar 
        collapsible="icon" 
        className="border-r-teal-200/50 dark:border-r-teal-800/50 transition-all duration-300 ease-in-out relative z-10"
      >
        <SidebarHeader className="p-2">
          <div className="flex items-center justify-end">
            <SidebarTrigger className="hover:bg-teal-100 hover:teal-800/50 dark:hover:bg-teal-900/60 dark:hover:teal-800/50" />
          </div>
        </SidebarHeader>
        
        <SidebarContent className="px-2 pt-2">
          <SidebarMenu className="space-y-1">
            {navigationItems.map((item) => {
              const isActive = pathname === item.url
              const Icon = item.icon
              return (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive}
                    className={cn(
                      "transition-all duration-200 hover:bg-teal-50 dark:hover:bg-teal-900/40",
                      // default (inactive) text color teal
                      "text-teal-600 dark:text-teal-300",
                      isActive && [
                        // active: teal background + white text
                        "bg-teal-600 text-white font-semibold shadow-sm ring-1 ring-teal-700/40",
                        "dark:bg-teal-600 dark:text-white dark:ring-teal-400/30",
                        "border-r-2 border-teal-700"
                      ]
                    )}
                  >
                    <Link href={item.url} className="flex w-full items-center gap-2">
                      <Icon
                        className={cn(
                          "h-4 w-4 transition-colors",
                          isActive ? "text-white" : "text-teal-600 dark:text-teal-300"
                        )}
                      />
                      <span
                        className={cn(
                          "transition-colors",
                          isActive ? "text-white" : "text-teal-600 dark:text-teal-300"
                        )}
                      >
                        {item.title}
                      </span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )
            })}
          </SidebarMenu>
        </SidebarContent>

        <SidebarFooter className="p-2 border-t-teal-200/50 dark:border-t-teal-800/50">
          <NavUser />
        </SidebarFooter>
      </Sidebar>

      <SidebarInset className="flex-1 flex flex-col transition-all duration-300 ease-in-out">
        <header className="flex h-16 shrink-0 items-center gap-2 border-b bg-gradient-to-r from-teal-50/50 to-teal-100/30 dark:from-teal-950/50 dark:to-teal-900/30 border-teal-200/50 dark:border-teal-800/50 px-4 sticky top-0 z-30">
          <Link href="/dashboard" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-600 text-white">
              <MessageSquare className="h-4 w-4" />
            </div>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-semibold text-teal-900 dark:text-teal-100">Meetup Buddy</span>
              <span className="truncate text-xs text-muted-foreground">Smart Meetings</span>
            </div>
          </Link>
          
          <div className="ml-auto flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon"
              className="hover:bg-teal-100 hover:text-teal-900 dark:hover:bg-teal-900/60 dark:hover:text-teal-100 transition-colors"
            >
              <Bell className="h-4 w-4" />
              <span className="sr-only">Notifications</span>
            </Button>
          </div>
        </header>
        <main className="flex-1 overflow-auto bg-background">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}