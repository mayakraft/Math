import Constructors from "../constructors";
import {
  get_line,
  get_matrix2,
  get_vector_of_vectors,
} from "../../parsers/arguments";

import {
  normalize,
  average
} from "../../core/algebra";

import { multiply_matrix2_line2 } from "../../core/matrix2";
import { limit_line } from "../../core/intersection";

import LinePrototype from "../prototypes/line";

export default {
  line: {
    P: LinePrototype.prototype,

    A: function () {
      const l = get_line(...arguments);
      this.origin = Constructors.vector(l.origin);
      this.vector = Constructors.vector(l.vector);
    },

    G: {
      length: () => Infinity,
    },

    M: {
      area: function () { return this.width * this.height },
      transform: function () {
        const mat = get_matrix2(arguments);
        const line = multiply_matrix2_line2(mat, this.origin, this.vector);
        return Line(line[0], line[1]);
      },
      compare_function: () => true,
      clip_function: limit_line,
    },

    S: {
      fromPoints: function () {
        const points = get_vector_of_vectors(arguments);
        return Constructors.line({
          origin: points[0],
          vector: [
            points[1][0] - points[0][0],
            points[1][1] - points[0][1],
          ],
        });
      },
      perpendicularBisector: function () {
        const points = get_vector_of_vectors(arguments);
        const vec = normalize([
          points[1][0] - points[0][0],
          points[1][1] - points[0][1],
        ]);
        return Constructors.line({
          origin: average(points[0], points[1]),
          vector: [vec[1], -vec[0]],
          // vector: cross3(vec, [0,0,1])
        });
      },
    }

  }
};
