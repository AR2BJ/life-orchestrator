/**
 * @file AnalyticsOverviewDashboard.js
 * @description Master orchestrator component that mounts all telemetry visualizers with perfect grid alignment.
 */

import { CoreInsightWidget } from "./CoreInsightWidget.js";
import { PrincipleScoreCard } from "./PrincipleScoreCard.js";
import { PrinciplesMatrixGrid } from "./PrinciplesMatrixGrid.js";
import { TrajectoryCard } from "./TrajectoryCard.js";

export class AnalyticsOverviewDashboard {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.components = [];
  }

  mount(daysBack = 30) {
    if (!this.container) return;

    this.container.innerHTML = `
      <div class="analytics-dashboard w-full space-y-4 sm:space-y-6">
        <!-- Top Operational Health Matrix -->
        <div id="principle-score-card-node" class="w-full"></div>

        <!-- Middle Bento Section: Trajectory + Directives -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 items-stretch w-full">
          <div id="trajectory-card-node" class="lg:col-span-5 h-full"></div>
          <div id="core-insight-widget-node" class="lg:col-span-7 h-full"></div>
        </div>

        <!-- Behavioral Matrix Grid -->
        <div id="principles-matrix-grid-node" class="w-full"></div>
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
