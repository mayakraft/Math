import { average } from "../core/algebra";
import { multiply_vector2_matrix2 } from "../core/matrix";
import {
  get_two_vec2,
  get_matrix2,
} from "../parsers/arguments";

import { limit_segment } from "../core/intersection";

import Prototype from "./prototypes/line";
import Vector from "./vector";

const Segment = function (...args) {
  const inputs = get_two_vec2(args);
  const proto = Prototype.bind(this);
  const segment = Object.create(proto(Segment, []));

  const vecPts = (inputs.length > 0 ? inputs.map(p => Vector(p)) : undefined);
  if (vecPts === undefined) { return undefined; }
  vecPts.forEach((p, i) => { segment[i] = p; });
  // todo: that created a segment with 0 length. even if it contains elements

  const transform = function (...innerArgs) {
    const mat = get_matrix2(innerArgs);
    const transformed_points = segment
      .map(point => multiply_vector2_matrix2(point, mat));
    return Segment(transformed_points);
  };
  const vector = function () {
    return Vector(segment[1][0] - segment[0][0], segment[1][1] - segment[0][1]);
  };
  const midpoint = () => Vector(average(segment[0], segment[1]));
  const length = function () {
    return Math.sqrt(((segment[1][0] - segment[0][0]) ** 2)
                   + ((segment[1][1] - segment[0][1]) ** 2));
  };
  const compare_function = (t0, ep) => t0 >= -ep && t0 <= 1 + ep;

  Object.defineProperty(segment, "point", { get: () => segment[0] });
  Object.defineProperty(segment, "vector", { get: () => vector() });
  Object.defineProperty(segment, "midpoint", { value: midpoint });
  Object.defineProperty(segment, "length", { get: () => length() });
  Object.defineProperty(segment, "transform", { value: transform });
  Object.defineProperty(segment, "compare_function", { value: compare_function });
  Object.defineProperty(segment, "clip_function", {
    value: limit_segment,
  });
  // Object.defineProperty(segment, "points", {get: function (){ return segment; }});

  // return Object.freeze(segment);
  return segment;
};

export default Segment;
