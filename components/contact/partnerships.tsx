'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { 
  Handshake, 
  Puzzle, 
  Building2, 
  Globe, 
  Users, 
  Star,
  ArrowRight,
  CheckCircle
} from 'lucide-react'

export function Partnerships() {
  const partnershipTypes = [
    {
      icon: Puzzle,
      title: "Technology Partners",
      description: "Integrate your platform with MeetupBuddy for mutual benefit",
      benefits: [
        "Access to our API and SDK",
        "Joint go-to-market opportunities",
        "Technical support and documentation",
        "Co-marketing possibilities"
      ],
      color: "from-blue-500 to-blue-600",
      badge: "Technical"
    },
    {
      icon: Building2,
      title: "Reseller Partners",
      description: "Sell MeetupBuddy as part of your service offering",
      benefits: [
        "Competitive margins and commissions",
        "Sales training and materials",
        "Dedicated partner support",
        "Custom pricing for large deals"
      ],
      color: "from-green-500 to-green-600",
      badge: "Sales"
    },
    {
      icon: Globe,
      title: "Solution Partners",
      description: "Build custom solutions and implementations",
      benefits: [
        "Implementation certification program",
        "Advanced training workshops",
        "Priority technical support",
        "Partner directory listing"
      ],
      color: "from-purple-500 to-purple-600",
      badge: "Implementation"
    },
    {
      icon: Users,
      title: "Community Partners",
      description: "Collaborate on content, events, and thought leadership",
      benefits: [
        "Co-create educational content",
        "Joint webinar opportunities",
        "Conference speaking slots",
        "Community recognition program"
      ],
      color: "from-teal-500 to-teal-600",
      badge: "Community"
    }
  ]

  const partnerBenefits = [
    {
      icon: Star,
      title: "Exclusive Access",
      description: "Get early access to new features and beta programs"
    },
    {
      icon: Users,
      title: "Dedicated Support",
      description: "Work with our partner success team for ongoing support"
    },
    {
      icon: Globe,
      title: "Market Expansion",
      description: "Reach new markets and customer segments together"
    },
    {
      icon: CheckCircle,
      title: "Proven Success",
      description: "Join our network of successful partners worldwide"
    }
  ]

  const [selectedPartnership, setSelectedPartnership] = React.useState<number | null>(null)

  return (
    <section className="py-24 bg-gradient-to-b from-white to-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-slate-900 mb-6">
            Partnership{' '}
            <span className="bg-gradient-to-r from-teal-600 to-teal-400 bg-clip-text text-transparent">
              Opportunities
            </span>
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Join our growing partner ecosystem and create value together. 
            Explore collaboration and integration opportunities with MeetupBuddy.
          </p>
        </motion.div>

        {/* Partnership Types */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          {partnershipTypes.map((partnership, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -6, scale: 1.02 }}
              className="bg-white rounded-3xl p-8 shadow-xl border border-slate-200 hover:border-teal-200 transition-all duration-500 group relative cursor-pointer"
              onClick={() => setSelectedPartnership(selectedPartnership === index ? null : index)}
            >
              {/* Badge */}
              <div className="absolute -top-3 -right-3">
                <span className="bg-teal-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                  {partnership.badge}
                </span>
              </div>

              <div className="flex items-start space-x-4 mb-6">
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className={`w-16 h-16 bg-gradient-to-br ${partnership.color} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 flex-shrink-0`}
                >
                  <partnership.icon className="w-8 h-8 text-white" />
                </motion.div>
                
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-teal-600 transition-colors duration-300">
                    {partnership.title}
                  </h3>
                  <p className="text-slate-600 leading-relaxed">
                    {partnership.description}
                  </p>
                </div>

                <motion.div
                  animate={{ rotate: selectedPartnership === index ? 90 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="text-teal-500"
                >
                  <ArrowRight className="w-5 h-5" />
                </motion.div>
              </div>

              {/* Benefits */}
              <motion.div
                initial={false}
                animate={{
                  height: selectedPartnership === index ? "auto" : 0,
                  opacity: selectedPartnership === index ? 1 : 0
                }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <div className="pt-4 border-t border-slate-200">
                  <h4 className="font-semibold text-slate-900 mb-3">Key Benefits:</h4>
                  <div className="space-y-2">
                    {partnership.benefits.map((benefit, benefitIndex) => (
                      <div key={benefitIndex} className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-teal-500 flex-shrink-0" />
                        <span className="text-slate-700 text-sm">{benefit}</span>
                      </div>
                    ))}
                  </div>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="mt-4 px-6 py-2 bg-teal-100 hover:bg-teal-200 text-teal-700 font-semibold rounded-xl transition-all duration-300"
                  >
                    Apply Now
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Partner Benefits */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-16"
        >
          <h3 className="text-3xl font-bold text-slate-900 text-center mb-12">
            Why Partner with Us?
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {partnerBenefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -4, scale: 1.05 }}
                className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200 hover:border-teal-200 hover:shadow-xl transition-all duration-300 text-center group"
              >
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-teal-200 transition-colors duration-300"
                >
                  <benefit.icon className="w-6 h-6 text-teal-600" />
                </motion.div>
                
                <h4 className="text-lg font-semibold text-slate-900 mb-2 group-hover:text-teal-600 transition-colors duration-300">
                  {benefit.title}
                </h4>
                <p className="text-slate-600 text-sm leading-relaxed">
                  {benefit.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="bg-gradient-to-br from-teal-600 to-teal-700 rounded-3xl p-12 text-center text-white relative overflow-hidden"
        >
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            className="absolute top-6 right-6 w-24 h-24 bg-white/10 rounded-full blur-2xl"
          />
          
          <div className="relative z-10">
            <Handshake className="w-16 h-16 text-teal-100 mx-auto mb-6" />
            <h3 className="text-3xl font-bold mb-6">
              Ready to Partner with Us?
            </h3>
            <p className="text-xl text-teal-100 mb-8 max-w-2xl mx-auto leading-relaxed">
              Let's explore how we can create value together. 
              Fill out our partnership application or schedule a call with our team.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-white hover:bg-gray-100 text-teal-600 font-bold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300"
              >
                Submit Application
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-teal-500 hover:bg-teal-400 text-white font-semibold rounded-2xl border border-teal-400 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Schedule Call
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}