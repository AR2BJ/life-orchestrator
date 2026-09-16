import {
  PLAN_NAMESPACE,
  loadFromStorage,
  saveToStorage,
} from "./storage.model.js";
import { getPlanProgress, todayISO } from "@/utils/helpers.js";

import { CoreStore } from "@life-orchestrator/core-store";
import { LIFE_AREAS } from "@/utils/constants/options-value.constants.js";
import { ROOT_KEY } from "@life-orchestrator/core-store";
import { eventBus } from "@/services/event-bus.service.js";

export const state = {
  plans: [],
  logs: [],
  templates: [],
  activeTab: "plans", // "plans" | "logs" | "templates"
  currentView: "planner",
  calendarMode: "day",
  analyticsUI: {
    heatmapView: "weekly", // 'weekly' | 'monthly' | 'yearly'
  },
  plansUI: {
    selectedLifeArea: "all",
    filterBy: "all", // "all" | "active" | "paused" | "completed" | "has_end_date" | "no_end_date" | "has_objectives" | "objectives_pending"
    searchQuery: "",
    sortBy: "created_desc",
  },
  logsUI: {
    selectedLifeArea: "all",
    filterBy: "all", // "all" | "today" | "this_week" | "this_month" | "linked_to_plan" | "standalone" | "high_energy" | "low_energy" | "has_metrics"
    searchQuery: "",
    sortBy: "date_desc",
  },
  templatesUI: {
    selectedLifeArea: "all",
    filterBy: "all", // "all" | "favorites" | "used" | "unused" | "has_baseline_optimal"
    searchQuery: "",
    sortBy: "favorites_first",
  },
  lastDeletedItem: null,
};

