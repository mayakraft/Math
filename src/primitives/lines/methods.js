import { EPSILON } from "../../core/constants";
import { bisect_lines2 } from "../../core/radial";
import { nearest_point_on_line } from "../../core/nearest";
import { include_l } from "../../arguments/functions";
import TypeOf from "../../arguments/typeof";
import Constructors from "../constructors";
import intersect from "../../intersection/intersect";
import overlap from "../../intersection/overlap";
import overlap_line_point from "../../intersection/overlap-line-point";

import {
  resize,
  resize_up
} from "../../arguments/resize";

import {
  get_vector,
  get_line,
  get_matrix_3x4,
} from "../../arguments/get";

import {
  add,
  parallel,
  degenerate,
} from "../../core/algebra";

import {
  multiply_matrix3_line3,
  make_matrix3_reflectZ
} from "../../core/matrix3";

// do not define object methods as arrow functions in here

/**
 * this prototype is shared among line types: lines, rays, segments.
 * it's counting on each type having defined:
 * - an origin
 * - a vector
 * - domain_function which takes one or two inputs (t0, epsilon) and returns
 *   true if t0 lies inside the boundary of the line, t0 is scaled to vector
 * - similarly, clip_function, takes two inputs (d, epsilon)
 *   and returns a modified d for what is considered valid space between 0-1
 */

const methods = {
// todo, this only takes line types. it should be able to take a vector
  isParallel: function () {
    const arr = resize_up(this.vector, get_line(arguments).vector);
    return parallel(...arr);
  },
  isCollinear: function () {
    const line = get_line(arguments);
    return overlap_line_point(this.vector, this.origin, line.origin)
      && parallel(...resize_up(this.vector, line.vector));
  },
  isDegenerate: function (epsilon = EPSILON) {
    return degenerate(this.vector, epsilon);
  },
  reflectionMatrix: function () {
    return Constructors.matrix(make_matrix3_reflectZ(this.vector, this.origin));
  },
  nearestPoint: function () {
    const point = get_vector(arguments);
    return Constructors.vector(
      nearest_point_on_line(this.vector, this.origin, point, this.clip_function)
    );
  },
  // this works with lines and rays, it should be overwritten for segments
  transform: function () {
    const dim = this.dimension;
    const r = multiply_matrix3_line3(
      get_matrix_3x4(arguments),
      resize(3, this.vector),
      resize(3, this.origin)
    );
    return this.constructor(resize(dim, r.vector), resize(dim, r.origin));
  },
  translate: function () {
    const origin = add(...resize_up(this.origin, get_vector(arguments)));
    return this.constructor(this.vector, origin);
  },
  intersect: function () {
    return intersect(this, ...arguments);
  },
  overlap: function () {
    return overlap(this, ...arguments);
  },
  bisect: function (lineType, epsilon) {
    const line = get_line(lineType);
    return bisect_lines2(this.vector, this.origin, line.vector, line.origin, epsilon)
      .map(line => this.constructor(line));
  },
};

export default methods;

