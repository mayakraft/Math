import Constructors from "../constructors";
import { distance2 } from "../../core/algebra";
import { point_in_poly } from "../../core/query";
import { multiply_matrix3_vector3 } from "../../core/matrix3";
import {
  signed_area,
  centroid,
  enclosing_rectangle,
  split_polygon,
} from "../../core/geometry";
import {
  resize,
  get_vector,
  get_matrix_3x4,
  get_line,
  get_segment,
} from "../../parsers/arguments";
import * as Intersect from "../../intersection/polygon";

// a polygon is expecting to have these properties:
// this.points - an array of vectors in [] form
const PolygonProto = function () {
  this.points = [];
};

PolygonProto.prototype.area = function () {
  return signed_area(this.points);
};

PolygonProto.prototype.centroid = function () {
  return Constructors.vector(centroid(this.points));
};

PolygonProto.prototype.enclosingRectangle = function () {
  console.log("params, ", enclosing_rectangle(this.points));
  return Constructors.rect(enclosing_rectangle(this.points));
};

PolygonProto.prototype.contains = function () {
  return point_in_poly(get_vector(arguments), this.points);
};

PolygonProto.prototype.scale = function (magnitude, center = centroid(this.points)) {
  const newPoints = this.points
    .map(p => [0, 1].map((_, i) => p[i] - center[i]))
    .map(vec => vec.map((_, i) => center[i] + vec[i] * magnitude));
  return Constructors.polygon(newPoints);
};

PolygonProto.prototype.rotate = function (angle, centerPoint = centroid(this.points)) {
  const newPoints = this.points.map((p) => {
    const vec = [p[0] - centerPoint[0], p[1] - centerPoint[1]];
    const mag = Math.sqrt((vec[0] ** 2) + (vec[1] ** 2));
    const a = Math.atan2(vec[1], vec[0]);
    return [
      centerPoint[0] + Math.cos(a + angle) * mag,
      centerPoint[1] + Math.sin(a + angle) * mag,
    ];
  });
  return Constructors.polygon(newPoints);
};

PolygonProto.prototype.translate = function () {
  const vec = get_vector(arguments);
  const newPoints = this.points.map(p => p.map((n, i) => n + vec[i]));
  return Constructors.polygon(newPoints);
};

PolygonProto.prototype.transform = function () {
  const m = get_matrix_3x4(arguments);
  const newPoints = this.points
    .map(p => multiply_matrix3_vector3(m, resize(3, p)));
  return Constructors.polygon(newPoints);
};

PolygonProto.prototype.sectors = function () {
  return this.points.map((p, i, arr) => {
    const prev = (i + arr.length - 1) % arr.length;
    const next = (i + 1) % arr.length;
    const center = p;
    const a = arr[prev].map((n, j) => n - center[j]);
    const b = arr[next].map((n, j) => n - center[j]);
    return Constructors.sector(b, a, center);
  });
};

// PolygonProto.prototype.nearestPoint = function () {
// };

PolygonProto.prototype.nearest = function () {
  const point = get_vector(arguments);
  const points = this.sides.map(edge => edge.nearestPoint(point));
  let lowD = Infinity;
  let lowI;
  points.map(p => distance2(point, p))
    .forEach((d, i) => { if (d < lowD) { lowD = d; lowI = i; } });
  return {
    point: points[lowI],
    edge: this.sides[lowI],
  };
};

// todo: need non-convex clipping functions returns an array of edges
// PolygonProto.prototype.clipSegment = function (...args) {
//   const edge = get_segment(args);
//   const e = Intersect.convex_poly_segment(this.points, edge[0], edge[1]);
//   return e === undefined ? undefined : Constructors.segment(e);
// };
// PolygonProto.prototype.clipLine = function (...args) {
//   const line = get_line(args);
//   const e = Intersect.convex_poly_line(this.points, line.vector, line.origin);
//   return e === undefined ? undefined : Constructors.segment(e);
// };
// PolygonProto.prototype.clipRay = function (...args) {
//   const line = get_line(args);
//   const e = Intersect.convex_poly_ray(this.points, line.vector, line.origin);
//   return e === undefined ? undefined : Constructors.segment(e);
// };

PolygonProto.prototype.split = function () {
  const line = get_line(arguments);
  return split_polygon(this.points, line.vector, line.origin)
    .map(poly => Constructors.polygon(poly));
};

// Object.defineProperty(proto, "edges", {
//   get: function () { return this.sides; },
// });
// Object.defineProperty(proto, "sectors", {
//   get: function () { return sectors.call(this); },
// });

export default PolygonProto;
