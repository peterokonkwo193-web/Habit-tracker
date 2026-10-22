"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Zap, Target } from "lucide-react";
import { Button } from "@/components/ui/button";

const DEMO_HABITS = [
  { emoji: "💧", name: "Drink 8 glasses of water", streak: 14, done: true },
  { emoji: "🏃", name: "Morning run", streak: 7, done: true },
  { emoji: "📚", name: "Read for 30 minutes", streak: 21, done: false },
  { emoji: "🧘", name: "Meditate", streak: 3, done: false },
];

export function LandingHero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-16 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[rgba(37,99,235,0.08)] rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[rgba(16,185,129,0.08)] rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: Text content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center lg:text-left space-y-8"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[rgba(37,99,235,0.1)] border border-[rgba(37,99,235,0.2)] text-sm font-medium text-[rgb(37,99,235)]">
              <Sparkles className="h-4 w-4" />
              Trusted by 10,000+ habit builders
            </div>

            <div className="space-y-4">
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.1] tracking-tight text-[rgb(15,23,42)] dark:text-white">
                Build better
                <br />
                <span className="gradient-text">habits daily</span>
              </h1>
              <p className="text-xl text-[rgb(100,116,139)] max-w-lg mx-auto lg:mx-0">
                Track your habits, build powerful streaks, and get personalized
                Telegram reminders. Your daily companion for lasting change.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button asChild size="lg" className="text-base shadow-xl shadow-[rgba(37,99,235,0.3)]">
                <Link href="/register">
                  Start Building Better Habits
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <a href="#demo">View Demo</a>
              </Button>
            </div>

            <div className="flex flex-col sm:flex-row gap-6 justify-center lg:justify-start text-sm text-[rgb(100,116,139)]">
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-[rgb(245,158,11)]" />
                <span>Free forever plan</span>
              </div>
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 text-[rgb(16,185,129)]" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-[rgb(37,99,235)]" />
                <span>Telegram integration</span>
              </div>
            </div>
          </motion.div>

          {/* Right: App preview */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="relative bg-white dark:bg-[rgb(15,23,42)] rounded-3xl shadow-2xl border border-[rgb(226,232,240)] dark:border-[rgb(30,41,59)] p-6 overflow-hidden">
              {/* App header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-xs text-[rgb(100,116,139)]">Monday, Jun 23</p>
                  <h3 className="text-lg font-semibold text-[rgb(15,23,42)] dark:text-white">Today's Habits</h3>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-[rgb(37,99,235)]">75%</p>
                  <p className="text-xs text-[rgb(100,116,139)]">complete</p>
                </div>
              </div>

              {/* Progress bar */}
              <div className="h-2.5 bg-[rgb(226,232,240)] dark:bg-[rgb(30,41,59)] rounded-full mb-6 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "75%" }}
                  transition={{ duration: 1, delay: 0.5 }}
                  className="h-full bg-gradient-to-r from-[rgb(37,99,235)] to-[rgb(16,185,129)] rounded-full"
                />
              </div>

              {/* Habit list */}
              <div className="space-y-3">
                {DEMO_HABITS.map((habit, i) => (
                  <motion.div
                    key={habit.name}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.4 + i * 0.1 }}
                    className={`flex items-center gap-4 p-3.5 rounded-2xl border transition-all ${
                      habit.done
                        ? "bg-[rgba(16,185,129,0.05)] border-[rgba(16,185,129,0.2)]"
                        : "bg-[rgb(248,250,252)] dark:bg-[rgb(30,41,59)] border-[rgb(226,232,240)] dark:border-[rgb(30,41,59)]"
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0 ${
                      habit.done ? "bg-[rgba(16,185,129,0.1)]" : "bg-white dark:bg-[rgb(15,23,42)] shadow-sm"
                    }`}>
                      {habit.emoji}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium truncate ${
                        habit.done
                          ? "text-[rgb(100,116,139)] line-through"
                          : "text-[rgb(15,23,42)] dark:text-white"
                      }`}>
                        {habit.name}
                      </p>
                      <p className="text-xs text-[rgb(100,116,139)]">
                        🔥 {habit.streak} day streak
                      </p>
                    </div>
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                      habit.done
                        ? "bg-[rgb(16,185,129)]"
                        : "border-2 border-[rgb(226,232,240)] dark:border-[rgb(30,41,59)]"
                    }`}>
                      {habit.done && (
                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Stats row */}
              <div className="mt-6 pt-4 border-t border-[rgb(226,232,240)] dark:border-[rgb(30,41,59)] grid grid-cols-3 gap-3">
                {[
                  { label: "Streak", value: "21d", color: "text-[rgb(245,158,11)]" },
                  { label: "This week", value: "89%", color: "text-[rgb(37,99,235)]" },
                  { label: "Done today", value: "3/4", color: "text-[rgb(16,185,129)]" },
                ].map((stat) => (
                  <div key={stat.label} className="text-center">
                    <p className={`text-xl font-bold ${stat.color}`}>{stat.value}</p>
                    <p className="text-xs text-[rgb(100,116,139)]">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Floating badges */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="absolute -top-4 -right-4 bg-[rgb(245,158,11)] text-white text-sm font-bold px-4 py-2 rounded-2xl shadow-lg"
            >
              🔥 21 day streak!
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 1 }}
              className="absolute -bottom-4 -left-4 bg-white dark:bg-[rgb(15,23,42)] border border-[rgb(226,232,240)] dark:border-[rgb(30,41,59)] px-4 py-2.5 rounded-2xl shadow-lg"
            >
              <p className="text-xs text-[rgb(100,116,139)]">Telegram reminder</p>
              <p className="text-sm font-medium text-[rgb(15,23,42)] dark:text-white">📬 Good morning! 3 habits await</p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
