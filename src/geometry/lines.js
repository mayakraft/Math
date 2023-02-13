/**
 * Math (c) Kraft
 */
import { getLine } from "../types/get.js";
import {
	lerp,
	parallel,
} from "../algebra/vectors.js";
import {
	clockwiseAngle2,
	counterClockwiseAngle2,
	clockwiseSubsect2,
	counterClockwiseSubsect2,
} from "./radial.js";
import intersectLineLine from "../intersection/intersect-line-line.js";

/**
 * @description linear interpolate between two lines
 * @param {number[]} v one vector, n-dimensions
 * @param {number[]} u one vector, n-dimensions
 * @param {number} t one scalar between 0 and 1 (not clamped)
 * @returns {number[]} one vector, dimensions matching first parameter
 * @linkcode Math ./src/algebra/vectors.js 212
 */
export const lerpLines = (line1, line2, t) => {
	// const inv = 1.0 - t;
	// return v.map((n, i) => n * inv + (u[i] || 0) * t);
};

const pleatParallel = (count, a, b) => {
	const origins = Array.from(Array(count - 1))
		.map((_, i) => (i + 1) / count)
		.map(t => lerp(a.origin, b.origin, t));
	const vector = [...a.vector];
	return origins.map(origin => ({ origin, vector }));
};

const pleatAngle = (count, a, b) => {
	const origin = intersectLineLine(a.vector, a.origin, b.vector, b.origin);
	const vectors = clockwiseAngle2(a.vector, b.vector) < counterClockwiseAngle2(a.vector, b.vector)
		? clockwiseSubsect2(count, a.vector, b.vector)
		: counterClockwiseSubsect2(count, a.vector, b.vector);
	return vectors.map(vector => ({ origin, vector }));
};
/**
 * @description Between two lines, make a repeating sequence of
 * evenly-spaced lines to simulate a series of pleats.
 * @param {object} line object with key, value: { vector: [], origin: [] }
 * @param {object} line object with key, value: { vector: [], origin: [] }
 * @param {number} the number of faces, the number of lines will be n-1.
 * @returns {object[]} an array of lines, objects with "vector" and "origin"
 * @linkcode Math ./src/geometry/pleat.js 39
 */
export const pleat = (count, a, b) => {
	const lineA = getLine(a);
	const lineB = getLine(b);
	return parallel(lineA.vector, lineB.vector)
		? pleatParallel(count, lineA, lineB)
		: pleatAngle(count, lineA, lineB);
};
