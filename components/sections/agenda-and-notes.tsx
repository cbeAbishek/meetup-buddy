'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { PenTool, BookOpen, Search, Download } from 'lucide-react'

export function AgendaAndNotes() {
  const features = [
    {
      icon: PenTool,
      title: "Smart Note-Taking",
      description: "AI-powered notes that capture key points automatically during your meetings"
    },
    {
      icon: BookOpen,
      title: "Agenda Templates",
      description: "Pre-built templates for different meeting types to keep discussions focused"
    },
    {
      icon: Search,
      title: "Searchable History",
      description: "Find any discussion or decision from past meetings with powerful search"
    },
    {
      icon: Download,
      title: "Export & Share",
      description: "Export notes in multiple formats and share with team members instantly"
    }
  ]

  return (
    <section className="py-24 bg-white">
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
              Agenda & Notes{' '}
              <span className="bg-gradient-to-r from-teal-600 to-teal-400 bg-clip-text text-transparent">
                Made Simple
              </span>
            </h2>
            <p className="text-xl text-slate-600 mb-10 leading-relaxed">
              Transform your meetings with intelligent agenda planning and automated note-taking that ensures nothing important is ever missed.
            </p>

            <div className="space-y-6">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="flex items-start space-x-4 group"
                >
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-teal-100 to-teal-200 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <feature.icon className="w-6 h-6 text-teal-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-2 group-hover:text-teal-600 transition-colors duration-300">
                      {feature.title}
                    </h3>
                    <p className="text-slate-600 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Visual */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="bg-gradient-to-br from-teal-50 to-teal-100/50 rounded-3xl p-8 relative overflow-hidden">
              <div className="bg-white rounded-2xl shadow-xl p-6 relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold text-slate-900">Weekly Standup</h4>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-teal-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-teal-400 rounded-full"></div>
                    <span className="text-sm text-slate-600">Review last week's goals</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-teal-400 rounded-full"></div>
                    <span className="text-sm text-slate-600">Discuss current blockers</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                    <span className="text-sm text-slate-600">Plan upcoming sprint</span>
                  </div>
                </div>
              </div>
              
              {/* Floating elements */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute top-4 right-4 w-16 h-16 bg-teal-200/30 rounded-full blur-xl"
              />
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute bottom-4 left-4 w-20 h-20 bg-teal-300/20 rounded-full blur-2xl"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}