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
  AnimationMixer,
} from 'three';
import { createAsciiRasterizer } from './renderer/ascii.js';

const RESOURCE_EXT = /\.(gltf|bin|png|jpe?g|webp|ktx2|dds|exr|basis|json)$/i;

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
  gridWidth: 96,
  gridHeight: 54,
  // Two-tone ASCII shading. Values chosen by WCAG contrast math so both bands
  // read clearly on the light page:
  //   shadow #151921 -> 17.6:1 vs the white frame
  //   highlight #1d4ed8 -> 6.7:1 vs the white frame, ~2.6:1 apart from shadow
  colorA: '#151921', // shadow / lower band
  colorB: '#1d4ed8', // highlight / upper band
  colorC: '#3f4f73', // mid color, between shadow and highlight on the page
  paletteId: 'denim', // active ink palette preset (chip highlight)
  threshold: 0.5, // shadow / upper-boundary (color bands)
  split: 0.67, // shadow/mid split (mid / highlight boundary)
  colorMode: 2, // number of ink colors: 1 | 2 | 3
  dither: 'none', // 'none' | 'bayer4x4' | 'bayer8x8' (mix inks in mid-tones)
  contrast: 0, // luminance contrast pre-pass (-50..50)
  cellSize: 8, // px character cell width (height is ~1.75x)
  delay: 80, // ms per frame
  fps: 12,
  duration: 1.5, // seconds (GIF length)
  lightAzimuth: 45,
  lightElevation: 40,
  // Object base orientation (Euler ω/φ/κ → X/Y/Z, degrees). Spin adds to φ (Y).
  objectOmega: 0,
  objectPhi: 0,
  objectKappa: 0,
  // Camera rig orientation (Euler ω/φ/κ → X/Y/Z, degrees) around the origin.
  cameraOmega: 0,
  cameraPhi: 0,
  cameraKappa: 0,
  cameraDistance: 4, // camera Z offset on the rig (larger = zoomed out)
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

  let group = null; // loaded model group
  let mixer = null; // animation mixer (when animated)
  let hasAnimation = false;
  let modelReady = false;
  let disposeables = [];
  // 'auto' uses the animation when available, otherwise spins;
  // 'spin' forces the turntable; 'animation' forces the clip.
  let motionMode = 'auto';
  let activeActionIndex = 0;

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
    if (mixer) mixer = null;
    hasAnimation = false;
    modelReady = false;
  }

  function deg(v) {
    return ((Number(v) || 0) * Math.PI) / 180;
  }

  function applyLights(settings) {
    const az = deg(settings.lightAzimuth);
    const el = deg(settings.lightElevation);
    const r = 6;
    // Spherical placement: azimuth around Y, elevation above the XZ plane.
    key.position.set(
      r * Math.cos(el) * Math.cos(az),
      r * Math.sin(el),
      r * Math.cos(el) * Math.sin(az)
    );
    // Soft fill opposite the key so both sides stay readable.
    fill.position.set(
      -r * Math.cos(el) * Math.cos(az) * 0.5,
      Math.max(0.5, r * Math.sin(el) * 0.35),
      -r * Math.cos(el) * Math.sin(az) * 0.5
    );
  }

  /** Apply camera ω/φ/κ (X/Y/Z Euler, degrees) and distance on the orbit rig. */
  function applyCameraOrientation(settings) {
    cameraRig.rotation.order = 'XYZ';
    cameraRig.rotation.set(
      deg(settings.cameraOmega),
      deg(settings.cameraPhi),
      deg(settings.cameraKappa)
    );
    const dist = Math.max(0.5, Number(settings.cameraDistance) || 4);
    camera.position.set(0, 0, dist);
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

  function centerModel(obj) {
    const box = new Box3().setFromObject(obj);
    const size = new Vector3();
    const center = new Vector3();
    box.getSize(size);
    box.getCenter(center);
    const maxDim = Math.max(size.x, size.y, size.z) || 1;
    const scale = 1.8 / maxDim;

    // Preserve relative proportions but normalize.
    obj.scale.multiplyScalar(scale);
    obj.position.sub(center.multiplyScalar(scale));
    return scale;
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
    group = loaded;
    centerModel(group);
    applyLights(settings);
    applyCameraOrientation(settings);
    applyObjectOrientation(settings, 0);
    readonlyifyMats(group);
    scene.add(group);

    // Collect animations from the loaded model.
    const animations = (group.animations || []).filter(Boolean);
    hasAnimation = animations.length > 0;

    // A model with no clips can't play an animation; fall back to auto (spin).
    if (!hasAnimation) motionMode = 'auto';

    if (hasAnimation) {
      mixer = new AnimationMixer(group);
      // Pre-create actions but don't play yet; play on first render.
      group.__actions = animations.map((clip) => mixer.clipAction(clip));
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
    if (!group || !group.__actions) return;
    group.__actions.forEach((a, iA) => {
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
      group.__actions.push(action);
      added.push({ name: clip.name || 'Imported animation', index: group.__actions.length - 1 });
    }
    hasAnimation = true;
    motionMode = 'animation';
    setActiveAnimation(group.__actions.length - 1);
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
      const t = (time / dur) * clipDur;
      // Keep the action playing: mixer.setTime() only advances actions that are
      // in the mixer's active set, so a stopped action would never drive the bones.
      if (!act.isRunning()) act.play();
      mixer.setTime(t);
      // Keep the user-set base pose while the clip drives bones/meshes.
      applyObjectOrientation(settings, 0);
    } else {
      // Seamless turntable: one full revolution over the GIF window, on top of φ.
      applyObjectOrientation(settings, (time / dur) * Math.PI * 2);
    }

    // Resize renderer to the ASCII grid size; the luminance grid is one sample per
    // cell regardless of the character size, so scaling glyphs never re-shades.
    const gridW = settings.gridWidth;
    const gridH = settings.gridHeight;
    ascii.setCellSize(settings.cellSize);
    ascii.setContrast(settings.contrast);
    ascii.setSize(gridW, gridH);
    renderer.setSize(gridW, gridH, false);

    renderer.render(scene, camera);
    ascii.drawToLum(renderer.domElement);
    ascii.rasterize({
      colors: bandColorsFor(settings),
      thresholds: thresholdsFor(settings),
      dither: settings.dither,
    });
  }

  // Band inks, ordered dark -> bright for the rasterizer.
  function bandColorsFor(s) {
    if (s.colorMode === 1) return [s.colorA];
    if (s.colorMode === 3) return [s.colorA, s.colorC, s.colorB];
    return [s.colorA, s.colorB];
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
   * Suggest band boundaries for 3-ink mode from the loop's luminance
   * distribution. Spread/rotating distributions split by terciles; tight ones
   * (uniformly lit models) pin the highlight to the top quartile so all three
   * inks appear. Pooling several frames over a full cycle averages out any
   * single pose's bias.
   * @returns {{threshold: number, split: number}}
   */
  function balancedThresholds(settings) {
    const dur = Math.max(0.1, settings.duration);
    const lums = [];
    const SAMPLES = 8;
    for (let k = 0; k < SAMPLES; k++) {
      renderAt((k / SAMPLES) * dur, settings, dur);
      lums.push(...ascii.cellLums());
    }
    const n = lums.length;
    if (!n) return { threshold: 0.33, split: 0.67 };
    const sorted = lums.slice().sort((a, b) => a - b);
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

  function clamp01(v) {
    return Number.isFinite(v) ? (v < 0 ? 0 : v > 1 ? 1 : v) : 0.5;
  }

  function chooseAction() {
    if (!group || !group.__actions || !group.__actions.length) return null;
    return group.__actions[activeActionIndex] || group.__actions[0];
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
    const fps = Math.max(2, Math.min(60, settings.fps));
    const frames = Math.max(2, Math.round(settings.duration * fps));

    // GIF window length. For animated models the clip is mapped onto one full
    // cycle within this window by renderAt(), so seamlessness is automatic.
    const dur = Math.max(0.1, settings.duration);

    const delayMs = Math.max(10, Math.round((dur / frames) * 1000));

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
    const fps = Math.max(2, Math.min(60, settings.fps));
    const frames = Math.max(2, Math.round(settings.duration * fps));
    const dur = Math.max(0.1, settings.duration);
    const delayMs = Math.max(10, Math.round((dur / frames) * 1000));

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
    loadGltfFolder,
    setActiveAnimation,
    setMotionMode,
    addAnimationFromFbx,
    setSettings,
    renderAt,
    renderPreview,
    capture,
    captureAsync,
    balancedThresholds,
    clearModel,
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
  };
}
