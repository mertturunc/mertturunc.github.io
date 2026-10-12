#!/usr/bin/env node
'use strict';

/**
 * Download browser builds for post viz libs into assets/vendor/.
 * Run: npm run sync:viz-vendor
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

const root = path.resolve(__dirname, '../../assets/vendor');
const files = [
  {
    name: 'd3.min.js',
    url: 'https://cdn.jsdelivr.net/npm/d3@7.9.0/dist/d3.min.js'
  },
  {
    name: 'cytoscape.min.js',
    url: 'https://cdn.jsdelivr.net/npm/cytoscape@3.30.4/dist/cytoscape.min.js'
  },
  {
    name: 'vis-network.min.js',
    url: 'https://cdn.jsdelivr.net/npm/vis-network@9.1.9/standalone/umd/vis-network.min.js'
  },
  {
    name: 'viz.js',
    url: 'https://unpkg.com/viz.js@2.1.2/viz.js'
  },
  {
    name: 'viz.render.js',
    url: 'https://unpkg.com/viz.js@2.1.2/full.render.js'
  }
];

function fetch(url) {
  return new Promise(function (resolve, reject) {
    https.get(url, function (res) {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        fetch(res.headers.location).then(resolve, reject);
        return;
      }
      if (res.statusCode !== 200) {
        reject(new Error(url + ' → HTTP ' + res.statusCode));
        res.resume();
        return;
      }
      var chunks = [];
      res.on('data', function (c) { chunks.push(c); });
      res.on('end', function () { resolve(Buffer.concat(chunks)); });
    }).on('error', reject);
  });
}

async function main() {
  fs.mkdirSync(root, { recursive: true });
  for (var i = 0; i < files.length; i++) {
    var f = files[i];
    process.stdout.write('Fetching ' + f.name + '… ');
    var buf = await fetch(f.url);
    fs.writeFileSync(path.join(root, f.name), buf);
    process.stdout.write(buf.length + ' bytes\n');
  }
  console.log('Done. Vendor files in', root);
}

main().catch(function (err) {
  console.error(err);
  process.exit(1);
});
