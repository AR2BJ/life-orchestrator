import { CoreStore, ROOT_KEY } from "@life-orchestrator/core-store";
import {
  HABIT_NAMESPACE,
  loadFromStorage,
  saveToStorage,
} from "./storage.model.js";
import {
  getCompletionRate,
  getCurrentStreak,
  isScheduledOn,
} from "@/utils/helpers.js";

import { eventBus } from "@/services/event-bus.service.js";

export const state = {
  habits: [],
  lastDeletedHabit: null,
  activeTab: "active",
  currentView: "habits",
  currentCategory: "all",
  statusFilter: "all",
  sortBy: "streak",
  searchQuery: "",
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
      state.habits = saved.habits || [];
    } else {
      state.habits = [];
    }

    this._rawCache = CoreStore.getNamespace(HABIT_NAMESPACE) || {};

    if (notify) {
      this.dispatchStateEvents();
    }
  },

  dispatchStateEvents() {
    eventBus.emit("store:habits:changed", state.habits);
    eventBus.emit("ui:tab:changed", state.activeTab);
    eventBus.emit("ui:category:changed", state.currentCategory);
    eventBus.emit("ui:filter:status", state.statusFilter);
    eventBus.emit("ui:sort:changed", state.sortBy);
    eventBus.emit("ui:search:changed", state.searchQuery);
    eventBus.emit("ui:view:changed");
    eventBus.emit("store:changed");
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

  getHabits() {
    return state.habits;
  },

  getActiveTab() {
    return state.activeTab;
  },

  getView() {
    return state.currentView;
  },

  getFilteredHabits() {
    let list = this.getHabits();

    if (state.activeTab === "active") {
      list = list.filter((h) => !h.archived);
    } else {
      list = list.filter((h) => h.archived);
    }

    if (state.currentCategory && state.currentCategory !== "all") {
      list = list.filter((h) => h.category === state.currentCategory);
    }

    if (state.statusFilter && state.statusFilter !== "all") {
      const today = todayISO();
      list = list.filter((habit) => {
        const doneToday = habit.completedDates?.includes(today);
        const skippedToday = habit.skippedDates?.includes(today);
        const scheduledToday = isScheduledOn(habit, today);

        switch (statusFilter) {
          case "done_today":
            return doneToday;
          case "pending_today":
            return scheduledToday && !doneToday && !skippedToday;
          case "skipped_today":
            return skippedToday;
          case "never_completed":
            return !habit.completedDates?.length;
          case "has_streak":
            return getCurrentStreak(habit) > 0;
          default:
            return true;
        }
      });
    }

    if (state.searchQuery) {
      const query = state.searchQuery.toLowerCase().trim();
      list = list.filter((h) => {
        const name = (h.name || "").toLowerCase();
        const createdAt = h.createdAt || "";
        const category = (h.category || "").toLowerCase();
        return (
          name.includes(query) ||
          createdAt.includes(query) ||
          category.includes(query)
        );
      });
    }

    return this.sortHabits(list, state.sortBy);
  },

  sortHabits(habits, sortBy) {
    return [...habits].sort((a, b) => {
      switch (sortBy) {
        case "streak":
          return getCurrentStreak(b) - getCurrentStreak(a);
        case "frequency":
          return (b.frequency || 0) - (a.frequency || 0);
        case "completionRate":
          return getCompletionRate(b) - getCompletionRate(a);
        case "name":
          return (a.name || "").localeCompare(b.name || "");
        case "category":
          return (a.category || "").localeCompare(b.category || "");
        case "createdAt":
        default:
          return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      }
    });
  },

  setTab(tab) {
    state.activeTab = tab;
    eventBus.emit("ui:tab:changed", tab);
    eventBus.emit("store:changed");
  },

  setView(view) {
    state.currentView = view;
    eventBus.emit("ui:view:changed");
    eventBus.emit("store:changed");
  },

  setCategory(category) {
    state.currentCategory = category;
    eventBus.emit("ui:category:changed", category);
    eventBus.emit("store:changed");
  },

  setSearchQuery(query) {
    state.searchQuery = query;
    eventBus.emit("ui:search:changed", query);
    eventBus.emit("store:changed");
  },

  setStatusFilter(filter) {
    state.statusFilter = filter;
    eventBus.emit("ui:filter:status", filter);
    eventBus.emit("store:changed");
  },

  setSortBy(sortBy) {
    state.sortBy = sortBy;
    eventBus.emit("ui:sort:changed", sortBy);
    eventBus.emit("store:changed");
  },

  save(habits = state.habits) {
    state.habits = habits;
    saveToStorage(state.habits);

    this._rawCache = CoreStore.getNamespace(HABIT_NAMESPACE) || {};
    this.dispatchStateEvents();
  },
};
