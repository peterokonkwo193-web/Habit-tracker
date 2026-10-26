import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { AnalyticsDashboard } from "@/components/analytics/analytics-dashboard";
import { getTodayString, getDateString } from "@/lib/utils";
import { getDeviceTimezone } from "@/lib/timezone";

export const metadata = { title: "Analytics" };

export default async function AnalyticsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Fetch last 365 days of logs
  const yearAgo = new Date();
  yearAgo.setFullYear(yearAgo.getFullYear() - 1);

  const [{ data: habits }, { data: logs }, { data: streaks }] = await Promise.all([
    supabase
      .from("habits")
      .select("id, name, emoji, category")
      .eq("user_id", user.id),
    supabase
      .from("habit_logs")
      .select("habit_id, completed_date")
      .eq("user_id", user.id)
      .gte("completed_date", getDateString(yearAgo))
      .order("completed_date", { ascending: false }),
    supabase
      .from("habit_streaks")
      .select("habit_id, current_streak, longest_streak")
      .eq("user_id", user.id),
  ]);

  return (
    <AnalyticsDashboard
      habits={habits ?? []}
      logs={logs ?? []}
      streaks={streaks ?? []}
      today={getTodayString(await getDeviceTimezone())}
    />
  );
}
