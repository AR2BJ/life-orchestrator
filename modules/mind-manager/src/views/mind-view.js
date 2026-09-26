export const MindView = {
  render() {
    return `
      <section
        id="mind-view"
        class="hidden w-full min-w-0 flex-col"
      >
        <div
          class="mb-6 flex flex-wrap sm:flex-nowrap gap-4 justify-center sm:justify-between items-center w-full"
        >
          <div
            class="relative flex flex-col w-full justify-center rounded-xl border border-border bg-surface p-1 sm:flex-row sm:w-fit sm:justify-start"
          >
            <div
              id="tab-indicator"
              class="absolute top-1 left-1 h-12 w-[calc(100%-8px)] rounded-lg bg-brand/80 transition-all duration-300 sm:h-[calc(100%-8px)] sm:w-27"
            ></div>

            <button
              id="tab-notes"
              data-tab="notes"
              class="relative z-10 flex-1 w-full rounded-t-xl py-2 text-sm font-medium text-(--color-btn-primary-text) transition cursor-pointer text-center sm:w-27 sm:rounded-l-xl sm:rounded-tr-none"
            >
              Notes
            </button>

            <button
              id="tab-snippets"
              data-tab="snippets"
              class="relative z-10 flex-1 w-full rounded-none py-2 text-sm font-medium text-secondary transition cursor-pointer text-center sm:w-27"
            >
              Snippets
            </button>

            <button
              id="tab-bookmarks"
              data-tab="bookmarks"
              class="relative z-10 flex-1 w-full rounded-none py-2 text-sm font-medium text-secondary transition cursor-pointer text-center sm:w-27"
            >
              Bookmarks
            </button>

            <button
              id="tab-cheatsheets"
              data-tab="cheatsheets"
              class="relative z-10 flex-1 w-full rounded-b-xl py-2 text-sm font-medium text-secondary transition cursor-pointer text-center sm:w-27 sm:rounded-r-xl sm:rounded-t-none"
            >
              CheatSheets
            </button>
          </div>

          <div class="relative w-full sm:w-72 group/search">
            <span
              class="absolute inset-y-0 left-0 flex items-center ps-3.5 pointer-events-none text-muted"
            >
              <i class="ti ti-search text-lg"></i>
            </span>
            <input
              type="text"
              id="search-mind"
              placeholder="Search items..."
              class="w-full ps-10 pe-10 py-3 text-sm rounded-xl border border-border bg-surface text-color placeholder:text-muted/70 focus:outline-none focus:border-brand/50 transition-all shadow-sm"
            />

            <div
              class="absolute inset-y-0 right-0 flex items-center pe-3 gap-2"
            >
              <button
                id="clear-search-btn"
                class="hidden opacity-0 scale-75 h-5 w-5 cursor-pointer items-center justify-center rounded-full border border-border bg-surface-2 hover:bg-surface-4 text-secondary hover:text-color transition-all duration-200"
                title="Clear Search"
              >
                <i class="ti ti-x text-[11px]"></i>
              </button>

              <kbd class="flex items-center pointer-events-none">
                <span
                  class="px-1.25 py-1 text-xs bg-surface-2 border border-border text-muted rounded-md shadow-2xs flex flex-row justify-center items-center"
                  ><i class="ti ti-slash"></i
                ></span>
              </kbd>
            </div>
          </div>
        </div>

        <div
          id="create-form-wrapper"
          class="w-full min-w-0 mb-6"
        >
          <div
            class="flex flex-col rounded-xl border border-border bg-surface transition-all overflow-hidden shadow-sm"
          >
            <button
              id="btn-toggle-mind-form"
              class="w-full px-5 py-4 flex flex-row items-center justify-between text-left font-bold text-slate-500/80 hover:bg-surface-2/40 transition cursor-pointer"
            >
              <div class="flex items-center gap-2">
                <i class="ti ti-square-rounded-plus text-brand/80 text-lg"></i>
                <span
                  id="form-toggle-title"
                  class="text-sm font-medium"
                  >Create New Note</span
                >
              </div>
              <div
                id="form-chevron"
                class="flex items-center"
              >
                <i
                  class="ti ti-chevron-down text-secondary text-lg transition-transform duration-300"
                ></i>
              </div>
            </button>

            <div
              id="mind-form-container"
              class="hidden p-5 bg-surface-2/20 animate-slide-down flex-col gap-4 rounded-b-2xl border-t border-border"
            >
              <div
                id="create-title-wrapper"
                class="mind-tab-fields flex w-full min-w-0 flex-col"
                data-tab-fields="notes,snippets,bookmarks,cheatsheets"
              >
                <label
                  for="create-item-title"
                  class="mb-1.5 block ps-3 text-xs font-semibold text-secondary"
                >
                  Title <span class="text-red-700">*</span>
                </label>
                <input
                  id="create-item-title"
                  type="text"
                  placeholder="Enter title..."
                  class="h-11 w-full rounded-xl border border-border bg-surface-2 px-4 text-sm text-color placeholder:text-secondary/70 transition focus:border-brand/80 focus:outline-none"
                />
              </div>

              <div
                id="create-notes-fields"
                class="mind-tab-fields flex flex-col gap-4"
                data-tab-fields="notes"
              >
                <div class="flex flex-col">
                  <label
                    for="create-note-content"
                    class="mb-1.5 block ps-3 text-xs font-semibold text-secondary"
                    >Content</label
                  >
                  <textarea
                    id="create-note-content"
                    rows="2"
                    placeholder="Write your note content here..."
                    class="w-full scrollbar-thin scrollbar-thumb-surface rounded-xl border border-border bg-surface-2 p-3 text-sm text-color placeholder:text-secondary/70 transition focus:border-brand/80 focus:outline-none resize-none"
                  ></textarea>
                </div>

                <div
                  class="flex flex-col sm:flex-row items-start sm:items-end gap-4 w-full"
                >
                  <div
                    id="create-note-category-autocomplete"
                    class="flex-1 w-full min-w-0"
                  ></div>
                  <div
                    id="create-note-tags-combobox"
                    class="flex-1 w-full min-w-0"
                  ></div>
                  <div class="shrink-0 pb-1">
                    <label
                      class="relative inline-flex items-center cursor-pointer gap-2.5 select-none"
                    >
                      <input
                        id="create-note-pinned"
                        type="checkbox"
                        class="sr-only peer"
                      />
                      <div
                        class="w-10 h-5.5 bg-surface-3 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4.5 after:w-4.5 after:transition-all peer-checked:bg-brand"
                      ></div>
                      <span
                        class="text-xs font-semibold text-secondary whitespace-nowrap"
                        >Pin Note</span
                      >
                    </label>
                  </div>
                </div>
              </div>

              <div
                id="create-snippets-fields"
                class="mind-tab-fields hidden flex-col gap-4"
                data-tab-fields="snippets"
              >
                <div class="flex flex-col">
                  <label
                    for="create-snippet-desc"
                    class="mb-1.5 block ps-3 text-xs font-semibold text-secondary"
                    >Description</label
                  >
                  <textarea
                    id="create-snippet-desc"
                    rows="2"
                    placeholder="Short description..."
                    class="w-full scrollbar-thin scrollbar-thumb-surface rounded-xl border border-border bg-surface-2 p-3 text-sm text-color placeholder:text-secondary/70 transition focus:border-brand/80 focus:outline-none resize-none"
                  ></textarea>
                </div>

                <div class="flex flex-col">
                  <div class="mb-1.5 flex items-center justify-between px-3">
                    <label
                      for="create-snippet-code"
                      class="text-xs font-semibold text-secondary"
                    >
                      Code <span class="text-red-700">*</span>
                    </label>
                  </div>

                  <div
                    class="group relative flex flex-col overflow-hidden rounded-xl border border-border bg-surface transition-all focus-within:border-brand/80 focus-within:ring-1 focus-within:ring-brand/30 shadow-inner"
                  >
                    <div
                      class="flex items-center justify-between border-b border-border bg-surface-3/50 px-3.5 py-2"
                    >
                      <div class="flex items-center gap-1.5">
                        <i class="ti ti-code text-brand text-base me-1"></i>
                        <span
                          class="font-mono text-[11px] font-medium text-muted"
                          >snippet.code</span
                        >
                      </div>

                      <div class="flex items-center gap-2">
                        <input
                          type="file"
                          id="snippet-file-input"
                          class="hidden"
                          accept=".js,.jsx,.ts,.tsx,.vue,.svelte,.html,.css,.scss,.py,.go,.rs,.sh,.sql,.json,.dockerfile,.yml,.yaml,.md,.graphql,.gql,.conf,.cypher,.surrealql,.splunk"
                        />

                        <div
                          id="snippet-file-loader"
                          class="hidden items-center gap-1.5 text-xs text-brand animate-pulse"
                        >
                          <i class="ti ti-loader-2 animate-spin"></i>
                          <span class="text-[11px]">Loading...</span>
                        </div>

                        <button
                          type="button"
                          id="btn-upload-snippet-file"
                          class="inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface px-2.5 py-1 text-xs font-medium text-secondary hover:text-color hover:bg-surface-4 transition cursor-pointer active:scale-95"
                          title="Upload file content"
                        >
                          <i class="ti ti-file-upload text-sm text-brand"></i>
                          <span>Upload File</span>
                        </button>
                      </div>
                    </div>

                    <textarea
                      id="create-snippet-code"
                      rows="4"
                      placeholder="// Paste or write your code here..."
                      spellcheck="false"
                      class="w-full min-h-30 bg-transparent p-3.5 font-mono text-sm leading-relaxed text-color placeholder:text-muted/60 focus:outline-none resize-y scrollbar-thin scrollbar-thumb-surface-3"
                      style="tab-size: 2;"
                    ></textarea>
                  </div>
                </div>

                <div
                  class="flex flex-col sm:flex-row items-start sm:items-end gap-4 w-full"
                >
                  <div
                    id="create-snippet-category-autocomplete"
                    class="flex-1 w-full min-w-0"
                  ></div>
                  <div
                    id="create-snippet-tags-combobox"
                    class="flex-1 w-full min-w-0"
                  ></div>
                  <div class="shrink-0 pb-1">
                    <label
                      class="relative inline-flex items-center cursor-pointer gap-2.5 select-none"
                    >
                      <input
                        id="create-snippet-pinned"
                        type="checkbox"
                        class="sr-only peer"
                      />
                      <div
                        class="w-10 h-5.5 bg-surface-3 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4.5 after:w-4.5 after:transition-all peer-checked:bg-brand"
                      ></div>
                      <span
                        class="text-xs font-semibold text-secondary whitespace-nowrap"
                        >Pin Snippet</span
                      >
                    </label>
                  </div>
                </div>
              </div>

              <div
                id="create-bookmarks-fields"
                class="mind-tab-fields hidden flex-col gap-4"
                data-tab-fields="bookmarks"
              >
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div class="flex flex-col">
                    <label
                      for="create-bookmark-url"
                      class="mb-1.5 block ps-3 text-xs font-semibold text-secondary"
                      >URL <span class="text-red-700">*</span></label
                    >
                    <input
                      id="create-bookmark-url"
                      type="url"
                      placeholder="https://example.com"
                      class="h-11 w-full rounded-xl border border-border bg-surface-2 px-4 text-sm text-color placeholder:text-secondary/70 transition focus:border-brand/80 focus:outline-none"
                    />
                  </div>
                  <div
                    id="create-bookmark-category-autocomplete"
                    class="w-full"
                  ></div>
                </div>

                <div class="flex flex-col">
                  <label
                    for="create-bookmark-desc"
                    class="mb-1.5 block ps-3 text-xs font-semibold text-secondary"
                    >Description</label
                  >
                  <textarea
                    id="create-bookmark-desc"
                    rows="2"
                    placeholder="Short description or notes about this link..."
                    class="w-full scrollbar-thin scrollbar-thumb-surface rounded-xl border border-border bg-surface-2 p-3 text-sm text-color placeholder:text-secondary/70 transition focus:border-brand/80 focus:outline-none resize-none"
                  ></textarea>
                </div>

                <div
                  class="flex flex-col sm:flex-row items-start sm:items-end gap-4 w-full"
                >
                  <div
                    id="create-bookmark-tags-combobox"
                    class="flex-1 w-full min-w-0"
                  ></div>
                  <div class="shrink-0 pb-1">
                    <label
                      class="relative inline-flex items-center cursor-pointer gap-2.5 select-none"
                    >
                      <input
                        id="create-bookmark-pinned"
                        type="checkbox"
                        class="sr-only peer"
                      />
                      <div
                        class="w-10 h-5.5 bg-surface-3 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4.5 after:w-4.5 after:transition-all peer-checked:bg-brand"
                      ></div>
                      <span
                        class="text-xs font-semibold text-secondary whitespace-nowrap"
                        >Pin Bookmark</span
                      >
                    </label>
                  </div>
                </div>
              </div>

              <div
                id="create-cheatsheets-fields"
                class="mind-tab-fields hidden flex-col gap-4"
                data-tab-fields="cheatsheets"
              >
                <div class="flex flex-col">
                  <label
                    for="create-cheatsheet-desc"
                    class="mb-1.5 block ps-3 text-xs font-semibold text-secondary"
                    >Description</label
                  >
                  <textarea
                    id="create-cheatsheet-desc"
                    rows="2"
                    placeholder="CheatSheet description..."
                    class="w-full scrollbar-thin scrollbar-thumb-surface rounded-xl border border-border bg-surface-2 p-3 text-sm text-color placeholder:text-secondary/70 transition focus:border-brand/80 focus:outline-none resize-none"
                  ></textarea>
                </div>

                <div
                  class="flex flex-col sm:flex-row items-start sm:items-end gap-4 w-full"
                >
                  <div
                    id="create-cheatsheet-category-autocomplete"
                    class="flex-1 w-full min-w-0"
                  ></div>
                  <div
                    id="create-cheatsheet-tags-combobox"
                    class="flex-1 w-full min-w-0"
                  ></div>
                  <div class="shrink-0 pb-1">
                    <label
                      class="relative inline-flex items-center cursor-pointer gap-2.5 select-none"
                    >
                      <input
                        id="create-cheatsheet-pinned"
                        type="checkbox"
                        class="sr-only peer"
                      />
                      <div
                        class="w-10 h-5.5 bg-surface-3 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4.5 after:w-4.5 after:transition-all peer-checked:bg-brand"
                      ></div>
                      <span
                        class="text-xs font-semibold text-secondary whitespace-nowrap"
                        >Pin CheatSheet</span
                      >
                    </label>
                  </div>
                </div>
              </div>

              <div
                class="flex flex-col gap-3 border-t border-border pt-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <p class="flex items-center gap-1.5 text-xs text-secondary">
                  <i
                    class="ti ti-info-square-rounded text-brand/80 text-base"
                  ></i>
                  Manage your knowledge, code snippets, and resources
                  effectively.
                </p>
                <button
                  id="add-plan-btn"
                  class="flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-brand/80 px-5 text-sm font-semibold text-white shadow-lg shadow-brand/10 transition hover:bg-(--color-brand-hover) cursor-pointer sm:w-auto"
                >
                  <i class="ti ti-plus text-base"></i>
                  <span id="add-plan-btn-text">Add Item</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div
          id="plan-filters-bar"
          class="flex flex-wrap lg:flex-nowrap items-stretch lg:items-center justify-between gap-6 border-b border-border pb-4 w-full"
        >
          <div class="relative flex flex-1 items-center gap-2 min-w-0 group">
            <p
              class="text-xs font-bold uppercase tracking-wider text-secondary shrink-0 me-1 hidden sm:flex"
            >
              Categories:
            </p>

            <div class="relative flex-1 min-w-0 flex items-center">
              <button
                id="btn-scroll-left"
                type="button"
                class="absolute left-0 z-20 hidden h-7 w-7 items-center justify-center rounded-lg border border-border bg-surface/95 backdrop-blur-xl shadow-2xl text-secondary hover:text-color transition-all cursor-pointer"
              >
                <i class="ti ti-chevron-left text-sm"></i>
              </button>

              <div
                id="category-filter-scroll"
                class="flex flex-1 min-w-0 flex-row items-center gap-2 overflow-x-auto px-1 scrollbar-none scroll-smooth transition-all duration-300"
              ></div>

              <button
                id="btn-scroll-right"
                type="button"
                class="absolute right-0 z-20 hidden h-7 w-7 items-center justify-center rounded-lg border border-border bg-surface/95 backdrop-blur-xl shadow-2xl text-secondary hover:text-color transition-all cursor-pointer"
              >
                <i class="ti ti-chevron-right text-sm"></i>
              </button>
            </div>
          </div>

          <div
            class="flex flex-wrap sm:flex-nowrap items-center justify-between sm:justify-end gap-3"
          >
            <div class="w-full flex flex-col xs:flex-row items-center gap-3">
              <div class="w-full flex items-center gap-2 min-w-35">
                <div
                  id="filter-autocomplete-wrapper"
                  class="w-full"
                ></div>
              </div>

              <div class="w-full flex items-center gap-2 min-w-35">
                <div
                  id="sort-autocomplete-wrapper"
                  class="w-full"
                ></div>
              </div>
            </div>

            <div
              id="mind-count-badge"
              class="shrink-0 flex justify-center items-center gap-1.5 px-4 py-1.5 bg-surface-3 rounded-xl text-xs font-bold text-color select-none w-full sm:w-36 lg:w-auto"
            >
              0 Items
            </div>
          </div>
        </div>

        <div
          id="mind-list"
          class="mt-6 w-full space-y-3"
        ></div>
      </section>
    `;
  },
};

