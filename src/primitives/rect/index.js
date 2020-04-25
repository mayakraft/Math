import Constructors from "../constructors";
import Prototype from "../prototypes/polygon";
import { enclosing_rectangle } from "../../core/geometry";
import {
  flatten_arrays,
  get_line,
  get_segment,
  get_vector_of_vectors,
} from "../../parsers/arguments";
import * as Intersect from "../../intersection/polygon";

/**
 * this Rectangle type is aligned to the axes for speedy calculation.
 * for a rectangle that can be rotated, use Polygon or ConvexPolygon
 */
const argsToPoints = (x, y, w, h) => [[x, y], [x + w, y], [x + w, y + h], [x, y + h]];

/**
 * force a point into N-dimensions by adding 0s if they don't exist.
 */
const resize = (d, a) => Array(d).fill(0).map((z, i) => (a[i] ? a[i] : z));

export default {
  rect: {
    P: Prototype.prototype,
    A: function () {
      const n = resize(4, flatten_arrays(arguments));
      this.origin = [n[0], n[1]];
      this.width = n[2];
      this.height = n[3];
      this.points = argsToPoints(...n);
    },
    G: {
      x: function () { return this.origin[0]; },
      y: function () { return this.origin[1]; },
    },
    M: {
      area: function () { return this.width * this.height; },
      scale: function (magnitude, center_point) {
        const center = (center_point != null)
          ? center_point
          : [this.origin[0] + this.width, this.origin[1] + this.height];
        const x = this.origin[0] + (center[0] - this.origin[0]) * (1 - magnitude);
        const y = this.origin[1] + (center[1] - this.origin[1]) * (1 - magnitude);
        return Constructors.rect(x, y, this.width * magnitude, this.height * magnitude);
      },
      clipSegment: function () {
        const edge = get_segment(arguments);
        const e = Intersect.convex_poly_segment(this.points, edge[0], edge[1]);
        return e === undefined ? undefined : Constructors.segment(e);
      },
      clipLine: function () {
        const line = get_line(arguments);
        const e = Intersect.convex_poly_line(this.points, line.vector, line.origin);
        return e === undefined ? undefined : Constructors.segment(e);
      },
      clipRay: function () {
        const line = get_line(arguments);
        const e = Intersect.convex_poly_ray(this.points, line.vector, line.origin);
        return e === undefined ? undefined : Constructors.segment(e);
      },

    },
    S: {
      fromPoints: function () {
        return Constructors.rect(enclosing_rectangle(get_vector_of_vectors(arguments)));
      }
    }
  }
};
