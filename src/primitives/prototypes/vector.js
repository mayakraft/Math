import {
  get_vector,
  get_matrix2,
  get_line,
} from "../../parse/arguments";

import {
  equivalent,
  parallel,
} from "../../core/query";

import {
  normalize,
  dot,
  cross3,
  multiply_vector2_matrix2,
  make_matrix2_rotation,
  make_matrix2_reflection,
  magnitude,
} from "../../core/algebra";

import { bisect_vectors } from "../../core/geometry";

const VectorPrototype = function (subtype) {
  const proto = [];
  // Type === Vector
  const Type = subtype;
  let _this;
  const bind = function (that) {
    _this = that;
  };

  const vecNormalize = function () {
    return Type(normalize(_this));
  };
  const vecDot = function (...args) {
    const vec = get_vector(args);
    return this.length > vec.length
      ? dot(vec, _this)
      : dot(_this, vec);
  };
  const cross = function (...args) {
    const b = get_vector(args);
    const a = _this.slice();
    if (a[2] == null) { a[2] = 0; }
    if (b[2] == null) { b[2] = 0; }
    return Type(cross3(a, b));
  };
  const distanceTo = function (...args) {
    const vec = get_vector(args);
    const length = (_this.length < vec.length) ? _this.length : vec.length;
    const sum = Array.from(Array(length))
      .map((_, i) => (_this[i] - vec[i]) ** 2)
      .reduce((prev, curr) => prev + curr, 0);
    return Math.sqrt(sum);
  };
  const transform = function (...args) {
    const m = get_matrix2(args);
    return Type(multiply_vector2_matrix2(_this, m));
  };
  const add = function (...args) {
    const vec = get_vector(args);
    return Type(_this.map((v, i) => v + vec[i]));
  };
  const subtract = function (...args) {
    const vec = get_vector(args);
    return Type(_this.map((v, i) => v - vec[i]));
  };
  // these are implicitly 2D functions, and will convert the vector into 2D
  const rotateZ = function (angle, origin) {
    const m = make_matrix2_rotation(angle, origin);
    return Type(multiply_vector2_matrix2(_this, m));
  };
  const rotateZ90 = function () {
    return Type(-_this[1], _this[0]);
  };
  const rotateZ180 = function () {
    return Type(-_this[0], -_this[1]);
  };
  const rotateZ270 = function () {
    return Type(_this[1], -_this[0]);
  };
  const reflect = function (...args) {
    const ref = get_line(args);
    const m = make_matrix2_reflection(ref.vector, ref.point);
    return Type(multiply_vector2_matrix2(_this, m));
  };
  const lerp = function (vector, pct) {
    const vec = get_vector(vector);
    const inv = 1.0 - pct;
    const length = (_this.length < vec.length) ? _this.length : vec.length;
    const components = Array.from(Array(length))
      .map((_, i) => _this[i] * pct + vec[i] * inv);
    return Type(components);
  };
  const isEquivalent = function (...args) {
    // rect bounding box for now, much cheaper than radius calculation
    const vec = get_vector(args);
    const sm = (_this.length < vec.length) ? _this : vec;
    const lg = (_this.length < vec.length) ? vec : _this;
    return equivalent(sm, lg);
  };
  const isParallel = function (...args) {
    const vec = get_vector(args);
    const sm = (_this.length < vec.length) ? _this : vec;
    const lg = (_this.length < vec.length) ? vec : _this;
    return parallel(sm, lg);
  };
  const scale = function (mag) {
    return Type(_this.map(v => v * mag));
  };
  const midpoint = function (...args) {
    const vec = get_vector(args);
    const sm = (_this.length < vec.length) ? _this.slice() : vec;
    const lg = (_this.length < vec.length) ? vec : _this.slice();
    for (let i = sm.length; i < lg.length; i += 1) { sm[i] = 0; }
    return Type(lg.map((_, i) => (sm[i] + lg[i]) * 0.5));
  };
  const bisect = function (...args) {
    const vec = get_vector(args);
    return bisect_vectors(_this, vec).map(b => Type(b));
  };

  Object.defineProperty(proto, "normalize", { value: vecNormalize });
  Object.defineProperty(proto, "dot", { value: vecDot });
  Object.defineProperty(proto, "cross", { value: cross });
  Object.defineProperty(proto, "distanceTo", { value: distanceTo });
  Object.defineProperty(proto, "transform", { value: transform });
  Object.defineProperty(proto, "add", { value: add });
  Object.defineProperty(proto, "subtract", { value: subtract });
  Object.defineProperty(proto, "rotateZ", { value: rotateZ });
  Object.defineProperty(proto, "rotateZ90", { value: rotateZ90 });
  Object.defineProperty(proto, "rotateZ180", { value: rotateZ180 });
  Object.defineProperty(proto, "rotateZ270", { value: rotateZ270 });
  Object.defineProperty(proto, "reflect", { value: reflect });
  Object.defineProperty(proto, "lerp", { value: lerp });
  Object.defineProperty(proto, "isEquivalent", { value: isEquivalent });
  Object.defineProperty(proto, "isParallel", { value: isParallel });
  Object.defineProperty(proto, "scale", { value: scale });
  Object.defineProperty(proto, "midpoint", { value: midpoint });
  Object.defineProperty(proto, "bisect", { value: bisect });
  Object.defineProperty(proto, "copy", {
    value: function () { return Type(..._this); }
  });
  Object.defineProperty(proto, "magnitude", {
    get: function () { return magnitude(_this); },
  });
  Object.defineProperty(proto, "bind", { value: bind });
  return proto;
};

export default VectorPrototype;
