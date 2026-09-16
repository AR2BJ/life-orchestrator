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
        <!-- 1. Objectives & Progress Tracking -->
        <div class="p-3.5 bg-surface-2 border border-border rounded-2xl">
          <h4
            class="text-xs font-bold text-brand uppercase tracking-wider flex items-center gap-2 mb-1.5"
          >
            <i class="fa-regular fa-bullseye"></i> Objectives & Progress Tracking
          </h4>
          <p class="text-xs text-secondary leading-relaxed">
            Break down plans into quantifiable Objectives (Boolean, Numeric, or Milestones). Target values and current progress dynamically calculate the plan's overall completion percentage.
          </p>
        </div>

        <!-- 2. Execution Logs & Timeline -->
        <div class="p-3.5 bg-surface-2 border border-border rounded-2xl">
          <h4
            class="text-xs font-bold text-blue-500/90 uppercase tracking-wider flex items-center gap-2 mb-1.5"
          >
            <i class="fa-regular fa-clipboard-list"></i> Execution Logs & Timeline
          </h4>
          <p class="text-xs text-secondary leading-relaxed">
            Track daily or periodic progress using Logs. Record actual metric achievements, log notes, and review your timeline history to maintain consistency over time.
          </p>
        </div>

        <!-- 3. Reusable Templates (Baseline vs Optimal) -->
        <div class="p-3.5 bg-surface-2 border border-border rounded-2xl">
          <h4
            class="text-xs font-bold text-emerald-500/90 uppercase tracking-wider flex items-center gap-2 mb-1.5"
          >
            <i class="fa-regular fa-copy"></i> Templates (Baseline & Optimal)
          </h4>
          <p class="text-xs text-secondary leading-relaxed">
            Define minimum (<kbd class="px-1.5 py-0.5 text-[10px] bg-surface border border-border rounded shadow-2xs">Baseline</kbd>) and stretch (<kbd class="px-1.5 py-0.5 text-[10px] bg-surface border border-border rounded shadow-2xs">Optimal</kbd>) targets in Templates. Click <strong>Use Template</strong> to generate new plans instantly.
          </p>
        </div>

        <!-- 4. Deep Analytics & Heatmaps -->
        <div class="p-3.5 bg-surface-2 border border-border rounded-2xl">
          <h4
            class="text-xs font-bold text-purple-500/90 uppercase tracking-wider flex items-center gap-2 mb-1.5"
          >
            <i class="fa-regular fa-chart-pie"></i> Visual Analytics & Insights
          </h4>
          <p class="text-xs text-secondary leading-relaxed">
            Analyze your performance across different Life Areas using interactive Heatmaps, Category Progress Charts, and Trend Graphs in the Analytics view.
          </p>
        </div>

        <!-- 5. Fast Life Area Filter -->
        <div class="p-3.5 bg-surface-2 border border-border rounded-2xl">
          <h4
            class="text-xs font-bold text-amber-500/90 uppercase tracking-wider flex items-center gap-2 mb-1.5"
          >
            <i class="fa-regular fa-layer-group"></i> Life Area Categorization
          </h4>
          <p class="text-xs text-secondary leading-relaxed">
            Organize plans into 8 core Life Areas. Press numbers <kbd class="px-1.5 py-0.5 text-[10px] bg-surface border border-border rounded shadow-2xs">0</kbd> through <kbd class="px-1.5 py-0.5 text-[10px] bg-surface border border-border rounded shadow-2xs">7</kbd> on your keyboard to rapidly filter items in Plans, Logs, or Templates views.
          </p>
        </div>

        <!-- 6. Data Security & Storage Management -->
        <div class="p-3.5 bg-surface-2 border border-border rounded-2xl">
          <h4
            class="text-xs font-bold text-rose-500/90 uppercase tracking-wider flex items-center gap-2 mb-1.5"
          >
            <i class="fa-regular fa-database"></i> Data Management & Backups
          </h4>
          <p class="text-xs text-secondary leading-relaxed">
            Your data is stored locally for max privacy. Use Settings to Export full JSON backups or Import previous states. The Purge Terminal allows safe system resets.
          </p>
        </div>
      </div>
    `;
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
                  Life Planner Help Center
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
              <i class="fa-regular fa-list-check me-1.5"></i> Feature Guide
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
