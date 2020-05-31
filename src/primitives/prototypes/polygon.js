import Constructors from "../constructors";
import { distance2 } from "../../core/algebra";
import {
  point_in_poly,
  convex_polygons_overlap
} from "../../core/query";
import { multiply_matrix3_vector3 } from "../../core/matrix3";
import {
  signed_area,
  centroid,
  enclosing_rectangle,
  split_polygon,
  split_convex_polygon,
} from "../../core/geometry";
import {
  resize,
  get_vector,
  get_matrix_3x4,
  get_line,
  get_segment,
  semi_flatten_arrays,
} from "../../parsers/arguments";
import * as Intersect from "../../intersection/polygon";

// a polygon is expecting to have these properties:
// this.points - an array of vectors in [] form

const methods = {
  area: function () {
    return signed_area(this.points);
  },
  // midpoint: function () { return average(this.points); },
  centroid: function () {
    return Constructors.vector(centroid(this.points));
  },
  enclosingRectangle: function () {
    return Constructors.rect(enclosing_rectangle(this.points));
  },
  contains: function () {
    return point_in_poly(get_vector(arguments), this.points);
  },
  // scale will return a rect for rectangles, otherwise polygon
  scale: function (magnitude, center = centroid(this.points)) {
    const newPoints = this.points
      .map(p => [0, 1].map((_, i) => p[i] - center[i]))
      .map(vec => vec.map((_, i) => center[i] + vec[i] * magnitude));
    return this.constructor.fromPoints(newPoints);
  },
  rotate: function (angle, centerPoint = centroid(this.points)) {
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
  },
  translate: function () {
    const vec = get_vector(arguments);
    const newPoints = this.points.map(p => p.map((n, i) => n + vec[i]));
    return this.constructor.fromPoints(newPoints);
  },
  transform: function () {
    const m = get_matrix_3x4(arguments);
    const newPoints = this.points
      .map(p => multiply_matrix3_vector3(m, resize(3, p)));
    return Constructors.polygon(newPoints);
  },
  sectors: function () {
    return this.points.map((p, i, arr) => {
      const prev = (i + arr.length - 1) % arr.length;
      const next = (i + 1) % arr.length;
      const center = p;
      const a = arr[prev].map((n, j) => n - center[j]);
      const b = arr[next].map((n, j) => n - center[j]);
      return Constructors.sector(b, a, center);
    });
  },
  nearest: function () {
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
  },
  // todo: non convex too
  overlaps: function () {
    const poly2Points = semi_flatten_arrays(arguments);
    return convex_polygons_overlap(this.points, poly2Points);
  },
  split: function () {
    const line = get_line(arguments);
    const split_func = this.convex ? split_convex_polygon : split_polygon;
    return split_func(this.points, line.vector, line.origin)
      .map(poly => Constructors.polygon(poly));
  },
  // todo: need non-convex clipping functions returns an array of edges
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
  path: function () {
    // make every point a Move or Line command, append with a "z" (close path)
    const pre = Array(this.points.length).fill("L");
    pre[0] = "M";
    return `${this.points.map((p, i) => `${pre[i]}${p[0]} ${p[1]}`).join("")}z`;
  },
};

// todo: a ConvexPolygon ConvexPolygon overlap method that returns
// the boolean space between them as another ConvexPolygon.
// then, generalize for Polygon

const PolygonProto = function () {
  this.points = [];
};

Object.keys(methods).forEach((key) => {
  PolygonProto.prototype[key] = methods[key];
});

export default PolygonProto;
