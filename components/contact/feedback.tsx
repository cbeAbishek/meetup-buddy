'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { 
  MessageSquare, 
  Lightbulb, 
  Star, 
  TrendingUp, 
  Users, 
  Zap,
  Heart,
  Send
} from 'lucide-react'

export function Feedback() {
  const feedbackCategories = [
    {
      icon: Lightbulb,
      title: "Feature Requests",
      description: "Suggest new features or improvements",
      color: "from-yellow-500 to-yellow-600",
      examples: [
        "New integrations",
        "UI improvements",
        "Workflow enhancements",
        "Automation ideas"
      ]
    },
    {
      icon: Star,
      title: "Product Feedback",
      description: "Share your experience with existing features",
      color: "from-blue-500 to-blue-600",
      examples: [
        "User experience",
        "Performance issues",
        "Design feedback",
        "Usability concerns"
      ]
    },
    {
      icon: TrendingUp,
      title: "Improvement Ideas",
      description: "Help us make MeetupBuddy even better",
      color: "from-green-500 to-green-600",
      examples: [
        "Process optimization",
        "Better workflows",
        "Enhanced analytics",
        "Mobile experience"
      ]
    },
    {
      icon: Heart,
      title: "General Feedback",
      description: "Share any thoughts or suggestions",
      color: "from-pink-500 to-pink-600",
      examples: [
        "Overall satisfaction",
        "Success stories",
        "Areas for growth",
        "Community ideas"
      ]
    }
  ]

  const impactAreas = [
    {
      icon: Users,
      title: "Community Driven",
      description: "Your feedback shapes our roadmap and helps us prioritize features that matter most to our users."
    },
    {
      icon: Zap,
      title: "Rapid Iteration",
      description: "We regularly ship improvements based on user suggestions, often within weeks of receiving feedback."
    },
    {
      icon: MessageSquare,
      title: "Open Communication",
      description: "Join our feedback community and engage directly with our product team and other users."
    }
  ]

  const [feedbackData, setFeedbackData] = React.useState({
    category: '',
    title: '',
    description: '',
    email: '',
    priority: 'medium',
    allowContact: true
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const value = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value
    setFeedbackData(prev => ({
      ...prev,
      [e.target.name]: value
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Feedback submitted:', feedbackData)
  }

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
            Share Your{' '}
            <span className="bg-gradient-to-r from-teal-600 to-teal-400 bg-clip-text text-transparent">
              Feedback
            </span>
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Your ideas and suggestions help us improve MeetupBuddy. 
            We value every piece of feedback and use it to shape our platform.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-16">
          {/* Feedback Categories */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h3 className="text-2xl font-bold text-slate-900 mb-8">
              What kind of feedback do you have?
            </h3>
            
            <div className="space-y-6">
              {feedbackCategories.map((category, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -4, scale: 1.02 }}
                  className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200 hover:border-teal-200 hover:shadow-xl transition-all duration-300 group"
                >
                  <div className="flex items-start space-x-4">
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      className={`w-12 h-12 bg-gradient-to-br ${category.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
                    >
                      <category.icon className="w-6 h-6 text-white" />
                    </motion.div>
                    
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold text-slate-900 mb-2 group-hover:text-teal-600 transition-colors duration-300">
                        {category.title}
                      </h4>
                      <p className="text-slate-600 mb-3 leading-relaxed">
                        {category.description}
                      </p>
                      
                      <div className="flex flex-wrap gap-2">
                        {category.examples.map((example, exampleIndex) => (
                          <span 
                            key={exampleIndex}
                            className="px-3 py-1 bg-slate-100 text-slate-600 text-xs rounded-full"
                          >
                            {example}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Feedback Form */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="bg-white rounded-3xl p-8 shadow-xl border border-slate-200"
          >
            <h3 className="text-2xl font-bold text-slate-900 mb-6">
              Submit Your Ideas
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="category" className="block text-sm font-semibold text-slate-900 mb-2">
                  Feedback Category *
                </label>
                <motion.select
                  whileFocus={{ scale: 1.02 }}
                  id="category"
                  name="category"
                  required
                  value={feedbackData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-300"
                >
                  <option value="">Select category</option>
                  <option value="feature">Feature Request</option>
                  <option value="product">Product Feedback</option>
                  <option value="improvement">Improvement Idea</option>
                  <option value="general">General Feedback</option>
                </motion.select>
              </div>

              <div>
                <label htmlFor="title" className="block text-sm font-semibold text-slate-900 mb-2">
                  Title *
                </label>
                <motion.input
                  whileFocus={{ scale: 1.02 }}
                  type="text"
                  id="title"
                  name="title"
                  required
                  value={feedbackData.title}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-300"
                  placeholder="Brief summary of your feedback"
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-semibold text-slate-900 mb-2">
                  Description *
                </label>
                <motion.textarea
                  whileFocus={{ scale: 1.02 }}
                  id="description"
                  name="description"
                  required
                  rows={5}
                  value={feedbackData.description}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-300 resize-vertical"
                  placeholder="Describe your idea, suggestion, or feedback in detail..."
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-slate-900 mb-2">
                    Email (optional)
                  </label>
                  <motion.input
                    whileFocus={{ scale: 1.02 }}
                    type="email"
                    id="email"
                    name="email"
                    value={feedbackData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-300"
                    placeholder="your@email.com"
                  />
                </div>
                <div>
                  <label htmlFor="priority" className="block text-sm font-semibold text-slate-900 mb-2">
                    Priority
                  </label>
                  <motion.select
                    whileFocus={{ scale: 1.02 }}
                    id="priority"
                    name="priority"
                    value={feedbackData.priority}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-300"
                  >
                    <option value="low">Nice to have</option>
                    <option value="medium">Moderately important</option>
                    <option value="high">Very important</option>
                    <option value="critical">Critical</option>
                  </motion.select>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="allowContact"
                  name="allowContact"
                  checked={feedbackData.allowContact}
                  onChange={handleChange}
                  className="w-4 h-4 text-teal-600 border-slate-300 rounded focus:ring-teal-500"
                />
                <label htmlFor="allowContact" className="text-sm text-slate-700">
                  I'm open to being contacted about this feedback
                </label>
              </div>

              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                className="w-full py-4 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center space-x-2"
              >
                <Send className="w-5 h-5" />
                <span>Submit Feedback</span>
              </motion.button>
            </form>
          </motion.div>
        </div>

        {/* Impact Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h3 className="text-3xl font-bold text-slate-900 text-center mb-12">
            Your Feedback Makes a Difference
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {impactAreas.map((area, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -4, scale: 1.05 }}
                className="bg-white rounded-2xl p-8 shadow-lg border border-slate-200 hover:border-teal-200 hover:shadow-xl transition-all duration-300 text-center group"
              >
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className="w-16 h-16 bg-teal-100 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-teal-200 transition-colors duration-300"
                >
                  <area.icon className="w-8 h-8 text-teal-600" />
                </motion.div>
                
                <h4 className="text-xl font-semibold text-slate-900 mb-4 group-hover:text-teal-600 transition-colors duration-300">
                  {area.title}
                </h4>
                <p className="text-slate-600 leading-relaxed">
                  {area.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-16 bg-gradient-to-br from-teal-50 to-teal-100/50 rounded-3xl p-8 text-center"
        >
          <h3 className="text-2xl font-bold text-slate-900 mb-4">
            Join Our Community
          </h3>
          <p className="text-slate-600 mb-6 max-w-2xl mx-auto">
            Want to stay involved in shaping MeetupBuddy? Join our user community 
            for early access to features, regular feedback sessions, and direct communication with our team.
          </p>
          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-3 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Join Community
          </motion.button>
        </motion.div>
      </div>
    </section>
  )
}