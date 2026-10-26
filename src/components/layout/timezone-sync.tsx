"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { syncTimezone } from "@/lib/actions/profile";

// Keeps the profile timezone (used for reminders) and the "tz" cookie (used
// for "today" on the server) in step with the device's own clock.
export function TimezoneSync({ savedTimezone }: { savedTimezone: string | null }) {
  const router = useRouter();

  useEffect(() => {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (!tz) return;

    const cookieTz = document.cookie.match(/(?:^|; )tz=([^;]*)/)?.[1];
    const cookieChanged = decodeURIComponent(cookieTz ?? "") !== tz;
    if (cookieChanged) {
      document.cookie = `tz=${encodeURIComponent(tz)}; path=/; max-age=31536000; samesite=lax`;
    }

    (async () => {
      if (tz !== savedTimezone) await syncTimezone(tz);
      // Re-render server pages so "today" uses the device's date
      if (cookieChanged || tz !== savedTimezone) router.refresh();
    })();
  }, [savedTimezone, router]);

  return null;
}
