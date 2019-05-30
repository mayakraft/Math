import * as Algebra from "../core/algebra";
import * as Input from "../parse/input";
import * as Intersection from "../core/intersection";
import Prototype from "./prototypes/line";
import Vector from "./vector";

const Edge = function (...args) {
  const inputs = Input.get_two_vec2(args);
  const edge = Object.create(Prototype(Edge, []));

  const vecPts = (inputs.length > 0 ? inputs.map(p => Vector(p)) : undefined);
  if (vecPts === undefined) { return undefined; }
  vecPts.forEach((p, i) => { edge[i] = p; });
  // todo: that created an edge with 0 length. even if it contains elements

  const transform = function (...innerArgs) {
    const mat = Input.get_matrix2(innerArgs);
    const transformed_points = edge
      .map(point => Algebra.multiply_vector2_matrix2(point, mat));
    return Edge(transformed_points);
  };
  const vector = function () {
    return Vector(edge[1][0] - edge[0][0], edge[1][1] - edge[0][1]);
  };
  const midpoint = () => Vector(Algebra.average(edge[0], edge[1]));
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
    value: Intersection.limit_edge,
  });
  // Object.defineProperty(edge, "points", {get: function (){ return edge; }});

  // return Object.freeze(edge);
  return edge;
};

export default Edge;
