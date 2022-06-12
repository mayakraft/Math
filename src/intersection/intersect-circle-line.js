/**
 * Math (c) Kraft
 */
import { EPSILON } from "../core/constants";
import { include_l } from "../arguments/functions";
import {
  subtract,
  cross2,
  rotate90,
} from "../core/algebra";
/*
 * returns an array of array of numbers
 */
const intersect_circle_line = (
  circle_radius, circle_origin,
  line_vector, line_origin,
  line_func = include_l,
  epsilon = EPSILON
) => {
  const magSq = line_vector[0] ** 2 + line_vector[1] ** 2;
  const mag = Math.sqrt(magSq);
  const norm = mag === 0 ? line_vector : line_vector.map(c => c / mag);
  const rot90 = rotate90(norm);
  const bvec = subtract(line_origin, circle_origin);
  const det = cross2(bvec, norm);
  if (Math.abs(det) > circle_radius + epsilon) { return undefined; }
  const side = Math.sqrt((circle_radius ** 2) - (det ** 2));
  const f = (s, i) => circle_origin[i] - rot90[i] * det + norm[i] * s;
  const results = Math.abs(circle_radius - Math.abs(det)) < epsilon
    ? [side].map((s) => [s, s].map(f)) // tangent to circle
    : [-side, side].map((s) => [s, s].map(f));
  const ts = results.map(res => res.map((n, i) => n - line_origin[i]))
    .map(v => v[0] * line_vector[0] + line_vector[1] * v[1])
    .map(d => d / magSq);
  return results.filter((_, i) => line_func(ts[i], epsilon));
};

export default intersect_circle_line;

