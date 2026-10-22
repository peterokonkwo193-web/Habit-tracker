"use client";

import { useState, useTransition } from "react";
import { motion } from "framer-motion";
import { Sparkles, X, Check, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { createHabit } from "@/lib/actions/habits";
import { Button } from "@/components/ui/button";
import type { HabitInput } from "@/lib/validations/habit";

type TemplateHabit = Omit<HabitInput, "description" | "custom_days" | "start_date" | "reminder_time">;

const TEMPLATES: {
  id: string;
  name: string;
  description: string;
  emoji: string;
  bg: string;
  border: string;
  habits: TemplateHabit[];
}[] = [
  {
    id: "morning",
    name: "Morning Routine",
    description: "Start every day with intention",
    emoji: "🌅",
    bg: "bg-[rgba(245,158,11,0.08)]",
    border: "border-[rgba(245,158,11,0.3)]",
    habits: [
      { name: "Wake up early", emoji: "⏰", category: "Productivity", frequency: "daily" },
      { name: "Drink a glass of water", emoji: "💧", category: "Health", frequency: "daily" },
      { name: "Morning meditation", emoji: "🧘", category: "Mindfulness", frequency: "daily" },
      { name: "Journaling", emoji: "📓", category: "Mindfulness", frequency: "daily" },
      { name: "Morning exercise", emoji: "🏃", category: "Fitness", frequency: "daily" },
    ],
  },
  {
    id: "fitness",
    name: "Fitness",
    description: "Build a stronger, healthier body",
    emoji: "💪",
    bg: "bg-[rgba(16,185,129,0.08)]",
    border: "border-[rgba(16,185,129,0.3)]",
    habits: [
      { name: "Go to the gym", emoji: "🏋️", category: "Fitness", frequency: "weekdays" },
      { name: "Walk 10,000 steps", emoji: "👟", category: "Fitness", frequency: "daily" },
      { name: "Do pushups", emoji: "💪", category: "Fitness", frequency: "daily" },
      { name: "Stretch for 10 mins", emoji: "🤸", category: "Fitness", frequency: "daily" },
      { name: "Track calories", emoji: "🥗", category: "Health", frequency: "daily" },
    ],
  },
  {
    id: "mindfulness",
    name: "Mindfulness",
    description: "Find calm and clarity every day",
    emoji: "🧘",
    bg: "bg-[rgba(139,92,246,0.08)]",
    border: "border-[rgba(139,92,246,0.3)]",
    habits: [
      { name: "Meditate", emoji: "🧘", category: "Mindfulness", frequency: "daily" },
      { name: "Gratitude journal", emoji: "🙏", category: "Mindfulness", frequency: "daily" },
      { name: "Deep breathing", emoji: "🌬️", category: "Mindfulness", frequency: "daily" },
      { name: "Read for 20 mins", emoji: "📚", category: "Productivity", frequency: "daily" },
      { name: "No phone 1hr before bed", emoji: "📵", category: "Health", frequency: "daily" },
    ],
  },
  {
    id: "productivity",
    name: "Productivity",
    description: "Get more done, stress less",
    emoji: "⚡",
    bg: "bg-[rgba(37,99,235,0.08)]",
    border: "border-[rgba(37,99,235,0.3)]",
    habits: [
      { name: "Plan your day", emoji: "📋", category: "Productivity", frequency: "daily" },
      { name: "Review weekly goals", emoji: "🎯", category: "Productivity", frequency: "weekdays" },
      { name: "Learn something new", emoji: "💡", category: "Productivity", frequency: "daily" },
      { name: "No social media before noon", emoji: "🚫", category: "Productivity", frequency: "weekdays" },
      { name: "End-of-day review", emoji: "✅", category: "Productivity", frequency: "weekdays" },
    ],
  },
];

interface TemplatesModalProps {
  onClose: () => void;
  onAdded: () => void;
}

export function TemplatesModal({ onClose, onAdded }: TemplatesModalProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleAdd = (templateId: string) => {
    const template = TEMPLATES.find((t) => t.id === templateId);
    if (!template) return;

    setSelected(templateId);
    startTransition(async () => {
      let added = 0;
      const today = new Date().toISOString().split("T")[0];
      for (const habit of template.habits) {
        const result = await createHabit({
          name: habit.name,
          emoji: habit.emoji,
          category: habit.category as HabitInput["category"],
          frequency: habit.frequency as HabitInput["frequency"],
          description: "",
          custom_days: [],
          start_date: today,
        });
        if (!result.error) added++;
      }
      toast.success(`Added ${added} habits from "${template.name}" 🎉`);
      onAdded();
      onClose();
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative w-full max-w-2xl bg-white dark:bg-[rgb(10,10,15)] rounded-3xl shadow-2xl border border-[rgb(226,232,240)] dark:border-[rgb(30,41,59)] max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-[rgb(10,10,15)] border-b border-[rgb(226,232,240)] dark:border-[rgb(30,41,59)] px-6 py-4 flex items-center justify-between rounded-t-3xl z-10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[rgb(37,99,235)] to-[rgb(139,92,246)] flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-[rgb(15,23,42)] dark:text-white">Habit Templates</h2>
              <p className="text-xs text-[rgb(100,116,139)]">Pick a pack and add all habits instantly</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-[rgb(241,245,249)] dark:hover:bg-[rgb(30,41,59)] transition-colors"
          >
            <X className="h-4 w-4 text-[rgb(100,116,139)]" />
          </button>
        </div>

        {/* Templates grid */}
        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {TEMPLATES.map((template) => (
            <div
              key={template.id}
              className={`rounded-2xl border p-4 transition-all duration-200 ${template.bg} ${template.border}`}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-2xl">{template.emoji}</span>
                    <h3 className="font-bold text-[rgb(15,23,42)] dark:text-white">{template.name}</h3>
                  </div>
                  <p className="text-xs text-[rgb(100,116,139)]">{template.description}</p>
                </div>
              </div>

              <ul className="space-y-1.5 mb-4">
                {template.habits.map((habit) => (
                  <li key={habit.name} className="flex items-center gap-2 text-sm text-[rgb(100,116,139)]">
                    <span className="text-base">{habit.emoji}</span>
                    <span className="truncate">{habit.name}</span>
                  </li>
                ))}
              </ul>

              <Button
                className="w-full"
                size="sm"
                onClick={() => handleAdd(template.id)}
                disabled={isPending}
              >
                {isPending && selected === template.id ? (
                  <><Loader2 className="h-4 w-4 animate-spin" /> Adding...</>
                ) : (
                  <><Check className="h-4 w-4" /> Add {template.habits.length} habits</>
                )}
              </Button>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
