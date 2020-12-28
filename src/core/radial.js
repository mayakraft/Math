import {
  EPSILON,
  TWO_PI,
} from "./constants";
import {
  dot,
	cross2,
  add,
  normalize,
  midpoint,
  rotate90,
	rotate270,
  alternating_sum,
} from "./algebra";
import { fn_add } from "../arguments/functions";
/**
 * measurements involving vectors and radians
 */

/**
 * @param {number} radians
 * @param {number} radians, lower bound
 * @param {number} radians, upper bound
 * this will test if the first parameter is counter-clockwise between A and B.
 */
export const is_counter_clockwise_between = (angle, angleA, angleB) => {
  while (angleB < angleA) { angleB += TWO_PI; }
  while (angle > angleA) { angle -= TWO_PI; }
  while (angle < angleA) { angle += TWO_PI; }
  return angle < angleB;
};
/**
 * There are 2 interior angles between 2 angles: A-to-B clockwise and
 * A-to-B counter-clockwise, this returns the clockwise one.
 * @param {number} angle in radians
 * @param {number} angle in radians
 * @returns {number} interior angle in radians, clockwise from a to b
 */
export const clockwise_angle_radians = (a, b) => {
  // this is on average 50 to 100 times faster than clockwise_angle2
  while (a < 0) { a += TWO_PI; }
  while (b < 0) { b += TWO_PI; }
  while (a > TWO_PI) { a -= TWO_PI; }
  while (b > TWO_PI) { b -= TWO_PI; }
  const a_b = a - b;
  return (a_b >= 0)
    ? a_b
    : TWO_PI - (b - a);
};
/**
 * There are 2 interior angles between 2 angles: A-to-B clockwise and
 * A-to-B counter-clockwise, this returns the counter-clockwise one.
 * @param {number} angle in radians
 * @param {number} angle in radians
 * @returns {number} interior angle in radians, counter-clockwise from a to b
 */
export const counter_clockwise_angle_radians = (a, b) => {
  // this is on average 50 to 100 times faster than counter_clockwise_angle2
  while (a < 0) { a += TWO_PI; }
  while (b < 0) { b += TWO_PI; }
  while (a > TWO_PI) { a -= TWO_PI; }
  while (b > TWO_PI) { b -= TWO_PI; }
  const b_a = b - a;
  return (b_a >= 0)
    ? b_a
    : TWO_PI - (a - b);
};
/** There are 2 angles between 2 vectors, from A to B return the clockwise one.
 * @param {[number, number]} vector
 * @param {[number, number]} vector
 * @returns {number} clockwise angle (from a to b) in radians
 */
export const clockwise_angle2 = (a, b) => {
  const dotProduct = b[0] * a[0] + b[1] * a[1];
  const determinant = b[0] * a[1] - b[1] * a[0];
  let angle = Math.atan2(determinant, dotProduct);
  if (angle < 0) { angle += TWO_PI; }
  return angle;
};

// @returns {number}
export const counter_clockwise_angle2 = (a, b) => {
  const dotProduct = a[0] * b[0] + a[1] * b[1];
  const determinant = a[0] * b[1] - a[1] * b[0];
  let angle = Math.atan2(determinant, dotProduct);
  if (angle < 0) { angle += TWO_PI; }
  return angle;
};
/**
 * this calculates an angle bisection between the pair of vectors
 * clockwise from the first vector to the second
 *
 *     a  x
 *       /     . bisection
 *      /   .
 *     / .
 *     --------x  b
 */
export const clockwise_bisect2 = (a, b) => {
  const radians = Math.atan2(a[1], a[0]) - clockwise_angle2(a, b) / 2;
  return [Math.cos(radians), Math.sin(radians)];
};
export const counter_clockwise_bisect2 = (a, b) => {
  const radians = Math.atan2(a[1], a[0]) + counter_clockwise_angle2(a, b) / 2;
  return [Math.cos(radians), Math.sin(radians)];
};
/**
 * This bisects 2 vectors into the smaller of their two angle bisections
 * technically this works in any dimension... unless the vectors are 180deg
 * from each other, there are an infinite number of solutions in 3D but
 * 2 solutions in 2D, this will return one of the 2D solutions.
 * todo: reconsider these assumptions
 * @param {[number, number]} vector
 * @returns {[[number, number],[number, number]]} 2 vectors, the smaller first
 */
