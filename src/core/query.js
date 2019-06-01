import { EPSILON } from "../parse/clean";
import { dot, normalize } from "./algebra";
import {
  semi_flatten_input,
  get_vector_of_vectors
} from "../parse/arguments";

export const is_number = (n => n != null && !isNaN(n));
export const is_vector = (a => a != null && a[0] != null && !isNaN(a[0]));

const is_iterable = (o => o != null
  && typeof o[Symbol.iterator] === "function");

/**
 * the generalized vector intersection function
 * requires a compFunction to describe valid bounds checking
 * line always returns true, ray is true for t > 0, edge must be between 0 < t < 1
*/
export const overlap_function = function (aPt, aVec, bPt, bVec, compFunc) {
  const det = (a, b) => a[0] * b[1] - b[0] * a[1];
  const denominator0 = det(aVec, bVec);
  const denominator1 = -denominator0;
  const numerator0 = det([bPt[0] - aPt[0], bPt[1] - aPt[1]], bVec);
  const numerator1 = det([aPt[0] - bPt[0], aPt[1] - bPt[1]], aVec);
  if (Math.abs(denominator0) < EPSILON) { // parallel
    // todo:
    // if parallel and one point is inside another's vector (two are on top)
    // return true
    // else
    return false;
  }
  const t0 = numerator0 / denominator0;
  const t1 = numerator1 / denominator1;
  return compFunc(t0, t1);
};

const edge_edge_comp = (t0, t1) => t0 >= -EPSILON && t0 <= 1 + EPSILON
  && t1 >= -EPSILON && t1 <= 1 + EPSILON;

export const edge_edge_overlap = function (a0, a1, b0, b1) {
  const aVec = [a1[0] - a0[0], a1[1] - a0[1]];
  const bVec = [b1[0] - b0[0], b1[1] - b0[1]];
  return overlap_function(a0, aVec, b0, bVec, edge_edge_comp);
};


/**
 * @param {number[]} a vector in a Javascript array object
 * @returns boolean
 */
export const degenerate = function (v) {
  return Math.abs(v.reduce((a, b) => a + b, 0)) < EPSILON;
};
/**
 * @param {number[], number[]} two vectors in Javascript array objects
 * @returns boolean
 */
export const parallel = function (a, b) {
  return 1 - Math.abs(dot(normalize(a), normalize(b))) < EPSILON;
};

const array_similarity_test = function (list, compFunc) {
  return Array
    .from(Array(list.length - 1))
    .map((_, i) => compFunc(list[0], list[i + 1]))
    .reduce((a, b) => a && b, true);
};
/**
 * @param {...number} a sequence of numbers
 * @returns boolean
 */
export const equivalent_numbers = function (...args) {
  if (args.length === 0) { return false; }
  if (args.length === 1 && args[0] !== undefined) {
    return equivalent_numbers(...args[0]);
  }
  return array_similarity_test(args, (a, b) => Math.abs(a - b) < EPSILON);
};
/**
 * @param {...number[]} compare n number of vectors, requires a consistent dimension
 * @returns boolean
 */
export const equivalent_vectors = function (...args) {
  const list = get_vector_of_vectors(args);
  if (list.length === 0) { return false; }
  if (list.length === 1 && list[0] !== undefined) {
    return equivalent_vectors(...list[0]);
  }
  const dimension = list[0].length;
  const dim_array = Array.from(Array(dimension));
  return Array
    .from(Array(list.length - 1))
    .map((element, i) => dim_array
      .map((_, di) => Math.abs(list[i][di] - list[i + 1][di]) < EPSILON)
      .reduce((prev, curr) => prev && curr, true))
    .reduce((prev, curr) => prev && curr, true)
  && Array
    .from(Array(list.length - 1))
    .map((_, i) => list[0].length === list[i + 1].length)
    .reduce((a, b) => a && b, true);
};

// const equivalent_across_arrays = function (...args) {
//   const list = args;
//   const dimension = list[0].length;
//   const dim_array = Array.from(Array(dimension));
//   return Array
//     .from(Array(list.length - 1))
//     .map((element, i) => dim_array
//       .map((_, di) => Math.abs(list[i][di] - list[i + 1][di]) < EPSILON)
//       .reduce((prev, curr) => prev && curr, true))
//     .reduce((prev, curr) => prev && curr, true)
//   && Array
//     .from(Array(list.length - 1))
//     .map((_, i) => list[0].length === list[i + 1].length)
//     .reduce((a, b) => a && b, true);
// };

/**
 * @param {*} comma-separated sequence of either
 *   1. boolean
 *   2. number
 *   3. arrays of numbers (vectors)
 * @returns boolean
 */
export const equivalent = function (...args) {
  let list = semi_flatten_input(args);
  if (list.length < 1) { return false; }
  const typeofList = typeof list[0];
  // array contains undefined, cannot compare
  if (typeofList === "undefined") { return false; }
  if (list[0].constructor === Array) {
    list = list.map(el => semi_flatten_input(el));
  }
  switch (typeofList) {
    case "number":
      return array_similarity_test(list, (a, b) => Math.abs(a - b) < EPSILON);
    case "boolean":
      return array_similarity_test(list, (a, b) => a === b);
    case "object":
      if (list[0].constructor === Array) { return equivalent_vectors(list); }
      console.warn("comparing array of objects for equivalency by slow stringify and no-epsilon");
      return array_similarity_test(list, (a, b) => JSON.stringify(a) === JSON.stringify(b));
    default:
      console.warn("incapable of determining comparison method");
      break;
  }
  return false;
};

/**
 *  Boolean tests
 *  collinearity, overlap, contains
 */
