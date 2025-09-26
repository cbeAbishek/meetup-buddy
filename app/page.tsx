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