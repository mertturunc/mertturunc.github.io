// Entry point: wires the engine, state, and DOM together.
//
// Jekyll-native build: the settings sliders and ink-palette chips are rendered
// server-side by the Jekyll `_layouts/tool.html` template (from `_data/`),
// so this module only wires events and drives rendering — it no longer creates
// those controls itself.

import { createEngine } from './engine.js';
import { createState, SETTING_DEFS, INK_PALETTES, deriveInksFromMaterial, paletteToInks } from './state.js';
import { hexRelativeLum, CELL_ASPECT } from './renderer/ascii.js';

const monitor = document.getElementById('ascii-canvas');
const state = createState();
const engine = createEngine(monitor);
if (window.__ENABLE_ENGINE_DEBUG) window.__engine = engine;

// ---------- Element refs ----------
const dropZone = document.getElementById('drop-zone');
const defaultDropMessage = dropZone.querySelector('.drop-message').innerHTML;
const defaultDropSub = dropZone.querySelector('.drop-sub').textContent;
function tt(key, vars) {
  return typeof window.toolT === 'function' ? window.toolT(key, vars) : key;
}
const fileInput = document.getElementById('file-input');
const gltfFolderBtn = document.getElementById('gltf-folder-btn');
const gltfFolderInput = document.getElementById('gltf-folder-input');
const mainFileLabel = document.getElementById('main-file-label');
const mainFileChip = document.getElementById('main-file-chip');
const animSelect = document.getElementById('anim-select');
const animRow = document.getElementById('anim-row');
const animFileBtn = document.getElementById('anim-file-btn');
const animFileInput = document.getElementById('anim-file-input');
const motionSelect = document.getElementById('motion-select');
const motionRow = document.getElementById('motion-row');
const spinHint = document.getElementById('spin-hint');
const exportBtn = document.getElementById('export-btn');
const exportWebBtn = document.getElementById('export-web-btn');
const exportRow = document.getElementById('export-row');
const previewWrap = document.getElementById('preview-wrap');
let previewImg = null;

function ensurePreviewImg() {
  if (previewImg) return previewImg;
  previewImg = document.createElement('img');
  previewImg.id = 'preview-img';
  previewImg.alt = tt('preview_alt');
  previewWrap.appendChild(previewImg);
  return previewImg;
}

const emptyState = document.getElementById('empty-state');
const loadedUI = document.getElementById('loaded-ui');
const motionSegs = [...document.querySelectorAll('#motion-row .seg')];
const controlsPanel = document.getElementById('controls-panel');
const controlsBody = controlsPanel.querySelector('.controls-body');
const toast = document.getElementById('toast');
const removeModelBtn = document.getElementById('remove-model-btn');
const replaceHint = document.getElementById('replace-hint');
const frame = dropZone.closest('.frame');

function openFilePicker() {
  fileInput.click();
}

function handleDroppedFiles(files) {
  if (!files || !files.length) return;
  const hasGltf = [...files].some((f) => /\.gltf$/i.test(f.name));
  const isFolder = [...files].some((f) => f.webkitRelativePath);
  if (hasGltf && (files.length > 1 || isFolder)) {
    importGltfFolder(files);
    return;
  }
  loadMainModel(files[0]);
}

function setDropDragging(on) {
  dropZone.classList.toggle('dragging', on);
  if (frame) frame.classList.toggle('dragging', on);
}

// ---------- Sliders (rendered by Jekyll template) ----------
// Each `<input type="range" data-key="...">` row is rendered server-side from
// `_data/settings.yml`. Wire all of them present in the markup.
const sliderInputs = [...document.querySelectorAll('.controls-body input[type="range"][data-key]')];
const sliderRows = new Map(
  sliderInputs.map((range) => [
    range.dataset.key,
    { range, val: controlsBody.querySelector(`.slider-value[data-val="${range.dataset.key}"]`) },
  ])
);

function syncSliderValue(key) {
  const entry = sliderRows.get(key);
  if (!entry) return;
  const v = parseFloat(entry.range.value);
  entry.val.textContent = formatValue(key, v);
}

/** Push every control to match `state` (after reset or per-model restore). */
function syncAllControls() {
  for (const [key, entry] of sliderRows) {
    const v = state.get(key);
    if (v !== undefined && v !== null) entry.range.value = v;
    syncSliderValue(key);
  }
  colorAInput.value = state.get('colorA');
  colorBInput.value = state.get('colorB');
  colorCInput.value = state.get('colorC');
  syncBgUI();
  syncPaletteChips();
  syncInkUI();
  syncDitherUI();
  syncStyleSegs();
}

for (const [key, entry] of sliderRows) {
  const stored = state.get(key);
  if (stored !== undefined && stored !== null) entry.range.value = stored;
  syncSliderValue(key);
  entry.range.addEventListener('input', () => {
    let v = parseFloat(entry.range.value);
    // Keep the 3-ink bands apart so a mid band always has room to exist.
    if (key === 'threshold' && state.get('colorMode') === 3 && v >= state.get('split') - 0.06) {
      v = Math.max(0, state.get('split') - 0.06);
      entry.range.value = v;
    }
    if (key === 'split' && state.get('colorMode') === 3 && v <= state.get('threshold') + 0.06) {
      v = Math.min(1, state.get('threshold') + 0.06);
      entry.range.value = v;
    }
    state.set({ [key]: v });
    syncSliderValue(key);
    refresh();
  });
}

