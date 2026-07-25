import { AnalyticsAdapter } from "@/utils/analytics.adapter.js";
import { AnalyticsController } from "@/controllers/analytics.controller.js";
import ApexCharts from "apexcharts";
import { DashboardComponent } from "@/components/features/analytics/dashboard.component.js";

let heatmapChartInstance = null;
let barChartInstance = null;
let resizeListenerAttached = false;
let activeHeatmapTab = "weekly";

const weekdayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function handleAnalyticsResize() {
  updateTabStyles(activeHeatmapTab);
}

function syncMobileMenuSelection(view) {
  const buttons = document.querySelectorAll("#heatmap-mobile-menu [data-view]");

  buttons.forEach((btn) => {
    const isActive = btn.getAttribute("data-view") === view;

    btn.classList.toggle("bg-brand/10", isActive);
    btn.classList.toggle("text-brand/80", isActive);
    btn.classList.toggle("font-semibold", isActive);
    btn.classList.toggle("text-secondary", !isActive);
  });
}

function bindAnalyticsMobileMenu(habits) {
  const mobileToggle = document.getElementById("heatmap-mobile-menu-toggle");
  const mobileMenu = document.getElementById("heatmap-mobile-menu");

  if (!mobileToggle || !mobileMenu) return;

  syncMobileMenuSelection(activeHeatmapTab);

  mobileToggle.onclick = (event) => {
    event.stopPropagation();
    mobileMenu.classList.toggle("hidden");
  };

  mobileToggle.addEventListener("focusout", (event) => {
    const nextTarget = event.relatedTarget;

    const shouldKeepOpen =
      nextTarget &&
      (mobileToggle.contains(nextTarget) || mobileMenu.contains(nextTarget));

    if (!shouldKeepOpen) {
      mobileMenu.classList.add("hidden");
    }
  });

  mobileMenu.querySelectorAll("[data-view]").forEach((btn) => {
    btn.onclick = (event) => {
      event.stopPropagation();
      const view = event.currentTarget.dataset.view;

      if (view) {
        updateTabStyles(view);
        updateHeatmapChart(habits, view);
      }

      mobileMenu.classList.add("hidden");
    };
  });
}

export function updateHeatmapChart(habits, tab) {
  if (!heatmapChartInstance) return;

  const newSeries = AnalyticsAdapter.generateHeatmapSeries(habits, tab);
  const isDark =
    document.documentElement.classList.contains("dark") ||
    localStorage.getItem("theme") === "dark";

  const allValues = newSeries.flatMap((s) => s.data.map((d) => d.y));
  let maxVal = Math.max(1, ...allValues);

  if (tab === "weekly") {
    maxVal = Math.max(maxVal, 4);
  }

  heatmapChartInstance.updateOptions(
    {
      chart: { height: tab === "monthly" ? 380 : 300 },
      plotOptions: {
        heatmap: {
          cellMargin: tab === "weekly" ? 12 : 6,
          colorScale: {
            ranges: AnalyticsAdapter.getColorRanges(tab, maxVal, isDark),
          },
        },
      },
      stroke: { width: tab === "weekly" ? 4 : 2 },
    },
    false,
    true,
    true,
  );

  heatmapChartInstance.updateSeries(newSeries);
}

export function updateTabStyles(tab) {
  activeHeatmapTab = tab;

  const indicator = document.getElementById("heatmap-tab-indicator");
  const btnWeekly = document.getElementById("view-btn-weekly");
  const btnMonthly = document.getElementById("view-btn-monthly");
  const btnYearly = document.getElementById("view-btn-yearly");
  const switcher = document.getElementById("chart-view-switcher");

  if (!indicator || !btnWeekly || !btnMonthly || !btnYearly || !switcher)
    return;

  syncMobileMenuSelection(tab);

  const buttons = [btnWeekly, btnMonthly, btnYearly];
  const activeButton =
    tab === "monthly" ? btnMonthly : tab === "yearly" ? btnYearly : btnWeekly;

  buttons.forEach((btn) => {
    btn.classList.remove("text-(--color-btn-primary-text)", "text-secondary");
    btn.classList.add("text-secondary");
  });

  activeButton.classList.remove("text-secondary");
  activeButton.classList.add("text-(--color-btn-primary-text)");

  const switcherStyle = window.getComputedStyle(switcher);
  const paddingLeft = parseFloat(switcherStyle.paddingLeft) || 0;

  const activeRect = activeButton.getBoundingClientRect();
  const switcherRect = switcher.getBoundingClientRect();

  const left = Math.max(
    paddingLeft,
    activeRect.left - switcherRect.left - paddingLeft,
  );
  const width = Math.max(activeRect.width, 0);

  indicator.style.left = `${left}px`;
  indicator.style.width = `${width}px`;
}

