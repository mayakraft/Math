import { EPSILON } from "../core/equal";

/*
 ██████╗ ██╗ ██████╗   ██████╗ ██╗      ███████╗ ███████╗
██╔════╝ ██║ ██╔══██╗ ██╔════╝ ██║      ██╔════╝ ██╔════╝
██║      ██║ ██████╔╝ ██║      ██║      █████╗   ███████╗
██║      ██║ ██╔══██╗ ██║      ██║      ██╔══╝   ╚════██║
╚██████╗ ██║ ██║  ██║ ╚██████╗ ███████╗ ███████╗ ███████║
 ╚═════╝ ╚═╝ ╚═╝  ╚═╝  ╚═════╝ ╚══════╝ ╚══════╝ ╚══════╝
 * inputs: circles, lines
 * solutions: points
 */

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
  // infinite solutions
  if (d < epsilon && Math.abs(R - r) < epsilon) { return undefined; }
  // no intersection (same center, different size)
  else if (d < epsilon) { return undefined; }
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

/*
 * returns an array of array of numbers
 */
export const circle_line = function (circle, line, epsilon = EPSILON) {
  const magSq = line.vector[0] ** 2 + line.vector[1] ** 2;
  const mag = Math.sqrt(magSq);
  const norm = mag === 0 ? line.vector : line.vector.map(c => c / mag);
  // const norm = normalize(line.vector);
  const rot90 = [-norm[1], norm[0]];
  const bvec = [line.origin[0] - circle.origin[0], line.origin[1] - circle.origin[1]];
  const det = bvec[0] * norm[1] - norm[0] * bvec[1];
  if (Math.abs(det) > circle.radius + epsilon) { return undefined; }
  const side = Math.sqrt((circle.radius ** 2) - (det ** 2));
  const f = (s, i) => circle.origin[i] - rot90[i] * det + norm[i] * s;
  return Math.abs(circle.radius - Math.abs(det)) < epsilon
    ? [side].map((s) => [s,s].map(f)) // tangent to circle
    : [-side, side].map((s) => [s,s].map(f));
};

export const circle_ray = function (circle, ray, epsilon = EPSILON) {
  const magSq = ray.vector[0] ** 2 + ray.vector[1] ** 2;
  const mag = Math.sqrt(magSq);
  const norm = mag === 0 ? ray.vector : ray.vector.map(c => c / mag);
  // const norm = normalize(ray.vector);
  const rot90 = [-norm[1], norm[0]];
  const bvec = [ray.origin[0] - circle.origin[0], ray.origin[1] - circle.origin[1]];
  const det = bvec[0] * norm[1] - norm[0] * bvec[1];
  if (Math.abs(det) > circle.radius + epsilon) { return undefined; }
  const side = Math.sqrt((circle.radius ** 2) - (det ** 2));
  const f = (s, i) => circle.origin[i] - rot90[i] * det + norm[i] * s;
  const result = Math.abs(circle.radius - Math.abs(det)) < epsilon
    ? [side].map((s) => [s,s].map(f)) // tangent to circle
    : [-side, side].map((s) => [s,s].map(f));
  const ts = result.map(res => res.map((n, i) => n - ray.origin[i]))
    .map(v => v[0] * ray.vector[0] + ray.vector[1] * v[1])
    .map(d => d / magSq);
  return result.filter((_,i) => ts[i] > -epsilon);
  // // const dets = resultVecs.map(v => v[0] * lvec[1] - lvec[0] * v[1]);
  // const vecDet = lpt[1] * lvec[0] - lpt[0] * lvec[1];
  // const resultDets = resultVecs.map(v => v[0] * lpt[1] - lpt[0] * v[1]);
  // // console.log(resultDets.map((d, i) => d / vecDet / ));
};

