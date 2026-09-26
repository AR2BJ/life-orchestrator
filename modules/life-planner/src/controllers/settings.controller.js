import { AutocompleteComponent } from "@/components/ui/autocomplete.component.js";
import { CURRENCY_OPTIONS } from "@/utils/constants/options-value.constants.js";
import { SettingsExportController } from "./settings/settings-export.controller.js";
import { SettingsImportController } from "./settings/settings-import.controller.js";
import { SettingsResetController } from "./settings/settings-reset.controller.js";
import { getTheme } from "@/services/theme.service.js";

export const SettingsController = {
  currencyAutocomplete: null,

  init() {
    this.bindThemeEvents();
    this.bindSettingsEvents();
    this.bindCurrencyEvents();

    // Initialize sub-controllers
    SettingsImportController.init();
    SettingsResetController.init();
  },

  bindThemeEvents() {
    document
      .getElementById("sett-theme-light")
      ?.addEventListener("click", () => this.handleThemeSwitch("light"));
    document
      .getElementById("sett-theme-dark")
      ?.addEventListener("click", () => this.handleThemeSwitch("dark"));

    document.addEventListener("themeChanged", (event) => {
      this.syncThemeControls(event.detail?.theme || getTheme());
    });

    this.syncThemeControls(getTheme());
  },

  bindCurrencyEvents() {
    const container = document.getElementById(
      "currency-autocomplete-container",
    );
    if (!container) return;

    const currentCurrency = localStorage.getItem("preferred_currency") || "USD";

    this.currencyAutocomplete = new AutocompleteComponent(
      container,
      CURRENCY_OPTIONS,
      {
        label: "Default Workspace Currency",
        placeholder: "Search currency...",
        itemTitle: "title",
        itemValue: "value",
        iconClass: "ti ti-coins text-blue-500/80 lg:text-base",
        clearable: false,
        onChange: (value) => {
          if (!value) return;
          localStorage.setItem("preferred_currency", value);

          document.dispatchEvent(
            new CustomEvent("currencyChanged", {
              detail: { currency: value },
            }),
          );
        },
      },
    );

    this.currencyAutocomplete.setValue(currentCurrency);
  },

  bindSettingsEvents() {
    // Export events
    document
      .getElementById("sett-export-json-btn")
      ?.addEventListener("click", () =>
        SettingsExportController.handleDataExport("json"),
      );

    document
      .getElementById("sett-export-md-btn")
      ?.addEventListener("click", () =>
        SettingsExportController.handleDataExport("markdown"),
      );

    document
      .getElementById("sett-export-csv-btn")
      ?.addEventListener("click", () =>
        SettingsExportController.handleDataExport("csv"),
      );

    // Window resize handler for theme
    window.addEventListener("resize", () => {
      this.syncThemeControls(getTheme());
    });
  },

  syncThemeControls(targetTheme) {
    const indicator = document.getElementById("theme-tab-indicator");
    const btnLight = document.getElementById("sett-theme-light");
    const btnDark = document.getElementById("sett-theme-dark");

    if (!indicator || !btnLight || !btnDark) return;

    const isDesktop = window.screen.availWidth >= 375;

    indicator.classList.remove(
      "xs:translate-x-0",
      "xs:translate-x-full",
      "translate-y-0",
      "translate-y-full",
    );

    if (targetTheme === "dark") {
      if (isDesktop) {
        indicator.classList.add("xs:translate-x-full");
      } else {
        indicator.classList.add("translate-y-full");
      }

      btnDark.classList.replace("text-secondary", "text-color");
      btnLight.classList.replace("text-white", "text-secondary");
    } else {
      if (isDesktop) {
        indicator.classList.add("xs:translate-x-0");
      } else {
        indicator.classList.add("translate-y-0");
      }

      btnLight.classList.replace("text-secondary", "text-white");
      btnDark.classList.replace("text-color", "text-secondary");
    }
  },

  handleThemeSwitch(targetTheme) {
    const currentTheme = getTheme();
    if (currentTheme === targetTheme) return;

    document.getElementById("theme-toggle")?.click();
    this.syncThemeControls(targetTheme);
  },
};
