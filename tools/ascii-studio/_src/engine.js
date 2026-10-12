// Core engine: ties three.js scene rendering to the ASCII rasterizer + GIF export.
//
// Responsibilities:
//  - set up an offscreen three.js renderer + camera + lighting.
//  - load FBX/OBJ (with FBX animation support).
//  - drive animation playback and loop-timing so the GIF is seamless.
//  - sample frames into the ASCII rasterizer and export a looping GIF.

import {
  WebGLRenderer,
  Scene,
  Object3D,
  PerspectiveCamera,
  DirectionalLight,
  AmbientLight,
  Box3,
  Vector3,
  Matrix4,
  Color,
  AnimationMixer,
} from 'three';
import { createAsciiRasterizer, CELL_ASPECT } from './renderer/ascii.js';

const _centerScratch = new Vector3();
const _centerMatrix = new Matrix4();
const _matColor = new Color();
const _sizeScratch = new Vector3();
const _projScratch = new Vector3();
const _cornerScratch = new Vector3();

const RESOURCE_EXT = /\.(gltf|bin|png|jpe?g|webp|ktx2|dds|exr|basis|json)$/i;

/** Max GIF/export frame rate; keep in sync with fps slider max in state + settings.yml. */
export const MAX_FPS = 240;
/** Web HTML embeds cap here — high GIF fps is for smooth GIF timing, not per-frame JSON payload. */
export const WEB_EXPORT_MAX_FPS = 30;
/** GIF frame delay floor (ms) so 240fps timing is not clamped to ~100fps. */
const MIN_GIF_FRAME_DELAY_MS = 4;

/** Lazy-load a Three.js addon loader once and cache the constructor. */
const loaderCache = new Map();
async function getLoader(kind) {
  let pending = loaderCache.get(kind);
  if (!pending) {
    pending = (async () => {
      if (kind === 'fbx') {
        const { FBXLoader } = await import('three/addons/loaders/FBXLoader.js');
        return FBXLoader;
      }
      if (kind === 'obj') {
        const { OBJLoader } = await import('three/addons/loaders/OBJLoader.js');
        return OBJLoader;
      }
      if (kind === 'gltf') {
        const { GLTFLoader } = await import('three/addons/loaders/GLTFLoader.js');
        return GLTFLoader;
      }
      if (kind === 'usd') {
        const { USDLoader } = await import('three/addons/loaders/USDLoader.js');
        return USDLoader;
      }
      throw new Error('Unknown loader: ' + kind);
    })();
    loaderCache.set(kind, pending);
  }
  return pending;
}

async function getGifExport() {
  return import('./gif/gifExport.js');
}

/** Normalise a posix-style path: collapse //, resolve . and .. segments. */
function normalizePath(p) {
  const parts = [];
  for (const seg of p.replace(/\\/g, '/').split('/')) {
    if (!seg || seg === '.') continue;
    if (seg === '..') parts.pop();
    else parts.push(seg);
  }
  return parts.join('/');
}

/** Posix-ish relative path of a file within its selected folder. */
function pathOf(file) {
  return normalizePath(file.webkitRelativePath || file.name);
}

/** Resolve a buffer/image URI relative to the gltf's directory within urlMap. */
function resolveResource(gltfDir, uri, urlMap) {
  const absolute = uri.startsWith('/') ? uri : (gltfDir ? gltfDir + '/' : '') + uri;
  const key = normalizePath(absolute);
  // 1) Exact match on the fully-resolved path.
  if (urlMap.has(key)) return urlMap.get(key);
  // 2) Suffix match: the file path ends with "/<uri>" (folder-relative variants).
  const suf = '/' + key;
  for (const [k, v] of urlMap) {
    if (k.endsWith(suf)) return v;
  }
  // 3) Basename match: the file path's name equals the uri's basename (plain file drag).
  const base = key.split('/').pop();
  const matches = [...urlMap].filter(([k]) => k.split('/').pop() === base);
  if (matches.length === 1) return matches[0][1];
  return undefined;
}

export const DEFAULT_SETTINGS = {
  gridWidth: 140,
  gridHeight: 94,
  colorA: '#1a1a1a',
  colorB: '#FF6700',
  colorC: '#FFC043',
  paletteId: 'ember',
  threshold: 0.42,
  split: 0.68,
  colorMode: 3,
  dither: 'none',
  contrast: 0,
  cellSize: 9,
  cellSpacing: 0,
  gamma: 1.4,
  bold: 1,
  delay: 80,
  fps: 30,
  duration: 6,
  speedFactor: 1,
  // Legacy spherical lights (migrated → XYZ).
  lightAzimuth: 45,
  lightElevation: 40,
  keyX: 2,
  keyY: 5,
  keyZ: 4,
  keyIntensity: 1.2,
  fillX: -2.2,
  fillY: 2,
  fillZ: -1.8,
  fillIntensity: 0.15,
  ambientIntensity: 0.6,
  objectOmega: 0,
  objectPhi: 0,
  objectKappa: 0,
  // Legacy Euler camera (synced with orbitH/V + zoom).
  cameraOmega: 27,
  cameraPhi: 111,
  cameraKappa: 0,
  cameraDistance: 3.2,
  orbitH: 27,
  orbitV: 111,
  zoom: 3.2,
  cameraFollow: 'auto', // 'auto' | 'mouse'
  mouseStrength: 48,
  cellMode: 'mixed', // 'text' | 'shapes' | 'mixed'
  cellOutline: 0,
  colorMix: 0.28,
  bgColor: 'transparent',
  paperColor: '#f5f3ee',
  trailEnabled: 0,
  trailStroke: 0,
  trailLength: 8,
  trailDecayMs: 600,
  explodeAmount: 0,
  formationMode: 'none', // 'none' | 'assemble'
  transitionMs: 400,
};

/**
 * Create the engine. It renders ASCII into `monitor` canvas.
 */
