import type_of from "../arguments/typeof";

import {
  intersect as line,
  comp_l_l, comp_l_r, comp_l_s, comp_r_r, comp_r_s, comp_s_s,
  exclude_l_r, exclude_l_s, exclude_r_r, exclude_r_s, exclude_s_s,
} from "./lines";

import {
  circle_line,
  circle_ray,
  circle_segment,
  circle_circle,
} from "./circle";

import {
  convex_poly_line,
  convex_poly_ray,
  convex_poly_segment,
} from "./polygon";

const convexPolyLine = (a, b) => convex_poly_line(
  a.constructor === Array ? a : a.points, b.vector, b.origin);
const convexPolyRay = (a, b) => convex_poly_ray(
  a.constructor === Array ? a : a.points, b.vector, b.origin);
const convexPolySegment = (a, b) => convex_poly_segment(
  a.constructor === Array ? a : a.points, b[0], b[1]);

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
    line: (a, b) => line(a, b, comp_l_l),
    ray: (a, b, c) => line(a, b, c === false ? exclude_l_r : comp_l_r),
    segment: (a, b, c) => line(a, b, c === false ? exclude_l_s : comp_l_s),
  },
  ray: {
    polygon: (a, b) => convexPolyRay(b, a),
    circle: (a, b) => circle_ray(b, a),
    line: (a, b, c) => line(b, a, c === false ? exclude_l_r : comp_l_r),
    ray: (a, b, c) => line(a, b, c === false ? exclude_r_r : comp_r_r),
    segment: (a, b, c) => line(a, b, c === false ? exclude_r_s : comp_r_s),
  },
  segment: {
    polygon: (a, b) => convexPolySegment(b, a),
    circle: (a, b) => circle_segment(b, a),
    line: (a, b, c) => line(b, a, c === false ? exclude_l_s : comp_l_s),
    ray: (a, b, c) => line(b, a, c === false ? exclude_r_s : comp_r_s),
    segment: (a, b, c) => line(a, b, c === false ? exclude_s_s : comp_s_s),
  },
};

const intersect = function (a, b, c) {
  const aT = type_of(a);
  const bT = type_of(b);
  return intersect_func[aT][bT](a, b, c);
};

export default intersect;
