import { EPSILON } from "../core/equal";
import { subtract } from "../core/algebra";
import {
  point_in_convex_poly_inclusive,
  point_in_convex_poly_exclusive,
} from "../overlap/polygon";
import {
  intersect_lines,
  include_l_s,
  include_r_s,
  exclude_r_s,
  include_s_s,
  exclude_s_s,
} from "./lines";

/**
 * methods involved in intersection, isolated and meant not to be included
 * in the exported library. really only useful internally
 */

// equivalency test for 2d-vectors
export const quick_equivalent_2 = (a, b) => Math.abs(a[0] - b[0]) < EPSILON
  && Math.abs(a[1] - b[1]) < EPSILON;

export const intersect_line_seg = (vector, origin, pt0, pt1) => intersect_lines(
  vector, origin,
  subtract(pt1, pt0), pt0,
  include_l_s
);
export const intersect_ray_seg_include = (vector, origin, pt0, pt1) => intersect_lines(
  vector, origin,
  subtract(pt1, pt0), pt0,
  include_r_s
);
export const intersect_ray_seg_exclude = (vector, origin, pt0, pt1) => intersect_lines(
  vector, origin,
  subtract(pt1, pt0), pt0,
  exclude_r_s
);
export const intersect_seg_seg_include = (a0, a1, b0, b1) => intersect_lines(
  subtract(a1, a0), a0,
  subtract(b1, b0), b0,
  include_s_s
);
export const intersect_seg_seg_exclude = (a0, a1, b0, b1) => intersect_lines(
  subtract(a1, a0), a0,
  subtract(b1, b0), b0,
  exclude_s_s
);
