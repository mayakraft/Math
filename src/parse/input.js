/**
 * this searches user-provided inputs for a valid n-dimensional vector
 * which includes objects {x:, y:}, arrays [x,y], or sequences of numbers
 *
 * @returns (number[]) array of number components
 *   invalid/no input returns an emptry array
*/
export const get_vector = function (...args) {
  if (args.length === 0) { return undefined; }
  if (args.length === 1 && args[0] !== undefined) {
    return get_vector(...args[0]);
  }
  // NaN still passes test
  if (typeof args[0] === "number") { return Array.from(args); }
  // list of numbers 1, 2, 3, 4, 5
  // todo, speed test these 2
  // extra safe
  //   return Array.from(args).filter(param => !isNaN(param));
  // }
  // object with a vector component: {vector:[1,2,3]}
  if (args[0].vector !== undefined) { return get_vector(args[0].vector); }
  if (!isNaN(args[0].x)) {
    return ["x", "y", "z"].map(c => args[0][c]).filter(a => a != null);
  }
  // now things are less certain...
  // if (typeof args[0] === "object") {
  return get_vector(...args[0]);
  // }
  // const arrays = params.filter(param => param.constructor === Array);
};


/**
 * @returns (number[]) array of number components
 *  invalid/no input returns the identity matrix
*/
export function get_matrix2() {
  let params = Array.from(arguments);
  let numbers = params.filter((param) => !isNaN(param));
  let arrays = params.filter((param) => param.constructor === Array);
  if (params.length == 0) { return [1,0,0,1,0,0]; }
  if (params[0].m != null && params[0].m.constructor == Array) {
    numbers = params[0].m.slice(); // Matrix type
  }
  if (numbers.length == 0 && arrays.length >= 1) { numbers = arrays[0]; }
  if (numbers.length >= 6) { return numbers.slice(0,6); }
  else if (numbers.length >= 4) {
    let m = numbers.slice(0,4);
    m[4] = 0;
    m[5] = 0;
    return m;
  }
  return [1, 0, 0, 1, 0, 0];
}

/**
 * @returns [[2,3],[10,11]]
*/
export function get_edge() {
  let params = Array.from(arguments).filter(p => p != null);
  let numbers = params.filter((param) => !isNaN(param));
  let arrays = params.filter((param) => param.constructor === Array);
  if (params.length === 0) { return undefined; }
  if (!isNaN(params[0]) && numbers.length >= 4) {
    return [
      [params[0], params[1]],
      [params[2], params[3]]
    ];
  }
  if (arrays.length > 0) {
    if (arrays.length === 2) {
      return [
        [arrays[0][0], arrays[0][1]],
        [arrays[1][0], arrays[1][1]]
      ];
    }
    else if (arrays.length === 4) {
      return [
        [arrays[0], arrays[1]],
        [arrays[2], arrays[3]]
      ];
    }
    else { return get_edge(...arrays[0]); }
  }
  if (params[0].constructor === Object) {
    if(params[0].points.length > 0) {
      return params[0].points;
    }
  }
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
  console.log(Array.from(args));
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
  if (arrays.length == 1 && arrays[0].length >= 1) {
    return arrays[0];
  }
  // if (arrays[0] != null && arrays[0].length >= 2 && arrays[0][0] != null && !isNaN(arrays[0][0][0])) {
  //  return arrays[0];
  // }
  return params;
}

// unused
export function is_number(n) {
  return n != null && !isNaN(n);
}