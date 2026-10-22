"use client";

import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

const WEEKLY_DATA = [
  { day: "Mon", completed: 5, total: 5 },
  { day: "Tue", completed: 4, total: 5 },
  { day: "Wed", completed: 5, total: 5 },
  { day: "Thu", completed: 3, total: 5 },
  { day: "Fri", completed: 5, total: 5 },
  { day: "Sat", completed: 4, total: 5 },
  { day: "Sun", completed: 2, total: 5 },
];

function seededLevel(i: number): number {
  const x = Math.sin(i * 9301 + 49297) * 233280;
  const r = x - Math.floor(x);
  return r > 0.3 ? Math.floor(r * 5) : 0;
}

const HEATMAP_DATA = Array.from({ length: 52 * 7 }, (_, i) => ({
  date: i,
  level: seededLevel(i),
}));

const LEVEL_COLORS = [
  "bg-[rgb(226,232,240)] dark:bg-[rgb(30,41,59)]",
  "bg-[rgba(37,99,235,0.2)]",
  "bg-[rgba(37,99,235,0.4)]",
  "bg-[rgba(37,99,235,0.7)]",
  "bg-[rgb(37,99,235)]",
];

export function LandingAnalytics() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-[rgb(241,245,249)] dark:bg-[rgb(15,23,42)]">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16 space-y-4"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[rgba(16,185,129,0.1)] text-sm font-medium text-[rgb(16,185,129)]">
            Analytics Preview
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-[rgb(15,23,42)] dark:text-white">
            See your progress
            <br />
            <span className="gradient-text">at a glance</span>
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white dark:bg-[rgb(10,10,15)] rounded-3xl shadow-2xl border border-[rgb(226,232,240)] dark:border-[rgb(30,41,59)] p-8"
        >
          {/* Stats row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-10">
            {[
              { label: "Total Completions", value: "2,847", color: "text-[rgb(37,99,235)]" },
              { label: "Longest Streak", value: "67 days", color: "text-[rgb(245,158,11)]" },
              { label: "Habits Tracked", value: "12", color: "text-[rgb(16,185,129)]" },
              { label: "This Month", value: "94%", color: "text-[rgb(139,92,246)]" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
                <p className="text-sm text-[rgb(100,116,139)] mt-1">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Weekly chart */}
          <div className="mb-8">
            <h4 className="text-sm font-semibold text-[rgb(100,116,139)] uppercase tracking-wide mb-4">
              Weekly Completion
            </h4>
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={WEEKLY_DATA} barSize={36}>
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "rgb(100,116,139)" }} />
                <YAxis hide domain={[0, 5]} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (!active || !payload?.length) return null;
                    const d = payload[0].payload;
                    return (
                      <div className="bg-white dark:bg-[rgb(15,23,42)] border border-[rgb(226,232,240)] dark:border-[rgb(30,41,59)] rounded-xl px-3 py-2 shadow-lg text-xs">
                        <p className="font-medium">{d.completed}/{d.total} habits</p>
                      </div>
                    );
                  }}
                />
                <Bar dataKey="completed" radius={[8, 8, 0, 0]}>
                  {WEEKLY_DATA.map((entry, i) => (
                    <Cell
                      key={i}
                      fill={entry.completed === entry.total ? "rgb(16,185,129)" : "rgb(37,99,235)"}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* GitHub heatmap */}
          <div>
            <h4 className="text-sm font-semibold text-[rgb(100,116,139)] uppercase tracking-wide mb-4">
              Activity Heatmap (Last 12 Months)
            </h4>
            <div className="overflow-hidden">
              <div
                className="grid gap-1"
                style={{
                  gridTemplateColumns: `repeat(52, minmax(0, 1fr))`,
                  gridTemplateRows: `repeat(7, minmax(0, 1fr))`,
                  gridAutoFlow: "column",
                }}
              >
                {HEATMAP_DATA.slice(0, 364).map((cell, i) => (
                  <div
                    key={i}
                    className={`w-3 h-3 rounded-sm ${LEVEL_COLORS[cell.level]}`}
                    title={`Level ${cell.level}`}
                  />
                ))}
              </div>
              <div className="flex items-center gap-2 mt-3 text-xs text-[rgb(100,116,139)] justify-end">
                <span>Less</span>
                {LEVEL_COLORS.map((c, i) => (
                  <div key={i} className={`w-3 h-3 rounded-sm ${c}`} />
                ))}
                <span>More</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
