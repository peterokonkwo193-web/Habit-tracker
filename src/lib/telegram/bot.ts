import { Telegraf, Context } from "telegraf";
import { message } from "telegraf/filters";
import { createClient } from "@supabase/supabase-js";
import { getTodayString, getDayOfWeek } from "@/lib/utils";

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

function createBot() {
  if (!process.env.TELEGRAM_BOT_TOKEN) {
    throw new Error("TELEGRAM_BOT_TOKEN not set");
  }
  return new Telegraf(process.env.TELEGRAM_BOT_TOKEN);
}

export async function handleTelegramUpdate(body: object) {
  const bot = createBot();

  bot.start(async (ctx) => {
    const chatId = ctx.chat.id.toString();

    const existingUser = await getUserByChatId(chatId);
    if (existingUser) {
      return ctx.reply(
        `Welcome back! 👋\n\nYou're connected to StreakFlow.\n\n` +
        `Commands:\n/today - See today's habits\n/done - Mark habits complete\n/progress - View progress\n/streak - View streaks\n/help - Show help`
      );
    }

    return ctx.reply(
      `👋 Welcome to StreakFlow Bot!\n\n` +
      `To connect your account:\n` +
      `1. Go to ${process.env.NEXT_PUBLIC_SITE_URL ?? "the app"}/profile\n` +
      `2. Click "Connect Telegram"\n` +
      `3. Send your verification code here\n\n` +
      `Already have a code? Send it now!`
    );
  });

  // Handle verification code
  bot.on(message("text"), async (ctx) => {
    const text = ctx.message.text.trim();
    const chatId = ctx.chat.id.toString();
    const username = ctx.from?.username ?? null;

    // Check if it's a code (8 alphanumeric chars)
    if (/^[A-Z0-9]{8}$/.test(text)) {
      await handleVerification(ctx, text, chatId, username);
      return;
    }

    // Check if it's a number (habit completion)
    const num = parseInt(text, 10);
    if (!isNaN(num) && num > 0) {
      await handleHabitCompletion(ctx, chatId, num);
      return;
    }

    // Handle multiple numbers like "1 2 3"
    const numbers = text.split(/[\s,]+/).map(Number).filter((n) => !isNaN(n) && n > 0);
    if (numbers.length > 0) {
      for (const n of numbers) {
        await handleHabitCompletion(ctx, chatId, n);
      }
      return;
    }
  });

  bot.command("today", async (ctx) => {
    const chatId = ctx.chat.id.toString();
    await sendTodayHabits(ctx, chatId);
  });

  bot.command("done", async (ctx) => {
    const chatId = ctx.chat.id.toString();
    await sendTodayHabits(ctx, chatId, "Which habits did you complete? Reply with the number(s):");
  });

  bot.command("progress", async (ctx) => {
    const chatId = ctx.chat.id.toString();
    await sendProgress(ctx, chatId);
  });

  bot.command("streak", async (ctx) => {
    const chatId = ctx.chat.id.toString();
    await sendStreaks(ctx, chatId);
  });

  bot.command("help", async (ctx) => {
    return ctx.reply(
      `🤖 StreakFlow Bot Commands\n\n` +
      `/today - View today's habit list\n` +
      `/done - Mark habits complete\n` +
      `/progress - Today's completion progress\n` +
      `/streak - View your current streaks\n` +
      `/help - Show this message\n\n` +
      `💡 Tip: Reply with habit number to mark it complete!\n` +
      `Example: Send "1" or "1 2 3"`
    );
  });

  await bot.handleUpdate(body as Parameters<typeof bot.handleUpdate>[0]);
}

async function handleVerification(
  ctx: Context,
  code: string,
  chatId: string,
  username: string | null
) {
  const { data: account } = await getSupabase()
    .from("telegram_accounts")
    .select("user_id, verification_expires_at")
    .eq("verification_code", code)
    .single();

  if (!account) {
    return ctx.reply("❌ Invalid code. Please generate a new code from your profile page.");
  }

  const expired = new Date(account.verification_expires_at) < new Date();
  if (expired) {
    return ctx.reply("⏰ This code has expired. Please generate a new one from your profile page.");
  }

  await getSupabase()
    .from("telegram_accounts")
    .update({
      chat_id: chatId,
      username,
      verification_code: null,
      verification_expires_at: null,
      verified_at: new Date().toISOString(),
    })
    .eq("user_id", account.user_id);

  await getSupabase()
    .from("profiles")
    .update({
      telegram_chat_id: chatId,
      telegram_username: username,
      telegram_verified: true,
    })
    .eq("user_id", account.user_id);

  return ctx.reply(
    `✅ Account connected successfully!\n\n` +
    `You'll now receive:\n` +
    `• 🌅 Morning reminders with your habit list\n` +
    `• ☀️ Midday check-ins\n` +
    `• 🌙 Evening progress summaries\n\n` +
    `Change the times in Settings.\n\n` +
    `Try /today to see your habits!`
  );
}

