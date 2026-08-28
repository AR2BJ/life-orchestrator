// ============================================================
// core-store.js
// Enterprise Microservices State Engine v1.0
// ============================================================

/**
 * Root key for localStorage
 * @constant {string}
 */
export const ROOT_KEY = "LIFE_ORCHESTRATOR_STORAGE";

/**
 * Current storage version for migration handling
 * @constant {number}
 */
const STORAGE_VERSION = 1;

// ============================================================
// TYPE DEFINITIONS & CONSTANTS
// ============================================================

/**
 * Store event types
 * @enum {string}
 */
const STORE_EVENTS = {
  /** Mutation event */
  MUTATION: "store:mutation",
  /** Subscription event */
  SUBSCRIPTION: "store:subscription",
  /** Transaction event */
  TRANSACTION: "store:transaction",
  /** Sync event */
  SYNC: "store:sync",
  /** Error event */
  ERROR: "store:error",
  /** Recovery event */
  RECOVERY: "store:recovery",
};

/**
 * Transaction priority levels
 * @enum {number}
 */
const TRANSACTION_PRIORITY = {
  /** Critical transactions that must execute immediately */
  CRITICAL: 0,
  /** High priority transactions */
  HIGH: 1,
  /** Normal priority transactions (default) */
  NORMAL: 2,
  /** Low priority transactions */
  LOW: 3,
  /** Background transactions */
  BACKGROUND: 4,
};

/**
 * Transaction status
 * @enum {string}
 */
const TRANSACTION_STATUS = {
  PENDING: "pending",
  PROCESSING: "processing",
  COMPLETED: "completed",
  FAILED: "failed",
  CANCELLED: "cancelled",
};

/**
 * Default configuration for CoreStore
 * @type {Object}
 */
const DEFAULT_CONFIG = {
  /** Maximum number of history entries */
  maxHistoryDepth: 100,
  /** Enable persistent storage */
  enablePersist: true,
  /** Enable undo/redo functionality */
  enableUndo: true,
  /** Enable validation */
  enableValidation: true,
  /** Debounce time for persistence in ms */
  persistDebounce: 300,
  /** Default namespace */
  namespace: "default",
  /** Transaction timeout in ms */
  transactionTimeout: 5000,
  /** Maximum retry attempts */
  maxRetries: 3,
  /** Batch size for batch processing */
  batchSize: 10,
  /** Batch interval in ms */
  batchInterval: 100,
  /** Enable batch processing */
  enableBatching: true,
};

// ============================================================
// CUSTOM ERROR CLASS
// ============================================================

/**
 * Custom error class for store operations
 * @extends Error
 */
class StoreError extends Error {
  /**
   * Create a StoreError instance
   * @param {string} message - Error message
   * @param {string} code - Error code
   * @param {string} path - Store path where error occurred
   * @param {Object} [metadata={}] - Additional error metadata
   */
  constructor(message, code, path, metadata = {}) {
    super(message);
    this.name = "StoreError";
    /** @type {string} */
    this.code = code;
    /** @type {string} */
    this.path = path;
    /** @type {Object} */
    this.metadata = metadata;
    /** @type {string} */
    this.timestamp = new Date().toISOString();
  }
}

// ============================================================
// VALIDATION ENGINE
// ============================================================

/**
 * Validation engine for store data
 * @class
 */
class ValidationEngine {
  /** @type {Map<string, Function>} */
  static validators = new Map();

  /**
   * Register a validator for a path pattern
   * @param {string|RegExp} pathPattern - Path pattern to match
   * @param {Function} validatorFn - Validation function returning boolean or error message
   */
  static registerValidator(pathPattern, validatorFn) {
    this.validators.set(pathPattern, validatorFn);
  }

  /**
   * Validate a value against registered validators
   * @param {string} path - Store path
   * @param {*} value - Value to validate
   * @param {Object} state - Current store state
   * @returns {boolean} Validation result
   * @throws {StoreError} If validation fails
   */
  static validate(path, value, state) {
    for (const [pattern, validator] of this.validators) {
      if (this.#matchPattern(path, pattern)) {
        const result = validator(value, state);
        if (result !== true) {
          throw new StoreError(
            `Validation failed for ${path}: ${result}`,
            "VALIDATION_ERROR",
            path,
            { pattern, value },
          );
        }
      }
    }
    return true;
  }

  /**
   * Check if path matches pattern
   * @param {string} path - Store path
   * @param {string|RegExp} pattern - Pattern to match
   * @returns {boolean} Whether path matches pattern
   * @private
   */
  static #matchPattern(path, pattern) {
    if (pattern === "*") return true;
    if (pattern instanceof RegExp) return pattern.test(path);
    return path.startsWith(pattern);
  }
}

// ============================================================
// CORE STORE ENGINE
// ============================================================

/**
 * Enterprise-grade state management engine with support for multiple applications,
 * transactions, undo/redo, validation, and reactive subscriptions.
 *
 * @class CoreStore
 * @example
 * const store = new CoreStore({
 *   maxHistoryDepth: 100,
 *   enablePersist: true
 * });
 *
 * store.registerApp('inventory', { products: [] });
 * store.set('inventory.products', [{ id: 1, name: 'Product 1' }]);
 */
export class CoreStore {
  /** @type {Object} Private state storage */
  #state = {};

  /** @type {Map<Function, Object>} Path-based subscription mapping */
  #listeners = new Map();

  /** @type {Array<Object>} History stack for undo */
  #history = [];

  /** @type {Array<Object>} Future stack for redo */
  #future = [];

  /** @type {Object} Store configuration */
  #config = {};

  /** @type {number|null} Persist timer handle */
  #persistTimer = null;

  /** @type {boolean} Transaction active flag */
  #isTransactionActive = false;

  /** @type {Array<Object>} Transaction queue with priority */
  #transactionStack = [];

  /** @type {Map<string, Object>} Application namespaces */
  #appNamespaces = new Map();

  /** @type {Array<Function>} Middleware functions */
  #middlewares = [];

  /** @type {Map<string, Object>} Snapshot cache */
  #snapshotCache = new Map();

  /** @type {Map<string, Object>} Computed values cache */
  #computedValues = new Map();

  /** @type {Map<string, Object>} Transaction tracking with resolve/reject */
  #transactionTracker = new Map();

  /** @type {Array<Object>} Batch queue */
  #batchQueue = [];

  /** @type {number|null} Batch timer handle */
  #batchTimer = null;

