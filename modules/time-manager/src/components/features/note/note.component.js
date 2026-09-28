import { NoteModel } from "@/models/note.model.js";

export const NoteComponent = {
  render() {
    const items = NoteModel.getItems();

    return `
      <div
        class="bg-surface border border-border rounded-3xl p-5 shadow-xs flex flex-col gap-3"
      >
        <div
          class="flex items-center justify-between gap-3 pb-2 border-b border-border"
        >
          <div class="flex items-center gap-2 min-w-0 flex-1">
            <i class="ti ti-bulb text-brand shrink-0"></i>
            <span
              class="text-xs font-bold uppercase tracking-wider text-muted truncate"
            >
              Focus Quick Notes
            </span>
          </div>
          <span
            class="shrink-0 rounded-lg border border-border bg-surface-2 px-2.5 py-1 text-[11px] font-semibold text-secondary"
          >
            ${items.length} items
          </span>
        </div>

        <div class="relative flex items-center gap-2">
          <input
            id="note-input"
            type="text"
            placeholder="Catch a distraction or idea..."
            class="w-full bg-surface-2 border border-border/80 rounded-xl p-2.5 pe-20 text-xs text-color truncate placeholder:text-muted/60 focus:outline-none focus:border-brand/60 transition-colors"
            autocomplete="off"
          />
          <button
            id="btn-submit-note"
            class="absolute right-0 p-2.5 rounded-e-xl bg-brand/10 text-brand/80 transition hover:bg-brand/20 font-semibold text-xs flex items-center gap-1.5 shrink-0 cursor-pointer"
          >
            <i class="ti ti-plus pb-0.5"></i> Add
          </button>
        </div>

        <div
          class="flex flex-col gap-2 max-h-56 overflow-y-auto pe-1 scrollbar-thin"
        >
          ${
            items.length === 0
              ? ` <div class="w-full h-full min-h-24 bg-surface-2 rounded-2xl border border-dashed border-border p-4 text-center flex flex-col justify-center items-center">
                    <i class="ti ti-note text-brand/60 text-xl mb-1"></i>
                    <p class="text-secondary text-xs">
                      No quick notes yet.
                    </p>
                </div>`
              : items
                  .map((item) => {
                    const category = item.category || "general";
                    const dateStr = this.formatDate(
                      item.createdAt || item.updatedAt,
                    );

                    return `
                      <div
                        data-id="${item.id}"
                        class="group min-h-20 flex flex-col justify-between p-2.5 pb-1.5 rounded-xl bg-surface-2/80 hover:bg-surface-2 border border-border/50 hover:border-brand/40 transition-all duration-200 shadow-2xs"
                      >
                        <div
                          class="flex items-center justify-between pb-1.5 gap-2 min-w-0"
                        >
                          <span
                            class="text-xs font-semibold text-color truncate flex-1 tracking-tight"
                          >
                            ${this.escapeHtml(item.title)}
                          </span>

                          <span
                            class="shrink-0 px-2 py-0.5 rounded-md bg-brand/10 text-brand text-[9px] font-bold uppercase tracking-wider border border-brand/20"
                          >
                            ${this.escapeHtml(
                              this.formatCategoryLabel(category),
                            )}
                          </span>
                        </div>

                        <div
                          class="flex items-center justify-between gap-2 pt-1.5 border-t border-border/80 text-[10px] text-muted/80"
                        >
                          <div class="flex items-center gap-1">
                            <i
                              class="ti ti-calendar text-[11px] lg:text-xs pb-0.5 text-brand/70"
                            ></i>
                            <span>${this.escapeHtml(dateStr)}</span>
                          </div>

                          <button
                            data-action="delete"
                            class="delete-btn w-6 h-6 rounded-md bg-surface-2 hover:bg-red-600/10 border border-border flex items-center justify-center hover:cursor-pointer lg:opacity-0 group-hover:opacity-100 transition"
                            title="Delete Note"
                          >
                            <i class="ti ti-trash text-red-500/80 text-sm"></i>
                          </button>
                        </div>
                      </div>
                    `;
                  })
                  .join("")
          }
        </div>
      </div>
    `;
  },

  formatCategoryLabel(str) {
    if (!str) return "GENERAL";
    return str
      .replace(/([a-z])([A-Z])/g, "$1 $2")
      .replace(/[-_]/g, " ")
      .toUpperCase();
  },

  formatDate(dateInput) {
    if (!dateInput) return new Date().toISOString().split("T")[0];
    const date = new Date(dateInput);
    if (isNaN(date.getTime())) return String(dateInput);
    return date.toISOString().split("T")[0];
  },

  escapeHtml(str) {
    return (str || "").replace(/[&<>"']/g, (m) => {
      return {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;",
      }[m];
    });
  },
};
