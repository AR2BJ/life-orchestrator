export const TasksView = {
  render() {
    return `
      <section
        id="tasks-view"
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
              id="tab-active"
              class="relative z-10 flex-1 w-full rounded-t-xl py-2 text-sm font-medium text-(--color-btn-primary-text) transition cursor-pointer text-center xs:w-27 xs:rounded-l-xl xs:rounded-tr-none"
            >
              Active
            </button>

            <button
              id="tab-completed"
              class="relative z-10 flex-1 w-full rounded-none py-2 text-sm font-medium text-secondary transition cursor-pointer text-center xs:w-27"
            >
              Completed
            </button>

            <button
              id="tab-archived"
              class="relative z-10 flex-1 w-full rounded-b-xl py-2 text-sm font-medium text-secondary transition cursor-pointer text-center xs:w-27 xs:rounded-r-xl xs:rounded-t-none"
            >
              Archived
            </button>
          </div>

          <div class="relative w-full sm:w-120 group/search">
            <span
              class="absolute inset-y-0 left-0 flex items-center ps-3.5 pointer-events-none text-muted"
            >
              <i class="fa-regular fa-magnifying-glass text-sm"></i>
            </span>
            <input
              type="text"
              id="search-tasks"
              placeholder="Search tasks, tags, description, priority or status...."
              class="w-full ps-10 pe-20 py-2.5 truncate text-sm rounded-xl border border-border bg-surface text-primary placeholder:text-muted/70 focus:outline-none focus:border-brand/50 transition-all shadow-sm"
            />

            <div
              class="absolute inset-y-0 right-0 flex items-center pe-3 gap-2"
            >
              <button
                id="clear-search-btn"
                class="hidden opacity-0 scale-75 h-5 w-5 cursor-pointer items-center justify-center rounded-full border border-border bg-surface-2 hover:bg-surface-4 text-secondary hover:text-primary transition-all duration-200 ease-out"
                title="Clear Search"
              >
                <i class="fa-regular fa-xmark text-[10px]"></i>
              </button>

              <kbd class="flex items-center pointer-events-none">
                <span
                  class="px-1.25 py-1 text-[9px] font-mono bg-surface-2 border border-border text-muted rounded-md shadow-2xs flex flex-row justify-center items-center"
                  ><i class="fa-regular fa-slash-forward"></i
                ></span>
              </kbd>
            </div>
          </div>
        </div>

        <div
          id="tasks"
          class="w-full min-w-0"
        >
          <div
            class="mb-6 flex flex-col rounded-xl border border-border bg-surface transition-all overflow-hidden shadow-sm"
          >
            <button
              id="btn-toggle-task-form"
              class="w-full px-5 py-4 flex flex-row items-center justify-between text-left font-bold text-slate-500/80 hover:bg-surface-2/40 transition cursor-pointer"
            >
              <div class="flex items-center gap-2">
                <i class="fa-regular fa-square-plus text-brand/80"></i>
                <span class="text-sm">Create New Task</span>
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
              id="task-form-container"
              class="hidden p-5 bg-surface-2/20 animate-slide-down flex-col gap-4 rounded-b-2xl border-t border-border"
            >
              <div class="w-full grid grid-cols-1 gap-4 lg:grid-cols-3">
                <div class="w-full min-w-0 lg:col-span-2">
                  <label
                    for="task-title-input"
                    class="mb-1.5 block ps-3 text-xs font-semibold text-secondary"
                  >
                    Title
                    <span class="text-red-700"> *</span>
                  </label>
                  <input
                    id="task-title-input"
                    type="text"
                    placeholder="E.g., Implement OAuth2 authentication flow"
                    class="h-11 w-full rounded-xl border border-border bg-surface-2 px-4 text-sm text-primary placeholder:text-secondary/70 transition focus:border-brand/80 focus:outline-none"
                  />
                </div>

                <div class="w-full">
                  <label
                    for="task-duedate-input"
                    class="mb-1.5 block ps-3 text-xs font-semibold text-secondary"
                    >Due Date</label
                  >
                  <div id="create-datepicker-container"></div>
                </div>
              </div>

              <div class="w-full">
                <label
                  for="task-desc-input"
                  class="mb-1.5 block ps-3 text-xs font-semibold text-secondary"
                >
                  Description
                </label>
                <textarea
                  id="task-desc-input"
                  rows="2"
                  placeholder="Add detailed acceptance criteria or execution notes..."
                  class="w-full scrollbar-thin scrollbar-thumb-surface rounded-xl border border-border bg-surface-2 p-3 text-sm text-primary placeholder:text-secondary/70 transition focus:border-brand/80 focus:outline-none resize-none"
                ></textarea>
              </div>

              <div class="w-full grid grid-cols-1 gap-4 md:grid-cols-2">
                <div class="w-full">
                  <div id="create-priority-wrapper"></div>
                </div>

                <div class="w-full">
                  <div id="create-status-wrapper"></div>
                </div>
              </div>

              <div class="w-full relative">
                <div id="task-tags-container"></div>
              </div>

              <div
                class="flex flex-col gap-3 border-t border-border pt-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <p class="flex items-center gap-1.5 text-xs text-secondary">
                  <i class="fa-regular fa-circle-info text-brand/80"></i>
                  Tasks can be filtered using tag labels and priority tiers.
                </p>
                <button
                  id="add-task-btn"
                  class="flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-brand/80 px-5 text-sm font-semibold text-white shadow-lg shadow-brand/10 transition hover:bg-(--color-brand-hover) cursor-pointer sm:w-auto"
                >
                  <i class="fa-regular fa-plus"></i> Add Task
                </button>
              </div>
            </div>
          </div>

          <div
            id="task-filters-bar"
            class="mb-6 flex flex-wrap lg:flex-nowrap items-stretch lg:items-center justify-between gap-6 border-b border-border pb-4 w-full"
          >
            <div class="relative flex flex-1 items-center gap-2 min-w-0 group">
              <p
                class="text-xs font-bold uppercase tracking-wider text-secondary shrink-0 me-1 hidden sm:flex"
              >
                Tags:
              </p>

              <div class="relative flex-1 min-w-0 flex items-center">
                <button
                  id="btn-scroll-left"
                  type="button"
                  class="absolute left-0 z-20 hidden h-7 w-7 items-center justify-center rounded-lg border border-border bg-surface/95 backdrop-blur-xl shadow-2xl text-secondary hover:text-primary hover:border-brand/50 transition-all cursor-pointer"
                >
                  <i class="fa-regular fa-chevron-left text-xs"></i>
                </button>

                <div
                  id="task-filter-scroll"
                  class="flex flex-1 min-w-0 flex-row items-center gap-2 overflow-x-auto px-1 scrollbar-none scroll-smooth transition-all duration-300"
                >
                  <button
                    data-tag="all"
                    class="tag-filter-btn h-8 shrink-0 whitespace-nowrap rounded-lg bg-brand/80 shadow-brand/10 px-3.5 text-xs font-semibold text-white transition cursor-pointer"
                  >
                    All Tasks
                  </button>
                </div>

                <button
                  id="btn-scroll-right"
                  type="button"
                  class="absolute right-0 z-20 flex h-7 w-7 items-center justify-center rounded-lg border border-border bg-surface/95 backdrop-blur-xl shadow-2xl text-secondary hover:text-primary hover:border-brand/50 transition-all cursor-pointer"
                >
                  <i class="fa-regular fa-chevron-right text-xs"></i>
                </button>
              </div>
            </div>

            <div
              class="flex flex-wrap sm:flex-nowrap items-center justify-between sm:justify-end gap-3"
            >
              <div class="w-full flex flex-col xs:flex-row items-center gap-3">
                <div class="w-full flex items-center gap-2">
                  <div
                    id="date-filter-autocomplete-wrapper"
                  ></div>
                </div>

                <div class="w-full flex items-center gap-2">
                  <div
                    id="sort-autocomplete-wrapper"
                  ></div>
                </div>
              </div>

              <div
                id="task-count-badge"
                class="shrink-0 flex justify-center items-center gap-1.5 px-4 py-2 bg-surface-3 rounded-xl text-xs font-bold text-primary select-none w-full sm:w-36 lg:w-auto"
              >
                0 Tasks
              </div>
            </div>
          </div>

          <div
            id="task-list"
            class="mt-6 w-full space-y-3"
          ></div>
        </div>
      </section>
    `;
  },
};

