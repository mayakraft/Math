/**
 * Math (c) Kraft
 */
import { EPSILON } from "../general/constants.js";
import {
	fnEpsilonEqual,
	fnEpsilonEqualVectors,
} from "../general/functions.js";
import {
	dot,
	subtract,
	normalize,
} from "../algebra/vectors.js";
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
