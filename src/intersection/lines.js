import { EPSILON } from "../core/equal";
import { cross2 } from "../core/algebra";

/*
██╗      ██╗ ███╗   ██╗ ███████╗ ███████╗
██║      ██║ ████╗  ██║ ██╔════╝ ██╔════╝
██║      ██║ ██╔██╗ ██║ █████╗   ███████╗
██║      ██║ ██║╚██╗██║ ██╔══╝   ╚════██║
███████╗ ██║ ██║ ╚████║ ███████╗ ███████║
╚══════╝ ╚═╝ ╚═╝  ╚═══╝ ╚══════╝ ╚══════╝
 * inputs: lines
 * solutions: points
 */

/**
 *  all intersection functions are inclusive and return true if
 *  intersection lies directly on a segment's endpoint. to exclude
 *  endpoints, use "exclusive" functions
 */

/** comparison functions for a generalized vector intersection function */
export const comp_l_l = () => true;
export const comp_l_r = (t0, t1) => t1 >= -EPSILON;
export const comp_l_s = (t0, t1) => t1 >= -EPSILON && t1 <= 1 + EPSILON;
export const comp_r_r = (t0, t1) => t0 >= -EPSILON && t1 >= -EPSILON;
export const comp_r_s = (t0, t1) => t0 >= -EPSILON && t1 >= -EPSILON && t1 <= 1 + EPSILON;
export const comp_s_s = (t0, t1) => t0 >= -EPSILON && t0 <= 1 + EPSILON && t1 >= -EPSILON
  && t1 <= 1 + EPSILON;

// todo this has not been tested yet
// export const exclude_l_l = function () { return true; } // redundant
export const exclude_l_r = (t0, t1) => t1 > EPSILON;
export const exclude_l_s = (t0, t1) => t1 > EPSILON && t1 < 1 - EPSILON;
export const exclude_r_r = (t0, t1) => t0 > EPSILON && t1 > EPSILON;
export const exclude_r_s = (t0, t1) => t0 > EPSILON && t1 > EPSILON && t1 < 1 - EPSILON;
export const exclude_s_s = (t0, t1) => t0 > EPSILON && t0 < 1 - EPSILON && t1 > EPSILON
  && t1 < 1 - EPSILON;

/**
 * the generalized vector intersection function
 * requires a compFunction to describe valid bounds checking
 * line always returns true, ray is true for t > 0, segment must be between 0 < t < 1
*/
export const intersect_2D = (aVector, aOrigin, bVector, bOrigin, compFunc, epsilon = EPSILON) => {
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

export const intersect = (a, b, compFunc, epsilon = EPSILON) => intersect_2D(
  a.vector, a.origin, b.vector, b.origin, compFunc, epsilon
);
