import { get_vector } from "../../parsers/arguments";
import { nearest_point_on_circle } from "../../core/nearest";
import Intersect from "../../intersection/index";
import Constructors from "../constructors";

const CircleMethods = {
  nearestPoint: function () {
    return Constructors.vector(nearest_point_on_circle(
      this.origin,
      this.radius,
      get_vector(arguments)
    ));
  },
  intersect: function (object) {
    return Intersect(this, object);
  },
};

// const tangentThroughPoint
// give us two tangent lines that intersect a point (outside the circle)

export default CircleMethods;
