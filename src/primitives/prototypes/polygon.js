import Constructors from "../constructors";

import {
  get_vector,
  get_matrix2,
  get_line,
  get_segment,
} from "../../parsers/arguments";

import {
  convex_poly_segment,
  convex_poly_line,
  convex_poly_ray,
} from "../../core/intersection";

import { point_in_poly } from "../../core/query";

import {
  signed_area,
  centroid,
  enclosing_rectangle,
  split_polygon,
} from "../../core/geometry";

import {
  average,
  distance2
} from "../../core/algebra";

import { multiply_matrix2_vector2 } from "../../core/matrix2";

const Polygon = function () {};

Polygon.prototype.area = function () { return signed_area(this.points); };
Polygon.prototype.midpoint = function () { return average(this.points); };
Polygon.prototype.centroid = function () { return centroid(this.points); };
Polygon.prototype.enclosingRectangle = function () {
  return enclosing_rectangle(this.points);
};
Polygon.prototype.contains = function () {
  return point_in_poly(get_vector(arguments), this.points);
};
Polygon.prototype.scale = function (magnitude, center = centroid(this.points)) {
  const newPoints = this.points
    .map(p => [0, 1].map((_, i) => p[i] - center[i]))
    .map(vec => vec.map((_, i) => center[i] + vec[i] * magnitude));
  return Constructors.polygon(newPoints);
};
Polygon.prototype.rotate = function (angle, centerPoint = centroid(this.points)) {
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

Polygon.prototype.translate = function () {
  const vec = get_vector(arguments);
  const newPoints = this.points.map(p => p.map((n, i) => n + vec[i]));
  return Constructors.polygon(newPoints);
};

Polygon.prototype.transform = function () {
  const m = get_matrix2(arguments);
  const newPoints = this.points
    // .map(p => Vector(multiply_matrix2_vector2(m, p)));
    .map(p => multiply_matrix2_vector2(m, p));
  return Constructors.polygon(newPoints);
};




Polygon.prototype.sectors = function () {
  return this.points.map((p, i, arr) => {
    const prev = (i + arr.length - 1) % arr.length;
    const next = (i + 1) % arr.length;
    const center = p;
    const a = arr[prev].map((n, j) => n - center[j]);
    const b = arr[next].map((n, j) => n - center[j]);
    return Constructors.sector(b, a, center);
  });
};

// Polygon.prototype.nearest = function () {
//   const point = get_vector(arguments);
//   const points = this.sides.map(edge => edge.nearestPoint(point));
//   let lowD = Infinity;
//   let lowI;
//   points.map(p => distance2(point, p))
//     .forEach((d, i) => { if (d < lowD) { lowD = d; lowI = i; } });
//   return {
//     point: points[lowI],
//     edge: this.sides[lowI],
//   };
// };

Polygon.prototype.enclosingRectangle = function () {
  return Constructors.rect(enclosing_rectangle(this.points));
};

// todo: need non-convex clipping functions returns an array of edges
Polygon.prototype.clipSegment = function (...args) {
  const edge = get_segment(args);
  const e = convex_poly_segment(this.points, edge[0], edge[1]);
  return e === undefined ? undefined : Segment(e);
};
Polygon.prototype.clipLine = function (...args) {
  const line = get_line(args);
  const e = convex_poly_line(this.points, line.origin, line.vector);
  return e === undefined ? undefined : Segment(e);
};
Polygon.prototype.clipRay = function (...args) {
  const line = get_line(args);
  const e = convex_poly_ray(this.points, line.origin, line.vector);
  return e === undefined ? undefined : Segment(e);
};
Polygon.prototype.split = function (...args) {
  const line = get_line(args);
  return split_polygon(this.points, line.origin, line.vector)
    .map(poly => Constructors.polygon(poly));
};


// Object.defineProperty(proto, "edges", {
//   get: function () { return this.sides; },
// });
// Object.defineProperty(proto, "sectors", {
//   get: function () { return sectors.call(this); },
// });


export default Polygon;

