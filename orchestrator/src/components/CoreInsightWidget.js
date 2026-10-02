/**
 * @file CoreInsightWidget.js
 * @description Executive guidance UI widget rendering system alerts,
 * operational strengths, and actionable tactical recommendations.
 */

import { InsightGenerator } from "../engine/InsightGenerator.js";

export class CoreInsightWidget {
  /**
   * @param {string} containerId - DOM Node ID
   */
  constructor(containerId) {
    this.container = document.getElementById(containerId);
  }

  /**
   * Renders executive insights and actionable alerts.
   * @param {number} daysBack
   */
  render(daysBack = 30) {
    if (!this.container) return;

    const report = InsightGenerator.generateExecutiveReport(daysBack);
    const { alerts, recommendations } = report;

    const alertsHTML = alerts
      .map(
        (item) => `
      <div class="p-3.5 sm:p-4 rounded-xl border flex items-start gap-3 transition-colors ${this._getAlertStyle(item.severity)}">
        <i class="ti ${this._getAlertIcon(item.severity)} text-lg sm:text-xl mt-0.5 shrink-0"></i>
        <div class="w-full min-w-0">
          <div class="flex items-center justify-between gap-2 mb-1">
            <h5 class="text-xs font-bold uppercase tracking-wider truncate">${item.title}</h5>
            <span class="text-[9px] sm:text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-black/30 border border-white/10 uppercase tracking-widest shrink-0">${item.severity}</span>
          </div>
          <p class="text-xs leading-relaxed opacity-90 wrap-break-word">${item.message}</p>
        </div>
      </div>
    `,
      )
      .join("");

    const recommendationsHTML = recommendations
      .map(
        (rec) => `
      <div class="p-3 sm:p-3.5 rounded-xl bg-[#162036]/80 border border-[#1e293b] text-xs text-[#94a3b8] flex items-start gap-3">
        <i class="ti ti-arrow-right text-brand text-base mt-0.5 shrink-0"></i>
        <div class="leading-relaxed min-w-0 wrap-break-word">
          <strong class="text-white font-bold">[${rec.targetModule.toUpperCase()}] ${rec.action}:</strong> ${rec.description}
        </div>
      </div>
    `,
      )
      .join("");

    this.container.innerHTML = `
      <div class="p-4 sm:p-6 rounded-2xl bg-[#0f172a]/80 backdrop-blur-xl border border-[#1e293b] space-y-5 sm:space-y-6 h-full flex flex-col justify-between">
        <div class="space-y-5">
          <!-- Header -->
          <div class="flex items-center gap-3">
            <div class="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#162036] border border-[#1e293b] flex items-center justify-center text-[#f59e0b] shrink-0">
              <i class="ti ti-bulb text-lg sm:text-xl"></i>
            </div>
            <div class="min-w-0">
              <h3 class="text-sm sm:text-base font-black text-white tracking-tight truncate">Executive Tactical Directives & Alerts</h3>
              <p class="text-xs text-[#94a3b8] truncate">Automated operational diagnostics and system alerts</p>
            </div>
          </div>

          <!-- System Alerts -->
          <div class="space-y-2.5">
            <h4 class="text-[10px] sm:text-[11px] font-mono font-bold text-tertiary uppercase tracking-wider">Critical System Alerts</h4>
            <div class="space-y-2">
              ${
                alertsHTML.length > 0
                  ? alertsHTML
                  : '<p class="text-xs text-[#10b981] p-3.5 rounded-xl bg-[#10b981]/10 border border-[#10b981]/20 text-center font-medium">No operational issues detected. All systems running smoothly.</p>'
              }
            </div>
          </div>

          <!-- Recommendations -->
          <div class="space-y-2.5">
            <h4 class="text-[10px] sm:text-[11px] font-mono font-bold text-tertiary uppercase tracking-wider">Actionable Directives</h4>
            <div class="space-y-2">
              ${
                recommendationsHTML.length > 0
                  ? recommendationsHTML
                  : '<p class="text-xs text-[#94a3b8] text-center py-3 bg-[#162036]/40 rounded-xl border border-[#1e293b]">All module operations are well-calibrated.</p>'
              }
            </div>
          </div>
        </div>
      </div>
    `;
  }

  /**
   * @param {string} severity
   * @returns {string}
   * @private
   */
  _getAlertStyle(severity) {
    switch (severity) {
      case "CRITICAL":
        return "bg-[#ef4444]/10 text-[#ef4444] border-[#ef4444]/30";
      case "HIGH":
        return "bg-[#f59e0b]/10 text-[#f59e0b] border-[#f59e0b]/30";
      default:
        return "bg-[#627492]/10 text-[#94a3b8] border-[#627492]/30";
    }
  }

  /**
   * @param {string} severity
   * @returns {string}
   * @private
   */
  _getAlertIcon(severity) {
    switch (severity) {
      case "CRITICAL":
        return "ti-alert-octagon";
      case "HIGH":
        return "ti-alert-triangle";
      default:
        return "ti-info-circle";
    }
  }
}
