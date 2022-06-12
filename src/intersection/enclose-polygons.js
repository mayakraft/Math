/**
 * Math (c) Kraft
 */
import {
  include,
  exclude,
} from "../arguments/functions";
import overlap_convex_polygon_point from "./overlap-polygon-point";
/**
 * is one polygon (inner) completely enclosed by another (outer)
 */
const enclose_convex_polygons_inclusive = (outer, inner) => {
  // these points should be *not inside* (false)
  const outerGoesInside = outer
    .map(p => overlap_convex_polygon_point(inner, p, include))
    .reduce((a, b) => a || b, false);
  // these points should be *inside* (true)
  const innerGoesOutside = inner
    .map(p => overlap_convex_polygon_point(inner, p, include))
    .reduce((a, b) => a && b, true);
  return (!outerGoesInside && innerGoesOutside);
};

export default enclose_convex_polygons_inclusive;

