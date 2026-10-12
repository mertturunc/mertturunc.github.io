// Live-embed package: optimized GLB + self-contained runtime + HTML stub (zip).

import { zipSync, strToU8 } from 'fflate';
import { pickLiveSettings, buildLiveStub, copyLiveStub } from './liveExportCore.js';
import { exportOptimizedGlb } from './modelOptimize.js';

export { pickLiveSettings, buildLiveStub, copyLiveStub };

function slugify(name) {
  return String(name || 'ascii-embed')
    .replace(/\.[^.]+$/, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 64) || 'ascii-embed';
}

function downloadBlob(blob, name) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

/** Fetch the single-file embed runtime built for packages. */
async function fetchStandaloneRuntime() {
  const url = new URL('/tools/ascii-studio/assets/js/ascii-embed.standalone.js', location.origin).href;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(
      `Could not load ascii-embed.standalone.js (HTTP ${res.status}). Run npm run build:js in tools/ascii-studio.`,
    );
  }
  return new Uint8Array(await res.arrayBuffer());
}

function buildPreviewHtml({ modelFileName, settings, ariaLabel, motionMode }) {
  const stub = buildLiveStub({
    modelSrc: './' + modelFileName,
    settings,
    runtimeUrl: './ascii-embed.js',
    ariaLabel,
    motionMode,
  });
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>ASCII embed preview</title>
</head>
<body style="margin:1rem;background:#111;color:#eee;font-family:system-ui,sans-serif">
  <p style="opacity:.7;font-size:.85rem">Self-contained preview (model + runtime in this folder).</p>
${stub}
</body>
</html>`;
}

function buildReadme({ folder, modelFileName, modelSrc, runtimeSrc, beforeBytes, afterBytes, runtimeBytes }) {
  const kb = (n) => (n / 1024).toFixed(1) + ' KB';
  return `ASCII Studio web embed package (self-contained)
=================================================

Works on the public site without /tools/ascii-studio — runtime is included.

1. Unzip into the Jekyll repo:
   i/embeds/${folder}/

2. Paste snippet.html into your post (clipboard already has it).

Public URLs used by the snippet
--------------------------------
- Model:   ${modelSrc}
- Runtime: ${runtimeSrc}

Files
-----
- ${modelFileName}     optimized GLB (${kb(afterBytes)}${beforeBytes ? `, was ${kb(beforeBytes)}` : ''})
- ascii-embed.js   player + Three.js (${kb(runtimeBytes)})
- snippet.html     blog fragment
- preview.html     open via a local static server to smoke-test

The studio UI can stay private; only i/embeds/${folder}/ needs to be published.
`;
}

/**
 * Build optimized GLB + bundled runtime + HTML, download as ZIP.
 */
export async function exportWebPackage({
  engine,
  settings,
  baseName,
  ariaLabel = 'ASCII animation',
  motionMode,
  originalFile,
}) {
  const folder = slugify(baseName);
  const modelFileName = 'model.glb';
  const modelSrc = `/i/embeds/${folder}/${modelFileName}`;
  const runtimeSrc = `/i/embeds/${folder}/ascii-embed.js`;

  const beforeBytes = originalFile?.size || 0;
  const [glb, runtimeBytes] = await Promise.all([exportOptimizedGlb(engine), fetchStandaloneRuntime()]);
  const afterBytes = glb.byteLength;

  const stub = buildLiveStub({
    modelSrc,
    settings,
    runtimeUrl: runtimeSrc,
    ariaLabel,
    motionMode,
  });
  const preview = buildPreviewHtml({
    modelFileName,
    settings,
    ariaLabel,
    motionMode,
  });
  const readme = buildReadme({
    folder,
    modelFileName,
    modelSrc,
    runtimeSrc,
    beforeBytes,
    afterBytes,
    runtimeBytes: runtimeBytes.byteLength,
  });

  const files = {
    [modelFileName]: glb,
    'ascii-embed.js': runtimeBytes,
    'snippet.html': stub,
    'preview.html': preview,
    'README.txt': readme,
  };

  const zipped = {};
  for (const [name, data] of Object.entries(files)) {
    zipped[`${folder}/${name}`] = typeof data === 'string' ? strToU8(data) : data;
  }
  const out = zipSync(zipped, { level: 6 });
  downloadBlob(new Blob([out], { type: 'application/zip' }), `${folder}-embed.zip`);

  return { folder, modelSrc, runtimeSrc, stub, afterBytes, beforeBytes, mode: 'zip' };
}
