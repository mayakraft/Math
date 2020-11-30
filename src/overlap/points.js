import { EPSILON } from "../core/constants";
import {
  dot,
  cross2,
  subtract,
  mag_squared,
  normalize,
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
  // is the line degenerate?
  if (Math.sqrt(lineMagSq) < epsilon) { return false; }
  const lineMag = Math.sqrt(lineMagSq);
  const cross = cross2(p2p, vector.map(n => n / lineMag));
  const proj = dot(p2p, vector) / lineMagSq;
  return Math.abs(cross) < epsilon && compFunc(proj, epsilon / lineMag);
};

/** is a point collinear to a line, within an epsilon */
export const point_on_line = (point, vector, origin, epsilon = EPSILON) => Math.abs(cross2(subtract(point, origin), normalize(vector))) < epsilon;
export const point_on_ray_inclusive = (point, vector, origin, epsilon = EPSILON) => collinear(point, vector, origin, include_r, epsilon);
export const point_on_ray_exclusive = (point, vector, origin, epsilon = EPSILON) => collinear(point, vector, origin, exclude_r, epsilon);
export const point_on_segment_inclusive = (point, pt0, pt1, epsilon = EPSILON) => collinear(point, subtract(pt1, pt0), pt0, include_s, epsilon);
export const point_on_segment_exclusive = (point, pt0, pt1, epsilon = EPSILON) => collinear(point, subtract(pt1, pt0), pt0, exclude_s, epsilon);
