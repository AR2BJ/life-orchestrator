import { STORAGE_KEY, STORAGE_VERSION } from "@/models/storage.model.js";
import { formatDate, todayISO } from "@/utils/helpers";

import { NotificationService } from "@/services/notification.service.js";

export const SettingsExportController = {
  handleDataExport(format = "json") {
    const rawData = localStorage.getItem(STORAGE_KEY);
    const localData = rawData ? JSON.parse(rawData) : {};

    const tags = localData?.tags || [];
    const notes = localData?.notes || [];
    const snippets = localData?.snippets || [];
    const bookmarks = localData?.bookmarks || [];
    const cheatsheets = localData?.cheatsheets || [];

    if (
      tags.length === 0 &&
      notes.length === 0 &&
      snippets.length === 0 &&
      bookmarks.length === 0 &&
      cheatsheets.length === 0
    ) {
      NotificationService.show({
        type: "info",
        message: "There is no data to export",
        icon: "ti-info-circle",
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
      fileName = `Mind_Backup_${dateStr}_v${STORAGE_VERSION}.json`;
      contentType = "application/json";
    } else if (format === "markdown") {
      fileContent = this.generateMarkdownExport(
        tags,
        notes,
        snippets,
        bookmarks,
        cheatsheets,
      );
      fileName = `Mind_Backup_${dateStr}_v${STORAGE_VERSION}.md`;
      contentType = "text/markdown";
    } else if (format === "csv") {
      fileContent = this.generateCsvExport(
        tags,
        notes,
        snippets,
        bookmarks,
        cheatsheets,
      );
      fileName = `Mind_Backup_${dateStr}_v${STORAGE_VERSION}.csv`;
      contentType = "text/csv;charset=utf-8;";
    }

    this.downloadFile(fileContent, fileName, contentType);

    NotificationService.show({
      type: "success",
      message: `Database layer exported successfully as ${format.toUpperCase()}`,
      icon: "ti-file-download",
      iconColor: "text-emerald-500/80",
      duration: 5000,
    });
  },

  generateMarkdownExport(tags, notes, snippets, bookmarks, cheatsheets) {
    let content = `# 📊 Mind Manager Workspace Report \n\n **Export Date:** ${todayISO()} \n\n **Storage Version:** ${STORAGE_VERSION}\n\n`;

    // 1. TAGS
    content += `## 🏷️ TAG REGISTRY\n\n`;
    if (tags.length === 0) {
      content += `_No tags defined._\n\n`;
    } else {
      tags.forEach((tag) => {
        content += `- Tag: ${tag.name} (ID: ${tag.id}) **Entity Type:** ${tag.entityType || "none"}\n`;
      });
      content += `\n`;
    }

    // 2. NOTES
    content += `---\n## 📝 NOTES REGISTRY\n\n`;
    if (notes.length === 0) {
      content += `_No notes defined._\n\n`;
    } else {
      notes.forEach((item) => {
        content += `### 📄 ${item.title} (ID: ${item.id})\n`;
        content += `- **Category:** ${item.category || "general"}\n`;
        content += `- **Pinned:** ${item.pinned ? "Yes" : "No"}\n`;
        content += `- **Tags:** ${(item.tagIds || []).join(", ") || "None"}\n`;
        content += `- **Created At:** ${item.createdAt || todayISO()}\n`;
        content += `- **Updated At:** ${item.updatedAt || todayISO()}\n\n`;
        content += `#### Content:\n\`\`\`markdown\n${item.content || ""}\n\`\`\`\n\n`;
      });
    }

    // 3. SNIPPETS
    content += `---\n## 💻 SNIPPETS REGISTRY\n\n`;
    if (snippets.length === 0) {
      content += `_No code snippets defined._\n\n`;
    } else {
      snippets.forEach((item) => {
        const lang = item.category || "text";
        content += `### 📄 ${item.title} (ID: ${item.id})\n`;
        content += `- **Category:** ${lang}\n`;
        content += `- **Pinned:** ${item.pinned ? "Yes" : "No"}\n`;
        content += `- **Description:** ${item.description || "N/A"}\n`;
        content += `- **Tags:** ${(item.tagIds || []).join(", ") || "None"}\n`;
        content += `- **Created At:** ${item.createdAt || todayISO()}\n`;
        content += `- **Updated At:** ${item.updatedAt || todayISO()}\n\n`;
        content += "```" + lang + "\n" + (item.code || "") + "\n```\n\n";
      });
    }

    // 4. BOOKMARKS
    content += `---\n## 🔖 BOOKMARKS REGISTRY\n\n`;
    if (bookmarks.length === 0) {
      content += `_No bookmarks defined._\n\n`;
    } else {
      bookmarks.forEach((item) => {
        content += `### 📌 ${item.title} (ID: ${item.id})\n`;
        content += `- **URL:** ${item.url || "N/A"}\n`;
        content += `- **Domain:** ${item.domain || "N/A"}\n`;
        content += `- **Category:** ${item.category || "general"}\n`;
        content += `- **Pinned:** ${item.pinned ? "Yes" : "No"}\n`;
        content += `- **Description:** ${item.description || "N/A"}\n`;
        content += `- **Tags:** ${(item.tagIds || []).join(", ") || "None"}\n`;
        content += `- **Created At:** ${item.createdAt || todayISO()}\n`;
        content += `- **Updated At:** ${item.updatedAt || todayISO()}\n\n`;
      });
    }

    // 5. CHEATSHEETS
    content += `---\n## ⚡ CHEATSHEETS REGISTRY\n\n`;
    if (cheatsheets.length === 0) {
      content += `_No cheatsheets defined._\n\n`;
    } else {
      cheatsheets.forEach((item) => {
        content += `### 📑 ${item.title} (ID: ${item.id})\n`;
        content += `- **Category:** ${item.category || "general"}\n`;
        content += `- **Pinned:** ${item.pinned ? "Yes" : "No"}\n`;
        content += `- **Description:** ${item.description || "N/A"}\n`;
        content += `- **Tags:** ${(item.tagIds || []).join(", ") || "None"}\n`;
        content += `- **Created At:** ${item.createdAt || todayISO()}\n`;
        content += `- **Updated At:** ${item.updatedAt || todayISO()}\n\n`;
        content += `#### Items:\n`;
        if (Array.isArray(item.items) && item.items.length > 0) {
          item.items.forEach((sub) => {
            const desc = sub.description ? ` | ${sub.description}` : "";
            content += `- **${sub.key}**: ${sub.value}${desc} (ID: ${sub.id})\n`;
          });
        } else {
          content += `_No items defined._\n`;
        }
        content += `\n`;
      });
    }

    return content;
  },

  generateCsvExport(tags, notes, snippets, bookmarks, cheatsheets) {
    const escapeCsvValue = (value) => {
      const text = value == null ? "" : String(value);
      return `"${text.replace(/"/g, '""')}"`;
    };

    let content = `# VERSION: ${STORAGE_VERSION}\n`;

    // 1. TAGS
    content += `[TAGS]\n`;
    content += `Id,Name,EntityType\n`;
    tags.forEach((t) => {
      content += `${escapeCsvValue(t.id)},${escapeCsvValue(t.name)},${escapeCsvValue(t.entityType)}\n`;
    });

    // 2. NOTES
    content += `\n[NOTES]\n`;
    content += `Id,Title,Content,Category,TagIds,Pinned,CreatedAt,UpdatedAt\n`;
    notes.forEach((n) => {
      const row = [
        escapeCsvValue(n.id),
        escapeCsvValue(n.title),
        escapeCsvValue(n.content),
        escapeCsvValue(n.category),
        escapeCsvValue(JSON.stringify(n.tagIds || [])),
        escapeCsvValue(n.pinned ? "Yes" : "No"),
        escapeCsvValue(n.createdAt),
        escapeCsvValue(n.updatedAt),
      ];
      content += row.join(",") + "\n";
    });

    // 3. SNIPPETS
    content += `\n[SNIPPETS]\n`;
    content += `Id,Title,Description,Code,Category,TagIds,Pinned,CreatedAt,UpdatedAt\n`;
    snippets.forEach((s) => {
      const row = [
        escapeCsvValue(s.id),
        escapeCsvValue(s.title),
        escapeCsvValue(s.description),
        escapeCsvValue(s.code),
        escapeCsvValue(s.category),
        escapeCsvValue(JSON.stringify(s.tagIds || [])),
        escapeCsvValue(s.pinned ? "Yes" : "No"),
        escapeCsvValue(s.createdAt),
        escapeCsvValue(s.updatedAt),
      ];
      content += row.join(",") + "\n";
    });

    // 4. BOOKMARKS
    content += `\n[BOOKMARKS]\n`;
    content += `Id,Title,Url,Domain,Description,Category,TagIds,Pinned,CreatedAt,UpdatedAt\n`;
    bookmarks.forEach((b) => {
      const row = [
        escapeCsvValue(b.id),
        escapeCsvValue(b.title),
        escapeCsvValue(b.url),
        escapeCsvValue(b.domain),
        escapeCsvValue(b.description),
        escapeCsvValue(b.category),
        escapeCsvValue(JSON.stringify(b.tagIds || [])),
        escapeCsvValue(b.pinned ? "Yes" : "No"),
        escapeCsvValue(b.createdAt),
        escapeCsvValue(b.updatedAt),
      ];
      content += row.join(",") + "\n";
    });

    // 5. CHEATSHEETS
    content += `\n[CHEATSHEETS]\n`;
    content += `Id,Title,Description,Category,Items,TagIds,Pinned,CreatedAt,UpdatedAt\n`;
    cheatsheets.forEach((c) => {
      const row = [
        escapeCsvValue(c.id),
        escapeCsvValue(c.title),
        escapeCsvValue(c.description),
        escapeCsvValue(c.category),
        escapeCsvValue(JSON.stringify(c.items || [])),
        escapeCsvValue(JSON.stringify(c.tagIds || [])),
        escapeCsvValue(c.pinned ? "Yes" : "No"),
        escapeCsvValue(c.createdAt),
        escapeCsvValue(c.updatedAt),
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
