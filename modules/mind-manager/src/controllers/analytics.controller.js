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
    const currentView = StateManager.getActiveTab();
    if (tab === currentView) return;

    StateManager.setHeatmapView(tab);

    updateTabStyles(tab);

    const tags = StateManager.getTags() || [];
    const notes = StateManager.getNotes() || [];
    const snippets = StateManager.getSnippets() || [];
    const bookmarks = StateManager.getBookmarks() || [];
    const cheatsheets = StateManager.getCheatSheets() || [];

    updateHeatmapChart(tags, notes, snippets, bookmarks, cheatsheets, tab);
  },

  dispatchRender() {
    const tags = StateManager.getTags() || [];
    const notes = StateManager.getNotes() || [];
    const snippets = StateManager.getSnippets() || [];
    const bookmarks = StateManager.getBookmarks() || [];
    const cheatsheets = StateManager.getCheatSheets() || [];
    const currentView = StateManager.getHeatmapView();

    renderAnalyticsCharts(
      tags,
      notes,
      snippets,
      bookmarks,
      cheatsheets,
      currentView,
    );
  },
};
