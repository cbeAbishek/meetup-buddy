'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Calendar, Users, FileText, Zap } from 'lucide-react'

export function FeaturesOverview() {
  const features = [
    {
      icon: Calendar,
      title: "Smart Scheduling",
      description: "AI-powered scheduling that finds the perfect time for everyone",
      color: "from-teal-400 to-teal-500"
    },
    {
      icon: Users,
      title: "Team Collaboration",
      description: "Seamless collaboration tools for remote and hybrid teams",
      color: "from-teal-500 to-teal-600"
    },
    {
      icon: FileText,
      title: "Meeting Notes",
      description: "Automated note-taking and action item tracking",
      color: "from-teal-400 to-teal-600"
    },
    {
      icon: Zap,
      title: "Quick Setup",
      description: "Get started in minutes with our intuitive interface",
      color: "from-teal-300 to-teal-500"
    }
  ]

  return (
    <section id="features" className="py-24 bg-gradient-to-b from-white to-teal-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
            Everything you need for{' '}
            <span className="bg-gradient-to-r from-teal-600 to-teal-400 bg-clip-text text-transparent">
              perfect meetings
            </span>
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Streamline your meeting workflow with our comprehensive suite of tools designed for modern teams
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="group relative"
            >
              <div className="bg-white/80 backdrop-blur-sm border border-teal-100/60 rounded-3xl p-8 hover:shadow-2xl hover:shadow-teal-500/10 transition-all duration-500">
                <motion.div
                  className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
                >
                  <feature.icon className="w-8 h-8 text-white" />
                </motion.div>
                
                <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-teal-600 transition-colors duration-300">
                  {feature.title}
                </h3>
                
                <p className="text-slate-600 leading-relaxed">
                  {feature.description}
                </p>

                {/* Subtle hover glow effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-teal-400/5 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}