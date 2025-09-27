'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronRight, Home } from 'lucide-react'
import { cn } from '@/lib/utils'

interface BreadcrumbItem {
  label: string
  href?: string
}

interface DashboardBreadcrumbProps {
  className?: string
  items?: BreadcrumbItem[]
}

export function DashboardBreadcrumb({ className, items }: DashboardBreadcrumbProps) {
  const pathname = usePathname()

  // Auto-generate breadcrumb from pathname if no items provided
  const breadcrumbItems = items || React.useMemo(() => {
    const segments = pathname.split('/').filter(Boolean)
    const breadcrumbs: BreadcrumbItem[] = [
      { label: 'Dashboard', href: '/dashboard' }
    ]

    if (segments.length > 1) {
      const pageName = segments[segments.length - 1]
      const formattedName = pageName
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
      
      breadcrumbs.push({ 
        label: formattedName,
        href: pathname
      })
    }

    return breadcrumbs
  }, [pathname, items])

  if (breadcrumbItems.length <= 1) {
    return null
  }

  return (
    <nav className={cn("flex items-center space-x-1 text-sm text-muted-foreground", className)}>
      <Home className="h-3 w-3" />
      {breadcrumbItems.map((item, index) => (
        <React.Fragment key={index}>
          {index > 0 && <ChevronRight className="h-3 w-3" />}
          {item.href && index < breadcrumbItems.length - 1 ? (
            <Link
              href={item.href}
              className="hover:text-teal-600 transition-colors font-medium"
            >
              {item.label}
            </Link>
          ) : (
            <span className={cn(
              index === breadcrumbItems.length - 1 
                ? "text-teal-600 dark:text-teal-400 font-medium" 
                : "font-medium"
            )}>
              {item.label}
            </span>
          )}
        </React.Fragment>
      ))}
    </nav>
  )
}