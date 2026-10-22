"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export function LandingCTA() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-[rgb(241,245,249)] dark:bg-[rgb(15,23,42)]">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative p-12 rounded-3xl bg-gradient-to-br from-[rgb(37,99,235)] to-[rgb(16,185,129)] overflow-hidden"
        >
          {/* Background decoration */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-16 -right-16 w-64 h-64 bg-white/10 rounded-full" />
            <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-white/10 rounded-full" />
          </div>

          <div className="relative space-y-6">
            <div className="flex justify-center">
              <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center">
                <Sparkles className="h-8 w-8 text-white" />
              </div>
            </div>

            <div className="space-y-3">
              <h2 className="text-4xl sm:text-5xl font-bold text-white">
                Ready to build better habits?
              </h2>
              <p className="text-lg text-blue-100 max-w-2xl mx-auto">
                Join 10,000+ people who are transforming their daily routines with StreakFlow.
                Start free — no credit card required.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                size="lg"
                className="bg-white text-[rgb(37,99,235)] hover:bg-blue-50 shadow-xl font-semibold text-base"
              >
                <Link href="/register">
                  Start Building Better Habits
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-white/40 text-white hover:bg-white/10 text-base"
              >
                <Link href="/login">Sign in</Link>
              </Button>
            </div>

            <p className="text-sm text-blue-100">
              Free forever · No credit card · Cancel anytime
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
