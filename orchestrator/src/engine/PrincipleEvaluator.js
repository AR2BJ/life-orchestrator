/**
 * @file PrincipleEvaluator.js
 * @description Master evaluation engine for the 10 selected Japanese behavioral
 * principles, now fully multi-module across all five namespaces.
 *
 * Every principle draws data from at least two modules wherever possible.
 * Kaizen, specifically, aggregates per-module progress into a single
 * cross-module continuous-improvement signal.
 */

import { AnalyticsMath } from "./AnalyticsMath.js";
import { CrossModuleAggregator } from "./CrossModuleAggregator.js";

const MIN_DAYS_WITH_DATA = 3;

/**
 * Normalizes a raw numeric series to [0..1] using min-max scaling so that
 * different modules (tasks, minutes, notes) can be combined fairly in the
 * cross-module Kaizen calculation.
 */
function normalizeSeries(series) {
  if (!Array.isArray(series) || series.length === 0) return [];
  const max = Math.max(...series);
  if (max <= 0) return series.map(() => 0);
  return series.map((v) => Number((v / max).toFixed(4)));
}

export const PrincipleEvaluator = {
  evaluateAll(daysBack = 30) {
    const timeline = CrossModuleAggregator.getDailyTimeline(daysBack);

    return {
      windowDays: daysBack,
      principles: {
        kaizen: this.evaluateKaizen(timeline),
        torimazu: this.evaluateTorimazu(timeline),
        gyoji: this.evaluateGyoji(timeline),
        zanshin: this.evaluateZanshin(timeline),
        fudoshin: this.evaluateFudoshin(timeline),
        datsuzoku: this.evaluateDatsuzoku(timeline),
        mottainai: this.evaluateMottainai(timeline),
        pokaPokaTime: this.evaluatePokaPokaTime(timeline),
        shinGiNemawashi: this.evaluateShinGiNemawashi(timeline),
        ushitoku: this.evaluateUshitoku(timeline),
      },
      evaluatedAt: new Date().toISOString(),
    };
  },

  // ==========================================
  // 1. KAIZEN — Cross-module continuous progress
  // ==========================================
  /**
   * Kaizen is computed as the mean of normalized linear-regression slopes
   * across all five modules. Each module contributes one slope, computed on
   * its own daily activity series. This yields a single "cross-module
   * continuous improvement" score, instead of only looking at focus time.
   */
  evaluateKaizen(timeline) {
    const series = CrossModuleAggregator.getModuleProgressSeries(timeline);

    const moduleSlopes = {};
    const moduleDataDays = {};
    const validSlopes = [];

    Object.entries(series).forEach(([moduleKey, rawSeries]) => {
      const dataDays = rawSeries.filter((v) => v > 0).length;
      moduleDataDays[moduleKey] = dataDays;

      if (dataDays < MIN_DAYS_WITH_DATA) {
        moduleSlopes[moduleKey] = 0;
        return;
      }

      const normalized = normalizeSeries(rawSeries);
      const regression = AnalyticsMath.linearRegression(normalized);
      moduleSlopes[moduleKey] = regression.slope;
      validSlopes.push(regression.slope);
    });

    if (validSlopes.length === 0) {
      return {
        slope: 0,
        moduleSlopes,
        moduleDataDays,
        spikeDetected: false,
        status: "INSUFFICIENT_DATA",
      };
    }

    const avgSlope =
      validSlopes.reduce((a, b) => a + b, 0) / validSlopes.length;

    // Cross-module volatility: check aggregated series for outliers
    const aggregatedSeries = timeline.map((_, i) =>
      Object.values(series).reduce((sum, s) => sum + (s[i] || 0), 0),
    );
    const iqr = AnalyticsMath.iqrAnalysis(aggregatedSeries);
    const spikeDetected = iqr.outliers.some((val) => val > iqr.q3);

    let status = "BALANCED_GROWTH";
    if (avgSlope > 0 && !spikeDetected) status = "OPTIMAL_KAIZEN_STEADY";
    else if (spikeDetected) status = "VOLATILE_SPIKE_RISK";
    else if (avgSlope < 0) status = "STAGNANT_OR_DECLINING";

    return {
      slope: Number(avgSlope.toFixed(4)),
      moduleSlopes,
      moduleDataDays,
      spikeDetected,
      status,
    };
  },

  // ==========================================
  // 2. TORIMAZU — Task creation-to-completion lag
  // ==========================================
  evaluateTorimazu(timeline) {
    const allDelays = timeline.flatMap((d) => d.torimazuDelaysMinutes);

    if (allDelays.length === 0) {
      return { avgDelayMinutes: 0, sampleSize: 0, status: "INSUFFICIENT_DATA" };
    }

    const avgDelay = AnalyticsMath.mean(allDelays);
    const status = avgDelay > 1440 ? "ANALYSIS_PARALYSIS" : "IMMEDIATE_ACTION";

    return {
      avgDelayMinutes: Number(avgDelay.toFixed(1)),
      sampleSize: allDelays.length,
      status,
    };
  },

  // ==========================================
  // 3. GYOJI — Continuity (multi-module)
  // ==========================================
  /**
   * Gyoji measures whether practice continues across the week. We combine:
   *  - Time Manager focus minutes (weekday vs weekend)
   *  - Habit Tracker completions (weekday vs weekend)
   *  - Mind Manager knowledge activity (weekday vs weekend)
   */
  evaluateGyoji(timeline) {
    const weekdayFocus = [];
    const weekendFocus = [];
    const weekdayHabits = [];
    const weekendHabits = [];
    const weekdayMind = [];
    const weekendMind = [];

    timeline.forEach((d) => {
      if (d.isWeekend) {
        weekendFocus.push(d.focusDurationMinutes);
        weekendHabits.push(d.habitsCompleted);
        weekendMind.push(d.mindKnowledgeActivity);
      } else {
        weekdayFocus.push(d.focusDurationMinutes);
        weekdayHabits.push(d.habitsCompleted);
        weekdayMind.push(d.mindKnowledgeActivity);
      }
    });

    const avg = (arr) => AnalyticsMath.mean(arr);

    const weekdayAvgFocus = avg(weekdayFocus);
    const weekdayAvgHabits = avg(weekdayHabits);
    const weekdayAvgMind = avg(weekdayMind);

    const hasWeekdayActivity =
      weekdayAvgFocus > 0 || weekdayAvgHabits > 0 || weekdayAvgMind > 0;

    if (!hasWeekdayActivity) {
      return {
        focusRatio: 0,
        habitRatio: 0,
        mindRatio: 0,
        ratio: 0,
        status: "INSUFFICIENT_DATA",
      };
    }

    const focusRatio =
      weekdayAvgFocus === 0 ? 0 : avg(weekendFocus) / weekdayAvgFocus;
    const habitRatio =
      weekdayAvgHabits === 0 ? 0 : avg(weekendHabits) / weekdayAvgHabits;
    const mindRatio =
      weekdayAvgMind === 0 ? 0 : avg(weekendMind) / weekdayAvgMind;

    const ratios = [focusRatio, habitRatio, mindRatio].filter(
      (r) => isFinite(r) && r > 0,
    );

    const combinedRatio = ratios.length
      ? Number((ratios.reduce((a, b) => a + b, 0) / ratios.length).toFixed(2))
      : 0;

    const status =
      combinedRatio < 0.2 ? "WEEKEND_SLUMP" : "CONTINUOUS_PRACTICE";

    return {
      focusRatio: Number(focusRatio.toFixed(2)),
      habitRatio: Number(habitRatio.toFixed(2)),
      mindRatio: Number(mindRatio.toFixed(2)),
      ratio: combinedRatio,
      status,
    };
  },

  // ==========================================
  // 4. ZANSHIN — Post-session awareness (multi-module)
  // ==========================================
  /**
   * Zanshin looks at what the user does AFTER a focus session ends:
   *  - Mind Manager: notes created within 10 minutes after a session
   *  - Life Planner: logs created within 10 minutes after a session
   */
  evaluateZanshin(timeline) {
    const totalSessions = AnalyticsMath.sum(
      timeline.map((d) => d.sessionCount),
    );
    const totalPostNotes = AnalyticsMath.sum(
      timeline.map((d) => d.notesCreatedPostFocus),
    );
    const totalLogs = AnalyticsMath.sum(timeline.map((d) => d.logsCount));

    if (totalSessions === 0) {
      return { reflectionRate: 0, status: "INSUFFICIENT_DATA" };
    }

    const noteRate = (totalPostNotes / totalSessions) * 100;
    const logRate = (totalLogs / totalSessions) * 100;
    const combinedRate = Number(
      Math.min(100, noteRate * 0.7 + logRate * 0.3).toFixed(1),
    );

    const status =
      combinedRate < 20 ? "MINDFULNESS_DEFICIT" : "LINGERING_AWARENESS";

    return {
      reflectionRate: combinedRate,
      noteRate: Number(noteRate.toFixed(1)),
      logRate: Number(logRate.toFixed(1)),
      status,
    };
  },

  // ==========================================
  // 5. FUDŌSHIN — Resistance to interruption
  // ==========================================
  evaluateFudoshin(timeline) {
    const totalSessions = AnalyticsMath.sum(
      timeline.map((d) => d.sessionCount),
    );
    const totalInterruptions = AnalyticsMath.sum(
      timeline.map((d) => d.interruptionCount),
    );
    const totalShortSessions = AnalyticsMath.sum(
      timeline.map((d) => d.shortSessionsCount),
    );

    if (totalSessions === 0) {
      return { interruptionsPerSession: 0, status: "INSUFFICIENT_DATA" };
    }

    const interruptionsPerSession = Number(
      (totalInterruptions / totalSessions).toFixed(2),
    );
    const shortSessionRatio = Number(
      ((totalShortSessions / totalSessions) * 100).toFixed(1),
    );

    // Combine explicit interruption count with short-session proxy for a
    // more robust signal in the multi-module context.
    const status =
      interruptionsPerSession > 1.5 || shortSessionRatio > 30
        ? "HIGHLY_DISTRACTED"
        : "IMMOVABLE_MIND";

    return {
      interruptionsPerSession,
      shortSessionRatio,
      status,
    };
  },

  // ==========================================
  // 6. DATSUZOKU — Escape from routine (multi-module)
  // ==========================================
  /**
   * Datsuzoku combines:
   *  - Time Manager: focus variability (CV)
   *  - Mind Manager: category diversity (unique mindCategoriesCount)
   *  - Task Manager: category diversity (uniqueCategoriesCount)
   */
  evaluateDatsuzoku(timeline) {
    const focusSeries = timeline.map((d) => d.focusDurationMinutes);
    const dataDays = focusSeries.filter((v) => v > 0).length;

    if (dataDays < MIN_DAYS_WITH_DATA) {
      return { cv: 0, status: "INSUFFICIENT_DATA" };
    }

    const cv = AnalyticsMath.coefficientOfVariation(focusSeries);

    const avgTaskCats = AnalyticsMath.mean(
      timeline.map((d) => d.uniqueCategoriesCount),
    );
    const avgMindCats = AnalyticsMath.mean(
      timeline.map((d) => d.mindCategoriesCount),
    );
    const avgHabitCats = AnalyticsMath.mean(
      timeline.map((d) => d.habitCategoriesCount),
    );

    const diversityScore = Number(
      (avgTaskCats * 0.4 + avgMindCats * 0.4 + avgHabitCats * 0.2).toFixed(2),
    );

    const ewma = AnalyticsMath.ewma(focusSeries, 0.2);
    const recentTrend = ewma.slice(-5);
    const isDeclining =
      recentTrend.length >= 2 &&
      recentTrend[recentTrend.length - 1] < recentTrend[0];

    const isLowDiversity = diversityScore < 1.5;
    const status =
      (isDeclining && cv < 15) || isLowDiversity
        ? "ROUTINE_FATIGUE_BREAK_NEEDED"
        : "DYNAMIC_FLOW";

    return {
      cv,
      diversityScore,
      status,
    };
  },

  // ==========================================
  // 7. MOTTAINAI — Wasted resources (multi-module)
  // ==========================================
  /**
   * Mottainai now looks for wasted resources across all modules:
   *  - Time Manager: zero-duration sessions
   *  - Habit Tracker: skipped habits
   *  - Task Manager: tasks created but never completed (proxy via tasksCreated > tasksCompleted)
   */
  evaluateMottainai(timeline) {
    const totalSessions = AnalyticsMath.sum(
      timeline.map((d) => d.sessionCount),
    );
    const totalHabitsActive = AnalyticsMath.sum(
      timeline.map((d) => d.habitsActiveTotal),
    );
    const totalTasksCreated = AnalyticsMath.sum(
      timeline.map((d) => d.tasksCreated),
    );
    const totalTasksCompleted = AnalyticsMath.sum(
      timeline.map((d) => d.tasksCompleted),
    );

    if (
      totalSessions === 0 &&
      totalHabitsActive === 0 &&
      totalTasksCreated === 0
    ) {
      return {
        zeroDurationCount: 0,
        sessionWaste: 0,
        habitWaste: 0,
        taskWaste: 0,
        wasteRatio: 0,
        status: "INSUFFICIENT_DATA",
      };
    }

    const zeroDurationCount = timeline.reduce((acc, d) => {
      return (
        acc + d.focusSessions.filter((s) => s.isZeroDuration === true).length
      );
    }, 0);

    const totalHabitsSkipped = AnalyticsMath.sum(
      timeline.map((d) => d.habitsSkipped),
    );

    const sessionWaste =
      totalSessions === 0 ? 0 : (zeroDurationCount / totalSessions) * 100;
    const habitWaste =
      totalHabitsActive === 0
        ? 0
        : (totalHabitsSkipped / totalHabitsActive) * 100;
    const taskWaste =
      totalTasksCreated === 0
        ? 0
        : Math.max(
            0,
            ((totalTasksCreated - totalTasksCompleted) / totalTasksCreated) *
              100,
          );

    const wasteRatio = Number(
      (sessionWaste * 0.5 + habitWaste * 0.25 + taskWaste * 0.25).toFixed(1),
    );
    const status =
      wasteRatio > 15 ? "HIGH_RESOURCE_WASTE" : "RESOURCE_RESPECTED";

    return {
      zeroDurationCount,
      sessionWaste: Number(sessionWaste.toFixed(1)),
      habitWaste: Number(habitWaste.toFixed(1)),
      taskWaste: Number(taskWaste.toFixed(1)),
      wasteRatio,
      status,
    };
  },

  // ==========================================
  // 8. POKA POKA TIME — Recovery quality
  // ==========================================
  evaluatePokaPokaTime(timeline) {
    const allBreaks = timeline.flatMap((d) => d.breakDurationsMinutes);

    if (allBreaks.length === 0) {
      return { avgBreakMinutes: 0, sampleSize: 0, status: "NO_BREAK_DATA" };
    }

    const avgBreak = AnalyticsMath.mean(allBreaks);
    const status = avgBreak < 10 ? "OVERPACKED_SCHEDULE" : "OPTIMAL_RECOVERY";

    return {
      avgBreakMinutes: Number(avgBreak.toFixed(1)),
      sampleSize: allBreaks.length,
      status,
    };
  },

  // ==========================================
  // 9. SHIN-GI / NEMAWASHI — Preparation (multi-module)
  // ==========================================
  /**
   * Shin-Gi/Nemawashi combines:
   *  - Task Manager: tasks completed with subtasks
   *  - Life Planner: plans with objectives (preparation structures)
   */
  evaluateShinGiNemawashi(timeline) {
    const completedTasks = AnalyticsMath.sum(
      timeline.map((d) => d.tasksCompleted),
    );
    const tasksWithSubtasks = AnalyticsMath.sum(
      timeline.map((d) => d.tasksWithSubtasksCount),
    );

    const activePlansTotal = AnalyticsMath.sum(
      timeline.map((d) => d.activePlansCount),
    );
    const totalPlansWithObjectives = timeline.reduce((acc, d) => {
      return acc + (d.planObjectiveCount > 0 ? 1 : 0);
    }, 0);

    if (completedTasks === 0 && activePlansTotal === 0) {
      return { breakdownRate: 0, status: "INSUFFICIENT_DATA" };
    }

    const taskBreakdownRate =
      completedTasks === 0 ? 0 : (tasksWithSubtasks / completedTasks) * 100;

    const planPreparationRate =
      activePlansTotal === 0
        ? 0
        : (totalPlansWithObjectives / activePlansTotal) * 100;

    // Weighted combination: task breakdown is the primary signal,
    // plan preparation adds depth.
    const breakdownRate = Number(
      (taskBreakdownRate * 0.7 + planPreparationRate * 0.3).toFixed(1),
    );

    const status =
      breakdownRate < 30 ? "UNPREPARED_EXECUTION" : "FULLY_PREPARED";

    return {
      breakdownRate,
      taskBreakdownRate: Number(taskBreakdownRate.toFixed(1)),
      planPreparationRate: Number(planPreparationRate.toFixed(1)),
      status,
    };
  },

  // ==========================================
  // 10. USHITOKU — Damage control (multi-module)
  // ==========================================
  /**
   * Ushitoku combines recent fatigue signals from:
   *  - Time Manager: recent focus minutes
   *  - Habit Tracker: skipped habits (stress proxy)
   *  - Life Planner: low energy logs (bio-stress proxy)
   */
  evaluateUshitoku(timeline) {
    const recentWindow = timeline.slice(-3);

    const totalRecentSessions = AnalyticsMath.sum(
      recentWindow.map((d) => d.sessionCount),
    );
    const totalRecentHabitsActive = AnalyticsMath.sum(
      recentWindow.map((d) => d.habitsActiveTotal),
    );
    const recentEnergySamples = recentWindow
      .map((d) => d.avgEnergy)
      .filter((v) => v !== null && v !== undefined);

    const hasRecentData =
      totalRecentSessions > 0 ||
      totalRecentHabitsActive > 0 ||
      recentEnergySamples.length > 0;

    if (!hasRecentData) {
      return {
        avgRecentFocusMinutes: 0,
        recentSkippedHabits: 0,
        avgRecentEnergy: null,
        status: "INSUFFICIENT_DATA",
      };
    }

    const avgRecentFocus = AnalyticsMath.mean(
      recentWindow.map((d) => d.focusDurationMinutes),
    );
    const recentSkippedHabits = AnalyticsMath.sum(
      recentWindow.map((d) => d.habitsSkipped),
    );
    const avgRecentEnergy = recentEnergySamples.length
      ? AnalyticsMath.mean(recentEnergySamples)
      : null;

    const isFocusOverload = avgRecentFocus > 480;
    const isHighSkipping = recentSkippedHabits > 5;
    const isLowEnergy = avgRecentEnergy !== null && avgRecentEnergy < 2.5;

    const status =
      isFocusOverload || (isHighSkipping && isLowEnergy)
        ? "FATIGUE_OVERLOAD_STOP_REQUIRED"
        : "SAFE_BOUNDARIES";

    return {
      avgRecentFocusMinutes: Math.round(avgRecentFocus),
      recentSkippedHabits,
      avgRecentEnergy,
      status,
    };
  },
};
