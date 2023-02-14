/**
 * Math (c) Kraft
 */
import { EPSILON } from "../general/constants.js";
import { includeL } from "../general/functions.js";
import {
	subtract,
	cross2,
	rotate90,
} from "../algebra/vectors.js";
/**
 * @description Calculate the intersection of a circle and a line; the line can
 * be a line, ray, or segment.
 * @param {number} circleRadius the circle's radius
 * @param {number[]} circleOrigin the center of the circle
 * @param {number[]} lineVector the vector component of the line
 * @param {number[]} lineOrigin the origin component of the line
 * @param {function} [lineFunc=includeL] set the line/ray/segment and inclusive/exclusive
 * @param {number} [epsilon=1e-6] an optional epsilon
 * @linkcode Math ./src/intersection/intersect-circle-line.js 20
 */
const intersectCircleLine = (
	circle,
	line,
	line_func = includeL,
	epsilon = EPSILON,
) => {
	const magSq = line.vector[0] ** 2 + line.vector[1] ** 2;
	const mag = Math.sqrt(magSq);
	const norm = mag === 0 ? line.vector : line.vector.map(c => c / mag);
	const rot90 = rotate90(norm);
	const bvec = subtract(line.origin, circle.origin);
	const det = cross2(bvec, norm);
	if (Math.abs(det) > circle.radius + epsilon) { return undefined; }
	const side = Math.sqrt((circle.radius ** 2) - (det ** 2));
	const f = (s, i) => circle.origin[i] - rot90[i] * det + norm[i] * s;
	const results = Math.abs(circle.radius - Math.abs(det)) < epsilon
		? [side].map((s) => [s, s].map(f)) // tangent to circle
		: [-side, side].map((s) => [s, s].map(f));
	const ts = results.map(res => res.map((n, i) => n - line.origin[i]))
		.map(v => v[0] * line.vector[0] + line.vector[1] * v[1])
		.map(d => d / magSq);
	return results.filter((_, i) => line_func(ts[i], epsilon));
};

export default intersectCircleLine;
