import { formatDate } from "@/utils/helpers";

export const HabitCalendarComponent = {
  render(dates, habitId, createdAt, isArchived = false, skippedDates = []) {
    const dateSet = new Set(dates);
    const skipSet = new Set(skippedDates);

    const created = new Date(createdAt);
    created.setHours(0, 0, 0, 0);

    const todayObj = new Date();
    todayObj.setHours(0, 0, 0, 0);
    const todayIso = formatDate(todayObj);

    const yesterdayObj = new Date(todayObj);
    yesterdayObj.setDate(yesterdayObj.getDate() - 1);
    const yesterdayIso = formatDate(yesterdayObj);

    const utcCreated = Date.UTC(
      created.getFullYear(),
      created.getMonth(),
      created.getDate(),
    );
    const utcToday = Date.UTC(
      todayObj.getFullYear(),
      todayObj.getMonth(),
      todayObj.getDate(),
    );
    const diffDaysFromStart = Math.floor((utcToday - utcCreated) / 86400000);

    let periodIndex = 0;
    const sprintStart = new Date(created);

    if (diffDaysFromStart >= 60) {
      periodIndex = Math.floor((diffDaysFromStart - 60) / 59) + 1;

      sprintStart.setDate(created.getDate() + 60 + (periodIndex - 1) * 59 - 1);
    }

    const sprintEnd = new Date(sprintStart);
    sprintEnd.setDate(sprintStart.getDate() + 59);

    const days = [];
    for (let i = 0; i < 60; i++) {
      const currentDate = new Date(sprintStart);
      currentDate.setDate(sprintStart.getDate() + i);
      const iso = formatDate(currentDate);

      days.push({
        date: iso,
        completed: dateSet.has(iso),
        skipped: skipSet.has(iso),
      });
    }

    return `
      <div
        class="space-y-4 p-3 sm:p-4 w-full max-w-full overflow-hidden box-border"
      >
        <div
          class="flex flex-col sm:flex-row gap-2 sm:gap-0 justify-between items-center text-secondary text-xs sm:text-sm select-none font-medium w-full"
        >
          <span
            class="flex items-center gap-1 order-2 sm:order-1 text-[11px] sm:text-xs md:text-sm whitespace-nowrap"
          >
            <i class="fa-regular fa-calendar-range text-brand/70"></i>
            Start: ${formatDate(sprintStart)}
          </span>

          <span
            class="relative inline-flex items-center justify-center order-1 sm:order-2"
          >
            <span
              class="absolute inset-0 animate-micro-ping rounded-full bg-brand/25"
            ></span>
            <span
              class="relative text-[10px] sm:text-xs bg-brand/10 text-brand/80 px-3 py-1 rounded-full font-bold tracking-wide border border-brand/20 shadow-sm select-none whitespace-nowrap"
            >
              Sprint ${periodIndex + 1}
            </span>
          </span>

          <span
            class="flex items-center gap-1 order-3 text-[11px] sm:text-xs md:text-sm whitespace-nowrap"
          >
            End: ${formatDate(sprintEnd)}
            <i class="fa-regular fa-calendar-check text-brand/70"></i>
          </span>
        </div>

        <div
          class="grid gap-1 sm:gap-1.5 md:gap-2 grid-cols-5 xs:grid-cols-6 sm:grid-cols-10 md:grid-cols-15 xl:grid-cols-30 w-full distribution-grid"
        >
          ${days
            .map((day) => {
              let tooltip = `Status: Pending • ${day.date}`;
              if (day.completed) tooltip = `Status: Completed • ${day.date}`;
              if (day.skipped)
                tooltip = `Status: Skipped (Auto Guard) • ${day.date}`;

              const editable =
                day.date === todayIso || day.date === yesterdayIso;

              let bgClass = "bg-surface-4";
              if (day.completed) {
                bgClass =
                  "bg-emerald-500/80 shadow-md sm:shadow-lg shadow-emerald-500/20 text-white";
              } else if (day.skipped) {
                bgClass =
                  "bg-amber-500/80 shadow-md sm:shadow-lg shadow-amber-500/20 text-white";
              }

              return `
            <button
              data-date="${day.date}"
              data-habit-id="${habitId}"
              title="${tooltip}"
              class="calendar-day w-full aspect-square ${
                editable && !isArchived
                  ? "cursor-pointer hover:scale-105 sm:hover:scale-110 active:scale-95 border border-brand/40 sm:border-2"
                  : "cursor-not-allowed opacity-45"
              } rounded-sm sm:rounded-md flex flex-row justify-center items-center transition-all duration-200 ${bgClass} ${
                editable && !isArchived && !day.completed && !day.skipped
                  ? "hover:bg-surface-4/60"
                  : ""
              }"
            >
              ${
                day.completed
                  ? `<span class="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl 2xl:text-2xl font-bold leading-none select-none"><i class="fa-regular fa-check"></i></span>`
                  : day.skipped
                    ? `<span class="text-xs xs:text-sm sm:text-base lg:text-lg xl:text-xl 2xl:text-2xl font-bold leading-none select-none"><i class="fa-regular fa-shield"></i></span>`
                    : ""
              }
            </button>
          `;
            })
            .join("")}
        </div>
      </div>
    `;
  },
};
