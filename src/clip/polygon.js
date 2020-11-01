import { fn_not_undefined } from "../arguments/functions";
import { EPSILON } from "../core/equal";
import { subtract, midpoint, parallel } from "../core/algebra";
import {
  point_on_line,
} from "../overlap/points";
import {
  point_in_convex_poly_inclusive,
  point_in_convex_poly_exclusive,
} from "../overlap/polygon";
import {
  quick_equivalent_2,
  intersect_line_seg_include,
  intersect_line_seg_exclude,
  intersect_ray_seg_include,
  intersect_ray_seg_exclude,
  intersect_seg_seg_include,
  intersect_seg_seg_exclude,
} from "../intersection/helpers";

/**
 * this returns undefined when "intersections" contains 0 or 1 items
 * or when intersections contains only copies of the same point.
 * it only returns a point pair when there are two unique points.
 */
const get_unique_pair = (intersections) => {
  for (let i = 1; i < intersections.length; i += 1) {
    if (!quick_equivalent_2(intersections[0], intersections[i])) {
      return [intersections[0], intersections[i]];
    }
  }
};

const get_unique_points = (points, epsilon = EPSILON) => {
  const unique = [];
  for (let i = 0; i < points.length; i += 1) {
    let match = false;
    for (let j = 0; j < unique.length; j += 1) {
      if (quick_equivalent_2(points[i], unique[j], epsilon)) {
        match = true;
      }
    }
    if (!match) { unique.push(points[i]); }
  }
  return unique;
};

const sortPointsAlongVector = (points, vector) => points
  .map(point => ({ point, d: point[0] * vector[0] + point[1] * vector[1] }))
  .sort((a, b) => a.d - b.d)
  .map(a => a.point);

// convert segments to vector origin
const collinear_check = (poly, vector, origin) => {
  const polyvecs = poly
    .map((p, i, arr) => [p, arr[(i + 1) % arr.length]]) // poly points into segments
    .map(seg => subtract(...seg));
  return polyvecs
    .map((vec, i) => parallel(vec, vector) ? i : undefined)
    .filter(fn_not_undefined) // filter only sides that are parallel
    .map(i => point_on_line(origin, polyvecs[i], poly[i])) // is the point along edge
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
      return get_unique_pair(intersections);
      // return get_unique_pair(intersections) || [intersections[0]];
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
  const uniqueIn = get_unique_pair(pIn);
  if (uniqueIn === undefined) { return undefined; }
  return point_in_convex_poly_exclusive(midpoint(...uniqueIn), poly, epsilon)
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
  const origin_inside = point_in_convex_poly_inclusive(origin, poly);
  return get_unique_pair(intersections) || [origin, intersections[0]];
  // if get_unique_pair returns undefined, there was only one unique
  // point after all, build the segment from the origin to the point.
};

export const clip_ray_in_convex_poly_exclusive = (poly, vector, origin, epsilon = EPSILON) => {
  const pEx = clip_intersections(intersect_ray_seg_exclude, poly, vector, origin, epsilon);
  const pIn = clip_intersections(intersect_ray_seg_include, poly, vector, origin, epsilon);
  if (pIn === undefined) { return undefined; }
  const uniqueIn = get_unique_pair(pIn);
  if (uniqueIn === undefined) {
    // this basically means pIn.length === 1
    return point_in_convex_poly_exclusive(origin, poly, epsilon)
      ? [origin, pIn[0]]
      : undefined;
  }
  return point_in_convex_poly_exclusive(midpoint(...uniqueIn), poly, epsilon)
    ? uniqueIn
    : undefined;
  // return finish_ray(p, poly, origin);
};

const clip_segment_func = (poly, seg0, seg1, epsilon = EPSILON) => {
  const seg = [seg0, seg1];
  // if both endpoints are inclusive inside the polygon, return original segment
  const inclusive_inside = seg
    .map(s => point_in_convex_poly_inclusive(s, poly, epsilon));
  if (inclusive_inside[0] === true && inclusive_inside[1] === true) {
    return [[...seg0], [...seg1]];
  }
  // clip segment against every polygon edge
  const clip_inclusive = clip_intersections(intersect_seg_seg_include, poly, seg0, seg1, epsilon);
  // const clip_inclusive_unique = get_unique_pair(clip_inclusive);
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
    const sorted = sortPointsAlongVector(clip_inclusive_unique, subtract(seg1, seg0));
    return [sorted[0], sorted[sorted.length - 1]];
  }
  // if we have one unique intersection point, combine it with whichever segment
  // point is inside the polygon, and if none are inside it means the segment
  // intersects with a point along the outer edge, and we return undefined.
  if (clip_inclusive.length > 0) {
    const exclusive_inside = seg
      .map(s => point_in_convex_poly_exclusive(s, poly, epsilon));
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
