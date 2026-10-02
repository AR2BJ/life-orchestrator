/**
 * @file TrajectoryCard.js
 * @description Renders predictive focus trajectory and longitudinal trend regression.
 */

import { PrincipleEvaluator } from "../engine/PrincipleEvaluator.js";

export class TrajectoryCard {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
  }

  render(daysBack = 30) {
    if (!this.container) return;

    const { principles } = PrincipleEvaluator.evaluateAll(daysBack);
    const kaizen = principles.kaizen;
    const isUp = kaizen.slope >= 0;
    const hasData = kaizen.status !== "INSUFFICIENT_DATA";

    this.container.innerHTML = `
      <div class="h-full p-4 sm:p-6 rounded-2xl bg-[#0f172a]/90 border border-[#1e293b] backdrop-blur-2xl shadow-2xl flex flex-col justify-between gap-4">
        <!-- Header Section -->
        <div class="flex items-center justify-between gap-3 pb-3.5 sm:pb-4 border-b border-[#1e293b]/60">
          <div class="flex items-center gap-3 min-w-0">
            <div class="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#162036] border border-[#1e293b] flex items-center justify-center shrink-0 ${isUp ? "text-[#10b981]" : "text-[#ef4444]"}">
              <i class="ti ${isUp ? "ti-trending-up" : "ti-trending-down"} text-lg sm:text-xl"></i>
            </div>
            <div class="min-w-0">
              <h3 class="text-sm sm:text-base font-black text-white truncate">Performance Trajectory</h3>
              <p class="text-xs text-[#94a3b8] truncate">Longitudinal momentum & capacity forecast</p>
            </div>
          </div>
          <span class="text-[9px] sm:text-[10px] font-mono font-bold px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full shrink-0 ${
            !hasData
              ? "bg-brand/20 text-[#94a3b8] border border-brand/30"
              : isUp
                ? "bg-[#10b981]/15 text-[#10b981] border border-[#10b981]/30"
                : "bg-[#ef4444]/15 text-[#ef4444] border border-[#ef4444]/30"
          }">
            ${!hasData ? "Collecting Data" : isUp ? "Positive Momentum" : "Decline Detected"}
          </span>
        </div>

        <!-- Body Section -->
        <div class="my-auto py-2 sm:py-4">
          <div class="p-4 sm:p-5 rounded-2xl bg-[#162036]/50 border border-[#1e293b] flex items-center justify-between gap-3 sm:gap-4">
            <div class="space-y-1 min-w-0">
              <h4 class="text-xs sm:text-sm font-bold text-white truncate">
                ${!hasData ? "Awaiting Focus Session Data" : isUp ? "Continuous Daily Progress" : "Systemic Slowdown"}
              </h4>
              <p class="text-xs text-[#94a3b8] leading-relaxed wrap-break-word">
                ${!hasData ? "Complete a few focus sessions over multiple days to unlock trajectory analysis." : isUp ? "Productivity momentum is building steadily." : "Focus duration is dropping. Consider workload adjustments."}
              </p>
            </div>
            <div class="w-10 h-10 sm:w-12 sm:h-12 text-2xl sm:text-3xl ${isUp ? "text-[#10b981]" : "text-[#ef4444]"} shrink-0 bg-[#0f172a] rounded-2xl border border-[#1e293b] flex justify-center items-center">
              <i class="ti ${isUp ? "ti-chart-line" : "ti-trending-down"}"></i>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="pt-3.5 sm:pt-4 border-t border-[#1e293b]/60 flex items-center justify-between text-[10px] sm:text-[11px] text-tertiary font-mono">
          <span class="truncate">Cross-module slope: ${kaizen.slope || 0}</span>
          <span class="shrink-0">Forecast Engine Active</span>
        </div>
      </div>
    `;
  }
}
