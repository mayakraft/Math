import { Typeof } from "../parsers/arguments";

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
  convex_poly_ray_exclusive,
} from "./polygon";

const intersection_map = {
  // poly: {
  //   poly: I.poly_poly,
  //   circle: I.poly_circle,
  //   line: I.poly_line,
  //   ray: I.poly_ray,
  //   segment: I.poly_segment,
  // },
  circle: {
    // poly: convex_poly_circle,
    circle: circle_circle,
    line: circle_line,
    ray: circle_ray,
    segment: circle_segment,
  },
  line: {
    poly: (a, b) => convex_poly_line(b, a),
    circle: (a, b) => circle_line(b, a),
    line: (a, b) => line(a, b, comp_l_l),
    ray: (a, b, c) => line(a, b, c === false ? exclude_l_r : comp_l_r),
    segment: (a, b, c) => line(a, b, c === false ? exclude_l_s : comp_l_s),
  },
  ray: {
    poly: (a, b) => convex_poly_ray(b, a),
    circle: (a, b) => circle_ray(b, a),
    line: (a, b, c) => line(b, a, c === false ? exclude_l_r : comp_l_r),
    ray: (a, b, c) => line(a, b, c === false ? exclude_r_r : comp_r_r),
    segment: (a, b, c) => line(a, b, c === false ? exclude_r_s : comp_r_s),
  },
  segment: {
    poly: (a, b) => convex_poly_segment(b, a),
    circle: (a, b) => circle_segment(b, a),
    line: (a, b, c) => line(b, a, c === false ? exclude_l_s : comp_l_s),
    ray: (a, b, c) => line(b, a, c === false ? exclude_r_s : comp_r_s),
    segment: (a, b, c) => line(a, b, c === false ? exclude_s_s : comp_s_s),
  },
};

const Intersect = function (a, b) {
  const aT = Typeof(a);
  const bT = Typeof(b);
  const func = intersection_map[aT][bT];
  return func(a, b);
};

export default Intersect;
