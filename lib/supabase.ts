import { createClient } from '@supabase/supabase-js'

// Read public Supabase keys from environment. These are safe to expose
// to the browser (anon/public keys) and should be prefixed with NEXT_PUBLIC_
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''

if (!supabaseUrl || !supabaseAnonKey) {
  if (process.env.NODE_ENV !== 'production') {
    // eslint-disable-next-line no-console
    console.warn(
      'Missing Supabase env vars: set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local'
    )
  }
}

// Create and export a single Supabase client for the app to import.
// Use the public anon key for client-side usage. For server-side operations
// that require elevated privileges use a service_role key on the server only.
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export default supabase

// Helpful exports for runtime checks in client code
export const SUPABASE_URL = supabaseUrl
export const SUPABASE_ANON_KEY = supabaseAnonKey
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey)
