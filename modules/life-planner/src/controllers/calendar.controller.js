import { StateManager, state } from "@/models/state.model.js";
import {
  renderDayList,
  renderMonthGrid,
  renderYearHeatmap,
} from "@/views/calendar/calendar.renderer.js";

import { eventBus } from "@/services/event-bus.service.js";

export class CalendarController {
  static currentDate = new Date();

  static calendarConfigs = {
    day: {
      title: "Daily Overview",
      description:
        "Detailed breakdown of plans, objectives, and auto-logs for a specific date.",
      icon: "ti-calendar",
    },
    month: {
      title: "Monthly Overview",
      description:
        "Visual distribution of scheduled plans and logs across days and weeks.",
      icon: "ti-calendar-week",
    },
    year: {
      title: "Yearly Overview",
      description:
        "High-level visual density map of logged activities and plans across the year.",
      icon: "ti-calendar-month",
    },
  };

  static init() {
    this.bindEvents();
    this.setupTabIndicatorObserver();
    this.subscribeToStoreChanges();

    requestAnimationFrame(() => {
      this.updateTabStyles(state.calendarMode || "day");
      this.updateHeaderData(state.calendarMode || "day");
      this.dispatchRender();
    });
  }

  static subscribeToStoreChanges() {
    eventBus.subscribe("store:plans:changed", () => this.dispatchRender());
    eventBus.subscribe("store:logs:changed", () => this.dispatchRender());
    eventBus.subscribe("ui:calendar:mode:changed", (mode) => {
      this.updateTabStyles(mode);
      this.updateHeaderData(mode);
      this.dispatchRender();
    });
  }

  static bindEvents() {
    document
      .getElementById("btn-calendar-day")
      ?.addEventListener("click", () => this.switchMode("day"));
    document
      .getElementById("btn-calendar-month")
      ?.addEventListener("click", () => this.switchMode("month"));
    document
      .getElementById("btn-calendar-year")
      ?.addEventListener("click", () => this.switchMode("year"));

    document
      .getElementById("calendar-btn-prev")
      ?.addEventListener("click", () => this.navigate(-1));
    document
      .getElementById("calendar-btn-next")
      ?.addEventListener("click", () => this.navigate(1));
    document
      .getElementById("calendar-btn-today")
      ?.addEventListener("click", () => {
        this.currentDate = new Date();
        this.dispatchRender();
      });
  }

  static navigate(direction) {
    const mode = state.calendarMode || "day";
    if (mode === "day") {
      this.currentDate.setDate(this.currentDate.getDate() + direction);
    } else if (mode === "month") {
      this.currentDate.setMonth(this.currentDate.getMonth() + direction);
    } else if (mode === "year") {
      this.currentDate.setFullYear(this.currentDate.getFullYear() + direction);
    }
    this.dispatchRender();
  }

  static switchMode(mode) {
    if (state.calendarMode === mode) return;

    StateManager.setCalendarMode(mode);
    this.updateTabStyles(mode);
    this.updateHeaderData(mode);
    this.dispatchRender();
  }

  static updateHeaderData(mode) {
    const titleEl = document.getElementById("calendar-header-title");
    const descEl = document.getElementById("calendar-header-description");
    const config = this.calendarConfigs[mode] || this.calendarConfigs.day;

    if (titleEl) {
      const newTitleHtml = `<i class="ti ${config.icon} text-brand/80"></i> ${config.title}`;
      if (titleEl.innerHTML !== newTitleHtml) {
        titleEl.innerHTML = newTitleHtml;
      }
    }

    if (descEl) {
      if (descEl.textContent !== config.description) {
        descEl.textContent = config.description;
      }
    }
  }
  static updateTabStyles(mode) {
    const indicator = document.getElementById("calendar-tab-indicator");
    const btnDay = document.getElementById("btn-calendar-day");
    const btnMonth = document.getElementById("btn-calendar-month");
    const btnYear = document.getElementById("btn-calendar-year");

    if (!indicator || !btnDay || !btnMonth || !btnYear) return;

    const buttons = [btnDay, btnMonth, btnYear];
    const activeIndex = mode === "day" ? 0 : mode === "month" ? 1 : 2;
    const targetBtn = buttons[activeIndex];

    const buttonWidth =
      targetBtn.offsetWidth || targetBtn.getBoundingClientRect().width;
    if (!buttonWidth) return;

    const isWide = window.matchMedia("(min-width: 375px)").matches;

    if (isWide) {
      let offsetLeft = 4;
      for (let i = 0; i < activeIndex; i++) {
        offsetLeft += buttons[i].offsetWidth;
      }
      indicator.style.width = `${buttonWidth}px`;
      indicator.style.left = `${offsetLeft}px`;
      indicator.style.top = `4px`;
      indicator.style.height = `${targetBtn.offsetHeight}px`;
    } else {
      let offsetTop = 4;
      for (let i = 0; i < activeIndex; i++) {
        offsetTop += buttons[i].offsetHeight;
      }
      indicator.style.height = `${targetBtn.offsetHeight}px`;
      indicator.style.top = `${offsetTop}px`;
      indicator.style.left = `4px`;
      indicator.style.width = `${buttonWidth}px`;
    }

    buttons.forEach((btn, idx) => {
      if (idx === activeIndex) {
        btn.classList.replace(
          "text-secondary",
          "text-(--color-btn-primary-text)",
        );
        btn.setAttribute("aria-selected", "true");
      } else {
        btn.classList.replace(
          "text-(--color-btn-primary-text)",
          "text-secondary",
        );
        btn.setAttribute("aria-selected", "false");
      }
    });
  }

