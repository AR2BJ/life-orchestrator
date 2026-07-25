export const EditModalsComponent = {
  render() {
    return `
      <div
        id="edit-modal"
        class="fixed inset-0 z-50 hidden items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
      >
        <div class="bg-surface rounded-2xl p-6 max-w-sm w-full shadow-xl flex flex-col gap-4">
          <div
            class="w-12 h-12 rounded-full bg-brand/10 text-brand/80 flex items-center justify-center text-xl mx-auto"
          >
            <i class="fa-regular fa-pen"></i>
          </div>

          <div class="text-center flex flex-col gap-1">
            <h3 class="text-lg font-bold text-primary">Edit Habit</h3>
            <p class="text-sm text-secondary">
              Change the habit title below.
            </p>
          </div>

          <input
            id="edit-habit-input"
            type="text"
            maxlength="50"
            class="w-full mt-2 px-4 py-3 rounded-xl bg-surface-2 border border-border text-primary placeholder:text-secondary outline-none focus:ring-2 focus:ring-brand/80"
          />

          <div class="grid grid-cols-2 gap-3 mt-2">
            <button
              id="cancel-edit"
              class="px-4 py-2.5 rounded-xl bg-(--color-surface-3) hover:border-primary  text-secondary hover:text-primary! font-medium text-sm transition border border-border cursor-pointer"
            >
              Cancel
            </button>

            <button
              id="confirm-edit"
              class="px-4 py-2.5 rounded-xl bg-brand/80 hover:bg-indigo-700/80! text-white font-medium text-sm transition shadow-sm cursor-pointer"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    `;
  },
};
