'use client'

import React from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { useAuth } from '@/lib/auth-context'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export function AuthNavigation() {
  const { user, signOut, loading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  const handleSignOut = async () => {
    try {
      console.log('User initiated sign out')
      await signOut()
      // Force navigation to home page after sign out
      router.push('/')
      // Force page refresh to ensure clean state
      window.location.href = '/'
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  // Show loading skeleton
  if (loading) {
    return (
      <div className="flex items-center gap-3">
        <motion.div 
          className="h-3 w-16 bg-teal-100 rounded-full"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
        />
        <motion.div 
          className="h-8 w-20 bg-teal-100 rounded-full"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut", delay: 0.2 }}
        />
      </div>
    )
  }

  // Show authenticated user navigation
  if (user) {
    const displayName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'User'
    const userInitials = displayName.charAt(0).toUpperCase()

    return (
      <motion.div 
        className="flex items-center gap-3"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        {/* Flowing Dashboard link */}
        {!pathname.startsWith('/dashboard') && (
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <Link 
              href="/dashboard" 
              className="group relative px-5 py-2.5 text-sm font-semibold text-teal-600 hover:text-white transition-all duration-500 rounded-2xl overflow-hidden"
            >
              <span className="relative z-20">Dashboard</span>
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-teal-400 to-teal-500 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-500"
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              />
            </Link>
          </motion.div>
        )}

        {/* Flowing User avatar */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <motion.div
              whileHover={{ scale: 1.08, rotate: 2 }}
              whileTap={{ scale: 0.92 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <Button variant="ghost" className="relative h-11 w-11 rounded-2xl p-0 hover:bg-teal-50/80 transition-all duration-500 group">
                <div className="absolute inset-0 bg-gradient-to-br from-teal-200/20 to-teal-300/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-500 blur-sm"></div>
                <Avatar className="h-9 w-9 ring-2 ring-transparent hover:ring-teal-200 transition-all duration-500 group-hover:shadow-lg group-hover:shadow-teal-500/25">
                  <AvatarImage src={user.user_metadata?.avatar_url} alt={displayName} />
                  <AvatarFallback className="bg-gradient-to-br from-teal-400 to-teal-500 text-white font-bold text-sm rounded-xl">
                    {userInitials}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </motion.div>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-52 bg-white/90 backdrop-blur-xl border border-teal-100/60 shadow-2xl rounded-3xl overflow-hidden" align="end" forceMount>
            <div className="p-4 bg-gradient-to-br from-teal-50/50 to-white border-b border-teal-100/50">
              <p className="font-bold text-slate-900 text-sm">{displayName}</p>
              <p className="text-xs text-slate-500 truncate mt-1">
                {user.email}
              </p>
            </div>
            <div className="p-2">
              <DropdownMenuItem asChild className="group">
                <Link href="/dashboard" className="flex items-center px-4 py-3 text-sm font-medium text-slate-700 hover:text-teal-700 hover:bg-teal-50 rounded-2xl cursor-pointer transition-all duration-300">
                  Dashboard
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="group">
                <Link href="/dashboard/settings" className="flex items-center px-4 py-3 text-sm font-medium text-slate-700 hover:text-teal-700 hover:bg-teal-50 rounded-2xl cursor-pointer transition-all duration-300">
                  Settings
                </Link>
              </DropdownMenuItem>
              <div className="border-t border-teal-100/60 mt-2 pt-2">
                <DropdownMenuItem onClick={handleSignOut} className="flex items-center px-4 py-3 text-sm font-semibold text-red-600 hover:text-red-700 hover:bg-red-50 rounded-2xl cursor-pointer transition-all duration-300">
                  Sign out
                </DropdownMenuItem>
              </div>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </motion.div>
    )
  }

  // Show flowing sign in/up options for unauthenticated users
  return (
    <motion.div 
      className="flex items-center gap-3"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
      >
        <Link
          href="/auth"
          className="px-5 py-2.5 text-sm font-semibold text-teal-600 hover:text-teal-700 hover:bg-teal-50 rounded-2xl transition-all duration-500"
        >
          Sign in
        </Link>
      </motion.div>
      <motion.div
        whileHover={{ scale: 1.08, y: -2 }}
        whileTap={{ scale: 0.92 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
      >
        <Link
          href="/auth"
          className="px-6 py-2.5 bg-gradient-to-r from-teal-400 to-teal-500 hover:from-teal-500 hover:to-teal-600 text-white text-sm font-bold rounded-2xl shadow-lg hover:shadow-xl hover:shadow-teal-500/30 transition-all duration-500"
        >
          Get started
        </Link>
      </motion.div>
    </motion.div>
  )
}