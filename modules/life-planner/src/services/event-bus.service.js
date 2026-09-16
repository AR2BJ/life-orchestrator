class EventBusService {
  constructor() {
    this.events = {};
  }

  /**
   * Subscribe to an event
   * @param {string} event
   * @param {Function} callback
   * @returns {Function} Unsubscribe function
   */
  subscribe(event, callback) {
    if (typeof callback !== "function") {
      throw new Error("Callback must be a function");
    }

    if (!this.events[event]) {
      this.events[event] = [];
    }

    this.events[event].push(callback);

    // Return unsubscribe callback function
    return () => {
      if (this.events[event]) {
        this.events[event] = this.events[event].filter((cb) => cb !== callback);
      }
    };
  }

  /**
   * Subscribe to an event only once
   * @param {string} event
   * @param {Function} callback
   * @returns {Function} Unsubscribe function
   */
  once(event, callback) {
    const unsubscribe = this.subscribe(event, (data) => {
      unsubscribe();
      callback(data);
    });
    return unsubscribe;
  }

  /**
   * Emit an event to all subscribers
   * @param {string} event
   * @param {*} data
   */
  emit(event, data) {
    if (this.events[event]) {
      // Slice array to prevent mutation issues during execution
      this.events[event].slice().forEach((callback) => {
        try {
          callback(data);
        } catch (error) {
          console.error(
            `Error executing listener for event "${event}":`,
            error,
          );
        }
      });
    }
  }

  /**
   * Remove all subscribers for a specific event or clear all events
   * @param {string} [event]
   */
  clear(event) {
    if (event) {
      delete this.events[event];
    } else {
      this.events = {};
    }
  }
}

export const eventBus = new EventBusService();
