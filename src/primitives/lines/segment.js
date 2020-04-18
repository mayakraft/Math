import Constructors from "../constructors";
import { average } from "../../core/algebra";
import { multiply_matrix2_vector2 } from "../../core/matrix2";
import {
  get_matrix2,
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
      this.origin = this.points[0];
      this.vector = this.points[1].subtract(this.points[0]);
    },

    G: {
      "0": function () { return this.points[0]; },
      "1": function () { return this.points[1]; },
      length: function () { return this.vector.magnitude(); }
    },

    M: {
      // distance is between 0 and 1, representing the vector between start and end. cap accordingly
      clip_function: (dist) => {
        if (dist < -EPSILON) { return 0; }
        if (dist > 1 + EPSILON) { return 1; }
        return dist;
      },
      transform: function (...innerArgs) {
        const mat = get_matrix2(innerArgs);
        const transformed_points = this.points
          .map(point => multiply_matrix2_vector2(mat, point));
        return Constructor.segment(transformed_points);
      },
      scale: function (magnitude) {
        const mid = average(this.points[0], this.points[1]);
        const transformed_points = this.points
          .map(p => p.lerp(mid, magnitude));
        return Constructor.segment(transformed_points);
      },
      midpoint: function () {
        return Constructor.vector(average(this.points[0], this.points[1]));
      },

    },

    S: {
      fromPoints: Constructors.segment
    }

  }
};
