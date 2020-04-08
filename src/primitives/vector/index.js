import Args from "./args";
import Methods from "./methods";
import Getters from "./getters";

/** n-dimensional vector, with some 3D and 2D-specific operations */
const vector = function () {
  const v = Object.create(vector.prototype);
  // init object
  Args.apply(v, arguments);
  // bind properties
  Object.keys(Getters).forEach(key => Object.defineProperty(v, key, {
    get: Getters[key].bind(v),
    enumerable: true
  }));
  Object.keys(Methods).forEach(key => Object.defineProperty(v, key, {
    value: Methods[key].bind(v)
  }));
  // done
  return Object.freeze(v);
};

// make this present in the prototype chain so "instanceof" works
// vector is a special case, Array.
vector.prototype = Object.create(Array.prototype);
vector.prototype.constructor = vector;

// pass a pointer to this object up the chain
Methods.constructor = vector;

// static methods
vector.fromAngle = function (angle) {
  return vector(Math.cos(angle), Math.sin(angle));
};

Object.freeze(vector);
export default vector;