export const StateManager = {
  _rawCache: "",

  init() {
    this.reloadFromStorage(false);
    this.setupReactiveEngine();
    return state;
  },

  reloadFromStorage(notify = true) {
    const saved = loadFromStorage();
    if (saved) {
      state.plans = saved.plans || [];
      state.logs = saved.logs || [];
      state.templates = saved.templates || [];
    } else {
      state.plans = [];
      state.logs = [];
      state.templates = [];
    }

    this._rawCache = CoreStore.getNamespace(PLAN_NAMESPACE) || {};

    if (notify) {
      this.dispatchStateEvents();
    }
  },

  dispatchStateEvents() {
    eventBus.emit("store:plans:changed", state.plans);
    eventBus.emit("store:logs:changed", state.logs);
    eventBus.emit("store:templates:changed", state.templates);
    eventBus.emit("store:changed", state);
    eventBus.emit("ui:tab:changed", state.activeTab);
  },

  setupReactiveEngine() {
    window.addEventListener("storage", (event) => {
      if (event.key === ROOT_KEY) {
        try {
          this.reloadFromStorage(true);
        } catch (error) {
          console.error("Error syncing cross-tab storage:", error);
        }
      }
    });
  },

  // --- GETTERS ---
  getState() {
    return state;
  },

  getActiveTab() {
    return state.activeTab;
  },

  getPlans() {
    return state.plans;
  },

  getLogs() {
    return state.logs;
  },

  getTemplates() {
    return state.templates;
  },

  getLifeAreas() {
    return LIFE_AREAS || [];
  },

  getActiveUIState() {
    const key = `${state.activeTab}UI`;
    return state[key] || {};
  },

  getHeatmapView() {
    return state.analyticsUI?.heatmapView || "weekly";
  },

  getFilteredDataForActiveTab() {
    const tab = state.activeTab;
    const ui = this.getActiveUIState();

    let list = [];
    if (tab === "plans") list = [...state.plans];
    else if (tab === "logs") list = [...state.logs];
    else if (tab === "templates") list = [...state.templates];

    if (!Array.isArray(list)) return [];

    // Life Area
    if (ui.selectedLifeArea && ui.selectedLifeArea !== "all") {
      list = list.filter((item) => {
        if (tab === "logs") {
          if (!item.planId) return false;
          const linkedPlan = state.plans.find(
            (p) => String(p.id) === String(item.planId),
          );
          return (
            linkedPlan &&
            String(linkedPlan.lifeAreaId) === String(ui.selectedLifeArea)
          );
        }
        return String(item.lifeAreaId) === String(ui.selectedLifeArea);
      });
    }

    // filterBy
    if (ui.filterBy && ui.filterBy !== "all") {
      list = this.filterItemsByTab(list, tab, ui.filterBy);
    }

    // Search Query
    if (ui.searchQuery && ui.searchQuery.trim() !== "") {
      const query = ui.searchQuery.toLowerCase().trim();
      list = list.filter(
        (item) =>
          (item.title || "").toLowerCase().includes(query) ||
          (item.description || "").toLowerCase().includes(query) ||
          (item.baseline || "").toLowerCase().includes(query) ||
          (item.optimal || "").toLowerCase().includes(query),
      );
    }

    return this.sortItemsByTab(list, tab, ui.sortBy);
  },

  filterItemsByTab(items, tab, filterValue) {
    const todayStr = todayISO();

    return items.filter((item) => {
      if (tab === "plans") {
        switch (filterValue) {
          case "active":
          case "paused":
          case "completed":
            return item.state === filterValue;
          case "has_end_date":
            return Boolean(item.period?.endDate);
          case "no_end_date":
            return !item.period?.endDate;
          case "has_objectives":
            return Array.isArray(item.objectives) && item.objectives.length > 0;
          case "objectives_pending":
            return (
              Array.isArray(item.objectives) &&
              item.objectives.some((obj) => !obj.completed)
            );
          default:
            return true;
        }
      }

      if (tab === "logs") {
        switch (filterValue) {
          case "today":
            return item.date === todayStr;
          case "this_week": {
            const logDate = new Date(item.date);
            const now = new Date();
            const diffDays = Math.abs((now - logDate) / (1000 * 60 * 60 * 24));
            return diffDays <= 7;
          }
          case "this_month": {
            const logDate = new Date(item.date);
            const now = new Date();
            return (
              logDate.getFullYear() === now.getFullYear() &&
              logDate.getMonth() === now.getMonth()
            );
          }
          case "linked_to_plan":
            return Boolean(item.planId);
          case "standalone":
            return !item.planId;
          case "high_energy":
            return Number(item.energy) >= 4;
          case "low_energy":
            return Number(item.energy) <= 2;
          case "has_metrics":
            return (
              item.metrics &&
              typeof item.metrics === "object" &&
              Object.keys(item.metrics).length > 0
            );
          default:
            return true;
        }
      }

      if (tab === "templates") {
        switch (filterValue) {
          case "favorites":
            return Boolean(item.isFavorite);
          case "used":
            return Number(item.usageCount) > 0;
          case "unused":
            return Number(item.usageCount) === 0;
          case "has_baseline_optimal":
            return Boolean(
              (item.baseline && item.baseline.trim() !== "") ||
              (item.optimal && item.optimal.trim() !== ""),
            );
          default:
            return true;
        }
      }

      return true;
    });
  },

  sortItemsByTab(items, tab, sortBy) {
    return [...items].sort((a, b) => {
      // General Sort
      if (sortBy === "title_asc") {
        return (a.title || "").localeCompare(b.title || "", "fa");
      }

      // PLANS Sort
      if (tab === "plans") {
        switch (sortBy) {
          case "created_desc":
            return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
          case "created_asc":
            return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
          case "updated_desc":
            return new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0);
          case "start_date_desc":
            return (
              new Date(b.period?.startDate || 0) -
              new Date(a.period?.startDate || 0)
            );
          case "progress_desc":
            return getPlanProgress(b) - getPlanProgress(a);
          case "progress_asc":
            return getPlanProgress(a) - getPlanProgress(b);
          default:
            return 0;
        }
      }

      // LOGS Sort
      if (tab === "logs") {
        switch (sortBy) {
          case "date_desc":
            return new Date(b.date || 0) - new Date(a.date || 0);
          case "date_asc":
            return new Date(a.date || 0) - new Date(b.date || 0);
          case "energy_desc":
            return Number(b.energy || 0) - Number(a.energy || 0);
          case "energy_asc":
            return Number(a.energy || 0) - Number(b.energy || 0);
          case "updated_desc":
            return new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0);
          default:
            return 0;
        }
      }

      // TEMPLATES Sort
      if (tab === "templates") {
        switch (sortBy) {
          case "favorites_first":
            return (b.isFavorite ? 1 : 0) - (a.isFavorite ? 1 : 0);
          case "usage_desc":
            return Number(b.usageCount || 0) - Number(a.usageCount || 0);
          case "usage_asc":
            return Number(a.usageCount || 0) - Number(b.usageCount || 0);
          case "created_desc":
            return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
          case "updated_desc":
            return new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0);
          default:
            return 0;
        }
      }

      return 0;
    });
  },

  // --- SETTERS & UI CONTROL ---
  setView(view) {
    state.currentView = view;
    eventBus.emit("ui:view:changed", view);
    eventBus.emit("store:changed", state);
  },

  setCalendarMode(mode) {
    state.calendarMode = mode;
    eventBus.emit("ui:calendar:mode:changed", mode);
    eventBus.emit("store:changed", state);
  },

  setTab(tab) {
    if (["plans", "logs", "templates"].includes(tab)) {
      state.activeTab = tab;
      eventBus.emit("ui:tab:changed", tab);
      eventBus.emit("store:changed", state);
    }
  },

  setHeatmapView(view) {
    if (!state.analyticsUI) state.analyticsUI = {};
    state.analyticsUI.heatmapView = view;
    eventBus.emit("store:changed", state);
  },

  setLifeAreaFilter(lifeAreaId) {
    const ui = this.getActiveUIState();
    ui.selectedLifeArea = lifeAreaId;
    eventBus.emit("ui:filter:lifeArea", lifeAreaId);
    this.notifyActiveTabChanged();
  },

  setFilterBy(filterValue) {
    const ui = this.getActiveUIState();
    ui.filterBy = filterValue;
    eventBus.emit("ui:filter:changed", filterValue);
    this.notifyActiveTabChanged();
  },

  setSortBy(sortBy) {
    const ui = this.getActiveUIState();
    ui.sortBy = sortBy;
    eventBus.emit("ui:sort:changed", sortBy);
    this.notifyActiveTabChanged();
  },

  setSearchQuery(query) {
    const ui = this.getActiveUIState();
    ui.searchQuery = query;
    eventBus.emit("ui:search:changed", query);
    this.notifyActiveTabChanged();
  },

  notifyActiveTabChanged() {
    const currentTab = state.activeTab;
    eventBus.emit(`store:${currentTab}:changed`, state[currentTab]);
    eventBus.emit("store:changed", state);
  },

  // --- PERSISTENCE ---
  save(data = {}) {
    Object.assign(state, data);

    saveToStorage({
      plans: state.plans,
      logs: state.logs,
      templates: state.templates,
    });

    this._rawCache = CoreStore.getNamespace(PLAN_NAMESPACE) || {};
    this.dispatchStateEvents();
  },
};
