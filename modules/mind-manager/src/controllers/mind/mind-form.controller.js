import {
  BOOKMARK_CATEGORIES,
  CHEATSHEET_CATEGORIES,
  NOTE_CATEGORIES,
  SNIPPET_CATEGORIES,
} from "@/utils/constants/options-value.constants";
import { StateManager, state } from "@/models/state.model.js";
import {
  capitalize,
  generateId,
  mapTagIdsToObjects,
  processTagPipeline,
  syncTagEntityTypes,
} from "@/utils/helpers";

import { AutocompleteComponent } from "@/components/ui/autocomplete.component.js";
import { ComboboxComponent } from "@/components/ui/combobox.component.js";
import { EditModalsComponent } from "@/components/modals/edit-modals.component";
import { GlobalLoaderService } from "@/services/loader.service.js";
import { MindService } from "@/services/mind.service.js";
import { NotificationService } from "@/services/notification.service.js";

let pendingDeleteId = null;
let pendingEditId = null;
let editingItemId = null;

// Temporary state for CheatSheet Items inside Edit Modal
let activeModalCheatSheetItems = [];

// Category Autocompletes
let createNoteCategoryAutocomplete = null;
let createSnippetCategoryAutocomplete = null;
let createBookmarkCategoryAutocomplete = null;
let createCheatSheetCategoryAutocomplete = null;

let editNoteCategoryAutocomplete = null;
let editSnippetCategoryAutocomplete = null;
let editBookmarkCategoryAutocomplete = null;
let editCheatSheetCategoryAutocomplete = null;

// Tag Comboboxes
let createNoteTagCombobox = null;
let createSnippetTagCombobox = null;
let createBookmarkTagCombobox = null;
let createCheatSheetTagCombobox = null;

let editNoteTagCombobox = null;
let editSnippetTagCombobox = null;
let editBookmarkTagCombobox = null;
let editCheatSheetTagCombobox = null;

export function setPendingDeleteId(id) {
  pendingDeleteId = id;
}

export function setPendingEditId(id) {
  pendingEditId = id;
  if (id) {
    MindFormController.populateEditModal(id);
  }
}

