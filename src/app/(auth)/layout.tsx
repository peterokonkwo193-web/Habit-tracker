import Link from "next/link";
import { ThemeToggle } from "@/components/layout/theme-toggle";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="flex items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[rgb(245,158,11)] to-[rgb(239,68,68)] flex items-center justify-center">
            <span className="text-white text-lg font-bold">S</span>
          </div>
          <span className="font-bold text-xl text-[rgb(15,23,42)] dark:text-white group-hover:text-[rgb(37,99,235)] transition-colors">
            StreakFlow
          </span>
        </Link>
        <ThemeToggle />
      </header>
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        {children}
      </main>
      <footer className="text-center py-4 text-sm text-[rgb(100,116,139)]">
        © {new Date().getFullYear()} StreakFlow. All rights reserved.
      </footer>
    </div>
  );
}
