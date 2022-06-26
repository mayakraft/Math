/**
 * Math (c) Kraft
 */
import {
  include,
  exclude,
} from "../arguments/functions";
import overlapConvexPolygonPoint from "./overlap-polygon-point";
/**
 * @description does one polygon (outer) completely enclose another polygon (inner),
 * currently, this only works for convex polygons.
 * @param {number[][]} outer a 2D convex polygon
 * @param {number[][]} inner a 2D convex polygon
 * @param {function} [fnInclusive] by default, the boundary is considered inclusive
 * @returns {boolean} is the "inner" polygon completely inside the "outer"
 *
 * @todo: should one function be include and the other exclude?
 * @linkcode Math ./src/intersection/enclose-polygons.js 18
 */
const enclosingPolygonPolygon = (outer, inner, fnInclusive=include) => {
  // these points should be *not inside* (false)
  const outerGoesInside = outer
    .map(p => overlapConvexPolygonPoint(inner, p, fnInclusive))
    .reduce((a, b) => a || b, false);
  // these points should be *inside* (true)
  const innerGoesOutside = inner
    .map(p => overlapConvexPolygonPoint(inner, p, fnInclusive))
    .reduce((a, b) => a && b, true);
  return (!outerGoesInside && innerGoesOutside);
};

export default enclosingPolygonPolygon;

