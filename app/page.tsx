"use client";
import React, { useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";

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
    <Card className="max-w-xl">
      <CardHeader>
        <CardTitle>Supabase Connection Test</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2 mb-3">
          <Input 
            value={table} 
            onChange={(e) => setTable(e.target.value)} 
            placeholder="table name (e.g. users)" 
            className="flex-1"
          />
          <Button onClick={runTest} disabled={loading}>
            {loading ? 'Running...' : 'Test Supabase'}
          </Button>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-3">
            <AlertDescription>Error: {error}</AlertDescription>
          </Alert>
        )}

        {rows && (
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Rows (showing up to 10):</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="text-xs overflow-auto max-h-64 bg-muted p-2 rounded">
                {JSON.stringify(rows, null, 2)}
              </pre>
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
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