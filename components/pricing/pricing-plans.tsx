'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Check, Star, Zap, Crown, Building } from 'lucide-react'

export function PricingPlans() {
  const plans = [
    {
      name: "Free Plan",
      price: "$0",
      period: "forever",
      icon: Star,
      color: "from-slate-500 to-slate-600",
      description: "Perfect for individuals and small teams getting started",
      features: [
        "Basic scheduling dashboard",
        "Up to 5 meetings per month",
        "Meeting notes and agendas",
        "Email notifications",
        "Mobile app access",
        "Community support"
      ],
      limitations: [
        "Limited to 3 participants per meeting",
        "Basic integrations only"
      ],
      cta: "Get Started Free",
      popular: false
    },
    {
      name: "Team Plan",
      price: "$12",
      period: "per user/month",
      icon: Zap,
      color: "from-teal-500 to-teal-600",
      description: "Everything you need for productive team collaboration",
      features: [
        "Unlimited meetings and participants",
        "Advanced conflict detection",
        "Real-time collaboration",
        "Agenda templates",
        "Action item tracking",
        "Document sharing and storage",
        "Calendar integrations",
        "Priority email support",
        "Team analytics dashboard"
      ],
      limitations: [],
      cta: "Start Free Trial",
      popular: true
    },
    {
      name: "Enterprise Plan",
      price: "$25",
      period: "per user/month",
      icon: Crown,
      color: "from-purple-500 to-purple-600",
      description: "Advanced features for large organizations",
      features: [
        "Everything in Team Plan",
        "Advanced integrations (Slack, Teams, etc.)",
        "Custom workflows and automations",
        "Single Sign-On (SSO)",
        "Advanced security and compliance",
        "Dedicated account manager",
        "24/7 priority support",
        "Custom branding",
        "API access",
        "Advanced analytics and reporting"
      ],
      limitations: [],
      cta: "Contact Sales",
      popular: false
    }
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
            Choose Your{' '}
            <span className="bg-gradient-to-r from-teal-600 to-teal-400 bg-clip-text text-transparent">
              Perfect Plan
            </span>
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Start free, then choose a plan that scales with your team's needs
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className={`relative bg-white rounded-3xl shadow-xl border-2 transition-all duration-500 ${
                plan.popular 
                  ? 'border-teal-200 shadow-teal-500/20 shadow-2xl' 
                  : 'border-slate-200 hover:border-teal-100'
              }`}
            >
              {plan.popular && (
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                  className="absolute -top-4 left-1/2 transform -translate-x-1/2"
                >
                  <div className="bg-gradient-to-r from-teal-500 to-teal-600 text-white px-6 py-2 rounded-full text-sm font-semibold shadow-lg">
                    Most Popular
                  </div>
                </motion.div>
              )}

              <div className="p-8">
                {/* Header */}
                <div className="text-center mb-8">
                  <motion.div
                    className={`w-16 h-16 bg-gradient-to-br ${plan.color} rounded-2xl flex items-center justify-center mx-auto mb-4`}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  >
                    <plan.icon className="w-8 h-8 text-white" />
                  </motion.div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">{plan.name}</h3>
                  <p className="text-slate-600 mb-4">{plan.description}</p>
                  <div className="flex items-baseline justify-center space-x-1">
                    <span className="text-4xl font-bold text-slate-900">{plan.price}</span>
                    <span className="text-slate-600">/{plan.period}</span>
                  </div>
                </div>

                {/* Features */}
                <div className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <motion.div
                      key={featureIndex}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: 0.4 + featureIndex * 0.05 }}
                      className="flex items-center space-x-3"
                    >
                      <Check className="w-5 h-5 text-teal-600 flex-shrink-0" />
                      <span className="text-slate-700">{feature}</span>
                    </motion.div>
                  ))}
                  
                  {plan.limitations.map((limitation, limitIndex) => (
                    <motion.div
                      key={limitIndex}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: 0.4 + (plan.features.length + limitIndex) * 0.05 }}
                      className="flex items-center space-x-3"
                    >
                      <div className="w-5 h-5 flex-shrink-0 flex items-center justify-center">
                        <div className="w-3 h-3 bg-slate-300 rounded-full" />
                      </div>
                      <span className="text-slate-500 text-sm">{limitation}</span>
                    </motion.div>
                  ))}
                </div>

                {/* CTA */}
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className={`w-full py-4 px-6 rounded-2xl font-semibold text-lg transition-all duration-300 ${
                    plan.popular
                      ? 'bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white shadow-lg hover:shadow-xl hover:shadow-teal-500/25'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-900 border-2 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {plan.cta}
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-16 text-center"
        >
          <p className="text-slate-600 mb-8">
            All plans include a 14-day free trial • No credit card required • Cancel anytime
          </p>
          <div className="flex items-center justify-center space-x-8 text-sm text-slate-500">
            <div className="flex items-center space-x-2">
              <Check className="w-4 h-4 text-teal-600" />
              <span>Free setup</span>
            </div>
            <div className="flex items-center space-x-2">
              <Check className="w-4 h-4 text-teal-600" />
              <span>24/7 support</span>
            </div>
            <div className="flex items-center space-x-2">
              <Check className="w-4 h-4 text-teal-600" />
              <span>SOC 2 compliant</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}