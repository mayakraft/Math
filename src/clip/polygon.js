import { EPSILON } from "../core/constants";
import {
  fn_not_undefined,
  include,
  exclude,
  include_l,
  include_r,
  include_s,
  exclude_l,
  exclude_r,
  exclude_s,
} from "../arguments/functions";
import { subtract, midpoint, parallel } from "../core/algebra";
import { equivalent_vector2 } from "../core/equal";
import { sort_points_along_vector2 } from "../core/sort";
import overlap_line_point from "../intersection/overlap-line-point";
import overlap_convex_polygon_point from "../intersection/overlap-polygon-point";
import intersect_lines from "../intersection/intersect-line-line";

/**
 * methods involved in intersection, isolated and meant not to be included
 * in the exported library. really only useful internally
 */
const intersect_line_seg_include = (vector, origin, pt0, pt1, ep = EPSILON) => intersect_lines(
  vector, origin,
  subtract(pt1, pt0), pt0,
  include_l,
  include_s,
  ep
);
const intersect_line_seg_exclude = (vector, origin, pt0, pt1, ep = EPSILON) => intersect_lines(
  vector, origin,
  subtract(pt1, pt0), pt0,
  exclude_l,
  exclude_s,
  ep
);
const intersect_ray_seg_include = (vector, origin, pt0, pt1, ep = EPSILON) => intersect_lines(
  vector, origin,
  subtract(pt1, pt0), pt0,
  include_r,
  include_s,
  ep
);
const intersect_ray_seg_exclude = (vector, origin, pt0, pt1, ep = EPSILON) => intersect_lines(
  vector, origin,
  subtract(pt1, pt0), pt0,
  exclude_r,
  exclude_s,
  ep
);
const intersect_seg_seg_include = (a0, a1, b0, b1, ep = EPSILON) => intersect_lines(
  subtract(a1, a0), a0,
  subtract(b1, b0), b0,
  include_s,
  include_s,
  ep
);
const intersect_seg_seg_exclude = (a0, a1, b0, b1, ep = EPSILON) => intersect_lines(
  subtract(a1, a0), a0,
  subtract(b1, b0), b0,
  exclude_s,
  exclude_s,
  ep
);


/**
 * this returns undefined when "intersections" contains 0 or 1 items
 * or when intersections contains only copies of the same point.
 * it only returns a point pair when there are two unique points.
 */
const filter_two_unique_points = (intersections) => {
  for (let i = 1; i < intersections.length; i += 1) {
    if (!equivalent_vector2(intersections[0], intersections[i])) {
      return [intersections[0], intersections[i]];
    }
  }
};

const get_unique_points = (points, epsilon = EPSILON) => {
  const unique = [];
  for (let i = 0; i < points.length; i += 1) {
    let match = false;
    for (let j = 0; j < unique.length; j += 1) {
      if (equivalent_vector2(points[i], unique[j], epsilon)) {
        match = true;
      }
    }
    if (!match) { unique.push(points[i]); }
  }
  return unique;
};

// convert segments to vector origin
const collinear_check = (poly, vector, origin) => {
  const polyvecs = poly
    .map((p, i, arr) => [p, arr[(i + 1) % arr.length]]) // poly points into segments
    .map(seg => subtract(...seg));
  return polyvecs
    .map((vec, i) => parallel(vec, vector) ? i : undefined)
    .filter(fn_not_undefined) // filter only sides that are parallel
    .map(i => overlap_line_point(polyvecs[i], poly[i], origin)) // is the point along edge
    .reduce((a, b) => a || b, false);
};

const clip_intersections = (intersect_func, poly, line1, line2, epsilon = EPSILON) => poly
  .map((p, i, arr) => [p, arr[(i + 1) % arr.length]]) // poly points into segments
  .map(el => intersect_func(line1, line2, el[0], el[1], epsilon))
  .filter(fn_not_undefined);

export const clip_line_in_convex_poly_inclusive = (poly, vector, origin, epsilon = EPSILON) => {
  const intersections = clip_intersections(intersect_line_seg_include, poly, vector, origin, epsilon);
  switch (intersections.length) {
    case 0:
    case 1: return undefined; // make sure this matches below.
    // case 1: return [intersections[0]];  // degenerate segment
    default:
      // for two intersection points or more, in the case of vertex-
      // collinear intersections the same point from 2 polygon sides
      // can be returned. we need to filter for unique points.
      return filter_two_unique_points(intersections);
      // return filter_two_unique_points(intersections) || [intersections[0]];
      // if no unique,
      // there was only one unique intersection point after all.
      // degenerate segment, again. make sure this matches above.
      // return undefined;
  }
};

