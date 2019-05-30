import * as Input from "../parse/input";
import * as Algebra from "../core/algebra";
import * as Query from "../core/query";
import * as Geometry from "../core/geometry";

/** n-dimensional vector, but some operations meant only for 2D */
const Vector = function (...args) {
  const proto = VectorProto();
  const vector = Object.create(proto);
  proto.bind(vector);
  Input.get_vector(args).forEach(v => vector.push(v));

  Object.defineProperty(vector, "x", { get: () => vector[0] });
  Object.defineProperty(vector, "y", { get: () => vector[1] });
  Object.defineProperty(vector, "z", { get: () => vector[2] });
  // return Object.freeze(vector);
  return vector;
};

const VectorProto = function (proto) {
  if (proto == null) {
    proto = [];
  }

  let _this;
  const bind = function (that) {
    _this = that;
  };

  const normalize = function () {
    return Vector(Algebra.normalize(_this));
  };
  const dot = function (...args) {
    const vec = Input.get_vector(args);
    return this.length > vec.length
      ? Algebra.dot(vec, _this)
      : Algebra.dot(_this, vec);
  };
  const cross = function (...args) {
    const b = Input.get_vector(args);
    const a = _this.slice();
    if (a[2] == null) { a[2] = 0; }
    if (b[2] == null) { b[2] = 0; }
    return Vector(Algebra.cross3(a, b));
  };
  const distanceTo = function (...args) {
    const vec = Input.get_vector(args);
    const length = (_this.length < vec.length) ? _this.length : vec.length;
    const sum = Array.from(Array(length))
      .map((_, i) => (_this[i] - vec[i]) ** 2)
      .reduce((prev, curr) => prev + curr, 0);
    return Math.sqrt(sum);
  };
  const transform = function (...args) {
    const m = Input.get_matrix2(args);
    return Vector(Algebra.multiply_vector2_matrix2(_this, m));
  };
  const add = function (...args) {
    const vec = Input.get_vector(args);
    return Vector(_this.map((v, i) => v + vec[i]));
  };
  const subtract = function (...args) {
    const vec = Input.get_vector(args);
    return Vector(_this.map((v, i) => v - vec[i]));
  };
  // these are implicitly 2D functions, and will convert the vector into 2D
  const rotateZ = function (angle, origin) {
    const m = Algebra.make_matrix2_rotation(angle, origin);
    return Vector(Algebra.multiply_vector2_matrix2(_this, m));
  };
  const rotateZ90 = function () {
    return Vector(-_this[1], _this[0]);
  };
  const rotateZ180 = function () {
    return Vector(-_this[0], -_this[1]);
  };
  const rotateZ270 = function () {
    return Vector(_this[1], -_this[0]);
  };
  const reflect = function (...args) {
    const ref = Input.get_line(args);
    const m = Algebra.make_matrix2_reflection(ref.vector, ref.point);
    return Vector(Algebra.multiply_vector2_matrix2(_this, m));
  };
  const lerp = function (vector, pct) {
    const vec = Input.get_vector(vector);
    const inv = 1.0 - pct;
    const length = (_this.length < vec.length) ? _this.length : vec.length;
    const components = Array.from(Array(length))
      .map((_, i) => _this[i] * pct + vec[i] * inv);
    return Vector(components);
  };
  const isEquivalent = function (...args) {
    // rect bounding box for now, much cheaper than radius calculation
    const vec = Input.get_vector(args);
    const sm = (_this.length < vec.length) ? _this : vec;
    const lg = (_this.length < vec.length) ? vec : _this;
    return Query.equivalent(sm, lg);
  };
  const isParallel = function (...args) {
    const vec = Input.get_vector(args);
    const sm = (_this.length < vec.length) ? _this : vec;
    const lg = (_this.length < vec.length) ? vec : _this;
    return Query.parallel(sm, lg);
  };
  const scale = function (mag) {
    return Vector(_this.map(v => v * mag));
  };
  const midpoint = function (...args) {
    const vec = Input.get_vector(args);
    const sm = (_this.length < vec.length) ? _this.slice() : vec;
    const lg = (_this.length < vec.length) ? vec : _this.slice();
    for (let i = sm.length; i < lg.length; i += 1) { sm[i] = 0; }
    return Vector(lg.map((_, i) => (sm[i] + lg[i]) * 0.5));
  };
  const bisect = function (...args) {
    const vec = Input.get_vector(args);
    return Geometry.bisect_vectors(_this, vec).map(b => Vector(b));
  };

  Object.defineProperty(proto, "normalize", { value: normalize });
  Object.defineProperty(proto, "dot", { value: dot });
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
  Object.defineProperty(proto, "copy", { value: () => Vector(..._this) });
  Object.defineProperty(proto, "magnitude", {
    get: () => Algebra.magnitude(_this),
  });
  Object.defineProperty(proto, "bind", { value: bind });
  return proto;
};

export default Vector;