// ---------- Color inputs ----------
const colorAInput = document.getElementById('color-a');
const colorBInput = document.getElementById('color-b');
const colorCInput = document.getElementById('color-c');
const colorBgInput = document.getElementById('color-bg');
colorAInput.value = state.get('colorA');
colorBInput.value = state.get('colorB');
colorCInput.value = state.get('colorC');
[colorAInput, colorBInput, colorCInput].forEach((input) => {
  input.addEventListener('input', () => {
    state.set({
      [input.id === 'color-a' ? 'colorA' : input.id === 'color-b' ? 'colorB' : 'colorC']: input.value,
      paletteId: null, // manual tweak leaves the preset
    });
    syncPaletteChips();
    refresh();
  });
});

if (colorBgInput) {
  const bg = state.get('bgColor');
  if (bg && bg !== 'transparent') colorBgInput.value = bg;
  colorBgInput.addEventListener('input', () => {
    try {
      sessionStorage.setItem('ascii-studio-user-bg', '1');
    } catch (_) {}
    state.set({ bgColor: colorBgInput.value });
    syncBgUI();
    refresh();
  });
}

function syncBgUI() {
  const bg = state.get('bgColor') || 'transparent';
  const transparent = bg === 'transparent';
  syncTogglePressed(
    [...document.querySelectorAll('[data-bg-transparent]')],
    (b) => Number(b.dataset.bgTransparent) === (transparent ? 1 : 0)
  );
  if (colorBgInput && !transparent) colorBgInput.value = bg;
  syncPaperColor();
}

document.querySelectorAll('[data-bg-transparent]').forEach((b) => {
  b.addEventListener('click', () => {
    const on = Number(b.dataset.bgTransparent) === 1;
    try {
      sessionStorage.setItem('ascii-studio-user-bg', '1');
    } catch (_) {}
    if (on) state.set({ bgColor: 'transparent' });
    else state.set({ bgColor: colorBgInput?.value || '#f5f3ee' });
    syncBgUI();
    refresh();
  });
});

// ---------- Segmented style controls ----------
function wireSegGroup(attr, key, parse = (v) => v) {
  const btns = [...document.querySelectorAll(`[${attr}]`)];
  btns.forEach((b) => {
    b.addEventListener('click', () => {
      const next = parse(b.getAttribute(attr));
      if (state.get(key) === next) return;
      state.set({ [key]: next });
      syncStyleSegs();
      refresh();
    });
  });
  return btns;
}

const cameraFollowBtns = wireSegGroup('data-camera-follow', 'cameraFollow');
const cellModeBtns = wireSegGroup('data-cell-mode', 'cellMode');
const cellOutlineBtns = wireSegGroup('data-cell-outline', 'cellOutline', Number);
const trailEnabledBtns = wireSegGroup('data-trail-enabled', 'trailEnabled', Number);
const trailStrokeBtns = wireSegGroup('data-trail-stroke', 'trailStroke', Number);
const formationBtns = wireSegGroup('data-formation', 'formationMode');

function syncStyleSegs() {
  syncTogglePressed(cameraFollowBtns, (b) => b.dataset.cameraFollow === state.get('cameraFollow'));
  syncTogglePressed(cellModeBtns, (b) => b.dataset.cellMode === state.get('cellMode'));
  syncTogglePressed(cellOutlineBtns, (b) => Number(b.dataset.cellOutline) === Number(state.get('cellOutline')));
  syncTogglePressed(trailEnabledBtns, (b) => Number(b.dataset.trailEnabled) === Number(state.get('trailEnabled')));
  syncTogglePressed(trailStrokeBtns, (b) => Number(b.dataset.trailStroke) === Number(state.get('trailStroke')));
  syncTogglePressed(formationBtns, (b) => b.dataset.formation === state.get('formationMode'));
  syncPointerFocusability();
}

// ---------- Pointer (mouse / keyboard camera + trail) ----------
let pointerNx = 0;
let pointerNy = 0;

function pointerNeedsInput() {
  return state.get('cameraFollow') === 'mouse' || !!Number(state.get('trailEnabled'));
}

function applyPointer(nx, ny) {
  pointerNx = Math.max(-1, Math.min(1, nx));
  pointerNy = Math.max(-1, Math.min(1, ny));
  engine.setPointer(pointerNx, pointerNy, state.settings);
  if (!ticking) refresh();
}

