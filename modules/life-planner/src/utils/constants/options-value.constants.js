export const LIFE_AREAS = [
  {
    id: "productivity",
    name: "Systems & Organization",
    icon: "ti ti-settings text-yellow-500/80 text-sm lg:text-base pb-0.5",
    class: "bg-yellow-500/10 text-yellow-500/80 border-yellow-500/20",
  },
  {
    id: "health",
    name: "Health & Fitness",
    icon: "ti ti-heartbeat text-emerald-500/80 text-sm lg:text-base pb-0.5",
    class: "bg-emerald-500/10 text-emerald-500/80 border-emerald-500/20",
  },
  {
    id: "personal",
    name: "Personal Growth",
    icon: "ti ti-user text-lime-500/80 text-sm lg:text-base pb-0.5",
    class: "bg-lime-500/10 text-lime-500/80 border-lime-500/20",
  },
  {
    id: "career",
    name: "Career & Work",
    icon: "ti ti-briefcase text-cyan-500/80 text-sm lg:text-base pb-0.5",
    class: "bg-cyan-500/10 text-cyan-500/80 border-cyan-500/20",
  },
  {
    id: "creativity",
    name: "Hobbies & Creativity",
    icon: "ti ti-palette text-blue-500/80 text-sm lg:text-base pb-0.5",
    class: "bg-blue-500/10 text-blue-500/80 border-blue-500/20",
  },
  {
    id: "finance",
    name: "Finance & Wealth",
    icon: "ti ti-wallet text-violet-500/80 text-sm lg:text-base pb-0.5",
    class: "bg-violet-500/10 text-violet-500/80 border-violet-500/20",
  },
  {
    id: "lifestyle",
    name: "Lifestyle & Social",
    icon: "ti ti-masks-theater text-pink-500/80 text-sm lg:text-base pb-0.5",
    class: "bg-pink-500/10 text-pink-500/80 border-pink-500/20",
  },
  {
    id: "mindset",
    name: "Mindset & Mental Health",
    icon: "ti ti-brain text-fuchsia-500/80 text-sm lg:text-base pb-0.5",
    class: "bg-fuchsia-500/10 text-fuchsia-500/80 border-fuchsia-500/20",
  },
  {
    id: "relationships",
    name: "Family & Relationships",
    icon: "ti ti-home-heart text-orange-500/80 text-sm lg:text-base pb-0.5",
    class: "bg-orange-500/10 text-orange-500/80 border-orange-500/20",
  },
  {
    id: "environment",
    name: "Environment & Home",
    icon: "ti ti-home text-red-500/80 text-sm lg:text-base pb-0.5",
    class: "bg-red-500/10 text-red-500/80 border-red-500/20",
  },
];

export const PLAN_STATES = [
  {
    id: "active",
    name: "Active",
    icon: "ti ti-player-play text-cyan-500/80 text-sm lg:text-base pb-0.5",
    class: "bg-cyan-500/10 text-cyan-500/80 border-cyan-500/20",
  },
  {
    id: "paused",
    name: "Paused",
    icon: "ti ti-player-pause text-yellow-500/80 text-sm lg:text-base pb-0.5",
    class: "bg-yellow-500/10 text-yellow-500/80 border-yellow-500/20",
  },
  {
    id: "completed",
    name: "Completed",
    icon: "ti ti-checks text-emerald-500/80 text-sm lg:text-base pb-0.5",
    class: "bg-emerald-500/10 text-emerald-500/80 border-emerald-500/20",
  },
];

export const OBJECTIVE_TYPES = [
  {
    id: "boolean",
    name: "Boolean (Done/Not Done)",
    icon: "ti ti-square-check text-cyan-500/80 text-sm lg:text-base pb-0.5",
  },
  {
    id: "numeric",
    name: "Numeric Target",
    icon: "ti ti-abacus text-emerald-500/80 text-sm lg:text-base pb-0.5",
  },
  {
    id: "milestone",
    name: "Milestone",
    icon: "ti ti-flag text-yellow-500/80 text-sm lg:text-base pb-0.5",
  },
];

