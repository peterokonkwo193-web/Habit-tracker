"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { habitSchema } from "@/lib/validations/habit";
import { getTodayString, getDayOfWeek } from "@/lib/utils";
import { getDeviceTimezone } from "@/lib/timezone";
import type { HabitInput } from "@/lib/validations/habit";

export async function createHabit(data: HabitInput) {
  const parsed = habitSchema.safeParse(data);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const { data: existing } = await supabase
    .from("habits")
    .select("sort_order")
    .eq("user_id", user.id)
    .order("sort_order", { ascending: false })
    .limit(1)
    .single();

  const sortOrder = existing ? existing.sort_order + 1 : 0;

  const { data: habit, error } = await supabase
    .from("habits")
    .insert({
      ...parsed.data,
      user_id: user.id,
      sort_order: sortOrder,
    })
    .select()
    .single();

  if (error) return { error: error.message };

  await supabase.from("habit_streaks").insert({
    habit_id: habit.id,
    user_id: user.id,
    current_streak: 0,
    longest_streak: 0,
  });

  revalidatePath("/dashboard");
  revalidatePath("/habits");
  return { success: true, habit };
}

export async function updateHabit(id: string, data: HabitInput) {
  const parsed = habitSchema.safeParse(data);
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const { error } = await supabase
    .from("habits")
    .update(parsed.data)
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) return { error: error.message };

  revalidatePath("/dashboard");
  revalidatePath("/habits");
  return { success: true };
}

export async function deleteHabit(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const { error } = await supabase
    .from("habits")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) return { error: error.message };

  revalidatePath("/dashboard");
  revalidatePath("/habits");
  return { success: true };
}

export async function archiveHabit(id: string, archived: boolean) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const { error } = await supabase
    .from("habits")
    .update({ is_archived: archived })
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) return { error: error.message };

  revalidatePath("/dashboard");
  revalidatePath("/habits");
  return { success: true };
}

export async function toggleHabitCompletion(habitId: string, date?: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const targetDate = date ?? getTodayString(await getDeviceTimezone());

  const { data: existing } = await supabase
    .from("habit_logs")
    .select("id")
    .eq("habit_id", habitId)
    .eq("completed_date", targetDate)
    .single();

  if (existing) {
    const { error } = await supabase
      .from("habit_logs")
      .delete()
      .eq("id", existing.id);

    if (error) return { error: error.message };

    revalidatePath("/dashboard");
    return { success: true, completed: false };
  } else {
    const { error } = await supabase
      .from("habit_logs")
      .insert({ habit_id: habitId, user_id: user.id, completed_date: targetDate });

    if (error) return { error: error.message };

    await supabase.rpc("update_habit_streak", {
      p_habit_id: habitId,
      p_user_id: user.id,
      p_date: targetDate,
    });

    revalidatePath("/dashboard");
    return { success: true, completed: true };
  }
}

export async function reorderHabits(habitIds: string[]) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const updates = habitIds.map((id, index) =>
    supabase
      .from("habits")
      .update({ sort_order: index })
      .eq("id", id)
      .eq("user_id", user.id)
  );

  await Promise.all(updates);

  revalidatePath("/dashboard");
  revalidatePath("/habits");
  return { success: true };
}

export async function getHabitsForToday() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { habits: [], error: null };

  const timezone = await getDeviceTimezone();
  const today = getTodayString(timezone);
  const dayOfWeek = getDayOfWeek(timezone);

  const { data: habits, error } = await supabase
    .from("habits")
    .select(`
      *,
      habit_streaks(*),
      habit_logs(id, completed_date)
    `)
    .eq("user_id", user.id)
    .eq("is_archived", false)
    .order("sort_order", { ascending: true });

  if (error) return { habits: [], error: error.message };

  const todayHabits = (habits ?? []).filter((habit) => {
    if (habit.frequency === "daily") return true;
    if (habit.frequency === "weekdays") return dayOfWeek >= 1 && dayOfWeek <= 5;
    if (habit.frequency === "weekends") return dayOfWeek === 0 || dayOfWeek === 6;
    if (habit.frequency === "custom" && habit.custom_days) {
      return habit.custom_days.includes(dayOfWeek);
    }
    return true;
  });

  return {
    habits: todayHabits.map((h) => ({
      ...h,
      is_completed_today: (h.habit_logs ?? []).some(
        (l: { completed_date: string }) => l.completed_date === today
      ),
      streak: h.habit_streaks?.[0] ?? null,
    })),
    error: null,
  };
}
