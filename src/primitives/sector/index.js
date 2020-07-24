import Constructors from "../constructors";
import {
  get_vector_of_vectors,
} from "../../arguments/get";
import {
  average,
  subtract,
  rotate90,
} from "../../core/algebra";
import Intersect from "../../intersection/index";

export default {
  sector: {
    A: function () {
      const args = get_vector_of_vectors(...arguments);
      this.origin = (args.length >= 3)
        ? args[2]
        : Constructors.vector(0, 0);
      this.vectors = [0, 1].map(i => args[i]).map(arg => Constructors.vector(arg));
    },

    G: {
      point: function () { return this.origin; },
    },

    M: {
      bisect: function () {
        this.normal = this.normal.flip();
      },
      intersect: function (object) {
        return Intersect(this, object);
      },
    },

    S: {
      // three points in 3D space
      interior: function () {
        const args = get_vector_of_vectors(...arguments);
        this.vectors = [0, 1].map(i => args[i]).map(arg => Constructors.vector(arg));

        // const points = get_vector_of_vectors(arguments);
        // return this.constructor({
        //   normal: points[0],
        //   origin: points[1],
        // });
      },
    }
  }
};