export const OBJECTIVE_UNITS = [
  {
    id: "count",
    name: "Count",
    icon: "ti ti-calculator text-blue-500/80 text-sm lg:text-base pb-0.5",
  },
  {
    id: "pages",
    name: "Pages",
    icon: "ti ti-book text-cyan-500/80 text-sm lg:text-base pb-0.5",
  },
  {
    id: "step",
    name: "Steps",
    icon: "ti ti-footsteps text-lime-500/80 text-sm lg:text-base pb-0.5",
  },
  {
    id: "words",
    name: "Words Written",
    icon: "ti ti-pencil text-amber-500/80 text-sm lg:text-base pb-0.5",
  },
  {
    id: "currency",
    name: "Currency",
    icon: "ti ti-currency-dollar text-red-600/80 text-sm lg:text-base pb-0.5",
  },
  {
    id: "points",
    name: "Story Points",
    icon: "ti ti-chart-line text-fuchsia-500/80 text-sm lg:text-base pb-0.5",
  },
  {
    id: "chapters",
    name: "Chapters",
    icon: "ti ti-bookmark text-green-500/80 text-sm lg:text-base pb-0.5",
  },
  {
    id: "projects",
    name: "Projects",
    icon: "ti ti-hierarchy text-mist-500/80 text-sm lg:text-base pb-0.5",
  },
  {
    id: "episodes",
    name: "Episodes",
    icon: "ti ti-player-play text-rose-500/80 text-sm lg:text-base pb-0.5",
  },
  {
    id: "lessons",
    name: "Lessons",
    icon: "ti ti-school text-purple-500/80 text-sm lg:text-base pb-0.5",
  },
  {
    id: "checkins",
    name: "Check-ins",
    icon: "ti ti-square-check text-mauve-500/80 text-sm lg:text-base pb-0.5",
  },
  {
    id: "hrs",
    name: "Hours (hrs)",
    icon: "ti ti-clock text-violet-500/80 text-sm lg:text-base pb-0.5",
  },
  {
    id: "mins",
    name: "Minutes (mins)",
    icon: "ti ti-stopwatch text-pink-500/80 text-sm lg:text-base pb-0.5",
  },
  {
    id: "kg",
    name: "Kilograms (kg)",
    icon: "ti ti-weight text-emerald-500/80 text-sm lg:text-base pb-0.5",
  },
  {
    id: "percent",
    name: "Percentage (%)",
    icon: "ti ti-percentage text-yellow-500/80 text-sm lg:text-base pb-0.5",
  },
  {
    id: "km",
    name: "Kilometers (km)",
    icon: "ti ti-route text-teal-500/80 text-sm lg:text-base pb-0.5",
  },
  {
    id: "reps",
    name: "Repetitions (Reps)",
    icon: "ti ti-barbell text-slate-600/80 text-sm lg:text-base pb-0.5",
  },
  {
    id: "cal",
    name: "Calories (kcal)",
    icon: "ti ti-scale-outline text-indigo-500/80 text-sm lg:text-base pb-0.5",
  },
  {
    id: "streak",
    name: "Streak (Days)",
    icon: "ti ti-flame text-orange-500/80 text-sm lg:text-base pb-0.5",
  },
  {
    id: "liters",
    name: "Liters (L)",
    icon: "ti ti-bucket text-sky-500/80 text-sm lg:text-base pb-0.5",
  },
];

export const ENERGY_LEVEL_OPTIONS = [
  {
    value: 1,
    label: "1 - Low Energy",
    icon: "ti ti-battery text-red-500/80 text-sm lg:text-base pb-0.5",
    class: "bg-red-500/10 text-red-500/80 border-red-500/20",
  },
  {
    value: 2,
    label: "2 - Moderate",
    icon: "ti ti-battery-1 text-orange-500/80 text-sm lg:text-base pb-0.5",
    class: "bg-orange-500/10 text-orange-500/80 border-orange-500/20",
  },
  {
    value: 3,
    label: "3 - Normal",
    icon: "ti ti-battery-2 text-yellow-500/80 text-sm lg:text-base pb-0.5",
    class: "bg-yellow-500/10 text-yellow-500/80 border-yellow-500/20",
  },
  {
    value: 4,
    label: "4 - High Energy",
    icon: "ti ti-battery-3 text-lime-500/80 text-sm lg:text-base pb-0.5",
    class: "bg-lime-500/10 text-lime-500/80 border-lime-500/20",
  },
  {
    value: 5,
    label: "5 - Peak Performance",
    icon: "ti ti-battery-4 text-emerald-500/80 text-sm lg:text-base pb-0.5",
    class: "bg-emerald-500/10 text-emerald-500/80 border-emerald-500/20",
  },
];

