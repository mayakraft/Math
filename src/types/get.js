/**
 * Math (c) Kraft
 */
import Constructors from "../primitives/constructors";
import { identity3x4 } from "../algebra/matrix3";
import { flattenArrays, semiFlattenArrays } from "./resize";
import { fnNotUndefined } from "../algebra/functions";
import { distance2 } from "../algebra/vectors";
/**
 * @returns {object} in form { point:[], vector:[] }
*/
const vectorOriginForm = (vector, origin) => ({
	vector: vector || [],
	origin: origin || [],
});
/**
 * search function arguments for a valid n-dimensional vector
 * can handle object-vector representation {x:, y:}
 *
 * @returns {number[]} vector in array form, or empty array for bad inputs
*/
export const getVector = function () {
	// todo, incorporate constructors.vector check to all indices. and below
	if (arguments[0] instanceof Constructors.vector) { return arguments[0]; }
	let list = flattenArrays(arguments); // .filter(fnNotUndefined);
	if (list.length > 0
		&& typeof list[0] === "object"
		&& list[0] !== null
		&& !Number.isNaN(list[0].x)) {
		list = ["x", "y", "z"]
			.map(c => list[0][c])
			.filter(fnNotUndefined);
	}
	return list.filter(n => typeof n === "number");
};

/**
 * search function arguments for a an array of vectors. a vector of vectors
 * can handle object-vector representation {x:, y:}
 *
 * @returns {number[]} vector in array form, or empty array for bad inputs
*/
export const getVectorOfVectors = function () {
	return semiFlattenArrays(arguments)
		.map(el => getVector(el));
};

/**
 * @returns {number[]} segment in array form [[a1, a2], [b1, b2]]
*/
export const getSegment = function () {
	if (arguments[0] instanceof Constructors.segment) {
		return arguments[0];
	}
	const args = semiFlattenArrays(arguments);
	if (args.length === 4) {
		return [
			[args[0], args[1]],
			[args[2], args[3]],
		];
	}
	return args.map(el => getVector(el));
};

// this works for rays to interchangably except for that it will not
// typecast a line into a ray, it will stay a ray type.
export const getLine = function () {
	const args = semiFlattenArrays(arguments);
	if (args.length === 0) { return vectorOriginForm([], []); }
	if (args[0] instanceof Constructors.line
		|| args[0] instanceof Constructors.ray
		|| args[0] instanceof Constructors.segment) { return args[0]; }
	if (args[0].constructor === Object && args[0].vector !== undefined) {
		return vectorOriginForm(args[0].vector || [], args[0].origin || []);
	}
	return typeof args[0] === "number"
		? vectorOriginForm(getVector(args))
		: vectorOriginForm(...args.map(a => getVector(a)));
};

export const getRay = getLine;

export const getRectParams = (x = 0, y = 0, width = 0, height = 0) => ({
	x, y, width, height,
});

export const getRect = function () {
	if (arguments[0] instanceof Constructors.rect) { return arguments[0]; }
	const list = flattenArrays(arguments); // .filter(fnNotUndefined);
	if (list.length > 0
		&& typeof list[0] === "object"
		&& list[0] !== null
		&& !Number.isNaN(list[0].width)) {
		return getRectParams(...["x", "y", "width", "height"]
			.map(c => list[0][c])
			.filter(fnNotUndefined));
	}
	const numbers = list.filter(n => typeof n === "number");
	const rectParams = numbers.length < 4
		? [, , ...numbers]
		: numbers;
	return getRectParams(...rectParams);
};

/**
 * radius is the first parameter so that the origin can be N-dimensional
 * ...args is a list of numbers that become the origin.
 */
const getCircleParams = (radius = 1, ...args) => ({
	radius,
	origin: [...args],
});

export const getCircle = function () {
	if (arguments[0] instanceof Constructors.circle) { return arguments[0]; }
	const vectors = getVectorOfVectors(arguments);
	const numbers = flattenArrays(arguments).filter(a => typeof a === "number");
	if (arguments.length === 2) {
		if (vectors[1].length === 1) {
			return getCircleParams(vectors[1][0], ...vectors[0]);
		}
		if (vectors[0].length === 1) {
			return getCircleParams(vectors[0][0], ...vectors[1]);
		}
		if (vectors[0].length > 1 && vectors[1].length > 1) {
			return getCircleParams(distance2(...vectors), ...vectors[0]);
		}
	} else {
		switch (numbers.length) {
		case 0: return getCircleParams(1, 0, 0, 0);
		case 1: return getCircleParams(numbers[0], 0, 0, 0);
		default: return getCircleParams(numbers.pop(), ...numbers);
		}
	}
	return getCircleParams(1, 0, 0, 0);
};

const maps3x4 = [
	[0, 1, 3, 4, 9, 10],
	[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
	[0, 1, 2, undefined, 3, 4, 5, undefined, 6, 7, 8, undefined, 9, 10, 11],
];
[11, 7, 3].forEach(i => delete maps3x4[2][i]);

const matrixMap3x4 = len => {
	let i;
	if (len < 8) i = 0;
	else if (len < 13) i = 1;
	else i = 2;
	return maps3x4[i];
};

/**
 * a matrix3 is a 4x3 matrix, 3x3 orientation with a column for translation
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
 * a matrix2 is a 2x3 matrix, 2x2 with a column to represent translation
 *
 * @returns {number[]} array of 6 numbers, or undefined if bad inputs
*/
// export const get_matrix2 = function () {
//   const m = getVector(arguments);
//   if (m.length === 6) { return m; }
//   if (m.length > 6) { return [m[0], m[1], m[2], m[3], m[4], m[5]]; }
//   if (m.length < 6) {
//     return identity2x3.map((n, i) => m[i] || n);
//   }
// };
