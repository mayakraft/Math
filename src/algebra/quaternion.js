/**
 * Math (c) Kraft
 */
/**
 * Quaternions represented as an array of numbers with indices x=0, y=1, z=2, w=3
 */
import {
	dot,
	cross3,
	magnitude,
	normalize,
} from "./vectors.js";
import { multiplyMatrices4 } from "./matrix4.js";
// const quaternionFromTwoVectors = (v1, v2) => {
// 	// q.w = Math.sqrt((v1.Length ^ 2) * (v2.Length ^ 2)) + dotproduct(v1, v2);
// 	const xyz = ear.math.cross3(v1, v2);
// 	const w = Math.sqrt(ear.math.magSquared(v1) * ear.math.magSquared(v2)) + ear.math.dot(v1, v2);
// 	return ear.math.normalize([...xyz, w]);
// };
/**
 * @description Create a quaternion which represents a rotation from
 * one 3D vector to another.
 * @param {number[]} u a 3D vector
 * @param {number[]} v a 3D vector
 * @returns {number[]} a quaternion representing a rotation
 */
export const quaternionFromTwoVectors = (u, v) => {
	const w = cross3(u, v);
	const q = [w[0], w[1], w[2], dot(u, v)];
	q[3] += magnitude(q);
	return normalize(q);
};
/**
 * @description Create a 4x4 matrix from a quaternion
 * @param {number[]} quaternion a quaternion
 * @returns {number[]} a 4x4 matrix (array of 16 numbers)
 */
export const matrix4FromQuaternion = (quaternion) => multiplyMatrices4([
	quaternion[3], quaternion[2], -quaternion[1], quaternion[0],
	-quaternion[2], quaternion[3], quaternion[0], quaternion[1],
	quaternion[1], -quaternion[0], quaternion[3], quaternion[2],
	-quaternion[0], -quaternion[1], -quaternion[2], quaternion[3],
], [
	quaternion[3], quaternion[2], -quaternion[1], -quaternion[0],
	-quaternion[2], quaternion[3], quaternion[0], -quaternion[1],
	quaternion[1], -quaternion[0], quaternion[3], -quaternion[2],
	quaternion[0], quaternion[1], quaternion[2], quaternion[3],
]);
