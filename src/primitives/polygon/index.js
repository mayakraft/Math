import Constructors from "../constructors";
import {
  semi_flatten_arrays,
} from "../../parsers/arguments";
import Prototype from "../prototypes/polygon";

export default {
  polygon: {
    P: Prototype.prototype,
    A: function () {
      this.points = semi_flatten_arrays(arguments)
        .map(v => Constructors.vector(v));
    },
    G: {
    },
    M: {
    },
    S: {
    }
  }
};
