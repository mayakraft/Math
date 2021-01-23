import Constructors from "../constructors";
import Prototype from "../prototypes/polygon";
import { enclosing_rectangle } from "../../core/geometry";
import { include, exclude } from "../../arguments/functions";
import {
  get_rect,
  get_vector_of_vectors,
} from "../../arguments/get";

/**
 * this Rectangle type is aligned to the axes for speedy calculation.
 * for a rectangle that can be rotated, use Polygon or ConvexPolygon
 */
const rectToPoints = r => [
  [r.x, r.y],
  [r.x + r.width, r.y],
  [r.x + r.width, r.y + r.height],
  [r.x, r.y + r.height]
];

const rectToSides = r => [
  [[r.x, r.y], [r.x + r.width, r.y]],
  [[r.x + r.width, r.y], [r.x + r.width, r.y + r.height]],
  [[r.x + r.width, r.y + r.height], [r.x, r.y + r.height]],
  [[r.x, r.y + r.height], [r.x, r.y]],
];

export default {
  rect: {
    P: Prototype.prototype,
    A: function () {
      const r = get_rect(...arguments);
      this.width = r.width;
      this.height = r.height;
      this.origin = Constructors.vector(r.x, r.y);
      this.push(...rectToPoints(this));
    },
    G: {
      x: function () { return this.origin[0]; },
      y: function () { return this.origin[1]; },
      center: function () { return Constructors.vector(
        this.origin[0] + this.width / 2,
        this.origin[1] + this.height / 2,
      ); },
      // points: function () { return rectToPoints(this); },  // the rect IS "points" now
    },
    M: {
      inclusive: function () { this.domain_function = include; return this; },
      exclusive: function () { this.domain_function = exclude; return this; },
      area: function () { return this.width * this.height; },
      // points: function () { return rectToPoints(this); },
      segments: function () { return rectToSides(this); },
      svgPath: function () {
        return `M${this.origin.join(" ")}h${this.width}v${this.height}h${-this.width}Z`;
      },
    },
    S: {
      fromPoints: function () {
        return Constructors.rect(enclosing_rectangle(get_vector_of_vectors(arguments)));
      }
    }
  }
};
