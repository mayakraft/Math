import Constructors from "../constructors";
import { get_vector_of_vectors } from "../../parsers/arguments";
import { distance2 } from "../../core/algebra";

const CircleStatic = {
  // static methods
  fromPoints: function () {
    const points = get_vector_of_vectors(arguments);
    return Constructors.circle(points, distance2(points[0], points[1]));
  },
};

export default CircleStatic;
