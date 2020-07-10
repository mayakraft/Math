import { EPSILON } from "../core/equal";
import {
  point_in_convex_poly,
  point_in_convex_poly_exclusive
} from "../core/query";

import {
  intersect,
  comp_l_s,
  exclude_s_s,
} from "./lines";

export const determ2 = (a, b) => a[0] * b[1] - b[0] * a[1];

const intersect_line_seg = (origin, vector, pt0, pt1) => {
  const a = { origin, vector };
  const b = { origin: pt0, vector: [[pt1[0] - pt0[0]], [pt1[1] - pt0[1]]] };
  return intersect(a, b, comp_l_s);
};
const intersect_seg_seg_exclude = (a0, a1, b0, b1) => {
  const a = { origin: a0, vector: [[a1[0] - a0[0]], [a1[1] - a0[1]]] };
  const b = { origin: b0, vector: [[b1[0] - b0[0]], [b1[1] - b0[1]]] };
  return intersect(a, b, exclude_s_s);
};

/*
██████╗   ██████╗  ██╗   ██╗ ██╗       ██████╗   ██████╗  ███╗   ██╗ ███████╗
██╔══██╗ ██╔═══██╗ ╚██╗ ██╔╝ ██║      ██╔════╝  ██╔═══██╗ ████╗  ██║ ██╔════╝
██████╔╝ ██║   ██║  ╚████╔╝  ██║      ██║  ███╗ ██║   ██║ ██╔██╗ ██║ ███████╗
██╔═══╝  ██║   ██║   ╚██╔╝   ██║      ██║   ██║ ██║   ██║ ██║╚██╗██║ ╚════██║
██║      ╚██████╔╝    ██║    ███████╗ ╚██████╔╝ ╚██████╔╝ ██║ ╚████║ ███████║
╚═╝       ╚═════╝     ╚═╝    ╚══════╝  ╚═════╝   ╚═════╝  ╚═╝  ╚═══╝ ╚══════╝
 * inputs: polygons, lines
 * solutions: lines, points
 */

// equivalency test for 2d-vectors
const quick_equivalent_2 = function (a, b) {
  return Math.abs(a[0] - b[0]) < EPSILON && Math.abs(a[1] - b[1]) < EPSILON;
};


export const convex_poly_circle = function (poly, center, radius) {
  return [];
};

/** clip an infinite line in a polygon, returns a segment or undefined if no intersection */
export const convex_poly_line = function (poly, lineVector, linePoint) {
  const intersections = poly
    .map((p, i, arr) => [p, arr[(i + 1) % arr.length]]) // poly points into segment pairs
    .map(el => intersect_line_seg(linePoint, lineVector, el[0], el[1]))
    .filter(el => el != null);
  switch (intersections.length) {
    case 0: return undefined;
    case 1: return [intersections[0], intersections[0]]; // degenerate segment
    case 2: return intersections;
    default:
      // special case: line intersects directly on a poly point (2 segments, same point)
      //  filter to unique points by [x,y] comparison.
      for (let i = 1; i < intersections.length; i += 1) {
        if (!quick_equivalent_2(intersections[0], intersections[i])) {
          return [intersections[0], intersections[i]];
        }
      }
      return undefined;
  }
};

export const convex_poly_ray = function (poly, lineVector, linePoint) {
  const intersections = poly
    .map((p, i, arr) => [p, arr[(i + 1) % arr.length]]) // poly points into segment pairs
    .map(el => ray_segment(linePoint, lineVector, el[0], el[1]))
    .filter(el => el != null);
  switch (intersections.length) {
    case 0: return undefined;
    case 1: return [linePoint, intersections[0]];
    case 2: return intersections;
    // default: throw "clipping ray in a convex polygon resulting in 3 or more points";
    default:
      for (let i = 1; i < intersections.length; i += 1) {
        if (!quick_equivalent_2(intersections[0], intersections[i])) {
          return [intersections[0], intersections[i]];
        }
      }
      return undefined;
  }
};

export const convex_poly_segment = function (poly, segmentA, segmentB, epsilon = EPSILON) {
  const intersections = poly
    .map((p, i, arr) => [p, arr[(i + 1) % arr.length]]) // polygon into segment pairs
    .map(el => intersect_seg_seg_exclude(segmentA, segmentB, el[0], el[1]))
    .filter(el => el != null);

  const aInsideExclusive = point_in_convex_poly_exclusive(segmentA, poly, epsilon);
  const bInsideExclusive = point_in_convex_poly_exclusive(segmentB, poly, epsilon);
  const aInsideInclusive = point_in_convex_poly(segmentA, poly, epsilon);
  const bInsideInclusive = point_in_convex_poly(segmentB, poly, epsilon);

  // both are inside, OR, one is inside and the other is collinear to poly
  if (intersections.length === 0
    && (aInsideExclusive || bInsideExclusive)) {
    return [segmentA, segmentB];
  }
  if (intersections.length === 0
    && (aInsideInclusive && bInsideInclusive)) {
    return [segmentA, segmentB];
  }
  switch (intersections.length) {
    case 0: return (aInsideExclusive
      ? [[...segmentA], [...segmentB]]
      : undefined);
    case 1: return (aInsideInclusive
      ? [[...segmentA], intersections[0]]
      : [[...segmentB], intersections[0]]);
    case 2: return intersections;
    default: throw new Error("clipping segment in a convex polygon resulting in 3 or more points");
  }
};

// exclusive functions

export const convex_poly_ray_exclusive = function (poly, lineVector, linePoint) {
  const intersections = poly
    .map((p, i, arr) => [p, arr[(i + 1) % arr.length]]) // poly points into segment pairs
    .map(el => ray_segment_exclusive(linePoint, lineVector, el[0], el[1]))
    .filter(el => el != null);
  switch (intersections.length) {
    case 0: return undefined;
    case 1: return [linePoint, intersections[0]];
    case 2: return intersections;
    // default: throw "clipping ray in a convex polygon resulting in 3 or more points";
    default:
      for (let i = 1; i < intersections.length; i += 1) {
        if (!quick_equivalent_2(intersections[0], intersections[i])) {
          return [intersections[0], intersections[i]];
        }
      }
      return undefined;
  }
};
