import { SYSTEM_EVENTS, globalEventBus } from "@life-orchestrator/event-bus";
import { generateId, openSubtasksState, todayISO } from "@/utils/helpers.js";

import { CoreStore } from "@life-orchestrator/core-store";
import { TASK_NAMESPACE } from "@/models/storage.model";

function sanitizeTagIds(tags) {
  if (!Array.isArray(tags)) return [];
  return tags
    .map((tag) => {
      if (typeof tag === "object" && tag !== null) {
        return String(tag.id || tag.value || "");
      }
      return String(tag || "").trim();
    })
    .filter(Boolean);
}

export const TaskService = {
  validateTaskLimits(tasks, targetDate, newPriority, excludeTaskId = null) {
    if (!targetDate) return;

    const LIMITS = { high: 6, medium: 8, low: 10, total: 24 };

    const sameDateTasks = tasks.filter((task) => {
      if (task.archived) return false;
      if (excludeTaskId && task.id === excludeTaskId) return false;

      const taskDate = task.dueDate || task.createdAt;
      return taskDate === targetDate;
    });

    if (sameDateTasks.length >= LIMITS.total) {
      throw new Error(
        `Daily capacity reached! Maximum total tasks allowed for ${targetDate} is ${LIMITS.total}`,
      );
    }

    const countByPriority = sameDateTasks.reduce(
      (acc, task) => {
        const p = task.priority || "low";
        acc[p] = (acc[p] || 0) + 1;
        return acc;
      },
      { high: 0, medium: 0, low: 0 },
    );

    const targetPriority = newPriority || "low";
    const currentCount = countByPriority[targetPriority] || 0;
    const maxAllowed = LIMITS[targetPriority] || LIMITS.low;

    if (currentCount >= maxAllowed) {
      throw new Error(
        `Priority capacity exceeded! You can only set up to ${maxAllowed} ${targetPriority.toUpperCase()} priority tasks for ${targetDate}`,
      );
    }
  },

  createTask(currentTasks, taskData) {
    const rawTitle = typeof taskData === "string" ? taskData : taskData.title;
    const cleanedTitle = (rawTitle || "").trim().replace(/\s+/g, " ");

    if (!cleanedTitle || cleanedTitle.length < 2 || cleanedTitle.length > 120) {
      throw new Error("Task title must be between 2 and 120 characters");
    }

    const alreadyExists = currentTasks.some(
      (task) =>
        task.title.toLowerCase() === cleanedTitle.toLowerCase() &&
        !task.archived,
    );
    if (alreadyExists) {
      throw new Error("An active task with this title already exists");
    }

    const taskDate = taskData.dueDate || todayISO();
    const taskPriority = taskData.priority || "low";

    this.validateTaskLimits(currentTasks, taskDate, taskPriority);

    const parsedTagIds = sanitizeTagIds(taskData.tags);
    const initialStatus = taskData.status || "todo";
    const isDone = initialStatus === "done";

    let subtasks = Array.isArray(taskData.subtasks) ? taskData.subtasks : [];
    if (isDone && subtasks.length > 0) {
      subtasks = subtasks.map((st) => ({
        ...st,
        completed: true,
        createdAt: todayISO(),
      }));
    }

    const newTask = {
      id: generateId(),
      title: cleanedTitle,
      description: (taskData.description || "").trim(),
      status: initialStatus,
      priority: taskPriority,
      dueDate: taskData.dueDate || null,
      createdAt: todayISO(),
      updatedAt: null,
      completedAt: isDone ? todayISO() : null,
      estimatedFocusUnits: 1,
      completedFocusUnits: 0,
      archived: false,
      tags: parsedTagIds,
      subtasks: subtasks,
    };

    return [newTask, ...currentTasks];
  },

  toggleSubtask(currentTasks, taskId, subtaskId) {
    const today = todayISO();

    return currentTasks.map((task) => {
      if (task.id !== taskId) return task;

      const previousSubtasks = task.subtasks || [];
      const updatedSubtasks = previousSubtasks.map((st) => {
        if (st.id !== subtaskId) return st;
        return { ...st, completed: !st.completed, updatedAt: todayISO() };
      });

      const hasSubtasks = updatedSubtasks.length > 0;
      const allCompleted =
        hasSubtasks && updatedSubtasks.every((st) => st.completed);

      let newStatus = task.status;
      if (hasSubtasks) {
        if (allCompleted) {
          newStatus = "done";
        } else if (task.status === "done" && !allCompleted) {
          newStatus = "todo";
        }
        setTimeout(() => {
          globalEventBus.emit(SYSTEM_EVENTS.TASK_UPDATED_STATUS, {
            taskId,
            newStatus,
          });
        }, 500);
      }

      if (!allCompleted) {
        const memoryMap = new Map();
        updatedSubtasks.forEach((st) => memoryMap.set(st.id, st.completed));
        openSubtasksState.subtasksMemory.set(taskId, memoryMap);
      }

      return {
        ...task,
        status: newStatus,
        completedAt: newStatus === "done" ? task.completedAt || today : null,
        subtasks: updatedSubtasks,
        updatedAt: today,
      };
    });
  },

  updateTaskStatus(currentTasks, id, newStatus) {
    const validStatuses = ["todo", "in_progress", "done", "blocked"];
    if (!validStatuses.includes(newStatus)) {
      throw new Error("Invalid task status");
    }

    const today = todayISO();

    return currentTasks.map((task) => {
      if (task.id !== id || task.archived) return task;
      if (task.status === newStatus) return task;

      const isGoingToDone = newStatus === "done";
      let updatedSubtasks = task.subtasks || [];

      if (isGoingToDone) {
        const memoryMap = new Map();
        updatedSubtasks.forEach((st) => memoryMap.set(st.id, st.completed));
        openSubtasksState.subtasksMemory.set(task.id, memoryMap);

        updatedSubtasks = updatedSubtasks.map((st) => ({
          ...st,
          completed: true,
          updatedAt: todayISO(),
        }));
      } else if (task.status === "done") {
        const savedMemory = openSubtasksState.subtasksMemory.get(task.id);
        if (savedMemory) {
          updatedSubtasks = updatedSubtasks.map((st) => ({
            ...st,
            completed: savedMemory.has(st.id) ? savedMemory.get(st.id) : false,
            updatedAt: todayISO(),
          }));
        } else {
          updatedSubtasks = updatedSubtasks.map((st) => ({
            ...st,
            completed: false,
            updatedAt: todayISO(),
          }));
        }
      }

      setTimeout(() => {
        globalEventBus.emit(SYSTEM_EVENTS.TASK_UPDATED_STATUS, {
          taskId: id,
          newStatus,
        });
      }, 500);

      return {
        ...task,
        status: newStatus,
        completedAt: isGoingToDone ? today : null,
        updatedAt: today,
        subtasks: updatedSubtasks,
      };
    });
  },

  toggleTask(currentTasks, id) {
    const task = currentTasks.find((t) => t.id === id);
    if (!task) return currentTasks;

    const isCompleted = task.status === "done";
    const newStatus = isCompleted ? "todo" : "done";

    setTimeout(() => {
      globalEventBus.emit(SYSTEM_EVENTS.TASK_UPDATED_STATUS, {
        taskId: id,
        newStatus,
      });
    }, 500);

    return this.updateTaskStatus(currentTasks, id, newStatus);
  },

  editTask(currentTasks, id, updatedFields) {
    const task = currentTasks.find((t) => t.id === id);
    if (!task) throw new Error("Task not found");

    let cleanedTitle = task.title;
    if (updatedFields.title) {
      cleanedTitle = updatedFields.title.trim().replace(/\s+/g, " ");
      if (cleanedTitle.length < 2 || cleanedTitle.length > 120) {
        throw new Error("Task title must be between 2 and 120 characters");
      }
    }

    const targetDate =
      updatedFields.dueDate !== undefined
        ? updatedFields.dueDate
        : task.dueDate;
    const finalDate = targetDate || task.createdAt;
    const targetPriority = updatedFields.priority || task.priority;

    this.validateTaskLimits(currentTasks, finalDate, targetPriority, id);

    const parsedTagIds =
      updatedFields.tags !== undefined
        ? sanitizeTagIds(updatedFields.tags)
        : task.tags;

    const alreadyExists = currentTasks.some(
      (t) =>
        t.id !== id && t.title.toLowerCase() === cleanedTitle.toLowerCase(),
    );
    if (alreadyExists) {
      throw new Error("Task already exists");
    }

    if (
      updatedFields.status !== undefined &&
      updatedFields.status !== task.status
    ) {
      const tasksWithStatus = this.updateTaskStatus(
        currentTasks,
        id,
        updatedFields.status,
      );
      return tasksWithStatus.map((t) => {
        if (t.id !== id) return t;
        return {
          ...t,
          ...updatedFields,
          title: cleanedTitle,
          tags: parsedTagIds,
        };
      });
    }

    return currentTasks.map((t) => {
      if (t.id !== id) return t;

      const updatedSubtasks = updatedFields.subtasks || t.subtasks || [];

      return {
        ...t,
        ...updatedFields,
        title: cleanedTitle,
        tags: parsedTagIds,
        subtasks: updatedSubtasks,
        updatedAt: todayISO(),
      };
    });
  },

  addSubtask(currentTasks, taskId, subtaskTitle) {
    const cleaned = subtaskTitle.trim();
    if (!cleaned) throw new Error("Subtask title cannot be empty");

    return currentTasks.map((task) => {
      if (task.id !== taskId) return task;

      const newSubtask = {
        id: generateId(),
        title: cleaned,
        completed: false,
        createdAt: todayISO(),
        updatedAt: null,
      };

      const updatedSubtasks = [...(task.subtasks || []), newSubtask];
      const isDone = task.status === "done";
      const newStatus = isDone ? "todo" : task.status;

      return {
        ...task,
        status: newStatus,
        completedAt: newStatus === "done" ? task.completedAt : null,
        subtasks: updatedSubtasks,
      };
    });
  },

  deleteSubtask(currentTasks, taskId, subtaskId) {
    return currentTasks.map((task) => {
      if (task.id !== taskId) return task;

      const updatedSubtasks = (task.subtasks || []).filter(
        (st) => st.id !== subtaskId,
      );

      return {
        ...task,
        subtasks: updatedSubtasks,
        updatedAt: todayISO(),
      };
    });
  },

  deleteTask(currentTasks, id) {
    const targetIdStr = String(id);

    setTimeout(() => {
      globalEventBus.emit(SYSTEM_EVENTS.TASK_DELETED, { taskId: id });
    }, 500);

    return currentTasks.filter((task) => String(task.id) !== targetIdStr);
  },

  archiveTask(currentTasks, id) {
    setTimeout(() => {
      globalEventBus.emit(SYSTEM_EVENTS.TASK_ARCHIVE);
    }, 500);

    return currentTasks.map((task) =>
      task.id === id ? { ...task, archived: true } : task,
    );
  },

  restoreTask(currentTasks, id) {
    const task = currentTasks.find((t) => t.id === id);
    if (task) {
      const taskDate = task.dueDate || task.createdAt;
      this.validateTaskLimits(currentTasks, taskDate, task.priority, id);
    }

    return currentTasks.map((task) =>
      task.id === id ? { ...task, archived: false } : task,
    );
  },
};
