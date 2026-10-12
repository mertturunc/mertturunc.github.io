//#region \0rolldown/runtime.js
var e = Object.defineProperty, t = (e, t, n) => () => {
	if (n) throw n[0];
	try {
		return e && (t = e(e = 0)), t;
	} catch (e) {
		throw n = [e], e;
	}
}, n = (e, t) => () => (t || (e((t = { exports: {} }).exports, t), e = null), t.exports), r = (t, n) => {
	let r = {};
	for (var i in t) e(r, i, {
		get: t[i],
		enumerable: !0
	});
	return n || e(r, Symbol.toStringTag, { value: "Module" }), r;
};
//#endregion
//#region node_modules/three/build/three.core.js
function i(e) {
	for (let t = e.length - 1; t >= 0; --t) if (e[t] >= 65535) return !0;
	return !1;
}
function a(e) {
	return ArrayBuffer.isView(e) && !(e instanceof DataView);
}
function o(e) {
	return document.createElementNS("http://www.w3.org/1999/xhtml", e);
}
function s() {
	let e = o("canvas");
	return e.style.display = "block", e;
}
function c(...e) {
	let t = "THREE." + e.shift();
	Un ? Un("log", t, ...e) : console.log(t, ...e);
}
function l(e) {
	let t = e[0];
	if (typeof t == "string" && t.startsWith("TSL:")) {
		let t = e[1];
		t && t.isStackTrace ? e[0] += " " + t.getLocation() : e[1] = "Stack trace not available. Enable \"THREE.Node.captureStackTrace\" to capture stack traces.";
	}
	return e;
}
function u(...e) {
	e = l(e);
	let t = "THREE." + e.shift();
	if (Un) Un("warn", t, ...e);
	else {
		let n = e[0];
		n && n.isStackTrace ? console.warn(n.getError(t)) : console.warn(t, ...e);
	}
}
function d(...e) {
	e = l(e);
	let t = "THREE." + e.shift();
	if (Un) Un("error", t, ...e);
	else {
		let n = e[0];
		n && n.isStackTrace ? console.error(n.getError(t)) : console.error(t, ...e);
	}
}
function f(...e) {
	let t = e.join(" ");
	t in Hn || (Hn[t] = !0, u(...e));
}
function p(e, t, n) {
	return new Promise(function(r, i) {
		function a() {
			switch (e.clientWaitSync(t, e.SYNC_FLUSH_COMMANDS_BIT, 0)) {
				case e.WAIT_FAILED:
					i();
					break;
				case e.TIMEOUT_EXPIRED:
					setTimeout(a, n);
					break;
				default: r();
			}
		}
		setTimeout(a, n);
	});
}
function m() {
	let e = Math.random() * 4294967295 | 0, t = Math.random() * 4294967295 | 0, n = Math.random() * 4294967295 | 0, r = Math.random() * 4294967295 | 0;
	return (Kn[e & 255] + Kn[e >> 8 & 255] + Kn[e >> 16 & 255] + Kn[e >> 24 & 255] + "-" + Kn[t & 255] + Kn[t >> 8 & 255] + "-" + Kn[t >> 16 & 15 | 64] + Kn[t >> 24 & 255] + "-" + Kn[n & 63 | 128] + Kn[n >> 8 & 255] + "-" + Kn[n >> 16 & 255] + Kn[n >> 24 & 255] + Kn[r & 255] + Kn[r >> 8 & 255] + Kn[r >> 16 & 255] + Kn[r >> 24 & 255]).toLowerCase();
}
function h(e, t, n) {
	return Math.max(t, Math.min(n, e));
}
function g(e, t) {
	return (e % t + t) % t;
}
function _(e, t, n, r, i) {
	return r + (e - t) * (i - r) / (n - t);
}
function v(e, t, n) {
	return e === t ? 0 : (n - e) / (t - e);
}
function y(e, t, n) {
	return (1 - n) * e + n * t;
}
function b(e, t, n, r) {
	return y(e, t, 1 - Math.exp(-n * r));
}
function x(e, t = 1) {
	return t - Math.abs(g(e, t * 2) - t);
}
function S(e, t, n) {
	return e <= t ? 0 : e >= n ? 1 : (e = (e - t) / (n - t), e * e * (3 - 2 * e));
}
function C(e, t, n) {
	return e <= t ? 0 : e >= n ? 1 : (e = (e - t) / (n - t), e * e * e * (e * (e * 6 - 15) + 10));
}
function w(e, t) {
	return e + Math.floor(Math.random() * (t - e + 1));
}
function T(e, t) {
	return e + Math.random() * (t - e);
}
function E(e) {
	return e * (.5 - Math.random());
}
function D(e) {
	e !== void 0 && (qn = e);
	let t = qn += 1831565813;
	return t = Math.imul(t ^ t >>> 15, t | 1), t ^= t + Math.imul(t ^ t >>> 7, t | 61), ((t ^ t >>> 14) >>> 0) / 4294967296;
}
function O(e) {
	return e * Jn;
}
function k(e) {
	return e * Yn;
}
function A(e) {
	return !(e & e - 1) && e !== 0;
}
function j(e) {
	return 2 ** Math.ceil(Math.log(e) / Math.LN2);
}
function M(e) {
	return 2 ** Math.floor(Math.log(e) / Math.LN2);
}
function ee(e, t, n, r, i) {
	let a = Math.cos, o = Math.sin, s = a(n / 2), c = o(n / 2), l = a((t + r) / 2), d = o((t + r) / 2), f = a((t - r) / 2), p = o((t - r) / 2), m = a((r - t) / 2), h = o((r - t) / 2);
	switch (i) {
		case "XYX":
			e.set(s * d, c * f, c * p, s * l);
			break;
		case "YZY":
			e.set(c * p, s * d, c * f, s * l);
			break;
		case "ZXZ":
			e.set(c * f, c * p, s * d, s * l);
			break;
		case "XZX":
			e.set(s * d, c * h, c * m, s * l);
			break;
		case "YXY":
			e.set(c * m, s * d, c * h, s * l);
			break;
		case "ZYZ":
			e.set(c * h, c * m, s * d, s * l);
			break;
		default: u("MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: " + i);
	}
}
function te(e, t) {
	switch (t.constructor) {
		case Float32Array: return e;
		case Uint32Array: return e / 4294967295;
		case Uint16Array: return e / 65535;
		case Uint8Array: return e / 255;
		case Int32Array: return Math.max(e / 2147483647, -1);
		case Int16Array: return Math.max(e / 32767, -1);
		case Int8Array: return Math.max(e / 127, -1);
		default: throw Error("THREE.MathUtils: Invalid component type.");
	}
}
function N(e, t) {
	switch (t.constructor) {
		case Float32Array: return e;
		case Uint32Array: return Math.round(e * 4294967295);
		case Uint16Array: return Math.round(e * 65535);
		case Uint8Array: return Math.round(e * 255);
		case Int32Array: return Math.round(e * 2147483647);
		case Int16Array: return Math.round(e * 32767);
		case Int8Array: return Math.round(e * 127);
		default: throw Error("THREE.MathUtils: Invalid component type.");
	}
}
function ne() {
	let e = {
		enabled: !0,
		workingColorSpace: In,
		spaces: {},
		convert: function(e, t, n) {
			return this.enabled === !1 || t === n || !t || !n ? e : (this.spaces[t].transfer === "srgb" && (e.r = P(e.r), e.g = P(e.g), e.b = P(e.b)), this.spaces[t].primaries !== this.spaces[n].primaries && (e.applyMatrix3(this.spaces[t].toXYZ), e.applyMatrix3(this.spaces[n].fromXYZ)), this.spaces[n].transfer === "srgb" && (e.r = F(e.r), e.g = F(e.g), e.b = F(e.b)), e);
		},
		workingToColorSpace: function(e, t) {
			return this.convert(e, this.workingColorSpace, t);
		},
		colorSpaceToWorking: function(e, t) {
			return this.convert(e, t, this.workingColorSpace);
		},
		getPrimaries: function(e) {
			return this.spaces[e].primaries;
		},
		getTransfer: function(e) {
			return e === "" ? Ln : this.spaces[e].transfer;
		},
		getToneMappingMode: function(e) {
			return this.spaces[e].outputColorSpaceConfig.toneMappingMode || "standard";
		},
		getLuminanceCoefficients: function(e, t = this.workingColorSpace) {
			return e.fromArray(this.spaces[t].luminanceCoefficients);
		},
		define: function(e) {
			Object.assign(this.spaces, e);
		},
		_getMatrix: function(e, t, n) {
			return e.copy(this.spaces[t].toXYZ).multiply(this.spaces[n].fromXYZ);
		},
		_getDrawingBufferColorSpace: function(e) {
			return this.spaces[e].outputColorSpaceConfig.drawingBufferColorSpace;
		},
		_getUnpackColorSpace: function(e = this.workingColorSpace) {
			return this.spaces[e].workingColorSpaceConfig.unpackColorSpace;
		},
		fromWorkingColorSpace: function(t, n) {
			return f("ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."), e.workingToColorSpace(t, n);
		},
		toWorkingColorSpace: function(t, n) {
			return f("ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."), e.colorSpaceToWorking(t, n);
		}
	}, t = [
		.64,
		.33,
		.3,
		.6,
		.15,
		.06
	], n = [
		.2126,
		.7152,
		.0722
	], r = [.3127, .329];
	return e.define({
		[In]: {
			primaries: t,
			whitePoint: r,
			transfer: Ln,
			toXYZ: tr,
			fromXYZ: nr,
			luminanceCoefficients: n,
			workingColorSpaceConfig: { unpackColorSpace: H },
			outputColorSpaceConfig: { drawingBufferColorSpace: H }
		},
		[H]: {
			primaries: t,
			whitePoint: r,
			transfer: Rn,
			toXYZ: tr,
			fromXYZ: nr,
			luminanceCoefficients: n,
			outputColorSpaceConfig: { drawingBufferColorSpace: H }
		}
	}), e;
}
function P(e) {
	return e < .04045 ? e * .0773993808 : (e * .9478672986 + .0521327014) ** 2.4;
}
function F(e) {
	return e < .0031308 ? e * 12.92 : 1.055 * e ** .41666 - .055;
}
function re(e) {
	return typeof HTMLImageElement < "u" && e instanceof HTMLImageElement || typeof HTMLCanvasElement < "u" && e instanceof HTMLCanvasElement || typeof ImageBitmap < "u" && e instanceof ImageBitmap ? ir.getDataURL(e) : e.data ? {
		data: Array.from(e.data),
		width: e.width,
		height: e.height,
		type: e.data.constructor.name
	} : (u("Texture: Unable to serialize Texture."), {});
}
function ie(e, t, n) {
	return n < 0 && (n += 1), n > 1 && --n, n < 1 / 6 ? e + (t - e) * 6 * n : n < 1 / 2 ? t : n < 2 / 3 ? e + (t - e) * 6 * (2 / 3 - n) : e;
}
function I(e, t, n, r, i) {
	for (let a = 0, o = e.length - 3; a <= o; a += 3) {
		Ci.fromArray(e, a);
		let o = i.x * Math.abs(Ci.x) + i.y * Math.abs(Ci.y) + i.z * Math.abs(Ci.z), s = t.dot(Ci), c = n.dot(Ci), l = r.dot(Ci);
		if (Math.max(-Math.max(s, c, l), Math.min(s, c, l)) > o) return !1;
	}
	return !0;
}
function ae(e, t, n, r, i, a, o, s) {
	let c;
	if (c = t.side === 1 ? r.intersectTriangle(o, a, i, !0, s) : r.intersectTriangle(i, a, o, t.side === 0, s), c === null) return null;
	pa.copy(s), pa.applyMatrix4(e.matrixWorld);
	let l = n.ray.origin.distanceTo(pa);
	return l < n.near || l > n.far ? null : {
		distance: l,
		point: pa.clone(),
		object: e
	};
}
function oe(e, t, n, r, i, a, o, s, c, l) {
	e.getVertexPosition(s, sa), e.getVertexPosition(c, ca), e.getVertexPosition(l, la);
	let u = ae(e, t, n, r, sa, ca, la, fa);
	if (u) {
		let e = new W();
		li.getBarycoord(fa, sa, ca, la, e), i && (u.uv = li.getInterpolatedAttribute(i, s, c, l, e, new U())), a && (u.uv1 = li.getInterpolatedAttribute(a, s, c, l, e, new U())), o && (u.normal = li.getInterpolatedAttribute(o, s, c, l, e, new W()), u.normal.dot(r.direction) > 0 && u.normal.multiplyScalar(-1));
		let t = {
			a: s,
			b: c,
			c: l,
			normal: new W(),
			materialIndex: 0
		};
		li.getNormal(sa, ca, la, t.normal), u.face = t, u.barycoord = e;
	}
	return u;
}
function se(e, t, n, r, i, a, o) {
	let s = e.geometry.attributes.position;
	if (Ja.fromBufferAttribute(s, i), Ya.fromBufferAttribute(s, a), n.distanceSqToSegment(Ja, Ya, $a, eo) > r) return;
	$a.applyMatrix4(e.matrixWorld);
	let c = t.ray.origin.distanceTo($a);
	if (!(c < t.near || c > t.far)) return {
		distance: c,
		point: eo.clone().applyMatrix4(e.matrixWorld),
		index: o,
		face: null,
		faceIndex: null,
		barycoord: null,
		object: e
	};
}
function ce(e, t, n, r, i, a, o) {
	let s = co.distanceSqToPoint(e);
	if (s < n) {
		let n = new W();
		co.closestPointToPoint(e, n), n.applyMatrix4(r);
		let c = i.ray.origin.distanceTo(n);
		if (c < i.near || c > i.far) return;
		a.push({
			distance: c,
			distanceToRay: Math.sqrt(s),
			point: n,
			index: t,
			face: null,
			faceIndex: null,
			barycoord: null,
			object: o
		});
	}
}
function le(e, t, n = 2) {
	let r = t && t.length, i = r ? t[0] * n : e.length, a = ue(e, 0, i, n, !0), o = [];
	if (!a || a.next === a.prev) return o;
	let s, c, l;
	if (r && (a = _e(e, t, a, n)), e.length > 80 * n) {
		s = e[0], c = e[1];
		let t = s, r = c;
		for (let a = n; a < i; a += n) {
			let n = e[a], i = e[a + 1];
			n < s && (s = n), i < c && (c = i), n > t && (t = n), i > r && (r = i);
		}
		l = Math.max(t - s, r - c), l = l === 0 ? 0 : 32767 / l;
	}
	return fe(a, o, n, s, c, l, 0), o;
}
function ue(e, t, n, r, i) {
	let a;
	if (i === Ie(e, t, n, r) > 0) for (let i = t; i < n; i += r) a = Ne(i / r | 0, e[i], e[i + 1], a);
	else for (let i = n - r; i >= t; i -= r) a = Ne(i / r | 0, e[i], e[i + 1], a);
	return a && z(a, a.next) && (Pe(a), a = a.next), a;
}
function de(e, t) {
	if (!e) return e;
	t || (t = e);
	let n = e, r;
	do
		if (r = !1, !n.steiner && (z(n, n.next) || R(n.prev, n, n.next) === 0)) {
			if (Pe(n), n = t = n.prev, n === n.next) break;
			r = !0;
		} else n = n.next;
	while (r || n !== t);
	return t;
}
function fe(e, t, n, r, i, a, o) {
	if (!e) return;
	!o && a && Se(e, r, i, a);
	let s = e;
	for (; e.prev !== e.next;) {
		let c = e.prev, l = e.next;
		if (a ? me(e, r, i, a) : pe(e)) {
			t.push(c.i, e.i, l.i), Pe(e), e = l.next, s = l.next;
			continue;
		}
		if (e = l, e === s) {
			o ? o === 1 ? (e = he(de(e), t), fe(e, t, n, r, i, a, 2)) : o === 2 && ge(e, t, n, r, i, a) : fe(de(e), t, n, r, i, a, 1);
			break;
		}
	}
}
function pe(e) {
	let t = e.prev, n = e, r = e.next;
	if (R(t, n, r) >= 0) return !1;
	let i = t.x, a = n.x, o = r.x, s = t.y, c = n.y, l = r.y, u = Math.min(i, a, o), d = Math.min(s, c, l), f = Math.max(i, a, o), p = Math.max(s, c, l), m = r.next;
	for (; m !== t;) {
		if (m.x >= u && m.x <= f && m.y >= d && m.y <= p && Ee(i, s, a, c, o, l, m.x, m.y) && R(m.prev, m, m.next) >= 0) return !1;
		m = m.next;
	}
	return !0;
}
function me(e, t, n, r) {
	let i = e.prev, a = e, o = e.next;
	if (R(i, a, o) >= 0) return !1;
	let s = i.x, c = a.x, l = o.x, u = i.y, d = a.y, f = o.y, p = Math.min(s, c, l), m = Math.min(u, d, f), h = Math.max(s, c, l), g = Math.max(u, d, f), _ = we(p, m, t, n, r), v = we(h, g, t, n, r), y = e.prevZ, b = e.nextZ;
	for (; y && y.z >= _ && b && b.z <= v;) {
		if (y.x >= p && y.x <= h && y.y >= m && y.y <= g && y !== i && y !== o && Ee(s, u, c, d, l, f, y.x, y.y) && R(y.prev, y, y.next) >= 0 || (y = y.prevZ, b.x >= p && b.x <= h && b.y >= m && b.y <= g && b !== i && b !== o && Ee(s, u, c, d, l, f, b.x, b.y) && R(b.prev, b, b.next) >= 0)) return !1;
		b = b.nextZ;
	}
	for (; y && y.z >= _;) {
		if (y.x >= p && y.x <= h && y.y >= m && y.y <= g && y !== i && y !== o && Ee(s, u, c, d, l, f, y.x, y.y) && R(y.prev, y, y.next) >= 0) return !1;
		y = y.prevZ;
	}
	for (; b && b.z <= v;) {
		if (b.x >= p && b.x <= h && b.y >= m && b.y <= g && b !== i && b !== o && Ee(s, u, c, d, l, f, b.x, b.y) && R(b.prev, b, b.next) >= 0) return !1;
		b = b.nextZ;
	}
	return !0;
}
function he(e, t) {
	let n = e;
	do {
		let r = n.prev, i = n.next.next;
		!z(r, i) && Oe(r, n, n.next, i) && Ae(r, i) && Ae(i, r) && (t.push(r.i, n.i, i.i), Pe(n), Pe(n.next), n = e = i), n = n.next;
	} while (n !== e);
	return de(n);
}
function ge(e, t, n, r, i, a) {
	let o = e;
	do {
		let e = o.next.next;
		for (; e !== o.prev;) {
			if (o.i !== e.i && De(o, e)) {
				let s = Me(o, e);
				o = de(o, o.next), s = de(s, s.next), fe(o, t, n, r, i, a, 0), fe(s, t, n, r, i, a, 0);
				return;
			}
			e = e.next;
		}
		o = o.next;
	} while (o !== e);
}
function _e(e, t, n, r) {
	let i = [];
	for (let n = 0, a = t.length; n < a; n++) {
		let o = ue(e, t[n] * r, n < a - 1 ? t[n + 1] * r : e.length, r, !1);
		o === o.next && (o.steiner = !0), i.push(Te(o));
	}
	i.sort(ve);
	for (let e = 0; e < i.length; e++) n = ye(i[e], n);
	return n;
}
function ve(e, t) {
	let n = e.x - t.x;
	return n === 0 && (n = e.y - t.y, n === 0 && (n = (e.next.y - e.y) / (e.next.x - e.x) - (t.next.y - t.y) / (t.next.x - t.x))), n;
}
function ye(e, t) {
	let n = be(e, t);
	if (!n) return t;
	let r = Me(n, e);
	return de(r, r.next), de(n, n.next);
}
function be(e, t) {
	let n = t, r = e.x, i = e.y, a = -Infinity, o;
	if (z(e, n)) return n;
	do {
		if (z(e, n.next)) return n.next;
		if (i <= n.y && i >= n.next.y && n.next.y !== n.y) {
			let e = n.x + (i - n.y) * (n.next.x - n.x) / (n.next.y - n.y);
			if (e <= r && e > a && (a = e, o = n.x < n.next.x ? n : n.next, e === r)) return o;
		}
		n = n.next;
	} while (n !== t);
	if (!o) return null;
	let s = o, c = o.x, l = o.y, u = Infinity;
	n = o;
	do {
		if (r >= n.x && n.x >= c && r !== n.x && L(i < l ? r : a, i, c, l, i < l ? a : r, i, n.x, n.y)) {
			let t = Math.abs(i - n.y) / (r - n.x);
			Ae(n, e) && (t < u || t === u && (n.x > o.x || n.x === o.x && xe(o, n))) && (o = n, u = t);
		}
		n = n.next;
	} while (n !== s);
	return o;
}
function xe(e, t) {
	return R(e.prev, e, t.prev) < 0 && R(t.next, e, e.next) < 0;
}
function Se(e, t, n, r) {
	let i = e;
	do
		i.z === 0 && (i.z = we(i.x, i.y, t, n, r)), i.prevZ = i.prev, i.nextZ = i.next, i = i.next;
	while (i !== e);
	i.prevZ.nextZ = null, i.prevZ = null, Ce(i);
}
function Ce(e) {
	let t, n = 1;
	do {
		let r = e, i;
		e = null;
		let a = null;
		for (t = 0; r;) {
			t++;
			let o = r, s = 0;
			for (let e = 0; e < n && (s++, o = o.nextZ, o); e++);
			let c = n;
			for (; s > 0 || c > 0 && o;) s !== 0 && (c === 0 || !o || r.z <= o.z) ? (i = r, r = r.nextZ, s--) : (i = o, o = o.nextZ, c--), a ? a.nextZ = i : e = i, i.prevZ = a, a = i;
			r = o;
		}
		a.nextZ = null, n *= 2;
	} while (t > 1);
	return e;
}
function we(e, t, n, r, i) {
	return e = (e - n) * i | 0, t = (t - r) * i | 0, e = (e | e << 8) & 16711935, e = (e | e << 4) & 252645135, e = (e | e << 2) & 858993459, e = (e | e << 1) & 1431655765, t = (t | t << 8) & 16711935, t = (t | t << 4) & 252645135, t = (t | t << 2) & 858993459, t = (t | t << 1) & 1431655765, e | t << 1;
}
function Te(e) {
	let t = e, n = e;
	do
		(t.x < n.x || t.x === n.x && t.y < n.y) && (n = t), t = t.next;
	while (t !== e);
	return n;
}
function L(e, t, n, r, i, a, o, s) {
	return (i - o) * (t - s) >= (e - o) * (a - s) && (e - o) * (r - s) >= (n - o) * (t - s) && (n - o) * (a - s) >= (i - o) * (r - s);
}
function Ee(e, t, n, r, i, a, o, s) {
	return (e !== o || t !== s) && L(e, t, n, r, i, a, o, s);
}
function De(e, t) {
	return e.next.i !== t.i && e.prev.i !== t.i && !ke(e, t) && (Ae(e, t) && Ae(t, e) && je(e, t) && (R(e.prev, e, t.prev) || R(e, t.prev, t)) || z(e, t) && R(e.prev, e, e.next) > 0 && R(t.prev, t, t.next) > 0);
}
function R(e, t, n) {
	return (t.y - e.y) * (n.x - t.x) - (t.x - e.x) * (n.y - t.y);
}
function z(e, t) {
	return e.x === t.x && e.y === t.y;
}
function Oe(e, t, n, r) {
	let i = V(R(e, t, n)), a = V(R(e, t, r)), o = V(R(n, r, e)), s = V(R(n, r, t));
	return !!(i !== a && o !== s || i === 0 && B(e, n, t) || a === 0 && B(e, r, t) || o === 0 && B(n, e, r) || s === 0 && B(n, t, r));
}
function B(e, t, n) {
	return t.x <= Math.max(e.x, n.x) && t.x >= Math.min(e.x, n.x) && t.y <= Math.max(e.y, n.y) && t.y >= Math.min(e.y, n.y);
}
function V(e) {
	return e > 0 ? 1 : e < 0 ? -1 : 0;
}
function ke(e, t) {
	let n = e;
	do {
		if (n.i !== e.i && n.next.i !== e.i && n.i !== t.i && n.next.i !== t.i && Oe(n, n.next, e, t)) return !0;
		n = n.next;
	} while (n !== e);
	return !1;
}
function Ae(e, t) {
	return R(e.prev, e, e.next) < 0 ? R(e, t, e.next) >= 0 && R(e, e.prev, t) >= 0 : R(e, t, e.prev) < 0 || R(e, e.next, t) < 0;
}
function je(e, t) {
	let n = e, r = !1, i = (e.x + t.x) / 2, a = (e.y + t.y) / 2;
	do
		n.y > a != n.next.y > a && n.next.y !== n.y && i < (n.next.x - n.x) * (a - n.y) / (n.next.y - n.y) + n.x && (r = !r), n = n.next;
	while (n !== e);
	return r;
}
function Me(e, t) {
	let n = Fe(e.i, e.x, e.y), r = Fe(t.i, t.x, t.y), i = e.next, a = t.prev;
	return e.next = t, t.prev = e, n.next = i, i.prev = n, r.next = n, n.prev = r, a.next = r, r.prev = a, r;
}
function Ne(e, t, n, r) {
	let i = Fe(e, t, n);
	return r ? (i.next = r.next, i.prev = r, r.next.prev = i, r.next = i) : (i.prev = i, i.next = i), i;
}
function Pe(e) {
	e.next.prev = e.prev, e.prev.next = e.next, e.prevZ && (e.prevZ.nextZ = e.nextZ), e.nextZ && (e.nextZ.prevZ = e.prevZ);
}
function Fe(e, t, n) {
	return {
		i: e,
		x: t,
		y: n,
		prev: null,
		next: null,
		z: 0,
		prevZ: null,
		nextZ: null,
		steiner: !1
	};
}
function Ie(e, t, n, r) {
	let i = 0;
	for (let a = t, o = n - r; a < n; a += r) i += (e[o] - e[a]) * (e[a + 1] + e[o + 1]), o = a;
	return i;
}
function Le(e) {
	let t = e.length;
	t > 2 && e[t - 1].equals(e[0]) && e.pop();
}
function Re(e, t) {
	for (let n = 0; n < t.length; n++) e.push(t[n].x), e.push(t[n].y);
}
function ze(e) {
	let t = {};
	for (let n in e) {
		t[n] = {};
		for (let r in e[n]) {
			let i = e[n][r];
			if (Ve(i)) i.isRenderTargetTexture ? (u("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."), t[n][r] = null) : t[n][r] = i.clone();
			else if (Array.isArray(i)) {
				if (Ve(i[0])) {
					let e = [];
					for (let t = 0, n = i.length; t < n; t++) e[t] = i[t].clone();
					t[n][r] = e;
				} else t[n][r] = i.slice();
			} else t[n][r] = i;
		}
	}
	return t;
}
function Be(e) {
	let t = {};
	for (let n = 0; n < e.length; n++) {
		let r = ze(e[n]);
		for (let e in r) t[e] = r[e];
	}
	return t;
}
function Ve(e) {
	return e && (e.isColor || e.isMatrix3 || e.isMatrix4 || e.isVector2 || e.isVector3 || e.isVector4 || e.isTexture || e.isQuaternion);
}
function He(e) {
	let t = [];
	for (let n = 0; n < e.length; n++) t.push(e[n].clone());
	return t;
}
function Ue(e) {
	let t = e.getRenderTarget();
	return t === null ? e.outputColorSpace : t.isXRRenderTarget === !0 ? t.texture.colorSpace : K.workingColorSpace;
}
function We(e, t) {
	return !e || e.constructor === t ? e : typeof t.BYTES_PER_ELEMENT == "number" ? new t(e) : Array.prototype.slice.call(e);
}
function Ge(e) {
	function t(t, n) {
		return e[t] - e[n];
	}
	let n = e.length, r = Array(n);
	for (let e = 0; e !== n; ++e) r[e] = e;
	return r.sort(t), r;
}
function Ke(e, t, n) {
	let r = e.length, i = new e.constructor(r);
	for (let a = 0, o = 0; o !== r; ++a) {
		let r = n[a] * t;
		for (let n = 0; n !== t; ++n) i[o++] = e[r + n];
	}
	return i;
}
function qe(e, t, n, r) {
	let i = 1, a = e[0];
	for (; a !== void 0 && a[r] === void 0;) a = e[i++];
	if (a === void 0) return;
	let o = a[r];
	if (o !== void 0) {
		if (Array.isArray(o)) do
			o = a[r], o !== void 0 && (t.push(a.time), n.push(...o)), a = e[i++];
		while (a !== void 0);
		else if (o.toArray !== void 0) do
			o = a[r], o !== void 0 && (t.push(a.time), o.toArray(n, n.length)), a = e[i++];
		while (a !== void 0);
		else do
			o = a[r], o !== void 0 && (t.push(a.time), n.push(o)), a = e[i++];
		while (a !== void 0);
	}
}
function Je(e) {
	switch (e.toLowerCase()) {
		case "scalar":
		case "double":
		case "float":
		case "number":
		case "integer": return Go;
		case "vector":
		case "vector2":
		case "vector3":
		case "vector4": return Yo;
		case "color": return Wo;
		case "quaternion": return qo;
		case "bool":
		case "boolean": return Uo;
		case "string": return Jo;
	}
	throw Error("THREE.KeyframeTrack: Unsupported typeName: " + e);
}
function Ye(e) {
	if (e.type === void 0) throw Error("THREE.KeyframeTrack: track type undefined, can not parse");
	let t = Je(e.type);
	if (e.times === void 0) {
		let t = [], n = [];
		qe(e.keys, t, n, "value"), e.times = t, e.values = n;
	}
	return t.parse === void 0 ? new t(e.name, e.times, e.values, e.interpolation) : t.parse(e);
}
function Xe(e) {
	try {
		let t = e.slice(e.indexOf(":") + 1);
		return new URL(t).protocol === "blob:";
	} catch {
		return !1;
	}
}
function Ze(e, t, n, r) {
	let i = Qe(r);
	switch (n) {
		case jt: return e * t;
		case It: return e * t / i.components * i.byteLength;
		case Lt: return e * t / i.components * i.byteLength;
		case Rt: return e * t * 2 / i.components * i.byteLength;
		case zt: return e * t * 2 / i.components * i.byteLength;
		case Mt: return e * t * 3 / i.components * i.byteLength;
		case Nt: return e * t * 4 / i.components * i.byteLength;
		case Bt: return e * t * 4 / i.components * i.byteLength;
		case Vt:
		case Ht: return Math.floor((e + 3) / 4) * Math.floor((t + 3) / 4) * 8;
		case Ut:
		case Wt: return Math.floor((e + 3) / 4) * Math.floor((t + 3) / 4) * 16;
		case Kt:
		case Jt: return Math.max(e, 16) * Math.max(t, 8) / 4;
		case Gt:
		case qt: return Math.max(e, 8) * Math.max(t, 8) / 2;
		case Yt:
		case Xt:
		case Qt:
		case $t: return Math.floor((e + 3) / 4) * Math.floor((t + 3) / 4) * 8;
		case Zt:
		case en:
		case tn: return Math.floor((e + 3) / 4) * Math.floor((t + 3) / 4) * 16;
		case nn: return Math.floor((e + 3) / 4) * Math.floor((t + 3) / 4) * 16;
		case rn: return Math.floor((e + 4) / 5) * Math.floor((t + 3) / 4) * 16;
		case an: return Math.floor((e + 4) / 5) * Math.floor((t + 4) / 5) * 16;
		case on: return Math.floor((e + 5) / 6) * Math.floor((t + 4) / 5) * 16;
		case sn: return Math.floor((e + 5) / 6) * Math.floor((t + 5) / 6) * 16;
		case cn: return Math.floor((e + 7) / 8) * Math.floor((t + 4) / 5) * 16;
		case ln: return Math.floor((e + 7) / 8) * Math.floor((t + 5) / 6) * 16;
		case un: return Math.floor((e + 7) / 8) * Math.floor((t + 7) / 8) * 16;
		case dn: return Math.floor((e + 9) / 10) * Math.floor((t + 4) / 5) * 16;
		case fn: return Math.floor((e + 9) / 10) * Math.floor((t + 5) / 6) * 16;
		case pn: return Math.floor((e + 9) / 10) * Math.floor((t + 7) / 8) * 16;
		case mn: return Math.floor((e + 9) / 10) * Math.floor((t + 9) / 10) * 16;
		case hn: return Math.floor((e + 11) / 12) * Math.floor((t + 9) / 10) * 16;
		case gn: return Math.floor((e + 11) / 12) * Math.floor((t + 11) / 12) * 16;
		case _n:
		case vn:
		case yn: return Math.ceil(e / 4) * Math.ceil(t / 4) * 16;
		case bn:
		case xn: return Math.ceil(e / 4) * Math.ceil(t / 4) * 8;
		case Sn:
		case Cn: return Math.ceil(e / 4) * Math.ceil(t / 4) * 16;
	}
	throw Error(`Unable to determine texture byte length for ${n} format.`);
}
function Qe(e) {
	switch (e) {
		case vt:
		case yt: return {
			byteLength: 1,
			components: 1
		};
		case xt:
		case bt:
		case Tt: return {
			byteLength: 2,
			components: 1
		};
		case Et:
		case Dt: return {
			byteLength: 2,
			components: 4
		};
		case Ct:
		case St:
		case wt: return {
			byteLength: 4,
			components: 1
		};
		case kt:
		case At: return {
			byteLength: 4,
			components: 3
		};
	}
	throw Error(`THREE.TextureUtils: Unknown texture type ${e}.`);
}
var $e, et, tt, nt, rt, it, at, ot, st, ct, lt, ut, dt, ft, pt, mt, ht, gt, _t, vt, yt, bt, xt, St, Ct, wt, Tt, Et, Dt, Ot, kt, At, jt, Mt, Nt, Pt, Ft, It, Lt, Rt, zt, Bt, Vt, Ht, Ut, Wt, Gt, Kt, qt, Jt, Yt, Xt, Zt, Qt, $t, en, tn, nn, rn, an, on, sn, cn, ln, un, dn, fn, pn, mn, hn, gn, _n, vn, yn, bn, xn, Sn, Cn, wn, Tn, En, Dn, On, kn, An, jn, Mn, Nn, Pn, Fn, H, In, Ln, Rn, zn, Bn, Vn, Hn, Un, Wn, Gn, Kn, qn, Jn, Yn, Xn, U, Zn, W, Qn, $n, G, er, tr, nr, K, rr, ir, ar, or, sr, cr, lr, ur, dr, fr, pr, mr, q, hr, gr, _r, vr, yr, br, xr, Sr, Cr, wr, Tr, Er, Dr, Or, kr, Ar, jr, Mr, Nr, Pr, Fr, Ir, Lr, Rr, zr, Br, Vr, Hr, Ur, Wr, Gr, Kr, qr, J, Jr, Yr, Xr, Zr, Qr, $r, ei, ti, ni, ri, ii, ai, oi, si, ci, li, ui, di, fi, pi, mi, hi, gi, _i, vi, yi, bi, xi, Si, Ci, wi, Ti, Ei, Di, Oi, ki, Ai, ji, Mi, Ni, Pi, Fi, Ii, Li, Ri, zi, Bi, Vi, Hi, Ui, Wi, Gi, Ki, qi, Ji, Yi, Xi, Zi, Qi, $i, ea, ta, na, ra, ia, aa, oa, sa, ca, la, ua, da, fa, pa, ma, ha, ga, _a, va, ya, ba, xa, Sa, Ca, wa, Ta, Ea, Da, Oa, ka, Aa, ja, Ma, Na, Pa, Fa, Ia, La, Ra, za, Ba, Va, Ha, Ua, Wa, Ga, Ka, qa, Ja, Ya, Xa, Za, Qa, $a, eo, to, no, ro, io, ao, oo, so, co, lo, uo, fo, po, mo, ho, go, _o, vo, yo, bo, xo, So, Co, wo, To, Eo, Do, Oo, ko, Ao, jo, Mo, No, Po, Fo, Io, Lo, Ro, zo, Bo, Vo, Ho, Uo, Wo, Go, Ko, qo, Jo, Yo, Xo, Zo, Qo, $o, es, ts, ns, rs, is, as, os, ss, cs, ls, us, ds, fs, ps, ms, hs, gs, _s, vs, ys, bs, xs, Ss, Cs, ws, Ts, Es, Ds, Os, ks, As, js, Ms, Ns, Ps, Fs, Is, Ls, Rs, zs, Bs, Vs, Hs, Us, Ws, Gs, Ks, qs, Js, Ys, Xs, Zs, Qs, $s = t((() => {
	ct = "attached", lt = 1e3, ut = 1001, dt = 1002, ft = 1003, pt = 1004, mt = 1005, ht = 1006, gt = 1007, _t = 1008, vt = 1009, yt = 1010, bt = 1011, xt = 1012, St = 1013, Ct = 1014, wt = 1015, Tt = 1016, Et = 1017, Dt = 1018, Ot = 1020, kt = 35902, At = 35899, jt = 1021, Mt = 1022, Nt = 1023, Pt = 1026, Ft = 1027, It = 1028, Lt = 1029, Rt = 1030, zt = 1031, Bt = 1033, Vt = 33776, Ht = 33777, Ut = 33778, Wt = 33779, Gt = 35840, Kt = 35841, qt = 35842, Jt = 35843, Yt = 36196, Xt = 37492, Zt = 37496, Qt = 37488, $t = 37489, en = 37490, tn = 37491, nn = 37808, rn = 37809, an = 37810, on = 37811, sn = 37812, cn = 37813, ln = 37814, un = 37815, dn = 37816, fn = 37817, pn = 37818, mn = 37819, hn = 37820, gn = 37821, _n = 36492, vn = 36494, yn = 36495, bn = 36283, xn = 36284, Sn = 36285, Cn = 36286, wn = 2201, Tn = 2202, En = 2300, Dn = 2301, On = 2302, kn = 2303, An = 2400, jn = 2401, Mn = 2402, Nn = 2500, Pn = 2501, Fn = 3200, H = "srgb", In = "srgb-linear", Ln = "linear", Rn = "srgb", zn = 7680, Bn = 35044, Vn = 2e3, Hn = {}, Un = null, Wn = {
		0: 1,
		2: 6,
		4: 7,
		3: 5,
		1: 0,
		6: 2,
		7: 4,
		5: 3
	}, Gn = class {
		addEventListener(e, t) {
			this._listeners === void 0 && (this._listeners = {});
			let n = this._listeners;
			n[e] === void 0 && (n[e] = []), n[e].indexOf(t) === -1 && n[e].push(t);
		}
		hasEventListener(e, t) {
			let n = this._listeners;
			return n !== void 0 && n[e] !== void 0 && n[e].indexOf(t) !== -1;
		}
		removeEventListener(e, t) {
			let n = this._listeners;
			if (n === void 0) return;
			let r = n[e];
			if (r !== void 0) {
				let e = r.indexOf(t);
				e !== -1 && r.splice(e, 1);
			}
		}
		dispatchEvent(e) {
			let t = this._listeners;
			if (t === void 0) return;
			let n = t[e.type];
			if (n !== void 0) {
				e.target = this;
				let t = n.slice(0);
				for (let n = 0, r = t.length; n < r; n++) t[n].call(this, e);
				e.target = null;
			}
		}
	}, Kn = /* @__PURE__ */ "00.01.02.03.04.05.06.07.08.09.0a.0b.0c.0d.0e.0f.10.11.12.13.14.15.16.17.18.19.1a.1b.1c.1d.1e.1f.20.21.22.23.24.25.26.27.28.29.2a.2b.2c.2d.2e.2f.30.31.32.33.34.35.36.37.38.39.3a.3b.3c.3d.3e.3f.40.41.42.43.44.45.46.47.48.49.4a.4b.4c.4d.4e.4f.50.51.52.53.54.55.56.57.58.59.5a.5b.5c.5d.5e.5f.60.61.62.63.64.65.66.67.68.69.6a.6b.6c.6d.6e.6f.70.71.72.73.74.75.76.77.78.79.7a.7b.7c.7d.7e.7f.80.81.82.83.84.85.86.87.88.89.8a.8b.8c.8d.8e.8f.90.91.92.93.94.95.96.97.98.99.9a.9b.9c.9d.9e.9f.a0.a1.a2.a3.a4.a5.a6.a7.a8.a9.aa.ab.ac.ad.ae.af.b0.b1.b2.b3.b4.b5.b6.b7.b8.b9.ba.bb.bc.bd.be.bf.c0.c1.c2.c3.c4.c5.c6.c7.c8.c9.ca.cb.cc.cd.ce.cf.d0.d1.d2.d3.d4.d5.d6.d7.d8.d9.da.db.dc.dd.de.df.e0.e1.e2.e3.e4.e5.e6.e7.e8.e9.ea.eb.ec.ed.ee.ef.f0.f1.f2.f3.f4.f5.f6.f7.f8.f9.fa.fb.fc.fd.fe.ff".split("."), qn = 1234567, Jn = Math.PI / 180, Yn = 180 / Math.PI, Xn = {
		DEG2RAD: Jn,
		RAD2DEG: Yn,
		generateUUID: m,
		clamp: h,
		euclideanModulo: g,
		mapLinear: _,
		inverseLerp: v,
		lerp: y,
		damp: b,
		pingpong: x,
		smoothstep: S,
		smootherstep: C,
		randInt: w,
		randFloat: T,
		randFloatSpread: E,
		seededRandom: D,
		degToRad: O,
		radToDeg: k,
		isPowerOfTwo: A,
		ceilPowerOfTwo: j,
		floorPowerOfTwo: M,
		setQuaternionFromProperEuler: ee,
		normalize: N,
		denormalize: te
	}, at = Symbol.iterator, U = class {
		constructor(e = 0, t = 0) {
			this.x = e, this.y = t;
		}
		get width() {
			return this.x;
		}
		set width(e) {
			this.x = e;
		}
		get height() {
			return this.y;
		}
		set height(e) {
			this.y = e;
		}
		set(e, t) {
			return this.x = e, this.y = t, this;
		}
		setScalar(e) {
			return this.x = e, this.y = e, this;
		}
		setX(e) {
			return this.x = e, this;
		}
		setY(e) {
			return this.y = e, this;
		}
		setComponent(e, t) {
			switch (e) {
				case 0:
					this.x = t;
					break;
				case 1:
					this.y = t;
					break;
				default: throw Error("THREE.Vector2: index is out of range: " + e);
			}
			return this;
		}
		getComponent(e) {
			switch (e) {
				case 0: return this.x;
				case 1: return this.y;
				default: throw Error("THREE.Vector2: index is out of range: " + e);
			}
		}
		clone() {
			return new this.constructor(this.x, this.y);
		}
		copy(e) {
			return this.x = e.x, this.y = e.y, this;
		}
		add(e) {
			return this.x += e.x, this.y += e.y, this;
		}
		addScalar(e) {
			return this.x += e, this.y += e, this;
		}
		addVectors(e, t) {
			return this.x = e.x + t.x, this.y = e.y + t.y, this;
		}
		addScaledVector(e, t) {
			return this.x += e.x * t, this.y += e.y * t, this;
		}
		sub(e) {
			return this.x -= e.x, this.y -= e.y, this;
		}
		subScalar(e) {
			return this.x -= e, this.y -= e, this;
		}
		subVectors(e, t) {
			return this.x = e.x - t.x, this.y = e.y - t.y, this;
		}
		multiply(e) {
			return this.x *= e.x, this.y *= e.y, this;
		}
		multiplyScalar(e) {
			return this.x *= e, this.y *= e, this;
		}
		divide(e) {
			return this.x /= e.x, this.y /= e.y, this;
		}
		divideScalar(e) {
			return this.multiplyScalar(1 / e);
		}
		applyMatrix3(e) {
			let t = this.x, n = this.y, r = e.elements;
			return this.x = r[0] * t + r[3] * n + r[6], this.y = r[1] * t + r[4] * n + r[7], this;
		}
		min(e) {
			return this.x = Math.min(this.x, e.x), this.y = Math.min(this.y, e.y), this;
		}
		max(e) {
			return this.x = Math.max(this.x, e.x), this.y = Math.max(this.y, e.y), this;
		}
		clamp(e, t) {
			return this.x = h(this.x, e.x, t.x), this.y = h(this.y, e.y, t.y), this;
		}
		clampScalar(e, t) {
			return this.x = h(this.x, e, t), this.y = h(this.y, e, t), this;
		}
		clampLength(e, t) {
			let n = this.length();
			return this.divideScalar(n || 1).multiplyScalar(h(n, e, t));
		}
		floor() {
			return this.x = Math.floor(this.x), this.y = Math.floor(this.y), this;
		}
		ceil() {
			return this.x = Math.ceil(this.x), this.y = Math.ceil(this.y), this;
		}
		round() {
			return this.x = Math.round(this.x), this.y = Math.round(this.y), this;
		}
		roundToZero() {
			return this.x = Math.trunc(this.x), this.y = Math.trunc(this.y), this;
		}
		negate() {
			return this.x = -this.x, this.y = -this.y, this;
		}
		dot(e) {
			return this.x * e.x + this.y * e.y;
		}
		cross(e) {
			return this.x * e.y - this.y * e.x;
		}
		lengthSq() {
			return this.x * this.x + this.y * this.y;
		}
		length() {
			return Math.sqrt(this.x * this.x + this.y * this.y);
		}
		manhattanLength() {
			return Math.abs(this.x) + Math.abs(this.y);
		}
		normalize() {
			return this.divideScalar(this.length() || 1);
		}
		angle() {
			return Math.atan2(-this.y, -this.x) + Math.PI;
		}
		angleTo(e) {
			let t = Math.sqrt(this.lengthSq() * e.lengthSq());
			if (t === 0) return Math.PI / 2;
			let n = this.dot(e) / t;
			return Math.acos(h(n, -1, 1));
		}
		distanceTo(e) {
			return Math.sqrt(this.distanceToSquared(e));
		}
		distanceToSquared(e) {
			let t = this.x - e.x, n = this.y - e.y;
			return t * t + n * n;
		}
		manhattanDistanceTo(e) {
			return Math.abs(this.x - e.x) + Math.abs(this.y - e.y);
		}
		setLength(e) {
			return this.normalize().multiplyScalar(e);
		}
		lerp(e, t) {
			return this.x += (e.x - this.x) * t, this.y += (e.y - this.y) * t, this;
		}
		lerpVectors(e, t, n) {
			return this.x = e.x + (t.x - e.x) * n, this.y = e.y + (t.y - e.y) * n, this;
		}
		equals(e) {
			return e.x === this.x && e.y === this.y;
		}
		fromArray(e, t = 0) {
			return this.x = e[t], this.y = e[t + 1], this;
		}
		toArray(e = [], t = 0) {
			return e[t] = this.x, e[t + 1] = this.y, e;
		}
		fromBufferAttribute(e, t) {
			return this.x = e.getX(t), this.y = e.getY(t), this;
		}
		rotateAround(e, t) {
			let n = Math.cos(t), r = Math.sin(t), i = this.x - e.x, a = this.y - e.y;
			return this.x = i * n - a * r + e.x, this.y = i * r + a * n + e.y, this;
		}
		random() {
			return this.x = Math.random(), this.y = Math.random(), this;
		}
		*[at]() {
			yield this.x, yield this.y;
		}
	}, $e = U, $e.prototype.isVector2 = !0, Zn = class {
		constructor(e = 0, t = 0, n = 0, r = 1) {
			this.isQuaternion = !0, this._x = e, this._y = t, this._z = n, this._w = r;
		}
		static slerpFlat(e, t, n, r, i, a, o) {
			let s = n[r + 0], c = n[r + 1], l = n[r + 2], u = n[r + 3], d = i[a + 0], f = i[a + 1], p = i[a + 2], m = i[a + 3];
			if (u !== m || s !== d || c !== f || l !== p) {
				let e = s * d + c * f + l * p + u * m;
				e < 0 && (d = -d, f = -f, p = -p, m = -m, e = -e);
				let t = 1 - o;
				if (e < .9995) {
					let n = Math.acos(e), r = Math.sin(n);
					t = Math.sin(t * n) / r, o = Math.sin(o * n) / r, s = s * t + d * o, c = c * t + f * o, l = l * t + p * o, u = u * t + m * o;
				} else {
					s = s * t + d * o, c = c * t + f * o, l = l * t + p * o, u = u * t + m * o;
					let e = 1 / Math.sqrt(s * s + c * c + l * l + u * u);
					s *= e, c *= e, l *= e, u *= e;
				}
			}
			e[t] = s, e[t + 1] = c, e[t + 2] = l, e[t + 3] = u;
		}
		static multiplyQuaternionsFlat(e, t, n, r, i, a) {
			let o = n[r], s = n[r + 1], c = n[r + 2], l = n[r + 3], u = i[a], d = i[a + 1], f = i[a + 2], p = i[a + 3];
			return e[t] = o * p + l * u + s * f - c * d, e[t + 1] = s * p + l * d + c * u - o * f, e[t + 2] = c * p + l * f + o * d - s * u, e[t + 3] = l * p - o * u - s * d - c * f, e;
		}
		get x() {
			return this._x;
		}
		set x(e) {
			this._x = e, this._onChangeCallback();
		}
		get y() {
			return this._y;
		}
		set y(e) {
			this._y = e, this._onChangeCallback();
		}
		get z() {
			return this._z;
		}
		set z(e) {
			this._z = e, this._onChangeCallback();
		}
		get w() {
			return this._w;
		}
		set w(e) {
			this._w = e, this._onChangeCallback();
		}
		set(e, t, n, r) {
			return this._x = e, this._y = t, this._z = n, this._w = r, this._onChangeCallback(), this;
		}
		clone() {
			return new this.constructor(this._x, this._y, this._z, this._w);
		}
		copy(e) {
			return this._x = e.x, this._y = e.y, this._z = e.z, this._w = e.w, this._onChangeCallback(), this;
		}
		setFromEuler(e, t = !0) {
			let n = e._x, r = e._y, i = e._z, a = e._order, o = Math.cos, s = Math.sin, c = o(n / 2), l = o(r / 2), d = o(i / 2), f = s(n / 2), p = s(r / 2), m = s(i / 2);
			switch (a) {
				case "XYZ":
					this._x = f * l * d + c * p * m, this._y = c * p * d - f * l * m, this._z = c * l * m + f * p * d, this._w = c * l * d - f * p * m;
					break;
				case "YXZ":
					this._x = f * l * d + c * p * m, this._y = c * p * d - f * l * m, this._z = c * l * m - f * p * d, this._w = c * l * d + f * p * m;
					break;
				case "ZXY":
					this._x = f * l * d - c * p * m, this._y = c * p * d + f * l * m, this._z = c * l * m + f * p * d, this._w = c * l * d - f * p * m;
					break;
				case "ZYX":
					this._x = f * l * d - c * p * m, this._y = c * p * d + f * l * m, this._z = c * l * m - f * p * d, this._w = c * l * d + f * p * m;
					break;
				case "YZX":
					this._x = f * l * d + c * p * m, this._y = c * p * d + f * l * m, this._z = c * l * m - f * p * d, this._w = c * l * d - f * p * m;
					break;
				case "XZY":
					this._x = f * l * d - c * p * m, this._y = c * p * d - f * l * m, this._z = c * l * m + f * p * d, this._w = c * l * d + f * p * m;
					break;
				default: u("Quaternion: .setFromEuler() encountered an unknown order: " + a);
			}
			return t === !0 && this._onChangeCallback(), this;
		}
		setFromAxisAngle(e, t) {
			let n = t / 2, r = Math.sin(n);
			return this._x = e.x * r, this._y = e.y * r, this._z = e.z * r, this._w = Math.cos(n), this._onChangeCallback(), this;
		}
		setFromRotationMatrix(e) {
			let t = e.elements, n = t[0], r = t[4], i = t[8], a = t[1], o = t[5], s = t[9], c = t[2], l = t[6], u = t[10], d = n + o + u;
			if (d > 0) {
				let e = .5 / Math.sqrt(d + 1);
				this._w = .25 / e, this._x = (l - s) * e, this._y = (i - c) * e, this._z = (a - r) * e;
			} else if (n > o && n > u) {
				let e = 2 * Math.sqrt(1 + n - o - u);
				this._w = (l - s) / e, this._x = .25 * e, this._y = (r + a) / e, this._z = (i + c) / e;
			} else if (o > u) {
				let e = 2 * Math.sqrt(1 + o - n - u);
				this._w = (i - c) / e, this._x = (r + a) / e, this._y = .25 * e, this._z = (s + l) / e;
			} else {
				let e = 2 * Math.sqrt(1 + u - n - o);
				this._w = (a - r) / e, this._x = (i + c) / e, this._y = (s + l) / e, this._z = .25 * e;
			}
			return this._onChangeCallback(), this;
		}
		setFromUnitVectors(e, t) {
			let n = e.dot(t) + 1;
			return n < 1e-8 ? (n = 0, Math.abs(e.x) > Math.abs(e.z) ? (this._x = -e.y, this._y = e.x, this._z = 0, this._w = n) : (this._x = 0, this._y = -e.z, this._z = e.y, this._w = n)) : (this._x = e.y * t.z - e.z * t.y, this._y = e.z * t.x - e.x * t.z, this._z = e.x * t.y - e.y * t.x, this._w = n), this.normalize();
		}
		angleTo(e) {
			return 2 * Math.acos(Math.abs(h(this.dot(e), -1, 1)));
		}
		rotateTowards(e, t) {
			let n = this.angleTo(e);
			if (n === 0) return this;
			let r = Math.min(1, t / n);
			return this.slerp(e, r), this;
		}
		identity() {
			return this.set(0, 0, 0, 1);
		}
		invert() {
			return this.conjugate();
		}
		conjugate() {
			return this._x *= -1, this._y *= -1, this._z *= -1, this._onChangeCallback(), this;
		}
		dot(e) {
			return this._x * e._x + this._y * e._y + this._z * e._z + this._w * e._w;
		}
		lengthSq() {
			return this._x * this._x + this._y * this._y + this._z * this._z + this._w * this._w;
		}
		length() {
			return Math.sqrt(this._x * this._x + this._y * this._y + this._z * this._z + this._w * this._w);
		}
		normalize() {
			let e = this.length();
			return e === 0 ? (this._x = 0, this._y = 0, this._z = 0, this._w = 1) : (e = 1 / e, this._x *= e, this._y *= e, this._z *= e, this._w *= e), this._onChangeCallback(), this;
		}
		multiply(e) {
			return this.multiplyQuaternions(this, e);
		}
		premultiply(e) {
			return this.multiplyQuaternions(e, this);
		}
		multiplyQuaternions(e, t) {
			let n = e._x, r = e._y, i = e._z, a = e._w, o = t._x, s = t._y, c = t._z, l = t._w;
			return this._x = n * l + a * o + r * c - i * s, this._y = r * l + a * s + i * o - n * c, this._z = i * l + a * c + n * s - r * o, this._w = a * l - n * o - r * s - i * c, this._onChangeCallback(), this;
		}
		slerp(e, t) {
			let n = e._x, r = e._y, i = e._z, a = e._w, o = this.dot(e);
			o < 0 && (n = -n, r = -r, i = -i, a = -a, o = -o);
			let s = 1 - t;
			if (o < .9995) {
				let e = Math.acos(o), c = Math.sin(e);
				s = Math.sin(s * e) / c, t = Math.sin(t * e) / c, this._x = this._x * s + n * t, this._y = this._y * s + r * t, this._z = this._z * s + i * t, this._w = this._w * s + a * t, this._onChangeCallback();
			} else this._x = this._x * s + n * t, this._y = this._y * s + r * t, this._z = this._z * s + i * t, this._w = this._w * s + a * t, this.normalize();
			return this;
		}
		slerpQuaternions(e, t, n) {
			return this.copy(e).slerp(t, n);
		}
		random() {
			let e = 2 * Math.PI * Math.random(), t = 2 * Math.PI * Math.random(), n = Math.random(), r = Math.sqrt(1 - n), i = Math.sqrt(n);
			return this.set(r * Math.sin(e), r * Math.cos(e), i * Math.sin(t), i * Math.cos(t));
		}
		equals(e) {
			return e._x === this._x && e._y === this._y && e._z === this._z && e._w === this._w;
		}
		fromArray(e, t = 0) {
			return this._x = e[t], this._y = e[t + 1], this._z = e[t + 2], this._w = e[t + 3], this._onChangeCallback(), this;
		}
		toArray(e = [], t = 0) {
			return e[t] = this._x, e[t + 1] = this._y, e[t + 2] = this._z, e[t + 3] = this._w, e;
		}
		fromBufferAttribute(e, t) {
			return this._x = e.getX(t), this._y = e.getY(t), this._z = e.getZ(t), this._w = e.getW(t), this._onChangeCallback(), this;
		}
		toJSON() {
			return this.toArray();
		}
		_onChange(e) {
			return this._onChangeCallback = e, this;
		}
		_onChangeCallback() {}
		*[Symbol.iterator]() {
			yield this._x, yield this._y, yield this._z, yield this._w;
		}
	}, ot = Symbol.iterator, W = class {
		constructor(e = 0, t = 0, n = 0) {
			this.x = e, this.y = t, this.z = n;
		}
		set(e, t, n) {
			return n === void 0 && (n = this.z), this.x = e, this.y = t, this.z = n, this;
		}
		setScalar(e) {
			return this.x = e, this.y = e, this.z = e, this;
		}
		setX(e) {
			return this.x = e, this;
		}
		setY(e) {
			return this.y = e, this;
		}
		setZ(e) {
			return this.z = e, this;
		}
		setComponent(e, t) {
			switch (e) {
				case 0:
					this.x = t;
					break;
				case 1:
					this.y = t;
					break;
				case 2:
					this.z = t;
					break;
				default: throw Error("THREE.Vector3: index is out of range: " + e);
			}
			return this;
		}
		getComponent(e) {
			switch (e) {
				case 0: return this.x;
				case 1: return this.y;
				case 2: return this.z;
				default: throw Error("THREE.Vector3: index is out of range: " + e);
			}
		}
		clone() {
			return new this.constructor(this.x, this.y, this.z);
		}
		copy(e) {
			return this.x = e.x, this.y = e.y, this.z = e.z, this;
		}
		add(e) {
			return this.x += e.x, this.y += e.y, this.z += e.z, this;
		}
		addScalar(e) {
			return this.x += e, this.y += e, this.z += e, this;
		}
		addVectors(e, t) {
			return this.x = e.x + t.x, this.y = e.y + t.y, this.z = e.z + t.z, this;
		}
		addScaledVector(e, t) {
			return this.x += e.x * t, this.y += e.y * t, this.z += e.z * t, this;
		}
		sub(e) {
			return this.x -= e.x, this.y -= e.y, this.z -= e.z, this;
		}
		subScalar(e) {
			return this.x -= e, this.y -= e, this.z -= e, this;
		}
		subVectors(e, t) {
			return this.x = e.x - t.x, this.y = e.y - t.y, this.z = e.z - t.z, this;
		}
		multiply(e) {
			return this.x *= e.x, this.y *= e.y, this.z *= e.z, this;
		}
		multiplyScalar(e) {
			return this.x *= e, this.y *= e, this.z *= e, this;
		}
		multiplyVectors(e, t) {
			return this.x = e.x * t.x, this.y = e.y * t.y, this.z = e.z * t.z, this;
		}
		applyEuler(e) {
			return this.applyQuaternion($n.setFromEuler(e));
		}
		applyAxisAngle(e, t) {
			return this.applyQuaternion($n.setFromAxisAngle(e, t));
		}
		applyMatrix3(e) {
			let t = this.x, n = this.y, r = this.z, i = e.elements;
			return this.x = i[0] * t + i[3] * n + i[6] * r, this.y = i[1] * t + i[4] * n + i[7] * r, this.z = i[2] * t + i[5] * n + i[8] * r, this;
		}
		applyNormalMatrix(e) {
			return this.applyMatrix3(e).normalize();
		}
		applyMatrix4(e) {
			let t = this.x, n = this.y, r = this.z, i = e.elements, a = 1 / (i[3] * t + i[7] * n + i[11] * r + i[15]);
			return this.x = (i[0] * t + i[4] * n + i[8] * r + i[12]) * a, this.y = (i[1] * t + i[5] * n + i[9] * r + i[13]) * a, this.z = (i[2] * t + i[6] * n + i[10] * r + i[14]) * a, this;
		}
		applyQuaternion(e) {
			let t = this.x, n = this.y, r = this.z, i = e.x, a = e.y, o = e.z, s = e.w, c = 2 * (a * r - o * n), l = 2 * (o * t - i * r), u = 2 * (i * n - a * t);
			return this.x = t + s * c + a * u - o * l, this.y = n + s * l + o * c - i * u, this.z = r + s * u + i * l - a * c, this;
		}
		project(e) {
			return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix);
		}
		unproject(e) {
			return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld);
		}
		transformDirection(e) {
			let t = this.x, n = this.y, r = this.z, i = e.elements;
			return this.x = i[0] * t + i[4] * n + i[8] * r, this.y = i[1] * t + i[5] * n + i[9] * r, this.z = i[2] * t + i[6] * n + i[10] * r, this.normalize();
		}
		divide(e) {
			return this.x /= e.x, this.y /= e.y, this.z /= e.z, this;
		}
		divideScalar(e) {
			return this.multiplyScalar(1 / e);
		}
		min(e) {
			return this.x = Math.min(this.x, e.x), this.y = Math.min(this.y, e.y), this.z = Math.min(this.z, e.z), this;
		}
		max(e) {
			return this.x = Math.max(this.x, e.x), this.y = Math.max(this.y, e.y), this.z = Math.max(this.z, e.z), this;
		}
		clamp(e, t) {
			return this.x = h(this.x, e.x, t.x), this.y = h(this.y, e.y, t.y), this.z = h(this.z, e.z, t.z), this;
		}
		clampScalar(e, t) {
			return this.x = h(this.x, e, t), this.y = h(this.y, e, t), this.z = h(this.z, e, t), this;
		}
		clampLength(e, t) {
			let n = this.length();
			return this.divideScalar(n || 1).multiplyScalar(h(n, e, t));
		}
		floor() {
			return this.x = Math.floor(this.x), this.y = Math.floor(this.y), this.z = Math.floor(this.z), this;
		}
		ceil() {
			return this.x = Math.ceil(this.x), this.y = Math.ceil(this.y), this.z = Math.ceil(this.z), this;
		}
		round() {
			return this.x = Math.round(this.x), this.y = Math.round(this.y), this.z = Math.round(this.z), this;
		}
		roundToZero() {
			return this.x = Math.trunc(this.x), this.y = Math.trunc(this.y), this.z = Math.trunc(this.z), this;
		}
		negate() {
			return this.x = -this.x, this.y = -this.y, this.z = -this.z, this;
		}
		dot(e) {
			return this.x * e.x + this.y * e.y + this.z * e.z;
		}
		lengthSq() {
			return this.x * this.x + this.y * this.y + this.z * this.z;
		}
		length() {
			return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
		}
		manhattanLength() {
			return Math.abs(this.x) + Math.abs(this.y) + Math.abs(this.z);
		}
		normalize() {
			return this.divideScalar(this.length() || 1);
		}
		setLength(e) {
			return this.normalize().multiplyScalar(e);
		}
		lerp(e, t) {
			return this.x += (e.x - this.x) * t, this.y += (e.y - this.y) * t, this.z += (e.z - this.z) * t, this;
		}
		lerpVectors(e, t, n) {
			return this.x = e.x + (t.x - e.x) * n, this.y = e.y + (t.y - e.y) * n, this.z = e.z + (t.z - e.z) * n, this;
		}
		cross(e) {
			return this.crossVectors(this, e);
		}
		crossVectors(e, t) {
			let n = e.x, r = e.y, i = e.z, a = t.x, o = t.y, s = t.z;
			return this.x = r * s - i * o, this.y = i * a - n * s, this.z = n * o - r * a, this;
		}
		projectOnVector(e) {
			let t = e.lengthSq();
			if (t === 0) return this.set(0, 0, 0);
			let n = e.dot(this) / t;
			return this.copy(e).multiplyScalar(n);
		}
		projectOnPlane(e) {
			return Qn.copy(this).projectOnVector(e), this.sub(Qn);
		}
		reflect(e) {
			return this.sub(Qn.copy(e).multiplyScalar(2 * this.dot(e)));
		}
		angleTo(e) {
			let t = Math.sqrt(this.lengthSq() * e.lengthSq());
			if (t === 0) return Math.PI / 2;
			let n = this.dot(e) / t;
			return Math.acos(h(n, -1, 1));
		}
		distanceTo(e) {
			return Math.sqrt(this.distanceToSquared(e));
		}
		distanceToSquared(e) {
			let t = this.x - e.x, n = this.y - e.y, r = this.z - e.z;
			return t * t + n * n + r * r;
		}
		manhattanDistanceTo(e) {
			return Math.abs(this.x - e.x) + Math.abs(this.y - e.y) + Math.abs(this.z - e.z);
		}
		setFromSpherical(e) {
			return this.setFromSphericalCoords(e.radius, e.phi, e.theta);
		}
		setFromSphericalCoords(e, t, n) {
			let r = Math.sin(t) * e;
			return this.x = r * Math.sin(n), this.y = Math.cos(t) * e, this.z = r * Math.cos(n), this;
		}
		setFromCylindrical(e) {
			return this.setFromCylindricalCoords(e.radius, e.theta, e.y);
		}
		setFromCylindricalCoords(e, t, n) {
			return this.x = e * Math.sin(t), this.y = n, this.z = e * Math.cos(t), this;
		}
		setFromMatrixPosition(e) {
			let t = e.elements;
			return this.x = t[12], this.y = t[13], this.z = t[14], this;
		}
		setFromMatrixScale(e) {
			let t = this.setFromMatrixColumn(e, 0).length(), n = this.setFromMatrixColumn(e, 1).length(), r = this.setFromMatrixColumn(e, 2).length();
			return this.x = t, this.y = n, this.z = r, this;
		}
		setFromMatrixColumn(e, t) {
			return this.fromArray(e.elements, t * 4);
		}
		setFromMatrix3Column(e, t) {
			return this.fromArray(e.elements, t * 3);
		}
		setFromEuler(e) {
			return this.x = e._x, this.y = e._y, this.z = e._z, this;
		}
		setFromColor(e) {
			return this.x = e.r, this.y = e.g, this.z = e.b, this;
		}
		equals(e) {
			return e.x === this.x && e.y === this.y && e.z === this.z;
		}
		fromArray(e, t = 0) {
			return this.x = e[t], this.y = e[t + 1], this.z = e[t + 2], this;
		}
		toArray(e = [], t = 0) {
			return e[t] = this.x, e[t + 1] = this.y, e[t + 2] = this.z, e;
		}
		fromBufferAttribute(e, t) {
			return this.x = e.getX(t), this.y = e.getY(t), this.z = e.getZ(t), this;
		}
		random() {
			return this.x = Math.random(), this.y = Math.random(), this.z = Math.random(), this;
		}
		randomDirection() {
			let e = Math.random() * Math.PI * 2, t = Math.random() * 2 - 1, n = Math.sqrt(1 - t * t);
			return this.x = n * Math.cos(e), this.y = t, this.z = n * Math.sin(e), this;
		}
		*[ot]() {
			yield this.x, yield this.y, yield this.z;
		}
	}, et = W, et.prototype.isVector3 = !0, Qn = /*@__PURE__*/ new W(), $n = /*@__PURE__*/ new Zn(), G = class {
		constructor(e, t, n, r, i, a, o, s, c) {
			this.elements = [
				1,
				0,
				0,
				0,
				1,
				0,
				0,
				0,
				1
			], e !== void 0 && this.set(e, t, n, r, i, a, o, s, c);
		}
		set(e, t, n, r, i, a, o, s, c) {
			let l = this.elements;
			return l[0] = e, l[1] = r, l[2] = o, l[3] = t, l[4] = i, l[5] = s, l[6] = n, l[7] = a, l[8] = c, this;
		}
		identity() {
			return this.set(1, 0, 0, 0, 1, 0, 0, 0, 1), this;
		}
		copy(e) {
			let t = this.elements, n = e.elements;
			return t[0] = n[0], t[1] = n[1], t[2] = n[2], t[3] = n[3], t[4] = n[4], t[5] = n[5], t[6] = n[6], t[7] = n[7], t[8] = n[8], this;
		}
		extractBasis(e, t, n) {
			return e.setFromMatrix3Column(this, 0), t.setFromMatrix3Column(this, 1), n.setFromMatrix3Column(this, 2), this;
		}
		setFromMatrix4(e) {
			let t = e.elements;
			return this.set(t[0], t[4], t[8], t[1], t[5], t[9], t[2], t[6], t[10]), this;
		}
		multiply(e) {
			return this.multiplyMatrices(this, e);
		}
		premultiply(e) {
			return this.multiplyMatrices(e, this);
		}
		multiplyMatrices(e, t) {
			let n = e.elements, r = t.elements, i = this.elements, a = n[0], o = n[3], s = n[6], c = n[1], l = n[4], u = n[7], d = n[2], f = n[5], p = n[8], m = r[0], h = r[3], g = r[6], _ = r[1], v = r[4], y = r[7], b = r[2], x = r[5], S = r[8];
			return i[0] = a * m + o * _ + s * b, i[3] = a * h + o * v + s * x, i[6] = a * g + o * y + s * S, i[1] = c * m + l * _ + u * b, i[4] = c * h + l * v + u * x, i[7] = c * g + l * y + u * S, i[2] = d * m + f * _ + p * b, i[5] = d * h + f * v + p * x, i[8] = d * g + f * y + p * S, this;
		}
		multiplyScalar(e) {
			let t = this.elements;
			return t[0] *= e, t[3] *= e, t[6] *= e, t[1] *= e, t[4] *= e, t[7] *= e, t[2] *= e, t[5] *= e, t[8] *= e, this;
		}
		determinant() {
			let e = this.elements, t = e[0], n = e[1], r = e[2], i = e[3], a = e[4], o = e[5], s = e[6], c = e[7], l = e[8];
			return t * a * l - t * o * c - n * i * l + n * o * s + r * i * c - r * a * s;
		}
		invert() {
			let e = this.elements, t = e[0], n = e[1], r = e[2], i = e[3], a = e[4], o = e[5], s = e[6], c = e[7], l = e[8], u = l * a - o * c, d = o * s - l * i, f = c * i - a * s, p = t * u + n * d + r * f;
			if (p === 0) return this.set(0, 0, 0, 0, 0, 0, 0, 0, 0);
			let m = 1 / p;
			return e[0] = u * m, e[1] = (r * c - l * n) * m, e[2] = (o * n - r * a) * m, e[3] = d * m, e[4] = (l * t - r * s) * m, e[5] = (r * i - o * t) * m, e[6] = f * m, e[7] = (n * s - c * t) * m, e[8] = (a * t - n * i) * m, this;
		}
		transpose() {
			let e, t = this.elements;
			return e = t[1], t[1] = t[3], t[3] = e, e = t[2], t[2] = t[6], t[6] = e, e = t[5], t[5] = t[7], t[7] = e, this;
		}
		getNormalMatrix(e) {
			return this.setFromMatrix4(e).invert().transpose();
		}
		transposeIntoArray(e) {
			let t = this.elements;
			return e[0] = t[0], e[1] = t[3], e[2] = t[6], e[3] = t[1], e[4] = t[4], e[5] = t[7], e[6] = t[2], e[7] = t[5], e[8] = t[8], this;
		}
		setUvTransform(e, t, n, r, i, a, o) {
			let s = Math.cos(i), c = Math.sin(i);
			return this.set(n * s, n * c, -n * (s * a + c * o) + a + e, -r * c, r * s, -r * (-c * a + s * o) + o + t, 0, 0, 1), this;
		}
		scale(e, t) {
			return f("Matrix3: .scale() is deprecated. Use .makeScale() instead."), this.premultiply(er.makeScale(e, t)), this;
		}
		rotate(e) {
			return f("Matrix3: .rotate() is deprecated. Use .makeRotation() instead."), this.premultiply(er.makeRotation(-e)), this;
		}
		translate(e, t) {
			return f("Matrix3: .translate() is deprecated. Use .makeTranslation() instead."), this.premultiply(er.makeTranslation(e, t)), this;
		}
		makeTranslation(e, t) {
			return e.isVector2 ? this.set(1, 0, e.x, 0, 1, e.y, 0, 0, 1) : this.set(1, 0, e, 0, 1, t, 0, 0, 1), this;
		}
		makeRotation(e) {
			let t = Math.cos(e), n = Math.sin(e);
			return this.set(t, -n, 0, n, t, 0, 0, 0, 1), this;
		}
		makeScale(e, t) {
			return this.set(e, 0, 0, 0, t, 0, 0, 0, 1), this;
		}
		equals(e) {
			let t = this.elements, n = e.elements;
			for (let e = 0; e < 9; e++) if (t[e] !== n[e]) return !1;
			return !0;
		}
		fromArray(e, t = 0) {
			for (let n = 0; n < 9; n++) this.elements[n] = e[n + t];
			return this;
		}
		toArray(e = [], t = 0) {
			let n = this.elements;
			return e[t] = n[0], e[t + 1] = n[1], e[t + 2] = n[2], e[t + 3] = n[3], e[t + 4] = n[4], e[t + 5] = n[5], e[t + 6] = n[6], e[t + 7] = n[7], e[t + 8] = n[8], e;
		}
		clone() {
			return new this.constructor().fromArray(this.elements);
		}
	}, tt = G, tt.prototype.isMatrix3 = !0, er = /*@__PURE__*/ new G(), tr = /*@__PURE__*/ new G().set(.4123908, .3575843, .1804808, .212639, .7151687, .0721923, .0193308, .1191948, .9505322), nr = /*@__PURE__*/ new G().set(3.2409699, -1.5373832, -.4986108, -.9692436, 1.8759675, .0415551, .0556301, -.203977, 1.0569715), K = /*@__PURE__*/ ne(), ir = class {
		static getDataURL(e, t = "image/png") {
			if (/^data:/i.test(e.src) || typeof HTMLCanvasElement > "u") return e.src;
			let n;
			if (e instanceof HTMLCanvasElement) n = e;
			else {
				rr === void 0 && (rr = o("canvas")), rr.width = e.width, rr.height = e.height;
				let t = rr.getContext("2d");
				e instanceof ImageData ? t.putImageData(e, 0, 0) : t.drawImage(e, 0, 0, e.width, e.height), n = rr;
			}
			return n.toDataURL(t);
		}
		static sRGBToLinear(e) {
			if (typeof HTMLImageElement < "u" && e instanceof HTMLImageElement || typeof HTMLCanvasElement < "u" && e instanceof HTMLCanvasElement || typeof ImageBitmap < "u" && e instanceof ImageBitmap) {
				let t = o("canvas");
				t.width = e.width, t.height = e.height;
				let n = t.getContext("2d");
				n.drawImage(e, 0, 0, e.width, e.height);
				let r = n.getImageData(0, 0, e.width, e.height), i = r.data;
				for (let e = 0; e < i.length; e++) i[e] = P(i[e] / 255) * 255;
				return n.putImageData(r, 0, 0), t;
			}
			if (e.data) {
				let t = e.data.slice(0);
				for (let e = 0; e < t.length; e++) t instanceof Uint8Array || t instanceof Uint8ClampedArray ? t[e] = Math.floor(P(t[e] / 255) * 255) : t[e] = P(t[e]);
				return {
					data: t,
					width: e.width,
					height: e.height
				};
			}
			return u("ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."), e;
		}
	}, ar = 0, or = class {
		constructor(e = null) {
			this.isSource = !0, Object.defineProperty(this, "id", { value: ar++ }), this.uuid = m(), this.data = e, this.dataReady = !0, this.version = 0;
		}
		getSize(e) {
			let t = this.data;
			return typeof HTMLVideoElement < "u" && t instanceof HTMLVideoElement ? e.set(t.videoWidth, t.videoHeight, 0) : typeof VideoFrame < "u" && t instanceof VideoFrame ? e.set(t.displayWidth, t.displayHeight, 0) : t === null ? e.set(0, 0, 0) : e.set(t.width, t.height, t.depth || 0), e;
		}
		set needsUpdate(e) {
			e === !0 && this.version++;
		}
		toJSON(e) {
			let t = e === void 0 || typeof e == "string";
			if (!t && e.images[this.uuid] !== void 0) return e.images[this.uuid];
			let n = {
				uuid: this.uuid,
				url: ""
			}, r = this.data;
			if (r !== null) {
				let e;
				if (Array.isArray(r)) {
					e = [];
					for (let t = 0, n = r.length; t < n; t++) r[t].isDataTexture ? e.push(re(r[t].image)) : e.push(re(r[t]));
				} else e = re(r);
				n.url = e;
			}
			return t || (e.images[this.uuid] = n), n;
		}
	}, sr = 0, cr = /*@__PURE__*/ new W(), lr = class e extends Gn {
		constructor(t = e.DEFAULT_IMAGE, n = e.DEFAULT_MAPPING, r = ut, i = ut, a = ht, o = _t, s = Nt, c = vt, l = e.DEFAULT_ANISOTROPY, u = "") {
			super(), this.isTexture = !0, Object.defineProperty(this, "id", { value: sr++ }), this.uuid = m(), this.name = "", this.source = new or(t), this.mipmaps = [], this.mapping = n, this.channel = 0, this.wrapS = r, this.wrapT = i, this.magFilter = a, this.minFilter = o, this.anisotropy = l, this.format = s, this.internalFormat = null, this.type = c, this.offset = new U(0, 0), this.repeat = new U(1, 1), this.center = new U(0, 0), this.rotation = 0, this.matrixAutoUpdate = !0, this.matrix = new G(), this.generateMipmaps = !0, this.premultiplyAlpha = !1, this.flipY = !0, this.unpackAlignment = 4, this.colorSpace = u, this.userData = {}, this.updateRanges = [], this.version = 0, this.onUpdate = null, this.renderTarget = null, this.isRenderTargetTexture = !1, this.isArrayTexture = !!(t && t.depth && t.depth > 1), this.pmremVersion = 0, this.normalized = !1;
		}
		get width() {
			return this.source.getSize(cr).x;
		}
		get height() {
			return this.source.getSize(cr).y;
		}
		get depth() {
			return this.source.getSize(cr).z;
		}
		get image() {
			return this.source.data;
		}
		set image(e) {
			this.source.data = e;
		}
		updateMatrix() {
			this.matrix.setUvTransform(this.offset.x, this.offset.y, this.repeat.x, this.repeat.y, this.rotation, this.center.x, this.center.y);
		}
		addUpdateRange(e, t) {
			this.updateRanges.push({
				start: e,
				count: t
			});
		}
		clearUpdateRanges() {
			this.updateRanges.length = 0;
		}
		clone() {
			return new this.constructor().copy(this);
		}
		copy(e) {
			return this.name = e.name, this.source = e.source, this.mipmaps = e.mipmaps.slice(0), this.mapping = e.mapping, this.channel = e.channel, this.wrapS = e.wrapS, this.wrapT = e.wrapT, this.magFilter = e.magFilter, this.minFilter = e.minFilter, this.anisotropy = e.anisotropy, this.format = e.format, this.internalFormat = e.internalFormat, this.type = e.type, this.normalized = e.normalized, this.offset.copy(e.offset), this.repeat.copy(e.repeat), this.center.copy(e.center), this.rotation = e.rotation, this.matrixAutoUpdate = e.matrixAutoUpdate, this.matrix.copy(e.matrix), this.generateMipmaps = e.generateMipmaps, this.premultiplyAlpha = e.premultiplyAlpha, this.flipY = e.flipY, this.unpackAlignment = e.unpackAlignment, this.colorSpace = e.colorSpace, this.renderTarget = e.renderTarget, this.isRenderTargetTexture = e.isRenderTargetTexture, this.isArrayTexture = e.isArrayTexture, this.userData = JSON.parse(JSON.stringify(e.userData)), this.needsUpdate = !0, this;
		}
		setValues(e) {
			for (let t in e) {
				let n = e[t];
				if (n === void 0) {
					u(`Texture.setValues(): parameter '${t}' has value of undefined.`);
					continue;
				}
				let r = this[t];
				if (r === void 0) {
					u(`Texture.setValues(): property '${t}' does not exist.`);
					continue;
				}
				r && n && r.isVector2 && n.isVector2 || r && n && r.isVector3 && n.isVector3 || r && n && r.isMatrix3 && n.isMatrix3 ? r.copy(n) : this[t] = n;
			}
		}
		toJSON(e) {
			let t = e === void 0 || typeof e == "string";
			if (!t && e.textures[this.uuid] !== void 0) return e.textures[this.uuid];
			let n = {
				metadata: {
					version: 4.7,
					type: "Texture",
					generator: "Texture.toJSON"
				},
				uuid: this.uuid,
				name: this.name,
				image: this.source.toJSON(e).uuid,
				mapping: this.mapping,
				channel: this.channel,
				repeat: [this.repeat.x, this.repeat.y],
				offset: [this.offset.x, this.offset.y],
				center: [this.center.x, this.center.y],
				rotation: this.rotation,
				wrap: [this.wrapS, this.wrapT],
				format: this.format,
				internalFormat: this.internalFormat,
				type: this.type,
				normalized: this.normalized,
				colorSpace: this.colorSpace,
				minFilter: this.minFilter,
				magFilter: this.magFilter,
				anisotropy: this.anisotropy,
				flipY: this.flipY,
				generateMipmaps: this.generateMipmaps,
				premultiplyAlpha: this.premultiplyAlpha,
				unpackAlignment: this.unpackAlignment
			};
			return Object.keys(this.userData).length > 0 && (n.userData = this.userData), t || (e.textures[this.uuid] = n), n;
		}
		dispose() {
			this.dispatchEvent({ type: "dispose" });
		}
		transformUv(e) {
			if (this.mapping !== 300) return e;
			if (e.applyMatrix3(this.matrix), e.x < 0 || e.x > 1) switch (this.wrapS) {
				case lt:
					e.x -= Math.floor(e.x);
					break;
				case ut:
					e.x = e.x < 0 ? 0 : 1;
					break;
				case dt: Math.abs(Math.floor(e.x) % 2) === 1 ? e.x = Math.ceil(e.x) - e.x : e.x -= Math.floor(e.x);
			}
			if (e.y < 0 || e.y > 1) switch (this.wrapT) {
				case lt:
					e.y -= Math.floor(e.y);
					break;
				case ut:
					e.y = e.y < 0 ? 0 : 1;
					break;
				case dt: Math.abs(Math.floor(e.y) % 2) === 1 ? e.y = Math.ceil(e.y) - e.y : e.y -= Math.floor(e.y);
			}
			return this.flipY && (e.y = 1 - e.y), e;
		}
		set needsUpdate(e) {
			e === !0 && (this.version++, this.source.needsUpdate = !0);
		}
		set needsPMREMUpdate(e) {
			e === !0 && this.pmremVersion++;
		}
	}, lr.DEFAULT_IMAGE = null, lr.DEFAULT_MAPPING = 300, lr.DEFAULT_ANISOTROPY = 1, st = Symbol.iterator, ur = class {
		constructor(e = 0, t = 0, n = 0, r = 1) {
			this.x = e, this.y = t, this.z = n, this.w = r;
		}
		get width() {
			return this.z;
		}
		set width(e) {
			this.z = e;
		}
		get height() {
			return this.w;
		}
		set height(e) {
			this.w = e;
		}
		set(e, t, n, r) {
			return this.x = e, this.y = t, this.z = n, this.w = r, this;
		}
		setScalar(e) {
			return this.x = e, this.y = e, this.z = e, this.w = e, this;
		}
		setX(e) {
			return this.x = e, this;
		}
		setY(e) {
			return this.y = e, this;
		}
		setZ(e) {
			return this.z = e, this;
		}
		setW(e) {
			return this.w = e, this;
		}
		setComponent(e, t) {
			switch (e) {
				case 0:
					this.x = t;
					break;
				case 1:
					this.y = t;
					break;
				case 2:
					this.z = t;
					break;
				case 3:
					this.w = t;
					break;
				default: throw Error("THREE.Vector4: index is out of range: " + e);
			}
			return this;
		}
		getComponent(e) {
			switch (e) {
				case 0: return this.x;
				case 1: return this.y;
				case 2: return this.z;
				case 3: return this.w;
				default: throw Error("THREE.Vector4: index is out of range: " + e);
			}
		}
		clone() {
			return new this.constructor(this.x, this.y, this.z, this.w);
		}
		copy(e) {
			return this.x = e.x, this.y = e.y, this.z = e.z, this.w = e.w === void 0 ? 1 : e.w, this;
		}
		add(e) {
			return this.x += e.x, this.y += e.y, this.z += e.z, this.w += e.w, this;
		}
		addScalar(e) {
			return this.x += e, this.y += e, this.z += e, this.w += e, this;
		}
		addVectors(e, t) {
			return this.x = e.x + t.x, this.y = e.y + t.y, this.z = e.z + t.z, this.w = e.w + t.w, this;
		}
		addScaledVector(e, t) {
			return this.x += e.x * t, this.y += e.y * t, this.z += e.z * t, this.w += e.w * t, this;
		}
		sub(e) {
			return this.x -= e.x, this.y -= e.y, this.z -= e.z, this.w -= e.w, this;
		}
		subScalar(e) {
			return this.x -= e, this.y -= e, this.z -= e, this.w -= e, this;
		}
		subVectors(e, t) {
			return this.x = e.x - t.x, this.y = e.y - t.y, this.z = e.z - t.z, this.w = e.w - t.w, this;
		}
		multiply(e) {
			return this.x *= e.x, this.y *= e.y, this.z *= e.z, this.w *= e.w, this;
		}
		multiplyScalar(e) {
			return this.x *= e, this.y *= e, this.z *= e, this.w *= e, this;
		}
		applyMatrix4(e) {
			let t = this.x, n = this.y, r = this.z, i = this.w, a = e.elements;
			return this.x = a[0] * t + a[4] * n + a[8] * r + a[12] * i, this.y = a[1] * t + a[5] * n + a[9] * r + a[13] * i, this.z = a[2] * t + a[6] * n + a[10] * r + a[14] * i, this.w = a[3] * t + a[7] * n + a[11] * r + a[15] * i, this;
		}
		divide(e) {
			return this.x /= e.x, this.y /= e.y, this.z /= e.z, this.w /= e.w, this;
		}
		divideScalar(e) {
			return this.multiplyScalar(1 / e);
		}
		setAxisAngleFromQuaternion(e) {
			this.w = 2 * Math.acos(e.w);
			let t = Math.sqrt(1 - e.w * e.w);
			return t < 1e-4 ? (this.x = 1, this.y = 0, this.z = 0) : (this.x = e.x / t, this.y = e.y / t, this.z = e.z / t), this;
		}
		setAxisAngleFromRotationMatrix(e) {
			let t, n, r, i, a = .01, o = .1, s = e.elements, c = s[0], l = s[4], u = s[8], d = s[1], f = s[5], p = s[9], m = s[2], h = s[6], g = s[10];
			if (Math.abs(l - d) < a && Math.abs(u - m) < a && Math.abs(p - h) < a) {
				if (Math.abs(l + d) < o && Math.abs(u + m) < o && Math.abs(p + h) < o && Math.abs(c + f + g - 3) < o) return this.set(1, 0, 0, 0), this;
				t = Math.PI;
				let e = (c + 1) / 2, s = (f + 1) / 2, _ = (g + 1) / 2, v = (l + d) / 4, y = (u + m) / 4, b = (p + h) / 4;
				return e > s && e > _ ? e < a ? (n = 0, r = .707106781, i = .707106781) : (n = Math.sqrt(e), r = v / n, i = y / n) : s > _ ? s < a ? (n = .707106781, r = 0, i = .707106781) : (r = Math.sqrt(s), n = v / r, i = b / r) : _ < a ? (n = .707106781, r = .707106781, i = 0) : (i = Math.sqrt(_), n = y / i, r = b / i), this.set(n, r, i, t), this;
			}
			let _ = Math.sqrt((h - p) * (h - p) + (u - m) * (u - m) + (d - l) * (d - l));
			return Math.abs(_) < .001 && (_ = 1), this.x = (h - p) / _, this.y = (u - m) / _, this.z = (d - l) / _, this.w = Math.acos((c + f + g - 1) / 2), this;
		}
		setFromMatrixPosition(e) {
			let t = e.elements;
			return this.x = t[12], this.y = t[13], this.z = t[14], this.w = t[15], this;
		}
		min(e) {
			return this.x = Math.min(this.x, e.x), this.y = Math.min(this.y, e.y), this.z = Math.min(this.z, e.z), this.w = Math.min(this.w, e.w), this;
		}
		max(e) {
			return this.x = Math.max(this.x, e.x), this.y = Math.max(this.y, e.y), this.z = Math.max(this.z, e.z), this.w = Math.max(this.w, e.w), this;
		}
		clamp(e, t) {
			return this.x = h(this.x, e.x, t.x), this.y = h(this.y, e.y, t.y), this.z = h(this.z, e.z, t.z), this.w = h(this.w, e.w, t.w), this;
		}
		clampScalar(e, t) {
			return this.x = h(this.x, e, t), this.y = h(this.y, e, t), this.z = h(this.z, e, t), this.w = h(this.w, e, t), this;
		}
		clampLength(e, t) {
			let n = this.length();
			return this.divideScalar(n || 1).multiplyScalar(h(n, e, t));
		}
		floor() {
			return this.x = Math.floor(this.x), this.y = Math.floor(this.y), this.z = Math.floor(this.z), this.w = Math.floor(this.w), this;
		}
		ceil() {
			return this.x = Math.ceil(this.x), this.y = Math.ceil(this.y), this.z = Math.ceil(this.z), this.w = Math.ceil(this.w), this;
		}
		round() {
			return this.x = Math.round(this.x), this.y = Math.round(this.y), this.z = Math.round(this.z), this.w = Math.round(this.w), this;
		}
		roundToZero() {
			return this.x = Math.trunc(this.x), this.y = Math.trunc(this.y), this.z = Math.trunc(this.z), this.w = Math.trunc(this.w), this;
		}
		negate() {
			return this.x = -this.x, this.y = -this.y, this.z = -this.z, this.w = -this.w, this;
		}
		dot(e) {
			return this.x * e.x + this.y * e.y + this.z * e.z + this.w * e.w;
		}
		lengthSq() {
			return this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w;
		}
		length() {
			return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w);
		}
		manhattanLength() {
			return Math.abs(this.x) + Math.abs(this.y) + Math.abs(this.z) + Math.abs(this.w);
		}
		normalize() {
			return this.divideScalar(this.length() || 1);
		}
		setLength(e) {
			return this.normalize().multiplyScalar(e);
		}
		lerp(e, t) {
			return this.x += (e.x - this.x) * t, this.y += (e.y - this.y) * t, this.z += (e.z - this.z) * t, this.w += (e.w - this.w) * t, this;
		}
		lerpVectors(e, t, n) {
			return this.x = e.x + (t.x - e.x) * n, this.y = e.y + (t.y - e.y) * n, this.z = e.z + (t.z - e.z) * n, this.w = e.w + (t.w - e.w) * n, this;
		}
		equals(e) {
			return e.x === this.x && e.y === this.y && e.z === this.z && e.w === this.w;
		}
		fromArray(e, t = 0) {
			return this.x = e[t], this.y = e[t + 1], this.z = e[t + 2], this.w = e[t + 3], this;
		}
		toArray(e = [], t = 0) {
			return e[t] = this.x, e[t + 1] = this.y, e[t + 2] = this.z, e[t + 3] = this.w, e;
		}
		fromBufferAttribute(e, t) {
			return this.x = e.getX(t), this.y = e.getY(t), this.z = e.getZ(t), this.w = e.getW(t), this;
		}
		random() {
			return this.x = Math.random(), this.y = Math.random(), this.z = Math.random(), this.w = Math.random(), this;
		}
		*[st]() {
			yield this.x, yield this.y, yield this.z, yield this.w;
		}
	}, nt = ur, nt.prototype.isVector4 = !0, dr = class extends Gn {
		constructor(e = 1, t = 1, n = {}) {
			super(), n = Object.assign({
				generateMipmaps: !1,
				internalFormat: null,
				minFilter: ht,
				depthBuffer: !0,
				stencilBuffer: !1,
				resolveDepthBuffer: !0,
				resolveStencilBuffer: !0,
				depthTexture: null,
				samples: 0,
				count: 1,
				depth: 1,
				multiview: !1,
				useArrayDepthTexture: !1
			}, n), this.isRenderTarget = !0, this.width = e, this.height = t, this.depth = n.depth, this.scissor = new ur(0, 0, e, t), this.scissorTest = !1, this.viewport = new ur(0, 0, e, t), this.textures = [];
			let r = {
				width: e,
				height: t,
				depth: n.depth
			}, i = new lr(r), a = n.count;
			for (let e = 0; e < a; e++) this.textures[e] = i.clone(), this.textures[e].isRenderTargetTexture = !0, this.textures[e].renderTarget = this;
			this._setTextureOptions(n), this.depthBuffer = n.depthBuffer, this.stencilBuffer = n.stencilBuffer, this.resolveDepthBuffer = n.resolveDepthBuffer, this.resolveStencilBuffer = n.resolveStencilBuffer, this._depthTexture = null, this.depthTexture = n.depthTexture, this.samples = n.samples, this.multiview = n.multiview, this.useArrayDepthTexture = n.useArrayDepthTexture;
		}
		_setTextureOptions(e = {}) {
			let t = {
				minFilter: ht,
				generateMipmaps: !1,
				flipY: !1,
				internalFormat: null
			};
			e.mapping !== void 0 && (t.mapping = e.mapping), e.wrapS !== void 0 && (t.wrapS = e.wrapS), e.wrapT !== void 0 && (t.wrapT = e.wrapT), e.wrapR !== void 0 && (t.wrapR = e.wrapR), e.magFilter !== void 0 && (t.magFilter = e.magFilter), e.minFilter !== void 0 && (t.minFilter = e.minFilter), e.format !== void 0 && (t.format = e.format), e.type !== void 0 && (t.type = e.type), e.anisotropy !== void 0 && (t.anisotropy = e.anisotropy), e.colorSpace !== void 0 && (t.colorSpace = e.colorSpace), e.flipY !== void 0 && (t.flipY = e.flipY), e.generateMipmaps !== void 0 && (t.generateMipmaps = e.generateMipmaps), e.internalFormat !== void 0 && (t.internalFormat = e.internalFormat);
			for (let e = 0; e < this.textures.length; e++) this.textures[e].setValues(t);
		}
		get texture() {
			return this.textures[0];
		}
		set texture(e) {
			this.textures[0] = e;
		}
		set depthTexture(e) {
			this._depthTexture !== null && (this._depthTexture.renderTarget = null), e !== null && (e.renderTarget = this), this._depthTexture = e;
		}
		get depthTexture() {
			return this._depthTexture;
		}
		setSize(e, t, n = 1) {
			if (this.width !== e || this.height !== t || this.depth !== n) {
				this.width = e, this.height = t, this.depth = n;
				for (let r = 0, i = this.textures.length; r < i; r++) this.textures[r].image.width = e, this.textures[r].image.height = t, this.textures[r].image.depth = n, this.textures[r].isData3DTexture !== !0 && (this.textures[r].isArrayTexture = this.textures[r].image.depth > 1);
				this.dispose();
			}
			this.viewport.set(0, 0, e, t), this.scissor.set(0, 0, e, t);
		}
		clone() {
			return new this.constructor().copy(this);
		}
		copy(e) {
			this.width = e.width, this.height = e.height, this.depth = e.depth, this.scissor.copy(e.scissor), this.scissorTest = e.scissorTest, this.viewport.copy(e.viewport), this.textures.length = 0;
			for (let t = 0, n = e.textures.length; t < n; t++) {
				this.textures[t] = e.textures[t].clone(), this.textures[t].isRenderTargetTexture = !0, this.textures[t].renderTarget = this;
				let n = Object.assign({}, e.textures[t].image);
				this.textures[t].source = new or(n);
			}
			return this.depthBuffer = e.depthBuffer, this.stencilBuffer = e.stencilBuffer, this.resolveDepthBuffer = e.resolveDepthBuffer, this.resolveStencilBuffer = e.resolveStencilBuffer, e.depthTexture !== null && (this.depthTexture = e.depthTexture.clone()), this.samples = e.samples, this.multiview = e.multiview, this.useArrayDepthTexture = e.useArrayDepthTexture, this;
		}
		dispose() {
			this.dispatchEvent({ type: "dispose" });
		}
	}, fr = class extends dr {
		constructor(e = 1, t = 1, n = {}) {
			super(e, t, n), this.isWebGLRenderTarget = !0;
		}
	}, pr = class extends lr {
		constructor(e = null, t = 1, n = 1, r = 1) {
			super(null), this.isDataArrayTexture = !0, this.image = {
				data: e,
				width: t,
				height: n,
				depth: r
			}, this.magFilter = ft, this.minFilter = ft, this.wrapR = ut, this.generateMipmaps = !1, this.flipY = !1, this.unpackAlignment = 1, this.layerUpdates = /* @__PURE__ */ new Set();
		}
		addLayerUpdate(e) {
			this.layerUpdates.add(e);
		}
		clearLayerUpdates() {
			this.layerUpdates.clear();
		}
	}, mr = class extends lr {
		constructor(e = null, t = 1, n = 1, r = 1) {
			super(null), this.isData3DTexture = !0, this.image = {
				data: e,
				width: t,
				height: n,
				depth: r
			}, this.magFilter = ft, this.minFilter = ft, this.wrapR = ut, this.generateMipmaps = !1, this.flipY = !1, this.unpackAlignment = 1;
		}
	}, q = class e {
		constructor(e, t, n, r, i, a, o, s, c, l, u, d, f, p, m, h) {
			this.elements = [
				1,
				0,
				0,
				0,
				0,
				1,
				0,
				0,
				0,
				0,
				1,
				0,
				0,
				0,
				0,
				1
			], e !== void 0 && this.set(e, t, n, r, i, a, o, s, c, l, u, d, f, p, m, h);
		}
		set(e, t, n, r, i, a, o, s, c, l, u, d, f, p, m, h) {
			let g = this.elements;
			return g[0] = e, g[4] = t, g[8] = n, g[12] = r, g[1] = i, g[5] = a, g[9] = o, g[13] = s, g[2] = c, g[6] = l, g[10] = u, g[14] = d, g[3] = f, g[7] = p, g[11] = m, g[15] = h, this;
		}
		identity() {
			return this.set(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1), this;
		}
		clone() {
			return new e().fromArray(this.elements);
		}
		copy(e) {
			let t = this.elements, n = e.elements;
			return t[0] = n[0], t[1] = n[1], t[2] = n[2], t[3] = n[3], t[4] = n[4], t[5] = n[5], t[6] = n[6], t[7] = n[7], t[8] = n[8], t[9] = n[9], t[10] = n[10], t[11] = n[11], t[12] = n[12], t[13] = n[13], t[14] = n[14], t[15] = n[15], this;
		}
		copyPosition(e) {
			let t = this.elements, n = e.elements;
			return t[12] = n[12], t[13] = n[13], t[14] = n[14], this;
		}
		setFromMatrix3(e) {
			let t = e.elements;
			return this.set(t[0], t[3], t[6], 0, t[1], t[4], t[7], 0, t[2], t[5], t[8], 0, 0, 0, 0, 1), this;
		}
		extractBasis(e, t, n) {
			return this.determinantAffine() === 0 ? (e.set(1, 0, 0), t.set(0, 1, 0), n.set(0, 0, 1), this) : (e.setFromMatrixColumn(this, 0), t.setFromMatrixColumn(this, 1), n.setFromMatrixColumn(this, 2), this);
		}
		makeBasis(e, t, n) {
			return this.set(e.x, t.x, n.x, 0, e.y, t.y, n.y, 0, e.z, t.z, n.z, 0, 0, 0, 0, 1), this;
		}
		extractRotation(e) {
			if (e.determinantAffine() === 0) return this.identity();
			let t = this.elements, n = e.elements, r = 1 / hr.setFromMatrixColumn(e, 0).length(), i = 1 / hr.setFromMatrixColumn(e, 1).length(), a = 1 / hr.setFromMatrixColumn(e, 2).length();
			return t[0] = n[0] * r, t[1] = n[1] * r, t[2] = n[2] * r, t[3] = 0, t[4] = n[4] * i, t[5] = n[5] * i, t[6] = n[6] * i, t[7] = 0, t[8] = n[8] * a, t[9] = n[9] * a, t[10] = n[10] * a, t[11] = 0, t[12] = 0, t[13] = 0, t[14] = 0, t[15] = 1, this;
		}
		makeRotationFromEuler(e) {
			let t = this.elements, n = e.x, r = e.y, i = e.z, a = Math.cos(n), o = Math.sin(n), s = Math.cos(r), c = Math.sin(r), l = Math.cos(i), u = Math.sin(i);
			if (e.order === "XYZ") {
				let e = a * l, n = a * u, r = o * l, i = o * u;
				t[0] = s * l, t[4] = -s * u, t[8] = c, t[1] = n + r * c, t[5] = e - i * c, t[9] = -o * s, t[2] = i - e * c, t[6] = r + n * c, t[10] = a * s;
			} else if (e.order === "YXZ") {
				let e = s * l, n = s * u, r = c * l, i = c * u;
				t[0] = e + i * o, t[4] = r * o - n, t[8] = a * c, t[1] = a * u, t[5] = a * l, t[9] = -o, t[2] = n * o - r, t[6] = i + e * o, t[10] = a * s;
			} else if (e.order === "ZXY") {
				let e = s * l, n = s * u, r = c * l, i = c * u;
				t[0] = e - i * o, t[4] = -a * u, t[8] = r + n * o, t[1] = n + r * o, t[5] = a * l, t[9] = i - e * o, t[2] = -a * c, t[6] = o, t[10] = a * s;
			} else if (e.order === "ZYX") {
				let e = a * l, n = a * u, r = o * l, i = o * u;
				t[0] = s * l, t[4] = r * c - n, t[8] = e * c + i, t[1] = s * u, t[5] = i * c + e, t[9] = n * c - r, t[2] = -c, t[6] = o * s, t[10] = a * s;
			} else if (e.order === "YZX") {
				let e = a * s, n = a * c, r = o * s, i = o * c;
				t[0] = s * l, t[4] = i - e * u, t[8] = r * u + n, t[1] = u, t[5] = a * l, t[9] = -o * l, t[2] = -c * l, t[6] = n * u + r, t[10] = e - i * u;
			} else if (e.order === "XZY") {
				let e = a * s, n = a * c, r = o * s, i = o * c;
				t[0] = s * l, t[4] = -u, t[8] = c * l, t[1] = e * u + i, t[5] = a * l, t[9] = n * u - r, t[2] = r * u - n, t[6] = o * l, t[10] = i * u + e;
			}
			return t[3] = 0, t[7] = 0, t[11] = 0, t[12] = 0, t[13] = 0, t[14] = 0, t[15] = 1, this;
		}
		makeRotationFromQuaternion(e) {
			return this.compose(_r, e, vr);
		}
		lookAt(e, t, n) {
			let r = this.elements;
			return xr.subVectors(e, t), xr.lengthSq() === 0 && (xr.z = 1), xr.normalize(), yr.crossVectors(n, xr), yr.lengthSq() === 0 && (Math.abs(n.z) === 1 ? xr.x += 1e-4 : xr.z += 1e-4, xr.normalize(), yr.crossVectors(n, xr)), yr.normalize(), br.crossVectors(xr, yr), r[0] = yr.x, r[4] = br.x, r[8] = xr.x, r[1] = yr.y, r[5] = br.y, r[9] = xr.y, r[2] = yr.z, r[6] = br.z, r[10] = xr.z, this;
		}
		multiply(e) {
			return this.multiplyMatrices(this, e);
		}
		premultiply(e) {
			return this.multiplyMatrices(e, this);
		}
		multiplyMatrices(e, t) {
			let n = e.elements, r = t.elements, i = this.elements, a = n[0], o = n[4], s = n[8], c = n[12], l = n[1], u = n[5], d = n[9], f = n[13], p = n[2], m = n[6], h = n[10], g = n[14], _ = n[3], v = n[7], y = n[11], b = n[15], x = r[0], S = r[4], C = r[8], w = r[12], T = r[1], E = r[5], D = r[9], O = r[13], k = r[2], A = r[6], j = r[10], M = r[14], ee = r[3], te = r[7], N = r[11], ne = r[15];
			return i[0] = a * x + o * T + s * k + c * ee, i[4] = a * S + o * E + s * A + c * te, i[8] = a * C + o * D + s * j + c * N, i[12] = a * w + o * O + s * M + c * ne, i[1] = l * x + u * T + d * k + f * ee, i[5] = l * S + u * E + d * A + f * te, i[9] = l * C + u * D + d * j + f * N, i[13] = l * w + u * O + d * M + f * ne, i[2] = p * x + m * T + h * k + g * ee, i[6] = p * S + m * E + h * A + g * te, i[10] = p * C + m * D + h * j + g * N, i[14] = p * w + m * O + h * M + g * ne, i[3] = _ * x + v * T + y * k + b * ee, i[7] = _ * S + v * E + y * A + b * te, i[11] = _ * C + v * D + y * j + b * N, i[15] = _ * w + v * O + y * M + b * ne, this;
		}
		multiplyScalar(e) {
			let t = this.elements;
			return t[0] *= e, t[4] *= e, t[8] *= e, t[12] *= e, t[1] *= e, t[5] *= e, t[9] *= e, t[13] *= e, t[2] *= e, t[6] *= e, t[10] *= e, t[14] *= e, t[3] *= e, t[7] *= e, t[11] *= e, t[15] *= e, this;
		}
		determinant() {
			let e = this.elements, t = e[0], n = e[4], r = e[8], i = e[12], a = e[1], o = e[5], s = e[9], c = e[13], l = e[2], u = e[6], d = e[10], f = e[14], p = e[3], m = e[7], h = e[11], g = e[15], _ = s * f - c * d, v = o * f - c * u, y = o * d - s * u, b = a * f - c * l, x = a * d - s * l, S = a * u - o * l;
			return t * (m * _ - h * v + g * y) - n * (p * _ - h * b + g * x) + r * (p * v - m * b + g * S) - i * (p * y - m * x + h * S);
		}
		determinantAffine() {
			let e = this.elements, t = e[0], n = e[4], r = e[8], i = e[1], a = e[5], o = e[9], s = e[2], c = e[6], l = e[10];
			return t * (a * l - o * c) - n * (i * l - o * s) + r * (i * c - a * s);
		}
		transpose() {
			let e = this.elements, t;
			return t = e[1], e[1] = e[4], e[4] = t, t = e[2], e[2] = e[8], e[8] = t, t = e[6], e[6] = e[9], e[9] = t, t = e[3], e[3] = e[12], e[12] = t, t = e[7], e[7] = e[13], e[13] = t, t = e[11], e[11] = e[14], e[14] = t, this;
		}
		setPosition(e, t, n) {
			let r = this.elements;
			return e.isVector3 ? (r[12] = e.x, r[13] = e.y, r[14] = e.z) : (r[12] = e, r[13] = t, r[14] = n), this;
		}
		invert() {
			let e = this.elements, t = e[0], n = e[1], r = e[2], i = e[3], a = e[4], o = e[5], s = e[6], c = e[7], l = e[8], u = e[9], d = e[10], f = e[11], p = e[12], m = e[13], h = e[14], g = e[15], _ = t * o - n * a, v = t * s - r * a, y = t * c - i * a, b = n * s - r * o, x = n * c - i * o, S = r * c - i * s, C = l * m - u * p, w = l * h - d * p, T = l * g - f * p, E = u * h - d * m, D = u * g - f * m, O = d * g - f * h, k = _ * O - v * D + y * E + b * T - x * w + S * C;
			if (k === 0) return this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
			let A = 1 / k;
			return e[0] = (o * O - s * D + c * E) * A, e[1] = (r * D - n * O - i * E) * A, e[2] = (m * S - h * x + g * b) * A, e[3] = (d * x - u * S - f * b) * A, e[4] = (s * T - a * O - c * w) * A, e[5] = (t * O - r * T + i * w) * A, e[6] = (h * y - p * S - g * v) * A, e[7] = (l * S - d * y + f * v) * A, e[8] = (a * D - o * T + c * C) * A, e[9] = (n * T - t * D - i * C) * A, e[10] = (p * x - m * y + g * _) * A, e[11] = (u * y - l * x - f * _) * A, e[12] = (o * w - a * E - s * C) * A, e[13] = (t * E - n * w + r * C) * A, e[14] = (m * v - p * b - h * _) * A, e[15] = (l * b - u * v + d * _) * A, this;
		}
		scale(e) {
			let t = this.elements, n = e.x, r = e.y, i = e.z;
			return t[0] *= n, t[4] *= r, t[8] *= i, t[1] *= n, t[5] *= r, t[9] *= i, t[2] *= n, t[6] *= r, t[10] *= i, t[3] *= n, t[7] *= r, t[11] *= i, this;
		}
		getMaxScaleOnAxis() {
			let e = this.elements, t = e[0] * e[0] + e[1] * e[1] + e[2] * e[2], n = e[4] * e[4] + e[5] * e[5] + e[6] * e[6], r = e[8] * e[8] + e[9] * e[9] + e[10] * e[10];
			return Math.sqrt(Math.max(t, n, r));
		}
		makeTranslation(e, t, n) {
			return e.isVector3 ? this.set(1, 0, 0, e.x, 0, 1, 0, e.y, 0, 0, 1, e.z, 0, 0, 0, 1) : this.set(1, 0, 0, e, 0, 1, 0, t, 0, 0, 1, n, 0, 0, 0, 1), this;
		}
		makeRotationX(e) {
			let t = Math.cos(e), n = Math.sin(e);
			return this.set(1, 0, 0, 0, 0, t, -n, 0, 0, n, t, 0, 0, 0, 0, 1), this;
		}
		makeRotationY(e) {
			let t = Math.cos(e), n = Math.sin(e);
			return this.set(t, 0, n, 0, 0, 1, 0, 0, -n, 0, t, 0, 0, 0, 0, 1), this;
		}
		makeRotationZ(e) {
			let t = Math.cos(e), n = Math.sin(e);
			return this.set(t, -n, 0, 0, n, t, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1), this;
		}
		makeRotationAxis(e, t) {
			let n = Math.cos(t), r = Math.sin(t), i = 1 - n, a = e.x, o = e.y, s = e.z, c = i * a, l = i * o;
			return this.set(c * a + n, c * o - r * s, c * s + r * o, 0, c * o + r * s, l * o + n, l * s - r * a, 0, c * s - r * o, l * s + r * a, i * s * s + n, 0, 0, 0, 0, 1), this;
		}
		makeScale(e, t, n) {
			return this.set(e, 0, 0, 0, 0, t, 0, 0, 0, 0, n, 0, 0, 0, 0, 1), this;
		}
		makeShear(e, t, n, r, i, a) {
			return this.set(1, n, i, 0, e, 1, a, 0, t, r, 1, 0, 0, 0, 0, 1), this;
		}
		compose(e, t, n) {
			let r = this.elements, i = t._x, a = t._y, o = t._z, s = t._w, c = i + i, l = a + a, u = o + o, d = i * c, f = i * l, p = i * u, m = a * l, h = a * u, g = o * u, _ = s * c, v = s * l, y = s * u, b = n.x, x = n.y, S = n.z;
			return r[0] = (1 - (m + g)) * b, r[1] = (f + y) * b, r[2] = (p - v) * b, r[3] = 0, r[4] = (f - y) * x, r[5] = (1 - (d + g)) * x, r[6] = (h + _) * x, r[7] = 0, r[8] = (p + v) * S, r[9] = (h - _) * S, r[10] = (1 - (d + m)) * S, r[11] = 0, r[12] = e.x, r[13] = e.y, r[14] = e.z, r[15] = 1, this;
		}
		decompose(e, t, n) {
			let r = this.elements;
			e.x = r[12], e.y = r[13], e.z = r[14];
			let i = this.determinantAffine();
			if (i === 0) return n.set(1, 1, 1), t.identity(), this;
			let a = hr.set(r[0], r[1], r[2]).length(), o = hr.set(r[4], r[5], r[6]).length(), s = hr.set(r[8], r[9], r[10]).length();
			i < 0 && (a = -a), gr.copy(this);
			let c = 1 / a, l = 1 / o, u = 1 / s;
			return gr.elements[0] *= c, gr.elements[1] *= c, gr.elements[2] *= c, gr.elements[4] *= l, gr.elements[5] *= l, gr.elements[6] *= l, gr.elements[8] *= u, gr.elements[9] *= u, gr.elements[10] *= u, t.setFromRotationMatrix(gr), n.x = a, n.y = o, n.z = s, this;
		}
		makePerspective(e, t, n, r, i, a, o = Vn, s = !1) {
			let c = this.elements, l = 2 * i / (t - e), u = 2 * i / (n - r), d = (t + e) / (t - e), f = (n + r) / (n - r), p, m;
			if (s) p = i / (a - i), m = a * i / (a - i);
			else if (o === 2e3) p = -(a + i) / (a - i), m = -2 * a * i / (a - i);
			else if (o === 2001) p = -a / (a - i), m = -a * i / (a - i);
			else throw Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: " + o);
			return c[0] = l, c[4] = 0, c[8] = d, c[12] = 0, c[1] = 0, c[5] = u, c[9] = f, c[13] = 0, c[2] = 0, c[6] = 0, c[10] = p, c[14] = m, c[3] = 0, c[7] = 0, c[11] = -1, c[15] = 0, this;
		}
		makeOrthographic(e, t, n, r, i, a, o = Vn, s = !1) {
			let c = this.elements, l = 2 / (t - e), u = 2 / (n - r), d = -(t + e) / (t - e), f = -(n + r) / (n - r), p, m;
			if (s) p = 1 / (a - i), m = a / (a - i);
			else if (o === 2e3) p = -2 / (a - i), m = -(a + i) / (a - i);
			else if (o === 2001) p = -1 / (a - i), m = -i / (a - i);
			else throw Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: " + o);
			return c[0] = l, c[4] = 0, c[8] = 0, c[12] = d, c[1] = 0, c[5] = u, c[9] = 0, c[13] = f, c[2] = 0, c[6] = 0, c[10] = p, c[14] = m, c[3] = 0, c[7] = 0, c[11] = 0, c[15] = 1, this;
		}
		equals(e) {
			let t = this.elements, n = e.elements;
			for (let e = 0; e < 16; e++) if (t[e] !== n[e]) return !1;
			return !0;
		}
		fromArray(e, t = 0) {
			for (let n = 0; n < 16; n++) this.elements[n] = e[n + t];
			return this;
		}
		toArray(e = [], t = 0) {
			let n = this.elements;
			return e[t] = n[0], e[t + 1] = n[1], e[t + 2] = n[2], e[t + 3] = n[3], e[t + 4] = n[4], e[t + 5] = n[5], e[t + 6] = n[6], e[t + 7] = n[7], e[t + 8] = n[8], e[t + 9] = n[9], e[t + 10] = n[10], e[t + 11] = n[11], e[t + 12] = n[12], e[t + 13] = n[13], e[t + 14] = n[14], e[t + 15] = n[15], e;
		}
	}, rt = q, rt.prototype.isMatrix4 = !0, hr = /*@__PURE__*/ new W(), gr = /*@__PURE__*/ new q(), _r = /*@__PURE__*/ new W(0, 0, 0), vr = /*@__PURE__*/ new W(1, 1, 1), yr = /*@__PURE__*/ new W(), br = /*@__PURE__*/ new W(), xr = /*@__PURE__*/ new W(), Sr = /*@__PURE__*/ new q(), Cr = /*@__PURE__*/ new Zn(), wr = class e {
		constructor(t = 0, n = 0, r = 0, i = e.DEFAULT_ORDER) {
			this.isEuler = !0, this._x = t, this._y = n, this._z = r, this._order = i;
		}
		get x() {
			return this._x;
		}
		set x(e) {
			this._x = e, this._onChangeCallback();
		}
		get y() {
			return this._y;
		}
		set y(e) {
			this._y = e, this._onChangeCallback();
		}
		get z() {
			return this._z;
		}
		set z(e) {
			this._z = e, this._onChangeCallback();
		}
		get order() {
			return this._order;
		}
		set order(e) {
			this._order = e, this._onChangeCallback();
		}
		set(e, t, n, r = this._order) {
			return this._x = e, this._y = t, this._z = n, this._order = r, this._onChangeCallback(), this;
		}
		clone() {
			return new this.constructor(this._x, this._y, this._z, this._order);
		}
		copy(e) {
			return this._x = e._x, this._y = e._y, this._z = e._z, this._order = e._order, this._onChangeCallback(), this;
		}
		setFromRotationMatrix(e, t = this._order, n = !0) {
			let r = e.elements, i = r[0], a = r[4], o = r[8], s = r[1], c = r[5], l = r[9], d = r[2], f = r[6], p = r[10];
			switch (t) {
				case "XYZ":
					this._y = Math.asin(h(o, -1, 1)), Math.abs(o) < .9999999 ? (this._x = Math.atan2(-l, p), this._z = Math.atan2(-a, i)) : (this._x = Math.atan2(f, c), this._z = 0);
					break;
				case "YXZ":
					this._x = Math.asin(-h(l, -1, 1)), Math.abs(l) < .9999999 ? (this._y = Math.atan2(o, p), this._z = Math.atan2(s, c)) : (this._y = Math.atan2(-d, i), this._z = 0);
					break;
				case "ZXY":
					this._x = Math.asin(h(f, -1, 1)), Math.abs(f) < .9999999 ? (this._y = Math.atan2(-d, p), this._z = Math.atan2(-a, c)) : (this._y = 0, this._z = Math.atan2(s, i));
					break;
				case "ZYX":
					this._y = Math.asin(-h(d, -1, 1)), Math.abs(d) < .9999999 ? (this._x = Math.atan2(f, p), this._z = Math.atan2(s, i)) : (this._x = 0, this._z = Math.atan2(-a, c));
					break;
				case "YZX":
					this._z = Math.asin(h(s, -1, 1)), Math.abs(s) < .9999999 ? (this._x = Math.atan2(-l, c), this._y = Math.atan2(-d, i)) : (this._x = 0, this._y = Math.atan2(o, p));
					break;
				case "XZY":
					this._z = Math.asin(-h(a, -1, 1)), Math.abs(a) < .9999999 ? (this._x = Math.atan2(f, c), this._y = Math.atan2(o, i)) : (this._x = Math.atan2(-l, p), this._y = 0);
					break;
				default: u("Euler: .setFromRotationMatrix() encountered an unknown order: " + t);
			}
			return this._order = t, n === !0 && this._onChangeCallback(), this;
		}
		setFromQuaternion(e, t, n) {
			return Sr.makeRotationFromQuaternion(e), this.setFromRotationMatrix(Sr, t, n);
		}
		setFromVector3(e, t = this._order) {
			return this.set(e.x, e.y, e.z, t);
		}
		reorder(e) {
			return Cr.setFromEuler(this), this.setFromQuaternion(Cr, e);
		}
		equals(e) {
			return e._x === this._x && e._y === this._y && e._z === this._z && e._order === this._order;
		}
		fromArray(e) {
			return this._x = e[0], this._y = e[1], this._z = e[2], e[3] !== void 0 && (this._order = e[3]), this._onChangeCallback(), this;
		}
		toArray(e = [], t = 0) {
			return e[t] = this._x, e[t + 1] = this._y, e[t + 2] = this._z, e[t + 3] = this._order, e;
		}
		_onChange(e) {
			return this._onChangeCallback = e, this;
		}
		_onChangeCallback() {}
		*[Symbol.iterator]() {
			yield this._x, yield this._y, yield this._z, yield this._order;
		}
	}, wr.DEFAULT_ORDER = "XYZ", Tr = class {
		constructor() {
			this.mask = 1;
		}
		set(e) {
			this.mask = (1 << e | 0) >>> 0;
		}
		enable(e) {
			this.mask |= 1 << e | 0;
		}
		enableAll() {
			this.mask = -1;
		}
		toggle(e) {
			this.mask ^= 1 << e | 0;
		}
		disable(e) {
			this.mask &= ~(1 << e | 0);
		}
		disableAll() {
			this.mask = 0;
		}
		test(e) {
			return (this.mask & e.mask) !== 0;
		}
		isEnabled(e) {
			return !!(this.mask & (1 << e | 0));
		}
	}, Er = 0, Dr = /*@__PURE__*/ new W(), Or = /*@__PURE__*/ new Zn(), kr = /*@__PURE__*/ new q(), Ar = /*@__PURE__*/ new W(), jr = /*@__PURE__*/ new W(), Mr = /*@__PURE__*/ new W(), Nr = /*@__PURE__*/ new Zn(), Pr = /*@__PURE__*/ new W(1, 0, 0), Fr = /*@__PURE__*/ new W(0, 1, 0), Ir = /*@__PURE__*/ new W(0, 0, 1), Lr = { type: "added" }, Rr = { type: "removed" }, zr = {
		type: "childadded",
		child: null
	}, Br = {
		type: "childremoved",
		child: null
	}, Vr = class e extends Gn {
		constructor() {
			super(), this.isObject3D = !0, Object.defineProperty(this, "id", { value: Er++ }), this.uuid = m(), this.name = "", this.type = "Object3D", this.parent = null, this.children = [], this.up = e.DEFAULT_UP.clone();
			let t = new W(), n = new wr(), r = new Zn(), i = new W(1, 1, 1);
			function a() {
				r.setFromEuler(n, !1);
			}
			function o() {
				n.setFromQuaternion(r, void 0, !1);
			}
			n._onChange(a), r._onChange(o), Object.defineProperties(this, {
				position: {
					configurable: !0,
					enumerable: !0,
					value: t
				},
				rotation: {
					configurable: !0,
					enumerable: !0,
					value: n
				},
				quaternion: {
					configurable: !0,
					enumerable: !0,
					value: r
				},
				scale: {
					configurable: !0,
					enumerable: !0,
					value: i
				},
				modelViewMatrix: { value: new q() },
				normalMatrix: { value: new G() }
			}), this.matrix = new q(), this.matrixWorld = new q(), this.matrixAutoUpdate = e.DEFAULT_MATRIX_AUTO_UPDATE, this.matrixWorldAutoUpdate = e.DEFAULT_MATRIX_WORLD_AUTO_UPDATE, this.matrixWorldNeedsUpdate = !1, this.layers = new Tr(), this.visible = !0, this.castShadow = !1, this.receiveShadow = !1, this.frustumCulled = !0, this.renderOrder = 0, this.animations = [], this.customDepthMaterial = void 0, this.customDistanceMaterial = void 0, this.static = !1, this.userData = {}, this.pivot = null;
		}
		onBeforeShadow() {}
		onAfterShadow() {}
		onBeforeRender() {}
		onAfterRender() {}
		applyMatrix4(e) {
			this.matrixAutoUpdate && this.updateMatrix(), this.matrix.premultiply(e), this.matrix.decompose(this.position, this.quaternion, this.scale);
		}
		applyQuaternion(e) {
			return this.quaternion.premultiply(e), this;
		}
		setRotationFromAxisAngle(e, t) {
			this.quaternion.setFromAxisAngle(e, t);
		}
		setRotationFromEuler(e) {
			this.quaternion.setFromEuler(e, !0);
		}
		setRotationFromMatrix(e) {
			this.quaternion.setFromRotationMatrix(e);
		}
		setRotationFromQuaternion(e) {
			this.quaternion.copy(e);
		}
		rotateOnAxis(e, t) {
			return Or.setFromAxisAngle(e, t), this.quaternion.multiply(Or), this;
		}
		rotateOnWorldAxis(e, t) {
			return Or.setFromAxisAngle(e, t), this.quaternion.premultiply(Or), this;
		}
		rotateX(e) {
			return this.rotateOnAxis(Pr, e);
		}
		rotateY(e) {
			return this.rotateOnAxis(Fr, e);
		}
		rotateZ(e) {
			return this.rotateOnAxis(Ir, e);
		}
		translateOnAxis(e, t) {
			return Dr.copy(e).applyQuaternion(this.quaternion), this.position.add(Dr.multiplyScalar(t)), this;
		}
		translateX(e) {
			return this.translateOnAxis(Pr, e);
		}
		translateY(e) {
			return this.translateOnAxis(Fr, e);
		}
		translateZ(e) {
			return this.translateOnAxis(Ir, e);
		}
		localToWorld(e) {
			return this.updateWorldMatrix(!0, !1), e.applyMatrix4(this.matrixWorld);
		}
		worldToLocal(e) {
			return this.updateWorldMatrix(!0, !1), e.applyMatrix4(kr.copy(this.matrixWorld).invert());
		}
		lookAt(e, t, n) {
			e.isVector3 ? Ar.copy(e) : Ar.set(e, t, n);
			let r = this.parent;
			this.updateWorldMatrix(!0, !1), jr.setFromMatrixPosition(this.matrixWorld), this.isCamera || this.isLight ? kr.lookAt(jr, Ar, this.up) : kr.lookAt(Ar, jr, this.up), this.quaternion.setFromRotationMatrix(kr), r && (kr.extractRotation(r.matrixWorld), Or.setFromRotationMatrix(kr), this.quaternion.premultiply(Or.invert()));
		}
		add(e) {
			if (arguments.length > 1) {
				for (let e = 0; e < arguments.length; e++) this.add(arguments[e]);
				return this;
			}
			return e === this ? (d("Object3D.add: object can't be added as a child of itself.", e), this) : (e && e.isObject3D ? (e.removeFromParent(), e.parent = this, this.children.push(e), e.dispatchEvent(Lr), zr.child = e, this.dispatchEvent(zr), zr.child = null) : d("Object3D.add: object not an instance of THREE.Object3D.", e), this);
		}
		remove(e) {
			if (arguments.length > 1) {
				for (let e = 0; e < arguments.length; e++) this.remove(arguments[e]);
				return this;
			}
			let t = this.children.indexOf(e);
			return t !== -1 && (e.parent = null, this.children.splice(t, 1), e.dispatchEvent(Rr), Br.child = e, this.dispatchEvent(Br), Br.child = null), this;
		}
		removeFromParent() {
			let e = this.parent;
			return e !== null && e.remove(this), this;
		}
		clear() {
			return this.remove(...this.children);
		}
		attach(e) {
			return this.updateWorldMatrix(!0, !1), kr.copy(this.matrixWorld).invert(), e.parent !== null && (e.parent.updateWorldMatrix(!0, !1), kr.multiply(e.parent.matrixWorld)), e.applyMatrix4(kr), e.removeFromParent(), e.parent = this, this.children.push(e), e.updateWorldMatrix(!1, !0), e.dispatchEvent(Lr), zr.child = e, this.dispatchEvent(zr), zr.child = null, this;
		}
		getObjectById(e) {
			return this.getObjectByProperty("id", e);
		}
		getObjectByName(e) {
			return this.getObjectByProperty("name", e);
		}
		getObjectByProperty(e, t) {
			if (this[e] === t) return this;
			for (let n = 0, r = this.children.length; n < r; n++) {
				let r = this.children[n].getObjectByProperty(e, t);
				if (r !== void 0) return r;
			}
		}
		getObjectsByProperty(e, t, n = []) {
			this[e] === t && n.push(this);
			let r = this.children;
			for (let i = 0, a = r.length; i < a; i++) r[i].getObjectsByProperty(e, t, n);
			return n;
		}
		getWorldPosition(e) {
			return this.updateWorldMatrix(!0, !1), e.setFromMatrixPosition(this.matrixWorld);
		}
		getWorldQuaternion(e) {
			return this.updateWorldMatrix(!0, !1), this.matrixWorld.decompose(jr, e, Mr), e;
		}
		getWorldScale(e) {
			return this.updateWorldMatrix(!0, !1), this.matrixWorld.decompose(jr, Nr, e), e;
		}
		getWorldDirection(e) {
			this.updateWorldMatrix(!0, !1);
			let t = this.matrixWorld.elements;
			return e.set(t[8], t[9], t[10]).normalize();
		}
		raycast() {}
		traverse(e) {
			e(this);
			let t = this.children;
			for (let n = 0, r = t.length; n < r; n++) t[n].traverse(e);
		}
		traverseVisible(e) {
			if (this.visible === !1) return;
			e(this);
			let t = this.children;
			for (let n = 0, r = t.length; n < r; n++) t[n].traverseVisible(e);
		}
		traverseAncestors(e) {
			let t = this.parent;
			t !== null && (e(t), t.traverseAncestors(e));
		}
		updateMatrix() {
			this.matrix.compose(this.position, this.quaternion, this.scale);
			let e = this.pivot;
			if (e !== null) {
				let t = e.x, n = e.y, r = e.z, i = this.matrix.elements;
				i[12] += t - i[0] * t - i[4] * n - i[8] * r, i[13] += n - i[1] * t - i[5] * n - i[9] * r, i[14] += r - i[2] * t - i[6] * n - i[10] * r;
			}
			this.matrixWorldNeedsUpdate = !0;
		}
		updateMatrixWorld(e) {
			this.matrixAutoUpdate && this.updateMatrix(), (this.matrixWorldNeedsUpdate || e) && (this.matrixWorldAutoUpdate === !0 && (this.parent === null ? this.matrixWorld.copy(this.matrix) : this.matrixWorld.multiplyMatrices(this.parent.matrixWorld, this.matrix)), this.matrixWorldNeedsUpdate = !1, e = !0);
			let t = this.children;
			for (let n = 0, r = t.length; n < r; n++) t[n].updateMatrixWorld(e);
		}
		updateWorldMatrix(e, t, n = !1) {
			let r = this.parent;
			if (e === !0 && r !== null && r.updateWorldMatrix(!0, !1), this.matrixAutoUpdate && this.updateMatrix(), (this.matrixWorldNeedsUpdate || n) && (this.matrixWorldAutoUpdate === !0 && (this.parent === null ? this.matrixWorld.copy(this.matrix) : this.matrixWorld.multiplyMatrices(this.parent.matrixWorld, this.matrix)), this.matrixWorldNeedsUpdate = !1, n = !0), t === !0) {
				let e = this.children;
				for (let t = 0, r = e.length; t < r; t++) e[t].updateWorldMatrix(!1, !0, n);
			}
		}
		toJSON(e) {
			let t = e === void 0 || typeof e == "string", n = {};
			t && (e = {
				geometries: {},
				materials: {},
				textures: {},
				images: {},
				shapes: {},
				skeletons: {},
				animations: {},
				nodes: {}
			}, n.metadata = {
				version: 4.7,
				type: "Object",
				generator: "Object3D.toJSON"
			});
			let r = {};
			r.uuid = this.uuid, r.type = this.type, this.name !== "" && (r.name = this.name), this.castShadow === !0 && (r.castShadow = !0), this.receiveShadow === !0 && (r.receiveShadow = !0), this.visible === !1 && (r.visible = !1), this.frustumCulled === !1 && (r.frustumCulled = !1), this.renderOrder !== 0 && (r.renderOrder = this.renderOrder), this.static !== !1 && (r.static = this.static), Object.keys(this.userData).length > 0 && (r.userData = this.userData), r.layers = this.layers.mask, r.matrix = this.matrix.toArray(), r.up = this.up.toArray(), this.pivot !== null && (r.pivot = this.pivot.toArray()), this.matrixAutoUpdate === !1 && (r.matrixAutoUpdate = !1), this.morphTargetDictionary !== void 0 && (r.morphTargetDictionary = Object.assign({}, this.morphTargetDictionary)), this.morphTargetInfluences !== void 0 && (r.morphTargetInfluences = this.morphTargetInfluences.slice()), this.isInstancedMesh && (r.type = "InstancedMesh", r.count = this.count, r.instanceMatrix = this.instanceMatrix.toJSON(), this.instanceColor !== null && (r.instanceColor = this.instanceColor.toJSON())), this.isBatchedMesh && (r.type = "BatchedMesh", r.perObjectFrustumCulled = this.perObjectFrustumCulled, r.sortObjects = this.sortObjects, r.drawRanges = this._drawRanges, r.reservedRanges = this._reservedRanges, r.geometryInfo = this._geometryInfo.map((e) => ({
				...e,
				boundingBox: e.boundingBox ? e.boundingBox.toJSON() : void 0,
				boundingSphere: e.boundingSphere ? e.boundingSphere.toJSON() : void 0
			})), r.instanceInfo = this._instanceInfo.map((e) => ({ ...e })), r.availableInstanceIds = this._availableInstanceIds.slice(), r.availableGeometryIds = this._availableGeometryIds.slice(), r.nextIndexStart = this._nextIndexStart, r.nextVertexStart = this._nextVertexStart, r.geometryCount = this._geometryCount, r.maxInstanceCount = this._maxInstanceCount, r.maxVertexCount = this._maxVertexCount, r.maxIndexCount = this._maxIndexCount, r.geometryInitialized = this._geometryInitialized, r.matricesTexture = this._matricesTexture.toJSON(e), r.indirectTexture = this._indirectTexture.toJSON(e), this._colorsTexture !== null && (r.colorsTexture = this._colorsTexture.toJSON(e)), this.boundingSphere !== null && (r.boundingSphere = this.boundingSphere.toJSON()), this.boundingBox !== null && (r.boundingBox = this.boundingBox.toJSON()));
			function i(t, n) {
				return t[n.uuid] === void 0 && (t[n.uuid] = n.toJSON(e)), n.uuid;
			}
			if (this.isScene) this.background && (this.background.isColor ? r.background = this.background.toJSON() : this.background.isTexture && (r.background = this.background.toJSON(e).uuid)), this.environment && this.environment.isTexture && this.environment.isRenderTargetTexture !== !0 && (r.environment = this.environment.toJSON(e).uuid);
			else if (this.isMesh || this.isLine || this.isPoints) {
				r.geometry = i(e.geometries, this.geometry);
				let t = this.geometry.parameters;
				if (t !== void 0 && t.shapes !== void 0) {
					let n = t.shapes;
					if (Array.isArray(n)) for (let t = 0, r = n.length; t < r; t++) {
						let r = n[t];
						i(e.shapes, r);
					}
					else i(e.shapes, n);
				}
			}
			if (this.isSkinnedMesh && (r.bindMode = this.bindMode, r.bindMatrix = this.bindMatrix.toArray(), this.skeleton !== void 0 && (i(e.skeletons, this.skeleton), r.skeleton = this.skeleton.uuid)), this.material !== void 0) {
				if (Array.isArray(this.material)) {
					let t = [];
					for (let n = 0, r = this.material.length; n < r; n++) t.push(i(e.materials, this.material[n]));
					r.material = t;
				} else r.material = i(e.materials, this.material);
			}
			if (this.children.length > 0) {
				r.children = [];
				for (let t = 0; t < this.children.length; t++) r.children.push(this.children[t].toJSON(e).object);
			}
			if (this.animations.length > 0) {
				r.animations = [];
				for (let t = 0; t < this.animations.length; t++) {
					let n = this.animations[t];
					r.animations.push(i(e.animations, n));
				}
			}
			if (t) {
				let t = a(e.geometries), r = a(e.materials), i = a(e.textures), o = a(e.images), s = a(e.shapes), c = a(e.skeletons), l = a(e.animations), u = a(e.nodes);
				t.length > 0 && (n.geometries = t), r.length > 0 && (n.materials = r), i.length > 0 && (n.textures = i), o.length > 0 && (n.images = o), s.length > 0 && (n.shapes = s), c.length > 0 && (n.skeletons = c), l.length > 0 && (n.animations = l), u.length > 0 && (n.nodes = u);
			}
			return n.object = r, n;
			function a(e) {
				let t = [];
				for (let n in e) {
					let r = e[n];
					delete r.metadata, t.push(r);
				}
				return t;
			}
		}
		clone(e) {
			return new this.constructor().copy(this, e);
		}
		copy(e, t = !0) {
			if (this.name = e.name, this.up.copy(e.up), this.position.copy(e.position), this.rotation.order = e.rotation.order, this.quaternion.copy(e.quaternion), this.scale.copy(e.scale), this.pivot = e.pivot === null ? null : e.pivot.clone(), this.matrix.copy(e.matrix), this.matrixWorld.copy(e.matrixWorld), this.matrixAutoUpdate = e.matrixAutoUpdate, this.matrixWorldAutoUpdate = e.matrixWorldAutoUpdate, this.matrixWorldNeedsUpdate = e.matrixWorldNeedsUpdate, this.layers.mask = e.layers.mask, this.visible = e.visible, this.castShadow = e.castShadow, this.receiveShadow = e.receiveShadow, this.frustumCulled = e.frustumCulled, this.renderOrder = e.renderOrder, this.static = e.static, this.animations = e.animations.slice(), this.userData = JSON.parse(JSON.stringify(e.userData)), t === !0) for (let t = 0; t < e.children.length; t++) {
				let n = e.children[t];
				this.add(n.clone());
			}
			return this;
		}
	}, Vr.DEFAULT_UP = /*@__PURE__*/ new W(0, 1, 0), Vr.DEFAULT_MATRIX_AUTO_UPDATE = !0, Vr.DEFAULT_MATRIX_WORLD_AUTO_UPDATE = !0, Hr = class extends Vr {
		constructor() {
			super(), this.isGroup = !0, this.type = "Group";
		}
	}, Ur = { type: "move" }, Wr = class {
		constructor() {
			this._targetRay = null, this._grip = null, this._hand = null;
		}
		getHandSpace() {
			return this._hand === null && (this._hand = new Hr(), this._hand.matrixAutoUpdate = !1, this._hand.visible = !1, this._hand.joints = {}, this._hand.inputState = { pinching: !1 }), this._hand;
		}
		getTargetRaySpace() {
			return this._targetRay === null && (this._targetRay = new Hr(), this._targetRay.matrixAutoUpdate = !1, this._targetRay.visible = !1, this._targetRay.hasLinearVelocity = !1, this._targetRay.linearVelocity = new W(), this._targetRay.hasAngularVelocity = !1, this._targetRay.angularVelocity = new W()), this._targetRay;
		}
		getGripSpace() {
			return this._grip === null && (this._grip = new Hr(), this._grip.matrixAutoUpdate = !1, this._grip.visible = !1, this._grip.hasLinearVelocity = !1, this._grip.linearVelocity = new W(), this._grip.hasAngularVelocity = !1, this._grip.angularVelocity = new W(), this._grip.eventsEnabled = !1), this._grip;
		}
		dispatchEvent(e) {
			return this._targetRay !== null && this._targetRay.dispatchEvent(e), this._grip !== null && this._grip.dispatchEvent(e), this._hand !== null && this._hand.dispatchEvent(e), this;
		}
		connect(e) {
			if (e && e.hand) {
				let t = this._hand;
				if (t) for (let n of e.hand.values()) this._getHandJoint(t, n);
			}
			return this.dispatchEvent({
				type: "connected",
				data: e
			}), this;
		}
		disconnect(e) {
			return this.dispatchEvent({
				type: "disconnected",
				data: e
			}), this._targetRay !== null && (this._targetRay.visible = !1), this._grip !== null && (this._grip.visible = !1), this._hand !== null && (this._hand.visible = !1), this;
		}
		update(e, t, n) {
			let r = null, i = null, a = null, o = this._targetRay, s = this._grip, c = this._hand;
			if (e && t.session.visibilityState !== "visible-blurred") {
				if (c && e.hand) {
					a = !0;
					for (let r of e.hand.values()) {
						let e = t.getJointPose(r, n), i = this._getHandJoint(c, r);
						e !== null && (i.matrix.fromArray(e.transform.matrix), i.matrix.decompose(i.position, i.rotation, i.scale), i.matrixWorldNeedsUpdate = !0, i.jointRadius = e.radius), i.visible = e !== null;
					}
					let r = c.joints["index-finger-tip"], i = c.joints["thumb-tip"], o = r.position.distanceTo(i.position);
					c.inputState.pinching && o > .025 ? (c.inputState.pinching = !1, this.dispatchEvent({
						type: "pinchend",
						handedness: e.handedness,
						target: this
					})) : !c.inputState.pinching && o <= .015 && (c.inputState.pinching = !0, this.dispatchEvent({
						type: "pinchstart",
						handedness: e.handedness,
						target: this
					}));
				} else s !== null && e.gripSpace && (i = t.getPose(e.gripSpace, n), i !== null && (s.matrix.fromArray(i.transform.matrix), s.matrix.decompose(s.position, s.rotation, s.scale), s.matrixWorldNeedsUpdate = !0, i.linearVelocity ? (s.hasLinearVelocity = !0, s.linearVelocity.copy(i.linearVelocity)) : s.hasLinearVelocity = !1, i.angularVelocity ? (s.hasAngularVelocity = !0, s.angularVelocity.copy(i.angularVelocity)) : s.hasAngularVelocity = !1, s.eventsEnabled && s.dispatchEvent({
					type: "gripUpdated",
					data: e,
					target: this
				})));
				o !== null && (r = t.getPose(e.targetRaySpace, n), r === null && i !== null && (r = i), r !== null && (o.matrix.fromArray(r.transform.matrix), o.matrix.decompose(o.position, o.rotation, o.scale), o.matrixWorldNeedsUpdate = !0, r.linearVelocity ? (o.hasLinearVelocity = !0, o.linearVelocity.copy(r.linearVelocity)) : o.hasLinearVelocity = !1, r.angularVelocity ? (o.hasAngularVelocity = !0, o.angularVelocity.copy(r.angularVelocity)) : o.hasAngularVelocity = !1, this.dispatchEvent(Ur)));
			}
			return o !== null && (o.visible = r !== null), s !== null && (s.visible = i !== null), c !== null && (c.visible = a !== null), this;
		}
		_getHandJoint(e, t) {
			if (e.joints[t.jointName] === void 0) {
				let n = new Hr();
				n.matrixAutoUpdate = !1, n.visible = !1, e.joints[t.jointName] = n, e.add(n);
			}
			return e.joints[t.jointName];
		}
	}, Gr = {
		aliceblue: 15792383,
		antiquewhite: 16444375,
		aqua: 65535,
		aquamarine: 8388564,
		azure: 15794175,
		beige: 16119260,
		bisque: 16770244,
		black: 0,
		blanchedalmond: 16772045,
		blue: 255,
		blueviolet: 9055202,
		brown: 10824234,
		burlywood: 14596231,
		cadetblue: 6266528,
		chartreuse: 8388352,
		chocolate: 13789470,
		coral: 16744272,
		cornflowerblue: 6591981,
		cornsilk: 16775388,
		crimson: 14423100,
		cyan: 65535,
		darkblue: 139,
		darkcyan: 35723,
		darkgoldenrod: 12092939,
		darkgray: 11119017,
		darkgreen: 25600,
		darkgrey: 11119017,
		darkkhaki: 12433259,
		darkmagenta: 9109643,
		darkolivegreen: 5597999,
		darkorange: 16747520,
		darkorchid: 10040012,
		darkred: 9109504,
		darksalmon: 15308410,
		darkseagreen: 9419919,
		darkslateblue: 4734347,
		darkslategray: 3100495,
		darkslategrey: 3100495,
		darkturquoise: 52945,
		darkviolet: 9699539,
		deeppink: 16716947,
		deepskyblue: 49151,
		dimgray: 6908265,
		dimgrey: 6908265,
		dodgerblue: 2003199,
		firebrick: 11674146,
		floralwhite: 16775920,
		forestgreen: 2263842,
		fuchsia: 16711935,
		gainsboro: 14474460,
		ghostwhite: 16316671,
		gold: 16766720,
		goldenrod: 14329120,
		gray: 8421504,
		green: 32768,
		greenyellow: 11403055,
		grey: 8421504,
		honeydew: 15794160,
		hotpink: 16738740,
		indianred: 13458524,
		indigo: 4915330,
		ivory: 16777200,
		khaki: 15787660,
		lavender: 15132410,
		lavenderblush: 16773365,
		lawngreen: 8190976,
		lemonchiffon: 16775885,
		lightblue: 11393254,
		lightcoral: 15761536,
		lightcyan: 14745599,
		lightgoldenrodyellow: 16448210,
		lightgray: 13882323,
		lightgreen: 9498256,
		lightgrey: 13882323,
		lightpink: 16758465,
		lightsalmon: 16752762,
		lightseagreen: 2142890,
		lightskyblue: 8900346,
		lightslategray: 7833753,
		lightslategrey: 7833753,
		lightsteelblue: 11584734,
		lightyellow: 16777184,
		lime: 65280,
		limegreen: 3329330,
		linen: 16445670,
		magenta: 16711935,
		maroon: 8388608,
		mediumaquamarine: 6737322,
		mediumblue: 205,
		mediumorchid: 12211667,
		mediumpurple: 9662683,
		mediumseagreen: 3978097,
		mediumslateblue: 8087790,
		mediumspringgreen: 64154,
		mediumturquoise: 4772300,
		mediumvioletred: 13047173,
		midnightblue: 1644912,
		mintcream: 16121850,
		mistyrose: 16770273,
		moccasin: 16770229,
		navajowhite: 16768685,
		navy: 128,
		oldlace: 16643558,
		olive: 8421376,
		olivedrab: 7048739,
		orange: 16753920,
		orangered: 16729344,
		orchid: 14315734,
		palegoldenrod: 15657130,
		palegreen: 10025880,
		paleturquoise: 11529966,
		palevioletred: 14381203,
		papayawhip: 16773077,
		peachpuff: 16767673,
		peru: 13468991,
		pink: 16761035,
		plum: 14524637,
		powderblue: 11591910,
		purple: 8388736,
		rebeccapurple: 6697881,
		red: 16711680,
		rosybrown: 12357519,
		royalblue: 4286945,
		saddlebrown: 9127187,
		salmon: 16416882,
		sandybrown: 16032864,
		seagreen: 3050327,
		seashell: 16774638,
		sienna: 10506797,
		silver: 12632256,
		skyblue: 8900331,
		slateblue: 6970061,
		slategray: 7372944,
		slategrey: 7372944,
		snow: 16775930,
		springgreen: 65407,
		steelblue: 4620980,
		tan: 13808780,
		teal: 32896,
		thistle: 14204888,
		tomato: 16737095,
		turquoise: 4251856,
		violet: 15631086,
		wheat: 16113331,
		white: 16777215,
		whitesmoke: 16119285,
		yellow: 16776960,
		yellowgreen: 10145074
	}, Kr = {
		h: 0,
		s: 0,
		l: 0
	}, qr = {
		h: 0,
		s: 0,
		l: 0
	}, J = class {
		constructor(e, t, n) {
			return this.isColor = !0, this.r = 1, this.g = 1, this.b = 1, this.set(e, t, n);
		}
		set(e, t, n) {
			if (t === void 0 && n === void 0) {
				let t = e;
				t && t.isColor ? this.copy(t) : typeof t == "number" ? this.setHex(t) : typeof t == "string" && this.setStyle(t);
			} else this.setRGB(e, t, n);
			return this;
		}
		setScalar(e) {
			return this.r = e, this.g = e, this.b = e, this;
		}
		setHex(e, t = H) {
			return e = Math.floor(e), this.r = (e >> 16 & 255) / 255, this.g = (e >> 8 & 255) / 255, this.b = (e & 255) / 255, K.colorSpaceToWorking(this, t), this;
		}
		setRGB(e, t, n, r = K.workingColorSpace) {
			return this.r = e, this.g = t, this.b = n, K.colorSpaceToWorking(this, r), this;
		}
		setHSL(e, t, n, r = K.workingColorSpace) {
			if (e = g(e, 1), t = h(t, 0, 1), n = h(n, 0, 1), t === 0) this.r = this.g = this.b = n;
			else {
				let r = n <= .5 ? n * (1 + t) : n + t - n * t, i = 2 * n - r;
				this.r = ie(i, r, e + 1 / 3), this.g = ie(i, r, e), this.b = ie(i, r, e - 1 / 3);
			}
			return K.colorSpaceToWorking(this, r), this;
		}
		setStyle(e, t = H) {
			function n(t) {
				t !== void 0 && parseFloat(t) < 1 && u("Color: Alpha component of " + e + " will be ignored.");
			}
			let r;
			if (r = /^(\w+)\(([^\)]*)\)/.exec(e)) {
				let i, a = r[1], o = r[2];
				switch (a) {
					case "rgb":
					case "rgba":
						if (i = /^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o)) return n(i[4]), this.setRGB(Math.min(255, parseInt(i[1], 10)) / 255, Math.min(255, parseInt(i[2], 10)) / 255, Math.min(255, parseInt(i[3], 10)) / 255, t);
						if (i = /^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o)) return n(i[4]), this.setRGB(Math.min(100, parseInt(i[1], 10)) / 100, Math.min(100, parseInt(i[2], 10)) / 100, Math.min(100, parseInt(i[3], 10)) / 100, t);
						break;
					case "hsl":
					case "hsla":
						if (i = /^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o)) return n(i[4]), this.setHSL(parseFloat(i[1]) / 360, parseFloat(i[2]) / 100, parseFloat(i[3]) / 100, t);
						break;
					default: u("Color: Unknown color model " + e);
				}
			} else if (r = /^\#([A-Fa-f\d]+)$/.exec(e)) {
				let n = r[1], i = n.length;
				if (i === 3) return this.setRGB(parseInt(n.charAt(0), 16) / 15, parseInt(n.charAt(1), 16) / 15, parseInt(n.charAt(2), 16) / 15, t);
				if (i === 6) return this.setHex(parseInt(n, 16), t);
				u("Color: Invalid hex color " + e);
			} else if (e && e.length > 0) return this.setColorName(e, t);
			return this;
		}
		setColorName(e, t = H) {
			let n = Gr[e.toLowerCase()];
			return n === void 0 ? u("Color: Unknown color " + e) : this.setHex(n, t), this;
		}
		clone() {
			return new this.constructor(this.r, this.g, this.b);
		}
		copy(e) {
			return this.r = e.r, this.g = e.g, this.b = e.b, this;
		}
		copySRGBToLinear(e) {
			return this.r = P(e.r), this.g = P(e.g), this.b = P(e.b), this;
		}
		copyLinearToSRGB(e) {
			return this.r = F(e.r), this.g = F(e.g), this.b = F(e.b), this;
		}
		convertSRGBToLinear() {
			return this.copySRGBToLinear(this), this;
		}
		convertLinearToSRGB() {
			return this.copyLinearToSRGB(this), this;
		}
		getHex(e = H) {
			return K.workingToColorSpace(Jr.copy(this), e), Math.round(h(Jr.r * 255, 0, 255)) * 65536 + Math.round(h(Jr.g * 255, 0, 255)) * 256 + Math.round(h(Jr.b * 255, 0, 255));
		}
		getHexString(e = H) {
			return ("000000" + this.getHex(e).toString(16)).slice(-6);
		}
		getHSL(e, t = K.workingColorSpace) {
			K.workingToColorSpace(Jr.copy(this), t);
			let n = Jr.r, r = Jr.g, i = Jr.b, a = Math.max(n, r, i), o = Math.min(n, r, i), s, c, l = (o + a) / 2;
			if (o === a) s = 0, c = 0;
			else {
				let e = a - o;
				switch (c = l <= .5 ? e / (a + o) : e / (2 - a - o), a) {
					case n:
						s = (r - i) / e + (r < i ? 6 : 0);
						break;
					case r:
						s = (i - n) / e + 2;
						break;
					case i: s = (n - r) / e + 4;
				}
				s /= 6;
			}
			return e.h = s, e.s = c, e.l = l, e;
		}
		getRGB(e, t = K.workingColorSpace) {
			return K.workingToColorSpace(Jr.copy(this), t), e.r = Jr.r, e.g = Jr.g, e.b = Jr.b, e;
		}
		getStyle(e = H) {
			K.workingToColorSpace(Jr.copy(this), e);
			let t = Jr.r, n = Jr.g, r = Jr.b;
			return e === "srgb" ? `rgb(${Math.round(t * 255)},${Math.round(n * 255)},${Math.round(r * 255)})` : `color(${e} ${t.toFixed(3)} ${n.toFixed(3)} ${r.toFixed(3)})`;
		}
		offsetHSL(e, t, n) {
			return this.getHSL(Kr), this.setHSL(Kr.h + e, Kr.s + t, Kr.l + n);
		}
		add(e) {
			return this.r += e.r, this.g += e.g, this.b += e.b, this;
		}
		addColors(e, t) {
			return this.r = e.r + t.r, this.g = e.g + t.g, this.b = e.b + t.b, this;
		}
		addScalar(e) {
			return this.r += e, this.g += e, this.b += e, this;
		}
		sub(e) {
			return this.r = Math.max(0, this.r - e.r), this.g = Math.max(0, this.g - e.g), this.b = Math.max(0, this.b - e.b), this;
		}
		multiply(e) {
			return this.r *= e.r, this.g *= e.g, this.b *= e.b, this;
		}
		multiplyScalar(e) {
			return this.r *= e, this.g *= e, this.b *= e, this;
		}
		lerp(e, t) {
			return this.r += (e.r - this.r) * t, this.g += (e.g - this.g) * t, this.b += (e.b - this.b) * t, this;
		}
		lerpColors(e, t, n) {
			return this.r = e.r + (t.r - e.r) * n, this.g = e.g + (t.g - e.g) * n, this.b = e.b + (t.b - e.b) * n, this;
		}
		lerpHSL(e, t) {
			this.getHSL(Kr), e.getHSL(qr);
			let n = y(Kr.h, qr.h, t), r = y(Kr.s, qr.s, t), i = y(Kr.l, qr.l, t);
			return this.setHSL(n, r, i), this;
		}
		setFromVector3(e) {
			return this.r = e.x, this.g = e.y, this.b = e.z, this;
		}
		applyMatrix3(e) {
			let t = this.r, n = this.g, r = this.b, i = e.elements;
			return this.r = i[0] * t + i[3] * n + i[6] * r, this.g = i[1] * t + i[4] * n + i[7] * r, this.b = i[2] * t + i[5] * n + i[8] * r, this;
		}
		equals(e) {
			return e.r === this.r && e.g === this.g && e.b === this.b;
		}
		fromArray(e, t = 0) {
			return this.r = e[t], this.g = e[t + 1], this.b = e[t + 2], this;
		}
		toArray(e = [], t = 0) {
			return e[t] = this.r, e[t + 1] = this.g, e[t + 2] = this.b, e;
		}
		fromBufferAttribute(e, t) {
			return this.r = e.getX(t), this.g = e.getY(t), this.b = e.getZ(t), this;
		}
		toJSON() {
			return this.getHex();
		}
		*[Symbol.iterator]() {
			yield this.r, yield this.g, yield this.b;
		}
	}, Jr = /*@__PURE__*/ new J(), J.NAMES = Gr, Yr = class extends Vr {
		constructor() {
			super(), this.isScene = !0, this.type = "Scene", this.background = null, this.environment = null, this.fog = null, this.backgroundBlurriness = 0, this.backgroundIntensity = 1, this.backgroundRotation = new wr(), this.environmentIntensity = 1, this.environmentRotation = new wr(), this.overrideMaterial = null, typeof __THREE_DEVTOOLS__ < "u" && __THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe", { detail: this }));
		}
		copy(e, t) {
			return super.copy(e, t), e.background !== null && (this.background = e.background.clone()), e.environment !== null && (this.environment = e.environment.clone()), e.fog !== null && (this.fog = e.fog.clone()), this.backgroundBlurriness = e.backgroundBlurriness, this.backgroundIntensity = e.backgroundIntensity, this.backgroundRotation.copy(e.backgroundRotation), this.environmentIntensity = e.environmentIntensity, this.environmentRotation.copy(e.environmentRotation), e.overrideMaterial !== null && (this.overrideMaterial = e.overrideMaterial.clone()), this.matrixAutoUpdate = e.matrixAutoUpdate, this;
		}
		toJSON(e) {
			let t = super.toJSON(e);
			return this.fog !== null && (t.object.fog = this.fog.toJSON()), this.backgroundBlurriness > 0 && (t.object.backgroundBlurriness = this.backgroundBlurriness), this.backgroundIntensity !== 1 && (t.object.backgroundIntensity = this.backgroundIntensity), t.object.backgroundRotation = this.backgroundRotation.toArray(), this.environmentIntensity !== 1 && (t.object.environmentIntensity = this.environmentIntensity), t.object.environmentRotation = this.environmentRotation.toArray(), t;
		}
	}, Xr = /*@__PURE__*/ new W(), Zr = /*@__PURE__*/ new W(), Qr = /*@__PURE__*/ new W(), $r = /*@__PURE__*/ new W(), ei = /*@__PURE__*/ new W(), ti = /*@__PURE__*/ new W(), ni = /*@__PURE__*/ new W(), ri = /*@__PURE__*/ new W(), ii = /*@__PURE__*/ new W(), ai = /*@__PURE__*/ new W(), oi = /*@__PURE__*/ new ur(), si = /*@__PURE__*/ new ur(), ci = /*@__PURE__*/ new ur(), li = class e {
		constructor(e = new W(), t = new W(), n = new W()) {
			this.a = e, this.b = t, this.c = n;
		}
		static getNormal(e, t, n, r) {
			r.subVectors(n, t), Xr.subVectors(e, t), r.cross(Xr);
			let i = r.lengthSq();
			return i > 0 ? r.multiplyScalar(1 / Math.sqrt(i)) : r.set(0, 0, 0);
		}
		static getBarycoord(e, t, n, r, i) {
			Xr.subVectors(r, t), Zr.subVectors(n, t), Qr.subVectors(e, t);
			let a = Xr.dot(Xr), o = Xr.dot(Zr), s = Xr.dot(Qr), c = Zr.dot(Zr), l = Zr.dot(Qr), u = a * c - o * o;
			if (u === 0) return i.set(0, 0, 0), null;
			let d = 1 / u, f = (c * s - o * l) * d, p = (a * l - o * s) * d;
			return i.set(1 - f - p, p, f);
		}
		static containsPoint(e, t, n, r) {
			return this.getBarycoord(e, t, n, r, $r) !== null && $r.x >= 0 && $r.y >= 0 && $r.x + $r.y <= 1;
		}
		static getInterpolation(e, t, n, r, i, a, o, s) {
			return this.getBarycoord(e, t, n, r, $r) === null ? (s.x = 0, s.y = 0, "z" in s && (s.z = 0), "w" in s && (s.w = 0), null) : (s.setScalar(0), s.addScaledVector(i, $r.x), s.addScaledVector(a, $r.y), s.addScaledVector(o, $r.z), s);
		}
		static getInterpolatedAttribute(e, t, n, r, i, a) {
			return oi.setScalar(0), si.setScalar(0), ci.setScalar(0), oi.fromBufferAttribute(e, t), si.fromBufferAttribute(e, n), ci.fromBufferAttribute(e, r), a.setScalar(0), a.addScaledVector(oi, i.x), a.addScaledVector(si, i.y), a.addScaledVector(ci, i.z), a;
		}
		static isFrontFacing(e, t, n, r) {
			return Xr.subVectors(n, t), Zr.subVectors(e, t), Xr.cross(Zr).dot(r) < 0;
		}
		set(e, t, n) {
			return this.a.copy(e), this.b.copy(t), this.c.copy(n), this;
		}
		setFromPointsAndIndices(e, t, n, r) {
			return this.a.copy(e[t]), this.b.copy(e[n]), this.c.copy(e[r]), this;
		}
		setFromAttributeAndIndices(e, t, n, r) {
			return this.a.fromBufferAttribute(e, t), this.b.fromBufferAttribute(e, n), this.c.fromBufferAttribute(e, r), this;
		}
		clone() {
			return new this.constructor().copy(this);
		}
		copy(e) {
			return this.a.copy(e.a), this.b.copy(e.b), this.c.copy(e.c), this;
		}
		getArea() {
			return Xr.subVectors(this.c, this.b), Zr.subVectors(this.a, this.b), Xr.cross(Zr).length() * .5;
		}
		getMidpoint(e) {
			return e.addVectors(this.a, this.b).add(this.c).multiplyScalar(1 / 3);
		}
		getNormal(t) {
			return e.getNormal(this.a, this.b, this.c, t);
		}
		getPlane(e) {
			return e.setFromCoplanarPoints(this.a, this.b, this.c);
		}
		getBarycoord(t, n) {
			return e.getBarycoord(t, this.a, this.b, this.c, n);
		}
		getInterpolation(t, n, r, i, a) {
			return e.getInterpolation(t, this.a, this.b, this.c, n, r, i, a);
		}
		containsPoint(t) {
			return e.containsPoint(t, this.a, this.b, this.c);
		}
		isFrontFacing(t) {
			return e.isFrontFacing(this.a, this.b, this.c, t);
		}
		intersectsBox(e) {
			return e.intersectsTriangle(this);
		}
		closestPointToPoint(e, t) {
			let n = this.a, r = this.b, i = this.c, a, o;
			ei.subVectors(r, n), ti.subVectors(i, n), ri.subVectors(e, n);
			let s = ei.dot(ri), c = ti.dot(ri);
			if (s <= 0 && c <= 0) return t.copy(n);
			ii.subVectors(e, r);
			let l = ei.dot(ii), u = ti.dot(ii);
			if (l >= 0 && u <= l) return t.copy(r);
			let d = s * u - l * c;
			if (d <= 0 && s >= 0 && l <= 0) return a = s / (s - l), t.copy(n).addScaledVector(ei, a);
			ai.subVectors(e, i);
			let f = ei.dot(ai), p = ti.dot(ai);
			if (p >= 0 && f <= p) return t.copy(i);
			let m = f * c - s * p;
			if (m <= 0 && c >= 0 && p <= 0) return o = c / (c - p), t.copy(n).addScaledVector(ti, o);
			let h = l * p - f * u;
			if (h <= 0 && u - l >= 0 && f - p >= 0) return ni.subVectors(i, r), o = (u - l) / (u - l + (f - p)), t.copy(r).addScaledVector(ni, o);
			let g = 1 / (h + m + d);
			return a = m * g, o = d * g, t.copy(n).addScaledVector(ei, a).addScaledVector(ti, o);
		}
		equals(e) {
			return e.a.equals(this.a) && e.b.equals(this.b) && e.c.equals(this.c);
		}
	}, ui = class {
		constructor(e = new W(Infinity, Infinity, Infinity), t = new W(-Infinity, -Infinity, -Infinity)) {
			this.isBox3 = !0, this.min = e, this.max = t;
		}
		set(e, t) {
			return this.min.copy(e), this.max.copy(t), this;
		}
		setFromArray(e) {
			this.makeEmpty();
			for (let t = 0, n = e.length; t < n; t += 3) this.expandByPoint(fi.fromArray(e, t));
			return this;
		}
		setFromBufferAttribute(e) {
			this.makeEmpty();
			for (let t = 0, n = e.count; t < n; t++) this.expandByPoint(fi.fromBufferAttribute(e, t));
			return this;
		}
		setFromPoints(e) {
			this.makeEmpty();
			for (let t = 0, n = e.length; t < n; t++) this.expandByPoint(e[t]);
			return this;
		}
		setFromCenterAndSize(e, t) {
			let n = fi.copy(t).multiplyScalar(.5);
			return this.min.copy(e).sub(n), this.max.copy(e).add(n), this;
		}
		setFromObject(e, t = !1) {
			return this.makeEmpty(), this.expandByObject(e, t);
		}
		clone() {
			return new this.constructor().copy(this);
		}
		copy(e) {
			return this.min.copy(e.min), this.max.copy(e.max), this;
		}
		makeEmpty() {
			return this.min.x = this.min.y = this.min.z = Infinity, this.max.x = this.max.y = this.max.z = -Infinity, this;
		}
		isEmpty() {
			return this.max.x < this.min.x || this.max.y < this.min.y || this.max.z < this.min.z;
		}
		getCenter(e) {
			return this.isEmpty() ? e.set(0, 0, 0) : e.addVectors(this.min, this.max).multiplyScalar(.5);
		}
		getSize(e) {
			return this.isEmpty() ? e.set(0, 0, 0) : e.subVectors(this.max, this.min);
		}
		expandByPoint(e) {
			return this.min.min(e), this.max.max(e), this;
		}
		expandByVector(e) {
			return this.min.sub(e), this.max.add(e), this;
		}
		expandByScalar(e) {
			return this.min.addScalar(-e), this.max.addScalar(e), this;
		}
		expandByObject(e, t = !1) {
			e.updateWorldMatrix(!1, !1);
			let n = e.geometry;
			if (n !== void 0) {
				let r = n.getAttribute("position");
				if (t === !0 && r !== void 0 && e.isInstancedMesh !== !0) for (let t = 0, n = r.count; t < n; t++) e.isMesh === !0 ? e.getVertexPosition(t, fi) : fi.fromBufferAttribute(r, t), fi.applyMatrix4(e.matrixWorld), this.expandByPoint(fi);
				else e.boundingBox === void 0 ? (n.boundingBox === null && n.computeBoundingBox(), pi.copy(n.boundingBox)) : (e.boundingBox === null && e.computeBoundingBox(), pi.copy(e.boundingBox)), pi.applyMatrix4(e.matrixWorld), this.union(pi);
			}
			let r = e.children;
			for (let e = 0, n = r.length; e < n; e++) this.expandByObject(r[e], t);
			return this;
		}
		containsPoint(e) {
			return e.x >= this.min.x && e.x <= this.max.x && e.y >= this.min.y && e.y <= this.max.y && e.z >= this.min.z && e.z <= this.max.z;
		}
		containsBox(e) {
			return this.min.x <= e.min.x && e.max.x <= this.max.x && this.min.y <= e.min.y && e.max.y <= this.max.y && this.min.z <= e.min.z && e.max.z <= this.max.z;
		}
		getParameter(e, t) {
			return t.set((e.x - this.min.x) / (this.max.x - this.min.x), (e.y - this.min.y) / (this.max.y - this.min.y), (e.z - this.min.z) / (this.max.z - this.min.z));
		}
		intersectsBox(e) {
			return e.max.x >= this.min.x && e.min.x <= this.max.x && e.max.y >= this.min.y && e.min.y <= this.max.y && e.max.z >= this.min.z && e.min.z <= this.max.z;
		}
		intersectsSphere(e) {
			return this.clampPoint(e.center, fi), fi.distanceToSquared(e.center) <= e.radius * e.radius;
		}
		intersectsPlane(e) {
			let t, n;
			return e.normal.x > 0 ? (t = e.normal.x * this.min.x, n = e.normal.x * this.max.x) : (t = e.normal.x * this.max.x, n = e.normal.x * this.min.x), e.normal.y > 0 ? (t += e.normal.y * this.min.y, n += e.normal.y * this.max.y) : (t += e.normal.y * this.max.y, n += e.normal.y * this.min.y), e.normal.z > 0 ? (t += e.normal.z * this.min.z, n += e.normal.z * this.max.z) : (t += e.normal.z * this.max.z, n += e.normal.z * this.min.z), t <= -e.constant && n >= -e.constant;
		}
		intersectsTriangle(e) {
			if (this.isEmpty()) return !1;
			this.getCenter(bi), xi.subVectors(this.max, bi), mi.subVectors(e.a, bi), hi.subVectors(e.b, bi), gi.subVectors(e.c, bi), _i.subVectors(hi, mi), vi.subVectors(gi, hi), yi.subVectors(mi, gi);
			let t = [
				0,
				-_i.z,
				_i.y,
				0,
				-vi.z,
				vi.y,
				0,
				-yi.z,
				yi.y,
				_i.z,
				0,
				-_i.x,
				vi.z,
				0,
				-vi.x,
				yi.z,
				0,
				-yi.x,
				-_i.y,
				_i.x,
				0,
				-vi.y,
				vi.x,
				0,
				-yi.y,
				yi.x,
				0
			];
			return !I(t, mi, hi, gi, xi) || (t = [
				1,
				0,
				0,
				0,
				1,
				0,
				0,
				0,
				1
			], !I(t, mi, hi, gi, xi)) ? !1 : (Si.crossVectors(_i, vi), t = [
				Si.x,
				Si.y,
				Si.z
			], I(t, mi, hi, gi, xi));
		}
		clampPoint(e, t) {
			return t.copy(e).clamp(this.min, this.max);
		}
		distanceToPoint(e) {
			return this.clampPoint(e, fi).distanceTo(e);
		}
		getBoundingSphere(e) {
			return this.isEmpty() ? e.makeEmpty() : (this.getCenter(e.center), e.radius = this.getSize(fi).length() * .5), e;
		}
		intersect(e) {
			return this.min.max(e.min), this.max.min(e.max), this.isEmpty() && this.makeEmpty(), this;
		}
		union(e) {
			return this.min.min(e.min), this.max.max(e.max), this;
		}
		applyMatrix4(e) {
			return this.isEmpty() ? this : (di[0].set(this.min.x, this.min.y, this.min.z).applyMatrix4(e), di[1].set(this.min.x, this.min.y, this.max.z).applyMatrix4(e), di[2].set(this.min.x, this.max.y, this.min.z).applyMatrix4(e), di[3].set(this.min.x, this.max.y, this.max.z).applyMatrix4(e), di[4].set(this.max.x, this.min.y, this.min.z).applyMatrix4(e), di[5].set(this.max.x, this.min.y, this.max.z).applyMatrix4(e), di[6].set(this.max.x, this.max.y, this.min.z).applyMatrix4(e), di[7].set(this.max.x, this.max.y, this.max.z).applyMatrix4(e), this.setFromPoints(di), this);
		}
		translate(e) {
			return this.min.add(e), this.max.add(e), this;
		}
		equals(e) {
			return e.min.equals(this.min) && e.max.equals(this.max);
		}
		toJSON() {
			return {
				min: this.min.toArray(),
				max: this.max.toArray()
			};
		}
		fromJSON(e) {
			return this.min.fromArray(e.min), this.max.fromArray(e.max), this;
		}
	}, di = [
		/*@__PURE__*/ new W(),
		/*@__PURE__*/ new W(),
		/*@__PURE__*/ new W(),
		/*@__PURE__*/ new W(),
		/*@__PURE__*/ new W(),
		/*@__PURE__*/ new W(),
		/*@__PURE__*/ new W(),
		/*@__PURE__*/ new W()
	], fi = /*@__PURE__*/ new W(), pi = /*@__PURE__*/ new ui(), mi = /*@__PURE__*/ new W(), hi = /*@__PURE__*/ new W(), gi = /*@__PURE__*/ new W(), _i = /*@__PURE__*/ new W(), vi = /*@__PURE__*/ new W(), yi = /*@__PURE__*/ new W(), bi = /*@__PURE__*/ new W(), xi = /*@__PURE__*/ new W(), Si = /*@__PURE__*/ new W(), Ci = /*@__PURE__*/ new W(), wi = /*@__PURE__*/ new W(), Ti = /*@__PURE__*/ new U(), Ei = 0, Di = class extends Gn {
		constructor(e, t, n = !1) {
			if (super(), Array.isArray(e)) throw TypeError("THREE.BufferAttribute: array should be a Typed Array.");
			this.isBufferAttribute = !0, Object.defineProperty(this, "id", { value: Ei++ }), this.name = "", this.array = e, this.itemSize = t, this.count = e === void 0 ? 0 : e.length / t, this.normalized = n, this.usage = Bn, this.updateRanges = [], this.gpuType = wt, this.version = 0;
		}
		onUploadCallback() {}
		set needsUpdate(e) {
			e === !0 && this.version++;
		}
		setUsage(e) {
			return this.usage = e, this;
		}
		addUpdateRange(e, t) {
			this.updateRanges.push({
				start: e,
				count: t
			});
		}
		clearUpdateRanges() {
			this.updateRanges.length = 0;
		}
		copy(e) {
			return this.name = e.name, this.array = new e.array.constructor(e.array), this.itemSize = e.itemSize, this.count = e.count, this.normalized = e.normalized, this.usage = e.usage, this.gpuType = e.gpuType, this;
		}
		copyAt(e, t, n) {
			e *= this.itemSize, n *= t.itemSize;
			for (let r = 0, i = this.itemSize; r < i; r++) this.array[e + r] = t.array[n + r];
			return this;
		}
		copyArray(e) {
			return this.array.set(e), this;
		}
		applyMatrix3(e) {
			if (this.itemSize === 2) for (let t = 0, n = this.count; t < n; t++) Ti.fromBufferAttribute(this, t), Ti.applyMatrix3(e), this.setXY(t, Ti.x, Ti.y);
			else if (this.itemSize === 3) for (let t = 0, n = this.count; t < n; t++) wi.fromBufferAttribute(this, t), wi.applyMatrix3(e), this.setXYZ(t, wi.x, wi.y, wi.z);
			return this;
		}
		applyMatrix4(e) {
			for (let t = 0, n = this.count; t < n; t++) wi.fromBufferAttribute(this, t), wi.applyMatrix4(e), this.setXYZ(t, wi.x, wi.y, wi.z);
			return this;
		}
		applyNormalMatrix(e) {
			for (let t = 0, n = this.count; t < n; t++) wi.fromBufferAttribute(this, t), wi.applyNormalMatrix(e), this.setXYZ(t, wi.x, wi.y, wi.z);
			return this;
		}
		transformDirection(e) {
			for (let t = 0, n = this.count; t < n; t++) wi.fromBufferAttribute(this, t), wi.transformDirection(e), this.setXYZ(t, wi.x, wi.y, wi.z);
			return this;
		}
		set(e, t = 0) {
			return this.array.set(e, t), this;
		}
		getComponent(e, t) {
			let n = this.array[e * this.itemSize + t];
			return this.normalized && (n = te(n, this.array)), n;
		}
		setComponent(e, t, n) {
			return this.normalized && (n = N(n, this.array)), this.array[e * this.itemSize + t] = n, this;
		}
		getX(e) {
			let t = this.array[e * this.itemSize];
			return this.normalized && (t = te(t, this.array)), t;
		}
		setX(e, t) {
			return this.normalized && (t = N(t, this.array)), this.array[e * this.itemSize] = t, this;
		}
		getY(e) {
			let t = this.array[e * this.itemSize + 1];
			return this.normalized && (t = te(t, this.array)), t;
		}
		setY(e, t) {
			return this.normalized && (t = N(t, this.array)), this.array[e * this.itemSize + 1] = t, this;
		}
		getZ(e) {
			let t = this.array[e * this.itemSize + 2];
			return this.normalized && (t = te(t, this.array)), t;
		}
		setZ(e, t) {
			return this.normalized && (t = N(t, this.array)), this.array[e * this.itemSize + 2] = t, this;
		}
		getW(e) {
			let t = this.array[e * this.itemSize + 3];
			return this.normalized && (t = te(t, this.array)), t;
		}
		setW(e, t) {
			return this.normalized && (t = N(t, this.array)), this.array[e * this.itemSize + 3] = t, this;
		}
		setXY(e, t, n) {
			return e *= this.itemSize, this.normalized && (t = N(t, this.array), n = N(n, this.array)), this.array[e + 0] = t, this.array[e + 1] = n, this;
		}
		setXYZ(e, t, n, r) {
			return e *= this.itemSize, this.normalized && (t = N(t, this.array), n = N(n, this.array), r = N(r, this.array)), this.array[e + 0] = t, this.array[e + 1] = n, this.array[e + 2] = r, this;
		}
		setXYZW(e, t, n, r, i) {
			return e *= this.itemSize, this.normalized && (t = N(t, this.array), n = N(n, this.array), r = N(r, this.array), i = N(i, this.array)), this.array[e + 0] = t, this.array[e + 1] = n, this.array[e + 2] = r, this.array[e + 3] = i, this;
		}
		onUpload(e) {
			return this.onUploadCallback = e, this;
		}
		clone() {
			return new this.constructor(this.array, this.itemSize).copy(this);
		}
		toJSON() {
			let e = {
				itemSize: this.itemSize,
				type: this.array.constructor.name,
				array: Array.from(this.array),
				normalized: this.normalized
			};
			return this.name !== "" && (e.name = this.name), this.usage !== 35044 && (e.usage = this.usage), e;
		}
		dispose() {
			this.dispatchEvent({ type: "dispose" });
		}
	}, Oi = class extends Di {
		constructor(e, t, n) {
			super(new Uint16Array(e), t, n);
		}
	}, ki = class extends Di {
		constructor(e, t, n) {
			super(new Uint32Array(e), t, n);
		}
	}, Ai = class extends Di {
		constructor(e, t, n) {
			super(new Float32Array(e), t, n);
		}
	}, ji = /*@__PURE__*/ new ui(), Mi = /*@__PURE__*/ new W(), Ni = /*@__PURE__*/ new W(), Pi = class {
		constructor(e = new W(), t = -1) {
			this.isSphere = !0, this.center = e, this.radius = t;
		}
		set(e, t) {
			return this.center.copy(e), this.radius = t, this;
		}
		setFromPoints(e, t) {
			let n = this.center;
			t === void 0 ? ji.setFromPoints(e).getCenter(n) : n.copy(t);
			let r = 0;
			for (let t = 0, i = e.length; t < i; t++) r = Math.max(r, n.distanceToSquared(e[t]));
			return this.radius = Math.sqrt(r), this;
		}
		copy(e) {
			return this.center.copy(e.center), this.radius = e.radius, this;
		}
		isEmpty() {
			return this.radius < 0;
		}
		makeEmpty() {
			return this.center.set(0, 0, 0), this.radius = -1, this;
		}
		containsPoint(e) {
			return e.distanceToSquared(this.center) <= this.radius * this.radius;
		}
		distanceToPoint(e) {
			return e.distanceTo(this.center) - this.radius;
		}
		intersectsSphere(e) {
			let t = this.radius + e.radius;
			return e.center.distanceToSquared(this.center) <= t * t;
		}
		intersectsBox(e) {
			return e.intersectsSphere(this);
		}
		intersectsPlane(e) {
			return Math.abs(e.distanceToPoint(this.center)) <= this.radius;
		}
		clampPoint(e, t) {
			let n = this.center.distanceToSquared(e);
			return t.copy(e), n > this.radius * this.radius && (t.sub(this.center).normalize(), t.multiplyScalar(this.radius).add(this.center)), t;
		}
		getBoundingBox(e) {
			return this.isEmpty() ? (e.makeEmpty(), e) : (e.set(this.center, this.center), e.expandByScalar(this.radius), e);
		}
		applyMatrix4(e) {
			return this.center.applyMatrix4(e), this.radius *= e.getMaxScaleOnAxis(), this;
		}
		translate(e) {
			return this.center.add(e), this;
		}
		expandByPoint(e) {
			if (this.isEmpty()) return this.center.copy(e), this.radius = 0, this;
			Mi.subVectors(e, this.center);
			let t = Mi.lengthSq();
			if (t > this.radius * this.radius) {
				let e = Math.sqrt(t), n = (e - this.radius) * .5;
				this.center.addScaledVector(Mi, n / e), this.radius += n;
			}
			return this;
		}
		union(e) {
			return e.isEmpty() ? this : this.isEmpty() ? (this.copy(e), this) : (this.center.equals(e.center) === !0 ? this.radius = Math.max(this.radius, e.radius) : (Ni.subVectors(e.center, this.center).setLength(e.radius), this.expandByPoint(Mi.copy(e.center).add(Ni)), this.expandByPoint(Mi.copy(e.center).sub(Ni))), this);
		}
		equals(e) {
			return e.center.equals(this.center) && e.radius === this.radius;
		}
		clone() {
			return new this.constructor().copy(this);
		}
		toJSON() {
			return {
				radius: this.radius,
				center: this.center.toArray()
			};
		}
		fromJSON(e) {
			return this.radius = e.radius, this.center.fromArray(e.center), this;
		}
	}, Fi = 0, Ii = /*@__PURE__*/ new q(), Li = /*@__PURE__*/ new Vr(), Ri = /*@__PURE__*/ new W(), zi = /*@__PURE__*/ new ui(), Bi = /*@__PURE__*/ new ui(), Vi = /*@__PURE__*/ new W(), Hi = class e extends Gn {
		constructor() {
			super(), this.isBufferGeometry = !0, Object.defineProperty(this, "id", { value: Fi++ }), this.uuid = m(), this.name = "", this.type = "BufferGeometry", this.index = null, this.indirect = null, this.indirectOffset = 0, this.attributes = {}, this.morphAttributes = {}, this.morphTargetsRelative = !1, this.groups = [], this.boundingBox = null, this.boundingSphere = null, this.drawRange = {
				start: 0,
				count: Infinity
			}, this.userData = {}, this._transformed = !1;
		}
		getIndex() {
			return this.index;
		}
		setIndex(e) {
			return this.index = Array.isArray(e) ? new (i(e) ? ki : Oi)(e, 1) : e, this;
		}
		setIndirect(e, t = 0) {
			return this.indirect = e, this.indirectOffset = t, this;
		}
		getIndirect() {
			return this.indirect;
		}
		getAttribute(e) {
			return this.attributes[e];
		}
		setAttribute(e, t) {
			return this.attributes[e] = t, this;
		}
		deleteAttribute(e) {
			return delete this.attributes[e], this;
		}
		hasAttribute(e) {
			return this.attributes[e] !== void 0;
		}
		addGroup(e, t, n = 0) {
			this.groups.push({
				start: e,
				count: t,
				materialIndex: n
			});
		}
		clearGroups() {
			this.groups = [];
		}
		setDrawRange(e, t) {
			this.drawRange.start = e, this.drawRange.count = t;
		}
		applyMatrix4(e) {
			let t = this.attributes.position;
			t !== void 0 && (t.applyMatrix4(e), t.needsUpdate = !0);
			let n = this.attributes.normal;
			if (n !== void 0) {
				let t = new G().getNormalMatrix(e);
				n.applyNormalMatrix(t), n.needsUpdate = !0;
			}
			let r = this.attributes.tangent;
			return r !== void 0 && (r.transformDirection(e), r.needsUpdate = !0), this.boundingBox !== null && this.computeBoundingBox(), this.boundingSphere !== null && this.computeBoundingSphere(), this._transformed = !0, this;
		}
		applyQuaternion(e) {
			return Ii.makeRotationFromQuaternion(e), this.applyMatrix4(Ii), this;
		}
		rotateX(e) {
			return Ii.makeRotationX(e), this.applyMatrix4(Ii), this;
		}
		rotateY(e) {
			return Ii.makeRotationY(e), this.applyMatrix4(Ii), this;
		}
		rotateZ(e) {
			return Ii.makeRotationZ(e), this.applyMatrix4(Ii), this;
		}
		translate(e, t, n) {
			return Ii.makeTranslation(e, t, n), this.applyMatrix4(Ii), this;
		}
		scale(e, t, n) {
			return Ii.makeScale(e, t, n), this.applyMatrix4(Ii), this;
		}
		lookAt(e) {
			return Li.lookAt(e), Li.updateMatrix(), this.applyMatrix4(Li.matrix), this;
		}
		center() {
			return this.computeBoundingBox(), this.boundingBox.getCenter(Ri).negate(), this.translate(Ri.x, Ri.y, Ri.z), this;
		}
		setFromPoints(e) {
			let t = this.getAttribute("position");
			if (t === void 0) {
				let t = [];
				for (let n = 0, r = e.length; n < r; n++) {
					let r = e[n];
					t.push(r.x, r.y, r.z || 0);
				}
				this.setAttribute("position", new Ai(t, 3));
			} else {
				let n = Math.min(e.length, t.count);
				for (let r = 0; r < n; r++) {
					let n = e[r];
					t.setXYZ(r, n.x, n.y, n.z || 0);
				}
				e.length > t.count && u("BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."), t.needsUpdate = !0;
			}
			return this;
		}
		computeBoundingBox() {
			this.boundingBox === null && (this.boundingBox = new ui());
			let e = this.attributes.position, t = this.morphAttributes.position;
			if (e && e.isGLBufferAttribute) {
				d("BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.", this), this.boundingBox.set(new W(-Infinity, -Infinity, -Infinity), new W(Infinity, Infinity, Infinity));
				return;
			}
			if (e !== void 0) {
				if (this.boundingBox.setFromBufferAttribute(e), t) for (let e = 0, n = t.length; e < n; e++) {
					let n = t[e];
					zi.setFromBufferAttribute(n), this.morphTargetsRelative ? (Vi.addVectors(this.boundingBox.min, zi.min), this.boundingBox.expandByPoint(Vi), Vi.addVectors(this.boundingBox.max, zi.max), this.boundingBox.expandByPoint(Vi)) : (this.boundingBox.expandByPoint(zi.min), this.boundingBox.expandByPoint(zi.max));
				}
			} else this.boundingBox.makeEmpty();
			(isNaN(this.boundingBox.min.x) || isNaN(this.boundingBox.min.y) || isNaN(this.boundingBox.min.z)) && d("BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The \"position\" attribute is likely to have NaN values.", this);
		}
		computeBoundingSphere() {
			this.boundingSphere === null && (this.boundingSphere = new Pi());
			let e = this.attributes.position, t = this.morphAttributes.position;
			if (e && e.isGLBufferAttribute) {
				d("BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.", this), this.boundingSphere.set(new W(), Infinity);
				return;
			}
			if (e) {
				let n = this.boundingSphere.center;
				if (zi.setFromBufferAttribute(e), t) for (let e = 0, n = t.length; e < n; e++) {
					let n = t[e];
					Bi.setFromBufferAttribute(n), this.morphTargetsRelative ? (Vi.addVectors(zi.min, Bi.min), zi.expandByPoint(Vi), Vi.addVectors(zi.max, Bi.max), zi.expandByPoint(Vi)) : (zi.expandByPoint(Bi.min), zi.expandByPoint(Bi.max));
				}
				zi.getCenter(n);
				let r = 0;
				for (let t = 0, i = e.count; t < i; t++) Vi.fromBufferAttribute(e, t), r = Math.max(r, n.distanceToSquared(Vi));
				if (t) for (let i = 0, a = t.length; i < a; i++) {
					let a = t[i], o = this.morphTargetsRelative;
					for (let t = 0, i = a.count; t < i; t++) Vi.fromBufferAttribute(a, t), o && (Ri.fromBufferAttribute(e, t), Vi.add(Ri)), r = Math.max(r, n.distanceToSquared(Vi));
				}
				this.boundingSphere.radius = Math.sqrt(r), isNaN(this.boundingSphere.radius) && d("BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The \"position\" attribute is likely to have NaN values.", this);
			}
		}
		computeTangents() {
			let e = this.index, t = this.attributes;
			if (e === null || t.position === void 0 || t.normal === void 0 || t.uv === void 0) {
				d("BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");
				return;
			}
			let n = t.position, r = t.normal, i = t.uv, a = this.getAttribute("tangent");
			(a === void 0 || a.count !== n.count) && (a = new Di(new Float32Array(4 * n.count), 4), this.setAttribute("tangent", a));
			let o = [], s = [];
			for (let e = 0; e < n.count; e++) o[e] = new W(), s[e] = new W();
			let c = new W(), l = new W(), u = new W(), f = new U(), p = new U(), m = new U(), h = new W(), g = new W();
			function _(e, t, r) {
				c.fromBufferAttribute(n, e), l.fromBufferAttribute(n, t), u.fromBufferAttribute(n, r), f.fromBufferAttribute(i, e), p.fromBufferAttribute(i, t), m.fromBufferAttribute(i, r), l.sub(c), u.sub(c), p.sub(f), m.sub(f);
				let a = 1 / (p.x * m.y - m.x * p.y);
				isFinite(a) && (h.copy(l).multiplyScalar(m.y).addScaledVector(u, -p.y).multiplyScalar(a), g.copy(u).multiplyScalar(p.x).addScaledVector(l, -m.x).multiplyScalar(a), o[e].add(h), o[t].add(h), o[r].add(h), s[e].add(g), s[t].add(g), s[r].add(g));
			}
			let v = this.groups;
			v.length === 0 && (v = [{
				start: 0,
				count: e.count
			}]);
			for (let t = 0, n = v.length; t < n; ++t) {
				let n = v[t], r = n.start, i = n.count;
				for (let t = r, n = r + i; t < n; t += 3) _(e.getX(t + 0), e.getX(t + 1), e.getX(t + 2));
			}
			let y = new W(), b = new W(), x = new W(), S = new W();
			function C(e) {
				x.fromBufferAttribute(r, e), S.copy(x);
				let t = o[e];
				y.copy(t), y.sub(x.multiplyScalar(x.dot(t))).normalize(), b.crossVectors(S, t);
				let n = b.dot(s[e]) < 0 ? -1 : 1;
				a.setXYZW(e, y.x, y.y, y.z, n);
			}
			for (let t = 0, n = v.length; t < n; ++t) {
				let n = v[t], r = n.start, i = n.count;
				for (let t = r, n = r + i; t < n; t += 3) C(e.getX(t + 0)), C(e.getX(t + 1)), C(e.getX(t + 2));
			}
			this._transformed = !0;
		}
		computeVertexNormals() {
			let e = this.index, t = this.getAttribute("position");
			if (t !== void 0) {
				let n = this.getAttribute("normal");
				if (n === void 0 || n.count !== t.count) n = new Di(new Float32Array(t.count * 3), 3), this.setAttribute("normal", n);
				else for (let e = 0, t = n.count; e < t; e++) n.setXYZ(e, 0, 0, 0);
				let r = new W(), i = new W(), a = new W(), o = new W(), s = new W(), c = new W(), l = new W(), u = new W();
				if (e) for (let d = 0, f = e.count; d < f; d += 3) {
					let f = e.getX(d + 0), p = e.getX(d + 1), m = e.getX(d + 2);
					r.fromBufferAttribute(t, f), i.fromBufferAttribute(t, p), a.fromBufferAttribute(t, m), l.subVectors(a, i), u.subVectors(r, i), l.cross(u), o.fromBufferAttribute(n, f), s.fromBufferAttribute(n, p), c.fromBufferAttribute(n, m), o.add(l), s.add(l), c.add(l), n.setXYZ(f, o.x, o.y, o.z), n.setXYZ(p, s.x, s.y, s.z), n.setXYZ(m, c.x, c.y, c.z);
				}
				else for (let e = 0, o = t.count; e < o; e += 3) r.fromBufferAttribute(t, e + 0), i.fromBufferAttribute(t, e + 1), a.fromBufferAttribute(t, e + 2), l.subVectors(a, i), u.subVectors(r, i), l.cross(u), n.setXYZ(e + 0, l.x, l.y, l.z), n.setXYZ(e + 1, l.x, l.y, l.z), n.setXYZ(e + 2, l.x, l.y, l.z);
				this.normalizeNormals(), n.needsUpdate = !0;
			}
		}
		normalizeNormals() {
			let e = this.attributes.normal;
			for (let t = 0, n = e.count; t < n; t++) Vi.fromBufferAttribute(e, t), Vi.normalize(), e.setXYZ(t, Vi.x, Vi.y, Vi.z);
		}
		toNonIndexed() {
			function t(e, t) {
				let n = e.array, r = e.itemSize, i = e.normalized, a = new n.constructor(t.length * r), o = 0, s = 0;
				for (let i = 0, c = t.length; i < c; i++) {
					o = e.isInterleavedBufferAttribute ? t[i] * e.data.stride + e.offset : t[i] * r;
					for (let e = 0; e < r; e++) a[s++] = n[o++];
				}
				return new Di(a, r, i);
			}
			if (this.index === null) return u("BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."), this;
			let n = new e(), r = this.index.array, i = this.attributes;
			for (let e in i) {
				let a = i[e], o = t(a, r);
				n.setAttribute(e, o);
			}
			let a = this.morphAttributes;
			for (let e in a) {
				let i = [], o = a[e];
				for (let e = 0, n = o.length; e < n; e++) {
					let n = o[e], a = t(n, r);
					i.push(a);
				}
				n.morphAttributes[e] = i;
			}
			n.morphTargetsRelative = this.morphTargetsRelative;
			let o = this.groups;
			for (let e = 0, t = o.length; e < t; e++) {
				let t = o[e];
				n.addGroup(t.start, t.count, t.materialIndex);
			}
			return n;
		}
		toJSON() {
			let e = { metadata: {
				version: 4.7,
				type: "BufferGeometry",
				generator: "BufferGeometry.toJSON"
			} };
			if (e.uuid = this.uuid, e.type = this.parameters !== void 0 && this._transformed === !0 ? "BufferGeometry" : this.type, this.name !== "" && (e.name = this.name), Object.keys(this.userData).length > 0 && (e.userData = this.userData), this.parameters !== void 0 && this._transformed !== !0) {
				let t = this.parameters;
				for (let n in t) t[n] !== void 0 && (e[n] = t[n]);
				return e;
			}
			e.data = { attributes: {} };
			let t = this.index;
			t !== null && (e.data.index = {
				type: t.array.constructor.name,
				array: Array.prototype.slice.call(t.array)
			});
			let n = this.attributes;
			for (let t in n) {
				let r = n[t];
				e.data.attributes[t] = r.toJSON(e.data);
			}
			let r = {}, i = !1;
			for (let t in this.morphAttributes) {
				let n = this.morphAttributes[t], a = [];
				for (let t = 0, r = n.length; t < r; t++) {
					let r = n[t];
					a.push(r.toJSON(e.data));
				}
				a.length > 0 && (r[t] = a, i = !0);
			}
			i && (e.data.morphAttributes = r, e.data.morphTargetsRelative = this.morphTargetsRelative);
			let a = this.groups;
			a.length > 0 && (e.data.groups = JSON.parse(JSON.stringify(a)));
			let o = this.boundingSphere;
			return o !== null && (e.data.boundingSphere = o.toJSON()), e;
		}
		clone() {
			return new this.constructor().copy(this);
		}
		copy(e) {
			this.index = null, this.attributes = {}, this.morphAttributes = {}, this.groups = [], this.boundingBox = null, this.boundingSphere = null;
			let t = {};
			this.name = e.name;
			let n = e.index;
			n !== null && this.setIndex(n.clone());
			let r = e.attributes;
			for (let e in r) {
				let n = r[e];
				this.setAttribute(e, n.clone(t));
			}
			let i = e.morphAttributes;
			for (let e in i) {
				let n = [], r = i[e];
				for (let e = 0, i = r.length; e < i; e++) n.push(r[e].clone(t));
				this.morphAttributes[e] = n;
			}
			this.morphTargetsRelative = e.morphTargetsRelative;
			let a = e.groups;
			for (let e = 0, t = a.length; e < t; e++) {
				let t = a[e];
				this.addGroup(t.start, t.count, t.materialIndex);
			}
			let o = e.boundingBox;
			o !== null && (this.boundingBox = o.clone());
			let s = e.boundingSphere;
			return s !== null && (this.boundingSphere = s.clone()), this.drawRange.start = e.drawRange.start, this.drawRange.count = e.drawRange.count, this.userData = e.userData, this._transformed = e._transformed, this;
		}
		dispose() {
			this.dispatchEvent({ type: "dispose" });
		}
	}, Ui = class {
		constructor(e, t) {
			this.isInterleavedBuffer = !0, this.array = e, this.stride = t, this.count = e === void 0 ? 0 : e.length / t, this.usage = Bn, this.updateRanges = [], this.version = 0, this.uuid = m();
		}
		onUploadCallback() {}
		set needsUpdate(e) {
			e === !0 && this.version++;
		}
		setUsage(e) {
			return this.usage = e, this;
		}
		addUpdateRange(e, t) {
			this.updateRanges.push({
				start: e,
				count: t
			});
		}
		clearUpdateRanges() {
			this.updateRanges.length = 0;
		}
		copy(e) {
			return this.array = new e.array.constructor(e.array), this.count = e.count, this.stride = e.stride, this.usage = e.usage, this;
		}
		copyAt(e, t, n) {
			e *= this.stride, n *= t.stride;
			for (let r = 0, i = this.stride; r < i; r++) this.array[e + r] = t.array[n + r];
			return this;
		}
		set(e, t = 0) {
			return this.array.set(e, t), this;
		}
		clone(e) {
			e.arrayBuffers === void 0 && (e.arrayBuffers = {}), this.array.buffer._uuid === void 0 && (this.array.buffer._uuid = m()), e.arrayBuffers[this.array.buffer._uuid] === void 0 && (e.arrayBuffers[this.array.buffer._uuid] = this.array.slice(0).buffer);
			let t = new this.array.constructor(e.arrayBuffers[this.array.buffer._uuid]), n = new this.constructor(t, this.stride);
			return n.setUsage(this.usage), n;
		}
		onUpload(e) {
			return this.onUploadCallback = e, this;
		}
		toJSON(e) {
			return e.arrayBuffers === void 0 && (e.arrayBuffers = {}), this.array.buffer._uuid === void 0 && (this.array.buffer._uuid = m()), e.arrayBuffers[this.array.buffer._uuid] === void 0 && (e.arrayBuffers[this.array.buffer._uuid] = Array.from(new Uint32Array(this.array.buffer))), {
				uuid: this.uuid,
				buffer: this.array.buffer._uuid,
				type: this.array.constructor.name,
				stride: this.stride
			};
		}
	}, Wi = /*@__PURE__*/ new W(), Gi = class e {
		constructor(e, t, n, r = !1) {
			this.isInterleavedBufferAttribute = !0, this.name = "", this.data = e, this.itemSize = t, this.offset = n, this.normalized = r;
		}
		get count() {
			return this.data.count;
		}
		get array() {
			return this.data.array;
		}
		set needsUpdate(e) {
			this.data.needsUpdate = e;
		}
		applyMatrix4(e) {
			for (let t = 0, n = this.data.count; t < n; t++) Wi.fromBufferAttribute(this, t), Wi.applyMatrix4(e), this.setXYZ(t, Wi.x, Wi.y, Wi.z);
			return this;
		}
		applyNormalMatrix(e) {
			for (let t = 0, n = this.count; t < n; t++) Wi.fromBufferAttribute(this, t), Wi.applyNormalMatrix(e), this.setXYZ(t, Wi.x, Wi.y, Wi.z);
			return this;
		}
		transformDirection(e) {
			for (let t = 0, n = this.count; t < n; t++) Wi.fromBufferAttribute(this, t), Wi.transformDirection(e), this.setXYZ(t, Wi.x, Wi.y, Wi.z);
			return this;
		}
		getComponent(e, t) {
			let n = this.array[e * this.data.stride + this.offset + t];
			return this.normalized && (n = te(n, this.array)), n;
		}
		setComponent(e, t, n) {
			return this.normalized && (n = N(n, this.array)), this.data.array[e * this.data.stride + this.offset + t] = n, this;
		}
		setX(e, t) {
			return this.normalized && (t = N(t, this.array)), this.data.array[e * this.data.stride + this.offset] = t, this;
		}
		setY(e, t) {
			return this.normalized && (t = N(t, this.array)), this.data.array[e * this.data.stride + this.offset + 1] = t, this;
		}
		setZ(e, t) {
			return this.normalized && (t = N(t, this.array)), this.data.array[e * this.data.stride + this.offset + 2] = t, this;
		}
		setW(e, t) {
			return this.normalized && (t = N(t, this.array)), this.data.array[e * this.data.stride + this.offset + 3] = t, this;
		}
		getX(e) {
			let t = this.data.array[e * this.data.stride + this.offset];
			return this.normalized && (t = te(t, this.array)), t;
		}
		getY(e) {
			let t = this.data.array[e * this.data.stride + this.offset + 1];
			return this.normalized && (t = te(t, this.array)), t;
		}
		getZ(e) {
			let t = this.data.array[e * this.data.stride + this.offset + 2];
			return this.normalized && (t = te(t, this.array)), t;
		}
		getW(e) {
			let t = this.data.array[e * this.data.stride + this.offset + 3];
			return this.normalized && (t = te(t, this.array)), t;
		}
		setXY(e, t, n) {
			return e = e * this.data.stride + this.offset, this.normalized && (t = N(t, this.array), n = N(n, this.array)), this.data.array[e + 0] = t, this.data.array[e + 1] = n, this;
		}
		setXYZ(e, t, n, r) {
			return e = e * this.data.stride + this.offset, this.normalized && (t = N(t, this.array), n = N(n, this.array), r = N(r, this.array)), this.data.array[e + 0] = t, this.data.array[e + 1] = n, this.data.array[e + 2] = r, this;
		}
		setXYZW(e, t, n, r, i) {
			return e = e * this.data.stride + this.offset, this.normalized && (t = N(t, this.array), n = N(n, this.array), r = N(r, this.array), i = N(i, this.array)), this.data.array[e + 0] = t, this.data.array[e + 1] = n, this.data.array[e + 2] = r, this.data.array[e + 3] = i, this;
		}
		clone(t) {
			if (t === void 0) {
				c("InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");
				let e = [];
				for (let t = 0; t < this.count; t++) {
					let n = t * this.data.stride + this.offset;
					for (let t = 0; t < this.itemSize; t++) e.push(this.data.array[n + t]);
				}
				return new Di(new this.array.constructor(e), this.itemSize, this.normalized);
			}
			return t.interleavedBuffers === void 0 && (t.interleavedBuffers = {}), t.interleavedBuffers[this.data.uuid] === void 0 && (t.interleavedBuffers[this.data.uuid] = this.data.clone(t)), new e(t.interleavedBuffers[this.data.uuid], this.itemSize, this.offset, this.normalized);
		}
		toJSON(e) {
			if (e === void 0) {
				c("InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");
				let e = [];
				for (let t = 0; t < this.count; t++) {
					let n = t * this.data.stride + this.offset;
					for (let t = 0; t < this.itemSize; t++) e.push(this.data.array[n + t]);
				}
				return {
					itemSize: this.itemSize,
					type: this.array.constructor.name,
					array: e,
					normalized: this.normalized
				};
			}
			return e.interleavedBuffers === void 0 && (e.interleavedBuffers = {}), e.interleavedBuffers[this.data.uuid] === void 0 && (e.interleavedBuffers[this.data.uuid] = this.data.toJSON(e)), {
				isInterleavedBufferAttribute: !0,
				itemSize: this.itemSize,
				data: this.data.uuid,
				offset: this.offset,
				normalized: this.normalized
			};
		}
	}, Ki = 0, qi = class extends Gn {
		constructor() {
			super(), this.isMaterial = !0, Object.defineProperty(this, "id", { value: Ki++ }), this.uuid = m(), this.name = "", this.type = "Material", this.blending = 1, this.side = 0, this.vertexColors = !1, this.opacity = 1, this.transparent = !1, this.alphaHash = !1, this.blendSrc = 204, this.blendDst = 205, this.blendEquation = 100, this.blendSrcAlpha = null, this.blendDstAlpha = null, this.blendEquationAlpha = null, this.blendColor = new J(0, 0, 0), this.blendAlpha = 0, this.depthFunc = 3, this.depthTest = !0, this.depthWrite = !0, this.stencilWriteMask = 255, this.stencilFunc = 519, this.stencilRef = 0, this.stencilFuncMask = 255, this.stencilFail = zn, this.stencilZFail = zn, this.stencilZPass = zn, this.stencilWrite = !1, this.clippingPlanes = null, this.clipIntersection = !1, this.clipShadows = !1, this.shadowSide = null, this.colorWrite = !0, this.precision = null, this.polygonOffset = !1, this.polygonOffsetFactor = 0, this.polygonOffsetUnits = 0, this.dithering = !1, this.alphaToCoverage = !1, this.premultipliedAlpha = !1, this.forceSinglePass = !1, this.allowOverride = !0, this.visible = !0, this.toneMapped = !0, this.userData = {}, this.version = 0, this._alphaTest = 0;
		}
		get alphaTest() {
			return this._alphaTest;
		}
		set alphaTest(e) {
			this._alphaTest > 0 != e > 0 && this.version++, this._alphaTest = e;
		}
		onBeforeRender() {}
		onBeforeCompile() {}
		customProgramCacheKey() {
			return this.onBeforeCompile.toString();
		}
		setValues(e) {
			if (e !== void 0) for (let t in e) {
				let n = e[t];
				if (n === void 0) {
					u(`Material: parameter '${t}' has value of undefined.`);
					continue;
				}
				let r = this[t];
				if (r === void 0) {
					u(`Material: '${t}' is not a property of THREE.${this.type}.`);
					continue;
				}
				r && r.isColor ? r.set(n) : r && r.isVector2 && n && n.isVector2 || r && r.isEuler && n && n.isEuler || r && r.isVector3 && n && n.isVector3 ? r.copy(n) : this[t] = n;
			}
		}
		toJSON(e) {
			let t = e === void 0 || typeof e == "string";
			t && (e = {
				textures: {},
				images: {}
			});
			let n = { metadata: {
				version: 4.7,
				type: "Material",
				generator: "Material.toJSON"
			} };
			n.uuid = this.uuid, n.type = this.type, this.name !== "" && (n.name = this.name), this.color && this.color.isColor && (n.color = this.color.getHex()), this.roughness !== void 0 && (n.roughness = this.roughness), this.metalness !== void 0 && (n.metalness = this.metalness), this.sheen !== void 0 && (n.sheen = this.sheen), this.sheenColor && this.sheenColor.isColor && (n.sheenColor = this.sheenColor.getHex()), this.sheenRoughness !== void 0 && (n.sheenRoughness = this.sheenRoughness), this.emissive && this.emissive.isColor && (n.emissive = this.emissive.getHex()), this.emissiveIntensity !== void 0 && this.emissiveIntensity !== 1 && (n.emissiveIntensity = this.emissiveIntensity), this.specular && this.specular.isColor && (n.specular = this.specular.getHex()), this.specularIntensity !== void 0 && (n.specularIntensity = this.specularIntensity), this.specularColor && this.specularColor.isColor && (n.specularColor = this.specularColor.getHex()), this.shininess !== void 0 && (n.shininess = this.shininess), this.clearcoat !== void 0 && (n.clearcoat = this.clearcoat), this.clearcoatRoughness !== void 0 && (n.clearcoatRoughness = this.clearcoatRoughness), this.clearcoatMap && this.clearcoatMap.isTexture && (n.clearcoatMap = this.clearcoatMap.toJSON(e).uuid), this.clearcoatRoughnessMap && this.clearcoatRoughnessMap.isTexture && (n.clearcoatRoughnessMap = this.clearcoatRoughnessMap.toJSON(e).uuid), this.clearcoatNormalMap && this.clearcoatNormalMap.isTexture && (n.clearcoatNormalMap = this.clearcoatNormalMap.toJSON(e).uuid, n.clearcoatNormalScale = this.clearcoatNormalScale.toArray()), this.sheenColorMap && this.sheenColorMap.isTexture && (n.sheenColorMap = this.sheenColorMap.toJSON(e).uuid), this.sheenRoughnessMap && this.sheenRoughnessMap.isTexture && (n.sheenRoughnessMap = this.sheenRoughnessMap.toJSON(e).uuid), this.dispersion !== void 0 && (n.dispersion = this.dispersion), this.iridescence !== void 0 && (n.iridescence = this.iridescence), this.iridescenceIOR !== void 0 && (n.iridescenceIOR = this.iridescenceIOR), this.iridescenceThicknessRange !== void 0 && (n.iridescenceThicknessRange = this.iridescenceThicknessRange), this.iridescenceMap && this.iridescenceMap.isTexture && (n.iridescenceMap = this.iridescenceMap.toJSON(e).uuid), this.iridescenceThicknessMap && this.iridescenceThicknessMap.isTexture && (n.iridescenceThicknessMap = this.iridescenceThicknessMap.toJSON(e).uuid), this.anisotropy !== void 0 && (n.anisotropy = this.anisotropy), this.anisotropyRotation !== void 0 && (n.anisotropyRotation = this.anisotropyRotation), this.anisotropyMap && this.anisotropyMap.isTexture && (n.anisotropyMap = this.anisotropyMap.toJSON(e).uuid), this.map && this.map.isTexture && (n.map = this.map.toJSON(e).uuid), this.matcap && this.matcap.isTexture && (n.matcap = this.matcap.toJSON(e).uuid), this.alphaMap && this.alphaMap.isTexture && (n.alphaMap = this.alphaMap.toJSON(e).uuid), this.lightMap && this.lightMap.isTexture && (n.lightMap = this.lightMap.toJSON(e).uuid, n.lightMapIntensity = this.lightMapIntensity), this.aoMap && this.aoMap.isTexture && (n.aoMap = this.aoMap.toJSON(e).uuid, n.aoMapIntensity = this.aoMapIntensity), this.bumpMap && this.bumpMap.isTexture && (n.bumpMap = this.bumpMap.toJSON(e).uuid, n.bumpScale = this.bumpScale), this.normalMap && this.normalMap.isTexture && (n.normalMap = this.normalMap.toJSON(e).uuid, n.normalMapType = this.normalMapType, n.normalScale = this.normalScale.toArray()), this.displacementMap && this.displacementMap.isTexture && (n.displacementMap = this.displacementMap.toJSON(e).uuid, n.displacementScale = this.displacementScale, n.displacementBias = this.displacementBias), this.roughnessMap && this.roughnessMap.isTexture && (n.roughnessMap = this.roughnessMap.toJSON(e).uuid), this.metalnessMap && this.metalnessMap.isTexture && (n.metalnessMap = this.metalnessMap.toJSON(e).uuid), this.emissiveMap && this.emissiveMap.isTexture && (n.emissiveMap = this.emissiveMap.toJSON(e).uuid), this.specularMap && this.specularMap.isTexture && (n.specularMap = this.specularMap.toJSON(e).uuid), this.specularIntensityMap && this.specularIntensityMap.isTexture && (n.specularIntensityMap = this.specularIntensityMap.toJSON(e).uuid), this.specularColorMap && this.specularColorMap.isTexture && (n.specularColorMap = this.specularColorMap.toJSON(e).uuid), this.envMap && this.envMap.isTexture && (n.envMap = this.envMap.toJSON(e).uuid, this.combine !== void 0 && (n.combine = this.combine)), this.envMapRotation !== void 0 && (n.envMapRotation = this.envMapRotation.toArray()), this.envMapIntensity !== void 0 && (n.envMapIntensity = this.envMapIntensity), this.reflectivity !== void 0 && (n.reflectivity = this.reflectivity), this.refractionRatio !== void 0 && (n.refractionRatio = this.refractionRatio), this.gradientMap && this.gradientMap.isTexture && (n.gradientMap = this.gradientMap.toJSON(e).uuid), this.transmission !== void 0 && (n.transmission = this.transmission), this.transmissionMap && this.transmissionMap.isTexture && (n.transmissionMap = this.transmissionMap.toJSON(e).uuid), this.thickness !== void 0 && (n.thickness = this.thickness), this.thicknessMap && this.thicknessMap.isTexture && (n.thicknessMap = this.thicknessMap.toJSON(e).uuid), this.attenuationDistance !== void 0 && this.attenuationDistance !== Infinity && (n.attenuationDistance = this.attenuationDistance), this.attenuationColor !== void 0 && (n.attenuationColor = this.attenuationColor.getHex()), this.size !== void 0 && (n.size = this.size), this.shadowSide !== null && (n.shadowSide = this.shadowSide), this.sizeAttenuation !== void 0 && (n.sizeAttenuation = this.sizeAttenuation), this.blending !== 1 && (n.blending = this.blending), this.side !== 0 && (n.side = this.side), this.vertexColors === !0 && (n.vertexColors = !0), this.opacity < 1 && (n.opacity = this.opacity), this.transparent === !0 && (n.transparent = !0), this.blendSrc !== 204 && (n.blendSrc = this.blendSrc), this.blendDst !== 205 && (n.blendDst = this.blendDst), this.blendEquation !== 100 && (n.blendEquation = this.blendEquation), this.blendSrcAlpha !== null && (n.blendSrcAlpha = this.blendSrcAlpha), this.blendDstAlpha !== null && (n.blendDstAlpha = this.blendDstAlpha), this.blendEquationAlpha !== null && (n.blendEquationAlpha = this.blendEquationAlpha), this.blendColor && this.blendColor.isColor && (n.blendColor = this.blendColor.getHex()), this.blendAlpha !== 0 && (n.blendAlpha = this.blendAlpha), this.depthFunc !== 3 && (n.depthFunc = this.depthFunc), this.depthTest === !1 && (n.depthTest = this.depthTest), this.depthWrite === !1 && (n.depthWrite = this.depthWrite), this.colorWrite === !1 && (n.colorWrite = this.colorWrite), this.stencilWriteMask !== 255 && (n.stencilWriteMask = this.stencilWriteMask), this.stencilFunc !== 519 && (n.stencilFunc = this.stencilFunc), this.stencilRef !== 0 && (n.stencilRef = this.stencilRef), this.stencilFuncMask !== 255 && (n.stencilFuncMask = this.stencilFuncMask), this.stencilFail !== 7680 && (n.stencilFail = this.stencilFail), this.stencilZFail !== 7680 && (n.stencilZFail = this.stencilZFail), this.stencilZPass !== 7680 && (n.stencilZPass = this.stencilZPass), this.stencilWrite === !0 && (n.stencilWrite = this.stencilWrite), this.rotation !== void 0 && this.rotation !== 0 && (n.rotation = this.rotation), this.polygonOffset === !0 && (n.polygonOffset = !0), this.polygonOffsetFactor !== 0 && (n.polygonOffsetFactor = this.polygonOffsetFactor), this.polygonOffsetUnits !== 0 && (n.polygonOffsetUnits = this.polygonOffsetUnits), this.linewidth !== void 0 && this.linewidth !== 1 && (n.linewidth = this.linewidth), this.dashSize !== void 0 && (n.dashSize = this.dashSize), this.gapSize !== void 0 && (n.gapSize = this.gapSize), this.scale !== void 0 && (n.scale = this.scale), this.dithering === !0 && (n.dithering = !0), this.alphaTest > 0 && (n.alphaTest = this.alphaTest), this.alphaHash === !0 && (n.alphaHash = !0), this.alphaToCoverage === !0 && (n.alphaToCoverage = !0), this.premultipliedAlpha === !0 && (n.premultipliedAlpha = !0), this.forceSinglePass === !0 && (n.forceSinglePass = !0), this.allowOverride === !1 && (n.allowOverride = !1), this.wireframe === !0 && (n.wireframe = !0), this.wireframeLinewidth > 1 && (n.wireframeLinewidth = this.wireframeLinewidth), this.wireframeLinecap !== "round" && (n.wireframeLinecap = this.wireframeLinecap), this.wireframeLinejoin !== "round" && (n.wireframeLinejoin = this.wireframeLinejoin), this.flatShading === !0 && (n.flatShading = !0), this.visible === !1 && (n.visible = !1), this.toneMapped === !1 && (n.toneMapped = !1), this.fog === !1 && (n.fog = !1), Object.keys(this.userData).length > 0 && (n.userData = this.userData);
			function r(e) {
				let t = [];
				for (let n in e) {
					let r = e[n];
					delete r.metadata, t.push(r);
				}
				return t;
			}
			if (t) {
				let t = r(e.textures), i = r(e.images);
				t.length > 0 && (n.textures = t), i.length > 0 && (n.images = i);
			}
			return n;
		}
		fromJSON(e, t) {
			if (e.uuid !== void 0 && (this.uuid = e.uuid), e.name !== void 0 && (this.name = e.name), e.color !== void 0 && this.color !== void 0 && this.color.setHex(e.color), e.roughness !== void 0 && (this.roughness = e.roughness), e.metalness !== void 0 && (this.metalness = e.metalness), e.sheen !== void 0 && (this.sheen = e.sheen), e.sheenColor !== void 0 && (this.sheenColor = new J().setHex(e.sheenColor)), e.sheenRoughness !== void 0 && (this.sheenRoughness = e.sheenRoughness), e.emissive !== void 0 && this.emissive !== void 0 && this.emissive.setHex(e.emissive), e.specular !== void 0 && this.specular !== void 0 && this.specular.setHex(e.specular), e.specularIntensity !== void 0 && (this.specularIntensity = e.specularIntensity), e.specularColor !== void 0 && this.specularColor !== void 0 && this.specularColor.setHex(e.specularColor), e.shininess !== void 0 && (this.shininess = e.shininess), e.clearcoat !== void 0 && (this.clearcoat = e.clearcoat), e.clearcoatRoughness !== void 0 && (this.clearcoatRoughness = e.clearcoatRoughness), e.dispersion !== void 0 && (this.dispersion = e.dispersion), e.iridescence !== void 0 && (this.iridescence = e.iridescence), e.iridescenceIOR !== void 0 && (this.iridescenceIOR = e.iridescenceIOR), e.iridescenceThicknessRange !== void 0 && (this.iridescenceThicknessRange = e.iridescenceThicknessRange), e.transmission !== void 0 && (this.transmission = e.transmission), e.thickness !== void 0 && (this.thickness = e.thickness), e.attenuationDistance !== void 0 && (this.attenuationDistance = e.attenuationDistance), e.attenuationColor !== void 0 && this.attenuationColor !== void 0 && this.attenuationColor.setHex(e.attenuationColor), e.anisotropy !== void 0 && (this.anisotropy = e.anisotropy), e.anisotropyRotation !== void 0 && (this.anisotropyRotation = e.anisotropyRotation), e.fog !== void 0 && (this.fog = e.fog), e.flatShading !== void 0 && (this.flatShading = e.flatShading), e.blending !== void 0 && (this.blending = e.blending), e.combine !== void 0 && (this.combine = e.combine), e.side !== void 0 && (this.side = e.side), e.shadowSide !== void 0 && (this.shadowSide = e.shadowSide), e.opacity !== void 0 && (this.opacity = e.opacity), e.transparent !== void 0 && (this.transparent = e.transparent), e.alphaTest !== void 0 && (this.alphaTest = e.alphaTest), e.alphaHash !== void 0 && (this.alphaHash = e.alphaHash), e.depthFunc !== void 0 && (this.depthFunc = e.depthFunc), e.depthTest !== void 0 && (this.depthTest = e.depthTest), e.depthWrite !== void 0 && (this.depthWrite = e.depthWrite), e.colorWrite !== void 0 && (this.colorWrite = e.colorWrite), e.blendSrc !== void 0 && (this.blendSrc = e.blendSrc), e.blendDst !== void 0 && (this.blendDst = e.blendDst), e.blendEquation !== void 0 && (this.blendEquation = e.blendEquation), e.blendSrcAlpha !== void 0 && (this.blendSrcAlpha = e.blendSrcAlpha), e.blendDstAlpha !== void 0 && (this.blendDstAlpha = e.blendDstAlpha), e.blendEquationAlpha !== void 0 && (this.blendEquationAlpha = e.blendEquationAlpha), e.blendColor !== void 0 && this.blendColor !== void 0 && this.blendColor.setHex(e.blendColor), e.blendAlpha !== void 0 && (this.blendAlpha = e.blendAlpha), e.stencilWriteMask !== void 0 && (this.stencilWriteMask = e.stencilWriteMask), e.stencilFunc !== void 0 && (this.stencilFunc = e.stencilFunc), e.stencilRef !== void 0 && (this.stencilRef = e.stencilRef), e.stencilFuncMask !== void 0 && (this.stencilFuncMask = e.stencilFuncMask), e.stencilFail !== void 0 && (this.stencilFail = e.stencilFail), e.stencilZFail !== void 0 && (this.stencilZFail = e.stencilZFail), e.stencilZPass !== void 0 && (this.stencilZPass = e.stencilZPass), e.stencilWrite !== void 0 && (this.stencilWrite = e.stencilWrite), e.wireframe !== void 0 && (this.wireframe = e.wireframe), e.wireframeLinewidth !== void 0 && (this.wireframeLinewidth = e.wireframeLinewidth), e.wireframeLinecap !== void 0 && (this.wireframeLinecap = e.wireframeLinecap), e.wireframeLinejoin !== void 0 && (this.wireframeLinejoin = e.wireframeLinejoin), e.rotation !== void 0 && (this.rotation = e.rotation), e.linewidth !== void 0 && (this.linewidth = e.linewidth), e.dashSize !== void 0 && (this.dashSize = e.dashSize), e.gapSize !== void 0 && (this.gapSize = e.gapSize), e.scale !== void 0 && (this.scale = e.scale), e.polygonOffset !== void 0 && (this.polygonOffset = e.polygonOffset), e.polygonOffsetFactor !== void 0 && (this.polygonOffsetFactor = e.polygonOffsetFactor), e.polygonOffsetUnits !== void 0 && (this.polygonOffsetUnits = e.polygonOffsetUnits), e.dithering !== void 0 && (this.dithering = e.dithering), e.alphaToCoverage !== void 0 && (this.alphaToCoverage = e.alphaToCoverage), e.premultipliedAlpha !== void 0 && (this.premultipliedAlpha = e.premultipliedAlpha), e.forceSinglePass !== void 0 && (this.forceSinglePass = e.forceSinglePass), e.allowOverride !== void 0 && (this.allowOverride = e.allowOverride), e.visible !== void 0 && (this.visible = e.visible), e.toneMapped !== void 0 && (this.toneMapped = e.toneMapped), e.userData !== void 0 && (this.userData = e.userData), e.vertexColors !== void 0 && (this.vertexColors = typeof e.vertexColors == "number" ? e.vertexColors > 0 : e.vertexColors), e.size !== void 0 && (this.size = e.size), e.sizeAttenuation !== void 0 && (this.sizeAttenuation = e.sizeAttenuation), e.map !== void 0 && (this.map = t[e.map] || null), e.matcap !== void 0 && (this.matcap = t[e.matcap] || null), e.alphaMap !== void 0 && (this.alphaMap = t[e.alphaMap] || null), e.bumpMap !== void 0 && (this.bumpMap = t[e.bumpMap] || null), e.bumpScale !== void 0 && (this.bumpScale = e.bumpScale), e.normalMap !== void 0 && (this.normalMap = t[e.normalMap] || null), e.normalMapType !== void 0 && (this.normalMapType = e.normalMapType), e.normalScale !== void 0) {
				let t = e.normalScale;
				Array.isArray(t) === !1 && (t = [t, t]), this.normalScale = new U().fromArray(t);
			}
			return e.displacementMap !== void 0 && (this.displacementMap = t[e.displacementMap] || null), e.displacementScale !== void 0 && (this.displacementScale = e.displacementScale), e.displacementBias !== void 0 && (this.displacementBias = e.displacementBias), e.roughnessMap !== void 0 && (this.roughnessMap = t[e.roughnessMap] || null), e.metalnessMap !== void 0 && (this.metalnessMap = t[e.metalnessMap] || null), e.emissiveMap !== void 0 && (this.emissiveMap = t[e.emissiveMap] || null), e.emissiveIntensity !== void 0 && (this.emissiveIntensity = e.emissiveIntensity), e.specularMap !== void 0 && (this.specularMap = t[e.specularMap] || null), e.specularIntensityMap !== void 0 && (this.specularIntensityMap = t[e.specularIntensityMap] || null), e.specularColorMap !== void 0 && (this.specularColorMap = t[e.specularColorMap] || null), e.envMap !== void 0 && (this.envMap = t[e.envMap] || null), e.envMapRotation !== void 0 && this.envMapRotation.fromArray(e.envMapRotation), e.envMapIntensity !== void 0 && (this.envMapIntensity = e.envMapIntensity), e.reflectivity !== void 0 && (this.reflectivity = e.reflectivity), e.refractionRatio !== void 0 && (this.refractionRatio = e.refractionRatio), e.lightMap !== void 0 && (this.lightMap = t[e.lightMap] || null), e.lightMapIntensity !== void 0 && (this.lightMapIntensity = e.lightMapIntensity), e.aoMap !== void 0 && (this.aoMap = t[e.aoMap] || null), e.aoMapIntensity !== void 0 && (this.aoMapIntensity = e.aoMapIntensity), e.gradientMap !== void 0 && (this.gradientMap = t[e.gradientMap] || null), e.clearcoatMap !== void 0 && (this.clearcoatMap = t[e.clearcoatMap] || null), e.clearcoatRoughnessMap !== void 0 && (this.clearcoatRoughnessMap = t[e.clearcoatRoughnessMap] || null), e.clearcoatNormalMap !== void 0 && (this.clearcoatNormalMap = t[e.clearcoatNormalMap] || null), e.clearcoatNormalScale !== void 0 && (this.clearcoatNormalScale = new U().fromArray(e.clearcoatNormalScale)), e.iridescenceMap !== void 0 && (this.iridescenceMap = t[e.iridescenceMap] || null), e.iridescenceThicknessMap !== void 0 && (this.iridescenceThicknessMap = t[e.iridescenceThicknessMap] || null), e.transmissionMap !== void 0 && (this.transmissionMap = t[e.transmissionMap] || null), e.thicknessMap !== void 0 && (this.thicknessMap = t[e.thicknessMap] || null), e.anisotropyMap !== void 0 && (this.anisotropyMap = t[e.anisotropyMap] || null), e.sheenColorMap !== void 0 && (this.sheenColorMap = t[e.sheenColorMap] || null), e.sheenRoughnessMap !== void 0 && (this.sheenRoughnessMap = t[e.sheenRoughnessMap] || null), this;
		}
		clone() {
			return new this.constructor().copy(this);
		}
		copy(e) {
			this.name = e.name, this.blending = e.blending, this.side = e.side, this.vertexColors = e.vertexColors, this.opacity = e.opacity, this.transparent = e.transparent, this.blendSrc = e.blendSrc, this.blendDst = e.blendDst, this.blendEquation = e.blendEquation, this.blendSrcAlpha = e.blendSrcAlpha, this.blendDstAlpha = e.blendDstAlpha, this.blendEquationAlpha = e.blendEquationAlpha, this.blendColor.copy(e.blendColor), this.blendAlpha = e.blendAlpha, this.depthFunc = e.depthFunc, this.depthTest = e.depthTest, this.depthWrite = e.depthWrite, this.stencilWriteMask = e.stencilWriteMask, this.stencilFunc = e.stencilFunc, this.stencilRef = e.stencilRef, this.stencilFuncMask = e.stencilFuncMask, this.stencilFail = e.stencilFail, this.stencilZFail = e.stencilZFail, this.stencilZPass = e.stencilZPass, this.stencilWrite = e.stencilWrite;
			let t = e.clippingPlanes, n = null;
			if (t !== null) {
				let e = t.length;
				n = Array(e);
				for (let r = 0; r !== e; ++r) n[r] = t[r].clone();
			}
			return this.clippingPlanes = n, this.clipIntersection = e.clipIntersection, this.clipShadows = e.clipShadows, this.shadowSide = e.shadowSide, this.colorWrite = e.colorWrite, this.precision = e.precision, this.polygonOffset = e.polygonOffset, this.polygonOffsetFactor = e.polygonOffsetFactor, this.polygonOffsetUnits = e.polygonOffsetUnits, this.dithering = e.dithering, this.alphaTest = e.alphaTest, this.alphaHash = e.alphaHash, this.alphaToCoverage = e.alphaToCoverage, this.premultipliedAlpha = e.premultipliedAlpha, this.forceSinglePass = e.forceSinglePass, this.allowOverride = e.allowOverride, this.visible = e.visible, this.toneMapped = e.toneMapped, this.userData = JSON.parse(JSON.stringify(e.userData)), this;
		}
		dispose() {
			this.dispatchEvent({ type: "dispose" });
		}
		set needsUpdate(e) {
			e === !0 && this.version++;
		}
	}, Ji = /*@__PURE__*/ new W(), Yi = /*@__PURE__*/ new W(), Xi = /*@__PURE__*/ new W(), Zi = /*@__PURE__*/ new W(), Qi = /*@__PURE__*/ new W(), $i = /*@__PURE__*/ new W(), ea = /*@__PURE__*/ new W(), ta = class {
		constructor(e = new W(), t = new W(0, 0, -1)) {
			this.origin = e, this.direction = t;
		}
		set(e, t) {
			return this.origin.copy(e), this.direction.copy(t), this;
		}
		copy(e) {
			return this.origin.copy(e.origin), this.direction.copy(e.direction), this;
		}
		at(e, t) {
			return t.copy(this.origin).addScaledVector(this.direction, e);
		}
		lookAt(e) {
			return this.direction.copy(e).sub(this.origin).normalize(), this;
		}
		recast(e) {
			return this.origin.copy(this.at(e, Ji)), this;
		}
		closestPointToPoint(e, t) {
			t.subVectors(e, this.origin);
			let n = t.dot(this.direction);
			return n < 0 ? t.copy(this.origin) : t.copy(this.origin).addScaledVector(this.direction, n);
		}
		distanceToPoint(e) {
			return Math.sqrt(this.distanceSqToPoint(e));
		}
		distanceSqToPoint(e) {
			let t = Ji.subVectors(e, this.origin).dot(this.direction);
			return t < 0 ? this.origin.distanceToSquared(e) : (Ji.copy(this.origin).addScaledVector(this.direction, t), Ji.distanceToSquared(e));
		}
		distanceSqToSegment(e, t, n, r) {
			Yi.copy(e).add(t).multiplyScalar(.5), Xi.copy(t).sub(e).normalize(), Zi.copy(this.origin).sub(Yi);
			let i = e.distanceTo(t) * .5, a = -this.direction.dot(Xi), o = Zi.dot(this.direction), s = -Zi.dot(Xi), c = Zi.lengthSq(), l = Math.abs(1 - a * a), u, d, f, p;
			if (l > 0) {
				if (u = a * s - o, d = a * o - s, p = i * l, u >= 0) {
					if (d >= -p) {
						if (d <= p) {
							let e = 1 / l;
							u *= e, d *= e, f = u * (u + a * d + 2 * o) + d * (a * u + d + 2 * s) + c;
						} else d = i, u = Math.max(0, -(a * d + o)), f = -u * u + d * (d + 2 * s) + c;
					} else d = -i, u = Math.max(0, -(a * d + o)), f = -u * u + d * (d + 2 * s) + c;
				} else d <= -p ? (u = Math.max(0, -(-a * i + o)), d = u > 0 ? -i : Math.min(Math.max(-i, -s), i), f = -u * u + d * (d + 2 * s) + c) : d <= p ? (u = 0, d = Math.min(Math.max(-i, -s), i), f = d * (d + 2 * s) + c) : (u = Math.max(0, -(a * i + o)), d = u > 0 ? i : Math.min(Math.max(-i, -s), i), f = -u * u + d * (d + 2 * s) + c);
			} else d = a > 0 ? -i : i, u = Math.max(0, -(a * d + o)), f = -u * u + d * (d + 2 * s) + c;
			return n && n.copy(this.origin).addScaledVector(this.direction, u), r && r.copy(Yi).addScaledVector(Xi, d), f;
		}
		intersectSphere(e, t) {
			Ji.subVectors(e.center, this.origin);
			let n = Ji.dot(this.direction), r = Ji.dot(Ji) - n * n, i = e.radius * e.radius;
			if (r > i) return null;
			let a = Math.sqrt(i - r), o = n - a, s = n + a;
			return s < 0 ? null : o < 0 ? this.at(s, t) : this.at(o, t);
		}
		intersectsSphere(e) {
			return e.radius < 0 ? !1 : this.distanceSqToPoint(e.center) <= e.radius * e.radius;
		}
		distanceToPlane(e) {
			let t = e.normal.dot(this.direction);
			if (t === 0) return e.distanceToPoint(this.origin) === 0 ? 0 : null;
			let n = -(this.origin.dot(e.normal) + e.constant) / t;
			return n >= 0 ? n : null;
		}
		intersectPlane(e, t) {
			let n = this.distanceToPlane(e);
			return n === null ? null : this.at(n, t);
		}
		intersectsPlane(e) {
			let t = e.distanceToPoint(this.origin);
			return t === 0 || e.normal.dot(this.direction) * t < 0;
		}
		intersectBox(e, t) {
			let n, r, i, a, o, s, c = 1 / this.direction.x, l = 1 / this.direction.y, u = 1 / this.direction.z, d = this.origin;
			return c >= 0 ? (n = (e.min.x - d.x) * c, r = (e.max.x - d.x) * c) : (n = (e.max.x - d.x) * c, r = (e.min.x - d.x) * c), l >= 0 ? (i = (e.min.y - d.y) * l, a = (e.max.y - d.y) * l) : (i = (e.max.y - d.y) * l, a = (e.min.y - d.y) * l), n > a || i > r || ((i > n || isNaN(n)) && (n = i), (a < r || isNaN(r)) && (r = a), u >= 0 ? (o = (e.min.z - d.z) * u, s = (e.max.z - d.z) * u) : (o = (e.max.z - d.z) * u, s = (e.min.z - d.z) * u), n > s || o > r) || ((o > n || n !== n) && (n = o), (s < r || r !== r) && (r = s), r < 0) ? null : this.at(n >= 0 ? n : r, t);
		}
		intersectsBox(e) {
			return this.intersectBox(e, Ji) !== null;
		}
		intersectTriangle(e, t, n, r, i) {
			Qi.subVectors(t, e), $i.subVectors(n, e), ea.crossVectors(Qi, $i);
			let a = this.direction.dot(ea), o;
			if (a > 0) {
				if (r) return null;
				o = 1;
			} else if (a < 0) o = -1, a = -a;
			else return null;
			Zi.subVectors(this.origin, e);
			let s = o * this.direction.dot($i.crossVectors(Zi, $i));
			if (s < 0) return null;
			let c = o * this.direction.dot(Qi.cross(Zi));
			if (c < 0 || s + c > a) return null;
			let l = -o * Zi.dot(ea);
			return l < 0 ? null : this.at(l / a, i);
		}
		applyMatrix4(e) {
			return this.origin.applyMatrix4(e), this.direction.transformDirection(e), this;
		}
		equals(e) {
			return e.origin.equals(this.origin) && e.direction.equals(this.direction);
		}
		clone() {
			return new this.constructor().copy(this);
		}
	}, na = class extends qi {
		constructor(e) {
			super(), this.isMeshBasicMaterial = !0, this.type = "MeshBasicMaterial", this.color = new J(16777215), this.map = null, this.lightMap = null, this.lightMapIntensity = 1, this.aoMap = null, this.aoMapIntensity = 1, this.specularMap = null, this.alphaMap = null, this.envMap = null, this.envMapRotation = new wr(), this.combine = 0, this.reflectivity = 1, this.refractionRatio = .98, this.wireframe = !1, this.wireframeLinewidth = 1, this.wireframeLinecap = "round", this.wireframeLinejoin = "round", this.fog = !0, this.setValues(e);
		}
		copy(e) {
			return super.copy(e), this.color.copy(e.color), this.map = e.map, this.lightMap = e.lightMap, this.lightMapIntensity = e.lightMapIntensity, this.aoMap = e.aoMap, this.aoMapIntensity = e.aoMapIntensity, this.specularMap = e.specularMap, this.alphaMap = e.alphaMap, this.envMap = e.envMap, this.envMapRotation.copy(e.envMapRotation), this.combine = e.combine, this.reflectivity = e.reflectivity, this.refractionRatio = e.refractionRatio, this.wireframe = e.wireframe, this.wireframeLinewidth = e.wireframeLinewidth, this.wireframeLinecap = e.wireframeLinecap, this.wireframeLinejoin = e.wireframeLinejoin, this.fog = e.fog, this;
		}
	}, ra = /*@__PURE__*/ new q(), ia = /*@__PURE__*/ new ta(), aa = /*@__PURE__*/ new Pi(), oa = /*@__PURE__*/ new W(), sa = /*@__PURE__*/ new W(), ca = /*@__PURE__*/ new W(), la = /*@__PURE__*/ new W(), ua = /*@__PURE__*/ new W(), da = /*@__PURE__*/ new W(), fa = /*@__PURE__*/ new W(), pa = /*@__PURE__*/ new W(), ma = class extends Vr {
		constructor(e = new Hi(), t = new na()) {
			super(), this.isMesh = !0, this.type = "Mesh", this.geometry = e, this.material = t, this.morphTargetDictionary = void 0, this.morphTargetInfluences = void 0, this.count = 1, this.updateMorphTargets();
		}
		copy(e, t) {
			return super.copy(e, t), e.morphTargetInfluences !== void 0 && (this.morphTargetInfluences = e.morphTargetInfluences.slice()), e.morphTargetDictionary !== void 0 && (this.morphTargetDictionary = Object.assign({}, e.morphTargetDictionary)), this.material = Array.isArray(e.material) ? e.material.slice() : e.material, this.geometry = e.geometry, this;
		}
		updateMorphTargets() {
			let e = this.geometry.morphAttributes, t = Object.keys(e);
			if (t.length > 0) {
				let n = e[t[0]];
				if (n !== void 0) {
					this.morphTargetInfluences = [], this.morphTargetDictionary = {};
					for (let e = 0, t = n.length; e < t; e++) {
						let t = n[e].name || String(e);
						this.morphTargetInfluences.push(0), this.morphTargetDictionary[t] = e;
					}
				}
			}
		}
		getVertexPosition(e, t) {
			let n = this.geometry, r = n.attributes.position, i = n.morphAttributes.position, a = n.morphTargetsRelative;
			t.fromBufferAttribute(r, e);
			let o = this.morphTargetInfluences;
			if (i && o) {
				da.set(0, 0, 0);
				for (let n = 0, r = i.length; n < r; n++) {
					let r = o[n], s = i[n];
					r !== 0 && (ua.fromBufferAttribute(s, e), a ? da.addScaledVector(ua, r) : da.addScaledVector(ua.sub(t), r));
				}
				t.add(da);
			}
			return t;
		}
		raycast(e, t) {
			let n = this.geometry, r = this.material, i = this.matrixWorld;
			r !== void 0 && (n.boundingSphere === null && n.computeBoundingSphere(), aa.copy(n.boundingSphere), aa.applyMatrix4(i), ia.copy(e.ray).recast(e.near), !(aa.containsPoint(ia.origin) === !1 && (ia.intersectSphere(aa, oa) === null || ia.origin.distanceToSquared(oa) > (e.far - e.near) ** 2)) && (ra.copy(i).invert(), ia.copy(e.ray).applyMatrix4(ra), (n.boundingBox === null || ia.intersectsBox(n.boundingBox) !== !1) && this._computeIntersections(e, t, ia)));
		}
		_computeIntersections(e, t, n) {
			let r, i = this.geometry, a = this.material, o = i.index, s = i.attributes.position, c = i.attributes.uv, l = i.attributes.uv1, u = i.attributes.normal, d = i.groups, f = i.drawRange;
			if (o !== null) {
				if (Array.isArray(a)) for (let i = 0, s = d.length; i < s; i++) {
					let s = d[i], p = a[s.materialIndex], m = Math.max(s.start, f.start), h = Math.min(o.count, Math.min(s.start + s.count, f.start + f.count));
					for (let i = m, a = h; i < a; i += 3) {
						let a = o.getX(i), d = o.getX(i + 1), f = o.getX(i + 2);
						r = oe(this, p, e, n, c, l, u, a, d, f), r && (r.faceIndex = Math.floor(i / 3), r.face.materialIndex = s.materialIndex, t.push(r));
					}
				}
				else {
					let i = Math.max(0, f.start), s = Math.min(o.count, f.start + f.count);
					for (let d = i, f = s; d < f; d += 3) {
						let i = o.getX(d), s = o.getX(d + 1), f = o.getX(d + 2);
						r = oe(this, a, e, n, c, l, u, i, s, f), r && (r.faceIndex = Math.floor(d / 3), t.push(r));
					}
				}
			} else if (s !== void 0) {
				if (Array.isArray(a)) for (let i = 0, o = d.length; i < o; i++) {
					let o = d[i], p = a[o.materialIndex], m = Math.max(o.start, f.start), h = Math.min(s.count, Math.min(o.start + o.count, f.start + f.count));
					for (let i = m, a = h; i < a; i += 3) {
						let a = i, s = i + 1, d = i + 2;
						r = oe(this, p, e, n, c, l, u, a, s, d), r && (r.faceIndex = Math.floor(i / 3), r.face.materialIndex = o.materialIndex, t.push(r));
					}
				}
				else {
					let i = Math.max(0, f.start), o = Math.min(s.count, f.start + f.count);
					for (let s = i, d = o; s < d; s += 3) {
						let i = s, o = s + 1, d = s + 2;
						r = oe(this, a, e, n, c, l, u, i, o, d), r && (r.faceIndex = Math.floor(s / 3), t.push(r));
					}
				}
			}
		}
	}, ha = /*@__PURE__*/ new ur(), ga = /*@__PURE__*/ new ur(), _a = /*@__PURE__*/ new ur(), va = /*@__PURE__*/ new ur(), ya = /*@__PURE__*/ new q(), ba = /*@__PURE__*/ new W(), xa = /*@__PURE__*/ new Pi(), Sa = /*@__PURE__*/ new q(), Ca = /*@__PURE__*/ new ta(), wa = class extends ma {
		constructor(e, t) {
			super(e, t), this.isSkinnedMesh = !0, this.type = "SkinnedMesh", this.bindMode = ct, this.bindMatrix = new q(), this.bindMatrixInverse = new q(), this.boundingBox = null, this.boundingSphere = null;
		}
		computeBoundingBox() {
			let e = this.geometry;
			this.boundingBox === null && (this.boundingBox = new ui()), this.boundingBox.makeEmpty();
			let t = e.getAttribute("position");
			for (let e = 0; e < t.count; e++) this.getVertexPosition(e, ba), this.boundingBox.expandByPoint(ba);
		}
		computeBoundingSphere() {
			let e = this.geometry;
			this.boundingSphere === null && (this.boundingSphere = new Pi()), this.boundingSphere.makeEmpty();
			let t = e.getAttribute("position");
			for (let e = 0; e < t.count; e++) this.getVertexPosition(e, ba), this.boundingSphere.expandByPoint(ba);
		}
		copy(e, t) {
			return super.copy(e, t), this.bindMode = e.bindMode, this.bindMatrix.copy(e.bindMatrix), this.bindMatrixInverse.copy(e.bindMatrixInverse), this.skeleton = e.skeleton, e.boundingBox !== null && (this.boundingBox = e.boundingBox.clone()), e.boundingSphere !== null && (this.boundingSphere = e.boundingSphere.clone()), this;
		}
		raycast(e, t) {
			let n = this.material, r = this.matrixWorld;
			n !== void 0 && (this.boundingSphere === null && this.computeBoundingSphere(), xa.copy(this.boundingSphere), xa.applyMatrix4(r), e.ray.intersectsSphere(xa) !== !1 && (Sa.copy(r).invert(), Ca.copy(e.ray).applyMatrix4(Sa), (this.boundingBox === null || Ca.intersectsBox(this.boundingBox) !== !1) && this._computeIntersections(e, t, Ca)));
		}
		getVertexPosition(e, t) {
			return super.getVertexPosition(e, t), this.applyBoneTransform(e, t), t;
		}
		bind(e, t) {
			this.skeleton = e, t === void 0 && (this.updateMatrixWorld(!0), this.skeleton.calculateInverses(), t = this.matrixWorld), this.bindMatrix.copy(t), this.bindMatrixInverse.copy(t).invert();
		}
		pose() {
			this.skeleton.pose();
		}
		normalizeSkinWeights() {
			let e = new ur(), t = this.geometry.attributes.skinWeight;
			for (let n = 0, r = t.count; n < r; n++) {
				e.fromBufferAttribute(t, n);
				let r = 1 / e.manhattanLength();
				r === Infinity ? e.set(1, 0, 0, 0) : e.multiplyScalar(r), t.setXYZW(n, e.x, e.y, e.z, e.w);
			}
		}
		updateMatrixWorld(e) {
			super.updateMatrixWorld(e), this.bindMode === "attached" ? this.bindMatrixInverse.copy(this.matrixWorld).invert() : this.bindMode === "detached" ? this.bindMatrixInverse.copy(this.bindMatrix).invert() : u("SkinnedMesh: Unrecognized bindMode: " + this.bindMode);
		}
		applyBoneTransform(e, t) {
			let n = this.skeleton, r = this.geometry;
			ga.fromBufferAttribute(r.attributes.skinIndex, e), _a.fromBufferAttribute(r.attributes.skinWeight, e), t.isVector4 ? (ha.copy(t), t.set(0, 0, 0, 0)) : (ha.set(...t, 1), t.set(0, 0, 0)), ha.applyMatrix4(this.bindMatrix);
			for (let e = 0; e < 4; e++) {
				let r = _a.getComponent(e);
				if (r !== 0) {
					let i = ga.getComponent(e);
					ya.multiplyMatrices(n.bones[i].matrixWorld, n.boneInverses[i]), t.addScaledVector(va.copy(ha).applyMatrix4(ya), r);
				}
			}
			return t.isVector4 && (t.w = ha.w), t.applyMatrix4(this.bindMatrixInverse);
		}
	}, Ta = class extends Vr {
		constructor() {
			super(), this.isBone = !0, this.type = "Bone";
		}
	}, Ea = class extends lr {
		constructor(e = null, t = 1, n = 1, r, i, a, o, s, c = ft, l = ft, u, d) {
			super(null, a, o, s, c, l, r, i, u, d), this.isDataTexture = !0, this.image = {
				data: e,
				width: t,
				height: n
			}, this.generateMipmaps = !1, this.flipY = !1, this.unpackAlignment = 1;
		}
	}, Da = /*@__PURE__*/ new q(), Oa = /*@__PURE__*/ new q(), ka = class e {
		constructor(e = [], t = []) {
			this.uuid = m(), this.bones = e.slice(0), this.boneInverses = t, this.boneMatrices = null, this.boneTexture = null, this.init();
		}
		init() {
			let e = this.bones, t = this.boneInverses;
			if (this.boneMatrices = new Float32Array(e.length * 16), t.length === 0) this.calculateInverses();
			else if (e.length !== t.length) {
				u("Skeleton: Number of inverse bone matrices does not match amount of bones."), this.boneInverses = [];
				for (let e = 0, t = this.bones.length; e < t; e++) this.boneInverses.push(new q());
			}
		}
		calculateInverses() {
			this.boneInverses.length = 0;
			for (let e = 0, t = this.bones.length; e < t; e++) {
				let t = new q();
				this.bones[e] && t.copy(this.bones[e].matrixWorld).invert(), this.boneInverses.push(t);
			}
		}
		pose() {
			for (let e = 0, t = this.bones.length; e < t; e++) {
				let t = this.bones[e];
				t && t.matrixWorld.copy(this.boneInverses[e]).invert();
			}
			for (let e = 0, t = this.bones.length; e < t; e++) {
				let t = this.bones[e];
				t && (t.parent && t.parent.isBone ? (t.matrix.copy(t.parent.matrixWorld).invert(), t.matrix.multiply(t.matrixWorld)) : t.matrix.copy(t.matrixWorld), t.matrix.decompose(t.position, t.quaternion, t.scale));
			}
		}
		update() {
			let e = this.bones, t = this.boneInverses, n = this.boneMatrices, r = this.boneTexture;
			for (let r = 0, i = e.length; r < i; r++) {
				let i = e[r] ? e[r].matrixWorld : Oa;
				Da.multiplyMatrices(i, t[r]), Da.toArray(n, r * 16);
			}
			r !== null && (r.needsUpdate = !0);
		}
		clone() {
			return new e(this.bones, this.boneInverses);
		}
		computeBoneTexture() {
			let e = Math.sqrt(this.bones.length * 4);
			e = Math.ceil(e / 4) * 4, e = Math.max(e, 4);
			let t = new Float32Array(e * e * 4);
			t.set(this.boneMatrices);
			let n = new Ea(t, e, e, Nt, wt);
			return n.needsUpdate = !0, this.boneMatrices = t, this.boneTexture = n, this;
		}
		getBoneByName(e) {
			for (let t = 0, n = this.bones.length; t < n; t++) {
				let n = this.bones[t];
				if (n.name === e) return n;
			}
		}
		dispose() {
			this.boneTexture !== null && (this.boneTexture.dispose(), this.boneTexture = null);
		}
		fromJSON(e, t) {
			this.uuid = e.uuid;
			for (let n = 0, r = e.bones.length; n < r; n++) {
				let r = e.bones[n], i = t[r];
				i === void 0 && (u("Skeleton: No bone found with UUID:", r), i = new Ta()), this.bones.push(i), this.boneInverses.push(new q().fromArray(e.boneInverses[n]));
			}
			return this.init(), this;
		}
		toJSON() {
			let e = {
				metadata: {
					version: 4.7,
					type: "Skeleton",
					generator: "Skeleton.toJSON"
				},
				bones: [],
				boneInverses: []
			};
			e.uuid = this.uuid;
			let t = this.bones, n = this.boneInverses;
			for (let r = 0, i = t.length; r < i; r++) {
				let i = t[r];
				e.bones.push(i.uuid);
				let a = n[r];
				e.boneInverses.push(a.toArray());
			}
			return e;
		}
	}, Aa = class extends Di {
		constructor(e, t, n, r = 1) {
			super(e, t, n), this.isInstancedBufferAttribute = !0, this.meshPerAttribute = r;
		}
		copy(e) {
			return super.copy(e), this.meshPerAttribute = e.meshPerAttribute, this;
		}
		toJSON() {
			let e = super.toJSON();
			return e.meshPerAttribute = this.meshPerAttribute, e.isInstancedBufferAttribute = !0, e;
		}
	}, ja = /*@__PURE__*/ new q(), Ma = /*@__PURE__*/ new q(), Na = [], Pa = /*@__PURE__*/ new ui(), Fa = /*@__PURE__*/ new q(), Ia = /*@__PURE__*/ new ma(), La = /*@__PURE__*/ new Pi(), Ra = class extends ma {
		constructor(e, t, n) {
			super(e, t), this.isInstancedMesh = !0, this.instanceMatrix = new Aa(new Float32Array(n * 16), 16), this.instanceColor = null, this.morphTexture = null, this.count = n, this.boundingBox = null, this.boundingSphere = null;
			for (let e = 0; e < n; e++) this.setMatrixAt(e, Fa);
		}
		computeBoundingBox() {
			let e = this.geometry, t = this.count;
			this.boundingBox === null && (this.boundingBox = new ui()), e.boundingBox === null && e.computeBoundingBox(), this.boundingBox.makeEmpty();
			for (let n = 0; n < t; n++) this.getMatrixAt(n, ja), Pa.copy(e.boundingBox).applyMatrix4(ja), this.boundingBox.union(Pa);
		}
		computeBoundingSphere() {
			let e = this.geometry, t = this.count;
			this.boundingSphere === null && (this.boundingSphere = new Pi()), e.boundingSphere === null && e.computeBoundingSphere(), this.boundingSphere.makeEmpty();
			for (let n = 0; n < t; n++) this.getMatrixAt(n, ja), La.copy(e.boundingSphere).applyMatrix4(ja), this.boundingSphere.union(La);
		}
		copy(e, t) {
			return super.copy(e, t), this.instanceMatrix.copy(e.instanceMatrix), e.morphTexture !== null && (this.morphTexture = e.morphTexture.clone()), e.instanceColor !== null && (this.instanceColor = e.instanceColor.clone()), this.count = e.count, e.boundingBox !== null && (this.boundingBox = e.boundingBox.clone()), e.boundingSphere !== null && (this.boundingSphere = e.boundingSphere.clone()), this;
		}
		getColorAt(e, t) {
			return this.instanceColor === null ? t.setRGB(1, 1, 1) : t.fromArray(this.instanceColor.array, e * 3);
		}
		getMatrixAt(e, t) {
			return t.fromArray(this.instanceMatrix.array, e * 16);
		}
		getMorphAt(e, t) {
			let n = t.morphTargetInfluences, r = this.morphTexture.source.data.data, i = e * (n.length + 1) + 1;
			for (let e = 0; e < n.length; e++) n[e] = r[i + e];
		}
		raycast(e, t) {
			let n = this.matrixWorld, r = this.count;
			if (Ia.geometry = this.geometry, Ia.material = this.material, Ia.material !== void 0 && (this.boundingSphere === null && this.computeBoundingSphere(), La.copy(this.boundingSphere), La.applyMatrix4(n), e.ray.intersectsSphere(La) !== !1)) for (let i = 0; i < r; i++) {
				this.getMatrixAt(i, ja), Ma.multiplyMatrices(n, ja), Ia.matrixWorld = Ma, Ia.raycast(e, Na);
				for (let e = 0, n = Na.length; e < n; e++) {
					let n = Na[e];
					n.instanceId = i, n.object = this, t.push(n);
				}
				Na.length = 0;
			}
		}
		setColorAt(e, t) {
			return this.instanceColor === null && (this.instanceColor = new Aa(new Float32Array(this.instanceMatrix.count * 3).fill(1), 3)), t.toArray(this.instanceColor.array, e * 3), this;
		}
		setMatrixAt(e, t) {
			return t.toArray(this.instanceMatrix.array, e * 16), this;
		}
		setMorphAt(e, t) {
			let n = t.morphTargetInfluences, r = n.length + 1;
			this.morphTexture === null && (this.morphTexture = new Ea(new Float32Array(r * this.count), r, this.count, It, wt));
			let i = this.morphTexture.source.data.data, a = 0;
			for (let e = 0; e < n.length; e++) a += n[e];
			let o = this.geometry.morphTargetsRelative ? 1 : 1 - a, s = r * e;
			return i[s] = o, i.set(n, s + 1), this;
		}
		updateMorphTargets() {}
		dispose() {
			this.dispatchEvent({ type: "dispose" }), this.morphTexture !== null && (this.morphTexture.dispose(), this.morphTexture = null);
		}
	}, za = /*@__PURE__*/ new W(), Ba = /*@__PURE__*/ new W(), Va = /*@__PURE__*/ new G(), Ha = class {
		constructor(e = new W(1, 0, 0), t = 0) {
			this.isPlane = !0, this.normal = e, this.constant = t;
		}
		set(e, t) {
			return this.normal.copy(e), this.constant = t, this;
		}
		setComponents(e, t, n, r) {
			return this.normal.set(e, t, n), this.constant = r, this;
		}
		setFromNormalAndCoplanarPoint(e, t) {
			return this.normal.copy(e), this.constant = -t.dot(this.normal), this;
		}
		setFromCoplanarPoints(e, t, n) {
			let r = za.subVectors(n, t).cross(Ba.subVectors(e, t)).normalize();
			return this.setFromNormalAndCoplanarPoint(r, e), this;
		}
		copy(e) {
			return this.normal.copy(e.normal), this.constant = e.constant, this;
		}
		normalize() {
			let e = 1 / this.normal.length();
			return this.normal.multiplyScalar(e), this.constant *= e, this;
		}
		negate() {
			return this.constant *= -1, this.normal.negate(), this;
		}
		distanceToPoint(e) {
			return this.normal.dot(e) + this.constant;
		}
		distanceToSphere(e) {
			return this.distanceToPoint(e.center) - e.radius;
		}
		projectPoint(e, t) {
			return t.copy(e).addScaledVector(this.normal, -this.distanceToPoint(e));
		}
		intersectLine(e, t, n = !0) {
			let r = e.delta(za), i = this.normal.dot(r);
			if (i === 0) return this.distanceToPoint(e.start) === 0 ? t.copy(e.start) : null;
			let a = -(e.start.dot(this.normal) + this.constant) / i;
			return n === !0 && (a < 0 || a > 1) ? null : t.copy(e.start).addScaledVector(r, a);
		}
		intersectsLine(e) {
			let t = this.distanceToPoint(e.start), n = this.distanceToPoint(e.end);
			return t < 0 && n > 0 || n < 0 && t > 0;
		}
		intersectsBox(e) {
			return e.intersectsPlane(this);
		}
		intersectsSphere(e) {
			return e.intersectsPlane(this);
		}
		coplanarPoint(e) {
			return e.copy(this.normal).multiplyScalar(-this.constant);
		}
		applyMatrix4(e, t) {
			let n = t || Va.getNormalMatrix(e), r = this.coplanarPoint(za).applyMatrix4(e), i = this.normal.applyMatrix3(n).normalize();
			return this.constant = -r.dot(i), this;
		}
		translate(e) {
			return this.constant -= e.dot(this.normal), this;
		}
		equals(e) {
			return e.normal.equals(this.normal) && e.constant === this.constant;
		}
		clone() {
			return new this.constructor().copy(this);
		}
	}, Ua = /*@__PURE__*/ new Pi(), Wa = /*@__PURE__*/ new U(.5, .5), Ga = /*@__PURE__*/ new W(), Ka = class {
		constructor(e = new Ha(), t = new Ha(), n = new Ha(), r = new Ha(), i = new Ha(), a = new Ha()) {
			this.planes = [
				e,
				t,
				n,
				r,
				i,
				a
			];
		}
		set(e, t, n, r, i, a) {
			let o = this.planes;
			return o[0].copy(e), o[1].copy(t), o[2].copy(n), o[3].copy(r), o[4].copy(i), o[5].copy(a), this;
		}
		copy(e) {
			let t = this.planes;
			for (let n = 0; n < 6; n++) t[n].copy(e.planes[n]);
			return this;
		}
		setFromProjectionMatrix(e, t = Vn, n = !1) {
			let r = this.planes, i = e.elements, a = i[0], o = i[1], s = i[2], c = i[3], l = i[4], u = i[5], d = i[6], f = i[7], p = i[8], m = i[9], h = i[10], g = i[11], _ = i[12], v = i[13], y = i[14], b = i[15];
			if (r[0].setComponents(c - a, f - l, g - p, b - _).normalize(), r[1].setComponents(c + a, f + l, g + p, b + _).normalize(), r[2].setComponents(c + o, f + u, g + m, b + v).normalize(), r[3].setComponents(c - o, f - u, g - m, b - v).normalize(), n) r[4].setComponents(s, d, h, y).normalize(), r[5].setComponents(c - s, f - d, g - h, b - y).normalize();
			else if (r[4].setComponents(c - s, f - d, g - h, b - y).normalize(), t === 2e3) r[5].setComponents(c + s, f + d, g + h, b + y).normalize();
			else if (t === 2001) r[5].setComponents(s, d, h, y).normalize();
			else throw Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: " + t);
			return this;
		}
		intersectsObject(e) {
			if (e.boundingSphere !== void 0) e.boundingSphere === null && e.computeBoundingSphere(), Ua.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);
			else {
				let t = e.geometry;
				t.boundingSphere === null && t.computeBoundingSphere(), Ua.copy(t.boundingSphere).applyMatrix4(e.matrixWorld);
			}
			return this.intersectsSphere(Ua);
		}
		intersectsSprite(e) {
			Ua.center.set(0, 0, 0);
			let t = Wa.distanceTo(e.center);
			return Ua.radius = .7071067811865476 + t, Ua.applyMatrix4(e.matrixWorld), this.intersectsSphere(Ua);
		}
		intersectsSphere(e) {
			let t = this.planes, n = e.center, r = -e.radius;
			for (let e = 0; e < 6; e++) if (t[e].distanceToPoint(n) < r) return !1;
			return !0;
		}
		intersectsBox(e) {
			let t = this.planes;
			for (let n = 0; n < 6; n++) {
				let r = t[n];
				if (Ga.x = r.normal.x > 0 ? e.max.x : e.min.x, Ga.y = r.normal.y > 0 ? e.max.y : e.min.y, Ga.z = r.normal.z > 0 ? e.max.z : e.min.z, r.distanceToPoint(Ga) < 0) return !1;
			}
			return !0;
		}
		containsPoint(e) {
			let t = this.planes;
			for (let n = 0; n < 6; n++) if (t[n].distanceToPoint(e) < 0) return !1;
			return !0;
		}
		clone() {
			return new this.constructor().copy(this);
		}
	}, qa = class extends qi {
		constructor(e) {
			super(), this.isLineBasicMaterial = !0, this.type = "LineBasicMaterial", this.color = new J(16777215), this.map = null, this.linewidth = 1, this.linecap = "round", this.linejoin = "round", this.fog = !0, this.setValues(e);
		}
		copy(e) {
			return super.copy(e), this.color.copy(e.color), this.map = e.map, this.linewidth = e.linewidth, this.linecap = e.linecap, this.linejoin = e.linejoin, this.fog = e.fog, this;
		}
	}, Ja = /*@__PURE__*/ new W(), Ya = /*@__PURE__*/ new W(), Xa = /*@__PURE__*/ new q(), Za = /*@__PURE__*/ new ta(), Qa = /*@__PURE__*/ new Pi(), $a = /*@__PURE__*/ new W(), eo = /*@__PURE__*/ new W(), to = class extends Vr {
		constructor(e = new Hi(), t = new qa()) {
			super(), this.isLine = !0, this.type = "Line", this.geometry = e, this.material = t, this.morphTargetDictionary = void 0, this.morphTargetInfluences = void 0, this.updateMorphTargets();
		}
		copy(e, t) {
			return super.copy(e, t), this.material = Array.isArray(e.material) ? e.material.slice() : e.material, this.geometry = e.geometry, this;
		}
		computeLineDistances() {
			let e = this.geometry;
			if (e.index === null) {
				let t = e.attributes.position, n = [0];
				for (let e = 1, r = t.count; e < r; e++) Ja.fromBufferAttribute(t, e - 1), Ya.fromBufferAttribute(t, e), n[e] = n[e - 1], n[e] += Ja.distanceTo(Ya);
				e.setAttribute("lineDistance", new Ai(n, 1));
			} else u("Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");
			return this;
		}
		raycast(e, t) {
			let n = this.geometry, r = this.matrixWorld, i = e.params.Line.threshold, a = n.drawRange;
			if (n.boundingSphere === null && n.computeBoundingSphere(), Qa.copy(n.boundingSphere), Qa.applyMatrix4(r), Qa.radius += i, e.ray.intersectsSphere(Qa) === !1) return;
			Xa.copy(r).invert(), Za.copy(e.ray).applyMatrix4(Xa);
			let o = i / ((this.scale.x + this.scale.y + this.scale.z) / 3), s = o * o, c = this.isLineSegments ? 2 : 1, l = n.index, u = n.attributes.position;
			if (l !== null) {
				let n = Math.max(0, a.start), r = Math.min(l.count, a.start + a.count);
				for (let i = n, a = r - 1; i < a; i += c) {
					let n = l.getX(i), r = l.getX(i + 1), a = se(this, e, Za, s, n, r, i);
					a && t.push(a);
				}
				if (this.isLineLoop) {
					let i = l.getX(r - 1), a = l.getX(n), o = se(this, e, Za, s, i, a, r - 1);
					o && t.push(o);
				}
			} else {
				let n = Math.max(0, a.start), r = Math.min(u.count, a.start + a.count);
				for (let i = n, a = r - 1; i < a; i += c) {
					let n = se(this, e, Za, s, i, i + 1, i);
					n && t.push(n);
				}
				if (this.isLineLoop) {
					let i = se(this, e, Za, s, r - 1, n, r - 1);
					i && t.push(i);
				}
			}
		}
		updateMorphTargets() {
			let e = this.geometry.morphAttributes, t = Object.keys(e);
			if (t.length > 0) {
				let n = e[t[0]];
				if (n !== void 0) {
					this.morphTargetInfluences = [], this.morphTargetDictionary = {};
					for (let e = 0, t = n.length; e < t; e++) {
						let t = n[e].name || String(e);
						this.morphTargetInfluences.push(0), this.morphTargetDictionary[t] = e;
					}
				}
			}
		}
	}, no = /*@__PURE__*/ new W(), ro = /*@__PURE__*/ new W(), io = class extends to {
		constructor(e, t) {
			super(e, t), this.isLineSegments = !0, this.type = "LineSegments";
		}
		computeLineDistances() {
			let e = this.geometry;
			if (e.index === null) {
				let t = e.attributes.position, n = [];
				for (let e = 0, r = t.count; e < r; e += 2) no.fromBufferAttribute(t, e), ro.fromBufferAttribute(t, e + 1), n[e] = e === 0 ? 0 : n[e - 1], n[e + 1] = n[e] + no.distanceTo(ro);
				e.setAttribute("lineDistance", new Ai(n, 1));
			} else u("LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");
			return this;
		}
	}, ao = class extends to {
		constructor(e, t) {
			super(e, t), this.isLineLoop = !0, this.type = "LineLoop";
		}
	}, oo = class extends qi {
		constructor(e) {
			super(), this.isPointsMaterial = !0, this.type = "PointsMaterial", this.color = new J(16777215), this.map = null, this.alphaMap = null, this.size = 1, this.sizeAttenuation = !0, this.fog = !0, this.setValues(e);
		}
		copy(e) {
			return super.copy(e), this.color.copy(e.color), this.map = e.map, this.alphaMap = e.alphaMap, this.size = e.size, this.sizeAttenuation = e.sizeAttenuation, this.fog = e.fog, this;
		}
	}, so = /*@__PURE__*/ new q(), co = /*@__PURE__*/ new ta(), lo = /*@__PURE__*/ new Pi(), uo = /*@__PURE__*/ new W(), fo = class extends Vr {
		constructor(e = new Hi(), t = new oo()) {
			super(), this.isPoints = !0, this.type = "Points", this.geometry = e, this.material = t, this.morphTargetDictionary = void 0, this.morphTargetInfluences = void 0, this.updateMorphTargets();
		}
		copy(e, t) {
			return super.copy(e, t), this.material = Array.isArray(e.material) ? e.material.slice() : e.material, this.geometry = e.geometry, this;
		}
		raycast(e, t) {
			let n = this.geometry, r = this.matrixWorld, i = e.params.Points.threshold, a = n.drawRange;
			if (n.boundingSphere === null && n.computeBoundingSphere(), lo.copy(n.boundingSphere), lo.applyMatrix4(r), lo.radius += i, e.ray.intersectsSphere(lo) === !1) return;
			so.copy(r).invert(), co.copy(e.ray).applyMatrix4(so);
			let o = i / ((this.scale.x + this.scale.y + this.scale.z) / 3), s = o * o, c = n.index, l = n.attributes.position;
			if (c !== null) {
				let n = Math.max(0, a.start), i = Math.min(c.count, a.start + a.count);
				for (let a = n, o = i; a < o; a++) {
					let n = c.getX(a);
					uo.fromBufferAttribute(l, n), ce(uo, n, s, r, e, t, this);
				}
			} else {
				let n = Math.max(0, a.start), i = Math.min(l.count, a.start + a.count);
				for (let a = n, o = i; a < o; a++) uo.fromBufferAttribute(l, a), ce(uo, a, s, r, e, t, this);
			}
		}
		updateMorphTargets() {
			let e = this.geometry.morphAttributes, t = Object.keys(e);
			if (t.length > 0) {
				let n = e[t[0]];
				if (n !== void 0) {
					this.morphTargetInfluences = [], this.morphTargetDictionary = {};
					for (let e = 0, t = n.length; e < t; e++) {
						let t = n[e].name || String(e);
						this.morphTargetInfluences.push(0), this.morphTargetDictionary[t] = e;
					}
				}
			}
		}
	}, po = class extends lr {
		constructor(e = [], t = 301, n, r, i, a, o, s, c, l) {
			super(e, t, n, r, i, a, o, s, c, l), this.isCubeTexture = !0, this.flipY = !1;
		}
		get images() {
			return this.image;
		}
		set images(e) {
			this.image = e;
		}
	}, mo = class extends lr {
		constructor(e, t, n = Ct, r, i, a, o = ft, s = ft, c, l = Pt, u = 1) {
			if (l !== 1026 && l !== 1027) throw Error("THREE.DepthTexture: format must be either THREE.DepthFormat or THREE.DepthStencilFormat");
			super({
				width: e,
				height: t,
				depth: u
			}, r, i, a, o, s, l, n, c), this.isDepthTexture = !0, this.flipY = !1, this.generateMipmaps = !1, this.compareFunction = null;
		}
		copy(e) {
			return super.copy(e), this.source = new or(Object.assign({}, e.image)), this.compareFunction = e.compareFunction, this;
		}
		toJSON(e) {
			let t = super.toJSON(e);
			return this.compareFunction !== null && (t.compareFunction = this.compareFunction), t;
		}
	}, ho = class extends mo {
		constructor(e, t = Ct, n = 301, r, i, a = ft, o = ft, s, c = Pt) {
			let l = {
				width: e,
				height: e,
				depth: 1
			}, u = [
				l,
				l,
				l,
				l,
				l,
				l
			];
			super(e, e, t, n, r, i, a, o, s, c), this.image = u, this.isCubeDepthTexture = !0, this.isCubeTexture = !0;
		}
		get images() {
			return this.image;
		}
		set images(e) {
			this.image = e;
		}
	}, go = class extends lr {
		constructor(e = null) {
			super(), this.sourceTexture = e, this.isExternalTexture = !0;
		}
		copy(e) {
			return super.copy(e), this.sourceTexture = e.sourceTexture, this;
		}
	}, _o = class e extends Hi {
		constructor(e = 1, t = 1, n = 1, r = 1, i = 1, a = 1) {
			super(), this.type = "BoxGeometry", this.parameters = {
				width: e,
				height: t,
				depth: n,
				widthSegments: r,
				heightSegments: i,
				depthSegments: a
			};
			let o = this;
			r = Math.floor(r), i = Math.floor(i), a = Math.floor(a);
			let s = [], c = [], l = [], u = [], d = 0, f = 0;
			p("z", "y", "x", -1, -1, n, t, e, a, i, 0), p("z", "y", "x", 1, -1, n, t, -e, a, i, 1), p("x", "z", "y", 1, 1, e, n, t, r, a, 2), p("x", "z", "y", 1, -1, e, n, -t, r, a, 3), p("x", "y", "z", 1, -1, e, t, n, r, i, 4), p("x", "y", "z", -1, -1, e, t, -n, r, i, 5), this.setIndex(s), this.setAttribute("position", new Ai(c, 3)), this.setAttribute("normal", new Ai(l, 3)), this.setAttribute("uv", new Ai(u, 2));
			function p(e, t, n, r, i, a, p, m, h, g, _) {
				let v = a / h, y = p / g, b = a / 2, x = p / 2, S = m / 2, C = h + 1, w = g + 1, T = 0, E = 0, D = new W();
				for (let a = 0; a < w; a++) {
					let o = a * y - x;
					for (let s = 0; s < C; s++) D[e] = (s * v - b) * r, D[t] = o * i, D[n] = S, c.push(D.x, D.y, D.z), D[e] = 0, D[t] = 0, D[n] = m > 0 ? 1 : -1, l.push(D.x, D.y, D.z), u.push(s / h), u.push(1 - a / g), T += 1;
				}
				for (let e = 0; e < g; e++) for (let t = 0; t < h; t++) {
					let n = d + t + C * e, r = d + t + C * (e + 1), i = d + (t + 1) + C * (e + 1), a = d + (t + 1) + C * e;
					s.push(n, r, a), s.push(r, i, a), E += 6;
				}
				o.addGroup(f, E, _), f += E, d += T;
			}
		}
		copy(e) {
			return super.copy(e), this.parameters = Object.assign({}, e.parameters), this;
		}
		static fromJSON(t) {
			return new e(t.width, t.height, t.depth, t.widthSegments, t.heightSegments, t.depthSegments);
		}
	}, vo = class e extends Hi {
		constructor(e = 1, t = 1, n = 4, r = 8, i = 1) {
			super(), this.type = "CapsuleGeometry", this.parameters = {
				radius: e,
				height: t,
				capSegments: n,
				radialSegments: r,
				heightSegments: i
			}, t = Math.max(0, t), n = Math.max(1, Math.floor(n)), r = Math.max(3, Math.floor(r)), i = Math.max(1, Math.floor(i));
			let a = [], o = [], s = [], c = [], l = t / 2, u = Math.PI / 2 * e, d = t, f = 2 * u + d, p = n * 2 + i, m = r + 1, h = new W(), g = new W();
			for (let _ = 0; _ <= p; _++) {
				let v = 0, y = 0, b = 0, x = 0;
				if (_ <= n) {
					let t = _ / n, r = t * Math.PI / 2;
					y = -l - e * Math.cos(r), b = e * Math.sin(r), x = -e * Math.cos(r), v = t * u;
				} else if (_ <= n + i) {
					let r = (_ - n) / i;
					y = -l + r * t, b = e, x = 0, v = u + r * d;
				} else {
					let t = (_ - n - i) / n, r = t * Math.PI / 2;
					y = l + e * Math.sin(r), b = e * Math.cos(r), x = e * Math.sin(r), v = u + d + t * u;
				}
				let S = Math.max(0, Math.min(1, v / f)), C = 0;
				_ === 0 ? C = .5 / r : _ === p && (C = -.5 / r);
				for (let e = 0; e <= r; e++) {
					let t = e / r, n = t * Math.PI * 2, i = Math.sin(n), a = Math.cos(n);
					g.x = -b * a, g.y = y, g.z = b * i, o.push(g.x, g.y, g.z), h.set(-b * a, x, b * i), h.normalize(), s.push(h.x, h.y, h.z), c.push(t + C, S);
				}
				if (_ > 0) {
					let e = (_ - 1) * m;
					for (let t = 0; t < r; t++) {
						let n = e + t, r = e + t + 1, i = _ * m + t, o = _ * m + t + 1;
						a.push(n, r, i), a.push(r, o, i);
					}
				}
			}
			this.setIndex(a), this.setAttribute("position", new Ai(o, 3)), this.setAttribute("normal", new Ai(s, 3)), this.setAttribute("uv", new Ai(c, 2));
		}
		copy(e) {
			return super.copy(e), this.parameters = Object.assign({}, e.parameters), this;
		}
		static fromJSON(t) {
			return new e(t.radius, t.height, t.capSegments, t.radialSegments, t.heightSegments);
		}
	}, yo = class e extends Hi {
		constructor(e = 1, t = 1, n = 1, r = 32, i = 1, a = !1, o = 0, s = Math.PI * 2) {
			super(), this.type = "CylinderGeometry", this.parameters = {
				radiusTop: e,
				radiusBottom: t,
				height: n,
				radialSegments: r,
				heightSegments: i,
				openEnded: a,
				thetaStart: o,
				thetaLength: s
			};
			let c = this;
			r = Math.floor(r), i = Math.floor(i);
			let l = [], u = [], d = [], f = [], p = 0, m = [], h = n / 2, g = 0;
			_(), a === !1 && (e > 0 && v(!0), t > 0 && v(!1)), this.setIndex(l), this.setAttribute("position", new Ai(u, 3)), this.setAttribute("normal", new Ai(d, 3)), this.setAttribute("uv", new Ai(f, 2));
			function _() {
				let a = new W(), _ = new W(), v = 0, y = (t - e) / n;
				for (let c = 0; c <= i; c++) {
					let l = [], g = c / i, v = g * (t - e) + e;
					for (let e = 0; e <= r; e++) {
						let t = e / r, i = t * s + o, c = Math.sin(i), m = Math.cos(i);
						_.x = v * c, _.y = -g * n + h, _.z = v * m, u.push(_.x, _.y, _.z), a.set(c, y, m).normalize(), d.push(a.x, a.y, a.z), f.push(t, 1 - g), l.push(p++);
					}
					m.push(l);
				}
				for (let n = 0; n < r; n++) for (let r = 0; r < i; r++) {
					let a = m[r][n], o = m[r + 1][n], s = m[r + 1][n + 1], c = m[r][n + 1];
					(e > 0 || r !== 0) && (l.push(a, o, c), v += 3), (t > 0 || r !== i - 1) && (l.push(o, s, c), v += 3);
				}
				c.addGroup(g, v, 0), g += v;
			}
			function v(n) {
				let i = p, a = new U(), m = new W(), _ = 0, v = n === !0 ? e : t, y = n === !0 ? 1 : -1;
				for (let e = 1; e <= r; e++) u.push(0, h * y, 0), d.push(0, y, 0), f.push(.5, .5), p++;
				let b = p;
				for (let e = 0; e <= r; e++) {
					let t = e / r * s + o, n = Math.cos(t), i = Math.sin(t);
					m.x = v * i, m.y = h * y, m.z = v * n, u.push(m.x, m.y, m.z), d.push(0, y, 0), a.x = n * .5 + .5, a.y = i * .5 * y + .5, f.push(a.x, a.y), p++;
				}
				for (let e = 0; e < r; e++) {
					let t = i + e, r = b + e;
					n === !0 ? l.push(r, r + 1, t) : l.push(r + 1, r, t), _ += 3;
				}
				c.addGroup(g, _, n === !0 ? 1 : 2), g += _;
			}
		}
		copy(e) {
			return super.copy(e), this.parameters = Object.assign({}, e.parameters), this;
		}
		static fromJSON(t) {
			return new e(t.radiusTop, t.radiusBottom, t.height, t.radialSegments, t.heightSegments, t.openEnded, t.thetaStart, t.thetaLength);
		}
	}, bo = class e extends yo {
		constructor(e = 1, t = 1, n = 32, r = 1, i = !1, a = 0, o = Math.PI * 2) {
			super(0, e, t, n, r, i, a, o), this.type = "ConeGeometry", this.parameters = {
				radius: e,
				height: t,
				radialSegments: n,
				heightSegments: r,
				openEnded: i,
				thetaStart: a,
				thetaLength: o
			};
		}
		static fromJSON(t) {
			return new e(t.radius, t.height, t.radialSegments, t.heightSegments, t.openEnded, t.thetaStart, t.thetaLength);
		}
	}, xo = class {
		constructor() {
			this.type = "Curve", this.arcLengthDivisions = 200, this.needsUpdate = !1, this.cacheArcLengths = null;
		}
		getPoint() {
			u("Curve: .getPoint() not implemented.");
		}
		getPointAt(e, t) {
			let n = this.getUtoTmapping(e);
			return this.getPoint(n, t);
		}
		getPoints(e = 5) {
			let t = [];
			for (let n = 0; n <= e; n++) t.push(this.getPoint(n / e));
			return t;
		}
		getSpacedPoints(e = 5) {
			let t = [];
			for (let n = 0; n <= e; n++) t.push(this.getPointAt(n / e));
			return t;
		}
		getLength() {
			let e = this.getLengths();
			return e[e.length - 1];
		}
		getLengths(e = this.arcLengthDivisions) {
			if (this.cacheArcLengths && this.cacheArcLengths.length === e + 1 && !this.needsUpdate) return this.cacheArcLengths;
			this.needsUpdate = !1;
			let t = [], n, r = this.getPoint(0), i = 0;
			t.push(0);
			for (let a = 1; a <= e; a++) n = this.getPoint(a / e), i += n.distanceTo(r), t.push(i), r = n;
			return this.cacheArcLengths = t, t;
		}
		updateArcLengths() {
			this.needsUpdate = !0, this.getLengths();
		}
		getUtoTmapping(e, t = null) {
			let n = this.getLengths(), r = 0, i = n.length, a;
			a = t || e * n[i - 1];
			let o = 0, s = i - 1, c;
			for (; o <= s;) if (r = Math.floor(o + (s - o) / 2), c = n[r] - a, c < 0) o = r + 1;
			else if (c > 0) s = r - 1;
			else {
				s = r;
				break;
			}
			if (r = s, n[r] === a) return r / (i - 1);
			let l = n[r], u = n[r + 1] - l, d = (a - l) / u;
			return (r + d) / (i - 1);
		}
		getTangent(e, t) {
			let n = 1e-4, r = e - n, i = e + n;
			r < 0 && (r = 0), i > 1 && (i = 1);
			let a = this.getPoint(r), o = this.getPoint(i), s = t || (a.isVector2 ? new U() : new W());
			return s.copy(o).sub(a).normalize(), s;
		}
		getTangentAt(e, t) {
			let n = this.getUtoTmapping(e);
			return this.getTangent(n, t);
		}
		computeFrenetFrames(e, t = !1) {
			let n = new W(), r = [], i = [], a = [], o = new W(), s = new q();
			for (let t = 0; t <= e; t++) {
				let n = t / e;
				r[t] = this.getTangentAt(n, new W());
			}
			i[0] = new W(), a[0] = new W();
			let c = Number.MAX_VALUE, l = Math.abs(r[0].x), u = Math.abs(r[0].y), d = Math.abs(r[0].z);
			l <= c && (c = l, n.set(1, 0, 0)), u <= c && (c = u, n.set(0, 1, 0)), d <= c && n.set(0, 0, 1), o.crossVectors(r[0], n).normalize(), i[0].crossVectors(r[0], o), a[0].crossVectors(r[0], i[0]);
			for (let t = 1; t <= e; t++) {
				if (i[t] = i[t - 1].clone(), a[t] = a[t - 1].clone(), o.crossVectors(r[t - 1], r[t]), o.length() > 2 ** -52) {
					o.normalize();
					let e = Math.acos(h(r[t - 1].dot(r[t]), -1, 1));
					i[t].applyMatrix4(s.makeRotationAxis(o, e));
				}
				a[t].crossVectors(r[t], i[t]);
			}
			if (t === !0) {
				let t = Math.acos(h(i[0].dot(i[e]), -1, 1));
				t /= e, r[0].dot(o.crossVectors(i[0], i[e])) > 0 && (t = -t);
				for (let n = 1; n <= e; n++) i[n].applyMatrix4(s.makeRotationAxis(r[n], t * n)), a[n].crossVectors(r[n], i[n]);
			}
			return {
				tangents: r,
				normals: i,
				binormals: a
			};
		}
		clone() {
			return new this.constructor().copy(this);
		}
		copy(e) {
			return this.arcLengthDivisions = e.arcLengthDivisions, this;
		}
		toJSON() {
			let e = { metadata: {
				version: 4.7,
				type: "Curve",
				generator: "Curve.toJSON"
			} };
			return e.arcLengthDivisions = this.arcLengthDivisions, e.type = this.type, e;
		}
		fromJSON(e) {
			return this.arcLengthDivisions = e.arcLengthDivisions, this;
		}
	}, So = class {
		static triangulate(e, t, n = 2) {
			return le(e, t, n);
		}
	}, Co = class e {
		static area(e) {
			let t = e.length, n = 0;
			for (let r = t - 1, i = 0; i < t; r = i++) n += e[r].x * e[i].y - e[i].x * e[r].y;
			return n * .5;
		}
		static isClockWise(t) {
			return e.area(t) < 0;
		}
		static triangulateShape(e, t) {
			let n = [], r = [], i = [];
			Le(e), Re(n, e);
			let a = e.length;
			t.forEach(Le);
			for (let e = 0; e < t.length; e++) r.push(a), a += t[e].length, Re(n, t[e]);
			let o = So.triangulate(n, r);
			for (let e = 0; e < o.length; e += 3) i.push(o.slice(e, e + 3));
			return i;
		}
	}, wo = class e extends Hi {
		constructor(e = 1, t = 1, n = 1, r = 1) {
			super(), this.type = "PlaneGeometry", this.parameters = {
				width: e,
				height: t,
				widthSegments: n,
				heightSegments: r
			};
			let i = e / 2, a = t / 2, o = Math.floor(n), s = Math.floor(r), c = o + 1, l = s + 1, u = e / o, d = t / s, f = [], p = [], m = [], h = [];
			for (let e = 0; e < l; e++) {
				let t = e * d - a;
				for (let n = 0; n < c; n++) {
					let r = n * u - i;
					p.push(r, -t, 0), m.push(0, 0, 1), h.push(n / o), h.push(1 - e / s);
				}
			}
			for (let e = 0; e < s; e++) for (let t = 0; t < o; t++) {
				let n = t + c * e, r = t + c * (e + 1), i = t + 1 + c * (e + 1), a = t + 1 + c * e;
				f.push(n, r, a), f.push(r, i, a);
			}
			this.setIndex(f), this.setAttribute("position", new Ai(p, 3)), this.setAttribute("normal", new Ai(m, 3)), this.setAttribute("uv", new Ai(h, 2));
		}
		copy(e) {
			return super.copy(e), this.parameters = Object.assign({}, e.parameters), this;
		}
		static fromJSON(t) {
			return new e(t.width, t.height, t.widthSegments, t.heightSegments);
		}
	}, To = class e extends Hi {
		constructor(e = 1, t = 32, n = 16, r = 0, i = Math.PI * 2, a = 0, o = Math.PI) {
			super(), this.type = "SphereGeometry", this.parameters = {
				radius: e,
				widthSegments: t,
				heightSegments: n,
				phiStart: r,
				phiLength: i,
				thetaStart: a,
				thetaLength: o
			}, t = Math.max(3, Math.floor(t)), n = Math.max(2, Math.floor(n));
			let s = Math.min(a + o, Math.PI), c = 0, l = [], u = new W(), d = new W(), f = [], p = [], m = [], h = [];
			for (let f = 0; f <= n; f++) {
				let g = [], _ = f / n, v = a + _ * o, y = e * Math.cos(v), b = Math.sqrt(e * e - y * y), x = 0;
				f === 0 && a === 0 ? x = .5 / t : f === n && s === Math.PI && (x = -.5 / t);
				for (let e = 0; e <= t; e++) {
					let n = e / t, a = r + n * i;
					u.x = -b * Math.cos(a), u.y = y, u.z = b * Math.sin(a), p.push(u.x, u.y, u.z), d.copy(u).normalize(), m.push(d.x, d.y, d.z), h.push(n + x, 1 - _), g.push(c++);
				}
				l.push(g);
			}
			for (let e = 0; e < n; e++) for (let r = 0; r < t; r++) {
				let t = l[e][r + 1], i = l[e][r], o = l[e + 1][r], c = l[e + 1][r + 1];
				(e !== 0 || a > 0) && f.push(t, i, c), (e !== n - 1 || s < Math.PI) && f.push(i, o, c);
			}
			this.setIndex(f), this.setAttribute("position", new Ai(p, 3)), this.setAttribute("normal", new Ai(m, 3)), this.setAttribute("uv", new Ai(h, 2));
		}
		copy(e) {
			return super.copy(e), this.parameters = Object.assign({}, e.parameters), this;
		}
		static fromJSON(t) {
			return new e(t.radius, t.widthSegments, t.heightSegments, t.phiStart, t.phiLength, t.thetaStart, t.thetaLength);
		}
	}, Eo = {
		clone: ze,
		merge: Be
	}, Do = "void main() {\n	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n}", Oo = "void main() {\n	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );\n}", ko = class extends qi {
		constructor(e) {
			super(), this.isShaderMaterial = !0, this.type = "ShaderMaterial", this.defines = {}, this.uniforms = {}, this.uniformsGroups = [], this.vertexShader = Do, this.fragmentShader = Oo, this.linewidth = 1, this.wireframe = !1, this.wireframeLinewidth = 1, this.fog = !1, this.lights = !1, this.clipping = !1, this.forceSinglePass = !0, this.extensions = {
				clipCullDistance: !1,
				multiDraw: !1
			}, this.defaultAttributeValues = {
				color: [
					1,
					1,
					1
				],
				uv: [0, 0],
				uv1: [0, 0]
			}, this.index0AttributeName = void 0, this.uniformsNeedUpdate = !1, this.glslVersion = null, e !== void 0 && this.setValues(e);
		}
		copy(e) {
			return super.copy(e), this.fragmentShader = e.fragmentShader, this.vertexShader = e.vertexShader, this.uniforms = ze(e.uniforms), this.uniformsGroups = He(e.uniformsGroups), this.defines = Object.assign({}, e.defines), this.wireframe = e.wireframe, this.wireframeLinewidth = e.wireframeLinewidth, this.fog = e.fog, this.lights = e.lights, this.clipping = e.clipping, this.extensions = Object.assign({}, e.extensions), this.glslVersion = e.glslVersion, this.defaultAttributeValues = Object.assign({}, e.defaultAttributeValues), this.index0AttributeName = e.index0AttributeName, this.uniformsNeedUpdate = e.uniformsNeedUpdate, this;
		}
		toJSON(e) {
			let t = super.toJSON(e);
			t.glslVersion = this.glslVersion, t.uniforms = {};
			for (let n in this.uniforms) {
				let r = this.uniforms[n].value;
				r && r.isTexture ? t.uniforms[n] = {
					type: "t",
					value: r.toJSON(e).uuid
				} : r && r.isColor ? t.uniforms[n] = {
					type: "c",
					value: r.getHex()
				} : r && r.isVector2 ? t.uniforms[n] = {
					type: "v2",
					value: r.toArray()
				} : r && r.isVector3 ? t.uniforms[n] = {
					type: "v3",
					value: r.toArray()
				} : r && r.isVector4 ? t.uniforms[n] = {
					type: "v4",
					value: r.toArray()
				} : r && r.isMatrix3 ? t.uniforms[n] = {
					type: "m3",
					value: r.toArray()
				} : r && r.isMatrix4 ? t.uniforms[n] = {
					type: "m4",
					value: r.toArray()
				} : t.uniforms[n] = { value: r };
			}
			Object.keys(this.defines).length > 0 && (t.defines = this.defines), t.vertexShader = this.vertexShader, t.fragmentShader = this.fragmentShader, t.lights = this.lights, t.clipping = this.clipping;
			let n = {};
			for (let e in this.extensions) this.extensions[e] === !0 && (n[e] = !0);
			return Object.keys(n).length > 0 && (t.extensions = n), t;
		}
		fromJSON(e, t) {
			if (super.fromJSON(e, t), e.uniforms !== void 0) for (let n in e.uniforms) {
				let r = e.uniforms[n];
				switch (this.uniforms[n] = {}, r.type) {
					case "t":
						this.uniforms[n].value = t[r.value] || null;
						break;
					case "c":
						this.uniforms[n].value = new J().setHex(r.value);
						break;
					case "v2":
						this.uniforms[n].value = new U().fromArray(r.value);
						break;
					case "v3":
						this.uniforms[n].value = new W().fromArray(r.value);
						break;
					case "v4":
						this.uniforms[n].value = new ur().fromArray(r.value);
						break;
					case "m3":
						this.uniforms[n].value = new G().fromArray(r.value);
						break;
					case "m4":
						this.uniforms[n].value = new q().fromArray(r.value);
						break;
					default: this.uniforms[n].value = r.value;
				}
			}
			if (e.defines !== void 0 && (this.defines = e.defines), e.vertexShader !== void 0 && (this.vertexShader = e.vertexShader), e.fragmentShader !== void 0 && (this.fragmentShader = e.fragmentShader), e.glslVersion !== void 0 && (this.glslVersion = e.glslVersion), e.extensions !== void 0) for (let t in e.extensions) this.extensions[t] = e.extensions[t];
			return e.lights !== void 0 && (this.lights = e.lights), e.clipping !== void 0 && (this.clipping = e.clipping), this;
		}
	}, Ao = class extends ko {
		constructor(e) {
			super(e), this.isRawShaderMaterial = !0, this.type = "RawShaderMaterial";
		}
	}, jo = class extends qi {
		constructor(e) {
			super(), this.isMeshStandardMaterial = !0, this.type = "MeshStandardMaterial", this.defines = { STANDARD: "" }, this.color = new J(16777215), this.roughness = 1, this.metalness = 0, this.map = null, this.lightMap = null, this.lightMapIntensity = 1, this.aoMap = null, this.aoMapIntensity = 1, this.emissive = new J(0), this.emissiveIntensity = 1, this.emissiveMap = null, this.bumpMap = null, this.bumpScale = 1, this.normalMap = null, this.normalMapType = 0, this.normalScale = new U(1, 1), this.displacementMap = null, this.displacementScale = 1, this.displacementBias = 0, this.roughnessMap = null, this.metalnessMap = null, this.alphaMap = null, this.envMap = null, this.envMapRotation = new wr(), this.envMapIntensity = 1, this.wireframe = !1, this.wireframeLinewidth = 1, this.wireframeLinecap = "round", this.wireframeLinejoin = "round", this.flatShading = !1, this.fog = !0, this.setValues(e);
		}
		copy(e) {
			return super.copy(e), this.defines = { STANDARD: "" }, this.color.copy(e.color), this.roughness = e.roughness, this.metalness = e.metalness, this.map = e.map, this.lightMap = e.lightMap, this.lightMapIntensity = e.lightMapIntensity, this.aoMap = e.aoMap, this.aoMapIntensity = e.aoMapIntensity, this.emissive.copy(e.emissive), this.emissiveMap = e.emissiveMap, this.emissiveIntensity = e.emissiveIntensity, this.bumpMap = e.bumpMap, this.bumpScale = e.bumpScale, this.normalMap = e.normalMap, this.normalMapType = e.normalMapType, this.normalScale.copy(e.normalScale), this.displacementMap = e.displacementMap, this.displacementScale = e.displacementScale, this.displacementBias = e.displacementBias, this.roughnessMap = e.roughnessMap, this.metalnessMap = e.metalnessMap, this.alphaMap = e.alphaMap, this.envMap = e.envMap, this.envMapRotation.copy(e.envMapRotation), this.envMapIntensity = e.envMapIntensity, this.wireframe = e.wireframe, this.wireframeLinewidth = e.wireframeLinewidth, this.wireframeLinecap = e.wireframeLinecap, this.wireframeLinejoin = e.wireframeLinejoin, this.flatShading = e.flatShading, this.fog = e.fog, this;
		}
	}, Mo = class extends jo {
		constructor(e) {
			super(), this.isMeshPhysicalMaterial = !0, this.defines = {
				STANDARD: "",
				PHYSICAL: ""
			}, this.type = "MeshPhysicalMaterial", this.anisotropyRotation = 0, this.anisotropyMap = null, this.clearcoatMap = null, this.clearcoatRoughness = 0, this.clearcoatRoughnessMap = null, this.clearcoatNormalScale = new U(1, 1), this.clearcoatNormalMap = null, this.ior = 1.5, Object.defineProperty(this, "reflectivity", {
				get: function() {
					return h(2.5 * (this.ior - 1) / (this.ior + 1), 0, 1);
				},
				set: function(e) {
					this.ior = (1 + .4 * e) / (1 - .4 * e);
				}
			}), this.iridescenceMap = null, this.iridescenceIOR = 1.3, this.iridescenceThicknessRange = [100, 400], this.iridescenceThicknessMap = null, this.sheenColor = new J(0), this.sheenColorMap = null, this.sheenRoughness = 1, this.sheenRoughnessMap = null, this.transmissionMap = null, this.thickness = 0, this.thicknessMap = null, this.attenuationDistance = Infinity, this.attenuationColor = new J(1, 1, 1), this.specularIntensity = 1, this.specularIntensityMap = null, this.specularColor = new J(1, 1, 1), this.specularColorMap = null, this._anisotropy = 0, this._clearcoat = 0, this._dispersion = 0, this._iridescence = 0, this._sheen = 0, this._transmission = 0, this.setValues(e);
		}
		get anisotropy() {
			return this._anisotropy;
		}
		set anisotropy(e) {
			this._anisotropy > 0 != e > 0 && this.version++, this._anisotropy = e;
		}
		get clearcoat() {
			return this._clearcoat;
		}
		set clearcoat(e) {
			this._clearcoat > 0 != e > 0 && this.version++, this._clearcoat = e;
		}
		get iridescence() {
			return this._iridescence;
		}
		set iridescence(e) {
			this._iridescence > 0 != e > 0 && this.version++, this._iridescence = e;
		}
		get dispersion() {
			return this._dispersion;
		}
		set dispersion(e) {
			this._dispersion > 0 != e > 0 && this.version++, this._dispersion = e;
		}
		get sheen() {
			return this._sheen;
		}
		set sheen(e) {
			this._sheen > 0 != e > 0 && this.version++, this._sheen = e;
		}
		get transmission() {
			return this._transmission;
		}
		set transmission(e) {
			this._transmission > 0 != e > 0 && this.version++, this._transmission = e;
		}
		copy(e) {
			return super.copy(e), this.defines = {
				STANDARD: "",
				PHYSICAL: ""
			}, this.anisotropy = e.anisotropy, this.anisotropyRotation = e.anisotropyRotation, this.anisotropyMap = e.anisotropyMap, this.clearcoat = e.clearcoat, this.clearcoatMap = e.clearcoatMap, this.clearcoatRoughness = e.clearcoatRoughness, this.clearcoatRoughnessMap = e.clearcoatRoughnessMap, this.clearcoatNormalMap = e.clearcoatNormalMap, this.clearcoatNormalScale.copy(e.clearcoatNormalScale), this.dispersion = e.dispersion, this.ior = e.ior, this.iridescence = e.iridescence, this.iridescenceMap = e.iridescenceMap, this.iridescenceIOR = e.iridescenceIOR, this.iridescenceThicknessRange = [...e.iridescenceThicknessRange], this.iridescenceThicknessMap = e.iridescenceThicknessMap, this.sheen = e.sheen, this.sheenColor.copy(e.sheenColor), this.sheenColorMap = e.sheenColorMap, this.sheenRoughness = e.sheenRoughness, this.sheenRoughnessMap = e.sheenRoughnessMap, this.transmission = e.transmission, this.transmissionMap = e.transmissionMap, this.thickness = e.thickness, this.thicknessMap = e.thicknessMap, this.attenuationDistance = e.attenuationDistance, this.attenuationColor.copy(e.attenuationColor), this.specularIntensity = e.specularIntensity, this.specularIntensityMap = e.specularIntensityMap, this.specularColor.copy(e.specularColor), this.specularColorMap = e.specularColorMap, this;
		}
	}, No = class extends qi {
		constructor(e) {
			super(), this.isMeshPhongMaterial = !0, this.type = "MeshPhongMaterial", this.color = new J(16777215), this.specular = new J(1118481), this.shininess = 30, this.map = null, this.lightMap = null, this.lightMapIntensity = 1, this.aoMap = null, this.aoMapIntensity = 1, this.emissive = new J(0), this.emissiveIntensity = 1, this.emissiveMap = null, this.bumpMap = null, this.bumpScale = 1, this.normalMap = null, this.normalMapType = 0, this.normalScale = new U(1, 1), this.displacementMap = null, this.displacementScale = 1, this.displacementBias = 0, this.specularMap = null, this.alphaMap = null, this.envMap = null, this.envMapRotation = new wr(), this.combine = 0, this.reflectivity = 1, this.envMapIntensity = 1, this.refractionRatio = .98, this.wireframe = !1, this.wireframeLinewidth = 1, this.wireframeLinecap = "round", this.wireframeLinejoin = "round", this.flatShading = !1, this.fog = !0, this.setValues(e);
		}
		copy(e) {
			return super.copy(e), this.color.copy(e.color), this.specular.copy(e.specular), this.shininess = e.shininess, this.map = e.map, this.lightMap = e.lightMap, this.lightMapIntensity = e.lightMapIntensity, this.aoMap = e.aoMap, this.aoMapIntensity = e.aoMapIntensity, this.emissive.copy(e.emissive), this.emissiveMap = e.emissiveMap, this.emissiveIntensity = e.emissiveIntensity, this.bumpMap = e.bumpMap, this.bumpScale = e.bumpScale, this.normalMap = e.normalMap, this.normalMapType = e.normalMapType, this.normalScale.copy(e.normalScale), this.displacementMap = e.displacementMap, this.displacementScale = e.displacementScale, this.displacementBias = e.displacementBias, this.specularMap = e.specularMap, this.alphaMap = e.alphaMap, this.envMap = e.envMap, this.envMapRotation.copy(e.envMapRotation), this.combine = e.combine, this.reflectivity = e.reflectivity, this.envMapIntensity = e.envMapIntensity, this.refractionRatio = e.refractionRatio, this.wireframe = e.wireframe, this.wireframeLinewidth = e.wireframeLinewidth, this.wireframeLinecap = e.wireframeLinecap, this.wireframeLinejoin = e.wireframeLinejoin, this.flatShading = e.flatShading, this.fog = e.fog, this;
		}
	}, Po = class extends qi {
		constructor(e) {
			super(), this.isMeshLambertMaterial = !0, this.type = "MeshLambertMaterial", this.color = new J(16777215), this.map = null, this.lightMap = null, this.lightMapIntensity = 1, this.aoMap = null, this.aoMapIntensity = 1, this.emissive = new J(0), this.emissiveIntensity = 1, this.emissiveMap = null, this.bumpMap = null, this.bumpScale = 1, this.normalMap = null, this.normalMapType = 0, this.normalScale = new U(1, 1), this.displacementMap = null, this.displacementScale = 1, this.displacementBias = 0, this.specularMap = null, this.alphaMap = null, this.envMap = null, this.envMapRotation = new wr(), this.combine = 0, this.reflectivity = 1, this.envMapIntensity = 1, this.refractionRatio = .98, this.wireframe = !1, this.wireframeLinewidth = 1, this.wireframeLinecap = "round", this.wireframeLinejoin = "round", this.flatShading = !1, this.fog = !0, this.setValues(e);
		}
		copy(e) {
			return super.copy(e), this.color.copy(e.color), this.map = e.map, this.lightMap = e.lightMap, this.lightMapIntensity = e.lightMapIntensity, this.aoMap = e.aoMap, this.aoMapIntensity = e.aoMapIntensity, this.emissive.copy(e.emissive), this.emissiveMap = e.emissiveMap, this.emissiveIntensity = e.emissiveIntensity, this.bumpMap = e.bumpMap, this.bumpScale = e.bumpScale, this.normalMap = e.normalMap, this.normalMapType = e.normalMapType, this.normalScale.copy(e.normalScale), this.displacementMap = e.displacementMap, this.displacementScale = e.displacementScale, this.displacementBias = e.displacementBias, this.specularMap = e.specularMap, this.alphaMap = e.alphaMap, this.envMap = e.envMap, this.envMapRotation.copy(e.envMapRotation), this.combine = e.combine, this.reflectivity = e.reflectivity, this.envMapIntensity = e.envMapIntensity, this.refractionRatio = e.refractionRatio, this.wireframe = e.wireframe, this.wireframeLinewidth = e.wireframeLinewidth, this.wireframeLinecap = e.wireframeLinecap, this.wireframeLinejoin = e.wireframeLinejoin, this.flatShading = e.flatShading, this.fog = e.fog, this;
		}
	}, Fo = class extends qi {
		constructor(e) {
			super(), this.isMeshDepthMaterial = !0, this.type = "MeshDepthMaterial", this.depthPacking = Fn, this.map = null, this.alphaMap = null, this.displacementMap = null, this.displacementScale = 1, this.displacementBias = 0, this.wireframe = !1, this.wireframeLinewidth = 1, this.setValues(e);
		}
		copy(e) {
			return super.copy(e), this.depthPacking = e.depthPacking, this.map = e.map, this.alphaMap = e.alphaMap, this.displacementMap = e.displacementMap, this.displacementScale = e.displacementScale, this.displacementBias = e.displacementBias, this.wireframe = e.wireframe, this.wireframeLinewidth = e.wireframeLinewidth, this;
		}
	}, Io = class extends qi {
		constructor(e) {
			super(), this.isMeshDistanceMaterial = !0, this.type = "MeshDistanceMaterial", this.map = null, this.alphaMap = null, this.displacementMap = null, this.displacementScale = 1, this.displacementBias = 0, this.setValues(e);
		}
		copy(e) {
			return super.copy(e), this.map = e.map, this.alphaMap = e.alphaMap, this.displacementMap = e.displacementMap, this.displacementScale = e.displacementScale, this.displacementBias = e.displacementBias, this;
		}
	}, Lo = class {
		constructor(e, t, n, r) {
			this.parameterPositions = e, this._cachedIndex = 0, this.resultBuffer = r === void 0 ? new t.constructor(n) : r, this.sampleValues = t, this.valueSize = n, this.settings = null, this.DefaultSettings_ = {};
		}
		evaluate(e) {
			let t = this.parameterPositions, n = this._cachedIndex, r = t[n], i = t[n - 1];
			validate_interval: {
				seek: {
					let a;
					linear_scan: {
						forward_scan: if (!(e < r)) {
							for (let a = n + 2;;) {
								if (r === void 0) {
									if (e < i) break forward_scan;
									return n = t.length, this._cachedIndex = n, this.copySampleValue_(n - 1);
								}
								if (n === a) break;
								if (i = r, r = t[++n], e < r) break seek;
							}
							a = t.length;
							break linear_scan;
						}
						if (!(e >= i)) {
							let o = t[1];
							e < o && (n = 2, i = o);
							for (let a = n - 2;;) {
								if (i === void 0) return this._cachedIndex = 0, this.copySampleValue_(0);
								if (n === a) break;
								if (r = i, i = t[--n - 1], e >= i) break seek;
							}
							a = n, n = 0;
							break linear_scan;
						}
						break validate_interval;
					}
					for (; n < a;) {
						let r = n + a >>> 1;
						e < t[r] ? a = r : n = r + 1;
					}
					if (r = t[n], i = t[n - 1], i === void 0) return this._cachedIndex = 0, this.copySampleValue_(0);
					if (r === void 0) return n = t.length, this._cachedIndex = n, this.copySampleValue_(n - 1);
				}
				this._cachedIndex = n, this.intervalChanged_(n, i, r);
			}
			return this.interpolate_(n, i, e, r);
		}
		getSettings_() {
			return this.settings || this.DefaultSettings_;
		}
		copySampleValue_(e) {
			let t = this.resultBuffer, n = this.sampleValues, r = this.valueSize, i = e * r;
			for (let e = 0; e !== r; ++e) t[e] = n[i + e];
			return t;
		}
		interpolate_() {
			throw Error("THREE.Interpolant: Call to abstract method.");
		}
		intervalChanged_() {}
	}, Ro = class extends Lo {
		constructor(e, t, n, r) {
			super(e, t, n, r), this._weightPrev = -0, this._offsetPrev = -0, this._weightNext = -0, this._offsetNext = -0, this.DefaultSettings_ = {
				endingStart: An,
				endingEnd: An
			};
		}
		intervalChanged_(e, t, n) {
			let r = this.parameterPositions, i = e - 2, a = e + 1, o = r[i], s = r[a];
			if (o === void 0) switch (this.getSettings_().endingStart) {
				case jn:
					i = e, o = 2 * t - n;
					break;
				case Mn:
					i = r.length - 2, o = t + r[i] - r[i + 1];
					break;
				default: i = e, o = n;
			}
			if (s === void 0) switch (this.getSettings_().endingEnd) {
				case jn:
					a = e, s = 2 * n - t;
					break;
				case Mn:
					a = 1, s = n + r[1] - r[0];
					break;
				default: a = e - 1, s = t;
			}
			let c = (n - t) * .5, l = this.valueSize;
			this._weightPrev = c / (t - o), this._weightNext = c / (s - n), this._offsetPrev = i * l, this._offsetNext = a * l;
		}
		interpolate_(e, t, n, r) {
			let i = this.resultBuffer, a = this.sampleValues, o = this.valueSize, s = e * o, c = s - o, l = this._offsetPrev, u = this._offsetNext, d = this._weightPrev, f = this._weightNext, p = (n - t) / (r - t), m = p * p, h = m * p, g = -d * h + 2 * d * m - d * p, _ = (1 + d) * h + (-1.5 - 2 * d) * m + (-.5 + d) * p + 1, v = (-1 - f) * h + (1.5 + f) * m + .5 * p, y = f * h - f * m;
			for (let e = 0; e !== o; ++e) i[e] = g * a[l + e] + _ * a[c + e] + v * a[s + e] + y * a[u + e];
			return i;
		}
	}, zo = class extends Lo {
		constructor(e, t, n, r) {
			super(e, t, n, r);
		}
		interpolate_(e, t, n, r) {
			let i = this.resultBuffer, a = this.sampleValues, o = this.valueSize, s = e * o, c = s - o, l = (n - t) / (r - t), u = 1 - l;
			for (let e = 0; e !== o; ++e) i[e] = a[c + e] * u + a[s + e] * l;
			return i;
		}
	}, Bo = class extends Lo {
		constructor(e, t, n, r) {
			super(e, t, n, r);
		}
		interpolate_(e) {
			return this.copySampleValue_(e - 1);
		}
	}, Vo = class extends Lo {
		interpolate_(e, t, n, r) {
			let i = this.resultBuffer, a = this.sampleValues, o = this.valueSize, s = e * o, c = s - o, l = this.inTangents, u = this.outTangents;
			if (!l || !u) {
				let e = (n - t) / (r - t), l = 1 - e;
				for (let t = 0; t !== o; ++t) i[t] = a[c + t] * l + a[s + t] * e;
				return i;
			}
			let d = o * 2, f = e - 1;
			for (let p = 0; p !== o; ++p) {
				let o = a[c + p], m = a[s + p], h = f * d + p * 2, g = u[h], _ = u[h + 1], v = e * d + p * 2, y = l[v], b = l[v + 1], x = (n - t) / (r - t), S, C, w, T, E;
				for (let e = 0; e < 8; e++) {
					S = x * x, C = S * x, w = 1 - x, T = w * w, E = T * w;
					let e = E * t + 3 * T * x * g + 3 * w * S * y + C * r - n;
					if (Math.abs(e) < 1e-10) break;
					let i = 3 * T * (g - t) + 6 * w * x * (y - g) + 3 * S * (r - y);
					if (Math.abs(i) < 1e-10) break;
					x -= e / i, x = Math.max(0, Math.min(1, x));
				}
				i[p] = E * o + 3 * T * x * _ + 3 * w * S * b + C * m;
			}
			return i;
		}
	}, Ho = class {
		constructor(e, t, n, r) {
			if (e === void 0) throw Error("THREE.KeyframeTrack: track name is undefined");
			if (t === void 0 || t.length === 0) throw Error("THREE.KeyframeTrack: no keyframes in track named " + e);
			this.name = e, this.times = We(t, this.TimeBufferType), this.values = We(n, this.ValueBufferType), this.setInterpolation(r || this.DefaultInterpolation);
		}
		static toJSON(e) {
			let t = e.constructor, n;
			if (t.toJSON !== this.toJSON) n = t.toJSON(e);
			else {
				n = {
					name: e.name,
					times: We(e.times, Array),
					values: We(e.values, Array)
				};
				let t = e.getInterpolation();
				t !== e.DefaultInterpolation && (n.interpolation = t);
			}
			return n.type = e.ValueTypeName, n;
		}
		InterpolantFactoryMethodDiscrete(e) {
			return new Bo(this.times, this.values, this.getValueSize(), e);
		}
		InterpolantFactoryMethodLinear(e) {
			return new zo(this.times, this.values, this.getValueSize(), e);
		}
		InterpolantFactoryMethodSmooth(e) {
			return new Ro(this.times, this.values, this.getValueSize(), e);
		}
		InterpolantFactoryMethodBezier(e) {
			let t = new Vo(this.times, this.values, this.getValueSize(), e);
			return this.settings && (t.inTangents = this.settings.inTangents, t.outTangents = this.settings.outTangents), t;
		}
		setInterpolation(e) {
			let t;
			switch (e) {
				case En:
					t = this.InterpolantFactoryMethodDiscrete;
					break;
				case Dn:
					t = this.InterpolantFactoryMethodLinear;
					break;
				case On:
					t = this.InterpolantFactoryMethodSmooth;
					break;
				case kn: t = this.InterpolantFactoryMethodBezier;
			}
			if (t === void 0) {
				let t = "unsupported interpolation for " + this.ValueTypeName + " keyframe track named " + this.name;
				if (this.createInterpolant === void 0) {
					if (e !== this.DefaultInterpolation) this.setInterpolation(this.DefaultInterpolation);
					else throw Error(t);
				}
				return u("KeyframeTrack:", t), this;
			}
			return this.createInterpolant = t, this;
		}
		getInterpolation() {
			switch (this.createInterpolant) {
				case this.InterpolantFactoryMethodDiscrete: return En;
				case this.InterpolantFactoryMethodLinear: return Dn;
				case this.InterpolantFactoryMethodSmooth: return On;
				case this.InterpolantFactoryMethodBezier: return kn;
			}
		}
		getValueSize() {
			return this.values.length / this.times.length;
		}
		shift(e) {
			if (e !== 0) {
				let t = this.times;
				for (let n = 0, r = t.length; n !== r; ++n) t[n] += e;
			}
			return this;
		}
		scale(e) {
			if (e !== 1) {
				let t = this.times;
				for (let n = 0, r = t.length; n !== r; ++n) t[n] *= e;
			}
			return this;
		}
		trim(e, t) {
			let n = this.times, r = n.length, i = 0, a = r - 1;
			for (; i !== r && n[i] < e;) ++i;
			for (; a !== -1 && n[a] > t;) --a;
			if (++a, i !== 0 || a !== r) {
				i >= a && (a = Math.max(a, 1), i = a - 1);
				let e = this.getValueSize();
				this.times = n.slice(i, a), this.values = this.values.slice(i * e, a * e);
			}
			return this;
		}
		validate() {
			let e = !0, t = this.getValueSize();
			t - Math.floor(t) !== 0 && (d("KeyframeTrack: Invalid value size in track.", this), e = !1);
			let n = this.times, r = this.values, i = n.length;
			i === 0 && (d("KeyframeTrack: Track is empty.", this), e = !1);
			let o = null;
			for (let t = 0; t !== i; t++) {
				let r = n[t];
				if (typeof r == "number" && isNaN(r)) {
					d("KeyframeTrack: Time is not a valid number.", this, t, r), e = !1;
					break;
				}
				if (o !== null && o > r) {
					d("KeyframeTrack: Out of order keys.", this, t, r, o), e = !1;
					break;
				}
				o = r;
			}
			if (r !== void 0 && a(r)) for (let t = 0, n = r.length; t !== n; ++t) {
				let n = r[t];
				if (isNaN(n)) {
					d("KeyframeTrack: Value is not a valid number.", this, t, n), e = !1;
					break;
				}
			}
			return e;
		}
		optimize() {
			let e = this.times.slice(), t = this.values.slice(), n = this.getValueSize(), r = this.getInterpolation() === On, i = e.length - 1, a = 1;
			for (let o = 1; o < i; ++o) {
				let i = !1, s = e[o];
				if (s !== e[o + 1] && (o !== 1 || s !== e[0])) {
					if (r) i = !0;
					else {
						let e = o * n, r = e - n, a = e + n;
						for (let o = 0; o !== n; ++o) {
							let n = t[e + o];
							if (n !== t[r + o] || n !== t[a + o]) {
								i = !0;
								break;
							}
						}
					}
				}
				if (i) {
					if (o !== a) {
						e[a] = e[o];
						let r = o * n, i = a * n;
						for (let e = 0; e !== n; ++e) t[i + e] = t[r + e];
					}
					++a;
				}
			}
			if (i > 0) {
				e[a] = e[i];
				for (let e = i * n, r = a * n, o = 0; o !== n; ++o) t[r + o] = t[e + o];
				++a;
			}
			return a === e.length ? (this.times = e, this.values = t) : (this.times = e.slice(0, a), this.values = t.slice(0, a * n)), this;
		}
		clone() {
			let e = this.times.slice(), t = this.values.slice(), n = this.constructor, r = new n(this.name, e, t);
			return r.createInterpolant = this.createInterpolant, r;
		}
	}, Ho.prototype.ValueTypeName = "", Ho.prototype.TimeBufferType = Float32Array, Ho.prototype.ValueBufferType = Float32Array, Ho.prototype.DefaultInterpolation = Dn, Uo = class extends Ho {
		constructor(e, t, n) {
			super(e, t, n);
		}
	}, Uo.prototype.ValueTypeName = "bool", Uo.prototype.ValueBufferType = Array, Uo.prototype.DefaultInterpolation = En, Uo.prototype.InterpolantFactoryMethodLinear = void 0, Uo.prototype.InterpolantFactoryMethodSmooth = void 0, Wo = class extends Ho {
		constructor(e, t, n, r) {
			super(e, t, n, r);
		}
	}, Wo.prototype.ValueTypeName = "color", Go = class extends Ho {
		constructor(e, t, n, r) {
			super(e, t, n, r);
		}
	}, Go.prototype.ValueTypeName = "number", Ko = class extends Lo {
		constructor(e, t, n, r) {
			super(e, t, n, r);
		}
		interpolate_(e, t, n, r) {
			let i = this.resultBuffer, a = this.sampleValues, o = this.valueSize, s = (n - t) / (r - t), c = e * o;
			for (let e = c + o; c !== e; c += 4) Zn.slerpFlat(i, 0, a, c - o, a, c, s);
			return i;
		}
	}, qo = class extends Ho {
		constructor(e, t, n, r) {
			super(e, t, n, r);
		}
		InterpolantFactoryMethodLinear(e) {
			return new Ko(this.times, this.values, this.getValueSize(), e);
		}
	}, qo.prototype.ValueTypeName = "quaternion", qo.prototype.InterpolantFactoryMethodSmooth = void 0, Jo = class extends Ho {
		constructor(e, t, n) {
			super(e, t, n);
		}
	}, Jo.prototype.ValueTypeName = "string", Jo.prototype.ValueBufferType = Array, Jo.prototype.DefaultInterpolation = En, Jo.prototype.InterpolantFactoryMethodLinear = void 0, Jo.prototype.InterpolantFactoryMethodSmooth = void 0, Yo = class extends Ho {
		constructor(e, t, n, r) {
			super(e, t, n, r);
		}
	}, Yo.prototype.ValueTypeName = "vector", Xo = class {
		constructor(e = "", t = -1, n = [], r = Nn) {
			this.name = e, this.tracks = n, this.duration = t, this.blendMode = r, this.uuid = m(), this.userData = {}, this.duration < 0 && this.resetDuration();
		}
		static parse(e) {
			let t = [], n = e.tracks, r = 1 / (e.fps || 1);
			for (let e = 0, i = n.length; e !== i; ++e) t.push(Ye(n[e]).scale(r));
			let i = new this(e.name, e.duration, t, e.blendMode);
			return i.uuid = e.uuid, i.userData = JSON.parse(e.userData || "{}"), i;
		}
		static toJSON(e) {
			let t = [], n = e.tracks, r = {
				name: e.name,
				duration: e.duration,
				tracks: t,
				uuid: e.uuid,
				blendMode: e.blendMode,
				userData: JSON.stringify(e.userData)
			};
			for (let e = 0, r = n.length; e !== r; ++e) t.push(Ho.toJSON(n[e]));
			return r;
		}
		static CreateFromMorphTargetSequence(e, t, n, r) {
			let i = t.length, a = [];
			for (let e = 0; e < i; e++) {
				let o = [], s = [];
				o.push((e + i - 1) % i, e, (e + 1) % i), s.push(0, 1, 0);
				let c = Ge(o);
				o = Ke(o, 1, c), s = Ke(s, 1, c), !r && o[0] === 0 && (o.push(i), s.push(s[0])), a.push(new Go(".morphTargetInfluences[" + t[e].name + "]", o, s).scale(1 / n));
			}
			return new this(e, -1, a);
		}
		static findByName(e, t) {
			let n = e;
			if (!Array.isArray(e)) {
				let t = e;
				n = t.geometry && t.geometry.animations || t.animations;
			}
			for (let e = 0; e < n.length; e++) if (n[e].name === t) return n[e];
			return null;
		}
		static CreateClipsFromMorphTargetSequences(e, t, n) {
			let r = {}, i = /^([\w-]*?)([\d]+)$/;
			for (let t = 0, n = e.length; t < n; t++) {
				let n = e[t], a = n.name.match(i);
				if (a && a.length > 1) {
					let e = a[1], t = r[e];
					t || (r[e] = t = []), t.push(n);
				}
			}
			let a = [];
			for (let e in r) a.push(this.CreateFromMorphTargetSequence(e, r[e], t, n));
			return a;
		}
		resetDuration() {
			let e = this.tracks, t = 0;
			for (let n = 0, r = e.length; n !== r; ++n) {
				let e = this.tracks[n];
				t = Math.max(t, e.times[e.times.length - 1]);
			}
			return this.duration = t, this;
		}
		trim() {
			for (let e = 0; e < this.tracks.length; e++) this.tracks[e].trim(0, this.duration);
			return this;
		}
		validate() {
			let e = !0;
			for (let t = 0; t < this.tracks.length; t++) e = e && this.tracks[t].validate();
			return e;
		}
		optimize() {
			for (let e = 0; e < this.tracks.length; e++) this.tracks[e].optimize();
			return this;
		}
		clone() {
			let e = [];
			for (let t = 0; t < this.tracks.length; t++) e.push(this.tracks[t].clone());
			let t = new this.constructor(this.name, this.duration, e, this.blendMode);
			return t.userData = JSON.parse(JSON.stringify(this.userData)), t;
		}
		toJSON() {
			return this.constructor.toJSON(this);
		}
	}, Zo = {
		enabled: !1,
		files: {},
		add: function(e, t) {
			this.enabled !== !1 && (Xe(e) || (this.files[e] = t));
		},
		get: function(e) {
			if (this.enabled !== !1 && !Xe(e)) return this.files[e];
		},
		remove: function(e) {
			delete this.files[e];
		},
		clear: function() {
			this.files = {};
		}
	}, Qo = class {
		constructor(e, t, n) {
			let r = this, i = !1, a = 0, o = 0, s, c = [];
			this.onStart = void 0, this.onLoad = e, this.onProgress = t, this.onError = n, this._abortController = null, this.itemStart = function(e) {
				o++, i === !1 && r.onStart !== void 0 && r.onStart(e, a, o), i = !0;
			}, this.itemEnd = function(e) {
				a++, r.onProgress !== void 0 && r.onProgress(e, a, o), a === o && (i = !1, r.onLoad !== void 0 && r.onLoad());
			}, this.itemError = function(e) {
				r.onError !== void 0 && r.onError(e);
			}, this.resolveURL = function(e) {
				return e = e.normalize("NFC"), s ? s(e) : e;
			}, this.setURLModifier = function(e) {
				return s = e, this;
			}, this.addHandler = function(e, t) {
				return c.push(e, t), this;
			}, this.removeHandler = function(e) {
				let t = c.indexOf(e);
				return t !== -1 && c.splice(t, 2), this;
			}, this.getHandler = function(e) {
				for (let t = 0, n = c.length; t < n; t += 2) {
					let n = c[t], r = c[t + 1];
					if (n.global && (n.lastIndex = 0), n.test(e)) return r;
				}
				return null;
			}, this.abort = function() {
				return this.abortController.abort(), this._abortController = null, this;
			};
		}
		get abortController() {
			return this._abortController || (this._abortController = new AbortController()), this._abortController;
		}
	}, $o = /*@__PURE__*/ new Qo(), es = class {
		constructor(e) {
			this.manager = e === void 0 ? $o : e, this.crossOrigin = "anonymous", this.withCredentials = !1, this.path = "", this.resourcePath = "", this.requestHeader = {}, typeof __THREE_DEVTOOLS__ < "u" && __THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe", { detail: this }));
		}
		load() {}
		loadAsync(e, t) {
			let n = this;
			return new Promise(function(r, i) {
				n.load(e, r, t, i);
			});
		}
		parse() {}
		setCrossOrigin(e) {
			return this.crossOrigin = e, this;
		}
		setWithCredentials(e) {
			return this.withCredentials = e, this;
		}
		setPath(e) {
			return this.path = e, this;
		}
		setResourcePath(e) {
			return this.resourcePath = e, this;
		}
		setRequestHeader(e) {
			return this.requestHeader = e, this;
		}
		abort() {
			return this;
		}
	}, es.DEFAULT_MATERIAL_NAME = "__DEFAULT", ts = {}, ns = class extends Error {
		constructor(e, t) {
			super(e), this.response = t;
		}
	}, rs = class extends es {
		constructor(e) {
			super(e), this.mimeType = "", this.responseType = "", this._abortController = new AbortController();
		}
		load(e, t, n, r) {
			e === void 0 && (e = ""), this.path !== void 0 && (e = this.path + e), e = this.manager.resolveURL(e);
			let i = Zo.get(`file:${e}`);
			if (i !== void 0) {
				this.manager.itemStart(e), setTimeout(() => {
					t && t(i), this.manager.itemEnd(e);
				}, 0);
				return;
			}
			if (ts[e] !== void 0) {
				ts[e].push({
					onLoad: t,
					onProgress: n,
					onError: r
				});
				return;
			}
			ts[e] = [], ts[e].push({
				onLoad: t,
				onProgress: n,
				onError: r
			});
			let a = new Request(e, {
				headers: new Headers(this.requestHeader),
				credentials: this.withCredentials ? "include" : "same-origin",
				signal: typeof AbortSignal.any == "function" ? AbortSignal.any([this._abortController.signal, this.manager.abortController.signal]) : this._abortController.signal
			}), o = this.mimeType, s = this.responseType;
			fetch(a).then((t) => {
				if (t.status === 200 || t.status === 0) {
					if (t.status === 0 && u("FileLoader: HTTP Status 0 received."), typeof ReadableStream > "u" || t.body === void 0 || t.body.getReader === void 0) return t;
					let n = ts[e], r = t.body.getReader(), i = t.headers.get("X-File-Size") || t.headers.get("Content-Length"), a = i ? parseInt(i) : 0, o = a !== 0, s = 0, c = new ReadableStream({ start(e) {
						t();
						function t() {
							r.read().then(({ done: r, value: i }) => {
								if (r) e.close();
								else {
									s += i.byteLength;
									let r = new ProgressEvent("progress", {
										lengthComputable: o,
										loaded: s,
										total: a
									});
									for (let e = 0, t = n.length; e < t; e++) {
										let t = n[e];
										t.onProgress && t.onProgress(r);
									}
									e.enqueue(i), t();
								}
							}, (t) => {
								e.error(t);
							});
						}
					} });
					return new Response(c);
				}
				throw new ns(`fetch for "${t.url}" responded with ${t.status}: ${t.statusText}`, t);
			}).then((e) => {
				switch (s) {
					case "arraybuffer": return e.arrayBuffer();
					case "blob": return e.blob();
					case "document": return e.text().then((e) => new DOMParser().parseFromString(e, o));
					case "json": return e.json();
					default:
						if (o === "") return e.text();
						{
							let t = /charset="?([^;"\s]*)"?/i.exec(o), n = t && t[1] ? t[1].toLowerCase() : void 0, r = new TextDecoder(n);
							return e.arrayBuffer().then((e) => r.decode(e));
						}
				}
			}).then((t) => {
				Zo.add(`file:${e}`, t);
				let n = ts[e];
				delete ts[e];
				for (let e = 0, r = n.length; e < r; e++) {
					let r = n[e];
					r.onLoad && r.onLoad(t);
				}
			}).catch((t) => {
				let n = ts[e];
				if (n === void 0) throw this.manager.itemError(e), t;
				delete ts[e];
				for (let e = 0, r = n.length; e < r; e++) {
					let r = n[e];
					r.onError && r.onError(t);
				}
				this.manager.itemError(e);
			}).finally(() => {
				this.manager.itemEnd(e);
			}), this.manager.itemStart(e);
		}
		setResponseType(e) {
			return this.responseType = e, this;
		}
		setMimeType(e) {
			return this.mimeType = e, this;
		}
		abort() {
			return this._abortController.abort(), this._abortController = new AbortController(), this;
		}
	}, is = /* @__PURE__ */ new WeakMap(), as = class extends es {
		constructor(e) {
			super(e);
		}
		load(e, t, n, r) {
			this.path !== void 0 && (e = this.path + e), e = this.manager.resolveURL(e);
			let i = this, a = Zo.get(`image:${e}`);
			if (a !== void 0) {
				if (a.complete === !0) i.manager.itemStart(e), setTimeout(function() {
					t && t(a), i.manager.itemEnd(e);
				}, 0);
				else {
					let e = is.get(a);
					e === void 0 && (e = [], is.set(a, e)), e.push({
						onLoad: t,
						onError: r
					});
				}
				return a;
			}
			let s = o("img");
			function c() {
				u(), t && t(this);
				let n = is.get(this) || [];
				for (let e = 0; e < n.length; e++) {
					let t = n[e];
					t.onLoad && t.onLoad(this);
				}
				is.delete(this), i.manager.itemEnd(e);
			}
			function l(t) {
				u(), r && r(t), Zo.remove(`image:${e}`);
				let n = is.get(this) || [];
				for (let e = 0; e < n.length; e++) {
					let r = n[e];
					r.onError && r.onError(t);
				}
				is.delete(this), i.manager.itemError(e), i.manager.itemEnd(e);
			}
			function u() {
				s.removeEventListener("load", c, !1), s.removeEventListener("error", l, !1);
			}
			return s.addEventListener("load", c, !1), s.addEventListener("error", l, !1), e.slice(0, 5) !== "data:" && this.crossOrigin !== void 0 && (s.crossOrigin = this.crossOrigin), Zo.add(`image:${e}`, s), i.manager.itemStart(e), s.src = e, s;
		}
	}, os = class extends es {
		constructor(e) {
			super(e);
		}
		load(e, t, n, r) {
			let i = new lr(), a = new as(this.manager);
			return a.setCrossOrigin(this.crossOrigin), a.setPath(this.path), a.load(e, function(e) {
				i.image = e, i.needsUpdate = !0, t !== void 0 && t(i);
			}, n, r), i;
		}
	}, ss = class extends Vr {
		constructor(e, t = 1) {
			super(), this.isLight = !0, this.type = "Light", this.color = new J(e), this.intensity = t;
		}
		dispose() {
			this.dispatchEvent({ type: "dispose" });
		}
		copy(e, t) {
			return super.copy(e, t), this.color.copy(e.color), this.intensity = e.intensity, this;
		}
		toJSON(e) {
			let t = super.toJSON(e);
			return t.object.color = this.color.getHex(), t.object.intensity = this.intensity, t;
		}
	}, cs = /*@__PURE__*/ new q(), ls = /*@__PURE__*/ new W(), us = /*@__PURE__*/ new W(), ds = class {
		constructor(e) {
			this.camera = e, this.intensity = 1, this.bias = 0, this.biasNode = null, this.normalBias = 0, this.radius = 1, this.blurSamples = 8, this.mapSize = new U(512, 512), this.mapType = vt, this.map = null, this.mapPass = null, this.matrix = new q(), this.autoUpdate = !0, this.needsUpdate = !1, this._frustum = new Ka(), this._frameExtents = new U(1, 1), this._viewportCount = 1, this._viewports = [new ur(0, 0, 1, 1)];
		}
		getViewportCount() {
			return this._viewportCount;
		}
		getFrustum() {
			return this._frustum;
		}
		updateMatrices(e) {
			let t = this.camera, n = this.matrix;
			ls.setFromMatrixPosition(e.matrixWorld), t.position.copy(ls), us.setFromMatrixPosition(e.target.matrixWorld), t.lookAt(us), t.updateMatrixWorld(), cs.multiplyMatrices(t.projectionMatrix, t.matrixWorldInverse), this._frustum.setFromProjectionMatrix(cs, t.coordinateSystem, t.reversedDepth), t.coordinateSystem === 2001 || t.reversedDepth ? n.set(.5, 0, 0, .5, 0, .5, 0, .5, 0, 0, 1, 0, 0, 0, 0, 1) : n.set(.5, 0, 0, .5, 0, .5, 0, .5, 0, 0, .5, .5, 0, 0, 0, 1), n.multiply(cs);
		}
		getViewport(e) {
			return this._viewports[e];
		}
		getFrameExtents() {
			return this._frameExtents;
		}
		dispose() {
			this.map && this.map.dispose(), this.mapPass && this.mapPass.dispose();
		}
		copy(e) {
			return this.camera = e.camera.clone(), this.intensity = e.intensity, this.bias = e.bias, this.radius = e.radius, this.autoUpdate = e.autoUpdate, this.needsUpdate = e.needsUpdate, this.normalBias = e.normalBias, this.blurSamples = e.blurSamples, this.mapSize.copy(e.mapSize), this.biasNode = e.biasNode, this;
		}
		clone() {
			return new this.constructor().copy(this);
		}
		toJSON() {
			let e = {};
			return this.intensity !== 1 && (e.intensity = this.intensity), this.bias !== 0 && (e.bias = this.bias), this.normalBias !== 0 && (e.normalBias = this.normalBias), this.radius !== 1 && (e.radius = this.radius), (this.mapSize.x !== 512 || this.mapSize.y !== 512) && (e.mapSize = this.mapSize.toArray()), e.camera = this.camera.toJSON(!1).object, delete e.camera.matrix, e;
		}
	}, fs = /*@__PURE__*/ new W(), ps = /*@__PURE__*/ new Zn(), ms = /*@__PURE__*/ new W(), hs = class extends Vr {
		constructor() {
			super(), this.isCamera = !0, this.type = "Camera", this.matrixWorldInverse = new q(), this.projectionMatrix = new q(), this.projectionMatrixInverse = new q(), this.coordinateSystem = Vn, this._reversedDepth = !1;
		}
		get reversedDepth() {
			return this._reversedDepth;
		}
		copy(e, t) {
			return super.copy(e, t), this.matrixWorldInverse.copy(e.matrixWorldInverse), this.projectionMatrix.copy(e.projectionMatrix), this.projectionMatrixInverse.copy(e.projectionMatrixInverse), this.coordinateSystem = e.coordinateSystem, this;
		}
		getWorldDirection(e) {
			return super.getWorldDirection(e).negate();
		}
		updateMatrixWorld(e) {
			super.updateMatrixWorld(e), this.matrixWorld.decompose(fs, ps, ms), ms.x === 1 && ms.y === 1 && ms.z === 1 ? this.matrixWorldInverse.copy(this.matrixWorld).invert() : this.matrixWorldInverse.compose(fs, ps, ms.set(1, 1, 1)).invert();
		}
		updateWorldMatrix(e, t, n = !1) {
			super.updateWorldMatrix(e, t, n), this.matrixWorld.decompose(fs, ps, ms), ms.x === 1 && ms.y === 1 && ms.z === 1 ? this.matrixWorldInverse.copy(this.matrixWorld).invert() : this.matrixWorldInverse.compose(fs, ps, ms.set(1, 1, 1)).invert();
		}
		clone() {
			return new this.constructor().copy(this);
		}
	}, gs = /*@__PURE__*/ new W(), _s = /*@__PURE__*/ new U(), vs = /*@__PURE__*/ new U(), ys = class extends hs {
		constructor(e = 50, t = 1, n = .1, r = 2e3) {
			super(), this.isPerspectiveCamera = !0, this.type = "PerspectiveCamera", this.fov = e, this.zoom = 1, this.near = n, this.far = r, this.focus = 10, this.aspect = t, this.view = null, this.filmGauge = 35, this.filmOffset = 0, this.updateProjectionMatrix();
		}
		copy(e, t) {
			return super.copy(e, t), this.fov = e.fov, this.zoom = e.zoom, this.near = e.near, this.far = e.far, this.focus = e.focus, this.aspect = e.aspect, this.view = e.view === null ? null : Object.assign({}, e.view), this.filmGauge = e.filmGauge, this.filmOffset = e.filmOffset, this;
		}
		setFocalLength(e) {
			let t = .5 * this.getFilmHeight() / e;
			this.fov = Yn * 2 * Math.atan(t), this.updateProjectionMatrix();
		}
		getFocalLength() {
			let e = Math.tan(Jn * .5 * this.fov);
			return .5 * this.getFilmHeight() / e;
		}
		getEffectiveFOV() {
			return Yn * 2 * Math.atan(Math.tan(Jn * .5 * this.fov) / this.zoom);
		}
		getFilmWidth() {
			return this.filmGauge * Math.min(this.aspect, 1);
		}
		getFilmHeight() {
			return this.filmGauge / Math.max(this.aspect, 1);
		}
		getViewBounds(e, t, n) {
			gs.set(-1, -1, .5).applyMatrix4(this.projectionMatrixInverse), t.set(gs.x, gs.y).multiplyScalar(-e / gs.z), gs.set(1, 1, .5).applyMatrix4(this.projectionMatrixInverse), n.set(gs.x, gs.y).multiplyScalar(-e / gs.z);
		}
		getViewSize(e, t) {
			return this.getViewBounds(e, _s, vs), t.subVectors(vs, _s);
		}
		setViewOffset(e, t, n, r, i, a) {
			this.aspect = e / t, this.view === null && (this.view = {
				enabled: !0,
				fullWidth: 1,
				fullHeight: 1,
				offsetX: 0,
				offsetY: 0,
				width: 1,
				height: 1
			}), this.view.enabled = !0, this.view.fullWidth = e, this.view.fullHeight = t, this.view.offsetX = n, this.view.offsetY = r, this.view.width = i, this.view.height = a, this.updateProjectionMatrix();
		}
		clearViewOffset() {
			this.view !== null && (this.view.enabled = !1), this.updateProjectionMatrix();
		}
		updateProjectionMatrix() {
			let e = this.near, t = e * Math.tan(Jn * .5 * this.fov) / this.zoom, n = 2 * t, r = this.aspect * n, i = -.5 * r, a = this.view;
			if (this.view !== null && this.view.enabled) {
				let e = a.fullWidth, o = a.fullHeight;
				i += a.offsetX * r / e, t -= a.offsetY * n / o, r *= a.width / e, n *= a.height / o;
			}
			let o = this.filmOffset;
			o !== 0 && (i += e * o / this.getFilmWidth()), this.projectionMatrix.makePerspective(i, i + r, t, t - n, e, this.far, this.coordinateSystem, this.reversedDepth), this.projectionMatrixInverse.copy(this.projectionMatrix).invert();
		}
		toJSON(e) {
			let t = super.toJSON(e);
			return t.object.fov = this.fov, t.object.zoom = this.zoom, t.object.near = this.near, t.object.far = this.far, t.object.focus = this.focus, t.object.aspect = this.aspect, this.view !== null && (t.object.view = Object.assign({}, this.view)), t.object.filmGauge = this.filmGauge, t.object.filmOffset = this.filmOffset, t;
		}
	}, bs = class extends ds {
		constructor() {
			super(new ys(50, 1, .5, 500)), this.isSpotLightShadow = !0, this.focus = 1, this.aspect = 1;
		}
		updateMatrices(e) {
			let t = this.camera, n = Yn * 2 * e.angle * this.focus, r = this.mapSize.width / this.mapSize.height * this.aspect, i = e.distance || t.far;
			(n !== t.fov || r !== t.aspect || i !== t.far) && (t.fov = n, t.aspect = r, t.far = i, t.updateProjectionMatrix()), super.updateMatrices(e);
		}
		copy(e) {
			return super.copy(e), this.focus = e.focus, this;
		}
	}, xs = class extends ss {
		constructor(e, t, n = 0, r = Math.PI / 3, i = 0, a = 2) {
			super(e, t), this.isSpotLight = !0, this.type = "SpotLight", this.position.copy(Vr.DEFAULT_UP), this.updateMatrix(), this.target = new Vr(), this.distance = n, this.angle = r, this.penumbra = i, this.decay = a, this.map = null, this.shadow = new bs();
		}
		get power() {
			return this.intensity * Math.PI;
		}
		set power(e) {
			this.intensity = e / Math.PI;
		}
		dispose() {
			super.dispose(), this.shadow.dispose();
		}
		copy(e, t) {
			return super.copy(e, t), this.distance = e.distance, this.angle = e.angle, this.penumbra = e.penumbra, this.decay = e.decay, this.target = e.target.clone(), this.map = e.map, this.shadow = e.shadow.clone(), this;
		}
		toJSON(e) {
			let t = super.toJSON(e);
			return t.object.distance = this.distance, t.object.angle = this.angle, t.object.decay = this.decay, t.object.penumbra = this.penumbra, t.object.target = this.target.uuid, this.map && this.map.isTexture && (t.object.map = this.map.toJSON(e).uuid), t.object.shadow = this.shadow.toJSON(), t;
		}
	}, Ss = class extends ds {
		constructor() {
			super(new ys(90, 1, .5, 500)), this.isPointLightShadow = !0;
		}
	}, Cs = class extends ss {
		constructor(e, t, n = 0, r = 2) {
			super(e, t), this.isPointLight = !0, this.type = "PointLight", this.distance = n, this.decay = r, this.shadow = new Ss();
		}
		get power() {
			return this.intensity * 4 * Math.PI;
		}
		set power(e) {
			this.intensity = e / (4 * Math.PI);
		}
		dispose() {
			super.dispose(), this.shadow.dispose();
		}
		copy(e, t) {
			return super.copy(e, t), this.distance = e.distance, this.decay = e.decay, this.shadow = e.shadow.clone(), this;
		}
		toJSON(e) {
			let t = super.toJSON(e);
			return t.object.distance = this.distance, t.object.decay = this.decay, t.object.shadow = this.shadow.toJSON(), t;
		}
	}, ws = class extends hs {
		constructor(e = -1, t = 1, n = 1, r = -1, i = .1, a = 2e3) {
			super(), this.isOrthographicCamera = !0, this.type = "OrthographicCamera", this.zoom = 1, this.view = null, this.left = e, this.right = t, this.top = n, this.bottom = r, this.near = i, this.far = a, this.updateProjectionMatrix();
		}
		copy(e, t) {
			return super.copy(e, t), this.left = e.left, this.right = e.right, this.top = e.top, this.bottom = e.bottom, this.near = e.near, this.far = e.far, this.zoom = e.zoom, this.view = e.view === null ? null : Object.assign({}, e.view), this;
		}
		setViewOffset(e, t, n, r, i, a) {
			this.view === null && (this.view = {
				enabled: !0,
				fullWidth: 1,
				fullHeight: 1,
				offsetX: 0,
				offsetY: 0,
				width: 1,
				height: 1
			}), this.view.enabled = !0, this.view.fullWidth = e, this.view.fullHeight = t, this.view.offsetX = n, this.view.offsetY = r, this.view.width = i, this.view.height = a, this.updateProjectionMatrix();
		}
		clearViewOffset() {
			this.view !== null && (this.view.enabled = !1), this.updateProjectionMatrix();
		}
		updateProjectionMatrix() {
			let e = (this.right - this.left) / (2 * this.zoom), t = (this.top - this.bottom) / (2 * this.zoom), n = (this.right + this.left) / 2, r = (this.top + this.bottom) / 2, i = n - e, a = n + e, o = r + t, s = r - t;
			if (this.view !== null && this.view.enabled) {
				let e = (this.right - this.left) / this.view.fullWidth / this.zoom, t = (this.top - this.bottom) / this.view.fullHeight / this.zoom;
				i += e * this.view.offsetX, a = i + e * this.view.width, o -= t * this.view.offsetY, s = o - t * this.view.height;
			}
			this.projectionMatrix.makeOrthographic(i, a, o, s, this.near, this.far, this.coordinateSystem, this.reversedDepth), this.projectionMatrixInverse.copy(this.projectionMatrix).invert();
		}
		toJSON(e) {
			let t = super.toJSON(e);
			return t.object.zoom = this.zoom, t.object.left = this.left, t.object.right = this.right, t.object.top = this.top, t.object.bottom = this.bottom, t.object.near = this.near, t.object.far = this.far, this.view !== null && (t.object.view = Object.assign({}, this.view)), t;
		}
	}, Ts = class extends ds {
		constructor() {
			super(new ws(-5, 5, 5, -5, .5, 500)), this.isDirectionalLightShadow = !0;
		}
	}, Es = class extends ss {
		constructor(e, t) {
			super(e, t), this.isDirectionalLight = !0, this.type = "DirectionalLight", this.position.copy(Vr.DEFAULT_UP), this.updateMatrix(), this.target = new Vr(), this.shadow = new Ts();
		}
		dispose() {
			super.dispose(), this.shadow.dispose();
		}
		copy(e) {
			return super.copy(e), this.target = e.target.clone(), this.shadow = e.shadow.clone(), this;
		}
		toJSON(e) {
			let t = super.toJSON(e);
			return t.object.shadow = this.shadow.toJSON(), t.object.target = this.target.uuid, t;
		}
	}, Ds = class extends ss {
		constructor(e, t) {
			super(e, t), this.isAmbientLight = !0, this.type = "AmbientLight";
		}
	}, Os = class extends ss {
		constructor(e, t, n = 10, r = 10) {
			super(e, t), this.isRectAreaLight = !0, this.type = "RectAreaLight", this.width = n, this.height = r;
		}
		get power() {
			return this.intensity * this.width * this.height * Math.PI;
		}
		set power(e) {
			this.intensity = e / (this.width * this.height * Math.PI);
		}
		copy(e) {
			return super.copy(e), this.width = e.width, this.height = e.height, this;
		}
		toJSON(e) {
			let t = super.toJSON(e);
			return t.object.width = this.width, t.object.height = this.height, t;
		}
	}, ks = class {
		static extractUrlBase(e) {
			let t = e.lastIndexOf("/");
			return t === -1 ? "./" : e.slice(0, t + 1);
		}
		static resolveURL(e, t) {
			return typeof e != "string" || e === "" ? "" : (/^https?:\/\//i.test(t) && /^\//.test(e) && (t = t.replace(/(^https?:\/\/[^\/]+).*/i, "$1")), /^(https?:)?\/\//i.test(e) || /^data:.*,.*$/i.test(e) || /^blob:.*$/i.test(e) ? e : t + e);
		}
	}, As = /* @__PURE__ */ new WeakMap(), js = class extends es {
		constructor(e) {
			super(e), this.isImageBitmapLoader = !0, typeof createImageBitmap > "u" && u("ImageBitmapLoader: createImageBitmap() not supported."), typeof fetch > "u" && u("ImageBitmapLoader: fetch() not supported."), this.options = { premultiplyAlpha: "none" }, this._abortController = new AbortController();
		}
		setOptions(e) {
			return this.options = e, this;
		}
		load(e, t, n, r) {
			e === void 0 && (e = ""), this.path !== void 0 && (e = this.path + e), e = this.manager.resolveURL(e);
			let i = this, a = Zo.get(`image-bitmap:${e}`);
			if (a !== void 0) {
				if (i.manager.itemStart(e), a.then) {
					a.then((n) => {
						As.has(a) === !0 ? (r && r(As.get(a)), i.manager.itemError(e), i.manager.itemEnd(e)) : (t && t(n), i.manager.itemEnd(e));
					});
					return;
				}
				setTimeout(function() {
					t && t(a), i.manager.itemEnd(e);
				}, 0);
				return;
			}
			let o = {};
			o.credentials = this.crossOrigin === "anonymous" ? "same-origin" : "include", o.headers = this.requestHeader, o.signal = typeof AbortSignal.any == "function" ? AbortSignal.any([this._abortController.signal, this.manager.abortController.signal]) : this._abortController.signal;
			let s = fetch(e, o).then(function(e) {
				return e.blob();
			}).then(function(e) {
				return createImageBitmap(e, Object.assign(i.options, { colorSpaceConversion: "none" }));
			}).then(function(n) {
				Zo.add(`image-bitmap:${e}`, n), t && t(n), i.manager.itemEnd(e);
			}).catch(function(t) {
				r && r(t), As.set(s, t), Zo.remove(`image-bitmap:${e}`), i.manager.itemError(e), i.manager.itemEnd(e);
			});
			Zo.add(`image-bitmap:${e}`, s), i.manager.itemStart(e);
		}
		abort() {
			return this._abortController.abort(), this._abortController = new AbortController(), this;
		}
	}, Ms = -90, Ns = 1, Ps = class extends Vr {
		constructor(e, t, n) {
			super(), this.type = "CubeCamera", this.renderTarget = n, this.coordinateSystem = null, this.activeMipmapLevel = 0;
			let r = new ys(Ms, Ns, e, t);
			r.layers = this.layers, this.add(r);
			let i = new ys(Ms, Ns, e, t);
			i.layers = this.layers, this.add(i);
			let a = new ys(Ms, Ns, e, t);
			a.layers = this.layers, this.add(a);
			let o = new ys(Ms, Ns, e, t);
			o.layers = this.layers, this.add(o);
			let s = new ys(Ms, Ns, e, t);
			s.layers = this.layers, this.add(s);
			let c = new ys(Ms, Ns, e, t);
			c.layers = this.layers, this.add(c);
		}
		updateCoordinateSystem() {
			let e = this.coordinateSystem, t = this.children.concat(), [n, r, i, a, o, s] = t;
			for (let e of t) this.remove(e);
			if (e === 2e3) n.up.set(0, 1, 0), n.lookAt(1, 0, 0), r.up.set(0, 1, 0), r.lookAt(-1, 0, 0), i.up.set(0, 0, -1), i.lookAt(0, 1, 0), a.up.set(0, 0, 1), a.lookAt(0, -1, 0), o.up.set(0, 1, 0), o.lookAt(0, 0, 1), s.up.set(0, 1, 0), s.lookAt(0, 0, -1);
			else if (e === 2001) n.up.set(0, -1, 0), n.lookAt(-1, 0, 0), r.up.set(0, -1, 0), r.lookAt(1, 0, 0), i.up.set(0, 0, 1), i.lookAt(0, 1, 0), a.up.set(0, 0, -1), a.lookAt(0, -1, 0), o.up.set(0, -1, 0), o.lookAt(0, 0, 1), s.up.set(0, -1, 0), s.lookAt(0, 0, -1);
			else throw Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: " + e);
			for (let e of t) this.add(e), e.updateMatrixWorld();
		}
		update(e, t) {
			this.parent === null && this.updateMatrixWorld();
			let { renderTarget: n, activeMipmapLevel: r } = this;
			this.coordinateSystem !== e.coordinateSystem && (this.coordinateSystem = e.coordinateSystem, this.updateCoordinateSystem());
			let [i, a, o, s, c, l] = this.children, u = e.getRenderTarget(), d = e.getActiveCubeFace(), f = e.getActiveMipmapLevel(), p = e.xr.enabled;
			e.xr.enabled = !1;
			let m = n.texture.generateMipmaps;
			n.texture.generateMipmaps = !1;
			let h = !1;
			h = e.isWebGLRenderer === !0 ? e.state.buffers.depth.getReversed() : e.reversedDepthBuffer, e.setRenderTarget(n, 0, r), h && e.autoClear === !1 && e.clearDepth(), e.render(t, i), e.setRenderTarget(n, 1, r), h && e.autoClear === !1 && e.clearDepth(), e.render(t, a), e.setRenderTarget(n, 2, r), h && e.autoClear === !1 && e.clearDepth(), e.render(t, o), e.setRenderTarget(n, 3, r), h && e.autoClear === !1 && e.clearDepth(), e.render(t, s), e.setRenderTarget(n, 4, r), h && e.autoClear === !1 && e.clearDepth(), e.render(t, c), n.texture.generateMipmaps = m, e.setRenderTarget(n, 5, r), h && e.autoClear === !1 && e.clearDepth(), e.render(t, l), e.setRenderTarget(u, d, f), e.xr.enabled = p, n.texture.needsPMREMUpdate = !0;
		}
	}, Fs = class extends ys {
		constructor(e = []) {
			super(), this.isArrayCamera = !0, this.isMultiViewCamera = !1, this.cameras = e;
		}
	}, Is = class {
		constructor(e, t, n) {
			this.binding = e, this.valueSize = n;
			let r, i, a;
			switch (t) {
				case "quaternion":
					r = this._slerp, i = this._slerpAdditive, a = this._setAdditiveIdentityQuaternion, this.buffer = new Float64Array(n * 6), this._workIndex = 5;
					break;
				case "string":
				case "bool":
					r = this._select, i = this._select, a = this._setAdditiveIdentityOther, this.buffer = Array(n * 5);
					break;
				default: r = this._lerp, i = this._lerpAdditive, a = this._setAdditiveIdentityNumeric, this.buffer = new Float64Array(n * 5);
			}
			this._mixBufferRegion = r, this._mixBufferRegionAdditive = i, this._setIdentity = a, this._origIndex = 3, this._addIndex = 4, this.cumulativeWeight = 0, this.cumulativeWeightAdditive = 0, this.useCount = 0, this.referenceCount = 0;
		}
		accumulate(e, t) {
			let n = this.buffer, r = this.valueSize, i = e * r + r, a = this.cumulativeWeight;
			if (a === 0) {
				for (let e = 0; e !== r; ++e) n[i + e] = n[e];
				a = t;
			} else {
				a += t;
				let e = t / a;
				this._mixBufferRegion(n, i, 0, e, r);
			}
			this.cumulativeWeight = a;
		}
		accumulateAdditive(e) {
			let t = this.buffer, n = this.valueSize, r = n * this._addIndex;
			this.cumulativeWeightAdditive === 0 && this._setIdentity(), this._mixBufferRegionAdditive(t, r, 0, e, n), this.cumulativeWeightAdditive += e;
		}
		apply(e) {
			let t = this.valueSize, n = this.buffer, r = e * t + t, i = this.cumulativeWeight, a = this.cumulativeWeightAdditive, o = this.binding;
			if (this.cumulativeWeight = 0, this.cumulativeWeightAdditive = 0, i < 1) {
				let e = t * this._origIndex;
				this._mixBufferRegion(n, r, e, 1 - i, t);
			}
			a > 0 && this._mixBufferRegionAdditive(n, r, this._addIndex * t, 1, t);
			for (let e = t, i = t + t; e !== i; ++e) if (n[e] !== n[e + t]) {
				o.setValue(n, r);
				break;
			}
		}
		saveOriginalState() {
			let e = this.binding, t = this.buffer, n = this.valueSize, r = n * this._origIndex;
			e.getValue(t, r);
			for (let e = n, i = r; e !== i; ++e) t[e] = t[r + e % n];
			this._setIdentity(), this.cumulativeWeight = 0, this.cumulativeWeightAdditive = 0;
		}
		restoreOriginalState() {
			let e = this.valueSize * 3;
			this.binding.setValue(this.buffer, e);
		}
		_setAdditiveIdentityNumeric() {
			let e = this._addIndex * this.valueSize, t = e + this.valueSize;
			for (let n = e; n < t; n++) this.buffer[n] = 0;
		}
		_setAdditiveIdentityQuaternion() {
			this._setAdditiveIdentityNumeric(), this.buffer[this._addIndex * this.valueSize + 3] = 1;
		}
		_setAdditiveIdentityOther() {
			let e = this._origIndex * this.valueSize, t = this._addIndex * this.valueSize;
			for (let n = 0; n < this.valueSize; n++) this.buffer[t + n] = this.buffer[e + n];
		}
		_select(e, t, n, r, i) {
			if (r >= .5) for (let r = 0; r !== i; ++r) e[t + r] = e[n + r];
		}
		_slerp(e, t, n, r) {
			Zn.slerpFlat(e, t, e, t, e, n, r);
		}
		_slerpAdditive(e, t, n, r, i) {
			let a = this._workIndex * i;
			Zn.multiplyQuaternionsFlat(e, a, e, t, e, n), Zn.slerpFlat(e, t, e, t, e, a, r);
		}
		_lerp(e, t, n, r, i) {
			let a = 1 - r;
			for (let o = 0; o !== i; ++o) {
				let i = t + o;
				e[i] = e[i] * a + e[n + o] * r;
			}
		}
		_lerpAdditive(e, t, n, r, i) {
			for (let a = 0; a !== i; ++a) {
				let i = t + a;
				e[i] = e[i] + e[n + a] * r;
			}
		}
	}, Ls = "\\[\\]\\.:\\/", Rs = /* @__PURE__ */ RegExp("[\\[\\]\\.:\\/]", "g"), zs = "[^\\[\\]\\.:\\/]", Bs = "[^" + Ls.replace("\\.", "") + "]", Vs = /*@__PURE__*/ "((?:WC+[\\/:])*)".replace("WC", zs), Hs = /*@__PURE__*/ "(WCOD+)?".replace("WCOD", Bs), Us = /*@__PURE__*/ "(?:\\.(WC+)(?:\\[(.+)\\])?)?".replace("WC", zs), Ws = /*@__PURE__*/ "\\.(WC+)(?:\\[(.+)\\])?".replace("WC", zs), Gs = RegExp("^" + Vs + Hs + Us + Ws + "$"), Ks = [
		"material",
		"materials",
		"bones",
		"map"
	], qs = class {
		constructor(e, t, n) {
			let r = n || Js.parseTrackName(t);
			this._targetGroup = e, this._bindings = e.subscribe_(t, r);
		}
		getValue(e, t) {
			this.bind();
			let n = this._targetGroup.nCachedObjects_, r = this._bindings[n];
			r !== void 0 && r.getValue(e, t);
		}
		setValue(e, t) {
			let n = this._bindings;
			for (let r = this._targetGroup.nCachedObjects_, i = n.length; r !== i; ++r) n[r].setValue(e, t);
		}
		bind() {
			let e = this._bindings;
			for (let t = this._targetGroup.nCachedObjects_, n = e.length; t !== n; ++t) e[t].bind();
		}
		unbind() {
			let e = this._bindings;
			for (let t = this._targetGroup.nCachedObjects_, n = e.length; t !== n; ++t) e[t].unbind();
		}
	}, Js = class e {
		constructor(t, n, r) {
			this.path = n, this.parsedPath = r || e.parseTrackName(n), this.node = e.findNode(t, this.parsedPath.nodeName), this.rootNode = t, this.getValue = this._getValue_unbound, this.setValue = this._setValue_unbound;
		}
		static create(t, n, r) {
			return t && t.isAnimationObjectGroup ? new e.Composite(t, n, r) : new e(t, n, r);
		}
		static sanitizeNodeName(e) {
			return e.replace(/\s/g, "_").replace(Rs, "");
		}
		static parseTrackName(e) {
			let t = Gs.exec(e);
			if (t === null) throw Error("THREE.PropertyBinding: Cannot parse trackName: " + e);
			let n = {
				nodeName: t[2],
				objectName: t[3],
				objectIndex: t[4],
				propertyName: t[5],
				propertyIndex: t[6]
			}, r = n.nodeName && n.nodeName.lastIndexOf(".");
			if (r !== void 0 && r !== -1) {
				let e = n.nodeName.substring(r + 1);
				Ks.indexOf(e) !== -1 && (n.nodeName = n.nodeName.substring(0, r), n.objectName = e);
			}
			if (n.propertyName === null || n.propertyName.length === 0) throw Error("THREE.PropertyBinding: can not parse propertyName from trackName: " + e);
			return n;
		}
		static findNode(e, t) {
			if (t === void 0 || t === "" || t === "." || t === -1 || t === e.name || t === e.uuid) return e;
			if (e.skeleton) {
				let n = e.skeleton.getBoneByName(t);
				if (n !== void 0) return n;
			}
			if (e.children) {
				let n = function(e) {
					for (let r = 0; r < e.length; r++) {
						let i = e[r];
						if (i.name === t || i.uuid === t) return i;
						let a = n(i.children);
						if (a) return a;
					}
					return null;
				}, r = n(e.children);
				if (r) return r;
			}
			return null;
		}
		_getValue_unavailable() {}
		_setValue_unavailable() {}
		_getValue_direct(e, t) {
			e[t] = this.targetObject[this.propertyName];
		}
		_getValue_array(e, t) {
			let n = this.resolvedProperty;
			for (let r = 0, i = n.length; r !== i; ++r) e[t++] = n[r];
		}
		_getValue_arrayElement(e, t) {
			e[t] = this.resolvedProperty[this.propertyIndex];
		}
		_getValue_toArray(e, t) {
			this.resolvedProperty.toArray(e, t);
		}
		_setValue_direct(e, t) {
			this.targetObject[this.propertyName] = e[t];
		}
		_setValue_direct_setNeedsUpdate(e, t) {
			this.targetObject[this.propertyName] = e[t], this.targetObject.needsUpdate = !0;
		}
		_setValue_direct_setMatrixWorldNeedsUpdate(e, t) {
			this.targetObject[this.propertyName] = e[t], this.targetObject.matrixWorldNeedsUpdate = !0;
		}
		_setValue_array(e, t) {
			let n = this.resolvedProperty;
			for (let r = 0, i = n.length; r !== i; ++r) n[r] = e[t++];
		}
		_setValue_array_setNeedsUpdate(e, t) {
			let n = this.resolvedProperty;
			for (let r = 0, i = n.length; r !== i; ++r) n[r] = e[t++];
			this.targetObject.needsUpdate = !0;
		}
		_setValue_array_setMatrixWorldNeedsUpdate(e, t) {
			let n = this.resolvedProperty;
			for (let r = 0, i = n.length; r !== i; ++r) n[r] = e[t++];
			this.targetObject.matrixWorldNeedsUpdate = !0;
		}
		_setValue_arrayElement(e, t) {
			this.resolvedProperty[this.propertyIndex] = e[t];
		}
		_setValue_arrayElement_setNeedsUpdate(e, t) {
			this.resolvedProperty[this.propertyIndex] = e[t], this.targetObject.needsUpdate = !0;
		}
		_setValue_arrayElement_setMatrixWorldNeedsUpdate(e, t) {
			this.resolvedProperty[this.propertyIndex] = e[t], this.targetObject.matrixWorldNeedsUpdate = !0;
		}
		_setValue_fromArray(e, t) {
			this.resolvedProperty.fromArray(e, t);
		}
		_setValue_fromArray_setNeedsUpdate(e, t) {
			this.resolvedProperty.fromArray(e, t), this.targetObject.needsUpdate = !0;
		}
		_setValue_fromArray_setMatrixWorldNeedsUpdate(e, t) {
			this.resolvedProperty.fromArray(e, t), this.targetObject.matrixWorldNeedsUpdate = !0;
		}
		_getValue_unbound(e, t) {
			this.bind(), this.getValue(e, t);
		}
		_setValue_unbound(e, t) {
			this.bind(), this.setValue(e, t);
		}
		bind() {
			let t = this.node, n = this.parsedPath, r = n.objectName, i = n.propertyName, a = n.propertyIndex;
			if (t || (t = e.findNode(this.rootNode, n.nodeName), this.node = t), this.getValue = this._getValue_unavailable, this.setValue = this._setValue_unavailable, !t) {
				u("PropertyBinding: No target node found for track: " + this.path + ".");
				return;
			}
			if (r) {
				let e = n.objectIndex;
				switch (r) {
					case "materials":
						if (!t.material) {
							d("PropertyBinding: Can not bind to material as node does not have a material.", this);
							return;
						}
						if (!t.material.materials) {
							d("PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.", this);
							return;
						}
						t = t.material.materials;
						break;
					case "bones":
						if (!t.skeleton) {
							d("PropertyBinding: Can not bind to bones as node does not have a skeleton.", this);
							return;
						}
						t = t.skeleton.bones;
						for (let n = 0; n < t.length; n++) if (t[n].name === e) {
							e = n;
							break;
						}
						break;
					case "map":
						if ("map" in t) {
							t = t.map;
							break;
						}
						if (!t.material) {
							d("PropertyBinding: Can not bind to material as node does not have a material.", this);
							return;
						}
						if (!t.material.map) {
							d("PropertyBinding: Can not bind to material.map as node.material does not have a map.", this);
							return;
						}
						t = t.material.map;
						break;
					default:
						if (t[r] === void 0) {
							d("PropertyBinding: Can not bind to objectName of node undefined.", this);
							return;
						}
						t = t[r];
				}
				if (e !== void 0) {
					if (t[e] === void 0) {
						d("PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.", this, t);
						return;
					}
					t = t[e];
				}
			}
			let o = t[i];
			if (o === void 0) {
				let e = n.nodeName;
				d("PropertyBinding: Trying to update property for track: " + e + "." + i + " but it wasn't found.", t);
				return;
			}
			let s = this.Versioning.None;
			this.targetObject = t, t.isMaterial === !0 ? s = this.Versioning.NeedsUpdate : t.isObject3D === !0 && (s = this.Versioning.MatrixWorldNeedsUpdate);
			let c = this.BindingType.Direct;
			if (a !== void 0) {
				if (i === "morphTargetInfluences") {
					if (!t.geometry) {
						d("PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.", this);
						return;
					}
					if (!t.geometry.morphAttributes) {
						d("PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.", this);
						return;
					}
					t.morphTargetDictionary[a] !== void 0 && (a = t.morphTargetDictionary[a]);
				}
				c = this.BindingType.ArrayElement, this.resolvedProperty = o, this.propertyIndex = a;
			} else o.fromArray !== void 0 && o.toArray !== void 0 ? (c = this.BindingType.HasFromToArray, this.resolvedProperty = o) : Array.isArray(o) ? (c = this.BindingType.EntireArray, this.resolvedProperty = o) : this.propertyName = i;
			this.getValue = this.GetterByBindingType[c], this.setValue = this.SetterByBindingTypeAndVersioning[c][s];
		}
		unbind() {
			this.node = null, this.getValue = this._getValue_unbound, this.setValue = this._setValue_unbound;
		}
	}, Js.Composite = qs, Js.prototype.BindingType = {
		Direct: 0,
		EntireArray: 1,
		ArrayElement: 2,
		HasFromToArray: 3
	}, Js.prototype.Versioning = {
		None: 0,
		NeedsUpdate: 1,
		MatrixWorldNeedsUpdate: 2
	}, Js.prototype.GetterByBindingType = [
		Js.prototype._getValue_direct,
		Js.prototype._getValue_array,
		Js.prototype._getValue_arrayElement,
		Js.prototype._getValue_toArray
	], Js.prototype.SetterByBindingTypeAndVersioning = [
		[
			Js.prototype._setValue_direct,
			Js.prototype._setValue_direct_setNeedsUpdate,
			Js.prototype._setValue_direct_setMatrixWorldNeedsUpdate
		],
		[
			Js.prototype._setValue_array,
			Js.prototype._setValue_array_setNeedsUpdate,
			Js.prototype._setValue_array_setMatrixWorldNeedsUpdate
		],
		[
			Js.prototype._setValue_arrayElement,
			Js.prototype._setValue_arrayElement_setNeedsUpdate,
			Js.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate
		],
		[
			Js.prototype._setValue_fromArray,
			Js.prototype._setValue_fromArray_setNeedsUpdate,
			Js.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate
		]
	], Ys = class {
		constructor(e, t, n = null, r = t.blendMode) {
			this._mixer = e, this._clip = t, this._localRoot = n, this.blendMode = r;
			let i = t.tracks, a = i.length, o = Array(a), s = {
				endingStart: An,
				endingEnd: An
			};
			for (let e = 0; e !== a; ++e) {
				let t = i[e].createInterpolant(null);
				o[e] = t, t.settings = s;
			}
			this._interpolantSettings = s, this._interpolants = o, this._propertyBindings = Array(a), this._cacheIndex = null, this._byClipCacheIndex = null, this._timeScaleInterpolant = null, this._restoreTimeScale = null, this._weightInterpolant = null, this.loop = wn, this._loopCount = -1, this._startTime = null, this.time = 0, this.timeScale = 1, this._effectiveTimeScale = 1, this.weight = 1, this._effectiveWeight = 1, this.repetitions = Infinity, this.paused = !1, this.enabled = !0, this.clampWhenFinished = !1, this.zeroSlopeAtStart = !0, this.zeroSlopeAtEnd = !0;
		}
		play() {
			return this._mixer._activateAction(this), this;
		}
		stop() {
			return this._mixer._deactivateAction(this), this.reset();
		}
		reset() {
			return this.paused = !1, this.enabled = !0, this.time = 0, this._loopCount = -1, this._startTime = null, this.stopFading().stopWarping();
		}
		isRunning() {
			return this.enabled && !this.paused && this.timeScale !== 0 && this._startTime === null && this._mixer._isActiveAction(this);
		}
		isScheduled() {
			return this._mixer._isActiveAction(this);
		}
		startAt(e) {
			return this._startTime = e, this;
		}
		setLoop(e, t) {
			return this.loop = e, this.repetitions = t, this;
		}
		setEffectiveWeight(e) {
			return this.weight = e, this._effectiveWeight = this.enabled ? e : 0, this.stopFading();
		}
		getEffectiveWeight() {
			return this._effectiveWeight;
		}
		fadeIn(e) {
			return this._scheduleFading(e, 0, 1);
		}
		fadeOut(e) {
			return this._scheduleFading(e, 1, 0);
		}
		crossFadeFrom(e, t, n = !1) {
			if (e.fadeOut(t), this.fadeIn(t), n === !0) {
				let n = this._clip.duration, r = e._clip.duration, i = r / n, a = n / r;
				e._restoreTimeScale = e.timeScale, this._restoreTimeScale = this.timeScale, e.warp(1, i, t), this.warp(a, 1, t);
			}
			return this;
		}
		crossFadeTo(e, t, n = !1) {
			return e.crossFadeFrom(this, t, n);
		}
		stopFading() {
			let e = this._weightInterpolant;
			return e !== null && (this._weightInterpolant = null, this._mixer._takeBackControlInterpolant(e)), this;
		}
		setEffectiveTimeScale(e) {
			return this.timeScale = e, this._effectiveTimeScale = this.paused ? 0 : e, this.stopWarping();
		}
		getEffectiveTimeScale() {
			return this._effectiveTimeScale;
		}
		setDuration(e) {
			return this.timeScale = this._clip.duration / e, this.stopWarping();
		}
		syncWith(e) {
			return this.time = e.time, this.timeScale = e.timeScale, this.stopWarping();
		}
		halt(e) {
			return this.warp(this._effectiveTimeScale, 0, e);
		}
		warp(e, t, n) {
			let r = this._mixer, i = r.time, a = this.timeScale, o = this._timeScaleInterpolant;
			o === null && (o = r._lendControlInterpolant(), this._timeScaleInterpolant = o);
			let s = o.parameterPositions, c = o.sampleValues;
			return s[0] = i, s[1] = i + n, c[0] = e / a, c[1] = t / a, this;
		}
		stopWarping() {
			let e = this._timeScaleInterpolant;
			return e !== null && (this._timeScaleInterpolant = null, this._mixer._takeBackControlInterpolant(e)), this._restoreTimeScale = null, this;
		}
		getMixer() {
			return this._mixer;
		}
		getClip() {
			return this._clip;
		}
		getRoot() {
			return this._localRoot || this._mixer._root;
		}
		_update(e, t, n, r) {
			if (!this.enabled) {
				this._updateWeight(e);
				return;
			}
			let i = this._startTime;
			if (i !== null) {
				let r = (e - i) * n;
				r < 0 || n === 0 ? t = 0 : (this._startTime = null, t = n * r);
			}
			t *= this._updateTimeScale(e);
			let a = this._updateTime(t), o = this._updateWeight(e);
			if (o > 0) {
				let e = this._interpolants, t = this._propertyBindings;
				switch (this.blendMode) {
					case Pn:
						for (let n = 0, r = e.length; n !== r; ++n) e[n].evaluate(a), t[n].accumulateAdditive(o);
						break;
					case Nn:
					default: for (let n = 0, i = e.length; n !== i; ++n) e[n].evaluate(a), t[n].accumulate(r, o);
				}
			}
		}
		_updateWeight(e) {
			let t = 0;
			if (this.enabled) {
				t = this.weight;
				let n = this._weightInterpolant;
				if (n !== null) {
					let r = n.evaluate(e)[0];
					t *= r, e > n.parameterPositions[1] && (this.stopFading(), r === 0 && (this.enabled = !1));
				}
			}
			return this._effectiveWeight = t, t;
		}
		_updateTimeScale(e) {
			let t = 0;
			if (!this.paused) {
				t = this.timeScale;
				let n = this._timeScaleInterpolant;
				if (n !== null) {
					let r = n.evaluate(e)[0];
					t *= r, e > n.parameterPositions[1] && (t === 0 ? this.paused = !0 : (this._restoreTimeScale !== null && (t = this._restoreTimeScale), this.timeScale = t), this.stopWarping());
				}
			}
			return this._effectiveTimeScale = t, t;
		}
		_updateTime(e) {
			let t = this._clip.duration, n = this.loop, r = this.time + e, i = this._loopCount, a = n === Tn;
			if (e === 0) return i === -1 ? r : a && (i & 1) == 1 ? t - r : r;
			if (n === 2200) {
				i === -1 && (this._loopCount = 0, this._setEndings(!0, !0, !1));
				handle_stop: {
					if (r >= t) r = t;
					else if (r < 0) r = 0;
					else {
						this.time = r;
						break handle_stop;
					}
					this.clampWhenFinished ? this.paused = !0 : this.enabled = !1, this.time = r, this._mixer.dispatchEvent({
						type: "finished",
						action: this,
						direction: e < 0 ? -1 : 1
					});
				}
			} else {
				if (i === -1 && (e >= 0 ? (i = 0, this._setEndings(!0, this.repetitions === 0, a)) : this._setEndings(this.repetitions === 0, !0, a)), r >= t || r < 0) {
					let n = Math.floor(r / t);
					r -= t * n, i += Math.abs(n);
					let o = this.repetitions - i;
					if (o <= 0) this.clampWhenFinished ? this.paused = !0 : this.enabled = !1, r = e > 0 ? t : 0, this.time = r, this._mixer.dispatchEvent({
						type: "finished",
						action: this,
						direction: e > 0 ? 1 : -1
					});
					else {
						if (o === 1) {
							let t = e < 0;
							this._setEndings(t, !t, a);
						} else this._setEndings(!1, !1, a);
						this._loopCount = i, this.time = r, this._mixer.dispatchEvent({
							type: "loop",
							action: this,
							loopDelta: n
						});
					}
				} else this._loopCount = i, this.time = r;
				if (a && (i & 1) == 1) return t - r;
			}
			return r;
		}
		_setEndings(e, t, n) {
			let r = this._interpolantSettings;
			n ? (r.endingStart = jn, r.endingEnd = jn) : (r.endingStart = e ? this.zeroSlopeAtStart ? jn : An : Mn, r.endingEnd = t ? this.zeroSlopeAtEnd ? jn : An : Mn);
		}
		_scheduleFading(e, t, n) {
			let r = this._mixer, i = r.time, a = this._weightInterpolant;
			a === null && (a = r._lendControlInterpolant(), this._weightInterpolant = a);
			let o = a.parameterPositions, s = a.sampleValues;
			return o[0] = i, s[0] = t, o[1] = i + e, s[1] = n, this;
		}
	}, Xs = /* @__PURE__ */ new Float32Array(1), Zs = class extends Gn {
		constructor(e) {
			super(), this._root = e, this._initMemoryManager(), this._accuIndex = 0, this.time = 0, this.timeScale = 1, typeof __THREE_DEVTOOLS__ < "u" && __THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe", { detail: this }));
		}
		_bindAction(e, t) {
			let n = e._localRoot || this._root, r = e._clip.tracks, i = r.length, a = e._propertyBindings, o = e._interpolants, s = n.uuid, c = this._bindingsByRootAndName, l = c[s];
			l === void 0 && (l = {}, c[s] = l);
			for (let e = 0; e !== i; ++e) {
				let i = r[e], c = i.name, u = l[c];
				if (u !== void 0) ++u.referenceCount, a[e] = u;
				else {
					if (u = a[e], u !== void 0) {
						u._cacheIndex === null && (++u.referenceCount, this._addInactiveBinding(u, s, c));
						continue;
					}
					let r = t && t._propertyBindings[e].binding.parsedPath;
					u = new Is(Js.create(n, c, r), i.ValueTypeName, i.getValueSize()), ++u.referenceCount, this._addInactiveBinding(u, s, c), a[e] = u;
				}
				o[e].resultBuffer = u.buffer;
			}
		}
		_activateAction(e) {
			if (!this._isActiveAction(e)) {
				if (e._cacheIndex === null) {
					let t = (e._localRoot || this._root).uuid, n = e._clip.uuid, r = this._actionsByClip[n];
					this._bindAction(e, r && r.knownActions[0]), this._addInactiveAction(e, n, t);
				}
				let t = e._propertyBindings;
				for (let e = 0, n = t.length; e !== n; ++e) {
					let n = t[e];
					n.useCount++ === 0 && (this._lendBinding(n), n.saveOriginalState());
				}
				this._lendAction(e);
			}
		}
		_deactivateAction(e) {
			if (this._isActiveAction(e)) {
				let t = e._propertyBindings;
				for (let e = 0, n = t.length; e !== n; ++e) {
					let n = t[e];
					--n.useCount === 0 && (n.restoreOriginalState(), this._takeBackBinding(n));
				}
				this._takeBackAction(e);
			}
		}
		_initMemoryManager() {
			this._actions = [], this._nActiveActions = 0, this._actionsByClip = {}, this._bindings = [], this._nActiveBindings = 0, this._bindingsByRootAndName = {}, this._controlInterpolants = [], this._nActiveControlInterpolants = 0;
			let e = this;
			this.stats = {
				actions: {
					get total() {
						return e._actions.length;
					},
					get inUse() {
						return e._nActiveActions;
					}
				},
				bindings: {
					get total() {
						return e._bindings.length;
					},
					get inUse() {
						return e._nActiveBindings;
					}
				},
				controlInterpolants: {
					get total() {
						return e._controlInterpolants.length;
					},
					get inUse() {
						return e._nActiveControlInterpolants;
					}
				}
			};
		}
		_isActiveAction(e) {
			let t = e._cacheIndex;
			return t !== null && t < this._nActiveActions;
		}
		_addInactiveAction(e, t, n) {
			let r = this._actions, i = this._actionsByClip, a = i[t];
			if (a === void 0) a = {
				knownActions: [e],
				actionByRoot: {}
			}, e._byClipCacheIndex = 0, i[t] = a;
			else {
				let t = a.knownActions;
				e._byClipCacheIndex = t.length, t.push(e);
			}
			e._cacheIndex = r.length, r.push(e), a.actionByRoot[n] = e;
		}
		_removeInactiveAction(e) {
			let t = this._actions, n = t[t.length - 1], r = e._cacheIndex;
			n._cacheIndex = r, t[r] = n, t.pop(), e._cacheIndex = null;
			let i = e._clip.uuid, a = this._actionsByClip, o = a[i], s = o.knownActions, c = s[s.length - 1], l = e._byClipCacheIndex;
			c._byClipCacheIndex = l, s[l] = c, s.pop(), e._byClipCacheIndex = null;
			let u = o.actionByRoot, d = (e._localRoot || this._root).uuid;
			delete u[d], s.length === 0 && delete a[i], this._removeInactiveBindingsForAction(e);
		}
		_removeInactiveBindingsForAction(e) {
			let t = e._propertyBindings;
			for (let e = 0, n = t.length; e !== n; ++e) {
				let n = t[e];
				--n.referenceCount === 0 && this._removeInactiveBinding(n);
			}
		}
		_lendAction(e) {
			let t = this._actions, n = e._cacheIndex, r = this._nActiveActions++, i = t[r];
			e._cacheIndex = r, t[r] = e, i._cacheIndex = n, t[n] = i;
		}
		_takeBackAction(e) {
			let t = this._actions, n = e._cacheIndex, r = --this._nActiveActions, i = t[r];
			e._cacheIndex = r, t[r] = e, i._cacheIndex = n, t[n] = i;
		}
		_addInactiveBinding(e, t, n) {
			let r = this._bindingsByRootAndName, i = this._bindings, a = r[t];
			a === void 0 && (a = {}, r[t] = a), a[n] = e, e._cacheIndex = i.length, i.push(e);
		}
		_removeInactiveBinding(e) {
			let t = this._bindings, n = e.binding, r = n.rootNode.uuid, i = n.path, a = this._bindingsByRootAndName, o = a[r], s = t[t.length - 1], c = e._cacheIndex;
			s._cacheIndex = c, t[c] = s, t.pop(), delete o[i], Object.keys(o).length === 0 && delete a[r];
		}
		_lendBinding(e) {
			let t = this._bindings, n = e._cacheIndex, r = this._nActiveBindings++, i = t[r];
			e._cacheIndex = r, t[r] = e, i._cacheIndex = n, t[n] = i;
		}
		_takeBackBinding(e) {
			let t = this._bindings, n = e._cacheIndex, r = --this._nActiveBindings, i = t[r];
			e._cacheIndex = r, t[r] = e, i._cacheIndex = n, t[n] = i;
		}
		_lendControlInterpolant() {
			let e = this._controlInterpolants, t = this._nActiveControlInterpolants++, n = e[t];
			return n === void 0 && (n = new zo(/* @__PURE__ */ new Float32Array(2), /* @__PURE__ */ new Float32Array(2), 1, Xs), n.__cacheIndex = t, e[t] = n), n;
		}
		_takeBackControlInterpolant(e) {
			let t = this._controlInterpolants, n = e.__cacheIndex, r = --this._nActiveControlInterpolants, i = t[r];
			e.__cacheIndex = r, t[r] = e, i.__cacheIndex = n, t[n] = i;
		}
		clipAction(e, t, n) {
			let r = t || this._root, i = r.uuid, a = typeof e == "string" ? Xo.findByName(r, e) : e, o = a === null ? e : a.uuid, s = this._actionsByClip[o], c = null;
			if (n === void 0 && (n = a === null ? Nn : a.blendMode), s !== void 0) {
				let e = s.actionByRoot[i];
				if (e !== void 0 && e.blendMode === n) return e;
				c = s.knownActions[0], a === null && (a = c._clip);
			}
			if (a === null) return null;
			let l = new Ys(this, a, t, n);
			return this._bindAction(l, c), this._addInactiveAction(l, o, i), l;
		}
		existingAction(e, t) {
			let n = t || this._root, r = n.uuid, i = typeof e == "string" ? Xo.findByName(n, e) : e, a = i ? i.uuid : e, o = this._actionsByClip[a];
			return o === void 0 ? null : o.actionByRoot[r] || null;
		}
		stopAllAction() {
			let e = this._actions, t = this._nActiveActions;
			for (let n = t - 1; n >= 0; --n) e[n].stop();
			return this;
		}
		update(e) {
			e *= this.timeScale;
			let t = this._actions, n = this._nActiveActions, r = this.time += e, i = Math.sign(e), a = this._accuIndex ^= 1;
			for (let o = 0; o !== n; ++o) t[o]._update(r, e, i, a);
			let o = this._bindings, s = this._nActiveBindings;
			for (let e = 0; e !== s; ++e) o[e].apply(a);
			return this;
		}
		setTime(e) {
			this.time = 0;
			for (let e = 0; e < this._actions.length; e++) this._actions[e].time = 0;
			return this.update(e);
		}
		getRoot() {
			return this._root;
		}
		uncacheClip(e) {
			let t = this._actions, n = e.uuid, r = this._actionsByClip, i = r[n];
			if (i !== void 0) {
				let e = i.knownActions;
				for (let n = 0, r = e.length; n !== r; ++n) {
					let r = e[n];
					this._deactivateAction(r);
					let i = r._cacheIndex, a = t[t.length - 1];
					r._cacheIndex = null, r._byClipCacheIndex = null, a._cacheIndex = i, t[i] = a, t.pop(), this._removeInactiveBindingsForAction(r);
				}
				delete r[n];
			}
		}
		uncacheRoot(e) {
			let t = e.uuid, n = this._actionsByClip;
			for (let e in n) {
				let r = n[e].actionByRoot[t];
				r !== void 0 && (this._deactivateAction(r), this._removeInactiveAction(r));
			}
			let r = this._bindingsByRootAndName[t];
			if (r !== void 0) for (let e in r) {
				let t = r[e];
				t.restoreOriginalState(), this._removeInactiveBinding(t);
			}
		}
		uncacheAction(e, t) {
			let n = this.existingAction(e, t);
			n !== null && (this._deactivateAction(n), this._removeInactiveAction(n));
		}
	}, Qs = class {
		constructor(e, t, n, r) {
			this.elements = [
				1,
				0,
				0,
				1
			], e !== void 0 && this.set(e, t, n, r);
		}
		identity() {
			return this.set(1, 0, 0, 1), this;
		}
		fromArray(e, t = 0) {
			for (let n = 0; n < 4; n++) this.elements[n] = e[n + t];
			return this;
		}
		set(e, t, n, r) {
			let i = this.elements;
			return i[0] = e, i[2] = t, i[1] = n, i[3] = r, this;
		}
	}, it = Qs, it.prototype.isMatrix2 = !0, typeof __THREE_DEVTOOLS__ < "u" && __THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register", { detail: { revision: "185" } })), typeof window < "u" && (window.__THREE__ ? u("WARNING: Multiple instances of Three.js being imported.") : window.__THREE__ = "185");
}));
//#endregion
//#region node_modules/three/build/three.module.js
function ec() {
	let e = null, t = !1, n = null, r = null;
	function i(t, a) {
		n(t, a), r = e.requestAnimationFrame(i);
	}
	return {
		start: function() {
			t !== !0 && n !== null && e !== null && (r = e.requestAnimationFrame(i), t = !0);
		},
		stop: function() {
			e !== null && e.cancelAnimationFrame(r), t = !1;
		},
		setAnimationLoop: function(e) {
			n = e;
		},
		setContext: function(t) {
			e = t;
		}
	};
}
function tc(e) {
	let t = /* @__PURE__ */ new WeakMap();
	function n(t, n) {
		let r = t.array, i = t.usage, a = r.byteLength, o = e.createBuffer();
		e.bindBuffer(n, o), e.bufferData(n, r, i), t.onUploadCallback();
		let s;
		if (r instanceof Float32Array) s = e.FLOAT;
		else if (typeof Float16Array < "u" && r instanceof Float16Array) s = e.HALF_FLOAT;
		else if (r instanceof Uint16Array) s = t.isFloat16BufferAttribute ? e.HALF_FLOAT : e.UNSIGNED_SHORT;
		else if (r instanceof Int16Array) s = e.SHORT;
		else if (r instanceof Uint32Array) s = e.UNSIGNED_INT;
		else if (r instanceof Int32Array) s = e.INT;
		else if (r instanceof Int8Array) s = e.BYTE;
		else if (r instanceof Uint8Array) s = e.UNSIGNED_BYTE;
		else if (r instanceof Uint8ClampedArray) s = e.UNSIGNED_BYTE;
		else throw Error("THREE.WebGLAttributes: Unsupported buffer data format: " + r);
		return {
			buffer: o,
			type: s,
			bytesPerElement: r.BYTES_PER_ELEMENT,
			version: t.version,
			size: a
		};
	}
	function r(t, n, r) {
		let i = n.array, a = n.updateRanges;
		if (e.bindBuffer(r, t), a.length === 0) e.bufferSubData(r, 0, i);
		else {
			a.sort((e, t) => e.start - t.start);
			let t = 0;
			for (let e = 1; e < a.length; e++) {
				let n = a[t], r = a[e];
				r.start <= n.start + n.count + 1 ? n.count = Math.max(n.count, r.start + r.count - n.start) : (++t, a[t] = r);
			}
			a.length = t + 1;
			for (let t = 0, n = a.length; t < n; t++) {
				let n = a[t];
				e.bufferSubData(r, n.start * i.BYTES_PER_ELEMENT, i, n.start, n.count);
			}
			n.clearUpdateRanges();
		}
		n.onUploadCallback();
	}
	function i(e) {
		return e.isInterleavedBufferAttribute && (e = e.data), t.get(e);
	}
	function a(n) {
		n.isInterleavedBufferAttribute && (n = n.data);
		let r = t.get(n);
		r && (e.deleteBuffer(r.buffer), t.delete(n));
	}
	function o(e, i) {
		if (e.isInterleavedBufferAttribute && (e = e.data), e.isGLBufferAttribute) {
			let n = t.get(e);
			(!n || n.version < e.version) && t.set(e, {
				buffer: e.buffer,
				type: e.type,
				bytesPerElement: e.elementSize,
				version: e.version
			});
			return;
		}
		let a = t.get(e);
		if (a === void 0) t.set(e, n(e, i));
		else if (a.version < e.version) {
			if (a.size !== e.array.byteLength) throw Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");
			r(a.buffer, e, i), a.version = e.version;
		}
	}
	return {
		get: i,
		remove: a,
		update: o
	};
}
function nc(e, t, n, r, i, a) {
	let o = new J(0), s = i === !0 ? 0 : 1, c, l, u = null, d = 0, f = null;
	function p(e) {
		let n = e.isScene === !0 ? e.background : null;
		if (n && n.isTexture) {
			let r = e.backgroundBlurriness > 0;
			n = t.get(n, r);
		}
		return n;
	}
	function m(t) {
		let r = !1, i = p(t);
		i === null ? g(o, s) : i && i.isColor && (g(i, 1), r = !0);
		let c = e.xr.getEnvironmentBlendMode();
		c === "additive" ? n.buffers.color.setClear(0, 0, 0, 1, a) : c === "alpha-blend" && n.buffers.color.setClear(0, 0, 0, 0, a), (e.autoClear || r) && (n.buffers.depth.setTest(!0), n.buffers.depth.setMask(!0), n.buffers.color.setMask(!0), e.clear(e.autoClearColor, e.autoClearDepth, e.autoClearStencil));
	}
	function h(t, n) {
		let i = p(n);
		i && (i.isCubeTexture || i.mapping === 306) ? (l === void 0 && (l = new ma(new _o(1, 1, 1), new ko({
			name: "BackgroundCubeMaterial",
			uniforms: ze(au.backgroundCube.uniforms),
			vertexShader: au.backgroundCube.vertexShader,
			fragmentShader: au.backgroundCube.fragmentShader,
			side: 1,
			depthTest: !1,
			depthWrite: !1,
			fog: !1,
			allowOverride: !1
		})), l.geometry.deleteAttribute("normal"), l.geometry.deleteAttribute("uv"), l.onBeforeRender = function(e, t, n) {
			this.matrixWorld.copyPosition(n.matrixWorld);
		}, Object.defineProperty(l.material, "envMap", { get: function() {
			return this.uniforms.envMap.value;
		} }), r.update(l)), l.material.uniforms.envMap.value = i, l.material.uniforms.backgroundBlurriness.value = n.backgroundBlurriness, l.material.uniforms.backgroundIntensity.value = n.backgroundIntensity, l.material.uniforms.backgroundRotation.value.setFromMatrix4(su.makeRotationFromEuler(n.backgroundRotation)).transpose(), i.isCubeTexture && i.isRenderTargetTexture === !1 && l.material.uniforms.backgroundRotation.value.premultiply(cu), l.material.toneMapped = K.getTransfer(i.colorSpace) !== Rn, (u !== i || d !== i.version || f !== e.toneMapping) && (l.material.needsUpdate = !0, u = i, d = i.version, f = e.toneMapping), l.layers.enableAll(), t.unshift(l, l.geometry, l.material, 0, 0, null)) : i && i.isTexture && (c === void 0 && (c = new ma(new wo(2, 2), new ko({
			name: "BackgroundMaterial",
			uniforms: ze(au.background.uniforms),
			vertexShader: au.background.vertexShader,
			fragmentShader: au.background.fragmentShader,
			side: 0,
			depthTest: !1,
			depthWrite: !1,
			fog: !1,
			allowOverride: !1
		})), c.geometry.deleteAttribute("normal"), Object.defineProperty(c.material, "map", { get: function() {
			return this.uniforms.t2D.value;
		} }), r.update(c)), c.material.uniforms.t2D.value = i, c.material.uniforms.backgroundIntensity.value = n.backgroundIntensity, c.material.toneMapped = K.getTransfer(i.colorSpace) !== Rn, i.matrixAutoUpdate === !0 && i.updateMatrix(), c.material.uniforms.uvTransform.value.copy(i.matrix), (u !== i || d !== i.version || f !== e.toneMapping) && (c.material.needsUpdate = !0, u = i, d = i.version, f = e.toneMapping), c.layers.enableAll(), t.unshift(c, c.geometry, c.material, 0, 0, null));
	}
	function g(t, r) {
		t.getRGB(ou, Ue(e)), n.buffers.color.setClear(ou.r, ou.g, ou.b, r, a);
	}
	function _() {
		l !== void 0 && (l.geometry.dispose(), l.material.dispose(), l = void 0), c !== void 0 && (c.geometry.dispose(), c.material.dispose(), c = void 0);
	}
	return {
		getClearColor: function() {
			return o;
		},
		setClearColor: function(e, t = 1) {
			o.set(e), s = t, g(o, s);
		},
		getClearAlpha: function() {
			return s;
		},
		setClearAlpha: function(e) {
			s = e, g(o, s);
		},
		render: m,
		addToRenderList: h,
		dispose: _
	};
}
function rc(e, t) {
	let n = e.getParameter(e.MAX_VERTEX_ATTRIBS), r = {}, i = f(null), a = i, o = !1;
	function s(n, r, i, s, c) {
		let u = !1, f = d(n, s, i, r);
		a !== f && (a = f, l(a.object)), u = p(n, s, i, c), u && m(n, s, i, c), c !== null && t.update(c, e.ELEMENT_ARRAY_BUFFER), (u || o) && (o = !1, b(n, r, i, s), c !== null && e.bindBuffer(e.ELEMENT_ARRAY_BUFFER, t.get(c).buffer));
	}
	function c() {
		return e.createVertexArray();
	}
	function l(t) {
		return e.bindVertexArray(t);
	}
	function u(t) {
		return e.deleteVertexArray(t);
	}
	function d(e, t, n, i) {
		let a = i.wireframe === !0, o = r[t.id];
		o === void 0 && (o = {}, r[t.id] = o);
		let s = e.isInstancedMesh === !0 ? e.id : 0, l = o[s];
		l === void 0 && (l = {}, o[s] = l);
		let u = l[n.id];
		u === void 0 && (u = {}, l[n.id] = u);
		let d = u[a];
		return d === void 0 && (d = f(c()), u[a] = d), d;
	}
	function f(e) {
		let t = [], r = [], i = [];
		for (let e = 0; e < n; e++) t[e] = 0, r[e] = 0, i[e] = 0;
		return {
			geometry: null,
			program: null,
			wireframe: !1,
			newAttributes: t,
			enabledAttributes: r,
			attributeDivisors: i,
			object: e,
			attributes: {},
			index: null
		};
	}
	function p(e, t, n, r) {
		let i = a.attributes, o = t.attributes, s = 0, c = n.getAttributes();
		for (let t in c) if (c[t].location >= 0) {
			let n = i[t], r = o[t];
			if (r === void 0 && (t === "instanceMatrix" && e.instanceMatrix && (r = e.instanceMatrix), t === "instanceColor" && e.instanceColor && (r = e.instanceColor)), n === void 0 || n.attribute !== r || r && n.data !== r.data) return !0;
			s++;
		}
		return a.attributesNum !== s || a.index !== r;
	}
	function m(e, t, n, r) {
		let i = {}, o = t.attributes, s = 0, c = n.getAttributes();
		for (let t in c) if (c[t].location >= 0) {
			let n = o[t];
			n === void 0 && (t === "instanceMatrix" && e.instanceMatrix && (n = e.instanceMatrix), t === "instanceColor" && e.instanceColor && (n = e.instanceColor));
			let r = {};
			r.attribute = n, n && n.data && (r.data = n.data), i[t] = r, s++;
		}
		a.attributes = i, a.attributesNum = s, a.index = r;
	}
	function h() {
		let e = a.newAttributes;
		for (let t = 0, n = e.length; t < n; t++) e[t] = 0;
	}
	function g(e) {
		_(e, 0);
	}
	function _(t, n) {
		let r = a.newAttributes, i = a.enabledAttributes, o = a.attributeDivisors;
		r[t] = 1, i[t] === 0 && (e.enableVertexAttribArray(t), i[t] = 1), o[t] !== n && (e.vertexAttribDivisor(t, n), o[t] = n);
	}
	function v() {
		let t = a.newAttributes, n = a.enabledAttributes;
		for (let r = 0, i = n.length; r < i; r++) n[r] !== t[r] && (e.disableVertexAttribArray(r), n[r] = 0);
	}
	function y(t, n, r, i, a, o, s) {
		s === !0 ? e.vertexAttribIPointer(t, n, r, a, o) : e.vertexAttribPointer(t, n, r, i, a, o);
	}
	function b(n, r, i, a) {
		h();
		let o = a.attributes, s = i.getAttributes(), c = r.defaultAttributeValues;
		for (let r in s) {
			let i = s[r];
			if (i.location >= 0) {
				let s = o[r];
				if (s === void 0 && (r === "instanceMatrix" && n.instanceMatrix && (s = n.instanceMatrix), r === "instanceColor" && n.instanceColor && (s = n.instanceColor)), s !== void 0) {
					let r = s.normalized, o = s.itemSize, c = t.get(s);
					if (c === void 0) continue;
					let l = c.buffer, u = c.type, d = c.bytesPerElement, f = u === e.INT || u === e.UNSIGNED_INT || s.gpuType === 1013;
					if (s.isInterleavedBufferAttribute) {
						let t = s.data, c = t.stride, p = s.offset;
						if (t.isInstancedInterleavedBuffer) {
							for (let e = 0; e < i.locationSize; e++) _(i.location + e, t.meshPerAttribute);
							n.isInstancedMesh !== !0 && a._maxInstanceCount === void 0 && (a._maxInstanceCount = t.meshPerAttribute * t.count);
						} else for (let e = 0; e < i.locationSize; e++) g(i.location + e);
						e.bindBuffer(e.ARRAY_BUFFER, l);
						for (let e = 0; e < i.locationSize; e++) y(i.location + e, o / i.locationSize, u, r, c * d, (p + o / i.locationSize * e) * d, f);
					} else {
						if (s.isInstancedBufferAttribute) {
							for (let e = 0; e < i.locationSize; e++) _(i.location + e, s.meshPerAttribute);
							n.isInstancedMesh !== !0 && a._maxInstanceCount === void 0 && (a._maxInstanceCount = s.meshPerAttribute * s.count);
						} else for (let e = 0; e < i.locationSize; e++) g(i.location + e);
						e.bindBuffer(e.ARRAY_BUFFER, l);
						for (let e = 0; e < i.locationSize; e++) y(i.location + e, o / i.locationSize, u, r, o * d, o / i.locationSize * e * d, f);
					}
				} else if (c !== void 0) {
					let t = c[r];
					if (t !== void 0) switch (t.length) {
						case 2:
							e.vertexAttrib2fv(i.location, t);
							break;
						case 3:
							e.vertexAttrib3fv(i.location, t);
							break;
						case 4:
							e.vertexAttrib4fv(i.location, t);
							break;
						default: e.vertexAttrib1fv(i.location, t);
					}
				}
			}
		}
		v();
	}
	function x() {
		T();
		for (let e in r) {
			let t = r[e];
			for (let e in t) {
				let n = t[e];
				for (let e in n) {
					let t = n[e];
					for (let e in t) u(t[e].object), delete t[e];
					delete n[e];
				}
			}
			delete r[e];
		}
	}
	function S(e) {
		if (r[e.id] === void 0) return;
		let t = r[e.id];
		for (let e in t) {
			let n = t[e];
			for (let e in n) {
				let t = n[e];
				for (let e in t) u(t[e].object), delete t[e];
				delete n[e];
			}
		}
		delete r[e.id];
	}
	function C(e) {
		for (let t in r) {
			let n = r[t];
			for (let t in n) {
				let r = n[t];
				if (r[e.id] === void 0) continue;
				let i = r[e.id];
				for (let e in i) u(i[e].object), delete i[e];
				delete r[e.id];
			}
		}
	}
	function w(e) {
		for (let t in r) {
			let n = r[t], i = e.isInstancedMesh === !0 ? e.id : 0, a = n[i];
			if (a !== void 0) {
				for (let e in a) {
					let t = a[e];
					for (let e in t) u(t[e].object), delete t[e];
					delete a[e];
				}
				delete n[i], Object.keys(n).length === 0 && delete r[t];
			}
		}
	}
	function T() {
		E(), o = !0, a !== i && (a = i, l(a.object));
	}
	function E() {
		i.geometry = null, i.program = null, i.wireframe = !1;
	}
	return {
		setup: s,
		reset: T,
		resetDefaultState: E,
		dispose: x,
		releaseStatesOfGeometry: S,
		releaseStatesOfObject: w,
		releaseStatesOfProgram: C,
		initAttributes: h,
		enableAttribute: g,
		disableUnusedAttributes: v
	};
}
function ic(e, t, n) {
	let r;
	function i(e) {
		r = e;
	}
	function a(t, i) {
		e.drawArrays(r, t, i), n.update(i, r, 1);
	}
	function o(t, i, a) {
		a !== 0 && (e.drawArraysInstanced(r, t, i, a), n.update(i, r, a));
	}
	function s(e, i, a) {
		if (a === 0) return;
		t.get("WEBGL_multi_draw").multiDrawArraysWEBGL(r, e, 0, i, 0, a);
		let o = 0;
		for (let e = 0; e < a; e++) o += i[e];
		n.update(o, r, 1);
	}
	this.setMode = i, this.render = a, this.renderInstances = o, this.renderMultiDraw = s;
}
function ac(e, t, n, r) {
	let i;
	function a() {
		if (i !== void 0) return i;
		if (t.has("EXT_texture_filter_anisotropic") === !0) {
			let n = t.get("EXT_texture_filter_anisotropic");
			i = e.getParameter(n.MAX_TEXTURE_MAX_ANISOTROPY_EXT);
		} else i = 0;
		return i;
	}
	function o(t) {
		return t === 1023 || r.convert(t) === e.getParameter(e.IMPLEMENTATION_COLOR_READ_FORMAT);
	}
	function s(n) {
		let i = n === 1016 && (t.has("EXT_color_buffer_half_float") || t.has("EXT_color_buffer_float"));
		return !(n !== 1009 && r.convert(n) !== e.getParameter(e.IMPLEMENTATION_COLOR_READ_TYPE) && n !== 1015 && !i);
	}
	function c(t) {
		if (t === "highp") {
			if (e.getShaderPrecisionFormat(e.VERTEX_SHADER, e.HIGH_FLOAT).precision > 0 && e.getShaderPrecisionFormat(e.FRAGMENT_SHADER, e.HIGH_FLOAT).precision > 0) return "highp";
			t = "mediump";
		}
		return t === "mediump" && e.getShaderPrecisionFormat(e.VERTEX_SHADER, e.MEDIUM_FLOAT).precision > 0 && e.getShaderPrecisionFormat(e.FRAGMENT_SHADER, e.MEDIUM_FLOAT).precision > 0 ? "mediump" : "lowp";
	}
	let l = n.precision === void 0 ? "highp" : n.precision, d = c(l);
	d !== l && (u("WebGLRenderer:", l, "not supported, using", d, "instead."), l = d);
	let f = n.logarithmicDepthBuffer === !0, p = n.reversedDepthBuffer === !0 && t.has("EXT_clip_control");
	n.reversedDepthBuffer === !0 && p === !1 && u("WebGLRenderer: Unable to use reversed depth buffer due to missing EXT_clip_control extension. Fallback to default depth buffer.");
	let m = e.getParameter(e.MAX_TEXTURE_IMAGE_UNITS), h = e.getParameter(e.MAX_VERTEX_TEXTURE_IMAGE_UNITS), g = e.getParameter(e.MAX_TEXTURE_SIZE), _ = e.getParameter(e.MAX_CUBE_MAP_TEXTURE_SIZE), v = e.getParameter(e.MAX_VERTEX_ATTRIBS), y = e.getParameter(e.MAX_VERTEX_UNIFORM_VECTORS), b = e.getParameter(e.MAX_VARYING_VECTORS), x = e.getParameter(e.MAX_FRAGMENT_UNIFORM_VECTORS), S = e.getParameter(e.MAX_SAMPLES), C = e.getParameter(e.SAMPLES);
	return {
		isWebGL2: !0,
		getMaxAnisotropy: a,
		getMaxPrecision: c,
		textureFormatReadable: o,
		textureTypeReadable: s,
		precision: l,
		logarithmicDepthBuffer: f,
		reversedDepthBuffer: p,
		maxTextures: m,
		maxVertexTextures: h,
		maxTextureSize: g,
		maxCubemapSize: _,
		maxAttributes: v,
		maxVertexUniforms: y,
		maxVaryings: b,
		maxFragmentUniforms: x,
		maxSamples: S,
		samples: C
	};
}
function oc(e) {
	let t = this, n = null, r = 0, i = !1, a = !1, o = new Ha(), s = new G(), c = {
		value: null,
		needsUpdate: !1
	};
	this.uniform = c, this.numPlanes = 0, this.numIntersection = 0, this.init = function(e, t) {
		let n = e.length !== 0 || t || r !== 0 || i;
		return i = t, r = e.length, n;
	}, this.beginShadows = function() {
		a = !0, u(null);
	}, this.endShadows = function() {
		a = !1;
	}, this.setGlobalState = function(e, t) {
		n = u(e, t, 0);
	}, this.setState = function(t, o, s) {
		let d = t.clippingPlanes, f = t.clipIntersection, p = t.clipShadows, m = e.get(t);
		if (!i || d === null || d.length === 0 || a && !p) a ? u(null) : l();
		else {
			let e = a ? 0 : r, t = e * 4, i = m.clippingState || null;
			c.value = i, i = u(d, o, t, s);
			for (let e = 0; e !== t; ++e) i[e] = n[e];
			m.clippingState = i, this.numIntersection = f ? this.numPlanes : 0, this.numPlanes += e;
		}
	};
	function l() {
		c.value !== n && (c.value = n, c.needsUpdate = r > 0), t.numPlanes = r, t.numIntersection = 0;
	}
	function u(e, n, r, i) {
		let a = e === null ? 0 : e.length, l = null;
		if (a !== 0) {
			if (l = c.value, i !== !0 || l === null) {
				let t = r + a * 4, i = n.matrixWorldInverse;
				s.getNormalMatrix(i), (l === null || l.length < t) && (l = new Float32Array(t));
				for (let t = 0, n = r; t !== a; ++t, n += 4) o.copy(e[t]).applyMatrix4(i, s), o.normal.toArray(l, n), l[n + 3] = o.constant;
			}
			c.value = l, c.needsUpdate = !0;
		}
		return t.numPlanes = a, t.numIntersection = 0, l;
	}
}
function sc(e) {
	let t = [], n = [], r = [], i = e, a = e - lu + 1 + uu.length;
	for (let o = 0; o < a; o++) {
		let a = 2 ** i;
		t.push(a);
		let s = 1 / a;
		o > e - lu ? s = uu[o - e + lu - 1] : o === 0 && (s = 0), n.push(s);
		let c = 1 / (a - 2), l = -c, u = 1 + c, d = [
			l,
			l,
			u,
			l,
			u,
			u,
			l,
			l,
			u,
			u,
			l,
			u
		], f = /* @__PURE__ */ new Float32Array(108), p = /* @__PURE__ */ new Float32Array(72), m = /* @__PURE__ */ new Float32Array(36);
		for (let e = 0; e < 6; e++) {
			let t = e % 3 * 2 / 3 - 1, n = e > 2 ? 0 : -1, r = [
				t,
				n,
				0,
				t + 2 / 3,
				n,
				0,
				t + 2 / 3,
				n + 1,
				0,
				t,
				n,
				0,
				t + 2 / 3,
				n + 1,
				0,
				t,
				n + 1,
				0
			];
			f.set(r, 18 * e), p.set(d, 12 * e);
			let i = [
				e,
				e,
				e,
				e,
				e,
				e
			];
			m.set(i, 6 * e);
		}
		let h = new Hi();
		h.setAttribute("position", new Di(f, 3)), h.setAttribute("uv", new Di(p, 2)), h.setAttribute("faceIndex", new Di(m, 1)), r.push(new ma(h, null)), i > lu && i--;
	}
	return {
		lodMeshes: r,
		sizeLods: t,
		sigmas: n
	};
}
function cc(e, t, n) {
	let r = new fr(e, t, n);
	return r.texture.mapping = 306, r.texture.name = "PMREM.cubeUv", r.scissorTest = !0, r;
}
function lc(e, t, n, r, i) {
	e.viewport.set(t, n, r, i), e.scissor.set(t, n, r, i);
}
function uc(e, t, n) {
	return new ko({
		name: "PMREMGGXConvolution",
		defines: {
			GGX_SAMPLES: fu,
			CUBEUV_TEXEL_WIDTH: 1 / t,
			CUBEUV_TEXEL_HEIGHT: 1 / n,
			CUBEUV_MAX_MIP: `${e}.0`
		},
		uniforms: {
			envMap: { value: null },
			roughness: { value: 0 },
			mipInt: { value: 0 }
		},
		vertexShader: mc(),
		fragmentShader: "\n\n			precision highp float;\n			precision highp int;\n\n			varying vec3 vOutputDirection;\n\n			uniform sampler2D envMap;\n			uniform float roughness;\n			uniform float mipInt;\n\n			#define ENVMAP_TYPE_CUBE_UV\n			#include <cube_uv_reflection_fragment>\n\n			#define PI 3.14159265359\n\n			// Van der Corput radical inverse\n			float radicalInverse_VdC(uint bits) {\n				bits = (bits << 16u) | (bits >> 16u);\n				bits = ((bits & 0x55555555u) << 1u) | ((bits & 0xAAAAAAAAu) >> 1u);\n				bits = ((bits & 0x33333333u) << 2u) | ((bits & 0xCCCCCCCCu) >> 2u);\n				bits = ((bits & 0x0F0F0F0Fu) << 4u) | ((bits & 0xF0F0F0F0u) >> 4u);\n				bits = ((bits & 0x00FF00FFu) << 8u) | ((bits & 0xFF00FF00u) >> 8u);\n				return float(bits) * 2.3283064365386963e-10; // / 0x100000000\n			}\n\n			// Hammersley sequence\n			vec2 hammersley(uint i, uint N) {\n				return vec2(float(i) / float(N), radicalInverse_VdC(i));\n			}\n\n			// GGX VNDF importance sampling (Eric Heitz 2018)\n			// \"Sampling the GGX Distribution of Visible Normals\"\n			// https://jcgt.org/published/0007/04/01/\n			vec3 importanceSampleGGX_VNDF(vec2 Xi, vec3 V, float roughness) {\n				float alpha = roughness * roughness;\n\n				// Section 4.1: Orthonormal basis\n				vec3 T1 = vec3(1.0, 0.0, 0.0);\n				vec3 T2 = cross(V, T1);\n\n				// Section 4.2: Parameterization of projected area\n				float r = sqrt(Xi.x);\n				float phi = 2.0 * PI * Xi.y;\n				float t1 = r * cos(phi);\n				float t2 = r * sin(phi);\n				float s = 0.5 * (1.0 + V.z);\n				t2 = (1.0 - s) * sqrt(1.0 - t1 * t1) + s * t2;\n\n				// Section 4.3: Reprojection onto hemisphere\n				vec3 Nh = t1 * T1 + t2 * T2 + sqrt(max(0.0, 1.0 - t1 * t1 - t2 * t2)) * V;\n\n				// Section 3.4: Transform back to ellipsoid configuration\n				return normalize(vec3(alpha * Nh.x, alpha * Nh.y, max(0.0, Nh.z)));\n			}\n\n			void main() {\n				vec3 N = normalize(vOutputDirection);\n				vec3 V = N; // Assume view direction equals normal for pre-filtering\n\n				vec3 prefilteredColor = vec3(0.0);\n				float totalWeight = 0.0;\n\n				// For very low roughness, just sample the environment directly\n				if (roughness < 0.001) {\n					gl_FragColor = vec4(bilinearCubeUV(envMap, N, mipInt), 1.0);\n					return;\n				}\n\n				// Tangent space basis for VNDF sampling\n				vec3 up = abs(N.z) < 0.999 ? vec3(0.0, 0.0, 1.0) : vec3(1.0, 0.0, 0.0);\n				vec3 tangent = normalize(cross(up, N));\n				vec3 bitangent = cross(N, tangent);\n\n				for(uint i = 0u; i < uint(GGX_SAMPLES); i++) {\n					vec2 Xi = hammersley(i, uint(GGX_SAMPLES));\n\n					// For PMREM, V = N, so in tangent space V is always (0, 0, 1)\n					vec3 H_tangent = importanceSampleGGX_VNDF(Xi, vec3(0.0, 0.0, 1.0), roughness);\n\n					// Transform H back to world space\n					vec3 H = normalize(tangent * H_tangent.x + bitangent * H_tangent.y + N * H_tangent.z);\n					vec3 L = normalize(2.0 * dot(V, H) * H - V);\n\n					float NdotL = max(dot(N, L), 0.0);\n\n					if(NdotL > 0.0) {\n						// Sample environment at fixed mip level\n						// VNDF importance sampling handles the distribution filtering\n						vec3 sampleColor = bilinearCubeUV(envMap, L, mipInt);\n\n						// Weight by NdotL for the split-sum approximation\n						// VNDF PDF naturally accounts for the visible microfacet distribution\n						prefilteredColor += sampleColor * NdotL;\n						totalWeight += NdotL;\n					}\n				}\n\n				if (totalWeight > 0.0) {\n					prefilteredColor = prefilteredColor / totalWeight;\n				}\n\n				gl_FragColor = vec4(prefilteredColor, 1.0);\n			}\n		",
		blending: 0,
		depthTest: !1,
		depthWrite: !1
	});
}
function dc(e, t, n) {
	let r = new Float32Array(du), i = new W(0, 1, 0);
	return new ko({
		name: "SphericalGaussianBlur",
		defines: {
			n: du,
			CUBEUV_TEXEL_WIDTH: 1 / t,
			CUBEUV_TEXEL_HEIGHT: 1 / n,
			CUBEUV_MAX_MIP: `${e}.0`
		},
		uniforms: {
			envMap: { value: null },
			samples: { value: 1 },
			weights: { value: r },
			latitudinal: { value: !1 },
			dTheta: { value: 0 },
			mipInt: { value: 0 },
			poleAxis: { value: i }
		},
		vertexShader: mc(),
		fragmentShader: "\n\n			precision mediump float;\n			precision mediump int;\n\n			varying vec3 vOutputDirection;\n\n			uniform sampler2D envMap;\n			uniform int samples;\n			uniform float weights[ n ];\n			uniform bool latitudinal;\n			uniform float dTheta;\n			uniform float mipInt;\n			uniform vec3 poleAxis;\n\n			#define ENVMAP_TYPE_CUBE_UV\n			#include <cube_uv_reflection_fragment>\n\n			vec3 getSample( float theta, vec3 axis ) {\n\n				float cosTheta = cos( theta );\n				// Rodrigues' axis-angle rotation\n				vec3 sampleDirection = vOutputDirection * cosTheta\n					+ cross( axis, vOutputDirection ) * sin( theta )\n					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );\n\n				return bilinearCubeUV( envMap, sampleDirection, mipInt );\n\n			}\n\n			void main() {\n\n				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );\n\n				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {\n\n					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );\n\n				}\n\n				axis = normalize( axis );\n\n				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );\n				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );\n\n				for ( int i = 1; i < n; i++ ) {\n\n					if ( i >= samples ) {\n\n						break;\n\n					}\n\n					float theta = dTheta * float( i );\n					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );\n					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );\n\n				}\n\n			}\n		",
		blending: 0,
		depthTest: !1,
		depthWrite: !1
	});
}
function fc() {
	return new ko({
		name: "EquirectangularToCubeUV",
		uniforms: { envMap: { value: null } },
		vertexShader: mc(),
		fragmentShader: "\n\n			precision mediump float;\n			precision mediump int;\n\n			varying vec3 vOutputDirection;\n\n			uniform sampler2D envMap;\n\n			#include <common>\n\n			void main() {\n\n				vec3 outputDirection = normalize( vOutputDirection );\n				vec2 uv = equirectUv( outputDirection );\n\n				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );\n\n			}\n		",
		blending: 0,
		depthTest: !1,
		depthWrite: !1
	});
}
function pc() {
	return new ko({
		name: "CubemapToCubeUV",
		uniforms: {
			envMap: { value: null },
			flipEnvMap: { value: -1 }
		},
		vertexShader: mc(),
		fragmentShader: "\n\n			precision mediump float;\n			precision mediump int;\n\n			uniform float flipEnvMap;\n\n			varying vec3 vOutputDirection;\n\n			uniform samplerCube envMap;\n\n			void main() {\n\n				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );\n\n			}\n		",
		blending: 0,
		depthTest: !1,
		depthWrite: !1
	});
}
function mc() {
	return "\n\n		precision mediump float;\n		precision mediump int;\n\n		attribute float faceIndex;\n\n		varying vec3 vOutputDirection;\n\n		// RH coordinate system; PMREM face-indexing convention\n		vec3 getDirection( vec2 uv, float face ) {\n\n			uv = 2.0 * uv - 1.0;\n\n			vec3 direction = vec3( uv, 1.0 );\n\n			if ( face == 0.0 ) {\n\n				direction = direction.zyx; // ( 1, v, u ) pos x\n\n			} else if ( face == 1.0 ) {\n\n				direction = direction.xzy;\n				direction.xz *= -1.0; // ( -u, 1, -v ) pos y\n\n			} else if ( face == 2.0 ) {\n\n				direction.x *= -1.0; // ( -u, v, 1 ) pos z\n\n			} else if ( face == 3.0 ) {\n\n				direction = direction.zyx;\n				direction.xz *= -1.0; // ( -1, v, -u ) neg x\n\n			} else if ( face == 4.0 ) {\n\n				direction = direction.xzy;\n				direction.xy *= -1.0; // ( -u, -1, v ) neg y\n\n			} else if ( face == 5.0 ) {\n\n				direction.z *= -1.0; // ( u, v, -1 ) neg z\n\n			}\n\n			return direction;\n\n		}\n\n		void main() {\n\n			vOutputDirection = getDirection( uv, faceIndex );\n			gl_Position = vec4( position, 1.0 );\n\n		}\n	";
}
function hc(e) {
	let t = /* @__PURE__ */ new WeakMap(), n = /* @__PURE__ */ new WeakMap(), r = null;
	function i(e, t = !1) {
		return e == null ? null : t ? o(e) : a(e);
	}
	function a(n) {
		if (n && n.isTexture) {
			let r = n.mapping;
			if (r === 303 || r === 304) {
				if (t.has(n)) {
					let e = t.get(n).texture;
					return s(e, n.mapping);
				}
				{
					let r = n.image;
					if (r && r.height > 0) {
						let i = new xu(r.height);
						return i.fromEquirectangularTexture(e, n), t.set(n, i), n.addEventListener("dispose", l), s(i.texture, n.mapping);
					}
					return null;
				}
			}
		}
		return n;
	}
	function o(t) {
		if (t && t.isTexture) {
			let i = t.mapping, a = i === 303 || i === 304, o = i === 301 || i === 302;
			if (a || o) {
				let i = n.get(t), s = i === void 0 ? 0 : i.texture.pmremVersion;
				if (t.isRenderTargetTexture && t.pmremVersion !== s) return r === null && (r = new bu(e)), i = a ? r.fromEquirectangular(t, i) : r.fromCubemap(t, i), i.texture.pmremVersion = t.pmremVersion, n.set(t, i), i.texture;
				if (i !== void 0) return i.texture;
				{
					let s = t.image;
					return a && s && s.height > 0 || o && s && c(s) ? (r === null && (r = new bu(e)), i = a ? r.fromEquirectangular(t) : r.fromCubemap(t), i.texture.pmremVersion = t.pmremVersion, n.set(t, i), t.addEventListener("dispose", u), i.texture) : null;
				}
			}
		}
		return t;
	}
	function s(e, t) {
		return t === 303 ? e.mapping = 301 : t === 304 && (e.mapping = 302), e;
	}
	function c(e) {
		let t = 0;
		for (let n = 0; n < 6; n++) e[n] !== void 0 && t++;
		return t === 6;
	}
	function l(e) {
		let n = e.target;
		n.removeEventListener("dispose", l);
		let r = t.get(n);
		r !== void 0 && (t.delete(n), r.dispose());
	}
	function u(e) {
		let t = e.target;
		t.removeEventListener("dispose", u);
		let r = n.get(t);
		r !== void 0 && (n.delete(t), r.dispose());
	}
	function d() {
		t = /* @__PURE__ */ new WeakMap(), n = /* @__PURE__ */ new WeakMap(), r !== null && (r.dispose(), r = null);
	}
	return {
		get: i,
		dispose: d
	};
}
function gc(e) {
	let t = {};
	function n(n) {
		if (t[n] !== void 0) return t[n];
		let r = e.getExtension(n);
		return t[n] = r, r;
	}
	return {
		has: function(e) {
			return n(e) !== null;
		},
		init: function() {
			n("EXT_color_buffer_float"), n("WEBGL_clip_cull_distance"), n("OES_texture_float_linear"), n("EXT_color_buffer_half_float"), n("WEBGL_multisampled_render_to_texture"), n("WEBGL_render_shared_exponent");
		},
		get: function(e) {
			let t = n(e);
			return t === null && f("WebGLRenderer: " + e + " extension not supported."), t;
		}
	};
}
function _c(e, t, n, r) {
	let i = {}, a = /* @__PURE__ */ new WeakMap();
	function o(e) {
		let s = e.target;
		s.index !== null && t.remove(s.index);
		for (let e in s.attributes) t.remove(s.attributes[e]);
		s.removeEventListener("dispose", o), delete i[s.id];
		let c = a.get(s);
		c && (t.remove(c), a.delete(s)), r.releaseStatesOfGeometry(s), s.isInstancedBufferGeometry === !0 && delete s._maxInstanceCount, n.memory.geometries--;
	}
	function s(e, t) {
		return i[t.id] === !0 ? t : (t.addEventListener("dispose", o), i[t.id] = !0, n.memory.geometries++, t);
	}
	function c(n) {
		let r = n.attributes;
		for (let n in r) t.update(r[n], e.ARRAY_BUFFER);
	}
	function l(e) {
		let n = [], r = e.index, i = e.attributes.position, o = 0;
		if (i === void 0) return;
		if (r !== null) {
			let e = r.array;
			o = r.version;
			for (let t = 0, r = e.length; t < r; t += 3) {
				let r = e[t + 0], i = e[t + 1], a = e[t + 2];
				n.push(r, i, i, a, a, r);
			}
		} else {
			let e = i.array;
			o = i.version;
			for (let t = 0, r = e.length / 3 - 1; t < r; t += 3) {
				let e = t + 0, r = t + 1, i = t + 2;
				n.push(e, r, r, i, i, e);
			}
		}
		let s = new (i.count >= 65535 ? ki : Oi)(n, 1);
		s.version = o;
		let c = a.get(e);
		c && t.remove(c), a.set(e, s);
	}
	function u(e) {
		let t = a.get(e);
		if (t) {
			let n = e.index;
			n !== null && t.version < n.version && l(e);
		} else l(e);
		return a.get(e);
	}
	return {
		get: s,
		update: c,
		getWireframeAttribute: u
	};
}
function vc(e, t, n) {
	let r;
	function i(e) {
		r = e;
	}
	let a, o;
	function s(e) {
		a = e.type, o = e.bytesPerElement;
	}
	function c(t, i) {
		e.drawElements(r, i, a, t * o), n.update(i, r, 1);
	}
	function l(t, i, s) {
		s !== 0 && (e.drawElementsInstanced(r, i, a, t * o, s), n.update(i, r, s));
	}
	function u(e, i, o) {
		if (o === 0) return;
		t.get("WEBGL_multi_draw").multiDrawElementsWEBGL(r, i, 0, a, e, 0, o);
		let s = 0;
		for (let e = 0; e < o; e++) s += i[e];
		n.update(s, r, 1);
	}
	this.setMode = i, this.setIndex = s, this.render = c, this.renderInstances = l, this.renderMultiDraw = u;
}
function yc(e) {
	let t = {
		geometries: 0,
		textures: 0
	}, n = {
		frame: 0,
		calls: 0,
		triangles: 0,
		points: 0,
		lines: 0
	};
	function r(t, r, i) {
		switch (n.calls++, r) {
			case e.TRIANGLES:
				n.triangles += t / 3 * i;
				break;
			case e.LINES:
				n.lines += t / 2 * i;
				break;
			case e.LINE_STRIP:
				n.lines += i * (t - 1);
				break;
			case e.LINE_LOOP:
				n.lines += i * t;
				break;
			case e.POINTS:
				n.points += i * t;
				break;
			default: d("WebGLInfo: Unknown draw mode:", r);
		}
	}
	function i() {
		n.calls = 0, n.triangles = 0, n.points = 0, n.lines = 0;
	}
	return {
		memory: t,
		render: n,
		programs: null,
		autoReset: !0,
		reset: i,
		update: r
	};
}
function bc(e, t, n) {
	let r = /* @__PURE__ */ new WeakMap(), i = new ur();
	function a(a, o, s) {
		let c = a.morphTargetInfluences, l = o.morphAttributes.position || o.morphAttributes.normal || o.morphAttributes.color, u = l === void 0 ? 0 : l.length, d = r.get(o);
		if (d === void 0 || d.count !== u) {
			d !== void 0 && d.texture.dispose();
			let e = o.morphAttributes.position !== void 0, n = o.morphAttributes.normal !== void 0, a = o.morphAttributes.color !== void 0, s = o.morphAttributes.position || [], c = o.morphAttributes.normal || [], l = o.morphAttributes.color || [], f = 0;
			e === !0 && (f = 1), n === !0 && (f = 2), a === !0 && (f = 3);
			let p = o.attributes.position.count * f, m = 1;
			p > t.maxTextureSize && (m = Math.ceil(p / t.maxTextureSize), p = t.maxTextureSize);
			let h = new Float32Array(p * m * 4 * u), g = new pr(h, p, m, u);
			g.type = wt, g.needsUpdate = !0;
			let _ = f * 4;
			for (let t = 0; t < u; t++) {
				let r = s[t], o = c[t], u = l[t], d = p * m * 4 * t;
				for (let t = 0; t < r.count; t++) {
					let s = t * _;
					e === !0 && (i.fromBufferAttribute(r, t), h[d + s + 0] = i.x, h[d + s + 1] = i.y, h[d + s + 2] = i.z, h[d + s + 3] = 0), n === !0 && (i.fromBufferAttribute(o, t), h[d + s + 4] = i.x, h[d + s + 5] = i.y, h[d + s + 6] = i.z, h[d + s + 7] = 0), a === !0 && (i.fromBufferAttribute(u, t), h[d + s + 8] = i.x, h[d + s + 9] = i.y, h[d + s + 10] = i.z, h[d + s + 11] = u.itemSize === 4 ? i.w : 1);
				}
			}
			d = {
				count: u,
				texture: g,
				size: new U(p, m)
			}, r.set(o, d);
			function v() {
				g.dispose(), r.delete(o), o.removeEventListener("dispose", v);
			}
			o.addEventListener("dispose", v);
		}
		if (a.isInstancedMesh === !0 && a.morphTexture !== null) s.getUniforms().setValue(e, "morphTexture", a.morphTexture, n);
		else {
			let t = 0;
			for (let e = 0; e < c.length; e++) t += c[e];
			let n = o.morphTargetsRelative ? 1 : 1 - t;
			s.getUniforms().setValue(e, "morphTargetBaseInfluence", n), s.getUniforms().setValue(e, "morphTargetInfluences", c);
		}
		s.getUniforms().setValue(e, "morphTargetsTexture", d.texture, n), s.getUniforms().setValue(e, "morphTargetsTextureSize", d.size);
	}
	return { update: a };
}
function xc(e, t, n, r, i) {
	let a = /* @__PURE__ */ new WeakMap();
	function o(r) {
		let o = i.render.frame, s = r.geometry, l = t.get(r, s);
		if (a.get(l) !== o && (t.update(l), a.set(l, o)), r.isInstancedMesh && (r.hasEventListener("dispose", c) === !1 && r.addEventListener("dispose", c), a.get(r) !== o && (n.update(r.instanceMatrix, e.ARRAY_BUFFER), r.instanceColor !== null && n.update(r.instanceColor, e.ARRAY_BUFFER), a.set(r, o))), r.isSkinnedMesh) {
			let e = r.skeleton;
			a.get(e) !== o && (e.update(), a.set(e, o));
		}
		return l;
	}
	function s() {
		a = /* @__PURE__ */ new WeakMap();
	}
	function c(e) {
		let t = e.target;
		t.removeEventListener("dispose", c), r.releaseStatesOfObject(t), n.remove(t.instanceMatrix), t.instanceColor !== null && n.remove(t.instanceColor);
	}
	return {
		update: o,
		dispose: s
	};
}
function Sc(e, t, n, r, i, a) {
	let o = new fr(t, n, {
		type: e,
		depthBuffer: i,
		stencilBuffer: a,
		samples: r ? 4 : 0,
		depthTexture: i ? new mo(t, n) : void 0
	}), s = new fr(t, n, {
		type: Tt,
		depthBuffer: !1,
		stencilBuffer: !1
	}), c = new Hi();
	c.setAttribute("position", new Ai([
		-1,
		3,
		0,
		-1,
		-1,
		0,
		3,
		-1,
		0
	], 3)), c.setAttribute("uv", new Ai([
		0,
		2,
		0,
		0,
		2,
		0
	], 2));
	let l = new Ao({
		uniforms: { tDiffuse: { value: null } },
		vertexShader: "\n			precision highp float;\n\n			uniform mat4 modelViewMatrix;\n			uniform mat4 projectionMatrix;\n\n			attribute vec3 position;\n			attribute vec2 uv;\n\n			varying vec2 vUv;\n\n			void main() {\n				vUv = uv;\n				gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n			}",
		fragmentShader: "\n			precision highp float;\n\n			uniform sampler2D tDiffuse;\n\n			varying vec2 vUv;\n\n			#include <tonemapping_pars_fragment>\n			#include <colorspace_pars_fragment>\n\n			void main() {\n				gl_FragColor = texture2D( tDiffuse, vUv );\n\n				#ifdef LINEAR_TONE_MAPPING\n					gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );\n				#elif defined( REINHARD_TONE_MAPPING )\n					gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );\n				#elif defined( CINEON_TONE_MAPPING )\n					gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );\n				#elif defined( ACES_FILMIC_TONE_MAPPING )\n					gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );\n				#elif defined( AGX_TONE_MAPPING )\n					gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );\n				#elif defined( NEUTRAL_TONE_MAPPING )\n					gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );\n				#elif defined( CUSTOM_TONE_MAPPING )\n					gl_FragColor.rgb = CustomToneMapping( gl_FragColor.rgb );\n				#endif\n\n				#ifdef SRGB_TRANSFER\n					gl_FragColor = sRGBTransferOETF( gl_FragColor );\n				#endif\n			}",
		depthTest: !1,
		depthWrite: !1
	}), u = new ma(c, l), d = new ws(-1, 1, 1, -1, 0, 1), f = null, p = null, m = !1, h, g = null, _ = [], v = !1;
	this.setSize = function(e, t) {
		o.setSize(e, t), s.setSize(e, t);
		for (let n = 0; n < _.length; n++) {
			let r = _[n];
			r.setSize && r.setSize(e, t);
		}
	}, this.setEffects = function(e) {
		_ = e, v = _.length > 0 && _[0].isRenderPass === !0;
		let t = o.width, n = o.height;
		for (let e = 0; e < _.length; e++) {
			let r = _[e];
			r.setSize && r.setSize(t, n);
		}
	}, this.begin = function(e, t) {
		if (m || e.toneMapping === 0 && _.length === 0) return !1;
		if (g = t, t !== null) {
			let e = t.width, n = t.height;
			(o.width !== e || o.height !== n) && this.setSize(e, n);
		}
		return v === !1 && e.setRenderTarget(o), h = e.toneMapping, e.toneMapping = 0, !0;
	}, this.hasRenderPass = function() {
		return v;
	}, this.end = function(e, t) {
		e.toneMapping = h, m = !0;
		let n = o, r = s;
		for (let i = 0; i < _.length; i++) {
			let a = _[i];
			if (a.enabled !== !1 && (a.render(e, r, n, t), a.needsSwap !== !1)) {
				let e = n;
				n = r, r = e;
			}
		}
		if (f !== e.outputColorSpace || p !== e.toneMapping) {
			f = e.outputColorSpace, p = e.toneMapping, l.defines = {}, K.getTransfer(f) === "srgb" && (l.defines.SRGB_TRANSFER = "");
			let t = Su[p];
			t && (l.defines[t] = ""), l.needsUpdate = !0;
		}
		l.uniforms.tDiffuse.value = n.texture, e.setRenderTarget(g), e.render(u, d), g = null, m = !1;
	}, this.isCompositing = function() {
		return m;
	}, this.dispose = function() {
		o.depthTexture && o.depthTexture.dispose(), o.dispose(), s.dispose(), c.dispose(), l.dispose();
	};
}
function Cc(e, t, n) {
	let r = e[0];
	if (r <= 0 || r > 0) return e;
	let i = t * n, a = Ou[i];
	if (a === void 0 && (a = new Float32Array(i), Ou[i] = a), t !== 0) {
		r.toArray(a, 0);
		for (let r = 1, i = 0; r !== t; ++r) i += n, e[r].toArray(a, i);
	}
	return a;
}
function wc(e, t) {
	if (e.length !== t.length) return !1;
	for (let n = 0, r = e.length; n < r; n++) if (e[n] !== t[n]) return !1;
	return !0;
}
function Tc(e, t) {
	for (let n = 0, r = t.length; n < r; n++) e[n] = t[n];
}
function Ec(e, t) {
	let n = ku[t];
	n === void 0 && (n = new Int32Array(t), ku[t] = n);
	for (let r = 0; r !== t; ++r) n[r] = e.allocateTextureUnit();
	return n;
}
function Dc(e, t) {
	let n = this.cache;
	n[0] !== t && (e.uniform1f(this.addr, t), n[0] = t);
}
function Oc(e, t) {
	let n = this.cache;
	if (t.x !== void 0) (n[0] !== t.x || n[1] !== t.y) && (e.uniform2f(this.addr, t.x, t.y), n[0] = t.x, n[1] = t.y);
	else {
		if (wc(n, t)) return;
		e.uniform2fv(this.addr, t), Tc(n, t);
	}
}
function kc(e, t) {
	let n = this.cache;
	if (t.x !== void 0) (n[0] !== t.x || n[1] !== t.y || n[2] !== t.z) && (e.uniform3f(this.addr, t.x, t.y, t.z), n[0] = t.x, n[1] = t.y, n[2] = t.z);
	else if (t.r !== void 0) (n[0] !== t.r || n[1] !== t.g || n[2] !== t.b) && (e.uniform3f(this.addr, t.r, t.g, t.b), n[0] = t.r, n[1] = t.g, n[2] = t.b);
	else {
		if (wc(n, t)) return;
		e.uniform3fv(this.addr, t), Tc(n, t);
	}
}
function Ac(e, t) {
	let n = this.cache;
	if (t.x !== void 0) (n[0] !== t.x || n[1] !== t.y || n[2] !== t.z || n[3] !== t.w) && (e.uniform4f(this.addr, t.x, t.y, t.z, t.w), n[0] = t.x, n[1] = t.y, n[2] = t.z, n[3] = t.w);
	else {
		if (wc(n, t)) return;
		e.uniform4fv(this.addr, t), Tc(n, t);
	}
}
function jc(e, t) {
	let n = this.cache, r = t.elements;
	if (r === void 0) {
		if (wc(n, t)) return;
		e.uniformMatrix2fv(this.addr, !1, t), Tc(n, t);
	} else {
		if (wc(n, r)) return;
		Mu.set(r), e.uniformMatrix2fv(this.addr, !1, Mu), Tc(n, r);
	}
}
function Mc(e, t) {
	let n = this.cache, r = t.elements;
	if (r === void 0) {
		if (wc(n, t)) return;
		e.uniformMatrix3fv(this.addr, !1, t), Tc(n, t);
	} else {
		if (wc(n, r)) return;
		ju.set(r), e.uniformMatrix3fv(this.addr, !1, ju), Tc(n, r);
	}
}
function Nc(e, t) {
	let n = this.cache, r = t.elements;
	if (r === void 0) {
		if (wc(n, t)) return;
		e.uniformMatrix4fv(this.addr, !1, t), Tc(n, t);
	} else {
		if (wc(n, r)) return;
		Au.set(r), e.uniformMatrix4fv(this.addr, !1, Au), Tc(n, r);
	}
}
function Pc(e, t) {
	let n = this.cache;
	n[0] !== t && (e.uniform1i(this.addr, t), n[0] = t);
}
function Fc(e, t) {
	let n = this.cache;
	if (t.x !== void 0) (n[0] !== t.x || n[1] !== t.y) && (e.uniform2i(this.addr, t.x, t.y), n[0] = t.x, n[1] = t.y);
	else {
		if (wc(n, t)) return;
		e.uniform2iv(this.addr, t), Tc(n, t);
	}
}
function Ic(e, t) {
	let n = this.cache;
	if (t.x !== void 0) (n[0] !== t.x || n[1] !== t.y || n[2] !== t.z) && (e.uniform3i(this.addr, t.x, t.y, t.z), n[0] = t.x, n[1] = t.y, n[2] = t.z);
	else {
		if (wc(n, t)) return;
		e.uniform3iv(this.addr, t), Tc(n, t);
	}
}
function Lc(e, t) {
	let n = this.cache;
	if (t.x !== void 0) (n[0] !== t.x || n[1] !== t.y || n[2] !== t.z || n[3] !== t.w) && (e.uniform4i(this.addr, t.x, t.y, t.z, t.w), n[0] = t.x, n[1] = t.y, n[2] = t.z, n[3] = t.w);
	else {
		if (wc(n, t)) return;
		e.uniform4iv(this.addr, t), Tc(n, t);
	}
}
function Rc(e, t) {
	let n = this.cache;
	n[0] !== t && (e.uniform1ui(this.addr, t), n[0] = t);
}
function zc(e, t) {
	let n = this.cache;
	if (t.x !== void 0) (n[0] !== t.x || n[1] !== t.y) && (e.uniform2ui(this.addr, t.x, t.y), n[0] = t.x, n[1] = t.y);
	else {
		if (wc(n, t)) return;
		e.uniform2uiv(this.addr, t), Tc(n, t);
	}
}
function Bc(e, t) {
	let n = this.cache;
	if (t.x !== void 0) (n[0] !== t.x || n[1] !== t.y || n[2] !== t.z) && (e.uniform3ui(this.addr, t.x, t.y, t.z), n[0] = t.x, n[1] = t.y, n[2] = t.z);
	else {
		if (wc(n, t)) return;
		e.uniform3uiv(this.addr, t), Tc(n, t);
	}
}
function Vc(e, t) {
	let n = this.cache;
	if (t.x !== void 0) (n[0] !== t.x || n[1] !== t.y || n[2] !== t.z || n[3] !== t.w) && (e.uniform4ui(this.addr, t.x, t.y, t.z, t.w), n[0] = t.x, n[1] = t.y, n[2] = t.z, n[3] = t.w);
	else {
		if (wc(n, t)) return;
		e.uniform4uiv(this.addr, t), Tc(n, t);
	}
}
function Hc(e, t, n) {
	let r = this.cache, i = n.allocateTextureUnit();
	r[0] !== i && (e.uniform1i(this.addr, i), r[0] = i);
	let a;
	this.type === e.SAMPLER_2D_SHADOW ? (wu.compareFunction = n.isReversedDepthBuffer() ? 518 : 515, a = wu) : a = Cu, n.setTexture2D(t || a, i);
}
function Uc(e, t, n) {
	let r = this.cache, i = n.allocateTextureUnit();
	r[0] !== i && (e.uniform1i(this.addr, i), r[0] = i), n.setTexture3D(t || Eu, i);
}
function Wc(e, t, n) {
	let r = this.cache, i = n.allocateTextureUnit();
	r[0] !== i && (e.uniform1i(this.addr, i), r[0] = i), n.setTextureCube(t || Du, i);
}
function Gc(e, t, n) {
	let r = this.cache, i = n.allocateTextureUnit();
	r[0] !== i && (e.uniform1i(this.addr, i), r[0] = i), n.setTexture2DArray(t || Tu, i);
}
function Kc(e) {
	switch (e) {
		case 5126: return Dc;
		case 35664: return Oc;
		case 35665: return kc;
		case 35666: return Ac;
		case 35674: return jc;
		case 35675: return Mc;
		case 35676: return Nc;
		case 5124:
		case 35670: return Pc;
		case 35667:
		case 35671: return Fc;
		case 35668:
		case 35672: return Ic;
		case 35669:
		case 35673: return Lc;
		case 5125: return Rc;
		case 36294: return zc;
		case 36295: return Bc;
		case 36296: return Vc;
		case 35678:
		case 36198:
		case 36298:
		case 36306:
		case 35682: return Hc;
		case 35679:
		case 36299:
		case 36307: return Uc;
		case 35680:
		case 36300:
		case 36308:
		case 36293: return Wc;
		case 36289:
		case 36303:
		case 36311:
		case 36292: return Gc;
	}
}
function qc(e, t) {
	e.uniform1fv(this.addr, t);
}
function Jc(e, t) {
	let n = Cc(t, this.size, 2);
	e.uniform2fv(this.addr, n);
}
function Yc(e, t) {
	let n = Cc(t, this.size, 3);
	e.uniform3fv(this.addr, n);
}
function Xc(e, t) {
	let n = Cc(t, this.size, 4);
	e.uniform4fv(this.addr, n);
}
function Zc(e, t) {
	let n = Cc(t, this.size, 4);
	e.uniformMatrix2fv(this.addr, !1, n);
}
function Qc(e, t) {
	let n = Cc(t, this.size, 9);
	e.uniformMatrix3fv(this.addr, !1, n);
}
function $c(e, t) {
	let n = Cc(t, this.size, 16);
	e.uniformMatrix4fv(this.addr, !1, n);
}
function el(e, t) {
	e.uniform1iv(this.addr, t);
}
function tl(e, t) {
	e.uniform2iv(this.addr, t);
}
function nl(e, t) {
	e.uniform3iv(this.addr, t);
}
function rl(e, t) {
	e.uniform4iv(this.addr, t);
}
function il(e, t) {
	e.uniform1uiv(this.addr, t);
}
function al(e, t) {
	e.uniform2uiv(this.addr, t);
}
function ol(e, t) {
	e.uniform3uiv(this.addr, t);
}
function sl(e, t) {
	e.uniform4uiv(this.addr, t);
}
function cl(e, t, n) {
	let r = this.cache, i = t.length, a = Ec(n, i);
	wc(r, a) || (e.uniform1iv(this.addr, a), Tc(r, a));
	let o;
	o = this.type === e.SAMPLER_2D_SHADOW ? wu : Cu;
	for (let e = 0; e !== i; ++e) n.setTexture2D(t[e] || o, a[e]);
}
function ll(e, t, n) {
	let r = this.cache, i = t.length, a = Ec(n, i);
	wc(r, a) || (e.uniform1iv(this.addr, a), Tc(r, a));
	for (let e = 0; e !== i; ++e) n.setTexture3D(t[e] || Eu, a[e]);
}
function ul(e, t, n) {
	let r = this.cache, i = t.length, a = Ec(n, i);
	wc(r, a) || (e.uniform1iv(this.addr, a), Tc(r, a));
	for (let e = 0; e !== i; ++e) n.setTextureCube(t[e] || Du, a[e]);
}
function dl(e, t, n) {
	let r = this.cache, i = t.length, a = Ec(n, i);
	wc(r, a) || (e.uniform1iv(this.addr, a), Tc(r, a));
	for (let e = 0; e !== i; ++e) n.setTexture2DArray(t[e] || Tu, a[e]);
}
function fl(e) {
	switch (e) {
		case 5126: return qc;
		case 35664: return Jc;
		case 35665: return Yc;
		case 35666: return Xc;
		case 35674: return Zc;
		case 35675: return Qc;
		case 35676: return $c;
		case 5124:
		case 35670: return el;
		case 35667:
		case 35671: return tl;
		case 35668:
		case 35672: return nl;
		case 35669:
		case 35673: return rl;
		case 5125: return il;
		case 36294: return al;
		case 36295: return ol;
		case 36296: return sl;
		case 35678:
		case 36198:
		case 36298:
		case 36306:
		case 35682: return cl;
		case 35679:
		case 36299:
		case 36307: return ll;
		case 35680:
		case 36300:
		case 36308:
		case 36293: return ul;
		case 36289:
		case 36303:
		case 36311:
		case 36292: return dl;
	}
}
function pl(e, t) {
	e.seq.push(t), e.map[t.id] = t;
}
function ml(e, t, n) {
	let r = e.name, i = r.length;
	for (Iu.lastIndex = 0;;) {
		let a = Iu.exec(r), o = Iu.lastIndex, s = a[1], c = a[2] === "]", l = a[3];
		if (c && (s |= 0), l === void 0 || l === "[" && o + 2 === i) {
			pl(n, l === void 0 ? new Nu(s, e, t) : new Pu(s, e, t));
			break;
		}
		{
			let e = n.map[s];
			e === void 0 && (e = new Fu(s), pl(n, e)), n = e;
		}
	}
}
function hl(e, t, n) {
	let r = e.createShader(t);
	return e.shaderSource(r, n), e.compileShader(r), r;
}
function gl(e, t) {
	let n = e.split("\n"), r = [], i = Math.max(t - 6, 0), a = Math.min(t + 6, n.length);
	for (let e = i; e < a; e++) {
		let i = e + 1;
		r.push(`${i === t ? ">" : " "} ${i}: ${n[e]}`);
	}
	return r.join("\n");
}
function _l(e) {
	K._getMatrix(Bu, K.workingColorSpace, e);
	let t = `mat3( ${Bu.elements.map((e) => e.toFixed(4))} )`;
	switch (K.getTransfer(e)) {
		case Ln: return [t, "LinearTransferOETF"];
		case Rn: return [t, "sRGBTransferOETF"];
		default: return u("WebGLProgram: Unsupported color space: ", e), [t, "LinearTransferOETF"];
	}
}
function vl(e, t, n) {
	let r = e.getShaderParameter(t, e.COMPILE_STATUS), i = (e.getShaderInfoLog(t) || "").trim();
	if (r && i === "") return "";
	let a = /ERROR: 0:(\d+)/.exec(i);
	if (a) {
		let r = parseInt(a[1]);
		return n.toUpperCase() + "\n\n" + i + "\n\n" + gl(e.getShaderSource(t), r);
	}
	return i;
}
function yl(e, t) {
	let n = _l(t);
	return [
		`vec4 ${e}( vec4 value ) {`,
		`	return ${n[1]}( vec4( value.rgb * ${n[0]}, value.a ) );`,
		"}"
	].join("\n");
}
function bl(e, t) {
	let n = Vu[t];
	return n === void 0 ? (u("WebGLProgram: Unsupported toneMapping:", t), "vec3 " + e + "( vec3 color ) { return LinearToneMapping( color ); }") : "vec3 " + e + "( vec3 color ) { return " + n + "ToneMapping( color ); }";
}
function xl() {
	return K.getLuminanceCoefficients(Hu), [
		"float luminance( const in vec3 rgb ) {",
		`	const vec3 weights = vec3( ${Hu.x.toFixed(4)}, ${Hu.y.toFixed(4)}, ${Hu.z.toFixed(4)} );`,
		"	return dot( weights, rgb );",
		"}"
	].join("\n");
}
function Sl(e) {
	return [e.extensionClipCullDistance ? "#extension GL_ANGLE_clip_cull_distance : require" : "", e.extensionMultiDraw ? "#extension GL_ANGLE_multi_draw : require" : ""].filter(Tl).join("\n");
}
function Cl(e) {
	let t = [];
	for (let n in e) {
		let r = e[n];
		r !== !1 && t.push("#define " + n + " " + r);
	}
	return t.join("\n");
}
function wl(e, t) {
	let n = {}, r = e.getProgramParameter(t, e.ACTIVE_ATTRIBUTES);
	for (let i = 0; i < r; i++) {
		let r = e.getActiveAttrib(t, i), a = r.name, o = 1;
		r.type === e.FLOAT_MAT2 && (o = 2), r.type === e.FLOAT_MAT3 && (o = 3), r.type === e.FLOAT_MAT4 && (o = 4), n[a] = {
			type: r.type,
			location: e.getAttribLocation(t, a),
			locationSize: o
		};
	}
	return n;
}
function Tl(e) {
	return e !== "";
}
function El(e, t) {
	let n = t.numSpotLightShadows + t.numSpotLightMaps - t.numSpotLightShadowsWithMaps;
	return e.replace(/NUM_DIR_LIGHTS/g, t.numDirLights).replace(/NUM_SPOT_LIGHTS/g, t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g, t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g, n).replace(/NUM_RECT_AREA_LIGHTS/g, t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g, t.numPointLights).replace(/NUM_HEMI_LIGHTS/g, t.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g, t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g, t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g, t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g, t.numPointLightShadows);
}
function Dl(e, t) {
	return e.replace(/NUM_CLIPPING_PLANES/g, t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g, t.numClippingPlanes - t.numClipIntersection);
}
function Ol(e) {
	return e.replace(Uu, kl);
}
function kl(e, t) {
	let n = Y[t];
	if (n === void 0) {
		let e = Wu.get(t);
		if (e !== void 0) n = Y[e], u("WebGLRenderer: Shader chunk \"%s\" has been deprecated. Use \"%s\" instead.", t, e);
		else throw Error("THREE.WebGLProgram: Can not resolve #include <" + t + ">");
	}
	return Ol(n);
}
function Al(e) {
	return e.replace(Gu, jl);
}
function jl(e, t, n, r) {
	let i = "";
	for (let e = parseInt(t); e < parseInt(n); e++) i += r.replace(/\[\s*i\s*\]/g, "[ " + e + " ]").replace(/UNROLLED_LOOP_INDEX/g, e);
	return i;
}
function Ml(e) {
	let t = `precision ${e.precision} float;
	precision ${e.precision} int;
	precision ${e.precision} sampler2D;
	precision ${e.precision} samplerCube;
	precision ${e.precision} sampler3D;
	precision ${e.precision} sampler2DArray;
	precision ${e.precision} sampler2DShadow;
	precision ${e.precision} samplerCubeShadow;
	precision ${e.precision} sampler2DArrayShadow;
	precision ${e.precision} isampler2D;
	precision ${e.precision} isampler3D;
	precision ${e.precision} isamplerCube;
	precision ${e.precision} isampler2DArray;
	precision ${e.precision} usampler2D;
	precision ${e.precision} usampler3D;
	precision ${e.precision} usamplerCube;
	precision ${e.precision} usampler2DArray;
	`;
	return e.precision === "highp" ? t += "\n#define HIGH_PRECISION" : e.precision === "mediump" ? t += "\n#define MEDIUM_PRECISION" : e.precision === "lowp" && (t += "\n#define LOW_PRECISION"), t;
}
function Nl(e) {
	return Ku[e.shadowMapType] || "SHADOWMAP_TYPE_BASIC";
}
function Pl(e) {
	return e.envMap === !1 ? "ENVMAP_TYPE_CUBE" : qu[e.envMapMode] || "ENVMAP_TYPE_CUBE";
}
function Fl(e) {
	return e.envMap === !1 ? "ENVMAP_MODE_REFLECTION" : Ju[e.envMapMode] || "ENVMAP_MODE_REFLECTION";
}
function Il(e) {
	return e.envMap === !1 ? "ENVMAP_BLENDING_NONE" : Yu[e.combine] || "ENVMAP_BLENDING_NONE";
}
function Ll(e) {
	let t = e.envMapCubeUVHeight;
	if (t === null) return null;
	let n = Math.log2(t) - 2, r = 1 / t;
	return {
		texelWidth: 1 / (3 * Math.max(2 ** n, 112)),
		texelHeight: r,
		maxMip: n
	};
}
function Rl(e, t, n, r) {
	let i = e.getContext(), a = n.defines, o = n.vertexShader, s = n.fragmentShader, c = Nl(n), l = Pl(n), f = Fl(n), p = Il(n), m = Ll(n), h = Sl(n), g = Cl(a), _ = i.createProgram(), v, y, b = n.glslVersion ? "#version " + n.glslVersion + "\n" : "";
	n.isRawShaderMaterial ? (v = [
		"#define SHADER_TYPE " + n.shaderType,
		"#define SHADER_NAME " + n.shaderName,
		g
	].filter(Tl).join("\n"), v.length > 0 && (v += "\n"), y = [
		"#define SHADER_TYPE " + n.shaderType,
		"#define SHADER_NAME " + n.shaderName,
		g
	].filter(Tl).join("\n"), y.length > 0 && (y += "\n")) : (v = [
		Ml(n),
		"#define SHADER_TYPE " + n.shaderType,
		"#define SHADER_NAME " + n.shaderName,
		g,
		n.extensionClipCullDistance ? "#define USE_CLIP_DISTANCE" : "",
		n.batching ? "#define USE_BATCHING" : "",
		n.batchingColor ? "#define USE_BATCHING_COLOR" : "",
		n.instancing ? "#define USE_INSTANCING" : "",
		n.instancingColor ? "#define USE_INSTANCING_COLOR" : "",
		n.instancingMorph ? "#define USE_INSTANCING_MORPH" : "",
		n.useFog && n.fog ? "#define USE_FOG" : "",
		n.useFog && n.fogExp2 ? "#define FOG_EXP2" : "",
		n.map ? "#define USE_MAP" : "",
		n.envMap ? "#define USE_ENVMAP" : "",
		n.envMap ? "#define " + f : "",
		n.lightMap ? "#define USE_LIGHTMAP" : "",
		n.aoMap ? "#define USE_AOMAP" : "",
		n.bumpMap ? "#define USE_BUMPMAP" : "",
		n.normalMap ? "#define USE_NORMALMAP" : "",
		n.normalMapObjectSpace ? "#define USE_NORMALMAP_OBJECTSPACE" : "",
		n.normalMapTangentSpace ? "#define USE_NORMALMAP_TANGENTSPACE" : "",
		n.displacementMap ? "#define USE_DISPLACEMENTMAP" : "",
		n.emissiveMap ? "#define USE_EMISSIVEMAP" : "",
		n.anisotropy ? "#define USE_ANISOTROPY" : "",
		n.anisotropyMap ? "#define USE_ANISOTROPYMAP" : "",
		n.clearcoatMap ? "#define USE_CLEARCOATMAP" : "",
		n.clearcoatRoughnessMap ? "#define USE_CLEARCOAT_ROUGHNESSMAP" : "",
		n.clearcoatNormalMap ? "#define USE_CLEARCOAT_NORMALMAP" : "",
		n.iridescenceMap ? "#define USE_IRIDESCENCEMAP" : "",
		n.iridescenceThicknessMap ? "#define USE_IRIDESCENCE_THICKNESSMAP" : "",
		n.specularMap ? "#define USE_SPECULARMAP" : "",
		n.specularColorMap ? "#define USE_SPECULAR_COLORMAP" : "",
		n.specularIntensityMap ? "#define USE_SPECULAR_INTENSITYMAP" : "",
		n.roughnessMap ? "#define USE_ROUGHNESSMAP" : "",
		n.metalnessMap ? "#define USE_METALNESSMAP" : "",
		n.alphaMap ? "#define USE_ALPHAMAP" : "",
		n.alphaHash ? "#define USE_ALPHAHASH" : "",
		n.transmission ? "#define USE_TRANSMISSION" : "",
		n.transmissionMap ? "#define USE_TRANSMISSIONMAP" : "",
		n.thicknessMap ? "#define USE_THICKNESSMAP" : "",
		n.sheenColorMap ? "#define USE_SHEEN_COLORMAP" : "",
		n.sheenRoughnessMap ? "#define USE_SHEEN_ROUGHNESSMAP" : "",
		n.mapUv ? "#define MAP_UV " + n.mapUv : "",
		n.alphaMapUv ? "#define ALPHAMAP_UV " + n.alphaMapUv : "",
		n.lightMapUv ? "#define LIGHTMAP_UV " + n.lightMapUv : "",
		n.aoMapUv ? "#define AOMAP_UV " + n.aoMapUv : "",
		n.emissiveMapUv ? "#define EMISSIVEMAP_UV " + n.emissiveMapUv : "",
		n.bumpMapUv ? "#define BUMPMAP_UV " + n.bumpMapUv : "",
		n.normalMapUv ? "#define NORMALMAP_UV " + n.normalMapUv : "",
		n.displacementMapUv ? "#define DISPLACEMENTMAP_UV " + n.displacementMapUv : "",
		n.metalnessMapUv ? "#define METALNESSMAP_UV " + n.metalnessMapUv : "",
		n.roughnessMapUv ? "#define ROUGHNESSMAP_UV " + n.roughnessMapUv : "",
		n.anisotropyMapUv ? "#define ANISOTROPYMAP_UV " + n.anisotropyMapUv : "",
		n.clearcoatMapUv ? "#define CLEARCOATMAP_UV " + n.clearcoatMapUv : "",
		n.clearcoatNormalMapUv ? "#define CLEARCOAT_NORMALMAP_UV " + n.clearcoatNormalMapUv : "",
		n.clearcoatRoughnessMapUv ? "#define CLEARCOAT_ROUGHNESSMAP_UV " + n.clearcoatRoughnessMapUv : "",
		n.iridescenceMapUv ? "#define IRIDESCENCEMAP_UV " + n.iridescenceMapUv : "",
		n.iridescenceThicknessMapUv ? "#define IRIDESCENCE_THICKNESSMAP_UV " + n.iridescenceThicknessMapUv : "",
		n.sheenColorMapUv ? "#define SHEEN_COLORMAP_UV " + n.sheenColorMapUv : "",
		n.sheenRoughnessMapUv ? "#define SHEEN_ROUGHNESSMAP_UV " + n.sheenRoughnessMapUv : "",
		n.specularMapUv ? "#define SPECULARMAP_UV " + n.specularMapUv : "",
		n.specularColorMapUv ? "#define SPECULAR_COLORMAP_UV " + n.specularColorMapUv : "",
		n.specularIntensityMapUv ? "#define SPECULAR_INTENSITYMAP_UV " + n.specularIntensityMapUv : "",
		n.transmissionMapUv ? "#define TRANSMISSIONMAP_UV " + n.transmissionMapUv : "",
		n.thicknessMapUv ? "#define THICKNESSMAP_UV " + n.thicknessMapUv : "",
		n.vertexTangents && n.flatShading === !1 ? "#define USE_TANGENT" : "",
		n.vertexNormals ? "#define HAS_NORMAL" : "",
		n.vertexColors ? "#define USE_COLOR" : "",
		n.vertexAlphas ? "#define USE_COLOR_ALPHA" : "",
		n.vertexUv1s ? "#define USE_UV1" : "",
		n.vertexUv2s ? "#define USE_UV2" : "",
		n.vertexUv3s ? "#define USE_UV3" : "",
		n.pointsUvs ? "#define USE_POINTS_UV" : "",
		n.flatShading ? "#define FLAT_SHADED" : "",
		n.skinning ? "#define USE_SKINNING" : "",
		n.morphTargets ? "#define USE_MORPHTARGETS" : "",
		n.morphNormals && n.flatShading === !1 ? "#define USE_MORPHNORMALS" : "",
		n.morphColors ? "#define USE_MORPHCOLORS" : "",
		n.morphTargetsCount > 0 ? "#define MORPHTARGETS_TEXTURE_STRIDE " + n.morphTextureStride : "",
		n.morphTargetsCount > 0 ? "#define MORPHTARGETS_COUNT " + n.morphTargetsCount : "",
		n.doubleSided ? "#define DOUBLE_SIDED" : "",
		n.flipSided ? "#define FLIP_SIDED" : "",
		n.shadowMapEnabled ? "#define USE_SHADOWMAP" : "",
		n.shadowMapEnabled ? "#define " + c : "",
		n.sizeAttenuation ? "#define USE_SIZEATTENUATION" : "",
		n.numLightProbes > 0 ? "#define USE_LIGHT_PROBES" : "",
		n.logarithmicDepthBuffer ? "#define USE_LOGARITHMIC_DEPTH_BUFFER" : "",
		n.reversedDepthBuffer ? "#define USE_REVERSED_DEPTH_BUFFER" : "",
		"uniform mat4 modelMatrix;",
		"uniform mat4 modelViewMatrix;",
		"uniform mat4 projectionMatrix;",
		"uniform mat4 viewMatrix;",
		"uniform mat3 normalMatrix;",
		"uniform vec3 cameraPosition;",
		"uniform bool isOrthographic;",
		"#ifdef USE_INSTANCING",
		"	attribute mat4 instanceMatrix;",
		"#endif",
		"#ifdef USE_INSTANCING_COLOR",
		"	attribute vec3 instanceColor;",
		"#endif",
		"#ifdef USE_INSTANCING_MORPH",
		"	uniform sampler2D morphTexture;",
		"#endif",
		"attribute vec3 position;",
		"attribute vec3 normal;",
		"attribute vec2 uv;",
		"#ifdef USE_UV1",
		"	attribute vec2 uv1;",
		"#endif",
		"#ifdef USE_UV2",
		"	attribute vec2 uv2;",
		"#endif",
		"#ifdef USE_UV3",
		"	attribute vec2 uv3;",
		"#endif",
		"#ifdef USE_TANGENT",
		"	attribute vec4 tangent;",
		"#endif",
		"#if defined( USE_COLOR_ALPHA )",
		"	attribute vec4 color;",
		"#elif defined( USE_COLOR )",
		"	attribute vec3 color;",
		"#endif",
		"#ifdef USE_SKINNING",
		"	attribute vec4 skinIndex;",
		"	attribute vec4 skinWeight;",
		"#endif",
		"\n"
	].filter(Tl).join("\n"), y = [
		Ml(n),
		"#define SHADER_TYPE " + n.shaderType,
		"#define SHADER_NAME " + n.shaderName,
		g,
		n.useFog && n.fog ? "#define USE_FOG" : "",
		n.useFog && n.fogExp2 ? "#define FOG_EXP2" : "",
		n.alphaToCoverage ? "#define ALPHA_TO_COVERAGE" : "",
		n.map ? "#define USE_MAP" : "",
		n.matcap ? "#define USE_MATCAP" : "",
		n.envMap ? "#define USE_ENVMAP" : "",
		n.envMap ? "#define " + l : "",
		n.envMap ? "#define " + f : "",
		n.envMap ? "#define " + p : "",
		m ? "#define CUBEUV_TEXEL_WIDTH " + m.texelWidth : "",
		m ? "#define CUBEUV_TEXEL_HEIGHT " + m.texelHeight : "",
		m ? "#define CUBEUV_MAX_MIP " + m.maxMip + ".0" : "",
		n.lightMap ? "#define USE_LIGHTMAP" : "",
		n.aoMap ? "#define USE_AOMAP" : "",
		n.bumpMap ? "#define USE_BUMPMAP" : "",
		n.normalMap ? "#define USE_NORMALMAP" : "",
		n.normalMapObjectSpace ? "#define USE_NORMALMAP_OBJECTSPACE" : "",
		n.normalMapTangentSpace ? "#define USE_NORMALMAP_TANGENTSPACE" : "",
		n.packedNormalMap ? "#define USE_PACKED_NORMALMAP" : "",
		n.emissiveMap ? "#define USE_EMISSIVEMAP" : "",
		n.anisotropy ? "#define USE_ANISOTROPY" : "",
		n.anisotropyMap ? "#define USE_ANISOTROPYMAP" : "",
		n.clearcoat ? "#define USE_CLEARCOAT" : "",
		n.clearcoatMap ? "#define USE_CLEARCOATMAP" : "",
		n.clearcoatRoughnessMap ? "#define USE_CLEARCOAT_ROUGHNESSMAP" : "",
		n.clearcoatNormalMap ? "#define USE_CLEARCOAT_NORMALMAP" : "",
		n.dispersion ? "#define USE_DISPERSION" : "",
		n.iridescence ? "#define USE_IRIDESCENCE" : "",
		n.iridescenceMap ? "#define USE_IRIDESCENCEMAP" : "",
		n.iridescenceThicknessMap ? "#define USE_IRIDESCENCE_THICKNESSMAP" : "",
		n.specularMap ? "#define USE_SPECULARMAP" : "",
		n.specularColorMap ? "#define USE_SPECULAR_COLORMAP" : "",
		n.specularIntensityMap ? "#define USE_SPECULAR_INTENSITYMAP" : "",
		n.roughnessMap ? "#define USE_ROUGHNESSMAP" : "",
		n.metalnessMap ? "#define USE_METALNESSMAP" : "",
		n.alphaMap ? "#define USE_ALPHAMAP" : "",
		n.alphaTest ? "#define USE_ALPHATEST" : "",
		n.alphaHash ? "#define USE_ALPHAHASH" : "",
		n.sheen ? "#define USE_SHEEN" : "",
		n.sheenColorMap ? "#define USE_SHEEN_COLORMAP" : "",
		n.sheenRoughnessMap ? "#define USE_SHEEN_ROUGHNESSMAP" : "",
		n.transmission ? "#define USE_TRANSMISSION" : "",
		n.transmissionMap ? "#define USE_TRANSMISSIONMAP" : "",
		n.thicknessMap ? "#define USE_THICKNESSMAP" : "",
		n.vertexTangents && n.flatShading === !1 ? "#define USE_TANGENT" : "",
		n.vertexColors || n.instancingColor ? "#define USE_COLOR" : "",
		n.vertexAlphas || n.batchingColor ? "#define USE_COLOR_ALPHA" : "",
		n.vertexUv1s ? "#define USE_UV1" : "",
		n.vertexUv2s ? "#define USE_UV2" : "",
		n.vertexUv3s ? "#define USE_UV3" : "",
		n.pointsUvs ? "#define USE_POINTS_UV" : "",
		n.gradientMap ? "#define USE_GRADIENTMAP" : "",
		n.flatShading ? "#define FLAT_SHADED" : "",
		n.doubleSided ? "#define DOUBLE_SIDED" : "",
		n.flipSided ? "#define FLIP_SIDED" : "",
		n.shadowMapEnabled ? "#define USE_SHADOWMAP" : "",
		n.shadowMapEnabled ? "#define " + c : "",
		n.premultipliedAlpha ? "#define PREMULTIPLIED_ALPHA" : "",
		n.numLightProbes > 0 ? "#define USE_LIGHT_PROBES" : "",
		n.numLightProbeGrids > 0 ? "#define USE_LIGHT_PROBES_GRID" : "",
		n.decodeVideoTexture ? "#define DECODE_VIDEO_TEXTURE" : "",
		n.decodeVideoTextureEmissive ? "#define DECODE_VIDEO_TEXTURE_EMISSIVE" : "",
		n.logarithmicDepthBuffer ? "#define USE_LOGARITHMIC_DEPTH_BUFFER" : "",
		n.reversedDepthBuffer ? "#define USE_REVERSED_DEPTH_BUFFER" : "",
		"uniform mat4 viewMatrix;",
		"uniform vec3 cameraPosition;",
		"uniform bool isOrthographic;",
		n.toneMapping === 0 ? "" : "#define TONE_MAPPING",
		n.toneMapping === 0 ? "" : Y.tonemapping_pars_fragment,
		n.toneMapping === 0 ? "" : bl("toneMapping", n.toneMapping),
		n.dithering ? "#define DITHERING" : "",
		n.opaque ? "#define OPAQUE" : "",
		Y.colorspace_pars_fragment,
		yl("linearToOutputTexel", n.outputColorSpace),
		xl(),
		n.useDepthPacking ? "#define DEPTH_PACKING " + n.depthPacking : "",
		"\n"
	].filter(Tl).join("\n")), o = Ol(o), o = El(o, n), o = Dl(o, n), s = Ol(s), s = El(s, n), s = Dl(s, n), o = Al(o), s = Al(s), n.isRawShaderMaterial !== !0 && (b = "#version 300 es\n", v = [
		h,
		"#define attribute in",
		"#define varying out",
		"#define texture2D texture"
	].join("\n") + "\n" + v, y = [
		"#define varying in",
		n.glslVersion === "300 es" ? "" : "layout(location = 0) out highp vec4 pc_fragColor;",
		n.glslVersion === "300 es" ? "" : "#define gl_FragColor pc_fragColor",
		"#define gl_FragDepthEXT gl_FragDepth",
		"#define texture2D texture",
		"#define textureCube texture",
		"#define texture2DProj textureProj",
		"#define texture2DLodEXT textureLod",
		"#define texture2DProjLodEXT textureProjLod",
		"#define textureCubeLodEXT textureLod",
		"#define texture2DGradEXT textureGrad",
		"#define texture2DProjGradEXT textureProjGrad",
		"#define textureCubeGradEXT textureGrad"
	].join("\n") + "\n" + y);
	let x = b + v + o, S = b + y + s, C = hl(i, i.VERTEX_SHADER, x), w = hl(i, i.FRAGMENT_SHADER, S);
	i.attachShader(_, C), i.attachShader(_, w), n.index0AttributeName === void 0 ? n.hasPositionAttribute === !0 && i.bindAttribLocation(_, 0, "position") : i.bindAttribLocation(_, 0, n.index0AttributeName), i.linkProgram(_);
	function T(t) {
		if (e.debug.checkShaderErrors) {
			let n = i.getProgramInfoLog(_) || "", r = i.getShaderInfoLog(C) || "", a = i.getShaderInfoLog(w) || "", o = n.trim(), s = r.trim(), c = a.trim(), l = !0, f = !0;
			if (i.getProgramParameter(_, i.LINK_STATUS) === !1) {
				if (l = !1, typeof e.debug.onShaderError == "function") e.debug.onShaderError(i, _, C, w);
				else {
					let e = vl(i, C, "vertex"), n = vl(i, w, "fragment");
					d("WebGLProgram: Shader Error " + i.getError() + " - VALIDATE_STATUS " + i.getProgramParameter(_, i.VALIDATE_STATUS) + "\n\nMaterial Name: " + t.name + "\nMaterial Type: " + t.type + "\n\nProgram Info Log: " + o + "\n" + e + "\n" + n);
				}
			} else o === "" ? (s === "" || c === "") && (f = !1) : u("WebGLProgram: Program Info Log:", o);
			f && (t.diagnostics = {
				runnable: l,
				programLog: o,
				vertexShader: {
					log: s,
					prefix: v
				},
				fragmentShader: {
					log: c,
					prefix: y
				}
			});
		}
		i.deleteShader(C), i.deleteShader(w), E = new Lu(i, _), D = wl(i, _);
	}
	let E;
	this.getUniforms = function() {
		return E === void 0 && T(this), E;
	};
	let D;
	this.getAttributes = function() {
		return D === void 0 && T(this), D;
	};
	let O = n.rendererExtensionParallelShaderCompile === !1;
	return this.isReady = function() {
		return O === !1 && (O = i.getProgramParameter(_, Ru)), O;
	}, this.destroy = function() {
		r.releaseStatesOfProgram(this), i.deleteProgram(_), this.program = void 0;
	}, this.type = n.shaderType, this.name = n.shaderName, this.id = zu++, this.cacheKey = t, this.usedTimes = 1, this.program = _, this.vertexShader = C, this.fragmentShader = w, this;
}
function zl(e) {
	return e === 1030 || e === 37490 || e === 36285;
}
function Bl(e, t, n, r, i, a) {
	let o = new Tr(), s = new Zu(), c = /* @__PURE__ */ new Set(), l = [], d = /* @__PURE__ */ new Map(), f = r.logarithmicDepthBuffer, p = r.precision, m = {
		MeshDepthMaterial: "depth",
		MeshDistanceMaterial: "distance",
		MeshNormalMaterial: "normal",
		MeshBasicMaterial: "basic",
		MeshLambertMaterial: "lambert",
		MeshPhongMaterial: "phong",
		MeshToonMaterial: "toon",
		MeshStandardMaterial: "physical",
		MeshPhysicalMaterial: "physical",
		MeshMatcapMaterial: "matcap",
		LineBasicMaterial: "basic",
		LineDashedMaterial: "dashed",
		PointsMaterial: "points",
		ShadowMaterial: "shadow",
		SpriteMaterial: "sprite"
	};
	function h(e) {
		return c.add(e), e === 0 ? "uv" : `uv${e}`;
	}
	function g(i, o, l, d, g, _) {
		let v = d.fog, y = g.geometry, b = i.isMeshStandardMaterial || i.isMeshLambertMaterial || i.isMeshPhongMaterial ? d.environment : null, x = i.isMeshStandardMaterial || i.isMeshLambertMaterial && !i.envMap || i.isMeshPhongMaterial && !i.envMap, S = t.get(i.envMap || b, x), C = S && S.mapping === 306 ? S.image.height : null, w = m[i.type];
		i.precision !== null && (p = r.getMaxPrecision(i.precision), p !== i.precision && u("WebGLProgram.getParameters:", i.precision, "not supported, using", p, "instead."));
		let T = y.morphAttributes.position || y.morphAttributes.normal || y.morphAttributes.color, E = T === void 0 ? 0 : T.length, D = 0;
		y.morphAttributes.position !== void 0 && (D = 1), y.morphAttributes.normal !== void 0 && (D = 2), y.morphAttributes.color !== void 0 && (D = 3);
		let O, k, A, j;
		if (w) {
			let e = au[w];
			O = e.vertexShader, k = e.fragmentShader;
		} else {
			O = i.vertexShader, k = i.fragmentShader;
			let e = s.getVertexShaderStage(i), t = s.getFragmentShaderStage(i);
			s.update(i, e, t), A = e.id, j = t.id;
		}
		let M = e.getRenderTarget(), ee = e.state.buffers.depth.getReversed(), te = g.isInstancedMesh === !0, N = g.isBatchedMesh === !0, ne = !!i.map, P = !!i.matcap, F = !!S, re = !!i.aoMap, ie = !!i.lightMap, I = !!i.bumpMap && i.wireframe === !1, ae = !!i.normalMap, oe = !!i.displacementMap, se = !!i.emissiveMap, ce = !!i.metalnessMap, le = !!i.roughnessMap, ue = i.anisotropy > 0, de = i.clearcoat > 0, fe = i.dispersion > 0, pe = i.iridescence > 0, me = i.sheen > 0, he = i.transmission > 0, ge = ue && !!i.anisotropyMap, _e = de && !!i.clearcoatMap, ve = de && !!i.clearcoatNormalMap, ye = de && !!i.clearcoatRoughnessMap, be = pe && !!i.iridescenceMap, xe = pe && !!i.iridescenceThicknessMap, Se = me && !!i.sheenColorMap, Ce = me && !!i.sheenRoughnessMap, we = !!i.specularMap, Te = !!i.specularColorMap, L = !!i.specularIntensityMap, Ee = he && !!i.transmissionMap, De = he && !!i.thicknessMap, R = !!i.gradientMap, z = !!i.alphaMap, Oe = i.alphaTest > 0, B = !!i.alphaHash, V = !!i.extensions, ke = 0;
		i.toneMapped && (M === null || M.isXRRenderTarget === !0) && (ke = e.toneMapping);
		let Ae = {
			shaderID: w,
			shaderType: i.type,
			shaderName: i.name,
			vertexShader: O,
			fragmentShader: k,
			defines: i.defines,
			customVertexShaderID: A,
			customFragmentShaderID: j,
			isRawShaderMaterial: i.isRawShaderMaterial === !0,
			glslVersion: i.glslVersion,
			precision: p,
			batching: N,
			batchingColor: N && g._colorsTexture !== null,
			instancing: te,
			instancingColor: te && g.instanceColor !== null,
			instancingMorph: te && g.morphTexture !== null,
			outputColorSpace: M === null ? e.outputColorSpace : M.isXRRenderTarget === !0 ? M.texture.colorSpace : K.workingColorSpace,
			alphaToCoverage: !!i.alphaToCoverage,
			map: ne,
			matcap: P,
			envMap: F,
			envMapMode: F && S.mapping,
			envMapCubeUVHeight: C,
			aoMap: re,
			lightMap: ie,
			bumpMap: I,
			normalMap: ae,
			displacementMap: oe,
			emissiveMap: se,
			normalMapObjectSpace: ae && i.normalMapType === 1,
			normalMapTangentSpace: ae && i.normalMapType === 0,
			packedNormalMap: ae && i.normalMapType === 0 && zl(i.normalMap.format),
			metalnessMap: ce,
			roughnessMap: le,
			anisotropy: ue,
			anisotropyMap: ge,
			clearcoat: de,
			clearcoatMap: _e,
			clearcoatNormalMap: ve,
			clearcoatRoughnessMap: ye,
			dispersion: fe,
			iridescence: pe,
			iridescenceMap: be,
			iridescenceThicknessMap: xe,
			sheen: me,
			sheenColorMap: Se,
			sheenRoughnessMap: Ce,
			specularMap: we,
			specularColorMap: Te,
			specularIntensityMap: L,
			transmission: he,
			transmissionMap: Ee,
			thicknessMap: De,
			gradientMap: R,
			opaque: i.transparent === !1 && i.blending === 1 && i.alphaToCoverage === !1,
			alphaMap: z,
			alphaTest: Oe,
			alphaHash: B,
			combine: i.combine,
			mapUv: ne && h(i.map.channel),
			aoMapUv: re && h(i.aoMap.channel),
			lightMapUv: ie && h(i.lightMap.channel),
			bumpMapUv: I && h(i.bumpMap.channel),
			normalMapUv: ae && h(i.normalMap.channel),
			displacementMapUv: oe && h(i.displacementMap.channel),
			emissiveMapUv: se && h(i.emissiveMap.channel),
			metalnessMapUv: ce && h(i.metalnessMap.channel),
			roughnessMapUv: le && h(i.roughnessMap.channel),
			anisotropyMapUv: ge && h(i.anisotropyMap.channel),
			clearcoatMapUv: _e && h(i.clearcoatMap.channel),
			clearcoatNormalMapUv: ve && h(i.clearcoatNormalMap.channel),
			clearcoatRoughnessMapUv: ye && h(i.clearcoatRoughnessMap.channel),
			iridescenceMapUv: be && h(i.iridescenceMap.channel),
			iridescenceThicknessMapUv: xe && h(i.iridescenceThicknessMap.channel),
			sheenColorMapUv: Se && h(i.sheenColorMap.channel),
			sheenRoughnessMapUv: Ce && h(i.sheenRoughnessMap.channel),
			specularMapUv: we && h(i.specularMap.channel),
			specularColorMapUv: Te && h(i.specularColorMap.channel),
			specularIntensityMapUv: L && h(i.specularIntensityMap.channel),
			transmissionMapUv: Ee && h(i.transmissionMap.channel),
			thicknessMapUv: De && h(i.thicknessMap.channel),
			alphaMapUv: z && h(i.alphaMap.channel),
			vertexTangents: !!y.attributes.tangent && (ae || ue),
			vertexNormals: !!y.attributes.normal,
			vertexColors: i.vertexColors,
			vertexAlphas: i.vertexColors === !0 && !!y.attributes.color && y.attributes.color.itemSize === 4,
			pointsUvs: g.isPoints === !0 && !!y.attributes.uv && (ne || z),
			fog: !!v,
			useFog: i.fog === !0,
			fogExp2: !!v && v.isFogExp2,
			flatShading: i.wireframe === !1 && (i.flatShading === !0 || y.attributes.normal === void 0 && ae === !1 && (i.isMeshLambertMaterial || i.isMeshPhongMaterial || i.isMeshStandardMaterial || i.isMeshPhysicalMaterial)),
			sizeAttenuation: i.sizeAttenuation === !0,
			logarithmicDepthBuffer: f,
			reversedDepthBuffer: ee,
			skinning: g.isSkinnedMesh === !0,
			hasPositionAttribute: y.attributes.position !== void 0,
			morphTargets: y.morphAttributes.position !== void 0,
			morphNormals: y.morphAttributes.normal !== void 0,
			morphColors: y.morphAttributes.color !== void 0,
			morphTargetsCount: E,
			morphTextureStride: D,
			numDirLights: o.directional.length,
			numPointLights: o.point.length,
			numSpotLights: o.spot.length,
			numSpotLightMaps: o.spotLightMap.length,
			numRectAreaLights: o.rectArea.length,
			numHemiLights: o.hemi.length,
			numDirLightShadows: o.directionalShadowMap.length,
			numPointLightShadows: o.pointShadowMap.length,
			numSpotLightShadows: o.spotShadowMap.length,
			numSpotLightShadowsWithMaps: o.numSpotLightShadowsWithMaps,
			numLightProbes: o.numLightProbes,
			numLightProbeGrids: _.length,
			numClippingPlanes: a.numPlanes,
			numClipIntersection: a.numIntersection,
			dithering: i.dithering,
			shadowMapEnabled: e.shadowMap.enabled && l.length > 0,
			shadowMapType: e.shadowMap.type,
			toneMapping: ke,
			decodeVideoTexture: ne && i.map.isVideoTexture === !0 && K.getTransfer(i.map.colorSpace) === "srgb",
			decodeVideoTextureEmissive: se && i.emissiveMap.isVideoTexture === !0 && K.getTransfer(i.emissiveMap.colorSpace) === "srgb",
			premultipliedAlpha: i.premultipliedAlpha,
			doubleSided: i.side === 2,
			flipSided: i.side === 1,
			useDepthPacking: i.depthPacking >= 0,
			depthPacking: i.depthPacking || 0,
			index0AttributeName: i.index0AttributeName,
			extensionClipCullDistance: V && i.extensions.clipCullDistance === !0 && n.has("WEBGL_clip_cull_distance"),
			extensionMultiDraw: (V && i.extensions.multiDraw === !0 || N) && n.has("WEBGL_multi_draw"),
			rendererExtensionParallelShaderCompile: n.has("KHR_parallel_shader_compile"),
			customProgramCacheKey: i.customProgramCacheKey()
		};
		return Ae.vertexUv1s = c.has(1), Ae.vertexUv2s = c.has(2), Ae.vertexUv3s = c.has(3), c.clear(), Ae;
	}
	function _(t) {
		let n = [];
		if (t.shaderID ? n.push(t.shaderID) : (n.push(t.customVertexShaderID), n.push(t.customFragmentShaderID)), t.defines !== void 0) for (let e in t.defines) n.push(e), n.push(t.defines[e]);
		return t.isRawShaderMaterial === !1 && (v(n, t), y(n, t), n.push(e.outputColorSpace)), n.push(t.customProgramCacheKey), n.join();
	}
	function v(e, t) {
		e.push(t.precision), e.push(t.outputColorSpace), e.push(t.envMapMode), e.push(t.envMapCubeUVHeight), e.push(t.mapUv), e.push(t.alphaMapUv), e.push(t.lightMapUv), e.push(t.aoMapUv), e.push(t.bumpMapUv), e.push(t.normalMapUv), e.push(t.displacementMapUv), e.push(t.emissiveMapUv), e.push(t.metalnessMapUv), e.push(t.roughnessMapUv), e.push(t.anisotropyMapUv), e.push(t.clearcoatMapUv), e.push(t.clearcoatNormalMapUv), e.push(t.clearcoatRoughnessMapUv), e.push(t.iridescenceMapUv), e.push(t.iridescenceThicknessMapUv), e.push(t.sheenColorMapUv), e.push(t.sheenRoughnessMapUv), e.push(t.specularMapUv), e.push(t.specularColorMapUv), e.push(t.specularIntensityMapUv), e.push(t.transmissionMapUv), e.push(t.thicknessMapUv), e.push(t.combine), e.push(t.fogExp2), e.push(t.sizeAttenuation), e.push(t.morphTargetsCount), e.push(t.morphAttributeCount), e.push(t.numDirLights), e.push(t.numPointLights), e.push(t.numSpotLights), e.push(t.numSpotLightMaps), e.push(t.numHemiLights), e.push(t.numRectAreaLights), e.push(t.numDirLightShadows), e.push(t.numPointLightShadows), e.push(t.numSpotLightShadows), e.push(t.numSpotLightShadowsWithMaps), e.push(t.numLightProbes), e.push(t.shadowMapType), e.push(t.toneMapping), e.push(t.numClippingPlanes), e.push(t.numClipIntersection), e.push(t.depthPacking);
	}
	function y(e, t) {
		o.disableAll(), t.instancing && o.enable(0), t.instancingColor && o.enable(1), t.instancingMorph && o.enable(2), t.matcap && o.enable(3), t.envMap && o.enable(4), t.normalMapObjectSpace && o.enable(5), t.normalMapTangentSpace && o.enable(6), t.clearcoat && o.enable(7), t.iridescence && o.enable(8), t.alphaTest && o.enable(9), t.vertexColors && o.enable(10), t.vertexAlphas && o.enable(11), t.vertexUv1s && o.enable(12), t.vertexUv2s && o.enable(13), t.vertexUv3s && o.enable(14), t.vertexTangents && o.enable(15), t.anisotropy && o.enable(16), t.alphaHash && o.enable(17), t.batching && o.enable(18), t.dispersion && o.enable(19), t.batchingColor && o.enable(20), t.gradientMap && o.enable(21), t.packedNormalMap && o.enable(22), t.vertexNormals && o.enable(23), e.push(o.mask), o.disableAll(), t.fog && o.enable(0), t.useFog && o.enable(1), t.flatShading && o.enable(2), t.logarithmicDepthBuffer && o.enable(3), t.reversedDepthBuffer && o.enable(4), t.skinning && o.enable(5), t.morphTargets && o.enable(6), t.morphNormals && o.enable(7), t.morphColors && o.enable(8), t.premultipliedAlpha && o.enable(9), t.shadowMapEnabled && o.enable(10), t.doubleSided && o.enable(11), t.flipSided && o.enable(12), t.useDepthPacking && o.enable(13), t.dithering && o.enable(14), t.transmission && o.enable(15), t.sheen && o.enable(16), t.opaque && o.enable(17), t.pointsUvs && o.enable(18), t.decodeVideoTexture && o.enable(19), t.decodeVideoTextureEmissive && o.enable(20), t.alphaToCoverage && o.enable(21), t.numLightProbeGrids > 0 && o.enable(22), t.hasPositionAttribute && o.enable(23), e.push(o.mask);
	}
	function b(e) {
		let t = m[e.type], n;
		if (t) {
			let e = au[t];
			n = Eo.clone(e.uniforms);
		} else n = e.uniforms;
		return n;
	}
	function x(t, n) {
		let r = d.get(n);
		return r === void 0 ? (r = new Rl(e, n, t, i), l.push(r), d.set(n, r)) : ++r.usedTimes, r;
	}
	function S(e) {
		if (--e.usedTimes === 0) {
			let t = l.indexOf(e);
			l[t] = l[l.length - 1], l.pop(), d.delete(e.cacheKey), e.destroy();
		}
	}
	function C(e) {
		s.remove(e);
	}
	function w() {
		s.dispose();
	}
	return {
		getParameters: g,
		getProgramCacheKey: _,
		getUniforms: b,
		acquireProgram: x,
		releaseProgram: S,
		releaseShaderCache: C,
		programs: l,
		dispose: w
	};
}
function Vl() {
	let e = /* @__PURE__ */ new WeakMap();
	function t(t) {
		return e.has(t);
	}
	function n(t) {
		let n = e.get(t);
		return n === void 0 && (n = {}, e.set(t, n)), n;
	}
	function r(t) {
		e.delete(t);
	}
	function i(t, n, r) {
		e.get(t)[n] = r;
	}
	function a() {
		e = /* @__PURE__ */ new WeakMap();
	}
	return {
		has: t,
		get: n,
		remove: r,
		update: i,
		dispose: a
	};
}
function Hl(e, t) {
	return e.groupOrder === t.groupOrder ? e.renderOrder === t.renderOrder ? e.material.id === t.material.id ? e.materialVariant === t.materialVariant ? e.z === t.z ? e.id - t.id : e.z - t.z : e.materialVariant - t.materialVariant : e.material.id - t.material.id : e.renderOrder - t.renderOrder : e.groupOrder - t.groupOrder;
}
function Ul(e, t) {
	return e.groupOrder === t.groupOrder ? e.renderOrder === t.renderOrder ? e.z === t.z ? e.id - t.id : t.z - e.z : e.renderOrder - t.renderOrder : e.groupOrder - t.groupOrder;
}
function Wl() {
	let e = [], t = 0, n = [], r = [], i = [];
	function a() {
		t = 0, n.length = 0, r.length = 0, i.length = 0;
	}
	function o(e) {
		let t = 0;
		return e.isInstancedMesh && (t += 2), e.isSkinnedMesh && (t += 1), t;
	}
	function s(n, r, i, a, s, c) {
		let l = e[t];
		return l === void 0 ? (l = {
			id: n.id,
			object: n,
			geometry: r,
			material: i,
			materialVariant: o(n),
			groupOrder: a,
			renderOrder: n.renderOrder,
			z: s,
			group: c
		}, e[t] = l) : (l.id = n.id, l.object = n, l.geometry = r, l.material = i, l.materialVariant = o(n), l.groupOrder = a, l.renderOrder = n.renderOrder, l.z = s, l.group = c), t++, l;
	}
	function c(e, t, a, o, c, l) {
		let u = s(e, t, a, o, c, l);
		a.transmission > 0 ? r.push(u) : a.transparent === !0 ? i.push(u) : n.push(u);
	}
	function l(e, t, a, o, c, l) {
		let u = s(e, t, a, o, c, l);
		a.transmission > 0 ? r.unshift(u) : a.transparent === !0 ? i.unshift(u) : n.unshift(u);
	}
	function u(e, t, a) {
		n.length > 1 && n.sort(e || Hl), r.length > 1 && r.sort(t || Ul), i.length > 1 && i.sort(t || Ul), a && (n.reverse(), r.reverse(), i.reverse());
	}
	function d() {
		for (let n = t, r = e.length; n < r; n++) {
			let t = e[n];
			if (t.id === null) break;
			t.id = null, t.object = null, t.geometry = null, t.material = null, t.group = null;
		}
	}
	return {
		opaque: n,
		transmissive: r,
		transparent: i,
		init: a,
		push: c,
		unshift: l,
		finish: d,
		sort: u
	};
}
function Gl() {
	let e = /* @__PURE__ */ new WeakMap();
	function t(t, n) {
		let r = e.get(t), i;
		return r === void 0 ? (i = new Wl(), e.set(t, [i])) : n >= r.length ? (i = new Wl(), r.push(i)) : i = r[n], i;
	}
	function n() {
		e = /* @__PURE__ */ new WeakMap();
	}
	return {
		get: t,
		dispose: n
	};
}
function Kl() {
	let e = {};
	return { get: function(t) {
		if (e[t.id] !== void 0) return e[t.id];
		let n;
		switch (t.type) {
			case "DirectionalLight":
				n = {
					direction: new W(),
					color: new J()
				};
				break;
			case "SpotLight":
				n = {
					position: new W(),
					direction: new W(),
					color: new J(),
					distance: 0,
					coneCos: 0,
					penumbraCos: 0,
					decay: 0
				};
				break;
			case "PointLight":
				n = {
					position: new W(),
					color: new J(),
					distance: 0,
					decay: 0
				};
				break;
			case "HemisphereLight":
				n = {
					direction: new W(),
					skyColor: new J(),
					groundColor: new J()
				};
				break;
			case "RectAreaLight": n = {
				color: new J(),
				position: new W(),
				halfWidth: new W(),
				halfHeight: new W()
			};
		}
		return e[t.id] = n, n;
	} };
}
function ql() {
	let e = {};
	return { get: function(t) {
		if (e[t.id] !== void 0) return e[t.id];
		let n;
		switch (t.type) {
			case "DirectionalLight":
				n = {
					shadowIntensity: 1,
					shadowBias: 0,
					shadowNormalBias: 0,
					shadowRadius: 1,
					shadowMapSize: new U()
				};
				break;
			case "SpotLight":
				n = {
					shadowIntensity: 1,
					shadowBias: 0,
					shadowNormalBias: 0,
					shadowRadius: 1,
					shadowMapSize: new U()
				};
				break;
			case "PointLight": n = {
				shadowIntensity: 1,
				shadowBias: 0,
				shadowNormalBias: 0,
				shadowRadius: 1,
				shadowMapSize: new U(),
				shadowCameraNear: 1,
				shadowCameraFar: 1e3
			};
		}
		return e[t.id] = n, n;
	} };
}
function Jl(e, t) {
	return (t.castShadow ? 2 : 0) - (e.castShadow ? 2 : 0) + +!!t.map - !!e.map;
}
function Yl(e) {
	let t = new Kl(), n = ql(), r = {
		version: 0,
		hash: {
			directionalLength: -1,
			pointLength: -1,
			spotLength: -1,
			rectAreaLength: -1,
			hemiLength: -1,
			numDirectionalShadows: -1,
			numPointShadows: -1,
			numSpotShadows: -1,
			numSpotMaps: -1,
			numLightProbes: -1
		},
		ambient: [
			0,
			0,
			0
		],
		probe: [],
		directional: [],
		directionalShadow: [],
		directionalShadowMap: [],
		directionalShadowMatrix: [],
		spot: [],
		spotLightMap: [],
		spotShadow: [],
		spotShadowMap: [],
		spotLightMatrix: [],
		rectArea: [],
		rectAreaLTC1: null,
		rectAreaLTC2: null,
		point: [],
		pointShadow: [],
		pointShadowMap: [],
		pointShadowMatrix: [],
		hemi: [],
		numSpotLightShadowsWithMaps: 0,
		numLightProbes: 0
	};
	for (let e = 0; e < 9; e++) r.probe.push(new W());
	let i = new W(), a = new q(), o = new q();
	function s(i) {
		let a = 0, o = 0, s = 0;
		for (let e = 0; e < 9; e++) r.probe[e].set(0, 0, 0);
		let c = 0, l = 0, u = 0, d = 0, f = 0, p = 0, m = 0, h = 0, g = 0, _ = 0, v = 0;
		i.sort(Jl);
		for (let e = 0, y = i.length; e < y; e++) {
			let y = i[e], b = y.color, x = y.intensity, S = y.distance, C = null;
			if (y.shadow && y.shadow.map && (C = y.shadow.map.texture.format === 1030 ? y.shadow.map.texture : y.shadow.map.depthTexture || y.shadow.map.texture), y.isAmbientLight) a += b.r * x, o += b.g * x, s += b.b * x;
			else if (y.isLightProbe) {
				for (let e = 0; e < 9; e++) r.probe[e].addScaledVector(y.sh.coefficients[e], x);
				v++;
			} else if (y.isDirectionalLight) {
				let e = t.get(y);
				if (e.color.copy(y.color).multiplyScalar(y.intensity), y.castShadow) {
					let e = y.shadow, t = n.get(y);
					t.shadowIntensity = e.intensity, t.shadowBias = e.bias, t.shadowNormalBias = e.normalBias, t.shadowRadius = e.radius, t.shadowMapSize = e.mapSize, r.directionalShadow[c] = t, r.directionalShadowMap[c] = C, r.directionalShadowMatrix[c] = y.shadow.matrix, p++;
				}
				r.directional[c] = e, c++;
			} else if (y.isSpotLight) {
				let e = t.get(y);
				e.position.setFromMatrixPosition(y.matrixWorld), e.color.copy(b).multiplyScalar(x), e.distance = S, e.coneCos = Math.cos(y.angle), e.penumbraCos = Math.cos(y.angle * (1 - y.penumbra)), e.decay = y.decay, r.spot[u] = e;
				let i = y.shadow;
				if (y.map && (r.spotLightMap[g] = y.map, g++, i.updateMatrices(y), y.castShadow && _++), r.spotLightMatrix[u] = i.matrix, y.castShadow) {
					let e = n.get(y);
					e.shadowIntensity = i.intensity, e.shadowBias = i.bias, e.shadowNormalBias = i.normalBias, e.shadowRadius = i.radius, e.shadowMapSize = i.mapSize, r.spotShadow[u] = e, r.spotShadowMap[u] = C, h++;
				}
				u++;
			} else if (y.isRectAreaLight) {
				let e = t.get(y);
				e.color.copy(b).multiplyScalar(x), e.halfWidth.set(y.width * .5, 0, 0), e.halfHeight.set(0, y.height * .5, 0), r.rectArea[d] = e, d++;
			} else if (y.isPointLight) {
				let e = t.get(y);
				if (e.color.copy(y.color).multiplyScalar(y.intensity), e.distance = y.distance, e.decay = y.decay, y.castShadow) {
					let e = y.shadow, t = n.get(y);
					t.shadowIntensity = e.intensity, t.shadowBias = e.bias, t.shadowNormalBias = e.normalBias, t.shadowRadius = e.radius, t.shadowMapSize = e.mapSize, t.shadowCameraNear = e.camera.near, t.shadowCameraFar = e.camera.far, r.pointShadow[l] = t, r.pointShadowMap[l] = C, r.pointShadowMatrix[l] = y.shadow.matrix, m++;
				}
				r.point[l] = e, l++;
			} else if (y.isHemisphereLight) {
				let e = t.get(y);
				e.skyColor.copy(y.color).multiplyScalar(x), e.groundColor.copy(y.groundColor).multiplyScalar(x), r.hemi[f] = e, f++;
			}
		}
		d > 0 && (e.has("OES_texture_float_linear") === !0 ? (r.rectAreaLTC1 = X.LTC_FLOAT_1, r.rectAreaLTC2 = X.LTC_FLOAT_2) : (r.rectAreaLTC1 = X.LTC_HALF_1, r.rectAreaLTC2 = X.LTC_HALF_2)), r.ambient[0] = a, r.ambient[1] = o, r.ambient[2] = s;
		let y = r.hash;
		(y.directionalLength !== c || y.pointLength !== l || y.spotLength !== u || y.rectAreaLength !== d || y.hemiLength !== f || y.numDirectionalShadows !== p || y.numPointShadows !== m || y.numSpotShadows !== h || y.numSpotMaps !== g || y.numLightProbes !== v) && (r.directional.length = c, r.spot.length = u, r.rectArea.length = d, r.point.length = l, r.hemi.length = f, r.directionalShadow.length = p, r.directionalShadowMap.length = p, r.pointShadow.length = m, r.pointShadowMap.length = m, r.spotShadow.length = h, r.spotShadowMap.length = h, r.directionalShadowMatrix.length = p, r.pointShadowMatrix.length = m, r.spotLightMatrix.length = h + g - _, r.spotLightMap.length = g, r.numSpotLightShadowsWithMaps = _, r.numLightProbes = v, y.directionalLength = c, y.pointLength = l, y.spotLength = u, y.rectAreaLength = d, y.hemiLength = f, y.numDirectionalShadows = p, y.numPointShadows = m, y.numSpotShadows = h, y.numSpotMaps = g, y.numLightProbes = v, r.version = $u++);
	}
	function c(e, t) {
		let n = 0, s = 0, c = 0, l = 0, u = 0, d = t.matrixWorldInverse;
		for (let t = 0, f = e.length; t < f; t++) {
			let f = e[t];
			if (f.isDirectionalLight) {
				let e = r.directional[n];
				e.direction.setFromMatrixPosition(f.matrixWorld), i.setFromMatrixPosition(f.target.matrixWorld), e.direction.sub(i), e.direction.transformDirection(d), n++;
			} else if (f.isSpotLight) {
				let e = r.spot[c];
				e.position.setFromMatrixPosition(f.matrixWorld), e.position.applyMatrix4(d), e.direction.setFromMatrixPosition(f.matrixWorld), i.setFromMatrixPosition(f.target.matrixWorld), e.direction.sub(i), e.direction.transformDirection(d), c++;
			} else if (f.isRectAreaLight) {
				let e = r.rectArea[l];
				e.position.setFromMatrixPosition(f.matrixWorld), e.position.applyMatrix4(d), o.identity(), a.copy(f.matrixWorld), a.premultiply(d), o.extractRotation(a), e.halfWidth.set(f.width * .5, 0, 0), e.halfHeight.set(0, f.height * .5, 0), e.halfWidth.applyMatrix4(o), e.halfHeight.applyMatrix4(o), l++;
			} else if (f.isPointLight) {
				let e = r.point[s];
				e.position.setFromMatrixPosition(f.matrixWorld), e.position.applyMatrix4(d), s++;
			} else if (f.isHemisphereLight) {
				let e = r.hemi[u];
				e.direction.setFromMatrixPosition(f.matrixWorld), e.direction.transformDirection(d), u++;
			}
		}
	}
	return {
		setup: s,
		setupView: c,
		state: r
	};
}
function Xl(e) {
	let t = new Yl(e), n = [], r = [], i = [];
	function a(e) {
		d.camera = e, n.length = 0, r.length = 0, i.length = 0;
	}
	function o(e) {
		n.push(e);
	}
	function s(e) {
		r.push(e);
	}
	function c(e) {
		i.push(e);
	}
	function l() {
		t.setup(n);
	}
	function u(e) {
		t.setupView(n, e);
	}
	let d = {
		lightsArray: n,
		shadowsArray: r,
		lightProbeGridArray: i,
		camera: null,
		lights: t,
		transmissionRenderTarget: {},
		textureUnits: 0
	};
	return {
		init: a,
		state: d,
		setupLights: l,
		setupLightsView: u,
		pushLight: o,
		pushShadow: s,
		pushLightProbeGrid: c
	};
}
function Zl(e) {
	let t = /* @__PURE__ */ new WeakMap();
	function n(n, r = 0) {
		let i = t.get(n), a;
		return i === void 0 ? (a = new Xl(e), t.set(n, [a])) : r >= i.length ? (a = new Xl(e), i.push(a)) : a = i[r], a;
	}
	function r() {
		t = /* @__PURE__ */ new WeakMap();
	}
	return {
		get: n,
		dispose: r
	};
}
function Ql(e, t, n) {
	let r = new Ka(), i = new U(), a = new U(), o = new ur(), s = new Fo(), c = new Io(), l = {}, d = n.maxTextureSize, f = {
		0: 1,
		1: 0,
		2: 2
	}, p = new ko({
		defines: { VSM_SAMPLES: 8 },
		uniforms: {
			shadow_pass: { value: null },
			resolution: { value: new U() },
			radius: { value: 4 }
		},
		vertexShader: ed,
		fragmentShader: td
	}), m = p.clone();
	m.defines.HORIZONTAL_PASS = 1;
	let h = new Hi();
	h.setAttribute("position", new Di(new Float32Array([
		-1,
		-1,
		.5,
		3,
		-1,
		.5,
		-1,
		3,
		.5
	]), 3));
	let g = new ma(h, p), _ = this;
	this.enabled = !1, this.autoUpdate = !0, this.needsUpdate = !1, this.type = 1;
	let v = this.type;
	this.render = function(t, n, s) {
		if (_.enabled === !1 || _.autoUpdate === !1 && _.needsUpdate === !1 || t.length === 0) return;
		this.type === 2 && (u("WebGLShadowMap: PCFSoftShadowMap has been deprecated. Using PCFShadowMap instead."), this.type = 1);
		let c = e.getRenderTarget(), l = e.getActiveCubeFace(), f = e.getActiveMipmapLevel(), p = e.state;
		p.setBlending(0), p.buffers.depth.getReversed() === !0 ? p.buffers.color.setClear(0, 0, 0, 0) : p.buffers.color.setClear(1, 1, 1, 1), p.buffers.depth.setTest(!0), p.setScissorTest(!1);
		let m = v !== this.type;
		m && n.traverse(function(e) {
			e.material && (Array.isArray(e.material) ? e.material.forEach((e) => e.needsUpdate = !0) : e.material.needsUpdate = !0);
		});
		for (let c = 0, l = t.length; c < l; c++) {
			let l = t[c], f = l.shadow;
			if (f === void 0) {
				u("WebGLShadowMap:", l, "has no shadow.");
				continue;
			}
			if (f.autoUpdate === !1 && f.needsUpdate === !1) continue;
			i.copy(f.mapSize);
			let h = f.getFrameExtents();
			i.multiply(h), a.copy(f.mapSize), (i.x > d || i.y > d) && (i.x > d && (a.x = Math.floor(d / h.x), i.x = a.x * h.x, f.mapSize.x = a.x), i.y > d && (a.y = Math.floor(d / h.y), i.y = a.y * h.y, f.mapSize.y = a.y));
			let g = e.state.buffers.depth.getReversed();
			if (f.camera._reversedDepth = g, f.map === null || m === !0) {
				if (f.map !== null && (f.map.depthTexture !== null && (f.map.depthTexture.dispose(), f.map.depthTexture = null), f.map.dispose()), this.type === 3) {
					if (l.isPointLight) {
						u("WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.");
						continue;
					}
					f.map = new fr(i.x, i.y, {
						format: Rt,
						type: Tt,
						minFilter: ht,
						magFilter: ht,
						generateMipmaps: !1
					}), f.map.texture.name = l.name + ".shadowMap", f.map.depthTexture = new mo(i.x, i.y, wt), f.map.depthTexture.name = l.name + ".shadowMapDepth", f.map.depthTexture.format = Pt, f.map.depthTexture.compareFunction = null, f.map.depthTexture.minFilter = ft, f.map.depthTexture.magFilter = ft;
				} else l.isPointLight ? (f.map = new xu(i.x), f.map.depthTexture = new ho(i.x, Ct)) : (f.map = new fr(i.x, i.y), f.map.depthTexture = new mo(i.x, i.y, Ct)), f.map.depthTexture.name = l.name + ".shadowMap", f.map.depthTexture.format = Pt, this.type === 1 ? (f.map.depthTexture.compareFunction = g ? 518 : 515, f.map.depthTexture.minFilter = ht, f.map.depthTexture.magFilter = ht) : (f.map.depthTexture.compareFunction = null, f.map.depthTexture.minFilter = ft, f.map.depthTexture.magFilter = ft);
				f.camera.updateProjectionMatrix();
			}
			let _ = f.map.isWebGLCubeRenderTarget ? 6 : 1;
			for (let t = 0; t < _; t++) {
				if (f.map.isWebGLCubeRenderTarget) e.setRenderTarget(f.map, t), e.clear();
				else {
					t === 0 && (e.setRenderTarget(f.map), e.clear());
					let n = f.getViewport(t);
					o.set(a.x * n.x, a.y * n.y, a.x * n.z, a.y * n.w), p.viewport(o);
				}
				if (l.isPointLight) {
					let e = f.camera, n = f.matrix, r = l.distance || e.far;
					r !== e.far && (e.far = r, e.updateProjectionMatrix()), ad.setFromMatrixPosition(l.matrixWorld), e.position.copy(ad), od.copy(e.position), od.add(nd[t]), e.up.copy(rd[t]), e.lookAt(od), e.updateMatrixWorld(), n.makeTranslation(-ad.x, -ad.y, -ad.z), id.multiplyMatrices(e.projectionMatrix, e.matrixWorldInverse), f._frustum.setFromProjectionMatrix(id, e.coordinateSystem, e.reversedDepth);
				} else f.updateMatrices(l);
				r = f.getFrustum(), x(n, s, f.camera, l, this.type);
			}
			f.isPointLightShadow !== !0 && this.type === 3 && y(f, s), f.needsUpdate = !1;
		}
		v = this.type, _.needsUpdate = !1, e.setRenderTarget(c, l, f);
	};
	function y(n, r) {
		let a = t.update(g);
		p.defines.VSM_SAMPLES !== n.blurSamples && (p.defines.VSM_SAMPLES = n.blurSamples, m.defines.VSM_SAMPLES = n.blurSamples, p.needsUpdate = !0, m.needsUpdate = !0), n.mapPass === null && (n.mapPass = new fr(i.x, i.y, {
			format: Rt,
			type: Tt
		})), p.uniforms.shadow_pass.value = n.map.depthTexture, p.uniforms.resolution.value = n.mapSize, p.uniforms.radius.value = n.radius, e.setRenderTarget(n.mapPass), e.clear(), e.renderBufferDirect(r, null, a, p, g, null), m.uniforms.shadow_pass.value = n.mapPass.texture, m.uniforms.resolution.value = n.mapSize, m.uniforms.radius.value = n.radius, e.setRenderTarget(n.map), e.clear(), e.renderBufferDirect(r, null, a, m, g, null);
	}
	function b(t, n, r, i) {
		let a = null, o = r.isPointLight === !0 ? t.customDistanceMaterial : t.customDepthMaterial;
		if (o !== void 0) a = o;
		else if (a = r.isPointLight === !0 ? c : s, e.localClippingEnabled && n.clipShadows === !0 && Array.isArray(n.clippingPlanes) && n.clippingPlanes.length !== 0 || n.displacementMap && n.displacementScale !== 0 || n.alphaMap && n.alphaTest > 0 || n.map && n.alphaTest > 0 || n.alphaToCoverage === !0) {
			let e = a.uuid, t = n.uuid, r = l[e];
			r === void 0 && (r = {}, l[e] = r);
			let i = r[t];
			i === void 0 && (i = a.clone(), r[t] = i, n.addEventListener("dispose", S)), a = i;
		}
		if (a.visible = n.visible, a.wireframe = n.wireframe, i === 3 ? a.side = n.shadowSide === null ? n.side : n.shadowSide : a.side = n.shadowSide === null ? f[n.side] : n.shadowSide, a.alphaMap = n.alphaMap, a.alphaTest = n.alphaToCoverage === !0 ? .5 : n.alphaTest, a.map = n.map, a.clipShadows = n.clipShadows, a.clippingPlanes = n.clippingPlanes, a.clipIntersection = n.clipIntersection, a.displacementMap = n.displacementMap, a.displacementScale = n.displacementScale, a.displacementBias = n.displacementBias, a.wireframeLinewidth = n.wireframeLinewidth, a.linewidth = n.linewidth, r.isPointLight === !0 && a.isMeshDistanceMaterial === !0) {
			let t = e.properties.get(a);
			t.light = r;
		}
		return a;
	}
	function x(n, i, a, o, s) {
		if (n.visible === !1) return;
		if (n.layers.test(i.layers) && (n.isMesh || n.isLine || n.isPoints) && (n.castShadow || n.receiveShadow && s === 3) && (!n.frustumCulled || r.intersectsObject(n))) {
			n.modelViewMatrix.multiplyMatrices(a.matrixWorldInverse, n.matrixWorld);
			let r = t.update(n), c = n.material;
			if (Array.isArray(c)) {
				let t = r.groups;
				for (let l = 0, u = t.length; l < u; l++) {
					let u = t[l], d = c[u.materialIndex];
					if (d && d.visible) {
						let t = b(n, d, o, s);
						n.onBeforeShadow(e, n, i, a, r, t, u), e.renderBufferDirect(a, null, r, t, n, u), n.onAfterShadow(e, n, i, a, r, t, u);
					}
				}
			} else if (c.visible) {
				let t = b(n, c, o, s);
				n.onBeforeShadow(e, n, i, a, r, t, null), e.renderBufferDirect(a, null, r, t, n, null), n.onAfterShadow(e, n, i, a, r, t, null);
			}
		}
		let c = n.children;
		for (let e = 0, t = c.length; e < t; e++) x(c[e], i, a, o, s);
	}
	function S(e) {
		e.target.removeEventListener("dispose", S);
		for (let t in l) {
			let n = l[t], r = e.target.uuid;
			r in n && (n[r].dispose(), delete n[r]);
		}
	}
}
function $l(e, t) {
	function n() {
		let t = !1, n = new ur(), r = null, i = new ur(0, 0, 0, 0);
		return {
			setMask: function(n) {
				r !== n && !t && (e.colorMask(n, n, n, n), r = n);
			},
			setLocked: function(e) {
				t = e;
			},
			setClear: function(t, r, a, o, s) {
				s === !0 && (t *= o, r *= o, a *= o), n.set(t, r, a, o), i.equals(n) === !1 && (e.clearColor(t, r, a, o), i.copy(n));
			},
			reset: function() {
				t = !1, r = null, i.set(-1, 0, 0, 0);
			}
		};
	}
	function r() {
		let n = !1, r = !1, i = null, a = null, o = null;
		return {
			setReversed: function(e) {
				if (r !== e) {
					let n = t.get("EXT_clip_control");
					e ? n.clipControlEXT(n.LOWER_LEFT_EXT, n.ZERO_TO_ONE_EXT) : n.clipControlEXT(n.LOWER_LEFT_EXT, n.NEGATIVE_ONE_TO_ONE_EXT), r = e;
					let i = o;
					o = null, this.setClear(i);
				}
			},
			getReversed: function() {
				return r;
			},
			setTest: function(t) {
				t ? ce(e.DEPTH_TEST) : le(e.DEPTH_TEST);
			},
			setMask: function(t) {
				i !== t && !n && (e.depthMask(t), i = t);
			},
			setFunc: function(t) {
				if (r && (t = Wn[t]), a !== t) {
					switch (t) {
						case 0:
							e.depthFunc(e.NEVER);
							break;
						case 1:
							e.depthFunc(e.ALWAYS);
							break;
						case 2:
							e.depthFunc(e.LESS);
							break;
						case 3:
							e.depthFunc(e.LEQUAL);
							break;
						case 4:
							e.depthFunc(e.EQUAL);
							break;
						case 5:
							e.depthFunc(e.GEQUAL);
							break;
						case 6:
							e.depthFunc(e.GREATER);
							break;
						case 7:
							e.depthFunc(e.NOTEQUAL);
							break;
						default: e.depthFunc(e.LEQUAL);
					}
					a = t;
				}
			},
			setLocked: function(e) {
				n = e;
			},
			setClear: function(t) {
				o !== t && (o = t, r && (t = 1 - t), e.clearDepth(t));
			},
			reset: function() {
				n = !1, i = null, a = null, o = null, r = !1;
			}
		};
	}
	function i() {
		let t = !1, n = null, r = null, i = null, a = null, o = null, s = null, c = null, l = null;
		return {
			setTest: function(n) {
				t || (n ? ce(e.STENCIL_TEST) : le(e.STENCIL_TEST));
			},
			setMask: function(r) {
				n !== r && !t && (e.stencilMask(r), n = r);
			},
			setFunc: function(t, n, o) {
				(r !== t || i !== n || a !== o) && (e.stencilFunc(t, n, o), r = t, i = n, a = o);
			},
			setOp: function(t, n, r) {
				(o !== t || s !== n || c !== r) && (e.stencilOp(t, n, r), o = t, s = n, c = r);
			},
			setLocked: function(e) {
				t = e;
			},
			setClear: function(t) {
				l !== t && (e.clearStencil(t), l = t);
			},
			reset: function() {
				t = !1, n = null, r = null, i = null, a = null, o = null, s = null, c = null, l = null;
			}
		};
	}
	let a = new n(), o = new r(), s = new i(), c = /* @__PURE__ */ new WeakMap(), l = /* @__PURE__ */ new WeakMap(), u = {}, f = {}, p = {}, m = /* @__PURE__ */ new WeakMap(), h = [], g = null, _ = !1, v = null, y = null, b = null, x = null, S = null, C = null, w = null, T = new J(0, 0, 0), E = 0, D = !1, O = null, k = null, A = null, j = null, M = null, ee = e.getParameter(e.MAX_COMBINED_TEXTURE_IMAGE_UNITS), te = !1, N = 0, ne = e.getParameter(e.VERSION);
	ne.indexOf("WebGL") === -1 ? ne.indexOf("OpenGL ES") !== -1 && (N = parseFloat(/^OpenGL ES (\d)/.exec(ne)[1]), te = N >= 2) : (N = parseFloat(/^WebGL (\d)/.exec(ne)[1]), te = N >= 1);
	let P = null, F = {}, re = e.getParameter(e.SCISSOR_BOX), ie = e.getParameter(e.VIEWPORT), I = new ur().fromArray(re), ae = new ur().fromArray(ie);
	function oe(t, n, r, i) {
		let a = /* @__PURE__ */ new Uint8Array(4), o = e.createTexture();
		e.bindTexture(t, o), e.texParameteri(t, e.TEXTURE_MIN_FILTER, e.NEAREST), e.texParameteri(t, e.TEXTURE_MAG_FILTER, e.NEAREST);
		for (let o = 0; o < r; o++) t === e.TEXTURE_3D || t === e.TEXTURE_2D_ARRAY ? e.texImage3D(n, 0, e.RGBA, 1, 1, i, 0, e.RGBA, e.UNSIGNED_BYTE, a) : e.texImage2D(n + o, 0, e.RGBA, 1, 1, 0, e.RGBA, e.UNSIGNED_BYTE, a);
		return o;
	}
	let se = {};
	se[e.TEXTURE_2D] = oe(e.TEXTURE_2D, e.TEXTURE_2D, 1), se[e.TEXTURE_CUBE_MAP] = oe(e.TEXTURE_CUBE_MAP, e.TEXTURE_CUBE_MAP_POSITIVE_X, 6), se[e.TEXTURE_2D_ARRAY] = oe(e.TEXTURE_2D_ARRAY, e.TEXTURE_2D_ARRAY, 1, 1), se[e.TEXTURE_3D] = oe(e.TEXTURE_3D, e.TEXTURE_3D, 1, 1), a.setClear(0, 0, 0, 1), o.setClear(1), s.setClear(0), ce(e.DEPTH_TEST), o.setFunc(3), _e(!1), ve(1), ce(e.CULL_FACE), he(0);
	function ce(t) {
		u[t] !== !0 && (e.enable(t), u[t] = !0);
	}
	function le(t) {
		u[t] !== !1 && (e.disable(t), u[t] = !1);
	}
	function ue(t, n) {
		return p[t] !== n && (e.bindFramebuffer(t, n), p[t] = n, t === e.DRAW_FRAMEBUFFER && (p[e.FRAMEBUFFER] = n), t === e.FRAMEBUFFER && (p[e.DRAW_FRAMEBUFFER] = n), !0);
	}
	function de(t, n) {
		let r = h, i = !1;
		if (t) {
			r = m.get(n), r === void 0 && (r = [], m.set(n, r));
			let a = t.textures;
			if (r.length !== a.length || r[0] !== e.COLOR_ATTACHMENT0) {
				for (let t = 0, n = a.length; t < n; t++) r[t] = e.COLOR_ATTACHMENT0 + t;
				r.length = a.length, i = !0;
			}
		} else r[0] !== e.BACK && (r[0] = e.BACK, i = !0);
		i && e.drawBuffers(r);
	}
	function fe(t) {
		return g !== t && (e.useProgram(t), g = t, !0);
	}
	let pe = {
		100: e.FUNC_ADD,
		101: e.FUNC_SUBTRACT,
		102: e.FUNC_REVERSE_SUBTRACT
	};
	pe[103] = e.MIN, pe[104] = e.MAX;
	let me = {
		200: e.ZERO,
		201: e.ONE,
		202: e.SRC_COLOR,
		204: e.SRC_ALPHA,
		210: e.SRC_ALPHA_SATURATE,
		208: e.DST_COLOR,
		206: e.DST_ALPHA,
		203: e.ONE_MINUS_SRC_COLOR,
		205: e.ONE_MINUS_SRC_ALPHA,
		209: e.ONE_MINUS_DST_COLOR,
		207: e.ONE_MINUS_DST_ALPHA,
		211: e.CONSTANT_COLOR,
		212: e.ONE_MINUS_CONSTANT_COLOR,
		213: e.CONSTANT_ALPHA,
		214: e.ONE_MINUS_CONSTANT_ALPHA
	};
	function he(t, n, r, i, a, o, s, c, l, u) {
		if (t === 0) {
			_ === !0 && (le(e.BLEND), _ = !1);
			return;
		}
		if (_ === !1 && (ce(e.BLEND), _ = !0), t !== 5) {
			if (t !== v || u !== D) {
				if ((y !== 100 || S !== 100) && (e.blendEquation(e.FUNC_ADD), y = 100, S = 100), u) switch (t) {
					case 1:
						e.blendFuncSeparate(e.ONE, e.ONE_MINUS_SRC_ALPHA, e.ONE, e.ONE_MINUS_SRC_ALPHA);
						break;
					case 2:
						e.blendFunc(e.ONE, e.ONE);
						break;
					case 3:
						e.blendFuncSeparate(e.ZERO, e.ONE_MINUS_SRC_COLOR, e.ZERO, e.ONE);
						break;
					case 4:
						e.blendFuncSeparate(e.DST_COLOR, e.ONE_MINUS_SRC_ALPHA, e.ZERO, e.ONE);
						break;
					default: d("WebGLState: Invalid blending: ", t);
				}
				else switch (t) {
					case 1:
						e.blendFuncSeparate(e.SRC_ALPHA, e.ONE_MINUS_SRC_ALPHA, e.ONE, e.ONE_MINUS_SRC_ALPHA);
						break;
					case 2:
						e.blendFuncSeparate(e.SRC_ALPHA, e.ONE, e.ONE, e.ONE);
						break;
					case 3:
						d("WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");
						break;
					case 4:
						d("WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");
						break;
					default: d("WebGLState: Invalid blending: ", t);
				}
				b = null, x = null, C = null, w = null, T.set(0, 0, 0), E = 0, v = t, D = u;
			}
			return;
		}
		a = a || n, o = o || r, s = s || i, (n !== y || a !== S) && (e.blendEquationSeparate(pe[n], pe[a]), y = n, S = a), (r !== b || i !== x || o !== C || s !== w) && (e.blendFuncSeparate(me[r], me[i], me[o], me[s]), b = r, x = i, C = o, w = s), (c.equals(T) === !1 || l !== E) && (e.blendColor(c.r, c.g, c.b, l), T.copy(c), E = l), v = t, D = !1;
	}
	function ge(t, n) {
		t.side === 2 ? le(e.CULL_FACE) : ce(e.CULL_FACE);
		let r = t.side === 1;
		n && (r = !r), _e(r), t.blending === 1 && t.transparent === !1 ? he(0) : he(t.blending, t.blendEquation, t.blendSrc, t.blendDst, t.blendEquationAlpha, t.blendSrcAlpha, t.blendDstAlpha, t.blendColor, t.blendAlpha, t.premultipliedAlpha), o.setFunc(t.depthFunc), o.setTest(t.depthTest), o.setMask(t.depthWrite), a.setMask(t.colorWrite);
		let i = t.stencilWrite;
		s.setTest(i), i && (s.setMask(t.stencilWriteMask), s.setFunc(t.stencilFunc, t.stencilRef, t.stencilFuncMask), s.setOp(t.stencilFail, t.stencilZFail, t.stencilZPass)), be(t.polygonOffset, t.polygonOffsetFactor, t.polygonOffsetUnits), t.alphaToCoverage === !0 ? ce(e.SAMPLE_ALPHA_TO_COVERAGE) : le(e.SAMPLE_ALPHA_TO_COVERAGE);
	}
	function _e(t) {
		O !== t && (t ? e.frontFace(e.CW) : e.frontFace(e.CCW), O = t);
	}
	function ve(t) {
		t === 0 ? le(e.CULL_FACE) : (ce(e.CULL_FACE), t !== k && (t === 1 ? e.cullFace(e.BACK) : t === 2 ? e.cullFace(e.FRONT) : e.cullFace(e.FRONT_AND_BACK))), k = t;
	}
	function ye(t) {
		t !== A && (te && e.lineWidth(t), A = t);
	}
	function be(t, n, r) {
		t ? (ce(e.POLYGON_OFFSET_FILL), (j !== n || M !== r) && (j = n, M = r, o.getReversed() && (n = -n), e.polygonOffset(n, r))) : le(e.POLYGON_OFFSET_FILL);
	}
	function xe(t) {
		t ? ce(e.SCISSOR_TEST) : le(e.SCISSOR_TEST);
	}
	function Se(t) {
		t === void 0 && (t = e.TEXTURE0 + ee - 1), P !== t && (e.activeTexture(t), P = t);
	}
	function Ce(t, n, r) {
		r === void 0 && (r = P === null ? e.TEXTURE0 + ee - 1 : P);
		let i = F[r];
		i === void 0 && (i = {
			type: void 0,
			texture: void 0
		}, F[r] = i), (i.type !== t || i.texture !== n) && (P !== r && (e.activeTexture(r), P = r), e.bindTexture(t, n || se[t]), i.type = t, i.texture = n);
	}
	function we() {
		let t = F[P];
		t !== void 0 && t.type !== void 0 && (e.bindTexture(t.type, null), t.type = void 0, t.texture = void 0);
	}
	function Te() {
		try {
			e.compressedTexImage2D(...arguments);
		} catch (e) {
			d("WebGLState:", e);
		}
	}
	function L() {
		try {
			e.compressedTexImage3D(...arguments);
		} catch (e) {
			d("WebGLState:", e);
		}
	}
	function Ee() {
		try {
			e.texSubImage2D(...arguments);
		} catch (e) {
			d("WebGLState:", e);
		}
	}
	function De() {
		try {
			e.texSubImage3D(...arguments);
		} catch (e) {
			d("WebGLState:", e);
		}
	}
	function R() {
		try {
			e.compressedTexSubImage2D(...arguments);
		} catch (e) {
			d("WebGLState:", e);
		}
	}
	function z() {
		try {
			e.compressedTexSubImage3D(...arguments);
		} catch (e) {
			d("WebGLState:", e);
		}
	}
	function Oe() {
		try {
			e.texStorage2D(...arguments);
		} catch (e) {
			d("WebGLState:", e);
		}
	}
	function B() {
		try {
			e.texStorage3D(...arguments);
		} catch (e) {
			d("WebGLState:", e);
		}
	}
	function V() {
		try {
			e.texImage2D(...arguments);
		} catch (e) {
			d("WebGLState:", e);
		}
	}
	function ke() {
		try {
			e.texImage3D(...arguments);
		} catch (e) {
			d("WebGLState:", e);
		}
	}
	function Ae(t) {
		return f[t] === void 0 ? e.getParameter(t) : f[t];
	}
	function je(t, n) {
		f[t] !== n && (e.pixelStorei(t, n), f[t] = n);
	}
	function Me(t) {
		I.equals(t) === !1 && (e.scissor(t.x, t.y, t.z, t.w), I.copy(t));
	}
	function Ne(t) {
		ae.equals(t) === !1 && (e.viewport(t.x, t.y, t.z, t.w), ae.copy(t));
	}
	function Pe(t, n) {
		let r = l.get(n);
		r === void 0 && (r = /* @__PURE__ */ new WeakMap(), l.set(n, r));
		let i = r.get(t);
		i === void 0 && (i = e.getUniformBlockIndex(n, t.name), r.set(t, i));
	}
	function Fe(t, n) {
		let r = l.get(n).get(t);
		c.get(n) !== r && (e.uniformBlockBinding(n, r, t.__bindingPointIndex), c.set(n, r));
	}
	function Ie() {
		e.disable(e.BLEND), e.disable(e.CULL_FACE), e.disable(e.DEPTH_TEST), e.disable(e.POLYGON_OFFSET_FILL), e.disable(e.SCISSOR_TEST), e.disable(e.STENCIL_TEST), e.disable(e.SAMPLE_ALPHA_TO_COVERAGE), e.blendEquation(e.FUNC_ADD), e.blendFunc(e.ONE, e.ZERO), e.blendFuncSeparate(e.ONE, e.ZERO, e.ONE, e.ZERO), e.blendColor(0, 0, 0, 0), e.colorMask(!0, !0, !0, !0), e.clearColor(0, 0, 0, 0), e.depthMask(!0), e.depthFunc(e.LESS), o.setReversed(!1), e.clearDepth(1), e.stencilMask(4294967295), e.stencilFunc(e.ALWAYS, 0, 4294967295), e.stencilOp(e.KEEP, e.KEEP, e.KEEP), e.clearStencil(0), e.cullFace(e.BACK), e.frontFace(e.CCW), e.polygonOffset(0, 0), e.activeTexture(e.TEXTURE0), e.bindFramebuffer(e.FRAMEBUFFER, null), e.bindFramebuffer(e.DRAW_FRAMEBUFFER, null), e.bindFramebuffer(e.READ_FRAMEBUFFER, null), e.useProgram(null), e.lineWidth(1), e.scissor(0, 0, e.canvas.width, e.canvas.height), e.viewport(0, 0, e.canvas.width, e.canvas.height), e.pixelStorei(e.PACK_ALIGNMENT, 4), e.pixelStorei(e.UNPACK_ALIGNMENT, 4), e.pixelStorei(e.UNPACK_FLIP_Y_WEBGL, !1), e.pixelStorei(e.UNPACK_PREMULTIPLY_ALPHA_WEBGL, !1), e.pixelStorei(e.UNPACK_COLORSPACE_CONVERSION_WEBGL, e.BROWSER_DEFAULT_WEBGL), e.pixelStorei(e.PACK_ROW_LENGTH, 0), e.pixelStorei(e.PACK_SKIP_PIXELS, 0), e.pixelStorei(e.PACK_SKIP_ROWS, 0), e.pixelStorei(e.UNPACK_ROW_LENGTH, 0), e.pixelStorei(e.UNPACK_IMAGE_HEIGHT, 0), e.pixelStorei(e.UNPACK_SKIP_PIXELS, 0), e.pixelStorei(e.UNPACK_SKIP_ROWS, 0), e.pixelStorei(e.UNPACK_SKIP_IMAGES, 0), u = {}, f = {}, P = null, F = {}, p = {}, m = /* @__PURE__ */ new WeakMap(), h = [], g = null, _ = !1, v = null, y = null, b = null, x = null, S = null, C = null, w = null, T = new J(0, 0, 0), E = 0, D = !1, O = null, k = null, A = null, j = null, M = null, I.set(0, 0, e.canvas.width, e.canvas.height), ae.set(0, 0, e.canvas.width, e.canvas.height), a.reset(), o.reset(), s.reset();
	}
	return {
		buffers: {
			color: a,
			depth: o,
			stencil: s
		},
		enable: ce,
		disable: le,
		bindFramebuffer: ue,
		drawBuffers: de,
		useProgram: fe,
		setBlending: he,
		setMaterial: ge,
		setFlipSided: _e,
		setCullFace: ve,
		setLineWidth: ye,
		setPolygonOffset: be,
		setScissorTest: xe,
		activeTexture: Se,
		bindTexture: Ce,
		unbindTexture: we,
		compressedTexImage2D: Te,
		compressedTexImage3D: L,
		texImage2D: V,
		texImage3D: ke,
		pixelStorei: je,
		getParameter: Ae,
		updateUBOMapping: Pe,
		uniformBlockBinding: Fe,
		texStorage2D: Oe,
		texStorage3D: B,
		texSubImage2D: Ee,
		texSubImage3D: De,
		compressedTexSubImage2D: R,
		compressedTexSubImage3D: z,
		scissor: Me,
		viewport: Ne,
		reset: Ie
	};
}
function eu(e, t, n, r, i, a, s) {
	let c = t.has("WEBGL_multisampled_render_to_texture") ? t.get("WEBGL_multisampled_render_to_texture") : null, l = typeof navigator > "u" ? !1 : /OculusBrowser/g.test(navigator.userAgent), f = new U(), p = /* @__PURE__ */ new WeakMap(), m = /* @__PURE__ */ new Set(), h, g = /* @__PURE__ */ new WeakMap(), _ = !1;
	try {
		_ = typeof OffscreenCanvas < "u" && new OffscreenCanvas(1, 1).getContext("2d") !== null;
	} catch {}
	function v(e, t) {
		return _ ? new OffscreenCanvas(e, t) : o("canvas");
	}
	function y(e, t, n) {
		let r = 1, i = Ee(e);
		if ((i.width > n || i.height > n) && (r = n / Math.max(i.width, i.height)), r < 1) {
			if (typeof HTMLImageElement < "u" && e instanceof HTMLImageElement || typeof HTMLCanvasElement < "u" && e instanceof HTMLCanvasElement || typeof ImageBitmap < "u" && e instanceof ImageBitmap || typeof VideoFrame < "u" && e instanceof VideoFrame) {
				let n = Math.floor(r * i.width), a = Math.floor(r * i.height);
				h === void 0 && (h = v(n, a));
				let o = t ? v(n, a) : h;
				return o.width = n, o.height = a, o.getContext("2d").drawImage(e, 0, 0, n, a), u("WebGLRenderer: Texture has been resized from (" + i.width + "x" + i.height + ") to (" + n + "x" + a + ")."), o;
			}
			return "data" in e && u("WebGLRenderer: Image in DataTexture is too big (" + i.width + "x" + i.height + ")."), e;
		}
		return e;
	}
	function b(e) {
		return e.generateMipmaps;
	}
	function x(t) {
		e.generateMipmap(t);
	}
	function S(t) {
		return t.isWebGLCubeRenderTarget ? e.TEXTURE_CUBE_MAP : t.isWebGL3DRenderTarget ? e.TEXTURE_3D : t.isWebGLArrayRenderTarget || t.isCompressedArrayTexture ? e.TEXTURE_2D_ARRAY : e.TEXTURE_2D;
	}
	function C(n, r, i, a, o, s = !1) {
		if (n !== null) {
			if (e[n] !== void 0) return e[n];
			u("WebGLRenderer: Attempt to use non-existing WebGL internal format '" + n + "'");
		}
		let c;
		a && (c = t.get("EXT_texture_norm16"), c || u("WebGLRenderer: Unable to use normalized textures without EXT_texture_norm16 extension"));
		let l = r;
		if (r === e.RED && (i === e.FLOAT && (l = e.R32F), i === e.HALF_FLOAT && (l = e.R16F), i === e.UNSIGNED_BYTE && (l = e.R8), i === e.UNSIGNED_SHORT && c && (l = c.R16_EXT), i === e.SHORT && c && (l = c.R16_SNORM_EXT)), r === e.RED_INTEGER && (i === e.UNSIGNED_BYTE && (l = e.R8UI), i === e.UNSIGNED_SHORT && (l = e.R16UI), i === e.UNSIGNED_INT && (l = e.R32UI), i === e.BYTE && (l = e.R8I), i === e.SHORT && (l = e.R16I), i === e.INT && (l = e.R32I)), r === e.RG && (i === e.FLOAT && (l = e.RG32F), i === e.HALF_FLOAT && (l = e.RG16F), i === e.UNSIGNED_BYTE && (l = e.RG8), i === e.UNSIGNED_SHORT && c && (l = c.RG16_EXT), i === e.SHORT && c && (l = c.RG16_SNORM_EXT)), r === e.RG_INTEGER && (i === e.UNSIGNED_BYTE && (l = e.RG8UI), i === e.UNSIGNED_SHORT && (l = e.RG16UI), i === e.UNSIGNED_INT && (l = e.RG32UI), i === e.BYTE && (l = e.RG8I), i === e.SHORT && (l = e.RG16I), i === e.INT && (l = e.RG32I)), r === e.RGB_INTEGER && (i === e.UNSIGNED_BYTE && (l = e.RGB8UI), i === e.UNSIGNED_SHORT && (l = e.RGB16UI), i === e.UNSIGNED_INT && (l = e.RGB32UI), i === e.BYTE && (l = e.RGB8I), i === e.SHORT && (l = e.RGB16I), i === e.INT && (l = e.RGB32I)), r === e.RGBA_INTEGER && (i === e.UNSIGNED_BYTE && (l = e.RGBA8UI), i === e.UNSIGNED_SHORT && (l = e.RGBA16UI), i === e.UNSIGNED_INT && (l = e.RGBA32UI), i === e.BYTE && (l = e.RGBA8I), i === e.SHORT && (l = e.RGBA16I), i === e.INT && (l = e.RGBA32I)), r === e.RGB && (i === e.UNSIGNED_SHORT && c && (l = c.RGB16_EXT), i === e.SHORT && c && (l = c.RGB16_SNORM_EXT), i === e.UNSIGNED_INT_5_9_9_9_REV && (l = e.RGB9_E5), i === e.UNSIGNED_INT_10F_11F_11F_REV && (l = e.R11F_G11F_B10F)), r === e.RGBA) {
			let t = s ? Ln : K.getTransfer(o);
			i === e.FLOAT && (l = e.RGBA32F), i === e.HALF_FLOAT && (l = e.RGBA16F), i === e.UNSIGNED_BYTE && (l = t === "srgb" ? e.SRGB8_ALPHA8 : e.RGBA8), i === e.UNSIGNED_SHORT && c && (l = c.RGBA16_EXT), i === e.SHORT && c && (l = c.RGBA16_SNORM_EXT), i === e.UNSIGNED_SHORT_4_4_4_4 && (l = e.RGBA4), i === e.UNSIGNED_SHORT_5_5_5_1 && (l = e.RGB5_A1);
		}
		return (l === e.R16F || l === e.R32F || l === e.RG16F || l === e.RG32F || l === e.RGBA16F || l === e.RGBA32F) && t.get("EXT_color_buffer_float"), l;
	}
	function w(t, n) {
		let r;
		return t ? n === null || n === 1014 || n === 1020 ? r = e.DEPTH24_STENCIL8 : n === 1015 ? r = e.DEPTH32F_STENCIL8 : n === 1012 && (r = e.DEPTH24_STENCIL8, u("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")) : n === null || n === 1014 || n === 1020 ? r = e.DEPTH_COMPONENT24 : n === 1015 ? r = e.DEPTH_COMPONENT32F : n === 1012 && (r = e.DEPTH_COMPONENT16), r;
	}
	function T(e, t) {
		return b(e) === !0 || e.isFramebufferTexture && e.minFilter !== 1003 && e.minFilter !== 1006 ? Math.log2(Math.max(t.width, t.height)) + 1 : e.mipmaps !== void 0 && e.mipmaps.length > 0 ? e.mipmaps.length : e.isCompressedTexture && Array.isArray(e.image) ? t.mipmaps.length : 1;
	}
	function E(e) {
		let t = e.target;
		t.removeEventListener("dispose", E), O(t), t.isVideoTexture && p.delete(t), t.isHTMLTexture && m.delete(t);
	}
	function D(e) {
		let t = e.target;
		t.removeEventListener("dispose", D), A(t);
	}
	function O(e) {
		let t = r.get(e);
		if (t.__webglInit === void 0) return;
		let n = e.source, i = g.get(n);
		if (i) {
			let r = i[t.__cacheKey];
			r.usedTimes--, r.usedTimes === 0 && k(e), Object.keys(i).length === 0 && g.delete(n);
		}
		r.remove(e);
	}
	function k(t) {
		let n = r.get(t);
		e.deleteTexture(n.__webglTexture);
		let i = t.source, a = g.get(i);
		delete a[n.__cacheKey], s.memory.textures--;
	}
	function A(t) {
		let n = r.get(t);
		if (t.depthTexture && (t.depthTexture.dispose(), r.remove(t.depthTexture)), t.isWebGLCubeRenderTarget) for (let t = 0; t < 6; t++) {
			if (Array.isArray(n.__webglFramebuffer[t])) for (let r = 0; r < n.__webglFramebuffer[t].length; r++) e.deleteFramebuffer(n.__webglFramebuffer[t][r]);
			else e.deleteFramebuffer(n.__webglFramebuffer[t]);
			n.__webglDepthbuffer && e.deleteRenderbuffer(n.__webglDepthbuffer[t]);
		}
		else {
			if (Array.isArray(n.__webglFramebuffer)) for (let t = 0; t < n.__webglFramebuffer.length; t++) e.deleteFramebuffer(n.__webglFramebuffer[t]);
			else e.deleteFramebuffer(n.__webglFramebuffer);
			if (n.__webglDepthbuffer && e.deleteRenderbuffer(n.__webglDepthbuffer), n.__webglMultisampledFramebuffer && e.deleteFramebuffer(n.__webglMultisampledFramebuffer), n.__webglColorRenderbuffer) for (let t = 0; t < n.__webglColorRenderbuffer.length; t++) n.__webglColorRenderbuffer[t] && e.deleteRenderbuffer(n.__webglColorRenderbuffer[t]);
			n.__webglDepthRenderbuffer && e.deleteRenderbuffer(n.__webglDepthRenderbuffer);
		}
		let i = t.textures;
		for (let t = 0, n = i.length; t < n; t++) {
			let n = r.get(i[t]);
			n.__webglTexture && (e.deleteTexture(n.__webglTexture), s.memory.textures--), r.remove(i[t]);
		}
		r.remove(t);
	}
	let j = 0;
	function M() {
		j = 0;
	}
	function ee() {
		return j;
	}
	function te(e) {
		j = e;
	}
	function N() {
		let e = j;
		return e >= i.maxTextures && u("WebGLTextures: Trying to use " + e + " texture units while this GPU supports only " + i.maxTextures), j += 1, e;
	}
	function ne(e) {
		let t = [];
		return t.push(e.wrapS), t.push(e.wrapT), t.push(e.wrapR || 0), t.push(e.magFilter), t.push(e.minFilter), t.push(e.anisotropy), t.push(e.internalFormat), t.push(e.format), t.push(e.type), t.push(e.generateMipmaps), t.push(e.premultiplyAlpha), t.push(e.flipY), t.push(e.unpackAlignment), t.push(e.colorSpace), t.join();
	}
	function P(t, i) {
		let a = r.get(t);
		if (t.isVideoTexture && Te(t), t.isRenderTargetTexture === !1 && t.isExternalTexture !== !0 && t.version > 0 && a.__version !== t.version) {
			let e = t.image;
			if (e === null) u("WebGLRenderer: Texture marked for update but no image data found.");
			else if (e.complete === !1) u("WebGLRenderer: Texture marked for update but image is incomplete");
			else {
				de(a, t, i);
				return;
			}
		} else t.isExternalTexture && (a.__webglTexture = t.sourceTexture ? t.sourceTexture : null);
		n.bindTexture(e.TEXTURE_2D, a.__webglTexture, e.TEXTURE0 + i);
	}
	function F(t, i) {
		let a = r.get(t);
		if (t.isRenderTargetTexture === !1 && t.version > 0 && a.__version !== t.version) {
			de(a, t, i);
			return;
		}
		t.isExternalTexture && (a.__webglTexture = t.sourceTexture ? t.sourceTexture : null), n.bindTexture(e.TEXTURE_2D_ARRAY, a.__webglTexture, e.TEXTURE0 + i);
	}
	function re(t, i) {
		let a = r.get(t);
		if (t.isRenderTargetTexture === !1 && t.version > 0 && a.__version !== t.version) {
			de(a, t, i);
			return;
		}
		n.bindTexture(e.TEXTURE_3D, a.__webglTexture, e.TEXTURE0 + i);
	}
	function ie(t, i) {
		let a = r.get(t);
		if (t.isCubeDepthTexture !== !0 && t.version > 0 && a.__version !== t.version) {
			fe(a, t, i);
			return;
		}
		n.bindTexture(e.TEXTURE_CUBE_MAP, a.__webglTexture, e.TEXTURE0 + i);
	}
	let I = {
		[lt]: e.REPEAT,
		[ut]: e.CLAMP_TO_EDGE,
		[dt]: e.MIRRORED_REPEAT
	}, ae = {
		[ft]: e.NEAREST,
		[pt]: e.NEAREST_MIPMAP_NEAREST,
		[mt]: e.NEAREST_MIPMAP_LINEAR,
		[ht]: e.LINEAR,
		[gt]: e.LINEAR_MIPMAP_NEAREST,
		[_t]: e.LINEAR_MIPMAP_LINEAR
	}, oe = {
		512: e.NEVER,
		519: e.ALWAYS,
		513: e.LESS,
		515: e.LEQUAL,
		514: e.EQUAL,
		518: e.GEQUAL,
		516: e.GREATER,
		517: e.NOTEQUAL
	};
	function se(n, a) {
		if (a.type === 1015 && t.has("OES_texture_float_linear") === !1 && (a.magFilter === 1006 || a.magFilter === 1007 || a.magFilter === 1005 || a.magFilter === 1008 || a.minFilter === 1006 || a.minFilter === 1007 || a.minFilter === 1005 || a.minFilter === 1008) && u("WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."), e.texParameteri(n, e.TEXTURE_WRAP_S, I[a.wrapS]), e.texParameteri(n, e.TEXTURE_WRAP_T, I[a.wrapT]), (n === e.TEXTURE_3D || n === e.TEXTURE_2D_ARRAY) && e.texParameteri(n, e.TEXTURE_WRAP_R, I[a.wrapR]), e.texParameteri(n, e.TEXTURE_MAG_FILTER, ae[a.magFilter]), e.texParameteri(n, e.TEXTURE_MIN_FILTER, ae[a.minFilter]), a.compareFunction && (e.texParameteri(n, e.TEXTURE_COMPARE_MODE, e.COMPARE_REF_TO_TEXTURE), e.texParameteri(n, e.TEXTURE_COMPARE_FUNC, oe[a.compareFunction])), t.has("EXT_texture_filter_anisotropic") === !0) {
			if (a.magFilter === 1003 || a.minFilter !== 1005 && a.minFilter !== 1008 || a.type === 1015 && t.has("OES_texture_float_linear") === !1) return;
			if (a.anisotropy > 1 || r.get(a).__currentAnisotropy) {
				let o = t.get("EXT_texture_filter_anisotropic");
				e.texParameterf(n, o.TEXTURE_MAX_ANISOTROPY_EXT, Math.min(a.anisotropy, i.getMaxAnisotropy())), r.get(a).__currentAnisotropy = a.anisotropy;
			}
		}
	}
	function ce(t, n) {
		let r = !1;
		t.__webglInit === void 0 && (t.__webglInit = !0, n.addEventListener("dispose", E));
		let i = n.source, a = g.get(i);
		a === void 0 && (a = {}, g.set(i, a));
		let o = ne(n);
		if (o !== t.__cacheKey) {
			a[o] === void 0 && (a[o] = {
				texture: e.createTexture(),
				usedTimes: 0
			}, s.memory.textures++, r = !0), a[o].usedTimes++;
			let i = a[t.__cacheKey];
			i !== void 0 && (a[t.__cacheKey].usedTimes--, i.usedTimes === 0 && k(n)), t.__cacheKey = o, t.__webglTexture = a[o].texture;
		}
		return r;
	}
	function le(e, t, n) {
		return Math.floor(Math.floor(e / n) / t);
	}
	function ue(t, r, i, a) {
		let o = t.updateRanges;
		if (o.length === 0) n.texSubImage2D(e.TEXTURE_2D, 0, 0, 0, r.width, r.height, i, a, r.data);
		else {
			o.sort((e, t) => e.start - t.start);
			let s = 0;
			for (let e = 1; e < o.length; e++) {
				let t = o[s], n = o[e], i = t.start + t.count, a = le(n.start, r.width, 4), c = le(t.start, r.width, 4);
				n.start <= i + 1 && a === c && le(n.start + n.count - 1, r.width, 4) === a ? t.count = Math.max(t.count, n.start + n.count - t.start) : (++s, o[s] = n);
			}
			o.length = s + 1;
			let c = n.getParameter(e.UNPACK_ROW_LENGTH), l = n.getParameter(e.UNPACK_SKIP_PIXELS), u = n.getParameter(e.UNPACK_SKIP_ROWS);
			n.pixelStorei(e.UNPACK_ROW_LENGTH, r.width);
			for (let t = 0, s = o.length; t < s; t++) {
				let s = o[t], c = Math.floor(s.start / 4), l = Math.ceil(s.count / 4), u = c % r.width, d = Math.floor(c / r.width), f = l;
				n.pixelStorei(e.UNPACK_SKIP_PIXELS, u), n.pixelStorei(e.UNPACK_SKIP_ROWS, d), n.texSubImage2D(e.TEXTURE_2D, 0, u, d, f, 1, i, a, r.data);
			}
			t.clearUpdateRanges(), n.pixelStorei(e.UNPACK_ROW_LENGTH, c), n.pixelStorei(e.UNPACK_SKIP_PIXELS, l), n.pixelStorei(e.UNPACK_SKIP_ROWS, u);
		}
	}
	function de(t, o, s) {
		let c = e.TEXTURE_2D;
		(o.isDataArrayTexture || o.isCompressedArrayTexture) && (c = e.TEXTURE_2D_ARRAY), o.isData3DTexture && (c = e.TEXTURE_3D);
		let l = ce(t, o), d = o.source;
		n.bindTexture(c, t.__webglTexture, e.TEXTURE0 + s);
		let f = r.get(d);
		if (d.version !== f.__version || l === !0) {
			if (n.activeTexture(e.TEXTURE0 + s), !(typeof ImageBitmap < "u" && o.image instanceof ImageBitmap)) {
				let t = K.getPrimaries(K.workingColorSpace), r = o.colorSpace === "" ? null : K.getPrimaries(o.colorSpace), i = o.colorSpace === "" || t === r ? e.NONE : e.BROWSER_DEFAULT_WEBGL;
				n.pixelStorei(e.UNPACK_FLIP_Y_WEBGL, o.flipY), n.pixelStorei(e.UNPACK_PREMULTIPLY_ALPHA_WEBGL, o.premultiplyAlpha), n.pixelStorei(e.UNPACK_COLORSPACE_CONVERSION_WEBGL, i);
			}
			n.pixelStorei(e.UNPACK_ALIGNMENT, o.unpackAlignment);
			let t = y(o.image, !1, i.maxTextureSize);
			t = L(o, t);
			let r = a.convert(o.format, o.colorSpace), p = a.convert(o.type), h = C(o.internalFormat, r, p, o.normalized, o.colorSpace, o.isVideoTexture);
			se(c, o);
			let g, _ = o.mipmaps, v = o.isVideoTexture !== !0, S = f.__version === void 0 || l === !0, E = d.dataReady, D = T(o, t);
			if (o.isDepthTexture) h = w(o.format === Ft, o.type), S && (v ? n.texStorage2D(e.TEXTURE_2D, 1, h, t.width, t.height) : n.texImage2D(e.TEXTURE_2D, 0, h, t.width, t.height, 0, r, p, null));
			else if (o.isDataTexture) {
				if (_.length > 0) {
					v && S && n.texStorage2D(e.TEXTURE_2D, D, h, _[0].width, _[0].height);
					for (let t = 0, i = _.length; t < i; t++) g = _[t], v ? E && n.texSubImage2D(e.TEXTURE_2D, t, 0, 0, g.width, g.height, r, p, g.data) : n.texImage2D(e.TEXTURE_2D, t, h, g.width, g.height, 0, r, p, g.data);
					o.generateMipmaps = !1;
				} else v ? (S && n.texStorage2D(e.TEXTURE_2D, D, h, t.width, t.height), E && ue(o, t, r, p)) : n.texImage2D(e.TEXTURE_2D, 0, h, t.width, t.height, 0, r, p, t.data);
			} else if (o.isCompressedTexture) {
				if (o.isCompressedArrayTexture) {
					v && S && n.texStorage3D(e.TEXTURE_2D_ARRAY, D, h, _[0].width, _[0].height, t.depth);
					for (let i = 0, a = _.length; i < a; i++) if (g = _[i], o.format !== 1023) {
						if (r !== null) {
							if (v) {
								if (E) {
									if (o.layerUpdates.size > 0) {
										let t = Ze(g.width, g.height, o.format, o.type);
										for (let a of o.layerUpdates) {
											let o = g.data.subarray(a * t / g.data.BYTES_PER_ELEMENT, (a + 1) * t / g.data.BYTES_PER_ELEMENT);
											n.compressedTexSubImage3D(e.TEXTURE_2D_ARRAY, i, 0, 0, a, g.width, g.height, 1, r, o);
										}
										o.clearLayerUpdates();
									} else n.compressedTexSubImage3D(e.TEXTURE_2D_ARRAY, i, 0, 0, 0, g.width, g.height, t.depth, r, g.data);
								}
							} else n.compressedTexImage3D(e.TEXTURE_2D_ARRAY, i, h, g.width, g.height, t.depth, 0, g.data, 0, 0);
						} else u("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");
					} else v ? E && n.texSubImage3D(e.TEXTURE_2D_ARRAY, i, 0, 0, 0, g.width, g.height, t.depth, r, p, g.data) : n.texImage3D(e.TEXTURE_2D_ARRAY, i, h, g.width, g.height, t.depth, 0, r, p, g.data);
				} else {
					v && S && n.texStorage2D(e.TEXTURE_2D, D, h, _[0].width, _[0].height);
					for (let t = 0, i = _.length; t < i; t++) g = _[t], o.format === 1023 ? v ? E && n.texSubImage2D(e.TEXTURE_2D, t, 0, 0, g.width, g.height, r, p, g.data) : n.texImage2D(e.TEXTURE_2D, t, h, g.width, g.height, 0, r, p, g.data) : r === null ? u("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()") : v ? E && n.compressedTexSubImage2D(e.TEXTURE_2D, t, 0, 0, g.width, g.height, r, g.data) : n.compressedTexImage2D(e.TEXTURE_2D, t, h, g.width, g.height, 0, g.data);
				}
			} else if (o.isDataArrayTexture) {
				if (v) {
					if (S && n.texStorage3D(e.TEXTURE_2D_ARRAY, D, h, t.width, t.height, t.depth), E) {
						if (o.layerUpdates.size > 0) {
							let i = Ze(t.width, t.height, o.format, o.type);
							for (let a of o.layerUpdates) {
								let o = t.data.subarray(a * i / t.data.BYTES_PER_ELEMENT, (a + 1) * i / t.data.BYTES_PER_ELEMENT);
								n.texSubImage3D(e.TEXTURE_2D_ARRAY, 0, 0, 0, a, t.width, t.height, 1, r, p, o);
							}
							o.clearLayerUpdates();
						} else n.texSubImage3D(e.TEXTURE_2D_ARRAY, 0, 0, 0, 0, t.width, t.height, t.depth, r, p, t.data);
					}
				} else n.texImage3D(e.TEXTURE_2D_ARRAY, 0, h, t.width, t.height, t.depth, 0, r, p, t.data);
			} else if (o.isData3DTexture) v ? (S && n.texStorage3D(e.TEXTURE_3D, D, h, t.width, t.height, t.depth), E && n.texSubImage3D(e.TEXTURE_3D, 0, 0, 0, 0, t.width, t.height, t.depth, r, p, t.data)) : n.texImage3D(e.TEXTURE_3D, 0, h, t.width, t.height, t.depth, 0, r, p, t.data);
			else if (o.isFramebufferTexture) {
				if (S) {
					if (v) n.texStorage2D(e.TEXTURE_2D, D, h, t.width, t.height);
					else {
						let i = t.width, a = t.height;
						for (let t = 0; t < D; t++) n.texImage2D(e.TEXTURE_2D, t, h, i, a, 0, r, p, null), i >>= 1, a >>= 1;
					}
				}
			} else if (o.isHTMLTexture) {
				if ("texElementImage2D" in e) {
					let n = e.canvas;
					if (n.hasAttribute("layoutsubtree") || n.setAttribute("layoutsubtree", "true"), t.parentNode !== n) {
						n.appendChild(t), m.add(o), n.onpaint = (e) => {
							let t = e.changedElements;
							for (let e of m) t.includes(e.image) && (e.needsUpdate = !0);
						}, n.requestPaint();
						return;
					}
					if (e.texElementImage2D.length === 3) e.texElementImage2D(e.TEXTURE_2D, e.RGBA8, t);
					else {
						let n = e.RGBA, r = e.RGBA, i = e.UNSIGNED_BYTE;
						e.texElementImage2D(e.TEXTURE_2D, 0, n, r, i, t);
					}
					e.texParameteri(e.TEXTURE_2D, e.TEXTURE_MIN_FILTER, e.LINEAR), e.texParameteri(e.TEXTURE_2D, e.TEXTURE_WRAP_S, e.CLAMP_TO_EDGE), e.texParameteri(e.TEXTURE_2D, e.TEXTURE_WRAP_T, e.CLAMP_TO_EDGE);
				}
			} else if (_.length > 0) {
				if (v && S) {
					let t = Ee(_[0]);
					n.texStorage2D(e.TEXTURE_2D, D, h, t.width, t.height);
				}
				for (let t = 0, i = _.length; t < i; t++) g = _[t], v ? E && n.texSubImage2D(e.TEXTURE_2D, t, 0, 0, r, p, g) : n.texImage2D(e.TEXTURE_2D, t, h, r, p, g);
				o.generateMipmaps = !1;
			} else if (v) {
				if (S) {
					let r = Ee(t);
					n.texStorage2D(e.TEXTURE_2D, D, h, r.width, r.height);
				}
				E && n.texSubImage2D(e.TEXTURE_2D, 0, 0, 0, r, p, t);
			} else n.texImage2D(e.TEXTURE_2D, 0, h, r, p, t);
			b(o) && x(c), f.__version = d.version, o.onUpdate && o.onUpdate(o);
		}
		t.__version = o.version;
	}
	function fe(t, o, s) {
		if (o.image.length !== 6) return;
		let c = ce(t, o), l = o.source;
		n.bindTexture(e.TEXTURE_CUBE_MAP, t.__webglTexture, e.TEXTURE0 + s);
		let d = r.get(l);
		if (l.version !== d.__version || c === !0) {
			n.activeTexture(e.TEXTURE0 + s);
			let t = K.getPrimaries(K.workingColorSpace), r = o.colorSpace === "" ? null : K.getPrimaries(o.colorSpace), f = o.colorSpace === "" || t === r ? e.NONE : e.BROWSER_DEFAULT_WEBGL;
			n.pixelStorei(e.UNPACK_FLIP_Y_WEBGL, o.flipY), n.pixelStorei(e.UNPACK_PREMULTIPLY_ALPHA_WEBGL, o.premultiplyAlpha), n.pixelStorei(e.UNPACK_ALIGNMENT, o.unpackAlignment), n.pixelStorei(e.UNPACK_COLORSPACE_CONVERSION_WEBGL, f);
			let p = o.isCompressedTexture || o.image[0].isCompressedTexture, m = o.image[0] && o.image[0].isDataTexture, h = [];
			for (let e = 0; e < 6; e++) !p && !m ? h[e] = y(o.image[e], !0, i.maxCubemapSize) : h[e] = m ? o.image[e].image : o.image[e], h[e] = L(o, h[e]);
			let g = h[0], _ = a.convert(o.format, o.colorSpace), v = a.convert(o.type), S = C(o.internalFormat, _, v, o.normalized, o.colorSpace), w = o.isVideoTexture !== !0, E = d.__version === void 0 || c === !0, D = l.dataReady, O = T(o, g);
			se(e.TEXTURE_CUBE_MAP, o);
			let k;
			if (p) {
				w && E && n.texStorage2D(e.TEXTURE_CUBE_MAP, O, S, g.width, g.height);
				for (let t = 0; t < 6; t++) {
					k = h[t].mipmaps;
					for (let r = 0; r < k.length; r++) {
						let i = k[r];
						o.format === 1023 ? w ? D && n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X + t, r, 0, 0, i.width, i.height, _, v, i.data) : n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X + t, r, S, i.width, i.height, 0, _, v, i.data) : _ === null ? u("WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()") : w ? D && n.compressedTexSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X + t, r, 0, 0, i.width, i.height, _, i.data) : n.compressedTexImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X + t, r, S, i.width, i.height, 0, i.data);
					}
				}
			} else {
				if (k = o.mipmaps, w && E) {
					k.length > 0 && O++;
					let t = Ee(h[0]);
					n.texStorage2D(e.TEXTURE_CUBE_MAP, O, S, t.width, t.height);
				}
				for (let t = 0; t < 6; t++) if (m) {
					w ? D && n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X + t, 0, 0, 0, h[t].width, h[t].height, _, v, h[t].data) : n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X + t, 0, S, h[t].width, h[t].height, 0, _, v, h[t].data);
					for (let r = 0; r < k.length; r++) {
						let i = k[r].image[t].image;
						w ? D && n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X + t, r + 1, 0, 0, i.width, i.height, _, v, i.data) : n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X + t, r + 1, S, i.width, i.height, 0, _, v, i.data);
					}
				} else {
					w ? D && n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X + t, 0, 0, 0, _, v, h[t]) : n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X + t, 0, S, _, v, h[t]);
					for (let r = 0; r < k.length; r++) {
						let i = k[r];
						w ? D && n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X + t, r + 1, 0, 0, _, v, i.image[t]) : n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X + t, r + 1, S, _, v, i.image[t]);
					}
				}
			}
			b(o) && x(e.TEXTURE_CUBE_MAP), d.__version = l.version, o.onUpdate && o.onUpdate(o);
		}
		t.__version = o.version;
	}
	function pe(t, i, o, s, l, u) {
		let d = a.convert(o.format, o.colorSpace), f = a.convert(o.type), p = C(o.internalFormat, d, f, o.normalized, o.colorSpace), m = r.get(i), h = r.get(o);
		if (h.__renderTarget = i, !m.__hasExternalTextures) {
			let t = Math.max(1, i.width >> u), r = Math.max(1, i.height >> u);
			l === e.TEXTURE_3D || l === e.TEXTURE_2D_ARRAY ? n.texImage3D(l, u, p, t, r, i.depth, 0, d, f, null) : n.texImage2D(l, u, p, t, r, 0, d, f, null);
		}
		n.bindFramebuffer(e.FRAMEBUFFER, t), we(i) ? c.framebufferTexture2DMultisampleEXT(e.FRAMEBUFFER, s, l, h.__webglTexture, 0, Ce(i)) : (l === e.TEXTURE_2D || l >= e.TEXTURE_CUBE_MAP_POSITIVE_X && l <= e.TEXTURE_CUBE_MAP_NEGATIVE_Z) && e.framebufferTexture2D(e.FRAMEBUFFER, s, l, h.__webglTexture, u), n.bindFramebuffer(e.FRAMEBUFFER, null);
	}
	function me(t, n, r) {
		if (e.bindRenderbuffer(e.RENDERBUFFER, t), n.depthBuffer) {
			let i = n.depthTexture, a = i && i.isDepthTexture ? i.type : null, o = w(n.stencilBuffer, a), s = n.stencilBuffer ? e.DEPTH_STENCIL_ATTACHMENT : e.DEPTH_ATTACHMENT;
			we(n) ? c.renderbufferStorageMultisampleEXT(e.RENDERBUFFER, Ce(n), o, n.width, n.height) : r ? e.renderbufferStorageMultisample(e.RENDERBUFFER, Ce(n), o, n.width, n.height) : e.renderbufferStorage(e.RENDERBUFFER, o, n.width, n.height), e.framebufferRenderbuffer(e.FRAMEBUFFER, s, e.RENDERBUFFER, t);
		} else {
			let t = n.textures;
			for (let i = 0; i < t.length; i++) {
				let o = t[i], s = a.convert(o.format, o.colorSpace), l = a.convert(o.type), u = C(o.internalFormat, s, l, o.normalized, o.colorSpace);
				we(n) ? c.renderbufferStorageMultisampleEXT(e.RENDERBUFFER, Ce(n), u, n.width, n.height) : r ? e.renderbufferStorageMultisample(e.RENDERBUFFER, Ce(n), u, n.width, n.height) : e.renderbufferStorage(e.RENDERBUFFER, u, n.width, n.height);
			}
		}
		e.bindRenderbuffer(e.RENDERBUFFER, null);
	}
	function he(t, i, o) {
		let s = i.isWebGLCubeRenderTarget === !0;
		if (n.bindFramebuffer(e.FRAMEBUFFER, t), !(i.depthTexture && i.depthTexture.isDepthTexture)) throw Error("THREE.WebGLTextures: renderTarget.depthTexture must be an instance of THREE.DepthTexture.");
		let l = r.get(i.depthTexture);
		if (l.__renderTarget = i, (!l.__webglTexture || i.depthTexture.image.width !== i.width || i.depthTexture.image.height !== i.height) && (i.depthTexture.image.width = i.width, i.depthTexture.image.height = i.height, i.depthTexture.needsUpdate = !0), s) {
			if (l.__webglInit === void 0 && (l.__webglInit = !0, i.depthTexture.addEventListener("dispose", E)), l.__webglTexture === void 0) {
				l.__webglTexture = e.createTexture(), n.bindTexture(e.TEXTURE_CUBE_MAP, l.__webglTexture), se(e.TEXTURE_CUBE_MAP, i.depthTexture);
				let t = a.convert(i.depthTexture.format), r = a.convert(i.depthTexture.type), o;
				i.depthTexture.format === 1026 ? o = e.DEPTH_COMPONENT24 : i.depthTexture.format === 1027 && (o = e.DEPTH24_STENCIL8);
				for (let n = 0; n < 6; n++) e.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X + n, 0, o, i.width, i.height, 0, t, r, null);
			}
		} else P(i.depthTexture, 0);
		let u = l.__webglTexture, d = Ce(i), f = s ? e.TEXTURE_CUBE_MAP_POSITIVE_X + o : e.TEXTURE_2D, p = i.depthTexture.format === 1027 ? e.DEPTH_STENCIL_ATTACHMENT : e.DEPTH_ATTACHMENT;
		if (i.depthTexture.format === 1026) we(i) ? c.framebufferTexture2DMultisampleEXT(e.FRAMEBUFFER, p, f, u, 0, d) : e.framebufferTexture2D(e.FRAMEBUFFER, p, f, u, 0);
		else if (i.depthTexture.format === 1027) we(i) ? c.framebufferTexture2DMultisampleEXT(e.FRAMEBUFFER, p, f, u, 0, d) : e.framebufferTexture2D(e.FRAMEBUFFER, p, f, u, 0);
		else throw Error("THREE.WebGLTextures: Unknown depthTexture format.");
	}
	function ge(t) {
		let i = r.get(t), a = t.isWebGLCubeRenderTarget === !0;
		if (i.__boundDepthTexture !== t.depthTexture) {
			let e = t.depthTexture;
			if (i.__depthDisposeCallback && i.__depthDisposeCallback(), e) {
				let t = () => {
					delete i.__boundDepthTexture, delete i.__depthDisposeCallback, e.removeEventListener("dispose", t);
				};
				e.addEventListener("dispose", t), i.__depthDisposeCallback = t;
			}
			i.__boundDepthTexture = e;
		}
		if (t.depthTexture && !i.__autoAllocateDepthBuffer) {
			if (a) for (let e = 0; e < 6; e++) he(i.__webglFramebuffer[e], t, e);
			else {
				let e = t.texture.mipmaps;
				e && e.length > 0 ? he(i.__webglFramebuffer[0], t, 0) : he(i.__webglFramebuffer, t, 0);
			}
		} else if (a) {
			i.__webglDepthbuffer = [];
			for (let r = 0; r < 6; r++) if (n.bindFramebuffer(e.FRAMEBUFFER, i.__webglFramebuffer[r]), i.__webglDepthbuffer[r] === void 0) i.__webglDepthbuffer[r] = e.createRenderbuffer(), me(i.__webglDepthbuffer[r], t, !1);
			else {
				let n = t.stencilBuffer ? e.DEPTH_STENCIL_ATTACHMENT : e.DEPTH_ATTACHMENT, a = i.__webglDepthbuffer[r];
				e.bindRenderbuffer(e.RENDERBUFFER, a), e.framebufferRenderbuffer(e.FRAMEBUFFER, n, e.RENDERBUFFER, a);
			}
		} else {
			let r = t.texture.mipmaps;
			if (r && r.length > 0 ? n.bindFramebuffer(e.FRAMEBUFFER, i.__webglFramebuffer[0]) : n.bindFramebuffer(e.FRAMEBUFFER, i.__webglFramebuffer), i.__webglDepthbuffer === void 0) i.__webglDepthbuffer = e.createRenderbuffer(), me(i.__webglDepthbuffer, t, !1);
			else {
				let n = t.stencilBuffer ? e.DEPTH_STENCIL_ATTACHMENT : e.DEPTH_ATTACHMENT, r = i.__webglDepthbuffer;
				e.bindRenderbuffer(e.RENDERBUFFER, r), e.framebufferRenderbuffer(e.FRAMEBUFFER, n, e.RENDERBUFFER, r);
			}
		}
		n.bindFramebuffer(e.FRAMEBUFFER, null);
	}
	function _e(t, n, i) {
		let a = r.get(t);
		n !== void 0 && pe(a.__webglFramebuffer, t, t.texture, e.COLOR_ATTACHMENT0, e.TEXTURE_2D, 0), i !== void 0 && ge(t);
	}
	function ve(t) {
		let i = t.texture, o = r.get(t), c = r.get(i);
		t.addEventListener("dispose", D);
		let l = t.textures, u = t.isWebGLCubeRenderTarget === !0, d = l.length > 1;
		if (d || (c.__webglTexture === void 0 && (c.__webglTexture = e.createTexture()), c.__version = i.version, s.memory.textures++), u) {
			o.__webglFramebuffer = [];
			for (let t = 0; t < 6; t++) if (i.mipmaps && i.mipmaps.length > 0) {
				o.__webglFramebuffer[t] = [];
				for (let n = 0; n < i.mipmaps.length; n++) o.__webglFramebuffer[t][n] = e.createFramebuffer();
			} else o.__webglFramebuffer[t] = e.createFramebuffer();
		} else {
			if (i.mipmaps && i.mipmaps.length > 0) {
				o.__webglFramebuffer = [];
				for (let t = 0; t < i.mipmaps.length; t++) o.__webglFramebuffer[t] = e.createFramebuffer();
			} else o.__webglFramebuffer = e.createFramebuffer();
			if (d) for (let t = 0, n = l.length; t < n; t++) {
				let n = r.get(l[t]);
				n.__webglTexture === void 0 && (n.__webglTexture = e.createTexture(), s.memory.textures++);
			}
			if (t.samples > 0 && we(t) === !1) {
				o.__webglMultisampledFramebuffer = e.createFramebuffer(), o.__webglColorRenderbuffer = [], n.bindFramebuffer(e.FRAMEBUFFER, o.__webglMultisampledFramebuffer);
				for (let n = 0; n < l.length; n++) {
					let r = l[n];
					o.__webglColorRenderbuffer[n] = e.createRenderbuffer(), e.bindRenderbuffer(e.RENDERBUFFER, o.__webglColorRenderbuffer[n]);
					let i = a.convert(r.format, r.colorSpace), s = a.convert(r.type), c = C(r.internalFormat, i, s, r.normalized, r.colorSpace, t.isXRRenderTarget === !0), u = Ce(t);
					e.renderbufferStorageMultisample(e.RENDERBUFFER, u, c, t.width, t.height), e.framebufferRenderbuffer(e.FRAMEBUFFER, e.COLOR_ATTACHMENT0 + n, e.RENDERBUFFER, o.__webglColorRenderbuffer[n]);
				}
				e.bindRenderbuffer(e.RENDERBUFFER, null), t.depthBuffer && (o.__webglDepthRenderbuffer = e.createRenderbuffer(), me(o.__webglDepthRenderbuffer, t, !0)), n.bindFramebuffer(e.FRAMEBUFFER, null);
			}
		}
		if (u) {
			n.bindTexture(e.TEXTURE_CUBE_MAP, c.__webglTexture), se(e.TEXTURE_CUBE_MAP, i);
			for (let n = 0; n < 6; n++) if (i.mipmaps && i.mipmaps.length > 0) for (let r = 0; r < i.mipmaps.length; r++) pe(o.__webglFramebuffer[n][r], t, i, e.COLOR_ATTACHMENT0, e.TEXTURE_CUBE_MAP_POSITIVE_X + n, r);
			else pe(o.__webglFramebuffer[n], t, i, e.COLOR_ATTACHMENT0, e.TEXTURE_CUBE_MAP_POSITIVE_X + n, 0);
			b(i) && x(e.TEXTURE_CUBE_MAP), n.unbindTexture();
		} else if (d) {
			for (let i = 0, a = l.length; i < a; i++) {
				let a = l[i], s = r.get(a), c = e.TEXTURE_2D;
				(t.isWebGL3DRenderTarget || t.isWebGLArrayRenderTarget) && (c = t.isWebGL3DRenderTarget ? e.TEXTURE_3D : e.TEXTURE_2D_ARRAY), n.bindTexture(c, s.__webglTexture), se(c, a), pe(o.__webglFramebuffer, t, a, e.COLOR_ATTACHMENT0 + i, c, 0), b(a) && x(c);
			}
			n.unbindTexture();
		} else {
			let r = e.TEXTURE_2D;
			if ((t.isWebGL3DRenderTarget || t.isWebGLArrayRenderTarget) && (r = t.isWebGL3DRenderTarget ? e.TEXTURE_3D : e.TEXTURE_2D_ARRAY), n.bindTexture(r, c.__webglTexture), se(r, i), i.mipmaps && i.mipmaps.length > 0) for (let n = 0; n < i.mipmaps.length; n++) pe(o.__webglFramebuffer[n], t, i, e.COLOR_ATTACHMENT0, r, n);
			else pe(o.__webglFramebuffer, t, i, e.COLOR_ATTACHMENT0, r, 0);
			b(i) && x(r), n.unbindTexture();
		}
		t.depthBuffer && ge(t);
	}
	function ye(e) {
		let t = e.textures;
		for (let i = 0, a = t.length; i < a; i++) {
			let a = t[i];
			if (b(a)) {
				let t = S(e), i = r.get(a).__webglTexture;
				n.bindTexture(t, i), x(t), n.unbindTexture();
			}
		}
	}
	let be = [], xe = [];
	function Se(t) {
		if (t.samples > 0) {
			if (we(t) === !1) {
				let i = t.textures, a = t.width, o = t.height, s = e.COLOR_BUFFER_BIT, c = t.stencilBuffer ? e.DEPTH_STENCIL_ATTACHMENT : e.DEPTH_ATTACHMENT, u = r.get(t), d = i.length > 1;
				if (d) for (let t = 0; t < i.length; t++) n.bindFramebuffer(e.FRAMEBUFFER, u.__webglMultisampledFramebuffer), e.framebufferRenderbuffer(e.FRAMEBUFFER, e.COLOR_ATTACHMENT0 + t, e.RENDERBUFFER, null), n.bindFramebuffer(e.FRAMEBUFFER, u.__webglFramebuffer), e.framebufferTexture2D(e.DRAW_FRAMEBUFFER, e.COLOR_ATTACHMENT0 + t, e.TEXTURE_2D, null, 0);
				n.bindFramebuffer(e.READ_FRAMEBUFFER, u.__webglMultisampledFramebuffer);
				let f = t.texture.mipmaps;
				f && f.length > 0 ? n.bindFramebuffer(e.DRAW_FRAMEBUFFER, u.__webglFramebuffer[0]) : n.bindFramebuffer(e.DRAW_FRAMEBUFFER, u.__webglFramebuffer);
				for (let n = 0; n < i.length; n++) {
					if (t.resolveDepthBuffer && (t.depthBuffer && (s |= e.DEPTH_BUFFER_BIT), t.stencilBuffer && t.resolveStencilBuffer && (s |= e.STENCIL_BUFFER_BIT)), d) {
						e.framebufferRenderbuffer(e.READ_FRAMEBUFFER, e.COLOR_ATTACHMENT0, e.RENDERBUFFER, u.__webglColorRenderbuffer[n]);
						let t = r.get(i[n]).__webglTexture;
						e.framebufferTexture2D(e.DRAW_FRAMEBUFFER, e.COLOR_ATTACHMENT0, e.TEXTURE_2D, t, 0);
					}
					e.blitFramebuffer(0, 0, a, o, 0, 0, a, o, s, e.NEAREST), l === !0 && (be.length = 0, xe.length = 0, be.push(e.COLOR_ATTACHMENT0 + n), t.depthBuffer && t.resolveDepthBuffer === !1 && (be.push(c), xe.push(c), e.invalidateFramebuffer(e.DRAW_FRAMEBUFFER, xe)), e.invalidateFramebuffer(e.READ_FRAMEBUFFER, be));
				}
				if (n.bindFramebuffer(e.READ_FRAMEBUFFER, null), n.bindFramebuffer(e.DRAW_FRAMEBUFFER, null), d) for (let t = 0; t < i.length; t++) {
					n.bindFramebuffer(e.FRAMEBUFFER, u.__webglMultisampledFramebuffer), e.framebufferRenderbuffer(e.FRAMEBUFFER, e.COLOR_ATTACHMENT0 + t, e.RENDERBUFFER, u.__webglColorRenderbuffer[t]);
					let a = r.get(i[t]).__webglTexture;
					n.bindFramebuffer(e.FRAMEBUFFER, u.__webglFramebuffer), e.framebufferTexture2D(e.DRAW_FRAMEBUFFER, e.COLOR_ATTACHMENT0 + t, e.TEXTURE_2D, a, 0);
				}
				n.bindFramebuffer(e.DRAW_FRAMEBUFFER, u.__webglMultisampledFramebuffer);
			} else if (t.depthBuffer && t.resolveDepthBuffer === !1 && l) {
				let n = t.stencilBuffer ? e.DEPTH_STENCIL_ATTACHMENT : e.DEPTH_ATTACHMENT;
				e.invalidateFramebuffer(e.DRAW_FRAMEBUFFER, [n]);
			}
		}
	}
	function Ce(e) {
		return Math.min(i.maxSamples, e.samples);
	}
	function we(e) {
		let n = r.get(e);
		return e.samples > 0 && t.has("WEBGL_multisampled_render_to_texture") === !0 && n.__useRenderToTexture !== !1;
	}
	function Te(e) {
		let t = s.render.frame;
		p.get(e) !== t && (p.set(e, t), e.update());
	}
	function L(e, t) {
		let n = e.colorSpace, r = e.format, i = e.type;
		return e.isCompressedTexture === !0 || e.isVideoTexture === !0 || n !== "srgb-linear" && n !== "" && (K.getTransfer(n) === "srgb" ? (r !== 1023 || i !== 1009) && u("WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType.") : d("WebGLTextures: Unsupported texture color space:", n)), t;
	}
	function Ee(e) {
		return typeof HTMLImageElement < "u" && e instanceof HTMLImageElement ? (f.width = e.naturalWidth || e.width, f.height = e.naturalHeight || e.height) : typeof VideoFrame < "u" && e instanceof VideoFrame ? (f.width = e.displayWidth, f.height = e.displayHeight) : (f.width = e.width, f.height = e.height), f;
	}
	this.allocateTextureUnit = N, this.resetTextureUnits = M, this.getTextureUnits = ee, this.setTextureUnits = te, this.setTexture2D = P, this.setTexture2DArray = F, this.setTexture3D = re, this.setTextureCube = ie, this.rebindTextures = _e, this.setupRenderTarget = ve, this.updateRenderTargetMipmap = ye, this.updateMultisampleRenderTarget = Se, this.setupDepthRenderbuffer = ge, this.setupFrameBufferTexture = pe, this.useMultisampledRTT = we, this.isReversedDepthBuffer = function() {
		return n.buffers.depth.getReversed();
	};
}
function tu(e, t) {
	function n(n, r = "") {
		let i, a = K.getTransfer(r);
		if (n === 1009) return e.UNSIGNED_BYTE;
		if (n === 1017) return e.UNSIGNED_SHORT_4_4_4_4;
		if (n === 1018) return e.UNSIGNED_SHORT_5_5_5_1;
		if (n === 35902) return e.UNSIGNED_INT_5_9_9_9_REV;
		if (n === 35899) return e.UNSIGNED_INT_10F_11F_11F_REV;
		if (n === 1010) return e.BYTE;
		if (n === 1011) return e.SHORT;
		if (n === 1012) return e.UNSIGNED_SHORT;
		if (n === 1013) return e.INT;
		if (n === 1014) return e.UNSIGNED_INT;
		if (n === 1015) return e.FLOAT;
		if (n === 1016) return e.HALF_FLOAT;
		if (n === 1021) return e.ALPHA;
		if (n === 1022) return e.RGB;
		if (n === 1023) return e.RGBA;
		if (n === 1026) return e.DEPTH_COMPONENT;
		if (n === 1027) return e.DEPTH_STENCIL;
		if (n === 1028) return e.RED;
		if (n === 1029) return e.RED_INTEGER;
		if (n === 1030) return e.RG;
		if (n === 1031) return e.RG_INTEGER;
		if (n === 1033) return e.RGBA_INTEGER;
		if (n === 33776 || n === 33777 || n === 33778 || n === 33779) {
			if (a === "srgb") {
				if (i = t.get("WEBGL_compressed_texture_s3tc_srgb"), i !== null) {
					if (n === 33776) return i.COMPRESSED_SRGB_S3TC_DXT1_EXT;
					if (n === 33777) return i.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;
					if (n === 33778) return i.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;
					if (n === 33779) return i.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT;
				} else return null;
			} else if (i = t.get("WEBGL_compressed_texture_s3tc"), i !== null) {
				if (n === 33776) return i.COMPRESSED_RGB_S3TC_DXT1_EXT;
				if (n === 33777) return i.COMPRESSED_RGBA_S3TC_DXT1_EXT;
				if (n === 33778) return i.COMPRESSED_RGBA_S3TC_DXT3_EXT;
				if (n === 33779) return i.COMPRESSED_RGBA_S3TC_DXT5_EXT;
			} else return null;
		}
		if (n === 35840 || n === 35841 || n === 35842 || n === 35843) {
			if (i = t.get("WEBGL_compressed_texture_pvrtc"), i !== null) {
				if (n === 35840) return i.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;
				if (n === 35841) return i.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;
				if (n === 35842) return i.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;
				if (n === 35843) return i.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG;
			} else return null;
		}
		if (n === 36196 || n === 37492 || n === 37496 || n === 37488 || n === 37489 || n === 37490 || n === 37491) {
			if (i = t.get("WEBGL_compressed_texture_etc"), i !== null) {
				if (n === 36196 || n === 37492) return a === "srgb" ? i.COMPRESSED_SRGB8_ETC2 : i.COMPRESSED_RGB8_ETC2;
				if (n === 37496) return a === "srgb" ? i.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC : i.COMPRESSED_RGBA8_ETC2_EAC;
				if (n === 37488) return i.COMPRESSED_R11_EAC;
				if (n === 37489) return i.COMPRESSED_SIGNED_R11_EAC;
				if (n === 37490) return i.COMPRESSED_RG11_EAC;
				if (n === 37491) return i.COMPRESSED_SIGNED_RG11_EAC;
			} else return null;
		}
		if (n === 37808 || n === 37809 || n === 37810 || n === 37811 || n === 37812 || n === 37813 || n === 37814 || n === 37815 || n === 37816 || n === 37817 || n === 37818 || n === 37819 || n === 37820 || n === 37821) {
			if (i = t.get("WEBGL_compressed_texture_astc"), i !== null) {
				if (n === 37808) return a === "srgb" ? i.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR : i.COMPRESSED_RGBA_ASTC_4x4_KHR;
				if (n === 37809) return a === "srgb" ? i.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR : i.COMPRESSED_RGBA_ASTC_5x4_KHR;
				if (n === 37810) return a === "srgb" ? i.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR : i.COMPRESSED_RGBA_ASTC_5x5_KHR;
				if (n === 37811) return a === "srgb" ? i.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR : i.COMPRESSED_RGBA_ASTC_6x5_KHR;
				if (n === 37812) return a === "srgb" ? i.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR : i.COMPRESSED_RGBA_ASTC_6x6_KHR;
				if (n === 37813) return a === "srgb" ? i.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR : i.COMPRESSED_RGBA_ASTC_8x5_KHR;
				if (n === 37814) return a === "srgb" ? i.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR : i.COMPRESSED_RGBA_ASTC_8x6_KHR;
				if (n === 37815) return a === "srgb" ? i.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR : i.COMPRESSED_RGBA_ASTC_8x8_KHR;
				if (n === 37816) return a === "srgb" ? i.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR : i.COMPRESSED_RGBA_ASTC_10x5_KHR;
				if (n === 37817) return a === "srgb" ? i.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR : i.COMPRESSED_RGBA_ASTC_10x6_KHR;
				if (n === 37818) return a === "srgb" ? i.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR : i.COMPRESSED_RGBA_ASTC_10x8_KHR;
				if (n === 37819) return a === "srgb" ? i.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR : i.COMPRESSED_RGBA_ASTC_10x10_KHR;
				if (n === 37820) return a === "srgb" ? i.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR : i.COMPRESSED_RGBA_ASTC_12x10_KHR;
				if (n === 37821) return a === "srgb" ? i.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR : i.COMPRESSED_RGBA_ASTC_12x12_KHR;
			} else return null;
		}
		if (n === 36492 || n === 36494 || n === 36495) {
			if (i = t.get("EXT_texture_compression_bptc"), i !== null) {
				if (n === 36492) return a === "srgb" ? i.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT : i.COMPRESSED_RGBA_BPTC_UNORM_EXT;
				if (n === 36494) return i.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;
				if (n === 36495) return i.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT;
			} else return null;
		}
		if (n === 36283 || n === 36284 || n === 36285 || n === 36286) {
			if (i = t.get("EXT_texture_compression_rgtc"), i !== null) {
				if (n === 36283) return i.COMPRESSED_RED_RGTC1_EXT;
				if (n === 36284) return i.COMPRESSED_SIGNED_RED_RGTC1_EXT;
				if (n === 36285) return i.COMPRESSED_RED_GREEN_RGTC2_EXT;
				if (n === 36286) return i.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT;
			} else return null;
		}
		return n === 1020 ? e.UNSIGNED_INT_24_8 : e[n] === void 0 ? null : e[n];
	}
	return { convert: n };
}
function nu(e, t) {
	function n(e, t) {
		e.matrixAutoUpdate === !0 && e.updateMatrix(), t.value.copy(e.matrix);
	}
	function r(t, n) {
		n.color.getRGB(t.fogColor.value, Ue(e)), n.isFog ? (t.fogNear.value = n.near, t.fogFar.value = n.far) : n.isFogExp2 && (t.fogDensity.value = n.density);
	}
	function i(e, t, n, r, i) {
		t.isNodeMaterial ? t.uniformsNeedUpdate = !1 : t.isMeshBasicMaterial ? a(e, t) : t.isMeshLambertMaterial ? (a(e, t), t.envMap && (e.envMapIntensity.value = t.envMapIntensity)) : t.isMeshToonMaterial ? (a(e, t), d(e, t)) : t.isMeshPhongMaterial ? (a(e, t), u(e, t), t.envMap && (e.envMapIntensity.value = t.envMapIntensity)) : t.isMeshStandardMaterial ? (a(e, t), f(e, t), t.isMeshPhysicalMaterial && p(e, t, i)) : t.isMeshMatcapMaterial ? (a(e, t), m(e, t)) : t.isMeshDepthMaterial ? a(e, t) : t.isMeshDistanceMaterial ? (a(e, t), h(e, t)) : t.isMeshNormalMaterial ? a(e, t) : t.isLineBasicMaterial ? (o(e, t), t.isLineDashedMaterial && s(e, t)) : t.isPointsMaterial ? c(e, t, n, r) : t.isSpriteMaterial ? l(e, t) : t.isShadowMaterial ? (e.color.value.copy(t.color), e.opacity.value = t.opacity) : t.isShaderMaterial && (t.uniformsNeedUpdate = !1);
	}
	function a(e, r) {
		e.opacity.value = r.opacity, r.color && e.diffuse.value.copy(r.color), r.emissive && e.emissive.value.copy(r.emissive).multiplyScalar(r.emissiveIntensity), r.map && (e.map.value = r.map, n(r.map, e.mapTransform)), r.alphaMap && (e.alphaMap.value = r.alphaMap, n(r.alphaMap, e.alphaMapTransform)), r.bumpMap && (e.bumpMap.value = r.bumpMap, n(r.bumpMap, e.bumpMapTransform), e.bumpScale.value = r.bumpScale, r.side === 1 && (e.bumpScale.value *= -1)), r.normalMap && (e.normalMap.value = r.normalMap, n(r.normalMap, e.normalMapTransform), e.normalScale.value.copy(r.normalScale), r.side === 1 && e.normalScale.value.negate()), r.displacementMap && (e.displacementMap.value = r.displacementMap, n(r.displacementMap, e.displacementMapTransform), e.displacementScale.value = r.displacementScale, e.displacementBias.value = r.displacementBias), r.emissiveMap && (e.emissiveMap.value = r.emissiveMap, n(r.emissiveMap, e.emissiveMapTransform)), r.specularMap && (e.specularMap.value = r.specularMap, n(r.specularMap, e.specularMapTransform)), r.alphaTest > 0 && (e.alphaTest.value = r.alphaTest);
		let i = t.get(r), a = i.envMap, o = i.envMapRotation;
		a && (e.envMap.value = a, e.envMapRotation.value.setFromMatrix4(dd.makeRotationFromEuler(o)).transpose(), a.isCubeTexture && a.isRenderTargetTexture === !1 && e.envMapRotation.value.premultiply(fd), e.reflectivity.value = r.reflectivity, e.ior.value = r.ior, e.refractionRatio.value = r.refractionRatio), r.lightMap && (e.lightMap.value = r.lightMap, e.lightMapIntensity.value = r.lightMapIntensity, n(r.lightMap, e.lightMapTransform)), r.aoMap && (e.aoMap.value = r.aoMap, e.aoMapIntensity.value = r.aoMapIntensity, n(r.aoMap, e.aoMapTransform));
	}
	function o(e, t) {
		e.diffuse.value.copy(t.color), e.opacity.value = t.opacity, t.map && (e.map.value = t.map, n(t.map, e.mapTransform));
	}
	function s(e, t) {
		e.dashSize.value = t.dashSize, e.totalSize.value = t.dashSize + t.gapSize, e.scale.value = t.scale;
	}
	function c(e, t, r, i) {
		e.diffuse.value.copy(t.color), e.opacity.value = t.opacity, e.size.value = t.size * r, e.scale.value = i * .5, t.map && (e.map.value = t.map, n(t.map, e.uvTransform)), t.alphaMap && (e.alphaMap.value = t.alphaMap, n(t.alphaMap, e.alphaMapTransform)), t.alphaTest > 0 && (e.alphaTest.value = t.alphaTest);
	}
	function l(e, t) {
		e.diffuse.value.copy(t.color), e.opacity.value = t.opacity, e.rotation.value = t.rotation, t.map && (e.map.value = t.map, n(t.map, e.mapTransform)), t.alphaMap && (e.alphaMap.value = t.alphaMap, n(t.alphaMap, e.alphaMapTransform)), t.alphaTest > 0 && (e.alphaTest.value = t.alphaTest);
	}
	function u(e, t) {
		e.specular.value.copy(t.specular), e.shininess.value = Math.max(t.shininess, 1e-4);
	}
	function d(e, t) {
		t.gradientMap && (e.gradientMap.value = t.gradientMap);
	}
	function f(e, t) {
		e.metalness.value = t.metalness, t.metalnessMap && (e.metalnessMap.value = t.metalnessMap, n(t.metalnessMap, e.metalnessMapTransform)), e.roughness.value = t.roughness, t.roughnessMap && (e.roughnessMap.value = t.roughnessMap, n(t.roughnessMap, e.roughnessMapTransform)), t.envMap && (e.envMapIntensity.value = t.envMapIntensity);
	}
	function p(e, t, r) {
		e.ior.value = t.ior, t.sheen > 0 && (e.sheenColor.value.copy(t.sheenColor).multiplyScalar(t.sheen), e.sheenRoughness.value = t.sheenRoughness, t.sheenColorMap && (e.sheenColorMap.value = t.sheenColorMap, n(t.sheenColorMap, e.sheenColorMapTransform)), t.sheenRoughnessMap && (e.sheenRoughnessMap.value = t.sheenRoughnessMap, n(t.sheenRoughnessMap, e.sheenRoughnessMapTransform))), t.clearcoat > 0 && (e.clearcoat.value = t.clearcoat, e.clearcoatRoughness.value = t.clearcoatRoughness, t.clearcoatMap && (e.clearcoatMap.value = t.clearcoatMap, n(t.clearcoatMap, e.clearcoatMapTransform)), t.clearcoatRoughnessMap && (e.clearcoatRoughnessMap.value = t.clearcoatRoughnessMap, n(t.clearcoatRoughnessMap, e.clearcoatRoughnessMapTransform)), t.clearcoatNormalMap && (e.clearcoatNormalMap.value = t.clearcoatNormalMap, n(t.clearcoatNormalMap, e.clearcoatNormalMapTransform), e.clearcoatNormalScale.value.copy(t.clearcoatNormalScale), t.side === 1 && e.clearcoatNormalScale.value.negate())), t.dispersion > 0 && (e.dispersion.value = t.dispersion), t.iridescence > 0 && (e.iridescence.value = t.iridescence, e.iridescenceIOR.value = t.iridescenceIOR, e.iridescenceThicknessMinimum.value = t.iridescenceThicknessRange[0], e.iridescenceThicknessMaximum.value = t.iridescenceThicknessRange[1], t.iridescenceMap && (e.iridescenceMap.value = t.iridescenceMap, n(t.iridescenceMap, e.iridescenceMapTransform)), t.iridescenceThicknessMap && (e.iridescenceThicknessMap.value = t.iridescenceThicknessMap, n(t.iridescenceThicknessMap, e.iridescenceThicknessMapTransform))), t.transmission > 0 && (e.transmission.value = t.transmission, e.transmissionSamplerMap.value = r.texture, e.transmissionSamplerSize.value.set(r.width, r.height), t.transmissionMap && (e.transmissionMap.value = t.transmissionMap, n(t.transmissionMap, e.transmissionMapTransform)), e.thickness.value = t.thickness, t.thicknessMap && (e.thicknessMap.value = t.thicknessMap, n(t.thicknessMap, e.thicknessMapTransform)), e.attenuationDistance.value = t.attenuationDistance, e.attenuationColor.value.copy(t.attenuationColor)), t.anisotropy > 0 && (e.anisotropyVector.value.set(t.anisotropy * Math.cos(t.anisotropyRotation), t.anisotropy * Math.sin(t.anisotropyRotation)), t.anisotropyMap && (e.anisotropyMap.value = t.anisotropyMap, n(t.anisotropyMap, e.anisotropyMapTransform))), e.specularIntensity.value = t.specularIntensity, e.specularColor.value.copy(t.specularColor), t.specularColorMap && (e.specularColorMap.value = t.specularColorMap, n(t.specularColorMap, e.specularColorMapTransform)), t.specularIntensityMap && (e.specularIntensityMap.value = t.specularIntensityMap, n(t.specularIntensityMap, e.specularIntensityMapTransform));
	}
	function m(e, t) {
		t.matcap && (e.matcap.value = t.matcap);
	}
	function h(e, n) {
		let r = t.get(n).light;
		e.referencePosition.value.setFromMatrixPosition(r.matrixWorld), e.nearDistance.value = r.shadow.camera.near, e.farDistance.value = r.shadow.camera.far;
	}
	return {
		refreshFogUniforms: r,
		refreshMaterialUniforms: i
	};
}
function ru(e, t, n, r) {
	let i = {}, a = {}, o = [], s = e.getParameter(e.MAX_UNIFORM_BUFFER_BINDINGS);
	function c(e, t) {
		let n = t.program;
		r.uniformBlockBinding(e, n);
	}
	function l(e, n) {
		let o = i[e.id];
		o === void 0 && (v(e), o = f(e), i[e.id] = o, e.addEventListener("dispose", b));
		let s = n.program;
		r.updateUBOMapping(e, s);
		let c = t.render.frame;
		a[e.id] !== c && (m(e), a[e.id] = c);
	}
	function f(t) {
		let n = p();
		t.__bindingPointIndex = n;
		let r = e.createBuffer(), i = t.__size, a = t.usage;
		return e.bindBuffer(e.UNIFORM_BUFFER, r), e.bufferData(e.UNIFORM_BUFFER, i, a), e.bindBuffer(e.UNIFORM_BUFFER, null), e.bindBufferBase(e.UNIFORM_BUFFER, n, r), r;
	}
	function p() {
		for (let e = 0; e < s; e++) if (o.indexOf(e) === -1) return o.push(e), e;
		return d("WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."), 0;
	}
	function m(t) {
		let n = i[t.id], r = t.uniforms, a = t.__cache;
		e.bindBuffer(e.UNIFORM_BUFFER, n);
		for (let e = 0, t = r.length; e < t; e++) {
			let t = r[e];
			if (Array.isArray(t)) for (let n = 0, r = t.length; n < r; n++) h(t[n], e, n, a);
			else h(t, e, 0, a);
		}
		e.bindBuffer(e.UNIFORM_BUFFER, null);
	}
	function h(t, n, r, i) {
		if (_(t, n, r, i) === !0) {
			let n = t.__offset, r = t.value;
			if (Array.isArray(r)) {
				let e = 0;
				for (let n = 0; n < r.length; n++) {
					let i = r[n], a = y(i);
					g(i, t.__data, e), typeof i != "number" && typeof i != "boolean" && !i.isMatrix3 && !ArrayBuffer.isView(i) && (e += a.storage / Float32Array.BYTES_PER_ELEMENT);
				}
			} else g(r, t.__data, 0);
			e.bufferSubData(e.UNIFORM_BUFFER, n, t.__data);
		}
	}
	function g(e, t, n) {
		typeof e == "number" || typeof e == "boolean" ? t[0] = e : e.isMatrix3 ? (t[0] = e.elements[0], t[1] = e.elements[1], t[2] = e.elements[2], t[3] = 0, t[4] = e.elements[3], t[5] = e.elements[4], t[6] = e.elements[5], t[7] = 0, t[8] = e.elements[6], t[9] = e.elements[7], t[10] = e.elements[8], t[11] = 0) : ArrayBuffer.isView(e) ? t.set(new e.constructor(e.buffer, e.byteOffset, t.length)) : e.toArray(t, n);
	}
	function _(e, t, n, r) {
		let i = e.value, a = t + "_" + n;
		if (r[a] === void 0) return r[a] = typeof i == "number" || typeof i == "boolean" ? i : ArrayBuffer.isView(i) ? i.slice() : i.clone(), !0;
		{
			let e = r[a];
			if (typeof i == "number" || typeof i == "boolean") {
				if (e !== i) return r[a] = i, !0;
			} else if (ArrayBuffer.isView(i)) return !0;
			else if (e.equals(i) === !1) return e.copy(i), !0;
		}
		return !1;
	}
	function v(e) {
		let t = e.uniforms, n = 0;
		for (let e = 0, r = t.length; e < r; e++) {
			let r = Array.isArray(t[e]) ? t[e] : [t[e]];
			for (let e = 0, t = r.length; e < t; e++) {
				let t = r[e], i = Array.isArray(t.value) ? t.value : [t.value];
				for (let e = 0, r = i.length; e < r; e++) {
					let r = i[e], a = y(r), o = n % 16, s = o % a.boundary, c = o + s;
					n += s, c !== 0 && 16 - c < a.storage && (n += 16 - c), t.__data = new Float32Array(a.storage / Float32Array.BYTES_PER_ELEMENT), t.__offset = n, n += a.storage;
				}
			}
		}
		let r = n % 16;
		return r > 0 && (n += 16 - r), e.__size = n, e.__cache = {}, this;
	}
	function y(e) {
		let t = {
			boundary: 0,
			storage: 0
		};
		return typeof e == "number" || typeof e == "boolean" ? (t.boundary = 4, t.storage = 4) : e.isVector2 ? (t.boundary = 8, t.storage = 8) : e.isVector3 || e.isColor ? (t.boundary = 16, t.storage = 12) : e.isVector4 ? (t.boundary = 16, t.storage = 16) : e.isMatrix3 ? (t.boundary = 48, t.storage = 48) : e.isMatrix4 ? (t.boundary = 64, t.storage = 64) : e.isTexture ? u("WebGLRenderer: Texture samplers can not be part of an uniforms group.") : ArrayBuffer.isView(e) ? (t.boundary = 16, t.storage = e.byteLength) : u("WebGLRenderer: Unsupported uniform value type.", e), t;
	}
	function b(t) {
		let n = t.target;
		n.removeEventListener("dispose", b);
		let r = o.indexOf(n.__bindingPointIndex);
		o.splice(r, 1), e.deleteBuffer(i[n.id]), delete i[n.id], delete a[n.id];
	}
	function x() {
		for (let t in i) e.deleteBuffer(i[t]);
		o = [], i = {}, a = {};
	}
	return {
		bind: c,
		update: l,
		dispose: x
	};
}
function iu() {
	return md === null && (md = new Ea(pd, 16, 16, Rt, Tt), md.name = "DFG_LUT", md.minFilter = ht, md.magFilter = ht, md.wrapS = ut, md.wrapT = ut, md.generateMipmaps = !1, md.needsUpdate = !0), md;
}
var Y, X, au, ou, su, cu, lu, uu, du, fu, pu, mu, hu, gu, _u, vu, yu, bu, xu, Su, Cu, wu, Tu, Eu, Du, Ou, ku, Au, ju, Mu, Nu, Pu, Fu, Iu, Lu, Ru, zu, Bu, Vu, Hu, Uu, Wu, Gu, Ku, qu, Ju, Yu, Xu, Zu, Qu, $u, ed, td, nd, rd, id, ad, od, sd, cd, ld, ud, dd, fd, pd, md, hd, gd = t((() => {
	$s(), Y = {
		alphahash_fragment: "#ifdef USE_ALPHAHASH\n	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;\n#endif",
		alphahash_pars_fragment: "#ifdef USE_ALPHAHASH\n	const float ALPHA_HASH_SCALE = 0.05;\n	float hash2D( vec2 value ) {\n		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );\n	}\n	float hash3D( vec3 value ) {\n		return hash2D( vec2( hash2D( value.xy ), value.z ) );\n	}\n	float getAlphaHashThreshold( vec3 position ) {\n		float maxDeriv = max(\n			length( dFdx( position.xyz ) ),\n			length( dFdy( position.xyz ) )\n		);\n		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );\n		vec2 pixScales = vec2(\n			exp2( floor( log2( pixScale ) ) ),\n			exp2( ceil( log2( pixScale ) ) )\n		);\n		vec2 alpha = vec2(\n			hash3D( floor( pixScales.x * position.xyz ) ),\n			hash3D( floor( pixScales.y * position.xyz ) )\n		);\n		float lerpFactor = fract( log2( pixScale ) );\n		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;\n		float a = min( lerpFactor, 1.0 - lerpFactor );\n		vec3 cases = vec3(\n			x * x / ( 2.0 * a * ( 1.0 - a ) ),\n			( x - 0.5 * a ) / ( 1.0 - a ),\n			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )\n		);\n		float threshold = ( x < ( 1.0 - a ) )\n			? ( ( x < a ) ? cases.x : cases.y )\n			: cases.z;\n		return clamp( threshold , 1.0e-6, 1.0 );\n	}\n#endif",
		alphamap_fragment: "#ifdef USE_ALPHAMAP\n	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;\n#endif",
		alphamap_pars_fragment: "#ifdef USE_ALPHAMAP\n	uniform sampler2D alphaMap;\n#endif",
		alphatest_fragment: "#ifdef USE_ALPHATEST\n	#ifdef ALPHA_TO_COVERAGE\n	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );\n	if ( diffuseColor.a == 0.0 ) discard;\n	#else\n	if ( diffuseColor.a < alphaTest ) discard;\n	#endif\n#endif",
		alphatest_pars_fragment: "#ifdef USE_ALPHATEST\n	uniform float alphaTest;\n#endif",
		aomap_fragment: "#ifdef USE_AOMAP\n	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;\n	reflectedLight.indirectDiffuse *= ambientOcclusion;\n	#if defined( USE_CLEARCOAT ) \n		clearcoatSpecularIndirect *= ambientOcclusion;\n	#endif\n	#if defined( USE_SHEEN ) \n		sheenSpecularIndirect *= ambientOcclusion;\n	#endif\n	#if defined( USE_ENVMAP ) && defined( STANDARD )\n		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );\n		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );\n	#endif\n#endif",
		aomap_pars_fragment: "#ifdef USE_AOMAP\n	uniform sampler2D aoMap;\n	uniform float aoMapIntensity;\n#endif",
		batching_pars_vertex: "#ifdef USE_BATCHING\n	#if ! defined( GL_ANGLE_multi_draw )\n	#define gl_DrawID _gl_DrawID\n	uniform int _gl_DrawID;\n	#endif\n	uniform highp sampler2D batchingTexture;\n	uniform highp usampler2D batchingIdTexture;\n	mat4 getBatchingMatrix( const in float i ) {\n		int size = textureSize( batchingTexture, 0 ).x;\n		int j = int( i ) * 4;\n		int x = j % size;\n		int y = j / size;\n		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );\n		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );\n		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );\n		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );\n		return mat4( v1, v2, v3, v4 );\n	}\n	float getIndirectIndex( const in int i ) {\n		int size = textureSize( batchingIdTexture, 0 ).x;\n		int x = i % size;\n		int y = i / size;\n		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );\n	}\n#endif\n#ifdef USE_BATCHING_COLOR\n	uniform sampler2D batchingColorTexture;\n	vec4 getBatchingColor( const in float i ) {\n		int size = textureSize( batchingColorTexture, 0 ).x;\n		int j = int( i );\n		int x = j % size;\n		int y = j / size;\n		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 );\n	}\n#endif",
		batching_vertex: "#ifdef USE_BATCHING\n	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );\n#endif",
		begin_vertex: "vec3 transformed = vec3( position );\n#ifdef USE_ALPHAHASH\n	vPosition = vec3( position );\n#endif",
		beginnormal_vertex: "vec3 objectNormal = vec3( normal );\n#ifdef USE_TANGENT\n	vec3 objectTangent = vec3( tangent.xyz );\n#endif",
		bsdfs: "float G_BlinnPhong_Implicit( ) {\n	return 0.25;\n}\nfloat D_BlinnPhong( const in float shininess, const in float dotNH ) {\n	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );\n}\nvec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {\n	vec3 halfDir = normalize( lightDir + viewDir );\n	float dotNH = saturate( dot( normal, halfDir ) );\n	float dotVH = saturate( dot( viewDir, halfDir ) );\n	vec3 F = F_Schlick( specularColor, 1.0, dotVH );\n	float G = G_BlinnPhong_Implicit( );\n	float D = D_BlinnPhong( shininess, dotNH );\n	return F * ( G * D );\n} // validated",
		iridescence_fragment: "#ifdef USE_IRIDESCENCE\n	const mat3 XYZ_TO_REC709 = mat3(\n		 3.2404542, -0.9692660,  0.0556434,\n		-1.5371385,  1.8760108, -0.2040259,\n		-0.4985314,  0.0415560,  1.0572252\n	);\n	vec3 Fresnel0ToIor( vec3 fresnel0 ) {\n		vec3 sqrtF0 = sqrt( fresnel0 );\n		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );\n	}\n	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {\n		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );\n	}\n	float IorToFresnel0( float transmittedIor, float incidentIor ) {\n		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));\n	}\n	vec3 evalSensitivity( float OPD, vec3 shift ) {\n		float phase = 2.0 * PI * OPD * 1.0e-9;\n		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );\n		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );\n		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );\n		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );\n		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );\n		xyz /= 1.0685e-7;\n		vec3 rgb = XYZ_TO_REC709 * xyz;\n		return rgb;\n	}\n	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {\n		vec3 I;\n		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );\n		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );\n		float cosTheta2Sq = 1.0 - sinTheta2Sq;\n		if ( cosTheta2Sq < 0.0 ) {\n			return vec3( 1.0 );\n		}\n		float cosTheta2 = sqrt( cosTheta2Sq );\n		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );\n		float R12 = F_Schlick( R0, 1.0, cosTheta1 );\n		float T121 = 1.0 - R12;\n		float phi12 = 0.0;\n		if ( iridescenceIOR < outsideIOR ) phi12 = PI;\n		float phi21 = PI - phi12;\n		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );\n		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );\n		vec3 phi23 = vec3( 0.0 );\n		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;\n		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;\n		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;\n		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;\n		vec3 phi = vec3( phi21 ) + phi23;\n		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );\n		vec3 r123 = sqrt( R123 );\n		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );\n		vec3 C0 = R12 + Rs;\n		I = C0;\n		vec3 Cm = Rs - T121;\n		for ( int m = 1; m <= 2; ++ m ) {\n			Cm *= r123;\n			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );\n			I += Cm * Sm;\n		}\n		return max( I, vec3( 0.0 ) );\n	}\n#endif",
		bumpmap_pars_fragment: "#ifdef USE_BUMPMAP\n	uniform sampler2D bumpMap;\n	uniform float bumpScale;\n	vec2 dHdxy_fwd() {\n		vec2 dSTdx = dFdx( vBumpMapUv );\n		vec2 dSTdy = dFdy( vBumpMapUv );\n		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;\n		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;\n		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;\n		return vec2( dBx, dBy );\n	}\n	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {\n		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );\n		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );\n		vec3 vN = surf_norm;\n		vec3 R1 = cross( vSigmaY, vN );\n		vec3 R2 = cross( vN, vSigmaX );\n		float fDet = dot( vSigmaX, R1 ) * faceDirection;\n		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );\n		return normalize( abs( fDet ) * surf_norm - vGrad );\n	}\n#endif",
		clipping_planes_fragment: "#if NUM_CLIPPING_PLANES > 0\n	vec4 plane;\n	#ifdef ALPHA_TO_COVERAGE\n		float distanceToPlane, distanceGradient;\n		float clipOpacity = 1.0;\n		#pragma unroll_loop_start\n		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {\n			plane = clippingPlanes[ i ];\n			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;\n			distanceGradient = fwidth( distanceToPlane ) / 2.0;\n			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );\n			if ( clipOpacity == 0.0 ) discard;\n		}\n		#pragma unroll_loop_end\n		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES\n			float unionClipOpacity = 1.0;\n			#pragma unroll_loop_start\n			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {\n				plane = clippingPlanes[ i ];\n				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;\n				distanceGradient = fwidth( distanceToPlane ) / 2.0;\n				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );\n			}\n			#pragma unroll_loop_end\n			clipOpacity *= 1.0 - unionClipOpacity;\n		#endif\n		diffuseColor.a *= clipOpacity;\n		if ( diffuseColor.a == 0.0 ) discard;\n	#else\n		#pragma unroll_loop_start\n		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {\n			plane = clippingPlanes[ i ];\n			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;\n		}\n		#pragma unroll_loop_end\n		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES\n			bool clipped = true;\n			#pragma unroll_loop_start\n			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {\n				plane = clippingPlanes[ i ];\n				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;\n			}\n			#pragma unroll_loop_end\n			if ( clipped ) discard;\n		#endif\n	#endif\n#endif",
		clipping_planes_pars_fragment: "#if NUM_CLIPPING_PLANES > 0\n	varying vec3 vClipPosition;\n	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];\n#endif",
		clipping_planes_pars_vertex: "#if NUM_CLIPPING_PLANES > 0\n	varying vec3 vClipPosition;\n#endif",
		clipping_planes_vertex: "#if NUM_CLIPPING_PLANES > 0\n	vClipPosition = - mvPosition.xyz;\n#endif",
		color_fragment: "#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )\n	diffuseColor *= vColor;\n#endif",
		color_pars_fragment: "#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )\n	varying vec4 vColor;\n#endif",
		color_pars_vertex: "#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )\n	varying vec4 vColor;\n#endif",
		color_vertex: "#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )\n	vColor = vec4( 1.0 );\n#endif\n#ifdef USE_COLOR_ALPHA\n	vColor *= color;\n#elif defined( USE_COLOR )\n	vColor.rgb *= color;\n#endif\n#ifdef USE_INSTANCING_COLOR\n	vColor.rgb *= instanceColor.rgb;\n#endif\n#ifdef USE_BATCHING_COLOR\n	vColor *= getBatchingColor( getIndirectIndex( gl_DrawID ) );\n#endif",
		common: "#define PI 3.141592653589793\n#define PI2 6.283185307179586\n#define PI_HALF 1.5707963267948966\n#define RECIPROCAL_PI 0.3183098861837907\n#define RECIPROCAL_PI2 0.15915494309189535\n#define EPSILON 1e-6\n#ifndef saturate\n#define saturate( a ) clamp( a, 0.0, 1.0 )\n#endif\n#define whiteComplement( a ) ( 1.0 - saturate( a ) )\nfloat pow2( const in float x ) { return x*x; }\nvec3 pow2( const in vec3 x ) { return x*x; }\nfloat pow3( const in float x ) { return x*x*x; }\nfloat pow4( const in float x ) { float x2 = x*x; return x2*x2; }\nfloat max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }\nfloat average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }\nhighp float rand( const in vec2 uv ) {\n	const highp float a = 12.9898, b = 78.233, c = 43758.5453;\n	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );\n	return fract( sin( sn ) * c );\n}\n#ifdef HIGH_PRECISION\n	float precisionSafeLength( vec3 v ) { return length( v ); }\n#else\n	float precisionSafeLength( vec3 v ) {\n		float maxComponent = max3( abs( v ) );\n		return length( v / maxComponent ) * maxComponent;\n	}\n#endif\nstruct IncidentLight {\n	vec3 color;\n	vec3 direction;\n	bool visible;\n};\nstruct ReflectedLight {\n	vec3 directDiffuse;\n	vec3 directSpecular;\n	vec3 indirectDiffuse;\n	vec3 indirectSpecular;\n};\n#ifdef USE_ALPHAHASH\n	varying vec3 vPosition;\n#endif\nvec3 transformDirection( in vec3 dir, in mat4 matrix ) {\n	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );\n}\n#define inverseTransformDirection transformDirectionByInverseViewMatrix\nvec3 transformNormalByInverseViewMatrix( in vec3 normal, in mat4 viewMatrix ) {\n	return normalize( ( vec4( normal, 0.0 ) * viewMatrix ).xyz );\n}\nvec3 transformDirectionByInverseViewMatrix( in vec3 dir, in mat4 viewMatrix ) {\n	return normalize( ( vec4( dir, 0.0 ) * viewMatrix ).xyz );\n}\nbool isPerspectiveMatrix( mat4 m ) {\n	return m[ 2 ][ 3 ] == - 1.0;\n}\nvec2 equirectUv( in vec3 dir ) {\n	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;\n	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;\n	return vec2( u, v );\n}\nvec3 BRDF_Lambert( const in vec3 diffuseColor ) {\n	return RECIPROCAL_PI * diffuseColor;\n}\nvec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {\n	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );\n	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );\n}\nfloat F_Schlick( const in float f0, const in float f90, const in float dotVH ) {\n	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );\n	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );\n} // validated",
		cube_uv_reflection_fragment: "#ifdef ENVMAP_TYPE_CUBE_UV\n	#define cubeUV_minMipLevel 4.0\n	#define cubeUV_minTileSize 16.0\n	float getFace( vec3 direction ) {\n		vec3 absDirection = abs( direction );\n		float face = - 1.0;\n		if ( absDirection.x > absDirection.z ) {\n			if ( absDirection.x > absDirection.y )\n				face = direction.x > 0.0 ? 0.0 : 3.0;\n			else\n				face = direction.y > 0.0 ? 1.0 : 4.0;\n		} else {\n			if ( absDirection.z > absDirection.y )\n				face = direction.z > 0.0 ? 2.0 : 5.0;\n			else\n				face = direction.y > 0.0 ? 1.0 : 4.0;\n		}\n		return face;\n	}\n	vec2 getUV( vec3 direction, float face ) {\n		vec2 uv;\n		if ( face == 0.0 ) {\n			uv = vec2( direction.z, direction.y ) / abs( direction.x );\n		} else if ( face == 1.0 ) {\n			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );\n		} else if ( face == 2.0 ) {\n			uv = vec2( - direction.x, direction.y ) / abs( direction.z );\n		} else if ( face == 3.0 ) {\n			uv = vec2( - direction.z, direction.y ) / abs( direction.x );\n		} else if ( face == 4.0 ) {\n			uv = vec2( - direction.x, direction.z ) / abs( direction.y );\n		} else {\n			uv = vec2( direction.x, direction.y ) / abs( direction.z );\n		}\n		return 0.5 * ( uv + 1.0 );\n	}\n	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {\n		float face = getFace( direction );\n		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );\n		mipInt = max( mipInt, cubeUV_minMipLevel );\n		float faceSize = exp2( mipInt );\n		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;\n		if ( face > 2.0 ) {\n			uv.y += faceSize;\n			face -= 3.0;\n		}\n		uv.x += face * faceSize;\n		uv.x += filterInt * 3.0 * cubeUV_minTileSize;\n		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );\n		uv.x *= CUBEUV_TEXEL_WIDTH;\n		uv.y *= CUBEUV_TEXEL_HEIGHT;\n		#ifdef texture2DGradEXT\n			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;\n		#else\n			return texture2D( envMap, uv ).rgb;\n		#endif\n	}\n	#define cubeUV_r0 1.0\n	#define cubeUV_m0 - 2.0\n	#define cubeUV_r1 0.8\n	#define cubeUV_m1 - 1.0\n	#define cubeUV_r4 0.4\n	#define cubeUV_m4 2.0\n	#define cubeUV_r5 0.305\n	#define cubeUV_m5 3.0\n	#define cubeUV_r6 0.21\n	#define cubeUV_m6 4.0\n	float roughnessToMip( float roughness ) {\n		float mip = 0.0;\n		if ( roughness >= cubeUV_r1 ) {\n			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;\n		} else if ( roughness >= cubeUV_r4 ) {\n			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;\n		} else if ( roughness >= cubeUV_r5 ) {\n			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;\n		} else if ( roughness >= cubeUV_r6 ) {\n			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;\n		} else {\n			mip = - 2.0 * log2( 1.16 * roughness );		}\n		return mip;\n	}\n	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {\n		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );\n		float mipF = fract( mip );\n		float mipInt = floor( mip );\n		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );\n		if ( mipF == 0.0 ) {\n			return vec4( color0, 1.0 );\n		} else {\n			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );\n			return vec4( mix( color0, color1, mipF ), 1.0 );\n		}\n	}\n#endif",
		defaultnormal_vertex: "vec3 transformedNormal = objectNormal;\n#ifdef USE_TANGENT\n	vec3 transformedTangent = objectTangent;\n#endif\n#ifdef USE_BATCHING\n	mat3 bm = mat3( batchingMatrix );\n	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );\n	transformedNormal = bm * transformedNormal;\n	#ifdef USE_TANGENT\n		transformedTangent = bm * transformedTangent;\n	#endif\n#endif\n#ifdef USE_INSTANCING\n	mat3 im = mat3( instanceMatrix );\n	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );\n	transformedNormal = im * transformedNormal;\n	#ifdef USE_TANGENT\n		transformedTangent = im * transformedTangent;\n	#endif\n#endif\ntransformedNormal = normalMatrix * transformedNormal;\n#ifdef FLIP_SIDED\n	transformedNormal = - transformedNormal;\n#endif\n#ifdef USE_TANGENT\n	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;\n#endif",
		displacementmap_pars_vertex: "#ifdef USE_DISPLACEMENTMAP\n	uniform sampler2D displacementMap;\n	uniform float displacementScale;\n	uniform float displacementBias;\n#endif",
		displacementmap_vertex: "#ifdef USE_DISPLACEMENTMAP\n	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );\n#endif",
		emissivemap_fragment: "#ifdef USE_EMISSIVEMAP\n	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );\n	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE\n		emissiveColor = sRGBTransferEOTF( emissiveColor );\n	#endif\n	totalEmissiveRadiance *= emissiveColor.rgb;\n#endif",
		emissivemap_pars_fragment: "#ifdef USE_EMISSIVEMAP\n	uniform sampler2D emissiveMap;\n#endif",
		colorspace_fragment: "gl_FragColor = linearToOutputTexel( gl_FragColor );",
		colorspace_pars_fragment: "vec4 LinearTransferOETF( in vec4 value ) {\n	return value;\n}\nvec4 sRGBTransferEOTF( in vec4 value ) {\n	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );\n}\nvec4 sRGBTransferOETF( in vec4 value ) {\n	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );\n}",
		envmap_fragment: "#ifdef USE_ENVMAP\n	#ifdef ENV_WORLDPOS\n		vec3 cameraToFrag;\n		if ( isOrthographic ) {\n			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );\n		} else {\n			cameraToFrag = normalize( vWorldPosition - cameraPosition );\n		}\n		vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );\n		#ifdef ENVMAP_MODE_REFLECTION\n			vec3 reflectVec = reflect( cameraToFrag, worldNormal );\n		#else\n			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );\n		#endif\n	#else\n		vec3 reflectVec = vReflect;\n	#endif\n	#ifdef ENVMAP_TYPE_CUBE\n		vec4 envColor = textureCube( envMap, envMapRotation * reflectVec );\n		#ifdef ENVMAP_BLENDING_MULTIPLY\n			outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );\n		#elif defined( ENVMAP_BLENDING_MIX )\n			outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );\n		#elif defined( ENVMAP_BLENDING_ADD )\n			outgoingLight += envColor.xyz * specularStrength * reflectivity;\n		#endif\n	#endif\n#endif",
		envmap_common_pars_fragment: "#ifdef USE_ENVMAP\n	uniform float envMapIntensity;\n	uniform mat3 envMapRotation;\n	#ifdef ENVMAP_TYPE_CUBE\n		uniform samplerCube envMap;\n	#else\n		uniform sampler2D envMap;\n	#endif\n#endif",
		envmap_pars_fragment: "#ifdef USE_ENVMAP\n	uniform float reflectivity;\n	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )\n		#define ENV_WORLDPOS\n	#endif\n	#ifdef ENV_WORLDPOS\n		varying vec3 vWorldPosition;\n		uniform float refractionRatio;\n	#else\n		varying vec3 vReflect;\n	#endif\n#endif",
		envmap_pars_vertex: "#ifdef USE_ENVMAP\n	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )\n		#define ENV_WORLDPOS\n	#endif\n	#ifdef ENV_WORLDPOS\n		\n		varying vec3 vWorldPosition;\n	#else\n		varying vec3 vReflect;\n		uniform float refractionRatio;\n	#endif\n#endif",
		envmap_physical_pars_fragment: "#ifdef USE_ENVMAP\n	vec3 getIBLIrradiance( const in vec3 normal ) {\n		#ifdef ENVMAP_TYPE_CUBE_UV\n			vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );\n			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );\n			return PI * envMapColor.rgb * envMapIntensity;\n		#else\n			return vec3( 0.0 );\n		#endif\n	}\n	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {\n		#ifdef ENVMAP_TYPE_CUBE_UV\n			vec3 reflectVec = reflect( - viewDir, normal );\n			reflectVec = normalize( mix( reflectVec, normal, pow4( roughness ) ) );\n			reflectVec = transformDirectionByInverseViewMatrix( reflectVec, viewMatrix );\n			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );\n			return envMapColor.rgb * envMapIntensity;\n		#else\n			return vec3( 0.0 );\n		#endif\n	}\n	#ifdef USE_ANISOTROPY\n		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {\n			#ifdef ENVMAP_TYPE_CUBE_UV\n				vec3 bentNormal = cross( bitangent, viewDir );\n				bentNormal = normalize( cross( bentNormal, bitangent ) );\n				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );\n				return getIBLRadiance( viewDir, bentNormal, roughness );\n			#else\n				return vec3( 0.0 );\n			#endif\n		}\n	#endif\n#endif",
		envmap_vertex: "#ifdef USE_ENVMAP\n	#ifdef ENV_WORLDPOS\n		vWorldPosition = worldPosition.xyz;\n	#else\n		vec3 cameraToVertex;\n		if ( isOrthographic ) {\n			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );\n		} else {\n			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );\n		}\n		vec3 worldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );\n		#ifdef ENVMAP_MODE_REFLECTION\n			vReflect = reflect( cameraToVertex, worldNormal );\n		#else\n			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );\n		#endif\n	#endif\n#endif",
		fog_vertex: "#ifdef USE_FOG\n	vFogDepth = - mvPosition.z;\n#endif",
		fog_pars_vertex: "#ifdef USE_FOG\n	varying float vFogDepth;\n#endif",
		fog_fragment: "#ifdef USE_FOG\n	#ifdef FOG_EXP2\n		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );\n	#else\n		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );\n	#endif\n	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );\n#endif",
		fog_pars_fragment: "#ifdef USE_FOG\n	uniform vec3 fogColor;\n	varying float vFogDepth;\n	#ifdef FOG_EXP2\n		uniform float fogDensity;\n	#else\n		uniform float fogNear;\n		uniform float fogFar;\n	#endif\n#endif",
		gradientmap_pars_fragment: "#ifdef USE_GRADIENTMAP\n	uniform sampler2D gradientMap;\n#endif\nvec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {\n	float dotNL = dot( normal, lightDirection );\n	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );\n	#ifdef USE_GRADIENTMAP\n		return vec3( texture2D( gradientMap, coord ).r );\n	#else\n		vec2 fw = fwidth( coord ) * 0.5;\n		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );\n	#endif\n}",
		lightmap_pars_fragment: "#ifdef USE_LIGHTMAP\n	uniform sampler2D lightMap;\n	uniform float lightMapIntensity;\n#endif",
		lights_lambert_fragment: "LambertMaterial material;\nmaterial.diffuseColor = diffuseColor.rgb;\nmaterial.specularStrength = specularStrength;",
		lights_lambert_pars_fragment: "varying vec3 vViewPosition;\nstruct LambertMaterial {\n	vec3 diffuseColor;\n	float specularStrength;\n};\nvoid RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {\n	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );\n	vec3 irradiance = dotNL * directLight.color;\n	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );\n}\nvoid RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {\n	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );\n}\n#define RE_Direct				RE_Direct_Lambert\n#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert",
		lights_pars_begin: "uniform bool receiveShadow;\nuniform vec3 ambientLightColor;\n#if defined( USE_LIGHT_PROBES )\n	uniform vec3 lightProbe[ 9 ];\n#endif\nvec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {\n	float x = normal.x, y = normal.y, z = normal.z;\n	vec3 result = shCoefficients[ 0 ] * 0.886227;\n	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;\n	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;\n	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;\n	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;\n	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;\n	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );\n	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;\n	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );\n	return result;\n}\nvec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {\n	vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );\n	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );\n	return irradiance;\n}\nvec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {\n	vec3 irradiance = ambientLightColor;\n	return irradiance;\n}\nfloat getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {\n	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );\n	if ( cutoffDistance > 0.0 ) {\n		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );\n	}\n	return distanceFalloff;\n}\nfloat getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {\n	return smoothstep( coneCosine, penumbraCosine, angleCosine );\n}\n#if NUM_DIR_LIGHTS > 0\n	struct DirectionalLight {\n		vec3 direction;\n		vec3 color;\n	};\n	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];\n	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {\n		light.color = directionalLight.color;\n		light.direction = directionalLight.direction;\n		light.visible = true;\n	}\n#endif\n#if NUM_POINT_LIGHTS > 0\n	struct PointLight {\n		vec3 position;\n		vec3 color;\n		float distance;\n		float decay;\n	};\n	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];\n	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {\n		vec3 lVector = pointLight.position - geometryPosition;\n		light.direction = normalize( lVector );\n		float lightDistance = length( lVector );\n		light.color = pointLight.color;\n		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );\n		light.visible = ( light.color != vec3( 0.0 ) );\n	}\n#endif\n#if NUM_SPOT_LIGHTS > 0\n	struct SpotLight {\n		vec3 position;\n		vec3 direction;\n		vec3 color;\n		float distance;\n		float decay;\n		float coneCos;\n		float penumbraCos;\n	};\n	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];\n	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {\n		vec3 lVector = spotLight.position - geometryPosition;\n		light.direction = normalize( lVector );\n		float angleCos = dot( light.direction, spotLight.direction );\n		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );\n		if ( spotAttenuation > 0.0 ) {\n			float lightDistance = length( lVector );\n			light.color = spotLight.color * spotAttenuation;\n			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );\n			light.visible = ( light.color != vec3( 0.0 ) );\n		} else {\n			light.color = vec3( 0.0 );\n			light.visible = false;\n		}\n	}\n#endif\n#if NUM_RECT_AREA_LIGHTS > 0\n	struct RectAreaLight {\n		vec3 color;\n		vec3 position;\n		vec3 halfWidth;\n		vec3 halfHeight;\n	};\n	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;\n	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];\n#endif\n#if NUM_HEMI_LIGHTS > 0\n	struct HemisphereLight {\n		vec3 direction;\n		vec3 skyColor;\n		vec3 groundColor;\n	};\n	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];\n	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {\n		float dotNL = dot( normal, hemiLight.direction );\n		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;\n		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );\n		return irradiance;\n	}\n#endif\n#include <lightprobes_pars_fragment>",
		lights_toon_fragment: "ToonMaterial material;\nmaterial.diffuseColor = diffuseColor.rgb;",
		lights_toon_pars_fragment: "varying vec3 vViewPosition;\nstruct ToonMaterial {\n	vec3 diffuseColor;\n};\nvoid RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {\n	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;\n	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );\n}\nvoid RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {\n	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );\n}\n#define RE_Direct				RE_Direct_Toon\n#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon",
		lights_phong_fragment: "BlinnPhongMaterial material;\nmaterial.diffuseColor = diffuseColor.rgb;\nmaterial.specularColor = specular;\nmaterial.specularShininess = shininess;\nmaterial.specularStrength = specularStrength;",
		lights_phong_pars_fragment: "varying vec3 vViewPosition;\nstruct BlinnPhongMaterial {\n	vec3 diffuseColor;\n	vec3 specularColor;\n	float specularShininess;\n	float specularStrength;\n};\nvoid RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {\n	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );\n	vec3 irradiance = dotNL * directLight.color;\n	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );\n	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;\n}\nvoid RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {\n	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );\n}\n#define RE_Direct				RE_Direct_BlinnPhong\n#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong",
		lights_physical_fragment: "PhysicalMaterial material;\nmaterial.diffuseColor = diffuseColor.rgb;\nmaterial.diffuseContribution = diffuseColor.rgb * ( 1.0 - metalnessFactor );\nmaterial.metalness = metalnessFactor;\nvec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );\nfloat geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );\nmaterial.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;\nmaterial.roughness = min( material.roughness, 1.0 );\n#ifdef IOR\n	material.ior = ior;\n	#ifdef USE_SPECULAR\n		float specularIntensityFactor = specularIntensity;\n		vec3 specularColorFactor = specularColor;\n		#ifdef USE_SPECULAR_COLORMAP\n			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;\n		#endif\n		#ifdef USE_SPECULAR_INTENSITYMAP\n			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;\n		#endif\n		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );\n	#else\n		float specularIntensityFactor = 1.0;\n		vec3 specularColorFactor = vec3( 1.0 );\n		material.specularF90 = 1.0;\n	#endif\n	material.specularColor = min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor;\n	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );\n#else\n	material.specularColor = vec3( 0.04 );\n	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );\n	material.specularF90 = 1.0;\n#endif\n#ifdef USE_CLEARCOAT\n	material.clearcoat = clearcoat;\n	material.clearcoatRoughness = clearcoatRoughness;\n	material.clearcoatF0 = vec3( 0.04 );\n	material.clearcoatF90 = 1.0;\n	#ifdef USE_CLEARCOATMAP\n		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;\n	#endif\n	#ifdef USE_CLEARCOAT_ROUGHNESSMAP\n		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;\n	#endif\n	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );\n	material.clearcoatRoughness += geometryRoughness;\n	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );\n#endif\n#ifdef USE_DISPERSION\n	material.dispersion = dispersion;\n#endif\n#ifdef USE_IRIDESCENCE\n	material.iridescence = iridescence;\n	material.iridescenceIOR = iridescenceIOR;\n	#ifdef USE_IRIDESCENCEMAP\n		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;\n	#endif\n	#ifdef USE_IRIDESCENCE_THICKNESSMAP\n		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;\n	#else\n		material.iridescenceThickness = iridescenceThicknessMaximum;\n	#endif\n#endif\n#ifdef USE_SHEEN\n	material.sheenColor = sheenColor;\n	#ifdef USE_SHEEN_COLORMAP\n		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;\n	#endif\n	material.sheenRoughness = clamp( sheenRoughness, 0.0001, 1.0 );\n	#ifdef USE_SHEEN_ROUGHNESSMAP\n		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;\n	#endif\n#endif\n#ifdef USE_ANISOTROPY\n	#ifdef USE_ANISOTROPYMAP\n		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );\n		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;\n		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;\n	#else\n		vec2 anisotropyV = anisotropyVector;\n	#endif\n	material.anisotropy = length( anisotropyV );\n	if( material.anisotropy == 0.0 ) {\n		anisotropyV = vec2( 1.0, 0.0 );\n	} else {\n		anisotropyV /= material.anisotropy;\n		material.anisotropy = saturate( material.anisotropy );\n	}\n	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );\n	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;\n	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;\n#endif",
		lights_physical_pars_fragment: "uniform sampler2D dfgLUT;\nstruct PhysicalMaterial {\n	vec3 diffuseColor;\n	vec3 diffuseContribution;\n	vec3 specularColor;\n	vec3 specularColorBlended;\n	float roughness;\n	float metalness;\n	float specularF90;\n	float dispersion;\n	#ifdef USE_CLEARCOAT\n		float clearcoat;\n		float clearcoatRoughness;\n		vec3 clearcoatF0;\n		float clearcoatF90;\n	#endif\n	#ifdef USE_IRIDESCENCE\n		float iridescence;\n		float iridescenceIOR;\n		float iridescenceThickness;\n		vec3 iridescenceFresnel;\n		vec3 iridescenceF0;\n		vec3 iridescenceFresnelDielectric;\n		vec3 iridescenceFresnelMetallic;\n	#endif\n	#ifdef USE_SHEEN\n		vec3 sheenColor;\n		float sheenRoughness;\n	#endif\n	#ifdef IOR\n		float ior;\n	#endif\n	#ifdef USE_TRANSMISSION\n		float transmission;\n		float transmissionAlpha;\n		float thickness;\n		float attenuationDistance;\n		vec3 attenuationColor;\n	#endif\n	#ifdef USE_ANISOTROPY\n		float anisotropy;\n		float alphaT;\n		vec3 anisotropyT;\n		vec3 anisotropyB;\n	#endif\n};\nvec3 clearcoatSpecularDirect = vec3( 0.0 );\nvec3 clearcoatSpecularIndirect = vec3( 0.0 );\nvec3 sheenSpecularDirect = vec3( 0.0 );\nvec3 sheenSpecularIndirect = vec3(0.0 );\nvec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {\n    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );\n    float x2 = x * x;\n    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );\n    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );\n}\nfloat V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {\n	float a2 = pow2( alpha );\n	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );\n	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );\n	return 0.5 / max( gv + gl, EPSILON );\n}\nfloat D_GGX( const in float alpha, const in float dotNH ) {\n	float a2 = pow2( alpha );\n	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;\n	return RECIPROCAL_PI * a2 / pow2( denom );\n}\n#ifdef USE_ANISOTROPY\n	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {\n		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );\n		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );\n		return 0.5 / max( gv + gl, EPSILON );\n	}\n	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {\n		float a2 = alphaT * alphaB;\n		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );\n		highp float v2 = dot( v, v );\n		float w2 = a2 / v2;\n		return RECIPROCAL_PI * a2 * pow2 ( w2 );\n	}\n#endif\n#ifdef USE_CLEARCOAT\n	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {\n		vec3 f0 = material.clearcoatF0;\n		float f90 = material.clearcoatF90;\n		float roughness = material.clearcoatRoughness;\n		float alpha = pow2( roughness );\n		vec3 halfDir = normalize( lightDir + viewDir );\n		float dotNL = saturate( dot( normal, lightDir ) );\n		float dotNV = saturate( dot( normal, viewDir ) );\n		float dotNH = saturate( dot( normal, halfDir ) );\n		float dotVH = saturate( dot( viewDir, halfDir ) );\n		vec3 F = F_Schlick( f0, f90, dotVH );\n		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );\n		float D = D_GGX( alpha, dotNH );\n		return F * ( V * D );\n	}\n#endif\nvec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {\n	vec3 f0 = material.specularColorBlended;\n	float f90 = material.specularF90;\n	float roughness = material.roughness;\n	float alpha = pow2( roughness );\n	vec3 halfDir = normalize( lightDir + viewDir );\n	float dotNL = saturate( dot( normal, lightDir ) );\n	float dotNV = saturate( dot( normal, viewDir ) );\n	float dotNH = saturate( dot( normal, halfDir ) );\n	float dotVH = saturate( dot( viewDir, halfDir ) );\n	vec3 F = F_Schlick( f0, f90, dotVH );\n	#ifdef USE_IRIDESCENCE\n		F = mix( F, material.iridescenceFresnel, material.iridescence );\n	#endif\n	#ifdef USE_ANISOTROPY\n		float dotTL = dot( material.anisotropyT, lightDir );\n		float dotTV = dot( material.anisotropyT, viewDir );\n		float dotTH = dot( material.anisotropyT, halfDir );\n		float dotBL = dot( material.anisotropyB, lightDir );\n		float dotBV = dot( material.anisotropyB, viewDir );\n		float dotBH = dot( material.anisotropyB, halfDir );\n		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );\n		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );\n	#else\n		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );\n		float D = D_GGX( alpha, dotNH );\n	#endif\n	return F * ( V * D );\n}\nvec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {\n	const float LUT_SIZE = 64.0;\n	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;\n	const float LUT_BIAS = 0.5 / LUT_SIZE;\n	float dotNV = saturate( dot( N, V ) );\n	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );\n	uv = uv * LUT_SCALE + LUT_BIAS;\n	return uv;\n}\nfloat LTC_ClippedSphereFormFactor( const in vec3 f ) {\n	float l = length( f );\n	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );\n}\nvec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {\n	float x = dot( v1, v2 );\n	float y = abs( x );\n	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;\n	float b = 3.4175940 + ( 4.1616724 + y ) * y;\n	float v = a / b;\n	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;\n	return cross( v1, v2 ) * theta_sintheta;\n}\nvec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {\n	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];\n	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];\n	vec3 lightNormal = cross( v1, v2 );\n	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );\n	vec3 T1, T2;\n	T1 = normalize( V - N * dot( V, N ) );\n	T2 = - cross( N, T1 );\n	mat3 mat = mInv * transpose( mat3( T1, T2, N ) );\n	vec3 coords[ 4 ];\n	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );\n	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );\n	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );\n	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );\n	coords[ 0 ] = normalize( coords[ 0 ] );\n	coords[ 1 ] = normalize( coords[ 1 ] );\n	coords[ 2 ] = normalize( coords[ 2 ] );\n	coords[ 3 ] = normalize( coords[ 3 ] );\n	vec3 vectorFormFactor = vec3( 0.0 );\n	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );\n	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );\n	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );\n	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );\n	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );\n	return vec3( result );\n}\n#if defined( USE_SHEEN )\nfloat D_Charlie( float roughness, float dotNH ) {\n	float alpha = pow2( roughness );\n	float invAlpha = 1.0 / alpha;\n	float cos2h = dotNH * dotNH;\n	float sin2h = max( 1.0 - cos2h, 0.0078125 );\n	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );\n}\nfloat V_Neubelt( float dotNV, float dotNL ) {\n	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );\n}\nvec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {\n	vec3 halfDir = normalize( lightDir + viewDir );\n	float dotNL = saturate( dot( normal, lightDir ) );\n	float dotNV = saturate( dot( normal, viewDir ) );\n	float dotNH = saturate( dot( normal, halfDir ) );\n	float D = D_Charlie( sheenRoughness, dotNH );\n	float V = V_Neubelt( dotNV, dotNL );\n	return sheenColor * ( D * V );\n}\n#endif\nfloat IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {\n	float dotNV = saturate( dot( normal, viewDir ) );\n	float r2 = roughness * roughness;\n	float rInv = 1.0 / ( roughness + 0.1 );\n	float a = -1.9362 + 1.0678 * roughness + 0.4573 * r2 - 0.8469 * rInv;\n	float b = -0.6014 + 0.5538 * roughness - 0.4670 * r2 - 0.1255 * rInv;\n	float DG = exp( a * dotNV + b );\n	return saturate( DG );\n}\nvec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {\n	float dotNV = saturate( dot( normal, viewDir ) );\n	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;\n	return specularColor * fab.x + specularF90 * fab.y;\n}\n#ifdef USE_IRIDESCENCE\nvoid computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {\n#else\nvoid computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {\n#endif\n	float dotNV = saturate( dot( normal, viewDir ) );\n	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;\n	#ifdef USE_IRIDESCENCE\n		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );\n	#else\n		vec3 Fr = specularColor;\n	#endif\n	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;\n	float Ess = fab.x + fab.y;\n	float Ems = 1.0 - Ess;\n	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );\n	singleScatter += FssEss;\n	multiScatter += Fms * Ems;\n}\nvec3 BRDF_GGX_Multiscatter( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {\n	vec3 singleScatter = BRDF_GGX( lightDir, viewDir, normal, material );\n	float dotNL = saturate( dot( normal, lightDir ) );\n	float dotNV = saturate( dot( normal, viewDir ) );\n	vec2 dfgV = texture2D( dfgLUT, vec2( material.roughness, dotNV ) ).rg;\n	vec2 dfgL = texture2D( dfgLUT, vec2( material.roughness, dotNL ) ).rg;\n	vec3 FssEss_V = material.specularColorBlended * dfgV.x + material.specularF90 * dfgV.y;\n	vec3 FssEss_L = material.specularColorBlended * dfgL.x + material.specularF90 * dfgL.y;\n	float Ess_V = dfgV.x + dfgV.y;\n	float Ess_L = dfgL.x + dfgL.y;\n	float Ems_V = 1.0 - Ess_V;\n	float Ems_L = 1.0 - Ess_L;\n	vec3 Favg = material.specularColorBlended + ( 1.0 - material.specularColorBlended ) * 0.047619;\n	vec3 Fms = FssEss_V * FssEss_L * Favg / ( 1.0 - Ems_V * Ems_L * Favg + EPSILON );\n	float compensationFactor = Ems_V * Ems_L;\n	vec3 multiScatter = Fms * compensationFactor;\n	return singleScatter + multiScatter;\n}\n#if NUM_RECT_AREA_LIGHTS > 0\n	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {\n		vec3 normal = geometryNormal;\n		vec3 viewDir = geometryViewDir;\n		vec3 position = geometryPosition;\n		vec3 lightPos = rectAreaLight.position;\n		vec3 halfWidth = rectAreaLight.halfWidth;\n		vec3 halfHeight = rectAreaLight.halfHeight;\n		vec3 lightColor = rectAreaLight.color;\n		float roughness = material.roughness;\n		vec3 rectCoords[ 4 ];\n		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;\n		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;\n		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;\n		vec2 uv = LTC_Uv( normal, viewDir, roughness );\n		vec4 t1 = texture2D( ltc_1, uv );\n		vec4 t2 = texture2D( ltc_2, uv );\n		mat3 mInv = mat3(\n			vec3( t1.x, 0, t1.y ),\n			vec3(    0, 1,    0 ),\n			vec3( t1.z, 0, t1.w )\n		);\n		vec3 fresnel = ( material.specularColorBlended * t2.x + ( material.specularF90 - material.specularColorBlended ) * t2.y );\n		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );\n		reflectedLight.directDiffuse += lightColor * material.diffuseContribution * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );\n		#ifdef USE_CLEARCOAT\n			vec3 Ncc = geometryClearcoatNormal;\n			vec2 uvClearcoat = LTC_Uv( Ncc, viewDir, material.clearcoatRoughness );\n			vec4 t1Clearcoat = texture2D( ltc_1, uvClearcoat );\n			vec4 t2Clearcoat = texture2D( ltc_2, uvClearcoat );\n			mat3 mInvClearcoat = mat3(\n				vec3( t1Clearcoat.x, 0, t1Clearcoat.y ),\n				vec3(             0, 1,             0 ),\n				vec3( t1Clearcoat.z, 0, t1Clearcoat.w )\n			);\n			vec3 fresnelClearcoat = material.clearcoatF0 * t2Clearcoat.x + ( material.clearcoatF90 - material.clearcoatF0 ) * t2Clearcoat.y;\n			clearcoatSpecularDirect += lightColor * fresnelClearcoat * LTC_Evaluate( Ncc, viewDir, position, mInvClearcoat, rectCoords );\n		#endif\n	}\n#endif\nvoid RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {\n	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );\n	vec3 irradiance = dotNL * directLight.color;\n	#ifdef USE_CLEARCOAT\n		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );\n		vec3 ccIrradiance = dotNLcc * directLight.color;\n		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );\n	#endif\n	#ifdef USE_SHEEN\n \n 		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );\n \n 		float sheenAlbedoV = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );\n 		float sheenAlbedoL = IBLSheenBRDF( geometryNormal, directLight.direction, material.sheenRoughness );\n \n 		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * max( sheenAlbedoV, sheenAlbedoL );\n \n 		irradiance *= sheenEnergyComp;\n \n 	#endif\n	reflectedLight.directSpecular += irradiance * BRDF_GGX_Multiscatter( directLight.direction, geometryViewDir, geometryNormal, material );\n	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseContribution );\n}\nvoid RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {\n	vec3 diffuse = irradiance * BRDF_Lambert( material.diffuseContribution );\n	#ifdef USE_SHEEN\n		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );\n		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;\n		diffuse *= sheenEnergyComp;\n	#endif\n	reflectedLight.indirectDiffuse += diffuse;\n}\nvoid RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {\n	#ifdef USE_CLEARCOAT\n		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );\n	#endif\n	#ifdef USE_SHEEN\n		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness ) * RECIPROCAL_PI;\n 	#endif\n	vec3 singleScatteringDielectric = vec3( 0.0 );\n	vec3 multiScatteringDielectric = vec3( 0.0 );\n	vec3 singleScatteringMetallic = vec3( 0.0 );\n	vec3 multiScatteringMetallic = vec3( 0.0 );\n	#ifdef USE_IRIDESCENCE\n		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnelDielectric, material.roughness, singleScatteringDielectric, multiScatteringDielectric );\n		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.diffuseColor, material.specularF90, material.iridescence, material.iridescenceFresnelMetallic, material.roughness, singleScatteringMetallic, multiScatteringMetallic );\n	#else\n		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScatteringDielectric, multiScatteringDielectric );\n		computeMultiscattering( geometryNormal, geometryViewDir, material.diffuseColor, material.specularF90, material.roughness, singleScatteringMetallic, multiScatteringMetallic );\n	#endif\n	vec3 singleScattering = mix( singleScatteringDielectric, singleScatteringMetallic, material.metalness );\n	vec3 multiScattering = mix( multiScatteringDielectric, multiScatteringMetallic, material.metalness );\n	vec3 totalScatteringDielectric = singleScatteringDielectric + multiScatteringDielectric;\n	vec3 diffuse = material.diffuseContribution * ( 1.0 - totalScatteringDielectric );\n	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;\n	vec3 indirectSpecular = radiance * singleScattering;\n	indirectSpecular += multiScattering * cosineWeightedIrradiance;\n	vec3 indirectDiffuse = diffuse * cosineWeightedIrradiance;\n	#ifdef USE_SHEEN\n		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );\n		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;\n		indirectSpecular *= sheenEnergyComp;\n		indirectDiffuse *= sheenEnergyComp;\n	#endif\n	reflectedLight.indirectSpecular += indirectSpecular;\n	reflectedLight.indirectDiffuse += indirectDiffuse;\n}\n#define RE_Direct				RE_Direct_Physical\n#define RE_Direct_RectArea		RE_Direct_RectArea_Physical\n#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical\n#define RE_IndirectSpecular		RE_IndirectSpecular_Physical\nfloat computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {\n	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );\n}",
		lights_fragment_begin: "\nvec3 geometryPosition = - vViewPosition;\nvec3 geometryNormal = normal;\nvec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );\nvec3 geometryClearcoatNormal = vec3( 0.0 );\n#ifdef USE_CLEARCOAT\n	geometryClearcoatNormal = clearcoatNormal;\n#endif\n#ifdef USE_IRIDESCENCE\n	float dotNVi = saturate( dot( normal, geometryViewDir ) );\n	if ( material.iridescenceThickness == 0.0 ) {\n		material.iridescence = 0.0;\n	} else {\n		material.iridescence = saturate( material.iridescence );\n	}\n	if ( material.iridescence > 0.0 ) {\n		material.iridescenceFresnelDielectric = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );\n		material.iridescenceFresnelMetallic = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.diffuseColor );\n		material.iridescenceFresnel = mix( material.iridescenceFresnelDielectric, material.iridescenceFresnelMetallic, material.metalness );\n		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );\n	}\n#endif\nIncidentLight directLight;\n#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )\n	PointLight pointLight;\n	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0\n	PointLightShadow pointLightShadow;\n	#endif\n	#pragma unroll_loop_start\n	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {\n		pointLight = pointLights[ i ];\n		getPointLightInfo( pointLight, geometryPosition, directLight );\n		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS ) && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )\n		pointLightShadow = pointLightShadows[ i ];\n		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;\n		#endif\n		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );\n	}\n	#pragma unroll_loop_end\n#endif\n#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )\n	SpotLight spotLight;\n	vec4 spotColor;\n	vec3 spotLightCoord;\n	bool inSpotLightMap;\n	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0\n	SpotLightShadow spotLightShadow;\n	#endif\n	#pragma unroll_loop_start\n	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {\n		spotLight = spotLights[ i ];\n		getSpotLightInfo( spotLight, geometryPosition, directLight );\n		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )\n		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX\n		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )\n		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS\n		#else\n		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )\n		#endif\n		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )\n			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;\n			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );\n			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );\n			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;\n		#endif\n		#undef SPOT_LIGHT_MAP_INDEX\n		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )\n		spotLightShadow = spotLightShadows[ i ];\n		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;\n		#endif\n		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );\n	}\n	#pragma unroll_loop_end\n#endif\n#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )\n	DirectionalLight directionalLight;\n	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0\n	DirectionalLightShadow directionalLightShadow;\n	#endif\n	#pragma unroll_loop_start\n	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {\n		directionalLight = directionalLights[ i ];\n		getDirectionalLightInfo( directionalLight, directLight );\n		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )\n		directionalLightShadow = directionalLightShadows[ i ];\n		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;\n		#endif\n		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );\n	}\n	#pragma unroll_loop_end\n#endif\n#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )\n	RectAreaLight rectAreaLight;\n	#pragma unroll_loop_start\n	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {\n		rectAreaLight = rectAreaLights[ i ];\n		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );\n	}\n	#pragma unroll_loop_end\n#endif\n#if defined( RE_IndirectDiffuse )\n	vec3 iblIrradiance = vec3( 0.0 );\n	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );\n	#if defined( USE_LIGHT_PROBES )\n		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );\n	#endif\n	#if ( NUM_HEMI_LIGHTS > 0 )\n		#pragma unroll_loop_start\n		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {\n			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );\n		}\n		#pragma unroll_loop_end\n	#endif\n	#ifdef USE_LIGHT_PROBES_GRID\n		vec3 probeWorldPos = ( ( vec4( geometryPosition, 1.0 ) - viewMatrix[ 3 ] ) * viewMatrix ).xyz;\n		vec3 probeWorldNormal = transformNormalByInverseViewMatrix( geometryNormal, viewMatrix );\n		irradiance += getLightProbeGridIrradiance( probeWorldPos, probeWorldNormal );\n	#endif\n#endif\n#if defined( RE_IndirectSpecular )\n	vec3 radiance = vec3( 0.0 );\n	vec3 clearcoatRadiance = vec3( 0.0 );\n#endif",
		lights_fragment_maps: "#if defined( RE_IndirectDiffuse )\n	#ifdef USE_LIGHTMAP\n		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );\n		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;\n		irradiance += lightMapIrradiance;\n	#endif\n	#if defined( USE_ENVMAP ) && defined( ENVMAP_TYPE_CUBE_UV )\n		#if defined( STANDARD ) || defined( LAMBERT ) || defined( PHONG )\n			iblIrradiance += getIBLIrradiance( geometryNormal );\n		#endif\n	#endif\n#endif\n#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )\n	#ifdef USE_ANISOTROPY\n		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );\n	#else\n		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );\n	#endif\n	#ifdef USE_CLEARCOAT\n		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );\n	#endif\n#endif",
		lights_fragment_end: "#if defined( RE_IndirectDiffuse )\n	#if defined( LAMBERT ) || defined( PHONG )\n		irradiance += iblIrradiance;\n	#endif\n	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );\n#endif\n#if defined( RE_IndirectSpecular )\n	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );\n#endif",
		lightprobes_pars_fragment: "#ifdef USE_LIGHT_PROBES_GRID\nuniform highp sampler3D probesSH;\nuniform vec3 probesMin;\nuniform vec3 probesMax;\nuniform vec3 probesResolution;\nvec3 getLightProbeGridIrradiance( vec3 worldPos, vec3 worldNormal ) {\n	vec3 res = probesResolution;\n	vec3 gridRange = probesMax - probesMin;\n	vec3 resMinusOne = res - 1.0;\n	vec3 probeSpacing = gridRange / resMinusOne;\n	vec3 samplePos = worldPos + worldNormal * probeSpacing * 0.5;\n	vec3 uvw = clamp( ( samplePos - probesMin ) / gridRange, 0.0, 1.0 );\n	uvw = uvw * resMinusOne / res + 0.5 / res;\n	float nz          = res.z;\n	float paddedSlices = nz + 2.0;\n	float atlasDepth  = 7.0 * paddedSlices;\n	float uvZBase     = uvw.z * nz + 1.0;\n	vec4 s0 = texture( probesSH, vec3( uvw.xy, ( uvZBase                       ) / atlasDepth ) );\n	vec4 s1 = texture( probesSH, vec3( uvw.xy, ( uvZBase +       paddedSlices   ) / atlasDepth ) );\n	vec4 s2 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 2.0 * paddedSlices   ) / atlasDepth ) );\n	vec4 s3 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 3.0 * paddedSlices   ) / atlasDepth ) );\n	vec4 s4 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 4.0 * paddedSlices   ) / atlasDepth ) );\n	vec4 s5 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 5.0 * paddedSlices   ) / atlasDepth ) );\n	vec4 s6 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 6.0 * paddedSlices   ) / atlasDepth ) );\n	vec3 c0 = s0.xyz;\n	vec3 c1 = vec3( s0.w, s1.xy );\n	vec3 c2 = vec3( s1.zw, s2.x );\n	vec3 c3 = s2.yzw;\n	vec3 c4 = s3.xyz;\n	vec3 c5 = vec3( s3.w, s4.xy );\n	vec3 c6 = vec3( s4.zw, s5.x );\n	vec3 c7 = s5.yzw;\n	vec3 c8 = s6.xyz;\n	float x = worldNormal.x, y = worldNormal.y, z = worldNormal.z;\n	vec3 result = c0 * 0.886227;\n	result += c1 * 2.0 * 0.511664 * y;\n	result += c2 * 2.0 * 0.511664 * z;\n	result += c3 * 2.0 * 0.511664 * x;\n	result += c4 * 2.0 * 0.429043 * x * y;\n	result += c5 * 2.0 * 0.429043 * y * z;\n	result += c6 * ( 0.743125 * z * z - 0.247708 );\n	result += c7 * 2.0 * 0.429043 * x * z;\n	result += c8 * 0.429043 * ( x * x - y * y );\n	return max( result, vec3( 0.0 ) );\n}\n#endif",
		logdepthbuf_fragment: "#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )\n	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;\n#endif",
		logdepthbuf_pars_fragment: "#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )\n	uniform float logDepthBufFC;\n	varying float vFragDepth;\n	varying float vIsPerspective;\n#endif",
		logdepthbuf_pars_vertex: "#ifdef USE_LOGARITHMIC_DEPTH_BUFFER\n	varying float vFragDepth;\n	varying float vIsPerspective;\n#endif",
		logdepthbuf_vertex: "#ifdef USE_LOGARITHMIC_DEPTH_BUFFER\n	vFragDepth = 1.0 + gl_Position.w;\n	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );\n#endif",
		map_fragment: "#ifdef USE_MAP\n	vec4 sampledDiffuseColor = texture2D( map, vMapUv );\n	#ifdef DECODE_VIDEO_TEXTURE\n		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );\n	#endif\n	diffuseColor *= sampledDiffuseColor;\n#endif",
		map_pars_fragment: "#ifdef USE_MAP\n	uniform sampler2D map;\n#endif",
		map_particle_fragment: "#if defined( USE_MAP ) || defined( USE_ALPHAMAP )\n	#if defined( USE_POINTS_UV )\n		vec2 uv = vUv;\n	#else\n		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;\n	#endif\n#endif\n#ifdef USE_MAP\n	diffuseColor *= texture2D( map, uv );\n#endif\n#ifdef USE_ALPHAMAP\n	diffuseColor.a *= texture2D( alphaMap, uv ).g;\n#endif",
		map_particle_pars_fragment: "#if defined( USE_POINTS_UV )\n	varying vec2 vUv;\n#else\n	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )\n		uniform mat3 uvTransform;\n	#endif\n#endif\n#ifdef USE_MAP\n	uniform sampler2D map;\n#endif\n#ifdef USE_ALPHAMAP\n	uniform sampler2D alphaMap;\n#endif",
		metalnessmap_fragment: "float metalnessFactor = metalness;\n#ifdef USE_METALNESSMAP\n	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );\n	metalnessFactor *= texelMetalness.b;\n#endif",
		metalnessmap_pars_fragment: "#ifdef USE_METALNESSMAP\n	uniform sampler2D metalnessMap;\n#endif",
		morphinstance_vertex: "#ifdef USE_INSTANCING_MORPH\n	float morphTargetInfluences[ MORPHTARGETS_COUNT ];\n	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;\n	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {\n		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;\n	}\n#endif",
		morphcolor_vertex: "#if defined( USE_MORPHCOLORS )\n	vColor *= morphTargetBaseInfluence;\n	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {\n		#if defined( USE_COLOR_ALPHA )\n			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];\n		#elif defined( USE_COLOR )\n			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];\n		#endif\n	}\n#endif",
		morphnormal_vertex: "#ifdef USE_MORPHNORMALS\n	objectNormal *= morphTargetBaseInfluence;\n	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {\n		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];\n	}\n#endif",
		morphtarget_pars_vertex: "#ifdef USE_MORPHTARGETS\n	#ifndef USE_INSTANCING_MORPH\n		uniform float morphTargetBaseInfluence;\n		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];\n	#endif\n	uniform sampler2DArray morphTargetsTexture;\n	uniform ivec2 morphTargetsTextureSize;\n	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {\n		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;\n		int y = texelIndex / morphTargetsTextureSize.x;\n		int x = texelIndex - y * morphTargetsTextureSize.x;\n		ivec3 morphUV = ivec3( x, y, morphTargetIndex );\n		return texelFetch( morphTargetsTexture, morphUV, 0 );\n	}\n#endif",
		morphtarget_vertex: "#ifdef USE_MORPHTARGETS\n	transformed *= morphTargetBaseInfluence;\n	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {\n		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];\n	}\n#endif",
		normal_fragment_begin: "float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;\n#ifdef FLAT_SHADED\n	vec3 fdx = dFdx( vViewPosition );\n	vec3 fdy = dFdy( vViewPosition );\n	vec3 normal = normalize( cross( fdx, fdy ) );\n#else\n	vec3 normal = normalize( vNormal );\n	#ifdef DOUBLE_SIDED\n		normal *= faceDirection;\n	#endif\n#endif\n#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )\n	#ifdef USE_TANGENT\n		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );\n	#else\n		mat3 tbn = getTangentFrame( - vViewPosition, normal,\n		#if defined( USE_NORMALMAP )\n			vNormalMapUv\n		#elif defined( USE_CLEARCOAT_NORMALMAP )\n			vClearcoatNormalMapUv\n		#else\n			vUv\n		#endif\n		);\n	#endif\n	#ifdef DOUBLE_SIDED\n		tbn[0] *= faceDirection;\n		tbn[1] *= faceDirection;\n	#endif\n#endif\n#ifdef USE_CLEARCOAT_NORMALMAP\n	#ifdef USE_TANGENT\n		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );\n	#else\n		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );\n	#endif\n	#ifdef DOUBLE_SIDED\n		tbn2[0] *= faceDirection;\n		tbn2[1] *= faceDirection;\n	#endif\n#endif\nvec3 nonPerturbedNormal = normal;",
		normal_fragment_maps: "#ifdef USE_NORMALMAP_OBJECTSPACE\n	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;\n	#ifdef FLIP_SIDED\n		normal = - normal;\n	#endif\n	#ifdef DOUBLE_SIDED\n		normal = normal * faceDirection;\n	#endif\n	normal = normalize( normalMatrix * normal );\n#elif defined( USE_NORMALMAP_TANGENTSPACE )\n	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;\n	#if defined( USE_PACKED_NORMALMAP )\n		mapN = vec3( mapN.xy, sqrt( saturate( 1.0 - dot( mapN.xy, mapN.xy ) ) ) );\n	#endif\n	mapN.xy *= normalScale;\n	normal = normalize( tbn * mapN );\n#elif defined( USE_BUMPMAP )\n	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );\n#endif",
		normal_pars_fragment: "#ifndef FLAT_SHADED\n	varying vec3 vNormal;\n	#ifdef USE_TANGENT\n		varying vec3 vTangent;\n		varying vec3 vBitangent;\n	#endif\n#endif",
		normal_pars_vertex: "#ifndef FLAT_SHADED\n	varying vec3 vNormal;\n	#ifdef USE_TANGENT\n		varying vec3 vTangent;\n		varying vec3 vBitangent;\n	#endif\n#endif",
		normal_vertex: "#ifndef FLAT_SHADED\n	vNormal = normalize( transformedNormal );\n	#ifdef USE_TANGENT\n		vTangent = normalize( transformedTangent );\n		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );\n		#ifdef FLIP_SIDED\n			vBitangent = - vBitangent;\n		#endif\n	#endif\n#endif",
		normalmap_pars_fragment: "#ifdef USE_NORMALMAP\n	uniform sampler2D normalMap;\n	uniform vec2 normalScale;\n#endif\n#ifdef USE_NORMALMAP_OBJECTSPACE\n	uniform mat3 normalMatrix;\n#endif\n#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )\n	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {\n		vec3 q0 = dFdx( eye_pos.xyz );\n		vec3 q1 = dFdy( eye_pos.xyz );\n		vec2 st0 = dFdx( uv.st );\n		vec2 st1 = dFdy( uv.st );\n		vec3 N = surf_norm;\n		vec3 q1perp = cross( q1, N );\n		vec3 q0perp = cross( N, q0 );\n		vec3 T = q1perp * st0.x + q0perp * st1.x;\n		vec3 B = q1perp * st0.y + q0perp * st1.y;\n		float det = max( dot( T, T ), dot( B, B ) );\n		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );\n		return mat3( T * scale, B * scale, N );\n	}\n#endif",
		clearcoat_normal_fragment_begin: "#ifdef USE_CLEARCOAT\n	vec3 clearcoatNormal = nonPerturbedNormal;\n#endif",
		clearcoat_normal_fragment_maps: "#ifdef USE_CLEARCOAT_NORMALMAP\n	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;\n	clearcoatMapN.xy *= clearcoatNormalScale;\n	clearcoatNormal = normalize( tbn2 * clearcoatMapN );\n#endif",
		clearcoat_pars_fragment: "#ifdef USE_CLEARCOATMAP\n	uniform sampler2D clearcoatMap;\n#endif\n#ifdef USE_CLEARCOAT_NORMALMAP\n	uniform sampler2D clearcoatNormalMap;\n	uniform vec2 clearcoatNormalScale;\n#endif\n#ifdef USE_CLEARCOAT_ROUGHNESSMAP\n	uniform sampler2D clearcoatRoughnessMap;\n#endif",
		iridescence_pars_fragment: "#ifdef USE_IRIDESCENCEMAP\n	uniform sampler2D iridescenceMap;\n#endif\n#ifdef USE_IRIDESCENCE_THICKNESSMAP\n	uniform sampler2D iridescenceThicknessMap;\n#endif",
		opaque_fragment: "#ifdef OPAQUE\ndiffuseColor.a = 1.0;\n#endif\n#ifdef USE_TRANSMISSION\ndiffuseColor.a *= material.transmissionAlpha;\n#endif\ngl_FragColor = vec4( outgoingLight, diffuseColor.a );",
		packing: "vec3 packNormalToRGB( const in vec3 normal ) {\n	return normalize( normal ) * 0.5 + 0.5;\n}\nvec3 unpackRGBToNormal( const in vec3 rgb ) {\n	return 2.0 * rgb.xyz - 1.0;\n}\nconst float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;\nconst float Inv255 = 1. / 255.;\nconst vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );\nconst vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );\nconst vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );\nconst vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );\nvec4 packDepthToRGBA( const in float v ) {\n	if( v <= 0.0 )\n		return vec4( 0., 0., 0., 0. );\n	if( v >= 1.0 )\n		return vec4( 1., 1., 1., 1. );\n	float vuf;\n	float af = modf( v * PackFactors.a, vuf );\n	float bf = modf( vuf * ShiftRight8, vuf );\n	float gf = modf( vuf * ShiftRight8, vuf );\n	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );\n}\nvec3 packDepthToRGB( const in float v ) {\n	if( v <= 0.0 )\n		return vec3( 0., 0., 0. );\n	if( v >= 1.0 )\n		return vec3( 1., 1., 1. );\n	float vuf;\n	float bf = modf( v * PackFactors.b, vuf );\n	float gf = modf( vuf * ShiftRight8, vuf );\n	return vec3( vuf * Inv255, gf * PackUpscale, bf );\n}\nvec2 packDepthToRG( const in float v ) {\n	if( v <= 0.0 )\n		return vec2( 0., 0. );\n	if( v >= 1.0 )\n		return vec2( 1., 1. );\n	float vuf;\n	float gf = modf( v * 256., vuf );\n	return vec2( vuf * Inv255, gf );\n}\nfloat unpackRGBAToDepth( const in vec4 v ) {\n	return dot( v, UnpackFactors4 );\n}\nfloat unpackRGBToDepth( const in vec3 v ) {\n	return dot( v, UnpackFactors3 );\n}\nfloat unpackRGToDepth( const in vec2 v ) {\n	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;\n}\nvec4 pack2HalfToRGBA( const in vec2 v ) {\n	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );\n	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );\n}\nvec2 unpackRGBATo2Half( const in vec4 v ) {\n	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );\n}\nfloat viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {\n	return ( viewZ + near ) / ( near - far );\n}\nfloat orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {\n	#ifdef USE_REVERSED_DEPTH_BUFFER\n	\n		return depth * ( far - near ) - far;\n	#else\n		return depth * ( near - far ) - near;\n	#endif\n}\nfloat viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {\n	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );\n}\nfloat perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {\n	\n	#ifdef USE_REVERSED_DEPTH_BUFFER\n		return ( near * far ) / ( ( near - far ) * depth - near );\n	#else\n		return ( near * far ) / ( ( far - near ) * depth - far );\n	#endif\n}",
		premultiplied_alpha_fragment: "#ifdef PREMULTIPLIED_ALPHA\n	gl_FragColor.rgb *= gl_FragColor.a;\n#endif",
		project_vertex: "vec4 mvPosition = vec4( transformed, 1.0 );\n#ifdef USE_BATCHING\n	mvPosition = batchingMatrix * mvPosition;\n#endif\n#ifdef USE_INSTANCING\n	mvPosition = instanceMatrix * mvPosition;\n#endif\nmvPosition = modelViewMatrix * mvPosition;\ngl_Position = projectionMatrix * mvPosition;",
		dithering_fragment: "#ifdef DITHERING\n	gl_FragColor.rgb = dithering( gl_FragColor.rgb );\n#endif",
		dithering_pars_fragment: "#ifdef DITHERING\n	vec3 dithering( vec3 color ) {\n		float grid_position = rand( gl_FragCoord.xy );\n		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );\n		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );\n		return color + dither_shift_RGB;\n	}\n#endif",
		roughnessmap_fragment: "float roughnessFactor = roughness;\n#ifdef USE_ROUGHNESSMAP\n	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );\n	roughnessFactor *= texelRoughness.g;\n#endif",
		roughnessmap_pars_fragment: "#ifdef USE_ROUGHNESSMAP\n	uniform sampler2D roughnessMap;\n#endif",
		shadowmap_pars_fragment: "#if NUM_SPOT_LIGHT_COORDS > 0\n	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];\n#endif\n#if NUM_SPOT_LIGHT_MAPS > 0\n	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];\n#endif\n#ifdef USE_SHADOWMAP\n	#if NUM_DIR_LIGHT_SHADOWS > 0\n		#if defined( SHADOWMAP_TYPE_PCF )\n			uniform sampler2DShadow directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];\n		#else\n			uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];\n		#endif\n		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];\n		struct DirectionalLightShadow {\n			float shadowIntensity;\n			float shadowBias;\n			float shadowNormalBias;\n			float shadowRadius;\n			vec2 shadowMapSize;\n		};\n		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];\n	#endif\n	#if NUM_SPOT_LIGHT_SHADOWS > 0\n		#if defined( SHADOWMAP_TYPE_PCF )\n			uniform sampler2DShadow spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];\n		#else\n			uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];\n		#endif\n		struct SpotLightShadow {\n			float shadowIntensity;\n			float shadowBias;\n			float shadowNormalBias;\n			float shadowRadius;\n			vec2 shadowMapSize;\n		};\n		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];\n	#endif\n	#if NUM_POINT_LIGHT_SHADOWS > 0\n		#if defined( SHADOWMAP_TYPE_PCF )\n			uniform samplerCubeShadow pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];\n		#elif defined( SHADOWMAP_TYPE_BASIC )\n			uniform samplerCube pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];\n		#endif\n		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];\n		struct PointLightShadow {\n			float shadowIntensity;\n			float shadowBias;\n			float shadowNormalBias;\n			float shadowRadius;\n			vec2 shadowMapSize;\n			float shadowCameraNear;\n			float shadowCameraFar;\n		};\n		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];\n	#endif\n	#if defined( SHADOWMAP_TYPE_PCF )\n		float interleavedGradientNoise( vec2 position ) {\n			return fract( 52.9829189 * fract( dot( position, vec2( 0.06711056, 0.00583715 ) ) ) );\n		}\n		vec2 vogelDiskSample( int sampleIndex, int samplesCount, float phi ) {\n			const float goldenAngle = 2.399963229728653;\n			float r = sqrt( ( float( sampleIndex ) + 0.5 ) / float( samplesCount ) );\n			float theta = float( sampleIndex ) * goldenAngle + phi;\n			return vec2( cos( theta ), sin( theta ) ) * r;\n		}\n	#endif\n	#if defined( SHADOWMAP_TYPE_PCF )\n		float getShadow( sampler2DShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {\n			float shadow = 1.0;\n			shadowCoord.xyz /= shadowCoord.w;\n			shadowCoord.z += shadowBias;\n			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;\n			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;\n			if ( frustumTest ) {\n				vec2 texelSize = vec2( 1.0 ) / shadowMapSize;\n				float radius = shadowRadius * texelSize.x;\n				float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;\n				shadow = (\n					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 0, 5, phi ) * radius, shadowCoord.z ) ) +\n					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 1, 5, phi ) * radius, shadowCoord.z ) ) +\n					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 2, 5, phi ) * radius, shadowCoord.z ) ) +\n					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 3, 5, phi ) * radius, shadowCoord.z ) ) +\n					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 4, 5, phi ) * radius, shadowCoord.z ) )\n				) * 0.2;\n			}\n			return mix( 1.0, shadow, shadowIntensity );\n		}\n	#elif defined( SHADOWMAP_TYPE_VSM )\n		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {\n			float shadow = 1.0;\n			shadowCoord.xyz /= shadowCoord.w;\n			#ifdef USE_REVERSED_DEPTH_BUFFER\n				shadowCoord.z -= shadowBias;\n			#else\n				shadowCoord.z += shadowBias;\n			#endif\n			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;\n			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;\n			if ( frustumTest ) {\n				vec2 distribution = texture2D( shadowMap, shadowCoord.xy ).rg;\n				float mean = distribution.x;\n				float variance = distribution.y * distribution.y;\n				#ifdef USE_REVERSED_DEPTH_BUFFER\n					float hard_shadow = step( mean, shadowCoord.z );\n				#else\n					float hard_shadow = step( shadowCoord.z, mean );\n				#endif\n				\n				if ( hard_shadow == 1.0 ) {\n					shadow = 1.0;\n				} else {\n					variance = max( variance, 0.0000001 );\n					float d = shadowCoord.z - mean;\n					float p_max = variance / ( variance + d * d );\n					p_max = clamp( ( p_max - 0.3 ) / 0.65, 0.0, 1.0 );\n					shadow = max( hard_shadow, p_max );\n				}\n			}\n			return mix( 1.0, shadow, shadowIntensity );\n		}\n	#else\n		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {\n			float shadow = 1.0;\n			shadowCoord.xyz /= shadowCoord.w;\n			#ifdef USE_REVERSED_DEPTH_BUFFER\n				shadowCoord.z -= shadowBias;\n			#else\n				shadowCoord.z += shadowBias;\n			#endif\n			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;\n			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;\n			if ( frustumTest ) {\n				float depth = texture2D( shadowMap, shadowCoord.xy ).r;\n				#ifdef USE_REVERSED_DEPTH_BUFFER\n					shadow = step( depth, shadowCoord.z );\n				#else\n					shadow = step( shadowCoord.z, depth );\n				#endif\n			}\n			return mix( 1.0, shadow, shadowIntensity );\n		}\n	#endif\n	#if NUM_POINT_LIGHT_SHADOWS > 0\n	#if defined( SHADOWMAP_TYPE_PCF )\n	float getPointShadow( samplerCubeShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {\n		float shadow = 1.0;\n		vec3 lightToPosition = shadowCoord.xyz;\n		vec3 bd3D = normalize( lightToPosition );\n		vec3 absVec = abs( lightToPosition );\n		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );\n		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {\n			#ifdef USE_REVERSED_DEPTH_BUFFER\n				float dp = ( shadowCameraNear * ( shadowCameraFar - viewSpaceZ ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );\n				dp -= shadowBias;\n			#else\n				float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );\n				dp += shadowBias;\n			#endif\n			float texelSize = shadowRadius / shadowMapSize.x;\n			vec3 absDir = abs( bd3D );\n			vec3 tangent = absDir.x > absDir.z ? vec3( 0.0, 1.0, 0.0 ) : vec3( 1.0, 0.0, 0.0 );\n			tangent = normalize( cross( bd3D, tangent ) );\n			vec3 bitangent = cross( bd3D, tangent );\n			float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;\n			vec2 sample0 = vogelDiskSample( 0, 5, phi );\n			vec2 sample1 = vogelDiskSample( 1, 5, phi );\n			vec2 sample2 = vogelDiskSample( 2, 5, phi );\n			vec2 sample3 = vogelDiskSample( 3, 5, phi );\n			vec2 sample4 = vogelDiskSample( 4, 5, phi );\n			shadow = (\n				texture( shadowMap, vec4( bd3D + ( tangent * sample0.x + bitangent * sample0.y ) * texelSize, dp ) ) +\n				texture( shadowMap, vec4( bd3D + ( tangent * sample1.x + bitangent * sample1.y ) * texelSize, dp ) ) +\n				texture( shadowMap, vec4( bd3D + ( tangent * sample2.x + bitangent * sample2.y ) * texelSize, dp ) ) +\n				texture( shadowMap, vec4( bd3D + ( tangent * sample3.x + bitangent * sample3.y ) * texelSize, dp ) ) +\n				texture( shadowMap, vec4( bd3D + ( tangent * sample4.x + bitangent * sample4.y ) * texelSize, dp ) )\n			) * 0.2;\n		}\n		return mix( 1.0, shadow, shadowIntensity );\n	}\n	#elif defined( SHADOWMAP_TYPE_BASIC )\n	float getPointShadow( samplerCube shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {\n		float shadow = 1.0;\n		vec3 lightToPosition = shadowCoord.xyz;\n		vec3 absVec = abs( lightToPosition );\n		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );\n		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {\n			float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );\n			dp += shadowBias;\n			vec3 bd3D = normalize( lightToPosition );\n			float depth = textureCube( shadowMap, bd3D ).r;\n			#ifdef USE_REVERSED_DEPTH_BUFFER\n				depth = 1.0 - depth;\n			#endif\n			shadow = step( dp, depth );\n		}\n		return mix( 1.0, shadow, shadowIntensity );\n	}\n	#endif\n	#endif\n#endif",
		shadowmap_pars_vertex: "#if NUM_SPOT_LIGHT_COORDS > 0\n	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];\n	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];\n#endif\n#ifdef USE_SHADOWMAP\n	#if NUM_DIR_LIGHT_SHADOWS > 0\n		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];\n		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];\n		struct DirectionalLightShadow {\n			float shadowIntensity;\n			float shadowBias;\n			float shadowNormalBias;\n			float shadowRadius;\n			vec2 shadowMapSize;\n		};\n		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];\n	#endif\n	#if NUM_SPOT_LIGHT_SHADOWS > 0\n		struct SpotLightShadow {\n			float shadowIntensity;\n			float shadowBias;\n			float shadowNormalBias;\n			float shadowRadius;\n			vec2 shadowMapSize;\n		};\n		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];\n	#endif\n	#if NUM_POINT_LIGHT_SHADOWS > 0\n		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];\n		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];\n		struct PointLightShadow {\n			float shadowIntensity;\n			float shadowBias;\n			float shadowNormalBias;\n			float shadowRadius;\n			vec2 shadowMapSize;\n			float shadowCameraNear;\n			float shadowCameraFar;\n		};\n		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];\n	#endif\n#endif",
		shadowmap_vertex: "#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )\n	#ifdef HAS_NORMAL\n		vec3 shadowWorldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );\n	#else\n		vec3 shadowWorldNormal = vec3( 0.0 );\n	#endif\n	vec4 shadowWorldPosition;\n#endif\n#if defined( USE_SHADOWMAP )\n	#if NUM_DIR_LIGHT_SHADOWS > 0\n		#pragma unroll_loop_start\n		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {\n			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );\n			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;\n		}\n		#pragma unroll_loop_end\n	#endif\n	#if NUM_POINT_LIGHT_SHADOWS > 0\n		#pragma unroll_loop_start\n		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {\n			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );\n			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;\n		}\n		#pragma unroll_loop_end\n	#endif\n#endif\n#if NUM_SPOT_LIGHT_COORDS > 0\n	#pragma unroll_loop_start\n	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {\n		shadowWorldPosition = worldPosition;\n		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )\n			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;\n		#endif\n		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;\n	}\n	#pragma unroll_loop_end\n#endif",
		shadowmask_pars_fragment: "float getShadowMask() {\n	float shadow = 1.0;\n	#ifdef USE_SHADOWMAP\n	#if NUM_DIR_LIGHT_SHADOWS > 0\n	DirectionalLightShadow directionalLight;\n	#pragma unroll_loop_start\n	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {\n		directionalLight = directionalLightShadows[ i ];\n		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;\n	}\n	#pragma unroll_loop_end\n	#endif\n	#if NUM_SPOT_LIGHT_SHADOWS > 0\n	SpotLightShadow spotLight;\n	#pragma unroll_loop_start\n	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {\n		spotLight = spotLightShadows[ i ];\n		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;\n	}\n	#pragma unroll_loop_end\n	#endif\n	#if NUM_POINT_LIGHT_SHADOWS > 0 && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )\n	PointLightShadow pointLight;\n	#pragma unroll_loop_start\n	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {\n		pointLight = pointLightShadows[ i ];\n		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;\n	}\n	#pragma unroll_loop_end\n	#endif\n	#endif\n	return shadow;\n}",
		skinbase_vertex: "#ifdef USE_SKINNING\n	mat4 boneMatX = getBoneMatrix( skinIndex.x );\n	mat4 boneMatY = getBoneMatrix( skinIndex.y );\n	mat4 boneMatZ = getBoneMatrix( skinIndex.z );\n	mat4 boneMatW = getBoneMatrix( skinIndex.w );\n#endif",
		skinning_pars_vertex: "#ifdef USE_SKINNING\n	uniform mat4 bindMatrix;\n	uniform mat4 bindMatrixInverse;\n	uniform highp sampler2D boneTexture;\n	mat4 getBoneMatrix( const in float i ) {\n		int size = textureSize( boneTexture, 0 ).x;\n		int j = int( i ) * 4;\n		int x = j % size;\n		int y = j / size;\n		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );\n		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );\n		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );\n		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );\n		return mat4( v1, v2, v3, v4 );\n	}\n#endif",
		skinning_vertex: "#ifdef USE_SKINNING\n	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );\n	vec4 skinned = vec4( 0.0 );\n	skinned += boneMatX * skinVertex * skinWeight.x;\n	skinned += boneMatY * skinVertex * skinWeight.y;\n	skinned += boneMatZ * skinVertex * skinWeight.z;\n	skinned += boneMatW * skinVertex * skinWeight.w;\n	transformed = ( bindMatrixInverse * skinned ).xyz;\n#endif",
		skinnormal_vertex: "#ifdef USE_SKINNING\n	mat4 skinMatrix = mat4( 0.0 );\n	skinMatrix += skinWeight.x * boneMatX;\n	skinMatrix += skinWeight.y * boneMatY;\n	skinMatrix += skinWeight.z * boneMatZ;\n	skinMatrix += skinWeight.w * boneMatW;\n	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;\n	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;\n	#ifdef USE_TANGENT\n		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;\n	#endif\n#endif",
		specularmap_fragment: "float specularStrength;\n#ifdef USE_SPECULARMAP\n	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );\n	specularStrength = texelSpecular.r;\n#else\n	specularStrength = 1.0;\n#endif",
		specularmap_pars_fragment: "#ifdef USE_SPECULARMAP\n	uniform sampler2D specularMap;\n#endif",
		tonemapping_fragment: "#if defined( TONE_MAPPING )\n	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );\n#endif",
		tonemapping_pars_fragment: "#ifndef saturate\n#define saturate( a ) clamp( a, 0.0, 1.0 )\n#endif\nuniform float toneMappingExposure;\nvec3 LinearToneMapping( vec3 color ) {\n	return saturate( toneMappingExposure * color );\n}\nvec3 ReinhardToneMapping( vec3 color ) {\n	color *= toneMappingExposure;\n	return saturate( color / ( vec3( 1.0 ) + color ) );\n}\nvec3 CineonToneMapping( vec3 color ) {\n	color *= toneMappingExposure;\n	color = max( vec3( 0.0 ), color - 0.004 );\n	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );\n}\nvec3 RRTAndODTFit( vec3 v ) {\n	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;\n	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;\n	return a / b;\n}\nvec3 ACESFilmicToneMapping( vec3 color ) {\n	const mat3 ACESInputMat = mat3(\n		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),\n		vec3( 0.04823, 0.01566, 0.83777 )\n	);\n	const mat3 ACESOutputMat = mat3(\n		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),\n		vec3( -0.07367, -0.00605,  1.07602 )\n	);\n	color *= toneMappingExposure / 0.6;\n	color = ACESInputMat * color;\n	color = RRTAndODTFit( color );\n	color = ACESOutputMat * color;\n	return saturate( color );\n}\nconst mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(\n	vec3( 1.6605, - 0.1246, - 0.0182 ),\n	vec3( - 0.5876, 1.1329, - 0.1006 ),\n	vec3( - 0.0728, - 0.0083, 1.1187 )\n);\nconst mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(\n	vec3( 0.6274, 0.0691, 0.0164 ),\n	vec3( 0.3293, 0.9195, 0.0880 ),\n	vec3( 0.0433, 0.0113, 0.8956 )\n);\nvec3 agxDefaultContrastApprox( vec3 x ) {\n	vec3 x2 = x * x;\n	vec3 x4 = x2 * x2;\n	return + 15.5 * x4 * x2\n		- 40.14 * x4 * x\n		+ 31.96 * x4\n		- 6.868 * x2 * x\n		+ 0.4298 * x2\n		+ 0.1191 * x\n		- 0.00232;\n}\nvec3 AgXToneMapping( vec3 color ) {\n	const mat3 AgXInsetMatrix = mat3(\n		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),\n		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),\n		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )\n	);\n	const mat3 AgXOutsetMatrix = mat3(\n		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),\n		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),\n		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )\n	);\n	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;\n	color *= toneMappingExposure;\n	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;\n	color = AgXInsetMatrix * color;\n	color = max( color, 1e-10 );	color = log2( color );\n	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );\n	color = clamp( color, 0.0, 1.0 );\n	color = agxDefaultContrastApprox( color );\n	color = AgXOutsetMatrix * color;\n	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );\n	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;\n	color = clamp( color, 0.0, 1.0 );\n	return color;\n}\nvec3 NeutralToneMapping( vec3 color ) {\n	const float StartCompression = 0.8 - 0.04;\n	const float Desaturation = 0.15;\n	color *= toneMappingExposure;\n	float x = min( color.r, min( color.g, color.b ) );\n	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;\n	color -= offset;\n	float peak = max( color.r, max( color.g, color.b ) );\n	if ( peak < StartCompression ) return color;\n	float d = 1. - StartCompression;\n	float newPeak = 1. - d * d / ( peak + d - StartCompression );\n	color *= newPeak / peak;\n	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );\n	return mix( color, vec3( newPeak ), g );\n}\nvec3 CustomToneMapping( vec3 color ) { return color; }",
		transmission_fragment: "#ifdef USE_TRANSMISSION\n	material.transmission = transmission;\n	material.transmissionAlpha = 1.0;\n	material.thickness = thickness;\n	material.attenuationDistance = attenuationDistance;\n	material.attenuationColor = attenuationColor;\n	#ifdef USE_TRANSMISSIONMAP\n		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;\n	#endif\n	#ifdef USE_THICKNESSMAP\n		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;\n	#endif\n	vec3 pos = vWorldPosition;\n	vec3 v = normalize( cameraPosition - pos );\n	vec3 n = transformNormalByInverseViewMatrix( normal, viewMatrix );\n	vec4 transmitted = getIBLVolumeRefraction(\n		n, v, material.roughness, material.diffuseContribution, material.specularColorBlended, material.specularF90,\n		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,\n		material.attenuationColor, material.attenuationDistance );\n	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );\n	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );\n#endif",
		transmission_pars_fragment: "#ifdef USE_TRANSMISSION\n	uniform float transmission;\n	uniform float thickness;\n	uniform float attenuationDistance;\n	uniform vec3 attenuationColor;\n	#ifdef USE_TRANSMISSIONMAP\n		uniform sampler2D transmissionMap;\n	#endif\n	#ifdef USE_THICKNESSMAP\n		uniform sampler2D thicknessMap;\n	#endif\n	uniform vec2 transmissionSamplerSize;\n	uniform sampler2D transmissionSamplerMap;\n	uniform mat4 modelMatrix;\n	uniform mat4 projectionMatrix;\n	varying vec3 vWorldPosition;\n	float w0( float a ) {\n		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );\n	}\n	float w1( float a ) {\n		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );\n	}\n	float w2( float a ){\n		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );\n	}\n	float w3( float a ) {\n		return ( 1.0 / 6.0 ) * ( a * a * a );\n	}\n	float g0( float a ) {\n		return w0( a ) + w1( a );\n	}\n	float g1( float a ) {\n		return w2( a ) + w3( a );\n	}\n	float h0( float a ) {\n		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );\n	}\n	float h1( float a ) {\n		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );\n	}\n	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {\n		uv = uv * texelSize.zw + 0.5;\n		vec2 iuv = floor( uv );\n		vec2 fuv = fract( uv );\n		float g0x = g0( fuv.x );\n		float g1x = g1( fuv.x );\n		float h0x = h0( fuv.x );\n		float h1x = h1( fuv.x );\n		float h0y = h0( fuv.y );\n		float h1y = h1( fuv.y );\n		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;\n		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;\n		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;\n		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;\n		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +\n			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );\n	}\n	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {\n		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );\n		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );\n		vec2 fLodSizeInv = 1.0 / fLodSize;\n		vec2 cLodSizeInv = 1.0 / cLodSize;\n		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );\n		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );\n		return mix( fSample, cSample, fract( lod ) );\n	}\n	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {\n		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );\n		vec3 modelScale;\n		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );\n		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );\n		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );\n		return normalize( refractionVector ) * thickness * modelScale;\n	}\n	float applyIorToRoughness( const in float roughness, const in float ior ) {\n		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );\n	}\n	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {\n		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );\n		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );\n	}\n	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {\n		if ( isinf( attenuationDistance ) ) {\n			return vec3( 1.0 );\n		} else {\n			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;\n			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;\n		}\n	}\n	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,\n		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,\n		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,\n		const in vec3 attenuationColor, const in float attenuationDistance ) {\n		vec4 transmittedLight;\n		vec3 transmittance;\n		#ifdef USE_DISPERSION\n			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;\n			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );\n			for ( int i = 0; i < 3; i ++ ) {\n				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );\n				vec3 refractedRayExit = position + transmissionRay;\n				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );\n				vec2 refractionCoords = ndcPos.xy / ndcPos.w;\n				refractionCoords += 1.0;\n				refractionCoords /= 2.0;\n				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );\n				transmittedLight[ i ] = transmissionSample[ i ];\n				transmittedLight.a += transmissionSample.a;\n				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];\n			}\n			transmittedLight.a /= 3.0;\n		#else\n			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );\n			vec3 refractedRayExit = position + transmissionRay;\n			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );\n			vec2 refractionCoords = ndcPos.xy / ndcPos.w;\n			refractionCoords += 1.0;\n			refractionCoords /= 2.0;\n			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );\n			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );\n		#endif\n		vec3 attenuatedColor = transmittance * transmittedLight.rgb;\n		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );\n		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;\n		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );\n	}\n#endif",
		uv_pars_fragment: "#if defined( USE_UV ) || defined( USE_ANISOTROPY )\n	varying vec2 vUv;\n#endif\n#ifdef USE_MAP\n	varying vec2 vMapUv;\n#endif\n#ifdef USE_ALPHAMAP\n	varying vec2 vAlphaMapUv;\n#endif\n#ifdef USE_LIGHTMAP\n	varying vec2 vLightMapUv;\n#endif\n#ifdef USE_AOMAP\n	varying vec2 vAoMapUv;\n#endif\n#ifdef USE_BUMPMAP\n	varying vec2 vBumpMapUv;\n#endif\n#ifdef USE_NORMALMAP\n	varying vec2 vNormalMapUv;\n#endif\n#ifdef USE_EMISSIVEMAP\n	varying vec2 vEmissiveMapUv;\n#endif\n#ifdef USE_METALNESSMAP\n	varying vec2 vMetalnessMapUv;\n#endif\n#ifdef USE_ROUGHNESSMAP\n	varying vec2 vRoughnessMapUv;\n#endif\n#ifdef USE_ANISOTROPYMAP\n	varying vec2 vAnisotropyMapUv;\n#endif\n#ifdef USE_CLEARCOATMAP\n	varying vec2 vClearcoatMapUv;\n#endif\n#ifdef USE_CLEARCOAT_NORMALMAP\n	varying vec2 vClearcoatNormalMapUv;\n#endif\n#ifdef USE_CLEARCOAT_ROUGHNESSMAP\n	varying vec2 vClearcoatRoughnessMapUv;\n#endif\n#ifdef USE_IRIDESCENCEMAP\n	varying vec2 vIridescenceMapUv;\n#endif\n#ifdef USE_IRIDESCENCE_THICKNESSMAP\n	varying vec2 vIridescenceThicknessMapUv;\n#endif\n#ifdef USE_SHEEN_COLORMAP\n	varying vec2 vSheenColorMapUv;\n#endif\n#ifdef USE_SHEEN_ROUGHNESSMAP\n	varying vec2 vSheenRoughnessMapUv;\n#endif\n#ifdef USE_SPECULARMAP\n	varying vec2 vSpecularMapUv;\n#endif\n#ifdef USE_SPECULAR_COLORMAP\n	varying vec2 vSpecularColorMapUv;\n#endif\n#ifdef USE_SPECULAR_INTENSITYMAP\n	varying vec2 vSpecularIntensityMapUv;\n#endif\n#ifdef USE_TRANSMISSIONMAP\n	uniform mat3 transmissionMapTransform;\n	varying vec2 vTransmissionMapUv;\n#endif\n#ifdef USE_THICKNESSMAP\n	uniform mat3 thicknessMapTransform;\n	varying vec2 vThicknessMapUv;\n#endif",
		uv_pars_vertex: "#if defined( USE_UV ) || defined( USE_ANISOTROPY )\n	varying vec2 vUv;\n#endif\n#ifdef USE_MAP\n	uniform mat3 mapTransform;\n	varying vec2 vMapUv;\n#endif\n#ifdef USE_ALPHAMAP\n	uniform mat3 alphaMapTransform;\n	varying vec2 vAlphaMapUv;\n#endif\n#ifdef USE_LIGHTMAP\n	uniform mat3 lightMapTransform;\n	varying vec2 vLightMapUv;\n#endif\n#ifdef USE_AOMAP\n	uniform mat3 aoMapTransform;\n	varying vec2 vAoMapUv;\n#endif\n#ifdef USE_BUMPMAP\n	uniform mat3 bumpMapTransform;\n	varying vec2 vBumpMapUv;\n#endif\n#ifdef USE_NORMALMAP\n	uniform mat3 normalMapTransform;\n	varying vec2 vNormalMapUv;\n#endif\n#ifdef USE_DISPLACEMENTMAP\n	uniform mat3 displacementMapTransform;\n	varying vec2 vDisplacementMapUv;\n#endif\n#ifdef USE_EMISSIVEMAP\n	uniform mat3 emissiveMapTransform;\n	varying vec2 vEmissiveMapUv;\n#endif\n#ifdef USE_METALNESSMAP\n	uniform mat3 metalnessMapTransform;\n	varying vec2 vMetalnessMapUv;\n#endif\n#ifdef USE_ROUGHNESSMAP\n	uniform mat3 roughnessMapTransform;\n	varying vec2 vRoughnessMapUv;\n#endif\n#ifdef USE_ANISOTROPYMAP\n	uniform mat3 anisotropyMapTransform;\n	varying vec2 vAnisotropyMapUv;\n#endif\n#ifdef USE_CLEARCOATMAP\n	uniform mat3 clearcoatMapTransform;\n	varying vec2 vClearcoatMapUv;\n#endif\n#ifdef USE_CLEARCOAT_NORMALMAP\n	uniform mat3 clearcoatNormalMapTransform;\n	varying vec2 vClearcoatNormalMapUv;\n#endif\n#ifdef USE_CLEARCOAT_ROUGHNESSMAP\n	uniform mat3 clearcoatRoughnessMapTransform;\n	varying vec2 vClearcoatRoughnessMapUv;\n#endif\n#ifdef USE_SHEEN_COLORMAP\n	uniform mat3 sheenColorMapTransform;\n	varying vec2 vSheenColorMapUv;\n#endif\n#ifdef USE_SHEEN_ROUGHNESSMAP\n	uniform mat3 sheenRoughnessMapTransform;\n	varying vec2 vSheenRoughnessMapUv;\n#endif\n#ifdef USE_IRIDESCENCEMAP\n	uniform mat3 iridescenceMapTransform;\n	varying vec2 vIridescenceMapUv;\n#endif\n#ifdef USE_IRIDESCENCE_THICKNESSMAP\n	uniform mat3 iridescenceThicknessMapTransform;\n	varying vec2 vIridescenceThicknessMapUv;\n#endif\n#ifdef USE_SPECULARMAP\n	uniform mat3 specularMapTransform;\n	varying vec2 vSpecularMapUv;\n#endif\n#ifdef USE_SPECULAR_COLORMAP\n	uniform mat3 specularColorMapTransform;\n	varying vec2 vSpecularColorMapUv;\n#endif\n#ifdef USE_SPECULAR_INTENSITYMAP\n	uniform mat3 specularIntensityMapTransform;\n	varying vec2 vSpecularIntensityMapUv;\n#endif\n#ifdef USE_TRANSMISSIONMAP\n	uniform mat3 transmissionMapTransform;\n	varying vec2 vTransmissionMapUv;\n#endif\n#ifdef USE_THICKNESSMAP\n	uniform mat3 thicknessMapTransform;\n	varying vec2 vThicknessMapUv;\n#endif",
		uv_vertex: "#if defined( USE_UV ) || defined( USE_ANISOTROPY )\n	vUv = vec3( uv, 1 ).xy;\n#endif\n#ifdef USE_MAP\n	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;\n#endif\n#ifdef USE_ALPHAMAP\n	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;\n#endif\n#ifdef USE_LIGHTMAP\n	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;\n#endif\n#ifdef USE_AOMAP\n	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;\n#endif\n#ifdef USE_BUMPMAP\n	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;\n#endif\n#ifdef USE_NORMALMAP\n	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;\n#endif\n#ifdef USE_DISPLACEMENTMAP\n	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;\n#endif\n#ifdef USE_EMISSIVEMAP\n	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;\n#endif\n#ifdef USE_METALNESSMAP\n	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;\n#endif\n#ifdef USE_ROUGHNESSMAP\n	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;\n#endif\n#ifdef USE_ANISOTROPYMAP\n	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;\n#endif\n#ifdef USE_CLEARCOATMAP\n	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;\n#endif\n#ifdef USE_CLEARCOAT_NORMALMAP\n	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;\n#endif\n#ifdef USE_CLEARCOAT_ROUGHNESSMAP\n	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;\n#endif\n#ifdef USE_IRIDESCENCEMAP\n	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;\n#endif\n#ifdef USE_IRIDESCENCE_THICKNESSMAP\n	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;\n#endif\n#ifdef USE_SHEEN_COLORMAP\n	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;\n#endif\n#ifdef USE_SHEEN_ROUGHNESSMAP\n	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;\n#endif\n#ifdef USE_SPECULARMAP\n	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;\n#endif\n#ifdef USE_SPECULAR_COLORMAP\n	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;\n#endif\n#ifdef USE_SPECULAR_INTENSITYMAP\n	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;\n#endif\n#ifdef USE_TRANSMISSIONMAP\n	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;\n#endif\n#ifdef USE_THICKNESSMAP\n	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;\n#endif",
		worldpos_vertex: "#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0\n	vec4 worldPosition = vec4( transformed, 1.0 );\n	#ifdef USE_BATCHING\n		worldPosition = batchingMatrix * worldPosition;\n	#endif\n	#ifdef USE_INSTANCING\n		worldPosition = instanceMatrix * worldPosition;\n	#endif\n	worldPosition = modelMatrix * worldPosition;\n#endif",
		background_vert: "varying vec2 vUv;\nuniform mat3 uvTransform;\nvoid main() {\n	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;\n	gl_Position = vec4( position.xy, 1.0, 1.0 );\n}",
		background_frag: "uniform sampler2D t2D;\nuniform float backgroundIntensity;\nvarying vec2 vUv;\nvoid main() {\n	vec4 texColor = texture2D( t2D, vUv );\n	#ifdef DECODE_VIDEO_TEXTURE\n		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );\n	#endif\n	texColor.rgb *= backgroundIntensity;\n	gl_FragColor = texColor;\n	#include <tonemapping_fragment>\n	#include <colorspace_fragment>\n}",
		backgroundCube_vert: "varying vec3 vWorldDirection;\n#include <common>\nvoid main() {\n	vWorldDirection = transformDirection( position, modelMatrix );\n	#include <begin_vertex>\n	#include <project_vertex>\n	gl_Position.z = gl_Position.w;\n}",
		backgroundCube_frag: "#ifdef ENVMAP_TYPE_CUBE\n	uniform samplerCube envMap;\n#elif defined( ENVMAP_TYPE_CUBE_UV )\n	uniform sampler2D envMap;\n#endif\nuniform float backgroundBlurriness;\nuniform float backgroundIntensity;\nuniform mat3 backgroundRotation;\nvarying vec3 vWorldDirection;\n#include <cube_uv_reflection_fragment>\nvoid main() {\n	#ifdef ENVMAP_TYPE_CUBE\n		vec4 texColor = textureCube( envMap, backgroundRotation * vWorldDirection );\n	#elif defined( ENVMAP_TYPE_CUBE_UV )\n		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );\n	#else\n		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );\n	#endif\n	texColor.rgb *= backgroundIntensity;\n	gl_FragColor = texColor;\n	#include <tonemapping_fragment>\n	#include <colorspace_fragment>\n}",
		cube_vert: "varying vec3 vWorldDirection;\n#include <common>\nvoid main() {\n	vWorldDirection = transformDirection( position, modelMatrix );\n	#include <begin_vertex>\n	#include <project_vertex>\n	gl_Position.z = gl_Position.w;\n}",
		cube_frag: "uniform samplerCube tCube;\nuniform float tFlip;\nuniform float opacity;\nvarying vec3 vWorldDirection;\nvoid main() {\n	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );\n	gl_FragColor = texColor;\n	gl_FragColor.a *= opacity;\n	#include <tonemapping_fragment>\n	#include <colorspace_fragment>\n}",
		depth_vert: "#include <common>\n#include <batching_pars_vertex>\n#include <uv_pars_vertex>\n#include <displacementmap_pars_vertex>\n#include <morphtarget_pars_vertex>\n#include <skinning_pars_vertex>\n#include <logdepthbuf_pars_vertex>\n#include <clipping_planes_pars_vertex>\nvarying vec2 vHighPrecisionZW;\nvoid main() {\n	#include <uv_vertex>\n	#include <batching_vertex>\n	#include <skinbase_vertex>\n	#include <morphinstance_vertex>\n	#ifdef USE_DISPLACEMENTMAP\n		#include <beginnormal_vertex>\n		#include <morphnormal_vertex>\n		#include <skinnormal_vertex>\n	#endif\n	#include <begin_vertex>\n	#include <morphtarget_vertex>\n	#include <skinning_vertex>\n	#include <displacementmap_vertex>\n	#include <project_vertex>\n	#include <logdepthbuf_vertex>\n	#include <clipping_planes_vertex>\n	vHighPrecisionZW = gl_Position.zw;\n}",
		depth_frag: "#if DEPTH_PACKING == 3200\n	uniform float opacity;\n#endif\n#include <common>\n#include <packing>\n#include <uv_pars_fragment>\n#include <map_pars_fragment>\n#include <alphamap_pars_fragment>\n#include <alphatest_pars_fragment>\n#include <alphahash_pars_fragment>\n#include <logdepthbuf_pars_fragment>\n#include <clipping_planes_pars_fragment>\nvarying vec2 vHighPrecisionZW;\nvoid main() {\n	vec4 diffuseColor = vec4( 1.0 );\n	#include <clipping_planes_fragment>\n	#if DEPTH_PACKING == 3200\n		diffuseColor.a = opacity;\n	#endif\n	#include <map_fragment>\n	#include <alphamap_fragment>\n	#include <alphatest_fragment>\n	#include <alphahash_fragment>\n	#include <logdepthbuf_fragment>\n	#ifdef USE_REVERSED_DEPTH_BUFFER\n		float fragCoordZ = vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ];\n	#else\n		float fragCoordZ = 0.5 * vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ] + 0.5;\n	#endif\n	#if DEPTH_PACKING == 3200\n		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );\n	#elif DEPTH_PACKING == 3201\n		gl_FragColor = packDepthToRGBA( fragCoordZ );\n	#elif DEPTH_PACKING == 3202\n		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );\n	#elif DEPTH_PACKING == 3203\n		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );\n	#endif\n}",
		distance_vert: "#define DISTANCE\nvarying vec3 vWorldPosition;\n#include <common>\n#include <batching_pars_vertex>\n#include <uv_pars_vertex>\n#include <displacementmap_pars_vertex>\n#include <morphtarget_pars_vertex>\n#include <skinning_pars_vertex>\n#include <clipping_planes_pars_vertex>\nvoid main() {\n	#include <uv_vertex>\n	#include <batching_vertex>\n	#include <skinbase_vertex>\n	#include <morphinstance_vertex>\n	#ifdef USE_DISPLACEMENTMAP\n		#include <beginnormal_vertex>\n		#include <morphnormal_vertex>\n		#include <skinnormal_vertex>\n	#endif\n	#include <begin_vertex>\n	#include <morphtarget_vertex>\n	#include <skinning_vertex>\n	#include <displacementmap_vertex>\n	#include <project_vertex>\n	#include <worldpos_vertex>\n	#include <clipping_planes_vertex>\n	vWorldPosition = worldPosition.xyz;\n}",
		distance_frag: "#define DISTANCE\nuniform vec3 referencePosition;\nuniform float nearDistance;\nuniform float farDistance;\nvarying vec3 vWorldPosition;\n#include <common>\n#include <uv_pars_fragment>\n#include <map_pars_fragment>\n#include <alphamap_pars_fragment>\n#include <alphatest_pars_fragment>\n#include <alphahash_pars_fragment>\n#include <clipping_planes_pars_fragment>\nvoid main() {\n	vec4 diffuseColor = vec4( 1.0 );\n	#include <clipping_planes_fragment>\n	#include <map_fragment>\n	#include <alphamap_fragment>\n	#include <alphatest_fragment>\n	#include <alphahash_fragment>\n	float dist = length( vWorldPosition - referencePosition );\n	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );\n	dist = saturate( dist );\n	gl_FragColor = vec4( dist, 0.0, 0.0, 1.0 );\n}",
		equirect_vert: "varying vec3 vWorldDirection;\n#include <common>\nvoid main() {\n	vWorldDirection = transformDirection( position, modelMatrix );\n	#include <begin_vertex>\n	#include <project_vertex>\n}",
		equirect_frag: "uniform sampler2D tEquirect;\nvarying vec3 vWorldDirection;\n#include <common>\nvoid main() {\n	vec3 direction = normalize( vWorldDirection );\n	vec2 sampleUV = equirectUv( direction );\n	gl_FragColor = texture2D( tEquirect, sampleUV );\n	#include <tonemapping_fragment>\n	#include <colorspace_fragment>\n}",
		linedashed_vert: "uniform float scale;\nattribute float lineDistance;\nvarying float vLineDistance;\n#include <common>\n#include <uv_pars_vertex>\n#include <color_pars_vertex>\n#include <fog_pars_vertex>\n#include <morphtarget_pars_vertex>\n#include <logdepthbuf_pars_vertex>\n#include <clipping_planes_pars_vertex>\nvoid main() {\n	vLineDistance = scale * lineDistance;\n	#include <uv_vertex>\n	#include <color_vertex>\n	#include <morphinstance_vertex>\n	#include <morphcolor_vertex>\n	#include <begin_vertex>\n	#include <morphtarget_vertex>\n	#include <project_vertex>\n	#include <logdepthbuf_vertex>\n	#include <clipping_planes_vertex>\n	#include <fog_vertex>\n}",
		linedashed_frag: "uniform vec3 diffuse;\nuniform float opacity;\nuniform float dashSize;\nuniform float totalSize;\nvarying float vLineDistance;\n#include <common>\n#include <color_pars_fragment>\n#include <uv_pars_fragment>\n#include <map_pars_fragment>\n#include <fog_pars_fragment>\n#include <logdepthbuf_pars_fragment>\n#include <clipping_planes_pars_fragment>\nvoid main() {\n	vec4 diffuseColor = vec4( diffuse, opacity );\n	#include <clipping_planes_fragment>\n	if ( mod( vLineDistance, totalSize ) > dashSize ) {\n		discard;\n	}\n	vec3 outgoingLight = vec3( 0.0 );\n	#include <logdepthbuf_fragment>\n	#include <map_fragment>\n	#include <color_fragment>\n	outgoingLight = diffuseColor.rgb;\n	#include <opaque_fragment>\n	#include <tonemapping_fragment>\n	#include <colorspace_fragment>\n	#include <fog_fragment>\n	#include <premultiplied_alpha_fragment>\n}",
		meshbasic_vert: "#include <common>\n#include <batching_pars_vertex>\n#include <uv_pars_vertex>\n#include <envmap_pars_vertex>\n#include <color_pars_vertex>\n#include <fog_pars_vertex>\n#include <morphtarget_pars_vertex>\n#include <skinning_pars_vertex>\n#include <logdepthbuf_pars_vertex>\n#include <clipping_planes_pars_vertex>\nvoid main() {\n	#include <uv_vertex>\n	#include <color_vertex>\n	#include <morphinstance_vertex>\n	#include <morphcolor_vertex>\n	#include <batching_vertex>\n	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )\n		#include <beginnormal_vertex>\n		#include <morphnormal_vertex>\n		#include <skinbase_vertex>\n		#include <skinnormal_vertex>\n		#include <defaultnormal_vertex>\n	#endif\n	#include <begin_vertex>\n	#include <morphtarget_vertex>\n	#include <skinning_vertex>\n	#include <project_vertex>\n	#include <logdepthbuf_vertex>\n	#include <clipping_planes_vertex>\n	#include <worldpos_vertex>\n	#include <envmap_vertex>\n	#include <fog_vertex>\n}",
		meshbasic_frag: "uniform vec3 diffuse;\nuniform float opacity;\n#ifndef FLAT_SHADED\n	varying vec3 vNormal;\n#endif\n#include <common>\n#include <dithering_pars_fragment>\n#include <color_pars_fragment>\n#include <uv_pars_fragment>\n#include <map_pars_fragment>\n#include <alphamap_pars_fragment>\n#include <alphatest_pars_fragment>\n#include <alphahash_pars_fragment>\n#include <aomap_pars_fragment>\n#include <lightmap_pars_fragment>\n#include <envmap_common_pars_fragment>\n#include <envmap_pars_fragment>\n#include <fog_pars_fragment>\n#include <specularmap_pars_fragment>\n#include <logdepthbuf_pars_fragment>\n#include <clipping_planes_pars_fragment>\nvoid main() {\n	vec4 diffuseColor = vec4( diffuse, opacity );\n	#include <clipping_planes_fragment>\n	#include <logdepthbuf_fragment>\n	#include <map_fragment>\n	#include <color_fragment>\n	#include <alphamap_fragment>\n	#include <alphatest_fragment>\n	#include <alphahash_fragment>\n	#include <specularmap_fragment>\n	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );\n	#ifdef USE_LIGHTMAP\n		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );\n		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;\n	#else\n		reflectedLight.indirectDiffuse += vec3( 1.0 );\n	#endif\n	#include <aomap_fragment>\n	reflectedLight.indirectDiffuse *= diffuseColor.rgb;\n	vec3 outgoingLight = reflectedLight.indirectDiffuse;\n	#include <envmap_fragment>\n	#include <opaque_fragment>\n	#include <tonemapping_fragment>\n	#include <colorspace_fragment>\n	#include <fog_fragment>\n	#include <premultiplied_alpha_fragment>\n	#include <dithering_fragment>\n}",
		meshlambert_vert: "#define LAMBERT\nvarying vec3 vViewPosition;\n#include <common>\n#include <batching_pars_vertex>\n#include <uv_pars_vertex>\n#include <displacementmap_pars_vertex>\n#include <envmap_pars_vertex>\n#include <color_pars_vertex>\n#include <fog_pars_vertex>\n#include <normal_pars_vertex>\n#include <morphtarget_pars_vertex>\n#include <skinning_pars_vertex>\n#include <shadowmap_pars_vertex>\n#include <logdepthbuf_pars_vertex>\n#include <clipping_planes_pars_vertex>\nvoid main() {\n	#include <uv_vertex>\n	#include <color_vertex>\n	#include <morphinstance_vertex>\n	#include <morphcolor_vertex>\n	#include <batching_vertex>\n	#include <beginnormal_vertex>\n	#include <morphnormal_vertex>\n	#include <skinbase_vertex>\n	#include <skinnormal_vertex>\n	#include <defaultnormal_vertex>\n	#include <normal_vertex>\n	#include <begin_vertex>\n	#include <morphtarget_vertex>\n	#include <skinning_vertex>\n	#include <displacementmap_vertex>\n	#include <project_vertex>\n	#include <logdepthbuf_vertex>\n	#include <clipping_planes_vertex>\n	vViewPosition = - mvPosition.xyz;\n	#include <worldpos_vertex>\n	#include <envmap_vertex>\n	#include <shadowmap_vertex>\n	#include <fog_vertex>\n}",
		meshlambert_frag: "#define LAMBERT\nuniform vec3 diffuse;\nuniform vec3 emissive;\nuniform float opacity;\n#include <common>\n#include <dithering_pars_fragment>\n#include <color_pars_fragment>\n#include <uv_pars_fragment>\n#include <map_pars_fragment>\n#include <alphamap_pars_fragment>\n#include <alphatest_pars_fragment>\n#include <alphahash_pars_fragment>\n#include <aomap_pars_fragment>\n#include <lightmap_pars_fragment>\n#include <emissivemap_pars_fragment>\n#include <cube_uv_reflection_fragment>\n#include <envmap_common_pars_fragment>\n#include <envmap_pars_fragment>\n#include <envmap_physical_pars_fragment>\n#include <fog_pars_fragment>\n#include <bsdfs>\n#include <lights_pars_begin>\n#include <normal_pars_fragment>\n#include <lights_lambert_pars_fragment>\n#include <shadowmap_pars_fragment>\n#include <bumpmap_pars_fragment>\n#include <normalmap_pars_fragment>\n#include <specularmap_pars_fragment>\n#include <logdepthbuf_pars_fragment>\n#include <clipping_planes_pars_fragment>\nvoid main() {\n	vec4 diffuseColor = vec4( diffuse, opacity );\n	#include <clipping_planes_fragment>\n	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );\n	vec3 totalEmissiveRadiance = emissive;\n	#include <logdepthbuf_fragment>\n	#include <map_fragment>\n	#include <color_fragment>\n	#include <alphamap_fragment>\n	#include <alphatest_fragment>\n	#include <alphahash_fragment>\n	#include <specularmap_fragment>\n	#include <normal_fragment_begin>\n	#include <normal_fragment_maps>\n	#include <emissivemap_fragment>\n	#include <lights_lambert_fragment>\n	#include <lights_fragment_begin>\n	#include <lights_fragment_maps>\n	#include <lights_fragment_end>\n	#include <aomap_fragment>\n	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;\n	#include <envmap_fragment>\n	#include <opaque_fragment>\n	#include <tonemapping_fragment>\n	#include <colorspace_fragment>\n	#include <fog_fragment>\n	#include <premultiplied_alpha_fragment>\n	#include <dithering_fragment>\n}",
		meshmatcap_vert: "#define MATCAP\nvarying vec3 vViewPosition;\n#include <common>\n#include <batching_pars_vertex>\n#include <uv_pars_vertex>\n#include <color_pars_vertex>\n#include <displacementmap_pars_vertex>\n#include <fog_pars_vertex>\n#include <normal_pars_vertex>\n#include <morphtarget_pars_vertex>\n#include <skinning_pars_vertex>\n#include <logdepthbuf_pars_vertex>\n#include <clipping_planes_pars_vertex>\nvoid main() {\n	#include <uv_vertex>\n	#include <color_vertex>\n	#include <morphinstance_vertex>\n	#include <morphcolor_vertex>\n	#include <batching_vertex>\n	#include <beginnormal_vertex>\n	#include <morphnormal_vertex>\n	#include <skinbase_vertex>\n	#include <skinnormal_vertex>\n	#include <defaultnormal_vertex>\n	#include <normal_vertex>\n	#include <begin_vertex>\n	#include <morphtarget_vertex>\n	#include <skinning_vertex>\n	#include <displacementmap_vertex>\n	#include <project_vertex>\n	#include <logdepthbuf_vertex>\n	#include <clipping_planes_vertex>\n	#include <fog_vertex>\n	vViewPosition = - mvPosition.xyz;\n}",
		meshmatcap_frag: "#define MATCAP\nuniform vec3 diffuse;\nuniform float opacity;\nuniform sampler2D matcap;\nvarying vec3 vViewPosition;\n#include <common>\n#include <dithering_pars_fragment>\n#include <color_pars_fragment>\n#include <uv_pars_fragment>\n#include <map_pars_fragment>\n#include <alphamap_pars_fragment>\n#include <alphatest_pars_fragment>\n#include <alphahash_pars_fragment>\n#include <fog_pars_fragment>\n#include <normal_pars_fragment>\n#include <bumpmap_pars_fragment>\n#include <normalmap_pars_fragment>\n#include <logdepthbuf_pars_fragment>\n#include <clipping_planes_pars_fragment>\nvoid main() {\n	vec4 diffuseColor = vec4( diffuse, opacity );\n	#include <clipping_planes_fragment>\n	#include <logdepthbuf_fragment>\n	#include <map_fragment>\n	#include <color_fragment>\n	#include <alphamap_fragment>\n	#include <alphatest_fragment>\n	#include <alphahash_fragment>\n	#include <normal_fragment_begin>\n	#include <normal_fragment_maps>\n	vec3 viewDir = normalize( vViewPosition );\n	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );\n	vec3 y = cross( viewDir, x );\n	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;\n	#ifdef USE_MATCAP\n		vec4 matcapColor = texture2D( matcap, uv );\n	#else\n		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );\n	#endif\n	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;\n	#include <opaque_fragment>\n	#include <tonemapping_fragment>\n	#include <colorspace_fragment>\n	#include <fog_fragment>\n	#include <premultiplied_alpha_fragment>\n	#include <dithering_fragment>\n}",
		meshnormal_vert: "#define NORMAL\n#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )\n	varying vec3 vViewPosition;\n#endif\n#include <common>\n#include <batching_pars_vertex>\n#include <uv_pars_vertex>\n#include <displacementmap_pars_vertex>\n#include <normal_pars_vertex>\n#include <morphtarget_pars_vertex>\n#include <skinning_pars_vertex>\n#include <logdepthbuf_pars_vertex>\n#include <clipping_planes_pars_vertex>\nvoid main() {\n	#include <uv_vertex>\n	#include <batching_vertex>\n	#include <beginnormal_vertex>\n	#include <morphinstance_vertex>\n	#include <morphnormal_vertex>\n	#include <skinbase_vertex>\n	#include <skinnormal_vertex>\n	#include <defaultnormal_vertex>\n	#include <normal_vertex>\n	#include <begin_vertex>\n	#include <morphtarget_vertex>\n	#include <skinning_vertex>\n	#include <displacementmap_vertex>\n	#include <project_vertex>\n	#include <logdepthbuf_vertex>\n	#include <clipping_planes_vertex>\n#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )\n	vViewPosition = - mvPosition.xyz;\n#endif\n}",
		meshnormal_frag: "#define NORMAL\nuniform float opacity;\n#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )\n	varying vec3 vViewPosition;\n#endif\n#include <uv_pars_fragment>\n#include <normal_pars_fragment>\n#include <bumpmap_pars_fragment>\n#include <normalmap_pars_fragment>\n#include <logdepthbuf_pars_fragment>\n#include <clipping_planes_pars_fragment>\nvoid main() {\n	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );\n	#include <clipping_planes_fragment>\n	#include <logdepthbuf_fragment>\n	#include <normal_fragment_begin>\n	#include <normal_fragment_maps>\n	gl_FragColor = vec4( normalize( normal ) * 0.5 + 0.5, diffuseColor.a );\n	#ifdef OPAQUE\n		gl_FragColor.a = 1.0;\n	#endif\n}",
		meshphong_vert: "#define PHONG\nvarying vec3 vViewPosition;\n#include <common>\n#include <batching_pars_vertex>\n#include <uv_pars_vertex>\n#include <displacementmap_pars_vertex>\n#include <envmap_pars_vertex>\n#include <color_pars_vertex>\n#include <fog_pars_vertex>\n#include <normal_pars_vertex>\n#include <morphtarget_pars_vertex>\n#include <skinning_pars_vertex>\n#include <shadowmap_pars_vertex>\n#include <logdepthbuf_pars_vertex>\n#include <clipping_planes_pars_vertex>\nvoid main() {\n	#include <uv_vertex>\n	#include <color_vertex>\n	#include <morphcolor_vertex>\n	#include <batching_vertex>\n	#include <beginnormal_vertex>\n	#include <morphinstance_vertex>\n	#include <morphnormal_vertex>\n	#include <skinbase_vertex>\n	#include <skinnormal_vertex>\n	#include <defaultnormal_vertex>\n	#include <normal_vertex>\n	#include <begin_vertex>\n	#include <morphtarget_vertex>\n	#include <skinning_vertex>\n	#include <displacementmap_vertex>\n	#include <project_vertex>\n	#include <logdepthbuf_vertex>\n	#include <clipping_planes_vertex>\n	vViewPosition = - mvPosition.xyz;\n	#include <worldpos_vertex>\n	#include <envmap_vertex>\n	#include <shadowmap_vertex>\n	#include <fog_vertex>\n}",
		meshphong_frag: "#define PHONG\nuniform vec3 diffuse;\nuniform vec3 emissive;\nuniform vec3 specular;\nuniform float shininess;\nuniform float opacity;\n#include <common>\n#include <dithering_pars_fragment>\n#include <color_pars_fragment>\n#include <uv_pars_fragment>\n#include <map_pars_fragment>\n#include <alphamap_pars_fragment>\n#include <alphatest_pars_fragment>\n#include <alphahash_pars_fragment>\n#include <aomap_pars_fragment>\n#include <lightmap_pars_fragment>\n#include <emissivemap_pars_fragment>\n#include <cube_uv_reflection_fragment>\n#include <envmap_common_pars_fragment>\n#include <envmap_pars_fragment>\n#include <envmap_physical_pars_fragment>\n#include <fog_pars_fragment>\n#include <bsdfs>\n#include <lights_pars_begin>\n#include <normal_pars_fragment>\n#include <lights_phong_pars_fragment>\n#include <shadowmap_pars_fragment>\n#include <bumpmap_pars_fragment>\n#include <normalmap_pars_fragment>\n#include <specularmap_pars_fragment>\n#include <logdepthbuf_pars_fragment>\n#include <clipping_planes_pars_fragment>\nvoid main() {\n	vec4 diffuseColor = vec4( diffuse, opacity );\n	#include <clipping_planes_fragment>\n	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );\n	vec3 totalEmissiveRadiance = emissive;\n	#include <logdepthbuf_fragment>\n	#include <map_fragment>\n	#include <color_fragment>\n	#include <alphamap_fragment>\n	#include <alphatest_fragment>\n	#include <alphahash_fragment>\n	#include <specularmap_fragment>\n	#include <normal_fragment_begin>\n	#include <normal_fragment_maps>\n	#include <emissivemap_fragment>\n	#include <lights_phong_fragment>\n	#include <lights_fragment_begin>\n	#include <lights_fragment_maps>\n	#include <lights_fragment_end>\n	#include <aomap_fragment>\n	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;\n	#include <envmap_fragment>\n	#include <opaque_fragment>\n	#include <tonemapping_fragment>\n	#include <colorspace_fragment>\n	#include <fog_fragment>\n	#include <premultiplied_alpha_fragment>\n	#include <dithering_fragment>\n}",
		meshphysical_vert: "#define STANDARD\nvarying vec3 vViewPosition;\n#ifdef USE_TRANSMISSION\n	varying vec3 vWorldPosition;\n#endif\n#include <common>\n#include <batching_pars_vertex>\n#include <uv_pars_vertex>\n#include <displacementmap_pars_vertex>\n#include <color_pars_vertex>\n#include <fog_pars_vertex>\n#include <normal_pars_vertex>\n#include <morphtarget_pars_vertex>\n#include <skinning_pars_vertex>\n#include <shadowmap_pars_vertex>\n#include <logdepthbuf_pars_vertex>\n#include <clipping_planes_pars_vertex>\nvoid main() {\n	#include <uv_vertex>\n	#include <color_vertex>\n	#include <morphinstance_vertex>\n	#include <morphcolor_vertex>\n	#include <batching_vertex>\n	#include <beginnormal_vertex>\n	#include <morphnormal_vertex>\n	#include <skinbase_vertex>\n	#include <skinnormal_vertex>\n	#include <defaultnormal_vertex>\n	#include <normal_vertex>\n	#include <begin_vertex>\n	#include <morphtarget_vertex>\n	#include <skinning_vertex>\n	#include <displacementmap_vertex>\n	#include <project_vertex>\n	#include <logdepthbuf_vertex>\n	#include <clipping_planes_vertex>\n	vViewPosition = - mvPosition.xyz;\n	#include <worldpos_vertex>\n	#include <shadowmap_vertex>\n	#include <fog_vertex>\n#ifdef USE_TRANSMISSION\n	vWorldPosition = worldPosition.xyz;\n#endif\n}",
		meshphysical_frag: "#define STANDARD\n#ifdef PHYSICAL\n	#define IOR\n	#define USE_SPECULAR\n#endif\nuniform vec3 diffuse;\nuniform vec3 emissive;\nuniform float roughness;\nuniform float metalness;\nuniform float opacity;\n#ifdef IOR\n	uniform float ior;\n#endif\n#ifdef USE_SPECULAR\n	uniform float specularIntensity;\n	uniform vec3 specularColor;\n	#ifdef USE_SPECULAR_COLORMAP\n		uniform sampler2D specularColorMap;\n	#endif\n	#ifdef USE_SPECULAR_INTENSITYMAP\n		uniform sampler2D specularIntensityMap;\n	#endif\n#endif\n#ifdef USE_CLEARCOAT\n	uniform float clearcoat;\n	uniform float clearcoatRoughness;\n#endif\n#ifdef USE_DISPERSION\n	uniform float dispersion;\n#endif\n#ifdef USE_IRIDESCENCE\n	uniform float iridescence;\n	uniform float iridescenceIOR;\n	uniform float iridescenceThicknessMinimum;\n	uniform float iridescenceThicknessMaximum;\n#endif\n#ifdef USE_SHEEN\n	uniform vec3 sheenColor;\n	uniform float sheenRoughness;\n	#ifdef USE_SHEEN_COLORMAP\n		uniform sampler2D sheenColorMap;\n	#endif\n	#ifdef USE_SHEEN_ROUGHNESSMAP\n		uniform sampler2D sheenRoughnessMap;\n	#endif\n#endif\n#ifdef USE_ANISOTROPY\n	uniform vec2 anisotropyVector;\n	#ifdef USE_ANISOTROPYMAP\n		uniform sampler2D anisotropyMap;\n	#endif\n#endif\nvarying vec3 vViewPosition;\n#include <common>\n#include <dithering_pars_fragment>\n#include <color_pars_fragment>\n#include <uv_pars_fragment>\n#include <map_pars_fragment>\n#include <alphamap_pars_fragment>\n#include <alphatest_pars_fragment>\n#include <alphahash_pars_fragment>\n#include <aomap_pars_fragment>\n#include <lightmap_pars_fragment>\n#include <emissivemap_pars_fragment>\n#include <iridescence_fragment>\n#include <cube_uv_reflection_fragment>\n#include <envmap_common_pars_fragment>\n#include <envmap_physical_pars_fragment>\n#include <fog_pars_fragment>\n#include <lights_pars_begin>\n#include <normal_pars_fragment>\n#include <lights_physical_pars_fragment>\n#include <transmission_pars_fragment>\n#include <shadowmap_pars_fragment>\n#include <bumpmap_pars_fragment>\n#include <normalmap_pars_fragment>\n#include <clearcoat_pars_fragment>\n#include <iridescence_pars_fragment>\n#include <roughnessmap_pars_fragment>\n#include <metalnessmap_pars_fragment>\n#include <logdepthbuf_pars_fragment>\n#include <clipping_planes_pars_fragment>\nvoid main() {\n	vec4 diffuseColor = vec4( diffuse, opacity );\n	#include <clipping_planes_fragment>\n	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );\n	vec3 totalEmissiveRadiance = emissive;\n	#include <logdepthbuf_fragment>\n	#include <map_fragment>\n	#include <color_fragment>\n	#include <alphamap_fragment>\n	#include <alphatest_fragment>\n	#include <alphahash_fragment>\n	#include <roughnessmap_fragment>\n	#include <metalnessmap_fragment>\n	#include <normal_fragment_begin>\n	#include <normal_fragment_maps>\n	#include <clearcoat_normal_fragment_begin>\n	#include <clearcoat_normal_fragment_maps>\n	#include <emissivemap_fragment>\n	#include <lights_physical_fragment>\n	#include <lights_fragment_begin>\n	#include <lights_fragment_maps>\n	#include <lights_fragment_end>\n	#include <aomap_fragment>\n	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;\n	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;\n	#include <transmission_fragment>\n	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;\n	#ifdef USE_SHEEN\n \n		outgoingLight = outgoingLight + sheenSpecularDirect + sheenSpecularIndirect;\n \n 	#endif\n	#ifdef USE_CLEARCOAT\n		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );\n		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );\n		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;\n	#endif\n	#include <opaque_fragment>\n	#include <tonemapping_fragment>\n	#include <colorspace_fragment>\n	#include <fog_fragment>\n	#include <premultiplied_alpha_fragment>\n	#include <dithering_fragment>\n}",
		meshtoon_vert: "#define TOON\nvarying vec3 vViewPosition;\n#include <common>\n#include <batching_pars_vertex>\n#include <uv_pars_vertex>\n#include <displacementmap_pars_vertex>\n#include <color_pars_vertex>\n#include <fog_pars_vertex>\n#include <normal_pars_vertex>\n#include <morphtarget_pars_vertex>\n#include <skinning_pars_vertex>\n#include <shadowmap_pars_vertex>\n#include <logdepthbuf_pars_vertex>\n#include <clipping_planes_pars_vertex>\nvoid main() {\n	#include <uv_vertex>\n	#include <color_vertex>\n	#include <morphinstance_vertex>\n	#include <morphcolor_vertex>\n	#include <batching_vertex>\n	#include <beginnormal_vertex>\n	#include <morphnormal_vertex>\n	#include <skinbase_vertex>\n	#include <skinnormal_vertex>\n	#include <defaultnormal_vertex>\n	#include <normal_vertex>\n	#include <begin_vertex>\n	#include <morphtarget_vertex>\n	#include <skinning_vertex>\n	#include <displacementmap_vertex>\n	#include <project_vertex>\n	#include <logdepthbuf_vertex>\n	#include <clipping_planes_vertex>\n	vViewPosition = - mvPosition.xyz;\n	#include <worldpos_vertex>\n	#include <shadowmap_vertex>\n	#include <fog_vertex>\n}",
		meshtoon_frag: "#define TOON\nuniform vec3 diffuse;\nuniform vec3 emissive;\nuniform float opacity;\n#include <common>\n#include <dithering_pars_fragment>\n#include <color_pars_fragment>\n#include <uv_pars_fragment>\n#include <map_pars_fragment>\n#include <alphamap_pars_fragment>\n#include <alphatest_pars_fragment>\n#include <alphahash_pars_fragment>\n#include <aomap_pars_fragment>\n#include <lightmap_pars_fragment>\n#include <emissivemap_pars_fragment>\n#include <gradientmap_pars_fragment>\n#include <fog_pars_fragment>\n#include <bsdfs>\n#include <lights_pars_begin>\n#include <normal_pars_fragment>\n#include <lights_toon_pars_fragment>\n#include <shadowmap_pars_fragment>\n#include <bumpmap_pars_fragment>\n#include <normalmap_pars_fragment>\n#include <logdepthbuf_pars_fragment>\n#include <clipping_planes_pars_fragment>\nvoid main() {\n	vec4 diffuseColor = vec4( diffuse, opacity );\n	#include <clipping_planes_fragment>\n	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );\n	vec3 totalEmissiveRadiance = emissive;\n	#include <logdepthbuf_fragment>\n	#include <map_fragment>\n	#include <color_fragment>\n	#include <alphamap_fragment>\n	#include <alphatest_fragment>\n	#include <alphahash_fragment>\n	#include <normal_fragment_begin>\n	#include <normal_fragment_maps>\n	#include <emissivemap_fragment>\n	#include <lights_toon_fragment>\n	#include <lights_fragment_begin>\n	#include <lights_fragment_maps>\n	#include <lights_fragment_end>\n	#include <aomap_fragment>\n	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;\n	#include <opaque_fragment>\n	#include <tonemapping_fragment>\n	#include <colorspace_fragment>\n	#include <fog_fragment>\n	#include <premultiplied_alpha_fragment>\n	#include <dithering_fragment>\n}",
		points_vert: "uniform float size;\nuniform float scale;\n#include <common>\n#include <color_pars_vertex>\n#include <fog_pars_vertex>\n#include <morphtarget_pars_vertex>\n#include <logdepthbuf_pars_vertex>\n#include <clipping_planes_pars_vertex>\n#ifdef USE_POINTS_UV\n	varying vec2 vUv;\n	uniform mat3 uvTransform;\n#endif\nvoid main() {\n	#ifdef USE_POINTS_UV\n		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;\n	#endif\n	#include <color_vertex>\n	#include <morphinstance_vertex>\n	#include <morphcolor_vertex>\n	#include <begin_vertex>\n	#include <morphtarget_vertex>\n	#include <project_vertex>\n	gl_PointSize = size;\n	#ifdef USE_SIZEATTENUATION\n		bool isPerspective = isPerspectiveMatrix( projectionMatrix );\n		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );\n	#endif\n	#include <logdepthbuf_vertex>\n	#include <clipping_planes_vertex>\n	#include <worldpos_vertex>\n	#include <fog_vertex>\n}",
		points_frag: "uniform vec3 diffuse;\nuniform float opacity;\n#include <common>\n#include <color_pars_fragment>\n#include <map_particle_pars_fragment>\n#include <alphatest_pars_fragment>\n#include <alphahash_pars_fragment>\n#include <fog_pars_fragment>\n#include <logdepthbuf_pars_fragment>\n#include <clipping_planes_pars_fragment>\nvoid main() {\n	vec4 diffuseColor = vec4( diffuse, opacity );\n	#include <clipping_planes_fragment>\n	vec3 outgoingLight = vec3( 0.0 );\n	#include <logdepthbuf_fragment>\n	#include <map_particle_fragment>\n	#include <color_fragment>\n	#include <alphatest_fragment>\n	#include <alphahash_fragment>\n	outgoingLight = diffuseColor.rgb;\n	#include <opaque_fragment>\n	#include <tonemapping_fragment>\n	#include <colorspace_fragment>\n	#include <fog_fragment>\n	#include <premultiplied_alpha_fragment>\n}",
		shadow_vert: "#include <common>\n#include <batching_pars_vertex>\n#include <fog_pars_vertex>\n#include <morphtarget_pars_vertex>\n#include <skinning_pars_vertex>\n#include <logdepthbuf_pars_vertex>\n#include <shadowmap_pars_vertex>\nvoid main() {\n	#include <batching_vertex>\n	#include <beginnormal_vertex>\n	#include <morphinstance_vertex>\n	#include <morphnormal_vertex>\n	#include <skinbase_vertex>\n	#include <skinnormal_vertex>\n	#include <defaultnormal_vertex>\n	#include <begin_vertex>\n	#include <morphtarget_vertex>\n	#include <skinning_vertex>\n	#include <project_vertex>\n	#include <logdepthbuf_vertex>\n	#include <worldpos_vertex>\n	#include <shadowmap_vertex>\n	#include <fog_vertex>\n}",
		shadow_frag: "uniform vec3 color;\nuniform float opacity;\n#include <common>\n#include <fog_pars_fragment>\n#include <bsdfs>\n#include <lights_pars_begin>\n#include <logdepthbuf_pars_fragment>\n#include <shadowmap_pars_fragment>\n#include <shadowmask_pars_fragment>\nvoid main() {\n	#include <logdepthbuf_fragment>\n	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );\n	#include <tonemapping_fragment>\n	#include <colorspace_fragment>\n	#include <fog_fragment>\n	#include <premultiplied_alpha_fragment>\n}",
		sprite_vert: "uniform float rotation;\nuniform vec2 center;\n#include <common>\n#include <uv_pars_vertex>\n#include <fog_pars_vertex>\n#include <logdepthbuf_pars_vertex>\n#include <clipping_planes_pars_vertex>\nvoid main() {\n	#include <uv_vertex>\n	vec4 mvPosition = modelViewMatrix[ 3 ];\n	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );\n	#ifndef USE_SIZEATTENUATION\n		bool isPerspective = isPerspectiveMatrix( projectionMatrix );\n		if ( isPerspective ) scale *= - mvPosition.z;\n	#endif\n	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;\n	vec2 rotatedPosition;\n	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;\n	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;\n	mvPosition.xy += rotatedPosition;\n	gl_Position = projectionMatrix * mvPosition;\n	#include <logdepthbuf_vertex>\n	#include <clipping_planes_vertex>\n	#include <fog_vertex>\n}",
		sprite_frag: "uniform vec3 diffuse;\nuniform float opacity;\n#include <common>\n#include <uv_pars_fragment>\n#include <map_pars_fragment>\n#include <alphamap_pars_fragment>\n#include <alphatest_pars_fragment>\n#include <alphahash_pars_fragment>\n#include <fog_pars_fragment>\n#include <logdepthbuf_pars_fragment>\n#include <clipping_planes_pars_fragment>\nvoid main() {\n	vec4 diffuseColor = vec4( diffuse, opacity );\n	#include <clipping_planes_fragment>\n	vec3 outgoingLight = vec3( 0.0 );\n	#include <logdepthbuf_fragment>\n	#include <map_fragment>\n	#include <alphamap_fragment>\n	#include <alphatest_fragment>\n	#include <alphahash_fragment>\n	outgoingLight = diffuseColor.rgb;\n	#include <opaque_fragment>\n	#include <tonemapping_fragment>\n	#include <colorspace_fragment>\n	#include <fog_fragment>\n}"
	}, X = {
		common: {
			diffuse: { value: /*@__PURE__*/ new J(16777215) },
			opacity: { value: 1 },
			map: { value: null },
			mapTransform: { value: /*@__PURE__*/ new G() },
			alphaMap: { value: null },
			alphaMapTransform: { value: /*@__PURE__*/ new G() },
			alphaTest: { value: 0 }
		},
		specularmap: {
			specularMap: { value: null },
			specularMapTransform: { value: /*@__PURE__*/ new G() }
		},
		envmap: {
			envMap: { value: null },
			envMapRotation: { value: /*@__PURE__*/ new G() },
			reflectivity: { value: 1 },
			ior: { value: 1.5 },
			refractionRatio: { value: .98 },
			dfgLUT: { value: null }
		},
		aomap: {
			aoMap: { value: null },
			aoMapIntensity: { value: 1 },
			aoMapTransform: { value: /*@__PURE__*/ new G() }
		},
		lightmap: {
			lightMap: { value: null },
			lightMapIntensity: { value: 1 },
			lightMapTransform: { value: /*@__PURE__*/ new G() }
		},
		bumpmap: {
			bumpMap: { value: null },
			bumpMapTransform: { value: /*@__PURE__*/ new G() },
			bumpScale: { value: 1 }
		},
		normalmap: {
			normalMap: { value: null },
			normalMapTransform: { value: /*@__PURE__*/ new G() },
			normalScale: { value: /*@__PURE__*/ new U(1, 1) }
		},
		displacementmap: {
			displacementMap: { value: null },
			displacementMapTransform: { value: /*@__PURE__*/ new G() },
			displacementScale: { value: 1 },
			displacementBias: { value: 0 }
		},
		emissivemap: {
			emissiveMap: { value: null },
			emissiveMapTransform: { value: /*@__PURE__*/ new G() }
		},
		metalnessmap: {
			metalnessMap: { value: null },
			metalnessMapTransform: { value: /*@__PURE__*/ new G() }
		},
		roughnessmap: {
			roughnessMap: { value: null },
			roughnessMapTransform: { value: /*@__PURE__*/ new G() }
		},
		gradientmap: { gradientMap: { value: null } },
		fog: {
			fogDensity: { value: 25e-5 },
			fogNear: { value: 1 },
			fogFar: { value: 2e3 },
			fogColor: { value: /*@__PURE__*/ new J(16777215) }
		},
		lights: {
			ambientLightColor: { value: [] },
			lightProbe: { value: [] },
			directionalLights: {
				value: [],
				properties: {
					direction: {},
					color: {}
				}
			},
			directionalLightShadows: {
				value: [],
				properties: {
					shadowIntensity: 1,
					shadowBias: {},
					shadowNormalBias: {},
					shadowRadius: {},
					shadowMapSize: {}
				}
			},
			directionalShadowMatrix: { value: [] },
			spotLights: {
				value: [],
				properties: {
					color: {},
					position: {},
					direction: {},
					distance: {},
					coneCos: {},
					penumbraCos: {},
					decay: {}
				}
			},
			spotLightShadows: {
				value: [],
				properties: {
					shadowIntensity: 1,
					shadowBias: {},
					shadowNormalBias: {},
					shadowRadius: {},
					shadowMapSize: {}
				}
			},
			spotLightMap: { value: [] },
			spotLightMatrix: { value: [] },
			pointLights: {
				value: [],
				properties: {
					color: {},
					position: {},
					decay: {},
					distance: {}
				}
			},
			pointLightShadows: {
				value: [],
				properties: {
					shadowIntensity: 1,
					shadowBias: {},
					shadowNormalBias: {},
					shadowRadius: {},
					shadowMapSize: {},
					shadowCameraNear: {},
					shadowCameraFar: {}
				}
			},
			pointShadowMatrix: { value: [] },
			hemisphereLights: {
				value: [],
				properties: {
					direction: {},
					skyColor: {},
					groundColor: {}
				}
			},
			rectAreaLights: {
				value: [],
				properties: {
					color: {},
					position: {},
					width: {},
					height: {}
				}
			},
			ltc_1: { value: null },
			ltc_2: { value: null },
			probesSH: { value: null },
			probesMin: { value: /*@__PURE__*/ new W() },
			probesMax: { value: /*@__PURE__*/ new W() },
			probesResolution: { value: /*@__PURE__*/ new W() }
		},
		points: {
			diffuse: { value: /*@__PURE__*/ new J(16777215) },
			opacity: { value: 1 },
			size: { value: 1 },
			scale: { value: 1 },
			map: { value: null },
			alphaMap: { value: null },
			alphaMapTransform: { value: /*@__PURE__*/ new G() },
			alphaTest: { value: 0 },
			uvTransform: { value: /*@__PURE__*/ new G() }
		},
		sprite: {
			diffuse: { value: /*@__PURE__*/ new J(16777215) },
			opacity: { value: 1 },
			center: { value: /*@__PURE__*/ new U(.5, .5) },
			rotation: { value: 0 },
			map: { value: null },
			mapTransform: { value: /*@__PURE__*/ new G() },
			alphaMap: { value: null },
			alphaMapTransform: { value: /*@__PURE__*/ new G() },
			alphaTest: { value: 0 }
		}
	}, au = {
		basic: {
			uniforms: /*@__PURE__*/ Be([
				X.common,
				X.specularmap,
				X.envmap,
				X.aomap,
				X.lightmap,
				X.fog
			]),
			vertexShader: Y.meshbasic_vert,
			fragmentShader: Y.meshbasic_frag
		},
		lambert: {
			uniforms: /*@__PURE__*/ Be([
				X.common,
				X.specularmap,
				X.envmap,
				X.aomap,
				X.lightmap,
				X.emissivemap,
				X.bumpmap,
				X.normalmap,
				X.displacementmap,
				X.fog,
				X.lights,
				{
					emissive: { value: /*@__PURE__*/ new J(0) },
					envMapIntensity: { value: 1 }
				}
			]),
			vertexShader: Y.meshlambert_vert,
			fragmentShader: Y.meshlambert_frag
		},
		phong: {
			uniforms: /*@__PURE__*/ Be([
				X.common,
				X.specularmap,
				X.envmap,
				X.aomap,
				X.lightmap,
				X.emissivemap,
				X.bumpmap,
				X.normalmap,
				X.displacementmap,
				X.fog,
				X.lights,
				{
					emissive: { value: /*@__PURE__*/ new J(0) },
					specular: { value: /*@__PURE__*/ new J(1118481) },
					shininess: { value: 30 },
					envMapIntensity: { value: 1 }
				}
			]),
			vertexShader: Y.meshphong_vert,
			fragmentShader: Y.meshphong_frag
		},
		standard: {
			uniforms: /*@__PURE__*/ Be([
				X.common,
				X.envmap,
				X.aomap,
				X.lightmap,
				X.emissivemap,
				X.bumpmap,
				X.normalmap,
				X.displacementmap,
				X.roughnessmap,
				X.metalnessmap,
				X.fog,
				X.lights,
				{
					emissive: { value: /*@__PURE__*/ new J(0) },
					roughness: { value: 1 },
					metalness: { value: 0 },
					envMapIntensity: { value: 1 }
				}
			]),
			vertexShader: Y.meshphysical_vert,
			fragmentShader: Y.meshphysical_frag
		},
		toon: {
			uniforms: /*@__PURE__*/ Be([
				X.common,
				X.aomap,
				X.lightmap,
				X.emissivemap,
				X.bumpmap,
				X.normalmap,
				X.displacementmap,
				X.gradientmap,
				X.fog,
				X.lights,
				{ emissive: { value: /*@__PURE__*/ new J(0) } }
			]),
			vertexShader: Y.meshtoon_vert,
			fragmentShader: Y.meshtoon_frag
		},
		matcap: {
			uniforms: /*@__PURE__*/ Be([
				X.common,
				X.bumpmap,
				X.normalmap,
				X.displacementmap,
				X.fog,
				{ matcap: { value: null } }
			]),
			vertexShader: Y.meshmatcap_vert,
			fragmentShader: Y.meshmatcap_frag
		},
		points: {
			uniforms: /*@__PURE__*/ Be([X.points, X.fog]),
			vertexShader: Y.points_vert,
			fragmentShader: Y.points_frag
		},
		dashed: {
			uniforms: /*@__PURE__*/ Be([
				X.common,
				X.fog,
				{
					scale: { value: 1 },
					dashSize: { value: 1 },
					totalSize: { value: 2 }
				}
			]),
			vertexShader: Y.linedashed_vert,
			fragmentShader: Y.linedashed_frag
		},
		depth: {
			uniforms: /*@__PURE__*/ Be([X.common, X.displacementmap]),
			vertexShader: Y.depth_vert,
			fragmentShader: Y.depth_frag
		},
		normal: {
			uniforms: /*@__PURE__*/ Be([
				X.common,
				X.bumpmap,
				X.normalmap,
				X.displacementmap,
				{ opacity: { value: 1 } }
			]),
			vertexShader: Y.meshnormal_vert,
			fragmentShader: Y.meshnormal_frag
		},
		sprite: {
			uniforms: /*@__PURE__*/ Be([X.sprite, X.fog]),
			vertexShader: Y.sprite_vert,
			fragmentShader: Y.sprite_frag
		},
		background: {
			uniforms: {
				uvTransform: { value: /*@__PURE__*/ new G() },
				t2D: { value: null },
				backgroundIntensity: { value: 1 }
			},
			vertexShader: Y.background_vert,
			fragmentShader: Y.background_frag
		},
		backgroundCube: {
			uniforms: {
				envMap: { value: null },
				backgroundBlurriness: { value: 0 },
				backgroundIntensity: { value: 1 },
				backgroundRotation: { value: /*@__PURE__*/ new G() }
			},
			vertexShader: Y.backgroundCube_vert,
			fragmentShader: Y.backgroundCube_frag
		},
		cube: {
			uniforms: {
				tCube: { value: null },
				tFlip: { value: -1 },
				opacity: { value: 1 }
			},
			vertexShader: Y.cube_vert,
			fragmentShader: Y.cube_frag
		},
		equirect: {
			uniforms: { tEquirect: { value: null } },
			vertexShader: Y.equirect_vert,
			fragmentShader: Y.equirect_frag
		},
		distance: {
			uniforms: /*@__PURE__*/ Be([
				X.common,
				X.displacementmap,
				{
					referencePosition: { value: /*@__PURE__*/ new W() },
					nearDistance: { value: 1 },
					farDistance: { value: 1e3 }
				}
			]),
			vertexShader: Y.distance_vert,
			fragmentShader: Y.distance_frag
		},
		shadow: {
			uniforms: /*@__PURE__*/ Be([
				X.lights,
				X.fog,
				{
					color: { value: /*@__PURE__*/ new J(0) },
					opacity: { value: 1 }
				}
			]),
			vertexShader: Y.shadow_vert,
			fragmentShader: Y.shadow_frag
		}
	}, au.physical = {
		uniforms: /*@__PURE__*/ Be([au.standard.uniforms, {
			clearcoat: { value: 0 },
			clearcoatMap: { value: null },
			clearcoatMapTransform: { value: /*@__PURE__*/ new G() },
			clearcoatNormalMap: { value: null },
			clearcoatNormalMapTransform: { value: /*@__PURE__*/ new G() },
			clearcoatNormalScale: { value: /*@__PURE__*/ new U(1, 1) },
			clearcoatRoughness: { value: 0 },
			clearcoatRoughnessMap: { value: null },
			clearcoatRoughnessMapTransform: { value: /*@__PURE__*/ new G() },
			dispersion: { value: 0 },
			iridescence: { value: 0 },
			iridescenceMap: { value: null },
			iridescenceMapTransform: { value: /*@__PURE__*/ new G() },
			iridescenceIOR: { value: 1.3 },
			iridescenceThicknessMinimum: { value: 100 },
			iridescenceThicknessMaximum: { value: 400 },
			iridescenceThicknessMap: { value: null },
			iridescenceThicknessMapTransform: { value: /*@__PURE__*/ new G() },
			sheen: { value: 0 },
			sheenColor: { value: /*@__PURE__*/ new J(0) },
			sheenColorMap: { value: null },
			sheenColorMapTransform: { value: /*@__PURE__*/ new G() },
			sheenRoughness: { value: 1 },
			sheenRoughnessMap: { value: null },
			sheenRoughnessMapTransform: { value: /*@__PURE__*/ new G() },
			transmission: { value: 0 },
			transmissionMap: { value: null },
			transmissionMapTransform: { value: /*@__PURE__*/ new G() },
			transmissionSamplerSize: { value: /*@__PURE__*/ new U() },
			transmissionSamplerMap: { value: null },
			thickness: { value: 0 },
			thicknessMap: { value: null },
			thicknessMapTransform: { value: /*@__PURE__*/ new G() },
			attenuationDistance: { value: 0 },
			attenuationColor: { value: /*@__PURE__*/ new J(0) },
			specularColor: { value: /*@__PURE__*/ new J(1, 1, 1) },
			specularColorMap: { value: null },
			specularColorMapTransform: { value: /*@__PURE__*/ new G() },
			specularIntensity: { value: 1 },
			specularIntensityMap: { value: null },
			specularIntensityMapTransform: { value: /*@__PURE__*/ new G() },
			anisotropyVector: { value: /*@__PURE__*/ new U() },
			anisotropyMap: { value: null },
			anisotropyMapTransform: { value: /*@__PURE__*/ new G() }
		}]),
		vertexShader: Y.meshphysical_vert,
		fragmentShader: Y.meshphysical_frag
	}, ou = {
		r: 0,
		b: 0,
		g: 0
	}, su = /*@__PURE__*/ new q(), cu = /*@__PURE__*/ new G(), cu.set(-1, 0, 0, 0, 1, 0, 0, 0, 1), lu = 4, uu = [
		.125,
		.215,
		.35,
		.446,
		.526,
		.582
	], du = 20, fu = 256, pu = /*@__PURE__*/ new ws(), mu = /*@__PURE__*/ new J(), hu = null, gu = 0, _u = 0, vu = !1, yu = /*@__PURE__*/ new W(), bu = class {
		constructor(e) {
			this._renderer = e, this._pingPongRenderTarget = null, this._lodMax = 0, this._cubeSize = 0, this._sizeLods = [], this._sigmas = [], this._lodMeshes = [], this._backgroundBox = null, this._cubemapMaterial = null, this._equirectMaterial = null, this._blurMaterial = null, this._ggxMaterial = null;
		}
		fromScene(e, t = 0, n = .1, r = 100, i = {}) {
			let { size: a = 256, position: o = yu } = i;
			hu = this._renderer.getRenderTarget(), gu = this._renderer.getActiveCubeFace(), _u = this._renderer.getActiveMipmapLevel(), vu = this._renderer.xr.enabled, this._renderer.xr.enabled = !1, this._setSize(a);
			let s = this._allocateTargets();
			return s.depthBuffer = !0, this._sceneToCubeUV(e, n, r, s, o), t > 0 && this._blur(s, 0, 0, t), this._applyPMREM(s), this._cleanup(s), s;
		}
		fromEquirectangular(e, t = null) {
			return this._fromTexture(e, t);
		}
		fromCubemap(e, t = null) {
			return this._fromTexture(e, t);
		}
		compileCubemapShader() {
			this._cubemapMaterial === null && (this._cubemapMaterial = pc(), this._compileMaterial(this._cubemapMaterial));
		}
		compileEquirectangularShader() {
			this._equirectMaterial === null && (this._equirectMaterial = fc(), this._compileMaterial(this._equirectMaterial));
		}
		dispose() {
			this._dispose(), this._cubemapMaterial !== null && this._cubemapMaterial.dispose(), this._equirectMaterial !== null && this._equirectMaterial.dispose(), this._backgroundBox !== null && (this._backgroundBox.geometry.dispose(), this._backgroundBox.material.dispose());
		}
		_setSize(e) {
			this._lodMax = Math.floor(Math.log2(e)), this._cubeSize = 2 ** this._lodMax;
		}
		_dispose() {
			this._blurMaterial !== null && this._blurMaterial.dispose(), this._ggxMaterial !== null && this._ggxMaterial.dispose(), this._pingPongRenderTarget !== null && this._pingPongRenderTarget.dispose();
			for (let e = 0; e < this._lodMeshes.length; e++) this._lodMeshes[e].geometry.dispose();
		}
		_cleanup(e) {
			this._renderer.setRenderTarget(hu, gu, _u), this._renderer.xr.enabled = vu, e.scissorTest = !1, lc(e, 0, 0, e.width, e.height);
		}
		_fromTexture(e, t) {
			e.mapping === 301 || e.mapping === 302 ? this._setSize(e.image.length === 0 ? 16 : e.image[0].width || e.image[0].image.width) : this._setSize(e.image.width / 4), hu = this._renderer.getRenderTarget(), gu = this._renderer.getActiveCubeFace(), _u = this._renderer.getActiveMipmapLevel(), vu = this._renderer.xr.enabled, this._renderer.xr.enabled = !1;
			let n = t || this._allocateTargets();
			return this._textureToCubeUV(e, n), this._applyPMREM(n), this._cleanup(n), n;
		}
		_allocateTargets() {
			let e = 3 * Math.max(this._cubeSize, 112), t = 4 * this._cubeSize, n = {
				magFilter: ht,
				minFilter: ht,
				generateMipmaps: !1,
				type: Tt,
				format: Nt,
				colorSpace: In,
				depthBuffer: !1
			}, r = cc(e, t, n);
			if (this._pingPongRenderTarget === null || this._pingPongRenderTarget.width !== e || this._pingPongRenderTarget.height !== t) {
				this._pingPongRenderTarget !== null && this._dispose(), this._pingPongRenderTarget = cc(e, t, n);
				let { _lodMax: r } = this;
				({lodMeshes: this._lodMeshes, sizeLods: this._sizeLods, sigmas: this._sigmas} = sc(r)), this._blurMaterial = dc(r, e, t), this._ggxMaterial = uc(r, e, t);
			}
			return r;
		}
		_compileMaterial(e) {
			let t = new ma(new Hi(), e);
			this._renderer.compile(t, pu);
		}
		_sceneToCubeUV(e, t, n, r, i) {
			let a = new ys(90, 1, t, n), o = [
				1,
				-1,
				1,
				1,
				1,
				1
			], s = [
				1,
				1,
				1,
				-1,
				-1,
				-1
			], c = this._renderer, l = c.autoClear, u = c.toneMapping;
			c.getClearColor(mu), c.toneMapping = 0, c.autoClear = !1, c.state.buffers.depth.getReversed() && (c.setRenderTarget(r), c.clearDepth(), c.setRenderTarget(null)), this._backgroundBox === null && (this._backgroundBox = new ma(new _o(), new na({
				name: "PMREM.Background",
				side: 1,
				depthWrite: !1,
				depthTest: !1
			})));
			let d = this._backgroundBox, f = d.material, p = !1, m = e.background;
			m ? m.isColor && (f.color.copy(m), e.background = null, p = !0) : (f.color.copy(mu), p = !0);
			for (let t = 0; t < 6; t++) {
				let n = t % 3;
				n === 0 ? (a.up.set(0, o[t], 0), a.position.set(i.x, i.y, i.z), a.lookAt(i.x + s[t], i.y, i.z)) : n === 1 ? (a.up.set(0, 0, o[t]), a.position.set(i.x, i.y, i.z), a.lookAt(i.x, i.y + s[t], i.z)) : (a.up.set(0, o[t], 0), a.position.set(i.x, i.y, i.z), a.lookAt(i.x, i.y, i.z + s[t]));
				let l = this._cubeSize;
				lc(r, n * l, t > 2 ? l : 0, l, l), c.setRenderTarget(r), p && c.render(d, a), c.render(e, a);
			}
			c.toneMapping = u, c.autoClear = l, e.background = m;
		}
		_textureToCubeUV(e, t) {
			let n = this._renderer, r = e.mapping === 301 || e.mapping === 302;
			r ? (this._cubemapMaterial === null && (this._cubemapMaterial = pc()), this._cubemapMaterial.uniforms.flipEnvMap.value = e.isRenderTargetTexture === !1 ? -1 : 1) : this._equirectMaterial === null && (this._equirectMaterial = fc());
			let i = r ? this._cubemapMaterial : this._equirectMaterial, a = this._lodMeshes[0];
			a.material = i;
			let o = i.uniforms;
			o.envMap.value = e;
			let s = this._cubeSize;
			lc(t, 0, 0, 3 * s, 2 * s), n.setRenderTarget(t), n.render(a, pu);
		}
		_applyPMREM(e) {
			let t = this._renderer, n = t.autoClear;
			t.autoClear = !1;
			let r = this._lodMeshes.length;
			for (let t = 1; t < r; t++) this._applyGGXFilter(e, t - 1, t);
			t.autoClear = n;
		}
		_applyGGXFilter(e, t, n) {
			let r = this._renderer, i = this._pingPongRenderTarget, a = this._ggxMaterial, o = this._lodMeshes[n];
			o.material = a;
			let s = a.uniforms, c = n / (this._lodMeshes.length - 1), l = t / (this._lodMeshes.length - 1), u = Math.sqrt(c * c - l * l) * (0 + c * 1.25), { _lodMax: d } = this, f = this._sizeLods[n], p = 3 * f * (n > d - lu ? n - d + lu : 0), m = 4 * (this._cubeSize - f);
			s.envMap.value = e.texture, s.roughness.value = u, s.mipInt.value = d - t, lc(i, p, m, 3 * f, 2 * f), r.setRenderTarget(i), r.render(o, pu), s.envMap.value = i.texture, s.roughness.value = 0, s.mipInt.value = d - n, lc(e, p, m, 3 * f, 2 * f), r.setRenderTarget(e), r.render(o, pu);
		}
		_blur(e, t, n, r, i) {
			let a = this._pingPongRenderTarget;
			this._halfBlur(e, a, t, n, r, "latitudinal", i), this._halfBlur(a, e, n, n, r, "longitudinal", i);
		}
		_halfBlur(e, t, n, r, i, a, o) {
			let s = this._renderer, c = this._blurMaterial;
			a !== "latitudinal" && a !== "longitudinal" && d("blur direction must be either latitudinal or longitudinal!");
			let l = this._lodMeshes[r];
			l.material = c;
			let f = c.uniforms, p = this._sizeLods[n] - 1, m = isFinite(i) ? Math.PI / (2 * p) : 2 * Math.PI / 39, h = i / m, g = isFinite(i) ? 1 + Math.floor(3 * h) : du;
			g > du && u(`sigmaRadians, ${i}, is too large and will clip, as it requested ${g} samples when the maximum is set to ${du}`);
			let _ = [], v = 0;
			for (let e = 0; e < du; ++e) {
				let t = e / h, n = Math.exp(-t * t / 2);
				_.push(n), e === 0 ? v += n : e < g && (v += 2 * n);
			}
			for (let e = 0; e < _.length; e++) _[e] = _[e] / v;
			f.envMap.value = e.texture, f.samples.value = g, f.weights.value = _, f.latitudinal.value = a === "latitudinal", o && (f.poleAxis.value = o);
			let { _lodMax: y } = this;
			f.dTheta.value = m, f.mipInt.value = y - n;
			let b = this._sizeLods[r];
			lc(t, 3 * b * (r > y - lu ? r - y + lu : 0), 4 * (this._cubeSize - b), 3 * b, 2 * b), s.setRenderTarget(t), s.render(l, pu);
		}
	}, xu = class extends fr {
		constructor(e = 1, t = {}) {
			super(e, e, t), this.isWebGLCubeRenderTarget = !0;
			let n = {
				width: e,
				height: e,
				depth: 1
			}, r = [
				n,
				n,
				n,
				n,
				n,
				n
			];
			this.texture = new po(r), this._setTextureOptions(t), this.texture.isRenderTargetTexture = !0;
		}
		fromEquirectangularTexture(e, t) {
			this.texture.type = t.type, this.texture.colorSpace = t.colorSpace, this.texture.generateMipmaps = t.generateMipmaps, this.texture.minFilter = t.minFilter, this.texture.magFilter = t.magFilter;
			let n = {
				uniforms: { tEquirect: { value: null } },
				vertexShader: "\n\n				varying vec3 vWorldDirection;\n\n				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {\n\n					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );\n\n				}\n\n				void main() {\n\n					vWorldDirection = transformDirection( position, modelMatrix );\n\n					#include <begin_vertex>\n					#include <project_vertex>\n\n				}\n			",
				fragmentShader: "\n\n				uniform sampler2D tEquirect;\n\n				varying vec3 vWorldDirection;\n\n				#include <common>\n\n				void main() {\n\n					vec3 direction = normalize( vWorldDirection );\n\n					vec2 sampleUV = equirectUv( direction );\n\n					gl_FragColor = texture2D( tEquirect, sampleUV );\n\n				}\n			"
			}, r = new _o(5, 5, 5), i = new ko({
				name: "CubemapFromEquirect",
				uniforms: ze(n.uniforms),
				vertexShader: n.vertexShader,
				fragmentShader: n.fragmentShader,
				side: 1,
				blending: 0
			});
			i.uniforms.tEquirect.value = t;
			let a = new ma(r, i), o = t.minFilter;
			return t.minFilter === 1008 && (t.minFilter = ht), new Ps(1, 10, this).update(e, a), t.minFilter = o, a.geometry.dispose(), a.material.dispose(), this;
		}
		clear(e, t = !0, n = !0, r = !0) {
			let i = e.getRenderTarget();
			for (let i = 0; i < 6; i++) e.setRenderTarget(this, i), e.clear(t, n, r);
			e.setRenderTarget(i);
		}
	}, Su = {
		1: "LINEAR_TONE_MAPPING",
		2: "REINHARD_TONE_MAPPING",
		3: "CINEON_TONE_MAPPING",
		4: "ACES_FILMIC_TONE_MAPPING",
		6: "AGX_TONE_MAPPING",
		7: "NEUTRAL_TONE_MAPPING",
		5: "CUSTOM_TONE_MAPPING"
	}, Cu = /*@__PURE__*/ new lr(), wu = /*@__PURE__*/ new mo(1, 1), Tu = /*@__PURE__*/ new pr(), Eu = /*@__PURE__*/ new mr(), Du = /*@__PURE__*/ new po(), Ou = [], ku = [], Au = /* @__PURE__ */ new Float32Array(16), ju = /* @__PURE__ */ new Float32Array(9), Mu = /* @__PURE__ */ new Float32Array(4), Nu = class {
		constructor(e, t, n) {
			this.id = e, this.addr = n, this.cache = [], this.type = t.type, this.setValue = Kc(t.type);
		}
	}, Pu = class {
		constructor(e, t, n) {
			this.id = e, this.addr = n, this.cache = [], this.type = t.type, this.size = t.size, this.setValue = fl(t.type);
		}
	}, Fu = class {
		constructor(e) {
			this.id = e, this.seq = [], this.map = {};
		}
		setValue(e, t, n) {
			let r = this.seq;
			for (let i = 0, a = r.length; i !== a; ++i) {
				let a = r[i];
				a.setValue(e, t[a.id], n);
			}
		}
	}, Iu = /(\w+)(\])?(\[|\.)?/g, Lu = class {
		constructor(e, t) {
			this.seq = [], this.map = {};
			let n = e.getProgramParameter(t, e.ACTIVE_UNIFORMS);
			for (let r = 0; r < n; ++r) {
				let n = e.getActiveUniform(t, r);
				ml(n, e.getUniformLocation(t, n.name), this);
			}
			let r = [], i = [];
			for (let t of this.seq) t.type === e.SAMPLER_2D_SHADOW || t.type === e.SAMPLER_CUBE_SHADOW || t.type === e.SAMPLER_2D_ARRAY_SHADOW ? r.push(t) : i.push(t);
			r.length > 0 && (this.seq = r.concat(i));
		}
		setValue(e, t, n, r) {
			let i = this.map[t];
			i !== void 0 && i.setValue(e, n, r);
		}
		setOptional(e, t, n) {
			let r = t[n];
			r !== void 0 && this.setValue(e, n, r);
		}
		static upload(e, t, n, r) {
			for (let i = 0, a = t.length; i !== a; ++i) {
				let a = t[i], o = n[a.id];
				o.needsUpdate !== !1 && a.setValue(e, o.value, r);
			}
		}
		static seqWithValue(e, t) {
			let n = [];
			for (let r = 0, i = e.length; r !== i; ++r) {
				let i = e[r];
				i.id in t && n.push(i);
			}
			return n;
		}
	}, Ru = 37297, zu = 0, Bu = /*@__PURE__*/ new G(), Vu = {
		1: "Linear",
		2: "Reinhard",
		3: "Cineon",
		4: "ACESFilmic",
		6: "AgX",
		7: "Neutral",
		5: "Custom"
	}, Hu = /*@__PURE__*/ new W(), Uu = /^[ \t]*#include +<([\w\d./]+)>/gm, Wu = /* @__PURE__ */ new Map(), Gu = /#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g, Ku = {
		1: "SHADOWMAP_TYPE_PCF",
		3: "SHADOWMAP_TYPE_VSM"
	}, qu = {
		301: "ENVMAP_TYPE_CUBE",
		302: "ENVMAP_TYPE_CUBE",
		306: "ENVMAP_TYPE_CUBE_UV"
	}, Ju = { 302: "ENVMAP_MODE_REFRACTION" }, Yu = {
		0: "ENVMAP_BLENDING_MULTIPLY",
		1: "ENVMAP_BLENDING_MIX",
		2: "ENVMAP_BLENDING_ADD"
	}, Xu = 0, Zu = class {
		constructor() {
			this.shaderCache = /* @__PURE__ */ new Map(), this.materialCache = /* @__PURE__ */ new Map();
		}
		update(e, t, n) {
			let r = this._getShaderCacheForMaterial(e);
			return r.has(t) === !1 && (r.add(t), t.usedTimes++), r.has(n) === !1 && (r.add(n), n.usedTimes++), this;
		}
		remove(e) {
			let t = this.materialCache.get(e);
			for (let e of t) e.usedTimes--, e.usedTimes === 0 && this.shaderCache.delete(e.code);
			return this.materialCache.delete(e), this;
		}
		getVertexShaderStage(e) {
			return this._getShaderStage(e.vertexShader);
		}
		getFragmentShaderStage(e) {
			return this._getShaderStage(e.fragmentShader);
		}
		dispose() {
			this.shaderCache.clear(), this.materialCache.clear();
		}
		_getShaderCacheForMaterial(e) {
			let t = this.materialCache, n = t.get(e);
			return n === void 0 && (n = /* @__PURE__ */ new Set(), t.set(e, n)), n;
		}
		_getShaderStage(e) {
			let t = this.shaderCache, n = t.get(e);
			return n === void 0 && (n = new Qu(e), t.set(e, n)), n;
		}
	}, Qu = class {
		constructor(e) {
			this.id = Xu++, this.code = e, this.usedTimes = 0;
		}
	}, $u = 0, ed = "void main() {\n	gl_Position = vec4( position, 1.0 );\n}", td = "uniform sampler2D shadow_pass;\nuniform vec2 resolution;\nuniform float radius;\nvoid main() {\n	const float samples = float( VSM_SAMPLES );\n	float mean = 0.0;\n	float squared_mean = 0.0;\n	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );\n	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;\n	for ( float i = 0.0; i < samples; i ++ ) {\n		float uvOffset = uvStart + i * uvStride;\n		#ifdef HORIZONTAL_PASS\n			vec2 distribution = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ).rg;\n			mean += distribution.x;\n			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;\n		#else\n			float depth = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ).r;\n			mean += depth;\n			squared_mean += depth * depth;\n		#endif\n	}\n	mean = mean / samples;\n	squared_mean = squared_mean / samples;\n	float std_dev = sqrt( max( 0.0, squared_mean - mean * mean ) );\n	gl_FragColor = vec4( mean, std_dev, 0.0, 1.0 );\n}", nd = [
		/*@__PURE__*/ new W(1, 0, 0),
		/*@__PURE__*/ new W(-1, 0, 0),
		/*@__PURE__*/ new W(0, 1, 0),
		/*@__PURE__*/ new W(0, -1, 0),
		/*@__PURE__*/ new W(0, 0, 1),
		/*@__PURE__*/ new W(0, 0, -1)
	], rd = [
		/*@__PURE__*/ new W(0, -1, 0),
		/*@__PURE__*/ new W(0, -1, 0),
		/*@__PURE__*/ new W(0, 0, 1),
		/*@__PURE__*/ new W(0, 0, -1),
		/*@__PURE__*/ new W(0, -1, 0),
		/*@__PURE__*/ new W(0, -1, 0)
	], id = /*@__PURE__*/ new q(), ad = /*@__PURE__*/ new W(), od = /*@__PURE__*/ new W(), sd = "\nvoid main() {\n\n	gl_Position = vec4( position, 1.0 );\n\n}", cd = "\nuniform sampler2DArray depthColor;\nuniform float depthWidth;\nuniform float depthHeight;\n\nvoid main() {\n\n	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );\n\n	if ( coord.x >= 1.0 ) {\n\n		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;\n\n	} else {\n\n		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;\n\n	}\n\n}", ld = class {
		constructor() {
			this.texture = null, this.mesh = null, this.depthNear = 0, this.depthFar = 0;
		}
		init(e, t) {
			if (this.texture === null) {
				let n = new go(e.texture);
				(e.depthNear !== t.depthNear || e.depthFar !== t.depthFar) && (this.depthNear = e.depthNear, this.depthFar = e.depthFar), this.texture = n;
			}
		}
		getMesh(e) {
			if (this.texture !== null && this.mesh === null) {
				let t = e.cameras[0].viewport, n = new ko({
					vertexShader: sd,
					fragmentShader: cd,
					uniforms: {
						depthColor: { value: this.texture },
						depthWidth: { value: t.z },
						depthHeight: { value: t.w }
					}
				});
				this.mesh = new ma(new wo(20, 20), n);
			}
			return this.mesh;
		}
		reset() {
			this.texture = null, this.mesh = null;
		}
		getDepthTexture() {
			return this.texture;
		}
	}, ud = class extends Gn {
		constructor(e, t) {
			super();
			let n = this, r = null, i = 1, a = null, o = "local-floor", s = 1, c = null, l = null, d = null, f = null, p = null, m = null, h = typeof XRWebGLBinding < "u", g = new ld(), _ = {}, v = t.getContextAttributes(), y = null, b = null, x = [], S = [], C = new U(), w = null, T = new ys();
			T.viewport = new ur();
			let E = new ys();
			E.viewport = new ur();
			let D = [T, E], O = new Fs(), k = null, A = null;
			this.cameraAutoUpdate = !0, this.enabled = !1, this.isPresenting = !1, this.getController = function(e) {
				let t = x[e];
				return t === void 0 && (t = new Wr(), x[e] = t), t.getTargetRaySpace();
			}, this.getControllerGrip = function(e) {
				let t = x[e];
				return t === void 0 && (t = new Wr(), x[e] = t), t.getGripSpace();
			}, this.getHand = function(e) {
				let t = x[e];
				return t === void 0 && (t = new Wr(), x[e] = t), t.getHandSpace();
			};
			function j(e) {
				let t = S.indexOf(e.inputSource);
				if (t === -1) return;
				let n = x[t];
				n !== void 0 && (n.update(e.inputSource, e.frame, c || a), n.dispatchEvent({
					type: e.type,
					data: e.inputSource
				}));
			}
			function M() {
				r.removeEventListener("select", j), r.removeEventListener("selectstart", j), r.removeEventListener("selectend", j), r.removeEventListener("squeeze", j), r.removeEventListener("squeezestart", j), r.removeEventListener("squeezeend", j), r.removeEventListener("end", M), r.removeEventListener("inputsourceschange", ee);
				for (let e = 0; e < x.length; e++) {
					let t = S[e];
					t !== null && (S[e] = null, x[e].disconnect(t));
				}
				k = null, A = null, g.reset();
				for (let e in _) delete _[e];
				e.setRenderTarget(y), p = null, f = null, d = null, r = null, b = null, I.stop(), n.isPresenting = !1, e.setPixelRatio(w), e.setSize(C.width, C.height, !1), n.dispatchEvent({ type: "sessionend" });
			}
			this.setFramebufferScaleFactor = function(e) {
				i = e, n.isPresenting === !0 && u("WebXRManager: Cannot change framebuffer scale while presenting.");
			}, this.setReferenceSpaceType = function(e) {
				o = e, n.isPresenting === !0 && u("WebXRManager: Cannot change reference space type while presenting.");
			}, this.getReferenceSpace = function() {
				return c || a;
			}, this.setReferenceSpace = function(e) {
				c = e;
			}, this.getBaseLayer = function() {
				return f === null ? p : f;
			}, this.getBinding = function() {
				return d === null && h && (d = new XRWebGLBinding(r, t)), d;
			}, this.getFrame = function() {
				return m;
			}, this.getSession = function() {
				return r;
			}, this.setSession = async function(l) {
				if (r = l, r !== null) {
					if (y = e.getRenderTarget(), r.addEventListener("select", j), r.addEventListener("selectstart", j), r.addEventListener("selectend", j), r.addEventListener("squeeze", j), r.addEventListener("squeezestart", j), r.addEventListener("squeezeend", j), r.addEventListener("end", M), r.addEventListener("inputsourceschange", ee), v.xrCompatible !== !0 && await t.makeXRCompatible(), w = e.getPixelRatio(), e.getSize(C), h && "createProjectionLayer" in XRWebGLBinding.prototype) {
						let n = null, a = null, o = null;
						v.depth && (o = v.stencil ? t.DEPTH24_STENCIL8 : t.DEPTH_COMPONENT24, n = v.stencil ? Ft : Pt, a = v.stencil ? Ot : Ct);
						let s = {
							colorFormat: t.RGBA8,
							depthFormat: o,
							scaleFactor: i
						};
						d = this.getBinding(), f = d.createProjectionLayer(s), r.updateRenderState({ layers: [f] }), e.setPixelRatio(1), e.setSize(f.textureWidth, f.textureHeight, !1), b = new fr(f.textureWidth, f.textureHeight, {
							format: Nt,
							type: vt,
							depthTexture: new mo(f.textureWidth, f.textureHeight, a, void 0, void 0, void 0, void 0, void 0, void 0, n),
							stencilBuffer: v.stencil,
							colorSpace: e.outputColorSpace,
							samples: v.antialias ? 4 : 0,
							resolveDepthBuffer: f.ignoreDepthValues === !1,
							resolveStencilBuffer: f.ignoreDepthValues === !1
						});
					} else {
						let n = {
							antialias: v.antialias,
							alpha: !0,
							depth: v.depth,
							stencil: v.stencil,
							framebufferScaleFactor: i
						};
						p = new XRWebGLLayer(r, t, n), r.updateRenderState({ baseLayer: p }), e.setPixelRatio(1), e.setSize(p.framebufferWidth, p.framebufferHeight, !1), b = new fr(p.framebufferWidth, p.framebufferHeight, {
							format: Nt,
							type: vt,
							colorSpace: e.outputColorSpace,
							stencilBuffer: v.stencil,
							resolveDepthBuffer: p.ignoreDepthValues === !1,
							resolveStencilBuffer: p.ignoreDepthValues === !1
						});
					}
					b.isXRRenderTarget = !0, this.setFoveation(s), c = null, a = await r.requestReferenceSpace(o), I.setContext(r), I.start(), n.isPresenting = !0, n.dispatchEvent({ type: "sessionstart" });
				}
			}, this.getEnvironmentBlendMode = function() {
				if (r !== null) return r.environmentBlendMode;
			}, this.getDepthTexture = function() {
				return g.getDepthTexture();
			};
			function ee(e) {
				for (let t = 0; t < e.removed.length; t++) {
					let n = e.removed[t], r = S.indexOf(n);
					r >= 0 && (S[r] = null, x[r].disconnect(n));
				}
				for (let t = 0; t < e.added.length; t++) {
					let n = e.added[t], r = S.indexOf(n);
					if (r === -1) {
						for (let e = 0; e < x.length; e++) if (e >= S.length) {
							S.push(n), r = e;
							break;
						} else if (S[e] === null) {
							S[e] = n, r = e;
							break;
						}
						if (r === -1) break;
					}
					let i = x[r];
					i && i.connect(n);
				}
			}
			let te = new W(), N = new W();
			function ne(e, t, n) {
				te.setFromMatrixPosition(t.matrixWorld), N.setFromMatrixPosition(n.matrixWorld);
				let r = te.distanceTo(N), i = t.projectionMatrix.elements, a = n.projectionMatrix.elements, o = i[14] / (i[10] - 1), s = i[14] / (i[10] + 1), c = (i[9] + 1) / i[5], l = (i[9] - 1) / i[5], u = (i[8] - 1) / i[0], d = (a[8] + 1) / a[0], f = o * u, p = o * d, m = r / (-u + d), h = m * -u;
				if (t.matrixWorld.decompose(e.position, e.quaternion, e.scale), e.translateX(h), e.translateZ(m), e.matrixWorld.compose(e.position, e.quaternion, e.scale), e.matrixWorldInverse.copy(e.matrixWorld).invert(), i[10] === -1) e.projectionMatrix.copy(t.projectionMatrix), e.projectionMatrixInverse.copy(t.projectionMatrixInverse);
				else {
					let t = o + m, n = s + m, i = f - h, a = p + (r - h), u = c * s / n * t, d = l * s / n * t;
					e.projectionMatrix.makePerspective(i, a, u, d, t, n), e.projectionMatrixInverse.copy(e.projectionMatrix).invert();
				}
			}
			function P(e, t) {
				t === null ? e.matrixWorld.copy(e.matrix) : e.matrixWorld.multiplyMatrices(t.matrixWorld, e.matrix), e.matrixWorldInverse.copy(e.matrixWorld).invert();
			}
			this.updateCamera = function(e) {
				if (r === null) return;
				let t = e.near, n = e.far;
				g.texture !== null && (g.depthNear > 0 && (t = g.depthNear), g.depthFar > 0 && (n = g.depthFar)), O.near = E.near = T.near = t, O.far = E.far = T.far = n, (k !== O.near || A !== O.far) && (r.updateRenderState({
					depthNear: O.near,
					depthFar: O.far
				}), k = O.near, A = O.far), O.layers.mask = e.layers.mask | 6, T.layers.mask = O.layers.mask & -5, E.layers.mask = O.layers.mask & -3;
				let i = e.parent, a = O.cameras;
				P(O, i);
				for (let e = 0; e < a.length; e++) P(a[e], i);
				a.length === 2 ? ne(O, T, E) : O.projectionMatrix.copy(T.projectionMatrix), F(e, O, i);
			};
			function F(e, t, n) {
				n === null ? e.matrix.copy(t.matrixWorld) : (e.matrix.copy(n.matrixWorld), e.matrix.invert(), e.matrix.multiply(t.matrixWorld)), e.matrix.decompose(e.position, e.quaternion, e.scale), e.updateMatrixWorld(!0), e.projectionMatrix.copy(t.projectionMatrix), e.projectionMatrixInverse.copy(t.projectionMatrixInverse), e.isPerspectiveCamera && (e.fov = Yn * 2 * Math.atan(1 / e.projectionMatrix.elements[5]), e.zoom = 1);
			}
			this.getCamera = function() {
				return O;
			}, this.getFoveation = function() {
				if (f !== null || p !== null) return s;
			}, this.setFoveation = function(e) {
				s = e, f !== null && (f.fixedFoveation = e), p !== null && p.fixedFoveation !== void 0 && (p.fixedFoveation = e);
			}, this.hasDepthSensing = function() {
				return g.texture !== null;
			}, this.getDepthSensingMesh = function() {
				return g.getMesh(O);
			}, this.getCameraTexture = function(e) {
				return _[e];
			};
			let re = null;
			function ie(t, i) {
				if (l = i.getViewerPose(c || a), m = i, l !== null) {
					let t = l.views;
					p !== null && (e.setRenderTargetFramebuffer(b, p.framebuffer), e.setRenderTarget(b));
					let i = !1;
					t.length !== O.cameras.length && (O.cameras.length = 0, i = !0);
					for (let n = 0; n < t.length; n++) {
						let r = t[n], a = null;
						if (p !== null) a = p.getViewport(r);
						else {
							let t = d.getViewSubImage(f, r);
							a = t.viewport, n === 0 && (e.setRenderTargetTextures(b, t.colorTexture, t.depthStencilTexture), e.setRenderTarget(b));
						}
						let o = D[n];
						o === void 0 && (o = new ys(), o.layers.enable(n), o.viewport = new ur(), D[n] = o), o.matrix.fromArray(r.transform.matrix), o.matrix.decompose(o.position, o.quaternion, o.scale), o.projectionMatrix.fromArray(r.projectionMatrix), o.projectionMatrixInverse.copy(o.projectionMatrix).invert(), o.viewport.set(a.x, a.y, a.width, a.height), n === 0 && (O.matrix.copy(o.matrix), O.matrix.decompose(O.position, O.quaternion, O.scale)), i === !0 && O.cameras.push(o);
					}
					let a = r.enabledFeatures;
					if (a && a.includes("depth-sensing") && r.depthUsage == "gpu-optimized" && h) {
						d = n.getBinding();
						let e = d.getDepthInformation(t[0]);
						e && e.isValid && e.texture && g.init(e, r.renderState);
					}
					if (a && a.includes("camera-access") && h) {
						e.state.unbindTexture(), d = n.getBinding();
						for (let e = 0; e < t.length; e++) {
							let n = t[e].camera;
							if (n) {
								let e = _[n];
								e || (e = new go(), _[n] = e);
								let t = d.getCameraImage(n);
								e.sourceTexture = t;
							}
						}
					}
				}
				for (let e = 0; e < x.length; e++) {
					let t = S[e], n = x[e];
					t !== null && n !== void 0 && n.update(t, i, c || a);
				}
				re && re(t, i), i.detectedPlanes && n.dispatchEvent({
					type: "planesdetected",
					data: i
				}), m = null;
			}
			let I = new ec();
			I.setAnimationLoop(ie), this.setAnimationLoop = function(e) {
				re = e;
			}, this.dispose = function() {};
		}
	}, dd = /*@__PURE__*/ new q(), fd = /*@__PURE__*/ new G(), fd.set(-1, 0, 0, 0, 1, 0, 0, 0, 1), pd = new Uint16Array([
		12469,
		15057,
		12620,
		14925,
		13266,
		14620,
		13807,
		14376,
		14323,
		13990,
		14545,
		13625,
		14713,
		13328,
		14840,
		12882,
		14931,
		12528,
		14996,
		12233,
		15039,
		11829,
		15066,
		11525,
		15080,
		11295,
		15085,
		10976,
		15082,
		10705,
		15073,
		10495,
		13880,
		14564,
		13898,
		14542,
		13977,
		14430,
		14158,
		14124,
		14393,
		13732,
		14556,
		13410,
		14702,
		12996,
		14814,
		12596,
		14891,
		12291,
		14937,
		11834,
		14957,
		11489,
		14958,
		11194,
		14943,
		10803,
		14921,
		10506,
		14893,
		10278,
		14858,
		9960,
		14484,
		14039,
		14487,
		14025,
		14499,
		13941,
		14524,
		13740,
		14574,
		13468,
		14654,
		13106,
		14743,
		12678,
		14818,
		12344,
		14867,
		11893,
		14889,
		11509,
		14893,
		11180,
		14881,
		10751,
		14852,
		10428,
		14812,
		10128,
		14765,
		9754,
		14712,
		9466,
		14764,
		13480,
		14764,
		13475,
		14766,
		13440,
		14766,
		13347,
		14769,
		13070,
		14786,
		12713,
		14816,
		12387,
		14844,
		11957,
		14860,
		11549,
		14868,
		11215,
		14855,
		10751,
		14825,
		10403,
		14782,
		10044,
		14729,
		9651,
		14666,
		9352,
		14599,
		9029,
		14967,
		12835,
		14966,
		12831,
		14963,
		12804,
		14954,
		12723,
		14936,
		12564,
		14917,
		12347,
		14900,
		11958,
		14886,
		11569,
		14878,
		11247,
		14859,
		10765,
		14828,
		10401,
		14784,
		10011,
		14727,
		9600,
		14660,
		9289,
		14586,
		8893,
		14508,
		8533,
		15111,
		12234,
		15110,
		12234,
		15104,
		12216,
		15092,
		12156,
		15067,
		12010,
		15028,
		11776,
		14981,
		11500,
		14942,
		11205,
		14902,
		10752,
		14861,
		10393,
		14812,
		9991,
		14752,
		9570,
		14682,
		9252,
		14603,
		8808,
		14519,
		8445,
		14431,
		8145,
		15209,
		11449,
		15208,
		11451,
		15202,
		11451,
		15190,
		11438,
		15163,
		11384,
		15117,
		11274,
		15055,
		10979,
		14994,
		10648,
		14932,
		10343,
		14871,
		9936,
		14803,
		9532,
		14729,
		9218,
		14645,
		8742,
		14556,
		8381,
		14461,
		8020,
		14365,
		7603,
		15273,
		10603,
		15272,
		10607,
		15267,
		10619,
		15256,
		10631,
		15231,
		10614,
		15182,
		10535,
		15118,
		10389,
		15042,
		10167,
		14963,
		9787,
		14883,
		9447,
		14800,
		9115,
		14710,
		8665,
		14615,
		8318,
		14514,
		7911,
		14411,
		7507,
		14279,
		7198,
		15314,
		9675,
		15313,
		9683,
		15309,
		9712,
		15298,
		9759,
		15277,
		9797,
		15229,
		9773,
		15166,
		9668,
		15084,
		9487,
		14995,
		9274,
		14898,
		8910,
		14800,
		8539,
		14697,
		8234,
		14590,
		7790,
		14479,
		7409,
		14367,
		7067,
		14178,
		6621,
		15337,
		8619,
		15337,
		8631,
		15333,
		8677,
		15325,
		8769,
		15305,
		8871,
		15264,
		8940,
		15202,
		8909,
		15119,
		8775,
		15022,
		8565,
		14916,
		8328,
		14804,
		8009,
		14688,
		7614,
		14569,
		7287,
		14448,
		6888,
		14321,
		6483,
		14088,
		6171,
		15350,
		7402,
		15350,
		7419,
		15347,
		7480,
		15340,
		7613,
		15322,
		7804,
		15287,
		7973,
		15229,
		8057,
		15148,
		8012,
		15046,
		7846,
		14933,
		7611,
		14810,
		7357,
		14682,
		7069,
		14552,
		6656,
		14421,
		6316,
		14251,
		5948,
		14007,
		5528,
		15356,
		5942,
		15356,
		5977,
		15353,
		6119,
		15348,
		6294,
		15332,
		6551,
		15302,
		6824,
		15249,
		7044,
		15171,
		7122,
		15070,
		7050,
		14949,
		6861,
		14818,
		6611,
		14679,
		6349,
		14538,
		6067,
		14398,
		5651,
		14189,
		5311,
		13935,
		4958,
		15359,
		4123,
		15359,
		4153,
		15356,
		4296,
		15353,
		4646,
		15338,
		5160,
		15311,
		5508,
		15263,
		5829,
		15188,
		6042,
		15088,
		6094,
		14966,
		6001,
		14826,
		5796,
		14678,
		5543,
		14527,
		5287,
		14377,
		4985,
		14133,
		4586,
		13869,
		4257,
		15360,
		1563,
		15360,
		1642,
		15358,
		2076,
		15354,
		2636,
		15341,
		3350,
		15317,
		4019,
		15273,
		4429,
		15203,
		4732,
		15105,
		4911,
		14981,
		4932,
		14836,
		4818,
		14679,
		4621,
		14517,
		4386,
		14359,
		4156,
		14083,
		3795,
		13808,
		3437,
		15360,
		122,
		15360,
		137,
		15358,
		285,
		15355,
		636,
		15344,
		1274,
		15322,
		2177,
		15281,
		2765,
		15215,
		3223,
		15120,
		3451,
		14995,
		3569,
		14846,
		3567,
		14681,
		3466,
		14511,
		3305,
		14344,
		3121,
		14037,
		2800,
		13753,
		2467,
		15360,
		0,
		15360,
		1,
		15359,
		21,
		15355,
		89,
		15346,
		253,
		15325,
		479,
		15287,
		796,
		15225,
		1148,
		15133,
		1492,
		15008,
		1749,
		14856,
		1882,
		14685,
		1886,
		14506,
		1783,
		14324,
		1608,
		13996,
		1398,
		13702,
		1183
	]), md = null, hd = class {
		constructor(e = {}) {
			let { canvas: t = s(), context: n = null, depth: r = !0, stencil: i = !1, alpha: a = !1, antialias: o = !1, premultipliedAlpha: l = !0, preserveDrawingBuffer: f = !1, powerPreference: m = "default", failIfMajorPerformanceCaveat: h = !1, reversedDepthBuffer: g = !1, outputBufferType: _ = vt } = e;
			this.isWebGLRenderer = !0;
			let v;
			if (n !== null) {
				if (typeof WebGLRenderingContext < "u" && n instanceof WebGLRenderingContext) throw Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");
				v = n.getContextAttributes().alpha;
			} else v = a;
			let y = _, b = /* @__PURE__ */ new Set([
				Bt,
				zt,
				Lt
			]), x = /* @__PURE__ */ new Set([
				vt,
				Ct,
				xt,
				Ot,
				Et,
				Dt
			]), S = /* @__PURE__ */ new Uint32Array(4), C = /* @__PURE__ */ new Int32Array(4), w = new W(), T = null, E = null, D = [], O = [], k = null;
			this.domElement = t, this.debug = {
				checkShaderErrors: !0,
				onShaderError: null
			}, this.autoClear = !0, this.autoClearColor = !0, this.autoClearDepth = !0, this.autoClearStencil = !0, this.sortObjects = !0, this.clippingPlanes = [], this.localClippingEnabled = !1, this.toneMapping = 0, this.toneMappingExposure = 1, this.transmissionResolutionScale = 1;
			let A = this, j = !1, M = null, ee = null, te = null, N = null;
			this._outputColorSpace = H;
			let ne = 0, P = 0, F = null, re = -1, ie = null, I = new ur(), ae = new ur(), oe = null, se = new J(0), ce = 0, le = t.width, ue = t.height, de = 1, fe = null, pe = null, me = new ur(0, 0, le, ue), he = new ur(0, 0, le, ue), ge = !1, _e = new Ka(), ve = !1, ye = !1, be = new q(), xe = new W(), Se = new ur(), Ce = {
				background: null,
				fog: null,
				environment: null,
				overrideMaterial: null,
				isScene: !0
			}, we = !1;
			function Te() {
				return F === null ? de : 1;
			}
			let L = n;
			function Ee(e, n) {
				return t.getContext(e, n);
			}
			try {
				let e = {
					alpha: !0,
					depth: r,
					stencil: i,
					antialias: o,
					premultipliedAlpha: l,
					preserveDrawingBuffer: f,
					powerPreference: m,
					failIfMajorPerformanceCaveat: h
				};
				if ("setAttribute" in t && t.setAttribute("data-engine", "three.js r185"), t.addEventListener("webglcontextlost", Je, !1), t.addEventListener("webglcontextrestored", Ye, !1), t.addEventListener("webglcontextcreationerror", Xe, !1), L === null) {
					let t = "webgl2";
					if (L = Ee(t, e), L === null) throw Ee(t) ? Error("THREE.WebGLRenderer: Error creating WebGL context with your selected attributes.") : Error("THREE.WebGLRenderer: Error creating WebGL context.");
				}
			} catch (e) {
				throw d("WebGLRenderer: " + e.message), e;
			}
			let De, R, z, Oe, B, V, ke, Ae, je, Me, Ne, Pe, Fe, Ie, Le, Re, ze, Be, Ve, He, Ue, We, Ge;
			function Ke() {
				De = new gc(L), De.init(), Ue = new tu(L, De), R = new ac(L, De, e, Ue), z = new $l(L, De), R.reversedDepthBuffer && g && z.buffers.depth.setReversed(!0), ee = L.createFramebuffer(), te = L.createFramebuffer(), N = L.createFramebuffer(), Oe = new yc(L), B = new Vl(), V = new eu(L, De, z, B, R, Ue, Oe), ke = new hc(A), Ae = new tc(L), We = new rc(L, Ae), je = new _c(L, Ae, Oe, We), Me = new xc(L, je, Ae, We, Oe), Be = new bc(L, R, V), Le = new oc(B), Ne = new Bl(A, ke, De, R, We, Le), Pe = new nu(A, B), Fe = new Gl(), Ie = new Zl(De), ze = new nc(A, ke, z, Me, v, l), Re = new Ql(A, Me, R), Ge = new ru(L, Oe, R, z), Ve = new ic(L, De, Oe), He = new vc(L, De, Oe), Oe.programs = Ne.programs, A.capabilities = R, A.extensions = De, A.properties = B, A.renderLists = Fe, A.shadowMap = Re, A.state = z, A.info = Oe;
			}
			Ke(), y !== 1009 && (k = new Sc(y, t.width, t.height, o, r, i));
			let qe = new ud(A, L);
			this.xr = qe, this.getContext = function() {
				return L;
			}, this.getContextAttributes = function() {
				return L.getContextAttributes();
			}, this.forceContextLoss = function() {
				let e = De.get("WEBGL_lose_context");
				e && e.loseContext();
			}, this.forceContextRestore = function() {
				let e = De.get("WEBGL_lose_context");
				e && e.restoreContext();
			}, this.getPixelRatio = function() {
				return de;
			}, this.setPixelRatio = function(e) {
				e !== void 0 && (de = e, this.setSize(le, ue, !1));
			}, this.getSize = function(e) {
				return e.set(le, ue);
			}, this.setSize = function(e, n, r = !0) {
				if (qe.isPresenting) {
					u("WebGLRenderer: Can't change size while VR device is presenting.");
					return;
				}
				le = e, ue = n, t.width = Math.floor(e * de), t.height = Math.floor(n * de), r === !0 && (t.style.width = e + "px", t.style.height = n + "px"), k !== null && k.setSize(t.width, t.height), this.setViewport(0, 0, e, n);
			}, this.getDrawingBufferSize = function(e) {
				return e.set(le * de, ue * de).floor();
			}, this.setDrawingBufferSize = function(e, n, r) {
				le = e, ue = n, de = r, t.width = Math.floor(e * r), t.height = Math.floor(n * r), this.setViewport(0, 0, e, n);
			}, this.setEffects = function(e) {
				if (y === 1009) {
					d("WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.");
					return;
				}
				if (e) {
					for (let t = 0; t < e.length; t++) if (e[t].isOutputPass === !0) {
						u("WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.");
						break;
					}
				}
				k.setEffects(e || []);
			}, this.getCurrentViewport = function(e) {
				return e.copy(I);
			}, this.getViewport = function(e) {
				return e.copy(me);
			}, this.setViewport = function(e, t, n, r) {
				e.isVector4 ? me.set(e.x, e.y, e.z, e.w) : me.set(e, t, n, r), z.viewport(I.copy(me).multiplyScalar(de).round());
			}, this.getScissor = function(e) {
				return e.copy(he);
			}, this.setScissor = function(e, t, n, r) {
				e.isVector4 ? he.set(e.x, e.y, e.z, e.w) : he.set(e, t, n, r), z.scissor(ae.copy(he).multiplyScalar(de).round());
			}, this.getScissorTest = function() {
				return ge;
			}, this.setScissorTest = function(e) {
				z.setScissorTest(ge = e);
			}, this.setOpaqueSort = function(e) {
				fe = e;
			}, this.setTransparentSort = function(e) {
				pe = e;
			}, this.getClearColor = function(e) {
				return e.copy(ze.getClearColor());
			}, this.setClearColor = function() {
				ze.setClearColor(...arguments);
			}, this.getClearAlpha = function() {
				return ze.getClearAlpha();
			}, this.setClearAlpha = function() {
				ze.setClearAlpha(...arguments);
			}, this.clear = function(e = !0, t = !0, n = !0) {
				let r = 0;
				if (e) {
					let e = !1;
					if (F !== null) {
						let t = F.texture.format;
						e = b.has(t);
					}
					if (e) {
						let e = F.texture.type, t = x.has(e), n = ze.getClearColor(), r = ze.getClearAlpha(), i = n.r, a = n.g, o = n.b;
						t ? (S[0] = i, S[1] = a, S[2] = o, S[3] = r, L.clearBufferuiv(L.COLOR, 0, S)) : (C[0] = i, C[1] = a, C[2] = o, C[3] = r, L.clearBufferiv(L.COLOR, 0, C));
					} else r |= L.COLOR_BUFFER_BIT;
				}
				t && (r |= L.DEPTH_BUFFER_BIT, this.state.buffers.depth.setMask(!0)), n && (r |= L.STENCIL_BUFFER_BIT, this.state.buffers.stencil.setMask(4294967295)), r !== 0 && L.clear(r);
			}, this.clearColor = function() {
				this.clear(!0, !1, !1);
			}, this.clearDepth = function() {
				this.clear(!1, !0, !1);
			}, this.clearStencil = function() {
				this.clear(!1, !1, !0);
			}, this.setNodesHandler = function(e) {
				e.setRenderer(this), M = e;
			}, this.dispose = function() {
				t.removeEventListener("webglcontextlost", Je, !1), t.removeEventListener("webglcontextrestored", Ye, !1), t.removeEventListener("webglcontextcreationerror", Xe, !1), ze.dispose(), Fe.dispose(), Ie.dispose(), B.dispose(), ke.dispose(), Me.dispose(), We.dispose(), Ge.dispose(), Ne.dispose(), qe.dispose(), qe.removeEventListener("sessionstart", rt), qe.removeEventListener("sessionend", it), at.stop();
			};
			function Je(e) {
				e.preventDefault(), c("WebGLRenderer: Context Lost."), j = !0;
			}
			function Ye() {
				c("WebGLRenderer: Context Restored."), j = !1;
				let e = Oe.autoReset, t = Re.enabled, n = Re.autoUpdate, r = Re.needsUpdate, i = Re.type;
				Ke(), Oe.autoReset = e, Re.enabled = t, Re.autoUpdate = n, Re.needsUpdate = r, Re.type = i;
			}
			function Xe(e) {
				d("WebGLRenderer: A WebGL context could not be created. Reason: ", e.statusMessage);
			}
			function Ze(e) {
				let t = e.target;
				t.removeEventListener("dispose", Ze), Qe(t);
			}
			function Qe(e) {
				$e(e), B.remove(e);
			}
			function $e(e) {
				let t = B.get(e).programs;
				t !== void 0 && (t.forEach(function(e) {
					Ne.releaseProgram(e);
				}), e.isShaderMaterial && Ne.releaseShaderCache(e));
			}
			this.renderBufferDirect = function(e, t, n, r, i, a) {
				t === null && (t = Ce);
				let o = i.isMesh && i.matrixWorld.determinantAffine() < 0, s = ht(e, t, n, r, i);
				z.setMaterial(r, o);
				let c = n.index, l = 1;
				if (r.wireframe === !0) {
					if (c = je.getWireframeAttribute(n), c === void 0) return;
					l = 2;
				}
				let u = n.drawRange, d = n.attributes.position, f = u.start * l, p = (u.start + u.count) * l;
				a !== null && (f = Math.max(f, a.start * l), p = Math.min(p, (a.start + a.count) * l)), c === null ? d != null && (f = Math.max(f, 0), p = Math.min(p, d.count)) : (f = Math.max(f, 0), p = Math.min(p, c.count));
				let m = p - f;
				if (m < 0 || m === Infinity) return;
				We.setup(i, r, s, n, c);
				let h, g = Ve;
				if (c !== null && (h = Ae.get(c), g = He, g.setIndex(h)), i.isMesh) r.wireframe === !0 ? (z.setLineWidth(r.wireframeLinewidth * Te()), g.setMode(L.LINES)) : g.setMode(L.TRIANGLES);
				else if (i.isLine) {
					let e = r.linewidth;
					e === void 0 && (e = 1), z.setLineWidth(e * Te()), i.isLineSegments ? g.setMode(L.LINES) : i.isLineLoop ? g.setMode(L.LINE_LOOP) : g.setMode(L.LINE_STRIP);
				} else i.isPoints ? g.setMode(L.POINTS) : i.isSprite && g.setMode(L.TRIANGLES);
				if (i.isBatchedMesh) {
					if (De.get("WEBGL_multi_draw")) g.renderMultiDraw(i._multiDrawStarts, i._multiDrawCounts, i._multiDrawCount);
					else {
						let e = i._multiDrawStarts, t = i._multiDrawCounts, n = i._multiDrawCount, a = c ? Ae.get(c).bytesPerElement : 1, o = B.get(r).currentProgram.getUniforms();
						for (let r = 0; r < n; r++) o.setValue(L, "_gl_DrawID", r), g.render(e[r] / a, t[r]);
					}
				} else if (i.isInstancedMesh) g.renderInstances(f, m, i.count);
				else if (n.isInstancedBufferGeometry) {
					let e = n._maxInstanceCount === void 0 ? Infinity : n._maxInstanceCount, t = Math.min(n.instanceCount, e);
					g.renderInstances(f, m, t);
				} else g.render(f, m);
			};
			function et(e, t, n) {
				e.transparent === !0 && e.side === 2 && e.forceSinglePass === !1 ? (e.side = 1, e.needsUpdate = !0, dt(e, t, n), e.side = 0, e.needsUpdate = !0, dt(e, t, n), e.side = 2) : dt(e, t, n);
			}
			this.compile = function(e, t, n = null) {
				n === null && (n = e), E = Ie.get(n), E.init(t), O.push(E), n.traverseVisible(function(e) {
					e.isLight && e.layers.test(t.layers) && (E.pushLight(e), e.castShadow && E.pushShadow(e));
				}), e !== n && e.traverseVisible(function(e) {
					e.isLight && e.layers.test(t.layers) && (E.pushLight(e), e.castShadow && E.pushShadow(e));
				}), E.setupLights();
				let r = /* @__PURE__ */ new Set();
				return e.traverse(function(e) {
					if (!(e.isMesh || e.isPoints || e.isLine || e.isSprite)) return;
					let t = e.material;
					if (t) {
						if (Array.isArray(t)) for (let i = 0; i < t.length; i++) {
							let a = t[i];
							et(a, n, e), r.add(a);
						}
						else et(t, n, e), r.add(t);
					}
				}), E = O.pop(), r;
			}, this.compileAsync = function(e, t, n = null) {
				let r = this.compile(e, t, n);
				return new Promise((t) => {
					function n() {
						if (r.forEach(function(e) {
							B.get(e).currentProgram.isReady() && r.delete(e);
						}), r.size === 0) {
							t(e);
							return;
						}
						setTimeout(n, 10);
					}
					De.get("KHR_parallel_shader_compile") === null ? setTimeout(n, 10) : n();
				});
			};
			let tt = null;
			function nt(e) {
				tt && tt(e);
			}
			function rt() {
				at.stop();
			}
			function it() {
				at.start();
			}
			let at = new ec();
			at.setAnimationLoop(nt), typeof self < "u" && at.setContext(self), this.setAnimationLoop = function(e) {
				tt = e, qe.setAnimationLoop(e), e === null ? at.stop() : at.start();
			}, qe.addEventListener("sessionstart", rt), qe.addEventListener("sessionend", it), this.render = function(e, t) {
				if (t !== void 0 && t.isCamera !== !0) {
					d("WebGLRenderer.render: camera is not an instance of THREE.Camera.");
					return;
				}
				if (j === !0) return;
				M !== null && M.renderStart(e, t);
				let n = qe.enabled === !0 && qe.isPresenting === !0, r = k !== null && (F === null || n) && k.begin(A, F);
				if (e.matrixWorldAutoUpdate === !0 && e.updateMatrixWorld(), t.parent === null && t.matrixWorldAutoUpdate === !0 && t.updateMatrixWorld(), qe.enabled === !0 && qe.isPresenting === !0 && (k === null || k.isCompositing() === !1) && (qe.cameraAutoUpdate === !0 && qe.updateCamera(t), t = qe.getCamera()), e.isScene === !0 && e.onBeforeRender(A, e, t, F), E = Ie.get(e, O.length), E.init(t), E.state.textureUnits = V.getTextureUnits(), O.push(E), be.multiplyMatrices(t.projectionMatrix, t.matrixWorldInverse), _e.setFromProjectionMatrix(be, Vn, t.reversedDepth), ye = this.localClippingEnabled, ve = Le.init(this.clippingPlanes, ye), T = Fe.get(e, D.length), T.init(), D.push(T), qe.enabled === !0 && qe.isPresenting === !0) {
					let e = A.xr.getDepthSensingMesh();
					e !== null && ot(e, t, -Infinity, A.sortObjects);
				}
				ot(e, t, 0, A.sortObjects), T.finish(), A.sortObjects === !0 && T.sort(fe, pe, t.reversedDepth), we = qe.enabled === !1 || qe.isPresenting === !1 || qe.hasDepthSensing() === !1, we && ze.addToRenderList(T, e), this.info.render.frame++, this.info.autoReset === !0 && this.info.reset(), ve === !0 && Le.beginShadows();
				let i = E.state.shadowsArray;
				if (Re.render(i, e, t), ve === !0 && Le.endShadows(), (r && k.hasRenderPass()) === !1) {
					let n = T.opaque, r = T.transmissive;
					if (E.setupLights(), t.isArrayCamera) {
						let i = t.cameras;
						if (r.length > 0) for (let t = 0, a = i.length; t < a; t++) {
							let a = i[t];
							ct(n, r, e, a);
						}
						we && ze.render(e);
						for (let t = 0, n = i.length; t < n; t++) {
							let n = i[t];
							st(T, e, n, n.viewport);
						}
					} else r.length > 0 && ct(n, r, e, t), we && ze.render(e), st(T, e, t);
				}
				F !== null && P === 0 && (V.updateMultisampleRenderTarget(F), V.updateRenderTargetMipmap(F)), r && k.end(A), e.isScene === !0 && e.onAfterRender(A, e, t), We.resetDefaultState(), re = -1, ie = null, O.pop(), O.length > 0 ? (E = O[O.length - 1], V.setTextureUnits(E.state.textureUnits), ve === !0 && Le.setGlobalState(A.clippingPlanes, E.state.camera)) : E = null, D.pop(), T = D.length > 0 ? D[D.length - 1] : null, M !== null && M.renderEnd();
			};
			function ot(e, t, n, r) {
				if (e.visible === !1) return;
				if (e.layers.test(t.layers)) {
					if (e.isGroup) n = e.renderOrder;
					else if (e.isLOD) e.autoUpdate === !0 && e.update(t);
					else if (e.isLightProbeGrid) E.pushLightProbeGrid(e);
					else if (e.isLight) E.pushLight(e), e.castShadow && E.pushShadow(e);
					else if (e.isSprite) {
						if (!e.frustumCulled || _e.intersectsSprite(e)) {
							r && Se.setFromMatrixPosition(e.matrixWorld).applyMatrix4(be);
							let t = Me.update(e), i = e.material;
							i.visible && T.push(e, t, i, n, Se.z, null);
						}
					} else if ((e.isMesh || e.isLine || e.isPoints) && (!e.frustumCulled || _e.intersectsObject(e))) {
						let t = Me.update(e), i = e.material;
						if (r && (e.boundingSphere === void 0 ? (t.boundingSphere === null && t.computeBoundingSphere(), Se.copy(t.boundingSphere.center)) : (e.boundingSphere === null && e.computeBoundingSphere(), Se.copy(e.boundingSphere.center)), Se.applyMatrix4(e.matrixWorld).applyMatrix4(be)), Array.isArray(i)) {
							let r = t.groups;
							for (let a = 0, o = r.length; a < o; a++) {
								let o = r[a], s = i[o.materialIndex];
								s && s.visible && T.push(e, t, s, n, Se.z, o);
							}
						} else i.visible && T.push(e, t, i, n, Se.z, null);
					}
				}
				let i = e.children;
				for (let e = 0, a = i.length; e < a; e++) ot(i[e], t, n, r);
			}
			function st(e, t, n, r) {
				let { opaque: i, transmissive: a, transparent: o } = e;
				E.setupLightsView(n), ve === !0 && Le.setGlobalState(A.clippingPlanes, n), r && z.viewport(I.copy(r)), i.length > 0 && lt(i, t, n), a.length > 0 && lt(a, t, n), o.length > 0 && lt(o, t, n), z.buffers.depth.setTest(!0), z.buffers.depth.setMask(!0), z.buffers.color.setMask(!0), z.setPolygonOffset(!1);
			}
			function ct(e, t, n, r) {
				if ((n.isScene === !0 ? n.overrideMaterial : null) !== null) return;
				if (E.state.transmissionRenderTarget[r.id] === void 0) {
					let e = De.has("EXT_color_buffer_half_float") || De.has("EXT_color_buffer_float");
					E.state.transmissionRenderTarget[r.id] = new fr(1, 1, {
						generateMipmaps: !0,
						type: e ? Tt : vt,
						minFilter: _t,
						samples: Math.max(4, R.samples),
						stencilBuffer: i,
						resolveDepthBuffer: !1,
						resolveStencilBuffer: !1,
						colorSpace: K.workingColorSpace
					});
				}
				let a = E.state.transmissionRenderTarget[r.id], o = r.viewport || I;
				a.setSize(o.z * A.transmissionResolutionScale, o.w * A.transmissionResolutionScale);
				let s = A.getRenderTarget(), c = A.getActiveCubeFace(), l = A.getActiveMipmapLevel();
				A.setRenderTarget(a), A.getClearColor(se), ce = A.getClearAlpha(), ce < 1 && A.setClearColor(16777215, .5), A.clear(), we && ze.render(n);
				let u = A.toneMapping;
				A.toneMapping = 0;
				let d = r.viewport;
				if (r.viewport !== void 0 && (r.viewport = void 0), E.setupLightsView(r), ve === !0 && Le.setGlobalState(A.clippingPlanes, r), lt(e, n, r), V.updateMultisampleRenderTarget(a), V.updateRenderTargetMipmap(a), De.has("WEBGL_multisampled_render_to_texture") === !1) {
					let e = !1;
					for (let i = 0, a = t.length; i < a; i++) {
						let { object: a, geometry: o, material: s, group: c } = t[i];
						if (s.side === 2 && a.layers.test(r.layers)) {
							let t = s.side;
							s.side = 1, s.needsUpdate = !0, ut(a, n, r, o, s, c), s.side = t, s.needsUpdate = !0, e = !0;
						}
					}
					e === !0 && (V.updateMultisampleRenderTarget(a), V.updateRenderTargetMipmap(a));
				}
				A.setRenderTarget(s, c, l), A.setClearColor(se, ce), d !== void 0 && (r.viewport = d), A.toneMapping = u;
			}
			function lt(e, t, n) {
				let r = t.isScene === !0 ? t.overrideMaterial : null;
				for (let i = 0, a = e.length; i < a; i++) {
					let a = e[i], { object: o, geometry: s, group: c } = a, l = a.material;
					l.allowOverride === !0 && r !== null && (l = r), o.layers.test(n.layers) && ut(o, t, n, s, l, c);
				}
			}
			function ut(e, t, n, r, i, a) {
				e.onBeforeRender(A, t, n, r, i, a), e.modelViewMatrix.multiplyMatrices(n.matrixWorldInverse, e.matrixWorld), e.normalMatrix.getNormalMatrix(e.modelViewMatrix), i.onBeforeRender(A, t, n, r, e, a), i.transparent === !0 && i.side === 2 && i.forceSinglePass === !1 ? (i.side = 1, i.needsUpdate = !0, A.renderBufferDirect(n, t, r, i, e, a), i.side = 0, i.needsUpdate = !0, A.renderBufferDirect(n, t, r, i, e, a), i.side = 2) : A.renderBufferDirect(n, t, r, i, e, a), e.onAfterRender(A, t, n, r, i, a);
			}
			function dt(e, t, n) {
				t.isScene !== !0 && (t = Ce);
				let r = B.get(e), i = E.state.lights, a = E.state.shadowsArray, o = i.state.version, s = Ne.getParameters(e, i.state, a, t, n, E.state.lightProbeGridArray), c = Ne.getProgramCacheKey(s), l = r.programs;
				r.environment = e.isMeshStandardMaterial || e.isMeshLambertMaterial || e.isMeshPhongMaterial ? t.environment : null, r.fog = t.fog;
				let u = e.isMeshStandardMaterial || e.isMeshLambertMaterial && !e.envMap || e.isMeshPhongMaterial && !e.envMap;
				r.envMap = ke.get(e.envMap || r.environment, u), r.envMapRotation = r.environment !== null && e.envMap === null ? t.environmentRotation : e.envMapRotation, l === void 0 && (e.addEventListener("dispose", Ze), l = /* @__PURE__ */ new Map(), r.programs = l);
				let d = l.get(c);
				if (d !== void 0) {
					if (r.currentProgram === d && r.lightsStateVersion === o) return pt(e, s), d;
				} else s.uniforms = Ne.getUniforms(e), M !== null && e.isNodeMaterial && M.build(e, n, s), e.onBeforeCompile(s, A), d = Ne.acquireProgram(s, c), l.set(c, d), r.uniforms = s.uniforms;
				let f = r.uniforms;
				return (!e.isShaderMaterial && !e.isRawShaderMaterial || e.clipping === !0) && (f.clippingPlanes = Le.uniform), pt(e, s), r.needsLights = yt(e), r.lightsStateVersion = o, r.needsLights && (f.ambientLightColor.value = i.state.ambient, f.lightProbe.value = i.state.probe, f.directionalLights.value = i.state.directional, f.directionalLightShadows.value = i.state.directionalShadow, f.spotLights.value = i.state.spot, f.spotLightShadows.value = i.state.spotShadow, f.rectAreaLights.value = i.state.rectArea, f.ltc_1.value = i.state.rectAreaLTC1, f.ltc_2.value = i.state.rectAreaLTC2, f.pointLights.value = i.state.point, f.pointLightShadows.value = i.state.pointShadow, f.hemisphereLights.value = i.state.hemi, f.directionalShadowMatrix.value = i.state.directionalShadowMatrix, f.spotLightMatrix.value = i.state.spotLightMatrix, f.spotLightMap.value = i.state.spotLightMap, f.pointShadowMatrix.value = i.state.pointShadowMatrix), r.lightProbeGrid = E.state.lightProbeGridArray.length > 0, r.currentProgram = d, r.uniformsList = null, d;
			}
			function ft(e) {
				if (e.uniformsList === null) {
					let t = e.currentProgram.getUniforms();
					e.uniformsList = Lu.seqWithValue(t.seq, e.uniforms);
				}
				return e.uniformsList;
			}
			function pt(e, t) {
				let n = B.get(e);
				n.outputColorSpace = t.outputColorSpace, n.batching = t.batching, n.batchingColor = t.batchingColor, n.instancing = t.instancing, n.instancingColor = t.instancingColor, n.instancingMorph = t.instancingMorph, n.skinning = t.skinning, n.morphTargets = t.morphTargets, n.morphNormals = t.morphNormals, n.morphColors = t.morphColors, n.morphTargetsCount = t.morphTargetsCount, n.numClippingPlanes = t.numClippingPlanes, n.numIntersection = t.numClipIntersection, n.vertexAlphas = t.vertexAlphas, n.vertexTangents = t.vertexTangents, n.toneMapping = t.toneMapping;
			}
			function mt(e, t) {
				if (e.length === 0) return null;
				if (e.length === 1) return e[0].texture === null ? null : e[0];
				w.setFromMatrixPosition(t.matrixWorld);
				for (let t = 0, n = e.length; t < n; t++) {
					let n = e[t];
					if (n.texture !== null && n.boundingBox.containsPoint(w)) return n;
				}
				return null;
			}
			function ht(e, t, n, r, i) {
				t.isScene !== !0 && (t = Ce), V.resetTextureUnits();
				let a = t.fog, o = r.isMeshStandardMaterial || r.isMeshLambertMaterial || r.isMeshPhongMaterial ? t.environment : null, s = F === null ? A.outputColorSpace : F.isXRRenderTarget === !0 ? F.texture.colorSpace : K.workingColorSpace, c = r.isMeshStandardMaterial || r.isMeshLambertMaterial && !r.envMap || r.isMeshPhongMaterial && !r.envMap, l = ke.get(r.envMap || o, c), u = r.vertexColors === !0 && !!n.attributes.color && n.attributes.color.itemSize === 4, d = !!n.attributes.tangent && (!!r.normalMap || r.anisotropy > 0), f = !!n.morphAttributes.position, p = !!n.morphAttributes.normal, m = !!n.morphAttributes.color, h = 0;
				r.toneMapped && (F === null || F.isXRRenderTarget === !0) && (h = A.toneMapping);
				let g = n.morphAttributes.position || n.morphAttributes.normal || n.morphAttributes.color, _ = g === void 0 ? 0 : g.length, v = B.get(r), y = E.state.lights;
				if (ve === !0 && (ye === !0 || e !== ie)) {
					let t = e === ie && r.id === re;
					Le.setState(r, e, t);
				}
				let b = !1;
				r.version === v.__version ? v.needsLights && v.lightsStateVersion !== y.state.version ? b = !0 : v.outputColorSpace === s ? i.isBatchedMesh && v.batching === !1 || !i.isBatchedMesh && v.batching === !0 || i.isBatchedMesh && v.batchingColor === !0 && i.colorTexture === null || i.isBatchedMesh && v.batchingColor === !1 && i.colorTexture !== null || i.isInstancedMesh && v.instancing === !1 || !i.isInstancedMesh && v.instancing === !0 || i.isSkinnedMesh && v.skinning === !1 || !i.isSkinnedMesh && v.skinning === !0 || i.isInstancedMesh && v.instancingColor === !0 && i.instanceColor === null || i.isInstancedMesh && v.instancingColor === !1 && i.instanceColor !== null || i.isInstancedMesh && v.instancingMorph === !0 && i.morphTexture === null || i.isInstancedMesh && v.instancingMorph === !1 && i.morphTexture !== null ? b = !0 : v.envMap === l ? r.fog === !0 && v.fog !== a || v.numClippingPlanes !== void 0 && (v.numClippingPlanes !== Le.numPlanes || v.numIntersection !== Le.numIntersection) ? b = !0 : v.vertexAlphas === u && v.vertexTangents === d && v.morphTargets === f && v.morphNormals === p && v.morphColors === m && v.toneMapping === h && v.morphTargetsCount === _ ? !!v.lightProbeGrid != E.state.lightProbeGridArray.length > 0 && (b = !0) : b = !0 : b = !0 : b = !0 : (b = !0, v.__version = r.version);
				let x = v.currentProgram;
				b === !0 && (x = dt(r, t, i), M && r.isNodeMaterial && M.onUpdateProgram(r, x, v));
				let S = !1, C = !1, w = !1, T = x.getUniforms(), D = v.uniforms;
				if (z.useProgram(x.program) && (S = !0, C = !0, w = !0), r.id !== re && (re = r.id, C = !0), v.needsLights) {
					let e = mt(E.state.lightProbeGridArray, i);
					v.lightProbeGrid !== e && (v.lightProbeGrid = e, C = !0);
				}
				if (S || ie !== e) {
					z.buffers.depth.getReversed() && e.reversedDepth !== !0 && (e._reversedDepth = !0, e.updateProjectionMatrix()), T.setValue(L, "projectionMatrix", e.projectionMatrix), T.setValue(L, "viewMatrix", e.matrixWorldInverse);
					let t = T.map.cameraPosition;
					t !== void 0 && t.setValue(L, xe.setFromMatrixPosition(e.matrixWorld)), R.logarithmicDepthBuffer && T.setValue(L, "logDepthBufFC", 2 / (Math.log(e.far + 1) / Math.LN2)), (r.isMeshPhongMaterial || r.isMeshToonMaterial || r.isMeshLambertMaterial || r.isMeshBasicMaterial || r.isMeshStandardMaterial || r.isShaderMaterial) && T.setValue(L, "isOrthographic", e.isOrthographicCamera === !0), ie !== e && (ie = e, C = !0, w = !0);
				}
				if (v.needsLights && (y.state.directionalShadowMap.length > 0 && T.setValue(L, "directionalShadowMap", y.state.directionalShadowMap, V), y.state.spotShadowMap.length > 0 && T.setValue(L, "spotShadowMap", y.state.spotShadowMap, V), y.state.pointShadowMap.length > 0 && T.setValue(L, "pointShadowMap", y.state.pointShadowMap, V)), i.isSkinnedMesh) {
					T.setOptional(L, i, "bindMatrix"), T.setOptional(L, i, "bindMatrixInverse");
					let e = i.skeleton;
					e && (e.boneTexture === null && e.computeBoneTexture(), T.setValue(L, "boneTexture", e.boneTexture, V));
				}
				i.isBatchedMesh && (T.setOptional(L, i, "batchingTexture"), T.setValue(L, "batchingTexture", i._matricesTexture, V), T.setOptional(L, i, "batchingIdTexture"), T.setValue(L, "batchingIdTexture", i._indirectTexture, V), T.setOptional(L, i, "batchingColorTexture"), i._colorsTexture !== null && T.setValue(L, "batchingColorTexture", i._colorsTexture, V));
				let O = n.morphAttributes;
				if ((O.position !== void 0 || O.normal !== void 0 || O.color !== void 0) && Be.update(i, n, x), (C || v.receiveShadow !== i.receiveShadow) && (v.receiveShadow = i.receiveShadow, T.setValue(L, "receiveShadow", i.receiveShadow)), (r.isMeshStandardMaterial || r.isMeshLambertMaterial || r.isMeshPhongMaterial) && r.envMap === null && t.environment !== null && (D.envMapIntensity.value = t.environmentIntensity), D.dfgLUT !== void 0 && (D.dfgLUT.value = iu()), C) {
					if (T.setValue(L, "toneMappingExposure", A.toneMappingExposure), v.needsLights && gt(D, w), a && r.fog === !0 && Pe.refreshFogUniforms(D, a), Pe.refreshMaterialUniforms(D, r, de, ue, E.state.transmissionRenderTarget[e.id]), v.needsLights && v.lightProbeGrid) {
						let e = v.lightProbeGrid;
						D.probesSH.value = e.texture, D.probesMin.value.copy(e.boundingBox.min), D.probesMax.value.copy(e.boundingBox.max), D.probesResolution.value.copy(e.resolution);
					}
					Lu.upload(L, ft(v), D, V);
				}
				if (r.isShaderMaterial && r.uniformsNeedUpdate === !0 && (Lu.upload(L, ft(v), D, V), r.uniformsNeedUpdate = !1), r.isSpriteMaterial && T.setValue(L, "center", i.center), T.setValue(L, "modelViewMatrix", i.modelViewMatrix), T.setValue(L, "normalMatrix", i.normalMatrix), T.setValue(L, "modelMatrix", i.matrixWorld), r.uniformsGroups !== void 0) {
					let e = r.uniformsGroups;
					for (let t = 0, n = e.length; t < n; t++) {
						let n = e[t];
						Ge.update(n, x), Ge.bind(n, x);
					}
				}
				return x;
			}
			function gt(e, t) {
				e.ambientLightColor.needsUpdate = t, e.lightProbe.needsUpdate = t, e.directionalLights.needsUpdate = t, e.directionalLightShadows.needsUpdate = t, e.pointLights.needsUpdate = t, e.pointLightShadows.needsUpdate = t, e.spotLights.needsUpdate = t, e.spotLightShadows.needsUpdate = t, e.rectAreaLights.needsUpdate = t, e.hemisphereLights.needsUpdate = t;
			}
			function yt(e) {
				return e.isMeshLambertMaterial || e.isMeshToonMaterial || e.isMeshPhongMaterial || e.isMeshStandardMaterial || e.isShadowMaterial || e.isShaderMaterial && e.lights === !0;
			}
			this.getActiveCubeFace = function() {
				return ne;
			}, this.getActiveMipmapLevel = function() {
				return P;
			}, this.getRenderTarget = function() {
				return F;
			}, this.setRenderTargetTextures = function(e, t, n) {
				let r = B.get(e);
				r.__autoAllocateDepthBuffer = e.resolveDepthBuffer === !1, r.__autoAllocateDepthBuffer === !1 && (r.__useRenderToTexture = !1), B.get(e.texture).__webglTexture = t, B.get(e.depthTexture).__webglTexture = r.__autoAllocateDepthBuffer ? void 0 : n, r.__hasExternalTextures = !0;
			}, this.setRenderTargetFramebuffer = function(e, t) {
				let n = B.get(e);
				n.__webglFramebuffer = t, n.__useDefaultFramebuffer = t === void 0;
			}, this.setRenderTarget = function(e, t = 0, n = 0) {
				F = e, ne = t, P = n;
				let r = null, i = !1, a = !1;
				if (e) {
					let o = B.get(e);
					if (o.__useDefaultFramebuffer !== void 0) {
						z.bindFramebuffer(L.FRAMEBUFFER, o.__webglFramebuffer), I.copy(e.viewport), ae.copy(e.scissor), oe = e.scissorTest, z.viewport(I), z.scissor(ae), z.setScissorTest(oe), re = -1;
						return;
					}
					if (o.__webglFramebuffer === void 0) V.setupRenderTarget(e);
					else if (o.__hasExternalTextures) V.rebindTextures(e, B.get(e.texture).__webglTexture, B.get(e.depthTexture).__webglTexture);
					else if (e.depthBuffer) {
						let t = e.depthTexture;
						if (o.__boundDepthTexture !== t) {
							if (t !== null && B.has(t) && (e.width !== t.image.width || e.height !== t.image.height)) throw Error("THREE.WebGLRenderer: Attached DepthTexture is initialized to the incorrect size.");
							V.setupDepthRenderbuffer(e);
						}
					}
					let s = e.texture;
					(s.isData3DTexture || s.isDataArrayTexture || s.isCompressedArrayTexture) && (a = !0);
					let c = B.get(e).__webglFramebuffer;
					e.isWebGLCubeRenderTarget ? (r = Array.isArray(c[t]) ? c[t][n] : c[t], i = !0) : r = e.samples > 0 && V.useMultisampledRTT(e) === !1 ? B.get(e).__webglMultisampledFramebuffer : Array.isArray(c) ? c[n] : c, I.copy(e.viewport), ae.copy(e.scissor), oe = e.scissorTest;
				} else I.copy(me).multiplyScalar(de).floor(), ae.copy(he).multiplyScalar(de).floor(), oe = ge;
				if (n !== 0 && (r = ee), z.bindFramebuffer(L.FRAMEBUFFER, r) && z.drawBuffers(e, r), z.viewport(I), z.scissor(ae), z.setScissorTest(oe), i) {
					let r = B.get(e.texture);
					L.framebufferTexture2D(L.FRAMEBUFFER, L.COLOR_ATTACHMENT0, L.TEXTURE_CUBE_MAP_POSITIVE_X + t, r.__webglTexture, n);
				} else if (a) {
					let r = t;
					for (let t = 0; t < e.textures.length; t++) {
						let i = B.get(e.textures[t]);
						L.framebufferTextureLayer(L.FRAMEBUFFER, L.COLOR_ATTACHMENT0 + t, i.__webglTexture, n, r);
					}
				} else if (e !== null && n !== 0) {
					let t = B.get(e.texture);
					L.framebufferTexture2D(L.FRAMEBUFFER, L.COLOR_ATTACHMENT0, L.TEXTURE_2D, t.__webglTexture, n);
				}
				re = -1;
			}, this.readRenderTargetPixels = function(e, t, n, r, i, a, o, s = 0) {
				if (!(e && e.isWebGLRenderTarget)) {
					d("WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");
					return;
				}
				let c = B.get(e).__webglFramebuffer;
				if (e.isWebGLCubeRenderTarget && o !== void 0 && (c = c[o]), c) {
					z.bindFramebuffer(L.FRAMEBUFFER, c);
					try {
						let o = e.textures[s], c = o.format, l = o.type;
						if (e.textures.length > 1 && L.readBuffer(L.COLOR_ATTACHMENT0 + s), !R.textureFormatReadable(c)) {
							d("WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");
							return;
						}
						if (!R.textureTypeReadable(l)) {
							d("WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");
							return;
						}
						t >= 0 && t <= e.width - r && n >= 0 && n <= e.height - i && L.readPixels(t, n, r, i, Ue.convert(c), Ue.convert(l), a);
					} finally {
						let e = F === null ? null : B.get(F).__webglFramebuffer;
						z.bindFramebuffer(L.FRAMEBUFFER, e);
					}
				}
			}, this.readRenderTargetPixelsAsync = async function(e, t, n, r, i, a, o, s = 0) {
				if (!(e && e.isWebGLRenderTarget)) throw Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");
				let c = B.get(e).__webglFramebuffer;
				if (e.isWebGLCubeRenderTarget && o !== void 0 && (c = c[o]), c) {
					if (t >= 0 && t <= e.width - r && n >= 0 && n <= e.height - i) {
						z.bindFramebuffer(L.FRAMEBUFFER, c);
						let o = e.textures[s], l = o.format, u = o.type;
						if (e.textures.length > 1 && L.readBuffer(L.COLOR_ATTACHMENT0 + s), !R.textureFormatReadable(l)) throw Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");
						if (!R.textureTypeReadable(u)) throw Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");
						let d = L.createBuffer();
						L.bindBuffer(L.PIXEL_PACK_BUFFER, d), L.bufferData(L.PIXEL_PACK_BUFFER, a.byteLength, L.STREAM_READ), L.readPixels(t, n, r, i, Ue.convert(l), Ue.convert(u), 0);
						let f = F === null ? null : B.get(F).__webglFramebuffer;
						z.bindFramebuffer(L.FRAMEBUFFER, f);
						let m = L.fenceSync(L.SYNC_GPU_COMMANDS_COMPLETE, 0);
						return L.flush(), await p(L, m, 4), L.bindBuffer(L.PIXEL_PACK_BUFFER, d), L.getBufferSubData(L.PIXEL_PACK_BUFFER, 0, a), L.deleteBuffer(d), L.deleteSync(m), a;
					}
					throw Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.");
				}
			}, this.copyFramebufferToTexture = function(e, t = null, n = 0) {
				let r = 2 ** -n, i = Math.floor(e.image.width * r), a = Math.floor(e.image.height * r), o = t === null ? 0 : t.x, s = t === null ? 0 : t.y;
				V.setTexture2D(e, 0), L.copyTexSubImage2D(L.TEXTURE_2D, n, 0, 0, o, s, i, a), z.unbindTexture();
			}, this.copyTextureToTexture = function(e, t, n = null, r = null, i = 0, a = 0) {
				let o, s, c, l, u, d, f, p, m, h = e.isCompressedTexture ? e.mipmaps[a] : e.image;
				if (n !== null) o = n.max.x - n.min.x, s = n.max.y - n.min.y, c = n.isBox3 ? n.max.z - n.min.z : 1, l = n.min.x, u = n.min.y, d = n.isBox3 ? n.min.z : 0;
				else {
					let t = 2 ** -i;
					o = Math.floor(h.width * t), s = Math.floor(h.height * t), c = e.isDataArrayTexture ? h.depth : e.isData3DTexture ? Math.floor(h.depth * t) : 1, l = 0, u = 0, d = 0;
				}
				r === null ? (f = 0, p = 0, m = 0) : (f = r.x, p = r.y, m = r.z);
				let g = Ue.convert(t.format), _ = Ue.convert(t.type), v;
				t.isData3DTexture ? (V.setTexture3D(t, 0), v = L.TEXTURE_3D) : t.isDataArrayTexture || t.isCompressedArrayTexture ? (V.setTexture2DArray(t, 0), v = L.TEXTURE_2D_ARRAY) : (V.setTexture2D(t, 0), v = L.TEXTURE_2D), z.activeTexture(L.TEXTURE0), z.pixelStorei(L.UNPACK_FLIP_Y_WEBGL, t.flipY), z.pixelStorei(L.UNPACK_PREMULTIPLY_ALPHA_WEBGL, t.premultiplyAlpha), z.pixelStorei(L.UNPACK_ALIGNMENT, t.unpackAlignment);
				let y = z.getParameter(L.UNPACK_ROW_LENGTH), b = z.getParameter(L.UNPACK_IMAGE_HEIGHT), x = z.getParameter(L.UNPACK_SKIP_PIXELS), S = z.getParameter(L.UNPACK_SKIP_ROWS), C = z.getParameter(L.UNPACK_SKIP_IMAGES);
				z.pixelStorei(L.UNPACK_ROW_LENGTH, h.width), z.pixelStorei(L.UNPACK_IMAGE_HEIGHT, h.height), z.pixelStorei(L.UNPACK_SKIP_PIXELS, l), z.pixelStorei(L.UNPACK_SKIP_ROWS, u), z.pixelStorei(L.UNPACK_SKIP_IMAGES, d);
				let w = e.isDataArrayTexture || e.isData3DTexture, T = t.isDataArrayTexture || t.isData3DTexture;
				if (e.isDepthTexture) {
					let n = B.get(e), r = B.get(t), h = B.get(n.__renderTarget), g = B.get(r.__renderTarget);
					z.bindFramebuffer(L.READ_FRAMEBUFFER, h.__webglFramebuffer), z.bindFramebuffer(L.DRAW_FRAMEBUFFER, g.__webglFramebuffer);
					for (let n = 0; n < c; n++) w && (L.framebufferTextureLayer(L.READ_FRAMEBUFFER, L.COLOR_ATTACHMENT0, B.get(e).__webglTexture, i, d + n), L.framebufferTextureLayer(L.DRAW_FRAMEBUFFER, L.COLOR_ATTACHMENT0, B.get(t).__webglTexture, a, m + n)), L.blitFramebuffer(l, u, o, s, f, p, o, s, L.DEPTH_BUFFER_BIT, L.NEAREST);
					z.bindFramebuffer(L.READ_FRAMEBUFFER, null), z.bindFramebuffer(L.DRAW_FRAMEBUFFER, null);
				} else if (i !== 0 || e.isRenderTargetTexture || B.has(e)) {
					let n = B.get(e), r = B.get(t);
					z.bindFramebuffer(L.READ_FRAMEBUFFER, te), z.bindFramebuffer(L.DRAW_FRAMEBUFFER, N);
					for (let e = 0; e < c; e++) w ? L.framebufferTextureLayer(L.READ_FRAMEBUFFER, L.COLOR_ATTACHMENT0, n.__webglTexture, i, d + e) : L.framebufferTexture2D(L.READ_FRAMEBUFFER, L.COLOR_ATTACHMENT0, L.TEXTURE_2D, n.__webglTexture, i), T ? L.framebufferTextureLayer(L.DRAW_FRAMEBUFFER, L.COLOR_ATTACHMENT0, r.__webglTexture, a, m + e) : L.framebufferTexture2D(L.DRAW_FRAMEBUFFER, L.COLOR_ATTACHMENT0, L.TEXTURE_2D, r.__webglTexture, a), i === 0 ? T ? L.copyTexSubImage3D(v, a, f, p, m + e, l, u, o, s) : L.copyTexSubImage2D(v, a, f, p, l, u, o, s) : L.blitFramebuffer(l, u, o, s, f, p, o, s, L.COLOR_BUFFER_BIT, L.NEAREST);
					z.bindFramebuffer(L.READ_FRAMEBUFFER, null), z.bindFramebuffer(L.DRAW_FRAMEBUFFER, null);
				} else T ? e.isDataTexture || e.isData3DTexture ? L.texSubImage3D(v, a, f, p, m, o, s, c, g, _, h.data) : t.isCompressedArrayTexture ? L.compressedTexSubImage3D(v, a, f, p, m, o, s, c, g, h.data) : L.texSubImage3D(v, a, f, p, m, o, s, c, g, _, h) : e.isDataTexture ? L.texSubImage2D(L.TEXTURE_2D, a, f, p, o, s, g, _, h.data) : e.isCompressedTexture ? L.compressedTexSubImage2D(L.TEXTURE_2D, a, f, p, h.width, h.height, g, h.data) : L.texSubImage2D(L.TEXTURE_2D, a, f, p, o, s, g, _, h);
				z.pixelStorei(L.UNPACK_ROW_LENGTH, y), z.pixelStorei(L.UNPACK_IMAGE_HEIGHT, b), z.pixelStorei(L.UNPACK_SKIP_PIXELS, x), z.pixelStorei(L.UNPACK_SKIP_ROWS, S), z.pixelStorei(L.UNPACK_SKIP_IMAGES, C), a === 0 && t.generateMipmaps && L.generateMipmap(v), z.unbindTexture();
			}, this.initRenderTarget = function(e) {
				B.get(e).__webglFramebuffer === void 0 && V.setupRenderTarget(e);
			}, this.initTexture = function(e) {
				e.isCubeTexture ? V.setTextureCube(e, 0) : e.isData3DTexture ? V.setTexture3D(e, 0) : e.isDataArrayTexture || e.isCompressedArrayTexture ? V.setTexture2DArray(e, 0) : V.setTexture2D(e, 0), z.unbindTexture();
			}, this.resetState = function() {
				ne = 0, P = 0, F = null, z.reset(), We.reset();
			}, typeof __THREE_DEVTOOLS__ < "u" && __THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe", { detail: this }));
		}
		get coordinateSystem() {
			return Vn;
		}
		get outputColorSpace() {
			return this._outputColorSpace;
		}
		set outputColorSpace(e) {
			this._outputColorSpace = e;
			let t = this.getContext();
			t.drawingBufferColorSpace = K._getDrawingBufferColorSpace(e), t.unpackColorSpace = K._getUnpackColorSpace();
		}
	};
}));
//#endregion
//#region _src/renderer/ascii.js
gd();
var _d = "monospace, \"Apple Symbols\", \"Segoe UI Symbol\"", vd = 1 / .667, yd = String.fromCodePoint(...Array.from({ length: 256 }, (e, t) => 10240 + t)), bd = [...new Set((" .'`^\",:;Il!i><~+_-?][{}1()|\\/tfjrxncvuzXYUJCLQ0ZOmwqpdbkhao*#MW8&%B@$▀▄█▉▊▋▌▍▎▏▐░▒▓·•╌╎┆┊╍╏┇┋" + yd).split(""))], xd = {
	dark: [
		"M",
		"H",
		"O",
		"F",
		"█",
		"▓",
		"W",
		"B"
	],
	mid: [
		"●",
		"◉",
		"©",
		"▒",
		"░",
		"N",
		"◎",
		"A"
	],
	light: [
		"N",
		"O",
		"0",
		"©",
		"○",
		"o",
		"°",
		"·"
	],
	edge: [
		"O",
		"0",
		"°",
		"·",
		".",
		"'",
		" "
	]
}, Sd = /* @__PURE__ */ new Set([
	"█",
	"▓",
	"▒",
	"░"
]), Cd = /* @__PURE__ */ new Set([
	"○",
	"°",
	"·",
	".",
	"'"
]), wd = {
	dark: 95 / 255,
	mid: 170 / 255,
	light: 220 / 255,
	edge: 250 / 255
}, Td = /* @__PURE__ */ new Map(), Ed = [], Dd = null, Od = {
	bayer4x4: 4,
	bayer8x8: 8
}, kd = {};
function Ad(e) {
	if (kd[e]) return kd[e];
	let t = [[0, 2], [3, 1]];
	for (; t.length < e;) {
		let e = t.length, n = Array.from({ length: e * 2 }, () => Array(e * 2)), r = [[0, 2], [3, 1]];
		for (let i = 0; i < e * 2; i++) for (let a = 0; a < e * 2; a++) {
			let o = i < e ? 0 : 1, s = a < e ? 0 : 1;
			n[i][a] = t[i % e][a % e] * 4 + r[o][s];
		}
		t = n;
	}
	return kd[e] = t, t;
}
function jd(e, t) {
	let n = t + "::" + e;
	if (Td.has(n)) return Td.get(n);
	let r = .42;
	try {
		let n = document.createElement("canvas");
		n.width = Math.max(2, Math.ceil(t * 1.1)), n.height = Math.max(2, Math.ceil(t * 1.75 * 1.1));
		let i = n.getContext("2d", { willReadFrequently: !0 });
		i.font = `${t}px ${_d}`, i.textAlign = "center", i.textBaseline = "middle", i.fillStyle = "#fff", i.fillText(e, n.width / 2, n.height / 2);
		let { data: a } = i.getImageData(0, 0, n.width, n.height), o = 0;
		for (let e = 3; e < a.length; e += 4) a[e] > 32 && o++;
		r = o / a.length;
	} catch {}
	return Td.set(n, r), r;
}
function Md(e) {
	let t = [];
	for (let n of bd) t.push({
		char: n,
		cov: jd(n, e)
	});
	t.sort((e, t) => e.cov - t.cov);
	let n = [];
	for (let e of t) {
		let t = n[n.length - 1];
		t && Math.abs(t.cov - e.cov) <= .006 || n.push(e);
	}
	Ed = n, Dd = e;
}
function Nd(e) {
	let t = Ed.length;
	if (!t) return " ";
	let n = 0, r = t;
	for (; n < r;) {
		let t = n + r >> 1;
		Ed[t].cov < e ? n = t + 1 : r = t;
	}
	let i = Math.min(t - 1, n), a = i > 0 ? i - 1 : i, o = Math.abs(Ed[i].cov - e), s = Math.abs(Ed[a].cov - e);
	return Ed[s <= o ? a : i].char;
}
function Pd(e, t) {
	let n = wd, r, i;
	if (e < n.dark) r = "dark", i = 1 - e / n.dark;
	else if (e < n.mid) r = "mid", i = 1 - (e - n.dark) / (n.mid - n.dark);
	else if (e < n.light) r = "light", i = 1 - (e - n.mid) / (n.light - n.mid);
	else if (e < n.edge) r = "edge", i = 1 - (e - n.light) / (n.edge - n.light);
	else return null;
	let a = xd[r], o = Number.isFinite(t) ? t : i;
	return {
		char: a[Math.min(a.length - 1, Math.floor(Math.max(0, Math.min(.999, o)) * a.length))],
		band: r,
		dens: i,
		alpha: r === "dark" ? 1 : r === "mid" ? .9 : r === "light" ? .7 : .45
	};
}
function Fd(e, t) {
	let n = e * 374761393 + t * 668265263 | 0;
	return n = (n ^ n >>> 13) * 1274126177, ((n ^ n >>> 16) >>> 0) / 4294967295;
}
function Id(e, t, n, r, i, a) {
	let o = zd(t);
	if (o < .04) return;
	let s = i * .42, c = a * .38;
	if (o < .15) {
		let t = Math.max(.6, Math.min(s, c) * .22);
		e.beginPath(), e.arc(n, r, t, 0, Math.PI * 2), e.fill();
		return;
	}
	if (o < .3) {
		let t = Math.min(s, c) * .45;
		e.fillRect(n - t / 2, r - t / 2, t, t);
		return;
	}
	if (o < .45) {
		e.fillRect(n - s * .7, r - c * .12, s * 1.4, c * .24);
		return;
	}
	if (o < .58) {
		e.fillRect(n - s * .12, r - c * .7, s * .24, c * 1.4);
		return;
	}
	if (o < .72) {
		e.fillRect(n - s * .7, r - c * .12, s * 1.4, c * .24), e.fillRect(n - s * .12, r - c * .7, s * .24, c * 1.4);
		return;
	}
	if (o < .86) {
		e.beginPath(), e.moveTo(n, r - c * .75), e.lineTo(n + s * .7, r + c * .65), e.lineTo(n - s * .7, r + c * .65), e.closePath(), e.fill();
		return;
	}
	e.fillRect(n - s * .85, r - c * .85, s * 1.7, c * 1.7);
}
function Ld(e) {
	let t = e.getContext("2d"), n = 0, r = 0, i = 8, a = 8, o = 14, s = 0, c = 1;
	function l(e) {
		let t = Number(e);
		c = 1 + (Number.isFinite(t) ? Math.max(-100, Math.min(100, t)) : 0) / 100;
	}
	let u = document.createElement("canvas"), d = u.getContext("2d", { willReadFrequently: !0 });
	function f(e) {
		let t = _(e, 8);
		t !== i && (i = Math.max(3, Math.min(24, t)), a = i, o = Math.round(i * vd), Md(o), n && g(n, r));
	}
	function p(e) {
		let t = Math.max(0, Math.min(16, _(e, 0)));
		t !== s && (s = t, n && g(n, r));
	}
	function m() {
		return a + s;
	}
	function h() {
		return o + s;
	}
	function g(t, i) {
		n = _(t, 96), r = _(i, 54), n = Math.max(1, Math.min(500, n)), r = Math.max(1, Math.min(300, r)), e.width = n * m(), e.height = r * h(), u.width = n, u.height = r;
	}
	function _(e, t) {
		let n = Math.floor(Number(e));
		return Number.isFinite(n) ? n : t;
	}
	function v(e) {
		!n || !r || (d.clearRect(0, 0, u.width, u.height), d.drawImage(e, 0, 0, n, r));
	}
	function y(e, t) {
		return .299 * (e[t] / 255) + .587 * (e[t + 1] / 255) + .114 * (e[t + 2] / 255);
	}
	function b(e, t, n, r, i, a) {
		if (n === 1) return 0;
		let o = n === 2, s = o ? +(e >= t[0]) : e < t[0] ? 0 : e < t[1] ? 1 : 2;
		if (!r || r === "none") return s;
		let c = Od[r];
		if (!c) return s;
		let l, u, d;
		if (e < t[0]) l = 0, u = Math.max(1e-6, t[0]), d = 1;
		else if (o) return s;
		else if (e < t[1]) l = t[0], u = Math.max(l + 1e-6, t[1]), d = 2;
		else return s;
		return (e - l) / (u - l) >= (Ad(c)[a % c][i % c] + .5) / (c * c) ? Math.min(n - 1, d) : s;
	}
	function x(i) {
		let s = n, l = r;
		if (!s || !l) return;
		let f = i.colors && i.colors.length ? i.colors : [
			i.colorA || "#1a1a1a",
			i.colorB || "#FF6700",
			i.colorC || "#FFC043"
		];
		for (; f.length < 3;) f.push(f[f.length - 1] || "#1a1a1a");
		let p = i.thresholds && i.thresholds.length ? i.thresholds : [Number.isFinite(i.threshold) ? i.threshold : .5], g = qd([
			f[0],
			f[1],
			f[2]
		], Jd(i)), _ = g.map(Rd), { data: v } = d.getImageData(0, 0, u.width, u.height);
		Dd !== o && Md(o);
		let b = m(), x = h(), C = i.cellMode || "text", w = !!i.cellOutline, T = Math.max(.2, Math.min(4, Number(i.gamma) || 1)), E = !!i.bold, D = zd(Number(i.colorMix) || 0), O = zd(Number(i.explodeAmount) || 0), k = Array.isArray(i.trail) ? i.trail : [], A = !!i.trailStroke, j = /* @__PURE__ */ new Map();
		for (let e of k) j.set((e.cy | 0) * s + (e.cx | 0), e);
		t.save(), t.clearRect(0, 0, e.width, e.height);
		let M = i.bgColor;
		M && M !== "transparent" && (t.fillStyle = M, t.fillRect(0, 0, e.width, e.height)), t.font = `${E ? "700 " : ""}${o}px ${_d}`, t.textAlign = "center", t.textBaseline = "middle", E && (t.lineWidth = Math.max(1, a * .08));
		let ee = a / 2, te = o / 2, N = g.length, ne = Math.max(s, l) * .35;
		for (let e = 0; e < l; e++) for (let n = 0; n < s; n++) {
			let r = (e * s + n) * 4, l = j.get(e * s + n);
			if (v[r + 3] <= 8 && !l) continue;
			let u = v[r + 3] <= 8 ? .15 : y(v, r);
			T !== 1 && (u = zd(u) ** +T);
			let d = zd(c === 1 ? u : (zd(u) - .5) * c + .5), f = S(d, p, N, i.dither, n, e), m = Pd(d, 1 - d), h = !!l;
			if (!h && !m && f.char === " " || !h && m && m.char === " " && d >= wd.edge) continue;
			let g = h && (!m || m.char === " ") ? "·" : m ? m.char : f.char, k = m ? m.dens : 1 - d, M = Kd(m?.band || "mid", Number(i.colorMode) || 3, _, D > .02 ? D : .28, n, e), P = Sd.has(g), F = Cd.has(g), re = 0, ie = 0;
			if (O > 0) {
				let t = Fd(n + 1, e + 3), r = Fd(n + 7, e + 11), i = t * Math.PI * 2, a = r * ne * O;
				re = Math.cos(i) * a * b, ie = Math.sin(i) * a * x;
			}
			let I = n * b + ee + re, ae = e * x + te + ie, oe = h ? Math.max(.25, l.alpha ?? 1) : m ? m.alpha : 1;
			t.globalAlpha = oe, t.fillStyle = typeof M == "string" && M.startsWith("#") ? Rd(M) : M, t.strokeStyle = t.fillStyle;
			let se = C === "shapes";
			C === "mixed" && (se = P || F || k > .55 || k < .2), h && A && (se = !0), C === "text" || !se && C !== "shapes" ? g && g !== " " ? (t.fillText(g, I, ae), E && t.strokeText(g, I, ae)) : h && Id(t, .2, I, ae, a, o) : Id(t, h ? Math.max(k, .35) : Math.max(k, .08), I, ae, a, o), w && O <= .05 && (k > .04 || h) && (t.globalAlpha = Math.min(1, oe), t.strokeStyle = _[0], t.lineWidth = 1, t.strokeRect(n * b + re + .5, e * x + ie + .5, a - 1, o - 1));
		}
		t.globalAlpha = 1, t.restore();
	}
	function S(e, t, n, r, i, a) {
		let o = zd(c === 1 ? e : (zd(e) - .5) * c + .5), s = b(o, t, n, r, i, a);
		return {
			char: Nd(1 - o),
			ink: s
		};
	}
	function C(e) {
		return c === 1 ? e : zd((zd(e) - .5) * c + .5);
	}
	function w() {
		if (!n || !r) return [];
		let { data: e } = d.getImageData(0, 0, n, r), t = [];
		for (let n = 0; n < e.length; n += 4) e[n + 3] <= 8 || t.push(C(y(e, n)));
		return t;
	}
	return {
		setSize: g,
		setCellSize: f,
		setCellSpacing: p,
		setContrast: l,
		drawToLum: v,
		rasterize: x,
		sampleLum() {
			if (!n || !r) return null;
			let { data: e } = d.getImageData(0, 0, n, r), t = 0, i = 0, a = 0;
			for (let n = 3; n < e.length; n += 4) e[n] > i && (i = e[n]), e[n] > 8 && t++, C(y(e, n - 3)) > .5 && a++;
			return {
				size: [n, r],
				opaque: t,
				maxAlpha: i,
				bright: a
			};
		},
		cellLums: w,
		sampleDims() {
			return [n, r];
		},
		get columns() {
			return n;
		},
		get rows() {
			return r;
		},
		get cellWidth() {
			return a;
		},
		get cellHeight() {
			return o;
		},
		get canvas() {
			return e;
		},
		get ctx() {
			return t;
		}
	};
}
function Rd(e) {
	let t = String(e).replace("#", "");
	t.length === 3 && (t = t.split("").map((e) => e + e).join(""));
	let n = parseInt(t, 16);
	return `rgb(${n >> 16 & 255}, ${n >> 8 & 255}, ${n & 255})`;
}
function zd(e) {
	return e < 0 ? 0 : e > 1 ? 1 : e;
}
function Bd(e) {
	let t = String(e || "").replace("#", "").trim();
	if (t.length === 3 && (t = t.split("").map((e) => e + e).join("")), !/^[0-9a-f]{6}$/i.test(t)) return {
		r: 245,
		g: 243,
		b: 238
	};
	let n = parseInt(t, 16);
	return {
		r: n >> 16 & 255,
		g: n >> 8 & 255,
		b: n & 255
	};
}
function Vd(e) {
	let t = e / 255;
	return t <= .04045 ? t / 12.92 : ((t + .055) / 1.055) ** 2.4;
}
function Hd(e) {
	let { r: t, g: n, b: r } = Bd(e);
	return .2126 * Vd(t) + .7152 * Vd(n) + .0722 * Vd(r);
}
function Ud(e, t, n) {
	e /= 255, t /= 255, n /= 255;
	let r = Math.max(e, t, n), i = Math.min(e, t, n), a = (r + i) / 2;
	if (r === i) return {
		h: 0,
		s: 0,
		l: a
	};
	let o = r - i, s = a > .5 ? o / (2 - r - i) : o / (r + i), c;
	return c = r === e ? ((t - n) / o + (t < n ? 6 : 0)) / 6 : r === t ? ((n - e) / o + 2) / 6 : ((e - t) / o + 4) / 6, {
		h: c * 360,
		s,
		l: a
	};
}
function Wd(e, t, n) {
	let r = (e % 360 + 360) % 360, i = t * Math.min(n, 1 - n), a = (e) => {
		let t = (e + r / 30) % 12;
		return n - i * Math.max(Math.min(t - 3, 9 - t, 1), -1);
	};
	return [
		Math.round(zd(a(0)) * 255),
		Math.round(zd(a(8)) * 255),
		Math.round(zd(a(4)) * 255)
	];
}
function Gd(e, t, n) {
	return "#" + [
		e,
		t,
		n
	].map((e) => Math.max(0, Math.min(255, e | 0)).toString(16).padStart(2, "0")).join("");
}
function Kd(e, t, n, r, i, a) {
	let o = n[0], s = n[1] || o, c = n[2] || s;
	if (t <= 1) return o;
	let l;
	return l = t === 2 ? e === "dark" || e === "mid" ? o : s : e === "dark" ? o : e === "mid" ? s : c, r > .02 && Fd(i, a) < r * .5 ? l === o ? s : l === s ? Fd(i, a + 3) < .5 ? o : c : s : l;
}
function qd(e, t) {
	if (!Array.isArray(e) || !e.length) return e;
	if (Hd(t || "#f5f3ee") >= .42) return e.slice();
	let n = e[1] || e[0], r = e[2] || n, { r: i, g: a, b: o } = Bd(n), { r: s, g: c, b: l } = Bd(r), u = Ud(i, a, o), d = Ud(s, c, l), f = u.s > .08 ? u.h : d.h, p = d.s > .08 ? d.h : f, m = Math.min(.82, Math.max(.42, u.s || d.s || .55)), h = Math.min(.88, Math.max(.48, d.s || u.s || .6)), g = Math.min(.55, Math.max(.22, h * .55)), [_, v, y] = Wd(f, m, .48), [b, x, S] = Wd(p, h, .62), [C, w, T] = Wd(p, g, .78);
	return [
		Gd(_, v, y),
		Gd(b, x, S),
		Gd(C, w, T)
	];
}
function Jd(e = {}) {
	let t = e.bgColor;
	return t && t !== "transparent" ? t : e.paperColor && e.paperColor !== "transparent" ? e.paperColor : "#f5f3ee";
}
//#endregion
//#region node_modules/three/examples/jsm/libs/fflate.module.js
function Yd(e, t) {
	return Df(e, { i: 2 }, t && t.out, t && t.dictionary);
}
function Xd(e, t) {
	return Df(e.subarray(Mf(e, t && t.dictionary), -4), { i: 2 }, t && t.out, t && t.dictionary);
}
function Zd(e, t) {
	if (t) {
		for (var n = "", r = 0; r < e.length; r += 16384) n += String.fromCharCode.apply(null, e.subarray(r, r + 16384));
		return n;
	}
	if (Nf) return Nf.decode(e);
	var i = Pf(e), a = i.s, n = i.r;
	return n.length && Ef(8), a;
}
function Qd(e, t) {
	for (var n = {}, r = e.length - 22; Af(e, r) != 101010256; --r) (!r || e.length - r > 65558) && Ef(13);
	var i = kf(e, r + 8);
	if (!i) return {};
	var a = Af(e, r + 16), o = a == 4294967295 || i == 65535;
	if (o) {
		var s = Af(e, r - 12);
		o = Af(e, s) == 101075792, o && (i = Af(e, s + 32), a = Af(e, s + 48));
	}
	for (var c = t && t.filter, l = 0; l < i; ++l) {
		var u = If(e, a, o), d = u[0], f = u[1], p = u[2], m = u[3], h = u[4], g = u[5], _ = Ff(e, g);
		a = h, (!c || c({
			name: m,
			size: f,
			originalSize: p,
			compression: d
		})) && (d ? d == 8 ? n[m] = Yd(e.subarray(_, _ + f), { out: new $d(p) }) : Ef(14, "unknown compression type " + d) : n[m] = wf(e, _, _ + f));
	}
	return n;
}
var $d, ef, tf, nf, rf, af, of, sf, cf, lf, uf, df, ff, pf, mf, hf, gf, _f, vf, yf, bf, xf, Sf, Cf, wf, Tf, Ef, Df, Of, kf, Af, jf, Mf, Nf, Pf, Ff, If, Lf, Rf = t((() => {
	for ($d = Uint8Array, ef = Uint16Array, tf = Int32Array, nf = new $d([
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		1,
		1,
		1,
		1,
		2,
		2,
		2,
		2,
		3,
		3,
		3,
		3,
		4,
		4,
		4,
		4,
		5,
		5,
		5,
		5,
		0,
		0,
		0,
		0
	]), rf = new $d([
		0,
		0,
		0,
		0,
		1,
		1,
		2,
		2,
		3,
		3,
		4,
		4,
		5,
		5,
		6,
		6,
		7,
		7,
		8,
		8,
		9,
		9,
		10,
		10,
		11,
		11,
		12,
		12,
		13,
		13,
		0,
		0
	]), af = new $d([
		16,
		17,
		18,
		0,
		8,
		7,
		9,
		6,
		10,
		5,
		11,
		4,
		12,
		3,
		13,
		2,
		14,
		1,
		15
	]), of = function(e, t) {
		for (var n = new ef(31), r = 0; r < 31; ++r) n[r] = t += 1 << e[r - 1];
		for (var i = new tf(n[30]), r = 1; r < 30; ++r) for (var a = n[r]; a < n[r + 1]; ++a) i[a] = a - n[r] << 5 | r;
		return {
			b: n,
			r: i
		};
	}, sf = of(nf, 2), cf = sf.b, lf = sf.r, cf[28] = 258, lf[258] = 28, uf = of(rf, 0), df = uf.b, uf.r, ff = new ef(32768), pf = 0; pf < 32768; ++pf) mf = (pf & 43690) >> 1 | (pf & 21845) << 1, mf = (mf & 52428) >> 2 | (mf & 13107) << 2, mf = (mf & 61680) >> 4 | (mf & 3855) << 4, ff[pf] = ((mf & 65280) >> 8 | (mf & 255) << 8) >> 1;
	for (hf = (function(e, t, n) {
		for (var r = e.length, i = 0, a = new ef(t); i < r; ++i) e[i] && ++a[e[i] - 1];
		var o = new ef(t);
		for (i = 1; i < t; ++i) o[i] = o[i - 1] + a[i - 1] << 1;
		var s;
		if (n) {
			s = new ef(1 << t);
			var c = 15 - t;
			for (i = 0; i < r; ++i) if (e[i]) for (var l = i << 4 | e[i], u = t - e[i], d = o[e[i] - 1]++ << u, f = d | (1 << u) - 1; d <= f; ++d) s[ff[d] >> c] = l;
		} else for (s = new ef(r), i = 0; i < r; ++i) e[i] && (s[i] = ff[o[e[i] - 1]++] >> 15 - e[i]);
		return s;
	}), gf = new $d(288), pf = 0; pf < 144; ++pf) gf[pf] = 8;
	for (pf = 144; pf < 256; ++pf) gf[pf] = 9;
	for (pf = 256; pf < 280; ++pf) gf[pf] = 7;
	for (pf = 280; pf < 288; ++pf) gf[pf] = 8;
	for (_f = new $d(32), pf = 0; pf < 32; ++pf) _f[pf] = 5;
	vf = /*#__PURE__*/ hf(gf, 9, 1), yf = /*#__PURE__*/ hf(_f, 5, 1), bf = function(e) {
		for (var t = e[0], n = 1; n < e.length; ++n) e[n] > t && (t = e[n]);
		return t;
	}, xf = function(e, t, n) {
		var r = t / 8 | 0;
		return (e[r] | e[r + 1] << 8) >> (t & 7) & n;
	}, Sf = function(e, t) {
		var n = t / 8 | 0;
		return (e[n] | e[n + 1] << 8 | e[n + 2] << 16) >> (t & 7);
	}, Cf = function(e) {
		return (e + 7) / 8 | 0;
	}, wf = function(e, t, n) {
		return (t == null || t < 0) && (t = 0), (n == null || n > e.length) && (n = e.length), new $d(e.subarray(t, n));
	}, Tf = [
		"unexpected EOF",
		"invalid block type",
		"invalid length/literal",
		"invalid distance",
		"stream finished",
		"no stream handler",
		,
		"no callback",
		"invalid UTF-8 data",
		"extra field too long",
		"date not in range 1980-2099",
		"filename too long",
		"stream finishing",
		"invalid zip data"
	], Ef = function(e, t, n) {
		var r = Error(t || Tf[e]);
		if (r.code = e, Error.captureStackTrace && Error.captureStackTrace(r, Ef), !n) throw r;
		return r;
	}, Df = function(e, t, n, r) {
		var i = e.length, a = r ? r.length : 0;
		if (!i || t.f && !t.l) return n || new $d(0);
		var o = !n, s = o || t.i != 2, c = t.i;
		o && (n = new $d(i * 3));
		var l = function(e) {
			var t = n.length;
			if (e > t) {
				var r = new $d(Math.max(t * 2, e));
				r.set(n), n = r;
			}
		}, u = t.f || 0, d = t.p || 0, f = t.b || 0, p = t.l, m = t.d, h = t.m, g = t.n, _ = i * 8;
		do {
			if (!p) {
				u = xf(e, d, 1);
				var v = xf(e, d + 1, 3);
				if (d += 3, !v) {
					var y = Cf(d) + 4, b = e[y - 4] | e[y - 3] << 8, x = y + b;
					if (x > i) {
						c && Ef(0);
						break;
					}
					s && l(f + b), n.set(e.subarray(y, x), f), t.b = f += b, t.p = d = x * 8, t.f = u;
					continue;
				}
				if (v == 1) p = vf, m = yf, h = 9, g = 5;
				else if (v == 2) {
					var S = xf(e, d, 31) + 257, C = xf(e, d + 10, 15) + 4, w = S + xf(e, d + 5, 31) + 1;
					d += 14;
					for (var T = new $d(w), E = new $d(19), D = 0; D < C; ++D) E[af[D]] = xf(e, d + D * 3, 7);
					d += C * 3;
					for (var O = bf(E), k = (1 << O) - 1, A = hf(E, O, 1), D = 0; D < w;) {
						var j = A[xf(e, d, k)];
						d += j & 15;
						var y = j >> 4;
						if (y < 16) T[D++] = y;
						else {
							var M = 0, ee = 0;
							for (y == 16 ? (ee = 3 + xf(e, d, 3), d += 2, M = T[D - 1]) : y == 17 ? (ee = 3 + xf(e, d, 7), d += 3) : y == 18 && (ee = 11 + xf(e, d, 127), d += 7); ee--;) T[D++] = M;
						}
					}
					var te = T.subarray(0, S), N = T.subarray(S);
					h = bf(te), g = bf(N), p = hf(te, h, 1), m = hf(N, g, 1);
				} else Ef(1);
				if (d > _) {
					c && Ef(0);
					break;
				}
			}
			s && l(f + 131072);
			for (var ne = (1 << h) - 1, P = (1 << g) - 1, F = d;; F = d) {
				var M = p[Sf(e, d) & ne], re = M >> 4;
				if (d += M & 15, d > _) {
					c && Ef(0);
					break;
				}
				if (M || Ef(2), re < 256) n[f++] = re;
				else if (re == 256) {
					F = d, p = null;
					break;
				} else {
					var ie = re - 254;
					if (re > 264) {
						var D = re - 257, I = nf[D];
						ie = xf(e, d, (1 << I) - 1) + cf[D], d += I;
					}
					var ae = m[Sf(e, d) & P], oe = ae >> 4;
					ae || Ef(3), d += ae & 15;
					var N = df[oe];
					if (oe > 3) {
						var I = rf[oe];
						N += Sf(e, d) & (1 << I) - 1, d += I;
					}
					if (d > _) {
						c && Ef(0);
						break;
					}
					s && l(f + 131072);
					var se = f + ie;
					if (f < N) {
						var ce = a - N, le = Math.min(N, se);
						for (ce + f < 0 && Ef(3); f < le; ++f) n[f] = r[ce + f];
					}
					for (; f < se; ++f) n[f] = n[f - N];
				}
			}
			t.l = p, t.p = F, t.b = f, t.f = u, p && (u = 1, t.m = h, t.d = m, t.n = g);
		} while (!u);
		return f != n.length && o ? wf(n, 0, f) : n.subarray(0, f);
	}, Of = /*#__PURE__*/ new $d(0), kf = function(e, t) {
		return e[t] | e[t + 1] << 8;
	}, Af = function(e, t) {
		return (e[t] | e[t + 1] << 8 | e[t + 2] << 16 | e[t + 3] << 24) >>> 0;
	}, jf = function(e, t) {
		return Af(e, t) + Af(e, t + 4) * 4294967296;
	}, Mf = function(e, t) {
		return ((e[0] & 15) != 8 || e[0] >> 4 > 7 || (e[0] << 8 | e[1]) % 31) && Ef(6, "invalid zlib data"), (e[1] >> 5 & 1) == +!t && Ef(6, "invalid zlib data: " + (e[1] & 32 ? "need" : "unexpected") + " dictionary"), (e[1] >> 3 & 4) + 2;
	}, Nf = typeof TextDecoder < "u" && /*#__PURE__*/ new TextDecoder();
	try {
		Nf.decode(Of, { stream: !0 });
	} catch {}
	Pf = function(e) {
		for (var t = "", n = 0;;) {
			var r = e[n++], i = (r > 127) + (r > 223) + (r > 239);
			if (n + i > e.length) return {
				s: t,
				r: wf(e, n - 1)
			};
			i ? i == 3 ? (r = ((r & 15) << 18 | (e[n++] & 63) << 12 | (e[n++] & 63) << 6 | e[n++] & 63) - 65536, t += String.fromCharCode(55296 | r >> 10, 56320 | r & 1023)) : i & 1 ? t += String.fromCharCode((r & 31) << 6 | e[n++] & 63) : t += String.fromCharCode((r & 15) << 12 | (e[n++] & 63) << 6 | e[n++] & 63) : t += String.fromCharCode(r);
		}
	}, Ff = function(e, t) {
		return t + 30 + kf(e, t + 26) + kf(e, t + 28);
	}, If = function(e, t, n) {
		var r = kf(e, t + 28), i = Zd(e.subarray(t + 46, t + 46 + r), !(kf(e, t + 8) & 2048)), a = t + 46 + r, o = Af(e, t + 20), s = n && o == 4294967295 ? Lf(e, a) : [
			o,
			Af(e, t + 24),
			Af(e, t + 42)
		], c = s[0], l = s[1], u = s[2];
		return [
			kf(e, t + 10),
			c,
			l,
			i,
			a + kf(e, t + 30) + kf(e, t + 32),
			u
		];
	}, Lf = function(e, t) {
		for (; kf(e, t) != 1; t += 4 + kf(e, t + 2));
		return [
			jf(e, t + 12),
			jf(e, t + 4),
			jf(e, t + 20)
		];
	};
}));
//#endregion
//#region node_modules/three/examples/jsm/curves/NURBSUtils.js
function zf(e, t, n) {
	let r = n.length - e - 1;
	if (t >= n[r]) return r - 1;
	if (t <= n[e]) return e;
	let i = e, a = r, o = Math.floor((i + a) / 2);
	for (; t < n[o] || t >= n[o + 1];) t < n[o] ? a = o : i = o, o = Math.floor((i + a) / 2);
	return o;
}
function Bf(e, t, n, r) {
	let i = [], a = [], o = [];
	i[0] = 1;
	for (let s = 1; s <= n; ++s) {
		a[s] = t - r[e + 1 - s], o[s] = r[e + s] - t;
		let n = 0;
		for (let e = 0; e < s; ++e) {
			let t = o[e + 1], r = a[s - e], c = i[e] / (t + r);
			i[e] = n + t * c, n = r * c;
		}
		i[s] = n;
	}
	return i;
}
function Vf(e, t, n, r) {
	let i = zf(e, r, t), a = Bf(i, r, e, t), o = new ur(0, 0, 0, 0);
	for (let t = 0; t <= e; ++t) {
		let r = n[i - e + t], s = a[t], c = r.w * s;
		o.x += r.x * c, o.y += r.y * c, o.z += r.z * c, o.w += r.w * s;
	}
	return o;
}
function Hf(e, t, n, r, i) {
	let a = [];
	for (let e = 0; e <= n; ++e) a[e] = 0;
	let o = [];
	for (let e = 0; e <= r; ++e) o[e] = a.slice(0);
	let s = [];
	for (let e = 0; e <= n; ++e) s[e] = a.slice(0);
	s[0][0] = 1;
	let c = a.slice(0), l = a.slice(0);
	for (let r = 1; r <= n; ++r) {
		c[r] = t - i[e + 1 - r], l[r] = i[e + r] - t;
		let n = 0;
		for (let e = 0; e < r; ++e) {
			let t = l[e + 1], i = c[r - e];
			s[r][e] = t + i;
			let a = s[e][r - 1] / s[r][e];
			s[e][r] = n + t * a, n = i * a;
		}
		s[r][r] = n;
	}
	for (let e = 0; e <= n; ++e) o[0][e] = s[e][n];
	for (let e = 0; e <= n; ++e) {
		let t = 0, i = 1, c = [];
		for (let e = 0; e <= n; ++e) c[e] = a.slice(0);
		c[0][0] = 1;
		for (let a = 1; a <= r; ++a) {
			let r = 0, l = e - a, u = n - a;
			e >= a && (c[i][0] = c[t][0] / s[u + 1][l], r = c[i][0] * s[l][u]);
			let d = l >= -1 ? 1 : -l, f = e - 1 <= u ? a - 1 : n - e;
			for (let e = d; e <= f; ++e) c[i][e] = (c[t][e] - c[t][e - 1]) / s[u + 1][l + e], r += c[i][e] * s[l + e][u];
			e <= u && (c[i][a] = -c[t][a - 1] / s[u + 1][e], r += c[i][a] * s[e][u]), o[a][e] = r;
			let p = t;
			t = i, i = p;
		}
	}
	let u = n;
	for (let e = 1; e <= r; ++e) {
		for (let t = 0; t <= n; ++t) o[e][t] *= u;
		u *= n - e;
	}
	return o;
}
function Uf(e, t, n, r, i) {
	let a = i < e ? i : e, o = [], s = zf(e, r, t), c = Hf(s, r, e, a, t), l = [];
	for (let e = 0; e < n.length; ++e) {
		let t = n[e].clone(), r = t.w;
		t.x *= r, t.y *= r, t.z *= r, l[e] = t;
	}
	for (let t = 0; t <= a; ++t) {
		let n = l[s - e].clone().multiplyScalar(c[t][0]);
		for (let r = 1; r <= e; ++r) n.add(l[s - e + r].clone().multiplyScalar(c[t][r]));
		o[t] = n;
	}
	for (let e = a + 1; e <= i + 1; ++e) o[e] = new ur(0, 0, 0);
	return o;
}
function Wf(e, t) {
	let n = 1;
	for (let t = 2; t <= e; ++t) n *= t;
	let r = 1;
	for (let e = 2; e <= t; ++e) r *= e;
	for (let n = 2; n <= e - t; ++n) r *= n;
	return n / r;
}
function Gf(e) {
	let t = e.length, n = [], r = [];
	for (let i = 0; i < t; ++i) {
		let t = e[i];
		n[i] = new W(t.x, t.y, t.z), r[i] = t.w;
	}
	let i = [];
	for (let e = 0; e < t; ++e) {
		let t = n[e].clone();
		for (let n = 1; n <= e; ++n) t.sub(i[e - n].clone().multiplyScalar(Wf(e, n) * r[n]));
		i[e] = t.divideScalar(r[0]);
	}
	return i;
}
function Kf(e, t, n, r, i) {
	return Gf(Uf(e, t, n, r, i));
}
var qf = t((() => {})), Jf, Yf = t((() => {
	gd(), qf(), Jf = class extends xo {
		constructor(e, t, n, r, i) {
			super();
			let a = t ? t.length - 1 : 0, o = n ? n.length : 0;
			this.degree = e, this.knots = t, this.controlPoints = [], this.startKnot = r || 0, this.endKnot = i || a;
			for (let e = 0; e < o; ++e) {
				let t = n[e];
				this.controlPoints[e] = new ur(t.x, t.y, t.z, t.w);
			}
		}
		getPoint(e, t = new W()) {
			let n = t, r = this.knots[this.startKnot] + e * (this.knots[this.endKnot] - this.knots[this.startKnot]), i = Vf(this.degree, this.knots, this.controlPoints, r);
			return i.w !== 1 && i.divideScalar(i.w), n.set(i.x, i.y, i.z);
		}
		getTangent(e, t = new W()) {
			let n = t, r = this.knots[0] + e * (this.knots[this.knots.length - 1] - this.knots[0]), i = Kf(this.degree, this.knots, this.controlPoints, r, 1);
			return n.copy(i[1]).normalize(), n;
		}
		toJSON() {
			let e = super.toJSON();
			return e.degree = this.degree, e.knots = [...this.knots], e.controlPoints = this.controlPoints.map((e) => e.toArray()), e.startKnot = this.startKnot, e.endKnot = this.endKnot, e;
		}
		fromJSON(e) {
			return super.fromJSON(e), this.degree = e.degree, this.knots = [...e.knots], this.controlPoints = e.controlPoints.map((e) => new ur(e[0], e[1], e[2], e[3])), this.startKnot = e.startKnot, this.endKnot = e.endKnot, this;
		}
	};
})), Xf = /* @__PURE__ */ r({ FBXLoader: () => up });
function Zf(e) {
	return e.byteLength >= 21 && ap(e, 0, 21) === "Kaydara FBX Binary  \0";
}
function Qf(e) {
	let t = [
		"K",
		"a",
		"y",
		"d",
		"a",
		"r",
		"a",
		"\\",
		"F",
		"B",
		"X",
		"\\",
		"B",
		"i",
		"n",
		"a",
		"r",
		"y",
		"\\",
		"\\"
	], n = 0;
	function r(t) {
		let r = e[t - 1];
		return e = e.slice(n + t), n++, r;
	}
	for (let e = 0; e < t.length; ++e) if (r(1) === t[e]) return !1;
	return !0;
}
function $f(e) {
	let t = e.match(/FBXVersion: (\d+)/);
	if (t) return parseInt(t[1]);
	throw Error("THREE.FBXLoader: Cannot find the version number for the file given.");
}
function ep(e) {
	return e / 46186158e3;
}
function tp(e, t, n, r) {
	let i;
	switch (r.mappingType) {
		case "ByPolygonVertex":
			i = e;
			break;
		case "ByPolygon":
			i = t;
			break;
		case "ByVertice":
			i = n;
			break;
		case "AllSame":
			i = r.indices[0];
			break;
		default: console.warn("THREE.FBXLoader: unknown attribute mapping type " + r.mappingType);
	}
	r.referenceType === "IndexToDirect" && (i = r.indices[i]);
	let a = i * r.dataSize, o = a + r.dataSize;
	return sp(vp, r.buffer, a, o);
}
function np(e) {
	let t = new q(), n = new q(), r = new q(), i = new q(), a = new q(), o = new q(), s = new q(), c = new q(), l = new q(), u = new q(), d = new q(), f = new q(), p = e.inheritType ? e.inheritType : 0;
	e.translation && t.setPosition(bp.fromArray(e.translation));
	let m = rp(0);
	if (e.preRotation) {
		let t = e.preRotation.map(Xn.degToRad);
		t.push(m), n.makeRotationFromEuler(yp.fromArray(t));
	}
	if (e.rotation) {
		let t = e.rotation.map(Xn.degToRad);
		t.push(e.eulerOrder || m), r.makeRotationFromEuler(yp.fromArray(t));
	}
	if (e.postRotation) {
		let t = e.postRotation.map(Xn.degToRad);
		t.push(m), i.makeRotationFromEuler(yp.fromArray(t)), i.invert();
	}
	e.scale && a.scale(bp.fromArray(e.scale)), e.scalingOffset && s.setPosition(bp.fromArray(e.scalingOffset)), e.scalingPivot && o.setPosition(bp.fromArray(e.scalingPivot)), e.rotationOffset && c.setPosition(bp.fromArray(e.rotationOffset)), e.rotationPivot && l.setPosition(bp.fromArray(e.rotationPivot)), e.parentMatrixWorld && (d.copy(e.parentMatrix), u.copy(e.parentMatrixWorld));
	let h = n.clone().multiply(r).multiply(i), g = new q();
	g.extractRotation(u);
	let _ = new q();
	_.copyPosition(u);
	let v = _.clone().invert().multiply(u), y = g.clone().invert().multiply(v), b = a, x = new q();
	if (p === 0) x.copy(g).multiply(h).multiply(y).multiply(b);
	else if (p === 1) x.copy(g).multiply(y).multiply(h).multiply(b);
	else {
		let e = new q().scale(new W().setFromMatrixScale(d)).clone().invert(), t = y.clone().multiply(e);
		x.copy(g).multiply(h).multiply(t).multiply(b);
	}
	let S = l.clone().invert(), C = o.clone().invert(), w = t.clone().multiply(c).multiply(l).multiply(n).multiply(r).multiply(i).multiply(S).multiply(s).multiply(o).multiply(a).multiply(C), T = new q().copyPosition(w), E = u.clone().multiply(T);
	return f.copyPosition(E), w = f.clone().multiply(x), w.premultiply(u.invert()), w;
}
function rp(e) {
	e = e || 0;
	let t = [
		"ZYX",
		"YZX",
		"XZY",
		"ZXY",
		"YXZ",
		"XYZ"
	];
	return e === 6 ? (console.warn("THREE.FBXLoader: unsupported Euler Order: Spherical XYZ. Animations and rotations may be incorrect."), t[0]) : t[e];
}
function ip(e) {
	return e.split(",").map(function(e) {
		return parseFloat(e);
	});
}
function ap(e, t, n) {
	return t === void 0 && (t = 0), n === void 0 && (n = e.byteLength), new TextDecoder().decode(new Uint8Array(e, t, n));
}
function op(e, t) {
	for (let n = 0, r = e.length, i = t.length; n < i; n++, r++) e[r] = t[n];
}
function sp(e, t, n, r) {
	for (let i = n, a = 0; i < r; i++, a++) e[a] = t[i];
	return e;
}
var Z, cp, lp, up, dp, fp, pp, mp, hp, gp, _p, vp, yp, bp, xp = t((() => {
	gd(), Rf(), Yf(), up = class extends es {
		constructor(e) {
			super(e);
		}
		load(e, t, n, r) {
			let i = this, a = i.path === "" ? ks.extractUrlBase(e) : i.path, o = new rs(this.manager);
			o.setPath(i.path), o.setResponseType("arraybuffer"), o.setRequestHeader(i.requestHeader), o.setWithCredentials(i.withCredentials), o.load(e, function(n) {
				try {
					t(i.parse(n, a));
				} catch (t) {
					r ? r(t) : console.error(t), i.manager.itemError(e);
				}
			}, n, r);
		}
		parse(e, t) {
			if (Zf(e)) Z = new hp().parse(e);
			else {
				let t = ap(e);
				if (!Qf(t)) throw Error("THREE.FBXLoader: Unknown format.");
				if ($f(t) < 7e3) throw Error("THREE.FBXLoader: FBX version not supported, FileVersion: " + $f(t));
				Z = new mp().parse(t);
			}
			let n = new os(this.manager).setPath(this.resourcePath || t).setCrossOrigin(this.crossOrigin);
			return new dp(n, this.manager).parse(Z);
		}
	}, dp = class {
		constructor(e, t) {
			this.textureLoader = e, this.manager = t;
		}
		parse() {
			cp = this.parseConnections();
			let e = this.parseImages(), t = this.parseTextures(e), n = this.parseMaterials(t), r = this.parseDeformers(), i = new fp().parse(r);
			return this.parseScene(r, i, n), lp;
		}
		parseConnections() {
			let e = /* @__PURE__ */ new Map();
			return "Connections" in Z && Z.Connections.connections.forEach(function(t) {
				let n = t[0], r = t[1], i = t[2];
				e.has(n) || e.set(n, {
					parents: [],
					children: []
				});
				let a = {
					ID: r,
					relationship: i
				};
				e.get(n).parents.push(a), e.has(r) || e.set(r, {
					parents: [],
					children: []
				});
				let o = {
					ID: n,
					relationship: i
				};
				e.get(r).children.push(o);
			}), e;
		}
		parseImages() {
			let e = {}, t = {};
			if ("Video" in Z.Objects) {
				let n = Z.Objects.Video;
				for (let r in n) {
					let i = n[r], a = parseInt(r);
					if (e[a] = i.RelativeFilename || i.Filename, "Content" in i) {
						let e = i.Content instanceof ArrayBuffer && i.Content.byteLength > 0, a = typeof i.Content == "string" && i.Content !== "";
						if (e || a) {
							let e = this.parseImage(n[r]);
							t[i.RelativeFilename || i.Filename] = e;
						}
					}
				}
			}
			for (let n in e) {
				let r = e[n];
				e[n] = t[r] === void 0 ? e[n].split("\\").pop() : t[r];
			}
			return e;
		}
		parseImage(e) {
			let t = e.Content, n = e.RelativeFilename || e.Filename, r = n.slice(n.lastIndexOf(".") + 1).toLowerCase(), i;
			switch (r) {
				case "bmp":
					i = "image/bmp";
					break;
				case "jpg":
				case "jpeg":
					i = "image/jpeg";
					break;
				case "png":
					i = "image/png";
					break;
				case "tif":
					i = "image/tiff";
					break;
				case "tga":
					this.manager.getHandler(".tga") === null && console.warn("FBXLoader: TGA loader not found, skipping ", n), i = "image/tga";
					break;
				case "webp":
					i = "image/webp";
					break;
				default:
					console.warn("FBXLoader: Image type \"" + r + "\" is not supported.");
					return;
			}
			if (typeof t == "string") return "data:" + i + ";base64," + t;
			{
				let e = new Uint8Array(t);
				return window.URL.createObjectURL(new Blob([e], { type: i }));
			}
		}
		parseTextures(e) {
			let t = /* @__PURE__ */ new Map();
			if ("Texture" in Z.Objects) {
				let n = Z.Objects.Texture;
				for (let r in n) {
					let i = this.parseTexture(n[r], e);
					t.set(parseInt(r), i);
				}
			}
			return t;
		}
		parseTexture(e, t) {
			let n = this.loadTexture(e, t);
			n.ID = e.id, n.name = e.attrName;
			let r = e.WrapModeU, i = e.WrapModeV, a = r === void 0 ? 0 : r.value, o = i === void 0 ? 0 : i.value;
			if (n.wrapS = a === 0 ? lt : ut, n.wrapT = o === 0 ? lt : ut, "Scaling" in e) {
				let t = e.Scaling.value;
				n.repeat.x = t[0], n.repeat.y = t[1];
			}
			if ("Translation" in e) {
				let t = e.Translation.value;
				n.offset.x = t[0], n.offset.y = t[1];
			}
			return n;
		}
		loadTexture(e, t) {
			let n = e.FileName.split(".").pop().toLowerCase(), r = this.manager.getHandler(`.${n}`);
			r === null && (r = this.textureLoader);
			let i = r.path;
			i || r.setPath(this.textureLoader.path);
			let a = cp.get(e.id).children, o;
			if (a !== void 0 && a.length > 0 && t[a[0].ID] !== void 0 && (o = t[a[0].ID], (o.indexOf("blob:") === 0 || o.indexOf("data:") === 0) && r.setPath(void 0)), o === void 0) return console.warn("FBXLoader: Undefined filename, creating placeholder texture."), new lr();
			let s = r.load(o);
			return r.setPath(i), s;
		}
		parseMaterials(e) {
			let t = /* @__PURE__ */ new Map();
			if ("Material" in Z.Objects) {
				let n = Z.Objects.Material;
				for (let r in n) {
					let i = this.parseMaterial(n[r], e);
					i !== null && t.set(parseInt(r), i);
				}
			}
			return t;
		}
		parseMaterial(e, t) {
			let n = e.id, r = e.attrName, i = e.ShadingModel;
			if (typeof i == "object" && (i = i.value), !cp.has(n)) return null;
			let a = this.parseParameters(e, t, n), o;
			switch (i.toLowerCase()) {
				case "phong":
					o = new No();
					break;
				case "lambert":
					o = new Po();
					break;
				default: console.warn("THREE.FBXLoader: unknown material type \"%s\". Defaulting to MeshPhongMaterial.", i), o = new No();
			}
			return o.setValues(a), o.name = r, o;
		}
		parseParameters(e, t, n) {
			let r = {};
			e.BumpFactor && (r.bumpScale = e.BumpFactor.value), e.Diffuse ? r.color = K.colorSpaceToWorking(new J().fromArray(e.Diffuse.value), H) : e.DiffuseColor && (e.DiffuseColor.type === "Color" || e.DiffuseColor.type === "ColorRGB") && (r.color = K.colorSpaceToWorking(new J().fromArray(e.DiffuseColor.value), H)), e.DisplacementFactor && (r.displacementScale = e.DisplacementFactor.value), e.Emissive ? r.emissive = K.colorSpaceToWorking(new J().fromArray(e.Emissive.value), H) : e.EmissiveColor && (e.EmissiveColor.type === "Color" || e.EmissiveColor.type === "ColorRGB") && (r.emissive = K.colorSpaceToWorking(new J().fromArray(e.EmissiveColor.value), H)), e.EmissiveFactor && (r.emissiveIntensity = parseFloat(e.EmissiveFactor.value)), r.opacity = 1 - (e.TransparencyFactor ? parseFloat(e.TransparencyFactor.value) : 0), (r.opacity === 1 || r.opacity === 0) && (r.opacity = e.Opacity ? parseFloat(e.Opacity.value) : null, r.opacity === null && (r.opacity = 1)), r.opacity < 1 && (r.transparent = !0), e.ReflectionFactor && (r.reflectivity = e.ReflectionFactor.value), e.Shininess && (r.shininess = e.Shininess.value), e.Specular ? r.specular = K.colorSpaceToWorking(new J().fromArray(e.Specular.value), H) : e.SpecularColor && e.SpecularColor.type === "Color" && (r.specular = K.colorSpaceToWorking(new J().fromArray(e.SpecularColor.value), H));
			let i = this;
			return cp.get(n).children.forEach(function(e) {
				let n = e.relationship;
				switch (n) {
					case "Bump":
						r.bumpMap = i.getTexture(t, e.ID);
						break;
					case "Maya|TEX_ao_map":
						r.aoMap = i.getTexture(t, e.ID);
						break;
					case "DiffuseColor":
					case "Maya|TEX_color_map":
						r.map = i.getTexture(t, e.ID), r.map !== void 0 && (r.map.colorSpace = H);
						break;
					case "DisplacementColor":
						r.displacementMap = i.getTexture(t, e.ID);
						break;
					case "EmissiveColor":
						r.emissiveMap = i.getTexture(t, e.ID), r.emissiveMap !== void 0 && (r.emissiveMap.colorSpace = H);
						break;
					case "NormalMap":
					case "Maya|TEX_normal_map":
						r.normalMap = i.getTexture(t, e.ID);
						break;
					case "ReflectionColor":
						r.envMap = i.getTexture(t, e.ID), r.envMap !== void 0 && (r.envMap.mapping = 303, r.envMap.colorSpace = H);
						break;
					case "SpecularColor":
						r.specularMap = i.getTexture(t, e.ID), r.specularMap !== void 0 && (r.specularMap.colorSpace = H);
						break;
					case "TransparentColor":
					case "TransparencyFactor":
						r.alphaMap = i.getTexture(t, e.ID), r.transparent = !0;
						break;
					default: console.warn("THREE.FBXLoader: %s map is not supported in three.js, skipping texture.", n);
				}
			}), r;
		}
		getTexture(e, t) {
			return "LayeredTexture" in Z.Objects && t in Z.Objects.LayeredTexture && (console.warn("THREE.FBXLoader: layered textures are not supported in three.js. Discarding all but first layer."), t = cp.get(t).children[0].ID), e.get(t);
		}
		parseDeformers() {
			let e = {}, t = {};
			if ("Deformer" in Z.Objects) {
				let n = Z.Objects.Deformer;
				for (let r in n) {
					let i = n[r], a = cp.get(parseInt(r));
					if (i.attrType === "Skin") {
						let t = this.parseSkeleton(a, n);
						t.ID = r, a.parents.length > 1 && console.warn("THREE.FBXLoader: skeleton attached to more than one geometry is not supported."), t.geometryID = a.parents[0].ID, e[r] = t;
					} else if (i.attrType === "BlendShape") {
						let e = { id: r };
						e.rawTargets = this.parseMorphTargets(a, n), e.id = r, a.parents.length > 1 && console.warn("THREE.FBXLoader: morph target attached to more than one geometry is not supported."), t[r] = e;
					}
				}
			}
			return {
				skeletons: e,
				morphTargets: t
			};
		}
		parseSkeleton(e, t) {
			let n = [];
			return e.children.forEach(function(e) {
				let r = t[e.ID];
				if (r.attrType !== "Cluster") return;
				let i = {
					ID: e.ID,
					indices: [],
					weights: [],
					transformLink: new q().fromArray(r.TransformLink.a)
				};
				"Indexes" in r && (i.indices = r.Indexes.a, i.weights = r.Weights.a), n.push(i);
			}), {
				rawBones: n,
				bones: []
			};
		}
		parseMorphTargets(e, t) {
			let n = [];
			for (let r = 0; r < e.children.length; r++) {
				let i = e.children[r], a = t[i.ID], o = {
					name: a.attrName,
					initialWeight: a.DeformPercent,
					id: a.id,
					fullWeights: a.FullWeights.a
				};
				if (a.attrType !== "BlendShapeChannel") return;
				o.geoID = cp.get(parseInt(i.ID)).children.filter(function(e) {
					return e.relationship === void 0;
				})[0].ID, n.push(o);
			}
			return n;
		}
		parseScene(e, t, n) {
			lp = new Hr();
			let r = this.parseModels(e.skeletons, t, n), i = Z.Objects.Model, a = this;
			r.forEach(function(e) {
				let t = i[e.ID];
				a.setLookAtProperties(e, t), cp.get(e.ID).parents.forEach(function(t) {
					let n = r.get(t.ID);
					n !== void 0 && n.add(e);
				}), e.parent === null && lp.add(e);
			}), this.addGlobalSceneSettings(), lp.traverse(function(e) {
				if (e.userData.transformData) {
					e.parent && (e.userData.transformData.parentMatrix = e.parent.matrix, e.userData.transformData.parentMatrixWorld = e.parent.matrixWorld);
					let t = np(e.userData.transformData);
					e.applyMatrix4(t), e.updateWorldMatrix();
				}
			});
			let o = this.parsePoseNodes(), s = /* @__PURE__ */ new Set();
			for (let t in e.skeletons) e.skeletons[t].rawBones.forEach(function(n, r) {
				let i = e.skeletons[t].bones[r];
				i && s.add(i.ID);
			});
			let c = new q();
			lp.traverse(function(e) {
				if (e.isBone && e.ID !== void 0 && !s.has(e.ID)) {
					let t = o[e.ID];
					t !== void 0 && (e.parent ? (c.copy(e.parent.matrixWorld).invert(), c.multiply(t)) : c.copy(t), c.decompose(e.position, e.quaternion, e.scale), e.updateMatrix(), e.matrixWorld.copy(t));
				}
			}), this.bindSkeleton(e.skeletons, t, r);
			let l = new pp().parse();
			lp.children.length === 1 && lp.children[0].isGroup && (lp.children[0].animations = l, lp = lp.children[0]), lp.animations = l, "GlobalSettings" in Z && "UpAxis" in Z.GlobalSettings && Z.GlobalSettings.UpAxis.value === 2 && (console.warn("THREE.FBXLoader: You are loading an asset with a Z-UP coordinate system. The loader just rotates the asset to transform it into Y-UP. The vertex data are not converted."), lp.rotation.set(-Math.PI / 2, 0, 0));
		}
		parseModels(e, t, n) {
			let r = /* @__PURE__ */ new Map(), i = Z.Objects.Model;
			for (let a in i) {
				let o = parseInt(a), s = i[a], c = cp.get(o), l = this.buildSkeleton(c, e, o, s.attrName);
				if (!l) {
					switch (s.attrType) {
						case "Camera":
							l = this.createCamera(c);
							break;
						case "Light":
							l = this.createLight(c);
							break;
						case "Mesh":
							l = this.createMesh(c, t, n);
							break;
						case "NurbsCurve":
							l = this.createCurve(c, t);
							break;
						case "LimbNode":
						case "Root":
							l = new Ta();
							break;
						default: l = new Hr();
					}
					l.name = s.attrName ? Js.sanitizeNodeName(s.attrName) : "", l.userData.originalName = s.attrName, l.ID = o;
				}
				this.getTransformData(l, s), r.set(o, l);
			}
			return r;
		}
		buildSkeleton(e, t, n, r) {
			let i = null;
			return e.parents.forEach(function(e) {
				for (let a in t) {
					let o = t[a];
					o.rawBones.forEach(function(t, a) {
						if (t.ID === e.ID) {
							let e = i;
							i = new Ta(), i.matrixWorld.copy(t.transformLink), i.name = r ? Js.sanitizeNodeName(r) : "", i.userData.originalName = r, i.ID = n, o.bones[a] = i, e !== null && i.add(e);
						}
					});
				}
			}), i;
		}
		createCamera(e) {
			let t, n;
			if (e.children.forEach(function(e) {
				let t = Z.Objects.NodeAttribute[e.ID];
				t !== void 0 && (n = t);
			}), n === void 0) t = new Vr();
			else {
				let e = 0;
				n.CameraProjectionType !== void 0 && n.CameraProjectionType.value === 1 && (e = 1);
				let r = 1;
				n.NearPlane !== void 0 && (r = n.NearPlane.value / 1e3);
				let i = 1e3;
				n.FarPlane !== void 0 && (i = n.FarPlane.value / 1e3);
				let a = window.innerWidth, o = window.innerHeight;
				n.AspectWidth !== void 0 && n.AspectHeight !== void 0 && (a = n.AspectWidth.value, o = n.AspectHeight.value);
				let s = a / o, c = 45;
				n.FieldOfView !== void 0 && (c = n.FieldOfView.value);
				let l = n.FocalLength ? n.FocalLength.value : null;
				switch (e) {
					case 0:
						t = new ys(c, s, r, i), l !== null && t.setFocalLength(l);
						break;
					case 1:
						console.warn("THREE.FBXLoader: Orthographic cameras not supported yet."), t = new Vr();
						break;
					default: console.warn("THREE.FBXLoader: Unknown camera type " + e + "."), t = new Vr();
				}
			}
			return t;
		}
		createLight(e) {
			let t, n;
			if (e.children.forEach(function(e) {
				let t = Z.Objects.NodeAttribute[e.ID];
				t !== void 0 && (n = t);
			}), n === void 0) t = new Vr();
			else {
				let e;
				e = n.LightType === void 0 ? 0 : n.LightType.value;
				let r = 16777215;
				n.Color !== void 0 && (r = K.colorSpaceToWorking(new J().fromArray(n.Color.value), H));
				let i = n.Intensity === void 0 ? 1 : n.Intensity.value / 100;
				n.CastLightOnObject !== void 0 && n.CastLightOnObject.value === 0 && (i = 0);
				let a = 0;
				switch (n.FarAttenuationEnd !== void 0 && (a = n.EnableFarAttenuation !== void 0 && n.EnableFarAttenuation.value === 0 ? 0 : n.FarAttenuationEnd.value), e) {
					case 0:
						t = new Cs(r, i, a, 1);
						break;
					case 1:
						t = new Es(r, i);
						break;
					case 2:
						let e = Math.PI / 3, o = 0;
						n.OuterAngle === void 0 ? n.InnerAngle !== void 0 && (e = Xn.degToRad(n.InnerAngle.value)) : (e = Xn.degToRad(n.OuterAngle.value), n.InnerAngle !== void 0 && (o = 1 - n.InnerAngle.value / n.OuterAngle.value, o = Math.max(0, o))), t = new xs(r, i, a, e, o, 1);
						break;
					default: console.warn("THREE.FBXLoader: Unknown light type " + n.LightType.value + ", defaulting to a PointLight."), t = new Cs(r, i);
				}
				n.CastShadows !== void 0 && n.CastShadows.value === 1 && (t.castShadow = !0);
			}
			return t;
		}
		createMesh(e, t, n) {
			let r, i = null, a = null, o = [];
			if (e.children.forEach(function(e) {
				t.has(e.ID) && (i = t.get(e.ID)), n.has(e.ID) && o.push(n.get(e.ID));
			}), o.length > 1 ? a = o : o.length > 0 ? a = o[0] : (a = new No({
				name: es.DEFAULT_MATERIAL_NAME,
				color: 13421772
			}), o.push(a)), "color" in i.attributes && o.forEach(function(e) {
				e.vertexColors = !0;
			}), i.groups.length > 0) {
				let e = !1;
				for (let t = 0, n = i.groups.length; t < n; t++) {
					let n = i.groups[t];
					(n.materialIndex < 0 || n.materialIndex >= o.length) && (n.materialIndex = o.length, e = !0);
				}
				if (e) {
					let e = new No();
					o.push(e);
				}
			}
			return i.FBX_Deformer ? (r = new wa(i, a), r.normalizeSkinWeights()) : r = new ma(i, a), r;
		}
		createCurve(e, t) {
			let n = e.children.reduce(function(e, n) {
				return t.has(n.ID) && (e = t.get(n.ID)), e;
			}, null), r = new qa({
				name: es.DEFAULT_MATERIAL_NAME,
				color: 3342591,
				linewidth: 1
			});
			return new to(n, r);
		}
		getTransformData(e, t) {
			let n = {};
			"InheritType" in t && (n.inheritType = parseInt(t.InheritType.value)), n.eulerOrder = "RotationOrder" in t ? rp(t.RotationOrder.value) : rp(0), "Lcl_Translation" in t && (n.translation = t.Lcl_Translation.value), "PreRotation" in t && (n.preRotation = t.PreRotation.value), "Lcl_Rotation" in t && (n.rotation = t.Lcl_Rotation.value), "PostRotation" in t && (n.postRotation = t.PostRotation.value), "Lcl_Scaling" in t && (n.scale = t.Lcl_Scaling.value), "ScalingOffset" in t && (n.scalingOffset = t.ScalingOffset.value), "ScalingPivot" in t && (n.scalingPivot = t.ScalingPivot.value), "RotationOffset" in t && (n.rotationOffset = t.RotationOffset.value), "RotationPivot" in t && (n.rotationPivot = t.RotationPivot.value), e.userData.transformData = n;
		}
		setLookAtProperties(e, t) {
			"LookAtProperty" in t && cp.get(e.ID).children.forEach(function(t) {
				if (t.relationship === "LookAtProperty") {
					let n = Z.Objects.Model[t.ID];
					if ("Lcl_Translation" in n) {
						let t = n.Lcl_Translation.value;
						e.target === void 0 ? e.lookAt(new W().fromArray(t)) : (e.target.position.fromArray(t), lp.add(e.target));
					}
				}
			});
		}
		bindSkeleton(e, t, n) {
			for (let r in e) {
				let i = e[r], a = [];
				for (let e = 0, t = i.bones.length; e < t; e++) {
					let t = new q();
					i.bones[e] && i.rawBones[e] && t.copy(i.rawBones[e].transformLink).invert(), a.push(t);
				}
				cp.get(parseInt(i.ID)).parents.forEach(function(e) {
					if (t.has(e.ID)) {
						let t = e.ID;
						cp.get(t).parents.forEach(function(e) {
							if (n.has(e.ID)) {
								let t = n.get(e.ID);
								t.updateMatrixWorld(!0), t.bind(new ka(i.bones, a), t.matrixWorld);
							}
						});
					}
				});
			}
		}
		parsePoseNodes() {
			let e = {};
			if ("Pose" in Z.Objects) {
				let t = Z.Objects.Pose;
				for (let n in t) if (t[n].attrType === "BindPose" && t[n].NbPoseNodes > 0) {
					let r = t[n].PoseNode;
					Array.isArray(r) ? r.forEach(function(t) {
						e[t.Node] = new q().fromArray(t.Matrix.a);
					}) : e[r.Node] = new q().fromArray(r.Matrix.a);
				}
			}
			return e;
		}
		addGlobalSceneSettings() {
			if ("GlobalSettings" in Z) {
				if ("AmbientColor" in Z.GlobalSettings) {
					let e = Z.GlobalSettings.AmbientColor.value, t = e[0], n = e[1], r = e[2];
					if (t !== 0 || n !== 0 || r !== 0) {
						let e = new J().setRGB(t, n, r, H);
						lp.add(new Ds(e, 1));
					}
				}
				"UnitScaleFactor" in Z.GlobalSettings && (lp.userData.unitScaleFactor = Z.GlobalSettings.UnitScaleFactor.value);
			}
		}
	}, fp = class {
		constructor() {
			this.negativeMaterialIndices = !1;
		}
		parse(e) {
			let t = /* @__PURE__ */ new Map();
			if ("Geometry" in Z.Objects) {
				let n = Z.Objects.Geometry;
				for (let r in n) {
					let i = cp.get(parseInt(r)), a = this.parseGeometry(i, n[r], e);
					t.set(parseInt(r), a);
				}
			}
			return this.negativeMaterialIndices === !0 && console.warn("THREE.FBXLoader: The FBX file contains invalid (negative) material indices. The asset might not render as expected."), t;
		}
		parseGeometry(e, t, n) {
			switch (t.attrType) {
				case "Mesh": return this.parseMeshGeometry(e, t, n);
				case "NurbsCurve": return this.parseNurbsGeometry(t);
			}
		}
		parseMeshGeometry(e, t, n) {
			let r = n.skeletons, i = [], a = e.parents.map(function(e) {
				return Z.Objects.Model[e.ID];
			});
			if (a.length === 0) return;
			let o = e.children.reduce(function(e, t) {
				return r[t.ID] !== void 0 && (e = r[t.ID]), e;
			}, null);
			e.children.forEach(function(e) {
				n.morphTargets[e.ID] !== void 0 && i.push(n.morphTargets[e.ID]);
			});
			let s = a[0], c = {};
			"RotationOrder" in s && (c.eulerOrder = rp(s.RotationOrder.value)), "InheritType" in s && (c.inheritType = parseInt(s.InheritType.value)), "GeometricTranslation" in s && (c.translation = s.GeometricTranslation.value), "GeometricRotation" in s && (c.rotation = s.GeometricRotation.value), "GeometricScaling" in s && (c.scale = s.GeometricScaling.value);
			let l = np(c);
			return this.genGeometry(t, o, i, l);
		}
		genGeometry(e, t, n, r) {
			let i = new Hi();
			e.attrName && (i.name = e.attrName);
			let a = this.parseGeoNode(e, t), o = this.genBuffers(a), s = new Ai(o.vertex, 3);
			if (s.applyMatrix4(r), i.setAttribute("position", s), o.colors.length > 0 && i.setAttribute("color", new Ai(o.colors, 3)), t && (i.setAttribute("skinIndex", new Oi(o.weightsIndices, 4)), i.setAttribute("skinWeight", new Ai(o.vertexWeights, 4)), i.FBX_Deformer = t), o.normal.length > 0) {
				let e = new G().getNormalMatrix(r), t = new Ai(o.normal, 3);
				t.applyNormalMatrix(e), i.setAttribute("normal", t);
			}
			if (o.uvs.forEach(function(e, t) {
				let n = t === 0 ? "uv" : `uv${t}`;
				i.setAttribute(n, new Ai(o.uvs[t], 2));
			}), a.material && a.material.mappingType !== "AllSame") {
				let e = o.materialIndex[0], t = 0;
				if (o.materialIndex.forEach(function(n, r) {
					n !== e && (i.addGroup(t, r - t, e), e = n, t = r);
				}), i.groups.length > 0) {
					let t = i.groups[i.groups.length - 1], n = t.start + t.count;
					n !== o.materialIndex.length && i.addGroup(n, o.materialIndex.length - n, e);
				}
				i.groups.length === 0 && i.addGroup(0, o.materialIndex.length, o.materialIndex[0]);
			}
			return this.addMorphTargets(i, e, n, r), i;
		}
		parseGeoNode(e, t) {
			let n = {};
			if (n.vertexPositions = e.Vertices === void 0 ? [] : e.Vertices.a, n.vertexIndices = e.PolygonVertexIndex === void 0 ? [] : e.PolygonVertexIndex.a, e.LayerElementColor && e.LayerElementColor[0].Colors && (n.color = this.parseVertexColors(e.LayerElementColor[0])), e.LayerElementMaterial && (n.material = this.parseMaterialIndices(e.LayerElementMaterial[0])), e.LayerElementNormal && (n.normal = this.parseNormals(e.LayerElementNormal[0])), e.LayerElementUV) {
				n.uv = [];
				let t = 0;
				for (; e.LayerElementUV[t];) e.LayerElementUV[t].UV && n.uv.push(this.parseUVs(e.LayerElementUV[t])), t++;
			}
			return n.weightTable = {}, t !== null && (n.skeleton = t, t.rawBones.forEach(function(e, t) {
				e.indices.forEach(function(r, i) {
					n.weightTable[r] === void 0 && (n.weightTable[r] = []), n.weightTable[r].push({
						id: t,
						weight: e.weights[i]
					});
				});
			})), n;
		}
		genBuffers(e) {
			let t = {
				vertex: [],
				normal: [],
				colors: [],
				uvs: [],
				materialIndex: [],
				vertexWeights: [],
				weightsIndices: []
			}, n = 0, r = 0, i = !1, a = [], o = [], s = [], c = [], l = [], u = [], d = this;
			return e.vertexIndices.forEach(function(f, p) {
				let m, h = !1;
				f < 0 && (f ^= -1, h = !0);
				let g = [], _ = [];
				if (a.push(f * 3, f * 3 + 1, f * 3 + 2), e.color) {
					let t = tp(p, n, f, e.color);
					s.push(t[0], t[1], t[2]);
				}
				if (e.skeleton) {
					if (e.weightTable[f] !== void 0 && e.weightTable[f].forEach(function(e) {
						_.push(e.weight), g.push(e.id);
					}), _.length > 4) {
						i || (console.warn("THREE.FBXLoader: Vertex has more than 4 skinning weights assigned to vertex. Deleting additional weights."), i = !0);
						let e = [
							0,
							0,
							0,
							0
						], t = [
							0,
							0,
							0,
							0
						];
						_.forEach(function(n, r) {
							let i = n, a = g[r];
							t.forEach(function(t, n, r) {
								if (i > t) {
									r[n] = i, i = t;
									let o = e[n];
									e[n] = a, a = o;
								}
							});
						}), g = e, _ = t;
					}
					for (; _.length < 4;) _.push(0), g.push(0);
					for (let e = 0; e < 4; ++e) l.push(_[e]), u.push(g[e]);
				}
				if (e.normal) {
					let t = tp(p, n, f, e.normal);
					o.push(t[0], t[1], t[2]);
				}
				e.material && e.material.mappingType !== "AllSame" && (m = tp(p, n, f, e.material)[0], m < 0 && (d.negativeMaterialIndices = !0, m = 0)), e.uv && e.uv.forEach(function(e, t) {
					let r = tp(p, n, f, e);
					c[t] === void 0 && (c[t] = []), c[t].push(r[0]), c[t].push(r[1]);
				}), r++, h && (d.genFace(t, e, a, m, o, s, c, l, u, r), n++, r = 0, a = [], o = [], s = [], c = [], l = [], u = []);
			}), t;
		}
		getNormalNewell(e) {
			let t = new W(0, 0, 0);
			for (let n = 0; n < e.length; n++) {
				let r = e[n], i = e[(n + 1) % e.length];
				t.x += (r.y - i.y) * (r.z + i.z), t.y += (r.z - i.z) * (r.x + i.x), t.z += (r.x - i.x) * (r.y + i.y);
			}
			return t.normalize(), t;
		}
		getNormalTangentAndBitangent(e) {
			let t = this.getNormalNewell(e), n = (Math.abs(t.z) > .5 ? new W(0, 1, 0) : new W(0, 0, 1)).cross(t).normalize();
			return {
				normal: t,
				tangent: n,
				bitangent: t.clone().cross(n).normalize()
			};
		}
		flattenVertex(e, t, n) {
			return new U(e.dot(t), e.dot(n));
		}
		genFace(e, t, n, r, i, a, o, s, c, l) {
			let u;
			if (l > 3) {
				let e = [], r = t.baseVertexPositions || t.vertexPositions;
				for (let t = 0; t < n.length; t += 3) e.push(new W(r[n[t]], r[n[t + 1]], r[n[t + 2]]));
				let { tangent: i, bitangent: a } = this.getNormalTangentAndBitangent(e), o = [];
				for (let t of e) o.push(this.flattenVertex(t, i, a));
				u = Co.triangulateShape(o, []);
			} else u = [[
				0,
				1,
				2
			]];
			for (let [l, d, f] of u) e.vertex.push(t.vertexPositions[n[l * 3]]), e.vertex.push(t.vertexPositions[n[l * 3 + 1]]), e.vertex.push(t.vertexPositions[n[l * 3 + 2]]), e.vertex.push(t.vertexPositions[n[d * 3]]), e.vertex.push(t.vertexPositions[n[d * 3 + 1]]), e.vertex.push(t.vertexPositions[n[d * 3 + 2]]), e.vertex.push(t.vertexPositions[n[f * 3]]), e.vertex.push(t.vertexPositions[n[f * 3 + 1]]), e.vertex.push(t.vertexPositions[n[f * 3 + 2]]), t.skeleton && (e.vertexWeights.push(s[l * 4]), e.vertexWeights.push(s[l * 4 + 1]), e.vertexWeights.push(s[l * 4 + 2]), e.vertexWeights.push(s[l * 4 + 3]), e.vertexWeights.push(s[d * 4]), e.vertexWeights.push(s[d * 4 + 1]), e.vertexWeights.push(s[d * 4 + 2]), e.vertexWeights.push(s[d * 4 + 3]), e.vertexWeights.push(s[f * 4]), e.vertexWeights.push(s[f * 4 + 1]), e.vertexWeights.push(s[f * 4 + 2]), e.vertexWeights.push(s[f * 4 + 3]), e.weightsIndices.push(c[l * 4]), e.weightsIndices.push(c[l * 4 + 1]), e.weightsIndices.push(c[l * 4 + 2]), e.weightsIndices.push(c[l * 4 + 3]), e.weightsIndices.push(c[d * 4]), e.weightsIndices.push(c[d * 4 + 1]), e.weightsIndices.push(c[d * 4 + 2]), e.weightsIndices.push(c[d * 4 + 3]), e.weightsIndices.push(c[f * 4]), e.weightsIndices.push(c[f * 4 + 1]), e.weightsIndices.push(c[f * 4 + 2]), e.weightsIndices.push(c[f * 4 + 3])), t.color && (e.colors.push(a[l * 3]), e.colors.push(a[l * 3 + 1]), e.colors.push(a[l * 3 + 2]), e.colors.push(a[d * 3]), e.colors.push(a[d * 3 + 1]), e.colors.push(a[d * 3 + 2]), e.colors.push(a[f * 3]), e.colors.push(a[f * 3 + 1]), e.colors.push(a[f * 3 + 2])), t.material && t.material.mappingType !== "AllSame" && (e.materialIndex.push(r), e.materialIndex.push(r), e.materialIndex.push(r)), t.normal && (e.normal.push(i[l * 3]), e.normal.push(i[l * 3 + 1]), e.normal.push(i[l * 3 + 2]), e.normal.push(i[d * 3]), e.normal.push(i[d * 3 + 1]), e.normal.push(i[d * 3 + 2]), e.normal.push(i[f * 3]), e.normal.push(i[f * 3 + 1]), e.normal.push(i[f * 3 + 2])), t.uv && t.uv.forEach(function(t, n) {
				e.uvs[n] === void 0 && (e.uvs[n] = []), e.uvs[n].push(o[n][l * 2]), e.uvs[n].push(o[n][l * 2 + 1]), e.uvs[n].push(o[n][d * 2]), e.uvs[n].push(o[n][d * 2 + 1]), e.uvs[n].push(o[n][f * 2]), e.uvs[n].push(o[n][f * 2 + 1]);
			});
		}
		addMorphTargets(e, t, n, r) {
			if (n.length === 0) return;
			e.morphTargetsRelative = !0, e.morphAttributes.position = [];
			let i = r.clone().setPosition(0, 0, 0), a = this;
			n.forEach(function(n) {
				n.rawTargets.forEach(function(n) {
					let r = Z.Objects.Geometry[n.geoID];
					r !== void 0 && a.genMorphGeometry(e, t, r, i, n.name);
				});
			});
		}
		genMorphGeometry(e, t, n, r, i) {
			let a = t.Vertices === void 0 ? [] : t.Vertices.a, o = t.PolygonVertexIndex === void 0 ? [] : t.PolygonVertexIndex.a, s = n.Vertices === void 0 ? [] : n.Vertices.a, c = n.Indexes === void 0 ? [] : n.Indexes.a, l = e.attributes.position.count * 3, u = new Float32Array(l);
			for (let e = 0; e < c.length; e++) {
				let t = c[e] * 3;
				u[t] = s[e * 3], u[t + 1] = s[e * 3 + 1], u[t + 2] = s[e * 3 + 2];
			}
			let d = {
				vertexIndices: o,
				vertexPositions: u,
				baseVertexPositions: a
			}, f = this.genBuffers(d), p = new Ai(f.vertex, 3);
			p.name = i || n.attrName, p.applyMatrix4(r), e.morphAttributes.position.push(p);
		}
		parseNormals(e) {
			let t = e.MappingInformationType, n = e.ReferenceInformationType, r = e.Normals.a, i = [];
			return n === "IndexToDirect" && ("NormalIndex" in e ? i = e.NormalIndex.a : "NormalsIndex" in e && (i = e.NormalsIndex.a)), {
				dataSize: 3,
				buffer: r,
				indices: i,
				mappingType: t,
				referenceType: n
			};
		}
		parseUVs(e) {
			let t = e.MappingInformationType, n = e.ReferenceInformationType, r = e.UV.a, i = [];
			return n === "IndexToDirect" && (i = e.UVIndex.a), {
				dataSize: 2,
				buffer: r,
				indices: i,
				mappingType: t,
				referenceType: n
			};
		}
		parseVertexColors(e) {
			let t = e.MappingInformationType, n = e.ReferenceInformationType, r = e.Colors.a, i = [];
			n === "IndexToDirect" && (i = e.ColorIndex.a);
			for (let e = 0, t = new J(); e < r.length; e += 4) t.fromArray(r, e), K.colorSpaceToWorking(t, H), t.toArray(r, e);
			return {
				dataSize: 4,
				buffer: r,
				indices: i,
				mappingType: t,
				referenceType: n
			};
		}
		parseMaterialIndices(e) {
			let t = e.MappingInformationType, n = e.ReferenceInformationType;
			if (t === "NoMappingInformation") return {
				dataSize: 1,
				buffer: [0],
				indices: [0],
				mappingType: "AllSame",
				referenceType: n
			};
			let r = e.Materials.a, i = [];
			for (let e = 0; e < r.length; ++e) i.push(e);
			return {
				dataSize: 1,
				buffer: r,
				indices: i,
				mappingType: t,
				referenceType: n
			};
		}
		parseNurbsGeometry(e) {
			let t = parseInt(e.Order);
			if (isNaN(t)) return console.error("THREE.FBXLoader: Invalid Order %s given for geometry ID: %s", e.Order, e.id), new Hi();
			let n = t - 1, r = e.KnotVector.a, i = [], a = e.Points.a;
			for (let e = 0, t = a.length; e < t; e += 4) i.push(new ur().fromArray(a, e));
			let o, s;
			if (e.Form === "Closed") i.push(i[0]);
			else if (e.Form === "Periodic") {
				o = n, s = r.length - 1 - o;
				for (let e = 0; e < n; ++e) i.push(i[e]);
			}
			let c = new Jf(n, r, i, o, s).getPoints(i.length * 12);
			return new Hi().setFromPoints(c);
		}
	}, pp = class {
		parse() {
			let e = [], t = this.parseClips();
			if (t !== void 0) for (let n in t) {
				let r = t[n], i = this.addClip(r);
				e.push(i);
			}
			return e;
		}
		parseClips() {
			if (Z.Objects.AnimationCurve === void 0) return;
			let e = this.parseAnimationCurveNodes();
			this.parseAnimationCurves(e);
			let t = this.parseAnimationLayers(e);
			return this.parseAnimStacks(t);
		}
		parseAnimationCurveNodes() {
			let e = Z.Objects.AnimationCurveNode, t = /* @__PURE__ */ new Map();
			for (let n in e) {
				let r = e[n];
				if (r.attrName.match(/S|R|T|DeformPercent/) !== null) {
					let e = {
						id: r.id,
						attr: r.attrName,
						curves: {}
					};
					t.set(e.id, e);
				}
			}
			return t;
		}
		parseAnimationCurves(e) {
			let t = Z.Objects.AnimationCurve;
			for (let n in t) {
				let r = {
					id: t[n].id,
					times: t[n].KeyTime.a.map(ep),
					values: t[n].KeyValueFloat.a
				}, i = cp.get(r.id);
				if (i !== void 0) {
					let t = i.parents[0].ID, n = i.parents[0].relationship;
					n.match(/X/) ? e.get(t).curves.x = r : n.match(/Y/) ? e.get(t).curves.y = r : n.match(/Z/) ? e.get(t).curves.z = r : n.match(/DeformPercent/) && e.has(t) && (e.get(t).curves.morph = r);
				}
			}
		}
		parseAnimationLayers(e) {
			let t = Z.Objects.AnimationLayer, n = /* @__PURE__ */ new Map();
			for (let r in t) {
				let t = [], i = cp.get(parseInt(r));
				i !== void 0 && (i.children.forEach(function(n, r) {
					if (e.has(n.ID)) {
						let i = e.get(n.ID);
						if (i.curves.x !== void 0 || i.curves.y !== void 0 || i.curves.z !== void 0) {
							if (t[r] === void 0) {
								let e = cp.get(n.ID).parents.filter(function(e) {
									return e.relationship !== void 0;
								});
								if (e.length === 0) return;
								let i = e[0].ID;
								if (i !== void 0) {
									let e = Z.Objects.Model[i.toString()];
									if (e === void 0) {
										console.warn("THREE.FBXLoader: Encountered a unused curve.", n);
										return;
									}
									let a = {
										modelName: e.attrName ? Js.sanitizeNodeName(e.attrName) : "",
										ID: e.id,
										initialPosition: [
											0,
											0,
											0
										],
										initialRotation: [
											0,
											0,
											0
										],
										initialScale: [
											1,
											1,
											1
										]
									};
									lp.traverse(function(t) {
										t.ID === e.id && (a.transform = t.matrix, t.userData.transformData && (a.eulerOrder = t.userData.transformData.eulerOrder, t.userData.transformData.rotation && (a.initialRotation = t.userData.transformData.rotation)));
									}), a.transform || (a.transform = new q()), "PreRotation" in e && (a.preRotation = e.PreRotation.value), "PostRotation" in e && (a.postRotation = e.PostRotation.value), t[r] = a;
								}
							}
							t[r] && (t[r][i.attr] = i);
						} else if (i.curves.morph !== void 0) {
							if (t[r] === void 0) {
								let e = cp.get(n.ID).parents.filter(function(e) {
									return e.relationship !== void 0;
								});
								if (e.length === 0) return;
								let i = e[0].ID, a = cp.get(i).parents[0].ID, o = cp.get(a).parents[0].ID, s = cp.get(o).parents[0].ID, c = Z.Objects.Model[s], l = {
									modelName: c.attrName ? Js.sanitizeNodeName(c.attrName) : "",
									morphName: Z.Objects.Deformer[i].attrName
								};
								t[r] = l;
							}
							t[r][i.attr] = i;
						}
					}
				}), n.set(parseInt(r), t));
			}
			return n;
		}
		parseAnimStacks(e) {
			let t = Z.Objects.AnimationStack, n = {};
			for (let r in t) {
				let i = cp.get(parseInt(r)).children;
				i.length > 1 && console.warn("THREE.FBXLoader: Encountered an animation stack with multiple layers, this is currently not supported. Ignoring subsequent layers.");
				let a = e.get(i[0].ID);
				n[r] = {
					name: t[r].attrName,
					layer: a
				};
			}
			return n;
		}
		addClip(e) {
			let t = [], n = this;
			return e.layer.forEach(function(e) {
				t = t.concat(n.generateTracks(e));
			}), new Xo(e.name, -1, t);
		}
		generateTracks(e) {
			let t = [], n = new W(), r = new W();
			if (e.transform && e.transform.decompose(n, new Zn(), r), n = n.toArray(), r = r.toArray(), e.T !== void 0 && Object.keys(e.T.curves).length > 0) {
				let r = this.generateVectorTrack(e.modelName, e.T.curves, n, "position");
				r !== void 0 && t.push(r);
			}
			if (e.R !== void 0 && Object.keys(e.R.curves).length > 0) {
				let n = this.generateRotationTrack(e.modelName, e.R.curves, e.preRotation, e.postRotation, e.eulerOrder, e.initialRotation);
				n !== void 0 && t.push(n);
			}
			if (e.S !== void 0 && Object.keys(e.S.curves).length > 0) {
				let n = this.generateVectorTrack(e.modelName, e.S.curves, r, "scale");
				n !== void 0 && t.push(n);
			}
			if (e.DeformPercent !== void 0) {
				let n = this.generateMorphTrack(e);
				n !== void 0 && t.push(n);
			}
			return t;
		}
		generateVectorTrack(e, t, n, r) {
			let i = this.getTimesForAllAxes(t), a = this.getKeyframeTrackValues(i, t, n);
			return new Yo(e + "." + r, i, a);
		}
		generateRotationTrack(e, t, n, r, i, a) {
			let o, s;
			if (t.x !== void 0 || t.y !== void 0 || t.z !== void 0) {
				let e = this.getTimesForAllAxes(t);
				if (e.length > 0) {
					let n = a || [
						0,
						0,
						0
					], r = this.synchronizeCurve(t.x, e, n[0]), c = this.synchronizeCurve(t.y, e, n[1]), l = this.synchronizeCurve(t.z, e, n[2]), u = this.interpolateRotations(r, c, l, i);
					o = u[0], s = u[1];
				}
			}
			let c = rp(0);
			n !== void 0 && (n = n.map(Xn.degToRad), n.push(c), n = new wr().fromArray(n), n = new Zn().setFromEuler(n)), r !== void 0 && (r = r.map(Xn.degToRad), r.push(c), r = new wr().fromArray(r), r = new Zn().setFromEuler(r).invert());
			let l = new Zn(), u = new wr(), d = [];
			if (!(!s || !o)) {
				for (let e = 0; e < s.length; e += 3) u.set(s[e], s[e + 1], s[e + 2], i), l.setFromEuler(u), n !== void 0 && l.premultiply(n), r !== void 0 && l.multiply(r), e > 2 && new Zn().fromArray(d, (e - 3) / 3 * 4).dot(l) < 0 && l.set(-l.x, -l.y, -l.z, -l.w), l.toArray(d, e / 3 * 4);
				return new qo(e + ".quaternion", o, d);
			}
		}
		generateMorphTrack(e) {
			let t = e.DeformPercent.curves.morph, n = t.values.map(function(e) {
				return e / 100;
			}), r = lp.getObjectByName(e.modelName).morphTargetDictionary[e.morphName];
			return new Go(e.modelName + ".morphTargetInfluences[" + r + "]", t.times, n);
		}
		getTimesForAllAxes(e) {
			let t = [];
			if (e.x !== void 0 && (t = t.concat(e.x.times)), e.y !== void 0 && (t = t.concat(e.y.times)), e.z !== void 0 && (t = t.concat(e.z.times)), t = t.sort(function(e, t) {
				return e - t;
			}), t.length > 1) {
				let e = 1, n = t[0];
				for (let r = 1; r < t.length; r++) {
					let i = t[r];
					i !== n && (t[e] = i, n = i, e++);
				}
				t = t.slice(0, e);
			}
			return t;
		}
		getKeyframeTrackValues(e, t, n) {
			let r = n, i = [], a = -1, o = -1, s = -1;
			return e.forEach(function(e) {
				if (t.x && (a = t.x.times.indexOf(e)), t.y && (o = t.y.times.indexOf(e)), t.z && (s = t.z.times.indexOf(e)), a !== -1) {
					let e = t.x.values[a];
					i.push(e), r[0] = e;
				} else i.push(r[0]);
				if (o !== -1) {
					let e = t.y.values[o];
					i.push(e), r[1] = e;
				} else i.push(r[1]);
				if (s !== -1) {
					let e = t.z.values[s];
					i.push(e), r[2] = e;
				} else i.push(r[2]);
			}), i;
		}
		synchronizeCurve(e, t, n) {
			if (e === void 0) return {
				times: t,
				values: t.map(() => n)
			};
			if (e.times.length === t.length) return e;
			let r = [];
			for (let i = 0; i < t.length; i++) r.push(this.sampleCurveValue(e, t[i], n));
			return {
				times: t,
				values: r
			};
		}
		sampleCurveValue(e, t, n) {
			let r = e.times, i = e.values;
			if (t <= r[0]) return i[0];
			if (t >= r[r.length - 1]) return i[i.length - 1];
			for (let e = 0; e < r.length - 1; e++) if (t >= r[e] && t <= r[e + 1]) {
				if (r[e] === t) return i[e];
				let n = (t - r[e]) / (r[e + 1] - r[e]);
				return i[e] * (1 - n) + i[e + 1] * n;
			}
			return n;
		}
		interpolateRotations(e, t, n, r) {
			let i = [], a = [];
			i.push(e.times[0]), a.push(Xn.degToRad(e.values[0])), a.push(Xn.degToRad(t.values[0])), a.push(Xn.degToRad(n.values[0]));
			for (let o = 1; o < e.values.length; o++) {
				let s = [
					e.values[o - 1],
					t.values[o - 1],
					n.values[o - 1]
				];
				if (isNaN(s[0]) || isNaN(s[1]) || isNaN(s[2])) continue;
				let c = s.map(Xn.degToRad), l = [
					e.values[o],
					t.values[o],
					n.values[o]
				];
				if (isNaN(l[0]) || isNaN(l[1]) || isNaN(l[2])) continue;
				let u = l.map(Xn.degToRad), d = [
					l[0] - s[0],
					l[1] - s[1],
					l[2] - s[2]
				], f = [
					Math.abs(d[0]),
					Math.abs(d[1]),
					Math.abs(d[2])
				];
				if (f[0] >= 180 || f[1] >= 180 || f[2] >= 180) {
					let t = Math.max(...f) / 180, n = new wr(...c, r), s = new wr(...u, r), l = new Zn().setFromEuler(n), d = new Zn().setFromEuler(s);
					l.dot(d) < 0 && d.set(-d.x, -d.y, -d.z, -d.w);
					let p = e.times[o - 1], m = e.times[o] - p, h = new Zn(), g = new wr();
					for (let e = 0; e < 1; e += 1 / t) h.copy(l.clone().slerp(d.clone(), e)), i.push(p + e * m), g.setFromQuaternion(h, r), a.push(g.x), a.push(g.y), a.push(g.z);
				} else i.push(e.times[o]), a.push(Xn.degToRad(e.values[o])), a.push(Xn.degToRad(t.values[o])), a.push(Xn.degToRad(n.values[o]));
			}
			return [i, a];
		}
	}, mp = class {
		getPrevNode() {
			return this.nodeStack[this.currentIndent - 2];
		}
		getCurrentNode() {
			return this.nodeStack[this.currentIndent - 1];
		}
		getCurrentProp() {
			return this.currentProp;
		}
		pushStack(e) {
			this.nodeStack.push(e), this.currentIndent += 1;
		}
		popStack() {
			this.nodeStack.pop(), --this.currentIndent;
		}
		setCurrentProp(e, t) {
			this.currentProp = e, this.currentPropName = t;
		}
		parse(e) {
			this.currentIndent = 0, this.allNodes = new _p(), this.nodeStack = [], this.currentProp = [], this.currentPropName = "";
			let t = this, n = e.split(/[\r\n]+/);
			return n.forEach(function(e, r) {
				let i = e.match(/^[\s\t]*;/), a = e.match(/^[\s\t]*$/);
				if (i || a) return;
				let o = e.match("^\\t{" + t.currentIndent + "}(\\w+):(.*){", ""), s = e.match("^\\t{" + t.currentIndent + "}(\\w+):[\\s\\t\\r\\n](.*)"), c = e.match("^\\t{" + (t.currentIndent - 1) + "}}");
				o ? t.parseNodeBegin(e, o) : s ? t.parseNodeProperty(e, s, n[++r]) : c ? t.popStack() : e.match(/^[^\s\t}]/) && t.parseNodePropertyContinued(e);
			}), this.allNodes;
		}
		parseNodeBegin(e, t) {
			let n = t[1].trim().replace(/^"/, "").replace(/"$/, ""), r = t[2].split(",").map(function(e) {
				return e.trim().replace(/^"/, "").replace(/"$/, "");
			}), i = { name: n }, a = this.parseNodeAttr(r), o = this.getCurrentNode();
			this.currentIndent === 0 ? this.allNodes.add(n, i) : n in o ? (n === "PoseNode" ? o.PoseNode.push(i) : o[n].id !== void 0 && (o[n] = {}, o[n][o[n].id] = o[n]), a.id !== "" && (o[n][a.id] = i)) : typeof a.id == "number" ? (o[n] = {}, o[n][a.id] = i) : n !== "Properties70" && (o[n] = n === "PoseNode" ? [i] : i), typeof a.id == "number" && (i.id = a.id), a.name !== "" && (i.attrName = a.name), a.type !== "" && (i.attrType = a.type), this.pushStack(i);
		}
		parseNodeAttr(e) {
			let t = e[0];
			e[0] !== "" && (t = parseInt(e[0]), isNaN(t) && (t = e[0]));
			let n = "", r = "";
			return e.length > 1 && (n = e[1].replace(/^(\w+)::/, ""), r = e[2]), {
				id: t,
				name: n,
				type: r
			};
		}
		parseNodeProperty(e, t, n) {
			let r = t[1].replace(/^"/, "").replace(/"$/, "").trim(), i = t[2].replace(/^"/, "").replace(/"$/, "").trim();
			r === "Content" && i === "," && (i = n.replace(/"/g, "").replace(/,$/, "").trim());
			let a = this.getCurrentNode();
			if (a.name === "Properties70") {
				this.parseNodeSpecialProperty(e, r, i);
				return;
			}
			if (r === "C") {
				let e = i.split(",").slice(1), t = parseInt(e[0]), n = parseInt(e[1]), o = i.split(",").slice(3);
				o = o.map(function(e) {
					return e.trim().replace(/^"/, "");
				}), r = "connections", i = [t, n], op(i, o), a[r] === void 0 && (a[r] = []);
			}
			r === "Node" && (a.id = i), r in a && Array.isArray(a[r]) ? a[r].push(i) : r === "a" ? a.a = i : a[r] = i, this.setCurrentProp(a, r), r === "a" && i.slice(-1) !== "," && (a.a = ip(i));
		}
		parseNodePropertyContinued(e) {
			let t = this.getCurrentNode();
			t.a += e, e.slice(-1) !== "," && (t.a = ip(t.a));
		}
		parseNodeSpecialProperty(e, t, n) {
			let r = n.split("\",").map(function(e) {
				return e.trim().replace(/^\"/, "").replace(/\s/, "_");
			}), i = r[0], a = r[1], o = r[2], s = r[3], c = r[4];
			switch (a) {
				case "int":
				case "enum":
				case "bool":
				case "ULongLong":
				case "double":
				case "Number":
				case "FieldOfView":
					c = parseFloat(c);
					break;
				case "Color":
				case "ColorRGB":
				case "Vector3D":
				case "Lcl_Translation":
				case "Lcl_Rotation":
				case "Lcl_Scaling": c = ip(c);
			}
			this.getPrevNode()[i] = {
				type: a,
				type2: o,
				flag: s,
				value: c
			}, this.setCurrentProp(this.getPrevNode(), i);
		}
	}, hp = class {
		parse(e) {
			let t = new gp(e);
			t.skip(23);
			let n = t.getUint32();
			if (n < 6400) throw Error("THREE.FBXLoader: FBX version not supported, FileVersion: " + n);
			let r = new _p();
			for (; !this.endOfContent(t);) {
				let e = this.parseNode(t, n);
				e !== null && r.add(e.name, e);
			}
			return r;
		}
		endOfContent(e) {
			return e.size() % 16 == 0 ? (e.getOffset() + 160 + 16 & -16) >= e.size() : e.getOffset() + 160 + 16 >= e.size();
		}
		parseNode(e, t) {
			let n = {}, r = t >= 7500 ? e.getUint64() : e.getUint32(), i = t >= 7500 ? e.getUint64() : e.getUint32();
			t >= 7500 ? e.getUint64() : e.getUint32();
			let a = e.getUint8(), o = e.getString(a);
			if (r === 0) return null;
			let s = [];
			for (let t = 0; t < i; t++) s.push(this.parseProperty(e));
			let c = s.length > 0 ? s[0] : "", l = s.length > 1 ? s[1] : "", u = s.length > 2 ? s[2] : "";
			for (n.singleProperty = i === 1 && e.getOffset() === r; r > e.getOffset();) {
				let r = this.parseNode(e, t);
				r !== null && this.parseSubNode(o, n, r);
			}
			return n.propertyList = s, typeof c == "number" && (n.id = c), l !== "" && (n.attrName = l), u !== "" && (n.attrType = u), o !== "" && (n.name = o), n;
		}
		parseSubNode(e, t, n) {
			if (n.singleProperty === !0) {
				let e = n.propertyList[0];
				Array.isArray(e) ? (t[n.name] = n, n.a = e) : t[n.name] = e;
			} else if (e === "Connections" && n.name === "C") {
				let e = [];
				n.propertyList.forEach(function(t, n) {
					n !== 0 && e.push(t);
				}), t.connections === void 0 && (t.connections = []), t.connections.push(e);
			} else if (n.name === "Properties70") Object.keys(n).forEach(function(e) {
				t[e] = n[e];
			});
			else if (e === "Properties70" && n.name === "P") {
				let e = n.propertyList[0], r = n.propertyList[1], i = n.propertyList[2], a = n.propertyList[3], o;
				e.indexOf("Lcl ") === 0 && (e = e.replace("Lcl ", "Lcl_")), r.indexOf("Lcl ") === 0 && (r = r.replace("Lcl ", "Lcl_")), o = r === "Color" || r === "ColorRGB" || r === "Vector" || r === "Vector3D" || r.indexOf("Lcl_") === 0 ? [
					n.propertyList[4],
					n.propertyList[5],
					n.propertyList[6]
				] : n.propertyList[4], t[e] = {
					type: r,
					type2: i,
					flag: a,
					value: o
				};
			} else t[n.name] === void 0 ? typeof n.id == "number" ? (t[n.name] = {}, t[n.name][n.id] = n) : t[n.name] = n : n.name === "PoseNode" ? (Array.isArray(t[n.name]) || (t[n.name] = [t[n.name]]), t[n.name].push(n)) : t[n.name][n.id] === void 0 && (t[n.name][n.id] = n);
		}
		parseProperty(e) {
			let t = e.getString(1), n;
			switch (t) {
				case "C": return e.getBoolean();
				case "D": return e.getFloat64();
				case "F": return e.getFloat32();
				case "I": return e.getInt32();
				case "L": return e.getInt64();
				case "R": return n = e.getUint32(), e.getArrayBuffer(n);
				case "S": return n = e.getUint32(), e.getString(n);
				case "Y": return e.getInt16();
				case "b":
				case "c":
				case "d":
				case "f":
				case "i":
				case "l":
					let r = e.getUint32(), i = e.getUint32(), a = e.getUint32();
					if (i === 0) switch (t) {
						case "b":
						case "c": return e.getBooleanArray(r);
						case "d": return e.getFloat64Array(r);
						case "f": return e.getFloat32Array(r);
						case "i": return e.getInt32Array(r);
						case "l": return e.getInt64Array(r);
					}
					let o = Xd(new Uint8Array(e.getArrayBuffer(a))), s = new gp(o.buffer);
					switch (t) {
						case "b":
						case "c": return s.getBooleanArray(r);
						case "d": return s.getFloat64Array(r);
						case "f": return s.getFloat32Array(r);
						case "i": return s.getInt32Array(r);
						case "l": return s.getInt64Array(r);
					}
					break;
				default: throw Error("THREE.FBXLoader: Unknown property type " + t);
			}
		}
	}, gp = class {
		constructor(e, t) {
			this.dv = new DataView(e), this.offset = 0, this.littleEndian = t === void 0 || t, this._textDecoder = new TextDecoder();
		}
		getOffset() {
			return this.offset;
		}
		size() {
			return this.dv.buffer.byteLength;
		}
		skip(e) {
			this.offset += e;
		}
		getBoolean() {
			return (this.getUint8() & 1) == 1;
		}
		getBooleanArray(e) {
			let t = [];
			for (let n = 0; n < e; n++) t.push(this.getBoolean());
			return t;
		}
		getUint8() {
			let e = this.dv.getUint8(this.offset);
			return this.offset += 1, e;
		}
		getInt16() {
			let e = this.dv.getInt16(this.offset, this.littleEndian);
			return this.offset += 2, e;
		}
		getInt32() {
			let e = this.dv.getInt32(this.offset, this.littleEndian);
			return this.offset += 4, e;
		}
		getInt32Array(e) {
			let t = [];
			for (let n = 0; n < e; n++) t.push(this.getInt32());
			return t;
		}
		getUint32() {
			let e = this.dv.getUint32(this.offset, this.littleEndian);
			return this.offset += 4, e;
		}
		getInt64() {
			let e, t;
			return this.littleEndian ? (e = this.getUint32(), t = this.getUint32()) : (t = this.getUint32(), e = this.getUint32()), t & 2147483648 ? (t = ~t & 4294967295, e = ~e & 4294967295, e === 4294967295 && (t = t + 1 & 4294967295), e = e + 1 & 4294967295, -(t * 4294967296 + e)) : t * 4294967296 + e;
		}
		getInt64Array(e) {
			let t = [];
			for (let n = 0; n < e; n++) t.push(this.getInt64());
			return t;
		}
		getUint64() {
			let e, t;
			return this.littleEndian ? (e = this.getUint32(), t = this.getUint32()) : (t = this.getUint32(), e = this.getUint32()), t * 4294967296 + e;
		}
		getFloat32() {
			let e = this.dv.getFloat32(this.offset, this.littleEndian);
			return this.offset += 4, e;
		}
		getFloat32Array(e) {
			let t = [];
			for (let n = 0; n < e; n++) t.push(this.getFloat32());
			return t;
		}
		getFloat64() {
			let e = this.dv.getFloat64(this.offset, this.littleEndian);
			return this.offset += 8, e;
		}
		getFloat64Array(e) {
			let t = [];
			for (let n = 0; n < e; n++) t.push(this.getFloat64());
			return t;
		}
		getArrayBuffer(e) {
			let t = this.dv.buffer.slice(this.offset, this.offset + e);
			return this.offset += e, t;
		}
		getString(e) {
			let t = this.offset, n = new Uint8Array(this.dv.buffer, t, e);
			this.skip(e);
			let r = n.indexOf(0);
			return r >= 0 && (n = new Uint8Array(this.dv.buffer, t, r)), this._textDecoder.decode(n);
		}
	}, _p = class {
		add(e, t) {
			this[e] = t;
		}
	}, vp = [], yp = new wr(), bp = new W();
})), Sp = /* @__PURE__ */ r({ OBJLoader: () => Fp });
function Cp() {
	let e = {
		objects: [],
		object: {},
		vertices: [],
		normals: [],
		colors: [],
		uvs: [],
		materials: {},
		materialLibraries: [],
		startObject: function(e, t) {
			if (this.object && this.object.fromDeclaration === !1) {
				this.object.name = e, this.object.fromDeclaration = t !== !1;
				return;
			}
			let n = this.object && typeof this.object.currentMaterial == "function" ? this.object.currentMaterial() : void 0;
			if (this.object && typeof this.object._finalize == "function" && this.object._finalize(!0), this.object = {
				name: e || "",
				fromDeclaration: t !== !1,
				geometry: {
					vertices: [],
					normals: [],
					colors: [],
					uvs: [],
					hasUVIndices: !1
				},
				materials: [],
				smooth: !0,
				startMaterial: function(e, t) {
					let n = this._finalize(!1);
					n && (n.inherited || n.groupCount <= 0) && this.materials.splice(n.index, 1);
					let r = {
						index: this.materials.length,
						name: e || "",
						mtllib: Array.isArray(t) && t.length > 0 ? t[t.length - 1] : "",
						smooth: n === void 0 ? this.smooth : n.smooth,
						groupStart: n === void 0 ? 0 : n.groupEnd,
						groupEnd: -1,
						groupCount: -1,
						inherited: !1,
						clone: function(e) {
							let t = {
								index: typeof e == "number" ? e : this.index,
								name: this.name,
								mtllib: this.mtllib,
								smooth: this.smooth,
								groupStart: 0,
								groupEnd: -1,
								groupCount: -1,
								inherited: !1
							};
							return t.clone = this.clone.bind(t), t;
						}
					};
					return this.materials.push(r), r;
				},
				currentMaterial: function() {
					if (this.materials.length > 0) return this.materials[this.materials.length - 1];
				},
				_finalize: function(e) {
					let t = this.currentMaterial();
					if (t && t.groupEnd === -1 && (t.groupEnd = this.geometry.vertices.length / 3, t.groupCount = t.groupEnd - t.groupStart, t.inherited = !1), e && this.materials.length > 1) for (let e = this.materials.length - 1; e >= 0; e--) this.materials[e].groupCount <= 0 && this.materials.splice(e, 1);
					return e && this.materials.length === 0 && this.materials.push({
						name: "",
						smooth: this.smooth
					}), t;
				}
			}, n && n.name && typeof n.clone == "function") {
				let e = n.clone(0);
				e.inherited = !0, this.object.materials.push(e);
			}
			this.objects.push(this.object);
		},
		finalize: function() {
			this.object && typeof this.object._finalize == "function" && this.object._finalize(!0);
		},
		parseVertexIndex: function(e, t) {
			let n = parseInt(e, 10);
			return (n >= 0 ? n - 1 : n + t / 3) * 3;
		},
		parseNormalIndex: function(e, t) {
			let n = parseInt(e, 10);
			return (n >= 0 ? n - 1 : n + t / 3) * 3;
		},
		parseUVIndex: function(e, t) {
			let n = parseInt(e, 10);
			return (n >= 0 ? n - 1 : n + t / 2) * 2;
		},
		addVertex: function(e, t, n) {
			let r = this.vertices, i = this.object.geometry.vertices;
			i.push(r[e + 0], r[e + 1], r[e + 2]), i.push(r[t + 0], r[t + 1], r[t + 2]), i.push(r[n + 0], r[n + 1], r[n + 2]);
		},
		addVertexPoint: function(e) {
			let t = this.vertices;
			this.object.geometry.vertices.push(t[e + 0], t[e + 1], t[e + 2]);
		},
		addVertexLine: function(e) {
			let t = this.vertices;
			this.object.geometry.vertices.push(t[e + 0], t[e + 1], t[e + 2]);
		},
		addNormal: function(e, t, n) {
			let r = this.normals, i = this.object.geometry.normals;
			i.push(r[e + 0], r[e + 1], r[e + 2]), i.push(r[t + 0], r[t + 1], r[t + 2]), i.push(r[n + 0], r[n + 1], r[n + 2]);
		},
		addFaceNormal: function(e, t, n) {
			let r = this.vertices, i = this.object.geometry.normals;
			kp.fromArray(r, e), Ap.fromArray(r, t), jp.fromArray(r, n), Np.subVectors(jp, Ap), Mp.subVectors(kp, Ap), Np.cross(Mp), Np.normalize(), i.push(Np.x, Np.y, Np.z), i.push(Np.x, Np.y, Np.z), i.push(Np.x, Np.y, Np.z);
		},
		addColor: function(e, t, n) {
			let r = this.colors, i = this.object.geometry.colors;
			r[e] !== void 0 && i.push(r[e + 0], r[e + 1], r[e + 2]), r[t] !== void 0 && i.push(r[t + 0], r[t + 1], r[t + 2]), r[n] !== void 0 && i.push(r[n + 0], r[n + 1], r[n + 2]);
		},
		addUV: function(e, t, n) {
			let r = this.uvs, i = this.object.geometry.uvs;
			i.push(r[e + 0], r[e + 1]), i.push(r[t + 0], r[t + 1]), i.push(r[n + 0], r[n + 1]);
		},
		addDefaultUV: function() {
			let e = this.object.geometry.uvs;
			e.push(0, 0), e.push(0, 0), e.push(0, 0);
		},
		addUVLine: function(e) {
			let t = this.uvs;
			this.object.geometry.uvs.push(t[e + 0], t[e + 1]);
		},
		addFace: function(e, t, n, r, i, a, o, s, c) {
			let l = this.vertices.length, u = this.parseVertexIndex(e, l), d = this.parseVertexIndex(t, l), f = this.parseVertexIndex(n, l);
			if (this.addVertex(u, d, f), this.addColor(u, d, f), o !== void 0 && o !== "") {
				let e = this.normals.length;
				u = this.parseNormalIndex(o, e), d = this.parseNormalIndex(s, e), f = this.parseNormalIndex(c, e), this.addNormal(u, d, f);
			} else this.addFaceNormal(u, d, f);
			if (r !== void 0 && r !== "") {
				let e = this.uvs.length;
				u = this.parseUVIndex(r, e), d = this.parseUVIndex(i, e), f = this.parseUVIndex(a, e), this.addUV(u, d, f), this.object.geometry.hasUVIndices = !0;
			} else this.addDefaultUV();
		},
		addPointGeometry: function(e) {
			this.object.geometry.type = "Points";
			let t = this.vertices.length;
			for (let n = 0, r = e.length; n < r; n++) {
				let r = this.parseVertexIndex(e[n], t);
				this.addVertexPoint(r), this.addColor(r);
			}
		},
		addLineGeometry: function(e, t) {
			this.object.geometry.type = "Line";
			let n = this.vertices.length, r = this.uvs.length;
			for (let t = 0, r = e.length; t < r; t++) this.addVertexLine(this.parseVertexIndex(e[t], n));
			for (let e = 0, n = t.length; e < n; e++) this.addUVLine(this.parseUVIndex(t[e], r));
		}
	};
	return e.startObject("", !1), e;
}
var wp, Tp, Ep, Dp, Op, kp, Ap, jp, Mp, Np, Pp, Fp, Ip = t((() => {
	gd(), wp = /^[og]\s*(.+)?/, Tp = /^mtllib /, Ep = /^usemtl /, Dp = /^usemap /, Op = /\s+/, kp = new W(), Ap = new W(), jp = new W(), Mp = new W(), Np = new W(), Pp = new J(), Fp = class extends es {
		constructor(e) {
			super(e), this.materials = null;
		}
		load(e, t, n, r) {
			let i = this, a = new rs(this.manager);
			a.setPath(this.path), a.setRequestHeader(this.requestHeader), a.setWithCredentials(this.withCredentials), a.load(e, function(n) {
				try {
					t(i.parse(n));
				} catch (t) {
					r ? r(t) : console.error(t), i.manager.itemError(e);
				}
			}, n, r);
		}
		setMaterials(e) {
			return this.materials = e, this;
		}
		parse(e) {
			let t = new Cp();
			e.indexOf("\r\n") !== -1 && (e = e.replace(/\r\n/g, "\n")), e.indexOf("\\\n") !== -1 && (e = e.replace(/\\\n/g, ""));
			let n = e.split("\n"), r = [];
			for (let e = 0, i = n.length; e < i; e++) {
				let i = n[e].trimStart();
				if (i.length === 0) continue;
				let a = i.charAt(0);
				if (a !== "#") {
					if (a === "v") {
						let e = i.split(Op);
						switch (e[0]) {
							case "v":
								t.vertices.push(parseFloat(e[1]), parseFloat(e[2]), parseFloat(e[3])), e.length >= 7 ? (Pp.setRGB(parseFloat(e[4]), parseFloat(e[5]), parseFloat(e[6]), H), t.colors.push(Pp.r, Pp.g, Pp.b)) : t.colors.push(void 0, void 0, void 0);
								break;
							case "vn":
								t.normals.push(parseFloat(e[1]), parseFloat(e[2]), parseFloat(e[3]));
								break;
							case "vt": t.uvs.push(parseFloat(e[1]), parseFloat(e[2]));
						}
					} else if (a === "f") {
						let e = i.slice(1).trim().split(Op), n = [];
						for (let t = 0, r = e.length; t < r; t++) {
							let r = e[t];
							if (r.length > 0) {
								let e = r.split("/");
								n.push(e);
							}
						}
						let r = n[0];
						for (let e = 1, i = n.length - 1; e < i; e++) {
							let i = n[e], a = n[e + 1];
							t.addFace(r[0], i[0], a[0], r[1], i[1], a[1], r[2], i[2], a[2]);
						}
					} else if (a === "l") {
						let e = i.substring(1).trim().split(" "), n = [], r = [];
						if (i.indexOf("/") === -1) n = e;
						else for (let t = 0, i = e.length; t < i; t++) {
							let i = e[t].split("/");
							i[0] !== "" && n.push(i[0]), i[1] !== "" && r.push(i[1]);
						}
						t.addLineGeometry(n, r);
					} else if (a === "p") {
						let e = i.slice(1).trim().split(" ");
						t.addPointGeometry(e);
					} else if ((r = wp.exec(i)) !== null) {
						let e = (" " + r[0].slice(1).trim()).slice(1);
						t.startObject(e);
					} else if (Ep.test(i)) t.object.startMaterial(i.substring(7).trim(), t.materialLibraries);
					else if (Tp.test(i)) t.materialLibraries.push(i.substring(7).trim());
					else if (Dp.test(i)) console.warn("THREE.OBJLoader: Rendering identifier \"usemap\" not supported. Textures must be defined in MTL files.");
					else if (a === "s") {
						if (r = i.split(" "), r.length > 1) {
							let e = r[1].trim().toLowerCase();
							t.object.smooth = e !== "0" && e !== "off";
						} else t.object.smooth = !0;
						let e = t.object.currentMaterial();
						e && (e.smooth = t.object.smooth);
					} else {
						if (i === "\0") continue;
						console.warn("THREE.OBJLoader: Unexpected line: \"" + i + "\"");
					}
				}
			}
			t.finalize();
			let i = new Hr();
			if (i.materialLibraries = [].concat(t.materialLibraries), t.objects.length !== 1 || t.objects[0].geometry.vertices.length !== 0) for (let e = 0, n = t.objects.length; e < n; e++) {
				let n = t.objects[e], r = n.geometry, a = n.materials, o = r.type === "Line", s = r.type === "Points", c = !1;
				if (r.vertices.length === 0) continue;
				let l = new Hi();
				l.setAttribute("position", new Ai(r.vertices, 3)), r.normals.length > 0 && l.setAttribute("normal", new Ai(r.normals, 3)), r.colors.length > 0 && (c = !0, l.setAttribute("color", new Ai(r.colors, 3))), r.hasUVIndices === !0 && l.setAttribute("uv", new Ai(r.uvs, 2));
				let u = [];
				for (let e = 0, n = a.length; e < n; e++) {
					let n = a[e], r = n.name + "_" + n.smooth + "_" + c, i = t.materials[r];
					if (this.materials !== null) {
						if (i = this.materials.create(n.name), o && i && !(i instanceof qa)) {
							let e = new qa();
							qi.prototype.copy.call(e, i), e.color.copy(i.color), i = e;
						} else if (s && i && !(i instanceof oo)) {
							let e = new oo({
								size: 10,
								sizeAttenuation: !1
							});
							qi.prototype.copy.call(e, i), e.color.copy(i.color), e.map = i.map, i = e;
						}
					}
					i === void 0 && (i = o ? new qa() : s ? new oo({
						size: 1,
						sizeAttenuation: !1
					}) : new No(), i.name = n.name, i.flatShading = !n.smooth, i.vertexColors = c, t.materials[r] = i), u.push(i);
				}
				let d;
				if (u.length > 1) {
					for (let e = 0, t = a.length; e < t; e++) {
						let t = a[e];
						l.addGroup(t.groupStart, t.groupCount, e);
					}
					d = o ? new io(l, u) : s ? new fo(l, u) : new ma(l, u);
				} else d = o ? new io(l, u[0]) : s ? new fo(l, u[0]) : new ma(l, u[0]);
				d.name = n.name, i.add(d);
			}
			else if (t.vertices.length > 0) {
				let e = new oo({
					size: 1,
					sizeAttenuation: !1
				}), n = new Hi();
				n.setAttribute("position", new Ai(t.vertices, 3)), t.colors.length > 0 && t.colors[0] !== void 0 && (n.setAttribute("color", new Ai(t.colors, 3)), e.vertexColors = !0);
				let r = new fo(n, e);
				i.add(r);
			}
			return i;
		}
	};
}));
//#endregion
//#region node_modules/three/examples/jsm/utils/BufferGeometryUtils.js
function Lp(e, t) {
	if (t === 0) return console.warn("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Geometry already defined as triangles."), e;
	if (t === 2 || t === 1) {
		let n = e.getIndex();
		if (n === null) {
			let t = [], r = e.getAttribute("position");
			if (r !== void 0) {
				for (let e = 0; e < r.count; e++) t.push(e);
				e.setIndex(t), n = e.getIndex();
			} else return console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Undefined position attribute. Processing not possible."), e;
		}
		let r = n.count - 2, i = [];
		if (t === 2) for (let e = 1; e <= r; e++) i.push(n.getX(0)), i.push(n.getX(e)), i.push(n.getX(e + 1));
		else for (let e = 0; e < r; e++) e % 2 == 0 ? (i.push(n.getX(e)), i.push(n.getX(e + 1)), i.push(n.getX(e + 2))) : (i.push(n.getX(e + 2)), i.push(n.getX(e + 1)), i.push(n.getX(e)));
		i.length / 3 !== r && console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unable to generate correct amount of triangles.");
		let a = e.clone();
		return a.setIndex(i), a.clearGroups(), a;
	}
	return console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unknown draw mode:", t), e;
}
var Rp = t((() => {
	gd();
}));
//#endregion
//#region node_modules/three/examples/jsm/utils/SkeletonUtils.js
function zp(e) {
	let t = /* @__PURE__ */ new Map(), n = /* @__PURE__ */ new Map(), r = e.clone();
	return Bp(e, r, function(e, r) {
		t.set(r, e), n.set(e, r);
	}), r.traverse(function(e) {
		if (!e.isSkinnedMesh) return;
		let r = e, i = t.get(e), a = i.skeleton.bones;
		r.skeleton = i.skeleton.clone(), r.bindMatrix.copy(i.bindMatrix), r.skeleton.bones = a.map(function(e) {
			return n.get(e);
		}), r.bind(r.skeleton, r.bindMatrix);
	}), r;
}
function Bp(e, t, n) {
	n(e, t);
	for (let r = 0; r < e.children.length; r++) Bp(e.children[r], t.children[r], n);
}
var Vp = t((() => {})), Hp = /* @__PURE__ */ r({ GLTFLoader: () => nm });
function Up() {
	let e = {};
	return {
		get: function(t) {
			return e[t];
		},
		add: function(t, n) {
			e[t] = n;
		},
		remove: function(t) {
			delete e[t];
		},
		removeAll: function() {
			e = {};
		}
	};
}
function Wp(e, t, n) {
	let r = e.json.materials[t];
	return r.extensions && r.extensions[n] ? r.extensions[n] : null;
}
function Gp(e) {
	return e.DefaultMaterial === void 0 && (e.DefaultMaterial = new jo({
		color: 16777215,
		emissive: 0,
		metalness: 1,
		roughness: 1,
		transparent: !1,
		depthTest: !0,
		side: 0
	})), e.DefaultMaterial;
}
function Kp(e, t, n) {
	for (let r in n.extensions) e[r] === void 0 && (t.userData.gltfExtensions = t.userData.gltfExtensions || {}, t.userData.gltfExtensions[r] = n.extensions[r]);
}
function qp(e, t) {
	t.extras !== void 0 && (typeof t.extras == "object" ? Object.assign(e.userData, t.extras) : console.warn("THREE.GLTFLoader: Ignoring primitive type .extras, " + t.extras));
}
function Jp(e, t, n) {
	let r = !1, i = !1, a = !1;
	for (let e = 0, n = t.length; e < n; e++) {
		let n = t[e];
		if (n.POSITION !== void 0 && (r = !0), n.NORMAL !== void 0 && (i = !0), n.COLOR_0 !== void 0 && (a = !0), r && i && a) break;
	}
	if (!r && !i && !a) return Promise.resolve(e);
	let o = [], s = [], c = [];
	for (let l = 0, u = t.length; l < u; l++) {
		let u = t[l];
		if (r) {
			let t = u.POSITION === void 0 ? e.attributes.position : n.getDependency("accessor", u.POSITION);
			o.push(t);
		}
		if (i) {
			let t = u.NORMAL === void 0 ? e.attributes.normal : n.getDependency("accessor", u.NORMAL);
			s.push(t);
		}
		if (a) {
			let t = u.COLOR_0 === void 0 ? e.attributes.color : n.getDependency("accessor", u.COLOR_0);
			c.push(t);
		}
	}
	return Promise.all([
		Promise.all(o),
		Promise.all(s),
		Promise.all(c)
	]).then(function(t) {
		let n = t[0], o = t[1], s = t[2];
		return r && (e.morphAttributes.position = n), i && (e.morphAttributes.normal = o), a && (e.morphAttributes.color = s), e.morphTargetsRelative = !0, e;
	});
}
function Yp(e, t) {
	if (e.updateMorphTargets(), t.weights !== void 0) for (let n = 0, r = t.weights.length; n < r; n++) e.morphTargetInfluences[n] = t.weights[n];
	if (t.extras && Array.isArray(t.extras.targetNames)) {
		let n = t.extras.targetNames;
		if (e.morphTargetInfluences.length === n.length) {
			e.morphTargetDictionary = {};
			for (let t = 0, r = n.length; t < r; t++) e.morphTargetDictionary[n[t]] = t;
		} else console.warn("THREE.GLTFLoader: Invalid extras.targetNames length. Ignoring names.");
	}
}
function Xp(e) {
	let t, n = e.extensions && e.extensions[Q.KHR_DRACO_MESH_COMPRESSION];
	if (t = n ? "draco:" + n.bufferView + ":" + n.indices + ":" + Zp(n.attributes) : e.indices + ":" + Zp(e.attributes) + ":" + e.mode, e.targets !== void 0) for (let n = 0, r = e.targets.length; n < r; n++) t += ":" + Zp(e.targets[n]);
	return t;
}
function Zp(e) {
	let t = "", n = Object.keys(e).sort();
	for (let r = 0, i = n.length; r < i; r++) t += n[r] + ":" + e[n[r]] + ";";
	return t;
}
function Qp(e) {
	switch (e) {
		case Int8Array: return 1 / 127;
		case Uint8Array: return 1 / 255;
		case Int16Array: return 1 / 32767;
		case Uint16Array: return 1 / 65535;
		default: throw Error("THREE.GLTFLoader: Unsupported normalized accessor component type.");
	}
}
function $p(e) {
	return e.search(/\.jpe?g($|\?)/i) > 0 || e.search(/^data\:image\/jpeg/) === 0 ? "image/jpeg" : e.search(/\.webp($|\?)/i) > 0 || e.search(/^data\:image\/webp/) === 0 ? "image/webp" : e.search(/\.ktx2($|\?)/i) > 0 || e.search(/^data\:image\/ktx2/) === 0 ? "image/ktx2" : "image/png";
}
function em(e, t, n) {
	let r = t.attributes, i = new ui();
	if (r.POSITION !== void 0) {
		let e = n.json.accessors[r.POSITION], t = e.min, a = e.max;
		if (t !== void 0 && a !== void 0) {
			if (i.set(new W(t[0], t[1], t[2]), new W(a[0], a[1], a[2])), e.normalized) {
				let t = Qp(Mm[e.componentType]);
				i.min.multiplyScalar(t), i.max.multiplyScalar(t);
			}
		} else {
			console.warn("THREE.GLTFLoader: Missing min/max properties for accessor POSITION.");
			return;
		}
	} else return;
	let a = t.targets;
	if (a !== void 0) {
		let e = new W(), t = new W();
		for (let r = 0, i = a.length; r < i; r++) {
			let i = a[r];
			if (i.POSITION !== void 0) {
				let r = n.json.accessors[i.POSITION], a = r.min, o = r.max;
				if (a !== void 0 && o !== void 0) {
					if (t.setX(Math.max(Math.abs(a[0]), Math.abs(o[0]))), t.setY(Math.max(Math.abs(a[1]), Math.abs(o[1]))), t.setZ(Math.max(Math.abs(a[2]), Math.abs(o[2]))), r.normalized) {
						let e = Qp(Mm[r.componentType]);
						t.multiplyScalar(e);
					}
					e.max(t);
				} else console.warn("THREE.GLTFLoader: Missing min/max properties for accessor POSITION.");
			}
		}
		i.expandByVector(e);
	}
	e.boundingBox = i;
	let o = new Pi();
	i.getCenter(o.center), o.radius = i.min.distanceTo(i.max) / 2, e.boundingSphere = o;
}
function tm(e, t, n) {
	let r = t.attributes, i = [];
	function a(t, r) {
		return n.getDependency("accessor", t).then(function(t) {
			e.setAttribute(r, t);
		});
	}
	for (let t in r) {
		let n = Im[t] || t.toLowerCase();
		n in e.attributes || i.push(a(r[t], n));
	}
	if (t.indices !== void 0 && !e.index) {
		let r = n.getDependency("accessor", t.indices).then(function(t) {
			e.setIndex(t);
		});
		i.push(r);
	}
	return K.workingColorSpace !== "srgb-linear" && "COLOR_0" in r && console.warn(`THREE.GLTFLoader: Converting vertex colors from "srgb-linear" to "${K.workingColorSpace}" not supported.`), qp(e, t), em(e, t, n), Promise.all(i).then(function() {
		return t.targets === void 0 ? e : Jp(e, t.targets, n);
	});
}
var nm, Q, rm, im, am, om, sm, cm, lm, um, dm, fm, pm, mm, hm, gm, _m, vm, ym, bm, xm, Sm, Cm, wm, Tm, Em, Dm, Om, km, Am, jm, Mm, Nm, Pm, Fm, Im, Lm, Rm, zm, Bm, Vm, Hm = t((() => {
	gd(), Rp(), Vp(), nm = class extends es {
		constructor(e) {
			super(e), this.dracoLoader = null, this.ktx2Loader = null, this.meshoptDecoder = null, this.pluginCallbacks = [], this.register(function(e) {
				return new om(e);
			}), this.register(function(e) {
				return new sm(e);
			}), this.register(function(e) {
				return new gm(e);
			}), this.register(function(e) {
				return new _m(e);
			}), this.register(function(e) {
				return new vm(e);
			}), this.register(function(e) {
				return new lm(e);
			}), this.register(function(e) {
				return new um(e);
			}), this.register(function(e) {
				return new dm(e);
			}), this.register(function(e) {
				return new fm(e);
			}), this.register(function(e) {
				return new am(e);
			}), this.register(function(e) {
				return new pm(e);
			}), this.register(function(e) {
				return new cm(e);
			}), this.register(function(e) {
				return new hm(e);
			}), this.register(function(e) {
				return new mm(e);
			}), this.register(function(e) {
				return new rm(e);
			}), this.register(function(e) {
				return new ym(e, Q.EXT_MESHOPT_COMPRESSION);
			}), this.register(function(e) {
				return new ym(e, Q.KHR_MESHOPT_COMPRESSION);
			}), this.register(function(e) {
				return new bm(e);
			});
		}
		load(e, t, n, r) {
			let i = this, a;
			if (this.resourcePath !== "") a = this.resourcePath;
			else if (this.path !== "") {
				let t = ks.extractUrlBase(e);
				a = ks.resolveURL(t, this.path);
			} else a = ks.extractUrlBase(e);
			this.manager.itemStart(e);
			let o = function(t) {
				r ? r(t) : console.error(t), i.manager.itemError(e), i.manager.itemEnd(e);
			}, s = new rs(this.manager);
			s.setPath(this.path), s.setResponseType("arraybuffer"), s.setRequestHeader(this.requestHeader), s.setWithCredentials(this.withCredentials), s.load(e, function(n) {
				try {
					i.parse(n, a, function(n) {
						t(n), i.manager.itemEnd(e);
					}, o);
				} catch (e) {
					o(e);
				}
			}, n, o);
		}
		setDRACOLoader(e) {
			return this.dracoLoader = e, this;
		}
		setKTX2Loader(e) {
			return this.ktx2Loader = e, this;
		}
		setMeshoptDecoder(e) {
			return this.meshoptDecoder = e, this;
		}
		register(e) {
			return this.pluginCallbacks.indexOf(e) === -1 && this.pluginCallbacks.push(e), this;
		}
		unregister(e) {
			return this.pluginCallbacks.indexOf(e) !== -1 && this.pluginCallbacks.splice(this.pluginCallbacks.indexOf(e), 1), this;
		}
		parse(e, t, n, r) {
			let i, a = {}, o = {}, s = new TextDecoder();
			if (typeof e == "string") i = JSON.parse(e);
			else if (e instanceof ArrayBuffer) {
				if (s.decode(new Uint8Array(e, 0, 4)) === xm) {
					try {
						a[Q.KHR_BINARY_GLTF] = new wm(e);
					} catch (e) {
						r && r(e);
						return;
					}
					i = JSON.parse(a[Q.KHR_BINARY_GLTF].content);
				} else i = JSON.parse(s.decode(e));
			} else i = e;
			if (i.asset === void 0 || i.asset.version[0] < 2) {
				r && r(/* @__PURE__ */ Error("THREE.GLTFLoader: Unsupported asset. glTF versions >=2.0 are supported."));
				return;
			}
			let c = new Vm(i, {
				path: t || this.resourcePath || "",
				crossOrigin: this.crossOrigin,
				requestHeader: this.requestHeader,
				manager: this.manager,
				ktx2Loader: this.ktx2Loader,
				meshoptDecoder: this.meshoptDecoder
			});
			c.fileLoader.setRequestHeader(this.requestHeader);
			for (let e = 0; e < this.pluginCallbacks.length; e++) {
				let t = this.pluginCallbacks[e](c);
				t.name || console.error("THREE.GLTFLoader: Invalid plugin found: missing name"), o[t.name] = t, a[t.name] = !0;
			}
			if (i.extensionsUsed) for (let e = 0; e < i.extensionsUsed.length; ++e) {
				let t = i.extensionsUsed[e], n = i.extensionsRequired || [];
				switch (t) {
					case Q.KHR_MATERIALS_UNLIT:
						a[t] = new im();
						break;
					case Q.KHR_DRACO_MESH_COMPRESSION:
						a[t] = new Tm(i, this.dracoLoader);
						break;
					case Q.KHR_TEXTURE_TRANSFORM:
						a[t] = new Em();
						break;
					case Q.KHR_MESH_QUANTIZATION:
						a[t] = new Dm();
						break;
					default: n.indexOf(t) >= 0 && o[t] === void 0 && console.warn("THREE.GLTFLoader: Unknown extension \"" + t + "\".");
				}
			}
			c.setExtensions(a), c.setPlugins(o), c.parse(n, r);
		}
		parseAsync(e, t) {
			let n = this;
			return new Promise(function(r, i) {
				n.parse(e, t, r, i);
			});
		}
	}, Q = {
		KHR_BINARY_GLTF: "KHR_binary_glTF",
		KHR_DRACO_MESH_COMPRESSION: "KHR_draco_mesh_compression",
		KHR_LIGHTS_PUNCTUAL: "KHR_lights_punctual",
		KHR_MATERIALS_CLEARCOAT: "KHR_materials_clearcoat",
		KHR_MATERIALS_DISPERSION: "KHR_materials_dispersion",
		KHR_MATERIALS_IOR: "KHR_materials_ior",
		KHR_MATERIALS_SHEEN: "KHR_materials_sheen",
		KHR_MATERIALS_SPECULAR: "KHR_materials_specular",
		KHR_MATERIALS_TRANSMISSION: "KHR_materials_transmission",
		KHR_MATERIALS_IRIDESCENCE: "KHR_materials_iridescence",
		KHR_MATERIALS_ANISOTROPY: "KHR_materials_anisotropy",
		KHR_MATERIALS_UNLIT: "KHR_materials_unlit",
		KHR_MATERIALS_VOLUME: "KHR_materials_volume",
		KHR_TEXTURE_BASISU: "KHR_texture_basisu",
		KHR_TEXTURE_TRANSFORM: "KHR_texture_transform",
		KHR_MESH_QUANTIZATION: "KHR_mesh_quantization",
		KHR_MATERIALS_EMISSIVE_STRENGTH: "KHR_materials_emissive_strength",
		EXT_MATERIALS_BUMP: "EXT_materials_bump",
		EXT_TEXTURE_WEBP: "EXT_texture_webp",
		EXT_TEXTURE_AVIF: "EXT_texture_avif",
		EXT_MESHOPT_COMPRESSION: "EXT_meshopt_compression",
		KHR_MESHOPT_COMPRESSION: "KHR_meshopt_compression",
		EXT_MESH_GPU_INSTANCING: "EXT_mesh_gpu_instancing"
	}, rm = class {
		constructor(e) {
			this.parser = e, this.name = Q.KHR_LIGHTS_PUNCTUAL, this.cache = {
				refs: {},
				uses: {}
			};
		}
		_markDefs() {
			let e = this.parser, t = this.parser.json.nodes || [];
			for (let n = 0, r = t.length; n < r; n++) {
				let r = t[n];
				r.extensions && r.extensions[this.name] && r.extensions[this.name].light !== void 0 && e._addNodeRef(this.cache, r.extensions[this.name].light);
			}
		}
		_loadLight(e) {
			let t = this.parser, n = "light:" + e, r = t.cache.get(n);
			if (r) return r;
			let i = t.json, a = ((i.extensions && i.extensions[this.name] || {}).lights || [])[e], o, s = new J(16777215);
			a.color !== void 0 && s.setRGB(a.color[0], a.color[1], a.color[2], In);
			let c = a.range === void 0 ? 0 : a.range;
			switch (a.type) {
				case "directional":
					o = new Es(s), o.target.position.set(0, 0, -1), o.add(o.target);
					break;
				case "point":
					o = new Cs(s), o.distance = c;
					break;
				case "spot":
					o = new xs(s), o.distance = c, a.spot = a.spot || {}, a.spot.innerConeAngle = a.spot.innerConeAngle === void 0 ? 0 : a.spot.innerConeAngle, a.spot.outerConeAngle = a.spot.outerConeAngle === void 0 ? Math.PI / 4 : a.spot.outerConeAngle, o.angle = a.spot.outerConeAngle, o.penumbra = 1 - a.spot.innerConeAngle / a.spot.outerConeAngle, o.target.position.set(0, 0, -1), o.add(o.target);
					break;
				default: throw Error("THREE.GLTFLoader: Unexpected light type: " + a.type);
			}
			return o.position.set(0, 0, 0), qp(o, a), a.intensity !== void 0 && (o.intensity = a.intensity), o.name = t.createUniqueName(a.name || "light_" + e), r = Promise.resolve(o), t.cache.add(n, r), r;
		}
		getDependency(e, t) {
			if (e === "light") return this._loadLight(t);
		}
		createNodeAttachment(e) {
			let t = this, n = this.parser, r = n.json.nodes[e], i = (r.extensions && r.extensions[this.name] || {}).light;
			return i === void 0 ? null : this._loadLight(i).then(function(e) {
				return n._getNodeRef(t.cache, i, e);
			});
		}
	}, im = class {
		constructor() {
			this.name = Q.KHR_MATERIALS_UNLIT;
		}
		getMaterialType() {
			return na;
		}
		extendParams(e, t, n) {
			let r = [];
			e.color = new J(1, 1, 1), e.opacity = 1;
			let i = t.pbrMetallicRoughness;
			if (i) {
				if (Array.isArray(i.baseColorFactor)) {
					let t = i.baseColorFactor;
					e.color.setRGB(t[0], t[1], t[2], In), e.opacity = t[3];
				}
				i.baseColorTexture !== void 0 && r.push(n.assignTexture(e, "map", i.baseColorTexture, H));
			}
			return Promise.all(r);
		}
	}, am = class {
		constructor(e) {
			this.parser = e, this.name = Q.KHR_MATERIALS_EMISSIVE_STRENGTH;
		}
		extendMaterialParams(e, t) {
			let n = Wp(this.parser, e, this.name);
			return n === null || n.emissiveStrength !== void 0 && (t.emissiveIntensity = n.emissiveStrength), Promise.resolve();
		}
	}, om = class {
		constructor(e) {
			this.parser = e, this.name = Q.KHR_MATERIALS_CLEARCOAT;
		}
		getMaterialType(e) {
			return Wp(this.parser, e, this.name) === null ? null : Mo;
		}
		extendMaterialParams(e, t) {
			let n = Wp(this.parser, e, this.name);
			if (n === null) return Promise.resolve();
			let r = [];
			if (n.clearcoatFactor !== void 0 && (t.clearcoat = n.clearcoatFactor), n.clearcoatTexture !== void 0 && r.push(this.parser.assignTexture(t, "clearcoatMap", n.clearcoatTexture)), n.clearcoatRoughnessFactor !== void 0 && (t.clearcoatRoughness = n.clearcoatRoughnessFactor), n.clearcoatRoughnessTexture !== void 0 && r.push(this.parser.assignTexture(t, "clearcoatRoughnessMap", n.clearcoatRoughnessTexture)), n.clearcoatNormalTexture !== void 0 && (r.push(this.parser.assignTexture(t, "clearcoatNormalMap", n.clearcoatNormalTexture)), n.clearcoatNormalTexture.scale !== void 0)) {
				let e = n.clearcoatNormalTexture.scale;
				t.clearcoatNormalScale = new U(e, e);
			}
			return Promise.all(r);
		}
	}, sm = class {
		constructor(e) {
			this.parser = e, this.name = Q.KHR_MATERIALS_DISPERSION;
		}
		getMaterialType(e) {
			return Wp(this.parser, e, this.name) === null ? null : Mo;
		}
		extendMaterialParams(e, t) {
			let n = Wp(this.parser, e, this.name);
			return n === null || (t.dispersion = n.dispersion === void 0 ? 0 : n.dispersion), Promise.resolve();
		}
	}, cm = class {
		constructor(e) {
			this.parser = e, this.name = Q.KHR_MATERIALS_IRIDESCENCE;
		}
		getMaterialType(e) {
			return Wp(this.parser, e, this.name) === null ? null : Mo;
		}
		extendMaterialParams(e, t) {
			let n = Wp(this.parser, e, this.name);
			if (n === null) return Promise.resolve();
			let r = [];
			return n.iridescenceFactor !== void 0 && (t.iridescence = n.iridescenceFactor), n.iridescenceTexture !== void 0 && r.push(this.parser.assignTexture(t, "iridescenceMap", n.iridescenceTexture)), n.iridescenceIor !== void 0 && (t.iridescenceIOR = n.iridescenceIor), t.iridescenceThicknessRange === void 0 && (t.iridescenceThicknessRange = [100, 400]), n.iridescenceThicknessMinimum !== void 0 && (t.iridescenceThicknessRange[0] = n.iridescenceThicknessMinimum), n.iridescenceThicknessMaximum !== void 0 && (t.iridescenceThicknessRange[1] = n.iridescenceThicknessMaximum), n.iridescenceThicknessTexture !== void 0 && r.push(this.parser.assignTexture(t, "iridescenceThicknessMap", n.iridescenceThicknessTexture)), Promise.all(r);
		}
	}, lm = class {
		constructor(e) {
			this.parser = e, this.name = Q.KHR_MATERIALS_SHEEN;
		}
		getMaterialType(e) {
			return Wp(this.parser, e, this.name) === null ? null : Mo;
		}
		extendMaterialParams(e, t) {
			let n = Wp(this.parser, e, this.name);
			if (n === null) return Promise.resolve();
			let r = [];
			if (t.sheenColor = new J(0, 0, 0), t.sheenRoughness = 0, t.sheen = 1, n.sheenColorFactor !== void 0) {
				let e = n.sheenColorFactor;
				t.sheenColor.setRGB(e[0], e[1], e[2], In);
			}
			return n.sheenRoughnessFactor !== void 0 && (t.sheenRoughness = n.sheenRoughnessFactor), n.sheenColorTexture !== void 0 && r.push(this.parser.assignTexture(t, "sheenColorMap", n.sheenColorTexture, H)), n.sheenRoughnessTexture !== void 0 && r.push(this.parser.assignTexture(t, "sheenRoughnessMap", n.sheenRoughnessTexture)), Promise.all(r);
		}
	}, um = class {
		constructor(e) {
			this.parser = e, this.name = Q.KHR_MATERIALS_TRANSMISSION;
		}
		getMaterialType(e) {
			return Wp(this.parser, e, this.name) === null ? null : Mo;
		}
		extendMaterialParams(e, t) {
			let n = Wp(this.parser, e, this.name);
			if (n === null) return Promise.resolve();
			let r = [];
			return n.transmissionFactor !== void 0 && (t.transmission = n.transmissionFactor), n.transmissionTexture !== void 0 && r.push(this.parser.assignTexture(t, "transmissionMap", n.transmissionTexture)), Promise.all(r);
		}
	}, dm = class {
		constructor(e) {
			this.parser = e, this.name = Q.KHR_MATERIALS_VOLUME;
		}
		getMaterialType(e) {
			return Wp(this.parser, e, this.name) === null ? null : Mo;
		}
		extendMaterialParams(e, t) {
			let n = Wp(this.parser, e, this.name);
			if (n === null) return Promise.resolve();
			let r = [];
			t.thickness = n.thicknessFactor === void 0 ? 0 : n.thicknessFactor, n.thicknessTexture !== void 0 && r.push(this.parser.assignTexture(t, "thicknessMap", n.thicknessTexture)), t.attenuationDistance = n.attenuationDistance || Infinity;
			let i = n.attenuationColor || [
				1,
				1,
				1
			];
			return t.attenuationColor = new J().setRGB(i[0], i[1], i[2], In), Promise.all(r);
		}
	}, fm = class {
		constructor(e) {
			this.parser = e, this.name = Q.KHR_MATERIALS_IOR;
		}
		getMaterialType(e) {
			return Wp(this.parser, e, this.name) === null ? null : Mo;
		}
		extendMaterialParams(e, t) {
			let n = Wp(this.parser, e, this.name);
			return n === null ? Promise.resolve() : (t.ior = n.ior === void 0 ? 1.5 : n.ior, t.ior === 0 && (t.ior = 1e3), Promise.resolve());
		}
	}, pm = class {
		constructor(e) {
			this.parser = e, this.name = Q.KHR_MATERIALS_SPECULAR;
		}
		getMaterialType(e) {
			return Wp(this.parser, e, this.name) === null ? null : Mo;
		}
		extendMaterialParams(e, t) {
			let n = Wp(this.parser, e, this.name);
			if (n === null) return Promise.resolve();
			let r = [];
			t.specularIntensity = n.specularFactor === void 0 ? 1 : n.specularFactor, n.specularTexture !== void 0 && r.push(this.parser.assignTexture(t, "specularIntensityMap", n.specularTexture));
			let i = n.specularColorFactor || [
				1,
				1,
				1
			];
			return t.specularColor = new J().setRGB(i[0], i[1], i[2], In), n.specularColorTexture !== void 0 && r.push(this.parser.assignTexture(t, "specularColorMap", n.specularColorTexture, H)), Promise.all(r);
		}
	}, mm = class {
		constructor(e) {
			this.parser = e, this.name = Q.EXT_MATERIALS_BUMP;
		}
		getMaterialType(e) {
			return Wp(this.parser, e, this.name) === null ? null : Mo;
		}
		extendMaterialParams(e, t) {
			let n = Wp(this.parser, e, this.name);
			if (n === null) return Promise.resolve();
			let r = [];
			return t.bumpScale = n.bumpFactor === void 0 ? 1 : n.bumpFactor, n.bumpTexture !== void 0 && r.push(this.parser.assignTexture(t, "bumpMap", n.bumpTexture)), Promise.all(r);
		}
	}, hm = class {
		constructor(e) {
			this.parser = e, this.name = Q.KHR_MATERIALS_ANISOTROPY;
		}
		getMaterialType(e) {
			return Wp(this.parser, e, this.name) === null ? null : Mo;
		}
		extendMaterialParams(e, t) {
			let n = Wp(this.parser, e, this.name);
			if (n === null) return Promise.resolve();
			let r = [];
			return n.anisotropyStrength !== void 0 && (t.anisotropy = n.anisotropyStrength), n.anisotropyRotation !== void 0 && (t.anisotropyRotation = n.anisotropyRotation), n.anisotropyTexture !== void 0 && r.push(this.parser.assignTexture(t, "anisotropyMap", n.anisotropyTexture)), Promise.all(r);
		}
	}, gm = class {
		constructor(e) {
			this.parser = e, this.name = Q.KHR_TEXTURE_BASISU;
		}
		loadTexture(e) {
			let t = this.parser, n = t.json, r = n.textures[e];
			if (!r.extensions || !r.extensions[this.name]) return null;
			let i = r.extensions[this.name], a = t.options.ktx2Loader;
			if (!a) {
				if (n.extensionsRequired && n.extensionsRequired.indexOf(this.name) >= 0) throw Error("THREE.GLTFLoader: setKTX2Loader must be called before loading KTX2 textures");
				return null;
			}
			return t.loadTextureImage(e, i.source, a);
		}
	}, _m = class {
		constructor(e) {
			this.parser = e, this.name = Q.EXT_TEXTURE_WEBP;
		}
		loadTexture(e) {
			let t = this.name, n = this.parser, r = n.json, i = r.textures[e];
			if (!i.extensions || !i.extensions[t]) return null;
			let a = i.extensions[t], o = r.images[a.source], s = n.textureLoader;
			if (o.uri) {
				let e = n.options.manager.getHandler(o.uri);
				e !== null && (s = e);
			}
			return n.loadTextureImage(e, a.source, s);
		}
	}, vm = class {
		constructor(e) {
			this.parser = e, this.name = Q.EXT_TEXTURE_AVIF;
		}
		loadTexture(e) {
			let t = this.name, n = this.parser, r = n.json, i = r.textures[e];
			if (!i.extensions || !i.extensions[t]) return null;
			let a = i.extensions[t], o = r.images[a.source], s = n.textureLoader;
			if (o.uri) {
				let e = n.options.manager.getHandler(o.uri);
				e !== null && (s = e);
			}
			return n.loadTextureImage(e, a.source, s);
		}
	}, ym = class {
		constructor(e, t) {
			this.name = t, this.parser = e;
		}
		loadBufferView(e) {
			let t = this.parser.json, n = t.bufferViews[e];
			if (n.extensions && n.extensions[this.name]) {
				let e = n.extensions[this.name], r = this.parser.getDependency("buffer", e.buffer), i = this.parser.options.meshoptDecoder;
				if (!i || !i.supported) {
					if (t.extensionsRequired && t.extensionsRequired.indexOf(this.name) >= 0) throw Error("THREE.GLTFLoader: setMeshoptDecoder must be called before loading compressed files");
					return null;
				}
				return r.then(function(t) {
					let n = e.byteOffset || 0, r = e.byteLength || 0, a = e.count, o = e.byteStride, s = new Uint8Array(t, n, r);
					return i.decodeGltfBufferAsync ? i.decodeGltfBufferAsync(a, o, s, e.mode, e.filter).then(function(e) {
						return e.buffer;
					}) : i.ready.then(function() {
						let t = new ArrayBuffer(a * o);
						return i.decodeGltfBuffer(new Uint8Array(t), a, o, s, e.mode, e.filter), t;
					});
				});
			}
			return null;
		}
	}, bm = class {
		constructor(e) {
			this.name = Q.EXT_MESH_GPU_INSTANCING, this.parser = e;
		}
		createNodeMesh(e) {
			let t = this.parser.json, n = t.nodes[e];
			if (!n.extensions || !n.extensions[this.name] || n.mesh === void 0) return null;
			let r = t.meshes[n.mesh];
			for (let e of r.primitives) if (e.mode !== jm.TRIANGLES && e.mode !== jm.TRIANGLE_STRIP && e.mode !== jm.TRIANGLE_FAN && e.mode !== void 0) return null;
			let i = n.extensions[this.name].attributes, a = [], o = {};
			for (let e in i) a.push(this.parser.getDependency("accessor", i[e]).then((t) => (o[e] = t, o[e])));
			return a.length < 1 ? null : (a.push(this.parser.createNodeMesh(e)), Promise.all(a).then((e) => {
				let t = e.pop(), n = t.isGroup ? t.children : [t], r = e[0].count, i = [];
				for (let e of n) {
					let t = new q(), n = new W(), a = new Zn(), s = new W(1, 1, 1), c = new Ra(e.geometry, e.material, r);
					for (let e = 0; e < r; e++) o.TRANSLATION && n.fromBufferAttribute(o.TRANSLATION, e), o.ROTATION && a.fromBufferAttribute(o.ROTATION, e), o.SCALE && s.fromBufferAttribute(o.SCALE, e), c.setMatrixAt(e, t.compose(n, a, s));
					for (let t in o) if (t === "_COLOR_0") {
						let e = o[t];
						c.instanceColor = new Aa(e.array, e.itemSize, e.normalized);
					} else t !== "TRANSLATION" && t !== "ROTATION" && t !== "SCALE" && e.geometry.setAttribute(t, o[t]);
					Vr.prototype.copy.call(c, e), this.parser.assignFinalMaterial(c), i.push(c);
				}
				return t.isGroup ? (t.clear(), t.add(...i), t) : i[0];
			}));
		}
	}, xm = "glTF", Sm = 12, Cm = {
		JSON: 1313821514,
		BIN: 5130562
	}, wm = class {
		constructor(e) {
			this.name = Q.KHR_BINARY_GLTF, this.content = null, this.body = null;
			let t = new DataView(e, 0, Sm), n = new TextDecoder();
			if (this.header = {
				magic: n.decode(new Uint8Array(e.slice(0, 4))),
				version: t.getUint32(4, !0),
				length: t.getUint32(8, !0)
			}, this.header.magic !== xm) throw Error("THREE.GLTFLoader: Unsupported glTF-Binary header.");
			if (this.header.version < 2) throw Error("THREE.GLTFLoader: Legacy binary file detected.");
			let r = this.header.length - Sm, i = new DataView(e, Sm), a = 0;
			for (; a < r;) {
				let t = i.getUint32(a, !0);
				a += 4;
				let r = i.getUint32(a, !0);
				if (a += 4, r === Cm.JSON) {
					let r = new Uint8Array(e, Sm + a, t);
					this.content = n.decode(r);
				} else if (r === Cm.BIN) {
					let n = Sm + a;
					this.body = e.slice(n, n + t);
				}
				a += t;
			}
			if (this.content === null) throw Error("THREE.GLTFLoader: JSON content not found.");
		}
	}, Tm = class {
		constructor(e, t) {
			if (!t) throw Error("THREE.GLTFLoader: No DRACOLoader instance provided.");
			this.name = Q.KHR_DRACO_MESH_COMPRESSION, this.json = e, this.dracoLoader = t, this.dracoLoader.preload();
		}
		decodePrimitive(e, t) {
			let n = this.json, r = this.dracoLoader, i = e.extensions[this.name].bufferView, a = e.extensions[this.name].attributes, o = {}, s = {}, c = {};
			for (let e in a) {
				let t = Im[e] || e.toLowerCase();
				o[t] = a[e];
			}
			for (let t in e.attributes) {
				let r = Im[t] || t.toLowerCase();
				if (a[t] !== void 0) {
					let i = n.accessors[e.attributes[t]];
					c[r] = Mm[i.componentType].name, s[r] = i.normalized === !0;
				}
			}
			return t.getDependency("bufferView", i).then(function(e) {
				return new Promise(function(t, n) {
					r.decodeDracoFile(e, function(e) {
						for (let t in e.attributes) {
							let n = e.attributes[t], r = s[t];
							r !== void 0 && (n.normalized = r);
						}
						t(e);
					}, o, c, In, n);
				});
			});
		}
	}, Em = class {
		constructor() {
			this.name = Q.KHR_TEXTURE_TRANSFORM;
		}
		extendTexture(e, t) {
			return (t.texCoord === void 0 || t.texCoord === e.channel) && t.offset === void 0 && t.rotation === void 0 && t.scale === void 0 ? e : (e = e.clone(), t.texCoord !== void 0 && (e.channel = t.texCoord), t.offset !== void 0 && e.offset.fromArray(t.offset), t.rotation !== void 0 && (e.rotation = t.rotation), t.scale !== void 0 && e.repeat.fromArray(t.scale), e.needsUpdate = !0, e);
		}
	}, Dm = class {
		constructor() {
			this.name = Q.KHR_MESH_QUANTIZATION;
		}
	}, Om = class extends Lo {
		constructor(e, t, n, r) {
			super(e, t, n, r);
		}
		copySampleValue_(e) {
			let t = this.resultBuffer, n = this.sampleValues, r = this.valueSize, i = e * r * 3 + r;
			for (let e = 0; e !== r; e++) t[e] = n[i + e];
			return t;
		}
		interpolate_(e, t, n, r) {
			let i = this.resultBuffer, a = this.sampleValues, o = this.valueSize, s = o * 2, c = o * 3, l = r - t, u = (n - t) / l, d = u * u, f = d * u, p = e * c, m = p - c, h = -2 * f + 3 * d, g = f - d, _ = 1 - h, v = g - d + u;
			for (let e = 0; e !== o; e++) {
				let t = a[m + e + o], n = a[m + e + s] * l, r = a[p + e + o], c = a[p + e] * l;
				i[e] = _ * t + v * n + h * r + g * c;
			}
			return i;
		}
	}, km = new Zn(), Am = class extends Om {
		interpolate_(e, t, n, r) {
			let i = super.interpolate_(e, t, n, r);
			return km.fromArray(i).normalize().toArray(i), i;
		}
	}, jm = {
		FLOAT: 5126,
		FLOAT_MAT3: 35675,
		FLOAT_MAT4: 35676,
		FLOAT_VEC2: 35664,
		FLOAT_VEC3: 35665,
		FLOAT_VEC4: 35666,
		LINEAR: 9729,
		REPEAT: 10497,
		SAMPLER_2D: 35678,
		POINTS: 0,
		LINES: 1,
		LINE_LOOP: 2,
		LINE_STRIP: 3,
		TRIANGLES: 4,
		TRIANGLE_STRIP: 5,
		TRIANGLE_FAN: 6,
		UNSIGNED_BYTE: 5121,
		UNSIGNED_SHORT: 5123
	}, Mm = {
		5120: Int8Array,
		5121: Uint8Array,
		5122: Int16Array,
		5123: Uint16Array,
		5125: Uint32Array,
		5126: Float32Array
	}, Nm = {
		9728: ft,
		9729: ht,
		9984: pt,
		9985: gt,
		9986: mt,
		9987: _t
	}, Pm = {
		33071: ut,
		33648: dt,
		10497: lt
	}, Fm = {
		SCALAR: 1,
		VEC2: 2,
		VEC3: 3,
		VEC4: 4,
		MAT2: 4,
		MAT3: 9,
		MAT4: 16
	}, Im = {
		POSITION: "position",
		NORMAL: "normal",
		TANGENT: "tangent",
		TEXCOORD_0: "uv",
		TEXCOORD_1: "uv1",
		TEXCOORD_2: "uv2",
		TEXCOORD_3: "uv3",
		COLOR_0: "color",
		WEIGHTS_0: "skinWeight",
		JOINTS_0: "skinIndex"
	}, Lm = {
		scale: "scale",
		translation: "position",
		rotation: "quaternion",
		weights: "morphTargetInfluences"
	}, Rm = {
		CUBICSPLINE: void 0,
		LINEAR: Dn,
		STEP: En
	}, zm = {
		OPAQUE: "OPAQUE",
		MASK: "MASK",
		BLEND: "BLEND"
	}, Bm = new q(), Vm = class {
		constructor(e = {}, t = {}) {
			this.json = e, this.extensions = {}, this.plugins = {}, this.options = t, this.cache = new Up(), this.associations = /* @__PURE__ */ new Map(), this.primitiveCache = {}, this.nodeCache = {}, this.meshCache = {
				refs: {},
				uses: {}
			}, this.cameraCache = {
				refs: {},
				uses: {}
			}, this.lightCache = {
				refs: {},
				uses: {}
			}, this.sourceCache = {}, this.textureCache = {}, this.nodeNamesUsed = {};
			let n = !1, r = -1, i = !1, a = -1;
			if (typeof navigator < "u" && navigator.userAgent !== void 0) {
				let e = navigator.userAgent;
				n = /^((?!chrome|android).)*safari/i.test(e) === !0;
				let t = e.match(/Version\/(\d+)/);
				r = n && t ? parseInt(t[1], 10) : -1, i = e.indexOf("Firefox") > -1, a = i ? e.match(/Firefox\/([0-9]+)\./)[1] : -1;
			}
			this.textureLoader = typeof createImageBitmap > "u" || n && r < 17 || i && a < 98 ? new os(this.options.manager) : new js(this.options.manager), this.textureLoader.setCrossOrigin(this.options.crossOrigin), this.textureLoader.setRequestHeader(this.options.requestHeader), this.fileLoader = new rs(this.options.manager), this.fileLoader.setResponseType("arraybuffer"), this.options.crossOrigin === "use-credentials" && this.fileLoader.setWithCredentials(!0);
		}
		setExtensions(e) {
			this.extensions = e;
		}
		setPlugins(e) {
			this.plugins = e;
		}
		parse(e, t) {
			let n = this, r = this.json, i = this.extensions;
			this.cache.removeAll(), this.nodeCache = {}, this._invokeAll(function(e) {
				return e._markDefs && e._markDefs();
			}), Promise.all(this._invokeAll(function(e) {
				return e.beforeRoot && e.beforeRoot();
			})).then(function() {
				return Promise.all([
					n.getDependencies("scene"),
					n.getDependencies("animation"),
					n.getDependencies("camera")
				]);
			}).then(function(t) {
				let a = {
					scene: t[0][r.scene || 0],
					scenes: t[0],
					animations: t[1],
					cameras: t[2],
					asset: r.asset,
					parser: n,
					userData: {}
				};
				return Kp(i, a, r), qp(a, r), Promise.all(n._invokeAll(function(e) {
					return e.afterRoot && e.afterRoot(a);
				})).then(function() {
					for (let e of a.scenes) e.updateMatrixWorld();
					e(a);
				});
			}).catch(t);
		}
		_markDefs() {
			let e = this.json.nodes || [], t = this.json.skins || [], n = this.json.meshes || [];
			for (let n = 0, r = t.length; n < r; n++) {
				let r = t[n].joints;
				for (let t = 0, n = r.length; t < n; t++) e[r[t]].isBone = !0;
			}
			for (let t = 0, r = e.length; t < r; t++) {
				let r = e[t];
				r.mesh !== void 0 && (this._addNodeRef(this.meshCache, r.mesh), r.skin !== void 0 && (n[r.mesh].isSkinnedMesh = !0)), r.camera !== void 0 && this._addNodeRef(this.cameraCache, r.camera);
			}
		}
		_addNodeRef(e, t) {
			t !== void 0 && (e.refs[t] === void 0 && (e.refs[t] = e.uses[t] = 0), e.refs[t]++);
		}
		_getNodeRef(e, t, n) {
			if (e.refs[t] <= 1) return n;
			let r = n.clone(), i = (e, t) => {
				let n = this.associations.get(e);
				n != null && this.associations.set(t, n);
				for (let [n, r] of e.children.entries()) i(r, t.children[n]);
			};
			return i(n, r), r.name += "_instance_" + e.uses[t]++, r;
		}
		_invokeOne(e) {
			let t = Object.values(this.plugins);
			t.push(this);
			for (let n = 0; n < t.length; n++) {
				let r = e(t[n]);
				if (r) return r;
			}
			return null;
		}
		_invokeAll(e) {
			let t = Object.values(this.plugins);
			t.unshift(this);
			let n = [];
			for (let r = 0; r < t.length; r++) {
				let i = e(t[r]);
				i && n.push(i);
			}
			return n;
		}
		getDependency(e, t) {
			let n = e + ":" + t, r = this.cache.get(n);
			if (!r) {
				switch (e) {
					case "scene":
						r = this.loadScene(t);
						break;
					case "node":
						r = this._invokeOne(function(e) {
							return e.loadNode && e.loadNode(t);
						});
						break;
					case "mesh":
						r = this._invokeOne(function(e) {
							return e.loadMesh && e.loadMesh(t);
						});
						break;
					case "accessor":
						r = this.loadAccessor(t);
						break;
					case "bufferView":
						r = this._invokeOne(function(e) {
							return e.loadBufferView && e.loadBufferView(t);
						});
						break;
					case "buffer":
						r = this.loadBuffer(t);
						break;
					case "material":
						r = this._invokeOne(function(e) {
							return e.loadMaterial && e.loadMaterial(t);
						});
						break;
					case "texture":
						r = this._invokeOne(function(e) {
							return e.loadTexture && e.loadTexture(t);
						});
						break;
					case "skin":
						r = this.loadSkin(t);
						break;
					case "animation":
						r = this._invokeOne(function(e) {
							return e.loadAnimation && e.loadAnimation(t);
						});
						break;
					case "camera":
						r = this.loadCamera(t);
						break;
					default: if (r = this._invokeOne(function(n) {
						return n != this && n.getDependency && n.getDependency(e, t);
					}), !r) throw Error("Unknown type: " + e);
				}
				this.cache.add(n, r);
			}
			return r;
		}
		getDependencies(e) {
			let t = this.cache.get(e);
			if (!t) {
				let n = this, r = this.json[e + (e === "mesh" ? "es" : "s")] || [];
				t = Promise.all(r.map(function(t, r) {
					return n.getDependency(e, r);
				})), this.cache.add(e, t);
			}
			return t;
		}
		loadBuffer(e) {
			let t = this.json.buffers[e], n = this.fileLoader;
			if (t.type && t.type !== "arraybuffer") throw Error("THREE.GLTFLoader: " + t.type + " buffer type is not supported.");
			if (t.uri === void 0 && e === 0) return Promise.resolve(this.extensions[Q.KHR_BINARY_GLTF].body);
			let r = this.options;
			return new Promise(function(e, i) {
				n.load(ks.resolveURL(t.uri, r.path), e, void 0, function() {
					i(/* @__PURE__ */ Error("THREE.GLTFLoader: Failed to load buffer \"" + t.uri + "\"."));
				});
			});
		}
		loadBufferView(e) {
			let t = this.json.bufferViews[e];
			return this.getDependency("buffer", t.buffer).then(function(e) {
				let n = t.byteLength || 0, r = t.byteOffset || 0;
				return e.slice(r, r + n);
			});
		}
		loadAccessor(e) {
			let t = this, n = this.json, r = this.json.accessors[e];
			if (r.bufferView === void 0 && r.sparse === void 0) {
				let e = Fm[r.type], t = Mm[r.componentType], n = r.normalized === !0, i = new t(r.count * e);
				return Promise.resolve(new Di(i, e, n));
			}
			let i = [];
			return r.bufferView === void 0 ? i.push(null) : i.push(this.getDependency("bufferView", r.bufferView)), r.sparse !== void 0 && (i.push(this.getDependency("bufferView", r.sparse.indices.bufferView)), i.push(this.getDependency("bufferView", r.sparse.values.bufferView))), Promise.all(i).then(function(e) {
				let i = e[0], a = Fm[r.type], o = Mm[r.componentType], s = o.BYTES_PER_ELEMENT, c = s * a, l = r.byteOffset || 0, u = r.bufferView === void 0 ? void 0 : n.bufferViews[r.bufferView].byteStride, d = r.normalized === !0, f, p;
				if (u && u !== c) {
					let e = Math.floor(l / u), n = "InterleavedBuffer:" + r.bufferView + ":" + r.componentType + ":" + e + ":" + r.count, c = t.cache.get(n);
					c || (f = new o(i, e * u, r.count * u / s), c = new Ui(f, u / s), t.cache.add(n, c)), p = new Gi(c, a, l % u / s, d);
				} else f = i === null ? new o(r.count * a) : new o(i, l, r.count * a), p = new Di(f, a, d);
				if (r.sparse !== void 0) {
					let t = Fm.SCALAR, n = Mm[r.sparse.indices.componentType], s = r.sparse.indices.byteOffset || 0, c = r.sparse.values.byteOffset || 0, l = new n(e[1], s, r.sparse.count * t), u = new o(e[2], c, r.sparse.count * a);
					i !== null && (p = new Di(p.array.slice(), p.itemSize, p.normalized)), p.normalized = !1;
					for (let e = 0, t = l.length; e < t; e++) {
						let t = l[e];
						if (p.setX(t, u[e * a]), a >= 2 && p.setY(t, u[e * a + 1]), a >= 3 && p.setZ(t, u[e * a + 2]), a >= 4 && p.setW(t, u[e * a + 3]), a >= 5) throw Error("THREE.GLTFLoader: Unsupported itemSize in sparse BufferAttribute.");
					}
					p.normalized = d;
				}
				return p;
			});
		}
		loadTexture(e) {
			let t = this.json, n = this.options, r = t.textures[e].source, i = t.images[r], a = this.textureLoader;
			if (i.uri) {
				let e = n.manager.getHandler(i.uri);
				e !== null && (a = e);
			}
			return this.loadTextureImage(e, r, a);
		}
		loadTextureImage(e, t, n) {
			let r = this, i = this.json, a = i.textures[e], o = i.images[t], s = (o.uri || o.bufferView) + ":" + a.sampler;
			if (this.textureCache[s]) return this.textureCache[s];
			let c = this.loadImageSource(t, n).then(function(t) {
				t.flipY = !1, t.name = a.name || o.name || "", t.name === "" && typeof o.uri == "string" && o.uri.startsWith("data:image/") === !1 && (t.name = o.uri);
				let n = (i.samplers || {})[a.sampler] || {};
				return t.magFilter = Nm[n.magFilter] || 1006, t.minFilter = Nm[n.minFilter] || 1008, t.wrapS = Pm[n.wrapS] || 1e3, t.wrapT = Pm[n.wrapT] || 1e3, t.generateMipmaps = !t.isCompressedTexture && t.minFilter !== 1003 && t.minFilter !== 1006, r.associations.set(t, { textures: e }), t;
			}).catch(function() {
				return null;
			});
			return this.textureCache[s] = c, c;
		}
		loadImageSource(e, t) {
			let n = this, r = this.json, i = this.options;
			if (this.sourceCache[e] !== void 0) return this.sourceCache[e].then((e) => e.clone());
			let a = r.images[e], o = self.URL || self.webkitURL, s = a.uri || "", c = !1;
			if (a.bufferView !== void 0) s = n.getDependency("bufferView", a.bufferView).then(function(e) {
				c = !0;
				let t = new Blob([e], { type: a.mimeType });
				return s = o.createObjectURL(t), s;
			});
			else if (a.uri === void 0) throw Error("THREE.GLTFLoader: Image " + e + " is missing URI and bufferView");
			let l = Promise.resolve(s).then(function(e) {
				return new Promise(function(n, r) {
					let a = n;
					t.isImageBitmapLoader === !0 && (a = function(e) {
						let t = new lr(e);
						t.needsUpdate = !0, n(t);
					}), t.load(ks.resolveURL(e, i.path), a, void 0, r);
				});
			}).then(function(e) {
				return c === !0 && o.revokeObjectURL(s), qp(e, a), e.userData.mimeType = a.mimeType || $p(a.uri), e;
			}).catch(function(e) {
				throw console.error("THREE.GLTFLoader: Couldn't load texture", s), e;
			});
			return this.sourceCache[e] = l, l;
		}
		assignTexture(e, t, n, r) {
			let i = this;
			return this.getDependency("texture", n.index).then(function(a) {
				if (!a) return null;
				if (n.texCoord !== void 0 && n.texCoord > 0 && (a = a.clone(), a.channel = n.texCoord), i.extensions[Q.KHR_TEXTURE_TRANSFORM]) {
					let e = n.extensions === void 0 ? void 0 : n.extensions[Q.KHR_TEXTURE_TRANSFORM];
					if (e) {
						let t = i.associations.get(a);
						a = i.extensions[Q.KHR_TEXTURE_TRANSFORM].extendTexture(a, e), i.associations.set(a, t);
					}
				}
				return r !== void 0 && (a.colorSpace = r), e[t] = a, a;
			});
		}
		assignFinalMaterial(e) {
			let t = e.geometry, n = e.material, r = t.attributes.tangent === void 0, i = t.attributes.color !== void 0, a = t.attributes.normal === void 0;
			if (e.isPoints) {
				let e = "PointsMaterial:" + n.uuid, t = this.cache.get(e);
				t || (t = new oo(), qi.prototype.copy.call(t, n), t.color.copy(n.color), t.map = n.map, t.sizeAttenuation = !1, this.cache.add(e, t)), n = t;
			} else if (e.isLine) {
				let e = "LineBasicMaterial:" + n.uuid, t = this.cache.get(e);
				t || (t = new qa(), qi.prototype.copy.call(t, n), t.color.copy(n.color), t.map = n.map, this.cache.add(e, t)), n = t;
			}
			if (r || i || a) {
				let e = "ClonedMaterial:" + n.uuid + ":";
				r && (e += "derivative-tangents:"), i && (e += "vertex-colors:"), a && (e += "flat-shading:");
				let t = this.cache.get(e);
				t || (t = n.clone(), i && (t.vertexColors = !0), a && (t.flatShading = !0), r && (t.normalScale && (t.normalScale.y *= -1), t.clearcoatNormalScale && (t.clearcoatNormalScale.y *= -1)), this.cache.add(e, t), this.associations.set(t, this.associations.get(n))), n = t;
			}
			e.material = n;
		}
		getMaterialType() {
			return jo;
		}
		loadMaterial(e) {
			let t = this, n = this.json, r = this.extensions, i = n.materials[e], a, o = {}, s = i.extensions || {}, c = [];
			if (s[Q.KHR_MATERIALS_UNLIT]) {
				let e = r[Q.KHR_MATERIALS_UNLIT];
				a = e.getMaterialType(), c.push(e.extendParams(o, i, t));
			} else {
				let n = i.pbrMetallicRoughness || {};
				if (o.color = new J(1, 1, 1), o.opacity = 1, Array.isArray(n.baseColorFactor)) {
					let e = n.baseColorFactor;
					o.color.setRGB(e[0], e[1], e[2], In), o.opacity = e[3];
				}
				n.baseColorTexture !== void 0 && c.push(t.assignTexture(o, "map", n.baseColorTexture, H)), o.metalness = n.metallicFactor === void 0 ? 1 : n.metallicFactor, o.roughness = n.roughnessFactor === void 0 ? 1 : n.roughnessFactor, n.metallicRoughnessTexture !== void 0 && (c.push(t.assignTexture(o, "metalnessMap", n.metallicRoughnessTexture)), c.push(t.assignTexture(o, "roughnessMap", n.metallicRoughnessTexture))), a = this._invokeOne(function(t) {
					return t.getMaterialType && t.getMaterialType(e);
				}), c.push(Promise.all(this._invokeAll(function(t) {
					return t.extendMaterialParams && t.extendMaterialParams(e, o);
				})));
			}
			i.doubleSided === !0 && (o.side = 2);
			let l = i.alphaMode || zm.OPAQUE;
			if (l === zm.BLEND ? (o.transparent = !0, o.depthWrite = !1) : (o.transparent = !1, l === zm.MASK && (o.alphaTest = i.alphaCutoff === void 0 ? .5 : i.alphaCutoff)), i.normalTexture !== void 0 && a !== na && (c.push(t.assignTexture(o, "normalMap", i.normalTexture)), o.normalScale = new U(1, 1), i.normalTexture.scale !== void 0)) {
				let e = i.normalTexture.scale;
				o.normalScale.set(e, e);
			}
			if (i.occlusionTexture !== void 0 && a !== na && (c.push(t.assignTexture(o, "aoMap", i.occlusionTexture)), i.occlusionTexture.strength !== void 0 && (o.aoMapIntensity = i.occlusionTexture.strength)), i.emissiveFactor !== void 0 && a !== na) {
				let e = i.emissiveFactor;
				o.emissive = new J().setRGB(e[0], e[1], e[2], In);
			}
			return i.emissiveTexture !== void 0 && a !== na && c.push(t.assignTexture(o, "emissiveMap", i.emissiveTexture, H)), Promise.all(c).then(function() {
				let n = new a(o);
				return i.name && (n.name = i.name), qp(n, i), t.associations.set(n, { materials: e }), i.extensions && Kp(r, n, i), n;
			});
		}
		createUniqueName(e) {
			let t = Js.sanitizeNodeName(e || "");
			return t in this.nodeNamesUsed ? t + "_" + ++this.nodeNamesUsed[t] : (this.nodeNamesUsed[t] = 0, t);
		}
		loadGeometries(e) {
			let t = this, n = this.extensions, r = this.primitiveCache;
			function i(e) {
				return n[Q.KHR_DRACO_MESH_COMPRESSION].decodePrimitive(e, t).then(function(n) {
					return tm(n, e, t);
				});
			}
			let a = [];
			for (let n = 0, o = e.length; n < o; n++) {
				let o = e[n], s = Xp(o), c = r[s];
				if (c) a.push(c.promise);
				else {
					let e;
					e = o.extensions && o.extensions[Q.KHR_DRACO_MESH_COMPRESSION] ? i(o) : tm(new Hi(), o, t), r[s] = {
						primitive: o,
						promise: e
					}, a.push(e);
				}
			}
			return Promise.all(a);
		}
		loadMesh(e) {
			let t = this, n = this.json, r = this.extensions, i = n.meshes[e], a = i.primitives, o = [];
			for (let e = 0, t = a.length; e < t; e++) {
				let t = a[e].material === void 0 ? Gp(this.cache) : this.getDependency("material", a[e].material);
				o.push(t);
			}
			return o.push(t.loadGeometries(a)), Promise.all(o).then(function(n) {
				let o = n.slice(0, n.length - 1), s = n[n.length - 1], c = [];
				for (let n = 0, l = s.length; n < l; n++) {
					let l = s[n], u = a[n], d, f = o[n];
					if (u.mode === jm.TRIANGLES || u.mode === jm.TRIANGLE_STRIP || u.mode === jm.TRIANGLE_FAN || u.mode === void 0) d = i.isSkinnedMesh === !0 ? new wa(l, f) : new ma(l, f), d.isSkinnedMesh === !0 && d.normalizeSkinWeights(), u.mode === jm.TRIANGLE_STRIP ? d.geometry = Lp(d.geometry, 1) : u.mode === jm.TRIANGLE_FAN && (d.geometry = Lp(d.geometry, 2));
					else if (u.mode === jm.LINES) d = new io(l, f);
					else if (u.mode === jm.LINE_STRIP) d = new to(l, f);
					else if (u.mode === jm.LINE_LOOP) d = new ao(l, f);
					else if (u.mode === jm.POINTS) d = new fo(l, f);
					else throw Error("THREE.GLTFLoader: Primitive mode unsupported: " + u.mode);
					Object.keys(d.geometry.morphAttributes).length > 0 && Yp(d, i), d.name = t.createUniqueName(i.name || "mesh_" + e), qp(d, i), u.extensions && Kp(r, d, u), t.assignFinalMaterial(d), c.push(d);
				}
				for (let n = 0, r = c.length; n < r; n++) t.associations.set(c[n], {
					meshes: e,
					primitives: n
				});
				if (c.length === 1) return i.extensions && Kp(r, c[0], i), c[0];
				let l = new Hr();
				i.extensions && Kp(r, l, i), t.associations.set(l, { meshes: e });
				for (let e = 0, t = c.length; e < t; e++) l.add(c[e]);
				return l;
			});
		}
		loadCamera(e) {
			let t, n = this.json.cameras[e], r = n[n.type];
			if (!r) {
				console.warn("THREE.GLTFLoader: Missing camera parameters.");
				return;
			}
			return n.type === "perspective" ? t = new ys(Xn.radToDeg(r.yfov), r.aspectRatio || 1, r.znear || 1, r.zfar || 2e6) : n.type === "orthographic" && (t = new ws(-r.xmag, r.xmag, r.ymag, -r.ymag, r.znear, r.zfar)), n.name && (t.name = this.createUniqueName(n.name)), qp(t, n), Promise.resolve(t);
		}
		loadSkin(e) {
			let t = this.json.skins[e], n = [];
			for (let e = 0, r = t.joints.length; e < r; e++) n.push(this._loadNodeShallow(t.joints[e]));
			return t.inverseBindMatrices === void 0 ? n.push(null) : n.push(this.getDependency("accessor", t.inverseBindMatrices)), Promise.all(n).then(function(e) {
				let n = e.pop(), r = e, i = [], a = [];
				for (let e = 0, o = r.length; e < o; e++) {
					let o = r[e];
					if (o) {
						i.push(o);
						let t = new q();
						n !== null && t.fromArray(n.array, e * 16), a.push(t);
					} else console.warn("THREE.GLTFLoader: Joint \"%s\" could not be found.", t.joints[e]);
				}
				return new ka(i, a);
			});
		}
		loadAnimation(e) {
			let t = this.json, n = this, r = t.animations[e], i = r.name ? r.name : "animation_" + e, a = [], o = [], s = [], c = [], l = [];
			for (let e = 0, t = r.channels.length; e < t; e++) {
				let t = r.channels[e], n = r.samplers[t.sampler], i = t.target, u = i.node, d = r.parameters === void 0 ? n.input : r.parameters[n.input], f = r.parameters === void 0 ? n.output : r.parameters[n.output];
				i.node !== void 0 && (a.push(this.getDependency("node", u)), o.push(this.getDependency("accessor", d)), s.push(this.getDependency("accessor", f)), c.push(n), l.push(i));
			}
			return Promise.all([
				Promise.all(a),
				Promise.all(o),
				Promise.all(s),
				Promise.all(c),
				Promise.all(l)
			]).then(function(e) {
				let t = e[0], a = e[1], o = e[2], s = e[3], c = e[4], l = [];
				for (let e = 0, r = t.length; e < r; e++) {
					let r = t[e], i = a[e], u = o[e], d = s[e], f = c[e];
					if (r === void 0) continue;
					r.updateMatrix && r.updateMatrix();
					let p = n._createAnimationTracks(r, i, u, d, f);
					if (p) for (let e = 0; e < p.length; e++) l.push(p[e]);
				}
				let u = new Xo(i, void 0, l);
				return qp(u, r), u;
			});
		}
		createNodeMesh(e) {
			let t = this.json, n = this, r = t.nodes[e];
			return r.mesh === void 0 ? null : n.getDependency("mesh", r.mesh).then(function(e) {
				let t = n._getNodeRef(n.meshCache, r.mesh, e);
				return r.weights !== void 0 && t.traverse(function(e) {
					if (e.isMesh) for (let t = 0, n = r.weights.length; t < n; t++) e.morphTargetInfluences[t] = r.weights[t];
				}), t;
			});
		}
		loadNode(e) {
			let t = this.json, n = this, r = t.nodes[e], i = n._loadNodeShallow(e), a = [], o = r.children || [];
			for (let e = 0, t = o.length; e < t; e++) a.push(n.getDependency("node", o[e]));
			let s = r.skin === void 0 ? Promise.resolve(null) : n.getDependency("skin", r.skin);
			return Promise.all([
				i,
				Promise.all(a),
				s
			]).then(function(e) {
				let t = e[0], n = e[1], r = e[2];
				r !== null && t.traverse(function(e) {
					e.isSkinnedMesh && e.bind(r, Bm);
				});
				for (let e = 0, r = n.length; e < r; e++) t.add(n[e]);
				if (t.userData.pivot !== void 0 && n.length > 0) {
					let e = t.userData.pivot, r = n[0];
					t.pivot = new W().fromArray(e), t.position.x -= e[0], t.position.y -= e[1], t.position.z -= e[2], r.position.set(0, 0, 0), delete t.userData.pivot;
				}
				return t;
			});
		}
		_loadNodeShallow(e) {
			let t = this.json, n = this.extensions, r = this;
			if (this.nodeCache[e] !== void 0) return this.nodeCache[e];
			let i = t.nodes[e], a = i.name ? r.createUniqueName(i.name) : "", o = [], s = r._invokeOne(function(t) {
				return t.createNodeMesh && t.createNodeMesh(e);
			});
			return s && o.push(s), i.camera !== void 0 && o.push(r.getDependency("camera", i.camera).then(function(e) {
				return r._getNodeRef(r.cameraCache, i.camera, e);
			})), r._invokeAll(function(t) {
				return t.createNodeAttachment && t.createNodeAttachment(e);
			}).forEach(function(e) {
				o.push(e);
			}), this.nodeCache[e] = Promise.all(o).then(function(t) {
				let o;
				if (o = i.isBone === !0 ? new Ta() : t.length > 1 ? new Hr() : t.length === 1 ? t[0] : new Vr(), o !== t[0]) for (let e = 0, n = t.length; e < n; e++) o.add(t[e]);
				if (i.name && (o.userData.name = i.name, o.name = a), qp(o, i), i.extensions && Kp(n, o, i), i.matrix !== void 0) {
					let e = new q();
					e.fromArray(i.matrix), o.applyMatrix4(e);
				} else i.translation !== void 0 && o.position.fromArray(i.translation), i.rotation !== void 0 && o.quaternion.fromArray(i.rotation), i.scale !== void 0 && o.scale.fromArray(i.scale);
				if (!r.associations.has(o)) r.associations.set(o, {});
				else if (i.mesh !== void 0 && r.meshCache.refs[i.mesh] > 1) {
					let e = r.associations.get(o);
					r.associations.set(o, { ...e });
				}
				return r.associations.get(o).nodes = e, o;
			}), this.nodeCache[e];
		}
		loadScene(e) {
			let t = this.extensions, n = this.json.scenes[e], r = this, i = new Hr();
			n.name && (i.name = r.createUniqueName(n.name)), qp(i, n), n.extensions && Kp(t, i, n);
			let a = n.nodes || [], o = [];
			for (let e = 0, t = a.length; e < t; e++) o.push(r.getDependency("node", a[e]));
			return Promise.all(o).then(function(e) {
				for (let t = 0, n = e.length; t < n; t++) {
					let n = e[t];
					n.parent === null ? i.add(n) : i.add(zp(n));
				}
				return r.associations = ((e) => {
					let t = /* @__PURE__ */ new Map();
					for (let [e, n] of r.associations) (e instanceof qi || e instanceof lr) && t.set(e, n);
					return e.traverse((e) => {
						let n = r.associations.get(e);
						n != null && t.set(e, n);
					}), t;
				})(i), i;
			});
		}
		_createAnimationTracks(e, t, n, r, i) {
			let a = [], o = e.name ? e.name : e.uuid, s = [];
			function c(e) {
				e.morphTargetInfluences && s.push(e.name ? e.name : e.uuid);
			}
			Lm[i.path] === Lm.weights ? (c(e), e.isGroup && e.children.forEach(c)) : s.push(o);
			let l;
			switch (Lm[i.path]) {
				case Lm.weights:
					l = Go;
					break;
				case Lm.rotation:
					l = qo;
					break;
				case Lm.translation:
				case Lm.scale:
					l = Yo;
					break;
				default: switch (n.itemSize) {
					case 1:
						l = Go;
						break;
					default: l = Yo;
				}
			}
			let u = r.interpolation === void 0 ? Dn : Rm[r.interpolation], d = this._getArrayFromAccessor(n);
			for (let e = 0, n = s.length; e < n; e++) {
				let n = new l(s[e] + "." + Lm[i.path], t.array, d, u);
				r.interpolation === "CUBICSPLINE" && this._createCubicSplineTrackInterpolant(n), a.push(n);
			}
			return a;
		}
		_getArrayFromAccessor(e) {
			let t = e.array;
			if (e.normalized) {
				let e = Qp(t.constructor), n = new Float32Array(t.length);
				for (let r = 0, i = t.length; r < i; r++) n[r] = t[r] * e;
				t = n;
			}
			return t;
		}
		_createCubicSplineTrackInterpolant(e) {
			e.createInterpolant = function(e) {
				return new (this instanceof qo ? Am : Om)(this.times, this.values, this.getValueSize() / 3, e);
			}, e.createInterpolant.isInterpolantFactoryMethodGLTFCubicSpline = !0;
		}
	};
})), Um, Wm, Gm, Km, qm, Jm = t((() => {
	Um = /^def\s+(?:(\w+)\s+)?"?([^"]+)"?$/, Wm = /^string\s+(\w+)$/, Gm = /^(?:uniform\s+)?(\w+(?:\[\])?)\s+(.+)$/, Km = {
		Attribute: 1,
		Prim: 6,
		Relationship: 8
	}, qm = class {
		parseText(e) {
			e = this._preprocess(e);
			let t = {}, n = e.split("\n"), r = null, i = t, a = [t];
			for (let e of n) if (e.includes("=")) {
				let t = this._findAssignmentOperator(e);
				if (t === -1) {
					r = e.trim();
					continue;
				}
				let n = e.slice(0, t).trim(), o = e.slice(t + 1).trim();
				if (o.endsWith("{")) {
					let e = {};
					a.push(e), i[n] = e, i = e;
				} else if (o.endsWith("(")) {
					let e = o.slice(0, -1);
					i[n] = e;
					let t = {};
					a.push(t), i = t;
				} else i[n] = o;
			} else if (e.includes(":") && !e.includes("=")) {
				let t = e.indexOf(":"), n = e.slice(0, t).trim(), r = e.slice(t + 1).trim();
				/^[\d.]+$/.test(n) && (i[n] = r);
			} else if (e.endsWith("{")) {
				r = e.slice(0, -1).trim() || r;
				let t = i[r] || {};
				a.push(t), i[r] = t, i = t;
			} else if (e.endsWith("}")) {
				if (a.pop(), a.length === 0) continue;
				i = a[a.length - 1];
			} else if (e.endsWith("(")) {
				let t = {};
				a.push(t), r = e.split("(")[0].trim() || r, i[r] = t, i = t;
			} else e.endsWith(")") ? (a.pop(), i = a[a.length - 1]) : e.trim() && (r = e.trim());
			return t;
		}
		_preprocess(e) {
			e = this._stripBlockComments(e), e = this._collapseTripleQuotedStrings(e);
			let t = e.split("\n"), n = [], r = !1, i = 0, a = 0, o = "";
			for (let e = 0; e < t.length; e++) {
				let s = t[e];
				s = this._stripInlineComment(s);
				let c = s.trim();
				if (r) {
					o += " " + c;
					for (let e of c) e === "[" ? i++ : e === "]" ? i-- : e === "(" && i > 0 ? a++ : e === ")" && i > 0 && a--;
					i === 0 && a === 0 && (n.push(o), o = "", r = !1);
				} else {
					if (c.includes("=")) {
						let e = this._findAssignmentOperator(c);
						if (e !== -1) {
							let t = c.slice(e + 1).trim(), n = 0, s = 0;
							for (let e of t) e === "[" ? n++ : e === "]" && s++;
							if (n > s) {
								r = !0, i = n - s, a = 0, o = c;
								continue;
							}
						}
					}
					n.push(c);
				}
			}
			return n.join("\n");
		}
		_stripBlockComments(e) {
			let t = "", n = 0;
			for (; n < e.length;) if (e[n] === "/" && n + 1 < e.length && e[n + 1] === "*") {
				let t = n + 2;
				for (; t < e.length;) {
					if (e[t] === "*" && t + 1 < e.length && e[t + 1] === "/") {
						t += 2;
						break;
					}
					t++;
				}
				n = t;
			} else t += e[n], n++;
			return t;
		}
		_collapseTripleQuotedStrings(e) {
			let t = "", n = 0;
			for (; n < e.length;) {
				if (n + 2 < e.length) {
					let r = e.slice(n, n + 3);
					if (r === "'''" || r === "\"\"\"") {
						let i = r;
						for (t += i, n += 3; n < e.length;) if (n + 2 < e.length && e.slice(n, n + 3) === i) {
							t += i, n += 3;
							break;
						} else e[n] === "\n" ? t += "\\n" : e[n] !== "\r" && (t += e[n]), n++;
						continue;
					}
				}
				t += e[n], n++;
			}
			return t;
		}
		_stripInlineComment(e) {
			if (e.trim().startsWith("#usda")) return e;
			let t = !1, n = null, r = !1;
			for (let i = 0; i < e.length; i++) {
				let a = e[i];
				if (r) {
					r = !1;
					continue;
				}
				if (a === "\\") {
					r = !0;
					continue;
				}
				if (!t && (a === "\"" || a === "'")) t = !0, n = a;
				else if (t && a === n) t = !1, n = null;
				else if (!t && a === "#") return e.slice(0, i).trimEnd();
			}
			return e;
		}
		_findAssignmentOperator(e) {
			let t = !1, n = null, r = !1;
			for (let i = 0; i < e.length; i++) {
				let a = e[i];
				if (r) {
					r = !1;
					continue;
				}
				if (a === "\\") {
					r = !0;
					continue;
				}
				if (!t && (a === "\"" || a === "'")) t = !0, n = a;
				else if (t && a === n) t = !1, n = null;
				else if (!t && a === "=") return i;
			}
			return -1;
		}
		parseData(e) {
			let t = this.parseText(e), n = {}, r = {};
			if ("#usda 1.0" in t) {
				let e = t["#usda 1.0"];
				e.upAxis && (r.upAxis = e.upAxis.replace(/"/g, "")), e.defaultPrim && (r.defaultPrim = e.defaultPrim.replace(/"/g, "")), e.metersPerUnit !== void 0 && (r.metersPerUnit = parseFloat(e.metersPerUnit)), e.framesPerSecond !== void 0 && (r.framesPerSecond = parseFloat(e.framesPerSecond)), e.timeCodesPerSecond !== void 0 && (r.timeCodesPerSecond = parseFloat(e.timeCodesPerSecond));
			}
			n["/"] = {
				specType: Km.Prim,
				fields: r
			};
			let i = (e, t) => {
				let r = [];
				for (let a in e) {
					if (a === "#usda 1.0" || a === "variants") continue;
					let o = a.match(Um);
					if (o) {
						let s = o[1] || "", c = o[2], l = t === "/" ? "/" + c : t + "/" + c;
						r.push(c);
						let u = { typeName: s }, d = e[a];
						this._extractPrimData(d, l, u, n, Km), n[l] = {
							specType: Km.Prim,
							fields: u
						}, i(d, l);
					}
				}
				r.length > 0 && n[t] && (n[t].fields.primChildren = r);
			};
			return i(t, "/"), this._inferSkelElementSize(n), { specsByPath: n };
		}
		_inferSkelElementSize(e) {
			for (let t in e) {
				let n = e[t];
				if (n.specType !== Km.Prim || n.fields.typeName !== "Mesh") continue;
				let r = e[t + ".points"];
				if (!r || !r.fields.default) continue;
				let i = r.fields.default.length / 3;
				i !== 0 && (this._inferElementSize(e[t + ".primvars:skel:jointIndices"], i), this._inferElementSize(e[t + ".primvars:skel:jointWeights"], i));
			}
		}
		_inferElementSize(e, t) {
			if (!e || e.fields.elementSize !== void 0 || !e.fields.default) return;
			let n = e.fields.default.length;
			n > 0 && n % t === 0 && (e.fields.elementSize = n / t);
		}
		_extractPrimData(e, t, n, r, i) {
			if (!(!e || typeof e != "object")) for (let a in e) {
				if (a.startsWith("def ")) continue;
				if (a === "prepend references") {
					n.references = [e[a]];
					continue;
				}
				if (a === "payload") {
					n.payload = e[a];
					continue;
				}
				if (a === "variants") {
					let t = {}, r = e[a];
					for (let e in r) {
						let n = e.match(Wm);
						if (n) {
							let i = n[1];
							t[i] = r[e].replace(/"/g, "");
						}
					}
					Object.keys(t).length > 0 && (n.variantSelection = t);
					continue;
				}
				if (a.startsWith("rel ")) {
					let n = a.slice(4), o = t + "." + n, s = e[a].replace(/[<>]/g, "");
					r[o] = {
						specType: i.Relationship,
						fields: { targetPaths: [s] }
					};
					continue;
				}
				if (a.includes("xformOpOrder")) {
					n.xformOpOrder = e[a].replace(/[\[\]]/g, "").split(",").map((e) => e.trim().replace(/"/g, ""));
					continue;
				}
				let o = a.match(Gm);
				if (o) {
					let n = o[1], s = o[2], c = e[a];
					if (s.endsWith(".connect")) {
						let e = s.slice(0, -8), a = t + "." + e, o = String(c).trim();
						o.startsWith("<") && (o = o.slice(1)), o.endsWith(">") && (o = o.slice(0, -1)), r[a] || (r[a] = {
							specType: i.Attribute,
							fields: { typeName: n }
						}), r[a].fields.connectionPaths = [o];
						continue;
					}
					if (s.endsWith(".timeSamples") && typeof c == "object") {
						let e = s.slice(0, -12), a = t + "." + e, o = [], l = [];
						for (let e in c) {
							let t = parseFloat(e);
							isNaN(t) || (o.push(t), l.push(this._parseAttributeValue(n, c[e])));
						}
						let u = o.map((e, t) => ({
							t: e,
							v: l[t]
						})).sort((e, t) => e.t - t.t);
						r[a] = {
							specType: i.Attribute,
							fields: {
								timeSamples: {
									times: u.map((e) => e.t),
									values: u.map((e) => e.v)
								},
								typeName: n
							}
						};
					} else {
						let e = this._parseAttributeValue(n, c), a = t + "." + s;
						r[a] ? (r[a].fields.default = e, r[a].fields.typeName = n) : r[a] = {
							specType: i.Attribute,
							fields: {
								default: e,
								typeName: n
							}
						};
					}
				}
			}
		}
		_parseAttributeValue(e, t) {
			if (t == null) return;
			let n = String(t).trim();
			if (e.endsWith("[]")) {
				let t;
				try {
					let e = n.replace(/\(/g, "[").replace(/\)/g, "]");
					e.endsWith(",") && (e = e.slice(0, -1));
					let r = JSON.parse(e);
					t = Array.isArray(r) && Array.isArray(r[0]) ? r.flat() : r;
				} catch {
					t = n.replace(/[\[\]]/g, "").split(",").map((e) => {
						let t = e.trim(), n = parseFloat(t);
						return isNaN(n) ? t.replace(/"/g, "") : n;
					});
				}
				if (e.startsWith("quat")) for (let e = 0; e < t.length; e += 4) {
					let n = t[e];
					t[e] = t[e + 1], t[e + 1] = t[e + 2], t[e + 2] = t[e + 3], t[e + 3] = n;
				}
				return t;
			}
			if (e.includes("3") || e.includes("2") || e.includes("4")) return n.replace(/[()]/g, "").split(",").map((e) => parseFloat(e.trim()));
			if (e.startsWith("quat")) {
				let e = n.replace(/[()]/g, "").split(",").map((e) => parseFloat(e.trim()));
				return [
					e[1],
					e[2],
					e[3],
					e[0]
				];
			}
			return e.includes("matrix") ? n.replace(/[()]/g, "").split(",").map((e) => parseFloat(e.trim())) : e === "float" || e === "double" || e === "int" ? parseFloat(n) : e === "string" || e === "token" ? this._parseString(n) : e === "asset" ? n.replace(/@/g, "").replace(/"/g, "") : this._parseString(n);
		}
		_parseString(e) {
			(e.startsWith("\"") && e.endsWith("\"") || e.startsWith("'") && e.endsWith("'")) && (e = e.slice(1, -1));
			let t = "", n = 0;
			for (; n < e.length;) if (e[n] === "\\" && n + 1 < e.length) {
				let r = e[n + 1];
				switch (r) {
					case "n":
						t += "\n";
						break;
					case "t":
						t += "	";
						break;
					case "r":
						t += "\r";
						break;
					case "\\":
						t += "\\";
						break;
					case "\"":
						t += "\"";
						break;
					case "'":
						t += "'";
						break;
					default: t += r;
				}
				n += 2;
			} else t += e[n], n++;
			return t;
		}
	};
}));
//#endregion
//#region node_modules/three/examples/jsm/loaders/usd/USDCParser.js
function Ym(e, t, n, r, i, a) {
	for (; t < n;) {
		let o = e[t++];
		if (t > n) break;
		let s = o >> 4;
		if (s === 15) {
			let r;
			do {
				if (t >= n) break;
				r = e[t++], s += r;
			} while (r === 255 && t < n);
		}
		if (s > 0) {
			t + s > n && (s = n - t);
			for (let n = 0; n < s && !(i >= a); n++) r[i++] = e[t++];
		}
		if (t >= n || t + 2 > n) break;
		let c = e[t++] | e[t++] << 8;
		if (c === 0) break;
		let l = (o & 15) + 4;
		if (l === 19) {
			let r;
			do {
				if (t >= n) break;
				r = e[t++], l += r;
			} while (r === 255 && t < n);
		}
		let u = i - c;
		if (u < 0) break;
		for (let e = 0; e < l && !(i >= a); e++) r[i++] = r[u + e];
	}
	return i;
}
function Xm(e, t) {
	let n = new Uint8Array(t), r = e[0];
	if (r === 0) return Ym(e, 1, e.length, n, 0, t), n;
	{
		let i = 1, a = [];
		for (let t = 0; t < r; t++) {
			let t = (e[i] | e[i + 1] << 8 | e[i + 2] << 16 | e[i + 3] << 24) >>> 0;
			a.push(t), i += 4;
		}
		let o = i, s = 0;
		for (let i = 0; i < r; i++) {
			let r = a[i], c = Math.min(65536, t - s);
			Ym(e, o, o + r, n, s, s + c), o += r, s += c;
		}
		return n;
	}
}
function Zm(e, t) {
	let n = t * 4 + (t * 2 + 7 >> 3) + 4;
	return Qm(Xm(new Uint8Array(e), n), t);
}
function Qm(e, t) {
	let n = new DataView(e.buffer, e.byteOffset, e.byteLength), r = 0, i = n.getInt32(r, !0);
	r += 4;
	let a = t * 2 + 7 >> 3, o = r, s = r + a, c = new Int32Array(t), l = 0, u = o, d = s;
	for (let r = 0; r < t;) {
		let a = e[u++];
		for (let e = 0; e < 4 && r < t; e++, r++) {
			let t = a >> e * 2 & 3, o = 0;
			switch (t) {
				case 0:
					o = i;
					break;
				case 1:
					o = n.getInt8(d), d += 1;
					break;
				case 2:
					o = n.getInt16(d, !0), d += 2;
					break;
				case 3: o = n.getInt32(d, !0), d += 4;
			}
			l += o, c[r] = l;
		}
	}
	return c;
}
var $m, eh, th, $, nh, rh, ih, ah, oh, sh, ch = t((() => {
	$m = new TextDecoder(), eh = /* @__PURE__ */ new Float32Array(32);
	for (let e = 0; e < 32; e++) eh[e] = 2 ** (e - 15);
	th = 2 ** -14, $ = {
		Invalid: 0,
		Bool: 1,
		UChar: 2,
		Int: 3,
		UInt: 4,
		Int64: 5,
		UInt64: 6,
		Half: 7,
		Float: 8,
		Double: 9,
		String: 10,
		Token: 11,
		AssetPath: 12,
		Matrix2d: 13,
		Matrix3d: 14,
		Matrix4d: 15,
		Quatd: 16,
		Quatf: 17,
		Quath: 18,
		Vec2d: 19,
		Vec2f: 20,
		Vec2h: 21,
		Vec2i: 22,
		Vec3d: 23,
		Vec3f: 24,
		Vec3h: 25,
		Vec3i: 26,
		Vec4d: 27,
		Vec4f: 28,
		Vec4h: 29,
		Vec4i: 30,
		Dictionary: 31,
		TokenListOp: 32,
		StringListOp: 33,
		PathListOp: 34,
		ReferenceListOp: 35,
		IntListOp: 36,
		Int64ListOp: 37,
		UIntListOp: 38,
		UInt64ListOp: 39,
		PathVector: 40,
		TokenVector: 41,
		Specifier: 42,
		Permission: 43,
		Variability: 44,
		VariantSelectionMap: 45,
		TimeSamples: 46,
		Payload: 47,
		DoubleVector: 48,
		LayerOffsetVector: 49,
		StringVector: 50,
		ValueBlock: 51,
		Value: 52,
		UnregisteredValue: 53,
		UnregisteredValueListOp: 54,
		PayloadListOp: 55,
		TimeCode: 56,
		PathExpression: 57,
		Relocates: 58,
		Spline: 59,
		AnimationBlock: 60
	}, nh = 4294967295, rh = 105, ih = 116, ah = class {
		constructor(e) {
			this.buffer = e, this.view = new DataView(e), this.offset = 0;
		}
		seek(e) {
			this.offset = e;
		}
		tell() {
			return this.offset;
		}
		readUint8() {
			let e = this.view.getUint8(this.offset);
			return this.offset += 1, e;
		}
		readInt8() {
			let e = this.view.getInt8(this.offset);
			return this.offset += 1, e;
		}
		readUint16() {
			let e = this.view.getUint16(this.offset, !0);
			return this.offset += 2, e;
		}
		readInt16() {
			let e = this.view.getInt16(this.offset, !0);
			return this.offset += 2, e;
		}
		readUint32() {
			let e = this.view.getUint32(this.offset, !0);
			return this.offset += 4, e;
		}
		readInt32() {
			let e = this.view.getInt32(this.offset, !0);
			return this.offset += 4, e;
		}
		readUint64() {
			let e = this.view.getUint32(this.offset, !0), t = this.view.getUint32(this.offset + 4, !0);
			return this.offset += 8, t * 4294967296 + e;
		}
		readInt64() {
			let e = this.view.getUint32(this.offset, !0), t = this.view.getInt32(this.offset + 4, !0);
			return this.offset += 8, t * 4294967296 + e;
		}
		readFloat32() {
			let e = this.view.getFloat32(this.offset, !0);
			return this.offset += 4, e;
		}
		readFloat64() {
			let e = this.view.getFloat64(this.offset, !0);
			return this.offset += 8, e;
		}
		readBytes(e) {
			let t = new Uint8Array(this.buffer, this.offset, e);
			return this.offset += e, t;
		}
		readString(e) {
			let t = this.readBytes(e), n = 0;
			for (; n < e && t[n] !== 0;) n++;
			return $m.decode(t.subarray(0, n));
		}
	}, oh = class {
		constructor(e, t) {
			this.lo = e, this.hi = t;
		}
		get isArray() {
			return !!(this.hi & 2147483648);
		}
		get isInlined() {
			return !!(this.hi & 1073741824);
		}
		get isCompressed() {
			return !!(this.hi & 536870912);
		}
		get typeEnum() {
			return this.hi >> 16 & 255;
		}
		get payload() {
			return this.lo + (this.hi & 65535) * 4294967296;
		}
		getInlinedValue() {
			return this.lo;
		}
	}, sh = class {
		parseData(e) {
			this.buffer = e instanceof ArrayBuffer ? e : e.buffer, this.reader = new ah(this.buffer), this.version = {
				major: 0,
				minor: 0,
				patch: 0
			}, this._conversionBuffer = /* @__PURE__ */ new ArrayBuffer(4), this._conversionView = new DataView(this._conversionBuffer), this._readBootstrap(), this._readTOC(), this._readTokens(), this._readStrings(), this._readFields(), this._readFieldSets(), this._readPaths(), this._readSpecs(), this.specsByPath = {};
			for (let e of this.specs) {
				let t = this.paths[e.pathIndex];
				if (!t) continue;
				let n = this._getFieldsForSpec(e);
				this.specsByPath[t] = {
					specType: e.specType,
					fields: n
				};
			}
			return { specsByPath: this.specsByPath };
		}
		_readBootstrap() {
			let e = this.reader;
			if (e.seek(0), e.readString(8) !== "PXR-USDC") throw Error("THREE.USDCParser: Not a valid USDC file.");
			this.version.major = e.readUint8(), this.version.minor = e.readUint8(), this.version.patch = e.readUint8(), e.readBytes(5), this.tocOffset = e.readUint64();
		}
		_readTOC() {
			let e = this.reader;
			e.seek(this.tocOffset);
			let t = e.readUint64();
			this.sections = {};
			for (let n = 0; n < t; n++) {
				let t = e.readString(16), n = e.readUint64(), r = e.readUint64();
				this.sections[t] = {
					start: n,
					size: r
				};
			}
		}
		_readTokens() {
			let e = this.sections.TOKENS;
			if (!e) return;
			let t = this.reader;
			t.seek(e.start);
			let n = t.readUint64();
			if (this.tokens = [], this.version.major === 0 && this.version.minor < 4) {
				let e = t.readUint64(), r = t.readBytes(e), i = 0;
				for (let e = 0; e < n; e++) {
					let e = i;
					for (; e < r.length && r[e] !== 0;) e++;
					this.tokens.push($m.decode(r.subarray(i, e))), i = e + 1;
				}
			} else {
				let e = t.readUint64(), r = t.readUint64(), i = Xm(t.readBytes(r), e), a = 0;
				for (let e = 0; e < n; e++) {
					let e = a;
					for (; e < i.length && i[e] !== 0;) e++;
					this.tokens.push($m.decode(i.subarray(a, e))), a = e + 1;
				}
			}
		}
		_readStrings() {
			let e = this.sections.STRINGS;
			if (!e) {
				this.strings = [];
				return;
			}
			let t = this.reader;
			t.seek(e.start);
			let n = Math.floor(e.size / 4);
			this.strings = [];
			for (let e = 0; e < n; e++) this.strings.push(t.readUint32());
		}
		_readFields() {
			let e = this.sections.FIELDS;
			if (!e) return;
			let t = this.reader;
			if (t.seek(e.start), this.fields = [], this.version.major === 0 && this.version.minor < 4) {
				let n = Math.floor(e.size / 12);
				for (let e = 0; e < n; e++) {
					let e = t.readUint32(), n = t.readUint32(), r = t.readUint32();
					this.fields.push({
						tokenIndex: e,
						valueRep: new oh(n, r)
					});
				}
			} else {
				let e = t.readUint64(), n = t.readUint64(), r = t.readBytes(n), i = Zm(r.buffer.slice(r.byteOffset, r.byteOffset + n), e), a = t.readUint64(), o = Xm(t.readBytes(a), e * 8), s = new DataView(o.buffer, o.byteOffset, o.byteLength);
				for (let t = 0; t < e; t++) {
					let e = s.getUint32(t * 8, !0), n = s.getUint32(t * 8 + 4, !0);
					this.fields.push({
						tokenIndex: i[t],
						valueRep: new oh(e, n)
					});
				}
			}
		}
		_readFieldSets() {
			let e = this.sections.FIELDSETS;
			if (!e) return;
			let t = this.reader;
			if (t.seek(e.start), this.fieldSets = [], this.version.major === 0 && this.version.minor < 4) {
				let n = Math.floor(e.size / 4);
				for (let e = 0; e < n; e++) this.fieldSets.push(t.readUint32());
			} else {
				let e = t.readUint64(), n = t.readUint64(), r = t.readBytes(n), i = Zm(r.buffer.slice(r.byteOffset, r.byteOffset + n), e);
				for (let t = 0; t < e; t++) this.fieldSets.push(i[t]);
			}
		}
		_readPaths() {
			let e = this.sections.PATHS;
			if (!e) return;
			let t = this.reader;
			t.seek(e.start);
			let n = t.readUint64();
			if (this.paths = Array(n).fill(""), this.version.major === 0 && this.version.minor < 4) this._readPathsRecursive("");
			else {
				t.readUint64();
				let e = t.readUint64(), r = t.readBytes(e), i = Zm(r.buffer.slice(r.byteOffset, r.byteOffset + e), n), a = t.readUint64(), o = t.readBytes(a), s = Zm(o.buffer.slice(o.byteOffset, o.byteOffset + a), n), c = t.readUint64(), l = t.readBytes(c), u = Zm(l.buffer.slice(l.byteOffset, l.byteOffset + c), n);
				this._buildPathsFromCompressed(i, s, u);
			}
		}
		_readPathsRecursive(e, t = 0) {
			let n = this.reader;
			if (t > 1e3) return;
			let r = n.readUint32(), i = n.readUint32(), a = n.readUint8(), o = !!(a & 1), s = !!(a & 2), c = !!(a & 4), l;
			if (e === "") l = "/";
			else {
				let t = this.tokens[i] || "";
				l = c ? e + "." + t : e === "/" ? "/" + t : e + "/" + t;
			}
			if (this.paths[r] = l, o && s) {
				let r = n.readUint64();
				this._readPathsRecursive(l, t + 1), n.seek(r), this._readPathsRecursive(e, t + 1);
			} else o ? this._readPathsRecursive(l, t + 1) : s && this._readPathsRecursive(e, t + 1);
		}
		_buildPathsFromCompressed(e, t, n) {
			let r = (i, a) => {
				let o = i;
				for (; o < e.length;) {
					let i = o++, s = e[i], c = t[i], l = n[i], u;
					if (a === "") u = "/", a = u;
					else {
						let e = this.tokens[Math.abs(c)] || "";
						u = c < 0 ? a + "." + e : a === "/" ? "/" + e : a + "/" + e;
					}
					this.paths[s] = u;
					let d = l > 0 || l === -1, f = l >= 0;
					if (d) {
						if (f) {
							let e = i + l;
							r(e, a);
						}
						a = u;
					} else if (!f) break;
				}
			};
			r(0, "");
		}
		_readSpecs() {
			let e = this.sections.SPECS;
			if (!e) return;
			let t = this.reader;
			if (t.seek(e.start), this.specs = [], this.version.major === 0 && this.version.minor < 4) {
				let n = this.version.minor === 0 && this.version.patch === 1 ? 16 : 12, r = Math.floor(e.size / n);
				for (let e = 0; e < r; e++) {
					let e = t.readUint32(), r = t.readUint32(), i = t.readUint32();
					n === 16 && t.readUint32(), this.specs.push({
						pathIndex: e,
						fieldSetIndex: r,
						specType: i
					});
				}
			} else {
				let e = t.readUint64(), n = t.readUint64(), r = t.readBytes(n), i = Zm(r.buffer.slice(r.byteOffset, r.byteOffset + n), e), a = t.readUint64(), o = t.readBytes(a), s = Zm(o.buffer.slice(o.byteOffset, o.byteOffset + a), e), c = t.readUint64(), l = t.readBytes(c), u = Zm(l.buffer.slice(l.byteOffset, l.byteOffset + c), e);
				for (let t = 0; t < e; t++) this.specs.push({
					pathIndex: i[t],
					fieldSetIndex: s[t],
					specType: u[t]
				});
			}
		}
		_readValue(e) {
			let t = e.typeEnum, n = e.isArray, r = e.isInlined;
			if (t === $.TimeSamples) return this._readTimeSamples(e);
			if (r) return this._readInlinedValue(e);
			let i = e.payload;
			if (i === 0 && n) return [];
			if (i < 0 || i >= this.buffer.byteLength) throw RangeError("USDCParser: Invalid payload offset " + i + " for type " + t + ".");
			let a = this.reader.tell();
			this.reader.seek(i);
			let o;
			return o = n ? this._readArrayValue(e) : this._readScalarValue(t), this.reader.seek(a), o;
		}
		_readInlinedValue(e) {
			let t = e.typeEnum, n = e.getInlinedValue(), r = this._conversionView;
			switch (t) {
				case $.Bool: return n !== 0;
				case $.UChar: return n & 255;
				case $.Int:
				case $.UInt: return n;
				case $.Float: return r.setUint32(0, n, !0), r.getFloat32(0, !0);
				case $.Double: return r.setUint32(0, n, !0), r.getFloat32(0, !0);
				case $.Token: return this.tokens[n] || "";
				case $.String: return this.tokens[this.strings[n]] || "";
				case $.AssetPath: return this.tokens[n] || "";
				case $.Specifier: return n;
				case $.Permission:
				case $.Variability: return n;
				case $.Vec2h: return r.setUint32(0, n, !0), [this._halfToFloat(r.getUint16(0, !0)), this._halfToFloat(r.getUint16(2, !0))];
				case $.Vec2f:
				case $.Vec2i: return r.setUint32(0, n, !0), [r.getInt8(0), r.getInt8(1)];
				case $.Vec3f:
				case $.Vec3i: return r.setUint32(0, n, !0), [
					r.getInt8(0),
					r.getInt8(1),
					r.getInt8(2)
				];
				case $.Vec4f:
				case $.Vec4i: return r.setUint32(0, n, !0), [
					r.getInt8(0),
					r.getInt8(1),
					r.getInt8(2),
					r.getInt8(3)
				];
				case $.Matrix2d: return r.setUint32(0, n, !0), [
					r.getInt8(0),
					0,
					0,
					r.getInt8(1)
				];
				case $.Matrix3d: return r.setUint32(0, n, !0), [
					r.getInt8(0),
					0,
					0,
					0,
					r.getInt8(1),
					0,
					0,
					0,
					r.getInt8(2)
				];
				case $.Matrix4d: return r.setUint32(0, n, !0), [
					r.getInt8(0),
					0,
					0,
					0,
					0,
					r.getInt8(1),
					0,
					0,
					0,
					0,
					r.getInt8(2),
					0,
					0,
					0,
					0,
					r.getInt8(3)
				];
				default: return n;
			}
		}
		_readTimeSamples(e) {
			let t = this.reader, n = e.payload, r = t.tell();
			t.seek(n);
			let i = t.tell(), a = t.readInt64();
			t.seek(i + a);
			let o = t.readUint32(), s = t.readUint32(), c = new oh(o, s), l = this._readValue(c), u = i + a + 8;
			t.seek(u);
			let d = t.tell(), f = t.readInt64();
			t.seek(d + f);
			let p = t.readUint64(), m = [];
			for (let e = 0; e < p; e++) {
				let e = t.readUint32(), n = t.readUint32();
				m.push(new oh(e, n));
			}
			let h = [];
			for (let e = 0; e < p; e++) h.push(this._readValue(m[e]));
			return t.seek(r), {
				times: l instanceof Float64Array ? Array.from(l) : Array.isArray(l) ? l : [l],
				values: h
			};
		}
		_readScalarValue(e) {
			let t = this.reader;
			switch (e) {
				case $.Invalid: return null;
				case $.Bool: return t.readUint8() !== 0;
				case $.UChar: return t.readUint8();
				case $.Int: return t.readInt32();
				case $.UInt: return t.readUint32();
				case $.Int64: return t.readInt64();
				case $.UInt64: return t.readUint64();
				case $.Half: return this._readHalf();
				case $.Float: return t.readFloat32();
				case $.Double: return t.readFloat64();
				case $.String:
				case $.Token: {
					let e = t.readUint32();
					return this.tokens[e] || "";
				}
				case $.AssetPath: {
					let e = t.readUint32();
					return this.tokens[e] || "";
				}
				case $.Vec2f: return [t.readFloat32(), t.readFloat32()];
				case $.Vec2d: return [t.readFloat64(), t.readFloat64()];
				case $.Vec2i: return [t.readInt32(), t.readInt32()];
				case $.Vec3f: return [
					t.readFloat32(),
					t.readFloat32(),
					t.readFloat32()
				];
				case $.Vec3d: return [
					t.readFloat64(),
					t.readFloat64(),
					t.readFloat64()
				];
				case $.Vec3i: return [
					t.readInt32(),
					t.readInt32(),
					t.readInt32()
				];
				case $.Vec4f: return [
					t.readFloat32(),
					t.readFloat32(),
					t.readFloat32(),
					t.readFloat32()
				];
				case $.Vec4d: return [
					t.readFloat64(),
					t.readFloat64(),
					t.readFloat64(),
					t.readFloat64()
				];
				case $.Quatf: return [
					t.readFloat32(),
					t.readFloat32(),
					t.readFloat32(),
					t.readFloat32()
				];
				case $.Quatd: return [
					t.readFloat64(),
					t.readFloat64(),
					t.readFloat64(),
					t.readFloat64()
				];
				case $.Matrix4d: {
					let e = [];
					for (let n = 0; n < 16; n++) e.push(t.readFloat64());
					return e;
				}
				case $.TokenVector: {
					let e = t.readUint64(), n = [];
					for (let r = 0; r < e; r++) {
						let e = t.readUint32();
						n.push(this.tokens[e] || "");
					}
					return n;
				}
				case $.PathVector: {
					let e = t.readUint64(), n = [];
					for (let r = 0; r < e; r++) {
						let e = t.readUint32();
						n.push(this.paths[e] || "");
					}
					return n;
				}
				case $.DoubleVector: {
					let e = t.readUint64(), n = new Float64Array(e);
					for (let r = 0; r < e; r++) n[r] = t.readFloat64();
					return n;
				}
				case $.Dictionary: {
					let e = t.readUint64(), n = {};
					for (let r = 0; r < e; r++) {
						let e = t.readUint32(), r = this.tokens[e], i = t.position + t.readInt64(), a = t.position;
						t.position = i;
						let o = t.readUint64(), s = new oh(o), c = null;
						s.isInlined ? c = this._readInlinedValue(s) : s.isArray ? (t.position = s.payload, c = this._readArrayValue(s)) : (t.position = s.payload, c = this._readScalarValue(s.typeEnum)), t.position = a, r !== void 0 && c !== null && (n[r] = c);
					}
					return n;
				}
				case $.TokenListOp:
				case $.StringListOp:
				case $.IntListOp:
				case $.Int64ListOp:
				case $.UIntListOp:
				case $.UInt64ListOp: return null;
				case $.PathListOp: {
					let e = t.readUint8(), n = !!(e & 2), r = !!(e & 4), i = !!(e & 8), a = !!(e & 16), o = !!(e & 32), s = !!(e & 64), c = () => {
						let e = t.readUint64(), n = [];
						for (let r = 0; r < e; r++) {
							let e = t.readUint32();
							n.push(this.paths[e]);
						}
						return n;
					}, l = null, u = null, d = null, f = null;
					return n && (l = c()), r && (u = c()), o && (d = c()), s && (f = c()), i && c(), a && c(), d && d.length > 0 ? d : l && l.length > 0 ? l : f && f.length > 0 ? f : u && u.length > 0 ? u : null;
				}
				case $.VariantSelectionMap: {
					let e = t.readUint64(), n = {};
					for (let r = 0; r < e; r++) {
						let e = t.readUint32(), r = t.readUint32(), i = this.tokens[this.strings[e]], a = this.tokens[this.strings[r]];
						i && a && (n[i] = a);
					}
					return n;
				}
				default: return console.warn("USDCParser: Unsupported scalar type", e), null;
			}
		}
		_readArrayValue(e) {
			let t = this.reader, n = e.typeEnum, r = e.isCompressed, i;
			if (i = this.version.major === 0 && this.version.minor < 7 ? t.readUint32() : t.readUint64(), !Number.isSafeInteger(i) || i < 0) throw RangeError("USDCParser: Invalid array size " + i + " for type " + n + ".");
			if (i > 2147483647) throw RangeError("USDCParser: Array size " + i + " exceeds implementation limits.");
			if (i === 0) return [];
			if (r) return this._readCompressedArray(n, i);
			switch (n) {
				case $.Int: {
					let e = new Int32Array(i);
					for (let n = 0; n < i; n++) e[n] = t.readInt32();
					return e;
				}
				case $.UInt: {
					let e = new Uint32Array(i);
					for (let n = 0; n < i; n++) e[n] = t.readUint32();
					return e;
				}
				case $.Float: {
					let e = new Float32Array(i);
					for (let n = 0; n < i; n++) e[n] = t.readFloat32();
					return e;
				}
				case $.Double: {
					let e = new Float64Array(i);
					for (let n = 0; n < i; n++) e[n] = t.readFloat64();
					return e;
				}
				case $.Vec2f: {
					let e = new Float32Array(i * 2);
					for (let n = 0; n < i * 2; n++) e[n] = t.readFloat32();
					return e;
				}
				case $.Vec3f: {
					let e = new Float32Array(i * 3);
					for (let n = 0; n < i * 3; n++) e[n] = t.readFloat32();
					return e;
				}
				case $.Vec4f: {
					let e = new Float32Array(i * 4);
					for (let n = 0; n < i * 4; n++) e[n] = t.readFloat32();
					return e;
				}
				case $.Vec3h: {
					let e = new Float32Array(i * 3);
					for (let t = 0; t < i * 3; t++) e[t] = this._readHalf();
					return e;
				}
				case $.Quatf: {
					let e = new Float32Array(i * 4);
					for (let n = 0; n < i * 4; n++) e[n] = t.readFloat32();
					return e;
				}
				case $.Quath: {
					let e = new Float32Array(i * 4);
					for (let t = 0; t < i * 4; t++) e[t] = this._readHalf();
					return e;
				}
				case $.Matrix4d: {
					let e = new Float64Array(i * 16);
					for (let n = 0; n < i * 16; n++) e[n] = t.readFloat64();
					return e;
				}
				case $.Token: {
					let e = [];
					for (let n = 0; n < i; n++) {
						let n = t.readUint32();
						e.push(this.tokens[n] || "");
					}
					return e;
				}
				case $.Half: {
					let e = new Float32Array(i);
					for (let t = 0; t < i; t++) e[t] = this._readHalf();
					return e;
				}
				default: return console.warn("USDCParser: Unsupported array type", n), [];
			}
		}
		_readCompressedArray(e, t) {
			let n = this.reader;
			switch (e) {
				case $.Int:
				case $.UInt: {
					let e = n.readUint64(), r = n.readBytes(e);
					return Zm(r.buffer.slice(r.byteOffset, r.byteOffset + e), t);
				}
				case $.Float: {
					let e = n.readInt8();
					if (e === rh) {
						let e = n.readUint64(), r = n.readBytes(e), i = Zm(r.buffer.slice(r.byteOffset, r.byteOffset + e), t), a = new Float32Array(t);
						for (let e = 0; e < t; e++) a[e] = i[e];
						return a;
					}
					if (e === ih) {
						let e = n.readUint32(), r = new Float32Array(e);
						for (let t = 0; t < e; t++) r[t] = n.readFloat32();
						let i = n.readUint64(), a = n.readBytes(i), o = Zm(a.buffer.slice(a.byteOffset, a.byteOffset + i), t), s = new Float32Array(t);
						for (let e = 0; e < t; e++) s[e] = r[o[e]];
						return s;
					}
					return console.warn("USDCParser: Unknown float compression code", e), new Float32Array(t);
				}
				default: return console.warn("USDCParser: Unsupported compressed array type", e), [];
			}
		}
		_readHalf() {
			return this._halfToFloat(this.reader.readUint16());
		}
		_halfToFloat(e) {
			let t = (e & 32768) >> 15, n = (e & 31744) >> 10, r = e & 1023;
			return n === 0 ? r === 0 ? t ? -0 : 0 : (t ? -1 : 1) * th * (r / 1024) : n === 31 ? r ? NaN : t ? -Infinity : Infinity : (t ? -1 : 1) * eh[n] * (1 + r / 1024);
		}
		_getFieldsForSpec(e) {
			let t = {}, n = e.fieldSetIndex, r = 0;
			for (; n < this.fieldSets.length && r < 1e4;) {
				let e = this.fieldSets[n];
				if (e === nh || e === -1) break;
				let i = this.fields[e];
				if (i) {
					let e = this.tokens[i.tokenIndex];
					t[e] = this._readValue(i.valueRep);
				}
				n++, r++;
			}
			return t;
		}
	};
})), lh, uh, dh, fh, ph = t((() => {
	gd(), lh = /^(.+?)\/\{(\w+)=(\w+)\}\/(.+)$/, uh = {
		Unknown: 0,
		Attribute: 1,
		Connection: 2,
		Expression: 3,
		Mapper: 4,
		MapperArg: 5,
		Prim: 6,
		PseudoRoot: 7,
		Relationship: 8,
		RelationshipTarget: 9,
		Variant: 10,
		VariantSet: 11
	}, dh = {
		projection: "perspective",
		clippingRange: [1, 1e6],
		horizontalAperture: 20.955,
		verticalAperture: 15.2908,
		horizontalApertureOffset: 0,
		verticalApertureOffset: 0,
		focalLength: 50,
		focusDistance: 0,
		fStop: 0
	}, fh = class e {
		constructor(e = null) {
			this.textureCache = {}, this.skinnedMeshes = [], this.manager = e, this.texturePromises = [];
		}
		compose(e, t = {}, n = {}, r = "") {
			this.specsByPath = e.specsByPath, this.assets = t, this.externalVariantSelections = n, this.basePath = r, this.skinnedMeshes = [], this.skeletons = {}, this.texturePromises = [], this._buildIndexes();
			let i = this.specsByPath["/"], a = i ? i.fields : {};
			this.fps = a.timeCodesPerSecond || a.framesPerSecond || 24;
			let o = new Hr();
			this._buildHierarchy(o, "/"), this._bindSkeletons();
			let s = Object.keys(this.skeletons);
			s.length === 1 && (o.skeleton = this.skeletons[s[0]].skeleton), o.animations = this._buildAnimations();
			let c = a.metersPerUnit;
			return c !== void 0 && c !== 1 && o.scale.setScalar(c), i && i.fields && i.fields.upAxis === "Z" && (o.rotation.x = -Math.PI / 2), o;
		}
		applyTransform(e, t, n = {}) {
			let r = {
				...t,
				...n
			}, i = r.xformOpOrder;
			if (i && i.length > 0) {
				let t = new q(), n = new q(), a = null;
				for (let e = 0; e < i.length; e++) {
					let o = i[e], s = o.startsWith("!invert!"), c = s ? o.slice(8) : o;
					if (c === "xformOp:transform") {
						let e = r["xformOp:transform"];
						e && e.length === 16 && (n.set(e[0], e[4], e[8], e[12], e[1], e[5], e[9], e[13], e[2], e[6], e[10], e[14], e[3], e[7], e[11], e[15]), s && n.invert(), t.multiply(n));
					} else if (c === "xformOp:translate") {
						let e = r["xformOp:translate"];
						e && (n.makeTranslation(e[0], e[1], e[2]), s && n.invert(), t.multiply(n));
					} else if (c === "xformOp:translate:pivot") {
						let e = r["xformOp:translate:pivot"];
						e && (n.makeTranslation(e[0], e[1], e[2]), s && n.invert(), t.multiply(n));
					} else if (c === "xformOp:scale") {
						let e = r["xformOp:scale"];
						e && (Array.isArray(e) ? (n.makeScale(e[0], e[1], e[2]), a = [
							e[0],
							e[1],
							e[2]
						]) : (n.makeScale(e, e, e), a = [
							e,
							e,
							e
						]), s && n.invert(), t.multiply(n));
					} else if (c === "xformOp:rotateXYZ") {
						let e = r["xformOp:rotateXYZ"];
						if (e) {
							let r = new wr(e[0] * Math.PI / 180, e[1] * Math.PI / 180, e[2] * Math.PI / 180, "ZYX");
							n.makeRotationFromEuler(r), s && n.invert(), t.multiply(n);
						}
					} else if (c === "xformOp:rotateX") {
						let e = r["xformOp:rotateX"];
						e !== void 0 && (n.makeRotationX(e * Math.PI / 180), s && n.invert(), t.multiply(n));
					} else if (c === "xformOp:rotateY") {
						let e = r["xformOp:rotateY"];
						e !== void 0 && (n.makeRotationY(e * Math.PI / 180), s && n.invert(), t.multiply(n));
					} else if (c === "xformOp:rotateZ") {
						let e = r["xformOp:rotateZ"];
						e !== void 0 && (n.makeRotationZ(e * Math.PI / 180), s && n.invert(), t.multiply(n));
					} else if (c === "xformOp:orient") {
						let e = r["xformOp:orient"];
						if (e && e.length === 4) {
							let r = new Zn(e[0], e[1], e[2], e[3]);
							n.makeRotationFromQuaternion(r), s && n.invert(), t.multiply(n);
						}
					}
				}
				if (e.matrix.copy(t), e.matrix.decompose(e.position, e.quaternion, e.scale), a) {
					let t = a[0] < 0, n = a[1] < 0, r = a[2] < 0;
					+!!t + +!!n + +!!r == 3 && (e.scale.set(a[0], a[1], a[2]), e.quaternion.set(e.quaternion.x, -e.quaternion.y, e.quaternion.z, -e.quaternion.w));
				}
				return;
			}
			if (r["xformOp:translate"]) {
				let t = r["xformOp:translate"];
				e.position.set(t[0], t[1], t[2]);
			}
			if (r["xformOp:translate:pivot"]) {
				let t = r["xformOp:translate:pivot"];
				e.pivot = new W(t[0], t[1], t[2]);
			}
			if (r["xformOp:scale"]) {
				let t = r["xformOp:scale"];
				Array.isArray(t) ? e.scale.set(t[0], t[1], t[2]) : e.scale.set(t, t, t);
			}
			if (r["xformOp:rotateXYZ"]) {
				let t = r["xformOp:rotateXYZ"];
				e.rotation.set(t[0] * Math.PI / 180, t[1] * Math.PI / 180, t[2] * Math.PI / 180);
			}
			if (r["xformOp:orient"]) {
				let t = r["xformOp:orient"];
				t.length === 4 && e.quaternion.set(t[0], t[1], t[2], t[3]);
			}
		}
		_buildIndexes() {
			this.childrenByPath = /* @__PURE__ */ new Map(), this.attributesByPrimPath = /* @__PURE__ */ new Map(), this.materialsByRoot = /* @__PURE__ */ new Map(), this.shadersByMaterialPath = /* @__PURE__ */ new Map(), this.geomSubsetsByMeshPath = /* @__PURE__ */ new Map();
			for (let e in this.specsByPath) {
				let t = this.specsByPath[e];
				if (t.specType === uh.Prim) {
					let n = e.lastIndexOf("/");
					if (n > 0) {
						let t = e.slice(0, n), r = e.slice(n + 1);
						this.childrenByPath.has(t) || this.childrenByPath.set(t, []), this.childrenByPath.get(t).push({
							name: r,
							path: e
						});
					} else if (n === 0 && e.length > 1) {
						let t = e.slice(1);
						this.childrenByPath.has("/") || this.childrenByPath.set("/", []), this.childrenByPath.get("/").push({
							name: t,
							path: e
						});
					}
					let r = t.fields.typeName;
					if (r === "Material") {
						let t = e.split("/"), n = t.length > 1 ? "/" + t[1] : "/";
						this.materialsByRoot.has(n) || this.materialsByRoot.set(n, []), this.materialsByRoot.get(n).push(e);
					}
					if (r === "Shader" && n > 0) {
						let t = e.slice(0, n);
						for (; t.length > 0;) {
							let n = this.specsByPath[t];
							if (n && n.specType === uh.Prim && n.fields.typeName === "Material") {
								this.shadersByMaterialPath.has(t) || this.shadersByMaterialPath.set(t, []), this.shadersByMaterialPath.get(t).push(e);
								break;
							}
							let r = t.lastIndexOf("/");
							if (r <= 0) break;
							t = t.slice(0, r);
						}
					}
					if (r === "GeomSubset" && n > 0) {
						let t = e.slice(0, n);
						this.geomSubsetsByMeshPath.has(t) || this.geomSubsetsByMeshPath.set(t, []), this.geomSubsetsByMeshPath.get(t).push(e);
					}
				} else if (t.specType === uh.Attribute || t.specType === uh.Relationship) {
					let n = e.lastIndexOf(".");
					if (n > 0) {
						let r = e.slice(0, n), i = e.slice(n + 1);
						this.attributesByPrimPath.has(r) || this.attributesByPrimPath.set(r, /* @__PURE__ */ new Map()), this.attributesByPrimPath.get(r).set(i, t);
					}
				}
			}
		}
		_isDirectChild(e, t, n) {
			if (!t.startsWith(n)) return !1;
			let r = t.slice(n.length);
			return r.length === 0 || r.startsWith("{") ? !1 : !r.includes("/");
		}
		_buildHierarchy(e, t) {
			let n = [], r = /* @__PURE__ */ new Set(), i = this.childrenByPath.get(t);
			if (i) for (let e of i) r.has(e.path) || (r.add(e.path), n.push(e));
			let a = this._getVariantPaths(t);
			for (let e of a) {
				let t = this.childrenByPath.get(e);
				if (t) for (let e of t) r.has(e.path) || (r.add(e.path), n.push(e));
			}
			for (let { name: t, path: r } of n) {
				let n = this.specsByPath[r];
				if (!n || n.specType !== uh.Prim) continue;
				let i = n.fields.typeName, a = this._getReferences(n);
				if (a.length > 0) {
					let o = this._getLocalVariantSelections(n.fields), s = [];
					for (let e of a) {
						let t = this._resolveReference(e, o);
						t && s.push(t);
					}
					if (s.length > 0) {
						let a = this._getAttributes(r);
						if (s.length === 1) {
							let o = this._findSingleMesh(s[0]);
							if (o && (i === "Xform" || !i)) {
								o.name = t, this.applyTransform(o, n.fields, a), this._applyMaterialBinding(o, r), e.add(o), this._buildHierarchy(o, r);
								continue;
							}
						}
						let o = new Vr();
						o.name = t, this.applyTransform(o, n.fields, a);
						for (let e of s) for (; e.children.length > 0;) o.add(e.children[0]);
						e.add(o), this._buildHierarchy(o, r);
						continue;
					}
				}
				if (i === "SkelRoot") {
					let i = new Vr();
					i.name = t, i.userData.isSkelRoot = !0;
					let a = this._getAttributes(r);
					this.applyTransform(i, n.fields, a), e.add(i), this._buildHierarchy(i, r);
				} else if (i === "Skeleton") {
					let t = this._buildSkeleton(r);
					t && (this.skeletons[r] = t), this._buildHierarchy(e, r);
				} else if (i !== "SkelAnimation") {
					if (i === "Mesh") {
						let t = this._buildMesh(r, n);
						t && (e.add(t), this._buildHierarchy(t, r));
					} else if (i === "Camera") {
						let i = this._buildCamera(r);
						i.name = t;
						let a = this._getAttributes(r);
						this.applyTransform(i, n.fields, a), e.add(i), this._buildHierarchy(i, r);
					} else if (i === "DistantLight" || i === "SphereLight" || i === "RectLight" || i === "DiskLight") {
						let a = this._buildLight(r, i);
						a.name = t;
						let o = this._getAttributes(r);
						this.applyTransform(a, n.fields, o), e.add(a), this._buildHierarchy(a, r);
					} else if (i === "Cube" || i === "Sphere" || i === "Cylinder" || i === "Cone" || i === "Capsule") {
						let t = this._buildGeomPrimitive(r, n, i);
						t && (e.add(t), this._buildHierarchy(t, r));
					} else if (i !== "Material" && i !== "Shader" && i !== "GeomSubset") {
						let i = new Vr();
						i.name = t;
						let a = this._getAttributes(r);
						this.applyTransform(i, n.fields, a), e.add(i), this._buildHierarchy(i, r);
					}
				}
			}
		}
		_getVariantPaths(e) {
			let t = this.specsByPath[e], n = t?.fields?.variantSetChildren, r = [];
			if (!n || n.length === 0) return r;
			for (let i of n) {
				let n = this.externalVariantSelections[i] || null;
				if (!n) {
					let e = t.fields.variantSelection;
					n = e ? e[i] : null;
				}
				if (!n) {
					let t = e + "/{" + i + "=}", r = this.specsByPath[t];
					r?.fields?.variantChildren && (n = r.fields.variantChildren[0]);
				}
				if (n) {
					let t = e + "/{" + i + "=" + n + "}";
					r.push(t);
				}
			}
			return r;
		}
		_resolveFilePath(e) {
			let t = e;
			if (t.startsWith("./") && (t = t.slice(2)), !this.basePath) return t;
			let n = this.basePath.endsWith("/") ? this.basePath : this.basePath + "/";
			return ks.resolveURL(t, n);
		}
		_resolveReference(t, n = {}) {
			if (!t) return null;
			let r = t.match(/@([^@]+)@(?:<([^>]+)>)?/);
			if (!r) return null;
			let i = r[1], a = r[2], o = this._resolveFilePath(i), s = {
				...n,
				...this.externalVariantSelections
			}, c = this.assets[o];
			if (!c) return null;
			if (c.specsByPath) {
				let t = new e(this.manager), n = this._getBasePath(o), r = t.compose(c, this.assets, s, n);
				if (a) {
					let e = a.split("/").pop(), t = null;
					for (let n of r.children) if (n.name === e) {
						t = n;
						break;
					}
					if (t) {
						r.remove(t);
						let e = new Hr();
						return e.add(t), e;
					}
				}
				return r;
			}
			return c.isGroup || c.isObject3D ? c.clone() : null;
		}
		_findSingleMesh(e) {
			for (let t of e.children) if (t.isMesh) return e.remove(t), t;
			if (e.children.length === 1) {
				let t = e.children[0];
				if (t.children && t.children.length === 1) {
					let e = t.children[0];
					if (e.isMesh && !this._hasNonIdentityTransform(t)) return t.remove(e), e;
				}
			}
			return null;
		}
		_hasNonIdentityTransform(e) {
			let t = e.position, n = e.rotation, r = e.scale, i = t.x !== 0 || t.y !== 0 || t.z !== 0, a = n.x !== 0 || n.y !== 0 || n.z !== 0, o = r.x !== 1 || r.y !== 1 || r.z !== 1;
			return i || a || o;
		}
		_getBasePath(e) {
			let t = e.lastIndexOf("/");
			return t >= 0 ? e.slice(0, t) : "";
		}
		_getLocalVariantSelections(e) {
			let t = {};
			if (e.variantSelection) for (let n in e.variantSelection) t[n] = e.variantSelection[n];
			return t;
		}
		_getReferences(e) {
			let t = [];
			if (e.fields.references && e.fields.references.length > 0) {
				let n = e.fields.references[0];
				if (typeof n == "string") {
					let e = n.matchAll(/@([^@]+)@(?:<([^>]+)>)?/g);
					for (let n of e) t.push(n[0]);
				} else n.assetPath && t.push("@" + n.assetPath + "@");
			}
			if (t.length === 0 && e.fields.payload) {
				let n = e.fields.payload;
				typeof n == "string" ? t.push(n) : n.assetPath && t.push("@" + n.assetPath + "@");
			}
			return t;
		}
		_getAttributes(e) {
			let t = {};
			this._collectAttributesFromPath(e, t);
			let n = e.match(lh);
			if (n) {
				let r = n[1], i = n[4], a = this._getVariantPaths(r);
				for (let n of a) {
					if (e.startsWith(n)) continue;
					let r = n + "/" + i;
					this._collectAttributesFromPath(r, t);
				}
			} else {
				let n = e.split("/");
				for (let e = 1; e < n.length - 1; e++) {
					let r = n.slice(0, e + 1).join("/"), i = n.slice(e + 1).join("/"), a = this._getVariantPaths(r);
					for (let e of a) {
						let n = e + "/" + i;
						this._collectAttributesFromPath(n, t);
					}
				}
			}
			return t;
		}
		_collectAttributesFromPath(e, t) {
			let n = this.attributesByPrimPath.get(e);
			if (n) for (let [e, r] of n) {
				if (r.fields?.default !== void 0) t[e] = r.fields.default;
				else if (r.fields?.timeSamples) {
					let { times: n, values: i } = r.fields.timeSamples;
					if (n && i && n.length > 0) {
						let r = n.indexOf(0);
						t[e] = r >= 0 ? i[r] : i[0];
					}
				}
				r.fields?.elementSize !== void 0 && (t[e + ":elementSize"] = r.fields.elementSize), e.startsWith("primvars:") && r.fields?.typeName !== void 0 && (t[e + ":typeName"] = r.fields.typeName);
			}
		}
		_buildGeomPrimitive(e, t, n) {
			let r = this._getAttributes(e), i = e.split("/").pop(), a;
			switch (n) {
				case "Cube": {
					let e = r.size || 2;
					a = new _o(e, e, e);
					break;
				}
				case "Sphere": {
					let e = r.radius || 1;
					a = new To(e, 32, 16);
					break;
				}
				case "Cylinder": {
					let e = r.height || 2, t = r.radius || 1;
					a = new yo(t, t, e, 32);
					break;
				}
				case "Cone": {
					let e = r.height || 2, t = r.radius || 1;
					a = new bo(t, e, 32);
					break;
				}
				case "Capsule": {
					let e = r.height || 1, t = r.radius || .5;
					a = new vo(t, e, 16, 32);
					break;
				}
			}
			let o = r.axis || "Z";
			o === "X" ? a.rotateZ(-Math.PI / 2) : o === "Z" && a.rotateX(Math.PI / 2);
			let s = this._buildMaterial(e, t.fields), c = new ma(a, s);
			return c.name = i, this.applyTransform(c, t.fields, r), c;
		}
		_buildMesh(e, t) {
			let n = this._getAttributes(e), r = n["primvars:skel:jointIndices"], i = n["primvars:skel:jointWeights"], a = r && i && r.length > 0 && i.length > 0, o = this._getGeomSubsets(e), s, c;
			if (o.length > 0) {
				s = this._buildGeometryWithSubsets(n, o, a);
				let r = this._getMaterialPath(e, t.fields);
				c = o.map((e) => {
					let t = e.materialPath || r;
					return this._buildMaterialForPath(t);
				});
			} else s = this._buildGeometry(e, n, a), c = this._buildMaterial(e, t.fields);
			let l = n["primvars:displayColor"];
			if (l && l.length >= 3) {
				let e = (e) => {
					e.color && e.color.r === 1 && e.color.g === 1 && e.color.b === 1 && !e.map && e.color.setRGB(l[0], l[1], l[2], H);
				};
				Array.isArray(c) ? c.forEach(e) : e(c);
			}
			let u = n["primvars:displayOpacity"];
			if (u && u.length === 1 && o.length === 0) {
				let e = u[0], t = (t) => {
					e < 1 && t.opacity === 1 && t.transparent === !1 && (t.opacity = e, t.transparent = !0);
				};
				Array.isArray(c) ? c.forEach(t) : t(c);
			}
			let d;
			if (a) {
				d = new wa(s, c);
				let t = this.specsByPath[e + ".skel:skeleton"];
				t || (t = this.specsByPath[e + ".rel skel:skeleton"]);
				let r = null;
				t && (t.fields.targetPaths && t.fields.targetPaths.length > 0 ? r = t.fields.targetPaths[0] : t.fields.default && (r = t.fields.default.replace(/<|>/g, "")));
				let i = n["skel:joints"], a = n["primvars:skel:geomBindTransform"];
				this.skinnedMeshes.push({
					mesh: d,
					skeletonPath: r,
					path: e,
					localJoints: i,
					geomBindTransform: a
				});
			} else d = new ma(s, c);
			return d.name = e.split("/").pop(), this.applyTransform(d, t.fields, n), d;
		}
		_buildCamera(e) {
			let t = this._getAttributes(e), n = t.projection, r = typeof n == "string" ? n.toLowerCase() : dh.projection, i = t.clippingRange || dh.clippingRange, a = Math.max(2 ** -52, this._parseNumber(i[0], dh.clippingRange[0])), o = Math.max(a + 2 ** -52, this._parseNumber(i[1], dh.clippingRange[1])), s = this._parseNumber(t.horizontalAperture, dh.horizontalAperture), c = this._parseNumber(t.verticalAperture, dh.verticalAperture), l = this._parseNumber(t.horizontalApertureOffset, dh.horizontalApertureOffset), u = this._parseNumber(t.verticalApertureOffset, dh.verticalApertureOffset), d = this._parseNumber(t.focalLength, dh.focalLength), f = this._parseNumber(t.focusDistance, dh.focusDistance), p = this._parseNumber(t.fStop, dh.fStop), m;
			if (r === "orthographic") {
				let e = s / 10, t = c / 10, n = l / 10, r = u / 10;
				m = new ws(n - e * .5, n + e * .5, r + t * .5, r - t * .5, a, o);
			} else {
				let e = Math.max(2 ** -52, c), t = Math.max(2 ** -52, d), n = s / e, r = 2 * Math.atan(e / (2 * t)) * 180 / Math.PI;
				m = new ys(r, n, a, o), m.filmGauge = Math.max(s, c), m.filmOffset = l, m.focus = f, m.setFocalLength(t), u !== 0 && (m.userData.verticalApertureOffset = u);
			}
			return m.userData.fStop = p, m.userData.usdProjection = r, m;
		}
		_buildLight(e, t) {
			let n = this._getAttributes(e), r = this._parseNumber(n["inputs:intensity"], 1), i = n["inputs:color"] || [
				1,
				1,
				1
			], a = n["inputs:enableColorTemperature"] === !0, o = this._parseNumber(n["inputs:colorTemperature"], 6500), s = new J(i[0], i[1], i[2]);
			if (a) {
				let e = this._colorTemperature(o);
				s.multiply(e);
			}
			let c;
			switch (t) {
				case "DistantLight":
					c = new Es(s, r);
					break;
				case "SphereLight": {
					let e = this._parseNumber(n["shaping:cone:angle"], 0);
					if (e > 0) {
						let t = e * Math.PI / 180, i = this._parseNumber(n["shaping:cone:softness"], 0);
						c = new xs(s, r, 0, t, i);
					} else c = new Cs(s, r);
					break;
				}
				case "RectLight": {
					let e = this._parseNumber(n["inputs:width"], 1), t = this._parseNumber(n["inputs:height"], 1);
					c = new Os(s, r, e, t);
					break;
				}
				case "DiskLight": {
					let e = this._parseNumber(n["inputs:radius"], .5) * 2;
					c = new Os(s, r, e, e);
					break;
				}
			}
			return c;
		}
		_colorTemperature(e) {
			let t = e / 100, n, r, i;
			return t <= 66 ? (n = 1, r = .3900815787690196 * Math.log(t) - .6318414437886275) : (n = 1.292936186062745 * (t - 60) ** -.1332047592, r = 1.1298908608952942 * (t - 60) ** -.0755148492), i = t >= 66 ? 1 : t <= 19 ? 0 : .543206789110196 * Math.log(t - 10) - 1.19625408914, new J(Math.min(Math.max(n, 0), 1), Math.min(Math.max(r, 0), 1), Math.min(Math.max(i, 0), 1));
		}
		_parseNumber(e, t) {
			let n = Number(e);
			return Number.isFinite(n) ? n : t;
		}
		_getGeomSubsets(e) {
			let t = [], n = this.geomSubsetsByMeshPath.get(e);
			if (!n) return t;
			for (let e of n) {
				let n = this._getAttributes(e).indices;
				if (!n || n.length === 0) continue;
				let r = this._getMaterialBindingTarget(e);
				t.push({
					name: e.split("/").pop(),
					indices: n,
					materialPath: r
				});
			}
			return t;
		}
		_getMaterialBindingTarget(e) {
			let t = e + ".material:binding", n = this.specsByPath[t];
			if (n?.fields?.targetPaths?.length > 0) return n.fields.targetPaths[0];
			let r = e.split("/");
			for (let e = 1; e < r.length; e++) {
				let t = r.slice(0, e + 1).join("/"), n = r.slice(e + 1).join("/"), i = this._getVariantPaths(t);
				for (let e of i) {
					let t = n ? e + "/" + n + ".material:binding" : e + ".material:binding", r = this.specsByPath[t];
					if (r?.fields?.targetPaths?.length > 0) return r.fields.targetPaths[0];
				}
			}
			return null;
		}
		_buildGeometry(e, t, n = !1) {
			let r = new Hi(), i = t.points;
			if (!i || i.length === 0) return r;
			let a = t.faceVertexIndices, o = t.faceVertexCounts, s = t["primvars:arnold:polygon_holes"], c = this._buildHoleMap(s), l = a, u = null;
			if (o && o.length > 0) {
				let e = this._triangulateIndicesWithPattern(a, o, i, c);
				l = e.indices, u = e.pattern;
			}
			let d = i;
			l && l.length > 0 && (d = this._expandAttribute(i, l, 3)), r.setAttribute("position", new Di(new Float32Array(d), 3));
			let f = t.normals || t["primvars:normals"], p = t["normals:indices"] || t["primvars:normals:indices"];
			if (f && f.length > 0) {
				let e = f;
				if (p && p.length > 0 && u) {
					let t = this._applyTriangulationPattern(p, u);
					e = this._expandAttribute(f, t, 3);
				} else if (f.length === i.length) l && l.length > 0 && (e = this._expandAttribute(f, l, 3));
				else if (u) {
					let t = this._applyTriangulationPattern(Array.from({ length: f.length / 3 }, (e, t) => t), u);
					e = this._expandAttribute(f, t, 3);
				}
				r.setAttribute("normal", new Di(new Float32Array(e), 3));
			} else {
				let e = this._computeVertexNormals(i, l);
				r.setAttribute("normal", new Di(new Float32Array(this._expandAttribute(e, l, 3)), 3));
			}
			let { uvs: m, uvIndices: h } = this._findUVPrimvar(t), g = a ? a.length : 0;
			if (m && m.length > 0) {
				let e = m;
				if (h && h.length > 0 && u) {
					let t = this._applyTriangulationPattern(h, u);
					e = this._expandAttribute(m, t, 2);
				} else if (l && m.length / 2 == i.length / 3) e = this._expandAttribute(m, l, 2);
				else if (u && m.length / 2 === g) {
					let t = this._applyTriangulationPattern(Array.from({ length: g }, (e, t) => t), u);
					e = this._expandAttribute(m, t, 2);
				}
				r.setAttribute("uv", new Di(new Float32Array(e), 2));
			}
			let { uvs2: _, uv2Indices: v } = this._findUV2Primvar(t);
			if (_ && _.length > 0) {
				let e = _;
				if (v && v.length > 0 && u) {
					let t = this._applyTriangulationPattern(v, u);
					e = this._expandAttribute(_, t, 2);
				} else if (l && _.length / 2 == i.length / 3) e = this._expandAttribute(_, l, 2);
				else if (u && _.length / 2 === g) {
					let t = this._applyTriangulationPattern(Array.from({ length: g }, (e, t) => t), u);
					e = this._expandAttribute(_, t, 2);
				}
				r.setAttribute("uv1", new Di(new Float32Array(e), 2));
			}
			if (n) {
				let e = t["primvars:skel:jointIndices"], n = t["primvars:skel:jointWeights"], i = t["primvars:skel:jointIndices:elementSize"] || 4;
				if (e && n) {
					let t = d.length / 3, a, o;
					l && l.length > 0 ? (a = this._expandAttribute(e, l, i), o = this._expandAttribute(n, l, i)) : (a = e, o = n);
					let s = new Uint16Array(t * 4), c = new Float32Array(t * 4);
					this._selectTopWeights(a, o, i, t, s, c), r.setAttribute("skinIndex", new Di(s, 4)), r.setAttribute("skinWeight", new Di(c, 4));
				}
			}
			return r;
		}
		_buildGeometryWithSubsets(e, t, n = !1) {
			let r = new Hi(), i = e.points;
			if (!i || i.length === 0) return r;
			let a = e.faceVertexIndices, o = e.faceVertexCounts;
			if (!o || o.length === 0) return r;
			let s = e["primvars:arnold:polygon_holes"], c = this._buildHoleMap(s), l = c.holeFaces, u = c.parentToHoles, { uvs: d, uvIndices: f } = this._findUVPrimvar(e), { uvs2: p, uv2Indices: m } = this._findUV2Primvar(e), h = e.normals || e["primvars:normals"], g = e["normals:indices"] || e["primvars:normals:indices"], _ = n ? e["primvars:skel:jointIndices"] : null, v = n ? e["primvars:skel:jointWeights"] : null, y = e["primvars:skel:jointIndices:elementSize"] || 4, b = [], x = 0;
			for (let e = 0; e < o.length; e++) {
				if (b.push(x), l.has(e)) continue;
				let t = o[e], n = u.get(e);
				if (n && n.length > 0) {
					let e = t;
					for (let t of n) e += o[t];
					x += e - 2;
				} else t >= 3 && (x += t - 2);
			}
			let S = new Int32Array(x).fill(-1);
			for (let e = 0; e < t.length; e++) {
				let n = t[e];
				for (let t = 0; t < n.indices.length; t++) {
					let r = n.indices[t];
					if (r >= o.length) continue;
					let i = b[r], a = o[r] - 2;
					for (let t = 0; t < a; t++) S[i + t] = e;
				}
			}
			let C = [];
			for (let e = 0; e < x; e++) C.push({
				original: e,
				subset: S[e]
			});
			C.sort((e, t) => e.subset - t.subset);
			let w = [], T = C.length > 0 ? C[0].subset : -1, E = 0;
			for (let e = 0; e < C.length; e++) C[e].subset !== T && (T >= 0 && w.push({
				start: E * 3,
				count: (e - E) * 3,
				materialIndex: T
			}), T = C[e].subset, E = e);
			T >= 0 && C.length > E && w.push({
				start: E * 3,
				count: (C.length - E) * 3,
				materialIndex: T
			});
			for (let e of w) r.addGroup(e.start, e.count, e.materialIndex);
			let { indices: D, pattern: O } = this._triangulateIndicesWithPattern(a, o, i, c), k = o.reduce((e, t) => e + t, 0), A = d && !f && d.length / 2 === k || p && !m && p.length / 2 === k ? this._applyTriangulationPattern(Array.from({ length: k }, (e, t) => t), O) : null, j = f ? this._applyTriangulationPattern(f, O) : d && d.length / 2 === k ? A : null, M = m ? this._applyTriangulationPattern(m, O) : p && p.length / 2 === k ? A : null, ee = h && g && g.length > 0, te = h && h.length / 3 === k, N = ee ? this._applyTriangulationPattern(g, O) : te ? this._applyTriangulationPattern(Array.from({ length: k }, (e, t) => t), O) : null, ne = !h && D.length > 0 ? this._computeVertexNormals(i, D) : null, P = x * 3, F = new Float32Array(P * 3), re = d ? new Float32Array(P * 2) : null, ie = p ? new Float32Array(P * 2) : null, I = h || ne ? new Float32Array(P * 3) : null, ae = _ ? new Uint16Array(P * y) : null, oe = v ? new Float32Array(P * y) : null;
			for (let e = 0; e < C.length; e++) {
				let t = C[e].original;
				for (let n = 0; n < 3; n++) {
					let r = t * 3 + n, a = e * 3 + n, o = D[r];
					if (F[a * 3] = i[o * 3], F[a * 3 + 1] = i[o * 3 + 1], F[a * 3 + 2] = i[o * 3 + 2], re && d) {
						if (j) {
							let e = j[r];
							re[a * 2] = d[e * 2], re[a * 2 + 1] = d[e * 2 + 1];
						} else d.length / 2 == i.length / 3 && (re[a * 2] = d[o * 2], re[a * 2 + 1] = d[o * 2 + 1]);
					}
					if (ie && p) {
						if (M) {
							let e = M[r];
							ie[a * 2] = p[e * 2], ie[a * 2 + 1] = p[e * 2 + 1];
						} else p.length / 2 == i.length / 3 && (ie[a * 2] = p[o * 2], ie[a * 2 + 1] = p[o * 2 + 1]);
					}
					if (I) {
						if (h && N) {
							let e = N[r];
							I[a * 3] = h[e * 3], I[a * 3 + 1] = h[e * 3 + 1], I[a * 3 + 2] = h[e * 3 + 2];
						} else h && h.length === i.length ? (I[a * 3] = h[o * 3], I[a * 3 + 1] = h[o * 3 + 1], I[a * 3 + 2] = h[o * 3 + 2]) : ne && (I[a * 3] = ne[o * 3], I[a * 3 + 1] = ne[o * 3 + 1], I[a * 3 + 2] = ne[o * 3 + 2]);
					}
					if (ae && oe && _ && v) for (let e = 0; e < y; e++) ae[a * y + e] = _[o * y + e] || 0, oe[a * y + e] = v[o * y + e] || 0;
				}
			}
			if (r.setAttribute("position", new Di(F, 3)), re && r.setAttribute("uv", new Di(re, 2)), ie && r.setAttribute("uv1", new Di(ie, 2)), r.setAttribute("normal", new Di(I, 3)), ae && oe) {
				let e = new Uint16Array(P * 4), t = new Float32Array(P * 4);
				this._selectTopWeights(ae, oe, y, P, e, t), r.setAttribute("skinIndex", new Di(e, 4)), r.setAttribute("skinWeight", new Di(t, 4));
			}
			return r;
		}
		_selectTopWeights(e, t, n, r, i, a) {
			if (n <= 4) {
				for (let o = 0; o < r; o++) for (let r = 0; r < 4; r++) r < n ? (i[o * 4 + r] = e[o * n + r] || 0, a[o * 4 + r] = t[o * n + r] || 0) : (i[o * 4 + r] = 0, a[o * 4 + r] = 0);
				return;
			}
			let o = new Uint32Array(n);
			for (let s = 0; s < r; s++) {
				let r = s * n;
				for (let e = 0; e < n; e++) o[e] = e;
				for (let e = 0; e < 4; e++) {
					let i = e, a = t[r + o[e]] || 0;
					for (let s = e + 1; s < n; s++) {
						let e = t[r + o[s]] || 0;
						e > a && (a = e, i = s);
					}
					if (i !== e) {
						let t = o[e];
						o[e] = o[i], o[i] = t;
					}
				}
				let c = 0;
				for (let e = 0; e < 4; e++) c += t[r + o[e]] || 0;
				for (let n = 0; n < 4; n++) {
					let l = o[n];
					c > 0 ? (i[s * 4 + n] = e[r + l] || 0, a[s * 4 + n] = (t[r + l] || 0) / c) : (i[s * 4 + n] = 0, a[s * 4 + n] = 0);
				}
			}
		}
		_findUVPrimvar(e) {
			for (let t in e) {
				if (!t.startsWith("primvars:") || t.endsWith(":typeName") || t.endsWith(":elementSize") || t.endsWith(":indices") || t.includes("skel:")) continue;
				let n = e[t + ":typeName"];
				if (n && n.includes("texCoord")) return {
					uvs: e[t],
					uvIndices: e[t + ":indices"]
				};
			}
			return {
				uvs: e["primvars:st"] || e["primvars:UVMap"],
				uvIndices: e["primvars:st:indices"]
			};
		}
		_findUV2Primvar(e) {
			return {
				uvs2: e["primvars:st1"],
				uv2Indices: e["primvars:st1:indices"]
			};
		}
		_buildHoleMap(e) {
			if (!e || e.length === 0) return {
				parentToHoles: /* @__PURE__ */ new Map(),
				holeFaces: /* @__PURE__ */ new Set()
			};
			let t = /* @__PURE__ */ new Map(), n = /* @__PURE__ */ new Set();
			for (let r = 0; r < e.length; r += 2) {
				let i = e[r], a = e[r + 1];
				n.add(i), t.has(a) || t.set(a, []), t.get(a).push(i);
			}
			return {
				parentToHoles: t,
				holeFaces: n
			};
		}
		_triangulateIndicesWithPattern(e, t, n = null, r = null) {
			let i = [], a = [], o = [], s = 0;
			for (let e = 0; e < t.length; e++) o.push(s), s += t[e];
			let c = r?.parentToHoles || /* @__PURE__ */ new Map(), l = r?.holeFaces || /* @__PURE__ */ new Set(), u = 0;
			for (let r = 0; r < t.length; r++) {
				let s = t[r];
				if (l.has(r)) {
					u += s;
					continue;
				}
				let d = c.get(r);
				if (d && d.length > 0 && n && n.length > 0) {
					let r = /* @__PURE__ */ new Map(), c = [];
					for (let t = 0; t < s; t++) {
						let n = e[u + t];
						c.push(n), r.set(n, u + t);
					}
					let l = [];
					for (let n of d) {
						let i = o[n], a = t[n], s = [];
						for (let t = 0; t < a; t++) {
							let n = e[i + t];
							s.push(n), r.set(n, i + t);
						}
						l.push(s);
					}
					let f = this._triangulateNGonWithHoles(c, l, n);
					for (let e of f) i.push(e[0], e[1], e[2]), a.push(r.get(e[0]), r.get(e[1]), r.get(e[2]));
				} else if (s === 3) i.push(e[u], e[u + 1], e[u + 2]), a.push(u, u + 1, u + 2);
				else if (s === 4) i.push(e[u], e[u + 1], e[u + 2], e[u], e[u + 2], e[u + 3]), a.push(u, u + 1, u + 2, u, u + 2, u + 3);
				else if (s > 4) {
					if (n && n.length > 0) {
						let t = [];
						for (let n = 0; n < s; n++) t.push(e[u + n]);
						let r = this._triangulateNGon(t, n);
						for (let e of r) i.push(e[0], e[1], e[2]), a.push(u + t.indexOf(e[0]), u + t.indexOf(e[1]), u + t.indexOf(e[2]));
					} else for (let t = 1; t < s - 1; t++) i.push(e[u], e[u + t], e[u + t + 1]), a.push(u, u + t, u + t + 1);
				}
				u += s;
			}
			return {
				indices: i,
				pattern: a
			};
		}
		_applyTriangulationPattern(e, t) {
			let n = [];
			for (let r = 0; r < t.length; r++) n.push(e[t[r]]);
			return n;
		}
		_triangulateNGon(e, t) {
			let n = [], r = [];
			for (let n of e) r.push(new W(t[n * 3], t[n * 3 + 1], t[n * 3 + 2]));
			let i = new W();
			for (let e = 0; e < r.length; e++) {
				let t = r[e], n = r[(e + 1) % r.length];
				i.x += (t.y - n.y) * (t.z + n.z), i.y += (t.z - n.z) * (t.x + n.x), i.z += (t.x - n.x) * (t.y + n.y);
			}
			i.normalize();
			let a = new W(), o = new W();
			Math.abs(i.y) > .9 ? a.set(1, 0, 0) : a.set(0, 1, 0), o.crossVectors(i, a).normalize(), a.crossVectors(o, i).normalize();
			for (let e of r) n.push(new U(e.dot(a), e.dot(o)));
			let s = Co.triangulateShape(n, []), c = [];
			for (let t of s) c.push([
				e[t[0]],
				e[t[1]],
				e[t[2]]
			]);
			return c;
		}
		_triangulateNGonWithHoles(e, t, n) {
			let r = [];
			for (let t of e) r.push(new W(n[t * 3], n[t * 3 + 1], n[t * 3 + 2]));
			let i = new W();
			for (let e = 0; e < r.length; e++) {
				let t = r[e], n = r[(e + 1) % r.length];
				i.x += (t.y - n.y) * (t.z + n.z), i.y += (t.z - n.z) * (t.x + n.x), i.z += (t.x - n.x) * (t.y + n.y);
			}
			i.normalize();
			let a = new W(), o = new W();
			Math.abs(i.y) > .9 ? a.set(1, 0, 0) : a.set(0, 1, 0), o.crossVectors(i, a).normalize(), a.crossVectors(o, i).normalize();
			let s = [];
			for (let e of r) s.push(new U(e.dot(a), e.dot(o)));
			let c = [];
			for (let e of t) {
				let t = [];
				for (let r of e) {
					let e = new W(n[r * 3], n[r * 3 + 1], n[r * 3 + 2]);
					t.push(new U(e.dot(a), e.dot(o)));
				}
				c.push(t);
			}
			let l = [...e];
			for (let e of t) l.push(...e);
			let u = Co.triangulateShape(s, c), d = [];
			for (let e of u) d.push([
				l[e[0]],
				l[e[1]],
				l[e[2]]
			]);
			return d;
		}
		_triangulateIndices(e, t) {
			let n = [], r = 0;
			for (let i = 0; i < t.length; i++) {
				let a = t[i];
				if (a === 3) n.push(e[r], e[r + 1], e[r + 2]);
				else if (a === 4) n.push(e[r], e[r + 1], e[r + 2], e[r], e[r + 2], e[r + 3]);
				else if (a > 4) for (let t = 1; t < a - 1; t++) n.push(e[r], e[r + t], e[r + t + 1]);
				r += a;
			}
			return n;
		}
		_expandAttribute(e, t, n) {
			let r = Array(t.length * n);
			for (let i = 0; i < t.length; i++) {
				let a = t[i];
				for (let t = 0; t < n; t++) r[i * n + t] = e[a * n + t];
			}
			return r;
		}
		_computeVertexNormals(e, t) {
			let n = e.length / 3, r = new Float32Array(n * 3);
			for (let n = 0; n < t.length; n += 3) {
				let i = t[n], a = t[n + 1], o = t[n + 2], s = e[i * 3], c = e[i * 3 + 1], l = e[i * 3 + 2], u = e[a * 3], d = e[a * 3 + 1], f = e[a * 3 + 2], p = e[o * 3], m = e[o * 3 + 1], h = e[o * 3 + 2], g = u - s, _ = d - c, v = f - l, y = p - s, b = m - c, x = h - l, S = _ * x - v * b, C = v * y - g * x, w = g * b - _ * y;
				r[i * 3] += S, r[i * 3 + 1] += C, r[i * 3 + 2] += w, r[a * 3] += S, r[a * 3 + 1] += C, r[a * 3 + 2] += w, r[o * 3] += S, r[o * 3 + 1] += C, r[o * 3 + 2] += w;
			}
			for (let e = 0; e < n; e++) {
				let t = r[e * 3], n = r[e * 3 + 1], i = r[e * 3 + 2], a = Math.sqrt(t * t + n * n + i * i);
				a > 0 && (r[e * 3] /= a, r[e * 3 + 1] /= a, r[e * 3 + 2] /= a);
			}
			return r;
		}
		_getMaterialPath(e, t) {
			let n = null, r = t["material:binding"];
			return r && (n = Array.isArray(r) ? r[0] : r), n || (n = this._getMaterialBindingTarget(e)), n;
		}
		_buildMaterial(e, t) {
			let n = new Mo(), r = null, i = t["material:binding"];
			if (i && (r = Array.isArray(i) ? i[0] : i), r || (r = this._getMaterialBindingTarget(e)), !r) {
				let t = [], n = e + "/";
				for (let e in this.specsByPath) {
					if (!e.startsWith(n) || !e.endsWith(".material:binding")) continue;
					let r = this.specsByPath[e];
					if (!r) continue;
					let i = r.fields.targetPaths;
					i && i.length > 0 && t.push(i[0]);
				}
				t.length > 0 && (r = this._pickBestMaterial(t));
			}
			if (!r) {
				let t = "/" + e.split("/")[1], n = this.materialsByRoot.get(t);
				if (n) {
					for (let e of n) if (e.startsWith(t + "/Looks/") || e.startsWith(t + "/Materials/")) {
						r = e;
						break;
					}
				}
			}
			return r && this._applyMaterial(n, r), n;
		}
		_buildMaterialForPath(e) {
			let t = new Mo();
			return e && this._applyMaterial(t, e), t;
		}
		_applyMaterialBinding(e, t) {
			let n = t + ".material:binding", r = this.specsByPath[n];
			if (!r) return;
			let i = null, a = r.fields?.targetPaths || r.fields?.default;
			if (a && (i = Array.isArray(a) ? a[0] : a), !i) return;
			i = String(i).replace(/^<|>$/g, "");
			let o = new Mo();
			this._applyMaterial(o, i), e.material = o;
		}
		_pickBestMaterial(e) {
			for (let t of e) {
				let e = this.shadersByMaterialPath.get(t);
				if (e) for (let n of e) {
					let e = this._getAttributes(n);
					if (e["info:id"] === "UsdUVTexture" && e["inputs:file"]) return t;
				}
			}
			return e[0];
		}
		_applyMaterial(e, t) {
			if (!this.specsByPath[t]) return;
			let n = this.shadersByMaterialPath.get(t);
			if (n) for (let t of n) {
				let n = this.specsByPath[t];
				if (!n) continue;
				let r = this._getAttributes(t)["info:id"] || n.fields["info:id"];
				r === "UsdPreviewSurface" || r === "ND_UsdPreviewSurface_surfaceshader" ? this._applyPreviewSurface(e, t) : r === "arnold:openpbr_surface" && this._applyOpenPBRSurface(e, t);
			}
		}
		_applyTextureOrValue(e, t, n, r, i, a, o, s) {
			let c = t + "." + r, l = this.specsByPath[c];
			if (l && l.fields.connectionPaths && l.fields.connectionPaths.length > 0) {
				let t = s === this._getTextureFromOpenPBRConnection ? l.fields.connectionPaths : [l.fields.connectionPaths[0]];
				for (let n of t) {
					let t = s.call(this, n);
					if (t) return t.colorSpace = a, e[i] = t, !0;
				}
			}
			return n[r] !== void 0 && o && o(n[r]), !1;
		}
		_applyPreviewSurface(e, t) {
			let n = this._getAttributes(t), r = (r, i, a, o) => this._applyTextureOrValue(e, t, n, r, i, a, o, this._getTextureFromConnection), i = (e) => {
				let n = t + "." + e;
				return this.specsByPath[n];
			};
			if (r("inputs:diffuseColor", "map", H, (t) => {
				Array.isArray(t) && t.length >= 3 && e.color.setRGB(t[0], t[1], t[2], H);
			}), e.map && e.map.userData.scale) {
				let t = e.map.userData.scale;
				Array.isArray(t) && t.length >= 3 && e.color.setRGB(t[0], t[1], t[2], H);
			}
			if (r("inputs:emissiveColor", "emissiveMap", H, (t) => {
				Array.isArray(t) && t.length >= 3 && e.emissive.setRGB(t[0], t[1], t[2], H);
			}), e.emissiveMap) {
				if (e.emissiveMap.userData.scale) {
					let t = e.emissiveMap.userData.scale;
					Array.isArray(t) && t.length >= 3 && e.emissive.setRGB(t[0], t[1], t[2], H);
				} else e.emissive.set(16777215);
			}
			if (r("inputs:normal", "normalMap", "", null), e.normalMap && e.normalMap.userData.scale) {
				let t = e.normalMap.userData.scale;
				e.normalScale = new U(t[0], t[1]);
			}
			if (r("inputs:roughness", "roughnessMap", "", (t) => {
				e.roughness = t;
			}) && (e.roughness = 1), r("inputs:metallic", "metalnessMap", "", (t) => {
				e.metalness = t;
			}) && (e.metalness = 1), r("inputs:occlusion", "aoMap", "", null), n["inputs:ior"] !== void 0 && (e.ior = n["inputs:ior"]), r("inputs:specularColor", "specularColorMap", H, (t) => {
				Array.isArray(t) && t.length >= 3 && e.specularColor.setRGB(t[0], t[1], t[2], H);
			}), e.specularColorMap && e.specularColorMap.userData.scale) {
				let t = e.specularColorMap.userData.scale;
				Array.isArray(t) && t.length >= 3 && e.specularColor.setRGB(t[0], t[1], t[2], H);
			}
			n["inputs:clearcoat"] !== void 0 && (e.clearcoat = n["inputs:clearcoat"]), n["inputs:clearcoatRoughness"] !== void 0 && (e.clearcoatRoughness = n["inputs:clearcoatRoughness"]);
			let a = n["inputs:opacityThreshold"] === void 0 ? 0 : n["inputs:opacityThreshold"];
			if (i("inputs:opacity")?.fields?.connectionPaths?.length > 0) a > 0 ? (e.alphaTest = a, e.transparent = !1) : e.transparent = !0;
			else {
				let t = n["inputs:opacity"] === void 0 ? 1 : n["inputs:opacity"];
				t < 1 && (e.transparent = !0, e.opacity = t);
			}
		}
		_applyOpenPBRSurface(e, t) {
			let n = this._getAttributes(t), r = (r, i, a, o) => this._applyTextureOrValue(e, t, n, r, i, a, o, this._getTextureFromOpenPBRConnection);
			if (r("inputs:base_color", "map", H, (t) => {
				Array.isArray(t) && t.length >= 3 && e.color.setRGB(t[0], t[1], t[2], H);
			}), e.map && e.map.userData.scale) {
				let t = e.map.userData.scale;
				Array.isArray(t) && t.length >= 3 && e.color.setRGB(t[0], t[1], t[2], H);
			}
			r("inputs:base_metalness", "metalnessMap", "", (t) => {
				typeof t == "number" && (e.metalness = t);
			}), r("inputs:specular_roughness", "roughnessMap", "", (t) => {
				typeof t == "number" && (e.roughness = t);
			});
			let i = r("inputs:emission_color", "emissiveMap", H, (t) => {
				Array.isArray(t) && t.length >= 3 && e.emissive.setRGB(t[0], t[1], t[2], H);
			}), a = n["inputs:emission_luminance"];
			a !== void 0 && a > 0 && (i ? e.emissiveIntensity = a : e.emissive.multiplyScalar(a));
			let o = n["inputs:transmission_weight"];
			if (o !== void 0 && o > 0) {
				e.transmission = o;
				let t = n["inputs:transmission_depth"];
				t !== void 0 && (e.thickness = t);
				let r = n["inputs:transmission_color"];
				r !== void 0 && Array.isArray(r) && (e.attenuationColor.setRGB(r[0], r[1], r[2]), e.attenuationDistance = t || 1);
			}
			let s = n["inputs:geometry_opacity"];
			s !== void 0 && s < 1 && (e.opacity = s, e.transparent = !0);
			let c = n["inputs:specular_ior"];
			c !== void 0 && (e.ior = c);
			let l = n["inputs:coat_weight"];
			if (l !== void 0 && l > 0) {
				e.clearcoat = l;
				let t = n["inputs:coat_roughness"];
				t !== void 0 && (e.clearcoatRoughness = t);
			}
			let u = n["inputs:thin_film_weight"];
			if (u !== void 0 && u > 0) {
				e.iridescence = u;
				let t = n["inputs:thin_film_ior"];
				t !== void 0 && (e.iridescenceIOR = t);
				let r = n["inputs:thin_film_thickness"];
				if (r !== void 0) {
					let t = r * 1e3;
					e.iridescenceThicknessRange = [t, t];
				}
			}
			let d = n["inputs:specular_weight"];
			d !== void 0 && (e.specularIntensity = d);
			let f = n["inputs:specular_color"];
			f !== void 0 && Array.isArray(f) && e.specularColor.setRGB(f[0], f[1], f[2]);
			let p = n["inputs:specular_roughness_anisotropy"];
			p !== void 0 && p > 0 && (e.anisotropy = p), r("inputs:geometry_normal", "normalMap", "", null);
		}
		_getTextureFromOpenPBRConnection(e) {
			let t = e.replace(/<|>/g, ""), n = t.split(".")[0], r = this.specsByPath[n];
			if (!r) return null;
			let i = this._getAttributes(n), a = i["info:id"] || r.fields["info:id"];
			if (r.fields.typeName === "NodeGraph") {
				let e = t.split(".")[1], r = n + "." + e, i = this.specsByPath[r];
				return i?.fields?.connectionPaths?.length > 0 ? this._getTextureFromOpenPBRConnection(i.fields.connectionPaths[0]) : null;
			}
			if (a === "arnold:image") {
				let e = i["inputs:filename"];
				return e ? this._loadTextureFromPath(e) : null;
			}
			if (a && a.startsWith("ND_image_")) {
				let e = i["inputs:file"];
				return e ? this._loadTextureFromPath(e) : null;
			}
			if (a === "MayaND_fileTexture_color4") {
				let e = n + ".inputs:inColor", t = this.specsByPath[e];
				return t?.fields?.connectionPaths?.length > 0 ? this._getTextureFromOpenPBRConnection(t.fields.connectionPaths[0]) : null;
			}
			if (a && a.startsWith("ND_convert_")) {
				let e = n + ".inputs:in", t = this.specsByPath[e];
				return t?.fields?.connectionPaths?.length > 0 ? this._getTextureFromOpenPBRConnection(t.fields.connectionPaths[0]) : null;
			}
			if (a === "arnold:bump2d") {
				let e = n + ".inputs:bump_map", t = this.specsByPath[e];
				return t?.fields?.connectionPaths?.length > 0 ? this._getTextureFromOpenPBRConnection(t.fields.connectionPaths[0]) : null;
			}
			if (a === "arnold:color_correct") {
				let e = n + ".inputs:input", t = this.specsByPath[e];
				return t?.fields?.connectionPaths?.length > 0 ? this._getTextureFromOpenPBRConnection(t.fields.connectionPaths[0]) : null;
			}
			let o = n.substring(0, n.lastIndexOf("/"));
			if (o) {
				let e = this.specsByPath[o];
				if (e) {
					let t = this._getAttributes(o);
					if ((t["info:id"] || e.fields["info:id"]) === "arnold:image") {
						let e = t["inputs:filename"];
						if (e) return this._loadTextureFromPath(e);
					}
				}
			}
			return null;
		}
		_loadTextureFromPath(e) {
			if (!e) return null;
			if (this.textureCache[e]) return this.textureCache[e];
			let t = this._loadTexture(e, null, null);
			return t && (this.textureCache[e] = t), t;
		}
		_getTextureFromConnection(e) {
			let t = e.split(".")[0], n = this.specsByPath[t];
			if (!n) return null;
			let r = this._getAttributes(t);
			if ((r["info:id"] || n.fields["info:id"]) !== "UsdUVTexture") return null;
			let i = r["inputs:file"];
			if (!i) return null;
			let a = null, o = 0, s = t + ".inputs:st", c = this.specsByPath[s];
			if (c?.fields?.connectionPaths?.length > 0) {
				let e = c.fields.connectionPaths[0].replace(/<|>/g, "").split(".")[0], t = this.specsByPath[e];
				if (t) {
					let n = this._getAttributes(e), r = n["info:id"] || t.fields["info:id"];
					if (r === "UsdTransform2d") {
						a = n;
						let t = e + ".inputs:in", r = this.specsByPath[t];
						if (r?.fields?.connectionPaths?.length > 0) {
							let e = r.fields.connectionPaths[0].replace(/<|>/g, "").split(".")[0], t = this._getAttributes(e)["inputs:varname"];
							t === "st1" ? o = 1 : t === "st2" && (o = 2);
						}
					} else if (r === "UsdPrimvarReader_float2") {
						let e = n["inputs:varname"];
						e === "st1" ? o = 1 : e === "st2" && (o = 2);
					}
				}
			}
			let l = r["inputs:scale"], u = r["inputs:bias"], d = i;
			if (l && (d += ":s" + l.join(",")), u && (d += ":b" + u.join(",")), this.textureCache[d]) return this.textureCache[d];
			let f = this._loadTexture(i, r, a);
			return f && (l && (f.userData.scale = l), u && (f.userData.bias = u), o !== 0 && (f.channel = o), this.textureCache[d] = f), f;
		}
		_applyTextureTransforms(e, t) {
			if (!t) return;
			let n = t["inputs:scale"];
			n && Array.isArray(n) && n.length >= 2 && e.repeat.set(n[0], n[1]);
			let r = t["inputs:translation"];
			r && Array.isArray(r) && r.length >= 2 && e.offset.set(r[0], r[1]);
			let i = t["inputs:rotation"];
			typeof i == "number" && (e.rotation = i * Math.PI / 180);
		}
		_loadTexture(e, t, n) {
			let r = e;
			r.startsWith("@") && (r = r.slice(1)), r.endsWith("@") && (r = r.slice(0, -1));
			let i = this._resolveFilePath(r), a = this.assets[i];
			if (a || (a = this.assets[r]), !a) {
				let e = r.split("/").pop();
				for (let r in this.assets) if (r.endsWith(e) || r.endsWith("/" + e)) return this._createTextureFromData(this.assets[r], t, n);
				if (this.basePath) return this._createTextureFromData(i, t, n);
				if (this.manager) {
					let r = this.manager.resolveURL(e);
					if (r !== e) return this._createTextureFromData(r, t, n);
				}
				return console.warn("USDLoader: Texture not found:", r), null;
			}
			return this._createTextureFromData(a, t, n);
		}
		_createTextureFromData(e, t, n) {
			if (!e) return null;
			let r = this, i = new lr(), a;
			if (typeof e == "string") a = e;
			else if (e instanceof Uint8Array || e instanceof ArrayBuffer) {
				let t = new Blob([e]);
				a = URL.createObjectURL(t);
			} else return null;
			let o = new Image();
			return this.texturePromises.push(new Promise((s) => {
				o.onload = function() {
					i.image = o, t && (i.wrapS = r._getWrapMode(t["inputs:wrapS"]), i.wrapT = r._getWrapMode(t["inputs:wrapT"])), r._applyTextureTransforms(i, n), i.needsUpdate = !0, typeof e != "string" && URL.revokeObjectURL(a), s();
				}, o.onerror = function() {
					console.warn("USDLoader: Failed to load texture:", a), typeof e != "string" && URL.revokeObjectURL(a), s();
				};
			})), o.src = a, i;
		}
		_getWrapMode(e) {
			return e === "repeat" ? lt : e === "mirror" ? dt : e === "clamp" ? ut : lt;
		}
		_buildSkeleton(e) {
			let t = this._getAttributes(e), n = t.joints;
			if (!n || n.length === 0) return null;
			let r = t.bindTransforms, i = t.restTransforms, a = this._flattenMatrixArray(r, n.length), o = this._flattenMatrixArray(i, n.length), s = [], c = {}, l = [];
			for (let e = 0; e < n.length; e++) {
				let t = n[e], r = t.split("/").pop(), i = new Ta();
				if (i.name = r, s.push(i), c[t] = {
					bone: i,
					index: e
				}, a && a.length >= (e + 1) * 16) {
					let t = new q(), n = a.slice(e * 16, (e + 1) * 16);
					t.set(n[0], n[4], n[8], n[12], n[1], n[5], n[9], n[13], n[2], n[6], n[10], n[14], n[3], n[7], n[11], n[15]);
					let r = t.clone().invert();
					l.push(r);
				} else l.push(new q());
			}
			for (let e = 0; e < n.length; e++) {
				let t = n[e].split("/");
				if (t.length > 1) {
					let n = c[t.slice(0, -1).join("/")];
					n && n.bone.add(s[e]);
				}
			}
			if (o && o.length >= n.length * 16) for (let e = 0; e < n.length; e++) {
				let t = new q(), n = o.slice(e * 16, (e + 1) * 16);
				t.set(n[0], n[4], n[8], n[12], n[1], n[5], n[9], n[13], n[2], n[6], n[10], n[14], n[3], n[7], n[11], n[15]), t.decompose(s[e].position, s[e].quaternion, s[e].scale);
			}
			let u = s.filter((e) => !e.parent || !e.parent.isBone), d = this.specsByPath[e + ".skel:animationSource"], f = null;
			return d && d.fields.targetPaths && d.fields.targetPaths.length > 0 && (f = d.fields.targetPaths[0]), {
				skeleton: new ka(s, l),
				joints: n,
				rootBones: u,
				animationPath: f,
				path: e
			};
		}
		_bindSkeletons() {
			for (let e of this.skinnedMeshes) {
				let { mesh: t, skeletonPath: n, localJoints: r, geomBindTransform: i } = e, a = null;
				if (n && this.skeletons[n] && (a = this.skeletons[n]), !a) {
					for (let e in this.skeletons) if (n && (n.includes(e) || e.includes(n))) {
						a = this.skeletons[e];
						break;
					}
				}
				if (!a) {
					let e = Object.keys(this.skeletons);
					e.length > 0 && (a = this.skeletons[e[0]]);
				}
				if (!a) {
					console.warn("USDComposer: No skeleton found for skinned mesh", t.name);
					continue;
				}
				let { skeleton: o, rootBones: s, joints: c } = a;
				if (r && r.length > 0) {
					let e = t.geometry.attributes.skinIndex;
					if (e) {
						let t = [];
						for (let e = 0; e < r.length; e++) {
							let n = r[e], i = c.indexOf(n);
							t[e] = i >= 0 ? i : 0;
						}
						let n = e.array;
						for (let e = 0; e < n.length; e++) {
							let r = n[e];
							r < t.length && (n[e] = t[r]);
						}
					}
				}
				for (let e of s) t.add(e);
				let l = new q();
				if (i && i.length === 16) {
					let e = i;
					l.set(e[0], e[4], e[8], e[12], e[1], e[5], e[9], e[13], e[2], e[6], e[10], e[14], e[3], e[7], e[11], e[15]);
				}
				t.bind(o, l);
			}
		}
		_buildAnimations() {
			let e = [];
			for (let t in this.specsByPath) {
				let n = this.specsByPath[t];
				if (n.specType !== uh.Prim || n.fields.typeName !== "SkelAnimation") continue;
				let r = this._buildAnimationClip(t);
				r && e.push(r);
			}
			let t = this._buildTransformAnimations();
			return t.length > 0 && e.push(new Xo("TransformAnimation", -1, t)), e;
		}
		_buildTransformAnimations() {
			let e = [];
			for (let t in this.specsByPath) {
				let n = this.specsByPath[t];
				if (n.specType !== uh.Prim) continue;
				let r = n.fields?.typeName;
				if (r !== "Xform" && r !== "Scope" && r !== "Mesh") continue;
				let i = t.split("/").pop(), a = t + ".xformOp:orient", o = this.specsByPath[a];
				if (o?.fields?.timeSamples) {
					let { times: t, values: n } = o.fields.timeSamples, r = [], a = [];
					for (let e = 0; e < t.length; e++) {
						r.push(t[e] / this.fps);
						let i = n[e];
						a.push(i[0], i[1], i[2], i[3]);
					}
					r.length > 0 && e.push(new qo(i + ".quaternion", new Float32Array(r), new Float32Array(a)));
				}
				let s = t + ".xformOp:rotateXYZ", c = this.specsByPath[s];
				if (c?.fields?.timeSamples) {
					let { times: t, values: n } = c.fields.timeSamples, r = [], a = [], o = new wr(), s = new Zn();
					for (let e = 0; e < t.length; e++) {
						r.push(t[e] / this.fps);
						let i = n[e];
						o.set(i[0] * Math.PI / 180, i[1] * Math.PI / 180, i[2] * Math.PI / 180, "ZYX"), s.setFromEuler(o), a.push(s.x, s.y, s.z, s.w);
					}
					r.length > 0 && e.push(new qo(i + ".quaternion", new Float32Array(r), new Float32Array(a)));
				}
				let l = t + ".xformOp:translate", u = this.specsByPath[l];
				if (u?.fields?.timeSamples) {
					let { times: t, values: n } = u.fields.timeSamples, r = [], a = [];
					for (let e = 0; e < t.length; e++) {
						r.push(t[e] / this.fps);
						let i = n[e];
						a.push(i[0], i[1], i[2]);
					}
					r.length > 0 && e.push(new Yo(i + ".position", new Float32Array(r), new Float32Array(a)));
				}
				let d = t + ".xformOp:scale", f = this.specsByPath[d];
				if (f?.fields?.timeSamples) {
					let { times: t, values: n } = f.fields.timeSamples, r = [], a = [];
					for (let e = 0; e < t.length; e++) {
						r.push(t[e] / this.fps);
						let i = n[e];
						a.push(i[0], i[1], i[2]);
					}
					r.length > 0 && e.push(new Yo(i + ".scale", new Float32Array(r), new Float32Array(a)));
				}
				let p = n.fields?.properties || [];
				for (let n of p) {
					if (!n.startsWith("xformOp:transform")) continue;
					let r = t + "." + n, a = this.specsByPath[r];
					if (!a?.fields?.timeSamples) continue;
					let { times: o, values: s } = a.fields.timeSamples, c = [], l = [], u = [], d = [], f = [], p = [], m = new q(), h = new W(), g = new Zn(), _ = new W();
					for (let e = 0; e < o.length; e++) {
						let t = s[e];
						if (!t || t.length < 16) continue;
						let n = o[e] / this.fps;
						m.set(t[0], t[4], t[8], t[12], t[1], t[5], t[9], t[13], t[2], t[6], t[10], t[14], t[3], t[7], t[11], t[15]), m.decompose(h, g, _), c.push(n), l.push(h.x, h.y, h.z), u.push(n), d.push(g.x, g.y, g.z, g.w), f.push(n), p.push(_.x, _.y, _.z);
					}
					c.length > 0 && (e.push(new Yo(i + ".position", new Float32Array(c), new Float32Array(l))), e.push(new qo(i + ".quaternion", new Float32Array(u), new Float32Array(d))), e.push(new Yo(i + ".scale", new Float32Array(f), new Float32Array(p))));
					break;
				}
			}
			return e;
		}
		_buildAnimationClip(e) {
			let t = this._getAttributes(e).joints;
			if (!t || t.length === 0) return null;
			let n = [], r = this._getTimeSampledAttribute(e, "rotations");
			if (r && r.times && r.values) {
				let { times: e, values: i } = r;
				for (let r = 0; r < t.length; r++) {
					let a = t[r].split("/").pop(), o = [], s = [];
					for (let t = 0; t < e.length; t++) {
						let n = i[t];
						if (!n || n.length < (r + 1) * 4) continue;
						o.push(e[t] / this.fps);
						let a = n[r * 4 + 0], c = n[r * 4 + 1], l = n[r * 4 + 2], u = n[r * 4 + 3];
						s.push(a, c, l, u);
					}
					o.length > 0 && n.push(new qo(a + ".quaternion", new Float32Array(o), new Float32Array(s)));
				}
			}
			let i = this._getTimeSampledAttribute(e, "translations");
			if (i && i.times && i.values) {
				let { times: e, values: r } = i;
				for (let i = 0; i < t.length; i++) {
					let a = t[i].split("/").pop(), o = [], s = [];
					for (let t = 0; t < e.length; t++) {
						let n = r[t];
						!n || n.length < (i + 1) * 3 || (o.push(e[t] / this.fps), s.push(n[i * 3 + 0], n[i * 3 + 1], n[i * 3 + 2]));
					}
					o.length > 0 && n.push(new Yo(a + ".position", new Float32Array(o), new Float32Array(s)));
				}
			}
			let a = this._getTimeSampledAttribute(e, "scales");
			if (a && a.times && a.values) {
				let { times: e, values: r } = a;
				for (let i = 0; i < t.length; i++) {
					let a = t[i].split("/").pop(), o = [], s = [];
					for (let t = 0; t < e.length; t++) {
						let n = r[t];
						!n || n.length < (i + 1) * 3 || (o.push(e[t] / this.fps), s.push(n[i * 3 + 0], n[i * 3 + 1], n[i * 3 + 2]));
					}
					o.length > 0 && n.push(new Yo(a + ".scale", new Float32Array(o), new Float32Array(s)));
				}
			}
			if (n.length === 0) return null;
			let o = e.split("/").pop();
			return new Xo(o, -1, n);
		}
		_getTimeSampledAttribute(e, t) {
			let n = e + "." + t, r = this.specsByPath[n];
			if (r && r.fields.timeSamples) {
				let e = r.fields.timeSamples;
				if (e.times && e.values) return e;
			}
			return null;
		}
		_flattenMatrixArray(e, t) {
			if (!e || e.length === 0) return null;
			if (typeof e[0] == "number") return e;
			let n = [];
			for (let r = 0; r < t; r++) for (let t = 0; t < 4; t++) {
				let i = e[r * 4 + t];
				i && i.length === 4 ? n.push(i[0], i[1], i[2], i[3]) : n.push(+(t === 0), +(t === 1), +(t === 2), +(t === 3));
			}
			return n;
		}
	};
})), mh = /* @__PURE__ */ r({ USDLoader: () => hh }), hh, gh = t((() => {
	gd(), Rf(), Jm(), ch(), ph(), hh = class extends es {
		constructor(e) {
			super(e);
		}
		load(e, t, n, r) {
			let i = this, a = i.path === "" ? ks.extractUrlBase(e) : i.path, o = new rs(i.manager);
			o.setPath(i.path), o.setResponseType("arraybuffer"), o.setRequestHeader(i.requestHeader), o.setWithCredentials(i.withCredentials), o.load(e, function(n) {
				try {
					i.parse(n, a, t, r);
				} catch (t) {
					r ? r(t) : console.error(t), i.manager.itemError(e);
				}
			}, n, r);
		}
		parse(e, t = "", n, r) {
			let i = new qm(), a = new sh(), o = new TextDecoder();
			function s(e) {
				return e instanceof ArrayBuffer ? e : e.byteOffset === 0 && e.byteLength === e.buffer.byteLength ? e.buffer : e.buffer.slice(e.byteOffset, e.byteOffset + e.byteLength);
			}
			function c(e) {
				let t = e.lastIndexOf(".");
				return t < 0 || e.lastIndexOf("/") > t ? "" : e.slice(t + 1).toLowerCase();
			}
			function l(e) {
				let t = {};
				for (let n in e) {
					let r = e[n], l = c(n);
					if (l === "png" || l === "jpg" || l === "jpeg" || l === "avif") {
						t[n] = r;
						continue;
					}
					(l === "usd" || l === "usda" || l === "usdc") && (t[n] = u(r) ? a.parseData(s(r)) : i.parseData(o.decode(r)));
				}
				return t;
			}
			function u(e) {
				let t = new Uint8Array([
					80,
					88,
					82,
					45,
					85,
					83,
					68,
					67
				]), n = e instanceof Uint8Array ? e : new Uint8Array(e);
				if (n.byteLength < t.length) return !1;
				for (let e = 0; e < t.length; e++) if (n[e] !== t[e]) return !1;
				return !0;
			}
			function d(e) {
				let t = Object.keys(e);
				if (t.length < 1) return {
					file: void 0,
					filename: "",
					basePath: ""
				};
				let n = t[0], r = c(n), i = !1, a = n.lastIndexOf("/"), o = a >= 0 ? n.slice(0, a) : "";
				if (r === "usda") return {
					file: e[n],
					filename: n,
					basePath: o
				};
				if (r === "usdc") i = !0;
				else if (r === "usd") {
					if (u(e[n])) i = !0;
					else return {
						file: e[n],
						filename: n,
						basePath: o
					};
				}
				return i ? {
					file: e[n],
					filename: n,
					basePath: o
				} : {
					file: void 0,
					filename: "",
					basePath: ""
				};
			}
			let f = this, p = (e, t) => (n && Promise.all(e.texturePromises).then(() => n(t)).catch((e) => r ? r(e) : console.error(e)), t);
			if (typeof e == "string") {
				let n = new fh(f.manager), r = i.parseData(e);
				return p(n, n.compose(r, {}, {}, t));
			}
			if (u(e)) {
				let n = new fh(f.manager), r = a.parseData(s(e));
				return p(n, n.compose(r, {}, {}, t));
			}
			let m = new Uint8Array(e);
			if (m[0] === 80 && m[1] === 75) {
				let e = Qd(m), t = l(e), { file: n, filename: r, basePath: i } = d(e);
				if (!n) throw Error("THREE.USDLoader: Invalid USDZ package. The first ZIP entry must be a USD layer (.usd/.usda/.usdc).");
				let a = new fh(f.manager), o = t[r];
				if (!o) throw Error("THREE.USDLoader: Failed to parse root layer \"" + r + "\".");
				return p(a, a.compose(o, t, {}, i));
			}
			let h = new fh(f.manager), g = o.decode(m), _ = i.parseData(g);
			return p(h, h.compose(_, {}, {}, t));
		}
	};
})), _h = /* @__PURE__ */ n(((e) => {
	var t = Object.defineProperty;
	((e) => t(e, "__esModule", { value: !0 }))(e), ((e, n) => {
		for (var r in n) t(e, r, {
			get: n[r],
			enumerable: !0
		});
	})(e, {
		GIFEncoder: () => A,
		applyPalette: () => S,
		default: () => ie,
		nearestColor: () => k,
		nearestColorIndex: () => D,
		nearestColorIndexWithDistance: () => O,
		prequantize: () => x,
		quantize: () => _,
		snapColorsToPalette: () => T
	});
	var n = {
		signature: "GIF",
		version: "89a",
		trailer: 59,
		extensionIntroducer: 33,
		applicationExtensionLabel: 255,
		graphicControlExtensionLabel: 249,
		imageSeparator: 44,
		signatureSize: 3,
		versionSize: 3,
		globalColorTableFlagMask: 128,
		colorResolutionMask: 112,
		sortFlagMask: 8,
		globalColorTableSizeMask: 7,
		applicationIdentifierSize: 8,
		applicationAuthCodeSize: 3,
		disposalMethodMask: 28,
		userInputFlagMask: 2,
		transparentColorFlagMask: 1,
		localColorTableFlagMask: 128,
		interlaceFlagMask: 64,
		idSortFlagMask: 32,
		localColorTableSizeMask: 7
	};
	function r(e = 256) {
		let t = 0, n = new Uint8Array(e);
		return {
			get buffer() {
				return n.buffer;
			},
			reset() {
				t = 0;
			},
			bytesView() {
				return n.subarray(0, t);
			},
			bytes() {
				return n.slice(0, t);
			},
			writeByte(e) {
				r(t + 1), n[t] = e, t++;
			},
			writeBytes(e, i = 0, a = e.length) {
				r(t + a);
				for (let r = 0; r < a; r++) n[t++] = e[r + i];
			},
			writeBytesView(e, i = 0, a = e.byteLength) {
				r(t + a), n.set(e.subarray(i, i + a), t), t += a;
			}
		};
		function r(e) {
			var r = n.length;
			if (r >= e) return;
			e = Math.max(e, r * (r < 1048576 ? 2 : 1.125) >>> 0), r != 0 && (e = Math.max(e, 256));
			let i = n;
			n = new Uint8Array(e), t > 0 && n.set(i.subarray(0, t), 0);
		}
	}
	var i = 12, a = 5003, o = [
		0,
		1,
		3,
		7,
		15,
		31,
		63,
		127,
		255,
		511,
		1023,
		2047,
		4095,
		8191,
		16383,
		32767,
		65535
	];
	function s(e, t, n, s, c = r(512), l = /* @__PURE__ */ new Uint8Array(256), u = new Int32Array(a), d = new Int32Array(a)) {
		let f = u.length, p = Math.max(2, s);
		l.fill(0), d.fill(0), u.fill(-1);
		let m = 0, h = 0, g = p + 1, _ = g, v = !1, y = _, b = (1 << y) - 1, x = 1 << g - 1, S = x + 1, C = x + 2, w = 0, T = n[0], E = 0;
		for (let e = f; e < 65536; e *= 2) ++E;
		E = 8 - E, c.writeByte(p), O(x);
		let D = n.length;
		for (let e = 1; e < D; e++) next_block: {
			let t = n[e], r = (t << i) + T, a = t << E ^ T;
			if (u[a] === r) {
				T = d[a];
				break next_block;
			}
			let o = a === 0 ? 1 : f - a;
			for (; u[a] >= 0;) if (a -= o, a < 0 && (a += f), u[a] === r) {
				T = d[a];
				break next_block;
			}
			O(T), T = t, C < 1 << i ? (d[a] = C++, u[a] = r) : (u.fill(-1), C = x + 2, v = !0, O(x));
		}
		return O(T), O(S), c.writeByte(0), c.bytesView();
		function O(e) {
			for (m &= o[h], h > 0 ? m |= e << h : m = e, h += y; h >= 8;) l[w++] = m & 255, w >= 254 && (c.writeByte(w), c.writeBytesView(l, 0, w), w = 0), m >>= 8, h -= 8;
			if ((C > b || v) && (v ? (y = _, b = (1 << y) - 1, v = !1) : (++y, b = y === i ? 1 << y : (1 << y) - 1)), e == S) {
				for (; h > 0;) l[w++] = m & 255, w >= 254 && (c.writeByte(w), c.writeBytesView(l, 0, w), w = 0), m >>= 8, h -= 8;
				w > 0 && (c.writeByte(w), c.writeBytesView(l, 0, w), w = 0);
			}
		}
	}
	var c = s;
	function l(e, t, n) {
		return e << 8 & 63488 | t << 2 & 992 | n >> 3;
	}
	function u(e, t, n, r) {
		return e >> 4 | t & 240 | (n & 240) << 4 | (r & 240) << 8;
	}
	function d(e, t, n) {
		return e >> 4 << 8 | t & 240 | n >> 4;
	}
	function f(e, t, n) {
		return e < t ? t : e > n ? n : e;
	}
	function p(e) {
		return e * e;
	}
	function m(e, t, n) {
		var r = 0, i = 1e100;
		let a = e[t], o = a.cnt, s = a.ac, c = a.rc, l = a.gc, u = a.bc;
		for (var d = a.fw; d != 0; d = e[d].fw) {
			let t = e[d], a = t.cnt, m = o * a / (o + a);
			if (!(m >= i)) {
				var f = 0;
				n && (f += m * p(t.ac - s), f >= i) || (f += m * p(t.rc - c), !(f >= i) && (f += m * p(t.gc - l), !(f >= i) && (f += m * p(t.bc - u), !(f >= i) && (i = f, r = d))));
			}
		}
		a.err = i, a.nn = r;
	}
	function h() {
		return {
			ac: 0,
			rc: 0,
			gc: 0,
			bc: 0,
			cnt: 0,
			nn: 0,
			fw: 0,
			bk: 0,
			tm: 0,
			mtm: 0,
			err: 0
		};
	}
	function g(e, t) {
		let n = Array(t === "rgb444" ? 4096 : 65536), r = e.length;
		if (t === "rgba4444") for (let t = 0; t < r; ++t) {
			let r = e[t], i = r >> 24 & 255, a = r >> 16 & 255, o = r >> 8 & 255, s = r & 255, c = u(s, o, a, i), l = c in n ? n[c] : n[c] = h();
			l.rc += s, l.gc += o, l.bc += a, l.ac += i, l.cnt++;
		}
		else if (t === "rgb444") for (let t = 0; t < r; ++t) {
			let r = e[t], i = r >> 16 & 255, a = r >> 8 & 255, o = r & 255, s = d(o, a, i), c = s in n ? n[s] : n[s] = h();
			c.rc += o, c.gc += a, c.bc += i, c.cnt++;
		}
		else for (let t = 0; t < r; ++t) {
			let r = e[t], i = r >> 16 & 255, a = r >> 8 & 255, o = r & 255, s = l(o, a, i), c = s in n ? n[s] : n[s] = h();
			c.rc += o, c.gc += a, c.bc += i, c.cnt++;
		}
		return n;
	}
	function _(e, t, n = {}) {
		let { format: r = "rgb565", clearAlpha: i = !0, clearAlphaColor: a = 0, clearAlphaThreshold: o = 0, oneBitAlpha: s = !1 } = n;
		if (!e || !e.buffer || !(e instanceof Uint8Array) && !(e instanceof Uint8ClampedArray)) throw Error("quantize() expected RGBA Uint8Array data");
		let c = new Uint32Array(e.buffer), l = n.useSqrt !== !1, u = r === "rgba4444", d = g(c, r), h = d.length, _ = h - 1, y = new Uint32Array(h + 1);
		for (var b = 0, x = 0; x < h; ++x) {
			let e = d[x];
			if (e != null) {
				var S = 1 / e.cnt;
				u && (e.ac *= S), e.rc *= S, e.gc *= S, e.bc *= S, d[b++] = e;
			}
		}
		p(t) / b < .022 && (l = !1);
		for (var x = 0; x < b - 1; ++x) d[x].fw = x + 1, d[x + 1].bk = x, l && (d[x].cnt = Math.sqrt(d[x].cnt));
		l && (d[x].cnt = Math.sqrt(d[x].cnt));
		var C, w, T;
		for (x = 0; x < b; ++x) {
			m(d, x, !1);
			var E = d[x].err;
			for (w = ++y[0]; w > 1 && (T = w >> 1, !(d[C = y[T]].err <= E)); w = T) y[w] = C;
			y[w] = x;
		}
		var D = b - t;
		for (x = 0; x < D;) {
			for (var O;;) {
				var k = y[1];
				if (O = d[k], O.tm >= O.mtm && d[O.nn].mtm <= O.tm) break;
				O.mtm == _ ? k = y[1] = y[y[0]--] : (m(d, k, !1), O.tm = x);
				var E = d[k].err;
				for (w = 1; (T = w + w) <= y[0] && (T < y[0] && d[y[T]].err > d[y[T + 1]].err && T++, !(E <= d[C = y[T]].err)); w = T) y[w] = C;
				y[w] = k;
			}
			var A = d[O.nn], j = O.cnt, M = A.cnt, S = 1 / (j + M);
			u && (O.ac = S * (j * O.ac + M * A.ac)), O.rc = S * (j * O.rc + M * A.rc), O.gc = S * (j * O.gc + M * A.gc), O.bc = S * (j * O.bc + M * A.bc), O.cnt += A.cnt, O.mtm = ++x, d[A.bk].fw = A.fw, d[A.fw].bk = A.bk, A.mtm = _;
		}
		let ee = [];
		var te = 0;
		for (x = 0;; ++te) {
			let e = f(Math.round(d[x].rc), 0, 255), t = f(Math.round(d[x].gc), 0, 255), n = f(Math.round(d[x].bc), 0, 255), r = 255;
			u && (r = f(Math.round(d[x].ac), 0, 255), s && (r = r <= (typeof s == "number" ? s : 127) ? 0 : 255), i && r <= o && (e = t = n = a, r = 0));
			let c = u ? [
				e,
				t,
				n,
				r
			] : [
				e,
				t,
				n
			];
			if (v(ee, c) || ee.push(c), (x = d[x].fw) == 0) break;
		}
		return ee;
	}
	function v(e, t) {
		for (let n = 0; n < e.length; n++) {
			let r = e[n], i = r[0] === t[0] && r[1] === t[1] && r[2] === t[2], a = r.length >= 4 && t.length >= 4 ? r[3] === t[3] : !0;
			if (i && a) return !0;
		}
		return !1;
	}
	function y(e, t) {
		var n = 0, r;
		for (r = 0; r < e.length; r++) {
			let i = e[r] - t[r];
			n += i * i;
		}
		return n;
	}
	function b(e, t) {
		return t > 1 ? Math.round(e / t) * t : e;
	}
	function x(e, { roundRGB: t = 5, roundAlpha: n = 10, oneBitAlpha: r = null } = {}) {
		let i = new Uint32Array(e.buffer);
		for (let e = 0; e < i.length; e++) {
			let a = i[e], o = a >> 24 & 255, s = a >> 16 & 255, c = a >> 8 & 255, l = a & 255;
			o = b(o, n), r && (o = o <= (typeof r == "number" ? r : 127) ? 0 : 255), l = b(l, t), c = b(c, t), s = b(s, t), i[e] = o << 24 | s << 16 | c << 8 | l << 0;
		}
	}
	function S(e, t, n = "rgb565") {
		if (!e || !e.buffer || !(e instanceof Uint8Array) && !(e instanceof Uint8ClampedArray)) throw Error("quantize() expected RGBA Uint8Array data");
		if (t.length > 256) throw Error("applyPalette() only works with 256 colors or less");
		let r = new Uint32Array(e.buffer), i = r.length, a = n === "rgb444" ? 4096 : 65536, o = new Uint8Array(i), s = Array(a);
		if (n === "rgba4444") for (let e = 0; e < i; e++) {
			let n = r[e], i = n >> 24 & 255, a = n >> 16 & 255, c = n >> 8 & 255, l = n & 255, d = u(l, c, a, i), f = d in s ? s[d] : s[d] = C(l, c, a, i, t);
			o[e] = f;
		}
		else {
			let e = n === "rgb444" ? d : l;
			for (let n = 0; n < i; n++) {
				let i = r[n], a = i >> 16 & 255, c = i >> 8 & 255, l = i & 255, u = e(l, c, a), d = u in s ? s[u] : s[u] = w(l, c, a, t);
				o[n] = d;
			}
		}
		return o;
	}
	function C(e, t, n, r, i) {
		let a = 0, o = 1e100;
		for (let s = 0; s < i.length; s++) {
			let c = i[s], l = c[3], u = E(l - r);
			if (u > o) continue;
			let d = c[0];
			if (u += E(d - e), u > o) continue;
			let f = c[1];
			if (u += E(f - t), u > o) continue;
			let p = c[2];
			u += E(p - n), !(u > o) && (o = u, a = s);
		}
		return a;
	}
	function w(e, t, n, r) {
		let i = 0, a = 1e100;
		for (let o = 0; o < r.length; o++) {
			let s = r[o], c = s[0], l = E(c - e);
			if (l > a) continue;
			let u = s[1];
			if (l += E(u - t), l > a) continue;
			let d = s[2];
			l += E(d - n), !(l > a) && (a = l, i = o);
		}
		return i;
	}
	function T(e, t, n = 5) {
		if (!e.length || !t.length) return;
		let r = e.map((e) => e.slice(0, 3)), i = n * n, a = e[0].length;
		for (let n = 0; n < t.length; n++) {
			let o = t[n];
			o = o.length < a ? [
				o[0],
				o[1],
				o[2],
				255
			] : o.length > a ? o.slice(0, 3) : o.slice();
			let s = O(r, o.slice(0, 3), y), c = s[0], l = s[1];
			l > 0 && l <= i && (e[c] = o);
		}
	}
	function E(e) {
		return e * e;
	}
	function D(e, t, n = y) {
		let r = Infinity, i = -1;
		for (let a = 0; a < e.length; a++) {
			let o = e[a], s = n(t, o);
			s < r && (r = s, i = a);
		}
		return i;
	}
	function O(e, t, n = y) {
		let r = Infinity, i = -1;
		for (let a = 0; a < e.length; a++) {
			let o = e[a], s = n(t, o);
			s < r && (r = s, i = a);
		}
		return [i, r];
	}
	function k(e, t, n = y) {
		return e[D(e, t, n)];
	}
	function A(e = {}) {
		let { initialCapacity: t = 4096, auto: i = !0 } = e, a = r(t), o = 5003, s = /* @__PURE__ */ new Uint8Array(256), c = new Int32Array(o), l = new Int32Array(o), u = !1;
		return {
			reset() {
				a.reset(), u = !1;
			},
			finish() {
				a.writeByte(n.trailer);
			},
			bytes() {
				return a.bytes();
			},
			bytesView() {
				return a.bytesView();
			},
			get buffer() {
				return a.buffer;
			},
			get stream() {
				return a;
			},
			writeHeader: d,
			writeFrame(e, t, n, r = {}) {
				let { transparent: o = !1, transparentIndex: f = 0, delay: p = 0, palette: m = null, repeat: h = 0, colorDepth: g = 8, dispose: _ = -1 } = r, v = !1;
				if (i ? u || (v = !0, d(), u = !0) : v = !!r.first, t = Math.max(0, Math.floor(t)), n = Math.max(0, Math.floor(n)), v) {
					if (!m) throw Error("First frame must include a { palette } option");
					M(a, t, n, m, g), te(a, m), h >= 0 && ee(a, h);
				}
				let y = Math.round(p / 10);
				j(a, _, y, o, f);
				let b = !!m && !v;
				N(a, t, n, b ? m : null), b && te(a, m), ne(a, e, t, n, g, s, c, l);
			}
		};
		function d() {
			F(a, "GIF89a");
		}
	}
	function j(e, t, n, r, i) {
		e.writeByte(33), e.writeByte(249), e.writeByte(4), i < 0 && (i = 0, r = !1);
		var a, o;
		r ? (a = 1, o = 2) : (a = 0, o = 0), t >= 0 && (o = t & 7), o <<= 2, e.writeByte(o | 0 | a), P(e, n), e.writeByte(i || 0), e.writeByte(0);
	}
	function M(e, t, n, r, i = 8) {
		let a = re(r.length) - 1, o = i - 1 << 4 | 128 | a;
		P(e, t), P(e, n), e.writeBytes([
			o,
			0,
			0
		]);
	}
	function ee(e, t) {
		e.writeByte(33), e.writeByte(255), e.writeByte(11), F(e, "NETSCAPE2.0"), e.writeByte(3), e.writeByte(1), P(e, t), e.writeByte(0);
	}
	function te(e, t) {
		let n = 1 << re(t.length);
		for (let r = 0; r < n; r++) {
			let n = [
				0,
				0,
				0
			];
			r < t.length && (n = t[r]), e.writeByte(n[0]), e.writeByte(n[1]), e.writeByte(n[2]);
		}
	}
	function N(e, t, n, r) {
		if (e.writeByte(44), P(e, 0), P(e, 0), P(e, t), P(e, n), r) {
			let t = re(r.length) - 1;
			e.writeByte(128 | t);
		} else e.writeByte(0);
	}
	function ne(e, t, n, r, i = 8, a, o, s) {
		c(n, r, t, i, e, a, o, s);
	}
	function P(e, t) {
		e.writeByte(t & 255), e.writeByte(t >> 8 & 255);
	}
	function F(e, t) {
		for (var n = 0; n < t.length; n++) e.writeByte(t.charCodeAt(n));
	}
	function re(e) {
		return Math.max(Math.ceil(Math.log2(e)), 1);
	}
	var ie = A;
})), vh = /* @__PURE__ */ r({
	downloadGif: () => Eh,
	encodeAsciiGif: () => yh,
	encodeAsciiGifAsync: () => bh
});
function yh({ frames: e = [], colors: t, colorA: n = "#000000", colorB: r = "#ffffff", delay: i = 80, width: a, height: o }) {
	let s = (t && t.length ? t : [n, r]).map(wh), c = (0, Dh.GIFEncoder)(), l = a, u = o, d = Ch(e[0]);
	l || (l = d.width), u || (u = d.height);
	let f = new Uint8Array(l * u), p = [[
		0,
		0,
		0
	], ...s].map((e) => [
		e[0],
		e[1],
		e[2]
	]);
	for (let t of e) Sh(t, l, u, s, f), c.writeFrame(f, l, u, {
		palette: p,
		transparent: !0,
		transparentIndex: 0,
		delay: i,
		repeat: 0
	});
	return c.finish(), c.bytes();
}
async function bh({ frames: e = [], colors: t, colorA: n = "#000000", colorB: r = "#ffffff", delay: i = 80, width: a, height: o, onProgress: s = () => {} }) {
	let c = (t && t.length ? t : [n, r]).map(wh), l = (0, Dh.GIFEncoder)(), u = a, d = o, f = Ch(e[0]);
	u || (u = f.width), d || (d = f.height);
	let p = new Uint8Array(u * d), m = [[
		0,
		0,
		0
	], ...c].map((e) => [
		e[0],
		e[1],
		e[2]
	]), h = e.length;
	for (let t = 0; t < h; t++) Sh(e[t], u, d, c, p), l.writeFrame(p, u, d, {
		palette: m,
		transparent: !0,
		transparentIndex: 0,
		delay: i,
		repeat: 0
	}), s((t + 1) / h), await xh();
	return l.finish(), s(1), l.bytes();
}
function xh() {
	return new Promise((e) => setTimeout(e, 0));
}
function Sh(e, t, n, r, i) {
	let { data: a } = Ch(e).getContext("2d", { willReadFrequently: !0 }).getImageData(0, 0, t, n);
	for (let e = 0; e < a.length; e += 4) {
		let t = a[e], n = a[e + 1], o = a[e + 2];
		if (a[e + 3] < 64) {
			i[e / 4] = 0;
			continue;
		}
		let s = 1, c = Infinity;
		for (let e = 0; e < r.length; e++) {
			let i = Th(t, n, o, r[e]);
			i < c && (c = i, s = e + 1);
		}
		i[e / 4] = s;
	}
}
function Ch(e) {
	if (e instanceof HTMLCanvasElement) return e;
	if (e && e.canvas) return e.canvas;
	throw Error("Frame must be a canvas or 2D context");
}
function wh(e) {
	let t = String(e).replace("#", "");
	t.length === 3 && (t = t.split("").map((e) => e + e).join(""));
	let n = parseInt(t, 16);
	return [
		n >> 16 & 255,
		n >> 8 & 255,
		n & 255
	];
}
function Th(e, t, n, r) {
	return (e - r[0]) ** 2 + (t - r[1]) ** 2 + (n - r[2]) ** 2;
}
function Eh(e, t = "ascii.gif") {
	let n = new Blob([e], { type: "image/gif" }), r = URL.createObjectURL(n), i = document.createElement("a");
	i.href = r, i.download = t, document.body.appendChild(i), i.click(), document.body.removeChild(i), setTimeout(() => URL.revokeObjectURL(r), 1e3);
}
var Dh, Oh = t((() => {
	Dh = _h();
}));
//#endregion
//#region _src/engine.js
gd();
var kh = new W(), Ah = new q(), jh = new J(), Mh = new W(), Nh = new W(), Ph = new W(), Fh = /\.(gltf|bin|png|jpe?g|webp|ktx2|dds|exr|basis|json)$/i, Ih = 4, Lh = /* @__PURE__ */ new Map();
async function Rh(e) {
	let t = Lh.get(e);
	return t || (t = (async () => {
		if (e === "fbx") {
			let { FBXLoader: e } = await Promise.resolve().then(() => (xp(), Xf));
			return e;
		}
		if (e === "obj") {
			let { OBJLoader: e } = await Promise.resolve().then(() => (Ip(), Sp));
			return e;
		}
		if (e === "gltf") {
			let { GLTFLoader: e } = await Promise.resolve().then(() => (Hm(), Hp));
			return e;
		}
		if (e === "usd") {
			let { USDLoader: e } = await Promise.resolve().then(() => (gh(), mh));
			return e;
		}
		throw Error("Unknown loader: " + e);
	})(), Lh.set(e, t)), t;
}
async function zh() {
	return Promise.resolve().then(() => (Oh(), vh));
}
function Bh(e) {
	let t = [];
	for (let n of e.replace(/\\/g, "/").split("/")) !n || n === "." || (n === ".." ? t.pop() : t.push(n));
	return t.join("/");
}
function Vh(e) {
	return Bh(e.webkitRelativePath || e.name);
}
function Hh(e, t, n) {
	let r = Bh(t.startsWith("/") ? t : (e ? e + "/" : "") + t);
	if (n.has(r)) return n.get(r);
	let i = "/" + r;
	for (let [e, t] of n) if (e.endsWith(i)) return t;
	let a = r.split("/").pop(), o = [...n].filter(([e]) => e.split("/").pop() === a);
	if (o.length === 1) return o[0][1];
}
var Uh = {
	gridWidth: 140,
	gridHeight: 94,
	colorA: "#1a1a1a",
	colorB: "#FF6700",
	colorC: "#FFC043",
	paletteId: "ember",
	threshold: .42,
	split: .68,
	colorMode: 3,
	dither: "none",
	contrast: 0,
	cellSize: 9,
	cellSpacing: 0,
	gamma: 1.4,
	bold: 1,
	delay: 80,
	fps: 30,
	duration: 6,
	speedFactor: 1,
	lightAzimuth: 45,
	lightElevation: 40,
	keyX: 2,
	keyY: 5,
	keyZ: 4,
	keyIntensity: 1.2,
	fillX: -2.2,
	fillY: 2,
	fillZ: -1.8,
	fillIntensity: .15,
	ambientIntensity: .6,
	objectOmega: 0,
	objectPhi: 0,
	objectKappa: 0,
	cameraOmega: 27,
	cameraPhi: 111,
	cameraKappa: 0,
	cameraDistance: 3.2,
	orbitH: 27,
	orbitV: 111,
	zoom: 3.2,
	cameraFollow: "auto",
	mouseStrength: 48,
	cellMode: "mixed",
	cellOutline: 0,
	colorMix: .28,
	bgColor: "transparent",
	paperColor: "#f5f3ee",
	trailEnabled: 0,
	trailStroke: 0,
	trailLength: 8,
	trailDecayMs: 600,
	explodeAmount: 0,
	formationMode: "none",
	transitionMs: 400
};
function Wh(e) {
	let t = new hd({
		antialias: !0,
		alpha: !0,
		preserveDrawingBuffer: !0
	});
	t.setPixelRatio(1), t.setClearColor(0, 0);
	let n = new Yr(), r = new Vr();
	n.add(r);
	let i = new ys(40, 1, .01, 1e3);
	i.position.set(0, 0, 4), r.add(i);
	let a = Ld(e), o = new Es(16777215, 1.8), s = new Ds(16777215, .22), c = new Es(16777215, .3);
	o.target.position.set(0, 0, 0), c.target.position.set(0, 0, 0), n.add(o, o.target, s, c, c.target);
	let l = null, u = null, d = null, f = !1, p = !1, m = [], h = "auto", g = 0, _ = {
		nx: 0,
		ny: 0
	}, v = {
		nx: 0,
		ny: 0
	}, y = [], b = !1, x = 0, S = 0;
	function C() {
		if (l) {
			n.remove(l);
			for (let e of m) try {
				e.dispose && e.dispose();
			} catch {}
			m = [], l = null;
		}
		u = null, d && (d = null), f = !1, p = !1;
	}
	function w(e) {
		return (Number(e) || 0) * Math.PI / 180;
	}
	function T(e) {
		if (e.keyX != null && e.keyY != null && e.keyZ != null) o.position.set(Number(e.keyX) || 0, Number(e.keyY) || 0, Number(e.keyZ) || 0), c.position.set(Number(e.fillX) || 0, Number(e.fillY) || 0, Number(e.fillZ) || 0);
		else {
			let t = w(e.lightAzimuth ?? 45), n = w(e.lightElevation ?? 40);
			o.position.set(6 * Math.cos(n) * Math.cos(t), 6 * Math.sin(n), 6 * Math.cos(n) * Math.sin(t)), c.position.set(-6 * Math.cos(n) * Math.cos(t) * .5, Math.max(.5, 6 * Math.sin(n) * .35), -6 * Math.cos(n) * Math.sin(t) * .5);
		}
		o.intensity = Number.isFinite(Number(e.keyIntensity)) ? Number(e.keyIntensity) : 1.8, c.intensity = Number.isFinite(Number(e.fillIntensity)) ? Number(e.fillIntensity) : .3, s.intensity = Number.isFinite(Number(e.ambientIntensity)) ? Number(e.ambientIntensity) : .22;
	}
	function E(e) {
		let t = !b && e.cameraFollow === "mouse";
		t ? (v.nx += (_.nx - v.nx) * .08, v.ny += (_.ny - v.ny) * .08) : (v.nx += (0 - v.nx) * .08, v.ny += (0 - v.ny) * .08);
		let n = t && Number(e.mouseStrength) || 0, a = Number(e.orbitH ?? e.cameraOmega) || 0, o = Number(e.orbitV ?? e.cameraPhi) || 0, s = Number(e.cameraKappa) || 0;
		r.rotation.order = "XYZ", r.rotation.set(w(a - v.ny * n), w(o + v.nx * n), w(s));
		let c = Math.max(.5, Number(e.zoom ?? e.cameraDistance) || 4);
		i.position.set(0, 0, c);
	}
	function D(e, t, n) {
		if (_.nx = Math.max(-1, Math.min(1, Number(e) || 0)), _.ny = Math.max(-1, Math.min(1, Number(t) || 0)), b || !n || !Number(n.trailEnabled)) return;
		let r = Math.max(1, Math.round(n.gridWidth) || 96), i = Math.max(1, Math.round(n.gridHeight) || 54), a = Math.max(0, Math.min(r - 1, Math.floor((_.nx + 1) / 2 * r))), o = Math.max(0, Math.min(i - 1, Math.floor((_.ny + 1) / 2 * i))), s = typeof performance < "u" ? performance.now() : Date.now(), c = y[y.length - 1];
		(!c || c.cx !== a || c.cy !== o) && y.push({
			cx: a,
			cy: o,
			t: s
		});
		let l = Math.max(1, Math.round(Number(n.trailLength) || 8)), u = Math.max(50, Number(n.trailDecayMs) || 600);
		for (y = y.filter((e) => s - e.t <= u); y.length > l;) y.shift();
	}
	function O() {
		_.nx = 0, _.ny = 0, y = [];
	}
	function k(e) {
		b = !!e, b && (_.nx = 0, _.ny = 0, y = []);
	}
	function A(e, t = 0) {
		l && (l.rotation.order = "XYZ", l.rotation.set(w(e.objectOmega), w(e.objectPhi) + t, w(e.objectKappa)));
	}
	function j(e) {
		e.traverse((e) => {
			if (e.isMesh || e.isSkinnedMesh) {
				let t = Array.isArray(e.material) ? e.material : [e.material];
				for (let e of t) e.transparent = !1, e.opacity = 1, e.alphaTest = .5;
			}
		});
	}
	function M(e) {
		e.updateMatrixWorld(!0);
		let t = new ui().setFromObject(e);
		if (t.isEmpty()) return;
		let n = t.getCenter(kh);
		e.traverse((e) => {
			if (!e.isMesh || e.isSkinnedMesh || !e.geometry) return;
			e.updateWorldMatrix(!0, !1), Ah.copy(e.matrixWorld).invert();
			let t = n.clone().applyMatrix4(Ah);
			e.geometry.translate(-t.x, -t.y, -t.z), e.geometry.computeBoundingBox(), e.geometry.computeBoundingSphere && e.geometry.computeBoundingSphere();
		});
	}
	function ee(e) {
		let t = e.children[0];
		e.position.set(0, 0, 0), e.rotation.set(0, 0, 0), e.scale.set(1, 1, 1), t && (t.position.set(0, 0, 0), M(t)), e.updateMatrixWorld(!0);
		let n = new ui().setFromObject(e);
		if (n.isEmpty()) return 1;
		let r = Mh;
		n.getSize(r);
		let i = 1.4 / (Math.max(r.x, r.y, r.z) || 1);
		if (t) {
			t.scale.multiplyScalar(i), t.updateMatrixWorld(!0), n.setFromObject(t);
			let e = n.getCenter(kh);
			t.position.x -= e.x, t.position.y -= e.y, t.position.z -= e.z;
		}
		return e.position.set(0, 0, 0), e.updateMatrixWorld(!0), i;
	}
	function te(e = {}, t = 1.12) {
		return ne(e, { margin: t }).zoom;
	}
	function N(e, t = 0) {
		let n = Math.max(1, Number(e.gridWidth) || 140), r = Math.max(1, Number(e.gridHeight) || 94);
		i.aspect = n / Math.max(1e-6, r * vd), i.updateProjectionMatrix(), T(e), E(e), A(e, t), l.updateMatrixWorld(!0), i.updateMatrixWorld(!0);
		let a = new ui().setFromObject(l);
		if (a.isEmpty()) return null;
		let o = a.min, s = a.max, c = Infinity, u = -Infinity, d = Infinity, f = -Infinity, p = !1;
		for (let e = 0; e < 2; e++) for (let t = 0; t < 2; t++) for (let n = 0; n < 2; n++) Ph.set(e ? s.x : o.x, t ? s.y : o.y, n ? s.z : o.z), Nh.copy(Ph).project(i), !(!Number.isFinite(Nh.x) || !Number.isFinite(Nh.y)) && (Nh.z < -1 || Nh.z > 1 || (p = !0, c = Math.min(c, Nh.x), u = Math.max(u, Nh.x), d = Math.min(d, Nh.y), f = Math.max(f, Nh.y)));
		return p ? {
			minX: c,
			maxX: u,
			minY: d,
			maxY: f,
			width: Math.max(.02, u - c),
			height: Math.max(.02, f - d)
		} : null;
	}
	function ne(e = {}, { margin: t = 1.1, spinSamples: n = 12 } = {}) {
		let r = Number(e.zoom) || Uh.zoom;
		if (!l) return {
			zoom: r,
			aspect: 1,
			ndcW: 1,
			ndcH: 1
		};
		let i = Infinity, a = -Infinity, o = Infinity, s = -Infinity, c = Math.max(1, n | 0);
		for (let t = 0; t < c; t++) {
			let n = N(e, c === 1 ? 0 : t / c * Math.PI * 2);
			n && (i = Math.min(i, n.minX), a = Math.max(a, n.maxX), o = Math.min(o, n.minY), s = Math.max(s, n.maxY));
		}
		if (!Number.isFinite(i)) return {
			zoom: r,
			aspect: 1,
			ndcW: 1,
			ndcH: 1
		};
		let u = Math.max(.05, a - i), d = Math.max(.05, s - o), f = r * (Math.max(u, d) / (2 / Math.max(1.02, t)));
		f = Math.min(10, Math.max(1.6, Math.round(f * 100) / 100));
		let p = u / d;
		return {
			zoom: f,
			aspect: p,
			ndcW: u,
			ndcH: d
		};
	}
	function P(e) {
		l && (l.position.set(0, 0, 0), l.scale.set(1, 1, 1), A(e || Uh, 0));
	}
	async function F(e, t) {
		let n = e.name, r = (n.split(".").pop() || "").toLowerCase(), i = URL.createObjectURL(e);
		C();
		let a;
		try {
			if (r === "fbx") {
				let e = await Rh("fbx");
				a = await new Promise((t, n) => new e().load(i, t, void 0, n));
			} else if (r === "obj") {
				let e = await Rh("obj");
				a = await new Promise((t, n) => new e().load(i, t, void 0, n));
			} else if (r === "gltf" || r === "glb") {
				let e = await Rh("gltf"), t = await new Promise((t, n) => new e().load(i, t, void 0, n));
				l = t.scene || t, l.animations = t.animations || [], a = l;
			} else if (r === "usdz" || r === "usd" || r === "usda" || r === "usdc") {
				let e = await Rh("usd");
				a = await new Promise((t, n) => new e().load(i, t, void 0, n));
			} else throw Error("Unsupported file type: ." + r);
		} finally {
			URL.revokeObjectURL(i);
		}
		return I(a, n, t);
	}
	async function re(e, t, n) {
		let r = t || e.split("/").pop()?.split("?")[0] || "model.glb", i = (r.split(".").pop() || "").toLowerCase();
		C();
		let a;
		if (i === "fbx") {
			let t = await Rh("fbx");
			a = await new Promise((n, r) => new t().load(e, n, void 0, r));
		} else if (i === "obj") {
			let t = await Rh("obj");
			a = await new Promise((n, r) => new t().load(e, n, void 0, r));
		} else if (i === "gltf" || i === "glb") {
			let t = await Rh("gltf"), n = await new Promise((n, r) => new t().load(e, n, void 0, r));
			l = n.scene || n, l.animations = n.animations || [], a = l;
		} else if (i === "usdz" || i === "usd" || i === "usda" || i === "usdc") {
			let t = await Rh("usd");
			a = await new Promise((n, r) => new t().load(e, n, void 0, r));
		} else throw Error("Unsupported file type: ." + i);
		return I(a, r, n);
	}
	async function ie(e, t) {
		let n = [...e], r = n.find((e) => /\.gltf$/i.test(e.name));
		if (!r) throw Error("No .gltf file found in the selected folder.");
		C();
		let i = Vh(r), a = i.split("/").slice(0, -1).join("/"), o = /* @__PURE__ */ new Map();
		for (let e of n) Fh.test(e.name) && o.set(Bh(Vh(e)), URL.createObjectURL(e));
		let s;
		try {
			let e = await fetch(o.get(Bh(i)));
			s = JSON.parse(await e.text());
			for (let e of s.buffers || []) if (e.uri && !/^(data|blob):/i.test(e.uri)) {
				let t = Hh(a, e.uri, o);
				t !== void 0 && (e.uri = t);
			}
			for (let e of s.images || []) if (e.uri && !/^(data|blob):/i.test(e.uri)) {
				let t = Hh(a, e.uri, o);
				t !== void 0 && (e.uri = t);
			}
			let n = await new (await (Rh("gltf")))().parseAsync(s, ""), c = n.scene;
			return c.animations = n.animations || [], I(c, r.name, t);
		} finally {
			o.forEach((e) => URL.revokeObjectURL(e));
		}
	}
	function I(e, t, r) {
		let i = new Vr();
		i.add(e), ee(i), l = i, u = e, T(r), E(r), A(r, 0), j(e), n.add(l);
		let a = (e.animations || []).filter(Boolean);
		return f = a.length > 0, f || (h = "auto"), f && (d = new Zs(u), u.__actions = a.map((e) => d.clipAction(e))), p = !0, {
			name: t,
			animations: a.map((e, t) => ({
				name: e.name || `Animation ${t + 1}`,
				index: t
			})),
			hasAnimation: f
		};
	}
	function ae(e) {
		h = "animation", g = e, !(!u || !u.__actions) && u.__actions.forEach((t, n) => {
			n === e ? (t.reset(), t.play()) : t.stop();
		});
	}
	function oe(e) {
		[
			"auto",
			"spin",
			"animation"
		].includes(e) && (h = e);
	}
	async function se(e, t) {
		let n = (e.name.split(".").pop() || "").toLowerCase();
		if (![
			"fbx",
			"gltf",
			"glb"
		].includes(n)) throw Error("Animation file must be .fbx, .gltf or .glb");
		if (!d) throw Error("Load a model first to attach an animation.");
		let r = URL.createObjectURL(e), i;
		try {
			if (n === "fbx") {
				let e = await Rh("fbx");
				i = await new Promise((t, n) => new e().load(r, t, void 0, n));
			} else {
				let e = await Rh("gltf");
				i = { animations: (await new Promise((t, n) => new e().load(r, t, void 0, n))).animations || [] };
			}
		} finally {
			URL.revokeObjectURL(r);
		}
		let a = (i.animations || []).filter(Boolean);
		if (!a.length) throw Error("That FBX contains no animation clips.");
		let o = [];
		for (let e of a) {
			let t = d.clipAction(e);
			u.__actions.push(t), o.push({
				name: e.name || "Imported animation",
				index: u.__actions.length - 1
			});
		}
		return f = !0, h = "animation", ae(u.__actions.length - 1), o;
	}
	function ce(e) {
		T(e), E(e), A(e, 0);
	}
	function le(e, r, o) {
		let s = o || Math.max(.1, r.duration), c = (e * Math.max(.01, Number(r.speedFactor) || 1) % s + s) % s, l = Se(), u = d && f && l && (h === "animation" || h === "auto" && f);
		if (T(r), E(r), u) {
			let e = l.getClip().duration || s, t = c / s * e;
			l.isRunning() || l.play(), d.setTime(t), A(r, 0);
		} else A(r, c / s * Math.PI * 2);
		let p = r.gridWidth, m = r.gridHeight;
		a.setCellSize(r.cellSize), typeof a.setCellSpacing == "function" && a.setCellSpacing(r.cellSpacing), a.setContrast(r.contrast), a.setSize(p, m), t.setSize(p, m, !1), t.render(n, i), a.drawToLum(t.domElement);
		let g = Number(r.explodeAmount) || 0;
		if (r.formationMode === "assemble" && (g = 1 - g), b) x = 0, g = 0;
		else {
			let e = typeof performance < "u" ? performance.now() : Date.now(), t = S ? Math.min(.05, (e - S) / 1e3) : 0;
			S = e;
			let n = Math.max(0, Number(r.transitionMs) || 0) / 1e3;
			if (n <= 0 || t <= 0) x = g;
			else {
				let e = 1 - Math.exp(-t / Math.max(.001, n * .35));
				x += (g - x) * e;
			}
		}
		let _ = x, v = typeof performance < "u" ? performance.now() : Date.now(), C = Math.max(50, Number(r.trailDecayMs) || 600), w = !b && Number(r.trailEnabled) ? y.filter((e) => v - e.t <= C).map((e) => ({
			cx: e.cx,
			cy: e.cy,
			age: v - e.t,
			alpha: Math.max(0, 1 - (v - e.t) / C)
		})) : [];
		a.rasterize({
			colors: ue(r),
			thresholds: de(r),
			dither: r.dither,
			cellMode: r.cellMode || "text",
			cellOutline: !!Number(r.cellOutline),
			gamma: Number(r.gamma) || 1,
			bold: !!Number(r.bold),
			bgColor: r.bgColor || "transparent",
			paperColor: r.paperColor || null,
			colorMode: Number(r.colorMode) || 3,
			colorMix: Number(r.colorMix) || 0,
			explodeAmount: _,
			trail: w,
			trailStroke: !!Number(r.trailStroke)
		});
	}
	function ue(e) {
		return [
			e.colorA || "#1a1a1a",
			e.colorB || "#FF6700",
			e.colorC || "#FFC043"
		];
	}
	function de(e) {
		if (e.colorMode === 1) return [];
		if (e.colorMode === 3) {
			let t = ve(Number(e.threshold) || 0), n = ve(Number(e.split) || 1);
			return [Math.min(t, n), Math.max(t, n)];
		}
		return [ve(Number(e.threshold) || .5)];
	}
	function fe(e, t = 6) {
		let n = Math.max(.1, e.duration), r = [];
		for (let i = 0; i < t; i++) le(i / t * n, e, n), r.push(...a.cellLums());
		let i = r.length;
		if (!i) return null;
		let o = r.slice().sort((e, t) => e - t), s = (e) => o[Math.min(i - 1, Math.max(0, Math.floor(e * i)))], c = 0;
		for (let e = 0; e < i; e++) c += o[e];
		let l = s(.1), u = s(.9);
		return {
			sorted: o,
			mean: c / i,
			p10: l,
			p50: s(.5),
			p90: u,
			spread: u - l
		};
	}
	function pe(e) {
		let t = fe(e, 8);
		if (!t) return {
			threshold: .33,
			split: .67
		};
		let { sorted: n } = t, r = n.length, i = (e) => n[Math.min(r - 1, Math.max(0, Math.floor(e * r)))], a = ve(i(1 / 3)), o = ve(i(2 / 3));
		o - a < .12 && (a = ve(i(.3)), o = ve(i(.75))), o - a < .03 && (a = .35, o = .7);
		let s = n[0], c = n[r - 1], l = .02, u = s + l, d = c - l;
		return d - u < .04 ? (a = Math.max(.02, Math.round(s * 100) / 100), o = Math.min(.98, Math.round((s + .06) * 100) / 100)) : (a = ve(Math.min(Math.max(a, u), d - .03)), o = ve(Math.max(Math.min(o, d), a + .03))), {
			threshold: Math.round(a * 100) / 100,
			split: Math.round(o * 100) / 100
		};
	}
	function me() {
		if (!u) return null;
		let e = 0, t = 0, n = 0, r = 0, i = 0;
		if (u.traverse((a) => {
			if (!a.isMesh && !a.isSkinnedMesh) return;
			let o = Array.isArray(a.material) ? a.material : [a.material], s = 1;
			if (a.geometry) {
				a.geometry.boundingSphere || a.geometry.computeBoundingSphere?.();
				let e = a.geometry.boundingSphere?.radius;
				Number.isFinite(e) && e > 0 && (s = Math.max(.05, e * e));
			}
			for (let a of o) {
				if (!a?.color) continue;
				jh.copy(a.color), e += jh.r * s, t += jh.g * s, n += jh.b * s;
				let o = Math.max(jh.r, jh.g, jh.b), c = Math.min(jh.r, jh.g, jh.b);
				r += (o > 1e-4 ? (o - c) / o : 0) * s, i += s;
			}
		}), i < 1e-6) return {
			r: .55,
			g: .5,
			b: .45,
			sat: .15,
			lum: .5,
			hue: 30
		};
		e /= i, t /= i, n /= i;
		let a = .2126 * e + .7152 * t + .0722 * n;
		return {
			r: e,
			g: t,
			b: n,
			sat: r / i,
			lum: a,
			hue: xe(e, t, n)
		};
	}
	function he() {
		if (!l) return {
			keyX: Uh.keyX,
			keyY: Uh.keyY,
			keyZ: Uh.keyZ,
			fillX: Uh.fillX,
			fillY: Uh.fillY,
			fillZ: Uh.fillZ
		};
		l.updateMatrixWorld(!0);
		let e = new ui().setFromObject(l);
		if (e.isEmpty()) return {
			keyX: Uh.keyX,
			keyY: Uh.keyY,
			keyZ: Uh.keyZ,
			fillX: Uh.fillX,
			fillY: Uh.fillY,
			fillZ: Uh.fillZ
		};
		e.getSize(Mh);
		let t = Math.max(Mh.x, .01), n = Math.max(Mh.y, .01), r = Math.max(Mh.z, .01), i = n / Math.max(t, r), a = t / Math.max(n, r), o = be(2.2 + Math.min(1.2, a * .35)), s = be(4.2 + Math.min(2.4, i * 1.1)), c = be(3 + Math.min(1, r / Math.max(t, n) * .8));
		return {
			keyX: o,
			keyY: s,
			keyZ: c,
			fillX: be(-o * .55),
			fillY: be(Math.max(.8, s * .28)),
			fillZ: be(-c * .45)
		};
	}
	function ge(e, t, n) {
		let r = Number(t.keyIntensity) || Uh.keyIntensity, i = Number(t.fillIntensity) || Uh.fillIntensity, a = Number(t.ambientIntensity) || Uh.ambientIntensity, o = Number(t.contrast);
		Number.isFinite(o) || (o = Uh.contrast);
		let s = Number(t.gamma) || Uh.gamma, c = e.mean, l = e.spread, u = n?.lum ?? .5;
		return c < .4 ? (a += .1, i += .08, r += .08) : c < .5 ? (a += .05, i += .04) : c > .68 ? (r -= .18, a = Math.max(.28, a - .04), s = Math.min(1.25, s + .04)) : c > .6 && (r -= .08), l < .26 ? (r += .18, i = Math.max(.25, i - .04), a = Math.max(.28, a - .04), o = Math.min(22, o + 6)) : l < .34 ? (r += .08, o = Math.min(16, o + 4)) : l > .55 && (r -= .14, a = Math.min(.65, a + .08), i = Math.min(.9, i + .06), o = Math.max(0, o - 6), s = Math.max(.95, s - .03)), u < .28 ? (a += .08, i += .06, r += .1) : u > .72 && (r -= .1, s = Math.min(1.3, s + .04)), {
			keyIntensity: be(ye(r, .7, 2.2)),
			fillIntensity: be(ye(i, .2, 1.1)),
			ambientIntensity: be(ye(a, .25, .75)),
			contrast: Math.round(ye(o, -10, 28) / 2) * 2,
			gamma: be(ye(s, .9, 1.35))
		};
	}
	function _e(e) {
		if (!p) return {};
		let t = me(), n = he(), r = {
			...e,
			...n,
			keyIntensity: Uh.keyIntensity,
			fillIntensity: Uh.fillIntensity,
			ambientIntensity: Uh.ambientIntensity,
			contrast: Uh.contrast,
			gamma: Uh.gamma
		};
		for (let e = 0; e < 2; e++) {
			let n = fe(r, e === 0 ? 4 : 6);
			if (!n) break;
			Object.assign(r, ge(n, r, t));
		}
		let i = t?.sat ?? .15, a = pe({
			...r,
			colorMode: 3
		});
		return {
			...n,
			keyX: 2,
			keyY: 5,
			keyZ: 4,
			keyIntensity: r.keyIntensity,
			fillIntensity: Math.min(r.fillIntensity, .2),
			ambientIntensity: Math.max(r.ambientIntensity, .55),
			contrast: r.contrast,
			gamma: Math.max(r.gamma, 1.25),
			colorMix: .28,
			colorMode: 3,
			cellOutline: 0,
			threshold: a.threshold,
			split: a.split,
			__matHue: t?.hue ?? 30,
			__matSat: i,
			__matLum: t?.lum ?? .5
		};
	}
	function ve(e) {
		return Number.isFinite(e) ? e < 0 ? 0 : e > 1 ? 1 : e : .5;
	}
	function ye(e, t, n) {
		return Math.min(n, Math.max(t, e));
	}
	function be(e) {
		return Math.round(e * 100) / 100;
	}
	function xe(e, t, n) {
		let r = Math.max(e, t, n), i = r - Math.min(e, t, n);
		if (i < 1e-5) return 0;
		let a;
		return a = r === e ? (t - n) / i % 6 : r === t ? (n - e) / i + 2 : (e - t) / i + 4, a *= 60, a < 0 && (a += 360), a;
	}
	function Se() {
		return !u || !u.__actions || !u.__actions.length ? null : u.__actions[g] || u.__actions[0];
	}
	function Ce(e, t) {
		le(e, t);
	}
	async function we(t) {
		let n = Math.max(2, Math.min(240, t.fps)), r = Math.max(2, Math.round(t.duration * n)), i = Math.max(.1, t.duration), a = Math.max(Ih, Math.round(i / r * 1e3)), o = [], s = r + 1;
		for (let n = 0; n < s; n++) {
			le(n / r * i, t, i);
			let a = document.createElement("canvas");
			a.width = e.width, a.height = e.height, a.getContext("2d").drawImage(e, 0, 0), o.push(a);
		}
		o.pop();
		let { encodeAsciiGif: c } = await zh();
		return c({
			frames: o,
			colors: ue(t),
			delay: a,
			width: e.width,
			height: e.height
		});
	}
	async function Te(t, n = () => {}) {
		let r = Math.max(2, Math.min(240, t.fps)), i = Math.max(2, Math.round(t.duration * r)), a = Math.max(.1, t.duration), o = Math.max(Ih, Math.round(a / i * 1e3)), s = i + 1, c = [];
		for (let r = 0; r < s; r++) {
			le(r / i * a, t, a);
			let o = document.createElement("canvas");
			o.width = e.width, o.height = e.height, o.getContext("2d").drawImage(e, 0, 0), c.push(o), n(.5 * ((r + 1) / s)), await L();
		}
		c.pop();
		let { encodeAsciiGifAsync: l } = await zh();
		return l({
			frames: c,
			colors: ue(t),
			delay: o,
			width: e.width,
			height: e.height,
			onProgress: (e) => n(.5 + .5 * e)
		});
	}
	function L() {
		return new Promise((e) => setTimeout(e, 0));
	}
	return {
		loadModel: F,
		loadModelFromUrl: re,
		loadGltfFolder: ie,
		setActiveAnimation: ae,
		setMotionMode: oe,
		addAnimationFromFbx: se,
		setSettings: ce,
		setPointer: D,
		clearPointer: O,
		setReducedMotion: k,
		renderAt: le,
		renderPreview: Ce,
		capture: we,
		captureAsync: Te,
		balancedThresholds: pe,
		calibrateLook: _e,
		clearModel: C,
		recommendZoom: te,
		fitFrameToObject: ne,
		resetModelTransform: P,
		get ascii() {
			return a;
		},
		get hasAnimation() {
			return f;
		},
		get motionMode() {
			return h;
		},
		get renderer() {
			return t;
		},
		getExportRoot() {
			return u;
		}
	};
}
//#endregion
//#region _src/state.js
var Gh = [
	{
		id: "ember",
		name: "Ember",
		shadow: "#1a1a1a",
		highlight: "#FF6700",
		mid: "#FFC043"
	},
	{
		id: "denim",
		name: "Denim",
		shadow: "#1a1a1a",
		highlight: "#1d4ed8",
		mid: "#60a5fa"
	},
	{
		id: "carbon",
		name: "Carbon",
		shadow: "#1a1a1a",
		highlight: "#64748b",
		mid: "#94a3b8"
	},
	{
		id: "amber",
		name: "Amber",
		shadow: "#1a1a1a",
		highlight: "#d97706",
		mid: "#fbbf24"
	},
	{
		id: "forest",
		name: "Forest",
		shadow: "#1a1a1a",
		highlight: "#15803d",
		mid: "#4ade80"
	},
	{
		id: "wine",
		name: "Wine",
		shadow: "#1a1a1a",
		highlight: "#be123c",
		mid: "#fb7185"
	},
	{
		id: "ocean",
		name: "Ocean",
		shadow: "#1a1a1a",
		highlight: "#0284c7",
		mid: "#38bdf8"
	}
];
function Kh(e, t = .9) {
	let n = (typeof e == "string" ? Gh.find((t) => t.id === e) : e) || Gh[0];
	return {
		paletteId: n.id,
		colorA: n.shadow,
		colorB: n.highlight,
		colorC: n.mid
	};
}
function qh(e) {
	return (Number(e) || 0) * Math.PI / 180;
}
function Jh(e) {
	let t = { ...e }, n = !1;
	if (t.orbitH == null && t.cameraOmega != null && (t.orbitH = t.cameraOmega, n = !0), t.orbitV == null && t.cameraPhi != null && (t.orbitV = Number(t.cameraPhi) || 0, n = !0), t.zoom == null && t.cameraDistance != null && (t.zoom = t.cameraDistance, n = !0), (t.keyX == null || t.keyY == null || t.keyZ == null || t.keyIntensity == null) && (t.lightAzimuth != null || t.lightElevation != null)) {
		let e = qh(t.lightAzimuth ?? 45), r = qh(t.lightElevation ?? 40);
		t.keyX = 6 * Math.cos(r) * Math.cos(e), t.keyY = 6 * Math.sin(r), t.keyZ = 6 * Math.cos(r) * Math.sin(e), t.keyIntensity = t.keyIntensity ?? 1.8, t.fillX = -t.keyX * .5, t.fillY = Math.max(.5, t.keyY * .35), t.fillZ = -t.keyZ * .5, t.fillIntensity = t.fillIntensity ?? .3, t.ambientIntensity = t.ambientIntensity ?? .22, n = !0;
	}
	if (t.orbitH != null && (t.cameraOmega = t.orbitH), t.orbitV != null && (t.cameraPhi = t.orbitV), t.zoom != null && (t.cameraDistance = t.zoom), Number(t.duration) === 1.5 && (t.duration = Uh.duration, n = !0), typeof t.bgColor == "string" && /^#f5f3ee$/i.test(t.bgColor.trim()) && (t.bgColor = "transparent", n = !0), (Number(t.zoom) === 1.68 || Number(t.cameraDistance) === 1.68 || Number(t.zoom) === 2.45 || Number(t.cameraDistance) === 2.45) && (t.zoom = Uh.zoom, t.cameraDistance = Uh.zoom, n = !0), Number(t.colorMix) === .5 && (t.colorMix = Uh.colorMix, n = !0), Number(t.cellOutline) === 1 && t.paletteId && (t.cellOutline = 0, n = !0), typeof t.colorA == "string" && /^#(e8e4dc|f5f3ee|ffffff|faf8f4)$/i.test(t.colorA.trim())) {
		let e = Kh(t.paletteId || "ember");
		t.colorA = e.colorA, t.colorB || (t.colorB = e.colorB), t.colorC || (t.colorC = e.colorC), n = !0;
	}
	return {
		patch: t,
		changed: n
	};
}
//#endregion
//#region _src/embed/player.js
var Yh = /^(glb|fbx|obj|usdz|usd|usda|usdc)$/i;
function Xh(e) {
	let t = (String(e).split(".").pop() || "").toLowerCase();
	return Yh.test(t);
}
function Zh(e) {
	let { patch: t } = Jh(e || {});
	return {
		...Uh,
		...t
	};
}
function Qh(e) {
	return e.cameraFollow === "mouse" || !!Number(e.trailEnabled);
}
function $h(e, t) {
	if (!e) throw Error("Missing model src");
	if (/^(https?:|blob:|data:)/i.test(e)) return e;
	if (e.startsWith("/")) return (t || (typeof location < "u" ? location.origin : "")) + e;
	try {
		return new URL(e, t || (typeof location < "u" ? location.href : void 0)).href;
	} catch {
		return e;
	}
}
function eg(e, t) {
	e.classList.add("ascii-live"), e.style.width = e.style.width || "100%", e.style.maxWidth = e.style.maxWidth || "100%", e.style.aspectRatio = e.style.aspectRatio || String(t), e.style.position = e.style.position || "relative", e.style.overflow = "hidden", e.style.lineHeight = "0";
}
function tg(e, { busy: t, message: n, isError: r }) {
	t ? e.setAttribute("aria-busy", "true") : e.removeAttribute("aria-busy");
	let i = e.querySelector(".ascii-live__status");
	if (!n) {
		i?.remove(), e.removeAttribute("data-ascii-live-error");
		return;
	}
	i || (i = document.createElement("div"), i.className = "ascii-live__status", i.setAttribute("role", r ? "alert" : "status"), i.setAttribute("aria-live", r ? "assertive" : "polite"), Object.assign(i.style, {
		position: "absolute",
		inset: "0",
		display: "grid",
		placeItems: "center",
		padding: "1rem",
		textAlign: "center",
		fontFamily: "var(--sans, ui-sans-serif, system-ui, sans-serif)",
		fontSize: "0.875rem",
		lineHeight: "1.4",
		color: r ? "var(--status-bad, #9d0006)" : "currentColor",
		background: "color-mix(in srgb, var(--bg, Canvas) 88%, transparent)",
		zIndex: "2",
		pointerEvents: "none"
	}), e.appendChild(i)), i.textContent = n, i.setAttribute("role", r ? "alert" : "status"), i.setAttribute("aria-live", r ? "assertive" : "polite"), i.style.color = r ? "var(--status-bad, #9d0006)" : "currentColor", r ? e.setAttribute("data-ascii-live-error", n) : e.removeAttribute("data-ascii-live-error");
}
async function ng(e, t) {
	if (!e) throw Error("mount: element required");
	ag(e);
	let n = Zh(t.settings), r = $h(t.src, t.baseUrl), i = t.src.split("/").pop()?.split("?")[0] || "model.glb";
	if (!Xh(i)) {
		let t = "Live embed supports single-file models only (.glb, .fbx, .obj, .usd/.usdz)";
		throw eg(e, 16 / 9), tg(e, {
			busy: !1,
			message: t,
			isError: !0
		}), Error(t);
	}
	let a = Math.max(1, Math.round(n.gridWidth) || 96), o = Math.max(1, Math.round(n.gridHeight) || 54);
	eg(e, a / (o * vd)), tg(e, {
		busy: !0,
		message: "Loading…",
		isError: !1
	});
	let s = document.createElement("canvas");
	s.setAttribute("role", "img"), s.setAttribute("aria-label", t.ariaLabel || "ASCII animation"), s.style.width = "100%", s.style.height = "100%", s.style.display = "block", s.style.objectFit = "contain";
	let c = Qh(n);
	s.style.pointerEvents = c ? "auto" : "none", e.style.pointerEvents = c ? "auto" : "", e.appendChild(s);
	let l;
	try {
		l = Wh(s), t.motionMode && l.setMotionMode(t.motionMode), await l.loadModelFromUrl(r, i, n);
		let c = Math.max(640, a * o), u = l.fitFrameToObject(n, {
			margin: 1.08,
			spinSamples: 12
		}), d = Math.min(4, Math.max(.25, u.aspect || 1)) * vd, f = Math.round(Math.sqrt(c / Math.max(.2, d))), p = Math.round(f * d);
		p = Math.max(32, p - p % 2), f = Math.max(20, f - f % 2), n.gridWidth = p, n.gridHeight = f, n.zoom = u.zoom, n.cameraDistance = u.zoom;
		let m = l.fitFrameToObject(n, {
			margin: 1.08,
			spinSamples: 12
		});
		n.zoom = m.zoom, n.cameraDistance = m.zoom, eg(e, p / (f * vd));
	} catch (t) {
		try {
			l?.clearModel?.(), l?.renderer?.dispose?.();
		} catch {}
		s.remove();
		let n = t?.message || String(t) || "Failed to load model";
		throw tg(e, {
			busy: !1,
			message: n,
			isError: !0
		}), t instanceof Error ? t : Error(n);
	}
	tg(e, {
		busy: !1,
		message: "",
		isError: !1
	});
	let u = {
		el: e,
		canvas: s,
		engine: l,
		settings: n,
		raf: 0,
		lastDraw: 0,
		start: performance.now(),
		visible: !0,
		reduced: !1,
		disposed: !1
	};
	if (e.__asciiLive = u, c) {
		let e = (e) => {
			if (u.disposed || u.reduced) return;
			let t = s.getBoundingClientRect();
			if (!t.width || !t.height) return;
			let r = (e.clientX - t.left) / t.width * 2 - 1, i = (e.clientY - t.top) / t.height * 2 - 1;
			l.setPointer(r, i, n);
		}, t = () => {
			n.cameraFollow === "mouse" && l.setPointer(0, 0, n);
		};
		s.addEventListener("pointermove", e), s.addEventListener("pointerleave", t), u._onPointerMove = e, u._onPointerLeave = t;
	}
	let d = window.matchMedia("(prefers-reduced-motion: reduce)"), f = () => {
		u.reduced = d.matches, l.setReducedMotion(u.reduced), u.reduced ? (l.renderPreview(0, n), ig(u)) : u.visible && rg(u);
	};
	d.addEventListener("change", f), u._mq = d, u._syncReduced = f;
	let p = new IntersectionObserver((e) => {
		let t = e[0];
		u.visible = !!t?.isIntersecting, u.visible && !u.reduced ? rg(u) : ig(u);
	}, { threshold: .05 });
	return p.observe(e), u._io = p, f(), u.reduced || (l.renderPreview(0, n), rg(u)), { unmount: () => ag(e) };
}
function rg(e) {
	if (e.disposed || e.raf) return;
	let t = Math.max(.1, Number(e.settings.duration) || 6), n = (r) => {
		if (e.disposed || !e.visible || e.reduced) {
			e.raf = 0;
			return;
		}
		if (e.raf = requestAnimationFrame(n), r - e.lastDraw < 33.333333333333336) return;
		e.lastDraw = r;
		let i = (r - e.start) / 1e3 % t;
		e.engine.renderPreview(i, e.settings);
	};
	e.raf = requestAnimationFrame(n);
}
function ig(e) {
	e.raf && (cancelAnimationFrame(e.raf), e.raf = 0);
}
function ag(e) {
	if (!e) return;
	let t = e.__asciiLive;
	if (!t) {
		e.querySelectorAll("canvas, .ascii-live__status").forEach((e) => e.remove()), e.removeAttribute("aria-busy"), e.removeAttribute("data-ascii-live-error");
		return;
	}
	t.disposed = !0, ig(t);
	try {
		t._onPointerMove && t.canvas?.removeEventListener("pointermove", t._onPointerMove), t._onPointerLeave && t.canvas?.removeEventListener("pointerleave", t._onPointerLeave);
	} catch {}
	try {
		t._io?.disconnect();
	} catch {}
	try {
		t._mq?.removeEventListener("change", t._syncReduced);
	} catch {}
	try {
		t.engine.clearPointer?.(), t.engine.clearModel(), t.engine.renderer?.dispose?.();
	} catch {}
	t.canvas?.remove(), e.querySelectorAll(".ascii-live__status").forEach((e) => e.remove()), e.removeAttribute("aria-busy"), e.removeAttribute("data-ascii-live-error"), delete e.__asciiLive;
}
//#endregion
//#region _src/embed/entry.js
var og = "__asciiLiveBooted", sg = /* @__PURE__ */ new WeakMap();
async function cg(e, t) {
	let n = await ng(e, t);
	return sg.set(e, n), n;
}
function lg(e) {
	let t = sg.get(e);
	t ? (t.unmount(), sg.delete(e)) : ag(e);
}
function ug(e) {
	if (!e) return {};
	try {
		return JSON.parse(e);
	} catch (e) {
		return console.error("[ascii-live] bad data-settings", e), {};
	}
}
function dg(e, t) {
	e.setAttribute("data-ascii-live-error", t), e.removeAttribute("aria-busy");
	let n = e.querySelector(".ascii-live__status");
	n || (n = document.createElement("div"), n.className = "ascii-live__status", Object.assign(n.style, {
		position: "absolute",
		inset: "0",
		display: "grid",
		placeItems: "center",
		padding: "1rem",
		textAlign: "center",
		fontFamily: "var(--sans, ui-sans-serif, system-ui, sans-serif)",
		fontSize: "0.875rem",
		lineHeight: "1.4",
		color: "var(--status-bad, #9d0006)",
		background: "color-mix(in srgb, var(--bg, Canvas) 88%, transparent)",
		zIndex: "2"
	}), getComputedStyle(e).position === "static" && (e.style.position = "relative"), e.appendChild(n)), n.setAttribute("role", "alert"), n.setAttribute("aria-live", "assertive"), n.textContent = t;
}
async function fg(e) {
	if (sg.has(e) || e.__asciiLive || e.dataset.asciiLiveMounting === "1") return;
	let t = e.getAttribute("data-src") || e.dataset.src;
	if (!t) {
		dg(e, "Missing data-src for ASCII live embed"), console.error("[ascii-live] missing data-src");
		return;
	}
	e.dataset.asciiLiveMounting = "1";
	let n = ug(e.getAttribute("data-settings")), r = e.getAttribute("data-aria") || e.getAttribute("aria-label") || void 0, i = e.getAttribute("data-motion") || void 0;
	try {
		await cg(e, {
			src: t,
			settings: n,
			ariaLabel: r,
			motionMode: i
		});
	} catch (t) {
		console.error("[ascii-live] mount failed", t), e.getAttribute("data-ascii-live-error") || dg(e, t.message || String(t));
	} finally {
		delete e.dataset.asciiLiveMounting;
	}
}
function pg(e = document) {
	(e.querySelectorAll ? e.querySelectorAll("[data-ascii-live]") : []).forEach((e) => {
		fg(e);
	});
}
function mg() {
	typeof window < "u" && window[og] || (typeof window < "u" && (window[og] = !0), pg(document), new MutationObserver((e) => {
		for (let t of e) for (let e of t.addedNodes) e.nodeType === 1 && (e.matches?.("[data-ascii-live]") ? fg(e) : e.querySelectorAll && pg(e));
	}).observe(document.documentElement, {
		childList: !0,
		subtree: !0
	}));
}
typeof document < "u" && (document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", mg, { once: !0 }) : mg());
//#endregion
export { cg as mount, lg as unmount };