// const bisect_vectors = (a, b, epsilon = EPSILON) => {
//   const aV = normalize(a);
//   const bV = normalize(b);
//   return dot(aV, bV) < (-1 + epsilon)
//     ? [-aV[1], aV[0]]
//     : normalize(add(aV, bV));
// };
/**
 * This bisects two 2D lines, which means it first finds the intersection point,
 *  then treats the lines as vectors, returning bisections. if the lines are
 *  parallel, it returns one solution
 * @param {[number, number]} all vectors, lines defined by points and vectors
 * @returns [ [number,number], [number,number] ] // line, defined as
 * point then vector, in that order
 *
 * second entry is 90 degrees counter clockwise from first entry
 */
// export const bisect_lines2 = (vectorA, pointA, vectorB, pointB, epsilon = EPSILON) => {
//   const denominator = vectorA[0] * vectorB[1] - vectorB[0] * vectorA[1];
//   if (Math.abs(denominator) < epsilon) { /* parallel */
//     const solution = [[vectorA[0], vectorA[1]], midpoint(pointA, pointB)];
//     const array = [solution, solution];
//     const dt = vectorA[0] * vectorB[0] + vectorA[1] * vectorB[1];
//     delete array[(dt > 0 ? 1 : 0)];
//     return array;
//   }
//   // const vectorC = [pointB[0] - pointA[0], pointB[1] - pointA[1]];
//   const numerator = (pointB[0] - pointA[0]) * vectorB[1] - vectorB[0] * (pointB[1] - pointA[1]);
//   const t = numerator / denominator;
//   const origin = [
//     pointA[0] + vectorA[0] * t,
//     pointA[1] + vectorA[1] * t,
//   ];
//   const bisects = [bisect_vectors(vectorA, vectorB, epsilon)];
//   bisects[1] = rotate90(bisects[0]);
//   return bisects.map(vector => ({ vector, origin }));
// };

export const bisect_lines2 = (vectorA, originA, vectorB, originB, epsilon = EPSILON) => {
  const determinant = cross2(vectorA, vectorB);
  const dotProd = dot(vectorA, vectorB);
  const bisects = determinant > -epsilon
    ? [counter_clockwise_bisect2(vectorA, vectorB)]
    : [clockwise_bisect2(vectorA, vectorB)];
  bisects[1] = determinant > -epsilon
    ? rotate90(bisects[0])
    : rotate270(bisects[0]);
  const numerator = (originB[0] - originA[0]) * vectorB[1] - vectorB[0] * (originB[1] - originA[1]);
  const t = numerator / determinant;
  const normalized = [vectorA, vectorB].map(vec => normalize(vec));
  const isParallel = Math.abs(cross2(...normalized)) < epsilon;
  const origin = isParallel
    ? midpoint(originA, originB)
    : [originA[0] + vectorA[0] * t, originA[1] + vectorA[1] * t];
  const solution = bisects.map(vector => ({ vector, origin }));
  if (isParallel) { delete solution[(dotProd > -epsilon ? 1 : 0)]; }
  return solution;
};


/**
 * given vectors, make a separate array of radially-sorted vector indices
 *
 * maybe there is such thing as an absolute radial origin (x axis?)
 * but this chooses the first element as the first element
 * and sort everything else counter-clockwise around it.
 *
 * @returns {number[]}, already c-cwise sorted would give [0,1,2,3,4]
 */
export const counter_clockwise_radians_order = (...radians) => {
  const counter_clockwise = radians
    .map((_, i) => i)
    .sort((a, b) => radians[a] - radians[b]);
  return counter_clockwise
    .slice(counter_clockwise.indexOf(0), counter_clockwise.length)
    .concat(counter_clockwise.slice(0, counter_clockwise.indexOf(0)));
};
export const counter_clockwise_vector_order = (...vectors) =>
  counter_clockwise_radians_order(...vectors.map(v => Math.atan2(v[1], v[0])))
/** There are 2 interior angles between 2 vectors, return both,
 * (no longer the the smaller first, but counter-clockwise from the first)
 * @param {[number, number]} vector
 * @returns {[number, number]} 2 angle measurements between vectors
 */
