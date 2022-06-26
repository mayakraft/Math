/**
 * Math (c) Kraft
 */
import { EPSILON } from "../core/constants";
import {
  cross2,
  subtract,
  normalize,
} from "../core/algebra";
import { exclude } from "../arguments/functions";

/**
 * exclusivity and inclusivity are flipped if the winding is flipped
 * these are intended for counter-clockwise winding.
 * eg: [1,0], [0,1], [-1,0], [0,-1]
 */
/**
 * @description tests if a point is inside a convex polygon
 * @param {number[]} point in array form
 * @param {number[][]} polygon in array of array form
 * @param {function} true for positive numbers, in/exclude near zero
 * @returns {boolean} is the point inside the polygon?
 * @linkcode Math ./src/intersection/overlap-polygon-point.js 23
 */
const overlapConvexPolygonPoint = (poly, point, func = exclude, epsilon = EPSILON) => poly
  .map((p, i, arr) => [p, arr[(i + 1) % arr.length]])
  .map(s => cross2(normalize(subtract(s[1], s[0])), subtract(point, s[0])))
  .map(side => func(side, epsilon))
  .map((s, _, arr) => s === arr[0])
  .reduce((prev, curr) => prev && curr, true);

export default overlapConvexPolygonPoint;

/**
 * Tests whether or not a point is contained inside a polygon.
 * @returns {boolean} whether the point is inside the polygon or not
 * @example
 * var isInside = point_in_poly([0.5, 0.5], polygonPoints)
 *
 * unfortunately this has inconsistencies for when a point lies collinear along
 * an edge of the polygon, depending on the location or direction of the edge in space
 */
//
// really great function and it works for non-convex polygons
// but it has inconsistencies around inclusive and exclusive points
// when the lie along the polygon edge.
// for example, the unit square, point at 0 and at 1 alternate in/exclusive
// keeping it around in case someone can clean it up.
//
// export const point_in_poly = (point, poly) => {
//   // W. Randolph Franklin
//   // https://wrf.ecse.rpi.edu/Research/Short_Notes/pnpoly.html
//   let isInside = false;
//   for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
//     if ((poly[i][1] > point[1]) != (poly[j][1] > point[1])
//       && point[0] < (poly[j][0] - poly[i][0])
//       * (point[1] - poly[i][1]) / (poly[j][1] - poly[i][1])
//       + poly[i][0]) {
//       isInside = !isInside;
//     }
//   }
//   return isInside;
// };

