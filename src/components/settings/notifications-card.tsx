"use client";

import { useSyncExternalStore, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Bell, Save } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { updateReminderTime } from "@/lib/actions/profile";

type ReminderTimes = {
  reminder_time: string;
  midday_reminder_time: string;
  evening_reminder_time: string;
};

// TIME columns come back as HH:MM:SS; <input type="time"> wants HH:MM
const toInput = (t?: string | null) => t?.slice(0, 5) ?? "";

const noopSubscribe = () => () => {};

export function NotificationsCard({
  reminderTime,
  middayReminderTime,
  eveningReminderTime,
}: {
  reminderTime?: string | null;
  middayReminderTime?: string | null;
  eveningReminderTime?: string | null;
}) {
  const [isPending, startTransition] = useTransition();
  // null during the server render, which doesn't know the device's timezone
  const deviceTimezone = useSyncExternalStore(
    noopSubscribe,
    () => Intl.DateTimeFormat().resolvedOptions().timeZone,
    () => null
  );
  const { register, handleSubmit } = useForm<ReminderTimes>({
    defaultValues: {
      reminder_time: toInput(reminderTime),
      midday_reminder_time: toInput(middayReminderTime),
      evening_reminder_time: toInput(eveningReminderTime),
    },
  });

  const onSubmit = (data: ReminderTimes) => {
    startTransition(async () => {
      const formData = new FormData();
      formData.append("reminder_time", data.reminder_time);
      formData.append("midday_reminder_time", data.midday_reminder_time);
      formData.append("evening_reminder_time", data.evening_reminder_time);
      if (deviceTimezone) formData.append("timezone", deviceTimezone);
      const result = await updateReminderTime(formData);
      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success("Reminder times saved!");
      }
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5 text-[rgb(37,99,235)]" />
          Notifications
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-[rgb(100,116,139)] mb-4">
          Get 3 Telegram reminders a day to stay on top of your daily activities. Leave a time empty to turn that reminder off.
        </p>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            {...register("reminder_time")}
            label="🌅 Morning reminder (today's habit list)"
            type="time"
          />
          <Input
            {...register("midday_reminder_time")}
            label="☀️ Midday check-in (progress so far)"
            type="time"
          />
          <Input
            {...register("evening_reminder_time")}
            label="🌙 Evening summary (how your day went)"
            type="time"
          />
          <p className="text-xs text-[rgb(148,163,184)]">
            Reminders follow your phone&apos;s clock and timezone automatically. Requires Telegram to be connected. Set up Telegram on your Profile page.
          </p>
          <Button type="submit" loading={isPending}>
            <Save className="h-4 w-4" />
            Save
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
