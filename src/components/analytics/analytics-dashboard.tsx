"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
  CartesianGrid, Cell, Legend
} from "recharts";
import { Flame, Target, TrendingUp, Trophy, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { getDateString } from "@/lib/utils";

interface Habit { id: string; name: string; emoji: string; category: string; }
interface Log { habit_id: string; completed_date: string; }
interface Streak { habit_id: string; current_streak: number; longest_streak: number; }

const LEVEL_COLORS = [
  "bg-[rgb(226,232,240)] dark:bg-[rgb(30,41,59)]",
  "bg-[rgba(37,99,235,0.2)]",
  "bg-[rgba(37,99,235,0.4)]",
  "bg-[rgba(37,99,235,0.65)]",
  "bg-[rgb(37,99,235)]",
];

export function AnalyticsDashboard({
  habits, logs, streaks, today
}: { habits: Habit[]; logs: Log[]; streaks: Streak[]; today: string }) {
  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "90d" | "365d">("30d");

  const streakMap = useMemo(() => {
    const m: Record<string, Streak> = {};
    streaks.forEach((s) => { m[s.habit_id] = s; });
    return m;
  }, [streaks]);

  const totalCompletions = logs.length;
  const longestStreak = Math.max(0, ...streaks.map((s) => s.longest_streak));
  const bestCurrentStreak = Math.max(0, ...streaks.map((s) => s.current_streak));

  // Daily completions map
  const dailyMap = useMemo(() => {
    const m: Record<string, number> = {};
    logs.forEach((l) => {
      m[l.completed_date] = (m[l.completed_date] ?? 0) + 1;
    });
    return m;
  }, [logs]);

  // Heatmap data (last 365 days)
  const heatmapData = useMemo(() => {
    const data = [];
    for (let i = 364; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = getDateString(d);
      const count = dailyMap[dateStr] ?? 0;
      const level = count === 0 ? 0 : count <= 1 ? 1 : count <= 2 ? 2 : count <= 4 ? 3 : 4;
      data.push({ date: dateStr, count, level });
    }
    return data;
  }, [dailyMap]);

  // Weekly chart data
  const weeklyData = useMemo(() => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const result = [];
    const numDays = timeRange === "7d" ? 7 : timeRange === "30d" ? 30 : timeRange === "90d" ? 90 : 365;

    for (let i = numDays - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = getDateString(d);
      const completed = dailyMap[dateStr] ?? 0;
      result.push({
        date: dateStr,
        day: days[d.getDay()],
        label: numDays <= 30 ? `${d.getDate()}/${d.getMonth() + 1}` : days[d.getDay()],
        completed,
        total: habits.length,
        pct: habits.length > 0 ? Math.round((completed / habits.length) * 100) : 0,
      });
    }
    return result;
  }, [dailyMap, habits.length, timeRange]);

  // Per-habit stats
  const habitStats = useMemo(() => {
    return habits.map((h) => {
      const habitLogs = logs.filter((l) => l.habit_id === h.id);
      const streak = streakMap[h.id];
      return {
        ...h,
        completions: habitLogs.length,
        currentStreak: streak?.current_streak ?? 0,
        longestStreak: streak?.longest_streak ?? 0,
      };
    }).sort((a, b) => b.completions - a.completions);
  }, [habits, logs, streakMap]);

  const topHabit = habitStats[0];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-[rgb(15,23,42)] dark:text-white">Analytics</h1>
        <p className="text-sm text-[rgb(100,116,139)] mt-1">Track your habit performance over time</p>
      </div>

      {/* Key stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Completions", value: totalCompletions.toLocaleString(), icon: Target, color: "text-[rgb(37,99,235)]", bg: "bg-[rgba(37,99,235,0.1)]" },
          { label: "Longest Streak", value: `${longestStreak}d`, icon: Trophy, color: "text-[rgb(245,158,11)]", bg: "bg-[rgba(245,158,11,0.1)]" },
          { label: "Current Best", value: `${bestCurrentStreak}d`, icon: Flame, color: "text-[rgb(16,185,129)]", bg: "bg-[rgba(16,185,129,0.1)]" },
          { label: "Habits Tracked", value: habits.length.toString(), icon: TrendingUp, color: "text-[rgb(139,92,246)]", bg: "bg-[rgba(139,92,246,0.1)]" },
        ].map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-5">
                <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center mb-3`}>
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
                <p className={`text-2xl sm:text-3xl font-bold ${stat.color}`}>{stat.value}</p>
                <p className="text-xs text-[rgb(100,116,139)] mt-0.5">{stat.label}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <h2 className="text-xl font-bold text-[rgb(15,23,42)] dark:text-white">Completion Trend</h2>
          <div className="flex items-center gap-2">
            {(["7d", "30d", "90d", "365d"] as const).map((r) => (
              <button
                key={r}
                onClick={() => setTimeRange(r)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  timeRange === r
                    ? "bg-[rgb(37,99,235)] text-white"
                    : "bg-[rgb(241,245,249)] dark:bg-[rgb(30,41,59)] text-[rgb(100,116,139)] hover:text-[rgb(37,99,235)]"
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        <Card>
          <CardContent className="p-6">
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={weeklyData} barSize={timeRange === "365d" ? 2 : timeRange === "90d" ? 5 : 20}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(100,116,139,0.1)" vertical={false} />
                <XAxis
                  dataKey="label"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: "rgb(148,163,184)" }}
                  interval={timeRange === "365d" ? 30 : timeRange === "90d" ? 7 : "preserveEnd"}
                />
                <YAxis hide />
                <Tooltip
                  content={({ active, payload }) => {
                    if (!active || !payload?.length) return null;
                    const d = payload[0].payload;
                    return (
                      <div className="bg-white dark:bg-[rgb(15,23,42)] border border-[rgb(226,232,240)] dark:border-[rgb(30,41,59)] rounded-xl px-3 py-2 shadow-xl text-xs">
                        <p className="font-semibold mb-1">{d.date}</p>
                        <p className="text-[rgb(37,99,235)]">{d.completed} completed</p>
                        <p className="text-[rgb(100,116,139)]">{d.pct}% of habits</p>
                      </div>
                    );
                  }}
                />
                <Bar dataKey="completed" radius={[4, 4, 0, 0]}>
                  {weeklyData.map((entry, i) => (
                    <Cell
                      key={i}
                      fill={entry.pct === 100 ? "rgb(16,185,129)" : entry.pct >= 50 ? "rgb(37,99,235)" : "rgba(37,99,235,0.4)"}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Heatmap */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-[rgb(37,99,235)]" />
              Activity Heatmap (Last 12 Months)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <div
                className="grid gap-1 min-w-max"
                style={{
                  gridTemplateColumns: `repeat(53, minmax(0, 1fr))`,
                  gridTemplateRows: `repeat(7, minmax(0, 1fr))`,
                  gridAutoFlow: "column",
                }}
              >
                {heatmapData.map((cell, i) => (
                  <div
                    key={i}
                    title={`${cell.date}: ${cell.count} completions`}
                    className={`w-3.5 h-3.5 rounded-sm cursor-default hover:ring-2 hover:ring-[rgb(37,99,235)] transition-all ${LEVEL_COLORS[cell.level]}`}
                  />
                ))}
              </div>
            </div>
            <div className="flex items-center gap-2 mt-4 text-xs text-[rgb(100,116,139)] justify-end">
              <span>Less</span>
              {LEVEL_COLORS.map((c, i) => (
                <div key={i} className={`w-3.5 h-3.5 rounded-sm ${c}`} />
              ))}
              <span>More</span>
            </div>
          </CardContent>
        </Card>

        {/* Per-habit breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Per-Habit Performance</CardTitle>
          </CardHeader>
          <CardContent>
            {habitStats.length === 0 ? (
              <p className="text-center text-[rgb(100,116,139)] py-8">No habits yet</p>
            ) : (
              <div className="space-y-4">
                {habitStats.map((habit) => (
                  <div key={habit.id} className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-[rgb(241,245,249)] dark:bg-[rgb(30,41,59)] flex items-center justify-center text-xl flex-shrink-0">
                      {habit.emoji}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-sm font-medium text-[rgb(15,23,42)] dark:text-white truncate">{habit.name}</span>
                        <div className="flex items-center gap-3 text-xs text-[rgb(100,116,139)] flex-shrink-0 ml-4">
                          <span className="flex items-center gap-1">
                            <Flame className="h-3 w-3 text-[rgb(245,158,11)]" />
                            {habit.currentStreak}d
                          </span>
                          <span className="flex items-center gap-1">
                            <Trophy className="h-3 w-3 text-[rgb(37,99,235)]" />
                            {habit.longestStreak}d best
                          </span>
                          <span className="font-medium text-[rgb(37,99,235)]">{habit.completions}</span>
                        </div>
                      </div>
                      <div className="h-2 bg-[rgb(226,232,240)] dark:bg-[rgb(30,41,59)] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-[rgb(37,99,235)] to-[rgb(16,185,129)] rounded-full transition-all duration-700"
                          style={{ width: `${habitStats[0]?.completions ? (habit.completions / habitStats[0].completions) * 100 : 0}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
