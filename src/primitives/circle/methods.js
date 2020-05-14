import {
  get_vector,
} from "../../parsers/arguments";
import {
  pathInfo,
  ellipticalArcTo,
} from "../ellipse/path";
import { nearest_point_on_circle } from "../../core/nearest";
import Intersect from "../../intersection/index";
import Constructors from "../constructors";

// // (rx ry x-axis-rotation large-arc-flag sweep-flag x y)+
// const circleArcTo = (radius, end) =>
//   `A${radius} ${radius} 0 0 0 ${end[0]} ${end[1]}`;

// const circlePoint = (origin, radius, angle) => [
//   origin[0] + radius * Math.cos(angle),
//   origin[1] + radius * Math.sin(angle),
// ];

const CircleMethods = {
  nearestPoint: function () {
    return Constructors.vector(nearest_point_on_circle(
      this.radius,
      this.origin,
      get_vector(arguments)
    ));
  },
  intersect: function (object) {
    return Intersect(this, object);
  },

  path: function (arcStart = 0, deltaArc = Math.PI * 2) {
    const info = pathInfo(this.origin[0], this.origin[1], this.radius, this.radius, 0, arcStart, deltaArc);
    const arc1 = ellipticalArcTo(this.radius, this.radius, 0, info.fa, info.fs, info.x2, info.y2);
    const arc2 = ellipticalArcTo(this.radius, this.radius, 0, info.fa, info.fs, info.x3, info.y3);
    return `M${info.x1} ${info.y1}${arc1}${arc2}`;

    // const arcMid = arcStart + deltaArc / 2;
    // const start = circlePoint(this.origin, this.radius, arcStart);
    // const mid = circlePoint(this.origin, this.radius, arcMid);
    // const end = circlePoint(this.origin, this.radius, arcStart + deltaArc);
    // const arc1 = circleArcTo(this.radius, mid);
    // const arc2 = circleArcTo(this.radius, end);
    // return `M${cln(start[0])} ${cln(start[1])}${arc1}${arc2}`;
  },
};

// const tangentThroughPoint
// give us two tangent lines that intersect a point (outside the circle)

export default CircleMethods;
