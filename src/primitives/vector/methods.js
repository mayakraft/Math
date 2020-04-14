import Constructors from "../constructors";
// import { equivalent } from "../../core/equal";
import { EPSILON } from "../../core/equal";
import { parallel } from "../../core/query";
import { bisect_vectors } from "../../core/geometry";

import {
  resize,
  resizeUp,
  get_vector,
  get_matrix2,
  get_line,
} from "../../parsers/arguments";

import {
  magnitude,
  normalize,
  dot,
  cross3,
} from "../../core/algebra";

import {
  multiply_matrix2_vector2,
  make_matrix2_rotate,
  make_matrix2_reflection,
} from "../../core/matrix2";

const table = {
  preserve: { // don't transform the return type. preserve it
    magnitude: function () { return magnitude(this); },
    isEquivalent: function () {
      const vecs = resizeUp(this, get_vector(arguments));
      return vecs[0].map((_, i) => Math.abs(vecs[0][i] - vecs[1][i]) < EPSILON)
        .reduce((a, b) => a && b, true);
    },
    isParallel: function () {
      return parallel(...resizeUp(this, get_vector(arguments)));
    },
    dot: function () {
      return dot(...resizeUp(this, get_vector(arguments)));
    },
    distanceTo: function () {
      const vecs = resizeUp(this, get_vector(arguments));
      return Math.sqrt(vecs
        .map((_, i) => (vecs[0][i] - vecs[1][i]) ** 2)
        .reduce((a, b) => a + b, 0)
      );
    },
    bisect: function () {
      return bisect_vectors(this, get_vector(arguments))
        .map(b => Constructors.vector(b));
    },
  },
  vector: { // return type
    copy: function () { return [...this]; },
    normalize: function () { return normalize(this); },
    scale: function (mag) { return this.map(v => v * mag); },
    cross: function () {
      return cross3(resize(3, this), resize(3, get_vector(arguments)))
    },
    // transform: function () {
    //   return multiply_matrix2_vector2(get_matrix2(arguments), this);
    // },
    add: function () {
      return resize(this.length, get_vector(arguments))
        .map((n, i) => this[i] + n);
    },
    subtract: function () {
      return resize(this.length, get_vector(arguments))
        .map((n, i) => this[i] - n);
    },
    // these are implicitly 2D functions, and will convert the vector into 2D
    // rotateZ: function (angle, origin) {
    //   return multiply_matrix2_vector2(make_matrix2_rotate(angle, origin), this);
    // },
    rotateZ90: function () { return [-this[1], this[0]]; },
    rotateZ180: function () { return [-this[0], -this[1]]; },
    rotateZ270: function () { return [this[1], -this[0]]; },
    flip: function () { return this.map(n => -n); },
    // reflect: function () {
    //   const ref = get_line(arguments);
    //   const m = make_matrix2_reflection(ref.vector, ref.origin);
    //   return multiply_matrix2_vector2(m, this);
    // },
    lerp: function (vector, pct) {
      const inv = 1.0 - pct;
      return resize(this.length, get_vector(vector))
        .map((n, i) => this[i] * inv + n * pct);
    },
    midpoint: function () {
      const vecs = resizeUp(this, get_vector(arguments));
      return vecs[0].map((_, i) => (vecs[0][i] + vecs[1][i]) / 2);
    },
  }
};

// the default export
const VectorMethods = {};

Object.keys(table.preserve).forEach(key => {
  VectorMethods[key] = table.preserve[key];
});

Object.keys(table.vector).forEach(key => {
  VectorMethods[key] = function () {
    return Constructors.vector(...table.vector[key].apply(this, arguments));
  }
});

export default VectorMethods;