export const clip_line_in_convex_poly_exclusive = (poly, vector, origin, epsilon = EPSILON) => {
  const pEx = clip_intersections(intersect_line_seg_exclude, poly, vector, origin, epsilon);
  const pIn = clip_intersections(intersect_line_seg_include, poly, vector, origin, epsilon);
  if (pIn === undefined) { return undefined; }
  const uniqueIn = filter_two_unique_points(pIn);
  if (uniqueIn === undefined) { return undefined; }
  return overlap_convex_polygon_point(poly, midpoint(...uniqueIn), exclude, epsilon)
    ? uniqueIn
    : undefined;
};

export const clip_ray_in_convex_poly_inclusive = (poly, vector, origin, epsilon = EPSILON) => {
  const intersections = clip_intersections(intersect_ray_seg_include, poly, vector, origin, epsilon);
  if (intersections.length === 0) { return undefined; }
  //   case 1: return [origin, intersections[0]];
  // for two intersection points or more, in the case of vertex-
  // collinear intersections the same point from 2 polygon sides
  // can be returned. we need to filter for unique points.
  const origin_inside = overlap_convex_polygon_point(poly, origin, include);
  return filter_two_unique_points(intersections) || [origin, intersections[0]];
  // if filter_two_unique_points returns undefined, there was only one unique
  // point after all, build the segment from the origin to the point.
};

export const clip_ray_in_convex_poly_exclusive = (poly, vector, origin, epsilon = EPSILON) => {
  const pEx = clip_intersections(intersect_ray_seg_exclude, poly, vector, origin, epsilon);
  const pIn = clip_intersections(intersect_ray_seg_include, poly, vector, origin, epsilon);
  if (pIn === undefined) { return undefined; }
  const uniqueIn = filter_two_unique_points(pIn);
  if (uniqueIn === undefined) {
    // this basically means pIn.length === 1
    return overlap_convex_polygon_point(poly, origin, exclude, epsilon)
      ? [origin, pIn[0]]
      : undefined;
  }
  return overlap_convex_polygon_point(poly, midpoint(...uniqueIn), exclude, epsilon)
    ? uniqueIn
    : undefined;
  // return finish_ray(p, poly, origin);
};

const clip_segment_func = (poly, seg0, seg1, epsilon = EPSILON) => {
  const seg = [seg0, seg1];
  // if both endpoints are inclusive inside the polygon, return original segment
  const inclusive_inside = seg
    .map(s => overlap_convex_polygon_point(poly, s, include, epsilon));
  if (inclusive_inside[0] === true && inclusive_inside[1] === true) {
    return [[...seg0], [...seg1]];
  }
  // clip segment against every polygon edge
  const clip_inclusive = clip_intersections(intersect_seg_seg_include, poly, seg0, seg1, epsilon);
  // const clip_inclusive_unique = filter_two_unique_points(clip_inclusive);
  // // if the number of unique points is 2 or more (2), return this segment.
  // // this only works in the exclusive case because we already removed cases
  // // where the segment is collinear along an edge of the polygon.
  // if (clip_inclusive_unique) {  // 3 or 4
  //   return clip_inclusive_unique;
  // }
  const clip_inclusive_unique = get_unique_points(clip_inclusive, epsilon * 2);
  if (clip_inclusive_unique.length === 2) {
    return clip_inclusive_unique;
  } else if (clip_inclusive_unique.length > 2) {
    const sorted = sort_points_along_vector2(clip_inclusive_unique, subtract(seg1, seg0));
    return [sorted[0], sorted[sorted.length - 1]];
  }
  // if we have one unique intersection point, combine it with whichever segment
  // point is inside the polygon, and if none are inside it means the segment
  // intersects with a point along the outer edge, and we return undefined.
  if (clip_inclusive.length > 0) {
    const exclusive_inside = seg
      .map(s => overlap_convex_polygon_point(poly, s, exclude, epsilon));
    if (exclusive_inside[0] === true) {
      return [[...seg0], clip_inclusive[0]];
    }
    if (exclusive_inside[1] === true) {
      return [[...seg1], clip_inclusive[0]];
    }
  }
};

export const clip_segment_in_convex_poly_inclusive = (poly, seg0, seg1, epsilon = EPSILON) => {
  return clip_segment_func(poly, seg0, seg1, epsilon);
};

export const clip_segment_in_convex_poly_exclusive = (poly, seg0, seg1, epsilon = EPSILON) => {
  const segVec = subtract(seg1, seg0);
  if (collinear_check(poly, segVec, seg0)) {
    return undefined;
  }
  return clip_segment_func(poly, seg0, seg1, epsilon);
};

