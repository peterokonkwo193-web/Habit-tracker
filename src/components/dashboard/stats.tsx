"use client";

import { motion } from "framer-motion";
import { Target, CheckCircle, Flame, Zap } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface DashboardStatsProps {
  completionPercentage: number;
  completedToday: number;
  totalToday: number;
  longestStreak: number;
  activeHabits: number;
}

const STATS = (props: DashboardStatsProps) => [
  {
    label: "Daily Completion",
    value: `${props.completionPercentage}%`,
    subtext: `${props.completedToday} of ${props.totalToday} habits`,
    icon: Target,
    color: "text-[rgb(37,99,235)]",
    bg: "bg-[rgba(37,99,235,0.1)]",
    progress: props.completionPercentage,
  },
  {
    label: "Completed Today",
    value: `${props.completedToday}`,
    subtext: `${props.totalToday - props.completedToday} remaining`,
    icon: CheckCircle,
    color: "text-[rgb(16,185,129)]",
    bg: "bg-[rgba(16,185,129,0.1)]",
  },
  {
    label: "Longest Streak",
    value: `${props.longestStreak}d`,
    subtext: "Personal best",
    icon: Flame,
    color: "text-[rgb(245,158,11)]",
    bg: "bg-[rgba(245,158,11,0.1)]",
  },
  {
    label: "Active Habits",
    value: `${props.activeHabits}`,
    subtext: "Being tracked",
    icon: Zap,
    color: "text-[rgb(139,92,246)]",
    bg: "bg-[rgba(139,92,246,0.1)]",
  },
];

export function DashboardStats(props: DashboardStatsProps) {
  const stats = STATS(props);

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
        >
          <Card className="hover:shadow-md transition-shadow duration-200">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center`}>
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
              </div>
              <div>
                <p className={`text-2xl sm:text-3xl font-bold ${stat.color}`}>{stat.value}</p>
                <p className="text-xs text-[rgb(100,116,139)] mt-0.5">{stat.label}</p>
                <p className="text-xs text-[rgb(148,163,184)] mt-1">{stat.subtext}</p>
                {"progress" in stat && (
                  <Progress value={stat.progress} className="mt-3 h-1.5" />
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
