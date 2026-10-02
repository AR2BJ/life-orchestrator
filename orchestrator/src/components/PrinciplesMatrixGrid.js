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
      <div class="p-4 sm:p-6 rounded-2xl bg-[#0f172a]/80 backdrop-blur-xl border border-[#1e293b] space-y-4 sm:space-y-6">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#162036] border border-[#1e293b] flex items-center justify-center text-brand shrink-0">
              <i class="ti ti-layout-grid text-lg sm:text-xl"></i>
            </div>
            <div>
              <h3 class="text-sm sm:text-base font-black text-white tracking-tight">Behavioral Telemetry Matrix</h3>
              <p class="text-xs text-[#94a3b8]">Evaluation of behavioral principles</p>
            </div>
          </div>
          <span class="text-[10px] font-mono text-tertiary shrink-0">10 PARAMETERS</span>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
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
      <div class="p-3 sm:p-3.5 rounded-xl bg-[#162036]/60 border border-[#1e293b] flex items-center justify-between gap-3 hover:border-brand/50 transition-colors">
        <div class="min-w-0">
          <div class="text-xs sm:text-sm font-extrabold text-white truncate">${item.name}</div>
          <div class="text-xs text-[#94a3b8] mt-0.5 truncate">${item.subtitle} · <span class="font-mono text-[10px] sm:text-[11px] text-tertiary">${item.detail}</span></div>
        </div>
        <span class="text-[9px] sm:text-[10px] font-mono font-bold px-2 py-1 rounded-lg shrink-0 ${this._getBadgeClass(item.status)}">
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
      return "bg-[#627492]/20 text-[#94a3b8] border border-[#627492]/30";
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
      return "bg-[#10b981]/15 text-[#10b981] border border-[#10b981]/30";
    }
    if (
      status.includes("BALANCED") ||
      status.includes("STABLE") ||
      status.includes("CALIBRATED")
    ) {
      return "bg-[#f59e0b]/15 text-[#f59e0b] border border-[#f59e0b]/30";
    }
    return "bg-[#ef4444]/15 text-[#ef4444] border border-[#ef4444]/30";
  }
}
