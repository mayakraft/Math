/**
 * the following operations generalize for n-dimensions
 */

/**
 * @param {number[]}
 * @returns {number}
 */
export const magnitude = v => Math.sqrt(v
  .map(n => n * n)
  .reduce((a, b) => a + b, 0));
/**
 * @param {number[]}
 * @returns {number[]}
 */
export const normalize = (v) => {
  const m = magnitude(v);
  // todo: should this catch divide by 0?
  // should a vector with magnitude 0 return the untouched argument?
  return m === 0 ? v : v.map(c => c / m);
};

export const scale = (v, s) => v.map(n => n * s);
/**
 * these *can* generalize to n-dimensions, but lengths of arguments must match.
 * the first element's dimension implies every other elements'.
 */
export const add = (v, u) => v.map((n, i) => n + u[i]);
export const subtract = (v, u) => v.map((n, i) => n - u[i]);
/**
 * @param {number[]} two vectors
 * @returns {number} one number
 */
export const dot = (v, u) => v
  .map((_, i) => v[i] * u[i])
  .reduce((a, b) => a + b, 0);
/**
 * @param {number[]} two vectors
 * @returns {number[]} one vector
 */
// use "average". it generalizes for any number of arguments
export const midpoint = (v, u) => v.map((n, i) => (n + u[i]) / 2);
/**
 * @param {...number[]} sequence of vectors
 * @returns {number[]} on vector, the midpoint
 */
// like midpoint, but this can accept any number of vectors
// for example it can be used to average the points of a polygon
export const average = function () {
  const dimension = (arguments.length > 0) ? arguments[0].length : 0;
  const sum = Array(dimension).fill(0);
  Array.from(arguments).forEach(vec => sum.forEach((_, i) => { sum[i] += vec[i] || 0; }));
  return sum.map(n => n / arguments.length);
};
/**
 * everything else that follows is hard coded to a certain dimension
 */
export const lerp = (v, u, t) => {
  const inv = 1.0 - t;
  return v.map((n, i) => n * inv + u[i] * t);
};
/**
 * @param two 2D vectors, order matters.
 * @returns the determinant. the *magnitude* of the vector
 */
export const cross2 = (a, b) => a[0] * b[1] - a[1] * b[0];
/**
 * @param two vectors, 3-D
 * @returns vector
 */
export const cross3 = (a, b) => [
  a[1] * b[2] - a[2] * b[1],
  a[0] * b[2] - a[2] * b[0],
  a[0] * b[1] - a[1] * b[0],
];
/**
 * @param two vectors, 2-D
 * @returns vector
 */
export const distance2 = (a, b) => {
  const p = a[0] - b[0];
  const q = a[1] - b[1];
  return Math.sqrt((p * p) + (q * q));
};
/**
 * @param two vectors, 3-D
 * @returns vector
 */
export const distance3 = (a, b) => {
  const c = a[0] - b[0];
  const d = a[1] - b[1];
  const e = a[2] - b[2];
  return Math.sqrt((c * c) + (d * d) + (e * e));
};
/**
 * @param two vectors, n-dimensions
 * @returns vector
 */
export const distance = (a, b) => Math.sqrt(a
  .map((_, i) => (a[i] - b[i]) ** 2)
  .reduce((u, v) => u + v, 0));

/**
 * @param one vector, n-dimensions
 * @returns vector, flipped to the opposite direction
 */
export const flip = v => v.map(n => -n);
/**
 * implicitly 2D
 */
export const rotate90 = v => [-v[1], v[0]];
export const rotate270 = v => [v[1], -v[0]];

// need to test:
// do two polygons overlap if they share a point in common? share an edge?
