/**
 * one way to improve these input finders is to search in all indices
 * of the arguments list, right now it assumes THIS is the only thing
 * you're passing in. in the case that it isn't and there's an object
 * in the first slot, it won't find the valid data in the second.
 */

const is_iterable = obj => obj != null
  && typeof obj[Symbol.iterator] === "function";

/**
 * totally flatten, recursive
 * @returns an array, always.
 */
export const flatten_input = function (...args) {
  switch (args.length) {
    case undefined:
    case 0: return args;
    case 1: return is_iterable(args[0])
      ? flatten_input(...args[0])
      : [args[0]];
    default:
      return Array.from(args)
        .map(a => (is_iterable(a)
          ? [...flatten_input(a)]
          : a))
        .reduce((a, b) => a.concat(b), []);
  }
};

/**
 * flatten only until the point of comma separated entities. iterative
 * @returns always an array
 */
export const semi_flatten_input = function (...args) {
  let list = args;
  while (list.length === 1 && list[0].length) { [list] = list; }
  return list;
};

/**
 * this searches user-provided inputs for a valid n-dimensional vector
 * which includes objects {x:, y:}, arrays [x,y], or sequences of numbers
 *
 * @returns (number[]) array of number components
 *   invalid/no input returns an emptry array
*/
export const get_vector = function (...args) {
  let list = flatten_input(args);
  // let list = semi_flatten_input(args);
  if (!isNaN(list[0].x)) {
    list = ["x", "y", "z"].map(c => list[0][c]).filter(a => a !== undefined);
  }
  // console.log("going to break", list);
  return list.filter(n => typeof n === "number");
};

export const get_vector_of_vectors = function (...args) {
  // console.log("get vector of vectors", args);
  return semi_flatten_input(args)
    .map(el => get_vector(el));
};


const identity = [1, 0, 0, 1, 0, 0];
/**
 * @returns (number[]) array of number components
 *  invalid/no input returns the identity matrix
*/
export const get_matrix2 = function (...args) {
  const m = get_vector(args);
  if (m.length === 6) { return m; }
  if (m.length > 6) { return [m[0], m[1], m[3], m[4], m[5], m[6]]; }
  if (m.length < 6) {
    return identity.map((n, i) => m[i] || n);
  }
  // m doesn't have a length
  return undefined;
};

/**
 * @returns [[2,3],[10,11]]
*/
export function get_edge(...args) {
  return get_vector_of_vectors(args);
}

/**
 * @returns ({ point:[], vector:[] })
*/
export function get_line() {
  let params = Array.from(arguments);
  let numbers = params.filter((param) => !isNaN(param));
  let arrays = params.filter((param) => param.constructor === Array);
  if (params.length == 0) { return {vector: [], point: []}; }
  if (!isNaN(params[0]) && numbers.length >= 4) {
    return {
      point: [params[0], params[1]],
      vector: [params[2], params[3]]
    };
  }
  if (arrays.length > 0) {
    if (arrays.length === 1) {
      return get_line(...arrays[0]);
    }
    if (arrays.length === 2) {
      return {
        point: [arrays[0][0], arrays[0][1]],
        vector: [arrays[1][0], arrays[1][1]]
      };
    }
    if (arrays.length === 4) {
      return {
        point: [arrays[0], arrays[1]],
        vector: [arrays[2], arrays[3]]
      };
    }
  }
  if (params[0].constructor === Object) {
    let vector = [], point = [];
    if (params[0].vector != null)         { vector = get_vector(params[0].vector); }
    else if (params[0].direction != null) { vector = get_vector(params[0].direction); }
    if (params[0].point != null)       { point = get_vector(params[0].point); }
    else if (params[0].origin != null) { point = get_vector(params[0].origin); }
    return {point, vector};
  }
  return {point: [], vector: []};
}

export function get_ray() {
  return get_line(...arguments);
}

export function get_two_vec2(...args) {
  if (args.length === 0) { return undefined; }
  if (args.length === 1 && args[0] !== undefined) {
    return get_two_vec2(...args[0]);
  }
  const params = Array.from(args);
  const numbers = params.filter((param) => !isNaN(param));
  const arrays = params.filter((param) => param.constructor === Array);
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
