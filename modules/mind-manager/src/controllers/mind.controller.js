import {
  FILTER_OPTIONS_BY_TAB,
  SNIPPET_CATEGORIES,
  SORT_OPTIONS_BY_TAB,
} from "@/utils/constants/options-value.constants.js";
import { StateManager, state } from "@/models/state.model.js";

import { AnalyticsController } from "./analytics.controller.js";
import { AnalyticsView } from "@/views/analytics-view.js";
import { AutocompleteComponent } from "@/components/ui/autocomplete.component.js";
import { DeleteModalsComponent } from "@/components/modals/delete-modals.component.js";
import { DesktopNavComponent } from "@/components/layout/desktop-nav.component.js";
import { EditModalsComponent } from "@/components/modals/edit-modals.component.js";
import { FullscreenModalComponent } from "@/components/modals/fullscreen-modal.component.js";
import { GlobalLoaderService } from "@/services/loader.service.js";
import { HeaderComponent } from "@/components/shared/header.component.js";
import { InfoModalComponent } from "@/components/modals/info-modal.component.js";
import { MindActionController } from "./mind/mind-action.controller.js";
import { MindFormController } from "./mind/mind-form.controller.js";
import { MindView } from "@/views/mind-view.js";
import { MobileNavComponent } from "@/components/layout/mobile-nav.component.js";
import { NavigationController } from "./navigation.controller.js";
import { SettingsTagController } from "./settings/settings-tag.controller.js";
import { SettingsViewComponent } from "@/components/features/settings/settings-view.component.js";
import { TagItemsModalComponent } from "@/components/modals/tag-items-modal.component.js";
import { eventBus } from "@/services/event-bus.service.js";
import { renderMindList } from "@/views/mind/mind-list.renderer.js";
import { store } from "@/services/store.service.js";

