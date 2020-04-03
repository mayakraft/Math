import { EPSILON } from "./equal";
import { normalize, magnitude } from "./algebra";
import {
  point_in_convex_poly,
  point_in_convex_poly_exclusive
} from "./query";

/*
██╗      ██╗ ███╗   ██╗ ███████╗ ███████╗
██║      ██║ ████╗  ██║ ██╔════╝ ██╔════╝
██║      ██║ ██╔██╗ ██║ █████╗   ███████╗
██║      ██║ ██║╚██╗██║ ██╔══╝   ╚════██║
███████╗ ██║ ██║ ╚████║ ███████╗ ███████║
╚══════╝ ╚═╝ ╚═╝  ╚═══╝ ╚══════╝ ╚══════╝
 * inputs: lines
 * solutions: points
 */

/**
 *  all intersection functions are inclusive and return true if
 *  intersection lies directly on a segment's endpoint. to exclude
 *  endpoints, use "exclusive" functions
 */

/** comparison functions for a generalized vector intersection function */
const line_line_comp = () => true;
const line_ray_comp = (t0, t1) => t1 >= -EPSILON;
const line_segment_comp = (t0, t1) => t1 >= -EPSILON && t1 <= 1 + EPSILON;
const ray_ray_comp = (t0, t1) => t0 >= -EPSILON && t1 >= -EPSILON;
const ray_segment_comp = (t0, t1) => t0 >= -EPSILON && t1 >= -EPSILON && t1 <= 1 + EPSILON;
const segment_segment_comp = (t0, t1) => t0 >= -EPSILON && t0 <= 1 + EPSILON && t1 >= -EPSILON
  && t1 <= 1 + EPSILON;

// todo this has not been tested yet
// const line_line_comp_exclusive = function () { return true; } // redundant
const line_ray_comp_exclusive = (t0, t1) => t1 > EPSILON;
const line_segment_comp_exclusive = (t0, t1) => t1 > EPSILON && t1 < 1 - EPSILON;
const ray_ray_comp_exclusive = (t0, t1) => t0 > EPSILON && t1 > EPSILON;
const ray_segment_comp_exclusive = (t0, t1) => t0 > EPSILON && t1 > EPSILON && t1 < 1 - EPSILON;
const segment_segment_comp_exclusive = (t0, t1) => t0 > EPSILON && t0 < 1 - EPSILON && t1 > EPSILON
  && t1 < 1 - EPSILON;

// distance is between 0 and 1, representing the vector between start and end. cap accordingly
export const limit_line = dist => dist;
export const limit_ray = dist => (dist < -EPSILON ? 0 : dist);
export const limit_segment = (dist) => {
  if (dist < -EPSILON) { return 0; }
  if (dist > 1 + EPSILON) { return 1; }
  return dist;
};

/**
 * the generalized vector intersection function
 * requires a compFunction to describe valid bounds checking
 * line always returns true, ray is true for t > 0, segment must be between 0 < t < 1
*/
export const intersection_function = function (aPt, aVec, bPt, bVec, compFunc, epsilon = EPSILON) {
  function det(a, b) { return a[0] * b[1] - b[0] * a[1]; }
  const denominator0 = det(aVec, bVec);
  if (Math.abs(denominator0) < epsilon) { return undefined; } /* parallel */
  const denominator1 = -denominator0;
  const numerator0 = det([bPt[0] - aPt[0], bPt[1] - aPt[1]], bVec);
  const numerator1 = det([aPt[0] - bPt[0], aPt[1] - bPt[1]], aVec);
  const t0 = numerator0 / denominator0;
  const t1 = numerator1 / denominator1;
  if (compFunc(t0, t1, epsilon)) {
    return [aPt[0] + aVec[0] * t0, aPt[1] + aVec[1] * t0];
  }
  return undefined;
};

export const line_line = function (aPt, aVec, bPt, bVec, epsilon) {
  return intersection_function(aPt, aVec, bPt, bVec, line_line_comp, epsilon);
};
export const line_ray = function (linePt, lineVec, rayPt, rayVec, epsilon) {
  return intersection_function(linePt, lineVec, rayPt, rayVec, line_ray_comp, epsilon);
};
export const line_segment = function (origin, vec, segment0, segment1, epsilon) {
  const segmentVec = [segment1[0] - segment0[0], segment1[1] - segment0[1]];
  return intersection_function(
    origin, vec,
    segment0, segmentVec,
    line_segment_comp, epsilon
  );
};
export const ray_ray = function (aPt, aVec, bPt, bVec, epsilon) {
  return intersection_function(aPt, aVec, bPt, bVec, ray_ray_comp, epsilon);
};
export const ray_segment = function (rayPt, rayVec, segment0, segment1, epsilon) {
  const segmentVec = [segment1[0] - segment0[0], segment1[1] - segment0[1]];
  return intersection_function(
    rayPt, rayVec,
    segment0, segmentVec,
    ray_segment_comp, epsilon
  );
};
export const segment_segment = function (a0, a1, b0, b1, epsilon) {
  const aVec = [a1[0] - a0[0], a1[1] - a0[1]];
  const bVec = [b1[0] - b0[0], b1[1] - b0[1]];
  return intersection_function(
    a0, aVec,
    b0, bVec,
    segment_segment_comp, epsilon
  );
};