  /** @type {boolean} Queue processing scheduled flag */
  #queueProcessingScheduled = false;

  /**
   * Create a new CoreStore instance
   * @param {Object} [config={}] - Configuration options
   * @param {number} [config.maxHistoryDepth=100] - Maximum history entries
   * @param {boolean} [config.enablePersist=true] - Enable localStorage persistence
   * @param {boolean} [config.enableUndo=true] - Enable undo/redo
   * @param {boolean} [config.enableValidation=true] - Enable validation
   * @param {number} [config.persistDebounce=300] - Debounce time for persistence
   * @param {string} [config.namespace='default'] - Default namespace
   * @param {number} [config.transactionTimeout=5000] - Transaction timeout in ms
   * @param {number} [config.maxRetries=3] - Maximum retry attempts
   * @param {number} [config.batchSize=10] - Batch size for batch processing
   * @param {number} [config.batchInterval=100] - Batch interval in ms
   * @param {boolean} [config.enableBatching=true] - Enable batch processing
   */
  constructor(config = {}) {
    this.#config = { ...DEFAULT_CONFIG, ...config };
    this.#initialize();
  }

  // ============================================================
  // INITIALIZATION
  // ============================================================

  /**
   * Initialize the store
   * @private
   */
  #initialize() {
    try {
      this.#loadFromDisk();
      this.#setupAutoPersist();
      this.#bindGlobalEvents();
      this.#initializeNamespaces();
      console.log("[CoreStore] Initialized successfully", {
        version: STORAGE_VERSION,
        apps: Array.from(this.#appNamespaces.keys()),
      });
    } catch (error) {
      console.error("[CoreStore] Initialization failed:", error);
      this.#state = { version: STORAGE_VERSION };
    }
  }

  /**
   * Setup automatic persistence on page unload
   * @private
   */
  #setupAutoPersist() {
    if (typeof window === "undefined") return;

