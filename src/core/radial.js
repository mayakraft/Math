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
} from "./algebra";
import { get_vector_of_vectors } from "../arguments/get";
import { flatten_arrays } from "../arguments/resize";
import {
  fn_add,
  fn_vec2_angle,
  fn_to_vec2,
} from "../arguments/functions";
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
export const clockwise_bisect2 = (a, b) => fn_to_vec2(
  fn_vec2_angle(a) - clockwise_angle2(a, b) / 2
);

export const counter_clockwise_bisect2 = (a, b) => fn_to_vec2(
  fn_vec2_angle(a) + counter_clockwise_angle2(a, b) / 2
);

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
export const counter_clockwise_order_radians = function () {
  const radians = flatten_arrays(arguments);
  const counter_clockwise = radians
    .map((_, i) => i)
    .sort((a, b) => radians[a] - radians[b]);
  return counter_clockwise
    .slice(counter_clockwise.indexOf(0), counter_clockwise.length)
    .concat(counter_clockwise.slice(0, counter_clockwise.indexOf(0)));
};

export const counter_clockwise_order2 = function () {
  return counter_clockwise_order_radians(
    get_vector_of_vectors(arguments).map(fn_vec2_angle)
  );
};
/**
 * @description given an array of angles, return the sector angles between
 * consecutive parameters. if radially unsorted, this will sort them.
 *
 * @param {number[]} array of angles in radians
 * @returns {number[]} array of sector angles in radians
 */
export const counter_clockwise_sectors_radians = function () {
  const radians = flatten_arrays(arguments);
  const ordered = counter_clockwise_order_radians(radians)
    .map(i => radians[i]);
  return ordered.map((rad, i, arr) => [rad, arr[(i + 1) % arr.length]])
    .map(pair => counter_clockwise_angle_radians(pair[0], pair[1]));
};
/**
 * @description given an array of vectors, return the sector angles between
 * consecutive parameters. if radially unsorted, this will sort them.
 *
 * @param {number[][]} array of 2D vectors (higher dimensions will be ignored)
 * @returns {number[]} array of sector angles in radians
 */
export const counter_clockwise_sectors2 = function () {
  return counter_clockwise_sectors_radians(
    get_vector_of_vectors(arguments).map(fn_vec2_angle)
  );
};
/**
 * subsect the angle between two vectors already converted to radians
 */
export const counter_clockwise_subsect_radians = (divisions, angleA, angleB) => {
  const angle = counter_clockwise_angle_radians(angleA, angleB) / divisions;
  return Array.from(Array(divisions - 1))
    .map((_, i) => angleA + angle * (i + 1));
};
/**
 * subsect the angle between two vectors (counter-clockwise from A to B)
 */
export const counter_clockwise_subsect2 = (divisions, vectorA, vectorB) => {
  const angleA = Math.atan2(vectorA[1], vectorA[0]);
  const angleB = Math.atan2(vectorB[1], vectorB[0]);
  return counter_clockwise_subsect_radians(divisions, angleA, angleB)
    .map(fn_to_vec2);
};
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