export const MOOD_OPTIONS = [
  {
    value: "terrible",
    label: "Terrible",
    icon: "ti ti-mood-sad text-red-500/80 text-sm lg:text-base pb-0.5",
    class: "bg-red-500/10 text-red-500/80 border-red-500/20",
  },
  {
    value: "bad",
    label: "Bad",
    icon: "ti ti-mood-sad-2 text-orange-500/80 text-sm lg:text-base pb-0.5",
    class: "bg-orange-500/10 text-orange-500/80 border-orange-500/20",
  },
  {
    value: "neutral",
    label: "Neutral",
    icon: "ti ti-mood-empty text-yellow-500/80 text-sm lg:text-base pb-0.5",
    class: "bg-yellow-500/10 text-yellow-500/80 border-yellow-500/20",
  },
  {
    value: "good",
    label: "Good",
    icon: "ti ti-mood-smile text-cyan-500/80 text-sm lg:text-base pb-0.5",
    class: "bg-cyan-500/10 text-cyan-500/80 border-cyan-500/20",
  },
  {
    value: "excellent",
    label: "Excellent",
    icon: "ti ti-mood-happy text-emerald-500/80 text-sm lg:text-base pb-0.5",
    class: "bg-emerald-500/10 text-emerald-500/80 border-emerald-500/20",
  },
];

export const CURRENCY_OPTIONS = [
  // Major Fiat Currencies & Regional Options
  { value: "USD", title: "USD ($)", symbol: "$", position: "left" },
  { value: "EUR", title: "EUR (€)", symbol: "€", position: "left" },
  { value: "IRT", title: "IRT (تومان)", symbol: "تومان", position: "left" },
  { value: "GBP", title: "GBP (£)", symbol: "£", position: "left" },
  { value: "JPY", title: "JPY (¥)", symbol: "¥", position: "left" },
  { value: "CHF", title: "CHF (₣)", symbol: "₣", position: "right" },
  { value: "CAD", title: "CAD ($)", symbol: "$", position: "left" },
  { value: "AUD", title: "AUD ($)", symbol: "$", position: "left" },
  { value: "CNY", title: "CNY (¥)", symbol: "¥", position: "left" },

  // Middle East & Asia Pacific
  {
    value: "AED",
    title: "AED (درهم امارات)",
    symbol: "درهم",
    position: "left",
  },
  {
    value: "SAR",
    title: "SAR (رئال سعودی)",
    symbol: "رئال",
    position: "left",
  },
  { value: "QAR", title: "QAR (رئال قطر)", symbol: "رئال", position: "left" },
  {
    value: "KWD",
    title: "KWD (دینار کویت)",
    symbol: "دینار",
    position: "left",
  },
  {
    value: "JOD",
    title: "JOD (دینار اردن)",
    symbol: "دینار",
    position: "left",
  },
  { value: "AZN", title: "AZN (₼)", symbol: "₼", position: "right" },
  { value: "GEL", title: "GEL (₾)", symbol: "₾", position: "right" },
  { value: "PHP", title: "PHP (₱)", symbol: "₱", position: "left" },
  { value: "VND", title: "VND (₫)", symbol: "₫", position: "right" },
  { value: "TRY", title: "TRY (₺)", symbol: "₺", position: "left" },
  { value: "INR", title: "INR (₹)", symbol: "₹", position: "left" },
  { value: "SGD", title: "SGD ($)", symbol: "$", position: "left" },
  { value: "HKD", title: "HKD ($)", symbol: "$", position: "left" },
  { value: "KRW", title: "KRW (₩)", symbol: "₩", position: "left" },
  { value: "RUB", title: "RUB (₽)", symbol: "₽", position: "right" },
  { value: "THB", title: "THB (฿)", symbol: "฿", position: "left" },
  { value: "MYR", title: "MYR (RM)", symbol: "RM", position: "left" },
  { value: "IDR", title: "IDR (Rp)", symbol: "Rp", position: "left" },

  // Americas & Europe
  { value: "BRL", title: "BRL (R$)", symbol: "R$", position: "left" },
  { value: "MXN", title: "MXN ($)", symbol: "$", position: "left" },
  { value: "SEK", title: "SEK (kr)", symbol: "kr", position: "right" },
  { value: "NOK", title: "NOK (kr)", symbol: "kr", position: "right" },
  { value: "DKK", title: "DKK (kr)", symbol: "kr", position: "right" },
  { value: "PLN", title: "PLN (zł)", symbol: "zł", position: "right" },
  { value: "NZD", title: "NZD ($)", symbol: "$", position: "left" },
  { value: "EGP", title: "EGP (E£)", symbol: "E£", position: "left" },
  { value: "ZAR", title: "ZAR (R)", symbol: "R", position: "left" },

  // Crypto / Digital Assets
  { value: "BTC", title: "BTC (₿)", symbol: "₿", position: "right" },
  { value: "ETH", title: "ETH (Ξ)", symbol: "Ξ", position: "right" },
  { value: "USDT", title: "USDT (₮)", symbol: "₮", position: "right" },
  { value: "USDC", title: "USDC ($)", symbol: "$", position: "left" },
];

