'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Heart, Handshake, Star, Award } from 'lucide-react'

export function SponsorsAndCollaboration() {
  const partners = [
    { name: "TechCorp", logo: "TC", color: "from-blue-500 to-blue-600" },
    { name: "InnovateLab", logo: "IL", color: "from-purple-500 to-purple-600" },
    { name: "DataFlow", logo: "DF", color: "from-green-500 to-green-600" },
    { name: "CloudSync", logo: "CS", color: "from-orange-500 to-orange-600" },
    { name: "DevTools", logo: "DT", color: "from-red-500 to-red-600" },
    { name: "AI Solutions", logo: "AS", color: "from-indigo-500 to-indigo-600" }
  ]

  const stats = [
    { value: "50+", label: "Partner Organizations", icon: Handshake },
    { value: "100K+", label: "Happy Users", icon: Heart },
    { value: "99.9%", label: "Uptime Guarantee", icon: Star },
    { value: "24/7", label: "Support Available", icon: Award }
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
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
            Trusted by{' '}
            <span className="bg-gradient-to-r from-teal-600 to-teal-400 bg-clip-text text-transparent">
              Industry Leaders
            </span>
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Join thousands of companies worldwide who trust Meetup Buddy for their collaboration needs
          </p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 40, scale: 0.8 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-teal-100 to-teal-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <stat.icon className="w-8 h-8 text-teal-600" />
              </div>
              <div className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">{stat.value}</div>
              <div className="text-slate-600 font-medium">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Partners Grid */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mb-16"
        >
          <h3 className="text-2xl font-bold text-slate-900 text-center mb-10">Our Partners</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
            {partners.map((partner, index) => (
              <motion.div
                key={partner.name}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="group"
              >
                <div className="bg-white border border-slate-200 rounded-3xl p-6 hover:shadow-xl hover:border-teal-200 transition-all duration-500 text-center">
                  <div className={`w-16 h-16 bg-gradient-to-br ${partner.color} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <span className="text-white font-bold text-lg">{partner.logo}</span>
                  </div>
                  <p className="font-semibold text-slate-900 group-hover:text-teal-600 transition-colors duration-300">
                    {partner.name}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Collaboration CTA */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="bg-gradient-to-br from-teal-50 to-teal-100/50 rounded-3xl p-12 text-center relative overflow-hidden"
        >
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute top-4 right-4 w-20 h-20 bg-teal-200/30 rounded-full blur-xl"
          />
          <motion.div
            animate={{ rotate: [360, 0] }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="absolute bottom-4 left-4 w-24 h-24 bg-teal-300/20 rounded-full blur-2xl"
          />
          
          <div className="relative z-10">
            <h3 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
              Ready to{' '}
              <span className="bg-gradient-to-r from-teal-600 to-teal-400 bg-clip-text text-transparent">
                Collaborate?
              </span>
            </h3>
            <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
              Join our growing community of successful teams and experience the future of meeting management
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl hover:shadow-teal-500/25 transition-all duration-300"
              >
                Become a Partner
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-white hover:bg-slate-50 text-slate-900 font-semibold rounded-2xl border-2 border-slate-200 hover:border-teal-200 transition-all duration-300"
              >
                Learn More
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}