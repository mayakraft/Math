import Constructors from "../constructors";
import { average } from "../../core/algebra";
import { multiply_matrix3_vector3 } from "../../core/matrix3";
import {
  resize,
  get_matrix_3x4,
  get_segment,
} from "../../parsers/arguments";
import LinePrototype from "../prototypes/line";
import { EPSILON } from "../../core/equal";

export default {
  segment: {
    P: LinePrototype.prototype,

    A: function () {
      // const segment = Object.create(proto(Segment, points));
      this.points = get_segment(...arguments)
        .map(p => Constructors.vector(p));
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
      clip_function: (dist) => {
        if (dist < -EPSILON) { return 0; }
        if (dist > 1 + EPSILON) { return 1; }
        return dist;
      },
      transform: function (...innerArgs) {
        const dim = this.dimension;
        const mat = get_matrix_3x4(innerArgs);
        const transformed_points = this.points
          .map(point => resize(3, point))
          .map(point => multiply_matrix3_vector3(mat, point))
          .map(point => resize(dim, point));
        return Constructors.segment(transformed_points);
      },
      scale: function (magnitude) {
        const mid = average(this.points[0], this.points[1]);
        const transformed_points = this.points
          .map(p => p.lerp(mid, magnitude));
        return Constructors.segment(transformed_points);
      },
      midpoint: function () {
        return Constructors.vector(average(this.points[0], this.points[1]));
      },
    },

    S: {
      fromPoints: function () {
        return this.constructor(...arguments);
      }
    }

  }
};