export function createEngine(monitor) {
  const renderer = new WebGLRenderer({
    antialias: true,
    alpha: true,
    preserveDrawingBuffer: true,
  });
  renderer.setPixelRatio(1);
  renderer.setClearColor(0x000000, 0);

  const scene = new Scene();
  // Camera sits on a rig at the origin so ω/φ/κ orbit/tilt/roll around the model
  // while the lens stays aimed at the origin.
  const cameraRig = new Object3D();
  scene.add(cameraRig);
  const camera = new PerspectiveCamera(40, 1, 0.01, 1000);
  camera.position.set(0, 0, 4);
  cameraRig.add(camera);

  const ascii = createAsciiRasterizer(monitor);

  // Lighting: a key light (produces shading) + a low ambient fill. Ambient is
  // kept LOW so faces turned away from the key genuinely fall below the color
  // threshold — otherwise the whole model sits in one luminance band and the
  // shadow color never shows.
  const key = new DirectionalLight(0xffffff, 1.8);
  const ambient = new AmbientLight(0xffffff, 0.22);
  const fill = new DirectionalLight(0xffffff, 0.3);
  // DirectionalLight aims from its position at its target; the target must be
  // in the scene or matrixWorld never updates and the key direction sticks.
  key.target.position.set(0, 0, 0);
  fill.target.position.set(0, 0, 0);
  scene.add(key, key.target, ambient, fill, fill.target);

  let group = null; // orbit pivot (turntable rotation applied here)
  let modelRoot = null; // loaded asset root (bones / clips attach here)
  let mixer = null; // animation mixer (when animated)
  let hasAnimation = false;
  let modelReady = false;
  let disposeables = [];
  // 'auto' uses the animation when available, otherwise spins;
  // 'spin' forces the turntable; 'animation' forces the clip.
  let motionMode = 'auto';
  let activeActionIndex = 0;

  // Pointer follow + trail (canvas-normalized −1…1; trail in cell coords).
  const pointerTarget = { nx: 0, ny: 0 };
  const pointerSmooth = { nx: 0, ny: 0 };
  let trailSamples = [];
  let reducedMotion = false;
  let explodeSmooth = 0;
  let explodeLastMs = 0;

  function clearModel() {
    if (group) {
      scene.remove(group);
      for (const d of disposeables) {
        try {
          d.dispose && d.dispose();
        } catch (e) {}
      }
      disposeables = [];
      group = null;
    }
    modelRoot = null;
    if (mixer) mixer = null;
    hasAnimation = false;
    modelReady = false;
  }

  function deg(v) {
    return ((Number(v) || 0) * Math.PI) / 180;
  }

  function applyLights(settings) {
    // Prefer XYZ lights; fall back to legacy spherical once if XYZ missing.
    const hasXyz =
      settings.keyX != null && settings.keyY != null && settings.keyZ != null;
    if (hasXyz) {
      key.position.set(
        Number(settings.keyX) || 0,
        Number(settings.keyY) || 0,
        Number(settings.keyZ) || 0
      );
      fill.position.set(
        Number(settings.fillX) || 0,
        Number(settings.fillY) || 0,
        Number(settings.fillZ) || 0
      );
    } else {
      const az = deg(settings.lightAzimuth ?? 45);
      const el = deg(settings.lightElevation ?? 40);
      const r = 6;
      key.position.set(
        r * Math.cos(el) * Math.cos(az),
        r * Math.sin(el),
        r * Math.cos(el) * Math.sin(az)
      );
      fill.position.set(
        -r * Math.cos(el) * Math.cos(az) * 0.5,
        Math.max(0.5, r * Math.sin(el) * 0.35),
        -r * Math.cos(el) * Math.sin(az) * 0.5
      );
    }
    key.intensity = Number.isFinite(Number(settings.keyIntensity))
      ? Number(settings.keyIntensity)
      : 1.8;
    fill.intensity = Number.isFinite(Number(settings.fillIntensity))
      ? Number(settings.fillIntensity)
      : 0.3;
    ambient.intensity = Number.isFinite(Number(settings.ambientIntensity))
      ? Number(settings.ambientIntensity)
      : 0.22;
  }

  /**
   * Apply orbit H/V + zoom, with optional smoothed mouse follow.
   * Legacy cameraOmega/Phi/Distance stay mirrored via state.
   */
  function applyCameraOrientation(settings) {
    const follow = !reducedMotion && settings.cameraFollow === 'mouse';
    if (follow) {
      pointerSmooth.nx += (pointerTarget.nx - pointerSmooth.nx) * 0.08;
      pointerSmooth.ny += (pointerTarget.ny - pointerSmooth.ny) * 0.08;
    } else {
      pointerSmooth.nx += (0 - pointerSmooth.nx) * 0.08;
      pointerSmooth.ny += (0 - pointerSmooth.ny) * 0.08;
    }
    const str = follow ? Number(settings.mouseStrength) || 0 : 0;
    const orbitH = Number(settings.orbitH ?? settings.cameraOmega) || 0;
    const orbitV = Number(settings.orbitV ?? settings.cameraPhi) || 0;
    const kappa = Number(settings.cameraKappa) || 0;
    cameraRig.rotation.order = 'XYZ';
    cameraRig.rotation.set(
      deg(orbitH - pointerSmooth.ny * str),
      deg(orbitV + pointerSmooth.nx * str),
      deg(kappa)
    );
    const dist = Math.max(0.5, Number(settings.zoom ?? settings.cameraDistance) || 4);
    camera.position.set(0, 0, dist);
  }

  /**
   * Canvas-local normalized pointer (−1…1). Optionally records a trail sample
   * when trail is enabled.
   */
  function setPointer(nx, ny, settings) {
    pointerTarget.nx = Math.max(-1, Math.min(1, Number(nx) || 0));
    pointerTarget.ny = Math.max(-1, Math.min(1, Number(ny) || 0));
    if (reducedMotion || !settings || !Number(settings.trailEnabled)) return;
    const cols = Math.max(1, Math.round(settings.gridWidth) || 96);
    const rows = Math.max(1, Math.round(settings.gridHeight) || 54);
    const cx = Math.max(0, Math.min(cols - 1, Math.floor(((pointerTarget.nx + 1) / 2) * cols)));
    const cy = Math.max(0, Math.min(rows - 1, Math.floor(((pointerTarget.ny + 1) / 2) * rows)));
    const now = typeof performance !== 'undefined' ? performance.now() : Date.now();
    const last = trailSamples[trailSamples.length - 1];
    if (!last || last.cx !== cx || last.cy !== cy) {
      trailSamples.push({ cx, cy, t: now });
    }
    const maxLen = Math.max(1, Math.round(Number(settings.trailLength) || 8));
    const decay = Math.max(50, Number(settings.trailDecayMs) || 600);
    trailSamples = trailSamples.filter((s) => now - s.t <= decay);
    while (trailSamples.length > maxLen) trailSamples.shift();
  }

  function clearPointer() {
    pointerTarget.nx = 0;
    pointerTarget.ny = 0;
    trailSamples = [];
  }

  function setReducedMotion(on) {
    reducedMotion = !!on;
    if (reducedMotion) {
      pointerTarget.nx = 0;
      pointerTarget.ny = 0;
      trailSamples = [];
    }
  }

  /**
   * Apply object ω/φ/κ (X/Y/Z Euler, degrees). Optional `spinY` (radians) is
   * added to φ so turntable spin keeps the base pose.
   */
  function applyObjectOrientation(settings, spinY = 0) {
    if (!group) return;
    group.rotation.order = 'XYZ';
    group.rotation.set(
      deg(settings.objectOmega),
      deg(settings.objectPhi) + spinY,
      deg(settings.objectKappa)
    );
  }

  function readonlyifyMats(obj) {
    // Force opaque materials so the ASCII shading reads clearly.
    obj.traverse((c) => {
      if (c.isMesh || c.isSkinnedMesh) {
        const ml = Array.isArray(c.material) ? c.material : [c.material];
        for (const m of ml) {
          m.transparent = false;
          m.opacity = 1;
          m.alphaTest = 0.5;
        }
      }
    });
  }

  /**
   * Shift mesh vertices so the asset's bounding-box center is at the origin.
   * Many glTF/OBJ files keep huge vertex offsets on a node at (0,0,0); moving
   * only the pivot fixes one pose but turntable spin wobbles until geometry is
   * recentered.
   */
  function recenterGeometry(root) {
    root.updateMatrixWorld(true);
    const box = new Box3().setFromObject(root);
    if (box.isEmpty()) return;
    const worldCenter = box.getCenter(_centerScratch);

    root.traverse((child) => {
      if (!child.isMesh || child.isSkinnedMesh || !child.geometry) return;
      child.updateWorldMatrix(true, false);
      _centerMatrix.copy(child.matrixWorld).invert();
      const localShift = worldCenter.clone().applyMatrix4(_centerMatrix);
      child.geometry.translate(-localShift.x, -localShift.y, -localShift.z);
      child.geometry.computeBoundingBox();
      if (child.geometry.computeBoundingSphere) child.geometry.computeBoundingSphere();
    });
  }

  /**
   * Fit content into a unit frame and keep the pivot at the world origin.
   * Geometry is recentered; remaining offset lives on the content node so
   * object ω/φ/κ rotate around (0,0,0) and reset is meaningful.
   */
  function centerModel(pivot) {
    const content = pivot.children[0];
    pivot.position.set(0, 0, 0);
    pivot.rotation.set(0, 0, 0);
    pivot.scale.set(1, 1, 1);

    if (content) {
      content.position.set(0, 0, 0);
      recenterGeometry(content);
    }

    pivot.updateMatrixWorld(true);
    const box = new Box3().setFromObject(pivot);
    if (box.isEmpty()) return 1;

    const size = _sizeScratch;
    box.getSize(size);
    const maxDim = Math.max(size.x, size.y, size.z) || 1;
    // Leave a little headroom; fitFrameToObject zooms tight to the silhouette.
    const targetSize = 1.4;
    const scale = targetSize / maxDim;

    if (content) {
      content.scale.multiplyScalar(scale);
      content.updateMatrixWorld(true);
      box.setFromObject(content);
      const center = box.getCenter(_centerScratch);
      content.position.x -= center.x;
      content.position.y -= center.y;
      content.position.z -= center.z;
    }

    pivot.position.set(0, 0, 0);
    pivot.updateMatrixWorld(true);
    return scale;
  }

  /**
   * Camera distance that frames the current model with margin.
   * Uses vertical FOV; aspect from the ASCII grid when available.
   */
  function recommendZoom(settings = {}, margin = 1.12) {
    const fit = fitFrameToObject(settings, { margin });
    return fit.zoom;
  }

  /**
   * Project the model AABB into NDC and return the axis-aligned span.
   * @param {number} spinY radians added to object φ (for turntable samples)
   */
  function projectNdcBounds(settings, spinY = 0) {
    const cols = Math.max(1, Number(settings.gridWidth) || 140);
    const rows = Math.max(1, Number(settings.gridHeight) || 94);
    camera.aspect = cols / Math.max(1e-6, rows * CELL_ASPECT);
    camera.updateProjectionMatrix();
    applyLights(settings);
    applyCameraOrientation(settings);
    applyObjectOrientation(settings, spinY);
    group.updateMatrixWorld(true);
    camera.updateMatrixWorld(true);

    const box = new Box3().setFromObject(group);
    if (box.isEmpty()) return null;
    const min = box.min;
    const max = box.max;
    let minX = Infinity;
    let maxX = -Infinity;
    let minY = Infinity;
    let maxY = -Infinity;
    let any = false;
    for (let ix = 0; ix < 2; ix++) {
      for (let iy = 0; iy < 2; iy++) {
        for (let iz = 0; iz < 2; iz++) {
          _cornerScratch.set(
            ix ? max.x : min.x,
            iy ? max.y : min.y,
            iz ? max.z : min.z
          );
          _projScratch.copy(_cornerScratch).project(camera);
          if (!Number.isFinite(_projScratch.x) || !Number.isFinite(_projScratch.y)) continue;
          // Ignore points behind / far clipped
          if (_projScratch.z < -1 || _projScratch.z > 1) continue;
          any = true;
          minX = Math.min(minX, _projScratch.x);
          maxX = Math.max(maxX, _projScratch.x);
          minY = Math.min(minY, _projScratch.y);
          maxY = Math.max(maxY, _projScratch.y);
        }
      }
    }
    if (!any) return null;
    return {
      minX,
      maxX,
      minY,
      maxY,
      width: Math.max(0.02, maxX - minX),
      height: Math.max(0.02, maxY - minY),
    };
  }

  /**
   * Fit camera zoom (and suggested canvas aspect) so the silhouette fills the
   * frame — removes empty letterbox around the object. Samples a full turntable
   * so spin/orbit loops stay inside the crop.
   * @returns {{ zoom: number, aspect: number, ndcW: number, ndcH: number }}
   */
  function fitFrameToObject(settings = {}, { margin = 1.1, spinSamples = 12 } = {}) {
    const fallbackZoom = Number(settings.zoom) || DEFAULT_SETTINGS.zoom;
    if (!group) {
      return { zoom: fallbackZoom, aspect: 1, ndcW: 1, ndcH: 1 };
    }

    let minX = Infinity;
    let maxX = -Infinity;
    let minY = Infinity;
    let maxY = -Infinity;
    const samples = Math.max(1, spinSamples | 0);
    for (let i = 0; i < samples; i++) {
      const spinY = samples === 1 ? 0 : (i / samples) * Math.PI * 2;
      const b = projectNdcBounds(settings, spinY);
      if (!b) continue;
      minX = Math.min(minX, b.minX);
      maxX = Math.max(maxX, b.maxX);
      minY = Math.min(minY, b.minY);
      maxY = Math.max(maxY, b.maxY);
    }
    if (!Number.isFinite(minX)) {
      return { zoom: fallbackZoom, aspect: 1, ndcW: 1, ndcH: 1 };
    }

    const ndcW = Math.max(0.05, maxX - minX);
    const ndcH = Math.max(0.05, maxY - minY);
    // Fill the tighter axis to ~full NDC (-1..1 ⇒ span 2) with a small pad.
    const span = Math.max(ndcW, ndcH);
    const desired = 2 / Math.max(1.02, margin);
    let zoom = fallbackZoom * (span / desired);
    zoom = Math.min(10, Math.max(1.6, Math.round(zoom * 100) / 100));

    // Canvas pixel aspect that matches the silhouette (crops empty strips).
    const aspect = ndcW / ndcH;

    return { zoom, aspect, ndcW, ndcH };
  }

  /** Zero object euler and re-pin pivot at the origin (settings ω/φ/κ still apply). */
  function resetModelTransform(settings) {
    if (!group) return;
    group.position.set(0, 0, 0);
    group.scale.set(1, 1, 1);
    applyObjectOrientation(settings || DEFAULT_SETTINGS, 0);
  }

  /**
   * Load a model file.
   * @param {File} file - .fbx/.obj/.gltf/.glb/.usdz/.usd/.usda/.usdc
   * @param {object} settings
   * @returns {Promise<{animations: string[], name: string}>}
   */
  async function loadModel(file, settings) {
    const name = file.name;
    const ext = (name.split('.').pop() || '').toLowerCase();
    const url = URL.createObjectURL(file);

    clearModel();

    let loaded;
    try {
      if (ext === 'fbx') {
        const FBXLoader = await getLoader('fbx');
        loaded = await new Promise((res, rej) =>
          new FBXLoader().load(url, res, undefined, rej)
        );
      } else if (ext === 'obj') {
        const OBJLoader = await getLoader('obj');
        loaded = await new Promise((res, rej) =>
          new OBJLoader().load(url, res, undefined, rej)
        );
      } else if (ext === 'gltf' || ext === 'glb') {
        const GLTFLoader = await getLoader('gltf');
        const gltf = await new Promise((res, rej) =>
          new GLTFLoader().load(url, res, undefined, rej)
        );
        // glTF/GLOBAL loader returns { scene, animations, ... }.
        group = gltf.scene || gltf;
        group.animations = gltf.animations || [];
        loaded = group;
      } else if (ext === 'usdz' || ext === 'usd' || ext === 'usda' || ext === 'usdc') {
        const USDLoader = await getLoader('usd');
        loaded = await new Promise((res, rej) =>
          new USDLoader().load(url, res, undefined, rej)
        );
      } else {
        throw new Error('Unsupported file type: .' + ext);
      }
    } finally {
      URL.revokeObjectURL(url);
    }

    return finalizeModel(loaded, name, settings);
  }

  /**
   * Load a model from a URL (embed / remote). Same formats as loadModel.
   * @param {string} url
   * @param {string} [nameHint] - filename for extension detection
   * @param {object} settings
   */
  async function loadModelFromUrl(url, nameHint, settings) {
    const name = nameHint || url.split('/').pop()?.split('?')[0] || 'model.glb';
    const ext = (name.split('.').pop() || '').toLowerCase();

    clearModel();

    let loaded;
    if (ext === 'fbx') {
      const FBXLoader = await getLoader('fbx');
      loaded = await new Promise((res, rej) => new FBXLoader().load(url, res, undefined, rej));
    } else if (ext === 'obj') {
      const OBJLoader = await getLoader('obj');
      loaded = await new Promise((res, rej) => new OBJLoader().load(url, res, undefined, rej));
    } else if (ext === 'gltf' || ext === 'glb') {
      const GLTFLoader = await getLoader('gltf');
      const gltf = await new Promise((res, rej) => new GLTFLoader().load(url, res, undefined, rej));
      group = gltf.scene || gltf;
      group.animations = gltf.animations || [];
      loaded = group;
    } else if (ext === 'usdz' || ext === 'usd' || ext === 'usda' || ext === 'usdc') {
      const USDLoader = await getLoader('usd');
      loaded = await new Promise((res, rej) => new USDLoader().load(url, res, undefined, rej));
    } else {
      throw new Error('Unsupported file type: .' + ext);
    }

    return finalizeModel(loaded, name, settings);
  }

  /**
   * Load a multi-file glTF scene from a dropped/selected folder. The .gltf
   * references external buffers + textures by relative path, so we snapshot
   * every file's bytes into blob: URLs and rewrite buffer/image URIs before
   * parsing, making the scene self-contained in the browser.
   * @param {FileList|File[]} files
   * @param {object} settings
   */
  async function loadGltfFolder(files, settings) {
    const list = [...files];
    const gltfFile = list.find((f) => /\.gltf$/i.test(f.name));
    if (!gltfFile) throw new Error('No .gltf file found in the selected folder.');

    clearModel();

    const gltfRel = pathOf(gltfFile);
    const gltfDir = gltfRel.split('/').slice(0, -1).join('/');

    const urlMap = new Map();
    for (const f of list) {
      if (!RESOURCE_EXT.test(f.name)) continue;
      urlMap.set(normalizePath(pathOf(f)), URL.createObjectURL(f));
    }

    let json;
    try {
      const res = await fetch(urlMap.get(normalizePath(gltfRel)));
      json = JSON.parse(await res.text());

      for (const buf of json.buffers || []) {
        if (buf.uri && !/^(data|blob):/i.test(buf.uri)) {
          const target = resolveResource(gltfDir, buf.uri, urlMap);
          if (target !== undefined) buf.uri = target;
        }
      }
      for (const img of json.images || []) {
        if (img.uri && !/^(data|blob):/i.test(img.uri)) {
          const target = resolveResource(gltfDir, img.uri, urlMap);
          if (target !== undefined) img.uri = target;
        }
      }

      const GLTFLoader = await getLoader('gltf');
      const loaded = await new GLTFLoader().parseAsync(json, '');
      const scene = loaded.scene;
      scene.animations = loaded.animations || [];
      return finalizeModel(scene, gltfFile.name, settings);
    } finally {
      urlMap.forEach((u) => URL.revokeObjectURL(u));
    }
  }

  /** Attach the loaded group to the scene and set up animation/motion state. */
  function finalizeModel(loaded, name, settings) {
    const pivot = new Object3D();
    pivot.add(loaded);
    centerModel(pivot);
    group = pivot;
    modelRoot = loaded;

    // Fresh pose: object euler from settings (framing defaults are 0,0,0).
    applyLights(settings);
    applyCameraOrientation(settings);
    applyObjectOrientation(settings, 0);
    readonlyifyMats(loaded);
    scene.add(group);

    // Collect animations from the loaded model.
    const animations = (loaded.animations || []).filter(Boolean);
    hasAnimation = animations.length > 0;

    // A model with no clips can't play an animation; fall back to auto (spin).
    if (!hasAnimation) motionMode = 'auto';

    if (hasAnimation) {
      mixer = new AnimationMixer(modelRoot);
      // Pre-create actions but don't play yet; play on first render.
      modelRoot.__actions = animations.map((clip) => mixer.clipAction(clip));
    }

    modelReady = true;
    return {
      name,
      animations: animations.map((a, i) => ({ name: a.name || `Animation ${i + 1}`, index: i })),
      hasAnimation,
    };
  }

  /**
   * Set which FBX animation clip is active (index into loaded animations),
   * and switch motion mode to animation.
   */
  function setActiveAnimation(index) {
    motionMode = 'animation';
    activeActionIndex = index;
    if (!modelRoot || !modelRoot.__actions) return;
    modelRoot.__actions.forEach((a, iA) => {
      if (iA === index) {
        a.reset();
        a.play();
      } else {
        a.stop();
      }
    });
  }

  function setMotionMode(mode) {
    if (['auto', 'spin', 'animation'].includes(mode)) motionMode = mode;
  }

  /**
   * Load an FBX or glTF/GLB purely for its animation clip(s) and add them to
   * the current model's mixer. Works when the clip and model share the same
   * bone/property names (e.g. Mixamo). Returns the animations added.
   */
  async function addAnimationFromFbx(file, settings) {
    const ext = (file.name.split('.').pop() || '').toLowerCase();
    if (!['fbx', 'gltf', 'glb'].includes(ext)) {
      throw new Error('Animation file must be .fbx, .gltf or .glb');
    }
    if (!mixer) throw new Error('Load a model first to attach an animation.');

    const url = URL.createObjectURL(file);
    let loaded;
    try {
      if (ext === 'fbx') {
        const FBXLoader = await getLoader('fbx');
        loaded = await new Promise((res, rej) =>
          new FBXLoader().load(url, res, undefined, rej)
        );
      } else {
        const GLTFLoader = await getLoader('gltf');
        const gltf = await new Promise((res, rej) =>
          new GLTFLoader().load(url, res, undefined, rej)
        );
        loaded = { animations: gltf.animations || [] };
      }
    } finally {
      URL.revokeObjectURL(url);
    }

    const clips = (loaded.animations || []).filter(Boolean);
    if (!clips.length) throw new Error('That FBX contains no animation clips.');

    const added = [];
    for (const clip of clips) {
      const action = mixer.clipAction(clip);
      modelRoot.__actions.push(action);
      added.push({ name: clip.name || 'Imported animation', index: modelRoot.__actions.length - 1 });
    }
    hasAnimation = true;
    motionMode = 'animation';
    setActiveAnimation(modelRoot.__actions.length - 1);
    return added;
  }

  function setSettings(settings) {
    applyLights(settings);
    applyCameraOrientation(settings);
    applyObjectOrientation(settings, 0);
  }

  /**
   * Render a single ASCII frame at the given loop timeline time `time` (in
   * seconds, in [0, loopDur)). For animated clips the timeline is mapped onto
   * one full clip cycle — a loop-back frame at time==loopDur lands on the
   * clip's start pose, guaranteeing a seamless loop. For spin mode we rotate a
   * full 360°, also seamless.
   */
  function renderAt(time, settings, loopDur) {
    const dur = loopDur || Math.max(0.1, settings.duration);
    const speed = Math.max(0.01, Number(settings.speedFactor) || 1);
    // Scale playback through the same seamless cycle (speed does not break loops).
    const cycleT = (((time * speed) % dur) + dur) % dur;
    const act = chooseAction();

    const useAnim = mixer &&
      hasAnimation &&
      act &&
      (motionMode === 'animation' || (motionMode === 'auto' && hasAnimation));

    applyLights(settings);
    applyCameraOrientation(settings);

    if (useAnim) {
      const clipDur = act.getClip().duration || dur;
      // Map GIF progress -> clip progress over one full cycle.
      const t = (cycleT / dur) * clipDur;
      // Keep the action playing: mixer.setTime() only advances actions that are
      // in the mixer's active set, so a stopped action would never drive the bones.
      if (!act.isRunning()) act.play();
      mixer.setTime(t);
      // Keep the user-set base pose while the clip drives bones/meshes.
      applyObjectOrientation(settings, 0);
    } else {
      // Seamless turntable: one full revolution over the GIF window, on top of φ.
      applyObjectOrientation(settings, (cycleT / dur) * Math.PI * 2);
    }

    // Resize renderer to the ASCII grid size; the luminance grid is one sample per
    // cell regardless of the character size, so scaling glyphs never re-shades.
    const gridW = settings.gridWidth;
    const gridH = settings.gridHeight;
    ascii.setCellSize(settings.cellSize);
    if (typeof ascii.setCellSpacing === 'function') {
      ascii.setCellSpacing(settings.cellSpacing);
    }
    ascii.setContrast(settings.contrast);
    ascii.setSize(gridW, gridH);
    renderer.setSize(gridW, gridH, false);

    renderer.render(scene, camera);
    ascii.drawToLum(renderer.domElement);

    let explodeTarget = Number(settings.explodeAmount) || 0;
    if (settings.formationMode === 'assemble') explodeTarget = 1 - explodeTarget;
    if (reducedMotion) {
      explodeSmooth = 0;
      explodeTarget = 0;
    } else {
      const nowMs = typeof performance !== 'undefined' ? performance.now() : Date.now();
      const dt = explodeLastMs ? Math.min(0.05, (nowMs - explodeLastMs) / 1000) : 0;
      explodeLastMs = nowMs;
      const trans = Math.max(0, Number(settings.transitionMs) || 0) / 1000;
      if (trans <= 0 || dt <= 0) {
        explodeSmooth = explodeTarget;
      } else {
        const k = 1 - Math.exp(-dt / Math.max(0.001, trans * 0.35));
        explodeSmooth += (explodeTarget - explodeSmooth) * k;
      }
    }
    const explode = explodeSmooth;

    const now = typeof performance !== 'undefined' ? performance.now() : Date.now();
    const decay = Math.max(50, Number(settings.trailDecayMs) || 600);
    const trail =
      !reducedMotion && Number(settings.trailEnabled)
        ? trailSamples
            .filter((s) => now - s.t <= decay)
            .map((s) => ({
              cx: s.cx,
              cy: s.cy,
              age: now - s.t,
              alpha: Math.max(0, 1 - (now - s.t) / decay),
            }))
        : [];

    ascii.rasterize({
      colors: bandColorsFor(settings),
      thresholds: thresholdsFor(settings),
      dither: settings.dither,
      cellMode: settings.cellMode || 'text',
      cellOutline: !!Number(settings.cellOutline),
      gamma: Number(settings.gamma) || 1,
      bold: !!Number(settings.bold),
      bgColor: settings.bgColor || 'transparent',
      paperColor: settings.paperColor || null,
      colorMode: Number(settings.colorMode) || 3,
      colorMix: Number(settings.colorMix) || 0,
      explodeAmount: explode,
      trail,
      trailStroke: !!Number(settings.trailStroke),
    });
  }

  // Band inks: letter charcoal, accent-hot, accent-warm (Finic-style).
  function bandColorsFor(s) {
    return [s.colorA || '#1a1a1a', s.colorB || '#FF6700', s.colorC || '#FFC043'];
  }

  // Ascending 0..1 band boundaries (empty for 1 ink).
  function thresholdsFor(s) {
    if (s.colorMode === 1) return [];
    if (s.colorMode === 3) {
      const lo = clamp01(Number(s.threshold) || 0);
      const hi = clamp01(Number(s.split) || 1);
      return [Math.min(lo, hi), Math.max(lo, hi)];
    }
    return [clamp01(Number(s.threshold) || 0.5)];
  }

  /**
   * Sample opaque cell luminances across the loop and return sorted stats.
   * @returns {{sorted: number[], mean: number, p10: number, p50: number, p90: number, spread: number}|null}
   */
  function sampleLumStats(settings, samples = 6) {
    const dur = Math.max(0.1, settings.duration);
    const lums = [];
    for (let k = 0; k < samples; k++) {
      renderAt((k / samples) * dur, settings, dur);
      lums.push(...ascii.cellLums());
    }
    const n = lums.length;
    if (!n) return null;
    const sorted = lums.slice().sort((a, b) => a - b);
    const p = (f) => sorted[Math.min(n - 1, Math.max(0, Math.floor(f * n)))];
    let sum = 0;
    for (let i = 0; i < n; i++) sum += sorted[i];
    const p10 = p(0.1);
    const p90 = p(0.9);
    return {
      sorted,
      mean: sum / n,
      p10,
      p50: p(0.5),
      p90,
      spread: p90 - p10,
    };
  }

  /**
   * Suggest band boundaries for 3-ink mode from the loop's luminance
   * distribution. Spread/rotating distributions split by terciles; tight ones
   * (uniformly lit models) pin the highlight to the top quartile so all three
   * inks appear. Pooling several frames over a full cycle averages out any
   * single pose's bias.
   * @returns {{threshold: number, split: number}}
   */
  function balancedThresholds(settings) {
    const stats = sampleLumStats(settings, 8);
    if (!stats) return { threshold: 0.33, split: 0.67 };
    const { sorted } = stats;
    const n = sorted.length;
    const p = (f) => sorted[Math.min(n - 1, Math.max(0, Math.floor(f * n)))];
    let lo = clamp01(p(1 / 3));
    let hi = clamp01(p(2 / 3));
    if (hi - lo < 0.12) {
      // Tight cluster: split into bottom/middle/top quartiles so the highlight
      // band is guaranteed some cells.
      lo = clamp01(p(0.3));
      hi = clamp01(p(0.75));
    }
    if (hi - lo < 0.03) {
      lo = 0.35;
      hi = 0.7;
    }

    // Keep every band inside the observed luminance range: a boundary at or
    // above the brightest lens leaves the highlight band empty (or below the
    // darkest lens empties the shadow band), and rounding to 2dp must not push
    // a boundary past the data. Each band keeps at least a `margin` slice.
    const minL = sorted[0];
    const maxL = sorted[n - 1];
    const margin = 0.02;
    const loMin = minL + margin;
    const hiMax = maxL - margin;
    if (hiMax - loMin < 0.04) {
      // Distribution too flat for a meaningful 3-way split; default to a thin
      // spread anchored on the dark end.
      lo = Math.max(0.02, Math.round(minL * 100) / 100);
      hi = Math.min(0.98, Math.round((minL + 0.06) * 100) / 100);
    } else {
      lo = clamp01(Math.min(Math.max(lo, loMin), hiMax - 0.03));
      hi = clamp01(Math.max(Math.min(hi, hiMax), lo + 0.03));
    }
    return {
      threshold: Math.round(lo * 100) / 100,
      split: Math.round(hi * 100) / 100,
    };
  }

  /** Area-weighted mean material color / saturation from the loaded mesh. */
  function sampleMaterialStats() {
    if (!modelRoot) return null;
    let r = 0;
    let g = 0;
    let b = 0;
    let satSum = 0;
    let wSum = 0;
    modelRoot.traverse((c) => {
      if (!c.isMesh && !c.isSkinnedMesh) return;
      const mats = Array.isArray(c.material) ? c.material : [c.material];
      let w = 1;
      if (c.geometry) {
        if (!c.geometry.boundingSphere) c.geometry.computeBoundingSphere?.();
        const rad = c.geometry.boundingSphere?.radius;
        if (Number.isFinite(rad) && rad > 0) w = Math.max(0.05, rad * rad);
      }
      for (const m of mats) {
        if (!m?.color) continue;
        _matColor.copy(m.color);
        r += _matColor.r * w;
        g += _matColor.g * w;
        b += _matColor.b * w;
        const mx = Math.max(_matColor.r, _matColor.g, _matColor.b);
        const mn = Math.min(_matColor.r, _matColor.g, _matColor.b);
        satSum += (mx > 1e-4 ? (mx - mn) / mx : 0) * w;
        wSum += w;
      }
    });
    if (wSum < 1e-6) return { r: 0.55, g: 0.5, b: 0.45, sat: 0.15, lum: 0.5, hue: 30 };
    r /= wSum;
    g /= wSum;
    b /= wSum;
    const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    return { r, g, b, sat: satSum / wSum, lum, hue: rgbToHue(r, g, b) };
  }

  /** Fit key/fill placement to the model's bounding proportions. */
  function lightsFromBounds() {
    if (!group) {
      return {
        keyX: DEFAULT_SETTINGS.keyX,
        keyY: DEFAULT_SETTINGS.keyY,
        keyZ: DEFAULT_SETTINGS.keyZ,
        fillX: DEFAULT_SETTINGS.fillX,
        fillY: DEFAULT_SETTINGS.fillY,
        fillZ: DEFAULT_SETTINGS.fillZ,
      };
    }
    group.updateMatrixWorld(true);
    const box = new Box3().setFromObject(group);
    if (box.isEmpty()) {
      return {
        keyX: DEFAULT_SETTINGS.keyX,
        keyY: DEFAULT_SETTINGS.keyY,
        keyZ: DEFAULT_SETTINGS.keyZ,
        fillX: DEFAULT_SETTINGS.fillX,
        fillY: DEFAULT_SETTINGS.fillY,
        fillZ: DEFAULT_SETTINGS.fillZ,
      };
    }
    box.getSize(_sizeScratch);
    const sx = Math.max(_sizeScratch.x, 0.01);
    const sy = Math.max(_sizeScratch.y, 0.01);
    const sz = Math.max(_sizeScratch.z, 0.01);
    const tall = sy / Math.max(sx, sz);
    const wide = sx / Math.max(sy, sz);
    const keyX = round2(2.2 + Math.min(1.2, wide * 0.35));
    const keyY = round2(4.2 + Math.min(2.4, tall * 1.1));
    const keyZ = round2(3.0 + Math.min(1.0, sz / Math.max(sx, sy) * 0.8));
    return {
      keyX,
      keyY,
      keyZ,
      fillX: round2(-keyX * 0.55),
      fillY: round2(Math.max(0.8, keyY * 0.28)),
      fillZ: round2(-keyZ * 0.45),
    };
  }

  /**
   * Soft exposure: fill the form with midtones; avoid blown highlights + crushed
   * shadows. Targets mean ≈ 0.55 and p90−p10 ≈ 0.36–0.44.
   */
  function tuneExposure(stats, draft, mat) {
    let keyI = Number(draft.keyIntensity) || DEFAULT_SETTINGS.keyIntensity;
    let fillI = Number(draft.fillIntensity) || DEFAULT_SETTINGS.fillIntensity;
    let amb = Number(draft.ambientIntensity) || DEFAULT_SETTINGS.ambientIntensity;
    let contrast = Number(draft.contrast);
    if (!Number.isFinite(contrast)) contrast = DEFAULT_SETTINGS.contrast;
    let gamma = Number(draft.gamma) || DEFAULT_SETTINGS.gamma;

    const mean = stats.mean;
    const spread = stats.spread;
    const matLum = mat?.lum ?? 0.5;

    // Prefer ambient/fill lifts over a harsher key — ASCII needs filled midtones.
    if (mean < 0.4) {
      amb += 0.1;
      fillI += 0.08;
      keyI += 0.08;
    } else if (mean < 0.5) {
      amb += 0.05;
      fillI += 0.04;
    } else if (mean > 0.68) {
      keyI -= 0.18;
      amb = Math.max(0.28, amb - 0.04);
      gamma = Math.min(1.25, gamma + 0.04);
    } else if (mean > 0.6) {
      keyI -= 0.08;
    }

    if (spread < 0.26) {
      keyI += 0.18;
      fillI = Math.max(0.25, fillI - 0.04);
      amb = Math.max(0.28, amb - 0.04);
      contrast = Math.min(22, contrast + 6);
    } else if (spread < 0.34) {
      keyI += 0.08;
      contrast = Math.min(16, contrast + 4);
    } else if (spread > 0.55) {
      keyI -= 0.14;
      amb = Math.min(0.65, amb + 0.08);
      fillI = Math.min(0.9, fillI + 0.06);
      contrast = Math.max(0, contrast - 6);
      gamma = Math.max(0.95, gamma - 0.03);
    }

    if (matLum < 0.28) {
      amb += 0.08;
      fillI += 0.06;
      keyI += 0.1;
    } else if (matLum > 0.72) {
      keyI -= 0.1;
      gamma = Math.min(1.3, gamma + 0.04);
    }

    return {
      keyIntensity: round2(clamp(keyI, 0.7, 2.2)),
      fillIntensity: round2(clamp(fillI, 0.2, 1.1)),
      ambientIntensity: round2(clamp(amb, 0.25, 0.75)),
      contrast: Math.round(clamp(contrast, -10, 28) / 2) * 2,
      gamma: round2(clamp(gamma, 0.9, 1.35)),
    };
  }

  /**
   * Derive lights, exposure, mix, and band cuts for a freshly imported model.
   * Call after load when the model has no stored snapshot yet.
   * @param {object} settings
   * @returns {object} settings patch (does not mutate `settings`)
   */
  function calibrateLook(settings) {
    if (!modelReady) return {};

    const mat = sampleMaterialStats();
    const placement = lightsFromBounds();
    let draft = {
      ...settings,
      ...placement,
      keyIntensity: DEFAULT_SETTINGS.keyIntensity,
      fillIntensity: DEFAULT_SETTINGS.fillIntensity,
      ambientIntensity: DEFAULT_SETTINGS.ambientIntensity,
      contrast: DEFAULT_SETTINGS.contrast,
      gamma: DEFAULT_SETTINGS.gamma,
    };

    // Two probe passes: place lights, measure, retune, measure again.
    for (let pass = 0; pass < 2; pass++) {
      const stats = sampleLumStats(draft, pass === 0 ? 4 : 6);
      if (!stats) break;
      Object.assign(draft, tuneExposure(stats, draft, mat));
    }

    const sat = mat?.sat ?? 0.15;
    // Finic: colorMixRatio splits accents; keep it modest so the letter form dominates.
    const colorMix = 0.28;

    // Always use 3-ink bands on first look so midtones carry form.
    const bal = balancedThresholds({ ...draft, colorMode: 3 });

    return {
      ...placement,
      keyX: 2,
      keyY: 5,
      keyZ: 4,
      keyIntensity: draft.keyIntensity,
      fillIntensity: Math.min(draft.fillIntensity, 0.2),
      ambientIntensity: Math.max(draft.ambientIntensity, 0.55),
      contrast: draft.contrast,
      gamma: Math.max(draft.gamma, 1.25),
      colorMix,
      colorMode: 3,
      cellOutline: 0,
      threshold: bal.threshold,
      split: bal.split,
      __matHue: mat?.hue ?? 30,
      __matSat: sat,
      __matLum: mat?.lum ?? 0.5,
    };
  }

  function clamp01(v) {
    return Number.isFinite(v) ? (v < 0 ? 0 : v > 1 ? 1 : v) : 0.5;
  }

  function clamp(v, lo, hi) {
    return Math.min(hi, Math.max(lo, v));
  }

  function round2(v) {
    return Math.round(v * 100) / 100;
  }

  function rgbToHue(r, g, b) {
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

  function chooseAction() {
    if (!modelRoot || !modelRoot.__actions || !modelRoot.__actions.length) return null;
    return modelRoot.__actions[activeActionIndex] || modelRoot.__actions[0];
  }

  /**
   * Re-render the current frame (used for live preview after a setting change).
   * `t` is a time in seconds; static models use it for spin.
   */
  function renderPreview(t, settings) {
    renderAt(t, settings);
  }

  /**
   * Capture a seamless looping GIF.
   * @param {object} settings
   * @returns {Promise<Uint8Array>}
   */
  async function capture(settings) {
    const fps = Math.max(2, Math.min(MAX_FPS, settings.fps));
    const frames = Math.max(2, Math.round(settings.duration * fps));

    // GIF window length. For animated models the clip is mapped onto one full
    // cycle within this window by renderAt(), so seamlessness is automatic.
    const dur = Math.max(0.1, settings.duration);

    const delayMs = Math.max(MIN_GIF_FRAME_DELAY_MS, Math.round((dur / frames) * 1000));

    // Make `frames + 1` distinct canvases: we include the loop-back frame
    // (time==dur == time==0) for a pure seamless loop, then drop the duplicate.
    const framesList = [];
    const total = frames + 1;
    for (let i = 0; i < total; i++) {
      const t = (i / frames) * dur; // last i == frames -> t == dur == time 0
      renderAt(t, settings, dur);
      const c = document.createElement('canvas');
      c.width = monitor.width;
      c.height = monitor.height;
      c.getContext('2d').drawImage(monitor, 0, 0);
      framesList.push(c);
    }
    framesList.pop(); // drop the duplicate loop-back frame

    const { encodeAsciiGif } = await getGifExport();
    return encodeAsciiGif({
      frames: framesList,
      colors: bandColorsFor(settings),
      delay: delayMs,
      width: monitor.width,
      height: monitor.height,
    });
  }

  /**
   * Asynchronous variant of capture. Yields to the event loop between frames and
   * between encodes so a long render doesn't freeze the page, and reports real
   * progress via `onProgress` (0..1). Returns the same GIF bytes.
   */
  async function captureAsync(settings, onProgress = () => {}) {
    const fps = Math.max(2, Math.min(MAX_FPS, settings.fps));
    const frames = Math.max(2, Math.round(settings.duration * fps));
    const dur = Math.max(0.1, settings.duration);
    const delayMs = Math.max(MIN_GIF_FRAME_DELAY_MS, Math.round((dur / frames) * 1000));

    const total = frames + 1;
    const framesList = [];
    for (let i = 0; i < total; i++) {
      const t = (i / frames) * dur;
      renderAt(t, settings, dur);
      const c = document.createElement('canvas');
      c.width = monitor.width;
      c.height = monitor.height;
      c.getContext('2d').drawImage(monitor, 0, 0);
      framesList.push(c);
      onProgress(0.5 * ((i + 1) / total));
      await yieldToEventLoop();
    }
    framesList.pop(); // drop the duplicate loop-back frame

    const { encodeAsciiGifAsync } = await getGifExport();
    return encodeAsciiGifAsync({
      frames: framesList,
      colors: bandColorsFor(settings),
      delay: delayMs,
      width: monitor.width,
      height: monitor.height,
      onProgress: (p) => onProgress(0.5 + 0.5 * p),
    });
  }

  function yieldToEventLoop() {
    return new Promise((resolve) => setTimeout(resolve, 0));
  }

  return {
    loadModel,
    loadModelFromUrl,
    loadGltfFolder,
    setActiveAnimation,
    setMotionMode,
    addAnimationFromFbx,
    setSettings,
    setPointer,
    clearPointer,
    setReducedMotion,
    renderAt,
    renderPreview,
    capture,
    captureAsync,
    balancedThresholds,
    calibrateLook,
    clearModel,
    recommendZoom,
    fitFrameToObject,
    resetModelTransform,
    get ascii() {
      return ascii;
    },
    get hasAnimation() {
      return hasAnimation;
    },
    get motionMode() {
      return motionMode;
    },
    get renderer() {
      return renderer;
    },
    /** Scene root suitable for GLB re-export (centered model + clips). */
    getExportRoot() {
      return modelRoot;
    },
  };
}
