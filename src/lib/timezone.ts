import { cookies } from "next/headers";

// Set by <TimezoneSync> from the browser's own timezone
export const TIMEZONE_COOKIE = "tz";

export function isValidTimezone(timezone: string) {
  try {
    new Intl.DateTimeFormat("en", { timeZone: timezone });
    return true;
  } catch {
    return false;
  }
}

// The visiting device's timezone, or null before the first sync
export async function getDeviceTimezone() {
  const tz = (await cookies()).get(TIMEZONE_COOKIE)?.value;
  return tz && isValidTimezone(tz) ? tz : null;
}
