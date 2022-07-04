/**
 * Math (c) Kraft
 */
import { EPSILON } from "./constants";
import { resize } from "../types/resize";
import {
	magSquared,
	distance,
	distance2,
	add,
	subtract,
	normalize,
	dot,
	scale,
} from "./vectors";
import {
	fnEpsilonSort,
	segmentLimiter,
} from "./functions";
/**
 * @description find the one item in the set which minimizes the
 * function when compared against another object provided in the arguments.
 * @param {any} obj the single item to test against the set
 * @param {any[]} array the set of items to test against
 * @param {function} compare_func a function which takes two items (which match
 * the type of the first parameter), execution of this function should return a scalar.
 * @returns {number[]} the index from the set which minimizes the compare function
 * @linkcode Math ./src/algebra/nearest.js 28
 */
export const smallestComparisonSearch = (obj, array, compare_func) => {
	const objs = array.map((o, i) => ({ o, i, d: compare_func(obj, o) }));
	let index;
	let smallest_value = Infinity;
	for (let i = 0; i < objs.length; i += 1) {
		if (objs[i].d < smallest_value) {
			index = i;
			smallest_value = objs[i].d;
		}
	}
	return index;
};
/**
 * @description Find the indices from an array of vectors which all have
 * the smallest value within an epsilon.
 * @param {number[][]} vectors array of vectors
 * @returns {number[]} array of indices which all have the lowest X value.
 */
const minimumXIndices = (vectors, compFn = fnEpsilonSort, epsilon = EPSILON) => {
	// find the set of all vectors that share the smallest X value within an epsilon
	let smallSet = [0];
	for (let i = 1; i < vectors.length; i += 1) {
		switch (compFn(vectors[i][0], vectors[smallSet[0]][0], epsilon)) {
		case 0: smallSet.push(i); break;
		case 1: smallSet = [i]; break;
		default: break;
		}
	}
	return smallSet;
};
/**
 * @description Get the index of the point in an array considered the absolute minimum.
 * First check the X values, and in the case of multiple minimums, check the Y values.
 * @param {number[][]} points array of points
 * @param {number} [epsilon=1e-6] an optional epsilon
 * @returns {number} the index of the point in the array with the smallest component values
 */
export const minimum2DPointIndex = (points, epsilon = EPSILON) => {
	// find the set of all points that share the smallest X value
	const smallSet = minimumXIndices(points, fnEpsilonSort, epsilon);
	// from this set, find the point with the smallest Y value
	let sm = 0;
	for (let i = 1; i < smallSet.length; i += 1) {
		if (points[smallSet[i]][1] < points[smallSet[sm]][1]) { sm = i; }
	}
	return smallSet[sm];
};

/**
 * @description find the one point in an array of 2D points closest to a 2D point.
 * @param {number[]} point the 2D point to test nearness to
 * @param {number[][]} array_of_points an array of 2D points to test against
 * @returns {number[]} one point from the array of points
 * @linkcode Math ./src/algebra/nearest.js 83
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
 * @linkcode Math ./src/algebra/nearest.js 95
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
 * @linkcode Math ./src/algebra/nearest.js 111
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
 * @linkcode Math ./src/algebra/nearest.js 130
 */
export const nearestPointOnPolygon = (polygon, point) => {
	const v = polygon
		.map((p, i, arr) => subtract(arr[(i + 1) % arr.length], p));
	return polygon
		.map((p, i) => nearestPointOnLine(v[i], p, point, segmentLimiter))
		.map((p, i) => ({ point: p, i, distance: distance(p, point) }))
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
 * @linkcode Math ./src/algebra/nearest.js 148
 */
export const nearestPointOnCircle = (radius, origin, point) => (
	add(origin, scale(normalize(subtract(point, origin)), radius)));

// todo
// const nearestPointOnEllipse = () => false;
