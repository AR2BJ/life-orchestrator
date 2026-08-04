import { AutocompleteComponent } from "@/components/ui/autocomplete.component";
import { GlobalLoaderService } from "@/services/loader.service";
import { HabitService } from "@/services/habit.service.js";
import { NotificationService } from "@/services/notification.service.js";
import { StateManager } from "@/models/state.model.js";

let pendingDeleteId = null;
let pendingEditId = null;

// Autocomplete instances (Create Form)
let createCategoryAutocomplete = null;
let createFrequencyAutocomplete = null;

// Autocomplete instances (Edit Form)
let editCategoryAutocomplete = null;
let editFrequencyAutocomplete = null;

const CATEGORY_OPTIONS = [
  {
    title: "General & Miscellaneous",
    value: "general",
    icon: "fa-solid fa-folders text-yellow-500/80",
  },
  {
    title: "Health & Bio-Maintenance",
    value: "health",
    icon: "fa-solid fa-apple-whole text-emerald-500/80",
  },
  {
    title: "Work & Production Development",
    value: "work",
    icon: "fa-solid fa-laptop-code text-cyan-500/80",
  },
  {
    title: "Research & Deep Dive (Thesis/Next-Gen Tech)",
    value: "research",
    icon: "fa-solid fa-microscope text-violet-500/80",
  },
  {
    title: "Academics & Advanced Knowledge",
    value: "academics",
    icon: "fa-solid fa-graduation-cap text-pink-500/80",
  },
  {
    title: "Open Source & Side Projects",
    value: "openSource",
    icon: "fa-solid fa-code-branch text-lime-500/80",
  },
  {
    title: "System Design & Soft Skills",
    value: "systemDesign",
    icon: "fa-solid fa-diagram-project text-blue-500/80",
  },
  {
    title: "Digital Detox & Reset",
    value: "digitalDetox",
    icon: "fa-solid fa-person-meditating text-fuchsia-500/80",
  },
  {
    title: "Daily Routines & Workflow",
    value: "routine",
    icon: "fa-solid fa-calendar-check text-orange-500/80",
  },
  {
    title: "Harmful Habits",
    value: "harmful",
    icon: "fa-solid fa-smoking text-red-500/80",
  },
];

const FREQUENCY_OPTIONS = [
  {
    title: "Everyday (7 days/wk)",
    value: 7,
    icon: "fa-solid fa-square-7 text-brand text-lg!",
  },
  {
    title: "High Intensity (6 days/wk)",
    value: 6,
    icon: "fa-solid fa-square-6 text-brand/80 text-lg!",
  },
  {
    title: "Workweek Pace (5 days/wk)",
    value: 5,
    icon: "fa-solid fa-square-5 text-brand/70 text-lg!",
  },
  {
    title: "Consistent (4 days/wk)",
    value: 4,
    icon: "fa-solid fa-square-4 text-brand/60 text-lg!",
  },
  {
    title: "Flexible Routine (3 days/wk)",
    value: 3,
    icon: "fa-solid fa-square-3 text-brand/50 text-lg!",
  },
  {
    title: "Intermittent (2 days/wk)",
    value: 2,
    icon: "fa-solid fa-square-2 text-brand/40 text-lg!",
  },
  {
    title: "Minimal Focus (1 day/wk)",
    value: 1,
    icon: "fa-solid fa-square-1 text-brand/30 text-lg!",
  },
];

export function setPendingDeleteId(id) {
  pendingDeleteId = id;
}

export function setPendingEditId(id) {
  pendingEditId = id;
  if (id) {
    HabitFormController.populateEditModal(id);
  }
}

