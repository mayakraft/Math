import {
  semi_flatten_arrays,
  resize_up,
  resize,
} from "../arguments/resize";
import { EPSILON } from "./constants";

const fEqual = (a, b) => a === b;
const fEpsilonEqual = (a, b) => Math.abs(a - b) < EPSILON;

const array_similarity_test = (list, compFunc) => Array
  .from(Array(list.length - 1))
  .map((_, i) => compFunc(list[0], list[i + 1]))
  .reduce((a, b) => a && b, true);

export const equivalent_vec2 = (a, b) => Math.abs(a[0] - b[0]) < EPSILON
  && Math.abs(a[1] - b[1]) < EPSILON;

export const equivalent_arrays_of_numbers = function () {

};
/**
 * @param {...number} a sequence of numbers
 * @returns boolean
 */
export const equivalent_numbers = function () {
  if (arguments.length === 0) { return false; }
  if (arguments.length === 1 && arguments[0] !== undefined) {
    return equivalent_numbers(...arguments[0]);
  }
  return array_similarity_test(arguments, fEpsilonEqual);
};
/**
 * this method compares two vectors and is permissive with trailing zeros
 * equivalency of [1, 2] and [1, 2, 0] is true
 * however, equivalency of [1, 2] and [1, 2, 3] is false
 * @param {...number[]} compare n number of vectors, requires a consistent dimension
 * @returns boolean
 */
// export const equivalent_vectors = (a, b) => {
//   const vecs = resize_up(a, b);
//   return vecs[0]
//     .map((_, i) => Math.abs(vecs[0][i] - vecs[1][i]) < EPSILON)
//     .reduce((u, v) => u && v, true);
// };

export const equivalent_vectors = function () {
  const args = Array.from(arguments);
  const length = args.map(a => a.length).reduce((a, b) => a > b ? a : b);
  const vecs = args.map(a => resize(length, a));
  return Array.from(Array(arguments.length - 1))
    .map((_, i) => vecs[0]
      .map((_, n) => Math.abs(vecs[0][n] - vecs[i + 1][n]) < EPSILON)
      .reduce((u, v) => u && v, true))
    .reduce((u, v) => u && v, true);
};
// export const equivalent_arrays = function (...args) {
//   const list = semi_flatten_arrays(args);
//   if (list.length === 0) { return false; }
//   if (list.length === 1 && list[0] !== undefined) {
//     return equivalent_vectors(...list[0]);
//   }
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
export const equivalent = function () {
  const list = semi_flatten_arrays(...arguments);
  if (list.length < 1) { return false; }
  const typeofList = typeof list[0];
  // array contains undefined, cannot compare
  if (typeofList === "undefined") { return false; }
  switch (typeofList) {
    case "number":
      return array_similarity_test(list, fEpsilonEqual);
    case "boolean":
    case "string":
      return array_similarity_test(list, fEqual);
    case "object":
      if (list[0].constructor === Array) { return equivalent_vectors(...list); }
      return array_similarity_test(list, (a, b) => JSON.stringify(a) === JSON.stringify(b));
    default: return undefined;
  }
};
