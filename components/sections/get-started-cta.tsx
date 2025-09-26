'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Zap, CheckCircle, Users } from 'lucide-react'
import Link from 'next/link'

export function GetStartedCTA() {
  const benefits = [
    "Setup in under 5 minutes",
    "Free 14-day trial, no credit card required",
    "24/7 customer support",
    "Cancel anytime"
  ]

  return (
    <section className="py-24 bg-gradient-to-br from-teal-600 via-teal-500 to-teal-400 relative overflow-hidden">
      {/* Animated background elements */}
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
      <motion.div
        animate={{ 
          x: [0, 30, 0],
          scale: [1, 1.1, 1]
        }}
        transition={{ duration: 12, repeat: Infinity }}
        className="absolute top-1/2 left-1/4 w-24 h-24 bg-white/10 rounded-full blur-xl"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mb-12"
          >
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-3xl flex items-center justify-center mx-auto mb-8"
            >
              <Zap className="w-10 h-10 text-white" />
            </motion.div>

            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Ready to Transform
              <br />
              Your{' '}
              <span className="bg-gradient-to-r from-white to-teal-100 bg-clip-text text-transparent">
                Meetings?
              </span>
            </h2>
            
            <p className="text-xl md:text-2xl text-teal-100 mb-12 max-w-3xl mx-auto leading-relaxed">
              Join thousands of teams already using Meetup Buddy to make their meetings more productive and engaging
            </p>
          </motion.div>

          {/* Benefits List */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
          >
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
                className="flex items-center justify-center md:justify-start space-x-3 text-white"
              >
                <CheckCircle className="w-5 h-5 text-teal-200 flex-shrink-0" />
                <span className="font-medium">{benefit}</span>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12"
          >
            <motion.div
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                href="/auth"
                className="group px-10 py-5 bg-white hover:bg-teal-50 text-teal-600 font-bold rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 flex items-center space-x-3 text-lg"
              >
                <span>Start Free Trial</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                href="/contact"
                className="px-10 py-5 bg-transparent hover:bg-white/10 text-white font-bold rounded-2xl border-2 border-white/30 hover:border-white/50 backdrop-blur-sm transition-all duration-300 text-lg"
              >
                Schedule Demo
              </Link>
            </motion.div>
          </motion.div>

          {/* Social Proof */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-8 text-teal-100"
          >
            <div className="flex items-center space-x-2">
              <Users className="w-5 h-5" />
              <span className="font-medium">10,000+ active teams</span>
            </div>
            <div className="flex items-center space-x-1">
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: 1 + i * 0.1 }}
                >
                  ⭐
                </motion.div>
              ))}
              <span className="ml-2 font-medium">4.9/5 rating</span>
            </div>
            <div className="text-sm">
              No setup fees • Cancel anytime
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}