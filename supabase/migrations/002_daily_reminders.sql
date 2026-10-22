-- Three daily reminders: morning (existing reminder_time), midday and evening
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS midday_reminder_time TIME DEFAULT '13:00',
  ADD COLUMN IF NOT EXISTS evening_reminder_time TIME DEFAULT '20:00';

ALTER TABLE public.profiles
  ALTER COLUMN reminder_time SET DEFAULT '08:00';
