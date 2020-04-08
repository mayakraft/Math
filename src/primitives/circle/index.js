import { get_vector_of_vectors } from "../../parsers/arguments";
import { distance2 } from "../../core/algebra";

import Args from "./args";
import Methods from "./methods";

const circle = function () {
  const c = Object.create(circle.prototype);
  // let origin;
  // let radius;
  // init object
  Args.apply(c, arguments);
  // bind properties
  Object.keys(Methods).forEach(key => Object.defineProperty(c, key, {
    value: Methods[key].bind(c)
  }));
  // done
  return Object.freeze(c);
};

// make this present in the prototype chain so "instanceof" works
circle.prototype = Object.create(Array.prototype);
circle.prototype.constructor = circle;

// pass a pointer to this object up the chain
// Methods.constructor = circle;

// static methods
circle.fromAngle = function (angle) {
  return circle(Math.cos(angle), Math.sin(angle));
};

circle.fromPoints = function () {
  const points = get_vector_of_vectors(innerArgs);
  return circle(points, distance2(points[0], points[1]));
};

Object.freeze(circle);
export default circle;
