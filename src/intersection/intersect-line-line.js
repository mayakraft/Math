/**
 * Math (c) Kraft
 */
import { EPSILON } from "../core/constants";
import {
  add,
  normalize,
  magnitude,
  scale,
  cross2,
} from "../core/algebra";
import {
  include_l,
  exclude_l,
} from "../arguments/functions";
/**
 * @description Find the intersection of two lines. Lines can be lines/rays/segments,
 * and can be inclusve or exclusive in terms of their endpoints and the epsilon value.
 * @param {number[]} vector array of 2 numbers, the first line's vector
 * @param {number[]} origin array of 2 numbers, the first line's origin
 * @param {number[]} vector array of 2 numbers, the second line's vector
 * @param {number[]} origin array of 2 numbers, the second line's origin
 * @param {function} [aFunction=include_l] first line's boolean test normalized value lies collinear
 * @param {function} [bFunction=include_l] second line's boolean test normalized value lies collinear
 * @param {number} [epsilon=1e-6] optional epsilon
 * @returns {number[]|undefined} one 2D point or undefined
*/
const intersect_line_line = (
  aVector, aOrigin,
  bVector, bOrigin,
  aFunction = include_l,
  bFunction = include_l,
  epsilon = EPSILON
) => {
  // a normalized determinant gives consisten values across all epsilon ranges
  const det_norm = cross2(normalize(aVector), normalize(bVector));
  // lines are parallel
  if (Math.abs(det_norm) < epsilon) { return undefined; }
  const determinant0 = cross2(aVector, bVector);
  const determinant1 = -determinant0;
  const a2b = [bOrigin[0] - aOrigin[0], bOrigin[1] - aOrigin[1]];
  const b2a = [-a2b[0], -a2b[1]];
  const t0 = cross2(a2b, bVector) / determinant0;
  const t1 = cross2(b2a, aVector) / determinant1;
  if (aFunction(t0, epsilon / magnitude(aVector))
    && bFunction(t1, epsilon / magnitude(bVector))) {
    return add(aOrigin, scale(aVector, t0));
  }
  return undefined;
};

export default intersect_line_line;
