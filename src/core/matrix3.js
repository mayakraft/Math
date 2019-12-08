/**
 * @param {number[]} vector, in array form
 * @param {number[]} matrix, in array form
 * @returns {number[]} vector, the input vector transformed by the matrix
 */
export const multiply_matrix3_vector3 = function (m, vector) {
  return [
    m[0] * vector[0] + m[3] * vector[1] + m[6] * vector[2] + m[9],
    m[1] * vector[0] + m[4] * vector[1] + m[7] * vector[2] + m[10],
    m[2] * vector[0] + m[5] * vector[1] + m[8] * vector[2] + m[11]
  ];
};
/**
 * @param line in point-vector form, matrix
 * @returns transformed line in point-vector form
 */
export const multiply_matrix3_line3 = function (m, origin, vector) {
  return {
    origin: [
      m[0] * origin[0] + m[3] * origin[1] + m[6] * origin[2] + m[9],
      m[1] * origin[0] + m[4] * origin[1] + m[7] * origin[2] + m[10],
      m[2] * origin[0] + m[5] * origin[1] + m[8] * origin[2] + m[11]
    ],
    vector: [
      m[0] * vector[0] + m[3] * vector[1] + m[6] * vector[2],
      m[1] * vector[0] + m[4] * vector[1] + m[7] * vector[2],
      m[2] * vector[0] + m[5] * vector[1] + m[8] * vector[2]
    ]
  };
};

export const multiply_matrices3 = function (m1, m2) {
  return [
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
};

export const make_matrix3_translation = function (x, y, z) {
  return [1, 0, 0, 0, 1, 0, 0, 0, 1, x, y, z];
};

export const make_matrix3_scale = function (scale, origin = [0, 0, 0]) {
  return [
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
};

/**
 * @param matrix
 * @returns matrix
 */
export const make_matrix3_inverse = function (m) {
};