function syncPointerFocusability() {
  const on = pointerNeedsInput();
  if (on) {
    monitor.setAttribute('tabindex', '0');
    const hint = tt('pointer_keys_hint');
    const base =
      mainModelInfo
        ? tt('canvas_of', { name: mainFileLabel.textContent || '' })
        : tt('canvas_aria');
    monitor.setAttribute('aria-label', `${base}. ${hint}`);
  } else if (mainModelInfo) {
    monitor.removeAttribute('tabindex');
    monitor.setAttribute('aria-label', tt('canvas_of', { name: mainFileLabel.textContent || '' }));
  } else {
    monitor.removeAttribute('tabindex');
    monitor.setAttribute('aria-label', tt('canvas_aria'));
  }
}

function pointerFromEvent(e) {
  const rect = monitor.getBoundingClientRect();
  if (!rect.width || !rect.height) return null;
  const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
  const ny = ((e.clientY - rect.top) / rect.height) * 2 - 1;
  return { nx, ny };
}

function onPointerMove(e) {
  if (prefersReducedMotion()) return;
  if (!pointerNeedsInput()) return;
  const p = pointerFromEvent(e);
  if (!p) return;
  applyPointer(p.nx, p.ny);
}

function onPointerLeave() {
  if (state.get('cameraFollow') !== 'mouse') return;
  applyPointer(0, 0);
}

function onPointerKeydown(e) {
  if (!pointerNeedsInput() || prefersReducedMotion()) return;
  const step = e.shiftKey ? 0.12 : 0.05;
  let handled = true;
  if (e.key === 'ArrowLeft') applyPointer(pointerNx - step, pointerNy);
  else if (e.key === 'ArrowRight') applyPointer(pointerNx + step, pointerNy);
  else if (e.key === 'ArrowUp') applyPointer(pointerNx, pointerNy - step);
  else if (e.key === 'ArrowDown') applyPointer(pointerNx, pointerNy + step);
  else if (e.key === 'Home' || e.key === 'Escape') applyPointer(0, 0);
  else handled = false;
  if (handled) e.preventDefault();
}

monitor.addEventListener('pointermove', onPointerMove);
monitor.addEventListener('pointerleave', onPointerLeave);
monitor.addEventListener('keydown', onPointerKeydown);
dropZone.addEventListener('pointermove', onPointerMove);
dropZone.addEventListener('pointerleave', onPointerLeave);

// ---------- Render ink ui ----------
const colorRow = document.getElementById('color-row');
const colorALabel = document.getElementById('color-a-label');
const colorBLabel = document.getElementById('color-b-label');
const colorAItem = document.getElementById('color-a-item');
const colorBItem = document.getElementById('color-b-item');
const colorCItem = document.getElementById('color-c-item');

// Palette chips are rendered server-side by the Jekyll template. Wire the ones
// present in the markup; each carries `data-palette="<id>"`.
const paletteGrid = document.getElementById('palette-grid');
const paletteChips = new Map();
if (paletteGrid) {
  for (const chip of paletteGrid.querySelectorAll('.palette-chip')) {
    paletteChips.set(chip.dataset.palette, chip);
  }
  paletteGrid.addEventListener('click', (e) => {
    const chip = e.target.closest('.palette-chip');
    if (chip) applyPalette(chip.dataset.palette);
  });
}

const inkBtns = [...document.querySelectorAll('.style-rows [data-ink]')];
const ditherBtns = [...document.querySelectorAll('.style-rows [data-dither]')];

function applyPalette(id) {
  const p = INK_PALETTES.find((x) => x.id === id);
  if (!p) return;
  const paperLum = hexRelativeLum(state.get('paperColor') || resolvePaperHex());
  const inks = paletteToInks(p, paperLum);
  state.set(inks);
  colorAInput.value = inks.colorA;
  colorBInput.value = inks.colorB;
  colorCInput.value = inks.colorC;
  syncPaletteChips();
  refresh();
}

function syncTogglePressed(els, isActive) {
  for (const el of els) {
    const on = !!isActive(el);
    el.classList.toggle('active', on);
    el.setAttribute('aria-pressed', on ? 'true' : 'false');
  }
}

function syncPaletteChips() {
  const active = state.get('paletteId');
  syncTogglePressed([...paletteChips.values()], (chip) => chip.dataset.palette === active);
}

// Threshold / split sliders for which band visibility depends on ink count.
const thresholdSlider = controlsBody.querySelector('input[data-key="threshold"]')?.closest('.slider-row');
const splitSlider = controlsBody.querySelector('input[data-key="split"]')?.closest('.slider-row');

function syncInkUI() {
  const n = state.get('colorMode');
  syncTogglePressed(inkBtns, (b) => Number(b.dataset.ink) === n);
  // Threshold/split drove old luminance→hue banding; letter/accent model ignores them.
  thresholdSlider?.classList.toggle('hidden', true);
  splitSlider?.classList.toggle('hidden', true);
  colorAItem.classList.toggle('hidden', false);
  colorBItem.classList.toggle('hidden', n === 1);
  colorCItem.classList.toggle('hidden', n !== 3);
  colorRow.classList.toggle('three', n === 3);
  colorALabel.textContent = tt('ink_color');
  colorBLabel.textContent = tt('accent_color');
  document.getElementById('color-c-label').textContent = tt('accent_alt_color');
}