export const MindController = {
  async init() {
    StateManager.init();
    this.renderComponent();

    this.initFilterAutocompletes();
    this.initFormAutocompletes();
    this.refreshUI();

    MindFormController.init(this);
    MindActionController.init(this);

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
    const currentTab = state.activeTab || "notes";
    const filterWrapper = document.getElementById(
      "filter-autocomplete-wrapper",
    );
    const sortWrapper = document.getElementById("sort-autocomplete-wrapper");

    // 1. Filter Autocomplete
    if (filterWrapper) {
      if (this.filterAutocomplete) {
        this.filterAutocomplete.destroy();
      }

      const rawOptions =
        FILTER_OPTIONS_BY_TAB[currentTab] || FILTER_OPTIONS_BY_TAB.notes || [];

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
                store.setFilterBy(selectedVal);
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

    // 2. Sort Autocomplete
    if (sortWrapper) {
      if (this.sortAutocomplete) {
        this.sortAutocomplete.destroy();
      }

      const sortOptions =
        SORT_OPTIONS_BY_TAB[currentTab] || SORT_OPTIONS_BY_TAB.notes || [];

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
    const categoryWrapper = document.getElementById(
      "snippet-category-autocomplete-wrapper",
    );

    // 1. Category Select (For Snippets)
    if (categoryWrapper) {
      if (this.formCategoryAutocomplete) {
        this.formCategoryAutocomplete.destroy();
      }

      this.formCategoryAutocomplete = new AutocompleteComponent(
        categoryWrapper,
        SNIPPET_CATEGORIES || [],
        {
          label: "Category",
          placeholder: "Select Category...",
          itemTitle: "name",
          itemValue: "id",
          itemIcon: "icon",
          containerClass: "min-h-9! bg-surface-2!",
          inputClass: "h-6! pb-0! w-full text-xs sm:text-sm",
          onChange: (selectedVal) => {
            const hiddenInput = document.getElementById(
              "create-snippet-category",
            );
            if (hiddenInput) hiddenInput.value = selectedVal;
          },
        },
      );
    }
  },

  getSelectedFilterForTab(tab) {
    if (tab === "notes") return state.notesUI?.filterBy || "all";
    if (tab === "snippets") return state.snippetsUI?.filterBy || "all";
    if (tab === "bookmarks") return state.bookmarksUI?.filterBy || "all";
    if (tab === "cheatsheets") return state.cheatsheetsUI?.filterBy || "all";
    return "all";
  },

  getSelectedSortForTab(tab) {
    if (tab === "notes") return state.notesUI?.sortBy || "created_desc";
    if (tab === "snippets") return state.snippetsUI?.sortBy || "created_desc";
    if (tab === "bookmarks") return state.bookmarksUI?.sortBy || "created_desc";
    if (tab === "cheatsheets")
      return state.cheatsheetsUI?.sortBy || "created_desc";
    return "created_desc";
  },

  renderComponent() {
    const renderMap = {
      "header-container": HeaderComponent.render,
      "desktop-nav-container": DesktopNavComponent.render,
      "mobile-nav-container": MobileNavComponent.render,
      "mind-view-container": MindView.render,
      "analytics-view-container": AnalyticsView.render,
      "settings-view-container": SettingsViewComponent.render,
      "help-modal-container": InfoModalComponent.render,
      "fullscreen-modals-container": FullscreenModalComponent.render,
      "tag-modals-container": TagItemsModalComponent.render,
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
    eventBus.subscribe("store:notes:changed", () => {
      this.refreshUI();
    });
    eventBus.subscribe("store:snippets:changed", () => {
      this.refreshUI();
    });
    eventBus.subscribe("store:bookmarks:changed", () => {
      this.refreshUI();
    });
    eventBus.subscribe("store:cheatsheets:changed", () => {
      this.refreshUI();
    });
    eventBus.subscribe("ui:tab:changed", (tab) => {
      this.updateTabStyles(tab);
      this.switchFormTabVisibility(tab);
    });
  },

  getCategoriesForTab() {
    return StateManager.getCategories();
  },

  getSelectedCategoryForTab(tab) {
    if (tab === "notes") return state.notesUI?.selectedCategory || "all";
    if (tab === "snippets") return state.snippetsUI?.selectedCategory || "all";
    if (tab === "bookmarks")
      return state.bookmarksUI?.selectedCategory || "all";
    if (tab === "cheatsheets")
      return state.cheatsheetsUI?.selectedCategory || "all";
    return "all";
  },

  getSearchQueryForTab(tab) {
    if (tab === "notes") return state.notesUI?.searchQuery || "";
    if (tab === "snippets") return state.snippetsUI?.searchQuery || "";
    if (tab === "bookmarks") return state.bookmarksUI?.searchQuery || "";
    if (tab === "cheatsheets") return state.cheatsheetsUI?.searchQuery || "";
    return "";
  },

  renderCategories() {
    const container = document.getElementById("category-filter-scroll");
    if (!container) return;

    const currentTab = state.activeTab || "notes";
    const categories = this.getCategoriesForTab();
    const activeCategory = this.getSelectedCategoryForTab(currentTab);

    const allButtonHtml = `
      <button
        data-category="all"
        class="category-filter-btn h-8 shrink-0 whitespace-nowrap rounded-lg px-3.5 text-xs font-semibold transition cursor-pointer ${
          activeCategory === "all"
            ? "bg-brand/80 text-white shadow-brand/10 shadow-sm"
            : "bg-surface border border-border text-secondary hover:text-color hover:bg-surface-2"
        }"
      >
        All ${currentTab.charAt(0).toUpperCase() + currentTab.slice(1)}
      </button>
    `;

    const categoriesHtml = categories
      .map((cat) => {
        const isActive = String(activeCategory) === String(cat.id);
        const activeClasses = isActive
          ? "bg-brand/80 text-white shadow-brand/10 shadow-sm"
          : "bg-surface border border-border text-secondary hover:text-color hover:bg-surface-2";

        let iconClass = cat.icon ? cat.icon : "";
        if (isActive) {
          iconClass =
            iconClass.replace(/text-[a-zA-Z0-9\/\-]+/g, "").trim() +
            " text-white";
        }

        return `
        <button
          data-category="${cat.id}"
          class="category-filter-btn flex items-center gap-1.5 h-8 shrink-0 whitespace-nowrap rounded-lg px-3.5 text-xs font-semibold transition cursor-pointer ${activeClasses}"
        >
          ${cat.icon ? `<i class="${iconClass} text-xs lg:text-sm pb-0.5"></i>` : ""}
          <span>${cat.name}</span>
        </button>
      `;
      })
      .join("");

    container.innerHTML = allButtonHtml + categoriesHtml;
  },

  refreshUI() {
    const filteredData = StateManager.getFilteredDataForActiveTab();

    renderMindList(filteredData, state.activeTab);
    AnalyticsController.dispatchRender();
    NavigationController.updateNavigationDOM();
    MindFormController.refreshUI();

    SettingsTagController.renderTagsList();

    this.renderCategories();
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
    // 1. Category Filters
    const categoryFilterBtn = document.getElementById("category-filter-scroll");
    if (categoryFilterBtn) {
      categoryFilterBtn.addEventListener("click", (e) => {
        const btn = e.target.closest(".category-filter-btn");
        if (!btn) return;

        const selectedCategory = btn.dataset.category;
        store.setCategoryFilter(selectedCategory);
      });
    }

    const toggleFormBtn = document.getElementById("btn-toggle-mind-form");
    const formContainer = document.getElementById("mind-form-container");
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
    const searchInput = document.getElementById("search-mind");
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
        GlobalLoaderService.show("Searching items...");
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

    // 3. Sub-Tabs Handling (Notes, Snippets, Bookmarks, CheatSheets)
    const notesBtn = document.getElementById("tab-notes");
    const snippetsBtn = document.getElementById("tab-snippets");
    const bookmarksBtn = document.getElementById("tab-bookmarks");
    const cheatsheetsBtn = document.getElementById("tab-cheatsheets");

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

    notesBtn?.addEventListener("click", () =>
      handleTabClick("notes", "Switching to Notes..."),
    );
    snippetsBtn?.addEventListener("click", () =>
      handleTabClick("snippets", "Loading Code Snippets..."),
    );
    bookmarksBtn?.addEventListener("click", () =>
      handleTabClick("bookmarks", "Loading Bookmarks..."),
    );
    cheatsheetsBtn?.addEventListener("click", () =>
      handleTabClick("cheatsheets", "Loading Cheat Sheets..."),
    );

    // 4. Navigation Views
    const navButtons = ["mind", "analytics", "settings"];
    navButtons.forEach((v) => {
      const desktopBtn = document.getElementById(`nav-${v}`);
      const mobileBtn = document.getElementById(`mobile-${v}`);

      const handleNav = () => {
        if (state.currentView === v) return;

        GlobalLoaderService.show(`Navigating...`);

        setTimeout(() => {
          try {
            StateManager.setView(v);

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
      this.refreshUI();
    };
    document.addEventListener("themeChanged", window.currentThemeListener);
  },

  handleTabSwitch(tab) {
    store.setTab(tab);

    const searchInput = document.getElementById("search-mind");
    if (searchInput) {
      searchInput.value = this.getSearchQueryForTab(tab);
    }

    this.initFilterAutocompletes();
  },

  switchFormTabVisibility(tab) {
    const fields = document.querySelectorAll(".mind-tab-fields");
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
        notes: "Create New Note",
        snippets: "Create New Snippet",
        bookmarks: "Create New Bookmark",
        cheatsheets: "Create New CheatSheet",
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
    const notesBtn = document.getElementById("tab-notes");
    const snippetsBtn = document.getElementById("tab-snippets");
    const bookmarksBtn = document.getElementById("tab-bookmarks");
    const cheatsheetsBtn = document.getElementById("tab-cheatsheets");

    if (!notesBtn || !snippetsBtn || !bookmarksBtn || !cheatsheetsBtn) return;

    if (!window.mindTabResizeObserver) {
      window.mindTabResizeObserver = new ResizeObserver(() => {
        requestAnimationFrame(() => {
          this.updateTabStyles(state.activeTab || "notes");
        });
      });
    }

    window.mindTabResizeObserver.disconnect();
    window.mindTabResizeObserver.observe(notesBtn);
    window.mindTabResizeObserver.observe(snippetsBtn);
    window.mindTabResizeObserver.observe(bookmarksBtn);
    window.mindTabResizeObserver.observe(cheatsheetsBtn);
  },

  updateTabStyles(tab) {
    const indicator = document.getElementById("tab-indicator");
    const notesBtn = document.getElementById("tab-notes");
    const snippetsBtn = document.getElementById("tab-snippets");
    const bookmarksBtn = document.getElementById("tab-bookmarks");
    const cheatsheetsBtn = document.getElementById("tab-cheatsheets");

    if (
      !indicator ||
      !notesBtn ||
      !snippetsBtn ||
      !bookmarksBtn ||
      !cheatsheetsBtn
    )
      return;

    const buttons = [notesBtn, snippetsBtn, bookmarksBtn, cheatsheetsBtn];
    const activeIndex =
      {
        notes: 0,
        snippets: 1,
        bookmarks: 2,
        cheatsheets: 3,
      }[tab] ?? 0;
    const targetBtn = buttons[activeIndex];

    const buttonWidth =
      targetBtn.offsetWidth || targetBtn.getBoundingClientRect().width;
    if (!buttonWidth) return;

    const isWide = window.matchMedia("(min-width: 640px)").matches;

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
