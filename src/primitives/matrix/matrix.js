import {
  get_vector,
  get_matrix2,
  get_matrix3,
  clean_number,
} from "../parsers/arguments";

import {
  multiply_matrix2_vector2,
  multiply_matrix2_line2,
  multiply_matrices2,
  determinant2,
  invert_matrix2,
  make_matrix2_translate,
  make_matrix2_scale,
  make_matrix2_rotate,
  make_matrix2_reflection,
} from "../core/matrix2";
import {
  multiply_matrix3_vector3,
  multiply_matrix3_line3,
  multiply_matrices3,
  determinant3,
  invert_matrix3,
  make_matrix3_translate,
  make_matrix3_rotateX,
  make_matrix3_rotateY,
  make_matrix3_rotateZ,
  make_matrix3_rotate,
  make_matrix3_scale,
  make_matrix3_reflectionZ
} from "../core/matrix3";
import Vector from "./vector/index";
/**
 * 2D Matrix (2x3) with translation component in x,y
 */
const Matrix2 = function (...args) {
  const matrix = [1, 0, 0, 1, 0, 0];
  const argsMatrix = get_matrix2(args);
  if (argsMatrix !== undefined) {
    argsMatrix.forEach((n, i) => { matrix[i] = n; });
  }

  const multiply = function (...innerArgs) {
    return Matrix2(multiply_matrices2(matrix, get_matrix2(innerArgs))
      .map(n => clean_number(n, 13)));
  };
  const determinant = function () {
    return clean_number(determinant2(matrix));
  };
  const inverse = function () {
    return Matrix2(invert_matrix2(matrix)
      .map(n => clean_number(n, 13)));
  };
  const translate = function (x, y) {
    const transform = make_matrix2_translate(x, y);
    return Matrix2(multiply_matrices2(matrix, transform)
      .map(n => clean_number(n, 13)));
  };
  const scale = function (...innerArgs) {
    const transform = make_matrix2_scale(...innerArgs);
    return Matrix2(multiply_matrices2(matrix, transform)
      .map(n => clean_number(n, 13)));
  };
  const rotate = function (...innerArgs) {
    const transform = make_matrix2_rotate(...innerArgs);
    return Matrix2(multiply_matrices2(matrix, transform)
      .map(n => clean_number(n, 13)));
  };
  const reflect = function (...innerArgs) {
    const transform = make_matrix2_reflection(...innerArgs);
    return Matrix2(multiply_matrices2(matrix, transform)
      .map(n => clean_number(n, 13)));
  };
  const transform = function (...innerArgs) {
    const v = get_vector(innerArgs);
    return Vector(multiply_matrix2_vector2(matrix, v)
      .map(n => clean_number(n, 13)));
  };
  const transformVector = function (vector) {
    return Matrix2(multiply_matrix2_vector2(matrix, vector)
      .map(n => clean_number(n, 13)));
  };
  const transformLine = function (vector, origin) {
    return Matrix2(multiply_matrix2_line2(matrix, vector, origin)
      .map(n => clean_number(n, 13)));
  };

  Object.defineProperty(matrix, "multiply", { value: multiply });
  Object.defineProperty(matrix, "determinant", { value: determinant });
  Object.defineProperty(matrix, "inverse", { value: inverse });
  Object.defineProperty(matrix, "translate", { value: translate });
  Object.defineProperty(matrix, "scale", { value: scale });
  Object.defineProperty(matrix, "rotate", { value: rotate });
  Object.defineProperty(matrix, "reflect", { value: reflect });
  Object.defineProperty(matrix, "transform", { value: transform });
  Object.defineProperty(matrix, "transformVector", { value: transformVector });
  Object.defineProperty(matrix, "transformLine", { value: transformLine });
  return Object.freeze(matrix);
};

// static methods
Matrix2.makeIdentity = () => Matrix2(1, 0, 0, 1, 0, 0);
Matrix2.makeTranslation = (x, y) => Matrix2(
  make_matrix2_translate(x, y)
);
Matrix2.makeRotation = (angle_radians, origin) => Matrix2(
  make_matrix2_rotate(angle_radians, origin).map(n => clean_number(n, 13))
);
Matrix2.makeScale = (x, y, origin) => Matrix2(
  make_matrix2_scale(x, y, origin).map(n => clean_number(n, 13))
);
Matrix2.makeReflection = (vector, origin) => Matrix2(
  make_matrix2_reflection(vector, origin).map(n => clean_number(n, 13))
);

/**
 * 3D Matrix (3x4) with translation component in x,y,z. column-major order
 *
 *   x y z translation
 *   | | | |           indices
 * [ 1 0 0 0 ]   x   [ 0 3 6 9 ]
 * [ 0 1 0 0 ]   y   [ 1 4 7 10]
 * [ 0 0 1 0 ]   z   [ 2 5 8 11]
 */
