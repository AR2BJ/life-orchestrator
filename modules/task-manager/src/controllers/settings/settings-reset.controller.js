import { StateManager, state } from "@/models/state.model.js";

import { CoreStore } from "@life-orchestrator/core-store";
import { GlobalLoaderService } from "@/services/loader.service";
import { NotificationService } from "@/services/notification.service.js";
import { SettingsArchiveController } from "./settings-archive.controller.js";
import { SettingsTagController } from "./settings-tag.controller.js";
import { TASK_NAMESPACE } from "@/models/storage.model.js";
import { TaskController } from "../task.controller.js";
import { renderTaskList } from "@/views/tasks/task-list.renderer.js";

export const SettingsResetController = {
  keydownHandler: null,

  init() {
    this.initResetModalEvents();
  },

  resetSession() {
    StateManager.init();
    TaskController.refreshUI();
    SettingsTagController.renderTagsList();
  },

  closeResetModal() {
    const resetModal = document.getElementById("settings-reset-modal");
    if (!resetModal) return;

    resetModal.classList.add("hidden");
    resetModal.classList.remove("flex");

    document.body.classList.remove("overflow-hidden");
  },

  initResetModalEvents() {
    const triggerResetBtn = document.getElementById("trigger-reset-btn");
    const resetModal = document.getElementById("settings-reset-modal");
    const cancelResetBtn = document.getElementById("cancel-settings-reset");
    const confirmResetBtn = document.getElementById("confirm-settings-reset");

    triggerResetBtn?.addEventListener("click", () => {
      resetModal?.classList.replace("hidden", "flex");
      document.body.classList.add("overflow-hidden");
    });
    cancelResetBtn?.addEventListener("click", () => this.closeResetModal());

    confirmResetBtn?.addEventListener("click", () => {
      this.closeResetModal();
      this.executeApplicationReset();
    });

    // Keydown handler for reset modal
    if (this.keydownHandler) {
      document.removeEventListener("keydown", this.keydownHandler);
    }

    this.keydownHandler = (e) => {
      const resetModal = document.getElementById("settings-reset-modal");
      const resetOpen = resetModal && !resetModal.classList.contains("hidden");

      if (!resetOpen) return;

      if (e.key === "Escape" || e.key === "Enter") {
        e.preventDefault();
        e.stopPropagation();
      }

      if (e.key === "Escape") this.closeResetModal();
      if (e.ctrlKey && e.key === "Enter")
        document.getElementById("confirm-settings-reset")?.click();
    };

    document.addEventListener("keydown", this.keydownHandler);
  },

  executeApplicationReset() {
    const previousPayload = CoreStore.getNamespace(TASK_NAMESPACE);
    const previousTasks = StateManager.getTasks().map((task) => ({ ...task }));
    const previousTags = StateManager.getTags().map((tag) => ({ ...tag }));

    this.closeResetModal();

    GlobalLoaderService.show("Purging storage layers & resetting workspace...");

    setTimeout(() => {
      try {
        CoreStore.clearNamespace(TASK_NAMESPACE);

        state.tasks = [];
        state.tags = [];
        state.activeTab = "active";
        state.currentView = "tasks";

        renderTaskList([], state.activeTab);

        TaskController.refreshUI();

        SettingsTagController.renderTagsList();

        NotificationService.show({
          type: "error",
          message:
            "Application synchronization storage has been completely cleared",
          duration: 5000,
          undoAction: () => {
            GlobalLoaderService.show(
              "Re-instating application database state...",
            );
            setTimeout(() => {
              try {
                if (previousPayload) {
                  CoreStore.setNamespace(TASK_NAMESPACE, previousPayload);
                } else {
                  CoreStore.clearNamespace(TASK_NAMESPACE);
                }

                StateManager.save(previousTasks || [], previousTags || []);
                state.tasks = previousTasks || [];
                state.tags = previousTags || [];

                state.activeTab = "active";
                state.currentView = "tasks";

                renderTaskList(
                  StateManager.getFilteredTasks(),
                  state.activeTab,
                );
                TaskController.refreshUI();
                SettingsTagController.renderTagsList();
              } finally {
                GlobalLoaderService.hide();
              }
            }, 30);
          },
        });
      } finally {
        GlobalLoaderService.hide();
      }
    }, 50);
  },
};
