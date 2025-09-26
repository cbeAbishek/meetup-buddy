"use client";
import React from "react";
import { Hero } from "@/components/hero";
import { PlatformShowcase } from "@/components/platform-showcase";
import { ProjectFeatures } from "@/components/project-features";

export default function Page() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      {/* Header provided by layout.tsx */}

      {/* Hero */}
      <Hero />
      <PlatformShowcase />
      <ProjectFeatures />
    </main>
  );
}