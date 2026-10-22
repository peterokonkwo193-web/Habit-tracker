"use client";

import { useState, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Circle, Flame, MoreVertical, Pencil, Archive, Trash2 } from "lucide-react";
import { toast } from "sonner";
import confetti from "canvas-confetti";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { toggleHabitCompletion, archiveHabit, deleteHabit } from "@/lib/actions/habits";
import { Badge } from "@/components/ui/badge";
import { EditHabitModal } from "@/components/habits/edit-habit-modal";
import type { HabitWithStreak } from "@/types";

const CATEGORY_VARIANTS: Record<string, "default" | "secondary" | "accent" | "destructive" | "outline"> = {
  Health: "secondary",
  Productivity: "default",
  Mindfulness: "accent",
  Fitness: "accent",
  Finance: "destructive",
  Other: "outline",
};

function fireConfetti() {
  confetti({ particleCount: 120, spread: 70, origin: { y: 0.6 }, colors: ["#2563EB", "#10B981", "#F59E0B", "#8B5CF6"] });
  setTimeout(() => {
    confetti({ particleCount: 80, angle: 60, spread: 55, origin: { x: 0 }, colors: ["#2563EB", "#10B981", "#F59E0B"] });
    confetti({ particleCount: 80, angle: 120, spread: 55, origin: { x: 1 }, colors: ["#2563EB", "#10B981", "#F59E0B"] });
  }, 200);
}

function StreakBadge({ streak }: { streak: number }) {
  if (streak >= 100) return <span title="100 day legend!" className="text-xs font-bold text-[rgb(245,158,11)] bg-[rgba(245,158,11,0.15)] px-1.5 py-0.5 rounded-full">🏆 {streak}d</span>;
  if (streak >= 30) return <span title="30 day star!" className="text-xs font-bold text-[rgb(139,92,246)] bg-[rgba(139,92,246,0.15)] px-1.5 py-0.5 rounded-full">⭐ {streak}d</span>;
  if (streak >= 7) return <span title="7 day streak!" className="text-xs font-bold text-[rgb(245,158,11)] bg-[rgba(245,158,11,0.1)] px-1.5 py-0.5 rounded-full">🔥 {streak}d</span>;
  return <span className="text-xs text-[rgb(100,116,139)] flex items-center gap-1"><Flame className="h-3 w-3 text-[rgb(245,158,11)]" />{streak}d streak</span>;
}

interface TodayHabitsProps {
  initialHabits: HabitWithStreak[];
}

