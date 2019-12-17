import {
  get_vector,
  get_line,
  get_ray,
  get_segment,
} from "../../parsers/arguments";

import {
  parallel,
  degenerate,
} from "../../core/query";

import { EPSILON } from "../../core/equal";
import { intersection_function } from "../../core/intersection";
import {
  nearest_point_on_line,
  bisect_lines2
} from "../../core/geometry";
import Vector from "../vector";
import { Matrix2 } from "../matrix";

// warning do not define object methods as arrow functions in here
// they overwrite the .bind(this) called inside the object initializers.
// it is okay to use arrow functions inside methods.

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
export default function (subtype, prototype) {
  const proto = (prototype != null) ? prototype : {};
  // const Type = subtype;

  const compare_to_line = function (t0, t1, epsilon = EPSILON) {
    return this.compare_function(t0, epsilon) && true;
  };
  const compare_to_ray = function (t0, t1, epsilon = EPSILON) {
    return this.compare_function(t0, epsilon) && t1 >= -epsilon;
  };
  const compare_to_segment = function (t0, t1, epsilon = EPSILON) {
    return this.compare_function(t0, epsilon)
      && t1 >= -epsilon && t1 <= 1 + epsilon;
  };

  const isParallel = function (line, epsilon) {
    if (line.vector == null) {
      throw new Error("isParallel() argument is missing a vector");
    }
    const this_is_smaller = (this.vector.length < line.vector.length);
    const sm = this_is_smaller ? this.vector : line.vector;
    const lg = this_is_smaller ? line.vector : this.vector;
    return parallel(sm, lg, epsilon);
  };
  const isDegenerate = function (epsilon = EPSILON) {
    return degenerate(this.vector, epsilon);
  };
  const reflection = function () {
    return Matrix2.makeReflection(this.vector, this.origin);
  };

  const nearestPoint = function (...args) {
    const point = get_vector(args);
    return Vector(nearest_point_on_line(this.origin, this.vector, point, this.clip_function));
  };
  const intersect = function (other) {
    return intersection_function(this.origin, this.vector, other.origin,
      other.vector,
      ((t0, t1, epsilon = EPSILON) => this.compare_function(t0, epsilon)
        && other.compare_function(t1, epsilon)));
  };
  const intersectLine = function (...args) {
    const line = get_line(args);
    return intersection_function(this.origin, this.vector, line.origin,
      line.vector, compare_to_line.bind(this));
  };
  const intersectRay = function (...args) {
    const ray = get_ray(args);
    return intersection_function(this.origin, this.vector, ray.origin, ray.vector,
      compare_to_ray.bind(this));
  };
  const intersectSegment = function (...args) {
    const edge = get_segment(args);
    const edgeVec = [edge[1][0] - edge[0][0], edge[1][1] - edge[0][1]];
    return intersection_function(this.origin, this.vector, edge[0], edgeVec,
      compare_to_segment.bind(this));
  };
  const bisectLine = function (...args) {
    const line = get_line(args);
    return bisect_lines2(this.origin, this.vector, line.origin, line.vector);
  };
  const bisectRay = function (...args) {
    const ray = get_ray(args);
    return bisect_lines2(this.origin, this.vector, ray.origin, ray.vector);
  };
  const bisectSegment = function (...args) {
    const s = get_segment(args);
    const vector = [s[1][0] - s[0][0], s[1][1] - s[0][1]];
    return bisect_lines2(this.origin, this.vector, s[0], vector);
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
  Object.defineProperty(proto, "intersectSegment", { value: intersectSegment });
  Object.defineProperty(proto, "bisectLine", { value: bisectLine });
  Object.defineProperty(proto, "bisectRay", { value: bisectRay });
  Object.defineProperty(proto, "bisectSegment", { value: bisectSegment });
  // Object.defineProperty(proto, "compare_function", {value: compare_function});
  // Object.defineProperty(proto, "clip_function", {value: clip_function});

  return Object.freeze(proto);
}