function syncSliderUI() {
  syncAllControls();
}

function setInkMode(n) {
  if (state.get('colorMode') === n) return;
  state.set({ colorMode: n });
  syncSliderUI();
  syncInkUI();
  refresh();
}

inkBtns.forEach((b) => b.addEventListener('click', () => setInkMode(Number(b.dataset.ink))));

// ---------- Dither ----------
function syncDitherUI() {
  const mode = state.get('dither');
  syncTogglePressed(ditherBtns, (b) => b.dataset.dither === mode);
}

ditherBtns.forEach((b) =>
  b.addEventListener('click', () => {
    if (state.get('dither') === b.dataset.dither) return;
    state.set({ dither: b.dataset.dither });
    syncDitherUI();
    refresh();
  })
);

// ---------- File import ----------
let mainModelInfo = null;

dropZone.addEventListener('click', () => {
  // When loaded, only the replace chip is the click target.
  if (dropZone.classList.contains('loaded')) return;
  openFilePicker();
});
dropZone.addEventListener('keydown', (e) => {
  if (dropZone.classList.contains('loaded')) return;
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    openFilePicker();
  }
});
replaceHint.addEventListener('click', (e) => {
  e.stopPropagation();
  openFilePicker();
});
fileInput.addEventListener('change', () => {
  const f = fileInput.files && fileInput.files[0];
  fileInput.value = '';
  if (f) loadMainModel(f);
});

gltfFolderBtn.addEventListener('click', () => gltfFolderInput.click());
gltfFolderInput.addEventListener('change', () => {
  if (gltfFolderInput.files && gltfFolderInput.files.length) {
    importGltfFolder(gltfFolderInput.files);
    gltfFolderInput.value = '';
  }
});

// Drag-and-drop stays on the frame so replace still works after the hit
// target collapses to the top chip.
const dropTarget = frame || dropZone;
dropTarget.addEventListener('dragover', (e) => {
  e.preventDefault();
  setDropDragging(true);
});
dropTarget.addEventListener('dragleave', (e) => {
  if (e.target !== dropTarget) return;
  setDropDragging(false);
});
dropTarget.addEventListener('drop', (e) => {
  e.preventDefault();
  setDropDragging(false);
  handleDroppedFiles(e.dataTransfer.files);
});

function setImportBusy(busy) {
  dropZone.setAttribute('aria-busy', busy ? 'true' : 'false');
  frame.classList.toggle('importing', busy);
  if (busy && !mainModelInfo) {
    dropZone.querySelector('.drop-message').textContent = tt('loading_model');
  }
}

async function loadMainModel(file) {
  const ext = (file.name.split('.').pop() || '').toLowerCase();
  if (!['fbx', 'obj', 'gltf', 'glb', 'usdz', 'usd', 'usda', 'usdc'].includes(ext)) {
    showError(tt('err_bad_type'));
    return;
  }
  setImportBusy(true);
  try {
    // Restore this file's last settings (or a clean framing pose on first open)
    // before the engine applies lights / orientation.
    const openKind = state.setActiveModel(file.name);
    if (openKind) syncAllControls();
    const info = await engine.loadModel(file, state.settings);
    mainModelInfo = { ...info, file, fromFolder: false };
    if (openKind === 'fresh') applyFreshModelLook();
    onModelLoaded(file.name);
  } catch (err) {
    console.error(err);
    showError(tt('err_load_model', { err: err.message }));
    if (!mainModelInfo) {
      dropZone.querySelector('.drop-message').textContent = tt('drop');
    }
  } finally {
    setImportBusy(false);
  }
}

/**
 * Import a multi-file glTF scene by selecting/dropping its whole folder.
 * @param {FileList|File[]} files
 */
async function importGltfFolder(files) {
  setImportBusy(true);
  try {
    const gltf = [...files].find((f) => /\.gltf$/i.test(f.name));
    const displayName = gltf ? gltf.name : 'glTF scene';
    const openKind = state.setActiveModel(displayName);
    if (openKind) syncAllControls();
    const info = await engine.loadGltfFolder(files, state.settings);
    mainModelInfo = { ...info, file: null, fromFolder: true };
    if (openKind === 'fresh') applyFreshModelLook();
    onModelLoaded(displayName);
  } catch (err) {
    console.error(err);
    showError(tt('err_load_folder', { err: err.message }));
    if (!mainModelInfo) {
      dropZone.querySelector('.drop-message').textContent = tt('drop');
    }
  } finally {
    setImportBusy(false);
  }
}

