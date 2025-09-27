'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { FileText, Share2, Download, Lock } from 'lucide-react'

export function DocumentSharingSection() {
  return (
    <section className="py-24 bg-gradient-to-b from-white to-teal-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="bg-white rounded-3xl shadow-2xl p-8 border border-teal-100/60">
              <div className="flex items-center justify-between mb-6">
                <h4 className="text-lg font-semibold text-slate-900">Meeting Documents</h4>
                <Share2 className="w-5 h-5 text-teal-600" />
              </div>
              
              <div className="space-y-4">
                {[
                  { name: "Project Proposal.pdf", size: "2.4 MB", shared: true, type: "pdf" },
                  { name: "Budget Analysis.xlsx", size: "1.8 MB", shared: false, type: "excel" },
                  { name: "Design Mockups.fig", size: "12.3 MB", shared: true, type: "design" },
                  { name: "Meeting Notes.docx", size: "856 KB", shared: true, type: "doc" }
                ].map((doc, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
                    className="flex items-center justify-between p-4 hover:bg-teal-50 rounded-xl transition-colors group"
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        doc.type === 'pdf' ? 'bg-red-100' :
                        doc.type === 'excel' ? 'bg-green-100' :
                        doc.type === 'design' ? 'bg-purple-100' : 'bg-blue-100'
                      }`}>
                        <FileText className={`w-5 h-5 ${
                          doc.type === 'pdf' ? 'text-red-600' :
                          doc.type === 'excel' ? 'text-green-600' :
                          doc.type === 'design' ? 'text-purple-600' : 'text-blue-600'
                        }`} />
                      </div>
                      <div>
                        <p className="font-medium text-slate-900 group-hover:text-teal-700">
                          {doc.name}
                        </p>
                        <p className="text-sm text-slate-500">{doc.size}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      {doc.shared && (
                        <div className="w-2 h-2 bg-green-400 rounded-full" title="Shared" />
                      )}
                      <Download className="w-4 h-4 text-slate-400 group-hover:text-teal-600 cursor-pointer" />
                      <Share2 className="w-4 h-4 text-slate-400 group-hover:text-teal-600 cursor-pointer" />
                    </div>
                  </motion.div>
                ))}
              </div>
              
              <div className="mt-6 pt-4 border-t border-slate-100">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">4 files • 17.3 MB total</span>
                  <div className="flex items-center space-x-2">
                    <Lock className="w-4 h-4 text-green-600" />
                    <span className="text-green-600">Encrypted</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-4xl font-bold text-slate-900">
                Document{' '}
                <span className="bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent">
                  Sharing
                </span>
              </h2>
            </div>
            
            <p className="text-xl text-slate-600 mb-8 leading-relaxed">
              Attach and access files within meetings. Share documents securely with team members and keep everything organized in one place.
            </p>

            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <FileText className="w-6 h-6 text-purple-600 mt-1" />
                <div>
                  <h3 className="font-semibold text-slate-900 mb-2">Drag & Drop Upload</h3>
                  <p className="text-slate-600">Simply drag files into your meeting to share instantly</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <Share2 className="w-6 h-6 text-teal-600 mt-1" />
                <div>
                  <h3 className="font-semibold text-slate-900 mb-2">Permission Controls</h3>
                  <p className="text-slate-600">Set view, edit, or download permissions for each document</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <Lock className="w-6 h-6 text-green-600 mt-1" />
                <div>
                  <h3 className="font-semibold text-slate-900 mb-2">Enterprise Security</h3>
                  <p className="text-slate-600">End-to-end encryption and compliance-ready storage</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}