/** n-dimensional vector, with some 3D and 2D-specific operations */
import args from "./args";
import methods from "./methods";
import getters from "./getters";
import Static from "./static";

// we need:
// - super: what should be the prototype of the prototype (default Object)
//   example: Array.prototype
// - getters
// - methods
// - args
// - static

export default {
  vector: {
    Super: Array.prototype,  // vector is a special case, it's an Array
    Args,
    Getters,
    Methods,
    Static,
  }
};
