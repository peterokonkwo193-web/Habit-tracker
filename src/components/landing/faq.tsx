"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

const FAQS = [
  {
    q: "Is StreakFlow really free?",
    a: "Yes! The free plan is genuinely free — no credit card required. You can track up to 5 habits forever. Upgrade to Pro for unlimited habits, Telegram integration, and advanced analytics.",
  },
  {
    q: "How does the Telegram integration work?",
    a: "Go to your Profile page and click 'Connect Telegram'. You'll get a unique verification code. Open @HabitFlowApp_bot on Telegram, send /start and then your code. That's it — your account is linked and you'll start receiving reminders.",
  },
  {
    q: "Can I track habits on custom days?",
    a: "Yes! You can set habits to daily, weekdays only, weekends only, or choose specific custom days (e.g., Monday, Wednesday, Friday). The app will only show your habit on the days you've selected.",
  },
  {
    q: "How are streaks calculated?",
    a: "Streaks count consecutive days you completed a habit. If you miss a day, your streak resets to 1 on the next completion. We use your timezone to correctly calculate daily completions.",
  },
  {
    q: "Can I export my data?",
    a: "Pro and Team plan users can export all their habit data as CSV. Your data is always yours and you can delete your account and all data at any time.",
  },
  {
    q: "Is my data secure?",
    a: "Absolutely. We use Supabase with row-level security, ensuring your data is completely isolated from other users. All connections are encrypted, and we never share your data with third parties.",
  },
  {
    q: "Can I use StreakFlow on mobile?",
    a: "StreakFlow is fully responsive and works beautifully on all devices. There's also a dedicated mobile app in development. For now, the web app works as a Progressive Web App (PWA) on iOS and Android.",
  },
  {
    q: "How do I cancel my subscription?",
    a: "You can cancel anytime from your Profile settings. Your Pro features remain active until the end of your billing period, then you're automatically downgraded to the free plan.",
  },
];

export function LandingFAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16 space-y-4"
        >
          <h2 className="text-4xl sm:text-5xl font-bold text-[rgb(15,23,42)] dark:text-white">
            Frequently asked
            <br />
            <span className="gradient-text">questions</span>
          </h2>
        </motion.div>

        <div className="space-y-3">
          {FAQS.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="border border-[rgb(226,232,240)] dark:border-[rgb(30,41,59)] rounded-2xl overflow-hidden bg-white dark:bg-[rgb(15,23,42)]"
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between p-5 text-left hover:bg-[rgb(248,250,252)] dark:hover:bg-[rgb(30,41,59)] transition-colors"
              >
                <span className="font-semibold text-[rgb(15,23,42)] dark:text-white text-sm pr-4">
                  {faq.q}
                </span>
                <ChevronDown
                  className={`h-5 w-5 text-[rgb(100,116,139)] flex-shrink-0 transition-transform duration-200 ${
                    open === i ? "rotate-180" : ""
                  }`}
                />
              </button>
              <AnimatePresence>
                {open === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 pb-5 text-sm text-[rgb(100,116,139)] leading-relaxed border-t border-[rgb(226,232,240)] dark:border-[rgb(30,41,59)] pt-4">
                      {faq.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