async function getUserByChatId(chatId: string) {
  const { data } = await getSupabase()
    .from("profiles")
    .select("user_id")
    .eq("telegram_chat_id", chatId)
    .single();
  return data;
}

// "Today" for the user's own device timezone (synced from the web app)
async function getUserToday(userId: string) {
  const { data } = await getSupabase()
    .from("profiles")
    .select("timezone")
    .eq("user_id", userId)
    .single();
  return { today: getTodayString(data?.timezone), dayOfWeek: getDayOfWeek(data?.timezone) };
}

async function getTodayHabitsForUser(userId: string) {
  const { today, dayOfWeek } = await getUserToday(userId);

  const { data: habits } = await getSupabase()
    .from("habits")
    .select("id, name, emoji, frequency, custom_days")
    .eq("user_id", userId)
    .eq("is_archived", false)
    .order("sort_order", { ascending: true });

  if (!habits) return [];

  const todayHabits = habits.filter((h) => {
    if (h.frequency === "daily") return true;
    if (h.frequency === "weekdays") return dayOfWeek >= 1 && dayOfWeek <= 5;
    if (h.frequency === "weekends") return dayOfWeek === 0 || dayOfWeek === 6;
    if (h.frequency === "custom" && h.custom_days) return h.custom_days.includes(dayOfWeek);
    return true;
  });

  const { data: logs } = await getSupabase()
    .from("habit_logs")
    .select("habit_id")
    .eq("user_id", userId)
    .eq("completed_date", today);

  const completedIds = new Set((logs ?? []).map((l) => l.habit_id));

  return todayHabits.map((h, i) => ({
    ...h,
    index: i + 1,
    done: completedIds.has(h.id),
  }));
}

async function sendTodayHabits(ctx: Context, chatId: string, intro?: string) {
  const user = await getUserByChatId(chatId);
  if (!user) {
    return ctx.reply("❌ Account not connected. Send your verification code to link your account.");
  }

  const habits = await getTodayHabitsForUser(user.user_id);
  if (habits.length === 0) {
    return ctx.reply("🌱 You have no habits for today. Add some in the app!");
  }

  const completed = habits.filter((h) => h.done).length;
  const header = intro ?? `Good morning! 👋\n\nToday's Habits (${completed}/${habits.length} done):`;
  const list = habits.map((h) => `${h.done ? "✅" : `${h.index}.`} ${h.emoji} ${h.name}`).join("\n");

  return ctx.reply(`${header}\n\n${list}\n\n💡 Reply with a number to mark complete!`);
}

async function handleHabitCompletion(ctx: Context, chatId: string, num: number) {
  const user = await getUserByChatId(chatId);
  if (!user) return;

  const habits = await getTodayHabitsForUser(user.user_id);
  const habit = habits.find((h) => h.index === num);

  if (!habit) {
    return ctx.reply(`❌ Habit #${num} not found. Send /today to see your list.`);
  }

  if (habit.done) {
    return ctx.reply(`✅ "${habit.name}" is already marked complete today!`);
  }

  const { today } = await getUserToday(user.user_id);
  const { error } = await getSupabase()
    .from("habit_logs")
    .insert({ habit_id: habit.id, user_id: user.user_id, completed_date: today });

  if (error) {
    return ctx.reply("❌ Something went wrong. Please try again.");
  }

  // Update streak
  await getSupabase().rpc("update_habit_streak", {
    p_habit_id: habit.id,
    p_user_id: user.user_id,
    p_date: today,
  });

  // Get updated streak
  const { data: streak } = await getSupabase()
    .from("habit_streaks")
    .select("current_streak")
    .eq("habit_id", habit.id)
    .single();

  return ctx.reply(
    `✅ "${habit.emoji} ${habit.name}" marked complete!\n\n` +
    `🔥 Current streak: ${streak?.current_streak ?? 1} day${(streak?.current_streak ?? 1) !== 1 ? "s" : ""}`
  );
}