function setupTaskFiltersDragScroll() {
  const scrollContainer = document.getElementById("task-filter-scroll");
  const btnLeft = document.getElementById("btn-scroll-left");
  const btnRight = document.getElementById("btn-scroll-right");

  if (!scrollContainer || !btnLeft || !btnRight) return;

  const scrollStep = 180;

  const updateScrollState = () => {
    const hasOverflow =
      scrollContainer.scrollWidth - scrollContainer.clientWidth > 1;
    const atStart = scrollContainer.scrollLeft <= 2;
    const atEnd =
      scrollContainer.scrollLeft + scrollContainer.clientWidth >=
      scrollContainer.scrollWidth - 2;

    btnLeft.classList.toggle("hidden", atStart || !hasOverflow);
    btnLeft.classList.toggle("flex", !atStart && hasOverflow);

    btnRight.classList.toggle("hidden", !hasOverflow || atEnd);
    btnRight.classList.toggle("flex", hasOverflow && !atEnd);

    if (!hasOverflow) {
      scrollContainer.style.webkitMaskImage = "none";
      scrollContainer.style.maskImage = "none";
      return;
    }

    let maskImage = "";
    const fadeWidth = "100px";

    if (atStart && atEnd) {
      maskImage = "none";
    } else if (atStart) {
      maskImage = `linear-gradient(to right, black 0%, black calc(100% - ${fadeWidth}), transparent 100%)`;
    } else if (atEnd) {
      maskImage = `linear-gradient(to right, transparent 0%, black ${fadeWidth}, black 100%)`;
    } else {
      maskImage = `linear-gradient(to right, transparent 0%, black ${fadeWidth}, black calc(100% - ${fadeWidth}), transparent 100%)`;
    }

    scrollContainer.style.webkitMaskImage = maskImage;
    scrollContainer.style.maskImage = maskImage;
  };

  const scheduleUpdate = () => {
    requestAnimationFrame(() => {
      requestAnimationFrame(updateScrollState);
    });
  };

  scrollContainer.addEventListener("scroll", updateScrollState);

  if (typeof ResizeObserver !== "undefined") {
    const resizeObserver = new ResizeObserver(() => {
      scheduleUpdate();
    });

    resizeObserver.observe(scrollContainer);

    if (scrollContainer.parentElement) {
      resizeObserver.observe(scrollContainer.parentElement);
    }
  }

  const mutationObserver = new MutationObserver(() => {
    scheduleUpdate();
  });

  mutationObserver.observe(scrollContainer, {
    childList: true,
    subtree: true,
  });

  btnLeft.addEventListener("click", (e) => {
    e.stopPropagation();
    scrollContainer.scrollLeft -= scrollStep;
  });

  btnRight.addEventListener("click", (e) => {
    e.stopPropagation();
    scrollContainer.scrollLeft += scrollStep;
  });

  window.addEventListener("resize", scheduleUpdate);
  window.addEventListener("load", scheduleUpdate);

  scheduleUpdate();
}

if (typeof window !== "undefined") {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      requestAnimationFrame(setupTaskFiltersDragScroll);
    });
  } else {
    requestAnimationFrame(setupTaskFiltersDragScroll);
  }
}
