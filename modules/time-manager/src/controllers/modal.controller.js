import { ConfirmModalComponent } from "@/components/modals/confirm-modal.component.js";
import { InfoModalComponent } from "@/components/modals/info-modal.component";
import { StateManager } from "@/models/state.model";
import { TaskModalComponent } from "@/components/modals/task-modal.component.js";
import { TaskService } from "@/services/task.service.js";

export const ModalController = {
  confirmCallback: null,
  editingTask: null,
  openPomoInputs: {},

  init() {
    this.bindGlobalTriggers();
    this.bindKeyboardShortcuts();
  },

  bindGlobalTriggers() {
    // Task Modal & Help Modal Triggers from UI
    document.addEventListener("click", (e) => {
      const btnSelect = e.target.closest("#btn-select-task");
      const boxEmpty = e.target.closest("#box-empty-task");
      const helpToggle = e.target.closest("#help-toggle");

      if (btnSelect || boxEmpty) {
        this.openTaskModal();
      }

      if (helpToggle) {
        this.openHelpModal();
      }
    });
  },

  // ==========================================
  // KEYBOARD SHORTCUTS ENGINE
  // ==========================================
  bindKeyboardShortcuts() {
    document.addEventListener("keydown", (e) => {
      const isConfirmOpen = Boolean(
        document.getElementById("confirm-modal-wrapper"),
      );
      const isTaskOpen = Boolean(document.getElementById("task-modal-wrapper"));
      const isHelpOpen = Boolean(document.getElementById("help-modal-wrapper"));

      // 1. ESC KEY: Blur Active Element & Close Modals
      if (e.key === "Escape") {
        if (
          document.activeElement &&
          typeof document.activeElement.blur === "function"
        ) {
          document.activeElement.blur();
        }

        if (isConfirmOpen) {
          e.preventDefault();
          this.closeConfirmModal();
          return;
        }

        if (isTaskOpen) {
          e.preventDefault();
          this.closeTaskModal();
          return;
        }

        if (isHelpOpen) {
          e.preventDefault();
          this.closeHelpModal();
          return;
        }
      }

      // 2. CTRL/CMD + ENTER: Submit / Confirm Action
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        if (isConfirmOpen) {
          e.preventDefault();
          if (typeof this.confirmCallback === "function") {
            this.confirmCallback();
          }
          this.closeConfirmModal();
          return;
        }
      }
    });
  },

  openTaskModal(editingTask = null) {
    this.editingTask = editingTask;

    let modalWrapper = document.getElementById("task-modal-wrapper");

    if (modalWrapper) {
      modalWrapper.innerHTML = TaskModalComponent.render(editingTask);
    } else {
      modalWrapper = document.createElement("div");
      modalWrapper.id = "task-modal-wrapper";
      modalWrapper.innerHTML = TaskModalComponent.render(editingTask);
      document.body.appendChild(modalWrapper);
    }

    this.bindTaskModalEvents(modalWrapper);
  },

  closeTaskModal() {
    const wrapper = document.getElementById("task-modal-wrapper");
    if (wrapper) {
      wrapper.remove();
    }
    this.editingTask = null;
  },

  bindTaskModalEvents(wrapper) {
    // 1. Validation for Pomodoro Input Field
    const pomoInputs = wrapper.querySelector("#pomo-input");
    if (pomoInputs) {
      pomoInputs.addEventListener("input", (e) => {
        let val = e.target.value.replace(/\D/g, "");
        if (val !== "") {
          let num = parseInt(val, 10);
          if (num > 20) num = 20;
          if (num < 1) num = 1;
          val = String(num);
        }
        e.target.value = val;
      });

      pomoInputs.addEventListener("blur", (e) => {
        if (!e.target.value.trim() || parseInt(e.target.value, 10) < 1) {
          e.target.value = "1";
        }
      });
    }

    wrapper.addEventListener("click", (e) => {
      if (
        e.target.closest("#close-task-modal") ||
        e.target.id === "task-modal-backdrop"
      ) {
        e.preventDefault();
        e.stopPropagation();
        this.closeTaskModal();
        return;
      }

      const btnSetPomo = e.target.closest(".btn-set-pomo");
      if (btnSetPomo) {
        e.preventDefault();
        e.stopPropagation();

        const taskId = btnSetPomo.dataset.setPomo;
        const pomoInput = wrapper.querySelector(
          `[data-pomo-input="${taskId}"]`,
        );
        const saveBtn = wrapper.querySelector(`[data-save-pomo="${taskId}"]`);

        if (pomoInput && saveBtn) {
          const task = TaskService.getTasks().find(
            (t) => String(t.id) === String(taskId),
          );

          pomoInput.value = task?.estimatedFocusUnits || 1;
          this.openPomoInputs[taskId] = true;

          Object.keys(this.openPomoInputs).forEach((id) => {
            if (id !== taskId) {
              this.openPomoInputs[id] = false;
              const otherInput = wrapper.querySelector(
                `[data-pomo-input="${id}"]`,
              );
              const otherSave = wrapper.querySelector(
                `[data-save-pomo="${id}"]`,
              );
              const otherSet = wrapper.querySelector(`[data-set-pomo="${id}"]`);

              if (otherInput) otherInput.classList.add("hidden");
              if (otherSave) otherSave.classList.add("hidden");
              if (otherSet) otherSet.classList.remove("hidden");
            }
          });

          pomoInput.classList.remove("hidden");
          saveBtn.classList.remove("hidden");
          btnSetPomo.classList.add("hidden");
          pomoInput.focus();
        }
        return;
      }

      const btnSavePomo = e.target.closest(".btn-save-pomo");
      if (btnSavePomo) {
        e.preventDefault();
        e.stopPropagation();

        const taskId = btnSavePomo.dataset.savePomo;
        const pomoInput = wrapper.querySelector(
          `[data-pomo-input="${taskId}"]`,
        );
        const setBtn = wrapper.querySelector(`[data-set-pomo="${taskId}"]`);
        const count = parseInt(pomoInput?.value, 10) || 1;

        if (count > 0 && count <= 20) {
          TaskService.setEstimatedPomodoros(taskId, count);

          this.openPomoInputs[taskId] = false;
          pomoInput.classList.add("hidden");
          btnSavePomo.classList.add("hidden");
          setBtn.classList.remove("hidden");

          StateManager.notify();
          this.refreshTaskModal();
        }
        return;
      }

      if (e.target.closest(".pomo-input")) {
        e.stopPropagation();
        return;
      }

      const taskItem = e.target.closest(".task-item-row");
      if (taskItem) {
        e.preventDefault();
        e.stopPropagation();

        const isDone = taskItem.dataset.isDone === "true";
        const isArchive = taskItem.dataset.isArchive === "true";
        if (isDone || isArchive) return;

        const taskId = String(taskItem.dataset.taskId);

        TaskService.setActiveTask(taskId);

        this.closeTaskModal();
      }
    });
  },

  refreshTaskModal() {
    const isModalOpen = Boolean(document.getElementById("task-modal-wrapper"));
    if (isModalOpen) {
      this.openTaskModal(this.editingTask);
    }
  },

  // ==========================================
  // HELP MODAL LOGIC (Dynamic Body Injection)
  // ==========================================
  openHelpModal() {
    this.closeHelpModal();

    const helpWrapper = document.createElement("div");
    helpWrapper.id = "help-modal-wrapper";
    helpWrapper.innerHTML = InfoModalComponent.render();
    document.body.appendChild(helpWrapper);

    this.bindHelpModalEvents(helpWrapper);
  },

  closeHelpModal() {
    const wrapper = document.getElementById("help-modal-wrapper");
    if (wrapper) {
      wrapper.remove();
    }
  },

  bindHelpModalEvents(wrapper) {
    const modalEl = wrapper.querySelector("#help-modal");
    if (modalEl) {
      modalEl.classList.replace("hidden", "flex");
    }

    wrapper.addEventListener("click", (e) => {
      if (
        e.target.closest("#close-help-modal") ||
        e.target.closest("#btn-close-help") ||
        e.target.closest("#help-modal-backdrop")
      ) {
        this.closeHelpModal();
      }

      // Tab Switching Logic inside Help Modal
      const btnSafeguard = e.target.closest("#tab-help-safeguard");
      const btnShortcuts = e.target.closest("#tab-help-shortcuts");

      if (btnSafeguard || btnShortcuts) {
        const tabSafeguard = wrapper.querySelector("#tab-help-safeguard");
        const tabShortcuts = wrapper.querySelector("#tab-help-shortcuts");
        const contentSafeguard = wrapper.querySelector(
          "#content-help-safeguard",
        );
        const contentShortcuts = wrapper.querySelector(
          "#content-help-shortcuts",
        );

        if (btnSafeguard) {
          tabSafeguard.className =
            "flex-1 py-2 text-xs font-bold rounded-lg bg-brand text-white transition cursor-pointer";
          tabShortcuts.className =
            "flex-1 py-2 text-xs font-bold rounded-lg text-secondary hover:text-color transition cursor-pointer";
          contentSafeguard.classList.remove("hidden");
          contentShortcuts.classList.add("hidden");
        } else {
          tabShortcuts.className =
            "flex-1 py-2 text-xs font-bold rounded-lg bg-brand text-white transition cursor-pointer";
          tabSafeguard.className =
            "flex-1 py-2 text-xs font-bold rounded-lg text-secondary hover:text-color transition cursor-pointer";
          contentShortcuts.classList.remove("hidden");
          contentSafeguard.classList.add("hidden");
        }
      }
    });
  },

  // ==========================================
  // CONFIRM MODAL LOGIC (Dynamic Body Injection)
  // ==========================================
  openConfirm({ title, message, onConfirm }) {
    this.closeConfirmModal();

    const confirmWrapper = document.createElement("div");
    confirmWrapper.id = "confirm-modal-wrapper";
    confirmWrapper.innerHTML = ConfirmModalComponent.render({ title, message });
    document.body.appendChild(confirmWrapper);

    this.confirmCallback = onConfirm;
    this.bindConfirmModalEvents(confirmWrapper);
  },

  closeConfirmModal() {
    const wrapper = document.getElementById("confirm-modal-wrapper");
    if (wrapper) {
      wrapper.remove();
    }
    this.confirmCallback = null;
  },

  bindConfirmModalEvents(wrapper) {
    wrapper.addEventListener("click", (e) => {
      // Cancel / Backdrop click
      if (
        e.target.closest("#btn-cancel-confirm") ||
        e.target.closest("#confirm-modal-backdrop")
      ) {
        e.preventDefault();
        e.stopPropagation();
        this.closeConfirmModal();
        return;
      }

      // Action Confirm click
      if (e.target.closest("#btn-action-confirm")) {
        e.preventDefault();
        e.stopPropagation();

        if (typeof this.confirmCallback === "function") {
          this.confirmCallback();
        }
        this.closeConfirmModal();
      }
    });
  },
};
