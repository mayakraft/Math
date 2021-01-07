/**
 * common functions that get reused, especially inside of map/reduce etc...
 */

export const fn_square = n => n * n;
export const fn_add = (a, b) => a + (b || 0);
export const fn_not_undefined = a => a !== undefined;
export const fn_vec2_angle = v => Math.atan2(v[1], v[0]);
export const fn_to_vec2 = a => [Math.cos(a), Math.sin(a)];

