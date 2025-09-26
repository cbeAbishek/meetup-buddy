import React from 'react'
import ContactForm from '@/components/contact/ContactForm'

export const metadata = {
  title: 'Contact — Meetup Buddy',
  description: 'Get in touch with the Meetup Buddy team',
}

export default function ContactPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-background py-16">
      <div className="w-full max-w-3xl px-6">
        <h1 className="text-4xl font-bold text-center mb-6">Contact</h1>
        <p className="text-center text-sm text-slate-600 mb-8">
          Have a question, feedback, or need help integrating Meetup Buddy? Send us a message and we’ll respond shortly.
        </p>

        <div className="bg-white shadow rounded-lg p-6">
          <ContactForm />
        </div>
      </div>
    </main>
  )
}
