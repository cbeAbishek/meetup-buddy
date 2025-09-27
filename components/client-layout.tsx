'use client'

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { AuthNavigation } from '@/components/auth-navigation'
import { Footer } from '@/components/footer'
import { useSessionPersistence } from '@/hooks/use-session-persistence'

interface ClientLayoutProps {
  children: React.ReactNode
}

export function ClientLayout({ children }: ClientLayoutProps) {
  // Initialize session persistence
  useSessionPersistence()

  const navItems = [
    { href: "/features", label: "Features" },
    { href: "/pricing", label: "Pricing" },
    { href: "/contact", label: "Contact" }
  ]

  return (
    <>
      {/* Flowing Teal-themed Header with Enhanced Background */}
      <motion.header 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed w-full top-0 z-50 pt-10"
      >
        {/* Floating navbar container with flowing design */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 300, damping: 30 }}
          className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12"
        >
          <div className="bg-white/20 backdrop-blur-md border border-teal-200/40 shadow-2xl shadow-teal-600/50 rounded-3xl mx-4 relative overflow-hidden">
            {/* Animated gradient background */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-teal-50/60 via-white/40 to-teal-50/60 opacity-70"
              animate={{ 
                background: [
                  "linear-gradient(90deg, rgba(240, 253, 250, 0.23) 0%, rgba(255,255,255,0.4) 50%, rgba(240, 253, 250, 0.08) 100%)",
                  "linear-gradient(90deg, rgba(240, 253, 250, 0.11) 0%, rgba(240,253,250,0.6) 50%, rgba(255,255,255,0.4) 100%)",
                  "linear-gradient(90deg, rgba(255, 255, 255, 0.16) 0%, rgba(240,253,250,0.6) 50%, rgba(240,253,250,0.4) 100%)"
                ]
              }}
              transition={{ duration: 8, repeat: Infinity, repeatType: "reverse" }}
            />
            
            <div className="relative flex items-center justify-between h-20 px-8">
              {/* Flowing Logo Section */}
              <motion.div
                className="flex items-center"
                whileHover={{ scale: 1.03 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <Link href="/" className="group flex items-center space-x-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-3xl overflow-hidden flex items-center justify-center group-hover:shadow-xl group-hover:shadow-teal-500/30 transition-all duration-500 group-hover:rotate-3">
                      <img
                        src="/logo.png"
                        alt="Meetup Buddy logo"
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                    <span className="text-2xl font-bold text-slate-900 group-hover:text-teal-600 transition-all duration-500 tracking-tight">
                      Meetup Buddy
                    </span>
                  </div>
                </Link>
              </motion.div>

              {/* Enhanced Flowing Navigation Links */}
              <nav className="hidden md:flex items-center space-x-3 bg-teal-50/80 px-4 py-2 rounded-3xl backdrop-blur-sm border border-teal-100/60">
                {navItems.map((item, index) => (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 + 0.4 }}
                  >
                    <Link
                      href={item.href}
                      className="group relative px-8 py-4 text-sm font-semibold text-slate-700 hover:text-white transition-all duration-500 rounded-3xl overflow-hidden"
                    >
                      <span className="relative z-20">{item.label}</span>
                      
                      {/* Enhanced flowing background effect */}
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600 rounded-3xl opacity-0 group-hover:opacity-100 transition-all duration-500"
                        whileHover={{ scale: 1.1 }}
                        transition={{ type: "spring", stiffness: 400, damping: 17 }}
                      />
                      
                      {/* Enhanced glow effect */}
                      <motion.div
                        className="absolute inset-0 bg-teal-300/30 rounded-3xl opacity-0 group-hover:opacity-100 blur-xl transition-all duration-500"
                        whileHover={{ scale: 1.4 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      />
                      
                      {/* Enhanced flowing underline */}
                      <motion.div
                        className="absolute -bottom-3 left-1/2 w-0 h-1.5 bg-gradient-to-r from-teal-400 to-teal-600 group-hover:w-16 group-hover:-translate-x-1/2 transition-all duration-500 rounded-full"
                      />
                    </Link>
                  </motion.div>
                ))}
              </nav>

              {/* Enhanced Flowing Auth Navigation */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6, type: "spring", stiffness: 300, damping: 30 }}
                className="bg-white/80 backdrop-blur-xl rounded-3xl px-3 py-2 shadow-lg border border-teal-200/50"
              >
                <AuthNavigation />
              </motion.div>
            </div>
          </div>
        </motion.div>
        
        {/* Enhanced flowing bottom accent */}
        <motion.div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2/5 h-1 bg-gradient-to-r from-transparent via-teal-400/40 to-transparent rounded-full mt-4"
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ delay: 1, duration: 1.5, ease: "easeOut" }}
        />
      </motion.header>

      {/* Content with proper spacing for enhanced floating header */}
      <main className="min-h-screen pt-32">{children}</main>

      {/* Footer */}
      <Footer />
    </>
  )
}