import { HabitCardComponent } from "@/components/features/habits/habit-card.component";

export function renderHabitList(habits, activeTab = "active") {
  const container = document.getElementById("habit-list");
  const countBadge = document.getElementById("habit-count-badge");

  if (!container) return;

  if (countBadge) {
    const totalCount = habits.length;

    countBadge.innerHTML = `
      <p class="text-secondary font-semibold text-sm">
        <span class="text-brand/80 font-extrabold">${totalCount}</span>&nbsp; habits
      </p>
    `;
  }

  container.innerHTML = "";

  const isArchived = activeTab === "archived";
  const icon = isArchived
    ? "<i class='fa-regular fa-box-open'></i>"
    : "<i class='fa-regular fa-bullseye-arrow'></i>";
  const title = isArchived ? "No archived habits" : "No habits yet";
  const description = isArchived
    ? "Archived habits will appear here."
    : "Create your first habit and start building consistency.";

  if (habits.length === 0) {
    container.innerHTML = `
      <div class="border border-dashed border-border rounded-2xl p-16 text-center bg-surface-2">
        <div class="text-6xl mb-6">${icon}</div>
        <h2 class="text-2xl font-bold text-primary">${title}</h2>
        <p class="mt-3 text-secondary max-w-sm mx-auto">${description}</p>
      </div>
    `;
    return;
  }

  habits.forEach((habit) => {
    const item = document.createElement("div");
    item.className =
      "bg-surface border border-border/60 hover:border-border rounded-2xl p-6 transition duration-300 shadow-sm";

    item.innerHTML = HabitCardComponent.render(habit, isArchived);

    container.appendChild(item);
  });
}
