import {
  ENERGY_LEVEL_OPTIONS,
  LIFE_AREAS,
  MOOD_OPTIONS,
  OBJECTIVE_TYPES,
  OBJECTIVE_UNITS,
  PLAN_STATES,
} from "@/utils/constants/options-value.constants.js";
import {
  formatNumberWithCommas,
  generateId,
  parseFormattedNumber,
  todayISO,
} from "@/utils/helpers.js";

import { AutocompleteComponent } from "@/components/ui/autocomplete.component.js";
import { DatePickerComponent } from "@/components/ui/date-picker.component.js";
import { EditModalsComponent } from "@/components/modals/edit-modals.component.js";
import { GlobalLoaderService } from "@/services/loader.service.js";
import { NotificationService } from "@/services/notification.service.js";
import { PlannerService } from "@/services/planner.service.js";
import { StateManager } from "@/models/state.model.js";

let pendingDeleteId = null;
let pendingEditId = null;
let editingObjectiveId = null;
let editingMetricKey = null;

let activeModalObjectives = [];
let activeModalMetrics = {};

let createPlanLifeAreaAutocomplete = null;
let createPlanStateAutocomplete = null;
let createPlanStartDatePicker = null;
let createPlanEndDatePicker = null;

let createLogDatePicker = null;
let createLogEnergyAutocomplete = null;
let createLogMoodAutocomplete = null;
let createLogPlanLinkAutocomplete = null;

let createTemplateLifeAreaAutocomplete = null;

let editPlanLifeAreaAutocomplete = null;
let editPlanStateAutocomplete = null;
let editPlanStartDatePicker = null;
let editPlanEndDatePicker = null;

let editLogDatePicker = null;
let editLogEnergyAutocomplete = null;
let editLogMoodAutocomplete = null;
let editLogPlanLinkAutocomplete = null;

let editTemplateLifeAreaAutocomplete = null;

let editObjectiveTypeAutocomplete = null;
let editObjectiveUnitAutocomplete = null;
let editMetricUnitAutocomplete = null;

export function setPendingDeleteId(id) {
  pendingDeleteId = id;
}

export function setPendingEditId(id) {
  pendingEditId = id;
  if (id) {
    PlannerFormController.populateEditModal(id);
  }
}

