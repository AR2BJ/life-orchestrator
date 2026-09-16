import {
  renderAnalyticsCharts,
  updateHeatmapChart,
  updateTabStyles,
} from "@/views/analytics/analytics.renderer.js";

import { DashboardComponent } from "@/components/features/analytics/dashboard.component";
import { StateManager } from "@/models/state.model.js";

export const AnalyticsController = {
  init() {
    DashboardComponent.initTabSwitcher();
    this.bindStaticEvents();
  },

  bindStaticEvents() {
    document.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-view]");
      if (!btn) return;

      const viewType = btn.dataset.view;
      if (viewType) {
        this.handleTabSwitch(viewType);
      }
    });
  },

  handleTabSwitch(tab) {
    const currentView = StateManager.getHeatmapView();
    if (tab === currentView) return;

    StateManager.setHeatmapView(tab);

    updateTabStyles(tab);

    const plans = StateManager.getPlans ? StateManager.getPlans() : [];
    const logs = StateManager.getLogs ? StateManager.getLogs() : [];

    updateHeatmapChart(plans, logs, tab);
  },

  dispatchRender() {
    const plans = StateManager.getPlans ? StateManager.getPlans() : [];
    const logs = StateManager.getLogs ? StateManager.getLogs() : [];
    const templates = StateManager.getTemplates
      ? StateManager.getTemplates()
      : [];
    const currentView = StateManager.getHeatmapView();

    renderAnalyticsCharts(plans, logs, templates, currentView);
  },
};
