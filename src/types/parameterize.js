/**
 * Math (c) Kraft
 */
import {
	magnitude,
	dot,
	scale,
	subtract,
	rotate90,
	rotate270,
} from "../algebra/vectors.js";
import { boundingBox } from "../geometry/polygons.js";
import { getVectorOfVectors } from "./get.js";
/**
 *
 */
export const pointsToLine = (...args) => {
	const points = getVectorOfVectors(...args);
	return {
		vector: subtract(points[1], points[0]),
		origin: points[0],
	};
};
// export const pointsToBoundingBox = (...args) => {
// 	const box = boundingBox(getVectorOfVectors(...args));
// 	return Constructors.rect(box.min[0], box.min[1], box.span[0], box.span[1]);
// };

/**
 * @notes in Robert Lang's U-D parameterization definition, U is defined
 * to be any vector made from an angle constrained between [0...180), meaning
 * the y component will never be negative.
 * The D component is allowed to be any number between -Infinity...Infinity
 *
 * The constraint on the normal-angle causes issues when converting back
 * and forth between vector-origin and UD parameterization. Lang's intention
 * is that lines do not have a directionality, whereas this library does,
 * (see: Axiom folding, which face to fold is decided by the line's vector).
 *
 * Therefore, this library modifies the paramterization slightly to allow
 * unconstrained normals, where the angle can be anywhere [0...360).
 * The cost is when testing equality, the normal and its flip must be checked,
 * or, U normals can be flipped (and the sign of D flipped) ahead of time.
 *  return d < 0
 *    ? { u: scale(u, -1/mag), d: -d }
 *    : { u: scale(u, 1/mag), d };
 */

/**
 * @description convert a line from one parameterization into another.
 * convert vector-origin into u-d (normal, distance-to-origin)
 * @linkcode Math ./src/types/parameterize.js 34
 */
// export const vectorOriginToUD = ({ vector, origin }) => {
// export const makeNormalDistanceLine = ({ vector, origin }) => {
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
// export const UDToVectorOrigin = ({ u, d }) => ({
// export const makeVectorOriginLine = ({ normal, distance }) => ({
export const uniqueLineToRayLine = ({ normal, distance }) => ({
	vector: rotate270(normal),
	origin: scale(normal, distance),
});
