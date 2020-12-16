import Constructors from "../constructors";

import {
  get_vector,
  get_line,
  get_matrix_3x4,
} from "../../arguments/get";

import {
  resize
} from "../../arguments/resize";

import {
  is_identity3x4,
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
  make_matrix3_reflectZ
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

// this is 4x faster than calling Object.assign(thisMat, mat)
const assign = (thisMat, mat) => {
  for (let i = 0; i < 12; i += 1) {
    thisMat[i] = mat[i];
  }
  return thisMat;
};

export default {
  matrix: {
    P: Array.prototype,

    A: function () {
      // [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0].forEach(m => this.push(m));
      get_matrix_3x4(arguments).forEach(m => this.push(m));
    },

    G: {
    },

    M: {
      copy: function () { return Constructors.matrix(...Array.from(this)); },
      set: function () {
        return assign(this, get_matrix_3x4(arguments));
      },
      isIdentity: function () { return is_identity3x4(this); },
      // todo: is this right, on the right hand side?
      multiply: function (mat) {
        return assign(this, multiply_matrices3(this, mat));
      },
      determinant: function () {
        return determinant3(this);
      },
      inverse: function () {
        return assign(this, invert_matrix3(this));
      },
      // todo: is this the right order (this, transform)?
      translate: function (x, y, z) {
        return assign(this,
          multiply_matrices3(this, make_matrix3_translate(x, y, z)));
      },
      rotateX: function (radians) {
        return assign(this,
          multiply_matrices3(this, make_matrix3_rotateX(radians)));
      },
      rotateY: function (radians) {
        return assign(this,
          multiply_matrices3(this, make_matrix3_rotateY(radians)));
      },
      rotateZ: function (radians) {
        return assign(this,
          multiply_matrices3(this, make_matrix3_rotateZ(radians)));
      },
      rotate: function (radians, vector, origin) {
        const transform = make_matrix3_rotate(radians, vector, origin);
        return assign(this, multiply_matrices3(this, transform));
      },
      scale: function (amount) {
        return assign(this,
          multiply_matrices3(this, make_matrix3_scale(amount)));
      },
      reflectZ: function (vector, origin) {
        const transform = make_matrix3_reflectZ(vector, origin);
        return assign(this, multiply_matrices3(this, transform));
      },
      // todo, do type checking
      transform: function (...innerArgs) {
        return Constructors.vector(
          multiply_matrix3_vector3(this, resize(3, get_vector(innerArgs)))
        );
      },
      transformVector: function (vector) {
        return Constructors.vector(
          multiply_matrix3_vector3(this, resize(3, get_vector(vector)))
        );
      },
      transformLine: function (...innerArgs) {
        const l = get_line(innerArgs);
        return Constructors.line(multiply_matrix3_line3(this, l.vector, l.origin));
      },
    },

    S: {
    }
  }
};
