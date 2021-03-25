import Constructors from "../constructors";
import { resize } from "../../arguments/resize";
import { get_vector, get_line } from "../../arguments/get";
import {
  include_l,
  exclude_l,
} from "../../arguments/functions";
import {
  add,
  scale,
} from "../../core/algebra";
import {
  vector_origin_to_ud,
  ud_to_vector_origin
} from "../../core/parameterize";
import Static from "./static";
import methods from "./methods";

export default {
  line: {
    P: Object.prototype,

    A: function () {
      const l = get_line(...arguments);
      this.vector = Constructors.vector(l.vector);
      this.origin = Constructors.vector(resize(this.vector.length, l.origin));
      const ud = vector_origin_to_ud({ vector: this.vector, origin: this.origin });
      this.u = ud.u;
      this.d = ud.d;
      Object.defineProperty(this, "domain_function", { writable: true, value: include_l });
    },

    G: {
      // length: () => Infinity,
      dimension: function () {
        return [this.vector, this.origin]
          .map(p => p.length)
          .reduce((a, b) => Math.max(a, b), 0);
      },
    },

    M: Object.assign({}, methods, {
      inclusive: function () { this.domain_function = include_l; return this; },
      exclusive: function () { this.domain_function = exclude_l; return this; },
      clip_function: dist => dist,
      svgPath: function (length = 20000) {
        const start = add(this.origin, scale(this.vector, -length / 2));
        const end = scale(this.vector, length);
        return `M${start[0]} ${start[1]}l${end[0]} ${end[1]}`;
      },
    }),

    S: Object.assign({
      fromUD: function() {
        const u = get_vector(...Array.from(arguments).slice(0, arguments.length - 1));
        const d = arguments[arguments.length - 1];
        return this.constructor(ud_to_vector_origin({ u, d }));
      },
    }, Static)

  }
};

