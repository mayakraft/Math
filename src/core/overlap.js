import { EPSILON } from "./equal";
import { dot, cross2, subtract, normalize, magnitude } from "./algebra";
import { include_s_s } from "../intersection/lines"
import {
  include_l, include_r, include_s,
  exclude_l, exclude_r, exclude_s,
} from "../intersection/lines";

/**
 *  Boolean tests
 *  collinearity, overlap, contains
 */
const line_point_func = (vector, origin, point, compFunc, epsilon = EPSILON) => {
  const p2p = [point[0] - origin[0], point[1] - origin[1]];
  const lineMagSq = vector[0] * vector[0] + vector[1] + vector[1];
  const p2pMagSq = p2p[0] * p2p[0] + p2p[1] + p2p[1];
  if (p2pMagSq < epsilon) { return compFunc(p2pMagSq, epsilon); }
  if (lineMagSq < epsilon) { return false; }
  const cross = p2p[0] * vector[1] - p2p[1] * vector[0];
  const proj = (p2p[0] * vector[0] + p2p[1] * vector[1]) / lineMagSq;
  return Math.abs(cross) < epsilon && compFunc(proj, epsilon);
};

/** is a point collinear to a line, within an epsilon */
const line_point = (vector, origin, point, epsilon = EPSILON) => {
  const pointToPoint = subtract(point, origin);
  return Math.abs(cross2(pointToPoint, vector)) < epsilon;
};
const ray_point_inclusive = (vector, origin, point, epsilon = EPSILON) => line_point_func(vector, origin, point, include_r, epsilon);
const ray_point_exclusive = (vector, origin, point, epsilon = EPSILON) => line_point_func(vector, origin, point, exclude_r, epsilon);
const segment_point_inclusive = (seg0, seg1, point, epsilon = EPSILON) => line_point_func(subtract(seg1, seg0), seg0, point, include_s, epsilon);
const segment_point_exclusive = (seg0, seg1, point, epsilon = EPSILON) => line_point_func(subtract(seg1, seg0), seg0, point, exclude_s, epsilon);

/**
 * the generalized vector intersection function
 * requires a compFunction to describe valid bounds checking
 * line always returns true, ray is true for t > 0, segment must be between 0 < t < 1
*/
const lines = (aVec, aPt, bVec, bPt, compFunc, epsilon = EPSILON) => {
  const denominator0 = cross2(aVec, bVec);
  const denominator1 = -denominator0;
  const numerator0 = cross2(subtract(bPt, aPt), bVec);
  const numerator1 = cross2(subtract(aPt, bPt), aVec);
  if (Math.abs(denominator0) < epsilon) { // parallel
    // todo:
    // if parallel and one point is inside another's vector (two are on top)
    // return true
    // else
    return false;
  }
  const t0 = numerator0 / denominator0;
  const t1 = numerator1 / denominator1;
  return compFunc(t0, t1, epsilon);
};

// const lines = (a, b, compFunc, epsilon = EPSILON) => lines_overlap(a.vector, a.origin, b.vector, b.origin, compFunc, epsilon);

// const line_line = (aVec, aPt, bVec, bPt) => lines_overlap(aVec, aPt, bVec, bPt, include_l_l);

const segment_segment = (a0, a1, b0, b1) => {
  return lines(subtract(a1, a0), a0, subtract(b1, b0), b0, include_s_s);
};

/**
 * Tests whether or not a point is contained inside a polygon.
 * @returns {boolean} whether the point is inside the polygon or not
 * @example
 * var isInside = point_in_poly([0.5, 0.5], polygonPoints)
 */
const point_in_poly = (point, poly) => {
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
/** is a point inside of a convex polygon?
 * including along the boundary within epsilon
 *
 * @param poly is an array of points [ [x,y], [x,y]...]
 * @returns {boolean} true if point is inside polygon
 */
const point_in_convex_poly = (point, poly, epsilon = EPSILON) => {
  if (poly == null || !(poly.length > 0)) { return false; }
  return poly.map((p, i, arr) => {
    const nextP = arr[(i + 1) % arr.length];
    const a = [nextP[0] - p[0], nextP[1] - p[1]];
    const b = [point[0] - p[0], point[1] - p[1]];
    return a[0] * b[1] - a[1] * b[0] > -epsilon;
  }).map((s, i, arr) => s === arr[0])
    .reduce((prev, curr) => prev && curr, true);
};

const point_in_convex_poly_exclusive = (point, poly, epsilon = EPSILON) => {
  if (poly == null || !(poly.length > 0)) { return false; }
  return poly.map((p, i, arr) => {
    const nextP = arr[(i + 1) % arr.length];
    const a = [nextP[0] - p[0], nextP[1] - p[1]];
    const b = [point[0] - p[0], point[1] - p[1]];
    return a[0] * b[1] - a[1] * b[0] > epsilon;
  }).map((s, i, arr) => s === arr[0])
    .reduce((prev, curr) => prev && curr, true);
};

/** do two convex polygons overlap one another */
const convex_polygons_overlap = (ps1, ps2) => {
  // convert array of points into segments [point, nextPoint]
  const e1 = ps1.map((p, i, arr) => [p, arr[(i + 1) % arr.length]]);
  const e2 = ps2.map((p, i, arr) => [p, arr[(i + 1) % arr.length]]);
  for (let i = 0; i < e1.length; i += 1) {
    for (let j = 0; j < e2.length; j += 1) {
      if (segment_segment_overlap(e1[i][0], e1[i][1], e2[j][0], e2[j][1])) {
        return true;
      }
    }
  }
  if (point_in_poly(ps2[0], ps1)) { return true; }
  if (point_in_poly(ps1[0], ps2)) { return true; }
  return false;
};

/**
 * is one polygon (inner) completely enclosed by another (outer)
 *
 */
const convex_polygon_is_enclosed = (inner, outer) => {
  const goesInside = outer
    .map(p => point_in_convex_poly(p, inner))
    .reduce((a, b) => a || b, false);
  if (goesInside) { return false; }
  // not done
  return undefined;
};

/**
 * pairs of convex polygons, does one enclose another
 *
 */
const convex_polygons_enclose = (inner, outer) => {
  // these points should be *not inside* (false)
  const outerGoesInside = outer
    .map(p => point_in_convex_poly(p, inner))
    .reduce((a, b) => a || b, false);
  // these points should be *inside* (true)
  const innerGoesOutside = inner
    .map(p => point_in_convex_poly(p, inner))
    .reduce((a, b) => a && b, true);
  return (!outerGoesInside && innerGoesOutside);
};

export default {
  line_point,
  ray_point_inclusive,
  ray_point_exclusive,
  segment_point_inclusive,
  segment_point_exclusive,
  lines,
  segment_segment,
  point_in_poly,
  point_in_convex_poly,
  point_in_convex_poly_exclusive,
  convex_polygons_overlap,
  convex_polygon_is_enclosed,
  convex_polygons_enclose
};
