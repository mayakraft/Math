/**
 * 3x4 matrix methods. the fourth column is a translation vector
 * these methods depend on arrays of 12 items, 3x3 matrices won't work.
 */

import { EPSILON } from "./equal";
import { normalize } from "./algebra";

export const identity3x3 = [1, 0, 0, 0, 1, 0, 0, 0, 1];
export const identity3x4 = identity3x3.concat(0, 0, 0);
/**
 * @param {number[]} is a 3x4 matrix the identity matrix
 * with a translation component of 0, 0, 0
 * @returns boolean
 */
export const is_identity3x4 = m => identity3x4
  .map((n, i) => Math.abs(n - m[i]) < EPSILON)
  .reduce((a, b) => a && b, true);
/**
 * @param {number[]} vector, in array form
 * @param {number[]} matrix, in array frotateorm
 * @returns {number[]} vector, the input vector transformed by the matrix
 */
export const multiply_matrix3_vector3 = (m, vector) => [
  m[0] * vector[0] + m[3] * vector[1] + m[6] * vector[2] + m[9],
  m[1] * vector[0] + m[4] * vector[1] + m[7] * vector[2] + m[10],
  m[2] * vector[0] + m[5] * vector[1] + m[8] * vector[2] + m[11]
];
/**
 * @param line in point-vector form, matrix
 * @returns transformed line in point-vector form
 */
export const multiply_matrix3_line3 = (m, vector, origin) => ({
  vector: [
    m[0] * vector[0] + m[3] * vector[1] + m[6] * vector[2],
    m[1] * vector[0] + m[4] * vector[1] + m[7] * vector[2],
    m[2] * vector[0] + m[5] * vector[1] + m[8] * vector[2]
  ],
  origin: [
    m[0] * origin[0] + m[3] * origin[1] + m[6] * origin[2] + m[9],
    m[1] * origin[0] + m[4] * origin[1] + m[7] * origin[2] + m[10],
    m[2] * origin[0] + m[5] * origin[1] + m[8] * origin[2] + m[11]
  ],
});

export const multiply_matrices3 = (m1, m2) => [
  m1[0] * m2[0] + m1[3] * m2[1] + m1[6] * m2[2],
  m1[1] * m2[0] + m1[4] * m2[1] + m1[7] * m2[2],
  m1[2] * m2[0] + m1[5] * m2[1] + m1[8] * m2[2],
  m1[0] * m2[3] + m1[3] * m2[4] + m1[6] * m2[5],
  m1[1] * m2[3] + m1[4] * m2[4] + m1[7] * m2[5],
  m1[2] * m2[3] + m1[5] * m2[4] + m1[8] * m2[5],
  m1[0] * m2[6] + m1[3] * m2[7] + m1[6] * m2[8],
  m1[1] * m2[6] + m1[4] * m2[7] + m1[7] * m2[8],
  m1[2] * m2[6] + m1[5] * m2[7] + m1[8] * m2[8],
  m1[0] * m2[9] + m1[3] * m2[10] + m1[6] * m2[11] + m1[9],
  m1[1] * m2[9] + m1[4] * m2[10] + m1[7] * m2[11] + m1[10],
  m1[2] * m2[9] + m1[5] * m2[10] + m1[8] * m2[11] + m1[11]
];

export const determinant3 = m => (
    m[0] * m[4] * m[8]
  - m[0] * m[7] * m[5]
  - m[3] * m[1] * m[8]
  + m[3] * m[7] * m[2]
  + m[6] * m[1] * m[5]
  - m[6] * m[4] * m[2]
);
/**
 * @param matrix
 * @returns matrix
 */
export const invert_matrix3 = (m) => {
  const det = determinant3(m);
  if (Math.abs(det) < 1e-6 || isNaN(det)
    || !isFinite(m[9]) || !isFinite(m[10]) || !isFinite(m[11])) {
    return undefined;
  }
  const inv = [
    m[4] * m[8] - m[7] * m[5],
    -m[1] * m[8] + m[7] * m[2],
    m[1] * m[5] - m[4] * m[2],
    -m[3] * m[8] + m[6] * m[5],
    m[0] * m[8] - m[6] * m[2],
    -m[0] * m[5] + m[3] * m[2],
    m[3] * m[7] - m[6] * m[4],
    -m[0] * m[7] + m[6] * m[1],
    m[0] * m[4] - m[3] * m[1],
    -m[3] * m[7] * m[11] + m[3] * m[8] * m[10] + m[6] * m[4] * m[11]
      - m[6] * m[5] * m[10] - m[9] * m[4] * m[8] + m[9] * m[5] * m[7],
    m[0] * m[7] * m[11] - m[0] * m[8] * m[10] - m[6] * m[1] * m[11]
      + m[6] * m[2] * m[10] + m[9] * m[1] * m[8] - m[9] * m[2] * m[7],
    -m[0] * m[4] * m[11] + m[0] * m[5] * m[10] + m[3] * m[1] * m[11]
      - m[3] * m[2] * m[10] - m[9] * m[1] * m[5] + m[9] * m[2] * m[4]
  ];
  const invDet = 1.0 / det;
  return inv.map(n => n * invDet);
};

