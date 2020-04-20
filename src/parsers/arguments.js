import Constructors from "../primitives/constructors";

/**
 * this is *filled* with heuristic methods, methods that make assumptions,
 * methods that take in user-input and infer a best match.
 */

/**
 * one way to improve these input finders is to search in all indices
 * of the arguments list, right now it assumes THIS is the only thing
 * you're passing in. in the case that it isn't and there's an object
 * in the first slot, it won't find the valid data in the second.
 */
export const Typeof = function (obj) {
  if (typeof obj === "object") {
    if (obj.radius != null) { return "circle"; }
    if (obj.width != null) { return "rectangle"; }
    if (obj.x != null) { return "vector" }
    // line ray segment
    if (obj.rotate180 != null) { return "ray"; }
    if (obj[0] != null && obj[0].length && obj[0].x != null) { return "segment"; }
    if (obj.vector != null && obj.origin != null) { return "line"; }
  }
  return undefined;
};

/**
 * @returns ({ point:[], vector:[] })
*/
const vector_origin_form = (vector, origin) => ({
  vector: vector || [],
  origin: origin || []
});


/**
 * sort two vectors by their lengths, returning the shorter one first
 *
 */
export const lengthSort = (a, b) => [a, b].sort((a, b) => a.length - b.length);

/**
 * force a vector into N-dimensions by adding 0s if they don't exist.
 */
export const resize = (d, v) => Array(d).fill(0).map((z, i) => v[i] ? v[i] : z);

/**
 * this makes the two vectors match in dimension.
 * the smaller array will be filled with 0s to match the length of the larger
 */
export const resizeUp = (a, b) => {
  const size = a.length > b.length ? a.length : b.length;
  return [a, b].map(v => resize(size, v));
};

export const resizeDown = (a, b) => {
  const size = a.length > b.length ? b.length : a.length;
  return [a, b].map(v => resize(size, v));
};

const countPlaces = function (num) {
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
  if (countPlaces(crop) === Math.min(places, countPlaces(num))) {
    return num;
  }
  return crop;
};

/**
 * type checking
 */
export const is_number = (n => n != null && !isNaN(n));
export const is_vector = (a => a != null && a[0] != null && !isNaN(a[0]));
export const is_iterable = obj => obj != null
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

/**
 * totally flatten, recursive
 * @returns an array, always.
 */
export const flatten_arrays = function () {
  const arr = semi_flatten_arrays(arguments);
  return arr.length > 1
    ? arr.reduce((a, b) => a.concat(b), [])
    : arr;
};

/**
 * search function arguments for a valid n-dimensional vector
 * can handle object-vector representation {x:, y:}
 *
 * @returns (number[]) vector in array form, or empty array for bad inputs
*/
export const get_vector = function () {
  // todo, incorporate constructors.vector check to all indices. and below
  if (arguments[0] instanceof Constructors.vector) { return arguments[0]; }
  let list = flatten_arrays(arguments); //.filter(a => a !== undefined);
  if (list.length > 0
    && typeof list[0] === "object"
    && list[0] !== null
    && !isNaN(list[0].x)) {
    list = ["x", "y", "z"]
      .map(c => list[0][c])
      .filter(a => a !== undefined);
  }
  return list.filter(n => typeof n === "number");
};
/**
 * search function arguments for a an array of vectors. a vector of vectors
 * can handle object-vector representation {x:, y:}
 *
 * @returns (number[]) vector in array form, or empty array for bad inputs
*/
export const get_vector_of_vectors = function () {
  return semi_flatten_arrays(arguments)
    .map(el => get_vector(el));
};

/**
 * @returns [[2,3],[10,11]]
*/
export const get_segment = function () {
  if (arguments[0] instanceof Constructors.segment) { return arguments[0]; }
  if (arguments.length === 4) {
    return [
      [arguments[0], arguments[1]],
      [arguments[2], arguments[3]]
    ];
  }
  return get_vector_of_vectors(arguments);
};

// this works for rays to interchangably except for that it will not
// typecast a line into a ray, it will stay a ray type.
export const get_line = function () {
  const args = semi_flatten_arrays(arguments);
  if (args.length === 0) { return vector_origin_form([], []); }
  if (args[0] instanceof Constructors.line
    || args[0] instanceof Constructors.ray
    || args[0] instanceof Constructors.segment) { return args[0]; }
  if (args[0].constructor === Object) {
    return vector_origin_form(args[0].vector || [], args[0].origin || []);
  }
  return typeof args[0] === "number"
    ? vector_origin_form(get_vector(args))
    : vector_origin_form(...args.map(a => get_vector(a)));
};

const identity2x2 = [1, 0, 0, 1];
const identity2x3 = [1, 0, 0, 1, 0, 0];
const identity3x3 = [1, 0, 0, 0, 1, 0, 0, 0, 1];
const identity3x4 = [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0];

