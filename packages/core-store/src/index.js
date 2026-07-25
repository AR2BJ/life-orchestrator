export class CoreStore {
  constructor(namespace) {
    this.namespace = `LO_CORE_${namespace.toUpperCase()}`;
  }

  get() {
    try {
      const data = localStorage.getItem(this.namespace);
      return data ? JSON.parse(data) : null;
    } catch (err) {
      console.error(`[CoreStore Error] Failed to read ${this.namespace}:`, err);
      return null;
    }
  }

  set(data) {
    try {
      localStorage.setItem(this.namespace, JSON.stringify(data));
      return true;
    } catch (err) {
      console.error(
        `[CoreStore Error] Failed to write ${this.namespace}:`,
        err,
      );
      return false;
    }
  }

  clear() {
    localStorage.removeItem(this.namespace);
  }
}
