import Constructors from "../constructors";
import Prototype from "../prototypes/polygon";
import { semi_flatten_arrays } from "../../arguments/resize";
import { subtract } from "../../core/algebra";
import {
  convex_hull,
  make_regular_polygon,
} from "../../core/geometry";

export default {
  polygon: {
    P: Prototype.prototype,
    A: function () {
      this.push(...semi_flatten_arrays(arguments));
      // this.points = semi_flatten_arrays(arguments);
        // .map(v => Constructors.vector(v));
      this.sides = this
        .map((p, i, arr) => [p, arr[(i + 1) % arr.length]]);
        // .map(ps => Constructors.segment(ps[0][0], ps[0][1], ps[1][0], ps[1][1]));
      this.vectors = this.sides.map(side => subtract(side[1], side[0]));
      // this.sectors
    },
    G: {
      // todo: convex test
      isConvex: function () {
        return true;
      },
      points: function () {
        return this;
      },
      // edges: function () {
      //   return this.sides;
      // },
    },
    M: {
      segments: function () {
        return this.sides;
      },
    },
    S: {
      fromPoints: function () {
        return this.constructor(...arguments);
      },
      regularPolygon: function () {
        return this.constructor(make_regular_polygon(...arguments));
      },
      convexHull: function () {
        return this.constructor(convex_hull(...arguments));
      },
    }
  }
};
