import { StateManager, state } from "@/models/state.model.js";

import { CoreStore } from "@life-orchestrator/core-store";
import { GlobalLoaderService } from "@/services/loader.service";
import { NotificationService } from "@/services/notification.service.js";
import { PLAN_NAMESPACE } from "@/models/storage.model.js";
import { PlannerController } from "../planner.controller.js";
import { SettingsController } from "../settings.controller.js";
import { renderPlannerList } from "@/views/planner/planner-list.renderer.js";

export const SettingsResetController = {
  keydownHandler: null,

  init() {
    this.initResetModalEvents();
  },

  resetSession() {
    StateManager.init();
    PlannerController.refreshUI();
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
    const previousPayload = CoreStore.getNamespace(PLAN_NAMESPACE);
    const previousCurrency = localStorage.getItem("preferred_currency");
    const previousPlans = StateManager.getPlans().map((plan) => ({ ...plan }));
    const previousLogs = StateManager.getLogs().map((log) => ({
      ...log,
    }));
    const previousTemplates = StateManager.getTemplates().map((temp) => ({
      ...temp,
    }));

    this.closeResetModal();

    GlobalLoaderService.show("Purging storage layers & resetting workspace...");

    setTimeout(() => {
      try {
        CoreStore.clearNamespace(PLAN_NAMESPACE);
        localStorage.removeItem("preferred_currency");

        state.plans = [];
        state.logs = [];
        state.templates = [];
        state.activeTab = "plans";
        state.currentView = "planner";

        renderPlannerList([], state.activeTab);

        PlannerController.handleTabSwitch("plans");

        PlannerController.refreshUI();

        SettingsController.bindCurrencyEvents();

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
                  CoreStore.setNamespace(PLAN_NAMESPACE, previousPayload);
                } else {
                  CoreStore.clearNamespace(PLAN_NAMESPACE);
                }

                if (previousCurrency) {
                  localStorage.setItem("preferred_currency", previousCurrency);
                } else {
                  localStorage.removeItem("preferred_currency");
                }

                StateManager.save({
                  plans: previousPlans || [],
                  logs: previousLogs || [],
                  templates: previousTemplates || [],
                });

                state.plans = previousPlans || [];
                state.logs = previousLogs || [];
                state.templates = previousTemplates || [];

                state.activeTab = "plans";
                state.currentView = "planner";

                PlannerController.handleTabSwitch("plans");

                renderPlannerList(
                  StateManager.getFilteredDataForActiveTab(),
                  state.activeTab,
                );

                PlannerController.refreshUI();

                SettingsController.bindCurrencyEvents();
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
