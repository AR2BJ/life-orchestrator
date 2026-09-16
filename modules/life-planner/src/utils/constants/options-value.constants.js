export const LIFE_AREAS = [
  {
    id: "productivity",
    name: "Systems & Organization",
    icon: "fa-solid fa-gears text-yellow-500/80",
    class: "bg-yellow-500/10 text-yellow-500/80 border-yellow-500/20",
  },
  {
    id: "health",
    name: "Health & Fitness",
    icon: "fa-solid fa-heart-pulse text-emerald-500/80",
    class: "bg-emerald-500/10 text-emerald-500/80 border-emerald-500/20",
  },
  {
    id: "personal",
    name: "Personal Growth",
    icon: "fa-solid fa-user text-lime-500/80",
    class: "bg-lime-500/10 text-lime-500/80 border-lime-500/20",
  },
  {
    id: "career",
    name: "Career & Work",
    icon: "fa-solid fa-briefcase text-cyan-500/80",
    class: "bg-cyan-500/10 text-cyan-500/80 border-cyan-500/20",
  },
  {
    id: "creativity",
    name: "Hobbies & Creativity",
    icon: "fa-solid fa-palette text-blue-500/80",
    class: "bg-blue-500/10 text-blue-500/80 border-blue-500/20",
  },
  {
    id: "finance",
    name: "Finance & Wealth",
    icon: "fa-solid fa-wallet text-violet-500/80",
    class: "bg-violet-500/10 text-violet-500/80 border-violet-500/20",
  },
  {
    id: "lifestyle",
    name: "Lifestyle & Social",
    icon: "fa-solid fa-masks-theater text-pink-500/80",
    class: "bg-pink-500/10 text-pink-500/80 border-pink-500/20",
  },
  {
    id: "mindset",
    name: "Mindset & Mental Health",
    icon: "fa-solid fa-brain text-fuchsia-500/80",
    class: "bg-fuchsia-500/10 text-fuchsia-500/80 border-fuchsia-500/20",
  },
  {
    id: "relationships",
    name: "Family & Relationships",
    icon: "fa-solid fa-people-roof text-orange-500/80",
    class: "bg-orange-500/10 text-orange-500/80 border-orange-500/20",
  },
  {
    id: "environment",
    name: "Environment & Home",
    icon: "fa-solid fa-house-chimney text-red-500/80",
    class: "bg-red-500/10 text-red-500/80 border-red-500/20",
  },
];

export const PLAN_STATES = [
  {
    id: "active",
    name: "Active",
    icon: "fa-solid fa-play text-cyan-500/80",
    class: "bg-cyan-500/10 text-cyan-500/80 border-cyan-500/20",
  },
  {
    id: "paused",
    name: "Paused",
    icon: "fa-solid fa-pause text-yellow-500/80",
    class: "bg-yellow-500/10 text-yellow-500/80 border-yellow-500/20",
  },
  {
    id: "completed",
    name: "Completed",
    icon: "fa-solid fa-check-double text-emerald-500/80",
    class: "bg-emerald-500/10 text-emerald-500/80 border-emerald-500/20",
  },
];

export const OBJECTIVE_TYPES = [
  {
    id: "boolean",
    name: "Boolean (Done/Not Done)",
    icon: "fa-solid fa-square-check text-cyan-500/80",
  },
  {
    id: "numeric",
    name: "Numeric Target",
    icon: "fa-solid fa-arrow-down-1-9 text-emerald-500/80",
  },
  {
    id: "milestone",
    name: "Milestone",
    icon: "fa-solid fa-flag text-yellow-500/80",
  },
];

