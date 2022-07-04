/**
 * Math (c) Kraft
 */
import { getLine } from "../types/get";
import {
	lerp,
	parallel,
} from "../algebra/vectors";
import {
	clockwiseAngle2,
	counterClockwiseAngle2,
	clockwiseSubsect2,
	counterClockwiseSubsect2,
} from "./radial";
import intersectLineLine from "../intersection/intersect-line-line";

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
 * @param {line} object with two keys/values: { vector: [], origin: [] }
 * @param {line} object with two keys/values: { vector: [], origin: [] }
 * @param {number} the number of faces, the number of lines will be n-1.
 * @returns {line[]} an array of lines, objects which contain "vector" and "origin"
 * @linkcode Math ./src/geometry/pleat.js 39
 */
export const pleat = (count, a, b) => {
	const lineA = getLine(a);
	const lineB = getLine(b);
	return parallel(lineA.vector, lineB.vector)
		? pleatParallel(count, lineA, lineB)
		: pleatAngle(count, lineA, lineB);
};
