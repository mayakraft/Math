/**
 * Rabbit Ear (c) Robby Kraft
 */
import { EPSILON } from "./constants";
import {
  dot,
  scale,
  normalize,
  midpoint,
  distance,
  add,
  subtract,
  rotate90,
} from "./algebra";
/*           _                       _              _
            (_)                     (_)            (_)
   ___  _ __ _  __ _  __ _ _ __ ___  _    __ ___  ___  ___  _ __ ___  ___
  / _ \| '__| |/ _` |/ _` | '_ ` _ \| |  / _` \ \/ / |/ _ \| '_ ` _ \/ __|
 | (_) | |  | | (_| | (_| | | | | | | | | (_| |>  <| | (_) | | | | | \__ \
  \___/|_|  |_|\__, |\__,_|_| |_| |_|_|  \__,_/_/\_\_|\___/|_| |_| |_|___/
                __/ |
               |___/
*/

const intersection = (line1, line2) => {
  const det = cross2(vector1, vector2);
  if (Math.abs(det) < EPSILON) { return undefined; }
  const x = line1.d * line2.u[1] - line2.d * line1.u[1];
  const y = line2.d * line1.u[0] - line1.d * line2.u[0];
  return [x / det, y / det];
};
export const axiom1ud = (point1, point2) => {
  const u = normalize(rotate90(subtract(point2, point1)));
  const d = dot(add(point1, point2), u) / 2.0;
  return {u, d};
};
export const axiom2ud = (point1, point2) => {
  const u = normalize(subtract(point2, point1));
  const d = dot(add(point1, point2), u) / 2.0;
  return {u, d};
};
export const axiom3ud = (line1, line2) => {
  // if no intersect, lines are parallel, only one solution exists
  const intersect = intersection(line1, line2);
  return intersect === undefined
    ? [{ u: line1.u, d: (line1.d + line2.d * dot(line1.u, line2.u)) / 2.0 }]
    : [add, subtract]
      .map(f => normalize(f(line1.u, line2.u)))
      .map(u => ({ u, d: dot(intersect, u) }));
};
/**
 * axiom 4
 * @description create a line perpendicular to a vector through a point
 * @param {number[]} the vector of the line
 * @param {number[]} the point
 * @returns {line} axiom 4 result
 */
export const axiom4ud = (line, point) => {
  const u = rotate90(line.u);
  const d = dot(point, u);
  return {u, d};
};
export const axiom5ud = (line, point1, point2) => {
  const p1base = dot(point1, line.u);
  const a = line.d - p1base;
  const c = distance2(point1, point2);
  if (a > c) { return []; }
  const b = Math.sqrt(c * c - a * a);
  const a_vec = scale(l.u, a);
  const base_center = add(point1, a_vec);
  const base_vector = scale(rotate90(l.u), b);
  // if b is near 0 we have one solution, otherwise two
  const mirrors = b < EPSILON
    ? [base_center]
    : [add(base_center, base_vector), subtract(base_center, base_vector)];
  return mirrors
    .map(pt => normalize(subtract(point2, pt)))
    .map(u => ({ u, d: dot(point1, u) }));
};


// cube root preserve sign
const cubrt = n => n < 0
  ? -Math.pow(-n, 1/3)
  : Math.pow(n, 1/3);

