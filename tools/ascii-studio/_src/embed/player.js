// Live embed player: model URL + settings, ASCII redrawn each frame.
// Reuses createEngine; no baked frame dump.

import { createEngine, DEFAULT_SETTINGS, WEB_EXPORT_MAX_FPS } from '../engine.js';
import { migrateSettingsPatch } from '../state.js';
import { CELL_ASPECT } from '../renderer/ascii.js';

const SINGLE_FILE_EXT = /^(glb|fbx|obj|usdz|usd|usda|usdc)$/i;

export function isSingleFileModelName(name) {
  const ext = (String(name).split('.').pop() || '').toLowerCase();
  return SINGLE_FILE_EXT.test(ext);
}

function mergeSettings(partial) {
  const { patch } = migrateSettingsPatch(partial || {});
  return { ...DEFAULT_SETTINGS, ...patch };
}

function needsPointer(settings) {
  return settings.cameraFollow === 'mouse' || !!Number(settings.trailEnabled);
}

function resolveSrc(src, baseUrl) {
  if (!src) throw new Error('Missing model src');
  if (/^(https?:|blob:|data:)/i.test(src)) return src;
  if (src.startsWith('/')) {
    const origin = baseUrl || (typeof location !== 'undefined' ? location.origin : '');
    return origin + src;
  }
  try {
    return new URL(src, baseUrl || (typeof location !== 'undefined' ? location.href : undefined)).href;
  } catch {
    return src;
  }
}

function ensureHostChrome(el, aspect) {
  el.classList.add('ascii-live');
  el.style.width = el.style.width || '100%';
  el.style.maxWidth = el.style.maxWidth || '100%';
  el.style.aspectRatio = String(aspect);
  el.style.position = el.style.position || 'relative';
  el.style.overflow = 'hidden';
  el.style.lineHeight = '0';
}

function setStatus(el, { busy, message, isError }) {
  if (busy) el.setAttribute('aria-busy', 'true');
  else el.removeAttribute('aria-busy');

  let status = el.querySelector('.ascii-live__status');
  if (!message) {
    status?.remove();
    el.removeAttribute('data-ascii-live-error');
    return;
  }
  if (!status) {
    status = document.createElement('div');
    status.className = 'ascii-live__status';
    status.setAttribute('role', isError ? 'alert' : 'status');
    status.setAttribute('aria-live', isError ? 'assertive' : 'polite');
    Object.assign(status.style, {
      position: 'absolute',
      inset: '0',
      display: 'grid',
      placeItems: 'center',
      padding: '1rem',
      textAlign: 'center',
      fontFamily: 'var(--sans, ui-sans-serif, system-ui, sans-serif)',
      fontSize: '0.875rem',
      lineHeight: '1.4',
      color: isError ? 'var(--status-bad, #9d0006)' : 'currentColor',
      background: 'color-mix(in srgb, var(--bg, Canvas) 88%, transparent)',
      zIndex: '2',
      pointerEvents: 'none',
    });
    el.appendChild(status);
  }
  status.textContent = message;
  status.setAttribute('role', isError ? 'alert' : 'status');
  status.setAttribute('aria-live', isError ? 'assertive' : 'polite');
  status.style.color = isError ? 'var(--status-bad, #9d0006)' : 'currentColor';
  if (isError) el.setAttribute('data-ascii-live-error', message);
  else el.removeAttribute('data-ascii-live-error');
}

/**
 * Mount a live ASCII player into `el`.
 * @param {HTMLElement} el
 * @param {{ src: string, settings?: object, baseUrl?: string, ariaLabel?: string, motionMode?: string }} opts
 * @returns {Promise<{ unmount: () => void }>}
 */
