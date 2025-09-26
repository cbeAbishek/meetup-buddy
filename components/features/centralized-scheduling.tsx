'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Calendar, Shield, PenTool, Users, CheckSquare, FileText, Zap } from 'lucide-react'

export function CentralizedScheduling() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-teal-600 rounded-2xl flex items-center justify-center">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-4xl font-bold text-slate-900">
                Centralized{' '}
                <span className="bg-gradient-to-r from-teal-600 to-teal-400 bg-clip-text text-transparent">
                  Scheduling
                </span>
              </h2>
            </div>
            
            <p className="text-xl text-slate-600 mb-8 leading-relaxed">
              Manage all your meetings from one intuitive dashboard. Never lose track of upcoming meetings or important discussions again.
            </p>

            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
                <span className="text-slate-700">Unified calendar view across all platforms</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
                <span className="text-slate-700">Smart scheduling recommendations</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
                <span className="text-slate-700">Drag and drop meeting management</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="bg-gradient-to-br from-teal-50 to-teal-100/50 rounded-3xl p-8">
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <h4 className="font-semibold text-slate-900 mb-4">Today's Schedule</h4>
                <div className="space-y-3">
                  {[
                    { time: "9:00 AM", title: "Team Standup", color: "teal" },
                    { time: "11:30 AM", title: "Client Review", color: "blue" },
                    { time: "2:00 PM", title: "Design Sprint", color: "purple" },
                    { time: "4:00 PM", title: "Weekly Retrospective", color: "orange" }
                  ].map((meeting, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                      className="flex items-center space-x-3 p-3 hover:bg-teal-50 rounded-xl transition-colors"
                    >
                      <div className={`w-3 h-3 bg-${meeting.color}-400 rounded-full`}></div>
                      <div>
                        <p className="font-medium text-slate-900">{meeting.title}</p>
                        <p className="text-sm text-slate-500">{meeting.time}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}