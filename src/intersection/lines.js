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
export const intersect = (a, b, compFunc, epsilon = EPSILON) => {
  const denominator0 = cross2(a.vector, b.vector);
  if (Math.abs(denominator0) < epsilon) { return undefined; } /* parallel */
  const denominator1 = -denominator0;
  const numerator0 = cross2([
    b.origin[0] - a.origin[0],
    b.origin[1] - a.origin[1]],
  b.vector);
  const numerator1 = cross2([
    a.origin[0] - b.origin[0],
    a.origin[1] - b.origin[1]],
  a.vector);
  const t0 = numerator0 / denominator0;
  const t1 = numerator1 / denominator1;
  if (compFunc(t0, t1, epsilon)) {
    return [a.origin[0] + a.vector[0] * t0, a.origin[1] + a.vector[1] * t0];
  }
  return undefined;
};
