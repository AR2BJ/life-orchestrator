import {
  setPendingDeleteId,
  setPendingEditId,
} from "./mind-form.controller.js";

import { GlobalLoaderService } from "@/services/loader.service.js";
import { MindService } from "@/services/mind.service.js";
import { NotificationService } from "@/services/notification.service.js";
import { StateManager } from "@/models/state.model.js";
import { todayISO } from "@/utils/helpers.js";

export const MindActionController = {
  init(mainController) {
    this.mainController = mainController;
    this.bindDynamicEvents();
    this.setupSnippetCodeUX();
    this.setupFullscreenModalEvents();
  },

  handleToggleNotePin(noteId) {
    GlobalLoaderService.show(`Pinned note...`);

    setTimeout(() => {
      try {
        const notes = StateManager.getNotes() || [];
        const targetNote = notes.find((n) => String(n.id) === String(noteId));
        if (!targetNote) return;

        const updatedNotes = MindService.toggleNotePin(notes, noteId);
        StateManager.save({ notes: updatedNotes });

        this.mainController.refreshUI();

        NotificationService.show({
          type: "info",
          message: !targetNote.pinned ? "Note pinned" : "Note unpinned",
          icon: !targetNote.pinned ? "ti-pinned-filled" : "ti-pin",
          duration: 5000,
        });
      } catch (error) {
        NotificationService.show({
          type: "error",
          message: error.message || "Failed to pinned note",
          icon: "ti-alert-triangle",
          duration: 5000,
        });
      } finally {
        GlobalLoaderService.hide();
      }
    }, 30);
  },

  handleToggleSnippetPin(snippetId) {
    GlobalLoaderService.show(`Pinned snippet...`);

    setTimeout(() => {
      try {
        const snippets = StateManager.getSnippets() || [];
        const targetSnippet = snippets.find(
          (s) => String(s.id) === String(snippetId),
        );
        if (!targetSnippet) return;

        const updatedSnippets = MindService.toggleSnippetPin(
          snippets,
          snippetId,
        );
        StateManager.save({ snippets: updatedSnippets });

        this.mainController.refreshUI();

        NotificationService.show({
          type: "info",
          message: !targetSnippet.pinned
            ? "Snippet pinned"
            : "Snippet unpinned",
          icon: !targetSnippet.pinned ? "ti-pinned-filled" : "ti-pin",
          duration: 5000,
        });
      } catch (error) {
        NotificationService.show({
          type: "error",
          message: error.message || "Failed to pinned snippet",
          icon: "ti-alert-triangle",
          duration: 5000,
        });
      } finally {
        GlobalLoaderService.hide();
      }
    }, 30);
  },

  handleToggleBookmarkPin(bookmarkId) {
    GlobalLoaderService.show(`Pinned bookmark...`);

    setTimeout(() => {
      try {
        const bookmarks = StateManager.getBookmarks() || [];
        const targetBookmark = bookmarks.find(
          (b) => String(b.id) === String(bookmarkId),
        );
        if (!targetBookmark) return;

        const updatedBookmarks = MindService.toggleBookmarkPin(
          bookmarks,
          bookmarkId,
        );
        StateManager.save({ bookmarks: updatedBookmarks });

        this.mainController.refreshUI();

        NotificationService.show({
          type: "info",
          message: !targetBookmark.pinned
            ? "Bookmark pinned"
            : "Bookmark unpinned",
          icon: !targetBookmark.pinned ? "ti-pinned-filled" : "ti-pin",
          duration: 5000,
        });
      } catch (error) {
        NotificationService.show({
          type: "error",
          message: error.message || "Failed to pinned bookmark",
          icon: "ti-alert-triangle",
          duration: 5000,
        });
      } finally {
        GlobalLoaderService.hide();
      }
    }, 30);
  },

  handleToggleCheatSheetPin(sheetId) {
    GlobalLoaderService.show(`Pinned cheatsheet...`);

    setTimeout(() => {
      try {
        const cheatsheets = StateManager.getCheatSheets() || [];
        const targetSheet = cheatsheets.find(
          (s) => String(s.id) === String(sheetId),
        );
        if (!targetSheet) return;

        const updatedCheatSheets = MindService.toggleCheatSheetPin(
          cheatsheets,
          sheetId,
        );
        StateManager.save({ cheatsheets: updatedCheatSheets });

        this.mainController.refreshUI();

        NotificationService.show({
          type: "info",
          message: !targetSheet.pinned
            ? "CheatSheet pinned"
            : "CheatSheet unpinned",
          icon: !targetSheet.pinned ? "ti-pinned-filled" : "ti-pin",
          duration: 5000,
        });
      } catch (error) {
        NotificationService.show({
          type: "error",
          message: error.message || "Failed to pinned cheatsheet",
          icon: "ti-alert-triangle",
          duration: 5000,
        });
      } finally {
        GlobalLoaderService.hide();
      }
    }, 30);
  },

  handleToggleAccordion(toggleHeaderEl) {
    const accordionContainer = toggleHeaderEl.closest(
      ".snippet-code-container",
    );
    if (!accordionContainer) return;

    const accordionBody = accordionContainer.querySelector(".accordion-body");
    const actionsGroup = accordionContainer.querySelector(
      ".accordion-actions-group",
    );
    const chevronIcon = accordionContainer.querySelector(".chevron-btn i");

    if (!accordionBody || !actionsGroup) return;

    const isHidden = accordionBody.classList.contains("hidden");

    if (isHidden) {
      accordionBody.classList.remove("hidden");
      actionsGroup.classList.remove("hidden");
      actionsGroup.classList.add("flex");

      if (chevronIcon) {
        chevronIcon.classList.remove("ti-chevron-down");
        chevronIcon.classList.add("ti-chevron-up");
      }
    } else {
      accordionBody.classList.add("hidden");
      actionsGroup.classList.add("hidden");
      actionsGroup.classList.remove("flex");

      if (chevronIcon) {
        chevronIcon.classList.remove("ti-chevron-up");
        chevronIcon.classList.add("ti-chevron-down");
      }
    }
  },

  handleDirectDelete(itemId) {
    const activeTab = StateManager.getActiveTab() || "notes";
    const currentState = StateManager.getState();

    if (activeTab === "notes") {
      const notes = MindService.deleteNote(currentState.notes || [], itemId);
      StateManager.save({ notes });
    } else if (activeTab === "snippets") {
      const snippets = MindService.deleteSnippet(
        currentState.snippets || [],
        itemId,
      );
      StateManager.save({ snippets });
    } else if (activeTab === "bookmarks") {
      const bookmarks = MindService.deleteBookmark(
        currentState.bookmarks || [],
        itemId,
      );
      StateManager.save({ bookmarks });
    } else if (activeTab === "cheatsheets") {
      const cheatsheets = MindService.deleteCheatSheet(
        currentState.cheatsheets || [],
        itemId,
      );
      StateManager.save({ cheatsheets });
    }

    this.mainController.refreshUI();

    NotificationService.show({
      type: "info",
      message: "Item deleted successfully",
      icon: "ti-trash",
      duration: 5000,
    });
  },

  handleCopyText(text) {
    if (!text) return;

    navigator.clipboard
      .writeText(text)
      .then(() => {
        NotificationService.show({
          type: "success",
          message: "Value copied to clipboard",
          icon: "ti-copy-check",
          duration: 3000,
        });
      })
      .catch((err) => {
        console.error("Failed to copy text: ", err);
        NotificationService.show({
          type: "error",
          message: "Failed to copy text",
          icon: "ti-alert-triangle",
          duration: 3000,
        });
      });
  },

  handleOpenFullscreenModal(snippetId) {
    const snippets = StateManager.getSnippets() || [];
    const targetSnippet = snippets.find(
      (s) => String(s.id) === String(snippetId),
    );
    if (!targetSnippet) return;

    const modal = document.getElementById("fullscreen-snippet-modal");
    const titleEl = document.getElementById("fullscreen-modal-title");
    const subtitleEl = document.getElementById("fullscreen-modal-subtitle");
    const lineNumbersEl = document.getElementById(
      "fullscreen-modal-line-numbers",
    );
    const codeContentEl = document.getElementById(
      "fullscreen-modal-code-content",
    );
    const copyBtn = document.getElementById("fullscreen-modal-copy-btn");
    const downloadBtn = document.getElementById(
      "fullscreen-modal-download-btn",
    );

    if (!modal) return;

    if (titleEl)
      titleEl.textContent = targetSnippet.title || "Untitled Snippet";
    if (subtitleEl)
      subtitleEl.textContent =
        targetSnippet.description || "Full view code inspector";

    if (lineNumbersEl) {
      const lineCount = (targetSnippet.code || "").split("\n").length;
      lineNumbersEl.innerHTML = Array.from(
        { length: lineCount },
        (_, i) => `<span>${i + 1}</span>`,
      ).join("");
    }

    if (codeContentEl) {
      codeContentEl.innerHTML = `<pre class="m-0 p-0 bg-transparent text-slate-200 font-mono whitespace-pre"><code>${targetSnippet.code || ""}</code></pre>`;

      if (targetSnippet.code) {
        import("@/utils/code-formatter").then(({ highlightWithShiki }) => {
          highlightWithShiki(targetSnippet.code, targetSnippet.category)
            .then((html) => {
              if (codeContentEl) codeContentEl.innerHTML = html;
            })
            .catch((err) => console.error("Shiki Fullscreen Error:", err));
        });
      }
    }

    if (copyBtn) {
      copyBtn.onclick = () => this.handleCopyText(targetSnippet.code);
    }

    if (downloadBtn) {
      downloadBtn.onclick = () => this.handleDownloadSnippet(targetSnippet.id);
    }

    modal.classList.remove("hidden");
    modal.classList.add("flex");

    document.body.classList.add("overflow-hidden");
  },

  handleCloseFullscreenModal() {
    const modal = document.getElementById("fullscreen-snippet-modal");
    if (modal) {
      modal.classList.add("hidden");
      modal.classList.remove("flex");
    }

    document.body.classList.remove("overflow-hidden");
  },

  setupFullscreenModalEvents() {
    const modal = document.getElementById("fullscreen-snippet-modal");
    const closeBtn = document.getElementById("close-fullscreen-modal");

    if (closeBtn) {
      closeBtn.addEventListener("click", () =>
        this.handleCloseFullscreenModal(),
      );
    }

    if (modal) {
      modal.addEventListener("click", (e) => {
        if (e.target === modal) this.handleCloseFullscreenModal();
      });
    }
  },

  bindDynamicEvents() {
    const listContainer = document.getElementById("mind-list");
    if (!listContainer) return;

    listContainer.addEventListener("click", (e) => {
      const target = e.target;

      // 1. PIN NOTE
      const pinNoteBtn = target.closest(".pin-note-btn");
      if (pinNoteBtn) {
        e.stopPropagation();
        const id = pinNoteBtn.dataset.id;
        if (id) this.handleToggleNotePin(id);
        return;
      }

      // 2. PIN SNIPPET
      const pinSnippetBtn = target.closest(".pin-snippet-btn");
      if (pinSnippetBtn) {
        e.stopPropagation();
        const id = pinSnippetBtn.dataset.id;
        if (id) this.handleToggleSnippetPin(id);
        return;
      }

      // 3. PIN BOOKMARK
      const pinBookmarkBtn = target.closest(".pin-bookmark-btn");
      if (pinBookmarkBtn) {
        e.stopPropagation();
        const id = pinBookmarkBtn.dataset.id;
        if (id) this.handleToggleBookmarkPin(id);
        return;
      }

      // 4. PIN CHEATSHEET
      const pinCheatSheetBtn = target.closest(".pin-cheatsheet-btn");
      if (pinCheatSheetBtn) {
        e.stopPropagation();
        const id = pinCheatSheetBtn.dataset.id;
        if (id) this.handleToggleCheatSheetPin(id);
        return;
      }

      // 5. COPY BUTTON HANDLER
      const copyBtn = target.closest(".copy-btn");
      if (copyBtn) {
        e.stopPropagation();
        const textToCopy = copyBtn.dataset.copyText;
        if (textToCopy) this.handleCopyText(textToCopy);
        return;
      }

      const copySnippetBtn = target.closest(".copy-snippet-btn");
      if (copySnippetBtn) {
        e.stopPropagation();
        const snippetId = copySnippetBtn.dataset.copySnippetId;
        const snippets = StateManager.getSnippets() || [];
        const targetSnippet = snippets.find(
          (s) => String(s.id) === String(snippetId),
        );

        if (targetSnippet && targetSnippet.code) {
          this.handleCopyText(targetSnippet.code);
        }
        return;
      }

      // 6. DOWNLOAD BUTTON HANDLER
      const downloadSnippetBtn = target.closest(".download-snippet-btn");
      if (downloadSnippetBtn) {
        e.stopPropagation();
        const snippetId = downloadSnippetBtn.dataset.downloadSnippetId;
        if (snippetId) {
          this.handleDownloadSnippet(snippetId);
        }
        return;
      }

      // 7. FULLSCREEN TRIGGER
      const fullscreenBtn = target.closest(".fullscreen-snippet-btn");
      if (fullscreenBtn) {
        e.stopPropagation();
        const snippetId = fullscreenBtn.dataset.fullscreenSnippetId;
        if (snippetId) this.handleOpenFullscreenModal(snippetId);
        return;
      }

      // 8. ACCORDION TOGGLE HANDLER
      const accordionBtn = target.closest(".toggle-accordion-btn");
      if (accordionBtn) {
        if (
          target.closest(".copy-snippet-btn") ||
          target.closest(".download-snippet-btn")
        ) {
          return;
        }

        e.stopPropagation();
        const snippetId = accordionBtn.dataset.snippetAccordionId;
        if (snippetId) {
          this.handleToggleAccordion(accordionBtn);
        }
        return;
      }

      // 9. EDIT MODAL TRIGGER
      const editBtn = target.closest(".edit-btn");
      if (editBtn) {
        e.stopPropagation();
        const id = editBtn.dataset.id;
        if (!id) return;

        setPendingEditId(id);
        if (
          this.mainController &&
          typeof this.mainController.toggleModal === "function"
        ) {
          this.mainController.toggleModal("edit-modal", true);
        }
        return;
      }

      // 10. DELETE MODAL TRIGGER
      const deleteBtn = target.closest(".delete-btn");
      if (deleteBtn) {
        e.stopPropagation();
        const id = deleteBtn.dataset.id;
        if (!id) return;

        setPendingDeleteId(id);
        if (
          this.mainController &&
          typeof this.mainController.toggleModal === "function"
        ) {
          this.mainController.toggleModal("delete-modal", true);
        }
        return;
      }

      // 11. DIRECT DELETE ITEM HANDLER
      const directDeleteBtn = target.closest(".direct-delete-btn");
      if (directDeleteBtn) {
        e.stopPropagation();
        const id = directDeleteBtn.dataset.id;
        if (id) this.handleDirectDelete(id);
        return;
      }
    });
  },

  handleDownloadSnippet(snippetId) {
    const snippets = StateManager.getSnippets() || [];
    const targetSnippet = snippets.find(
      (s) => String(s.id) === String(snippetId),
    );

    if (!targetSnippet || !targetSnippet.code) return;

    const categories = StateManager.getCategories() || [];
    const categoryData = categories.find(
      (c) => String(c.id) === String(targetSnippet.category),
    );

    const rawTitle = targetSnippet.title || "untitled";
    const snippetName = rawTitle.trim().toLowerCase().replace(/\s+/g, "-");

    const today = todayISO();

    const rawExt = categoryData?.format || "txt";
    const extension = rawExt.replace(/^\./, "").toLowerCase();

    const fileName = `${snippetName}_code_${today}.${extension}`;

    const blob = new Blob([targetSnippet.code], {
      type: "text/plain;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    NotificationService.show({
      type: "success",
      message: `File "${fileName}" downloaded successfully`,
      icon: "ti-file-download",
      duration: 3000,
    });
  },

  setupSnippetCodeUX() {
    const attachUX = (codeId, uploadBtnId, fileInputId, loaderId) => {
      const codeTextarea = document.getElementById(codeId);
      const uploadBtn = document.getElementById(uploadBtnId);
      const fileInput = document.getElementById(fileInputId);
      const loader = document.getElementById(loaderId);

      if (codeTextarea) {
        codeTextarea.addEventListener("keydown", (e) => {
          if (e.key === "Tab") {
            e.preventDefault();
            const start = codeTextarea.selectionStart;
            const end = codeTextarea.selectionEnd;

            codeTextarea.value =
              codeTextarea.value.substring(0, start) +
              "  " +
              codeTextarea.value.substring(end);

            codeTextarea.selectionStart = codeTextarea.selectionEnd = start + 2;
          }
        });
      }

      if (uploadBtn && fileInput && codeTextarea) {
        uploadBtn.addEventListener("click", () => {
          fileInput.value = "";
          fileInput.click();
        });

        fileInput.addEventListener("change", (e) => {
          const file = e.target.files?.[0];
          if (!file) return;

          if (loader) loader.classList.remove("hidden");
          uploadBtn.classList.add("hidden");

          const reader = new FileReader();

          reader.onload = (event) => {
            codeTextarea.value = event.target?.result || "";

            if (loader) loader.classList.add("hidden");
            uploadBtn.classList.remove("hidden");

            if (typeof NotificationService !== "undefined") {
              NotificationService.show({
                type: "success",
                message: `File "${file.name}" loaded successfully`,
                icon: "ti-file-check",
                duration: 3000,
              });
            }
          };

          reader.onerror = () => {
            if (loader) loader.classList.add("hidden");
            uploadBtn.classList.remove("hidden");

            if (typeof NotificationService !== "undefined") {
              NotificationService.show({
                type: "error",
                message: "Failed to read file",
                icon: "ti-alert-circle",
                duration: 3000,
              });
            }
          };

          setTimeout(() => {
            reader.readAsText(file);
          }, 100);
        });
      }
    };

    // Create Form UX
    attachUX(
      "create-snippet-code",
      "btn-upload-snippet-file",
      "snippet-file-input",
      "snippet-file-loader",
    );

    // Edit Modal UX
    attachUX(
      "edit-snippet-code",
      "btn-upload-edit-snippet-file",
      "edit-snippet-file-input",
      "edit-snippet-file-loader",
    );
  },
};
