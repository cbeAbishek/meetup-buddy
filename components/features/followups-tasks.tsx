'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { CheckSquare, Bell, Clock, Target } from 'lucide-react'

export function FollowupsTasks() {
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
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center">
                <CheckSquare className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-4xl font-bold text-slate-900">
                Follow-ups &{' '}
                <span className="bg-gradient-to-r from-orange-600 to-orange-400 bg-clip-text text-transparent">
                  Tasks
                </span>
              </h2>
            </div>
            
            <p className="text-xl text-slate-600 mb-8 leading-relaxed">
              Turn discussions into tracked action items. Ensure accountability and never let important tasks slip through the cracks.
            </p>

            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <Target className="w-6 h-6 text-orange-600 mt-1" />
                <div>
                  <h3 className="font-semibold text-slate-900 mb-2">Automatic Extraction</h3>
                  <p className="text-slate-600">AI identifies action items from meeting discussions</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <Bell className="w-6 h-6 text-teal-600 mt-1" />
                <div>
                  <h3 className="font-semibold text-slate-900 mb-2">Smart Reminders</h3>
                  <p className="text-slate-600">Contextual notifications based on deadlines and priorities</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <Clock className="w-6 h-6 text-blue-600 mt-1" />
                <div>
                  <h3 className="font-semibold text-slate-900 mb-2">Progress Tracking</h3>
                  <p className="text-slate-600">Visual progress indicators and completion analytics</p>
                </div>
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
            <div className="bg-gradient-to-br from-orange-50 to-orange-100/50 rounded-3xl p-8">
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold text-slate-900">Action Items</h4>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className="text-xs text-slate-600">3 of 5 completed</span>
                  </div>
                </div>
                
                <div className="space-y-3">
                  {[
                    { task: "Update project timeline", assignee: "Sarah", completed: true, priority: "high" },
                    { task: "Review design mockups", assignee: "Mike", completed: true, priority: "medium" },
                    { task: "Prepare demo data", assignee: "Alex", completed: true, priority: "low" },
                    { task: "Schedule client meeting", assignee: "You", completed: false, priority: "high" },
                    { task: "Document API changes", assignee: "Team", completed: false, priority: "medium" }
                  ].map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                      className={`flex items-center space-x-3 p-3 rounded-xl transition-all ${
                        item.completed 
                          ? 'bg-green-50 border border-green-200' 
                          : 'bg-slate-50 hover:bg-orange-50 border border-slate-200 hover:border-orange-200'
                      }`}
                    >
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                        item.completed 
                          ? 'bg-green-500 border-green-500' 
                          : 'border-slate-300 hover:border-orange-400'
                      }`}>
                        {item.completed && (
                          <CheckSquare className="w-2.5 h-2.5 text-white" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className={`font-medium ${item.completed ? 'text-green-800 line-through' : 'text-slate-900'}`}>
                          {item.task}
                        </p>
                        <div className="flex items-center space-x-2 text-xs">
                          <span className={item.completed ? 'text-green-600' : 'text-slate-600'}>
                            {item.assignee}
                          </span>
                          <div className={`w-2 h-2 rounded-full ${
                            item.priority === 'high' ? 'bg-red-400' :
                            item.priority === 'medium' ? 'bg-yellow-400' : 'bg-green-400'
                          }`} />
                        </div>
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