/**
 * Math (c) Kraft
 */
import Constructors from "../constructors";
import { resize } from "../../arguments/resize";
import { getVector, getLine } from "../../arguments/get";
import {
  includeL,
  excludeL,
} from "../../arguments/functions";
import {
  add,
  scale,
} from "../../core/algebra";
import {
  makeNormalDistanceLine,
  makeVectorOriginLine
} from "../../core/parameterize";
import Static from "./static";
import methods from "./methods";

export default {
  line: {
    P: Object.prototype,

    A: function () {
      const l = getLine(...arguments);
      this.vector = Constructors.vector(l.vector);
      this.origin = Constructors.vector(resize(this.vector.length, l.origin));
      const alt = makeNormalDistanceLine({ vector: this.vector, origin: this.origin });
      this.normal = alt.normal;
      this.distance = alt.distance;
      Object.defineProperty(this, "domain_function", { writable: true, value: includeL });
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
      inclusive: function () { this.domain_function = includeL; return this; },
      exclusive: function () { this.domain_function = excludeL; return this; },
      clip_function: dist => dist,
      svgPath: function (length = 20000) {
        const start = add(this.origin, scale(this.vector, -length / 2));
        const end = scale(this.vector, length);
        return `M${start[0]} ${start[1]}l${end[0]} ${end[1]}`;
      },
    }),

    S: Object.assign({
      fromNormalDistance: function() {
        return this.constructor(makeVectorOriginLine(arguments[0]));
      },
    }, Static)

  }
};

