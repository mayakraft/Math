/**
 * Math (c) Kraft
 */
import { EPSILON } from "../general/constants.js";
import {
	exclude,
	excludeL,
} from "../general/functions.js";
import {
	normalize2,
	dot2,
	magSquared,
	magnitude2,
	distance2,
	cross2,
	add2,
	subtract2,
	rotate90,
} from "../algebra/vectors.js";
/**
 * @description check if a point lies collinear along a line, and specify if the
 * line is a line/ray/segment and test whether the point lies within endpoint(s).
 * @param {number[]} vector the vector component of the line
 * @param {number[]} origin the origin component of the line
 * @param {number[]} point one 2D point
 * @parma {function} [lineDomain=excludeL] specify line/ray/segment and inclusive/exclusive
 * @param {number} [epsilon=1e-6] an optional epsilon
 * @returns {boolean} is the point collinear to the line, and in the case of ray/segment,
 * does the point lie within the bounds of the ray/segment?
 * @linkcode Math ./src/intersection/overlap-line-point.js 22
 */
export const overlapLinePoint = (
	{ vector, origin },
	point,
	lineDomain = excludeL,
	epsilon = EPSILON,
) => {
	const p2p = subtract2(point, origin);
	const lineMagSq = magSquared(vector);
	const lineMag = Math.sqrt(lineMagSq);
	// the line is degenerate
	if (lineMag < epsilon) { return false; }
	const cross = cross2(p2p, vector.map(n => n / lineMag));
	const proj = dot2(p2p, vector) / lineMagSq;
	return Math.abs(cross) < epsilon && lineDomain(proj, epsilon / lineMag);
};
/**
 * @description Test if two lines overlap each other, generalized
 * and works for lines, rays, and segments.
 * @param {RayLine} lineA a line as an object with "vector" and "origin"
 * @param {RayLine} lineB a line as an object with "vector" and "origin"
 * @param {function} aFn first line's boolean test normalized value lies collinear
 * @param {function} bFn second line's boolean test normalized value lies collinear
 * @param {number} [epsilon=1e-6] an optional epsilon
 * @linkcode Math ./src/intersection/overlap-line-line.js 21
*/
export const overlapLineLine = (
	a,
	b,
	aDomain = excludeL,
	bDomain = excludeL,
	epsilon = EPSILON,
) => {
	const denominator0 = cross2(a.vector, b.vector);
	const denominator1 = -denominator0;
	const a2b = subtract2(b.origin, a.origin);
	const b2a = [-a2b[0], -a2b[1]];
	if (Math.abs(denominator0) < epsilon) { // parallel
		if (Math.abs(cross2(a2b, a.vector)) > epsilon) { return false; }
		// project each line's two endpoints onto the vector of the other line.
		const aPt1 = b2a;
		const aPt2 = add2(aPt1, a.vector);
		const bPt1 = a2b;
		const bPt2 = add2(bPt1, b.vector);
		const aProjLen = dot2(a.vector, a.vector);
		const bProjLen = dot2(a.vector, a.vector);
		// these will be between 0 and 1 if the two segments overlap
		const aProj1 = dot2(aPt1, b.vector) / bProjLen;
		const aProj2 = dot2(aPt2, b.vector) / bProjLen;
		const bProj1 = dot2(bPt1, a.vector) / aProjLen;
		const bProj2 = dot2(bPt2, a.vector) / aProjLen;
		// use the supplied function parameters to allow line/ray/segment
		// clamping and check if either point from either line is inside
		// the other line's vector, and if the function (l/r/s) allows it
		return aDomain(bProj1, epsilon) || aDomain(bProj2, epsilon)
			|| bDomain(aProj1, epsilon) || bDomain(aProj2, epsilon);
	}
	const t0 = cross2(a2b, b.vector) / denominator0;
	const t1 = cross2(b2a, a.vector) / denominator1;
	return aDomain(t0, epsilon / magnitude2(a.vector))
		&& bDomain(t1, epsilon / magnitude2(b.vector));
};
/**
 * @description Test if a point lies inside of a circle.
 * @param {object} circle object with radius and origin
 * @param {number[]} point a point in array form
 * @param {function} fn is the circle's boundary inclusive or exclusive
 * @param {number} [epsilon=1e-6] an optional epsilon
 * @linkcode Math ./src/intersection/overlap-line-line.js 21
*/
export const overlapCirclePoint = (
	{ radius, origin },
	point,
	circleDomain = exclude,
	epsilon = EPSILON,
) => (
	circleDomain(radius - distance2(origin, point), epsilon)
);
/**
 * @description tests if a point is inside a convex polygon. Polygon is
 * expected to be counter-clockwise winding.
 * @param {number[]} point in array form
 * @param {number[][]} polygon in array of array form
 * @param {function} fn is the boundary of the polygon inclusive or exclusive
 * @param {number} [epsilon=1e-6] an optional epsilon
 * @returns {boolean} is the point inside the polygon?
 * @linkcode Math ./src/intersection/overlap-polygon-point.js 23
 */
