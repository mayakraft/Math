/**
 * @param {number[]} vector, in array form
 * @param {number[]} matrix, in array form
 * @returns {number[]} vector, the input vector transformed by the matrix
 */
export const multiply_matrix2_vector2 = function (matrix, vector) {
  return [
    matrix[0] * vector[0] + matrix[2] * vector[1] + matrix[4],
    matrix[1] * vector[0] + matrix[3] * vector[1] + matrix[5]
  ];
};
/**
 * @param line in point-vector form, matrix
 * @returns transformed line in point-vector form
 */
export const multiply_matrix2_line2 = function (matrix, origin, vector) {
  return {
    origin: [
      matrix[0] * origin[0] + matrix[2] * origin[1] + matrix[4],
      matrix[1] * origin[0] + matrix[3] * origin[1] + matrix[5]
    ],
    vector: [
      matrix[0] * vector[0] + matrix[2] * vector[1],
      matrix[1] * vector[0] + matrix[3] * vector[1]
    ]
  };
};
// const new_origin = multiply_matrix2_vector2(matrix, origin);
// const vec_translated = vector.map((_, i) => vector[i] + origin[i]);
// const new_vector = multiply_matrix2_vector2(matrix, vec_translated)
//   .map((vec, i) => vec - new_origin[i]);
//
// multiply_matrix2_vector2(matrix, origin)
// [ m1a m1c m1x ] [ ox ]
// [ m1b m1d m1y ] [ oy ]
// result (new_origin)
// [ ox * m1a + oy * m1c + m1x ]
// [ ox * m1b + oy * m1d + m1y ]
// multiply_matrix2_vector2(matrix, vector + origin)
// [ m1a m1c m1x ] [ ox + vx ]
// [ m1b m1d m1y ] [ oy + vy ]
// result (vec_translated)
// [ (ox+vx) * m1a + (oy+vy) * m1c + m1x ]
// [ (ox+vx) * m1b + (oy+vy) * m1d + m1y ]
// vec_translated - new_origin
// [ (ox+vx) * m1a + (oy+vy) * m1c + m1x ] - [ ox * m1a + oy * m1c + m1x ]
// [ (ox+vx) * m1b + (oy+vy) * m1d + m1y ]   [ ox * m1b + oy * m1d + m1y ]
// result
// [ (ox+vx) * m1a - ox * m1a + (oy+vy) * m1c - oy * m1c + m1x - m1x ]
// [ (ox+vx) * m1b - ox * m1b + (oy+vy) * m1d - oy * m1d + m1y - m1y ]
//
// [ m1a * ((ox+vx) - ox) + m1c * ((oy+vy) - oy) ]
// [ m1b * ((ox+vx) - ox) + m1d * ((oy+vy) - oy) ]
//
// [ m1a * vx + m1c * vy ]
// [ m1b * vx + m1d * vy ]

/**
 * @param {number[]} matrix, matrix, left/right order matches what you'd see on a page.
 * @returns {number[]} matrix
 */
export const multiply_matrices2 = function (m1, m2) {
  return [
    m1[0] * m2[0] + m1[2] * m2[1],
    m1[1] * m2[0] + m1[3] * m2[1],
    m1[0] * m2[2] + m1[2] * m2[3],
    m1[1] * m2[2] + m1[3] * m2[3],
    m1[0] * m2[4] + m1[2] * m2[5] + m1[4],
    m1[1] * m2[4] + m1[3] * m2[5] + m1[5]
  ];
};

export const matrix2_determinant = function (m) {
  return m[0] * m[3] - m[1] * m[2];
};

/**
 * @param {number[]} matrix
 * @returns {number[]} matrix
 */
export const invert_matrix2 = function (m) {
  const det = matrix2_determinant(m);
  if (Math.abs(det) < 1e-6 || isNaN(det) || !isFinite(m[4]) || !isFinite(m[5])) {
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

/**
 * @param {number} x, y
 * @returns {number[]} matrix
 */
export const make_matrix2_translation = function (x, y) {
  return [1, 0, 0, 1, x, y];
};
/**
 * @param ratio of scale, optional origin homothetic center (0,0 default)
 * @returns {number[]} matrix
 */
export const make_matrix2_scale = function (ratio, origin = [0, 0]) {
  return [
    ratio,
    0,
    0,
    ratio,
    ratio * -origin[0] + origin[0],
    ratio * -origin[1] + origin[1]
  ];
};
/**
 * @param angle of rotation, origin of transformation
 * @returns {number[]} matrix
 */
export const make_matrix2_rotation = function (angle, origin = [0, 0]) {
  const a = Math.cos(angle);
  const b = Math.sin(angle);
  return [
    a,
    b,
    -b,
    a,
    origin[0],
    origin[1]
  ];
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

//               __                                           _
//   _________  / /_  ______ ___  ____     ____ ___  ____ _  (_)___  _____
//  / ___/ __ \/ / / / / __ `__ \/ __ \   / __ `__ \/ __ `/ / / __ \/ ___/
// / /__/ /_/ / / /_/ / / / / / / / / /  / / / / / / /_/ / / / /_/ / /
// \___/\____/_/\__,_/_/ /_/ /_/_/ /_/  /_/ /_/ /_/\__,_/_/ /\____/_/
//                                                     /___/
