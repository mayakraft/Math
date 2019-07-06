/**
 * @param {number[]} vector, in array form
 * @param {number[]} matrix, in array form
 * @returns {number[]} vector, the input vector transformed by the matrix
 */
export const multiply_vector2_matrix2 = function (vector, matrix) {
  return [
    vector[0] * matrix[0] + vector[1] * matrix[2] + matrix[4],
    vector[0] * matrix[1] + vector[1] * matrix[3] + matrix[5]
  ];
};
/**
 * @param line in point-vector form, matrix
 * @returns transformed line in point-vector form
 */
export const multiply_line_matrix2 = function (point, vector, matrix) {
  const new_point = multiply_vector2_matrix2(point, matrix);
  const vec_point = vector.map((_, i) => vector[i] + point[i]);
  const new_vector = multiply_vector2_matrix2(vec_point, matrix)
    .map((vec, i) => vec - new_point[i]);
  return [new_point, new_vector];
};
/**
 * @param two matrices
 * @returns matrix
 */
export const multiply_matrices2 = function (m1, m2) {
  const a = m1[0] * m2[0] + m1[2] * m2[1];
  const c = m1[0] * m2[2] + m1[2] * m2[3];
  const tx = m1[0] * m2[4] + m1[2] * m2[5] + m1[4];
  const b = m1[1] * m2[0] + m1[3] * m2[1];
  const d = m1[1] * m2[2] + m1[3] * m2[3];
  const ty = m1[1] * m2[4] + m1[3] * m2[5] + m1[5];
  return [a, b, c, d, tx, ty];
};
/** arguments should be comma-separated list of numbers, top-level */
export const make_matrix2_translation = function (x, y) {
  return [1, 0, 0, 1, x, y];
};
/**
 * @param ratio of scale, optional origin homothetic center (0,0 default)
 * @returns matrix
 */
export const make_matrix2_scale = function (ratio, origin = [0, 0]) {
  const tx = ratio * -origin[0] + origin[0];
  const ty = ratio * -origin[1] + origin[1];
  return [ratio, 0, 0, ratio, tx, ty];
};
/**
 * @param angle of rotation, origin of transformation
 * @returns matrix
 */
export const make_matrix2_rotation = function (angle, origin = [0, 0]) {
  const a = Math.cos(angle);
  const b = Math.sin(angle);
  const c = -b;
  const d = a;
  const tx = origin[0];
  const ty = origin[1];
  return [a, b, c, d, tx, ty];
};
/**
 * remember vector comes before origin. origin comes last, so that it's easy
 * to leave it empty and make a reflection through the origin.
 * @param line in vector-origin form
 * @returns matrix
 */
export const make_matrix2_reflection = function (vector, origin) {
  // origin is optional
  const origin_x = origin && origin[0] ? origin[0] : 0;
  const origin_y = origin && origin[1] ? origin[1] : 0;
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
  const tx = origin_x + a * -origin_x + -origin_y * c;
  const ty = origin_y + b * -origin_x + -origin_y * d;
  return [a, b, c, d, tx, ty];
};
/**
 * @param matrix
 * @returns matrix
 */
export const make_matrix2_inverse = function (m) {
  const det = m[0] * m[3] - m[1] * m[2];
  if (!det || isNaN(det) || !isFinite(m[4]) || !isFinite(m[5])) {
    return undefined;
  }
  return [
    m[3] / det,
    -m[1] / det,
    -m[2] / det,
    m[0] / det,
    (m[2] * m[5] - m[3] * m[4]) / det,
    (m[1] * m[4] - m[0] * m[5]) / det
  ];
};
