import { CoreStore } from "@life-orchestrator/core-store";
import { formatDate } from "@/utils/helpers.js";

export const TASK_NAMESPACE = "task_manager";
export const STORAGE_VERSION = 1;

function normalizeTag(tag) {
  if (typeof tag === "string") {
    return { id: crypto.randomUUID(), name: tag.trim() };
  }
  return {
    id: String(tag.id || crypto.randomUUID()),
    name: String(tag.name || tag.title || "").trim(),
  };
}

function normalizeTask(task) {
  return {
    id: String(task.id || crypto.randomUUID()),
    title: task.title || "Untitled Task",
    description: task.description || "",
    status: task.status || "todo",
    priority: task.priority || "low",
    dueDate: task.dueDate || null,
    createdAt: task.createdAt || formatDate(new Date()),
    updatedAt: task.updatedAt || formatDate(new Date()) || null,
    completedAt: task.completedAt || null,
    estimatedMinutes: Number(task.estimatedMinutes) || 0,
    archived: Boolean(task.archived),
    tags: Array.isArray(task.tags)
      ? task.tags.map((t) => (typeof t === "object" ? t.id : String(t)))
      : [],
    subtasks: Array.isArray(task.subtasks)
      ? task.subtasks.map((st) => ({
          id: String(st.id || crypto.randomUUID()),
          title: st.title || "",
          completed: Boolean(st.completed),
          createdAt: task.createdAt || formatDate(new Date()),
          updatedAt: task.updatedAt || formatDate(new Date()) || null,
        }))
      : [],
  };
}

function migrateData(data) {
  const tasks = Array.isArray(data.tasks) ? data.tasks : [];
  const tags = Array.isArray(data.tags) ? data.tags : [];

  return {
    version: STORAGE_VERSION,
    tags: tags.map(normalizeTag),
    tasks: tasks.map(normalizeTask),
  };
}

export function saveToStorage(data) {
  CoreStore.setNamespace(TASK_NAMESPACE, {
    version: STORAGE_VERSION,
    tags: data.tags || [],
    tasks: data.tasks || [],
  });
}

export function loadFromStorage() {
  const data = CoreStore.getNamespace(TASK_NAMESPACE);
  if (!data) return null;

  return migrateData(data);
}

export function clearTaskStorage() {
  CoreStore.clearNamespace(TASK_NAMESPACE);
}
