import { StateManager, state } from "@/models/state.model.js";

import { AnalyticsController } from "./analytics.controller.js";
import { GlobalLoaderService } from "@/services/loader.service.js";
import { HabitController } from "./habit.controller.js";

export class NavigationController {
  static categoryKeyBuffer = "";
  static categoryKeyTimeoutId = null;
  static CATEGORY_KEY_TIMEOUT = 200;

  static init() {
    this.setupNavigationListeners();
    this.setupKeyboardShortcuts();
    this.setDefaultActive();
  }

  static setupNavigationListeners() {
    document.getElementById("nav-habits")?.addEventListener("click", () => {
      this.setActiveTab("habits");
      HabitController.updateTabStyles(state.activeTab);
    });
    document.getElementById("nav-analytics")?.addEventListener("click", () => {
      this.setActiveTab("analytics");
    });
    document.getElementById("nav-settings")?.addEventListener("click", () => {
      this.setActiveTab("settings");
    });

    document.getElementById("mobile-habits")?.addEventListener("click", () => {
      this.setActiveTab("habits");
      HabitController.updateTabStyles(state.activeTab);
    });
    document
      .getElementById("mobile-analytics")
      ?.addEventListener("click", () => {
        this.setActiveTab("analytics");
      });
    document
      .getElementById("mobile-settings")
      ?.addEventListener("click", () => {
        this.setActiveTab("settings");
      });
  }

  static setupKeyboardShortcuts() {
    window.addEventListener("keydown", (event) => {
      const activeEl = document.activeElement;
      if (
        activeEl &&
        (activeEl.tagName === "INPUT" ||
          activeEl.tagName === "TEXTAREA" ||
          activeEl.isContentEditable)
      ) {
        if (event.key === "Escape") {
          activeEl.blur();
          this.closeAllActiveModals();
        }
        return;
      }

      const key = event.key.toLowerCase();

      if (event.key === "Escape") {
        event.preventDefault();
        this.closeAllActiveModals();
        return;
      }

      const dispatchAsyncClick = (elementId) => {
        event.preventDefault();
        setTimeout(() => {
          document.getElementById(elementId)?.click();
        }, 10);
      };

      if (event.altKey) {
        if (key === "b") {
          dispatchAsyncClick("scroll-to-top-btn");
          return;
        }
        if (key === "c") {
          dispatchAsyncClick("btn-toggle-habit-form");
          return;
        }
        if (key === "t") {
          dispatchAsyncClick("theme-toggle");
          return;
        }
        if (key === "n") {
          dispatchAsyncClick("menu-toggle");
          return;
        }
        if (key === "r") {
          event.preventDefault();

          GlobalLoaderService.show("Redirecting to purge terminal...");

          setTimeout(() => {
            try {
              this.setActiveTab("settings");
              const resetBtn =
                document.getElementById("trigger-reset-btn") ||
                document.querySelector('[id*="reset"]');

              setTimeout(() => resetBtn.click(), 10);
            } finally {
              GlobalLoaderService.hide();
            }
          }, 50);
          return;
        }
        if (key === "a") {
          dispatchAsyncClick("tab-active");
          return;
        }
        if (key === "x") {
          dispatchAsyncClick("tab-archived");
          return;
        }
        if (["1", "2", "3"].includes(event.key)) {
          const currentSection = document.querySelector("section:not(.hidden)");
          if (currentSection && currentSection.id === "analytics-view") {
            const chartViewButtons = Array.from(
              document.querySelectorAll(
                "#heatmap-mobile-menu button, #chart-view-switcher button, button[data-view]",
              ),
            ).filter((btn) => {
              const style = window.getComputedStyle(btn);
              return (
                !btn.disabled &&
                style.display !== "none" &&
                style.visibility !== "hidden"
              );
            });

            const index = parseInt(event.key, 10) - 1;
            const targetButton = chartViewButtons[index];

            if (targetButton) {
              event.preventDefault();
              setTimeout(() => targetButton.click(), 10);
            }
          }
        }
      }

      if (event.shiftKey) {
        if (["h", "a", "s"].includes(key)) {
          event.preventDefault();

          const viewNames = {
            h: "Habits Dashboard",
            a: "Analytical Metrics",
            s: "System Settings",
          };
          const targetTab =
            key === "h" ? "habits" : key === "a" ? "analytics" : "settings";

          GlobalLoaderService.show(`Navigating to ${viewNames[key]}...`);

          setTimeout(() => {
            try {
              this.setActiveTab(targetTab);
            } finally {
              GlobalLoaderService.hide();
            }
          }, 40);
          return;
        }
      }

      if (key === "/") {
        const searchInput =
          document.getElementById("search-habits") ||
          document.querySelector('input[type="search"]');
        if (searchInput) {
          event.preventDefault();
          searchInput.focus();
          searchInput.select();
        }
        return;
      }

      if (event.key === "?") {
        dispatchAsyncClick("help-toggle");
        return;
      }

      if (
        ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"].includes(event.key)
      ) {
        const currentSection = document.querySelector("section:not(.hidden)");
        if (currentSection && currentSection.id === "habits-view") {
          event.preventDefault();
          this.queueCategoryShortcutKey(event.key);
        }
      }
    });
  }

