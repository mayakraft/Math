export const identity2x2 = [1, 0, 0, 1];
export const identity2x3 = identity2x2.concat(0, 0);

/**
 * @param {number[]} vector, in array form
 * @param {number[]} matrix, in array form
 * @returns {number[]} vector, the input vector transformed by the matrix
 */
export const multiply_matrix2_vector2 = (matrix, vector) => [
  matrix[0] * vector[0] + matrix[2] * vector[1] + matrix[4],
  matrix[1] * vector[0] + matrix[3] * vector[1] + matrix[5]
];
/**
 * @param line in point-vector form, matrix
 * @returns transformed line in point-vector form
 */
export const multiply_matrix2_line2 = (matrix, vector, origin) => ({
  vector: [
    matrix[0] * vector[0] + matrix[2] * vector[1],
    matrix[1] * vector[0] + matrix[3] * vector[1]
  ],
  origin: [
    matrix[0] * origin[0] + matrix[2] * origin[1] + matrix[4],
    matrix[1] * origin[0] + matrix[3] * origin[1] + matrix[5]
  ],
});
/**
 * @param {number[]} matrix, matrix, left/right order matches what you'd see on a page.
 * @returns {number[]} matrix
 */
export const multiply_matrices2 = (m1, m2) => [
  m1[0] * m2[0] + m1[2] * m2[1],
  m1[1] * m2[0] + m1[3] * m2[1],
  m1[0] * m2[2] + m1[2] * m2[3],
  m1[1] * m2[2] + m1[3] * m2[3],
  m1[0] * m2[4] + m1[2] * m2[5] + m1[4],
  m1[1] * m2[4] + m1[3] * m2[5] + m1[5]
];

export const determinant2 = m => m[0] * m[3] - m[1] * m[2];

/**
 * @param {number[]} matrix
 * @returns {number[]} matrix
 */
export const invert_matrix2 = (m) => {
  const det = determinant2(m);
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
export const make_matrix2_translate = (x = 0, y = 0) => identity2x2.concat(x, y);
/**
 * @param ratio of scale, optional origin homothetic center (0,0 default)
 * @returns {number[]} matrix
 */
export const make_matrix2_scale = (x, y, origin = [0, 0]) => [
  x,
  0,
  0,
  y,
  x * -origin[0] + origin[0],
  y * -origin[1] + origin[1]
];
/**
 * @param angle of rotation, origin of transformation
 * @returns {number[]} matrix
 */
export const make_matrix2_rotate = (angle, origin = [0, 0]) => {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  return [
    cos,
    sin,
    -sin,
    cos,
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
export const make_matrix2_reflection = (vector, origin = [0, 0]) => {
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

//               __                                           _
//   _________  / /_  ______ ___  ____     ____ ___  ____ _  (_)___  _____
//  / ___/ __ \/ / / / / __ `__ \/ __ \   / __ `__ \/ __ `/ / / __ \/ ___/
// / /__/ /_/ / / /_/ / / / / / / / / /  / / / / / / /_/ / / / /_/ / /
// \___/\____/_/\__,_/_/ /_/ /_/_/ /_/  /_/ /_/ /_/\__,_/_/ /\____/_/
//                                                     /___/
