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

export const multiply_vector4_matrix4 = function (v, m) {
  const result = [];
  result[0] = m[0] * v[0] + m[1] * v[1] + m[2] * v[2] + m[3] * v[3];
  result[1] = m[4] * v[0] + m[5] * v[1] + m[6] * v[2] + m[7] * v[3];
  result[2] = m[8] * v[0] + m[9] * v[1] + m[10] * v[2] + m[11] * v[3];
  result[3] = m[12] * v[0] + m[13] * v[1] + m[14] * v[2] + m[15] * v[3];
  return result;
};

export const make_matrix4_scale = function (ratio, origin = [0, 0, 0]) {
  const tx = ratio * -origin[0] + origin[0];
  const ty = ratio * -origin[1] + origin[1];
  const tz = ratio * -origin[2] + origin[2];
  return [ratio, 0, 0, 0, 0, ratio, 0, 0, 0, 0, ratio, 0, tx, ty, tz, 1];
};
export const make_matrix4_inverse = function (m) {
  const inv = [];
  inv[0] = m[5] * m[10] * m[15] - m[5] * m[11] * m[14] - m[9] * m[6] * m[15]
    + m[9] * m[7] * m[14] + m[13] * m[6] * m[11] - m[13] * m[7] * m[10];
  inv[4] = -m[4] * m[10] * m[15] + m[4] * m[11] * m[14] + m[8] * m[6] * m[15]
    - m[8] * m[7] * m[14] - m[12] * m[6] * m[11] + m[12] * m[7] * m[10];
  inv[8] = m[4] * m[9] * m[15] - m[4] * m[11] * m[13] - m[8] * m[5] * m[15]
    + m[8] * m[7] * m[13] + m[12] * m[5] * m[11] - m[12] * m[7] * m[9];
  inv[12] = -m[4] * m[9] * m[14] + m[4] * m[10] * m[13] + m[8] * m[5] * m[14]
    - m[8] * m[6] * m[13] - m[12] * m[5] * m[10] + m[12] * m[6] * m[9];
  inv[1] = -m[1] * m[10] * m[15] + m[1] * m[11] * m[14] + m[9] * m[2] * m[15]
    - m[9] * m[3] * m[14] - m[13] * m[2] * m[11] + m[13] * m[3] * m[10];
  inv[5] = m[0] * m[10] * m[15] - m[0] * m[11] * m[14] - m[8] * m[2] * m[15]
    + m[8] * m[3] * m[14] + m[12] * m[2] * m[11] - m[12] * m[3] * m[10];
  inv[9] = -m[0] * m[9] * m[15] + m[0] * m[11] * m[13] + m[8] * m[1] * m[15]
    - m[8] * m[3] * m[13] - m[12] * m[1] * m[11] + m[12] * m[3] * m[9];
  inv[13] = m[0] * m[9] * m[14] - m[0] * m[10] * m[13] - m[8] * m[1] * m[14]
    + m[8] * m[2] * m[13] + m[12] * m[1] * m[10] - m[12] * m[2] * m[9];
  inv[2] = m[1] * m[6] * m[15] - m[1] * m[7] * m[14] - m[5] * m[2] * m[15]
    + m[5] * m[3] * m[14] + m[13] * m[2] * m[7] - m[13] * m[3] * m[6];
  inv[6] = -m[0] * m[6] * m[15] + m[0] * m[7] * m[14] + m[4] * m[2] * m[15]
    - m[4] * m[3] * m[14] - m[12] * m[2] * m[7] + m[12] * m[3] * m[6];
  inv[10] = m[0] * m[5] * m[15] - m[0] * m[7] * m[13] - m[4] * m[1] * m[15]
    + m[4] * m[3] * m[13] + m[12] * m[1] * m[7] - m[12] * m[3] * m[5];
  inv[14] = -m[0] * m[5] * m[14] + m[0] * m[6] * m[13] + m[4] * m[1] * m[14]
    - m[4] * m[2] * m[13] - m[12] * m[1] * m[6] + m[12] * m[2] * m[5];
  inv[3] = -m[1] * m[6] * m[11] + m[1] * m[7] * m[10] + m[5] * m[2] * m[11]
    - m[5] * m[3] * m[10] - m[9] * m[2] * m[7] + m[9] * m[3] * m[6];
  inv[7] = m[0] * m[6] * m[11] - m[0] * m[7] * m[10] - m[4] * m[2] * m[11]
    + m[4] * m[3] * m[10] + m[8] * m[2] * m[7] - m[8] * m[3] * m[6];
  inv[11] = -m[0] * m[5] * m[11] + m[0] * m[7] * m[9] + m[4] * m[1] * m[11]
    - m[4] * m[3] * m[9] - m[8] * m[1] * m[7] + m[8] * m[3] * m[5];
  inv[15] = m[0] * m[5] * m[10] - m[0] * m[6] * m[9] - m[4] * m[1] * m[10]
    + m[4] * m[2] * m[9] + m[8] * m[1] * m[6] - m[8] * m[2] * m[5];
  const det = m[0] * inv[0] + m[1] * inv[4] + m[2] * inv[8] + m[3] * inv[12];
  if (det < 1e-6 && det > -1e-6) {
    return undefined;
  }
  const inverseDeterminant = 1.0 / det;
  return inv.map(n => n * inverseDeterminant);
};

export const transpose_matrix4 = function (m) {
  return [
    m[0], m[4], m[8], m[12],
    m[1], m[5], m[9], m[13],
    m[2], m[6], m[10], m[14],
    m[3], m[7], m[11], m[15]
  ];
};

export const multiply_matrices4 = function (a, b) {
  return [
    a[0] * b[0] + a[1] * b[4] + a[2] * b[8] + a[3] * b[12],
    a[0] * b[1] + a[1] * b[5] + a[2] * b[9] + a[3] * b[13],
    a[0] * b[2] + a[1] * b[6] + a[2] * b[10] + a[3] * b[14],
    a[0] * b[3] + a[1] * b[7] + a[2] * b[11] + a[3] * b[15],
    a[4] * b[0] + a[5] * b[4] + a[6] * b[8] + a[7] * b[12],
    a[4] * b[1] + a[5] * b[5] + a[6] * b[9] + a[7] * b[13],
    a[4] * b[2] + a[5] * b[6] + a[6] * b[10] + a[7] * b[14],
    a[4] * b[3] + a[5] * b[7] + a[6] * b[11] + a[7] * b[15],
    a[8] * b[0] + a[9] * b[4] + a[10] * b[8] + a[11] * b[12],
    a[8] * b[1] + a[9] * b[5] + a[10] * b[9] + a[11] * b[13],
    a[8] * b[2] + a[9] * b[6] + a[10] * b[10] + a[11] * b[14],
    a[8] * b[3] + a[9] * b[7] + a[10] * b[11] + a[11] * b[15],
    a[12] * b[0] + a[13] * b[4] + a[14] * b[8] + a[15] * b[12],
    a[12] * b[1] + a[13] * b[5] + a[14] * b[9] + a[15] * b[13],
    a[12] * b[2] + a[13] * b[6] + a[14] * b[10] + a[15] * b[14],
    a[12] * b[3] + a[13] * b[7] + a[14] * b[11] + a[15] * b[15]
  ];
};
