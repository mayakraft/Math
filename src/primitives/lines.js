import * as Input from "../parse/input";
import * as Algebra from "../core/algebra";
import * as Intersection from "../core/intersection";
import { Vector } from "./vector";

import * as Prototypes from "./prototypes";

export function Line(...args) {
  const { point, vector } = Input.get_line(args);

  const transform = function () {
    const mat = Input.get_matrix2(args);
    const line = Algebra.multiply_line_matrix2(point, vector, mat);
    return Line(line[0], line[1]);
  };

  const line = Object.create(Prototypes.Line());
  const compare_function = function () { return true; };

  Object.defineProperty(line, "compare_function", { value: compare_function });
  Object.defineProperty(line, "clip_function", { value: Intersection.limit_line });

  Object.defineProperty(line, "point", { get: () => Vector(point) });
  Object.defineProperty(line, "vector", { get: () => Vector(vector) });
  Object.defineProperty(line, "length", { get: () => Infinity });
  Object.defineProperty(line, "transform", { value: transform });

  // return Object.freeze(line);
  return line;
}
// static methods
Line.fromPoints = function (...args) {
  const points = Input.get_two_vec2(args);
  return Line({
    point: points[0],
    vector: Algebra.normalize([
      points[1][0] - points[0][0],
      points[1][1] - points[0][1],
    ]),
  });
};

Line.perpendicularBisector = function (...args) {
  const points = Input.get_two_vec2(args);
  const vec = Algebra.normalize([
    points[1][0] - points[0][0],
    points[1][1] - points[0][1],
  ]);
  return Line({
    point: Algebra.midpoint(points[0], points[1]),
    vector: [vec[1], -vec[0]],
    // vector: Algebra.cross3(vec, [0,0,1])
  });
};


export function Ray() {
  let { point, vector } = Input.get_line(...arguments);

  const transform = function () {
    let mat = Input.get_matrix2(...arguments);
    let new_point = Algebra.multiply_vector2_matrix2(point, mat);
    let vec_point = vector.map((vec,i) => vec + point[i]);
    let new_vector = Algebra.multiply_vector2_matrix2(vec_point, mat)
      .map((vec,i) => vec - new_point[i]);
    return Ray(new_point, new_vector);
  };

  const rotate180 = function () {
    return Ray(point[0], point[1], -vector[0], -vector[1]);
  };

  let ray = Object.create(LinePrototype());
  const compare_function = function (t0, ep) { return t0 >= -ep; };
  Object.defineProperty(ray, "compare_function", { value: compare_function });
  Object.defineProperty(ray, "clip_function", { value: Intersection.limit_ray });

  Object.defineProperty(ray, "point", {get: function (){ return Vector(point); }});
  Object.defineProperty(ray, "vector", {get: function (){ return Vector(vector); }});
  Object.defineProperty(ray, "length", {get: function (){ return Infinity; }});
  Object.defineProperty(ray, "transform", {value: transform});
  Object.defineProperty(ray, "rotate180", {value: rotate180});

  // return Object.freeze(ray);
  return ray;
}
// static methods
Ray.fromPoints = function () {
  let points = Input.get_two_vec2(...arguments);
  return Ray({
    point: points[0],
    vector: Algebra.normalize([
      points[1][0] - points[0][0],
      points[1][1] - points[0][1]
    ])
  });
};


export function Edge() {
  let inputs = Input.get_two_vec2(...arguments);
  let edge = Object.create(LinePrototype(Array()));

  let _endpoints = (inputs.length > 0 ? inputs.map(p => Vector(p)) : undefined);
  if (_endpoints === undefined) { return; }
  _endpoints.forEach((p,i) => edge[i] = p);
  // todo: that created an edge with 0 length. even if it contains elements

  const transform = function () {
    let mat = Input.get_matrix2(...arguments);
    let transformed_points = edge
      .map(point => Algebra.multiply_vector2_matrix2(point, mat));
    return Edge(transformed_points);
  };

  const vector = function () {
    return Vector(
      edge[1][0] - edge[0][0],
      edge[1][1] - edge[0][1],
    );
  };

  const midpoint = function () {
    return Vector(Algebra.midpoint(_endpoints[0], _endpoints[1]));
  };

  const length = function () {
    return Math.sqrt(((edge[1][0] - edge[0][0]) ** 2)
                   + ((edge[1][1] - edge[0][1]) ** 2));
  };

  const compare_function = function (t0, ep) { return t0 >= -ep && t0 <= 1+ep; }
  Object.defineProperty(edge, "compare_function", { value: compare_function });
  Object.defineProperty(edge, "clip_function", { value: Intersection.limit_edge });

  // Object.defineProperty(edge, "points", {get: function (){ return edge; }});
  Object.defineProperty(edge, "point", {get: function (){ return edge[0]; }});
  Object.defineProperty(edge, "vector", {get: function (){ return vector(); }});
  Object.defineProperty(edge, "midpoint", {value: midpoint});
  Object.defineProperty(edge, "length", {get: function (){ return length(); }});
  Object.defineProperty(edge, "transform", {value: transform});

  // return Object.freeze(edge);
  return edge;
}
