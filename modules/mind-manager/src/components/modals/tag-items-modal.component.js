export const TagItemsModalComponent = {
  render() {
    return `
      <div
        id="tag-items-modal"
        class="fixed inset-0 z-400 hidden items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
      >
        <div
          class="bg-surface rounded-2xl p-4 sm:p-5 max-w-xl w-full max-h-[85dvh] shadow-2xl flex flex-col border border-border overflow-hidden transition-all"
        >
          <div
            class="flex items-center justify-between border-b border-border pb-3 shrink-0"
          >
            <div class="flex items-center gap-2.5 min-w-0">
              <div
                class="w-9 h-9 rounded-xl bg-brand/10 text-brand flex items-center justify-center text-lg shrink-0"
              >
                <i class="ti ti-tag"></i>
              </div>
              <div class="min-w-0">
                <div class="flex items-center gap-2">
                  <h3
                    id="tag-items-modal-title"
                    class="text-sm font-bold text-color truncate"
                  >
                    Tagged Items
                  </h3>
                </div>
                <p
                  id="tag-items-modal-subtitle"
                  class="text-[11px] text-secondary truncate"
                >
                  Associated entities
                </p>
              </div>
            </div>

            <button
              id="close-tag-items-modal"
              type="button"
              class="w-8 h-8 rounded-lg bg-surface-2 hover:bg-red-500/10 border border-border text-secondary hover:text-color flex items-center justify-center transition cursor-pointer shrink-0"
            >
              <i class="ti ti-x text-sm lg:text-base"></i>
            </button>
          </div>

          <div
            id="tag-items-modal-content"
            class="flex-1 min-h-0 pt-3 overflow-y-auto scrollbar-thin scrollbar-thumb-surface-4 space-y-4"
          ></div>
        </div>
      </div>
    `;
  },
};
