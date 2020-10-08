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

// convert segments to vector origin
const collinear_check = (poly, vector, origin) => {
  const polyvecs = poly
    .map((p, i, arr) => [p, arr[(i + 1) % arr.length]]) // poly points into segments
    .map(seg => subtract(...seg));
  return polyvecs
    .map((vec, i) => parallel(vec, vector) ? i : undefined)
    .filter(a => a !== undefined) // filter only sides that are parallel
    .map(i => point_on_line(origin, polyvecs[i], poly[i])) // is the point along edge
    .reduce((a, b) => a || b, false);
};

const clip_intersections = (intersect_func, poly, line1, line2, epsilon = EPSILON) => poly
  .map((p, i, arr) => [p, arr[(i + 1) % arr.length]]) // poly points into segments
  .map(el => intersect_func(line1, line2, el[0], el[1], epsilon))
  .filter(el => el !== undefined);

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
}

const finish_line = (intersections) => {
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
const finish_ray = (intersections, poly, origin) => {
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
const finish_segment = (intersections, poly, seg0, seg1, epsilon = EPSILON) => {
  const seg = [seg0, seg1];
  const exclusive_in = seg
    .map(s => point_in_convex_poly_exclusive(s, poly, epsilon));
  const inclusive_in = seg
    .map(s => point_in_convex_poly_inclusive(s, poly, epsilon));
  switch (intersections.length) {
    // both are inside, OR, one is inside and the other is collinear to poly
    case 0: {
      if (exclusive_in[0] || exclusive_in[1]) { return [[...seg0], [...seg1]]; }
      if (inclusive_in[0] && inclusive_in[1]) { return [[...seg0], [...seg1]]; }
      return undefined;
    }
    case 1:
      if (exclusive_in[0]) { return [[...seg0], intersections[0]]; }
      if (exclusive_in[1]) { return [[...seg1], intersections[0]]; }
      return undefined;
    default: {
      const unique = get_unique_pair(intersections);
      if (unique !== undefined) { return unique; }
      return (inclusive_in[0]
        ? [[...seg0], intersections[0]]
        : [[...seg1], intersections[0]]);
    }
  }
};

export const clip_line_in_convex_poly_inclusive = (poly, vector, origin, epsilon = EPSILON) => {
  const p = clip_intersections(intersect_line_seg_include, poly, vector, origin, epsilon);
  return finish_line(p);
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
  const p = clip_intersections(intersect_ray_seg_include, poly, vector, origin, epsilon);
  return finish_ray(p, poly, origin);
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
export const clip_segment_in_convex_poly_inclusive = (poly, seg0, seg1, epsilon = EPSILON) => {
  const p = clip_intersections(intersect_seg_seg_include, poly, seg0, seg1, epsilon);
  return finish_segment(p, poly, seg0, seg1);
};
export const clip_segment_in_convex_poly_exclusive = (poly, seg0, seg1, epsilon = EPSILON) => {
  const segVec = subtract(seg1, seg0);
  if (collinear_check(poly, segVec, seg0)) {
    // if this is inclusive, we want to do some more tests.
    return undefined;
  }
  const seg = [seg0, seg1];
  const inclusive_inside = seg
    .map(s => point_in_convex_poly_inclusive(s, poly, epsilon));
  if (inclusive_inside[0] === true && inclusive_inside[1] === true) {
    return [[...seg0], [...seg1]];
  }
  const clip_inclusive = clip_intersections(intersect_seg_seg_include, poly, seg0, seg1, epsilon);
  const clip_inclusive_unique = get_unique_pair(clip_inclusive);
  if (clip_inclusive_unique) {  // 3 or 4
    return clip_inclusive_unique;
  }

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



// /** clip an infinite line in a polygon, returns a segment or undefined if no intersection */
// export const clip_line_in_convex_poly = (poly, lineVector, lineOrigin) => {
//   const intersections = poly
//     .map((p, i, arr) => [p, arr[(i + 1) % arr.length]]) // into segment pairs
//     .map(el => intersect_line_seg(lineVector, lineOrigin, el[0], el[1]))
//     .filter(el => el != null);
//   switch (intersections.length) {
//     case 0: return undefined;
//     case 1: return [intersections[0], intersections[0]]; // degenerate segment
//     case 2: return intersections;
//     default:
//       // special case: line intersects directly on a poly point (2 segments, same point)
//       //  filter to unique points by [x,y] comparison.
//       for (let i = 1; i < intersections.length; i += 1) {
//         if (!quick_equivalent_2(intersections[0], intersections[i])) {
//           return [intersections[0], intersections[i]];
//         }
//       }
//       return undefined;
//   }
// };

// export const convex_poly_ray_inclusive = function (poly, lineVector, lineOrigin) {
//   const intersections = poly
//     .map((p, i, arr) => [p, arr[(i + 1) % arr.length]]) // into segment pairs
//     .map(el => intersect_ray_seg_include(lineVector, lineOrigin, el[0], el[1]))
//     .filter(el => el != null);
//   switch (intersections.length) {
//     case 0: return undefined;
//     case 1: return [lineOrigin, intersections[0]];
//     case 2:
//       return quick_equivalent_2(intersections[0], intersections[1])
//         ? [lineOrigin, intersections[0]]
//         : intersections;
//     // default: throw "clipping ray in a convex polygon resulting in 3 or more points";
//     default:
//       for (let i = 1; i < intersections.length; i += 1) {
//         if (!quick_equivalent_2(intersections[0], intersections[i])) {
//           return [intersections[0], intersections[i]];
//         }
//       }
//       return undefined;
//   }
// };

// export const convex_poly_ray_exclusive = function (poly, lineVector, lineOrigin) {
//   const intersections = poly
//     .map((p, i, arr) => [p, arr[(i + 1) % arr.length]]) // poly points into segment pairs
//     .map(el => intersect_ray_seg_exclude(lineVector, lineOrigin, el[0], el[1]))
//     .filter(el => el != null);
//   switch (intersections.length) {
//     case 0: return undefined;
//     case 1: return [lineOrigin, intersections[0]];
//     case 2: return intersections;
//     // default: throw "clipping ray in a convex polygon resulting in 3 or more points";
//     default:
//       for (let i = 1; i < intersections.length; i += 1) {
//         if (!quick_equivalent_2(intersections[0], intersections[i])) {
//           return [intersections[0], intersections[i]];
//         }
//       }
//       return undefined;
//   }
// };

// export const convex_poly_segment_inclusive = function (poly, segmentA, segmentB, epsilon = EPSILON) {
//   console.log("todo")
// };

// // todo: double check that this is segment method is exclusive
// export const convex_poly_segment_exclusive = function (poly, segmentA, segmentB, epsilon = EPSILON) {
//   const intersections = poly
//     .map((p, i, arr) => [p, arr[(i + 1) % arr.length]]) // polygon into segment pairs
//     .map(el => intersect_seg_seg_exclude(segmentA, segmentB, el[0], el[1]))
//     .filter(el => el != null);

//   const aInsideExclusive = point_in_convex_poly_exclusive(segmentA, poly, epsilon);
//   const bInsideExclusive = point_in_convex_poly_exclusive(segmentB, poly, epsilon);
//   const aInsideInclusive = point_in_convex_poly_inclusive(segmentA, poly, epsilon);
//   const bInsideInclusive = point_in_convex_poly_inclusive(segmentB, poly, epsilon);

//   // both are inside, OR, one is inside and the other is collinear to poly
//   if (intersections.length === 0
//     && (aInsideExclusive || bInsideExclusive)) {
//     return [segmentA, segmentB];
//   }
//   if (intersections.length === 0
//     && (aInsideInclusive && bInsideInclusive)) {
//     return [segmentA, segmentB];
//   }
//   switch (intersections.length) {
//     case 0: return (aInsideExclusive
//       ? [[...segmentA], [...segmentB]]
//       : undefined);
//     case 1: return (aInsideInclusive
//       ? [[...segmentA], intersections[0]]
//       : [[...segmentB], intersections[0]]);
//     case 2: return intersections;
//     default: throw new Error("clipping segment in a convex polygon resulting in 3 or more points");
//   }
// };

