// make this a console.log replaecment. but only flips on when you include
// in the header of rollup a flag set to true.
// const argument = {
//   // log: console.log,
//   log: () => {}
// };

/**
 * the following operations generalize for n-dimensions
 */

/**
 * @param {number[]}
 * @returns {number}
 */
export const magnitude = v => Math.sqrt(v
  .map(n => n * n)
  .reduce((a, b) => a + b, 0)
);
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

/**
 * these *can* generalize to n-dimensions, but lengths of arguments must match.
 * the first element's dimension implies every other elements'.
 */

/**
 * @param {number[]} two vectors
 * @returns {number} one number
 */
export const dot = (v, u) => v
  .map((_, i) => v[i] * u[i])
  .reduce((a, b) => a + b, 0);
/**
 * @param {...number[]} sequence of vectors
 * @returns {number[]} on vector, the midpoint
 */
export const average = (...args) => {
  const dimension = (args.length > 0) ? args[0].length : 0;
  const sum = Array(dimension).fill(0);
  args.forEach(vec => sum.forEach((_, i) => { sum[i] += vec[i] || 0; }));
  return sum.map(n => n / args.length);
};
/**
 * @param {number[]} two vectors
 * @returns {number[]} one vector
 */
// use "average". it generalizes for any number of arguments
export const midpoint2 = (a, b) => a.map((_, i) => (a[i] + b[i]) / 2);


/**
 * everything else that follows is hard coded to a certain dimension
 */

/**
 * @param two vectors, 2-D
 * @returns vector
 */
export const cross2 = (a, b) => [a[0] * b[1], a[1] * b[0]];

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
export const distance = (a, b) => Math.sqrt(Array.from(Array(a.length))
  .map((_,i) => (a[i] - b[i]) ** 2)
  .reduce((a, b) => a + b, 0)
);

// need to test:
// do two polygons overlap if they share a point in common? share an edge?
