export const CATEGORY_OPTIONS = [
  {
    title: "General & Miscellaneous",
    value: "general",
    icon: "ti ti-folders text-yellow-500/80 text-sm lg:text-base pb-0.5",
    class: "bg-yellow-500/10 text-yellow-500/80 border-yellow-500/20",
    buttonClass:
      "category-filter-btn h-8 shrink-0 whitespace-nowrap rounded-lg px-3.5 text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 bg-surface border border-border text-secondary hover:text-color hover:bg-surface-2",
  },
  {
    title: "Health & Bio-Maintenance",
    value: "health",
    icon: "ti ti-apple text-emerald-500/80 text-sm lg:text-base pb-0.5",
    class: "bg-emerald-500/10 text-emerald-500/80 border-emerald-500/20",
    buttonClass:
      "category-filter-btn h-8 shrink-0 whitespace-nowrap rounded-lg px-3.5 text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 bg-surface border border-border text-secondary hover:text-color hover:bg-surface-2",
  },
  {
    title: "Work & Production Development",
    value: "work",
    icon: "ti ti-code text-cyan-500/80 text-sm lg:text-base pb-0.5",
    class: "bg-cyan-500/10 text-cyan-500/80 border-cyan-500/20",
    buttonClass:
      "category-filter-btn h-8 shrink-0 whitespace-nowrap rounded-lg px-3.5 text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 bg-surface border border-border text-secondary hover:text-color hover:bg-surface-2",
  },
  {
    title: "Research & Deep Dive",
    value: "research",
    icon: "ti ti-microscope text-violet-500/80 text-sm lg:text-base pb-0.5",
    class: "bg-violet-500/10 text-violet-500/80 border-violet-500/20",
    buttonClass:
      "category-filter-btn h-8 shrink-0 whitespace-nowrap rounded-lg px-3.5 text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 bg-surface border border-border text-secondary hover:text-color hover:bg-surface-2",
  },
  {
    title: "Academics & Advanced Knowledge",
    value: "academics",
    icon: "ti ti-school text-pink-500/80 text-sm lg:text-base pb-0.5",
    class: "bg-pink-500/10 text-pink-500/80 border-pink-500/20",
    buttonClass:
      "category-filter-btn h-8 shrink-0 whitespace-nowrap rounded-lg px-3.5 text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 bg-surface border border-border text-secondary hover:text-color hover:bg-surface-2",
  },
  {
    title: "Open Source & Side Projects",
    value: "openSource",
    icon: "ti ti-git-branch text-lime-500/80 text-sm lg:text-base pb-0.5",
    class: "bg-lime-500/10 text-lime-500/80 border-lime-500/20",
    buttonClass:
      "category-filter-btn h-8 shrink-0 whitespace-nowrap rounded-lg px-3.5 text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 bg-surface border border-border text-secondary hover:text-color hover:bg-surface-2",
  },
  {
    title: "System Design & Soft Skills",
    value: "systemDesign",
    icon: "ti ti-sitemap text-blue-500/80 text-sm lg:text-base pb-0.5",
    class: "bg-blue-500/10 text-blue-500/80 border-blue-500/20",
    buttonClass:
      "category-filter-btn h-8 shrink-0 whitespace-nowrap rounded-lg px-3.5 text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 bg-surface border border-border text-secondary hover:text-color hover:bg-surface-2",
  },
  {
    title: "Digital Detox & Reset",
    value: "digitalDetox",
    icon: "ti ti-devices-off text-fuchsia-500/80 text-sm lg:text-base pb-0.5",
    class: "bg-fuchsia-500/10 text-fuchsia-500/80 border-fuchsia-500/20",
    buttonClass:
      "category-filter-btn h-8 shrink-0 whitespace-nowrap rounded-lg px-3.5 text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 bg-surface border border-border text-secondary hover:text-color hover:bg-surface-2",
  },
  {
    title: "Daily Routines & Workflow",
    value: "routine",
    icon: "ti ti-calendar-check text-orange-500/80 text-sm lg:text-base pb-0.5",
    class: "bg-orange-500/10 text-orange-500/80 border-orange-500/20",
    buttonClass:
      "category-filter-btn h-8 shrink-0 whitespace-nowrap rounded-lg px-3.5 text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 bg-surface border border-border text-secondary hover:text-color hover:bg-surface-2",
  },
  {
    title: "Harmful Habits",
    value: "harmful",
    icon: "ti ti-smoking text-red-500/80 text-sm lg:text-base pb-0.5",
    class: "bg-red-500/10 text-red-500/80 border-red-500/20",
    buttonClass:
      "category-filter-btn h-8 shrink-0 whitespace-nowrap rounded-lg px-3.5 text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 bg-surface border border-border text-secondary hover:text-color hover:bg-surface-2",
  },
];

