'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { 
  Headphones, 
  MessageCircle, 
  BookOpen, 
  Video, 
  Clock, 
  CheckCircle,
  AlertCircle,
  HelpCircle
} from 'lucide-react'

export function Support() {
  const supportOptions = [
    {
      icon: MessageCircle,
      title: "Live Chat",
      description: "Get instant help from our support team",
      availability: "24/7 for paid plans",
      action: "Start Chat",
      color: "from-blue-500 to-blue-600",
      badge: "Fastest"
    },
    {
      icon: Headphones,
      title: "Phone Support",
      description: "Speak directly with technical experts",
      availability: "Mon-Fri: 9AM-6PM EST",
      action: "Call Support",
      color: "from-green-500 to-green-600",
      badge: "Personal"
    },
    {
      icon: BookOpen,
      title: "Help Center",
      description: "Browse our comprehensive knowledge base",
      availability: "Available 24/7",
      action: "Browse Articles",
      color: "from-purple-500 to-purple-600",
      badge: "Self-Service"
    },
    {
      icon: Video,
      title: "Screen Share",
      description: "Schedule a session for complex issues",
      availability: "By appointment",
      action: "Book Session",
      color: "from-orange-500 to-orange-600",
      badge: "In-Depth"
    }
  ]

  const commonIssues = [
    {
      icon: AlertCircle,
      title: "Login Issues",
      description: "Can't access your account?",
      solutions: [
        "Reset your password",
        "Clear browser cache",
        "Check SSO settings",
        "Contact admin"
      ]
    },
    {
      icon: HelpCircle,
      title: "Integration Problems",
      description: "Having trouble connecting apps?",
      solutions: [
        "Check API permissions",
        "Verify credentials",
        "Review connection logs",
        "Update integration"
      ]
    },
    {
      icon: CheckCircle,
      title: "Meeting Setup",
      description: "Need help configuring meetings?",
      solutions: [
        "Review meeting templates",
        "Check calendar sync",
        "Verify participant permissions",
        "Test notification settings"
      ]
    }
  ]

  const [selectedIssue, setSelectedIssue] = React.useState<number | null>(null)

  return (
    <section className="py-24 bg-gradient-to-b from-teal-50/30 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-slate-900 mb-6">
            Technical{' '}
            <span className="bg-gradient-to-r from-teal-600 to-teal-400 bg-clip-text text-transparent">
              Support
            </span>
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Get expert help and troubleshooting assistance from our technical support team
          </p>
        </motion.div>

        {/* Support Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {supportOptions.map((option, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -8, scale: 1.03 }}
              className="bg-white rounded-3xl p-8 shadow-xl border border-slate-200 hover:border-teal-200 transition-all duration-500 group relative"
            >
              {/* Badge */}
              <div className="absolute -top-3 -right-3">
                <span className="bg-teal-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                  {option.badge}
                </span>
              </div>

              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                className={`w-16 h-16 bg-gradient-to-br ${option.color} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}
              >
                <option.icon className="w-8 h-8 text-white" />
              </motion.div>
              
              <h3 className="text-xl font-bold text-slate-900 mb-3 text-center group-hover:text-teal-600 transition-colors duration-300">
                {option.title}
              </h3>
              
              <p className="text-slate-600 text-center mb-4 leading-relaxed">
                {option.description}
              </p>

              <div className="flex items-center justify-center space-x-2 text-sm text-slate-500 mb-6">
                <Clock className="w-4 h-4" />
                <span>{option.availability}</span>
              </div>

              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="w-full py-3 bg-gradient-to-r from-teal-100 to-teal-200 hover:from-teal-200 hover:to-teal-300 text-teal-700 font-semibold rounded-2xl transition-all duration-300 group-hover:shadow-lg"
              >
                {option.action}
              </motion.button>
            </motion.div>
          ))}
        </div>

        {/* Common Issues */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-16"
        >
          <h3 className="text-3xl font-bold text-slate-900 text-center mb-12">
            Common Issues & Quick Solutions
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {commonIssues.map((issue, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200 hover:border-teal-200 hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-teal-100 rounded-xl flex items-center justify-center">
                    <issue.icon className="w-5 h-5 text-teal-600" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-slate-900">{issue.title}</h4>
                    <p className="text-sm text-slate-600">{issue.description}</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  {issue.solutions.map((solution, solutionIndex) => (
                    <motion.div
                      key={solutionIndex}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: 0.5 + solutionIndex * 0.05 }}
                      className="flex items-center space-x-2"
                    >
                      <div className="w-1.5 h-1.5 bg-teal-500 rounded-full" />
                      <span className="text-slate-700 text-sm">{solution}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Priority Support */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="bg-gradient-to-br from-teal-50 to-teal-100/50 rounded-3xl p-8 text-center relative overflow-hidden"
        >
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute top-4 right-4 w-20 h-20 bg-teal-200/30 rounded-full blur-xl"
          />
          
          <div className="relative z-10">
            <h3 className="text-2xl font-bold text-slate-900 mb-4">
              Need Priority Support?
            </h3>
            <p className="text-slate-600 mb-6 max-w-2xl mx-auto">
              Enterprise customers get dedicated support with guaranteed response times. 
              Contact us to learn about our priority support options.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Upgrade to Enterprise
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3 bg-white hover:bg-gray-50 text-teal-600 font-semibold rounded-2xl border border-teal-200 hover:border-teal-300 shadow-lg hover:shadow-xl transition-all duration-300"
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