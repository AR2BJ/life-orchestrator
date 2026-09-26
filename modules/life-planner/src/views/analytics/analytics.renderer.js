import { AnalyticsAdapter } from "@/utils/analytics.adapter.js";
import { AnalyticsController } from "@/controllers/analytics.controller.js";
import ApexCharts from "apexcharts";
import { DashboardComponent } from "@/components/features/analytics/dashboard.component.js";

let heatmapChartInstance = null;
let barChartInstance = null;
let lifeAreaChartInstance = null;
let moodChartInstance = null;
let energyChartInstance = null;

let resizeListenerAttached = false;
let activeHeatmapTab = "weekly";

const weekdayNames = ["Sat", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri"];

function getHeatmapOptions(plans, logs, view) {
  const heatmapSeries = AnalyticsAdapter.generateHeatmapSeries(
    plans,
    logs,
    view,
  );
  const isDark =
    document.documentElement.classList.contains("dark") ||
    localStorage.getItem("theme") === "dark";
  const axisTextColor = isDark ? "#9ca3af" : "#4b5563";

  const currentTabCounts = heatmapSeries.flatMap((s) => s.data.map((d) => d.y));
  let maxCommit = Math.max(1, ...currentTabCounts);
  if (view === "weekly") {
    maxCommit = Math.max(maxCommit, 4);
  }

  const ranges = AnalyticsAdapter.getColorRanges(view, maxCommit, isDark);

  return {
    series: heatmapSeries,
    chart: {
      id: "lifetime-heatmap",
      type: "heatmap",
      height: 400,
      toolbar: { show: false },
      fontFamily: "inherit",
      animations: {
        enabled: true,
        speed: 250,
      },
    },
    dataLabels: { enabled: false },
    plotOptions: {
      heatmap: {
        radius: view === "weekly" ? 4 : 2,
        cellMargin: view === "weekly" ? 8 : view === "monthly" ? 4 : 2,
        colorScale: { ranges },
      },
    },
    stroke: {
      show: true,
      width: view === "weekly" ? 3 : view === "monthly" ? 2 : 1,
      colors: [isDark ? "#222f47" : "#e2e8f0"],
    },
    xaxis: {
      type: "category",
      labels: {
        show: true,
        style: {
          colors: axisTextColor,
          fontSize: view === "weekly" ? "11px" : "10px",
          fontWeight: 600,
        },
      },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      labels: {
        style: {
          colors: axisTextColor,
          fontSize: view === "weekly" ? "11px" : "10px",
          fontWeight: 700,
        },
        offsetX: -5,
      },
    },
    tooltip: {
      theme: isDark ? "dark" : "light",
      y: {
        formatter: (val) => `${val} activity ticks`,
      },
    },
  };
}

export function updateHeatmapChart(plans, logs, view) {
  if (!heatmapChartInstance) return;

  const newOptions = getHeatmapOptions(plans, logs, view);
  heatmapChartInstance.updateOptions(newOptions, true, true);
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
    btn.classList.remove("text-color", "font-black");
    btn.classList.add("text-secondary");
  });

  activeButton.classList.remove("text-secondary");
  activeButton.classList.add("text-color", "font-black");

  const switcherRect = switcher.getBoundingClientRect();
  const activeRect = activeButton.getBoundingClientRect();

  if (switcherRect.width > 0 && activeRect.width > 0) {
    const left = activeRect.left - switcherRect.left;
    indicator.style.transform = `translateX(${left - 4}px)`;
    indicator.style.width = `${activeRect.width}px`;
  }
}

function syncMobileMenuSelection(view) {
  const buttons = document.querySelectorAll("#heatmap-mobile-menu [data-view]");

  buttons.forEach((btn) => {
    const isActive = btn.getAttribute("data-view") === view;
    btn.classList.toggle("bg-brand/10", isActive);
    btn.classList.toggle("text-brand/80", isActive);
    btn.classList.toggle("font-bold", isActive);
    btn.classList.toggle("text-secondary", !isActive);
  });
}

