/**
 * this is *filled* with heuristic methods, methods that make assumptions,
 * methods that take in user-input and infer a best match.
 */

/**
 * sort two vectors by their lengths, returning the shorter one first
 *
 */
// export const lengthSort = (a, b) => [a, b].sort((m, n) => m.length - n.length);

/**
 * force a vector into N-dimensions by adding 0s if they don't exist.
 */
export const resize = (d, v) => (v.length === d
  ? v
  : Array(d).fill(0).map((z, i) => (v[i] ? v[i] : z)));

/**
 * this makes the two vectors match in dimension.
 * the smaller array will be filled with 0s to match the length of the larger
 */
export const resize_up = (a, b) => {
  const size = a.length > b.length ? a.length : b.length;
  return [a, b].map(v => resize(size, v));
};

/**
 * this makes the two vectors match in dimension.
 * the larger array will be shrunk to match the length of the smaller
 */
export const resize_down = (a, b) => {
  const size = a.length > b.length ? b.length : a.length;
  return [a, b].map(v => resize(size, v));
};

const count_places = function (num) {
  const m = (`${num}`).match(/(?:\.(\d+))?(?:[eE]([+-]?\d+))?$/);
  if (!m) { return 0; }
  return Math.max(0, (m[1] ? m[1].length : 0) - (m[2] ? +m[2] : 0));
};

/**
 * clean floating point numbers
 * example: 15.0000000000000002 into 15
 * the epsilon is adjustable default 15 places for Javascript's 16 digit float.
 * the remainder will be chopped off, make this epsilon as small as possible.
 * @args must be a number! do you own checking. this is for speed.
 */
export const clean_number = function (num, places = 15) {
  if (typeof num !== "number") { return num; }
  const crop = parseFloat(num.toFixed(places));
  if (count_places(crop) === Math.min(places, count_places(num))) {
    return num;
  }
  return crop;
};

const is_iterable = obj => obj != null
  && typeof obj[Symbol.iterator] === "function";

/**
 * flatten only until the point of comma separated entities. recursive
 * @returns always an array
 */
export const semi_flatten_arrays = function () {
  switch (arguments.length) {
    case undefined:
    case 0: return Array.from(arguments);
    // only if its an array (is iterable) and NOT a string
    case 1: return is_iterable(arguments[0]) && typeof arguments[0] !== "string"
      ? semi_flatten_arrays(...arguments[0])
      : [arguments[0]];
    default:
      return Array.from(arguments).map(a => (is_iterable(a)
        ? [...semi_flatten_arrays(a)]
        : a));
  }
};

// /**
//  * totally flatten, recursive
//  * @returns an array, always.
//  */
// export const flatten_arrays = function () {
//   const arr = semi_flatten_arrays(arguments);
//   return arr.length > 1
//     ? arr.reduce((a, b) => a.concat(b), [])
//     : arr;
// };
export const flatten_arrays = function () {
  switch (arguments.length) {
    case undefined:
    case 0: return Array.from(arguments);
    // only if its an array (is iterable) and NOT a string
    case 1: return is_iterable(arguments[0]) && typeof arguments[0] !== "string"
      ? flatten_arrays(...arguments[0])
      : [arguments[0]];
    default:
      return Array.from(arguments).map(a => (is_iterable(a)
        ? [...flatten_arrays(a)]
        : a)).reduce((a, b) => a.concat(b), []);
  }
};
