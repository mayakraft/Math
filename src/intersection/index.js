import type_of from "../arguments/typeof";

import {
  intersect_lines,
  include_l, include_r, include_s,
  exclude_l, exclude_r, exclude_s,
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
const lineFunc = (a, b, compA, compB, epsilon) => intersect_lines(
  a.vector, a.origin, b.vector, b.origin, compA, compB, epsilon
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
    line: (a, b, ep) => lineFunc(a, b, exclude_l, exclude_l, ep),
    ray: (a, b, ep) => lineFunc(a, b, exclude_l, exclude_r, ep),
    segment: (a, b, ep) => lineFunc(a, b, exclude_l, exclude_s, ep),
  },
  ray: {
    polygon: (a, b) => convexPolyRay(b, a),
    circle: (a, b) => circle_ray(b, a),
    line: (a, b, ep) => lineFunc(b, a, exclude_l, exclude_r, ep),
    ray: (a, b, ep) => lineFunc(a, b, exclude_r, exclude_r, ep),
    segment: (a, b, ep) => lineFunc(a, b, exclude_r, exclude_s, ep),
  },
  segment: {
    polygon: (a, b) => convexPolySegment(b, a),
    circle: (a, b) => circle_segment(b, a),
    line: (a, b, ep) => lineFunc(b, a, exclude_l, exclude_s, ep),
    ray: (a, b, ep) => lineFunc(b, a, exclude_r, exclude_s, ep),
    segment: (a, b, ep) => lineFunc(a, b, exclude_s, exclude_s, ep),
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
