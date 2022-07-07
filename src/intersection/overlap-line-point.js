/**
 * Math (c) Kraft
 */
import { EPSILON } from "../algebra/constants";
import {
	dot,
	cross2,
	subtract,
	magSquared,
} from "../algebra/vectors";
import { excludeL } from "../algebra/functions";
/**
 * @description check if a point lies collinear along a line, and specify if the
 * line is a line/ray/segment and test whether the point lies within endpoint(s).
 * @param {number[]} vector the vector component of the line
 * @param {number[]} origin the origin component of the line
 * @param {number[]} point one 2D point
 * @parma {function} [func=excludeL] specify line/ray/segment and inclusive/exclusive
 * @param {number} [epsilon=1e-6] an optional epsilon with a default value of 1e-6
 * @returns {boolean} is the point collinear to the line, and in the case of ray/segment,
 * does the point lie within the bounds of the ray/segment?
 * @linkcode Math ./src/intersection/overlap-line-point.js 22
 */
const overlapLinePoint = (vector, origin, point, func = excludeL, epsilon = EPSILON) => {
	const p2p = subtract(point, origin);
	const lineMagSq = magSquared(vector);
	const lineMag = Math.sqrt(lineMagSq);
	// the line is degenerate
	if (lineMag < epsilon) { return false; }
	const cross = cross2(p2p, vector.map(n => n / lineMag));
	const proj = dot(p2p, vector) / lineMagSq;
	return Math.abs(cross) < epsilon && func(proj, epsilon / lineMag);
};

export default overlapLinePoint;
