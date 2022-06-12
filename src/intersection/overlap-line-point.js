/**
 * Math (c) Kraft
 */
import { EPSILON } from "../core/constants";
import {
  dot,
  cross2,
  subtract,
  mag_squared,
} from "../core/algebra";
import { exclude_l } from "../arguments/functions";
/**
 *  Boolean tests
 *  collinearity, overlap, contains
 */
const overlap_line_point = (vector, origin, point, func = exclude_l, epsilon = EPSILON) => {
  const p2p = subtract(point, origin);
  const lineMagSq = mag_squared(vector);
  const lineMag = Math.sqrt(lineMagSq);
  // the line is degenerate
  if (lineMag < epsilon) { return false; }
  const cross = cross2(p2p, vector.map(n => n / lineMag));
  const proj = dot(p2p, vector) / lineMagSq;
  return Math.abs(cross) < epsilon && func(proj, epsilon / lineMag);
};

export default overlap_line_point;

