import { StateManager, state } from "@/models/state.model.js";

import { eventBus } from "@/services/event-bus.service.js";

class StoreService {
  constructor() {
    this.init();
  }

  async init() {
    StateManager.init();
  }

  // --- GETTERS ---
  get tags() {
    return StateManager.getTags();
  }

  get notes() {
    return StateManager.getNotes();
  }

  get snippets() {
    return StateManager.getSnippets();
  }

  get bookmarks() {
    return StateManager.getBookmarks();
  }

  get cheatsheets() {
    return StateManager.getCheatSheets();
  }

  get activeTab() {
    return StateManager.getActiveTab();
  }

  get filteredData() {
    return StateManager.getFilteredDataForActiveTab();
  }

  // --- SETTERS & MUTATIONS ---
  async setTags(tags) {
    state.tags = tags;
    StateManager.save();
    eventBus.emit("store:tags:changed", tags);
    eventBus.emit("store:changed", { key: "tags", value: tags });
  }

  async setNotes(notes) {
    state.notes = notes;
    StateManager.save();
    eventBus.emit("store:notes:changed", notes);
    eventBus.emit("store:changed", { key: "notes", value: notes });
  }

  async setSnippets(snippets) {
    state.snippets = snippets;
    StateManager.save();
    eventBus.emit("store:snippets:changed", snippets);
    eventBus.emit("store:changed", { key: "snippets", value: snippets });
  }

  async setBookmarks(bookmarks) {
    state.bookmarks = bookmarks;
    StateManager.save();
    eventBus.emit("store:bookmarks:changed", bookmarks);
    eventBus.emit("store:changed", { key: "bookmarks", value: bookmarks });
  }

  async setCheatSheets(cheatsheets) {
    state.cheatsheets = cheatsheets;
    StateManager.save();
    eventBus.emit("store:cheatsheets:changed", cheatsheets);
    eventBus.emit("store:changed", { key: "cheatsheets", value: cheatsheets });
  }

  // --- UI CONTROLS ---
  setTab(tab) {
    StateManager.setTab(tab);
    eventBus.emit("ui:tab:changed", tab);
    eventBus.emit("store:changed", { key: "activeTab", value: tab });
  }

  setCategoryFilter(category) {
    StateManager.setCategoryFilter(category);
    eventBus.emit("ui:filter:category", category);
    eventBus.emit("store:changed", {
      key: "categoryFilter",
      value: category,
    });
  }

  setFilterBy(filterValue) {
    StateManager.setFilterBy(filterValue);
    eventBus.emit("ui:filter:changed", filterValue);
    eventBus.emit("store:changed", { key: "filterBy", value: filterValue });
  }

  setSortBy(sortBy) {
    StateManager.setSortBy(sortBy);
    eventBus.emit("ui:sort:changed", sortBy);
    eventBus.emit("store:changed", { key: "sortBy", value: sortBy });
  }

  setSearchQuery(query) {
    StateManager.setSearchQuery(query);
    eventBus.emit("ui:search:changed", query);
    eventBus.emit("store:changed", { key: "searchQuery", value: query });
  }
}

export const store = new StoreService();