function bindAnalyticsControls(plans, logs) {
  const switcher = document.getElementById("chart-view-switcher");
  if (switcher) {
    switcher.querySelectorAll("[data-view]").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const view = e.currentTarget.dataset.view;
        if (view && view !== activeHeatmapTab) {
          updateTabStyles(view);
          updateHeatmapChart(plans, logs, view);
        }
      });
    });
  }

  const mobileToggle = document.getElementById("heatmap-mobile-menu-toggle");
  const mobileMenu = document.getElementById("heatmap-mobile-menu");

  if (mobileToggle && mobileMenu) {
    syncMobileMenuSelection(activeHeatmapTab);

    mobileToggle.addEventListener("click", (event) => {
      event.stopPropagation();
      mobileMenu.classList.toggle("hidden");
    });

    document.addEventListener("click", (e) => {
      if (!mobileMenu.contains(e.target) && !mobileToggle.contains(e.target)) {
        mobileMenu.classList.add("hidden");
      }
    });

    mobileMenu.querySelectorAll("[data-view]").forEach((btn) => {
      btn.addEventListener("click", (event) => {
        event.stopPropagation();
        const view = event.currentTarget.dataset.view;
        if (view && view !== activeHeatmapTab) {
          updateTabStyles(view);
          updateHeatmapChart(plans, logs, view);
        }
        mobileMenu.classList.add("hidden");
      });
    });
  }
}

function handleAnalyticsResize() {
  updateTabStyles(activeHeatmapTab);
}

function renderChartEmptyState(chartEl, title, icon, subtitle) {
  if (!chartEl) return;

  chartEl.innerHTML = `
    <div class="empty-state-box flex w-full h-full min-h-60 items-center justify-center rounded-2xl border border-dashed border-border/80 bg-surface p-6 text-center">
      <div class="max-w-xs">
        <i class="text-4xl mb-3 ti ${icon} text-brand/60"></i>
        <div class="mb-2 text-lg font-semibold text-color">
          ${title}
        </div>
        <p class="text-sm leading-6 text-secondary">
          ${subtitle}
        </p>
      </div>
    </div>
  `;
}

function renderNoDataState() {
  const emptyStateConfigs = [
    {
      id: "apex-heatmap-chart",
      title: "Activity Heatmap",
      icon: "ti-chart-cohort",
      subtitle:
        "Add plans or logs to see your weekly, monthly, and yearly activity trend.",
    },
    {
      id: "apex-weekday-chart",
      title: "Weekly Activity",
      icon: "ti-calendar",
      subtitle: "Your activity by weekday will appear here once data exists.",
    },
    {
      id: "apex-lifearea-chart",
      title: "Life Area Distribution",
      icon: "ti-chart-pie",
      subtitle: "Assign life areas to your plans to see domain distribution.",
    },
    {
      id: "apex-mood-chart",
      title: "Mood Spectrum",
      icon: "ti-mood-smile",
      subtitle: "Log your mood state entries to track emotional spectrum.",
    },
    {
      id: "apex-energy-chart",
      title: "Energy Distribution",
      icon: "ti-battery-3",
      subtitle: "Log your energy metrics to view battery level trends.",
    },
  ];

  emptyStateConfigs.forEach(({ id, title, icon, subtitle }) => {
    const chartEl = document.getElementById(id);
    renderChartEmptyState(chartEl, title, icon, subtitle);
  });
}

