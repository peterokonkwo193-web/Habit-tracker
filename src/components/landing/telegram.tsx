"use client";

import { motion } from "framer-motion";
import { MessageCircle, Check, Bell, Moon } from "lucide-react";

const MESSAGES = [
  {
    type: "bot",
    text: "Good Morning! 👋\n\nToday's Habits:\n1. 💧 Drink water\n2. 🏃 Morning run\n3. 📚 Read 30 min\n\nReply with the number to mark complete!",
    time: "8:00 AM",
  },
  { type: "user", text: "1", time: "8:05 AM" },
  {
    type: "bot",
    text: "✅ 'Drink water' marked complete!\n\n🔥 Streak: 15 days — keep it up!",
    time: "8:05 AM",
  },
  { type: "user", text: "2", time: "8:32 AM" },
  {
    type: "bot",
    text: "✅ 'Morning run' marked complete!\n\n🎯 2/3 habits done today. Great progress!",
    time: "8:32 AM",
  },
];

export function LandingTelegram() {
  return (
    <section id="telegram" className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Chat preview */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="order-2 lg:order-1"
          >
            <div className="max-w-sm mx-auto">
              {/* Phone frame */}
              <div className="bg-[rgb(15,23,42)] rounded-[40px] p-4 shadow-2xl">
                {/* Status bar */}
                <div className="flex items-center justify-between px-4 mb-3">
                  <span className="text-white text-xs">9:41 AM</span>
                  <div className="flex items-center gap-1">
                    <div className="w-4 h-2 border border-white rounded-sm"><div className="h-full w-3/4 bg-white rounded-sm" /></div>
                  </div>
                </div>

                {/* Chat header */}
                <div className="bg-[rgb(37,99,235)] rounded-t-2xl px-4 py-3 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
                    <span className="text-white text-sm font-bold">H</span>
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm">HabitFlow Bot</p>
                    <p className="text-blue-200 text-xs">online</p>
                  </div>
                </div>

                {/* Messages */}
                <div className="bg-[rgb(226,232,240)] dark:bg-[rgb(30,41,59)] rounded-b-2xl p-3 space-y-2 min-h-72">
                  {MESSAGES.map((msg, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.15 }}
                      className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[85%] px-3 py-2 rounded-2xl text-xs whitespace-pre-line shadow-sm ${
                          msg.type === "bot"
                            ? "bg-white text-[rgb(15,23,42)] rounded-tl-sm"
                            : "bg-[rgb(37,99,235)] text-white rounded-tr-sm"
                        }`}
                      >
                        {msg.text}
                        <p className={`text-[10px] mt-1 opacity-60 ${msg.type === "user" ? "text-right" : ""}`}>
                          {msg.time}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Text content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="order-1 lg:order-2 space-y-8"
          >
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[rgba(37,99,235,0.1)] text-sm font-medium text-[rgb(37,99,235)]">
                <MessageCircle className="h-4 w-4" />
                Telegram Integration
              </div>
              <h2 className="text-4xl sm:text-5xl font-bold text-[rgb(15,23,42)] dark:text-white">
                Track habits
                <br />
                <span className="gradient-text">from Telegram</span>
              </h2>
              <p className="text-lg text-[rgb(100,116,139)]">
                Connect your account to our Telegram bot and get smart reminders without ever
                opening the app. Mark habits complete with a single reply.
              </p>
            </div>

            <div className="space-y-4">
              {[
                {
                  icon: Bell,
                  title: "Morning Reminders",
                  desc: "Wake up to your habit list. See exactly what you need to accomplish today.",
                  color: "text-[rgb(245,158,11)]",
                  bg: "bg-[rgba(245,158,11,0.1)]",
                },
                {
                  icon: Check,
                  title: "One-tap Completion",
                  desc: "Reply with the habit number to mark it complete. Instant confirmation sent back.",
                  color: "text-[rgb(16,185,129)]",
                  bg: "bg-[rgba(16,185,129,0.1)]",
                },
                {
                  icon: Moon,
                  title: "Evening Summary",
                  desc: "End each day with a celebration of your progress and tomorrow's habits.",
                  color: "text-[rgb(37,99,235)]",
                  bg: "bg-[rgba(37,99,235,0.1)]",
                },
              ].map((item) => (
                <div key={item.title} className="flex gap-4">
                  <div className={`w-10 h-10 rounded-xl ${item.bg} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                    <item.icon className={`h-5 w-5 ${item.color}`} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-[rgb(15,23,42)] dark:text-white">{item.title}</h4>
                    <p className="text-sm text-[rgb(100,116,139)]">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
