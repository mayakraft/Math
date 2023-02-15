/**
 * Math (c) Kraft
 */
import { identity3x4 } from "../algebra/matrix3.js";
import { flattenArrays, semiFlattenArrays } from "./arrays.js";
import { fnNotUndefined } from "./functions.js";
import {
	magnitude,
	dot,
	scale,
	subtract,
	rotate90,
	rotate270,
} from "../algebra/vectors.js";
/**
 * @description Coerce the function arguments into a vector.
 * This will object notation {x:, y:}, or array [number, number, ...]
 * and work for n-dimensions.
 * @returns {number[]} vector in array form, or empty array for bad inputs
*/
export const getVector = function () {
	let list = flattenArrays(arguments);
	if (list.length > 0 && typeof list[0] === "object"
		&& list[0] !== null && !Number.isNaN(list[0].x)) {
		list = ["x", "y", "z"]
			.map(c => list[0][c])
			.filter(fnNotUndefined);
	}
	return list.filter(n => typeof n === "number");
};
/**
 * @description Coerce the function arguments into an array of vectors.
 * @returns {number[][]} vectors in array form, or empty array.
*/
export const getVectorOfVectors = function () {
	return semiFlattenArrays(arguments)
		.map(el => getVector(el));
};
/**
 * @description Coerce the function arguments into a segment (a pair of points)
 * @returns {number[]} segment in array form [[a1, a2], [b1, b2]]
*/
export const getSegment = function () {
	const args = semiFlattenArrays(arguments);
	if (args.length === 4) {
		return [
			[args[0], args[1]],
			[args[2], args[3]],
		];
	}
	return args.map(el => getVector(el));
};
const vectorOriginForm = (vector, origin) => (
	{ vector: vector || [], origin: origin || [] }
);
/**
 * @description Coerce the function arguments into a line.
 * @returns {object} a line in "vector" "origin" form.
 */
export const getLine = function () {
	const args = semiFlattenArrays(arguments);
	if (args.length === 0) { return vectorOriginForm([], []); }
	if (args[0].constructor === Object && args[0].vector !== undefined) {
		return vectorOriginForm(args[0].vector || [], args[0].origin || []);
	}
	return typeof args[0] === "number"
		? vectorOriginForm(getVector(args))
		: vectorOriginForm(...args.map(a => getVector(a)));
};
const maps3x4 = [
	[0, 1, 3, 4, 9, 10],
	[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
	[0, 1, 2, undefined, 3, 4, 5, undefined, 6, 7, 8, undefined, 9, 10, 11],
];
[11, 7, 3].forEach(i => delete maps3x4[2][i]);
// eslint-disable-next-line no-nested-ternary
const matrixMap3x4 = len => (len < 8
	? maps3x4[0]
	: (len < 13 ? maps3x4[1] : maps3x4[2]));
/**
 * @description Get a 3x4 matrix
 *
 * @returns {number[]} array of 12 numbers, or undefined if bad inputs
*/
export const getMatrix3x4 = function () {
	const mat = flattenArrays(arguments);
	const matrix = [...identity3x4];
	matrixMap3x4(mat.length)
		// .filter((_, i) => mat[i] != null)
		.forEach((n, i) => { if (mat[i] != null) { matrix[n] = mat[i]; } });
	return matrix;
};
/**
 * @description Give two points, create a vector-origin line representation
 * of a line that passes through both points. This will work in n-dimensions.
 * If there are more than two points, the rest will be ignored.
 * @param {number[][]} points two points, each point being an array of numbers.
 * @returns {RayLine} an object with "vector" and "origin".
 */
export const pointsToLine = (...args) => {
	const points = getVectorOfVectors(...args);
	return {
		vector: subtract(points[1], points[0]),
		origin: points[0],
	};
};
/**
 * @description convert a line from one parameterization into another.
 * convert vector-origin into u-d (normal, distance-to-origin)
 * @linkcode Math ./src/types/parameterize.js 34
 */
export const rayLineToUniqueLine = ({ vector, origin }) => {
	const mag = magnitude(vector);
	const normal = rotate90(vector);
	const distance = dot(origin, normal) / mag;
	return { normal: scale(normal, 1 / mag), distance };
};
/**
 * @description convert a line from one parameterization into another.
 * convert u-d (normal, distance-to-origin) into vector-origin
 * @linkcode Math ./src/types/parameterize.js 47
 */
export const uniqueLineToRayLine = ({ normal, distance }) => (
	vectorOriginForm(rotate270(normal), scale(normal, distance))
);
