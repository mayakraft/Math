import { EPSILON } from "./constants";
import {
  fn_square,
  fn_add,
} from "../arguments/functions";

/**
 * algebra operations on vectors (mostly).
 *
 * many of these operations can handle vectors of arbitrary dimension
 * but wherever it specifies "dimensions match first parameter"
 * you should verify that the second parameter is at least as long as the first
 */

/**
 * @param {number[]} one vector, n-dimensions
 * @returns {number} one scalar
 */
export const magnitude = v => Math.sqrt(v
  .map(fn_square)
  .reduce(fn_add, 0));
/**
 * @param {number[]} one vector, n-dimensions
 * @returns {number} one scalar
 */
export const mag_squared = v => v
  .map(fn_square)
  .reduce(fn_add, 0);
/**
 * @param {number[]} one vector, n-dimensions
 * @returns {number[]} one vector
 */
export const normalize = (v) => {
  const m = magnitude(v);
  return m === 0 ? v : v.map(c => c / m);
};
/**
 * @param {number[]} one vector, n-dimensions
 * @param {number} one scalar
 * @returns {number[]} one vector
 */
export const scale = (v, s) => v.map(n => n * s);
/**
 * @param {number[]} one vector, n-dimensions
 * @param {number[]} one vector, n-dimensions
 * @returns {number[]} one vector, dimension matching first parameter
 */
export const add = (v, u) => v.map((n, i) => n + (u[i] || 0));
/**
 * @param {number[]} one vector, n-dimensions
 * @param {number[]} one vector, n-dimensions
 * @returns {number[]} one vector, dimension matching first parameter
 */
export const subtract = (v, u) => v.map((n, i) => n - (u[i] || 0));
/**
 * @param {number[]} one vector, n-dimensions
 * @param {number[]} one vector, n-dimensions
 * @returns {number} one scalar
 */
export const dot = (v, u) => v
  .map((_, i) => v[i] * u[i])
  .reduce(fn_add, 0);
/**
 * @param {number[]} one vector, n-dimensions
 * @param {number[]} one vector, n-dimensions
 * @returns {number} one vector, dimension matching first parameter
 */
export const midpoint = (v, u) => v.map((n, i) => (n + u[i]) / 2);
/**
 * average is like midpoint, but not limited to only 2 arguments.
 */
/**
 * @param {...number[]} sequence of vectors
 * @returns {number[]} one vector, dimension matching first parameter
 */
export const average = function () {
  if (arguments.length === 0) { return []; }
  const dimension = (arguments[0].length > 0) ? arguments[0].length : 0;
  const sum = Array(dimension).fill(0);
  Array.from(arguments)
    .forEach(vec => sum.forEach((_, i) => { sum[i] += vec[i] || 0; }));
  return sum.map(n => n / arguments.length);
};
/**
 * @param {number[]} one vector, n-dimensions
 * @param {number[]} one vector, n-dimensions
 * @param {number} scalar between 0 and 1
 * @returns {number[]} one vector, dimensions matching first parameter
 */
export const lerp = (v, u, t) => {
  const inv = 1.0 - t;
  return v.map((n, i) => n * inv + (u[i] || 0) * t);
};
/**
 * @description technically cross product in 2D is undefined,
 *  this returns the determinant of the matrix of the 2 vectors
 * @param {number[]} one 2D vector
 * @param {number[]} one 2D vector
 * @returns {number} one scalar; the determinant; the magnitude of the vector
 */
export const cross2 = (a, b) => a[0] * b[1] - a[1] * b[0];
/**
 * @param {number[]} one 3D vector
 * @param {number[]} one 3D vector
 * @returns {number[]} one 3D vector
 */
export const cross3 = (a, b) => [
  a[1] * b[2] - a[2] * b[1],
  a[2] * b[0] - a[0] * b[2],
  a[0] * b[1] - a[1] * b[0],
];
/**
 * @param {number[]} one 2D vector
 * @param {number[]} one 2D vector
 * @returns {number[]} one 2D vector
 */
export const distance2 = (a, b) => {
  const p = a[0] - b[0];
  const q = a[1] - b[1];
  return Math.sqrt((p * p) + (q * q));
};
/**
 * @param {number[]} one 3D vector
 * @param {number[]} one 3D vector
 * @returns {number} one scalar
 */
export const distance3 = (a, b) => {
  const c = a[0] - b[0];
  const d = a[1] - b[1];
  const e = a[2] - b[2];
  return Math.sqrt((c * c) + (d * d) + (e * e));
};
/**
 * @param {number[]} one vector, n-dimensions
 * @param {number[]} one vector, n-dimensions
 * @returns {number} one scalar
 */
export const distance = (a, b) => Math.sqrt(a
  .map((_, i) => (a[i] - b[i]) ** 2)
  .reduce((u, v) => u + v, 0));
/**
 * @param {number[]} one vector, n-dimensions
 * @returns {number[]} one vector
 */
export const flip = v => v.map(n => -n);
/**
 * @param {number[]} one 2D vector
 * @returns {number[]} one 2D vector, counter-clockwise rotation
 */
export const rotate90 = v => [-v[1], v[0]];
/**
 * @param {number[]} one 2D vector
 * @returns {number[]} one 2D vector, counter-clockwise rotation
 */
export const rotate270 = v => [v[1], -v[0]];
/**
 * @param {number[]} one vector, n-dimensions
 * @returns boolean
 */
export const degenerate = (v, epsilon = EPSILON) => Math
  .abs(v.reduce(fn_add, 0)) < epsilon;

// todo: should we use cross product to determine parallel?

/**
 * @param {number[]} one vector, n-dimensions
 * @param {number[]} one vector, n-dimensions
 * @returns boolean
 */
export const parallel = (a, b, epsilon = EPSILON) => 1 - Math
  .abs(dot(normalize(a), normalize(b))) < epsilon;

