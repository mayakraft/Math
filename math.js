/* Math (c) Robby Kraft, MIT License */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.math = factory());
}(this, (function () { 'use strict';

  const type_of = function (obj) {
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
  const resize_up = (a, b) => {
    const size = a.length > b.length ? a.length : b.length;
    return [a, b].map(v => resize(size, v));
  };
  const resize_down = (a, b) => {
    const size = a.length > b.length ? b.length : a.length;
    return [a, b].map(v => resize(size, v));
  };
  const count_places = function (num) {
    const m = (`${num}`).match(/(?:\.(\d+))?(?:[eE]([+-]?\d+))?$/);
    if (!m) { return 0; }
    return Math.max(0, (m[1] ? m[1].length : 0) - (m[2] ? +m[2] : 0));
  };
  const clean_number = function (num, places = 15) {
    if (typeof num !== "number") { return num; }
    const crop = parseFloat(num.toFixed(places));
    if (count_places(crop) === Math.min(places, count_places(num))) {
      return num;
    }
    return crop;
  };
  const is_iterable = obj => obj != null
    && typeof obj[Symbol.iterator] === "function";
  const semi_flatten_arrays = function () {
    switch (arguments.length) {
      case undefined:
      case 0: return Array.from(arguments);
      case 1: return is_iterable(arguments[0]) && typeof arguments[0] !== "string"
        ? semi_flatten_arrays(...arguments[0])
        : [arguments[0]];
      default:
        return Array.from(arguments).map(a => (is_iterable(a)
          ? [...semi_flatten_arrays(a)]
          : a));
    }
  };
  const flatten_arrays = function () {
    switch (arguments.length) {
      case undefined:
      case 0: return Array.from(arguments);
      case 1: return is_iterable(arguments[0]) && typeof arguments[0] !== "string"
        ? flatten_arrays(...arguments[0])
        : [arguments[0]];
      default:
        return Array.from(arguments).map(a => (is_iterable(a)
          ? [...flatten_arrays(a)]
          : a)).reduce((a, b) => a.concat(b), []);
    }
  };

  var resizers = /*#__PURE__*/Object.freeze({
    __proto__: null,
    resize: resize,
    resize_up: resize_up,
    resize_down: resize_down,
    clean_number: clean_number,
    semi_flatten_arrays: semi_flatten_arrays,
    flatten_arrays: flatten_arrays
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

  const fn_true = () => true;
  const fn_square = n => n * n;
  const fn_add = (a, b) => a + (b || 0);
  const fn_not_undefined = a => a !== undefined;
  const fn_and = (a, b) => a && b;
  const fn_cat = (a, b) => a.concat(b);
  const fn_vec2_angle = v => Math.atan2(v[1], v[0]);
  const fn_to_vec2 = a => [Math.cos(a), Math.sin(a)];
  const fn_equal = (a, b) => a === b;
  const fn_epsilon_equal = (a, b) => Math.abs(a - b) < EPSILON;
  const include = (n, epsilon = EPSILON) => n > -epsilon;
  const exclude = (n, epsilon = EPSILON) => n > epsilon;
  const include_l$1 = fn_true;
  const exclude_l = fn_true;
  const include_r = include;
  const exclude_r = exclude;
  const include_s = (t, e = EPSILON) => t > -e && t < 1 + e;
  const exclude_s = (t, e = EPSILON) => t > e && t < 1 - e;
  const line_limiter = dist => dist;
  const ray_limiter = dist => (dist < -EPSILON ? 0 : dist);
  const segment_limiter = (dist) => {
    if (dist < -EPSILON) { return 0; }
    if (dist > 1 + EPSILON) { return 1; }
    return dist;
  };

  var functions = /*#__PURE__*/Object.freeze({
    __proto__: null,
    fn_true: fn_true,
    fn_square: fn_square,
    fn_add: fn_add,
    fn_not_undefined: fn_not_undefined,
    fn_and: fn_and,
    fn_cat: fn_cat,
    fn_vec2_angle: fn_vec2_angle,
    fn_to_vec2: fn_to_vec2,
    fn_equal: fn_equal,
    fn_epsilon_equal: fn_epsilon_equal,
    include: include,
    exclude: exclude,
    include_l: include_l$1,
    exclude_l: exclude_l,
    include_r: include_r,
    exclude_r: exclude_r,
    include_s: include_s,
    exclude_s: exclude_s,
    line_limiter: line_limiter,
    ray_limiter: ray_limiter,
    segment_limiter: segment_limiter
  });

  var Constructors = Object.create(null);

  const identity2x2 = [1, 0, 0, 1];
  const identity2x3 = identity2x2.concat(0, 0);
  const multiply_matrix2_vector2 = (matrix, vector) => [
    matrix[0] * vector[0] + matrix[2] * vector[1] + matrix[4],
    matrix[1] * vector[0] + matrix[3] * vector[1] + matrix[5]
  ];
  const multiply_matrix2_line2 = (matrix, vector, origin) => ({
    vector: [
      matrix[0] * vector[0] + matrix[2] * vector[1],
      matrix[1] * vector[0] + matrix[3] * vector[1]
    ],
    origin: [
      matrix[0] * origin[0] + matrix[2] * origin[1] + matrix[4],
      matrix[1] * origin[0] + matrix[3] * origin[1] + matrix[5]
    ],
  });
  const multiply_matrices2 = (m1, m2) => [
    m1[0] * m2[0] + m1[2] * m2[1],
    m1[1] * m2[0] + m1[3] * m2[1],
    m1[0] * m2[2] + m1[2] * m2[3],
    m1[1] * m2[2] + m1[3] * m2[3],
    m1[0] * m2[4] + m1[2] * m2[5] + m1[4],
    m1[1] * m2[4] + m1[3] * m2[5] + m1[5]
  ];
  const determinant2 = m => m[0] * m[3] - m[1] * m[2];
  const invert_matrix2 = (m) => {
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
  const make_matrix2_translate = (x = 0, y = 0) => identity2x2.concat(x, y);
  const make_matrix2_scale = (x, y, origin = [0, 0]) => [
    x,
    0,
    0,
    y,
    x * -origin[0] + origin[0],
    y * -origin[1] + origin[1]
  ];
  const make_matrix2_rotate = (angle, origin = [0, 0]) => {
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
  const make_matrix2_reflect = (vector, origin = [0, 0]) => {
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
    multiply_matrix2_vector2: multiply_matrix2_vector2,
    multiply_matrix2_line2: multiply_matrix2_line2,
    multiply_matrices2: multiply_matrices2,
    determinant2: determinant2,
    invert_matrix2: invert_matrix2,
    make_matrix2_translate: make_matrix2_translate,
    make_matrix2_scale: make_matrix2_scale,
    make_matrix2_rotate: make_matrix2_rotate,
    make_matrix2_reflect: make_matrix2_reflect
  });

  const magnitude = v => Math.sqrt(v
    .map(fn_square)
    .reduce(fn_add, 0));
  const magnitude2 = v => Math.sqrt(v[0] * v[0] + v[1] * v[1]);
  const mag_squared = v => v
    .map(fn_square)
    .reduce(fn_add, 0);
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
    .reduce(fn_add, 0);
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
    .reduce(fn_add, 0));
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
    .reduce(fn_add, 0) < epsilon;
  const parallel = (v, u, epsilon = EPSILON) => 1 - Math
    .abs(dot(normalize(v), normalize(u))) < epsilon;
  const parallel2 = (v, u, epsilon = EPSILON) => Math
    .abs(cross2(v, u)) < epsilon;

  var algebra = /*#__PURE__*/Object.freeze({
    __proto__: null,
    magnitude: magnitude,
    magnitude2: magnitude2,
    mag_squared: mag_squared,
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
  const is_identity3x4 = m => identity3x4
    .map((n, i) => Math.abs(n - m[i]) < EPSILON)
    .reduce((a, b) => a && b, true);
  const multiply_matrix3_vector3 = (m, vector) => [
    m[0] * vector[0] + m[3] * vector[1] + m[6] * vector[2] + m[9],
    m[1] * vector[0] + m[4] * vector[1] + m[7] * vector[2] + m[10],
    m[2] * vector[0] + m[5] * vector[1] + m[8] * vector[2] + m[11]
  ];
  const multiply_matrix3_line3 = (m, vector, origin) => ({
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
  const multiply_matrices3 = (m1, m2) => [
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
  const invert_matrix3 = (m) => {
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
  const make_matrix3_translate = (x = 0, y = 0, z = 0) => identity3x3.concat(x, y, z);
  const single_axis_rotate = (angle, origin, i0, i1, sgn) => {
    const mat = identity3x3.concat([0, 1, 2].map(i => origin[i] || 0));
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    mat[i0*3 + i0] = cos;
    mat[i0*3 + i1] = (sgn ? +1 : -1) * sin;
    mat[i1*3 + i0] = (sgn ? -1 : +1) * sin;
    mat[i1*3 + i1] = cos;
    return mat;
  };
  const make_matrix3_rotateX = (angle, origin = [0, 0, 0]) => single_axis_rotate(angle, origin, 1, 2, true);
  const make_matrix3_rotateY = (angle, origin = [0, 0, 0]) => single_axis_rotate(angle, origin, 0, 2, false);
  const make_matrix3_rotateZ = (angle, origin = [0, 0, 0]) => single_axis_rotate(angle, origin, 0, 1, true);
  const make_matrix3_rotate = (angle, vector = [0, 0, 1], origin = [0, 0, 0]) => {
    const pos = [0, 1, 2].map(i => origin[i] || 0);
    const [x, y, z] = resize(3, normalize(vector));
    const c = Math.cos(angle);
    const s = Math.sin(angle);
    const t = 1 - c;
    const trans     = identity3x3.concat(-pos[0], -pos[1], -pos[2]);
    const trans_inv = identity3x3.concat(pos[0], pos[1], pos[2]);
    return multiply_matrices3(trans_inv, multiply_matrices3([
      t * x * x + c,     t * y * x + z * s, t * z * x - y * s,
      t * x * y - z * s, t * y * y + c,     t * z * y + x * s,
      t * x * z + y * s, t * y * z - x * s, t * z * z + c,
      0, 0, 0], trans));
  };
  const make_matrix3_scale = (scale, origin = [0, 0, 0]) => [
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
  const make_matrix3_reflectZ = (vector, origin = [0, 0]) => {
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
    is_identity3x4: is_identity3x4,
    multiply_matrix3_vector3: multiply_matrix3_vector3,
    multiply_matrix3_line3: multiply_matrix3_line3,
    multiply_matrices3: multiply_matrices3,
    determinant3: determinant3,
    invert_matrix3: invert_matrix3,
    make_matrix3_translate: make_matrix3_translate,
    make_matrix3_rotateX: make_matrix3_rotateX,
    make_matrix3_rotateY: make_matrix3_rotateY,
    make_matrix3_rotateZ: make_matrix3_rotateZ,
    make_matrix3_rotate: make_matrix3_rotate,
    make_matrix3_scale: make_matrix3_scale,
    make_matrix3_reflectZ: make_matrix3_reflectZ
  });

  const vector_origin_form = (vector, origin) => ({
    vector: vector || [],
    origin: origin || []
  });
  const get_vector = function () {
    if (arguments[0] instanceof Constructors.vector) { return arguments[0]; }
    let list = flatten_arrays(arguments);
    if (list.length > 0
      && typeof list[0] === "object"
      && list[0] !== null
      && !isNaN(list[0].x)) {
      list = ["x", "y", "z"]
        .map(c => list[0][c])
        .filter(fn_not_undefined);
    }
    return list.filter(n => typeof n === "number");
  };
  const get_vector_of_vectors = function () {
    return semi_flatten_arrays(arguments)
      .map(el => get_vector(el));
  };
  const get_segment = function () {
    if (arguments[0] instanceof Constructors.segment) {
      return arguments[0];
    }
    const args = semi_flatten_arrays(arguments);
    if (args.length === 4) {
      return [
        [args[0], args[1]],
        [args[2], args[3]]
      ];
    }
    return args.map(el => get_vector(el));
  };
  const get_line = function () {
    const args = semi_flatten_arrays(arguments);
    if (args.length === 0) { return vector_origin_form([], []); }
    if (args[0] instanceof Constructors.line
      || args[0] instanceof Constructors.ray
      || args[0] instanceof Constructors.segment) { return args[0]; }
    if (args[0].constructor === Object && args[0].vector !== undefined) {
      return vector_origin_form(args[0].vector || [], args[0].origin || []);
    }
    return typeof args[0] === "number"
      ? vector_origin_form(get_vector(args))
      : vector_origin_form(...args.map(a => get_vector(a)));
  };
  const get_ray = get_line;
  const get_rect_params = (x = 0, y = 0, width = 0, height = 0) => ({
    x, y, width, height
  });
  const get_rect = function () {
    if (arguments[0] instanceof Constructors.rect) { return arguments[0]; }
    const list = flatten_arrays(arguments);
    if (list.length > 0
      && typeof list[0] === "object"
      && list[0] !== null
      && !isNaN(list[0].width)) {
      return get_rect_params(...["x", "y", "width", "height"]
        .map(c => list[0][c])
        .filter(fn_not_undefined));
    }
    const numbers = list.filter(n => typeof n === "number");
    const rect_params = numbers.length < 4
      ? [, , ...numbers]
      : numbers;
    return get_rect_params(...rect_params);
  };
  const get_circle_params = (radius = 1, ...args) => ({
  	radius,
  	origin: [...args],
  });
  const get_circle = function () {
  	if (arguments[0] instanceof Constructors.circle) { return arguments[0]; }
    const vectors = get_vector_of_vectors(arguments);
    const numbers = flatten_arrays(arguments).filter(a => typeof a === "number");
    if (arguments.length === 2) {
      if (vectors[1].length === 1) {
  			return get_circle_params(vectors[1][0], ...vectors[0]);
      } else if (vectors[0].length === 1) {
  			return get_circle_params(vectors[0][0], ...vectors[1]);
      } else if (vectors[0].length > 1 && vectors[1].length > 1) {
  			return get_circle_params(distance2(...vectors), ...vectors[0]);
      }
    }
    else {
      switch (numbers.length) {
        case 0: return get_circle_params(1, 0, 0, 0);
        case 1: return get_circle_params(numbers[0], 0, 0, 0);
        default: return get_circle_params(numbers.pop(), ...numbers);
      }
    }
  	return get_circle_params(1, 0, 0, 0);
  };
  const maps_3x4 = [
    [0, 1, 3, 4, 9, 10],
    [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
    [0, 1, 2, undefined, 3, 4, 5, undefined, 6, 7, 8, undefined, 9, 10, 11]
  ];
  [11, 7, 3].forEach(i => delete maps_3x4[2][i]);
  const matrix_map_3x4 = len => {
    let i;
    if (len < 8) i = 0;
    else if (len < 13) i = 1;
    else i = 2;
    return maps_3x4[i];
  };
  const get_matrix_3x4 = function () {
    const mat = flatten_arrays(arguments);
    const matrix = [...identity3x4];
    matrix_map_3x4(mat.length)
      .forEach((n, i) => { if (mat[i] != null) { matrix[n] = mat[i]; } });
    return matrix;
  };

  var getters = /*#__PURE__*/Object.freeze({
    __proto__: null,
    get_vector: get_vector,
    get_vector_of_vectors: get_vector_of_vectors,
    get_segment: get_segment,
    get_line: get_line,
    get_ray: get_ray,
    get_rect_params: get_rect_params,
    get_rect: get_rect,
    get_circle: get_circle,
    get_matrix_3x4: get_matrix_3x4
  });

  const array_similarity_test = (list, compFunc) => Array
    .from(Array(list.length - 1))
    .map((_, i) => compFunc(list[0], list[i + 1]))
    .reduce(fn_and, true);
  const equivalent_vector2 = (a, b) => [0, 1]
    .map(i => fn_epsilon_equal(a[i], b[i]))
    .reduce(fn_and, true);
  const equivalent_numbers = function () {
    if (arguments.length === 0) { return false; }
    if (arguments.length === 1 && arguments[0] !== undefined) {
      return equivalent_numbers(...arguments[0]);
    }
    return array_similarity_test(arguments, fn_epsilon_equal);
  };
  const equivalent_vectors = function () {
    const args = Array.from(arguments);
    const length = args.map(a => a.length).reduce((a, b) => a > b ? a : b);
    const vecs = args.map(a => resize(length, a));
    return Array.from(Array(arguments.length - 1))
      .map((_, i) => vecs[0]
        .map((_, n) => Math.abs(vecs[0][n] - vecs[i + 1][n]) < EPSILON)
        .reduce(fn_and, true))
      .reduce(fn_and, true);
  };
  const equivalent = function () {
    const list = semi_flatten_arrays(...arguments);
    if (list.length < 1) { return false; }
    const typeofList = typeof list[0];
    if (typeofList === "undefined") { return false; }
    switch (typeofList) {
      case "number":
        return array_similarity_test(list, fn_epsilon_equal);
      case "boolean":
      case "string":
        return array_similarity_test(list, fn_equal);
      case "object":
        if (list[0].constructor === Array) { return equivalent_vectors(...list); }
        return array_similarity_test(list, (a, b) => JSON.stringify(a) === JSON.stringify(b));
      default: return undefined;
    }
  };

  var equal = /*#__PURE__*/Object.freeze({
    __proto__: null,
    equivalent_vector2: equivalent_vector2,
    equivalent_numbers: equivalent_numbers,
    equivalent_vectors: equivalent_vectors,
    equivalent: equivalent
  });

  const sort_points_along_vector2 = (points, vector) => points
    .map(point => ({ point, d: point[0] * vector[0] + point[1] * vector[1] }))
    .sort((a, b) => a.d - b.d)
    .map(a => a.point);

  var sort = /*#__PURE__*/Object.freeze({
    __proto__: null,
    sort_points_along_vector2: sort_points_along_vector2
  });

  const smallest_comparison_search = (obj, array, compare_func) => {
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
  const nearest_point2 = (point, array_of_points) => {
    const index = smallest_comparison_search(point, array_of_points, distance2);
    return index === undefined ? undefined : array_of_points[index];
  };
  const nearest_point = (point, array_of_points) => {
    const index = smallest_comparison_search(point, array_of_points, distance);
    return index === undefined ? undefined : array_of_points[index];
  };
  const nearest_point_on_line = (vector, origin, point, limiterFunc, epsilon = EPSILON) => {
    origin = resize(vector.length, origin);
    point = resize(vector.length, point);
    const magSquared = mag_squared(vector);
    const vectorToPoint = subtract(point, origin);
    const dotProd = dot(vector, vectorToPoint);
    const dist = dotProd / magSquared;
    const d = limiterFunc(dist, epsilon);
    return add(origin, scale(vector, d))
  };
  const nearest_point_on_polygon = (polygon, point) => {
    const v = polygon
      .map((p, i, arr) => subtract(arr[(i + 1) % arr.length], p));
    return polygon
      .map((p, i) => nearest_point_on_line(v[i], p, point, segment_limiter))
      .map((p, i) => ({ point: p, i, distance: distance(p, point) }))
      .sort((a, b) => a.distance - b.distance)
      .shift();
  };
  const nearest_point_on_circle = (radius, origin, point) => add(
    origin, scale(normalize(subtract(point, origin)), radius)
  );
  const nearest_point_on_ellipse = () => false;

  var nearest = /*#__PURE__*/Object.freeze({
    __proto__: null,
    smallest_comparison_search: smallest_comparison_search,
    nearest_point2: nearest_point2,
    nearest_point: nearest_point,
    nearest_point_on_line: nearest_point_on_line,
    nearest_point_on_polygon: nearest_point_on_polygon,
    nearest_point_on_circle: nearest_point_on_circle,
    nearest_point_on_ellipse: nearest_point_on_ellipse
  });

  const is_counter_clockwise_between = (angle, angleA, angleB) => {
    while (angleB < angleA) { angleB += TWO_PI; }
    while (angle > angleA) { angle -= TWO_PI; }
    while (angle < angleA) { angle += TWO_PI; }
    return angle < angleB;
  };
  const clockwise_angle_radians = (a, b) => {
    while (a < 0) { a += TWO_PI; }
    while (b < 0) { b += TWO_PI; }
    while (a > TWO_PI) { a -= TWO_PI; }
    while (b > TWO_PI) { b -= TWO_PI; }
    const a_b = a - b;
    return (a_b >= 0)
      ? a_b
      : TWO_PI - (b - a);
  };
  const counter_clockwise_angle_radians = (a, b) => {
    while (a < 0) { a += TWO_PI; }
    while (b < 0) { b += TWO_PI; }
    while (a > TWO_PI) { a -= TWO_PI; }
    while (b > TWO_PI) { b -= TWO_PI; }
    const b_a = b - a;
    return (b_a >= 0)
      ? b_a
      : TWO_PI - (a - b);
  };
  const clockwise_angle2 = (a, b) => {
    const dotProduct = b[0] * a[0] + b[1] * a[1];
    const determinant = b[0] * a[1] - b[1] * a[0];
    let angle = Math.atan2(determinant, dotProduct);
    if (angle < 0) { angle += TWO_PI; }
    return angle;
  };
  const counter_clockwise_angle2 = (a, b) => {
    const dotProduct = a[0] * b[0] + a[1] * b[1];
    const determinant = a[0] * b[1] - a[1] * b[0];
    let angle = Math.atan2(determinant, dotProduct);
    if (angle < 0) { angle += TWO_PI; }
    return angle;
  };
  const clockwise_bisect2 = (a, b) => fn_to_vec2(
    fn_vec2_angle(a) - clockwise_angle2(a, b) / 2
  );
  const counter_clockwise_bisect2 = (a, b) => fn_to_vec2(
    fn_vec2_angle(a) + counter_clockwise_angle2(a, b) / 2
  );
  const bisect_lines2 = (vectorA, originA, vectorB, originB, epsilon = EPSILON) => {
    const determinant = cross2(vectorA, vectorB);
    const dotProd = dot(vectorA, vectorB);
    const bisects = determinant > -epsilon
      ? [counter_clockwise_bisect2(vectorA, vectorB)]
      : [clockwise_bisect2(vectorA, vectorB)];
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
  const counter_clockwise_order_radians = function () {
    const radians = flatten_arrays(arguments);
    const counter_clockwise = radians
      .map((_, i) => i)
      .sort((a, b) => radians[a] - radians[b]);
    return counter_clockwise
      .slice(counter_clockwise.indexOf(0), counter_clockwise.length)
      .concat(counter_clockwise.slice(0, counter_clockwise.indexOf(0)));
  };
  const counter_clockwise_order2 = function () {
    return counter_clockwise_order_radians(
      get_vector_of_vectors(arguments).map(fn_vec2_angle)
    );
  };
  const counter_clockwise_sectors_radians = function () {
    const radians = flatten_arrays(arguments);
    const ordered = counter_clockwise_order_radians(radians)
      .map(i => radians[i]);
    return ordered.map((rad, i, arr) => [rad, arr[(i + 1) % arr.length]])
      .map(pair => counter_clockwise_angle_radians(pair[0], pair[1]));
  };
  const counter_clockwise_sectors2 = function () {
    return counter_clockwise_sectors_radians(
      get_vector_of_vectors(arguments).map(fn_vec2_angle)
    );
  };
  const counter_clockwise_subsect_radians = (divisions, angleA, angleB) => {
    const angle = counter_clockwise_angle_radians(angleA, angleB) / divisions;
    return Array.from(Array(divisions - 1))
      .map((_, i) => angleA + angle * (i + 1));
  };
  const counter_clockwise_subsect2 = (divisions, vectorA, vectorB) => {
    const angleA = Math.atan2(vectorA[1], vectorA[0]);
    const angleB = Math.atan2(vectorB[1], vectorB[0]);
    return counter_clockwise_subsect_radians(divisions, angleA, angleB)
      .map(fn_to_vec2);
  };

  var radial = /*#__PURE__*/Object.freeze({
    __proto__: null,
    is_counter_clockwise_between: is_counter_clockwise_between,
    clockwise_angle_radians: clockwise_angle_radians,
    counter_clockwise_angle_radians: counter_clockwise_angle_radians,
    clockwise_angle2: clockwise_angle2,
    counter_clockwise_angle2: counter_clockwise_angle2,
    clockwise_bisect2: clockwise_bisect2,
    counter_clockwise_bisect2: counter_clockwise_bisect2,
    bisect_lines2: bisect_lines2,
    counter_clockwise_order_radians: counter_clockwise_order_radians,
    counter_clockwise_order2: counter_clockwise_order2,
    counter_clockwise_sectors_radians: counter_clockwise_sectors_radians,
    counter_clockwise_sectors2: counter_clockwise_sectors2,
    counter_clockwise_subsect_radians: counter_clockwise_subsect_radians,
    counter_clockwise_subsect2: counter_clockwise_subsect2
  });

  const overlap_line_point = (vector, origin, point, func = exclude_l, epsilon = EPSILON) => {
    const p2p = subtract(point, origin);
    const lineMagSq = mag_squared(vector);
    const lineMag = Math.sqrt(lineMagSq);
    if (lineMag < epsilon) { return false; }
    const cross = cross2(p2p, vector.map(n => n / lineMag));
    const proj = dot(p2p, vector) / lineMagSq;
    return Math.abs(cross) < epsilon && func(proj, epsilon / lineMag);
  };

  const intersect_line_line = (
    aVector, aOrigin,
    bVector, bOrigin,
    aFunction = include_l$1,
    bFunction = include_l$1,
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
  const signed_area = points => 0.5 * points
    .map((el, i, arr) => {
      const next = arr[(i + 1) % arr.length];
      return el[0] * next[1] - next[0] * el[1];
    }).reduce(fn_add, 0);
  const centroid = (points) => {
    const sixthArea = 1 / (6 * signed_area(points));
    return points.map((el, i, arr) => {
      const next = arr[(i + 1) % arr.length];
      const mag = el[0] * next[1] - next[0] * el[1];
      return [(el[0] + next[0]) * mag, (el[1] + next[1]) * mag];
    }).reduce((a, b) => [a[0] + b[0], a[1] + b[1]], [0, 0])
      .map(c => c * sixthArea);
  };
  const enclosing_rectangle = (points) => {
    const mins = Array(points[0].length).fill(Infinity);
    const maxs = Array(points[0].length).fill(-Infinity);
    points.forEach(point => point
      .forEach((c, i) => {
        if (c < mins[i]) { mins[i] = c; }
        if (c > maxs[i]) { maxs[i] = c; }
      }));
    const lengths = maxs.map((max, i) => max - mins[i]);
    return get_rect_params(mins[0], mins[1], lengths[0], lengths[1]);
  };
  const angle_array = count => Array
    .from(Array(Math.floor(count)))
    .map((_, i) => TWO_PI * (i / count));
  const angles_to_vecs = (angles, radius) => angles
    .map(a => [radius * Math.cos(a), radius * Math.sin(a)])
    .map(pt => pt.map(n => clean_number(n, 14)));
  const make_regular_polygon = (sides = 3, radius = 1) =>
    angles_to_vecs(angle_array(sides), radius);
  const make_regular_polygon_side_aligned = (sides = 3, radius = 1) => {
    const halfwedge = Math.PI / sides;
    const angles = angle_array(sides).map(a => a + halfwedge);
    return angles_to_vecs(angles, radius);
  };
  const make_regular_polygon_inradius = (sides = 3, radius = 1) =>
    make_regular_polygon(sides, radius / Math.cos(Math.PI / sides));
  const make_regular_polygon_inradius_side_aligned = (sides = 3, radius = 1) =>
    make_regular_polygon_side_aligned(sides, radius / Math.cos(Math.PI / sides));
  const make_regular_polygon_side_length = (sides = 3, length = 1) =>
    make_regular_polygon(sides, (length / 2) / Math.sin(Math.PI / sides));
  const make_regular_polygon_side_length_side_aligned = (sides = 3, length = 1) =>
    make_regular_polygon_side_aligned(sides, (length / 2) / Math.sin(Math.PI / sides));
  const split_convex_polygon = (poly, lineVector, linePoint) => {
    let vertices_intersections = poly.map((v, i) => {
      let intersection = overlap_line_point(lineVector, linePoint, v, include_l$1);
      return { point: intersection ? v : null, at_index: i };
    }).filter(el => el.point != null);
    let edges_intersections = poly.map((v, i, arr) => ({
        point: intersect_line_line(
          lineVector,
          linePoint,
          subtract(v, arr[(i + 1) % arr.length]),
          arr[(i + 1) % arr.length],
          exclude_l,
          exclude_s),
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
  const convex_hull = (points, include_collinear = false, epsilon = EPSILON) => {
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
  const recurse_skeleton = (points, lines, bisectors) => {
    const intersects = points
      .map((origin, i) => ({ vector: bisectors[i], origin }))
      .map((ray, i, arr) => intersect_line_line(
        ray.vector,
        ray.origin,
        arr[(i + 1) % arr.length].vector,
        arr[(i + 1) % arr.length].origin,
        exclude_r,
        exclude_r));
    const projections = lines.map((line, i) => nearest_point_on_line(
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
    const newVector = clockwise_bisect2(
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
    return solutions.concat(recurse_skeleton(points, lines, bisectors));
  };
  const straight_skeleton = (points) => {
    const lines = points
      .map((p, i, arr) => [p, arr[(i + 1) % arr.length]])
      .map(side => ({ vector: subtract(side[1], side[0]), origin: side[0] }));
    const bisectors = points
      .map((_, i, ar) => [(i - 1 + ar.length) % ar.length, i, (i + 1) % ar.length]
        .map(i => ar[i]))
      .map(p => [subtract(p[0], p[1]), subtract(p[2], p[1])])
      .map(v => clockwise_bisect2(...v));
    return recurse_skeleton([...points], lines, bisectors);
  };

  var geometry = /*#__PURE__*/Object.freeze({
    __proto__: null,
    circumcircle: circumcircle,
    signed_area: signed_area,
    centroid: centroid,
    enclosing_rectangle: enclosing_rectangle,
    make_regular_polygon: make_regular_polygon,
    make_regular_polygon_side_aligned: make_regular_polygon_side_aligned,
    make_regular_polygon_inradius: make_regular_polygon_inradius,
    make_regular_polygon_inradius_side_aligned: make_regular_polygon_inradius_side_aligned,
    make_regular_polygon_side_length: make_regular_polygon_side_length,
    make_regular_polygon_side_length_side_aligned: make_regular_polygon_side_length_side_aligned,
    split_convex_polygon: split_convex_polygon,
    convex_hull: convex_hull,
    straight_skeleton: straight_skeleton
  });

  const intersection_ud = (line1, line2) => {
    const det = cross2(line1.u, line2.u);
    if (Math.abs(det) < EPSILON) { return undefined; }
    const x = line1.d * line2.u[1] - line2.d * line1.u[1];
    const y = line2.d * line1.u[0] - line1.d * line2.u[0];
    return [x / det, y / det];
  };
  const axiom1ud = (point1, point2) => {
    const u = normalize2(rotate90(subtract2(point2, point1)));
    return { u, d: dot2(add2(point1, point2), u) / 2.0 };
  };
  const axiom2ud = (point1, point2) => {
    const u = normalize2(subtract2(point2, point1));
    return { u, d: dot2(add2(point1, point2), u) / 2.0 };
  };
  const axiom3ud = (line1, line2) => {
    const intersect = intersection_ud(line1, line2);
    return intersect === undefined
      ? [{ u: line1.u, d: (line1.d + line2.d * dot2(line1.u, line2.u)) / 2.0 }]
      : [add2, subtract2]
        .map(f => normalize2(f(line1.u, line2.u)))
        .map(u => ({ u, d: dot2(intersect, u) }));
  };
   const axiom4ud = (line, point) => {
    const u = rotate90(line.u);
    const d = dot2(point, u);
    return {u, d};
  };
  const axiom5ud = (line, point1, point2) => {
    const p1base = dot2(point1, line.u);
    const a = line.d - p1base;
    const c = distance2(point1, point2);
    if (a > c) { return []; }
    const b = Math.sqrt(c * c - a * a);
    const a_vec = scale2(line.u, a);
    const base_center = add2(point1, a_vec);
    const base_vector = scale2(rotate90(line.u), b);
    const mirrors = b < EPSILON
      ? [base_center]
      : [add2(base_center, base_vector), subtract2(base_center, base_vector)];
    return mirrors
      .map(pt => normalize2(subtract2(point2, pt)))
      .map(u => ({ u, d: dot2(point1, u) }));
  };
  const cubrt = n => n < 0
    ? -Math.pow(-n, 1/3)
    : Math.pow(n, 1/3);
  const polynomial = (degree, a, b, c, d) => {
    switch (degree) {
      case 1: return [-d / c];
      case 2: {
        let discriminant = Math.pow(c, 2.0) - (4.0 * b * d);
        if (discriminant < -EPSILON) { return []; }
        let q1 = -c / (2.0 * b);
        if (discriminant < EPSILON) { return [q1]; }
        let q2 = Math.sqrt(discriminant) / (2.0 * b);
        return [q1 + q2, q1 - q2];
      }
      case 3: {
        let a2 = b / a;
        let a1 = c / a;
        let a0 = d / a;
        let q = (3.0 * a1 - Math.pow(a2, 2.0)) / 9.0;
        let r = (9.0 * a2 * a1 - 27.0 * a0 - 2.0 * Math.pow(a2, 3.0)) / 54.0;
        let d0 = Math.pow(q, 3.0) + Math.pow(r, 2.0);
        let u = -a2 / 3.0;
        if (d0 > 0.0) {
          let sqrt_d0 = Math.sqrt(d0);
          let s = cubrt(r + sqrt_d0);
          let t = cubrt(r - sqrt_d0);
          return [u + s + t];
        }
        if (Math.abs(d0) < EPSILON) {
          let s = Math.pow(r, 1.0/3.0);
          if (r < 0.0) { return []; }
          return [u + 2.0 * s, u - s];
        }
        let sqrt_d0 = Math.sqrt(-d0);
        let phi = Math.atan2(sqrt_d0, r) / 3.0;
        let r_s = Math.pow((Math.pow(r, 2.0) - d0), 1.0/6.0);
        let s_r = r_s * Math.cos(phi);
        let s_i = r_s * Math.sin(phi);
        return [
          u + 2.0 * s_r,
          u - s_r - Math.sqrt(3.0) * s_i,
          u - s_r + Math.sqrt(3.0) * s_i
        ];
      }
      default: return [];
    }
  };
  const axiom6ud = (line1, line2, point1, point2) => {
    if (Math.abs(1.0 - (dot2(line1.u, point1) / line1.d)) < 0.02) { return []; }
    const line_vec = rotate90(line1.u);
    const vec1 = subtract2(add2(point1, scale2(line1.u, line1.d)), scale2(point2, 2.0));
    const vec2 = subtract2(scale2(line1.u, line1.d), point1);
    const c1 = dot2(point2, line2.u) - line2.d;
    const c2 = 2.0 * dot2(vec2, line_vec);
    const c3 = dot2(vec2, vec2);
    const c4 = dot2(add2(vec1, vec2), line_vec);
    const c5 = dot2(vec1, vec2);
    const c6 = dot2(line_vec, line2.u);
    const c7 = dot2(vec2, line2.u);
    const a = c6;
    const b = c1 + c4 * c6 + c7;
    const c = c1 * c2 + c5 * c6 + c4 * c7;
    const d = c1 * c3 + c5 * c7;
    let polynomial_degree = 0;
    if (Math.abs(c) > EPSILON) { polynomial_degree = 1; }
    if (Math.abs(b) > EPSILON) { polynomial_degree = 2; }
    if (Math.abs(a) > EPSILON) { polynomial_degree = 3; }
    return polynomial(polynomial_degree, a, b, c, d)
      .map(n => add2(scale2(line1.u, line1.d), scale2(line_vec, n)))
      .map(p => ({ p, u: normalize2(subtract2(p, point1)) }))
      .map(el => ({ u: el.u, d: dot2(el.u, midpoint2(el.p, point1)) }));
  };
  const axiom7ud = (line1, line2, point) => {
    let u = rotate90(line1.u);
    let u_u = dot2(u, line2.u);
    if (Math.abs(u_u) < EPSILON) { return undefined; }
    let a = dot2(point, u);
    let b = dot2(point, line2.u);
    let d = (line2.d + 2.0 * a * u_u - b) / (2.0 * u_u);
    return {u, d};
  };

  var axioms_ud = /*#__PURE__*/Object.freeze({
    __proto__: null,
    axiom1ud: axiom1ud,
    axiom2ud: axiom2ud,
    axiom3ud: axiom3ud,
    axiom4ud: axiom4ud,
    axiom5ud: axiom5ud,
    axiom6ud: axiom6ud,
    axiom7ud: axiom7ud
  });

  const vector_origin_to_ud = ({ vector, origin }) => {
    const mag = magnitude(vector);
    const u = rotate90(vector);
    const d = dot(origin, u) / mag;
    return d < 0
      ? { u: scale(u, -1/mag), d: -d }
      : { u: scale(u, 1/mag), d };
  };
  const ud_to_vector_origin = ({ u, d }) => ({
    vector: rotate270(u),
    origin: scale(u, d),
  });

  const intersect_circle_line = (
    circle_radius, circle_origin,
    line_vector, line_origin,
    line_func = include_l$1,
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

  const axiom1 = (point1, point2) => ({
    vector: normalize2(subtract2(...resize_up(point2, point1))),
    origin: point1
  });
  const axiom2 = (point1, point2) => ({
    vector: normalize2(rotate90(subtract2(...resize_up(point2, point1)))),
    origin: midpoint2(point1, point2)
  });
  const axiom3 = (line1, line2) => bisect_lines2(
    line1.vector, line1.origin, line2.vector, line2.origin
  );
  const axiom4 = (line, point) => ({
    vector: rotate90(normalize2(line.vector)),
    origin: point
  });
  const axiom5 = (line, point1, point2) => (intersect_circle_line(
      distance2(point1, point2),
      point1,
      line.vector,
      line.origin,
      include_l$1
    ) || []).map(sect => ({
      vector: normalize2(rotate90(subtract2(...resize_up(sect, point2)))),
      origin: midpoint2(point2, sect)
    }));
  const axiom6 = (line1, line2, point1, point2) => axiom6ud(
    vector_origin_to_ud(line1),
    vector_origin_to_ud(line2),
    point1, point2).map(ud_to_vector_origin);
  const axiom7 = (line1, line2, point) => {
    const intersect = intersect_line_line(
      line1.vector, line1.origin,
      line2.vector, point,
      include_l$1, include_l$1);
    return intersect === undefined
      ? undefined
      : ({
          vector: normalize2(rotate90(subtract2(...resize_up(intersect, point)))),
          origin: midpoint2(point, intersect)
      });
  };

  var axioms = /*#__PURE__*/Object.freeze({
    __proto__: null,
    axiom1: axiom1,
    axiom2: axiom2,
    axiom3: axiom3,
    axiom4: axiom4,
    axiom5: axiom5,
    axiom6: axiom6,
    axiom7: axiom7
  });

  const acos_safe = (x) => {
    if (x >= 1.0) return 0;
    if (x <= -1.0) return Math.PI;
    return Math.acos(x);
  };
  const rotate_vector2 = (center, pt, a) => {
    const x = pt[0] - center[0];
    const y = pt[1] - center[1];
    const xRot = x * Math.cos(a) + y * Math.sin(a);
    const yRot = y * Math.cos(a) - x * Math.sin(a);
    return [center[0] + xRot, center[1] + yRot];
  };
  const intersect_circle_circle = (c1_radius, c1_origin, c2_radius, c2_origin, epsilon = EPSILON) => {
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
    const angle = acos_safe((r * r - d * d - R * R) / (-2.0 * d * R));
    const pt1 = rotate_vector2(bgCenter, point, +angle);
    const pt2 = rotate_vector2(bgCenter, point, -angle);
    return [pt1, pt2];
  };

  const overlap_convex_polygon_point = (poly, point, func = exclude, epsilon = EPSILON) => poly
    .map((p, i, arr) => [p, arr[(i + 1) % arr.length]])
    .map(s => cross2(normalize(subtract(s[1], s[0])), subtract(point, s[0])))
    .map(side => func(side, epsilon))
    .map((s, _, arr) => s === arr[0])
    .reduce((prev, curr) => prev && curr, true);

  const get_unique_pair = (intersections) => {
    for (let i = 1; i < intersections.length; i += 1) {
      if (!equivalent_vector2(intersections[0], intersections[i])) {
        return [intersections[0], intersections[i]];
      }
    }
  };
  const intersect_convex_polygon_line_inclusive = (
    poly,
    vector, origin,
    fn_poly = include_s,
    fn_line = include_l$1,
    epsilon = EPSILON
  ) => {
    const intersections = poly
      .map((p, i, arr) => [p, arr[(i + 1) % arr.length]])
      .map(side => intersect_line_line(
        subtract(side[1], side[0]), side[0],
        vector, origin,
        fn_poly, fn_line,
        epsilon))
      .filter(a => a !== undefined);
    switch (intersections.length) {
      case 0: return undefined;
      case 1: return [intersections];
      default:
        return get_unique_pair(intersections) || [intersections[0]];
    }
  };
  const intersect_convex_polygon_line = (
    poly,
    vector, origin,
    fn_poly = include_s,
    fn_line = exclude_l,
    epsilon = EPSILON
  ) => {
    const sects = intersect_convex_polygon_line_inclusive(poly, vector, origin, fn_poly, fn_line, epsilon);
    let altFunc;
    switch (fn_line) {
      case exclude_r: altFunc = include_r; break;
      case exclude_s: altFunc = include_s; break;
      default: return sects;
    }
    const includes = intersect_convex_polygon_line_inclusive(poly, vector, origin, include_s, altFunc, epsilon);
    if (includes === undefined) { return undefined; }
    const uniqueIncludes = get_unique_pair(includes);
    if (uniqueIncludes === undefined) {
      switch (fn_line) {
        case exclude_l: return undefined;
        case exclude_r:
          return overlap_convex_polygon_point(poly, origin, exclude, epsilon)
            ? includes
            : undefined;
        case exclude_s:
          return overlap_convex_polygon_point(poly, add(origin, vector), exclude, epsilon)
            || overlap_convex_polygon_point(poly, origin, exclude, epsilon)
            ? includes
            : undefined;
      }
    }
    return overlap_convex_polygon_point(poly, midpoint(...uniqueIncludes), exclude, epsilon)
      ? uniqueIncludes
      : sects;
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
      line: (a, b, fnA, fnB, ep) => intersect_convex_polygon_line(...a, ...b, include_s, fnB, ep),
      ray: (a, b, fnA, fnB, ep) => intersect_convex_polygon_line(...a, ...b, include_s, fnB, ep),
      segment: (a, b, fnA, fnB, ep) => intersect_convex_polygon_line(...a, ...b, include_s, fnB, ep),
    },
    circle: {
      circle: (a, b, fnA, fnB, ep) => intersect_circle_circle(...a, ...b, ep),
      line: (a, b, fnA, fnB, ep) => intersect_circle_line(...a, ...b, fnB, ep),
      ray: (a, b, fnA, fnB, ep) => intersect_circle_line(...a, ...b, fnB, ep),
      segment: (a, b, fnA, fnB, ep) => intersect_circle_line(...a, ...b, fnB, ep),
    },
    line: {
      polygon: (a, b, fnA, fnB, ep) => intersect_convex_polygon_line(...b, ...a, include_s, fnA, ep),
      circle: (a, b, fnA, fnB, ep) => intersect_circle_line(...b, ...a, fnA, ep),
      line: (a, b, fnA, fnB, ep) => intersect_line_line(...a, ...b, fnA, fnB, ep),
      ray: (a, b, fnA, fnB, ep) => intersect_line_line(...a, ...b, fnA, fnB, ep),
      segment: (a, b, fnA, fnB, ep) => intersect_line_line(...a, ...b, fnA, fnB, ep),
    },
    ray: {
      polygon: (a, b, fnA, fnB, ep) => intersect_convex_polygon_line(...b, ...a, include_s, fnA, ep),
      circle: (a, b, fnA, fnB, ep) => intersect_circle_line(...b, ...a, fnA, ep),
      line: (a, b, fnA, fnB, ep) => intersect_line_line(...b, ...a, fnB, fnA, ep),
      ray: (a, b, fnA, fnB, ep) => intersect_line_line(...a, ...b, fnA, fnB, ep),
      segment: (a, b, fnA, fnB, ep) => intersect_line_line(...a, ...b, fnA, fnB, ep),
    },
    segment: {
      polygon: (a, b, fnA, fnB, ep) => intersect_convex_polygon_line(...b, ...a, include_s, fnA, ep),
      circle: (a, b, fnA, fnB, ep) => intersect_circle_line(...b, ...a, fnA, ep),
      line: (a, b, fnA, fnB, ep) => intersect_line_line(...b, ...a, fnB, fnA, ep),
      ray: (a, b, fnA, fnB, ep) => intersect_line_line(...b, ...a, fnB, fnA, ep),
      segment: (a, b, fnA, fnB, ep) => intersect_line_line(...a, ...b, fnA, fnB, ep),
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
    line: exclude_l,
    ray: exclude_r,
    segment: exclude_s,
  };
  const intersect = function (a, b, epsilon) {
    const type_a = type_of(a);
    const type_b = type_of(b);
    const aT = similar_intersect_types[type_a];
    const bT = similar_intersect_types[type_b];
    const params_a = intersect_param_form[type_a](a);
    const params_b = intersect_param_form[type_b](b);
    const domain_a = a.domain_function || default_intersect_domain_function[type_a];
    const domain_b = b.domain_function || default_intersect_domain_function[type_b];
    return intersect_func[aT][bT](params_a, params_b, domain_a, domain_b, epsilon);
  };

  const overlap_line_line = (
    aVector, aOrigin,
    bVector, bOrigin,
    aFunction = exclude_l,
    bFunction = exclude_l,
    epsilon = EPSILON
  ) => {
    const denominator0 = cross2(aVector, bVector);
    const denominator1 = -denominator0;
    if (Math.abs(denominator0) < epsilon) {
      return overlap_line_point(aVector, aOrigin, bOrigin, aFunction, epsilon)
       || overlap_line_point(flip(aVector), add(aOrigin, aVector), bOrigin, aFunction, epsilon)
       || overlap_line_point(bVector, bOrigin, aOrigin, bFunction, epsilon)
       || overlap_line_point(flip(bVector), add(bOrigin, bVector), aOrigin, bFunction, epsilon);
    }
    const a2b = [bOrigin[0] - aOrigin[0], bOrigin[1] - aOrigin[1]];
    const b2a = [-a2b[0], -a2b[1]];
    const t0 = cross2(a2b, bVector) / denominator0;
    const t1 = cross2(b2a, aVector) / denominator1;
    return aFunction(t0, epsilon / magnitude(aVector))
      && bFunction(t1, epsilon / magnitude(bVector));
  };

  const overlap_convex_polygons = (poly1, poly2, fn_line = exclude_s, fn_point = exclude, epsilon = EPSILON) => {
    if (overlap_convex_polygon_point(poly1, poly2[0], fn_point, epsilon)) { return true; }
    if (overlap_convex_polygon_point(poly2, poly1[0], fn_point, epsilon)) { return true; }
    const e1 = poly1.map((p, i, arr) => [subtract(arr[(i + 1) % arr.length], p), p]);
    const e2 = poly2.map((p, i, arr) => [subtract(arr[(i + 1) % arr.length], p), p]);
    for (let i = 0; i < e1.length; i += 1) {
      for (let j = 0; j < e2.length; j += 1) {
        if (overlap_line_line(e1[i][0], e1[i][1], e2[j][0], e2[j][1], fn_line, fn_line, epsilon)) {
          return true;
        }
      }
    }
    return false;
  };

  const overlap_circle_point = (radius, origin, point, func = exclude, epsilon = EPSILON) =>
    func(radius - distance2(origin, point), epsilon);

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
      polygon: (a, b, fnA, fnB, ep) => overlap_convex_polygons(...a, ...b, exclude_s, exclude, ep),
      vector: (a, b, fnA, fnB, ep) => overlap_convex_polygon_point(...a, ...b, fnA, ep),
    },
    circle: {
      vector: (a, b, fnA, fnB, ep) => overlap_circle_point(...a, ...b, exclude, ep),
    },
    line: {
      line: (a, b, fnA, fnB, ep) => overlap_line_line(...a, ...b, fnA, fnB, ep),
      ray: (a, b, fnA, fnB, ep) => overlap_line_line(...a, ...b, fnA, fnB, ep),
      segment: (a, b, fnA, fnB, ep) => overlap_line_line(...a, ...b, fnA, fnB, ep),
      vector: (a, b, fnA, fnB, ep) => overlap_line_point(...a, ...b, fnA, ep),
    },
    ray: {
      line: (a, b, fnA, fnB, ep) => overlap_line_line(...b, ...a, fnB, fnA, ep),
      ray: (a, b, fnA, fnB, ep) => overlap_line_line(...a, ...b, fnA, fnB, ep),
      segment: (a, b, fnA, fnB, ep) => overlap_line_line(...a, ...b, fnA, fnB, ep),
      vector: (a, b, fnA, fnB, ep) => overlap_line_point(...a, ...b, fnA, ep),
    },
    segment: {
      line: (a, b, fnA, fnB, ep) => overlap_line_line(...b, ...a, fnB, fnA, ep),
      ray: (a, b, fnA, fnB, ep) => overlap_line_line(...b, ...a, fnB, fnA, ep),
      segment: (a, b, fnA, fnB, ep) => overlap_line_line(...a, ...b, fnA, fnB, ep),
      vector: (a, b, fnA, fnB, ep) => overlap_line_point(...a, ...b, fnA, ep),
    },
    vector: {
      polygon: (a, b, fnA, fnB, ep) => overlap_convex_polygon_point(...b, ...a, fnB, ep),
      circle: (a, b, fnA, fnB, ep) => overlap_circle_point(...b, ...a, exclude, ep),
      line: (a, b, fnA, fnB, ep) => overlap_line_point(...b, ...a, fnB, ep),
      ray: (a, b, fnA, fnB, ep) => overlap_line_point(...b, ...a, fnB, ep),
      segment: (a, b, fnA, fnB, ep) => overlap_line_point(...b, ...a, fnB, ep),
      vector: (a, b, fnA, fnB, ep) => equivalent_vector2(...a, ...b, ep),
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
    line: exclude_l,
    ray: exclude_r,
    segment: exclude_s,
    vector: exclude_l,
  };
  const overlap = function (a, b, epsilon) {
    const type_a = type_of(a);
    const type_b = type_of(b);
    const aT = similar_overlap_types[type_a];
    const bT = similar_overlap_types[type_b];
    const params_a = overlap_param_form[type_a](a);
    const params_b = overlap_param_form[type_b](b);
    const domain_a = a.domain_function || default_overlap_domain_function[type_a];
    const domain_b = b.domain_function || default_overlap_domain_function[type_b];
    return overlap_func[aT][bT](params_a, params_b, domain_a, domain_b, epsilon);
  };

  const enclose_convex_polygons_inclusive = (outer, inner) => {
    const outerGoesInside = outer
      .map(p => overlap_convex_polygon_point(inner, p, include))
      .reduce((a, b) => a || b, false);
    const innerGoesOutside = inner
      .map(p => overlap_convex_polygon_point(inner, p, include))
      .reduce((a, b) => a && b, true);
    return (!outerGoesInside && innerGoesOutside);
  };

  const line_line_parameter = (
    line_vector, line_origin,
    poly_vector, poly_origin,
    poly_line_func = include_s,
    epsilon = EPSILON
  ) => {
    const det_norm = cross2(normalize(line_vector), normalize(poly_vector));
    if (Math.abs(det_norm) < epsilon) { return undefined; }
    const determinant0 = cross2(line_vector, poly_vector);
    const determinant1 = -determinant0;
    const a2b = subtract(poly_origin, line_origin);
    const b2a = flip(a2b);
    const t0 = cross2(a2b, poly_vector) / determinant0;
    const t1 = cross2(b2a, line_vector) / determinant1;
    if (poly_line_func(t1, epsilon / magnitude(poly_vector))) {
      return t0;
    }
    return undefined;
  };
  const line_point_from_parameter = (vector, origin, t) => add(origin, scale(vector, t));
  const get_intersect_parameters = (poly, vector, origin, poly_line_func, epsilon) => poly
    .map((p, i, arr) => [subtract(arr[(i + 1) % arr.length], p), p])
    .map(side => line_line_parameter(
      vector, origin,
      side[0], side[1],
      poly_line_func,
      epsilon))
    .filter(fn_not_undefined)
    .sort((a, b) => a - b);
  const get_min_max = (numbers, func, scaled_epsilon) => {
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
    fn_poly = include,
    fn_line = include_l$1,
    epsilon = EPSILON
  ) => {
    const numbers = get_intersect_parameters(poly, vector, origin, include_s, epsilon);
    if (numbers.length < 2) { return undefined; }
    const scaled_epsilon = (epsilon * 2) / magnitude(vector);
    const ends = get_min_max(numbers, fn_poly, scaled_epsilon);
    if (ends === undefined) { return undefined; }
    const ends_clip = ends.map((t, i) => fn_line(t) ? t : (t < 0.5 ? 0 : 1));
    if (Math.abs(ends_clip[0] - ends_clip[1]) < (epsilon * 2) / magnitude(vector)) {
      return undefined;
    }
    const mid = line_point_from_parameter(vector, origin, (ends_clip[0] + ends_clip[1]) / 2);
    return overlap_convex_polygon_point(poly, mid, fn_poly, epsilon)
      ? ends_clip.map(t => line_point_from_parameter(vector, origin, t))
      : undefined;
  };

  const VectorArgs = function () {
    this.push(...get_vector(arguments));
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
        return equivalent_vectors(this, get_vector(arguments));
      },
      isParallel: function () {
        return parallel(...resize_up(this, get_vector(arguments)));
      },
      isCollinear: function (line) {
        return overlap(this, line);
      },
      dot: function () {
        return dot(...resize_up(this, get_vector(arguments)));
      },
      distanceTo: function () {
        return distance(...resize_up(this, get_vector(arguments)));
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
          resize(3, get_vector(arguments))
        );
      },
      transform: function () {
        return multiply_matrix3_vector3(
          get_matrix_3x4(arguments),
          resize(3, this)
        );
      },
      add: function () {
        return add(this, resize(this.length, get_vector(arguments)));
      },
      subtract: function () {
        return subtract(this, resize(this.length, get_vector(arguments)));
      },
      rotateZ: function (angle, origin) {
        return multiply_matrix3_vector3(
          get_matrix_3x4(make_matrix2_rotate(angle, origin)),
          resize(3, this)
        );
      },
      lerp: function (vector, pct) {
        return lerp(this, resize(this.length, get_vector(vector)), pct);
      },
      midpoint: function () {
        return midpoint(...resize_up(this, get_vector(arguments)));
      },
      bisect: function () {
        return counter_clockwise_bisect2(this, get_vector(arguments));
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
      const points = get_vector_of_vectors(arguments);
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
      const points = get_vector_of_vectors(arguments);
      return this.constructor({
        vector: rotate90(subtract(points[1], points[0])),
        origin: average(points[0], points[1]),
      });
    },
  };

  const methods$1 = {
    isParallel: function () {
      const arr = resize_up(this.vector, get_line(arguments).vector);
      return parallel(...arr);
    },
    isCollinear: function () {
      const line = get_line(arguments);
      return overlap_line_point(this.vector, this.origin, line.origin)
        && parallel(...resize_up(this.vector, line.vector));
    },
    isDegenerate: function (epsilon = EPSILON) {
      return degenerate(this.vector, epsilon);
    },
    reflectionMatrix: function () {
      return Constructors.matrix(make_matrix3_reflectZ(this.vector, this.origin));
    },
    nearestPoint: function () {
      const point = get_vector(arguments);
      return Constructors.vector(
        nearest_point_on_line(this.vector, this.origin, point, this.clip_function)
      );
    },
    transform: function () {
      const dim = this.dimension;
      const r = multiply_matrix3_line3(
        get_matrix_3x4(arguments),
        resize(3, this.vector),
        resize(3, this.origin)
      );
      return this.constructor(resize(dim, r.vector), resize(dim, r.origin));
    },
    translate: function () {
      const origin = add(...resize_up(this.origin, get_vector(arguments)));
      return this.constructor(this.vector, origin);
    },
    intersect: function () {
      return intersect(this, ...arguments);
    },
    overlap: function () {
      return overlap(this, ...arguments);
    },
    bisect: function (lineType, epsilon) {
      const line = get_line(lineType);
      return bisect_lines2(this.vector, this.origin, line.vector, line.origin, epsilon)
        .map(line => this.constructor(line));
    },
  };

  var Line = {
    line: {
      P: Object.prototype,
      A: function () {
        const l = get_line(...arguments);
        this.vector = Constructors.vector(l.vector);
        this.origin = Constructors.vector(resize(this.vector.length, l.origin));
        const ud = vector_origin_to_ud({ vector: this.vector, origin: this.origin });
        this.u = ud.u;
        this.d = ud.d;
        Object.defineProperty(this, "domain_function", { writable: true, value: include_l$1 });
      },
      G: {
        dimension: function () {
          return [this.vector, this.origin]
            .map(p => p.length)
            .reduce((a, b) => Math.max(a, b), 0);
        },
      },
      M: Object.assign({}, methods$1, {
        inclusive: function () { this.domain_function = include_l$1; return this; },
        exclusive: function () { this.domain_function = exclude_l; return this; },
        clip_function: dist => dist,
        svgPath: function (length = 20000) {
          const start = add(this.origin, scale(this.vector, -length / 2));
          const end = scale(this.vector, length);
          return `M${start[0]} ${start[1]}l${end[0]} ${end[1]}`;
        },
      }),
      S: Object.assign({
        ud: function() {
          return this.constructor(ud_to_vector_origin(arguments[0]));
        },
      }, Static)
    }
  };

  var Ray = {
    ray: {
      P: Object.prototype,
      A: function () {
        const ray = get_line(...arguments);
        this.vector = Constructors.vector(ray.vector);
        this.origin = Constructors.vector(resize(this.vector.length, ray.origin));
        Object.defineProperty(this, "domain_function", { writable: true, value: include_r });
      },
      G: {
        dimension: function () {
          return [this.vector, this.origin]
            .map(p => p.length)
            .reduce((a, b) => Math.max(a, b), 0);
        },
      },
      M: Object.assign({}, methods$1, {
        inclusive: function () { this.domain_function = include_r; return this; },
        exclusive: function () { this.domain_function = exclude_r; return this; },
        flip: function () {
          return Constructors.ray(flip(this.vector), this.origin);
        },
        scale: function (scale) {
          return Constructors.ray(this.vector.scale(scale), this.origin);
        },
        normalize: function () {
          return Constructors.ray(this.vector.normalize(), this.origin);
        },
        clip_function: ray_limiter,
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
        const a = get_segment(...arguments);
        this.push(...[a[0], a[1]].map(v => Constructors.vector(v)));
        this.vector = Constructors.vector(subtract(this[1], this[0]));
        this.origin = this[0];
        Object.defineProperty(this, "domain_function", { writable: true, value: include_s });
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
      M: Object.assign({}, methods$1, {
        inclusive: function () { this.domain_function = include_s; return this; },
        exclusive: function () { this.domain_function = exclude_s; return this; },
        clip_function: segment_limiter,
        transform: function (...innerArgs) {
          const dim = this.points[0].length;
          const mat = get_matrix_3x4(innerArgs);
          const transformed_points = this.points
            .map(point => resize(3, point))
            .map(point => multiply_matrix3_vector3(mat, point))
            .map(point => resize(dim, point));
          return Constructors.segment(transformed_points);
        },
        translate: function() {
          const translate = get_vector(arguments);
          const transformed_points = this.points
            .map(point => add(...resize_up(point, translate)));
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
    const circle = get_circle(...arguments);
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
  const cln = n => clean_number(n, 4);
  const ellipticalArcTo = (rx, ry, phi_degrees, fa, fs, endX, endY) =>
    `A${cln(rx)} ${cln(ry)} ${cln(phi_degrees)} ${cln(fa)} ${cln(fs)} ${cln(endX)} ${cln(endY)}`;

  const CircleMethods = {
    nearestPoint: function () {
      return Constructors.vector(nearest_point_on_circle(
        this.radius,
        this.origin,
        get_vector(arguments)
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
        const numbers = flatten_arrays(arguments).filter(a => !isNaN(a));
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

  const methods = {
    area: function () {
      return signed_area(this);
    },
    centroid: function () {
      return Constructors.vector(centroid(this));
    },
    enclosingRectangle: function () {
      return Constructors.rect(enclosing_rectangle(this));
    },
    straightSkeleton: function () {
      return straight_skeleton(this);
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
      const vec = get_vector(...arguments);
      const newPoints = this.map(p => p.map((n, i) => n + vec[i]));
      return this.constructor.fromPoints(newPoints);
    },
    transform: function () {
      const m = get_matrix_3x4(...arguments);
      const newPoints = this
        .map(p => multiply_matrix3_vector3(m, resize(3, p)));
      return Constructors.polygon(newPoints);
    },
    nearest: function () {
      const point = get_vector(...arguments);
      const result = nearest_point_on_polygon(this, point);
      return result === undefined
        ? undefined
        : Object.assign(result, { edge: this.sides[result.i] });
    },
    split: function () {
      const line = get_line(...arguments);
      const split_func = split_convex_polygon;
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
      const fn_line = line_type.domain_function ? line_type.domain_function : include_l;
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
        const r = get_rect(...arguments);
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
      M: Object.assign({}, methods, {
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
          return Constructors.rect(enclosing_rectangle(get_vector_of_vectors(arguments)));
        }
      }
    }
  };

  var Polygon = {
    polygon: {
      P: Array.prototype,
      A: function () {
        this.push(...semi_flatten_arrays(arguments));
        this.sides = this
          .map((p, i, arr) => [p, arr[(i + 1) % arr.length]]);
        this.vectors = this.sides.map(side => subtract(side[1], side[0]));
        Object.defineProperty(this, "domain_function", { writable: true, value: include });
      },
      G: {
        isConvex: function () {
          return true;
        },
        points: function () {
          return this;
        },
      },
      M: Object.assign({}, methods, {
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
          return this.constructor(make_regular_polygon(...arguments));
        },
        convexHull: function () {
          return this.constructor(convex_hull(...arguments));
        },
      }
    }
  };

  const assign = (thisMat, mat) => {
    for (let i = 0; i < 12; i += 1) {
      thisMat[i] = mat[i];
    }
    return thisMat;
  };
  var Matrix = {
    matrix: {
      P: Array.prototype,
      A: function () {
        get_matrix_3x4(arguments).forEach(m => this.push(m));
      },
      G: {
      },
      M: {
        copy: function () { return Constructors.matrix(...Array.from(this)); },
        set: function () {
          return assign(this, get_matrix_3x4(arguments));
        },
        isIdentity: function () { return is_identity3x4(this); },
        multiply: function (mat) {
          return assign(this, multiply_matrices3(this, mat));
        },
        determinant: function () {
          return determinant3(this);
        },
        inverse: function () {
          return assign(this, invert_matrix3(this));
        },
        translate: function (x, y, z) {
          return assign(this,
            multiply_matrices3(this, make_matrix3_translate(x, y, z)));
        },
        rotateX: function (radians) {
          return assign(this,
            multiply_matrices3(this, make_matrix3_rotateX(radians)));
        },
        rotateY: function (radians) {
          return assign(this,
            multiply_matrices3(this, make_matrix3_rotateY(radians)));
        },
        rotateZ: function (radians) {
          return assign(this,
            multiply_matrices3(this, make_matrix3_rotateZ(radians)));
        },
        rotate: function (radians, vector, origin) {
          const transform = make_matrix3_rotate(radians, vector, origin);
          return assign(this, multiply_matrices3(this, transform));
        },
        scale: function (amount) {
          return assign(this,
            multiply_matrices3(this, make_matrix3_scale(amount)));
        },
        reflectZ: function (vector, origin) {
          const transform = make_matrix3_reflectZ(vector, origin);
          return assign(this, multiply_matrices3(this, transform));
        },
        transform: function (...innerArgs) {
          return Constructors.vector(
            multiply_matrix3_vector3(this, resize(3, get_vector(innerArgs)))
          );
        },
        transformVector: function (vector) {
          return Constructors.vector(
            multiply_matrix3_vector3(this, resize(3, get_vector(vector)))
          );
        },
        transformLine: function (...innerArgs) {
          const l = get_line(innerArgs);
          return Constructors.line(multiply_matrix3_line3(this, l.vector, l.origin));
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
    Matrix,
  );
  const create = function (primitiveName, args) {
    const a = Object.create(Definitions[primitiveName].proto);
    Definitions[primitiveName].A.apply(a, args);
    return a;
  };
  const vector = function () { return create("vector", arguments); };
  const circle = function () { return create("circle", arguments); };
  const ellipse = function () { return create("ellipse", arguments); };
  const rect = function () { return create("rect", arguments); };
  const polygon = function () { return create("polygon", arguments); };
  const line = function () { return create("line", arguments); };
  const ray = function () { return create("ray", arguments); };
  const segment = function () { return create("segment", arguments); };
  const matrix = function () { return create("matrix", arguments); };
  Object.assign(Constructors, {
    vector,
    circle,
    ellipse,
    rect,
    polygon,
    line,
    ray,
    segment,
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
    axioms,
    axioms_ud,
    {
      enclose_convex_polygons_inclusive,
      intersect_convex_polygon_line,
      intersect_circle_circle,
      intersect_circle_line,
      intersect_line_line,
      overlap_convex_polygons,
      overlap_convex_polygon_point,
      overlap_line_line,
      overlap_line_point,
      clip_line_in_convex_polygon,
    }
  );
  math.typeof = type_of;
  math.intersect = intersect;
  math.overlap = overlap;

  return math;

})));
