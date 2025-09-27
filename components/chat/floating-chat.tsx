"use client"

import React, { useEffect, useRef, useState } from 'react'
import { Chat } from '@/components/chat'

const STORAGE_KEY = 'meetupbuddy:floatingChatPos'

export default function FloatingChat() {
  const [open, setOpen] = useState(false)
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null)
  const buttonRef = useRef<HTMLButtonElement | null>(null)
  const draggingRef = useRef(false)
  const pointerStartRef = useRef<{ x: number; y: number } | null>(null)
  const posStartRef = useRef<{ x: number; y: number } | null>(null)

  // load saved position (pixels from left/top)
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) setPos(JSON.parse(raw))
    } catch (e) {
      // ignore
    }
  }, [])

  // ensure default pos if not set: bottom-right offset
  useEffect(() => {
    if (pos !== null) return
    const defaultPos = { x: window.innerWidth - 86, y: window.innerHeight - 86 }
    setPos(defaultPos)
  }, [pos])

  // persist position
  useEffect(() => {
    if (!pos) return
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(pos))
    } catch (e) {
      // ignore
    }
  }, [pos])

  const onPointerDown = (e: React.PointerEvent) => {
    // begin tracking for drag
    const btn = buttonRef.current
    if (!btn) return
    (e.target as Element).setPointerCapture(e.pointerId)
    draggingRef.current = false
    pointerStartRef.current = { x: e.clientX, y: e.clientY }
    posStartRef.current = pos

    const onMove = (ev: PointerEvent) => {
      if (!pointerStartRef.current || !posStartRef.current) return
      const dx = ev.clientX - pointerStartRef.current.x
      const dy = ev.clientY - pointerStartRef.current.y

      // start drag after small threshold
      if (!draggingRef.current) {
        if (Math.hypot(dx, dy) < 4) return
        draggingRef.current = true
      }

      // compute new pos and constrain to viewport with padding
      const padding = 8
      const btnW = btn.offsetWidth
      const btnH = btn.offsetHeight
      const maxX = Math.max(padding, window.innerWidth - btnW - padding)
      const maxY = Math.max(padding, window.innerHeight - btnH - padding)

      let nx = posStartRef.current.x + dx
      let ny = posStartRef.current.y + dy
      nx = Math.min(Math.max(padding, nx), maxX)
      ny = Math.min(Math.max(padding, ny), maxY)
      setPos({ x: nx, y: ny })
    }

    const onUp = (ev: PointerEvent) => {
      try { (e.target as Element).releasePointerCapture(e.pointerId) } catch {}
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)

      // if it wasn't a drag (tiny move), treat as click toggle
      if (!draggingRef.current) {
        setOpen((v) => !v)
      }

      draggingRef.current = false
      pointerStartRef.current = null
      posStartRef.current = null
    }

    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
  }

  // keyboard accessibility: pressing Enter/Space on the button toggles open
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      setOpen((v) => !v)
    }
  }

  if (!pos) return null

  return (
    <>
      {open && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center md:justify-end p-4">
          <div className="absolute inset-0 bg-black/30" onClick={() => setOpen(false)} />

          <div className="pointer-events-auto w-full max-w-md md:max-w-lg h-[70vh] md:h-[80vh] rounded-lg shadow-2xl overflow-hidden bg-white z-50 flex flex-col">
            <div className="flex items-center justify-between p-3 border-b">
              <div className="text-sm font-medium">AI Meeting Buddy</div>
              <div className="flex items-center gap-2">
                <button
                  aria-label="Close chat"
                  onClick={() => setOpen(false)}
                  className="p-2 rounded hover:bg-slate-100"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="flex-1 min-h-0">
              <Chat />
            </div>
          </div>
        </div>
      )}

      <button
        ref={buttonRef}
        aria-label="Open chat"
        onPointerDown={onPointerDown}
        onKeyDown={onKeyDown}
        className="fixed z-40 w-14 h-14 rounded-full bg-[color:var(--primary)] text-white shadow-lg flex items-center justify-center hover:scale-105 transition-transform touch-none"
        style={{ left: pos.x, top: pos.y }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
          <path d="M2.003 5.884C2 5.947 2 6.016 2 6.086V18a2 2 0 0 0 2 2h14l4 4V6.086c0-.07 0-.139-.003-.202A2 2 0 0 0 20 4H4a2 2 0 0 0-1.997 1.884z" />
        </svg>
      </button>
    </>
  )
}
