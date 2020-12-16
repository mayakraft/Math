import { EPSILON } from "../core/constants";
import { add, subtract, magnitude, scale, cross2 } from "../core/algebra";

export const include_l = () => true;
export const include_r = (t, e=EPSILON) => t > -e;
export const include_s = (t, e=EPSILON) => t > -e && t < 1 + e;

export const exclude_l = () => true;
export const exclude_r = (t, e=EPSILON) => t > e;
export const exclude_s = (t, e=EPSILON) => t > e && t < 1 - e;

/**
 * the generalized vector intersection function
 * requires a compFunction to describe valid bounds checking
 * line always returns true, ray is true for t > 0, segment must be between 0 < t < 1
*/
export const intersect_lines = (aVector, aOrigin, bVector, bOrigin, compA, compB, epsilon = EPSILON) => {
  const denominator0 = cross2(aVector, bVector);
  const denominator1 = -denominator0;
  if (Math.abs(denominator0) < epsilon) { return undefined; } /* parallel */
  const numerator0 = cross2(subtract(bOrigin, aOrigin), bVector);
  const numerator1 = cross2(subtract(aOrigin, bOrigin), aVector);
  const t0 = numerator0 / denominator0;
  const t1 = numerator1 / denominator1;
  if (compA(t0, epsilon / magnitude(aVector))
    && compB(t1, epsilon / magnitude(bVector))) {
    return add(aOrigin, scale(aVector, t0));
  }
  return undefined;
};
