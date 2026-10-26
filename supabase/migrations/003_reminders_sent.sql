-- Tracks which reminders were already sent on which local date, e.g.
-- {"morning":"2026-10-26","midday":"2026-10-26"}, so a late cron run can
-- still deliver a reminder without sending it twice.
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS reminders_sent JSONB NOT NULL DEFAULT '{}';
