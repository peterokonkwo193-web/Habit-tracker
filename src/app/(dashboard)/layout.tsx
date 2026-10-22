import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Sidebar } from "@/components/layout/sidebar";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, is_admin")
    .eq("user_id", user.id)
    .single();

  return (
    <div className="flex min-h-screen bg-[rgb(248,250,252)] dark:bg-[rgb(10,10,15)]">
      <Sidebar
        profile={{
          full_name: profile?.full_name ?? null,
          email: user.email,
          is_admin: profile?.is_admin ?? false,
        }}
      />
      <main className="flex-1 min-w-0 overflow-auto">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-10 pt-20 lg:pt-10">
          {children}
        </div>
      </main>
    </div>
  );
}