/** First-open: probe luminance + materials → lights, exposure, bands, inks. */
function applyFreshModelLook() {
  syncPaperColor();
  // Always start a new model at object origin (ω/φ/κ = 0).
  state.set({ objectOmega: 0, objectPhi: 0, objectKappa: 0 });
  engine.resetModelTransform(state.settings);
  const raw = engine.calibrateLook(state.settings);
  if (!raw || !Object.keys(raw).length) return;
  const { __matHue: hue, __matSat: sat, __matLum: lum, ...look } = raw;
  const paperLum = hexRelativeLum(state.get('paperColor') || '#f5f3ee');
  const colors = deriveInksFromMaterial({ hue, sat, lum }, paperLum);
  state.set({ ...look, ...colors });
  fitAsciiToFrame({ pullCamera: true });
  syncAllControls();
  syncInkUI();
  syncPaletteChips();
  showToast(tt('look_calibrated', { palette: colors.paletteId || 'custom' }));
}

/** Paper used for ink contrast when canvas bg is transparent. */
function resolvePaperHex() {
  const bg = state.get('bgColor');
  if (bg && bg !== 'transparent') return bg;
  const dark = document.documentElement.getAttribute('data-theme') === 'dark';
  return dark ? '#2a2724' : '#f5f3ee';
}

function syncPaperColor() {
  const paper = resolvePaperHex();
  if (state.get('paperColor') === paper) return;
  state.set({ paperColor: paper });
}

/** Available paint box inside the frame (minus tray when visible). */
function frameContentSize() {
  if (!frame) return { w: 640, h: 480 };
  const pad = 36;
  const tw = Math.max(80, frame.clientWidth - pad * 2);
  let th = Math.max(80, frame.clientHeight - pad * 2);
  const tray = document.querySelector('.tray');
  if (tray && loadedUI && !loadedUI.classList.contains('hidden')) {
    th = Math.max(80, th - tray.getBoundingClientRect().height - 12);
  }
  return { w: tw, h: th };
}

/**
 * Size the ASCII grid to the stage and crop empty space around the model.
 * When a model is loaded, reshape cols/rows to the silhouette aspect and
 * pull zoom so the object fills the frame.
 */
function fitAsciiToFrame({ pullCamera = false } = {}) {
  const { w: availW, h: availH } = frameContentSize();
  const spacing = Math.max(0, Number(state.get('cellSpacing')) || 0);
  let cell = Math.max(4, Math.min(16, Math.round(Number(state.get('cellSize')) || 9)));

  const stepX = (c) => c + spacing;
  const stepY = (c) => Math.round(c * CELL_ASPECT) + spacing;

  // Default: fill the paint box. With a model, prefer silhouette aspect.
  let targetAspect = availW / Math.max(1, availH);
  let zoomPatch = null;
  if (pullCamera && mainModelInfo) {
    const fitted = engine.fitFrameToObject(state.settings, { margin: 1.08, spinSamples: 12 });
    if (fitted?.aspect > 0.15 && fitted.aspect < 8) {
      targetAspect = fitted.aspect;
    }
    zoomPatch = fitted.zoom;
  }

  // Pick the largest even grid that fits availW×availH at `cell` with targetAspect.
  // pixel aspect = cols / (rows * CELL_ASPECT) ≈ targetAspect
  // ⇒ cols/rows ≈ targetAspect * CELL_ASPECT
  const colRowRatio = targetAspect * CELL_ASPECT;

  while (cell > 4) {
    const maxCols = Math.floor(availW / stepX(cell));
    const maxRows = Math.floor(availH / stepY(cell));
    if (maxCols >= 32 && maxRows >= 20) break;
    cell -= 1;
  }

  let cols = Math.floor(availW / stepX(cell));
  let rows = Math.max(20, Math.round(cols / colRowRatio));
  if (rows * stepY(cell) > availH) {
    rows = Math.floor(availH / stepY(cell));
    cols = Math.max(32, Math.round(rows * colRowRatio));
  }
  cols = Math.min(cols, Math.floor(availW / stepX(cell)));
  rows = Math.min(rows, Math.floor(availH / stepY(cell)));
  cols = Math.max(32, cols - (cols % 2));
  rows = Math.max(20, rows - (rows % 2));
  while (cols > 32 && cols * stepX(cell) > availW) cols -= 2;
  while (rows > 20 && rows * stepY(cell) > availH) rows -= 2;

  const patch = {
    gridWidth: cols,
    gridHeight: rows,
    cellSize: cell,
  };

  if (zoomPatch != null) {
    // Re-measure zoom with the new grid aspect so NDC fill stays tight.
    const refit = engine.fitFrameToObject(
      { ...state.settings, ...patch, zoom: zoomPatch },
      { margin: 1.08, spinSamples: 12 }
    );
    patch.zoom = refit.zoom;
    patch.cameraDistance = refit.zoom;
  }

  const cur = state.settings;
  const changed =
    cur.gridWidth !== patch.gridWidth ||
    cur.gridHeight !== patch.gridHeight ||
    cur.cellSize !== patch.cellSize ||
    (patch.zoom != null && Math.abs(Number(cur.zoom) - patch.zoom) > 0.04);
  if (changed) {
    state.set(patch);
    syncAllControls();
  }
  scaleCanvasCss(availW, availH);
  return patch;
}

