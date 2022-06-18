/**
 * Math (c) Kraft
 */
import { EPSILON } from "../core/constants";

/**
 * common functions that get reused, especially inside of map/reduce etc...
 */
export const fnTrue = () => true;
export const fnSquare = n => n * n;
export const fnAdd = (a, b) => a + (b || 0);
export const fnNotUndefined = a => a !== undefined;
export const fnAnd = (a, b) => a && b;
export const fnCat = (a, b) => a.concat(b);
export const fnVec2Angle = v => Math.atan2(v[1], v[0]);
export const fnToVec2 = a => [Math.cos(a), Math.sin(a)];
export const fnEqual = (a, b) => a === b;
export const fnEpsilonEqual = (a, b) => Math.abs(a - b) < EPSILON;
/**
 * test for sided-ness, like point in polygon
 * @returns {boolean}
 */
export const include = (n, epsilon = EPSILON) => n > -epsilon;
export const exclude = (n, epsilon = EPSILON) => n > epsilon;
/**
 * tests for lines
 * @returns {boolean}
 */
export const includeL = fnTrue;
export const excludeL = fnTrue;
export const includeR = include;
export const excludeR = exclude;
export const includeS = (t, e = EPSILON) => t > -e && t < 1 + e;
export const excludeS = (t, e = EPSILON) => t > e && t < 1 - e;
/**
 * methods that clip lines (rays/segments), meant to return
 * the t value scaled along the vector.
 * @returns {number}
 */
export const lineLimiter = dist => dist;
export const rayLimiter = dist => (dist < -EPSILON ? 0 : dist);
export const segmentLimiter = (dist) => {
  if (dist < -EPSILON) { return 0; }
  if (dist > 1 + EPSILON) { return 1; }
  return dist;
};
