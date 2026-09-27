export function generateId() {
  if (window.crypto?.randomUUID) {
    return window.crypto.randomUUID();
  }

  function getRandomHex(length) {
    let result = "";
    const chars = "0123456789abcdef";
    for (let i = 0; i < length; i++) {
      result += chars[Math.floor(Math.random() * 16)];
    }
    return result;
  }

  const timestamp = getRandomHex(32).toString(16).padStart(12, "0");
  const randomPart = getRandomHex(8);

  const timeLow = timestamp.slice(0, 8);
  const timeMid = timestamp.slice(8, 12);
  const timeHiAndVersion = "4" + getRandomHex(3);
  const clockSeqHiAndReserved = getRandomHex(3);
  const node = getRandomHex(6) + randomPart.slice(0, 6);

  return `${timeLow}-${timeMid}-${timeHiAndVersion}-${clockSeqHiAndReserved}-${node}`;
}

export function formatDate(date) {
  const year = date.getFullYear();

  const month = String(date.getMonth() + 1).padStart(2, "0");

  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function todayISO() {
  return formatDate(new Date());
}

/**
 * Parse ISO date string to Date object
 */
export function parseISODate(dateStr) {
  const [year, month, day] = dateStr.split("-").map(Number);
  return new Date(year, month - 1, day);
}

/**
 * Check if a date is today
 */
export function isToday(dateStr) {
  return dateStr === todayISO();
}

/**
 * Check if date1 is before date2
 */
export function isBefore(date1, date2) {
  return date1 < date2;
}

/**
 * Check if date1 is after date2
 */
export function isAfter(date1, date2) {
  return date1 > date2;
}

/**
 * Calculate days between two dates
 */
export function daysBetween(date1, date2) {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  const diff = Math.abs(d2 - d1);
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

/**
 * Add days to a date
 */
export function addDays(dateStr, days) {
  const date = new Date(dateStr);
  date.setDate(date.getDate() + days);
  return formatDate(date);
}

export function getWeeklyCompletionCount(completedDates = []) {
  if (!completedDates || !Array.isArray(completedDates)) return 0;

  const today = new Date();
  today.setHours(23, 59, 59, 999);

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(today.getDate() - 7);
  sevenDaysAgo.setHours(0, 0, 0, 0);

  return completedDates.filter((dateStr) => {
    const checkDate = new Date(dateStr);

    return checkDate >= sevenDaysAgo && checkDate <= today;
  }).length;
}

export function calculateStreak(completedDates = [], skippedDates = []) {
  if (!completedDates.length) return { current: 0, best: 0 };

  const sortedCompletes = [...completedDates].sort();
  const dateSet = new Set(sortedCompletes);
  const skipSet = new Set(skippedDates || []);
  const today = todayISO();

  let current = 0;
  let best = 0;

  let cursor = new Date(today);

  if (!dateSet.has(today) && !skipSet.has(today)) {
    cursor.setDate(cursor.getDate() - 1);
  }

  while (true) {
    const iso = formatDate(cursor);

    if (dateSet.has(iso)) {
      current++;
      cursor.setDate(cursor.getDate() - 1);
    } else if (skipSet.has(iso)) {
      cursor.setDate(cursor.getDate() - 1);
    } else {
      break;
    }
  }

  const allTimelineDates = Array.from(
    new Set([...completedDates, ...skippedDates]),
  ).sort();

  let temp = 0;
  for (let i = 0; i < allTimelineDates.length; i++) {
    const currentDate = new Date(allTimelineDates[i]);
    const isoCheck = formatDate(currentDate);

    if (!dateSet.has(isoCheck)) continue;

    temp = 1;
    let nextDate = new Date(currentDate);
    nextDate.setDate(nextDate.getDate() + 1);

    while (true) {
      const nextIso = formatDate(nextDate);
      if (dateSet.has(nextIso)) {
        temp++;
        nextDate.setDate(nextDate.getDate() + 1);
      } else if (skipSet.has(nextIso)) {
        nextDate.setDate(nextDate.getDate() + 1);
      } else {
        break;
      }
    }

    if (temp > best) best = temp;
  }

  return { current, best };
}

export function calculateSuccessRate(habit) {
  const completedDates = Array.isArray(habit && habit.completedDates)
    ? habit.completedDates
    : [];
  const createdAt = new Date(habit && habit.createdAt);

  if (Number.isNaN(createdAt.getTime())) return 0;

  const today = new Date();
  today.setHours(23, 59, 59, 999);

  const diffDays = Math.floor((today - createdAt) / (1000 * 60 * 60 * 24)) + 1;

  if (diffDays <= 0) return 0;

  const validCompletedDates = completedDates.filter((dateStr) => {
    const date = new Date(dateStr);
    return !Number.isNaN(date.getTime()) && date >= createdAt && date <= today;
  });

  const successRate = Math.round((validCompletedDates.length / diffDays) * 100);

  return Math.min(100, Math.max(0, successRate));
}

export function diffDays(fromISO, toISO) {
  const from = parseISODate(fromISO);
  const to = parseISODate(toISO);
  return Math.round((to - from) / 86400000);
}

export function isScheduledOn(habit, isoDate) {
  if (!habit.createdAt) return false;

  const diff = diffDays(habit.createdAt, isoDate);
  if (diff < 0) return false;

  const freq = Math.min(7, Math.max(1, Number(habit.frequency) || 7));
  const interval = Math.max(1, Math.round(7 / freq));

  return diff % interval === 0;
}

export function getCurrentStreak(habit) {
  const set = new Set(habit.completedDates || []);
  if (set.size === 0) return 0;

  const today = todayISO();
  let cursor = today;

  if (!set.has(today)) {
    cursor = addDays(today, -1);
  }

  let streak = 0;
  while (set.has(cursor)) {
    streak++;
    cursor = addDays(cursor, -1);
  }
  return streak;
}

export function getLongestStreak(habit) {
  const dates = [...new Set(habit.completedDates || [])].sort();
  if (dates.length === 0) return 0;

  let longest = 1;
  let current = 1;

  for (let i = 1; i < dates.length; i++) {
    const gap = diffDays(dates[i - 1], dates[i]);
    if (gap === 1) {
      current++;
      longest = Math.max(longest, current);
    } else {
      current = 1;
    }
  }
  return longest;
}

export function getCompletionRate(habit) {
  if (!habit.createdAt) return 0;

  const totalDays = Math.max(1, diffDays(habit.createdAt, todayISO()) + 1);
  const done = (habit.completedDates || []).length;

  return done / totalDays;
}

export function getTodayStatus(habit) {
  const today = todayISO();
  if (habit.completedDates?.includes(today)) return "done";
  if (habit.skippedDates?.includes(today)) return "skipped";
  if (isScheduledOn(habit, today)) return "pending";
  return "not_scheduled";
}

export function getTotalCompletions(habit) {
  return (habit.completedDates || []).length;
}
