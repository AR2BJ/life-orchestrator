import { MindItemComponent } from "@/components/features/mind/mind-item.component";
import { state } from "@/models/state.model";

export function renderMindList(items, activeTab = "notes") {
  const container = document.getElementById("mind-list");
  const countBadge = document.getElementById("mind-count-badge");

  if (!container) return;

  if (countBadge) {
    const totalCount = items.length;
    const labels = {
      notes: totalCount === 1 ? "note" : "notes",
      snippets: totalCount === 1 ? "snippet" : "snippets",
      bookmarks: totalCount === 1 ? "bookmark" : "bookmarks",
      cheatsheets: totalCount === 1 ? "cheatsheet" : "cheatsheets",
    };

    const currentLabel = labels[activeTab] || "items";

    countBadge.innerHTML = `
      <p
        class="text-secondary font-semibold text-sm p-0.5 flex items-center gap-2"
      >
        <span class="text-brand/80 font-extrabold">${totalCount}</span>
        <span>${currentLabel}</span>
      </p>
    `;
  }

  container.innerHTML = "";

  const emptyStateConfig = {
    notes: {
      icon: "<i class='ti ti-note text-brand/60'></i>",
      title: "No notes found",
      description:
        "Capture thoughts, ideas, and knowledge in structured notes.",
    },
    snippets: {
      icon: "<i class='ti ti-code text-brand/60'></i>",
      title: "No code snippets saved",
      description: "Save and organize reusable code snippets for easy access.",
    },
    bookmarks: {
      icon: "<i class='ti ti-bookmark text-brand/60'></i>",
      title: "No bookmarks added",
      description: "Keep track of useful links, docs, and online resources.",
    },
    cheatsheets: {
      icon: "<i class='ti ti-file-description text-brand/60'></i>",
      title: "No cheatSheets available",
      description: "Create quick reference guides and key-value shortcuts.",
    },
  };

  if (items.length === 0) {
    const currentEmpty = emptyStateConfig[activeTab] || emptyStateConfig.notes;

    container.innerHTML = `
      <div
        class="min-h-72 bg-surface border border-dashed border-border rounded-2xl p-12 text-center flex flex-col items-center justify-center"
      >
        <div class="text-6xl mb-2 text-brand/70">${currentEmpty.icon}</div>
        <h2 class="text-xl font-bold text-color">${currentEmpty.title}</h2>
        <p class="mt-2 text-sm text-secondary max-w-sm mx-auto">
          ${currentEmpty.description}
        </p>
      </div>
    `;
    return;
  }

  const createCard = (itemData) => {
    const itemEl = document.createElement("div");
    itemEl.className =
      "bg-surface border border-border/70 hover:border-border/90 rounded-2xl p-5 transition duration-200 shadow-xs hover:shadow-md";
    itemEl.innerHTML = MindItemComponent.render(itemData, activeTab);
    return itemEl;
  };
  const pinnedItems = items.filter((item) => item.pinned);
  const unpinnedItems = items.filter((item) => !item.pinned);

  if (pinnedItems.length > 0 && unpinnedItems.length > 0) {
    pinnedItems.forEach((item) => {
      container.appendChild(createCard(item));
    });

    const dropdownIcon = {
      notes: "ti-article text-sky-500/80",
      snippets: "ti-code text-violet-500/80",
      bookmarks: "ti-bookmark text-emerald-500/80",
      cheatsheets: "ti-file-description text-yellow-500/80",
    };

    const target = dropdownIcon[state.activeTab] || dropdownIcon.notes;

    const separatorWrapper = document.createElement("div");
    separatorWrapper.className = "w-full my-6 flex flex-col gap-4";

    separatorWrapper.innerHTML = `
      <div class="relative flex items-center justify-center">
        <div class="absolute inset-0 flex items-center">
          <div class="w-full border-t border-border/60"></div>
        </div>
        <button
          id="toggle-unpinned-btn"
          type="button"
          class="group relative bg-surface hover:bg-surface-2 transition px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-muted flex items-center gap-2 rounded-full border border-border/60 shadow-xs cursor-pointer select-none"
        >
          <i class="ti ${target} text-sm"></i>
          <span>Other ${state.activeTab} (${unpinnedItems.length})</span>
          <span
            class="inline-flex transition duration-300 group-[.is-collapsed]:rotate-180"
          >
            <i class="ti ti-chevron-down text-[11px] lg:text-xs text-muted"></i>
          </span>
        </button>
      </div>
      <div
        id="unpinned-items-container"
        class="flex flex-col gap-4 transition-all duration-300"
      ></div>
    `;

    container.appendChild(separatorWrapper);

    const unpinnedContainer = separatorWrapper.querySelector(
      "#unpinned-items-container",
    );
    const toggleBtn = separatorWrapper.querySelector("#toggle-unpinned-btn");

    unpinnedItems.forEach((item) => {
      unpinnedContainer.appendChild(createCard(item));
    });

    toggleBtn.addEventListener("click", () => {
      const isCollapsed = toggleBtn.classList.toggle("is-collapsed");
      unpinnedContainer.classList.toggle("hidden", isCollapsed);
    });
  } else if (pinnedItems.length > 0) {
    pinnedItems.forEach((item) => {
      container.appendChild(createCard(item));
    });
  } else {
    unpinnedItems.forEach((item) => {
      container.appendChild(createCard(item));
    });
  }
}
