/**
 * Math (c) Kraft
 */
import { EPSILON } from "../general/constants.js";
import { excludeL } from "../general/functions.js";
import {
	dot2,
	magnitude2,
	cross2,
	add2,
	subtract2,
} from "../algebra/vectors.js";
/**
 * @description 2D line intersection function, generalized and works for lines,
 * rays, segments.
 * @param {RayLine} lineA a line as an object with "vector" and "origin"
 * @param {RayLine} lineB a line as an object with "vector" and "origin"
 * @param {function} first line's boolean test normalized value lies collinear
 * @param {function} seconde line's boolean test normalized value lies collinear
 * @linkcode Math ./src/intersection/overlap-line-line.js 21
*/

// export const exclude_s = (t, e = EPSILON) => t > e && t < 1 - e;

const overlapLineLine = (
	a,
	b,
	aFunction = excludeL,
	bFunction = excludeL,
	epsilon = EPSILON,
) => {
	const denominator0 = cross2(a.vector, b.vector);
	const denominator1 = -denominator0;
	const a2b = subtract2(b.origin, a.origin);
	if (Math.abs(denominator0) < epsilon) { // parallel
		if (Math.abs(cross2(a2b, a.vector)) > epsilon) { return false; }
		const bPt1 = a2b;
		const bPt2 = add2(bPt1, b.vector);
		// a will be between 0 and 1
		const aProjLen = dot2(a.vector, a.vector);
		const bProj1 = dot2(bPt1, a.vector) / aProjLen;
		const bProj2 = dot2(bPt2, a.vector) / aProjLen;
		const bProjSm = bProj1 < bProj2 ? bProj1 : bProj2;
		const bProjLg = bProj1 < bProj2 ? bProj2 : bProj1;
		const bOutside1 = bProjSm > 1 - epsilon;
		const bOutside2 = bProjLg < epsilon;
		if (bOutside1 || bOutside2) { return false; }
		return true;
	}
	const b2a = [-a2b[0], -a2b[1]];
	const t0 = cross2(a2b, b.vector) / denominator0;
	const t1 = cross2(b2a, a.vector) / denominator1;
	return aFunction(t0, epsilon / magnitude2(a.vector))
		&& bFunction(t1, epsilon / magnitude2(b.vector));
};

export default overlapLineLine;
