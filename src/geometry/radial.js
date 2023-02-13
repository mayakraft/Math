/**
 * Math (c) Kraft
 */
import {
	EPSILON,
	TWO_PI,
} from "../algebra/constants.js";
import {
	dot,
	cross2,
	normalize,
	normalize2,
	midpoint,
	subtract2,
	distance2,
	rotate90,
	rotate270,
} from "../algebra/vectors.js";
import {
	semiFlattenArrays,
} from "../types/resize.js";
import {
	fnVec2Angle,
	fnToVec2,
	fnEpsilonEqual,
} from "../algebra/functions.js";
/**
 * measurements involving vectors and radians
 */
/**
 * @description check if the first parameter is counter-clockwise between A and B.
 * floor and ceiling can be unbounded, this method takes care of 0-2pi wrap around.
 * @param {number} angle angle in radians
 * @param {number} floor angle in radians, lower bound
 * @param {number} ceiling angle in radians, upper bound
 * @returns {boolean} is the angle between floor and ceiling
 * @linkcode Math ./src/geometry/radial.js 38
 */
export const isCounterClockwiseBetween = (angle, floor, ceiling) => {
	while (ceiling < floor) { ceiling += TWO_PI; }
	while (angle > floor) { angle -= TWO_PI; }
	while (angle < floor) { angle += TWO_PI; }
	return angle < ceiling;
};
/**
 * @description There are 2 interior angles between 2 vectors (as an angle in radians),
 * A-to-B clockwise, and A-to-B counter-clockwise. Get the clockwise one from A to B.
 * @param {number} a vector as an angle in radians
 * @param {number} b vector as an angle in radians
 * @returns {number} interior angle in radians
 * @linkcode Math ./src/geometry/radial.js 52
 */
export const clockwiseAngleRadians = (a, b) => {
	// this is on average 50 to 100 times faster than clockwiseAngle2
	while (a < 0) { a += TWO_PI; }
	while (b < 0) { b += TWO_PI; }
	while (a > TWO_PI) { a -= TWO_PI; }
	while (b > TWO_PI) { b -= TWO_PI; }
	const a_b = a - b;
	return (a_b >= 0)
		? a_b
		: TWO_PI - (b - a);
};
/**
 * @description There are 2 interior angles between 2 vectors (as an angle in radians),
 * A-to-B clockwise, and A-to-B counter-clockwise. Get the counter-clockwise one from A to B.
 * @param {number} a vector as an angle in radians
 * @param {number} b vector as an angle in radians
 * @returns {number} interior angle in radians, counter-clockwise from a to b
 * @linkcode Math ./src/geometry/radial.js 71
 */
export const counterClockwiseAngleRadians = (a, b) => {
	// this is on average 50 to 100 times faster than counterClockwiseAngle2
	while (a < 0) { a += TWO_PI; }
	while (b < 0) { b += TWO_PI; }
	while (a > TWO_PI) { a -= TWO_PI; }
	while (b > TWO_PI) { b -= TWO_PI; }
	const b_a = b - a;
	return (b_a >= 0)
		? b_a
		: TWO_PI - (a - b);
};
/**
 * @description There are 2 interior angles between 2 vectors, A-to-B clockwise,
 * and A-to-B counter-clockwise. Get the clockwise one from A to B.
 * @param {number[]} a vector as an array of two numbers
 * @param {number[]} b vector as an array of two numbers
 * @returns {number} interior angle in radians, clockwise from a to b
 * @linkcode Math ./src/geometry/radial.js 90
 */
export const clockwiseAngle2 = (a, b) => {
	const dotProduct = b[0] * a[0] + b[1] * a[1];
	const determinant = b[0] * a[1] - b[1] * a[0];
	let angle = Math.atan2(determinant, dotProduct);
	if (angle < 0) { angle += TWO_PI; }
	return angle;
};
/**
 * @description There are 2 interior angles between 2 vectors, A-to-B clockwise,
 * and A-to-B counter-clockwise. Get the counter-clockwise one from A to B.
 * @param {number[]} a vector as an array of two numbers
 * @param {number[]} b vector as an array of two numbers
 * @returns {number} interior angle in radians, counter-clockwise from a to b
 * @linkcode Math ./src/geometry/radial.js 105
 */
export const counterClockwiseAngle2 = (a, b) => {
	const dotProduct = a[0] * b[0] + a[1] * b[1];
	const determinant = a[0] * b[1] - a[1] * b[0];
	let angle = Math.atan2(determinant, dotProduct);
	if (angle < 0) { angle += TWO_PI; }
	return angle;
};
/**
 * this calculates an angle bisection between the pair of vectors
 * clockwise from the first vector to the second
 *
 *     a  x
 *       /     . bisection
 *      /   .
 *     / .
 *     --------x  b
 */
/**
 * @description calculate the angle bisection clockwise from the first vector to the second.
 * @param {number[]} a one 2D vector
 * @param {number[]} b one 2D vector
 * @returns {number[]} one 2D vector
 * @linkcode Math ./src/geometry/radial.js 129
 */