export const FILTER_OPTIONS_BY_TAB = {
  plans: [
    {
      value: "all",
      title: "All Plans",
      icon: "ti ti-layers-subtract text-cyan-500/80 text-sm lg:text-base pb-0.5",
      class: "bg-cyan-500/10 text-cyan-500/80 border-cyan-500/20",
    },
    {
      value: "active",
      title: "Active State",
      icon: "ti ti-player-play text-emerald-500/80 text-sm lg:text-base pb-0.5",
      class: "bg-emerald-500/10 text-emerald-500/80 border-emerald-500/20",
    },
    {
      value: "paused",
      title: "Paused State",
      icon: "ti ti-player-pause text-yellow-500/80 text-sm lg:text-base pb-0.5",
      class: "bg-yellow-500/10 text-yellow-500/80 border-yellow-500/20",
    },
    {
      value: "completed",
      title: "Completed State",
      icon: "ti ti-circle-check text-blue-500/80 text-sm lg:text-base pb-0.5",
      class: "bg-blue-500/10 text-blue-500/80 border-blue-500/20",
    },
    {
      value: "has_end_date",
      title: "Time-bound Plans",
      icon: "ti ti-calendar-check text-violet-500/80 text-sm lg:text-base pb-0.5",
      class: "bg-violet-500/10 text-violet-500/80 border-violet-500/20",
    },
    {
      value: "no_end_date",
      title: "Perpetual Plans",
      icon: "ti ti-infinity text-pink-500/80 text-sm lg:text-base pb-0.5",
      class: "bg-pink-500/10 text-pink-500/80 border-pink-500/20",
    },
    {
      value: "has_objectives",
      title: "With Objectives",
      icon: "ti ti-list-check text-teal-500/80 text-sm lg:text-base pb-0.5",
      class: "bg-teal-500/10 text-teal-500/80 border-teal-500/20",
    },
    {
      value: "objectives_pending",
      title: "Has Pending Tasks",
      icon: "ti ti-clock text-orange-500/80 text-sm lg:text-base pb-0.5",
      class: "bg-orange-500/10 text-orange-500/80 border-orange-500/20",
    },
  ],
  logs: [
    {
      value: "all",
      title: "All Logs",
      icon: "ti ti-calendar text-emerald-500/80 text-sm lg:text-base pb-0.5",
      class: "bg-emerald-500/10 text-emerald-500/80 border-emerald-500/20",
    },
    {
      value: "today",
      title: "Today",
      icon: "ti ti-calendar-event text-yellow-500/80 text-sm lg:text-base pb-0.5",
      class: "bg-yellow-500/10 text-yellow-500/80 border-yellow-500/20",
    },
    {
      value: "this_week",
      title: "This Week",
      icon: "ti ti-calendar-week text-pink-500/80 text-sm lg:text-base pb-0.5",
      class: "bg-pink-500/10 text-pink-500/80 border-pink-500/20",
    },
    {
      value: "this_month",
      title: "This Month",
      icon: "ti ti-calendar-month text-violet-500/80 text-sm lg:text-base pb-0.5",
      class: "bg-violet-500/10 text-violet-500/80 border-violet-500/20",
    },
    {
      value: "linked_to_plan",
      title: "Linked to Plan",
      icon: "ti ti-link text-cyan-500/80 text-sm lg:text-base pb-0.5",
      class: "bg-cyan-500/10 text-cyan-500/80 border-cyan-500/20",
    },
    {
      value: "standalone",
      title: "Standalone Logs",
      icon: "ti ti-note text-slate-500/80 text-sm lg:text-base pb-0.5",
      class: "bg-slate-500/10 text-slate-500/80 border-slate-500/20",
    },
    {
      value: "high_energy",
      title: "High Energy (4-5)",
      icon: "ti ti-battery-4 text-emerald-500/80 text-sm lg:text-base pb-0.5",
      class: "bg-emerald-500/10 text-emerald-500/80 border-emerald-500/20",
    },
    {
      value: "low_energy",
      title: "Low Energy (1-2)",
      icon: "ti ti-battery-1 text-rose-500/80 text-sm lg:text-base pb-0.5",
      class: "bg-rose-500/10 text-rose-500/80 border-rose-500/20",
    },
    {
      value: "has_metrics",
      title: "With Custom Metrics",
      icon: "ti ti-adjustments text-indigo-500/80 text-sm lg:text-base pb-0.5",
      class: "bg-indigo-500/10 text-indigo-500/80 border-indigo-500/20",
    },
  ],
  templates: [
    {
      value: "all",
      title: "All Templates",
      icon: "ti ti-layers-subtract text-emerald-500/80 text-sm lg:text-base pb-0.5",
      class: "bg-emerald-500/10 text-emerald-500/80 border-emerald-500/20",
    },
    {
      value: "favorites",
      title: "Favorites Only",
      icon: "ti ti-star text-yellow-500/80 text-sm lg:text-base pb-0.5",
      class: "bg-yellow-500/10 text-yellow-500/80 border-yellow-500/20",
    },
    {
      value: "used",
      title: "Ever Used (Count > 0)",
      icon: "ti ti-chart-line text-cyan-500/80 text-sm lg:text-base pb-0.5",
      class: "bg-cyan-500/10 text-cyan-500/80 border-cyan-500/20",
    },
    {
      value: "unused",
      title: "Never Used",
      icon: "ti ti-box text-slate-500/80 text-sm lg:text-base pb-0.5",
      class: "bg-slate-500/10 text-slate-500/80 border-slate-500/20",
    },
    {
      value: "has_baseline_optimal",
      title: "With Target Metrics",
      icon: "ti ti-target text-violet-500/80 text-sm lg:text-base pb-0.5",
      class: "bg-violet-500/10 text-violet-500/80 border-violet-500/20",
    },
  ],
};

