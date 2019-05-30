import * as Input from "../parse/input";
import * as Algebra from "../core/algebra";
import { limit_ray } from "../core/intersection";
import Vector from "./vector";
import Prototype from "./prototypes/line";

const Ray = function (...args) {
  const { point, vector } = Input.get_line(args);

  const transform = function (...innerArgs) {
    const mat = Input.get_matrix2(innerArgs);
    const new_point = Algebra.multiply_vector2_matrix2(point, mat);
    const vec_point = vector.map((vec, i) => vec + point[i]);
    const new_vector = Algebra.multiply_vector2_matrix2(vec_point, mat)
      .map((vec, i) => vec - new_point[i]);
    return Ray(new_point, new_vector);
  };

  const rotate180 = function () {
    return Ray(point[0], point[1], -vector[0], -vector[1]);
  };

  const ray = Object.create(Prototype());
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
  const points = Input.get_two_vec2(args);
  return Ray({
    point: points[0],
    vector: Algebra.normalize([
      points[1][0] - points[0][0],
      points[1][1] - points[0][1],
    ]),
  });
};

export default Ray;
