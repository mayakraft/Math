import LinePrototype from "./lineProto";

const Ray = function () {
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

export default Ray;