export const FREQUENCY_OPTIONS = [
  {
    title: "Everyday (7 days/wk)",
    value: 7,
    icon: "ti ti-number-7 text-brand",
    class: "bg-brand/10 text-brand/80 border-brand/20",
  },
  {
    title: "High Intensity (6 days/wk)",
    value: 6,
    icon: "ti ti-number-6 text-brand/80",
    class: "bg-brand/10 text-brand/80 border-brand/20",
  },
  {
    title: "Workweek Pace (5 days/wk)",
    value: 5,
    icon: "ti ti-number-5 text-brand/70",
    class: "bg-brand/10 text-brand/80 border-brand/20",
  },
  {
    title: "Consistent (4 days/wk)",
    value: 4,
    icon: "ti ti-number-4 text-brand/60",
    class: "bg-brand/10 text-brand/80 border-brand/20",
  },
  {
    title: "Flexible Routine (3 days/wk)",
    value: 3,
    icon: "ti ti-number-3 text-brand/50",
    class: "bg-brand/10 text-brand/80 border-brand/20",
  },
  {
    title: "Intermittent (2 days/wk)",
    value: 2,
    icon: "ti ti-number-2 text-brand/40",
    class: "bg-brand/10 text-brand/80 border-brand/20",
  },
  {
    title: "Minimal Focus (1 day/wk)",
    value: 1,
    icon: "ti ti-number-1 text-brand/30",
    class: "bg-brand/10 text-brand/80 border-brand/20",
  },
];

export const FILTER_OPTIONS_BY_TAB = [
  {
    value: "all",
    title: "All Habits",
    icon: "ti ti-list text-slate-500/80 text-sm lg:text-base pb-0.5",
    class: "bg-slate-500/10 text-slate-500/80 border-slate-500/20",
  },
  {
    value: "done_today",
    title: "Done Today",
    icon: "ti ti-circle-check text-emerald-500/80 text-sm lg:text-base pb-0.5",
    class: "bg-emerald-500/10 text-emerald-500/80 border-emerald-500/20",
  },
  {
    value: "pending_today",
    title: "Pending Today",
    icon: "ti ti-clock-hour-4 text-amber-500/80 text-sm lg:text-base pb-0.5",
    class: "bg-amber-500/10 text-amber-500/80 border-amber-500/20",
  },
  {
    value: "skipped_today",
    title: "Skipped Today",
    icon: "ti ti-player-skip-forward text-orange-500/80 text-sm lg:text-base pb-0.5",
    class: "bg-orange-500/10 text-orange-500/80 border-orange-500/20",
  },
  {
    value: "never_completed",
    title: "Never Completed",
    icon: "ti ti-circle-dashed text-rose-500/80 text-sm lg:text-base pb-0.5",
    class: "bg-rose-500/10 text-rose-500/80 border-rose-500/20",
  },
  {
    value: "has_streak",
    title: "Has Streak",
    icon: "ti ti-flame text-red-500/80 text-sm lg:text-base pb-0.5",
    class: "bg-red-500/10 text-red-500/80 border-red-500/20",
  },
];

export const SORT_OPTIONS_BY_TAB = [
  {
    value: "streak",
    title: "Current Streak",
    icon: "ti ti-flame text-red-500/80 text-sm lg:text-base pb-0.5",
    class: "bg-red-500/10 text-red-500/80 border-red-500/20",
  },
  {
    value: "frequency",
    title: "Frequency",
    icon: "ti ti-repeat text-brand text-sm lg:text-base pb-0.5",
    class: "bg-brand/10 text-brand/80 border-brand/20",
  },
  {
    value: "completionRate",
    title: "Completion Rate",
    icon: "ti ti-percentage text-violet-500/80 text-sm lg:text-base pb-0.5",
    class: "bg-violet-500/10 text-violet-500/80 border-violet-500/20",
  },
  {
    value: "createdAt",
    title: "Recently Created",
    icon: "ti ti-clock text-rose-500/80 text-sm lg:text-base pb-0.5",
    class: "bg-rose-500/10 text-rose-500/80 border-rose-500/20",
  },
  {
    value: "name",
    title: "Name (A-Z)",
    icon: "ti ti-sort-ascending-letters text-sky-500/80 text-sm lg:text-base pb-0.5",
    class: "bg-sky-500/10 text-sky-500/80 border-sky-500/20",
  },
  {
    value: "category",
    title: "Category",
    icon: "ti ti-folders text-yellow-500/80 text-sm lg:text-base pb-0.5",
    class: "bg-yellow-500/10 text-yellow-500/80 border-yellow-500/20",
  },
];
