import { AnalyticsAdapter } from "@/utils/analytics.adapter.js";
import { AnalyticsController } from "@/controllers/analytics.controller.js";
import ApexCharts from "apexcharts";
import { DashboardComponent } from "@/components/features/analytics/dashboard.component.js";

let heatmapChartInstance = null;
let weeklyChartInstance = null;
let moduleDistChartInstance = null;
let tagsChartInstance = null;
let statusChartInstance = null;

let resizeListenerAttached = false;
let activeHeatmapTab = "weekly";

const weekdayNames = ["Sat", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri"];

function getHeatmapOptions(
  tags,
  notes,
  snippets,
  bookmarks,
  cheatsheets,
  view,
) {
  const heatmapSeries = AnalyticsAdapter.generateHeatmapSeries(
    tags,
    notes,
    snippets,
    bookmarks,
    cheatsheets,
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
        formatter: (val) => `${val} created items`,
      },
    },
  };
}

export function updateHeatmapChart(
  tags,
  notes,
  snippets,
  bookmarks,
  cheatsheets,
  view,
) {
  if (!heatmapChartInstance) return;
  const newOptions = getHeatmapOptions(
    tags,
    notes,
    snippets,
    bookmarks,
    cheatsheets,
    view,
  );
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

function bindAnalyticsControls(tags, notes, snippets, bookmarks, cheatsheets) {
  const switcher = document.getElementById("chart-view-switcher");
  if (switcher) {
    switcher.querySelectorAll("[data-view]").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const view = e.currentTarget.dataset.view;
        if (view && view !== activeHeatmapTab) {
          updateTabStyles(view);
          updateHeatmapChart(
            tags,
            notes,
            snippets,
            bookmarks,
            cheatsheets,
            view,
          );
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
          updateHeatmapChart(
            tags,
            notes,
            snippets,
            bookmarks,
            cheatsheets,
            view,
          );
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
        "Add notes, snippets, bookmarks, or cheatsheets to render heatmap trends.",
    },
    {
      id: "apex-weekday-chart",
      title: "Weekly Distribution",
      icon: "ti-calendar",
      subtitle: "Day-of-week creation velocity will appear once data is added.",
    },
    {
      id: "apex-category-chart",
      title: "Module Volumes",
      icon: "ti-chart-pie",
      subtitle:
        "Visual breakdown across Notes, Snippets, Bookmarks & Cheatsheets.",
    },
    {
      id: "apex-tags-chart",
      title: "Top Tags Breakdown",
      icon: "ti-tags",
      subtitle:
        "Categorize your knowledge base items with tags to track distribution.",
    },
    {
      id: "apex-status-chart",
      title: "Storage Allocation",
      icon: "ti-database",
      subtitle: "Displays entity size metrics and system storage ratio.",
    },
  ];

  emptyStateConfigs.forEach(({ id, title, icon, subtitle }) => {
    const chartEl = document.getElementById(id);
    renderChartEmptyState(chartEl, title, icon, subtitle);
  });
}

function destroyChartInstances() {
  if (heatmapChartInstance) {
    heatmapChartInstance.destroy();
    heatmapChartInstance = null;
  }
  if (weeklyChartInstance) {
    weeklyChartInstance.destroy();
    weeklyChartInstance = null;
  }
  if (moduleDistChartInstance) {
    moduleDistChartInstance.destroy();
    moduleDistChartInstance = null;
  }
  if (tagsChartInstance) {
    tagsChartInstance.destroy();
    tagsChartInstance = null;
  }
  if (statusChartInstance) {
    statusChartInstance.destroy();
    statusChartInstance = null;
  }
}

export function renderAnalyticsCharts(
  tags = [],
  notes = [],
  snippets = [],
  bookmarks = [],
  cheatsheets = [],
  currentHeatmapView = "weekly",
) {
  const dashboard = document.getElementById("dashboard");
  if (!dashboard) return;

  destroyChartInstances();

  dashboard.innerHTML = DashboardComponent.render(
    tags,
    notes,
    snippets,
    bookmarks,
    cheatsheets,
  );

  const hasData =
    (Array.isArray(tags) && tags.length > 0) ||
    (Array.isArray(notes) && notes.length > 0) ||
    (Array.isArray(snippets) && snippets.length > 0) ||
    (Array.isArray(bookmarks) && bookmarks.length > 0) ||
    (Array.isArray(cheatsheets) && cheatsheets.length > 0);

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
  bindAnalyticsControls(tags, notes, snippets, bookmarks, cheatsheets);

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
  const heatmapOptions = getHeatmapOptions(
    tags,
    notes,
    snippets,
    bookmarks,
    cheatsheets,
    currentHeatmapView,
  );

  // 2. Weekday Bar Chart Options
  const weekdayCounts = AnalyticsAdapter.generateWeekdayCounts(
    tags,
    notes,
    snippets,
    bookmarks,
    cheatsheets,
  );
  const weeklyChartOptions = {
    series: [{ name: "Created Items", data: weekdayCounts }],
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
      formatter: (val) => `${val} items`,
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

  // 3. Module Distribution (Polar Area Chart)
  const moduleData = AnalyticsAdapter.generateModuleAnalytics(
    tags,
    notes,
    snippets,
    bookmarks,
    cheatsheets,
  );
  const moduleDistOptions = {
    series: moduleData.series,
    labels: moduleData.labels,
    chart: {
      id: "module-polar",
      type: "polarArea",
      width: "100%",
      height: 400,
      toolbar: { show: false },
      fontFamily: "inherit",
    },
    colors: ["#3b82f6", "#10b981", "#f59e0b", "#8b5cf6"],
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

  // 4. Top Tags Analytics (Bar Chart)
  const tagsData = AnalyticsAdapter.generateTagsAnalytics(
    tags,
    notes,
    snippets,
    bookmarks,
    cheatsheets,
  );

  const tagsChartOptions = {
    series: tagsData.series,
    chart: {
      id: "tags-bar",
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
      formatter: (val) => (val > 0 ? val : ""),
    },
    xaxis: {
      categories: tagsData.categories,
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

  // 5. Storage / Metrics Analytics (Bar Chart)
  const metricsData = AnalyticsAdapter.generateMetricsAnalytics(
    tags,
    notes,
    snippets,
    bookmarks,
    cheatsheets,
  );

  const statusChartOptions = {
    series: metricsData.series,
    chart: {
      id: "metrics-bar",
      type: "bar",
      height: 380,
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
      formatter: (val) => (val > 0 ? val : ""),
    },
    xaxis: {
      categories: metricsData.categories,
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
  const categoryEl = document.getElementById("apex-category-chart");
  const tagEl = document.getElementById("apex-tags-chart");
  const statusEl = document.getElementById("apex-status-chart");

  if (heatmapEl) {
    heatmapChartInstance = new ApexCharts(heatmapEl, heatmapOptions);
    heatmapChartInstance.render();
  }

  if (barEl) {
    weeklyChartInstance = new ApexCharts(barEl, weeklyChartOptions);
    weeklyChartInstance.render();
  }

  if (categoryEl) {
    moduleDistChartInstance = new ApexCharts(categoryEl, moduleDistOptions);
    moduleDistChartInstance.render();
  }

  if (tagEl) {
    tagsChartInstance = new ApexCharts(tagEl, tagsChartOptions);
    tagsChartInstance.render();
  }

  if (statusEl) {
    statusChartInstance = new ApexCharts(statusEl, statusChartOptions);
    statusChartInstance.render();
  }

  requestAnimationFrame(() => {
    updateTabStyles(currentHeatmapView);
  });
}
