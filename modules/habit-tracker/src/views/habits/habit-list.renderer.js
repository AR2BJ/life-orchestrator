import { HabitCardComponent } from "@/components/features/habits/habit-card.component";

export function renderHabitList(habits, activeTab = "active") {
  const container = document.getElementById("habit-list");
  const countBadge = document.getElementById("habit-count-badge");

  if (!container) return;

  if (countBadge) {
    const totalCount = habits.length;

    countBadge.innerHTML = `
      <p class="text-secondary font-semibold text-sm p-0.5">
        <span class="text-brand/80 font-extrabold">${totalCount}</span>&nbsp;
        ${totalCount === 1 || totalCount === 0 ? "habit" : "habits"}
      </p>
    `;
  }

  container.innerHTML = "";

  const isArchived = activeTab === "archived";
  const icon = isArchived
    ? "<i class='fa-regular fa-box-open text-brand/60'></i>"
    : "<i class='fa-regular fa-bullseye-arrow text-brand/60'></i>";
  const title = isArchived ? "No archived habits" : "No habits yet";
  const description = isArchived
    ? "Archived habits will appear here."
    : "Create your first habit and start building consistency.";

  if (habits.length === 0) {
    container.innerHTML = `
      <div
        class="min-h-80 bg-surface border border-dashed border-border rounded-2xl p-16 text-center"
      >
        <div class="text-6xl mb-6">${icon}</div>
        <h2 class="text-2xl font-bold text-color">${title}</h2>
        <p class="mt-3 text-secondary max-w-sm mx-auto">${description}</p>
      </div>
    `;
    return;
  }

  habits.forEach((habit) => {
    const item = document.createElement("div");
    item.className =
      "bg-surface border border-border/70 hover:border-border/90 rounded-2xl p-5 transition duration-200 shadow-xs hover:shadow-md";

    item.innerHTML = HabitCardComponent.render(habit, isArchived);

    container.appendChild(item);
  });
}
