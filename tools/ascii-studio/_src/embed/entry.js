// Public live-embed runtime. Auto-mounts [data-ascii-live] and exports mount/unmount.
// Boots once per page even if the script tag is pasted multiple times.

import { mount as mountPlayer, unmount as unmountPlayer } from './player.js';

const BOOT_KEY = '__asciiLiveBooted';
const mounted = new WeakMap();

export async function mount(el, opts) {
  const handle = await mountPlayer(el, opts);
  mounted.set(el, handle);
  return handle;
}

export function unmount(el) {
  const handle = mounted.get(el);
  if (handle) {
    handle.unmount();
    mounted.delete(el);
  } else {
    unmountPlayer(el);
  }
}

function parseSettings(raw) {
  if (!raw) return {};
  try {
    return JSON.parse(raw);
  } catch (err) {
    console.error('[ascii-live] bad data-settings', err);
    return {};
  }
}

function showElementError(el, message) {
  el.setAttribute('data-ascii-live-error', message);
  el.removeAttribute('aria-busy');
  let status = el.querySelector('.ascii-live__status');
  if (!status) {
    status = document.createElement('div');
    status.className = 'ascii-live__status';
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
      color: 'var(--status-bad, #9d0006)',
      background: 'color-mix(in srgb, var(--bg, Canvas) 88%, transparent)',
      zIndex: '2',
    });
    if (getComputedStyle(el).position === 'static') el.style.position = 'relative';
    el.appendChild(status);
  }
  status.setAttribute('role', 'alert');
  status.setAttribute('aria-live', 'assertive');
  status.textContent = message;
}

async function mountFromElement(el) {
  if (mounted.has(el) || el.__asciiLive || el.dataset.asciiLiveMounting === '1') return;
  const src = el.getAttribute('data-src') || el.dataset.src;
  if (!src) {
    showElementError(el, 'Missing data-src for ASCII live embed');
    console.error('[ascii-live] missing data-src');
    return;
  }
  el.dataset.asciiLiveMounting = '1';
  const settings = parseSettings(el.getAttribute('data-settings'));
  const ariaLabel = el.getAttribute('data-aria') || el.getAttribute('aria-label') || undefined;
  const motionMode = el.getAttribute('data-motion') || undefined;
  try {
    await mount(el, { src, settings, ariaLabel, motionMode });
  } catch (err) {
    console.error('[ascii-live] mount failed', err);
    // player.js already paints status on load failure; ensure attribute exists
    if (!el.getAttribute('data-ascii-live-error')) {
      showElementError(el, err.message || String(err));
    }
  } finally {
    delete el.dataset.asciiLiveMounting;
  }
}

function scan(root = document) {
  const nodes = root.querySelectorAll ? root.querySelectorAll('[data-ascii-live]') : [];
  nodes.forEach((el) => {
    mountFromElement(el);
  });
}

function boot() {
  if (typeof window !== 'undefined' && window[BOOT_KEY]) return;
  if (typeof window !== 'undefined') window[BOOT_KEY] = true;

  scan(document);
  const mo = new MutationObserver((mutations) => {
    for (const m of mutations) {
      for (const node of m.addedNodes) {
        if (node.nodeType !== 1) continue;
        if (node.matches?.('[data-ascii-live]')) mountFromElement(node);
        else if (node.querySelectorAll) scan(node);
      }
    }
  });
  mo.observe(document.documentElement, { childList: true, subtree: true });
}

if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot, { once: true });
  } else {
    boot();
  }
}
