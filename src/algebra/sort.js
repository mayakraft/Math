/**
 * Math (c) Kraft
 */
import { EPSILON } from "./constants.js";
import {
	normalize2,
	distance2,
	dot2,
	subtract2,
} from "./vectors.js";
import { fnEpsilonEqual } from "./functions.js";
import { minimum2DPointIndex } from "./nearest.js";
/**
 * @description sort an array of 2D points along a 2D vector.
 * @param {number[][]} points array of points (which are arrays of numbers)
 * @param {number[]} vector one 2D vector
 * @returns {number[][]} the same points, sorted.
 * @linkcode Math ./src/algebra/sort.js 18
 */
export const sortPointsAlongVector2 = (points, vector) => points
	.map(point => ({ point, d: point[0] * vector[0] + point[1] * vector[1] }))
	.sort((a, b) => a.d - b.d)
	.map(a => a.point);
/**
 * @description given an array of already-sorted values (so that comparisons only
 * need to happen between neighboring items), cluster the numbers which are similar
 * within an epsilon. isolated values still get put in length-1 arrays. (all values returned)
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
 * @description radially sort point indices around the lowest-value point, clustering
 * similarly-angled points within an epsilon. Within these clusters, the points are
 * sorted by distance so the nearest point is listed first.
 * @param {number[][]} points an array of points
 * @param {number} [epsilon=1e-6] an optional epsilon
 * @returns {number[][]} this returns indices in clusters.
 * @linkcode Math ./src/algebra/sort.js 56
 */
export const radialSortPointIndices = (points = [], epsilon = EPSILON) => {
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
