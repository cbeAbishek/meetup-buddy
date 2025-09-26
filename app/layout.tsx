import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

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
        {/* Global header */}
        <header className="border-b bg-white/50 backdrop-blur sticky top-0 z-20">
          <div className="container mx-auto flex items-center justify-between py-4 px-6">
            <div className="flex items-center gap-4">
              <div className="text-2xl font-extrabold text-[color:var(--primary)]">
                Meetup Buddy
              </div>
              <nav className="hidden md:flex gap-4 text-sm text-slate-600">
                <a
                  className="hover:text-[color:var(--primary)]"
                  href="#features"
                >
                  Features
                </a>
                <a
                  className="hover:text-[color:var(--primary)]"
                  href="#pricing"
                >
                  Pricing
                </a>
                <a
                  className="hover:text-[color:var(--primary)]"
                  href="#contact"
                >
                  Contact
                </a>
              </nav>
            </div>

            <div className="flex items-center gap-3">
              <a
                href="/auth"
                className="text-sm text-[color:var(--primary)] font-medium"
              >
                Sign in
              </a>
              <a
                href="/auth"
                className="ml-2 px-3 py-2 rounded-md bg-[color:var(--primary)] text-[color:var(--primary-foreground)] text-sm"
              >
                Get started
              </a>
            </div>
          </div>
        </header>

        <main className="min-h-screen">{children}</main>

        {/* Simple footer for consistent layout */}
        <footer className="border-t bg-white">
          <div className="container mx-auto px-6 py-6 text-sm text-slate-600">
            © {new Date().getFullYear()} Meetup Buddy. All rights reserved.
          </div>
        </footer>
      </body>
    </html>
  );
}
