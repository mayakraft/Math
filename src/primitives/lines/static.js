import {
  average,
  subtract,
  rotate90,
} from "../../core/algebra";

import {
  get_vector_of_vectors,
} from "../../arguments/get";

export default {
  fromPoints: function () {
    const points = get_vector_of_vectors(arguments);
    return this.constructor({
      vector: subtract(points[1], points[0]),
      origin: points[0],
    });
  },
  perpendicularBisector: function () {
    const points = get_vector_of_vectors(arguments);
    return this.constructor({
      vector: rotate90(subtract(points[1], points[0])),
      origin: average(points[0], points[1]),
    });
  },
};
