"use client";

import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getDateString } from "@/lib/utils";

interface WeeklyProgressProps {
  logs: { completed_date: string }[];
  habits: { id: string; frequency: string; custom_days?: number[] | null }[];
}

export function WeeklyProgress({ logs, habits }: WeeklyProgressProps) {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const today = new Date();

  const data = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - (6 - i));
    const dateStr = getDateString(d);
    const dayOfWeek = d.getDay();

    const dayHabits = habits.filter((h) => {
      if (h.frequency === "daily") return true;
      if (h.frequency === "weekdays") return dayOfWeek >= 1 && dayOfWeek <= 5;
      if (h.frequency === "weekends") return dayOfWeek === 0 || dayOfWeek === 6;
      if (h.frequency === "custom" && h.custom_days) return h.custom_days.includes(dayOfWeek);
      return true;
    });

    const completed = logs.filter((l) => l.completed_date === dateStr).length;
    const total = dayHabits.length;

    return {
      day: days[dayOfWeek],
      completed,
      total,
      percentage: total === 0 ? 0 : Math.round((completed / total) * 100),
      isToday: dateStr === getDateString(today),
    };
  });

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Weekly Progress</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={120}>
          <BarChart data={data} barSize={28}>
            <XAxis
              dataKey="day"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: "rgb(148,163,184)" }}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null;
                const d = payload[0].payload;
                return (
                  <div className="bg-white dark:bg-[rgb(15,23,42)] border border-[rgb(226,232,240)] dark:border-[rgb(30,41,59)] rounded-xl px-3 py-2 shadow-xl text-xs">
                    <p className="font-semibold">{d.day}</p>
                    <p className="text-[rgb(100,116,139)]">{d.completed}/{d.total} habits</p>
                    <p className="text-[rgb(37,99,235)]">{d.percentage}%</p>
                  </div>
                );
              }}
            />
            <Bar dataKey="percentage" radius={[6, 6, 0, 0]}>
              {data.map((entry, i) => (
                <Cell
                  key={i}
                  fill={
                    entry.isToday
                      ? "rgb(37,99,235)"
                      : entry.percentage === 100
                      ? "rgb(16,185,129)"
                      : entry.percentage > 0
                      ? "rgba(37,99,235,0.5)"
                      : "rgb(226,232,240)"
                  }
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        <div className="flex justify-between mt-2">
          {data.map((d) => (
            <div key={d.day} className={`text-center text-xs font-medium ${d.isToday ? "text-[rgb(37,99,235)]" : "text-[rgb(148,163,184)]"}`}>
              {d.percentage}%
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
