export const PlannerView = {
  render() {
    return `
      <section
        id="planner-view"
        class="hidden w-full min-w-0 flex-col"
      >
        <div
          class="mb-6 flex flex-wrap sm:flex-nowrap gap-4 justify-center sm:justify-between items-center w-full"
        >
          <div
            class="relative flex flex-col w-full justify-center rounded-xl border border-border bg-surface p-1 xs:flex-row xs:w-fit xs:justify-start"
          >
            <div
              id="tab-indicator"
              class="absolute top-1 left-1 h-12 w-[calc(100%-8px)] rounded-lg bg-brand/80 transition-all duration-300 xs:h-[calc(100%-8px)] xs:w-24"
            ></div>

            <button
              id="tab-plans"
              data-tab="plans"
              class="relative z-10 flex-1 w-full rounded-t-xl py-2 text-sm font-medium text-(--color-btn-primary-text) transition cursor-pointer text-center xs:w-27 xs:rounded-l-xl xs:rounded-tr-none"
            >
              Plans
            </button>

            <button
              id="tab-logs"
              data-tab="logs"
              class="relative z-10 flex-1 w-full rounded-none py-2 text-sm font-medium text-secondary transition cursor-pointer text-center xs:w-27"
            >
              Logs
            </button>

            <button
              id="tab-templates"
              data-tab="templates"
              class="relative z-10 flex-1 w-full rounded-b-xl py-2 text-sm font-medium text-secondary transition cursor-pointer text-center xs:w-27 xs:rounded-r-xl xs:rounded-t-none"
            >
              Templates
            </button>
          </div>

          <div class="relative w-full sm:w-72 group/search">
            <span
              class="absolute inset-y-0 left-0 flex items-center ps-3.5 pointer-events-none text-muted"
            >
              <i class="fa-regular fa-magnifying-glass text-sm"></i>
            </span>
            <input
              type="text"
              id="search-planner"
              placeholder="Search items..."
              class="w-full ps-10 pe-10 py-2.5 text-sm rounded-xl border border-border bg-surface text-color placeholder:text-muted/70 focus:outline-none focus:border-brand/50 transition-all shadow-sm"
            />

            <div
              class="absolute inset-y-0 right-0 flex items-center pe-3 gap-2"
            >
              <button
                id="clear-search-btn"
                class="hidden opacity-0 scale-75 h-5 w-5 cursor-pointer items-center justify-center rounded-full border border-border bg-surface-2 hover:bg-surface-4 text-secondary hover:text-color transition-all duration-200"
                title="Clear Search"
              >
                <i class="fa-regular fa-xmark text-[10px]"></i>
              </button>

              <kbd class="flex items-center pointer-events-none">
                <span
                  class="px-1.25 py-1 text-[9px] bg-surface-2 border border-border text-muted rounded-md shadow-2xs flex flex-row justify-center items-center"
                ><i class="fa-regular fa-slash-forward"></i></span>
              </kbd>
            </div>
          </div>
        </div>

        <div
          id="create-form-wrapper"
          class="w-full min-w-0 mb-6"
        >
          <div
            class="flex flex-col rounded-xl border border-border bg-surface transition-all overflow-hidden shadow-sm"
          >
            <button
              id="btn-toggle-planner-form"
              class="w-full px-5 py-4 flex flex-row items-center justify-between text-left font-bold text-slate-500/80 hover:bg-surface-2/40 transition cursor-pointer"
            >
              <div class="flex items-center gap-2">
                <i class="fa-regular fa-square-plus text-brand/80"></i>
                <span
                  id="form-toggle-title"
                  class="text-sm font-medium"
                >Create New Plan</span>
              </div>
              <div
                id="form-chevron"
                class="flex items-center"
              >
                <i
                  class="fa-regular fa-chevron-down text-secondary text-sm transition-transform duration-300"
                ></i>
              </div>
            </button>

            <div
              id="planner-form-container"
              class="hidden p-5 bg-surface-2/20 animate-slide-down flex-col gap-4 rounded-b-2xl border-t border-border"
            >
              <div
                id="create-title-wrapper"
                class="plan-tab-fields flex w-full min-w-0 flex-col"
                data-tab-fields="plans,templates,logs"
              >
                <label
                  for="create-item-title"
                  class="mb-1.5 block ps-3 text-xs font-semibold text-secondary"
                >
                  Title <span class="text-red-700">*</span>
                </label>
                <input
                  id="create-item-title"
                  type="text"
                  placeholder="Enter title..."
                  class="h-11 w-full rounded-xl border border-border bg-surface-2 px-4 text-sm text-color placeholder:text-secondary/70 transition focus:border-brand/80 focus:outline-none"
                />
              </div>

              <div
                id="create-desc-wrapper"
                class="plan-tab-fields flex w-full min-w-0 flex-col"
                data-tab-fields="plans,templates,logs"
              >
                <label
                  for="create-item-desc"
                  class="mb-1.5 block ps-3 text-xs font-semibold text-secondary"
                >Description</label>
                <textarea
                  id="create-item-desc"
                  rows="2"
                  placeholder="Enter description..."
                  class="w-full scrollbar-thin scrollbar-thumb-surface rounded-xl border border-border bg-surface-2 p-3 text-sm text-color placeholder:text-secondary/70 transition focus:border-brand/80 focus:outline-none resize-none"
                ></textarea>
              </div>

              <div
                id="create-plans-fields"
                class="plan-tab-fields flex flex-col gap-4"
                data-tab-fields="plans"
              >
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div class="flex flex-col gap-1.5">
                    <div
                      id="create-plan-lifearea-autocomplete"
                      class="w-full"
                    ></div>
                  </div>
                  <div class="flex flex-col gap-1.5">
                    <div
                      id="create-plan-state-autocomplete"
                      class="w-full"
                    ></div>
                  </div>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div class="flex flex-col gap-1.5">
                    <div
                      id="create-plan-startdate-container"
                      class="w-full"
                    ></div>
                  </div>
                  <div class="flex flex-col gap-1.5">
                    <div
                      id="create-plan-enddate-container"
                      class="w-full"
                    ></div>
                  </div>
                </div>
              </div>

              <div
                id="create-logs-fields"
                class="plan-tab-fields hidden flex-col gap-4"
                data-tab-fields="logs"
              >
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div class="flex flex-col gap-1.5">
                    <div
                      id="create-log-datepicker-container"
                      class="w-full"
                    ></div>
                  </div>
                  <div class="flex flex-col gap-1.5">
                    <div
                      id="create-log-energy-autocomplete"
                      class="w-full"
                    ></div>
                  </div>
                  <div class="flex flex-col gap-1.5">
                    <div
                      id="create-log-mood-autocomplete"
                      class="w-full"
                    ></div>
                  </div>
                </div>

                <div class="w-full min-w-0">
                  <div
                    id="create-log-plan-link-autocomplete"
                    class="w-full"
                  ></div>
                </div>
              </div>

              <div
                id="create-templates-fields"
                class="plan-tab-fields hidden flex-col gap-4"
                data-tab-fields="templates"
              >
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div class="w-full min-w-0">
                    <label
                      for="create-template-baseline"
                      class="mb-1.5 block ps-3 text-xs font-semibold text-secondary"
                    >Baseline Strategy</label>
                    <input
                      id="create-template-baseline"
                      type="text"
                      placeholder="e.g. Minimum acceptable standard"
                      class="h-11 w-full rounded-xl border border-border bg-surface-2 px-4 text-sm text-color placeholder:text-secondary/70 focus:border-brand/80 focus:outline-none"
                    />
                  </div>
                  <div class="w-full min-w-0">
                    <label
                      for="create-template-optimal"
                      class="mb-1.5 block ps-3 text-xs font-semibold text-secondary"
                    >Optimal Strategy</label>
                    <input
                      id="create-template-optimal"
                      type="text"
                      placeholder="e.g. Best performance target"
                      class="h-11 w-full rounded-xl border border-border bg-surface-2 px-4 text-sm text-color placeholder:text-secondary/70 focus:border-brand/80 focus:outline-none"
                    />
                  </div>
                </div>

                <div
                  class="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full"
                >
                  <div class="flex-1 w-full min-w-0">
                    <div
                      id="create-template-lifearea-autocomplete"
                      class="w-full"
                    ></div>
                  </div>
                  <div class="shrink-0 w-auto pt-7">
                    <label
                      class="relative inline-flex items-center cursor-pointer gap-2.5 select-none"
                    >
                      <input
                        id="create-template-favorite"
                        type="checkbox"
                        class="sr-only peer"
                      />
                      <div
                        class="w-10 h-5.5 bg-surface-3 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4.5 after:w-4.5 after:transition-all peer-checked:bg-brand"
                      ></div>
                      <span
                        class="text-xs font-semibold text-secondary whitespace-nowrap"
                      >Mark as Favorite</span>
                    </label>
                  </div>
                </div>
              </div>

              <div
                class="flex flex-col gap-3 border-t border-border pt-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <p class="flex items-center gap-1.5 text-xs text-secondary">
                  <i class="fa-regular fa-circle-info text-brand/80"></i>
                  Manage your life areas and operational plans effectively.
                </p>
                <button
                  id="add-plan-btn"
                  class="flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-brand/80 px-5 text-sm font-semibold text-white shadow-lg shadow-brand/10 transition hover:bg-(--color-brand-hover) cursor-pointer sm:w-auto"
                >
                  <i class="fa-regular fa-plus"></i>
                  <span id="add-plan-btn-text">Add Plan</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div
          id="plan-filters-bar"
          class="flex flex-wrap lg:flex-nowrap items-stretch lg:items-center justify-between gap-6 border-b border-border pb-4 w-full"
        >
          <div class="relative flex flex-1 items-center gap-2 min-w-0 group">
            <p
              class="text-xs font-bold uppercase tracking-wider text-secondary shrink-0 me-1 hidden sm:flex"
            >
              Life Areas:
            </p>

            <div class="relative flex-1 min-w-0 flex items-center">
              <button
                id="btn-scroll-left"
                type="button"
                class="absolute left-0 z-20 hidden h-7 w-7 items-center justify-center rounded-lg border border-border bg-surface/95 backdrop-blur-xl shadow-2xl text-secondary hover:text-color transition-all cursor-pointer"
              >
                <i class="fa-regular fa-chevron-left text-xs"></i>
              </button>

              <div
                id="life-area-filter-scroll"
                class="flex flex-1 min-w-0 flex-row items-center gap-2 overflow-x-auto px-1 scrollbar-none scroll-smooth transition-all duration-300"
              ></div>

              <button
                id="btn-scroll-right"
                type="button"
                class="absolute right-0 z-20 hidden h-7 w-7 items-center justify-center rounded-lg border border-border bg-surface/95 backdrop-blur-xl shadow-2xl text-secondary hover:text-color transition-all cursor-pointer"
              >
                <i class="fa-regular fa-chevron-right text-xs"></i>
              </button>
            </div>
          </div>

          <div
            class="flex flex-wrap sm:flex-nowrap items-center justify-between sm:justify-end gap-3"
          >
            <div class="w-full flex flex-col xs:flex-row items-center gap-3">
              <div class="w-full flex items-center gap-2 min-w-35">
                <div id="filter-autocomplete-wrapper" class="w-full"></div>
              </div>

              <div class="w-full flex items-center gap-2 min-w-35">
                <div id="sort-autocomplete-wrapper" class="w-full"></div>
              </div>
            </div>

            <div
              id="planner-count-badge"
              class="shrink-0 flex justify-center items-center gap-1.5 px-4 py-1.5 bg-surface-3 rounded-xl text-xs font-bold text-color select-none"
            >
              0 Items
            </div>
          </div>
        </div>

        <div
          id="planner-list"
          class="mt-6 w-full space-y-3"
        ></div>
      </section>
    `;
  },
};

