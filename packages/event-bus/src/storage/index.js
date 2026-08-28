import { SYSTEM_EVENTS, globalEventBus } from "../events";

class ReactiveStorage {
  constructor() {
    this.initCrossTabStorageListener();
  }

  safeParse(data) {
    if (!data) return null;
    try {
      return JSON.parse(data);
    } catch {
      return data;
    }
  }

  initCrossTabStorageListener() {
    window.addEventListener("storage", (event) => {
      if (!event.key) return;

      globalEventBus.dispatchLocal(
        `${SYSTEM_EVENTS.STORAGE_CHANGED}-${event.key}`,
        {
          key: event.key,
          newValue: this.safeParse(event.newValue),
          oldValue: this.safeParse(event.oldValue),
          isCrossTab: true,
        },
      );
    });
  }

  getItem(key) {
    const data = localStorage.getItem(key);
    return this.safeParse(data);
  }

  setItem(key, value) {
    const stringified =
      typeof value === "object" ? JSON.stringify(value) : String(value);
    localStorage.setItem(key, stringified);

    globalEventBus.dispatchLocal(`${SYSTEM_EVENTS.STORAGE_CHANGED}-${key}`, {
      key,
      newValue: value,
      isCrossTab: false,
    });
  }

  removeItem(key) {
    localStorage.removeItem(key);

    globalEventBus.dispatchLocal(`${SYSTEM_EVENTS.STORAGE_CHANGED}-${key}`, {
      key,
      newValue: null,
      isCrossTab: false,
    });
  }
}

export const reactiveStorage = new ReactiveStorage();
