import {
  CURRENCY_OPTIONS,
  ENERGY_LEVEL_OPTIONS,
  LIFE_AREAS,
  MOOD_OPTIONS,
  PLAN_STATES,
} from "@/utils/constants/options-value.constants.js";
import { formatNumberWithCommas, openObjectivesState } from "@/utils/helpers";

import { StateManager } from "@/models/state.model.js";

export const PlannerItemComponent = {
  // --- HELPERS ---
  _normalizeIconClass(iconString) {
    if (!iconString) return "fa-regular fa-folder";
    return iconString.includes("fa-solid")
      ? iconString.replace("fa-solid", "fa-regular")
      : iconString;
  },

  _getLifeAreaBadgeHtml(lifeAreaId) {
    const matched = LIFE_AREAS.find(
      (area) => String(area.id) === String(lifeAreaId),
    );
    const areaData = matched || {
      name: lifeAreaId || "General",
      icon: "fa-regular fa-folder text-secondary",
      class: "bg-surface text-secondary border-border/60",
    };

    const iconClass = this._normalizeIconClass(areaData.icon);

    return `
      <span
        class="inline-flex items-center gap-1 rounded-md border ${areaData.class} px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider"
      >
        <i class="${iconClass} text-[9px]"></i>
        <span>${areaData.name}</span>
      </span>
    `;
  },

  _getStateBadgeHtml(stateKey, planId) {
    const matched = PLAN_STATES.find((s) => s.id === stateKey);
    const stateData = matched || {
      name: stateKey || "active",
      icon: "fa-regular fa-circle text-secondary",
      class: "bg-surface text-secondary border-border/60",
    };

    const iconClass = this._normalizeIconClass(stateData.icon);

    return `
      <button
        type="button"
        data-plan-id="${planId}"
        data-current-state="${stateData.id}"
        class="state-cycle-btn inline-flex items-center gap-1.5 rounded-md border ${stateData.class} px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider cursor-pointer hover:opacity-80 active:scale-95 transition-all select-none"
        title="Click to cycle status"
      >
        <i
          class="${iconClass} text-[10px] transition-transform duration-300"
        ></i>
        <span>${stateData.name}</span>
      </button>
    `;
  },

  _getMoodBadgeHtml(moodValue, logId) {
    const matched = MOOD_OPTIONS.find(
      (m) => String(m.value) === String(moodValue),
    );
    const moodData = matched || {
      label: moodValue || "Neutral",
      icon: "fa-regular fa-face-meh text-secondary",
      class: "bg-surface text-secondary border-border/60",
    };

    const iconClass = this._normalizeIconClass(moodData.icon);

    return `
      <button
        type="button"
        data-log-id="${logId}"
        data-current-mood="${moodData.value || moodValue}"
        class="mood-cycle-btn inline-flex items-center gap-1 rounded-md border ${moodData.class} px-2 py-0.5 text-[10px] uppercase font-semibold cursor-pointer hover:opacity-80 active:scale-95 transition-all select-none"
        title="Click to cycle mood"
      >
        <i
          class="${iconClass} text-[9px] transition-transform duration-300"
        ></i>
        <span>${moodData.label}</span>
      </button>
    `;
  },

  _getEnergyBadgeHtml(energyValue, logId) {
    const matched = ENERGY_LEVEL_OPTIONS.find(
      (e) => Number(e.value) === Number(energyValue),
    );
    const energyData = matched || {
      label: `Energy: ${energyValue}/5`,
      icon: "fa-regular fa-bolt text-secondary",
      class: "bg-surface text-secondary border-border/60",
    };

    const iconClass = this._normalizeIconClass(energyData.icon);

    return `
      <button
        type="button"
        data-log-id="${logId}"
        data-current-energy="${energyValue}"
        class="energy-cycle-btn inline-flex items-center gap-1 rounded-md border ${energyData.class} px-2 py-0.5 text-[10px] uppercase font-semibold cursor-pointer hover:opacity-80 active:scale-95 transition-all select-none"
        title="Click to cycle energy level"
      >
        <i
          class="${iconClass} text-[9px] transition-transform duration-300"
        ></i>
        <span>${energyData.label}</span>
      </button>
    `;
  },

  _renderMetricsHtml(logId, metrics) {
    if (!metrics || typeof metrics !== "object") return "";
    const keys = Object.keys(metrics);
    if (keys.length === 0) return "";

    const INITIAL_VISIBLE_COUNT = 4;
    const hasMore = keys.length > INITIAL_VISIBLE_COUNT;
    const initialKeys = keys.slice(0, INITIAL_VISIBLE_COUNT);
    const hiddenKeys = keys.slice(INITIAL_VISIBLE_COUNT);

    const renderCard = (key) => {
      const item = metrics[key];
      const val = typeof item === "object" ? item.value : item;
      const unit = typeof item === "object" ? item.unit || "" : "";

      const currentCurrency =
        localStorage.getItem("preferred_currency") || "USD";
      const currencyObj = CURRENCY_OPTIONS.find(
        (c) => c.value === currentCurrency,
      ) || { symbol: "$", position: "left" };

      const formattedVal =
        unit === "currency" ? formatNumberWithCommas(val) : val;

      const displayUnit = unit === "currency" ? currencyObj.symbol : unit;
      const isSymbolLeft =
        unit === "currency" && currencyObj.position === "left";

      return `
        <div
          class="group/metric relative flex flex-col justify-between p-2.5 rounded-xl bg-surface/50 hover:bg-surface border border-border/40 hover:border-brand/40 transition-all duration-200 shadow-xs"
        >
          <div class="flex items-center justify-between gap-1 mb-1">
            <span
              class="text-[10px] font-bold uppercase tracking-wider text-secondary/70 truncate group-hover/metric:text-brand/90 transition-colors"
            >
              ${key}
            </span>
            <div
              class="w-1.5 h-1.5 rounded-full bg-brand/30 group-hover/metric:bg-brand transition-colors shrink-0"
            ></div>
          </div>
          <div class="flex items-baseline gap-1 min-w-0">
            ${
              isSymbolLeft
                ? `<span class="text-[10px] font-semibold text-secondary/80 truncate">${displayUnit}</span>`
                : ""
            }
            <span
              class="text-sm font-extrabold text-color tracking-tight truncate"
              >${formattedVal}</span
            >
            ${
              !isSymbolLeft
                ? `<span class="text-[10px] font-semibold text-secondary/80 truncate">${displayUnit}</span>`
                : ""
            }
          </div>
        </div>
      `;
    };

    return `
      <div class="w-full mt-2 pt-3 border-t border-border/60">
        <div class="flex items-center justify-between mb-2">
          <span
            class="text-[11px] font-bold text-secondary uppercase tracking-widest flex items-center gap-1.5"
          >
            <i class="fa-regular fa-chart-simple text-brand/80"></i> Metrics
            (${keys.length})
          </span>
        </div>

        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
          ${initialKeys.map((key) => renderCard(key)).join("")}
        </div>

        ${
          hasMore
            ? `
                <div class="mt-2">
                  <button
                    type="button"
                    data-log-id="${logId}"
                    class="toggle-metrics-btn text-xs font-semibold text-brand/80 hover:text-brand flex items-center gap-1.5 cursor-pointer select-none py-1 transition group/m-btn"
                  >
                    <span class="btn-label"
                      >Show ${hiddenKeys.length} more metrics...</span
                    >
                    <i
                      class="fa-regular fa-chevron-down text-xs transition-transform duration-300"
                    ></i>
                  </button>

                  <div
                    id="metrics-dropdown-${logId}"
                    class="hidden grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 mt-2 pt-2 border-t border-dashed border-border/40 animate-slide-down"
                  >
                    ${hiddenKeys.map((key) => renderCard(key)).join("")}
                  </div>
                </div>
              `
            : ""
        }
      </div>
    `;
  },

  _renderActionButtons(data, tab) {
    return `
      <div class="shrink-0">
        <div class="hidden md:flex items-center gap-2">
          ${
            tab === "templates"
              ? `
                    <div class="relative">
                      <button
                        type="button"
                        data-id="${data.id}"
                        class="favorite-btn w-8 h-8 md:w-9 md:h-9 rounded-lg bg-surface-2 hover:bg-amber-600/10 border border-border flex items-center justify-center cursor-pointer transition group"
                        title="Toggle Favorite"
                      >
                        <i
                          class="${
                            data.isFavorite ? "fa-solid" : "fa-regular"
                          } fa-star text-amber-400/80 text-sm md:text-base pointer-events-none transition-all group-hover:text-amber-400/80"
                        ></i>
                      </button>
                      <div
                        class="absolute top-full left-1/2 -translate-x-1/2 mt-1 px-2 py-1 rounded bg-surface-2 text-xs text-color opacity-0 cursor-default peer-hover:opacity-100 transition z-10 whitespace-nowrap pointer-events-none border border-border/60"
                      >
                        Favorite
                      </div>
                    </div>
                  `
              : ""
          }

          <div class="relative">
            <button
              data-id="${data.id}"
              class="edit-btn w-9 h-9 rounded-lg bg-surface-2 hover:bg-blue-600/10 border border-border flex items-center justify-center hover:cursor-pointer peer transition"
            >
              <i
                class="fa-regular fa-pen-to-square text-blue-500/80 text-base"
              ></i>
            </button>
            <div
              class="absolute top-full left-1/2 -translate-x-1/2 mt-1 px-2 py-1 rounded bg-surface-2 text-xs text-color opacity-0 cursor-default peer-hover:opacity-100 transition z-10 whitespace-nowrap pointer-events-none border border-border/60"
            >
              Edit
            </div>
          </div>

          <div class="relative">
            <button
              data-id="${data.id}"
              class="delete-btn w-9 h-9 rounded-lg bg-surface-2 hover:bg-red-600/10 border border-border flex items-center justify-center hover:cursor-pointer peer transition"
            >
              <i class="fa-regular fa-trash-can text-red-500/80 text-base"></i>
            </button>
            <div
              class="absolute top-full left-1/2 -translate-x-1/2 mt-1 px-2 py-1 rounded bg-surface-2 text-xs text-color opacity-0 cursor-default peer-hover:opacity-100 transition z-10 whitespace-nowrap pointer-events-none border border-border/60"
            >
              Delete
            </div>
          </div>
        </div>

        <div class="flex md:hidden relative dropdown-container">
          <button
            data-id="${data.id}"
            class="dropdown-toggle-btn h-8 w-8 rounded-lg border border-border text-secondary hover:text-color hover:bg-surface flex items-center justify-center transition shadow-sm cursor-pointer"
          >
            <i class="fa-regular fa-ellipsis-vertical text-base"></i>
          </button>

          <div
            data-id="${data.id}"
            class="dropdown-menu absolute right-0 mt-1.5 w-45 rounded-xl border border-border bg-surface p-1 shadow-xl hidden z-30 flex-col gap-0.5"
          >
            ${
              tab === "templates"
                ? `
                  <button
                    data-id="${data.id}"
                    class="favorite-btn flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-left text-xs font-medium border-0 bg-transparent text-secondary hover:text-color hover:bg-surface-2 transition cursor-pointer"
                  >
                    <i
                      class="${
                        data.isFavorite ? "fa-solid" : "fa-regular"
                      } fa-star text-xs text-amber-400/80"
                    ></i>
                    <span
                      >${data.isFavorite ? "Remove from" : "Add to"}
                      Favorites</span
                    >
                  </button>
                `
                : ""
            }

            <button
              data-id="${data.id}"
              class="edit-btn flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-left text-xs font-medium border-0 bg-transparent text-secondary hover:text-color hover:bg-surface-2 transition cursor-pointer"
            >
              <i
                class="fa-regular fa-pen-to-square text-xs text-blue-500/80"
              ></i>
              <span>Edit Title</span>
            </button>

            <div class="my-0.5 border-t border-border/40"></div>

            <button
              data-id="${data.id}"
              class="delete-btn flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-left text-xs font-medium border-0 bg-transparent text-red-500/80 hover:bg-red-500/5 transition cursor-pointer"
            >
              <i class="fa-regular fa-trash-can text-xs"></i>
              <span>Delete Permanently</span>
            </button>
          </div>
        </div>
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

  _renderSingleObjectiveControl(planId, obj) {
    const type = obj.type || "boolean";

    if (type === "numeric") {
      return `
        <button
          type="button"
          data-plan-id="${planId}"
          data-objective-id="${obj.id}"
          class="objective-toggle w-6 h-6 shrink-0 rounded-md border-2 flex items-center justify-center transition cursor-pointer ${
            obj.completed
              ? "bg-emerald-500 border-emerald-500 text-(--color-btn-primary-text) shadow-md shadow-emerald-500/20"
              : "border-border text-secondary hover:border-emerald-500/80 hover:text-emerald-500/80"
          }"
        >
          <i
            class="fa-regular ${
              obj.completed
                ? "fa-check text-xs font-bold"
                : "fa-hashtag text-[10px]"
            }"
          ></i>
        </button>
      `;
    }

    if (type === "milestone") {
      return `
        <button
          type="button"
          data-plan-id="${planId}"
          data-objective-id="${obj.id}"
          class="objective-toggle w-6 h-6 shrink-0 rounded-md border-2 flex items-center justify-center transition cursor-pointer ${
            obj.completed
              ? "bg-yellow-500 border-yellow-500 text-(--color-btn-primary-text) shadow-md shadow-yellow-500/20"
              : "border-border text-secondary hover:border-yellow-500/80 hover:text-yellow-500/80"
          }"
        >
          <i
            class="fa-regular ${
              obj.completed
                ? "fa-check text-xs font-bold"
                : "fa-flag text-[10px]"
            }"
          ></i>
        </button>
      `;
    }

    return `
      <button
        type="button"
        data-plan-id="${planId}"
        data-objective-id="${obj.id}"
        class="objective-toggle w-6 h-6 shrink-0 rounded-md border-2 flex items-center justify-center transition cursor-pointer ${
          obj.completed
            ? "bg-cyan-500 border-cyan-500 text-(--color-btn-primary-text) shadow-md shadow-cyan-500/20"
            : "border-border text-secondary hover:border-cyan-500/80 hover:text-cyan-500/80"
        }"
      >
        <i
          class="fa-regular ${
            obj.completed
              ? "fa-check text-xs font-bold"
              : "fa-square text-[10px]"
          }"
        ></i>
      </button>
    `;
  },

  _getCompletionPromptOverlayHtml(planId) {
    return `
      <div
        class="absolute inset-0 z-30 flex items-center justify-center bg-background/60 backdrop-blur-md p-4 transition-all duration-300 animate-fade-in"
      >
        <div
          class="w-full max-w-xs rounded-xl border border-border/80 bg-surface/95 p-4 shadow-2xl text-center space-y-3"
        >
          <div
            class="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500"
          >
            <i class="fa-solid fa-flag-checkered text-base"></i>
          </div>

          <div class="space-y-1">
            <h4 class="text-sm font-bold text-color">Complete Plan Status?</h4>
            <p class="text-xs text-secondary leading-relaxed">
              All objectives are 100% completed. Would you like to set the plan
              status to
              <span class="text-emerald-500 font-bold">COMPLETED</span>?
            </p>
          </div>

          <div class="flex items-center justify-center gap-2 pt-1">
            <button
              type="button"
              data-action="confirm-plan-completion"
              data-plan-id="${planId}"
              class="flex-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 px-3 py-1.5 text-xs font-bold text-white shadow-md active:scale-95 transition-all cursor-pointer"
            >
              Yes
            </button>

            <button
              type="button"
              data-action="decline-plan-completion"
              data-plan-id="${planId}"
              class="flex-1 rounded-lg border border-border/80 bg-surface-2 hover:bg-surface-3 px-3 py-1.5 text-xs font-bold text-secondary hover:text-color active:scale-95 transition-all cursor-pointer"
            >
              No
            </button>
          </div>
        </div>
      </div>
    `;
  },

  // --- MAIN RENDER ROUTER ---
  render(item) {
    if (item.energy !== undefined || item.mood !== undefined) {
      return this.renderLog(item);
    }
    if (item.baseline !== undefined || item.optimal !== undefined) {
      return this.renderTemplate(item);
    }
    return this.renderPlan(item);
  },

  renderPlan(plan) {
    const lifeAreaBadge = this._getLifeAreaBadgeHtml(plan.lifeAreaId);
    const stateBadge = this._getStateBadgeHtml(plan.state, plan.id);

    const objectives = Array.isArray(plan.objectives) ? plan.objectives : [];
    const totalObjectives = objectives.length;
    const hasObjectives = totalObjectives > 0;

    const totalProgressAcc = objectives.reduce((sum, obj) => {
      return sum + this._calculateObjectiveProgress(obj);
    }, 0);

    const progressPercentage =
      totalObjectives > 0 ? Math.round(totalProgressAcc / totalObjectives) : 0;
    const completedObjectives = objectives.filter(
      (obj) => obj.completed || this._calculateObjectiveProgress(obj) === 100,
    ).length;

    const objectiveProgressColor =
      progressPercentage === 100
        ? "bg-emerald-500/80"
        : progressPercentage <= 65 && progressPercentage >= 35
          ? "bg-yellow-500/80"
          : progressPercentage <= 35 && progressPercentage > 0
            ? "bg-red-500/80"
            : progressPercentage === 0
              ? "bg-slate-500/80"
              : "bg-sky-500/80";

    const objectivePercentColor =
      progressPercentage === 100
        ? "text-emerald-500/80"
        : progressPercentage <= 65 && progressPercentage >= 35
          ? "text-yellow-500/80"
          : progressPercentage <= 35 && progressPercentage > 0
            ? "text-red-500/80"
            : progressPercentage === 0
              ? "text-slate-500/80"
              : "text-sky-500/80";

    const isExpanded = openObjectivesState.expandedPlanIds.has(plan.id);
    const isPromptActive = plan.pendingCompletionPrompt === true;

    const startDate = plan.period?.startDate || "";
    const endDate = plan.period?.endDate || "";

    return `
      <div
        data-id="${plan.id}"
        class="plan-item group relative flex flex-col gap-4 p-3 md:p-4 rounded-xl bg-surface-2/40 hover:bg-surface-2/60 transition-all border border-border/40 overflow-hidden"
      >
        ${isPromptActive ? this._getCompletionPromptOverlayHtml(plan.id) : ""}

        <div
          class="flex flex-col gap-4 ${
            isPromptActive
              ? "pointer-events-none filter blur-[2px] select-none"
              : ""
          }"
        >
          <div class="flex items-start justify-between gap-3">
            <div class="flex flex-col min-w-0 w-full gap-1.5 pe-12">
              <div class="flex items-center gap-2 flex-wrap">
                ${stateBadge} 
                
                ${lifeAreaBadge}
              </div>

              <h2
                class="text-sm lg:text-base font-bold mt-2 text-color tracking-tight leading-snug wrap-break-word"
              >
                ${plan.title || "Untitled Plan"}
              </h2>

              ${
                plan.description
                  ? `<p class="text-xs lg:text-sm text-secondary/90 leading-relaxed wrap-break-word">${plan.description}</p>`
                  : ""
              }

              <div
                class="flex flex-col gap-1.5 mt-2 text-[11px] lg:text-xs text-muted"
              >
                <div
                  class="flex flex-col sm:flex-row sm:items-center gap-2 text-secondary/80 mt-0.5"
                >
                  ${
                    startDate
                      ? `<span class="flex items-center gap-1.5"
                          ><i
                            class="fa-regular fa-calendar-check text-emerald-500/80"
                          ></i>
                          Start:
                          <strong class="text-color">${startDate}</strong></span
                        >`
                      : ""
                  }
                  ${
                    endDate
                      ? `<span class="flex items-center gap-1.5 sm:ms-2"
                          ><i
                            class="fa-regular fa-calendar-xmark text-red-500/80"
                          ></i>
                          End:
                          <strong class="text-color">${endDate}</strong></span
                        >`
                      : ""
                  }
                </div>
              </div>
            </div>

            ${this._renderActionButtons(plan, "plans")}
          </div>

          ${
            hasObjectives
              ? `
                  <div class="mt-2 border-t border-border/60 pt-2">
                    <button
                      type="button"
                      data-plan-id="${plan.id}"
                      class="toggle-objectives-btn w-full flex flex-wrap sm:flex-nowrap items-center justify-between gap-5 p-2 rounded-md hover:bg-surface-3/40 transition cursor-pointer group/sub-hdr text-left"
                    >
                      <div
                        class="w-full sm:w-fit flex justify-center xs:justify-start items-center gap-2"
                      >
                        <i
                          class="fa-regular fa-bullseye-arrow text-brand/80"
                        ></i>
                        <span
                          class="text-[11px] sm:text-xs font-bold text-secondary group-hover/sub-hdr:text-color transition"
                        >
                          Objectives (${completedObjectives}/${totalObjectives})
                        </span>
                      </div>

                      <div class="w-full sm:w-fit flex items-center gap-3">
                        <div
                          class="w-full sm:w-32 h-1.5 rounded-full bg-surface-2 overflow-hidden"
                        >
                          <div
                            class="h-full ${objectiveProgressColor} transition-all duration-300"
                            style="width: ${progressPercentage}%"
                          ></div>
                        </div>

                        <span
                          class="text-[11px] font-bold ${objectivePercentColor}"
                          >${progressPercentage}%</span
                        >

                        <div
                          class="objective-chevron w-5 h-5 rounded-md flex items-center justify-center text-secondary group-hover/sub-hdr:text-color transition-transform duration-300 ${
                            isExpanded ? "rotate-180" : ""
                          }"
                        >
                          <i class="fa-regular fa-chevron-down text-xs"></i>
                        </div>
                      </div>
                    </button>

                    <div
                      id="objectives-container-${plan.id}"
                      class="objectives-dropdown-body ${
                        isExpanded ? "" : "hidden"
                      } animate-slide-down space-y-1.5 pt-2 ps-1 pe-1"
                    >
                      ${objectives
                        .map((obj) => {
                          const objProgress =
                            this._calculateObjectiveProgress(obj);
                          const isDone =
                            obj.completed ||
                            (obj.type === "numeric" && objProgress === 100);
                          const type = obj.type || "boolean";

                          const target = Number(obj.targetValue) || 1;
                          const current = Number(obj.currentValue) || 0;

                          const currentCurrency =
                            localStorage.getItem("preferred_currency") || "USD";
                          const currencyObj = CURRENCY_OPTIONS.find(
                            (c) => c.value === currentCurrency,
                          ) || { symbol: "$", position: "left" };

                          const displayUnit =
                            obj.unit === "currency"
                              ? currencyObj.symbol
                              : obj.unit;
                          const isSymbolLeft =
                            obj.unit === "currency" &&
                            currencyObj.position === "left";

                          return `
                            <div
                              class="flex items-center justify-between gap-3 group/st rounded-lg p-2 hover:bg-surface-2/60 border border-transparent hover:border-border/40 transition"
                            >
                              <div
                                class="relative flex flex-row items-center gap-2.5 shrink-0 min-w-0 flex-1"
                              >
                                ${this._renderSingleObjectiveControl(
                                  plan.id,
                                  obj,
                                )}

                                <span
                                  data-plan-id="${plan.id}"
                                  data-objective-id="${obj.id}"
                                  class="objective-toggle text-xs md:text-sm text-color truncate cursor-pointer select-none ${
                                    isDone
                                      ? "line-through opacity-45"
                                      : "font-medium"
                                  }"
                                >
                                  ${obj.title || "Untitled Objective"}
                                </span>
                              </div>

                              <div class="flex items-center gap-2 shrink-0">
                                ${
                                  type === "numeric"
                                    ? `
                                        <div
                                          class="inline-flex items-center rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-0.75 overflow-hidden shadow-xs"
                                        >
                                          ${
                                            isSymbolLeft
                                              ? `<span class="text-emerald-500/80 font-bold mx-1 text-[10px]">${displayUnit}</span>`
                                              : ""
                                          }
                                          <input
                                            class="objective-progress-input ${
                                              obj.unit === "currency"
                                                ? "w-24"
                                                : "w-15"
                                            } h-6 rounded-md bg-surface text-[11px] font-bold text-center text-emerald-400/80 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 transition-all"
                                            type="text"
                                            inputmode="numeric"
                                            id="unit-${obj.unit}-${plan.id}"
                                            data-plan-id="${plan.id}"
                                            data-objective-id="${obj.id}"
                                            data-target="${target}"
                                            data-is-currency="${
                                              obj.unit === "currency"
                                            }"
                                            value="${
                                              obj.unit === "currency"
                                                ? formatNumberWithCommas(
                                                    current,
                                                  )
                                                : current
                                            }"
                                            placeholder="Value"
                                            maxlength="${
                                              obj.unit === "currency"
                                                ? "15"
                                                : "7"
                                            }"
                                            min="1"
                                            pattern="^[0-9]*.?[0-9]*$"
                                          />
                                          ${
                                            obj.unit === "currency" &&
                                            !isSymbolLeft
                                              ? `<span class="text-emerald-500/80 font-bold ms-1 text-[10px]">${displayUnit}</span>`
                                              : ""
                                          }
                                          <div
                                            class="flex items-center gap-2 px-2 text-[10px] font-semibold text-emerald-400/80"
                                          >
                                            <span class="opacity-40">of</span>
                                            <div class="flex items-center">
                                              ${
                                                isSymbolLeft
                                                  ? `<span class="text-emerald-500/80 font-bold me-1">${displayUnit}</span>`
                                                  : ""
                                              }
                                              <span
                                                >${
                                                  obj.unit === "currency"
                                                    ? formatNumberWithCommas(
                                                        target,
                                                      )
                                                    : target
                                                }</span
                                              >
                                              ${
                                                !isSymbolLeft
                                                  ? `<span class="text-emerald-500/80 font-bold ms-1">${displayUnit}</span>`
                                                  : ""
                                              }
                                            </div>
                                          </div>
                                        </div>
                                      `
                                    : ""
                                }
                                ${
                                  type === "milestone"
                                    ? `<span
                                        class="h-8 text-[11px] uppercase font-bold tracking-wider inline-flex items-center rounded-lg px-2.5 overflow-hidden shadow-xs bg-yellow-500/10 text-yellow-400/80 border border-yellow-500/20"
                                        >Milestone</span
                                      >`
                                    : type === "boolean"
                                      ? `<span
                                          class="h-8 text-[11px] uppercase font-bold tracking-wider inline-flex items-center rounded-lg px-2.5 overflow-hidden shadow-xs bg-cyan-500/10 text-cyan-400/80 border border-cyan-500/20"
                                          >Boolean</span
                                        >`
                                      : type === "numeric"
                                        ? `<span
                                            class="h-8 text-[11px] uppercase font-bold tracking-wider inline-flex items-center rounded-lg px-2.5 overflow-hidden shadow-xs bg-emerald-500/10 text-emerald-400/80 border border-emerald-500/20"
                                            >Numeric</span
                                          >`
                                        : ""
                                }
                              </div>
                            </div>
                          `;
                        })
                        .join("")}
                    </div>
                  </div>
                `
              : ""
          }
        </div>
      </div>
    `;
  },

  renderLog(log) {
    const moodBadge = this._getMoodBadgeHtml(log.mood, log.id);
    const energyBadge = this._getEnergyBadgeHtml(log.energy, log.id);
    const metricsHtml = this._renderMetricsHtml(log.id, log.metrics);

    let linkedPlanBadgeHtml = "";
    let lifeAreaBadgeHtml = "";

    if (log.planId) {
      const plans = StateManager.getPlans() || [];
      const linkedPlan = plans.find((p) => String(p.id) === String(log.planId));

      if (linkedPlan) {
        linkedPlanBadgeHtml = `
          <span
            class="inline-flex items-center gap-1 rounded-md border border-brand/30 bg-brand/10 px-2 py-0.5 text-[10px] font-semibold text-brand/90"
          >
            <i class="fa-regular fa-bullseye text-[9px]"></i>
            <span>${linkedPlan.title}</span>
          </span>
        `;

        if (linkedPlan.lifeAreaId) {
          lifeAreaBadgeHtml = this._getLifeAreaBadgeHtml(linkedPlan.lifeAreaId);
        }
      }
    }

    return `
      <div
        data-id="${log.id}"
        class="log-item group relative flex flex-col gap-4 p-3 md:p-4 rounded-xl bg-surface-2/40 hover:bg-surface-2/60 transition-all border border-border/40"
      >
        <div class="flex items-start justify-between gap-4 w-full">
          <div class="flex flex-col min-w-0 w-full gap-1.5">
            <div class="flex items-center gap-2 flex-wrap">
              ${moodBadge} ${energyBadge}

              <span
                class="inline-flex items-center gap-1 rounded-md border border-secondary/30 bg-secondary/10 px-2 py-0.5 text-[10px] font-medium text-secondary/80"
              >
                <i class="fa-regular fa-calendar"></i> ${
                  log.date || log.createdAt
                }
              </span>

              ${linkedPlanBadgeHtml} ${lifeAreaBadgeHtml}
            </div>

            <h2 class="text-base font-bold mt-1 text-color wrap-break-word">
              ${log.title || "Untitled Log"}
            </h2>

            ${
              log.description
                ? `<p class="text-xs text-secondary/90 leading-relaxed wrap-break-word">${log.description}</p>`
                : ""
            }
          </div>

          ${this._renderActionButtons(log, "logs")}
        </div>

        ${metricsHtml}
      </div>
    `;
  },

  renderTemplate(template) {
    const lifeAreaBadge = this._getLifeAreaBadgeHtml(template.lifeAreaId);

    return `
      <div
        data-id="${template.id}"
        class="template-item relative flex flex-col justify-between gap-4 p-3 md:p-4 rounded-2xl bg-surface-2/30 transition-all duration-300 border border-dashed border-border/80 shadow-xs"
      >
        <div class="flex items-start justify-between gap-4 w-full">
          <div class="flex flex-col min-w-0 w-full gap-1.5">
            <div class="flex items-center gap-2 flex-wrap">
              <span
                class="inline-flex items-center gap-1.5 rounded-md border border-violet-500/30 bg-violet-500/10 px-2.5 py-0.5 text-[10px] uppercase font-semibold tracking-wider text-violet-400"
              >
                <i class="fa-regular fa-cubes text-[10px]"></i> Template
              </span>

              ${lifeAreaBadge}
              ${
                template.isFavorite
                  ? `<span
                    class="inline-flex items-center gap-1 rounded-md border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-[10px] font-semibold text-amber-400 uppercase tracking-wider"
                  >
                    <i class="fa-solid fa-star text-[9px]"></i> Favorite
                  </span>`
                  : ""
              }
            </div>
            <h2 class="text-base font-bold mt-1 text-color wrap-break-word">
              ${template.title || "Untitled Template"}
            </h2>

            ${
              template.description
                ? `<p class="text-xs lg:text-sm text-secondary/90 leading-relaxed wrap-break-word">
                      ${template.description}
                    </p>`
                : ""
            }
          </div>

          ${this._renderActionButtons(template, "templates")}
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mt-1">
          ${
            template.baseline
              ? `<div
                  class="relative overflow-hidden rounded-xl bg-surface/80 p-3 border border-border/50 flex flex-col justify-between gap-1 group/base hover:border-slate-400/40 transition-colors"
                >
                  <div
                    class="flex items-center justify-between text-[10px] font-extrabold uppercase tracking-wider text-slate-400"
                  >
                    <span class="flex items-center gap-1.5">
                      <i class="fa-regular fa-gauge-min text-slate-400"></i>
                      Baseline
                    </span>
                    <span
                      class="text-[9px] px-1.5 py-0.5 rounded bg-slate-500/10 text-slate-400 border border-slate-500/20"
                      >Min</span
                    >
                  </div>
                  <span
                    class="text-xs font-semibold text-color/90 mt-1 wrap-break-word leading-snug"
                  >
                    ${template.baseline}
                  </span>
                </div>`
              : ""
          }
          ${
            template.optimal
              ? `<div
                  class="relative overflow-hidden rounded-xl bg-emerald-500/5 p-3 border border-emerald-500/20 flex flex-col justify-between gap-1 group/opt hover:border-emerald-500/40 transition-colors"
                >
                  <div
                    class="flex items-center justify-between text-[10px] font-extrabold uppercase tracking-wider text-emerald-400"
                  >
                    <span class="flex items-center gap-1.5">
                      <i class="fa-regular fa-gauge-max text-emerald-400"></i>
                      Optimal
                    </span>
                    <span
                      class="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                      >Target</span
                    >
                  </div>
                  <span
                    class="text-xs font-semibold text-color mt-1 wrap-break-word leading-snug"
                  >
                    ${template.optimal}
                  </span>
                </div>`
              : ""
          }
        </div>

        <div
          class="pt-3 border-t border-border/50 flex items-center justify-between gap-2"
        >
          <span
            class="text-[11px] font-medium text-muted flex items-center gap-1.5"
          >
            <i class="fa-regular fa-chart-line-up text-brand/80"></i>
            Used
            <strong class="text-color">${template.usageCount || 0}</strong>
            times
          </span>

          <button
            type="button"
            data-id="${template.id}"
            class="use-template-btn inline-flex items-center gap-2 bg-brand hover:bg-brand/90 active:scale-95 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition shadow-md shadow-brand/20 cursor-pointer"
          >
            <i class="fa-regular fa-rocket text-xs pointer-events-none"></i>
            <span>Use Template</span>
          </button>
        </div>
      </div>
    `;
  },
};
