import { EPSILON } from "../core/constants";
import {
  cross2,
  add,
  flip,
  magnitude,
  parallel,
} from "../core/algebra";
import overlap_line_point from "./overlap-line-point";
import { exclude_l } from "../arguments/functions";
/**
 * @description 2D line intersection function, generalized and works for lines,
 * rays, segments.
 * @param {number[]} array of 2 numbers, the first line's vector
 * @param {number[]} array of 2 numbers, the first line's origin
 * @param {number[]} array of 2 numbers, the second line's vector
 * @param {number[]} array of 2 numbers, the second line's origin
 * @param {function} first line's boolean test normalized value lies collinear
 * @param {function} seconde line's boolean test normalized value lies collinear
*/
const overlap_line_line = (
  aVector, aOrigin,
  bVector, bOrigin,
  aFunction = exclude_l,
  bFunction = exclude_l,
  epsilon = EPSILON
) => {
  const denominator0 = cross2(aVector, bVector);
  const denominator1 = -denominator0;
  if (Math.abs(denominator0) < epsilon) { // parallel
    // if parallel and one point is inside another's vector (two are on top)
    // todo: make part much simpler
    return overlap_line_point(aVector, aOrigin, bOrigin, aFunction, epsilon)
     || overlap_line_point(flip(aVector), add(aOrigin, aVector), bOrigin, aFunction, epsilon)
     || overlap_line_point(bVector, bOrigin, aOrigin, bFunction, epsilon)
     || overlap_line_point(flip(bVector), add(bOrigin, bVector), aOrigin, bFunction, epsilon);
  }
  const a2b = [bOrigin[0] - aOrigin[0], bOrigin[1] - aOrigin[1]];
  const b2a = [-a2b[0], -a2b[1]];
  const t0 = cross2(a2b, bVector) / denominator0;
  const t1 = cross2(b2a, aVector) / denominator1;
  return aFunction(t0, epsilon / magnitude(aVector))
    && bFunction(t1, epsilon / magnitude(bVector));
};

export default overlap_line_line;

