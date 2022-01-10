import type_of from "../arguments/typeof";
import {
  include, exclude,
  include_l, include_r, include_s,
  exclude_l, exclude_r, exclude_s,
} from "../arguments/functions";
import { subtract } from "../core/algebra";
import intersect_line_line from "./intersect-line-line";
import intersect_circle_circle from "./intersect-circle-circle";
import intersect_circle_line from "./intersect-circle-line";
import intersect_convex_polygon_line from "./intersect-polygon-line";
import intersect_polygon_polygon from "./intersect-polygon-polygon";

// all intersection functions expect primitives to be in a certain form
// for example all lines are: vector, origin
const intersect_param_form = {
  polygon: a => [a],
  rect: a => [a],
  circle: a => [a.radius, a.origin],
  line: a => [a.vector, a.origin],
  ray: a => [a.vector, a.origin],
  segment: a => [a.vector, a.origin],
  // segment: a => [subtract(a[1], a[0]), a[0]],
};

const intersect_func = {
  polygon: {
    polygon: intersect_polygon_polygon,
    // circle: convex_poly_circle,
    line: (a, b, fnA, fnB, ep) => intersect_convex_polygon_line(...a, ...b, include_s, fnB, ep),
    ray: (a, b, fnA, fnB, ep) => intersect_convex_polygon_line(...a, ...b, include_s, fnB, ep),
    segment: (a, b, fnA, fnB, ep) => intersect_convex_polygon_line(...a, ...b, include_s, fnB, ep),
  },
  circle: {
    // polygon: (a, b) => convex_poly_circle(b, a),
    circle: (a, b, fnA, fnB, ep) => intersect_circle_circle(...a, ...b, ep),
    line: (a, b, fnA, fnB, ep) => intersect_circle_line(...a, ...b, fnB, ep),
    ray: (a, b, fnA, fnB, ep) => intersect_circle_line(...a, ...b, fnB, ep),
    segment: (a, b, fnA, fnB, ep) => intersect_circle_line(...a, ...b, fnB, ep),
  },
  line: {
    polygon: (a, b, fnA, fnB, ep) => intersect_convex_polygon_line(...b, ...a, include_s, fnA, ep),
    circle: (a, b, fnA, fnB, ep) => intersect_circle_line(...b, ...a, fnA, ep),
    line: (a, b, fnA, fnB, ep) => intersect_line_line(...a, ...b, fnA, fnB, ep),
    ray: (a, b, fnA, fnB, ep) => intersect_line_line(...a, ...b, fnA, fnB, ep),
    segment: (a, b, fnA, fnB, ep) => intersect_line_line(...a, ...b, fnA, fnB, ep),
  },
  ray: {
    polygon: (a, b, fnA, fnB, ep) => intersect_convex_polygon_line(...b, ...a, include_s, fnA, ep),
    circle: (a, b, fnA, fnB, ep) => intersect_circle_line(...b, ...a, fnA, ep),
    line: (a, b, fnA, fnB, ep) => intersect_line_line(...b, ...a, fnB, fnA, ep),
    ray: (a, b, fnA, fnB, ep) => intersect_line_line(...a, ...b, fnA, fnB, ep),
    segment: (a, b, fnA, fnB, ep) => intersect_line_line(...a, ...b, fnA, fnB, ep),
  },
  segment: {
    polygon: (a, b, fnA, fnB, ep) => intersect_convex_polygon_line(...b, ...a, include_s, fnA, ep),
    circle: (a, b, fnA, fnB, ep) => intersect_circle_line(...b, ...a, fnA, ep),
    line: (a, b, fnA, fnB, ep) => intersect_line_line(...b, ...a, fnB, fnA, ep),
    ray: (a, b, fnA, fnB, ep) => intersect_line_line(...b, ...a, fnB, fnA, ep),
    segment: (a, b, fnA, fnB, ep) => intersect_line_line(...a, ...b, fnA, fnB, ep),
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

const default_intersect_domain_function = {
  polygon: exclude, // not used
  rect: exclude, // not used
  circle: exclude, // not used
  line: exclude_l,
  ray: exclude_r,
  segment: exclude_s,
};

const intersect = function (a, b, epsilon) {
  const type_a = type_of(a);
  const type_b = type_of(b);
  const aT = similar_intersect_types[type_a];
  const bT = similar_intersect_types[type_b];
  const params_a = intersect_param_form[type_a](a);
  const params_b = intersect_param_form[type_b](b);
  const domain_a = a.domain_function || default_intersect_domain_function[type_a];
  const domain_b = b.domain_function || default_intersect_domain_function[type_b];
  return intersect_func[aT][bT](params_a, params_b, domain_a, domain_b, epsilon);
};

export default intersect;
