"use client";

import { useState, useTransition } from "react";
import { AnimatePresence } from "framer-motion";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import type { DropResult } from "@hello-pangea/dnd";
import React from "react";
import { Plus, GripVertical, Pencil, Archive, ArchiveRestore, Trash2, Flame, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { HabitForm } from "./habit-form";
import { EditHabitModal } from "./edit-habit-modal";
import { TemplatesModal } from "./templates-modal";
import { createHabit, deleteHabit, archiveHabit, reorderHabits } from "@/lib/actions/habits";
import type { HabitInput } from "@/lib/validations/habit";
import type { Habit, HabitStreak } from "@/types";

type HabitWithStreak = Habit & { habit_streaks?: HabitStreak[] };

const CATEGORY_COLORS: Record<string, string> = {
  Health: "text-[rgb(16,185,129)] bg-[rgba(16,185,129,0.1)]",
  Productivity: "text-[rgb(37,99,235)] bg-[rgba(37,99,235,0.1)]",
  Mindfulness: "text-[rgb(139,92,246)] bg-[rgba(139,92,246,0.1)]",
  Fitness: "text-[rgb(245,158,11)] bg-[rgba(245,158,11,0.1)]",
  Finance: "text-[rgb(239,68,68)] bg-[rgba(239,68,68,0.1)]",
  Other: "text-[rgb(100,116,139)] bg-[rgb(241,245,249)]",
};

export function HabitsManager({ initialHabits }: { initialHabits: HabitWithStreak[] }) {
  const [habits, setHabits] = useState(initialHabits);
  const [createOpen, setCreateOpen] = useState(false);
  const [templatesOpen, setTemplatesOpen] = useState(false);
  const [editHabit, setEditHabit] = useState<HabitWithStreak | null>(null);
  const [isPending, startTransition] = useTransition();

  const activeHabits = habits.filter((h) => !h.is_archived);
  const archivedHabits = habits.filter((h) => h.is_archived);

  const handleCreate = async (data: HabitInput) => {
    startTransition(async () => {
      try {
        const result = await createHabit(data);
        if (result.error) { toast.error(result.error); return; }
        toast.success("Habit created! 🎉");
        setCreateOpen(false);
        if (result.habit) setHabits((prev) => [...prev, result.habit as HabitWithStreak]);
      } catch {
        toast.error("Something went wrong creating your habit. Please try again.");
      }
    });
  };

  const handleDelete = (id: string) => {
    if (!confirm("Delete this habit permanently?")) return;
    startTransition(async () => {
      const result = await deleteHabit(id);
      if (result.error) { toast.error(result.error); return; }
      setHabits((prev) => prev.filter((h) => h.id !== id));
      toast.success("Habit deleted");
    });
  };

  const handleArchiveToggle = (id: string, currentArchived: boolean) => {
    startTransition(async () => {
      const result = await archiveHabit(id, !currentArchived);
      if (result.error) { toast.error(result.error); return; }
      setHabits((prev) => prev.map((h) => h.id === id ? { ...h, is_archived: !currentArchived } : h));
      toast.success(!currentArchived ? "Habit archived" : "Habit restored");
    });
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const items = Array.from(activeHabits);
    const [moved] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, moved);
    const reordered = items.map((h, i) => ({ ...h, sort_order: i }));
    setHabits((prev) => [
      ...reordered,
      ...prev.filter((h) => h.is_archived),
    ]);
    startTransition(async () => {
      await reorderHabits(reordered.map((h) => h.id));
    });
  };

  const HabitCard = ({ habit, draggable }: { habit: HabitWithStreak; draggable?: boolean }) => (
    <div className="flex items-center gap-4 p-4 rounded-2xl border border-[rgb(226,232,240)] dark:border-[rgb(30,41,59)] bg-white dark:bg-[rgb(15,23,42)] hover:shadow-sm transition-all duration-200">
      {draggable && (
        <GripVertical className="h-4 w-4 text-[rgb(148,163,184)] flex-shrink-0 cursor-grab" />
      )}
      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-[rgb(241,245,249)] dark:bg-[rgb(30,41,59)] flex items-center justify-center text-xl sm:text-2xl flex-shrink-0">
        {habit.emoji}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <p className="font-semibold text-[rgb(15,23,42)] dark:text-white truncate">{habit.name}</p>
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${CATEGORY_COLORS[habit.category] ?? ""}`}>
            {habit.category}
          </span>
        </div>
        <div className="flex items-center gap-3 mt-1">
          <span className="text-xs text-[rgb(100,116,139)] capitalize">{habit.frequency}</span>
          <span className="text-xs text-[rgb(100,116,139)] flex items-center gap-1">
            <Flame className="h-3 w-3 text-[rgb(245,158,11)]" />
            {habit.habit_streaks?.[0]?.current_streak ?? 0}d streak
          </span>
        </div>
        {habit.description && (
          <p className="text-xs text-[rgb(148,163,184)] mt-1 truncate">{habit.description}</p>
        )}
      </div>
      <div className="flex items-center gap-1.5 flex-shrink-0">
        <button
          onClick={() => setEditHabit(habit)}
          className="w-8 h-8 rounded-lg flex items-center justify-center text-[rgb(100,116,139)] hover:text-[rgb(37,99,235)] hover:bg-[rgba(37,99,235,0.1)] transition-colors"
        >
          <Pencil className="h-4 w-4" />
        </button>
        <button
          onClick={() => handleArchiveToggle(habit.id, habit.is_archived)}
          className="w-8 h-8 rounded-lg flex items-center justify-center text-[rgb(100,116,139)] hover:text-[rgb(245,158,11)] hover:bg-[rgba(245,158,11,0.1)] transition-colors"
        >
          {habit.is_archived ? <ArchiveRestore className="h-4 w-4" /> : <Archive className="h-4 w-4" />}
        </button>
        <button
          onClick={() => handleDelete(habit.id)}
          className="w-8 h-8 rounded-lg flex items-center justify-center text-[rgb(100,116,139)] hover:text-[rgb(239,68,68)] hover:bg-[rgba(239,68,68,0.1)] transition-colors"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[rgb(15,23,42)] dark:text-white">My Habits</h1>
          <p className="text-sm text-[rgb(100,116,139)] mt-1">
            {activeHabits.length} active · {archivedHabits.length} archived
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setTemplatesOpen(true)}>
            <Sparkles className="h-4 w-4" /> Templates
          </Button>
          <Button onClick={() => setCreateOpen(true)}>
            <Plus className="h-4 w-4" /> New Habit
          </Button>
        </div>
      </div>

      <Tabs defaultValue="active">
        <TabsList>
          <TabsTrigger value="active">Active ({activeHabits.length})</TabsTrigger>
          <TabsTrigger value="archived">Archived ({archivedHabits.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="active">
          {activeHabits.length === 0 ? (
            <div className="text-center py-20 border-2 border-dashed border-[rgb(226,232,240)] dark:border-[rgb(30,41,59)] rounded-2xl">
              <p className="text-4xl mb-4">🌱</p>
              <p className="font-semibold text-[rgb(15,23,42)] dark:text-white">No habits yet</p>
              <p className="text-sm text-[rgb(100,116,139)] mt-1 mb-6">Start from a template or create your own</p>
              <div className="flex items-center justify-center gap-3 flex-wrap">
                <Button variant="outline" onClick={() => setTemplatesOpen(true)}>
                  <Sparkles className="h-4 w-4" /> Browse Templates
                </Button>
                <Button onClick={() => setCreateOpen(true)}>
                  <Plus className="h-4 w-4" /> Create habit
                </Button>
              </div>
            </div>
          ) : (
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="habits">
                {(provided) => (
                  <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-3">
                    <AnimatePresence>
                      {activeHabits.map((habit, i) => (
                        <Draggable key={habit.id} draggableId={habit.id} index={i}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              style={provided.draggableProps.style as React.CSSProperties}
                              className={snapshot.isDragging ? "opacity-70 rotate-1 shadow-2xl" : ""}
                            >
                              <HabitCard habit={habit} draggable />
                            </div>
                          )}
                        </Draggable>
                      ))}
                    </AnimatePresence>
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          )}
        </TabsContent>

        <TabsContent value="archived">
          {archivedHabits.length === 0 ? (
            <div className="text-center py-16 text-[rgb(100,116,139)]">
              <p className="text-3xl mb-3">📦</p>
              <p>No archived habits</p>
            </div>
          ) : (
            <div className="space-y-3">
              {archivedHabits.map((habit) => (
                <HabitCard key={habit.id} habit={habit} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Create modal */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Habit</DialogTitle>
          </DialogHeader>
          <HabitForm onSubmit={handleCreate} loading={isPending} submitLabel="Create habit" />
        </DialogContent>
      </Dialog>

      {/* Templates modal */}
      {templatesOpen && (
        <TemplatesModal
          onClose={() => setTemplatesOpen(false)}
          onAdded={() => window.location.reload()}
        />
      )}

      {/* Edit modal */}
      {editHabit && (
        <EditHabitModal
          habit={editHabit}
          onClose={() => setEditHabit(null)}
          onSaved={(updated) => {
            setHabits((prev) => prev.map((h) => h.id === updated.id ? { ...h, ...updated } : h));
            setEditHabit(null);
          }}
        />
      )}
    </div>
  );
}