export const clockwiseBisect2 = (a, b) => fnToVec2(fnVec2Angle(a) - clockwiseAngle2(a, b) / 2);
/**
 * @description calculate the angle bisection counter-clockwise from the first vector to the second.
 * @param {number[]} a one 2D vector
 * @param {number[]} b one 2D vector
 * @returns {number[]} one 2D vector
 * @linkcode Math ./src/geometry/radial.js 137
 */
export const counterClockwiseBisect2 = (a, b) => (
	fnToVec2(fnVec2Angle(a) + counterClockwiseAngle2(a, b) / 2)
);
/**
 * @description subsect into n-divisions the angle clockwise from one angle to the next
 * @param {number} divisions number of angles minus 1
 * @param {number} angleA one angle in radians
 * @param {number} angleB one angle in radians
 * @returns {number[]} array of angles in radians
 * @linkcode Math ./src/geometry/radial.js 148
 */
export const clockwiseSubsectRadians = (divisions, angleA, angleB) => {
	const angle = clockwiseAngleRadians(angleA, angleB) / divisions;
	return Array.from(Array(divisions - 1))
		.map((_, i) => angleA + angle * (i + 1));
};
/**
 * @description subsect into n-divisions the angle counter-clockwise from one angle to the next
 * @param {number} divisions number of angles minus 1
 * @param {number} angleA one angle in radians
 * @param {number} angleB one angle in radians
 * @returns {number[]} array of angles in radians
 * @linkcode Math ./src/geometry/radial.js 161
 */
export const counterClockwiseSubsectRadians = (divisions, angleA, angleB) => {
	const angle = counterClockwiseAngleRadians(angleA, angleB) / divisions;
	return Array.from(Array(divisions - 1))
		.map((_, i) => angleA + angle * (i + 1));
};
/**
 * @description subsect into n-divisions the angle clockwise from one vector to the next
 * @param {number} divisions number of angles minus 1
 * @param {number[]} vectorA one vector in array form
 * @param {number[]} vectorB one vector in array form
 * @returns {number[][]} array of vectors (which are arrays of numbers)
 * @linkcode Math ./src/geometry/radial.js 174
 */
export const clockwiseSubsect2 = (divisions, vectorA, vectorB) => {
	const angleA = Math.atan2(vectorA[1], vectorA[0]);
	const angleB = Math.atan2(vectorB[1], vectorB[0]);
	return clockwiseSubsectRadians(divisions, angleA, angleB)
		.map(fnToVec2);
};
/**
 * @description subsect into n-divisions the angle counter-clockwise from one vector to the next
 * @param {number} divisions number of angles minus 1
 * @param {number[]} vectorA one vector in array form
 * @param {number[]} vectorB one vector in array form
 * @returns {number[][]} array of vectors (which are arrays of numbers)
 * @linkcode Math ./src/geometry/radial.js 188
 */
export const counterClockwiseSubsect2 = (divisions, vectorA, vectorB) => {
	const angleA = Math.atan2(vectorA[1], vectorA[0]);
	const angleB = Math.atan2(vectorB[1], vectorB[0]);
	return counterClockwiseSubsectRadians(divisions, angleA, angleB)
		.map(fnToVec2);
};
/**
 * @description given two lines, find two lines which bisect the given lines,
 * if the given lines have an intersection, or return one line if they are parallel.
 * @param {number[]} vectorA the vector of the first line, as an array of numbers
 * @param {number[]} originA the origin of the first line, as an array of numbers
 * @param {number[]} vectorB the vector of the first line, as an array of numbers
 * @param {number[]} originB the origin of the first line, as an array of numbers
 * @param {number} [epsilon=1e-6] an optional epsilon for testing parallel-ness.
 * @returns {object[]} an array of objects with "vector" and "origin" keys defining a line
 * @linkcode Math ./src/geometry/radial.js 205
 */
export const bisectLines2 = (vectorA, originA, vectorB, originB, epsilon = EPSILON) => {
	const determinant = cross2(vectorA, vectorB);
	const dotProd = dot(vectorA, vectorB);
	const bisects = determinant > -epsilon
		? [counterClockwiseBisect2(vectorA, vectorB)]
		: [clockwiseBisect2(vectorA, vectorB)];
	bisects[1] = determinant > -epsilon
		? rotate90(bisects[0])
		: rotate270(bisects[0]);
	const numerator = (originB[0] - originA[0]) * vectorB[1] - vectorB[0] * (originB[1] - originA[1]);
	const t = numerator / determinant;
	const normalized = [vectorA, vectorB].map(vec => normalize(vec));
	const isParallel = Math.abs(cross2(...normalized)) < epsilon;
	const origin = isParallel
		? midpoint(originA, originB)
		: [originA[0] + vectorA[0] * t, originA[1] + vectorA[1] * t];
	const solution = bisects.map(vector => ({ vector, origin }));
	if (isParallel) { delete solution[(dotProd > -epsilon ? 1 : 0)]; }
	return solution;
};
/**
 * @description sort an array of angles in radians by getting an array of
 * reference indices to the input array, instead of an array of angles.
 *
 * maybe there is such thing as an absolute radial origin (x axis?)
 * but this chooses the first element as the first element
 * and sort everything else counter-clockwise around it.
 *
 * @param {number[]|...number} args array or sequence of angles in radians
 * @returns {number[]} array of indices of the input array, indicating
 * the counter-clockwise sorted arrangement.
 * @linkcode Math ./src/geometry/radial.js 238
 */
