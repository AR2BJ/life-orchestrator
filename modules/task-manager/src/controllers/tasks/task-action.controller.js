import {
  setPendingDeleteId,
  setPendingEditId,
} from "./task-form.controller.js";

import { GlobalLoaderService } from "@/services/loader.service.js";
import { NotificationService } from "@/services/notification.service.js";
import { SettingsArchiveController } from "../settings/settings-archive.controller.js";
import { SettingsController } from "../settings.controller.js";
import { StateManager } from "@/models/state.model.js";
import { TaskService } from "@/services/task.service.js";
import { openSubtasksState } from "@/utils/helpers.js";

export const TaskActionController = {
  init(mainController) {
    this.mainController = mainController;
    this.bindDynamicEvents();
  },

  bindDynamicEvents() {
    const listContainer = document.getElementById("task-list");
    if (!listContainer) return;

    listContainer.addEventListener("click", (e) => {
      const target = e.target;

      const toggleBtn = target.closest(".toggle-btn");
      if (toggleBtn) {
        const id = toggleBtn.dataset.id;
        const currentTasks = StateManager.getTasks();
        const task = currentTasks.find((t) => t.id === id);

        if (task) {
          GlobalLoaderService.show(`Updating state for "${task.title}"...`);

          setTimeout(() => {
            try {
              const updated = TaskService.toggleTask(currentTasks, id);
              StateManager.save(updated);
              this.mainController.refreshUI();

              const updatedTask = updated.find((t) => t.id === id);
              const isNowCompleted = updatedTask?.status === "done";

              NotificationService.show({
                type: isNowCompleted ? "success" : "info",
                message: isNowCompleted
                  ? `Task completed: "${task.title}" ✨`
                  : `Reopened task: "${task.title}".`,
                icon: isNowCompleted ? "fa-circle-check" : "fa-circle",
                iconColor: isNowCompleted
                  ? "text-emerald-500/80"
                  : "text-brand/80",
                duration: 5000,
              });
            } catch (error) {
              NotificationService.show({
                type: "error",
                message: error.message || "Failed to update task.",
              });
            } finally {
              GlobalLoaderService.hide();
            }
          }, 30);
        }
        return;
      }

      const statusBtn = target.closest(".status-change-btn");
      if (statusBtn) {
        const id = statusBtn.dataset.id;
        const newStatus = statusBtn.dataset.status;
        const currentTasks = StateManager.getTasks();
        const task = currentTasks.find((t) => t.id === id);

        if (task) {
          try {
            const updated = TaskService.updateTaskStatus(
              currentTasks,
              id,
              newStatus,
            );
            StateManager.save(updated);
            this.mainController.refreshUI();

            NotificationService.show({
              type: "success",
              message: `Status updated to "${newStatus.replace("_", " ")}"`,
              duration: 5000,
            });
          } catch (error) {
            NotificationService.show({
              type: "error",
              message: error.message,
            });
          }
        }
        return;
      }

      const subtaskBtn = target.closest(".subtask-toggle");
      if (subtaskBtn) {
        const taskId = subtaskBtn.dataset.taskId;
        const subtaskId = subtaskBtn.dataset.subtaskId;
        const currentTasks = StateManager.getTasks();

        try {
          const updated = TaskService.toggleSubtask(
            currentTasks,
            taskId,
            subtaskId,
          );

          const updatedTask = updated.find((t) => t.id === taskId);

          if (updatedTask && updatedTask.status === "done") {
            openSubtasksState.delete(taskId);
          }

          StateManager.save(updated);
          this.mainController.refreshUI();
        } catch (error) {
          console.error("Failed to toggle subtask:", error);
        }
        return;
      }

      const subtaskDeleteBtn = target.closest(".subtask-delete-btn");
      if (subtaskDeleteBtn) {
        const taskId = subtaskDeleteBtn.dataset.taskId;
        const subtaskId = subtaskDeleteBtn.dataset.subtaskId;
        const currentTasks = StateManager.getTasks();

        try {
          const updated = TaskService.deleteSubtask(
            currentTasks,
            taskId,
            subtaskId,
          );
          StateManager.save(updated);
          this.mainController.refreshUI();
        } catch (error) {
          console.error("Failed to delete subtask:", error);
        }
        return;
      }

      const editBtn = target.closest(".edit-btn");
      if (editBtn) {
        const id = editBtn.dataset.id;
        setPendingEditId(id);

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
        const currentTasks = StateManager.getTasks();
        const targetTask = currentTasks.find((t) => t.id === id);

        if (targetTask) {
          GlobalLoaderService.show(`Archiving "${targetTask.title}"...`);

          setTimeout(() => {
            try {
              const updated = TaskService.archiveTask(currentTasks, id);
              StateManager.save(updated);
              this.mainController.refreshUI();

              NotificationService.show({
                type: "info",
                message: `Archived: "${targetTask.title}"`,
                duration: 5000,
                undoAction: () => {
                  GlobalLoaderService.show("Rolling back archive operation...");
                  setTimeout(() => {
                    try {
                      const rollbackTasks = StateManager.getTasks();
                      const restored = TaskService.restoreTask(
                        rollbackTasks,
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
        const currentTasks = StateManager.getTasks();
        const targetTask = currentTasks.find((t) => t.id === id);

        if (targetTask) {
          GlobalLoaderService.show(`Restoring "${targetTask.title}"...`);

          setTimeout(() => {
            try {
              const updated = TaskService.restoreTask(currentTasks, id);
              StateManager.save(updated);

              StateManager.init();
              if (SettingsArchiveController.runAutoArchivePipeline) {
                SettingsArchiveController.runAutoArchivePipeline();
              }

              this.mainController.refreshUI();

              NotificationService.show({
                type: "info",
                message: `Restored: "${targetTask.title}"`,
                duration: 5000,
                undoAction: () => {
                  GlobalLoaderService.show("Re-archiving task...");
                  setTimeout(() => {
                    try {
                      const rollbackTasks = StateManager.getTasks();
                      const archived = TaskService.archiveTask(
                        rollbackTasks,
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