export function renderAnalyticsCharts(habits, currentHeatmapView) {
  const dashboard = document.getElementById("dashboard");
  if (!dashboard) return;

  if (heatmapChartInstance) {
    heatmapChartInstance.destroy();
    heatmapChartInstance = null;
  }
  if (barChartInstance) {
    barChartInstance.destroy();
    barChartInstance = null;
  }

  dashboard.innerHTML = DashboardComponent.render(habits);

  AnalyticsController.init();
  bindAnalyticsMobileMenu(habits);

  if (!resizeListenerAttached) {
    window.addEventListener("resize", handleAnalyticsResize);
    resizeListenerAttached = true;
  }

  requestAnimationFrame(() => {
    updateTabStyles(currentHeatmapView);
  });

  const heatmapSeries = AnalyticsAdapter.generateHeatmapSeries(
    habits,
    currentHeatmapView,
  );
  const weekdayCounts = AnalyticsAdapter.generateWeekdayCounts(habits);

  const isDark =
    document.documentElement.classList.contains("dark") ||
    localStorage.getItem("theme") === "dark";
  const axisTextColor = isDark ? "#e5e7eb" : "#4b5563";

  const currentTabCounts = heatmapSeries.flatMap((s) => s.data.map((d) => d.y));
  let maxCommit = Math.max(1, ...currentTabCounts);
  if (currentHeatmapView === "weekly") {
    maxCommit = Math.max(maxCommit, 4);
  }

  const ranges = AnalyticsAdapter.getColorRanges(
    currentHeatmapView,
    maxCommit,
    isDark,
  );

  const heatmapOptions = {
    series: heatmapSeries,
    chart: {
      id: "lifetime-heatmap",
      type: "heatmap",
      height:
        currentHeatmapView === "monthly"
          ? 380
          : currentHeatmapView === "yearly"
            ? 400
            : 300,
      toolbar: { show: false },
      fontFamily: "inherit",
      animations: {
        enabled: true,
        speed: 300,
        animateGradually: { enabled: true },
      },
    },
    dataLabels: { enabled: false },
    plotOptions: {
      heatmap: {
        radius: currentHeatmapView === "weekly" ? 3 : 2,
        cellMargin:
          currentHeatmapView === "weekly"
            ? 8
            : currentHeatmapView === "monthly"
              ? 4
              : 2,
        colorScale: { ranges },
      },
    },
    stroke: {
      show: true,
      width:
        currentHeatmapView === "weekly"
          ? 3
          : currentHeatmapView === "monthly"
            ? 2
            : 1,
      colors: [isDark ? "#222f47" : "#e2e8f0"],
    },
    xaxis: {
      type: "category",
      labels: {
        show: true,
        style: {
          colors: axisTextColor,
          fontSize: currentHeatmapView === "weekly" ? "10px" : "9px",
          fontWeight: 600,
        },
        maxHeight: 60,
      },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      labels: {
        style: {
          colors: axisTextColor,
          fontSize: currentHeatmapView === "weekly" ? "11px" : "10px",
          fontWeight: 700,
        },
        offsetX: -5,
      },
    },
    tooltip: {
      theme: isDark ? "dark" : "light",
      y: {
        formatter: (val) => `${val} ticks`,
      },
    },
  };

  const barChartOptions = {
    series: [{ name: "Habits Completed", data: weekdayCounts }],
    chart: {
      id: "weekday-bar",
      type: "bar",
      height: 300,
      toolbar: { show: false },
      fontFamily: "inherit",
    },
    colors: ["#00bc7d"],
    plotOptions: {
      bar: {
        horizontal: true,
        borderRadius: 6,
        barHeight: "55%",
        dataLabels: { position: "end" },
      },
    },
    dataLabels: {
      enabled: true,
      textAnchor: "end",
      offsetX: 10,
      style: {
        fontSize: "12px",
        fontWeight: "bold",
        colors: [isDark ? "#e2e8f0" : "#222f47"],
      },
      formatter: (val) => val + " ticks",
    },
    xaxis: {
      categories: weekdayNames,
      labels: { show: false },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      labels: {
        style: { colors: axisTextColor, fontSize: "13px", fontWeight: 700 },
      },
    },
    grid: {
      show: true,
      borderColor: isDark ? "#e5e7eb" : "#bfcbd9",
      strokeDashArray: 4,
    },
    tooltip: { theme: isDark ? "dark" : "light" },
  };

  heatmapChartInstance = new ApexCharts(
    document.getElementById("apex-heatmap-chart"),
    heatmapOptions,
  );
  heatmapChartInstance.render();

  barChartInstance = new ApexCharts(
    document.getElementById("apex-weekday-chart"),
    barChartOptions,
  );
  barChartInstance.render();
}
