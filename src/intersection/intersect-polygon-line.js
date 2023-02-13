/**
 * Math (c) Kraft
 */
import { EPSILON } from "../general/constants.js";
import {
	add,
	subtract,
	midpoint,
} from "../algebra/vectors.js";
import {
	exclude,
	includeL,
	includeR,
	includeS,
	excludeL,
	excludeR,
	excludeS,
	fnEpsilonEqualVectors,
} from "../general/functions.js";
import intersectLineLine from "./intersect-line-line.js";
import overlapConvexPolygonPoint from "./overlap-polygon-point.js";

// todo, this is copied over in clip/polygon.js
const getUniquePair = (intersections) => {
	for (let i = 1; i < intersections.length; i += 1) {
		if (!fnEpsilonEqualVectors(intersections[0], intersections[i])) {
			return [intersections[0], intersections[i]];
		}
	}
	return undefined;
};

/**
 * generalized line-ray-segment intersection with convex polygon function
 * for lines and rays, line1 and line2 are the vector, origin in that order.
 * for segments, line1 and line2 are the two endpoints.
 */
const intersectConvexPolygonLineInclusive = (
	poly,
	vector,
	origin,
	fn_poly = includeS,
	fn_line = includeL,
	epsilon = EPSILON,
) => {
	const intersections = poly
		.map((p, i, arr) => [p, arr[(i + 1) % arr.length]]) // into segment pairs
		.map(side => intersectLineLine(
			subtract(side[1], side[0]),
			side[0],
			vector,
			origin,
			fn_poly,
			fn_line,
			epsilon,
		))
		.filter(a => a !== undefined);
	switch (intersections.length) {
	case 0: return undefined;
	case 1: return [intersections];
	default:
		// for two intersection points or more, in the case of vertex-
		// collinear intersections the same point from 2 polygon sides
		// can be returned. we need to filter for unique points.
		// if no 2 unique points found:
		// there was only one unique intersection point after all.
		return getUniquePair(intersections) || [intersections[0]];
	}
};

/**
 * @description generalized line-ray-segment intersection with convex polygon function
 * for lines and rays, line1 and line2 are the vector, origin in that order.
 * for segments, line1 and line2 are the two endpoints.
 *
 * this doubles as the exclusive condition, and the main export since it
 * checks for exclusive/inclusive and can early-return
 * @linkcode Math ./src/intersection/intersect-polygon-line.js 78
 */
const intersectConvexPolygonLine = (
	poly,
	vector,
	origin,
	fn_poly = includeS,
	fn_line = excludeL,
	epsilon = EPSILON,
) => {
	const sects = intersectConvexPolygonLineInclusive(
		poly,
		vector,
		origin,
		fn_poly,
		fn_line,
		epsilon,
	);
	// const sects = convex_poly_line_intersect(intersect_func, poly, line1, line2, epsilon);
	let altFunc; // the opposite func, as far as inclusive/exclusive
	switch (fn_line) {
	// case excludeL: altFunc = includeL; break;
	case excludeR: altFunc = includeR; break;
	case excludeS: altFunc = includeS; break;
	default: return sects;
	}
	// here on, we are only dealing with exclusive tests, parsing issues with
	// vertex-on intersections that still intersect or don't intersect the polygon.
	// repeat the computation but include intersections with the polygon's vertices.
	const includes = intersectConvexPolygonLineInclusive(
		poly,
		vector,
		origin,
		includeS,
		altFunc,
		epsilon,
	);
	// const includes = convex_poly_line_intersect(altFunc, poly, line1, line2, epsilon);
	// if there are still no intersections, the line doesn't intersect.
	if (includes === undefined) { return undefined; }
	// if there are intersections, see if the line crosses the entire polygon
	// (gives us 2 unique points)
	const uniqueIncludes = getUniquePair(includes);
	// first, deal with the case that there are no unique 2 points.
	if (uniqueIncludes === undefined) {
		switch (fn_line) {
		// if there is one intersection, check if a ray's origin is inside.
		// 1. if the origin is inside, consider the intersection valid
		// 2. if the origin is outside, same as the line case above. no intersection.
		case excludeR:
			// is the ray origin inside?
			return overlapConvexPolygonPoint(poly, origin, exclude, epsilon)
				? includes
				: undefined;
		// if there is one intersection, check if either of a segment's points are
		// inside the polygon, same as the ray above. if neither are, consider
		// the intersection invalid for the exclusive case.
		case excludeS:
			return overlapConvexPolygonPoint(poly, add(origin, vector), exclude, epsilon)
				|| overlapConvexPolygonPoint(poly, origin, exclude, epsilon)
				? includes
				: undefined;
		// if there is one intersection, an infinite line is intersecting the
		// polygon from the outside touching at just one vertex. this should be
		// considered undefined for the exclusive case.
		case excludeL: return undefined;
		default: return undefined;
		}
	}
	// now that we've covered all the other cases, we know that the line intersects
	// the polygon at two unique points. this should return true for all cases
	// except one: when the line is collinear to an edge of the polygon.
	// to test this, get the midpoint of the two intersects and do an exclusive
	// check if the midpoint is inside the polygon. if it is, the line is crossing
	// the polygon and the intersection is valid.
	return overlapConvexPolygonPoint(poly, midpoint(...uniqueIncludes), exclude, epsilon)
		? uniqueIncludes
		: sects;
};

export default intersectConvexPolygonLine;
