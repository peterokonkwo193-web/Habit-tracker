"use client";

import { motion } from "framer-motion";
import { Users, CheckSquare, MessageCircle, TrendingUp, Shield, Activity } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface AdminStats {
  total_users: number;
  total_habits: number;
  completions_today: number;
  telegram_connections: number;
}

interface RecentUser {
  user_id: string;
  full_name: string | null;
  created_at: string;
  telegram_verified: boolean;
  is_admin: boolean;
}

export function AdminDashboard({ stats, recentUsers }: { stats: AdminStats; recentUsers: RecentUser[] }) {
  const statCards = [
    {
      label: "Total Users",
      value: stats.total_users.toLocaleString(),
      icon: Users,
      color: "text-[rgb(37,99,235)]",
      bg: "bg-[rgba(37,99,235,0.1)]",
    },
    {
      label: "Active Habits",
      value: stats.total_habits.toLocaleString(),
      icon: CheckSquare,
      color: "text-[rgb(16,185,129)]",
      bg: "bg-[rgba(16,185,129,0.1)]",
    },
    {
      label: "Completions Today",
      value: stats.completions_today.toLocaleString(),
      icon: TrendingUp,
      color: "text-[rgb(245,158,11)]",
      bg: "bg-[rgba(245,158,11,0.1)]",
    },
    {
      label: "Telegram Connections",
      value: stats.telegram_connections.toLocaleString(),
      icon: MessageCircle,
      color: "text-[rgb(139,92,246)]",
      bg: "bg-[rgba(139,92,246,0.1)]",
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-[rgba(245,158,11,0.1)] flex items-center justify-center">
          <Shield className="h-5 w-5 text-[rgb(245,158,11)]" />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[rgb(15,23,42)] dark:text-white">Admin Dashboard</h1>
          <p className="text-sm text-[rgb(100,116,139)]">Platform overview and user management</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
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

      {/* Engagement metrics */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-[rgb(37,99,235)]" />
              Platform Health
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              {
                label: "Telegram adoption rate",
                value: stats.total_users > 0 ? Math.round((stats.telegram_connections / stats.total_users) * 100) : 0,
                color: "bg-[rgb(37,99,235)]",
              },
              {
                label: "Habits per user (avg)",
                value: stats.total_users > 0 ? Math.round((stats.total_habits / stats.total_users) * 10) : 0,
                max: 100,
                color: "bg-[rgb(16,185,129)]",
              },
              {
                label: "Daily engagement",
                value: stats.total_users > 0 ? Math.min(100, Math.round((stats.completions_today / Math.max(stats.total_habits, 1)) * 100)) : 0,
                color: "bg-[rgb(245,158,11)]",
              },
            ].map((metric) => (
              <div key={metric.label}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm text-[rgb(100,116,139)]">{metric.label}</span>
                  <span className="text-sm font-semibold text-[rgb(15,23,42)] dark:text-white">{metric.value}%</span>
                </div>
                <div className="h-2 bg-[rgb(226,232,240)] dark:bg-[rgb(30,41,59)] rounded-full overflow-hidden">
                  <div
                    className={`h-full ${metric.color} rounded-full transition-all duration-700`}
                    style={{ width: `${Math.min(metric.value, 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent users */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-[rgb(37,99,235)]" />
              Recent Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recentUsers.length === 0 ? (
              <p className="text-center text-[rgb(100,116,139)] py-8">No users yet</p>
            ) : (
              <div className="space-y-3">
                {recentUsers.map((u) => (
                  <div key={u.user_id} className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[rgb(37,99,235)] to-[rgb(16,185,129)] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                      {u.full_name?.[0]?.toUpperCase() ?? "U"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[rgb(15,23,42)] dark:text-white truncate">
                        {u.full_name ?? "Unknown User"}
                      </p>
                      <p className="text-xs text-[rgb(100,116,139)]">
                        {new Date(u.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      {u.telegram_verified && (
                        <Badge variant="secondary" className="text-xs">TG</Badge>
                      )}
                      {u.is_admin && (
                        <Badge variant="accent" className="text-xs">Admin</Badge>
                      )}
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