async function sendProgress(ctx: Context, chatId: string) {
  const user = await getUserByChatId(chatId);
  if (!user) {
    return ctx.reply("❌ Account not connected.");
  }

  const habits = await getTodayHabitsForUser(user.user_id);
  const completed = habits.filter((h) => h.done).length;
  const total = habits.length;
  const pct = total === 0 ? 0 : Math.round((completed / total) * 100);

  const bar = "█".repeat(Math.round(pct / 10)) + "░".repeat(10 - Math.round(pct / 10));

  return ctx.reply(
    `📊 Today's Progress\n\n` +
    `${bar} ${pct}%\n` +
    `✅ ${completed}/${total} habits done\n\n` +
    habits.map((h) => `${h.done ? "✅" : "⬜"} ${h.emoji} ${h.name}`).join("\n")
  );
}

async function sendStreaks(ctx: Context, chatId: string) {
  const user = await getUserByChatId(chatId);
  if (!user) {
    return ctx.reply("❌ Account not connected.");
  }

  const { data: streaks } = await getSupabase()
    .from("habit_streaks")
    .select("habit_id, current_streak, longest_streak")
    .eq("user_id", user.user_id)
    .order("current_streak", { ascending: false });

  const { data: habits } = await getSupabase()
    .from("habits")
    .select("id, name, emoji")
    .eq("user_id", user.user_id);

  if (!streaks?.length) {
    return ctx.reply("No streaks yet. Complete some habits to start your streak! 🔥");
  }

  const habitMap: Record<string, { name: string; emoji: string }> = {};
  (habits ?? []).forEach((h) => { habitMap[h.id] = h; });

  const list = streaks.map((s) => {
    const h = habitMap[s.habit_id];
    if (!h) return null;
    return `${h.emoji} ${h.name}: 🔥 ${s.current_streak}d (best: ${s.longest_streak}d)`;
  }).filter(Boolean).join("\n");

  const maxStreak = Math.max(...streaks.map((s) => s.current_streak));

  return ctx.reply(
    `🔥 Your Streaks\n\n${list}\n\n` +
    `Best current streak: ${maxStreak} days! ${maxStreak >= 7 ? "🏆" : "💪"}`
  );
}

const NO_HABITS_MESSAGE =
  `⏰ Reminder!\n\nYou have no habits scheduled for today yet.\n\n` +
  `Add your daily activities on the Habits page: ${process.env.NEXT_PUBLIC_SITE_URL ?? ""}/habits`;

export async function sendMorningReminder(chatId: string, userId: string) {
  if (!process.env.TELEGRAM_BOT_TOKEN) return;
  const bot = createBot();

  const habits = await getTodayHabitsForUser(userId);
  if (!habits.length) {
    await bot.telegram.sendMessage(chatId, NO_HABITS_MESSAGE);
    return;
  }

  const list = habits.map((h) => `${h.index}. ${h.emoji} ${h.name}`).join("\n");

  await bot.telegram.sendMessage(
    chatId,
    `Good Morning! 👋\n\nToday's Habits:\n\n${list}\n\n💡 Reply with a number to mark complete!`
  );
}

export async function sendMiddayReminder(chatId: string, userId: string) {
  if (!process.env.TELEGRAM_BOT_TOKEN) return;
  const bot = createBot();

  const habits = await getTodayHabitsForUser(userId);
  if (!habits.length) {
    await bot.telegram.sendMessage(chatId, NO_HABITS_MESSAGE);
    return;
  }

  const completed = habits.filter((h) => h.done).length;
  const list = habits.map((h) => `${h.done ? "✅" : `${h.index}.`} ${h.emoji} ${h.name}`).join("\n");

  await bot.telegram.sendMessage(
    chatId,
    `☀️ Midday Check-in\n\nYou've done ${completed}/${habits.length} habits so far:\n\n${list}\n\n💡 Reply with a number to mark complete!`
  );
}

export async function sendEveningSummary(chatId: string, userId: string) {
  if (!process.env.TELEGRAM_BOT_TOKEN) return;
  const bot = createBot();

  const habits = await getTodayHabitsForUser(userId);
  const completed = habits.filter((h) => h.done).length;
  const total = habits.length;

  const maxStreak = await getSupabase()
    .from("habit_streaks")
    .select("current_streak")
    .eq("user_id", userId)
    .order("current_streak", { ascending: false })
    .limit(1)
    .single();

  const streakText = maxStreak.data ? `\n🔥 Current streak: ${maxStreak.data.current_streak} days` : "";
  const emoji = completed === total ? "🎉" : completed >= total / 2 ? "👍" : "💪";

  await bot.telegram.sendMessage(
    chatId,
    `${emoji} Evening Summary\n\n` +
    `Completed: ${completed}/${total} Habits\n` +
    `${streakText}\n\n` +
    (completed === total ? "Perfect day! All habits done! 🏆" : "Keep going! Tomorrow is a new chance! 🌟")
  );
}
