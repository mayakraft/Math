/**
 * Math (c) Kraft
 */
import { EPSILON } from "../core/constants";

/**
 * common functions that get reused, especially inside of map/reduce etc...
 */
/**
 * @description trivial method, returns true
 * @returns {boolean} true
 */
export const fnTrue = () => true;
/**
 * @description multiply a parameter by itself
 * @param {number} n a number
 * @returns {number} a number
 * @linkcode Math ./src/arguments/functions.js 18
 */
export const fnSquare = n => n * n;
/**
 * @description add two parameters
 * @param {number} a a number
 * @param {number} b a number
 * @returns {number} a number
 * @linkcode Math ./src/arguments/functions.js 26
 */
export const fnAdd = (a, b) => a + (b || 0);
/**
 * @description is an input not undefined? using Javascript's triple equals !==
 * @param {any} a any input
 * @returns {boolean} true if the input is not undefined
 * @linkcode Math ./src/arguments/functions.js 33
 */
export const fnNotUndefined = a => a !== undefined;
/**
 * @description boolean AND the two inputs
 * @param {any} a any input
 * @param {any} b any input
 * @returns {boolean} the AND of both inputs
 * @linkcode Math ./src/arguments/functions.js 41
 */
export const fnAnd = (a, b) => a && b;
/**
 * @description concat the two arrays, resulting in one joined array
 * @param {Array} a any array input
 * @param {Array} b any array input
 * @returns {Array} one joined array
 * @linkcode Math ./src/arguments/functions.js 49
 */
export const fnCat = (a, b) => a.concat(b);
/**
 * @description convert a 2D vector to an angle in radians
 * @param {number[]} v an input vector
 * @returns {number} the angle in radians
 * @linkcode Math ./src/arguments/functions.js 56
 */
export const fnVec2Angle = v => Math.atan2(v[1], v[0]);
/**
 * @description convert an angle in radians to a 2D vector
 * @param {number} a the angle in radians
 * @returns {number[]} a 2D vector
 * @linkcode Math ./src/arguments/functions.js 63
 */
export const fnToVec2 = a => [Math.cos(a), Math.sin(a)];
/**
 * @description are two inputs equal using Javascript's triple equals.
 * @param {any} a any input
 * @param {any} b any input
 * @returns {boolean} true if the inputs are equal
 * @linkcode Math ./src/arguments/functions.js 71
 */
export const fnEqual = (a, b) => a === b;
/**
 * @description are two inputs equal within an epsilon of each other
 * @param {number} a any number input
 * @param {number} b any number input
 * @returns {boolean} true if the numbers are near each other
 * @linkcode Math ./src/arguments/functions.js 79
 */
export const fnEpsilonEqual = (a, b) => Math.abs(a - b) < EPSILON;
/**
 * @description are two vectors equal to each other within an epsilon. This method
 * uses a fast rectangle-area around each vector.
 * @param {number[]} a an array of numbers
 * @param {number[]} b an array of numbers
 * @returns {boolean} true if the vectors are similar within an epsilon
 * @linkcode Math ./src/arguments/functions.js 88
 */
export const fnEpsilonEqualVectors = (a, b) => {
  for (let i = 0; i < Math.max(a.length, b.length); i++) {
    if (!fnEpsilonEqual(a[i] || 0, b[i] || 0)) { return false; }
  }
  return true;
};
// export const fnEpsilonEqualVectors = (a, b) => a
//   .map((_, n) => fnEpsilonEqual(a[n], b[n]))
//   .reduce(fnAnd, true);
/**
 * @description the inclusive test used in intersection algorithms, returns
 * true if the number is positive, including the epsilon between -epsilon and 0.
 * @returns {boolean} -Infinity...{false}...-epsilon...{true}...+Infinity
 * @linkcode Math ./src/arguments/functions.js 103
 */
export const include = (n, epsilon = EPSILON) => n > -epsilon;
/**
 * @description the exclusive test used in intersection algorithms, returns
 * true if the number is positive, excluding the epsilon between 0 and +epsilon.
 * @returns {boolean} -Infinity...{false}...+epsilon...{true}...+Infinity
 * @linkcode Math ./src/arguments/functions.js 110
 */
export const exclude = (n, epsilon = EPSILON) => n > epsilon;
/**
 * @description the function parameter for an inclusive line
 * @linkcode Math ./src/arguments/functions.js 115
 */
export const includeL = fnTrue;
/**
 * @description the function parameter for an exclusive line
 * @linkcode Math ./src/arguments/functions.js 120
 */
export const excludeL = fnTrue;
/**
 * @description the function parameter for an inclusive ray
 * @linkcode Math ./src/arguments/functions.js 125
 */
export const includeR = include;
/**
 * @description the function parameter for an exclusive ray
 * @linkcode Math ./src/arguments/functions.js 130
 */
export const excludeR = exclude;
/**
 * @description the function parameter for an inclusive segment
 * @linkcode Math ./src/arguments/functions.js 135
 */
export const includeS = (t, e = EPSILON) => t > -e && t < 1 + e;
/**
 * @description the function parameter for an exclusive segment
 * @linkcode Math ./src/arguments/functions.js 140
 */
export const excludeS = (t, e = EPSILON) => t > e && t < 1 - e;
/**
 * @description These clamp functions process lines/rays/segments intersections.
 * The line method allows all values.
 * @param {number} t the length along the vector
 * @returns {number} the clamped input value
 * @linkcode Math ./src/arguments/functions.js 148
 */
export const lineLimiter = dist => dist;
/**
 * @description These clamp functions process lines/rays/segments intersections.
 * The ray method clamps values below -epsilon to be 0.
 * @param {number} t the length along the vector
 * @returns {number} the clamped input value
 * @linkcode Math ./src/arguments/functions.js 156
 */
export const rayLimiter = dist => (dist < -EPSILON ? 0 : dist);
/**
 * @description These clamp functions process lines/rays/segments intersections.
 * The segment method clamps values below -epsilon to be 0 and above 1+epsilon to 1.
 * @param {number} t the length along the vector
 * @returns {number} the clamped input value
 * @linkcode Math ./src/arguments/functions.js 164
 */
export const segmentLimiter = (dist) => {
  if (dist < -EPSILON) { return 0; }
  if (dist > 1 + EPSILON) { return 1; }
  return dist;
};
