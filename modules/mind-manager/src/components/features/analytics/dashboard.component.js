import {
  BOOKMARK_CATEGORIES,
  CHEATSHEET_CATEGORIES,
  NOTE_CATEGORIES,
  SNIPPET_CATEGORIES,
} from "@/utils/constants/options-value.constants";

const emptyStateConfig = {
  notes: {
    icon: "<i class='ti ti-note text-brand/60'></i>",
    title: "No notes found",
    description: "Capture thoughts, ideas, and knowledge in structured notes.",
  },
  snippets: {
    icon: "<i class='ti ti-code text-brand/60'></i>",
    title: "No code snippets saved",
    description: "Save and organize reusable code snippets for easy access.",
  },
  bookmarks: {
    icon: "<i class='ti ti-bookmark text-brand/60'></i>",
    title: "No bookmarks added",
    description: "Keep track of useful links, docs, and online resources.",
  },
  cheatsheets: {
    icon: "<i class='ti ti-file-description text-brand/60'></i>",
    title: "No cheatSheets available",
    description: "Create quick reference guides and key-value shortcuts.",
  },
};

export const DashboardComponent = {
  render(
    tags = [],
    notes = [],
    snippets = [],
    bookmarks = [],
    cheatsheets = [],
  ) {
    const safeTags = Array.isArray(tags) ? tags : [];
    const safeNotes = Array.isArray(notes) ? notes : [];
    const safeSnippets = Array.isArray(snippets) ? snippets : [];
    const safeBookmarks = Array.isArray(bookmarks) ? bookmarks : [];
    const safeCheatSheets = Array.isArray(cheatsheets) ? cheatsheets : [];

    const pinnedNotes = safeNotes.filter((n) => n.pinned).length;
    const pinnedSnippets = safeSnippets.filter((s) => s.pinned).length;
    const pinnedBookmarks = safeBookmarks.filter((b) => b.pinned).length;
    const pinnedCheatSheets = safeCheatSheets.filter((c) => c.pinned).length;

    const totalItems =
      safeNotes.length +
      safeSnippets.length +
      safeBookmarks.length +
      safeCheatSheets.length;

    const totalPinned =
      pinnedNotes + pinnedSnippets + pinnedBookmarks + pinnedCheatSheets;

    return `
      <div
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full col-span-full"
      >
        <div
          class="col-span-2 md:col-span-1 relative overflow-hidden bg-surface-2 border border-border/70 hover:-translate-y-1 hover:border-sky-500/30 rounded-2xl p-6 transition-all duration-300 flex flex-col justify-between min-h-36 group"
        >
          <i
            class="ti ti-article-filled absolute -right-4 -bottom-6 text-[11rem] text-sky-500 opacity-[0.04] dark:opacity-[0.06] rotate-12 pointer-events-none group-hover:scale-110 group-hover:rotate-6 transition-transform duration-500"
          ></i>
          <div class="flex items-center justify-between z-10">
            <span
              class="text-xs font-bold text-secondary uppercase tracking-wider"
              >Notes</span
            >
            <span
              class="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-sky-500/10 text-sky-400 border border-sky-500/20 flex items-center gap-1"
            >
              <i class="ti ti-pin text-[10px]"></i> ${pinnedNotes} Pinned
            </span>
          </div>
          <div class="z-10 mt-3">
            <div class="text-3xl font-black text-color tracking-tight">
              ${safeNotes.length}
            </div>
            <p class="text-[11px] text-secondary/80 font-medium mt-1">
              Structured thoughts & knowledge
            </p>
          </div>
          <div
            class="mt-4 pt-3 border-t border-border/40 flex items-center justify-between z-10 text-[11px]"
          >
            <span class="text-secondary">Type Index:</span>
            <span class="font-bold text-sky-400">Notes Engine</span>
          </div>
        </div>

        <div
          class="col-span-2 md:col-span-1 relative overflow-hidden bg-surface-2 border border-border/70 hover:-translate-y-1 hover:border-violet-500/30 rounded-2xl p-6 transition-all duration-300 flex flex-col justify-between min-h-36 group"
        >
          <i
            class="ti ti-code absolute -right-4 -bottom-6 text-[11rem] text-violet-500 opacity-[0.04] dark:opacity-[0.06] rotate-12 pointer-events-none group-hover:scale-110 group-hover:rotate-6 transition-transform duration-500"
          ></i>
          <div class="flex items-center justify-between z-10">
            <span
              class="text-xs font-bold text-secondary uppercase tracking-wider"
              >Code Snippets</span
            >
            <span
              class="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-violet-500/10 text-violet-400 border border-violet-500/20 flex items-center gap-1"
            >
              <i class="ti ti-pin text-[10px]"></i> ${pinnedSnippets} Pinned
            </span>
          </div>
          <div class="z-10 mt-3">
            <div class="text-3xl font-black text-color tracking-tight">
              ${safeSnippets.length}
            </div>
            <p class="text-[11px] text-secondary/80 font-medium mt-1">
              Reusable blocks & logic
            </p>
          </div>
          <div
            class="mt-4 pt-3 border-t border-border/40 flex items-center justify-between z-10 text-[11px]"
          >
            <span class="text-secondary">Type Index:</span>
            <span class="font-bold text-violet-400">Code Vault</span>
          </div>
        </div>

        <div
          class="col-span-2 md:col-span-1 relative overflow-hidden bg-surface-2 border border-border/70 hover:-translate-y-1 hover:border-emerald-500/30 rounded-2xl p-6 transition-all duration-300 flex flex-col justify-between min-h-36 group"
        >
          <i
            class="ti ti-bookmark-filled absolute -right-4 -bottom-6 text-[11rem] text-emerald-500 opacity-[0.04] dark:opacity-[0.06] rotate-12 pointer-events-none group-hover:scale-110 group-hover:rotate-6 transition-transform duration-500"
          ></i>
          <div class="flex items-center justify-between z-10">
            <span
              class="text-xs font-bold text-secondary uppercase tracking-wider"
              >Bookmarks</span
            >
            <span
              class="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1"
            >
              <i class="ti ti-pin text-[10px]"></i> ${pinnedBookmarks} Pinned
            </span>
          </div>
          <div class="z-10 mt-3">
            <div class="text-3xl font-black text-color tracking-tight">
              ${safeBookmarks.length}
            </div>
            <p class="text-[11px] text-secondary/80 font-medium mt-1">
              Curated links & resources
            </p>
          </div>
          <div
            class="mt-4 pt-3 border-t border-border/40 flex items-center justify-between z-10 text-[11px]"
          >
            <span class="text-secondary">Type Index:</span>
            <span class="font-bold text-emerald-400">Link Index</span>
          </div>
        </div>

        <div
          class="col-span-2 md:col-span-1 relative overflow-hidden bg-surface-2 border border-border/70 hover:-translate-y-1 hover:border-yellow-500/30 rounded-2xl p-6 transition-all duration-300 flex flex-col justify-between min-h-36 group"
        >
          <i
            class="ti ti-file-description-filled absolute -right-4 -bottom-6 text-[11rem] text-yellow-500 opacity-[0.04] dark:opacity-[0.06] rotate-12 pointer-events-none group-hover:scale-110 group-hover:rotate-6 transition-transform duration-500"
          ></i>
          <div class="flex items-center justify-between z-10">
            <span
              class="text-xs font-bold text-secondary uppercase tracking-wider"
              >CheatSheets</span
            >
            <span
              class="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 flex items-center gap-1"
            >
              <i class="ti ti-pin text-[10px]"></i> ${pinnedCheatSheets} Pinned
            </span>
          </div>
          <div class="z-10 mt-3">
            <div class="text-3xl font-black text-color tracking-tight">
              ${safeCheatSheets.length}
            </div>
            <p class="text-[11px] text-secondary/80 font-medium mt-1">
              Quick reference & shortcuts
            </p>
          </div>
          <div
            class="mt-4 pt-3 border-t border-border/40 flex items-center justify-between z-10 text-[11px]"
          >
            <span class="text-secondary">Type Index:</span>
            <span class="font-bold text-yellow-400">Quick Reference</span>
          </div>
        </div>
      </div>

      <div
        class="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full col-span-2 sm:col-span-full mt-4"
      >
        <div
          class="lg:col-span-2 bg-surface-2 border border-border/70 rounded-2xl p-6 flex flex-col justify-between"
        >
          <div
            class="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between"
          >
            <div>
              <h4 class="text-lg font-bold text-color flex items-center gap-2">
                <i class="ti ti-affiliate text-brand text-xl"></i>
                Execution Velocity & Heatmap
              </h4>
              <p class="text-xs text-secondary mt-1">
                Volume of activity logs and entry interactions across timeline.
              </p>
            </div>

            <div class="relative flex items-center justify-end">
              <button
                id="heatmap-mobile-menu-toggle"
                class="sm:hidden inline-flex items-center justify-center h-8 w-8 rounded-lg border border-border bg-surface text-secondary hover:text-color transition shadow-sm cursor-pointer"
                aria-label="Open view menu"
              >
                <i class="ti ti-dots-vertical text-lg"></i>
              </button>

              <div
                id="heatmap-mobile-menu"
                class="hidden absolute right-0 top-full mt-2 w-44 rounded-2xl border border-border bg-surface-2 shadow-lg z-20 overflow-hidden"
              >
                <button
                  data-view="weekly"
                  class="w-full px-4 py-2.5 text-left text-xs font-medium text-secondary hover:bg-surface"
                >
                  Weekly
                </button>
                <button
                  data-view="monthly"
                  class="w-full px-4 py-2.5 text-left text-xs font-medium text-secondary hover:bg-surface"
                >
                  Monthly
                </button>
                <button
                  data-view="yearly"
                  class="w-full px-4 py-2.5 text-left text-xs font-medium text-secondary hover:bg-surface"
                >
                  Yearly
                </button>
              </div>

              <div
                id="chart-view-switcher"
                class="hidden sm:flex relative overflow-hidden rounded-xl border border-border/80 bg-surface p-1 isolation-auto"
              >
                <div
                  id="heatmap-tab-indicator"
                  class="absolute top-1 left-1 h-[calc(100%-8px)] w-24 rounded-lg bg-brand/80 transition-all duration-300 ease-out z-0 shadow-sm"
                ></div>

                <button
                  data-view="weekly"
                  id="view-btn-weekly"
                  class="relative z-10 w-24 py-1.5 text-xs font-bold text-secondary transition cursor-pointer text-center"
                >
                  Weekly
                </button>
                <button
                  data-view="monthly"
                  id="view-btn-monthly"
                  class="relative z-10 w-24 py-1.5 text-xs font-bold text-secondary transition cursor-pointer text-center"
                >
                  Monthly
                </button>
                <button
                  data-view="yearly"
                  id="view-btn-yearly"
                  class="relative z-10 w-24 py-1.5 text-xs font-bold text-secondary transition cursor-pointer text-center"
                >
                  Yearly
                </button>
              </div>
            </div>
          </div>

          <div
            class="w-full mt-6 overflow-x-auto scrollbar-thin scrollbar-thumb-surface"
          >
            <div
              id="apex-heatmap-chart"
              class="w-full"
            ></div>
          </div>
        </div>

        <div
          class="bg-surface-2 border border-border/70 rounded-2xl p-6 flex flex-col justify-between"
        >
          <div>
            <h4 class="text-lg font-bold text-color flex items-center gap-2">
              <i class="ti ti-chart-bar text-brand text-xl rotate-90"></i>
              Weekday Distribution
            </h4>
            <p class="text-xs text-secondary mt-1">
              Density of items created or updated per weekday.
            </p>
          </div>

          <div
            class="w-full mt-6 overflow-x-auto scrollbar-thin scrollbar-thumb-surface"
          >
            <div
              id="apex-weekday-chart"
              class="w-full"
            ></div>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 gap-6 w-full col-span-full mt-6">
        <div
          class="bg-surface-2 border border-border/70 rounded-2xl p-6 flex flex-col justify-between shadow-sm"
        >
          <div>
            <h4 class="text-lg font-bold text-color flex items-center gap-2">
              <i class="ti ti-compass text-brand text-xl"></i>
              Module Distribution
            </h4>
            <p class="text-xs text-secondary mt-1">
              Proportion of entries across Notes, Snippets, Bookmarks, and
              CheatSheets.
            </p>
          </div>
          <div
            class="w-full mt-6 overflow-x-auto scrollbar-thin scrollbar-thumb-surface"
          >
            <div
              id="apex-category-chart"
              class="w-full"
            ></div>
          </div>
        </div>
      </div>

      <div
        class="grid grid-cols-1 md:grid-cols-2 gap-6 w-full col-span-full mt-6"
      >
        <div
          class="bg-surface-2 border border-border/70 rounded-2xl p-6 flex flex-col justify-between shadow-sm"
        >
          <div>
            <h4 class="text-lg font-bold text-color flex items-center gap-2">
              <i class="ti ti-tags text-brand text-xl"></i>
              Top Tags
            </h4>
            <p class="text-xs text-secondary mt-1">
              Most frequently used tags across your data modules.
            </p>
          </div>
          <div
            class="w-full mt-6 overflow-x-auto scrollbar-thin scrollbar-thumb-surface"
          >
            <div
              id="apex-tags-chart"
              class="w-full"
            ></div>
          </div>
        </div>

        <div
          class="bg-surface-2 border border-border/70 rounded-2xl p-6 flex flex-col justify-between shadow-sm"
        >
          <div>
            <h4 class="text-lg font-bold text-color flex items-center gap-2">
              <i class="ti ti-adjustments-horizontal text-brand text-xl"></i>
              Entity Metrics
            </h4>
            <p class="text-xs text-secondary mt-1">
              Distribution of total, pinned, and archived records.
            </p>
          </div>
          <div
            class="w-full mt-6 overflow-x-auto scrollbar-thin scrollbar-thumb-surface"
          >
            <div
              id="apex-status-chart"
              class="w-full"
            ></div>
          </div>
        </div>
      </div>

      <div
        class="w-full col-span-full mt-6 bg-surface-2 border border-border/75 rounded-2xl p-6 shadow-xs"
      >
        <div
          class="flex flex-wrap sm:flex-nowrap items-center justify-center sm:justify-between gap-4 pb-4 border-b border-border/40"
        >
          <div>
            <h4 class="text-lg font-bold text-color flex items-center gap-2">
              <i class="ti ti-layers-intersect text-brand text-xl"></i>
              Mind Manager Breakdown
            </h4>
            <p class="text-xs text-secondary mt-0.5">
              Total ${totalItems} items (${totalPinned} pinned) across
              ${safeTags.length} active tag definitions.
            </p>
          </div>

          <div
            id="entity-tab-switcher"
            class="relative flex items-center p-1 bg-surface rounded-xl border border-border/80 shadow-inner overflow-x-auto"
          >
            <div
              id="entity-tab-indicator"
              class="absolute h-[calc(100%-8px)] top-1 left-1 bg-brand rounded-lg transition-all duration-300 ease-out shadow-xs pointer-events-none"
            ></div>

            <button
              data-entity-tab="notes"
              class="entity-tab-btn relative z-10 px-3.5 py-1.5 text-xs font-bold text-white transition cursor-pointer whitespace-nowrap"
            >
              Notes (${safeNotes.length})
            </button>
            <button
              data-entity-tab="snippets"
              class="entity-tab-btn relative z-10 px-3.5 py-1.5 text-xs font-bold text-secondary transition cursor-pointer whitespace-nowrap"
            >
              Snippets (${safeSnippets.length})
            </button>
            <button
              data-entity-tab="bookmarks"
              class="entity-tab-btn relative z-10 px-3.5 py-1.5 text-xs font-bold text-secondary transition cursor-pointer whitespace-nowrap"
            >
              Bookmarks (${safeBookmarks.length})
            </button>
            <button
              data-entity-tab="cheatsheets"
              class="entity-tab-btn relative z-10 px-3.5 py-1.5 text-xs font-bold text-secondary transition cursor-pointer whitespace-nowrap"
            >
              CheatSheets (${safeCheatSheets.length})
            </button>
          </div>
        </div>

        <div class="mt-6">
          <div
            id="tab-panel-notes"
            class="entity-panel space-y-3"
          >
            ${this.renderNotesList(safeNotes, safeTags)}
          </div>
          <div
            id="tab-panel-snippets"
            class="entity-panel hidden space-y-3"
          >
            ${this.renderSnippetsList(safeSnippets, safeTags)}
          </div>
          <div
            id="tab-panel-bookmarks"
            class="entity-panel hidden space-y-3"
          >
            ${this.renderBookmarksList(safeBookmarks, safeTags)}
          </div>
          <div
            id="tab-panel-cheatsheets"
            class="entity-panel hidden space-y-3"
          >
            ${this.renderCheatSheetsList(safeCheatSheets, safeTags)}
          </div>
        </div>
      </div>
    `;
  },

  _getCategoryBadgeHtml(category, itemType) {
    const badges = {
      notes: NOTE_CATEGORIES,
      snippets: SNIPPET_CATEGORIES,
      bookmarks: BOOKMARK_CATEGORIES,
      cheatsheets: CHEATSHEET_CATEGORIES,
    };

    const target = badges[itemType] || badges.notes;

    const matched = target.find((cat) => String(cat.id) === String(category));

    const catData = matched || {
      name: category || "General",
      icon: "ti ti-folder-filled text-secondary",
      class: "bg-surface text-secondary border-border/60",
    };

    const iconClass = catData.icon;

    return `
        <span
          class="h-5.5 inline-flex items-center gap-1 rounded-md border ${catData.class} px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider"
        >
          <i class="${iconClass} text-[10px] lg:text-xs pb-px"></i>
          <span>${catData.name}</span>
        </span>
      `;
  },

  _getTagsBadgeHtml(tagIds = [], allTags = []) {
    if (!Array.isArray(tagIds) || tagIds.length === 0) return "";
    const matchedTags = allTags.filter((tag) => tagIds.includes(tag.id));
    if (matchedTags.length === 0) return "";

    return `
      <div class="flex items-center gap-1.5 flex-wrap">
        ${matchedTags
          .map(
            (tag) => `
              <span
                class="h-5.5 inline-flex items-center gap-1 rounded-md bg-surface-3/50 px-2 py-0.5 text-xs text-secondary/80 border border-border/30"
              >
                <i class="ti ti-tag text-[10px] lg:text-xs pb-px"></i>
                <span>${tag.name}</span>
              </span>
            `,
          )
          .join("")}
      </div>
    `;
  },

  _getPinnedBadgeHtml(pinned) {
    if (!pinned) return "";
    return `
      <span
        class="h-5.5 inline-flex items-center gap-1 rounded-md border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-amber-400"
      >
        <i class="ti ti-pinned-filled text-[10px] lg:text-xs pb-px"></i> Pinned
      </span>
    `;
  },

  initTabSwitcher() {
    const switcher = document.getElementById("entity-tab-switcher");
    if (!switcher) return;

    const buttons = switcher.querySelectorAll(".entity-tab-btn");
    const indicator = document.getElementById("entity-tab-indicator");

    const updateTabState = (activeBtn) => {
      if (!activeBtn) return;

      if (indicator) {
        indicator.style.left = `${activeBtn.offsetLeft}px`;
        indicator.style.width = `${activeBtn.offsetWidth}px`;
      }

      buttons.forEach((btn) => {
        if (btn === activeBtn) {
          btn.classList.remove("text-secondary");
          btn.classList.add("text-white");
        } else {
          btn.classList.remove("text-white");
          btn.classList.add("text-secondary");
        }
      });

      const targetTab = activeBtn.dataset.entityTab;
      document.querySelectorAll(".entity-panel").forEach((panel) => {
        if (panel.id === `tab-panel-${targetTab}`) {
          panel.classList.remove("hidden");
        } else {
          panel.classList.add("hidden");
        }
      });
    };

    buttons.forEach((btn) => {
      btn.addEventListener("click", () => updateTabState(btn));
    });

    const initialActiveBtn = switcher.querySelector(
      '.entity-tab-btn[data-entity-tab="notes"]',
    );
    if (initialActiveBtn) {
      updateTabState(initialActiveBtn);
    }
  },

  renderNotesList(notes, tags) {
    const currentEmpty = emptyStateConfig["notes"];

    if (!Array.isArray(notes) || notes.length === 0) {
      return `<div
        class="min-h-50 bg-surface border border-dashed border-border rounded-2xl p-12 text-center flex flex-col items-center justify-center"
      >
        <div class="text-5xl mb-2 text-brand/70">${currentEmpty.icon}</div>
        <h2 class="text-lg font-bold text-color">${currentEmpty.title}</h2>
        <p class="mt-2 text-xs text-secondary max-w-sm mx-auto">
          ${currentEmpty.description}
        </p>
      </div>`;
    }
    return notes
      .map((note) => {
        const categoryBadge = this._getCategoryBadgeHtml(
          note.category,
          "notes",
        );
        const pinnedBadge = this._getPinnedBadgeHtml(note.pinned);
        const tagIdsHtml = this._getTagsBadgeHtml(note.tagIds, tags);

        return `
          <div
            class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl bg-surface/70 border border-border/50 hover:bg-surface transition group shadow-2xs"
          >
            <div class="min-w-0 flex-1">
              <div class="flex flex-wrap items-center gap-2 mb-1.5">
                ${categoryBadge} ${pinnedBadge} ${tagIdsHtml}
              </div>
              <h5
                class="text-sm font-bold text-color group-hover:text-sky-400 transition-colors truncate"
              >
                ${note.title}
              </h5>
              <p
                class="text-xs text-secondary/90 line-clamp-1 mt-0.5 font-normal"
              >
                ${note.content || "No content provided."}
              </p>
            </div>
            <div
              class="text-left shrink-0 text-[10px] text-secondary font-medium font-sans"
            >
              <span
                class="bg-surface px-2.5 py-1 rounded-lg border border-border/40 block"
                >ID: ${note.id}</span
              >
            </div>
          </div>
        `;
      })
      .join("");
  },

  renderSnippetsList(snippets, tags) {
    const currentEmpty = emptyStateConfig["snippets"];

    if (!Array.isArray(snippets) || snippets.length === 0) {
      return `<div
        class="min-h-50 bg-surface border border-dashed border-border rounded-2xl p-12 text-center flex flex-col items-center justify-center"
      >
        <div class="text-5xl mb-2 text-brand/70">${currentEmpty.icon}</div>
        <h2 class="text-lg font-bold text-color">${currentEmpty.title}</h2>
        <p class="mt-2 text-xs text-secondary max-w-sm mx-auto">
          ${currentEmpty.description}
        </p>
      </div>`;
    }
    return snippets
      .map((snippet) => {
        const categoryBadge = this._getCategoryBadgeHtml(
          snippet.category,
          "snippets",
        );
        const pinnedBadge = this._getPinnedBadgeHtml(snippet.pinned);
        const tagIdsHtml = this._getTagsBadgeHtml(snippet.tagIds, tags);

        return `
          <div
            class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl bg-surface/70 border border-border/50 hover:bg-surface transition group shadow-2xs"
          >
            <div class="min-w-0 flex-1">
              <div class="flex flex-wrap items-center gap-2 mb-1.5">
                ${categoryBadge} ${pinnedBadge} ${tagIdsHtml}
              </div>
              <h5
                class="text-sm font-bold text-color group-hover:text-purple-400 transition-colors truncate"
              >
                ${snippet.title}
              </h5>
              <p
                class="text-xs text-secondary/90 line-clamp-1 mt-0.5 font-normal"
              >
                ${snippet.description || "No description provided."}
              </p>
            </div>
            <div
              class="text-left shrink-0 text-[10px] text-secondary font-medium font-sans"
            >
              <span
                class="bg-surface px-2.5 py-1 rounded-lg border border-border/40 block"
                >ID: ${snippet.id}</span
              >
            </div>
          </div>
        `;
      })
      .join("");
  },

  renderBookmarksList(bookmarks, tags) {
    const currentEmpty = emptyStateConfig["bookmarks"];

    if (!Array.isArray(bookmarks) || bookmarks.length === 0) {
      return `<div
        class="min-h-50 bg-surface border border-dashed border-border rounded-2xl p-12 text-center flex flex-col items-center justify-center"
      >
        <div class="text-5xl mb-2 text-brand/70">${currentEmpty.icon}</div>
        <h2 class="text-lg font-bold text-color">${currentEmpty.title}</h2>
        <p class="mt-2 text-xs text-secondary max-w-sm mx-auto">
          ${currentEmpty.description}
        </p>
      </div>`;
    }
    return bookmarks
      .map((bookmark) => {
        const categoryBadge = this._getCategoryBadgeHtml(
          bookmark.category,
          "bookmarks",
        );
        const pinnedBadge = this._getPinnedBadgeHtml(bookmark.pinned);
        const tagIdsHtml = this._getTagsBadgeHtml(bookmark.tagIds, tags);

        return `
          <div
            class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl bg-surface/70 border border-border/50 hover:bg-surface transition group shadow-2xs"
          >
            <div class="min-w-0 flex-1">
              <div class="flex flex-wrap items-center gap-2 mb-1.5">
                <span
                  class="inline-flex items-center gap-1 rounded-md border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-400 uppercase tracking-wider"
                >
                  <i class="ti ti-world text-[10px] lg:text-xs pb-px"></i> ${
                    bookmark.domain || "link"
                  }
                </span>
                ${categoryBadge} ${pinnedBadge} ${tagIdsHtml}
              </div>
              <h5
                class="text-sm font-bold text-color group-hover:text-emerald-400 transition-colors truncate"
              >
                ${bookmark.title}
              </h5>
              <p
                class="text-xs text-secondary/90 line-clamp-1 mt-0.5 font-normal"
              >
                ${bookmark.url || bookmark.description || "No URL specified."}
              </p>
            </div>
            <div
              class="text-left shrink-0 text-[10px] text-secondary font-medium font-sans"
            >
              <span
                class="bg-surface px-2.5 py-1 rounded-lg border border-border/40 block"
                >ID: ${bookmark.id}</span
              >
            </div>
          </div>
        `;
      })
      .join("");
  },

  renderCheatSheetsList(cheatsheets, tags) {
    const currentEmpty = emptyStateConfig["cheatsheets"];

    if (!Array.isArray(cheatsheets) || cheatsheets.length === 0) {
      return `<div
        class="min-h-50 bg-surface border border-dashed border-border rounded-2xl p-12 text-center flex flex-col items-center justify-center"
      >
        <div class="text-5xl mb-2 text-brand/70">${currentEmpty.icon}</div>
        <h2 class="text-lg font-bold text-color">${currentEmpty.title}</h2>
        <p class="mt-2 text-xs text-secondary max-w-sm mx-auto">
          ${currentEmpty.description}
        </p>
      </div>`;
    }
    return cheatsheets
      .map((cheatsheet) => {
        const categoryBadge = this._getCategoryBadgeHtml(
          cheatsheet.category,
          "cheatsheets",
        );
        const pinnedBadge = this._getPinnedBadgeHtml(cheatsheet.pinned);
        const tagIdsHtml = this._getTagsBadgeHtml(cheatsheet.tagIds, tags);
        const itemCount = Array.isArray(cheatsheet.items)
          ? cheatsheet.items.length
          : 0;

        return `
          <div
            class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl bg-surface/70 border border-border/50 hover:bg-surface transition group shadow-2xs"
          >
            <div class="min-w-0 flex-1">
              <div class="flex flex-wrap items-center gap-2 mb-1.5">
                <span
                  class="h-5.5 inline-flex items-center gap-1 rounded-md border border-border/40 bg-surface px-2 py-0.5 text-[10px] font-bold text-secondary"
                >
                  ${itemCount} Items
                </span>
                ${categoryBadge} ${pinnedBadge} ${tagIdsHtml}
              </div>
              <h5
                class="text-sm font-bold text-color group-hover:text-amber-400 transition-colors truncate"
              >
                ${cheatsheet.title}
              </h5>
              <p
                class="text-xs text-secondary/90 line-clamp-1 mt-0.5 font-normal"
              >
                ${
                  cheatsheet.description || "No baseline configuration details."
                }
              </p>
            </div>
            <div
              class="text-left shrink-0 text-[10px] text-secondary font-medium font-sans"
            >
              <span
                class="bg-surface px-2.5 py-1 rounded-lg border border-border/40 block"
                >ID: ${cheatsheet.id}</span
              >
            </div>
          </div>
        `;
      })
      .join("");
  },
};
