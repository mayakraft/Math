/**
 * Math (c) Kraft
 */
import { EPSILON } from "./constants";
import {
  fn_and,
  fn_equal,
  fn_epsilon_equal,
} from "../arguments/functions";
import {
  semi_flatten_arrays,
  resize_up,
  resize,
} from "../arguments/resize";

const array_similarity_test = (list, compFunc) => Array
  .from(Array(list.length - 1))
  .map((_, i) => compFunc(list[0], list[i + 1]))
  .reduce(fn_and, true);

// square bounding box for fast calculation
export const equivalent_vector2 = (a, b) => [0, 1]
  .map(i => fn_epsilon_equal(a[i], b[i]))
  .reduce(fn_and, true);
// export const equivalent_vector2 = (a, b) => Math.abs(a[0] - b[0]) < EPSILON
//   && Math.abs(a[1] - b[1]) < EPSILON;
/**
 * @param {...number} a sequence of numbers
 * @returns boolean
 */
export const equivalent_numbers = function () {
  if (arguments.length === 0) { return false; }
  if (arguments.length === 1 && arguments[0] !== undefined) {
    return equivalent_numbers(...arguments[0]);
  }
  return array_similarity_test(arguments, fn_epsilon_equal);
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
      .reduce(fn_and, true))
    .reduce(fn_and, true);
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
      return array_similarity_test(list, fn_epsilon_equal);
    case "boolean":
    case "string":
      return array_similarity_test(list, fn_equal);
    case "object":
      if (list[0].constructor === Array) { return equivalent_vectors(...list); }
      return array_similarity_test(list, (a, b) => JSON.stringify(a) === JSON.stringify(b));
    default: return undefined;
  }
};

