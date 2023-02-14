/**
 * Math (c) Kraft
 */
import { EPSILON } from "../general/constants.js";
import {
	fnEpsilonEqual,
	fnEpsilonEqualVectors,
} from "../general/functions.js";
// import { getLine } from "../general/types.js";
import {
	dot,
	cross2,
	normalize,
	midpoint,
	subtract,
	rotate90,
	rotate270,
	lerp,
	parallel,
} from "../algebra/vectors.js";
import {
	clockwiseAngle2,
	counterClockwiseAngle2,
	clockwiseSubsect2,
	counterClockwiseSubsect2,
	clockwiseBisect2,
	counterClockwiseBisect2,
} from "./radial.js";
import intersectLineLine from "../intersect/intersectLineLine.js";
/**
 * @description Check if a point is collinear and between two other points.
 * @param {number[]} p0 a segment point
 * @param {number[]} p1 the point to test collinearity
 * @param {number[]} p2 a segment point
 * @param {boolean} [inclusive=false] if the point is the same as the endpoints
 * @param {number} [epsilon=1e-6] an optional epsilon
 * @returns {boolean} true if the point lies collinear and between the other two points.
 * @linkcode Math ./src/intersection/general.js 19
 */
export const collinearBetween = (p0, p1, p2, inclusive = false, epsilon = EPSILON) => {
	const similar = [p0, p2]
		.map(p => fnEpsilonEqualVectors(p1, p))
		.reduce((a, b) => a || b, false);
	if (similar) { return inclusive; }
	const vectors = [[p0, p1], [p1, p2]]
		.map(segment => subtract(segment[1], segment[0]))
		.map(vector => normalize(vector));
	return fnEpsilonEqual(1.0, dot(...vectors), epsilon);
};
/**
 * @description given two lines, find two lines which bisect the given lines,
 * if the given lines have an intersection, or return one
 * line if they are parallel.
 * @param {RayLine} a a line with a "vector" and "origin" component
 * @param {RayLine} b a line with a "vector" and "origin" component
 * @param {number} [epsilon=1e-6] an optional epsilon for testing parallel-ness.
 * @returns {object[]} an array of objects with "vector" and "origin" keys defining a line
 * @linkcode Math ./src/geometry/radial.js 205
 */
export const bisectLines2 = (a, b, epsilon = EPSILON) => {
	const determinant = cross2(a.vector, b.vector);
	const dotProd = dot(a.vector, b.vector);
	const bisects = determinant > -epsilon
		? [counterClockwiseBisect2(a.vector, b.vector)]
		: [clockwiseBisect2(a.vector, b.vector)];
	bisects[1] = determinant > -epsilon
		? rotate90(bisects[0])
		: rotate270(bisects[0]);
	const numerator = (b.origin[0] - a.origin[0])
		* b.vector[1] - b.vector[0] * (b.origin[1] - a.origin[1]);
	const t = numerator / determinant;
	const normalized = [a.vector, b.vector].map(vec => normalize(vec));
	const isParallel = Math.abs(cross2(...normalized)) < epsilon;
	const origin = isParallel
		? midpoint(a.origin, b.origin)
		: [a.origin[0] + a.vector[0] * t, a.origin[1] + a.vector[1] * t];
	const solution = bisects.map(vector => ({ vector, origin }));
	if (isParallel) { delete solution[(dotProd > -epsilon ? 1 : 0)]; }
	return solution;
};
/**
 * @description linear interpolate between two lines
 * @param {RayLine} a a line with a "vector" and "origin" component
 * @param {RayLine} b a line with a "vector" and "origin" component
 * @param {number} t one scalar between 0 and 1 (not clamped)
 * @returns {number[]} one vector, dimensions matching first parameter
 * @linkcode Math ./src/algebra/vectors.js 212
 */
export const lerpLines = (a, b, t) => {
	const vector = lerp(a.vector, b.vector, t);
	const origin = lerp(a.origin, b.origin, t);
	return { vector, origin };
};

const pleatParallel2 = (a, b, count) => {
	const origins = Array.from(Array(count - 1))
		.map((_, i) => (i + 1) / count)
		.map(t => lerp(a.origin, b.origin, t));
	const vector = [...a.vector];
	return origins.map(origin => ({ origin, vector }));
};

const pleatAngle2 = (a, b, count) => {
	const origin = intersectLineLine(a, b);
	const vectors = clockwiseAngle2(a.vector, b.vector) < counterClockwiseAngle2(a.vector, b.vector)
		? clockwiseSubsect2(a.vector, b.vector, count)
		: counterClockwiseSubsect2(a.vector, b.vector, count);
	return vectors.map(vector => ({ origin, vector }));
};
/**
 * @description Between two lines, make a repeating sequence of
 * evenly-spaced lines to simulate a series of pleats.
 * @param {number} the number of faces, the number of lines will be n-1.
 * @param {RayLine} a a line with a "vector" and "origin" component
 * @param {RayLine} b a line with a "vector" and "origin" component
 * @returns {object[]} an array of lines, objects with "vector" and "origin"
 * @linkcode Math ./src/geometry/pleat.js 39
 */
// export const pleat = (count, a, b) => (parallel(a.vector, b.vector)
// 	? pleatParallel(count, a, b)
// 	: pleatAngle(count, a, b));

export const pleat = (a, b, count) => Array
	.from(Array(count - 1))
	.map((_, i) => (i + 1) / count)
	.map(t => lerpLines(a, b, t));

// export const pleat = (a, b, count, epsilon = EPSILON) => {
// 	const determinant = cross2(a.vector, b.vector);
// 	const dotProd = dot(a.vector, b.vector);
// 	const bisects = determinant > -epsilon
// 		? [counterClockwiseBisect2(a.vector, b.vector)]
// 		: [clockwiseBisect2(a.vector, b.vector)];
// 	bisects[1] = determinant > -epsilon
// 		? rotate90(bisects[0])
// 		: rotate270(bisects[0]);
// 	const numerator = (b.origin[0] - a.origin[0])
// 		* b.vector[1] - b.vector[0] * (b.origin[1] - a.origin[1]);
// 	const t = numerator / determinant;
// 	const normalized = [a.vector, b.vector].map(vec => normalize(vec));
// 	const isParallel = Math.abs(cross2(...normalized)) < epsilon;
// 	const origin = isParallel
// 		? midpoint(a.origin, b.origin)
// 		: [a.origin[0] + a.vector[0] * t, a.origin[1] + a.vector[1] * t];
// 	const solution = bisects.map(vector => ({ vector, origin }));
// 	if (isParallel) { delete solution[(dotProd > -epsilon ? 1 : 0)]; }
// 	return solution;
// };
