"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { habitSchema, type HabitInput } from "@/lib/validations/habit";
import type { Habit } from "@/types";

const EMOJIS = ["💧", "🏃", "📚", "🧘", "💪", "🥗", "😴", "💰", "🎯", "✍️", "🎵", "🌿", "☕", "🚴", "🧠", "❤️", "🌅", "🏋️", "📝", "🎨"];
const CATEGORIES = ["Health", "Productivity", "Mindfulness", "Fitness", "Finance", "Other"];
const FREQUENCIES = [
  { value: "daily", label: "Daily" },
  { value: "weekdays", label: "Weekdays (Mon–Fri)" },
  { value: "weekends", label: "Weekends (Sat–Sun)" },
  { value: "custom", label: "Custom days" },
];
const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

interface HabitFormProps {
  defaultValues?: Partial<Habit>;
  onSubmit: (data: HabitInput) => Promise<void>;
  loading?: boolean;
  submitLabel?: string;
}

export function HabitForm({ defaultValues, onSubmit, loading, submitLabel = "Save habit" }: HabitFormProps) {
  const [selectedEmoji, setSelectedEmoji] = useState(defaultValues?.emoji ?? "✅");
  const [customDays, setCustomDays] = useState<number[]>(defaultValues?.custom_days ?? []);

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<HabitInput>({
    resolver: zodResolver(habitSchema),
    defaultValues: {
      name: defaultValues?.name ?? "",
      description: defaultValues?.description ?? "",
      category: (defaultValues?.category as HabitInput["category"]) ?? "Other",
      emoji: defaultValues?.emoji ?? "✅",
      frequency: (defaultValues?.frequency as HabitInput["frequency"]) ?? "daily",
      start_date: defaultValues?.start_date ?? new Date().toISOString().split("T")[0],
      reminder_time: defaultValues?.reminder_time ?? "",
      custom_days: defaultValues?.custom_days ?? [],
    },
  });

  const frequency = watch("frequency");

  const toggleDay = (day: number) => {
    const next = customDays.includes(day)
      ? customDays.filter((d) => d !== day)
      : [...customDays, day];
    setCustomDays(next);
    setValue("custom_days", next);
  };

  const handleEmojiSelect = (emoji: string) => {
    setSelectedEmoji(emoji);
    setValue("emoji", emoji);
  };

  const handleFormSubmit = async (data: HabitInput) => {
    await onSubmit({
      ...data,
      emoji: selectedEmoji,
      custom_days: frequency === "custom" ? customDays : null,
      reminder_time: data.reminder_time || null,
      description: data.description || null,
    });
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-5">
      {/* Emoji picker */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-[rgb(15,23,42)] dark:text-[rgb(241,245,249)]">
          Emoji
        </label>
        <div className="flex flex-wrap gap-2">
          {EMOJIS.map((emoji) => (
            <button
              key={emoji}
              type="button"
              onClick={() => handleEmojiSelect(emoji)}
              className={`w-10 h-10 rounded-xl text-xl transition-all hover:scale-110 ${
                selectedEmoji === emoji
                  ? "bg-[rgba(37,99,235,0.15)] ring-2 ring-[rgb(37,99,235)] scale-110"
                  : "bg-[rgb(241,245,249)] dark:bg-[rgb(30,41,59)] hover:bg-[rgba(37,99,235,0.1)]"
              }`}
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>

      <Input
        {...register("name")}
        label="Habit name"
        placeholder="e.g., Drink 8 glasses of water"
        error={errors.name?.message}
      />

      <div className="space-y-1.5">
        <label className="text-sm font-medium text-[rgb(15,23,42)] dark:text-[rgb(241,245,249)]">
          Description (optional)
        </label>
        <textarea
          {...register("description")}
          placeholder="Add a description or notes..."
          rows={2}
          className="flex w-full rounded-xl border border-[rgb(226,232,240)] bg-white px-4 py-2.5 text-sm transition-all duration-200 placeholder:text-[rgb(148,163,184)] focus:outline-none focus:ring-2 focus:ring-[rgb(37,99,235)] focus:border-transparent dark:bg-[rgb(15,23,42)] dark:border-[rgb(30,41,59)] dark:text-[rgb(241,245,249)] resize-none"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Category */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-[rgb(15,23,42)] dark:text-[rgb(241,245,249)]">
            Category
          </label>
          <Select
            defaultValue={defaultValues?.category ?? "Other"}
            onValueChange={(v) => setValue("category", v as HabitInput["category"])}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map((c) => (
                <SelectItem key={c} value={c}>{c}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Frequency */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-[rgb(15,23,42)] dark:text-[rgb(241,245,249)]">
            Frequency
          </label>
          <Select
            defaultValue={defaultValues?.frequency ?? "daily"}
            onValueChange={(v) => setValue("frequency", v as HabitInput["frequency"])}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {FREQUENCIES.map((f) => (
                <SelectItem key={f.value} value={f.value}>{f.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Custom days picker */}
      {frequency === "custom" && (
        <div className="space-y-2">
          <label className="text-sm font-medium text-[rgb(15,23,42)] dark:text-[rgb(241,245,249)]">
            Select days
          </label>
          <div className="flex gap-2">
            {DAY_LABELS.map((day, i) => (
              <button
                key={day}
                type="button"
                onClick={() => toggleDay(i)}
                className={`flex-1 h-10 rounded-xl text-sm font-medium transition-all ${
                  customDays.includes(i)
                    ? "bg-[rgb(37,99,235)] text-white"
                    : "bg-[rgb(241,245,249)] dark:bg-[rgb(30,41,59)] text-[rgb(100,116,139)] hover:bg-[rgba(37,99,235,0.1)] hover:text-[rgb(37,99,235)]"
                }`}
              >
                {day}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <Input
          {...register("start_date")}
          label="Start date"
          type="date"
          error={errors.start_date?.message}
        />
        <Input
          {...register("reminder_time")}
          label="Reminder time (optional)"
          type="time"
        />
      </div>

      <Button type="submit" className="w-full" size="lg" loading={loading}>
        {submitLabel}
      </Button>
    </form>
  );
}
