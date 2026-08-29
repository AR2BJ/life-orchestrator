import { TaskModel } from "@/models/task.model.js";
import { isOverdue } from "@/utils/helpers";

export const TaskService = {
  getTasks() {
    return TaskModel.getTasks();
  },

  getActiveTask() {
    const activeId = TaskModel.getActiveTaskId();
    return activeId ? TaskModel.getById(activeId) : null;
  },

  setActiveTask(taskId) {
    if (!taskId) {
      TaskModel.setActiveTaskId(null);
      return;
    }

    const task = TaskModel.getById(taskId);
    if (!task || (task.status === "done" && !t.archived)) return;

    TaskModel.setActiveTaskId(taskId);
  },

  setNextActiveTask() {
    const activeTasks = TaskModel.getTasks().filter(
      (t) => t.status !== "done" && !t.archived,
    );

    if (activeTasks.length === 0) {
      TaskModel.setActiveTaskId(null);
      return null;
    }

    const getTaskPriorityWeight = (task) => {
      if (isOverdue(task.dueDate, task.status)) return 4;

      switch (task.priority) {
        case "high":
          return 3;
        case "medium":
          return 2;
        case "low":
          return 1;
        default:
          return 0;
      }
    };

    activeTasks.sort(
      (a, b) => getTaskPriorityWeight(b) - getTaskPriorityWeight(a),
    );

    const nextTask = activeTasks[0];
    const nextId = nextTask ? nextTask.id : null;

    TaskModel.setActiveTaskId(nextId);
    return nextId;
  },

  incrementCompletedFocusUnits(taskId) {
    const activeTaskId = TaskModel.getActiveTaskId();
    const targetId = taskId || activeTaskId;
    const task = TaskModel.getById(targetId);

    if (!task) return null;

    const newCompletedCount = (task.completedFocusUnits || 0) + 1;
    TaskModel.update(task.id, {
      completedFocusUnits: newCompletedCount,
    });

    return this.autoSelectNextTask();
  },

  setEstimatedPomodoros(taskId, count) {
    const task = TaskModel.getById(taskId);
    if (!task) return;

    TaskModel.update(task.id, { estimatedFocusUnits: count });
  },

  autoSelectNextTask() {
    const activeTask = this.getActiveTask();
    if (!activeTask) return null;

    if (activeTask.completedFocusUnits >= activeTask.estimatedFocusUnits) {
      if (activeTask.subtasks.length > 0) {
        activeTask.subtasks = activeTask.subtasks.map((st) => ({
          ...st,
          completed: true,
        }));
      }

      TaskModel.update(activeTask.id, {
        status: "done",
        subtasks: activeTask.subtasks,
      });

      this.setNextActiveTask();
    }

    return activeTask.id;
  },
};
