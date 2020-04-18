import { EPSILON } from "../../core/equal";
import { bisect_lines2 } from "../../core/geometry";
import { nearest_point_on_line } from "../../core/nearest";
import {
  resizeUp,
  get_vector,
  get_line,
} from "../../parsers/arguments";

import {
  parallel,
  degenerate,
} from "../../core/query";

import Intersect from "../../intersection/index";

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

const Line = function () {};

// todo, this only takes line types. it should be able to take a vector
Line.prototype.isParallel = function () {
  const arr = resizeUp(this.vector, get_line(...arguments).vector);
  console.log(arguments, this.vector, get_line(...arguments).vector, arr);
  return parallel(...arr);
};

Line.prototype.isDegenerate = function (epsilon = EPSILON) {
  return degenerate(this.vector, epsilon);
};

Line.prototype.reflection = function () {
  return Matrix2.makeReflection(this.vector, this.origin);
};

Line.prototype.nearestPoint = function () {
  const point = get_vector(arguments);
  return Vector(nearest_point_on_line(this.vector, this.origin, point, this.clip_function));
};

Line.prototype.intersect = function (other) {
  return Intersect(this, other);
};

Line.prototype.bisect = function () {
  const line = get_line(arguments);
  return bisect_lines2(this.vector, this.origin, line.vector, line.origin);
};

// const collinear = function (point){}
// const equivalent = function (line, epsilon){}

export default Line;
