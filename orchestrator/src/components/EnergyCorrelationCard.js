/**
 * @file EnergyCorrelationCard.js
 * @description Analyzes and displays correlation between energy logs and focus output.
 */

import { PrincipleEvaluator } from "../engine/PrincipleEvaluator.js";

export class EnergyCorrelationCard {
  /**
   * @param {string} containerId - DOM Node ID
   */
  constructor(containerId) {
    this.container = document.getElementById(containerId);
  }

  /**
   * Renders energy vs focus synergy telemetry.
   * @param {number} daysBack
   */
  render(daysBack = 30) {
    if (!this.container) return;

    const { westernPrinciples } = PrincipleEvaluator.evaluateAll(daysBack);
    const energy = westernPrinciples.energyAudit || {
      correlation: 0,
      status: "INSUFFICIENT_ENERGY_DATA",
    };

    this.container.innerHTML = `
      <div class="p-6 rounded-2xl bg-[#0f172a]/80 backdrop-blur-xl border border-[#1e293b] space-y-5">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-[#162036] border border-[#1e293b] flex items-center justify-center text-[#f59e0b]">
              <i class="ti ti-bolt text-xl"></i>
            </div>
            <div>
              <h3 class="text-base font-black text-white tracking-tight">Energy vs. Focus Alignment</h3>
              <p class="text-xs text-[#94a3b8]">Subjective energy output correlation telemetry</p>
            </div>
          </div>
          <span class="text-[11px] font-mono font-bold px-3 py-1 rounded-xl bg-[#162036] border border-[#1e293b] text-primary shrink-0 self-start sm:self-auto">
            ${this._getInterpretationStatus(energy.status)}
          </span>
        </div>

        <div class="p-4 rounded-xl bg-[#162036]/60 border border-[#1e293b] flex items-center justify-between gap-4">
          <div class="space-y-1">
            <h4 class="text-sm font-bold text-white">
              ${this._getInterpretationTitle(energy.status)}
            </h4>
            <p class="text-xs text-[#94a3b8] leading-relaxed">
              ${this._getInterpretationDescription(energy.status, daysBack)}
            </p>
          </div>
          <div class="text-3xl text-[#f59e0b] p-2 shrink-0 bg-[#0f172a] rounded-xl border border-[#1e293b]">
            <i class="ti ti-activity-heartbeat"></i>
          </div>
        </div>
      </div>
    `;
  }

  /**
   * @param {string} status
   * @returns {string}
   * @private
   */
  _getInterpretationStatus(status) {
    switch (status) {
      case "OPTIMAL_ENERGY_ALIGNMENT":
        return "High Synergy";
      case "ENERGY_MISALIGNMENT":
        return "Misaligned";
      default:
        return "Needs More Data";
    }
  }

  /**
   * @param {string} status
   * @returns {string}
   * @private
   */
  _getInterpretationTitle(status) {
    switch (status) {
      case "OPTIMAL_ENERGY_ALIGNMENT":
        return "Great Peak Energy Utilization";
      case "ENERGY_MISALIGNMENT":
        return "Energy & Task Priority Mismatch";
      default:
        return "Collecting Bio-Energy Logs";
    }
  }

  /**
   * @param {string} status
   * @param {number} daysBack
   * @returns {string}
   * @private
   */
  _getInterpretationDescription(status, daysBack) {
    switch (status) {
      case "OPTIMAL_ENERGY_ALIGNMENT":
        return `You are successfully tackling high-priority focus tasks during your personal peak energy hours over the last ${daysBack} days.`;
      case "ENERGY_MISALIGNMENT":
        return `Noticeable dip: You are doing heavy tasks when your energy levels are low. Try shifting demanding tasks to your peak hours.`;
      default:
        return `Keep logging your subjective energy levels along with focus sessions to unlock personalized output-to-energy insights.`;
    }
  }
}
