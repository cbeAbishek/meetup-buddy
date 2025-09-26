'use client'

import React from 'react'
import { usePathname } from 'next/navigation'
import { ClientLayout } from './client-layout'

interface ConditionalClientLayoutProps {
  children: React.ReactNode
}

export function ConditionalClientLayout({ children }: ConditionalClientLayoutProps) {
  const pathname = usePathname()
  
  // Check if current route is a dashboard route
  const isDashboardRoute = pathname?.startsWith('/dashboard')
  
  // For dashboard routes, don't wrap with AppLayout here since it's in dashboard layout
  if (isDashboardRoute) {
    return <>{children}</>
  }
  
  // For all other routes, wrap with ClientLayout
  return (
    <ClientLayout>
      {children}
    </ClientLayout>
  )
}