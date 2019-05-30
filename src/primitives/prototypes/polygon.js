import * as Input from "../../parse/input";
import {
  convex_poly_edge,
  convex_poly_line,
  convex_poly_ray,
} from "../../core/intersection";
import * as Query from "../../core/query";
import * as Geometry from "../../core/geometry";
import * as Algebra from "../../core/algebra";
import Vector from "../vector";
import Edge from "../edge";
import Sector from "../sector";

// todo: need non-convex clipping functions returns an array of edges!!

/**
 * this prototype is shared among polygons: polygon, convex polygon
 */
export default function (subtype) {
  const proto = {};
  // Type === Polygon or ConvexPolygon or Rectangle...
  const Type = subtype;

  const area = () => Geometry.signed_area(this.points);
  const centroid = () => Geometry.centroid(this.points);
  const midpoint = () => Algebra.average(this.points);
  const enclosingRectangle = () => Geometry.enclosing_rectangle(this.points);
  const sectors = function () {
    return this.points
      .map((p, i, a) => [
        a[(i + a.length - 1) % a.length],
        a[i],
        a[(i + 1) % a.length]])
      .map(points => Sector(points[1], points[2], points[0]));
  };
  const contains = function (...args) {
    return Query.point_in_poly(Input.get_vector(args), this.points);
  };
  const nearest = function (...args) {
    const point = Input.get_vector(args);
    const points = this.sides.map(edge => edge.nearestPoint(point));
    let lowD = Infinity;
    let lowI;
    points.map(p => Algebra.distance2(point, p))
      .forEach((d, i) => { if (d < lowD) { lowD = d; lowI = i; } });
    return {
      point: points[lowI],
      edge: this.sides[lowI],
    };
  };
  // const enclosingRectangle = () => Rectangle(Geometry.enclosing_rectangle(this.points));
  // todo: need non-convex clipping functions returns an array of edges
  const clipEdge = function (...args) {
    const edge = Input.get_edge(args);
    const e = convex_poly_edge(this.points, edge[0], edge[1]);
    return e === undefined ? undefined : Edge(e);
  };
  const clipLine = function (...args) {
    const line = Input.get_line(args);
    const e = convex_poly_line(this.points, line.point, line.vector);
    return e === undefined ? undefined : Edge(e);
  };
  const clipRay = function (...args) {
    const line = Input.get_line(args);
    const e = convex_poly_ray(this.points, line.point, line.vector);
    return e === undefined ? undefined : Edge(e);
  };
  const split = function (...args) {
    const line = Input.get_line(args);
    return Geometry.split_polygon(this.points, line.point, line.vector)
      .map(poly => Type(poly));
  };
  const scale = function (magnitude, center = Geometry.centroid(this.points)) {
    const newPoints = this.points
      .map(p => [0, 1].map((_, i) => p[i] - center[i]))
      .map(vec => vec.map((_, i) => center[i] + vec[i] * magnitude));
    return Type(newPoints);
  };
  const rotate = function (angle, centerPoint = Geometry.centroid(this.points)) {
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
    const vec = Input.get_vector(args);
    const newPoints = this.points.map(p => p.map((n, i) => n + vec[i]));
    return Type(newPoints);
  };

  const transform = function (...args) {
    const m = Input.get_matrix2(args);
    const newPoints = this.points
      .map(p => Vector(Algebra.multiply_vector2_matrix2(p, m)));
    return Type(newPoints);
  };

  Object.defineProperty(proto, "area", { value: area });
  Object.defineProperty(proto, "centroid", { value: centroid });
  Object.defineProperty(proto, "midpoint", { value: midpoint });
  Object.defineProperty(proto, "enclosingRectangle", { value: enclosingRectangle });
  Object.defineProperty(proto, "contains", { value: contains });
  Object.defineProperty(proto, "nearest", { value: nearest });
  Object.defineProperty(proto, "clipEdge", { value: clipEdge });
  Object.defineProperty(proto, "clipLine", { value: clipLine });
  Object.defineProperty(proto, "clipRay", { value: clipRay });
  Object.defineProperty(proto, "split", { value: split });
  Object.defineProperty(proto, "scale", { value: scale });
  Object.defineProperty(proto, "rotate", { value: rotate });
  Object.defineProperty(proto, "translate", { value: translate });
  Object.defineProperty(proto, "transform", { value: transform });

  Object.defineProperty(proto, "edges", { get: () => this.sides });
  Object.defineProperty(proto, "sectors", { get: () => sectors() });
  Object.defineProperty(proto, "signedArea", { value: area });

  return Object.freeze(proto);
}
