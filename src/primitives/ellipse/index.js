import Constructors from "../constructors";
import { distance2 } from "../../core/algebra";
import { nearest_point_on_ellipse } from "../../core/nearest";
import {
  resize,
  flatten_arrays,
  get_vector,
  get_vector_of_vectors,
} from "../../parsers/arguments";
import Intersect from "../../intersection/index";

const f = (n) => (Number.isInteger(n) ? n : n.toFixed(4));

export default {
  ellipse: {
    A: function () {
      const arr = Array.from(arguments);
      const numbers = flatten_arrays(arguments).filter(a => !isNaN(a));
      const params = resize(5, numbers);
      this.rx = params[0];
      this.ry = params[1];
      this.origin = [params[2], params[3]];
      this.spin = params[4];
      this.arcStart = (typeof arr[5] === "number") ? arr[5] : 0;
      this.arcEnd = (typeof arr[6] === "number") ? arr[6] : Math.PI * 2;
      // const numbers = arr.filter(param => !isNaN(param));
      // const vectors = get_vector_of_vectors(arr);
      // if (numbers.length === 4) {
      //   // this.origin = Constructors.vector(numbers[0], numbers[1]);
      //   // this.rx = numbers[2];
      //   // this.ry = numbers[3];
      // } else if (vectors.length === 2) {
      //   // two foci
      //   // this.radius = distance2(...vectors);
      //   // this.origin = Constructors.vector(...vectors[0]);
      // }
    },

    G: {
      x: function () { return this.origin[0]; },
      y: function () { return this.origin[1]; },
      // foci: function () { return this.origin[0]; }
      path: function () {
        const info = this.pathInfo();
        // (rx ry x-axis-rotation large-arc-flag sweep-flag x y)+
        return `M${f(info.x1)} ${f(info.y1)}A${f(this.rx)} ${f(this.ry)} ${f(this.spin * 180 / Math.PI)} ${f(info.fa)} ${f(info.fs)} ${f(info.x2)} ${f(info.y2)}A${f(this.rx)} ${f(this.ry)} ${f(this.spin * 180 / Math.PI)} ${f(info.fa)} ${f(info.fs)} ${f(info.x1)} ${f(info.y1)}`;
      },
    },
    M: {
      nearestPoint: function () {
        return Constructors.vector(nearest_point_on_ellipse(
          this.origin,
          this.radius,
          get_vector(arguments)
        ));
      },
      intersect: function (object) {
        return Intersect(this, object);
      },

      pathInfo: function (arcStart = this.arcStart, arcEnd = this.arcEnd) {
        arcEnd = arcEnd / 2; // we need to divide the circle in half and make 2 arcs
        const cosSpin = Math.cos(this.spin);
        const sinSpin = Math.sin(this.spin);
        const cosStart = Math.cos(arcStart);
        const sinStart = Math.sin(arcStart);
        const cosEnd = Math.cos(arcEnd);
        const sinEnd = Math.sin(arcEnd);
        // const m = [cosSpin, sinSpin, -sinSpin, cosSpin];
        const x1 = this.origin[0]
          + cosSpin * this.rx * cosStart + -sinSpin * this.ry * sinStart;
        const y1 = this.origin[1]
          + sinSpin * this.rx * cosStart + cosSpin * this.ry * sinStart;
        const x2 = this.origin[0]
          + cosSpin * this.rx * cosEnd + -sinSpin * this.ry * sinEnd;
        const y2 = this.origin[1]
          + sinSpin * this.rx * cosEnd + cosSpin * this.ry * sinEnd;
        const fa = (arcEnd - arcStart > Math.PI) ? 1 : 0;
        const fs = (arcEnd - arcStart > 0) ? 1 : 0;
        return { x1, y1, x2, y2, fa, fs };
      }
    },

    S: {
      // static methods
      fromPoints: function () {
        const points = get_vector_of_vectors(arguments);
        return Constructors.circle(points, distance2(points[0], points[1]));
      }
    }
  }
};
