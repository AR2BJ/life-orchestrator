import { StateManager, state } from "@/models/state.model.js";

import { eventBus } from "@/services/event-bus.service.js";

class StoreService {
  constructor() {
    StateManager.init();
  }

  // --- GETTERS ---
  get plans() {
    return StateManager.getPlans();
  }

  get logs() {
    return StateManager.getLogs();
  }

  get templates() {
    return StateManager.getTemplates();
  }

  get activeTab() {
    return StateManager.getActiveTab();
  }

  get filteredData() {
    return StateManager.getFilteredDataForActiveTab();
  }

  get lifeAreas() {
    return StateManager.getLifeAreas();
  }

  // --- SETTERS & MUTATIONS ---
  setPlans(plans) {
    state.plans = plans;
    StateManager.save();
    eventBus.emit("store:plans:changed", plans);
    eventBus.emit("store:changed", { key: "plans", value: plans });
  }

  setLogs(logs) {
    state.logs = logs;
    StateManager.save();
    eventBus.emit("store:logs:changed", logs);
    eventBus.emit("store:changed", { key: "logs", value: logs });
  }

  setTemplates(templates) {
    state.templates = templates;
    StateManager.save();
    eventBus.emit("store:templates:changed", templates);
    eventBus.emit("store:changed", { key: "templates", value: templates });
  }

  // --- UI CONTROLS ---
  setTab(tab) {
    StateManager.setTab(tab);
    eventBus.emit("ui:tab:changed", tab);
    eventBus.emit("store:changed", { key: "activeTab", value: tab });
  }

  setCalendarMode(mode) {
    StateManager.setCalendarMode(mode);
    eventBus.emit("ui:calendar:mode:changed", mode);
    eventBus.emit("store:changed", { key: "calendarMode", value: mode });
  }

  setLifeAreaFilter(lifeAreaId) {
    StateManager.setLifeAreaFilter(lifeAreaId);
    eventBus.emit("ui:filter:lifeArea", lifeAreaId);
    eventBus.emit("store:changed", {
      key: "lifeAreaFilter",
      value: lifeAreaId,
    });
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
