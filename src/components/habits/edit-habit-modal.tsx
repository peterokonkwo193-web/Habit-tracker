"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { HabitForm } from "./habit-form";
import { updateHabit } from "@/lib/actions/habits";
import type { Habit } from "@/types";
import type { HabitInput } from "@/lib/validations/habit";

interface EditHabitModalProps {
  habit: Habit;
  onClose: () => void;
  onSaved: (updated: Habit) => void;
}

export function EditHabitModal({ habit, onClose, onSaved }: EditHabitModalProps) {
  const [isPending, startTransition] = useTransition();

  const handleSubmit = async (data: HabitInput) => {
    startTransition(async () => {
      try {
        const result = await updateHabit(habit.id, data);
        if (result.error) {
          toast.error(result.error);
          return;
        }
        toast.success("Habit updated!");
        onSaved({ ...habit, ...data } as Habit);
      } catch {
        toast.error("Something went wrong. Please try again.");
      }
    });
  };

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Habit</DialogTitle>
        </DialogHeader>
        <HabitForm
          defaultValues={habit}
          onSubmit={handleSubmit}
          loading={isPending}
          submitLabel="Save changes"
        />
      </DialogContent>
    </Dialog>
  );
}
