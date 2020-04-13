import {
  resizeUp,
  get_vector,
  get_line,
  get_ray,
  get_segment,
} from "../../parsers/arguments";

import Intersect from "../../methods/intersect";

import {
  parallel,
  degenerate,
} from "../../core/query";

import { EPSILON } from "../../core/equal";
import { intersection_function } from "../../core/intersection";
import {
  bisect_lines2
} from "../../core/geometry";
import {
  nearest_point_on_line,
} from "../../core/nearest";

// do not define object methods as arrow functions in here

/**
 * this prototype is shared among line types: lines, rays, segments.
 * each must implement:
 * - a point
 * - a vector
 * - compare_function which takes two inputs (t0, epsilon) and returns
 *   true if t0 lies inside the boundary of the line, t0 is scaled to vector
 * - similarly, clip_function, takes two inputs (d, epsilon)
 *   and returns a modified d for what is considered valid space between 0-1
 */

const Line = function () {};

Line.prototype.compare_to_line = function (t0, t1, epsilon = EPSILON) {
  return this.compare_function(t0, epsilon) && true;
};
Line.prototype.compare_to_ray = function (t0, t1, epsilon = EPSILON) {
  return this.compare_function(t0, epsilon) && t1 >= -epsilon;
};
Line.prototype.compare_to_segment = function (t0, t1, epsilon = EPSILON) {
  return this.compare_function(t0, epsilon)
    && t1 >= -epsilon && t1 <= 1 + epsilon;
};
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

Line.prototype.nearestPoint = function (...args) {
  const point = get_vector(args);
  return Vector(nearest_point_on_line(this.origin, this.vector, point, this.clip_function));
};
Line.prototype.intersect = function (other) {
  return Intersect(this, other);
};
// const intersect = function (other) {
//   return intersection_function(this.origin, this.vector, other.origin,
//     other.vector,
//     ((t0, t1, epsilon = EPSILON) => this.compare_function(t0, epsilon)
//       && other.compare_function(t1, epsilon)));
// };
Line.prototype.intersectLine = function (...args) {
  const line = get_line(args);
  return intersection_function(this.origin, this.vector, line.origin,
    line.vector, compare_to_line.bind(this));
};
Line.prototype.intersectRay = function (...args) {
  const ray = get_ray(args);
  return intersection_function(this.origin, this.vector, ray.origin, ray.vector,
    compare_to_ray.bind(this));
};
Line.prototype.intersectSegment = function (...args) {
  const edge = get_segment(args);
  const edgeVec = [edge[1][0] - edge[0][0], edge[1][1] - edge[0][1]];
  return intersection_function(this.origin, this.vector, edge[0], edgeVec,
    compare_to_segment.bind(this));
};
Line.prototype.bisectLine = function (...args) {
  const line = get_line(args);
  return bisect_lines2(this.origin, this.vector, line.origin, line.vector);
};
Line.prototype.bisectRay = function (...args) {
  const ray = get_ray(args);
  return bisect_lines2(this.origin, this.vector, ray.origin, ray.vector);
};
Line.prototype.bisectSegment = function (...args) {
  const s = get_segment(args);
  const vector = [s[1][0] - s[0][0], s[1][1] - s[0][1]];
  return bisect_lines2(this.origin, this.vector, s[0], vector);
};

// const collinear = function (point){}
// const equivalent = function (line, epsilon){}

export default Line;
