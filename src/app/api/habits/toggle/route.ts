import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { z } from "zod";

const schema = z.object({
  habitId: z.string().uuid(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { habitId, date } = parsed.data;

    const { data: existing } = await supabase
      .from("habit_logs")
      .select("id")
      .eq("habit_id", habitId)
      .eq("completed_date", date)
      .single();

    if (existing) {
      await supabase.from("habit_logs").delete().eq("id", existing.id);
      return NextResponse.json({ completed: false });
    } else {
      await supabase.from("habit_logs").insert({
        habit_id: habitId,
        user_id: user.id,
        completed_date: date,
      });
      await supabase.rpc("update_habit_streak", {
        p_habit_id: habitId,
        p_user_id: user.id,
        p_date: date,
      });
      return NextResponse.json({ completed: true });
    }
  } catch (error) {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
