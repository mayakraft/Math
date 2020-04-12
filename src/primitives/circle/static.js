import { get_vector_of_vectors } from "../../parsers/arguments";
import { distance2 } from "../../core/algebra";

const CircleStatic = function (circle) {
  // static methods
  circle.fromPoints = function () {
    const points = get_vector_of_vectors(innerArgs);
    return circle(points, distance2(points[0], points[1]));
  };
};

export default CircleStatic;
