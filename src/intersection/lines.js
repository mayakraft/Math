import { EPSILON } from "../core/equal";
import { cross2 } from "../core/algebra";

export const include_l = () => true;
export const include_r = (t, e=EPSILON) => t > -e;
export const include_s = (t, e=EPSILON) => t > -e && t < 1 + e;

export const exclude_l = () => true;
export const exclude_r = (t, e=EPSILON) => t > e;
export const exclude_s = (t, e=EPSILON) => t > e && t < 1 - e;

/** comparison functions for a generalized vector intersection function */
export const include_l_l = () => true;
export const include_l_r = (t0, t1, e=EPSILON) => t1 > -e;
export const include_l_s = (t0, t1, e=EPSILON) => t1 > -e && t1 < 1 + e;
export const include_r_r = (t0, t1, e=EPSILON) => t0 > -e && t1 > -e;
export const include_r_s = (t0, t1, e=EPSILON) => t0 > -e && t1 > -e && t1 < 1 + e;
export const include_s_s = (t0, t1, e=EPSILON) => t0 > -e && t0 < 1 + e && t1 > -e
  && t1 < 1 + e;

// todo this has not been tested yet
export const exclude_l_l = include_l_l; // redundant
export const exclude_l_r = (t0, t1, e=EPSILON) => t1 > e;
export const exclude_l_s = (t0, t1, e=EPSILON) => t1 > e && t1 < 1 - e;
export const exclude_r_r = (t0, t1, e=EPSILON) => t0 > e && t1 > e;
export const exclude_r_s = (t0, t1, e=EPSILON) => t0 > e && t1 > e && t1 < 1 - e;
export const exclude_s_s = (t0, t1, e=EPSILON) => t0 > e && t0 < 1 - e && t1 > e
  && t1 < 1 - e;

/**
 * the generalized vector intersection function
 * requires a compFunction to describe valid bounds checking
 * line always returns true, ray is true for t > 0, segment must be between 0 < t < 1
*/
export const intersect_lines = (aVector, aOrigin, bVector, bOrigin, compFunc, epsilon = EPSILON) => {
  const denominator0 = cross2(aVector, bVector);
  if (Math.abs(denominator0) < epsilon) { return undefined; } /* parallel */
  const denominator1 = -denominator0;
  const aOriX = aOrigin[0];
  const aOriY = aOrigin[1];
  const bOriX = bOrigin[0];
  const bOriY = bOrigin[1];
  const numerator0 = cross2([bOriX - aOriX, bOriY - aOriY], bVector);
  const numerator1 = cross2([aOriX - bOriX, aOriY - bOriY], aVector);
  const t0 = numerator0 / denominator0;
  const t1 = numerator1 / denominator1;
  if (compFunc(t0, t1, epsilon)) {
    return [aOriX + aVector[0] * t0, aOriY + aVector[1] * t0];
  }
  return undefined;
};
