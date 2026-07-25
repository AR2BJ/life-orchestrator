export const InfoModalComponent = {
  render() {
    return `
      <div
        id="help-modal"
        class="min-h-screen fixed inset-0 z-50 hidden items-center justify-center animate-fade-in"
      >
        <div
          id="help-modal-backdrop"
          class="absolute inset-0 bg-black/60 backdrop-blur-sm cursor-pointer"
        ></div>

        <div
          class="relative w-full max-w-lg mx-4 bg-surface border border-border rounded-3xl p-6 shadow-2xl transition-all scale-95 flex flex-col h-120"
        >
          <div
            class="flex justify-between items-center mb-4 border-b border-border pb-3 shrink-0"
          >
            <div class="flex items-center gap-2">
              <i
                class="fa-regular fa-square-terminal text-brand/80 text-lg"
              ></i>
              <h2 class="text-lg font-bold text-primary">Application Center</h2>
            </div>
            <button
              id="close-help-modal"
              class="w-8 h-8 rounded-lg bg-surface-2 hover:bg-red-600/10 border border-border text-secondary hover:text-primary flex items-center justify-center transition cursor-pointer"
            >
              <i class="fa-regular fa-xmark text-sm"></i>
            </button>
          </div>

          <div
            class="flex flex-col md:flex-row border-b border-border/60 p-1 bg-surface-2 rounded-xl mb-4 shrink-0"
          >
            <button
              id="tab-help-safeguard"
              class="flex-1 text-center py-2 text-xs font-bold rounded-lg bg-surface text-primary border border-border/40 shadow-sm transition cursor-pointer"
            >
              <i class="fa-regular fa-shield-halved me-1"></i> Safeguard Guide
            </button>
            <button
              id="tab-help-shortcuts"
              class="flex-1 text-center py-2 text-xs font-bold rounded-lg text-secondary hover:text-primary transition cursor-pointer"
            >
              <i class="fa-regular fa-keyboard me-1"></i> Keyboard Shortcuts
            </button>
          </div>

          <div
            class="overflow-y-auto pr-1 scroll-smooth scrollbar-thin scrollbar-thumb-surface-2"
            id="help-modal-content"
          >
            <div
              id="content-help-safeguard"
              class="flex flex-col gap-3"
            >
              <div
                class="p-3 bg-amber-500/5 border border-amber-500/10 rounded-xl"
              >
                <h4
                  class="text-sm font-bold text-amber-500/80 uppercase tracking-wide"
                >
                  <i class="fa-regular fa-lightbulb"></i> Core Feature: Skip Day
                </h4>
                <p class="text-sm text-secondary mt-1 leading-relaxed">
                  <strong>Double-click</strong> on today or yesterday inside any
                  calendar cell to toggle a
                  <span class="text-amber-500/80 font-semibold"
                    >Skip Day (Leave)</span
                  >. This colorizes the cell in amber and locks your streak
                  state.
                </p>
              </div>

              <div
                class="p-3 bg-emerald-500/5 border border-emerald-500/10 rounded-xl"
              >
                <h4
                  class="text-sm font-bold text-emerald-500/80 uppercase tracking-wide"
                >
                  <i class="fa-regular fa-bullseye-arrow"></i> Normal Check-In
                </h4>
                <p class="text-sm text-secondary mt-1 leading-relaxed">
                  A single <strong>Left-Click</strong> handles a standard
                  success check-in, keeping the interface fluid and incredibly
                  native.
                </p>
              </div>
            </div>

            <div
              id="content-help-shortcuts"
              class="hidden space-y-2.5 overflow-y-auto pr-1"
            >
              <div
                class="text-[10px] font-bold text-brand/80 uppercase tracking-wider mb-1 pl-1"
              >
                Navigation
              </div>

              <div
                class="flex items-center justify-between p-2.5 bg-surface-2/60 border border-border/50 rounded-xl"
              >
                <span
                  class="text-xs font-semibold text-secondary flex items-center gap-2"
                >
                  <i class="fa-regular fa-rectangle-history text-muted"></i> Go
                  to Habits View
                </span>
                <div class="flex items-center gap-1">
                  <kbd
                    class="px-2 py-1 text-[10px] font-mono font-bold text-primary bg-surface border border-border shadow-sm rounded-md"
                    >Shift</kbd
                  >
                  <span class="text-[10px] text-muted">+</span>
                  <kbd
                    class="px-2 py-1 text-[10px] font-mono font-bold text-primary bg-surface border border-border shadow-sm rounded-md"
                    >H</kbd
                  >
                </div>
              </div>

              <div
                class="flex items-center justify-between p-2.5 bg-surface-2/60 border border-border/50 rounded-xl"
              >
                <span
                  class="text-xs font-semibold text-secondary flex items-center gap-2"
                >
                  <i class="fa-regular fa-chart-mixed text-muted"></i> Go to
                  Analytics Dashboard
                </span>
                <div class="flex items-center gap-1">
                  <kbd
                    class="px-2 py-1 text-[10px] font-mono font-bold text-primary bg-surface border border-border shadow-sm rounded-md"
                    >Shift</kbd
                  >
                  <span class="text-[10px] text-muted">+</span>
                  <kbd
                    class="px-2 py-1 text-[10px] font-mono font-bold text-primary bg-surface border border-border shadow-sm rounded-md"
                    >A</kbd
                  >
                </div>
              </div>

              <div
                class="flex items-center justify-between p-2.5 bg-surface-2/60 border border-border/50 rounded-xl"
              >
                <span
                  class="text-xs font-semibold text-secondary flex items-center gap-2"
                >
                  <i class="fa-regular fa-sliders text-muted"></i> Go to App
                  Settings
                </span>
                <div class="flex items-center gap-1">
                  <kbd
                    class="px-2 py-1 text-[10px] font-mono font-bold text-primary bg-surface border border-border shadow-sm rounded-md"
                    >Shift</kbd
                  >
                  <span class="text-[10px] text-muted">+</span>
                  <kbd
                    class="px-2 py-1 text-[10px] font-mono font-bold text-primary bg-surface border border-border shadow-sm rounded-md"
                    >S</kbd
                  >
                </div>
              </div>

              <div
                class="text-[10px] font-bold text-brand/80 uppercase tracking-wider mt-3 mb-1 pl-1"
              >
                Quick Actions
              </div>

              <div
                class="flex items-center justify-between p-2.5 bg-surface-2/60 border border-border/50 rounded-xl"
              >
                <span
                  class="text-xs font-semibold text-secondary flex items-center gap-2"
                >
                  <i class="fa-regular fa-chevron-square-up text-muted"></i>
                  Scrolling To Top
                </span>
                <div class="flex items-center gap-1">
                  <kbd
                    class="px-2 py-1 text-[10px] font-mono font-bold text-primary bg-surface border border-border shadow-sm rounded-md"
                    >Alt</kbd
                  >
                  <span class="text-xs text-muted">+</span>
                  <kbd
                    class="px-2 py-1 text-[10px] font-mono font-bold text-primary bg-surface border border-border shadow-sm rounded-md"
                    >B</kbd
                  >
                </div>
              </div>

              <div
                class="flex items-center justify-between p-2.5 bg-surface-2/60 border border-border/50 rounded-xl"
              >
                <span
                  class="text-xs font-semibold text-secondary flex items-center gap-2"
                >
                  <i class="fa-regular fa-square-minus text-muted"></i> Collapse
                  / Expand Habit Creation Form
                </span>
                <div class="flex items-center gap-1">
                  <kbd
                    class="px-2 py-1 text-[10px] font-mono font-bold text-primary bg-surface border border-border shadow-sm rounded-md"
                    >Alt</kbd
                  >
                  <span class="text-xs text-muted">+</span>
                  <kbd
                    class="px-2 py-1 text-[10px] font-mono font-bold text-primary bg-surface border border-border shadow-sm rounded-md"
                    >C</kbd
                  >
                </div>
              </div>

              <div
                class="flex items-center justify-between p-2.5 bg-surface-2/60 border border-border/50 rounded-xl"
              >
                <span
                  class="text-xs font-semibold text-secondary flex items-center gap-2"
                >
                  <i class="fa-regular fa-circle-half-stroke text-muted"></i>
                  Toggle Dark/Light Theme
                </span>
                <div class="flex items-center gap-1">
                  <kbd
                    class="px-2 py-1 text-[10px] font-mono font-bold text-primary bg-surface border border-border shadow-sm rounded-md"
                    >Alt</kbd
                  >
                  <span class="text-xs text-muted">+</span>
                  <kbd
                    class="px-2 py-1 text-[10px] font-mono font-bold text-primary bg-surface border border-border shadow-sm rounded-md"
                    >T</kbd
                  >
                </div>
              </div>

              <div
                class="flex items-center justify-between p-2.5 bg-surface-2/60 border border-border/50 rounded-xl"
              >
                <span
                  class="text-xs font-semibold text-secondary flex items-center gap-2"
                >
                  <i class="fa-regular fa-bars text-muted"></i>
                  Toggle Navigation Menu
                </span>
                <div class="flex items-center gap-1">
                  <kbd
                    class="px-2 py-1 text-[10px] font-mono font-bold text-primary bg-surface border border-border shadow-sm rounded-md"
                    >Alt</kbd
                  >
                  <span class="text-xs text-muted">+</span>
                  <kbd
                    class="px-2 py-1 text-[10px] font-mono font-bold text-primary bg-surface border border-border shadow-sm rounded-md"
                    >N</kbd
                  >
                </div>
              </div>

              <div
                class="flex items-center justify-between p-2.5 bg-surface-2/60 border border-border/50 rounded-xl"
              >
                <span
                  class="text-xs font-semibold text-secondary flex items-center gap-2"
                >
                  <i class="fa-regular fa-arrow-rotate-left text-muted"></i>
                  Open Reset Data Modal
                </span>
                <div class="flex items-center gap-1">
                  <kbd
                    class="px-2 py-1 text-[10px] font-mono font-bold text-primary bg-surface border border-border shadow-sm rounded-md"
                    >Alt</kbd
                  >
                  <span class="text-xs text-muted">+</span>
                  <kbd
                    class="px-2 py-1 text-[10px] font-mono font-bold text-primary bg-surface border border-border shadow-sm rounded-md"
                    >R</kbd
                  >
                </div>
              </div>

              <div
                class="flex items-center justify-between p-2.5 bg-surface-2/60 border border-border/50 rounded-xl"
              >
                <span
                  class="text-xs font-semibold text-secondary flex items-center gap-2"
                >
                  <i class="fa-regular fa-xmark text-muted"></i> Close Active
                  Modal / Blur Input
                </span>
                <kbd
                  class="px-2 py-1 text-[10px] font-mono font-bold text-primary bg-surface border border-border shadow-sm rounded-md"
                  >Esc</kbd
                >
              </div>

              <div
                class="text-[10px] font-bold text-brand/80 uppercase tracking-wider mt-3 mb-1 pl-1"
              >
                Filters & Global
              </div>

              <div
                class="flex items-center justify-between p-2.5 bg-surface-2/60 border border-border/50 rounded-xl"
              >
                <span
                  class="text-xs font-semibold text-secondary flex items-center gap-2"
                >
                  <i class="fa-regular fa-magnifying-glass text-muted"></i>
                  Quick Search / Filter
                </span>
                <kbd
                  class="px-2 py-1 text-[10px] font-mono font-bold text-primary bg-surface border border-border shadow-sm rounded-md"
                  >/</kbd
                >
              </div>

              <div
                class="flex items-center justify-between p-2.5 bg-surface-2/60 border border-border/50 rounded-xl"
              >
                <span
                  class="text-xs font-semibold text-secondary flex items-center gap-2"
                >
                  <i class="fa-regular fa-eye text-muted"></i> Switch Tab View
                  (Active / Archived)
                </span>
                <div class="flex items-center gap-1">
                  <kbd
                    class="px-2 py-1 text-[10px] font-mono font-bold text-primary bg-surface border border-border shadow-sm rounded-md"
                    >Alt</kbd
                  >
                  <span class="text-xs text-muted">+</span>
                  <kbd
                    class="px-2 py-1 text-[10px] font-mono font-bold text-primary bg-surface border border-border shadow-sm rounded-md"
                    >A</kbd
                  >
                  <span class="text-[10px] text-muted">/</span>
                  <kbd
                    class="px-2 py-1 text-[10px] font-mono font-bold text-primary bg-surface border border-border shadow-sm rounded-md"
                    >X</kbd
                  >
                </div>
              </div>

              <div
                class="flex items-center justify-between p-2.5 bg-surface-2/60 border border-border/50 rounded-xl"
              >
                <span
                  class="text-xs font-semibold text-secondary flex items-center gap-2"
                >
                  <i class="fa-regular fa-chart-line text-muted"></i> Switch
                  Chart View (Weekly / Monthly / Yearly)
                </span>
                <div class="flex items-center gap-1">
                  <kbd
                    class="px-2 py-1 text-[10px] font-mono font-bold text-primary bg-surface border border-border shadow-sm rounded-md"
                    >Alt</kbd
                  >
                  <span class="text-xs text-muted">+</span>
                  <kbd
                    class="px-2 py-1 text-[10px] font-mono font-bold text-primary bg-surface border border-border shadow-sm rounded-md"
                    >1 - 3</kbd
                  >
                </div>
              </div>

              <div
                class="flex items-center justify-between p-2.5 bg-surface-2/60 border border-border/50 rounded-xl"
              >
                <span
                  class="text-xs font-semibold text-secondary flex items-center gap-2"
                >
                  <i class="fa-regular fa-filter text-muted"></i> Quick Category
                  Select (Habits View)
                </span>
                <kbd
                  class="px-2 py-1 text-[10px] font-mono font-bold text-primary bg-surface border border-border shadow-sm rounded-md"
                  >0 - 9 / 10</kbd
                >
              </div>

              <div
                class="flex items-center justify-between p-2.5 bg-surface-2/60 border border-border/50 rounded-xl"
              >
                <span
                  class="text-xs font-semibold text-secondary flex items-center gap-2"
                >
                  <i class="fa-regular fa-circle-question text-muted"></i>
                  Toggle This Help Center
                </span>
                <kbd
                  class="px-2 py-1 text-[10px] font-mono font-bold text-primary bg-surface border border-border shadow-sm rounded-md"
                  >?</kbd
                >
              </div>
            </div>
          </div>

          <div
            class="flex justify-end mt-5 shrink-0 border-t border-border pt-6"
          >
            <button
              id="btn-close-help"
              class="px-5 py-2 text-sm rounded-xl bg-brand/80 text-white font-semibold hover:bg-(--color-brand-hover) transition cursor-pointer"
            >
              Got it, Thanks!
            </button>
          </div>
        </div>
      </div>
    `;
  },
};
