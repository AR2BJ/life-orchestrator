import { MatrixTaskCardComponent } from "@/components/features/matrix/matrix-task-card.component";
import { getTaskMatrixAttributes } from "@/utils/helpers.js";

export function renderEisenhowerGrid(tasks) {
  const q1 = [],
    q2 = [],
    q3 = [],
    q4 = [];

  tasks.forEach((task) => {
    const { quadrant } = getTaskMatrixAttributes(task);
    if (quadrant === 1) q1.push(task);
    else if (quadrant === 2) q2.push(task);
    else if (quadrant === 3) q3.push(task);
    else q4.push(task);
  });

  const renderSection = (title, subtitle, taskList, colorTheme, icon) => {
    return `
      <div
        class="flex flex-col h-full rounded-2xl bg-surface-2 border border-border/80 p-4 shadow-sm"
      >
        <div
          class="flex items-center justify-between pb-3 mb-3 border-b border-border/60"
        >
          <div class="flex items-center gap-2.5">
            <div
              class="w-8 h-8 rounded-xl ${colorTheme.bg} ${colorTheme.text} flex items-center justify-center text-xs font-bold"
            >
              <i class="${icon}"></i>
            </div>
            <div>
              <h3
                class="text-sm font-bold text-primary flex items-center gap-2"
              >
                ${title}
                <span
                  class="text-xs px-2 py-0.5 rounded-md ${colorTheme.bg} ${colorTheme.text} font-bold"
                >
                  ${taskList.length}
                </span>
              </h3>
              <p class="text-[11px] text-tertiary font-medium">${subtitle}</p>
            </div>
          </div>
        </div>

        <div
          class="flex-1 flex flex-col justify-start space-y-2.5 overflow-y-auto min-h-31 max-h-31 pe-1.5 scrollbar-thin scrollbar-thumb-surface-3"
        >
          ${
            taskList.length > 0
              ? taskList
                  .map((task) => MatrixTaskCardComponent.render(task))
                  .join("")
              : `
                  <div
                    class="w-full h-full bg-surface border border-dashed border-border rounded-xl p-4 text-center flex flex-col justify-center items-center"
                  >
                    <div class="text-2xl mb-2">
                      <i
                        class="fa-regular fa-clipboard-list-check text-brand/60"
                      ></i>
                    </div>
                    <h2 class="text-xs font-bold text-primary">
                      No tasks in this quadrant
                    </h2>
                    <p class="text-[10px] mt-1 text-secondary max-w-sm mx-auto">
                      You're all caught up! Create a new task to get started.
                    </p>
                  </div>
                `
          }
        </div>
      </div>
    `;
  };

  return `
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
      ${renderSection(
        "Do First (Q1)",
        "Urgent & Important",
        q1,
        { bg: "bg-red-500/10", text: "text-red-400" },
        "fa-regular fa-fire",
      )}
      ${renderSection(
        "Schedule (Q2)",
        "Not Urgent but Important",
        q2,
        { bg: "bg-sky-500/10", text: "text-sky-400" },
        "fa-regular fa-calendar-check",
      )}
      ${renderSection(
        "Delegate (Q3)",
        "Urgent but Not Important",
        q3,
        { bg: "bg-amber-500/10", text: "text-amber-400" },
        "fa-regular fa-user-gear",
      )}
      ${renderSection(
        "Eliminate (Q4)",
        "Neither Urgent nor Important",
        q4,
        { bg: "bg-slate-500/10", text: "text-slate-400" },
        "fa-regular fa-trash-can",
      )}
    </div>
  `;
}

export function renderAbcdeList(tasks) {
  const tasksWithMetrics = tasks.map((task) => ({
    task,
    metrics: getTaskMatrixAttributes(task),
  }));

  const groups = { A: [], B: [], C: [], D: [], E: [] };

  tasksWithMetrics.forEach((item) => {
    const score = item.metrics.priorityScore;

    if (score >= 20) groups.A.push(item);
    else if (score >= 12) groups.B.push(item);
    else if (score >= 6) groups.C.push(item);
    else if (score >= 3) groups.D.push(item);
    else groups.E.push(item);
  });

  const sortByScoreDesc = (a, b) =>
    b.metrics.priorityScore - a.metrics.priorityScore;
  Object.keys(groups).forEach((key) => groups[key].sort(sortByScoreDesc));

  const categories = [
    {
      key: "A",
      label: "Must Do",
      desc: "Severe consequences",
      style: "bg-red-500/10 text-red-400",
    },
    {
      key: "B",
      label: "Should Do",
      desc: "Medium consequences",
      style: "bg-amber-500/10 text-amber-400",
    },
    {
      key: "C",
      label: "Nice to Do",
      desc: "No consequences",
      style: "bg-sky-500/10 text-sky-400",
    },
    {
      key: "D",
      label: "Delegate",
      desc: "Pass to others",
      style: "bg-indigo-500/10 text-indigo-400",
    },
    {
      key: "E",
      label: "Eliminate",
      desc: "Low impact",
      style: "bg-slate-500/10 text-slate-400",
    },
  ];

  return `
    <div
      class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 w-full"
    >
      ${categories
        .map((cat, idx) => {
          const list = groups[cat.key];
          const colSpanClass =
            idx < 4
              ? "col-span-2 md:col-span-1"
              : idx === 4
                ? "col-span-2"
                : "";

          return `
            <div
              class="flex flex-col h-full rounded-2xl bg-surface-2 border border-border/80 p-3.5 shadow-sm ${colSpanClass}"
            >
              <div
                class="pb-3 mb-3 border-b border-border/60 flex items-center justify-between"
              >
                <div>
                  <div class="flex items-center gap-2">
                    <span
                      class="text-xs font-black px-2 py-0.5 rounded ${cat.style}"
                    >
                      ${cat.key}
                    </span>
                    <span class="text-xs font-bold text-primary"
                      >${cat.label}</span
                    >
                  </div>
                  <p class="text-[10px] text-tertiary mt-1 font-medium">
                    ${cat.desc}
                  </p>
                </div>
                <span
                  class="text-xs px-2 py-0.5 rounded-md font-bold ${cat.style}"
                >
                  ${list.length}
                </span>
              </div>

              <div
                class="flex-1 flex flex-col justify-start space-y-2.5 overflow-y-auto min-h-31 max-h-31 pe-1 scrollbar-thin scrollbar-thumb-surface-3"
              >
                ${
                  list.length > 0
                    ? list
                        .map((item) =>
                          MatrixTaskCardComponent.render(item.task),
                        )
                        .join("")
                    : `<div
                        class="w-full h-full bg-surface border border-dashed border-border rounded-xl p-4 text-center flex flex-col justify-center items-center"
                      >
                        <div class="text-2xl mb-2">
                          <i
                            class="fa-regular fa-clipboard-list-check text-brand/60"
                          ></i>
                        </div>
                        <h2 class="text-xs font-bold text-primary">
                          No tasks in this quadrant
                        </h2>
                        <p
                          class="text-[10px] mt-1 text-secondary max-w-sm mx-auto"
                        >
                          You're all caught up! Create a new task to get
                          started.
                        </p>
                      </div>`
                }
              </div>
            </div>
          `;
        })
        .join("")}
    </div>
  `;
}
