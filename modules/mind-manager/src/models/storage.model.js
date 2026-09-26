import { generateId, todayISO } from "@/utils/helpers.js";

export const STORAGE_KEY = "mind_manager";
export const STORAGE_VERSION = 1;

/**
 * Extract clean domain name from URL string
 * @param {string} url
 * @returns {string}
 */
function extractDomain(url) {
  if (!url) return "";
  try {
    const parsed = new URL(url.startsWith("http") ? url : `https://${url}`);
    return parsed.hostname.replace(/^www\./, "");
  } catch (error) {
    return url;
  }
}

/**
 * Base Entity Normalizer to ensure structural consistency across all schemas
 */
function normalizeBaseEntity(data = {}, defaultTitle = "Untitled") {
  return {
    id: String(data.id || generateId()),
    title: data.title || defaultTitle,
    category: data.category || "general",
    pinned: Boolean(data.pinned || data.isFavorite || data.isPinned),
    tagIds: Array.isArray(data.tagIds)
      ? data.tagIds.map((t) => (typeof t === "object" ? t.id : String(t)))
      : [],
    createdAt: data.createdAt || todayISO(),
    updatedAt: data.updatedAt || todayISO(),
  };
}

/**
 * Tag Entity Normalizer
 */
export function normalizeTag(data = {}) {
  return {
    id: String(data.id || generateId()),
    name: data.name ? String(data.name).trim() : "Untitled Tag",
    entityTypes: Array.isArray(data.entityTypes)
      ? data.entityTypes
      : data.entityType
        ? [...data.entityType]
        : [],
  };
}

/**
 * Note Entity Normalizer
 */
export function normalizeNote(data = {}) {
  const base = normalizeBaseEntity(data, "Untitled Note");
  return {
    ...base,
    content: data.content || "",
  };
}

/**
 * Code Snippet Entity Normalizer
 */
export function normalizeSnippet(data = {}) {
  const base = normalizeBaseEntity(data, "Untitled Snippet");
  return {
    ...base,
    description: data.description || "",
    code: data.code || "",
    category: data.category || "html",
  };
}

/**
 * Bookmark Entity Normalizer
 */
export function normalizeBookmark(data = {}) {
  const base = normalizeBaseEntity(data, "Untitled Bookmark");
  const url = data.url || "";
  const domain = data.domain || extractDomain(url);

  return {
    ...base,
    url: url,
    domain: domain,
    description: data.description || "",
  };
}

/**
 * CheatSheet Entity Normalizer
 */
export function normalizeCheatSheet(data = {}) {
  const base = normalizeBaseEntity(data, "Untitled CheatSheet");
  return {
    ...base,
    description: data.description || "",
    items: Array.isArray(data.items)
      ? data.items.map((item) => ({
          id: String(item.id || generateId()),
          key: item.key || "",
          value: item.value || "",
          description: item.description || "",
        }))
      : [],
  };
}

/**
 * Registry of entity normalizers for scalable processing
 */
const ENTITY_NORMALIZERS = {
  tags: normalizeTag,
  notes: normalizeNote,
  snippets: normalizeSnippet,
  bookmarks: normalizeBookmark,
  cheatsheets: normalizeCheatSheet,
};

/**
 * Save State Structure to LocalStorage
 */
export function saveToStorage(data = {}) {
  try {
    const payload = {
      version: STORAGE_VERSION,
      tags: data.tags || [],
      notes: data.notes || [],
      snippets: data.snippets || [],
      bookmarks: data.bookmarks || [],
      cheatsheets: data.cheatsheets || [],
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch (error) {
    console.error("Failed to save mind repository state:", error);
  }
}

/**
 * Load State Structure from LocalStorage
 */
export function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    const data = JSON.parse(raw);

    const result = { version: STORAGE_VERSION };

    Object.keys(ENTITY_NORMALIZERS).forEach((key) => {
      const normalizer = ENTITY_NORMALIZERS[key];
      result[key] = (data[key] || []).map(normalizer);
    });

    return result;
  } catch (error) {
    console.error("Failed to load mind repository state:", error);
    return null;
  }
}
