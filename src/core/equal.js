/**
 * Math (c) Kraft
 */
import { EPSILON } from "./constants";
import {
  fnAnd,
  fnEqual,
  fnEpsilonEqual,
} from "../arguments/functions";
import {
  semiFlattenArrays,
  resizeUp,
  resize,
} from "../arguments/resize";

// const arraySimilarityTest = (list, compFunc) => Array
//   .from(Array(list.length - 1))
//   .map((_, i) => compFunc(list[0], list[i + 1]))
//   .reduce(fnAnd, true);
/**
 * @description check whether an array of numbers are all similar to each other within an epsilon
 * @param {...number|number[]} args a sequence of numbers or an array of numbers
 * @returns {boolean} true if all numbers are similar within an epsilon
 */
// export const equivalentNumbers = function () {
//   if (arguments.length === 0) { return false; }
//   if (arguments.length === 1 && arguments[0] !== undefined) {
//     return equivalentNumbers(...arguments[0]);
//   }
//   return arraySimilarityTest(arguments, fnEpsilonEqual);
// };
// export const equivalentVectors = (a, b) => {
//   const vecs = resizeUp(a, b);
//   return vecs[0]
//     .map((_, i) => Math.abs(vecs[0][i] - vecs[1][i]) < EPSILON)
//     .reduce((u, v) => u && v, true);
// };
/**
 * @description this method compares two vectors and is permissive with trailing zeros,
 * for example, [1, 2] and [1, 2, 0] is true. however, [1, 2] and [1, 2, 3] is false
 * @param {...number[]|number[][]} args a sequence of number arrays or an array of array of numbers.
 * @returns {boolean} true if all vectors are equivalent
 */
// export const equivalentVectors = function () {
//   const args = Array.from(arguments);
//   const length = args.map(a => a.length).reduce((a, b) => a > b ? a : b);
//   const vecs = args.map(a => resize(length, a));
//   return Array.from(Array(arguments.length - 1))
//     .map((_, i) => vecs[0]
//       .map((_, n) => Math.abs(vecs[0][n] - vecs[i + 1][n]) < EPSILON)
//       .reduce(fnAnd, true))
//     .reduce(fnAnd, true);
// };
// export const equivalent_arrays = function (...args) {
//   const list = semiFlattenArrays(args);
//   if (list.length === 0) { return false; }
//   if (list.length === 1 && list[0] !== undefined) {
//     return equivalentVectors(...list[0]);
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
 * @returns {boolean} if set is equivalent
 */
// export const equivalent = function () {
//   const list = semiFlattenArrays(...arguments);
//   if (list.length < 1) { return false; }
//   const typeofList = typeof list[0];
//   // array contains undefined, cannot compare
//   if (typeofList === "undefined") { return false; }
//   switch (typeofList) {
//     case "number":
//       return arraySimilarityTest(list, fnEpsilonEqual);
//     case "boolean":
//     case "string":
//       return arraySimilarityTest(list, fnEqual);
//     case "object":
//       if (list[0].constructor === Array) { return equivalentVectors(...list); }
//       return arraySimilarityTest(list, (a, b) => JSON.stringify(a) === JSON.stringify(b));
//     default: return undefined;
//   }
// };

