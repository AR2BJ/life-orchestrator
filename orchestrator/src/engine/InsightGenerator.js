/**
 * @file InsightGenerator.js
 * @description Executive insight and recommendation engine for the 10 selected
 * Japanese behavioral principles.
 *
 * Converts quantitative evaluations from PrincipleEvaluator into actionable
 * recommendations, system health scoring, risk alerts, and operational focus
 * adjustments.
 */

import { PrincipleEvaluator } from "./PrincipleEvaluator.js";

/**
 * Weight map for the macro health index.
 * Higher weight => more impact on the overall score when the principle is at risk.
 */
const HEALTH_WEIGHTS = Object.freeze({
  ushitoku: 25,
  kaizen: 10,
  torimazu: 10,
  fudoshin: 10,
  mottainai: 10,
  gyoji: 8,
  datsuzoku: 8,
  pokaPokaTime: 8,
  zanshin: 6,
  shinGiNemawashi: 5,
});

export const InsightGenerator = {
  /**
   * Generates a comprehensive executive diagnostic report across the 10
   * selected Japanese behavioral principles.
   * @param {number} daysBack
   * @returns {Object}
   */
  generateExecutiveReport(daysBack = 30) {
    const evaluation = PrincipleEvaluator.evaluateAll(daysBack);
    const principles = evaluation.principles;

    return {
      windowDays: daysBack,
      evaluatedAt: evaluation.evaluatedAt,
      healthIndex: this.calculateMacroHealthIndex(principles),
      alerts: this.extractCriticalAlerts(principles),
      strengths: this.extractPositiveReinforcements(principles),
      recommendations: this.generateTacticalRecommendations(principles),
      detailedEvaluations: evaluation,
    };
  },

  /**
   * Identifies critical operational risks requiring immediate intervention.
   * @param {Object} principles
   * @returns {Array<Object>}
   */
  extractCriticalAlerts(principles) {
    const alerts = [];

    if (principles.ushitoku.status === "FATIGUE_OVERLOAD_STOP_REQUIRED") {
      alerts.push({
        code: "ALERT_USHITOKU_BURNOUT",
        severity: "CRITICAL",
        principle: "ushitoku",
        title: "Fatigue Overload Detected (Ushitoku)",
        message: `Recent focus time reached ${principles.ushitoku.avgRecentFocusMinutes} mins/day. Immediate rest is required.`,
      });
    }

    if (principles.kaizen.status === "VOLATILE_SPIKE_RISK") {
      alerts.push({
        code: "ALERT_KAIZEN_SPIKE",
        severity: "HIGH",
        principle: "kaizen",
        title: "Workload Volatility (Kaizen)",
        message:
          "Unsustained effort spikes detected. High risk of immediate subsequent drop-off.",
      });
    }

    if (principles.torimazu.status === "ANALYSIS_PARALYSIS") {
      alerts.push({
        code: "ALERT_TORIMAZU_DELAY",
        severity: "HIGH",
        principle: "torimazu",
        title: "Action Delay (Torimazu)",
        message: `Average lag from task creation to completion is ${principles.torimazu.avgDelayMinutes} minutes. Reduce task friction.`,
      });
    }

    if (principles.mottainai.status === "HIGH_RESOURCE_WASTE") {
      alerts.push({
        code: "ALERT_MOTTAINAI_WASTE",
        severity: "MEDIUM",
        principle: "mottainai",
        title: "Wasted Resources (Mottainai)",
        message: `Combined waste detected — Sessions: ${principles.mottainai.sessionWaste}%, Habits: ${principles.mottainai.habitWaste}%, Tasks: ${principles.mottainai.taskWaste}%.`,
      });
    }

    if (principles.pokaPokaTime.status === "OVERPACKED_SCHEDULE") {
      alerts.push({
        code: "ALERT_POKA_POKA_OVERLOAD",
        severity: "MEDIUM",
        principle: "pokaPokaTime",
        title: "Insufficient Recovery (Poka Poka)",
        message: `Average break between sessions is only ${principles.pokaPokaTime.avgBreakMinutes} minutes. Inject deliberate recovery gaps.`,
      });
    }

    return alerts;
  },

  /**
   * Extracts areas where system behavior is operating at peak efficiency.
   * @param {Object} principles
   * @returns {Array<Object>}
   */
  extractPositiveReinforcements(principles) {
    const strengths = [];

    if (principles.fudoshin.status === "IMMOVABLE_MIND") {
      strengths.push({
        principle: "fudoshin",
        label: "Fudōshin",
        description: `Exceptional focus retention with only ${principles.fudoshin.interruptionsPerSession} interruptions per session.`,
      });
    }

    if (principles.zanshin.status === "LINGERING_AWARENESS") {
      strengths.push({
        principle: "zanshin",
        label: "Zanshin",
        description: `High post-focus documentation rate (${principles.zanshin.reflectionRate}%). Excellent knowledge retention.`,
      });
    }

    if (principles.pokaPokaTime.status === "OPTIMAL_RECOVERY") {
      strengths.push({
        principle: "pokaPokaTime",
        label: "Poka Poka Time",
        description: `Average recovery gap of ${principles.pokaPokaTime.avgBreakMinutes} minutes. Sustained cognitive hygiene.`,
      });
    }

    if (principles.shinGiNemawashi.status === "FULLY_PREPARED") {
      strengths.push({
        principle: "shinGiNemawashi",
        label: "Shin-Gi / Nemawashi",
        description: `${principles.shinGiNemawashi.breakdownRate}% of completed tasks were properly broken down into subtasks.`,
      });
    }

    if (principles.kaizen.status === "OPTIMAL_KAIZEN_STEADY") {
      strengths.push({
        principle: "kaizen",
        label: "Kaizen",
        description:
          "Steady continuous improvement without volatile spikes detected.",
      });
    }

    return strengths;
  },

  /**
   * Generates actionable tactical directives based on cross-principle evaluation.
   * @param {Object} principles
   * @returns {Array<Object>}
   */
  generateTacticalRecommendations(principles) {
    const directives = [];

    if (principles.shinGiNemawashi.status === "UNPREPARED_EXECUTION") {
      directives.push({
        action: "ENFORCE_SUBTASK_BREAKDOWN",
        targetModule: "task_manager",
        principle: "shinGiNemawashi",
        description: `Subtask breakdown rate is low (${principles.shinGiNemawashi.breakdownRate}%). Mandate subtask creation for complex tasks before starting a session.`,
      });
    }

    if (principles.pokaPokaTime.status === "OVERPACKED_SCHEDULE") {
      directives.push({
        action: "INJECT_MANDATORY_BUFFER_TIME",
        targetModule: "time_manager",
        principle: "pokaPokaTime",
        description: `Average rest gaps are too small (${principles.pokaPokaTime.avgBreakMinutes} mins). Auto-inject a minimum recovery window between focus blocks.`,
      });
    }

    if (principles.datsuzoku.status === "ROUTINE_FATIGUE_BREAK_NEEDED") {
      directives.push({
        action: "TRIGGER_CONTEXT_RESET",
        targetModule: "task_manager",
        principle: "datsuzoku",
        description:
          "Monotonous focus pattern detected. Recommend shuffling active task categories or switching work modes.",
      });
    }

    if (principles.torimazu.status === "ANALYSIS_PARALYSIS") {
      directives.push({
        action: "REDUCE_TASK_FRICTION",
        targetModule: "task_manager",
        principle: "torimazu",
        description:
          "Tasks take too long from creation to completion. Break large tasks down and start immediately.",
      });
    }

    if (principles.fudoshin.status === "HIGHLY_DISTRACTED") {
      directives.push({
        action: "ENABLE_FOCUS_PROTECTION",
        targetModule: "time_manager",
        principle: "fudoshin",
        description: `Frequent interruptions detected (${principles.fudoshin.interruptionsPerSession} per session). Consider Airplane Mode / Monotasking.`,
      });
    }

    if (principles.zanshin.status === "MINDFULNESS_DEFICIT") {
      directives.push({
        action: "PROMPT_POST_SESSION_REFLECTION",
        targetModule: "mind_manager",
        principle: "zanshin",
        description:
          "Low post-focus documentation rate. Prompt for a short reflection note after each completed session.",
      });
    }

    return directives;
  },

  /**
   * Calculates a composite System Health Index in [0..100] across all selected
   * principles. Deductions are weighted by principle importance.
   * @param {Object} principles
   * @returns {number}
   */
  calculateMacroHealthIndex(principles) {
    let score = 100;

    const deduct = (principleKey, condition, amount) => {
      if (condition) score -= amount;
    };

    deduct(
      "ushitoku",
      principles.ushitoku.status === "FATIGUE_OVERLOAD_STOP_REQUIRED",
      HEALTH_WEIGHTS.ushitoku,
    );
    deduct(
      "kaizen",
      principles.kaizen.status === "VOLATILE_SPIKE_RISK" ||
        principles.kaizen.status === "STAGNANT_OR_DECLINING",
      HEALTH_WEIGHTS.kaizen,
    );
    deduct(
      "torimazu",
      principles.torimazu.status === "ANALYSIS_PARALYSIS",
      HEALTH_WEIGHTS.torimazu,
    );
    deduct(
      "fudoshin",
      principles.fudoshin.status === "HIGHLY_DISTRACTED",
      HEALTH_WEIGHTS.fudoshin,
    );
    deduct(
      "mottainai",
      principles.mottainai.status === "HIGH_RESOURCE_WASTE",
      HEALTH_WEIGHTS.mottainai,
    );
    deduct(
      "gyoji",
      principles.gyoji.status === "WEEKEND_SLUMP",
      HEALTH_WEIGHTS.gyoji,
    );
    deduct(
      "datsuzoku",
      principles.datsuzoku.status === "ROUTINE_FATIGUE_BREAK_NEEDED",
      HEALTH_WEIGHTS.datsuzoku,
    );
    deduct(
      "pokaPokaTime",
      principles.pokaPokaTime.status === "OVERPACKED_SCHEDULE",
      HEALTH_WEIGHTS.pokaPokaTime,
    );
    deduct(
      "zanshin",
      principles.zanshin.status === "MINDFULNESS_DEFICIT",
      HEALTH_WEIGHTS.zanshin,
    );
    deduct(
      "shinGiNemawashi",
      principles.shinGiNemawashi.status === "UNPREPARED_EXECUTION",
      HEALTH_WEIGHTS.shinGiNemawashi,
    );

    return Math.max(0, Math.min(100, Math.round(score)));
  },
};
