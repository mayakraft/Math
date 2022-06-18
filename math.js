/* Math (c) Kraft, MIT License */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.math = factory());
}(this, (function () { 'use strict';

  const typeOf = function (obj) {
    switch (obj.constructor.name) {
      case "vector":
      case "matrix":
      case "segment":
      case "ray":
      case "line":
      case "circle":
      case "ellipse":
      case "rect":
      case "polygon": return obj.constructor.name;
    }
    if (typeof obj === "object") {
      if (obj.radius != null) { return "circle"; }
      if (obj.width != null) { return "rect"; }
      if (obj.x != null || typeof obj[0] === "number") { return "vector"; }
      if (obj[0] != null && obj[0].length && (typeof obj[0].x === "number" || typeof obj[0][0] === "number")) { return "segment"; }
      if (obj.vector != null && obj.origin != null) { return "line"; }
    }
    return undefined;
  };

  const resize = (d, v) => (v.length === d
    ? v
    : Array(d).fill(0).map((z, i) => (v[i] ? v[i] : z)));
  const resizeUp = (a, b) => {
    const size = a.length > b.length ? a.length : b.length;
    return [a, b].map(v => resize(size, v));
  };
  const resizeDown = (a, b) => {
    const size = a.length > b.length ? b.length : a.length;
    return [a, b].map(v => resize(size, v));
  };
  const countPlaces = function (num) {
    const m = (`${num}`).match(/(?:\.(\d+))?(?:[eE]([+-]?\d+))?$/);
    if (!m) { return 0; }
    return Math.max(0, (m[1] ? m[1].length : 0) - (m[2] ? +m[2] : 0));
  };
  const cleanNumber = function (num, places = 15) {
    if (typeof num !== "number") { return num; }
    const crop = parseFloat(num.toFixed(places));
    if (countPlaces(crop) === Math.min(places, countPlaces(num))) {
      return num;
    }
    return crop;
  };
  const isIterable = obj => obj != null
    && typeof obj[Symbol.iterator] === "function";
  const semiFlattenArrays = function () {
    switch (arguments.length) {
      case undefined:
      case 0: return Array.from(arguments);
      case 1: return isIterable(arguments[0]) && typeof arguments[0] !== "string"
        ? semiFlattenArrays(...arguments[0])
        : [arguments[0]];
      default:
        return Array.from(arguments).map(a => (isIterable(a)
          ? [...semiFlattenArrays(a)]
          : a));
    }
  };
  const flattenArrays = function () {
    switch (arguments.length) {
      case undefined:
      case 0: return Array.from(arguments);
      case 1: return isIterable(arguments[0]) && typeof arguments[0] !== "string"
        ? flattenArrays(...arguments[0])
        : [arguments[0]];
      default:
        return Array.from(arguments).map(a => (isIterable(a)
          ? [...flattenArrays(a)]
          : a)).reduce((a, b) => a.concat(b), []);
    }
  };

  var resizers = /*#__PURE__*/Object.freeze({
    __proto__: null,
    resize: resize,
    resizeUp: resizeUp,
    resizeDown: resizeDown,
    cleanNumber: cleanNumber,
    semiFlattenArrays: semiFlattenArrays,
    flattenArrays: flattenArrays
  });

  const EPSILON = 1e-6;
  const R2D = 180 / Math.PI;
  const D2R = Math.PI / 180;
  const TWO_PI = Math.PI * 2;

  var constants = /*#__PURE__*/Object.freeze({
    __proto__: null,
    EPSILON: EPSILON,
    R2D: R2D,
    D2R: D2R,
    TWO_PI: TWO_PI
  });

  const fnTrue = () => true;
  const fnSquare = n => n * n;
  const fnAdd = (a, b) => a + (b || 0);
  const fnNotUndefined = a => a !== undefined;
  const fnAnd = (a, b) => a && b;
  const fnCat = (a, b) => a.concat(b);
  const fnVec2Angle = v => Math.atan2(v[1], v[0]);
  const fnToVec2 = a => [Math.cos(a), Math.sin(a)];
  const fnEqual = (a, b) => a === b;
  const fnEpsilonEqual = (a, b) => Math.abs(a - b) < EPSILON;
  const include = (n, epsilon = EPSILON) => n > -epsilon;
  const exclude = (n, epsilon = EPSILON) => n > epsilon;
  const includeL = fnTrue;
  const excludeL = fnTrue;
  const includeR = include;
  const excludeR = exclude;
  const includeS = (t, e = EPSILON) => t > -e && t < 1 + e;
  const excludeS = (t, e = EPSILON) => t > e && t < 1 - e;
  const lineLimiter = dist => dist;
  const rayLimiter = dist => (dist < -EPSILON ? 0 : dist);
  const segmentLimiter = (dist) => {
    if (dist < -EPSILON) { return 0; }
    if (dist > 1 + EPSILON) { return 1; }
    return dist;
  };

  var functions = /*#__PURE__*/Object.freeze({
    __proto__: null,
    fnTrue: fnTrue,
    fnSquare: fnSquare,
    fnAdd: fnAdd,
    fnNotUndefined: fnNotUndefined,
    fnAnd: fnAnd,
    fnCat: fnCat,
    fnVec2Angle: fnVec2Angle,
    fnToVec2: fnToVec2,
    fnEqual: fnEqual,
    fnEpsilonEqual: fnEpsilonEqual,
    include: include,
    exclude: exclude,
    includeL: includeL,
    excludeL: excludeL,
    includeR: includeR,
    excludeR: excludeR,
    includeS: includeS,
    excludeS: excludeS,
    lineLimiter: lineLimiter,
    rayLimiter: rayLimiter,
    segmentLimiter: segmentLimiter
  });

  var Constructors = Object.create(null);

  const identity2x2 = [1, 0, 0, 1];
  const identity2x3 = identity2x2.concat(0, 0);
  const multiplyMatrix2Vector2 = (matrix, vector) => [
    matrix[0] * vector[0] + matrix[2] * vector[1] + matrix[4],
    matrix[1] * vector[0] + matrix[3] * vector[1] + matrix[5]
  ];
  const multiplyMatrix2Line2 = (matrix, vector, origin) => ({
    vector: [
      matrix[0] * vector[0] + matrix[2] * vector[1],
      matrix[1] * vector[0] + matrix[3] * vector[1]
    ],
    origin: [
      matrix[0] * origin[0] + matrix[2] * origin[1] + matrix[4],
      matrix[1] * origin[0] + matrix[3] * origin[1] + matrix[5]
    ],
  });
  const multiplyMatrices2 = (m1, m2) => [
    m1[0] * m2[0] + m1[2] * m2[1],
    m1[1] * m2[0] + m1[3] * m2[1],
    m1[0] * m2[2] + m1[2] * m2[3],
    m1[1] * m2[2] + m1[3] * m2[3],
    m1[0] * m2[4] + m1[2] * m2[5] + m1[4],
    m1[1] * m2[4] + m1[3] * m2[5] + m1[5]
  ];
  const determinant2 = m => m[0] * m[3] - m[1] * m[2];
  const invertMatrix2 = (m) => {
    const det = determinant2(m);
    if (Math.abs(det) < 1e-6 || isNaN(det) || !isFinite(m[4]) || !isFinite(m[5])) {
      return undefined;
    }
    return [
      m[3] / det,
      -m[1] / det,
      -m[2] / det,
      m[0] / det,
      (m[2] * m[5] - m[3] * m[4]) / det,
      (m[1] * m[4] - m[0] * m[5]) / det
    ];
  };
  const makeMatrix2Translate = (x = 0, y = 0) => identity2x2.concat(x, y);
  const makeMatrix2Scale = (x, y, origin = [0, 0]) => [
    x,
    0,
    0,
    y,
    x * -origin[0] + origin[0],
    y * -origin[1] + origin[1]
  ];
  const makeMatrix2Rotate = (angle, origin = [0, 0]) => {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    return [
      cos,
      sin,
      -sin,
      cos,
      origin[0],
      origin[1]
    ];
  };
  const makeMatrix2Reflect = (vector, origin = [0, 0]) => {
    const angle = Math.atan2(vector[1], vector[0]);
    const cosAngle = Math.cos(angle);
    const sinAngle = Math.sin(angle);
    const cos_Angle = Math.cos(-angle);
    const sin_Angle = Math.sin(-angle);
    const a = cosAngle * cos_Angle + sinAngle * sin_Angle;
    const b = cosAngle * -sin_Angle + sinAngle * cos_Angle;
    const c = sinAngle * cos_Angle + -cosAngle * sin_Angle;
    const d = sinAngle * -sin_Angle + -cosAngle * cos_Angle;
    const tx = origin[0] + a * -origin[0] + -origin[1] * c;
    const ty = origin[1] + b * -origin[0] + -origin[1] * d;
    return [a, b, c, d, tx, ty];
  };

  var matrix2 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    identity2x2: identity2x2,
    identity2x3: identity2x3,
    multiplyMatrix2Vector2: multiplyMatrix2Vector2,
    multiplyMatrix2Line2: multiplyMatrix2Line2,
    multiplyMatrices2: multiplyMatrices2,
    determinant2: determinant2,
    invertMatrix2: invertMatrix2,
    makeMatrix2Translate: makeMatrix2Translate,
    makeMatrix2Scale: makeMatrix2Scale,
    makeMatrix2Rotate: makeMatrix2Rotate,
    makeMatrix2Reflect: makeMatrix2Reflect
  });

  const magnitude = v => Math.sqrt(v
    .map(fnSquare)
    .reduce(fnAdd, 0));
  const magnitude2 = v => Math.sqrt(v[0] * v[0] + v[1] * v[1]);
  const magSquared = v => v
    .map(fnSquare)
    .reduce(fnAdd, 0);
  const normalize = (v) => {
    const m = magnitude(v);
    return m === 0 ? v : v.map(c => c / m);
  };
  const normalize2 = (v) => {
    const m = magnitude2(v);
    return m === 0 ? v : [v[0] / m, v[1] / m];
  };
  const scale = (v, s) => v.map(n => n * s);
  const scale2 = (v, s) => [v[0] * s, v[1] * s];
  const add = (v, u) => v.map((n, i) => n + (u[i] || 0));
  const add2 = (v, u) => [v[0] + u[0], v[1] + u[1]];
  const subtract = (v, u) => v.map((n, i) => n - (u[i] || 0));
  const subtract2 = (v, u) => [v[0] - u[0], v[1] - u[1]];
  const dot = (v, u) => v
    .map((_, i) => v[i] * u[i])
    .reduce(fnAdd, 0);
  const dot2 = (v, u) => v[0] * u[0] + v[1] * u[1];
  const midpoint = (v, u) => v.map((n, i) => (n + u[i]) / 2);
  const midpoint2 = (v, u) => scale2(add2(v, u), 0.5);
  const average = function () {
    if (arguments.length === 0) { return []; }
    const dimension = (arguments[0].length > 0) ? arguments[0].length : 0;
    const sum = Array(dimension).fill(0);
    Array.from(arguments)
      .forEach(vec => sum.forEach((_, i) => { sum[i] += vec[i] || 0; }));
    return sum.map(n => n / arguments.length);
  };
  const lerp = (v, u, t) => {
    const inv = 1.0 - t;
    return v.map((n, i) => n * inv + (u[i] || 0) * t);
  };
  const cross2 = (v, u) => v[0] * u[1] - v[1] * u[0];
  const cross3 = (v, u) => [
    v[1] * u[2] - v[2] * u[1],
    v[2] * u[0] - v[0] * u[2],
    v[0] * u[1] - v[1] * u[0],
  ];
  const distance = (v, u) => Math.sqrt(v
    .map((_, i) => (v[i] - u[i]) ** 2)
    .reduce(fnAdd, 0));
  const distance2 = (v, u) => {
    const p = v[0] - u[0];
    const q = v[1] - u[1];
    return Math.sqrt((p * p) + (q * q));
  };
  const distance3 = (v, u) => {
    const a = v[0] - u[0];
    const b = v[1] - u[1];
    const c = v[2] - u[2];
    return Math.sqrt((a * a) + (b * b) + (c * c));
  };
  const flip = v => v.map(n => -n);
  const rotate90 = v => [-v[1], v[0]];
  const rotate270 = v => [v[1], -v[0]];
  const degenerate = (v, epsilon = EPSILON) => v
    .map(n => Math.abs(n))
    .reduce(fnAdd, 0) < epsilon;
  const parallel = (v, u, epsilon = EPSILON) => 1 - Math
    .abs(dot(normalize(v), normalize(u))) < epsilon;
  const parallel2 = (v, u, epsilon = EPSILON) => Math
    .abs(cross2(v, u)) < epsilon;

  var algebra = /*#__PURE__*/Object.freeze({
    __proto__: null,
    magnitude: magnitude,
    magnitude2: magnitude2,
    magSquared: magSquared,
    normalize: normalize,
    normalize2: normalize2,
    scale: scale,
    scale2: scale2,
    add: add,
    add2: add2,
    subtract: subtract,
    subtract2: subtract2,
    dot: dot,
    dot2: dot2,
    midpoint: midpoint,
    midpoint2: midpoint2,
    average: average,
    lerp: lerp,
    cross2: cross2,
    cross3: cross3,
    distance: distance,
    distance2: distance2,
    distance3: distance3,
    flip: flip,
    rotate90: rotate90,
    rotate270: rotate270,
    degenerate: degenerate,
    parallel: parallel,
    parallel2: parallel2
  });

  const identity3x3 = Object.freeze([1, 0, 0, 0, 1, 0, 0, 0, 1]);
  const identity3x4 = Object.freeze(identity3x3.concat(0, 0, 0));
  const isIdentity3x4 = m => identity3x4
    .map((n, i) => Math.abs(n - m[i]) < EPSILON)
    .reduce((a, b) => a && b, true);
  const multiplyMatrix3Vector3 = (m, vector) => [
    m[0] * vector[0] + m[3] * vector[1] + m[6] * vector[2] + m[9],
    m[1] * vector[0] + m[4] * vector[1] + m[7] * vector[2] + m[10],
    m[2] * vector[0] + m[5] * vector[1] + m[8] * vector[2] + m[11]
  ];
  const multiplyMatrix3Line3 = (m, vector, origin) => ({
    vector: [
      m[0] * vector[0] + m[3] * vector[1] + m[6] * vector[2],
      m[1] * vector[0] + m[4] * vector[1] + m[7] * vector[2],
      m[2] * vector[0] + m[5] * vector[1] + m[8] * vector[2]
    ],
    origin: [
      m[0] * origin[0] + m[3] * origin[1] + m[6] * origin[2] + m[9],
      m[1] * origin[0] + m[4] * origin[1] + m[7] * origin[2] + m[10],
      m[2] * origin[0] + m[5] * origin[1] + m[8] * origin[2] + m[11]
    ],
  });
  const multiplyMatrices3 = (m1, m2) => [
    m1[0] * m2[0] + m1[3] * m2[1] + m1[6] * m2[2],
    m1[1] * m2[0] + m1[4] * m2[1] + m1[7] * m2[2],
    m1[2] * m2[0] + m1[5] * m2[1] + m1[8] * m2[2],
    m1[0] * m2[3] + m1[3] * m2[4] + m1[6] * m2[5],
    m1[1] * m2[3] + m1[4] * m2[4] + m1[7] * m2[5],
    m1[2] * m2[3] + m1[5] * m2[4] + m1[8] * m2[5],
    m1[0] * m2[6] + m1[3] * m2[7] + m1[6] * m2[8],
    m1[1] * m2[6] + m1[4] * m2[7] + m1[7] * m2[8],
    m1[2] * m2[6] + m1[5] * m2[7] + m1[8] * m2[8],
    m1[0] * m2[9] + m1[3] * m2[10] + m1[6] * m2[11] + m1[9],
    m1[1] * m2[9] + m1[4] * m2[10] + m1[7] * m2[11] + m1[10],
    m1[2] * m2[9] + m1[5] * m2[10] + m1[8] * m2[11] + m1[11]
  ];
  const determinant3 = m => (
      m[0] * m[4] * m[8]
    - m[0] * m[7] * m[5]
    - m[3] * m[1] * m[8]
    + m[3] * m[7] * m[2]
    + m[6] * m[1] * m[5]
    - m[6] * m[4] * m[2]
  );
  const invertMatrix3 = (m) => {
    const det = determinant3(m);
    if (Math.abs(det) < 1e-6 || isNaN(det)
      || !isFinite(m[9]) || !isFinite(m[10]) || !isFinite(m[11])) {
      return undefined;
    }
    const inv = [
      m[4] * m[8] - m[7] * m[5],
      -m[1] * m[8] + m[7] * m[2],
      m[1] * m[5] - m[4] * m[2],
      -m[3] * m[8] + m[6] * m[5],
      m[0] * m[8] - m[6] * m[2],
      -m[0] * m[5] + m[3] * m[2],
      m[3] * m[7] - m[6] * m[4],
      -m[0] * m[7] + m[6] * m[1],
      m[0] * m[4] - m[3] * m[1],
      -m[3] * m[7] * m[11] + m[3] * m[8] * m[10] + m[6] * m[4] * m[11]
        - m[6] * m[5] * m[10] - m[9] * m[4] * m[8] + m[9] * m[5] * m[7],
      m[0] * m[7] * m[11] - m[0] * m[8] * m[10] - m[6] * m[1] * m[11]
        + m[6] * m[2] * m[10] + m[9] * m[1] * m[8] - m[9] * m[2] * m[7],
      -m[0] * m[4] * m[11] + m[0] * m[5] * m[10] + m[3] * m[1] * m[11]
        - m[3] * m[2] * m[10] - m[9] * m[1] * m[5] + m[9] * m[2] * m[4]
    ];
    const invDet = 1.0 / det;
    return inv.map(n => n * invDet);
  };
  const makeMatrix3Translate = (x = 0, y = 0, z = 0) => identity3x3.concat(x, y, z);
  const singleAxisRotate = (angle, origin, i0, i1, sgn) => {
    const mat = identity3x3.concat([0, 1, 2].map(i => origin[i] || 0));
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    mat[i0*3 + i0] = cos;
    mat[i0*3 + i1] = (sgn ? +1 : -1) * sin;
    mat[i1*3 + i0] = (sgn ? -1 : +1) * sin;
    mat[i1*3 + i1] = cos;
    return mat;
  };
  const makeMatrix3RotateX = (angle, origin = [0, 0, 0]) => singleAxisRotate(angle, origin, 1, 2, true);
  const makeMatrix3RotateY = (angle, origin = [0, 0, 0]) => singleAxisRotate(angle, origin, 0, 2, false);
  const makeMatrix3RotateZ = (angle, origin = [0, 0, 0]) => singleAxisRotate(angle, origin, 0, 1, true);
  const makeMatrix3Rotate = (angle, vector = [0, 0, 1], origin = [0, 0, 0]) => {
    const pos = [0, 1, 2].map(i => origin[i] || 0);
    const [x, y, z] = resize(3, normalize(vector));
    const c = Math.cos(angle);
    const s = Math.sin(angle);
    const t = 1 - c;
    const trans     = identity3x3.concat(-pos[0], -pos[1], -pos[2]);
    const trans_inv = identity3x3.concat(pos[0], pos[1], pos[2]);
    return multiplyMatrices3(trans_inv, multiplyMatrices3([
      t * x * x + c,     t * y * x + z * s, t * z * x - y * s,
      t * x * y - z * s, t * y * y + c,     t * z * y + x * s,
      t * x * z + y * s, t * y * z - x * s, t * z * z + c,
      0, 0, 0], trans));
  };
  const makeMatrix3Scale = (scale = 1, origin = [0, 0, 0]) => [
    scale,
    0,
    0,
    0,
    scale,
    0,
    0,
    0,
    scale,
    scale * -origin[0] + origin[0],
    scale * -origin[1] + origin[1],
    scale * -origin[2] + origin[2]
  ];
  const makeMatrix3ReflectZ = (vector, origin = [0, 0]) => {
    const angle = Math.atan2(vector[1], vector[0]);
    const cosAngle = Math.cos(angle);
    const sinAngle = Math.sin(angle);
    const cos_Angle = Math.cos(-angle);
    const sin_Angle = Math.sin(-angle);
    const a = cosAngle * cos_Angle + sinAngle * sin_Angle;
    const b = cosAngle * -sin_Angle + sinAngle * cos_Angle;
    const c = sinAngle * cos_Angle + -cosAngle * sin_Angle;
    const d = sinAngle * -sin_Angle + -cosAngle * cos_Angle;
    const tx = origin[0] + a * -origin[0] + -origin[1] * c;
    const ty = origin[1] + b * -origin[0] + -origin[1] * d;
    return [a, b, 0, c, d, 0, 0, 0, 1, tx, ty, 0];
  };

  var matrix3 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    identity3x3: identity3x3,
    identity3x4: identity3x4,
    isIdentity3x4: isIdentity3x4,
    multiplyMatrix3Vector3: multiplyMatrix3Vector3,
    multiplyMatrix3Line3: multiplyMatrix3Line3,
    multiplyMatrices3: multiplyMatrices3,
    determinant3: determinant3,
    invertMatrix3: invertMatrix3,
    makeMatrix3Translate: makeMatrix3Translate,
    makeMatrix3RotateX: makeMatrix3RotateX,
    makeMatrix3RotateY: makeMatrix3RotateY,
    makeMatrix3RotateZ: makeMatrix3RotateZ,
    makeMatrix3Rotate: makeMatrix3Rotate,
    makeMatrix3Scale: makeMatrix3Scale,
    makeMatrix3ReflectZ: makeMatrix3ReflectZ
  });

  const vectorOriginForm = (vector, origin) => ({
    vector: vector || [],
    origin: origin || []
  });
  const getVector = function () {
    if (arguments[0] instanceof Constructors.vector) { return arguments[0]; }
    let list = flattenArrays(arguments);
    if (list.length > 0
      && typeof list[0] === "object"
      && list[0] !== null
      && !isNaN(list[0].x)) {
      list = ["x", "y", "z"]
        .map(c => list[0][c])
        .filter(fnNotUndefined);
    }
    return list.filter(n => typeof n === "number");
  };
  const getVectorOfVectors = function () {
    return semiFlattenArrays(arguments)
      .map(el => getVector(el));
  };
  const getSegment = function () {
    if (arguments[0] instanceof Constructors.segment) {
      return arguments[0];
    }
    const args = semiFlattenArrays(arguments);
    if (args.length === 4) {
      return [
        [args[0], args[1]],
        [args[2], args[3]]
      ];
    }
    return args.map(el => getVector(el));
  };
  const getLine = function () {
    const args = semiFlattenArrays(arguments);
    if (args.length === 0) { return vectorOriginForm([], []); }
    if (args[0] instanceof Constructors.line
      || args[0] instanceof Constructors.ray
      || args[0] instanceof Constructors.segment) { return args[0]; }
    if (args[0].constructor === Object && args[0].vector !== undefined) {
      return vectorOriginForm(args[0].vector || [], args[0].origin || []);
    }
    return typeof args[0] === "number"
      ? vectorOriginForm(getVector(args))
      : vectorOriginForm(...args.map(a => getVector(a)));
  };
  const getRay = getLine;
  const getRectParams = (x = 0, y = 0, width = 0, height = 0) => ({
    x, y, width, height
  });
  const getRect = function () {
    if (arguments[0] instanceof Constructors.rect) { return arguments[0]; }
    const list = flattenArrays(arguments);
    if (list.length > 0
      && typeof list[0] === "object"
      && list[0] !== null
      && !isNaN(list[0].width)) {
      return getRectParams(...["x", "y", "width", "height"]
        .map(c => list[0][c])
        .filter(fnNotUndefined));
    }
    const numbers = list.filter(n => typeof n === "number");
    const rect_params = numbers.length < 4
      ? [, , ...numbers]
      : numbers;
    return getRectParams(...rect_params);
  };
  const getCircleParams = (radius = 1, ...args) => ({
  	radius,
  	origin: [...args],
  });
  const getCircle = function () {
  	if (arguments[0] instanceof Constructors.circle) { return arguments[0]; }
    const vectors = getVectorOfVectors(arguments);
    const numbers = flattenArrays(arguments).filter(a => typeof a === "number");
    if (arguments.length === 2) {
      if (vectors[1].length === 1) {
  			return getCircleParams(vectors[1][0], ...vectors[0]);
      } else if (vectors[0].length === 1) {
  			return getCircleParams(vectors[0][0], ...vectors[1]);
      } else if (vectors[0].length > 1 && vectors[1].length > 1) {
  			return getCircleParams(distance2(...vectors), ...vectors[0]);
      }
    }
    else {
      switch (numbers.length) {
        case 0: return getCircleParams(1, 0, 0, 0);
        case 1: return getCircleParams(numbers[0], 0, 0, 0);
        default: return getCircleParams(numbers.pop(), ...numbers);
      }
    }
  	return getCircleParams(1, 0, 0, 0);
  };
  const maps_3x4 = [
    [0, 1, 3, 4, 9, 10],
    [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
    [0, 1, 2, undefined, 3, 4, 5, undefined, 6, 7, 8, undefined, 9, 10, 11]
  ];
  [11, 7, 3].forEach(i => delete maps_3x4[2][i]);
  const matrixMap3x4 = len => {
    let i;
    if (len < 8) i = 0;
    else if (len < 13) i = 1;
    else i = 2;
    return maps_3x4[i];
  };
  const getMatrix3x4 = function () {
    const mat = flattenArrays(arguments);
    const matrix = [...identity3x4];
    matrixMap3x4(mat.length)
      .forEach((n, i) => { if (mat[i] != null) { matrix[n] = mat[i]; } });
    return matrix;
  };

  var getters = /*#__PURE__*/Object.freeze({
    __proto__: null,
    getVector: getVector,
    getVectorOfVectors: getVectorOfVectors,
    getSegment: getSegment,
    getLine: getLine,
    getRay: getRay,
    getRectParams: getRectParams,
    getRect: getRect,
    getCircle: getCircle,
    getMatrix3x4: getMatrix3x4
  });

  const arraySimilarityTest = (list, compFunc) => Array
    .from(Array(list.length - 1))
    .map((_, i) => compFunc(list[0], list[i + 1]))
    .reduce(fnAnd, true);
  const equivalentVector2 = (a, b) => [0, 1]
    .map(i => fnEpsilonEqual(a[i], b[i]))
    .reduce(fnAnd, true);
  const equivalentNumbers = function () {
    if (arguments.length === 0) { return false; }
    if (arguments.length === 1 && arguments[0] !== undefined) {
      return equivalentNumbers(...arguments[0]);
    }
    return arraySimilarityTest(arguments, fnEpsilonEqual);
  };
  const equivalentVectors = function () {
    const args = Array.from(arguments);
    const length = args.map(a => a.length).reduce((a, b) => a > b ? a : b);
    const vecs = args.map(a => resize(length, a));
    return Array.from(Array(arguments.length - 1))
      .map((_, i) => vecs[0]
        .map((_, n) => Math.abs(vecs[0][n] - vecs[i + 1][n]) < EPSILON)
        .reduce(fnAnd, true))
      .reduce(fnAnd, true);
  };
  const equivalent = function () {
    const list = semiFlattenArrays(...arguments);
    if (list.length < 1) { return false; }
    const typeofList = typeof list[0];
    if (typeofList === "undefined") { return false; }
    switch (typeofList) {
      case "number":
        return arraySimilarityTest(list, fnEpsilonEqual);
      case "boolean":
      case "string":
        return arraySimilarityTest(list, fnEqual);
      case "object":
        if (list[0].constructor === Array) { return equivalentVectors(...list); }
        return arraySimilarityTest(list, (a, b) => JSON.stringify(a) === JSON.stringify(b));
      default: return undefined;
    }
  };

  var equal = /*#__PURE__*/Object.freeze({
    __proto__: null,
    equivalentVector2: equivalentVector2,
    equivalentNumbers: equivalentNumbers,
    equivalentVectors: equivalentVectors,
    equivalent: equivalent
  });

  const sortPointsAlongVector2 = (points, vector) => points
  	.map(point => ({ point, d: point[0] * vector[0] + point[1] * vector[1] }))
  	.sort((a, b) => a.d - b.d)
  	.map(a => a.point);

  var sort = /*#__PURE__*/Object.freeze({
    __proto__: null,
    sortPointsAlongVector2: sortPointsAlongVector2
  });

  const smallestComparisonSearch = (obj, array, compare_func) => {
    const objs = array.map((o, i) => ({ o, i, d: compare_func(obj, o) }));
    let index;
    let smallest_value = Infinity;
    for (let i = 0; i < objs.length; i += 1) {
      if (objs[i].d < smallest_value) {
        index = i;
        smallest_value = objs[i].d;
      }
    }
    return index;
  };
  const nearestPoint2 = (point, array_of_points) => {
    const index = smallestComparisonSearch(point, array_of_points, distance2);
    return index === undefined ? undefined : array_of_points[index];
  };
  const nearestPoint = (point, array_of_points) => {
    const index = smallestComparisonSearch(point, array_of_points, distance);
    return index === undefined ? undefined : array_of_points[index];
  };
  const nearestPointOnLine = (vector, origin, point, limiterFunc, epsilon = EPSILON) => {
    origin = resize(vector.length, origin);
    point = resize(vector.length, point);
    const magSq = magSquared(vector);
    const vectorToPoint = subtract(point, origin);
    const dotProd = dot(vector, vectorToPoint);
    const dist = dotProd / magSq;
    const d = limiterFunc(dist, epsilon);
    return add(origin, scale(vector, d))
  };
  const nearestPointOnPolygon = (polygon, point) => {
    const v = polygon
      .map((p, i, arr) => subtract(arr[(i + 1) % arr.length], p));
    return polygon
      .map((p, i) => nearestPointOnLine(v[i], p, point, segmentLimiter))
      .map((p, i) => ({ point: p, i, distance: distance(p, point) }))
      .sort((a, b) => a.distance - b.distance)
      .shift();
  };
  const nearestPointOnCircle = (radius, origin, point) => add(
    origin, scale(normalize(subtract(point, origin)), radius)
  );

  var nearest = /*#__PURE__*/Object.freeze({
    __proto__: null,
    smallestComparisonSearch: smallestComparisonSearch,
    nearestPoint2: nearestPoint2,
    nearestPoint: nearestPoint,
    nearestPointOnLine: nearestPointOnLine,
    nearestPointOnPolygon: nearestPointOnPolygon,
    nearestPointOnCircle: nearestPointOnCircle
  });

  const isCounterClockwiseBetween = (angle, floor, ceiling) => {
    while (ceiling < floor) { ceiling += TWO_PI; }
    while (angle > floor) { angle -= TWO_PI; }
    while (angle < floor) { angle += TWO_PI; }
    return angle < ceiling;
  };
  const clockwiseAngleRadians = (a, b) => {
    while (a < 0) { a += TWO_PI; }
    while (b < 0) { b += TWO_PI; }
    while (a > TWO_PI) { a -= TWO_PI; }
    while (b > TWO_PI) { b -= TWO_PI; }
    const a_b = a - b;
    return (a_b >= 0)
      ? a_b
      : TWO_PI - (b - a);
  };
  const counterClockwiseAngleRadians = (a, b) => {
    while (a < 0) { a += TWO_PI; }
    while (b < 0) { b += TWO_PI; }
    while (a > TWO_PI) { a -= TWO_PI; }
    while (b > TWO_PI) { b -= TWO_PI; }
    const b_a = b - a;
    return (b_a >= 0)
      ? b_a
      : TWO_PI - (a - b);
  };
  const clockwiseAngle2 = (a, b) => {
    const dotProduct = b[0] * a[0] + b[1] * a[1];
    const determinant = b[0] * a[1] - b[1] * a[0];
    let angle = Math.atan2(determinant, dotProduct);
    if (angle < 0) { angle += TWO_PI; }
    return angle;
  };
  const counterClockwiseAngle2 = (a, b) => {
    const dotProduct = a[0] * b[0] + a[1] * b[1];
    const determinant = a[0] * b[1] - a[1] * b[0];
    let angle = Math.atan2(determinant, dotProduct);
    if (angle < 0) { angle += TWO_PI; }
    return angle;
  };
  const clockwiseBisect2 = (a, b) => fnToVec2(
    fnVec2Angle(a) - clockwiseAngle2(a, b) / 2
  );
  const counterClockwiseBisect2 = (a, b) => fnToVec2(
    fnVec2Angle(a) + counterClockwiseAngle2(a, b) / 2
  );
  const clockwiseSubsectRadians = (divisions, angleA, angleB) => {
    const angle = clockwiseAngleRadians(angleA, angleB) / divisions;
    return Array.from(Array(divisions - 1))
      .map((_, i) => angleA + angle * (i + 1));
  };
  const counterClockwiseSubsectRadians = (divisions, angleA, angleB) => {
    const angle = counterClockwiseAngleRadians(angleA, angleB) / divisions;
    return Array.from(Array(divisions - 1))
      .map((_, i) => angleA + angle * (i + 1));
  };
  const clockwiseSubsect2 = (divisions, vectorA, vectorB) => {
    const angleA = Math.atan2(vectorA[1], vectorA[0]);
    const angleB = Math.atan2(vectorB[1], vectorB[0]);
    return clockwiseSubsectRadians(divisions, angleA, angleB)
      .map(fnToVec2);
  };
  const counterClockwiseSubsect2 = (divisions, vectorA, vectorB) => {
    const angleA = Math.atan2(vectorA[1], vectorA[0]);
    const angleB = Math.atan2(vectorB[1], vectorB[0]);
    return counterClockwiseSubsectRadians(divisions, angleA, angleB)
      .map(fnToVec2);
  };
  const bisectLines2 = (vectorA, originA, vectorB, originB, epsilon = EPSILON) => {
    const determinant = cross2(vectorA, vectorB);
    const dotProd = dot(vectorA, vectorB);
    const bisects = determinant > -epsilon
      ? [counterClockwiseBisect2(vectorA, vectorB)]
      : [clockwiseBisect2(vectorA, vectorB)];
    bisects[1] = determinant > -epsilon
      ? rotate90(bisects[0])
      : rotate270(bisects[0]);
    const numerator = (originB[0] - originA[0]) * vectorB[1] - vectorB[0] * (originB[1] - originA[1]);
    const t = numerator / determinant;
    const normalized = [vectorA, vectorB].map(vec => normalize(vec));
    const isParallel = Math.abs(cross2(...normalized)) < epsilon;
    const origin = isParallel
      ? midpoint(originA, originB)
      : [originA[0] + vectorA[0] * t, originA[1] + vectorA[1] * t];
    const solution = bisects.map(vector => ({ vector, origin }));
    if (isParallel) { delete solution[(dotProd > -epsilon ? 1 : 0)]; }
    return solution;
  };
  const counterClockwiseOrderRadians = function () {
    const radians = flattenArrays(arguments);
    const counter_clockwise = radians
      .map((_, i) => i)
      .sort((a, b) => radians[a] - radians[b]);
    return counter_clockwise
      .slice(counter_clockwise.indexOf(0), counter_clockwise.length)
      .concat(counter_clockwise.slice(0, counter_clockwise.indexOf(0)));
  };
  const counterClockwiseOrder2 = function () {
    return counterClockwiseOrderRadians(
      semiFlattenArrays(arguments).map(fnVec2Angle)
    );
  };
  const counterClockwiseSectorsRadians = function () {
    const radians = flattenArrays(arguments);
    const ordered = counterClockwiseOrderRadians(radians)
      .map(i => radians[i]);
    return ordered.map((rad, i, arr) => [rad, arr[(i + 1) % arr.length]])
      .map(pair => counterClockwiseAngleRadians(pair[0], pair[1]));
  };
  const counterClockwiseSectors2 = function () {
    return counterClockwiseSectorsRadians(
      getVectorOfVectors(arguments).map(fnVec2Angle)
    );
  };

  var radial = /*#__PURE__*/Object.freeze({
    __proto__: null,
    isCounterClockwiseBetween: isCounterClockwiseBetween,
    clockwiseAngleRadians: clockwiseAngleRadians,
    counterClockwiseAngleRadians: counterClockwiseAngleRadians,
    clockwiseAngle2: clockwiseAngle2,
    counterClockwiseAngle2: counterClockwiseAngle2,
    clockwiseBisect2: clockwiseBisect2,
    counterClockwiseBisect2: counterClockwiseBisect2,
    clockwiseSubsectRadians: clockwiseSubsectRadians,
    counterClockwiseSubsectRadians: counterClockwiseSubsectRadians,
    clockwiseSubsect2: clockwiseSubsect2,
    counterClockwiseSubsect2: counterClockwiseSubsect2,
    bisectLines2: bisectLines2,
    counterClockwiseOrderRadians: counterClockwiseOrderRadians,
    counterClockwiseOrder2: counterClockwiseOrder2,
    counterClockwiseSectorsRadians: counterClockwiseSectorsRadians,
    counterClockwiseSectors2: counterClockwiseSectors2
  });

  const overlapLinePoint = (vector, origin, point, func = excludeL, epsilon = EPSILON) => {
    const p2p = subtract(point, origin);
    const lineMagSq = magSquared(vector);
    const lineMag = Math.sqrt(lineMagSq);
    if (lineMag < epsilon) { return false; }
    const cross = cross2(p2p, vector.map(n => n / lineMag));
    const proj = dot(p2p, vector) / lineMagSq;
    return Math.abs(cross) < epsilon && func(proj, epsilon / lineMag);
  };

  const intersectLineLine = (
    aVector, aOrigin,
    bVector, bOrigin,
    aFunction = includeL,
    bFunction = includeL,
    epsilon = EPSILON
  ) => {
    const det_norm = cross2(normalize(aVector), normalize(bVector));
    if (Math.abs(det_norm) < epsilon) { return undefined; }
    const determinant0 = cross2(aVector, bVector);
    const determinant1 = -determinant0;
    const a2b = [bOrigin[0] - aOrigin[0], bOrigin[1] - aOrigin[1]];
    const b2a = [-a2b[0], -a2b[1]];
    const t0 = cross2(a2b, bVector) / determinant0;
    const t1 = cross2(b2a, aVector) / determinant1;
    if (aFunction(t0, epsilon / magnitude(aVector))
      && bFunction(t1, epsilon / magnitude(bVector))) {
      return add(aOrigin, scale(aVector, t0));
    }
    return undefined;
  };

  const circumcircle = function (a, b, c) {
    const A = b[0] - a[0];
    const B = b[1] - a[1];
    const C = c[0] - a[0];
    const D = c[1] - a[1];
    const E = A * (a[0] + b[0]) + B * (a[1] + b[1]);
    const F = C * (a[0] + c[0]) + D * (a[1] + c[1]);
    const G = 2 * (A * (c[1] - b[1]) - B * (c[0] - b[0]));
    if (Math.abs(G) < EPSILON) {
      const minx = Math.min(a[0], b[0], c[0]);
      const miny = Math.min(a[1], b[1], c[1]);
      const dx = (Math.max(a[0], b[0], c[0]) - minx) * 0.5;
      const dy = (Math.max(a[1], b[1], c[1]) - miny) * 0.5;
      return {
        origin: [minx + dx, miny + dy],
        radius: Math.sqrt(dx * dx + dy * dy),
      };
    }
    const origin = [(D * E - B * F) / G, (A * F - C * E) / G];
    const dx = origin[0] - a[0];
    const dy = origin[1] - a[1];
    return {
      origin,
      radius: Math.sqrt(dx * dx + dy * dy),
    };
  };
  const signedArea = points => 0.5 * points
    .map((el, i, arr) => {
      const next = arr[(i + 1) % arr.length];
      return el[0] * next[1] - next[0] * el[1];
    }).reduce(fnAdd, 0);
  const centroid = (points) => {
    const sixthArea = 1 / (6 * signedArea(points));
    return points.map((el, i, arr) => {
      const next = arr[(i + 1) % arr.length];
      const mag = el[0] * next[1] - next[0] * el[1];
      return [(el[0] + next[0]) * mag, (el[1] + next[1]) * mag];
    }).reduce((a, b) => [a[0] + b[0], a[1] + b[1]], [0, 0])
      .map(c => c * sixthArea);
  };
  const boundingBox = (points, padding = 0) => {
    const min = Array(points[0].length).fill(Infinity);
    const max = Array(points[0].length).fill(-Infinity);
    points.forEach(point => point
      .forEach((c, i) => {
        if (c < min[i]) { min[i] = c - padding; }
        if (c > max[i]) { max[i] = c + padding; }
      }));
    const span = max.map((max, i) => max - min[i]);
    return { min, max, span };
  };
  const angleArray = count => Array
    .from(Array(Math.floor(count)))
    .map((_, i) => TWO_PI * (i / count));
  const anglesToVecs = (angles, radius) => angles
    .map(a => [radius * Math.cos(a), radius * Math.sin(a)])
    .map(pt => pt.map(n => cleanNumber(n, 14)));
  const makePolygonCircumradius = (sides = 3, radius = 1) =>
    anglesToVecs(angleArray(sides), radius);
  const makePolygonCircumradiusS = (sides = 3, radius = 1) => {
    const halfwedge = Math.PI / sides;
    const angles = angleArray(sides).map(a => a + halfwedge);
    return anglesToVecs(angles, radius);
  };
  const makePolygonInradius = (sides = 3, radius = 1) =>
    makePolygonCircumradius(sides, radius / Math.cos(Math.PI / sides));
  const makePolygonInradiusS = (sides = 3, radius = 1) =>
    makePolygonCircumradiusS(sides, radius / Math.cos(Math.PI / sides));
  const makePolygonSideLength = (sides = 3, length = 1) =>
    makePolygonCircumradius(sides, (length / 2) / Math.sin(Math.PI / sides));
  const makePolygonSideLengthS = (sides = 3, length = 1) =>
    makePolygonCircumradiusS(sides, (length / 2) / Math.sin(Math.PI / sides));
  const makePolygonNonCollinear = (polygon, epsilon = EPSILON) => {
    const edges_vector = polygon
      .map((v, i, arr) => [v, arr[(i + 1) % arr.length]])
      .map(pair => subtract(pair[1], pair[0]));
    const vertex_collinear = edges_vector
      .map((vector, i, arr) => [vector, arr[(i + arr.length - 1) % arr.length]])
      .map(pair => !parallel(pair[1], pair[0], epsilon));
    return polygon
      .filter((vertex, v) => vertex_collinear[v]);
  };
  const pleatParallel = (count, a, b) => {
    const origins = Array.from(Array(count - 1))
      .map((_, i) => (i + 1) / count)
      .map(t => lerp(a.origin, b.origin, t));
    const vector = [...a.vector];
    return origins.map(origin => ({ origin, vector }));
  };
  const pleatAngle = (count, a, b) => {
    const origin = intersectLineLine(
      a.vector, a.origin,
      b.vector, b.origin);
    const vectors = clockwiseAngle2(a.vector, b.vector) < counterClockwiseAngle2(a.vector, b.vector)
      ? clockwiseSubsect2(count, a.vector, b.vector)
      : counterClockwiseSubsect2(count, a.vector, b.vector);
    return vectors.map(vector => ({ origin, vector }));
  };
  const pleat = (count, a, b) => {
    const lineA = getLine(a);
    const lineB = getLine(b);
    return parallel(lineA.vector, lineB.vector)
      ? pleatParallel(count, lineA, lineB)
      : pleatAngle(count, lineA, lineB);
  };
  const splitConvexPolygon = (poly, lineVector, linePoint) => {
    let vertices_intersections = poly.map((v, i) => {
      let intersection = overlapLinePoint(lineVector, linePoint, v, includeL);
      return { point: intersection ? v : null, at_index: i };
    }).filter(el => el.point != null);
    let edges_intersections = poly.map((v, i, arr) => ({
        point: intersectLineLine(
          lineVector,
          linePoint,
          subtract(v, arr[(i + 1) % arr.length]),
          arr[(i + 1) % arr.length],
          excludeL,
          excludeS),
        at_index: i }))
      .filter(el => el.point != null);
    if (edges_intersections.length == 2) {
      let sorted_edges = edges_intersections.slice()
        .sort((a,b) => a.at_index - b.at_index);
      let face_a = poly
        .slice(sorted_edges[1].at_index+1)
        .concat(poly.slice(0, sorted_edges[0].at_index+1));
      face_a.push(sorted_edges[0].point);
      face_a.push(sorted_edges[1].point);
      let face_b = poly
        .slice(sorted_edges[0].at_index+1, sorted_edges[1].at_index+1);
      face_b.push(sorted_edges[1].point);
      face_b.push(sorted_edges[0].point);
      return [face_a, face_b];
    } else if (edges_intersections.length == 1 && vertices_intersections.length == 1) {
      vertices_intersections[0]["type"] = "v";
      edges_intersections[0]["type"] = "e";
      let sorted_geom = vertices_intersections.concat(edges_intersections)
        .sort((a,b) => a.at_index - b.at_index);
      let face_a = poly.slice(sorted_geom[1].at_index+1)
        .concat(poly.slice(0, sorted_geom[0].at_index+1));
      if (sorted_geom[0].type === "e") { face_a.push(sorted_geom[0].point); }
      face_a.push(sorted_geom[1].point);
      let face_b = poly
        .slice(sorted_geom[0].at_index+1, sorted_geom[1].at_index+1);
      if (sorted_geom[1].type === "e") { face_b.push(sorted_geom[1].point); }
      face_b.push(sorted_geom[0].point);
      return [face_a, face_b];
    } else if (vertices_intersections.length == 2) {
      let sorted_vertices = vertices_intersections.slice()
        .sort((a,b) => a.at_index - b.at_index);
      let face_a = poly
        .slice(sorted_vertices[1].at_index)
        .concat(poly.slice(0, sorted_vertices[0].at_index+1));
      let face_b = poly
        .slice(sorted_vertices[0].at_index, sorted_vertices[1].at_index+1);
      return [face_a, face_b];
    }
    return [poly.slice()];
  };
  const convexHull = (points, include_collinear = false, epsilon = EPSILON) => {
    let INFINITE_LOOP = 10000;
    let sorted = points.slice().sort((a, b) =>
      (Math.abs(a[1] - b[1]) < epsilon
        ? a[0] - b[0]
        : a[1] - b[1]));
    let hull = [];
    hull.push(sorted[0]);
    let ang = 0;
    let infiniteLoop = 0;
    do {
      infiniteLoop += 1;
      let h = hull.length - 1;
      let angles = sorted
        .filter(el => !(Math.abs(el[0] - hull[h][0]) < epsilon
          && Math.abs(el[1] - hull[h][1]) < epsilon))
        .map((el) => {
          let angle = Math.atan2(hull[h][1] - el[1], hull[h][0] - el[0]);
          while (angle < ang) { angle += Math.PI * 2; }
          return { node: el, angle, distance: undefined };
        })
        .sort((a, b) => ((a.angle < b.angle) ? -1 : (a.angle > b.angle) ? 1 : 0));
      if (angles.length === 0) { return undefined; }
      let rightTurn = angles[0];
      angles = angles.filter(el => Math.abs(rightTurn.angle - el.angle) < epsilon)
        .map((el) => {
          let distance = Math.sqrt(((hull[h][0] - el.node[0]) ** 2) + ((hull[h][1] - el.node[1]) ** 2));
          el.distance = distance;
          return el;
        })
        .sort((a, b) => ((a.distance < b.distance) ? 1 : (a.distance > b.distance) ? -1 : 0));
      if (hull.filter(el => el === angles[0].node).length > 0) {
        return hull;
      }
      hull.push(angles[0].node);
      ang = Math.atan2(hull[h][1] - angles[0].node[1], hull[h][0] - angles[0].node[0]);
    } while (infiniteLoop < INFINITE_LOOP);
  };
  const recurseSkeleton = (points, lines, bisectors) => {
    const intersects = points
      .map((origin, i) => ({ vector: bisectors[i], origin }))
      .map((ray, i, arr) => intersectLineLine(
        ray.vector,
        ray.origin,
        arr[(i + 1) % arr.length].vector,
        arr[(i + 1) % arr.length].origin,
        excludeR,
        excludeR));
    const projections = lines.map((line, i) => nearestPointOnLine(
      line.vector, line.origin, intersects[i], a => a));
    if (points.length === 3) {
      return points.map(p => ({ type:"skeleton", points: [p, intersects[0]] }))
        .concat([{ type:"perpendicular", points: [projections[0], intersects[0]] }]);
    }
    const projectionLengths = intersects
      .map((intersect, i) => distance(intersect, projections[i]));
    let shortest = 0;
    projectionLengths.forEach((len, i) => {
      if (len < projectionLengths[shortest]) { shortest = i; }
    });
    const solutions = [
      { type:"skeleton",
        points: [points[shortest], intersects[shortest]] },
      { type:"skeleton",
        points: [points[(shortest + 1) % points.length], intersects[shortest]] },
      { type:"perpendicular", points: [projections[shortest], intersects[shortest]] }
    ];
    const newVector = clockwiseBisect2(
      flip(lines[(shortest + lines.length - 1) % lines.length].vector),
      lines[(shortest + 1) % lines.length].vector
    );
    const shortest_is_last_index = shortest === points.length - 1;
    points.splice(shortest, 2, intersects[shortest]);
    lines.splice(shortest, 1);
    bisectors.splice(shortest, 2, newVector);
    if (shortest_is_last_index) {
      points.splice(0, 1);
      bisectors.splice(0, 1);
      lines.push(lines.shift());
    }
    return solutions.concat(recurseSkeleton(points, lines, bisectors));
  };
  const straightSkeleton = (points) => {
    const lines = points
      .map((p, i, arr) => [p, arr[(i + 1) % arr.length]])
      .map(side => ({ vector: subtract(side[1], side[0]), origin: side[0] }));
    const bisectors = points
      .map((_, i, ar) => [(i - 1 + ar.length) % ar.length, i, (i + 1) % ar.length]
        .map(i => ar[i]))
      .map(p => [subtract(p[0], p[1]), subtract(p[2], p[1])])
      .map(v => clockwiseBisect2(...v));
    return recurseSkeleton([...points], lines, bisectors);
  };

  var geometry = /*#__PURE__*/Object.freeze({
    __proto__: null,
    circumcircle: circumcircle,
    signedArea: signedArea,
    centroid: centroid,
    boundingBox: boundingBox,
    makePolygonCircumradius: makePolygonCircumradius,
    makePolygonCircumradiusS: makePolygonCircumradiusS,
    makePolygonInradius: makePolygonInradius,
    makePolygonInradiusS: makePolygonInradiusS,
    makePolygonSideLength: makePolygonSideLength,
    makePolygonSideLengthS: makePolygonSideLengthS,
    makePolygonNonCollinear: makePolygonNonCollinear,
    pleat: pleat,
    splitConvexPolygon: splitConvexPolygon,
    convexHull: convexHull,
    straightSkeleton: straightSkeleton
  });

  const vectorOriginToUD = ({ vector, origin }) => {
    const mag = magnitude(vector);
    const u = rotate90(vector);
    const d = dot(origin, u) / mag;
    return { u: scale(u, 1 / mag), d };
  };
  const UDToVectorOrigin = ({ u, d }) => ({
    vector: rotate270(u),
    origin: scale(u, d),
  });

  var parameterize = /*#__PURE__*/Object.freeze({
    __proto__: null,
    vectorOriginToUD: vectorOriginToUD,
    UDToVectorOrigin: UDToVectorOrigin
  });

  const acosSafe = (x) => {
    if (x >= 1.0) return 0;
    if (x <= -1.0) return Math.PI;
    return Math.acos(x);
  };
  const rotateVector2 = (center, pt, a) => {
    const x = pt[0] - center[0];
    const y = pt[1] - center[1];
    const xRot = x * Math.cos(a) + y * Math.sin(a);
    const yRot = y * Math.cos(a) - x * Math.sin(a);
    return [center[0] + xRot, center[1] + yRot];
  };
  const intersectCircleCircle = (c1_radius, c1_origin, c2_radius, c2_origin, epsilon = EPSILON) => {
    const r = (c1_radius < c2_radius) ? c1_radius : c2_radius;
    const R = (c1_radius < c2_radius) ? c2_radius : c1_radius;
    const smCenter = (c1_radius < c2_radius) ? c1_origin : c2_origin;
    const bgCenter = (c1_radius < c2_radius) ? c2_origin : c1_origin;
    const vec = [smCenter[0] - bgCenter[0], smCenter[1] - bgCenter[1]];
    const d = Math.sqrt((vec[0] ** 2) + (vec[1] ** 2));
    if (d < epsilon) { return undefined; }
    const point = vec.map((v, i) => v / d * R + bgCenter[i]);
    if (Math.abs((R + r) - d) < epsilon
      || Math.abs(R - (r + d)) < epsilon) { return [point]; }
    if ((d + r) < R || (R + r < d)) { return undefined; }
    const angle = acosSafe((r * r - d * d - R * R) / (-2.0 * d * R));
    const pt1 = rotateVector2(bgCenter, point, +angle);
    const pt2 = rotateVector2(bgCenter, point, -angle);
    return [pt1, pt2];
  };

  const intersectCircleLine = (
    circle_radius, circle_origin,
    line_vector, line_origin,
    line_func = includeL,
    epsilon = EPSILON
  ) => {
    const magSq = line_vector[0] ** 2 + line_vector[1] ** 2;
    const mag = Math.sqrt(magSq);
    const norm = mag === 0 ? line_vector : line_vector.map(c => c / mag);
    const rot90 = rotate90(norm);
    const bvec = subtract(line_origin, circle_origin);
    const det = cross2(bvec, norm);
    if (Math.abs(det) > circle_radius + epsilon) { return undefined; }
    const side = Math.sqrt((circle_radius ** 2) - (det ** 2));
    const f = (s, i) => circle_origin[i] - rot90[i] * det + norm[i] * s;
    const results = Math.abs(circle_radius - Math.abs(det)) < epsilon
      ? [side].map((s) => [s, s].map(f))
      : [-side, side].map((s) => [s, s].map(f));
    const ts = results.map(res => res.map((n, i) => n - line_origin[i]))
      .map(v => v[0] * line_vector[0] + line_vector[1] * v[1])
      .map(d => d / magSq);
    return results.filter((_, i) => line_func(ts[i], epsilon));
  };

  const overlapConvexPolygonPoint = (poly, point, func = exclude, epsilon = EPSILON) => poly
    .map((p, i, arr) => [p, arr[(i + 1) % arr.length]])
    .map(s => cross2(normalize(subtract(s[1], s[0])), subtract(point, s[0])))
    .map(side => func(side, epsilon))
    .map((s, _, arr) => s === arr[0])
    .reduce((prev, curr) => prev && curr, true);

  const getUniquePair = (intersections) => {
    for (let i = 1; i < intersections.length; i += 1) {
      if (!equivalentVector2(intersections[0], intersections[i])) {
        return [intersections[0], intersections[i]];
      }
    }
  };
  const intersectConvexPolygonLineInclusive = (
    poly,
    vector, origin,
    fn_poly = includeS,
    fn_line = includeL,
    epsilon = EPSILON
  ) => {
    const intersections = poly
      .map((p, i, arr) => [p, arr[(i + 1) % arr.length]])
      .map(side => intersectLineLine(
        subtract(side[1], side[0]), side[0],
        vector, origin,
        fn_poly, fn_line,
        epsilon))
      .filter(a => a !== undefined);
    switch (intersections.length) {
      case 0: return undefined;
      case 1: return [intersections];
      default:
        return getUniquePair(intersections) || [intersections[0]];
    }
  };
  const intersectConvexPolygonLine = (
    poly,
    vector, origin,
    fn_poly = includeS,
    fn_line = excludeL,
    epsilon = EPSILON
  ) => {
    const sects = intersectConvexPolygonLineInclusive(poly, vector, origin, fn_poly, fn_line, epsilon);
    let altFunc;
    switch (fn_line) {
      case excludeR: altFunc = includeR; break;
      case excludeS: altFunc = includeS; break;
      default: return sects;
    }
    const includes = intersectConvexPolygonLineInclusive(poly, vector, origin, includeS, altFunc, epsilon);
    if (includes === undefined) { return undefined; }
    const uniqueIncludes = getUniquePair(includes);
    if (uniqueIncludes === undefined) {
      switch (fn_line) {
        case excludeL: return undefined;
        case excludeR:
          return overlapConvexPolygonPoint(poly, origin, exclude, epsilon)
            ? includes
            : undefined;
        case excludeS:
          return overlapConvexPolygonPoint(poly, add(origin, vector), exclude, epsilon)
            || overlapConvexPolygonPoint(poly, origin, exclude, epsilon)
            ? includes
            : undefined;
      }
    }
    return overlapConvexPolygonPoint(poly, midpoint(...uniqueIncludes), exclude, epsilon)
      ? uniqueIncludes
      : sects;
  };

  const intersectPolygonPolygon = (polygon1, polygon2, epsilon = EPSILON) => {
  	var cp1, cp2, s, e;
  	const inside = (p) => {
  		return ((cp2[0] - cp1[0]) * (p[1] - cp1[1]))
  			> ((cp2[1] - cp1[1]) * (p[0] - cp1[0]) + epsilon);
  	};
  	const intersection = () => {
  		var dc = [ cp1[0] - cp2[0], cp1[1] - cp2[1] ],
  			dp = [ s[0] - e[0], s[1] - e[1] ],
  			n1 = cp1[0] * cp2[1] - cp1[1] * cp2[0],
  			n2 = s[0] * e[1] - s[1] * e[0],
  			n3 = 1.0 / (dc[0] * dp[1] - dc[1] * dp[0]);
  		return [(n1*dp[0] - n2*dc[0]) * n3, (n1*dp[1] - n2*dc[1]) * n3];
  	};
  	var outputList = polygon1;
  	cp1 = polygon2[polygon2.length-1];
  	for (var j in polygon2) {
  		cp2 = polygon2[j];
  		var inputList = outputList;
  		outputList = [];
  		s = inputList[inputList.length - 1];
  		for (var i in inputList) {
  			e = inputList[i];
  			if (inside(e)) {
  				if (!inside(s)) {
  					outputList.push(intersection());
  				}
  				outputList.push(e);
  			}
  			else if (inside(s)) {
  				outputList.push(intersection());
  			}
  			s = e;
  		}
  		cp1 = cp2;
  	}
  	return outputList.length === 0 ? undefined : outputList;
  };

  const intersect_param_form = {
    polygon: a => [a],
    rect: a => [a],
    circle: a => [a.radius, a.origin],
    line: a => [a.vector, a.origin],
    ray: a => [a.vector, a.origin],
    segment: a => [a.vector, a.origin],
  };
  const intersect_func = {
    polygon: {
      polygon: intersectPolygonPolygon,
      line: (a, b, fnA, fnB, ep) => intersectConvexPolygonLine(...a, ...b, includeS, fnB, ep),
      ray: (a, b, fnA, fnB, ep) => intersectConvexPolygonLine(...a, ...b, includeS, fnB, ep),
      segment: (a, b, fnA, fnB, ep) => intersectConvexPolygonLine(...a, ...b, includeS, fnB, ep),
    },
    circle: {
      circle: (a, b, fnA, fnB, ep) => intersectCircleCircle(...a, ...b, ep),
      line: (a, b, fnA, fnB, ep) => intersectCircleLine(...a, ...b, fnB, ep),
      ray: (a, b, fnA, fnB, ep) => intersectCircleLine(...a, ...b, fnB, ep),
      segment: (a, b, fnA, fnB, ep) => intersectCircleLine(...a, ...b, fnB, ep),
    },
    line: {
      polygon: (a, b, fnA, fnB, ep) => intersectConvexPolygonLine(...b, ...a, includeS, fnA, ep),
      circle: (a, b, fnA, fnB, ep) => intersectCircleLine(...b, ...a, fnA, ep),
      line: (a, b, fnA, fnB, ep) => intersectLineLine(...a, ...b, fnA, fnB, ep),
      ray: (a, b, fnA, fnB, ep) => intersectLineLine(...a, ...b, fnA, fnB, ep),
      segment: (a, b, fnA, fnB, ep) => intersectLineLine(...a, ...b, fnA, fnB, ep),
    },
    ray: {
      polygon: (a, b, fnA, fnB, ep) => intersectConvexPolygonLine(...b, ...a, includeS, fnA, ep),
      circle: (a, b, fnA, fnB, ep) => intersectCircleLine(...b, ...a, fnA, ep),
      line: (a, b, fnA, fnB, ep) => intersectLineLine(...b, ...a, fnB, fnA, ep),
      ray: (a, b, fnA, fnB, ep) => intersectLineLine(...a, ...b, fnA, fnB, ep),
      segment: (a, b, fnA, fnB, ep) => intersectLineLine(...a, ...b, fnA, fnB, ep),
    },
    segment: {
      polygon: (a, b, fnA, fnB, ep) => intersectConvexPolygonLine(...b, ...a, includeS, fnA, ep),
      circle: (a, b, fnA, fnB, ep) => intersectCircleLine(...b, ...a, fnA, ep),
      line: (a, b, fnA, fnB, ep) => intersectLineLine(...b, ...a, fnB, fnA, ep),
      ray: (a, b, fnA, fnB, ep) => intersectLineLine(...b, ...a, fnB, fnA, ep),
      segment: (a, b, fnA, fnB, ep) => intersectLineLine(...a, ...b, fnA, fnB, ep),
    },
  };
  const similar_intersect_types = {
    polygon: "polygon",
    rect: "polygon",
    circle: "circle",
    line: "line",
    ray: "ray",
    segment: "segment",
  };
  const default_intersect_domain_function = {
    polygon: exclude,
    rect: exclude,
    circle: exclude,
    line: excludeL,
    ray: excludeR,
    segment: excludeS,
  };
  const intersect = function (a, b, epsilon) {
    const type_a = typeOf(a);
    const type_b = typeOf(b);
    const aT = similar_intersect_types[type_a];
    const bT = similar_intersect_types[type_b];
    const params_a = intersect_param_form[type_a](a);
    const params_b = intersect_param_form[type_b](b);
    const domain_a = a.domain_function || default_intersect_domain_function[type_a];
    const domain_b = b.domain_function || default_intersect_domain_function[type_b];
    return intersect_func[aT][bT](params_a, params_b, domain_a, domain_b, epsilon);
  };

  const overlapConvexPolygons = (poly1, poly2, epsilon = EPSILON) => {
    for (let p = 0; p < 2; p++) {
      const polyA = p === 0 ? poly1 : poly2;
      const polyB = p === 0 ? poly2 : poly1;
      for (let i = 0; i < polyA.length; i++) {
        const origin = polyA[i];
        const vector = rotate90(subtract(polyA[(i + 1) % polyA.length], polyA[i]));
        const projected = polyB
          .map(p => subtract(p, origin))
          .map(v => dot(vector, v));
        const other_test_point = polyA[(i + 2) % polyA.length];
        const side_a = dot(vector, subtract(other_test_point, origin));
        const side = side_a > 0;
        const one_sided = projected
          .map(dotProd => side ? dotProd < epsilon : dotProd > -epsilon)
          .reduce((a, b) => a && b, true);
        if (one_sided) { return false; }
      }
    }
    return true;
  };

  const overlapCirclePoint = (radius, origin, point, func = exclude, epsilon = EPSILON) =>
    func(radius - distance2(origin, point), epsilon);

  const overlapLineLine = (
    aVector, aOrigin,
    bVector, bOrigin,
    aFunction = excludeL,
    bFunction = excludeL,
    epsilon = EPSILON
  ) => {
    const denominator0 = cross2(aVector, bVector);
    const denominator1 = -denominator0;
    const a2b = [bOrigin[0] - aOrigin[0], bOrigin[1] - aOrigin[1]];
    if (Math.abs(denominator0) < epsilon) {
      if (Math.abs(cross2(a2b, aVector)) > epsilon) { return false; }
      const bPt1 = a2b;
      const bPt2 = add(bPt1, bVector);
      const aProjLen = dot(aVector, aVector);
      const bProj1 = dot(bPt1, aVector) / aProjLen;
      const bProj2 = dot(bPt2, aVector) / aProjLen;
      const bProjSm = bProj1 < bProj2 ? bProj1 : bProj2;
      const bProjLg = bProj1 < bProj2 ? bProj2 : bProj1;
      const bOutside1 = bProjSm > 1 - epsilon;
      const bOutside2 = bProjLg < epsilon;
      if (bOutside1 || bOutside2) { return false; }
      return true;
    }
    const b2a = [-a2b[0], -a2b[1]];
    const t0 = cross2(a2b, bVector) / denominator0;
    const t1 = cross2(b2a, aVector) / denominator1;
    return aFunction(t0, epsilon / magnitude(aVector))
      && bFunction(t1, epsilon / magnitude(bVector));
  };

  const overlap_param_form = {
    polygon: a => [a],
    rect: a => [a],
    circle: a => [a.radius, a.origin],
    line: a => [a.vector, a.origin],
    ray: a => [a.vector, a.origin],
    segment: a => [a.vector, a.origin],
    vector: a => [a],
  };
  const overlap_func = {
    polygon: {
      polygon: (a, b, fnA, fnB, ep) => overlapConvexPolygons(...a, ...b, ep),
      vector: (a, b, fnA, fnB, ep) => overlapConvexPolygonPoint(...a, ...b, fnA, ep),
    },
    circle: {
      vector: (a, b, fnA, fnB, ep) => overlapCirclePoint(...a, ...b, exclude, ep),
    },
    line: {
      line: (a, b, fnA, fnB, ep) => overlapLineLine(...a, ...b, fnA, fnB, ep),
      ray: (a, b, fnA, fnB, ep) => overlapLineLine(...a, ...b, fnA, fnB, ep),
      segment: (a, b, fnA, fnB, ep) => overlapLineLine(...a, ...b, fnA, fnB, ep),
      vector: (a, b, fnA, fnB, ep) => overlapLinePoint(...a, ...b, fnA, ep),
    },
    ray: {
      line: (a, b, fnA, fnB, ep) => overlapLineLine(...b, ...a, fnB, fnA, ep),
      ray: (a, b, fnA, fnB, ep) => overlapLineLine(...a, ...b, fnA, fnB, ep),
      segment: (a, b, fnA, fnB, ep) => overlapLineLine(...a, ...b, fnA, fnB, ep),
      vector: (a, b, fnA, fnB, ep) => overlapLinePoint(...a, ...b, fnA, ep),
    },
    segment: {
      line: (a, b, fnA, fnB, ep) => overlapLineLine(...b, ...a, fnB, fnA, ep),
      ray: (a, b, fnA, fnB, ep) => overlapLineLine(...b, ...a, fnB, fnA, ep),
      segment: (a, b, fnA, fnB, ep) => overlapLineLine(...a, ...b, fnA, fnB, ep),
      vector: (a, b, fnA, fnB, ep) => overlapLinePoint(...a, ...b, fnA, ep),
    },
    vector: {
      polygon: (a, b, fnA, fnB, ep) => overlapConvexPolygonPoint(...b, ...a, fnB, ep),
      circle: (a, b, fnA, fnB, ep) => overlapCirclePoint(...b, ...a, exclude, ep),
      line: (a, b, fnA, fnB, ep) => overlapLinePoint(...b, ...a, fnB, ep),
      ray: (a, b, fnA, fnB, ep) => overlapLinePoint(...b, ...a, fnB, ep),
      segment: (a, b, fnA, fnB, ep) => overlapLinePoint(...b, ...a, fnB, ep),
      vector: (a, b, fnA, fnB, ep) => equivalentVector2(...a, ...b, ep),
    },
  };
  const similar_overlap_types = {
    polygon: "polygon",
    rect: "polygon",
    circle: "circle",
    line: "line",
    ray: "ray",
    segment: "segment",
    vector: "vector",
  };
  const default_overlap_domain_function = {
    polygon: exclude,
    rect: exclude,
    circle: exclude,
    line: excludeL,
    ray: excludeR,
    segment: excludeS,
    vector: excludeL,
  };
  const overlap = function (a, b, epsilon) {
    const type_a = typeOf(a);
    const type_b = typeOf(b);
    const aT = similar_overlap_types[type_a];
    const bT = similar_overlap_types[type_b];
    const params_a = overlap_param_form[type_a](a);
    const params_b = overlap_param_form[type_b](b);
    const domain_a = a.domain_function || default_overlap_domain_function[type_a];
    const domain_b = b.domain_function || default_overlap_domain_function[type_b];
    return overlap_func[aT][bT](params_a, params_b, domain_a, domain_b, epsilon);
  };

  const encloseConvexPolygonsInclusive = (outer, inner) => {
    const outerGoesInside = outer
      .map(p => overlapConvexPolygonPoint(inner, p, include))
      .reduce((a, b) => a || b, false);
    const innerGoesOutside = inner
      .map(p => overlapConvexPolygonPoint(inner, p, include))
      .reduce((a, b) => a && b, true);
    return (!outerGoesInside && innerGoesOutside);
  };

  const overlapBoundingBoxes = (box1, box2) => {
    const dimensions = box1.min.length > box2.min.length
      ? box2.min.length
      : box1.min.length;
    for (let d = 0; d < dimensions; d++) {
      if (box1.min[d] > box2.max[d] || box1.max[d] < box2.min[d]) {
        return false;
      }
    }
    return true;
  };

  const lineLineParameter = (
    lineVector, lineOrigin,
    polyVector, polyOrigin,
    polyLineFunc = includeS,
    epsilon = EPSILON
  ) => {
    const det_norm = cross2(normalize(lineVector), normalize(polyVector));
    if (Math.abs(det_norm) < epsilon) { return undefined; }
    const determinant0 = cross2(lineVector, polyVector);
    const determinant1 = -determinant0;
    const a2b = subtract(polyOrigin, lineOrigin);
    const b2a = flip(a2b);
    const t0 = cross2(a2b, polyVector) / determinant0;
    const t1 = cross2(b2a, lineVector) / determinant1;
    if (polyLineFunc(t1, epsilon / magnitude(polyVector))) {
      return t0;
    }
    return undefined;
  };
  const linePointFromParameter = (vector, origin, t) => add(origin, scale(vector, t));
  const getIntersectParameters = (poly, vector, origin, polyLineFunc, epsilon) => poly
    .map((p, i, arr) => [subtract(arr[(i + 1) % arr.length], p), p])
    .map(side => lineLineParameter(
      vector, origin,
      side[0], side[1],
      polyLineFunc,
      epsilon))
    .filter(fnNotUndefined)
    .sort((a, b) => a - b);
  const getMinMax = (numbers, func, scaled_epsilon) => {
    let a = 0;
    let b = numbers.length - 1;
    while (a < b) {
      if (func(numbers[a+1] - numbers[a], scaled_epsilon)) { break; }
      a++;
    }
    while (b > a) {
      if (func(numbers[b] - numbers[b-1], scaled_epsilon)) { break; }
      b--;
    }
    if (a >= b) { return undefined; }
    return [numbers[a], numbers[b]];
  };
  const clip_line_in_convex_polygon = (
    poly,
    vector,
    origin,
    fnPoly = include,
    fnLine = includeL,
    epsilon = EPSILON
  ) => {
    const numbers = getIntersectParameters(poly, vector, origin, includeS, epsilon);
    if (numbers.length < 2) { return undefined; }
    const scaled_epsilon = (epsilon * 2) / magnitude(vector);
    const ends = getMinMax(numbers, fnPoly, scaled_epsilon);
    if (ends === undefined) { return undefined; }
    const ends_clip = ends.map((t, i) => fnLine(t) ? t : (t < 0.5 ? 0 : 1));
    if (Math.abs(ends_clip[0] - ends_clip[1]) < (epsilon * 2) / magnitude(vector)) {
      return undefined;
    }
    const mid = linePointFromParameter(vector, origin, (ends_clip[0] + ends_clip[1]) / 2);
    return overlapConvexPolygonPoint(poly, mid, fnPoly, epsilon)
      ? ends_clip.map(t => linePointFromParameter(vector, origin, t))
      : undefined;
  };

  const VectorArgs = function () {
    this.push(...getVector(arguments));
  };

  const VectorGetters = {
    x: function () { return this[0]; },
    y: function () { return this[1]; },
    z: function () { return this[2]; },
  };

  const table = {
    preserve: {
      magnitude: function () { return magnitude(this); },
      isEquivalent: function () {
        return equivalentVectors(this, getVector(arguments));
      },
      isParallel: function () {
        return parallel(...resizeUp(this, getVector(arguments)));
      },
      isCollinear: function (line) {
        return overlap(this, line);
      },
      dot: function () {
        return dot(...resizeUp(this, getVector(arguments)));
      },
      distanceTo: function () {
        return distance(...resizeUp(this, getVector(arguments)));
      },
      overlap: function (other) {
        return overlap(this, other);
      },
    },
    vector: {
      copy: function () { return [...this]; },
      normalize: function () { return normalize(this); },
      scale: function () { return scale(this, arguments[0]); },
      flip: function () { return flip(this); },
      rotate90: function () { return rotate90(this); },
      rotate270: function () { return rotate270(this); },
      cross: function () {
        return cross3(
          resize(3, this),
          resize(3, getVector(arguments))
        );
      },
      transform: function () {
        return multiplyMatrix3Vector3(
          getMatrix3x4(arguments),
          resize(3, this)
        );
      },
      add: function () {
        return add(this, resize(this.length, getVector(arguments)));
      },
      subtract: function () {
        return subtract(this, resize(this.length, getVector(arguments)));
      },
      rotateZ: function (angle, origin) {
        return multiplyMatrix3Vector3(
          getMatrix3x4(makeMatrix2Rotate(angle, origin)),
          resize(3, this)
        );
      },
      lerp: function (vector, pct) {
        return lerp(this, resize(this.length, getVector(vector)), pct);
      },
      midpoint: function () {
        return midpoint(...resizeUp(this, getVector(arguments)));
      },
      bisect: function () {
        return counterClockwiseBisect2(this, getVector(arguments));
      },
    }
  };
  const VectorMethods = {};
  Object.keys(table.preserve).forEach(key => {
    VectorMethods[key] = table.preserve[key];
  });
  Object.keys(table.vector).forEach(key => {
    VectorMethods[key] = function () {
      return Constructors.vector(...table.vector[key].apply(this, arguments));
    };
  });

  const VectorStatic = {
    fromAngle: function (angle) {
      return Constructors.vector(Math.cos(angle), Math.sin(angle));
    },
    fromAngleDegrees: function (angle) {
      return Constructors.vector.fromAngle(angle * D2R);
    },
  };

  var Vector = {
    vector: {
      P: Array.prototype,
      A: VectorArgs,
      G: VectorGetters,
      M: VectorMethods,
      S: VectorStatic,
    }
  };

  var Static = {
    fromPoints: function () {
      const points = getVectorOfVectors(arguments);
      return this.constructor({
        vector: subtract(points[1], points[0]),
        origin: points[0],
      });
    },
    fromAngle: function() {
      const angle = arguments[0] || 0;
      return this.constructor({
        vector: [Math.cos(angle), Math.sin(angle)],
        origin: [0, 0],
      });
    },
    perpendicularBisector: function () {
      const points = getVectorOfVectors(arguments);
      return this.constructor({
        vector: rotate90(subtract(points[1], points[0])),
        origin: average(points[0], points[1]),
      });
    },
  };

  const LinesMethods = {
    isParallel: function () {
      const arr = resizeUp(this.vector, getLine(arguments).vector);
      return parallel(...arr);
    },
    isCollinear: function () {
      const line = getLine(arguments);
      return overlapLinePoint(this.vector, this.origin, line.origin)
        && parallel(...resizeUp(this.vector, line.vector));
    },
    isDegenerate: function (epsilon = EPSILON) {
      return degenerate(this.vector, epsilon);
    },
    reflectionMatrix: function () {
      return Constructors.matrix(makeMatrix3ReflectZ(this.vector, this.origin));
    },
    nearestPoint: function () {
      const point = getVector(arguments);
      return Constructors.vector(
        nearestPointOnLine(this.vector, this.origin, point, this.clip_function)
      );
    },
    transform: function () {
      const dim = this.dimension;
      const r = multiplyMatrix3Line3(
        getMatrix3x4(arguments),
        resize(3, this.vector),
        resize(3, this.origin)
      );
      return this.constructor(resize(dim, r.vector), resize(dim, r.origin));
    },
    translate: function () {
      const origin = add(...resizeUp(this.origin, getVector(arguments)));
      return this.constructor(this.vector, origin);
    },
    intersect: function () {
      return intersect(this, ...arguments);
    },
    overlap: function () {
      return overlap(this, ...arguments);
    },
    bisect: function (lineType, epsilon) {
      const line = getLine(lineType);
      return bisectLines2(this.vector, this.origin, line.vector, line.origin, epsilon)
        .map(line => this.constructor(line));
    },
  };

  var Line = {
    line: {
      P: Object.prototype,
      A: function () {
        const l = getLine(...arguments);
        this.vector = Constructors.vector(l.vector);
        this.origin = Constructors.vector(resize(this.vector.length, l.origin));
        const ud = vectorOriginToUD({ vector: this.vector, origin: this.origin });
        this.u = ud.u;
        this.d = ud.d;
        Object.defineProperty(this, "domain_function", { writable: true, value: includeL });
      },
      G: {
        dimension: function () {
          return [this.vector, this.origin]
            .map(p => p.length)
            .reduce((a, b) => Math.max(a, b), 0);
        },
      },
      M: Object.assign({}, LinesMethods, {
        inclusive: function () { this.domain_function = includeL; return this; },
        exclusive: function () { this.domain_function = excludeL; return this; },
        clip_function: dist => dist,
        svgPath: function (length = 20000) {
          const start = add(this.origin, scale(this.vector, -length / 2));
          const end = scale(this.vector, length);
          return `M${start[0]} ${start[1]}l${end[0]} ${end[1]}`;
        },
      }),
      S: Object.assign({
        ud: function() {
          return this.constructor(UDToVectorOrigin(arguments[0]));
        },
      }, Static)
    }
  };

  var Ray = {
    ray: {
      P: Object.prototype,
      A: function () {
        const ray = getLine(...arguments);
        this.vector = Constructors.vector(ray.vector);
        this.origin = Constructors.vector(resize(this.vector.length, ray.origin));
        Object.defineProperty(this, "domain_function", { writable: true, value: includeR });
      },
      G: {
        dimension: function () {
          return [this.vector, this.origin]
            .map(p => p.length)
            .reduce((a, b) => Math.max(a, b), 0);
        },
      },
      M: Object.assign({}, LinesMethods, {
        inclusive: function () { this.domain_function = includeR; return this; },
        exclusive: function () { this.domain_function = excludeR; return this; },
        flip: function () {
          return Constructors.ray(flip(this.vector), this.origin);
        },
        scale: function (scale) {
          return Constructors.ray(this.vector.scale(scale), this.origin);
        },
        normalize: function () {
          return Constructors.ray(this.vector.normalize(), this.origin);
        },
        clip_function: rayLimiter,
        svgPath: function (length = 10000) {
          const end = this.vector.scale(length);
          return `M${this.origin[0]} ${this.origin[1]}l${end[0]} ${end[1]}`;
        },
      }),
      S: Static
    }
  };

  var Segment = {
    segment: {
      P: Array.prototype,
      A: function () {
        const a = getSegment(...arguments);
        this.push(...[a[0], a[1]].map(v => Constructors.vector(v)));
        this.vector = Constructors.vector(subtract(this[1], this[0]));
        this.origin = this[0];
        Object.defineProperty(this, "domain_function", { writable: true, value: includeS });
      },
      G: {
        points: function () { return this; },
        magnitude: function () { return magnitude(this.vector); },
        dimension: function () {
          return [this.vector, this.origin]
            .map(p => p.length)
            .reduce((a, b) => Math.max(a, b), 0);
        },
      },
      M: Object.assign({}, LinesMethods, {
        inclusive: function () { this.domain_function = includeS; return this; },
        exclusive: function () { this.domain_function = excludeS; return this; },
        clip_function: segmentLimiter,
        transform: function (...innerArgs) {
          const dim = this.points[0].length;
          const mat = getMatrix3x4(innerArgs);
          const transformed_points = this.points
            .map(point => resize(3, point))
            .map(point => multiplyMatrix3Vector3(mat, point))
            .map(point => resize(dim, point));
          return Constructors.segment(transformed_points);
        },
        translate: function() {
          const translate = getVector(arguments);
          const transformed_points = this.points
            .map(point => add(...resizeUp(point, translate)));
          return Constructors.segment(transformed_points);
        },
        midpoint: function () {
          return Constructors.vector(average(this.points[0], this.points[1]));
        },
        svgPath: function () {
          const pointStrings = this.points.map(p => `${p[0]} ${p[1]}`);
          return ["M", "L"].map((cmd, i) => `${cmd}${pointStrings[i]}`)
            .join("");
        },
      }),
      S: {
        fromPoints: function () {
          return this.constructor(...arguments);
        }
      }
    }
  };

  const CircleArgs = function () {
    const circle = getCircle(...arguments);
    this.radius = circle.radius;
    this.origin = Constructors.vector(...circle.origin);
  };

  const CircleGetters = {
    x: function () { return this.origin[0]; },
    y: function () { return this.origin[1]; },
    z: function () { return this.origin[2]; },
  };

  const pointOnEllipse = function (cx, cy, rx, ry, zRotation, arcAngle) {
    const cos_rotate = Math.cos(zRotation);
    const sin_rotate = Math.sin(zRotation);
    const cos_arc = Math.cos(arcAngle);
    const sin_arc = Math.sin(arcAngle);
    return [
      cx + cos_rotate * rx * cos_arc + -sin_rotate * ry * sin_arc,
      cy + sin_rotate * rx * cos_arc + cos_rotate * ry * sin_arc
    ];
  };
  const pathInfo = function (cx, cy, rx, ry, zRotation, arcStart_, deltaArc_) {
    let arcStart = arcStart_;
    if (arcStart < 0 && !isNaN(arcStart)) {
      while (arcStart < 0) {
        arcStart += Math.PI * 2;
      }
    }
    const deltaArc = deltaArc_ > Math.PI * 2 ? Math.PI * 2 : deltaArc_;
    const start = pointOnEllipse(cx, cy, rx, ry, zRotation, arcStart);
    const middle = pointOnEllipse(cx, cy, rx, ry, zRotation, arcStart + deltaArc / 2);
    const end = pointOnEllipse(cx, cy, rx, ry, zRotation, arcStart + deltaArc);
    const fa = ((deltaArc / 2) > Math.PI) ? 1 : 0;
    const fs = ((deltaArc / 2) > 0) ? 1 : 0;
    return {
      x1: start[0],
      y1: start[1],
      x2: middle[0],
      y2: middle[1],
      x3: end[0],
      y3: end[1],
      fa,
      fs
    };
  };
  const cln = n => cleanNumber(n, 4);
  const ellipticalArcTo = (rx, ry, phi_degrees, fa, fs, endX, endY) =>
    `A${cln(rx)} ${cln(ry)} ${cln(phi_degrees)} ${cln(fa)} ${cln(fs)} ${cln(endX)} ${cln(endY)}`;

  const CircleMethods = {
    nearestPoint: function () {
      return Constructors.vector(nearestPointOnCircle(
        this.radius,
        this.origin,
        getVector(arguments)
      ));
    },
    intersect: function (object) {
      return intersect(this, object);
    },
    overlap: function (object) {
      return overlap(this, object);
    },
    svgPath: function (arcStart = 0, deltaArc = Math.PI * 2) {
      const info = pathInfo(this.origin[0], this.origin[1], this.radius, this.radius, 0, arcStart, deltaArc);
      const arc1 = ellipticalArcTo(this.radius, this.radius, 0, info.fa, info.fs, info.x2, info.y2);
      const arc2 = ellipticalArcTo(this.radius, this.radius, 0, info.fa, info.fs, info.x3, info.y3);
      return `M${info.x1} ${info.y1}${arc1}${arc2}`;
    },
    points: function (count = 128) {
      return Array.from(Array(count))
        .map((_, i) => ((2 * Math.PI) / count) * i)
        .map(angle => [
          this.origin[0] + this.radius * Math.cos(angle),
          this.origin[1] + this.radius * Math.sin(angle)
        ]);
    },
    polygon: function () {
      return Constructors.polygon(this.points(arguments[0]));
    },
    segments: function () {
      const points = this.points(arguments[0]);
      return points.map((point, i) => {
        const nextI = (i + 1) % points.length;
        return [point, points[nextI]];
      });
    }
  };

  const CircleStatic = {
    fromPoints: function () {
      if (arguments.length === 3) {
        const result = circumcircle(...arguments);
        return this.constructor(result.radius, result.origin);
      }
      return this.constructor(...arguments);
    },
    fromThreePoints: function () {
      const result = circumcircle(...arguments);
      return this.constructor(result.radius, result.origin);
    }
  };

  var Circle = {
    circle: { A: CircleArgs, G: CircleGetters, M: CircleMethods, S: CircleStatic }
  };

  const getFoci = function (center, rx, ry, spin) {
    const order = rx > ry;
    const lsq = order ? (rx ** 2) - (ry ** 2) : (ry ** 2) - (rx ** 2);
    const l = Math.sqrt(lsq);
    const trigX = order ? Math.cos(spin) : Math.sin(spin);
    const trigY = order ? Math.sin(spin) : Math.cos(spin);
    return [
      Constructors.vector(center[0] + l * trigX, center[1] + l * trigY),
      Constructors.vector(center[0] - l * trigX, center[1] - l * trigY),
    ];
  };
  var Ellipse = {
    ellipse: {
      A: function () {
        const numbers = flattenArrays(arguments).filter(a => !isNaN(a));
        const params = resize(5, numbers);
        this.rx = params[0];
        this.ry = params[1];
        this.origin = Constructors.vector(params[2], params[3]);
        this.spin = params[4];
        this.foci = getFoci(this.origin, this.rx, this.ry, this.spin);
      },
      G: {
        x: function () { return this.origin[0]; },
        y: function () { return this.origin[1]; },
      },
      M: {
        svgPath: function (arcStart = 0, deltaArc = Math.PI * 2) {
          const info = pathInfo(this.origin[0], this.origin[1], this.rx, this.ry, this.spin, arcStart, deltaArc);
          const arc1 = ellipticalArcTo(this.rx, this.ry, (this.spin / Math.PI) * 180, info.fa, info.fs, info.x2, info.y2);
          const arc2 = ellipticalArcTo(this.rx, this.ry, (this.spin / Math.PI) * 180, info.fa, info.fs, info.x3, info.y3);
          return `M${info.x1} ${info.y1}${arc1}${arc2}`;
        },
        points: function (count = 128) {
          return Array.from(Array(count))
            .map((_, i) => ((2 * Math.PI) / count) * i)
            .map(angle => pointOnEllipse(
              this.origin.x, this.origin.y,
              this.rx, this.ry,
              this.spin, angle
            ));
        },
        polygon: function () {
          return Constructors.polygon(this.points(arguments[0]));
        },
        segments: function () {
          const points = this.points(arguments[0]);
          return points.map((point, i) => {
            const nextI = (i + 1) % points.length;
            return [point, points[nextI]];
          });
        }
      },
      S: {
      }
    }
  };

  const PolygonMethods = {
    area: function () {
      return signedArea(this);
    },
    centroid: function () {
      return Constructors.vector(centroid(this));
    },
    boundingBox: function () {
      return boundingBox(this);
    },
    straightSkeleton: function () {
      return straightSkeleton(this);
    },
    scale: function (magnitude, center = centroid(this)) {
      const newPoints = this
        .map(p => [0, 1].map((_, i) => p[i] - center[i]))
        .map(vec => vec.map((_, i) => center[i] + vec[i] * magnitude));
      return this.constructor.fromPoints(newPoints);
    },
    rotate: function (angle, centerPoint = centroid(this)) {
      const newPoints = this.map((p) => {
        const vec = [p[0] - centerPoint[0], p[1] - centerPoint[1]];
        const mag = Math.sqrt((vec[0] ** 2) + (vec[1] ** 2));
        const a = Math.atan2(vec[1], vec[0]);
        return [
          centerPoint[0] + Math.cos(a + angle) * mag,
          centerPoint[1] + Math.sin(a + angle) * mag,
        ];
      });
      return Constructors.polygon(newPoints);
    },
    translate: function () {
      const vec = getVector(...arguments);
      const newPoints = this.map(p => p.map((n, i) => n + vec[i]));
      return this.constructor.fromPoints(newPoints);
    },
    transform: function () {
      const m = getMatrix3x4(...arguments);
      const newPoints = this
        .map(p => multiplyMatrix3Vector3(m, resize(3, p)));
      return Constructors.polygon(newPoints);
    },
    nearest: function () {
      const point = getVector(...arguments);
      const result = nearestPointOnPolygon(this, point);
      return result === undefined
        ? undefined
        : Object.assign(result, { edge: this.sides[result.i] });
    },
    split: function () {
      const line = getLine(...arguments);
      const split_func = splitConvexPolygon;
      return split_func(this, line.vector, line.origin)
        .map(poly => Constructors.polygon(poly));
    },
    overlap: function () {
      return overlap(this, ...arguments);
    },
    intersect: function () {
      return intersect(this, ...arguments);
    },
    clip: function (line_type, epsilon) {
      const fn_line = line_type.domain_function ? line_type.domain_function : includeL;
      const segment = clip_line_in_convex_polygon(this,
        line_type.vector,
        line_type.origin,
        this.domain_function,
        fn_line,
        epsilon);
      return segment ? Constructors.segment(segment) : undefined;
    },
    svgPath: function () {
      const pre = Array(this.length).fill("L");
      pre[0] = "M";
      return `${this.map((p, i) => `${pre[i]}${p[0]} ${p[1]}`).join("")}z`;
    },
  };

  const rectToPoints = r => [
    [r.x, r.y],
    [r.x + r.width, r.y],
    [r.x + r.width, r.y + r.height],
    [r.x, r.y + r.height]
  ];
  const rectToSides = r => [
    [[r.x, r.y], [r.x + r.width, r.y]],
    [[r.x + r.width, r.y], [r.x + r.width, r.y + r.height]],
    [[r.x + r.width, r.y + r.height], [r.x, r.y + r.height]],
    [[r.x, r.y + r.height], [r.x, r.y]],
  ];
  var Rect = {
    rect: {
      P: Array.prototype,
      A: function () {
        const r = getRect(...arguments);
        this.width = r.width;
        this.height = r.height;
        this.origin = Constructors.vector(r.x, r.y);
        this.push(...rectToPoints(this));
        Object.defineProperty(this, "domain_function", { writable: true, value: include });
      },
      G: {
        x: function () { return this.origin[0]; },
        y: function () { return this.origin[1]; },
        center: function () { return Constructors.vector(
          this.origin[0] + this.width / 2,
          this.origin[1] + this.height / 2,
        ); },
      },
      M: Object.assign({}, PolygonMethods, {
        inclusive: function () { this.domain_function = include; return this; },
        exclusive: function () { this.domain_function = exclude; return this; },
        area: function () { return this.width * this.height; },
        segments: function () { return rectToSides(this); },
        svgPath: function () {
          return `M${this.origin.join(" ")}h${this.width}v${this.height}h${-this.width}Z`;
        },
      }),
      S: {
        fromPoints: function () {
          const box = boundingBox(getVectorOfVectors(arguments));
          return Constructors.rect(box.min[0], box.min[1], box.span[0], box.span[1]);
        }
      }
    }
  };

  var Polygon = {
    polygon: {
      P: Array.prototype,
      A: function () {
        this.push(...semiFlattenArrays(arguments));
        this.sides = this
          .map((p, i, arr) => [p, arr[(i + 1) % arr.length]]);
        this.vectors = this.sides.map(side => subtract(side[1], side[0]));
        Object.defineProperty(this, "domain_function", { writable: true, value: include });
      },
      G: {
        isConvex: function () {
          return undefined;
        },
        points: function () {
          return this;
        },
      },
      M: Object.assign({}, PolygonMethods, {
        inclusive: function () { this.domain_function = include; return this; },
        exclusive: function () { this.domain_function = exclude; return this; },
        segments: function () {
          return this.sides;
        },
      }),
      S: {
        fromPoints: function () {
          return this.constructor(...arguments);
        },
        regularPolygon: function () {
          return this.constructor(makePolygonCircumradius(...arguments));
        },
        convexHull: function () {
          return this.constructor(convexHull(...arguments));
        },
      }
    }
  };

  var Polyline = {
    polyline: {
      P: Array.prototype,
      A: function () {
        this.push(...semiFlattenArrays(arguments));
      },
      G: {
        points: function () {
          return this;
        },
      },
      M: {
        svgPath: function () {
          const pre = Array(this.length).fill("L");
          pre[0] = "M";
          return `${this.map((p, i) => `${pre[i]}${p[0]} ${p[1]}`).join("")}`;
        },
      },
      S: {
        fromPoints: function () {
          return this.constructor(...arguments);
        },
      }
    }
  };

  const array_assign = (thisMat, mat) => {
    for (let i = 0; i < 12; i += 1) {
      thisMat[i] = mat[i];
    }
    return thisMat;
  };
  var Matrix = {
    matrix: {
      P: Array.prototype,
      A: function () {
        getMatrix3x4(arguments).forEach(m => this.push(m));
      },
      G: {
      },
      M: {
        copy: function () { return Constructors.matrix(...Array.from(this)); },
        set: function () {
          return array_assign(this, getMatrix3x4(arguments));
        },
        isIdentity: function () { return isIdentity3x4(this); },
        multiply: function (mat) {
          return array_assign(this, multiplyMatrices3(this, mat));
        },
        determinant: function () {
          return determinant3(this);
        },
        inverse: function () {
          return array_assign(this, invertMatrix3(this));
        },
        translate: function (x, y, z) {
          return array_assign(this,
            multiplyMatrices3(this, makeMatrix3Translate(x, y, z)));
        },
        rotateX: function (radians) {
          return array_assign(this,
            multiplyMatrices3(this, makeMatrix3RotateX(radians)));
        },
        rotateY: function (radians) {
          return array_assign(this,
            multiplyMatrices3(this, makeMatrix3RotateY(radians)));
        },
        rotateZ: function (radians) {
          return array_assign(this,
            multiplyMatrices3(this, makeMatrix3RotateZ(radians)));
        },
        rotate: function (radians, vector, origin) {
          const transform = makeMatrix3Rotate(radians, vector, origin);
          return array_assign(this, multiplyMatrices3(this, transform));
        },
        scale: function (amount) {
          return array_assign(this,
            multiplyMatrices3(this, makeMatrix3Scale(amount)));
        },
        reflectZ: function (vector, origin) {
          const transform = makeMatrix3ReflectZ(vector, origin);
          return array_assign(this, multiplyMatrices3(this, transform));
        },
        transform: function (...innerArgs) {
          return Constructors.vector(
            multiplyMatrix3Vector3(this, resize(3, getVector(innerArgs)))
          );
        },
        transformVector: function (vector) {
          return Constructors.vector(
            multiplyMatrix3Vector3(this, resize(3, getVector(vector)))
          );
        },
        transformLine: function (...innerArgs) {
          const l = getLine(innerArgs);
          return Constructors.line(multiplyMatrix3Line3(this, l.vector, l.origin));
        },
      },
      S: {
      }
    }
  };

  const Definitions = Object.assign({},
    Vector,
    Line,
    Ray,
    Segment,
    Circle,
    Ellipse,
    Rect,
    Polygon,
    Polyline,
    Matrix,
  );
  const create = function (primitiveName, args) {
    const a = Object.create(Definitions[primitiveName].proto);
    Definitions[primitiveName].A.apply(a, args);
    return a;
  };
  const vector = function () { return create("vector", arguments); };
  const line = function () { return create("line", arguments); };
  const ray = function () { return create("ray", arguments); };
  const segment = function () { return create("segment", arguments); };
  const circle = function () { return create("circle", arguments); };
  const ellipse = function () { return create("ellipse", arguments); };
  const rect = function () { return create("rect", arguments); };
  const polygon = function () { return create("polygon", arguments); };
  const polyline = function () { return create("polyline", arguments); };
  const matrix = function () { return create("matrix", arguments); };
  Object.assign(Constructors, {
    vector,
    line,
    ray,
    segment,
    circle,
    ellipse,
    rect,
    polygon,
    polyline,
    matrix,
  });
  Object.keys(Definitions).forEach(primitiveName => {
    const Proto = {};
    Proto.prototype = Definitions[primitiveName].P != null
      ? Object.create(Definitions[primitiveName].P)
      : Object.create(Object.prototype);
    Proto.prototype.constructor = Proto;
    Constructors[primitiveName].prototype = Proto.prototype;
    Constructors[primitiveName].prototype.constructor = Constructors[primitiveName];
    Object.keys(Definitions[primitiveName].G)
      .forEach(key => Object.defineProperty(Proto.prototype, key, {
        get: Definitions[primitiveName].G[key],
      }));
    Object.keys(Definitions[primitiveName].M)
      .forEach(key => Object.defineProperty(Proto.prototype, key, {
        value: Definitions[primitiveName].M[key],
      }));
    Object.keys(Definitions[primitiveName].S)
      .forEach(key => Object.defineProperty(Constructors[primitiveName], key, {
        value: Definitions[primitiveName].S[key]
          .bind(Constructors[primitiveName].prototype),
      }));
    Definitions[primitiveName].proto = Proto.prototype;
  });

  const math = Constructors;
  math.core = Object.assign(Object.create(null),
    constants,
    resizers,
    getters,
    functions,
    algebra,
    equal,
    sort,
    geometry,
    radial,
    matrix2,
    matrix3,
    nearest,
    parameterize,
    {
      encloseConvexPolygonsInclusive,
      intersectConvexPolygonLine,
      intersectPolygonPolygon,
      intersectCircleCircle,
      intersectCircleLine,
      intersectLineLine,
      overlapConvexPolygons,
      overlapConvexPolygonPoint,
      overlapBoundingBoxes,
      overlapLineLine,
      overlapLinePoint,
      clipLineInConvexPolygon: clip_line_in_convex_polygon,
    }
  );
  math.typeof = typeOf;
  math.intersect = intersect;
  math.overlap = overlap;

  return math;

})));
