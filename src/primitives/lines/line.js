import Constructors from "../constructors";
import {
  get_line,
  get_matrix2,
  get_vector_of_vectors,
} from "../../parsers/arguments";

import {
  normalize,
  average,
  subtract,
  rotate90,
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
      this.vector = Constructors.vector(l.vector);
      this.origin = Constructors.vector(l.origin);
    },

    G: {
      length: () => Infinity,
    },

    M: {
      transform: function () {
        return Constructors.line(
          multiply_matrix2_line2(
            get_matrix2(arguments),
            this.vector, this.origin));
      },
      clip_function: dist => dist,
      // compare_function: () => true,
    },

    S: {
      fromPoints: function () {
        const points = get_vector_of_vectors(arguments);
        return Constructors.line({
          vector: subtract(points[1], points[0]),
          origin: points[0],
        });
      },
      perpendicularBisector: function () {
        const points = get_vector_of_vectors(arguments);
        return Constructors.line({
          vector: rotate90(subtract(points[1], points[0])),
          origin: average(points[0], points[1]),
        });
      },
    }

  }
};