  static queueCategoryShortcutKey(digit) {
    if (this.categoryKeyTimeoutId) {
      clearTimeout(this.categoryKeyTimeoutId);
    }

    if (this.categoryKeyBuffer.length >= 2) {
      this.categoryKeyBuffer = digit;
    } else {
      this.categoryKeyBuffer += digit;
    }

    this.categoryKeyTimeoutId = setTimeout(() => {
      this.processCategoryShortcutKey();
    }, this.CATEGORY_KEY_TIMEOUT);
  }

  static processCategoryShortcutKey() {
    const index = parseInt(this.categoryKeyBuffer, 10);
    this.categoryKeyBuffer = "";
    this.categoryKeyTimeoutId = null;

    const categoryButtons = Array.from(
      document.querySelectorAll(
        "#category-filters button, .category-filter-btn",
      ),
    ).filter((btn) => {
      const style = window.getComputedStyle(btn);
      return (
        !btn.disabled &&
        style.display !== "none" &&
        style.visibility !== "hidden"
      );
    });

    const targetButton = categoryButtons[index];
    if (targetButton) {
      setTimeout(() => targetButton.click(), 10);
    }
  }

  static closeAllActiveModals() {
    const modalIds = [
      "help-modal",
      "habit-modal",
      "delete-modal",
      "reset-modal",
      "edit-modal",
    ];
    modalIds.forEach((id) => {
      const modal = document.getElementById(id);
      if (modal && !modal.classList.contains("hidden")) {
        modal.querySelector('[id*="close"], [id*="btn-close"]')?.click() ||
          modal.classList.add("hidden");
      }
    });
  }

  static setActiveTab(tabType) {
    document.querySelectorAll(".nav-item").forEach((btn) => {
      btn.classList.remove("active");
    });
    document.getElementById(`nav-${tabType}`)?.classList.add("active");

    document.querySelectorAll(".mobile-nav-btn").forEach((btn) => {
      btn.classList.remove("active");
    });
    document.getElementById(`mobile-${tabType}`)?.classList.add("active");

    HabitController.handleViewSwitch(tabType);
    this.showSection(tabType);

    if (tabType === "analytics") {
      AnalyticsController.dispatchRender(StateManager.getHabits());
    }
  }

  static showSection(sectionType) {
    document.querySelectorAll('section[id$="-view"]').forEach((section) => {
      section.classList.add("hidden");
    });
    document.getElementById(`${sectionType}-view`)?.classList.remove("hidden");
  }

  static setDefaultActive() {
    this.setActiveTab("habits");
  }
}