// no reason
// export const line_line_exclusive = function (aPt, aVec, bPt, bVec, epsilon) {
//  return intersection_function(aPt, aVec, bPt, bVec, line_line_comp_exclusive, epsilon);
// }
export const line_ray_exclusive = function (linePt, lineVec, rayPt, rayVec, epsilon) {
  return intersection_function(
    linePt, lineVec,
    rayPt, rayVec,
    line_ray_comp_exclusive, epsilon
  );
};
export const line_segment_exclusive = function (origin, vec, segment0, segment1, epsilon) {
  const segmentVec = [segment1[0] - segment0[0], segment1[1] - segment0[1]];
  return intersection_function(
    origin, vec,
    segment0, segmentVec,
    line_segment_comp_exclusive, epsilon
  );
};
export const ray_ray_exclusive = function (aPt, aVec, bPt, bVec, epsilon) {
  return intersection_function(
    aPt, aVec, bPt, bVec, ray_ray_comp_exclusive, epsilon
  );
};
export const ray_segment_exclusive = function (rayPt, rayVec, segment0, segment1, epsilon) {
  const segmentVec = [segment1[0] - segment0[0], segment1[1] - segment0[1]];
  return intersection_function(
    rayPt, rayVec,
    segment0, segmentVec,
    ray_segment_comp_exclusive, epsilon
  );
};
export const segment_segment_exclusive = function (a0, a1, b0, b1, epsilon) {
  const aVec = [a1[0] - a0[0], a1[1] - a0[1]];
  const bVec = [b1[0] - b0[0], b1[1] - b0[1]];
  return intersection_function(
    a0, aVec,
    b0, bVec,
    segment_segment_comp_exclusive, epsilon
  );
};


/*
 ██████╗ ██╗ ██████╗   ██████╗ ██╗      ███████╗ ███████╗
██╔════╝ ██║ ██╔══██╗ ██╔════╝ ██║      ██╔════╝ ██╔════╝
██║      ██║ ██████╔╝ ██║      ██║      █████╗   ███████╗
██║      ██║ ██╔══██╗ ██║      ██║      ██╔══╝   ╚════██║
╚██████╗ ██║ ██║  ██║ ╚██████╗ ███████╗ ███████╗ ███████║
 ╚═════╝ ╚═╝ ╚═╝  ╚═╝  ╚═════╝ ╚══════╝ ╚══════╝ ╚══════╝
 * inputs: circles, lines
 * solutions: points
 */

/*
 * returns an array of array of numbers
 */
export const circle_line = function (center, radius, lpt, lvec, epsilon = EPSILON) {
  const magSq = lvec[0] ** 2 + lvec[1] ** 2;
  const mag = Math.sqrt(magSq);
  const norm = mag === 0 ? lvec : lvec.map(c => c / mag);
  // const norm = normalize(lvec);
  const rot90 = [-norm[1], norm[0]];
  const bvec = [lpt[0] - center[0], lpt[1] - center[1]];
  const det = bvec[0] * norm[1] - norm[0] * bvec[1];
  if (Math.abs(det) > radius + epsilon) { return undefined; }
  const side = Math.sqrt((radius ** 2) - (det ** 2));
  const f = (s, i) => center[i] - rot90[i] * det + norm[i] * s;
  return Math.abs(radius - Math.abs(det)) < epsilon
    ? [side].map((s) => [s,s].map(f)) // tangent to circle
    : [-side, side].map((s) => [s,s].map(f));
};

export const circle_ray = function (center, radius, lpt, lvec, epsilon = EPSILON) {
  const magSq = lvec[0] ** 2 + lvec[1] ** 2;
  const mag = Math.sqrt(magSq);
  const norm = mag === 0 ? lvec : lvec.map(c => c / mag);
  // const norm = normalize(lvec);
  const rot90 = [-norm[1], norm[0]];
  const bvec = [lpt[0] - center[0], lpt[1] - center[1]];
  const det = bvec[0] * norm[1] - norm[0] * bvec[1];
  if (Math.abs(det) > radius + epsilon) { return undefined; }
  const side = Math.sqrt((radius ** 2) - (det ** 2));
  const f = (s, i) => center[i] - rot90[i] * det + norm[i] * s;
  const result = Math.abs(radius - Math.abs(det)) < epsilon
    ? [side].map((s) => [s,s].map(f)) // tangent to circle
    : [-side, side].map((s) => [s,s].map(f));
  const ts = result.map(res => res.map((n, i) => n - lpt[i]))
    .map(v => v[0] * lvec[0] + lvec[1] * v[1])
    .map(d => d / magSq);
  return result.filter((_,i) => ts[i] > -epsilon);
  // // const dets = resultVecs.map(v => v[0] * lvec[1] - lvec[0] * v[1]);
  // const vecDet = lpt[1] * lvec[0] - lpt[0] * lvec[1];
  // const resultDets = resultVecs.map(v => v[0] * lpt[1] - lpt[0] * v[1]);
  // // console.log(resultDets.map((d, i) => d / vecDet / ));
};

