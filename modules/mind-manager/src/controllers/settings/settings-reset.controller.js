import { StateManager, state } from "@/models/state.model.js";

import { CoreStore } from "@life-orchestrator/core-store";
import { GlobalLoaderService } from "@/services/loader.service";
import { MIND_NAMESPACE } from "@/models/storage.model.js";
import { MindController } from "../mind.controller.js";
import { NotificationService } from "@/services/notification.service.js";
import { renderMindList } from "@/views/mind/mind-list.renderer.js";

export const SettingsResetController = {
  keydownHandler: null,

  init() {
    this.initResetModalEvents();
  },

  resetSession() {
    StateManager.init();
    MindController.refreshUI();
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
    const previousPayload = CoreStore.getNamespace(MIND_NAMESPACE);
    const previousTags = StateManager.getTags().map((tag) => ({ ...tag }));
    const previousNotes = StateManager.getNotes().map((note) => ({ ...note }));
    const previousSnippets = StateManager.getSnippets().map((snippet) => ({
      ...snippet,
    }));
    const previousBookmarks = StateManager.getBookmarks().map((bookmark) => ({
      ...bookmark,
    }));
    const previousCheatSheets = StateManager.getCheatSheets().map(
      (cheatsheet) => ({
        ...cheatsheet,
      }),
    );

    this.closeResetModal();

    GlobalLoaderService.show("Purging storage layers & resetting workspace...");

    setTimeout(() => {
      try {
        CoreStore.clearNamespace(MIND_NAMESPACE);

        state.tags = [];
        state.notes = [];
        state.snippets = [];
        state.bookmarks = [];
        state.cheatsheets = [];
        state.activeTab = "notes";
        state.currentView = "mind";

        renderMindList([], state.activeTab);

        MindController.handleTabSwitch("notes");

        MindController.refreshUI();

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
                  CoreStore.setNamespace(MIND_NAMESPACE, previousPayload);
                } else {
                  CoreStore.clearNamespace(MIND_NAMESPACE);
                }

                StateManager.save({
                  tags: previousTags || [],
                  notes: previousNotes || [],
                  snippets: previousSnippets || [],
                  bookmarks: previousBookmarks || [],
                  cheatsheets: previousCheatSheets || [],
                });

                state.tags = previousTags || [];
                state.notes = previousNotes || [];
                state.snippets = previousSnippets || [];
                state.bookmarks = previousBookmarks || [];
                state.cheatsheets = previousCheatSheets || [];

                state.activeTab = "notes";
                state.currentView = "mind";

                renderMindList(
                  StateManager.getFilteredDataForActiveTab(),
                  state.activeTab,
                );

                MindController.handleTabSwitch("notes");

                MindController.refreshUI();
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
