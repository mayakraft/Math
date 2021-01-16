import type_of from "../arguments/typeof";
import { subtract } from "../core/algebra";
import {
  include, exclude,
  include_l, include_r, include_s,
  exclude_l, exclude_r, exclude_s,
} from "../arguments/functions";

import intersect_line_line from "./intersect-line-line";
import intersect_circle_circle from "./intersect-circle-circle";
import intersect_circle_line from "./intersect-circle-line";

import {
  convex_poly_line_exclusive,
  convex_poly_ray_exclusive,
  convex_poly_segment_exclusive,
} from "./intersect-polygon-line";

// all intersection functions expect primitives to be in a certain form
// for example all lines are: vector, origin
const intersect_param_form = {
  polygon: a => [a],
  rect: a => [a],
  circle: a => [a.radius, a.origin],
  line: a => [a.vector, a.origin],
  ray: a => [a.vector, a.origin],
  segment: a => [subtract(a[1], a[0]), a[0]],
};

const intersect_func = {
  polygon: {
    // polygon: convex_poly_convex_poly,
    // circle: convex_poly_circle,
    line: (a, b) => convex_poly_line_exclusive(...a, ...b),
    ray: (a, b) => convex_poly_ray_exclusive(...a, ...b),
    segment: (a, b) => convex_poly_segment_exclusive(...a, ...b),
  },
  circle: {
    // polygon: (a, b) => convex_poly_circle(b, a),
    circle: (a, b) => intersect_circle_circle(...a, ...b),
    line: (a, b) => intersect_circle_line(...a, ...b, exclude_l),
    ray: (a, b) => intersect_circle_line(...a, ...b, exclude_r),
    segment: (a, b) => intersect_circle_line(...a, ...b, exclude_s),
  },
  line: {
    polygon: (a, b) => convex_poly_line_exclusive(...b, ...a),
    circle: (a, b) => intersect_circle_line(...b, ...a, exclude_l),
    line: (a, b, ep) => intersect_line_line(...a, ...b, exclude_l, exclude_l, ep),
    ray: (a, b, ep) => intersect_line_line(...a, ...b, exclude_l, exclude_r, ep),
    segment: (a, b, ep) => intersect_line_line(...a, ...b, exclude_l, exclude_s, ep),
  },
  ray: {
    polygon: (a, b) => convex_poly_ray_exclusive(...b, ...a),
    circle: (a, b) => intersect_circle_line(...b, ...a, exclude_r),
    line: (a, b, ep) => intersect_line_line(...b, ...a, exclude_l, exclude_r, ep),
    ray: (a, b, ep) => intersect_line_line(...a, ...b, exclude_r, exclude_r, ep),
    segment: (a, b, ep) => intersect_line_line(...a, ...b, exclude_r, exclude_s, ep),
  },
  segment: {
    polygon: (a, b) => convex_poly_segment_exclusive(...b, ...a),
    circle: (a, b) => intersect_circle_line(...b, ...a, exclude_s),
    line: (a, b, ep) => intersect_line_line(...b, ...a, exclude_l, exclude_s, ep),
    ray: (a, b, ep) => intersect_line_line(...b, ...a, exclude_r, exclude_s, ep),
    segment: (a, b, ep) => intersect_line_line(...a, ...b, exclude_s, exclude_s, ep),
  },
};

// convert "rect" to "polygon"
const similar_intersect_types = {
  polygon: "polygon",
  rect: "polygon",
  circle: "circle",
  line: "line",
  ray: "ray",
  segment: "segment",
};

const intersect = function (a, b, ...args) {
  const type_a = type_of(a);
  const type_b = type_of(b);
  const aT = similar_intersect_types[type_a];
  const bT = similar_intersect_types[type_b];
  const params_a = intersect_param_form[type_a](a);
  const params_b = intersect_param_form[type_b](b);
  return intersect_func[aT][bT](params_a, params_b, ...args);
};

export default intersect;

