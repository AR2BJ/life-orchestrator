import { CURRENCY_OPTIONS } from "@/utils/constants/options-value.constants";
import { formatNumberWithCommas } from "@/utils/helpers";

export const EditModalsComponent = {
  renderEmptyState(message, iconClass = "fa-regular fa-list-check") {
    return `
      <div class="w-full h-full min-h-45 overflow-y-auto scrollbar-thumb-surface-2 scrollbar-thin bg-surface rounded-2xl border border-dashed border-border/70 p-4 text-center flex flex-col justify-center items-center">
        <div class="h-full flex flex-col justify-center items-center">
          <div class="text-3xl text-brand/80">
            <i class="${iconClass}"></i>
          </div>
          <p class="mt-3 text-secondary max-w-sm mx-auto text-xs lg:text-sm">
            ${message}
          </p>
        </div>
      </div>
    `;
  },

  renderObjectiveItem(obj) {
    const type = obj.type || "boolean";
    const target = obj.targetValue || 1;

    const currentCurrency = localStorage.getItem("preferred_currency") || "USD";
    const currencyObj = CURRENCY_OPTIONS.find(
      (c) => c.value === currentCurrency,
    );
    const currencySymbol = currencyObj ? currencyObj.symbol : "$";
    const currencyPosition = currencyObj ? currencyObj.position : "left";

    const unit = obj.unit === "currency" ? currencySymbol : obj.unit;
    const isPrefix = obj.unit === "currency" && currencyPosition === "left";

    return `
      <div
        data-objective-id="${obj.id}"
        class="objective-item flex items-center justify-between gap-3 rounded-xl border border-border/70 bg-surface-2 p-2.5 shadow-xs transition hover:border-border"
      >
        <div class="flex items-center flex-1 min-w-0">
          <span class="ps-2 text-xs lg:text-sm font-medium text-color truncate">
            ${(obj.title ?? "").replace(/"/g, "&quot;")}
          </span>
        </div>

        <div class="flex items-center gap-1.5 shrink-0">
          <span
            class="h-7 sm:h-9 text-xs font-bold uppercase tracking-wider px-4 rounded-xl ${
              type === "numeric"
                ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-500/80"
                : type === "boolean"
                  ? "bg-cyan-500/10 border border-cyan-500/20 text-cyan-500/80"
                  : type === "milestone"
                    ? "bg-yellow-500/10 border border-yellow-500/20 text-yellow-500/80"
                    : ""
            } flex justify-center items-center gap-1.5"
          >
            ${type}
          </span>

          ${
            type === "numeric"
              ? `
                  <div
                    class="h-7 sm:h-9 flex items-center gap-1.5 px-4 rounded-xl bg-surface border border-border/80 text-sm font-semibold text-color"
                  >
                    ${
                      isPrefix
                        ? `<span class="text-secondary">${unit}</span>`
                        : ""
                    }
                    <span class="text-emerald-400/80 font-bold"
                      >${
                        obj.unit === "currency"
                          ? formatNumberWithCommas(target)
                          : target
                      }</span
                    >
                    ${
                      !isPrefix
                        ? `<span class="text-secondary">${unit}</span>`
                        : ""
                    }
                  </div>
                `
              : ""
          }

          <button
            type="button"
            data-action="edit-objective"
            data-objective-id="${obj.id}"
            class="edit-btn h-7 w-7 sm:w-9 sm:h-9 flex items-center justify-center rounded-lg sm:rounded-xl border border-border bg-surface hover:bg-blue-600/10 hover:cursor-pointer transition"
            title="Edit Objective"
          >
            <i class="fa-regular fa-pen-to-square text-blue-500/80 text-sm"></i>
          </button>

          <button
            type="button"
            data-action="delete-objective"
            data-objective-id="${obj.id}"
            class="delete-btn flex h-7 w-7 sm:w-9 sm:h-9 items-center justify-center rounded-lg sm:rounded-xl border border-border bg-surface hover:bg-red-600/10 hover:cursor-pointer transition"
            title="Delete Objective"
          >
            <i class="fa-regular fa-trash-can text-red-500/80 text-sm"></i>
          </button>
        </div>
      </div>
    `;
  },

  renderMetricItem(key, metricData) {
    const rawValue =
      typeof metricData === "object" ? metricData.value : metricData;
    const unit = typeof metricData === "object" ? metricData.unit || "" : "";

    const currentCurrency = localStorage.getItem("preferred_currency") || "USD";
    const currencyObj = CURRENCY_OPTIONS.find(
      (c) => c.value === currentCurrency,
    );
    const currencySymbol = currencyObj ? currencyObj.symbol : "$";
    const currencyPosition = currencyObj ? currencyObj.position : "left";

    const displayUnit = unit === "currency" ? currencySymbol : unit;
    const isPrefix = unit === "currency" && currencyPosition === "left";
    const formattedValue =
      unit === "currency" ? formatNumberWithCommas(rawValue) : rawValue;

    return `
      <div
        data-metric-key="${key}"
        class="objective-item flex items-center justify-between gap-3 rounded-xl border border-border/70 bg-surface-2 p-2.5 shadow-xs transition hover:border-border"
      >
        <div class="flex items-center flex-1 min-w-0">
          <span class="ps-2 text-xs lg:text-sm font-semibold text-color truncate">
            ${(key ?? "").replace(/"/g, "&quot;")}
          </span>
        </div>

        <div class="flex items-center gap-1.5 shrink-0">
          <div class="h-7 sm:h-9 flex items-center gap-1.5 px-4 rounded-xl bg-surface border border-border/80 text-sm font-semibold text-color">
            ${
              isPrefix
                ? `<span class="text-secondary text-xs">${displayUnit}</span>`
                : ""
            }
            <span class="text-brand/90 font-bold">${formattedValue}</span>
            ${
              !isPrefix
                ? `<span class="text-secondary text-xs">${displayUnit}</span>`
                : ""
            }
          </div>

          <button
            type="button"
            data-action="edit-metric"
            data-metric-key="${key}"
            class="edit-btn flex h-7 w-7 sm:w-9 sm:h-9 items-center justify-center rounded-lg sm:rounded-xl border border-border bg-surface hover:bg-blue-600/10 hover:cursor-pointer transition"
            title="Edit Metric"
          >
            <i class="fa-regular fa-pen-to-square text-blue-500/80 text-sm"></i>
          </button>

          <button
            type="button"
            data-action="delete-metric"
            data-metric-key="${key}"
            class="delete-btn flex h-7 w-7 sm:w-9 sm:h-9 items-center justify-center rounded-lg sm:rounded-xl border border-border bg-surface hover:bg-red-600/10 hover:cursor-pointer transition"
            title="Delete Metric"
          >
            <i class="fa-regular fa-trash-can text-red-500/80 text-sm"></i>
          </button>
        </div>
      </div>
    `;
  },

  render() {
    return `
      <div
        id="edit-modal"
        class="fixed inset-0 z-50 hidden items-end lg:items-center justify-center p-0 lg:p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
      >
        <div
          class="bg-surface xs:rounded-t-3xl lg:rounded-2xl p-4 lg:p-6 max-w-3xl w-full h-dvh xs:h-[96.5dvh] sm:h-[95dvh] lg:h-auto lg:max-h-[90vh] shadow-2xl flex flex-col border border-border overflow-hidden"
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
                <h3 class="text-sm lg:text-base font-bold text-color truncate">
                  Edit Item Details
                </h3>
                <p
                  class="text-[11px] w-40 xs:w-auto lg:text-xs text-secondary truncate"
                >
                  Update plan properties, logs, templates, and metrics.
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
                    <i
                      class="fa-regular fa-file-lines text-sm lg:text-base"
                    ></i>
                  </div>
                  <div>
                    <h4 class="text-xs lg:text-sm font-semibold text-color">
                      Basic Information
                    </h4>
                    <p class="text-[10px] lg:text-xs leading-4 text-secondary">
                      Title, description, and primary settings.
                    </p>
                  </div>
                </div>
                <i
                  class="accordion-icon fa-regular fa-chevron-up text-secondary text-xs lg:text-sm transition-transform duration-200"
                ></i>
              </button>

              <div class="accordion-content p-3.5 lg:p-4">
                <div
                  id="edit-title-container"
                  class="edit-tab-field flex flex-col flex-1 min-w-0"
                  data-tab="plans,templates,logs"
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
                    class="h-10 lg:h-11 w-full rounded-xl border border-border bg-surface px-4 text-sm text-color placeholder:text-secondary/70 transition focus:border-brand/80 focus:outline-none"
                  />
                </div>

                <div
                  id="edit-plan-lifearea-container"
                  class="edit-tab-field flex flex-col w-full mt-3.5"
                  data-tab="plans"
                >
                  <div
                    id="edit-plan-lifearea-autocomplete"
                    class="w-full"
                  ></div>
                </div>

                <div
                  id="edit-template-lifearea-wrapper"
                  class="edit-tab-field hidden flex-col sm:flex-row items-stretch sm:items-end gap-3.5 w-full mt-3.5"
                  data-tab="templates"
                >
                  <div
                    class="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full"
                  >
                    <div
                      id="edit-template-lifearea-container"
                      class="w-full flex-1 min-w-0"
                    >
                      <div
                        id="edit-template-lifearea-autocomplete"
                        class="w-full"
                      ></div>
                    </div>
                    <div class="shrink-0 w-auto pt-7">
                      <label
                        class="relative inline-flex items-center cursor-pointer gap-2.5 select-none"
                      >
                        <input
                          id="edit-template-favorite"
                          type="checkbox"
                          class="sr-only peer"
                        />
                        <div
                          class="w-10 h-5.5 bg-surface-3 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4.5 after:w-4.5 after:transition-all peer-checked:bg-brand"
                        ></div>
                        <span
                          class="text-xs font-semibold text-secondary whitespace-nowrap"
                          >Mark as Favorite</span
                        >
                      </label>
                    </div>
                  </div>
                </div>

                <div
                  id="edit-desc-container"
                  class="edit-tab-field flex flex-col w-full mt-3.5"
                  data-tab="plans,templates,logs"
                >
                  <label
                    for="edit-item-desc"
                    class="mb-1.5 block ps-3 text-xs font-semibold text-secondary"
                  >
                    Description
                  </label>
                  <textarea
                    id="edit-item-desc"
                    rows="2"
                    placeholder="Enter description..."
                    class="w-full scrollbar-thin scrollbar-thumb-surface rounded-xl border border-border bg-surface p-3 text-sm text-color placeholder:text-secondary/70 transition focus:border-brand/80 focus:outline-none resize-none"
                  ></textarea>
                </div>
              </div>
            </div>

            <div
              id="accordion-plan-lifecycle"
              class="accordion-item edit-tab-field flex flex-col rounded-2xl border border-border/60 bg-surface-2/60 overflow-hidden shrink-0 transition-all duration-300"
              data-tab="plans"
            >
              <button
                type="button"
                class="accordion-header w-full p-3.5 lg:p-4 border-b border-border flex items-center justify-between text-left cursor-pointer hover:bg-surface-2/80 transition"
              >
                <div class="flex items-center gap-3">
                  <div
                    class="flex h-9 w-9 lg:h-10 lg:w-10 shrink-0 self-start items-center justify-center rounded-lg lg:rounded-xl bg-brand/10 text-brand/80"
                  >
                    <i class="fa-regular fa-sliders text-sm lg:text-base"></i>
                  </div>
                  <div>
                    <h4 class="text-xs lg:text-sm font-semibold text-color">
                      Schedule & Lifecycle State
                    </h4>
                    <p class="text-[10px] lg:text-xs leading-4 text-secondary">
                      Operational state and timeframe configuration.
                    </p>
                  </div>
                </div>
                <i
                  class="accordion-icon fa-regular fa-chevron-down text-secondary text-xs lg:text-sm transition-transform duration-200"
                ></i>
              </button>

              <div class="accordion-content hidden p-3.5 lg:p-4">
                <div class="w-full">
                  <div
                    id="edit-plan-state-autocomplete"
                    class="w-full"
                  ></div>
                </div>

                <div
                  class="grid grid-cols-1 sm:grid-cols-2 gap-3.5 w-full mt-3.5"
                >
                  <div
                    id="edit-plan-startdate-container"
                    class="w-full"
                  ></div>
                  <div
                    id="edit-plan-enddate-container"
                    class="w-full"
                  ></div>
                </div>
              </div>
            </div>

            <div
              id="accordion-plan-objectives"
              class="accordion-item edit-tab-field flex flex-col rounded-2xl border border-border/60 bg-surface-2/60 overflow-hidden shrink-0 transition-all duration-300"
              data-tab="plans"
            >
              <button
                type="button"
                class="accordion-header w-full p-3.5 lg:p-4 border-b border-border flex items-center justify-between text-left cursor-pointer hover:bg-surface-2/80 transition"
              >
                <div class="flex items-center gap-3">
                  <div
                    class="flex h-9 w-9 lg:h-10 lg:w-10 shrink-0 self-start items-center justify-center rounded-lg lg:rounded-xl bg-brand/10 text-brand/80"
                  >
                    <i
                      class="fa-regular fa-bars-staggered text-sm lg:text-base"
                    ></i>
                  </div>
                  <div>
                    <h4 class="text-xs lg:text-sm font-semibold text-color">
                      Plan Objectives
                    </h4>
                    <p class="text-[10px] lg:text-xs leading-4 text-secondary">
                      Manage progress checkpoints and core sub-tasks.
                    </p>
                  </div>
                </div>

                <div class="flex items-center gap-2 lg:gap-3">
                  <span
                    id="objective-progress-badge"
                    class="text-[10px] lg:text-xs text-secondary px-2 lg:px-3 py-1 rounded-lg bg-surface border border-border shrink-0"
                  >
                    0/0 Done
                  </span>
                  <i
                    class="accordion-icon fa-regular fa-chevron-down text-secondary text-xs lg:text-sm transition-transform duration-200"
                  ></i>
                </div>
              </button>

              <div class="accordion-content hidden p-3.5 lg:p-4">
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full">
                  <input
                    id="new-objective-input"
                    type="text"
                    placeholder="Objective title..."
                    class="w-full h-10 lg:h-11 rounded-xl border border-border bg-surface px-3 text-xs lg:text-sm text-color placeholder:text-secondary/70 focus:border-brand/80 focus:outline-none"
                  />

                  <div
                    id="new-objective-type-autocomplete"
                    class="w-full min-w-0"
                  ></div>
                </div>

                <div
                  id="objective-numeric-field"
                  class="flex items-center gap-2 w-full mt-3.5"
                >
                  <div class="flex-1 min-w-0">
                    <div
                      id="new-objective-unit-autocomplete"
                      class="w-full min-w-0"
                    ></div>
                  </div>

                  <input
                    id="new-objective-target"
                    type="text"
                    inputmode="decimal"
                    value="1"
                    placeholder="Target"
                    maxlength="7"
                    min="1"
                    pattern="^[0-9]*.?[0-9]*$"
                    class="w-20 shrink-0 h-10 lg:h-11 rounded-xl border border-border bg-surface px-3 text-xs lg:text-sm text-center text-color placeholder:text-secondary/70 focus:border-brand/80 focus:outline-none transition-all duration-200"
                  />
                </div>

                <div
                  id="objective-form-actions"
                  class="w-full mt-3.5"
                >
                  <button
                    id="btn-add-objective"
                    type="button"
                    class="w-full h-10 rounded-xl bg-brand/10 text-brand/80 hover:bg-brand/20 font-semibold text-xs lg:text-sm flex items-center justify-center gap-1.5 transition cursor-pointer"
                  >
                    <i class="fa-regular fa-plus"></i> Add Objective
                  </button>
                </div>

                <div
                  id="plan-objectives-list"
                  class="w-full flex flex-col gap-2 mt-3.5"
                ></div>
              </div>
            </div>

            <div
              id="accordion-log-fields"
              class="accordion-item edit-tab-field hidden flex-col rounded-2xl border border-border/60 bg-surface-2/60 overflow-hidden shrink-0 transition-all duration-300"
              data-tab="logs"
            >
              <button
                type="button"
                class="accordion-header w-full p-3.5 lg:p-4 border-b border-border flex items-center justify-between text-left cursor-pointer hover:bg-surface-2/80 transition"
              >
                <div class="flex items-center gap-3">
                  <div
                    class="flex h-9 w-9 lg:h-10 lg:w-10 shrink-0 self-start items-center justify-center rounded-lg lg:rounded-xl bg-brand/10 text-brand/80"
                  >
                    <i
                      class="fa-regular fa-calendar-day text-sm lg:text-base"
                    ></i>
                  </div>
                  <div>
                    <h4 class="text-xs lg:text-sm font-semibold text-color">
                      Log Details & Linkage
                    </h4>
                    <p class="text-[10px] lg:text-xs leading-4 text-secondary">
                      Entry date, energy level, mood state, and parent plan
                      link.
                    </p>
                  </div>
                </div>
                <i
                  class="accordion-icon fa-regular fa-chevron-down text-secondary text-xs lg:text-sm transition-transform duration-200"
                ></i>
              </button>

              <div class="accordion-content hidden p-3.5 lg:p-4">
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-3.5 w-full">
                  <div
                    id="edit-log-datepicker-container"
                    class="w-full"
                  ></div>
                  <div
                    id="edit-log-energy-autocomplete"
                    class="w-full"
                  ></div>
                  <div
                    id="edit-log-mood-autocomplete"
                    class="w-full"
                  ></div>
                </div>

                <div
                  id="edit-log-plan-link-autocomplete"
                  class="w-full mt-3.5"
                ></div>
              </div>
            </div>

            <div
              id="accordion-log-metrics"
              class="accordion-item edit-tab-field hidden flex-col rounded-2xl border border-border/60 bg-surface-2/60 overflow-hidden shrink-0 transition-all duration-300"
              data-tab="logs"
            >
              <button
                type="button"
                class="accordion-header w-full p-3.5 lg:p-4 border-b border-border flex items-center justify-between text-left cursor-pointer hover:bg-surface-2/80 transition"
              >
                <div class="flex items-center gap-3">
                  <div
                    class="flex h-9 w-9 lg:h-10 lg:w-10 shrink-0 self-start items-center justify-center rounded-lg lg:rounded-xl bg-brand/10 text-brand/80"
                  >
                    <i
                      class="fa-regular fa-chart-line text-sm lg:text-base"
                    ></i>
                  </div>
                  <div>
                    <h4 class="text-xs lg:text-sm font-semibold text-color">
                      Log Metrics
                    </h4>
                    <p class="text-[10px] lg:text-xs leading-4 text-secondary">
                      Track quantitative metrics and key performance variables.
                    </p>
                  </div>
                </div>
                <i
                  class="accordion-icon fa-regular fa-chevron-down text-secondary text-xs lg:text-sm transition-transform duration-200"
                ></i>
              </button>

              <div class="accordion-content hidden p-3.5 lg:p-4">
                <div class="flex items-center gap-2 w-full">
                  <div class="flex-1 min-w-0">
                    <input
                      id="new-metric-key"
                      type="text"
                      placeholder="Metric key (e.g. sleep_hours)..."
                      class="w-full h-10 lg:h-11 rounded-xl border border-border bg-surface px-3 text-xs lg:text-sm text-color placeholder:text-secondary/70 focus:border-brand/80 focus:outline-none"
                    />
                  </div>

                  <input
                    id="new-metric-val"
                    type="text"
                    inputmode="decimal"
                    value="1"
                    placeholder="Value"
                    maxlength="7"
                    min="1"
                    pattern="^[0-9]*.?[0-9]*$"
                    class="w-20 shrink-0 h-10 lg:h-11 rounded-xl border border-border bg-surface px-3 text-xs lg:text-sm text-center text-color placeholder:text-secondary/70 focus:border-brand/80 focus:outline-none field-sizing-content transition-all duration-200"
                  />

                  <div class="flex-1 min-w-0">
                    <div
                      id="new-metric-unit-autocomplete"
                      class="w-full min-w-0"
                    ></div>
                  </div>
                </div>

                <div
                  id="metric-form-actions"
                  class="w-full mt-3.5"
                >
                  <button
                    id="btn-add-metric"
                    type="button"
                    class="w-full h-10 rounded-xl bg-brand/10 text-brand/80 hover:bg-brand/20 font-semibold text-xs lg:text-sm flex items-center justify-center gap-1.5 transition cursor-pointer"
                  >
                    <i class="fa-regular fa-plus"></i> Add Metric
                  </button>
                </div>

                <div
                  id="log-metrics-list"
                  class="w-full flex flex-col gap-2 mt-3.5"
                ></div>
              </div>
            </div>

            <div
              id="accordion-template-strategies"
              class="accordion-item edit-tab-field hidden flex-col rounded-2xl border border-border/60 bg-surface-2/60 overflow-hidden shrink-0 transition-all duration-300"
              data-tab="templates"
            >
              <button
                type="button"
                class="accordion-header w-full p-3.5 lg:p-4 border-b border-border flex items-center justify-between text-left cursor-pointer hover:bg-surface-2/80 transition"
              >
                <div class="flex items-center gap-3">
                  <div
                    class="flex h-9 w-9 lg:h-10 lg:w-10 shrink-0 self-start items-center justify-center rounded-lg lg:rounded-xl bg-brand/10 text-brand/80"
                  >
                    <i class="fa-regular fa-compass text-sm lg:text-base"></i>
                  </div>
                  <div>
                    <h4 class="text-xs lg:text-sm font-semibold text-color">
                      Execution Benchmarks
                    </h4>
                    <p class="text-[10px] lg:text-xs leading-4 text-secondary">
                      Set baseline strategy standards and optimal performance
                      goals.
                    </p>
                  </div>
                </div>
                <i
                  class="accordion-icon fa-regular fa-chevron-down text-secondary text-xs lg:text-sm transition-transform duration-200"
                ></i>
              </button>

              <div class="accordion-content hidden p-3.5 lg:p-4">
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5 w-full">
                  <div class="w-full flex flex-col">
                    <label
                      for="edit-template-baseline"
                      class="mb-1.5 block ps-3 text-xs font-semibold text-secondary"
                    >
                      Baseline Strategy
                    </label>
                    <input
                      id="edit-template-baseline"
                      type="text"
                      placeholder="e.g. Minimum acceptable standard"
                      class="h-10 lg:h-11 w-full rounded-xl border border-border bg-surface px-4 text-sm text-color placeholder:text-secondary/70 focus:border-brand/80 focus:outline-none"
                    />
                  </div>
                  <div class="w-full flex flex-col">
                    <label
                      for="edit-template-optimal"
                      class="mb-1.5 block ps-3 text-xs font-semibold text-secondary"
                    >
                      Optimal Strategy
                    </label>
                    <input
                      id="edit-template-optimal"
                      type="text"
                      placeholder="e.g. Best performance target"
                      class="h-10 lg:h-11 w-full rounded-xl border border-border bg-surface px-4 text-sm text-color placeholder:text-secondary/70 focus:border-brand/80 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div
              class="grid grid-cols-2 gap-3 pt-3 border-t border-border shrink-0 w-full bg-surface mt-auto"
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
                <i class="fa-regular fa-check"></i> Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  },
};
