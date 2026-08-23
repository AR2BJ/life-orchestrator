const HELP_SHORTCUTS = [
  {
    category: "Navigation",
    items: [
      {
        label: "Go to Habits View",
        icon: "fa-rectangle-history",
        keys: [["Shift"], ["H"]],
      },
      {
        label: "Go to Analytics Dashboard",
        icon: "fa-chart-mixed",
        keys: [["Shift"], ["A"]],
      },
      {
        label: "Go to App Settings",
        icon: "fa-sliders",
        keys: [["Shift"], ["S"]],
      },
    ],
  },
  {
    category: "Quick Actions",
    items: [
      {
        label: "Scrolling To Top",
        icon: "fa-chevron-square-up",
        keys: [["Alt"], ["B"]],
      },
      {
        label: "Collapse / Expand Habit Creation Form",
        icon: "fa-square-minus",
        keys: [["Alt"], ["C"]],
      },
      {
        label: "Toggle Dark/Light Theme",
        icon: "fa-circle-half-stroke",
        keys: [["Alt"], ["T"]],
      },
      {
        label: "Toggle Navigation Menu",
        icon: "fa-bars",
        keys: [["Alt"], ["N"]],
      },
      {
        label: "Open Reset Data Modal",
        icon: "fa-arrow-rotate-left",
        keys: [["Alt"], ["R"]],
      },
      {
        label: "Close Active Modal / Blur Input",
        icon: "fa-xmark",
        keys: [["Esc"]],
      },
    ],
  },
  {
    category: "Filters & Global",
    items: [
      {
        label: "Quick Search / Filter",
        icon: "fa-magnifying-glass",
        keys: [["/"]],
      },
      {
        label: "Switch Tab View (Active / Archived)",
        icon: "fa-eye",
        keys: [["Alt"], ["A", "X"]],
      },
      {
        label: "Switch Chart View (Weekly / Monthly / Yearly)",
        icon: "fa-chart-line",
        keys: [["Alt"], ["1 - 3"]],
      },
      {
        label: "Quick Category Select (Habits View)",
        icon: "fa-filter",
        keys: [["0 - 9 / 10"]],
      },
      {
        label: "Toggle This Help Center",
        icon: "fa-circle-question",
        keys: [["?"]],
      },
    ],
  },
];

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
                  <i class="fa-regular ${item.icon} text-muted"></i>
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
                              '<span class="text-[10px] text-muted">/</span>',
                            )}
                        </div>
                      `,
                    )
                    .join('<span class="text-[10px] text-muted">+</span>')}
                </div>
              </div>
            `,
            )
            .join("")}
        </div>
      `,
    ).join("");
  },

  render() {
    return `
      <div
        id="help-modal"
        class="fixed inset-0 z-50 hidden items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
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
                <i class="fa-regular fa-circle-question"></i>
              </div>
              <div>
                <h3 class="text-base font-bold text-color">
                  Habit Tracker Help Center
                </h3>
                <p class="text-xs text-secondary">
                  Habit checking Tips and Shortcuts.
                </p>
              </div>
            </div>
            <button
              id="close-help-modal"
              type="button"
              class="w-8 h-8 rounded-xl bg-surface-2 hover:bg-surface-3 border border-border text-secondary hover:text-color flex items-center justify-center transition cursor-pointer"
            >
              <i class="fa-regular fa-xmark text-sm"></i>
            </button>
          </div>

          <div
            class="flex border-b border-border p-1 bg-surface-2 rounded-xl mb-4 shrink-0 gap-1.5"
          >
            <button
              id="tab-help-safeguard"
              class="flex-1 py-2 text-xs font-bold rounded-lg bg-brand text-white transition cursor-pointer"
            >
              <i class="fa-regular fa-shield-halved me-1.5"></i> Habit Guide
            </button>
            <button
              id="tab-help-shortcuts"
              class="flex-1 py-2 text-xs font-bold rounded-lg text-secondary hover:text-color transition cursor-pointer"
            >
              <i class="fa-regular fa-keyboard me-1.5"></i> Keyboard Shortcuts
            </button>
          </div>

          <div
            class="flex-1 overflow-y-auto pe-1 scrollbar-thin scrollbar-thumb-surface-2"
            id="help-modal-content"
          >
            <div
              id="content-help-safeguard"
              class="space-y-4"
            >
              <div class="p-4 bg-surface-2 border border-border rounded-2xl">
                <h4
                  class="text-xs font-bold text-amber-500/80 uppercase tracking-wider flex items-center gap-2 mb-1.5"
                >
                  <i class="fa-regular fa-lightbulb"></i> Core Feature: Skip Day
                </h4>
                <p class="text-xs text-secondary leading-relaxed">
                  <strong>Double-click</strong> on today or yesterday inside any
                  calendar cell to toggle a
                  <span class="text-amber-500/80 font-semibold"
                    >Skip Day (Leave)</span
                  >. This colorizes the cell in amber and locks your streak
                  state.
                </p>
              </div>

              <div class="p-4 bg-surface-2 border border-border rounded-2xl">
                <h4
                  class="text-xs font-bold text-brand uppercase tracking-wider flex items-center gap-2 mb-1.5">
                  <i class="fa-regular fa-bullseye-arrow"></i> Normal Check-In
                </h4>
                <p class="text-xs text-secondary leading-relaxed">
                  A single <strong>Left-Click</strong> handles a standard
                  success check-in, keeping the interface fluid and incredibly
                  native.
                </p>
              </div>
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
              Got it, thanks!
            </button>
          </div>
        </div>
      </div>
    `;
  },
};
