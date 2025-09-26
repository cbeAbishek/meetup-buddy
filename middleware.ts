import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  // Create response that will be modified for setting cookies
  let res = NextResponse.next({
    request: {
      headers: req.headers,
    },
  })

  // Skip middleware for static files and API routes
  if (
    req.nextUrl.pathname.startsWith('/_next/') ||
    req.nextUrl.pathname.startsWith('/api/') ||
    req.nextUrl.pathname.includes('.') ||
    req.nextUrl.pathname === '/favicon.ico'
  ) {
    return res
  }

  // Create a Supabase client for server-side use
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return req.cookies.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          // Update the request cookies for the current request
          req.cookies.set({
            name,
            value,
            ...options,
          })
          
          // Set the cookie in the response
          res = NextResponse.next({
            request: {
              headers: req.headers,
            },
          })
          res.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: any) {
          // Remove from request cookies
          req.cookies.set({
            name,
            value: '',
            ...options,
          })
          
          // Remove from response cookies
          res = NextResponse.next({
            request: {
              headers: req.headers,
            },
          })
          res.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  try {
    // Refresh the session if expired
    const {
      data: { session },
      error
    } = await supabase.auth.getSession()

    if (error) {
      console.error('Middleware session error:', error)
    }

    // Protected routes - require authentication
    const protectedRoutes = ['/dashboard']
    const isProtectedRoute = protectedRoutes.some(route => 
      req.nextUrl.pathname.startsWith(route)
    )

    // Public routes - redirect to dashboard if authenticated
    const publicOnlyRoutes = ['/auth']
    const isPublicOnlyRoute = publicOnlyRoutes.some(route => 
      req.nextUrl.pathname.startsWith(route)
    )

    // If user is not signed in and trying to access protected route
    if (!session && isProtectedRoute) {
      const redirectUrl = new URL('/auth', req.url)
      const target = `${req.nextUrl.pathname}${req.nextUrl.search}`
      redirectUrl.searchParams.set('redirectTo', target)
      console.log('Redirecting unauthenticated user to:', redirectUrl.toString())
      return NextResponse.redirect(redirectUrl)
    }

    // If user is signed in and trying to access public-only routes
    if (session && isPublicOnlyRoute) {
      const redirectTo = req.nextUrl.searchParams.get('redirectTo') || '/dashboard'
      const redirectUrl = new URL(redirectTo, req.url)
      console.log('Redirecting authenticated user to:', redirectUrl.toString())
      return NextResponse.redirect(redirectUrl)
    }

    return res
  } catch (error) {
    console.error('Middleware error:', error)
    // On error, allow the request to proceed
    return res
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}