export const counterClockwiseOrderRadians = function () {
	const radians = Array.from(arguments).flat();
	const counter_clockwise = radians
		.map((_, i) => i)
		.sort((a, b) => radians[a] - radians[b]);
	return counter_clockwise
		.slice(counter_clockwise.indexOf(0), counter_clockwise.length)
		.concat(counter_clockwise.slice(0, counter_clockwise.indexOf(0)));
};
/**
 * @description sort an array of vectors by getting an array of
 * reference indices to the input array, instead of a sorted array of vectors.
 * @param {number[][]} args array of vectors (which are arrays of numbers)
 * @returns {number[]} array of indices of the input array, indicating
 * the counter-clockwise sorted arrangement.
 * @linkcode Math ./src/geometry/radial.js 255
 */
export const counterClockwiseOrder2 = function () {
	return counterClockwiseOrderRadians(
		semiFlattenArrays(arguments).map(fnVec2Angle),
	);
};
/**
 * @description given an array of angles, return the sector angles between
 * consecutive parameters. if radially unsorted, this will sort them.
 * @param {number[]|...number} args array or sequence of angles in radians
 * @returns {number[]} array of sector angles in radians
 * @linkcode Math ./src/geometry/radial.js 267
 */
export const counterClockwiseSectorsRadians = function () {
	const radians = Array.from(arguments).flat();
	const ordered = counterClockwiseOrderRadians(radians)
		.map(i => radians[i]);
	return ordered.map((rad, i, arr) => [rad, arr[(i + 1) % arr.length]])
		.map(pair => counterClockwiseAngleRadians(pair[0], pair[1]));
};
/**
 * @description given an array of vectors, return the sector angles between
 * consecutive parameters. if radially unsorted, this will sort them.
 * @param {number[][]} args array of 2D vectors (higher dimensions will be ignored)
 * @returns {number[]} array of sector angles in radians
 * @linkcode Math ./src/geometry/radial.js 281
 */
export const counterClockwiseSectors2 = function () {
	return counterClockwiseSectorsRadians(
		semiFlattenArrays(arguments).map(fnVec2Angle),
	);
};
/**
 * subsect the angle between two lines, can handle parallel lines
 */
// export const subsect = function (divisions, pointA, vectorA, pointB, vectorB) {
//   const denominator = vectorA[0] * vectorB[1] - vectorB[0] * vectorA[1];
//   if (Math.abs(denominator) < EPSILON) { /* parallel */
//     const solution = [midpoint(pointA, pointB), [vectorA[0], vectorA[1]]];
//     const array = [solution, solution];
//     const dot = vectorA[0] * vectorB[0] + vectorA[1] * vectorB[1];
//     delete array[(dot > 0 ? 1 : 0)];
//     return array;
//   }
//   const numerator = (pointB[0] - pointA[0]) * vectorB[1] - vectorB[0] * (pointB[1] - pointA[1]);
//   const t = numerator / denominator;
//   const x = pointA[0] + vectorA[0] * t;
//   const y = pointA[1] + vectorA[1] * t;
//   const bisects = bisect_vectors(vectorA, vectorB);
//   bisects[1] = [-bisects[0][1], bisects[0][0]];
//   return bisects.map(el => [[x, y], el]);
// };
/**
 * @description which turn direction do 3 points make? clockwise or couter-clockwise
 * @param {number[]} p0 the start point
 * @param {number[]} p1 the middle point
 * @param {number[]} p2 the end point
 * @param {number} [epsilon=1e-6] optional epsilon
 * @returns {number|undefined} with 4 possible results:
 * - "0": collinear, no turn, forward
 * - "1": counter-clockwise turn, 0+epsilon < x < 180-epsilon
 * - "-1": clockwise turn, 0-epsilon > x > -180+epsilon
 * - "undefined": collinear but with a 180 degree turn.
 * @linkcode Math ./src/geometry/radial.js 319
 */
export const threePointTurnDirection = (p0, p1, p2, epsilon = EPSILON) => {
	const v = normalize2(subtract2(p1, p0));
	const u = normalize2(subtract2(p2, p0));
	// not collinear
	const cross = cross2(v, u);
	if (!fnEpsilonEqual(cross, 0, epsilon)) {
		return Math.sign(cross);
	}
	// collinear. now we have to ensure the order is 0, 1, 2, and point
	// 1 lies between 0 and 2. otherwise we made a 180 degree turn (return undefined)
	return fnEpsilonEqual(distance2(p0, p1) + distance2(p1, p2), distance2(p0, p2))
		? 0
		: undefined;
};
