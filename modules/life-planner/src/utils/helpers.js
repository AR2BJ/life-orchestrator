export const openObjectivesState = {
  objectivesMemory: new Map(),
  expandedPlanIds: new Set(),

  clear() {
    this.objectivesMemory.clear();
    this.expandedPlanIds.clear();
  },
};

export function generateId() {
  if (window.crypto?.randomUUID) {
    return window.crypto.randomUUID();
  }

  function getRandomHex(length) {
    let result = "";
    const chars = "0123456789abcdef";
    for (let i = 0; i < length; i++) {
      result += chars[Math.floor(Math.random() * 16)];
    }
    return result;
  }

  const timestamp = getRandomHex(32).toString(16).padStart(12, "0");
  const randomPart = getRandomHex(8);

  const timeLow = timestamp.slice(0, 8);
  const timeMid = timestamp.slice(8, 12);
  const timeHiAndVersion = "4" + getRandomHex(3);
  const clockSeqHiAndReserved = getRandomHex(3);
  const node = getRandomHex(6) + randomPart.slice(0, 6);

  return `${timeLow}-${timeMid}-${timeHiAndVersion}-${clockSeqHiAndReserved}-${node}`;
}

export function formatDate(date) {
  if (!(date instanceof Date) || isNaN(date.getTime())) {
    date = new Date();
  }
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function todayISO() {
  return formatDate(new Date());
}

export function parseFormattedNumber(val) {
  if (!val) return 0;
  return parseFloat(val.toString().replace(/,/g, "")) || 0;
}

export function formatNumberWithCommas(val) {
  if (!val && val !== 0) return "";
  const cleanNum = val.toString().replace(/\D/g, "");
  if (!cleanNum) return "";
  return parseInt(cleanNum, 10).toLocaleString("en-US");
}

export function getPlanProgress(plan) {
  if (!Array.isArray(plan.objectives) || plan.objectives.length === 0) {
    return 0;
  }
  const completedCount = plan.objectives.filter((obj) => obj.completed).length;
  return (completedCount / plan.objectives.length) * 100;
}

/**
 * Maps template properties (baseline & optimal) into Plan Objectives matching storage schema
 * @param {Object} template - Target template object
 * @returns {Array} List of formatted objectives
 */
export function mapTemplateToObjectives(template) {
  const objectives = [];

  if (template.baseline && template.baseline.trim() !== "") {
    objectives.push({
      id: generateId(),
      title: `Baseline: ${template.baseline.trim()}`,
      type: "boolean",
      targetValue: 1,
      currentValue: 0,
      unit: "task",
      completed: false,
    });
  }

  if (template.optimal && template.optimal.trim() !== "") {
    objectives.push({
      id: generateId(),
      title: `Optimal: ${template.optimal.trim()}`,
      type: "boolean",
      targetValue: 1,
      currentValue: 0,
      unit: "task",
      completed: false,
    });
  }

  return objectives;
}
