import type { Metadata } from "next";

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
    <div className="dashboard-layout">
      {children}
    </div>
  );
}
