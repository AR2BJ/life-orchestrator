import {
  calculateStreak,
  calculateSuccessRate,
  formatDate,
  getWeeklyCompletionCount,
} from "@/utils/helpers";

export const DashboardComponent = {
  render(habits = []) {
    const todayStr = formatDate(new Date());

    const activeHabits = habits.filter((t) => !t.archived);
    const archivedHabits = habits.filter((t) => t.archived);

    const totalHabits = habits.length;
    const activeCount = activeHabits.length;
    const archivedCount = archivedHabits.length;

    const completedToday = habits.filter((habit) =>
      habit.completedDates.includes(todayStr),
    ).length;

    const current = habits.length
      ? Math.max(
          0,
          ...habits.map((h) => calculateStreak(h.completedDates).current),
        )
      : 0;

    const bestStreak = habits.length
      ? Math.max(
          0,
          ...habits.map((habit) => calculateStreak(habit.completedDates).best),
        )
      : 0;

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

    return `
      <div
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full col-span-full"
      >
        <div
          class="col-span-2 md:col-span-1 relative overflow-hidden bg-surface-2 border border-border/70 hover:-translate-y-1 hover:border-sky-500/30 rounded-2xl p-6 transition-all duration-300 flex flex-col justify-between min-h-36 group"
        >
          <i
            class="fa-solid fa-layer-group absolute -right-4 -bottom-6 text-[10rem] text-sky-500 opacity-[0.04] dark:opacity-[0.06] rotate-20 pointer-events-none group-hover:scale-110 group-hover:rotate-10 transition-transform duration-500"
          ></i>

          <div class="flex flex-col gap-1 z-10">
            <span
              class="text-xs font-bold text-secondary uppercase tracking-wider"
              >Total Habits</span
            >
            <div class="text-4xl font-black text-primary tracking-tight mt-2">
              ${totalHabits}
            </div>
            <p class="text-[10px] text-muted font-medium mt-1">
              <span class="text-sky-500/80 font-bold"
                >${habits.length} active</span
              >
              right now
            </p>
          </div>
        </div>

        <div
          class="col-span-2 md:col-span-1 relative overflow-hidden bg-surface-2 border border-border/70 hover:-translate-y-1 hover:border-emerald-500/30 rounded-2xl p-6 transition-all duration-300 flex flex-col justify-between min-h-36 group"
        >
          <i
            class="fa-solid fa-calendar-check absolute -right-4 -bottom-6 text-[10rem] text-emerald-500 opacity-[0.04] dark:opacity-[0.06] rotate-15 pointer-events-none group-hover:scale-110 group-hover:rotate-5 transition-transform duration-500"
          ></i>

          <div class="flex flex-col gap-1 z-10">
            <span
              class="text-xs font-bold text-secondary uppercase tracking-wider"
              >Completed Today</span
            >
            <div class="text-4xl font-black text-primary tracking-tight mt-2">
              ${completedToday}
            </div>
            <p class="text-[10px] text-muted font-medium mt-1">
              ${
                completedToday === habits.length && habits.length !== 0
                  ? `<span class="text-emerald-500/80 font-bold flex items-center gap-1"><i class="fa-solid fa-sparkles"></i> All caught up!</span>`
                  : habits.length > completedToday
                    ? `waiting for ${habits.length - completedToday} more checks`
                    : "habits added yet"
              }
            </p>
          </div>
        </div>

        <div
          class="col-span-2 md:col-span-1 relative overflow-hidden bg-surface-2 border border-border/70 hover:-translate-y-1 ${
            goalsOverflowThisWeek > 0
              ? "hover:border-lime-500/30"
              : goalsOverflowThisWeek === 0 && goalsMetThisWeek > 0
                ? "hover:border-brand/30"
                : "hover:border-pink-500/30"
          } rounded-2xl p-6 transition-all duration-300 flex flex-col justify-between min-h-36 group"
        >
          <i
            class="fa-solid ${
              goalsOverflowThisWeek > 0
                ? "fa-bolt-lightning text-lime-500"
                : goalsOverflowThisWeek === 0 && goalsMetThisWeek > 0
                  ? "fa-circle-check text-brand"
                  : "fa-bullseye-arrow text-pink-500"
            } absolute -right-2 -bottom-6 text-[10rem] opacity-[0.04] dark:opacity-[0.06] rotate-25 pointer-events-none group-hover:scale-110 group-hover:rotate-15 transition-transform duration-500"
          ></i>

          <div class="flex flex-col gap-1 z-10">
            <span
              class="text-xs font-bold text-secondary uppercase tracking-wider"
              >Weekly Targets</span
            >
            <div class="text-4xl font-black text-primary tracking-tight mt-2">
              ${goalsMetThisWeek}<span class="text-sm font-bold text-muted"
                >/${habits.length}</span
              >
            </div>
            <p class="text-[10px] text-muted font-medium mt-1">
              ${
                goalsOverflowThisWeek > 0
                  ? `<span class="text-lime-500/80 font-bold flex items-center gap-1 animate-pulse"><i class="fa-solid fa-fire text-[9px]"></i> ${goalsOverflowThisWeek} Smashed!</span>`
                  : "goals met this week"
              }
            </p>
          </div>
        </div>

        <div
          class="col-span-2 md:col-span-1 relative overflow-hidden bg-surface-2 border border-border/70 hover:-translate-y-1 hover:border-orange-500/30 rounded-2xl p-6 transition-all duration-300 flex flex-col justify-between min-h-36 group"
        >
          <i
            class="fa-solid fa-fire absolute -right-2 -bottom-4 text-[10rem] text-orange-500 opacity-[0.04] dark:opacity-[0.06] rotate-12 pointer-events-none group-hover:scale-110 group-hover:rotate-0 transition-transform duration-500"
          ></i>

          <div class="flex flex-col gap-1 z-10">
            <span
              class="text-xs font-bold text-secondary uppercase tracking-wider"
              >Best Streak</span
            >
            <div class="text-4xl font-black text-primary tracking-tight mt-2">
              ${bestStreak}<span class="text-sm font-bold text-secondary ms-0.5"
                >days</span
              >
            </div>
            <p class="text-[10px] text-muted font-medium mt-1">
              current streak is
              <span class="text-orange-500/80 font-bold">${current}d</span>
            </p>
          </div>
        </div>

        <div
          class="col-span-2 md:col-span-1 relative overflow-hidden bg-surface-2 border border-border/70 hover:-translate-y-1 hover:border-yellow-500/30 rounded-2xl p-6 transition-all duration-300 flex flex-col justify-between min-h-36 group"
        >
          <i
            class="fa-solid fa-chart-line absolute -right-4 -bottom-6 text-[10rem] text-yellow-500 opacity-[0.04] dark:opacity-[0.06] rotate-18 pointer-events-none group-hover:scale-110 group-hover:rotate-[8deg] transition-transform duration-500"
          ></i>

          <div class="flex flex-col gap-1 z-10">
            <span
              class="text-xs font-bold text-secondary uppercase tracking-wider"
              >Avg Success</span
            >
            <div class="text-4xl font-black text-primary tracking-tight mt-2">
              ${averageSuccessRate}%
            </div>
            <p class="text-[10px] text-muted font-medium mt-1">
              ${
                averageSuccessRate >= 70
                  ? `<span class="text-yellow-500/80 font-bold">Excellent consistency</span>`
                  : `keep pushing to break 70%`
              }
            </p>
          </div>
        </div>

        <div
          class="col-span-2 md:col-span-1 relative overflow-hidden bg-surface-2 border border-border/70 hover:-translate-y-1 hover:border-slate-500/30 rounded-2xl p-6 transition-all duration-300 flex flex-col justify-between min-h-36 group"
        >
          <i
            class="fa-regular fa-box-archive absolute -right-4 -bottom-6 text-[10rem] text-slate-500 opacity-[0.04] dark:opacity-[0.06] rotate-18 pointer-events-none group-hover:scale-110 group-hover:rotate-[8deg] transition-transform duration-500"
          ></i>

          <div class="flex flex-col gap-1 z-10">
            <span
              class="text-xs font-bold text-secondary uppercase tracking-wider"
              >Archived</span
            >
            <div class="text-4xl font-black text-primary tracking-tight mt-2">
              ${archivedCount}
            </div>
            <p class="text-[10px] text-muted font-medium mt-1">
              ${
                archivedCount > 0
                  ? `<span class="text-slate-500/80 font-bold">${archivedCount} habits</span> safely stored`
                  : `workspace is fully active`
              }
            </p>
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
                <h4
                  class="text-lg font-bold text-primary flex items-center gap-2"
                >
                  <i class="fa-regular fa-calendar text-brand/80 text-xl"></i>
                  Lifetime Activity Grid
                </h4>
                <p class="text-sm text-secondary mt-1">
                  Advanced multi-tier habit density repository mapped by sprint
                  lifecycle.
                </p>
              </div>

              <div class="relative flex items-center justify-end">
                <button
                  id="heatmap-mobile-menu-toggle"
                  class="sm:hidden inline-flex items-center justify-center h-8 w-8 rounded-lg border border-border bg-surface text-secondary hover:text-primary transition shadow-sm cursor-pointer"
                  aria-label="Open view menu"
                >
                  <i class="fa-regular fa-ellipsis-vertical text-lg"></i>
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
                    class="absolute top-1 left-1 h-[calc(100%-8px)] w-24 rounded-lg bg-brand transition-all duration-300 ease-out z-0 shadow-sm"
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
              <h4
                class="text-lg font-bold text-primary flex items-center gap-2"
              >
                <i
                  class="fa-regular fa-chart-simple text-amber-500/80 text-xl"
                ></i>
                Distribution Trends
              </h4>
              <p class="text-sm text-secondary mt-1">
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
          <div class="w-full col-span-full bg-surface-2 rounded-2xl p-6">
            <div
              class="flex flex-wrap sm:flex-nowrap sm:items-center justify-between gap-2"
            >
              <div>
                <h4
                  class="text-lg font-bold text-primary flex items-center gap-2"
                >
                  <i
                    class="fa-regular fa-layer-group text-brand/80 text-xl"
                  ></i>
                  Individual All-Time Analytics
                </h4>
                <p class="text-xs text-secondary/80 mt-1 font-medium">
                  A deep dive into your behavioural consistency and peak
                  performance trends mapped across weekdays.
                </p>
              </div>
              <span
                class="text-xs text-center font-semibold px-2.5 py-1 rounded-lg bg-surface border border-border text-secondary self-center sm:self-auto w-full sm:w-auto"
              >
                ${activeCount} Active Tracked (${archivedCount} Archived)
              </span>
            </div>

            <div class="mt-6 space-y-3">
              ${
                habits.length === 0
                  ? ` <div
                      class="min-h-80 bg-surface border border-dashed border-border rounded-2xl p-16 text-center"
                    >
                      <div class="text-6xl mb-6">
                        <i
                          class="fa-regular fa-box-open text-brand/60"
                        ></i>
                      </div>
                      <h2 class="text-2xl font-bold text-primary">
                        No active habits
                      </h2>
                      <p class="mt-3 text-secondary max-w-sm mx-auto">
                        You're all caught up! Create a new habit to get started.
                      </p>
                    </div>`
                  : `<div class="mt-5 flex flex-col justify-center gap-2">
                    ${habits
                      .map((habit) => {
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

                        let rowBadgeStyle =
                          "bg-surface-3 text-secondary border-border/50";
                        let rowBadgeText = "On Track";
                        let rowBadgeTextIcon = "";
                        let rowIcon = "fa-bullseye-arrow text-pink-500/80";

                        if (isGoalMet) {
                          rowBadgeStyle =
                            "bg-brand/10 text-brand/80 border-brand/20 font-semibold";
                          rowBadgeText = "Target Met";
                          rowIcon = "fa-circle-check text-brand/80";
                        }
                        if (isGoalOverflow) {
                          rowBadgeStyle =
                            "bg-lime-500/10 text-lime-500/80 border-lime-500/30 font-bold animate-pulse shadow-sm";
                          rowBadgeText = "Overachieved";
                          rowBadgeTextIcon =
                            "fa-bolt-lightning text-lime-500/80";
                          rowIcon = "fa-bolt-lightning text-lime-500/80";
                        }

                        let batteryColor = "bg-brand/80";
                        let batteryText = "Stable";
                        let badgeStyle =
                          "bg-brand/10 text-brand/80 border-brand/20";

                        if (lifetimeRate === 100) {
                          batteryColor = "bg-emerald-500/80";
                          batteryText = "Perfect";
                          badgeStyle =
                            "bg-emerald-500/10 text-emerald-500/80 border-emerald-500/20";
                        } else if (lifetimeRate < 35) {
                          batteryColor = "bg-red-500/80";
                          batteryText = "Critical";
                          badgeStyle =
                            "bg-red-500/10 text-red-500/80 border-red-500/20";
                        } else if (lifetimeRate < 65) {
                          batteryColor = "bg-amber-500/80";
                          batteryText = "Warning";
                          badgeStyle =
                            "bg-amber-500/10 text-amber-500/80 border-amber-500/20";
                        }

                        return `
                          <div
                            class="flex flex-col lg:flex-row lg:items-center justify-between gap-5 group/row bg-surface p-4 rounded-xl shadow-sm"
                          >
                            <div class="flex items-center gap-3 min-w-0 flex-1">
                              <div class="w-full">
                                <div
                                  class="text-sm pb-3 sm:pb-0 font-bold text-primary truncate flex flex-wrap items-center gap-2"
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
                                  <span
                                    class="inline-flex lg:hidden items-center rounded-md border ${rowBadgeStyle} px-1.5 py-0.5 text-[9px] uppercase tracking-wider"
                                  >
                                    ${rowBadgeText}
                                    ${
                                      rowBadgeTextIcon
                                        ? `<i class="fa-solid ${rowBadgeTextIcon} text-[10px] ps-1"></i>`
                                        : ""
                                    }
                                  </span>
                                  ${
                                    habit.archived
                                      ? `<span class="inline-flex lg:hidden items-center rounded-md border bg-surface-3 text-secondary border-border/50 px-1.5 py-0.5 text-[9px] uppercase tracking-wider">Archived</span>`
                                      : ""
                                  }
                                </div>

                                <div
                                  class="text-[11px] text-secondary/70 mt-2 flex flex-wrap items-center gap-x-4 gap-y-1.5 font-medium"
                                >
                                  <div
                                    class="hidden lg:flex flex-row items-center gap-2"
                                  >
                                    <span
                                      class="inline-flex items-center rounded-md border ${rowBadgeStyle} px-1.5 py-0.5 text-[9px] uppercase tracking-wider"
                                    >
                                      ${rowBadgeText}
                                      ${
                                        rowBadgeTextIcon
                                          ? `<i class="fa-solid ${rowBadgeTextIcon} text-[10px] ps-1"></i>`
                                          : ""
                                      }
                                    </span>
                                    ${
                                      habit.archived
                                        ? `<span class="inline-flex items-center rounded-md border bg-surface-3 text-secondary border-border/50 px-1.5 py-0.5 text-[9px] uppercase tracking-wider">Archived</span>`
                                        : ""
                                    }
                                  </div>
                                  <span
                                    class="flex flex-row items-center gap-1"
                                  >
                                    <i
                                      class="fa-regular fa-clock text-sky-500/80"
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
                                      class="fa-regular fa-shapes text-amber-500/80"
                                    ></i>
                                    Category:
                                    <strong class="text-secondary font-semibold"
                                      >${habit.category}</strong
                                    >
                                  </span>
                                  <span class="inline-flex items-center gap-1">
                                    <i class="fa-regular ${rowIcon}"></i> This
                                    Week:
                                    <strong class="text-primary font-bold"
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
                                    class="text-lg sm:text-base font-black text-primary mt-0.5 truncate"
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
                                    class="text-lg sm:text-base font-black text-primary mt-0.5 truncate"
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
                                    <span class="font-bold text-primary"
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
                                  class="text-[10px] font-bold px-2.5 py-0.5 rounded-lg border ${badgeStyle} whitespace-nowrap lg:self-center"
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
};
