import { EPSILON } from "../core/constants";
import { subtract } from "../core/algebra";
import {
  include_l,
  include_r,
  include_s,
  exclude_l,
  exclude_r,
  exclude_s,
} from "../core/lines";
import {
  point_in_convex_poly_inclusive,
  point_in_convex_poly_exclusive,
} from "../overlap/polygon";

/**
 * methods involved in intersection, isolated and meant not to be included
 * in the exported library. really only useful internally
 */
export const intersect_line_seg_include = (vector, origin, pt0, pt1, ep = EPSILON) => intersect_lines(
  vector, origin,
  subtract(pt1, pt0), pt0,
  include_l,
  include_s,
  ep
);
export const intersect_line_seg_exclude = (vector, origin, pt0, pt1, ep = EPSILON) => intersect_lines(
  vector, origin,
  subtract(pt1, pt0), pt0,
  exclude_l,
  exclude_s,
  ep
);
export const intersect_ray_seg_include = (vector, origin, pt0, pt1, ep = EPSILON) => intersect_lines(
  vector, origin,
  subtract(pt1, pt0), pt0,
  include_r,
  include_s,
  ep
);
export const intersect_ray_seg_exclude = (vector, origin, pt0, pt1, ep = EPSILON) => intersect_lines(
  vector, origin,
  subtract(pt1, pt0), pt0,
  exclude_r,
  exclude_s,
  ep
);
export const intersect_seg_seg_include = (a0, a1, b0, b1, ep = EPSILON) => intersect_lines(
  subtract(a1, a0), a0,
  subtract(b1, b0), b0,
  include_s,
  include_s,
  ep
);
export const intersect_seg_seg_exclude = (a0, a1, b0, b1, ep = EPSILON) => intersect_lines(
  subtract(a1, a0), a0,
  subtract(b1, b0), b0,
  exclude_s,
  exclude_s,
  ep
);


/** is a point collinear to a line, within an epsilon */
export const point_on_line = (point, vector, origin, epsilon = EPSILON) =>
  Math.abs(cross2(subtract(point, origin), normalize(vector))) < epsilon;
export const point_on_ray_inclusive = (point, vector, origin, epsilon = EPSILON) =>
  intersect_point_line(point, vector, origin, include_r, epsilon);
export const point_on_ray_exclusive = (point, vector, origin, epsilon = EPSILON) =>
  intersect_point_line(point, vector, origin, exclude_r, epsilon);
export const point_on_segment_inclusive = (point, pt0, pt1, epsilon = EPSILON) =>
  intersect_point_line(point, subtract(pt1, pt0), pt0, include_s, epsilon);
export const point_on_segment_exclusive = (point, pt0, pt1, epsilon = EPSILON) =>
  intersect_point_line(point, subtract(pt1, pt0), pt0, exclude_s, epsilon);



export const circle_line = (circle, line, epsilon = EPSILON) => intersect_circle_line(
  circle.radius, jcircle.origin,
  line.vector, line.origin,
  include_l,
  epsilon
);

export const circle_ray = (circle, ray, epsilon = EPSILON) => intersect_circle_line(
  circle.radius, circle.origin,
  ray.vector, ray.origin,
  include_r,
  epsilon
);

export const circle_segment = (circle, segment, epsilon = EPSILON) => intersect_circle_line(
  circle.radius, circle.origin,
  segment.vector, segment.origin,
  include_s,
  epsilon
);