export const circle_segment = function (circle, segment, epsilon = EPSILON) {
  const magSq = segment.vector[0] ** 2 + segment.vector[1] ** 2;
  const mag = Math.sqrt(magSq);
  const norm = mag === 0 ? segment.vector : segment.vector.map(c => c / mag);
  // const norm = normalize(segment.vector);
  const rot90 = [-norm[1], norm[0]];
  const bvec = [segment.origin[0] - circle.origin[0], segment.origin[1] - circle.origin[1]];
  const det = bvec[0] * norm[1] - norm[0] * bvec[1];
  if (Math.abs(det) > circle.radius + epsilon) { return undefined; }
  const side = Math.sqrt((circle.radius ** 2) - (det ** 2));
  const f = (s, i) => circle.origin[i] - rot90[i] * det + norm[i] * s;
  const result = Math.abs(circle.radius - Math.abs(det)) < epsilon
    ? [side].map((s) => [s,s].map(f)) // tangent to circle
    : [-side, side].map((s) => [s,s].map(f));
  const ts = result.map(res => res.map((n, i) => n - segment.origin[i]))
    .map(v => v[0] * segment.vector[0] + segment.vector[1] * v[1])
    .map(d => d / magSq);
  return result.filter((_,i) => ts[i] > -epsilon && ts[i] < 1 + epsilon);
};


/*
 * returns an array of array of numbers
 */
// export const circle_line_old = function (center, radius, p0, p1, epsilon = EPSILON) {
//   // move the origin to the center of the circle
//   const x1 = p0[0] - center[0];
//   const y1 = p0[1] - center[1];
//   const x2 = p1[0] - center[0];
//   const y2 = p1[1] - center[1];
//   const dx = x2 - x1;
//   const dy = y2 - y1;
//   const det = x1 * y2 - x2 * y1;
//   const det_sq = det * det;
//   const r_sq = radius * radius;
//   const dr_sq = Math.abs(dx * dx + dy * dy);
//   const delta = r_sq * dr_sq - det_sq;
//   // no solution
//   if (delta < -epsilon) { return undefined; }
//   // shorthand things
//   const suffix = Math.sqrt(r_sq * dr_sq - det_sq);
//   function sgn(x) { return (x < -epsilon) ? -1 : 1; }
//   const solutionA = [
//     center[0] + (det * dy + sgn(dy) * dx * suffix) / dr_sq,
//     center[1] + (-det * dx + Math.abs(dy) * suffix) / dr_sq,
//   ];
//   if (delta > epsilon) {
//     // two solutions
//     const solutionB = [
//       center[0] + (det * dy - sgn(dy) * dx * suffix) / dr_sq,
//       center[1] + (-det * dx - Math.abs(dy) * suffix) / dr_sq,
//     ];
//     return [solutionA, solutionB];
//   }
//   // else, delta == 0, line is tangent, one solution
//   return [solutionA];
// };

// export const circle_ray = function (center, radius, p0, p1) {
//   throw "circle_ray has not been written yet";
// };

// export const circle_segment = function (center, radius, p0, p1) {
//   const r_squared = radius ** 2;
//   const x1 = p0[0] - center[0];
//   const y1 = p0[1] - center[1];
//   const x2 = p1[0] - center[0];
//   const y2 = p1[1] - center[1];
//   const dx = x2 - x1;
//   const dy = y2 - y1;
//   const dr_squared = dx * dx + dy * dy;
//   const D = x1 * y2 - x2 * y1;
//   function sgn(x) { if (x < 0) { return -1; } return 1; }
//   const x_1 = (D * dy + sgn(dy) * dx * Math.sqrt(r_squared * dr_squared - D * D)) / (dr_squared);
//   const x_2 = (D * dy - sgn(dy) * dx * Math.sqrt(r_squared * dr_squared - D * D)) / (dr_squared);
//   const y_1 = (-D * dx + Math.abs(dy) * Math.sqrt(r_squared * dr_squared - D * D)) / (dr_squared);
//   const y_2 = (-D * dx - Math.abs(dy) * Math.sqrt(r_squared * dr_squared - D * D)) / (dr_squared);
//   const x1_NaN = isNaN(x_1);
//   const x2_NaN = isNaN(x_2);
//   if (!x1_NaN && !x2_NaN) {
//     return [
//       [x_1 + center[0], y_1 + center[1]],
//       [x_2 + center[0], y_2 + center[1]],
//     ];
//   }
//   if (x1_NaN && x2_NaN) { return undefined; }
//   if (!x1_NaN) {
//     return [[x_1 + center[0], y_1 + center[1]]];
//   }
//   if (!x2_NaN) {
//     return [[x_2 + center[0], y_2 + center[1]]];
//   }
//   return undefined;
// };

