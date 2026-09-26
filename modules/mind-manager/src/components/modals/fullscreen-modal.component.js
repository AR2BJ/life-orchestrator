export const FullscreenModalComponent = {
  render() {
    return `
      <div
        id="fullscreen-snippet-modal"
        class="fixed inset-0 z-400 hidden items-center justify-center p-0 xs:p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
      >
        <div
          class="bg-surface rounded-2xl p-4 xs:p-6 max-w-8xl w-full h-[95dvh] shadow-2xl flex flex-col border border-border overflow-hidden"
        >
          <div
            class="flex items-center justify-between border-b border-border pb-4 shrink-0"
          >
            <div class="flex items-center gap-3 min-w-0">
              <div
                class="w-10 h-10 lg:w-11 lg:h-11 rounded-xl lg:rounded-2xl bg-brand/10 text-brand/80 flex items-center justify-center text-lg lg:text-xl shrink-0"
              >
                <i class="ti ti-code"></i>
              </div>
              <div class="min-w-0">
                <h3
                  id="fullscreen-modal-title"
                  class="text-sm lg:text-base font-bold text-color truncate"
                >
                  Snippet Viewer
                </h3>
                <p
                  id="fullscreen-modal-subtitle"
                  class="text-[11px] lg:text-xs text-secondary truncate"
                >
                  Full view code inspector
                </p>
              </div>
            </div>

            <div class="flex items-center gap-2">
              <button
                type="button"
                id="fullscreen-modal-copy-btn"
                class="inline-flex items-center gap-1.5 px-3 py-2.25 rounded-xl bg-surface-2 hover:bg-brand/20 hover:text-brand border border-border text-xs font-semibold text-color transition cursor-pointer"
              >
                <i class="ti ti-copy text-sm"></i>
                <span>Copy Code</span>
              </button>

              <button
                type="button"
                id="fullscreen-modal-download-btn"
                class="inline-flex items-center gap-1.5 px-3 py-2.25 rounded-xl bg-surface-2 hover:bg-brand/20 hover:text-brand border border-border text-xs font-semibold text-color transition cursor-pointer"
              >
                <i class="ti ti-download text-sm"></i>
                <span>Download</span>
              </button>

              <button
                id="close-fullscreen-modal"
                type="button"
                class="w-8 h-8 lg:w-9 lg:h-9 rounded-lg lg:rounded-xl bg-surface-2 hover:bg-red-600/10 border border-border text-secondary hover:text-color flex items-center justify-center transition cursor-pointer shrink-0"
              >
                <i class="ti ti-x text-sm lg:text-base"></i>
              </button>
            </div>
          </div>

          <div class="flex-1 min-h-0 pt-4">
            <div
              class="relative flex overflow-auto scrollbar-thin scrollbar-thumb-surface-4 max-h-full p-4 rounded-xl bg-surface-2/60 border border-border/60 font-mono text-xs select-text zoom-140"
            >
              <div
                id="fullscreen-modal-line-numbers"
                class="line-numbers-col h-full shrink-0 flex flex-col pr-3 mr-3 border-r border-slate-700/60 select-none text-right text-slate-500 font-mono text-[12px] leading-[1.6]"
              ></div>
              <div
                id="fullscreen-modal-code-content"
                class="shiki-container code-content-col flex-1 font-mono text-[12px] leading-[1.6]"
              ></div>
            </div>
          </div>
        </div>
      </div>
    `;
  },
};
