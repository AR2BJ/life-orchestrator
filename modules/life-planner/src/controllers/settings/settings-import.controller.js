import { StateManager, state } from "@/models/state.model.js";
import { generateId, todayISO } from "@/utils/helpers";

import { GlobalLoaderService } from "@/services/loader.service";
import { NotificationService } from "@/services/notification.service.js";
import { PlannerController } from "../planner.controller.js";

export const SettingsImportController = {
  init() {
    this.initImportDropzone();
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
    });
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
          "Invalid format! Only structural JSON, MD, or CSV files are permitted",
        icon: "ti-circle-x",
        iconColor: "text-red-500/80",
        duration: 5000,
      });
      return;
    }

    const reader = new FileReader();
    reader.addEventListener("load", (event) => {
      GlobalLoaderService.show(
        `Parsing storage integrity from ${format.toUpperCase()}...`,
      );

      setTimeout(() => {
        try {
          const rawContent = event.target.result;
          let importedPlans = [];
          let importedLogs = [];
          let importedTemplates = [];

          if (format === "json") {
            const parsedJson = JSON.parse(rawContent);
            importedPlans = parsedJson.plans || [];
            importedLogs = parsedJson.logs || [];
            importedTemplates = parsedJson.templates || [];
          } else if (format === "markdown") {
            const parsedMd = this.parseMarkdownToData(rawContent);
            importedPlans = parsedMd.plans;
            importedLogs = parsedMd.logs;
            importedTemplates = parsedMd.templates;
          } else if (format === "csv") {
            const parsedCsv = this.parseCsvToData(rawContent);
            importedPlans = parsedCsv.plans;
            importedLogs = parsedCsv.logs;
            importedTemplates = parsedCsv.templates;
          }

          if (
            importedPlans.length === 0 &&
            importedLogs.length === 0 &&
            importedTemplates.length === 0
          ) {
            throw new Error("No structured data could be extracted");
          }

          StateManager.save({
            plans: importedPlans,
            logs: importedLogs,
            templates: importedTemplates,
          });

          state.activeTab = "plans";
          state.currentView = "planner";

          PlannerController.refreshUI();

          NotificationService.show({
            type: "success",
            message: `Data ledger parsed and synchronized from ${format.toUpperCase()} file`,
            icon: "ti-circle-check",
            iconColor: "text-emerald-500/80",
            duration: 5000,
          });
        } catch (err) {
          console.error("Parser failure:", err);
          NotificationService.show({
            type: "error",
            message: "Failed to parse structural integrity of the file",
            icon: "ti-alert-triangle",
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

  parseMarkdownToData(mdContent) {
    const templates = [];
    const plans = [];
    const logs = [];

    // 1. PARSE TEMPLATES
    const tplSection = mdContent
      .split(/## 📋 TEMPLATES REGISTRY/)[1]
      ?.split(/## 🎯 PLANS LIST/)[0];
    if (tplSection) {
      const tplBlocks = tplSection.split(/### 📄 /).slice(1);
      tplBlocks.forEach((block) => {
        const titleIdMatch = block.match(/(.+)\s*\(ID:\s*(.+)\)/);
        const areaMatch = block.match(/- \*\*Life Area:\*\*\s*(.+)/);
        const favMatch = block.match(/- \*\*Favorite:\*\*\s*(.+)/);
        const usageMatch = block.match(/- \*\*Usage Count:\*\*\s*(\d+)/);
        const descMatch = block.match(/- \*\*Description:\*\*\s*(.+)/);
        const baselineMatch = block.match(/- \*\*Baseline:\*\*\s*(.+)/);
        const optimalMatch = block.match(/- \*\*Optimal:\*\*\s*(.+)/);

        if (titleIdMatch) {
          templates.push({
            id: titleIdMatch[2].trim(),
            title: titleIdMatch[1].trim(),
            lifeAreaId: areaMatch ? areaMatch[1].trim() : "productivity",
            isFavorite: favMatch ? favMatch[1].includes("Yes") : false,
            usageCount: usageMatch ? parseInt(usageMatch[1], 10) : 0,
            description:
              descMatch && descMatch[1] !== "N/A" ? descMatch[1].trim() : "",
            baseline:
              baselineMatch && baselineMatch[1] !== "N/A"
                ? baselineMatch[1].trim()
                : "",
            optimal:
              optimalMatch && optimalMatch[1] !== "N/A"
                ? optimalMatch[1].trim()
                : "",
          });
        }
      });
    }

    // 2. PARSE PLANS
    const planSection = mdContent
      .split(/## 🎯 PLANS LIST/)[1]
      ?.split(/## 📝 LOGS REGISTRY/)[0];
    if (planSection) {
      const planBlocks = planSection.split(/### 📌 /).slice(1);
      planBlocks.forEach((block) => {
        const titleIdMatch = block.match(/(.+)\s*\(ID:\s*(.+)\)/);
        const areaMatch = block.match(/- \*\*Life Area:\*\*\s*(.+)/);
        const stateMatch = block.match(/- \*\*State:\*\*\s*(.+)/);
        const startMatch = block.match(/- \*\*Start Date:\*\*\s*📅\s*(.+)/);
        const endMatch = block.match(/- \*\*End Date:\*\*\s*📅\s*(.+)/);
        const descMatch = block.match(/- \*\*Description:\*\*\s*(.+)/);

        const objectives = [];
        const objLines = block.match(
          /- \[(x| )\] (.+)\(ID: (.+)\) \| Type: (.+) \| Target: (\d+) (.+) \| Current: (\d+)/g,
        );
        if (objLines) {
          objLines.forEach((line) => {
            const m = line.match(
              /- \[(x| )\] (.+)\(ID: (.+)\) \| Type: (.+) \| Target: (\d+) (.+) \| Current: (\d+)/,
            );
            if (m) {
              objectives.push({
                completed: m[1] === "x",
                title: m[2].trim(),
                id: m[3].trim(),
                type: m[4].trim(),
                targetValue: Number(m[5]),
                unit: m[6].trim(),
                currentValue: Number(m[7]),
              });
            }
          });
        }

        if (titleIdMatch) {
          plans.push({
            id: titleIdMatch[2].trim(),
            title: titleIdMatch[1].trim(),
            lifeAreaId: areaMatch ? areaMatch[1].trim() : "productivity",
            state: stateMatch ? stateMatch[1].trim() : "active",
            period: {
              startDate:
                startMatch && startMatch[1] !== "N/A"
                  ? startMatch[1].trim()
                  : todayISO(),
              endDate:
                endMatch && endMatch[1] !== "None" ? endMatch[1].trim() : null,
            },
            description:
              descMatch && descMatch[1] !== "N/A" ? descMatch[1].trim() : "",
            objectives,
          });
        }
      });
    }

    // 3. PARSE LOGS
    const logSection = mdContent.split(/## 📝 LOGS REGISTRY/)[1];
    if (logSection) {
      const logBlocks = logSection.split(/### 📔 /).slice(1);
      logBlocks.forEach((block) => {
        const titleIdMatch = block.match(/(.+)\s*\(ID:\s*(.+)\)/);
        const dateMatch = block.match(/- \*\*Date:\*\*\s*📅\s*(.+)/);
        const planIdMatch = block.match(/- \*\*Plan ID:\*\*\s*(.+)/);
        const energyMatch = block.match(/- \*\*Energy Level:\*\*\s*⚡\s*(\d+)/);
        const moodMatch = block.match(/- \*\*Mood:\*\*\s*🎭\s*(.+)/);
        const descMatch = block.match(/- \*\*Description:\*\*\s*(.+)/);
        const metricsMatch = block.match(/- \*\*Metrics:\*\*\s*(.+)/);

        if (titleIdMatch) {
          let parsedMetrics = {};
          try {
            if (metricsMatch)
              parsedMetrics = JSON.parse(metricsMatch[1].trim());
          } catch (e) {}

          logs.push({
            id: titleIdMatch[2].trim(),
            title: titleIdMatch[1].trim(),
            date: dateMatch ? dateMatch[1].trim() : todayISO(),
            planId:
              planIdMatch && planIdMatch[1] !== "None"
                ? planIdMatch[1].trim()
                : null,
            energy: energyMatch ? parseInt(energyMatch[1], 10) : 3,
            mood: moodMatch ? moodMatch[1].trim() : "neutral",
            description:
              descMatch && descMatch[1] !== "N/A" ? descMatch[1].trim() : "",
            metrics: parsedMetrics,
          });
        }
      });
    }

    return { plans, logs, templates };
  },

  parseCsvToData(csvContent) {
    const templates = [];
    const plans = [];
    const logs = [];

    const parseCsvLine = (text) => {
      const result = [];
      let cur = "";
      let inQuotes = false;

      for (let i = 0; i < text.length; i++) {
        const c = text[i];
        if (c === '"') {
          if (inQuotes && text[i + 1] === '"') {
            cur += '"';
            i++;
          } else {
            inQuotes = !inQuotes;
          }
        } else if (c === "," && !inQuotes) {
          result.push(cur);
          cur = "";
        } else {
          cur += c;
        }
      }
      result.push(cur);
      return result;
    };

    const lines = csvContent.split(/\r?\n/);
    let currentSection = "PLANS";

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line || line.startsWith("#")) continue;

      if (line === "[TEMPLATES]") {
        currentSection = "TEMPLATES";
        continue;
      } else if (line === "[PLANS]") {
        currentSection = "PLANS";
        continue;
      } else if (line === "[LOGS]") {
        currentSection = "LOGS";
        continue;
      }

      const cols = parseCsvLine(line);

      if (currentSection === "TEMPLATES") {
        if (cols[0] === "Id" && cols[1] === "Title") continue;
        if (cols.length >= 2 && cols[0]) {
          templates.push({
            id: cols[0],
            title: cols[1],
            description: cols[2] || "",
            lifeAreaId: cols[3] || "productivity",
            baseline: cols[4] || "",
            optimal: cols[5] || "",
            isFavorite: cols[6] === "Yes",
            usageCount: Number(cols[7]) || 0,
            createdAt: cols[8] || todayISO(),
            updatedAt: cols[9] || todayISO(),
          });
        }
      } else if (currentSection === "PLANS") {
        if (cols[0] === "Id" && cols[1] === "Title") continue;
        if (cols.length >= 2 && cols[0]) {
          const [
            id,
            title,
            description,
            lifeAreaId,
            state,
            startDate,
            endDate,
            createdAt,
            updatedAt,
            objsRaw,
          ] = cols;

          const objectives = [];
          if (objsRaw) {
            const items = objsRaw.split(" | ");
            items.forEach((item) => {
              const m = item.match(
                /^\[([X ])\]\s*([^(]+?)\s*\(ID:\s*([^)]+)\)\s*\{type:(.+),\s*target:(.+),\s*current:(.+),\s*unit:(.+)\}$/,
              );
              if (m) {
                objectives.push({
                  completed: m[1] === "X",
                  title: m[2].trim(),
                  id: m[3].trim(),
                  type: m[4].trim(),
                  targetValue: Number(m[5]),
                  currentValue: Number(m[6]),
                  unit: m[7].trim(),
                });
              }
            });
          }

          plans.push({
            id: id || generateId(),
            title: title || "Untitled Plan",
            description: description || "",
            lifeAreaId: lifeAreaId || "productivity",
            state: state || "active",
            period: {
              startDate: startDate || todayISO(),
              endDate: endDate || null,
            },
            createdAt: createdAt || todayISO(),
            updatedAt: updatedAt || todayISO(),
            objectives,
          });
        }
      } else if (currentSection === "LOGS") {
        if (cols[0] === "Id" && cols[1] === "Title") continue;
        if (cols.length >= 2 && cols[0]) {
          const [
            id,
            title,
            description,
            date,
            planId,
            energy,
            mood,
            metricsRaw,
            createdAt,
            updatedAt,
          ] = cols;

          let metrics = {};
          try {
            if (metricsRaw) metrics = JSON.parse(metricsRaw);
          } catch (e) {}

          logs.push({
            id: id || generateId(),
            title: title || "Untitled Log",
            description: description || "",
            date: date || todayISO(),
            planId: planId || null,
            energy: Number(energy) || 3,
            mood: mood || "neutral",
            metrics,
            createdAt: createdAt || todayISO(),
            updatedAt: updatedAt || todayISO(),
          });
        }
      }
    }

    return { plans, logs, templates };
  },
};
