import type_of from "../arguments/typeof";

import {
  intersect_lines,
  include_l_l, include_l_r, include_l_s, include_r_r, include_r_s, include_s_s,
  exclude_l_l, exclude_l_r, exclude_l_s, exclude_r_r, exclude_r_s, exclude_s_s,
} from "./lines";

import {
  circle_line,
  circle_ray,
  circle_segment,
  circle_circle,
} from "./circle";

import {
  convex_poly_line_exclusive,
  convex_poly_ray_exclusive,
  convex_poly_segment_exclusive,
} from "./polygon";

const convexPolyLine = (a, b) => convex_poly_line_exclusive(a, b.vector, b.origin);
const convexPolyRay = (a, b) => convex_poly_ray_exclusive(a, b.vector, b.origin);
const convexPolySegment = (a, b) => convex_poly_segment_exclusive(a, b[0], b[1]);
const lineFunc = (a, b, compFunc, epsilon) => intersect_lines(
  a.vector, a.origin, b.vector, b.origin, compFunc, epsilon
);

const intersect_func = {
  polygon: {
    // polygon: convex_poly_convex_poly,
    // circle: convex_poly_circle,
    line: convexPolyLine,
    ray: convexPolyRay,
    segment: convexPolySegment,
  },
  circle: {
    // polygon: (a, b) => convex_poly_circle(b, a),
    circle: circle_circle,
    line: circle_line,
    ray: circle_ray,
    segment: circle_segment,
  },
  line: {
    polygon: (a, b) => convexPolyLine(b, a),
    circle: (a, b) => circle_line(b, a),
    line: (a, b) => lineFunc(a, b, include_l_l),
    ray: (a, b, c) => lineFunc(a, b, c === false ? exclude_l_r : include_l_r),
    segment: (a, b, c) => lineFunc(a, b, c === false ? exclude_l_s : include_l_s),
  },
  ray: {
    polygon: (a, b, c) => convexPolyRay(b, a),
    circle: (a, b) => circle_ray(b, a),
    line: (a, b, c) => lineFunc(b, a, c === false ? exclude_l_r : include_l_r),
    ray: (a, b, c) => lineFunc(a, b, c === false ? exclude_r_r : include_r_r),
    segment: (a, b, c) => lineFunc(a, b, c === false ? exclude_r_s : include_r_s),
  },
  segment: {
    polygon: (a, b, c) => convexPolySegment(b, a),
    circle: (a, b) => circle_segment(b, a),
    line: (a, b, c) => lineFunc(b, a, c === false ? exclude_l_s : include_l_s),
    ray: (a, b, c) => lineFunc(b, a, c === false ? exclude_r_s : include_r_s),
    segment: (a, b, c) => lineFunc(a, b, c === false ? exclude_s_s : include_s_s),
  },
};

// convert "rect" to "polygon"
const intersect_types = {
  polygon: "polygon",
  rect: "polygon",
  circle: "circle",
  line: "line",
  ray: "ray",
  segment: "segment",
};

const intersect = function (a, b) {
  const aT = intersect_types[type_of(a)];
  const bT = intersect_types[type_of(b)];
  return intersect_func[aT][bT](...arguments);
};

export default intersect;
