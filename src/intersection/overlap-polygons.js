/**
 * Math (c) Kraft
 */
import {
	dot,
	subtract,
	rotate90,
} from "../algebra/vectors.js";
import { EPSILON } from "../algebra/constants.js";
/**
 * @description find out if two convex polygons are overlapping by searching
 * for a dividing axis, which should be one side from one of the polygons.
 * @linkcode Math ./src/intersection/overlap-polygons.js 13
 */
const overlapConvexPolygons = (poly1, poly2, epsilon = EPSILON) => {
	for (let p = 0; p < 2; p += 1) {
		// for non-overlapping convex polygons, it's possible that only only
		// one edge on one polygon holds the property of being a dividing axis.
		// we must run the algorithm on both polygons
		const polyA = p === 0 ? poly1 : poly2;
		const polyB = p === 0 ? poly2 : poly1;
		for (let i = 0; i < polyA.length; i += 1) {
			// each edge of polygonA will become a line
			const origin = polyA[i];
			const vector = rotate90(subtract(polyA[(i + 1) % polyA.length], polyA[i]));
			// project each point from the other polygon on to the line's perpendicular
			// also, subtracting the origin (from the first poly) such that the
			// numberline is centered around zero. if the test passes, this polygon's
			// projections will be entirely above or below 0.
			const projected = polyB
				.map(point => subtract(point, origin))
				.map(v => dot(vector, v));
			// is the first polygon on the positive or negative side?
			const other_test_point = polyA[(i + 2) % polyA.length];
			const side_a = dot(vector, subtract(other_test_point, origin));
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

export default overlapConvexPolygons;
