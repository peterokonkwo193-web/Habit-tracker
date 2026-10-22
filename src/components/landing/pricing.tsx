"use client";

import { motion } from "framer-motion";
import { Check, Zap } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const PLANS = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Perfect for getting started with habit tracking.",
    features: [
      "Up to 5 habits",
      "Daily tracking",
      "Streak tracking",
      "Basic analytics",
      "7-day history",
      "Mobile-friendly UI",
    ],
    cta: "Get started free",
    href: "/register",
    popular: false,
    variant: "outline" as const,
  },
  {
    name: "Pro",
    price: "$5",
    period: "per month",
    description: "For serious habit builders who want every feature.",
    features: [
      "Unlimited habits",
      "Telegram bot integration",
      "Advanced analytics",
      "Full history & heatmap",
      "Custom reminder times",
      "Drag & drop reordering",
      "Priority support",
      "Export data",
    ],
    cta: "Start 14-day free trial",
    href: "/register?plan=pro",
    popular: true,
    variant: "default" as const,
  },
  {
    name: "Team",
    price: "$15",
    period: "per month",
    description: "For teams and organizations building habits together.",
    features: [
      "Everything in Pro",
      "5 team members",
      "Shared habit templates",
      "Team analytics dashboard",
      "Admin controls",
      "SSO / SAML",
      "Custom branding",
      "SLA support",
    ],
    cta: "Contact sales",
    href: "/contact",
    popular: false,
    variant: "outline" as const,
  },
];

export function LandingPricing() {
  return (
    <section id="pricing" className="py-24 px-4 sm:px-6 lg:px-8 bg-[rgb(241,245,249)] dark:bg-[rgb(15,23,42)]">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16 space-y-4"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[rgba(245,158,11,0.1)] text-sm font-medium text-[rgb(245,158,11)]">
            <Zap className="h-4 w-4" />
            Simple pricing
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-[rgb(15,23,42)] dark:text-white">
            Start free,
            <br />
            <span className="gradient-text">upgrade when ready</span>
          </h2>
          <p className="text-lg text-[rgb(100,116,139)] max-w-xl mx-auto">
            No hidden fees. Cancel anytime. 14-day free trial on all paid plans.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 items-start">
          {PLANS.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`relative p-8 rounded-3xl border transition-all duration-300 ${
                plan.popular
                  ? "border-[rgb(37,99,235)] bg-white dark:bg-[rgb(10,10,15)] shadow-2xl shadow-[rgba(37,99,235,0.15)] scale-105"
                  : "border-[rgb(226,232,240)] dark:border-[rgb(30,41,59)] bg-white dark:bg-[rgb(10,10,15)] hover:shadow-lg"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-[rgb(37,99,235)] text-white text-xs font-bold px-4 py-1.5 rounded-full">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-xl font-bold text-[rgb(15,23,42)] dark:text-white mb-2">{plan.name}</h3>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-4xl font-bold text-[rgb(15,23,42)] dark:text-white">{plan.price}</span>
                  <span className="text-[rgb(100,116,139)] text-sm">/{plan.period}</span>
                </div>
                <p className="text-sm text-[rgb(100,116,139)]">{plan.description}</p>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-3 text-sm text-[rgb(100,116,139)]">
                    <Check className="h-4 w-4 text-[rgb(16,185,129)] flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>

              <Button asChild variant={plan.variant} className="w-full" size="lg">
                <Link href={plan.href}>{plan.cta}</Link>
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
