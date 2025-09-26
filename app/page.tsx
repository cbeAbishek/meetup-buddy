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
  const features = [
    {
      title: "Fast to build",
      desc: "Prebuilt UI primitives and concise patterns so you can prototype quickly.",
    },
    {
      title: "Accessible",
      desc: "Focus on accessibility and consistent behavior across browsers.",
    },
    {
      title: "Composable",
      desc: "Small composable components you can combine to create interfaces.",
    },
  ];

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      {/* Header */}
      <header className="border-b bg-white/50 backdrop-blur sticky top-0 z-20">
        <div className="container mx-auto flex items-center justify-between py-4 px-6">
          <div className="flex items-center gap-4">
            <div className="text-2xl font-extrabold">YourBrand</div>
            <nav className="hidden md:flex gap-4 text-sm text-slate-600">
              <a className="hover:text-slate-900" href="#features">Features</a>
              <a className="hover:text-slate-900" href="#pricing">Pricing</a>
              <a className="hover:text-slate-900" href="#contact">Contact</a>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="destructive" asChild>
              <a href="/auth" className="text-sm">Sign in</a>
            </Button>
            <Button asChild>
              <a href="/auth">Get started</a>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="container mx-auto px-6 py-20 flex flex-col-reverse lg:flex-row items-center gap-12">
        <div className="w-full lg:w-1/2">
          <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight">
            Build beautiful interfaces faster with shadcn-ui
          </h1>
          <p className="mt-4 text-lg text-slate-600 max-w-xl">
            A minimal, accessible set of UI primitives built with Tailwind CSS — perfect for
            prototyping and production apps alike.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button>Get started</Button>
            <Button variant="outline">Learn more</Button>
          </div>
        </div>

        <div className="w-full lg:w-1/2 flex justify-center">
          <div className="w-full max-w-md">
            <div className="rounded-2xl bg-gradient-to-br from-white to-slate-50 shadow-lg p-6">
              <pre className="rounded-md bg-slate-900 text-slate-50 p-4 text-sm overflow-auto">
{`// Example

<Button>Click me</Button>`}
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="container mx-auto px-6 py-12">
        <h2 className="text-2xl font-bold mb-6">What you get</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((f) => (
            <Card key={f.title} className="hover:shadow-xl transition-shadow">
              <CardHeader>
                <CardTitle>{f.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-600">{f.desc}</p>
              </CardContent>
            </Card>
          ))}
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