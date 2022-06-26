/**
 * Math (c) Kraft
 */
import { EPSILON } from "../core/constants";
/**
 * @description clip two polygons and return their union. this works for non-convex
 * poylgons, but both polygons must have counter-clockwise winding; will not work
 * even if both are similarly-clockwise. Sutherland-Hodgman algorithm.
 * Implementation is from Rosetta Code, refactored to include an epsilon.
 * @attribution https://rosettacode.org/wiki/Sutherland-Hodgman_polygon_clipping#JavaScript
 * @param {number[][]} polygon1 an array of points, where each point is an array of numbers.
 * @param {number[][]} polygon2 an array of points, where each point is an array of numbers.
 * @param {number} [epsilon=1e-6] an optional epsilon
 * @returns {number[][]} a polygon as an array of points.
 */
const clipPolygonPolygon = (polygon1, polygon2, epsilon = EPSILON) => {
	var cp1, cp2, s, e;
	const inside = (p) => {
		// console.log(p, "inside", ((cp2[0] - cp1[0]) * (p[1] - cp1[1]))
		// 	> ((cp2[1] - cp1[1]) * (p[0] - cp1[0])));
		return ((cp2[0] - cp1[0]) * (p[1] - cp1[1]))
			> ((cp2[1] - cp1[1]) * (p[0] - cp1[0]) + epsilon);
	};
	const intersection = () => {
		var dc = [ cp1[0] - cp2[0], cp1[1] - cp2[1] ],
			dp = [ s[0] - e[0], s[1] - e[1] ],
			n1 = cp1[0] * cp2[1] - cp1[1] * cp2[0],
			n2 = s[0] * e[1] - s[1] * e[0], 
			n3 = 1.0 / (dc[0] * dp[1] - dc[1] * dp[0]);
			// console.log("intersection res", [(n1*dp[0] - n2*dc[0]) * n3, (n1*dp[1] - n2*dc[1]) * n3]);
		return [(n1*dp[0] - n2*dc[0]) * n3, (n1*dp[1] - n2*dc[1]) * n3];
	};
	var outputList = polygon1;
	cp1 = polygon2[polygon2.length-1];
	for (var j in polygon2) {
		cp2 = polygon2[j];
		var inputList = outputList;
		outputList = [];
		s = inputList[inputList.length - 1];
		for (var i in inputList) {
			e = inputList[i];
			if (inside(e)) {
				if (!inside(s)) {
					outputList.push(intersection());
				}
				outputList.push(e);
			}
			else if (inside(s)) {
				outputList.push(intersection());
			}
			s = e;
		}
		cp1 = cp2;
	}
	return outputList.length === 0 ? undefined : outputList;
};

export default clipPolygonPolygon;