export const PlannerFormController = {
  init(mainController) {
    this.mainController = mainController;

    this.setupCreateAutocompletes();
    this.bindFormEvents();
    this.bindAccordionEvents();
    this.bindObjectiveEvents();
    this.bindMetricEvents();
  },

  refreshUI() {
    this.setupCreateAutocompletes();
    this.updateAddButtonText();
    this.toggleFormTabFields();
  },

  updateAddButtonText() {
    const activeTab = StateManager.getActiveTab() || "plans";
    const btnTextSpan = document.getElementById("add-plan-btn-text");
    const toggleTitleSpan = document.getElementById("form-toggle-title");

    if (!btnTextSpan) return;

    if (activeTab === "plans") {
      btnTextSpan.textContent = "Add Plan";
      if (toggleTitleSpan) toggleTitleSpan.textContent = "Create New Plan";
    } else if (activeTab === "logs") {
      btnTextSpan.textContent = "Add Log";
      if (toggleTitleSpan) toggleTitleSpan.textContent = "Create New Log";
    } else if (activeTab === "templates") {
      btnTextSpan.textContent = "Add Template";
      if (toggleTitleSpan) toggleTitleSpan.textContent = "Create New Template";
    }
  },

  updateInputStyleByUnit(inputElement, unit, type = "objective") {
    if (!inputElement) return;

    const isCurrency = unit === "currency";

    if (type === "objective") {
      inputElement.maxLength = isCurrency ? 15 : 7;
      if (isCurrency) {
        inputElement.classList.remove("w-20");
        inputElement.classList.add("w-35");
      } else {
        inputElement.classList.remove("w-35");
        inputElement.classList.add("w-20");
      }
    } else if (type === "metric") {
      inputElement.maxLength = isCurrency ? 15 : 7;
      if (isCurrency) {
        inputElement.classList.remove("w-20");
        inputElement.classList.add("w-35");
      } else {
        inputElement.classList.remove("w-35");
        inputElement.classList.add("w-20");
      }
    }
  },

  toggleFormTabFields() {
    const activeTab = StateManager.getActiveTab() || "plans";
    const tabFields = document.querySelectorAll(".plan-tab-fields");

    tabFields.forEach((fieldGroup) => {
      const fieldTabsAttr = fieldGroup.getAttribute("data-tab-fields") || "";
      const allowedTabs = fieldTabsAttr.split(",").map((t) => t.trim());

      if (allowedTabs.includes(activeTab)) {
        fieldGroup.classList.replace("hidden", "flex");
      } else {
        fieldGroup.classList.replace("flex", "hidden");
      }
    });

    this.updateAddButtonText();
  },

  toggleObjectiveNumericInputs(selectedType) {
    const container = document.getElementById("objective-numeric-field");
    const isNumeric = selectedType === "numeric";

    if (container) {
      container.classList.toggle("hidden", !isNumeric);
    }
  },

  bindAccordionEvents() {
    const accordionGroup = document.getElementById("edit-accordion-group");
    if (!accordionGroup) return;

    accordionGroup.addEventListener("click", (e) => {
      const header = e.target.closest(".accordion-header");
      if (!header) return;

      const currentItem = header.closest(".accordion-item");
      const currentContent = currentItem.querySelector(".accordion-content");

      if (!currentContent.classList.contains("hidden")) return;

      const allItems = accordionGroup.querySelectorAll(".accordion-item");
      const currentIndex = Array.from(allItems).indexOf(currentItem);

      allItems.forEach((item, index) => {
        const content = item.querySelector(".accordion-content");
        const icon = item.querySelector(".accordion-icon");
        const itemHeader = item.querySelector(".accordion-header");

        if (index === currentIndex) {
          content.classList.remove("hidden");
        } else {
          content.classList.add("hidden");
        }

        itemHeader?.classList.toggle("border-b", index === currentIndex);
        icon?.classList.toggle("fa-chevron-up", index === currentIndex);
        icon?.classList.toggle("fa-chevron-down", index !== currentIndex);
      });
    });
  },

  resetAccordionToFirstItem() {
    const accordionGroup = document.getElementById("edit-accordion-group");
    if (!accordionGroup) return;

    const items = accordionGroup.querySelectorAll(".accordion-item");
    items.forEach((item, index) => {
      const header = item.querySelector(".accordion-header");
      const content = item.querySelector(".accordion-content");
      const icon = item.querySelector(".accordion-icon");

      if (index === 0) {
        content.classList.remove("hidden");
        header.classList.add("border-b");
        if (icon) {
          icon.classList.remove("fa-chevron-down");
          icon.classList.add("fa-chevron-up");
        }
      } else {
        content.classList.add("hidden");
        header.classList.remove("border-b");
        if (icon) {
          icon.classList.remove("fa-chevron-up");
          icon.classList.add("fa-chevron-down");
        }
      }
    });
  },

  renderModalObjectives() {
    const container = document.getElementById("plan-objectives-list");
    const badge = document.getElementById("objective-progress-badge");
    if (!container) return;

    const total = activeModalObjectives.length;
    const completedCount = activeModalObjectives.filter(
      (o) => o.completed,
    ).length;

    if (badge) {
      badge.textContent = `${completedCount}/${total} Done`;
    }

    if (total === 0) {
      container.innerHTML = EditModalsComponent.renderEmptyState(
        "No objectives defined yet.",
        "fa-regular fa-bullseye-arrow",
      );
      return;
    }

    container.innerHTML = `
    <div
      class="w-full h-full max-h-40 sm:max-h-35 lg:max-h-33 overflow-y-auto scrollbar-thumb-surface-2 scrollbar-thin bg-surface rounded-2xl border border-border/60 p-2.5 flex flex-col justify-start gap-2.5"
    >
      ${activeModalObjectives
        .map((obj) => EditModalsComponent.renderObjectiveItem(obj))
        .join("")}
    </div>
  `;
  },

  renderModalMetrics() {
    const container = document.getElementById("log-metrics-list");
    if (!container) return;

    const keys = Object.keys(activeModalMetrics || {});

    if (keys.length === 0) {
      container.innerHTML = EditModalsComponent.renderEmptyState(
        "No quantitative metrics recorded.",
        "fa-regular fa-chart-simple",
      );
      return;
    }

    container.innerHTML = `
    <div class="w-full h-full max-h-40 sm:max-h-35 lg:max-h-33 overflow-y-auto scrollbar-thumb-surface-2 scrollbar-thin bg-surface rounded-2xl border border-border/60 p-2.5 flex flex-col justify-start gap-2.5">
      ${keys
        .map((key) =>
          EditModalsComponent.renderMetricItem(key, activeModalMetrics[key]),
        )
        .join("")}
    </div>
  `;
  },

  resetMetricFormState() {
    editingMetricKey = null;
    const keyInput = document.getElementById("new-metric-key");
    const valInput = document.getElementById("new-metric-val");
    const actionsContainer = document.getElementById("metric-form-actions");

    this.updateInputStyleByUnit(valInput, "count", "metric");

    if (keyInput) keyInput.value = "";
    if (valInput) valInput.value = "1";
    if (editMetricUnitAutocomplete)
      editMetricUnitAutocomplete.setValue("count");

    if (actionsContainer) {
      actionsContainer.innerHTML = `
      <button
        id="btn-add-metric"
        type="button"
        class="w-full h-10 rounded-xl bg-brand/10 text-brand/80 hover:bg-brand/20 font-semibold text-xs lg:text-sm flex items-center justify-center gap-1.5 transition cursor-pointer"
      >
        <i class="fa-regular fa-plus"></i> Add Metric
      </button>
    `;
    }
  },

  handleSaveMetric() {
    const keyInput = document.getElementById("new-metric-key");
    const valInput = document.getElementById("new-metric-val");

    const key = keyInput?.value.trim();
    if (!key) {
      NotificationService.show({
        type: "warning",
        message: "Metric key is required",
        icon: "fa-triangle-exclamation",
      });
      return;
    }

    const unit = editMetricUnitAutocomplete
      ? editMetricUnitAutocomplete.getValue()
      : "count";

    const rawVal = parseFormattedNumber(valInput?.value || "1");
    const sanitizedValue = this.sanitizeTargetValue(rawVal, true, unit);
    const value = parseFormattedNumber(sanitizedValue);

    if (editingMetricKey && editingMetricKey !== key) {
      delete activeModalMetrics[editingMetricKey];
    }

    activeModalMetrics[key] = { value, unit };
    this.resetMetricFormState();
    this.renderModalMetrics();
  },

  bindMetricEvents() {
    const container = document.getElementById("log-metrics-list");
    const keyInput = document.getElementById("new-metric-key");
    const valInput = document.getElementById("new-metric-val");
    const actionsContainer = document.getElementById("metric-form-actions");

    if (valInput) {
      valInput.type = "text";
      valInput.setAttribute("inputmode", "decimal");

      const updateMetricInputFormatting = (enforceMin = false) => {
        const unit = editMetricUnitAutocomplete
          ? editMetricUnitAutocomplete.getValue()
          : "count";
        const currentRaw = parseFormattedNumber(valInput.value);
        valInput.value = this.sanitizeTargetValue(currentRaw, enforceMin, unit);
      };

      valInput.addEventListener("input", () => {
        updateMetricInputFormatting(false);
      });

      valInput.addEventListener("blur", () => {
        updateMetricInputFormatting(true);
      });
    }

    keyInput?.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        this.handleSaveMetric();
      }
    });

    valInput?.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        this.handleSaveMetric();
      }
    });

    actionsContainer?.addEventListener("click", (e) => {
      const addBtn = e.target.closest("#btn-add-metric");
      const saveBtn = e.target.closest("#btn-save-metric");
      const cancelBtn = e.target.closest("#btn-cancel-metric");

      if (addBtn || saveBtn) {
        e.preventDefault();
        this.handleSaveMetric();
      } else if (cancelBtn) {
        e.preventDefault();
        this.resetMetricFormState();
      }
    });

    container?.addEventListener("click", (e) => {
      const target = e.target.closest("[data-action]");
      if (!target) return;

      const key = target.dataset.metricKey;
      const action = target.dataset.action;

      if (action === "delete-metric") {
        const deletedMetricData = activeModalMetrics[key];
        delete activeModalMetrics[key];

        if (editingMetricKey === key) this.resetMetricFormState();
        this.renderModalMetrics();

        NotificationService.show({
          type: "error",
          message: `Metric "${key}" deleted`,
          icon: "fa-trash-can",
          duration: 5000,
          undoAction: () => {
            activeModalMetrics[key] = deletedMetricData;
            this.renderModalMetrics();
          },
        });
      } else if (action === "edit-metric") {
        const metricData = activeModalMetrics[key];
        if (!metricData) return;

        editingMetricKey = key;
        if (keyInput) keyInput.value = key;

        const unitVal =
          typeof metricData === "object" ? metricData.unit || "count" : "count";

        if (editMetricUnitAutocomplete) {
          editMetricUnitAutocomplete.setValue(unitVal);
        }

        if (valInput) {
          const rawVal =
            typeof metricData === "object" ? metricData.value : metricData;
          valInput.value = this.sanitizeTargetValue(
            rawVal || 1,
            false,
            unitVal,
          );
        }

        if (actionsContainer) {
          actionsContainer.innerHTML = `
          <div class="grid grid-cols-2 gap-2 w-full">
            <button
              id="btn-cancel-metric"
              type="button"
              class="h-10 rounded-xl bg-surface-2 border border-border text-secondary hover:text-color font-semibold text-xs lg:text-sm flex items-center justify-center transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              id="btn-save-metric"
              type="button"
              class="h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 text-blue-400 hover:bg-blue-600/30 font-semibold text-xs lg:text-sm flex items-center justify-center gap-1.5 transition cursor-pointer"
            >
              <i class="fa-regular fa-floppy-disk"></i> Save Metric
            </button>
          </div>
        `;
        }

        keyInput?.focus();
      }
    });
  },

  sanitizeTargetValue(inputValue, enforceMinimum = false, unit = "count") {
    const isCurrency = unit === "currency";
    const MIN_TARGET_VALUE = 1;
    const MAX_TARGET_VALUE = isCurrency ? 999999999999 : 9999999;
    const MAX_TARGET_LENGTH = isCurrency ? 15 : 7;

    let val = String(inputValue || "").replace(/[^0-9.]/g, "");
    const parts = val.split(".");
    if (parts.length > 2) val = `${parts[0]}.${parts.slice(1).join("")}`;

    if (!isCurrency && parts.length > 1) {
      val = parts[0];
    }

    if (val.length > MAX_TARGET_LENGTH) val = val.slice(0, MAX_TARGET_LENGTH);
    if (Number(val) > MAX_TARGET_VALUE) val = String(MAX_TARGET_VALUE);

    if (enforceMinimum) {
      const numVal = Number(val);
      if (isNaN(numVal) || numVal < MIN_TARGET_VALUE) {
        val = String(MIN_TARGET_VALUE);
      }
    }

    if (isCurrency && val) {
      return formatNumberWithCommas(val);
    }

    return val;
  },

  handleSaveObjective() {
    const input = document.getElementById("new-objective-input");
    const targetInput = document.getElementById("new-objective-target");

    if (!input) return;
    const title = input.value.trim();
    if (!title) {
      NotificationService.show({
        type: "warning",
        message: "Objective title is required",
        icon: "fa-triangle-exclamation",
      });
      return;
    }

    const type = editObjectiveTypeAutocomplete
      ? editObjectiveTypeAutocomplete.getValue()
      : "boolean";

    const unit = editObjectiveUnitAutocomplete
      ? editObjectiveUnitAutocomplete.getValue()
      : "count";

    const rawTarget = parseFormattedNumber(targetInput?.value || "1");
    const sanitizedTarget = this.sanitizeTargetValue(rawTarget, true, unit);
    const targetValue = parseFormattedNumber(sanitizedTarget);

    if (editingObjectiveId) {
      const targetObj = activeModalObjectives.find(
        (o) => o.id === editingObjectiveId,
      );
      if (targetObj) {
        targetObj.title = title;
        targetObj.type = type;
        targetObj.targetValue = targetValue;
        targetObj.unit = unit;
      }
    } else {
      activeModalObjectives.push({
        id: generateId(),
        title,
        type,
        targetValue,
        currentValue: 0,
        unit,
        completed: false,
      });
    }

    this.resetObjectiveFormState();
    this.renderModalObjectives();
  },

  bindObjectiveEvents() {
    const container = document.getElementById("plan-objectives-list");
    const input = document.getElementById("new-objective-input");
    const targetInput = document.getElementById("new-objective-target");
    const actionsContainer = document.getElementById("objective-form-actions");

    if (targetInput) {
      targetInput.type = "text";
      targetInput.setAttribute("inputmode", "decimal");

      const updateObjectiveInputFormatting = (enforceMin = false) => {
        const unit = editObjectiveUnitAutocomplete
          ? editObjectiveUnitAutocomplete.getValue()
          : "count";
        const currentRaw = parseFormattedNumber(targetInput.value);
        targetInput.value = this.sanitizeTargetValue(
          currentRaw,
          enforceMin,
          unit,
        );
      };

      targetInput.addEventListener("input", () => {
        updateObjectiveInputFormatting(false);
      });

      targetInput.addEventListener("blur", () => {
        updateObjectiveInputFormatting(true);
      });
    }

    input?.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        this.handleSaveObjective();
      }
    });

    targetInput?.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        this.handleSaveObjective();
      }
    });

    actionsContainer?.addEventListener("click", (e) => {
      const addBtn = e.target.closest("#btn-add-objective");
      const saveBtn = e.target.closest("#btn-save-objective");
      const cancelBtn = e.target.closest("#btn-cancel-objective");

      if (addBtn || saveBtn) {
        e.preventDefault();
        this.handleSaveObjective();
      } else if (cancelBtn) {
        e.preventDefault();
        this.resetObjectiveFormState();
      }
    });

    container?.addEventListener("click", (e) => {
      const target = e.target.closest("[data-action]");
      if (!target) return;

      const objId = target.dataset.objectiveId;
      if (!objId) return;

      const action = target.dataset.action;

      if (action === "delete-objective") {
        const targetIndex = activeModalObjectives.findIndex(
          (o) => o.id === objId,
        );
        if (targetIndex === -1) return;

        const deletedItem = activeModalObjectives[targetIndex];
        activeModalObjectives.splice(targetIndex, 1);

        if (editingObjectiveId === objId) this.resetObjectiveFormState();
        this.renderModalObjectives();

        NotificationService.show({
          type: "error",
          message: `Objective deleted`,
          icon: "fa-trash-can",
          duration: 5000,
          undoAction: () => {
            activeModalObjectives.splice(targetIndex, 0, deletedItem);
            this.renderModalObjectives();
          },
        });
      } else if (action === "edit-objective") {
        const obj = activeModalObjectives.find((o) => o.id === objId);
        if (!obj) return;

        editingObjectiveId = obj.id;

        if (input) input.value = obj.title;
        if (editObjectiveTypeAutocomplete)
          editObjectiveTypeAutocomplete.setValue(obj.type || "boolean");
        if (editObjectiveUnitAutocomplete)
          editObjectiveUnitAutocomplete.setValue(obj.unit || "count");

        if (targetInput) {
          const unit = obj.unit || "count";
          targetInput.value = this.sanitizeTargetValue(
            obj.targetValue || 1,
            false,
            unit,
          );
        }

        this.toggleObjectiveNumericInputs(obj.type || "boolean");

        if (actionsContainer) {
          actionsContainer.innerHTML = `
          <div class="grid grid-cols-2 gap-2 w-full">
            <button
              id="btn-cancel-objective"
              type="button"
              class="h-10 rounded-xl bg-surface-2 border border-border text-secondary hover:text-color font-semibold text-xs lg:text-sm flex items-center justify-center transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              id="btn-save-objective"
              type="button"
              class="h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 text-blue-400 hover:bg-blue-600/30 font-semibold text-xs lg:text-sm flex items-center justify-center gap-1.5 transition cursor-pointer"
            >
              <i class="fa-regular fa-floppy-disk"></i> Save Objective
            </button>
          </div>
        `;
        }

        input?.focus();
      }
    });
  },

  resetObjectiveFormState() {
    editingObjectiveId = null;
    const input = document.getElementById("new-objective-input");
    const targetInput = document.getElementById("new-objective-target");
    const actionsContainer = document.getElementById("objective-form-actions");

    this.updateInputStyleByUnit(targetInput, "count", "objective");

    if (input) input.value = "";
    if (targetInput) targetInput.value = "1";
    if (editObjectiveTypeAutocomplete)
      editObjectiveTypeAutocomplete.setValue("boolean");
    if (editObjectiveUnitAutocomplete)
      editObjectiveUnitAutocomplete.setValue("count");

    this.toggleObjectiveNumericInputs("boolean");

    if (actionsContainer) {
      actionsContainer.innerHTML = `
      <button
        id="btn-add-objective"
        type="button"
        class="w-full h-10 rounded-xl bg-brand/10 text-brand/80 hover:bg-brand/20 font-semibold text-xs lg:text-sm flex items-center justify-center gap-1.5 transition cursor-pointer"
      >
        <i class="fa-regular fa-plus"></i> Add Objective
      </button>
    `;
    }
  },

  setupCreateAutocompletes() {
    const planLifeAreaContainer = document.getElementById(
      "create-plan-lifearea-autocomplete",
    );
    if (planLifeAreaContainer) {
      if (createPlanLifeAreaAutocomplete)
        createPlanLifeAreaAutocomplete.destroy();
      createPlanLifeAreaAutocomplete = new AutocompleteComponent(
        planLifeAreaContainer,
        LIFE_AREAS,
        {
          label: "Life Area",
          itemTitle: "name",
          itemValue: "id",
          itemIcon: "icon",
          placeholder: "Select life area...",
        },
      );
      createPlanLifeAreaAutocomplete.setValue("productivity");
    }

    const planStateContainer = document.getElementById(
      "create-plan-state-autocomplete",
    );
    if (planStateContainer) {
      if (createPlanStateAutocomplete) createPlanStateAutocomplete.destroy();
      createPlanStateAutocomplete = new AutocompleteComponent(
        planStateContainer,
        PLAN_STATES,
        {
          label: "Status",
          itemTitle: "name",
          itemValue: "id",
          itemIcon: "icon",
          placeholder: "Select state...",
        },
      );
      createPlanStateAutocomplete.setValue("active");
    }

    const planStartDateContainer = document.getElementById(
      "create-plan-startdate-container",
    );
    if (planStartDateContainer) {
      createPlanStartDatePicker = new DatePickerComponent({
        id: "create-plan-startdate",
        value: todayISO(),
        label: "Start Date",
        placeholder: "Select start date...",
        background: "surface-2",
      });
      planStartDateContainer.innerHTML = createPlanStartDatePicker.render();
      createPlanStartDatePicker.bindEvents();
    }

    const planEndDateContainer = document.getElementById(
      "create-plan-enddate-container",
    );
    if (planEndDateContainer) {
      createPlanEndDatePicker = new DatePickerComponent({
        id: "create-plan-enddate",
        value: "",
        label: "End Date (Optional)",
        placeholder: "Select end date...",
        background: "surface-2",
      });
      planEndDateContainer.innerHTML = createPlanEndDatePicker.render();
      createPlanEndDatePicker.bindEvents();
    }

    const logDatePickerContainer = document.getElementById(
      "create-log-datepicker-container",
    );
    if (logDatePickerContainer) {
      createLogDatePicker = new DatePickerComponent({
        id: "create-log-datepicker",
        value: todayISO(),
        label: "Date",
        placeholder: "Select log date...",
        background: "surface-2",
      });
      logDatePickerContainer.innerHTML = createLogDatePicker.render();
      createLogDatePicker.bindEvents();
    }

    const logEnergyContainer = document.getElementById(
      "create-log-energy-autocomplete",
    );
    if (logEnergyContainer) {
      if (createLogEnergyAutocomplete) createLogEnergyAutocomplete.destroy();
      createLogEnergyAutocomplete = new AutocompleteComponent(
        logEnergyContainer,
        ENERGY_LEVEL_OPTIONS,
        {
          label: "Energy Level",
          itemTitle: "label",
          itemValue: "value",
          itemIcon: "icon",
          placeholder: "Select energy level...",
        },
      );
      createLogEnergyAutocomplete.setValue(3);
    }

    const logMoodContainer = document.getElementById(
      "create-log-mood-autocomplete",
    );
    if (logMoodContainer) {
      if (createLogMoodAutocomplete) createLogMoodAutocomplete.destroy();
      createLogMoodAutocomplete = new AutocompleteComponent(
        logMoodContainer,
        MOOD_OPTIONS,
        {
          label: "Mood",
          itemTitle: "label",
          itemValue: "value",
          itemIcon: "icon",
          placeholder: "Select mood...",
        },
      );
      createLogMoodAutocomplete.setValue("neutral");
    }

    const logPlanLinkContainer = document.getElementById(
      "create-log-plan-link-autocomplete",
    );
    if (logPlanLinkContainer) {
      if (createLogPlanLinkAutocomplete)
        createLogPlanLinkAutocomplete.destroy();
      const plans = StateManager.getPlans() || [];
      const planOptions = plans.map((p) => ({
        id: p.id,
        title: p.title,
        icon: "fa-regular fa-bullseye text-brand/80",
      }));

      createLogPlanLinkAutocomplete = new AutocompleteComponent(
        logPlanLinkContainer,
        planOptions,
        {
          label: "Link to Plan (Optional)",
          itemTitle: "title",
          itemValue: "id",
          itemIcon: "icon",
          placeholder: "Select plan to link...",
        },
      );
    }

    const templateLifeAreaContainer = document.getElementById(
      "create-template-lifearea-autocomplete",
    );
    if (templateLifeAreaContainer) {
      if (createTemplateLifeAreaAutocomplete)
        createTemplateLifeAreaAutocomplete.destroy();
      createTemplateLifeAreaAutocomplete = new AutocompleteComponent(
        templateLifeAreaContainer,
        LIFE_AREAS,
        {
          label: "Life Area",
          itemTitle: "name",
          itemValue: "id",
          itemIcon: "icon",
          placeholder: "Select life area...",
        },
      );
      createTemplateLifeAreaAutocomplete.setValue("productivity");
    }
  },

  populateEditModal(itemId) {
    if (editPlanLifeAreaAutocomplete) editPlanLifeAreaAutocomplete.destroy();
    if (editPlanStateAutocomplete) editPlanStateAutocomplete.destroy();
    if (editLogEnergyAutocomplete) editLogEnergyAutocomplete.destroy();
    if (editLogMoodAutocomplete) editLogMoodAutocomplete.destroy();
    if (editLogPlanLinkAutocomplete) editLogPlanLinkAutocomplete.destroy();
    if (editTemplateLifeAreaAutocomplete)
      editTemplateLifeAreaAutocomplete.destroy();
    if (editObjectiveTypeAutocomplete) editObjectiveTypeAutocomplete.destroy();
    if (editObjectiveUnitAutocomplete) editObjectiveUnitAutocomplete.destroy();
    if (editMetricUnitAutocomplete) editMetricUnitAutocomplete.destroy();

    this.resetMetricFormState();
    this.resetObjectiveFormState();
    this.resetAccordionToFirstItem();

    const activeTab = StateManager.getActiveTab() || "plans";
    const stateData = StateManager.getState();

    let currentItem = null;
    if (activeTab === "plans") {
      currentItem = (stateData.plans || []).find(
        (p) => String(p.id) === String(itemId),
      );
    } else if (activeTab === "logs") {
      currentItem = (stateData.logs || []).find(
        (l) => String(l.id) === String(itemId),
      );
    } else if (activeTab === "templates") {
      currentItem = (stateData.templates || []).find(
        (t) => String(t.id) === String(itemId),
      );
    }

    if (!currentItem) return;

    const editModal = document.getElementById("edit-modal");
    if (editModal) {
      document.querySelectorAll(".edit-tab-field").forEach((el) => {
        const fieldTabsAttr = el.getAttribute("data-tab") || "";
        const allowedTabs = fieldTabsAttr.split(",").map((t) => t.trim());
        el.classList.toggle("hidden", !allowedTabs.includes(activeTab));
      });
    }

    const titleInput = document.getElementById("edit-item-title");
    const descInput = document.getElementById("edit-item-desc");

    if (titleInput) {
      titleInput.value = currentItem.title || currentItem.date || "";
    }

    if (descInput) {
      descInput.value = currentItem.description || currentItem.notes || "";
    }

    if (activeTab === "plans") {
      activeModalObjectives = JSON.parse(
        JSON.stringify(currentItem.objectives || []),
      );
      this.renderModalObjectives();

      const editPlanLifeAreaContainer = document.getElementById(
        "edit-plan-lifearea-autocomplete",
      );
      if (editPlanLifeAreaContainer) {
        editPlanLifeAreaAutocomplete = new AutocompleteComponent(
          editPlanLifeAreaContainer,
          LIFE_AREAS,
          {
            label: "Life Area",
            itemTitle: "name",
            itemValue: "id",
            itemIcon: "icon",
            containerClass: "bg-surface!",
          },
        );
        editPlanLifeAreaAutocomplete.setValue(
          currentItem.lifeAreaId || "productivity",
        );
      }

      const editPlanStateContainer = document.getElementById(
        "edit-plan-state-autocomplete",
      );
      if (editPlanStateContainer) {
        editPlanStateAutocomplete = new AutocompleteComponent(
          editPlanStateContainer,
          PLAN_STATES,
          {
            label: "Status",
            itemTitle: "name",
            itemValue: "id",
            itemIcon: "icon",
            containerClass: "bg-surface!",
          },
        );
        editPlanStateAutocomplete.setValue(currentItem.state || "active");
      }

      const editObjectiveTypeContainer = document.getElementById(
        "new-objective-type-autocomplete",
      );
      if (editObjectiveTypeContainer) {
        editObjectiveTypeAutocomplete = new AutocompleteComponent(
          editObjectiveTypeContainer,
          OBJECTIVE_TYPES,
          {
            label: "",
            itemTitle: "name",
            itemValue: "id",
            itemIcon: "icon",
            placeholder: "Type...",
            containerClass: "bg-surface!",
            onChange: (value) => {
              const selectedType = Array.isArray(value) ? value[0] : value;
              this.toggleObjectiveNumericInputs(selectedType);
            },
          },
        );
        editObjectiveTypeAutocomplete.setValue("boolean");

        this.toggleObjectiveNumericInputs("boolean");
      }

      const editObjectiveUnitContainer = document.getElementById(
        "new-objective-unit-autocomplete",
      );
      if (editObjectiveUnitContainer) {
        editObjectiveUnitAutocomplete = new AutocompleteComponent(
          editObjectiveUnitContainer,
          OBJECTIVE_UNITS,
          {
            label: "",
            itemTitle: "name",
            itemValue: "id",
            itemIcon: "icon",
            placeholder: "Unit...",
            containerClass: "bg-surface!",
            onChange: (value) => {
              const selectedUnit = Array.isArray(value) ? value[0] : value;
              const targetInput = document.getElementById(
                "new-objective-target",
              );

              this.updateInputStyleByUnit(
                targetInput,
                selectedUnit,
                "objective",
              );

              if (targetInput) {
                const currentRaw = parseFormattedNumber(targetInput.value);
                targetInput.value = this.sanitizeTargetValue(
                  currentRaw,
                  false,
                  selectedUnit,
                );
              }
            },
          },
        );
        editObjectiveUnitAutocomplete.setValue("count");
      }

      const editStartDateContainer = document.getElementById(
        "edit-plan-startdate-container",
      );
      if (editStartDateContainer) {
        editPlanStartDatePicker = new DatePickerComponent({
          id: "edit-plan-startdate",
          value: currentItem.period?.startDate || todayISO(),
          label: "Start Date",
          background: "surface",
        });
        editStartDateContainer.innerHTML = editPlanStartDatePicker.render();
        editPlanStartDatePicker.bindEvents();
      }

      const editEndDateContainer = document.getElementById(
        "edit-plan-enddate-container",
      );
      if (editEndDateContainer) {
        editPlanEndDatePicker = new DatePickerComponent({
          id: "edit-plan-enddate",
          value: currentItem.period?.endDate || "",
          label: "End Date (Optional)",
          background: "surface",
        });
        editEndDateContainer.innerHTML = editPlanEndDatePicker.render();
        editPlanEndDatePicker.bindEvents();
      }
    } else if (activeTab === "logs") {
      const editLogNotesInput = document.getElementById("edit-log-notes");
      if (editLogNotesInput) editLogNotesInput.value = currentItem.notes || "";

      activeModalMetrics = JSON.parse(
        JSON.stringify(currentItem.metrics || {}),
      );
      this.renderModalMetrics();

      const editMetricUnitContainer = document.getElementById(
        "new-metric-unit-autocomplete",
      );
      if (editMetricUnitContainer) {
        editMetricUnitAutocomplete = new AutocompleteComponent(
          editMetricUnitContainer,
          OBJECTIVE_UNITS,
          {
            label: "",
            itemTitle: "name",
            itemValue: "id",
            itemIcon: "icon",
            placeholder: "Unit...",
            containerClass: "bg-surface!",
            onChange: (value) => {
              const selectedUnit = Array.isArray(value) ? value[0] : value;
              const valInput = document.getElementById("new-metric-val");

              this.updateInputStyleByUnit(valInput, selectedUnit, "metric");

              if (valInput) {
                const currentRaw = parseFormattedNumber(valInput.value);
                valInput.value = this.sanitizeTargetValue(
                  currentRaw,
                  false,
                  selectedUnit,
                );
              }
            },
          },
        );
        editMetricUnitAutocomplete.setValue("count");
      }

      const editLogDatePickerContainer = document.getElementById(
        "edit-log-datepicker-container",
      );
      if (editLogDatePickerContainer) {
        editLogDatePicker = new DatePickerComponent({
          id: "edit-log-datepicker",
          value: currentItem.date || todayISO(),
          label: "Date",
          background: "surface",
        });
        editLogDatePickerContainer.innerHTML = editLogDatePicker.render();
        editLogDatePicker.bindEvents();
      }

      const editLogEnergyContainer = document.getElementById(
        "edit-log-energy-autocomplete",
      );
      if (editLogEnergyContainer) {
        editLogEnergyAutocomplete = new AutocompleteComponent(
          editLogEnergyContainer,
          ENERGY_LEVEL_OPTIONS,
          {
            label: "Energy Level",
            itemTitle: "label",
            itemValue: "value",
            itemIcon: "icon",
            containerClass: "bg-surface!",
          },
        );
        editLogEnergyAutocomplete.setValue(currentItem.energy || 3);
      }

      const editLogMoodContainer = document.getElementById(
        "edit-log-mood-autocomplete",
      );
      if (editLogMoodContainer) {
        editLogMoodAutocomplete = new AutocompleteComponent(
          editLogMoodContainer,
          MOOD_OPTIONS,
          {
            label: "Mood",
            itemTitle: "label",
            itemValue: "value",
            itemIcon: "icon",
            containerClass: "bg-surface!",
          },
        );
        editLogMoodAutocomplete.setValue(currentItem.mood || "neutral");
      }

      const editLogPlanLinkContainer = document.getElementById(
        "edit-log-plan-link-autocomplete",
      );
      if (editLogPlanLinkContainer) {
        const plans = StateManager.getPlans() || [];
        const planOptions = plans.map((p) => ({
          id: p.id,
          title: p.title,
          icon: "fa-regular fa-bullseye text-brand/80",
        }));

        editLogPlanLinkAutocomplete = new AutocompleteComponent(
          editLogPlanLinkContainer,
          planOptions,
          {
            label: "Link to Plan (Optional)",
            itemTitle: "title",
            itemValue: "id",
            itemIcon: "icon",
            containerClass: "bg-surface!",
          },
        );
        if (currentItem.planId) {
          editLogPlanLinkAutocomplete.setValue(currentItem.planId);
        }
      }
    } else if (activeTab === "templates") {
      const editTemplateLifeAreaContainer = document.getElementById(
        "edit-template-lifearea-autocomplete",
      );
      if (editTemplateLifeAreaContainer) {
        editTemplateLifeAreaAutocomplete = new AutocompleteComponent(
          editTemplateLifeAreaContainer,
          LIFE_AREAS,
          {
            label: "Life Area",
            itemTitle: "name",
            itemValue: "id",
            itemIcon: "icon",
            containerClass: "bg-surface!",
          },
        );
        editTemplateLifeAreaAutocomplete.setValue(
          currentItem.lifeAreaId || "productivity",
        );
      }

      const baselineInput = document.getElementById("edit-template-baseline");
      const optimalInput = document.getElementById("edit-template-optimal");
      const favCheckbox = document.getElementById("edit-template-favorite");

      if (baselineInput) baselineInput.value = currentItem.baseline || "";
      if (optimalInput) optimalInput.value = currentItem.optimal || "";
      if (favCheckbox) favCheckbox.checked = Boolean(currentItem.isFavorite);
    }

    if (this.mainController?.plansActionController?.resetEditModalAccordion) {
      this.mainController.plansActionController.resetEditModalAccordion();
    }
  },

  bindFormEvents() {
    this.updateAddButtonText();
    this.toggleFormTabFields();

    const titleInput = document.getElementById("create-item-title");
    const descInput = document.getElementById("create-item-desc");
    const addBtn = document.getElementById("add-plan-btn");

    const handleCreateItem = () => {
      const activeTab = StateManager.getActiveTab() || "plans";

      GlobalLoaderService.show(`Creating item...`);

      setTimeout(() => {
        try {
          const currentStateData = StateManager.getState();
          const sharedTitle = titleInput?.value.trim();
          const sharedDesc = descInput?.value.trim() || "";

          if (activeTab === "plans") {
            const lifeAreaId = createPlanLifeAreaAutocomplete
              ? createPlanLifeAreaAutocomplete.getValue()
              : "productivity";
            const state = createPlanStateAutocomplete
              ? createPlanStateAutocomplete.getValue()
              : "active";
            const startDate = createPlanStartDatePicker
              ? createPlanStartDatePicker.value
              : todayISO();
            const endDate = createPlanEndDatePicker
              ? createPlanEndDatePicker.value
              : null;

            const updatedPlans = PlannerService.createPlan(
              currentStateData.plans || [],
              {
                title: sharedTitle,
                description: sharedDesc,
                lifeAreaId,
                state,
                period: { startDate, endDate },
                objectives: [],
              },
            );

            StateManager.save({ plans: updatedPlans });
          } else if (activeTab === "logs") {
            const date = createLogDatePicker
              ? createLogDatePicker.value
              : todayISO();
            const energy = createLogEnergyAutocomplete
              ? Number(createLogEnergyAutocomplete.getValue())
              : 3;
            const mood = createLogMoodAutocomplete
              ? createLogMoodAutocomplete.getValue()
              : "neutral";

            let planId = null;
            if (createLogPlanLinkAutocomplete) {
              const selectedItems =
                createLogPlanLinkAutocomplete.getSelectedItems();
              if (selectedItems && selectedItems.length > 0) {
                planId = selectedItems[0].id || selectedItems[0].value;
              }
            }

            const updatedLogs = PlannerService.createLog(
              currentStateData.logs || [],
              {
                title: sharedTitle,
                description: sharedDesc,
                date,
                planId,
                energy,
                mood,
                metrics: {},
              },
            );

            StateManager.save({ logs: updatedLogs });
          } else if (activeTab === "templates") {
            const baseline =
              document
                .getElementById("create-template-baseline")
                ?.value.trim() || "";
            const optimal =
              document
                .getElementById("create-template-optimal")
                ?.value.trim() || "";
            const lifeAreaId = createTemplateLifeAreaAutocomplete
              ? createTemplateLifeAreaAutocomplete.getValue()
              : "productivity";
            const isFavorite =
              document.getElementById("create-template-favorite")?.checked ||
              false;

            const updatedTemplates = PlannerService.createTemplate(
              currentStateData.templates || [],
              {
                title: sharedTitle,
                description: sharedDesc,
                lifeAreaId,
                baseline,
                optimal,
                isFavorite,
              },
            );

            StateManager.save({ templates: updatedTemplates });
          }

          this.resetForms();

          if (
            this.mainController &&
            typeof this.mainController.refreshUI === "function"
          ) {
            this.mainController.refreshUI();
          }

          NotificationService.show({
            type: "success",
            message: `Item created successfully!`,
            icon: "fa-check",
            duration: 5000,
          });
        } catch (error) {
          NotificationService.show({
            type: "error",
            message: error.message || "Failed to create item",
            icon: "fa-triangle-exclamation",
            duration: 5000,
          });
        } finally {
          GlobalLoaderService.hide();
        }
      }, 30);
    };

    addBtn?.addEventListener("click", handleCreateItem);

    titleInput?.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleCreateItem();
      }
    });

    document.addEventListener("keydown", (e) => {
      const deleteModal = document.getElementById("delete-modal");
      const editModal = document.getElementById("edit-modal");

      const deleteOpen =
        deleteModal && !deleteModal.classList.contains("hidden");
      const editOpen = editModal && !editModal.classList.contains("hidden");

      if (!deleteOpen && !editOpen) return;

      if (e.key === "Escape") {
        if (deleteOpen) this.mainController.toggleModal("delete-modal", false);
        if (editOpen) this.mainController.toggleModal("edit-modal", false);
      }

      if (e.key === "Enter" && e.ctrlKey) {
        if (deleteOpen) this.executeDelete();
        if (editOpen) this.executeEdit();
      }
    });

    const addClick = (id, cb) =>
      document.getElementById(id)?.addEventListener("click", cb);

    addClick("confirm-delete-btn", () => this.executeDelete());
    addClick("confirm-delete", () => this.executeDelete());
    addClick("cancel-delete-btn", () =>
      this.mainController.toggleModal("delete-modal", false),
    );
    addClick("cancel-delete", () =>
      this.mainController.toggleModal("delete-modal", false),
    );

    addClick("confirm-edit", () => this.executeEdit());
    addClick("cancel-edit", () =>
      this.mainController.toggleModal("edit-modal", false),
    );
    addClick("cancel-edit-modal", () =>
      this.mainController.toggleModal("edit-modal", false),
    );
  },

  resetForms() {
    const inputsToClear = [
      "create-item-title",
      "create-item-desc",
      "create-template-baseline",
      "create-template-optimal",
    ];
    inputsToClear.forEach((id) => {
      const el = document.getElementById(id);
      if (el) el.value = "";
    });

    const favCheckbox = document.getElementById("create-template-favorite");
    if (favCheckbox) favCheckbox.checked = false;

    if (createPlanLifeAreaAutocomplete)
      createPlanLifeAreaAutocomplete.setValue("productivity");
    if (createPlanStateAutocomplete)
      createPlanStateAutocomplete.setValue("active");
    if (createLogEnergyAutocomplete) createLogEnergyAutocomplete.setValue(3);
    if (createLogMoodAutocomplete)
      createLogMoodAutocomplete.setValue("neutral");
    if (createLogPlanLinkAutocomplete)
      createLogPlanLinkAutocomplete.setValue(null);
    if (createTemplateLifeAreaAutocomplete)
      createTemplateLifeAreaAutocomplete.setValue("productivity");

    if (createPlanStartDatePicker) createPlanStartDatePicker.value = todayISO();
    if (createPlanEndDatePicker) createPlanEndDatePicker.value = "";
    if (createLogDatePicker) createLogDatePicker.value = todayISO();
  },

  executeDelete() {
    const id = pendingDeleteId;
    if (!id) return;

    const activeTab = StateManager.getActiveTab() || "plans";
    const stateData = StateManager.getState();

    let list = [];
    if (activeTab === "plans") list = stateData.plans || [];
    else if (activeTab === "logs") list = stateData.logs || [];
    else if (activeTab === "templates") list = stateData.templates || [];

    const itemToDelete = list.find((item) => String(item.id) === String(id));

    if (itemToDelete) {
      GlobalLoaderService.show(`Deleting item...`);
      setTimeout(() => {
        try {
          if (activeTab === "plans") {
            const plans = PlannerService.deletePlan(stateData.plans || [], id);
            StateManager.save({ plans });
          } else if (activeTab === "logs") {
            const logs = PlannerService.deleteLog(stateData.logs || [], id);
            StateManager.save({ logs });
          } else if (activeTab === "templates") {
            const templates = PlannerService.deleteTemplate(
              stateData.templates || [],
              id,
            );
            StateManager.save({ templates });
          }

          if (this.mainController?.toggleModal)
            this.mainController.toggleModal("delete-modal", false);
          pendingDeleteId = null;

          if (this.mainController?.refreshUI) this.mainController.refreshUI();

          NotificationService.show({
            type: "error",
            message: `Item deleted successfully`,
            icon: "fa-trash-can",
            duration: 5000,
            undoAction: () => {
              const restoredState = StateManager.getState();
              if (activeTab === "plans") {
                StateManager.save({
                  plans: [itemToDelete, ...(restoredState.plans || [])],
                });
              } else if (activeTab === "logs") {
                StateManager.save({
                  logs: [itemToDelete, ...(restoredState.logs || [])],
                });
              } else if (activeTab === "templates") {
                StateManager.save({
                  templates: [itemToDelete, ...(restoredState.templates || [])],
                });
              }
              if (this.mainController?.refreshUI)
                this.mainController.refreshUI();
            },
          });
        } finally {
          GlobalLoaderService.hide();
        }
      }, 30);
    }
  },

  executeEdit() {
    if (!pendingEditId) return;

    const activeTab = StateManager.getActiveTab() || "plans";
    const titleInput = document.getElementById("edit-item-title");
    const descInput = document.getElementById("edit-item-desc");

    GlobalLoaderService.show("Updating record...");

    setTimeout(() => {
      try {
        const stateData = StateManager.getState();

        if (activeTab === "plans") {
          let targetState = editPlanStateAutocomplete
            ? editPlanStateAutocomplete.getValue()
            : undefined;

          const hasObjectives = activeModalObjectives.length > 0;
          const allCompleted =
            hasObjectives &&
            activeModalObjectives.every((obj) => obj.completed);

          if (hasObjectives && allCompleted) {
            targetState = "completed";
          } else if (!allCompleted && targetState === "completed") {
            targetState = "active";
          }

          const updatedPlans = PlannerService.editPlan(
            stateData.plans || [],
            pendingEditId,
            {
              title: titleInput?.value,
              description: descInput?.value,
              lifeAreaId: editPlanLifeAreaAutocomplete
                ? editPlanLifeAreaAutocomplete.getValue()
                : undefined,
              state: targetState,
              period: {
                startDate: editPlanStartDatePicker
                  ? editPlanStartDatePicker.value
                  : undefined,
                endDate: editPlanEndDatePicker
                  ? editPlanEndDatePicker.value
                  : undefined,
              },
              objectives: [...activeModalObjectives],
            },
          );
          StateManager.save({ plans: updatedPlans });
        } else if (activeTab === "logs") {
          let planId = undefined;
          if (editLogPlanLinkAutocomplete) {
            const selectedItems =
              editLogPlanLinkAutocomplete.getSelectedItems();
            if (selectedItems && selectedItems.length > 0) {
              planId = selectedItems[0].id || selectedItems[0].value;
            }
          }

          const updatedLogs = PlannerService.editLog(
            stateData.logs || [],
            pendingEditId,
            {
              title: titleInput?.value,
              description: descInput?.value,
              date: editLogDatePicker ? editLogDatePicker.value : undefined,
              planId,
              energy: editLogEnergyAutocomplete
                ? Number(editLogEnergyAutocomplete.getValue())
                : undefined,
              mood: editLogMoodAutocomplete
                ? editLogMoodAutocomplete.getValue()
                : undefined,
              metrics: { ...activeModalMetrics },
            },
          );
          StateManager.save({ logs: updatedLogs });
        } else if (activeTab === "templates") {
          const updatedTemplates = PlannerService.editTemplate(
            stateData.templates || [],
            pendingEditId,
            {
              title: titleInput?.value,
              description: descInput?.value,
              lifeAreaId: editTemplateLifeAreaAutocomplete
                ? editTemplateLifeAreaAutocomplete.getValue()
                : undefined,
              baseline: document.getElementById("edit-template-baseline")
                ?.value,
              optimal: document.getElementById("edit-template-optimal")?.value,
              isFavorite: document.getElementById("edit-template-favorite")
                ?.checked,
            },
          );
          StateManager.save({ templates: updatedTemplates });
        }

        if (this.mainController?.toggleModal) {
          this.mainController.toggleModal("edit-modal", false);
        }

        pendingEditId = null;

        if (this.mainController?.refreshUI) {
          this.mainController.refreshUI();
        }

        NotificationService.show({
          type: "success",
          message: `Record updated successfully!`,
          icon: "fa-check",
          duration: 5000,
        });
      } catch (error) {
        NotificationService.show({
          type: "error",
          message: error.message || "Failed to update item",
          icon: "fa-triangle-exclamation",
          duration: 5000,
        });
      } finally {
        GlobalLoaderService.hide();
      }
    }, 30);
  },
};
