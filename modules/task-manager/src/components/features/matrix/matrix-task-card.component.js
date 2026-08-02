import { TaskCardComponent } from "@/components/shared/task-card.component";
import { getTaskMatrixAttributes } from "@/utils/helpers.js";

export const MatrixTaskCardComponent = {
  render(task) {
    const { importance, urgency, priorityScore } =
      getTaskMatrixAttributes(task);

    const headerExtraHtml = `
      <span class="text-[9px] font-bold px-1.5 py-0.5 rounded bg-brand-light text-brand shrink-0">
        Score: ${priorityScore}
      </span>
    `;

    const footerExtraHtml = `
      <div class="flex items-center gap-2 font-semibold shrink-0">
        <span class="text-tertiary">Imp: <strong class="text-primary">${importance}</strong></span>
        <span class="text-tertiary">Urg: <strong class="text-primary">${urgency}</strong></span>
      </div>
    `;

    return TaskCardComponent.render(task, {
      headerExtraHtml,
      footerExtraHtml,
    });
  },
};
