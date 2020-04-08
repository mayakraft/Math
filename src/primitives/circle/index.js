import Args from "./args";
import Methods from "./methods";
import Getters from "./getters";
import Static from "./static";

const circle = function () {
  const c = Object.create(circle.prototype);
  // init object
  Args.apply(c, arguments);
  // bind properties
  Object.keys(Getters).forEach(key => Object.defineProperty(c, key, {
    get: Getters[key].bind(c),
    enumerable: true
  }));
  Object.keys(Methods).forEach(key => Object.defineProperty(c, key, {
    value: Methods[key].bind(c)
  }));
  // done
  return Object.freeze(c);
};

// make this present in the prototype chain so "instanceof" works
circle.prototype = Object.create(Array.prototype);
circle.prototype.constructor = circle;

Static(circle);

Object.freeze(circle);
export default circle;
