export type HabitCategory =
  | "Health"
  | "Productivity"
  | "Mindfulness"
  | "Fitness"
  | "Finance"
  | "Other";

export type HabitFrequency =
  | "daily"
  | "weekdays"
  | "weekends"
  | "custom";

export type DayOfWeek = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export interface Profile {
  id: string;
  user_id: string;
  full_name: string | null;
  avatar_url: string | null;
  timezone: string;
  reminder_time: string | null;
  midday_reminder_time: string | null;
  evening_reminder_time: string | null;
  telegram_chat_id: string | null;
  telegram_username: string | null;
  telegram_verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface Habit {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  category: HabitCategory;
  emoji: string;
  frequency: HabitFrequency;
  custom_days: DayOfWeek[] | null;
  start_date: string;
  reminder_time: string | null;
  is_archived: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface HabitLog {
  id: string;
  habit_id: string;
  user_id: string;
  completed_date: string;
  notes: string | null;
  created_at: string;
}

export interface HabitStreak {
  id: string;
  habit_id: string;
  user_id: string;
  current_streak: number;
  longest_streak: number;
  last_completed_date: string | null;
  updated_at: string;
}

export interface TelegramAccount {
  id: string;
  user_id: string;
  chat_id: string;
  username: string | null;
  verification_code: string | null;
  verification_expires_at: string | null;
  verified_at: string | null;
  created_at: string;
}

export interface HabitWithStreak extends Habit {
  streak?: HabitStreak;
  is_completed_today?: boolean;
  completion_count?: number;
}

export interface DashboardStats {
  total_habits: number;
  completed_today: number;
  completion_percentage: number;
  longest_streak: number;
  active_streaks: number;
}

export interface WeeklyData {
  date: string;
  day: string;
  completed: number;
  total: number;
  percentage: number;
}

export interface MonthlyHeatmapData {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
}

export interface AnalyticsData {
  totalCompletions: number;
  longestStreak: number;
  currentStreak: number;
  bestDay: string;
  weeklyData: WeeklyData[];
  monthlyData: MonthlyHeatmapData[];
  habitBreakdown: {
    name: string;
    emoji: string;
    completions: number;
    streak: number;
    longestStreak: number;
  }[];
}

export interface AdminStats {
  total_users: number;
  active_users_today: number;
  active_users_week: number;
  total_habits: number;
  total_completions_today: number;
  total_telegram_connections: number;
}

export type NotificationType = "morning_reminder" | "evening_summary" | "streak_milestone";

export interface Notification {
  id: string;
  user_id: string;
  type: NotificationType;
  title: string;
  message: string;
  sent_at: string | null;
  delivered: boolean;
  created_at: string;
}
