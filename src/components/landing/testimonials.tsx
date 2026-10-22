"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";

const TESTIMONIALS = [
  {
    name: "Sarah Chen",
    role: "Product Manager",
    avatar: "SC",
    rating: 5,
    text: "StreakFlow completely changed how I approach my daily routine. The Telegram reminders are a game-changer — I never forget my habits anymore.",
    streak: "89 day streak",
  },
  {
    name: "Marcus Johnson",
    role: "Software Engineer",
    avatar: "MJ",
    rating: 5,
    text: "The analytics are incredible. Being able to see my habit heatmap like GitHub commits keeps me motivated to maintain my streaks.",
    streak: "120 day streak",
  },
  {
    name: "Priya Patel",
    role: "Fitness Coach",
    avatar: "PP",
    rating: 5,
    text: "I recommend StreakFlow to all my clients. It's the cleanest habit tracker I've found. Simple enough for beginners, powerful for pros.",
    streak: "45 day streak",
  },
  {
    name: "Tom Weber",
    role: "Entrepreneur",
    avatar: "TW",
    rating: 5,
    text: "The Telegram bot is brilliant. I get my morning list, tick things off by replying numbers, and get my evening summary. Perfect flow.",
    streak: "200+ day streak",
  },
  {
    name: "Lisa Park",
    role: "Student",
    avatar: "LP",
    rating: 5,
    text: "Free plan is extremely generous. Built 5 solid habits in my first month. The UI is beautiful and so easy to use.",
    streak: "33 day streak",
  },
  {
    name: "David Kim",
    role: "Marketing Director",
    avatar: "DK",
    rating: 5,
    text: "Switched from another tracker and haven't looked back. The dark mode and design quality feel premium. Worth every penny.",
    streak: "67 day streak",
  },
];

export function LandingTestimonials() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16 space-y-4"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[rgba(245,158,11,0.1)] text-sm font-medium text-[rgb(245,158,11)]">
            ⭐ Loved by 10,000+ users
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-[rgb(15,23,42)] dark:text-white">
            People love
            <br />
            <span className="gradient-text">StreakFlow</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-6 rounded-2xl border border-[rgb(226,232,240)] dark:border-[rgb(30,41,59)] bg-white dark:bg-[rgb(15,23,42)] hover:shadow-md transition-all duration-300"
            >
              <div className="flex items-center gap-1 mb-4">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-[rgb(245,158,11)] text-[rgb(245,158,11)]" />
                ))}
              </div>
              <p className="text-sm text-[rgb(100,116,139)] leading-relaxed mb-5">{`"${t.text}"`}</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[rgb(37,99,235)] to-[rgb(16,185,129)] flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                  {t.avatar}
                </div>
                <div>
                  <p className="font-semibold text-sm text-[rgb(15,23,42)] dark:text-white">{t.name}</p>
                  <p className="text-xs text-[rgb(100,116,139)]">{t.role} · 🔥 {t.streak}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
