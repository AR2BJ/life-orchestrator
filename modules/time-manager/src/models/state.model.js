import { CoreStore, ROOT_KEY } from "@life-orchestrator/core-store";
import { SOUND_STATE, SoundModel, stateSound } from "./sound.model.js";
import { TIME_MANAGER_EVENTS, eventBus } from "@/services/event-bus.service.js";
import {
  TIME_NAMESPACE,
  loadFromStorage,
  saveToStorage,
} from "./storage.model.js";
import { formatDate, generateId, todayISO } from "@/utils/helpers.js";

import { NoteModel } from "./note.model.js";
import { TaskModel } from "./task.model.js";

export const TASK_NAMESPACE = "task_manager";
export const MIND_NAMESPACE = "mind_manager";

export const MIN_SESSION_SECONDS = 15 * 60;

export const DEFAULT_SETTINGS = {
  pomodoroWorkTime: 25,
  shortBreakTime: 5,
  longBreakTime: 15,
  longBreakInterval: 4,
  autoStartBreaks: false,
  autoStartPomodoros: false,
  disableBreaks: false,
  flowBreakTime: 15,
  autoStartFlowBreaks: false,
  volume: 50,
  pomodoroEndSound: "none",
  breakEndSound: "none",
  currentSoundId: "none",
  notificationSound: true,
};

export const state = {
  currentView: "timer",
  activeTaskId: null,
  activeMode: "pomodoro",
  timer: {
    isRunning: false,
    isPaused: false,
    timeRemaining: 25 * 60,
    duration: 25 * 60,
    flowTime: 0,
    pomodoroSessionCount: 0,
    currentPhase: "work",
  },
  currentSessionInterruptions: 0,
  sessions: [],
  settings: { ...DEFAULT_SETTINGS },
};

const listeners = new Set();

const taskData = CoreStore.getNamespace(TASK_NAMESPACE);

const noteData = CoreStore.getNamespace(MIND_NAMESPACE);

