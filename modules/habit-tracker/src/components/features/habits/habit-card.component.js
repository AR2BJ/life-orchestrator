import { CATEGORY_OPTIONS, FREQUENCY_OPTIONS } from "@/utils/constants/habit-options.constants";
import {
  calculateStreak,
  getWeeklyCompletionCount,
  todayISO,
} from "@/utils/helpers.js";

import { HabitCalendarComponent } from "./habit-calendar.component";

export const HabitCardComponent = {
  _normalizeIconClass(iconString) {
    if (!iconString) return "ti ti-folder";
    return iconString;
  },

  _getCategoryBadgeHtml(categoryValue) {
    const matched = CATEGORY_OPTIONS.find((p) => p.value === categoryValue);
    const categoryData = matched || {
      value: categoryValue || "general",
      icon: "ti ti-circle text-secondary",
      class: "bg-surface text-secondary border-border/60",
    };

    const iconClass = this._normalizeIconClass(categoryData.icon);

    return `<span
      class="category-badge min-h-5.5 inline-flex items-center gap-1 rounded-md border ${categoryData.class} px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider"
      title="category badge"
    >
      <i class="${iconClass} text-[10px] lg:text-xs pb-px"></i>
      <span>${categoryData.title}</span>
    </span>`;
  },

  _getFrequencyBadgeHtml(frequencyValue) {
    const matched = FREQUENCY_OPTIONS.find((f) => f.value === frequencyValue);
    const frequencyData = matched || {
      value: frequencyValue || 1,
      icon: "ti ti-circle text-secondary",
      class: "bg-surface text-secondary border-border/60",
    };

    const iconClass = this._normalizeIconClass(frequencyData.icon);

    return `<span
      class="frequency-badge min-h-5.5 inline-flex items-center gap-1 rounded-md border ${frequencyData.class} px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider"
      title="frequency badge"
    >
      <i class="${iconClass} text-[10px] lg:text-xs pb-px"></i>
      <span>${frequencyData.title}</span>
    </span>`;
  },

  render(habit) {
    const categoryBadge = HabitCardComponent._getCategoryBadgeHtml(
      habit.category,
    );
    const frequencyBadge = HabitCardComponent._getFrequencyBadgeHtml(
      habit.frequency,
    );

    const { current, best } = calculateStreak(
      habit.completedDates,
      habit.skippedDates || [],
    );
    const completedToday = habit.completedDates.includes(todayISO());
    const totalChecks = habit.completedDates.length;
    const isHabitArchived = habit.archived;

    const weeklyChecks = getWeeklyCompletionCount(habit.completedDates);
    const targetFrequency = habit.frequency ?? 7;

    const isGoalMet = weeklyChecks >= targetFrequency;
    const isGoalOverflow = weeklyChecks > targetFrequency;

    let goalIcon = "ti-target-arrow text-pink-500/80";
    let goalLabelColor = "text-secondary";

    if (isGoalMet) {
      goalIcon = "ti-circle-check text-brand/80";
      goalLabelColor = "text-brand/80 dark:text-brand/80";
    }

    if (isGoalOverflow) {
      goalIcon = "ti-bolt text-lime-500/80";
      goalLabelColor = "text-lime-600/80 dark:text-lime-400/80";
    }

    const actionButtonClass = isHabitArchived
      ? "restore-btn hover:bg-emerald-600/10"
      : "archive-btn hover:bg-yellow-600/10";
    const actionTooltip = isHabitArchived ? "Restore" : "Archive";
    const actionIcon = isHabitArchived
      ? "ti-rotate -rotate-180 text-emerald-500/80"
      : "ti-archive text-amber-500/80";

    const checkTooltip = completedToday ? "Uncheck Today" : "Check Today";

    return `
      <div
        data-id="${habit.id}"
        class="habit-card group relative flex flex-col gap-4 p-3 md:p-4 rounded-xl bg-surface-2/40 hover:bg-surface-2/60 transition-all"
      >
        <div
          class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
        >
          <div
            class="flex flex-wrap sm:flex-nowrap justify-start items-start gap-3 min-w-0 flex-1"
          >
            <div class="relative shrink-0">
              ${
                isHabitArchived
                  ? ""
                  : `
                  <button
                    data-id="${habit.id}"
                    class="toggle-btn w-9 h-9 rounded-lg border-2 flex items-center justify-center transition peer hover:cursor-pointer ${
                      completedToday
                        ? "bg-brand/80 border-brand/80 text-(--color-btn-primary-text) shadow-lg shadow-brand/20"
                        : "border-border text-secondary hover:border-brand/80 hover:text-brand/80"
                    }"
                  >
                    <i class="ti ${completedToday ? "ti-check text-base md:text-xl font-bold" : "ti-square text-sm"}"></i>
                  </button>
                `
              }
              <div
                class="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-2 py-1 rounded bg-surface-2 text-xs text-color opacity-0 cursor-default peer-hover:opacity-100 transition z-10 whitespace-nowrap pointer-events-none border border-border/60"
              >
                ${checkTooltip}
              </div>
            </div>

            <div class="flex flex-col min-w-0 w-full">
              <div class="flex items-center gap-1.5 flex-wrap">
                ${categoryBadge} ${frequencyBadge}
                <span
                  class="w-fit min-h-5.5 inline-flex items-center gap-1 rounded-md border border-secondary/30 bg-secondary/10 px-2 py-0.5 text-[10px] font-medium text-secondary/80"
                >
                  <i class="ti ti-calendar text-[10px] lg:text-xs pb-px"></i>
                  <span>${habit.createdAt}</span>
                </span>
              </div>
              <h2
                class="mt-2 text-sm md:text-base font-bold text-color tracking-tight leading-snug wrap-break-word"
              >
                ${habit.name}
              </h2>
            </div>
          </div>

          <div
            class="flex flex-row justify-end items-center self-start gap-4 w-full md:w-auto"
          >
            <div
              class="grid grid-cols-2 md:grid-cols-4 gap-1 w-full md:w-auto md:flex md:items-center md:gap-5 bg-surface-2/40 md:bg-transparent p-2 md:p-0 rounded-lg border border-border/40 md:border-0"
            >
              <div
                class="flex flex-col items-center px-1 border-r border-border/40 md:border-0"
              >
                <span
                  class="text-[9px] md:text-xs font-semibold text-secondary uppercase tracking-wider"
                  >Current</span
                >
                <span
                  class="text-xs md:text-sm font-bold text-color flex items-center gap-1 mt-0.5"
                >
                  <i
                    class="ti ti-flame text-orange-500/80 text-[10px] md:text-sm pe-0.5"
                  ></i>
                  <span>${current}d</span>
                </span>
              </div>
              <div
                class="flex flex-col items-center px-1 border-r border-border/40 md:border-0"
              >
                <span
                  class="text-[9px] md:text-xs font-semibold text-secondary uppercase tracking-wider"
                  >Best</span
                >
                <span
                  class="text-xs md:text-sm font-bold text-color flex items-center gap-1 mt-0.5"
                >
                  <i
                    class="ti ti-crown text-yellow-500/80 text-[10px] md:text-sm pe-0.5"
                  ></i>
                  <span>${best}d</span>
                </span>
              </div>
              <div class="flex flex-col items-center px-1">
                <span
                  class="text-[9px] md:text-xs font-semibold text-secondary uppercase tracking-wider ${goalLabelColor}"
                  >This Wk</span
                >
                <span
                  class="text-xs md:text-sm font-bold text-color flex items-center gap-1 mt-0.5"
                >
                  <i
                    class="ti ${goalIcon} text-[10px] md:text-sm pe-0.5"
                  ></i>
                  <span
                    class="${
                      isGoalOverflow
                        ? "text-lime-500/80"
                        : isGoalMet
                          ? "text-brand/80"
                          : "text-color"
                    }"
                    >${weeklyChecks}/${targetFrequency}</span
                  >
                </span>
              </div>
              <div class="flex flex-col items-center px-1">
                <span
                  class="text-[9px] md:text-xs font-semibold text-secondary uppercase tracking-wider"
                  >Total</span
                >
                <span
                  class="text-xs md:text-sm font-bold text-color flex items-center gap-1 mt-0.5"
                >
                  <i
                    class="ti ti-chart-line text-teal-500/80 text-[10px] md:text-sm pe-0.5"
                  ></i>
                  <span>${totalChecks}</span>
                </span>
              </div>
            </div>

            <div class="separator hidden md:flex w-px h-8 bg-border/50"></div>

            <div
              class="absolute top-4 right-4 md:static md:top-auto md:right-auto z-20 shrink-0"
            >
              <div class="hidden md:flex items-center gap-2">
                <div class="relative">
                  <button
                    data-id="${habit.id}"
                    class="${actionButtonClass} w-9 h-9 rounded-lg bg-surface-2 border border-border flex items-center justify-center hover:cursor-pointer peer transition"
                  >
                    <i class="ti ${actionIcon} text-base md:text-lg"></i>
                  </button>
                  <div
                    class="absolute top-full left-1/2 -translate-x-1/2 mt-1 px-2 py-1 rounded bg-surface-2 text-xs text-color opacity-0 cursor-default peer-hover:opacity-100 transition z-10"
                  >
                    ${actionTooltip}
                  </div>
                </div>

                <div class="relative">
                  <button
                    data-id="${habit.id}"
                    class="edit-btn w-9 h-9 rounded-lg bg-surface-2 hover:bg-blue-600/10 border border-border flex items-center justify-center hover:cursor-pointer peer transition"
                  >
                    <i
                      class="ti ti-edit-circle text-blue-500/80 text-base md:text-lg"
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
                    data-id="${habit.id}"
                    class="delete-btn w-9 h-9 rounded-lg bg-surface-2 hover:bg-red-600/10 border border-border flex items-center justify-center hover:cursor-pointer peer transition"
                  >
                    <i
                      class="ti ti-trash text-red-500/80  text-base md:text-lg"
                    ></i>
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
                  data-id="${habit.id}"
                  class="dropdown-toggle-btn h-9 w-9 rounded-lg border border-border text-secondary hover:text-color hover:bg-surface flex items-center justify-center transition shadow-sm cursor-pointer"
                >
                  <i class="ti ti-dots-vertical text-lg"></i>
                </button>

                <div
                  data-id="${habit.id}"
                  class="dropdown-menu absolute right-0 mt-1.5 w-45 rounded-xl border border-border bg-surface p-1 shadow-xl hidden z-30 flex-col gap-0.5"
                >
                  <button
                    data-id="${habit.id}"
                    class="${
                      isHabitArchived ? "restore-btn" : "archive-btn"
                    } flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-left text-xs font-medium border-0 bg-transparent text-secondary hover:text-color hover:bg-surface-2 transition cursor-pointer"
                  >
                    <i class="ti ${actionIcon} text-xs"></i>
                    <span
                      >${
                        isHabitArchived ? "Restore Habit" : "Archive Habit"
                      }</span
                    >
                  </button>

                  <button
                    data-id="${habit.id}"
                    class="edit-btn flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-left text-xs font-medium border-0 bg-transparent text-secondary hover:text-color hover:bg-surface-2 transition cursor-pointer"
                  >
                    <i class="ti ti-edit-circle text-xs text-blue-500/80"></i>
                    <span>Edit Title</span>
                  </button>

                  <div class="my-0.5 border-t border-border/40"></div>

                  <button
                    data-id="${habit.id}"
                    class="delete-btn flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-left text-xs font-medium border-0 bg-transparent text-red-500/80 hover:bg-red-500/5 transition cursor-pointer"
                  >
                    <i class="ti ti-trash text-xs"></i>
                    <span>Delete Permanently</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="overflow-x-auto pt-1 scrollbar-thin">
          ${HabitCalendarComponent.render(
            habit.completedDates,
            habit.id,
            habit.createdAt,
            habit.archived,
            habit.skippedDates || [],
          )}
        </div>
      </div>
    `;
  },
};