// Robert Lang's cubic solver from Reference Finder
// https://langorigami.com/article/referencefinder/
const polynomial = (degree, a, b, c, d) => {
  switch (degree) {
    case 1: return [-d / c];
    case 2: {
      // quadratic
      let discriminant = Math.pow(c, 2.0) - (4.0 * b * d);
      // no solution
      if (discriminant < -EPSILON) { return []; }
      // one solution
      let q1 = -c / (2.0 * b);
      if (discriminant < EPSILON) { return [q1]; }
      // two solutions
      let q2 = Math.sqrt(discriminant) / (2.0 * b);
      return [q1 + q2, q1 - q2];
    }
    case 3: {
      // cubic
      // Cardano's formula. convert to depressed cubic
      let a2 = b / a;
      let a1 = c / a;
      let a0 = d / a;
      let q = (3.0 * a1 - Math.pow(a2, 2.0)) / 9.0;
      let r = (9.0 * a2 * a1 - 27.0 * a0 - 2.0 * Math.pow(a2, 3.0)) / 54.0;
      let d0 = Math.pow(q, 3.0) + Math.pow(r, 2.0);
      let u = -a2 / 3.0;
      // one solution
      if (d0 > 0.0) {
        let sqrt_d0 = Math.sqrt(d0);
        let s = cubrt(r + sqrt_d0);
        let t = cubrt(r - sqrt_d0);
        return [u + s + t];
      }
      // two solutions
      if (Math.abs(d0) < EPSILON) {
        let s = Math.pow(r, 1.0/3.0);
        // let S = cubrt(R);
        // instead of checking if S is NaN, check if R was negative
        // if (isNaN(S)) { break; }
        if (r < 0.0) { return []; }
        return [u + 2.0 * s, u - s];
      }
      // three solutions
      let sqrt_d0 = Math.sqrt(-d0);
      let phi = Math.atan2(sqrt_d0, r) / 3.0;
      let r_s = Math.pow((Math.pow(r, 2.0) - d0), 1.0/6.0);
      let s_r = r_s * Math.cos(phi);
      let s_i = r_s * Math.sin(phi);
      return [
        u + 2.0 * s_r,
        u - s_r - Math.sqrt(3.0) * s_i,
        u - s_r + Math.sqrt(3.0) * s_i
      ];      
    }
    default: return [];
  }
};
/**
 * @description axiom 6: make a crease by bringing point1 onto a
 *  line1 and point2 onto line2
 * @param {number[]} vector of the first line
 * @param {number[]} origin of the first line
 * @param {number[]} vector of the second line
 * @param {number[]} origin of the second line
 * @param {number[]} point to bring to the first line
 * @param {number[]} point to bring to the second line
 */
export const axiom6ud = (line1, line2, point1, point2) => {
  // at least pointA must not be on lineA
  // for some reason this epsilon is much higher than 1e-6
  if (Math.abs(1.0 - (dot(line1.u, point1) / line1.d)) < 0.02) { return []; }
  // line vec is the first line's vector, along the line, not the normal
  const line_vec = rotate90(line1.u);
  const vec1 = subtract(add(point1, scale(line1.u, line1.d)), scale(point2, 2.0));
  const vec2 = subtract(scale(line1.u, line1.d), point1);
  const c1 = dot(point2, line2.u) - line2.d;
  const c2 = 2.0 * dot(vec2, line_vec);
  const c3 = dot(vec2, vec2);
  const c4 = dot(add(vec1, vec2), line_vec);
  const c5 = dot(vec1, vec2);
  const c6 = dot(line_vec, line2.u);
  const c7 = dot(vec2, line2.u);
  const a = c6;
  const b = c1 + c4 * c6 + c7;
  const c = c1 * c2 + c5 * c6 + c4 * c7;
  const d = c1 * c3 + c5 * c7;
  // construct the solution from the root, the solution being the parameter
  // point reflected across the fold line, lying on the parameter line
  let polynomial_degree = 0;
  if (Math.abs(c) > EPSILON) { polynomial_degree = 1; }
  if (Math.abs(b) > EPSILON) { polynomial_degree = 2; }
  if (Math.abs(a) > EPSILON) { polynomial_degree = 3; }
  return polynomial(polynomial_degree, a, b, c, d)
    .map(n => add(scale(line1.u, line1.d), scale(line_vec, n)))
    .map(p => ({ p, u: normalize(subtract(p, point1)) }))
    .map(el => ({ u: el.u, d: dot(el.u, midpoint(el.p, point1)) }));
};
/**
 * @description axiom 7: make a crease by bringing a point (pointC) onto a
 *  line () perpendicular to another line ()
 * @param {number[]} vector of the first line
 * @param {number[]} origin of the first line
 * @param {number[]} vector of the second line (origin is not needed)
 * @param {number[]} point involved in the folding
 */
export const axiom7ud = (line1, line2, point1) => {
  let u = rotate90(line1.u);
  let u_u = dot(u, line2.u);
  // if u_u is close to 0, the two input lines are parallel, no solution
  if (Math.abs(u_u) < EPSILON) { return undefined; }
  let a = dot(p, u);
  let b = dot(p, l2.u);
  let d = (l2.d + 2.0 * a * u_u - b) / (2.0 * u_u);
  return {u, d};
};
