/**
 * Math (c) Kraft
 */
import { EPSILON } from "../core/constants";
import {
  dot,
  cross2,
  subtract,
  magSquared,
} from "../core/algebra";
import { excludeL } from "../arguments/functions";
/**
 *  Boolean tests
 *  collinearity, overlap, contains
 */
const overlapLinePoint = (vector, origin, point, func = excludeL, epsilon = EPSILON) => {
  const p2p = subtract(point, origin);
  const lineMagSq = magSquared(vector);
  const lineMag = Math.sqrt(lineMagSq);
  // the line is degenerate
  if (lineMag < epsilon) { return false; }
  const cross = cross2(p2p, vector.map(n => n / lineMag));
  const proj = dot(p2p, vector) / lineMagSq;
  return Math.abs(cross) < epsilon && func(proj, epsilon / lineMag);
};

export default overlapLinePoint;

