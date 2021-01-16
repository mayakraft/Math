import Constructors from "../constructors";
import { EPSILON } from "../../core/constants";
import { add, average } from "../../core/algebra";
import { multiply_matrix3_vector3 } from "../../core/matrix3";
import { get_vector } from "../../arguments/get";
import { resize, resize_up } from "../../arguments/resize";
import {
  exclude_s,
  segment_limiter,
} from "../../arguments/functions";
import {
  get_matrix_3x4,
  get_segment,
} from "../../arguments/get";
import LinePrototype from "../prototypes/line";

export default {
  segment: {
    P: LinePrototype.prototype,

    A: function () {
      const args = get_segment(...arguments);
      this.points = [
        Constructors.vector(args[0]),
        Constructors.vector(args[1])
      ];
      this.vector = this.points[1].subtract(this.points[0]);
      this.origin = this.points[0];
    },

    G: {
      0: function () { return this.points[0]; },
      1: function () { return this.points[1]; },
      length: function () { return this.vector.magnitude(); }
    },

    M: {
      // distance is between 0 and 1, representing the vector between start and end. cap accordingly
      // todo. this is repeated in nearest_point_on_polygon
      clip_function: segment_limiter,
      comp_function: exclude_s,
      transform: function (...innerArgs) {
        const dim = this.points[0].length;
        const mat = get_matrix_3x4(innerArgs);
        const transformed_points = this.points
          .map(point => resize(3, point))
          .map(point => multiply_matrix3_vector3(mat, point))
          .map(point => resize(dim, point));
        return Constructors.segment(transformed_points);
      },
      translate: function() {
        const translate = get_vector(arguments);
        const transformed_points = this.points
          .map(point => add(...resize_up(point, translate)));
        return Constructors.segment(transformed_points);
      },
      midpoint: function () {
        return Constructors.vector(average(this.points[0], this.points[1]));
      },
      svgPath: function () {
        const pointStrings = this.points.map(p => `${p[0]} ${p[1]}`);
        return ["M", "L"].map((cmd, i) => `${cmd}${pointStrings[i]}`)
          .join("");
      },
    },

    S: {
      fromPoints: function () {
        return this.constructor(...arguments);
      }
    }

  }
};
