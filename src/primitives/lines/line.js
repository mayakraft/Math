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

import LinePrototype from "../prototypes/line";

// distance is between 0 and 1, representing the vector between start and end. cap accordingly
const limit_line = dist => dist;

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
      transform: function () {
        const mat = get_matrix2(arguments);
        const line = multiply_matrix2_line2(mat, this.origin, this.vector);
        return Constructors.line(line[0], line[1]);
      },
      clip_function: dist => dist,
      // compare_function: () => true,
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
