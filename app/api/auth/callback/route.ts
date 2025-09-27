import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'

function parseCookies(cookieHeader: string | null) {
  const cookieMap = new Map<string, string>()

  if (!cookieHeader) {
    return cookieMap
  }

  for (const part of cookieHeader.split(';')) {
    const [name, ...rest] = part.trim().split('=')
    if (!name) continue
    const value = rest.join('=')
    cookieMap.set(name, decodeURIComponent(value))
  }

  return cookieMap
}

export async function POST(request: Request) {
  try {
    const { event, session } = await request.json()
    const requestCookies = parseCookies(request.headers.get('cookie'))

    const response = NextResponse.json({ success: true })

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return requestCookies.get(name)
          },
          set(name: string, value: string, options: any) {
            response.cookies.set({
              name,
              value,
              ...options,
            })
          },
          remove(name: string, options: any) {
            response.cookies.set({
              name,
              value: '',
              ...options,
            })
          },
        },
      }
    )

    if (event === 'SIGNED_OUT') {
      await supabase.auth.signOut()
    }

    if (session?.access_token && session?.refresh_token) {
      await supabase.auth.setSession({
        access_token: session.access_token,
        refresh_token: session.refresh_token,
      })
    }

    return response
  } catch (error) {
    console.error('Auth callback error:', error)
    return NextResponse.json({ success: false, error: String(error) }, { status: 400 })
  }
}
