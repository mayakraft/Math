import Constructors from "../constructors";
import { distance2 } from "../../core/algebra";
import { nearest_point_on_ellipse } from "../../core/nearest";
import {
  get_vector,
  get_vector_of_vectors,
} from "../../parsers/arguments";
import Intersect from "../../intersection/index";

const f = (n) => (Number.isInteger(n) ? n : n.toFixed(4));

// const pathArcValue = () => `A${f(this.rx)} ${f(this.ry)} ${f(this.spin)} ${f(info.fa)} ${f(info.fs)} ${f(info.x2)} ${f(info.y2)}`;

export default {
  ellipse: {
    A: function () {
      const arr = Array.from(arguments);
      this.arcStart = 0;
      this.arcEnd = Math.PI * 2;
      this.rx = arr[0];
      this.ry = arr[1];
      this.spin = arr[2];
      this.origin = arr[3];
      if (typeof arr[4] === "number") {
        this.arcStart = arr[4];
      }
      if (typeof arr[5] === "number") {
        this.arcEnd = arr[5];
      }
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
        return `M${f(info.x1)} ${f(info.y1)}A${f(this.rx)} ${f(this.ry)} ${f(this.spin)} ${f(info.fa)} ${f(info.fs)} ${f(info.x2+0.001)} ${f(info.y2+0.001)}`;
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
      pathInfo: function () {
        const cos = Math.cos(this.spin);
        const sin = Math.sin(this.spin);
        const m = [cos, sin, -sin, cos];
        const x1 = m[0] * this.rx * Math.cos(this.arcStart)
          + m[2] * this.ry * Math.sin(this.arcStart)
          + this.origin[0];
        const y1 = m[1] * this.rx * Math.cos(this.arcStart)
          + m[3] * this.ry * Math.sin(this.arcStart)
          + this.origin[1];
        const x2 = m[0] * this.rx * Math.cos(this.arcEnd)
          + m[2] * this.ry * Math.sin(this.arcEnd)
          + this.origin[0];
        const y2 = m[1] * this.rx * Math.cos(this.arcEnd)
          + m[3] * this.ry * Math.sin(this.arcEnd)
          + this.origin[1];
        const fa = (this.arcEnd - this.arcStart > Math.PI)
          ? 1
          : 0;
        const fs = (this.arcEnd - this.arcStart > 0)
          ? 1
          : 0;
        return {
          x1, y1, x2, y2, fa, fs
        };
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
