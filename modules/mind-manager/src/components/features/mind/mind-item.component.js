import { StateManager, state } from "@/models/state.model.js";
import {
  checkIsShortCode,
  getLineNumbersHtml,
  highlightWithShiki,
} from "@/utils/code-formatter";

import { capitalize } from "@/utils/helpers";

function formatCodeSize(codeStr) {
  if (!codeStr) return "0 B";
  const bytes = new Blob([codeStr]).size;
  if (bytes < 1024) return `${bytes} B`;
  return `${(bytes / 1024).toFixed(1)} KB`;
}

export const MindItemComponent = {
  // --- HELPERS ---

  _getCategoryBadgeHtml(category) {
    const categories = StateManager.getCategories();

    const matched = categories.find(
      (cat) => String(cat.id) === String(category),
    );

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

  _renderTagsHtml(tagIds) {
    const allTags = StateManager.getTags() || [];

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

  _renderActionButtons(data) {
    const itemName = state.activeTab.slice(0, state.activeTab.length - 1);

    return `
      <div class="shrink-0">
        <div class="hidden md:flex items-center gap-2">
          <button
            type="button"
            data-id="${data.id}"
            class="pin-${itemName}-btn w-9 h-9 rounded-lg bg-surface-2 hover:bg-amber-500/10 border border-border flex items-center justify-center cursor-pointer transition group"
            title="${data.pinned ? `Unpin ${capitalize(itemName)}` : `Pin ${capitalize(itemName)}`}"
          >
            <i
              class="ti ${data.pinned ? "ti-pinned-filled" : "ti-pin"} text-amber-400 group-hover:text-amber-400 text-base lg:text-lg transition-all"
            ></i>
          </button>

          <button
            type="button"
            data-id="${data.id}"
            class="edit-btn w-9 h-9 rounded-lg bg-surface-2 hover:bg-blue-600/10 border border-border flex items-center justify-center cursor-pointer transition group"
            title="Edit Item"
          >
            <i
              class="ti ti-edit-circle text-blue-500/80 text-base lg:text-lg group-hover:text-blue-500"
            ></i>
          </button>

          <button
            type="button"
            data-id="${data.id}"
            class="delete-btn w-9 h-9 rounded-lg bg-surface-2 hover:bg-red-600/10 border border-border flex items-center justify-center cursor-pointer transition group"
            title="Delete Item"
          >
            <i
              class="ti ti-trash text-red-500/80  text-base lg:text-lg group-hover:text-red-500"
            ></i>
          </button>
        </div>

        <div class="flex md:hidden relative dropdown-container">
          <button
            type="button"
            data-id="${data.id}"
            class="dropdown-toggle-btn h-8 w-8 rounded-lg border border-border text-secondary hover:text-color hover:bg-surface flex items-center justify-center transition shadow-sm cursor-pointer"
          >
            <i class="ti ti-dots-vertical  text-base lg:text-lg"></i>
          </button>

          <div
            data-id="${data.id}"
            class="dropdown-menu absolute right-0 mt-1.5 w-48 rounded-xl border border-border bg-surface p-1 shadow-xl hidden z-30 flex-col gap-0.5"
          >
            <button
              type="button"
              data-id="${data.id}"
              class="pin-${itemName}-btn flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-left text-xs font-medium border-0 bg-transparent text-secondary hover:text-color hover:bg-surface-2 transition cursor-pointer"
            >
              <i
                class="ti ${
                  data.pinned ? "ti-pinned-filled" : "ti-pin"
                } text-amber-400 text-xs"
              ></i>
              <span>${data.pinned ? `Unpin ${capitalize(itemName)}` : `Pin ${capitalize(itemName)}`}</span>
            </button>

            <button
              type="button"
              data-id="${data.id}"
              class="edit-btn flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-left text-xs font-medium border-0 bg-transparent text-secondary hover:text-color hover:bg-surface-2 transition cursor-pointer"
            >
              <i class="ti ti-edit-circle text-blue-500 text-xs"></i>
              <span>Edit Item</span>
            </button>

            <div class="my-0.5 border-t border-border/40"></div>

            <button
              type="button"
              data-id="${data.id}"
              class="delete-btn flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-left text-xs font-medium border-0 bg-transparent text-red-500 hover:bg-red-500/10 transition cursor-pointer"
            >
              <i class="ti ti-trash text-xs"></i>
              <span>Delete Item</span>
            </button>
          </div>
        </div>
      </div>
    `;
  },

  // --- MAIN RENDER ROUTER ---
  render(item, activeTab = "notes") {
    if (!item) return "";

    if (item.content !== undefined || activeTab === "notes") {
      return this.renderNote(item);
    }
    if (item.code !== undefined || activeTab === "snippets") {
      return this.renderSnippet(item);
    }
    if (item.url !== undefined || activeTab === "bookmarks") {
      return this.renderBookmark(item);
    }
    if (item.items !== undefined || activeTab === "cheatsheets") {
      return this.renderCheatSheet(item);
    }

    return this.renderNote(item);
  },

  renderNote(note) {
    const categoryBadge = this._getCategoryBadgeHtml(note.category);
    const tagIdsHtml = this._renderTagsHtml(note.tagIds);

    return `
      <div
        data-id="${note.id}"
        class="note-item relative flex flex-col justify-between gap-3 p-4 rounded-xl bg-surface-2/40 hover:bg-surface-2/60 transition-all border border-border/40 shadow-xs"
      >
        <div class="flex items-start justify-between gap-3">
          <div class="flex flex-col min-w-0 w-full gap-1.5">
            <div class="flex items-center gap-2 flex-wrap">
              ${categoryBadge}

              ${
                note.pinned
                  ? `<span
                      class="h-5.5 inline-flex items-center gap-1 rounded-md border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-amber-400"
                    >
                      <i class="ti ti-pinned-filled text-[10px] lg:text-xs pb-px"></i> Pinned
                    </span>`
                  : ""
              }

              ${tagIdsHtml}
            </div>

            <h3 class="text-base font-bold mt-1 text-color wrap-break-word">
              ${note.title || "Untitled Note"}
            </h3>

            ${
              note.content
                ? `<p
                    class="text-xs text-secondary/90 leading-relaxed wrap-break-word whitespace-pre-line mt-1"
                  >
                    ${note.content}
                  </p>`
                : ""
            }
          </div>

          ${this._renderActionButtons(note)}
        </div>

        <div
          class="pt-2 border-t border-border/40 flex items-center justify-between text-[11px] text-muted"
        >
          <span class="flex items-center gap-1.5">
            <i class="ti ti-calendar-time text-sm pb-0.5"></i>
            ${note.createdAt || "Recently"}
          </span>
        </div>
      </div>
    `;
  },

  renderSnippet(snippet) {
    const categories = StateManager.getCategories();

    const categoryBadge = this._getCategoryBadgeHtml(snippet.category);
    const tagIdsHtml = this._renderTagsHtml(snippet.tagIds);

    const categoryIcon =
      categories.find((c) => c.id === snippet.category)?.icon || "ti ti-code";
    const categoryFormat =
      categories.find((c) => c.id === snippet.category)?.format || "code";

    const lineNumbersHtml = snippet.code
      ? getLineNumbersHtml(snippet.code)
      : "";

    const codeSizeFormatted = formatCodeSize(snippet.code);

    const isShort = checkIsShortCode(snippet.code);

    if (snippet.code) {
      setTimeout(() => {
        highlightWithShiki(snippet.code, snippet.category)
          .then((html) => {
            const el = document.querySelector(
              `[data-shiki-id="${snippet.id}"]`,
            );
            if (el) {
              el.innerHTML = html;
            }
          })
          .catch((err) => console.error("Shiki Error:", err));
      }, 0);
    }

    return `
      <div
        data-id="${snippet.id}"
        class="snippet-item relative flex flex-col justify-between gap-3 p-4 rounded-xl bg-surface-2/40 hover:bg-surface-2/60 transition-all border border-border/40 shadow-xs"
      >
        <div class="flex items-start justify-between gap-3">
          <div class="flex flex-col min-w-0 w-full gap-1.5">
            <div class="flex items-center gap-2 flex-wrap">
              ${categoryBadge}
              
              ${
                snippet.pinned
                  ? `<span
                      class="h-5.5 inline-flex items-center gap-1 rounded-md border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-amber-400"
                    >
                      <i
                        class="ti ti-pinned-filled text-[10px] lg:text-xs pb-px"
                      ></i>
                      Pinned
                    </span>`
                  : ""
              }
              
              ${tagIdsHtml}
            </div>

            <h3 class="text-base font-bold mt-1 text-color wrap-break-word">
              ${snippet.title || "Untitled Snippet"}
            </h3>

            ${
              snippet.description
                ? `<p class="text-xs text-secondary/90 leading-relaxed wrap-break-word">${snippet.description}</p>`
                : ""
            }
          </div>

          ${this._renderActionButtons(snippet)}
        </div>

        ${
          snippet.code
            ? `
                <div
                  class="snippet-code-container relative mt-2 rounded-lg bg-surface border border-border/60 overflow-hidden font-mono text-xs shadow-inner"
                >
                  <div
                    data-snippet-accordion-id="${snippet.id}"
                    class="toggle-accordion-btn flex items-center justify-between px-3 py-2 bg-surface-3 border-b border-border/40 text-[11px] text-slate-400 select-none cursor-pointer hover:bg-surface-2 transition-colors"
                  >
                    <span
                      class="flex items-center gap-1.5 font-medium tracking-wider text-color"
                    >
                      <i class="${categoryIcon} text-xs lg:text-sm pb-0.75"></i>
                      <span class="text-[10px] lg:text-[11px]">
                        ${categoryFormat}
                      </span>
                    </span>

                    <div class="flex items-center gap-2">
                      <div
                        class="accordion-actions-group hidden items-center gap-2"
                      >
                        <span
                          class="text-[10px] text-muted font-sans border-r border-border/60 pr-2"
                        >
                          ${codeSizeFormatted}
                        </span>

                        <button
                          type="button"
                          data-copy-snippet-id="${snippet.id}"
                          class="copy-snippet-btn inline-flex items-center gap-1 px-2 py-1 rounded-md bg-surface hover:bg-brand/20 hover:text-brand text-color transition-colors border border-border/50 cursor-pointer"
                          title="Copy Code"
                        >
                          <i class="ti ti-copy text-xs pb-0.5"></i>
                          <span>Copy</span>
                        </button>

                        <button
                          type="button"
                          data-download-snippet-id="${snippet.id}"
                          class="download-snippet-btn inline-flex items-center gap-1 px-2 py-1 rounded-md bg-surface hover:bg-brand/20 hover:text-brand text-color transition-colors border border-border/50 cursor-pointer"
                          title="Download Code"
                        >
                          <i class="ti ti-download text-xs pb-0.5"></i>
                          <span>Download</span>
                        </button>

                        ${
                          isShort
                            ? ""
                            : `
                                <button
                                  type="button"
                                  data-fullscreen-snippet-id="${snippet.id}"
                                  class="fullscreen-snippet-btn inline-flex items-center gap-1 py-1 px-1.25 rounded-md bg-surface hover:bg-brand/20 hover:text-brand text-color transition-colors border border-border/50 cursor-pointer"
                                  title="Full Screen View"
                                >
                                  <i class="ti ti-maximize text-xs pb-px"></i>
                                </button>
                              `
                        }
                      </div>

                      <button
                        type="button"
                        class="chevron-btn text-slate-400 hover:text-color transition-transform duration-200 flex justify-center items-center cursor-pointer"
                      >
                        <i class="ti ti-chevron-down text-sm lg:text-lg"></i>
                      </button>
                    </div>
                  </div>

                  <div
                    id="accordion-body-${snippet.id}"
                    class="accordion-body hidden border-t border-border/40"
                  >
                    <div
                      class="code-scroll-wrapper relative flex overflow-x-auto max-h-70 p-3 select-text scrollbar-thin scrollbar-thumb-surface-3 "
                    >
                      <div
                        class="line-numbers-col h-full shrink-0 flex flex-col pr-3 mr-3 border-r border-slate-700/60 select-none text-right text-slate-500 font-mono text-[12px] leading-[1.6]"
                      >
                        ${lineNumbersHtml}
                      </div>

                      <div
                        data-shiki-id="${snippet.id}"
                        class="shiki-container code-content-col flex-1 font-mono text-[12px] leading-[1.6]"
                      >
                        <pre
                          class="m-0 p-0 bg-transparent text-slate-200 font-mono whitespace-pre"
                        ><code>${snippet.code}</code></pre>
                      </div>
                    </div>
                  </div>
                </div>
              `
            : ""
        }

        <div
          class="pt-2 border-t border-border/40 flex items-center justify-between text-[11px] text-muted"
        >
          <span class="flex items-center gap-1.5">
            <i class="ti ti-calendar-time text-sm pb-0.5"></i>
            ${snippet.createdAt || "Recently"}
          </span>
        </div>
      </div>
    `;
  },

  renderBookmark(bookmark) {
    const categoryBadge = this._getCategoryBadgeHtml(bookmark.category);
    const tagIdsHtml = this._renderTagsHtml(bookmark.tagIds);

    return `
      <div
        data-id="${bookmark.id}"
        class="bookmark-item relative flex flex-col justify-between gap-3 p-4 rounded-xl bg-surface-2/40 hover:bg-surface-2/60 transition-all border border-border/40"
      >
        <div class="flex items-start justify-between gap-3">
          <div class="flex flex-col min-w-0 w-full gap-1.5">
            <div class="flex items-center gap-2 flex-wrap">
              ${categoryBadge}

              ${
                bookmark.pinned
                  ? `<span
                      class="h-5.5 inline-flex items-center gap-1 rounded-md border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-amber-400"
                    >
                      <i class="ti ti-pinned-filled text-[10px] lg:text-xs pb-px"></i> Pinned
                    </span>`
                  : ""
              }

              ${tagIdsHtml}
            </div>

            <h3 class="text-base font-bold mt-1 text-color wrap-break-word">
              ${bookmark.title || "Untitled Bookmark"}
            </h3>

            ${
              bookmark.description
                ? `<p class="text-xs text-secondary/90 leading-relaxed wrap-break-word">${bookmark.description}</p>`
                : ""
            }
            ${
              bookmark.url
                ? `
                    <a
                      href="${bookmark.url}"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="w-fit flex flex-col justify-center text-xs text-brand font-medium break-all transition group"
                    >
                      <span class="flex items-center gap-0.5">
                        <i class="ti ti-external-link"></i>
                        <span>${bookmark.url}</span>
                      </span>
                      <span
                        class="h-px w-full bg-brand opacity-0 transition group-hover:opacity-100"
                      ></span>
                    </a>
                  `
                : ""
            }
          </div>

          ${this._renderActionButtons(bookmark)}
        </div>

        <div
          class="pt-2 border-t border-border/40 flex items-center justify-between text-[11px] text-muted"
        >
          <span class="flex items-center gap-1.5">
            <i class="ti ti-calendar-time text-sm pb-0.5"></i>
            ${bookmark.createdAt || "Recently"}
          </span>
        </div>
      </div>
    `;
  },

  renderCheatSheet(cheatSheet) {
    const categoryBadge = this._getCategoryBadgeHtml(cheatSheet.category);
    const tagIdsHtml = this._renderTagsHtml(cheatSheet.tagIds);
    const items = Array.isArray(cheatSheet.items) ? cheatSheet.items : [];

    return `
      <div
        data-id="${cheatSheet.id}"
        class="cheatsheet-item relative flex flex-col justify-between gap-3 p-4 lg:p-5 rounded-2xl bg-surface-2/40 hover:bg-surface-2/60 transition-all border border-border/40 shadow-xs"
      >
        <div class="flex items-start justify-between gap-3">
          <div class="flex flex-col min-w-0 w-full gap-1.5">
            <div class="flex items-center gap-2 flex-wrap">
              ${categoryBadge}

              ${
                cheatSheet.pinned
                  ? `<span
                      class="h-5.5 inline-flex items-center gap-1 rounded-md border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-amber-400"
                    >
                      <i class="ti ti-pinned-filled text-[10px] lg:text-xs pb-px"></i> Pinned
                    </span>`
                  : ""
              }

              ${tagIdsHtml}
            </div>

            <h3 class="text-base lg:text-lg font-bold mt-1 text-color wrap-break-word">
              ${cheatSheet.title || "Untitled CheatSheet"}
            </h3>

            ${
              cheatSheet.description
                ? `<p class="text-xs text-secondary/90 leading-relaxed wrap-break-word">${cheatSheet.description}</p>`
                : ""
            }
          </div>

          ${this._renderActionButtons(cheatSheet)}
        </div>

        ${
          items.length > 0
            ? `
                <div class="grid grid-cols-1 md:grid-cols-2 gap-2.5 mt-2">
                  ${items
                    .map(
                      (it) => `
                        <div
                          class="group/item flex items-center justify-between gap-3 p-2.5 rounded-xl bg-surface/90 hover:bg-surface border border-border/50 hover:border-brand/40 transition-all shadow-2xs"
                        >
                          <div class="flex flex-col min-w-0 flex-1 gap-1">
                            <div class="flex items-center gap-2">
                              <code
                                class="font-mono text-xs font-semibold text-brand bg-brand/10 border border-brand/20 px-2 py-0.5 rounded-md truncate max-w-full"
                              >
                                ${it.key || "-"}
                              </code>
                            </div>
                            ${
                              it.description
                                ? `<span class="text-[11px] text-secondary/80 truncate ps-0.5">${it.description}</span>`
                                : ""
                            }
                          </div>

                          ${
                            it.value
                              ? `
                                <div class="flex items-center gap-1.5 shrink-0">
                                  <span
                                    class="font-mono text-xs bg-surface-2 text-color/90 border border-border/60 px-2 py-1 rounded-lg select-all"
                                  >
                                    ${it.value}
                                  </span>
                                  <button
                                    type="button"
                                    data-copy-text="${
                                      it.value
                                        ? it.value.replace(/"/g, "&quot;")
                                        : ""
                                    }"
                                    class="copy-btn w-7 h-7 rounded-lg bg-surface-2 hover:bg-brand/10 hover:text-brand text-secondary border border-border/50 flex items-center justify-center transition cursor-pointer shrink-0"
                                    title="Copy value"
                                  >
                                    <i class="ti ti-copy text-xs"></i>
                                  </button>
                                </div>
                              `
                              : ""
                          }
                        </div>
                      `,
                    )
                    .join("")}
                </div>
              `
            : ""
        }

        <div
          class="pt-2.5 border-t border-border/40 flex items-center justify-between text-[11px] text-muted mt-1"
        >
          <span class="flex items-center gap-1.5">
            <i class="ti ti-calendar-time text-sm pb-0.5"></i>
            ${cheatSheet.createdAt || "Recently"}
          </span>
          <span class="flex items-center gap-1 font-medium text-secondary">
            <i class="ti ti-list-check text-xs"></i>
            ${items.length} items
          </span>
        </div>
      </div>
    `;
  },
};
