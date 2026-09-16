import { PLAN_NAMESPACE, STORAGE_VERSION } from "@/models/storage.model.js";
import { formatDate, todayISO } from "@/utils/helpers";

import { CoreStore } from "@life-orchestrator/core-store";
import { NotificationService } from "@/services/notification.service.js";

export const SettingsExportController = {
  handleDataExport(format = "json") {
    const rawData = CoreStore.getNamespace(PLAN_NAMESPACE);
    const localData = rawData ? JSON.parse(rawData) : {};

    const plans = localData?.plans || [];
    const logs = localData?.logs || [];
    const templates = localData?.templates || [];

    if (plans.length === 0 && logs.length === 0 && templates.length === 0) {
      NotificationService.show({
        type: "info",
        message: "There is no data to export",
        icon: "fa-circle-info",
        iconColor: "text-sky-500/80",
        duration: 5000,
      });
      return;
    }

    let fileContent = "";
    let fileName = "";
    let contentType = "";

    const dateStr = formatDate(new Date());

    if (format === "json") {
      fileContent = JSON.stringify(localData, null, 2);
      fileName = `Planner_Backup_${dateStr}_v${STORAGE_VERSION}.json`;
      contentType = "application/json";
    } else if (format === "markdown") {
      fileContent = this.generateMarkdownExport(plans, logs, templates);
      fileName = `Planner_Backup_${dateStr}_v${STORAGE_VERSION}.md`;
      contentType = "text/markdown";
    } else if (format === "csv") {
      fileContent = this.generateCsvExport(plans, logs, templates);
      fileName = `Planner_Backup_${dateStr}_v${STORAGE_VERSION}.csv`;
      contentType = "text/csv;charset=utf-8;";
    }

    this.downloadFile(fileContent, fileName, contentType);

    NotificationService.show({
      type: "success",
      message: `Database layer exported successfully as ${format.toUpperCase()}`,
      icon: "fa-file-arrow-down",
      iconColor: "text-emerald-500/80",
      duration: 5000,
    });
  },

  generateMarkdownExport(plans, logs, templates) {
    let content = `# 📊 Life Planner Workspace Report \n\n **Export Date:** ${todayISO()} \n\n **Storage Version:** ${STORAGE_VERSION}\n\n`;

    // 1. TEMPLATES SECTION
    content += `---\n## 📋 TEMPLATES REGISTRY\n\n`;
    if (templates.length === 0) {
      content += `_No templates defined._\n\n`;
    } else {
      templates.forEach((tpl) => {
        content += `### 📄 ${tpl.title} (ID: ${tpl.id})\n`;
        content += `- **Life Area:** ${tpl.lifeAreaId || "productivity"}\n`;
        content += `- **Favorite:** ${tpl.isFavorite ? "⭐ Yes" : "No"}\n`;
        content += `- **Usage Count:** ${tpl.usageCount || 0}\n`;
        content += `- **Description:** ${tpl.description || "N/A"}\n`;
        content += `- **Baseline:** ${tpl.baseline || "N/A"}\n`;
        content += `- **Optimal:** ${tpl.optimal || "N/A"}\n`;
        content += `- **Created At:** ⏰ ${tpl.createdAt}\n\n`;
      });
    }

    // 2. PLANS SECTION
    content += `---\n## 🎯 PLANS LIST\n\n`;
    if (plans.length === 0) {
      content += `_No plans defined._\n\n`;
    } else {
      plans.forEach((plan) => {
        content += `### 📌 ${plan.title} (ID: ${plan.id})\n`;
        content += `- **Life Area:** ${plan.lifeAreaId || "productivity"}\n`;
        content += `- **State:** ${plan.state || "active"}\n`;
        content += `- **Start Date:** 📅 ${plan.period?.startDate || "N/A"}\n`;
        content += `- **End Date:** 📅 ${plan.period?.endDate || "None"}\n`;
        content += `- **Description:** ${plan.description || "N/A"}\n`;
        content += `- **Created At:** ⏰ ${plan.createdAt}\n\n`;

        content += `#### 🎯 Objectives (${(plan.objectives || []).filter((o) => o.completed).length}/${(plan.objectives || []).length})\n`;
        if (!plan.objectives || plan.objectives.length === 0) {
          content += `_No objectives defined._\n\n`;
        } else {
          plan.objectives.forEach((obj) => {
            content += `- [${obj.completed ? "x" : " "}] ${obj.title} (ID: ${obj.id}) | Type: ${obj.type} | Target: ${obj.targetValue} ${obj.unit} | Current: ${obj.currentValue}\n`;
          });
          content += `\n`;
        }
      });
    }

    // 3. LOGS SECTION
    content += `---\n## 📝 LOGS REGISTRY\n\n`;
    if (logs.length === 0) {
      content += `_No logs defined._\n\n`;
    } else {
      logs.forEach((log) => {
        content += `### 📔 ${log.title} (ID: ${log.id})\n`;
        content += `- **Date:** 📅 ${log.date}\n`;
        content += `- **Plan ID:** ${log.planId || "None"}\n`;
        content += `- **Energy Level:** ⚡ ${log.energy}/5\n`;
        content += `- **Mood:** 🎭 ${log.mood}\n`;
        content += `- **Description:** ${log.description || "N/A"}\n`;
        content += `- **Metrics:** ${JSON.stringify(log.metrics || {})}\n`;
        content += `- **Created At:** ⏰ ${log.createdAt}\n\n`;
      });
    }

    return content;
  },

  generateCsvExport(plans, logs, templates) {
    const escapeCsvValue = (value) => {
      const text = value == null ? "" : String(value);
      return `"${text.replace(/"/g, '""')}"`;
    };

    let content = `# VERSION: ${STORAGE_VERSION}\n`;

    // 1. TEMPLATES SECTION
    content += `[TEMPLATES]\n`;
    content += `Id,Title,Description,LifeAreaId,Baseline,Optimal,IsFavorite,UsageCount,CreatedAt,UpdatedAt\n`;
    templates.forEach((t) => {
      const row = [
        escapeCsvValue(t.id),
        escapeCsvValue(t.title),
        escapeCsvValue(t.description),
        escapeCsvValue(t.lifeAreaId),
        escapeCsvValue(t.baseline),
        escapeCsvValue(t.optimal),
        escapeCsvValue(t.isFavorite ? "Yes" : "No"),
        escapeCsvValue(t.usageCount),
        escapeCsvValue(t.createdAt),
        escapeCsvValue(t.updatedAt),
      ];
      content += row.join(",") + "\n";
    });

    // 2. PLANS SECTION
    content += `\n[PLANS]\n`;
    content += `Id,Title,Description,LifeAreaId,State,StartDate,EndDate,CreatedAt,UpdatedAt,Objectives\n`;
    plans.forEach((p) => {
      const objsSerialized = (p.objectives || [])
        .map(
          (o) =>
            `[${o.completed ? "X" : " "}] ${o.title} (ID: ${o.id}) {type:${o.type}, target:${o.targetValue}, current:${o.currentValue}, unit:${o.unit}}`,
        )
        .join(" | ");

      const row = [
        escapeCsvValue(p.id),
        escapeCsvValue(p.title),
        escapeCsvValue(p.description),
        escapeCsvValue(p.lifeAreaId),
        escapeCsvValue(p.state),
        escapeCsvValue(p.period?.startDate),
        escapeCsvValue(p.period?.endDate),
        escapeCsvValue(p.createdAt),
        escapeCsvValue(p.updatedAt),
        escapeCsvValue(objsSerialized),
      ];
      content += row.join(",") + "\n";
    });

    // 3. LOGS SECTION
    content += `\n[LOGS]\n`;
    content += `Id,Title,Description,Date,PlanId,Energy,Mood,Metrics,CreatedAt,UpdatedAt\n`;
    logs.forEach((l) => {
      const row = [
        escapeCsvValue(l.id),
        escapeCsvValue(l.title),
        escapeCsvValue(l.description),
        escapeCsvValue(l.date),
        escapeCsvValue(l.planId),
        escapeCsvValue(l.energy),
        escapeCsvValue(l.mood),
        escapeCsvValue(JSON.stringify(l.metrics || {})),
        escapeCsvValue(l.createdAt),
        escapeCsvValue(l.updatedAt),
      ];
      content += row.join(",") + "\n";
    });

    return content;
  },

  downloadFile(content, fileName, contentType) {
    const blob = new Blob([content], { type: contentType });
    const downloadAnchor = document.createElement("a");
    downloadAnchor.href = URL.createObjectURL(blob);
    downloadAnchor.download = fileName;
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    URL.revokeObjectURL(downloadAnchor.href);
  },
};
