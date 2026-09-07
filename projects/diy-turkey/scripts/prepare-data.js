#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const districtsPath = path.join(root, "data", "tr-districts.geojson");
const citiesPath = path.join(root, "data", "tr-cities.geojson");
const provincesPath = path.join(root, "data", "tr-provinces.json");

const EPS = 0.004;
const DECIMALS = 4;

function dist2(a, b, p) {
  const x = b[0] - a[0];
  const y = b[1] - a[1];
  const len2 = x * x + y * y;
  if (len2 === 0) {
    const dx = p[0] - a[0];
    const dy = p[1] - a[1];
    return dx * dx + dy * dy;
  }
  let t = ((p[0] - a[0]) * x + (p[1] - a[1]) * y) / len2;
  t = Math.max(0, Math.min(1, t));
  const dx = p[0] - (a[0] + t * x);
  const dy = p[1] - (a[1] + t * y);
  return dx * dx + dy * dy;
}

function rdp(points, eps) {
  if (points.length <= 4) return points.slice();
  const stack = [[0, points.length - 1]];
  const keep = new Uint8Array(points.length);
  keep[0] = 1;
  keep[points.length - 1] = 1;
  const eps2 = eps * eps;
  while (stack.length) {
    const [start, end] = stack.pop();
    let maxD = 0;
    let maxI = start;
    const a = points[start];
    const b = points[end];
    for (let i = start + 1; i < end; i++) {
      const d = dist2(a, b, points[i]);
      if (d > maxD) {
        maxD = d;
        maxI = i;
      }
    }
    if (maxD > eps2) {
      keep[maxI] = 1;
      stack.push([start, maxI], [maxI, end]);
    }
  }
  const out = [];
  for (let i = 0; i < points.length; i++) if (keep[i]) out.push(points[i]);
  if (out.length < 4) return points.slice();
  return out;
}

function roundPt(p) {
  return [
    Number(p[0].toFixed(DECIMALS)),
    Number(p[1].toFixed(DECIMALS)),
  ];
}

function simplifyRing(ring) {
  const closed =
    ring.length > 1 &&
    ring[0][0] === ring[ring.length - 1][0] &&
    ring[0][1] === ring[ring.length - 1][1];
  const body = closed ? ring.slice(0, -1) : ring.slice();
  let simple = rdp(body, EPS).map(roundPt);
  if (closed) {
    simple.push(simple[0]);
  }
  if (simple.length < (closed ? 4 : 3)) {
    simple = ring.map(roundPt);
  }
  return simple;
}

function simplifyCoords(coords, depth) {
  if (depth === 1) return simplifyRing(coords);
  return coords.map((c) => simplifyCoords(c, depth - 1));
}

function countVerts(coords) {
  let n = 0;
  const walk = (a) => {
    if (typeof a[0] === "number") n++;
    else a.forEach(walk);
  };
  walk(coords);
  return n;
}

function vertexKey(p) {
  return p[0].toFixed(5) + "," + p[1].toFixed(5);
}

function ringVerts(geom) {
  const rings = [];
  if (geom.type === "Polygon") rings.push(geom.coordinates[0]);
  else if (geom.type === "MultiPolygon") {
    geom.coordinates.forEach((poly) => rings.push(poly[0]));
  }
  const keys = [];
  rings.forEach((ring) => {
    ring.forEach((p) => keys.push(vertexKey(p)));
  });
  return keys;
}

function neighborsFromOriginal(features) {
  const vertexOwners = new Map();
  features.forEach((f, i) => {
    const seen = new Set();
    ringVerts(f.geometry).forEach((key) => {
      if (seen.has(key)) return;
      seen.add(key);
      let list = vertexOwners.get(key);
      if (!list) {
        list = [];
        vertexOwners.set(key, list);
      }
      list.push(i);
    });
  });

  const shared = Array.from({ length: features.length }, () => new Map());
  vertexOwners.forEach((owners) => {
    if (owners.length < 2) return;
    for (let a = 0; a < owners.length; a++) {
      for (let b = a + 1; b < owners.length; b++) {
        const i = owners[a];
        const j = owners[b];
        shared[i].set(j, (shared[i].get(j) || 0) + 1);
        shared[j].set(i, (shared[j].get(i) || 0) + 1);
      }
    }
  });

  return shared.map((map, i) => {
    const ids = [];
    map.forEach((count, j) => {
      if (count >= 2) ids.push("district_" + (j + 1));
    });
    return ids;
  });
}

const districts = JSON.parse(fs.readFileSync(districtsPath, "utf8"));
const cities = JSON.parse(fs.readFileSync(citiesPath, "utf8"));

const beforeVerts = districts.features.reduce(
  (s, f) => s + countVerts(f.geometry.coordinates),
  0
);

const neighborIds = neighborsFromOriginal(districts.features);

const slimFeatures = districts.features.map((f, i) => {
  const depth = f.geometry.type === "Polygon" ? 2 : 3;
  return {
    type: "Feature",
    properties: {
      name: f.properties.name,
      cityId: f.properties.cityId,
      neighbors: neighborIds[i],
    },
    geometry: {
      type: f.geometry.type,
      coordinates: simplifyCoords(f.geometry.coordinates, depth),
    },
  };
});

const afterVerts = slimFeatures.reduce(
  (s, f) => s + countVerts(f.geometry.coordinates),
  0
);

const slimDistricts = { type: "FeatureCollection", features: slimFeatures };
const slimJson = JSON.stringify(slimDistricts);
fs.writeFileSync(districtsPath, slimJson);

const provinces = cities.features.map((f) => ({
  id: f.properties.cityId,
  name: f.properties.name,
}));
fs.writeFileSync(provincesPath, JSON.stringify(provinces));
fs.unlinkSync(citiesPath);

console.log(
  JSON.stringify(
    {
      districts: slimFeatures.length,
      vertsBefore: beforeVerts,
      vertsAfter: afterVerts,
      districtBytes: slimJson.length,
      provinceBytes: JSON.stringify(provinces).length,
      avgNeighbors: (
        neighborIds.reduce((s, n) => s + n.length, 0) / neighborIds.length
      ).toFixed(2),
    },
    null,
    2
  )
);
