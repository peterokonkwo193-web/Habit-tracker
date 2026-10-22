import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/layout/theme-provider";
import { Toaster } from "sonner";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "StreakFlow – Build Unbreakable Streaks Daily",
    template: "%s | StreakFlow",
  },
  description:
    "StreakFlow helps you build and track daily habits with streak tracking, analytics, and Telegram reminders.",
  keywords: ["habit tracker", "productivity", "streak", "daily habits", "telegram bot"],
  authors: [{ name: "StreakFlow" }],
  creator: "StreakFlow",
  openGraph: {
    type: "website",
    locale: "en_US",
    title: "StreakFlow – Build Unbreakable Streaks Daily",
    description: "Track your daily habits, build streaks, and get Telegram reminders.",
    siteName: "StreakFlow",
  },
  twitter: {
    card: "summary_large_image",
    title: "StreakFlow",
    description: "Build better habits with streaks, analytics, and Telegram integration.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F8FAFC" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0f" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-[rgb(248,250,252)] dark:bg-[rgb(10,10,15)]">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange={false}
        >
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                borderRadius: "12px",
                fontSize: "14px",
              },
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
