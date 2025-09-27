'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Clock, CheckCircle, AlertTriangle, Calendar } from 'lucide-react'

export function ConflictFreeScheduling() {
  return (
    <section className="py-24 bg-gradient-to-b from-teal-50/30 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Visual */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
              {/* Calendar Header */}
              <div className="bg-gradient-to-r from-teal-500 to-teal-600 px-6 py-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-lg font-semibold text-white">Team Availability</h4>
                  <Calendar className="w-5 h-5 text-teal-100" />
                </div>
              </div>
              
              {/* Calendar Grid */}
              <div className="p-6">
                <div className="grid grid-cols-7 gap-2 mb-4">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                    <div key={day} className="text-center text-sm font-medium text-slate-600 py-2">
                      {day}
                    </div>
                  ))}
                </div>
                
                <div className="grid grid-cols-7 gap-2">
                  {Array.from({ length: 35 }, (_, i) => {
                    const isAvailable = Math.random() > 0.3
                    const isSelected = i === 16 || i === 17
                    return (
                      <motion.div
                        key={i}
                        whileHover={{ scale: 1.1 }}
                        className={`aspect-square rounded-lg flex items-center justify-center text-sm font-medium cursor-pointer transition-all duration-200 ${
                          isSelected
                            ? 'bg-teal-500 text-white shadow-lg'
                            : isAvailable
                            ? 'bg-teal-50 hover:bg-teal-100 text-slate-700'
                            : 'bg-slate-100 text-slate-400'
                        }`}
                      >
                        {i + 1 <= 31 ? i + 1 : ''}
                      </motion.div>
                    )
                  })}
                </div>
              </div>
            </div>
            
            {/* Floating status indicators */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="absolute -top-4 -right-4 bg-white rounded-2xl shadow-lg p-3 border border-teal-100"
            >
              <CheckCircle className="w-6 h-6 text-green-500" />
            </motion.div>
            
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="absolute -bottom-4 -left-4 bg-white rounded-2xl shadow-lg p-3 border border-teal-100"
            >
              <Clock className="w-6 h-6 text-teal-500" />
            </motion.div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
              <span className="bg-gradient-to-r from-teal-600 to-teal-400 bg-clip-text text-transparent">
                Conflict-Free
              </span>{' '}
              Scheduling
            </h2>
            <p className="text-xl text-slate-600 mb-10 leading-relaxed">
              Our intelligent scheduling system automatically finds the best times for everyone, eliminating the back-and-forth of traditional meeting planning.
            </p>

            <div className="space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="flex items-start space-x-4"
              >
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-green-100 to-green-200 rounded-2xl flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">Smart Conflict Detection</h3>
                  <p className="text-slate-600 leading-relaxed">
                    Automatically identifies scheduling conflicts across all team members' calendars and suggests alternative times.
                  </p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="flex items-start space-x-4"
              >
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-teal-100 to-teal-200 rounded-2xl flex items-center justify-center">
                  <Clock className="w-6 h-6 text-teal-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">Optimal Time Suggestions</h3>
                  <p className="text-slate-600 leading-relaxed">
                    AI-powered recommendations that consider time zones, work preferences, and meeting urgency levels.
                  </p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="flex items-start space-x-4"
              >
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-amber-100 to-amber-200 rounded-2xl flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-amber-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">Real-time Updates</h3>
                  <p className="text-slate-600 leading-relaxed">
                    Get instant notifications when conflicts arise and receive updated scheduling recommendations.
                  </p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}