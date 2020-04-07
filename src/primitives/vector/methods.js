import { equivalent } from "../../core/equal";
import { parallel } from "../../core/query";
import { bisect_vectors } from "../../core/geometry";

import {
  get_vector,
  get_matrix2,
  get_line,
} from "../../parsers/arguments";

import {
  normalize,
  dot,
  cross3,
} from "../../core/algebra";

import {
  multiply_matrix2_vector2,
  make_matrix2_rotate,
  make_matrix2_reflection,
} from "../../core/matrix2";


const M = {};
// M.constructor = () => {};
// M.constructor will be set later to be vector()


const table = {
  preserve: { // don't transform the return type. preserve it
    isEquivalent: function () {
      // rect bounding box for now, much cheaper than radius calculation
      const vec = get_vector(arguments);
      const sm = (this.length < vec.length) ? this : vec;
      const lg = (this.length < vec.length) ? vec : this;
      return equivalent(sm, lg);
    },
    isParallel: function () {
      const vec = get_vector(arguments);
      const sm = (this.length < vec.length) ? this : vec;
      const lg = (this.length < vec.length) ? vec : this;
      return parallel(sm, lg);
    },
    dot: function () {
      const v = get_vector(arguments);
      return this.length > v.length
        ? dot(v, this)
        : dot(this, v);
    },
    distanceTo: function () {
      const v = get_vector(arguments);
      const length = (this.length < v.length) ? this.length : v.length;
      const sum = Array.from(Array(length))
        .map((_, i) => (this[i] - v[i]) ** 2)
        .reduce((a, b) => a + b, 0);
      return Math.sqrt(sum);
    },
    bisect: function () {
      const vec = get_vector(arguments);
      return bisect_vectors(this, vec).map(b => M.constructor(b));
    },
  },
  vector: { // return type
    copy: function () { return [...this]; },
    normalize: function () { return normalize(this); },
    scale: function (mag) { return this.map(v => v * mag); },
    cross: function () {
      const b = get_vector(arguments);
      const a = this.slice();
      if (a[2] == null) { a[2] = 0; }
      if (b[2] == null) { b[2] = 0; }
      return cross3(a, b);
    },
    transform: function () {
      return multiply_matrix2_vector2(get_matrix2(arguments), this);
    },
    add: function () {
      const vec = get_vector(arguments);
      return this.map((v, i) => v + vec[i]);
    },
    subtract: function () {
      const vec = get_vector(arguments);
      return this.map((v, i) => v - vec[i]);
    },
    // these are implicitly 2D functions, and will convert the vector into 2D
    rotateZ: function (angle, origin) {
      return multiply_matrix2_vector2(make_matrix2_rotate(angle, origin), this);
    },
    rotateZ90: function () {
      return [-this[1], this[0]];
    },
    rotateZ180: function () {
      return [-this[0], -this[1]];
    },
    rotateZ270: function () {
      return [this[1], -this[0]];
    },
    flip: function () { return this.map(n => -n); },
    reflect: function () {
      const ref = get_line(arguments);
      const m = make_matrix2_reflection(ref.vector, ref.origin);
      return multiply_matrix2_vector2(m, this);
    },
    lerp: function (vector, pct) {
      const vec = get_vector(vector);
      const inv = 1.0 - pct;
      const length = (this.length < vec.length) ? this.length : vec.length;
      return Array.from(Array(length))
        .map((_, i) => this[i] * pct + vec[i] * inv);
    },
    midpoint: function () {
      const vec = get_vector(arguments);
      const sm = (this.length < vec.length) ? this.slice() : vec;
      const lg = (this.length < vec.length) ? vec : this.slice();
      for (let i = sm.length; i < lg.length; i += 1) { sm[i] = 0; }
      return lg.map((_, i) => (sm[i] + lg[i]) * 0.5);
    },
  }
};

Object.keys(table.preserve).forEach(key => {
  M[key] = table.preserve[key];
});

Object.keys(table.vector).forEach(key => {
  M[key] = function () {
    return M.constructor(...table.vector[key].apply(this, arguments));
  }
});

export default M;
