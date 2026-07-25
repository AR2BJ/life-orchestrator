export const HabitsView = {
  render() {
    return `
      <section
        id="habits-view"
        class="flex w-full min-w-0 flex-col"
      >
        <div
          class="mb-6 flex flex-col sm:flex-row gap-4 justify-between items-center w-full"
        >
          <div
            class="relative flex w-full justify-center rounded-xl border border-border bg-surface-2 p-1 sm:w-fit sm:justify-start"
          >
            <div
              id="tab-indicator"
              class="absolute top-1 left-1 h-[calc(100%-8px)] w-27 rounded-lg bg-brand/80 transition-all duration-300 translate-x-0 sm:w-27.5"
            ></div>

            <button
              id="tab-active"
              class="relative z-10 flex-1 w-27 rounded-l-xl py-2 text-sm font-medium text-(--color-btn-primary-text) transition cursor-pointer sm:w-27.5 sm:flex-none"
            >
              Active
            </button>

            <button
              id="tab-archived"
              class="relative z-10 flex-1 w-27 rounded-r-xl py-2 text-sm font-medium text-secondary transition cursor-pointer sm:w-27.5 sm:flex-none"
            >
              Archived
            </button>
          </div>

          <div class="relative w-full sm:w-72 group/search">
            <span
              class="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-muted"
            >
              <i class="fa-regular fa-magnifying-glass text-sm"></i>
            </span>
            <input
              type="text"
              id="search-habits"
              placeholder="Search habits...."
              class="w-full pl-10 pr-10 py-3 text-sm rounded-xl border border-border bg-surface text-primary placeholder:text-muted/70 focus:outline-none focus:border-brand/50 transition-all shadow-sm"
            />

            <div
              class="absolute inset-y-0 right-0 flex items-center pr-3 gap-3"
            >
              <button
                id="clear-search-btn"
                class="hidden opacity-0 scale-75 h-5 w-5 cursor-pointer items-center justify-center rounded-full border border-border bg-surface-2 hover:bg-(--color-surface-4) text-secondary hover:text-primary transition-all duration-200 ease-out"
                title="Clear Search"
              >
                <i class="fa-solid fa-xmark text-[10px]"></i>
              </button>

              <kbd class="flex items-center pointer-events-none">
                <span
                  class="px-1.5 py-0.5 text-[10px] font-mono bg-surface-2 border border-border text-muted rounded-md shadow-2xs"
                  >/</span
                >
              </kbd>
            </div>
          </div>
        </div>

        <div
          id="habits"
          class="w-full min-w-0"
        >
          <div
            class="mb-6 flex flex-col rounded-xl border border-border bg-surface transition-all overflow-hidden shadow-sm"
          >
            <button
              id="btn-toggle-habit-form"
              class="w-full px-5 py-4 flex flex-row items-center justify-between text-left font-bold text-slate-500/80 hover:bg-surface-2/40 transition cursor-pointer"
            >
              <div class="flex items-center gap-2">
                <i class="fa-regular fa-square-plus text-brand/80"></i>
                <span class="text-sm">Create New Habit</span>
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
              id="habit-form-container"
              class="hidden p-5 bg-surface-2/20 animate-slide-down flex-col gap-4 rounded-b-2xl border-t border-border"
            >
              <div
                class="w-full grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4"
              >
                <div class="w-full min-w-0 sm:col-span-2 xl:col-span-2">
                  <label
                    for="habit-input"
                    class="mb-2 block ps-2 text-sm font-semibold text-secondary sm:text-xs"
                  >
                    Habit name
                  </label>
                  <input
                    id="habit-input"
                    type="text"
                    placeholder="What habit do you want to build?..."
                    class="h-12 w-full rounded-xl border border-border bg-surface px-4 text-sm text-primary placeholder:text-secondary/70 transition focus:border-brand/80 focus:outline-none"
                  />
                </div>

                <div class="w-full min-w-0">
                  <label
                    for="habit-category-select"
                    class="mb-2 block ps-2 text-sm font-semibold text-secondary sm:text-xs"
                  >
                    Category
                  </label>
                  <div class="relative w-full min-w-0">
                    <select
                      id="habit-category-select"
                      class="form-select h-12 w-full cursor-pointer rounded-xl border border-border bg-surface px-3 pr-10 text-sm text-primary focus:border-brand/80 focus:outline-none"
                    >
                      <option
                        value="General"
                        selected
                      >
                        General
                      </option>
                      <option value="Health">Health & Bio-Maintenance</option>
                      <option value="Work">Work & Production Dev</option>
                      <option value="Research">
                        Research & Deep Dive (Thesis/Next-Gen Tech)
                      </option>
                      <option value="Academics">
                        Academics & Advanced Knowledge
                      </option>
                      <option value="OpenSource">
                        Open Source & Side Projects
                      </option>
                      <option value="SystemDesign">
                        System Design & Soft Skills
                      </option>
                      <option value="DigitalDetox">
                        Digital Detox & Reset
                      </option>
                      <option value="Routine">
                        Daily Architecture & Workflow
                      </option>
                      <option value="Harmful">Harmful Habits</option>
                    </select>
                  </div>
                </div>

                <div class="w-full min-w-0">
                  <label
                    for="habit-frequency-select"
                    class="mb-2 block ps-2 text-sm font-semibold text-secondary sm:text-xs"
                  >
                    Days per week
                  </label>
                  <div class="relative w-full min-w-0">
                    <select
                      id="habit-frequency-select"
                      class="form-select h-12 w-full cursor-pointer rounded-xl border border-border bg-surface px-3 pr-10 text-sm text-primary focus:border-brand/80 focus:outline-none"
                    >
                      <option
                        value="7"
                        selected
                      >
                        Everyday (7 days/wk)
                      </option>
                      <option value="6">High Intensity (6 days/wk)</option>
                      <option value="5">Workweek Pace (5 days/wk)</option>
                      <option value="4">Consistent (4 days/wk)</option>
                      <option value="3">Flexible Routine (3 days/wk)</option>
                      <option value="2">Intermittent (2 days/wk)</option>
                      <option value="1">Minimal Focus (1 day/wk)</option>
                    </select>
                  </div>
                </div>
              </div>

              <div
                class="flex flex-col gap-4 border-t border-border pt-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <p class="flex items-center gap-1.5 text-xs text-secondary">
                  <i class="fa-regular fa-circle-info text-brand/80"></i>
                  Categorization isolates metrics inside your dashboard.
                </p>
                <button
                  id="add-habit-btn"
                  class="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-brand/80 px-4 text-sm font-semibold text-white shadow-lg shadow-brand/10 transition hover:bg-(--color-brand-hover) cursor-pointer sm:w-auto"
                >
                  <i class="fa-regular fa-plus"></i> Add Habit
                </button>
              </div>
            </div>
          </div>

          <div
            id="category-filters"
            class="relative mb-6 flex flex-row items-center justify-between gap-4 border-b border-border pb-4 w-full group"
          >
            <p
              class="text-xs font-bold uppercase tracking-wider text-secondary shrink-0 mr-1 hidden sm:block"
            >
              Filter by:
            </p>

            <button
              id="btn-scroll-left"
              class="absolute left-1.5 sm:left-23 z-20 lg:hidden hidden h-7 w-7 items-center justify-center rounded-lg border border-border bg-surface text-secondary hover:text-primary shadow-xs opacity-0 group-hover:opacity-80 hover:opacity-100 transition-opacity cursor-pointer"
            >
              <i class="fa-regular fa-chevron-left text-xs"></i>
            </button>

            <div
              id="habit-filter-scroll"
              class="flex flex-1 min-w-0 flex-row items-center gap-2 overflow-x-auto pr-2 scrollbar-none scroll-smooth"
            >
              <button
                data-category="all"
                class="category-filter-btn h-8 shrink-0 whitespace-nowrap rounded-lg bg-brand/80 shadow-brand/10 px-4 text-xs font-semibold text-white transition cursor-pointer"
              >
                All
              </button>

              <button
                data-category="General"
                class="category-filter-btn h-8 shrink-0 whitespace-nowrap rounded-lg bg-(--color-surface-3) px-4 text-xs font-medium text-secondary transition hover:bg-(--color-surface-4) flex flex-row justify-center items-center gap-2 hover:text-secondary cursor-pointer"
              >
                <i
                  class="category-icon fa-regular fa-folders text-yellow-500/80"
                ></i>
                <span>General</span>
              </button>

              <button
                data-category="Health"
                class="category-filter-btn h-8 shrink-0 whitespace-nowrap rounded-lg bg-(--color-surface-3) px-4 text-xs font-medium text-secondary transition hover:bg-(--color-surface-4) flex flex-row justify-center items-center gap-2 hover:text-secondary cursor-pointer"
              >
                <i
                  class="category-icon fa-regular fa-apple-whole text-emerald-500/80"
                ></i>
                <span>Health</span>
              </button>

              <button
                data-category="Work"
                class="category-filter-btn h-8 shrink-0 whitespace-nowrap rounded-lg bg-(--color-surface-3) px-4 text-xs font-medium text-secondary transition hover:bg-(--color-surface-4) flex flex-row justify-center items-center gap-2 hover:text-secondary cursor-pointer"
              >
                <i
                  class="category-icon fa-regular fa-laptop-code text-cyan-500/80"
                ></i>
                <span>Work</span>
              </button>
              
              <button
                data-category="Research"
                class="category-filter-btn h-8 shrink-0 whitespace-nowrap rounded-lg bg-(--color-surface-3) px-4 text-xs font-medium text-secondary transition hover:bg-(--color-surface-4) flex flex-row justify-center items-center gap-2 hover:text-secondary cursor-pointer"
              >
                <i
                  class="category-icon fa-regular fa-microscope text-violet-500/80"
                ></i>
                <span>Research</span>
              </button>

              <button
                data-category="Academics"
                class="category-filter-btn h-8 shrink-0 whitespace-nowrap rounded-lg bg-(--color-surface-3) px-4 text-xs font-medium text-secondary transition hover:bg-(--color-surface-4) flex flex-row justify-center items-center gap-2 hover:text-secondary cursor-pointer"
              >
                <i
                  class="category-icon fa-regular fa-graduation-cap text-pink-500/80"
                ></i>
                <span>Academics</span>
              </button>

              <button
                data-category="OpenSource"
                class="category-filter-btn h-8 shrink-0 whitespace-nowrap rounded-lg bg-(--color-surface-3) px-4 text-xs font-medium text-secondary transition hover:bg-(--color-surface-4) flex flex-row justify-center items-center gap-2 hover:text-secondary cursor-pointer"
              >
                <i class="category-icon fa-regular fa-code-branch text-lime-500/80"></i>
                <span>OpenSource</span>
              </button>

              <button
                data-category="SystemDesign"
                class="category-filter-btn h-8 shrink-0 whitespace-nowrap rounded-lg bg-(--color-surface-3) px-4 text-xs font-medium text-secondary transition hover:bg-(--color-surface-4) flex flex-row justify-center items-center gap-2 hover:text-secondary cursor-pointer"
              >
                <i class="category-icon fa-regular fa-diagram-project text-blue-500/80"></i>
                <span>SystemDesign</span>
              </button>

              <button
                data-category="DigitalDetox"
                class="category-filter-btn h-8 shrink-0 whitespace-nowrap rounded-lg bg-(--color-surface-3) px-4 text-xs font-medium text-secondary transition hover:bg-(--color-surface-4) flex flex-row justify-center items-center gap-2 hover:text-secondary cursor-pointer"
              >
                <i class="category-icon fa-regular fa-person-meditating text-fuchsia-500/80"></i>
                <span>DigitalDetox</span>
              </button>

              <button
                data-category="Routine"
                class="category-filter-btn h-8 shrink-0 whitespace-nowrap rounded-lg bg-(--color-surface-3) px-4 text-xs font-medium text-secondary transition hover:bg-(--color-surface-4) flex flex-row justify-center items-center gap-2 hover:text-secondary cursor-pointer"
              >
                <i class="category-icon fa-regular fa-calendar-check text-orange-500/80"></i>
                <span>Routine</span>
              </button>

              <button
                data-category="Harmful"
                class="category-filter-btn h-8 shrink-0 whitespace-nowrap rounded-lg bg-(--color-surface-3) px-4 text-xs font-medium text-secondary transition hover:bg-(--color-surface-4) flex flex-row justify-center items-center gap-2 hover:text-secondary cursor-pointer"
              >
                <i
                  class="category-icon fa-regular fa-ban-smoking text-red-500/80"
                ></i>
                <span>Harmful</span>
              </button>
            </div>

            <button
              id="btn-scroll-right"
              class="absolute right-26 z-20 lg:hidden flex h-7 w-7 items-center justify-center rounded-lg border border-border bg-surface text-secondary hover:text-primary shadow-xs opacity-0 group-hover:opacity-80 hover:opacity-100 transition-opacity cursor-pointer"
            >
              <i class="fa-regular fa-chevron-right text-xs"></i>
            </button>

            <div
              id="habit-count-badge"
              class="shrink-0 flex items-center gap-1.5 px-3 py-1 bg-(--color-surface-3) rounded-xl text-xs font-bold text-primary select-none animate-fade-in"
            ></div>
          </div>

          <div
            id="habit-list"
            class="mt-6 w-full space-y-4"
          ></div>
        </div>
      </section>
    `;
  },
};

