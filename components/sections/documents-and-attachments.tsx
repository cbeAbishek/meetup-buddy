'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { FileText, Upload, Download, Search, Lock, Share2 } from 'lucide-react'

export function DocumentsAndAttachments() {
  const features = [
    {
      icon: Upload,
      title: "Drag & Drop Upload",
      description: "Easily upload documents, presentations, and files directly to your meeting"
    },
    {
      icon: Search,
      title: "Smart Search",
      description: "Find any document or attachment across all your meetings instantly"
    },
    {
      icon: Lock,
      title: "Secure Storage",
      description: "Enterprise-grade security ensures your documents are always protected"
    },
    {
      icon: Share2,
      title: "Easy Sharing",
      description: "Share documents with team members or external stakeholders effortlessly"
    }
  ]

  const documents = [
    { name: "Q4 Budget Proposal.pdf", size: "2.4 MB", type: "pdf", shared: true },
    { name: "Team Retrospective.pptx", size: "8.1 MB", type: "ppt", shared: false },
    { name: "Meeting Notes - Nov 2024.docx", size: "1.2 MB", type: "doc", shared: true },
    { name: "Project Timeline.xlsx", size: "876 KB", type: "excel", shared: false }
  ]

  return (
    <section className="py-24 bg-gradient-to-b from-teal-50/30 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Visual */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-teal-100/60">
              {/* Header */}
              <div className="bg-gradient-to-r from-teal-500 to-teal-600 px-6 py-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-lg font-semibold text-white">Meeting Documents</h4>
                  <FileText className="w-5 h-5 text-teal-100" />
                </div>
              </div>

              {/* Upload Area */}
              <div className="p-6 border-b border-slate-100">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="border-2 border-dashed border-teal-300 rounded-2xl p-8 text-center hover:border-teal-400 hover:bg-teal-50/50 transition-all duration-300 cursor-pointer"
                >
                  <Upload className="w-8 h-8 text-teal-500 mx-auto mb-3" />
                  <p className="text-slate-700 font-medium mb-1">Drop files here to upload</p>
                  <p className="text-slate-500 text-sm">or click to browse</p>
                </motion.div>
              </div>

              {/* Documents List */}
              <div className="p-6 space-y-3">
                {documents.map((doc, index) => (
                  <motion.div
                    key={doc.name}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                    className="flex items-center justify-between p-3 hover:bg-teal-50 rounded-2xl transition-colors duration-300 group"
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        doc.type === 'pdf' ? 'bg-red-100' :
                        doc.type === 'ppt' ? 'bg-orange-100' :
                        doc.type === 'doc' ? 'bg-blue-100' : 'bg-green-100'
                      }`}>
                        <FileText className={`w-5 h-5 ${
                          doc.type === 'pdf' ? 'text-red-600' :
                          doc.type === 'ppt' ? 'text-orange-600' :
                          doc.type === 'doc' ? 'text-blue-600' : 'text-green-600'
                        }`} />
                      </div>
                      <div>
                        <p className="font-medium text-slate-900 group-hover:text-teal-700 transition-colors">
                          {doc.name}
                        </p>
                        <p className="text-sm text-slate-500">{doc.size}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {doc.shared && (
                        <div className="w-2 h-2 bg-green-400 rounded-full" title="Shared" />
                      )}
                      <Download className="w-4 h-4 text-slate-400 group-hover:text-teal-500 transition-colors cursor-pointer" />
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Floating share indicator */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="absolute -top-4 -right-4 bg-green-500 text-white rounded-2xl px-4 py-2 shadow-lg"
            >
              <div className="flex items-center space-x-2">
                <Share2 className="w-4 h-4" />
                <span className="text-sm font-medium">Live sync</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
              Documents &{' '}
              <span className="bg-gradient-to-r from-teal-600 to-teal-400 bg-clip-text text-transparent">
                Attachments
              </span>
            </h2>
            <p className="text-xl text-slate-600 mb-10 leading-relaxed">
              Centralize all your meeting materials in one secure, searchable location. Share, collaborate, and never lose important documents again.
            </p>

            <div className="space-y-6">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                  className="flex items-start space-x-4 group"
                >
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-teal-100 to-teal-200 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <feature.icon className="w-6 h-6 text-teal-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-2 group-hover:text-teal-600 transition-colors duration-300">
                      {feature.title}
                    </h3>
                    <p className="text-slate-600 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="mt-10"
            >
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl hover:shadow-teal-500/25 transition-all duration-300"
              >
                Start Organizing Documents
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}