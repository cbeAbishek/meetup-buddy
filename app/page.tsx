"use client";
import React, { useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";

import { supabase } from "@/lib/supabase";
import { Hero } from "@/components/hero";
import { FeatureCard } from "@/components/feature-card";

function SupabaseTester() {
  const [table, setTable] = useState('')
  const [rows, setRows] = useState<any[] | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const runTest = useCallback(async () => {
    setError(null)
    setRows(null)
    if (!table) {
      setError('Enter a table name')
      return
    }
    setLoading(true)
    try {
      const { data, error } = await supabase.from(table).select('*').limit(10)
      if (error) {
        setError(error.message)
      } else {
        setRows(data as any[])
      }
    } catch (err: any) {
      setError(err?.message ?? String(err))
    } finally {
      setLoading(false)
    }
  }, [table])

  return (
    <div className="max-w-xl">
      <div className="flex gap-2 mb-3">
        <input value={table} onChange={(e) => setTable(e.target.value)} className="flex-1 border px-3 py-2 rounded" placeholder="table name (e.g. users)" />
        <Button onClick={runTest} disabled={loading}>
          {loading ? 'Running...' : 'Test Supabase'}
        </Button>
      </div>

      {error && <div className="text-sm text-red-600 mb-2">Error: {error}</div>}

      {rows && (
        <div className="bg-white border rounded p-3">
          <div className="text-sm text-slate-600 mb-2">Rows (showing up to 10):</div>
          <pre className="text-xs overflow-auto max-h-64">{JSON.stringify(rows, null, 2)}</pre>
        </div>
      )}
    </div>
  )
}

export default function Page() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      {/* Header provided by layout.tsx */}

      {/* Hero */}
      <Hero />

      {/* Features */}
      <section id="features" className="container mx-auto px-6 py-12">
        <h2 className="text-2xl font-bold mb-6">What you get</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FeatureCard title="Smart Slot Finder" desc="Find cross-time-zone slots that respect preferences and past context." />
          <FeatureCard title="Auto Agenda Generator" desc="Create agendas from meeting history and sales context in one click." />
          <FeatureCard title="Follow-Up Tracker" desc="Assign, track, and visualize follow-ups with owners and deadlines." />
         </div>
       </section>

      {/* Supabase test */}
      <section id="supabase" className="container mx-auto px-6 py-12">
        <h2 className="text-2xl font-bold mb-4">Supabase quick test</h2>
        

        <SupabaseTester />
      </section>

      {/* Footer */}
      <footer className="border-t mt-12 bg-white">
        <div className="container mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-sm text-slate-600">© {new Date().getFullYear()} YourBrand. All rights reserved.</div>
          <div className="flex gap-4">
            <a className="text-sm text-slate-600 hover:text-slate-900" href="#privacy">Privacy</a>
            <a className="text-sm text-slate-600 hover:text-slate-900" href="#terms">Terms</a>
          </div>
        </div>
      </footer>
    </main>
  );
}