/** CSS-scale the canvas into the frame (intrinsic pixels stay sharp via object-fit). */
function scaleCanvasCss(availW, availH) {
  if (!monitor) return;
  const cw = monitor.width || 1;
  const ch = monitor.height || 1;
  const s = Math.min(1, availW / cw, availH / ch);
  monitor.style.width = `${Math.max(1, Math.floor(cw * s))}px`;
  monitor.style.height = `${Math.max(1, Math.floor(ch * s))}px`;
}

let fitRaf = 0;
function scheduleFitAscii() {
  cancelAnimationFrame(fitRaf);
  fitRaf = requestAnimationFrame(() => {
    fitAsciiToFrame({ pullCamera: !!mainModelInfo });
    refresh();
  });
}

/** Common post-load UI wiring shared by single-file and folder imports. */
function onModelLoaded(displayName) {
  emptyState.classList.add('hidden');
  loadedUI.classList.remove('hidden');
  mainFileLabel.textContent = displayName;
  mainFileChip.classList.remove('hidden');
  dropZone.classList.add('loaded');
  dropZone.removeAttribute('role');
  dropZone.removeAttribute('tabindex');
  monitor.setAttribute('aria-label', tt('canvas_of', { name: displayName }));

  refreshAnimationUI();
  motionRow.classList.remove('hidden');
  animFileBtn.classList.remove('hidden');

  exportRow.classList.remove('hidden');
  // Fit after tray becomes visible so height accounts for it.
  requestAnimationFrame(() => {
    fitAsciiToFrame({ pullCamera: true });
    refresh();
  });
}

function resetToEmptyState() {
  state.clearActiveModel();
  engine.clearModel();
  mainModelInfo = null;
  mainFileChip.classList.add('hidden');
  mainFileLabel.textContent = '';
  motionRow.classList.add('hidden');
  animRow.classList.add('hidden');
  animFileBtn.classList.add('hidden');
  exportRow.classList.add('hidden');
  previewWrap.classList.add('hidden');
  if (previewImg) {
    if (previewImg.dataset.objectUrl) {
      try {
        URL.revokeObjectURL(previewImg.dataset.objectUrl);
      } catch (_) {}
    }
    previewImg.remove();
    previewImg = null;
  }
  spinHint.classList.add('hidden');
  motionSelect.value = 'auto';
  syncMotionSegs();
  engine.setMotionMode('auto');
  dropZone.querySelector('.drop-message').textContent = tt('drop');
  dropZone.querySelector('.drop-sub').textContent = tt('drop_sub');
  dropZone.classList.remove('loaded');
  dropZone.setAttribute('role', 'button');
  dropZone.setAttribute('tabindex', '0');
  emptyState.classList.remove('hidden');
  loadedUI.classList.add('hidden');
  monitor.setAttribute('aria-label', tt('canvas_aria'));
  engine.renderPreview(0, state.settings);
}

removeModelBtn.addEventListener('click', resetToEmptyState);

const resetSettingsBtn = document.getElementById('reset-settings-btn');
resetSettingsBtn.addEventListener('click', () => {
  state.reset();
  // Pin model at origin with ω/φ/κ = 0 and re-fit the camera.
  engine.resetModelTransform(state.settings);
  syncAllControls();
  fitAsciiToFrame({ pullCamera: !!mainModelInfo });
  refresh();
});

function refreshAnimationUI() {
  const hasAnim = mainModelInfo.hasAnimation;
  animRow.classList.toggle('hidden', !hasAnim);
  animFileBtn.textContent = tt('attach_anim');
  // Always rebuild the selector so it reflects the current model's clips.
  animSelect.innerHTML = '';
  if (hasAnim && mainModelInfo.animations && mainModelInfo.animations.length) {
    mainModelInfo.animations.forEach((a) => {
      const opt = document.createElement('option');
      opt.value = a.index;
      opt.textContent = a.name;
      animSelect.appendChild(opt);
    });
  }
  updateSpinHint();
}

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function updateSpinHint() {
  // Empty canvas: the drop copy already explains motion — don't show a status chip.
  if (!mainModelInfo) {
    spinHint.classList.add('hidden');
    return;
  }
  if (prefersReducedMotion()) {
    spinHint.classList.remove('hidden');
    spinHint.textContent = tt('motion_reduced');
    return;
  }
  const mode = engine.motionMode;
  const spinning = mode === 'spin' || (mode === 'auto' && !engine.hasAnimation);
  spinHint.classList.toggle('hidden', !spinning);
  spinHint.textContent = spinning ? tt('spin_hint') : tt('animating');
}

animSelect.addEventListener('change', () => {
  engine.setActiveAnimation(parseInt(animSelect.value, 10));
  motionSelect.value = 'animation';
  syncMotionSegs();
  updateSpinHint();
  refresh();
});