export function renderAnalyticsCharts(
  plans = [],
  logs = [],
  templates = [],
  currentHeatmapView = "weekly",
) {
  const dashboard = document.getElementById("dashboard");
  if (!dashboard) return;

  // Cleanup existing chart instances
  if (heatmapChartInstance) {
    heatmapChartInstance.destroy();
    heatmapChartInstance = null;
  }
  if (barChartInstance) {
    barChartInstance.destroy();
    barChartInstance = null;
  }
  if (lifeAreaChartInstance) {
    lifeAreaChartInstance.destroy();
    lifeAreaChartInstance = null;
  }
  if (moodChartInstance) {
    moodChartInstance.destroy();
    moodChartInstance = null;
  }
  if (energyChartInstance) {
    energyChartInstance.destroy();
    energyChartInstance = null;
  }

  dashboard.innerHTML = DashboardComponent.render(plans, logs, templates);

  const hasData =
    (Array.isArray(plans) && plans.length > 0) ||
    (Array.isArray(logs) && logs.length > 0);

  if (hasData) {
    const chartBox = document.querySelectorAll('[id^="apex"]');
    const HeatmapSwitcher = document.getElementById("chart-view-switcher");
    const mobileHeatmapSwitcher = document.getElementById(
      "heatmap-mobile-menu-toggle",
    );

    chartBox.forEach((chart) => {
      ["px-2", "min-w-200", "md:min-w-full", "overflow-hidden"].forEach((c) =>
        chart.classList.add(c),
      );
    });

    if (HeatmapSwitcher)
      HeatmapSwitcher.classList.replace("sm:hidden", "sm:flex");
    if (mobileHeatmapSwitcher)
      mobileHeatmapSwitcher.classList.replace("hidden", "inline-flex");
  }

  AnalyticsController.init();
  bindAnalyticsControls(plans, logs);

  if (!hasData) {
    const HeatmapSwitcher = document.getElementById("chart-view-switcher");
    const mobileHeatmapSwitcher = document.getElementById(
      "heatmap-mobile-menu-toggle",
    );

    if (HeatmapSwitcher)
      HeatmapSwitcher.classList.replace("sm:flex", "sm:hidden");
    if (mobileHeatmapSwitcher)
      mobileHeatmapSwitcher.classList.replace("inline-flex", "hidden");

    renderNoDataState();
    requestAnimationFrame(() => {
      updateTabStyles(currentHeatmapView);
    });
    return;
  }

  if (!resizeListenerAttached) {
    window.addEventListener("resize", handleAnalyticsResize);
    resizeListenerAttached = true;
  }

  const isDark =
    document.documentElement.classList.contains("dark") ||
    localStorage.getItem("theme") === "dark";
  const axisTextColor = isDark ? "#e2e8f0" : "#222f47";

  // 1. Heatmap Options
  const heatmapOptions = getHeatmapOptions(plans, logs, currentHeatmapView);

  // 2. Weekday Bar Chart Options
  const weekdayCounts = AnalyticsAdapter.generateWeekdayCounts(plans, logs);
  const barChartOptions = {
    series: [{ name: "Activity Volume", data: weekdayCounts }],
    chart: {
      id: "weekday-bar",
      type: "bar",
      height: 400,
      toolbar: { show: false },
      fontFamily: "inherit",
    },
    colors: ["#10b981"],
    plotOptions: {
      bar: {
        horizontal: true,
        borderRadius: 6,
        barHeight: "50%",
        dataLabels: { position: "end" },
      },
    },
    dataLabels: {
      enabled: true,
      textAnchor: "end",
      colors: [isDark ? "#e2e8f0" : "#222f47"],
      style: {
        fontSize: "12px",
        fontWeight: "bold",
        colors: [axisTextColor],
      },
      formatter: (val) => val + " items",
    },
    xaxis: {
      categories: weekdayNames,
      labels: { show: false },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      labels: {
        style: {
          colors: axisTextColor,
          fontSize: "12px",
          fontWeight: 700,
        },
      },
    },
    grid: {
      show: true,
      borderColor: isDark ? "#e5e7eb" : "#bfcbd9",
      strokeDashArray: 4,
    },
    tooltip: { theme: isDark ? "dark" : "light" },
  };

  // 3. Life Area Options
  const lifeData = AnalyticsAdapter.generateLifeAreaAnalytics(plans);
  const lifeAreaChartOptions = {
    series: lifeData.series,
    labels: lifeData.labels,
    chart: {
      id: "lifearea-polar",
      type: "polarArea",
      width: "100%",
      height: 400,
      toolbar: { show: false },
      fontFamily: "inherit",
    },
    colors: lifeData.colors,
    stroke: { colors: [isDark ? "#1e293b" : "#ffffff"] },
    fill: { opacity: 0.85 },
    legend: {
      position: "bottom",
      labels: { colors: axisTextColor },
      horizontalAlign: "center",
    },
    tooltip: { theme: isDark ? "dark" : "light" },
    responsive: [
      {
        breakpoint: 768,
        options: {
          chart: {
            height: 200,
          },
          legend: {
            fontSize: "11px",
            itemMargin: {
              horizontal: 5,
              vertical: 2,
            },
          },
        },
      },
    ],
  };

  // 4. Standalone Mood Chart Options
  const moodData = AnalyticsAdapter.generateMoodAnalytics(logs);
  const moodChartOptions = {
    series: moodData.series,
    chart: {
      id: "mood-bar",
      type: "bar",
      height: 400,
      toolbar: { show: false },
      fontFamily: "inherit",
    },
    colors: ["#8b5cf6"],
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "45%",
        borderRadius: 5,
        dataLabels: { position: "top" },
      },
    },
    dataLabels: {
      enabled: true,
      offsetY: -18,
      style: {
        colors: [axisTextColor],
        fontSize: "11px",
        fontWeight: "bold",
      },
    },
    xaxis: {
      categories: moodData.categories,
      labels: {
        style: {
          colors: axisTextColor,
          fontSize: "11px",
          fontWeight: 600,
        },
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: axisTextColor,
          fontSize: "11px",
        },
      },
    },
    grid: {
      borderColor: isDark ? "#334155" : "#e2e8f0",
      strokeDashArray: 4,
    },
    tooltip: { theme: isDark ? "dark" : "light" },
  };

  // 5. Standalone Energy Chart Options
  const energyData = AnalyticsAdapter.generateEnergyAnalytics(logs);
  const energyChartOptions = {
    series: energyData.series,
    chart: {
      id: "energy-bar",
      type: "bar",
      height: 400,
      toolbar: { show: false },
      fontFamily: "inherit",
    },
    colors: ["#f59e0b"],
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "45%",
        borderRadius: 5,
        dataLabels: { position: "top" },
      },
    },
    dataLabels: {
      enabled: true,
      offsetY: -18,
      style: {
        colors: [axisTextColor],
        fontSize: "11px",
        fontWeight: "bold",
      },
    },
    xaxis: {
      categories: energyData.categories,
      labels: {
        style: {
          colors: axisTextColor,
          fontSize: "11px",
          fontWeight: 600,
        },
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: axisTextColor,
          fontSize: "11px",
        },
      },
    },
    grid: {
      borderColor: isDark ? "#334155" : "#e2e8f0",
      strokeDashArray: 4,
    },
    tooltip: { theme: isDark ? "dark" : "light" },
  };

  // Mount ApexCharts
  const heatmapEl = document.getElementById("apex-heatmap-chart");
  const barEl = document.getElementById("apex-weekday-chart");
  const lifeAreaEl = document.getElementById("apex-lifearea-chart");
  const moodEl = document.getElementById("apex-mood-chart");
  const energyEl = document.getElementById("apex-energy-chart");

  if (heatmapEl) {
    heatmapChartInstance = new ApexCharts(heatmapEl, heatmapOptions);
    heatmapChartInstance.render();
  }

  if (barEl) {
    barChartInstance = new ApexCharts(barEl, barChartOptions);
    barChartInstance.render();
  }

  if (lifeAreaEl) {
    lifeAreaChartInstance = new ApexCharts(lifeAreaEl, lifeAreaChartOptions);
    lifeAreaChartInstance.render();
  }

  if (moodEl) {
    moodChartInstance = new ApexCharts(moodEl, moodChartOptions);
    moodChartInstance.render();
  }

  if (energyEl) {
    energyChartInstance = new ApexCharts(energyEl, energyChartOptions);
    energyChartInstance.render();
  }

  requestAnimationFrame(() => {
    updateTabStyles(currentHeatmapView);
  });
}
