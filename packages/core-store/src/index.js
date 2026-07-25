const ROOT_KEY = "LIFE_ORCHESTRATOR_STORAGE";
const STORAGE_VERSION = 1;

export class CoreStore {
  static getRawStorage() {
    try {
      const raw = localStorage.getItem(ROOT_KEY);
      return raw ? JSON.parse(raw) : { version: STORAGE_VERSION };
    } catch (err) {
      console.error("[CoreStore] Global read error:", err);
      return { version: STORAGE_VERSION };
    }
  }

  static setRawStorage(data) {
    try {
      localStorage.setItem(ROOT_KEY, JSON.stringify(data));
      return true;
    } catch (err) {
      console.error("[CoreStore] Global write error:", err);
      return false;
    }
  }

  static getNamespace(namespace) {
    const storage = this.getRawStorage();
    return storage[namespace] ?? null;
  }

  static setNamespace(namespace, data) {
    const storage = this.getRawStorage();
    storage[namespace] = data;
    return this.setRawStorage(storage);
  }

  static clearNamespace(namespace) {
    const storage = this.getRawStorage();
    delete storage[namespace];
    return this.setRawStorage(storage);
  }

  static purgeAll() {
    try {
      localStorage.removeItem(ROOT_KEY);
      return true;
    } catch (err) {
      console.error("[CoreStore] Purge error:", err);
      return false;
    }
  }
}
