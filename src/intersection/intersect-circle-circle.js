/**
 * Math (c) Kraft
 */
import { EPSILON } from "../core/constants";

const acosSafe = (x) => {
  if (x >= 1.0) return 0;
  if (x <= -1.0) return Math.PI;
  return Math.acos(x);
};

const rotateVector2 = (center, pt, a) => {
  const x = pt[0] - center[0];
  const y = pt[1] - center[1];
  const xRot = x * Math.cos(a) + y * Math.sin(a);
  const yRot = y * Math.cos(a) - x * Math.sin(a);
  return [center[0] + xRot, center[1] + yRot];
};
/**
 * @description calculate the intersection of two circles, resulting in either no intersection,
 * or one or two points.
 * @param {number} radius1 the first circle's radius
 * @param {number[]} origin1 the first circle's origin
 * @param {number} radius2 the second circle's radius
 * @param {number[]} origin2 the second circle's origin
 * @param {number} [epsilon=1e-6] an optional epsilon
 * @returns {number[][]|undefined} an array of one or two points, or undefined if no intersection 
 * @linkcode Math ./src/intersection/intersect-circle-circle.js 28
 */
const intersectCircleCircle = (c1_radius, c1_origin, c2_radius, c2_origin, epsilon = EPSILON) => {
  // sort by largest-smallest radius
  const r = (c1_radius < c2_radius) ? c1_radius : c2_radius;
  const R = (c1_radius < c2_radius) ? c2_radius : c1_radius;
  const smCenter = (c1_radius < c2_radius) ? c1_origin : c2_origin;
  const bgCenter = (c1_radius < c2_radius) ? c2_origin : c1_origin;
  // this is also the starting vector to rotate around the big circle
  const vec = [smCenter[0] - bgCenter[0], smCenter[1] - bgCenter[1]];
  const d = Math.sqrt((vec[0] ** 2) + (vec[1] ** 2));
  // infinite solutions // don't need this because the below case covers it
  // if (d < epsilon && Math.abs(R - r) < epsilon) { return undefined; }
  // no intersection (same center, different size)
  if (d < epsilon) { return undefined; }
  const point = vec.map((v, i) => v / d * R + bgCenter[i]);
  // kissing circles
  if (Math.abs((R + r) - d) < epsilon
    || Math.abs(R - (r + d)) < epsilon) { return [point]; }
  // circles are contained
  if ((d + r) < R || (R + r < d)) { return undefined; }
  const angle = acosSafe((r * r - d * d - R * R) / (-2.0 * d * R));
  const pt1 = rotateVector2(bgCenter, point, +angle);
  const pt2 = rotateVector2(bgCenter, point, -angle);
  return [pt1, pt2];
};

export default intersectCircleCircle;
