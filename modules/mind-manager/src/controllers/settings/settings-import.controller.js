import { StateManager, state } from "@/models/state.model.js";
import {
  normalizeBookmark,
  normalizeCheatSheet,
  normalizeNote,
  normalizeSnippet,
  normalizeTag,
} from "@/models/storage.model.js";

import { GlobalLoaderService } from "@/services/loader.service";
import { MindController } from "../mind.controller.js";
import { NotificationService } from "@/services/notification.service.js";
import { SettingsTagController } from "./settings-tag.controller.js";
import { renderMindList } from "@/views/mind/mind-list.renderer.js";

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
          let importedTags = [];
          let importedNotes = [];
          let importedSnippets = [];
          let importedBookmarks = [];
          let importedCheatsheets = [];

          if (format === "json") {
            const parsedJson = JSON.parse(rawContent);
            importedTags = parsedJson.tags || [];
            importedNotes = parsedJson.notes || [];
            importedSnippets = parsedJson.snippets || [];
            importedBookmarks = parsedJson.bookmarks || [];
            importedCheatsheets = parsedJson.cheatsheets || [];
          } else if (format === "markdown") {
            const parsedMd = this.parseMarkdownToData(rawContent);
            importedTags = parsedMd.tags;
            importedNotes = parsedMd.notes;
            importedSnippets = parsedMd.snippets;
            importedBookmarks = parsedMd.bookmarks;
            importedCheatsheets = parsedMd.cheatsheets;
          } else if (format === "csv") {
            const parsedCsv = this.parseCsvToData(rawContent);
            importedTags = parsedCsv.tags;
            importedNotes = parsedCsv.notes;
            importedSnippets = parsedCsv.snippets;
            importedBookmarks = parsedCsv.bookmarks;
            importedCheatsheets = parsedCsv.cheatsheets;
          }

          if (
            importedTags.length === 0 &&
            importedNotes.length === 0 &&
            importedSnippets.length === 0 &&
            importedBookmarks.length === 0 &&
            importedCheatsheets.length === 0
          ) {
            throw new Error("No structured data could be extracted");
          }

          StateManager.save({
            tags: importedTags.map(normalizeTag),
            notes: importedNotes.map(normalizeNote),
            snippets: importedSnippets.map(normalizeSnippet),
            bookmarks: importedBookmarks.map(normalizeBookmark),
            cheatsheets: importedCheatsheets.map(normalizeCheatSheet),
          });

          state.activeTab = "notes";
          state.currentView = "mind";

          renderMindList(
            StateManager.getFilteredDataForActiveTab(),
            state.activeTab,
          );

          MindController.refreshUI();
          SettingsTagController.renderTagsList();

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
    const tags = [];
    const notes = [];
    const snippets = [];
    const bookmarks = [];
    const cheatsheets = [];

    // 0. TAGS
    const tagsSection = mdContent
      .split(/## 🏷️ TAG REGISTRY/)[1]
      ?.split(/## 📝 NOTES REGISTRY/)[0];

    if (tagsSection) {
      const tagLines = tagsSection.match(
        /- Tag:\s*(.+?)\s*\(ID:\s*(.+?)\)\s*\*\*Entity Type:\*\*\s*(.+)/g,
      );
      if (tagLines) {
        tagLines.forEach((line) => {
          const match = line.match(
            /- Tag:\s*(.+?)\s*\(ID:\s*(.+?)\)\s*\*\*Entity Type:\*\*\s*(.+)/,
          );
          if (match) {
            tags.push(
              normalizeTag({
                id: match[2].trim(),
                name: match[1].trim(),
                entityType: match[3].trim() === "none" ? null : match[3].trim(),
              }),
            );
          }
        });
      }
    }

    const cleanDate = (str) =>
      str ? str.replace(/⏰/g, "").trim() : undefined;

    // 1. NOTES
    const notesSection = mdContent
      .split(/## 📝 NOTES REGISTRY/)[1]
      ?.split(/## 💻 SNIPPETS REGISTRY/)[0];

    if (notesSection) {
      const blocks = notesSection.split(/### 📄 /).slice(1);
      blocks.forEach((block) => {
        const titleIdMatch = block.match(/(.+)\s*\(ID:\s*(.+)\)/);
        const catMatch = block.match(/- \*\*Category:\*\*\s*(.+)/);
        const pinnedMatch = block.match(/- \*\*Pinned:\*\*\s*(.+)/);
        const tagsMatch = block.match(/- \*\*Tags:\*\*\s*(.+)/);
        const createdMatch = block.match(/- \*\*Created At:\*\*\s*(.+)/);
        const updatedMatch = block.match(/- \*\*Updated At:\*\*\s*(.+)/);

        let content = "";
        const codeBlockMatch = block.match(
          /#### Content:\n```[\w]*\n([\s\S]*?)\n```/,
        );
        if (codeBlockMatch) {
          content = codeBlockMatch[1];
        } else {
          const rawContentSplit = block.split(/#### Content:\n/)[1];
          if (rawContentSplit) {
            content = rawContentSplit.split(/---\n/)[0].trim();
          }
        }

        if (titleIdMatch) {
          notes.push(
            normalizeNote({
              id: titleIdMatch[2].trim(),
              title: titleIdMatch[1].trim(),
              category: catMatch ? catMatch[1].trim() : "general",
              pinned: pinnedMatch ? pinnedMatch[1].trim() === "Yes" : false,
              tagIds:
                tagsMatch && tagsMatch[1] !== "None"
                  ? tagsMatch[1].split(",").map((t) => t.trim())
                  : [],
              createdAt: createdMatch ? cleanDate(createdMatch[1]) : undefined,
              updatedAt: updatedMatch ? cleanDate(updatedMatch[1]) : undefined,
              content: content,
            }),
          );
        }
      });
    }

    // 2. SNIPPETS
    const snippetsSection = mdContent
      .split(/## 💻 SNIPPETS REGISTRY/)[1]
      ?.split(/## 🔖 BOOKMARKS REGISTRY/)[0];

    if (snippetsSection) {
      const blocks = snippetsSection.split(/### 📄 /).slice(1);
      blocks.forEach((block) => {
        const titleIdMatch = block.match(/(.+)\s*\(ID:\s*(.+)\)/);
        const langMatch = block.match(/- \*\*Category:\*\*\s*(.+)/);
        const pinnedMatch = block.match(/- \*\*Pinned:\*\*\s*(.+)/);
        const descMatch = block.match(/- \*\*Description:\*\*\s*(.+)/);
        const tagsMatch = block.match(/- \*\*Tags:\*\*\s*(.+)/);
        const createdMatch = block.match(/- \*\*Created At:\*\*\s*(.+)/);
        const updatedMatch = block.match(/- \*\*Updated At:\*\*\s*(.+)/);
        const codeMatch = block.match(/```[\w]*\n([\s\S]*?)\n```/);

        if (titleIdMatch) {
          snippets.push(
            normalizeSnippet({
              id: titleIdMatch[2].trim(),
              title: titleIdMatch[1].trim(),
              category: langMatch ? langMatch[1].trim() : "text",
              pinned: pinnedMatch ? pinnedMatch[1].trim() === "Yes" : false,
              description:
                descMatch && descMatch[1] !== "N/A" ? descMatch[1].trim() : "",
              tagIds:
                tagsMatch && tagsMatch[1] !== "None"
                  ? tagsMatch[1].split(",").map((t) => t.trim())
                  : [],
              createdAt: createdMatch ? cleanDate(createdMatch[1]) : undefined,
              updatedAt: updatedMatch ? cleanDate(updatedMatch[1]) : undefined,
              code: codeMatch ? codeMatch[1] : "",
            }),
          );
        }
      });
    }

    // 3. BOOKMARKS
    const bookmarksSection = mdContent
      .split(/## 🔖 BOOKMARKS REGISTRY/)[1]
      ?.split(/## ⚡ CHEATSHEETS REGISTRY/)[0];

    if (bookmarksSection) {
      const blocks = bookmarksSection.split(/### 📌 /).slice(1);
      blocks.forEach((block) => {
        const titleIdMatch = block.match(/(.+)\s*\(ID:\s*(.+)\)/);
        const urlMatch = block.match(/- \*\*URL:\*\*\s*(.+)/);
        const domainMatch = block.match(/- \*\*Domain:\*\*\s*(.+)/);
        const catMatch = block.match(/- \*\*Category:\*\*\s*(.+)/);
        const pinnedMatch = block.match(/- \*\*Pinned:\*\*\s*(.+)/);
        const descMatch = block.match(/- \*\*Description:\*\*\s*(.+)/);
        const tagsMatch = block.match(/- \*\*Tags:\*\*\s*(.+)/);
        const createdMatch = block.match(/- \*\*Created At:\*\*\s*(.+)/);
        const updatedMatch = block.match(/- \*\*Updated At:\*\*\s*(.+)/);

        if (titleIdMatch) {
          bookmarks.push(
            normalizeBookmark({
              id: titleIdMatch[2].trim(),
              title: titleIdMatch[1].trim(),
              url: urlMatch && urlMatch[1] !== "N/A" ? urlMatch[1].trim() : "",
              domain:
                domainMatch && domainMatch[1] !== "N/A"
                  ? domainMatch[1].trim()
                  : "",
              category: catMatch ? catMatch[1].trim() : "general",
              pinned: pinnedMatch ? pinnedMatch[1].trim() === "Yes" : false,
              description:
                descMatch && descMatch[1] !== "N/A" ? descMatch[1].trim() : "",
              tagIds:
                tagsMatch && tagsMatch[1] !== "None"
                  ? tagsMatch[1].split(",").map((t) => t.trim())
                  : [],
              createdAt: createdMatch ? cleanDate(createdMatch[1]) : undefined,
              updatedAt: updatedMatch ? cleanDate(updatedMatch[1]) : undefined,
            }),
          );
        }
      });
    }

    // 4. CHEATSHEETS
    const cheatsheetsSection = mdContent.split(/## ⚡ CHEATSHEETS REGISTRY/)[1];

    if (cheatsheetsSection) {
      const blocks = cheatsheetsSection.split(/### 📑 /).slice(1);
      blocks.forEach((block) => {
        const titleIdMatch = block.match(/(.+)\s*\(ID:\s*(.+)\)/);
        const catMatch = block.match(/- \*\*Category:\*\*\s*(.+)/);
        const pinnedMatch = block.match(/- \*\*Pinned:\*\*\s*(.+)/);
        const descMatch = block.match(/- \*\*Description:\*\*\s*(.+)/);
        const tagsMatch = block.match(/- \*\*Tags:\*\*\s*(.+)/);
        const createdMatch = block.match(/- \*\*Created At:\*\*\s*(.+)/);
        const updatedMatch = block.match(/- \*\*Updated At:\*\*\s*(.+)/);

        const items = [];
        const itemLines = block.match(/- \*\*(.+?)\*\*: (.*?) \(ID: (.+)\)/g);
        if (itemLines) {
          itemLines.forEach((line) => {
            const m = line.match(/- \*\*(.+?)\*\*: (.*?) \(ID: (.+)\)/);
            if (m) {
              const valAndDesc = m[2].trim().split(" | ");
              items.push({
                key: m[1].trim(),
                value: valAndDesc[0] || "",
                description: valAndDesc[1] || "",
                id: m[3].trim(),
              });
            }
          });
        }

        if (titleIdMatch) {
          cheatsheets.push(
            normalizeCheatSheet({
              id: titleIdMatch[2].trim(),
              title: titleIdMatch[1].trim(),
              category: catMatch ? catMatch[1].trim() : "general",
              pinned: pinnedMatch ? pinnedMatch[1].trim() === "Yes" : false,
              description:
                descMatch && descMatch[1] !== "N/A" ? descMatch[1].trim() : "",
              tagIds:
                tagsMatch && tagsMatch[1] !== "None"
                  ? tagsMatch[1].split(",").map((t) => t.trim())
                  : [],
              createdAt: createdMatch ? cleanDate(createdMatch[1]) : undefined,
              updatedAt: updatedMatch ? cleanDate(updatedMatch[1]) : undefined,
              items,
            }),
          );
        }
      });
    }

    return { tags, notes, snippets, bookmarks, cheatsheets };
  },

  parseCsvToData(csvContent) {
    const tags = [];
    const notes = [];
    const snippets = [];
    const bookmarks = [];
    const cheatsheets = [];

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
    let currentSection = "";

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line || line.startsWith("#")) continue;

      if (line === "[TAGS]") {
        currentSection = "TAGS";
        continue;
      } else if (line === "[NOTES]") {
        currentSection = "NOTES";
        continue;
      } else if (line === "[SNIPPETS]") {
        currentSection = "SNIPPETS";
        continue;
      } else if (line === "[BOOKMARKS]") {
        currentSection = "BOOKMARKS";
        continue;
      } else if (line === "[CHEATSHEETS]") {
        currentSection = "CHEATSHEETS";
        continue;
      }

      const cols = parseCsvLine(line);

      const parseJsonSafe = (raw, fallback) => {
        try {
          return raw ? JSON.parse(raw) : fallback;
        } catch {
          return fallback;
        }
      };

      if (currentSection === "TAGS") {
        if (cols[0] === "Id" && cols[1] === "Name") continue;
        if (cols.length >= 2 && cols[0] && cols[1]) {
          tags.push({
            id: cols[0].trim(),
            name: cols[1].trim(),
            entityType: cols[2] ? cols[2].trim() : "notes",
          });
        }
      } else if (currentSection === "NOTES") {
        if (cols[0] === "Id" && cols[1] === "Title") continue;
        if (cols.length >= 2 && cols[0]) {
          notes.push({
            id: cols[0],
            title: cols[1],
            content: cols[2] || "",
            category: cols[3] || "general",
            tagIds: parseJsonSafe(cols[4], []),
            pinned: cols[5] === "Yes",
            createdAt: cols[6],
            updatedAt: cols[7],
          });
        }
      } else if (currentSection === "SNIPPETS") {
        if (cols[0] === "Id" && cols[1] === "Title") continue;
        if (cols.length >= 2 && cols[0]) {
          snippets.push({
            id: cols[0],
            title: cols[1],
            description: cols[2] || "",
            code: cols[3] || "",
            category: cols[4] || "general",
            tagIds: parseJsonSafe(cols[5], []),
            pinned: cols[6] === "Yes",
            createdAt: cols[7],
            updatedAt: cols[8],
          });
        }
      } else if (currentSection === "BOOKMARKS") {
        if (cols[0] === "Id" && cols[1] === "Title") continue;
        if (cols.length >= 2 && cols[0]) {
          bookmarks.push({
            id: cols[0],
            title: cols[1],
            url: cols[2] || "",
            domain: cols[3] || "",
            description: cols[4] || "",
            category: cols[5] || "general",
            tagIds: parseJsonSafe(cols[6], []),
            pinned: cols[7] === "Yes",
            createdAt: cols[8],
            updatedAt: cols[9],
          });
        }
      } else if (currentSection === "CHEATSHEETS") {
        if (cols[0] === "Id" && cols[1] === "Title") continue;
        if (cols.length >= 2 && cols[0]) {
          cheatsheets.push({
            id: cols[0],
            title: cols[1],
            description: cols[2] || "",
            category: cols[3] || "general",
            items: parseJsonSafe(cols[4], []),
            tagIds: parseJsonSafe(cols[5], []),
            pinned: cols[6] === "Yes",
            createdAt: cols[7],
            updatedAt: cols[8],
          });
        }
      }
    }

    return { tags, notes, snippets, bookmarks, cheatsheets };
  },
};
