import { formatDate, todayISO } from "@/utils/helpers.js";
import {
  setPendingDeleteId,
  setPendingEditId,
} from "./habit-form.controller.js";

import { GlobalLoaderService } from "@/services/loader.service.js";
import { HabitController } from "../habit.controller.js";
import { HabitService } from "@/services/habit.service.js";
import { NotificationService } from "@/services/notification.service.js";
import { SettingsController } from "../settings.controller.js";
import { StateController } from "../state.controller.js";
import { StateManager } from "@/models/state.model.js";

let clickTimeout = null;

export const HabitActionController = {
  init(mainController) {
    this.mainController = mainController;
    this.bindDynamicEvents();
  },

  bindDynamicEvents() {
    const listContainer = document.getElementById("habit-list");
    if (!listContainer) return;

    listContainer.addEventListener("click", (e) => {
      const target = e.target;

      const toggleBtn = target.closest(".toggle-btn");
      if (toggleBtn) {
        const id = toggleBtn.dataset.id;
        const currentHabits = StateManager.getHabits();
        const habit = currentHabits.find((h) => h.id === id);

        if (habit) {
          GlobalLoaderService.show(`Updating state for "${habit.name}"...`);

          setTimeout(() => {
            try {
              const updated = HabitService.toggleHabit(currentHabits, id);
              StateManager.save(updated);
              this.mainController.refreshUI();

              const todayStr = formatDate(new Date());
              const isNowCompleted = updated
                .find((h) => h.id === id)
                .completedDates.includes(todayStr);

              NotificationService.show({
                type: isNowCompleted ? "success" : "info",
                message: isNowCompleted
                  ? `Completed "${habit.name}" for today! ✨`
                  : `Removed completion for "${habit.name}"`,
                icon: isNowCompleted ? "fa-circle-check" : "fa-circle",
                iconColor: isNowCompleted
                  ? "text-emerald-500/80"
                  : "text-brand/80",
                duration: 5000,
              });
            } catch (error) {
            } finally {
              GlobalLoaderService.hide();
            }
          }, 30);
        }
        return;
      }

      const dayBtn = target.closest(".calendar-day");
      if (dayBtn && dayBtn.dataset.habitId) {
        e.preventDefault();
        e.stopPropagation();

        const id = dayBtn.dataset.habitId;
        const date = dayBtn.dataset.date;
        const habit = StateManager.getHabits().find((h) => h.id === id);
        if (habit?.archived) return;

        const today = todayISO();
        const yesterday = formatDate(new Date(Date.now() - 86400000));

        if (date !== today && date !== yesterday) return;

        if (clickTimeout) {
          clearTimeout(clickTimeout);
          clickTimeout = null;

          GlobalLoaderService.show(
            `Processing calendar entry for ${date === today ? "Today" : "Yesterday"}...`,
          );
          
          setTimeout(() => {
            try {
              const updated = HabitService.toggleSkipHabitDate(
                StateManager.getHabits(),
                id,
                date,
              );
              StateManager.save(updated);
              this.mainController.refreshUI();

              const isNowSkipped = updated
                .find((h) => h.id === id)
                .skippedDates?.includes(date);
              NotificationService.show({
                type: isNowSkipped ? "warning" : "info",
                message: isNowSkipped
                  ? `Safeguard activated: Skipped day for "${habit.name}".`
                  : `Removed safeguard for "${habit.name}"`,
                icon: isNowSkipped ? "fa-shield-halved" : "fa-calendar",
                iconColor: isNowSkipped ? "text-amber-500/80" : "text-brand/80",
                duration: 5000,
              });
            } finally {
              GlobalLoaderService.hide();
            }
          }, 10);
        } else {
          clickTimeout = setTimeout(() => {
            clickTimeout = null;

            GlobalLoaderService.show(
              `Updating history for ${date === today ? "Today" : "Yesterday"}...`,
            );

            setTimeout(() => {
              try {
                const updated = HabitService.toggleHabitDate(
                  StateManager.getHabits(),
                  id,
                  date,
                );
                StateManager.save(updated);
                this.mainController.refreshUI();

                const isNowCompleted = updated
                  .find((h) => h.id === id)
                  .completedDates.includes(date);
                const dateLabel = date === today ? "Today" : "Yesterday";

                NotificationService.show({
                  type: isNowCompleted ? "success" : "info",
                  message: isNowCompleted
                    ? `Marked "${habit.name}" as done for ${dateLabel}! ✨`
                    : `Unchecked "${habit.name}" for ${dateLabel}`,
                  icon: isNowCompleted ? "fa-square-check" : "fa-square-xmark",
                  iconColor: isNowCompleted
                    ? "text-emerald-500/80"
                    : "text-brand/80",
                  duration: 5000,
                });
              } finally {
                GlobalLoaderService.hide();
              }
            }, 10);
          }, 250);
        }
        return;
      }

      const editBtn = target.closest(".edit-btn");
      if (editBtn) {
        const id = editBtn.dataset.id;
        setPendingEditId(id);
        const habit = StateManager.getHabits().find((h) => h.id === id);
        const editInput = document.getElementById("edit-habit-input");
        if (editInput && habit) editInput.value = habit.name;
        this.mainController.toggleModal("edit-modal", true);
        return;
      }

      const deleteBtn = target.closest(".delete-btn");
      if (deleteBtn) {
        setPendingDeleteId(deleteBtn.dataset.id);
        this.mainController.toggleModal("delete-modal", true);
        return;
      }

      const archiveBtn = target.closest(".archive-btn");

      if (archiveBtn) {
        const id = archiveBtn.dataset.id;
        const currentHabits = StateManager.getHabits();
        const targetHabit = currentHabits.find((h) => h.id === id);

        if (targetHabit) {
          GlobalLoaderService.show(`Archiving "${targetHabit.name}" record...`);

          setTimeout(() => {
            try {
              const updated = HabitService.archiveHabit(currentHabits, id);
              StateManager.save(updated);
              this.mainController.refreshUI();

              NotificationService.show({
                type: "info",
                message: `Archived: "${targetHabit.name}"`,
                duration: 5000,
                undoAction: () => {
                  GlobalLoaderService.show("Rolling back archive operation...");
                  setTimeout(() => {
                    try {
                      const rollbackHabits = StateManager.getHabits();
                      const restored = HabitService.restoreHabit(
                        rollbackHabits,
                        id,
                      );
                      StateManager.save(restored);
                      this.mainController.refreshUI();
                    } finally {
                      GlobalLoaderService.hide();
                    }
                  }, 30);
                },
              });
            } finally {
              GlobalLoaderService.hide();
            }
          }, 30);
        }
        return;
      }

      const restoreBtn = target.closest(".restore-btn");
      if (restoreBtn) {
        const id = restoreBtn.dataset.id;
        const currentHabits = StateManager.getHabits();
        const targetHabit = currentHabits.find((h) => h.id === id);

        setTimeout(() => {
          StateController.execute();
          StateManager.init();
          HabitController.refreshUI();
          SettingsController.runAutoArchivePipeline();
        }, 200);

        if (targetHabit) {
          GlobalLoaderService.show(
            `Restoring "${targetHabit.name}" to workspace...`,
          );

          setTimeout(() => {
            try {
              const updated = HabitService.restoreHabit(currentHabits, id);
              StateManager.save(updated);

              StateController.execute();
              StateManager.init();
              SettingsController.runAutoArchivePipeline();

              this.mainController.refreshUI();

              NotificationService.show({
                type: "info",
                message: `Restored: "${targetHabit.name}"`,
                duration: 5000,
                undoAction: () => {
                  GlobalLoaderService.show("Re-archiving record...");
                  setTimeout(() => {
                    try {
                      const rollbackHabits = StateManager.getHabits();
                      const archived = HabitService.archiveHabit(
                        rollbackHabits,
                        id,
                      );
                      StateManager.save(archived);
                      this.mainController.refreshUI();
                    } finally {
                      GlobalLoaderService.hide();
                    }
                  }, 30);
                },
              });
            } finally {
              GlobalLoaderService.hide();
            }
          }, 30);
        }
        return;
      }
    });
  },
};
