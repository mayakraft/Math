import { EPSILON } from "../core/equal";
import {
  point_in_convex_poly,
  point_in_convex_poly_exclusive
} from "../core/query";

export const determ2 = (a, b) => a[0] * b[1] - b[0] * a[1];

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
export const convex_poly_line = function (poly, linePoint, lineVector) {
  const intersections = poly
    .map((p, i, arr) => [p, arr[(i + 1) % arr.length]]) // poly points into segment pairs
    .map(el => line_segment(linePoint, lineVector, el[0], el[1]))
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

export const convex_poly_ray = function (poly, linePoint, lineVector) {
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

export const convex_poly_segment = function (poly, segmentA, segmentB) {
  const intersections = poly
    .map((p, i, arr) => [p, arr[(i + 1) % arr.length]]) // polygon into segment pairs
    .map(el => segment_segment_exclusive(segmentA, segmentB, el[0], el[1]))
    .filter(el => el != null);

  const aInsideExclusive = point_in_convex_poly_exclusive(segmentA, poly);
  const bInsideExclusive = point_in_convex_poly_exclusive(segmentB, poly);
  const aInsideInclusive = point_in_convex_poly(segmentA, poly);
  const bInsideInclusive = point_in_convex_poly(segmentB, poly);

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

export const convex_poly_ray_exclusive = function (poly, linePoint, lineVector) {
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
