import { get_vector } from "../../parsers/arguments";
import { nearest_point_on_circle } from "../../core/nearest";
import Intersect from "../../intersection/index";
import Constructors from "../constructors";

const f = (n) => (Number.isInteger(n) ? n : n.toFixed(4));

// (rx ry x-axis-rotation large-arc-flag sweep-flag x y)+
const circleArcTo = (radius, end) =>
  `A${f(radius)} ${f(radius)} 0 0 0 ${f(end[0])} ${f(end[1])}`;

const circlePoint = (origin, radius, angle) => [
  origin[0] + radius * Math.cos(angle),
  origin[1] + radius * Math.sin(angle),
];

const CircleMethods = {
  nearestPoint: function () {
    return Constructors.vector(nearest_point_on_circle(
      this.origin,
      this.radius,
      get_vector(arguments)
    ));
  },
  intersect: function (object) {
    return Intersect(this, object);
  },
  path: function (arcStart = 0, deltaArc = Math.PI * 2) {
    const arcMid = arcStart + deltaArc / 2;
    const start = circlePoint(this.origin, this.radius, arcStart);
    const mid = circlePoint(this.origin, this.radius, arcMid);
    const end = circlePoint(this.origin, this.radius, arcStart + deltaArc);
    const arc1 = circleArcTo(this.radius, mid);
    const arc2 = circleArcTo(this.radius, end);
    return `M${f(start[0])} ${f(start[1])}${arc1}${arc2}`;
  },
};

// const tangentThroughPoint
// give us two tangent lines that intersect a point (outside the circle)

export default CircleMethods;
