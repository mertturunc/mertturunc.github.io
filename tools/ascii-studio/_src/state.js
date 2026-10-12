// Central app state: user-adjustable settings for rendering + GIF/web export.
// Global prefs live in localStorage; each loaded model also keeps its own
// snapshot so reopening a file restores the same pose / lights / inks.

import { DEFAULT_SETTINGS } from './engine.js';

export const INK_PALETTES = [
  // shadow=dark band, highlight=mid band, mid=light/edge band
  { id: 'ember', name: 'Ember', shadow: '#1a1a1a', highlight: '#FF6700', mid: '#FFC043' },
  { id: 'denim', name: 'Denim', shadow: '#1a1a1a', highlight: '#1d4ed8', mid: '#60a5fa' },
  { id: 'carbon', name: 'Carbon', shadow: '#1a1a1a', highlight: '#64748b', mid: '#94a3b8' },
  { id: 'amber', name: 'Amber', shadow: '#1a1a1a', highlight: '#d97706', mid: '#fbbf24' },
  { id: 'forest', name: 'Forest', shadow: '#1a1a1a', highlight: '#15803d', mid: '#4ade80' },
  { id: 'wine', name: 'Wine', shadow: '#1a1a1a', highlight: '#be123c', mid: '#fb7185' },
  { id: 'ocean', name: 'Ocean', shadow: '#1a1a1a', highlight: '#0284c7', mid: '#38bdf8' },
];

/** Shortest circular hue distance in degrees (0..180). */
function hueDist(a, b) {
  const d = Math.abs(a - b) % 360;
  return d > 180 ? 360 - d : d;
}

function hexToHue(hex) {
  const m = /^#?([0-9a-f]{6})$/i.exec(String(hex || '').trim());
  if (!m) return 0;
  const n = parseInt(m[1], 16);
  const r = ((n >> 16) & 255) / 255;
  const g = ((n >> 8) & 255) / 255;
  const b = (n & 255) / 255;
  const mx = Math.max(r, g, b);
  const mn = Math.min(r, g, b);
  const d = mx - mn;
  if (d < 1e-5) return 0;
  let h;
  if (mx === r) h = ((g - b) / d) % 6;
  else if (mx === g) h = (b - r) / d + 2;
  else h = (r - g) / d + 4;
  h *= 60;
  if (h < 0) h += 360;
  return h;
}

/**
 * Resolve a palette into runtime inks for luminance banding.
 * colorA = shadow (dark), colorB = mid, colorC = light/edge.
 */
export function paletteToInks(palette, _paperLum = 0.9) {
  const p = typeof palette === 'string' ? INK_PALETTES.find((x) => x.id === palette) : palette;
  const base = p || INK_PALETTES[0];
  // Always store authored light-paper colors; adaptInksToPaper remaps at draw time.
  return {
    paletteId: base.id,
    colorA: base.shadow,
    colorB: base.highlight,
    colorC: base.mid,
  };
}

/**
 * Pick the closest palette for a material hue, then map to letter/accent inks.
 */
export function deriveInksFromMaterial(hint = {}, paperLum = 0.9) {
  const hue = Number.isFinite(Number(hint.hue)) ? Number(hint.hue) : 28;
  const sat = Number(hint.sat);
  const id = !Number.isFinite(sat) || sat < 0.14 ? 'carbon' : nearestPaletteId(hue);
  return paletteToInks(id, paperLum);
}

/** @deprecated use deriveInksFromMaterial */
export function pickPaletteForMaterial(hint = {}, paperLum = 0.9) {
  return deriveInksFromMaterial(hint, paperLum);
}

