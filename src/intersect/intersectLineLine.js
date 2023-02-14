/**
 * Math (c) Kraft
 */
import { EPSILON } from "../general/constants.js";
import { includeL } from "../general/functions.js";
import {
	normalize2,
	magnitude2,
	scale2,
	cross2,
	add2,
} from "../algebra/vectors.js";
/**
 * @description Find the intersection of two lines. Lines can be lines/rays/segments,
 * and can be inclusve or exclusive in terms of their endpoints and the epsilon value.
 * @param {RayLine} lineA line object with "vector" and "origin"
 * @param {RayLine} lineB line object with "vector" and "origin"
 * @param {function} [aFunction=includeL] first line's boolean test normalized value lies collinear
 * @param {function} [bFunction=includeL] second line's boolean test normalized value lies collinear
 * @param {number} [epsilon=1e-6] optional epsilon
 * @returns {number[]|undefined} one 2D point or undefined
 * @linkcode Math ./src/intersection/intersect-line-line.js 26
*/
const intersectLineLine = (
	a,
	b,
	aFunction = includeL,
	bFunction = includeL,
	epsilon = EPSILON,
) => {
	// a normalized determinant gives consistent values across all epsilon ranges
	const det_norm = cross2(normalize2(a.vector), normalize2(b.vector));
	// lines are parallel
	if (Math.abs(det_norm) < epsilon) { return undefined; }
	const determinant0 = cross2(a.vector, b.vector);
	const determinant1 = -determinant0;
	const a2b = [b.origin[0] - a.origin[0], b.origin[1] - a.origin[1]];
	const b2a = [-a2b[0], -a2b[1]];
	const t0 = cross2(a2b, b.vector) / determinant0;
	const t1 = cross2(b2a, a.vector) / determinant1;
	if (aFunction(t0, epsilon / magnitude2(a.vector))
		&& bFunction(t1, epsilon / magnitude2(b.vector))) {
		return add2(a.origin, scale2(a.vector, t0));
	}
	return undefined;
};

export default intersectLineLine;
