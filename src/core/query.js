import { EPSILON } from "./equal";
import { dot, normalize } from "./algebra";

/**
 * the generalized vector intersection function
 * requires a compFunction to describe valid bounds checking
 * line always returns true, ray is true for t > 0, segment must be between 0 < t < 1
*/
export const overlap_function = (aPt, aVec, bPt, bVec, compFunc) => {
  const det = (a, b) => a[0] * b[1] - b[0] * a[1];
  const denominator0 = det(aVec, bVec);
  const denominator1 = -denominator0;
  const numerator0 = det([bPt[0] - aPt[0], bPt[1] - aPt[1]], bVec);
  const numerator1 = det([aPt[0] - bPt[0], aPt[1] - bPt[1]], aVec);
  if (Math.abs(denominator0) < EPSILON) { // parallel
    // todo:
    // if parallel and one point is inside another's vector (two are on top)
    // return true
    // else
    return false;
  }
  const t0 = numerator0 / denominator0;
  const t1 = numerator1 / denominator1;
  return compFunc(t0, t1);
};

const segment_segment_comp = (t0, t1) => t0 >= -EPSILON && t0 <= 1 + EPSILON
  && t1 >= -EPSILON && t1 <= 1 + EPSILON;

export const segment_segment_overlap = (a0, a1, b0, b1) => {
  const aVec = [a1[0] - a0[0], a1[1] - a0[1]];
  const bVec = [b1[0] - b0[0], b1[1] - b0[1]];
  return overlap_function(a0, aVec, b0, bVec, segment_segment_comp);
};
/**
 * @param {number[]} a vector in a Javascript array object
 * @returns boolean
 */
export const degenerate = (v) => Math
  .abs(v.reduce((a, b) => a + b, 0)) < EPSILON;
/**
 * @param {number[], number[]} two vectors in Javascript array objects
 * @returns boolean
 */
export const parallel = (a, b) => 1 - Math
  .abs(dot(normalize(a), normalize(b))) < EPSILON;

/**
 *  Boolean tests
 *  collinearity, overlap, contains
 */
/** is a point collinear to a line, within an epsilon */
export const point_on_line = (linePoint, lineVector, point, epsilon = EPSILON) => {
  const pointPoint = [point[0] - linePoint[0], point[1] - linePoint[1]];
  const cross = pointPoint[0] * lineVector[1] - pointPoint[1] * lineVector[0];
  return Math.abs(cross) < epsilon;
};
/** is a point collinear to an segment, between endpoints, within an epsilon */
export const point_on_segment = (seg0, seg1, point, epsilon = EPSILON) => {
  // distance between endpoints A,B should be equal to point->A + point->B
  const seg0_1 = [seg0[0] - seg1[0], seg0[1] - seg1[1]];
  const seg0_p = [seg0[0] - point[0], seg0[1] - point[1]];
  const seg1_p = [seg1[0] - point[0], seg1[1] - point[1]];
  const dEdge = Math.sqrt(seg0_1[0] * seg0_1[0] + seg0_1[1] * seg0_1[1]);
  const dP0 = Math.sqrt(seg0_p[0] * seg0_p[0] + seg0_p[1] * seg0_p[1]);
  const dP1 = Math.sqrt(seg1_p[0] * seg1_p[0] + seg1_p[1] * seg1_p[1]);
  return Math.abs(dEdge - dP0 - dP1) < epsilon;
};
/**
 * Tests whether or not a point is contained inside a polygon.
 * @returns {boolean} whether the point is inside the polygon or not
 * @example
 * var isInside = point_in_poly([0.5, 0.5], polygonPoints)
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

/** is a point inside of a convex polygon?
 * including along the boundary within epsilon
 *
 * @param poly is an array of points [ [x,y], [x,y]...]
 * @returns {boolean} true if point is inside polygon
 */
export const point_in_convex_poly = (point, poly, epsilon = EPSILON) => {
  if (poly == null || !(poly.length > 0)) { return false; }
  return poly.map((p, i, arr) => {
    const nextP = arr[(i + 1) % arr.length];
    const a = [nextP[0] - p[0], nextP[1] - p[1]];
    const b = [point[0] - p[0], point[1] - p[1]];
    return a[0] * b[1] - a[1] * b[0] > -epsilon;
  }).map((s, i, arr) => s === arr[0])
    .reduce((prev, curr) => prev && curr, true);
};

export const point_in_convex_poly_exclusive = (point, poly, epsilon = EPSILON) => {
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
export const convex_polygons_overlap = (ps1, ps2) => {
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
export const convex_polygon_is_enclosed = (inner, outer) => {
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
export const convex_polygons_enclose = (inner, outer) => {
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

export const is_counter_clockwise_between = (angle, angleA, angleB) => {
  while (angleB < angleA) { angleB += Math.PI * 2; }
  while (angle < angleA) { angle += Math.PI * 2; }
  return angle < angleB;
};


/**
████████╗██████╗ ██╗   ██╗███████╗    ███████╗ █████╗ ██╗     ███████╗███████╗
╚══██╔══╝██╔══██╗██║   ██║██╔════╝    ██╔════╝██╔══██╗██║     ██╔════╝██╔════╝
   ██║   ██████╔╝██║   ██║█████╗      █████╗  ███████║██║     ███████╗█████╗
   ██║   ██╔══██╗██║   ██║██╔══╝      ██╔══╝  ██╔══██║██║     ╚════██║██╔══╝
   ██║   ██║  ██║╚██████╔╝███████╗    ██║     ██║  ██║███████╗███████║███████╗
   ╚═╝   ╚═╝  ╚═╝ ╚═════╝ ╚══════╝    ╚═╝     ╚═╝  ╚═╝╚══════╝╚══════╝╚══════╝
 */
