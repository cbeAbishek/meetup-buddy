'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { 
  DollarSign, 
  Users, 
  Building, 
  Zap, 
  Calendar, 
  Phone,
  MessageCircle,
  Clock,
  CheckCircle
} from 'lucide-react'

export function Sales() {
  const salesOptions = [
    {
      icon: Phone,
      title: "Schedule a Call",
      description: "Speak directly with our sales team about your needs",
      action: "Book Meeting",
      availability: "Available Mon-Fri",
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: MessageCircle,
      title: "Chat with Sales",
      description: "Get instant answers to your pricing questions",
      action: "Start Chat",
      availability: "9AM-6PM EST",
      color: "from-green-500 to-green-600"
    },
    {
      icon: Calendar,
      title: "Request Demo",
      description: "See MeetupBuddy in action with a personalized demo",
      action: "Schedule Demo",
      availability: "Custom timing",
      color: "from-purple-500 to-purple-600"
    }
  ]

  const useCases = [
    {
      icon: Building,
      title: "Enterprise Teams",
      description: "Large organizations with complex meeting needs",
      features: [
        "Custom pricing and volume discounts",
        "Advanced security and compliance",
        "Dedicated account management",
        "Custom integrations and workflows"
      ],
      startingAt: "Contact for pricing"
    },
    {
      icon: Users,
      title: "Growing Teams",
      description: "Mid-size companies scaling their operations",
      features: [
        "Team collaboration features",
        "Department-level analytics",
        "Priority support",
        "Flexible user management"
      ],
      startingAt: "From $12/user/month"
    },
    {
      icon: Zap,
      title: "Startups",
      description: "Fast-moving teams that need efficient meetings",
      features: [
        "Essential meeting features",
        "Basic integrations",
        "Standard support",
        "Simple pricing model"
      ],
      startingAt: "Free plan available"
    }
  ]

  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    teamSize: '',
    message: ''
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Sales inquiry submitted:', formData)
  }

  return (
    <section className="py-24 bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-slate-900 mb-6">
            Talk to{' '}
            <span className="bg-gradient-to-r from-teal-600 to-teal-400 bg-clip-text text-transparent">
              Sales
            </span>
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Get personalized pricing, custom plans, and expert guidance for your team's needs
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-20">
          {/* Contact Methods */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h3 className="text-2xl font-bold text-slate-900 mb-8">
              Connect with Our Sales Team
            </h3>
            
            <div className="space-y-6 mb-12">
              {salesOptions.map((option, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -4, scale: 1.02 }}
                  className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200 hover:border-teal-200 hover:shadow-xl transition-all duration-300 group"
                >
                  <div className="flex items-center space-x-4">
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      className={`w-12 h-12 bg-gradient-to-br ${option.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
                    >
                      <option.icon className="w-6 h-6 text-white" />
                    </motion.div>
                    
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold text-slate-900 mb-2 group-hover:text-teal-600 transition-colors duration-300">
                        {option.title}
                      </h4>
                      <p className="text-slate-600 mb-2 leading-relaxed">
                        {option.description}
                      </p>
                      <div className="flex items-center space-x-2 text-sm text-slate-500">
                        <Clock className="w-4 h-4" />
                        <span>{option.availability}</span>
                      </div>
                    </div>
                  </div>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="mt-4 w-full py-3 bg-teal-100 hover:bg-teal-200 text-teal-700 font-semibold rounded-xl transition-all duration-300"
                  >
                    {option.action}
                  </motion.button>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Sales Form */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="bg-white rounded-3xl p-8 shadow-xl border border-slate-200"
          >
            <h3 className="text-2xl font-bold text-slate-900 mb-6">
              Get Custom Pricing
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold text-slate-900 mb-2">
                    Name *
                  </label>
                  <motion.input
                    whileFocus={{ scale: 1.02 }}
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-300"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-slate-900 mb-2">
                    Work Email *
                  </label>
                  <motion.input
                    whileFocus={{ scale: 1.02 }}
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-300"
                    placeholder="you@company.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="company" className="block text-sm font-semibold text-slate-900 mb-2">
                    Company *
                  </label>
                  <motion.input
                    whileFocus={{ scale: 1.02 }}
                    type="text"
                    id="company"
                    name="company"
                    required
                    value={formData.company}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-300"
                    placeholder="Your company"
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-semibold text-slate-900 mb-2">
                    Phone
                  </label>
                  <motion.input
                    whileFocus={{ scale: 1.02 }}
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-300"
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="teamSize" className="block text-sm font-semibold text-slate-900 mb-2">
                  Team Size *
                </label>
                <motion.select
                  whileFocus={{ scale: 1.02 }}
                  id="teamSize"
                  name="teamSize"
                  required
                  value={formData.teamSize}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-300"
                >
                  <option value="">Select team size</option>
                  <option value="1-10">1-10 users</option>
                  <option value="11-50">11-50 users</option>
                  <option value="51-200">51-200 users</option>
                  <option value="201-1000">201-1000 users</option>
                  <option value="1000+">1000+ users</option>
                </motion.select>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-semibold text-slate-900 mb-2">
                  Tell us about your needs
                </label>
                <motion.textarea
                  whileFocus={{ scale: 1.02 }}
                  id="message"
                  name="message"
                  rows={4}
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-300 resize-vertical"
                  placeholder="Describe your meeting challenges and requirements..."
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                className="w-full py-4 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Get Custom Pricing
              </motion.button>
            </form>
          </motion.div>
        </div>

        {/* Use Cases */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h3 className="text-3xl font-bold text-slate-900 text-center mb-12">
            Pricing for Every Team Size
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {useCases.map((useCase, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -6, scale: 1.03 }}
                className="bg-white rounded-3xl p-8 shadow-xl border border-slate-200 hover:border-teal-200 transition-all duration-500 group"
              >
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className="w-16 h-16 bg-teal-100 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-teal-200 transition-colors duration-300"
                >
                  <useCase.icon className="w-8 h-8 text-teal-600" />
                </motion.div>
                
                <h4 className="text-xl font-bold text-slate-900 mb-3 text-center group-hover:text-teal-600 transition-colors duration-300">
                  {useCase.title}
                </h4>
                
                <p className="text-slate-600 text-center mb-6 leading-relaxed">
                  {useCase.description}
                </p>

                <div className="space-y-3 mb-8">
                  {useCase.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-teal-500 flex-shrink-0" />
                      <span className="text-slate-700 text-sm">{feature}</span>
                    </div>
                  ))}
                </div>

                <div className="text-center border-t border-slate-200 pt-6">
                  <p className="text-2xl font-bold text-slate-900 mb-4">
                    {useCase.startingAt}
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full py-3 bg-teal-100 hover:bg-teal-200 text-teal-700 font-semibold rounded-2xl transition-all duration-300 group-hover:shadow-lg"
                  >
                    Contact Sales
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}