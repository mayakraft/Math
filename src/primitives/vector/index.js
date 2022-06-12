/**
 * Math (c) Kraft
 */
/** n-dimensional vector, with some 3D and 2D-specific operations */
import A from "./args";
import G from "./getters";
import M from "./methods";
import S from "./static";

export default {
  vector: {
    P: Array.prototype, // vector is a special case, it's an instance of an Array
    A,
    G,
    M,
    S,
  }
};