function nearestPaletteId(hue) {
  let best = 'ember';
  let bestD = Infinity;
  for (const p of INK_PALETTES) {
    if (p.id === 'carbon') continue;
    const d = hueDist(hue, hexToHue(p.highlight));
    if (d < bestD) {
      bestD = d;
      best = p.id;
    }
  }
  return best;
}
/** Slider defs — keep keys in sync with _data/ascii-studio/settings.yml. */
export const SETTING_DEFS = [
  { key: 'speedFactor', label: 'speed', min: 0.25, max: 3, step: 0.05 },
  { key: 'fps', label: 'fps', min: 4, max: 240, step: 1 },
  { key: 'duration', label: 'duration (s)', min: 0.5, max: 8, step: 0.25 },
  { key: 'gridWidth', label: 'columns', min: 32, max: 220, step: 2 },
  { key: 'gridHeight', label: 'rows', min: 20, max: 140, step: 2 },
  { key: 'cellSize', label: 'cell w (px)', min: 4, max: 16, step: 1 },
  { key: 'cellSpacing', label: 'spacing', min: 0, max: 8, step: 1 },
  { key: 'gamma', label: 'gamma', min: 0.5, max: 2.5, step: 0.05 },
  { key: 'bold', label: 'bold', min: 0, max: 1, step: 1 },
  { key: 'orbitH', label: 'orbit h (°)', min: -180, max: 180, step: 5 },
  { key: 'orbitV', label: 'orbit v (°)', min: -180, max: 180, step: 5 },
  { key: 'zoom', label: 'zoom', min: 1.5, max: 10, step: 0.25 },
  { key: 'mouseStrength', label: 'mouse str (°)', min: 0, max: 90, step: 1 },
  { key: 'objectOmega', label: 'object ω (°)', min: -180, max: 180, step: 5 },
  { key: 'objectPhi', label: 'object φ (°)', min: -180, max: 180, step: 5 },
  { key: 'objectKappa', label: 'object κ (°)', min: -180, max: 180, step: 5 },
  { key: 'keyX', label: 'key x', min: -12, max: 12, step: 0.25 },
  { key: 'keyY', label: 'key y', min: -12, max: 12, step: 0.25 },
  { key: 'keyZ', label: 'key z', min: -12, max: 12, step: 0.25 },
  { key: 'keyIntensity', label: 'key intensity', min: 0, max: 4, step: 0.05 },
  { key: 'fillX', label: 'fill x', min: -12, max: 12, step: 0.25 },
  { key: 'fillY', label: 'fill y', min: -12, max: 12, step: 0.25 },
  { key: 'fillZ', label: 'fill z', min: -12, max: 12, step: 0.25 },
  { key: 'fillIntensity', label: 'fill intensity', min: 0, max: 2, step: 0.05 },
  { key: 'ambientIntensity', label: 'ambient', min: 0, max: 1.5, step: 0.05 },
  { key: 'colorMix', label: 'accent mix', min: 0, max: 1, step: 0.05 },
  { key: 'threshold', label: 'color threshold', min: 0, max: 1, step: 0.01 },
  { key: 'split', label: 'mid split', min: 0, max: 1, step: 0.01 },
  { key: 'contrast', label: 'contrast', min: -50, max: 50, step: 5 },
  { key: 'trailLength', label: 'length', min: 1, max: 24, step: 1 },
  { key: 'trailDecayMs', label: 'decay (ms)', min: 100, max: 2000, step: 50 },
  { key: 'explodeAmount', label: 'explode', min: 0, max: 1, step: 0.01 },
  { key: 'transitionMs', label: 'transition (ms)', min: 0, max: 2000, step: 50 },
];

const FRAMING_KEYS = [
  'orbitH',
  'orbitV',
  'zoom',
  'cameraFollow',
  'mouseStrength',
  'objectOmega',
  'objectPhi',
  'objectKappa',
  'keyX',
  'keyY',
  'keyZ',
  'keyIntensity',
  'fillX',
  'fillY',
  'fillZ',
  'fillIntensity',
  'ambientIntensity',
  'explodeAmount',
  'formationMode',
];

const SETTINGS_KEY = 'ascii-studio-settings';
const MODEL_SETTINGS_KEY = 'ascii-studio-model-settings';

const OLD_DEFAULT_COLORS = {
  colorA: ['#111111', '#14161c'],
  colorB: ['#fafafa', '#4a5f8f', '#af3a03', '#e65d02'],
  colorC: ['#504945', '#b37f07'],
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
    /* ignore */
  }
}

function framingDefaults() {
  const out = {};
  for (const key of FRAMING_KEYS) out[key] = DEFAULT_SETTINGS[key];
  return out;
}

function deg(v) {
  return ((Number(v) || 0) * Math.PI) / 180;
}

