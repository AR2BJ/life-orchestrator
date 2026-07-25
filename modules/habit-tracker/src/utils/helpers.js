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
