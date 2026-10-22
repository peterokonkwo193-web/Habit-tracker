import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { AdminDashboard } from "@/components/admin/admin-dashboard";

export const metadata = { title: "Admin Dashboard" };

export default async function AdminPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("user_id", user.id)
    .single();

  if (!profile?.is_admin) redirect("/dashboard");

  // Fetch admin stats
  const adminClient = await createAdminClient();

  const [
    { count: totalUsers },
    { count: totalHabits },
    { count: completionsToday },
    { count: telegramConnections },
    { data: recentUsers },
  ] = await Promise.all([
    adminClient.from("profiles").select("*", { count: "exact", head: true }),
    adminClient.from("habits").select("*", { count: "exact", head: true }).eq("is_archived", false),
    adminClient.from("habit_logs").select("*", { count: "exact", head: true })
      .eq("completed_date", new Date().toISOString().split("T")[0]),
    adminClient.from("telegram_accounts").select("*", { count: "exact", head: true })
      .not("verified_at", "is", null),
    adminClient.from("profiles")
      .select("user_id, full_name, created_at, telegram_verified, is_admin")
      .order("created_at", { ascending: false })
      .limit(10),
  ]);

  return (
    <AdminDashboard
      stats={{
        total_users: totalUsers ?? 0,
        total_habits: totalHabits ?? 0,
        completions_today: completionsToday ?? 0,
        telegram_connections: telegramConnections ?? 0,
      }}
      recentUsers={recentUsers ?? []}
    />
  );
}
