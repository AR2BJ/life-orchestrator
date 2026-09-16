import {
  ENERGY_LEVEL_OPTIONS,
  MOOD_OPTIONS,
} from "@/utils/constants/options-value.constants.js";
import {
  formatNumberWithCommas,
  mapTemplateToObjectives,
  openObjectivesState,
  todayISO,
} from "@/utils/helpers.js";
import {
  setPendingDeleteId,
  setPendingEditId,
} from "./planner-form.controller.js";

import { NotificationService } from "@/services/notification.service.js";
import { PlanAutoLogService } from "@/services/plan-auto-log.service.js";
import { PlannerItemComponent } from "@/components/features/planner/planner-item.component.js";
import { PlannerService } from "@/services/planner.service.js";
import { StateManager } from "@/models/state.model.js";

export const PlannerActionController = {
  init(mainController) {
    this.mainController = mainController;
    this.bindDynamicEvents();
  },

  // --- HELPER FOR IN-CARD INPUT VALIDATION ---
  sanitizeObjectiveProgressValue(
    inputValue,
    targetValue = 1,
    enforceMinimum = false,
    isCurrency = false,
  ) {
    const MIN_VALUE = 0;
    const MAX_VALUE =
      Number(targetValue) > 0 ? Number(targetValue) : 999999999999;
    const MAX_LENGTH = isCurrency ? 12 : 7;

    let val = String(inputValue || "").replace(/[^0-9.]/g, "");

    const parts = val.split(".");
    if (parts.length > 2) val = `${parts[0]}.${parts.slice(1).join("")}`;

    if (val.length > MAX_LENGTH) val = val.slice(0, MAX_LENGTH);

    if (Number(val) > MAX_VALUE) val = String(MAX_VALUE);

    if (enforceMinimum) {
      const numVal = Number(val);
      if (isNaN(numVal) || numVal < MIN_VALUE) {
        val = String(MIN_VALUE);
      }
    }
    return val;
  },

  handleToggleObjective(planId, objectiveId) {
    const plans = StateManager.getPlans() || [];
    const targetPlan = plans.find((p) => String(p.id) === String(planId));
    if (!targetPlan) return;

    const updatedPlans = PlannerService.toggleObjective(
      plans,
      planId,
      objectiveId,
    );

    const updatedTargetPlan = updatedPlans.find(
      (p) => String(p.id) === String(planId),
    );
    this.checkAndAutoUpdatePlanState(updatedTargetPlan, updatedPlans);

    this.mainController.refreshUI();

    NotificationService.show({
      type: "info",
      message: `Objective updated for "${targetPlan.title}"`,
      icon: "fa-list-check",
      duration: 5000,
    });
  },

  handleObjectiveProgressChange(planId, objectiveId, newValue) {
    const plans = StateManager.getPlans() || [];
    const targetPlan = plans.find((p) => String(p.id) === String(planId));
    if (!targetPlan) return;

    const updatedPlans = PlannerService.updateObjectiveProgress(
      plans,
      planId,
      objectiveId,
      newValue,
    );

    const updatedTargetPlan = updatedPlans.find(
      (p) => String(p.id) === String(planId),
    );
    this.checkAndAutoUpdatePlanState(updatedTargetPlan, updatedPlans);

    this.mainController.refreshUI();
  },

  handleToggleTemplateFavorite(templateId) {
    const templates = StateManager.getTemplates() || [];
    const targetTemplate = templates.find(
      (t) => String(t.id) === String(templateId),
    );
    if (!targetTemplate) return;

    const updatedTemplates = PlannerService.editTemplate(
      templates,
      templateId,
      {
        isFavorite: !targetTemplate.isFavorite,
      },
    );

    StateManager.save({ templates: updatedTemplates });
    this.mainController.refreshUI();

    NotificationService.show({
      type: "info",
      message: !targetTemplate.isFavorite
        ? `Marked "${targetTemplate.title}" as favorite`
        : `Removed "${targetTemplate.title}" from favorites`,
      icon: "fa-star",
      duration: 5000,
    });
  },

  checkAndAutoUpdatePlanState(targetPlan, updatedPlans) {
    const objectives = targetPlan.objectives || [];
    if (objectives.length === 0) return;

    const totalObj = objectives.length;
    const completedObj = objectives.filter(
      (obj) =>
        obj.completed ||
        PlannerItemComponent._calculateObjectiveProgress?.(obj) === 100,
    ).length;

    const isAllCompleted = completedObj === totalObj;

    if (isAllCompleted && targetPlan.state !== "completed") {
      targetPlan.pendingCompletionPrompt = true;
    } else if (!isAllCompleted) {
      targetPlan.pendingCompletionPrompt = false;
      if (targetPlan.state === "completed") {
        targetPlan.state = "active";
        NotificationService.show({
          type: "info",
          message: `Plan status reverted to Active`,
          icon: "fa-arrow-rotate-left",
          duration: 5000,
        });
      }
    }

    StateManager.save({ plans: updatedPlans });

    PlanAutoLogService.createAutoLogForPlan(updatedPlans);
  },

  handleConfirmCompletion(planId) {
    const plans = StateManager.getPlans() || [];
    const targetPlan = plans.find((p) => String(p.id) === String(planId));
    if (!targetPlan) return;

    targetPlan.state = "completed";
    targetPlan.pendingCompletionPrompt = false;

    StateManager.save({ plans });

    const createdLog = PlanAutoLogService.createAutoLogForPlan(targetPlan);

    this.mainController.refreshUI();

    NotificationService.show({
      type: "success",
      message: createdLog
        ? `Plan "${targetPlan.title}" completed & auto-logged!`
        : `Plan "${targetPlan.title}" marked as COMPLETED!`,
      icon: "fa-circle-check",
      duration: 5000,
    });
  },

  handleDeclineCompletion(planId) {
    const plans = StateManager.getPlans() || [];
    const targetPlan = plans.find((p) => String(p.id) === String(planId));
    if (!targetPlan) return;

    targetPlan.pendingCompletionPrompt = false;

    StateManager.save({ plans });
    this.mainController.refreshUI();

    NotificationService.show({
      type: "info",
      message: `Plan status left unchanged.`,
      icon: "fa-info-circle",
      duration: 5000,
    });
  },

  cyclePlanState(planId) {
    const plans = StateManager.getPlans() || [];
    const targetPlan = plans.find((p) => String(p.id) === String(planId));
    if (!targetPlan) return;

    const stateOrder = ["active", "paused", "completed"];
    const currentIndex = stateOrder.indexOf(targetPlan.state || "active");
    const nextState = stateOrder[(currentIndex + 1) % stateOrder.length];

    targetPlan.state = nextState;
    targetPlan.pendingCompletionPrompt = false;

    if (nextState === "completed" && Array.isArray(targetPlan.objectives)) {
      targetPlan.objectives.forEach((obj) => {
        obj.completed = true;
        if (obj.type === "numeric" && obj.targetValue !== undefined) {
          obj.currentValue = obj.targetValue;
        }
      });

      PlanAutoLogService.createAutoLogForPlan(targetPlan);
    }

    StateManager.save({ plans });
    this.mainController.refreshUI();

    NotificationService.show({
      type: "info",
      message: `Plan status changed to "${nextState.toUpperCase()}"${
        nextState === "completed"
          ? " and all objectives marked as completed!"
          : ""
      }`,
      icon: "fa-arrows-rotate",
      duration: 5000,
    });
  },

  cycleLogMood(logId) {
    const logs = StateManager.getLogs() || [];
    const targetLog = logs.find((l) => String(l.id) === String(logId));
    if (!targetLog) return;

    const moodValues = MOOD_OPTIONS.map((m) => m.value);
    const currentIndex = moodValues.indexOf(targetLog.mood || "neutral");
    const nextMood = moodValues[(currentIndex + 1) % moodValues.length];

    targetLog.mood = nextMood;

    StateManager.save({ logs });
    this.mainController.refreshUI();

    NotificationService.show({
      type: "info",
      message: `Mood updated to "${nextMood.toUpperCase()}"`,
      icon: "fa-face-smile",
      duration: 5000,
    });
  },

  cycleLogEnergy(logId) {
    const logs = StateManager.getLogs() || [];
    const targetLog = logs.find((l) => String(l.id) === String(logId));
    if (!targetLog) return;

    const energyValues = ENERGY_LEVEL_OPTIONS.map((e) => Number(e.value));
    const currentIndex = energyValues.indexOf(Number(targetLog.energy) || 3);
    const nextEnergy = energyValues[(currentIndex + 1) % energyValues.length];

    targetLog.energy = nextEnergy;

    StateManager.save({ logs });
    this.mainController.refreshUI();

    NotificationService.show({
      type: "info",
      message: `Energy updated to ${nextEnergy}/5`,
      icon: "fa-bolt",
      duration: 5000,
    });
  },

  bindDynamicEvents() {
    const listContainer = document.getElementById("planner-list");
    if (!listContainer) return;

    // 1. REAL-TIME INPUT EVENT
    listContainer.addEventListener("input", (e) => {
      const target = e.target;
      if (!target.classList.contains("objective-progress-input")) return;

      const targetVal = target.dataset.target || 999999999999;
      const isCurrency = target.getAttribute("data-is-currency") === "true";

      const selectionStart = target.selectionStart;
      const oldLength = target.value.length;

      const sanitized = this.sanitizeObjectiveProgressValue(
        target.value,
        targetVal,
        false,
        isCurrency,
      );

      if (isCurrency && sanitized !== "") {
        const formatted = formatNumberWithCommas(sanitized);
        target.value = formatted;

        const newLength = formatted.length;
        const cursorPosition = selectionStart + (newLength - oldLength);
        target.setSelectionRange(cursorPosition, cursorPosition);
      } else {
        target.value = sanitized;
      }
    });

    // 2. CHANGE EVENT
    listContainer.addEventListener("change", (e) => {
      const target = e.target;
      if (!target.classList.contains("objective-progress-input")) return;

      const planId = target.dataset.planId;
      const objectiveId = target.dataset.objectiveId;
      const targetVal = target.dataset.target || 999999999999;
      const isCurrency = target.getAttribute("data-is-currency") === "true";

      const sanitizedVal = this.sanitizeObjectiveProgressValue(
        target.value,
        targetVal,
        true,
        isCurrency,
      );

      const rawNumericValue = Number(sanitizedVal.replace(/,/g, "")) || 0;

      if (planId && objectiveId) {
        openObjectivesState.expandedPlanIds.add(planId);
        this.handleObjectiveProgressChange(
          planId,
          objectiveId,
          rawNumericValue,
        );
      }
    });

    // 3. CLICK EVENTS
    listContainer.addEventListener("click", (e) => {
      const target = e.target;
      const activeTab = StateManager.getActiveTab() || "plans";

      // IN-CARD MODAL ACTIONS (YES / NO)
      const confirmBtn = target.closest(
        '[data-action="confirm-plan-completion"]',
      );
      if (confirmBtn) {
        e.stopPropagation();
        const planId = confirmBtn.dataset.planId;
        if (planId) this.handleConfirmCompletion(planId);
        return;
      }

      const declineBtn = target.closest(
        '[data-action="decline-plan-completion"]',
      );
      if (declineBtn) {
        e.stopPropagation();
        const planId = declineBtn.dataset.planId;
        if (planId) this.handleDeclineCompletion(planId);
        return;
      }

      // TOGGLE OBJECTIVES ACCORDION
      const toggleObjectivesBtn = target.closest(".toggle-objectives-btn");
      if (toggleObjectivesBtn) {
        e.stopPropagation();
        const planId = toggleObjectivesBtn.dataset.planId;
        if (!planId) return;

        const container = document.getElementById(
          `objectives-container-${planId}`,
        );
        const chevron = toggleObjectivesBtn.querySelector(".objective-chevron");

        if (openObjectivesState.expandedPlanIds.has(planId)) {
          openObjectivesState.expandedPlanIds.delete(planId);
          if (container) container.classList.add("hidden");
          if (chevron) chevron.classList.remove("rotate-180");
        } else {
          openObjectivesState.expandedPlanIds.add(planId);
          if (container) container.classList.remove("hidden");
          if (chevron) chevron.classList.add("rotate-180");
        }
        return;
      }

      // TOGGLE LOG METRICS DROPDOWN
      const toggleMetricsBtn = target.closest(".toggle-metrics-btn");
      if (toggleMetricsBtn) {
        e.stopPropagation();
        const logId = toggleMetricsBtn.dataset.logId;
        if (!logId) return;

        const container = document.getElementById(`metrics-dropdown-${logId}`);
        const icon = toggleMetricsBtn.querySelector(".fa-chevron-down");
        const label = toggleMetricsBtn.querySelector(".btn-label");

        if (container) {
          const isHidden = container.classList.contains("hidden");

          if (isHidden) {
            container.classList.replace("hidden", "grid");
          } else {
            container.classList.replace("grid", "hidden");
          }

          if (icon) {
            icon.classList.toggle("rotate-180", !isHidden);
          }

          if (label) {
            const hiddenCount = container.children.length;
            label.textContent = isHidden
              ? `Show ${hiddenCount} more metrics...`
              : "Collapse metrics";
          }
        }
        return;
      }

      // TOGGLE INDIVIDUAL OBJECTIVE
      const objectiveToggle = target.closest(".objective-toggle");
      if (objectiveToggle) {
        e.stopPropagation();
        const planId = objectiveToggle.dataset.planId;
        const objectiveId = objectiveToggle.dataset.objectiveId;

        if (planId && objectiveId) {
          openObjectivesState.expandedPlanIds.add(planId);
          this.handleToggleObjective(planId, objectiveId);
        }
        return;
      }

      // CYCLE PLAN STATE BUTTON
      const stateCycleBtn = target.closest(".state-cycle-btn");
      if (stateCycleBtn) {
        e.stopPropagation();
        const planId = stateCycleBtn.dataset.planId;
        if (planId) {
          this.cyclePlanState(planId);
        }
        return;
      }

      // CYCLE MOOD BUTTON
      const moodCycleBtn = target.closest(".mood-cycle-btn");
      if (moodCycleBtn) {
        e.stopPropagation();
        const logId = moodCycleBtn.dataset.logId;
        if (logId) {
          this.cycleLogMood(logId);
        }
        return;
      }

      // CYCLE ENERGY BUTTON
      const energyCycleBtn = target.closest(".energy-cycle-btn");
      if (energyCycleBtn) {
        e.stopPropagation();
        const logId = energyCycleBtn.dataset.logId;
        if (logId) {
          this.cycleLogEnergy(logId);
        }
        return;
      }

      // TOGGLE TEMPLATE USE BUTTON HANDLER
      const useTemplateBtn = target.closest(".use-template-btn");
      if (useTemplateBtn) {
        e.stopPropagation();
        const templateId = useTemplateBtn.dataset.id;
        if (!templateId) return;

        const templates = StateManager.getTemplates() || [];
        const targetTemplate = templates.find(
          (t) => String(t.id) === String(templateId),
        );
        if (!targetTemplate) return;

        // 1. Update usage count
        targetTemplate.usageCount = (targetTemplate.usageCount || 0) + 1;
        StateManager.save({ templates });

        // 2. Generate objectives schema-compliant
        const generatedObjectives = mapTemplateToObjectives(targetTemplate);

        // 3. Create Plan with normalized objectives structure
        const plans = StateManager.getPlans() || [];
        const newPlan = PlannerService.createPlan(plans, {
          title: targetTemplate.title,
          description: targetTemplate.description,
          lifeAreaId: targetTemplate.lifeAreaId || "productivity",
          state: "active",
          period: { startDate: todayISO(), endDate: null },
          objectives: generatedObjectives,
        });

        StateManager.save({ plans: newPlan });

        // 4. Switch UI State
        StateManager.setTab("plans");
        this.mainController.refreshUI();

        NotificationService.show({
          type: "success",
          message: `Plan created from "${targetTemplate.title}" with ${generatedObjectives.length} objectives`,
          icon: "fa-rocket",
          duration: 4000,
        });
        return;
      }

      // TOGGLE TEMPLATE FAVORITE
      const favoriteBtn = target.closest(".favorite-btn");
      if (favoriteBtn) {
        e.stopPropagation();
        const id = favoriteBtn.dataset.id;
        if (id) {
          this.handleToggleTemplateFavorite(id);
        }
        return;
      }

      // EDIT MODAL TRIGGER
      const editBtn = target.closest(".edit-btn");
      if (editBtn) {
        if (
          editBtn.dataset.action === "edit-objective" ||
          editBtn.dataset.action === "edit-metric"
        ) {
          return;
        }

        e.stopPropagation();
        const id = editBtn.dataset.id;
        if (!id) return;

        setPendingEditId(id);
        this.mainController.toggleModal("edit-modal", true);
        return;
      }

      // DELETE MODAL TRIGGER
      const deleteBtn = target.closest(".delete-btn");
      if (deleteBtn) {
        if (
          deleteBtn.dataset.action === "delete-objective" ||
          deleteBtn.dataset.action === "delete-metric"
        ) {
          return;
        }

        e.stopPropagation();
        const id = deleteBtn.dataset.id;
        if (!id) return;

        setPendingDeleteId(id);
        this.mainController.toggleModal("delete-modal", true);
        return;
      }

      // DIRECT DELETE ITEM HANDLER
      const directDeleteBtn = target.closest(".direct-delete-btn");
      if (directDeleteBtn) {
        e.stopPropagation();
        const id = directDeleteBtn.dataset.id;
        if (!id) return;

        const currentState = StateManager.getState();

        if (activeTab === "plans") {
          const plans = PlannerService.deletePlan(currentState.plans || [], id);
          StateManager.save({ plans });
        } else if (activeTab === "logs") {
          const logs = PlannerService.deleteLog(currentState.logs || [], id);
          StateManager.save({ logs });
        } else if (activeTab === "templates") {
          const templates = PlannerService.deleteTemplate(
            currentState.templates || [],
            id,
          );
          StateManager.save({ templates });
        }

        this.mainController.refreshUI();

        NotificationService.show({
          type: "info",
          message: "Item deleted successfully",
          icon: "fa-trash-can",
          duration: 5000,
        });
      }
    });
  },
};
