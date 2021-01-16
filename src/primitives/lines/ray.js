import Constructors from "../constructors";
import LinePrototype from "../prototypes/line";
import { EPSILON } from "../../core/constants";
import { resize } from "../../arguments/resize";
import { get_line } from "../../arguments/get";
import {
  exclude_r,
  ray_limiter,
} from "../../arguments/functions";
import { flip } from "../../core/algebra";
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
      flip: function () {
        return Constructors.ray(flip(this.vector), this.origin);
      },
      scale: function (scale) {
        return Constructors.ray(this.vector.scale(scale), this.origin);
      },
      normalize: function () {
        return Constructors.ray(this.vector.normalize(), this.origin);
      },
      // distance is between 0 and 1, representing the vector between start and end. cap accordingly
      clip_function: ray_limiter,
			comp_function: exclude_r,
      svgPath: function (length = 10000) {
        const end = this.vector.scale(length);
        return `M${this.origin[0]} ${this.origin[1]}l${end[0]} ${end[1]}`;
      },

    },

    S: Static

  }
};