export const OBJECTIVE_UNITS = [
  {
    id: "count",
    name: "Count",
    icon: "fa-solid fa-calculator text-blue-500/80",
  },
  {
    id: "pages",
    name: "Pages",
    icon: "fa-solid fa-book-open text-cyan-500/80",
  },
  {
    id: "step",
    name: "Steps",
    icon: "fa-solid fa-shoe-prints text-lime-500/80",
  },
  {
    id: "words",
    name: "Words Written",
    icon: "fa-solid fa-pen-nib text-amber-500/80",
  },
  {
    id: "currency",
    name: "Currency",
    icon: "fa-solid fa-dollar-sign text-red-600/80",
  },
  {
    id: "points",
    name: "Story Points",
    icon: "fa-solid fa-chart-line text-fuchsia-500/80",
  },
  {
    id: "chapters",
    name: "Chapters",
    icon: "fa-solid fa-book-bookmark text-green-500/80",
  },
  {
    id: "projects",
    name: "Projects",
    icon: "fa-solid fa-diagram-project text-mist-500/80",
  },
  {
    id: "episodes",
    name: "Episodes",
    icon: "fa-solid fa-circle-play text-rose-500/80",
  },
  {
    id: "lessons",
    name: "Lessons",
    icon: "fa-solid fa-graduation-cap text-purple-500/80",
  },
  {
    id: "checkins",
    name: "Check-ins",
    icon: "fa-solid fa-square-check text-mauve-500/80",
  },
  {
    id: "hrs",
    name: "Hours (hrs)",
    icon: "fa-solid fa-clock text-violet-500/80",
  },
  {
    id: "mins",
    name: "Minutes (mins)",
    icon: "fa-solid fa-stopwatch text-pink-500/80",
  },
  {
    id: "kg",
    name: "Kilograms (kg)",
    icon: "fa-solid fa-weight-scale text-emerald-500/80",
  },
  {
    id: "percent",
    name: "Percentage (%)",
    icon: "fa-solid fa-percent text-yellow-500/80",
  },
  {
    id: "km",
    name: "Kilometers (km)",
    icon: "fa-solid fa-route text-teal-500/80",
  },
  {
    id: "reps",
    name: "Repetitions (Reps)",
    icon: "fa-solid fa-dumbbell text-slate-600/80",
  },
  {
    id: "cal",
    name: "Calories (kcal)",
    icon: "fa-solid fa-fire text-orange-500/80",
  },
  {
    id: "streak",
    name: "Streak (Days)",
    icon: "fa-solid fa-fire-flame-curved text-indigo-500/80",
  },
  {
    id: "liters",
    name: "Liters (L)",
    icon: "fa-solid fa-glass-water text-sky-500/80",
  },
];

export const ENERGY_LEVEL_OPTIONS = [
  {
    value: 1,
    label: "1 - Low Energy",
    icon: "fa-solid fa-battery-empty text-red-500/80",
    class: "bg-red-500/10 text-red-500/80 border-red-500/20",
  },
  {
    value: 2,
    label: "2 - Moderate",
    icon: "fa-solid fa-battery-half text-orange-500/80",
    class: "bg-orange-500/10 text-orange-500/80 border-orange-500/20",
  },
  {
    value: 3,
    label: "3 - Normal",
    icon: "fa-solid fa-battery-half text-yellow-500/80",
    class: "bg-yellow-500/10 text-yellow-500/80 border-yellow-500/20",
  },
  {
    value: 4,
    label: "4 - High Energy",
    icon: "fa-solid fa-battery-three-quarters text-lime-500/80",
    class: "bg-lime-500/10 text-lime-500/80 border-lime-500/20",
  },
  {
    value: 5,
    label: "5 - Peak Performance",
    icon: "fa-solid fa-battery-full text-emerald-500/80",
    class: "bg-emerald-500/10 text-emerald-500/80 border-emerald-500/20",
  },
];

