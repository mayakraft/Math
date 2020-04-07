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
    get: Getters[key].bind(v)
  }));
  Object.keys(Methods).forEach(key => Object.defineProperty(v, key, {
    value: Methods[key].bind(v)
  }));
  // done
  return Object.freeze(v);
};

vector.prototype = Object.create(Array.prototype);
vector.prototype.constructor = vector;

Methods.constructor = vector; // pass a pointer to this object up the chain

// static methods
vector.fromAngle = function (angle) {
  return vector(Math.cos(angle), Math.sin(angle));
};

Object.freeze(vector);
export default vector;
