import { PlannerItemComponent } from "@/components/features/planner/planner-item.component";

export function renderPlannerList(items, activeTab = "plans") {
  const container = document.getElementById("planner-list");
  const countBadge = document.getElementById("planner-count-badge");

  if (!container) return;

  if (countBadge) {
    const totalCount = items.length;
    const labels = {
      plans: totalCount === 1 ? "plan" : "plans",
      logs: totalCount === 1 ? "log" : "logs",
      templates: totalCount === 1 ? "template" : "templates",
    };

    const currentLabel = labels[activeTab] || "items";

    countBadge.innerHTML = `
      <p class="text-secondary font-semibold text-sm p-0.5 flex items-center gap-2">
        <span class="text-brand/80 font-extrabold">${totalCount}</span>
        <span>${currentLabel}</span>
      </p>
    `;
  }

  container.innerHTML = "";

  const emptyStateConfig = {
    plans: {
      icon: "<i class='fa-regular fa-compass text-brand/60'></i>",
      title: "No operational plans found",
      description: "Create structured execution plans for your life areas.",
    },
    logs: {
      icon: "<i class='fa-regular fa-calendar-day text-brand/60'></i>",
      title: "No log entries",
      description: "Log energy, mood, and progress alignment.",
    },
    templates: {
      icon: "<i class='fa-regular fa-layer-group text-brand/60'></i>",
      title: "No templates saved",
      description: "Save baseline and optimal performance strategies.",
    },
  };

  if (items.length === 0) {
    const currentEmpty = emptyStateConfig[activeTab] || emptyStateConfig.plans;

    container.innerHTML = `
      <div class="min-h-72 bg-surface border border-dashed border-border rounded-2xl p-12 text-center flex flex-col items-center justify-center">
        <div class="text-5xl mb-4 text-brand/70">${currentEmpty.icon}</div>
        <h2 class="text-xl font-bold text-color">${currentEmpty.title}</h2>
        <p class="mt-2 text-sm text-secondary max-w-sm mx-auto">${currentEmpty.description}</p>
      </div>
    `;
    return;
  }

  const createCard = (itemData) => {
    const itemEl = document.createElement("div");
    itemEl.className =
      "bg-surface border border-border/70 hover:border-border/90 rounded-2xl p-5 transition duration-200 shadow-xs hover:shadow-md";
    itemEl.innerHTML = PlannerItemComponent.render(itemData, activeTab);
    return itemEl;
  };

  if (activeTab === "plans") {
    const activePlans = items.filter((plan) => plan.state !== "completed");
    const completedPlans = items.filter((plan) => plan.state === "completed");

    activePlans.forEach((plan) => {
      container.appendChild(createCard(plan));
    });

    if (activePlans.length > 0 && completedPlans.length > 0) {
      const separatorWrapper = document.createElement("div");
      separatorWrapper.className = "w-full my-6 flex flex-col gap-4";

      separatorWrapper.innerHTML = `
        <div class="relative flex items-center justify-center">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-border/60"></div>
          </div>
          <button
            id="toggle-completed-btn"
            type="button"
            class="group relative bg-surface hover:bg-surface-2 transition px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-muted flex items-center gap-2 rounded-full border border-border/60 shadow-xs cursor-pointer select-none"
          >
            <i class="fa-regular fa-circle-check text-emerald-500"></i>
            <span>Completed Plans (${completedPlans.length})</span>
            <span class="inline-flex transition duration-300 group-[.is-collapsed]:rotate-180">
              <i class="fa-regular fa-chevron-down text-[10px] text-muted"></i>
            </span>
          </button>
        </div>
        <div id="completed-plans-container" class="flex flex-col gap-4 transition-all duration-300"></div>
      `;

      container.appendChild(separatorWrapper);

      const completedContainer = separatorWrapper.querySelector(
        "#completed-plans-container",
      );
      const toggleBtn = separatorWrapper.querySelector("#toggle-completed-btn");

      completedPlans.forEach((plan) => {
        completedContainer.appendChild(createCard(plan));
      });

      toggleBtn.addEventListener("click", () => {
        const isCollapsed = toggleBtn.classList.toggle("is-collapsed");
        completedContainer.classList.toggle("hidden", isCollapsed);
      });
    } else if (completedPlans.length > 0) {
      completedPlans.forEach((plan) => {
        container.appendChild(createCard(plan));
      });
    }
  } else {
    items.forEach((itemData) => {
      container.appendChild(createCard(itemData));
    });
  }
}