export function TodayHabits({ initialHabits }: TodayHabitsProps) {
  const [habits, setHabits] = useState(initialHabits);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [editHabit, setEditHabit] = useState<HabitWithStreak | null>(null);
  const [, startTransition] = useTransition();

  const handleToggle = (habitId: string) => {
    setPendingId(habitId);
    startTransition(async () => {
      const result = await toggleHabitCompletion(habitId);
      setPendingId(null);
      if (result.error) {
        toast.error(result.error);
        return;
      }

      const updatedHabits = habits.map((h) =>
        h.id === habitId ? { ...h, is_completed_today: result.completed } : h
      );
      setHabits(updatedHabits);

      if (result.completed) {
        const allDone = updatedHabits.every((h) => h.is_completed_today);
        if (allDone) {
          toast.success("All habits done! You're on fire! 🎉");
          setTimeout(fireConfetti, 300);
        } else {
          const streak = habits.find(h => h.id === habitId)?.streak?.current_streak ?? 0;
          const newStreak = streak + 1;
          if (newStreak === 100) toast.success("🏆 100 day legend! Incredible!");
          else if (newStreak === 30) toast.success("⭐ 30 day star achieved!");
          else if (newStreak === 7) toast.success("🔥 7 day streak! Keep it up!");
          else toast.success("Habit completed! 🎉");
        }
      }
    });
  };

  const handleArchive = (habitId: string) => {
    startTransition(async () => {
      const result = await archiveHabit(habitId, true);
      if (result.error) { toast.error(result.error); return; }
      setHabits((prev) => prev.filter((h) => h.id !== habitId));
      toast.success("Habit archived");
    });
  };

  const handleDelete = (habitId: string) => {
    if (!confirm("Delete this habit? This cannot be undone.")) return;
    startTransition(async () => {
      const result = await deleteHabit(habitId);
      if (result.error) { toast.error(result.error); return; }
      setHabits((prev) => prev.filter((h) => h.id !== habitId));
      toast.success("Habit deleted");
    });
  };

  if (habits.length === 0) {
    return (
      <div className="text-center py-16 border-2 border-dashed border-[rgb(226,232,240)] dark:border-[rgb(30,41,59)] rounded-2xl">
        <p className="text-4xl mb-4">🌱</p>
        <p className="font-semibold text-[rgb(15,23,42)] dark:text-white">No habits yet</p>
        <p className="text-sm text-[rgb(100,116,139)] mt-1">Create your first habit to get started</p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {habits.map((habit, i) => (
            <motion.div
              key={habit.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: i * 0.05 }}
              className={`flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-2xl border transition-all duration-200 ${
                habit.is_completed_today
                  ? "bg-[rgba(16,185,129,0.05)] border-[rgba(16,185,129,0.2)]"
                  : "bg-white dark:bg-[rgb(15,23,42)] border-[rgb(226,232,240)] dark:border-[rgb(30,41,59)] hover:border-[rgb(37,99,235)] hover:shadow-sm"
              }`}
            >
              <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center text-xl sm:text-2xl flex-shrink-0 ${
                habit.is_completed_today ? "bg-[rgba(16,185,129,0.1)]" : "bg-[rgb(248,250,252)] dark:bg-[rgb(30,41,59)] shadow-sm"
              }`}>
                {habit.emoji}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className={`font-semibold truncate ${
                    habit.is_completed_today ? "text-[rgb(100,116,139)] line-through" : "text-[rgb(15,23,42)] dark:text-white"
                  }`}>
                    {habit.name}
                  </p>
                  <Badge variant={CATEGORY_VARIANTS[habit.category] ?? "outline"} className="text-xs">
                    {habit.category}
                  </Badge>
                </div>
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  <StreakBadge streak={habit.streak?.current_streak ?? 0} />
                  {(habit.streak?.longest_streak ?? 0) > 0 && (
                    <span className="text-xs text-[rgb(148,163,184)]">Best: {habit.streak?.longest_streak}d</span>
                  )}
                </div>
              </div>

              <button
                onClick={() => handleToggle(habit.id)}
                disabled={pendingId === habit.id}
                className="flex-shrink-0 transition-all duration-200 hover:scale-110 disabled:opacity-50"
              >
                {pendingId === habit.id ? (
                  <div className="w-7 h-7 border-2 border-[rgb(37,99,235)] border-t-transparent rounded-full animate-spin" />
                ) : habit.is_completed_today ? (
                  <CheckCircle2 className="w-7 h-7 text-[rgb(16,185,129)]" />
                ) : (
                  <Circle className="w-7 h-7 text-[rgb(226,232,240)] dark:text-[rgb(30,41,59)] hover:text-[rgb(37,99,235)]" />
                )}
              </button>

              <DropdownMenu.Root>
                <DropdownMenu.Trigger asChild>
                  <button className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-[rgb(148,163,184)] hover:text-[rgb(100,116,139)] hover:bg-[rgb(241,245,249)] dark:hover:bg-[rgb(30,41,59)] transition-colors">
                    <MoreVertical className="h-4 w-4" />
                  </button>
                </DropdownMenu.Trigger>
                <DropdownMenu.Portal>
                  <DropdownMenu.Content
                    className="z-50 min-w-40 bg-white dark:bg-[rgb(15,23,42)] border border-[rgb(226,232,240)] dark:border-[rgb(30,41,59)] rounded-xl shadow-xl p-1.5"
                    sideOffset={4}
                    align="end"
                  >
                    <DropdownMenu.Item
                      className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm cursor-pointer hover:bg-[rgb(241,245,249)] dark:hover:bg-[rgb(30,41,59)] text-[rgb(15,23,42)] dark:text-white transition-colors outline-none"
                      onClick={() => setEditHabit(habit)}
                    >
                      <Pencil className="h-4 w-4" /> Edit
                    </DropdownMenu.Item>
                    <DropdownMenu.Item
                      className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm cursor-pointer hover:bg-[rgb(241,245,249)] dark:hover:bg-[rgb(30,41,59)] text-[rgb(100,116,139)] transition-colors outline-none"
                      onClick={() => handleArchive(habit.id)}
                    >
                      <Archive className="h-4 w-4" /> Archive
                    </DropdownMenu.Item>
                    <DropdownMenu.Separator className="my-1 border-t border-[rgb(226,232,240)] dark:border-[rgb(30,41,59)]" />
                    <DropdownMenu.Item
                      className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm cursor-pointer hover:bg-[rgba(239,68,68,0.1)] text-[rgb(239,68,68)] transition-colors outline-none"
                      onClick={() => handleDelete(habit.id)}
                    >
                      <Trash2 className="h-4 w-4" /> Delete
                    </DropdownMenu.Item>
                  </DropdownMenu.Content>
                </DropdownMenu.Portal>
              </DropdownMenu.Root>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {editHabit && (
        <EditHabitModal
          habit={editHabit}
          onClose={() => setEditHabit(null)}
          onSaved={(updated) => {
            setHabits((prev) => prev.map((h) => (h.id === updated.id ? { ...h, ...updated } : h)));
            setEditHabit(null);
          }}
        />
      )}
    </>
  );
}
