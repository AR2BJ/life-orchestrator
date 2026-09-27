import {
  CATEGORY_OPTIONS,
  FREQUENCY_OPTIONS,
} from "@/utils/constants/habit-options.constants";
import {
  calculateStreak,
  calculateSuccessRate,
  formatDate,
  getWeeklyCompletionCount,
  todayISO,
} from "@/utils/helpers";

export const DashboardComponent = {
  render(habits = []) {
    const todayStr = todayISO();

    const activeHabits = habits.filter((t) => !t.archived);
    const archivedHabits = habits.filter((t) => t.archived);

    const totalHabits = habits.length;
    const activeCount = activeHabits.length;
    const archivedCount = archivedHabits.length;

    const completedToday = habits.filter((habit) =>
      habit.completedDates.includes(todayStr),
    ).length;

    // Calculate streaks
    let maxCurrentStreak = 0;
    let maxBestStreak = 0;
    let totalSuccessRate = 0;

    habits.forEach((habit) => {
      const streak = calculateStreak(
        habit.completedDates,
        habit.skippedDates || [],
      );
      if (streak.current > maxCurrentStreak) maxCurrentStreak = streak.current;
      if (streak.best > maxBestStreak) maxBestStreak = streak.best;
      totalSuccessRate += calculateSuccessRate(habit);
    });

    const averageSuccessRate = habits.length
      ? Math.round(
          habits.reduce((sum, habit) => sum + calculateSuccessRate(habit), 0) /
            habits.length,
        )
      : 0;

    let goalsMetThisWeek = 0;
    let goalsOverflowThisWeek = 0;

    habits.forEach((habit) => {
      const weeklyChecks = getWeeklyCompletionCount(habit.completedDates);
      const targetFrequency = Number(habit.frequency ?? 7);

      if (weeklyChecks > targetFrequency) {
        goalsOverflowThisWeek++;
      }
      if (weeklyChecks >= targetFrequency) {
        goalsMetThisWeek++;
      }
    });

    const weeklyTargetStatus = DashboardComponent.getWeeklyTargetStatus(
      goalsOverflowThisWeek,
    );

    const completionStatus = DashboardComponent.getCompletionStatus(
      completedToday,
      totalHabits,
    );

    const successMessage =
      DashboardComponent.getSuccessRateMessage(averageSuccessRate);

    const archivedStatus = DashboardComponent.getArchivedStatus(archivedCount);

    let weeklyBorderClass = "hover:border-pink-500/30";
    let weeklyIcon = "ti-target-arrow text-pink-500";
    if (goalsOverflowThisWeek > 0) {
      weeklyBorderClass = "hover:border-lime-500/30";
      weeklyIcon = "ti-bolt-filled text-lime-500";
    } else if (goalsOverflowThisWeek === 0 && goalsMetThisWeek > 0) {
      weeklyBorderClass = "hover:border-brand/30";
      weeklyIcon = "ti-circle-check-filled text-brand/80";
    }

    return `
      <div
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full col-span-full"
      >
        <div
          class="col-span-2 md:col-span-1 relative overflow-hidden bg-surface-2 border border-border/70 shadow-sm backdrop-opacity-[0.04] dark:backdrop-opacity-[0.06] hover:-translate-y-1 hover:border-sky-500/30 rounded-2xl p-6 transition-all duration-300 flex flex-col justify-between min-h-36 group"
        >
          <i
            class="ti ti-stack-2-filled absolute -right-4 -bottom-6 text-[12rem] text-sky-500 opacity-[0.04] dark:opacity-[0.06] rotate-20 pointer-events-none group-hover:scale-110 group-hover:rotate-10 transition-transform duration-500"
          ></i>

          <div class="flex flex-col gap-1 z-10">
            <span
              class="text-xs font-bold text-secondary uppercase tracking-wider"
              >Total Habits</span
            >
            <div class="text-4xl font-black text-color tracking-tight mt-2">
              ${totalHabits}
            </div>
            <p class="text-[10px] text-muted font-medium mt-1">
              <span class="text-sky-500/80 font-bold"
                >${totalHabits} active</span
              >
              right now
            </p>
          </div>
        </div>

        <div
          class="col-span-2 md:col-span-1 relative overflow-hidden bg-surface-2 border border-border/70 shadow-sm backdrop-opacity-[0.04] dark:backdrop-opacity-[0.06] hover:-translate-y-1 hover:border-emerald-500/30 rounded-2xl p-6 transition-all duration-300 flex flex-col justify-between min-h-36 group"
        >
          <i
            class="ti ti-calendar-event-filled absolute -right-4 -bottom-6 text-[11rem] text-emerald-500 opacity-[0.04] dark:opacity-[0.06] rotate-15 pointer-events-none group-hover:scale-110 group-hover:rotate-5 transition-transform duration-500"
          ></i>

          <div class="flex flex-col gap-1 z-10">
            <span
              class="text-xs font-bold text-secondary uppercase tracking-wider"
              >Completed Today</span
            >
            <div class="text-4xl font-black text-color tracking-tight mt-2">
              ${completedToday}
            </div>
            <p class="text-[10px] text-muted font-medium mt-1">
              ${completionStatus}
            </p>
          </div>
        </div>

        <div
          class="col-span-2 md:col-span-1 relative overflow-hidden bg-surface-2 border border-border/70 shadow-sm backdrop-opacity-[0.04] dark:backdrop-opacity-[0.06] ${weeklyBorderClass} rounded-2xl p-6 transition-all duration-300 flex flex-col justify-between min-h-36 group"
        >
          <i
            class="ti ${weeklyIcon} absolute -right-2 -bottom-6 text-[11rem] opacity-[0.04] dark:opacity-[0.06] rotate-25 pointer-events-none group-hover:scale-110 group-hover:rotate-15 transition-transform duration-500"
          ></i>

          <div class="flex flex-col gap-1 z-10">
            <span
              class="text-xs font-bold text-secondary uppercase tracking-wider"
              >Weekly Targets</span
            >
            <div class="text-4xl font-black text-color tracking-tight mt-2">
              ${goalsMetThisWeek}<span class="text-sm font-bold text-muted"
                >/${totalHabits}</span
              >
            </div>
            <p class="text-[10px] text-muted font-medium mt-1">
              ${weeklyTargetStatus}
            </p>
          </div>
        </div>

        <div
          class="col-span-2 md:col-span-1 relative overflow-hidden bg-surface-2 border border-border/70 shadow-sm backdrop-opacity-[0.04] dark:backdrop-opacity-[0.06] hover:-translate-y-1 hover:border-orange-500/30 rounded-2xl p-6 transition-all duration-300 flex flex-col justify-between min-h-36 group"
        >
          <i
            class="ti ti-flame-filled absolute -right-2 -bottom-4 text-[11rem] text-orange-500 opacity-[0.04] dark:opacity-[0.06] rotate-12 pointer-events-none group-hover:scale-110 group-hover:rotate-0 transition-transform duration-500"
          ></i>

          <div class="flex flex-col gap-1 z-10">
            <span
              class="text-xs font-bold text-secondary uppercase tracking-wider"
              >Best Streak</span
            >
            <div class="text-4xl font-black text-color tracking-tight mt-2">
              ${maxBestStreak}<span
                class="text-sm font-bold text-secondary ms-0.5"
                >days</span
              >
            </div>
            <p class="text-[10px] text-muted font-medium mt-1">
              current streak is
              <span class="text-orange-500/80 font-bold"
                >${maxCurrentStreak}d</span
              >
            </p>
          </div>
        </div>

        <div
          class="col-span-2 md:col-span-1 relative overflow-hidden bg-surface-2 border border-border/70 shadow-sm backdrop-opacity-[0.04] dark:backdrop-opacity-[0.06] hover:-translate-y-1 hover:border-yellow-500/30 rounded-2xl p-6 transition-all duration-300 flex flex-col justify-between min-h-36 group"
        >
          <i
            class="ti ti-chart-line absolute -right-4 -bottom-6 text-[11rem] text-yellow-500 opacity-[0.04] dark:opacity-[0.06] rotate-18 pointer-events-none group-hover:scale-110 group-hover:rotate-[8deg] transition-transform duration-500"
          ></i>

          <div class="flex flex-col gap-1 z-10">
            <span
              class="text-xs font-bold text-secondary uppercase tracking-wider"
              >Avg Success</span
            >
            <div class="text-4xl font-black text-color tracking-tight mt-2">
              ${averageSuccessRate}%
            </div>
            <p class="text-[10px] text-muted font-medium mt-1">
              ${successMessage}
            </p>
          </div>
        </div>

        <div
          class="col-span-2 md:col-span-1 relative overflow-hidden bg-surface-2 border border-border/70 shadow-sm backdrop-opacity-[0.04] dark:backdrop-opacity-[0.06] hover:-translate-y-1 hover:border-slate-500/30 rounded-2xl p-6 transition-all duration-300 flex flex-col justify-between min-h-36 group"
        >
          <i
            class="ti ti-archive-filled absolute -right-4 -bottom-6 text-[11rem] text-slate-500 opacity-[0.04] dark:opacity-[0.06] rotate-18 pointer-events-none group-hover:scale-110 group-hover:rotate-[8deg] transition-transform duration-500"
          ></i>

          <div class="flex flex-col gap-1 z-10">
            <span
              class="text-xs font-bold text-secondary uppercase tracking-wider"
              >Archived</span
            >
            <div class="text-4xl font-black text-color tracking-tight mt-2">
              ${archivedCount}
            </div>
            <p class="text-[10px] text-muted font-medium mt-1">
              ${archivedStatus}
            </p>
          </div>
        </div>

        <div
          class="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full col-span-2 sm:col-span-full mt-4"
        >
          <div
            class="lg:col-span-2 bg-surface-2 border border-border/70 shadow-sm rounded-2xl p-6 flex flex-col justify-between"
          >
            <div
              class="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between"
            >
              <div>
                <h4
                  class="text-lg font-bold text-color flex items-center gap-2"
                >
                  <i class="ti ti-affiliate text-brand/80 text-xl"></i>
                  Lifetime Activity Grid
                </h4>
                <p class="text-xs text-secondary mt-1">
                  Advanced multi-tier habit density repository mapped by sprint
                  lifecycle.
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
                  class="hidden absolute right-0 top-full mt-2 w-44 rounded-2xl border border-border bg-surface shadow-lg z-20 overflow-hidden"
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
            class="bg-surface-2 border border-border/70 shadow-sm rounded-2xl p-6 flex flex-col justify-between"
          >
            <div>
              <h4 class="text-lg font-bold text-color flex items-center gap-2">
                <i class="ti ti-chart-bar rotate-90 text-brand text-xl"></i>
                Distribution Trends
              </h4>
              <p class="text-xs text-secondary mt-1">
                Analysis of your execution behavior mapped by day of the week.
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
          class="w-full col-span-2 sm:col-span-full mt-4 bg-surface-2 rounded-2xl"
        >
          <div class="col-span-full bg-surface-2 border border-border/70 shadow-sm rounded-2xl p-6 flex flex-col justify-between">
            <div
              class="flex flex-wrap sm:flex-nowrap sm:items-center justify-between gap-2"
            >
              <div>
                <h4
                  class="text-lg font-bold text-color flex items-center gap-2"
                >
                  <i class="ti ti-stack-3 text-brand/80 text-xl"></i>
                  Individual All-Time Analytics
                </h4>
                <p class="text-xs text-secondary/80 mt-1 font-medium">
                  A deep dive into your behavioural consistency and peak
                  performance trends mapped across weekdays.
                </p>
              </div>
              <span
                class="text-xs text-center font-semibold px-2.5 py-1 rounded-lg bg-surface border border-border shadow-sm text-secondary self-center sm:self-auto w-full sm:w-auto"
              >
                ${activeCount} Active Tracked (${archivedCount} Archived)
              </span>
            </div>

            <div class="mt-6 space-y-3">
              ${
                habits.length === 0
                  ? ` <div
                      class="min-h-60 bg-surface border border-dashed border-border rounded-2xl p-16 text-center"
                    >
                      <div class="text-7xl mb-3">
                        <i
                          class="ti ti-package text-brand/60"
                        ></i>
                      </div>
                      <h2 class="text-2xl font-bold text-color">
                        No active habits
                      </h2>
                      <p class="mt-3 text-secondary max-w-sm mx-auto">
                        You're all caught up! Create a new habit to get started.
                      </p>
                    </div>`
                  : `<div class="mt-5 flex flex-col justify-center gap-2">
                    ${habits
                      .map((habit) => {
                        const categoryBadge =
                          DashboardComponent._getCategoryBadgeHtml(
                            habit.category,
                          );
                        const frequencyBadge =
                          DashboardComponent._getFrequencyBadgeHtml(
                            habit.frequency,
                          );

                        const stats = calculateStreak(habit.completedDates);
                        const lifetimeRate = Math.round(
                          calculateSuccessRate(habit),
                        );

                        const weeklyChecks = getWeeklyCompletionCount(
                          habit.completedDates,
                        );
                        const targetFrequency = Number(habit.frequency ?? 7);
                        const isGoalMet = weeklyChecks >= targetFrequency;
                        const isGoalOverflow = weeklyChecks > targetFrequency;

                        const goalStatus = DashboardComponent.getGoalStatus(
                          weeklyChecks,
                          targetFrequency,
                        );
                        const stability =
                          DashboardComponent.getStabilityClassification(
                            lifetimeRate,
                          );

                        const rowBadgeStyle =
                          goalStatus.status === "overachieved"
                            ? "bg-lime-500/10 text-lime-500/80 border-lime-500/30 animate-pulse"
                            : goalStatus.status === "met"
                              ? "bg-brand/10 text-brand/80 border-brand/20"
                              : "bg-surface-2 text-secondary border-border/50";

                        const rowBadgeText = goalStatus.label;
                        const rowBadgeIcon =
                          goalStatus.status === "overachieved"
                            ? `<i class="ti ti-bolt-filled text-lime-500/80 text-[10px] lg:text-xs pb-0.5"></i>`
                            : `<i class="ti ti-target-arrow text-rose-500/80 text-[10px] lg:text-xs pb-0.5"></i>`;

                        const batteryColor = stability.color;
                        const batteryText = stability.label;
                        const badgeStyle = stability.badge;

                        let rateColor = "text-brand/80";
                        if (lifetimeRate === 100)
                          rateColor = "text-emerald-500/80";
                        else if (lifetimeRate < 35)
                          rateColor = "text-red-500/80";
                        else if (lifetimeRate < 65)
                          rateColor = "text-amber-500/80";

                        return `
                          <div
                            class="flex flex-col lg:flex-row lg:items-center justify-between gap-5 group/row bg-surface p-4 rounded-xl border border-border shadow-sm"
                          >
                            <div class="flex items-center gap-3 min-w-0 flex-1">
                              <div class="w-full">
                                <div class="flex flex-wrap items-center gap-2">
                                  ${categoryBadge} ${frequencyBadge}

                                  <span
                                    class="min-h-5.5 inline-flex items-center gap-1.5 rounded-md border ${rowBadgeStyle} px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider"
                                  >
                                    ${rowBadgeIcon
                                      .replace(
                                        "text-rose-500/80",
                                        "text-secondary",
                                      )
                                      .replace("pb-0.5", "pb-px")}
                                    ${rowBadgeText}
                                  </span>

                                  ${
                                    habit.archived
                                      ? `<span class="min-h-5.5 inline-flex items-center gap-1 rounded-md border border-border bg-surface-2 text-secondary px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider">Archived</span>`
                                      : ""
                                  }
                                </div>
                                <div
                                  class="text-sm mt-2 font-bold text-color truncate flex flex-wrap items-center gap-2"
                                >
                                  <span
                                    class="md:hidden truncate cursor-pointer js-tooltip-target"
                                    data-tooltip-title="${habit.name}"
                                    tabindex="0"
                                    role="button"
                                    aria-label="Show habit title"
                                  >
                                    ${habit.name}
                                  </span>
                                  <span class="hidden md:flex">
                                    ${habit.name}
                                  </span>
                                </div>

                                <div
                                  class="text-[11px] text-secondary/70 mt-2 flex flex-wrap items-center gap-x-4 gap-y-1.5 font-medium"
                                >
                                  <span
                                    class="flex flex-row items-center gap-1"
                                  >
                                    <i
                                      class="ti ti-clock text-sky-500/80 text-[10px] lg:text-xs pb-0.5"
                                    ></i>
                                    Since:
                                    <strong class="text-secondary font-semibold"
                                      >${habit.createdAt}</strong
                                    >
                                  </span>
                                  <span
                                    class="flex flex-row items-center gap-1"
                                  >
                                    <i
                                      class="ti ti-category text-amber-500/80 text-[10px] lg:text-xs pb-0.5"
                                    ></i>
                                    Category:
                                    <strong class="text-secondary font-semibold"
                                      >${habit.category}</strong
                                    >
                                  </span>
                                  <span class="inline-flex items-center gap-1">
                                    ${rowBadgeIcon} This Week:
                                    <strong class="text-color font-bold"
                                      >${weeklyChecks}/${targetFrequency}</strong
                                    >
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div
                              class="flex flex-col sm:flex-row sm:justify-between items-center gap-6 lg:gap-8 bg-surface-2 lg:bg-transparent p-4 lg:p-0 rounded-xl border border-border/30 lg:border-0 shadow-sm lg:shadow-none"
                            >
                              <div
                                class="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 gap-4 lg:gap-8 text-center sm:text-left min-w-0"
                              >
                                <div
                                  class="flex flex-col justify-center items-center"
                                >
                                  <div
                                    class="text-[10px] uppercase font-bold text-muted/80 tracking-wider text-nowrap"
                                  >
                                    Current Streak
                                  </div>
                                  <div
                                    class="text-lg sm:text-base font-black text-color mt-0.5 truncate"
                                  >
                                    ${stats.current}d
                                  </div>
                                </div>
                                <div
                                  class="flex flex-col justify-center items-center"
                                >
                                  <div
                                    class="text-[10px] uppercase font-bold text-muted/80 tracking-wider"
                                  >
                                    Best Streak
                                  </div>
                                  <div
                                    class="text-lg sm:text-base font-black text-color mt-0.5 truncate"
                                  >
                                    ${stats.best}d
                                  </div>
                                </div>
                                <div
                                  class="flex flex-col xs:col-span-2 sm:col-span-1 justify-center items-center"
                                >
                                  <div
                                    class="text-[10px] uppercase font-bold text-muted/80 tracking-wider"
                                  >
                                    Lifetime Rate
                                  </div>
                                  <div
                                    class="text-lg sm:text-base font-black ${
                                      lifetimeRate === 100
                                        ? "text-emerald-500/80"
                                        : lifetimeRate < 35
                                          ? "text-red-500/80"
                                          : lifetimeRate < 65
                                            ? "text-amber-500/80"
                                            : "text-brand/80"
                                    } mt-0.5 truncate"
                                  >
                                    ${lifetimeRate}%
                                  </div>
                                </div>
                              </div>

                              <div
                                class="w-full sm:w-44 flex flex-col xs:flex-row items-center justify-between gap-4 border-t sm:border-t-0 border-border/40 pt-3 sm:pt-0"
                              >
                                <div class="w-full space-y-1 min-w-0">
                                  <div
                                    class="flex justify-between items-center text-[11px]"
                                  >
                                    <span class="text-secondary font-medium"
                                      >Stability</span
                                    >
                                    <span class="font-bold text-color"
                                      >${lifetimeRate}%</span
                                    >
                                  </div>
                                  <div
                                    class="w-full h-1.5 bg-surface-3 lg:bg-surface-4 rounded-full overflow-hidden"
                                  >
                                    <div
                                      class="${batteryColor} h-full rounded-full transition-all duration-500"
                                      style="width: ${lifetimeRate}%"
                                    ></div>
                                  </div>
                                </div>
                                <span
                                  class="min-h-5.5 inline-flex text-[10px] font-bold px-2 py-0.5 rounded-md border ${badgeStyle} whitespace-nowrap lg:self-center"
                                  >${batteryText}</span
                                >
                              </div>
                            </div>
                          </div>
                        `;
                      })
                      .join("")}
                  </div>`
              }
            </div>
          </div>
        </div>
      </div>
    `;
  },

  /**
   * Get stability classification based on success rate
   */
  getStabilityClassification(rate) {
    if (rate === 100) {
      return {
        color: "bg-emerald-500/80",
        label: "Perfect",
        badge: "bg-emerald-500/10 text-emerald-500/80 border-emerald-500/20",
      };
    }
    if (rate < 35) {
      return {
        color: "bg-red-500/80",
        label: "Critical",
        badge: "bg-red-500/10 text-red-500/80 border-red-500/20",
      };
    }
    if (rate < 65) {
      return {
        color: "bg-amber-500/80",
        label: "Warning",
        badge: "bg-amber-500/10 text-amber-500/80 border-amber-500/20",
      };
    }
    return {
      color: "bg-brand/80",
      label: "Stable",
      badge: "bg-brand/10 text-brand/80 border-brand/20",
    };
  },

  /**
   * Get goal status classification
   */
  getGoalStatus(weeklyChecks, targetFrequency) {
    const isGoalMet = weeklyChecks >= targetFrequency;
    const isGoalOverflow = weeklyChecks > targetFrequency;

    if (isGoalOverflow) {
      return {
        status: "overachieved",
        label: "Overachieved",
        icon: "ti-bolt text-lime-500/80",
      };
    }
    if (isGoalMet) {
      return {
        status: "met",
        label: "Target Met",
        icon: "ti-circle-check text-brand/80",
      };
    }
    return {
      status: "on-track",
      label: "On Track",
      icon: "ti-target-arrow text-pink-500/80",
    };
  },

  /**
   * Get completion status text
   */
  getCompletionStatus(completedToday, totalHabits) {
    if (totalHabits === 0) return "no habits added yet";
    if (completedToday === totalHabits) {
      return `<span class="text-emerald-500/80 font-bold flex items-center gap-1"><i class="ti ti-sparkles"></i> All caught up!</span>`;
    }
    return `waiting for ${totalHabits - completedToday} more checks`;
  },

  /**
   * Get weekly target status text
   */
  getWeeklyTargetStatus(goalsOverflowThisWeek) {
    if (goalsOverflowThisWeek > 0) {
      return `<span class="text-lime-500/80 font-bold flex items-center gap-1 animate-pulse"><i class="ti ti-flame text-[9px]"></i> ${goalsOverflowThisWeek} Smashed!</span>`;
    }
    return "goals met this week";
  },

  /**
   * Get success rate message
   */
  getSuccessRateMessage(rate) {
    if (rate >= 70) {
      return `<span class="text-yellow-500/80 font-bold">Excellent consistency</span>`;
    }
    return "keep pushing to break 70%";
  },

  /**
   * Get archived status text
   */
  getArchivedStatus(archivedCount) {
    if (archivedCount > 0) {
      return `<span class="text-slate-500/80 font-bold">${archivedCount} habits</span> safely stored`;
    }
    return "workspace is fully active";
  },

  _normalizeIconClass(iconString) {
    if (!iconString) return "ti ti-folder";
    return iconString;
  },

  _getCategoryBadgeHtml(categoryValue) {
    const matched = CATEGORY_OPTIONS.find((c) => c.value === categoryValue);
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
};
