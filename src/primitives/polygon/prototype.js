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

import Vector from "../vector/index";
import Segment from "../segment";
import Sector from "../sector";

// todo: need non-convex clipping functions returns an array of edges!!

/**
 * this prototype is shared among polygons: polygon, convex polygon
 * and is expecting you implement
 * - points
 * - sides
 */
export default function (subtype) {
  const proto = {};
  // Type === Polygon or ConvexPolygon or Rectangle...
  const Type = subtype;

  const area = function () { return signed_area(this.points); };
  const midpoint = function () { return average(this.points); };
  const enclosingRectangle = function () {
    return enclosing_rectangle(this.points);
  };
  const sectors = function () {
    // return this.points
    //   .map((p, i, a) => [
    //     a[(i + a.length - 1) % a.length],
    //     a[i],
    //     a[(i + 1) % a.length]])
    //   .map(points => Sector(points[1], points[2], points[0]));
    return this.points.map((p, i, arr) => {
      const prev = (i + arr.length - 1) % arr.length;
      const next = (i + 1) % arr.length;
      const center = p;
      const a = arr[prev].map((n, j) => n - center[j]);
      const b = arr[next].map((n, j) => n - center[j]);
      return Sector(b, a, center);
    });
  };
  const contains = function (...args) {
    return point_in_poly(get_vector(args), this.points);
  };
  const polyCentroid = function () {
    return centroid(this.points);
  };
  const nearest = function (...args) {
    const point = get_vector(args);
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
  // const enclosingRectangle = () => Rectangle(enclosing_rectangle(this.points));
  // todo: need non-convex clipping functions returns an array of edges
  const clipSegment = function (...args) {
    const edge = get_segment(args);
    const e = convex_poly_segment(this.points, edge[0], edge[1]);
    return e === undefined ? undefined : Segment(e);
  };
  const clipLine = function (...args) {
    const line = get_line(args);
    const e = convex_poly_line(this.points, line.origin, line.vector);
    return e === undefined ? undefined : Segment(e);
  };
  const clipRay = function (...args) {
    const line = get_line(args);
    const e = convex_poly_ray(this.points, line.origin, line.vector);
    return e === undefined ? undefined : Segment(e);
  };
  const split = function (...args) {
    const line = get_line(args);
    return split_polygon(this.points, line.origin, line.vector)
      .map(poly => Type(poly));
  };
  const scale = function (magnitude, center = centroid(this.points)) {
    const newPoints = this.points
      .map(p => [0, 1].map((_, i) => p[i] - center[i]))
      .map(vec => vec.map((_, i) => center[i] + vec[i] * magnitude));
    return Type(newPoints);
  };
  const rotate = function (angle, centerPoint = centroid(this.points)) {
    const newPoints = this.points.map((p) => {
      const vec = [p[0] - centerPoint[0], p[1] - centerPoint[1]];
      const mag = Math.sqrt((vec[0] ** 2) + (vec[1] ** 2));
      const a = Math.atan2(vec[1], vec[0]);
      return [
        centerPoint[0] + Math.cos(a + angle) * mag,
        centerPoint[1] + Math.sin(a + angle) * mag,
      ];
    });
    return Type(newPoints);
  };

  const translate = function (...args) {
    const vec = get_vector(args);
    const newPoints = this.points.map(p => p.map((n, i) => n + vec[i]));
    return Type(newPoints);
  };

  const transform = function (...args) {
    const m = get_matrix2(args);
    const newPoints = this.points
      .map(p => Vector(multiply_matrix2_vector2(m, p)));
    return Type(newPoints);
  };

  Object.defineProperty(proto, "area", { value: area });
  Object.defineProperty(proto, "centroid", { value: polyCentroid });
  Object.defineProperty(proto, "midpoint", { value: midpoint });
  Object.defineProperty(proto, "enclosingRectangle", { value: enclosingRectangle });
  Object.defineProperty(proto, "contains", { value: contains });
  Object.defineProperty(proto, "nearest", { value: nearest });
  Object.defineProperty(proto, "clipSegment", { value: clipSegment });
  Object.defineProperty(proto, "clipLine", { value: clipLine });
  Object.defineProperty(proto, "clipRay", { value: clipRay });
  Object.defineProperty(proto, "split", { value: split });
  Object.defineProperty(proto, "scale", { value: scale });
  Object.defineProperty(proto, "rotate", { value: rotate });
  Object.defineProperty(proto, "translate", { value: translate });
  Object.defineProperty(proto, "transform", { value: transform });

  Object.defineProperty(proto, "edges", {
    get: function () { return this.sides; },
  });
  Object.defineProperty(proto, "sectors", {
    get: function () { return sectors.call(this); },
  });
  Object.defineProperty(proto, "signedArea", { value: area });

  return Object.freeze(proto);
}
