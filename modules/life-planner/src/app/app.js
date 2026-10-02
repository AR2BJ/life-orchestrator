import "@life-orchestrator/ui-theme/tabler/css/tabler-icons.min.css";
import "@life-orchestrator/ui-theme/assets/css/font.css";

import { CalendarController } from "@/controllers/calendar.controller";
import { GlobalLoaderService } from "@/services/loader.service";
import { NavigationController } from "@/controllers/navigation.controller.js";
import { PlannerController } from "@/controllers/planner.controller.js";
import { SettingsController } from "@/controllers/settings.controller";
import { ThemeController } from "@/controllers/theme.controller.js";
import { TooltipController } from "@/controllers/tooltip.controller";
import { state } from "@/models/state.model";

const loader = document.querySelector("#app-loader");
const app = document.querySelector("#app");

app.classList.add("hidden");

document.addEventListener("DOMContentLoaded", () => {
  const panel = document.getElementById("edge-panel");
  const toggleBtn = document.getElementById("edge-panel-toggle");
  const closeBtn = document.getElementById("edge-panel-close");

  if (!panel || !toggleBtn) return;

  // Toggle state on click/tap (for Mobile devices)
  toggleBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    const isExpanded = panel.getAttribute("data-expanded") === "true";
    panel.setAttribute("data-expanded", (!isExpanded).toString());
  });

  // Explicit close button
  if (closeBtn) {
    closeBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      panel.setAttribute("data-expanded", "false");
    });
  }

  // Close when clicking outside panel
  document.addEventListener("click", (e) => {
    if (!panel.contains(e.target)) {
      panel.setAttribute("data-expanded", "false");
    }
  });

  setTimeout(() => {
    loader.classList.add("opacity-0", "pointer-events-none");

    GlobalLoaderService.init();

    NavigationController.init();
    PlannerController.init();
    CalendarController.init();
    SettingsController.init();

    TooltipController.init();

    ThemeController.init();

    requestAnimationFrame(() => {
      setTimeout(() => {
        loader.remove();
        app.classList.remove("hidden");
        PlannerController.updateTabStyles(state.activeTab);
      }, 120);
    });
  }, 0);
});