export const overlapConvexPolygonPoint = (
	poly,
	point,
	polyDomain = exclude,
	epsilon = EPSILON,
) => poly
	.map((p, i, arr) => [p, arr[(i + 1) % arr.length]])
	.map(s => cross2(normalize2(subtract2(s[1], s[0])), subtract2(point, s[0])))
	.map(side => polyDomain(side, epsilon))
	.map((s, _, arr) => s === arr[0])
	.reduce((prev, curr) => prev && curr, true);
/**
 * @description find out if two convex polygons are overlapping by searching
 * for a dividing axis, which should be one side from one of the polygons.
 * @param {number[][]} polygon in array of array form
 * @param {number[][]} polygon in array of array form
 * @param {number} [epsilon=1e-6] an optional epsilon
 * @linkcode Math ./src/intersection/overlap-polygons.js 13
 */
export const overlapConvexPolygons = (poly1, poly2, epsilon = EPSILON) => {
	for (let p = 0; p < 2; p += 1) {
		// for non-overlapping convex polygons, it's possible that only only
		// one edge on one polygon holds the property of being a dividing axis.
		// we must run the algorithm on both polygons
		const polyA = p === 0 ? poly1 : poly2;
		const polyB = p === 0 ? poly2 : poly1;
		for (let i = 0; i < polyA.length; i += 1) {
			// each edge of polygonA will become a line
			const origin = polyA[i];
			const vector = rotate90(subtract2(polyA[(i + 1) % polyA.length], polyA[i]));
			// project each point from the other polygon on to the line's perpendicular
			// also, subtracting the origin (from the first poly) such that the
			// numberline is centered around zero. if the test passes, this polygon's
			// projections will be entirely above or below 0.
			const projected = polyB
				.map(point => subtract2(point, origin))
				.map(v => dot2(vector, v));
			// is the first polygon on the positive or negative side?
			const other_test_point = polyA[(i + 2) % polyA.length];
			const side_a = dot2(vector, subtract2(other_test_point, origin));
			const side = side_a > 0; // use 0. not epsilon
			// is the second polygon on whichever side of 0 that the first isn't?
			const one_sided = projected
				.map(dotProd => (side ? dotProd < epsilon : dotProd > -epsilon))
				.reduce((a, b) => a && b, true);
			// if true, we found a dividing axis
			if (one_sided) { return false; }
		}
	}
	return true;
};
/**
 * @description Test if two axis-aligned bounding boxes overlap each other.
 * @param {BoundingBox} box1 an axis-aligned bounding box, the result of calling boundingBox(...)
 * @param {BoundingBox} box2 an axis-aligned bounding box, the result of calling boundingBox(...)
 * @param {number} [epsilon=1e-6] an optional epsilon
 * @returns {boolean} true if the bounding boxes overlap each other
 * @linkcode Math ./src/intersection/overlap-bounding-boxes.js 9
 */
export const overlapBoundingBoxes = (box1, box2, epsilon = EPSILON) => {
	const dimensions = Math.min(box1.min.length, box2.min.length);
	for (let d = 0; d < dimensions; d += 1) {
		// if one minimum is above the other's maximum, or visa versa
		if (box1.min[d] > box2.max[d] + epsilon
			|| box1.max[d] < box2.min[d] - epsilon) {
			return false;
		}
	}
	return true;
};
// really great function and it works for non-convex polygons
// but it has inconsistencies around inclusive and exclusive points
// when the lie along the polygon edge.
// for example, the unit square, point at 0 and at 1 alternate in/exclusive
// keeping it around in case someone can clean it up.
//
// export const point_in_poly = (point, poly) => {
//   // W. Randolph Franklin
//   // https://wrf.ecse.rpi.edu/Research/Short_Notes/pnpoly.html
//   let isInside = false;
//   for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
//     if ((poly[i][1] > point[1]) != (poly[j][1] > point[1])
//       && point[0] < (poly[j][0] - poly[i][0])
//       * (point[1] - poly[i][1]) / (poly[j][1] - poly[i][1])
//       + poly[i][0]) {
//       isInside = !isInside;
//     }
//   }
//   return isInside;
// };
