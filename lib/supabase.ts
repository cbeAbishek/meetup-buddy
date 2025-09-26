import { createClient } from '@supabase/supabase-js'

// Read public Supabase keys from environment. These are safe to expose
// to the browser (anon/public keys) and should be prefixed with NEXT_PUBLIC_
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

// Debug logging
if (process.env.NODE_ENV === 'development') {
  console.log('🔍 Environment variables check:', {
    supabaseUrl: supabaseUrl ? '✅ Present' : '❌ Missing',
    supabaseAnonKey: supabaseAnonKey ? '✅ Present' : '❌ Missing',
    supabaseServiceRoleKey: supabaseServiceRoleKey ? '✅ Present' : '❌ Missing'
  })
}

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    `Missing Supabase environment variables:\n` +
    `- NEXT_PUBLIC_SUPABASE_URL: ${supabaseUrl ? '✅' : '❌'}\n` +
    `- NEXT_PUBLIC_SUPABASE_ANON_KEY: ${supabaseAnonKey ? '✅' : '❌'}\n` +
    `Please check your .env.local file`
  )
}

// Client-side Supabase client (uses anon key)
export const supabase = createClient(supabaseUrl!, supabaseAnonKey!, {
  auth: {
    persistSession: true,
    storageKey: 'meetup-buddy-auth-token',
    storage: typeof window !== 'undefined' ? window.localStorage : undefined,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    // Configure the session to last longer and handle offline scenarios
    flowType: 'pkce'
  },
  global: {
    headers: {
      'X-Client-Info': 'meetup-buddy@1.0.0'
    }
  }
})

// Server-side Supabase client with service role key (for API routes)
export const supabaseAdmin = supabaseServiceRoleKey 
  ? createClient(supabaseUrl!, supabaseServiceRoleKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false
      },
      global: {
        headers: {
          'X-Client-Info': 'meetup-buddy-admin@1.0.0'
        }
      }
    })
  : null

export default supabase

// Helper function to get admin client with error handling
export function getSupabaseAdmin() {
  if (!supabaseAdmin) {
    throw new Error(
      'Supabase admin client is not configured. Please add SUPABASE_SERVICE_ROLE_KEY to your .env.local file'
    )
  }
  return supabaseAdmin
}

// Helpful exports for runtime checks in client code
export const SUPABASE_URL = supabaseUrl
export const SUPABASE_ANON_KEY = supabaseAnonKey
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey)
export const isSupabaseAdminConfigured = Boolean(supabaseServiceRoleKey)
