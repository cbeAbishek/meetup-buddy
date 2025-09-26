import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";
import { ConditionalClientLayout } from "@/components/conditional-client-layout";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Meetup Buddy",
  description:
    "Smarter meetings — slot finder, agenda generator, follow-up tracker",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <AuthProvider>
          <ConditionalClientLayout>
            {children}
          </ConditionalClientLayout>
        </AuthProvider>
        {/* Static footer for all pages */}
        <footer className="border-t bg-white">
          <div className="container mx-auto px-6 py-6 text-sm text-slate-600 text-center">
            © {new Date().getFullYear()} Meetup Buddy. All rights reserved.
          </div>
        </footer>
      </body>
    </html>
  );
}