export const StateManager = {
  _rawCache: {},

  init() {
    this.reloadFromStorage(false);
    this.setupReactiveEngine();
    return state;
  },

  reloadFromStorage(notify = true) {
    const saved = loadFromStorage();

    if (saved) {
      state.activeMode = saved.activeMode || "pomodoro";
      state.sessions = saved.sessions || [];
      state.activeTaskId = saved.activeTaskId
        ? String(saved.activeTaskId)
        : null;
      state.settings = {
        ...DEFAULT_SETTINGS,
        ...saved.settings,
        pomodoroEndSound:
          saved.settings.pomodoroEndSound ?? DEFAULT_SETTINGS.pomodoroEndSound,
        breakEndSound:
          saved.settings.breakEndSound ?? DEFAULT_SETTINGS.breakEndSound,
        longBreakInterval:
          Number(saved.settings.longBreakInterval) ||
          DEFAULT_SETTINGS.longBreakInterval,
      };
      state.currentSessionInterruptions = 0;
      state.timer = { ...state.timer, ...saved.timer };
    } else {
      state.currentView = "timer";
      state.activeTaskId = null;
      state.activeMode = "pomodoro";
      state.sessions = [];
      state.settings = { ...DEFAULT_SETTINGS };
      state.currentSessionInterruptions = 0;
      state.timer = {
        isRunning: false,
        isPaused: false,
        timeRemaining: 25 * 60,
        duration: 25 * 60,
        flowTime: 0,
        pomodoroSessionCount: 0,
        currentPhase: "work",
      };
      SoundModel.reset();
    }

    if (
      state.activeTaskId &&
      Array.isArray(taskData?.tasks) &&
      taskData?.tasks.length > 0
    ) {
      const exists = taskData?.tasks.some(
        (t) => String(t.id) === String(state.activeTaskId),
      );

      if (!exists) {
        const firstValid = taskData?.tasks.find((t) => t.status !== "done");
        state.activeTaskId = firstValid ? String(firstValid.id) : null;
      }
    }

    this._rawCache = CoreStore.getNamespace(TIME_NAMESPACE) || {};

    if (notify) {
      this.notify();
      this.dispatchStateEvents();
    }
  },

  dispatchStateEvents() {
    eventBus.emit(TIME_MANAGER_EVENTS.TASKS_CHANGED);
    eventBus.emit(TIME_MANAGER_EVENTS.NOTES_CHANGED);
    eventBus.emit(TIME_MANAGER_EVENTS.SESSIONS_CHANGED);
    eventBus.emit(TIME_MANAGER_EVENTS.SETTINGS_CHANGED);
    eventBus.emit(TIME_MANAGER_EVENTS.TIMER_CHANGED);

    const currentSoundId = state.settings.currentSoundId || "none";
    const volume = state.settings.volume ?? 50;

    eventBus.emit(TIME_MANAGER_EVENTS.SOUND_TRACK_CHANGED, currentSoundId);
    eventBus.emit(TIME_MANAGER_EVENTS.SOUND_VOLUME_CHANGED, volume);
    eventBus.emit(TIME_MANAGER_EVENTS.SOUND_CHANGED, {
      currentSoundId,
      volume,
      soundState: SoundModel.getState(),
    });

    eventBus.emit(TIME_MANAGER_EVENTS.STORE_CHANGED, state);
  },

  setupReactiveEngine() {
    window.addEventListener("storage", (event) => {
      if (event.key === ROOT_KEY) {
        try {
          this.reloadFromStorage(true);
        } catch (error) {
          console.error("Error syncing cross-tab storage:", error);
        }
      }
    });
  },

  getState() {
    return state;
  },

  subscribe(listener) {
    if (typeof listener === "function") {
      listeners.add(listener);
    }
    return () => listeners.delete(listener);
  },

  notify() {
    listeners.forEach((listener) => listener(state));
  },

  setView(view) {
    state.currentView = view;
    this.notify();
  },

  setMode(mode) {
    if (state.activeMode === mode) return;
    state.activeMode = mode;

    if (mode === "pomodoro") {
      state.timer.currentPhase = "work";
    } else if (mode === "flow") {
      state.timer.currentPhase = "work";
    }

    this.save();
    this.notify();
  },

  getTodaySessions() {
    const today = todayISO();
    return state.sessions.filter((session) => {
      const sessionDate = formatDate(session.completedAt);
      return sessionDate === today;
    });
  },

  getTodayOverview() {
    const todaySessions = this.getTodaySessions();
    const sessionsDone = todaySessions.length;
    const totalSeconds = todaySessions.reduce(
      (acc, s) => acc + (s.durationSeconds || 0),
      0,
    );
    const totalMinutes = Math.round(totalSeconds / 60);

    return { sessionsDone, totalMinutes };
  },

  updateTimerState(newTimerState, { silent = false } = {}) {
    state.timer = { ...state.timer, ...newTimerState };

    if (!silent) {
      this.save();
    } else {
      this.notify();
    }
  },

  addInterruption() {
    state.currentSessionInterruptions += 1;
    this.save();
  },

  updateSettings(newSettings = {}) {
    state.settings = {
      ...state.settings,
      ...newSettings,
      longBreakInterval:
        Number(newSettings.longBreakInterval) ||
        state.settings.longBreakInterval ||
        4,
    };

    if (
      !state.timer.isRunning &&
      !state.timer.isPaused &&
      state.timer.currentPhase === "work"
    ) {
      const workSecs = (state.settings.pomodoroWorkTime || 25) * 60;
      state.timer.timeRemaining = workSecs;
      state.timer.duration = workSecs;
    }

    this.save();
  },

  resetTimer() {
    const defaultSecs = (state.settings.pomodoroWorkTime || 25) * 60;
    state.timer.isRunning = false;
    state.timer.isPaused = false;
    state.currentSessionInterruptions = 0;

    if (state.activeMode === "pomodoro") {
      state.timer.timeRemaining = defaultSecs;
      state.timer.duration = defaultSecs;
      state.timer.currentPhase = "work";
    } else if (state.activeMode === "flow") {
      state.timer.flowTime = 0;
      state.timer.currentPhase = "work";
    }

    this.save();
  },

  resetToDefaults() {
    state.settings = { ...DEFAULT_SETTINGS };
    state.sessions = [];
    state.activeTaskId = null;
    state.activeMode = "pomodoro";
    state.currentSessionInterruptions = 0;

    const defaultSecs = DEFAULT_SETTINGS.pomodoroWorkTime * 60;
    state.timer = {
      isRunning: false,
      isPaused: false,
      timeRemaining: defaultSecs,
      duration: defaultSecs,
      flowTime: 0,
      pomodoroSessionCount: 0,
      currentPhase: "work",
    };

    SoundModel.reset();

    this.save();
  },

  addSession(sessionData = {}) {
    const session = {
      id: generateId(),
      task: sessionData.task,
      type: sessionData.type || state.activeMode,
      completedAt: todayISO(),
      durationSeconds: sessionData.durationSeconds || 0,
      interruptionsCount:
        sessionData.interruptionsCount ??
        state.currentSessionInterruptions ??
        0,
    };

    state.sessions.push(session);
    state.currentSessionInterruptions = 0;
    this.save();
  },

  save() {
    const soundData = SoundModel.getCurrentTrack();
    const soundId = soundData ? soundData.id : "none";

    state.settings = {
      ...state.settings,
      currentSoundId: soundId,
      volume: SoundModel.getState().volume,
      isMuted: SoundModel.getState().isMuted,
    };

    saveToStorage({
      activeMode: state.activeMode,
      activeTaskId: state.activeTaskId,
      sessions: state.sessions,
      timer: state.timer,
      settings: state.settings,
    });

    this._rawCache = CoreStore.getNamespace(TIME_NAMESPACE) || {};
    this.notify();
    this.dispatchStateEvents();
  },
};
