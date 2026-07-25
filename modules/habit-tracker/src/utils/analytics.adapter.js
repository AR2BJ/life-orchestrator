import { formatDate } from "./helpers.js";

const weekdayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const monthNames = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

export const AnalyticsAdapter = {
  generateHeatmapSeries(habits, view) {
    const activeHabits = habits.filter((h) => !h.archived);

    let startDate = new Date();
    if (activeHabits.length > 0) {
      const creationDates = activeHabits.map((h) =>
        new Date(h.createdAt).getTime(),
      );
      startDate = new Date(Math.min(...creationDates));
    } else {
      startDate.setDate(startDate.getDate() - 120);
    }
    startDate.setHours(0, 0, 0, 0);

    const today = new Date();
    today.setHours(23, 59, 59, 999);

    const globalActivityMap = {};
    habits.forEach((h) => {
      h.completedDates.forEach((d) => {
        globalActivityMap[d] = (globalActivityMap[d] || 0) + 1;
      });
    });

    if (view === "weekly") {
      const startSunday = new Date(startDate);
      startSunday.setDate(startDate.getDate() - startSunday.getDay());
      const totalWeeksToShow = 12;

      return weekdayNames.map((dayName, dayIdx) => {
        const rowData = [];
        for (let w = 0; w < totalWeeksToShow; w++) {
          const currentTarget = new Date(startSunday);
          currentTarget.setDate(startSunday.getDate() + w * 7 + dayIdx);

          const isoStr = formatDate(currentTarget);
          const count =
            currentTarget < startDate || currentTarget > today
              ? 0
              : globalActivityMap[isoStr] || 0;
          const monthName = currentTarget.toLocaleString("en-US", {
            month: "short",
          });

          rowData.push({ x: `${monthName} W${w + 1}`, y: count });
        }
        return { name: dayName, data: rowData };
      });
    }

    if (view === "monthly") {
      const startMonth = startDate.getMonth();
      const startYear = startDate.getFullYear();
      const endMonth = today.getMonth();
      const endYear = today.getFullYear();

      const activeMonthsRange = [];
      let curY = startYear;
      let curM = startMonth;

      while (curY < endYear || (curY === endYear && curM <= endMonth)) {
        activeMonthsRange.push({
          year: curY,
          month: curM,
          name: monthNames[curM],
        });
        curM++;
        if (curM > 11) {
          curM = 0;
          curY++;
        }
      }

      while (activeMonthsRange.length < 7) {
        let last = activeMonthsRange[activeMonthsRange.length - 1];
        let nextM = last.month + 1;
        let nextY = last.year;
        if (nextM > 11) {
          nextM = 0;
          nextY++;
        }
        activeMonthsRange.push({
          year: nextY,
          month: nextM,
          name: monthNames[nextM],
        });
      }

      const weekLabels = ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5"];

      return weekLabels.map((weekLabel, weekIdx) => {
        const rowData = activeMonthsRange.map((mInfo) => {
          let weeklyTicks = 0;
          let totalPossibleTicksInWeek = 0;
          const daysInMonth = getDaysInMonth(mInfo.year, mInfo.month);

          const startDay = weekIdx * 7 + 1;
          const endDay = Math.min(startDay + 6, daysInMonth);

          if (startDay <= daysInMonth) {
            for (let d = startDay; d <= endDay; d++) {
              const targetDate = new Date(mInfo.year, mInfo.month, d);
              if (targetDate >= startDate && targetDate <= today) {
                totalPossibleTicksInWeek += activeHabits.length;
                const isoStr = formatDate(targetDate);
                if (globalActivityMap[isoStr]) {
                  weeklyTicks += globalActivityMap[isoStr];
                }
              }
            }
          }

          return { x: `${mInfo.name} ${mInfo.year}`, y: weeklyTicks };
        });

        return { name: weekLabel, data: rowData };
      });
    }

    if (view === "yearly") {
      const startYear = startDate.getFullYear();
      const endYear = today.getFullYear();
      const yearsRange = [];
      for (let y = startYear; y <= endYear; y++) {
        yearsRange.push(y);
      }

      return yearsRange.map((year) => {
        const rowData = monthNames.map((monthName, mIdx) => {
          let monthlyTotalTicks = 0;
          let validDaysInTracking = 0;
          const daysInMonth = getDaysInMonth(year, mIdx);

          for (let d = 1; d <= daysInMonth; d++) {
            const targetDate = new Date(year, mIdx, d);
            if (targetDate >= startDate && targetDate <= today) {
              validDaysInTracking++;
              const isoStr = formatDate(targetDate);
              if (globalActivityMap[isoStr]) {
                monthlyTotalTicks += globalActivityMap[isoStr];
              }
            }
          }

          return { x: monthName, y: monthlyTotalTicks };
        });

        return { name: String(year), data: rowData };
      });
    }

    return [];
  },

  generateWeekdayCounts(habits) {
    const weekdayCounts = [0, 0, 0, 0, 0, 0, 0];
    habits.forEach((habit) => {
      habit.completedDates.forEach((dateStr) => {
        const dayIndex = new Date(dateStr).getDay();
        if (dayIndex >= 0 && dayIndex <= 6) weekdayCounts[dayIndex]++;
      });
    });
    return weekdayCounts;
  },

  getColorRanges(view, maxVal, isDark) {
    if (view === "yearly") {
      return [
        { from: 0, to: 0, color: isDark ? "#1f2937" : "#e2e8f0", name: "none" },
        {
          from: 1,
          to: 16,
          color: isDark ? "#c5fada" : "#dcfae9",
          name: "very low",
        },
        {
          from: 17,
          to: 33,
          color: isDark ? "#9be9a8" : "#9be9a8",
          name: "low",
        },
        {
          from: 34,
          to: 50,
          color: isDark ? "#7bd48f" : "#7bd48f",
          name: "medium",
        },
        {
          from: 51,
          to: 67,
          color: isDark ? "#40c463" : "#40c463",
          name: "high",
        },
        {
          from: 68,
          to: 84,
          color: isDark ? "#22a25f" : "#22a25f",
          name: "very high",
        },
        { from: 85, to: maxVal, color: "#00bc7d", name: "extreme" },
      ];
    }

    if (view === "monthly") {
      const s = Math.max(1, Math.ceil(maxVal / 4));
      return [
        { from: 0, to: 0, color: isDark ? "#111827" : "#f3f4f6", name: "none" },
        { from: 1, to: s, color: isDark ? "#c5fada" : "#dcfae9", name: "low" },
        {
          from: s + 1,
          to: s * 2,
          color: isDark ? "#c8f0d1" : "#bff0cf",
          name: "medium",
        },
        {
          from: s * 2 + 1,
          to: s * 3,
          color: isDark ? "#7bd48f" : "#7bd48f",
          name: "high",
        },
        {
          from: s * 3 + 1,
          to: s * 4,
          color: isDark ? "#40c463" : "#40c463",
          name: "very high",
        },
        { from: s * 4 + 1, to: maxVal, color: "#00bc7d", name: "extreme" },
      ];
    }

    return [
      { from: 0, to: 0, color: isDark ? "#1f2937" : "#e2e8f0", name: "none" },
      { from: 1, to: maxVal, color: "#00bc7d", name: "completed" },
    ];
  },
};
