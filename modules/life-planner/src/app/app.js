import "@life-orchestrator/ui-theme/fontawesome/js/all.js";
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
