-- ============================================================
-- Habit Tracker - Complete Supabase Schema
-- ============================================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_cron";

-- ============================================================
-- PROFILES TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  avatar_url TEXT,
  timezone TEXT NOT NULL DEFAULT 'UTC',
  reminder_time TIME,
  telegram_chat_id TEXT,
  telegram_username TEXT,
  telegram_verified BOOLEAN NOT NULL DEFAULT false,
  is_admin BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT profiles_user_id_key UNIQUE (user_id)
);

CREATE INDEX idx_profiles_user_id ON public.profiles(user_id);
CREATE INDEX idx_profiles_telegram_chat_id ON public.profiles(telegram_chat_id);

-- ============================================================
-- HABITS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.habits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL DEFAULT 'Other'
    CHECK (category IN ('Health', 'Productivity', 'Mindfulness', 'Fitness', 'Finance', 'Other')),
  emoji TEXT NOT NULL DEFAULT '✅',
  frequency TEXT NOT NULL DEFAULT 'daily'
    CHECK (frequency IN ('daily', 'weekdays', 'weekends', 'custom')),
  custom_days INTEGER[] DEFAULT NULL,
  start_date DATE NOT NULL DEFAULT CURRENT_DATE,
  reminder_time TIME,
  is_archived BOOLEAN NOT NULL DEFAULT false,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_habits_user_id ON public.habits(user_id);
CREATE INDEX idx_habits_user_archived ON public.habits(user_id, is_archived);
CREATE INDEX idx_habits_sort ON public.habits(user_id, sort_order);

-- ============================================================
-- HABIT LOGS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.habit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  habit_id UUID NOT NULL REFERENCES public.habits(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  completed_date DATE NOT NULL DEFAULT CURRENT_DATE,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT habit_logs_unique UNIQUE (habit_id, completed_date)
);

CREATE INDEX idx_habit_logs_habit_id ON public.habit_logs(habit_id);
CREATE INDEX idx_habit_logs_user_id ON public.habit_logs(user_id);
CREATE INDEX idx_habit_logs_date ON public.habit_logs(user_id, completed_date);
CREATE INDEX idx_habit_logs_habit_date ON public.habit_logs(habit_id, completed_date);

-- ============================================================
-- HABIT STREAKS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.habit_streaks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  habit_id UUID NOT NULL REFERENCES public.habits(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  current_streak INTEGER NOT NULL DEFAULT 0,
  longest_streak INTEGER NOT NULL DEFAULT 0,
  last_completed_date DATE,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT habit_streaks_habit_id_key UNIQUE (habit_id)
);

CREATE INDEX idx_habit_streaks_user_id ON public.habit_streaks(user_id);
CREATE INDEX idx_habit_streaks_habit_id ON public.habit_streaks(habit_id);

-- ============================================================
-- TELEGRAM ACCOUNTS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.telegram_accounts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  chat_id TEXT NOT NULL,
  username TEXT,
  verification_code TEXT,
  verification_expires_at TIMESTAMPTZ,
  verified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT telegram_accounts_user_id_key UNIQUE (user_id),
  CONSTRAINT telegram_accounts_chat_id_key UNIQUE (chat_id)
);

CREATE INDEX idx_telegram_accounts_user_id ON public.telegram_accounts(user_id);
CREATE INDEX idx_telegram_accounts_chat_id ON public.telegram_accounts(chat_id);
CREATE INDEX idx_telegram_accounts_code ON public.telegram_accounts(verification_code);

-- ============================================================
-- NOTIFICATIONS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL
    CHECK (type IN ('morning_reminder', 'evening_summary', 'streak_milestone')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  sent_at TIMESTAMPTZ,
  delivered BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX idx_notifications_sent ON public.notifications(sent_at);

-- ============================================================
-- DAILY SUMMARIES TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.daily_summaries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  summary_date DATE NOT NULL DEFAULT CURRENT_DATE,
  total_habits INTEGER NOT NULL DEFAULT 0,
  completed_habits INTEGER NOT NULL DEFAULT 0,
  completion_rate NUMERIC(5, 2) NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT daily_summaries_unique UNIQUE (user_id, summary_date)
);

CREATE INDEX idx_daily_summaries_user_id ON public.daily_summaries(user_id);
CREATE INDEX idx_daily_summaries_date ON public.daily_summaries(summary_date);

