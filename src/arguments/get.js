import Constructors from "../primitives/constructors";
import { identity2x3 } from "../core/matrix2";
import { identity3x4 } from "../core/matrix3";
import { flatten_arrays, semi_flatten_arrays } from "./resize";
import { fn_not_undefined } from "./functions";
import { distance2 } from "../core/algebra";
/**
 * @returns ({ point:[], vector:[] })
*/
const vector_origin_form = (vector, origin) => ({
  vector: vector || [],
  origin: origin || []
});

/**
 * search function arguments for a valid n-dimensional vector
 * can handle object-vector representation {x:, y:}
 *
 * @returns (number[]) vector in array form, or empty array for bad inputs
*/
export const get_vector = function () {
  // todo, incorporate constructors.vector check to all indices. and below
  if (arguments[0] instanceof Constructors.vector) { return arguments[0]; }
  let list = flatten_arrays(arguments); // .filter(fn_not_undefined);
  if (list.length > 0
    && typeof list[0] === "object"
    && list[0] !== null
    && !isNaN(list[0].x)) {
    list = ["x", "y", "z"]
      .map(c => list[0][c])
      .filter(fn_not_undefined);
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
  if (arguments[0] instanceof Constructors.segment) {
    return arguments[0];
  }
  const args = semi_flatten_arrays(arguments);
  if (args.length === 4) {
    return [
      [args[0], args[1]],
      [args[2], args[3]]
    ];
  }
  return args.map(el => get_vector(el));
};

// this works for rays to interchangably except for that it will not
// typecast a line into a ray, it will stay a ray type.
export const get_line = function () {
  const args = semi_flatten_arrays(arguments);
  if (args.length === 0) { return vector_origin_form([], []); }
  if (args[0] instanceof Constructors.line
    || args[0] instanceof Constructors.ray
    || args[0] instanceof Constructors.segment) { return args[0]; }
  if (args[0].constructor === Object && args[0].vector !== undefined) {
    return vector_origin_form(args[0].vector || [], args[0].origin || []);
  }
  return typeof args[0] === "number"
    ? vector_origin_form(get_vector(args))
    : vector_origin_form(...args.map(a => get_vector(a)));
};

export const get_ray = get_line;

// export const get_line_ud = function () {
//   if (arguments.length === 0) { return { u:[], d:0 }; }
//   if (arguments[0] instanceof Constructors.line) { return args[0]; }
//   if (arguments[0].constructor === Object && arguments[0].u !== undefined) {
//     return { u: arguments[0].u || [], d: arguments[0].d || 0 };
//   }
// };

export const get_rect_params = (x = 0, y = 0, width = 0, height = 0) => ({
  x, y, width, height
});

export const get_rect = function () {
  if (arguments[0] instanceof Constructors.rect) { return arguments[0]; }
  const list = flatten_arrays(arguments); // .filter(fn_not_undefined);
  if (list.length > 0
    && typeof list[0] === "object"
    && list[0] !== null
    && !isNaN(list[0].width)) {
    return get_rect_params(...["x", "y", "width", "height"]
      .map(c => list[0][c])
      .filter(fn_not_undefined));
  }
  const numbers = list.filter(n => typeof n === "number");
  const rect_params = numbers.length < 4
    ? [, , ...numbers]
    : numbers;
  return get_rect_params(...rect_params);
};

/**
 * radius is the first parameter so that the origin can be N-dimensional
 * ...args is a list of numbers that become the origin.
 */
const get_circle_params = (radius = 1, ...args) => ({
	radius,
	origin: [...args],
});

export const get_circle = function () {
	if (arguments[0] instanceof Constructors.circle) { return arguments[0]; }
  const vectors = get_vector_of_vectors(arguments);
  const numbers = flatten_arrays(arguments).filter(a => typeof a === "number");
  if (arguments.length === 2) {
    if (vectors[1].length === 1) {
			return get_circle_params(vectors[1][0], ...vectors[0]);
    } else if (vectors[0].length === 1) {
			return get_circle_params(vectors[0][0], ...vectors[1]);
    } else if (vectors[0].length > 1 && vectors[1].length > 1) {
			return get_circle_params(distance2(...vectors), ...vectors[0]);
    }
  }
  else {
    switch (numbers.length) {
      case 0: return get_circle_params(1, 0, 0, 0);
      case 1: return get_circle_params(numbers[0], 0, 0, 0);
      default: return get_circle_params(numbers.pop(), ...numbers);
    }
  }
	return get_circle_params(1, 0, 0, 0);
};

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

/**
 * a matrix3 is a 4x3 matrix, 3x3 orientation with a column for translation
 *
 * @returns {number[]} array of 12 numbers, or undefined if bad inputs
*/
export const get_matrix_3x4 = function () {
  const mat = flatten_arrays(arguments);
  const matrix = [...identity3x4];
  matrix_map_3x4(mat.length)
    // .filter((_, i) => mat[i] != null)
    .forEach((n, i) => { if (mat[i] != null) { matrix[n] = mat[i]; } });
  return matrix;
};

/**
 * a matrix2 is a 2x3 matrix, 2x2 with a column to represent translation
 *
 * @returns {number[]} array of 6 numbers, or undefined if bad inputs
*/
// export const get_matrix2 = function () {
//   const m = get_vector(arguments);
//   if (m.length === 6) { return m; }
//   if (m.length > 6) { return [m[0], m[1], m[2], m[3], m[4], m[5]]; }
//   if (m.length < 6) {
//     return identity2x3.map((n, i) => m[i] || n);
//   }
// };
