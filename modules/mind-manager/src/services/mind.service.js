import {
  normalizeBookmark,
  normalizeCheatSheet,
  normalizeNote,
  normalizeSnippet,
} from "@/models/storage.model";
import {
  sanitizeTagIds,
  todayISO,
  validateAndNormalizeUrl,
} from "@/utils/helpers.js";

export const MindService = {
  // ==========================================
  // 1. NOTES
  // ==========================================
  createNote(currentNotes = [], noteData = {}) {
    const rawTitle = typeof noteData === "string" ? noteData : noteData.title;
    const cleanedTitle = (rawTitle || "").trim().replace(/\s+/g, " ");

    if (!cleanedTitle || cleanedTitle.length < 2 || cleanedTitle.length > 120) {
      throw new Error("Note title must be between 2 and 120 characters");
    }

    const alreadyExists = currentNotes.some(
      (note) => note.title.toLowerCase() === cleanedTitle.toLowerCase(),
    );
    if (alreadyExists) {
      throw new Error("An active note with this title already exists");
    }

    const parsedTagIds = sanitizeTagIds(noteData.tagIds);

    const payload = normalizeNote({
      ...noteData,
      title: cleanedTitle,
      tagIds: parsedTagIds,
      createdAt: todayISO(),
      updatedAt: todayISO(),
    });

    return [payload, ...currentNotes];
  },

  editNote(currentNotes = [], noteId, updatedFields = {}) {
    const note = currentNotes.find((n) => String(n.id) === String(noteId));
    if (!note) throw new Error("Note not found");

    let cleanedTitle = note.title;
    if (updatedFields.title !== undefined) {
      cleanedTitle = updatedFields.title.trim().replace(/\s+/g, " ");
      if (cleanedTitle.length < 2 || cleanedTitle.length > 120) {
        throw new Error("Note title must be between 2 and 120 characters");
      }
    }

    return currentNotes.map((n) => {
      if (String(n.id) !== String(noteId)) return n;

      return normalizeNote({
        ...n,
        ...updatedFields,
        title: cleanedTitle,
        updatedAt: todayISO(),
      });
    });
  },

  toggleNotePin(currentNotes = [], noteId) {
    const targetNote = currentNotes.find(
      (n) => String(n.id) === String(noteId),
    );
    if (!targetNote) throw new Error("Note not found");

    const isPinning = !targetNote.pinned;

    if (isPinning) {
      const pinCount = currentNotes.filter((n) => n.pinned === true).length;
      if (pinCount >= 4) {
        throw new Error("Maximum limit reached: Only 4 notes can be pinned");
      }
    }

    return currentNotes.map((n) => {
      if (String(n.id) !== String(noteId)) return n;
      return {
        ...n,
        pinned: isPinning,
        updatedAt: todayISO(),
      };
    });
  },

  deleteNote(currentNotes = [], noteId) {
    return currentNotes.filter((n) => String(n.id) !== String(noteId));
  },

  // ==========================================
  // 2. SNIPPETS
  // ==========================================
  createSnippet(currentSnippets = [], snippetData = {}) {
    const rawTitle =
      typeof snippetData === "string" ? snippetData : snippetData.title;
    const cleanedTitle = (rawTitle || "").trim().replace(/\s+/g, " ");

    if (!cleanedTitle || cleanedTitle.length < 2 || cleanedTitle.length > 120) {
      throw new Error("Snippet title must be between 2 and 120 characters");
    }

    const code = (snippetData.code || "").trim();
    if (!code) {
      throw new Error("Code is required for snippet");
    }

    const alreadyExists = currentSnippets.some(
      (snippet) => snippet.title.toLowerCase() === cleanedTitle.toLowerCase(),
    );
    if (alreadyExists) {
      throw new Error("An active snippet with this title already exists");
    }

    const parsedTagIds = sanitizeTagIds(snippetData.tagIds);

    const payload = normalizeSnippet({
      ...snippetData,
      title: cleanedTitle,
      tagIds: parsedTagIds,
      createdAt: todayISO(),
      updatedAt: todayISO(),
    });

    return [payload, ...currentSnippets];
  },

  editSnippet(currentSnippets = [], snippetId, updatedFields = {}) {
    const snippet = currentSnippets.find(
      (s) => String(s.id) === String(snippetId),
    );
    if (!snippet) throw new Error("Snippet not found");

    let cleanedTitle = snippet.title;
    if (updatedFields.title !== undefined) {
      cleanedTitle = updatedFields.title.trim().replace(/\s+/g, " ");
      if (cleanedTitle.length < 2 || cleanedTitle.length > 120) {
        throw new Error("Snippet title must be between 2 and 120 characters");
      }
    }

    return currentSnippets.map((s) => {
      if (String(s.id) !== String(snippetId)) return s;

      return normalizeSnippet({
        ...s,
        ...updatedFields,
        title: cleanedTitle,
        updatedAt: todayISO(),
      });
    });
  },

  toggleSnippetPin(currentSnippets = [], snippetId) {
    const targetSnippet = currentSnippets.find(
      (s) => String(s.id) === String(snippetId),
    );
    if (!targetSnippet) throw new Error("Snippet not found");

    const isPinning = !targetSnippet.pinned;

    if (isPinning) {
      const pinCount = currentSnippets.filter((s) => s.pinned === true).length;
      if (pinCount >= 4) {
        throw new Error("Maximum limit reached: Only 4 snippets can be pinned");
      }
    }

    return currentSnippets.map((s) => {
      if (String(s.id) !== String(snippetId)) return s;
      return {
        ...s,
        pinned: isPinning,
        updatedAt: todayISO(),
      };
    });
  },

  deleteSnippet(currentSnippets = [], snippetId) {
    return currentSnippets.filter((s) => String(s.id) !== String(snippetId));
  },

  // ==========================================
  // 3. BOOKMARKS
  // ==========================================
  createBookmark(currentBookmarks = [], bookmarkData = {}) {
    const rawTitle =
      typeof bookmarkData === "string" ? bookmarkData : bookmarkData.title;
    const cleanedTitle = (rawTitle || "").trim().replace(/\s+/g, " ");

    if (!cleanedTitle || cleanedTitle.length < 2 || cleanedTitle.length > 120) {
      throw new Error("Bookmark title must be between 2 and 120 characters");
    }

    const alreadyExists = currentBookmarks.some(
      (bookmark) => bookmark.title.toLowerCase() === cleanedTitle.toLowerCase(),
    );
    if (alreadyExists) {
      throw new Error("An active bookmark with this title already exists");
    }

    const validUrl = validateAndNormalizeUrl(bookmarkData.url);

    const parsedTagIds = sanitizeTagIds(bookmarkData.tagIds);

    const payload = normalizeBookmark({
      ...bookmarkData,
      title: cleanedTitle,
      url: validUrl,
      tagIds: parsedTagIds,
      createdAt: todayISO(),
      updatedAt: todayISO(),
    });

    return [payload, ...currentBookmarks];
  },

  editBookmark(currentBookmarks = [], bookmarkId, updatedFields = {}) {
    const bookmark = currentBookmarks.find(
      (b) => String(b.id) === String(bookmarkId),
    );
    if (!bookmark) throw new Error("Bookmark not found");

    let cleanedTitle = bookmark.title;
    if (updatedFields.title !== undefined) {
      cleanedTitle = updatedFields.title.trim().replace(/\s+/g, " ");
      if (cleanedTitle.length < 2 || cleanedTitle.length > 120) {
        throw new Error("Bookmark title must be between 2 and 120 characters");
      }
    }

    let validUrl = bookmark.url;
    if (updatedFields.url !== undefined) {
      validUrl = validateAndNormalizeUrl(updatedFields.url);
    }

    return currentBookmarks.map((b) => {
      if (String(b.id) !== String(bookmarkId)) return b;

      return normalizeBookmark({
        ...b,
        ...updatedFields,
        title: cleanedTitle,
        url: validUrl,
        updatedAt: todayISO(),
      });
    });
  },

  toggleBookmarkPin(currentBookmarks = [], bookmarkId) {
    const targetBookmark = currentBookmarks.find(
      (b) => String(b.id) === String(bookmarkId),
    );
    if (!targetBookmark) throw new Error("Bookmark not found");

    const isPinning = !targetBookmark.pinned;

    if (isPinning) {
      const pinCount = currentBookmarks.filter((b) => b.pinned === true).length;
      if (pinCount >= 4) {
        throw new Error(
          "Maximum limit reached: Only 4 bookmarks can be pinned",
        );
      }
    }

    return currentBookmarks.map((b) => {
      if (String(b.id) !== String(bookmarkId)) return b;
      return {
        ...b,
        pinned: isPinning,
        updatedAt: todayISO(),
      };
    });
  },

  deleteBookmark(currentBookmarks = [], bookmarkId) {
    return currentBookmarks.filter((b) => String(b.id) !== String(bookmarkId));
  },

  // ==========================================
  // 4. CHEATSHEETS
  // ==========================================
  createCheatSheet(currentCheatSheets = [], cheatSheetData = {}) {
    const rawTitle =
      typeof cheatSheetData === "string"
        ? cheatSheetData
        : cheatSheetData.title;
    const cleanedTitle = (rawTitle || "").trim().replace(/\s+/g, " ");

    if (!cleanedTitle || cleanedTitle.length < 2 || cleanedTitle.length > 120) {
      throw new Error("CheatSheet title must be between 2 and 120 characters");
    }

    const alreadyExists = currentCheatSheets.some(
      (cheatsheet) =>
        cheatsheet.title.toLowerCase() === cleanedTitle.toLowerCase(),
    );
    if (alreadyExists) {
      throw new Error("An active cheatsheet with this title already exists");
    }

    const parsedTagIds = sanitizeTagIds(cheatSheetData.tagIds);

    const payload = normalizeCheatSheet({
      ...cheatSheetData,
      title: cleanedTitle,
      tagIds: parsedTagIds,
      createdAt: todayISO(),
      updatedAt: todayISO(),
    });

    return [payload, ...currentCheatSheets];
  },

  editCheatSheet(currentCheatSheets = [], sheetId, updatedFields = {}) {
    const sheet = currentCheatSheets.find(
      (s) => String(s.id) === String(sheetId),
    );
    if (!sheet) throw new Error("CheatSheet not found");

    let cleanedTitle = sheet.title;
    if (updatedFields.title !== undefined) {
      cleanedTitle = updatedFields.title.trim().replace(/\s+/g, " ");
      if (cleanedTitle.length < 2 || cleanedTitle.length > 120) {
        throw new Error(
          "CheatSheet title must be between 2 and 120 characters",
        );
      }
    }

    return currentCheatSheets.map((s) => {
      if (String(s.id) !== String(sheetId)) return s;

      return normalizeCheatSheet({
        ...s,
        ...updatedFields,
        title: cleanedTitle,
        updatedAt: todayISO(),
      });
    });
  },

  toggleCheatSheetPin(currentCheatSheets = [], sheetId) {
    const targetSheet = currentCheatSheets.find(
      (s) => String(s.id) === String(sheetId),
    );
    if (!targetSheet) throw new Error("CheatSheet not found");

    const isPinning = !targetSheet.pinned;

    if (isPinning) {
      const pinCount = currentCheatSheets.filter(
        (s) => s.pinned === true,
      ).length;
      if (pinCount >= 4) {
        throw new Error(
          "Maximum limit reached: Only 4 cheatsheets can be pinned",
        );
      }
    }

    return currentCheatSheets.map((s) => {
      if (String(s.id) !== String(sheetId)) return s;
      return {
        ...s,
        pinned: isPinning,
        updatedAt: todayISO(),
      };
    });
  },

  deleteCheatSheet(currentCheatSheets = [], sheetId) {
    return currentCheatSheets.filter((s) => String(s.id) !== String(sheetId));
  },
};
