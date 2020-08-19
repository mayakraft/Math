import Constructors from "../constructors";

import {
  get_vector,
  get_matrix2,
} from "../../arguments/get";

import { clean_number } from "../../arguments/resize";

import {
  multiply_matrix2_vector2,
  multiply_matrix2_line2,
  multiply_matrices2,
  determinant2,
  invert_matrix2,
  make_matrix2_translate,
  make_matrix2_scale,
  make_matrix2_rotate,
  make_matrix2_reflect,
} from "../../core/matrix2";

/**
 * 2D Matrix (2x3) with translation component in x,y
 */
export default {
  matrix2: {
    P: Array.prototype,

    A: function () {
      const matrix = [1, 0, 0, 1, 0, 0];
      const argsMatrix = get_matrix2(arguments);
      if (argsMatrix !== undefined) {
        argsMatrix.forEach((n, i) => { matrix[i] = n; });
      }
      matrix.forEach(m => this.push(m));
    },

    G: {
    },

    M: {
      multiply: function () {
        return Constructors.matrix2(
          multiply_matrices2(this, get_matrix2(arguments))
            .map(n => clean_number(n, 13))
        );
      },
      determinant: function () {
        return clean_number(determinant2(this));
      },
      inverse: function () {
        return Constructors.matrix2(invert_matrix2(this)
          .map(n => clean_number(n, 13)));
      },
      translate: function (x, y) {
        return Constructors.matrix2(
          multiply_matrices2(this, make_matrix2_translate(x, y))
            .map(n => clean_number(n, 13))
        );
      },
      scale: function () {
        return Constructors.matrix2(
          multiply_matrices2(this, make_matrix2_scale(arguments))
            .map(n => clean_number(n, 13))
        );
      },
      rotate: function () {
        return Constructors.matrix2(
          multiply_matrices2(this, make_matrix2_rotate(arguments))
            .map(n => clean_number(n, 13))
        );
      },
      reflect: function () {
        return Constructors.matrix2(
          multiply_matrices2(this, make_matrix2_reflect(arguments))
            .map(n => clean_number(n, 13))
        );
      },
      transform: function () {
        return Constructors.vector(
          multiply_matrix2_vector2(this, get_vector(arguments))
            .map(n => clean_number(n, 13))
        );
      },
      transformVector: function (vector) {
        return Constructors.matrix2(multiply_matrix2_vector2(this, vector)
          .map(n => clean_number(n, 13)));
      },
      transformLine: function (vector, origin) {
        return Constructors.matrix2(
          multiply_matrix2_line2(this, vector, origin)
            .map(n => clean_number(n, 13))
        );
      },
    },

    S: {
      makeIdentity: () => Constructors.matrix2(1, 0, 0, 1, 0, 0),
      makeTranslation: (x, y) => Constructors.matrix2(
        make_matrix2_translate(x, y)
      ),
      makeRotation: (angle_radians, origin) => Constructors.matrix2(
        make_matrix2_rotate(angle_radians, origin)
          .map(n => clean_number(n, 13))
      ),
      makeScale: (x, y, origin) => Constructors.matrix2(
        make_matrix2_scale(x, y, origin).map(n => clean_number(n, 13))
      ),
      makeReflection: (vector, origin) => Constructors.matrix2(
        make_matrix2_reflect(vector, origin).map(n => clean_number(n, 13))
      ),
    }
  }
};
