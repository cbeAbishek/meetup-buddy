"use client"

import React, { useState } from 'react'

export default function ContactForm() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState<'idle'|'sending'|'sent'|'error'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('sending')
    try {
      // placeholder: normally post to an API route
      await new Promise((r) => setTimeout(r, 700))
      setStatus('sent')
      setName('')
      setEmail('')
      setMessage('')
    } catch (err) {
      setStatus('error')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
      <label className="flex flex-col text-sm">
        <span className="mb-1 text-slate-700">Name</span>
        <input value={name} onChange={(e) => setName(e.target.value)} className="border rounded px-3 py-2" />
      </label>

      <label className="flex flex-col text-sm">
        <span className="mb-1 text-slate-700">Email</span>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="border rounded px-3 py-2" />
      </label>

      <label className="flex flex-col text-sm">
        <span className="mb-1 text-slate-700">Message</span>
        <textarea value={message} onChange={(e) => setMessage(e.target.value)} className="border rounded px-3 py-2 h-32" />
      </label>

      <div className="flex items-center justify-between">
        <div className="text-sm text-slate-600">
          {status === 'sent' ? 'Thanks — we will be in touch!' : ''}
          {status === 'error' ? 'Something went wrong. Try again later.' : ''}
        </div>
        <button type="submit" className="bg-[color:var(--primary)] text-white px-4 py-2 rounded">
          {status === 'sending' ? 'Sending...' : 'Send Message'}
        </button>
      </div>
    </form>
  )
}
