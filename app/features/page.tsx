'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { CentralizedScheduling } from '@/components/features/centralized-scheduling'
import { ConflictDetection } from '@/components/features/conflict-detection'
import { AgendaNotesSection } from '@/components/features/agenda-notes-section'
import { RealtimeCollaboration } from '@/components/features/realtime-collaboration'
import { FollowupsTasks } from '@/components/features/followups-tasks'
import { DocumentSharingSection } from '@/components/features/document-sharing-section'
import { IntegrationsSection } from '@/components/features/integrations-section'

export default function FeaturesPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="py-24 bg-gradient-to-br from-teal-600 via-teal-500 to-teal-400 relative overflow-hidden">
        <motion.div
          animate={{ 
            y: [0, -20, 0],
            rotate: [0, 10, 0]
          }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-xl"
        />
        <motion.div
          animate={{ 
            y: [0, 20, 0],
            rotate: [0, -15, 0]
          }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute bottom-10 right-10 w-40 h-40 bg-white/5 rounded-full blur-2xl"
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center text-white"
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Powerful Features for
              <br />
              <span className="bg-gradient-to-r from-white to-teal-100 bg-clip-text text-transparent">
                Modern Teams
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-teal-100 mb-8 max-w-4xl mx-auto leading-relaxed">
              Everything you need to transform your meeting experience and boost team productivity
            </p>
          </motion.div>
        </div>
      </section>

      {/* Feature Sections */}
      <CentralizedScheduling />
      <ConflictDetection />
      <AgendaNotesSection />
      <RealtimeCollaboration />
      <FollowupsTasks />
      <DocumentSharingSection />
      <IntegrationsSection />

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-teal-600 to-teal-400">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Experience These Features?
            </h2>
            <p className="text-xl text-teal-100 mb-8">
              Start your free trial today and see how these powerful features can transform your meetings
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-white hover:bg-teal-50 text-teal-600 font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Start Free Trial
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-transparent hover:bg-white/10 text-white font-bold rounded-2xl border-2 border-white/30 hover:border-white/50 transition-all duration-300"
              >
                View Pricing
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  )
}