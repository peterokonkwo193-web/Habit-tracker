import Link from "next/link";
import { Code2, Send, Mail } from "lucide-react";

export function LandingFooter() {
  return (
    <footer className="border-t border-[rgb(226,232,240)] dark:border-[rgb(30,41,59)] bg-white dark:bg-[rgb(10,10,15)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1 space-y-3">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[rgb(245,158,11)] to-[rgb(239,68,68)] flex items-center justify-center">
                <span className="text-white text-sm font-bold">S</span>
              </div>
              <span className="font-bold text-lg text-[rgb(15,23,42)] dark:text-white">StreakFlow</span>
            </Link>
            <p className="text-sm text-[rgb(100,116,139)] max-w-xs">
              Build better habits with streaks, analytics, and Telegram reminders.
            </p>
            <div className="flex items-center gap-3">
              <a href="#" className="w-9 h-9 rounded-xl bg-[rgb(241,245,249)] dark:bg-[rgb(30,41,59)] flex items-center justify-center text-[rgb(100,116,139)] hover:text-[rgb(37,99,235)] transition-colors">
                <Code2 className="h-4 w-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-xl bg-[rgb(241,245,249)] dark:bg-[rgb(30,41,59)] flex items-center justify-center text-[rgb(100,116,139)] hover:text-[rgb(37,99,235)] transition-colors">
                <Send className="h-4 w-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-xl bg-[rgb(241,245,249)] dark:bg-[rgb(30,41,59)] flex items-center justify-center text-[rgb(100,116,139)] hover:text-[rgb(37,99,235)] transition-colors">
                <Mail className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Product */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-[rgb(15,23,42)] dark:text-white">Product</h4>
            {["Features", "Pricing", "Changelog", "Roadmap"].map((item) => (
              <a key={item} href="#" className="block text-sm text-[rgb(100,116,139)] hover:text-[rgb(37,99,235)] transition-colors">
                {item}
              </a>
            ))}
          </div>

          {/* Resources */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-[rgb(15,23,42)] dark:text-white">Resources</h4>
            {["Blog", "Documentation", "API", "Status"].map((item) => (
              <a key={item} href="#" className="block text-sm text-[rgb(100,116,139)] hover:text-[rgb(37,99,235)] transition-colors">
                {item}
              </a>
            ))}
          </div>

          {/* Legal */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-[rgb(15,23,42)] dark:text-white">Legal</h4>
            {["Privacy Policy", "Terms of Service", "Cookie Policy", "Contact"].map((item) => (
              <a key={item} href="#" className="block text-sm text-[rgb(100,116,139)] hover:text-[rgb(37,99,235)] transition-colors">
                {item}
              </a>
            ))}
          </div>
        </div>

        <div className="pt-8 border-t border-[rgb(226,232,240)] dark:border-[rgb(30,41,59)] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-[rgb(100,116,139)]">
            © {new Date().getFullYear()} StreakFlow. All rights reserved.
          </p>
          <p className="text-sm text-[rgb(100,116,139)]">
            Built with ❤️ for habit builders everywhere
          </p>
        </div>
      </div>
    </footer>
  );
}
