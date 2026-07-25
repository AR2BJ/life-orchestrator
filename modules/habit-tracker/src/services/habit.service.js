import { formatDate, generateId } from "@/utils/helpers.js";

export const HabitService = {
  createHabit(currentHabits, name, category = "General", frequency = 7) {
    const cleaned = name.trim().replace(/\s+/g, " ");
    if (!cleaned || cleaned.length < 2 || cleaned.length > 20) {
      throw new Error("Invalid habit name length (2-20 chars).");
    }

    const alreadyExists = currentHabits.some(
      (h) => h.name.toLowerCase() === cleaned.toLowerCase(),
    );
    if (alreadyExists) {
      throw new Error("Habit already exists.");
    }

    const newHabit = {
      id: generateId(),
      name: cleaned,
      category: category,
      frequency: Number(frequency),
      createdAt: formatDate(new Date()),
      archived: false,
      completedDates: [],
      skippedDates: [],
    };

    return [newHabit, ...currentHabits];
  },

  toggleHabit(currentHabits, id) {
    const today = formatDate(new Date());
    return currentHabits.map((habit) => {
      if (habit.id !== id) return habit;

      const completedDates = [...habit.completedDates];
      const index = completedDates.indexOf(today);
      if (index > -1) {
        completedDates.splice(index, 1);
      } else {
        completedDates.push(today);
      }
      return { ...habit, completedDates };
    });
  },

  toggleSkipHabitDate(currentHabits, habitId, date) {
    return currentHabits.map((habit) => {
      if (habit.id !== habitId) return habit;

      let completedDates = [...habit.completedDates];
      const compIndex = completedDates.indexOf(date);
      if (compIndex > -1) completedDates.splice(compIndex, 1);

      let skippedDates = [...(habit.skippedDates || [])];
      const skipIndex = skippedDates.indexOf(date);

      if (skipIndex > -1) {
        skippedDates.splice(skipIndex, 1);
      } else {
        skippedDates.push(date);
      }

      return { ...habit, completedDates, skippedDates };
    });
  },

  toggleHabitDate(currentHabits, habitId, date) {
    return currentHabits.map((habit) => {
      if (habit.id !== habitId) return habit;

      const completedDates = [...habit.completedDates];
      const index = completedDates.indexOf(date);
      if (index > -1) {
        completedDates.splice(index, 1);
      } else {
        completedDates.push(date);
      }
      return { ...habit, completedDates };
    });
  },

  editHabit(currentHabits, id, newName) {
    const habit = currentHabits.find((h) => h.id === id);
    if (!habit) throw new Error("Habit not found.");

    const cleaned = newName.trim().replace(/\s+/g, " ");
    if (!cleaned || cleaned.length < 2 || cleaned.length > 20) {
      throw new Error("Invalid habit name length (2-20 chars).");
    }

    const alreadyExists = currentHabits.some(
      (h) => h.id !== id && h.name.toLowerCase() === cleaned.toLowerCase(),
    );
    if (alreadyExists) {
      throw new Error("Habit already exists.");
    }

    return currentHabits.map((h) =>
      h.id === id ? { ...h, name: cleaned } : h,
    );
  },

  deleteHabit(currentHabits, id) {
    return currentHabits.filter((h) => h.id !== id);
  },

  archiveHabit(currentHabits, id) {
    return currentHabits.map((h) =>
      h.id === id ? { ...h, archived: true } : h,
    );
  },

  restoreHabit(currentHabits, id) {
    return currentHabits.map((h) =>
      h.id === id ? { ...h, archived: false } : h,
    );
  },
};
