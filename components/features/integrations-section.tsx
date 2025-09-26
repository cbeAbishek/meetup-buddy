'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Video, Calendar as CalendarIcon, MessageCircle, Zap } from 'lucide-react'

export function IntegrationsSection() {
  const integrations = [
    { name: "Google Meet", icon: Video, color: "from-green-500 to-green-600", status: "connected" },
    { name: "Zoom", icon: Video, color: "from-blue-500 to-blue-600", status: "connected" },
    { name: "Microsoft Teams", icon: MessageCircle, color: "from-purple-500 to-purple-600", status: "available" },
    { name: "Google Calendar", icon: CalendarIcon, color: "from-red-500 to-red-600", status: "connected" },
    { name: "Outlook", icon: CalendarIcon, color: "from-blue-600 to-blue-700", status: "available" },
    { name: "Slack", icon: MessageCircle, color: "from-purple-600 to-purple-700", status: "connected" }
  ]

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-teal-600 rounded-2xl flex items-center justify-center">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-4xl font-bold text-slate-900">
              <span className="bg-gradient-to-r from-teal-600 to-teal-400 bg-clip-text text-transparent">
                Integrations
              </span>
            </h2>
          </div>
          
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Works seamlessly with Google Meet, Zoom, and Teams. Connect your favorite tools for a unified workflow.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {integrations.map((integration, index) => (
            <motion.div
              key={integration.name}
              initial={{ opacity: 0, y: 40, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="group"
            >
              <div className="bg-white border border-slate-200 rounded-3xl p-8 hover:shadow-2xl hover:border-teal-200 transition-all duration-500 relative overflow-hidden">
                <div className="absolute top-4 right-4">
                  <div className={`w-3 h-3 rounded-full ${
                    integration.status === 'connected' ? 'bg-green-400' : 'bg-yellow-400'
                  }`} />
                </div>

                <motion.div
                  className={`w-16 h-16 bg-gradient-to-br ${integration.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
                >
                  <integration.icon className="w-8 h-8 text-white" />
                </motion.div>
                
                <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-teal-600 transition-colors duration-300">
                  {integration.name}
                </h3>
                
                <p className="text-slate-600 leading-relaxed mb-4">
                  {integration.status === 'connected' 
                    ? 'Connected and syncing automatically' 
                    : 'Available for quick setup'
                  }
                </p>

                <motion.button
                  whileHover={{ x: 4 }}
                  className={`text-sm font-semibold flex items-center space-x-2 transition-colors duration-300 ${
                    integration.status === 'connected'
                      ? 'text-green-600 hover:text-green-700'
                      : 'text-teal-600 hover:text-teal-700'
                  }`}
                >
                  <span>
                    {integration.status === 'connected' ? 'Manage' : 'Connect'}
                  </span>
                  <Zap className="w-4 h-4" />
                </motion.button>

                {/* Subtle hover glow effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-teal-400/5 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Integration Flow Visual */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-16 bg-gradient-to-br from-teal-50 to-teal-100/50 rounded-3xl p-12 text-center relative overflow-hidden"
        >
          <h3 className="text-2xl font-bold text-slate-900 mb-4">
            One-Click Integration Setup
          </h3>
          <p className="text-slate-600 mb-8 max-w-2xl mx-auto">
            Connect your existing tools in seconds with our secure OAuth integration system
          </p>

          <div className="flex items-center justify-center space-x-6 flex-wrap gap-4">
            {[Video, CalendarIcon, MessageCircle].map((Icon, index) => (
              <React.Fragment key={index}>
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
                  className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-lg border border-teal-100"
                >
                  <Icon className="w-6 h-6 text-slate-600" />
                </motion.div>
                {index < 2 && (
                  <motion.div
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.8 + index * 0.2 }}
                    className="w-8 h-0.5 bg-teal-300 rounded-full origin-left hidden sm:block"
                  />
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Floating elements */}
          <motion.div
            animate={{ y: [0, -10, 0], rotate: [0, 5, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="absolute top-4 right-4 w-16 h-16 bg-teal-200/30 rounded-full blur-xl"
          />
          <motion.div
            animate={{ y: [0, 10, 0], rotate: [0, -3, 0] }}
            transition={{ duration: 5, repeat: Infinity }}
            className="absolute bottom-4 left-4 w-20 h-20 bg-teal-300/20 rounded-full blur-2xl"
          />
        </motion.div>
      </div>
    </section>
  )
}