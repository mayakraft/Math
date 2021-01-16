import { EPSILON } from "../core/constants";
import {
  add,
  subtract,
  midpoint
} from "../core/algebra";
import { equivalent_vector2 } from "../core/equal";
import {
  exclude,
  include_l,
  include_r,
  include_s,
  exclude_l,
  exclude_r,
  exclude_s,
} from "../arguments/functions";
import intersect_line_line from "./intersect-line-line";
import overlap_convex_polygon_point from "./overlap-polygon-point";

// todo, this is copied over in clip/polygon.js
const get_unique_pair = (intersections) => {
  for (let i = 1; i < intersections.length; i += 1) {
    if (!equivalent_vector2(intersections[0], intersections[i])) {
      return [intersections[0], intersections[i]];
    }
  }
}

// /**
//  * generalized line-ray-segment intersection with convex polygon function
//  * for lines and rays, line1 and line2 are the vector, origin in that order.
//  * for segments, line1 and line2 are the two endpoints.
//  */
// const convex_poly_line_intersect = (intersect_func, poly, line1, line2, ep = EPSILON) => {
//   const intersections = poly
//     .map((p, i, arr) => [p, arr[(i + 1) % arr.length]]) // into segment pairs
//     .map(el => intersect_func(line1, line2, el[0], el[1], ep))
//     .filter(a => a !== undefined);
//   switch (intersections.length) {
//     case 0: return undefined;
//     case 1: return [intersections];
//     default:
//       // for two intersection points or more, in the case of vertex-
//       // collinear intersections the same point from 2 polygon sides
//       // can be returned. we need to filter for unique points.
//       // if no 2 unique points found:
//       // there was only one unique intersection point after all.
//       return get_unique_pair(intersections) || [intersections[0]];
//   }
// };

const intersect_convex_polygon_line = (
  poly,
  vector, origin,
  fn_poly = include_s,
  fn_line = include_l,
  epsilon = EPSILON
) => {
  const intersections = poly
    .map((p, i, arr) => [p, arr[(i + 1) % arr.length]]) // into segment pairs
    .map(side => intersect_line_line(
      subtract(side[1], side[0]), side[0],
      vector, origin,
      fn_poly, fn_line,
      epsilon))
    .filter(a => a !== undefined);
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
const intersect_convex_polygon_line_exclusive = (
  poly,
  vector, origin,
  fn_poly = include_s,
  fn_line = include_l,
  epsilon = EPSILON
) => {
  const sects = intersect_convex_polygon_line(poly, vector, origin, fn_poly, fn_line, epsilon);
  // const sects = convex_poly_line_intersect(intersect_func, poly, line1, line2, epsilon);
  let altFunc; // the opposite func, as far as inclusive/exclusive
  switch (fn_line) {
    case exclude_l: altFunc = include_l; break;
    case exclude_r: altFunc = include_r; break;
    case exclude_s: altFunc = include_s; break;
    default: return sects;
  }
  // here on, we are only dealing with exclusive tests, parsing issues with
  // vertex-on intersections that still intersect or don't intersect the polygon.
  // repeat the computation but include intersections with the polygon's vertices.
  const includes = intersect_convex_polygon_line(poly, vector, origin, include_s, altFunc, epsilon);
  // const includes = convex_poly_line_intersect(altFunc, poly, line1, line2, epsilon);
  // if there are still no intersections, the line doesn't intersect.
  if (includes === undefined) { return undefined; }
  // if there are intersections, see if the line crosses the entire polygon
  // (gives us 2 unique points)
  const uniqueIncludes = get_unique_pair(includes);
  // first, deal with the case that there are no unique 2 points.
  if (uniqueIncludes === undefined) {
    switch (fn_line) {
      // if there is one intersection, an infinite line is intersecting the
      // polygon from the outside touching at just one vertex. this should be
      // considered undefined for the exclusive case.
      case exclude_l: return undefined;
      // if there is one intersection, check if a ray's origin is inside.
      // 1. if the origin is inside, consider the intersection valid
      // 2. if the origin is outside, same as the line case above. no intersection.
      case exclude_r:
        // is the ray origin inside?
        return overlap_convex_polygon_point(poly, origin, exclude, epsilon)
          ? includes
          : undefined;
      // if there is one intersection, check if either of a segment's points are
      // inside the polygon, same as the ray above. if neither are, consider
      // the intersection invalid for the exclusive case.
      case exclude_s:
        return overlap_convex_polygon_point(poly, add(origin, vector), exclude, epsilon)
          || overlap_convex_polygon_point(poly, origin, exclude, epsilon)
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
  return overlap_convex_polygon_point(poly, midpoint(...uniqueIncludes), exclude, epsilon)
    ? uniqueIncludes
    : sects;
};

export const convex_poly_line_inclusive = (poly, vec, org, ep = EPSILON) =>
  intersect_convex_polygon_line(poly, vec, org, include_s, include_l, ep);
export const convex_poly_ray_inclusive = (poly, vec, org, ep = EPSILON) =>
  intersect_convex_polygon_line(poly, vec, org, include_s, include_r, ep);
export const convex_poly_segment_inclusive = (poly, pt0, pt1, ep = EPSILON) =>
  intersect_convex_polygon_line(poly, subtract(pt1, pt0), pt0, include_s, include_s, ep);

export const convex_poly_line_exclusive = (poly, vec, org, ep = EPSILON) =>
  intersect_convex_polygon_line_exclusive(poly, vec, org, exclude_s, exclude_l, ep);
export const convex_poly_ray_exclusive = (poly, vec, org, ep = EPSILON) =>
  intersect_convex_polygon_line_exclusive(poly, vec, org, exclude_s, exclude_r, ep);
export const convex_poly_segment_exclusive = (poly, pt0, pt1, ep = EPSILON) =>
  intersect_convex_polygon_line_exclusive(poly, subtract(pt1, pt0), pt0, exclude_s, exclude_s, ep);

