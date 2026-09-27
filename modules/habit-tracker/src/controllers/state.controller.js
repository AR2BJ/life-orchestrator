import { NotificationService } from "@/services/notification.service";
import { StateManager } from "@/models/state.model";
import { formatDate } from "@/utils/helpers.js";
import { loadFromStorage } from "@/models/storage.model.js";

export const StateController = {
  execute() {
    const storageData = loadFromStorage();
    if (
      !storageData ||
      !storageData.habits ||
      storageData.habits.length === 0
    ) {
      return;
    }

    let isDataMutated = false;

    const today = new Date();

    const updatedHabits = storageData.habits.map((habit) => {
      if (habit.archived) return habit;

      const startDateStr = habit.createdAt;
      if (!startDateStr) return habit;

      const completedSet = new Set(habit.completedDates || []);
      const skippedSet = new Set(habit.skippedDates || []);

      const loopDate = new Date(today);
      loopDate.setDate(loopDate.getDate() - 1);

      const startDate = new Date(startDateStr);
      let isHabitMutated = false;

      while (formatDate(loopDate) >= formatDate(startDate)) {
        const checkDateStr = formatDate(loopDate);

        if (!completedSet.has(checkDateStr) && !skippedSet.has(checkDateStr)) {
          habit.skippedDates.push(checkDateStr);
          skippedSet.add(checkDateStr);
          isHabitMutated = true;
          isDataMutated = true;
        }

        loopDate.setDate(loopDate.getDate() - 1);
      }

      if (isHabitMutated) {
        habit.skippedDates.sort();
      }

      return habit;
    });

    if (isDataMutated) {
      StateManager.save(updatedHabits);
      NotificationService.show({
        type: "success",
        message:
          "Previous days without a status have been automatically marked as skipped",
        icon: "ti-circle-check",
        iconColor: "text-emerald-500/80",
        duration: 5000,
      });
    }
  },
};