export const SORT_OPTIONS_BY_TAB = {
  plans: [
    {
      value: "created_desc",
      title: "Created (Newest First)",
      icon: "ti ti-calendar-down text-yellow-500/80 text-sm lg:text-base pb-0.5",
      class: "bg-yellow-500/10 text-yellow-500/80 border-yellow-500/20",
    },
    {
      value: "created_asc",
      title: "Created (Oldest First)",
      icon: "ti ti-calendar-up text-violet-500/80 text-sm lg:text-base pb-0.5",
      class: "bg-violet-500/10 text-violet-500/80 border-violet-500/20",
    },
    {
      value: "updated_desc",
      title: "Recently Updated",
      icon: "ti ti-clock text-yellow-500/80 text-sm lg:text-base pb-0.5",
      class: "bg-yellow-500/10 text-yellow-500/80 border-yellow-500/20",
    },
    {
      value: "start_date_desc",
      title: "Start Date (Latest)",
      icon: "ti ti-calendar-event text-pink-500/80 text-sm lg:text-base pb-0.5",
      class: "bg-pink-500/10 text-pink-500/80 border-pink-500/20",
    },
    {
      value: "progress_desc",
      title: "Progress (High to Low)",
      icon: "ti ti-chart-line scale-y-[-1] rotate-180 text-emerald-500/80 text-sm lg:text-base pb-0.5",
      class: "bg-emerald-500/10 text-emerald-500/80 border-emerald-500/20",
    },
    {
      value: "progress_asc",
      title: "Progress (Low to High)",
      icon: "ti ti-chart-line text-rose-500/80 text-sm lg:text-base pb-0.5",
      class: "bg-rose-500/10 text-rose-500/80 border-rose-500/20",
    },
    {
      value: "title_asc",
      title: "Title (A-Z)",
      icon: "ti ti-sort-ascending-letters text-cyan-500/80 text-sm lg:text-base pb-0.5",
      class: "bg-cyan-500/10 text-cyan-500/80 border-cyan-500/20",
    },
  ],
  logs: [
    {
      value: "date_desc",
      title: "Log Date (Newest First)",
      icon: "ti ti-calendar-down text-yellow-500/80 text-sm lg:text-base pb-0.5",
      class: "bg-yellow-500/10 text-yellow-500/80 border-yellow-500/20",
    },
    {
      value: "date_asc",
      title: "Log Date (Oldest First)",
      icon: "ti ti-calendar-up text-violet-500/80 text-sm lg:text-base pb-0.5",
      class: "bg-violet-500/10 text-violet-500/80 border-violet-500/20",
    },
    {
      value: "energy_desc",
      title: "Energy (Highest First)",
      icon: "ti ti-battery-4 text-emerald-500/80 text-sm lg:text-base pb-0.5",
      class: "bg-emerald-500/10 text-emerald-500/80 border-emerald-500/20",
    },
    {
      value: "energy_asc",
      title: "Energy (Lowest First)",
      icon: "ti ti-battery-1 text-rose-500/80 text-sm lg:text-base pb-0.5",
      class: "bg-rose-500/10 text-rose-500/80 border-rose-500/20",
    },
    {
      value: "updated_desc",
      title: "Recently Updated",
      icon: "ti ti-clock text-yellow-500/80 text-sm lg:text-base pb-0.5",
      class: "bg-yellow-500/10 text-yellow-500/80 border-yellow-500/20",
    },
    {
      value: "title_asc",
      title: "Title (A-Z)",
      icon: "ti ti-sort-ascending-letters text-cyan-500/80 text-sm lg:text-base pb-0.5",
      class: "bg-cyan-500/10 text-cyan-500/80 border-cyan-500/20",
    },
  ],
  templates: [
    {
      value: "favorites_first",
      title: "Favorites First",
      icon: "ti ti-star text-yellow-500/80 text-sm lg:text-base pb-0.5",
      class: "bg-yellow-500/10 text-yellow-500/80 border-yellow-500/20",
    },
    {
      value: "usage_desc",
      title: "Most Used",
      icon: "ti ti-flame text-orange-500/80 text-sm lg:text-base pb-0.5",
      class: "bg-orange-500/10 text-orange-500/80 border-orange-500/20",
    },
    {
      value: "usage_asc",
      title: "Least Used",
      icon: "ti ti-arrow-up text-slate-500/80 text-sm lg:text-base pb-0.5",
      class: "bg-slate-500/10 text-slate-500/80 border-slate-500/20",
    },
    {
      value: "created_desc",
      title: "Date Created",
      icon: "ti ti-calendar-down text-red-500/80 text-sm lg:text-base pb-0.5",
      class: "bg-red-500/10 text-red-500/80 border-red-500/20",
    },
    {
      value: "updated_desc",
      title: "Recently Updated",
      icon: "ti ti-clock text-yellow-500/80 text-sm lg:text-base pb-0.5",
      class: "bg-yellow-500/10 text-yellow-500/80 border-yellow-500/20",
    },
    {
      value: "title_asc",
      title: "Title (A-Z)",
      icon: "ti ti-sort-ascending-letters text-emerald-500/80 text-sm lg:text-base pb-0.5",
      class: "bg-emerald-500/10 text-emerald-500/80 border-emerald-500/20",
    },
  ],
};
