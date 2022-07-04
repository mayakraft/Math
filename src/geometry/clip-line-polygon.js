/**
 * Math (c) Kraft
 */
import { EPSILON } from "../algebra/constants";
import {
	fnNotUndefined,
	include,
	includeL,
	includeS,
} from "../algebra/functions";
import {
	normalize,
	magnitude,
	cross2,
	add,
	subtract,
	scale,
	flip,
} from "../algebra/vectors";
import overlapConvexPolygonPoint from "../intersection/overlap-polygon-point";

const lineLineParameter = (
	lineVector,
	lineOrigin,
	polyVector,
	polyOrigin,
	polyLineFunc = includeS,
	epsilon = EPSILON,
) => {
	// a normalized determinant gives consistent values across all epsilon ranges
	const det_norm = cross2(normalize(lineVector), normalize(polyVector));
	// lines are parallel
	if (Math.abs(det_norm) < epsilon) { return undefined; }
	const determinant0 = cross2(lineVector, polyVector);
	const determinant1 = -determinant0;
	const a2b = subtract(polyOrigin, lineOrigin);
	const b2a = flip(a2b);
	const t0 = cross2(a2b, polyVector) / determinant0;
	const t1 = cross2(b2a, lineVector) / determinant1;
	if (polyLineFunc(t1, epsilon / magnitude(polyVector))) {
		return t0;
	}
	return undefined;
};

const linePointFromParameter = (vector, origin, t) => add(origin, scale(vector, t));

// get all intersections with polgyon faces using the polyLineFunc:
// - includeS or excludeS
// sort them so we can grab the two most opposite intersections
const getIntersectParameters = (poly, vector, origin, polyLineFunc, epsilon) => poly
	// polygon into array of arrays [vector, origin]
	.map((p, i, arr) => [subtract(arr[(i + 1) % arr.length], p), p])
	.map(side => lineLineParameter(
		vector,
		origin,
		side[0],
		side[1],
		polyLineFunc,
		epsilon,
	))
	.filter(fnNotUndefined)
	.sort((a, b) => a - b);

// we have already done the test that numbers is a valid array
// and the length is >= 2
const getMinMax = (numbers, func, scaled_epsilon) => {
	let a = 0;
	let b = numbers.length - 1;
	while (a < b) {
		if (func(numbers[a + 1] - numbers[a], scaled_epsilon)) { break; }
		a += 1;
	}
	while (b > a) {
		if (func(numbers[b] - numbers[b - 1], scaled_epsilon)) { break; }
		b -= 1;
	}
	if (a >= b) { return undefined; }
	return [numbers[a], numbers[b]];
};
/**
 * @description find the overlap between one line and one convex polygon and
 * clip the line into a segment (two endpoints) or return undefined if no overlap.
 * The input line can be a line, ray, or segment, as determined by "fnLine".
 * @param {number[][]} poly array of points (which are arrays of numbers)
 * @param {number[]} vector the vector of the line
 * @param {number[]} origin the origin of the line
 * @param {function} [fnPoly=include] include or exclude polygon boundary in clip
 * @param {function} [fnLine=includeL] function to determine line/ray/segment,
 * and inclusive or exclusive.
 * @param {number} [epsilon=1e-6] optional epsilon
 */
const clipLineConvexPolygon = (
	poly,
	vector,
	origin,
	fnPoly = include,
	fnLine = includeL,
	epsilon = EPSILON,
) => {
	const numbers = getIntersectParameters(poly, vector, origin, includeS, epsilon);
	if (numbers.length < 2) { return undefined; }
	const scaled_epsilon = (epsilon * 2) / magnitude(vector);
	// ends is now an array, length 2, of the min and max parameter on the line
	// this also verifies the two intersections are not the same point
	const ends = getMinMax(numbers, fnPoly, scaled_epsilon);
	if (ends === undefined) { return undefined; }
	// ends_clip is the intersection between 2 domains, the result
	// and the valid inclusive/exclusive function
	// todo: this line hardcodes the parameterization that segments and rays are cropping
	// their lowest point at 0 and highest (if segment) at 1
	const ends_clip = ends.map(t => fnLine(t) ? t : (t < 0.5 ? 0 : 1));
	// if endpoints are the same, exit
	if (Math.abs(ends_clip[0] - ends_clip[1]) < (epsilon * 2) / magnitude(vector)) {
		return undefined;
	}
	// test if the solution is collinear to an edge by getting the segment midpoint
	// then test inclusive or exclusive depending on user parameter
	const mid = linePointFromParameter(vector, origin, (ends_clip[0] + ends_clip[1]) / 2);
	return overlapConvexPolygonPoint(poly, mid, fnPoly, epsilon)
		? ends_clip.map(t => linePointFromParameter(vector, origin, t))
		: undefined;
};

export default clipLineConvexPolygon;
