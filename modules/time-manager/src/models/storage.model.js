import { generateId, todayISO } from "@/utils/helpers.js";

import { CoreStore } from "@life-orchestrator/core-store";

export const TIME_NAMESPACE = "time_manager";
export const STORAGE_VERSION = 1;

function normalizeSession(session) {
  return {
    id: String(session.id || generateId()),
    taskId: session.taskId ? String(session.taskId) : null,
    taskTitle: session.taskTitle || "Untitled Task",
    type: session.type || "pomodoro",
    durationSeconds: Number(session.durationSeconds) || 0,
    completedAt: session.completedAt || todayISO(),
  };
}

function normalizeNote(note) {
  return {
    id: String(note.id || generateId()),
    text: note.text ? String(note.text).trim() : "",
    createdAt: note.createdAt || todayISO(),
  };
}

function normalizeTimer(timer, defaultWorkTime = 25) {
  const fallbackSecs = defaultWorkTime * 60;
  return {
    isRunning: Boolean(timer?.isRunning),
    isPaused: Boolean(timer?.isPaused),
    timeRemaining: Number(timer?.timeRemaining) ?? fallbackSecs,
    duration: Number(timer?.duration) ?? fallbackSecs,
    flowTime: Number(timer?.flowTime) || 0,
    pomodoroSessionCount: Number(timer?.pomodoroSessionCount) || 0,
    currentPhase: timer?.currentPhase || "work",
  };
}

function migrateData(data) {
  const sessions = Array.isArray(data.sessions) ? data.sessions : [];
  const notes = Array.isArray(data.notes) ? data.notes : [];
  const settings = data.settings || {};
  const pomodoroWorkTime = Number(settings.pomodoroWorkTime) || 25;

  return {
    version: STORAGE_VERSION,
    activeMode: data.activeMode === "flow" ? "flow" : "pomodoro",
    activeTaskId: data.activeTaskId ? String(data.activeTaskId) : null,
    sessions: sessions.map(normalizeSession),
    notes: notes.map(normalizeNote),
    timer: normalizeTimer(data.timer, pomodoroWorkTime),
    settings: {
      ...settings,
      pomodoroWorkTime,
      shortBreakTime: Number(settings.shortBreakTime) || 5,
      longBreakTime: Number(settings.longBreakTime) || 15,
      longBreakInterval: Number(settings.longBreakInterval) || 4,
      autoStartBreaks: Boolean(settings.autoStartBreaks),
      autoStartPomodoros: Boolean(settings.autoStartPomodoros),
      flowBreakTime: Number(settings.flowBreakTime) || 15,
      autoStartFlowBreaks: Boolean(settings.autoStartFlowBreaks),
      notificationSound: Boolean(settings.notificationSound),
      pomodoroEndSound: settings.pomodoroEndSound || "none",
      breakEndSound: settings.breakEndSound || "none",
      currentSoundId:
        settings.currentSoundId || settings.lastSelectedSoundId || "none",
      volume: typeof settings.volume === "number" ? settings.volume : 50,
      isMuted: Boolean(settings.isMuted),
    },
  };
}

export function saveToStorage(data) {
  CoreStore.setNamespace(TIME_NAMESPACE, {
    version: STORAGE_VERSION,
    activeMode: data.activeMode || "pomodoro",
    activeTaskId: data.activeTaskId ? String(data.activeTaskId) : null,
    sessions: data.sessions || [],
    notes: data.notes || [],
    timer: data.timer || {},
    settings: data.settings || {},
  });
}

export function loadFromStorage() {
  const data = CoreStore.getNamespace(TIME_NAMESPACE);
  if (!data) return null;

  return migrateData(data);
}

export function clearTimeStorage() {
  CoreStore.clearNamespace(TIME_NAMESPACE);
}