export const HabitFormController = {
  init(mainController) {
    this.mainController = mainController;

    this.setupCreateAutocompletes();
    this.bindFormEvents();
  },

  setupCreateAutocompletes() {
    const categoryWrapper = document.getElementById("create-category-wrapper");
    const frequencyWrapper = document.getElementById(
      "create-frequency-wrapper",
    );

    if (categoryWrapper) {
      createCategoryAutocomplete = new AutocompleteComponent(
        categoryWrapper,
        CATEGORY_OPTIONS,
        {
          label: "Category",
          placeholder: "Select Category...",
          itemTitle: "title",
          itemValue: "value",
          itemIcon: "icon",
        },
      );

      createCategoryAutocomplete.setValue("general");
    }

    if (frequencyWrapper) {
      createFrequencyAutocomplete = new AutocompleteComponent(
        frequencyWrapper,
        FREQUENCY_OPTIONS,
        {
          label: "Days per week",
          placeholder: "Select Days per week...",
          itemTitle: "title",
          itemValue: "value",
          itemIcon: "icon",
        },
      );
      // Set default value
      createFrequencyAutocomplete.setValue(7);
    }
  },

  populateEditModal(habitId) {
    if (editCategoryAutocomplete) {
      editCategoryAutocomplete.destroy();
      editCategoryAutocomplete = null;
    }
    if (editFrequencyAutocomplete) {
      editFrequencyAutocomplete.destroy();
      editFrequencyAutocomplete = null;
    }

    const habit = StateManager.getHabits().find((h) => h.id === habitId);

    if (!habit) return;

    const titleInput = document.getElementById("edit-habit-title");
    const descInput = document.getElementById("edit-habit-desc");

    if (titleInput) titleInput.value = habit.name || "";
    if (descInput) descInput.value = habit.description || "";

    const categoryWrapper = document.getElementById("edit-category-wrapper");
    const frequencyWrapper = document.getElementById("edit-frequency-wrapper");

    if (categoryWrapper) {
      editCategoryAutocomplete = new AutocompleteComponent(
        categoryWrapper,
        CATEGORY_OPTIONS,
        {
          label: "Category",
          placeholder: "Select Category...",
          itemTitle: "title",
          itemValue: "value",
          itemIcon: "icon",
        },
      );
      if (habit.category) {
        editCategoryAutocomplete.setValue(habit.category);
      }
    }

    if (frequencyWrapper) {
      editFrequencyAutocomplete = new AutocompleteComponent(
        frequencyWrapper,
        FREQUENCY_OPTIONS,
        {
          label: "Days per week",
          placeholder: "Select Days per week...",
          itemTitle: "title",
          itemValue: "value",
          itemIcon: "icon",
        },
      );
      if (habit.frequency) {
        editFrequencyAutocomplete.setValue(habit.frequency);
      }
    }
  },

  bindFormEvents() {
    const input = document.getElementById("habit-input");
    const addBtn = document.getElementById("add-habit-btn");

    const addHabit = () => {
      const name = input.value;
      const category = createCategoryAutocomplete
        ? createCategoryAutocomplete.getValue()
        : "general";
      const frequency = createFrequencyAutocomplete
        ? createFrequencyAutocomplete.getValue()
        : 7;

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

          const newHabitPayload = {
            name,
            category,
            frequency,
          };

          const updatedHabits = HabitService
            ? HabitService.createHabit(currentHabits, newHabitPayload)
            : [newHabitPayload, ...currentHabits];

          StateManager.save(updatedHabits);

          if (input) input.value = "";
          createCategoryAutocomplete?.setValue("general");
          createFrequencyAutocomplete?.setValue(7);
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
      if (e.ctrlKey && e.key === "Enter") addHabit();
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

      if (e.ctrlKey && e.key === "Enter") {
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
    addClick("cancel-edit-modal", () =>
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

    if (!pendingEditId || !editInput) return;

    const newName = editInput.value.trim();
    if (!newName) {
      NotificationService.show({
        type: "error",
        message: "Habit name cannot be empty.",
        icon: "fa-triangle-exclamation",
        duration: 5000,
      });
      return;
    }

    const editCategory = editCategoryAutocomplete?.getValue();
    const editFrequency = editFrequencyAutocomplete?.getValue();

    GlobalLoaderService.show("Re-indexing habit identifiers...");

    setTimeout(() => {
      try {
        const currentHabits = StateManager.getHabits();

        const updatedHabitData = {
          title: newName,
          category: editCategory || "general",
          frequency: editFrequency || 7,
        };

        const updated = HabitService.editHabit(
          currentHabits,
          pendingEditId,
          updatedHabitData,
        );

        StateManager.save(updated);
        this.mainController.toggleModal("edit-modal", false);

        if (editCategoryAutocomplete) {
          editCategoryAutocomplete.destroy();
          editCategoryAutocomplete = null;
        }
        if (editFrequencyAutocomplete) {
          editFrequencyAutocomplete.destroy();
          editFrequencyAutocomplete = null;
        }

        pendingEditId = null;
        this.mainController.refreshUI();

        NotificationService.show({
          type: "success",
          message: "Habit edited successfully!",
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
