import { EPSILON } from "./equal";
import { dot, normalize } from "./algebra";
import { identity3x4 } from "./matrix3";

/**
 * @param {number[]} a vector in a Javascript array object
 * @returns boolean
 */
export const degenerate = (v) => Math
  .abs(v.reduce((a, b) => a + b, 0)) < EPSILON;
/**
 * @param {number[], number[]} two vectors in Javascript array objects
 * @returns boolean
 */
export const parallel = (a, b) => 1 - Math
  .abs(dot(normalize(a), normalize(b))) < EPSILON;

/**
 * @param {number[]} is a 3x4 matrix the identity matrix
 * with a translation component of 0, 0, 0
 * @returns boolean
 */
export const is_identity3x4 = m => identity3x4
  .map((n, i) => Math.abs(n - m[i]) < EPSILON)
  .reduce((a, b) => a && b, true);

export const is_counter_clockwise_between = (angle, angleA, angleB) => {
  while (angleB < angleA) { angleB += Math.PI * 2; }
  while (angle < angleA) { angle += Math.PI * 2; }
  return angle < angleB;
};