animFileBtn.addEventListener('click', () => animFileInput.click());
animFileInput.addEventListener('change', async () => {
  const f = animFileInput.files && animFileInput.files[0];
  animFileInput.value = '';
  if (!f) return;
  if (!mainModelInfo) {
    showError(tt('err_need_model'));
    return;
  }
  try {
    const added = await engine.addAnimationFromFbx(f, state.settings);
    const merged = mainModelInfo.animations || [];
    merged.push(...added);
    mainModelInfo.animations = merged;
    mainModelInfo.hasAnimation = true;
    refreshAnimationUI();
    motionSelect.value = 'animation';
    syncMotionSegs();
    hideOtherAnimations(added[added.length - 1].index);
    refresh();
  } catch (err) {
    console.error(err);
    showError(tt('err_load_anim', { err: err.message }));
  }
});

function hideOtherAnimations(activeIndex) {
  animSelect.value = String(activeIndex);
}

motionSelect.addEventListener('change', () => {
  setMotion(motionSelect.value);
});

function setMotion(mode) {
  engine.setMotionMode(mode);
  if (mode === 'spin') refresh();
  syncMotionSegs();
  updateSpinHint();
  refresh();
}

function syncMotionSegs() {
  syncTogglePressed(motionSegs, (b) => b.dataset.motion === engine.motionMode);
}

motionSegs.forEach((b) =>
  b.addEventListener('click', () => {
    motionSelect.value = b.dataset.motion;
    motionSelect.dispatchEvent(new Event('change'));
  })
);

// ---------- Preview loop ----------
let startTime = null;
let ticking = false;
let stageVisible = true;

function previewShouldRun() {
  if (document.hidden || !stageVisible) return false;
  if (!mainModelInfo) return false;
  return true;
}

function refresh() {
  startTime = performance.now();
  if (!ticking) {
    ticking = true;
    requestAnimationFrame(tick);
  }
}

function tick(now) {
  if (!startTime) {
    ticking = false;
    return;
  }
  const reduced = prefersReducedMotion();
  engine.setReducedMotion(reduced);
  // No model / hidden tab / offscreen stage: one still frame, then idle.
  if (!previewShouldRun()) {
    if (mainModelInfo) engine.renderPreview(reduced ? 0 : ((now - startTime) / 1000) % Math.max(0.1, state.get('duration') || 6), state.settings);
    else engine.renderPreview(0, state.settings);
    ticking = false;
    startTime = null;
    return;
  }
  const t = reduced ? 0 : (now - startTime) / 1000;
  engine.renderPreview(t, state.settings);
  const box = frameContentSize();
  scaleCanvasCss(box.w, box.h);
  if (reduced) {
    ticking = false;
    return;
  }
  requestAnimationFrame(tick);
}
requestAnimationFrame(tick);

document.addEventListener('visibilitychange', () => {
  if (!document.hidden) refresh();
});

if (typeof IntersectionObserver !== 'undefined' && frame) {
  const stageIo = new IntersectionObserver(
    (entries) => {
      stageVisible = !!entries[0]?.isIntersecting;
      if (stageVisible) refresh();
    },
    { threshold: 0.05 }
  );
  stageIo.observe(frame);
}

window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', () => {
  updateSpinHint();
  refresh();
});

// ---------- Export ----------
function setExportBusy(busy) {
  for (const btn of [exportBtn, exportWebBtn]) {
    if (!btn) continue;
    btn.disabled = busy;
    if (busy) btn.setAttribute('aria-busy', 'true');
    else btn.removeAttribute('aria-busy');
  }
  if (exportBtn) exportBtn.textContent = busy ? tt('rendering') : tt('export');
  if (exportWebBtn) exportWebBtn.textContent = busy ? tt('rendering') : tt('export_web');
}

exportBtn.addEventListener('click', async () => {
  if (!mainModelInfo) return;
  try {
    setExportBusy(true);

    const bytes = await engine.captureAsync(state.settings, () => {});

    // Build a data URL for preview.
    const blob = new Blob([bytes], { type: 'image/gif' });
    const url = URL.createObjectURL(blob);
    const img = ensurePreviewImg();
    if (img.dataset.objectUrl) {
      try {
        URL.revokeObjectURL(img.dataset.objectUrl);
      } catch (_) {}
    }
    img.dataset.objectUrl = url;
    img.src = url;
    previewWrap.classList.remove('hidden');

    await sleep(50);
    const { downloadGif } = await import('./gif/gifExport.js');
    downloadGif(bytes, (mainModelInfo.name || 'ascii').replace(/\.[^.]+$/, '') + '.gif');
  } catch (err) {
    console.error(err);
    showError(tt('err_export', { err: err.message }));
  } finally {
    setExportBusy(false);
  }
});

