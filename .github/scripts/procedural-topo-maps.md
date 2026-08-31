# Procedural topographic maps for 1200×630 OG placeholders

Research notes for generating Jekyll Open Graph cards (SVG → PNG via resvg) that read as topographic maps at social-card size, without inventing a second visual brand.

**Shipped (night sitting).** `.github/scripts/generate-placeholders.js` no longer follows the parchment slab below. Current cards are charcoal `#282828`, parchment-ink hairlines, faded-orange-night `#fe8019` isoline, Horn NW hillshade with stronger lamp on ridges, 240×126 nested-warp fBM, full-bleed map (no footer bar). Type sits on the terrain: **buralarda iken** top-left, date top-right, post title bottom-left. The sections after this are the original research, kept as sources — not the live spec.

**Pipeline:** SVG → `@resvg/resvg-js` + Sharp, 1200×630. Facebook’s sharing docs recommend **at least 1200×630** (~**1.91:1**). ([Facebook Images in Link Shares](https://developers.facebook.com/docs/sharing/webmasters/images/); [resvg-js](https://github.com/thx/resvg-js))

**Site visual constraints** (from `DESIGN.md` / Gruvbox; do not invent a new brand):

| Role | Hex | Source |
|---|---|---|
| Parchment paper | `#fbf1c7` | Gruvbox `light0` ([gruvbox.vim](https://github.com/morhetz/gruvbox/blob/master/colors/gruvbox.vim)) |
| Charcoal ink | `#3c3836` | Gruvbox `dark1` |
| Faded orange (one accent) | `#d65d0e` | Gruvbox `neutral_orange` |
| Walnut / faded bark | `#504945` / `#665c54` | Gruvbox `dark2` / `dark3` |
| Straw, cream, wash | `#d5c4a1` / `#f9f5d7` / `#f2e5bc` | Gruvbox `light2` / `light0_hard` / `light0_soft` |

Type is IBM Plex Sans + IBM Plex Mono, copy stays lowercase, corners are ~4px, chrome recedes. Tools reuse the host paper rather than inventing a second world. ([DESIGN.md](../../DESIGN.md))

---

## 1. Heightfields

A heightfield is a scalar grid \(z(x,y)\). Everything else (contours, hillshade, streams) is derived from it. The generator already samples an 80×42 grid; the quality of that field is the whole map.

### 1.1 Perlin (classic / improved)

Ken Perlin’s `Noise()` (SIGGRAPH 1985) is a **band-limited, statistically isotropic, translation-invariant** scalar function of space. Those three properties are the reason it replaced ad-hoc trigonometric textures: the human visual system “tends to analyze incoming images in terms of levels of differently sized detail,” and Noise gives one well-behaved octave at a time. ([Perlin, *An Image Synthesizer*, SIGGRAPH 1985, PDF](https://www.cs.jhu.edu/~misha/Spring25/Readings/Perlin85.pdf); [ACM](https://dl.acm.org/doi/10.1145/325165.325247))

Classic Noise interpolates random gradients on a cubic lattice with the cubic Hermite \(3t^2-2t^3\). Perlin’s 2002 correction (*Improving Noise*) replaced that with the quintic \(6t^5-15t^4+10t^3\) so first **and** second derivatives vanish at cell boundaries — otherwise bump-mapped lighting showed second-order seams. It also replaced a random gradient table with a 12-vector set (cube-edge midpoints). ([Perlin, *Improving Noise*, SIGGRAPH 2002, PDF](https://people.csail.mit.edu/ericchan/bib/pdf/p681-perlin.pdf); [GPU Gems ch. 5](https://developer.nvidia.com/gpugems/gpugems/part-i-natural-effects/chapter-5-implementing-improved-perlin-noise))

**For 2D OG cards:** classic/improved Perlin is fine. The lattice artifacts Perlin later attacked show up most in 3D+ and in single-octave thresholded noise, not in a 4–5 octave fBM heightfield viewed at 1200px.

### 1.2 Simplex and OpenSimplex

Perlin’s 2001 *Noise Hardware* course notes introduce **simplex noise**: skew onto a simplicial grid, sum radial kernels at \(n+1\) vertices instead of \(2^n\) cube corners. Complexity drops from \(O(2^n)\) to \(O(n^2)\), and the reconstruction is more isotropic. ([Perlin, *Noise Hardware*, SIGGRAPH 2001 Real-Time Shading course](https://userpages.cs.umbc.edu/olano/s2002c36/ch02.pdf))

Stefan Gustavson’s 2005 writeup is the readable reference implementation of that algorithm (Perlin’s Java was “not meant to be read as a tutorial”). ([Gustavson, *Simplex noise demystified*](https://www.researchgate.net/publication/216813608_Simplex_noise_demystified); [JCGT 2022 citing the 2005 tutorial](https://jcgt.org/published/0011/01/02/paper.pdf))

US patent [US6867776B2](https://patents.google.com/patent/US6867776B2/en) covered a hardware-oriented simplex-style gradient noise (filed 2002; listed as expired). OpenSimplex exists because of that chill: Kurt Spencer (KdotJPG) published a **different lattice** (simplectic honeycomb, larger surflet radius) in 2014, public-domain. ([Original 2014 writeup](https://uniblock.tumblr.com/post/97868843242/noise); [gist](https://gist.github.com/KdotJPG/b1270127455a94ac5d19))

**OpenSimplex2** (2020–) is the version to copy. For 2D heightfields:

- **OpenSimplex2(F)** looks most like Simplex; the bundled 2D function *is* 2D Simplex with a better gradient table.
- **OpenSimplex2S** is the smoother successor of 2014 OpenSimplex and is the **recommended choice for ridged noise** (if you pass layers through `abs(x)`).

([OpenSimplex2 README](https://github.com/KdotJPG/OpenSimplex2))

For a 2D CPU heightfield at OG resolution, **OpenSimplex2S 2D** or even the existing value-noise is enough. Do not pull in 3D/4D evaluators.

### 1.3 Fractional Brownian motion (fBM)

A single Noise octave is too smooth for terrain. fBM stacks octaves: frequency ×2, amplitude ×G each step. Inigo Quilez’s canonical form:

```
G = 2^(-H)
t += a * noise(f * x);  f *= 2;  a *= G
```

\(H\) is the Hurst exponent. Graphics default **\(G = 0.5\)** (\(H = 1\)) because that is **isotropic self-similarity**: a mountain that is twice as high is also twice as wide. Quilez measured real mountain skylines and got ~−9 dB/octave, matching \(H = 1\). Hardcoding \(G = 0.5\) is therefore not a magic number — it is the isotropic case. ([Quilez, *fBM*](https://iquilezles.org/articles/fbm/))

Musgrave’s SIGGRAPH course notes: **plain fBM is statistically homogeneous and isotropic; Nature is not.** That is why ridged / hybrid / hetero-terrain exist. He also states that simulating fluvial and glacial erosion “remains impractical” compared with these procedural models — relevant to §5. ([Musgrave, *Procedural Fractal Terrains*](https://www.classes.cs.uchicago.edu/archive/2015/fall/23700-1/final-project/MusgraveTerrain00.pdf); dissertation [Methods for Realistic Landscape Imaging](https://www.kenmusgrave.com/dissertation.pdf))

**Octaves at 1200×630:** 4–5. Each octave doubles frequency. On a ~160-column grid, octave 6 is already near the Nyquist of the cell; extra octaves add hash sparkle, not landforms. Quilez notes that doubling frequency is efficient *because* noise fills a band, unlike sines. Detune lacunarity slightly (`2.01` / `1.99`) or rotate the domain per octave so peaks do not stack. The current script already uses `freq *= 2.05` and `amp *= 0.5` — keep that, drop the sine ridge.

### 1.4 Ridged multifractal

Musgrave’s ridged-multifractal (published in *Texturing and Modeling: A Procedural Approach*; implementations still comment “originally written by F. Kenton Musgrave, 1998”) turns each octave into a sharp ridge:

```
signal = offset - abs(noise(p))
signal *= signal            // sharpen
signal *= weight            // previous octave gates this one
weight = clamp(signal * gain, 0, 1)
value += signal * spectralWeight
p *= lacunarity
```

Absolute value folds the field into “canyons”; invert/square to get peaks. Weighting by the previous signal makes rough areas rougher and valleys smoother — heterogeneous, unlike fBM. ([Blender Cycles OSL, `noise_musgrave_ridged_multi_fractal`](https://github.com/jesterKing/blender/blob/master/blender/intern/cycles/kernel/shaders/node_musgrave_texture.osl); [Blender manual](https://docs.blender.org/manual/en/3.6/modeling/geometry_nodes/texture/musgrave.html); [SharpNoise RidgedMulti.cs citing Musgrave 1998](https://github.com/rthome/SharpNoise/blob/master/SharpNoise/Modules/RidgedMulti.cs))

OpenSimplex2S is explicitly the recommended basis “if passing individual layers into `abs(x)`.” ([OpenSimplex2 README](https://github.com/KdotJPG/OpenSimplex2))

**For OG cards:** do **not** use a full ridged field as the only height. Ridged-only looks like alpine knife-edges everywhere — at 630px that reads as hash, not topography. Mix: ~70% isotropic fBM + optional ~30% one-octave ridged, or use ridged only as a seed-dependent variant. Default `offset ≈ 1`, `gain ≈ 2`, \(H ≈ 1\).

### 1.5 Domain warping (Quilez)

Warping is \(f(p + h(p))\), not a different noise. Perlin’s 1984 marble is the ancestor (perturb the domain of a color ramp). Quilez’s 2D recipe:

```
q = vec2( fbm(p), fbm(p + (5.2, 1.3)) )
r = vec2( fbm(p + 4q + …), fbm(p + 4q + …) )
return fbm(p + 4r)
```

One warp already looks organic; two warps look like marble / smoke. ([Quilez, *Domain Warping*](https://iquilezles.org/articles/warp); Shadertoy [lsl3RH](https://www.shadertoy.com/view/lsl3RH))

**For topo:** **one** warp, small amplitude (`warp ≈ 0.15–0.35` of the domain, not `4.0`). Nested `fbm(p+fbm(p+fbm(p)))` at Quilez’s `4.0` produces swirls that contours will trace as un-geologic spirals. Mild warp bends ridges and valleys the way folded strata look, without leaving the topographic register.

### 1.6 Why naive sin/cos terrain looks fake

Quilez plots the power spectrum of a sine versus value/gradient noise: a sine is a **delta at one frequency**; noise is a **wide hump**. Stacking sines (a sparse inverse DFT) therefore:

1. **Repeats.** Periodicity is the definition of `sin`. Noise is constructed to be statistically translation-invariant without a visible period. ([Perlin 1985 properties](https://www.cs.jhu.edu/~misha/Spring25/Readings/Perlin85.pdf); [Quilez fBM](https://iquilezles.org/articles/fbm/))
2. **Anisotropy / grid of waves.** Sums of axis-aligned or few-direction sines create parallel ridges. Real drainage is dendritic, not a corrugated sheet.
3. **No spectral slope.** Terrain profiles sit near \(f^{-3}\) (Quilez’s “yellow noise”). A handful of sines cannot fill that slope. Quilez: sine-based fBM is “super performant” on GPUs but “produces poor landscapes” and “repeating patterns which is not desirable most of the times.”

The current generator adds `sin(nx·cosθ·6 + ny·sinθ·6) * ridgeAmp` on top of fBM. That is exactly the corrugated-sheet artifact: one global grain direction, periodic, unrelated to the fBM valleys. **Remove it.** If you need a regional grain, warp the domain or add a very low-frequency (octave 0) fBM lobe — not a sine.

Gaussian hills (`exp(-d²/r²)`) are acceptable as a **composition** trick (place 2–3 broad masses so the card has a foreground ridge). They are not a substitute for noise; they are the large-scale “few big shapes” Quilez describes before octaves add medium and small detail.

---

## 2. Isolines

### 2.1 Marching squares and marching cubes

**Marching cubes** (Lorensen & Cline, SIGGRAPH 1987) extracts an isosurface from a 3D scalar field: classify each cube’s 8 vertices as inside/outside the threshold, look up a triangle topology, **linearly interpolate** vertices along edges. ([Lorensen & Cline PDF](https://people.eecs.berkeley.edu/~jrs/meshpapers/LorensenCline.pdf); [ACM](https://doi.org/10.1145/37401.37422))

**Marching squares** is the 2D analog: 4 vertices → 16 cases → line segments along edges, same linear interpolation. The generator already implements this (bit mask 8/4/2/1, saddle cases 5 and 10 emit two segments). d3-contour’s `cases` table is the same 16-entry topology, then stitches segments into rings. ([d3-contour README](https://github.com/d3/d3-contour); [d3-contour docs](https://d3js.org/d3-contour); [saddle winding fix](https://github.com/d3/d3-contour/commit/6923c4b5c260e7a5ce62287371df3eac912d1315))

Saddle ambiguity (cases 5 and 10): either pair of diagonals is locally consistent; global topology can disagree. d3-contour picks a winding and documents it. For decorative OG maps, either pairing is fine — just be consistent so stitched paths do not fork.

### 2.2 d3-contour vs turf isolines

| | **d3-contour** | **@turf/isolines** |
|---|---|---|
| Input | Flat `n×m` array | GeoJSON point grid |
| Output | GeoJSON **MultiPolygon** (filled superlevel sets) | GeoJSON **MultiLineString** (isolines) |
| Algorithm | Marching squares | Marching squares (via `marchingsquares` since 2023) |
| Built-in smooth | Linear interpolation along edges (default **on**) | None in the API; you post-process |

d3-contour: “Each geometry object represents the area where the input values are **greater than or equal to** the corresponding threshold.” `contours.smooth(true)` (default) “smoothed using **linear interpolation**” — that is the same edge lerp the current script already does, **not** Chaikin. Thresholds default to Sturges; pass an explicit array. ([d3-contour contour polygons](https://d3js.org/d3-contour/contour))

Turf: `isolines(pointGrid, breaks, { zProperty })` → MultiLineString. Input “must be square or rectangular and already gridded.” ([Turf isolines](https://turfjs.org/docs/api/isolines); [Turf PR #2527](https://github.com/Turfjs/turf/pull/2527))

**Recommendation:** keep the inlined marching-squares + stitch already in `generate-placeholders.js`. d3-contour’s polygons are useful if you want hypsometric **fills**; turf adds a GeoJSON tax for no gain. Do not add either dependency unless you want filled bands.

### 2.3 Contour smoothing: linear, Chaikin, cubic

Three different operations, often conflated:

1. **Edge interpolation (d3-contour `smooth`, current `interp`)** — moves the vertex along the grid edge to the exact isolevel. This is **correct** for a bilinear field. It does **not** round corners. Jaggedness leftover is the piecewise-linear polyline through those points.

2. **Chaikin corner cutting** (Chaikin 1974) — replace each vertex \(P_i\) with two points at 1/4 and 3/4 along the adjacent segments; iterate. In the limit this is a **uniform quadratic B-spline** (Riesenfeld 1975): it **approximates**, it does not interpolate, so closed contours shrink slightly. Cheap, 1–2 iterations. ([Chaikin, *An algorithm for high-speed curve generation*, CGIP 1974](https://doi.org/10.1016/0146-664x(74)90028-8); [UNC notes on Chaikin / Riesenfeld](https://www.cs.unc.edu/~dm/UNC/COMP258/LECTURES/Chaikins-Algorithm.pdf))

3. **Cubic interpolating spline (Catmull–Rom)** — cubic pieces that **pass through** the marching-squares vertices. C¹, local, no shrinkage. Uniform Catmull–Rom can loop on uneven spacing; centripetal parameterization is safer if you go this far. ([Catmull & Rom, *A Class of Local Interpolating Splines*, 1974](https://doi.org/10.1016/b978-0-12-079050-0.50020-5))

**For 1200×630 SVG:** Chaikin **one or two** iterations after stitch. Cubic is overkill (more path commands, resvg still strokes a polyline). Zero smoothing looks like a mesh. Three+ Chaikin iterations melt drainage hooks that make topo look like topo.

USGS *Maps for America* already requires cartographic **expression**: rolling hills as “gently curved lines, with no acute angles”; knife ridges “jagged and bent sharply.” Smoothing should preserve that contrast, not turn everything into ovals. ([USGS *Maps for America*](https://doi.org/10.3133/70039239))

### 2.4 Index vs intermediate contours (USGS)

USGS US Topo specs, FCode 10102 / 10101:

- **Index:** “a thick, bold line, to indicate **every fifth contour line** and is labeled with the elevation.” Stroke **0.504 pt**, RGB (145, 88, 40).
- **Intermediate:** “a thinner line between each index contour, drawn at the contour interval.” Stroke **0.216 pt**, RGB (179, 134, 89).
- **Supplemental:** extra lines in flat terrain (skip at OG size).
- Depression contours get hachures toward the low (skip).

([USGS US Topo — Elevation](https://www.usgs.gov/ngp-standards-and-specifications/us-topo-cartographic-specifications-elevation); [USGS *Topographic Map Symbols* PDF](https://pubs.usgs.gov/gip/TopographicMapSymbols/topomapsymbols.pdf); [*Maps for America*: “Index contours every fourth or fifth contour… accentuated by making the line wider”](https://doi.org/10.3133/70039239))

The current script treats **every second** contour as “index.” That is twice as many heavy lines as the convention and fights the one-accent rule. **Fix: every 5th isoline is index; the rest intermediate; one extra isoline is the faded-orange accent** (not an index, not a label).

Contour interval on a **normalized** [0,1] field: pick **8–10** thresholds (e.g. `0.15, 0.25, …` or 10 bins). USGS chooses interval so lines neither coalesce on steep slopes nor vanish on flats. At 1200×630, 8–10 lines is the equivalent of a coarse atlas interval; 20+ becomes brown noise.

**Do not label index contours on the card.** USGS index type is 6 pt italic with a halo — at the size a Slack/X preview actually displays (~400–600 CSS px wide), those numbers collide with the title bar and with each other.

---

## 3. Relief: what actually reads at OG-card size

A 1200×630 PNG is often shown at half that CSS size. Fine Swiss-school modeling disappears. Hierarchy that survives: **paper → soft shade → thin intermediates → thicker indexes → one orange isoline → a couple of streams → title.**

### 3.1 Hillshading from finite-difference gradients

Analytical hillshade is Lambertian: brightness ∝ cosine of the angle between the surface normal and the light. ESRI’s documented formula (same as GDAL’s default):

```
Hillshade = 255 * (cos(Z) * cos(S) + sin(Z) * sin(S) * cos(A_light − A_aspect))
clamp to [0, 255]
```

Slope and aspect from a **3×3** window (Horn 1981 kernel, ESRI/GDAL default):

```
dz/dx = ((c + 2f + i) − (a + 2d + g)) / (8 * cellsize)
dz/dy = ((g + 2h + i) − (a + 2b + c)) / (8 * cellsize)
```

where `a..i` are the 3×3 neighbors, `e` the center. GDAL: Horn for **rougher** terrain; Zevenbergen–Thorne (simple `dz/dx = (left−right)/(2Δ)`) for **smooth** landscapes. ([ESRI How Hillshade works](https://pro.arcgis.com/en/pro-app/latest/tool-reference/3d-analyst/how-hillshade-works.htm); [GDAL gdaldem](https://gdal.org/en/stable/programs/gdaldem.html); [Horn, *Hill Shading and the Reflectance Map*, Proc. IEEE 1981, PDF](https://people.csail.mit.edu/bkph/papers/Hill-Shading.pdf))

**Light:** Horn: “typically in the **northwest**, with a zenith angle of around 45°.” ESRI defaults **azimuth 315°, altitude 45°**. Northwest light (upper-left on a north-up map) avoids the classic **relief inversion** (south light makes valleys look like ridges). ([Horn 1981](https://people.csail.mit.edu/bkph/papers/Hill-Shading.pdf); [ESRI](https://pro.arcgis.com/en/pro-app/latest/tool-reference/3d-analyst/how-hillshade-works.htm))

**At OG size:** compute shade on the same grid as the heightfield, bilinear-upsample into an SVG `<image>` (or a few dozen gray `<rect>`s — worse) **or** bake a multiply-blend into the PNG after resvg. Practical recipe: **multiply a low-contrast gray hillshade onto parchment at ~12–18% opacity.** Do not replace the paper; Imhof/Patterson both treat shade as a modulator, not a texture. Full 0–255 gray hillshade on parchment looks like a DEM screenshot, not a notebook.

The current generator has **no hillshade**. Adding this one multiply is the highest-leverage relief cue at 630px.

### 3.2 Swiss / Imhof shaded relief

Eduard Imhof (ETH Zurich; *Kartographische Geländedarstellung* / *Cartographic Relief Presentation*, 1982) is the reference for **manual** Swiss-style shade: northwest/southwest light, **aerial perspective** (contrast sharpens toward peaks, haze toward lowlands), rock drawing, colour modulation of lit vs shaded slopes. ETH: aerial perspective “serves to differentiate between high mountain summits and lower, more distant lowlands.” ([ETH Imhof](https://ikgrelief.ethz.ch/cartographers/imhof/); [ETH Aerial Perspective](https://ikgrelief.ethz.ch/design/aerial-perspective/); [Imhof 1982, Internet Archive record](https://archive.org/details/cartographicreli0000imho_i9k8))

Horn quotes Imhof arguing that automated model-photography cannot match a cartographer who “influence[s] the process.” Automated Lambertian shade is a **starting point**, not Swiss style.

**At OG size:** skip aerial-perspective ramps, skip rock drawing, skip locally varying light azimuth (Brassel / Swiss school). Those are atlas techniques. Steal only: **NW 45° light, soft contrast, shade never overpowers ink contours.**

### 3.3 Tanaka illuminated contours

Kitiro Tanaka, *The Relief Contour Method of Representing Topography on Maps* (*Geographical Review*, 1950): **medium-gray ground**, contours **white** on the lit side and **black** on the shade side, **thickness ∝ cosine** of the angle between aspect and illumination. Tanaka’s object was “not to produce a photo-realistic representation but a simplified model.” ([Tanaka 1950](https://doi.org/10.2307/211219); [Kennelly & Kimerling 2001 PDF](https://www.mbmg.mtech.edu/pdf/gis_illum.pdf); [ICA 2001 on Tanaka](https://icaci.org/files/documents/ICC_proceedings/ICC2001/icc2001/file/f24028.pdf))

Imhof’s criticism (reported in Kennelly & Kimerling): the method makes terrain look **stepped/terraced**, especially on gentle slopes, and the black/white jump is too abrupt.

**At OG size, on parchment:** Tanaka needs a gray field and a black/white pair. That fights `#fbf1c7` and the one-accent rule. Do not implement. The **index vs intermediate weight contrast** already gives a cheap cousin of “thick on the form lines.”

### 3.4 Hypsometric tints

Hypsometry colors elevation (green lowlands → yellow → brown/red/white peaks). Patterson (NPS): readers **misread those colors as vegetation/climate** — Death Valley is not forest; Yellowstone is not desert. Even Imhof’s and Peucker’s classic ramps have this problem. Patterson’s fix (cross-blended tints) is for **small-scale atlas** maps with real climate masks — not a 1200×630 blog card. ([Patterson, Cross-blended hypsometric tints](https://www.shadedrelief.com/hypso/hypso.html); [Patterson & Jenny, *Cartographic Perspectives* 69](https://cartographicperspectives.org/index.php/journal/article/view/cp69-patterson-jenny))

**Do not** put a green–yellow–brown ramp on this site. It is a second brand, it will be read as land cover, and it fights parchment. If you want a hint of hypsometry, use **one** step: a barely darker wash (`#f2e5bc` at ~20% opacity) below a mid isoline, still inside Gruvbox light. No green, no atlas rainbow.

---

## 4. Hydrography that follows terrain

### 4.1 D8 / flow accumulation (do this)

O’Callaghan & Mark (1984): for each cell, send all flow to the **single steepest** of 8 neighbors (distance-weighted drop). That **flow-direction** raster is then accumulated: each cell’s value is the count of upslope cells that drain through it. High accumulation ≈ channels; zeros ≈ ridges. ([O’Callaghan & Mark, *The extraction of drainage networks from digital elevation data*, CVGIP 1984](https://www.sciencedirect.com/science/article/abs/pii/S0734189X84800110))

Jenson & Domingue (1988, USGS EROS) is the operational pipeline ESRI still cites: **fill pits → D8 direction → accumulation → threshold** to extract a stream raster. “Cells with a high flow accumulation are areas of concentrated flow and may be used to identify stream channels.” ([Jenson & Domingue, PE&RS 1988](https://pubs.usgs.gov/publication/70142175); [ESRI How Flow Accumulation works](https://pro.arcgis.com/en/pro-app/latest/tool-reference/spatial-analyst/how-flow-accumulation-works.htm))

Tarboton (1997) **D∞**: continuous angle on eight triangular facets, split flow between two downslope neighbors. Better on divergent hillslopes; D8 remains preferred for **channel networks** that must not bifurcate downhill. ([Tarboton, WRR 1997](https://doi.org/10.1029/96WR03137); [USU PDF](https://digitalcommons.usu.edu/cgi/viewcontent.cgi?article=3510&context=cee_facpub); [TARDEM notes: “D8 is still used for the definition of channel networks”](https://hydrology.usu.edu/dtarb/gishydro99/tardem.html))

**For OG cards:** D8 on the same CPU grid is enough. Pit-fill: a few iterations of “if a cell is lower than all neighbors, raise it to the lowest neighbor” (or skip — fBM rarely has real sinks). Threshold: keep cells above a quantile (e.g. top ~2–4% of accumulation, or `value > k` with \(k\) ~ 0.5–1.5% of cell count). Trace downstream as polylines; optional stroke-width `∝ log(1 + accumulation)`. Color: walnut `#504945` at low opacity — **not** atlas blue (that would be a second hue next to orange).

D8’s known artifact is **parallel flow lines on planar slopes**. At 160×84 and a high accumulation threshold you only draw the concentrated trunks, so the artifact is mostly invisible. Do not implement D∞ for this.

### 4.2 Decorative random meanders (do not)

The current `meander()` draws a sine-wobble polyline that **ignores the heightfield**. Real streams occupy **valleys** (contour V’s point upstream — the first thing taught on a USGS topo). A sine across a ridge looks like a highway, not hydrography, and it is the hydrographic version of the sin/cos terrain problem: periodic, direction-independent, unrelated to slope.

Replace `meander` washes/trails with (a) one or two D8 trunks, and optionally (b) a dashed **ridge** path along low-accumulation cells if you still want a “trail.”

---

## 5. What to skip at 1200×630 SVG

| Skip | Why (primary) |
|---|---|
| **Full hydraulic erosion** (Benes & Forsbach 2002; Mei, Decaudin & Hu 2007 GPU shallow-water + sediment) | Iterative, many coupled constants, designed for animation / 3D close-ups. Musgrave already called fluvial simulation “impractical” next to fBM for production terrains. At OG resolution the visual payoff is extra valley wiggles you will then **smooth away** for SVG. ([Benes 2002](https://www.cs.purdue.edu/cgvlab/www/resources/papers/Benes-2002-Visual_simulation_of_hydraulic_erosion.pdf); [Mei et al. 2007](http://www-evasion.imag.fr/Publications/2007/MDH07/FastErosion_PG07.pdf); [Musgrave course notes](https://www.classes.cs.uchicago.edu/archive/2015/fall/23700-1/final-project/MusgraveTerrain00.pdf)) |
| **Dense contour labels** | USGS index annotation is 6 pt with halo, “centered on line.” Social previews shrink the card; labels collide with the title slab and with each other. |
| **Fake town / peak names** | Invented toponyms are SaaS-map chrome. The site is lowercase IBM Plex, one accent, the artifact leads. A title is already on the card. |
| **Supplemental / depression hachure contours** | USGS extras for flats and sinks. At this scale they are clutter. |
| **Tanaka B/W illuminated contours** | Requires gray ground; Imhof: terraced look. Fights parchment. |
| **True Swiss shade / aerial perspective / rock drawing** | Manual atlas techniques; contrast changes will not survive 300 px of preview height. |
| **Atlas hypsometric greens** | Misread as vegetation ([Patterson](https://www.shadedrelief.com/hypso/hypso.html)); second brand. |
| **Two-level Quilez warp at amplitude 4** | Marble/smoke, not topography. |
| **Sine ridges and sine rivers** | Periodic, anisotropic, ignore the field (§1.6, §4.2). |
| **Index-every-2nd-line** | USGS is every **fifth**. Too many heavy strokes. |
| **Compass + scale as competing chrome** | Keep if already quiet (current compass is small); do not add a legend, graticule labels, or north arrows with drop shadows. |
| **GPU / WebGL** | CI is Node; `@resvg/resvg-js` is CPU. Horn + D8 on a 160×84 grid is microseconds. |

---

## 6. Recommended implementation recipe (Node, no GPU)

Concrete, ordered steps for `generate-placeholders.js`. Stay inside the existing SVG → resvg → Sharp path.

### Parameters (defaults)

| Parameter | Value | Rationale |
|---|---|---|
| Canvas | 1200×630 | [Facebook OG](https://developers.facebook.com/docs/sharing/webmasters/images/) |
| Grid | **160 × 84** (cell ≈ 7.5 px) | Current 80×42 is coarse (15 px cells → angular isolines). 160×84 still tiny in Node; ~13k samples. |
| Noise | OpenSimplex2S 2D **or** keep value-noise | 2D only. OpenSimplex2S if you vendor ~200 lines; else value-noise is acceptable under fBM. |
| Octaves | **5** | Nyquist of this grid. |
| \(G\), lacunarity | **0.5**, **2.05** | Isotropic fBM ([Quilez](https://iquilezles.org/articles/fbm/)); slight detune already in repo. |
| Domain warp | **1** level, amplitude **0.25** | Quilez `q` only; not `r`. |
| Ridged mix | **0** by default; optional 0.25 | Avoid alpine-everywhere. |
| Hillshade | Horn 3×3, az **315°**, alt **45°**, multiply **15%** | [Horn](https://people.csail.mit.edu/bkph/papers/Hill-Shading.pdf) / [ESRI](https://pro.arcgis.com/en/pro-app/latest/tool-reference/3d-analyst/how-hillshade-works.htm) |
| Contours | **10** levels on [0,1] | Readable count at card size. |
| Index | every **5th** (`i % 5 === 0`) | [USGS US Topo](https://www.usgs.gov/ngp-standards-and-specifications/us-topo-cartographic-specifications-elevation) |
| Accent isoline | **one** path, longest ring near **0.45–0.55** | Site one-accent rule, `#d65d0e` |
| Smooth | Chaikin **2** iterations | Cheap; interpolating cubic unnecessary. |
| Streams | D8 accumulation, top **~3%** | [Jenson & Domingue](https://pubs.usgs.gov/publication/70142175) |
| Type | IBM Plex, lowercase title | `DESIGN.md` |

### Colors (stroke / fill)

- Paper: `#fbf1c7`
- Intermediate contours: `#665c54`, width **0.7**, opacity **0.32**
- Index contours: `#3c3836`, width **1.6**, opacity **0.55**
- Accent isoline: `#d65d0e`, width **1.5**, opacity **0.6** (one path only)
- Streams: `#504945`, width **1.1–2.2** by `log(acc)`, opacity **0.4**
- Hillshade: grayscale multiply, not a new hue
- Title slab: `#f9f5d7` as today
- Optional faint grid: `#d5c4a1` at 0.35 as today

No `#458588` blue, no hypsometric green, no second accent.

### Ordered steps

1. **Seed** from the post title (keep `hashString` / `mulberry32`).
2. **Sample height** on a 161×85 node grid (one extra node so there are 160×84 cells):
   - `p = (x/COLS, y/ROWS)` scaled by ~3.2 (current frequency).
   - `q.x = fbm(p)`, `q.y = fbm(p + (5.2, 1.3))` with **3** octaves (warp field can be cheaper).
   - `h = fbm(p + 0.25 * q)` with **5** octaves, \(G=0.5\).
   - Optional: add 2–3 Gaussian hills for composition (keep); **delete** the `Math.sin` ridge; **delete** `meander()`.
   - Normalize to [0,1].
3. **Hillshade:** for each interior cell, Horn `dz/dx`, `dz/dy` with `cellsize = 1`. `slope = atan(z_factor * hypot(dzdx, dzdy))` with `z_factor ≈ 8–16` (exaggeration so a [0,1] field actually shades). Lambertian with az 315° / alt 45°. Store shade in [0,1].
4. **SVG ground:** full-rect parchment. Overlay hillshade as a 160×84 PNG data-URL `<image>` with `style="mix-blend-mode:multiply"` and `opacity="0.15"`, or modulate parchment toward `#3c3836` in a tiny raster baked before SVG. Prefer `<image>`: resvg supports linked/embedded raster. Keep the existing straw grid **under** contours, very faint.
5. **Contours:** 10 thresholds `t = (i+1)/11` for `i = 0..9`. Marching squares + stitch (existing). Chaikin 2× on each ring (closed) / chain (open). If `i % 5 === 4` (or `=== 0` — pick one and stick to it), style as **index**; else **intermediate**.
6. **Accent:** independently extract isolevel `0.42 + rand()*0.2` (as today), keep the **single longest** path with `pts.length > 12`, stroke `#d65d0e`. Do not also promote it to index.
7. **Hydrography:** D8 on the height grid (8 neighbors, divide diagonal drop by `√2`). Accumulate upstream counts (Kahn/topo order: process cells by descending elevation, or recurse with memo). Threshold at quantile ~0.97. Vectorize by walking downhill from channel heads until the next channel cell or the border. Stroke walnut, round caps. No sine rivers.
8. **Furniture:** keep the quiet compass, 5 km bar, lowercase IBM Plex title slab. No contour numbers, no fake towns, no extra legend.
9. **Rasterize:** existing `new Resvg(svg, { fitTo: { mode: 'width', value: 1200 } })` then Sharp to 1200×630 PNG.

### Complexity

Horn + D8 + 10 contour passes on 13k cells is negligible next to resvg. Do not SIMD, do not GPU, do not spawn workers.

### What “done” looks like

A parchment card whose **valleys collect orange-adjacent brown streams**, whose **isolines nest without a global sine grain**, whose **shade is felt not seen**, and whose **only loud color is one isoline plus the north tick** — same hierarchy as the rest of the site.

---

## Executive summary of the recipe

Build a 160×84 heightfield from 5-octave isotropic fBM (\(G=0.5\)) with **one** mild Quilez domain warp; drop sine ridges. Hillshade with Horn’s 3×3 kernel, light from the northwest at 45°, multiply onto `#fbf1c7` at ~15% opacity. Extract ~10 isolines by marching squares; Chaikin-smooth twice; draw **every 5th** as a heavier charcoal index (USGS) and **one** mid-level isoline in `#d65d0e`. Derive streams from D8 flow accumulation (not random meanders). Skip hydraulic erosion, contour labels, fake toponyms, Tanaka, and hypsometric greens. Rasterize the SVG with resvg at 1200×630.
