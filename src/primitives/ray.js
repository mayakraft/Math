import {
  get_line,
  get_matrix2,
  get_two_vec2,
} from "../parsers/arguments";

import {
  normalize,
  multiply_vector2_matrix2,
} from "../core/algebra";

import { limit_ray } from "../core/intersection";

import Vector from "./vector";
import Prototype from "./prototypes/line";

const Ray = function (...args) {
  const { point, vector } = get_line(args);

  const transform = function (...innerArgs) {
    const mat = get_matrix2(innerArgs);
    const new_point = multiply_vector2_matrix2(point, mat);
    const vec_point = vector.map((vec, i) => vec + point[i]);
    const new_vector = multiply_vector2_matrix2(vec_point, mat)
      .map((vec, i) => vec - new_point[i]);
    return Ray(new_point, new_vector);
  };

  const rotate180 = function () {
    return Ray(point[0], point[1], -vector[0], -vector[1]);
  };

  const proto = Prototype.bind(this);
  const ray = Object.create(proto(Ray));
  const compare_function = function (t0, ep) { return t0 >= -ep; };
  Object.defineProperty(ray, "point", { get: () => Vector(point) });
  Object.defineProperty(ray, "vector", { get: () => Vector(vector) });
  Object.defineProperty(ray, "length", { get: () => Infinity });
  Object.defineProperty(ray, "transform", { value: transform });
  Object.defineProperty(ray, "rotate180", { value: rotate180 });
  Object.defineProperty(ray, "compare_function", { value: compare_function });
  Object.defineProperty(ray, "clip_function", { value: limit_ray });

  // return Object.freeze(ray);
  return ray;
};

// static methods
Ray.fromPoints = function (...args) {
  const points = get_two_vec2(args);
  return Ray({
    point: points[0],
    vector: normalize([
      points[1][0] - points[0][0],
      points[1][1] - points[0][1],
    ]),
  });
};

export default Ray;
