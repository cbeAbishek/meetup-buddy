'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { PenTool, FileText, Search, Users } from 'lucide-react'

export function AgendaNotesSection() {
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
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center">
                <PenTool className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-4xl font-bold text-slate-900">
                Agenda &{' '}
                <span className="bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                  Notes
                </span>
              </h2>
            </div>
            
            <p className="text-xl text-slate-600 mb-8 leading-relaxed">
              Capture agendas, notes, and action points seamlessly during your meetings. Never miss important details or decisions again.
            </p>

            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <FileText className="w-6 h-6 text-blue-600 mt-1" />
                <div>
                  <h3 className="font-semibold text-slate-900 mb-2">Smart Templates</h3>
                  <p className="text-slate-600">Pre-built agenda templates for different meeting types</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <PenTool className="w-6 h-6 text-teal-600 mt-1" />
                <div>
                  <h3 className="font-semibold text-slate-900 mb-2">Real-time Collaboration</h3>
                  <p className="text-slate-600">Multiple team members can edit notes simultaneously</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <Search className="w-6 h-6 text-purple-600 mt-1" />
                <div>
                  <h3 className="font-semibold text-slate-900 mb-2">Searchable History</h3>
                  <p className="text-slate-600">Find any note or decision from past meetings instantly</p>
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
            <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-3xl p-8">
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold text-slate-900">Weekly Planning</h4>
                  <Users className="w-5 h-5 text-blue-600" />
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h5 className="font-medium text-slate-800 mb-2">Agenda</h5>
                    <div className="space-y-2">
                      {[
                        "Review Q4 objectives",
                        "Discuss upcoming product launch",
                        "Team capacity planning"
                      ].map((item, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: 20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                          className="flex items-center space-x-2"
                        >
                          <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                          <span className="text-sm text-slate-600">{item}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="border-t border-slate-100 pt-4">
                    <h5 className="font-medium text-slate-800 mb-2">Action Items</h5>
                    <div className="space-y-2">
                      {[
                        { task: "Update marketing materials", assignee: "Sarah" },
                        { task: "Prepare demo environment", assignee: "Mike" }
                      ].map((item, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: 20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
                          className="flex items-center justify-between text-sm"
                        >
                          <span className="text-slate-600">{item.task}</span>
                          <span className="text-blue-600 font-medium">{item.assignee}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}