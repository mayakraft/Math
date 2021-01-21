import { EPSILON } from "../core/constants";

/**
 * common functions that get reused, especially inside of map/reduce etc...
 */
export const fn_true = () => true;
export const fn_square = n => n * n;
export const fn_add = (a, b) => a + (b || 0);
export const fn_not_undefined = a => a !== undefined;
export const fn_and = (a, b) => a && b;
export const fn_cat = (a, b) => a.concat(b);
export const fn_vec2_angle = v => Math.atan2(v[1], v[0]);
export const fn_to_vec2 = a => [Math.cos(a), Math.sin(a)];
export const fn_equal = (a, b) => a === b;
export const fn_epsilon_equal = (a, b) => Math.abs(a - b) < EPSILON;
/**
 * test for sided-ness, like point in polygon
 * @returns {boolean}
 */
export const include = (n, epsilon = EPSILON) => n > -epsilon;
export const exclude = (n, epsilon = EPSILON) => n > epsilon;
/**
 * tests for lines
 * @returns {boolean}
 */
export const include_l = fn_true;
export const exclude_l = fn_true;
export const include_r = include;
export const exclude_r = exclude;
export const include_s = (t, e = EPSILON) => t > -e && t < 1 + e;
export const exclude_s = (t, e = EPSILON) => t > e && t < 1 - e;
/**
 * methods that clip lines (rays/segments), meant to return
 * the t value scaled along the vector.
 * @returns {number}
 */
export const line_limiter = dist => dist;
export const ray_limiter = dist => (dist < -EPSILON ? 0 : dist);
export const segment_limiter = (dist) => {
  if (dist < -EPSILON) { return 0; }
  if (dist > 1 + EPSILON) { return 1; }
  return dist;
};

