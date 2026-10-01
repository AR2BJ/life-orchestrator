/**
 * @file orchestration/src/index.js
 * @description Main entry point for the Life Orchestration Module.
 * Initializes the analytics dashboard, instantiates strategic evaluation components,
 * and binds to global state mutation events for reactive UI rendering.
 */

import { AnalyticsOverviewDashboard } from "./components/AnalyticsOverviewDashboard.js";
import { globalEventBus } from "../../packages/event-bus/src/index.js";

export class OrchestrationModule {
  /**
   * @param {Object} config
   */
  constructor(config = {}) {
    this.mountPoint = config.mountPoint || "app";
    this.daysBack = config.daysBack || 30;
    this.dashboard = null;
  }

  /**
   * Initializes module shell and attaches global event listeners.
   */
  init() {
    const root = document.getElementById(this.mountPoint);
    if (!root) return;

    // Render Module Layout Shell
    root.innerHTML = `
      <div class="container-fluid p-6 max-w-8xl mx-auto space-y-6">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h2 class="text-2xl font-black text-primary tracking-tight mb-1">
              Life Orchestration Engine
            </h2>
            <p class="text-xs text-secondary">
              Centralized behavioral telemetry, predictive trajectory projections, and strategic focus-principle evaluation.
            </p>
          </div>
          <div class="flex items-center gap-2">
            <span class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <span class="relative flex size-2">
                <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                <span class="relative inline-flex size-2 rounded-full bg-emerald-500"></span>
              </span>
              Live Telemetry Active
            </span>
          </div>
        </div>

        <div id="orchestration-dashboard-mount"></div>
      </div>
    `;

    // Initialize full dashboard orchestrator
    this.dashboard = new AnalyticsOverviewDashboard(
      "orchestration-dashboard-mount",
    );
    this.renderAll();

    // Event-driven reactive UI updates on Store mutations
    globalEventBus.on("STORE_UPDATED", () => {
      this.renderAll();
    });
  }

  /**
   * Triggers re-render across mounted dashboard components.
   */
  renderAll() {
    if (this.dashboard) {
      this.dashboard.mount(this.daysBack);
    }
  }

  /**
   * Dynamically adjusts time-series evaluation window.
   * @param {number} daysBack
   */
  setAnalysisWindow(daysBack) {
    this.daysBack = daysBack;
    this.renderAll();
  }
}
