import { z } from "zod";

export const habitSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name too long"),
  description: z.string().max(500, "Description too long").optional().nullable(),
  category: z.enum(["Health", "Productivity", "Mindfulness", "Fitness", "Finance", "Other"]),
  emoji: z.string().min(1, "Emoji is required"),
  frequency: z.enum(["daily", "weekdays", "weekends", "custom"]),
  custom_days: z.array(z.number().min(0).max(6)).optional().nullable(),
  start_date: z.string().min(1, "Start date is required"),
  reminder_time: z.string().optional().nullable(),
});

export type HabitInput = z.infer<typeof habitSchema>;

export const profileSchema = z.object({
  full_name: z.string().min(2, "Name too short").max(50, "Name too long"),
  timezone: z.string().min(1, "Timezone required"),
  reminder_time: z.string().optional().nullable(),
});

export type ProfileInput = z.infer<typeof profileSchema>;
