// Central app state: user-adjustable settings for rendering + GIF export.

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
  { key: 'spinSpeed', label: 'spin speed (deg/s)', min: 0, max: 180, step: 5 },
  { key: 'threshold', label: 'color threshold', min: 0, max: 1, step: 0.01 },
  { key: 'split', label: 'mid split', min: 0, max: 1, step: 0.01 },
  { key: 'contrast', label: 'contrast', min: -50, max: 50, step: 5 },
  { key: 'lightAzimuth', label: 'light azimuth (°)', min: 0, max: 360, step: 5 },
  { key: 'lightElevation', label: 'light elevation (°)', min: 0, max: 90, step: 5 },
];

const SETTINGS_KEY = 'ascii-studio-settings';

// Old default colors that shipped before the current high-visibility defaults.
// If a user still has one of these stored (because settings persist in
// localStorage), migrate it to the current default so the model is actually
// visible again — without touching any colors the user chose themselves.
const OLD_DEFAULT_COLORS = {
  colorA: ['#111111', '#14161c'],
  colorB: ['#fafafa', '#4a5f8f'],
};

export function createState(initial = {}) {
  let saved = {};
  try {
    saved = JSON.parse(localStorage.getItem(SETTINGS_KEY) || '{}');
  } catch {
    saved = {};
  }

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
  // Save the migrated settings back so the fix is permanent.
  if (migrated) {
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(saved));
    } catch {}
  }

  const settings = { ...DEFAULT_SETTINGS, ...saved, ...initial };
  const listeners = new Set();

  function save() {
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    } catch {
      // storage unavailable (private mode, quota); non-fatal
    }
  }

  return {
    get settings() {
      return settings;
    },
    get(key) {
      return settings[key];
    },
    set(patch) {
      Object.assign(settings, patch);
      save();
      this.notify();
    },
    subscribe(fn) {
      listeners.add(fn);
      return () => listeners.delete(fn);
    },
    notify() {
      for (const fn of listeners) fn(settings);
    },
  };
}
