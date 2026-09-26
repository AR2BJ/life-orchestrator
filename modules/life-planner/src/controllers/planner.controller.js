import {
  FILTER_OPTIONS_BY_TAB,
  MOOD_OPTIONS,
  PLAN_STATES,
  SORT_OPTIONS_BY_TAB,
} from "@/utils/constants/options-value.constants.js";
import { StateManager, state } from "@/models/state.model.js";

import { AnalyticsController } from "./analytics.controller.js";
import { AnalyticsView } from "@/views/analytics-view.js";
import { AutocompleteComponent } from "@/components/ui/autocomplete.component.js";
import { CalendarController } from "./calendar.controller.js";
import { CalendarView } from "@/views/calendar-view.js";
import { DeleteModalsComponent } from "@/components/modals/delete-modals.component.js";
import { DesktopNavComponent } from "@/components/layout/desktop-nav.component.js";
import { EditModalsComponent } from "@/components/modals/edit-modals.component.js";
import { GlobalLoaderService } from "@/services/loader.service.js";
import { HeaderComponent } from "@/components/shared/header.component.js";
import { InfoModalComponent } from "@/components/modals/info-modal.component.js";
import { MobileNavComponent } from "@/components/layout/mobile-nav.component.js";
import { NavigationController } from "./navigation.controller.js";
import { PlannerActionController } from "./planner/planner-action.controller.js";
import { PlannerFormController } from "./planner/planner-form.controller.js";
import { PlannerView } from "@/views/planner-view.js";
import { SettingsViewComponent } from "@/components/features/settings/settings-view.component.js";
import { eventBus } from "@/services/event-bus.service.js";
import { openObjectivesState } from "@/utils/helpers.js";
import { renderPlannerList } from "@/views/planner/planner-list.renderer.js";
import { store } from "@/services/store.service.js";

