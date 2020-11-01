import { EPSILON } from "../core/equal";
import {
  dot,
  cross2,
  subtract,
  normalize,
  magnitude,
  mag_squared
} from "../core/algebra";
import {
  overlap_segment_segment_inclusive,
  overlap_segment_segment_exclusive,
} from "./lines";

/** is a point inside of a convex polygon?
 * including along the boundary within epsilon
 *
 * @param poly is an array of points [ [x,y], [x,y]...]
 * @returns {boolean} true if point is inside polygon
 */
/**
 * exclusivity and inclusivity are flipped if the winding is flipped
 * these are intended for counter-clockwise winding.
 * eg: [1,0], [0,1], [-1,0], [0,-1]
 */
export const point_in_convex_poly_inclusive = (point, poly, epsilon = EPSILON) => poly
  .map((p, i, arr) => [p, arr[(i + 1) % arr.length]])
  .map(s => cross2(normalize(subtract(s[1], s[0])), subtract(point, s[0])) > -epsilon)
  .map((s, _, arr) => s === arr[0])
  .reduce((prev, curr) => prev && curr, true);

export const point_in_convex_poly_exclusive = (point, poly, epsilon = EPSILON) => poly
  .map((p, i, arr) => [p, arr[(i + 1) % arr.length]])
  .map(s => cross2(normalize(subtract(s[1], s[0])), subtract(point, s[0])) > epsilon)
  .map((s, _, arr) => s === arr[0])
  .reduce((prev, curr) => prev && curr, true);
/**
 * Tests whether or not a point is contained inside a polygon.
 * @returns {boolean} whether the point is inside the polygon or not
 * @example
 * var isInside = point_in_poly([0.5, 0.5], polygonPoints)
 *
 * unfortunately this has inconsistencies for when a point lies collinear along
 * an edge of the polygon, depending on the location or direction of the edge in space
 */
export const point_in_poly = (point, poly) => {
  // W. Randolph Franklin
  // https://wrf.ecse.rpi.edu/Research/Short_Notes/pnpoly.html
  let isInside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    if ((poly[i][1] > point[1]) != (poly[j][1] > point[1])
      && point[0] < (poly[j][0] - poly[i][0])
      * (point[1] - poly[i][1]) / (poly[j][1] - poly[i][1])
      + poly[i][0]) {
      isInside = !isInside;
    }
  }
  return isInside;
};
/** do two convex polygons overlap one another */
const overlap_convex_polygons = (poly1, poly2, seg_seg, pt_in_poly) => {
  // convert array of points into segments [point, nextPoint]
  const e1 = poly1.map((p, i, arr) => [p, arr[(i + 1) % arr.length]]);
  const e2 = poly2.map((p, i, arr) => [p, arr[(i + 1) % arr.length]]);
  for (let i = 0; i < e1.length; i += 1) {
    for (let j = 0; j < e2.length; j += 1) {
      if (seg_seg(e1[i][0], e1[i][1], e2[j][0], e2[j][1])) {
        return true;
      }
    }
  }
  if (pt_in_poly(poly2[0], poly1)) { return true; }
  if (pt_in_poly(poly1[0], poly2)) { return true; }
  return false;
};
export const overlap_convex_polygons_inclusive = (poly1, poly2) => overlap_convex_polygons(
  poly1,
  poly2,
  overlap_segment_segment_inclusive,
  point_in_convex_poly_inclusive
);
export const overlap_convex_polygons_exclusive = (poly1, poly2) => overlap_convex_polygons(
  poly1,
  poly2,
  overlap_segment_segment_exclusive,
  point_in_convex_poly_exclusive
);

/**
 * is one polygon (inner) completely enclosed by another (outer)
 *
 */
// export const convex_polygon_is_enclosed = (inner, outer) => {
//   const goesInside = outer
//     .map(p => point_in_convex_poly(p, inner))
//     .reduce((a, b) => a || b, false);
//   if (goesInside) { return false; }
//   // not done
//   return undefined;
// };
/**
 * pairs of convex polygons, does one enclose another
 *
 */
export const enclose_convex_polygons_inclusive = (outer, inner) => {
  // these points should be *not inside* (false)
  const outerGoesInside = outer
    .map(p => point_in_convex_poly_inclusive(p, inner))
    .reduce((a, b) => a || b, false);
  // these points should be *inside* (true)
  const innerGoesOutside = inner
    .map(p => point_in_convex_poly_inclusive(p, inner))
    .reduce((a, b) => a && b, true);
  return (!outerGoesInside && innerGoesOutside);
};
