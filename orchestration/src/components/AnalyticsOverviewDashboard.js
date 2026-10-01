/**
 * @file AnalyticsOverviewDashboard.js
 * @description Master orchestrator component that mounts all telemetry visualizers,
 * principle scorecards, trajectory analysis, and actionable insights.
 */

import { CoreInsightWidget } from "./CoreInsightWidget.js";
import { PrincipleScoreCard } from "./PrincipleScoreCard.js";
import { PrinciplesMatrixGrid } from "./PrinciplesMatrixGrid.js";
import { TrajectoryCard } from "./TrajectoryCard.js";

export class AnalyticsOverviewDashboard {
  /**
   * @param {string} containerId - DOM Node ID
   */
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.components = [];
  }

  /**
   * Mounts all child components into the container DOM node.
   * @param {number} daysBack
   */
  mount(daysBack = 30) {
    if (!this.container) return;

    this.container.innerHTML = `
      <div class="analytics-dashboard max-w-7xl mx-auto space-y-6 dir-ltr">
        <!-- Top Operational Health Matrix -->
        <div id="principle-score-card-node"></div>

        <!-- Trajectory Analysis -->
        <div id="trajectory-card-node"></div>

        <!-- Executive Tactical Directives & Alerts -->
        <div id="core-insight-widget-node"></div>

        <!-- Full Selected Principles Breakdown Grid -->
        <div id="principles-matrix-grid-node"></div>
      </div>
    `;

    const scoreCard = new PrincipleScoreCard("principle-score-card-node");
    const trajectoryCard = new TrajectoryCard("trajectory-card-node");
    const insightWidget = new CoreInsightWidget("core-insight-widget-node");
    const matrixGrid = new PrinciplesMatrixGrid("principles-matrix-grid-node");

    scoreCard.render(daysBack);
    trajectoryCard.render(daysBack);
    insightWidget.render(daysBack);
    matrixGrid.render(daysBack);

    this.components = [scoreCard, trajectoryCard, insightWidget, matrixGrid];
  }
}
