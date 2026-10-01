/**
 * @file PrinciplesMatrixGrid.js
 * @description UI grid component rendering the 10 selected Japanese behavioral principles.
 */

import { PrincipleEvaluator } from "../engine/PrincipleEvaluator.js";

export class PrinciplesMatrixGrid {
  /**
   * @param {string} containerId - DOM Node ID
   */
  constructor(containerId) {
    this.container = document.getElementById(containerId);
  }

  /**
   * Renders the 10 selected principles grid.
   * @param {number} daysBack
   */
  render(daysBack = 30) {
    if (!this.container) return;

    const { principles } = PrincipleEvaluator.evaluateAll(daysBack);

    const items = [
      {
        name: "Kaizen",
        subtitle: "Cross-Module Growth",
        status: principles.kaizen.status,
        detail: `Avg slope across 5 modules: ${principles.kaizen.slope}`,
      },
      {
        name: "Torimazu",
        subtitle: "Action Over Paralysis",
        status: principles.torimazu.status,
        detail: `Start delay: ${principles.torimazu.avgDelayMinutes} min`,
      },
      {
        name: "Gyoji",
        subtitle: "Continuous Practice",
        status: principles.gyoji.status,
        detail: `Weekend/Weekday ratio: ${principles.gyoji.ratio}`,
      },
      {
        name: "Zanshin",
        subtitle: "Post-Focus Awareness",
        status: principles.zanshin.status,
        detail: `Reflection rate: ${principles.zanshin.reflectionRate}%`,
      },
      {
        name: "Fudōshin",
        subtitle: "Immovable Mind",
        status: principles.fudoshin.status,
        detail: `Interruptions: ${principles.fudoshin.interruptionsPerSession}/session`,
      },
      {
        name: "Datsuzoku",
        subtitle: "Escape From Routine",
        status: principles.datsuzoku.status,
        detail: `Work rhythm CV: ${principles.datsuzoku.cv}`,
      },
      {
        name: "Mottainai",
        subtitle: "Resource Respect",
        status: principles.mottainai.status,
        detail: `Waste: ${principles.mottainai.wasteRatio}% (S:${principles.mottainai.sessionWaste}% H:${principles.mottainai.habitWaste}% T:${principles.mottainai.taskWaste}%)`,
      },
      {
        name: "Poka Poka Time",
        subtitle: "Constructive Recovery",
        status: principles.pokaPokaTime.status,
        detail: `Avg break: ${principles.pokaPokaTime.avgBreakMinutes} min`,
      },
      {
        name: "Shin-Gi / Nemawashi",
        subtitle: "Preparation Before Execution",
        status: principles.shinGiNemawashi.status,
        detail: `Subtask breakdown: ${principles.shinGiNemawashi.breakdownRate}%`,
      },
      {
        name: "Ushitoku",
        subtitle: "Damage Control",
        status: principles.ushitoku.status,
        detail: `3-day focus avg: ${principles.ushitoku.avgRecentFocusMinutes} min/day`,
      },
    ];

    this.container.innerHTML = `
      <div class="card p-6 rounded-2xl bg-surface/60 backdrop-blur-xl border border-border mb-6">
        <h3 class="text-base font-extrabold text-primary mb-6 flex items-center gap-2">
          <i class="ti ti-layout-grid text-brand text-2xl"></i>
          Behavioral Telemetry Matrix
        </h3>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-3">
          ${items.map((item) => this._renderItemRow(item)).join("")}
        </div>
      </div>
    `;
  }

  /**
   * @param {Object} item
   * @returns {string}
   * @private
   */
  _renderItemRow(item) {
    const formattedStatus = this._formatStatusText(item.status);
    return `
      <div class="p-3.5 rounded-xl bg-surface-2/60 border border-border/80 flex items-center justify-between gap-3">
        <div class="min-w-0">
          <div class="text-sm font-bold text-primary truncate">${item.name}</div>
          <div class="text-xs text-secondary mt-0.5 truncate">${item.subtitle} · ${item.detail}</div>
        </div>
        <span class="text-xs font-bold px-2.5 py-1 rounded-lg shrink-0 ${this._getBadgeClass(item.status)}">
          ${formattedStatus}
        </span>
      </div>
    `;
  }

  /**
   * @private
   */
  _formatStatusText(status) {
    if (status.includes("INSUFFICIENT") || status.includes("NO_"))
      return "No Data";
    if (
      status.includes("OPTIMAL") ||
      status.includes("IMMOVABLE") ||
      status.includes("STEADY") ||
      status.includes("SAFE") ||
      status.includes("FULLY_PREPARED") ||
      status.includes("LINGERING") ||
      status.includes("CONTINUOUS") ||
      status.includes("IMMEDIATE") ||
      status.includes("RESOURCE_RESPECTED") ||
      status.includes("DYNAMIC")
    )
      return "Optimal";
    if (
      status.includes("BALANCED") ||
      status.includes("STABLE") ||
      status.includes("CALIBRATED")
    )
      return "Balanced";
    if (status.includes("MINDFULNESS_DEFICIT") || status.includes("SLUMP"))
      return "Needs Action";
    if (
      status.includes("VOLATILE") ||
      status.includes("HIGHLY_DISTRACTED") ||
      status.includes("UNPREPARED")
    )
      return "Attention";
    if (
      status.includes("ANALYSIS_PARALYSIS") ||
      status.includes("OVERWORK") ||
      status.includes("BURNOUT") ||
      status.includes("WASTE")
    )
      return "Critical";
    return "Normal";
  }

  /**
   * @param {string} status
   * @returns {string}
   * @private
   */
  _getBadgeClass(status) {
    if (status.includes("INSUFFICIENT") || status.includes("NO_")) {
      return "bg-sky-500/15 text-sky-400 border border-sky-500/30";
    }
    if (
      status.includes("OPTIMAL") ||
      status.includes("IMMOVABLE") ||
      status.includes("STEADY") ||
      status.includes("SAFE") ||
      status.includes("FULLY_PREPARED") ||
      status.includes("LINGERING") ||
      status.includes("CONTINUOUS") ||
      status.includes("IMMEDIATE") ||
      status.includes("RESOURCE_RESPECTED") ||
      status.includes("DYNAMIC")
    ) {
      return "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30";
    }
    if (
      status.includes("BALANCED") ||
      status.includes("STABLE") ||
      status.includes("CALIBRATED")
    ) {
      return "bg-amber-500/15 text-amber-400 border border-amber-500/30";
    }
    return "bg-red-500/15 text-red-400 border border-red-500/30";
  }
}