function setupMindFiltersDragScroll() {
  const scrollContainer = document.getElementById("category-filter-scroll");
  const btnLeft = document.getElementById("btn-scroll-left");
  const btnRight = document.getElementById("btn-scroll-right");

  if (!scrollContainer || !btnLeft || !btnRight) return;

  const scrollStep = 180;

  btnLeft.addEventListener("click", (e) => {
    e.stopPropagation();
    scrollContainer.scrollBy({ left: -scrollStep, behavior: "smooth" });
  });

  btnRight.addEventListener("click", (e) => {
    e.stopPropagation();
    scrollContainer.scrollBy({ left: scrollStep, behavior: "smooth" });
  });

  const checkOverflowState = () => {
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainer;
    const hasOverflow = scrollWidth > clientWidth + 2;

    if (
      scrollContainer.offsetParent === null ||
      scrollContainer.clientWidth === 0
    ) {
      btnLeft.classList.replace("flex", "hidden");
      btnRight.classList.replace("flex", "hidden");
      scrollContainer.style.maskImage = "none";
      return;
    }

    if (!hasOverflow) {
      btnLeft.classList.replace("flex", "hidden");
      btnRight.classList.replace("flex", "hidden");
      scrollContainer.style.maskImage = "none";
      return;
    }

    const atStart = Math.ceil(scrollLeft) <= 2;
    const atEnd = Math.ceil(scrollLeft + clientWidth) >= scrollWidth - 2;

    btnLeft.classList.toggle("hidden", atStart);
    btnLeft.classList.toggle("flex", !atStart);

    btnRight.classList.toggle("hidden", atEnd);
    btnRight.classList.toggle("flex", !atEnd);

    const fadeWidth = "80px";

    if (atStart) {
      scrollContainer.style.maskImage = `linear-gradient(to right, black 0%, black calc(100% - ${fadeWidth}), transparent 100%)`;
    } else if (atEnd) {
      scrollContainer.style.maskImage = `linear-gradient(to right, transparent 0%, black ${fadeWidth}, black 100%)`;
    } else {
      scrollContainer.style.maskImage = `linear-gradient(to right, transparent 0%, black ${fadeWidth}, black calc(100% - ${fadeWidth}), transparent 100%)`;
    }
  };

  const triggerCheck = () => {
    requestAnimationFrame(() => {
      setTimeout(checkOverflowState, 100);
    });
  };

  scrollContainer.addEventListener("scroll", checkOverflowState);

  const mutationObserver = new MutationObserver(() => {
    triggerCheck();
  });
  mutationObserver.observe(scrollContainer, { childList: true, subtree: true });

  const viewSection = document.getElementById("mind-view");
  if (viewSection) {
    const sectionObserver = new MutationObserver(() => {
      if (!viewSection.classList.contains("hidden")) {
        triggerCheck();
      }
    });
    sectionObserver.observe(viewSection, {
      attributes: true,
      attributeFilter: ["class"],
    });
  }

  const resizeObserver = new ResizeObserver(() => {
    triggerCheck();
  });

  resizeObserver.observe(scrollContainer);

  if (viewSection) {
    resizeObserver.observe(viewSection);
  }

  window.addEventListener("resize", triggerCheck);
  window.addEventListener("load", triggerCheck);

  if (document.fonts?.ready) {
    document.fonts.ready.then(() => triggerCheck());
  }

  triggerCheck();
}

if (typeof window !== "undefined") {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      requestAnimationFrame(setupMindFiltersDragScroll);
    });
  } else {
    requestAnimationFrame(() => {
      requestAnimationFrame(setupMindFiltersDragScroll);
    });
  }
}
