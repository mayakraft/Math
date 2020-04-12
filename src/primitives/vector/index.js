/** n-dimensional vector, with some 3D and 2D-specific operations */
import Args from "./args";
import Methods from "./methods";
import Getters from "./getters";
import Static from "./static";

export default {
  vector: {
    Super: Array.prototype,  // vector is a special case, it's an Array
    Args,
    Getters,
    Methods,
    Static,
  }
};
