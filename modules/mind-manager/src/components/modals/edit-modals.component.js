export const EditModalsComponent = {
  renderEmptyState(message, iconClass = "ti ti-list-check") {
    return `
      <div class="w-full min-h-32 bg-surface/50 rounded-xl border border-dashed border-border/70 p-4 text-center flex flex-col justify-center items-center">
        <div class="flex flex-col justify-center items-center">
          <div class="text-2xl text-brand/80">
            <i class="${iconClass}"></i>
          </div>
          <p class="mt-2 text-secondary max-w-sm mx-auto text-xs">
            ${message}
          </p>
        </div>
      </div>
    `;
  },

  renderCheatsheetItems(item) {
    const keyText = (item.key ?? "").replace(/"/g, "&quot;");
    const valText = (item.value ?? "").replace(/"/g, "&quot;");
    const descText = (item.description ?? "").replace(/"/g, "&quot;");

    return `
      <div
        data-item-id="${item.id}"
        class="item-row group flex items-center justify-between gap-3 p-3 bg-surface/80 hover:bg-surface border border-border/60 rounded-xl transition shadow-2xs"
      >
        <div class="flex flex-col min-w-0 flex-1 gap-0.5">
          <div class="flex items-center gap-2">
            <span
              class="font-mono font-semibold text-xs lg:text-sm text-color truncate"
            >
              ${keyText}
            </span>
          </div>
          ${
            descText
              ? `<span class="text-[11px] text-secondary/80 truncate">${descText}</span>`
              : ""
          }
        </div>

        <div class="flex items-center gap-1.5 shrink-0">
          ${
            valText
              ? `
                <span
                  class="h-7 sm:h-9 font-mono text-xs font-semibold px-2.5 py-1 rounded-xl bg-brand/10 text-brand border border-brand/20 tracking-wider select-all flex justify-center items-center gap-1.5"
                  title="${valText}"
                >
                  ${valText}
                </span>
              `
              : ""
          }

          <button
            type="button"
            data-action="copy-item"
            data-item-id="${item.id}"
            class="copy-btn h-7 w-7 sm:w-9 sm:h-9 flex items-center justify-center rounded-lg sm:rounded-xl border border-border bg-surface hover:bg-brand/10 hover:cursor-pointer transition"
            title="Copy Value"
          >
            <i class="ti ti-copy text-brand/80 text-sm lg:text-base"></i>
          </button>

          <button
            type="button"
            data-action="edit-item"
            data-item-id="${item.id}"
            class="edit-btn h-7 w-7 sm:w-9 sm:h-9 flex items-center justify-center rounded-lg sm:rounded-xl border border-border bg-surface hover:bg-blue-600/10 hover:cursor-pointer transition"
            title="Edit Item"
          >
            <i
              class="ti ti-edit-circle text-blue-500/80 text-sm lg:text-base"
            ></i>
          </button>

          <button
            type="button"
            data-action="delete-item"
            data-item-id="${item.id}"
            class="delete-btn flex h-7 w-7 sm:w-9 sm:h-9 items-center justify-center rounded-lg sm:rounded-xl border border-border bg-surface hover:bg-red-600/10 hover:cursor-pointer transition"
            title="Delete Item"
          >
            <i class="ti ti-trash text-red-500/80 text-sm lg:text-base"></i>
          </button>
        </div>
      </div>
    `;
  },

  render() {
    return `
      <div
        id="edit-modal"
        class="fixed inset-0 z-400 hidden items-center justify-center p-0 xs:p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
      >
        <div
          class="bg-surface rounded-2xl p-4 xs:p-6 max-w-3xl w-full h-auto shadow-2xl flex flex-col border border-border overflow-hidden"
        >
          <div
            class="flex items-center justify-between border-b border-border pb-4 shrink-0"
          >
            <div class="flex items-center gap-3 min-w-0">
              <div
                class="w-10 h-10 lg:w-11 lg:h-11 rounded-xl lg:rounded-2xl bg-brand/10 text-brand/80 flex items-center justify-center text-lg lg:text-xl shrink-0"
              >
                <i class="ti ti-edit-circle"></i>
              </div>
              <div class="min-w-0">
                <h3 class="text-sm lg:text-base font-bold text-color truncate">
                  Edit Mind Item
                </h3>
                <p
                  class="text-[11px] w-40 xs:w-auto lg:text-xs text-secondary truncate"
                >
                  Update item details, categories, content, and metadata.
                </p>
              </div>
            </div>

            <button
              id="cancel-edit-modal"
              type="button"
              class="w-8 h-8 lg:w-9 lg:h-9 rounded-lg lg:rounded-xl bg-surface-2 hover:bg-red-600/10 border border-border text-secondary hover:text-color flex items-center justify-center transition cursor-pointer shrink-0"
            >
              <i class="ti ti-x text-sm lg:text-base"></i>
            </button>
          </div>

          <div
            id="edit-accordion-group"
            class="flex-1 min-h-0 flex flex-col gap-3 py-4 overflow-y-auto scrollbar-thin scrollbar-thumb-surface-2 pe-1"
          >
            <div
              class="accordion-item flex flex-col rounded-2xl border border-border/60 bg-surface-2/60 overflow-hidden shrink-0 transition-all duration-300"
            >
              <button
                type="button"
                class="accordion-header w-full p-3.5 lg:p-4 border-b border-border flex items-center justify-between text-left cursor-pointer hover:bg-surface-2/80 transition"
              >
                <div class="flex items-center gap-3">
                  <div
                    class="flex h-9 w-9 lg:h-10 lg:w-10 self-start shrink-0 items-center justify-center rounded-lg lg:rounded-xl bg-brand/10 text-brand/80"
                  >
                    <i class="ti ti-file-description text-lg lg:text-xl"></i>
                  </div>
                  <div>
                    <h4 class="text-xs lg:text-sm font-semibold text-color">
                      Basic Details
                    </h4>
                    <p class="text-[10px] lg:text-xs leading-4 text-secondary">
                      Title, primary content and description.
                    </p>
                  </div>
                </div>
                <i
                  class="accordion-icon ti ti-chevron-up text-secondary text-lg lg:text-xl transition-transform duration-200"
                ></i>
              </button>

              <div class="accordion-content p-3.5 lg:p-4 flex flex-col gap-3.5">
                <div
                  id="edit-title-container"
                  class="mind-tab-field flex flex-col flex-1 min-w-0"
                  data-tab-fields="notes,snippets,bookmarks,cheatsheets"
                >
                  <label
                    for="edit-item-title"
                    class="mb-1.5 block ps-3 text-xs font-semibold text-secondary"
                  >
                    Title <span class="text-red-500">*</span>
                  </label>
                  <input
                    id="edit-item-title"
                    type="text"
                    placeholder="Enter title..."
                    class="h-11 w-full rounded-xl border border-border bg-surface px-4 text-sm text-color placeholder:text-secondary/70 transition focus:border-brand/80 focus:outline-none"
                  />
                </div>

                <div
                  id="edit-notes-basic"
                  class="mind-tab-field flex flex-col gap-3.5"
                  data-tab-fields="notes"
                >
                  <div class="flex flex-col">
                    <label
                      for="edit-note-content"
                      class="mb-1.5 block ps-3 text-xs font-semibold text-secondary"
                      >Content</label
                    >
                    <textarea
                      id="edit-note-content"
                      rows="3"
                      placeholder="Note content..."
                      class="w-full scrollbar-thin scrollbar-thumb-surface rounded-xl border border-border bg-surface p-3 text-sm text-color placeholder:text-secondary/70 focus:border-brand/80 focus:outline-none resize-none"
                    ></textarea>
                  </div>
                </div>

                <div
                  id="edit-snippets-basic"
                  class="mind-tab-field hidden flex-col gap-3.5"
                  data-tab-fields="snippets"
                >
                  <div class="flex flex-col">
                    <label
                      for="edit-snippet-desc"
                      class="mb-1.5 block ps-3 text-xs font-semibold text-secondary"
                      >Description</label
                    >
                    <textarea
                      id="edit-snippet-desc"
                      rows="2"
                      placeholder="Short description..."
                      class="w-full scrollbar-thin scrollbar-thumb-surface rounded-xl border border-border bg-surface p-3 text-sm text-color placeholder:text-secondary/70 transition focus:border-brand/80 focus:outline-none resize-none"
                    ></textarea>
                  </div>

                  <div class="flex flex-col">
                    <div class="mb-1.5 flex items-center justify-between px-3">
                      <label
                        for="edit-snippet-code"
                        class="text-xs font-semibold text-secondary"
                      >
                        Code <span class="text-red-500">*</span>
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
                            id="edit-snippet-file-input"
                            class="hidden"
                            accept=".js,.jsx,.ts,.tsx,.vue,.svelte,.html,.css,.scss,.py,.go,.rs,.sh,.sql,.json,.dockerfile,.yml,.yaml,.md,.graphql,.gql,.conf,.cypher,.surrealql,.splunk"
                          />

                          <div
                            id="edit-snippet-file-loader"
                            class="hidden items-center gap-1.5 text-xs text-brand animate-pulse"
                          >
                            <i class="ti ti-loader-2 animate-spin"></i>
                            <span class="text-[11px]">Loading...</span>
                          </div>

                          <button
                            type="button"
                            id="btn-upload-edit-snippet-file"
                            class="inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface px-2.5 py-1 text-xs font-medium text-secondary hover:text-color hover:bg-surface-4 transition cursor-pointer active:scale-95"
                            title="Upload file content"
                          >
                            <i class="ti ti-file-upload text-sm text-brand"></i>
                            <span>Upload File</span>
                          </button>
                        </div>
                      </div>

                      <textarea
                        id="edit-snippet-code"
                        rows="4"
                        placeholder="// Paste or write your code here..."
                        spellcheck="false"
                        class="w-full min-h-30 bg-transparent p-3.5 font-mono text-sm leading-relaxed text-color placeholder:text-muted/60 focus:outline-none resize-y scrollbar-thin scrollbar-thumb-surface-3"
                        style="tab-size: 2;"
                      ></textarea>
                    </div>
                  </div>
                </div>

                <div
                  id="edit-bookmarks-basic"
                  class="mind-tab-field hidden flex-col gap-3.5"
                  data-tab-fields="bookmarks"
                >
                  <div class="flex flex-col">
                    <label
                      for="edit-bookmark-url"
                      class="mb-1.5 block ps-3 text-xs font-semibold text-secondary"
                      >URL <span class="text-red-500">*</span></label
                    >
                    <input
                      id="edit-bookmark-url"
                      type="url"
                      placeholder="https://example.com"
                      class="h-11 w-full rounded-xl border border-border bg-surface px-4 text-sm text-color placeholder:text-secondary/70 focus:border-brand/80 focus:outline-none"
                    />
                  </div>

                  <div class="flex flex-col">
                    <label
                      for="edit-bookmark-desc"
                      class="mb-1.5 block ps-3 text-xs font-semibold text-secondary"
                      >Description</label
                    >
                    <textarea
                      id="edit-bookmark-desc"
                      rows="2"
                      placeholder="Description..."
                      class="w-full scrollbar-thin scrollbar-thumb-surface rounded-xl border border-border bg-surface p-3 text-sm text-color placeholder:text-secondary/70 focus:border-brand/80 focus:outline-none resize-none"
                    ></textarea>
                  </div>
                </div>

                <div
                  id="edit-cheatsheets-basic"
                  class="mind-tab-field hidden flex-col gap-3.5"
                  data-tab-fields="cheatsheets"
                >
                  <div class="flex flex-col">
                    <label
                      for="edit-cheatsheet-desc"
                      class="mb-1.5 block ps-3 text-xs font-semibold text-secondary"
                      >Description</label
                    >
                    <textarea
                      id="edit-cheatsheet-desc"
                      rows="2"
                      placeholder="Description..."
                      class="w-full scrollbar-thin scrollbar-thumb-surface rounded-xl border border-border bg-surface p-3 text-sm text-color placeholder:text-secondary/70 transition focus:border-brand/80 focus:outline-none resize-none"
                    ></textarea>
                  </div>
                </div>
              </div>
            </div>

            <div
              class="accordion-item flex flex-col rounded-2xl border border-border/60 bg-surface-2/60 overflow-hidden shrink-0 transition-all duration-300"
            >
              <button
                type="button"
                class="accordion-header w-full p-3.5 lg:p-4 border-b border-border flex items-center justify-between text-left cursor-pointer hover:bg-surface-2/80 transition"
              >
                <div class="flex items-center gap-3">
                  <div
                    class="flex h-9 w-9 lg:h-10 lg:w-10 self-start shrink-0 items-center justify-center rounded-lg lg:rounded-xl bg-brand/10 text-brand/80"
                  >
                    <i class="ti ti-tags text-lg lg:text-xl"></i>
                  </div>
                  <div>
                    <h4 class="text-xs lg:text-sm font-semibold text-color">
                      Classification & Meta
                    </h4>
                    <p class="text-[10px] lg:text-xs leading-4 text-secondary">
                      Categories, tags, and pinning preferences.
                    </p>
                  </div>
                </div>
                <i
                  class="accordion-icon ti ti-chevron-up text-secondary text-lg lg:text-xl transition-transform duration-200"
                ></i>
              </button>

              <div class="accordion-content p-3.5 lg:p-4 flex flex-col gap-3.5">
                <div
                  id="edit-notes-meta"
                  class="mind-tab-field flex flex-col gap-3.5"
                  data-tab-fields="notes"
                >
                  <div class="flex items-end gap-4 w-full">
                    <div
                      id="edit-note-category-autocomplete"
                      class="flex-1 min-w-0"
                    ></div>
                    <div class="shrink-0 pb-1">
                      <label
                        class="relative inline-flex items-center cursor-pointer gap-2.5 select-none"
                      >
                        <input
                          id="edit-note-pinned"
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
                  <div class="w-full">
                    <div
                      id="edit-note-tags-combobox"
                      class="w-full"
                    ></div>
                  </div>
                </div>

                <div
                  id="edit-snippets-meta"
                  class="mind-tab-field hidden flex-col gap-3.5"
                  data-tab-fields="snippets"
                >
                  <div class="flex items-end gap-4 w-full">
                    <div
                      id="edit-snippet-category-autocomplete"
                      class="flex-1 min-w-0"
                    ></div>
                    <div class="shrink-0 pb-1">
                      <label
                        class="relative inline-flex items-center cursor-pointer gap-2.5 select-none"
                      >
                        <input
                          id="edit-snippet-pinned"
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
                  <div class="w-full">
                    <div
                      id="edit-snippet-tags-combobox"
                      class="w-full"
                    ></div>
                  </div>
                </div>

                <div
                  id="edit-bookmarks-meta"
                  class="mind-tab-field hidden flex-col gap-3.5"
                  data-tab-fields="bookmarks"
                >
                  <div class="flex items-end gap-4 w-full">
                    <div
                      id="edit-bookmark-category-autocomplete"
                      class="flex-1 min-w-0"
                    ></div>
                    <div class="shrink-0 pb-1">
                      <label
                        class="relative inline-flex items-center cursor-pointer gap-2.5 select-none"
                      >
                        <input
                          id="edit-bookmark-pinned"
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
                  <div class="w-full">
                    <div
                      id="edit-bookmark-tags-combobox"
                      class="w-full"
                    ></div>
                  </div>
                </div>

                <div
                  id="edit-cheatsheets-meta"
                  class="mind-tab-field hidden flex-col gap-3.5"
                  data-tab-fields="cheatsheets"
                >
                  <div class="flex items-end gap-4 w-full">
                    <div
                      id="edit-cheatsheet-category-autocomplete"
                      class="flex-1 min-w-0"
                    ></div>
                    <div class="shrink-0 pb-1">
                      <label
                        class="relative inline-flex items-center cursor-pointer gap-2.5 select-none"
                      >
                        <input
                          id="edit-cheatsheet-pinned"
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
                  <div class="w-full">
                    <div
                      id="edit-cheatsheet-tags-combobox"
                      class="w-full"
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            <div
              id="edit-cheatsheet-items-accordion"
              class="accordion-item mind-tab-field hidden flex-col rounded-2xl border border-border/60 bg-surface-2/60 overflow-hidden shrink-0 transition-all duration-300"
              data-tab-fields="cheatsheets"
            >
              <button
                type="button"
                class="accordion-header w-full p-3.5 lg:p-4 border-b border-border flex items-center justify-between text-left cursor-pointer hover:bg-surface-2/80 transition"
              >
                <div class="flex items-center gap-3">
                  <div
                    class="flex h-9 w-9 lg:h-10 lg:w-10 self-start shrink-0 items-center justify-center rounded-lg lg:rounded-xl bg-brand/10 text-brand/80"
                  >
                    <i class="ti ti-list-details text-lg lg:text-xl"></i>
                  </div>
                  <div>
                    <h4 class="text-xs lg:text-sm font-semibold text-color">
                      CheatSheet Items
                    </h4>
                    <p class="text-[10px] lg:text-xs leading-4 text-secondary">
                      Manage key-value commands, shortcuts, or references.
                    </p>
                  </div>
                </div>
                <i
                  class="accordion-icon ti ti-chevron-up text-secondary text-lg lg:text-xl transition-transform duration-200"
                ></i>
              </button>

              <div class="accordion-content p-3.5 lg:p-4">
                <div class="w-full grid grid-cols-1 xs:grid-cols-2 gap-2">
                  <div class="flex-1 min-w-0">
                    <input
                      id="new-cs-item-key"
                      type="text"
                      placeholder="Key / Command (e.g. git commit)..."
                      class="w-full h-11 rounded-xl border border-border bg-surface px-3 text-sm text-color placeholder:text-secondary/70 focus:border-brand/80 focus:outline-none"
                    />
                  </div>

                  <div class="flex-1 min-w-0">
                    <input
                      id="new-cs-item-val"
                      type="text"
                      placeholder="Value / Shortcut (e.g. -m 'msg')..."
                      class="w-full h-11 rounded-xl border border-border bg-surface px-3 text-sm text-color placeholder:text-secondary/70 focus:border-brand/80 focus:outline-none"
                    />
                  </div>
                </div>

                <div class="flex items-center gap-2 w-full mt-2">
                  <div class="flex-1 min-w-0 flex">
                    <textarea
                      id="new-cs-item-desc"
                      rows="1"
                      placeholder="Enter description..."
                      class="w-full scrollbar-thin scrollbar-thumb-surface rounded-xl border border-border bg-surface p-3 text-sm text-color placeholder:text-secondary/70 transition focus:border-brand/80 focus:outline-none resize-none"
                    ></textarea>
                  </div>
                </div>

                <div
                  id="cs-form-actions"
                  class="w-full mt-3.5"
                >
                  <button
                    id="btn-add-cheatsheet-item"
                    type="button"
                    class="w-full h-10 rounded-xl bg-brand/10 text-brand/80 hover:bg-brand/20 font-semibold text-xs lg:text-sm flex items-center justify-center gap-1.5 transition cursor-pointer"
                  >
                    <i class="ti ti-plus text-base"></i>
                    Add Item
                  </button>
                </div>

                <div
                  id="cheatsheet-items-list"
                  class="w-full flex flex-col gap-2 mt-3.5"
                ></div>
              </div>
            </div>

            <div
              class="grid grid-cols-2 gap-3 pt-3 border-t border-border shrink-0 w-full bg-surface"
            >
              <button
                id="cancel-edit"
                type="button"
                class="h-10 lg:h-11 rounded-lg lg:rounded-xl bg-surface-2 hover:border-primary text-secondary hover:text-color font-medium text-xs lg:text-sm transition border border-border cursor-pointer flex items-center justify-center"
              >
                Cancel
              </button>

              <button
                id="confirm-edit"
                type="button"
                class="h-10 lg:h-11 rounded-lg lg:rounded-xl bg-brand/80 hover:bg-brand text-white font-medium text-xs lg:text-sm transition shadow-md shadow-brand/10 cursor-pointer flex items-center justify-center gap-2"
              >
                <i class="ti ti-check text-base lg:text-lg"></i> Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  },
};
