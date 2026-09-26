import {
  ENERGY_LEVEL_OPTIONS,
  LIFE_AREAS,
  MOOD_OPTIONS,
  PLAN_STATES,
} from "@/utils/constants/options-value.constants.js";

export const ActivityCardComponent = {
  render(item, options = {}) {
    if (!item) return "";

    const { headerExtraHtml = "", footerExtraHtml = "" } = options;
    const isPlan = item.calendarType === "plan" || Boolean(item.period);

    // Resolve domain entities from constants
    const planStateConfig =
      PLAN_STATES.find((s) => s.id === item.state) || PLAN_STATES[0];
    const lifeAreaConfig = LIFE_AREAS.find((a) => a.id === item.lifeAreaId);
    const moodConfig = MOOD_OPTIONS.find((m) => m.value === item.mood);
    const energyConfig = ENERGY_LEVEL_OPTIONS.find(
      (e) => e.value === Number(item.energy),
    );

    const borderAccent = isPlan ? "bg-yellow-500" : "bg-blue-500";

    const mainBadgeStyle = isPlan
      ? planStateConfig.class
      : energyConfig?.class ||
        "bg-blue-500/10 text-blue-400 border-blue-500/20";

    const mainBadgeText = isPlan
      ? planStateConfig.name
      : energyConfig?.label || `Energy: ${item.energy || 3} / 5`;

    const mainBadgeIcon = isPlan
      ? planStateConfig.icon
      : energyConfig?.icon || "ti ti-battery-2 text-blue-400";

    return `
      <div
        class="group relative w-full min-h-28 flex flex-col justify-between p-3 rounded-xl bg-surface hover:bg-surface-2 border border-border/60 ${isPlan ? "hover:border-brand/40" : "hover:border-blue-500/40"} transition-all duration-200 shadow-sm overflow-hidden"
      >
        <div class="absolute top-0 left-0 bottom-0 w-1 ${borderAccent}"></div>

        <div class="ps-1.5 flex flex-col justify-between h-full w-full min-w-0">
          <div>
            <div class="flex items-center justify-between gap-1 mb-1.5 min-w-0">
              <div class="flex items-center gap-1.5 min-w-0 truncate flex-wrap">
                <span
                  class="min-h-5.5 inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] uppercase font-semibold border ${mainBadgeStyle}"
                >
                  <i class="${mainBadgeIcon} ${isPlan ? "text-[10px] lg:text-xs pb-px" : "text-xs lg:text-sm pb-px"}"></i>
                  ${mainBadgeText}
                </span>

                ${
                  !isPlan && moodConfig
                    ? `
                        <span
                          class="min-h-5.5 inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] uppercase font-semibold border ${moodConfig.class}"
                        >
                          <i
                            class="${moodConfig.icon} text-[10px] lg:text-xs pb-px"
                          ></i>
                          ${moodConfig.label}
                        </span>
                      `
                    : ""
                }
                ${
                  isPlan && lifeAreaConfig
                    ? `
                        <span
                          class="min-h-5.5 inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-medium border  ${lifeAreaConfig.class}"
                        >
                          <i
                            class="${lifeAreaConfig.icon} text-[10px] lg:text-xs pb-px"
                          ></i>
                          ${lifeAreaConfig.name}
                        </span>
                      `
                    : ""
                }
              </div>

              <div class="shrink-0">${headerExtraHtml}</div>
            </div>

            <h4
              class="text-xs font-bold text-color group-hover:text-brand transition-colors truncate mb-1"
              title="${item.title || "Untitled"}"
            >
              ${item.title || "Untitled"}
            </h4>

            ${
              item.description
                ? `<p
                    class="text-[11px] text-tertiary truncate font-normal mb-1.5"
                    title="${item.description}"
                  >
                    ${item.description}
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
              class="w-full flex justify-between items-center gap-1.5 shrink-0 min-w-0"
            >
              ${
                (isPlan ? item.period?.startDate : item.date)
                  ? `
                      <span
                        class="text-[10px] text-tertiary font-medium flex items-center gap-1 whitespace-nowrap shrink-0"
                      >
                        <i class="ti ti-clock text-[10px]"></i>
                        ${isPlan ? item.period.startDate : item.date}
                      </span>
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
