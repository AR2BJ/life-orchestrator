import { CoreStore, ROOT_KEY } from "@life-orchestrator/core-store";
import {
  TASK_NAMESPACE,
  loadFromStorage,
  saveToStorage,
} from "./storage.model.js";

import { eventBus } from "@/services/event-bus.service.js";

export const state = {
  tasks: [],
  tags: [],
  lastDeletedTask: null,
  activeTab: "active",
  calendarMode: "day",
  matrixMode: "eisenhower",
  currentView: "tasks",
  selectedTag: "all",
  currentPriority: "low",
  currentStatus: "todo",
  dateFilter: "all",
  sortBy: "priority",
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
      state.tasks = saved.tasks || [];
      state.tags = saved.tags || [];
    } else {
      state.tasks = [];
      state.tags = [];
    }

    this._rawCache = CoreStore.getNamespace(TASK_NAMESPACE) || {};

    if (notify) {
      this.dispatchStateEvents();
    }
  },

  dispatchStateEvents() {
    eventBus.emit("store:tasks:changed", state.tasks);
    eventBus.emit("store:tags:changed", state.tags);
    eventBus.emit("ui:filter:date", state.dateFilter);
    eventBus.emit("ui:tag:changed", state.selectedTag);
    eventBus.emit("ui:priority:changed", state.currentPriority);
    eventBus.emit("ui:status:changed", state.currentStatus);
    eventBus.emit("ui:search:changed", state.searchQuery);
    eventBus.emit("ui:matrix:mode:changed", state.matrixMode);
    eventBus.emit("ui:calendar:mode:changed", state.calendarMode);
    eventBus.emit("ui:sort:changed", state.sortBy);
    eventBus.emit("ui:tab:changed", state.activeTab);
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

  getTasks() {
    return state.tasks;
  },

  getTags() {
    return state.tags;
  },

  getFilteredTasks() {
    let list = this.getTasks();

    if (state.activeTab === "active") {
      list = list.filter((task) => !task.archived && task.status !== "done");
    } else if (state.activeTab === "completed") {
      list = list.filter((task) => !task.archived && task.status === "done");
    } else if (state.activeTab === "archived") {
      list = list.filter((task) => task.archived);
    }

    if (state.selectedTag && state.selectedTag !== "all") {
      list = list.filter((task) => task.tagIds.includes(state.selectedTag));
    }

    if (state.activeTab === "active" && state.currentStatus !== "todo") {
      list = list.filter((task) => task.status === state.currentStatus);
    }

    if (state.currentPriority && state.currentPriority !== "low") {
      list = list.filter((task) => task.priority === state.currentPriority);
    }

    if (state.dateFilter && state.dateFilter !== "all") {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const todayStr = today.toISOString().split("T")[0];

      list = list.filter((task) => {
        if (state.dateFilter === "no_date") return !task.dueDate;
        if (!task.dueDate) return false;

        const taskDate = new Date(task.dueDate + "T00:00:00");

        if (state.dateFilter === "today") return task.dueDate === todayStr;
        if (state.dateFilter === "overdue")
          return taskDate < today && task.status !== "done";
        if (state.dateFilter === "this_week") {
          const nextWeek = new Date(today);
          nextWeek.setDate(today.getDate() + 7);
          return taskDate >= today && taskDate <= nextWeek;
        }

        return true;
      });
    }

    if (state.searchQuery) {
      const query = state.searchQuery.toLowerCase().trim();
      list = list.filter((task) => {
        const title = (task.title || "").toLowerCase();
        const description = (task.description || "").toLowerCase();

        const tagsMatch = task.tagIds?.some((tagId) => {
          const tagObj = state.tags.find((t) => t.id === tagId);
          return tagObj ? tagObj.name.toLowerCase().includes(query) : false;
        });

        return (
          title.includes(query) || description.includes(query) || tagsMatch
        );
      });
    }

    return this.sortTasks(list, state.sortBy);
  },

  sortTasks(tasks, sortBy) {
    const priorityWeight = { high: 3, medium: 2, low: 1 };
    const statusWeight = { blocked: 4, in_progress: 3, todo: 2, done: 1 };

    return [...tasks].sort((a, b) => {
      if (sortBy === "priority")
        return (
          (priorityWeight[b.priority] || 0) - (priorityWeight[a.priority] || 0)
        );
      if (sortBy === "status")
        return (statusWeight[b.status] || 0) - (statusWeight[a.status] || 0);
      if (sortBy === "dueDate") {
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate) - new Date(b.dueDate);
      }
      if (sortBy === "title") return a.title.localeCompare(b.title);
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
  },

  setDateFilter(date) {
    state.dateFilter = date;
    eventBus.emit("ui:filter:date", date);
    eventBus.emit("store:changed");
  },

  setSelectedTag(tag) {
    state.selectedTag = tag;
    eventBus.emit("ui:tag:changed", tag);
    eventBus.emit("store:changed");
  },

  setPriority(priority) {
    state.currentPriority = priority;
    eventBus.emit("ui:priority:changed", priority);
    eventBus.emit("store:changed");
  },

  setStatus(status) {
    state.currentStatus = status;
    eventBus.emit("ui:status:changed", status);
    eventBus.emit("store:changed");
  },

  setSortBy(sortBy) {
    state.sortBy = sortBy;
    eventBus.emit("ui:sort:changed", sortBy);
    eventBus.emit("store:changed");
  },

  setMatrixMode(mode) {
    state.matrixMode = mode;
    eventBus.emit("ui:matrix:mode:changed", mode);
    eventBus.emit("store:changed");
  },

  setCalendarMode(mode) {
    state.calendarMode = mode;
    eventBus.emit("ui:calendar:mode:changed", mode);
    eventBus.emit("store:changed");
  },

  setTab(tab) {
    state.activeTab = tab;
    eventBus.emit("ui:tab:changed", tab);
    eventBus.emit("store:changed");
  },

  setView(view) {
    state.currentView = view;
    eventBus.emit("ui:view:changed", view);
    eventBus.emit("store:changed");
  },

  setSearchQuery(query) {
    state.searchQuery = query;
    eventBus.emit("ui:search:changed", query);
    eventBus.emit("store:changed");
  },

  save(tasks = state.tasks, tags = state.tags) {
    state.tasks = tasks;
    state.tags = tags;

    saveToStorage({ tasks: state.tasks, tags: state.tags });

    this._rawCache = CoreStore.getNamespace(TASK_NAMESPACE) || {};
    this.dispatchStateEvents();
  },
};