export const MOOD_OPTIONS = [
  {
    value: "terrible",
    label: "Terrible",
    icon: "fa-solid fa-face-frown-open text-red-500/80",
    class: "bg-red-500/10 text-red-500/80 border-red-500/20",
  },
  {
    value: "bad",
    label: "Bad",
    icon: "fa-solid fa-face-frown text-orange-500/80",
    class: "bg-orange-500/10 text-orange-500/80 border-orange-500/20",
  },
  {
    value: "neutral",
    label: "Neutral",
    icon: "fa-solid fa-face-meh text-yellow-500/80",
    class: "bg-yellow-500/10 text-yellow-500/80 border-yellow-500/20",
  },
  {
    value: "good",
    label: "Good",
    icon: "fa-solid fa-face-smile text-cyan-500/80",
    class: "bg-cyan-500/10 text-cyan-500/80 border-cyan-500/20",
  },
  {
    value: "excellent",
    label: "Excellent",
    icon: "fa-solid fa-face-laugh-beam text-emerald-500/80",
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
      icon: "fa-regular fa-layer-group text-cyan-400",
      class: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
    },
    // --- Based on 'state' ---
    {
      value: "active",
      title: "Active State",
      icon: "fa-regular fa-circle-play text-emerald-400",
      class: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    },
    {
      value: "paused",
      title: "Paused State",
      icon: "fa-regular fa-circle-pause text-yellow-400",
      class: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    },
    {
      value: "completed",
      title: "Completed State",
      icon: "fa-regular fa-circle-check text-blue-400",
      class: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    },
    // --- Based on 'period.endDate' ---
    {
      value: "has_end_date",
      title: "Time-bound Plans",
      icon: "fa-regular fa-calendar-check text-violet-400",
      class: "bg-violet-500/10 text-violet-400 border-violet-500/20",
    },
    {
      value: "no_end_date",
      title: "Perpetual Plans",
      icon: "fa-regular fa-infinity text-pink-400",
      class: "bg-pink-500/10 text-pink-400 border-pink-500/20",
    },
    // --- Based on 'objectives' ---
    {
      value: "has_objectives",
      title: "With Objectives",
      icon: "fa-regular fa-list-check text-teal-400",
      class: "bg-teal-500/10 text-teal-400 border-teal-500/20",
    },
    {
      value: "objectives_pending",
      title: "Has Pending Tasks",
      icon: "fa-regular fa-clock text-orange-400",
      class: "bg-orange-500/10 text-orange-400 border-orange-500/20",
    },
  ],
  logs: [
    {
      value: "all",
      title: "All Logs",
      icon: "fa-regular fa-calendar text-emerald-400",
      class: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    },
    // --- Based on 'date' ---
    {
      value: "today",
      title: "Today",
      icon: "fa-regular fa-calendar-day text-yellow-400",
      class: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    },
    {
      value: "this_week",
      title: "This Week",
      icon: "fa-regular fa-calendar-week text-pink-400",
      class: "bg-pink-500/10 text-pink-400 border-pink-500/20",
    },
    {
      value: "this_month",
      title: "This Month",
      icon: "fa-regular fa-calendar-range text-violet-400",
      class: "bg-violet-500/10 text-violet-400 border-violet-500/20",
    },
    // --- Based on 'planId' ---
    {
      value: "linked_to_plan",
      title: "Linked to Plan",
      icon: "fa-regular fa-link text-cyan-400",
      class: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
    },
    {
      value: "standalone",
      title: "Standalone Logs",
      icon: "fa-regular fa-note-sticky text-slate-400",
      class: "bg-slate-500/10 text-slate-400 border-slate-500/20",
    },
    // --- Based on 'energy' ---
    {
      value: "high_energy",
      title: "High Energy (4-5)",
      icon: "fa-regular fa-battery-full text-emerald-400",
      class: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    },
    {
      value: "low_energy",
      title: "Low Energy (1-2)",
      icon: "fa-regular fa-battery-quarter text-rose-400",
      class: "bg-rose-500/10 text-rose-400 border-rose-500/20",
    },
    // --- Based on 'metrics' ---
    {
      value: "has_metrics",
      title: "With Custom Metrics",
      icon: "fa-regular fa-sliders text-indigo-400",
      class: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
    },
  ],
  templates: [
    {
      value: "all",
      title: "All Templates",
      icon: "fa-regular fa-layer-group text-emerald-400",
      class: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    },
    // --- Based on 'isFavorite' ---
    {
      value: "favorites",
      title: "Favorites Only",
      icon: "fa-regular fa-star text-yellow-400",
      class: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    },
    // --- Based on 'usageCount' ---
    {
      value: "used",
      title: "Ever Used (Count > 0)",
      icon: "fa-regular fa-chart-line text-cyan-400",
      class: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
    },
    {
      value: "unused",
      title: "Never Used",
      icon: "fa-regular fa-box text-slate-400",
      class: "bg-slate-500/10 text-slate-400 border-slate-500/20",
    },
    // --- Based on 'baseline' & 'optimal' ---
    {
      value: "has_baseline_optimal",
      title: "With Target Metrics",
      icon: "fa-regular fa-bullseye text-violet-400",
      class: "bg-violet-500/10 text-violet-400 border-violet-500/20",
    },
  ],
};

