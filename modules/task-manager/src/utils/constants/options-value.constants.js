export const PRIORITY_OPTIONS = [
  {
    title: "Low",
    value: "low",
    icon: "ti ti-flag text-emerald-500/80 text-sm lg:text-base pb-0.5",
    class: "bg-emerald-500/10 text-emerald-500/80 border-emerald-500/20",
  },
  {
    title: "Medium",
    value: "medium",
    icon: "ti ti-flag text-yellow-500/80 text-sm lg:text-base pb-0.5",
    class: "bg-yellow-500/10 text-yellow-500/80 border-yellow-500/20",
  },
  {
    title: "High",
    value: "high",
    icon: "ti ti-flag text-red-500/80 text-sm lg:text-base pb-0.5",
    class: "bg-red-500/10 text-red-500/80 border-red-500/20",
  },
];

export const STATUS_OPTIONS = [
  {
    title: "To Do",
    value: "todo",
    icon: "ti ti-circle text-sky-500/80 text-sm lg:text-base pb-0.5",
    class: "bg-sky-500/10 text-sky-500/80 border-sky-500/20",
  },
  {
    title: "In Progress",
    value: "in_progress",
    icon: "ti ti-progress-down text-yellow-500/80 text-sm lg:text-base pb-0.5",
    class: "bg-yellow-500/10 text-yellow-500/80 border-yellow-500/20",
  },
  {
    title: "Blocked",
    value: "blocked",
    icon: "ti ti-ban text-red-500/80 text-sm lg:text-base pb-0.5",
    class: "bg-red-500/10 text-red-500/80 border-red-500/20",
  },
  {
    title: "Done",
    value: "done",
    icon: "ti ti-circle-check text-emerald-500/80 text-sm lg:text-base pb-0.5",
    class: "bg-emerald-500/10 text-emerald-500/80 border-emerald-500/20",
  },
];

export const FILTER_OPTIONS_BY_TAB = [
  {
    value: "all",
    title: "All Dates",
    icon: "ti ti-calendar text-emerald-500/80 text-sm lg:text-base pb-0.5",
    class: "bg-emerald-500/10 text-emerald-500/80 border-emerald-500/20",
  },
  {
    value: "overdue",
    title: "Overdue",
    icon: "ti ti-clock text-rose-500/80 text-sm lg:text-base pb-0.5",
    class: "bg-rose-500/10 text-rose-500/80 border-rose-500/20",
  },
  {
    value: "today",
    title: "Today",
    icon: "ti ti-calendar-event text-sky-500/80 text-sm lg:text-base pb-0.5",
    class: "bg-sky-500/10 text-sky-500/80 border-sky-500/20",
  },
  {
    value: "this_week",
    title: "This Week",
    icon: "ti ti-calendar-week text-yellow-500/80 text-sm lg:text-base pb-0.5",
    class: "bg-yellow-500/10 text-yellow-500/80 border-yellow-500/20",
  },
  {
    value: "no_date",
    title: "No Due Date",
    icon: "ti ti-calendar-x text-slate-500/80 text-sm lg:text-base pb-0.5",
    class: "bg-slate-500/10 text-slate-500/80 border-slate-500/20",
  },
];

export const SORT_OPTIONS_BY_TAB = [
  {
    value: "priority",
    title: "Priority",
    icon: "ti ti-sort-descending text-sky-500/80 text-sm lg:text-base pb-0.5",
    class: "bg-sky-500/10 text-sky-500/80 border-sky-500/20",
  },
  {
    value: "dueDate",
    title: "Due Date",
    icon: "ti ti-calendar text-emerald-500/80 text-sm lg:text-base pb-0.5",
    class: "bg-emerald-500/10 text-emerald-500/80 border-emerald-500/20",
  },
  {
    value: "status",
    title: "Status",
    icon: "ti ti-progress text-yellow-500/80 text-sm lg:text-base pb-0.5",
    class: "bg-yellow-500/10 text-yellow-500/80 border-yellow-500/20",
  },
  {
    value: "createdAt",
    title: "Date Created",
    icon: "ti ti-clock text-rose-500/80 text-sm lg:text-base pb-0.5",
    class: "bg-rose-500/10 text-rose-500/80 border-rose-500/20",
  },
  {
    value: "title",
    title: "Title (A-Z)",
    icon: "ti ti-sort-ascending-letters text-violet-500/80 text-sm lg:text-base pb-0.5",
    class: "bg-violet-500/10 text-violet-500/80 border-violet-500/20",
  },
];
