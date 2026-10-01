/**
 * @file PrincipleScoreCard.js
 * @description Core ScoreCard UI component displaying holistic health metrics
 * and evaluated statuses across the selected Japanese behavioral principles.
 */

import { InsightGenerator } from "../engine/InsightGenerator.js";

export class PrincipleScoreCard {
  /**
   * @param {string} containerId - DOM Node ID
   */
  constructor(containerId) {
    this.container = document.getElementById(containerId);
  }

  /**
   * Renders the health index and top evaluated principles.
   * @param {number} daysBack
   */
  render(daysBack = 30) {
    if (!this.container) return;

    const report = InsightGenerator.generateExecutiveReport(daysBack);
    const { healthIndex, detailedEvaluations } = report;
    const { principles } = detailedEvaluations;

    this.container.innerHTML = `
      <div
        class="card p-6 rounded-2xl bg-surface/60 backdrop-blur-xl border border-border mb-6"
      >
        <!-- Header Section -->
        <div
          class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b border-border/60 pb-5"
        >
          <div>
            <h3
              class="text-lg font-extrabold text-primary flex items-center gap-2"
            >
              <i class="ti ti-heart-rate-monitor text-brand text-2xl"></i>
              System Operational Health
            </h3>
            <p class="text-sm text-secondary mt-1">
              Holistic productivity score evaluated across selected behavioral
              principles.
            </p>
          </div>
          <div
            class="flex items-center gap-3 bg-surface-2/80 px-4 py-2.5 rounded-xl border border-border shrink-0"
          >
            <span
              class="text-xs text-secondary font-semibold uppercase tracking-wider"
              >Health Index</span
            >
            <div
              class="text-3xl font-black ${this._getHealthColorClass(
                healthIndex,
              )}"
            >
              ${healthIndex}<span class="text-sm font-normal text-secondary"
                >/100</span
              >
            </div>
          </div>
        </div>

        <!-- Key Metrics Cards Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <!-- 1. Kaizen Growth Trend -->
          <div
            class="p-4 rounded-xl bg-surface-2/60 border border-border/80 flex flex-col justify-between space-y-3"
          >
            <div class="flex items-center justify-between">
              <span
                class="text-xs text-secondary font-bold uppercase tracking-wider"
                >Growth Momentum</span
              >
              <span
                class="text-xs font-bold px-2.5 py-1 rounded-lg ${this._getBadgeClass(
                  principles.kaizen.status,
                )}"
              >
                ${this._formatKaizenStatus(principles.kaizen.status)}
              </span>
            </div>
            <div>
              <div class="text-2xl font-black text-primary">
                ${this._formatKaizenHeadline(principles.kaizen)}
              </div>
              <p class="text-xs text-secondary mt-1">
                Cross-module slope: ${principles.kaizen.slope}
              </p>
            </div>
          </div>

          <!-- 2. Focus Stability (Fudōshin) -->
          <div
            class="p-4 rounded-xl bg-surface-2/60 border border-border/80 flex flex-col justify-between space-y-3"
          >
            <div class="flex items-center justify-between">
              <span
                class="text-xs text-secondary font-bold uppercase tracking-wider"
                >Focus Stability</span
              >
              <span
                class="text-xs font-bold px-2.5 py-1 rounded-lg ${this._getBadgeClass(
                  principles.fudoshin.status,
                )}"
              >
                ${this._formatFudoshinStatus(principles.fudoshin.status)}
              </span>
            </div>
            <div>
              <div class="text-2xl font-black text-primary">
                ${principles.fudoshin.interruptionsPerSession}
                <span class="text-xs text-secondary font-normal"
                  >per session</span
                >
              </div>
              <p class="text-xs text-secondary mt-1">
                Average logged interruptions
              </p>
            </div>
          </div>

          <!-- 3. Workload Volume (Ushitoku) -->
          <div
            class="p-4 rounded-xl bg-surface-2/60 border border-border/80 flex flex-col justify-between space-y-3"
          >
            <div class="flex items-center justify-between">
              <span
                class="text-xs text-secondary font-bold uppercase tracking-wider"
                >Workload Volume</span
              >
              <span
                class="text-xs font-bold px-2.5 py-1 rounded-lg ${this._getBadgeClass(
                  principles.ushitoku.status,
                )}"
              >
                ${this._formatUshitokuStatus(principles.ushitoku.status)}
              </span>
            </div>
            <div>
              <div class="text-2xl font-black text-primary">
                ${principles.ushitoku.avgRecentFocusMinutes}
                <span class="text-xs text-secondary font-normal">min/day</span>
              </div>
              <p class="text-xs text-secondary mt-1">
                3-day average focus time
              </p>
            </div>
          </div>

          <!-- 4. Recovery Quality (Poka Poka Time) -->
          <div
            class="p-4 rounded-xl bg-surface-2/60 border border-border/80 flex flex-col justify-between space-y-3"
          >
            <div class="flex items-center justify-between">
              <span
                class="text-xs text-secondary font-bold uppercase tracking-wider"
                >Recovery Quality</span
              >
              <span
                class="text-xs font-bold px-2.5 py-1 rounded-lg ${this._getBadgeClass(
                  principles.pokaPokaTime.status,
                )}"
              >
                ${this._formatPokaPokaStatus(principles.pokaPokaTime.status)}
              </span>
            </div>
            <div>
              <div class="text-2xl font-black text-primary">
                ${principles.pokaPokaTime.avgBreakMinutes}
                <span class="text-xs text-secondary font-normal"
                  >min/break</span
                >
              </div>
              <p class="text-xs text-secondary mt-1">
                Average gap between sessions
              </p>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  /**
   * @param {number} score
   * @returns {string}
   * @private
   */
  _getHealthColorClass(score) {
    if (score >= 80) return "text-emerald-400";
    if (score >= 60) return "text-amber-400";
    return "text-red-400";
  }

  /**
   * @private
   */
  _formatKaizenHeadline(kaizen) {
    if (kaizen.status === "INSUFFICIENT_DATA") return "No Data";
    if (kaizen.slope > 0.005) return "Upward";
    if (kaizen.slope < -0.005) return "Declining";
    return "Stable";
  }

  /**
   * @private
   */
  _formatKaizenStatus(status) {
    if (status === "OPTIMAL_KAIZEN_STEADY") return "Steady Growth";
    if (status === "VOLATILE_SPIKE_RISK") return "High Volatility";
    if (status === "STAGNANT_OR_DECLINING") return "Declining";
    if (status === "INSUFFICIENT_DATA") return "No Data";
    return "Balanced";
  }

  /**
   * @private
   */
  _formatFudoshinStatus(status) {
    if (status === "IMMOVABLE_MIND") return "High Control";
    if (status === "HIGHLY_DISTRACTED") return "Needs Shielding";
    if (status === "INSUFFICIENT_DATA") return "No Data";
    return "Stable";
  }

  /**
   * @private
   */
  _formatUshitokuStatus(status) {
    if (status === "SAFE_BOUNDARIES") return "Sustainable";
    if (status === "FATIGUE_OVERLOAD_STOP_REQUIRED") return "Overwork Risk";
    return "Normal";
  }

  /**
   * @private
   */
  _formatPokaPokaStatus(status) {
    if (status === "OPTIMAL_RECOVERY") return "Optimal";
    if (status === "OVERPACKED_SCHEDULE") return "Too Tight";
    if (status === "NO_BREAK_DATA") return "No Data";
    return "Balanced";
  }

  /**
   * @param {string} status
   * @returns {string}
   * @private
   */
  _getBadgeClass(status) {
    if (
      status.includes("OPTIMAL") ||
      status.includes("SAFE") ||
      status.includes("IMMOVABLE") ||
      status.includes("STEADY")
    ) {
      return "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30";
    }
    if (
      status.includes("BALANCED") ||
      status.includes("INSUFFICIENT") ||
      status.includes("NO_")
    ) {
      return "bg-sky-500/15 text-sky-400 border border-sky-500/30";
    }
    return "bg-red-500/15 text-red-400 border border-red-500/30";
  }
}
