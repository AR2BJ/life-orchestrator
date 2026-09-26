import { HELP_SHORTCUTS } from "@/utils/constants/help-shortcuts.constants";

export const InfoModalComponent = {
  renderShortcutsData() {
    return HELP_SHORTCUTS.map(
      (group) => `
          <div
            class="text-[11px] font-bold text-brand uppercase tracking-wider mt-4 first:mt-0 mb-2 ps-1"
          >
            ${group.category}
          </div>
          <div class="space-y-2">
            ${group.items
              .map(
                (item) => `
                <div
                  class="flex items-center justify-between p-2.5 bg-surface-2 border border-border rounded-xl"
                >
                  <span
                    class="text-xs font-semibold text-secondary flex items-center gap-2"
                  >
                    <i class="ti ${item.icon} text-muted"></i>
                    ${item.label}
                  </span>
                  <div class="flex items-center gap-1 shrink-0">
                    ${item.keys
                      .map(
                        (keyGroup) => `
                          <div class="flex items-center gap-1">
                            ${keyGroup
                              .map(
                                (key) =>
                                  `<kbd
                                    class="px-2 py-0.5 text-[10px] font-bold text-color bg-surface border border-border rounded-md shadow-2xs"
                                    >${key}</kbd
                                  >`,
                              )
                              .join(
                                '<span class="text-[10px] text-muted">+</span>',
                              )}
                          </div>
                        `,
                      )
                      .join(
                        '<span class="text-[10px] text-muted mx-0.5">/</span>',
                      )}
                  </div>
                </div>
              `,
              )
              .join("")}
          </div>
        `,
    ).join("");
  },

  renderFeatureGuideData() {
    return `
      <div class="space-y-3">
        <div class="p-3.5 bg-surface-2 border border-border rounded-2xl">
          <h4
            class="text-xs font-bold text-brand uppercase tracking-wider flex items-center gap-1 mb-1.5"
          >
            <i class="ti ti-notebook text-sm lg:text-base"></i> Notes & Rich Text
          </h4>
          <p class="text-xs text-secondary leading-relaxed">
            Create structured notes, code snippets, and ideas. Pin important notes to keep them accessible at the top of your workspace.
          </p>
        </div>

        <div class="p-3.5 bg-surface-2 border border-border rounded-2xl">
          <h4
            class="text-xs font-bold text-blue-500/90 uppercase tracking-wider flex items-center gap-1 mb-1.5"
          >
            <i class="ti ti-code text-sm lg:text-base"></i> Code Snippets & Syntax
          </h4>
          <p class="text-xs text-secondary leading-relaxed">
            Store reusable code fragments categorized by programming languages or frameworks with clean formatting and one-click copy functionality.
          </p>
        </div>

        <div class="p-3.5 bg-surface-2 border border-border rounded-2xl">
          <h4
            class="text-xs font-bold text-emerald-500/90 uppercase tracking-wider flex items-center gap-1 mb-1.5"
          >
            <i class="ti ti-bookmark text-sm lg:text-base"></i> Bookmarks & External Links
          </h4>
          <p class="text-xs text-secondary leading-relaxed">
            Save essential links, documentation, and web resources with custom metadata and descriptions for quick reference.
          </p>
        </div>

        <div class="p-3.5 bg-surface-2 border border-border rounded-2xl">
          <h4
            class="text-xs font-bold text-purple-500/90 uppercase tracking-wider flex items-center gap-1 mb-1.5"
          >
            <i class="ti ti-file-text text-sm lg:text-base"></i> Interactive Cheatsheets
          </h4>
          <p class="text-xs text-secondary leading-relaxed">
            Build command line or short-key reference sheets with key-value pairs to fast-track your daily development workflow.
          </p>
        </div>

        <div class="p-3.5 bg-surface-2 border border-border rounded-2xl">
          <h4
            class="text-xs font-bold text-amber-500/90 uppercase tracking-wider flex items-center gap-1 mb-1.5"
          >
            <i class="ti ti-tags text-sm lg:text-base"></i> Dynamic Tags & Scope Binding
          </h4>
          <p class="text-xs text-secondary leading-relaxed">
            Organize knowledge using flexible tags. Tags dynamically adapt their scope (<kbd class="px-1.5 py-0.5 text-[10px] bg-surface border border-border rounded shadow-2xs">entityType</kbd>) and usage metrics based on assignments across entities.
          </p>
        </div>

        <div class="p-3.5 bg-surface-2 border border-border rounded-2xl">
          <h4
            class="text-xs font-bold text-rose-500/90 uppercase tracking-wider flex items-center gap-1 mb-1.5"
          >
            <i class="ti ti-database text-sm lg:text-base"></i> Local Storage & Backup
          </h4>
          <p class="text-xs text-secondary leading-relaxed">
            All items are persisted client-side in LocalStorage. Use Settings to export full JSON backups or sync state across sessions.
          </p>
        </div>
      </div>
    `;
  },

  render() {
    return `
      <div
        id="help-modal"
        class="fixed inset-0 z-400 hidden items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
      >
        <div
          id="help-modal-backdrop"
          class="absolute inset-0 cursor-pointer"
        ></div>

        <div
          class="relative w-full max-w-xl bg-surface border border-border rounded-3xl p-6 shadow-2xl flex flex-col max-h-[85dvh] overflow-hidden"
        >
          <div
            class="flex justify-between items-center mb-4 pb-3 border-b border-border shrink-0"
          >
            <div class="flex items-center gap-3">
              <div
                class="w-10 h-10 rounded-xl bg-brand/10 text-brand flex items-center justify-center text-lg shrink-0"
              >
                <i class="ti ti-help text-lg lg:text-xl"></i>
              </div>
              <div>
                <h3 class="text-base font-bold text-color">
                  Mind Manager Help Center
                </h3>
                <p class="text-xs text-secondary">
                  System guide, editing tips, and keyboard shortcuts.
                </p>
              </div>
            </div>
            <button
              id="close-help-modal"
              type="button"
              class="w-8 h-8 rounded-xl bg-surface-2 hover:bg-surface-3 border border-border text-secondary hover:text-color flex items-center justify-center transition cursor-pointer"
            >
              <i class="ti ti-x text-sm lg:text-base"></i>
            </button>
          </div>

          <div
            class="flex border-b border-border p-1 bg-surface-2 rounded-xl mb-4 shrink-0 gap-1.5"
          >
            <button
              id="tab-help-safeguard"
              class="flex-1 py-2 text-xs font-bold rounded-lg bg-brand text-white transition cursor-pointer flex justify-center items-center"
            >
              <i class="ti ti-list-check me-1.5 text-sm lg:text-base"></i> Feature Guide
            </button>
            <button
              id="tab-help-shortcuts"
              class="flex-1 py-2 text-xs font-bold rounded-lg text-secondary hover:text-color transition cursor-pointer flex justify-center items-center"
            >
              <i class="ti ti-keyboard me-1.5 text-sm lg:text-base"></i> Keyboard Shortcuts
            </button>
          </div>

          <div
            class="flex-1 overflow-y-auto pe-1 scrollbar-thin scrollbar-thumb-surface-2"
            id="help-modal-content"
          >
            <div
              id="content-help-safeguard"
            >
              ${InfoModalComponent.renderFeatureGuideData()}
            </div>

            <div
              id="content-help-shortcuts"
              class="hidden"
            >
              ${InfoModalComponent.renderShortcutsData()}
            </div>
          </div>

          <div
            class="flex justify-end mt-4 pt-3 border-t border-border shrink-0"
          >
            <button
              id="btn-close-help"
              type="button"
              class="w-full sm:w-auto px-5 py-2 text-xs font-bold rounded-xl bg-brand text-white hover:bg-(--color-brand-hover) transition cursor-pointer"
            >
              Got it, Thanks!
            </button>
          </div>
        </div>
      </div>
    `;
  },
};
