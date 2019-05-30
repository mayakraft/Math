import * as Input from "../parse/input";
import * as Intersection from "../core/intersection";
import * as Query from "../core/query";
import * as Geometry from "../core/geometry";
import { Vector } from "./vector";
import { Matrix2 } from "./matrix";
import { EPSILON } from "../parse/clean";

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
    return Intersection.intersection_function(
      this.point, this.vector,
      other.point, other.vector,
      ((t0, t1, epsilon = EPSILON) => this.compare_function(t0, epsilon)
           && other.compare_function(t1, epsilon))
        .bind(this));
  };
  const intersectLine = function (...args) {
    const line = Input.get_line(args);
    return Intersection.intersection_function(
      this.point, this.vector,
      line.point, line.vector,
      compare_to_line.bind(this));
  };
  const intersectRay = function (...args) {
    let ray = Input.get_ray(args);
    return Intersection.intersection_function(
      this.point, this.vector,
      ray.point, ray.vector,
      compare_to_ray.bind(this));
  };
  const intersectEdge = function (...args) {
    let edge = Input.get_edge(args);
    let edgeVec = [edge[1][0] - edge[0][0], edge[1][1] - edge[0][1]];
    return Intersection.intersection_function(
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
