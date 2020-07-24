import Constructors from "../constructors";
import LinePrototype from "../prototypes/line";
import { resize } from "../../arguments/resize";
import { get_line } from "../../arguments/get";
import Static from "./static";

// distance is between 0 and 1, representing the vector between start and end. cap accordingly
// const limit_line = dist => dist;

export default {
  line: {
    P: LinePrototype.prototype,

    A: function () {
      const l = get_line(...arguments);
      this.vector = Constructors.vector(l.vector);
      this.origin = Constructors.vector(resize(this.vector.length, l.origin));
    },

    G: {
      length: () => Infinity,
    },

    M: {
      clip_function: dist => dist,
      // compare_function: () => true,
      path: function (length = 1000) {
        const start = this.origin.add(this.vector.scale(-length));
        const end = this.vector.scale(length * 2);
        return `M${start[0]} ${start[1]}l${end[0]} ${end[1]}`;
      },
    },

    S: Static

  }
};
