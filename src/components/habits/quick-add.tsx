"use client";

import { useState, useTransition } from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { HabitForm } from "./habit-form";
import { createHabit } from "@/lib/actions/habits";
import type { HabitInput } from "@/lib/validations/habit";

export function QuickAddHabit() {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = async (data: HabitInput) => {
    startTransition(async () => {
      const result = await createHabit(data);
      if (result.error) {
        toast.error(result.error);
        return;
      }
      toast.success("Habit created! 🎉");
      setOpen(false);
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="shadow-lg shadow-[rgba(37,99,235,0.3)]">
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">New Habit</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Habit</DialogTitle>
        </DialogHeader>
        <HabitForm
          onSubmit={handleSubmit}
          loading={isPending}
          submitLabel="Create habit"
        />
      </DialogContent>
    </Dialog>
  );
}
