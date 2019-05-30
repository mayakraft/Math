import * as Input from "../parse/input";
import * as Algebra from "../core/algebra";
import * as Intersection from "../core/intersection";
import { Vector } from "./vector";
import LinePrototype from "./lineProto";

const Line = function (...args) {
  const { point, vector } = Input.get_line(args);

  const transform = function () {
    const mat = Input.get_matrix2(args);
    const line = Algebra.multiply_line_matrix2(point, vector, mat);
    return Line(line[0], line[1]);
  };

  const line = Object.create(LinePrototype());
  const compare_function = function () { return true; };

  Object.defineProperty(line, "compare_function", { value: compare_function });
  Object.defineProperty(line, "clip_function", { value: Intersection.limit_line });

  Object.defineProperty(line, "point", { get: () => Vector(point) });
  Object.defineProperty(line, "vector", { get: () => Vector(vector) });
  Object.defineProperty(line, "length", { get: () => Infinity });
  Object.defineProperty(line, "transform", { value: transform });

  // return Object.freeze(line);
  return line;
};

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
    point: Algebra.average(points[0], points[1]),
    vector: [vec[1], -vec[0]],
    // vector: Algebra.cross3(vec, [0,0,1])
  });
};

export default Line;
