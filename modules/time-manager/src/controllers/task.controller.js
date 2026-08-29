import { ModalController } from "./modal.controller.js";
import { TaskService } from "@/services/task.service.js";

export const TaskController = {
  bindEvents() {
    document.addEventListener("click", (e) => {
      const btnSelect = e.target.closest("#btn-select-task");
      const boxEmpty = e.target.closest("#box-empty-task");

      if (btnSelect || boxEmpty) {
        ModalController.openTaskModal();
      }
    });
  },
};
