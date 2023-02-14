/**
 * Math (c) Kraft
 */
import { EPSILON } from "../general/constants.js";
/**
 * @description clip two polygons and return their union. this works
 * for non-convex poylgons, but both polygons must have counter-clockwise
 * winding; will not work even if both are similarly-clockwise.
 * Sutherland-Hodgman algorithm.
 * Implementation is from Rosetta Code, refactored to incorporate an epsilon
 * to specify inclusivity around the edges.
 * @attribution https://rosettacode.org/wiki/Sutherland-Hodgman_polygon_clipping#JavaScript
 * @param {number[][]} polygon1 an array of points, where each point
 * is an array of numbers.
 * @param {number[][]} polygon2 an array of points, where each point
 * is an array of numbers.
 * @param {number} [epsilon=1e-6] an optional epsilon
 * @returns {number[][]} a polygon as an array of points.
 * @linkcode Math ./src/geometry/clip-polygon-polygon.js 15
 */
const clipPolygonPolygon = (polygon1, polygon2, epsilon = EPSILON) => {
	const inside = (p, cp1, cp2) => (
		(cp2[0] - cp1[0]) * (p[1] - cp1[1])) > ((cp2[1] - cp1[1]) * (p[0] - cp1[0]) + epsilon
	);
	const intersection = (cp1, cp2, e, s) => {
		const dc = [cp1[0] - cp2[0], cp1[1] - cp2[1]];
		const dp = [s[0] - e[0], s[1] - e[1]];
		const n1 = cp1[0] * cp2[1] - cp1[1] * cp2[0];
		const n2 = s[0] * e[1] - s[1] * e[0];
		const n3 = 1.0 / (dc[0] * dp[1] - dc[1] * dp[0]);
		return [(n1 * dp[0] - n2 * dc[0]) * n3, (n1 * dp[1] - n2 * dc[1]) * n3];
	};
	let outputList = polygon1;
	let cp1 = polygon2[polygon2.length - 1];
	for (let j = 0; j < polygon2.length; j += 1) {
		const cp2 = polygon2[j];
		const inputList = outputList;
		outputList = [];
		let s = inputList[inputList.length - 1];
		for (let i = 0; i < inputList.length; i += 1) {
			const e = inputList[i];
			if (inside(e, cp1, cp2)) {
				if (!inside(s, cp1, cp2)) {
					outputList.push(intersection(cp1, cp2, e, s));
				}
				outputList.push(e);
			} else if (inside(s, cp1, cp2)) {
				outputList.push(intersection(cp1, cp2, e, s));
			}
			s = e;
		}
		cp1 = cp2;
	}
	return outputList.length === 0 ? undefined : outputList;
};

export default clipPolygonPolygon;
