"use client";

import { motion } from "framer-motion";
import { BarChart3, Bell, Flame, Target, Smartphone, Shield } from "lucide-react";

const FEATURES = [
  {
    icon: Target,
    title: "Smart Habit Tracking",
    description: "Create habits with custom schedules — daily, weekdays, weekends, or custom days. Add emojis and categories.",
    color: "text-[rgb(37,99,235)]",
    bg: "bg-[rgba(37,99,235,0.1)]",
  },
  {
    icon: Flame,
    title: "Streak Tracking",
    description: "Build momentum with powerful streak counters. Never miss a day with smart reminders and motivational milestones.",
    color: "text-[rgb(245,158,11)]",
    bg: "bg-[rgba(245,158,11,0.1)]",
  },
  {
    icon: BarChart3,
    title: "Advanced Analytics",
    description: "GitHub-style heatmap, weekly/monthly charts, and per-habit analytics to visualize your progress.",
    color: "text-[rgb(16,185,129)]",
    bg: "bg-[rgba(16,185,129,0.1)]",
  },
  {
    icon: Bell,
    title: "Telegram Reminders",
    description: "Get morning reminders and evening summaries directly in Telegram. Mark habits complete with a single reply.",
    color: "text-[rgb(37,99,235)]",
    bg: "bg-[rgba(37,99,235,0.08)]",
  },
  {
    icon: Smartphone,
    title: "Mobile-First Design",
    description: "Beautifully responsive on every device. Use it on your phone, tablet, or desktop with a consistent experience.",
    color: "text-[rgb(139,92,246)]",
    bg: "bg-[rgba(139,92,246,0.1)]",
  },
  {
    icon: Shield,
    title: "Privacy & Security",
    description: "Row-level security, encrypted data, and Supabase Auth. Your habit data belongs to you — always.",
    color: "text-[rgb(16,185,129)]",
    bg: "bg-[rgba(16,185,129,0.08)]",
  },
];

export function LandingFeatures() {
  return (
    <section id="features" className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16 space-y-4"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[rgba(37,99,235,0.1)] text-sm font-medium text-[rgb(37,99,235)]">
            Everything you need
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-[rgb(15,23,42)] dark:text-white">
            Powerful features for
            <br />
            <span className="gradient-text">lasting habits</span>
          </h2>
          <p className="text-lg text-[rgb(100,116,139)] max-w-2xl mx-auto">
            StreakFlow combines smart tracking, beautiful analytics, and seamless Telegram integration
            to make building habits effortless.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group p-6 rounded-2xl border border-[rgb(226,232,240)] dark:border-[rgb(30,41,59)] bg-white dark:bg-[rgb(15,23,42)] hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
            >
              <div className={`w-12 h-12 rounded-2xl ${feature.bg} flex items-center justify-center mb-5`}>
                <feature.icon className={`w-6 h-6 ${feature.color}`} />
              </div>
              <h3 className="text-lg font-semibold text-[rgb(15,23,42)] dark:text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-[rgb(100,116,139)] leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
