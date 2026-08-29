import { getDaysRemaining, isOverdue } from "@/utils/helpers";

import { TaskService } from "@/services/task.service.js";

export const TaskModalComponent = {
  render(editingTask = null) {
    const tasks = TaskService.getTasks();
    const activeTask = TaskService.getActiveTask();
    const activeTaskId = activeTask ? String(activeTask.id) : null;

    const isEditing = Boolean(editingTask);

    return `
      <div
        id="task-modal"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
      >
        <div
          id="task-modal-backdrop"
          class="absolute inset-0 cursor-pointer"
        ></div>

        <div
          class="relative w-full max-w-3xl bg-surface border border-border rounded-3xl p-6 shadow-2xl flex flex-col max-h-[85dvh]"
        >
          <div
            class="flex items-center justify-between border-b border-border pb-4 mb-4 shrink-0"
          >
            <div class="flex items-center gap-3">
              <div
                class="w-10 h-10 rounded-xl bg-brand/10 text-brand flex items-center justify-center text-base shrink-0"
              >
                <i class="fa-regular fa-bullseye-arrow"></i>
              </div>
              <div>
                <h3 class="text-base font-bold text-color">
                  Select Active Task
                </h3>
                <p class="text-xs text-secondary">
                  Choose a task and set its estimated pomodoros.
                </p>
              </div>
            </div>

            <button
              id="close-task-modal"
              type="button"
              class="w-8 h-8 rounded-xl bg-surface-2 hover:bg-surface-3 border border-border text-secondary hover:text-color flex items-center justify-center transition cursor-pointer"
            >
              <i class="fa-regular fa-xmark text-sm"></i>
            </button>
          </div>

          <div
            class="flex-1 overflow-y-auto mt-4 pe-1 space-y-2 max-h-48 scrollbar-thin scrollbar-thumb-surface-2"
          >
            ${
              tasks.length === 0
                ? `<div
                    class="w-full h-full min-h-40 sm:min-h-30 lg:min-h-20 overflow-y-auto scrollbar-thumb-surface-2 scrollbar-thin bg-surface-2 rounded-2xl border border-dashed border-border p-4 text-center flex flex-col justify-center items-center"
                  >
                    <div
                      class="h-full flex flex-col justify-center items-center"
                    >
                      <div class="text-3xl">
                        <i class="fa-regular fa-clipboard-list-check text-brand/60"></i>
                      </div>
                      <p class="mt-3 text-secondary max-w-sm mx-auto text-sm">
                        No task defined yet.
                      </p>
                    </div>
                  </div>`
                : tasks
                    .map((t) => {
                      const isActive = String(t.id) === activeTaskId;
                      const isDone = t.status === "done";
                      const isArchived = t.archived;

                      const overdue = isOverdue(t.dueDate, t.status);
                      const daysRemaining = getDaysRemaining(t.dueDate);

                      const completedPomos = t.completedFocusUnits || 0;
                      const estimatedPomos = t.estimatedFocusUnits || 1;

                      let dueDateBadge = "";
                      if (t.dueDate) {
                        const absDays = Math.abs(daysRemaining);

                        if (isDone) {
                          dueDateBadge = `
                            <span
                              class="inline-flex items-center gap-1 rounded-md border border-emerald-500/20 bg-emerald-500/10 px-2 py-1.25 text-[10px] font-medium text-emerald-500 ${
                                isDone || isArchived ? "opacity-50" : ""
                              }"
                            >
                              <i class="fa-regular fa-calendar-check"></i>
                              ${t.dueDate}
                            </span>
                          `;
                        } else if (overdue || daysRemaining < 0) {
                          dueDateBadge = `
                            <span
                              class="inline-flex items-center gap-1 rounded-md border border-red-500/20 bg-red-500/10 px-2 py-1.25 text-[10px] font-semibold text-red-500 ${
                                isArchived ? "" : "animate-pulse"
                              } ${isDone || isArchived ? "opacity-50" : ""}"
                            >
                              <i class="fa-regular fa-clock"></i> Overdue
                              (${absDays}d ago)
                            </span>
                          `;
                        } else if (daysRemaining === 0) {
                          dueDateBadge = `
                            <span
                              class="inline-flex items-center gap-1 rounded-md border border-amber-500/20 bg-amber-500/10 px-2 py-1.25 text-[10px] font-semibold text-amber-500 ${
                                isDone || isArchived ? "opacity-50" : ""
                              }"
                            >
                              <i class="fa-regular fa-clock"></i> Due Today
                            </span>
                          `;
                        } else {
                          dueDateBadge = `
                            <span
                              class="inline-flex items-center gap-1 rounded-md border border-secondary/20 bg-secondary/10 px-2 py-1.25 text-[10px] font-medium text-secondary/80 ${
                                isDone || isArchived ? "opacity-50" : ""
                              }"
                            >
                              <i class="fa-regular fa-calendar-day"></i> Due in
                              ${daysRemaining}d
                            </span>
                          `;
                        }
                      }

                      let priorityClass =
                        "text-lime-500/80 bg-lime-500/10 border-lime-500/20";
                      if (t.priority === "medium") {
                        priorityClass =
                          "text-amber-500/80 bg-amber-500/10 border-amber-500/20";
                      } else if (t.priority === "high") {
                        priorityClass =
                          "text-red-500/80 bg-red-500/10 border-red-500/20";
                      }

                      let statusLabel = "Todo";
                      let statusClass =
                        "text-brand/80 bg-brand/10 border-brand/20";
                      if (t.status === "done") {
                        statusLabel = "Done";
                        statusClass =
                          "text-emerald-500/80 bg-emerald-500/10 border-emerald-500/20";
                      } else if (t.status === "in_progress") {
                        statusLabel = "In Progress";
                        statusClass =
                          "text-orange-500/80 bg-orange-500/10 border-orange-500/20";
                      } else if (t.status === "blocked") {
                        statusLabel = "Blocked";
                        statusClass =
                          "text-pink-500/80 bg-pink-500/10 border-pink-500/20";
                      }

                      return `
                        <div
                          data-task-id="${t.id}"
                          data-is-done="${isDone}"
                          data-is-archive="${isArchived}"
                          class="task-item-row group flex items-center justify-between p-3 rounded-2xl transition border ${
                            isDone || isArchived
                              ? "bg-surface-2/60 border-border cursor-not-allowed select-none"
                              : isActive
                                ? "bg-brand/5 border-brand/60 shadow-xs cursor-pointer"
                                : "bg-surface-2 border-border hover:border-brand/40 cursor-pointer"
                          }"
                        >
                          <div
                            class="flex items-center gap-2.5 min-w-0 ${
                              isDone || isArchived
                                ? "opacity-50 pointer-events-none"
                                : ""
                            }"
                          >
                            ${
                              isActive
                                ? `<span
                                    class="w-5 h-5 rounded-full bg-brand text-white flex items-center justify-center text-[10px] shrink-0 shadow-xs"
                                  >
                                    <i class="fa-solid fa-check"></i>
                                  </span>`
                                : ""
                            }
                            <span
                              class="text-xs font-semibold truncate ${
                                isActive ? "text-brand font-bold" : "text-color"
                              } ${isDone ? "line-through text-muted" : ""}"
                            >
                              ${t.title}
                            </span>
                          </div>

                          <div class="flex items-center gap-2 shrink-0">
                            ${
                              !isDone && !isArchived
                                ? `
                                    <div class="flex items-center gap-1.5">
                                      <input
                                        type="text"
                                        inputmode="numeric"
                                        maxlength="2"
                                        value="${
                                          isEditing && editingTask?.id === t.id
                                            ? editingTask.estimatedFocusUnits
                                            : estimatedPomos
                                        }"
                                        data-pomo-input="${t.id}"
                                        id="pomo-input"
                                        class="pomo-input w-14 h-7 text-center text-xs font-bold bg-surface-1 border border-border rounded-lg text-color focus:outline-none focus:border-brand/60 transition hidden"
                                        onclick="event.stopPropagation()"
                                      />
                                      <button
                                        type="button"
                                        data-set-pomo="${t.id}"
                                        class="btn-set-pomo w-7 h-7 rounded-lg bg-surface-2 hover:bg-brand/10 border border-border text-secondary hover:text-brand flex items-center justify-center transition cursor-pointer"
                                        title="Set Pomodoros"
                                      >
                                        <i
                                          class="fa-regular fa-clock text-xs"
                                        ></i>
                                      </button>
                                      <button
                                        type="button"
                                        data-save-pomo="${t.id}"
                                        class="btn-save-pomo w-7 h-7 rounded-lg bg-brand/10 hover:bg-brand/20 border border-brand/20 text-brand items-center justify-center transition cursor-pointer hidden"
                                        title="Save Pomodoros"
                                      >
                                        <i
                                          class="fa-solid fa-check text-xs"
                                        ></i>
                                      </button>
                                    </div>
                                  `
                                : ""
                            }

                            ${
                              isArchived
                                ? ` <span
                                    class="text-[10px] text-secondary/80 bg-secondary/10 border-secondary/20 px-2 py-1.25 rounded-md border uppercase font-semibold tracking-wider ${
                                      isDone || isArchived ? "opacity-50" : ""
                                    }"
                                  >
                                    Archived
                                  </span>`
                                : ""
                            }

                            ${dueDateBadge}

                            <span
                              class="text-[10px] ${priorityClass} px-2 py-1.25 rounded-md border uppercase font-semibold tracking-wider ${
                                isDone || isArchived ? "opacity-50" : ""
                              }"
                            >
                              ${t.priority}
                            </span>
                            
                            <span
                              class="text-[10px] ${statusClass} px-2 py-1.25 rounded-md border uppercase font-semibold tracking-wider ${
                                isDone || isArchived ? "opacity-50" : ""
                              }"
                            >
                              ${statusLabel}
                            </span>

                            <span
                              class="text-[10px] font-bold text-brand/80 bg-brand/10 border-brand/20 px-2 py-1.25 rounded-md border ${
                                isDone || isArchived ? "opacity-50" : ""
                              }"
                            >
                              ${`${completedPomos}/${estimatedPomos} Units`}
                            </span>
                          </div>
                        </div>
                      `;
                    })
                    .join("")
            }
          </div>
        </div>
      </div>
    `;
  },
};
