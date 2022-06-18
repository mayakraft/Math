/**
 * Math (c) Kraft
 */
import {
  include,
  exclude,
} from "../arguments/functions";
import overlapConvexPolygonPoint from "./overlap-polygon-point";
/**
 * is one polygon (inner) completely enclosed by another (outer)
 */
const encloseConvexPolygonsInclusive = (outer, inner) => {
  // these points should be *not inside* (false)
  const outerGoesInside = outer
    .map(p => overlapConvexPolygonPoint(inner, p, include))
    .reduce((a, b) => a || b, false);
  // these points should be *inside* (true)
  const innerGoesOutside = inner
    .map(p => overlapConvexPolygonPoint(inner, p, include))
    .reduce((a, b) => a && b, true);
  return (!outerGoesInside && innerGoesOutside);
};

export default encloseConvexPolygonsInclusive;

