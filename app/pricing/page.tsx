"use client";
import React from 'react'
import { motion } from 'framer-motion'
import { PricingPlans } from '@/components/pricing/pricing-plans'
import { AddOns } from '@/components/pricing/add-ons'
import { FAQ } from '@/components/pricing/faq'

export default function PricingPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-to-br from-teal-50 via-white to-teal-50/30 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-teal-200/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="inline-flex items-center px-6 py-3 bg-teal-100 text-teal-800 rounded-full text-sm font-medium mb-8"
            >
              <span className="w-2 h-2 bg-teal-500 rounded-full mr-2 animate-pulse" />
              Transparent & Flexible Pricing
            </motion.div>

            <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-8 leading-tight">
              Choose the{' '}
              <span className="bg-gradient-to-r from-teal-600 to-teal-400 bg-clip-text text-transparent">
                Perfect Plan
              </span>
              <br />
              for Your Team
            </h1>

            <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed mb-12">
              Start free and scale as you grow. No hidden fees, no surprises. 
              Just straightforward pricing that grows with your success.
            </p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
            >
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300"
              >
                Start Free Trial
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-white hover:bg-gray-50 text-slate-700 font-semibold rounded-2xl border border-slate-200 hover:border-teal-200 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Schedule Demo
              </motion.button>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="flex flex-wrap justify-center items-center gap-8 text-sm text-slate-500"
            >
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                <span>14-day free trial</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full" />
                <span>Cancel anytime</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Pricing Plans */}
      <PricingPlans />

      {/* Add-Ons */}
      <AddOns />

      {/* FAQ */}
      <FAQ />

      {/* Final CTA */}
      <section className="py-24 bg-gradient-to-br from-teal-600 to-teal-700 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-10 left-1/4 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-10 right-1/4 w-80 h-80 bg-white/5 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Transform Your Meetings?
            </h2>
            <p className="text-xl text-teal-100 mb-8 leading-relaxed">
              Join thousands of teams already using MeetupBuddy to make their meetings more productive, 
              organized, and actionable. Start your free trial today.
            </p>
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="px-12 py-4 bg-white hover:bg-gray-100 text-teal-600 font-bold text-lg rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300"
            >
              Get Started Free
            </motion.button>
          </motion.div>
        </div>
      </section>
    </div>
  )
}