  static setupTabIndicatorObserver() {
    const btnDay = document.getElementById("btn-calendar-day");
    const btnMonth = document.getElementById("btn-calendar-month");
    const btnYear = document.getElementById("btn-calendar-year");

    if (!btnDay || !btnMonth || !btnYear) return;

    if (!window.calendarTabResizeObserver) {
      window.calendarTabResizeObserver = new ResizeObserver(() => {
        requestAnimationFrame(() => {
          this.updateTabStyles(state.calendarMode || "day");
          this.updateHeaderData(state.calendarMode || "day");
        });
      });
    }

    window.calendarTabResizeObserver.disconnect();
    window.calendarTabResizeObserver.observe(btnDay);
    window.calendarTabResizeObserver.observe(btnMonth);
    window.calendarTabResizeObserver.observe(btnYear);
  }

  static getCalendarItems() {
    const plans = StateManager.getPlans() || [];
    const logs = StateManager.getLogs() || [];

    return {
      plans: plans.filter((p) => p.state !== "completed"),
      logs: logs,
    };
  }

  static dispatchRender() {
    const container = document.getElementById("calendar-content-container");
    const labelEl = document.getElementById("calendar-current-label");
    const labelElMobile = document.getElementById(
      "calendar-current-label-mobile",
    );
    if (!container) return;

    const calendarData = this.getCalendarItems();
    const mode = state.calendarMode || "day";

    const dateOptionsDay = {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    };
    const dateOptionsMonth = { month: "long", year: "numeric" };

    if (labelEl) {
      let newLabel = "";
      if (mode === "day") {
        newLabel = this.currentDate.toLocaleDateString("en-US", dateOptionsDay);
      } else if (mode === "month") {
        newLabel = this.currentDate.toLocaleDateString(
          "en-US",
          dateOptionsMonth,
        );
      } else {
        newLabel = this.currentDate.getFullYear().toString();
      }
      if (labelEl.textContent !== newLabel) {
        labelEl.textContent = newLabel;
      }
    }

    if (labelElMobile) {
      let newLabelMobile = "";
      if (mode === "day") {
        newLabelMobile = this.currentDate.toLocaleDateString(
          "en-US",
          dateOptionsDay,
        );
      } else if (mode === "month") {
        newLabelMobile = this.currentDate.toLocaleDateString(
          "en-US",
          dateOptionsMonth,
        );
      } else {
        newLabelMobile = this.currentDate.getFullYear().toString();
      }
      if (labelElMobile.textContent !== newLabelMobile) {
        labelElMobile.textContent = newLabelMobile;
      }
    }

    if (mode === "month") {
      container.innerHTML = renderMonthGrid(this.currentDate, calendarData);

      container.querySelectorAll("[data-calendar-date]").forEach((cell) => {
        cell.addEventListener("click", () => {
          const dateStr = cell.getAttribute("data-calendar-date");
          this.currentDate = new Date(dateStr);
          this.switchMode("day");
        });
      });
    } else if (mode === "day") {
      container.innerHTML = renderDayList(this.currentDate, calendarData);
    } else {
      container.innerHTML = renderYearHeatmap(this.currentDate, calendarData);

      container.querySelectorAll("[data-year-month]").forEach((card) => {
        card.addEventListener("click", () => {
          const monthIdx = parseInt(card.getAttribute("data-year-month"), 10);
          this.currentDate.setMonth(monthIdx);
          this.switchMode("month");
        });
      });
    }

    requestAnimationFrame(() => {
      this.updateTabStyles(mode);
    });
  }
}