const maps_3x4 = [
  [0, 1, 3, 4, 9, 10],
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
  [0, 1, 2, undefined, 3, 4, 5, undefined, 6, 7, 8, undefined, 9, 10, 11]
];
[11, 7, 3].forEach(i => delete maps_3x4[2][i]);

const matrix_map_3x4 = len => {
  let i;
  if (len < 8) i = 0;
  else if (len < 13) i = 1;
  else i = 2;
  return maps_3x4[i];
};

export const get_matrix_3x4 = function () {
  const mat = flatten_arrays(arguments);
  const matrix = [...identity3x4];
  matrix_map_3x4(mat.length)
    .filter((_, i) => mat[i] != null)
    .forEach((n, i) => { matrix[n] = mat[i]; });
  return matrix;
};

/**
 * a matrix2 is a 2x3 matrix, 2x2 with a column to represent translation
 *
 * @returns {number[]} array of 6 numbers, or undefined if bad inputs
*/
export const get_matrix2 = function () {
  const m = get_vector(arguments);
  if (m === undefined) { return undefined; }
  if (m.length === 6) { return m; }
  if (m.length > 6) { return [m[0], m[1], m[2], m[3], m[4], m[5]]; }
  if (m.length < 6) {
    return identity2x3.map((n, i) => m[i] || n);
  }
  // m doesn't have a length
  return undefined;
};
/**
 * a matrix3 is a 4x3 matrix, 3x3 orientation with a column for translation
 *
 * @returns {number[]} array of 12 numbers, or undefined if bad inputs
*/
export const get_matrix3 = function (...args) {
  const m = get_vector(args);
  if (m === undefined) { return undefined; }
  switch (m.length) {
    case 4: return [
      m[0], m[1], 0, 0,
      m[2], m[3], 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1
    ];
    case 6: return [
      m[0], m[1], 0,
      m[2], m[3], 0,
      0, 0, 1,
      m[4], m[5], 0
    ];
    case 9: return [
      m[0], m[1], m[2],
      m[3], m[4], m[5],
      m[6], m[7], m[8],
      0, 0, 0
    ];
    case 12: return m;
    // convert a 4x4 (openGL type) matrix into 3x4
    case 16: return [
      m[0], m[1], m[2],
      m[4], m[5], m[6],
      m[8], m[9], m[10],
      m[12], m[13], m[14]
    ];
    default: break;
  }
  if (m.length > 12) {
    return [
      m[0], m[1], m[2],
      m[4], m[5], m[6],
      m[8], m[9], m[10],
      m[12], m[13], m[14]
    ];
  }
  if (m.length < 12) {
    return identity3x4.map((n, i) => m[i] || n);
  }
  // m doesn't have a length
  return undefined;
};

export function get_two_vec2(...args) {
  if (args.length === 0) { return undefined; }
  if (args.length === 1 && args[0] !== undefined) {
    return get_two_vec2(...args[0]);
  }
  const params = Array.from(args);
  const numbers = params.filter(param => !isNaN(param));
  const arrays = params.filter(o => typeof o === "object")
    .filter(param => param.constructor === Array);
  if (numbers.length >= 4) {
    return [
      [numbers[0], numbers[1]],
      [numbers[2], numbers[3]],
    ];
  }
  if (arrays.length >= 2 && !isNaN(arrays[0][0])) {
    return arrays;
  }
  if (arrays.length === 1 && !isNaN(arrays[0][0][0])) {
    return arrays[0];
  }
  return undefined;
}

export function get_array_of_vec(...args) {
  if (args.length === 0) { return undefined; }
  if (args.length === 1 && args[0] !== undefined) {
    return get_array_of_vec(...args[0]);
  }
  // let params = Array.from(args);
  return Array.from(args);

  // let arrays = params.filter((param) => param.constructor === Array);
  // if (arrays.length == 1 && arrays[0].length > 0 && arrays[0][0].length > 0 && !isNaN(arrays[0][0][0])) {
  //   return arrays[0];
  // }
  // if (params[0].constructor === Object) {
  //   if (params[0].points != null) {
  //     return params[0].points;
  //   }
  // }
}


export function get_array_of_vec2() {
  // todo
  let params = Array.from(arguments);
  let arrays = params.filter((param) => param.constructor === Array);
  if (arrays.length >= 2 && !isNaN(arrays[0][0])) {
    return arrays;
  }
  if (arrays.length === 1 && arrays[0].length >= 1) {
    return arrays[0];
  }
  // if (arrays[0] != null && arrays[0].length >= 2 && arrays[0][0] != null && !isNaN(arrays[0][0][0])) {
  //  return arrays[0];
  // }
  return params;
}
