import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { ProfileForm } from "@/components/profile/profile-form";
import { TelegramConnect } from "@/components/profile/telegram-connect";
import { DangerZone } from "@/components/profile/danger-zone";

export const metadata = { title: "Profile" };

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [{ data: profile }, { data: telegram }] = await Promise.all([
    supabase.from("profiles").select("*").eq("user_id", user.id).single(),
    supabase.from("telegram_accounts").select("*").eq("user_id", user.id).single(),
  ]);

  return (
    <div className="space-y-8 animate-fade-in max-w-2xl">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-[rgb(15,23,42)] dark:text-white">Profile</h1>
        <p className="text-sm text-[rgb(100,116,139)] mt-1">Manage your account settings</p>
      </div>

      <ProfileForm profile={profile} email={user.email ?? ""} />
      <TelegramConnect telegram={telegram} userId={user.id} />
      <DangerZone />
    </div>
  );
}
