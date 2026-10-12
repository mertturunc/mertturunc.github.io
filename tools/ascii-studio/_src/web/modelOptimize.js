// Convert the loaded model to a compact binary GLB (dedup / prune / quantize).

import { WebIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { dedup, prune, quantize, resample, weld } from '@gltf-transform/functions';

/**
 * Re-export the current engine model as optimized GLB bytes.
 * @param {object} engine - createEngine() instance
 * @returns {Promise<Uint8Array>}
 */
export async function exportOptimizedGlb(engine) {
  const root = engine.getExportRoot?.();
  if (!root) throw new Error('No model loaded');

  const { GLTFExporter } = await import('three/addons/exporters/GLTFExporter.js');
  const exporter = new GLTFExporter();
  const animations = Array.isArray(root.animations) ? root.animations : [];
  const ab = await new Promise((resolve, reject) => {
    exporter.parse(
      root,
      (result) => {
        if (result instanceof ArrayBuffer) resolve(result);
        else reject(new Error('GLTFExporter did not return binary GLB'));
      },
      (err) => reject(err || new Error('GLTFExporter failed')),
      { binary: true, animations, onlyVisible: true, embedImages: true },
    );
  });

  return optimizeGlbBytes(new Uint8Array(ab));
}

/**
 * @param {Uint8Array} input
 * @returns {Promise<Uint8Array>}
 */
export async function optimizeGlbBytes(input) {
  try {
    const io = new WebIO().registerExtensions(ALL_EXTENSIONS);
    const doc = await io.readBinary(input);
    await doc.transform(dedup(), weld(), resample(), prune(), quantize());
    return await io.writeBinary(doc);
  } catch (err) {
    console.warn('[ascii-live] gltf-transform optimize failed, using exporter GLB', err);
    return input;
  }
}
