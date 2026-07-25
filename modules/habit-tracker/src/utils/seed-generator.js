import { formatDate } from "@/utils/helpers";

const STORAGE_VERSION = 4;

const VERBS = [
  "Practice",
  "Execute",
  "Review",
  "Maintain",
  "Optimize",
  "Track",
  "Read",
  "Analyze",
  "Limit",
  "Enhance",
];

const NOUNS = [
  "LeetCode & Algorithms",
  "Workout Routine",
  "Code Refactoring",
  "Thesis Writing",
  "Hydration Goal",
  "System Design Blueprint",
  "Deep Work Session",
  "Sleep Cycle Recovery",
  "Screen Time Exposure",
  "Social Media Scrolling",
];

const CATEGORIES = [
  "General",
  "Health",
  "Work",
  "Research",
  "Academics",
  "OpenSource",
  "SystemDesign",
  "DigitalDetox",
  "Routine",
  "Harmful",
];

const SCENARIOS = ["perfect", "average", "struggling", "stale"];

function getRandomElement(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateRandomHistory(startDate, totalDays, scenario) {
  const completedDates = [];
  const skippedDates = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let completionRate = 0.7;
  let skipRate = 0.1;

  if (scenario === "perfect") {
    completionRate = 0.95;
    skipRate = 0.02;
  } else if (scenario === "struggling") {
    completionRate = 0.35;
    skipRate = 0.4;
  } else if (scenario === "stale") {
    completionRate = 0.2;
    skipRate = 0.1;
  }

  for (let i = 0; i <= totalDays; i++) {
    const currentDate = new Date(startDate);
    currentDate.setDate(startDate.getDate() + i);

    if (currentDate > today) break;

    const isoStr = formatDate(currentDate);
    const rand = Math.random();

    if (rand < completionRate) {
      completedDates.push(isoStr);
    } else if (rand < completionRate + skipRate) {
      skippedDates.push(isoStr);
    }
  }

  if (scenario === "stale") {
    const thirtyDaysAgo = new Date(today);
    thirtyDaysAgo.setDate(today.getDate() - 30);
    const limitStr = formatDate(thirtyDaysAgo);

    return {
      completedDates: completedDates.filter((d) => d < limitStr),
      skippedDates: skippedDates.filter((d) => d < limitStr),
    };
  }

  return { completedDates, skippedDates };
}

export function generateDynamicMockData(count = 40) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const subtractDays = (date, days) => {
    const result = new Date(date);
    result.setDate(result.getDate() - days);
    return result;
  };

  const habits = [];

  for (let i = 1; i <= count; i++) {
    const category = getRandomElement(CATEGORIES);
    const name = `${getRandomElement(VERBS)} ${getRandomElement(NOUNS)} (#${i})`;
    const id = `random-habit-${i}-${category.toLowerCase()}`;
    const frequency = getRandomInt(1, 7);

    const daysAgoCreated = getRandomInt(10, 120);
    const createdAtDate = subtractDays(today, daysAgoCreated);

    let scenario = getRandomElement(SCENARIOS);

    if (daysAgoCreated < 35 && scenario === "stale") {
      scenario = "average";
    }

    const { completedDates, skippedDates } = generateRandomHistory(
      createdAtDate,
      daysAgoCreated,
      scenario,
    );

    const archived = scenario === "stale" ? true : Math.random() < 0.15;

    habits.push({
      id,
      name,
      category,
      frequency,
      createdAt: formatDate(createdAtDate),
      archived,
      completedDates,
      skippedDates,
    });
  }

  return {
    version: STORAGE_VERSION,
    habits: habits,
  };
}
