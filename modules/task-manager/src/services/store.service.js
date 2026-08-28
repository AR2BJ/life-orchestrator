import { TASK_NAMESPACE, loadFromStorage } from "@/models/storage.model.js";

import { ROOT_KEY } from "@life-orchestrator/core-store";
import { StateManager } from "@/models/state.model.js";
import { eventBus } from "./event-bus.service.js";

class StoreService {
  constructor() {
    this.cacheKey = TASK_NAMESPACE;
    this.lastRawString = "";
    this.initCache();
    this.listenToStorage();
  }

  initCache() {
    this.lastRawString = localStorage.getItem(ROOT_KEY) || "";
  }

  listenToStorage() {
    window.addEventListener("storage", (e) => {
      if (e.key === ROOT_KEY) {
        this.checkAndNotify();
      }
    });

    setInterval(() => {
      this.checkAndNotify();
    }, 500);
  }

  checkAndNotify() {
    const currentRawString = localStorage.getItem(ROOT_KEY) || "";

    if (currentRawString !== this.lastRawString) {
      this.lastRawString = currentRawString;

      if (typeof StateManager?.reloadFromStorage === "function") {
        StateManager.reloadFromStorage(false);
      }

      this.notifyChanges();
    }
  }

  notifyChanges() {
    const updatedData = loadFromStorage();
    if (updatedData) {
      eventBus.emit("store:tasks:changed", updatedData.tasks);
      eventBus.emit("store:tags:changed", updatedData.tags);
      eventBus.emit("store:changed", updatedData);
    }
  }
}

export const store = new StoreService();
