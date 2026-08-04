import { StateManager, state } from "@/models/state.model.js";
import {
  renderAbcdeList,
  renderEisenhowerGrid,
} from "@/views/matrix/matrix.renderer.js";

export class MatrixController {
  // Data config for individual matrix modes to enforce single source of truth
  static matrixConfigs = {
    eisenhower: {
      title: "Eisenhower Matrix",
      description:
        "Categorize tasks into 4 urgent/important quadrants for high-impact productivity.",
      icon: "fa-table-cells-large",
    },
    abcde: {
      title: "ABCDE Method",
      description:
        "Prioritize tasks systematically from highest impact (A) to delegable/eliminable (D/E).",
      icon: "fa-list-ol",
    },
  };

  static init() {
    this.bindEvents();
    this.setupTabIndicatorObserver();

    requestAnimationFrame(() => {
      this.updateTabStyles(state.matrixMode);
      this.updateHeaderData(state.matrixMode);
    });
  }

  static bindEvents() {
    const btnEisenhower = document.getElementById("btn-matrix-eisenhower");
    const btnAbcde = document.getElementById("btn-matrix-abcde");

    btnEisenhower?.addEventListener("click", () => {
      this.switchMode("eisenhower");
    });

    btnAbcde?.addEventListener("click", () => {
      this.switchMode("abcde");
    });
  }

  static switchMode(mode) {
    if (state.matrixMode === mode) return;

    StateManager.setMatrixMode(mode);
    this.updateTabStyles(mode);
    this.updateHeaderData(mode);
    this.dispatchRender();
  }

  static updateHeaderData(mode) {
    const titleEl = document.getElementById("matrix-header-title");
    const descEl = document.getElementById("matrix-header-description");
    const config = this.matrixConfigs[mode];

    if (!config) return;

    if (titleEl) {
      titleEl.innerHTML = `<i class="fa-regular ${config.icon} text-brand/80"></i> ${config.title}`;
    }

    if (descEl) {
      descEl.textContent = config.description;
    }
  }

  static setupTabIndicatorObserver() {
    const btnEisenhower = document.getElementById("btn-matrix-eisenhower");
    const btnAbcde = document.getElementById("btn-matrix-abcde");

    if (!btnEisenhower || !btnAbcde) return;

    if (!window.matrixTabResizeObserver) {
      window.matrixTabResizeObserver = new ResizeObserver(() => {
        requestAnimationFrame(() => {
          this.updateTabStyles(state.matrixMode);
          this.updateHeaderData(state.matrixMode);
        });
      });
    }

    window.matrixTabResizeObserver.disconnect();
    window.matrixTabResizeObserver.observe(btnEisenhower);
    window.matrixTabResizeObserver.observe(btnAbcde);
  }

  static updateTabStyles(mode) {
    const indicator = document.getElementById("matrix-tab-indicator");
    const btnEisenhower = document.getElementById("btn-matrix-eisenhower");
    const btnAbcde = document.getElementById("btn-matrix-abcde");

    if (!indicator || !btnEisenhower || !btnAbcde) return;

    const buttons = [btnEisenhower, btnAbcde];
    const activeIndex = mode === "eisenhower" ? 0 : 1;
    const targetBtn = buttons[activeIndex];

    const buttonWidth =
      targetBtn.offsetWidth || targetBtn.getBoundingClientRect().width;
    if (!buttonWidth) return;

    const isWide = window.matchMedia("(min-width: 375px)").matches;

    if (isWide) {
      let offsetLeft = 4;
      for (let i = 0; i < activeIndex; i++) {
        offsetLeft += buttons[i].offsetWidth;
      }

      indicator.style.width = `${buttonWidth}px`;
      indicator.style.left = `${offsetLeft}px`;
      indicator.style.top = `4px`;
      indicator.style.height = `${targetBtn.offsetHeight}px`;
    } else {
      let offsetTop = 4;
      for (let i = 0; i < activeIndex; i++) {
        offsetTop += buttons[i].offsetHeight;
      }

      indicator.style.height = `${targetBtn.offsetHeight}px`;
      indicator.style.top = `${offsetTop}px`;
      indicator.style.left = `4px`;
      indicator.style.width = `${buttonWidth}px`;
    }

    buttons.forEach((btn, idx) => {
      if (idx === activeIndex) {
        btn.classList.replace(
          "text-secondary",
          "text-(--color-btn-primary-text)",
        );
        btn.setAttribute("aria-selected", "true");
      } else {
        btn.classList.replace(
          "text-(--color-btn-primary-text)",
          "text-secondary",
        );
        btn.setAttribute("aria-selected", "false");
      }
    });
  }

  static dispatchRender() {
    const container = document.getElementById("matrix-content-container");
    if (!container) return;

    const activeTasks = StateManager.getTasks().filter(
      (t) => t.status !== "done" && !t.isArchived,
    );

    if (state.matrixMode === "eisenhower") {
      container.innerHTML = renderEisenhowerGrid(activeTasks);
    } else {
      container.innerHTML = renderAbcdeList(activeTasks);
    }

    requestAnimationFrame(() => {
      this.updateTabStyles(state.matrixMode);
      this.updateHeaderData(state.matrixMode);
    });
  }
}
