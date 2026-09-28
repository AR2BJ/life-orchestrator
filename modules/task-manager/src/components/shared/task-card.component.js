import {
  PRIORITY_OPTIONS,
  STATUS_OPTIONS,
} from "@/utils/constants/options-value.constants";

import { state } from "@/models/state.model.js";

export const TaskCardComponent = {
  _normalizeIconClass(iconString) {
    if (!iconString) return "ti ti-folder";
    return iconString;
  },

  _getPriorityBadgeHtml(priorityValue, taskId) {
    const matched = PRIORITY_OPTIONS.find((p) => p.value === priorityValue);
    const priorityData = matched || {
      value: priorityValue || "low",
      icon: "ti ti-circle text-secondary",
      class: "bg-surface text-secondary border-border/60",
    };

    const iconClass = this._normalizeIconClass(priorityData.icon);

    return `
      <span
        class="priority-badge min-h-4 inline-flex items-center gap-1 rounded border ${priorityData.class} px-2 py-0.5 text-[9px] uppercase font-bold"
        title="priority badge"
      >
        <i
          class="${iconClass} text-[9px] lg:text-[11px] pb-px"
        ></i>
        <span>${priorityData.title}</span>
      </span>`;
  },

  _getStatusBadgeHtml(statusValue, taskId) {
    const matched = STATUS_OPTIONS.find((p) => p.value === statusValue);
    const statusData = matched || {
      value: statusValue || "todo",
      icon: "ti ti-circle text-secondary",
      class: "bg-surface text-secondary border-border/60",
    };

    const iconClass = this._normalizeIconClass(statusData.icon);

    return `
      <span
        class="status-badge min-h-4 inline-flex items-center gap-1 rounded border ${statusData.class} px-2 py-0.5 text-[9px] uppercase font-bold"
        title="status badge"
      >
        <i
          class="${iconClass} text-[9px] lg:text-[11px] pb-px"
        ></i>
        <span>${statusData.title}</span>
      </span>`;
  },

  render(task, options = {}) {
    const { headerExtraHtml = "", footerExtraHtml = "" } = options;

    const priorityBadge = this._getPriorityBadgeHtml(task.priority, task.id);
    const statusBadge = this._getStatusBadgeHtml(task.status, task.id);

    const completed = task.completedFocusUnits || 0;
    const estimated = task.estimatedFocusUnits || 1;

    const statusAccent =
      {
        todo: "bg-sky-500",
        in_progress: "bg-yellow-500",
        done: "bg-emerald-500",
        blocked: "bg-red-500",
      }[task.status] || "bg-sky-500";

    const matchedTags = state.tags.filter((t) => task.tagIds?.includes(t.id));
    const visibleTag = matchedTags[0];

    return `
      <div
        class="group relative w-full min-h-31 flex flex-col justify-between p-2 rounded-xl bg-surface hover:bg-surface-2 border border-border/60 hover:border-brand/40 transition-all duration-200 shadow-sm overflow-hidden"
      >
        <div class="absolute top-0 left-0 bottom-0 w-1 ${statusAccent}"></div>

        <div
          class="pe-1 ps-1.5 flex flex-col justify-between h-full w-full min-w-0"
        >
          <div>
            <div class="flex items-center justify-between gap-1 mb-1.5 min-w-0">
              <div class="flex items-center gap-1 min-w-0 truncate">
                ${priorityBadge} 
                
                ${statusBadge}
                
                ${
                  estimated !== 0
                    ? ` <div class="flex md:self-end z-20 shrink-0">
                        <span
                          class="min-h-4 inline-flex items-center rounded px-2 py-0.5 text-[9px] font-bold bg-lime-600/10 dark:bg-lime-500/10 text-lime-600/80 dark:text-lime-500/80 border border-lime-600/20 dark:border-lime-500/20"
                        >
                          ${completed}/${estimated} Units
                        </span>
                      </div>`
                    : ""
                }
              </div>

              <div class="shrink-0">${headerExtraHtml}</div>
            </div>

            <h4
              class="block lg:hidden text-xs font-bold text-color group-hover:text-brand transition-colors truncate mb-1 cursor-pointer"
              data-tooltip-title="${task.title}"
            >
              ${task.title}
            </h4>
            <h4
              class="hidden lg:block text-xs font-bold text-color group-hover:text-brand transition-colors truncate mb-1"
              title="${task.title}"
            >
              ${task.title}
            </h4>

            ${
              task.description
                ? `<p
                    class="block xl:hidden text-[11px] text-tertiary truncate font-normal mb-1.5 cursor-pointer"
                    data-tooltip-title="${task.description}"
                  >
                    ${task.description}
                  </p>
                  <p
                    class="hidden xl:block text-[11px] text-tertiary truncate font-normal mb-1.5"
                    title="${task.description}"
                  >
                    ${task.description}
                  </p>`
                : ""
            }
          </div>

          <div
            class="flex items-center justify-between pt-2 mt-1 border-t border-border/40 text-[10px] text-secondary gap-1.5 w-full min-w-0 shrink-0"
          >
            ${
              footerExtraHtml
                ? `<div
                    class="shrink-0 font-medium text-[10px] text-secondary/90"
                  >
                    ${footerExtraHtml}
                  </div>`
                : ""
            }

            <div
              class="${
                footerExtraHtml
                  ? "flex justify-end"
                  : "w-full flex justify-between"
              } items-center gap-1.5 shrink-0 min-w-0"
            >
              ${
                task.dueDate
                  ? `
                    <span
                      class="text-[10px] text-tertiary font-medium flex items-center gap-0.5 whitespace-nowrap shrink-0"
                    >
                      <i class="ti ti-clock text-[10px]"></i>
                      ${task.dueDate}
                    </span>
                  `
                  : ""
              }
              ${
                matchedTags.length > 0
                  ? `
                      <div class="flex items-center gap-1 shrink-0">
                        <span
                          class="hidden sm:inline-flex text-[10px] bg-surface-3/40 text-secondary p-0.5 rounded border border-border/40 whitespace-nowrap truncate items-center gap-1"
                          title="${visibleTag.name}"
                        >
                          <i class="ti ti-tags"></i>
                          ${visibleTag.name}
                        </span>

                        ${
                          matchedTags.length > 1
                            ? `<span
                                class="hidden sm:inline-flex text-[10px] bg-surface-3/60 hover:bg-surface-2 text-secondary p-0.5 rounded border border-border/40 font-bold cursor-pointer"
                                data-tooltip-title="${matchedTags
                                  .slice(1)
                                  .map((t) => t.name)
                                  .join(", ")}"
                              >
                                +${matchedTags.length - 1}
                              </span>`
                            : ""
                        }

                        <span
                          class="sm:hidden inline-flex text-[10px] bg-surface-3/60 hover:bg-surface-2 text-secondary p-0.5 rounded border border-border/40 font-bold cursor-pointer items-center gap-0.5"
                          data-tooltip-title="${matchedTags
                            .map((t) => t.name)
                            .join(", ")}"
                        >
                          <i class="ti ti-tags"></i>
                          +${matchedTags.length}
                        </span>
                      </div>
                    `
                  : ""
              }
            </div>
          </div>
        </div>
      </div>
    `;
  },
};
