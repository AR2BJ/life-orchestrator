import { StateManager, state } from "@/models/state.model.js";

import { AnalyticsController } from "./analytics.controller.js";
import { AnalyticsView } from "@/views/analytics-view.js";
import { DeleteModalsComponent } from "@/components/modals/delete-modals.component.js";
import { DesktopNavComponent } from "@/components/layout/desktop-nav.component.js";
import { EditModalsComponent } from "@/components/modals/edit-modals.component.js";
import { GlobalLoaderService } from "@/services/loader.service.js";
import { HabitActionController } from "./habits/habit-action.controller";
import { HabitFormController } from "./habits/habit-form.controller";
import { HabitsView } from "@/views/habits-view.js";
import { HeaderComponent } from "@/components/shared/header.component.js";
import { InfoModalComponent } from "@/components/modals/info-modal.component.js";
import { MobileNavComponent } from "@/components/layout/mobile-nav.component.js";
import { SettingsController } from "./settings.controller.js";
import { SettingsViewComponent } from "@/components/features/settings/settings-view.component.js";
import { renderHabitList } from "@/views/habits/habit-list.renderer.js";

export const HabitController = {
  init() {
    StateManager.init();
    this.renderComponent();
    this.refreshUI();

    HabitFormController.init(this);
    HabitActionController.init(this);

    SettingsController.runAutoArchivePipeline();

    this.bindStaticEvents();
    this.bindMenuToggle();
    this.bindActionMenuToggle();
    this.setupTabIndicatorObserver();

    requestAnimationFrame(() => {
      this.updateTabStyles(state.activeTab);
    });
  },

  renderComponent() {
    const renderMap = {
      "header-container": HeaderComponent.render,
      "desktop-nav-container": DesktopNavComponent.render,
      "mobile-nav-container": MobileNavComponent.render,
      "habits-view-container": HabitsView.render,
      "analytics-view-container": AnalyticsView.render,
      "settings-view-container": SettingsViewComponent.render,
      "help-modal-container": InfoModalComponent.render,
      "edit-modals-container": EditModalsComponent.render,
      "delete-modals-container": DeleteModalsComponent.render,
    };

    Object.entries(renderMap).forEach(([id, renderFn]) => {
      const container = document.getElementById(id);
      if (container) container.innerHTML = renderFn();
    });
  },

  refreshUI() {
    const allHabits = StateManager.getHabits();
    const filteredHabits = StateManager.getFilteredHabits();

    renderHabitList(filteredHabits, state.activeTab);
    AnalyticsController.dispatchRender(allHabits);
    this.updateNavigationDOM();
  },

  bindMenuToggle() {
    const menuToggle = document.getElementById("menu-toggle");
    const desktopNav = document.getElementById("desktop-nav");
    const app = document.getElementById("app");

    let isMenuOpen = false;

    menuToggle?.addEventListener("click", () => {
      isMenuOpen = !isMenuOpen;
      if (isMenuOpen) {
        desktopNav?.classList.replace(
          "-translate-x-[calc(100%+2rem)]",
          "translate-x-0",
        );
        app?.classList.replace("lg:ps-8", "lg:ps-30");
      } else {
        desktopNav?.classList.replace(
          "translate-x-0",
          "-translate-x-[calc(100%+2rem)]",
        );
        app?.classList.replace("lg:ps-30", "lg:ps-8");
      }
    });
  },

  bindActionMenuToggle() {
    document.addEventListener("click", (e) => {
      const toggleBtn = e.target.closest(".dropdown-toggle-btn");

      if (toggleBtn) {
        e.stopPropagation();
        const container = toggleBtn.closest(".dropdown-container");
        const menu = container?.querySelector(".dropdown-menu");

        document.querySelectorAll(".dropdown-menu").forEach((m) => {
          if (m !== menu) m.classList.add("hidden");
        });

        menu?.classList.toggle("hidden");
        return;
      }

      if (!e.target.closest(".dropdown-container")) {
        document
          .querySelectorAll(".dropdown-menu")
          .forEach((m) => m.classList.add("hidden"));
      }
    });
  },

  bindStaticEvents() {
    const filterButtons = document.querySelectorAll(".category-filter-btn");

    const setFilterButtonState = (button, isActive) => {
      const icon = button.querySelector(".category-icon");
      const svg =
        icon?.tagName?.toLowerCase() === "svg"
          ? icon
          : icon?.querySelector("svg");

      button.classList.toggle("bg-brand/80", isActive);
      button.classList.toggle("text-white", isActive);
      button.classList.toggle("shadow-brand/10", isActive);
      button.classList.toggle("shadow-sm", isActive);
      button.classList.toggle("border-brand/80", isActive);
      button.classList.toggle("bg-surface", !isActive);
      button.classList.toggle("border-border", !isActive);
      button.classList.toggle("text-secondary", !isActive);
      button.classList.toggle("hover:text-primary", !isActive);
      button.classList.toggle("hover:bg-surface-2", !isActive);

      if (icon) {
        icon.style.color = isActive ? "#fff" : "";
      }

      if (svg) {
        svg.style.fill = isActive ? "currentColor" : "";
        svg.style.stroke = isActive ? "currentColor" : "";
      }

      svg?.querySelectorAll("path, circle, rect, polygon").forEach((shape) => {
        shape.style.fill = isActive ? "currentColor" : "";
        shape.style.stroke = isActive ? "currentColor" : "";
      });
    };

    const initialCategory = "all";

    filterButtons.forEach((btn) => {
      const isActive = btn.dataset.category === initialCategory;
      setFilterButtonState(btn, isActive);

      btn.addEventListener("click", (e) => {
        const currentBtn = e.currentTarget;
        const selectedCategory = currentBtn.dataset.category;

        if (currentBtn.classList.contains("bg-brand/80")) return;

        const categoryNames = {
          all: "All Habits",
          general: "General & Miscellaneous",
          health: "Health & Bio-Maintenance",
          work: "Work & Production Dev",
          research: "Research & Deep Dive",
          academics: "Academics & Advanced Knowledge",
          openSource: "Open Source & Side Projects",
          systemDesign: "System Design & Soft Skills",
          digitalDetox: "Digital Detox & Reset",
          routine: "Daily Routines & Workflow",
          harmful: "Harmful Habits",
        };
        GlobalLoaderService.show(
          `Filtering workspace by ${categoryNames[selectedCategory] || selectedCategory}...`,
        );

        setTimeout(() => {
          try {
            StateManager.setCategory(selectedCategory);

            filterButtons.forEach((button) =>
              setFilterButtonState(button, false),
            );
            setFilterButtonState(currentBtn, true);

            this.refreshUI();
          } finally {
            GlobalLoaderService.hide();
          }
        }, 30);
      });
    });

    const toggleFormBtn = document.getElementById("btn-toggle-habit-form");
    const formContainer = document.getElementById("habit-form-container");
    const formChevron = document.getElementById("form-chevron");

    if (toggleFormBtn && formContainer && formChevron) {
      toggleFormBtn.addEventListener("click", () => {
        const isHidden = formContainer.classList.contains("hidden");
        if (isHidden) {
          formContainer.classList.replace("hidden", "flex");
          formChevron.classList.add("rotate-180");
        } else {
          formContainer.classList.replace("flex", "hidden");
          formChevron.classList.remove("rotate-180");
        }
      });
    }

    const searchInput = document.getElementById("search-habits");
    const clearBtn = document.getElementById("clear-search-btn");
    const searchContainer = searchInput?.closest(".group\\/search");

    if (searchInput) {
      searchInput.value = state.searchQuery || "";

      const evaluateSearchState = () => {
        const hasValue = searchInput.value.trim().length > 0;
        const isHovered = searchContainer?.matches(":hover");

        if (hasValue && isHovered) {
          if (clearBtn) {
            clearBtn.classList.replace("hidden", "flex");
            requestAnimationFrame(() => {
              clearBtn.classList.remove("opacity-0", "scale-75");
              clearBtn.classList.add("opacity-100", "scale-100");
            });
          }
        } else if (clearBtn) {
          clearBtn.classList.remove("opacity-100", "scale-100");
          clearBtn.classList.add("opacity-0", "scale-75");

          setTimeout(() => {
            if (
              !searchInput.value.trim().length ||
              !searchContainer?.matches(":hover")
            ) {
              clearBtn.classList.replace("flex", "hidden");
            }
          }, 200);
        }
      };

      searchInput.addEventListener("input", (e) => {
        GlobalLoaderService.show("Loading, please wait...");

        setTimeout(() => {
          try {
            state.searchQuery = e.target.value;
            this.refreshUI();
            evaluateSearchState();
          } finally {
            GlobalLoaderService.hide();
          }
        }, 10);
      });

      searchContainer?.addEventListener("mouseenter", evaluateSearchState);
      searchContainer?.addEventListener("mouseleave", evaluateSearchState);

      clearBtn?.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();

        GlobalLoaderService.show("Loading, please wait...");

        setTimeout(() => {
          try {
            searchInput.value = "";
            state.searchQuery = "";

            setTimeout(() => searchInput.focus(), 10);

            this.refreshUI();
            evaluateSearchState();
          } finally {
            GlobalLoaderService.hide();
          }
        }, 10);
      });
    }

    const activeBtn = document.getElementById("tab-active");
    const archivedBtn = document.getElementById("tab-archived");

    activeBtn?.addEventListener("click", () => {
      if (state.activeTab === "active") return;

      GlobalLoaderService.show("Switching workspace to Active Habits...");

      setTimeout(() => {
        try {
          state.activeTab = "active";
          this.updateTabStyles("active");
          this.refreshUI();
        } finally {
          GlobalLoaderService.hide();
        }
      }, 30);
    });

    archivedBtn?.addEventListener("click", () => {
      if (state.activeTab === "archived") return;

      GlobalLoaderService.show("Loading Archived Habits ledger...");

      setTimeout(() => {
        try {
          state.activeTab = "archived";
          this.updateTabStyles("archived");
          this.refreshUI();
        } finally {
          GlobalLoaderService.hide();
        }
      }, 30);
    });

    const navButtons = ["habits", "analytics", "settings"];
    navButtons.forEach((v) => {
      const desktopBtn = document.getElementById(`nav-${v}`);
      const mobileBtn = document.getElementById(`mobile-${v}`);

      const handleNav = () => {
        if (state.currentView === v) return;

        const viewNames = {
          habits: "Workspace Overview",
          analytics: "Data Analytics Engine",
          settings: "System Configuration",
        };
        GlobalLoaderService.show(`Navigating to ${viewNames[v] || v}...`);

        setTimeout(() => {
          try {
            state.currentView = v;

            navButtons.forEach((nav) => {
              const dEl = document.getElementById(`nav-${nav}`);
              const mEl = document.getElementById(`mobile-${nav}`);
              dEl?.classList.replace("text-brand/80", "text-secondary");
              mEl?.classList.replace("text-brand/80", "text-secondary");
            });

            desktopBtn?.classList.replace("text-secondary", "text-brand/80");
            mobileBtn?.classList.replace("text-secondary", "text-brand/80");

            this.refreshUI();
          } finally {
            GlobalLoaderService.hide();
          }
        }, 30);
      };

      desktopBtn?.addEventListener("click", handleNav);
      mobileBtn?.addEventListener("click", handleNav);
    });

    const helpToggle = document.getElementById("help-toggle");
    const helpModal = document.getElementById("help-modal");
    const closeHelpModal = document.getElementById("close-help-modal");
    const btnCloseHelp = document.getElementById("btn-close-help");
    const helpBackdrop = document.getElementById("help-modal-backdrop");

    const openHelp = (defaultTab = "safeguard") => {
      if (helpModal) helpModal.classList.replace("hidden", "flex");

      // Function to switch tabs inside the help modal
      const switchHelpTab = (tabName) => {
        const btnSafeguard = document.getElementById("tab-help-safeguard");
        const btnShortcuts = document.getElementById("tab-help-shortcuts");
        const contentSafeguard = document.getElementById(
          "content-help-safeguard",
        );
        const contentShortcuts = document.getElementById(
          "content-help-shortcuts",
        );

        if (
          !btnSafeguard ||
          !btnShortcuts ||
          !contentSafeguard ||
          !contentShortcuts
        )
          return;

        if (tabName === "safeguard") {
          // Safeguard Active State
          btnSafeguard.className =
            "w-full md:flex-1 text-center py-2 sm:py-2.5 text-xs sm:text-sm font-bold rounded-lg bg-brand/30 text-primary border border-brand/40 transition cursor-pointer";
          btnShortcuts.className =
            "w-full md:flex-1 text-center py-2 sm:py-2.5 text-xs sm:text-sm font-bold rounded-lg text-secondary hover:text-primary border border-transparent transition cursor-pointer";

          contentSafeguard.classList.remove("hidden");
          contentSafeguard.classList.add("flex");
          contentShortcuts.classList.add("hidden");
        } else if (tabName === "shortcuts") {
          // Shortcuts Active State
          btnShortcuts.className =
            "w-full md:flex-1 text-center py-2 sm:py-2.5 text-xs sm:text-sm font-bold rounded-lg bg-brand/30 text-primary border border-brand/40 transition cursor-pointer";
          btnSafeguard.className =
            "w-full md:flex-1 text-center py-2 sm:py-2.5 text-xs sm:text-sm font-bold rounded-lg text-secondary hover:text-primary border border-transparent transition cursor-pointer";

          contentShortcuts.classList.remove("hidden");
          contentSafeguard.classList.add("hidden");
          contentSafeguard.classList.remove("flex");
        }
      };

      // Set initial tab state upon opening
      switchHelpTab(defaultTab);

      // Bind click listeners for help modal tabs
      const btnSafeguard = document.getElementById("tab-help-safeguard");
      const btnShortcuts = document.getElementById("tab-help-shortcuts");

      if (btnSafeguard && !btnSafeguard.dataset.bound) {
        btnSafeguard.addEventListener("click", () =>
          switchHelpTab("safeguard"),
        );
        btnSafeguard.dataset.bound = "true";
      }

      if (btnShortcuts && !btnShortcuts.dataset.bound) {
        btnShortcuts.addEventListener("click", () =>
          switchHelpTab("shortcuts"),
        );
        btnShortcuts.dataset.bound = "true";
      }

      document.body.classList.add("overflow-hidden");
    };

    const closeHelp = () => {
      if (helpModal) helpModal.classList.replace("flex", "hidden");

      document.body.classList.remove("overflow-hidden");
    };

    helpToggle?.addEventListener("click", openHelp);
    closeHelpModal?.addEventListener("click", closeHelp);
    btnCloseHelp?.addEventListener("click", closeHelp);
    helpBackdrop?.addEventListener("click", closeHelp);

    const scrollTopBtn = document.getElementById("scroll-to-top-btn");

    if (scrollTopBtn) {
      let isVisible = false;
      let hideTimeout;

      window.addEventListener("scroll", () => {
        const scrollThreshold = 600;

        if (window.scrollY > scrollThreshold) {
          if (!isVisible) {
            isVisible = true;
            clearTimeout(hideTimeout);

            scrollTopBtn.classList.replace("hidden", "flex");

            requestAnimationFrame(() => {
              scrollTopBtn.classList.remove("opacity-0", "scale-75");
              scrollTopBtn.classList.add("opacity-100", "scale-100");
            });
          }
        } else {
          if (isVisible) {
            isVisible = false;

            requestAnimationFrame(() => {
              scrollTopBtn.classList.remove("opacity-100", "scale-100");
              scrollTopBtn.classList.add("opacity-0", "scale-75");
            });

            hideTimeout = setTimeout(() => {
              if (!isVisible) {
                scrollTopBtn.classList.replace("flex", "hidden");
              }
            }, 200);
          }
        }
      });

      scrollTopBtn.addEventListener("click", () => {
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      });
    }

    if (window.currentThemeListener) {
      document.removeEventListener("themeChanged", window.currentThemeListener);
    }
    window.currentThemeListener = () => {
      const allHabits = StateManager.getHabits();
      AnalyticsController.dispatchRender(allHabits);
    };
    document.addEventListener("themeChanged", window.currentThemeListener);
  },

  handleTabSwitch(tab) {
    StateManager.setTab(tab);
    this.refreshUI();
    this.updateTabStyles(tab);
  },

  handleViewSwitch(view) {
    StateManager.setView(view);
    this.refreshUI();
  },

  toggleModal(modalId, show) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    if (show) {
      modal.classList.replace("hidden", "flex");
      document.body.classList.add("overflow-hidden");
    } else {
      modal.classList.replace("flex", "hidden");
      document.body.classList.remove("overflow-hidden");
    }
  },

  updateNavigationDOM() {
    const views = ["habits", "analytics", "settings"];
    views.forEach((v) => {
      const el = document.getElementById(`${v}-view`);
      if (el) {
        if (state.currentView === v) el.classList.replace("hidden", "flex");
        else el.classList.replace("flex", "hidden");
      }

      const desktopBtn = document.getElementById(`nav-${v}`);
      const mobileBtn = document.getElementById(`mobile-${v}`);

      if (state.currentView === v) {
        desktopBtn?.classList.replace("text-secondary", "text-brand/80");
        desktopBtn?.classList.add("shadow-brand/10");
        desktopBtn?.classList.add("active");
        mobileBtn?.classList.replace("text-secondary", "text-brand/80");
        mobileBtn?.classList.add("active");
      } else {
        desktopBtn?.classList.replace("text-brand/80", "text-secondary");
        desktopBtn?.classList.remove("shadow-brand/10");
        desktopBtn?.classList.remove("active");
        mobileBtn?.classList.replace("text-brand/80", "text-secondary");
        mobileBtn?.classList.remove("active");
      }
    });

    requestAnimationFrame(() => {
      if (state.currentView === "habits") {
        this.updateTabStyles(state.activeTab);
      }
    });
  },

  setupTabIndicatorObserver() {
    const activeBtn = document.getElementById("tab-active");
    const archivedBtn = document.getElementById("tab-archived");

    if (!activeBtn || !archivedBtn) return;

    if (!window.habitTabResizeObserver) {
      window.habitTabResizeObserver = new ResizeObserver(() => {
        requestAnimationFrame(() => {
          this.updateTabStyles(state.activeTab);
        });
      });
    }

    window.habitTabResizeObserver.disconnect();
    window.habitTabResizeObserver.observe(activeBtn);
    window.habitTabResizeObserver.observe(archivedBtn);
  },

  updateTabStyles(tab) {
    const indicator = document.getElementById("tab-indicator");
    const activeBtn = document.getElementById("tab-active");
    const archivedBtn = document.getElementById("tab-archived");

    if (!indicator || !activeBtn || !archivedBtn) return;

    const buttonWidth =
      activeBtn.offsetWidth || activeBtn.getBoundingClientRect().width;

    if (!buttonWidth) return;

    const offset = 4;

    indicator.style.width = `${buttonWidth}px`;

    if (tab === "active") {
      indicator.style.left = `${offset}px`;
      activeBtn.classList.replace(
        "text-secondary",
        "text-(--color-btn-primary-text)",
      );
      archivedBtn.classList.replace(
        "text-(--color-btn-primary-text)",
        "text-secondary",
      );
    } else {
      indicator.style.left = `${buttonWidth + offset}px`;
      archivedBtn.classList.replace(
        "text-secondary",
        "text-(--color-btn-primary-text)",
      );
      activeBtn.classList.replace(
        "text-(--color-btn-primary-text)",
        "text-secondary",
      );
    }
  },
};