/** Map legacy azimuth/elevation (+ Euler camera) into XYZ / orbit keys. */
export function migrateSettingsPatch(saved) {
  const patch = { ...saved };
  let changed = false;

  if (patch.orbitH == null && patch.cameraOmega != null) {
    patch.orbitH = patch.cameraOmega;
    changed = true;
  }
  if (patch.orbitV == null && patch.cameraPhi != null) {
    patch.orbitV = Number(patch.cameraPhi) || 0;
    changed = true;
  }
  if (patch.zoom == null && patch.cameraDistance != null) {
    patch.zoom = patch.cameraDistance;
    changed = true;
  }

  const needsLights =
    patch.keyX == null || patch.keyY == null || patch.keyZ == null || patch.keyIntensity == null;
  if (needsLights && (patch.lightAzimuth != null || patch.lightElevation != null)) {
    const az = deg(patch.lightAzimuth ?? 45);
    const el = deg(patch.lightElevation ?? 40);
    const r = 6;
    patch.keyX = r * Math.cos(el) * Math.cos(az);
    patch.keyY = r * Math.sin(el);
    patch.keyZ = r * Math.cos(el) * Math.sin(az);
    patch.keyIntensity = patch.keyIntensity ?? 1.8;
    patch.fillX = -patch.keyX * 0.5;
    patch.fillY = Math.max(0.5, patch.keyY * 0.35);
    patch.fillZ = -patch.keyZ * 0.5;
    patch.fillIntensity = patch.fillIntensity ?? 0.3;
    patch.ambientIntensity = patch.ambientIntensity ?? 0.22;
    changed = true;
  }

  // Keep legacy mirrors in sync when orbit/zoom keys exist.
  if (patch.orbitH != null) patch.cameraOmega = patch.orbitH;
  if (patch.orbitV != null) patch.cameraPhi = patch.orbitV;
  if (patch.zoom != null) patch.cameraDistance = patch.zoom;

  // Old default: full turn in 1.5s (dizzy). Bump to calmer loop length.
  if (Number(patch.duration) === 1.5) {
    patch.duration = DEFAULT_SETTINGS.duration;
    changed = true;
  }

  // Old cream plate default → transparent (paper contrast still uses theme).
  if (typeof patch.bgColor === 'string' && /^#f5f3ee$/i.test(patch.bgColor.trim())) {
    patch.bgColor = 'transparent';
    changed = true;
  }
  // Tight framing + loud accent mix from earlier defaults.
  if (Number(patch.zoom) === 1.68 || Number(patch.cameraDistance) === 1.68
      || Number(patch.zoom) === 2.45 || Number(patch.cameraDistance) === 2.45) {
    patch.zoom = DEFAULT_SETTINGS.zoom;
    patch.cameraDistance = DEFAULT_SETTINGS.zoom;
    changed = true;
  }
  if (Number(patch.colorMix) === 0.5) {
    patch.colorMix = DEFAULT_SETTINGS.colorMix;
    changed = true;
  }
  if (Number(patch.cellOutline) === 1 && patch.paletteId) {
    // Outline made dark-theme plates look like a wire mesh.
    patch.cellOutline = 0;
    changed = true;
  }
  // Old dark-paper lift stored near-white letters into colorA — restore authored ink.
  if (typeof patch.colorA === 'string' && /^#(e8e4dc|f5f3ee|ffffff|faf8f4)$/i.test(patch.colorA.trim())) {
    const restored = paletteToInks(patch.paletteId || 'ember');
    patch.colorA = restored.colorA;
    if (!patch.colorB) patch.colorB = restored.colorB;
    if (!patch.colorC) patch.colorC = restored.colorC;
    changed = true;
  }

  return { patch, changed };
}

export function createState(initial = {}) {
  let saved = readJson(SETTINGS_KEY, {});
  if (!saved || typeof saved !== 'object') saved = {};

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
  if ('spinSpeed' in saved) {
    delete saved.spinSpeed;
    migrated = true;
  }
  // Old default spun a full turn in 1.5s — too fast; bump to the calmer default.
  if (Number(saved.duration) === 1.5) {
    saved.duration = DEFAULT_SETTINGS.duration;
    migrated = true;
  }

  const { patch, changed } = migrateSettingsPatch(saved);
  saved = patch;
  if (changed) migrated = true;
  if (migrated) writeJson(SETTINGS_KEY, saved);

  const settings = { ...DEFAULT_SETTINGS, ...saved, ...initial };
  // Ensure mirrors after merge.
  settings.cameraOmega = settings.orbitH;
  settings.cameraPhi = settings.orbitV;
  settings.cameraDistance = settings.zoom;

  const listeners = new Set();
  let activeModel = null;
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
    set(patchIn) {
      const p = { ...patchIn };
      if (p.orbitH != null) p.cameraOmega = p.orbitH;
      if (p.orbitV != null) p.cameraPhi = p.orbitV;
      if (p.zoom != null) p.cameraDistance = p.zoom;
      if (p.cameraOmega != null && p.orbitH == null) p.orbitH = p.cameraOmega;
      if (p.cameraPhi != null && p.orbitV == null) p.orbitV = p.cameraPhi;
      if (p.cameraDistance != null && p.zoom == null) p.zoom = p.cameraDistance;
      Object.assign(settings, p);
      save();
      persistActiveModel();
      notify();
    },
    reset() {
      Object.assign(settings, { ...DEFAULT_SETTINGS });
      save();
      persistActiveModel();
      notify();
    },
    /**
     * Switch the active model snapshot.
     * @returns {'restored'|'fresh'|false} false if already active
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
        const { patch: mig } = migrateSettingsPatch(stored);
        Object.assign(settings, { ...DEFAULT_SETTINGS, ...mig });
        settings.cameraOmega = settings.orbitH;
        settings.cameraPhi = settings.orbitV;
        settings.cameraDistance = settings.zoom;
        save();
        notify();
        return 'restored';
      }

      Object.assign(settings, framingDefaults());
      settings.cameraOmega = settings.orbitH;
      settings.cameraPhi = settings.orbitV;
      settings.cameraDistance = settings.zoom;
      persistActiveModel();
      save();
      notify();
      return 'fresh';
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
