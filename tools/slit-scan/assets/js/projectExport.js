// Adobe project packages for the slit-scan still + source clip.
// Native .aep / .prproj are closed binary/xml trees; these zips are the
// interchange Adobe actually opens: ExtendScript for AE, FCPXML for Premiere.

const CRC_TABLE = (() => {
  const t = new Uint32Array(256)
  for (let i = 0; i < 256; i++) {
    let c = i
    for (let k = 0; k < 8; k++) c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1)
    t[i] = c >>> 0
  }
  return t
})()

function crc32(u8) {
  let c = 0xffffffff
  for (let i = 0; i < u8.length; i++) c = CRC_TABLE[(c ^ u8[i]) & 0xff] ^ (c >>> 8)
  return (c ^ 0xffffffff) >>> 0
}

function u16(n) {
  const b = new Uint8Array(2)
  b[0] = n & 0xff
  b[1] = (n >>> 8) & 0xff
  return b
}

function u32(n) {
  const b = new Uint8Array(4)
  b[0] = n & 0xff
  b[1] = (n >>> 8) & 0xff
  b[2] = (n >>> 16) & 0xff
  b[3] = (n >>> 24) & 0xff
  return b
}

function concatBytes(parts) {
  let len = 0
  for (const p of parts) len += p.length
  const out = new Uint8Array(len)
  let o = 0
  for (const p of parts) {
    out.set(p, o)
    o += p.length
  }
  return out
}

/** Uncompressed ZIP. Throws if any entry would need ZIP64. */
export function zipStore(files) {
  const enc = new TextEncoder()
  const locals = []
  const centrals = []
  let offset = 0
  const flag = 0x0800 // UTF-8 names

  for (const file of files) {
    const name = enc.encode(file.name)
    const data = file.data instanceof Uint8Array ? file.data : new Uint8Array(file.data)
    if (data.byteLength > 0xfffffffe || offset > 0xfffffffe) {
      throw new Error('project too large to zip')
    }
    const crc = crc32(data)
    const size = data.byteLength
    const local = concatBytes([
      u32(0x04034b50),
      u16(20),
      u16(flag),
      u16(0),
      u16(0),
      u16(0),
      u32(crc),
      u32(size),
      u32(size),
      u16(name.length),
      u16(0),
      name,
      data,
    ])
    locals.push(local)
    centrals.push(concatBytes([
      u32(0x02014b50),
      u16(20),
      u16(20),
      u16(flag),
      u16(0),
      u16(0),
      u16(0),
      u32(crc),
      u32(size),
      u32(size),
      u16(name.length),
      u16(0),
      u16(0),
      u16(0),
      u16(0),
      u32(0),
      u32(offset),
      name,
    ]))
    offset += local.length
  }

  const central = concatBytes(centrals)
  const eocd = concatBytes([
    u32(0x06054b50),
    u16(0),
    u16(0),
    u16(files.length),
    u16(files.length),
    u32(central.length),
    u32(offset),
    u16(0),
  ])
  return concatBytes([...locals, central, eocd])
}