// export const interior_angles2 = (a, b) => {
//   const interior1 = counter_clockwise_angle2(a, b);
//   const interior2 = Math.PI * 2 - interior1;
//   // return (interior1 < interior2)
//   //   ? [interior1, interior2]
//   //   : [interior2, interior1];
//   return [interior1, interior2];
// };
/**
 * very important! this does not do any sorting. it calculates the interior
 * angle between each consecutive vector. if you need them to add up to 360deg,
 * you'll need to pre-sort your vectors with counter_clockwise_vector_order
 */
export const interior_angles = (...vecs) => vecs
  .map((v, i, ar) => counter_clockwise_angle2(v, ar[(i + 1) % ar.length]));

const interior_angles_unsorted = function (...vectors) {
};

/**
 * two varieties: vectors, radians, with a very important difference!:
 *
 * 1. the vectors describe the direction of the segment (length doesn't matter)
 * 2. the angles in radians are the INTERIOR ANGLES between the segments, not
 * the radians form of the vectors in case 1.
 *
 * case 2. is generally the faster way, vectors have to be turned into interior
 * angles.
 */

/**
 * @param {number[]} the angle of the edges in radians, like vectors around a vertex
 * @returns {number[]} for every sector,
 * this is hard coded to work for flat-plane, where sectors sum to 360deg
 */
export const kawasaki_solutions_radians = (radians) => radians
  // counter clockwise angle between this index and the next
  .map((v, i, arr) => [v, arr[(i + 1) % arr.length]])
  .map(pair => counter_clockwise_angle_radians(...pair))
  // for every sector, make an array of all the OTHER sectors
  .map((_, i, arr) => arr.slice(i + 1, arr.length).concat(arr.slice(0, i)))
  // for every sector, use the sector score from the OTHERS two to split it
  .map(opposite_sectors => alternating_sum(opposite_sectors).map(s => Math.PI - s))
  // add the deviation to the edge to get the absolute position
  .map((kawasakis, i) => radians[i] + kawasakis[0])
  // sometimes this results in a solution OUTSIDE the sector. ignore these
  .map((angle, i) => (is_counter_clockwise_between(angle,
    radians[i], radians[(i + 1) % radians.length])
    ? angle
    : undefined));
// or should we remove the indices so the array reports [ empty x2, ...]

export const kawasaki_solutions = (vectors) => {
  const vectors_radians = vectors.map(v => Math.atan2(v[1], v[0]));
  return kawasaki_solutions_radians(vectors_radians)
    .map(a => (a === undefined
      ? undefined
      : [Math.cos(a), Math.sin(a)]));
};
/**
 * subsect the angle between two vectors already converted to radians
 */
// export const subsect_radians = (divisions, angleA, angleB) => {
//   const angle = counter_clockwise_angle_radians(angleA, angleB) / divisions;
//   return Array.from(Array(divisions - 1))
//     .map((_, i) => angleA + angle * i);
// };
/**
 * subsect the angle between two vectors (counter-clockwise from A to B)
 */
// export const subsect = (divisions, vectorA, vectorB) => {
//   const angleA = Math.atan2(vectorA[1], vectorA[0]);
//   const angleB = Math.atan2(vectorB[1], vectorB[0]);
//   return subsect_radians(divisions, angleA, angleB)
//     .map(rad => [Math.cos(rad), Math.sin(rad)]);
// };
/**
 * subsect the angle between two lines, can handle parallel lines
 */
// export const subsectLines = function (divisions, pointA, vectorA, pointB, vectorB) {
//   const denominator = vectorA[0] * vectorB[1] - vectorB[0] * vectorA[1];
//   if (Math.abs(denominator) < EPSILON) { /* parallel */
//     const solution = [midpoint(pointA, pointB), [vectorA[0], vectorA[1]]];
//     const array = [solution, solution];
//     const dot = vectorA[0] * vectorB[0] + vectorA[1] * vectorB[1];
//     delete array[(dot > 0 ? 1 : 0)];
//     return array;
//   }
//   const numerator = (pointB[0] - pointA[0]) * vectorB[1] - vectorB[0] * (pointB[1] - pointA[1]);
//   const t = numerator / denominator;
//   const x = pointA[0] + vectorA[0] * t;
//   const y = pointA[1] + vectorA[1] * t;
//   const bisects = bisect_vectors(vectorA, vectorB);
//   bisects[1] = [-bisects[0][1], bisects[0][0]];
//   return bisects.map(el => [[x, y], el]);
// };