export const PlannerController = {
  init() {
    StateManager.init();
    this.renderComponent();

    this.initFilterAutocompletes();
    this.initFormAutocompletes();
    this.refreshUI();

    PlannerFormController.init(this);
    PlannerActionController.init(this);

    this.bindStaticEvents();
    this.bindMenuToggle();
    this.bindActionMenuToggle();
    this.setupTabIndicatorObserver();
    this.subscribeToDataChanges();

    requestAnimationFrame(() => {
      this.updateTabStyles(state.activeTab);
    });
  },

  // --------------------------------------
  // FILTER & SORT AUTOCOMPLETES (Toolbar)
  // --------------------------------------
  initFilterAutocompletes() {
    const currentTab = state.activeTab || "plans";
    const filterWrapper = document.getElementById(
      "filter-autocomplete-wrapper",
    );
    const sortWrapper = document.getElementById("sort-autocomplete-wrapper");

    // 1. Comprehensive Filter Autocomplete
    if (filterWrapper) {
      if (this.filterAutocomplete) {
        this.filterAutocomplete.destroy();
      }

      const rawOptions =
        FILTER_OPTIONS_BY_TAB[currentTab] || FILTER_OPTIONS_BY_TAB.plans;

      const filterOptions = rawOptions.map((opt) => ({
        title: opt.title || opt.name,
        value: opt.value || opt.id,
        icon: opt.icon,
      }));

      this.filterAutocomplete = new AutocompleteComponent(
        filterWrapper,
        filterOptions,
        {
          label: "Filter",
          isRow: true,
          placeholder: "Select Filter...",
          itemTitle: "title",
          itemValue: "value",
          itemIcon: "icon",
          containerClass: "min-h-8! bg-surface!",
          inputClass: "h-5! pb-0! w-full lg:w-36 text-xs sm:text-sm",
          onChange: (selectedVal) => {
            GlobalLoaderService.show("Applying filter...");
            setTimeout(() => {
              try {
                const ui = StateManager.getActiveUIState();
                if (ui) {
                  ui.filterBy = selectedVal;
                }

                StateManager.notifyActiveTabChanged();
                this.refreshUI();
              } finally {
                GlobalLoaderService.hide();
              }
            }, 100);
          },
        },
      );

      const activeFilter = this.getSelectedFilterForTab(currentTab);
      this.filterAutocomplete.setValue(activeFilter);
    }

    // 2. Comprehensive Sort Autocomplete
    if (sortWrapper) {
      if (this.sortAutocomplete) {
        this.sortAutocomplete.destroy();
      }

      const sortOptions =
        SORT_OPTIONS_BY_TAB[currentTab] || SORT_OPTIONS_BY_TAB.plans;

      this.sortAutocomplete = new AutocompleteComponent(
        sortWrapper,
        sortOptions,
        {
          label: "Sort",
          isRow: true,
          placeholder: "Sort By...",
          itemTitle: "title",
          itemValue: "value",
          itemIcon: "icon",
          containerClass: "min-h-8! bg-surface!",
          inputClass: "h-5! pb-0! w-full lg:w-36 text-xs sm:text-sm",
          onChange: (selectedVal) => {
            GlobalLoaderService.show("Sorting items...");
            setTimeout(() => {
              try {
                store.setSortBy(selectedVal);
                this.refreshUI();
              } finally {
                GlobalLoaderService.hide();
              }
            }, 100);
          },
        },
      );

      const activeSort = this.getSelectedSortForTab(currentTab);
      this.sortAutocomplete.setValue(activeSort);
    }
  },

  // -------------------------------------------
  // FORM AUTOCOMPLETES (Create Form Dropdowns)
  // -------------------------------------------
  initFormAutocompletes() {
    const lifeAreaWrapper = document.getElementById(
      "plan-life-area-autocomplete-wrapper",
    );
    const statusWrapper = document.getElementById(
      "plan-status-autocomplete-wrapper",
    );
    const moodWrapper = document.getElementById(
      "log-mood-autocomplete-wrapper",
    );

    // 1. Life Area Select
    if (lifeAreaWrapper) {
      if (this.formLifeAreaAutocomplete) {
        this.formLifeAreaAutocomplete.destroy();
      }

      const lifeAreaOptions = StateManager.getLifeAreas();

      this.formLifeAreaAutocomplete = new AutocompleteComponent(
        lifeAreaWrapper,
        lifeAreaOptions,
        {
          label: "Life Area",
          placeholder: "Select Area...",
          itemTitle: "name",
          itemValue: "id",
          itemIcon: "icon",
          containerClass: "min-h-9! bg-surface-2!",
          inputClass: "h-6! pb-0! w-full text-xs sm:text-sm",
          onChange: (selectedVal) => {
            const hiddenInput = document.getElementById(
              "create-plan-life-area",
            );
            if (hiddenInput) hiddenInput.value = selectedVal;
          },
        },
      );
    }

    // 2. Status Select
    if (statusWrapper) {
      if (this.formStatusAutocomplete) {
        this.formStatusAutocomplete.destroy();
      }

      this.formStatusAutocomplete = new AutocompleteComponent(
        statusWrapper,
        PLAN_STATES || [],
        {
          label: "Status",
          placeholder: "Select Status...",
          itemTitle: "name",
          itemValue: "id",
          itemIcon: "icon",
          containerClass: "min-h-9! bg-surface-2!",
          inputClass: "h-6! pb-0! w-full text-xs sm:text-sm",
          onChange: (selectedVal) => {
            const hiddenInput = document.getElementById("create-plan-status");
            if (hiddenInput) hiddenInput.value = selectedVal;
          },
        },
      );
    }

    // 3. Mood Select
    if (moodWrapper) {
      if (this.formMoodAutocomplete) {
        this.formMoodAutocomplete.destroy();
      }

      this.formMoodAutocomplete = new AutocompleteComponent(
        moodWrapper,
        MOOD_OPTIONS || [],
        {
          label: "Mood",
          placeholder: "Select Mood...",
          itemTitle: "name",
          itemValue: "id",
          itemIcon: "icon",
          containerClass: "min-h-9! bg-surface-2!",
          inputClass: "h-6! pb-0! w-full text-xs sm:text-sm",
          onChange: (selectedVal) => {
            const hiddenInput = document.getElementById("create-log-mood");
            if (hiddenInput) hiddenInput.value = selectedVal;
          },
        },
      );
    }
  },

  getSelectedFilterForTab(tab) {
    if (tab === "plans") return state.plansUI?.filterBy || "all";
    if (tab === "logs") return state.logsUI?.filterBy || "all";
    if (tab === "templates") return state.templatesUI?.filterBy || "all";
    return "all";
  },

  getSelectedSortForTab(tab) {
    if (tab === "plans") return state.plansUI?.sortBy || "created_desc";
    if (tab === "logs") return state.logsUI?.sortBy || "date_desc";
    if (tab === "templates")
      return state.templatesUI?.sortBy || "favorites_first";
    return "date_desc";
  },

  renderComponent() {
    const renderMap = {
      "header-container": HeaderComponent.render,
      "desktop-nav-container": DesktopNavComponent.render,
      "mobile-nav-container": MobileNavComponent.render,
      "planner-view-container": PlannerView.render,
      "analytics-view-container": AnalyticsView.render,
      "calendar-view-container": CalendarView.render,
      "settings-view-container": SettingsViewComponent.render,
      "help-modal-container": InfoModalComponent.render,
      "edit-modals-container": EditModalsComponent.render,
      "delete-modals-container": DeleteModalsComponent.render,
    };

    Object.entries(renderMap).forEach(([id, renderFn]) => {
      const container = document.getElementById(id);
      if (container && typeof renderFn === "function") {
        container.innerHTML = renderFn();
      }
    });
  },

  subscribeToDataChanges() {
    eventBus.subscribe("store:changed", () => {
      this.refreshUI();
    });
    eventBus.subscribe("store:plans:changed", () => {
      this.refreshUI();
    });
    eventBus.subscribe("store:logs:changed", () => {
      this.refreshUI();
    });
    eventBus.subscribe("store:templates:changed", () => {
      this.refreshUI();
    });
    eventBus.subscribe("ui:tab:changed", (tab) => {
      this.updateTabStyles(tab);
      this.switchFormTabVisibility(tab);
    });
  },

  getLifeAreasForTab() {
    return StateManager.getLifeAreas();
  },

  getSelectedLifeAreaForTab(tab) {
    if (tab === "plans") return state.plansUI?.selectedLifeArea || "all";
    if (tab === "logs") return state.logsUI?.selectedLifeArea || "all";
    if (tab === "templates")
      return state.templatesUI?.selectedLifeArea || "all";
    return "all";
  },

  getSearchQueryForTab(tab) {
    if (tab === "plans") return state.plansUI?.searchQuery || "";
    if (tab === "logs") return state.logsUI?.searchQuery || "";
    if (tab === "templates") return state.templatesUI?.searchQuery || "";
    return "";
  },

  renderLifeAreas() {
    const container = document.getElementById("life-area-filter-scroll");
    if (!container) return;

    const currentTab = state.activeTab || "plans";
    const lifeAreas = this.getLifeAreasForTab();
    const activeLifeArea = this.getSelectedLifeAreaForTab(currentTab);

    const allButtonHtml = `
      <button
        data-life-area="all"
        class="life-area-filter-btn h-8 shrink-0 whitespace-nowrap rounded-lg px-3.5 text-xs font-semibold transition cursor-pointer ${
          activeLifeArea === "all"
            ? "bg-brand/80 text-white shadow-brand/10 shadow-sm"
            : "bg-surface border border-border text-secondary hover:text-color hover:bg-surface-2"
        }"
      >
        All ${currentTab.charAt(0).toUpperCase() + currentTab.slice(1)}
      </button>
    `;

    const lifeAreasHtml = lifeAreas
      .map((cat) => {
        const isActive = String(activeLifeArea) === String(cat.id);
        const activeClasses = isActive
          ? "bg-brand/80 text-white shadow-brand/10 shadow-sm"
          : "bg-surface border border-border text-secondary hover:text-color hover:bg-surface-2";

        return `
        <button
          data-life-area="${cat.id}"
          class="life-area-filter-btn flex items-center gap-1.5 h-8 shrink-0 whitespace-nowrap rounded-lg px-3.5 text-xs font-semibold transition cursor-pointer ${activeClasses}"
        >
          ${cat.icon ? `<i class="${cat.icon} text-xs lg:text-sm pb-0.5"></i>` : ""}
          <span>${cat.name}</span>
        </button>
      `;
      })
      .join("");

    container.innerHTML = allButtonHtml + lifeAreasHtml;
  },

  refreshUI() {
    const allPlans = StateManager.getPlans();
    const filteredData = StateManager.getFilteredDataForActiveTab();

    renderPlannerList(filteredData, state.activeTab);
    AnalyticsController.dispatchRender(allPlans);
    CalendarController.dispatchRender();
    NavigationController.updateNavigationDOM();
    PlannerFormController.refreshUI();

    this.renderLifeAreas();
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
    // 1. Tag Filters
    const lifeAreaFilterBtn = document.getElementById(
      "life-area-filter-scroll",
    );
    if (lifeAreaFilterBtn) {
      lifeAreaFilterBtn.addEventListener("click", (e) => {
        const btn = e.target.closest(".life-area-filter-btn");
        if (!btn) return;

        const selectedTag = btn.dataset.lifeArea;
        store.setLifeAreaFilter(selectedTag);
      });
    }

    const toggleFormBtn = document.getElementById("btn-toggle-planner-form");
    const formContainer = document.getElementById("planner-form-container");
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

    // 2. Search Handler
    const searchInput = document.getElementById("search-planner");
    const clearBtn = document.getElementById("clear-search-btn");
    const searchContainer = searchInput?.closest(".group\\/search");

    if (searchInput) {
      searchInput.value = this.getSearchQueryForTab(state.activeTab);

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
        GlobalLoaderService.show("Searching plans...");
        setTimeout(() => {
          try {
            store.setSearchQuery(e.target.value);
            evaluateSearchState();
          } finally {
            GlobalLoaderService.hide();
          }
        }, 100);
      });

      searchContainer?.addEventListener("mouseenter", evaluateSearchState);
      searchContainer?.addEventListener("mouseleave", evaluateSearchState);

      clearBtn?.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();

        GlobalLoaderService.show("Clearing search...");
        setTimeout(() => {
          try {
            searchInput.value = "";
            store.setSearchQuery("");
            setTimeout(() => searchInput.focus(), 100);
            evaluateSearchState();
          } finally {
            GlobalLoaderService.hide();
          }
        }, 100);
      });
    }

    // 3. Sub-Tabs Handling
    const plansBtn = document.getElementById("tab-plans");
    const logsBtn = document.getElementById("tab-logs");
    const templatesBtn = document.getElementById("tab-templates");

    const handleTabClick = (targetTab, loaderText) => {
      if (state.activeTab === targetTab) return;

      GlobalLoaderService.show(loaderText);

      setTimeout(() => {
        try {
          this.handleTabSwitch(targetTab);
        } finally {
          GlobalLoaderService.hide();
        }
      }, 30);
    };

    plansBtn?.addEventListener("click", () =>
      handleTabClick("plans", "Switching to Plans..."),
    );
    logsBtn?.addEventListener("click", () =>
      handleTabClick("logs", "Loading Logs Tracker..."),
    );
    templatesBtn?.addEventListener("click", () =>
      handleTabClick("templates", "Loading Routine Templates..."),
    );

    // 4. Navigation Views
    const navButtons = ["planner", "analytics", "calendar", "settings"];
    navButtons.forEach((v) => {
      const desktopBtn = document.getElementById(`nav-${v}`);
      const mobileBtn = document.getElementById(`mobile-${v}`);

      const handleNav = () => {
        if (state.currentView === v) return;

        GlobalLoaderService.show(`Navigating...`);

        setTimeout(() => {
          try {
            StateManager.setView(v);

            openObjectivesState.clear();

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

    // 5. Help Modal Handlers
    const helpToggle = document.getElementById("help-toggle");
    const helpModal = document.getElementById("help-modal");
    const closeHelpModal = document.getElementById("close-help-modal");
    const btnCloseHelp = document.getElementById("btn-close-help");
    const helpBackdrop = document.getElementById("help-modal-backdrop");

    const openHelp = (defaultTab = "safeguard") => {
      if (helpModal) helpModal.classList.replace("hidden", "flex");

      const switchHelpTab = (tabName) => {
        const btnSafeguard = document.getElementById("tab-help-safeguard");
        const btnShortcuts = document.getElementById("tab-help-shortcuts");
        const contentSafeguard = document.getElementById(
          "content-help-safeguard",
        );
        const contentShortcuts = document.getElementById(
          "content-help-shortcuts",
        );

        if (!btnSafeguard || !btnShortcuts) return;

        if (tabName === "safeguard") {
          btnSafeguard.className =
            "flex-1 py-2 text-xs font-bold rounded-lg bg-brand text-white transition cursor-pointer flex justify-center items-center";
          btnShortcuts.className =
            "flex-1 py-2 text-xs font-bold rounded-lg text-secondary hover:text-color transition cursor-pointer flex justify-center items-center";
          contentSafeguard?.classList.remove("hidden");
          contentShortcuts?.classList.add("hidden");
        } else if (tabName === "shortcuts") {
          btnShortcuts.className =
            "flex-1 py-2 text-xs font-bold rounded-lg bg-brand text-white transition cursor-pointer flex justify-center items-center";
          btnSafeguard.className =
            "flex-1 py-2 text-xs font-bold rounded-lg text-secondary hover:text-color transition cursor-pointer flex justify-center items-center";
          contentShortcuts?.classList.remove("hidden");
          contentSafeguard?.classList.add("hidden");
        }
      };

      switchHelpTab(defaultTab);

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

    // 6. Scroll To Top
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
        } else if (isVisible) {
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
      });

      scrollTopBtn.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
    }

    // 7. Theme Listener
    if (window.currentThemeListener) {
      document.removeEventListener("themeChanged", window.currentThemeListener);
    }
    window.currentThemeListener = () => {
      const allPlans = StateManager.getPlans();
      AnalyticsController.dispatchRender(allPlans);
    };
    document.addEventListener("themeChanged", window.currentThemeListener);

    // 8. Currency Listener
    if (window.currentCurrencyListener) {
      document.removeEventListener(
        "currencyChanged",
        window.currentCurrencyListener,
      );
    }
    window.currentCurrencyListener = () => {
      this.refreshUI();
    };
    document.addEventListener(
      "currencyChanged",
      window.currentCurrencyListener,
    );
  },

  handleTabSwitch(tab) {
    store.setTab(tab);

    openObjectivesState.clear();

    const searchInput = document.getElementById("search-planner");
    if (searchInput) {
      searchInput.value = this.getSearchQueryForTab(tab);
    }

    this.initFilterAutocompletes();
  },

  switchFormTabVisibility(tab) {
    const fields = document.querySelectorAll(".plan-tab-fields");
    fields.forEach((field) => {
      if (field.dataset.tabFields?.includes(tab)) {
        field.classList.remove("hidden");
        field.classList.add("flex");
      } else {
        field.classList.add("hidden");
        field.classList.remove("flex");
      }
    });

    const formToggleTitle = document.getElementById("form-toggle-title");
    if (formToggleTitle) {
      const titles = {
        plans: "Create New Plan",
        logs: "Create New Log",
        templates: "Create New Template",
      };
      formToggleTitle.textContent = titles[tab] || "Create New Item";
    }

    const titleInput = document.getElementById("create-item-title");
    const descInput = document.getElementById("create-item-desc");
    if (titleInput) titleInput.value = "";
    if (descInput) descInput.value = "";
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

  setupTabIndicatorObserver() {
    const plansBtn = document.getElementById("tab-plans");
    const logsBtn = document.getElementById("tab-logs");
    const templatesBtn = document.getElementById("tab-templates");

    if (!plansBtn || !logsBtn || !templatesBtn) return;

    if (!window.planTabResizeObserver) {
      window.planTabResizeObserver = new ResizeObserver(() => {
        requestAnimationFrame(() => {
          this.updateTabStyles(state.activeTab || "plans");
        });
      });
    }

    window.planTabResizeObserver.disconnect();
    window.planTabResizeObserver.observe(plansBtn);
    window.planTabResizeObserver.observe(logsBtn);
    window.planTabResizeObserver.observe(templatesBtn);
  },

  updateTabStyles(tab) {
    const indicator = document.getElementById("tab-indicator");
    const plansBtn = document.getElementById("tab-plans");
    const logsBtn = document.getElementById("tab-logs");
    const templatesBtn = document.getElementById("tab-templates");

    if (!indicator || !plansBtn || !logsBtn || !templatesBtn) return;

    const buttons = [plansBtn, logsBtn, templatesBtn];
    const activeIndex =
      {
        plans: 0,
        logs: 1,
        templates: 2,
      }[tab] ?? 0;
    const targetBtn = buttons[activeIndex];

    const buttonWidth =
      targetBtn.offsetWidth || targetBtn.getBoundingClientRect().width;
    if (!buttonWidth) return;

    const isWide = window.matchMedia("(min-width: 375px)").matches;

    if (isWide) {
      let offsetLeft = 4;
      for (let i = 0; i < activeIndex; i++) {
        offsetLeft += buttons[i].offsetWidth;
      }

      indicator.style.width = `${buttonWidth}px`;
      indicator.style.left = `${offsetLeft}px`;
      indicator.style.top = `4px`;
      indicator.style.height = `${targetBtn.offsetHeight}px`;
    } else {
      let offsetTop = 4;
      for (let i = 0; i < activeIndex; i++) {
        offsetTop += buttons[i].offsetHeight;
      }

      indicator.style.height = `${targetBtn.offsetHeight}px`;
      indicator.style.top = `${offsetTop}px`;
      indicator.style.left = `4px`;
      indicator.style.width = `${buttonWidth}px`;
    }

    buttons.forEach((btn, idx) => {
      if (idx === activeIndex) {
        btn.classList.replace(
          "text-secondary",
          "text-(--color-btn-primary-text)",
        );
      } else {
        btn.classList.replace(
          "text-(--color-btn-primary-text)",
          "text-secondary",
        );
      }
    });
  },
};
