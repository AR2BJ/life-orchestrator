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
      <div class="p-4 sm:p-6 rounded-2xl bg-[#0f172a]/80 backdrop-blur-xl border border-[#1e293b] space-y-5 sm:space-y-6">
        <!-- Header Section -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1e293b] pb-4 sm:pb-5">
          <div>
            <h3 class="text-base sm:text-lg font-black text-white tracking-tight flex items-center gap-2">
              <i class="ti ti-heart-rate-monitor text-brand text-xl sm:text-2xl shrink-0"></i>
              System Operational Health
            </h3>
            <p class="text-xs text-[#94a3b8] mt-1 font-medium">
              Holistic productivity score evaluated across behavioral principles
            </p>
          </div>
          <div class="flex items-center justify-between sm:justify-start gap-3 bg-[#162036] px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-xl border border-[#1e293b] shrink-0">
            <span class="text-[10px] sm:text-[11px] text-[#94a3b8] font-mono uppercase tracking-wider">Health Index</span>
            <div class="text-2xl sm:text-3xl font-black ${this._getHealthColorClass(healthIndex)}">
              ${healthIndex}<span class="text-xs font-normal text-tertiary">/100</span>
            </div>
          </div>
        </div>

        <!-- Key Metrics Cards Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <!-- 1. Kaizen Growth Trend -->
          <div class="p-3.5 sm:p-4 rounded-xl bg-[#162036]/60 border border-[#1e293b] flex flex-col justify-between space-y-3">
            <div class="flex items-center justify-between gap-2">
              <span class="text-[10px] font-mono text-tertiary uppercase tracking-wider truncate">Growth Momentum</span>
              <span class="text-[9px] sm:text-[10px] font-mono font-bold px-2 py-0.5 rounded shrink-0 ${this._getBadgeClass(principles.kaizen.status)}">
                ${this._formatKaizenStatus(principles.kaizen.status)}
              </span>
            </div>
            <div>
              <div class="text-xl sm:text-2xl font-black text-white truncate">
                ${this._formatKaizenHeadline(principles.kaizen)}
              </div>
              <p class="text-xs text-[#94a3b8] mt-1 truncate">
                Cross-module slope: <span class="font-mono">${principles.kaizen.slope}</span>
              </p>
            </div>
          </div>

          <!-- 2. Focus Stability (Fudōshin) -->
          <div class="p-3.5 sm:p-4 rounded-xl bg-[#162036]/60 border border-[#1e293b] flex flex-col justify-between space-y-3">
            <div class="flex items-center justify-between gap-2">
              <span class="text-[10px] font-mono text-tertiary uppercase tracking-wider truncate">Focus Stability</span>
              <span class="text-[9px] sm:text-[10px] font-mono font-bold px-2 py-0.5 rounded shrink-0 ${this._getBadgeClass(principles.fudoshin.status)}">
                ${this._formatFudoshinStatus(principles.fudoshin.status)}
              </span>
            </div>
            <div>
              <div class="text-xl sm:text-2xl font-black text-white truncate">
                ${principles.fudoshin.interruptionsPerSession}
                <span class="text-xs text-tertiary font-normal">/ session</span>
              </div>
              <p class="text-xs text-[#94a3b8] mt-1 truncate">
                Average logged interruptions
              </p>
            </div>
          </div>

          <!-- 3. Workload Volume (Ushitoku) -->
          <div class="p-3.5 sm:p-4 rounded-xl bg-[#162036]/60 border border-[#1e293b] flex flex-col justify-between space-y-3">
            <div class="flex items-center justify-between gap-2">
              <span class="text-[10px] font-mono text-tertiary uppercase tracking-wider truncate">Workload Volume</span>
              <span class="text-[9px] sm:text-[10px] font-mono font-bold px-2 py-0.5 rounded shrink-0 ${this._getBadgeClass(principles.ushitoku.status)}">
                ${this._formatUshitokuStatus(principles.ushitoku.status)}
              </span>
            </div>
            <div>
              <div class="text-xl sm:text-2xl font-black text-white truncate">
                ${principles.ushitoku.avgRecentFocusMinutes}
                <span class="text-xs text-tertiary font-normal">min/day</span>
              </div>
              <p class="text-xs text-[#94a3b8] mt-1 truncate">
                3-day average focus time
              </p>
            </div>
          </div>

          <!-- 4. Recovery Quality (Poka Poka Time) -->
          <div class="p-3.5 sm:p-4 rounded-xl bg-[#162036]/60 border border-[#1e293b] flex flex-col justify-between space-y-3">
            <div class="flex items-center justify-between gap-2">
              <span class="text-[10px] font-mono text-tertiary uppercase tracking-wider truncate">Recovery Quality</span>
              <span class="text-[9px] sm:text-[10px] font-mono font-bold px-2 py-0.5 rounded shrink-0 ${this._getBadgeClass(principles.pokaPokaTime.status)}">
                ${this._formatPokaPokaStatus(principles.pokaPokaTime.status)}
              </span>
            </div>
            <div>
              <div class="text-xl sm:text-2xl font-black text-white truncate">
                ${principles.pokaPokaTime.avgBreakMinutes}
                <span class="text-xs text-tertiary font-normal">min/break</span>
              </div>
              <p class="text-xs text-[#94a3b8] mt-1 truncate">
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
    if (score >= 80) return "text-[#10b981]";
    if (score >= 60) return "text-[#f59e0b]";
    return "text-[#ef4444]";
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
      return "bg-[#10b981]/15 text-[#10b981] border border-[#10b981]/30";
    }
    if (
      status.includes("BALANCED") ||
      status.includes("INSUFFICIENT") ||
      status.includes("NO_")
    ) {
      return "bg-brand/20 text-[#94a3b8] border border-brand/30";
    }
    return "bg-[#ef4444]/15 text-[#ef4444] border border-[#ef4444]/30";
  }
}
