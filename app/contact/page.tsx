"use client";
import React from 'react'
import { motion } from 'framer-motion'
import { GeneralInquiries } from '@/components/contact/general-inquiries'
import { Support } from '@/components/contact/support'
import { Partnerships } from '@/components/contact/partnerships'
import { Sales } from '@/components/contact/sales'
import { Feedback } from '@/components/contact/feedback'

export default function ContactPage() {
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
              We're Here to Help
            </motion.div>

            <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-8 leading-tight">
              Let's{' '}
              <span className="bg-gradient-to-r from-teal-600 to-teal-400 bg-clip-text text-transparent">
                Connect
              </span>
              <br />
              and Collaborate
            </h1>

            <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed mb-12">
              Whether you have questions, need support, want to partner with us, 
              or just want to share your thoughts—we'd love to hear from you.
            </p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="flex flex-wrap justify-center gap-4 mb-16"
            >
              {[
                { label: "General Questions", href: "#general" },
                { label: "Technical Support", href: "#support" },
                { label: "Partnership Inquiries", href: "#partnerships" },
                { label: "Sales & Pricing", href: "#sales" },
                { label: "Share Feedback", href: "#feedback" }
              ].map((link, index) => (
                <motion.a
                  key={index}
                  href={link.href}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.8 + index * 0.1 }}
                  className="px-6 py-3 bg-white hover:bg-gray-50 text-slate-700 font-medium rounded-2xl border border-slate-200 hover:border-teal-200 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  {link.label}
                </motion.a>
              ))}
            </motion.div>

            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 1 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto"
            >
              {[
                { value: "< 2 hrs", label: "Average Response Time" },
                { value: "24/7", label: "Support Available" },
                { value: "99.9%", label: "Customer Satisfaction" },
                { value: "50+", label: "Countries Supported" }
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 1.2 + index * 0.1 }}
                  className="text-center"
                >
                  <div className="text-2xl font-bold text-teal-600 mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-slate-500">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Contact Sections */}
      <div id="general">
        <GeneralInquiries />
      </div>

      <div id="support">
        <Support />
      </div>

      <div id="partnerships">
        <Partnerships />
      </div>

      <div id="sales">
        <Sales />
      </div>

      <div id="feedback">
        <Feedback />
      </div>

      {/* Final CTA */}
      <section className="py-24 bg-gradient-to-br from-slate-900 to-slate-800 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-10 left-1/4 w-64 h-64 bg-teal-500/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-10 right-1/4 w-80 h-80 bg-teal-400/10 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl font-bold text-white mb-6">
              Still Have Questions?
            </h2>
            <p className="text-xl text-slate-300 mb-8 leading-relaxed">
              Don't see what you're looking for? Our team is standing by to help with 
              any questions, concerns, or custom requirements you might have.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300"
              >
                Contact Us Directly
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-transparent hover:bg-white/5 text-white font-semibold rounded-2xl border border-white/20 hover:border-white/30 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Browse Help Center
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}