/** is a point collinear to a line, within an epsilon */
export const point_on_line = function (linePoint, lineVector, point, epsilon = EPSILON) {
  const pointPoint = [point[0] - linePoint[0], point[1] - linePoint[1]];
  const cross = pointPoint[0] * lineVector[1] - pointPoint[1] * lineVector[0];
  return Math.abs(cross) < epsilon;
};
/** is a point collinear to an edge, between endpoints, within an epsilon */
export const point_on_edge = function (edge0, edge1, point, epsilon = EPSILON) {
  // distance between endpoints A,B should be equal to point->A + point->B
  const edge0_1 = [edge0[0] - edge1[0], edge0[1] - edge1[1]];
  const edge0_p = [edge0[0] - point[0], edge0[1] - point[1]];
  const edge1_p = [edge1[0] - point[0], edge1[1] - point[1]];
  const dEdge = Math.sqrt(edge0_1[0] * edge0_1[0] + edge0_1[1] * edge0_1[1]);
  const dP0 = Math.sqrt(edge0_p[0] * edge0_p[0] + edge0_p[1] * edge0_p[1]);
  const dP1 = Math.sqrt(edge1_p[0] * edge1_p[0] + edge1_p[1] * edge1_p[1]);
  return Math.abs(dEdge - dP0 - dP1) < epsilon;
};
/**
 * Tests whether or not a point is contained inside a polygon.
 * @returns {boolean} whether the point is inside the polygon or not
 * @example
 * var isInside = point_in_poly([0.5, 0.5], polygonPoints)
 */
export const point_in_poly = function (point, poly) {
  // W. Randolph Franklin
  // https://wrf.ecse.rpi.edu/Research/Short_Notes/pnpoly.html
  let isInside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    if ((poly[i][1] > point[1]) != (poly[j][1] > point[1])
      && point[0] < (poly[j][0] - poly[i][0]) * (point[1] - poly[i][1])
      / (poly[j][1] - poly[i][1]) + poly[i][0]) {
      isInside = !isInside;
    }
  }
  return isInside;
};

/** is a point inside of a convex polygon?
 * including along the boundary within epsilon
 *
 * @param poly is an array of points [ [x,y], [x,y]...]
 * @returns {boolean} true if point is inside polygon
 */
export const point_in_convex_poly = function (point, poly, epsilon = EPSILON) {
  if (poly == null || !(poly.length > 0)) { return false; }
  return poly.map((p, i, arr) => {
    const nextP = arr[(i + 1) % arr.length];
    const a = [nextP[0] - p[0], nextP[1] - p[1]];
    const b = [point[0] - p[0], point[1] - p[1]];
    return a[0] * b[1] - a[1] * b[0] > -epsilon;
  }).map((s, i, arr) => s === arr[0])
    .reduce((prev, curr) => prev && curr, true);
};

export const point_in_convex_poly_exclusive = function (point, poly, epsilon = EPSILON) {
  if (poly == null || !(poly.length > 0)) { return false; }
  return poly.map((p, i, arr) => {
    const nextP = arr[(i + 1) % arr.length];
    const a = [nextP[0] - p[0], nextP[1] - p[1]];
    const b = [point[0] - p[0], point[1] - p[1]];
    return a[0] * b[1] - a[1] * b[0] > epsilon;
  }).map((s, i, arr) => s === arr[0])
    .reduce((prev, curr) => prev && curr, true);
};

/** do two convex polygons overlap one another */
export const convex_polygons_overlap = function (ps1, ps2) {
  // convert array of points into edges [point, nextPoint]
  const e1 = ps1.map((p, i, arr) => [p, arr[(i + 1) % arr.length]]);
  const e2 = ps2.map((p, i, arr) => [p, arr[(i + 1) % arr.length]]);
  for (let i = 0; i < e1.length; i += 1) {
    for (let j = 0; j < e2.length; j += 1) {
      if (edge_edge_overlap(e1[i][0], e1[i][1], e2[j][0], e2[j][1])) {
        return true;
      }
    }
  }
  if (point_in_poly(ps2[0], ps1)) { return true; }
  if (point_in_poly(ps1[0], ps2)) { return true; }
  return false;
};

/**
 * is one polygon (inner) completely enclosed by another (outer)
 *
 */
export const convex_polygon_is_enclosed = function (inner, outer) {
  const goesInside = outer
    .map(p => point_in_convex_poly(p, inner))
    .reduce((a, b) => a || b, false);
  if (goesInside) { return false; }
  // not done
  return undefined;
};

/**
 * pairs of convex polygons, does one enclose another
 *
 */
export const convex_polygons_enclose = function (inner, outer) {
  // these points should be *not inside* (false)
  const outerGoesInside = outer
    .map(p => point_in_convex_poly(p, inner))
    .reduce((a, b) => a || b, false);
  // these points should be *inside* (true)
  const innerGoesOutside = inner
    .map(p => point_in_convex_poly(p, inner))
    .reduce((a, b) => a && b, true);
  return (!outerGoesInside && innerGoesOutside);
};


/**
████████╗██████╗ ██╗   ██╗███████╗    ███████╗ █████╗ ██╗     ███████╗███████╗
╚══██╔══╝██╔══██╗██║   ██║██╔════╝    ██╔════╝██╔══██╗██║     ██╔════╝██╔════╝
   ██║   ██████╔╝██║   ██║█████╗      █████╗  ███████║██║     ███████╗█████╗
   ██║   ██╔══██╗██║   ██║██╔══╝      ██╔══╝  ██╔══██║██║     ╚════██║██╔══╝
   ██║   ██║  ██║╚██████╔╝███████╗    ██║     ██║  ██║███████╗███████║███████╗
   ╚═╝   ╚═╝  ╚═╝ ╚═════╝ ╚══════╝    ╚═╝     ╚═╝  ╚═╝╚══════╝╚══════╝╚══════╝
 */
