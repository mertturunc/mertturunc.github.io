// Tiny HTML stub helpers for the live embed (no zip / optimize deps).

import { CELL_ASPECT } from '../renderer/ascii.js';

const LIVE_SETTING_KEYS = [
  'gridWidth',
  'gridHeight',
  'colorA',
  'colorB',
  'colorC',
  'paletteId',
  'threshold',
  'split',
  'colorMode',
  'dither',
  'contrast',
  'cellSize',
  'cellSpacing',
  'gamma',
  'bold',
  'fps',
  'duration',
  'speedFactor',
  'lightAzimuth',
  'lightElevation',
  'keyX',
  'keyY',
  'keyZ',
  'keyIntensity',
  'fillX',
  'fillY',
  'fillZ',
  'fillIntensity',
  'ambientIntensity',
  'objectOmega',
  'objectPhi',
  'objectKappa',
  'cameraOmega',
  'cameraPhi',
  'cameraKappa',
  'cameraDistance',
  'orbitH',
  'orbitV',
  'zoom',
  'cameraFollow',
  'mouseStrength',
  'cellMode',
  'cellOutline',
  'colorMix',
  'bgColor',
  'paperColor',
  'trailEnabled',
  'trailStroke',
  'trailLength',
  'trailDecayMs',
  'explodeAmount',
  'formationMode',
  'transitionMs',
];

export function pickLiveSettings(settings) {
  const out = {};
  for (const k of LIVE_SETTING_KEYS) {
    if (settings[k] !== undefined) out[k] = settings[k];
  }
  return out;
}

function escapeAttr(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;');
}

export function defaultRuntimeUrl() {
  if (typeof document !== 'undefined') {
    const meta = document.querySelector('meta[name="ascii-runtime-base"]');
    const base = meta?.getAttribute('content')?.replace(/\/$/, '');
    if (base) return `${base}/ascii-embed.js`;
  }
  // Prefer the standalone package runtime when present next to the snippet;
  // studio page can still load /tools/.../ascii-embed.js for fixtures.
  return './ascii-embed.js';
}

export function buildLiveStub({
  modelSrc,
  settings,
  runtimeUrl,
  ariaLabel = 'ASCII animation',
  motionMode,
}) {
  const cols = Math.max(1, Math.round(settings.gridWidth) || 96);
  const rows = Math.max(1, Math.round(settings.gridHeight) || 54);
  const aspect = `${cols} / ${rows * CELL_ASPECT}`;
  const picked = pickLiveSettings(settings);
  const settingsJson = JSON.stringify(picked);
  const runtime = runtimeUrl || defaultRuntimeUrl();
  const motionAttr = motionMode ? `\n     data-motion="${escapeAttr(motionMode)}"` : '';

  return `<!-- ASCII live embed: host model.glb next to this snippet path. Include the script once per page. -->
<div class="ascii-live"
     data-ascii-live
     data-src="${escapeAttr(modelSrc)}"
     data-settings="${escapeAttr(settingsJson)}"
     data-aria="${escapeAttr(ariaLabel)}"${motionAttr}
     style="width:100%;max-width:100%;aspect-ratio:${aspect};margin-inline:auto;position:relative"></div>
<script type="module" src="${escapeAttr(runtime)}"></script>`;
}

export async function copyLiveStub(stub) {
  if (!navigator.clipboard?.writeText) {
    throw new Error('Clipboard API not available');
  }
  await navigator.clipboard.writeText(stub);
}
