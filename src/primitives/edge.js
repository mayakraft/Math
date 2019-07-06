import { average } from "../core/algebra";
import { multiply_vector2_matrix2 } from "../core/matrix";
import {
  get_two_vec2,
  get_matrix2,
} from "../parsers/arguments";

import { limit_edge } from "../core/intersection";

import Prototype from "./prototypes/line";
import Vector from "./vector";

const Edge = function (...args) {
  const inputs = get_two_vec2(args);
  const proto = Prototype.bind(this);
  const edge = Object.create(proto(Edge, []));

  const vecPts = (inputs.length > 0 ? inputs.map(p => Vector(p)) : undefined);
  if (vecPts === undefined) { return undefined; }
  vecPts.forEach((p, i) => { edge[i] = p; });
  // todo: that created an edge with 0 length. even if it contains elements

  const transform = function (...innerArgs) {
    const mat = get_matrix2(innerArgs);
    const transformed_points = edge
      .map(point => multiply_vector2_matrix2(point, mat));
    return Edge(transformed_points);
  };
  const vector = function () {
    return Vector(edge[1][0] - edge[0][0], edge[1][1] - edge[0][1]);
  };
  const midpoint = () => Vector(average(edge[0], edge[1]));
  const length = function () {
    return Math.sqrt(((edge[1][0] - edge[0][0]) ** 2)
                   + ((edge[1][1] - edge[0][1]) ** 2));
  };
  const compare_function = (t0, ep) => t0 >= -ep && t0 <= 1 + ep;

  Object.defineProperty(edge, "point", { get: () => edge[0] });
  Object.defineProperty(edge, "vector", { get: () => vector() });
  Object.defineProperty(edge, "midpoint", { value: midpoint });
  Object.defineProperty(edge, "length", { get: () => length() });
  Object.defineProperty(edge, "transform", { value: transform });
  Object.defineProperty(edge, "compare_function", { value: compare_function });
  Object.defineProperty(edge, "clip_function", {
    value: limit_edge,
  });
  // Object.defineProperty(edge, "points", {get: function (){ return edge; }});

  // return Object.freeze(edge);
  return edge;
};

export default Edge;
