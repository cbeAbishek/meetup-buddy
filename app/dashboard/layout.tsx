import type { Metadata } from "next";
import React from "react";
import { ProtectedRoute } from "@/components/protected-route";

export const metadata: Metadata = {
  title: "Dashboard - Meetup Buddy",
  description:
    "Smarter meetings — slot finder, agenda generator, follow-up tracker",
};

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ProtectedRoute>
      <div className="dashboard-layout">
        {children}
      </div>
    </ProtectedRoute>
  );
}

