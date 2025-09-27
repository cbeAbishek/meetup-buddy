'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export interface Profile {
  id: string
  email: string
  full_name: string | null
  role: 'presenter' | 'listener'
  avatar_url: string | null
  created_at: string
  updated_at: string
}

interface UseProfilesReturn {
  profiles: Profile[]
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
}

export function useProfiles(): UseProfilesReturn {
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchProfiles = async () => {
    try {
      setLoading(true)
      setError(null)

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('full_name', { ascending: true })

      if (error) {
        throw error
      }

      setProfiles(data || [])
    } catch (err: any) {
      console.error('Error fetching profiles:', err)
      setError(err.message || 'Failed to fetch profiles')
      // Provide fallback mock data
      setProfiles([
        {
          id: 'mock-1',
          email: 'john.doe@example.com',
          full_name: 'John Doe',
          role: 'presenter',
          avatar_url: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: 'mock-2',
          email: 'jane.smith@example.com',
          full_name: 'Jane Smith',
          role: 'listener',
          avatar_url: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: 'mock-3',
          email: 'mike.johnson@example.com',
          full_name: 'Mike Johnson',
          role: 'presenter',
          avatar_url: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  const refetch = async () => {
    await fetchProfiles()
  }

  useEffect(() => {
    fetchProfiles()
  }, [])

  return {
    profiles,
    loading,
    error,
    refetch
  }
}