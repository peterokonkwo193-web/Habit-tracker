import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { HabitsManager } from "@/components/habits/habits-manager";

export const metadata = { title: "My Habits" };

export default async function HabitsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: habits } = await supabase
    .from("habits")
    .select("*, habit_streaks(*)")
    .eq("user_id", user.id)
    .order("sort_order", { ascending: true });

  return <HabitsManager initialHabits={habits ?? []} />;
}
