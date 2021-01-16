import Constructors from "../constructors";
import { equivalent_vectors } from "../../core/equal";
import { counter_clockwise_bisect2 } from "../../core/radial";

import {
  resize,
  resize_up,
} from "../../arguments/resize";

import {
  get_vector,
  get_matrix_3x4,
} from "../../arguments/get";

import {
  magnitude,
  normalize,
  scale,
  add,
  subtract,
  lerp,
  midpoint,
  dot,
  cross3,
  distance,
  flip,
  rotate90,
  rotate270,
  parallel,
} from "../../core/algebra";

import {
  make_matrix2_rotate,
} from "../../core/matrix2";

import {
  multiply_matrix3_vector3,
} from "../../core/matrix3";

// import {
// 	overlap_line_point,
// } from "../../overlap/overlap-line-point";

import {
	exclude_l,
} from "../../arguments/functions";

const table = {
  preserve: { // don't transform the return type. preserve it
    magnitude: function () { return magnitude(this); },
    isEquivalent: function () {
      return equivalent_vectors(this, get_vector(arguments));
    },
    isParallel: function () {
      return parallel(...resize_up(this, get_vector(arguments)));
    },
    dot: function () {
      return dot(...resize_up(this, get_vector(arguments)));
    },
    distanceTo: function () {
      return distance(...resize_up(this, get_vector(arguments)));
    },
		// onLine: function (line) {
		// 	if (!line.comp_function) { line = get_line(arguments); }
		// 	return overlap_line_point(line.vector, line.origin, this, line.comp_function || exclude_l);
		// },
  },
  vector: { // return type
    copy: function () { return [...this]; },
    normalize: function () { return normalize(this); },
    scale: function () { return scale(this, arguments[0]); },
    flip: function () { return flip(this); },
    rotate90: function () { return rotate90(this); },
    rotate270: function () { return rotate270(this); },
    cross: function () {
      return cross3(
        resize(3, this),
        resize(3, get_vector(arguments))
      );
    },
    transform: function () {
      return multiply_matrix3_vector3(
        get_matrix_3x4(arguments),
        resize(3, this)
      );
    },
    add: function () {
      return add(this, resize(this.length, get_vector(arguments)));
    },
    subtract: function () {
      return subtract(this, resize(this.length, get_vector(arguments)));
    },
    // todo, can this be improved?
    rotateZ: function (angle, origin) {
      return multiply_matrix3_vector3(
        get_matrix_3x4(make_matrix2_rotate(angle, origin)),
        resize(3, this)
      );
    },
    lerp: function (vector, pct) {
      return lerp(this, resize(this.length, get_vector(vector)), pct);
    },
    midpoint: function () {
      return midpoint(...resize_up(this, get_vector(arguments)));
    },
    bisect: function () {
      return counter_clockwise_bisect2(this, get_vector(arguments));
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
  };
});

export default VectorMethods;
