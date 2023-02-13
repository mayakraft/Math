/**
 * Math (c) Kraft
 */
import { EPSILON } from "../general/constants.js";
import { excludeL } from "../general/functions.js";
import {
	dot,
	cross2,
	add,
	magnitude,
} from "../algebra/vectors.js";
/**
 * @description 2D line intersection function, generalized and works for lines,
 * rays, segments.
 * @param {number[]} array of 2 numbers, the first line's vector
 * @param {number[]} array of 2 numbers, the first line's origin
 * @param {number[]} array of 2 numbers, the second line's vector
 * @param {number[]} array of 2 numbers, the second line's origin
 * @param {function} first line's boolean test normalized value lies collinear
 * @param {function} seconde line's boolean test normalized value lies collinear
 * @linkcode Math ./src/intersection/overlap-line-line.js 21
*/

// export const exclude_s = (t, e = EPSILON) => t > e && t < 1 - e;

const overlapLineLine = (
	aVector,
	aOrigin,
	bVector,
	bOrigin,
	aFunction = excludeL,
	bFunction = excludeL,
	epsilon = EPSILON,
) => {
	const denominator0 = cross2(aVector, bVector);
	const denominator1 = -denominator0;
	const a2b = [bOrigin[0] - aOrigin[0], bOrigin[1] - aOrigin[1]];
	if (Math.abs(denominator0) < epsilon) { // parallel
		if (Math.abs(cross2(a2b, aVector)) > epsilon) { return false; }
		const bPt1 = a2b;
		const bPt2 = add(bPt1, bVector);
		// a will be between 0 and 1
		const aProjLen = dot(aVector, aVector);
		const bProj1 = dot(bPt1, aVector) / aProjLen;
		const bProj2 = dot(bPt2, aVector) / aProjLen;
		const bProjSm = bProj1 < bProj2 ? bProj1 : bProj2;
		const bProjLg = bProj1 < bProj2 ? bProj2 : bProj1;
		const bOutside1 = bProjSm > 1 - epsilon;
		const bOutside2 = bProjLg < epsilon;
		if (bOutside1 || bOutside2) { return false; }
		return true;
	}
	const b2a = [-a2b[0], -a2b[1]];
	const t0 = cross2(a2b, bVector) / denominator0;
	const t1 = cross2(b2a, aVector) / denominator1;
	return aFunction(t0, epsilon / magnitude(aVector))
		&& bFunction(t1, epsilon / magnitude(bVector));
};

export default overlapLineLine;
