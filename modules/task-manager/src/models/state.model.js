import { loadFromStorage, saveToStorage } from "./storage.model.js";

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
  init() {
    const saved = loadFromStorage();
    if (saved) {
      state.tasks = saved.tasks || [];
      state.tags = saved.tags || [];
    }
    return state;
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
      list = list.filter((task) => task.tags.includes(state.selectedTag));
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

        const tagsMatch = task.tags?.some((tagId) => {
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

  setDateFilter(filter) {
    state.dateFilter = filter;
  },

  setSelectedTag(tag) {
    state.selectedTag = tag;
  },

  setPriority(priority) {
    state.currentPriority = priority;
  },

  setStatus(status) {
    state.currentStatus = status;
  },

  setSortBy(sortBy) {
    state.sortBy = sortBy;
  },

  setMatrixMode(mode) {
    state.matrixMode = mode;
  },

  setCalendarMode(mode) {
    state.calendarMode = mode;
  },

  setTab(tab) {
    state.activeTab = tab;
  },

  setView(view) {
    state.currentView = view;
  },

  setSearchQuery(query) {
    state.searchQuery = query;
  },

  save(tasks = state.tasks, tags = state.tags) {
    state.tasks = tasks;
    state.tags = tags;
    saveToStorage({ tasks: state.tasks, tags: state.tags });
  },
};