function setupPlanFiltersDragScroll() {
  const scrollContainer = document.getElementById("life-area-filter-scroll");
  const btnLeft = document.getElementById("btn-scroll-left");
  const btnRight = document.getElementById("btn-scroll-right");

  if (!scrollContainer || !btnLeft || !btnRight) return;

  const scrollStep = 180;

  btnLeft.addEventListener("click", (e) => {
    e.stopPropagation();
    scrollContainer.scrollBy({ left: -scrollStep, behavior: "smooth" });
  });

  btnRight.addEventListener("click", (e) => {
    e.stopPropagation();
    scrollContainer.scrollBy({ left: scrollStep, behavior: "smooth" });
  });

  const checkOverflowState = () => {
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainer;
    const hasOverflow = scrollWidth > clientWidth + 2;

    if (
      scrollContainer.offsetParent === null ||
      scrollContainer.clientWidth === 0
    ) {
      btnLeft.classList.replace("flex", "hidden");
      btnRight.classList.replace("flex", "hidden");
      scrollContainer.style.maskImage = "none";
      return;
    }

    if (!hasOverflow) {
      btnLeft.classList.replace("flex", "hidden");
      btnRight.classList.replace("flex", "hidden");
      scrollContainer.style.maskImage = "none";
      return;
    }

    const atStart = Math.ceil(scrollLeft) <= 2;
    const atEnd = Math.ceil(scrollLeft + clientWidth) >= scrollWidth - 2;

    btnLeft.classList.toggle("hidden", atStart);
    btnLeft.classList.toggle("flex", !atStart);

    btnRight.classList.toggle("hidden", atEnd);
    btnRight.classList.toggle("flex", !atEnd);

    const fadeWidth = "80px";

    if (atStart) {
      scrollContainer.style.maskImage = `linear-gradient(to right, black 0%, black calc(100% - ${fadeWidth}), transparent 100%)`;
    } else if (atEnd) {
      scrollContainer.style.maskImage = `linear-gradient(to right, transparent 0%, black ${fadeWidth}, black 100%)`;
    } else {
      scrollContainer.style.maskImage = `linear-gradient(to right, transparent 0%, black ${fadeWidth}, black calc(100% - ${fadeWidth}), transparent 100%)`;
    }
  };

  const triggerCheck = () => {
    requestAnimationFrame(() => {
      setTimeout(checkOverflowState, 100);
    });
  };

  scrollContainer.addEventListener("scroll", checkOverflowState);

  const mutationObserver = new MutationObserver(() => {
    triggerCheck();
  });
  mutationObserver.observe(scrollContainer, { childList: true, subtree: true });

  const viewSection = document.getElementById("planner-view");
  if (viewSection) {
    const sectionObserver = new MutationObserver(() => {
      if (!viewSection.classList.contains("hidden")) {
        triggerCheck();
      }
    });
    sectionObserver.observe(viewSection, {
      attributes: true,
      attributeFilter: ["class"],
    });
  }

  const resizeObserver = new ResizeObserver(() => {
    triggerCheck();
  });

  resizeObserver.observe(scrollContainer);

  if (viewSection) {
    resizeObserver.observe(viewSection);
  }

  window.addEventListener("resize", triggerCheck);
  window.addEventListener("load", triggerCheck);

  if (document.fonts?.ready) {
    document.fonts.ready.then(() => triggerCheck());
  }

  triggerCheck();
}

if (typeof window !== "undefined") {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      requestAnimationFrame(setupPlanFiltersDragScroll);
    });
  } else {
    requestAnimationFrame(() => {
      requestAnimationFrame(setupPlanFiltersDragScroll);
    });
  }
}