export const circle_segment = function (center, radius, p1, p2, epsilon = EPSILON) {
  const lpt = p1;
  const lvec = [p2[0] - p1[0], p2[1] - p1[1]];
  const magSq = lvec[0] ** 2 + lvec[1] ** 2;
  const mag = Math.sqrt(magSq);
  const norm = mag === 0 ? lvec : lvec.map(c => c / mag);
  // const norm = normalize(lvec);
  const rot90 = [-norm[1], norm[0]];
  const bvec = [lpt[0] - center[0], lpt[1] - center[1]];
  const det = bvec[0] * norm[1] - norm[0] * bvec[1];
  if (Math.abs(det) > radius + epsilon) { return undefined; }
  const side = Math.sqrt((radius ** 2) - (det ** 2));
  const f = (s, i) => center[i] - rot90[i] * det + norm[i] * s;
  const result = Math.abs(radius - Math.abs(det)) < epsilon
    ? [side].map((s) => [s,s].map(f)) // tangent to circle
    : [-side, side].map((s) => [s,s].map(f));
  const ts = result.map(res => res.map((n, i) => n - lpt[i]))
    .map(v => v[0] * lvec[0] + lvec[1] * v[1])
    .map(d => d / magSq);
  return result.filter((_,i) => ts[i] > -epsilon && ts[i] < 1 + epsilon);
};


/*
 * returns an array of array of numbers
 */
// export const circle_line_old = function (center, radius, p0, p1, epsilon = EPSILON) {
//   // move the origin to the center of the circle
//   const x1 = p0[0] - center[0];
//   const y1 = p0[1] - center[1];
//   const x2 = p1[0] - center[0];
//   const y2 = p1[1] - center[1];
//   const dx = x2 - x1;
//   const dy = y2 - y1;
//   const det = x1 * y2 - x2 * y1;
//   const det_sq = det * det;
//   const r_sq = radius * radius;
//   const dr_sq = Math.abs(dx * dx + dy * dy);
//   const delta = r_sq * dr_sq - det_sq;
//   // no solution
//   if (delta < -epsilon) { return undefined; }
//   // shorthand things
//   const suffix = Math.sqrt(r_sq * dr_sq - det_sq);
//   function sgn(x) { return (x < -epsilon) ? -1 : 1; }
//   const solutionA = [
//     center[0] + (det * dy + sgn(dy) * dx * suffix) / dr_sq,
//     center[1] + (-det * dx + Math.abs(dy) * suffix) / dr_sq,
//   ];
//   if (delta > epsilon) {
//     // two solutions
//     const solutionB = [
//       center[0] + (det * dy - sgn(dy) * dx * suffix) / dr_sq,
//       center[1] + (-det * dx - Math.abs(dy) * suffix) / dr_sq,
//     ];
//     return [solutionA, solutionB];
//   }
//   // else, delta == 0, line is tangent, one solution
//   return [solutionA];
// };

// export const circle_ray = function (center, radius, p0, p1) {
//   throw "circle_ray has not been written yet";
// };

// export const circle_segment = function (center, radius, p0, p1) {
//   const r_squared = radius ** 2;
//   const x1 = p0[0] - center[0];
//   const y1 = p0[1] - center[1];
//   const x2 = p1[0] - center[0];
//   const y2 = p1[1] - center[1];
//   const dx = x2 - x1;
//   const dy = y2 - y1;
//   const dr_squared = dx * dx + dy * dy;
//   const D = x1 * y2 - x2 * y1;
//   function sgn(x) { if (x < 0) { return -1; } return 1; }
//   const x_1 = (D * dy + sgn(dy) * dx * Math.sqrt(r_squared * dr_squared - D * D)) / (dr_squared);
//   const x_2 = (D * dy - sgn(dy) * dx * Math.sqrt(r_squared * dr_squared - D * D)) / (dr_squared);
//   const y_1 = (-D * dx + Math.abs(dy) * Math.sqrt(r_squared * dr_squared - D * D)) / (dr_squared);
//   const y_2 = (-D * dx - Math.abs(dy) * Math.sqrt(r_squared * dr_squared - D * D)) / (dr_squared);
//   const x1_NaN = isNaN(x_1);
//   const x2_NaN = isNaN(x_2);
//   if (!x1_NaN && !x2_NaN) {
//     return [
//       [x_1 + center[0], y_1 + center[1]],
//       [x_2 + center[0], y_2 + center[1]],
//     ];
//   }
//   if (x1_NaN && x2_NaN) { return undefined; }
//   if (!x1_NaN) {
//     return [[x_1 + center[0], y_1 + center[1]]];
//   }
//   if (!x2_NaN) {
//     return [[x_2 + center[0], y_2 + center[1]]];
//   }
//   return undefined;
// };


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
