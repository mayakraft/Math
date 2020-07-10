import Constructors from "../constructors";
import Prototype from "../prototypes/polygon";
import { semi_flatten_arrays } from "../../parsers/arguments";
import {
  convex_hull,
  make_regular_polygon,
} from "../../core/geometry";

export default {
  polygon: {
    P: Prototype.prototype,
    A: function () {
      this.points = semi_flatten_arrays(arguments);
        // .map(v => Constructors.vector(v));
      this.sides = this.points
        .map((p, i, arr) => [p, arr[(i + 1) % arr.length]]);
        // .map(ps => Constructors.segment(ps[0][0], ps[0][1], ps[1][0], ps[1][1]));
      // this.sectors
    },
    G: {
      isConvex: function () {
        return true;
      },
      edges: function () {
        return this.sides;
      },
    },
    M: {
      segments: function () {
        return this.sides;
      }
    },
    S: {
      fromPoints: function () {
        return this.constructor(...arguments);
      },
      regularPolygon: function (sides, x = 0, y = 0, radius = 1) {
        return this.constructor(make_regular_polygon(sides, x, y, radius));
      },
      convexHull: function (points, includeCollinear = false) {
        return this.constructor(convex_hull(points, includeCollinear));
      },
    }
  }
};
