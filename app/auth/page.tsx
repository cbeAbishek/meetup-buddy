"use client"

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import AuthForm from '@/components/auth/AuthForm'
import { useAuthRedirect } from '@/hooks/use-auth-redirect'

export default function AuthPage() {
  useAuthRedirect()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-teal-50/30 relative overflow-hidden">
      {/* Back Button */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="absolute top-6 left-6 z-20"
      >
        <Link
          href="/"
          className="flex items-center space-x-2 px-4 py-2 bg-white/80 backdrop-blur-md border border-slate-200 rounded-xl shadow-lg hover:shadow-xl text-slate-700 hover:text-teal-600 transition-all duration-300 group"
        >
          <motion.div
            whileHover={{ x: -2 }}
            transition={{ duration: 0.2 }}
          >
            <ArrowLeft className="w-4 h-4" />
          </motion.div>
          <span className="text-sm font-medium">Back to Home</span>
        </Link>
      </motion.div>

      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-teal-200/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-teal-100/30 rounded-full blur-3xl animate-pulse delay-500" />
      </div>

      <div className="grid min-h-screen lg:grid-cols-2 relative z-10">
        {/* Left Side - Auth Form */}
        <div className="flex flex-col gap-8 p-6 md:p-10 lg:p-16 justify-center">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center lg:text-left"
          >
            <div className="flex items-center justify-center lg:justify-start space-x-3 mb-6">
              <div className="w-12 h-12 rounded-2xl overflow-hidden flex items-center justify-center shadow-lg">
                <img
                  src="/logo.png"
                  alt="Meetup Buddy logo"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <h1 className="text-2xl font-bold text-slate-900">
                Meetup Buddy
              </h1>
            </div>
            {/* <motion.h2
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4"
            >
              Transform Your Meetings
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="text-slate-600 text-lg leading-relaxed max-w-md mx-auto lg:mx-0"
            >
              Smart scheduling, intelligent agendas, and seamless follow-ups for teams that value their time.
            </motion.p> */}
          </motion.div>

          {/* Auth Form */}
          <div className="flex-1 flex items-center justify-center w-full max-w-2xl mx-auto">
            <AuthForm />
          </div>

          {/* Features List */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="hidden lg:block"
          >
            <div className="grid grid-cols-1 gap-4 max-w-lg">
              {[
                { icon: "📅", text: "Intelligent scheduling that finds the perfect time for everyone" },
                { icon: "📝", text: "AI-powered agenda generation and smart note-taking" },
                { icon: "🔄", text: "Automated follow-ups and task tracking" }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1 + index * 0.1, duration: 0.4 }}
                  className="flex items-center space-x-3 text-slate-700 p-3 rounded-lg bg-white/50 backdrop-blur-sm"
                >
                  <span className="text-2xl">{feature.icon}</span>
                  <span className="text-sm">{feature.text}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Right Side - Hero Image */}
        <div className="relative hidden lg:flex items-center justify-center bg-gradient-to-br from-teal-100/50 to-teal-200/30">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="relative z-10 max-w-lg"
          >
            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80"
                alt="Team meeting"
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-teal-600/20 to-transparent" />
            </div>
            
            {/* Floating Cards */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.6 }}
              className="absolute -top-4 -left-4 bg-white rounded-2xl p-4 shadow-xl border border-teal-200"
            >
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-teal-500 rounded-full animate-pulse" />
                <span className="text-sm font-semibold text-slate-700">Meeting in progress</span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.4, duration: 0.6 }}
              className="absolute -bottom-4 -right-4 bg-white rounded-2xl p-4 shadow-xl border border-teal-200"
            >
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-teal-600">✓</span>
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-700">Tasks Created</div>
                  <div className="text-xs text-slate-500">3 action items</div>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Background Decoration */}
          <div className="absolute top-20 right-20 w-32 h-32 bg-teal-300/20 rounded-full blur-2xl animate-pulse" />
          <div className="absolute bottom-32 left-20 w-24 h-24 bg-blue-300/20 rounded-full blur-2xl animate-pulse delay-700" />
        </div>
      </div>
    </div>
  )
}
