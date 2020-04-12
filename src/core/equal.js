import {
  semi_flatten_arrays,
  get_vector_of_vectors
} from "../parsers/arguments";

export const EPSILON = 1e-6;

const fEqual = (a, b) => a === b;
const fEpsilonEqual = (a, b) => Math.abs(a - b) < EPSILON;

const array_similarity_test = (list, compFunc) => Array
  .from(Array(list.length - 1))
  .map((_, i) => compFunc(list[0], list[i + 1]))
  .reduce((a, b) => a && b, true);

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
 * @param {...number[]} compare n number of vectors, requires a consistent dimension
 * @returns boolean
 */
export const equivalent_vectors = (...args) => {
  const list = get_vector_of_vectors(...args);
  if (list.length === 0) { return false; }
  if (list.length === 1 && list[0] !== undefined) {
    return equivalent_vectors(...list[0]);
  }
  const dimension = list[0].length;
  const dim_array = Array.from(Array(dimension));
  for (var i = 1; i < list.length; i += 1) {
    if (typeof list[i - 1] !== typeof list[i]) { return false; }
  }
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
export const equivalent = (...args) => {
  let list = semi_flatten_arrays(args);
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
      console.warn("comparing array of objects for equivalency by slow JSON.stringify with no epsilon check");
      return array_similarity_test(list, (a, b) => JSON.stringify(a) === JSON.stringify(b));
    default:
      console.warn("incapable of determining comparison method");
      break;
  }
  return false;
};
