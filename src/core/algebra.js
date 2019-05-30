// all points are array syntax [x,y]
// all edges are array syntax [[x,y], [x,y]]
// all infinite lines are defined as point and vector, both [x,y]
// all polygons are an ordered set of points ([x,y]), either winding direction

// ////////////////////////////////////////////////////////////////////////////
// the following operations neatly generalize for n-dimensions

/**
 * @param [number]
 * @returns number
 */
export const magnitude = function (v) {
  const sum = v
    .map(component => component * component)
    .reduce((prev, curr) => prev + curr, 0);
  return Math.sqrt(sum);
};

/**
 * @param [number]
 * @returns [number]
 */
export const normalize = function (v) {
  const m = magnitude(v);
  // todo: should this catch divide by 0?
  return v.map(c => c / m);
};

/**
 * these *can* generalize to n-dimensions, but lengths of arguments must match.
 * the first element's dimension implies every other elements'.
 */

export const dot = function (a, b) {
  return a
    .map((_, i) => a[i] * b[i])
    .reduce((prev, curr) => prev + curr, 0);
};

// use "average". it generalizes for any number of arguments
export const midpoint = function (a, b) {
  return a.map((_, i) => (a[i] + b[i]) / 2);
};

// todo rewrite --->
// midpoint for n-number of arguments
export const average = function (...args) {
  const vectors = args;
  const dimension = (vectors.length > 0) ? vectors[0].length : 0;
  const initial = Array.from(Array(dimension)).map(() => 0);
  return vectors
    .reduce((a, b) => a
      .map((_, i) => a[i] + b[i]), initial)
    .map(c => c / vectors.length);
};

// /////////////////////////////////////////////////////////////////////////////
// everything else that follows is hard coded to a certain dimension
//

/** apply a matrix transform on a point */
export const multiply_vector2_matrix2 = function (vector, matrix) {
  return [
    vector[0] * matrix[0] + vector[1] * matrix[2] + matrix[4],
    vector[0] * matrix[1] + vector[1] * matrix[3] + matrix[5],
  ];
};

/**
 * apply a matrix transform on a line, defined by point, vector
 * returns a line as arrays inside a 2-array: [point, vector]
 */
export const multiply_line_matrix2 = function (point, vector, matrix) {
  const new_point = multiply_vector2_matrix2(point, matrix);
  const vec_point = vector.map((_, i) => vector[i] + point[i]);
  const new_vector = multiply_vector2_matrix2(vec_point, matrix)
    .map((vec, i) => vec - new_point[i]);
  return [new_point, new_vector];
};

export const make_matrix2_reflection = function (vector, origin) {
  // the line of reflection passes through origin, runs along vector
  const angle = Math.atan2(vector[1], vector[0]);
  const cosAngle = Math.cos(angle);
  const sinAngle = Math.sin(angle);
  const cos_Angle = Math.cos(-angle);
  const sin_Angle = Math.sin(-angle);
  const a = cosAngle * cos_Angle + sinAngle * sin_Angle;
  const b = cosAngle * -sin_Angle + sinAngle * cos_Angle;
  const c = sinAngle * cos_Angle + -cosAngle * sin_Angle;
  const d = sinAngle * -sin_Angle + -cosAngle * cos_Angle;
  const tx = origin[0] + a * -origin[0] + -origin[1] * c;
  const ty = origin[1] + b * -origin[0] + -origin[1] * d;
  return [a, b, c, d, tx, ty];
};

export const make_matrix2_rotation = function (angle, origin) {
  const a = Math.cos(angle);
  const b = Math.sin(angle);
  const c = -Math.sin(angle);
  const d = Math.cos(angle);
  const tx = (origin != null) ? origin[0] : 0;
  const ty = (origin != null) ? origin[1] : 0;
  return [a, b, c, d, tx, ty];
};

export const make_matrix2_inverse = function (m) {
  const det = m[0] * m[3] - m[1] * m[2];
  if (!det || isNaN(det) || !isFinite(m[4]) || !isFinite(m[5])) { return undefined; }
  return [
    m[3] / det,
    -m[1] / det,
    -m[2] / det,
    m[0] / det,
    (m[2] * m[5] - m[3] * m[4]) / det,
    (m[1] * m[4] - m[0] * m[5]) / det,
  ];
};

export const multiply_matrices2 = function (m1, m2) {
  const a = m1[0] * m2[0] + m1[2] * m2[1];
  const c = m1[0] * m2[2] + m1[2] * m2[3];
  const tx = m1[0] * m2[4] + m1[2] * m2[5] + m1[4];
  const b = m1[1] * m2[0] + m1[3] * m2[1];
  const d = m1[1] * m2[2] + m1[3] * m2[3];
  const ty = m1[1] * m2[4] + m1[3] * m2[5] + m1[5];
  return [a, b, c, d, tx, ty];
};

export const cross2 = function (a, b) {
  return [a[0] * b[1], a[1] * b[0]];
};

export const cross3 = function (a, b) {
  return [
    a[1] * b[2] - a[2] * b[1],
    a[0] * b[2] - a[2] * b[0],
    a[0] * b[1] - a[1] * b[0],
  ];
};

export const distance2 = function (a, b) {
  const c = a[0] - b[0];
  const d = a[1] - b[1];
  return Math.sqrt((c * c) + (d * d));
};

export const distance3 = function (a, b) {
  const c = a[0] - b[0];
  const d = a[1] - b[1];
  const e = a[2] - b[2];
  return Math.sqrt((c * c) + (d * d) + (e * e));
};

// need to test:
// do two polygons overlap if they share a point in common? share an edge?
