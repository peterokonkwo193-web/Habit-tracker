"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  CheckSquare,
  BarChart2,
  User,
  Settings,
  LogOut,
  Menu,
  X,
  Shield,
  Flame,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { signOut } from "@/lib/actions/auth";
import { ThemeToggle } from "./theme-toggle";

const NAV_ITEMS = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/habits", icon: CheckSquare, label: "My Habits" },
  { href: "/analytics", icon: BarChart2, label: "Analytics" },
  { href: "/profile", icon: User, label: "Profile" },
  { href: "/settings", icon: Settings, label: "Settings" },
];

interface SidebarProps {
  profile?: { full_name: string | null; email?: string; is_admin?: boolean };
}

export function Sidebar({ profile }: SidebarProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navContent = (
    <>
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[rgb(245,158,11)] to-[rgb(239,68,68)] flex items-center justify-center shadow-md flex-shrink-0">
          <Flame className="h-5 w-5 text-white" />
        </div>
        <span className="font-bold text-lg text-[rgb(15,23,42)] dark:text-white">StreakFlow</span>
      </div>

      {/* Nav items */}
      <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                active
                  ? "bg-[rgba(37,99,235,0.1)] text-[rgb(37,99,235)]"
                  : "text-[rgb(100,116,139)] hover:bg-[rgb(241,245,249)] hover:text-[rgb(15,23,42)] dark:hover:bg-[rgb(30,41,59)] dark:hover:text-white"
              )}
            >
              <item.icon className="h-4 w-4 flex-shrink-0" />
              {item.label}
              {active && (
                <motion.div
                  layoutId="sidebar-indicator"
                  className="ml-auto w-1.5 h-1.5 rounded-full bg-[rgb(37,99,235)]"
                />
              )}
            </Link>
          );
        })}

        {profile?.is_admin && (
          <Link
            href="/admin"
            onClick={() => setMobileOpen(false)}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
              pathname.startsWith("/admin")
                ? "bg-[rgba(245,158,11,0.1)] text-[rgb(245,158,11)]"
                : "text-[rgb(100,116,139)] hover:bg-[rgb(241,245,249)] hover:text-[rgb(15,23,42)] dark:hover:bg-[rgb(30,41,59)] dark:hover:text-white"
            )}
          >
            <Shield className="h-4 w-4 flex-shrink-0" />
            Admin
          </Link>
        )}
      </nav>

      {/* Bottom section */}
      <div className="px-3 pb-4 space-y-1 border-t border-[rgb(226,232,240)] dark:border-[rgb(30,41,59)] pt-3 mt-3">
        <div className="flex items-center justify-between px-3 py-2">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[rgb(37,99,235)] to-[rgb(16,185,129)] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
              {profile?.full_name?.[0]?.toUpperCase() ?? "U"}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-[rgb(15,23,42)] dark:text-white truncate">
                {profile?.full_name ?? "User"}
              </p>
              <p className="text-xs text-[rgb(100,116,139)] truncate">{profile?.email ?? ""}</p>
            </div>
          </div>
          <ThemeToggle />
        </div>
        <form action={signOut}>
          <button
            type="submit"
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-[rgb(100,116,139)] hover:bg-[rgba(239,68,68,0.1)] hover:text-[rgb(239,68,68)] transition-all duration-200"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </button>
        </form>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-white dark:bg-[rgb(10,10,15)] border-r border-[rgb(226,232,240)] dark:border-[rgb(30,41,59)] h-screen sticky top-0 flex-shrink-0">
        {navContent}
      </aside>

      {/* Mobile hamburger */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setMobileOpen(true)}
          className="w-10 h-10 rounded-xl bg-white dark:bg-[rgb(15,23,42)] shadow-md border border-[rgb(226,232,240)] dark:border-[rgb(30,41,59)] flex items-center justify-center"
        >
          <Menu className="h-5 w-5 text-[rgb(15,23,42)] dark:text-white" />
        </button>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed left-0 top-0 bottom-0 z-50 w-[min(288px,85vw)] flex flex-col bg-white dark:bg-[rgb(10,10,15)] shadow-2xl lg:hidden"
            >
              <button
                onClick={() => setMobileOpen(false)}
                className="absolute top-4 right-4 w-8 h-8 rounded-lg flex items-center justify-center hover:bg-[rgb(241,245,249)] dark:hover:bg-[rgb(30,41,59)] transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
              {navContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
