import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { sendMorningReminder, sendMiddayReminder, sendEveningSummary } from "@/lib/telegram/bot";

// Current HH:MM in the user's timezone (falls back to UTC for invalid zones)
function localTime(timezone: string | null) {
  const format = (timeZone: string) =>
    new Intl.DateTimeFormat("en-GB", { timeZone, hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).format(new Date());
  try {
    return format(timezone || "UTC");
  } catch {
    return format("UTC");
  }
}

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data: profiles } = await supabase
      .from("profiles")
      .select("user_id, telegram_chat_id, timezone, reminder_time, midday_reminder_time, evening_reminder_time")
      .eq("telegram_verified", true)
      .not("telegram_chat_id", "is", null);

    if (!profiles?.length) {
      return NextResponse.json({ sent: 0 });
    }

    let sent = 0;
    await Promise.allSettled(
      profiles.map(async (p) => {
        if (!p.telegram_chat_id) return;
        const now = localTime(p.timezone);
        // TIME columns come back as HH:MM:SS
        const matches = (t: string | null) => t?.slice(0, 5) === now;

        if (matches(p.reminder_time)) {
          await sendMorningReminder(p.telegram_chat_id, p.user_id);
          sent++;
        }
        if (matches(p.midday_reminder_time)) {
          await sendMiddayReminder(p.telegram_chat_id, p.user_id);
          sent++;
        }
        if (matches(p.evening_reminder_time)) {
          await sendEveningSummary(p.telegram_chat_id, p.user_id);
          sent++;
        }
      })
    );

    return NextResponse.json({ sent });
  } catch (error) {
    console.error("Reminders cron error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
