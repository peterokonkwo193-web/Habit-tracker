import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { DashboardStats } from "@/components/dashboard/stats";
import { TodayHabits } from "@/components/dashboard/today-habits";
import { QuoteCard } from "@/components/dashboard/quote-card";
import { WeeklyProgress } from "@/components/dashboard/weekly-progress";
import { QuickAddHabit } from "@/components/habits/quick-add";
import { Skeleton } from "@/components/ui/skeleton";
import { getTodayString, getDailyQuote } from "@/lib/utils";
import { formatDate } from "@/lib/utils";

export const metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const today = getTodayString();
  const dayOfWeek = new Date().getDay();

  const [{ data: habits }, { data: allLogs }] = await Promise.all([
    supabase
      .from("habits")
      .select("*, habit_streaks(*), habit_logs(id, completed_date)")
      .eq("user_id", user.id)
      .eq("is_archived", false)
      .order("sort_order", { ascending: true }),
    supabase
      .from("habit_logs")
      .select("completed_date")
      .eq("user_id", user.id)
      .gte("completed_date", new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]),
  ]);

  const todayHabits = (habits ?? []).filter((habit) => {
    if (habit.frequency === "daily") return true;
    if (habit.frequency === "weekdays") return dayOfWeek >= 1 && dayOfWeek <= 5;
    if (habit.frequency === "weekends") return dayOfWeek === 0 || dayOfWeek === 6;
    if (habit.frequency === "custom" && habit.custom_days) return habit.custom_days.includes(dayOfWeek);
    return true;
  });

  const enrichedHabits = todayHabits.map((h) => ({
    ...h,
    is_completed_today: (h.habit_logs ?? []).some(
      (l: { completed_date: string }) => l.completed_date === today
    ),
    streak: h.habit_streaks?.[0] ?? null,
  }));

  const completedCount = enrichedHabits.filter((h) => h.is_completed_today).length;
  const totalCount = enrichedHabits.length;
  const completionPct = totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);

  const longestStreak = Math.max(
    0,
    ...(habits ?? []).map((h) => h.habit_streaks?.[0]?.longest_streak ?? 0)
  );

  const quote = getDailyQuote();

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <p className="text-sm text-[rgb(100,116,139)]">{formatDate(today)}</p>
          <h1 className="text-2xl sm:text-3xl font-bold text-[rgb(15,23,42)] dark:text-white mt-0.5">
            {completedCount === 0
              ? "Good morning! 🌅"
              : completedCount === totalCount
              ? "All done! Great work! 🎉"
              : `Keep going! ${totalCount - completedCount} left 💪`}
          </h1>
        </div>
        <QuickAddHabit />
      </div>

      {/* Stats widgets */}
      <DashboardStats
        completionPercentage={completionPct}
        completedToday={completedCount}
        totalToday={totalCount}
        longestStreak={longestStreak}
        activeHabits={habits?.length ?? 0}
      />

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-[rgb(15,23,42)] dark:text-white">
              Today&apos;s Habits
            </h2>
            <span className="text-sm text-[rgb(100,116,139)]">
              {completedCount}/{totalCount} completed
            </span>
          </div>
          <Suspense fallback={<div className="space-y-3">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-20 w-full" />)}</div>}>
            <TodayHabits initialHabits={enrichedHabits} />
          </Suspense>
        </div>

        <div className="space-y-6">
          <QuoteCard quote={quote.quote} author={quote.author} />
          <WeeklyProgress logs={allLogs ?? []} habits={habits ?? []} />
        </div>
      </div>
    </div>
  );
}
