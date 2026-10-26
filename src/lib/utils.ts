import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(date));
}

export function formatDateShort(date: string | Date): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(new Date(date));
}

// Calendar date and weekday in an IANA timezone (UTC when missing or invalid)
function zonedParts(timezone?: string | null) {
  const format = (timeZone: string) =>
    Object.fromEntries(
      new Intl.DateTimeFormat("en-US", {
        timeZone, year: "numeric", month: "2-digit", day: "2-digit", weekday: "short",
      }).formatToParts(new Date()).map((p) => [p.type, p.value])
    );
  try {
    return format(timezone || "UTC");
  } catch {
    return format("UTC");
  }
}

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function getTodayString(timezone?: string | null): string {
  const p = zonedParts(timezone);
  return `${p.year}-${p.month}-${p.day}`;
}

// 0 = Sunday, matching Date.getDay()
export function getDayOfWeek(timezone?: string | null): number {
  return WEEKDAYS.indexOf(zonedParts(timezone).weekday);
}

export function getDateString(date: Date): string {
  return date.toISOString().split("T")[0];
}

export function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

export function getWeekDates(weekOffset = 0): Date[] {
  const today = new Date();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay() + weekOffset * 7);

  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(startOfWeek);
    d.setDate(startOfWeek.getDate() + i);
    return d;
  });
}

export function calculateStreak(
  logs: { completed_date: string }[],
  today: string
): number {
  if (!logs.length) return 0;

  const dates = new Set(logs.map((l) => l.completed_date));
  let streak = 0;
  const current = new Date(today);

  while (true) {
    const dateStr = getDateString(current);
    if (dates.has(dateStr)) {
      streak++;
      current.setDate(current.getDate() - 1);
    } else {
      break;
    }
  }

  return streak;
}

export function getCompletionPercentage(completed: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((completed / total) * 100);
}

export function generateVerificationCode(): string {
  return Math.random().toString(36).substring(2, 10).toUpperCase();
}

export function truncate(str: string, length: number): string {
  return str.length > length ? `${str.substring(0, length)}...` : str;
}

export const MOTIVATIONAL_QUOTES = [
  { quote: "Small daily improvements are the key to staggering long-term results.", author: "Robin Sharma" },
  { quote: "We are what we repeatedly do. Excellence, then, is not an act, but a habit.", author: "Aristotle" },
  { quote: "The secret of your future is hidden in your daily routine.", author: "Mike Murdock" },
  { quote: "Motivation gets you started. Habit keeps you going.", author: "Jim Ryun" },
  { quote: "Your habits will determine your future.", author: "Jack Canfield" },
  { quote: "First forget inspiration. Habit is more dependable.", author: "Octavia Butler" },
  { quote: "Chains of habit are too light to be felt until they are too heavy to be broken.", author: "Warren Buffett" },
  { quote: "Good habits formed at youth make all the difference.", author: "Aristotle" },
];

export function getDailyQuote(): { quote: string; author: string } {
  const day = new Date().getDay();
  return MOTIVATIONAL_QUOTES[day % MOTIVATIONAL_QUOTES.length];
}
