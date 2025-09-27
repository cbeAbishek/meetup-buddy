'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { HardDrive, Globe, Zap, Headphones } from 'lucide-react'

export function AddOns() {
  const addOns = [
    {
      name: "Extra Storage",
      price: "$5",
      period: "per 100GB/month",
      icon: HardDrive,
      color: "from-blue-500 to-blue-600",
      description: "Additional secure cloud storage for your meeting documents and recordings",
      features: [
        "100GB additional storage",
        "Advanced backup options",
        "Priority data recovery",
        "Extended retention policies"
      ]
    },
    {
      name: "Custom Domains",
      price: "$15",
      period: "per domain/month",
      icon: Globe,
      color: "from-purple-500 to-purple-600",
      description: "Use your own domain for a branded meeting experience",
      features: [
        "Custom domain setup",
        "Branded meeting links",
        "SSL certificate included",
        "Professional appearance"
      ]
    },
    {
      name: "Premium Integrations",
      price: "$20",
      period: "per integration/month",
      icon: Zap,
      color: "from-orange-500 to-orange-600",
      description: "Connect with specialized tools and advanced workflow automation",
      features: [
        "CRM integrations (Salesforce, HubSpot)",
        "Project management tools",
        "Advanced webhook support",
        "Custom API endpoints"
      ]
    },
    {
      name: "Dedicated Support",
      price: "$50",
      period: "per user/month",
      icon: Headphones,
      color: "from-green-500 to-green-600",
      description: "Get priority support with dedicated account management",
      features: [
        "Dedicated support representative",
        "Priority response time",
        "Custom training sessions",
        "Implementation assistance"
      ]
    }
  ]

  return (
    <section className="py-24 bg-gradient-to-b from-white to-teal-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-slate-900 mb-6">
            Powerful{' '}
            <span className="bg-gradient-to-r from-teal-600 to-teal-400 bg-clip-text text-transparent">
              Add-Ons
            </span>
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Enhance your experience with specialized features and premium services
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {addOns.map((addOn, index) => (
            <motion.div
              key={addOn.name}
              initial={{ opacity: 0, y: 40, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="bg-white rounded-3xl shadow-xl border border-slate-200 hover:border-teal-200 transition-all duration-500 group"
            >
              <div className="p-8">
                {/* Icon and Header */}
                <motion.div
                  className={`w-16 h-16 bg-gradient-to-br ${addOn.color} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}
                >
                  <addOn.icon className="w-8 h-8 text-white" />
                </motion.div>
                
                <h3 className="text-xl font-bold text-slate-900 mb-2 text-center group-hover:text-teal-600 transition-colors duration-300">
                  {addOn.name}
                </h3>
                
                <div className="text-center mb-4">
                  <div className="flex items-baseline justify-center space-x-1">
                    <span className="text-2xl font-bold text-slate-900">{addOn.price}</span>
                    <span className="text-slate-600 text-sm">/{addOn.period}</span>
                  </div>
                </div>

                <p className="text-slate-600 text-center mb-6 leading-relaxed">
                  {addOn.description}
                </p>

                {/* Features */}
                <div className="space-y-2 mb-8">
                  {addOn.features.map((feature, featureIndex) => (
                    <motion.div
                      key={featureIndex}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: 0.3 + featureIndex * 0.05 }}
                      className="flex items-center space-x-2"
                    >
                      <div className="w-1.5 h-1.5 bg-teal-500 rounded-full flex-shrink-0" />
                      <span className="text-slate-700 text-sm">{feature}</span>
                    </motion.div>
                  ))}
                </div>

                {/* CTA */}
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full py-3 px-4 bg-gradient-to-r from-teal-100 to-teal-200 hover:from-teal-200 hover:to-teal-300 text-teal-700 font-semibold rounded-2xl transition-all duration-300 group-hover:shadow-lg"
                >
                  Add to Plan
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bundle Offer */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-16 bg-gradient-to-br from-teal-50 to-teal-100/50 rounded-3xl p-8 text-center relative overflow-hidden"
        >
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute top-4 right-4 w-16 h-16 bg-teal-200/30 rounded-full blur-xl"
          />
          
          <div className="relative z-10">
            <h3 className="text-2xl font-bold text-slate-900 mb-4">
              Bundle & Save
            </h3>
            <p className="text-slate-600 mb-6 max-w-2xl mx-auto">
              Add multiple add-ons to any plan and save 20% on the total add-on cost
            </p>
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Contact Sales for Bundle Pricing
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}