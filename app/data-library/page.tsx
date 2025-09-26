"use client"
import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function DataLibraryRedirect() {
  const router = useRouter()
  useEffect(() => {
    router.replace('/dashboard/data-library')
  }, [router])
  return null
}
