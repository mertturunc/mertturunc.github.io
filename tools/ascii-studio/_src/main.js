// Entry point: wires the engine, state, and DOM together.
//
// Jekyll-native build: the settings sliders and ink-palette chips are rendered
// server-side by the Jekyll `_layouts/tool.html` template (from `_data/`),
// so this module only wires events and drives rendering — it no longer creates
// those controls itself.

import { createEngine } from './engine.js';
import { createState, SETTING_DEFS, INK_PALETTES } from './state.js';

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
  syncPaletteChips();
  syncInkUI();
  syncDitherUI();
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
  state.set({
    paletteId: id,
    colorA: p.shadow,
    colorC: p.mid,
    colorB: p.highlight,
  });
  colorAInput.value = p.shadow;
  colorCInput.value = p.mid;
  colorBInput.value = p.highlight;
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
const thresholdSlider = controlsBody.querySelector('input[data-key="threshold"]').closest('.slider-row');
const splitSlider = controlsBody.querySelector('input[data-key="split"]').closest('.slider-row');

function syncInkUI() {
  const n = state.get('colorMode');
  syncTogglePressed(inkBtns, (b) => Number(b.dataset.ink) === n);
  thresholdSlider.classList.toggle('hidden', n === 1);
  splitSlider.classList.toggle('hidden', n !== 3);
  colorAItem.classList.toggle('hidden', false);
  colorBItem.classList.toggle('hidden', n === 1);
  colorCItem.classList.toggle('hidden', n !== 3);
  colorRow.classList.toggle('three', n === 3);
  colorALabel.textContent = n === 1 ? tt('ink_color') : tt('shadow_color');
  colorBLabel.textContent = tt('highlight_color');
  document.getElementById('color-c-label').textContent = tt('mid_color');
}

function syncSliderUI() {
  syncAllControls();
}

function setInkMode(n) {
  if (state.get('colorMode') === n) return;
  if (n === 3) {
    // Starting at three inks: auto-balance the bands from the current frame's
    // luminance so all three read evenly. Without a model, use neutral thirds.
    if (mainModelInfo) {
      const bal = engine.balancedThresholds(state.settings);
      state.set({ colorMode: 3, threshold: bal.threshold, split: bal.split });
    } else {
      state.set({ colorMode: 3, threshold: 0.33, split: 0.67 });
    }
  } else {
    state.set({ colorMode: n });
  }
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
    if (state.setActiveModel(file.name)) syncAllControls();
    const info = await engine.loadModel(file, state.settings);
    mainModelInfo = info;
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
    if (state.setActiveModel(displayName)) syncAllControls();
    const info = await engine.loadGltfFolder(files, state.settings);
    mainModelInfo = info;
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
  refresh();
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
  syncAllControls();
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
  // No model: one still frame is enough — don't keep the WebGL/ASCII loop hot.
  if (!mainModelInfo) {
    engine.renderPreview(0, state.settings);
    ticking = false;
    startTime = null;
    return;
  }
  const reduced = prefersReducedMotion();
  const t = reduced ? 0 : (now - startTime) / 1000;
  engine.renderPreview(t, state.settings);
  if (reduced) {
    ticking = false;
    return;
  }
  requestAnimationFrame(tick);
}
requestAnimationFrame(tick);

window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', () => {
  updateSpinHint();
  refresh();
});

// ---------- Export ----------
exportBtn.addEventListener('click', async () => {
  if (!mainModelInfo) return;
  try {
    exportBtn.disabled = true;
    exportBtn.setAttribute('aria-busy', 'true');
    exportBtn.textContent = tt('rendering');

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
    exportBtn.disabled = false;
    exportBtn.removeAttribute('aria-busy');
    exportBtn.textContent = tt('export');
  }
});

// ---------- Helpers ----------
function formatValue(key, v) {
  if (key === 'threshold' || key === 'split') return v.toFixed(2);
  if (key === 'cellSize') return Math.round(v) + 'px';
  if (key === 'gridWidth' || key === 'gridHeight' || key === 'fps') return String(Math.round(v));
  if (key === 'duration') return v.toFixed(2) + 's';
  if (key === 'cameraDistance') return v.toFixed(2);
  if (key === 'contrast') return (v > 0 ? '+' : '') + Math.round(v);
  if (
    key === 'objectOmega' ||
    key === 'objectPhi' ||
    key === 'objectKappa' ||
    key === 'cameraOmega' ||
    key === 'cameraPhi' ||
    key === 'cameraKappa' ||
    key === 'lightAzimuth' ||
    key === 'lightElevation'
  ) {
    return Math.round(v) + '°';
  }
  return v;
}

let toastTimer = null;
function showError(message) {
  clearTimeout(toastTimer);
  toast.textContent = message;
  toast.classList.remove('hidden', 'hide');
  toastTimer = setTimeout(() => {
    toast.classList.add('hide');
    setTimeout(() => toast.classList.add('hidden'), 300);
  }, 5000);
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

// Render initial empty frame. Also finish wiring the ink UI.
syncInkUI();
syncSliderUI();
syncPaletteChips();
syncDitherUI();
engine.renderPreview(0, state.settings);
syncMotionSegs();

window.addEventListener('langchange', () => {
  syncInkUI();
  updateSpinHint();
  if (exportBtn && !exportBtn.disabled) exportBtn.textContent = tt('export');
  if (mainModelInfo) {
    dropZone.querySelector('.drop-message').textContent = tt('replace_drop');
    monitor.setAttribute('aria-label', tt('canvas_of', { name: mainFileLabel.textContent || '' }));
    animFileBtn.textContent = tt('attach_anim');
  }
});
