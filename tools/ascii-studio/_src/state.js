// Central app state: user-adjustable settings for rendering + GIF export.
// Global prefs live in localStorage; each loaded model also keeps its own
// snapshot so reopening a file restores the same pose / lights / inks.

import { DEFAULT_SETTINGS } from './engine.js';

// Curated ink palettes. Each provides the shadow / mid / highlight inks for the
// 1-3 ink bands; the 1/2/3 segmented control decides how many of them appear.
export const INK_PALETTES = [
  { id: 'denim', name: 'Denim', shadow: '#151921', mid: '#3f4f73', highlight: '#1d4ed8' },
  { id: 'carbon', name: 'Carbon', shadow: '#18181b', mid: '#5b6474', highlight: '#c7ced8' },
  { id: 'amber', name: 'Amber', shadow: '#24170a', mid: '#a16207', highlight: '#fbbf24' },
  { id: 'forest', name: 'Forest', shadow: '#10281a', mid: '#15803d', highlight: '#a7f3d0' },
  { id: 'wine', name: 'Wine', shadow: '#3c0d22', mid: '#be123c', highlight: '#fbcfe8' },
  { id: 'ocean', name: 'Ocean', shadow: '#10233b', mid: '#2563eb', highlight: '#bfdbfe' },
];

export const SETTING_DEFS = [
  { key: 'gridWidth', label: 'grid width', min: 32, max: 220, step: 2 },
  { key: 'gridHeight', label: 'grid height', min: 20, max: 140, step: 2 },
  { key: 'cellSize', label: 'character size (px)', min: 4, max: 16, step: 1 },
  { key: 'fps', label: 'fps', min: 4, max: 30, step: 1 },
  { key: 'duration', label: 'duration (s)', min: 0.5, max: 4, step: 0.25 },
  { key: 'cameraDistance', label: 'camera distance', min: 1.5, max: 10, step: 0.25 },
  { key: 'objectOmega', label: 'object ω (°)', min: -180, max: 180, step: 5 },
  { key: 'objectPhi', label: 'object φ (°)', min: -180, max: 180, step: 5 },
  { key: 'objectKappa', label: 'object κ (°)', min: -180, max: 180, step: 5 },
  { key: 'cameraOmega', label: 'camera ω (°)', min: -180, max: 180, step: 5 },
  { key: 'cameraPhi', label: 'camera φ (°)', min: -180, max: 180, step: 5 },
  { key: 'cameraKappa', label: 'camera κ (°)', min: -180, max: 180, step: 5 },
  { key: 'threshold', label: 'color threshold', min: 0, max: 1, step: 0.01 },
  { key: 'split', label: 'mid split', min: 0, max: 1, step: 0.01 },
  { key: 'contrast', label: 'contrast', min: -50, max: 50, step: 5 },
  { key: 'lightAzimuth', label: 'light azimuth (°)', min: 0, max: 360, step: 5 },
  { key: 'lightElevation', label: 'light elevation (°)', min: 0, max: 90, step: 5 },
];

// Framing keys reset on first open of a model so a new file doesn't inherit
// another model's pose / camera / lights.
const FRAMING_KEYS = [
  'cameraDistance',
  'objectOmega',
  'objectPhi',
  'objectKappa',
  'cameraOmega',
  'cameraPhi',
  'cameraKappa',
  'lightAzimuth',
  'lightElevation',
];

const SETTINGS_KEY = 'ascii-studio-settings';
const MODEL_SETTINGS_KEY = 'ascii-studio-model-settings';

// Old default colors that shipped before the current high-visibility defaults.
// If a user still has one of these stored (because settings persist in
// localStorage), migrate it to the current default so the model is actually
// visible again — without touching any colors the user chose themselves.
const OLD_DEFAULT_COLORS = {
  colorA: ['#111111', '#14161c'],
  colorB: ['#fafafa', '#4a5f8f'],
};

function readJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (raw == null || raw === '') return fallback;
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? parsed : fallback;
  } catch {
    return fallback;
  }
}

function writeJson(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // storage unavailable (private mode, quota); non-fatal
  }
}

function framingDefaults() {
  const out = {};
  for (const key of FRAMING_KEYS) out[key] = DEFAULT_SETTINGS[key];
  return out;
}

export function createState(initial = {}) {
  let saved = readJson(SETTINGS_KEY, {});
  if (!saved || typeof saved !== 'object') saved = {};

  // Migrate stale color defaults -> current defaults.
  let migrated = false;
  for (const [key, olds] of Object.entries(OLD_DEFAULT_COLORS)) {
    const val = saved[key];
    if (typeof val === 'string') {
      const norm = val.trim().toLowerCase();
      if (olds.includes(norm)) {
        saved[key] = DEFAULT_SETTINGS[key];
        migrated = true;
      }
    }
  }
  // Drop obsolete keys that no longer drive the engine.
  if ('spinSpeed' in saved) {
    delete saved.spinSpeed;
    migrated = true;
  }
  if (migrated) writeJson(SETTINGS_KEY, saved);

  const settings = { ...DEFAULT_SETTINGS, ...saved, ...initial };
  const listeners = new Set();
  let activeModel = null; // basename of the loaded model, or null
  let modelStore = readJson(MODEL_SETTINGS_KEY, {});
  if (!modelStore || typeof modelStore !== 'object') modelStore = {};

  function save() {
    writeJson(SETTINGS_KEY, settings);
  }

  function persistActiveModel() {
    if (!activeModel) return;
    modelStore[activeModel] = { ...settings };
    writeJson(MODEL_SETTINGS_KEY, modelStore);
  }

  function notify() {
    for (const fn of listeners) fn(settings);
  }

  return {
    get settings() {
      return settings;
    },
    get activeModel() {
      return activeModel;
    },
    get(key) {
      return settings[key];
    },
    set(patch) {
      Object.assign(settings, patch);
      save();
      persistActiveModel();
      notify();
    },
    /** Restore factory defaults for the current session (and active model). */
    reset() {
      Object.assign(settings, { ...DEFAULT_SETTINGS });
      save();
      persistActiveModel();
      notify();
    },
    /**
     * Bind settings to a model file name. Saves the previous model's snapshot,
     * then restores this model's saved settings (or resets framing on first open).
     * @returns {boolean} true when live settings changed and the UI should sync
     */
    setActiveModel(name) {
      if (!name) {
        this.clearActiveModel();
        return false;
      }
      if (activeModel === name) return false;

      if (activeModel) persistActiveModel();
      activeModel = name;

      const stored = modelStore[name];
      if (stored && typeof stored === 'object') {
        Object.assign(settings, { ...DEFAULT_SETTINGS, ...stored });
      } else {
        // First open: keep ink/grid prefs, but start from a clean framing pose
        // so every new model opens consistently.
        Object.assign(settings, framingDefaults());
        persistActiveModel();
      }
      save();
      notify();
      return true;
    },
    clearActiveModel() {
      if (activeModel) persistActiveModel();
      activeModel = null;
    },
    subscribe(fn) {
      listeners.add(fn);
      return () => listeners.delete(fn);
    },
    notify,
  };
}
