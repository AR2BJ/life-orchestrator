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
      <div class="p-4 rounded-xl border mb-3 flex items-start gap-3 ${this._getAlertStyle(item.severity)}">
        <i class="ti ${this._getAlertIcon(item.severity)} text-2xl mt-0.5 shrink-0"></i>
        <div class="w-full">
          <div class="flex items-center justify-between mb-1">
            <h5 class="text-sm font-bold">${item.title}</h5>
            <span class="text-xs uppercase font-bold px-2.5 py-0.5 rounded bg-black/20">${item.severity}</span>
          </div>
          <p class="text-xs leading-relaxed opacity-90 mt-1">${item.message}</p>
        </div>
      </div>
    `,
      )
      .join("");

    const recommendationsHTML = recommendations
      .map(
        (rec) => `
      <div class="p-3.5 rounded-xl bg-surface-2/80 border border-border/80 text-xs text-secondary flex items-start gap-2.5 mb-2.5">
        <i class="ti ti-arrow-right text-brand text-base mt-0.5 shrink-0"></i>
        <div class="leading-relaxed">
          <strong class="text-primary font-bold">[${rec.targetModule.toUpperCase()}] ${rec.action}:</strong> ${rec.description}
        </div>
      </div>
    `,
      )
      .join("");

    this.container.innerHTML = `
      <div class="card p-6 rounded-2xl bg-surface/60 backdrop-blur-xl border border-border mb-6">
        <h3 class="text-base font-extrabold text-primary mb-5 flex items-center gap-2">
          <i class="ti ti-bulb text-amber-400 text-2xl"></i>
          Executive Tactical Directives & Alerts
        </h3>

        <!-- System Alerts -->
        <div class="space-y-2 mb-6">
          <h4 class="text-xs font-bold text-secondary uppercase tracking-wider mb-3">Critical System Alerts</h4>
          ${
            alertsHTML.length > 0
              ? alertsHTML
              : '<p class="text-xs text-emerald-400 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center">No operational issues detected. All systems running smoothly.</p>'
          }
        </div>

        <!-- Recommendations -->
        <div class="space-y-2">
          <h4 class="text-xs font-bold text-secondary uppercase tracking-wider mb-3">Actionable Directives</h4>
          ${
            recommendationsHTML.length > 0
              ? recommendationsHTML
              : '<p class="text-xs text-secondary text-center py-3">All module operations are well-calibrated.</p>'
          }
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
        return "bg-red-500/10 text-red-400 border-red-500/30";
      case "HIGH":
        return "bg-amber-500/10 text-amber-400 border-amber-500/30";
      default:
        return "bg-sky-500/10 text-sky-400 border-sky-500/30";
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
