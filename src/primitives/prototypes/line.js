import { EPSILON } from "../../core/equal";
import { bisect_lines2 } from "../../core/geometry";
import { nearest_point_on_line } from "../../core/nearest";
import {
  resize,
  resize_up
} from "../../arguments/resize";

import {
  get_vector,
  get_line,
  get_matrix_3x4,
} from "../../arguments/get";

import {
  parallel,
  degenerate,
} from "../../core/query";

import { make_matrix2_reflection } from "../../core/matrix2";
import { multiply_matrix3_line3 } from "../../core/matrix3";

import Intersect from "../../intersection/index";

import Constructors from "../constructors";

// do not define object methods as arrow functions in here

/**
 * this prototype is shared among line types: lines, rays, segments.
 * it's counting on each type having defined:
 * - an origin
 * - a vector
 * - compare_function which takes two inputs (t0, epsilon) and returns
 *   true if t0 lies inside the boundary of the line, t0 is scaled to vector
 * - similarly, clip_function, takes two inputs (d, epsilon)
 *   and returns a modified d for what is considered valid space between 0-1
 */

const LineProto = function () {};

// todo, this only takes line types. it should be able to take a vector
LineProto.prototype.isParallel = function () {
  const arr = resize_up(this.vector, get_line(...arguments).vector);
  console.log(arguments, this.vector, get_line(...arguments).vector, arr);
  return parallel(...arr);
};

LineProto.prototype.isDegenerate = function (epsilon = EPSILON) {
  return degenerate(this.vector, epsilon);
};

// todo: convert this to matrix 3x4
LineProto.prototype.reflection = function () {
  // return Constructors.matrix2.makeReflection(this.vector, this.origin);
  return Constructors.matrix(make_matrix2_reflection(this.vector, this.origin));
};

LineProto.prototype.nearestPoint = function () {
  const point = get_vector(arguments);
  return Constructors.vector(
    nearest_point_on_line(this.vector, this.origin, point, this.clip_function)
  );
};

// this works with lines and rays, it should be overwritten for segments
LineProto.prototype.transform = function () {
  const dim = this.dimension;
  const r = multiply_matrix3_line3(
    get_matrix_3x4(arguments),
    resize(3, this.vector),
    resize(3, this.origin)
  );
  return this.constructor(resize(dim, r.vector), resize(dim, r.origin));
};

LineProto.prototype.intersect = function (other) {
  return Intersect(this, other);
};

LineProto.prototype.bisect = function () {
  const line = get_line(arguments);
  return bisect_lines2(this.vector, this.origin, line.vector, line.origin);
};

Object.defineProperty(LineProto.prototype, "dimension", {
  get: function () {
    return [this.vector, this.origin]
      .map(p => p.length)
      .reduce((a, b) => Math.max(a, b), 0);
  }
});

// const collinear = function (point){}
// const equivalent = function (line, epsilon){}

export default LineProto;