export const make_matrix3_translate = (x = 0, y = 0, z = 0) => identity3x3.concat(x, y, z);

// i0 and i1 direct which columns and rows are filled
// sgn manages right hand rule
const single_axis_rotate = (angle, origin, i0, i1, sgn) => {
  const mat = identity3x3.concat([0, 1, 2].map(i => origin[i] || 0));
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  mat[i0*3 + i0] = cos;
  mat[i0*3 + i1] = (sgn ? +1 : -1) * sin;
  mat[i1*3 + i0] = (sgn ? -1 : +1) * sin;
  mat[i1*3 + i1] = cos;
  return mat;
};

export const make_matrix3_rotateX = (angle, origin = [0, 0, 0]) => single_axis_rotate(angle, origin, 1, 2, true);
export const make_matrix3_rotateY = (angle, origin = [0, 0, 0]) => single_axis_rotate(angle, origin, 0, 2, false);
export const make_matrix3_rotateZ = (angle, origin = [0, 0, 0]) => single_axis_rotate(angle, origin, 0, 1, true);
export const make_matrix3_rotate = (angle, vector = [0, 0, 1], origin = [0, 0, 0]) => {
  // normalize inputs
  const vec = normalize(vector);
  const pos = [0, 1, 2].map(i => origin[i] || 0);
  const [a, b, c] = vec;
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  const d = Math.sqrt((vec[1] * vec[1]) + (vec[2] * vec[2]));
  const b_d = Math.abs(d) < 1e-6 ? 0 : b / d;
  const c_d = Math.abs(d) < 1e-6 ? 1 : c / d;
  const t     = identity3x3.concat(pos[0], pos[1], pos[2]);
  const t_inv = identity3x3.concat(-pos[0], -pos[1], -pos[2]);
  const rx     = [1, 0, 0, 0, c_d, b_d, 0, -b_d, c_d, 0, 0, 0];
  const rx_inv = [1, 0, 0, 0, c_d, -b_d, 0, b_d, c_d, 0, 0, 0];
  const ry     = [d, 0, a, 0, 1, 0, -a, 0, d, 0, 0, 0];
  const ry_inv = [d, 0, -a, 0, 1, 0, a, 0, d, 0, 0, 0];
  const rz     = [cos, sin, 0, -sin, cos, 0, 0, 0, 1, 0, 0, 0];
  return multiply_matrices3(t_inv,
    multiply_matrices3(rx_inv,
      multiply_matrices3(ry_inv,
        multiply_matrices3(rz,
          multiply_matrices3(ry,
            multiply_matrices3(rx, t))))));
};

export const make_matrix3_scale = (scale, origin = [0, 0, 0]) => [
  scale,
  0,
  0,
  0,
  scale,
  0,
  0,
  0,
  scale,
  scale * -origin[0] + origin[0],
  scale * -origin[1] + origin[1],
  scale * -origin[2] + origin[2]
];

/**
 * 2D operation, assuming everything is 0 in the z plane
 * @param line in vector-origin form
 * @returns matrix3
 */
export const make_matrix3_reflectionZ = (vector, origin = [0, 0]) => {
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
  return [a, b, 0, c, d, 0, 0, 0, 0, tx, ty, 0];
};

/**
 * 2D operation, assuming everything is 0 in the z plane
 * @param line in vector-origin form
 * @returns matrix3
 */
export const make_matrix3_reflection = (vector, origin = [0, 0, 0]) => {
  // the line of reflection passes through origin, runs along vector
  return [];
};
//               __                                           _
//   _________  / /_  ______ ___  ____     ____ ___  ____ _  (_)___  _____
//  / ___/ __ \/ / / / / __ `__ \/ __ \   / __ `__ \/ __ `/ / / __ \/ ___/
// / /__/ /_/ / / /_/ / / / / / / / / /  / / / / / / /_/ / / / /_/ / /
// \___/\____/_/\__,_/_/ /_/ /_/_/ /_/  /_/ /_/ /_/\__,_/_/ /\____/_/
//                                                     /___/
