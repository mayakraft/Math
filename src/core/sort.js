/**
 * Math (c) Kraft
 */
/**
 * @description sort an array of 2D points along a 2D vector.
 * @param {number[][]} points array of points (which are arrays of numbers)
 * @param {number[]} vector one 2D vector
 * @returns {number[][]} the same points, sorted.
 * @linkcode Math ./src/core/sort.js 9
 */
export const sortPointsAlongVector2 = (points, vector) => points
	.map(point => ({ point, d: point[0] * vector[0] + point[1] * vector[1] }))
	.sort((a, b) => a.d - b.d)
	.map(a => a.point);
