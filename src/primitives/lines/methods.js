/**
 * Math (c) Kraft
 */
import { EPSILON } from "../../core/constants";
import { bisectLines2 } from "../../core/radial";
import { nearestPointOnLine } from "../../core/nearest";
import { includeL } from "../../arguments/functions";
import TypeOf from "../../arguments/typeof";
import Constructors from "../constructors";
import intersect from "../../intersection/intersect";
import overlap from "../../intersection/overlap";
import overlapLinePoint from "../../intersection/overlap-line-point";

import {
  resize,
  resizeUp
} from "../../arguments/resize";

import {
  getVector,
  getLine,
  getMatrix3x4,
} from "../../arguments/get";

import {
  add,
  parallel,
  degenerate,
} from "../../core/algebra";

import {
  multiplyMatrix3Line3,
  makeMatrix3ReflectZ
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

const LinesMethods = {
// todo, this only takes line types. it should be able to take a vector
  isParallel: function () {
    const arr = resizeUp(this.vector, getLine(arguments).vector);
    return parallel(...arr);
  },
  isCollinear: function () {
    const line = getLine(arguments);
    return overlapLinePoint(this.vector, this.origin, line.origin)
      && parallel(...resizeUp(this.vector, line.vector));
  },
  isDegenerate: function (epsilon = EPSILON) {
    return degenerate(this.vector, epsilon);
  },
  reflectionMatrix: function () {
    return Constructors.matrix(makeMatrix3ReflectZ(this.vector, this.origin));
  },
  nearestPoint: function () {
    const point = getVector(arguments);
    return Constructors.vector(
      nearestPointOnLine(this.vector, this.origin, point, this.clip_function)
    );
  },
  // this works with lines and rays, it should be overwritten for segments
  transform: function () {
    const dim = this.dimension;
    const r = multiplyMatrix3Line3(
      getMatrix3x4(arguments),
      resize(3, this.vector),
      resize(3, this.origin)
    );
    return this.constructor(resize(dim, r.vector), resize(dim, r.origin));
  },
  translate: function () {
    const origin = add(...resizeUp(this.origin, getVector(arguments)));
    return this.constructor(this.vector, origin);
  },
  intersect: function () {
    return intersect(this, ...arguments);
  },
  overlap: function () {
    return overlap(this, ...arguments);
  },
  bisect: function (lineType, epsilon) {
    const line = getLine(lineType);
    return bisectLines2(this.vector, this.origin, line.vector, line.origin, epsilon)
      .map(line => this.constructor(line));
  },
};

export default LinesMethods;