    const handleBeforeUnload = () => this.#persistToDisk();
    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("pagehide", handleBeforeUnload);
  }

  /**
   * Bind global window events
   * @private
   */
  #bindGlobalEvents() {
    if (typeof window === "undefined") return;

    window.addEventListener("storage", (event) => {
      if (event.key === ROOT_KEY && event.newValue) {
        try {
          const incoming = JSON.parse(event.newValue);
          if (incoming.version > this.#state.version) {
            this.#mergeExternalState(incoming.data);
          }
        } catch (error) {
          console.warn("[CoreStore] Failed to merge external state:", error);
        }
      }
    });
  }

  /**
   * Merge external state from another tab/window
   * @param {Object} externalState - External state to merge
   * @private
   */
  #mergeExternalState(externalState) {
    if (!externalState || typeof externalState !== "object") return;

    // Deep merge strategy
    const merged = this.#deepMerge(this.#state, externalState);
    this.#state = this.#deepFreeze(merged);

    // Update app namespaces
    if (externalState.__apps) {
      Object.entries(externalState.__apps).forEach(([name, data]) => {
        this.#appNamespaces.set(name, this.#deepFreeze(data));
      });
    }

    this.#notify("*", {
      actionType: "EXTERNAL_MERGE",
      state: this.#state,
    });
  }

  /**
   * Deep merge two objects
   * @param {Object} target - Target object
   * @param {Object} source - Source object
   * @returns {Object} Merged object
   * @private
   */
  #deepMerge(target, source) {
    const result = { ...target };

    for (const key in source) {
      if (source.hasOwnProperty(key)) {
        if (
          source[key] &&
          typeof source[key] === "object" &&
          !Array.isArray(source[key])
        ) {
          result[key] = this.#deepMerge(target[key] || {}, source[key]);
        } else {
          result[key] = source[key];
        }
      }
    }

    return result;
  }

  /**
   * Initialize application namespaces from state
   * @private
   */
  #initializeNamespaces() {
    const apps = this.#state.__apps || {};
    Object.entries(apps).forEach(([name, data]) => {
      this.#appNamespaces.set(name, data);
    });
  }

  // ============================================================
  // STORAGE OPERATIONS
  // ============================================================

  /**
   * Load state from localStorage
   * @private
   * @throws {StoreError} If loading fails
   */
  #loadFromDisk() {
    try {
      const raw = localStorage.getItem(ROOT_KEY);
      if (!raw) {
        this.#state = this.#deepFreeze({
          version: STORAGE_VERSION,
          __apps: {},
        });
        return;
      }

      const parsed = JSON.parse(raw);
      this.#state = this.#deepFreeze(
        parsed.data || { version: STORAGE_VERSION },
      );

      // Upgrade old version if needed
      if (parsed.version < STORAGE_VERSION) {
        this.#upgradeState(parsed.data);
      }
    } catch (error) {
      throw new StoreError("Failed to load from disk", "LOAD_ERROR", "root", {
        error,
      });
    }
  }

  /**
   * Persist state to localStorage
   * @private
   * @returns {Promise<boolean>} Success status
   */
  #persistToDisk() {
    if (!this.#config.enablePersist) return Promise.resolve(true);

    return new Promise((resolve) => {
      clearTimeout(this.#persistTimer);
      this.#persistTimer = setTimeout(() => {
        try {
          const payload = {
            version: STORAGE_VERSION,
            updatedAt: new Date().toISOString(),
            data: this.#state,
            checksum: this.#calculateChecksum(this.#state),
          };
          localStorage.setItem(ROOT_KEY, JSON.stringify(payload));
          resolve(true);
        } catch (error) {
          console.error("[CoreStore] Persist failed:", error);
          resolve(false);
        }
      }, this.#config.persistDebounce);
    });
  }

  /**
   * Calculate checksum for integrity verification
   * @param {Object} obj - Object to hash
   * @returns {string} Checksum string
   * @private
   */
  #calculateChecksum(obj) {
    const str = JSON.stringify(obj);
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash;
    }
    return hash.toString(36);
  }

  // ============================================================
  // STATE UPGRADE
  // ============================================================

  /**
   * Upgrade state from old version
   * @param {Object} oldState - Old state to upgrade
   * @private
   */
  #upgradeState(oldState) {
    const upgraded = { ...oldState, version: STORAGE_VERSION };

    // Ensure apps namespace exists
    if (!upgraded.__apps) {
      upgraded.__apps = {};
    }

    this.#state = this.#deepFreeze(upgraded);
    this.#persistToDisk();
  }

  // ============================================================
  // IMMUTABILITY ENGINE (FIXED)
  // ============================================================

  /**
   * Deep freeze an object recursively
   * @param {*} obj - Object to freeze
   * @returns {*} Frozen object
   * @private
   */
  #deepFreeze(obj) {
    if (obj === null || typeof obj !== "object" || Object.isFrozen(obj)) {
      return obj;
    }

    // Handle arrays specially
    if (Array.isArray(obj)) {
      const frozenArray = Object.freeze(
        obj.map((item) => this.#deepFreeze(item)),
      );
      return frozenArray;
    }

    Object.freeze(obj);
    for (const key of Object.getOwnPropertyNames(obj)) {
      this.#deepFreeze(obj[key]);
    }
    return obj;
  }

  /**
   * Deep clone an object with fallback
   * @param {*} obj - Object to clone
   * @returns {*} Cloned object
   * @private
   */
  #deepClone(obj) {
    try {
      // Try structuredClone first (modern browsers)
      return structuredClone(obj);
    } catch (error) {
      // Fallback to JSON serialization for compatibility
      try {
        return JSON.parse(JSON.stringify(obj));
      } catch (jsonError) {
        // Manual deep clone as last resort
        return this.#manualDeepClone(obj);
      }
    }
  }

  /**
   * Manual deep clone as fallback
   * @param {*} obj - Object to clone
   * @returns {*} Cloned object
   * @private
   */
  #manualDeepClone(obj) {
    if (obj === null || typeof obj !== "object") return obj;

    if (Array.isArray(obj)) {
      return obj.map((item) => this.#manualDeepClone(item));
    }

    const cloned = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const value = obj[key];
        if (value && typeof value === "object") {
          cloned[key] = this.#manualDeepClone(value);
        } else {
          cloned[key] = value;
        }
      }
    }
    return cloned;
  }

  // ============================================================
  // PATH RESOLUTION ENGINE
  // ============================================================

  /**
   * Resolve a path in the state tree
   * @param {Object} root - Root object to resolve from
   * @param {string|Array<string>} pathSegment - Path to resolve
   * @returns {Object} Resolution result with parent, key, and value
   * @private
   */
  #resolvePath(root, pathSegment) {
    const segments = this.#parsePath(pathSegment);
    let current = root;
    let parent = null;
    let key = null;

    for (let i = 0; i < segments.length; i++) {
      if (current === null || current === undefined) {
        return { parent, key, value: undefined };
      }

      parent = current;
      key = segments[i];

      // Handle array access by ID
      if (Array.isArray(current)) {
        const index = this.#findInArray(current, key);
        if (i === segments.length - 1) {
          return { parent: current, key: index, value: current[index] };
        }
        current = current[index];
      } else {
        if (i === segments.length - 1) {
          return { parent, key, value: current[key] };
        }
        current = current[key];
      }
    }

    return { parent, key, value: current };
  }

  /**
   * Parse path string to array of segments
   * @param {string|Array<string>} path - Path to parse
   * @returns {Array<string>} Path segments
   * @private
   */
  #parsePath(path) {
    if (Array.isArray(path)) return path;
    return path
      .replace(/\[(\w+)\]/g, ".$1")
      .split(".")
      .filter(Boolean);
  }

  /**
   * Find item in array by identifier
   * @param {Array} arr - Array to search
   * @param {string} identifier - ID to find
   * @returns {number} Index of found item
   * @private
   */
  #findInArray(arr, identifier) {
    const index = arr.findIndex(
      (item) =>
        item &&
        (String(item.id) === identifier ||
          String(item._id) === identifier ||
          String(item.key) === identifier),
    );
    return index !== -1 ? index : parseInt(identifier, 10);
  }

  // ============================================================
  // PUBLIC API - QUERY
  // ============================================================

  /**
   * Get value at path
   * @param {string} [path=''] - Path to get value from
   * @param {*} [defaultValue=undefined] - Default value if path not found
   * @returns {*} Value at path or default
   */
  get(path = "", defaultValue = undefined) {
    if (!path) return this.#state;

    const { value } = this.#resolvePath(this.#state, path);
    return value !== undefined ? value : defaultValue;
  }

  /**
   * Get value with type validation
   * @param {string} path - Path to get value from
   * @param {Function} validator - Validation function
   * @returns {*} Validated value
   * @throws {StoreError} If validation fails
   */
  getTyped(path, validator) {
    const value = this.get(path);
    if (validator && !validator(value)) {
      throw new StoreError(
        `Type validation failed for ${path}`,
        "TYPE_ERROR",
        path,
      );
    }
    return value;
  }

  /**
   * Get app-specific state
   * @param {string} appName - Application name
   * @param {string} [path=''] - Path within app state
   * @param {*} [defaultValue=undefined] - Default value
   * @returns {*} App state value
   */
  getApp(appName, path = "", defaultValue = undefined) {
    const appState = this.#appNamespaces.get(appName);
    if (!appState) return defaultValue;

    if (!path) return appState;
    const { value } = this.#resolvePath(appState, path);
    return value !== undefined ? value : defaultValue;
  }

  /**
   * Compute and cache a derived value
   * @param {string} path - Cache key for computed value
   * @param {Function} computeFn - Computation function
   * @param {Array<string>} [dependencies=[]] - Dependency paths
   * @returns {*} Computed value
   */
  compute(path, computeFn, dependencies = []) {
    const cacheKey = `computed:${path}`;
    const depsHash = dependencies.join("|");

    if (this.#computedValues.has(cacheKey)) {
      const cached = this.#computedValues.get(cacheKey);
      if (cached.depsHash === depsHash) {
        return cached.value;
      }
    }

    const depsValues = dependencies.map((dep) => this.get(dep));
    const result = computeFn(...depsValues);

    this.#computedValues.set(cacheKey, {
      value: result,
      depsHash,
      dependencies,
    });

    return result;
  }

  // ============================================================
  // PUBLIC API - MUTATION (FIXED)
  // ============================================================

  /**
   * Set value at path
   * @param {string} path - Path to set
   * @param {*} valueOrUpdater - Value or updater function
   * @param {Object} [options={}] - Options
   * @param {boolean} [options.silent=false] - Skip notifications
   * @param {boolean} [options.validate=true] - Enable validation
   * @param {string} [options.namespace='default'] - Namespace
   * @param {number} [options.priority=2] - Transaction priority
   * @param {boolean} [options.batchable=false] - Allow batching
   * @param {number} [options.timeout=5000] - Transaction timeout
   * @returns {Promise<boolean>} Success status
   */
  set(path, valueOrUpdater, options = {}) {
    const {
      silent = false,
      validate = true,
      namespace = "default",
      priority = TRANSACTION_PRIORITY.NORMAL,
      batchable = false,
      timeout = this.#config.transactionTimeout,
    } = options;

    return this.transaction({
      actionType: "SET",
      path,
      silent,
      namespace,
      priority,
      batchable,
      timeout,
      execute: (draft) => {
        const keys = this.#parsePath(path);
        return this.#setRecursive(draft, keys, valueOrUpdater);
      },
      validate: validate
        ? (draft) => {
            const newValue = this.#resolvePath(draft, path).value;
            ValidationEngine.validate(path, newValue, draft);
          }
        : null,
    });
  }

  /**
   * Recursive set implementation
   * @param {Object} target - Target object
   * @param {Array<string>} keys - Path keys
   * @param {*} value - Value to set
   * @returns {Object} Updated object
   * @private
   */
  #setRecursive(target, keys, value) {
    const [currentKey, ...remainingKeys] = keys;
    let targetKey = currentKey;

    // Handle array access
    if (Array.isArray(target) && isNaN(Number(currentKey))) {
      const index = target.findIndex(
        (item) =>
          item &&
          (String(item.id) === currentKey || String(item._id) === currentKey),
      );
      if (index === -1) {
        throw new StoreError(
          `Entity with ID '${currentKey}' not found in array`,
          "ENTITY_NOT_FOUND",
          currentKey,
        );
      }
      targetKey = index;
    }

    const clone = Array.isArray(target) ? [...target] : { ...target };

    if (remainingKeys.length === 0) {
      const newValue =
        typeof value === "function" ? value(clone[targetKey]) : value;

      // Deep freeze the new value
      clone[targetKey] = this.#deepFreeze(newValue);
    } else {
      const nextTarget =
        clone[targetKey] ?? (isNaN(Number(remainingKeys[0])) ? {} : []);
      clone[targetKey] = this.#setRecursive(nextTarget, remainingKeys, value);
    }

    return clone;
  }

  /**
   * Delete value at path (FIXED - Immutable)
   * @param {string} path - Path to delete
   * @param {Object} [options={}] - Options
   * @param {boolean} [options.silent=false] - Skip notifications
   * @param {string} [options.namespace='default'] - Namespace
   * @param {number} [options.priority=2] - Transaction priority
   * @param {boolean} [options.batchable=false] - Allow batching
   * @param {number} [options.timeout=5000] - Transaction timeout
   * @returns {Promise<boolean>} Success status
   */
  delete(path, options = {}) {
    const {
      silent = false,
      namespace = "default",
      priority = TRANSACTION_PRIORITY.NORMAL,
      batchable = false,
      timeout = this.#config.transactionTimeout,
    } = options;

    return this.transaction({
      actionType: "DELETE",
      path,
      silent,
      namespace,
      priority,
      batchable,
      timeout,
      execute: (draft) => {
        const keys = this.#parsePath(path);
        const lastKey = keys.pop();
        const parentPath = keys.join(".");

        let parentNode = draft;
        if (keys.length > 0) {
          const resolved = this.#resolvePath(draft, parentPath);
          parentNode = resolved.value;
        }

        if (!parentNode) return draft;

        // FIXED: Create immutable copy instead of mutating directly
        if (Array.isArray(parentNode)) {
          const index = isNaN(Number(lastKey))
            ? parentNode.findIndex(
                (item) => item && String(item.id) === String(lastKey),
              )
            : Number(lastKey);

          if (index !== -1) {
            // Create new array without the item (immutable)
            const newArray = parentNode.filter((_, i) => i !== index);

            // Update the parent reference
            if (keys.length > 0) {
              // Update in the draft state tree
              const parentPathObj = this.#resolvePath(draft, keys.join("."));
              if (parentPathObj.parent) {
                if (Array.isArray(parentPathObj.parent)) {
                  parentPathObj.parent[parentPathObj.key] = newArray;
                } else {
                  parentPathObj.parent[parentPathObj.key] = newArray;
                }
              }
            } else {
              // Root level array
              return newArray;
            }
          }
        } else {
          // Object deletion - create new object without the property
          if (keys.length > 0) {
            const parentPathObj = this.#resolvePath(draft, keys.join("."));
            if (parentPathObj.parent) {
              const newParent = { ...parentPathObj.parent };
              delete newParent[lastKey];

              // Update the parent reference
              if (Array.isArray(parentPathObj.parent)) {
                parentPathObj.parent[parentPathObj.key] = newParent;
              } else {
                parentPathObj.parent[parentPathObj.key] = newParent;
              }
            }
          } else {
            // Root level deletion
            const newState = { ...draft };
            delete newState[lastKey];
            return newState;
          }
        }

        return draft;
      },
    });
  }

  // ============================================================
  // TRANSACTION ENGINE (FIXED - Event-driven)
  // ============================================================

  /**
   * Generate unique transaction ID
   * @returns {string} Transaction ID
   * @private
   */
  #generateTransactionId() {
    return `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Add transaction to batch
   * @param {Object} transaction - Transaction to batch
   * @private
   */
  #addToBatch(transaction) {
    if (!this.#config.enableBatching) {
      this.#executeTransactionImmediately(transaction);
      return;
    }

    this.#batchQueue.push(transaction);

    // Process batch after interval or when full
    clearTimeout(this.#batchTimer);
    if (this.#batchQueue.length >= this.#config.batchSize) {
      this.#processBatch();
    } else {
      this.#batchTimer = setTimeout(
        () => this.#processBatch(),
        this.#config.batchInterval,
      );
    }
  }

  /**
   * Process batch of transactions
   * @private
   */
  #processBatch() {
    if (!this.#batchQueue || this.#batchQueue.length === 0) return;

    const batch = [...this.#batchQueue];
    this.#batchQueue = [];
    this.#batchTimer = null;

    // Group by namespace and path for optimization
    const groups = new Map();
    batch.forEach((txn) => {
      const key = `${txn.namespace}:${txn.path}`;
      if (!groups.has(key)) {
        groups.set(key, []);
      }
      groups.get(key).push(txn);
    });

    // Process each group
    groups.forEach((transactions) => {
      this.#executeBatchTransactions(transactions);
    });
  }

  /**
   * Execute batch transactions
   * @param {Array<Object>} transactions - Transactions to execute
   * @private
   */
  async #executeBatchTransactions(transactions) {
    // Merge batch transactions if possible
    const mergedTransaction = this.#mergeBatchTransactions(transactions);

    if (mergedTransaction) {
      // Execute as single transaction
      await this.#executeTransactionImmediately(mergedTransaction);
    } else {
      // Execute individually
      for (const txn of transactions) {
        await this.#executeTransactionImmediately(txn);
      }
    }
  }

  /**
   * Merge batch transactions if possible
   * @param {Array<Object>} transactions - Transactions to merge
   * @returns {Object|null} Merged transaction or null
   * @private
   */
  #mergeBatchTransactions(transactions) {
    if (transactions.length <= 1) return null;

    // Check if all transactions are SET operations on same path
    const allSet = transactions.every((t) => t.actionType === "SET");
    const samePath = transactions.every((t) => t.path === transactions[0].path);

    if (allSet && samePath) {
      // Combine SET operations
      const combinedExecute = (draft) => {
        let result = draft;
        for (const txn of transactions) {
          result = txn.execute(result);
        }
        return result;
      };

      return {
        ...transactions[0],
        execute: combinedExecute,
        transactionId: this.#generateTransactionId(),
        batchable: false,
      };
    }

    return null;
  }

  /**
   * Execute a transaction with improved queue management
   * @param {Object} config - Transaction configuration
   * @param {string} config.actionType - Action type
   * @param {string} config.path - Store path
   * @param {Function} config.execute - Execution function
   * @param {Function|null} [config.validate=null] - Validation function
   * @param {boolean} [config.silent=false] - Skip notifications
   * @param {string} [config.namespace='default'] - Namespace
   * @param {number} [config.priority=2] - Transaction priority (0-4)
   * @param {number} [config.timeout=5000] - Transaction timeout in ms
   * @param {string} [config.transactionId] - Custom transaction ID
   * @param {boolean} [config.batchable=false] - Allow batching
   * @returns {Promise<boolean>} Success status
   */
  async transaction(config) {
    const {
      actionType,
      path,
      execute,
      validate = null,
      silent = false,
      namespace = "default",
      priority = TRANSACTION_PRIORITY.NORMAL,
      timeout = this.#config.transactionTimeout,
      transactionId = this.#generateTransactionId(),
      batchable = false,
    } = config;

    // Create promise with resolve/reject
    let resolvePromise, rejectPromise;
    const promise = new Promise((resolve, reject) => {
      resolvePromise = resolve;
      rejectPromise = reject;
    });

    const transaction = {
      id: transactionId,
      actionType,
      path,
      execute,
      validate,
      silent,
      namespace,
      priority,
      timeout,
      batchable,
      status: TRANSACTION_STATUS.PENDING,
      createdAt: Date.now(),
      retryCount: 0,
      maxRetries: this.#config.maxRetries,
      resolve: resolvePromise,
      reject: rejectPromise,
      timeoutTimer: null,
    };

    // Store with resolve/reject
    this.#transactionTracker.set(transactionId, transaction);

    // Setup timeout
    transaction.timeoutTimer = setTimeout(() => {
      this.#handleTransactionTimeout(transactionId);
    }, timeout);

    // If transaction is batchable, add to batch
    if (batchable && this.#config.enableBatching) {
      this.#addToBatch(transaction);
      return promise;
    }

    // If transaction is critical, execute immediately
    if (priority === TRANSACTION_PRIORITY.CRITICAL) {
      this.#executeTransactionImmediately(transaction);
      return promise;
    }

    // If no active transaction, execute now
    if (!this.#isTransactionActive) {
      this.#executeTransactionImmediately(transaction);
      return promise;
    }

    // Otherwise, queue the transaction
    this.#enqueueTransaction(transaction);

    // Process queue asynchronously
    this.#scheduleQueueProcessing();

    return promise;
  }

  /**
   * Handle transaction timeout
   * @param {string} transactionId - Transaction ID
   * @private
   */
  #handleTransactionTimeout(transactionId) {
    const transaction = this.#transactionTracker.get(transactionId);
    if (!transaction) return;

    if (
      transaction.status === TRANSACTION_STATUS.PENDING ||
      transaction.status === TRANSACTION_STATUS.PROCESSING
    ) {
      transaction.status = TRANSACTION_STATUS.FAILED;
      transaction.error = new StoreError(
        "Transaction timeout",
        "TIMEOUT",
        transaction.path,
      );

      // Remove from queue if pending
      const queueIndex = this.#transactionStack.findIndex(
        (t) => t.id === transactionId,
      );
      if (queueIndex !== -1) {
        this.#transactionStack.splice(queueIndex, 1);
      }

      // Reject the promise
      if (transaction.reject) {
        transaction.reject(transaction.error);
      }

      // Clean up
      this.#transactionTracker.delete(transactionId);
    }
  }

  /**
   * Execute transaction immediately
   * @param {Object} transaction - Transaction to execute
   * @returns {Promise<boolean>} Success status
   * @private
   */
  async #executeTransactionImmediately(transaction) {
    // Check if already processing
    if (
      this.#isTransactionActive &&
      transaction.priority !== TRANSACTION_PRIORITY.CRITICAL
    ) {
      this.#enqueueTransaction(transaction);
      this.#scheduleQueueProcessing();
      return false;
    }

    this.#isTransactionActive = true;
    transaction.status = TRANSACTION_STATUS.PROCESSING;

    const previousState = this.#state;
    const draftState = this.#deepClone(previousState);

    try {
      // Execute with retry logic
      let lastError = null;
      for (let attempt = 0; attempt <= transaction.maxRetries; attempt++) {
        try {
          // Execute the transaction
          const result = transaction.execute(draftState);

          // Apply middleware
          const processedState = this.#applyMiddlewares(
            draftState,
            transaction.actionType,
            transaction.path,
          );

          // Validate if needed
          if (transaction.validate) {
            transaction.validate(processedState);
          }

          // Freeze the new state
          const frozenState = this.#deepFreeze(processedState);

          // Update state
          this.#state = frozenState;

          // Update app namespace if needed
          if (transaction.namespace !== "default") {
            this.#updateAppNamespace(
              transaction.namespace,
              transaction.path,
              this.get(transaction.path),
            );
          }

          // History
          this.#pushHistory({
            actionType: transaction.actionType,
            path: transaction.path,
            previousState,
            nextState: frozenState,
            namespace: transaction.namespace,
            timestamp: Date.now(),
            transactionId: transaction.id,
          });

          // Persist
          await this.#persistToDisk();

          // Notify listeners
          if (!transaction.silent) {
            this.#notify(transaction.path, {
              actionType: transaction.actionType,
              state: this.get(transaction.path),
              namespace: transaction.namespace,
              transactionId: transaction.id,
            });
          }

          // Mark as completed
          transaction.status = TRANSACTION_STATUS.COMPLETED;

          // Clear timeout
          if (transaction.timeoutTimer) {
            clearTimeout(transaction.timeoutTimer);
          }

          // Resolve the promise
          if (transaction.resolve) {
            transaction.resolve(true);
          }

          this.#isTransactionActive = false;

          // Clean up tracker
          this.#transactionTracker.delete(transaction.id);

          // Process queued transactions
          this.#scheduleQueueProcessing();

          return true;
        } catch (error) {
          lastError = error;
          transaction.retryCount = attempt + 1;

          if (attempt < transaction.maxRetries) {
            // Exponential backoff
            await new Promise((resolve) =>
              setTimeout(resolve, Math.pow(2, attempt) * 100),
            );
            continue;
          }

          throw error;
        }
      }

      throw lastError;
    } catch (error) {
      console.error("[CoreStore] Transaction failed:", error);
      this.#state = previousState;

      transaction.status = TRANSACTION_STATUS.FAILED;
      transaction.error = error;

      // Clear timeout
      if (transaction.timeoutTimer) {
        clearTimeout(transaction.timeoutTimer);
      }

      // Reject the promise
      if (transaction.reject) {
        transaction.reject(error);
      }

      this.#notifyError(error, transaction.path, transaction.actionType);

      // Try to recover
      this.#attemptRecovery(transaction);

      // Clean up tracker
      this.#transactionTracker.delete(transaction.id);

      return false;
    } finally {
      this.#isTransactionActive = false;
      this.#scheduleQueueProcessing();
    }
  }

  /**
   * Enqueue transaction with priority
   * @param {Object} transaction - Transaction to enqueue
   * @private
   */
  #enqueueTransaction(transaction) {
    // Insert based on priority
    const index = this.#transactionStack.findIndex(
      (t) => t.priority > transaction.priority,
    );

    if (index === -1) {
      this.#transactionStack.push(transaction);
    } else {
      this.#transactionStack.splice(index, 0, transaction);
    }
  }

  /**
   * Schedule queue processing
   * @private
   */
  #scheduleQueueProcessing() {
    if (this.#queueProcessingScheduled) return;

    this.#queueProcessingScheduled = true;

    // Use microtask for immediate processing
    queueMicrotask(() => {
      this.#queueProcessingScheduled = false;
      this.#processTransactionQueue();
    });
  }

  /**
   * Process queued transactions with microtask queue
   * @private
   */
  #processTransactionQueue() {
    if (this.#transactionStack.length === 0 || this.#isTransactionActive) {
      return;
    }

    // Get next transaction based on priority
    const transaction = this.#transactionStack.shift();

    if (transaction) {
      // Execute asynchronously
      this.#executeTransactionImmediately(transaction).finally(() => {
        // Continue processing queue
        this.#scheduleQueueProcessing();
      });
    }
  }

  /**
   * Push history entry
   * @param {Object} record - History record
   * @private
   */
  #pushHistory(record) {
    this.#history.push(record);
    if (this.#history.length > this.#config.maxHistoryDepth) {
      this.#history.shift();
    }
    this.#future = [];
  }

  /**
   * Attempt recovery for failed transaction
   * @param {Object} transaction - Failed transaction
   * @private
   */
  #attemptRecovery(transaction) {
    // Log for monitoring
    console.warn(
      "[CoreStore] Attempting recovery for transaction:",
      transaction.id,
    );

    // Emit recovery event
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent(STORE_EVENTS.RECOVERY, {
          detail: { transaction },
        }),
      );
    }
  }

  /**
   * Cancel a pending transaction
   * @param {string} transactionId - Transaction ID to cancel
   * @returns {boolean} Success status
   */
  cancelTransaction(transactionId) {
    const transaction = this.#transactionTracker.get(transactionId);
    if (!transaction) return false;

    if (transaction.status === TRANSACTION_STATUS.PENDING) {
      // Remove from queue
      const index = this.#transactionStack.findIndex(
        (t) => t.id === transactionId,
      );
      if (index !== -1) {
        this.#transactionStack.splice(index, 1);
      }

      // Remove from batch queue
      const batchIndex = this.#batchQueue.findIndex(
        (t) => t.id === transactionId,
      );
      if (batchIndex !== -1) {
        this.#batchQueue.splice(batchIndex, 1);
      }

      transaction.status = TRANSACTION_STATUS.CANCELLED;

      // Clear timeout
      if (transaction.timeoutTimer) {
        clearTimeout(transaction.timeoutTimer);
      }

      // Reject with cancellation
      if (transaction.reject) {
        transaction.reject(
          new StoreError(
            "Transaction cancelled",
            "CANCELLED",
            transaction.path,
          ),
        );
      }

      this.#transactionTracker.delete(transactionId);
      return true;
    }

    return false;
  }

  /**
   * Get transaction status
   * @param {string} transactionId - Transaction ID
   * @returns {Object|null} Transaction status
   */
  getTransactionStatus(transactionId) {
    const txn = this.#transactionTracker.get(transactionId);
    if (!txn) return null;

    return {
      id: txn.id,
      actionType: txn.actionType,
      path: txn.path,
      status: txn.status,
      priority: txn.priority,
      createdAt: txn.createdAt,
      retryCount: txn.retryCount,
      error: txn.error || null,
    };
  }

  /**
   * Get pending transactions
   * @returns {Array<Object>} Pending transactions
   */
  getPendingTransactions() {
    return this.#transactionStack.map((t) => ({
      id: t.id,
      actionType: t.actionType,
      path: t.path,
      priority: t.priority,
      createdAt: t.createdAt,
    }));
  }

  /**
   * Clear all pending transactions
   * @returns {number} Number of cleared transactions
   */
  clearPendingTransactions() {
    const count = this.#transactionStack.length + this.#batchQueue.length;

    // Reject all pending transactions
    this.#transactionStack.forEach((t) => {
      if (t.reject) {
        t.reject(new StoreError("Transaction cleared", "CLEARED", t.path));
      }
      if (t.timeoutTimer) {
        clearTimeout(t.timeoutTimer);
      }
    });

    this.#batchQueue.forEach((t) => {
      if (t.reject) {
        t.reject(new StoreError("Transaction cleared", "CLEARED", t.path));
      }
      if (t.timeoutTimer) {
        clearTimeout(t.timeoutTimer);
      }
    });

    this.#transactionStack = [];
    this.#batchQueue = [];
    this.#transactionTracker.clear();
    return count;
  }

  // ============================================================
  // APP NAMESPACE MANAGEMENT
  // ============================================================

  /**
   * Update application namespace
   * @param {string} appName - Application name
   * @param {string} path - Path within app
   * @param {*} value - Value to update
   * @private
   */
  #updateAppNamespace(appName, path, value) {
    if (!this.#appNamespaces.has(appName)) {
      this.#appNamespaces.set(appName, {});
    }

    const appState = this.#appNamespaces.get(appName);
    const keys = this.#parsePath(path);
    const newAppState = this.#setRecursive(appState, keys, value);
    this.#appNamespaces.set(appName, newAppState);

    // Update root state
    if (!this.#state.__apps) {
      this.#state.__apps = {};
    }
    this.#state.__apps[appName] = newAppState;
  }

  /**
   * Register a new application
   * @param {string} appName - Application name
   * @param {Object} [initialState={}] - Initial state
   * @returns {CoreStore} This store instance for chaining
   * @throws {StoreError} If app already exists
   */
  registerApp(appName, initialState = {}) {
    if (this.#appNamespaces.has(appName)) {
      throw new StoreError(
        `App '${appName}' already registered`,
        "APP_EXISTS",
        appName,
      );
    }

    const frozenState = this.#deepFreeze(initialState);
    this.#appNamespaces.set(appName, frozenState);

    if (!this.#state.__apps) {
      this.#state.__apps = {};
    }
    this.#state.__apps[appName] = frozenState;

    this.#persistToDisk();

    return this;
  }

  /**
   * Unregister an application
   * @param {string} appName - Application name
   * @returns {CoreStore} This store instance for chaining
   * @throws {StoreError} If app not found
   */
  unregisterApp(appName) {
    if (!this.#appNamespaces.has(appName)) {
      throw new StoreError(
        `App '${appName}' not found`,
        "APP_NOT_FOUND",
        appName,
      );
    }

    this.#appNamespaces.delete(appName);
    delete this.#state.__apps[appName];
    this.#persistToDisk();

    return this;
  }

  // ============================================================
  // UNDO / REDO ENGINE
  // ============================================================

  /**
   * Undo the last transaction
   * @returns {boolean} Success status
   */
  undo() {
    if (!this.#config.enableUndo || this.#history.length === 0) {
      return false;
    }

    const record = this.#history.pop();
    this.#future.push(record);

    this.#state = record.previousState;
    this.#persistToDisk();

    this.#notify(record.path, {
      actionType: `UNDO_${record.actionType}`,
      state: this.get(record.path),
      namespace: record.namespace,
    });

    return true;
  }

  /**
   * Redo the last undone transaction
   * @returns {boolean} Success status
   */
  redo() {
    if (!this.#config.enableUndo || this.#future.length === 0) {
      return false;
    }

    const record = this.#future.pop();
    this.#history.push(record);

    this.#state = record.nextState;
    this.#persistToDisk();

    this.#notify(record.path, {
      actionType: `REDO_${record.actionType}`,
      state: this.get(record.path),
      namespace: record.namespace,
    });

    return true;
  }

  // ============================================================
  // SUBSCRIPTION SYSTEM
  // ============================================================

  /**
   * Subscribe to changes at a path
   * @param {string} path - Path to subscribe to
   * @param {Function} callback - Callback function
   * @param {Object} [options={}] - Subscription options
   * @param {boolean} [options.once=false] - Call once then unsubscribe
   * @param {string|null} [options.namespace=null] - Filter by namespace
   * @returns {Function} Unsubscribe function
   */
  subscribe(path, callback, options = {}) {
    const { once = false, namespace = null } = options;

    const wrappedCallback = (payload, changedPath) => {
      // Filter by namespace if specified
      if (namespace && !changedPath.startsWith(`__apps.${namespace}`)) {
        return;
      }

      callback(payload, changedPath);

      if (once) {
        this.unsubscribe(wrappedCallback);
      }
    };

    this.#listeners.set(wrappedCallback, { path, once });

    return () => this.unsubscribe(wrappedCallback);
  }

  /**
   * Unsubscribe from changes
   * @param {Function} callback - Callback function to remove
   * @returns {CoreStore} This store instance for chaining
   */
  unsubscribe(callback) {
    this.#listeners.delete(callback);
    return this;
  }

  /**
   * Subscribe to changes in an application namespace
   * @param {string} appName - Application name
   * @param {string} path - Path within app
   * @param {Function} callback - Callback function
   * @returns {Function} Unsubscribe function
   */
  subscribeToApp(appName, path, callback) {
    return this.subscribe(
      path,
      (payload, changedPath) => {
        if (changedPath.startsWith(`__apps.${appName}`)) {
          callback(payload, changedPath);
        }
      },
      { namespace: appName },
    );
  }

  // ============================================================
  // MIDDLEWARE SYSTEM
  // ============================================================

  /**
   * Register middleware
   * @param {Function} middleware - Middleware function
   * @returns {CoreStore} This store instance for chaining
   * @throws {StoreError} If middleware is not a function
   */
  use(middleware) {
    if (typeof middleware !== "function") {
      throw new StoreError(
        "Middleware must be a function",
        "INVALID_MIDDLEWARE",
      );
    }
    this.#middlewares.push(middleware);
    return this;
  }

  /**
   * Apply middlewares to state
   * @param {Object} state - State to process
   * @param {string} actionType - Action type
   * @param {string} path - Store path
   * @returns {Object} Processed state
   * @private
   * @throws {StoreError} If middleware fails
   */
  #applyMiddlewares(state, actionType, path) {
    let currentState = state;

    for (const middleware of this.#middlewares) {
      try {
        const result = middleware(currentState, { actionType, path });
        if (result !== undefined) {
          currentState = result;
        }
      } catch (error) {
        console.error("[CoreStore] Middleware error:", error);
        throw new StoreError(
          `Middleware failed: ${error.message}`,
          "MIDDLEWARE_ERROR",
          path,
        );
      }
    }

    return currentState;
  }

  // ============================================================
  // NOTIFICATION SYSTEM
  // ============================================================

  /**
   * Notify subscribers of changes
   * @param {string} changedPath - Path that changed
   * @param {Object} payload - Notification payload
   * @private
   */
  #notify(changedPath, payload) {
    // Notify direct subscribers
    this.#listeners.forEach((config, callback) => {
      const { path } = config;
      const matched = path === "*" || changedPath.startsWith(path);
      if (matched) {
        callback(payload, changedPath);
      }
    });

    // Dispatch global event
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent(STORE_EVENTS.MUTATION, {
          detail: { path: changedPath, ...payload },
        }),
      );
    }
  }

  /**
   * Notify subscribers of errors
   * @param {Error} error - Error object
   * @param {string} path - Store path
   * @param {string} actionType - Action type
   * @private
   */
  #notifyError(error, path, actionType) {
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent(STORE_EVENTS.ERROR, {
          detail: { error, path, actionType },
        }),
      );
    }
  }

  // ============================================================
  // UTILITY & MAINTENANCE
  // ============================================================

  /**
   * Purge all state
   * @returns {CoreStore} This store instance for chaining
   */
  purge() {
    this.#state = this.#deepFreeze({ version: STORAGE_VERSION, __apps: {} });
    this.#history = [];
    this.#future = [];
    this.#appNamespaces.clear();
    this.#computedValues.clear();
    this.#transactionStack = [];
    this.#batchQueue = [];

    // Reject all pending transactions
    this.#transactionTracker.forEach((txn) => {
      if (txn.reject) {
        txn.reject(new StoreError("Store purged", "PURGED", txn.path));
      }
      if (txn.timeoutTimer) {
        clearTimeout(txn.timeoutTimer);
      }
    });
    this.#transactionTracker.clear();

    localStorage.removeItem(ROOT_KEY);
    this.#notify("*", { actionType: "PURGE_ALL", state: this.#state });
    return this;
  }

  /**
   * Create a state snapshot
   * @param {string} [path=''] - Path to snapshot
   * @returns {string} Snapshot ID
   */
  snapshot(path = "") {
    const data = this.get(path);
    const snapshot = this.#deepClone(data);
    const id = Date.now().toString(36);
    this.#snapshotCache.set(id, { data: snapshot, timestamp: Date.now() });
    return id;
  }

  /**
   * Restore from a snapshot
   * @param {string} id - Snapshot ID
   * @param {string} [path=''] - Path to restore to
   * @returns {Promise<boolean>} Success status
   * @throws {StoreError} If snapshot not found
   */
  async restoreSnapshot(id, path = "") {
    const snapshot = this.#snapshotCache.get(id);
    if (!snapshot) {
      throw new StoreError("Snapshot not found", "SNAPSHOT_NOT_FOUND", path);
    }

    return this.set(path, snapshot.data);
  }

  /**
   * Get history records
   * @param {Object} [options={}] - Options
   * @param {number} [options.limit=50] - Number of records
   * @param {number} [options.from=0] - Starting index
   * @returns {Array<Object>} History records
   */
  getHistory(options = {}) {
    const { limit = 50, from = 0 } = options;
    return this.#history.slice(from, from + limit);
  }

  /**
   * Get store statistics
   * @returns {Object} Statistics object
   */
  getStats() {
    return {
      /** @type {number} Total number of keys in state */
      totalKeys: Object.keys(this.#state).length,
      /** @type {number} History stack size */
      historySize: this.#history.length,
      /** @type {number} Future stack size */
      futureSize: this.#future.length,
      /** @type {number} Number of listeners */
      listeners: this.#listeners.size,
      /** @type {number} Number of registered apps */
      apps: this.#appNamespaces.size,
      /** @type {number} Pending transactions */
      pendingTransactions:
        this.#transactionStack.length + this.#batchQueue.length,
      /** @type {string} Memory usage estimate */
      memoryUsage: JSON.stringify(this.#state).length / 1024 + "KB",
    };
  }

  // ============================================================
  // SERIALIZATION
  // ============================================================

  /**
   * Serialize store to JSON
   * @returns {Object} Serialized store data
   */
  toJSON() {
    return {
      version: STORAGE_VERSION,
      data: this.#state,
      apps: Object.fromEntries(this.#appNamespaces),
    };
  }

  /**
   * Import state from JSON
   * @param {string|Object} json - JSON string or object
   * @returns {CoreStore} This store instance for chaining
   * @throws {StoreError} If import fails
   */
  fromJSON(json) {
    try {
      const parsed = typeof json === "string" ? JSON.parse(json) : json;
      this.#state = this.#deepFreeze(
        parsed.data || { version: STORAGE_VERSION },
      );

      // Restore app namespaces
      if (parsed.apps) {
        Object.entries(parsed.apps).forEach(([name, data]) => {
          this.#appNamespaces.set(name, data);
        });
      }

      this.#persistToDisk();
      return this;
    } catch (error) {
      throw new StoreError("Failed to import state", "IMPORT_ERROR", "root", {
        error,
      });
    }
  }

  // ============================================================
  // CLEANUP
  // ============================================================

  /**
   * Destroy the store and clean up resources
   */
  destroy() {
    // Reject all pending transactions
    this.#transactionTracker.forEach((txn) => {
      if (txn.reject) {
        txn.reject(new StoreError("Store destroyed", "DESTROYED", txn.path));
      }
      if (txn.timeoutTimer) {
        clearTimeout(txn.timeoutTimer);
      }
    });

    this.#listeners.clear();
    this.#history = [];
    this.#future = [];
    this.#snapshotCache.clear();
    this.#computedValues.clear();
    this.#middlewares = [];
    this.#transactionStack = [];
    this.#batchQueue = [];
    this.#transactionTracker.clear();
    this.#persistTimer && clearTimeout(this.#persistTimer);
    this.#batchTimer && clearTimeout(this.#batchTimer);
  }
}

// ============================================================
// GLOBAL SINGLETON
// ============================================================

/**
 * Global singleton instance of CoreStore
 * @type {CoreStore}
 */
export const coreStore = new CoreStore();

// ============================================================
// EXPORTED HELPERS
// ============================================================

/**
 * Register a validator for the validation engine
 * @param {string|RegExp} pathPattern - Path pattern to match
 * @param {Function} validatorFn - Validation function
 * @returns {void}
 * @example
 * registerValidator('users.*.email', (value) =>
 *   typeof value === 'string' && value.includes('@') || 'Invalid email'
 * );
 */
export const registerValidator =
  ValidationEngine.registerValidator.bind(ValidationEngine);

/**
 * Export transaction priorities for external use
 * @type {Object}
 */
export { TRANSACTION_PRIORITY, TRANSACTION_STATUS };
