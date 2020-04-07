import { Typeof } from "../parsers/arguments";
import * as I from "../core/intersection";

// line_line  // line_line_exclusive
// line_ray  // line_ray_exclusive
// line_segment  // line_segment_exclusive
// ray_ray  // ray_ray_exclusive
// ray_segment  // ray_segment_exclusive
// segment_segment  // segment_segment_exclusive
// circle_line
// circle_ray
// circle_segment
// convex_poly_line
// convex_poly_ray
// convex_poly_segment
// convex_poly_ray_exclusive

const map = {
  // poly: {
  //   poly: I.poly_poly,
  //   circle: I.poly_circle,
  //   line: I.poly_line,
  //   ray: I.poly_ray,
  //   segment: I.poly_segment,
  // },
  circle: {
    poly: (a,b) => I.convex_poly_circle(b, a.origin, a.radius),
    circle: (a,b) => I.circle_circle(a.origin, a.radius, b.origin, b.radius),
    line: (a,b) => I.circle_line(a.origin, a.radius, b.origin, b.vector),
    ray: (a,b) => I.circle_ray(a.origin, a.radius, b.origin, b.vector),
    segment: (a,b) => I.circle_segment(a.origin, a.radius, b[0], b[1]),
  },
  line: {
    poly: (a,b) => I.convex_poly_line(b, a.origin, a.vector),
    circle: (a,b) => I.circle_line(b.origin, b.radius, a.origin, a.vector),
    line: (a,b) => I.line_line(a.origin, a.vector, b.origin, b.vector),
    ray: (a,b) => I.line_ray(a.origin, a.vector, b.origin, b.vector),
    segment: (a,b) => I.line_segment(a.origin, a.vector, b[0], b[1]),
  },
  ray: {
    poly: (a,b) => I.convex_poly_ray(b, a.origin, a.vector),
    circle: (a,b) => I.circle_ray(b.origin, b.radius, a.origin, a.vector),
    line: (a,b) => I.line_ray(b.origin, b.vector, a.origin, a.vector),
    ray: (a,b) => I.ray_ray(a.origin, a.vector, b.origin, b.vector),
    segment: (a,b) => I.ray_segment(a.origin, a.vector, b[0], b[1]),
  },
  segment: {
    poly: (a,b) => I.convex_poly_segment(b, a.origin, a.vector),
    circle: (a,b) => I.circle_segment(b.origin, b.radius, a[0], a[1]),
    line: (a,b) => I.line_segment(b.origin, b.vector, a[0], a[1]),
    ray: (a,b) => I.ray_segment(b.origin, b.vector, a[0], a[1]),
    segment: (a,b) => I.segment_segment(a[0], a[1], b[0], b[1]),
  },
};

const intersect = function (a, b) {
  const aT = Typeof(a);
  const bT = Typeof(b);
  const func = map[aT][bT];
  return func(a, b);
};

export default intersect;
