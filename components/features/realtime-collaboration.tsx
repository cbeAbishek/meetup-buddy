'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Zap, Users, RefreshCw, Wifi } from 'lucide-react'

export function RealtimeCollaboration() {
  return (
    <section className="py-24 bg-gradient-to-b from-teal-50/30 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="bg-white rounded-3xl shadow-2xl p-8 border border-teal-100/60 relative overflow-hidden">
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute top-4 right-4 w-3 h-3 bg-green-400 rounded-full"
              />
              <div className="flex items-center space-x-2 mb-6">
                <Wifi className="w-5 h-5 text-teal-600" />
                <span className="text-sm font-medium text-teal-600">Live Collaboration</span>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-xs text-white font-medium">SJ</span>
                  </div>
                  <div className="flex-1">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: "100%" }}
                      viewport={{ once: true }}
                      transition={{ duration: 2, delay: 0.5 }}
                      className="h-2 bg-blue-100 rounded-full overflow-hidden"
                    >
                      <div className="h-full bg-blue-500 rounded-full w-3/4" />
                    </motion.div>
                    <span className="text-xs text-slate-600 mt-1">Sarah is editing agenda...</span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                    <span className="text-xs text-white font-medium">MK</span>
                  </div>
                  <div className="flex-1">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: "100%" }}
                      viewport={{ once: true }}
                      transition={{ duration: 2, delay: 1 }}
                      className="h-2 bg-purple-100 rounded-full overflow-hidden"
                    >
                      <div className="h-full bg-purple-500 rounded-full w-1/2" />
                    </motion.div>
                    <span className="text-xs text-slate-600 mt-1">Mike added action item</span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-teal-500 rounded-full flex items-center justify-center">
                    <span className="text-xs text-white font-medium">You</span>
                  </div>
                  <div className="flex-1">
                    <motion.div
                      animate={{ opacity: [1, 0.5, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="h-0.5 bg-teal-500 rounded-full w-4"
                    />
                    <span className="text-xs text-slate-600 mt-1">Currently typing...</span>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 pt-4 border-t border-slate-100">
                <div className="flex items-center space-x-2">
                  <RefreshCw className="w-4 h-4 text-teal-600 animate-spin" />
                  <span className="text-xs text-teal-600">Syncing changes...</span>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-teal-600 rounded-2xl flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-4xl font-bold text-slate-900">
                <span className="bg-gradient-to-r from-teal-600 to-teal-400 bg-clip-text text-transparent">
                  Realtime
                </span>{' '}
                Collaboration
              </h2>
            </div>
            
            <p className="text-xl text-slate-600 mb-8 leading-relaxed">
              Updates sync instantly across your team. See changes in real-time as they happen, ensuring everyone stays on the same page.
            </p>

            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <Zap className="w-6 h-6 text-teal-600 mt-1" />
                <div>
                  <h3 className="font-semibold text-slate-900 mb-2">Instant Sync</h3>
                  <p className="text-slate-600">Changes appear instantly across all connected devices</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <Users className="w-6 h-6 text-blue-600 mt-1" />
                <div>
                  <h3 className="font-semibold text-slate-900 mb-2">Live Cursors</h3>
                  <p className="text-slate-600">See who's editing what in real-time with live user cursors</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <RefreshCw className="w-6 h-6 text-purple-600 mt-1" />
                <div>
                  <h3 className="font-semibold text-slate-900 mb-2">Conflict Resolution</h3>
                  <p className="text-slate-600">Smart merge system handles simultaneous edits seamlessly</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}