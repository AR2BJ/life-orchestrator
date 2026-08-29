import { StateManager, state } from "./state.model";

import { CoreStore } from "@life-orchestrator/core-store";

const TASK_NAMESPACE = "task_manager";

export const TaskModel = {
  getTasks() {
    const data = CoreStore.getNamespace(TASK_NAMESPACE);
    return data?.tasks || [];
  },

  getById(taskId) {
    const targetIdStr = String(taskId);
    const data = CoreStore.getNamespace(TASK_NAMESPACE);
    return data?.tasks?.find((t) => String(t.id) === targetIdStr) || null;
  },

  getActiveTaskId() {
    return state.activeTaskId ? String(state.activeTaskId) : null;
  },

  setActiveTaskId(taskId) {
    const nextId = taskId ? String(taskId) : null;

    state.activeTaskId = nextId;

    this.commit();
  },

  update(taskId, updatedFields) {
    const task = this.getById(taskId);
    if (!task) return null;

    const data = CoreStore.getNamespace(TASK_NAMESPACE);
    const taskIndex = data.tasks.findIndex(
      (t) => String(t.id) === String(taskId),
    );
    data.tasks[taskIndex] = { ...task, ...updatedFields };
    CoreStore.setNamespace(TASK_NAMESPACE, data);

    this.commit();

    return data.tasks[taskIndex];
  },

  commit() {
    StateManager.save();
    StateManager.notify();
  },
};