export const MindFormController = {
  init(mainController) {
    this.mainController = mainController;

    this.setupCreateAutocompletes();
    this.setupCreateTagComboboxes();
    this.bindFormEvents();
    this.bindCheatsheetItemEvents();
    this.bindAccordionEvents();
  },

  refreshUI() {
    this.setupCreateAutocompletes();
    this.setupCreateTagComboboxes();
    this.updateAddButtonText();
    this.toggleFormTabFields();
  },

  updateAddButtonText() {
    const activeTab = StateManager.getActiveTab() || "notes";
    const btnTextSpan = document.getElementById("add-plan-btn-text");
    const toggleTitleSpan = document.getElementById("form-toggle-title");

    if (!btnTextSpan) return;

    if (activeTab === "notes") {
      btnTextSpan.textContent = "Add Note";
      if (toggleTitleSpan) toggleTitleSpan.textContent = "Create New Note";
    } else if (activeTab === "snippets") {
      btnTextSpan.textContent = "Add Snippet";
      if (toggleTitleSpan) toggleTitleSpan.textContent = "Create New Snippet";
    } else if (activeTab === "bookmarks") {
      btnTextSpan.textContent = "Add Bookmark";
      if (toggleTitleSpan) toggleTitleSpan.textContent = "Create New Bookmark";
    } else if (activeTab === "cheatsheets") {
      btnTextSpan.textContent = "Add CheatSheet";
      if (toggleTitleSpan)
        toggleTitleSpan.textContent = "Create New CheatSheet";
    }
  },

  toggleFormTabFields() {
    const activeTab = StateManager.getActiveTab() || "notes";
    const tabFields = document.querySelectorAll(
      ".mind-tab-fields, .mind-tab-field",
    );

    tabFields.forEach((fieldGroup) => {
      const fieldTabsAttr = fieldGroup.getAttribute("data-tab-fields") || "";
      const allowedTabs = fieldTabsAttr.split(",").map((t) => t.trim());

      if (allowedTabs.includes(activeTab)) {
        fieldGroup.classList.replace("hidden", "flex");
      } else {
        fieldGroup.classList.replace("flex", "hidden");
      }
    });

    this.updateAddButtonText();
  },

  setupCreateAutocompletes() {
    const noteCategoryContainer = document.getElementById(
      "create-note-category-autocomplete",
    );
    if (noteCategoryContainer) {
      if (createNoteCategoryAutocomplete)
        createNoteCategoryAutocomplete.destroy();
      createNoteCategoryAutocomplete = new AutocompleteComponent(
        noteCategoryContainer,
        NOTE_CATEGORIES,
        {
          label: "Category",
          itemTitle: "name",
          itemValue: "id",
          placeholder: "Select category...",
        },
      );
      createNoteCategoryAutocomplete.setValue("general");
    }

    const snippetLangContainer = document.getElementById(
      "create-snippet-category-autocomplete",
    );
    if (snippetLangContainer) {
      if (createSnippetCategoryAutocomplete)
        createSnippetCategoryAutocomplete.destroy();
      createSnippetCategoryAutocomplete = new AutocompleteComponent(
        snippetLangContainer,
        SNIPPET_CATEGORIES,
        {
          label: "Category",
          itemTitle: "name",
          itemValue: "id",
          placeholder: "Select category...",
        },
      );
      createSnippetCategoryAutocomplete.setValue("html");
    }

    const bookmarkCatContainer = document.getElementById(
      "create-bookmark-category-autocomplete",
    );
    if (bookmarkCatContainer) {
      if (createBookmarkCategoryAutocomplete)
        createBookmarkCategoryAutocomplete.destroy();
      createBookmarkCategoryAutocomplete = new AutocompleteComponent(
        bookmarkCatContainer,
        BOOKMARK_CATEGORIES,
        {
          label: "Category",
          itemTitle: "name",
          itemValue: "id",
          placeholder: "Select category...",
        },
      );
      createBookmarkCategoryAutocomplete.setValue("general");
    }

    const cheatCatContainer = document.getElementById(
      "create-cheatsheet-category-autocomplete",
    );
    if (cheatCatContainer) {
      if (createCheatSheetCategoryAutocomplete)
        createCheatSheetCategoryAutocomplete.destroy();
      createCheatSheetCategoryAutocomplete = new AutocompleteComponent(
        cheatCatContainer,
        CHEATSHEET_CATEGORIES,
        {
          label: "Category",
          itemTitle: "name",
          itemValue: "id",
          placeholder: "Select category...",
        },
      );
      createCheatSheetCategoryAutocomplete.setValue("general");
    }
  },

  setupCreateTagComboboxes() {
    const globalTags = StateManager.getState().tags || [];

    // Note Tags
    const noteTagContainer = document.getElementById(
      "create-note-tags-combobox",
    );
    if (noteTagContainer) {
      if (createNoteTagCombobox) createNoteTagCombobox.destroy();
      createNoteTagCombobox = new ComboboxComponent(
        noteTagContainer,
        globalTags,
        {
          label: "Tags",
          iconClass: "ti ti-tag text-brand/80",
          itemTitle: "name",
          itemValue: "id",
          placeholder: "Select or add tags...",
          allowCustom: true,
          multiple: true,
        },
      );
    }

    // Snippet Tags
    const snippetTagContainer = document.getElementById(
      "create-snippet-tags-combobox",
    );
    if (snippetTagContainer) {
      if (createSnippetTagCombobox) createSnippetTagCombobox.destroy();
      createSnippetTagCombobox = new ComboboxComponent(
        snippetTagContainer,
        globalTags,
        {
          label: "Tags",
          iconClass: "ti ti-tag text-brand/80",
          itemTitle: "name",
          itemValue: "id",
          placeholder: "Select or add tags...",
          allowCustom: true,
          multiple: true,
        },
      );
    }

    // Bookmark Tags
    const bookmarkTagContainer = document.getElementById(
      "create-bookmark-tags-combobox",
    );
    if (bookmarkTagContainer) {
      if (createBookmarkTagCombobox) createBookmarkTagCombobox.destroy();
      createBookmarkTagCombobox = new ComboboxComponent(
        bookmarkTagContainer,
        globalTags,
        {
          label: "Tags",
          iconClass: "ti ti-tag text-brand/80",
          itemTitle: "name",
          itemValue: "id",
          placeholder: "Select or add tags...",
          allowCustom: true,
          multiple: true,
        },
      );
    }

    // CheatSheet Tags
    const cheatTagContainer = document.getElementById(
      "create-cheatsheet-tags-combobox",
    );
    if (cheatTagContainer) {
      if (createCheatSheetTagCombobox) createCheatSheetTagCombobox.destroy();
      createCheatSheetTagCombobox = new ComboboxComponent(
        cheatTagContainer,
        globalTags,
        {
          label: "Tags",
          iconClass: "ti ti-tag text-brand/80",
          itemTitle: "name",
          itemValue: "id",
          placeholder: "Select or add tags...",
          allowCustom: true,
          multiple: true,
        },
      );
    }
  },

  bindAccordionEvents() {
    const accordionGroup = document.getElementById("edit-accordion-group");
    if (!accordionGroup) return;

    accordionGroup.addEventListener("click", (e) => {
      const header = e.target.closest(".accordion-header");
      if (!header) return;

      const currentItem = header.closest(".accordion-item");
      const currentContent = currentItem.querySelector(".accordion-content");

      // If already active/open, prevent closing it
      if (!currentContent.classList.contains("hidden")) return;

      const allItems = accordionGroup.querySelectorAll(".accordion-item");
      const currentIndex = Array.from(allItems).indexOf(currentItem);

      allItems.forEach((item, index) => {
        const content = item.querySelector(".accordion-content");
        const icon = item.querySelector(".accordion-icon");
        const itemHeader = item.querySelector(".accordion-header");

        if (index === currentIndex) {
          content.classList.remove("hidden");
        } else {
          content.classList.add("hidden");
        }

        itemHeader?.classList.toggle("border-b", index === currentIndex);
        icon?.classList.toggle("fa-chevron-up", index === currentIndex);
        icon?.classList.toggle("fa-chevron-down", index !== currentIndex);
      });
    });
  },

  resetAccordionToFirstItem() {
    const accordionGroup = document.getElementById("edit-accordion-group");
    if (!accordionGroup) return;

    const items = accordionGroup.querySelectorAll(".accordion-item");
    items.forEach((item, index) => {
      const header = item.querySelector(".accordion-header");
      const content = item.querySelector(".accordion-content");
      const icon = item.querySelector(".accordion-icon");

      if (index === 0) {
        content.classList.remove("hidden");
        header?.classList.add("border-b");
        if (icon) {
          icon.classList.remove("fa-chevron-down");
          icon.classList.add("fa-chevron-up");
        }
      } else {
        content.classList.add("hidden");
        header?.classList.remove("border-b");
        if (icon) {
          icon.classList.remove("fa-chevron-up");
          icon.classList.add("fa-chevron-down");
        }
      }
    });
  },

  renderModalCheatsheetItems() {
    const container = document.getElementById("cheatsheet-items-list");
    if (!container) return;

    if (activeModalCheatSheetItems.length === 0) {
      container.innerHTML = EditModalsComponent.renderEmptyState(
        "No cheatsheet items added yet.",
        "ti ti-list-check",
      );
      return;
    }

    container.innerHTML = `
      <div class="w-full flex flex-col gap-2 max-h-56 overflow-y-auto scrollbar-thin scrollbar-thumb-surface-2 pe-1">
        ${activeModalCheatSheetItems
          .map((item) => EditModalsComponent.renderCheatsheetItems(item))
          .join("")}
      </div>
    `;
  },

  handleSaveItem() {
    const keyInput = document.getElementById("new-cs-item-key");
    const valInput = document.getElementById("new-cs-item-val");
    const descInput = document.getElementById("new-cs-item-desc");

    if (!keyInput || !valInput) return;

    const key = keyInput?.value.trim();
    const value = valInput?.value.trim();
    const description = descInput?.value.trim();

    if (!key || !value) {
      NotificationService.show({
        type: "warning",
        message: "Items key or value is required",
        icon: "ti-alert-triangle",
      });
      return;
    }

    if (editingItemId) {
      const targetItem = activeModalCheatSheetItems.find(
        (i) => i.id === editingItemId,
      );
      if (targetItem) {
        targetItem.key = key;
        targetItem.value = value;
        targetItem.description = description;
      }
    } else {
      activeModalCheatSheetItems.push({
        id: generateId(),
        key,
        value,
        description,
      });
    }

    this.resetItemFormState();
    this.renderModalCheatsheetItems();
  },

  bindCheatsheetItemEvents() {
    const container = document.getElementById("cheatsheet-items-list");
    const keyInput = document.getElementById("new-cs-item-key");
    const valInput = document.getElementById("new-cs-item-val");
    const descInput = document.getElementById("new-cs-item-desc");
    const actionsContainer = document.getElementById("cs-form-actions");

    keyInput?.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        this.handleSaveItem();
      }
    });

    valInput?.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        this.handleSaveItem();
      }
    });

    actionsContainer?.addEventListener("click", (e) => {
      const addBtn = e.target.closest("#btn-add-cheatsheet-item");
      const saveBtn = e.target.closest("#btn-save-cheatsheet-item");
      const cancelBtn = e.target.closest("#btn-cancel-cheatsheet-item");

      if (addBtn || saveBtn) {
        e.preventDefault();
        this.handleSaveItem();
      } else if (cancelBtn) {
        e.preventDefault();
        this.resetItemFormState();
      }
    });

    container?.addEventListener("click", async (e) => {
      const target = e.target.closest("[data-action]");
      if (!target) return;

      const itemId = target.dataset.itemId;
      if (!itemId) return;

      const action = target.dataset.action;

      if (action === "copy-item") {
        const item = activeModalCheatSheetItems.find((i) => i.id === itemId);
        if (!item || !item.value) return;

        try {
          await navigator.clipboard.writeText(item.value);
          NotificationService.show({
            type: "success",
            message: "Value copied to clipboard",
            icon: "ti-copy",
            duration: 3000,
          });
        } catch (err) {
          NotificationService.show({
            type: "error",
            message: "Failed to copy value",
            icon: "ti-alert-triangle",
          });
        }
      } else if (action === "delete-item") {
        const targetIndex = activeModalCheatSheetItems.findIndex(
          (i) => i.id === itemId,
        );
        if (targetIndex === -1) return;

        const deletedItem = activeModalCheatSheetItems[targetIndex];
        activeModalCheatSheetItems.splice(targetIndex, 1);

        if (editingItemId === itemId) this.resetItemFormState();
        this.renderModalCheatsheetItems();

        NotificationService.show({
          type: "error",
          message: `Item deleted`,
          icon: "ti-trash",
          duration: 5000,
          undoAction: () => {
            activeModalCheatSheetItems.splice(targetIndex, 0, deletedItem);
            this.renderModalCheatsheetItems();
          },
        });
      } else if (action === "edit-item") {
        const item = activeModalCheatSheetItems.find((i) => i.id === itemId);
        if (!item) return;

        editingItemId = item.id;

        if (keyInput) keyInput.value = item.key;
        if (valInput) valInput.value = item.value;
        if (descInput) descInput.value = item.description;

        if (actionsContainer) {
          actionsContainer.innerHTML = `
          <div class="grid grid-cols-2 gap-2 w-full">
            <button
              id="btn-cancel-cheatsheet-item"
              type="button"
              class="h-10 rounded-xl bg-surface-2 border border-border text-secondary hover:text-color font-semibold text-xs lg:text-sm flex items-center justify-center transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              id="btn-save-cheatsheet-item"
              type="button"
              class="h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 text-blue-400 hover:bg-blue-600/30 font-semibold text-xs lg:text-sm flex items-center justify-center gap-1.5 transition cursor-pointer"
            >
              <i class="ti ti-device-floppy"></i> Save Item
            </button>
          </div>
        `;
        }

        keyInput?.focus();
      }
    });
  },

  resetItemFormState() {
    editingItemId = null;
    const keyInput = document.getElementById("new-cs-item-key");
    const valInput = document.getElementById("new-cs-item-val");
    const descInput = document.getElementById("new-cs-item-desc");
    const actionsContainer = document.getElementById("cs-form-actions");

    if (keyInput) keyInput.value = "";
    if (valInput) valInput.value = "";
    if (descInput) descInput.value = "";

    if (actionsContainer) {
      actionsContainer.innerHTML = `
        <button
          id="btn-add-cheatsheet-item"
          type="button"
          class="w-full h-10 rounded-xl bg-brand/10 text-brand/80 hover:bg-brand/20 font-semibold text-xs lg:text-sm flex items-center justify-center gap-1.5 transition cursor-pointer"
        >
          <i class="ti ti-plus text-base"></i>
          Add Items
        </button>
      `;
    }
  },

  populateEditModal(itemId) {
    this.toggleFormTabFields();
    this.resetAccordionToFirstItem();

    // Destroy existing autocompletes/comboboxes
    if (editNoteCategoryAutocomplete) editNoteCategoryAutocomplete.destroy();
    if (editSnippetCategoryAutocomplete)
      editSnippetCategoryAutocomplete.destroy();
    if (editBookmarkCategoryAutocomplete)
      editBookmarkCategoryAutocomplete.destroy();
    if (editCheatSheetCategoryAutocomplete)
      editCheatSheetCategoryAutocomplete.destroy();

    // Destroy existing Tag Comboboxes
    if (editNoteTagCombobox) editNoteTagCombobox.destroy();
    if (editSnippetTagCombobox) editSnippetTagCombobox.destroy();
    if (editBookmarkTagCombobox) editBookmarkTagCombobox.destroy();
    if (editCheatSheetTagCombobox) editCheatSheetTagCombobox.destroy();

    const activeTab = StateManager.getActiveTab() || "notes";
    const stateData = StateManager.getState();
    const globalTags = stateData.tags || [];

    let currentItem = null;
    if (activeTab === "notes") {
      currentItem = (stateData.notes || []).find(
        (n) => String(n.id) === String(itemId),
      );
    } else if (activeTab === "snippets") {
      currentItem = (stateData.snippets || []).find(
        (s) => String(s.id) === String(itemId),
      );
    } else if (activeTab === "bookmarks") {
      currentItem = (stateData.bookmarks || []).find(
        (b) => String(b.id) === String(itemId),
      );
    } else if (activeTab === "cheatsheets") {
      currentItem = (stateData.cheatsheets || []).find(
        (c) => String(c.id) === String(itemId),
      );
    }

    if (!currentItem) return;

    const titleInput = document.getElementById("edit-item-title");
    if (titleInput) titleInput.value = currentItem.title || "";

    const mappedTags = mapTagIdsToObjects(currentItem.tagIds || [], globalTags);

    if (activeTab === "notes") {
      const contentInput = document.getElementById("edit-note-content");
      const pinnedCheckbox = document.getElementById("edit-note-pinned");
      if (contentInput) contentInput.value = currentItem.content || "";
      if (pinnedCheckbox) pinnedCheckbox.checked = !!currentItem.pinned;

      const editNoteCatContainer = document.getElementById(
        "edit-note-category-autocomplete",
      );
      if (editNoteCatContainer) {
        editNoteCategoryAutocomplete = new AutocompleteComponent(
          editNoteCatContainer,
          NOTE_CATEGORIES,
          {
            label: "Category",
            itemTitle: "name",
            itemValue: "id",
            containerClass: "bg-surface!",
            placeholder: "Select category...",
          },
        );
        editNoteCategoryAutocomplete.setValue(
          currentItem.category || "general",
        );
      }

      const editNoteTagContainer = document.getElementById(
        "edit-note-tags-combobox",
      );
      if (editNoteTagContainer) {
        editNoteTagCombobox = new ComboboxComponent(
          editNoteTagContainer,
          globalTags,
          {
            label: "Tags",
            iconClass: "ti ti-tag text-brand/80",
            itemTitle: "name",
            itemValue: "id",
            containerClass: "bg-surface!",
            placeholder: "Select or add tags...",
            allowCustom: true,
            multiple: true,
          },
        );
        if (Array.isArray(currentItem.tagIds)) {
          mappedTags.forEach((tagObj) => {
            editNoteTagCombobox.selectItem(tagObj);
          });
        }
      }
    } else if (activeTab === "snippets") {
      const codeInput = document.getElementById("edit-snippet-code");
      const descInput = document.getElementById("edit-snippet-desc");
      const pinnedCheckbox = document.getElementById("edit-snippet-pinned");

      if (codeInput) codeInput.value = currentItem.code || "";
      if (descInput) descInput.value = currentItem.description || "";
      if (pinnedCheckbox) pinnedCheckbox.checked = !!currentItem.pinned;

      const editSnippetLangContainer = document.getElementById(
        "edit-snippet-category-autocomplete",
      );
      if (editSnippetLangContainer) {
        editSnippetCategoryAutocomplete = new AutocompleteComponent(
          editSnippetLangContainer,
          SNIPPET_CATEGORIES,
          {
            label: "Category",
            itemTitle: "name",
            itemValue: "id",
            containerClass: "bg-surface!",
            placeholder: "Select category...",
          },
        );
        editSnippetCategoryAutocomplete.setValue(
          currentItem.category || "html",
        );
      }

      const editSnippetTagContainer = document.getElementById(
        "edit-snippet-tags-combobox",
      );
      if (editSnippetTagContainer) {
        editSnippetTagCombobox = new ComboboxComponent(
          editSnippetTagContainer,
          globalTags,
          {
            label: "Tags",
            iconClass: "ti ti-tag text-brand/80",
            itemTitle: "name",
            itemValue: "id",
            containerClass: "bg-surface!",
            placeholder: "Select or add tags...",
            allowCustom: true,
            multiple: true,
          },
        );
        if (Array.isArray(currentItem.tagIds)) {
          mappedTags.forEach((tagObj) => {
            editSnippetTagCombobox.selectItem(tagObj);
          });
        }
      }
    } else if (activeTab === "bookmarks") {
      const urlInput = document.getElementById("edit-bookmark-url");
      const descInput = document.getElementById("edit-bookmark-desc");
      const pinnedCheckbox = document.getElementById("edit-bookmark-pinned");

      if (urlInput) urlInput.value = currentItem.url || "";
      if (descInput) descInput.value = currentItem.description || "";
      if (pinnedCheckbox) pinnedCheckbox.checked = !!currentItem.pinned;

      const editBookmarkCatContainer = document.getElementById(
        "edit-bookmark-category-autocomplete",
      );
      if (editBookmarkCatContainer) {
        editBookmarkCategoryAutocomplete = new AutocompleteComponent(
          editBookmarkCatContainer,
          BOOKMARK_CATEGORIES,
          {
            label: "Category",
            itemTitle: "name",
            itemValue: "id",
            containerClass: "bg-surface!",
            placeholder: "Select category...",
          },
        );
        editBookmarkCategoryAutocomplete.setValue(
          currentItem.category || "general",
        );
      }

      const editBookmarkTagContainer = document.getElementById(
        "edit-bookmark-tags-combobox",
      );
      if (editBookmarkTagContainer) {
        editBookmarkTagCombobox = new ComboboxComponent(
          editBookmarkTagContainer,
          globalTags,
          {
            label: "Tags",
            itemTitle: "name",
            iconClass: "ti ti-tag text-brand/80",
            itemValue: "id",
            placeholder: "Select or add tags...",
            containerClass: "bg-surface!",
            allowCustom: true,
            multiple: true,
          },
        );
        if (Array.isArray(currentItem.tagIds)) {
          mappedTags.forEach((tagObj) => {
            editBookmarkTagCombobox.selectItem(tagObj);
          });
        }
      }
    } else if (activeTab === "cheatsheets") {
      const descInput = document.getElementById("edit-cheatsheet-desc");
      const pinnedCheckbox = document.getElementById("edit-cheatsheet-pinned");

      if (descInput) descInput.value = currentItem.description || "";
      if (pinnedCheckbox) pinnedCheckbox.checked = !!currentItem.pinned;

      activeModalCheatSheetItems = JSON.parse(
        JSON.stringify(currentItem.items || []),
      );
      this.renderModalCheatsheetItems();

      const editCheatCatContainer = document.getElementById(
        "edit-cheatsheet-category-autocomplete",
      );
      if (editCheatCatContainer) {
        editCheatSheetCategoryAutocomplete = new AutocompleteComponent(
          editCheatCatContainer,
          CHEATSHEET_CATEGORIES,
          {
            label: "Category",
            itemTitle: "name",
            itemValue: "id",
            containerClass: "bg-surface!",
            placeholder: "Select category...",
          },
        );
        editCheatSheetCategoryAutocomplete.setValue(
          currentItem.category || "general",
        );
      }

      const editCheatTagContainer = document.getElementById(
        "edit-cheatsheet-tags-combobox",
      );
      if (editCheatTagContainer) {
        editCheatSheetTagCombobox = new ComboboxComponent(
          editCheatTagContainer,
          globalTags,
          {
            label: "Tags",
            iconClass: "ti ti-tag text-brand/80",
            itemTitle: "name",
            itemValue: "id",
            containerClass: "bg-surface!",
            placeholder: "Select or add tags...",
            allowCustom: true,
            multiple: true,
          },
        );
        if (Array.isArray(currentItem.tagIds)) {
          mappedTags.forEach((tagObj) => {
            editCheatSheetTagCombobox.selectItem(tagObj);
          });
        }
      }
    }
  },

  bindFormEvents() {
    this.updateAddButtonText();
    this.toggleFormTabFields();

    const titleInput = document.getElementById("create-item-title");
    const addBtn = document.getElementById("add-plan-btn");

    const handleCreateItem = () => {
      const activeTab = StateManager.getActiveTab() || "notes";

      GlobalLoaderService.show(`Creating item...`);

      setTimeout(() => {
        try {
          const currentStateData = StateManager.getState();
          const title = titleInput?.value.trim();

          if (activeTab === "notes") {
            const content =
              document.getElementById("create-note-content")?.value || "";
            const pinned =
              document.getElementById("create-note-pinned")?.checked || false;
            const category = createNoteCategoryAutocomplete
              ? createNoteCategoryAutocomplete.getValue()
              : "general";

            const rawSelectedTags = createNoteTagCombobox
              ? createNoteTagCombobox.getSelectedItems()
              : [];
            const currentGlobalTags = StateManager.getTags() || [];

            const { assignedTagIds, updatedGlobalTags } = processTagPipeline(
              rawSelectedTags,
              currentGlobalTags,
              "notes",
            );

            if (!title) {
              NotificationService.show({
                type: "error",
                message: "Note title cannot be empty",
                icon: "ti-alert-triangle",
                duration: 5000,
              });
              return;
            }

            const newNotePayload = {
              title,
              content,
              category,
              pinned,
              tagIds: assignedTagIds,
            };

            const updatedNotes = MindService.createNote(
              currentStateData.notes || [],
              newNotePayload,
            );
            StateManager.save({ tags: updatedGlobalTags, notes: updatedNotes });
          } else if (activeTab === "snippets") {
            const code =
              document.getElementById("create-snippet-code")?.value || "";
            const description =
              document.getElementById("create-snippet-desc")?.value || "";
            const pinned =
              document.getElementById("create-snippet-pinned")?.checked ||
              false;
            const category = createSnippetCategoryAutocomplete
              ? createSnippetCategoryAutocomplete.getValue()
              : "html";

            const rawSelectedTags = createSnippetTagCombobox
              ? createSnippetTagCombobox.getSelectedItems()
              : [];
            const currentGlobalTags = StateManager.getTags() || [];

            const { assignedTagIds, updatedGlobalTags } = processTagPipeline(
              rawSelectedTags,
              currentGlobalTags,
              "snippets",
            );

            if (!title || !code) {
              NotificationService.show({
                type: "error",
                message: "Snippet title or code cannot be empty",
                icon: "ti-alert-triangle",
                duration: 5000,
              });
              return;
            }

            const newSnippetPayload = {
              title,
              code,
              description,
              category,
              pinned,
              tagIds: assignedTagIds,
            };

            const updatedSnippets = MindService.createSnippet(
              currentStateData.snippets || [],
              newSnippetPayload,
            );

            StateManager.save({
              tags: updatedGlobalTags,
              snippets: updatedSnippets,
            });
          } else if (activeTab === "bookmarks") {
            const url =
              document.getElementById("create-bookmark-url")?.value || "";
            const description =
              document.getElementById("create-bookmark-desc")?.value || "";
            const pinned =
              document.getElementById("create-bookmark-pinned")?.checked ||
              false;
            const category = createBookmarkCategoryAutocomplete
              ? createBookmarkCategoryAutocomplete.getValue()
              : "general";

            const rawSelectedTags = createBookmarkTagCombobox
              ? createBookmarkTagCombobox.getSelectedItems()
              : [];
            const currentGlobalTags = StateManager.getTags() || [];

            const { assignedTagIds, updatedGlobalTags } = processTagPipeline(
              rawSelectedTags,
              currentGlobalTags,
              "bookmarks",
            );

            if (!title || !url) {
              NotificationService.show({
                type: "error",
                message: "Bookmark title or URL cannot be empty",
                icon: "ti-alert-triangle",
                duration: 5000,
              });
              return;
            }

            const newBookmarkPayload = {
              title,
              url,
              description,
              category,
              pinned,
              tagIds: assignedTagIds,
            };

            const updatedBookmarks = MindService.createBookmark(
              currentStateData.bookmarks || [],
              newBookmarkPayload,
            );
            StateManager.save({
              tags: updatedGlobalTags,
              bookmarks: updatedBookmarks,
            });
          } else if (activeTab === "cheatsheets") {
            const description =
              document.getElementById("create-cheatsheet-desc")?.value || "";
            const pinned =
              document.getElementById("create-cheatsheet-pinned")?.checked ||
              false;
            const category = createCheatSheetCategoryAutocomplete
              ? createCheatSheetCategoryAutocomplete.getValue()
              : "general";

            const rawSelectedTags = createCheatSheetTagCombobox
              ? createCheatSheetTagCombobox.getSelectedItems()
              : [];
            const currentGlobalTags = StateManager.getTags() || [];

            const { assignedTagIds, updatedGlobalTags } = processTagPipeline(
              rawSelectedTags,
              currentGlobalTags,
              "cheatsheets",
            );

            if (!title) {
              NotificationService.show({
                type: "error",
                message: "Cheatsheet title cannot be empty",
                icon: "ti-alert-triangle",
                duration: 5000,
              });
              return;
            }

            const newCheatSheetPayload = {
              title,
              description,
              category,
              pinned,
              tagIds: assignedTagIds,
            };

            const updatedCheatSheets = MindService.createCheatSheet(
              currentStateData.cheatsheets || [],
              newCheatSheetPayload,
            );
            StateManager.save({
              tags: updatedGlobalTags,
              cheatsheets: updatedCheatSheets,
            });
          }

          this.resetForms();

          this.mainController.refreshUI();

          const type = activeTab.slice(0, activeTab.length - 1);

          NotificationService.show({
            type: "success",
            message: `${capitalize(type)} "${title}" created successfully!`,
            icon: "ti-check",
            duration: 5000,
          });
        } catch (error) {
          NotificationService.show({
            type: "error",
            message: error.message || "Failed to create item",
            icon: "ti-alert-triangle",
            duration: 5000,
          });
        } finally {
          GlobalLoaderService.hide();
        }
      }, 30);
    };

    addBtn?.addEventListener("click", handleCreateItem);

    titleInput?.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleCreateItem();
      }
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

      if (e.key === "Enter" && e.ctrlKey) {
        if (deleteOpen) this.executeDelete();
        if (editOpen) this.executeEdit();
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

    addClick("confirm-edit", () => this.executeEdit());
    addClick("cancel-edit", () =>
      this.mainController.toggleModal("edit-modal", false),
    );
    addClick("cancel-edit-modal", () =>
      this.mainController.toggleModal("edit-modal", false),
    );
  },

  resetForms() {
    const inputsToClear = [
      "create-item-title",
      "create-note-content",
      "create-snippet-code",
      "create-snippet-desc",
      "create-bookmark-url",
      "create-bookmark-desc",
      "create-cheatsheet-desc",
    ];
    inputsToClear.forEach((id) => {
      const el = document.getElementById(id);
      if (el) el.value = "";
    });

    const checkboxesToReset = ["create-note-pinned", "create-snippet-pinned"];
    checkboxesToReset.forEach((id) => {
      const el = document.getElementById(id);
      if (el) el.checked = false;
    });

    if (createNoteTagCombobox) createNoteTagCombobox.clear();
    if (createSnippetTagCombobox) createSnippetTagCombobox.clear();
    if (createBookmarkTagCombobox) createBookmarkTagCombobox.clear();
    if (createCheatSheetTagCombobox) createCheatSheetTagCombobox.clear();
  },

  executeDelete() {
    const id = pendingDeleteId;
    if (!id) return;

    const activeTab = StateManager.getActiveTab() || "notes";
    const stateData = StateManager.getState();

    let list = [];
    if (activeTab === "notes") list = stateData.notes || [];
    else if (activeTab === "snippets") list = stateData.snippets || [];
    else if (activeTab === "bookmarks") list = stateData.bookmarks || [];
    else if (activeTab === "cheatsheets") list = stateData.cheatsheets || [];

    const itemToDelete = list.find((item) => String(item.id) === String(id));

    if (itemToDelete) {
      GlobalLoaderService.show(`Deleting item...`);
      setTimeout(() => {
        try {
          if (activeTab === "notes") {
            const notes = MindService.deleteNote(stateData.notes || [], id);
            StateManager.save({ notes });
          } else if (activeTab === "snippets") {
            const snippets = MindService.deleteSnippet(
              stateData.snippets || [],
              id,
            );
            StateManager.save({ snippets });
          } else if (activeTab === "bookmarks") {
            const bookmarks = MindService.deleteBookmark(
              stateData.bookmarks || [],
              id,
            );
            StateManager.save({ bookmarks });
          } else if (activeTab === "cheatsheets") {
            const cheatsheets = MindService.deleteCheatSheet(
              stateData.cheatsheets || [],
              id,
            );
            StateManager.save({ cheatsheets });
          }

          if (this.mainController?.toggleModal)
            this.mainController.toggleModal("delete-modal", false);
          pendingDeleteId = null;

          if (this.mainController?.refreshUI) this.mainController.refreshUI();

          NotificationService.show({
            type: "error",
            message: `Item deleted successfully`,
            icon: "ti-trash",
            duration: 5000,
            undoAction: () => {
              const restoredState = StateManager.getState();
              if (activeTab === "notes") {
                StateManager.save({
                  notes: [itemToDelete, ...(restoredState.notes || [])],
                });
              } else if (activeTab === "snippets") {
                StateManager.save({
                  snippets: [itemToDelete, ...(restoredState.snippets || [])],
                });
              } else if (activeTab === "bookmarks") {
                StateManager.save({
                  bookmarks: [itemToDelete, ...(restoredState.bookmarks || [])],
                });
              } else if (activeTab === "cheatsheets") {
                StateManager.save({
                  cheatsheets: [
                    itemToDelete,
                    ...(restoredState.cheatsheets || []),
                  ],
                });
              }
              if (this.mainController?.refreshUI)
                this.mainController.refreshUI();
            },
          });
        } finally {
          GlobalLoaderService.hide();
        }
      }, 30);
    }
  },

  executeEdit() {
    if (!pendingEditId) return;

    const activeTab = StateManager.getActiveTab() || "notes";
    const titleInput = document.getElementById("edit-item-title");

    GlobalLoaderService.show("Updating record...");

    setTimeout(() => {
      try {
        const title = titleInput?.value.trim();

        const stateData = StateManager.getState();
        const currentGlobalTags = StateManager.getTags() || [];

        if (activeTab === "notes") {
          const rawSelectedTags = editNoteTagCombobox
            ? editNoteTagCombobox.getSelectedItems()
            : [];

          const { updatedGlobalTags, assignedTagIds } = processTagPipeline(
            rawSelectedTags,
            currentGlobalTags,
            "notes",
          );

          if (!title) {
            NotificationService.show({
              type: "error",
              message: "Note title cannot be empty",
              icon: "ti-alert-triangle",
              duration: 5000,
            });
            return;
          }

          const updatedNotes = MindService.editNote(
            stateData.notes || [],
            pendingEditId,
            {
              title: titleInput?.value,
              content: document.getElementById("edit-note-content")?.value,
              pinned: document.getElementById("edit-note-pinned")?.checked,
              category: editNoteCategoryAutocomplete
                ? editNoteCategoryAutocomplete.getValue()
                : "general",
              tagIds: assignedTagIds,
            },
          );

          const cleanedGlobalTags = syncTagEntityTypes(
            updatedGlobalTags,
            "notes",
            updatedNotes,
          );

          StateManager.save({ tags: cleanedGlobalTags, notes: updatedNotes });
        } else if (activeTab === "snippets") {
          const rawSelectedTags = editSnippetTagCombobox
            ? editSnippetTagCombobox.getSelectedItems()
            : [];

          const { updatedGlobalTags, assignedTagIds } = processTagPipeline(
            rawSelectedTags,
            currentGlobalTags,
            "snippets",
          );

          if (!title || !document.getElementById("edit-snippet-code")?.value) {
            NotificationService.show({
              type: "error",
              message: "Snippet title or code cannot be empty",
              icon: "ti-alert-triangle",
              duration: 5000,
            });
            return;
          }

          const updatedSnippets = MindService.editSnippet(
            stateData.snippets || [],
            pendingEditId,
            {
              title: titleInput?.value,
              code: document.getElementById("edit-snippet-code")?.value,
              description: document.getElementById("edit-snippet-desc")?.value,
              pinned: document.getElementById("edit-snippet-pinned")?.checked,
              category: editSnippetCategoryAutocomplete
                ? editSnippetCategoryAutocomplete.getValue()
                : "html",
              tagIds: assignedTagIds,
            },
          );

          const cleanedGlobalTags = syncTagEntityTypes(
            updatedGlobalTags,
            "snippets",
            updatedSnippets,
          );

          StateManager.save({
            tags: cleanedGlobalTags,
            snippets: updatedSnippets,
          });
        } else if (activeTab === "bookmarks") {
          const rawSelectedTags = editBookmarkTagCombobox
            ? editBookmarkTagCombobox.getSelectedItems()
            : [];

          const { updatedGlobalTags, assignedTagIds } = processTagPipeline(
            rawSelectedTags,
            currentGlobalTags,
            "bookmarks",
          );

          if (!title || !document.getElementById("edit-bookmark-url")?.value) {
            NotificationService.show({
              type: "error",
              message: "Bookmark title or URL cannot be empty",
              icon: "ti-alert-triangle",
              duration: 5000,
            });
            return;
          }

          const updatedBookmarks = MindService.editBookmark(
            stateData.bookmarks || [],
            pendingEditId,
            {
              title: titleInput?.value,
              url: document.getElementById("edit-bookmark-url")?.value,
              description: document.getElementById("edit-bookmark-desc")?.value,
              pinned: document.getElementById("edit-bookmark-pinned")?.checked,
              category: editBookmarkCategoryAutocomplete
                ? editBookmarkCategoryAutocomplete.getValue()
                : "general",
              tagIds: assignedTagIds,
            },
          );

          const cleanedGlobalTags = syncTagEntityTypes(
            updatedGlobalTags,
            "bookmarks",
            updatedBookmarks,
          );

          StateManager.save({
            tags: cleanedGlobalTags,
            bookmarks: updatedBookmarks,
          });
        } else if (activeTab === "cheatsheets") {
          const rawSelectedTags = editCheatSheetTagCombobox
            ? editCheatSheetTagCombobox.getSelectedItems()
            : [];

          const { updatedGlobalTags, assignedTagIds } = processTagPipeline(
            rawSelectedTags,
            currentGlobalTags,
            "cheatsheets",
          );

          if (!title) {
            NotificationService.show({
              type: "error",
              message: "Cheatsheet title cannot be empty",
              icon: "ti-alert-triangle",
              duration: 5000,
            });
            return;
          }

          const updatedCheatSheets = MindService.editCheatSheet(
            stateData.cheatsheets || [],
            pendingEditId,
            {
              title: titleInput?.value,
              description: document.getElementById("edit-cheatsheet-desc")
                ?.value,
              pinned: document.getElementById("edit-cheatsheet-pinned")
                ?.checked,
              category: editCheatSheetCategoryAutocomplete
                ? editCheatSheetCategoryAutocomplete.getValue()
                : "general",
              items: activeModalCheatSheetItems,
              tagIds: assignedTagIds,
            },
          );

          const cleanedGlobalTags = syncTagEntityTypes(
            updatedGlobalTags,
            "cheatsheets",
            updatedCheatSheets,
          );

          StateManager.save({
            tags: cleanedGlobalTags,
            cheatsheets: updatedCheatSheets,
          });
        }

        if (this.mainController?.toggleModal) {
          this.mainController.toggleModal("edit-modal", false);
        }

        pendingEditId = null;

        if (this.mainController?.refreshUI) {
          this.mainController.refreshUI();
        }

        NotificationService.show({
          type: "success",
          message: `Record updated successfully!`,
          icon: "ti-check",
          duration: 5000,
        });
      } catch (error) {
        NotificationService.show({
          type: "error",
          message: error.message || "Failed to update item",
          icon: "ti-alert-triangle",
          duration: 5000,
        });
      } finally {
        GlobalLoaderService.hide();
      }
    }, 30);
  },
};
