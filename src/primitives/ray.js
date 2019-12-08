import {
  get_line,
  get_matrix2,
  get_two_vec2,
} from "../parsers/arguments";

import {
  normalize,
} from "../core/algebra";

import { multiply_vector2_matrix2 } from "../core/matrix";
import { limit_ray } from "../core/intersection";

import Vector from "./vector";
import Prototype from "./prototypes/line";

const Ray = function (...args) {
  const { origin, vector } = get_line(args);

  const transform = function (...innerArgs) {
    const mat = get_matrix2(innerArgs);
    const vec_translated = vector.map((vec, i) => vec + origin[i]);
    const new_origin = multiply_vector2_matrix2(origin, mat);
    const new_vector = multiply_vector2_matrix2(vec_translated, mat)
      .map((vec, i) => vec - new_origin[i]);
    return Ray(new_origin, new_vector);
  };

  const rotate180 = function () {
    return Ray(origin[0], origin[1], -vector[0], -vector[1]);
  };

  const proto = Prototype.bind(this);
  const ray = Object.create(proto(Ray));
  const compare_function = function (t0, ep) { return t0 >= -ep; };
  Object.defineProperty(ray, "origin", { get: () => Vector(origin) });
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
    origin: points[0],
    vector: normalize([
      points[1][0] - points[0][0],
      points[1][1] - points[0][1],
    ]),
  });
};

export default Ray;