-- ============================================================
-- UPDATED_AT TRIGGER FUNCTION
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER habits_updated_at
  BEFORE UPDATE ON public.habits
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER habit_streaks_updated_at
  BEFORE UPDATE ON public.habit_streaks
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ============================================================
-- AUTO-CREATE PROFILE ON USER SIGNUP
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- STREAK UPDATE FUNCTION
-- ============================================================
CREATE OR REPLACE FUNCTION public.update_habit_streak(p_habit_id UUID, p_user_id UUID, p_date DATE)
RETURNS void AS $$
DECLARE
  v_last_date DATE;
  v_current_streak INTEGER;
  v_longest_streak INTEGER;
  v_yesterday DATE;
BEGIN
  v_yesterday := p_date - INTERVAL '1 day';

  SELECT last_completed_date, current_streak, longest_streak
  INTO v_last_date, v_current_streak, v_longest_streak
  FROM public.habit_streaks
  WHERE habit_id = p_habit_id;

  IF NOT FOUND THEN
    INSERT INTO public.habit_streaks (habit_id, user_id, current_streak, longest_streak, last_completed_date)
    VALUES (p_habit_id, p_user_id, 1, 1, p_date);
    RETURN;
  END IF;

  IF v_last_date = p_date THEN
    RETURN;
  END IF;

  IF v_last_date = v_yesterday THEN
    v_current_streak := v_current_streak + 1;
  ELSE
    v_current_streak := 1;
  END IF;

  IF v_current_streak > v_longest_streak THEN
    v_longest_streak := v_current_streak;
  END IF;

  UPDATE public.habit_streaks
  SET current_streak = v_current_streak,
      longest_streak = v_longest_streak,
      last_completed_date = p_date
  WHERE habit_id = p_habit_id;
END;
$$ LANGUAGE plpgsql;

-- ============================================================
-- ROW LEVEL SECURITY POLICIES
-- ============================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.habits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.habit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.habit_streaks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.telegram_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_summaries ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "profiles_select_own" ON public.profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "profiles_insert_own" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "profiles_update_own" ON public.profiles
  FOR UPDATE USING (auth.uid() = user_id);

-- Habits policies
CREATE POLICY "habits_select_own" ON public.habits
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "habits_insert_own" ON public.habits
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "habits_update_own" ON public.habits
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "habits_delete_own" ON public.habits
  FOR DELETE USING (auth.uid() = user_id);

-- Habit logs policies
CREATE POLICY "habit_logs_select_own" ON public.habit_logs
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "habit_logs_insert_own" ON public.habit_logs
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "habit_logs_delete_own" ON public.habit_logs
  FOR DELETE USING (auth.uid() = user_id);

-- Habit streaks policies
CREATE POLICY "habit_streaks_select_own" ON public.habit_streaks
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "habit_streaks_insert_own" ON public.habit_streaks
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "habit_streaks_update_own" ON public.habit_streaks
  FOR UPDATE USING (auth.uid() = user_id);

-- Telegram accounts policies
CREATE POLICY "telegram_select_own" ON public.telegram_accounts
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "telegram_insert_own" ON public.telegram_accounts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "telegram_update_own" ON public.telegram_accounts
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "telegram_delete_own" ON public.telegram_accounts
  FOR DELETE USING (auth.uid() = user_id);

-- Notifications policies
CREATE POLICY "notifications_select_own" ON public.notifications
  FOR SELECT USING (auth.uid() = user_id);

-- Daily summaries policies
CREATE POLICY "daily_summaries_select_own" ON public.daily_summaries
  FOR SELECT USING (auth.uid() = user_id);

-- Admin policies (service role bypasses RLS)
-- Use service role key for admin operations

-- ============================================================
-- ADMIN VIEW (materialized for performance)
-- ============================================================
CREATE OR REPLACE VIEW public.admin_stats AS
SELECT
  (SELECT COUNT(*) FROM auth.users) AS total_users,
  (SELECT COUNT(*) FROM public.habits WHERE is_archived = false) AS total_habits,
  (SELECT COUNT(*) FROM public.habit_logs WHERE completed_date = CURRENT_DATE) AS completions_today,
  (SELECT COUNT(*) FROM public.telegram_accounts WHERE verified_at IS NOT NULL) AS telegram_connections,
  (SELECT COUNT(DISTINCT user_id) FROM public.habit_logs WHERE completed_date = CURRENT_DATE) AS active_users_today,
  (SELECT COUNT(DISTINCT user_id) FROM public.habit_logs
   WHERE completed_date >= CURRENT_DATE - INTERVAL '7 days') AS active_users_week;
