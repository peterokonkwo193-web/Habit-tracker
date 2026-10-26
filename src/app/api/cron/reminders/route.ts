import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { sendMorningReminder, sendMiddayReminder, sendEveningSummary } from "@/lib/telegram/bot";

// A reminder is still sent if the cron run is up to this many minutes late
const GRACE_MINUTES = 15;

// Current local date (YYYY-MM-DD) and minutes since midnight in the user's timezone
function localNow(timezone: string | null) {
  const parts = (timeZone: string) => {
    const p = Object.fromEntries(
      new Intl.DateTimeFormat("en-CA", {
        timeZone, year: "numeric", month: "2-digit", day: "2-digit",
        hour: "2-digit", minute: "2-digit", hourCycle: "h23",
      }).formatToParts(new Date()).map((x) => [x.type, x.value])
    );
    return { date: `${p.year}-${p.month}-${p.day}`, minutes: Number(p.hour) * 60 + Number(p.minute) };
  };
  try {
    return parts(timezone || "UTC");
  } catch {
    return parts("UTC");
  }
}

// TIME columns come back as HH:MM:SS
function toMinutes(t: string | null) {
  if (!t) return null;
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}

const SLOTS = [
  { key: "morning", column: "reminder_time", send: sendMorningReminder },
  { key: "midday", column: "midday_reminder_time", send: sendMiddayReminder },
  { key: "evening", column: "evening_reminder_time", send: sendEveningSummary },
] as const;

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

    const { data: profiles, error } = await supabase
      .from("profiles")
      .select("user_id, telegram_chat_id, timezone, reminder_time, midday_reminder_time, evening_reminder_time, reminders_sent")
      .eq("telegram_verified", true)
      .not("telegram_chat_id", "is", null);

    // Surface DB errors (e.g. a missing migration) so the cron service shows a failure
    if (error) {
      console.error("Reminders cron query error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!profiles?.length) {
      return NextResponse.json({ sent: 0, users: 0 });
    }

    let sent = 0;
    const failures: string[] = [];
    await Promise.allSettled(
      profiles.map(async (p) => {
        if (!p.telegram_chat_id) return;
        const now = localNow(p.timezone);
        const alreadySent: Record<string, string> = p.reminders_sent ?? {};
        let changed = false;

        for (const slot of SLOTS) {
          const due = toMinutes(p[slot.column]);
          if (due === null || alreadySent[slot.key] === now.date) continue;
          const late = now.minutes - due;
          if (late < 0 || late > GRACE_MINUTES) continue;

          try {
            await slot.send(p.telegram_chat_id, p.user_id);
            alreadySent[slot.key] = now.date;
            changed = true;
            sent++;
          } catch (e) {
            console.error(`Failed ${slot.key} reminder for ${p.user_id}:`, e);
            failures.push(slot.key);
          }
        }

        if (changed) {
          await supabase.from("profiles").update({ reminders_sent: alreadySent }).eq("user_id", p.user_id);
        }
      })
    );

    return NextResponse.json({ sent, users: profiles.length, failures: failures.length });
  } catch (error) {
    console.error("Reminders cron error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
