import LinePrototype from "./lineProto";

const Edge = function () {
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
    return Vector(edge[1][0] - edge[0][0], edge[1][1] - edge[0][1]);
  };

  const midpoint = function () {
    return Vector(Algebra.average(_endpoints[0], _endpoints[1]));
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
};

export default Edge;
