import Constructors from "../constructors";
import {
  get_line,
  get_matrix2,
  get_vector_of_vectors,
} from "../../parsers/arguments";
import { normalize } from "../../core/algebra";
import {
  multiply_matrix2_vector2,
} from "../../core/matrix2";
import LinePrototype from "../prototypes/line";
import { EPSILON } from "../../core/equal";

export default {
  ray: {
    P: LinePrototype.prototype,

    A: function () {
      const ray = get_line(...arguments);
      this.origin = Constructors.vector(ray.origin);
      this.vector = Constructors.vector(ray.vector);
    },

    G: {
      length: () => Infinity,
    },

    M: {
      transform: function (...innerArgs) {
        const mat = get_matrix2(innerArgs);
        const vec_translated = this.vector.map((vec, i) => vec + this.origin[i]);
        const new_origin = multiply_matrix2_vector2(mat, this.origin);
        const new_vector = multiply_matrix2_vector2(mat, vec_translated)
          .map((vec, i) => vec - new_origin[i]);
        return Constructors.ray(new_origin, new_vector);
      },
      rotate180: function () {
        return Constructors.ray(this.origin[0], this.origin[1], -this.vector[0], -this.vector[1]);
      },
      // distance is between 0 and 1, representing the vector between start and end. cap accordingly
      clip_function: dist => (dist < -EPSILON ? 0 : dist),
    },

    S: {
      fromPoints: function () {
        const p = get_vector_of_vectors(arguments);
        return Constructors.ray({
          origin: p[0],
          vector: [p[1][0] - p[0][0], p[1][1] - p[0][1]],
        });
      },
    }

  }
};
