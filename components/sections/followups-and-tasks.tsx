'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { CheckSquare, Bell, Clock, ArrowRight } from 'lucide-react'

export function FollowupsAndTasks() {
  const tasks = [
    { task: "Review Q4 budget proposal", assignee: "Sarah Chen", due: "Tomorrow", priority: "high" },
    { task: "Update client presentation", assignee: "Mike Johnson", due: "Nov 15", priority: "medium" },
    { task: "Schedule team retrospective", assignee: "You", due: "Next week", priority: "low" }
  ]

  return (
    <section className="py-24 bg-gradient-to-b from-white to-teal-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
              Follow-ups &{' '}
              <span className="bg-gradient-to-r from-teal-600 to-teal-400 bg-clip-text text-transparent">
                Tasks
              </span>
            </h2>
            <p className="text-xl text-slate-600 mb-10 leading-relaxed">
              Never let important action items slip through the cracks. Our smart follow-up system ensures accountability and progress tracking.
            </p>

            <div className="space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="flex items-start space-x-4"
              >
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-teal-100 to-teal-200 rounded-2xl flex items-center justify-center">
                  <CheckSquare className="w-6 h-6 text-teal-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">Automatic Task Creation</h3>
                  <p className="text-slate-600 leading-relaxed">
                    AI automatically identifies action items from meeting discussions and creates trackable tasks.
                  </p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="flex items-start space-x-4"
              >
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center">
                  <Bell className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">Smart Reminders</h3>
                  <p className="text-slate-600 leading-relaxed">
                    Intelligent reminder system that adapts to your work patterns and project deadlines.
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
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl flex items-center justify-center">
                  <Clock className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">Progress Tracking</h3>
                  <p className="text-slate-600 leading-relaxed">
                    Monitor task completion rates and get insights into team productivity patterns.
                  </p>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Task Management Visual */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-teal-100/60">
              {/* Header */}
              <div className="bg-gradient-to-r from-teal-500 to-teal-600 px-6 py-4">
                <h4 className="text-lg font-semibold text-white">Action Items</h4>
                <p className="text-teal-100 text-sm">From today's standup meeting</p>
              </div>

              {/* Tasks List */}
              <div className="p-6 space-y-4">
                {tasks.map((task, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
                    className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl hover:bg-teal-50 transition-colors duration-300 group"
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${
                        task.priority === 'high' ? 'bg-red-400' :
                        task.priority === 'medium' ? 'bg-yellow-400' : 'bg-green-400'
                      }`} />
                      <div>
                        <p className="font-medium text-slate-900 group-hover:text-teal-700 transition-colors">
                          {task.task}
                        </p>
                        <p className="text-sm text-slate-600">
                          {task.assignee} • Due {task.due}
                        </p>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-teal-500 transition-colors" />
                  </motion.div>
                ))}
              </div>

              {/* Footer */}
              <div className="px-6 py-4 bg-teal-50/50 border-t border-teal-100">
                <p className="text-sm text-teal-600 font-medium">3 of 8 tasks completed this week</p>
              </div>
            </div>

            {/* Floating notification */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="absolute -top-4 -right-4 bg-teal-500 text-white rounded-2xl px-4 py-2 shadow-lg"
            >
              <div className="flex items-center space-x-2">
                <Bell className="w-4 h-4" />
                <span className="text-sm font-medium">2 due today</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}