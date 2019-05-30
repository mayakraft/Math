import * as Input from "../parse/input";
import * as Intersection from "../core/intersection";
import * as Query from "../core/query";
import * as Geometry from "../core/geometry";
import { Vector } from "./vector";
import { Matrix2 } from "./matrix";
import { EPSILON } from "../parse/clean";
import * as Algebra from "../core/algebra";

export const VectorProto = function (proto) {
  if (proto == null) {
    proto = [];
  }

  let _this;

  const bind = function(that) {
    _this = that;
  }


  const normalize = function () {
    return Vector( Algebra.normalize(_this) );
  }
  const dot = function () {
    let vec = Input.get_vector(...arguments);
    return this.length > vec.length
      ? Algebra.dot(vec, _this)
      : Algebra.dot(_this, vec);
  }
  const cross = function () {
    let b = Input.get_vector(...arguments);
    let a = _this.slice();
    if(a[2] == null){ a[2] = 0; }
    if(b[2] == null){ b[2] = 0; }
    return Vector( Algebra.cross3(a, b) );
  }
  const distanceTo = function () {
    let vec = Input.get_vector(...arguments);
    let length = (_this.length < vec.length) ? _this.length : vec.length;
    let sum = Array.from(Array(length))
      .map((_,i) => Math.pow(_this[i] - vec[i], 2))
      .reduce((prev, curr) => prev + curr, 0);
    return Math.sqrt(sum);
  }
  const transform = function () {
    let m = Input.get_matrix2(...arguments);
    return Vector( Algebra.multiply_vector2_matrix2(_this, m) );
  }
  const add = function () {
    let vec = Input.get_vector(...arguments);
    return Vector( _this.map((v,i) => v + vec[i]) );
  }
  const subtract = function () {
    let vec = Input.get_vector(...arguments);
    return Vector( _this.map((v,i) => v - vec[i]) );
  }
  // these are implicitly 2D functions, and will convert the vector into 2D
  const rotateZ = function (angle, origin) {
    var m = Algebra.make_matrix2_rotation(angle, origin);
    return Vector( Algebra.multiply_vector2_matrix2(_this, m) );
  }
  const rotateZ90 = function () {
    return Vector(-_this[1], _this[0]);
  }
  const rotateZ180 = function () {
    return Vector(-_this[0], -_this[1]);
  }
  const rotateZ270 = function () {
    return Vector(_this[1], -_this[0]);
  }
  const reflect = function () {
    let reflect = Input.get_line(...arguments);
    let m = Algebra.make_matrix2_reflection(reflect.vector, reflect.point);
    return Vector( Algebra.multiply_vector2_matrix2(_this, m) );
  }
  const lerp = function (vector, pct) {
    let vec = Input.get_vector(vector);
    let inv = 1.0 - pct;
    let length = (_this.length < vec.length) ? _this.length : vec.length;
    let components = Array.from(Array(length))
      .map((_,i) => _this[i] * pct + vec[i] * inv)
    return Vector(components);
  }
  const isEquivalent = function () {
    // rect bounding box for now, much cheaper than radius calculation
    let vec = Input.get_vector(...arguments);
    let sm = (_this.length < vec.length) ? _this : vec;
    let lg = (_this.length < vec.length) ? vec : _this;
    return Query.equivalent(sm, lg);
  }
  const isParallel = function () {
    let vec = Input.get_vector(...arguments);
    let sm = (_this.length < vec.length) ? _this : vec;
    let lg = (_this.length < vec.length) ? vec : _this;
    return Query.parallel(sm, lg);
  }
  const scale = function (mag) {
    return Vector( _this.map(v => v * mag) );
  }
  const midpoint = function () {
    let vec = Input.get_vector(...arguments);
    let sm = (_this.length < vec.length) ? _this.slice() : vec;
    let lg = (_this.length < vec.length) ? vec : _this.slice();
    for (let i = sm.length; i < lg.length; i++) { sm[i] = 0; }
    return Vector(lg.map((_,i) => (sm[i] + lg[i]) * 0.5));
  }
  const bisect = function () {
    let vec = Input.get_vector(...arguments);
    return Geometry.bisect_vectors(_this, vec).map(b => Vector(b));
  }

  Object.defineProperty(proto, "normalize", {value: normalize});
  Object.defineProperty(proto, "dot", {value: dot});
  Object.defineProperty(proto, "cross", {value: cross});
  Object.defineProperty(proto, "distanceTo", {value: distanceTo});
  Object.defineProperty(proto, "transform", {value: transform});
  Object.defineProperty(proto, "add", {value: add});
  Object.defineProperty(proto, "subtract", {value: subtract});
  Object.defineProperty(proto, "rotateZ", {value: rotateZ});
  Object.defineProperty(proto, "rotateZ90", {value: rotateZ90});
  Object.defineProperty(proto, "rotateZ180", {value: rotateZ180});
  Object.defineProperty(proto, "rotateZ270", {value: rotateZ270});
  Object.defineProperty(proto, "reflect", {value: reflect});
  Object.defineProperty(proto, "lerp", {value: lerp});
  Object.defineProperty(proto, "isEquivalent", {value: isEquivalent});
  Object.defineProperty(proto, "isParallel", {value: isParallel});
  Object.defineProperty(proto, "scale", {value: scale});
  Object.defineProperty(proto, "midpoint", {value: midpoint});
  Object.defineProperty(proto, "bisect", {value: bisect});
  Object.defineProperty(proto, "bind", {value: bind});
  

  Object.defineProperty(proto, "magnitude", {get: function () {
    console.log(_this);
    return Algebra.magnitude(_this);
  }});
  Object.defineProperty(proto, "copy", {value: function () { return Vector(..._this);}});
  return proto;
};