export async function mount(el, opts) {
  if (!el) throw new Error('mount: element required');
  unmount(el);

  const settings = mergeSettings(opts.settings);
  const src = resolveSrc(opts.src, opts.baseUrl);
  const nameHint = opts.src.split('/').pop()?.split('?')[0] || 'model.glb';
  if (!isSingleFileModelName(nameHint)) {
    const msg = 'Live embed supports single-file models only (.glb, .fbx, .obj, .usd/.usdz)';
    ensureHostChrome(el, 16 / 9);
    setStatus(el, { busy: false, message: msg, isError: true });
    throw new Error(msg);
  }

  const cols0 = Math.max(1, Math.round(settings.gridWidth) || 96);
  const rows0 = Math.max(1, Math.round(settings.gridHeight) || 54);
  ensureHostChrome(el, cols0 / (rows0 * CELL_ASPECT));
  setStatus(el, { busy: true, message: 'Loading…', isError: false });

  const canvas = document.createElement('canvas');
  canvas.setAttribute('role', 'img');
  canvas.setAttribute('aria-label', opts.ariaLabel || 'ASCII animation');
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  canvas.style.display = 'block';
  canvas.style.objectFit = 'contain';
  const pointerOn = needsPointer(settings);
  canvas.style.pointerEvents = pointerOn ? 'auto' : 'none';
  el.style.pointerEvents = pointerOn ? 'auto' : '';
  el.appendChild(canvas);

  let engine;
  try {
    engine = createEngine(canvas);
    if (opts.motionMode) engine.setMotionMode(opts.motionMode);
    await engine.loadModelFromUrl(src, nameHint, settings);

    // Crop empty space: reshape grid to silhouette aspect and zoom to fill.
    const area = Math.max(32 * 20, cols0 * rows0);
    const fitted = engine.fitFrameToObject(settings, { margin: 1.02, spinSamples: 12 });
    const silAspect = Math.min(4, Math.max(0.25, fitted.aspect || 1));
    const colRowRatio = silAspect * CELL_ASPECT;
    let rows = Math.round(Math.sqrt(area / Math.max(0.2, colRowRatio)));
    let cols = Math.round(rows * colRowRatio);
    cols = Math.max(32, cols - (cols % 2));
    rows = Math.max(20, rows - (rows % 2));
    settings.gridWidth = cols;
    settings.gridHeight = rows;
    settings.zoom = fitted.zoom;
    settings.cameraDistance = fitted.zoom;
    const refit = engine.fitFrameToObject(settings, { margin: 1.02, spinSamples: 12 });
    settings.zoom = refit.zoom;
    settings.cameraDistance = refit.zoom;
    ensureHostChrome(el, cols / (rows * CELL_ASPECT));
  } catch (err) {
    try {
      engine?.clearModel?.();
      engine?.renderer?.dispose?.();
    } catch (_) {}
    canvas.remove();
    const message = err?.message || String(err) || 'Failed to load model';
    setStatus(el, { busy: false, message, isError: true });
    throw err instanceof Error ? err : new Error(message);
  }

  setStatus(el, { busy: false, message: '', isError: false });

  const state = {
    el,
    canvas,
    engine,
    settings,
    raf: 0,
    lastDraw: 0,
    start: performance.now(),
    visible: true,
    reduced: false,
    disposed: false,
  };
  el.__asciiLive = state;

  if (pointerOn) {
    const onMove = (e) => {
      if (state.disposed || state.reduced) return;
      const rect = canvas.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = ((e.clientY - rect.top) / rect.height) * 2 - 1;
      engine.setPointer(nx, ny, settings);
    };
    const onLeave = () => {
      if (settings.cameraFollow === 'mouse') engine.setPointer(0, 0, settings);
    };
    canvas.addEventListener('pointermove', onMove);
    canvas.addEventListener('pointerleave', onLeave);
    state._onPointerMove = onMove;
    state._onPointerLeave = onLeave;
  }

  const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
  const syncReduced = () => {
    state.reduced = mq.matches;
    engine.setReducedMotion(state.reduced);
    if (state.reduced) {
      engine.renderPreview(0, settings);
      stopLoop(state);
    } else if (state.visible) {
      startLoop(state);
    }
  };
  mq.addEventListener('change', syncReduced);
  state._mq = mq;
  state._syncReduced = syncReduced;

  const io = new IntersectionObserver(
    (entries) => {
      const hit = entries[0];
      state.visible = !!hit?.isIntersecting;
      if (state.visible && !state.reduced) startLoop(state);
      else stopLoop(state);
    },
    { threshold: 0.05 },
  );
  io.observe(el);
  state._io = io;

  syncReduced();
  if (!state.reduced) {
    engine.renderPreview(0, settings);
    startLoop(state);
  }

  return {
    unmount: () => unmount(el),
  };
}

function startLoop(state) {
  if (state.disposed || state.raf) return;
  const frameMs = 1000 / WEB_EXPORT_MAX_FPS;
  const dur = Math.max(0.1, Number(state.settings.duration) || 6);

  const tick = (now) => {
    if (state.disposed || !state.visible || state.reduced) {
      state.raf = 0;
      return;
    }
    state.raf = requestAnimationFrame(tick);
    if (now - state.lastDraw < frameMs) return;
    state.lastDraw = now;
    const t = ((now - state.start) / 1000) % dur;
    state.engine.renderPreview(t, state.settings);
  };
  state.raf = requestAnimationFrame(tick);
}

function stopLoop(state) {
  if (state.raf) {
    cancelAnimationFrame(state.raf);
    state.raf = 0;
  }
}

export function unmount(el) {
  if (!el) return;
  const state = el.__asciiLive;
  if (!state) {
    el.querySelectorAll('canvas, .ascii-live__status').forEach((c) => c.remove());
    el.removeAttribute('aria-busy');
    el.removeAttribute('data-ascii-live-error');
    return;
  }
  state.disposed = true;
  stopLoop(state);
  try {
    if (state._onPointerMove) state.canvas?.removeEventListener('pointermove', state._onPointerMove);
    if (state._onPointerLeave) state.canvas?.removeEventListener('pointerleave', state._onPointerLeave);
  } catch (_) {}
  try {
    state._io?.disconnect();
  } catch (_) {}
  try {
    state._mq?.removeEventListener('change', state._syncReduced);
  } catch (_) {}
  try {
    state.engine.clearPointer?.();
    state.engine.clearModel();
    state.engine.renderer?.dispose?.();
  } catch (_) {}
  state.canvas?.remove();
  el.querySelectorAll('.ascii-live__status').forEach((n) => n.remove());
  el.removeAttribute('aria-busy');
  el.removeAttribute('data-ascii-live-error');
  delete el.__asciiLive;
}
