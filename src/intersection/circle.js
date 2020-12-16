import { EPSILON } from "../core/constants";

const acossafe = function (x) {
  if (x >= 1.0) return 0;
  if (x <= -1.0) return Math.PI;
  return Math.acos(x);
};
const rotatePoint = function (fp, pt, a) {
  const x = pt[0] - fp[0];
  const y = pt[1] - fp[1];
  const xRot = x * Math.cos(a) + y * Math.sin(a);
  const yRot = y * Math.cos(a) - x * Math.sin(a);
  return [fp[0] + xRot, fp[1] + yRot];
};
export const circle_circle = function (c1, c2, epsilon = EPSILON) {
  const r = (c1.radius < c2.radius) ? c1.radius : c2.radius;
  const R = (c1.radius < c2.radius) ? c2.radius : c1.radius;
  const smCenter = (c1.radius < c2.radius) ? c1.origin : c2.origin;
  const bgCenter = (c1.radius < c2.radius) ? c2.origin : c1.origin;
  const vec = [smCenter[0] - bgCenter[0], smCenter[1] - bgCenter[1]];
  const d = Math.sqrt((vec[0] ** 2) + (vec[1] ** 2));
  // infinite solutions // don't need this because the below case covers it
  // if (d < epsilon && Math.abs(R - r) < epsilon) { return undefined; }
  // no intersection (same center, different size)
  if (d < epsilon) { return undefined; }
  const point = vec.map((v, i) => v / d * R + bgCenter[i]);
  // kissing circles
  if (Math.abs((R + r) - d) < epsilon
    || Math.abs(R - (r + d)) < epsilon) { return [point]; }
  // circles are contained
  if ((d + r) < R || (R + r < d)) { return undefined; }
  const angle = acossafe((r * r - d * d - R * R) / (-2.0 * d * R));
  const pt1 = rotatePoint(bgCenter, point, +angle);
  const pt2 = rotatePoint(bgCenter, point, -angle);
  return [pt1, pt2];
};

export const intersect_circle_line = function (circleRadius, circleOrigin, vector, origin, func, epsilon = EPSILON) {
  const magSq = vector[0] ** 2 + vector[1] ** 2;
  const mag = Math.sqrt(magSq);
  const norm = mag === 0 ? vector : vector.map(c => c / mag);
  const rot90 = [-norm[1], norm[0]];
  const bvec = [origin[0] - circleOrigin[0], origin[1] - circleOrigin[1]];
  const det = bvec[0] * norm[1] - norm[0] * bvec[1];
  if (Math.abs(det) > circleRadius + epsilon) { return undefined; }
  const side = Math.sqrt((circleRadius ** 2) - (det ** 2));
  const f = (s, i) => circleOrigin[i] - rot90[i] * det + norm[i] * s;
  const results = Math.abs(circleRadius - Math.abs(det)) < epsilon
    ? [side].map((s) => [s, s].map(f)) // tangent to circle
    : [-side, side].map((s) => [s, s].map(f));
  const ts = results.map(res => res.map((n, i) => n - origin[i]))
    .map(v => v[0] * vector[0] + vector[1] * v[1])
    .map(d => d / magSq);
  return results.filter((_, i) => func(ts[i], epsilon));
};
/*
 * returns an array of array of numbers
 */
const line_func = () => true;
const ray_func = (n, epsilon) => n > -epsilon;
const segment_func = (n, epsilon) => n > -epsilon && n < 1 + epsilon;

export const circle_line = (circle, line, epsilon = EPSILON) => intersect_circle_line(
  circle.radius,
  circle.origin,
  line.vector,
  line.origin,
  line_func,
  epsilon
);

export const circle_ray = (circle, ray, epsilon = EPSILON) => intersect_circle_line(
  circle.radius,
  circle.origin,
  ray.vector,
  ray.origin,
  ray_func,
  epsilon
);

export const circle_segment = (circle, segment, epsilon = EPSILON) => intersect_circle_line(
  circle.radius,
  circle.origin,
  segment.vector,
  segment.origin,
  segment_func,
  epsilon
);
