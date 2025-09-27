"use client";
import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

export function Hero() {
  const [openDemo, setOpenDemo] = useState(false);

  return (
    <section className="container mx-auto px-6 py-24 lg:py-32 relative">
      {/* Gradient Background Accent */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-[color:var(--primary)]/5 via-transparent to-[color:var(--primary)]/10" />

      <div className="grid lg:grid-cols-2 gap-16 items-center">
        {/* Text Content */}
        <div>
          <motion.h1
            className="text-5xl sm:text-6xl font-extrabold leading-tight text-gray-900 dark:text-white"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <span className="bg-gradient-to-r from-[color:var(--primary)] to-teal-500 bg-clip-text text-transparent">
              Meetup Buddy
            </span>{" "}
            — smarter meetings, less busywork
          </motion.h1>

          <motion.p
            className="mt-6 text-lg text-gray-600 dark:text-gray-300 max-w-xl"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            Find the best cross-time-zone slots, auto-generate agendas from
            meeting history, and track follow-ups with a trust score — demo-ready
            and lightweight.
          </motion.p>

          <ul className="mt-6 space-y-2 text-base text-gray-600 dark:text-gray-300">
            <li>• Smart Slot Finder for cross-time-zone meetings</li>
            <li>• One-click Agenda generator (editable)</li>
            <li>• Follow-up tracker with ownership and deadlines</li>
          </ul>

          <div className="mt-8 flex flex-wrap gap-4">
            <a href="/auth" aria-label="Get started">
              <Button size="lg" className="px-8">
                Get started
              </Button>
            </a>
            <Button
              size="lg"
              variant="outline"
              className="px-8 border-[color:var(--primary)] text-[color:var(--primary)] hover:bg-[color:var(--primary)] hover:text-white transition-colors"
              onClick={() => setOpenDemo(true)}
            >
              See demo
            </Button>
          </div>
        </div>

        {/* Illustration / Demo */}
        <motion.div
          className="relative rounded-3xl shadow-xl overflow-hidden bg-white dark:bg-gray-900"
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <Image
            src="/assets/illustrations/meeting-illustration.svg"
            alt="Meetup Buddy illustration"
            width={1200}
            height={700}
            className="w-full h-auto object-cover"
            priority
          />

          {/* Floating Accent Cards */}
          <motion.div
            className="absolute left-4 top-4 w-36 bg-white/90 dark:bg-gray-800 rounded-lg p-3 shadow-lg border border-gray-200 dark:border-gray-700"
            initial={{ y: -8, opacity: 0 }}
            animate={{ y: [ -8, 0, -8 ], opacity: 1 }}
            transition={{ duration: 4, repeat: Infinity, repeatType: "reverse" }}
          >
            <div className="text-xs text-gray-500">Next</div>
            <div className="flex items-center gap-2 mt-1">
              <div className="flex items-center justify-center w-8 h-8 rounded bg-[color:var(--primary)]/10 text-[color:var(--primary)] font-semibold">24</div>
              <div className="text-sm font-medium">Sync • 10:00</div>
            </div>
          </motion.div>

          <motion.div
            className="absolute right-6 top-10 w-44 bg-white/90 dark:bg-gray-800 rounded-lg p-3 shadow-lg border border-gray-200 dark:border-gray-700"
            initial={{ x: 12, opacity: 0 }}
            animate={{ x: [12, 0, 12], opacity: 1 }}
            transition={{ duration: 5, repeat: Infinity, repeatType: "reverse" }}
          >
            <div className="text-xs text-gray-500">Agenda</div>
            <div className="mt-2 text-sm text-gray-700 dark:text-gray-200">• Review OKRs</div>
            <div className="text-sm text-gray-700 dark:text-gray-200">• Follow-ups</div>
          </motion.div>

          {/* Play Button */}
          <motion.button
            className="absolute z-10 rounded-full bg-[color:var(--primary)] shadow-xl flex items-center justify-center text-white"
            style={{ width: 64, height: 64, right: 20, bottom: 20 }}
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setOpenDemo(true)}
            aria-label="Open demo preview"
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M5 3v18l15-9L5 3z" fill="currentColor" />
            </svg>
          </motion.button>
        </motion.div>
      </div>

      {/* Demo Modal */}
      <AnimatePresence>
        {openDemo && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/70 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpenDemo(false)}
          >
            <motion.div
              className="w-full max-w-4xl rounded-xl overflow-hidden bg-white dark:bg-gray-900 shadow-2xl"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative">
                <Image
                  src="/assets/illustrations/meeting-illustration.svg"
                  alt="Meetup demo large"
                  width={1200}
                  height={600}
                  className="w-full h-auto object-cover"
                />
                <button
                  onClick={() => setOpenDemo(false)}
                  className="absolute top-3 right-3 rounded-md bg-white/90 px-3 py-1 text-sm shadow"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
