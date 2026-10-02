/**
 * @file TrajectoryCard.js
 * @description Renders predictive focus trajectory and longitudinal trend regression.
 */

import { PrincipleEvaluator } from "../engine/PrincipleEvaluator.js";

export class TrajectoryCard {
  /**
   * @param {string} containerId - DOM Node ID
   */
  constructor(containerId) {
    this.container = document.getElementById(containerId);
  }

  /**
   * Renders trajectory analysis.
   * @param {number} daysBack
   */
  render(daysBack = 30) {
    if (!this.container) return;

    const { principles } = PrincipleEvaluator.evaluateAll(daysBack);
    const kaizen = principles.kaizen;
    const isUp = kaizen.slope >= 0;
    const hasData = kaizen.status !== "INSUFFICIENT_DATA";

    this.container.innerHTML = `
      <div class="card p-6 rounded-2xl bg-surface/60 backdrop-blur-xl border border-border mb-6">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
          <h3 class="text-base font-extrabold text-primary flex items-center gap-2">
            <i class="ti ti-trending-up ${isUp ? "text-emerald-400" : "text-red-400"} text-2xl"></i>
            Performance Trajectory
          </h3>
          <div class="flex items-center gap-2 shrink-0">
            <span class="text-xs font-bold px-3 py-1.5 rounded-xl ${
              !hasData
                ? "bg-sky-500/15 text-sky-400 border border-sky-500/30"
                : isUp
                  ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                  : "bg-red-500/15 text-red-400 border border-red-500/30"
            }">
              ${!hasData ? "Collecting Data" : isUp ? "Positive Growth" : "Performance Decline"}
            </span>
          </div>
        </div>

        <div class="p-4 rounded-xl bg-surface-2/60 border border-border/80 flex items-center justify-between gap-4">
          <div>
            <h4 class="text-sm font-bold text-primary mb-1">
              ${
                !hasData
                  ? "Awaiting Focus Session Data"
                  : isUp
                    ? "Continuous Daily Progress"
                    : "Systemic Performance Slowdown"
              }
            </h4>
            <p class="text-xs text-secondary leading-relaxed">
              ${
                !hasData
                  ? "Complete a few focus sessions over multiple days to unlock trajectory analysis."
                  : isUp
                    ? "Your daily productivity momentum is steadily building up. Current focus capacity remains high."
                    : "Your focus duration has been dropping. Consider recalibrating your daily workload to avoid fatigue."
              }
            </p>
          </div>
          <div class="text-4xl ${isUp ? "text-emerald-400" : "text-red-400"} pl-2 shrink-0">
            <i class="ti ${isUp ? "ti-chart-line" : "ti-trending-down"}"></i>
          </div>
        </div>
      </div>
    `;
  }
}
