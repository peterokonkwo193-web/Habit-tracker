import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { AppearanceCard } from "@/components/settings/appearance-card";
import { NotificationsCard } from "@/components/settings/notifications-card";

export const metadata = { title: "Settings" };

export default async function SettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("reminder_time, midday_reminder_time, evening_reminder_time")
    .eq("user_id", user.id)
    .single();

  return (
    <div className="space-y-6 animate-fade-in max-w-2xl">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-[rgb(15,23,42)] dark:text-white">Settings</h1>
        <p className="text-sm text-[rgb(100,116,139)] mt-1">Customize your StreakFlow experience</p>
      </div>
      <AppearanceCard />
      <NotificationsCard
        reminderTime={profile?.reminder_time}
        middayReminderTime={profile?.midday_reminder_time}
        eveningReminderTime={profile?.evening_reminder_time}
      />
    </div>
  );
}
