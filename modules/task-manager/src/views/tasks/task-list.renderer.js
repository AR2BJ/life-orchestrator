import { TaskItemComponent } from "@/components/features/tasks/task-item.component";

export function renderTaskList(tasks, activeTab = "active") {
  const container = document.getElementById("task-list");
  const countBadge = document.getElementById("task-count-badge");

  if (!container) return;

  if (countBadge) {
    const totalCount = tasks.length;
    countBadge.innerHTML = `
      <p class="text-secondary font-semibold text-sm p-0.5">
        <span class="text-brand/80 font-extrabold">${totalCount}</span>&nbsp;
        ${totalCount === 1 || totalCount === 0 ? "task" : "tasks"}
      </p>
    `;
  }

  container.innerHTML = "";

  const emptyStateConfig = {
    active: {
      icon: "<i class='fa-regular fa-clipboard-list-check text-brand/60'></i>",
      title: "No active tasks",
      description: "You're all caught up! Create a new task to get started.",
    },
    completed: {
      icon: "<i class='fa-regular fa-circle-check text-brand/60'></i>",
      title: "No completed tasks",
      description: "Mark tasks as finished to track your progress here.",
    },
    archived: {
      icon: "<i class='fa-regular fa-box-open text-brand/60'></i>",
      title: "No archived tasks",
      description:
        "Tasks moved to archive will appear here for record-keeping.",
    },
  };

  const currentEmptyState =
    emptyStateConfig[activeTab] || emptyStateConfig.active;

  if (tasks.length === 0) {
    container.innerHTML = `
      <div
        class="min-h-80 bg-surface border border-dashed border-border rounded-2xl p-16 text-center"
      >
        <div class="text-6xl mb-6">${currentEmptyState.icon}</div>
        <h2 class="text-2xl font-bold text-primary">
          ${currentEmptyState.title}
        </h2>
        <p class="mt-3 text-secondary max-w-sm mx-auto">
          ${currentEmptyState.description}
        </p>
      </div>
    `;
    return;
  }

  const isArchived = activeTab === "archived";

  tasks.forEach((task) => {
    const item = document.createElement("div");
    item.className =
      "bg-surface border border-border/70 hover:border-border/90 rounded-2xl p-5 transition duration-200 shadow-xs hover:shadow-md";

    item.innerHTML = TaskItemComponent.render(task, {
      isArchived,
      activeTab,
    });

    container.appendChild(item);
  });
}
