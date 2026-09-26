import "@life-orchestrator/ui-theme/tabler/css/tabler-icons.min.css";
import "@life-orchestrator/ui-theme/assets/css/font.css";

import { GlobalLoaderService } from "@/services/loader.service";
import { MindController } from "@/controllers/mind.controller.js";
import { NavigationController } from "@/controllers/navigation.controller.js";
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
    MindController.init();
    SettingsController.init();

    TooltipController.init();

    ThemeController.init();

    requestAnimationFrame(() => {
      setTimeout(() => {
        loader.remove();
        app.classList.remove("hidden");
        MindController.updateTabStyles(state.activeTab);
      }, 120);
    });
  }, 0);
});
