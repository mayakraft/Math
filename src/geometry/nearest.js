/**
 * Math (c) Kraft
 */
import { EPSILON } from "../general/constants.js";
import { clampSegment } from "../general/functions.js";
import { smallestComparisonSearch } from "../general/search.js";
import {
	magSquared,
	distance,
	distance2,
	add,
	subtract,
	normalize,
	dot,
	scale,
	resize,
} from "../algebra/vectors.js";
/**
 * @description find the one point in an array of 2D points closest to a 2D point.
 * @param {number[]} point the 2D point to test nearness to
 * @param {number[][]} array_of_points an array of 2D points to test against
 * @returns {number[]} one point from the array of points
 * @linkcode Math ./src/algebra/nearest.js 86
 */
export const nearestPoint2 = (point, array_of_points) => {
	// todo speed up with partitioning
	const index = smallestComparisonSearch(point, array_of_points, distance2);
	return index === undefined ? undefined : array_of_points[index];
};
/**
 * @description find the one point in an array of points closest to a point.
 * @param {number[]} point the point to test nearness to
 * @param {number[][]} array_of_points an array of points to test against
 * @returns {number[]} one point from the array of points
 * @linkcode Math ./src/algebra/nearest.js 98
 */
export const nearestPoint = (point, array_of_points) => {
	// todo speed up with partitioning
	const index = smallestComparisonSearch(point, array_of_points, distance);
	return index === undefined ? undefined : array_of_points[index];
};
/**
 * @description find the nearest point on a line, ray, or segment.
 * @param {number[]} vector the vector of the line
 * @param {number[]} origin a point that the line passes through
 * @param {number[]} point the point to test nearness to
 * @param {function} limiterFunc a clamp function to bound a calculation between 0 and 1
 * for segments, greater than 0 for rays, or unbounded for lines.
 * @param {number} [epsilon=1e-6] an optional epsilon
 * @returns {number[]} a point
 * @linkcode Math ./src/algebra/nearest.js 114
 */
export const nearestPointOnLine = (vector, origin, point, limiterFunc, epsilon = EPSILON) => {
	origin = resize(vector.length, origin);
	point = resize(vector.length, point);
	const magSq = magSquared(vector);
	const vectorToPoint = subtract(point, origin);
	const dotProd = dot(vector, vectorToPoint);
	const dist = dotProd / magSq;
	// limit depending on line, ray, segment
	const d = limiterFunc(dist, epsilon);
	return add(origin, scale(vector, d));
};
/**
 * @description given a polygon and a point, in 2D, find a point on the boundary of the polygon
 * that is closest to the provided point.
 * @param {number[][]} polygon an array of points (which are arrays of numbers)
 * @param {number[]} point the point to test nearness to
 * @returns {number[]} a point
 * edge index matches vertices such that edge(N) = [vert(N), vert(N + 1)]
 * @linkcode Math ./src/algebra/nearest.js 133
 */
export const nearestPointOnPolygon = (polygon, point) => {
	const v = polygon
		.map((p, i, arr) => subtract(arr[(i + 1) % arr.length], p));
	return polygon
		.map((p, i) => nearestPointOnLine(v[i], p, point, clampSegment))
		.map((p, edge) => ({ point: p, edge, distance: distance(p, point) }))
		.sort((a, b) => a.distance - b.distance)
		.shift();
};
/**
 * @description find the nearest point on the boundary of a circle to another point
 * that is closest to the provided point.
 * @param {number} radius the radius of the circle
 * @param {number[]} origin the origin of the circle as an array of numbers.
 * @param {number[]} point the point to test nearness to
 * @returns {number[]} a point
 * @linkcode Math ./src/algebra/nearest.js 151
 */
export const nearestPointOnCircle = (radius, origin, point) => (
	add(origin, scale(normalize(subtract(point, origin)), radius)));

// todo
// const nearestPointOnEllipse = () => false;
