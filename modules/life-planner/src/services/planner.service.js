import { generateId, todayISO } from "@/utils/helpers.js";

export const PlannerService = {
  // ==========================================
  // 1. PLANS
  // ==========================================
  createPlan(currentPlans = [], planData = {}) {
    const rawTitle = typeof planData === "string" ? planData : planData.title;
    const cleanedTitle = (rawTitle || "").trim().replace(/\s+/g, " ");

    if (!cleanedTitle || cleanedTitle.length < 2 || cleanedTitle.length > 120) {
      throw new Error("Plan title must be between 2 and 120 characters");
    }

    const newPlan = {
      id: String(planData.id || generateId()),
      title: cleanedTitle,
      description: (planData.description || "").trim(),
      lifeAreaId: String(planData.lifeAreaId || "productivity"),
      state: planData.state || "active", // "active" | "paused" | "completed"
      period: {
        startDate: planData.period?.startDate || todayISO(),
        endDate: planData.period?.endDate || null,
      },
      objectives: Array.isArray(planData.objectives)
        ? planData.objectives.map((obj) => ({
            id: String(obj.id || generateId()),
            title: (obj.title || "Untitled Objective").trim(),
            type: String(obj.type || "boolean"), // "boolean" | "numeric" | "milestone"
            targetValue: Number(obj.targetValue) || 1,
            currentValue: Number(obj.currentValue) || 0,
            unit: String(obj.unit || "count"),
            completed: Boolean(obj.completed),
          }))
        : [],
      createdAt: todayISO(),
      updatedAt: todayISO(),
    };

    return [newPlan, ...currentPlans];
  },

  editPlan(currentPlans = [], planId, updatedFields = {}) {
    const plan = currentPlans.find((p) => String(p.id) === String(planId));
    if (!plan) throw new Error("Plan not found");

    let cleanedTitle = plan.title;
    if (updatedFields.title !== undefined) {
      cleanedTitle = updatedFields.title.trim().replace(/\s+/g, " ");
      if (cleanedTitle.length < 2 || cleanedTitle.length > 120) {
        throw new Error("Plan title must be between 2 and 120 characters");
      }
    }

    return currentPlans.map((p) => {
      if (String(p.id) !== String(planId)) return p;

      return {
        ...p,
        ...updatedFields,
        title: cleanedTitle,
        period: {
          ...p.period,
          ...(updatedFields.period || {}),
        },
        objectives: Array.isArray(updatedFields.objectives)
          ? updatedFields.objectives.map((obj) => ({
              id: String(obj.id || generateId()),
              title: (obj.title || "Untitled Objective").trim(),
              type: String(obj.type || "boolean"),
              targetValue: Number(obj.targetValue) || 1,
              currentValue: Number(obj.currentValue) || 0,
              unit: String(obj.unit || "count"),
              completed: Boolean(obj.completed),
            }))
          : p.objectives,
        updatedAt: todayISO(),
      };
    });
  },

  toggleObjective(currentPlans = [], planId, objectiveId) {
    return currentPlans.map((p) => {
      if (String(p.id) !== String(planId)) return p;

      const updatedObjectives = (p.objectives || []).map((obj) => {
        if (String(obj.id) === String(objectiveId)) {
          const isCompleted = !obj.completed;
          const target = Number(obj.targetValue) || 1;
          return {
            ...obj,
            completed: isCompleted,
            currentValue: isCompleted ? target : 0,
          };
        }
        return obj;
      });

      return {
        ...p,
        objectives: updatedObjectives,
        updatedAt: todayISO(),
      };
    });
  },

  updateObjectiveProgress(currentPlans = [], planId, objectiveId, newValue) {
    return currentPlans.map((p) => {
      if (String(p.id) !== String(planId)) return p;

      const updatedObjectives = (p.objectives || []).map((obj) => {
        if (String(obj.id) === String(objectiveId)) {
          const val = Math.max(0, Number(newValue) || 0);
          const target = Number(obj.targetValue) || 1;
          return {
            ...obj,
            currentValue: val,
            completed: val >= target,
          };
        }
        return obj;
      });

      return {
        ...p,
        objectives: updatedObjectives,
        updatedAt: todayISO(),
      };
    });
  },

  deletePlan(currentPlans = [], planId) {
    return currentPlans.filter((p) => String(p.id) !== String(planId));
  },

  // ==========================================
  // 2. LOGS
  // ==========================================
  createLog(currentLogs = [], logData = {}) {
    const rawTitle = typeof logData === "string" ? logData : logData.title;
    const cleanedTitle = (rawTitle || "").trim().replace(/\s+/g, " ");

    if (!cleanedTitle || cleanedTitle.length < 2 || cleanedTitle.length > 120) {
      throw new Error("Log title must be between 2 and 120 characters");
    }

    const newLog = {
      id: String(logData.id || generateId()),
      title: cleanedTitle,
      description: (logData.description || "").trim(),
      date: logData.date || todayISO(),
      planId: logData.planId ? String(logData.planId) : null,
      energy: Math.min(5, Math.max(1, Number(logData.energy) || 3)),
      mood: logData.mood || "good", // "great" | "good" | "neutral" | "bad"
      metrics:
        logData.metrics && typeof logData.metrics === "object"
          ? logData.metrics
          : {},
      createdAt: todayISO(),
      updatedAt: todayISO(),
    };

    return [newLog, ...currentLogs];
  },

  editLog(currentLogs = [], logId, updatedFields = {}) {
    const log = currentLogs.find((l) => String(l.id) === String(logId));
    if (!log) throw new Error("Log not found");

    let cleanedTitle = log.title;
    if (updatedFields.title !== undefined) {
      cleanedTitle = updatedFields.title.trim().replace(/\s+/g, " ");
      if (cleanedTitle.length < 2 || cleanedTitle.length > 120) {
        throw new Error("Log title must be between 2 and 120 characters");
      }
    }

    return currentLogs.map((l) => {
      if (String(l.id) !== String(logId)) return l;

      return {
        ...l,
        ...updatedFields,
        title: cleanedTitle,
        energy:
          updatedFields.energy !== undefined
            ? Math.min(5, Math.max(1, Number(updatedFields.energy)))
            : l.energy,
        updatedAt: todayISO(),
      };
    });
  },

  deleteLog(currentLogs = [], logId) {
    return currentLogs.filter((l) => String(l.id) !== String(logId));
  },

  // ==========================================
  // 3. TEMPLATES
  // ==========================================
  createTemplate(currentTemplates = [], templateData = {}) {
    const rawTitle =
      typeof templateData === "string" ? templateData : templateData.title;
    const cleanedTitle = (rawTitle || "").trim().replace(/\s+/g, " ");

    if (!cleanedTitle || cleanedTitle.length < 2 || cleanedTitle.length > 100) {
      throw new Error("Template title must be between 2 and 100 characters");
    }

    const newTemplate = {
      id: String(templateData.id || generateId()),
      title: cleanedTitle,
      description: (templateData.description || "").trim(),
      lifeAreaId: String(templateData.lifeAreaId || "productivity"),
      baseline: (templateData.baseline || "").trim(),
      optimal: (templateData.optimal || "").trim(),
      isFavorite: Boolean(templateData.isFavorite),
      usageCount: Number(templateData.usageCount) || 0,
      createdAt: todayISO(),
      updatedAt: todayISO(),
    };

    return [newTemplate, ...currentTemplates];
  },

  editTemplate(currentTemplates = [], templateId, updatedFields = {}) {
    const template = currentTemplates.find(
      (t) => String(t.id) === String(templateId),
    );
    if (!template) throw new Error("Template not found");

    let cleanedTitle = template.title;
    if (updatedFields.title !== undefined) {
      cleanedTitle = updatedFields.title.trim().replace(/\s+/g, " ");
      if (cleanedTitle.length < 2 || cleanedTitle.length > 100) {
        throw new Error("Template title must be between 2 and 100 characters");
      }
    }

    return currentTemplates.map((t) => {
      if (String(t.id) !== String(templateId)) return t;

      return {
        ...t,
        ...updatedFields,
        title: cleanedTitle,
        baseline:
          updatedFields.baseline !== undefined
            ? updatedFields.baseline.trim()
            : t.baseline,
        optimal:
          updatedFields.optimal !== undefined
            ? updatedFields.optimal.trim()
            : t.optimal,
        updatedAt: todayISO(),
      };
    });
  },

  incrementTemplateUsage(currentTemplates = [], templateId) {
    return currentTemplates.map((t) => {
      if (String(t.id) !== String(templateId)) return t;
      return {
        ...t,
        usageCount: (Number(t.usageCount) || 0) + 1,
        updatedAt: todayISO(),
      };
    });
  },

  deleteTemplate(currentTemplates = [], templateId) {
    return currentTemplates.filter((t) => String(t.id) !== String(templateId));
  },
};
