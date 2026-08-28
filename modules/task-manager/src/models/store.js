import { StateManager } from "./state.model.js";

export const store = {
  get tasks() {
    return StateManager.getTasks();
  },
  set tasks(value) {
    StateManager.save(value, StateManager.getTags());
  },
  get tags() {
    return StateManager.getTags();
  },
  set tags(value) {
    StateManager.save(StateManager.getTasks(), value);
  },
};
