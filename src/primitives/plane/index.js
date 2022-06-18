/**
 * Math (c) Kraft
 */
import Constructors from "../constructors";
import {
  getVectorOfVectors,
  getLine,
} from "../../arguments/get";
import {
  average,
  subtract,
  rotate90,
} from "../../core/algebra";
import Intersect from "../../intersection/index";

// normal, origin definition
export default {
  plane: {
    A: function () {
      const args = getVectorOfVectors(...arguments);
      this.normal = Constructors.vector((args.length > 0 ? args[0] : null));
      this.origin = Constructors.vector((args.length > 1 ? args[1] : null));
    },

    G: {
      point: function () { return this.origin; },
    },

    M: {
      flip: function () {
        this.normal = this.normal.flip();
      },
      intersect: function (object) {
        return Intersect(this, object);
      },
    },

    S: {
      // three points in 3D space
      fromPoints: function () {
        // const points = getVectorOfVectors(arguments);
        // return this.constructor({
        //   normal: points[0],
        //   origin: points[1],
        // });
      },
      fromLine: function () {
        const line = getLine(arguments);
        return this.constructor(line.vector, line.origin);
      },
      fromRay: function () {
        const line = getLine(arguments);
        return this.constructor(line.vector, line.origin);
      },
    }
  }
};
