import { EPSILON } from "../core/constants";
import { midpoint } from "../core/algebra";
import {
  quick_equivalent_2,
  intersect_line_seg_include,
  intersect_line_seg_exclude,
  intersect_ray_seg_include,
  intersect_ray_seg_exclude,
  intersect_seg_seg_include,
  intersect_seg_seg_exclude,
} from "./helpers";
import { point_in_convex_poly_exclusive } from "../overlap/polygon";


// export const convex_poly_circle = function (poly, center, radius) {
//   return [];
// };

// todo, this is copied over in clip/polygon.js
const get_unique_pair = (intersections) => {
  for (let i = 1; i < intersections.length; i += 1) {
    if (!quick_equivalent_2(intersections[0], intersections[i])) {
      return [intersections[0], intersections[i]];
    }
  }
}

/**
 * generalized line-ray-segment intersection with convex polygon function
 * for lines and rays, line1 and line2 are the vector, origin in that order.
 * for segments, line1 and line2 are the two endpoints.
 */
const convex_poly_line_intersect = (intersect_func, poly, line1, line2, ep = EPSILON) => {
  const intersections = poly
    .map((p, i, arr) => [p, arr[(i + 1) % arr.length]]) // into segment pairs
    .map(el => intersect_func(line1, line2, el[0], el[1], ep))
    .filter(el => el != null);
  switch (intersections.length) {
    case 0: return undefined;
    case 1: return [intersections];
    default:
      // for two intersection points or more, in the case of vertex-
      // collinear intersections the same point from 2 polygon sides
      // can be returned. we need to filter for unique points.
      // if no 2 unique points found:
      // there was only one unique intersection point after all.
      return get_unique_pair(intersections) || [intersections[0]];
  }
};

/**
 * generalized line-ray-segment intersection with convex polygon function
 * for lines and rays, line1 and line2 are the vector, origin in that order.
 * for segments, line1 and line2 are the two endpoints.
 */
const poly_include_exclude_func = (intersect_func, poly, line1, line2, epsilon) => {
  const sects = convex_poly_line_intersect(intersect_func, poly, line1, line2, epsilon);
  let altFunc; // the opposite func, as far as inclusive/exclusive
  switch (intersect_func) {
    case intersect_line_seg_exclude: altFunc = intersect_line_seg_include; break;
    case intersect_ray_seg_exclude: altFunc = intersect_ray_seg_include; break;
    case intersect_seg_seg_exclude: altFunc = intersect_seg_seg_include; break;
    case intersect_line_seg_include:
    case intersect_ray_seg_include:
    case intersect_seg_seg_include:
    default: return sects;
  }
  // here on, we are only dealing with exclusive tests, parsing issues with
  // vertex-on intersections that still intersect or don't intersect the polygon.
  // repeat the computation but include intersections with the polygon's vertices.
  const includes = convex_poly_line_intersect(altFunc, poly, line1, line2, epsilon);
  // if there are still no intersections, the line doesn't intersect.
  if (includes === undefined) { return undefined; }
  // if there are intersections, see if the line crosses the entire polygon
  // (gives us 2 unique points)
  const uniqueIncludes = get_unique_pair(includes);
  // first, deal with the case that there are no unique 2 points.
  if (uniqueIncludes === undefined) {
    switch (intersect_func) {
      // if there is one intersection, an infinite line is intersecting the
      // polygon from the outside touching at just one vertex. this should be
      // considered undefined for the exclusive case.
      case intersect_line_seg_exclude: return undefined;
      // if there is one intersection, check if a ray's origin is inside.
      // 1. if the origin is inside, consider the intersection valid
      // 2. if the origin is outside, same as the line case above. no intersection.
      case intersect_ray_seg_exclude:
        // is the ray origin inside?
        return point_in_convex_poly_exclusive(line2, poly, epsilon)
          ? includes
          : undefined;
      // if there is one intersection, check if either of a segment's points are
      // inside the polygon, same as the ray above. if neither are, consider
      // the intersection invalid for the exclusive case.
      case intersect_seg_seg_exclude:
        return point_in_convex_poly_exclusive(line1, poly, epsilon) || point_in_convex_poly_exclusive(line2, poly, epsilon)
          ? includes
          : undefined;
    }
  }
  // now that we've covered all the other cases, we know that the line intersects
  // the polygon at two unique points. this should return true for all cases
  // except one: when the line is collinear to an edge of the polygon.
  // to test this, get the midpoint of the two intersects and do an exclusive
  // check if the midpoint is inside the polygon. if it is, the line is crossing
  // the polygon and the intersection is valid.
  return point_in_convex_poly_exclusive(midpoint(...uniqueIncludes), poly, epsilon)
    ? uniqueIncludes
    : sects;
};

export const convex_poly_line_inclusive = (poly, vec, org, ep = EPSILON) =>
  poly_include_exclude_func(intersect_line_seg_include, poly, vec, org, ep);
export const convex_poly_line_exclusive = (poly, vec, org, ep = EPSILON) =>
  poly_include_exclude_func(intersect_line_seg_exclude, poly, vec, org, ep);
export const convex_poly_ray_inclusive = (poly, vec, org, ep = EPSILON) =>
  poly_include_exclude_func(intersect_ray_seg_include, poly, vec, org, ep);
export const convex_poly_ray_exclusive = (poly, vec, org, ep = EPSILON) =>
  poly_include_exclude_func(intersect_ray_seg_exclude, poly, vec, org, ep);
export const convex_poly_segment_inclusive = (poly, pt0, pt1, ep = EPSILON) =>
  poly_include_exclude_func(intersect_seg_seg_include, poly, pt0, pt1, ep);
export const convex_poly_segment_exclusive = (poly, pt0, pt1, ep = EPSILON) =>
  poly_include_exclude_func(intersect_seg_seg_exclude, poly, pt0, pt1, ep);
