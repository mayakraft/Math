import { EPSILON } from "../core/constants";
import {
  fn_not_undefined,
  fn_epsilon_equal,
  include,
  exclude,
  include_l,
  include_r,
  include_s,
  exclude_l,
  exclude_r,
  exclude_s,
} from "../arguments/functions";
import {
  normalize,
  magnitude,
  cross2,
  add,
  subtract,
  scale,
  flip,
  midpoint,
  parallel
} from "../core/algebra";
import { equivalent_vector2 } from "../core/equal";
import { sort_points_along_vector2 } from "../core/sort";
import overlap_line_point from "../intersection/overlap-line-point";
import overlap_convex_polygon_point from "../intersection/overlap-polygon-point";
import intersect_lines from "../intersection/intersect-line-line";

const line_line_parameter = (
  line_vector, line_origin,
  poly_vector, poly_origin,
  poly_line_func = include_s,
  epsilon = EPSILON
) => {
  // a normalized determinant gives consistent values across all epsilon ranges
  const det_norm = cross2(normalize(line_vector), normalize(poly_vector));
  // lines are parallel
  if (Math.abs(det_norm) < epsilon) { return undefined; }
  const determinant0 = cross2(line_vector, poly_vector);
  const determinant1 = -determinant0;
  const a2b = subtract(poly_origin, line_origin);
  const b2a = flip(a2b);
  const t0 = cross2(a2b, poly_vector) / determinant0;
  const t1 = cross2(b2a, line_vector) / determinant1;
  if (poly_line_func(t1, epsilon / magnitude(poly_vector))) {
    return t0;
  }
  return undefined;
};

const line_point_from_parameter = (vector, origin, t) => add(origin, scale(vector, t));

const get_intersect_parameters = (poly, vector, origin, poly_line_func, epsilon) => {
  // get all intersections with polgyon faces using the poly_line_func:
  // - include_s or exclude_s
  // sort them so we can grab the two most opposite intersections
  const numbers = poly
    // polygon into array of arrays [vector, origin]
    .map((p, i, arr) => [subtract(arr[(i + 1) % arr.length], p), p])
    .map(side => line_line_parameter(
      vector, origin,
      side[0], side[1],
      poly_line_func,
      epsilon))
    .filter(fn_not_undefined)
    .sort((a, b) => a - b);
  if (numbers.length < 2) { return undefined; }
  const ends = [numbers[0], numbers[numbers.length - 1]];
  // we still need to verify the two intersections are not the same point
  return (ends[1] - ends[0]) > epsilon * magnitude(vector)
    ? ends
    : undefined;
};

const clip_line_in_convex_polygon = (
  poly,
  vector,
  origin,
  fn_poly = include,
  fn_line = include_l,
  epsilon = EPSILON
) => {
  const ends = get_intersect_parameters(poly, vector, origin, include_s, epsilon);
  if (ends === undefined) { return undefined; }
  // ends_clip is the intersection between 2 domains, the result
  // and the valid inclusive/exclusive function
  // todo: this line hardcodes the parameterization that segments and rays are cropping
  // their lowest point at 0 and highest (if segment) at 1
  const ends_clip = ends.map((t, i) => fn_line(t) ? t : (t < 0.5 ? 0 : 1));
  // if endpoints are the same, exit
  if (Math.abs(ends_clip[0] - ends_clip[1]) < epsilon) { return undefined; }
  // test if the solution is collinear to an edge by getting the segment midpoint
  // then test inclusive or exclusive depending on user parameter
  const mid = line_point_from_parameter(vector, origin, (ends_clip[0] + ends_clip[1]) / 2);
  return overlap_convex_polygon_point(poly, mid, fn_poly, epsilon)
    ? ends_clip.map(t => line_point_from_parameter(vector, origin, t))
    : undefined;
};

export default clip_line_in_convex_polygon;

