/**
 * @file CrossModuleAggregator.js
 * @description Advanced cross-namespace data aggregation and temporal indexing engine.
 * Reads read-only snapshots from CoreStore across Habit Tracker, Task Manager,
 * Life Planner, Mind Manager, and Time Manager to construct telemetry datasets
 * required for evaluating the 10 selected Japanese behavioral principles.
 *
 * Aligned with LIFE_ORCHESTRATOR_DATA_MODEL v2.
 */

import { CoreStore } from "@life-orchestrator/core-store";

export const NAMESPACES = Object.freeze({
  HABIT: "habit_tracker",
  TASK: "task_manager",
  TIME: "time_manager",
  MIND: "mind_manager",
  PLANNER: "life_planner",
});

const MAX_VALID_BREAK_SECONDS = 3 * 60 * 60;
const LONG_SESSION_THRESHOLD_MINUTES = 45;
const SHORT_SESSION_THRESHOLD_MINUTES = 5;
const MIN_SESSION_DURATION_MINUTES = 15;

export const CrossModuleAggregator = {
  normalizeDate(input) {
    if (!input) return null;
    if (typeof input === "string" && /^\d{4}-\d{2}-\d{2}$/.test(input)) {
      return input;
    }
    try {
      const d = new Date(input);
      if (isNaN(d.getTime())) return null;
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, "0");
      const dd = String(d.getDate()).padStart(2, "0");
      return `${yyyy}-${mm}-${dd}`;
    } catch {
      return null;
    }
  },

  getAllRawData() {
    return {
      habits: CoreStore.getNamespace(NAMESPACES.HABIT) || {},
      tasks: CoreStore.getNamespace(NAMESPACES.TASK) || {},
      time: CoreStore.getNamespace(NAMESPACES.TIME) || {},
      mind: CoreStore.getNamespace(NAMESPACES.MIND) || {},
      planner: CoreStore.getNamespace(NAMESPACES.PLANNER) || {},
    };
  },

  buildEntityIndexes() {
    const raw = this.getAllRawData();

    const tasksById = new Map();
    (raw.tasks.tasks || []).forEach((task) => tasksById.set(task.id, task));

    const taskTagsById = new Map();
    (raw.tasks.tags || []).forEach((tag) => taskTagsById.set(tag.id, tag));

    const plansById = new Map();
    (raw.planner.plans || []).forEach((plan) => plansById.set(plan.id, plan));

    const habitsById = new Map();
    (raw.habits.habits || []).forEach((habit) =>
      habitsById.set(habit.id, habit),
    );

    const notesById = new Map();
    (raw.mind.notes || []).forEach((note) => notesById.set(note.id, note));

    const mindTagsById = new Map();
    (raw.mind.tags || []).forEach((tag) => mindTagsById.set(tag.id, tag));

    return {
      tasksById,
      taskTagsById,
      plansById,
      habitsById,
      notesById,
      mindTagsById,
    };
  },

  resolveTagNames(entity, tagsById) {
    if (!entity || !Array.isArray(entity.tagIds)) return [];
    return entity.tagIds
      .map((id) => tagsById.get(String(id))?.name)
      .filter((name) => typeof name === "string" && name.length > 0);
  },

  /**
   * Constructs the aggregated daily telemetry timeline. This is now fully
   * multi-module: every day entry contains data from all five modules.
   */
  getDailyTimeline(daysBack = 30) {
    const raw = this.getAllRawData();
    const indexes = this.buildEntityIndexes();
    const timelineMap = new Map();

    const now = new Date();
    for (let i = daysBack - 1; i >= 0; i--) {
      const cursor = new Date();
      cursor.setDate(now.getDate() - i);
      const isoDate = this.normalizeDate(cursor);
      const dayOfWeek = cursor.getDay();

      timelineMap.set(isoDate, {
        date: isoDate,
        isWeekend: dayOfWeek === 0 || dayOfWeek === 6,

        // ============ Task Manager ============
        tasksCreated: 0,
        tasksCompleted: 0,
        tasksWithSubtasksCount: 0,
        totalSubtasksCount: 0,
        completedSubtasksCount: 0,
        taskCategories: new Set(),
        torimazuDelaysMinutes: [],

        // ============ Time Manager ============
        focusDurationSeconds: 0,
        focusDurationMinutes: 0,
        sessionCount: 0,
        shortSessionsCount: 0,
        longUninterruptedSessionsCount: 0,
        interruptionCount: 0,
        focusSessions: [],
        breakDurationsMinutes: [],
        validBreakCount: 0,

        // ============ Habit Tracker ============
        habitsActiveTotal: 0,
        habitsCompleted: 0,
        habitsSkipped: 0,
        habitCategories: new Set(),

        // ============ Mind Manager ============
        notesCreated: 0,
        notesCreatedPostFocus: 0,
        snippetsCreated: 0,
        bookmarksCreated: 0,
        cheatsheetsCreated: 0,
        mindCategories: new Set(),
        mindKnowledgeActivity: 0,

        // ============ Life Planner ============
        logsCount: 0,
        energySum: 0,
        energyCount: 0,
        avgEnergy: null,
        moodSamples: [],
        planObjectiveProgressSum: 0,
        planObjectiveCount: 0,
        activePlansCount: 0,
        planCompletionEvents: 0,
      });
    }

    this._processTaskData(raw.tasks, indexes, timelineMap);
    this._processTimeData(raw.time, timelineMap);
    this._processHabitData(raw.habits, timelineMap);
    this._processMindData(raw.mind, timelineMap);
    this._processPlannerData(raw.planner, timelineMap);

    timelineMap.forEach((entry) => {
      if (entry.energyCount > 0) {
        entry.avgEnergy = Number(
          (entry.energySum / entry.energyCount).toFixed(2),
        );
      }
      entry.uniqueCategoriesCount = entry.taskCategories.size;
      entry.habitCategoriesCount = entry.habitCategories.size;
      entry.mindCategoriesCount = entry.mindCategories.size;
      entry.avgBreakMinutes = entry.breakDurationsMinutes.length
        ? Number(
            (
              entry.breakDurationsMinutes.reduce((a, b) => a + b, 0) /
              entry.breakDurationsMinutes.length
            ).toFixed(1),
          )
        : 0;
    });

    return Array.from(timelineMap.values());
  },

  // =============================================================
  // MULTI-MODULE PROGRESS SERIES (for Kaizen)
  // =============================================================

  /**
   * Builds per-module daily activity series for a given window.
   * Each series is a normalized array of numbers (one per day).
   * Used by Kaizen to compute cross-module continuous progress.
   *
   * @param {Array<Object>} timeline
   * @returns {Object<string, number[]>}
   */
  getModuleProgressSeries(timeline) {
    const series = {
      timeManager: [],
      taskManager: [],
      habitTracker: [],
      mindManager: [],
      lifePlanner: [],
    };

    timeline.forEach((day) => {
      // Time Manager: focus minutes
      series.timeManager.push(day.focusDurationMinutes || 0);

      // Task Manager: completed tasks + completed subtasks
      const taskScore =
        (day.tasksCompleted || 0) + (day.completedSubtasksCount || 0) * 0.5;
      series.taskManager.push(taskScore);

      // Habit Tracker: completed habits
      series.habitTracker.push(day.habitsCompleted || 0);

      // Mind Manager: any knowledge entity created
      const mindScore =
        (day.notesCreated || 0) +
        (day.snippetsCreated || 0) +
        (day.bookmarksCreated || 0) +
        (day.cheatsheetsCreated || 0);
      series.mindManager.push(mindScore);

      // Life Planner: plan objective progress contribution + logs
      const plannerScore =
        (day.planObjectiveProgressSum || 0) + (day.logsCount || 0);
      series.lifePlanner.push(plannerScore);
    });

    return series;
  },

  // =============================================================
  // PRIVATE PROCESSORS
  // =============================================================

  _processTaskData(taskData, indexes, timelineMap) {
    const tasks = taskData.tasks || [];

    tasks.forEach((t) => {
      const createdDateKey = this.normalizeDate(t.createdAt);
      if (createdDateKey && timelineMap.has(createdDateKey)) {
        timelineMap.get(createdDateKey).tasksCreated += 1;
      }

      const isCompleted = t.completedAt !== null && t.completedAt !== undefined;
      if (!isCompleted) return;

      const completedDateKey = this.normalizeDate(t.completedAt);
      if (!completedDateKey || !timelineMap.has(completedDateKey)) return;

      const entry = timelineMap.get(completedDateKey);
      entry.tasksCompleted += 1;

      const tagNames = this.resolveTagNames(t, indexes.taskTagsById);
      tagNames.forEach((name) => entry.taskCategories.add(name));

      if (Array.isArray(t.subtasks) && t.subtasks.length > 0) {
        entry.tasksWithSubtasksCount += 1;
        entry.totalSubtasksCount += t.subtasks.length;
        entry.completedSubtasksCount += t.subtasks.filter(
          (s) => s.completed === true,
        ).length;
      }

      if (t.createdAt && t.completedAt) {
        const createdMs = new Date(t.createdAt).getTime();
        const completedMs = new Date(t.completedAt).getTime();
        const delayMs = completedMs - createdMs;
        if (delayMs >= 0) {
          entry.torimazuDelaysMinutes.push(Math.round(delayMs / (1000 * 60)));
        }
      }
    });
  },

  _processTimeData(timeData, timelineMap) {
    const sessions = Array.isArray(timeData.sessions)
      ? [...timeData.sessions]
      : [];

    sessions.sort(
      (a, b) =>
        new Date(a.startedAt || a.completedAt).getTime() -
        new Date(b.startedAt || b.completedAt).getTime(),
    );

    sessions.forEach((s) => {
      const dateKey = this.normalizeDate(s.completedAt || s.startedAt);
      if (!dateKey || !timelineMap.has(dateKey)) return;

      const entry = timelineMap.get(dateKey);

      const seconds = Number(s.durationSeconds) || 0;
      const minutes = Math.round(seconds / 60);
      const isZeroDuration = seconds === 0;

      entry.focusDurationSeconds += seconds;
      entry.focusDurationMinutes += minutes;
      entry.sessionCount += 1;

      entry.interruptionCount += Number(s.interruptionsCount) || 0;

      if (minutes < SHORT_SESSION_THRESHOLD_MINUTES) {
        entry.shortSessionsCount += 1;
      }

      if (
        minutes >= LONG_SESSION_THRESHOLD_MINUTES &&
        (Number(s.interruptionsCount) || 0) === 0
      ) {
        entry.longUninterruptedSessionsCount += 1;
      }

      entry.focusSessions.push({
        id: s.id,
        startedAt: s.startedAt,
        completedAt: s.completedAt,
        durationSeconds: seconds,
        interruptionsCount: Number(s.interruptionsCount) || 0,
        breakDurationSeconds:
          s.breakDurationSeconds === null
            ? null
            : Number(s.breakDurationSeconds) || 0,
        isZeroDuration,
      });

      const breakSeconds =
        s.breakDurationSeconds === null
          ? null
          : Number(s.breakDurationSeconds) || 0;

      if (
        breakSeconds !== null &&
        breakSeconds > 0 &&
        breakSeconds <= MAX_VALID_BREAK_SECONDS
      ) {
        entry.breakDurationsMinutes.push(Math.round(breakSeconds / 60));
        entry.validBreakCount += 1;
      }
    });
  },

  _processHabitData(habitData, timelineMap) {
    const habits = habitData.habits || [];

    habits.forEach((h) => {
      if (h.archived) return;

      const habitCategory = h.category || "uncategorized";

      timelineMap.forEach((entry) => {
        entry.habitsActiveTotal += 1;
        entry.habitCategories.add(habitCategory);
      });

      (h.completedDates || []).forEach((dateStr) => {
        const dateKey = this.normalizeDate(dateStr);
        if (dateKey && timelineMap.has(dateKey)) {
          timelineMap.get(dateKey).habitsCompleted += 1;
        }
      });

      (h.skippedDates || []).forEach((dateStr) => {
        const dateKey = this.normalizeDate(dateStr);
        if (dateKey && timelineMap.has(dateKey)) {
          timelineMap.get(dateKey).habitsSkipped += 1;
        }
      });
    });
  },

  _processMindData(mindData, timelineMap) {
    const notes = mindData.notes || [];
    const snippets = mindData.snippets || [];
    const bookmarks = mindData.bookmarks || [];
    const cheatsheets = mindData.cheatsheets || [];

    // Notes + Zanshin detection
    notes.forEach((n) => {
      const dateKey = this.normalizeDate(n.createdAt);
      if (!dateKey || !timelineMap.has(dateKey)) return;

      const entry = timelineMap.get(dateKey);
      entry.notesCreated += 1;
      entry.mindKnowledgeActivity += 1;
      if (n.category) entry.mindCategories.add(n.category);

      const noteTime = new Date(n.createdAt).getTime();
      const isPostSessionNote = entry.focusSessions.some((s) => {
        if (!s.completedAt) return false;
        const sessionEndTime = new Date(s.completedAt).getTime();
        const diffMins = (noteTime - sessionEndTime) / (1000 * 60);
        return diffMins >= 0 && diffMins <= 10;
      });

      if (isPostSessionNote) {
        entry.notesCreatedPostFocus += 1;
      }
    });

    // Snippets
    snippets.forEach((s) => {
      const dateKey = this.normalizeDate(s.createdAt);
      if (!dateKey || !timelineMap.has(dateKey)) return;
      const entry = timelineMap.get(dateKey);
      entry.snippetsCreated += 1;
      entry.mindKnowledgeActivity += 1;
      if (s.category) entry.mindCategories.add(s.category);
    });

    // Bookmarks
    bookmarks.forEach((b) => {
      const dateKey = this.normalizeDate(b.createdAt);
      if (!dateKey || !timelineMap.has(dateKey)) return;
      const entry = timelineMap.get(dateKey);
      entry.bookmarksCreated += 1;
      entry.mindKnowledgeActivity += 1;
      if (b.category) entry.mindCategories.add(b.category);
    });

    // Cheatsheets
    cheatsheets.forEach((c) => {
      const dateKey = this.normalizeDate(c.createdAt);
      if (!dateKey || !timelineMap.has(dateKey)) return;
      const entry = timelineMap.get(dateKey);
      entry.cheatsheetsCreated += 1;
      entry.mindKnowledgeActivity += 1;
      if (c.category) entry.mindCategories.add(c.category);
    });
  },

  _processPlannerData(plannerData, timelineMap) {
    const logs = plannerData.logs || [];
    const plans = plannerData.plans || [];

    logs.forEach((log) => {
      const dateKey = this.normalizeDate(log.date || log.createdAt);
      if (!dateKey || !timelineMap.has(dateKey)) return;

      const entry = timelineMap.get(dateKey);
      entry.logsCount += 1;

      if (typeof log.energy === "number" && !isNaN(log.energy)) {
        entry.energySum += log.energy;
        entry.energyCount += 1;
      }

      if (typeof log.mood === "string" && log.mood.length > 0) {
        entry.moodSamples.push(log.mood);
      }
    });

    const activePlans = plans.filter((p) => p.state === "active");

    activePlans.forEach((plan) => {
      const objectives = Array.isArray(plan.objectives) ? plan.objectives : [];
      if (objectives.length === 0) return;

      let planProgressSum = 0;
      objectives.forEach((o) => {
        planProgressSum += this._computeObjectiveProgress(o);
      });

      const planAvg = planProgressSum / objectives.length;

      const anchorDate = this.normalizeDate(
        plan.period?.startDate || plan.createdAt,
      );
      if (anchorDate && timelineMap.has(anchorDate)) {
        const entry = timelineMap.get(anchorDate);
        entry.planObjectiveProgressSum += planAvg;
        entry.planObjectiveCount += 1;
        entry.activePlansCount += 1;
      }
    });
  },

  _computeObjectiveProgress(objective) {
    if (!objective) return 0;

    if (objective.type === "boolean" || objective.type === "milestone") {
      return objective.completed ? 1 : 0;
    }

    if (objective.type === "numeric") {
      const target = Number(objective.targetValue) || 0;
      const current = Number(objective.currentValue) || 0;
      if (target <= 0) return objective.completed ? 1 : 0;
      return Math.max(0, Math.min(1, current / target));
    }

    return 0;
  },
};
