'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { MessageCircle, Shield, Clock, Users, Star, Sparkles } from 'lucide-react'

export function FAQ() {
  const faqs = [
    {
      question: "Can I change my plan at any time?",
      answer: "Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately, and you'll be charged the prorated amount.",
      icon: MessageCircle
    },
    {
      question: "Is my data secure with MeetupBuddy?",
      answer: "Absolutely. We use enterprise-grade encryption, secure cloud storage, and comply with GDPR, SOC 2, and other security standards.",
      icon: Shield
    },
    {
      question: "What happens to my data if I cancel?",
      answer: "You have 30 days after cancellation to export your data. We'll securely delete your data after this period, as outlined in our privacy policy.",
      icon: Clock
    },
    {
      question: "Do you offer team or enterprise discounts?",
      answer: "Yes! We offer volume discounts for teams of 10+ users and custom pricing for enterprise needs. Contact our sales team for details.",
      icon: Users
    },
    {
      question: "Is there a free trial available?",
      answer: "Yes! All paid plans come with a 14-day free trial. No credit card required to start. Experience all features before you commit.",
      icon: Star
    },
    {
      question: "Can I integrate with my existing tools?",
      answer: "MeetupBuddy integrates with 50+ popular tools including Google Workspace, Microsoft 365, Slack, Zoom, and many more.",
      icon: Sparkles
    }
  ]

  const [openIndex, setOpenIndex] = React.useState<number | null>(null)

  return (
    <section className="py-24 bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-slate-900 mb-6">
            Frequently Asked{' '}
            <span className="bg-gradient-to-r from-teal-600 to-teal-400 bg-clip-text text-transparent">
              Questions
            </span>
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Get answers to common questions about our pricing and features
          </p>
        </motion.div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-2xl border border-slate-200 hover:border-teal-200 hover:shadow-lg transition-all duration-300 overflow-hidden"
            >
              <motion.button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-8 py-6 text-left flex items-center justify-between hover:bg-teal-50/30 transition-colors duration-300"
                whileHover={{ backgroundColor: "rgba(20, 184, 166, 0.05)" }}
              >
                <div className="flex items-center space-x-4">
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className="w-10 h-10 bg-gradient-to-br from-teal-100 to-teal-200 rounded-xl flex items-center justify-center"
                  >
                    <faq.icon className="w-5 h-5 text-teal-600" />
                  </motion.div>
                  <h3 className="text-lg font-semibold text-slate-900 group-hover:text-teal-700 transition-colors duration-300">
                    {faq.question}
                  </h3>
                </div>
                <motion.div
                  animate={{ rotate: openIndex === index ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="w-6 h-6 rounded-full bg-teal-100 flex items-center justify-center"
                >
                  <svg
                    className="w-4 h-4 text-teal-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </motion.div>
              </motion.button>

              <motion.div
                initial={false}
                animate={{
                  height: openIndex === index ? "auto" : 0,
                  opacity: openIndex === index ? 1 : 0
                }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <div className="px-8 pb-6 pl-20">
                  <p className="text-slate-600 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Still Have Questions */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-16 text-center bg-gradient-to-br from-teal-50 to-teal-100/50 rounded-3xl p-8"
        >
          <h3 className="text-2xl font-bold text-slate-900 mb-4">
            Still have questions?
          </h3>
          <p className="text-slate-600 mb-6 max-w-2xl mx-auto">
            Our support team is here to help. Reach out anytime and we'll get back to you quickly.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Contact Support
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 bg-white hover:bg-gray-50 text-teal-600 font-semibold rounded-2xl border border-teal-200 hover:border-teal-300 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Schedule Demo
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}