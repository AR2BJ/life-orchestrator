import { StateManager, state } from "./state.model.js";

import { CoreStore } from "@life-orchestrator/core-store";

const MIND_NAMESPACE = "mind_manager";

export const NoteModel = {
  getNotes() {
    const data = CoreStore.getNamespace(MIND_NAMESPACE);
    return data?.notes || [];
  },

  getItems() {
    return this.getNotes();
  },

  getById(noteId) {
    const data = CoreStore.getNamespace(MIND_NAMESPACE);

    const targetIdStr = String(noteId);
    return (
      (data?.notes || [])?.find((t) => String(t.id) === targetIdStr) || null
    );
  },

  setItems(items = []) {
    const data = CoreStore.getNamespace(MIND_NAMESPACE);

    const notes = Array.isArray(items)
      ? [...(data?.notes || []), ...items]
      : [];

    this.commit(notes);
  },

  insert(noteData) {
    const data = CoreStore.getNamespace(MIND_NAMESPACE);

    if (!data?.notes)
      CoreStore.setNamespace(MIND_NAMESPACE, { ...data, notes: [] });

    const notes = [...(data?.notes || [])];

    notes.push(noteData);

    this.commit(notes);
    return noteData;
  },

  insertAt(noteData, index) {
    const data = CoreStore.getNamespace(MIND_NAMESPACE);

    if (!data?.notes)
      CoreStore.setNamespace(MIND_NAMESPACE, { ...data, notes: [] });

    const notes = (data?.notes || []).toSpliced(index, 0, noteData);

    this.commit(notes);
  },

  remove(noteId) {
    const data = CoreStore.getNamespace(MIND_NAMESPACE);

    if (!data?.notes) return;

    let notes = [...(data?.notes || [])];

    const targetIdStr = String(noteId);
    const index = (notes || []).findIndex((n) => String(n.id) === targetIdStr);
    if (index === -1) return null;

    const [deletedNote] = notes.splice(index, 1);

    this.commit(notes);

    return { deletedNote, index };
  },

  deleteItem(noteId) {
    return this.remove(noteId);
  },

  commit(notes = []) {
    const data = CoreStore.getNamespace(MIND_NAMESPACE);

    CoreStore.setNamespace(MIND_NAMESPACE, { ...data, notes });

    StateManager.save();
  },

  subscribe(listener) {
    return StateManager.subscribe(listener);
  },

  reset() {
    state.notes = [];
    this.commit();
  },
};
