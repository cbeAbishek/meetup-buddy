'use client'

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  Twitter, 
  Linkedin, 
  Github, 
  Mail, 
  Phone,
  MapPin,
  Heart,
  ArrowUp,
  Send
} from 'lucide-react'

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const footerLinks = {
    product: [
      { name: 'Features', href: '/features' },
      { name: 'Pricing', href: '/pricing' },
      { name: 'Integrations', href: '/features#integrations' },
      { name: 'API', href: '/docs/api' },
      { name: 'Changelog', href: '/changelog' }
    ],
    company: [
      { name: 'About Us', href: '/about' },
      { name: 'Careers', href: '/careers' },
      { name: 'Press Kit', href: '/press' },
      { name: 'Partners', href: '/contact#partnerships' },
      { name: 'Blog', href: '/blog' }
    ],
    support: [
      { name: 'Help Center', href: '/help' },
      { name: 'Contact Support', href: '/contact#support' },
      { name: 'Status Page', href: '/status' },
      { name: 'Community', href: '/community' },
      { name: 'Training', href: '/training' }
    ],
    // legal: [
    //   { name: 'Privacy Policy', href: '/privacy' },
    //   { name: 'Terms of Service', href: '/terms' },
    //   { name: 'Cookie Policy', href: '/cookies' },
    //   { name: 'GDPR', href: '/gdpr' },
    //   { name: 'Security', href: '/security' }
    // ]
  }

  const socialLinks = [
    { name: 'Twitter', href: 'https://twitter.com/meetupbuddy', icon: Twitter },
    { name: 'LinkedIn', href: 'https://linkedin.com/company/meetupbuddy', icon: Linkedin },
    { name: 'GitHub', href: 'https://github.com/meetupbuddy', icon: Github }
  ]

  const contactInfo = [
    { icon: Mail, text: 'hello@meetupbuddy.com', href: 'mailto:hello@meetupbuddy.com' },
    { icon: Phone, text: '+1 (555) 123-4567', href: 'tel:+15551234567' },
    { icon: MapPin, text: 'San Francisco, CA', href: 'https://maps.google.com/?q=San+Francisco+CA' }
  ]

  const [email, setEmail] = React.useState('')

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Newsletter signup:', email)
    setEmail('')
  }

  return (
    <footer className="bg-gradient-to-br from-slate-50 to-teal-50/30 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-16">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
            {/* Company Info & Newsletter */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-2 space-y-8"
            >
              {/* Logo and Description */}
              <div className="space-y-4">
                <Link href="/" className="group flex items-center space-x-3 w-fit">
                  <div className="w-10 h-10 rounded-2xl overflow-hidden flex items-center justify-center group-hover:shadow-lg group-hover:shadow-teal-500/30 transition-all duration-300">
                    <img
                      src="/logo.png"
                      alt="Meetup Buddy logo"
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <span className="text-xl font-bold text-slate-900 group-hover:text-teal-600 transition-colors duration-300">
                    Meetup Buddy
                  </span>
                </Link>
                
                <p className="text-slate-600 leading-relaxed max-w-md">
                  Transform your meetings from chaotic to productive. 
                  Smart scheduling, intelligent agendas, and seamless follow-ups 
                  for teams that value their time.
                </p>
              </div>

              
              

              {/* Contact Info */}
              <div className="space-y-3">
                {contactInfo.map((contact, index) => (
                  <motion.a
                    key={index}
                    href={contact.href}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    whileHover={{ x: 4 }}
                    className="flex items-center space-x-3 text-slate-600 hover:text-teal-600 transition-all duration-300 w-fit"
                  >
                    <contact.icon className="w-4 h-4" />
                    <span className="text-sm">{contact.text}</span>
                  </motion.a>
                ))}
              </div>
            </motion.div>

            {/* Footer Links */}
            {Object.entries(footerLinks).map(([category, links], categoryIndex) => (
              <motion.div
                key={category}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: categoryIndex * 0.1 }}
                className="space-y-4"
              >
                <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wide">
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </h3>
                <ul className="space-y-3">
                  {links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: linkIndex * 0.05 }}
                      >
                        <Link
                          href={link.href}
                          className="text-slate-600 hover:text-teal-600 text-sm transition-colors duration-300 block hover:translate-x-1 transition-transform"
                        >
                          {link.name}
                        </Link>
                      </motion.div>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Bottom Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="py-8 border-t border-slate-200"
        >
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            {/* Copyright */}
            <div className="flex items-center space-x-2 text-slate-600 text-sm">
              <span>© 2025 Meetup Buddy.</span>
              <span className="flex items-center space-x-1">
                <span>Made with</span>
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Heart className="w-4 h-4 text-red-500 fill-current" />
                </motion.div>
                <span>for productive teams.</span>
              </span>
            </div>

            {/* Social Links */}
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-4">
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    whileHover={{ scale: 1.1, y: -2 }}
                    className="w-10 h-10 rounded-full bg-white border border-slate-200 hover:border-teal-300 flex items-center justify-center text-slate-600 hover:text-teal-600 hover:shadow-lg transition-all duration-300"
                  >
                    <social.icon className="w-4 h-4" />
                  </motion.a>
                ))}
              </div>

              {/* Scroll to Top */}
              <motion.button
                onClick={scrollToTop}
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.9 }}
                className="w-10 h-10 rounded-full bg-teal-600 hover:bg-teal-700 text-white flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300"
                aria-label="Scroll to top"
              >
                <ArrowUp className="w-4 h-4" />
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Bottom Accent */}
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.6 }}
          className="h-1 bg-gradient-to-r from-transparent via-teal-400 to-transparent rounded-full"
        />
      </div>
    </footer>
  )
}