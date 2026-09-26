import {
  BOOKMARK_CATEGORIES,
  CHEATSHEET_CATEGORIES,
  NOTE_CATEGORIES,
  SNIPPET_CATEGORIES,
} from "@/utils/constants/options-value.constants.js";
import {
  STORAGE_KEY,
  loadFromStorage,
  saveToStorage,
} from "./storage.model.js";

import { eventBus } from "@/services/event-bus.service.js";

const CATEGORY_MAP = {
  notes: NOTE_CATEGORIES,
  snippets: SNIPPET_CATEGORIES,
  bookmarks: BOOKMARK_CATEGORIES,
  cheatsheets: CHEATSHEET_CATEGORIES,
};

export const state = {
  tags: [],
  notes: [],
  snippets: [],
  bookmarks: [],
  cheatsheets: [],
  activeTab: "notes", // "notes" | "snippets" | "bookmarks" | "cheatsheets"
  currentView: "mind",
  analyticsUI: {
    heatmapView: "weekly", // 'weekly' | 'monthly' | 'yearly'
  },
  notesUI: {
    selectedCategory: "all",
    filterBy: "all",
    searchQuery: "",
    sortBy: "updated_desc",
  },
  snippetsUI: {
    selectedCategory: "all",
    filterBy: "all",
    searchQuery: "",
    sortBy: "updated_desc",
  },
  bookmarksUI: {
    selectedCategory: "all",
    filterBy: "all",
    searchQuery: "",
    sortBy: "created_desc",
  },
  cheatsheetsUI: {
    selectedCategory: "all",
    filterBy: "all",
    searchQuery: "",
    sortBy: "title_asc",
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
    const entities = ["tags", "notes", "snippets", "bookmarks", "cheatsheets"];

    entities.forEach((entity) => {
      state[entity] = saved?.[entity] || [];
    });

    this._rawCache = localStorage.getItem(STORAGE_KEY) || "";

    if (notify) this.dispatchStateEvents();
  },

  dispatchStateEvents() {
    eventBus.emit("store:tags:changed", state.tags);
    eventBus.emit("store:notes:changed", state.notes);
    eventBus.emit("store:snippets:changed", state.snippets);
    eventBus.emit("store:bookmarks:changed", state.bookmarks);
    eventBus.emit("store:cheatsheets:changed", state.cheatsheets);
    eventBus.emit("ui:tab:changed", state.activeTab);
    eventBus.emit("store:changed", state);
  },

  setupReactiveEngine() {
    window.addEventListener("storage", (event) => {
      if (event.key === STORAGE_KEY) {
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

  getTags() {
    return state.tags || [];
  },

  getNotes() {
    return state.notes || [];
  },

  getSnippets() {
    return state.snippets || [];
  },

  getBookmarks() {
    return state.bookmarks || [];
  },

  getCheatSheets() {
    return state.cheatsheets || [];
  },

  getCategories() {
    return CATEGORY_MAP[state.activeTab] || [];
  },

  getActiveUIState() {
    const key = `${state.activeTab}UI`;
    return state[key] || {};
  },

  getHeatmapView() {
    return state.analyticsUI?.heatmapView || "weekly";
  },

  /**
   * Generic Universal Data Filtering Engine for all Entities
   */
  getFilteredDataForActiveTab() {
    const tab = state.activeTab;
    const ui = this.getActiveUIState();

    let list = Array.isArray(state[tab]) ? [...state[tab]] : [];
    if (!list.length) return [];

    // 1. Filter by Category
    if (ui.selectedCategory && ui.selectedCategory !== "all")
      list = list.filter(
        (item) => String(item.category) === String(ui.selectedCategory),
      );

    // 2. Filter by Flags (Pinned/Unpinned)
    if (ui.filterBy && ui.filterBy !== "all")
      list = this.filterItemsByFlag(list, ui.filterBy);

    // 3. Multi-Word Global Entity Search Engine
    if (ui.searchQuery && ui.searchQuery.trim() !== "")
      list = this.searchItems(list, ui.searchQuery);

    // 4. Universal Sorting
    return this.sortItems(list, ui.sortBy);
  },

  filterItemsByFlag(items, filterValue) {
    return items.filter((item) => {
      if (filterValue === "pinned") return Boolean(item.pinned);
      if (filterValue === "unpinned") return !item.pinned;
      return true;
    });
  },

  searchItems(items, query) {
    const rawQuery = query.toLowerCase().trim();

    const exactPhrases = [];
    const phraseRegex = /"([^"]+)"/g;
    let match;

    while ((match = phraseRegex.exec(rawQuery)) !== null) {
      if (match[1]) exactPhrases.push(match[1].trim());
    }

    const cleanQuery = rawQuery.replace(phraseRegex, "").trim();
    const tokens = cleanQuery.split(/\s+/).filter(Boolean);

    const globalTagsMap = new Map(
      (state.tags || []).map((t) => [t.id, (t.name || "").toLowerCase()]),
    );

    return items
      .map((item) => {
        let score = 0;

        const title = (item.title || "").toLowerCase();
        const desc = (item.description || "").toLowerCase();
        const content = (item.content || "").toLowerCase();
        const code = (item.code || "").toLowerCase();
        const url = (item.url || "").toLowerCase();
        const domain = (item.domain || "").toLowerCase();

        const createdAt = String(
          item.createdAt || item.created_at || "",
        ).toLowerCase();

        const itemTagNames = Array.isArray(item.tagIds)
          ? item.tagIds.map((id) => globalTagsMap.get(id) || "").filter(Boolean)
          : [];

        const cheatsheetContent = Array.isArray(item.items)
          ? item.items
              .map(
                (i) => `${i.key || ""} ${i.value || ""} ${i.description || ""}`,
              )
              .join(" ")
              .toLowerCase()
          : "";

        const passesExact = exactPhrases.every((phrase) => {
          return (
            title.includes(phrase) ||
            desc.includes(phrase) ||
            content.includes(phrase) ||
            code.includes(phrase) ||
            url.includes(phrase) ||
            domain.includes(phrase) ||
            createdAt.includes(phrase) ||
            cheatsheetContent.includes(phrase)
          );
        });

        if (!passesExact) return { item, score: -1, matchesAllTokens: false };

        const matchesAllTokens = tokens.every((token) => {
          if (token.startsWith("#")) {
            const tagToken = token.slice(1);
            if (!tagToken) return true;
            const inTags = itemTagNames.some((t) => t.includes(tagToken));
            if (inTags) score += 15;
            return inTags;
          }

          const inTitle = title.includes(token);
          const inCode = code.includes(token);
          const inContent = content.includes(token);
          const inCheatsheet = cheatsheetContent.includes(token);
          const inDesc = desc.includes(token);
          const inCreatedAt = createdAt.includes(token);
          const inUrl = url.includes(token) || domain.includes(token);

          if (inTitle) score += 12;
          if (inCode) score += 7;
          if (inContent) score += 5;
          if (inCheatsheet) score += 5;
          if (inDesc) score += 3;
          if (inCreatedAt) score += 3;
          if (inUrl) score += 2;

          return (
            inTitle ||
            inCode ||
            inContent ||
            inCheatsheet ||
            inDesc ||
            inCreatedAt ||
            inUrl
          );
        });

        return { item, score, matchesAllTokens };
      })
      .filter((entry) => entry.matchesAllTokens)
      .sort((a, b) => b.score - a.score)
      .map((entry) => entry.item);
  },

  sortItems(items, sortBy) {
    return [...items].sort((a, b) => {
      if (sortBy === "title_asc")
        return (a.title || "").localeCompare(b.title || "", "fa");

      if (sortBy === "title_desc")
        return (b.title || "").localeCompare(a.title || "", "fa");

      switch (sortBy) {
        case "created_desc":
          return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
        case "created_asc":
          return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
        case "updated_desc":
          return new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0);
        case "updated_asc":
          return new Date(a.updatedAt || 0) - new Date(b.updatedAt || 0);
        default:
          return 0;
      }
    });
  },

  // --- SETTERS & UI CONTROL ---
  setView(view) {
    state.currentView = view;
    eventBus.emit("ui:view:changed", view);
    eventBus.emit("store:changed", state);
  },

  setTab(tab) {
    if (["notes", "snippets", "bookmarks", "cheatsheets"].includes(tab)) {
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

  setCategoryFilter(category) {
    const ui = this.getActiveUIState();
    ui.selectedCategory = category;
    eventBus.emit("ui:filter:category", category);
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
      tags: state.tags,
      notes: state.notes,
      snippets: state.snippets,
      bookmarks: state.bookmarks,
      cheatsheets: state.cheatsheets,
    });

    this._rawCache = localStorage.getItem(STORAGE_KEY) || "";
    this.dispatchStateEvents();
  },
};
