import {
  HABIT_NAMESPACE,
  clearHabitStorage,
  saveToStorage,
} from "@/models/storage.model";
import { StateManager, state } from "@/models/state.model.js";

import { GlobalLoaderService } from "@/services/loader.service";
import { HabitController } from "./habit.controller";
import { NotificationService } from "@/services/notification.service.js";
import { StateController } from "./state.controller";
import { formatDate } from "@/utils/helpers";
import { generateDynamicMockData } from "@/utils/seed-generator";

export const SettingsController = {
  init() {
    this.bindSettingsEvents();
  },

  bindSettingsEvents() {
    const settingsView = document.getElementById("settings-view");
    if (!settingsView) return;

    document
      .getElementById("sett-theme-light")
      ?.addEventListener("click", () => this.handleThemeSwitch("light"));
    document
      .getElementById("sett-theme-dark")
      ?.addEventListener("click", () => this.handleThemeSwitch("dark"));

    document.addEventListener("themeChanged", (event) => {
      this.syncThemeControls(
        event.detail?.theme || localStorage.getItem("theme") || "light",
      );
    });

    this.syncThemeControls(localStorage.getItem("theme") || "light");

    document
      .getElementById("sett-export-btn")
      ?.addEventListener("click", () => this.handleDataExport("json"));

    document
      .getElementById("sett-export-md-btn")
      ?.addEventListener("click", () => this.handleDataExport("markdown"));

    document
      .getElementById("sett-export-notion-btn")
      ?.addEventListener("click", () => this.handleDataExport("notion"));

    this.initImportDropzone();

    document
      .getElementById("sett-seed-btn")
      ?.addEventListener("click", () => this.handleDataSeeding());

    document
      .getElementById("sett-auto-archive-toggle")
      ?.addEventListener("click", () => this.handleAutoArchiveToggle());

    this.syncAutoArchiveToggle();

    document.addEventListener("keydown", (e) => {
      const resetModal = document.getElementById("settings-reset-modal");
      const resetOpen = resetModal && !resetModal.classList.contains("hidden");

      if (!resetOpen) return;

      if (e.key === "Escape" || e.key === "Enter") {
        e.preventDefault();
        e.stopPropagation();
      }

      if (e.key === "Escape") this.closeResetModal();

      if (e.key === "Enter")
        document.getElementById("confirm-settings-reset")?.click();
    });

    this.initResetModalEvents();

    window.addEventListener("resize", () => {
      this.syncThemeControls(localStorage.getItem("theme") || "light");
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

      btnDark.classList.replace(
        "text-secondary",
        "text-(--color-btn-primary-text)",
      );
      btnLight.classList.replace(
        "text-(--color-btn-primary-text)",
        "text-secondary",
      );
    } else {
      if (isDesktop) {
        indicator.classList.add("xs:translate-x-0");
      } else {
        indicator.classList.add("translate-y-0");
      }

      btnLight.classList.replace(
        "text-secondary",
        "text-(--color-btn-primary-text)",
      );
      btnDark.classList.replace(
        "text-(--color-btn-primary-text)",
        "text-secondary",
      );
    }
  },

  handleThemeSwitch(targetTheme) {
    const currentTheme = localStorage.getItem("theme") || "light";
    if (currentTheme === targetTheme) return;

    document.getElementById("theme-toggle")?.click();
    this.syncThemeControls(targetTheme);

    const indicator = document.getElementById("theme-tab-indicator");
    const btnLight = document.getElementById("sett-theme-light");
    const btnDark = document.getElementById("sett-theme-dark");

    const isDesktop = window.screen.availWidth >= 375;

    if (indicator && btnLight && btnDark) {
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

        btnDark.classList.replace(
          "text-secondary",
          "text-(--color-btn-primary-text)",
        );
        btnLight.classList.replace(
          "text-(--color-btn-primary-text)",
          "text-secondary",
        );
      } else {
        if (isDesktop) {
          indicator.classList.add("xs:translate-x-0");
        } else {
          indicator.classList.add("translate-y-0");
        }

        btnLight.classList.replace(
          "text-secondary",
          "text-(--color-btn-primary-text)",
        );
        btnDark.classList.replace(
          "text-(--color-btn-primary-text)",
          "text-secondary",
        );
      }
    }
  },

  handleDataExport(format = "json") {
    const localData = JSON.parse(localStorage.getItem(HABIT_NAMESPACE));
    const habits = localData?.habits || [];

    if (habits.length === 0) {
      NotificationService.show({
        type: "info",
        message: "There is no data to export.",
        icon: "fa-circle-info",
        iconColor: "text-brand/80",
        duration: 5000,
      });
      return;
    }

    let fileContent = "";
    let fileName = "";
    let contentType = "";

    const dateStr = formatDate(new Date());

    if (format === "json") {
      fileContent = JSON.stringify(habits, null, 2);
      fileName = `Habits_Backup_${dateStr}_v${STORAGE_VERSION}.json`;
      contentType = "application/json";
    } else if (format === "markdown") {
      fileContent = `# 📊 Habit Tracker Workspace Progress Report\n\nGenerated: ${new Date().toLocaleDateString()}\n\n---\n\n`;
      habits.forEach((habit) => {
        fileContent += `## #️⃣ ${habit.id}\n`;
        fileContent += `## 🎯 ${habit.name}\n`;
        fileContent += `- **Category:** 📁 ${habit.category}\n`;
        fileContent += `- **Frequency:** 📅 ${habit.frequency} days/wk\n`;
        fileContent += `- **Created At:** ⏰ ${habit.createdAt}\n`;
        fileContent += `- **Status:** ${habit.archived ? "📦 Archived" : "⚡ Active"}\n\n`;
        fileContent += `### 📅 Completion History\n`;
        if (!habit.completedDates || habit.completedDates.length === 0)
          fileContent += `_No check-ins recorded yet._\n\n`;
        else {
          habit.completedDates.forEach((d) => {
            fileContent += `- [x] ${d}\n`;
          });
          fileContent += `\n`;
        }
        fileContent += `### 🕒 Skipped Dates\n`;
        if (!habit.skippedDates || habit.skippedDates.length === 0) {
          fileContent += `_No skipped dates recorded yet._\n\n`;
        } else {
          habit.skippedDates.forEach((d) => {
            fileContent += `- [x] ${d}\n`;
          });
          fileContent += `\n`;
        }
        fileContent += `---\n\n`;
      });
      fileName = `Habits_Backup_${dateStr}_v${STORAGE_VERSION}.md`;
      contentType = "text/markdown";
    } else if (format === "notion") {
      const escapeCsvValue = (value) => {
        const text = value == null ? "" : String(value);
        return `"${text.replace(/"/g, '""')}"`;
      };

      const headers = [
        "Id",
        "Name",
        "Category",
        "Frequency",
        "Created At",
        "Archived",
        "Completed Dates",
        "Skipped Dates",
        "Best Streak",
        "Allowed Skips/Month",
      ];

      const rows = habits.map((h) => [
        escapeCsvValue(h.id),
        escapeCsvValue(h.name),
        escapeCsvValue(h.category),
        escapeCsvValue(h.frequency),
        escapeCsvValue(h.createdAt),
        escapeCsvValue(h.archived ? "Archived" : "Active"),
        escapeCsvValue((h.completedDates || []).join(";")),
        escapeCsvValue((h.skippedDates || []).join(";")),
      ]);

      fileContent = [headers.join(","), ...rows.map((e) => e.join(","))].join(
        "\n",
      );
      fileName = `Habits_Backup_${dateStr}_v${STORAGE_VERSION}.csv`;
      contentType = "text/csv;charset=utf-8;";
    }

    const blob = new Blob([fileContent], { type: contentType });
    const downloadAnchor = document.createElement("a");
    downloadAnchor.href = URL.createObjectURL(blob);
    downloadAnchor.download = fileName;
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    URL.revokeObjectURL(downloadAnchor.href);

    NotificationService.show({
      type: "success",
      message: `Database layer exported successfully as ${format.toUpperCase()}.`,
      icon: "fa-file-arrow-down",
      iconColor: "text-emerald-500/80",
      duration: 5000,
    });
  },

  initImportDropzone() {
    const dropzone = document.getElementById("sett-dropzone");
    const fileInput = document.getElementById("sett-import-file");

    dropzone?.addEventListener("click", () => fileInput?.click());

    dropzone?.addEventListener("dragover", (e) => {
      e.preventDefault();
      dropzone.classList.add("border-brand/80", "bg-brand/5");
    });

    ["dragleave", "drop"].forEach((event) => {
      dropzone?.addEventListener(event, () => {
        dropzone.classList.remove("border-brand/80", "bg-brand/5");
      });
    });

    dropzone?.addEventListener("drop", (e) => {
      e.preventDefault();
      const files = e.dataTransfer.files;
      if (files.length) this.processImportedFile(files[0]);
    });

    fileInput?.addEventListener("change", (e) => {
      if (e.target.files.length) this.processImportedFile(e.target.files[0]);

      setTimeout(() => {
        StateController.execute();
        this.runAutoArchivePipeline();
        this.resetSession();
      }, 200);
    });
  },

  _parseMarkdownToHabits(text) {
    const habits = [];
    const blockRegex =
      /## #️⃣ ([^\n]+)\n## 🎯 ([^\n]+)\n([\s\S]*?)(?=\n## #️⃣ |\n*$)/g;

    let match;
    while ((match = blockRegex.exec(text)) !== null) {
      const [, id, name, block] = match;
      const lines = block
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean);

      let category = "General";
      let frequency = 7;
      let createdAt = formatDate(new Date());
      let archived = false;
      const completedDates = [];
      const skippedDates = [];

      let currentSection = "completed";

      lines.forEach((line) => {
        if (line === "### 📅 Completion History") {
          currentSection = "completed";
          return;
        }

        if (line === "### 🕒 Skipped Dates") {
          currentSection = "skipped";
          return;
        }

        if (line.includes("- **Category:**")) {
          category = line.split("📁 ")[1]?.trim() || "General";
        } else if (line.includes("- **Frequency:**")) {
          frequency = parseInt(line.split("📅 ")[1]) || 7;
        } else if (line.includes("- **Created At:**")) {
          createdAt = line.split("⏰ ")[1]?.trim() || formatDate(new Date());
        } else if (line.includes("- **Status:**")) {
          archived = line.includes("📦 Archived");
        } else if (/^- \[[ xX]\]/.test(line)) {
          const date = line.replace(/^- \[[ xX]\]\s*/, "").trim();
          if (!date) return;

          if (currentSection === "skipped") skippedDates.push(date);
          else completedDates.push(date);
        }
      });

      habits.push({
        id,
        name,
        category,
        frequency,
        createdAt,
        archived,
        completedDates,
        skippedDates,
      });
    }

    return habits;
  },

  _parseCSVToHabits(text) {
    const lines = text
      .split("\n")
      .map((l) => l.trim())
      .filter((l) => l.length > 0);
    if (lines.length <= 1) return [];

    const habits = lines
      .slice(1)
      .map((line) => {
        const matches =
          line.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g) || line.split(",");
        if (matches.length < 5) return null;

        const id = matches[0].replace(/^"|"$/g, "");
        const name = matches[1].replace(/^"|"$/g, "").replace(/""/g, '"');
        const category = matches[2].replace(/^"|"$/g, "");
        const frequency = parseInt(matches[3]) || 7;
        const createdAt = matches[4]
          ? matches[4].replace(/^"|"$/g, "")
          : formatDate(new Date());
        const archived = matches[5].replace(/^"|"$/g, "") === "Archived";
        const completedDates = matches[6]
          ? matches[6]
              .replace(/^"|"$/g, "")
              .split(";")
              .map((d) => d.trim())
              .filter((d) => d.length > 0)
          : [];
        const skippedDates = matches[7]
          ? matches[7]
              .replace(/^"|"$/g, "")
              .split(";")
              .map((d) => d.trim())
              .filter((d) => d.length > 0)
          : [];

        return {
          id,
          name,
          category,
          frequency,
          createdAt,
          archived,
          completedDates,
          skippedDates,
        };
      })
      .filter((h) => h !== null);

    return habits;
  },

  processImportedFile(file) {
    const fileName = file.name.toLowerCase();
    let format = "";

    if (file.type === "application/json" || fileName.endsWith(".json"))
      format = "json";
    else if (fileName.endsWith(".md") || fileName.endsWith(".markdown"))
      format = "markdown";
    else if (file.type === "text/csv" || fileName.endsWith(".csv"))
      format = "csv";
    else {
      NotificationService.show({
        type: "error",
        message:
          "Invalid format! Only structural JSON, MD, or CSV files are permitted.",
        icon: "fa-circle-xmark",
        iconColor: "text-red-500/80",
        duration: 5000,
      });
      return;
    }

    const reader = new FileReader();
    reader.addEventListener("load", async (event) => {
      GlobalLoaderService.show(
        `Parsing storage integrity from ${format.toUpperCase()}...`,
      );

      setTimeout(async () => {
        try {
          const rawContent = event.target.result;
          let importedHabits = [];

          if (format === "json") {
            const parsedJson = JSON.parse(rawContent);
            importedHabits = Array.isArray(parsedJson)
              ? parsedJson
              : parsedJson.habits || [];
          } else if (format === "markdown")
            importedHabits = this._parseMarkdownToHabits(rawContent);
          else if (format === "csv")
            importedHabits = this._parseCSVToHabits(rawContent);

          if (!Array.isArray(importedHabits) || importedHabits.length === 0)
            throw new Error("No structured data could be extracted.");

          const parsedData = {
            version: STORAGE_VERSION,
            habits: importedHabits,
          };

          localStorage.setItem(STORAGE_KEY, JSON.stringify(parsedData));
          StateManager.save(parsedData.habits);

          state.activeTab = "active";
          state.currentView = "habits";
          state.currentCategory = "all";

          const { renderHabitList } =
            await import("@/views/habits/habit-list.renderer.js");
          renderHabitList(StateManager.getFilteredHabits(), state.activeTab);

          HabitController.refreshUI();

          NotificationService.show({
            type: "success",
            message: `Data ledger parsed and synchronized from ${format.toUpperCase()} file.`,
            icon: "fa-circle-check",
            iconColor: "text-emerald-500/80",
            duration: 5000,
          });
        } catch (err) {
          console.error("Parser failure:", err);
          NotificationService.show({
            type: "error",
            message: "Failed to parse structural integrity of the file.",
            icon: "fa-triangle-exclamation",
            iconColor: "text-red-500/80",
            duration: 5000,
          });
        } finally {
          GlobalLoaderService.hide();
        }
      }, 50);
    });

    reader.readAsText(file);
  },

  async handleDataSeeding() {
    const seedBtn = document.getElementById("sett-seed-btn");
    const seedIcon = document.getElementById("sett-seed-icon");
    const seedSpinner = document.getElementById("sett-seed-spinner");
    const seedText = document.getElementById("sett-seed-text");

    const mockDataCount = Math.floor(Math.random() * 100);

    if (seedBtn) seedBtn.disabled = true;
    if (seedIcon) seedIcon.classList.replace("flex", "hidden");
    if (seedSpinner) seedSpinner.classList.replace("hidden", "flex");
    if (seedText)
      seedText.textContent = "Processing & Constructing Database Layers...";

    NotificationService.show({
      type: "info",
      message: `Initiating massive ${mockDataCount}-habit matrix calculation...`,
      icon: "fa-gears",
      iconColor: "text-brand/80",
      duration: 5000,
    });

    setTimeout(() => {
      StateController.execute();
      this.runAutoArchivePipeline();
      this.resetSession();
    }, 200);

    setTimeout(async () => {
      try {
        const dynamicMockData = generateDynamicMockData(mockDataCount);

        StateManager.save(dynamicMockData.habits);

        state.activeTab = "active";
        state.currentView = "habits";
        state.currentCategory = "all";

        const { renderHabitList } =
          await import("@/views/habits/habit-list.renderer.js");
        renderHabitList(StateManager.getFilteredHabits(), state.activeTab);
        HabitController.refreshUI();

        setTimeout(() => {
          NotificationService.show({
            type: "success",
            message: `Sandbox environment populated with ${mockDataCount} edge-case routine logs.`,
            icon: "fa-circle-check",
            iconColor: "text-emerald-500/80",
            duration: 5000,
          });

          if (seedBtn) seedBtn.disabled = false;
          if (seedIcon) seedIcon.classList.replace("hidden", "flex");
          if (seedSpinner) seedSpinner.classList.replace("flex", "hidden");
          if (seedText) seedText.textContent = "Seed Historical Mock Data";
        }, 200);
      } catch (error) {
        console.error("Critical fault inside seeding controller:", error);

        if (seedBtn) seedBtn.disabled = false;
        if (seedIcon) seedIcon.classList.replace("hidden", "flex");
        if (seedSpinner) seedSpinner.classList.replace("flex", "hidden");

        NotificationService.show({
          type: "error",
          message: error.message || "Fail-Safe Trigger: Retry Seeding",
          icon: "fa-circle-exclamation",
          iconColor: "text-red-500/80",
          duration: 5000,
        });
      }
    }, 60);
  },

  resetSession() {
    StateManager.init();
    HabitController.refreshUI();
  },

  syncAutoArchiveToggle() {
    const current = localStorage.getItem("sett_auto_archive") === "true";
    const toggleBtn = document.getElementById("sett-auto-archive-toggle");
    const toggleDot = document.getElementById("sett-auto-archive-dot");

    if (current) {
      toggleBtn?.classList.replace("bg-neutral-300/80", "bg-brand/80");
      toggleBtn?.classList.replace(
        "dark:bg-neutral-700/80",
        "dark:bg-brand/80",
      );
      toggleDot?.classList.replace("translate-x-0", "translate-x-5");
    } else {
      toggleBtn?.classList.replace("bg-brand/80", "bg-neutral-300/80");
      toggleBtn?.classList.replace(
        "dark:bg-brand/80",
        "dark:bg-neutral-700/80",
      );
      toggleDot?.classList.replace("translate-x-5", "translate-x-0");
    }
  },

  handleAutoArchiveToggle() {
    const current = localStorage.getItem("sett_auto_archive") === "true";
    const nextState = !current;
    localStorage.setItem("sett_auto_archive", nextState ? "true" : "false");

    const toggleBtn = document.getElementById("sett-auto-archive-toggle");
    const toggleDot = document.getElementById("sett-auto-archive-dot");

    if (nextState) {
      toggleBtn?.classList.replace("bg-neutral-300/80", "bg-brand/80");
      toggleBtn?.classList.replace(
        "dark:bg-neutral-700/80",
        "dark:bg-brand/80",
      );
      toggleDot?.classList.replace("translate-x-0", "translate-x-5");
    } else {
      toggleBtn?.classList.replace("bg-brand/80", "bg-neutral-300/80");
      toggleBtn?.classList.replace(
        "dark:bg-brand/80",
        "dark:bg-neutral-700/80",
      );
      toggleDot?.classList.replace("translate-x-5", "translate-x-0");
    }

    NotificationService.show({
      type: "info",
      message: `Autonomous archiving pipeline has been ${nextState ? "activated" : "deactivated"}.`,
      icon: "fa-robot",
      iconColor: "text-brand/80",
      duration: 5000,
    });

    if (nextState) this.runAutoArchivePipeline();
  },

  runAutoArchivePipeline() {
    if (localStorage.getItem("sett_auto_archive") !== "true") return;

    const habits = StateManager.getHabits() || [];
    if (habits.length === 0) return;

    let modified = false;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayTimestamp = today.getTime();

    habits.forEach((habit) => {
      if (habit.archived === true) return;

      const allActivityDates = [...(habit.completedDates || [])];

      let lastActivityDateStr = habit.createdAt;

      if (allActivityDates.length > 0) {
        allActivityDates.sort();
        lastActivityDateStr = allActivityDates[allActivityDates.length - 1];
      }

      const lastActivityDate = new Date(lastActivityDateStr);
      lastActivityDate.setHours(0, 0, 0, 0);
      const lastActivityTimestamp = lastActivityDate.getTime();

      const msDiff = todayTimestamp - lastActivityTimestamp;
      const daysDiff = Math.floor(msDiff / (1000 * 60 * 60 * 24));

      if (daysDiff >= 30) {
        habit.archived = true;
        modified = true;
      }
    });

    if (modified) {
      StateManager.save(habits);

      HabitController.refreshUI();

      NotificationService.show({
        type: "info",
        message:
          "Stale habits exceeding 30 days structural limits auto-archived.",
        icon: "fa-box-archive",
        iconColor: "text-brand/80",
        duration: 5000,
      });
    }
  },

  closeResetModal() {
    const resetModal = document.getElementById("settings-reset-modal");
    if (!resetModal) return;

    resetModal.classList.add("hidden");
    resetModal.classList.remove("flex");

    document.body.classList.remove("overflow-hidden");
  },

  initResetModalEvents() {
    const triggerResetBtn = document.getElementById("trigger-reset-btn");
    const resetModal = document.getElementById("settings-reset-modal");
    const cancelResetBtn = document.getElementById("cancel-settings-reset");
    const confirmResetBtn = document.getElementById("confirm-settings-reset");

    triggerResetBtn?.addEventListener("click", () => {
      resetModal?.classList.replace("hidden", "flex");
      document.body.classList.add("overflow-hidden");
    });
    cancelResetBtn?.addEventListener("click", () => this.closeResetModal());

    confirmResetBtn?.addEventListener("click", () => {
      this.closeResetModal();
      this.executeApplicationReset();
    });
  },

  async executeApplicationReset() {
    const previousHabits = StateManager.getHabits().map((habit) => ({
      ...habit,
    }));

    this.closeResetModal();

    GlobalLoaderService.show("Purging storage layers & resetting workspace...");

    setTimeout(async () => {
      try {
        clearHabitStorage();

        state.habits = [];
        state.activeTab = "active";
        state.currentView = "habits";
        state.currentCategory = "all";

        const { renderHabitList } =
          await import("@/views/habits/habit-list.renderer.js");
        renderHabitList([], state.activeTab);

        HabitController.refreshUI();

        NotificationService.show({
          type: "error",
          message:
            "Application synchronization storage has been completely cleared.",
          duration: 5000,
          undoAction: async () => {
            GlobalLoaderService.show(
              "Re-instating application database state...",
            );
            setTimeout(async () => {
              try {
                saveToStorage(previousHabits);

                StateManager.save(previousHabits || []);
                state.habits = previousHabits || [];

                state.activeTab = "active";
                state.currentView = "habits";
                state.currentCategory = "all";

                const { renderHabitList: reloadList } =
                  await import("@/views/habits/habit-list.renderer.js");
                reloadList(StateManager.getFilteredHabits(), state.activeTab);
                HabitController.refreshUI();
              } finally {
                GlobalLoaderService.hide();
              }
            }, 30);
          },
        });
      } finally {
        GlobalLoaderService.hide();
      }
    }, 50);
  },
};