const Matrix = function (...args) {
  const matrix = [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0];
  const argsMatrix = get_matrix3(args);
  if (argsMatrix !== undefined) {
    argsMatrix.forEach((n, i) => { matrix[i] = n; });
  }

  // todo: is this right, on the right hand side?
  const multiply = function (...innerArgs) {
    return Matrix(multiply_matrices3(matrix, get_matrix3(innerArgs))
      .map(n => clean_number(n, 13)));
  };
  const determinant = function () {
    return clean_number(determinant3(matrix), 13);
  };
  const inverse = function () {
    return Matrix(invert_matrix3(matrix)
      .map(n => clean_number(n, 13)));
  };
  // todo: is this the right order (matrix, transform)?
  const translate = function (x, y, z) {
    const transform = make_matrix3_translate(x, y, z);
    return Matrix(multiply_matrices3(matrix, transform)
      .map(n => clean_number(n, 13)));
  };
  const rotateX = function (angle_radians) {
    const transform = make_matrix3_rotateX(angle_radians);
    return Matrix(multiply_matrices3(matrix, transform)
      .map(n => clean_number(n, 13)));
  };
  const rotateY = function (angle_radians) {
    const transform = make_matrix3_rotateY(angle_radians);
    return Matrix(multiply_matrices3(matrix, transform)
      .map(n => clean_number(n, 13)));
  };
  const rotateZ = function (angle_radians) {
    const transform = make_matrix3_rotateZ(angle_radians);
    return Matrix(multiply_matrices3(matrix, transform)
      .map(n => clean_number(n, 13)));
  };
  const rotate = function (angle_radians, vector, origin) {
    const transform = make_matrix3_rotate(angle_radians, vector, origin);
    return Matrix(multiply_matrices3(matrix, transform)
      .map(n => clean_number(n, 13)));
  };
  const scale = function (amount) {
    const transform = make_matrix3_scale(amount);
    return Matrix(multiply_matrices3(matrix, transform)
      .map(n => clean_number(n, 13)));
  };
  const reflectZ = function (vector, origin) {
    const transform = make_matrix3_reflectionZ(vector, origin);
    return Matrix(multiply_matrices3(matrix, transform)
      .map(n => clean_number(n, 13)));
  };
  const transform = function (...innerArgs) {
    const v = get_vector(innerArgs);
    return Vector(multiply_matrix3_vector3(v, matrix)
      .map(n => clean_number(n, 13)));
  };
  const transformVector = function (vector) {
    return Matrix(multiply_matrix3_vector3(matrix, vector)
      .map(n => clean_number(n, 13)));
  };
  const transformLine = function (origin, vector) {
    return Matrix(multiply_matrix3_line3(matrix, origin, vector)
      .map(n => clean_number(n, 13)));
  };

  Object.defineProperty(matrix, "multiply", { value: multiply });
  Object.defineProperty(matrix, "determinant", { value: determinant });
  Object.defineProperty(matrix, "inverse", { value: inverse });
  Object.defineProperty(matrix, "translate", { value: translate });
  Object.defineProperty(matrix, "rotateX", { value: rotateX });
  Object.defineProperty(matrix, "rotateY", { value: rotateY });
  Object.defineProperty(matrix, "rotateZ", { value: rotateZ });
  Object.defineProperty(matrix, "rotate", { value: rotate });
  Object.defineProperty(matrix, "scale", { value: scale });
  Object.defineProperty(matrix, "reflectZ", { value: reflectZ });
  Object.defineProperty(matrix, "transform", { value: transform });
  Object.defineProperty(matrix, "transformVector", { value: transformVector });
  Object.defineProperty(matrix, "transformLine", { value: transformLine });

  return Object.freeze(matrix);
};

// static methods
Matrix.makeIdentity = () => Matrix(1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0);
// todo: is this the right order (matrix, transform)?
Matrix.makeTranslation = (x, y, z) => Matrix(
  make_matrix3_translate(x, y, z)
);
Matrix.makeRotationX = angle_radians => Matrix(
  make_matrix3_rotateX(angle_radians).map(n => clean_number(n, 13))
);
Matrix.makeRotationY = angle_radians => Matrix(
  make_matrix3_rotateY(angle_radians).map(n => clean_number(n, 13))
);
Matrix.makeRotationZ = angle_radians => Matrix(
  make_matrix3_rotateZ(angle_radians).map(n => clean_number(n, 13))
);
Matrix.makeRotation = (angle_radians, vector, origin) => Matrix(
  make_matrix3_rotate(angle_radians, vector, origin).map(n => clean_number(n, 13))
);
Matrix.makeScale = (amount, origin) => Matrix(
  make_matrix3_scale(amount, origin).map(n => clean_number(n, 13))
);
Matrix.makeReflectionZ = (vector, origin) => Matrix(
  make_matrix3_reflectionZ(vector, origin).map(n => clean_number(n, 13))
);

export {
  Matrix2,
  Matrix
};