function xmlEscape(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

function jsxEscape(s) {
  return String(s).replace(/\\/g, '\\\\').replace(/"/g, '\\"')
}

export function safeFileName(name, fallback) {
  const base = String(name || fallback).replace(/[/\\?%*:|"<>]/g, '_').trim()
  return base || fallback
}

export function fcpxmlFrameDuration(rate) {
  const r = Number(rate)
  if (Math.abs(r - 23.976) < 0.02) return '1001/24000s'
  if (Math.abs(r - 29.97) < 0.02) return '1001/30000s'
  if (Math.abs(r - 59.94) < 0.02) return '1001/60000s'
  const n = Math.max(1, Math.round(r))
  return `1/${n}s`
}

export function fcpxmlDuration(seconds, rate) {
  const r = Number(rate) > 0 ? Number(rate) : 30
  const sec = Number.isFinite(seconds) && seconds > 0 ? seconds : (1 / r)
  if (Math.abs(r - 23.976) < 0.02) return `${Math.max(1, Math.round(sec * 24000 / 1001)) * 1001}/24000s`
  if (Math.abs(r - 29.97) < 0.02) return `${Math.max(1, Math.round(sec * 30000 / 1001)) * 1001}/30000s`
  if (Math.abs(r - 59.94) < 0.02) return `${Math.max(1, Math.round(sec * 60000 / 1001)) * 1001}/60000s`
  const n = Math.max(1, Math.round(r))
  const frames = Math.max(1, Math.round(sec * n))
  return `${frames}/${n}s`
}

function readmeText() {
  return [
    'slit scan — adobe project package',
    '',
    'keep every file in this folder together.',
    '',
    'after effects',
    '  file > scripts > run script file → slitscan.jsx',
    '  then file > save → slitscan.aep',
    '',
    'premiere pro',
    '  file > import → slitscan.xml',
    '  then file > save → slitscan.prproj',
    '',
    'after effects',
    '  dosya > komut dosyaları > komut dosyası dosyasını çalıştır → slitscan.jsx',
    '  sonra dosya > kaydet → slitscan.aep',
    '',
    'premiere pro',
    '  dosya > içe aktar → slitscan.xml',
    '  sonra dosya > kaydet → slitscan.prproj',
    '',
  ].join('\n')
}

export function buildAeJsx({ sourceName, fps, duration }) {
  const src = jsxEscape(sourceName)
  const rate = Number(fps) > 0 ? Number(fps) : 30
  const dur = Number.isFinite(duration) && duration > 0 ? duration : (1 / rate)
  return `(function () {
  function fail(msg) {
    alert(msg);
  }
  if (typeof app === "undefined" || !app.project) {
    fail("open this from after effects: file > scripts > run script file");
    return;
  }
  var scriptFile = File($.fileName);
  var folder = scriptFile.parent;
  var stillFile = new File(folder.fsName + "/slitscan.png");
  var sourceFile = new File(folder.fsName + "/${src}");
  var fps = ${rate};
  var dur = ${dur};

  app.beginUndoGroup("slit scan");
  try {
    var stillItem = null;
    var footageItem = null;
    if (stillFile.exists) {
      stillItem = app.project.importFile(new ImportOptions(stillFile));
    }
    if (sourceFile.exists) {
      footageItem = app.project.importFile(new ImportOptions(sourceFile));
    }
    if (!stillItem && !footageItem) {
      fail("keep slitscan.png next to this script, then run it again");
      return;
    }
    if (footageItem) {
      fps = footageItem.frameRate || fps;
      dur = footageItem.duration || dur;
    }
    if (dur < 1 / fps) dur = 1 / fps;

    if (footageItem) {
      var srcComp = app.project.items.addComp(
        "source",
        footageItem.width,
        footageItem.height,
        1,
        dur,
        fps
      );
      srcComp.layers.add(footageItem);
    }

    if (stillItem) {
      var scanComp = app.project.items.addComp(
        "slit-scan",
        stillItem.width,
        stillItem.height,
        1,
        dur,
        fps
      );
      var layer = scanComp.layers.add(stillItem);
      layer.startTime = 0;
      scanComp.openInViewer();
    }
  } catch (e) {
    fail("import failed: " + e.toString());
  }
  app.endUndoGroup();
})();
`
}

export function buildPremiereXml({
  sourceName,
  fps,
  duration,
  stillW,
  stillH,
  videoW,
  videoH,
}) {
  const rate = Number(fps) > 0 ? Number(fps) : 30
  const dur = fcpxmlDuration(duration, rate)
  const frameDur = fcpxmlFrameDuration(rate)
  const src = xmlEscape(sourceName)
  const sw = Math.max(1, Math.round(stillW || 1))
  const sh = Math.max(1, Math.round(stillH || 1))
  const vw = Math.max(1, Math.round(videoW || sw))
  const vh = Math.max(1, Math.round(videoH || sh))
  return `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE fcpxml>
<fcpxml version="1.9">
  <resources>
    <format id="r1" name="FFVideoFormatRateCustom" frameDuration="${frameDur}" width="${vw}" height="${vh}"/>
    <format id="r2" name="FFVideoFormatStill" width="${sw}" height="${sh}"/>
    <asset id="r3" name="slitscan.png" src="slitscan.png" start="0s" duration="${dur}" hasVideo="1" format="r2"/>
    <asset id="r4" name="${src}" src="${src}" start="0s" duration="${dur}" hasVideo="1" hasAudio="1" format="r1"/>
  </resources>
  <library>
    <event name="slit-scan">
      <project name="slit-scan">
        <sequence format="r2" duration="${dur}" tcStart="0s" tcFormat="NDF">
          <spine>
            <video ref="r3" offset="0s" duration="${dur}"/>
          </spine>
        </sequence>
      </project>
      <project name="source">
        <sequence format="r1" duration="${dur}" tcStart="0s" tcFormat="NDF">
          <spine>
            <asset-clip ref="r4" offset="0s" duration="${dur}"/>
          </spine>
        </sequence>
      </project>
    </event>
  </library>
</fcpxml>
`
}

async function bytesFromBlob(blob) {
  const buf = await blob.arrayBuffer()
  return new Uint8Array(buf)
}

export async function buildProjectZip({
  kind,
  stillBlob,
  sourceFile,
  sourceName,
  fps,
  duration,
  stillW,
  stillH,
  videoW,
  videoH,
}) {
  const srcName = safeFileName(sourceName, 'source.mp4')
  const files = [
    { name: 'read-me.txt', data: new TextEncoder().encode(readmeText()) },
    { name: 'slitscan.png', data: await bytesFromBlob(stillBlob) },
  ]

  if (sourceFile) {
    files.push({ name: srcName, data: new Uint8Array(await sourceFile.arrayBuffer()) })
  }

  if (kind === 'ae') {
    files.push({
      name: 'slitscan.jsx',
      data: new TextEncoder().encode(buildAeJsx({ sourceName: srcName, fps, duration })),
    })
  } else {
    files.push({
      name: 'slitscan.xml',
      data: new TextEncoder().encode(buildPremiereXml({
        sourceName: srcName,
        fps,
        duration,
        stillW,
        stillH,
        videoW,
        videoH,
      })),
    })
  }

  const bytes = zipStore(files)
  const zipName = kind === 'ae' ? 'slitscan-after-effects.zip' : 'slitscan-premiere.zip'
  return {
    blob: new Blob([bytes], { type: 'application/zip' }),
    filename: zipName,
  }
}
