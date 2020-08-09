import { EPSILON } from "../core/equal";
import {
  dot,
  cross2,
  subtract,
  mag_squared
} from "../core/algebra";
import {
  include_l, include_r, include_s,
  exclude_l, exclude_r, exclude_s,
} from "../intersection/lines";

/**
 *  Boolean tests
 *  collinearity, overlap, contains
 */
export const collinear = (point, vector, origin, compFunc, epsilon = EPSILON) => {
  const p2p = subtract(point, origin);
  const lineMagSq = mag_squared(vector);
  const p2pMagSq = mag_squared(p2p);
  if (p2pMagSq < epsilon) { return compFunc(p2pMagSq, epsilon); }
  if (lineMagSq < epsilon) { return false; }
  const cross = cross2(p2p, vector);
  const proj = dot(p2p, vector) / lineMagSq;
  return Math.abs(cross) < epsilon && compFunc(proj, epsilon);
};

/** is a point collinear to a line, within an epsilon */
export const point_on_line = (point, vector, origin, epsilon = EPSILON) => {
  const pointToPoint = subtract(point, origin);
  return Math.abs(cross2(pointToPoint, vector)) < epsilon;
};
export const point_on_ray_inclusive = (point, vector, origin, epsilon = EPSILON) => collinear(point, vector, origin, include_r, epsilon);
export const point_on_ray_exclusive = (point, vector, origin, epsilon = EPSILON) => collinear(point, vector, origin, exclude_r, epsilon);
export const point_on_segment_inclusive = (point, pt0, pt1, epsilon = EPSILON) => collinear(point, subtract(pt1, pt0), pt0, include_s, epsilon);
export const point_on_segment_exclusive = (point, pt0, pt1, epsilon = EPSILON) => collinear(point, subtract(pt1, pt0), pt0, exclude_s, epsilon);
