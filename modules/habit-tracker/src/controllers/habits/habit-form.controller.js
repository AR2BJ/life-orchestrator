import { GlobalLoaderService } from "@/services/loader.service";
import { HabitService } from "@/services/habit.service.js";
import { NotificationService } from "@/services/notification.service.js";
import { StateManager } from "@/models/state.model.js";

let pendingDeleteId = null;
let pendingEditId = null;

export function setPendingEditId(id) {
  pendingEditId = id;
}
export function setPendingDeleteId(id) {
  pendingDeleteId = id;
}

export const HabitFormController = {
  init(mainController) {
    this.mainController = mainController;
    this.bindFormEvents();
  },

  bindFormEvents() {
    const input = document.getElementById("habit-input");
    const addBtn = document.getElementById("add-habit-btn");
    const categorySelect = document.getElementById("habit-category-select");
    const frequencySelect = document.getElementById("habit-frequency-select");

    const addHabit = () => {
      const name = input.value;
      const category = categorySelect ? categorySelect.value : "General";
      const frequency = frequencySelect ? frequencySelect.value : 7;

      if (!name)
        NotificationService.show({
          type: "error",
          message: "Habit name cannot be empty.",
          icon: "fa-triangle-exclamation",
          iconColor: "text-red-500/80",
          duration: 5000,
        });

      if (!name.trim()) return;

      GlobalLoaderService.show(`Creating habit "${name}"...`);

      setTimeout(() => {
        try {
          const currentHabits = StateManager.getHabits();
          const updated = HabitService.createHabit(
            currentHabits,
            name,
            category,
            frequency,
          );
          StateManager.save(updated);

          input.value = "";
          categorySelect.value = "General";
          frequencySelect.value = "7";
          this.mainController.refreshUI();

          NotificationService.show({
            type: "success",
            message: `Habit "${name}" [${category}] created successfully!`,
            icon: "fa-check",
            iconColor: "text-emerald-500/80",
            duration: 5000,
          });
        } catch (error) {
          NotificationService.show({
            type: "error",
            message: error.message,
            icon: "fa-triangle-exclamation",
            iconColor: "text-red-500/80",
            duration: 5000,
          });
        } finally {
          GlobalLoaderService.hide();
        }
      }, 30);
    };

    addBtn?.addEventListener("click", addHabit);
    input?.addEventListener("keydown", (e) => {
      if (e.key === "Enter") addHabit();
    });

    document.addEventListener("keydown", (e) => {
      const deleteModal = document.getElementById("delete-modal");
      const editModal = document.getElementById("edit-modal");

      const deleteOpen =
        deleteModal && !deleteModal.classList.contains("hidden");
      const editOpen = editModal && !editModal.classList.contains("hidden");

      if (!deleteOpen && !editOpen) return;

      if (e.key === "Escape") {
        if (deleteOpen) this.mainController.toggleModal("delete-modal", false);
        if (editOpen) this.mainController.toggleModal("edit-modal", false);
      }

      if (e.key === "Enter") {
        if (deleteOpen) {
          document.getElementById("confirm-delete-btn")?.click();
          document.getElementById("confirm-delete")?.click();
        }
        if (editOpen) {
          document.getElementById("confirm-edit-btn")?.click();
          document.getElementById("confirm-edit")?.click();
        }
      }
    });

    const addClick = (id, cb) =>
      document.getElementById(id)?.addEventListener("click", cb);

    addClick("confirm-delete-btn", () => this.executeDelete());
    addClick("confirm-delete", () => this.executeDelete());
    addClick("cancel-delete-btn", () =>
      this.mainController.toggleModal("delete-modal", false),
    );
    addClick("cancel-delete", () =>
      this.mainController.toggleModal("delete-modal", false),
    );

    addClick("confirm-edit-btn", () => this.executeEdit());
    addClick("confirm-edit", () => this.executeEdit());
    addClick("cancel-edit-btn", () =>
      this.mainController.toggleModal("edit-modal", false),
    );
    addClick("cancel-edit", () =>
      this.mainController.toggleModal("edit-modal", false),
    );
  },

  executeDelete() {
    const id = pendingDeleteId;
    if (!id) return;

    const currentHabits = StateManager.getHabits();
    const habitToDelete = currentHabits.find((h) => h.id === id);

    if (habitToDelete) {
      const capturedHabit = { ...habitToDelete };

      GlobalLoaderService.show(
        `Purging "${capturedHabit.name}" from database layers...`,
      );

      setTimeout(() => {
        try {
          const updated = HabitService.deleteHabit(currentHabits, id);
          StateManager.save(updated);
          this.mainController.toggleModal("delete-modal", false);
          pendingDeleteId = null;
          this.mainController.refreshUI();

          NotificationService.show({
            type: "error",
            message: `Deleted "${capturedHabit.name}"`,
            duration: 5000,
            undoAction: () => {
              GlobalLoaderService.show("Re-instating deleted record...");
              setTimeout(() => {
                try {
                  const latestHabits = StateManager.getHabits();
                  StateManager.save([capturedHabit, ...latestHabits]);
                  this.mainController.refreshUI();
                } finally {
                  GlobalLoaderService.hide();
                }
              }, 30);
            },
          });
        } finally {
          GlobalLoaderService.hide();
        }
      }, 30);
    }
  },

  executeEdit() {
    const editInput = document.getElementById("edit-habit-input");

    if (!pendingEditId || !editInput) {
      NotificationService.show({
        type: "error",
        message: "Unable to edit habit. Please try again.",
        icon: "fa-triangle-exclamation",
        iconColor: "text-red-500/80",
        duration: 5000,
      });
      return;
    }

    const newName = editInput.value.trim();
    if (!newName) {
      NotificationService.show({
        type: "error",
        message: "Habit name cannot be empty.",
        icon: "fa-triangle-exclamation",
        iconColor: "text-red-500/80",
        duration: 5000,
      });
      return;
    }

    GlobalLoaderService.show("Re-indexing habit identifiers...");

    setTimeout(() => {
      try {
        const currentHabits = StateManager.getHabits();
        const updated = HabitService.editHabit(
          currentHabits,
          pendingEditId,
          newName,
        );

        StateManager.save(updated);
        this.mainController.toggleModal("edit-modal", false);
        pendingEditId = null;
        this.mainController.refreshUI();

        NotificationService.show({
          type: "success",
          message: `Habit renamed to "${newName}"`,
          icon: "fa-check",
          iconColor: "text-emerald-500/80",
          duration: 5000,
        });
      } catch (error) {
        NotificationService.show({
          type: "error",
          message: error.message,
          icon: "fa-triangle-exclamation",
          iconColor: "text-red-500/80",
          duration: 5000,
        });
      } finally {
        GlobalLoaderService.hide();
      }
    }, 30);
  },
};