exportWebBtn?.addEventListener('click', async () => {
  if (!mainModelInfo) return;
  try {
    setExportBusy(true);
    const { isSingleFileModelName } = await import('./embed/player.js');
    const { exportWebPackage, copyLiveStub } = await import('./web/liveExport.js');

    if (mainModelInfo.fromFolder || !mainModelInfo.file || !isSingleFileModelName(mainModelInfo.name || '')) {
      showError(tt('err_export_web_folder'));
      return;
    }

    const baseName = mainModelInfo.name || 'ascii';
    const result = await exportWebPackage({
      engine,
      settings: state.settings,
      baseName,
      ariaLabel: tt('export_web_aria'),
      motionMode: engine.motionMode,
      originalFile: mainModelInfo.file,
    });
    await copyLiveStub(result.stub);
    const sizeNote =
      result.beforeBytes > 0
        ? tt('export_web_size', {
            before: (result.beforeBytes / 1024).toFixed(0),
            after: (result.afterBytes / 1024).toFixed(0),
          })
        : '';
    showToast([tt('export_web_saved_zip', { path: `i/embeds/${result.folder}/` }), sizeNote].filter(Boolean).join(' '));
  } catch (err) {
    console.error(err);
    showError(tt('err_export_web', { err: err.message }));
  } finally {
    setExportBusy(false);
  }
});

// ---------- Helpers ----------
function formatValue(key, v) {
  if (key === 'threshold' || key === 'split' || key === 'colorMix' || key === 'explodeAmount' || key === 'speedFactor' || key === 'gamma') {
    return Number(v).toFixed(2);
  }
  if (key === 'cellSize' || key === 'cellSpacing') return Math.round(v) + 'px';
  if (
    key === 'gridWidth' ||
    key === 'gridHeight' ||
    key === 'fps' ||
    key === 'bold' ||
    key === 'trailLength' ||
    key === 'trailDecayMs' ||
    key === 'transitionMs'
  ) {
    return String(Math.round(v));
  }
  if (key === 'duration') return Number(v).toFixed(2) + 's';
  if (key === 'zoom' || key === 'cameraDistance') return Number(v).toFixed(2);
  if (key === 'contrast') return (v > 0 ? '+' : '') + Math.round(v);
  if (
    key === 'objectOmega' ||
    key === 'objectPhi' ||
    key === 'objectKappa' ||
    key === 'orbitH' ||
    key === 'orbitV' ||
    key === 'mouseStrength' ||
    key === 'cameraOmega' ||
    key === 'cameraPhi' ||
    key === 'cameraKappa' ||
    key === 'lightAzimuth' ||
    key === 'lightElevation'
  ) {
    return Math.round(v) + '°';
  }
  if (
    key === 'keyX' ||
    key === 'keyY' ||
    key === 'keyZ' ||
    key === 'fillX' ||
    key === 'fillY' ||
    key === 'fillZ' ||
    key === 'keyIntensity' ||
    key === 'fillIntensity' ||
    key === 'ambientIntensity'
  ) {
    return Number(v).toFixed(2);
  }
  return v;
}

let toastTimer = null;
function showToast(message, kind = 'ok') {
  clearTimeout(toastTimer);
  toast.textContent = message;
  toast.classList.remove('hidden', 'hide', 'toast--error', 'toast--ok');
  if (kind === 'error') {
    toast.classList.add('toast--error');
    toast.setAttribute('role', 'alert');
    toast.setAttribute('aria-live', 'assertive');
  } else {
    toast.classList.add('toast--ok');
    toast.setAttribute('role', 'status');
    toast.setAttribute('aria-live', 'polite');
  }
  toastTimer = setTimeout(() => {
    toast.classList.add('hide');
    setTimeout(() => toast.classList.add('hidden'), 300);
  }, 5000);
}

function showError(message) {
  showToast(message, 'error');
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

// Render initial empty frame. Also finish wiring the ink UI.
syncInkUI();
syncSliderUI();
syncPaletteChips();
syncDitherUI();
syncStyleSegs();
syncBgUI();
syncPointerFocusability();
engine.setReducedMotion(prefersReducedMotion());
engine.renderPreview(0, state.settings);
syncMotionSegs();

// Theme-aware plate: prefer transparent unless the user picked a solid bg.
function syncThemeBgDefault() {
  let userBg = false;
  try {
    userBg = sessionStorage.getItem('ascii-studio-user-bg') === '1';
  } catch (_) {}
  if (!userBg) {
    const bg = state.get('bgColor');
    if (bg && bg !== 'transparent') {
      state.set({ bgColor: 'transparent' });
      syncBgUI();
    }
  }
  syncPaperColor();
  refresh();
}
const themeObs = new MutationObserver(syncThemeBgDefault);
themeObs.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
syncThemeBgDefault();

fitAsciiToFrame({ pullCamera: false });
if (typeof ResizeObserver !== 'undefined' && frame) {
  const ro = new ResizeObserver(() => scheduleFitAscii());
  ro.observe(frame);
} else {
  window.addEventListener('resize', scheduleFitAscii);
}
window.addEventListener('langchange', () => {
  syncInkUI();
  updateSpinHint();
  if (exportBtn && !exportBtn.disabled) exportBtn.textContent = tt('export');
  if (exportWebBtn && !exportWebBtn.disabled) exportWebBtn.textContent = tt('export_web');
  if (mainModelInfo) {
    dropZone.querySelector('.drop-message').textContent = tt('replace_drop');
    monitor.setAttribute('aria-label', tt('canvas_of', { name: mainFileLabel.textContent || '' }));
    animFileBtn.textContent = tt('attach_anim');
  }
});
