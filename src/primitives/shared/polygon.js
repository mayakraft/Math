import Constructors from "../constructors";
import {
  subtract,
  distance2,
} from "../../core/algebra";
import { multiply_matrix3_vector3 } from "../../core/matrix3";
import {
  signed_area,
  centroid,
  enclosing_rectangle,
  split_convex_polygon,
  straight_skeleton,
} from "../../core/geometry";
import Typeof from "../../arguments/typeof";
import {
  get_vector,
  get_matrix_3x4,
  get_line,
  get_segment,
} from "../../arguments/get";
import {
  resize,
  semi_flatten_arrays,
} from "../../arguments/resize";
import { include } from "../../arguments/functions";
import Intersect from "../../intersection/intersect";
import Overlap from "../../intersection/overlap";
import clip_line_in_convex_polygon from "../../clip/polygon";
import {
  nearest_point_on_line,
  nearest_point_on_polygon,
} from "../../core/nearest";

// a polygon is expecting to have these properties:
// this - an array of vectors in [] form
// this.points - same as above
// this.sides - array edge pairs of points
// this.vectors - non-normalized vectors relating to this.sides.
const methods = {
  area: function () {
    return signed_area(this);
  },
  // midpoint: function () { return average(this); },
  centroid: function () {
    return Constructors.vector(centroid(this));
  },
  enclosingRectangle: function () {
    return Constructors.rect(enclosing_rectangle(this));
  },
  // contains: function () {
  //   return overlap_convex_polygon_point(this, get_vector(arguments));
  // },
  straightSkeleton: function () {
    return straight_skeleton(this);
  },
  // scale will return a rect for rectangles, otherwise polygon
  scale: function (magnitude, center = centroid(this)) {
    const newPoints = this
      .map(p => [0, 1].map((_, i) => p[i] - center[i]))
      .map(vec => vec.map((_, i) => center[i] + vec[i] * magnitude));
    return this.constructor.fromPoints(newPoints);
  },
  rotate: function (angle, centerPoint = centroid(this)) {
    const newPoints = this.map((p) => {
      const vec = [p[0] - centerPoint[0], p[1] - centerPoint[1]];
      const mag = Math.sqrt((vec[0] ** 2) + (vec[1] ** 2));
      const a = Math.atan2(vec[1], vec[0]);
      return [
        centerPoint[0] + Math.cos(a + angle) * mag,
        centerPoint[1] + Math.sin(a + angle) * mag,
      ];
    });
    return Constructors.polygon(newPoints);
  },
  translate: function () {
    const vec = get_vector(...arguments);
    const newPoints = this.map(p => p.map((n, i) => n + vec[i]));
    return this.constructor.fromPoints(newPoints);
  },
  transform: function () {
    const m = get_matrix_3x4(...arguments);
    const newPoints = this
      .map(p => multiply_matrix3_vector3(m, resize(3, p)));
    return Constructors.polygon(newPoints);
  },
  // sectors: function () {
  //   return this.map((p, i, arr) => {
  //     const prev = (i + arr.length - 1) % arr.length;
  //     const next = (i + 1) % arr.length;
  //     const center = p;
  //     const a = arr[prev].map((n, j) => n - center[j]);
  //     const b = arr[next].map((n, j) => n - center[j]);
  //     return Constructors.sector(b, a, center);
  //   });
  // },
  nearest: function () {
    const point = get_vector(...arguments);
    const result = nearest_point_on_polygon(this, point);
    return result === undefined
      ? undefined
      : Object.assign(result, { edge: this.sides[result.i] });
  },
  split: function () {
    const line = get_line(...arguments);
    // const split_func = this.isConvex ? split_convex_polygon : split_polygon;
    const split_func = split_convex_polygon;
    return split_func(this, line.vector, line.origin)
      .map(poly => Constructors.polygon(poly));
  },
  overlap: function () {
    return Overlap(this, ...arguments);
  },
  intersect: function () {
    return Intersect(this, ...arguments);
  },
  clip: function (line_type, epsilon) {
    const fn_line = line_type.domain_function ? line_type.domain_function : include_l;
    const segment = clip_line_in_convex_polygon(this,
      line_type.vector,
      line_type.origin,
      this.domain_function,
      fn_line,
      epsilon);
    return segment ? Constructors.segment(segment) : undefined;
  },
  svgPath: function () {
    // make every point a Move or Line command, append with a "z" (close path)
    const pre = Array(this.length).fill("L");
    pre[0] = "M";
    return `${this.map((p, i) => `${pre[i]}${p[0]} ${p[1]}`).join("")}z`;
  },
};

export default methods;

