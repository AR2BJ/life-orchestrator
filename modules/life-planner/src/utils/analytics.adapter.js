import { LIFE_AREAS } from "@/utils/constants/options-value.constants";
import { formatDate } from "./helpers.js";

const weekdayNames = ["Sat", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri"];
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

/**
 * Extracts daily activity counters mapped by ISO date strings (YYYY-MM-DD)
 * using Plans (createdAt, objectives) and Logs.
 */
function getActivityMap(plans = [], logs = []) {
  const map = {};

  plans.forEach((plan) => {
    if (plan.createdAt) {
      const createdIso = plan.createdAt.split("T")[0];
      map[createdIso] = (map[createdIso] || 0) + 1;
    }

    if (Array.isArray(plan.objectives)) {
      plan.objectives.forEach((obj) => {
        if (obj.completed) {
          const dateKey = obj.completedAt
            ? obj.completedAt.split("T")[0]
            : plan.createdAt
              ? plan.createdAt.split("T")[0]
              : null;
          if (dateKey) {
            map[dateKey] = (map[dateKey] || 0) + 1;
          }
        }
      });
    }
  });

  logs.forEach((log) => {
    if (log.date) {
      const logIso = log.date.split("T")[0];
      map[logIso] = (map[logIso] || 0) + 1;
    }
  });

  return map;
}

export const AnalyticsAdapter = {
  // 1. Heatmap Data Generation
  generateHeatmapSeries(plans = [], logs = [], view = "weekly") {
    let startDate = new Date();
    const allEntities = [...plans, ...logs];

    if (allEntities.length > 0) {
      const validDates = allEntities
        .map((item) =>
          item.createdAt || item.date
            ? new Date(item.createdAt || item.date).getTime()
            : null,
        )
        .filter((time) => time && !isNaN(time));

      if (validDates.length > 0) {
        startDate = new Date(Math.min(...validDates));
      } else {
        startDate.setDate(startDate.getDate() - 90);
      }
    } else {
      startDate.setDate(startDate.getDate() - 90);
    }
    startDate.setHours(0, 0, 0, 0);

    const today = new Date();
    today.setHours(23, 59, 59, 999);

    const globalActivityMap = getActivityMap(plans, logs);

    if (view === "weekly") {
      const startSaturday = new Date(startDate);
      const dayOfWeek = startSaturday.getDay();
      const offsetToSaturday = (dayOfWeek + 1) % 7;
      startSaturday.setDate(startDate.getDate() - offsetToSaturday);

      const totalWeeksToShow = 12;

      return weekdayNames.map((dayName, dayIdx) => {
        const rowData = [];
        for (let w = 0; w < totalWeeksToShow; w++) {
          const currentTarget = new Date(startSaturday);
          currentTarget.setDate(startSaturday.getDate() + w * 7 + dayIdx);

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

      while (activeMonthsRange.length < 6) {
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
          const daysInMonth = getDaysInMonth(mInfo.year, mInfo.month);

          const startDay = weekIdx * 7 + 1;
          const endDay = Math.min(startDay + 6, daysInMonth);

          if (startDay <= daysInMonth) {
            for (let d = startDay; d <= endDay; d++) {
              const targetDate = new Date(mInfo.year, mInfo.month, d);
              if (targetDate >= startDate && targetDate <= today) {
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
          const daysInMonth = getDaysInMonth(year, mIdx);

          for (let d = 1; d <= daysInMonth; d++) {
            const targetDate = new Date(year, mIdx, d);
            if (targetDate >= startDate && targetDate <= today) {
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

  // 2. Weekday Distribution Data
  generateWeekdayCounts(plans = [], logs = []) {
    const weekdayCounts = Array(7).fill(0);

    [...plans, ...logs].forEach((item) => {
      const dateStr = item.createdAt || item.date;
      if (dateStr) {
        const dayIndex = new Date(dateStr).getDay();
        const shiftedIndex = (dayIndex + 1) % 7;

        if (shiftedIndex >= 0 && shiftedIndex <= 6) {
          weekdayCounts[shiftedIndex]++;
        }
      }
    });

    return weekdayCounts;
  },

  // 3. Life Area Distribution Data
  // 3. Life Area Distribution Data
  generateLifeAreaAnalytics(plans = []) {
    const areaColorMap = {
      productivity: "#f0b100",
      health: "#00bc7d",
      personal: "#7ccf00",
      career: "#00b8db",
      creativity: "#2b7fff",
      finance: "#8e51ff",
      lifestyle: "#f6339a",
      mindset: "#e12afb",
      relationships: "#ff6900",
      environment: "#fb2c36",
    };

    const areaCounts = {};
    const colors = [];

    LIFE_AREAS.forEach((area) => {
      areaCounts[area.name] = 0;
      colors.push(areaColorMap[area.id] || "#62748e");
    });

    plans.forEach((plan) => {
      const matched = LIFE_AREAS.find(
        (a) => String(a.id) === String(plan.lifeAreaId),
      );
      const name = matched ? matched.name : "General";
      areaCounts[name] = (areaCounts[name] || 0) + 1;
    });

    return {
      labels: Object.keys(areaCounts),
      series: Object.values(areaCounts),
      colors: colors,
    };
  },

  // Mood Spectrum Analytics
  generateMoodAnalytics(logs = []) {
    const categories = ["Terrible", "Bad", "Neutral", "Good", "Excellent"];
    const counts = { terrible: 0, bad: 0, neutral: 0, good: 0, excellent: 0 };

    logs.forEach((log) => {
      if (log.mood) {
        const key = String(log.mood).toLowerCase();
        if (counts[key] !== undefined) {
          counts[key]++;
        }
      }
    });

    return {
      categories,
      series: [
        {
          name: "Mood Count",
          data: [
            counts.terrible,
            counts.bad,
            counts.neutral,
            counts.good,
            counts.excellent,
          ],
        },
      ],
    };
  },

  // Energy Levels Analytics
  generateEnergyAnalytics(logs = []) {
    const categories = [
      "1 - Low",
      "2 - Moderate",
      "3 - Normal",
      "4 - High",
      "5 - Peak",
    ];
    const counts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

    logs.forEach((log) => {
      if (log.energy !== undefined && log.energy !== null) {
        const val = Number(log.energy);
        if (counts[val] !== undefined) {
          counts[val]++;
        }
      }
    });

    return {
      categories,
      series: [
        {
          name: "Energy Count",
          data: [counts[1], counts[2], counts[3], counts[4], counts[5]],
        },
      ],
    };
  },

  // 5. Heatmap Color Ranges Calculation
  getColorRanges(view, maxVal = 10, isDark = false) {
    const safeMax = Math.max(maxVal, 1);

    if (view === "yearly") {
      return [
        { from: 0, to: 0, color: isDark ? "#1f2937" : "#e2e8f0", name: "none" },
        {
          from: 1,
          to: Math.ceil(safeMax * 0.2),
          color: isDark ? "#064e3b" : "#dcfae9",
          name: "low",
        },
        {
          from: Math.ceil(safeMax * 0.2) + 1,
          to: Math.ceil(safeMax * 0.5),
          color: isDark ? "#047857" : "#9be9a8",
          name: "medium",
        },
        {
          from: Math.ceil(safeMax * 0.5) + 1,
          to: safeMax,
          color: "#10b981",
          name: "high",
        },
      ];
    }

    if (view === "monthly") {
      const step = Math.max(1, Math.ceil(safeMax / 4));
      return [
        { from: 0, to: 0, color: isDark ? "#111827" : "#f3f4f6", name: "none" },
        {
          from: 1,
          to: step,
          color: isDark ? "#064e3b" : "#dcfae9",
          name: "low",
        },
        {
          from: step + 1,
          to: step * 2,
          color: isDark ? "#047857" : "#9be9a8",
          name: "medium",
        },
        {
          from: step * 2 + 1,
          to: safeMax,
          color: "#10b981",
          name: "high",
        },
      ];
    }

    return [
      { from: 0, to: 0, color: isDark ? "#1f2937" : "#e2e8f0", name: "none" },
      { from: 1, to: safeMax, color: "#10b981", name: "active" },
    ];
  },
};
