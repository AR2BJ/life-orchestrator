import {
  ENERGY_LEVEL_OPTIONS,
  LIFE_AREAS,
  MOOD_OPTIONS,
  PLAN_STATES,
} from "@/utils/constants/options-value.constants";

import { StateManager } from "@/models/state.model";

const emptyStateConfig = {
  plans: {
    icon: "<i class='ti ti-compass text-brand/60'></i>",
    title: "No operational plans found",
    description: "Create structured execution plans for your life areas.",
  },
  logs: {
    icon: "<i class='ti ti-calendar text-brand/60'></i>",
    title: "No log entries",
    description: "Log energy, mood, and progress alignment.",
  },
  templates: {
    icon: "<i class='ti ti-stack-2 text-brand/60'></i>",
    title: "No templates saved",
    description: "Save baseline and optimal performance strategies.",
  },
};

export const DashboardComponent = {
  render(plans = [], logs = [], templates = []) {
    const safePlans = Array.isArray(plans) ? plans : [];
    const safeLogs = Array.isArray(logs) ? logs : [];
    const safeTemplates = Array.isArray(templates) ? templates : [];

    const activePlans = safePlans.filter((p) => p.state === "active");
    const pausedPlans = safePlans.filter((p) => p.state === "paused");
    const completedPlans = safePlans.filter((p) => p.state === "completed");

    // Calculate metrics across ALL plans, not just active ones
    let totalObjectives = 0;
    let completedObjectives = 0;

    safePlans.forEach((plan) => {
      if (Array.isArray(plan.objectives)) {
        totalObjectives += plan.objectives.length;

        completedObjectives += plan.objectives.filter((o) => {
          // Handles boolean true or string/state truthy check
          return o.completed === true || o.status === "completed";
        }).length;
      }
    });

    const completionRate =
      totalObjectives > 0
        ? Math.round((completedObjectives / totalObjectives) * 100)
        : 0;

    const avgEnergy =
      safeLogs.length > 0
        ? (
            safeLogs.reduce(
              (acc, curr) => acc + (Number(curr.energy) || 0),
              0,
            ) / safeLogs.length
          ).toFixed(0)
        : "0";

    const favoriteTemplates = safeTemplates.filter((t) => t.isFavorite).length;

    return `
      <div
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full col-span-full"
      >
        <div
          class="col-span-2 md:col-span-1 relative overflow-hidden bg-surface-2 border border-border/70 hover:-translate-y-1 hover:border-yellow-500/30 rounded-2xl p-6 transition-all duration-300 flex flex-col justify-between min-h-36 group"
        >
          <i
            class="ti ti-clipboard-list-filled absolute -right-4 -bottom-6 text-[11rem] text-yellow-500 opacity-[0.04] dark:opacity-[0.06] rotate-15 pointer-events-none group-hover:scale-110 group-hover:rotate-5 transition-transform duration-500"
          ></i>
          <div class="flex items-center justify-between z-10">
            <span
              class="text-xs font-bold text-secondary uppercase tracking-wider"
              >Active Plans</span
            >
            <span
              class="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-yellow-500/10 text-yellow-400 border border-yellow-500/20"
              >${pausedPlans.length} Paused</span
            >
          </div>
          <div class="z-10 mt-3">
            <div class="text-3xl font-black text-color tracking-tight">
              ${activePlans.length}
            </div>
            <p class="text-[11px] text-secondary/80 font-medium mt-1">
              Active execution strategies
            </p>
          </div>
          <div
            class="mt-4 pt-3 border-t border-border/40 flex items-center justify-between z-10 text-[11px]"
          >
            <span class="text-secondary">Total Registered:</span>
            <span class="font-bold text-color"
              >${safePlans.length} (${completedPlans.length} Done)</span
            >
          </div>
        </div>

        <div
          class="col-span-2 md:col-span-1 relative overflow-hidden bg-surface-2 border border-border/70 hover:-translate-y-1 hover:border-purple-500/30 rounded-2xl p-6 transition-all duration-300 flex flex-col justify-between min-h-36 group"
        >
          <i
            class="ti ti-circle-check-filled absolute -right-4 -bottom-6 text-[11rem] text-purple-500 opacity-[0.04] dark:opacity-[0.06] rotate-20 pointer-events-none group-hover:scale-110 group-hover:rotate-10 transition-transform duration-500"
          ></i>
          <div class="flex items-center justify-between z-10">
            <span
              class="text-xs font-bold text-secondary uppercase tracking-wider"
              >Objective Rate</span
            >
            <span
              class="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-purple-500/10 text-purple-400 border border-purple-500/20"
              >${completedObjectives}/${totalObjectives} Done</span
            >
          </div>
          <div class="z-10 mt-3">
            <div class="text-3xl font-black text-color tracking-tight">
              ${completionRate}%
            </div>
            <div
              class="w-1/4 h-1.5 bg-surface rounded-full overflow-hidden mt-2"
            >
              <div
                class="h-full bg-purple-500 transition-all duration-500 rounded-full"
                style="width: ${completionRate}%"
              ></div>
            </div>
          </div>
          <div
            class="mt-4 pt-3 border-t border-border/40 flex items-center justify-between z-10 text-[11px]"
          >
            <span class="text-secondary">Efficiency Status:</span>
            <span class="font-bold text-purple-500"
              >${completionRate > 50 ? "Optimal" : "Needs Focus"}</span
            >
          </div>
        </div>

        <div
          class="col-span-2 md:col-span-1 relative overflow-hidden bg-surface-2 border border-border/70 hover:-translate-y-1 hover:border-emerald-500/30 rounded-2xl p-6 transition-all duration-300 flex flex-col justify-between min-h-36 group"
        >
          <i
            class="ti ti-bolt-filled absolute -right-4 -bottom-6 text-[11rem] text-emerald-500 opacity-[0.04] dark:opacity-[0.06] rotate-15 pointer-events-none group-hover:scale-110 group-hover:rotate-5 transition-transform duration-500"
          ></i>
          <div class="flex items-center justify-between z-10">
            <span
              class="text-xs font-bold text-secondary uppercase tracking-wider"
              >Logged Entries</span
            >
            <span
              class="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
              >Avg Energy: ${avgEnergy}/5</span
            >
          </div>
          <div class="z-10 mt-3">
            <div class="text-3xl font-black text-color tracking-tight">
              ${safeLogs.length}
            </div>
            <p class="text-[11px] text-secondary/80 font-medium mt-1">
              Reflections and logs
            </p>
          </div>
          <div
            class="mt-4 pt-3 border-t border-border/40 flex items-center justify-between z-10 text-[11px]"
          >
            <span class="text-secondary">Sync Status:</span>
            <span class="font-bold text-emerald-500">Synced Local</span>
          </div>
        </div>

        <div
          class="col-span-2 md:col-span-1 relative overflow-hidden bg-surface-2 border border-border/70 hover:-translate-y-1 hover:border-sky-500/30 rounded-2xl p-6 transition-all duration-300 flex flex-col justify-between min-h-36 group"
        >
          <i
            class="ti ti-stack-2-filled absolute -right-4 -bottom-6 text-[12rem] text-sky-500 opacity-[0.04] dark:opacity-[0.06] rotate-15 pointer-events-none group-hover:scale-110 group-hover:rotate-5 transition-transform duration-500"
          ></i>
          <div class="flex items-center justify-between z-10">
            <span
              class="text-xs font-bold text-secondary uppercase tracking-wider"
              >Templates</span
            >
            <span
              class="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-sky-500/10 text-sky-400 border border-sky-500/20"
              >${favoriteTemplates} Starred</span
            >
          </div>
          <div class="z-10 mt-3">
            <div class="text-3xl font-black text-color tracking-tight">
              ${safeTemplates.length}
            </div>
            <p class="text-[11px] text-secondary/80 font-medium mt-1">
              Reusable plan baselines
            </p>
          </div>
          <div
            class="mt-4 pt-3 border-t border-border/40 flex items-center justify-between z-10 text-[11px]"
          >
            <span class="text-secondary">Blueprint Index:</span>
            <span class="font-bold text-sky-500">Ready</span>
          </div>
        </div>
      </div>

      <div
        class="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full col-span-2 sm:col-span-full mt-4"
      >
        <div
          class="lg:col-span-2 bg-surface-2 border border-border/70 rounded-2xl p-6 flex flex-col justify-between"
        >
          <div
            class="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between"
          >
            <div>
              <h4 class="text-lg font-bold text-color flex items-center gap-2">
                <i class="ti ti-affiliate text-brand text-xl"></i>
                Execution Velocity & Heatmap
              </h4>
              <p class="text-xs text-secondary mt-1">
                Volume of logged entries and active execution trends across
                periods.
              </p>
            </div>

            <div class="relative flex items-center justify-end">
              <button
                id="heatmap-mobile-menu-toggle"
                class="sm:hidden inline-flex items-center justify-center h-8 w-8 rounded-lg border border-border bg-surface text-secondary hover:text-color transition shadow-sm cursor-pointer"
                aria-label="Open view menu"
              >
                <i class="ti ti-dots-vertical text-lg"></i>
              </button>

              <div
                id="heatmap-mobile-menu"
                class="hidden absolute right-0 top-full mt-2 w-44 rounded-2xl border border-border bg-surface-2 shadow-lg z-20 overflow-hidden"
              >
                <button
                  data-view="weekly"
                  class="w-full px-4 py-2.5 text-left text-xs font-medium text-secondary hover:bg-surface"
                >
                  Weekly
                </button>
                <button
                  data-view="monthly"
                  class="w-full px-4 py-2.5 text-left text-xs font-medium text-secondary hover:bg-surface"
                >
                  Monthly
                </button>
                <button
                  data-view="yearly"
                  class="w-full px-4 py-2.5 text-left text-xs font-medium text-secondary hover:bg-surface"
                >
                  Yearly
                </button>
              </div>

              <div
                id="chart-view-switcher"
                class="hidden sm:flex relative overflow-hidden rounded-xl border border-border/80 bg-surface p-1 isolation-auto"
              >
                <div
                  id="heatmap-tab-indicator"
                  class="absolute top-1 left-1 h-[calc(100%-8px)] w-24 rounded-lg bg-brand/80 transition-all duration-300 ease-out z-0 shadow-sm"
                ></div>

                <button
                  data-view="weekly"
                  id="view-btn-weekly"
                  class="relative z-10 w-24 py-1.5 text-xs font-bold text-secondary transition cursor-pointer text-center"
                >
                  Weekly
                </button>
                <button
                  data-view="monthly"
                  id="view-btn-monthly"
                  class="relative z-10 w-24 py-1.5 text-xs font-bold text-secondary transition cursor-pointer text-center"
                >
                  Monthly
                </button>
                <button
                  data-view="yearly"
                  id="view-btn-yearly"
                  class="relative z-10 w-24 py-1.5 text-xs font-bold text-secondary transition cursor-pointer text-center"
                >
                  Yearly
                </button>
              </div>
            </div>
          </div>

          <div
            class="w-full mt-6 overflow-x-auto scrollbar-thin scrollbar-thumb-surface"
          >
            <div
              id="apex-heatmap-chart"
              class="w-full"
            ></div>
          </div>
        </div>

        <div
          class="bg-surface-2 border border-border/70 rounded-2xl p-6 flex flex-col justify-between"
        >
          <div>
            <h4 class="text-lg font-bold text-color flex items-center gap-2">
              <i class="ti ti-chart-bar rotate-90 text-brand text-xl"></i>
              Weekday Distribution
            </h4>
            <p class="text-xs text-secondary mt-1">
              Density of logs created per weekday.
            </p>
          </div>

          <div
            class="w-full mt-6 overflow-x-auto scrollbar-thin scrollbar-thumb-surface"
          >
            <div
              id="apex-weekday-chart"
              class="w-full"
            ></div>
          </div>
        </div>
      </div>

      <div
        class="grid grid-cols-1 gap-6 w-full col-span-full mt-6"
      >
        <div
          class="bg-surface-2 border border-border/70 rounded-2xl p-6 flex flex-col justify-between shadow-sm"
        >
          <div>
            <h4 class="text-lg font-bold text-color flex items-center gap-2">
              <i class="ti ti-compass text-brand text-xl"></i>
              Life Area Distribution
            </h4>
            <p class="text-xs text-secondary mt-1">
              Distribution of execution plans across core life domain
              categories.
            </p>
          </div>
          <div
            class="w-full mt-6 overflow-x-auto scrollbar-thin scrollbar-thumb-surface"
          >
            <div
              id="apex-lifearea-chart"
              class="w-full"
            ></div>
          </div>
        </div>
      </div>

      <div
        class="grid grid-cols-1 md:grid-cols-2 gap-6 w-full col-span-full mt-6"
      >
        <div
          class="bg-surface-2 border border-border/70 rounded-2xl p-6 flex flex-col justify-between shadow-sm"
        >
          <div>
            <h4 class="text-lg font-bold text-color flex items-center gap-2">
              <i class="ti ti-mood-smile text-brand text-xl"></i>
              Mood Spectrum
            </h4>
            <p class="text-xs text-secondary mt-1">
              Logged emotional state spectrum and distributions.
            </p>
          </div>
          <div
            class="w-full mt-6 overflow-x-auto scrollbar-thin scrollbar-thumb-surface"
          >
            <div
              id="apex-mood-chart"
              class="w-full"
            ></div>
          </div>
        </div>

        <div
          class="bg-surface-2 border border-border/70 rounded-2xl p-6 flex flex-col justify-between shadow-sm"
        >
          <div>
            <h4 class="text-lg font-bold text-color flex items-center gap-2">
              <i
                class="ti ti-battery-3 text-brand text-xl"
              ></i>
              Energy Level Distribution
            </h4>
            <p class="text-xs text-secondary mt-1">
              Logged energy level frequencies (1 to 5).
            </p>
          </div>
          <div
            class="w-full mt-6 overflow-x-auto scrollbar-thin scrollbar-thumb-surface"
          >
            <div
              id="apex-energy-chart"
              class="w-full"
            ></div>
          </div>
        </div>
      </div>

      <div
        class="w-full col-span-full mt-6 bg-surface-2 border border-border/75 rounded-2xl p-6 shadow-sm"
      >
        <div
          class="flex flex-wrap sm:flex-nowrap items-center justify-center sm:justify-between gap-4 pb-4 border-b border-border/40"
        >
          <div>
            <h4 class="text-lg font-bold text-color flex items-center gap-2">
              <i class="ti ti-stack-3 text-brand text-xl"></i>
              Entities Detailed Breakdown
            </h4>
            <p class="text-xs text-secondary mt-0.5">
              Switch tabs to review underlying data structures and logs.
            </p>
          </div>

          <div
            id="entity-tab-switcher"
            class="relative flex items-center p-1 bg-surface rounded-xl border border-border/80 shadow-inner"
          >
            <div
              id="entity-tab-indicator"
              class="absolute h-[calc(100%-8px)] top-1 left-1 bg-brand rounded-lg transition-all duration-300 ease-out shadow-xs pointer-events-none"
            ></div>

            <button
              data-entity-tab="plans"
              class="entity-tab-btn relative z-10 px-3.5 py-1.5 text-xs font-bold text-white transition cursor-pointer"
            >
              Plans (${safePlans.length})
            </button>
            <button
              data-entity-tab="logs"
              class="entity-tab-btn relative z-10 px-3.5 py-1.5 text-xs font-bold text-secondary transition cursor-pointer"
            >
              Logs (${safeLogs.length})
            </button>
            <button
              data-entity-tab="templates"
              class="entity-tab-btn relative z-10 px-3.5 py-1.5 text-xs font-bold text-secondary transition cursor-pointer"
            >
              Templates (${safeTemplates.length})
            </button>
          </div>
        </div>

        <div class="mt-6">
          <div
            id="tab-panel-plans"
            class="entity-panel space-y-3"
          >
            ${this.renderPlansList(safePlans)}
          </div>
          <div
            id="tab-panel-logs"
            class="entity-panel hidden space-y-3"
          >
            ${this.renderLogsList(safeLogs)}
          </div>
          <div
            id="tab-panel-templates"
            class="entity-panel hidden space-y-3"
          >
            ${this.renderTemplatesList(safeTemplates)}
          </div>
        </div>
      </div>
    `;
  },

  _normalizeIconClass(iconString) {
    if (!iconString) return "ti ti-folder";
    return iconString;
  },

  _getLifeAreaBadgeHtml(lifeAreaId) {
    const matched = LIFE_AREAS.find(
      (area) => String(area.id) === String(lifeAreaId),
    );
    const areaData = matched || {
      name: lifeAreaId || "General",
      icon: "ti ti-folder text-secondary",
      class: "bg-surface text-secondary border-border/60",
    };

    const iconClass = this._normalizeIconClass(areaData.icon);

    return `
        <span
          class="min-h-5.5 inline-flex items-center gap-1 rounded-md border ${areaData.class} px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider"
        >
          <i class="${iconClass} text-[10px] lg:text-xs pb-px"></i>
          <span>${areaData.name}</span>
        </span>
      `;
  },

  _getStateBadgeHtml(stateKey, planId) {
    const matched = PLAN_STATES.find((s) => s.id === stateKey);
    const stateData = matched || {
      name: stateKey || "active",
      icon: "ti ti-circle text-secondary",
      class: "bg-surface text-secondary border-border/60",
    };

    const iconClass = this._normalizeIconClass(stateData.icon);

    return `
      <div
        data-plan-id="${planId}"
        data-current-state="${stateData.id}"
        class="state-cycle-btn min-h-5.5 inline-flex items-center gap-1.5 rounded-md border ${stateData.class} px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider transition-all"
        title="Click to cycle status"
      >
        <i
          class="${iconClass} text-[10px] lg:text-xs pb-px transition-transform duration-300"
        ></i>
        <span>${stateData.name}</span>
      </div>
    `;
  },

  _getMoodBadgeHtml(moodValue, logId) {
    const matched = MOOD_OPTIONS.find(
      (m) => String(m.value) === String(moodValue),
    );
    const moodData = matched || {
      label: moodValue || "Neutral",
      icon: "ti ti-mood-empty text-secondary",
      class: "bg-surface text-secondary border-border/60",
    };

    const iconClass = this._normalizeIconClass(moodData.icon);

    return `
      <div
        data-log-id="${logId}"
        data-current-mood="${moodData.value || moodValue}"
        class="mood-cycle min-h-5.5 inline-flex items-center gap-1 rounded-md border ${moodData.class} px-2 py-0.5 text-[10px] uppercase font-semibold transition-all"
      >
        <i
          class="${iconClass} text-[10px] lg:text-xs pb-px transition-transform duration-300"
        ></i>
        <span>${moodData.label}</span>
      </div>
    `;
  },

  _getEnergyBadgeHtml(energyValue, logId) {
    const matched = ENERGY_LEVEL_OPTIONS.find(
      (e) => Number(e.value) === Number(energyValue),
    );
    const energyData = matched || {
      label: `Energy: ${energyValue}/5`,
      icon: "ti ti-bolt text-secondary",
      class: "bg-surface text-secondary border-border/60",
    };

    const iconClass = this._normalizeIconClass(energyData.icon);

    return `
      <div
        data-log-id="${logId}"
        data-current-energy="${energyValue}"
        class="energy-cycle min-h-5.5 inline-flex items-center gap-1 rounded-md border ${energyData.class} px-2 py-0.5 text-[10px] uppercase font-semibold transition-all"
      >
        <i
          class="${iconClass} text-xs lg:text-sm pb-px transition-transform duration-300"
        ></i>
        <span>${energyData.label}</span>
      </div>
    `;
  },

  _calculateObjectiveProgress(obj) {
    if (obj.completed) return 100;
    const type = obj.type || "boolean";
    if (type === "numeric") {
      const target = Number(obj.targetValue) || 1;
      const current = Number(obj.currentValue) || 0;
      return Math.min(100, Math.max(0, Math.round((current / target) * 100)));
    }
    return obj.completed ? 100 : 0;
  },

  initTabSwitcher() {
    const switcher = document.getElementById("entity-tab-switcher");
    if (!switcher) return;

    const buttons = switcher.querySelectorAll(".entity-tab-btn");
    const indicator = document.getElementById("entity-tab-indicator");

    const updateTabState = (activeBtn) => {
      if (!activeBtn) return;

      // Update indicator position and width dynamically
      if (indicator) {
        indicator.style.left = `${activeBtn.offsetLeft}px`;
        indicator.style.width = `${activeBtn.offsetWidth}px`;
      }

      // Update button text color states
      buttons.forEach((btn) => {
        if (btn === activeBtn) {
          btn.classList.remove("text-secondary");
          btn.classList.add("text-white");
        } else {
          btn.classList.remove("text-white");
          btn.classList.add("text-secondary");
        }
      });

      // Show target panel and hide others
      const targetTab = activeBtn.dataset.entityTab;
      document.querySelectorAll(".entity-panel").forEach((panel) => {
        if (panel.id === `tab-panel-${targetTab}`) {
          panel.classList.remove("hidden");
        } else {
          panel.classList.add("hidden");
        }
      });
    };

    // Attach click handlers
    buttons.forEach((btn) => {
      btn.addEventListener("click", () => updateTabState(btn));
    });

    // Initialize position for active tab on render
    const initialActiveBtn = switcher.querySelector(
      '.entity-tab-btn[data-entity-tab="plans"]',
    );
    if (initialActiveBtn) {
      updateTabState(initialActiveBtn);
    }
  },

  renderPlansList(plans) {
    const currentEmpty = emptyStateConfig["plans"];

    if (!Array.isArray(plans) || plans.length === 0) {
      return `<div
        class="min-h-72 bg-surface border border-dashed border-border rounded-2xl p-12 text-center flex flex-col items-center justify-center"
      >
        <div class="text-5xl mb-4 text-brand/70">${currentEmpty.icon}</div>
        <h2 class="text-xl font-bold text-color">${currentEmpty.title}</h2>
        <p class="mt-2 text-sm text-secondary max-w-sm mx-auto">
          ${currentEmpty.description}
        </p>
      </div>`;
    }
    return plans
      .map((plan) => {
        const lifeAreaBadge = this._getLifeAreaBadgeHtml(plan.lifeAreaId);
        const stateBadge = this._getStateBadgeHtml(plan.state, plan.id);

        const objectives = Array.isArray(plan.objectives)
          ? plan.objectives
          : [];
        const totalObjectives = objectives.length;
        const hasObjectives = totalObjectives > 0;

        let progressHtml = "";

        if (hasObjectives) {
          const completedObjs = objectives.filter((o) => o.completed).length;
          const totalProgressAcc = objectives.reduce((sum, obj) => {
            return sum + this._calculateObjectiveProgress(obj);
          }, 0);

          const progressPercentage = Math.round(
            totalProgressAcc / totalObjectives,
          );

          const objectiveProgressColor =
            progressPercentage === 100
              ? "bg-emerald-500/80"
              : progressPercentage <= 65 && progressPercentage >= 35
                ? "bg-yellow-500/80"
                : progressPercentage <= 35 && progressPercentage > 0
                  ? "bg-red-500/80"
                  : "bg-slate-500/80";

          const objectivePercentColor =
            progressPercentage === 100
              ? "text-emerald-500/80"
              : progressPercentage <= 65 && progressPercentage >= 35
                ? "text-yellow-500/80"
                : progressPercentage <= 35 && progressPercentage > 0
                  ? "text-red-500/80"
                  : "text-slate-500/80";

          progressHtml = `
            <div class="w-full sm:w-56 shrink-0 flex flex-col justify-center">
              <div class="flex justify-between text-[10px] sm:text-xs mb-1">
                <span class="text-secondary font-medium font-sans"
                  >Objectives Progress</span
                >
                <span class="font-bold font-sans ${objectivePercentColor}"
                  >${completedObjs}/${totalObjectives}
                  (${progressPercentage}%)</span
                >
              </div>
              <div
                class="w-full h-1.5 bg-surface-2 rounded-full overflow-hidden border border-border/30"
              >
                <div
                  class="h-full ${objectiveProgressColor} transition-all duration-300 rounded-full"
                  style="width: ${progressPercentage}%"
                ></div>
              </div>
            </div>
          `;
        } else {
          progressHtml = `
            <div class="shrink-0 flex items-center">
              <span
                class="inline-flex items-center gap-1 rounded-md border border-border/40 bg-surface px-2.5 py-1 text-[11px] font-medium text-secondary/60"
              >
                <i class="ti ti-square text-xs pb-1"></i> No
                Objectives
              </span>
            </div>
          `;
        }

        return `
          <div
            class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl bg-surface/70 border border-border/50 hover:bg-surface transition group shadow-2xs"
          >
            <div class="min-w-0 flex-1">
              <div class="flex flex-wrap items-center gap-2 mb-1.5">
                ${stateBadge} ${lifeAreaBadge}
                <span class="text-[11px] text-secondary/70"
                  >ID: ${plan.id || "N/A"}</span
                >
              </div>
              <h5
                class="text-sm font-bold text-color group-hover:text-brand transition-colors truncate"
              >
                ${plan.title}
              </h5>
              <p
                class="text-xs text-secondary/90 line-clamp-1 mt-0.5 font-normal"
              >
                ${plan.description || "No execution description provided."}
              </p>
            </div>

            <div class="divider flex sm:hidden bg-surface-2 w-full h-px mt-2"></div>

            ${progressHtml}
          </div>
        `;
      })
      .join("");
  },

  renderLogsList(logs) {
    const currentEmpty = emptyStateConfig["logs"];

    if (!Array.isArray(logs) || logs.length === 0) {
      return `<div
        class="min-h-72 bg-surface border border-dashed border-border rounded-2xl p-12 text-center flex flex-col items-center justify-center"
      >
        <div class="text-5xl mb-4 text-brand/70">${currentEmpty.icon}</div>
        <h2 class="text-xl font-bold text-color">${currentEmpty.title}</h2>
        <p class="mt-2 text-sm text-secondary max-w-sm mx-auto">
          ${currentEmpty.description}
        </p>
      </div>`;
    }
    return logs
      .map((log) => {
        const moodBadge = this._getMoodBadgeHtml(log.mood, log.id);
        const energyBadge = this._getEnergyBadgeHtml(log.energy, log.id);

        let linkedPlanBadgeHtml = "";
        let lifeAreaBadgeHtml = "";

        if (log.planId) {
          const plans = StateManager.getPlans() || [];
          const linkedPlan = plans.find(
            (p) => String(p.id) === String(log.planId),
          );

          if (linkedPlan) {
            linkedPlanBadgeHtml = `
                  <span
                    class="min-h-5.5 inline-flex items-center gap-1 rounded-md border border-brand/30 bg-brand/10 px-2 py-0.5 text-[10px] font-semibold text-brand/90"
                  >
                    <i class="ti ti-target text-[10px] lg:text-xs pb-px"></i>
                    <span>${linkedPlan.title}</span>
                  </span>
                `;

            if (linkedPlan.lifeAreaId) {
              lifeAreaBadgeHtml = this._getLifeAreaBadgeHtml(
                linkedPlan.lifeAreaId,
              );
            }
          }
        }

        return `
          <div
            class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl bg-surface/70 border border-border/50 hover:bg-surface transition group shadow-2xs"
          >
            <div class="min-w-0 flex-1">
              <div class="flex flex-wrap items-center gap-2 mb-1.5">
                ${moodBadge} 
                
                ${energyBadge}

                <span
                  class="min-h-5.5 inline-flex items-center gap-1 rounded-md border border-secondary/30 bg-secondary/10 px-2 py-0.5 text-[10px] font-medium text-secondary/80"
                >
                  <i class="ti ti-calendar text-[10px] lg:text-xs pb-px"></i> ${log.date || log.createdAt}
                </span>

                ${linkedPlanBadgeHtml}
                ${lifeAreaBadgeHtml}
              </div>
              <h5
                class="text-sm font-bold text-color group-hover:text-sky-500 transition-colors truncate"
              >
                ${log.title || "Untitled Log"}
              </h5>
              <p
                class="block lg:hidden w-45 sm:w-65 md:w-85 text-xs text-secondary/90 truncate mt-0.5 font-normal cursor-pointer"
                data-tooltip-title="${log.description}"
              >
                ${log.description || "No specific reflections added."}
              </p>
              <p
                class="hidden lg:block text-xs text-secondary/90 mt-0.5 font-normal"
              >
                ${log.description || "No specific reflections added."}
              </p>
            </div>
            <div class="text-left shrink-0 text-[8px] xs:text-[9px] sm:text-xs text-secondary font-medium">
              <span
                class="bg-surface px-2.5 py-1 rounded-lg border border-border/40 flex font-sans"
                >ID: ${log.id || "N/A"}</span
              >
            </div>
          </div>
        `;
      })
      .join("");
  },

  renderTemplatesList(templates) {
    const currentEmpty = emptyStateConfig["templates"];

    if (!Array.isArray(templates) || templates.length === 0) {
      return `<div
        class="min-h-72 bg-surface border border-dashed border-border rounded-2xl p-12 text-center flex flex-col items-center justify-center"
      >
        <div class="text-5xl mb-4 text-brand/70">${currentEmpty.icon}</div>
        <h2 class="text-xl font-bold text-color">${currentEmpty.title}</h2>
        <p class="mt-2 text-sm text-secondary max-w-sm mx-auto">
          ${currentEmpty.description}
        </p>
      </div>`;
    }

    return templates
      .map((tpl) => {
        const lifeAreaBadge = this._getLifeAreaBadgeHtml(tpl.lifeAreaId);

        return `
          <div
            class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl bg-surface/70 border border-border/50 hover:bg-surface transition group shadow-2xs"
          >
            <div class="min-w-0 flex-1">
              <div class="flex flex-wrap items-center gap-2 mb-1.5">
                ${lifeAreaBadge}
                ${
                  tpl.isFavorite
                    ? `<span
                        class="min-h-5.5 inline-flex items-center gap-1 rounded-md border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-[10px] font-semibold text-amber-400 uppercase tracking-wider"
                      >
                        <i class="ti ti-star-filled text-[10px] lg:text-xs pb-px"></i> Favorite
                      </span>`
                    : ""
                }
              </div>
              <h5
                class="text-sm font-bold text-color group-hover:text-violet-500 transition-colors truncate"
              >
                ${tpl.title}
              </h5>
              <p
                class="text-xs text-secondary/90 line-clamp-1 mt-0.5 font-normal"
              >
                ${tpl.description || "No baseline configuration details."}
              </p>
            </div>
            <div class="text-right shrink-0">
              <span
                class="text-xs text-secondary bg-surface px-2.5 py-1 rounded-lg border border-border/40 font-medium block font-sans"
                >Used ${tpl.usageCount || 0} times</span
              >
            </div>
          </div>
        `;
      })
      .join("");
  },
};
