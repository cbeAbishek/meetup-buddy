'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Shield, AlertTriangle, CheckCircle, Clock } from 'lucide-react'

export function ConflictDetection() {
  return (
    <section className="py-24 bg-gradient-to-b from-white to-teal-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="bg-white rounded-3xl shadow-2xl p-8 border border-teal-100/60">
              <div className="flex items-center justify-between mb-6">
                <h4 className="text-lg font-semibold text-slate-900">Conflict Detection</h4>
                <Shield className="w-6 h-6 text-teal-600" />
              </div>
              
              <div className="space-y-4">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="flex items-start space-x-3 p-4 bg-green-50 rounded-2xl border border-green-200"
                >
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-green-800">Meeting Scheduled</p>
                    <p className="text-sm text-green-600">Team standup - 9:00 AM</p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="flex items-start space-x-3 p-4 bg-yellow-50 rounded-2xl border border-yellow-200"
                >
                  <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-yellow-800">Potential Conflict</p>
                    <p className="text-sm text-yellow-600">Overlaps with client call</p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="flex items-start space-x-3 p-4 bg-blue-50 rounded-2xl border border-blue-200"
                >
                  <Clock className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-blue-800">Suggested Alternative</p>
                    <p className="text-sm text-blue-600">10:30 AM - All attendees free</p>
                  </div>
                </motion.div>
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
              <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-4xl font-bold text-slate-900">
                <span className="bg-gradient-to-r from-red-600 to-red-400 bg-clip-text text-transparent">
                  Conflict
                </span>{' '}
                Detection
              </h2>
            </div>
            
            <p className="text-xl text-slate-600 mb-8 leading-relaxed">
              Avoid double-bookings and scheduling conflicts with our intelligent detection system that monitors all your calendars in real-time.
            </p>

            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <CheckCircle className="w-6 h-6 text-green-600 mt-1" />
                <div>
                  <h3 className="font-semibold text-slate-900 mb-2">Real-time Monitoring</h3>
                  <p className="text-slate-600">Continuously scans all connected calendars for potential conflicts</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <AlertTriangle className="w-6 h-6 text-yellow-600 mt-1" />
                <div>
                  <h3 className="font-semibold text-slate-900 mb-2">Smart Alerts</h3>
                  <p className="text-slate-600">Instant notifications when conflicts are detected</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <Clock className="w-6 h-6 text-blue-600 mt-1" />
                <div>
                  <h3 className="font-semibold text-slate-900 mb-2">Alternative Suggestions</h3>
                  <p className="text-slate-600">AI-powered recommendations for better meeting times</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}