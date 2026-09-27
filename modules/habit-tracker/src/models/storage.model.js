import { formatDate, generateId } from "@/utils/helpers.js";

import { CoreStore } from "@life-orchestrator/core-store";

export const HABIT_NAMESPACE = "habit_tracker";
export const STORAGE_VERSION = 1;

function migrateHabit(habit = {}) {
  return {
    id: String(habit.id || generateId()),
    name: habit.name || "Untitled Habit",
    category: habit.category ?? "general",
    frequency: Number(habit.frequency ?? 7),
    createdAt: habit.createdAt ?? formatDate(new Date()),
    archived: habit.archived ?? false,
    completedDates: habit.completedDates ?? [],
    skippedDates: habit.skippedDates ?? [],
  };
}

export function saveToStorage(habitsArray) {
  try {
    CoreStore.setNamespace(HABIT_NAMESPACE, {
      version: STORAGE_VERSION,
      habits: habitsArray,
    });
  } catch (error) {
    console.error("Failed to save data structure:", error);
  }
}

export function loadFromStorage() {
  const data = CoreStore.getNamespace(HABIT_NAMESPACE);
  if (!data) return null;

  return {
    version: data.version ?? STORAGE_VERSION,
    habits: (data.habits || [])?.map(migrateHabit),
  };
}

export function clearHabitStorage() {
  CoreStore.clearNamespace(HABIT_NAMESPACE);
}