/**
 * this is a prototype for line types, it's required that you implement:
 * - a point, and a vector
 * - a function compare_function which takes two inputs (t0, epsilon) and returns
 *   true if t0 lies inside the boundary of the line, t0 is scaled to vector
 * - similarly, a function clip_function, takes two inputs (d, epsilon)
 *   and returns a modified d for what is considered valid space between 0-1
 */
export const Line = function (proto) {
  if (proto == null) {
    proto = {};
  }

  const compare_to_line = function (t0, t1, epsilon = EPSILON) {
    return this.compare_function (t0, epsilon) && true;
  };
  const compare_to_ray = function (t0, t1, epsilon = EPSILON) {
    return this.compare_function (t0, epsilon) && t1 >= -epsilon;
  };
  const compare_to_edge = function (t0, t1, epsilon = EPSILON) {
    return this.compare_function (t0, epsilon) && t1 >= -epsilon && t1 <= 1+epsilon;
  };

  const isParallel = function (line, epsilon) {
    if (line.vector == null) {
      throw "line isParallel(): please ensure object contains a vector";
    }
    const this_is_smaller = (this.vector.length < line.vector.length);
    const sm = this_is_smaller ? this.vector : line.vector;
    const lg = this_is_smaller ? line.vector : this.vector;
    return Query.parallel(sm, lg, epsilon);
  };
  const isDegenerate = epsilon => Query.degenerate(this.vector, epsilon);
  const reflection = () => Matrix2.makeReflection(this.vector, this.point);

  const nearestPoint = function (...args) {
    const point = Input.get_vector(args);
    return Vector(Geometry.nearest_point(this.point, this.vector, point, this.clip_function));
  };
  const intersect = function (other) {
    return Intersection.intersection_function (
      this.point, this.vector,
      other.point, other.vector,
      ((t0, t1, epsilon = EPSILON) => this.compare_function (t0, epsilon)
           && other.compare_function (t1, epsilon))
        .bind(this));
  };
  const intersectLine = function (...args) {
    const line = Input.get_line(args);
    return Intersection.intersection_function (
      this.point, this.vector,
      line.point, line.vector,
      compare_to_line.bind(this));
  };
  const intersectRay = function (...args) {
    let ray = Input.get_ray(args);
    return Intersection.intersection_function (
      this.point, this.vector,
      ray.point, ray.vector,
      compare_to_ray.bind(this));
  };
  const intersectEdge = function (...args) {
    let edge = Input.get_edge(args);
    let edgeVec = [edge[1][0] - edge[0][0], edge[1][1] - edge[0][1]];
    return Intersection.intersection_function (
      this.point, this.vector,
      edge[0], edgeVec,
      compare_to_edge.bind(this));
  };

  // const collinear = function (point){}
  // const equivalent = function (line, epsilon){}

  Object.defineProperty(proto, "isParallel", { value: isParallel });
  Object.defineProperty(proto, "isDegenerate", { value: isDegenerate });
  Object.defineProperty(proto, "nearestPoint", { value: nearestPoint });
  Object.defineProperty(proto, "reflection", { value: reflection });
  Object.defineProperty(proto, "intersect", { value: intersect });
  Object.defineProperty(proto, "intersectLine", { value: intersectLine });
  Object.defineProperty(proto, "intersectRay", { value: intersectRay });
  Object.defineProperty(proto, "intersectEdge", { value: intersectEdge });
  // Object.defineProperty(proto, "compare_function", {value: compare_function});
  // Object.defineProperty(proto, "clip_function", {value: clip_function});

  return Object.freeze(proto);
};

export const another = 5;
