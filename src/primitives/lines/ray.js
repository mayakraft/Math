import Constructors from "../constructors";
import LinePrototype from "../prototypes/line";
import { resize } from "../../arguments/resize";
import { get_line } from "../../arguments/get";
import { EPSILON } from "../../core/equal";
import Static from "./static";

export default {
  ray: {
    P: LinePrototype.prototype,

    A: function () {
      const ray = get_line(...arguments);
      this.vector = Constructors.vector(ray.vector);
      this.origin = Constructors.vector(resize(this.vector.length, ray.origin));
    },

    G: {
      length: () => Infinity,
    },

    M: {
      rotate180: function () {
        return Constructors.ray(this.origin[0], this.origin[1], -this.vector[0], -this.vector[1]);
      },
      // distance is between 0 and 1, representing the vector between start and end. cap accordingly
      clip_function: dist => (dist < -EPSILON ? 0 : dist),
      path: function (length = 1000) {
        const end = this.vector.scale(length);
        return `M${this.origin[0]} ${this.origin[1]}l${end[0]} ${end[1]}`;
      },

    },

    S: Static

  }
};
