export const SYSTEM_EVENTS = Object.freeze({
  // Task Events
  TASKS_RESET: "system:tasks-reset",
  TASK_DELETED: "system:task-deleted",
  TASK_UPDATED: "system:task-updated",
  TASK_CREATED: "system:task-created",
  TASK_ARCHIVE: "system:task-archive",
  TASK_RESTORE: "system:task-restore",
  TASK_UPDATED_STATUS: "system:task-updated-status",

  // Note Events
  NOTE_RESET: "system:notes-reset",
  NOTE_DELETED: "system:note-deleted",
  NOTE_UPDATED: "system:note-updated",
  NOTE_CREATED: "system:note-created",

  // Habit Events
  HABIT_COMPLETED: "system:habit-completed",
  HABITS_RESET: "system:habits-reset",

  // Time / Timer Events
  TIMER_STARTED: "system:timer-started",
  TIMER_STOPPED: "system:timer-stopped",

  // Global State
  THEME_CHANGED: "system:theme-changed",
  STORAGE_CHANGED: "system:storage-changed",
});

class HybridEventBus {
  constructor(channelName = "life_orchestrator_bus") {
    this.bus = new EventTarget();
    this.channelName = channelName;
    this.tabId = this.generateTabId();

    if ("BroadcastChannel" in window) {
      this.channel = new BroadcastChannel(this.channelName);
      this.channel.onmessage = this.handleBroadcastMessage.bind(this);
    } else {
      console.warn("BroadcastChannel is not supported in this environment.");
    }
  }

  generateTabId() {
    return `tab_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  }

  emit(eventName, payload = {}) {
    const message = {
      eventName,
      payload,
      senderTabId: this.tabId,
      timestamp: Date.now(),
    };

    this.dispatchLocal(eventName, payload);

    if (this.channel) {
      this.channel.postMessage(message);
    }
  }

  on(eventName, callback) {
    const handler = (event) => callback(event.detail);
    this.bus.addEventListener(eventName, handler);

    return () => {
      this.bus.removeEventListener(eventName, handler);
    };
  }

  dispatchLocal(eventName, payload) {
    const event = new CustomEvent(eventName, { detail: payload });
    this.bus.dispatchEvent(event);
  }

  handleBroadcastMessage(event) {
    const { eventName, payload, senderTabId } = event.data;

    if (senderTabId === this.tabId) return;

    this.dispatchLocal(eventName, payload);
  }
}

export const globalEventBus = new HybridEventBus();
