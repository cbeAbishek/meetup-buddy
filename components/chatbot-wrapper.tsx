'use client'

import { useEffect, useState } from 'react'
import MeetupBuddyChatbot from './meetup-buddy-chatbot'

export default function ChatbotWrapper() {
  const [currentPage, setCurrentPage] = useState('/')

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setCurrentPage(window.location.pathname)
    }
  }, [])

  return (
    <MeetupBuddyChatbot 
      defaultMinimized={true}
      showOnLandingPage={true}
      context={{
        currentPage
      }}
    />
  )
}