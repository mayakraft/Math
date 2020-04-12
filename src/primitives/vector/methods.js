// import { equivalent } from "../../core/equal";
import { EPSILON } from "../../core/equal";
import { parallel } from "../../core/query";
import { bisect_vectors } from "../../core/geometry";

import {
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

/**
 * sort two vectors by their lengths, returning the shorter one first
 *
 */
const lengthSort = (a, b) => [a, b].sort((a, b) => a.length - b.length);

/**
 * force a point into N-dimensions by adding 0s if they don't exist.
 */
const resize = (d, a) => Array(d).fill(0).map((z, i) => a[i] ? a[i] : z);

/**
 * this makes the two vectors match in dimension.
 * the smaller array will be filled with 0s to match the length of the larger
 */
const makeSameD = (a, b) => {
  const lengths = [a.length - b.length, b.length - a.length];
  const vecs = lengthSort(a, b);
  vecs[0] = vecs[1].map((_, i) => vecs[0][i] || 0);
  return vecs;
};

// the default export
const VectorMethods = {};
// VectorMethods.constructor = () => {};
// VectorMethods.constructor will be set later to be vector()

const table = {
  preserve: { // don't transform the return type. preserve it
    magnitude: function () { return magnitude(this); },
    isEquivalent: function () {
      const vecs = makeSameD(this, get_vector(arguments));
      return vecs[0].map((_, i) => Math.abs(vecs[0][i] - vecs[1][i]) < EPSILON)
        .reduce((a, b) => a && b, true);
    },
    isParallel: function () {
      return parallel(...makeSameD(this, get_vector(arguments)));
    },
    dot: function () {
      return dot(...lengthSort(this, get_vector(arguments)));
    },
    distanceTo: function () {
      const vecs = makeSameD(this, get_vector(arguments));
      return Math.sqrt(vecs
        .map((_, i) => (vecs[0][i] - vecs[1][i]) ** 2)
        .reduce((a, b) => a + b, 0)
      );
    },
    bisect: function () {
      return bisect_vectors(this, get_vector(arguments))
        .map(b => VectorMethods.constructor(b));
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
      const vecs = makeSameD(this, get_vector(arguments));
      return vecs[0].map((_, i) => (vecs[0][i] + vecs[1][i]) / 2);
    },
  }
};

Object.keys(table.preserve).forEach(key => {
  VectorMethods[key] = table.preserve[key];
});

// VectorMethods.constructor is a pointer to creating a vector() type
Object.keys(table.vector).forEach(key => {
  VectorMethods[key] = function () {
    return VectorMethods.constructor(...table.vector[key].apply(this, arguments));
  }
});

export default VectorMethods;
