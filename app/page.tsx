"use client";
import React from "react";
import { Hero } from "@/components/hero";
import { FeaturesOverview } from "@/components/sections/features-overview";
import { AgendaAndNotes } from "@/components/sections/agenda-and-notes";
import { ConflictFreeScheduling } from "@/components/sections/conflict-free-scheduling";
import { CollaborationDashboard } from "@/components/sections/collaboration-dashboard";
import { FollowupsAndTasks } from "@/components/sections/followups-and-tasks";
import { Integrations } from "@/components/sections/integrations";
import { DocumentsAndAttachments } from "@/components/sections/documents-and-attachments";
import { SponsorsAndCollaboration } from "@/components/sections/sponsors-and-collaboration";
import { GetStartedCTA } from "@/components/sections/get-started-cta";
import {PlatformShowcase} from "@/components/platform-showcase";

export default function Page() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      {/* Header provided by layout.tsx */}

      {/* Hero Section */}
      <Hero />

      <PlatformShowcase />
      {/* Features Overview */}
      <FeaturesOverview />

      {/* Agenda & Notes */}
      <AgendaAndNotes />

      {/* Conflict-Free Scheduling */}
      <ConflictFreeScheduling />

      {/* Collaboration Dashboard */}
      <CollaborationDashboard />

      {/* Follow-ups & Tasks */}
      <FollowupsAndTasks />

      {/* Integrations */}
      <Integrations />

      {/* Documents & Attachments */}
      <DocumentsAndAttachments />

      {/* Sponsors and Collaboration */}
      <SponsorsAndCollaboration />

      {/* Get Started / Call to Action */}
      <GetStartedCTA />
    </main>
  );
}