function setupHabitFiltersDragScroll() {
  const scrollContainer = document.getElementById("habit-filter-scroll");
  const btnLeft = document.getElementById("btn-scroll-left");
  const btnRight = document.getElementById("btn-scroll-right");

  if (!scrollContainer || !btnLeft || !btnRight) return;

  const scrollStep = 180;

  function updateScrollButtons() {
    const atStart = scrollContainer.scrollLeft <= 0;
    const atEnd =
      scrollContainer.scrollLeft + scrollContainer.clientWidth >=
      scrollContainer.scrollWidth - 1;

    btnLeft.classList.toggle("hidden", atStart);
    btnLeft.classList.toggle("flex", !atStart);
    btnRight.classList.toggle("hidden", atEnd);
    btnRight.classList.toggle("flex", !atEnd);
  }

  ["scroll", "mouseenter"].forEach((event) =>
    scrollContainer.addEventListener(event, updateScrollButtons),
  );

  btnLeft.addEventListener("click", (e) => {
    e.stopPropagation();
    scrollContainer.scrollLeft -= scrollStep;
  });

  btnRight.addEventListener("click", (e) => {
    e.stopPropagation();
    scrollContainer.scrollLeft += scrollStep;
  });

  updateScrollButtons();
}

if (typeof window !== "undefined") {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      requestAnimationFrame(setupHabitFiltersDragScroll);
    });
  } else {
    requestAnimationFrame(setupHabitFiltersDragScroll);
  }
}
