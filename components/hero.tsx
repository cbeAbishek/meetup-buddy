"use client";
import React from "react";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="container mx-auto px-6 py-20">
      <div className="lg:flex lg:items-center lg:gap-12">
        <div className="lg:flex-1">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-[color:var(--primary)]">
            Meetup Buddy — smarter meetings, less busywork
          </h1>
          <p className="mt-4 text-lg text-[color:var(--muted-foreground)] max-w-xl">
            Find the best cross-time-zone slots, auto-generate agendas from meeting history,
            and track follow-ups with a trust score — demo-ready and lightweight.
          </p>
          <div className="mt-8 flex gap-3">
            <Button>Get started</Button>
            <Button variant="outline" className="text-[color:var(--primary)] border-[color:var(--primary)]">See demo</Button>
          </div>
        </div>

        <div className="mt-8 lg:mt-0 lg:w-1/2">
          <div className="rounded-2xl bg-gradient-to-br from-white to-slate-50 shadow-lg p-6">
            <div className="h-48 bg-gradient-to-br from-[color:var(--brand-50)] to-[color:var(--brand-100)] rounded-md flex items-center justify-center text-[color:var(--primary)] font-medium">
              Demo preview (replace with /public/preview.png)
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
