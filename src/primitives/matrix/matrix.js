import Constructors from "../constructors";

import {
  get_vector,
  get_matrix_3x4,
  clean_number,
} from "../../parsers/arguments";

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
} from "../../core/matrix3";

/**
 * 3D Matrix (3x4) with translation component in x,y,z. column-major order
 *
 *   x y z translation
 *   | | | |           indices
 * [ 1 0 0 0 ]   x   [ 0 3 6 9 ]
 * [ 0 1 0 0 ]   y   [ 1 4 7 10]
 * [ 0 0 1 0 ]   z   [ 2 5 8 11]
 */
export default {
  matrix: {
    P: Array.prototype,

    A: function () {
      get_matrix_3x4(arguments).forEach(m => this.push(m));
    },

    G: {
    },

    M: {
      // todo: is this right, on the right hand side?
      multiply: function () {
        return Constructors.matrix(
          multiply_matrices3(this, get_matrix_3x4(arguments))
            .map(n => clean_number(n, 13))
        );
      },
      determinant: function () {
        return clean_number(determinant3(this), 13);
      },
      inverse: function () {
        return Constructors.matrix(invert_matrix3(this)
          .map(n => clean_number(n, 13)));
      },
      // todo: is this the right order (this, transform)?
      translate: function (x, y, z) {
        return Constructors.matrix(
          multiply_matrices3(this, make_matrix3_translate(x, y, z))
            .map(n => clean_number(n, 13))
        );
      },
      rotateX: function (radians) {
        return Constructors.matrix(
          multiply_matrices3(this, make_matrix3_rotateX(radians))
            .map(n => clean_number(n, 13))
        );
      },
      rotateY: function (radians) {
        return Constructors.matrix(
          multiply_matrices3(this, make_matrix3_rotateY(radians))
            .map(n => clean_number(n, 13))
        );
      },
      rotateZ: function (radians) {
        return Constructors.matrix(
          multiply_matrices3(this, make_matrix3_rotateZ(radians))
            .map(n => clean_number(n, 13))
        );
      },
      rotate: function (radians, vector, origin) {
        const transform = make_matrix3_rotate(radians, vector, origin);
        return Constructors.matrix(multiply_matrices3(this, transform)
          .map(n => clean_number(n, 13)));
      },
      scale: function (amount) {
        return Constructors.matrix(
          multiply_matrices3(this, make_matrix3_scale(amount))
            .map(n => clean_number(n, 13))
        );
      },
      reflectZ: function (vector, origin) {
        const transform = make_matrix3_reflectionZ(vector, origin);
        return Constructors.matrix(multiply_matrices3(this, transform)
          .map(n => clean_number(n, 13)));
      },
      // todo, do type checking
      transform: function (...innerArgs) {
        return Constructors.vector(
          multiply_matrix3_vector3(get_vector(innerArgs), this)
            .map(n => clean_number(n, 13))
        );
      },
      transformVector: function (vector) {
        return Constructors.matrix(multiply_matrix3_vector3(this, vector)
          .map(n => clean_number(n, 13)));
      },
      transformLine: function (origin, vector) {
        return Constructors.matrix(multiply_matrix3_line3(this, origin, vector)
          .map(n => clean_number(n, 13)));
      },
    },

    S: {
    }
  }
};
