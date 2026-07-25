import "@life-orchestrator/ui-theme/fontawesome/js/all.js";

import { GlobalLoaderService } from "@/services/loader.service";
import { HabitController } from "@/controllers/habit.controller.js";
import { NavigationController } from "@/controllers/navigation.controller.js";
import { SettingsController } from "@/controllers/settings.controller";
import { StateController } from "@/controllers/state.controller";
import { ThemeController } from "@/controllers/theme.controller.js";
import { TooltipController } from "@/controllers/tooltip.controller";
import { state } from "@/models/state.model";

const loader = document.querySelector("#app-loader");
const app = document.querySelector("#app");

app.classList.add("hidden");

document.addEventListener("DOMContentLoaded", () => {
  GlobalLoaderService.init();

  NavigationController.init();
  HabitController.init();
  SettingsController.init();

  StateController.execute();

  TooltipController.init();

  ThemeController.init();

  setTimeout(() => {
    loader.classList.add("opacity-0", "pointer-events-none");

    requestAnimationFrame(() => {
      setTimeout(() => {
        loader.remove();
        app.classList.remove("hidden");
        HabitController.updateTabStyles(state.activeTab);
      }, 120);
    });
  }, 0);
});
