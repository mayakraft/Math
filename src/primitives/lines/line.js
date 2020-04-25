import Constructors from "../constructors";
import LinePrototype from "../prototypes/line";
import { get_line } from "../../parsers/arguments";
import Static from "./static";

// distance is between 0 and 1, representing the vector between start and end. cap accordingly
// const limit_line = dist => dist;

export default {
  line: {
    P: LinePrototype.prototype,

    A: function () {
      const l = get_line(...arguments);
      this.vector = Constructors.vector(l.vector);
      this.origin = Constructors.vector(l.origin);
    },

    G: {
      length: () => Infinity,
    },

    M: {
      clip_function: dist => dist,
      // compare_function: () => true,
    },

    S: Static

  }
};
