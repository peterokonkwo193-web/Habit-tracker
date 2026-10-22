"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Circle, Flame, Plus, BarChart2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const HABITS = [
  { id: 1, emoji: "💧", name: "Drink 8 glasses of water", category: "Health", streak: 14, done: false },
  { id: 2, emoji: "🏃", name: "Morning run (30 min)", category: "Fitness", streak: 7, done: false },
  { id: 3, emoji: "📚", name: "Read for 30 minutes", category: "Productivity", streak: 21, done: false },
  { id: 4, emoji: "🧘", name: "Meditate (10 min)", category: "Mindfulness", streak: 3, done: false },
  { id: 5, emoji: "💰", name: "Check budget tracker", category: "Finance", streak: 5, done: false },
];

const CATEGORY_COLORS: Record<string, string> = {
  Health: "bg-[rgba(16,185,129,0.1)] text-[rgb(16,185,129)]",
  Fitness: "bg-[rgba(245,158,11,0.1)] text-[rgb(245,158,11)]",
  Productivity: "bg-[rgba(37,99,235,0.1)] text-[rgb(37,99,235)]",
  Mindfulness: "bg-[rgba(139,92,246,0.1)] text-[rgb(139,92,246)]",
  Finance: "bg-[rgba(239,68,68,0.1)] text-[rgb(239,68,68)]",
};

export function LandingDemo() {
  const [habits, setHabits] = useState(HABITS);

  const toggle = (id: number) => {
    setHabits((prev) =>
      prev.map((h) => (h.id === id ? { ...h, done: !h.done } : h))
    );
  };

  const completed = habits.filter((h) => h.done).length;
  const percentage = Math.round((completed / habits.length) * 100);

  return (
    <section id="demo" className="py-24 px-4 sm:px-6 lg:px-8 bg-[rgb(241,245,249)] dark:bg-[rgb(15,23,42)]">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16 space-y-4"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[rgba(16,185,129,0.1)] text-sm font-medium text-[rgb(16,185,129)]">
            Interactive Demo
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-[rgb(15,23,42)] dark:text-white">
            Try it yourself
          </h2>
          <p className="text-lg text-[rgb(100,116,139)] max-w-xl mx-auto">
            Click any habit below to mark it complete. This is exactly how the real app works.
          </p>
        </motion.div>

        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white dark:bg-[rgb(10,10,15)] rounded-3xl shadow-2xl border border-[rgb(226,232,240)] dark:border-[rgb(30,41,59)] overflow-hidden"
          >
            {/* App header */}
            <div className="p-6 border-b border-[rgb(226,232,240)] dark:border-[rgb(30,41,59)]">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-[rgb(15,23,42)] dark:text-white">Today's Habits</h3>
                  <p className="text-sm text-[rgb(100,116,139)]">Monday, Jun 23</p>
                </div>
                <div className="text-right">
                  <motion.p
                    key={percentage}
                    initial={{ scale: 1.2 }}
                    animate={{ scale: 1 }}
                    className="text-3xl font-bold text-[rgb(37,99,235)]"
                  >
                    {percentage}%
                  </motion.p>
                  <p className="text-xs text-[rgb(100,116,139)]">{completed}/{habits.length} done</p>
                </div>
              </div>
              <div className="h-2.5 bg-[rgb(226,232,240)] dark:bg-[rgb(30,41,59)] rounded-full overflow-hidden">
                <motion.div
                  animate={{ width: `${percentage}%` }}
                  transition={{ duration: 0.5 }}
                  className="h-full bg-gradient-to-r from-[rgb(37,99,235)] to-[rgb(16,185,129)] rounded-full"
                />
              </div>
            </div>

            {/* Habit list */}
            <div className="p-4 space-y-2">
              <AnimatePresence>
                {habits.map((habit) => (
                  <motion.button
                    key={habit.id}
                    layout
                    onClick={() => toggle(habit.id)}
                    className={`w-full flex items-center gap-4 p-4 rounded-2xl border transition-all duration-200 text-left ${
                      habit.done
                        ? "bg-[rgba(16,185,129,0.05)] border-[rgba(16,185,129,0.2)]"
                        : "bg-[rgb(248,250,252)] dark:bg-[rgb(15,23,42)] border-[rgb(226,232,240)] dark:border-[rgb(30,41,59)] hover:border-[rgb(37,99,235)] hover:shadow-sm"
                    }`}
                  >
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl flex-shrink-0 ${
                      habit.done ? "bg-[rgba(16,185,129,0.1)]" : "bg-white dark:bg-[rgb(10,10,15)] shadow-sm"
                    }`}>
                      {habit.emoji}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`font-medium truncate ${
                        habit.done
                          ? "text-[rgb(100,116,139)] line-through"
                          : "text-[rgb(15,23,42)] dark:text-white"
                      }`}>
                        {habit.name}
                      </p>
                      <div className="flex items-center gap-3 mt-0.5">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${CATEGORY_COLORS[habit.category] || ""}`}>
                          {habit.category}
                        </span>
                        <span className="text-xs text-[rgb(100,116,139)] flex items-center gap-1">
                          <Flame className="h-3 w-3 text-[rgb(245,158,11)]" />
                          {habit.streak}d streak
                        </span>
                      </div>
                    </div>
                    {habit.done ? (
                      <CheckCircle2 className="h-6 w-6 text-[rgb(16,185,129)] flex-shrink-0" />
                    ) : (
                      <Circle className="h-6 w-6 text-[rgb(226,232,240)] dark:text-[rgb(30,41,59)] flex-shrink-0" />
                    )}
                  </motion.button>
                ))}
              </AnimatePresence>

              {completed === habits.length && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-6"
                >
                  <p className="text-2xl mb-2">🎉</p>
                  <p className="font-semibold text-[rgb(16,185,129)]">All habits completed!</p>
                  <p className="text-sm text-[rgb(100,116,139)]">Amazing work today!</p>
                </motion.div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-[rgb(226,232,240)] dark:border-[rgb(30,41,59)]">
              <Button asChild className="w-full">
                <a href="/register">
                  <Plus className="h-4 w-4" />
                  Start tracking your habits for free
                </a>
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
