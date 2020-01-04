import { equivalent } from "../../core/equal";
import { parallel } from "../../core/query";
import { bisect_vectors } from "../../core/geometry";

import {
  get_vector,
  get_matrix2,
  get_line,
} from "../../parsers/arguments";

import {
  normalize,
  dot,
  cross3,
  magnitude,
} from "../../core/algebra";

import {
  multiply_matrix2_vector2,
  make_matrix2_rotate,
  make_matrix2_reflection,
} from "../../core/matrix2";

// couple thoughts on design:
//
// if we want to "lock" this object, so that it is never able to be modified
// then the last line should return Object.freeze(proto)
// and the initialization needs to pass in ...values, like:
// const VectorPrototype = function (subtype, ...values)
//
const VectorPrototype = function (subtype) {
  const proto = [];
  // Type === Vector
  const Type = subtype;
  let that;
  const bind = function (theother) {
    that = theother;
  };

  const vecNormalize = function () {
    return Type(normalize(that));
  };
  const vecDot = function (...args) {
    const vec = get_vector(args);
    return this.length > vec.length
      ? dot(vec, that)
      : dot(that, vec);
  };
  const cross = function (...args) {
    const b = get_vector(args);
    const a = that.slice();
    if (a[2] == null) { a[2] = 0; }
    if (b[2] == null) { b[2] = 0; }
    return Type(cross3(a, b));
  };
  const distanceTo = function (...args) {
    const vec = get_vector(args);
    const length = (that.length < vec.length) ? that.length : vec.length;
    const sum = Array.from(Array(length))
      .map((_, i) => (that[i] - vec[i]) ** 2)
      .reduce((prev, curr) => prev + curr, 0);
    return Math.sqrt(sum);
  };
  const transform = function (...args) {
    const m = get_matrix2(args);
    return Type(multiply_matrix2_vector2(m, that));
  };
  const add = function (...args) {
    const vec = get_vector(args);
    return Type(that.map((v, i) => v + vec[i]));
  };
  const subtract = function (...args) {
    const vec = get_vector(args);
    return Type(that.map((v, i) => v - vec[i]));
  };
  // these are implicitly 2D functions, and will convert the vector into 2D
  const rotateZ = function (angle, origin) {
    const m = make_matrix2_rotate(angle, origin);
    return Type(multiply_matrix2_vector2(m, that));
  };
  const rotateZ90 = function () {
    return Type(-that[1], that[0]);
  };
  const rotateZ180 = function () {
    return Type(-that[0], -that[1]);
  };
  const rotateZ270 = function () {
    return Type(that[1], -that[0]);
  };
  const flip = function () {
    return Type(...that.map(n => -n));
  };
  const reflect = function (...args) {
    const ref = get_line(args);
    const m = make_matrix2_reflection(ref.vector, ref.origin);
    return Type(multiply_matrix2_vector2(m, that));
  };
  const lerp = function (vector, pct) {
    const vec = get_vector(vector);
    const inv = 1.0 - pct;
    const length = (that.length < vec.length) ? that.length : vec.length;
    const components = Array.from(Array(length))
      .map((_, i) => that[i] * pct + vec[i] * inv);
    return Type(components);
  };
  const isEquivalent = function (...args) {
    // rect bounding box for now, much cheaper than radius calculation
    const vec = get_vector(args);
    const sm = (that.length < vec.length) ? that : vec;
    const lg = (that.length < vec.length) ? vec : that;
    return equivalent(sm, lg);
  };
  const isParallel = function (...args) {
    const vec = get_vector(args);
    const sm = (that.length < vec.length) ? that : vec;
    const lg = (that.length < vec.length) ? vec : that;
    return parallel(sm, lg);
  };
  const scale = function (mag) {
    return Type(that.map(v => v * mag));
  };
  const midpoint = function (...args) {
    const vec = get_vector(args);
    const sm = (that.length < vec.length) ? that.slice() : vec;
    const lg = (that.length < vec.length) ? vec : that.slice();
    for (let i = sm.length; i < lg.length; i += 1) { sm[i] = 0; }
    return Type(lg.map((_, i) => (sm[i] + lg[i]) * 0.5));
  };
  const bisect = function (...args) {
    const vec = get_vector(args);
    return bisect_vectors(that, vec).map(b => Type(b));
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
  Object.defineProperty(proto, "flip", { value: flip });
  Object.defineProperty(proto, "reflect", { value: reflect });
  Object.defineProperty(proto, "lerp", { value: lerp });
  Object.defineProperty(proto, "isEquivalent", { value: isEquivalent });
  Object.defineProperty(proto, "isParallel", { value: isParallel });
  Object.defineProperty(proto, "scale", { value: scale });
  Object.defineProperty(proto, "midpoint", { value: midpoint });
  Object.defineProperty(proto, "bisect", { value: bisect });
  Object.defineProperty(proto, "copy", { value: () => Type(...that) });
  Object.defineProperty(proto, "magnitude", { get: () => magnitude(that) });
  Object.defineProperty(proto, "bind", { value: bind });
  return proto;
};

export default VectorPrototype;
