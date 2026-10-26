"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { profileSchema } from "@/lib/validations/habit";
import { generateVerificationCode } from "@/lib/utils";
import { isValidTimezone } from "@/lib/timezone";

export async function updateProfile(formData: FormData) {
  const raw = {
    full_name: formData.get("full_name") as string,
  };

  const parsed = profileSchema.safeParse(raw);
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const { error } = await supabase
    .from("profiles")
    .update(parsed.data)
    .eq("user_id", user.id);

  if (error) return { error: error.message };

  revalidatePath("/profile");
  return { success: true };
}

export async function generateTelegramCode() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const code = generateVerificationCode();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString(); // 10 minutes

  const { error } = await supabase
    .from("telegram_accounts")
    .upsert({
      user_id: user.id,
      chat_id: "pending",
      verification_code: code,
      verification_expires_at: expiresAt,
      verified_at: null,
    }, { onConflict: "user_id" });

  if (error) return { error: error.message };

  return { success: true, code };
}

export async function syncTimezone(timezone: string) {
  if (!isValidTimezone(timezone)) return { error: "Invalid timezone" };

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const { error } = await supabase.from("profiles").update({ timezone }).eq("user_id", user.id);
  if (error) return { error: error.message };
  return { success: true };
}

export async function updateReminderTime(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const reminder_time = (formData.get("reminder_time") as string) || null;
  const midday_reminder_time = (formData.get("midday_reminder_time") as string) || null;
  const evening_reminder_time = (formData.get("evening_reminder_time") as string) || null;

  // Reminder times are entered in the device's local time, so store its timezone with them
  const update: Record<string, string | null> = { reminder_time, midday_reminder_time, evening_reminder_time };
  const timezone = formData.get("timezone") as string | null;
  if (timezone) {
    if (!isValidTimezone(timezone)) return { error: "Invalid timezone" };
    update.timezone = timezone;
  }

  const { error } = await supabase
    .from("profiles")
    .update(update)
    .eq("user_id", user.id);

  if (error) return { error: error.message };

  revalidatePath("/settings");
  revalidatePath("/profile");
  return { success: true };
}

export async function disconnectTelegram() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  await supabase.from("telegram_accounts").delete().eq("user_id", user.id);
  await supabase.from("profiles")
    .update({ telegram_chat_id: null, telegram_username: null, telegram_verified: false })
    .eq("user_id", user.id);

  revalidatePath("/profile");
  return { success: true };
}

export async function deleteAccount() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  await supabase.auth.admin.deleteUser(user.id).catch(() => null);

  redirect("/");
}