export const SORT_OPTIONS_BY_TAB = {
  plans: [
    // --- Based on 'createdAt' ---
    {
      value: "created_desc",
      title: "Created (Newest First)",
      icon: "fa-regular fa-calendar-arrow-down text-yellow-400",
      class: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    },
    {
      value: "created_asc",
      title: "Created (Oldest First)",
      icon: "fa-regular fa-calendar-arrow-up text-violet-400",
      class: "bg-violet-500/10 text-violet-400 border-violet-500/20",
    },
    // --- Based on 'updatedAt' ---
    {
      value: "updated_desc",
      title: "Recently Updated",
      icon: "fa-regular fa-clock text-yellow-400",
      class: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    },
    // --- Based on 'period.startDate' ---
    {
      value: "start_date_desc",
      title: "Start Date (Latest)",
      icon: "fa-regular fa-calendar-day text-pink-400",
      class: "bg-pink-500/10 text-pink-400 border-pink-500/20",
    },
    // --- Based on 'objectives' progress ---
    {
      value: "progress_desc",
      title: "Progress (High to Low)",
      icon: "fa-regular fa-chart-line-up text-emerald-400",
      class: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    },
    {
      value: "progress_asc",
      title: "Progress (Low to High)",
      icon: "fa-regular fa-chart-line-down text-rose-400",
      class: "bg-rose-500/10 text-rose-400 border-rose-500/20",
    },
    // --- Based on 'title' ---
    {
      value: "title_asc",
      title: "Title (A-Z)",
      icon: "fa-regular fa-arrow-down-a-z text-cyan-400",
      class: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
    },
  ],
  logs: [
    // --- Based on 'date' ---
    {
      value: "date_desc",
      title: "Log Date (Newest First)",
      icon: "fa-regular fa-calendar-arrow-down text-yellow-400",
      class: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    },
    {
      value: "date_asc",
      title: "Log Date (Oldest First)",
      icon: "fa-regular fa-calendar-arrow-up text-violet-400",
      class: "bg-violet-500/10 text-violet-400 border-violet-500/20",
    },
    // --- Based on 'energy' ---
    {
      value: "energy_desc",
      title: "Energy (Highest First)",
      icon: "fa-regular fa-battery-full text-emerald-400",
      class: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    },
    {
      value: "energy_asc",
      title: "Energy (Lowest First)",
      icon: "fa-regular fa-battery-quarter text-rose-400",
      class: "bg-rose-500/10 text-rose-400 border-rose-500/20",
    },
    // --- Based on 'updatedAt' ---
    {
      value: "updated_desc",
      title: "Recently Updated",
      icon: "fa-regular fa-clock text-yellow-400",
      class: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    },
    // --- Based on 'title' ---
    {
      value: "title_asc",
      title: "Title (A-Z)",
      icon: "fa-regular fa-arrow-down-a-z text-cyan-400",
      class: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
    },
  ],
  templates: [
    // --- Based on 'isFavorite' ---
    {
      value: "favorites_first",
      title: "Favorites First",
      icon: "fa-regular fa-star text-yellow-400",
      class: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    },
    // --- Based on 'usageCount' ---
    {
      value: "usage_desc",
      title: "Most Used",
      icon: "fa-regular fa-fire text-orange-400",
      class: "bg-orange-500/10 text-orange-400 border-orange-500/20",
    },
    {
      value: "usage_asc",
      title: "Least Used",
      icon: "fa-regular fa-arrow-up-short-wide text-slate-400",
      class: "bg-slate-500/10 text-slate-400 border-slate-500/20",
    },
    // --- Based on 'createdAt' / 'updatedAt' ---
    {
      value: "created_desc",
      title: "Date Created",
      icon: "fa-regular fa-calendar-arrow-down text-red-400",
      class: "bg-red-500/10 text-red-400 border-red-500/20",
    },
    {
      value: "updated_desc",
      title: "Recently Updated",
      icon: "fa-regular fa-clock text-yellow-400",
      class: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    },
    // --- Based on 'title' ---
    {
      value: "title_asc",
      title: "Title (A-Z)",
      icon: "fa-regular fa-arrow-down-a-z text-emerald-400",
      class: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    },
  ],
};
