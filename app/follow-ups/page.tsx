"use client"
import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function FollowUpsRedirect() {
  const router = useRouter()
  useEffect(() => {
    router.replace('/dashboard/follow-ups')
  }, [router])
  return null
}
