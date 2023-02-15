/**
 * Math (c) Kraft
 */
import { EPSILON } from "./constants.js";
import { fnEpsilonEqual } from "./functions.js";
import {
	normalize2,
	distance2,
	dot,
	dot2,
	subtract2,
} from "../algebra/vectors.js";
import { minimum2DPointIndex } from "./search.js";
/**
 * @description Provide a comparison function and use it to sort an array
 * of any type of object against a single item. The returned array will be
 * the indices of the original array in sorted order.
 * @param {any[]} array an array of elements to be sorted
 * @param {any} item the item which to compare against all array elements
 * @param {function} compareFn the comparison function to be run against
 * every element in the array with the input item parameter, placing
 * the array element first, the input item second: fn(arrayElem, paramItem)
 * @returns {number[]} the indices of the original array, in sorted order
 * @linkcode
 */
export const sortAgainstItem = (array, item, compareFn) => array
	.map((el, i) => ({ i, n: compareFn(el, item) }))
	.sort((a, b) => a.n - b.n)
	.map(a => a.i);
/**
 * @description Sort an array of n-dimensional points along an
 * n-dimensional vector, get the indices in sorted order.
 * @param {number[][]} points array of points (which are arrays of numbers)
 * @param {number[]} vector one vector
 * @returns {number[]} a list of sorted indices to the points array.
 * @linkcode Math ./src/algebra/sort.js 18
 */
export const sortPointsAlongVector = (points, vector) => (
	sortAgainstItem(points, vector, dot)
);
/**
 * @description given an array of already-sorted values (so that
 * comparisons only need to happen between neighboring items),
 * cluster the numbers which are similar within an epsilon.
 * Isolated values still get put in length-1 arrays. (all values returned)
 * and the clusters contain the indices from the param array, not the values.
 * @param {numbers[]} an array of sorted numbers
 * @param {numbers} [epsilon=1e-6] an optional epsilon
 * @returns {numbers[][]} an array of arrays, each inner array containin indices.
 * each inner array represents clusters of values which lie within an epsilon.
 * @linkcode Math ./src/algebra/sort.js 33
 */
export const clusterIndicesOfSortedNumbers = (numbers, epsilon = EPSILON) => {
	const clusters = [[0]];
	let clusterIndex = 0;
	for (let i = 1; i < numbers.length; i += 1) {
		// if this scalar fits inside the current cluster
		if (fnEpsilonEqual(numbers[i], numbers[i - 1], epsilon)) {
			clusters[clusterIndex].push(i);
		} else {
			clusterIndex = clusters.length;
			clusters.push([i]);
		}
	}
	return clusters;
};
/**
 * @description radially sort 2D point indices around the lowest-
 * value point, clustering similarly-angled points within an epsilon.
 * Within these clusters, the points are sorted by distance so the
 * nearest point is listed first.
 * @param {number[][]} points an array of points
 * @param {number} [epsilon=1e-6] an optional epsilon
 * @returns {number[][]} this returns indices in clusters.
 * @linkcode Math ./src/algebra/sort.js 56
 */
export const radialSortPointIndices2 = (points = [], epsilon = EPSILON) => {
	const first = minimum2DPointIndex(points, epsilon);
	const angles = points
		.map(p => subtract2(p, points[first]))
		.map(v => normalize2(v))
		.map(vec => dot2([0, 1], vec));
		// .map((p, i) => Math.atan2(unitVecs[i][1], unitVecs[i][0]));
	const rawOrder = angles
		.map((a, i) => ({ a, i }))
		.sort((a, b) => a.a - b.a)
		.map(el => el.i)
		.filter(i => i !== first);
	return [[first]]
		.concat(clusterIndicesOfSortedNumbers(rawOrder.map(i => angles[i]), epsilon)
			.map(arr => arr.map(i => rawOrder[i]))
			.map(cluster => (cluster.length === 1 ? cluster : cluster
				.map(i => ({ i, len: distance2(points[i], points[first]) }))
				.sort((a, b) => a.len - b.len)
				.map(el => el.i))));
};
