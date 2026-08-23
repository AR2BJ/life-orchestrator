export const EditModalsComponent = {
  render() {
    return `
      <div
        id="edit-modal"
        class="fixed inset-0 z-50 hidden items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
      >
        <div
          class="bg-surface rounded-2xl p-4 lg:p-6 max-w-3xl w-full h-auto shadow-2xl flex flex-col border border-border overflow-hidden"
        >
          <div
            class="flex items-center justify-between border-b border-border pb-4 shrink-0"
          >
            <div class="flex items-center gap-3 min-w-0">
              <div
                class="w-10 h-10 lg:w-11 lg:h-11 rounded-xl lg:rounded-2xl bg-brand/10 text-brand/80 flex items-center justify-center text-base lg:text-lg shrink-0"
              >
                <i class="fa-regular fa-pen-to-square"></i>
              </div>

              <div class="min-w-0">
                <h3
                  class="text-sm lg:text-base font-bold text-color truncate"
                >
                  Edit Habit Details
                </h3>
                <p
                  class="text-[11px] w-40 xs:w-auto lg:text-xs text-secondary truncate"
                >
                  Update habit attributes.
                </p>
              </div>
            </div>

            <button
              id="cancel-edit-modal"
              type="button"
               class="w-8 h-8 lg:w-9 lg:h-9 rounded-lg lg:rounded-xl bg-surface-2 hover:bg-red-600/10 border border-border text-secondary hover:text-color flex items-center justify-center transition cursor-pointer shrink-0"
            >
              <i class="fa-regular fa-xmark text-sm"></i>
            </button>
          </div>

          <div class="flex-1 min-h-0 overflow-y-auto py-4 lg:py-5">
            <div class="space-y-4">
              <div>
                <label
                  for="edit-habit-input"
                  class="mb-1.5 block ps-3 text-xs font-semibold text-secondary"
                >
                  Habit name <span class="text-red-700">*</span>
                </label>

                <input
                  id="edit-habit-input"
                  type="text"
                  placeholder="What habit do you want to build or quit?...."
                  class="h-11 w-full rounded-xl border border-border bg-surface-2 px-4 text-sm text-color placeholder:text-secondary/70 transition focus:border-brand/80 focus:outline-none"
                />
              </div>

              <div class="grid grid-cols-1 gap-3.5 lg:grid-cols-2">
                <div class="w-full">
                  <div id="edit-category-wrapper"></div>
                </div>

                <div class="w-full">
                  <div id="edit-frequency-wrapper"></div>
                </div>
              </div>
            </div>
          </div>

          <div
            class="shrink-0 border-t border-border bg-surface/90 pt-3"
          >
            <div class="grid grid-cols-2 gap-3">
              <button
                id="cancel-edit"
                class="h-10 lg:h-11 rounded-lg lg:rounded-xl bg-surface-2 hover:border-primary text-secondary hover:text-color font-medium text-xs lg:text-sm transition border border-border cursor-pointer flex items-center justify-center"
              >
                Cancel
              </button>

              <button
                id="confirm-edit"
                class="h-10 lg:h-11 rounded-lg lg:rounded-xl bg-brand/80 hover:bg-brand text-white font-medium text-xs lg:text-sm transition shadow-md shadow-brand/10 cursor-pointer flex items-center justify-center gap-2"
              >
                <i class="fa-regular fa-check"></i> Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  },
};
