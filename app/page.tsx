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
import { PlatformShowcase } from "@/components/platform-showcase";
import { ProjectFeatures } from "@/components/project-features";

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
      <PlatformShowcase />
      <ProjectFeatures />

      {/* Supabase test */}
      <section id="supabase" className="container mx-auto px-6 py-12">
        <h2 className="text-2xl font-bold mb-4">Supabase quick test</h2>
        <SupabaseTester />
      </section>
    </main>
  );
}