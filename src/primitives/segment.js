import { average } from "../core/algebra";
import { multiply_matrix2_vector2 } from "../core/matrix2";
import {
  get_vector_of_vectors,
  get_matrix2,
} from "../parsers/arguments";

import { limit_segment } from "../core/intersection";

import Prototype from "./prototypes/line";
import Vector from "./vector";

const Segment = function (...args) {
  const inputs = get_vector_of_vectors(args);
  const proto = Prototype.bind(this);
  const vecPts = (inputs.length > 0 ? inputs.map(p => Vector(p)) : undefined);
  if (vecPts === undefined) { return undefined; }
  const segment = Object.create(proto(Segment, vecPts));

  const transform = function (...innerArgs) {
    const mat = get_matrix2(innerArgs);
    const transformed_points = segment
      .map(point => multiply_matrix2_vector2(mat, point));
    return Segment(transformed_points);
  };
  const scale = function (magnitude) {
    const mid = average(segment[0], segment[1]);
    const transformed_points = segment
      .map(p => p.lerp(mid, magnitude));
    return Segment(transformed_points);
  };
  const vector = function () {
    return Vector(segment[1][0] - segment[0][0], segment[1][1] - segment[0][1]);
  };
  const midpoint = () => Vector(average(segment[0], segment[1]));
  // overwriting "length" is causing problems due to Array inheritance.
  // renaming from "length" to "magnitude"
  const magnitude = function () {
    return Math.sqrt(((segment[1][0] - segment[0][0]) ** 2)
                   + ((segment[1][1] - segment[0][1]) ** 2));
  };
  const compare_function = (t0, ep) => t0 >= -ep && t0 <= 1 + ep;

  Object.defineProperty(segment, "origin", { get: () => segment[0] });
  Object.defineProperty(segment, "vector", { get: () => vector() });
  Object.defineProperty(segment, "midpoint", { value: midpoint });
  Object.defineProperty(segment, "magnitude", { get: () => magnitude() });
  Object.defineProperty(segment, "transform", { value: transform });
  Object.defineProperty(segment, "scale", { value: scale });
  Object.defineProperty(segment, "compare_function", { value: compare_function });
  Object.defineProperty(segment, "clip_function", {
    value: limit_segment,
  });

  return segment;
};

export default Segment;
